import * as THREE from 'three';
import {GLTFLoader} from '../vendor/three/loaders/GLTFLoader.js';
import {clone} from '../vendor/three/utils/SkeletonUtils.js';
import {ASSETS_CONFIG} from '../config/assets.config.js';

const V = (x=0,y=0,z=0)=>new THREE.Vector3(x,y,z);
const validSize = size=>[size.x,size.y,size.z].every(Number.isFinite)&&Math.max(size.x,size.z)>1e-8;
function material(color){return new THREE.MeshStandardMaterial({color,roughness:.86,metalness:.04});}
function mesh(geometry,color,x=0,y=0,z=0){const m=new THREE.Mesh(geometry,material(color));m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;return m;}
function placeholder(id,cfg){
 const g=new THREE.Group(),r=cfg.tileFitRatio*.45;
 if(cfg.category==='enemies'){
  g.add(mesh(new THREE.SphereGeometry(r,9,6),0xa89883,0,r,0));
  g.add(mesh(new THREE.SphereGeometry(r*.52,8,5),0xc7ac8c,r*.6,r*1.2,0));
  for(const z of [-r*.6,r*.6])for(const x of [-r*.5,r*.5])g.add(mesh(new THREE.CylinderGeometry(r*.14,r*.17,r*.65,6),0x61594c,x,r*.325,z));
 }else if(cfg.category==='defenders'){
  g.add(mesh(new THREE.BoxGeometry(r*1.8,r*.28,r*1.8),0x77867c,0,r*.14,0));
  if(['shield','bastion','citadel','furnacewall'].includes(id))g.add(mesh(new THREE.BoxGeometry(r*.45,r*1.5,r*1.65),0x9aab9d,0,r*.9,0));
  else{g.add(mesh(new THREE.CylinderGeometry(r*.38,r*.62,r,8),0x828f85,0,r*.68,0));g.add(mesh(new THREE.BoxGeometry(r*1.7,r*.4,r*.35),cfg.tint??0xcbb17e,r*.15,r*1.32,0));}
 }else if(cfg.category==='environment'&&id.includes('tree')){
  g.add(mesh(new THREE.CylinderGeometry(r*.2,r*.3,r*2,6),0x78634b,0,r,0));
  g.add(mesh(new THREE.ConeGeometry(r,r*3,7),0x416c51,0,r*2.7,0));
 }else g.add(mesh(new THREE.DodecahedronGeometry(r,0),cfg.tint??(cfg.category==='pickups'?0xffcf62:0xb5bca8),0,r,0));
 return g;
}
function ownMaterials(root,cfg){
 root.traverse(n=>{if(!n.isMesh)return;n.castShadow=cfg.castShadow;n.receiveShadow=cfg.receiveShadow;
  const copy=m=>{const c=m.clone();if(c.isMeshStandardMaterial||c.isMeshPhysicalMaterial){c.roughness=Math.max(.68,c.roughness??.8);c.metalness=Math.min(.12,c.metalness??0);}
   if(cfg.tint!=null&&c.color)c.color.lerp(new THREE.Color(cfg.tint),.35);
   c.userData.nwColor=c.color?.clone();c.userData.nwEmissive=c.emissive?.clone();c.userData.nwOpacity=c.opacity;return c;};
  n.material=Array.isArray(n.material)?n.material.map(copy):copy(n.material);
 });
}
function eachMaterial(root,fn){root.traverse(n=>{if(n.isMesh)for(const m of (Array.isArray(n.material)?n.material:[n.material]))fn(m);});}
function disposeOwn(root,geometry=false){root.traverse(n=>{if(!n.isMesh)return;if(geometry)n.geometry?.dispose();for(const m of (Array.isArray(n.material)?n.material:[n.material]))m.dispose();});}
function normalize(scene,cfg){
 const rotated=new THREE.Group();rotated.rotation.y=cfg.rotationOffset;rotated.add(scene);
 rotated.updateMatrixWorld(true);
 const box=new THREE.Box3().setFromObject(rotated,true),size=box.getSize(V());
 if(!validSize(size)||!Number.isFinite(box.min.y))throw Error('empty/invalid model bounds');
 // Reserve animation clearance, not just the rest pose. Y cap controls visual occlusion.
 const clearance=cfg.category==='enemies'?.88:cfg.category==='defenders'?.94:1;
 const factor=Math.min(cfg.tileFitRatio*clearance/Math.max(size.x,size.z),cfg.heightFitRatio/Math.max(size.y,1e-8));
 const center=box.getCenter(V()),normalized=new THREE.Group();rotated.scale.setScalar(factor);
 rotated.position.set(-center.x*factor,-box.min.y*factor,-center.z*factor);normalized.add(rotated);
 normalized.updateMatrixWorld(true);
 const bounds=new THREE.Box3().setFromObject(normalized,true),dims=bounds.getSize(V());
 if(!validSize(dims)||Math.abs(bounds.min.y)>1e-4||Math.max(dims.x,dims.z)>cfg.tileFitRatio+1e-4)throw Error('normalization failed');
 return {root:normalized,bounds,dims,muzzle:V(bounds.max.x*cfg.muzzleOffset.x,bounds.max.y*cfg.muzzleOffset.y,bounds.max.z*cfg.muzzleOffset.z)};
}
export class AssetManager{
 constructor(){this.loader=new GLTFLoader();this.cache=new Map();this.status={};this.errors={};this.queue=[];this.active=0;}
 load(id){
  if(this.cache.has(id))return this.cache.get(id);
  const cfg=ASSETS_CONFIG[id];if(!cfg)return Promise.resolve(null);
  this.status[id]={state:'queued'};
  const p=new Promise(resolve=>{this.queue.push(async()=>{
   this.status[id]={state:'loading'};
   try{
    // A single local fetch allows explicit header validation and bounded transfer time.
    const abort=new AbortController(),timeout=setTimeout(()=>abort.abort(),12000);
    let bytes;try{const r=await fetch(new URL('../'+cfg.modelPath,import.meta.url),{signal:abort.signal});if(!r.ok)throw Error('HTTP '+r.status);bytes=await r.arrayBuffer();}finally{clearTimeout(timeout);}
    const d=new DataView(bytes);if(bytes.byteLength<20||d.getUint32(0,true)!==0x46546c67||d.getUint32(4,true)!==2||d.getUint32(8,true)!==bytes.byteLength)throw Error('invalid GLB header');
    let timer;const gltf=await Promise.race([this.loader.parseAsync(bytes,''),new Promise((_,reject)=>{timer=setTimeout(()=>reject(Error('GLTF parse timeout')),12000);})]).finally(()=>clearTimeout(timer));
    const model=normalize(gltf.scene,cfg);
    this.status[id]={state:'loaded',bytes:bytes.byteLength,dimensions:model.dims.toArray(),bottom:model.bounds.min.y,muzzle:model.muzzle.toArray(),clips:gltf.animations.map(a=>a.name)};
    resolve({model,clips:gltf.animations});
   }catch(e){this.errors[id]=String(e);this.status[id]={state:'fallback',error:String(e)};resolve(null);}
  });});this.cache.set(id,p);this.pump();return p;
 }
 pump(){while(this.active<6&&this.queue.length){this.active++;this.queue.shift()().finally(()=>{this.active--;this.pump();});}}
 preloadAll(){return Promise.all(Object.keys(ASSETS_CONFIG).map(id=>this.load(id)));}
 create(id){
  const cfg=ASSETS_CONFIG[id];if(!cfg)throw Error('unknown visual asset '+id);
  const root=new THREE.Group(),motion=new THREE.Group(),visual=new THREE.Group();root.add(motion);motion.add(visual);
  const initial=placeholder(id,cfg);ownMaterials(initial,cfg);visual.add(initial);
  const handle={id,cfg,root,motion,visual,model:initial,loaded:false,disposed:false,animation:null,hit:0,height:cfg.tileFitRatio,
    muzzle:V(cfg.tileFitRatio*.35,cfg.tileFitRatio*.65,0),death:0,fire:-99,phase:0};
  motion.position.y=cfg.groundOffset;
  handle.ready=this.load(id).then(t=>{
   if(!t||handle.disposed)return handle;
   visual.remove(initial);disposeOwn(initial,true);
   const instance=clone(t.model.root);ownMaterials(instance,cfg);visual.add(instance);handle.model=instance;handle.loaded=true;
   handle.height=t.model.dims.y;handle.muzzle.copy(t.model.muzzle);
   handle.animation=new AnimationController(instance,t.clips,cfg);
   return handle;
  });
  handle.dispose=()=>{if(handle.disposed)return;handle.disposed=true;handle.animation?.dispose();disposeOwn(handle.model,!handle.loaded);root.removeFromParent();};
  handle.flash=(amount)=>{eachMaterial(handle.model,m=>{if(m.emissive&&m.userData.nwEmissive){m.emissive.copy(m.userData.nwEmissive).lerp(new THREE.Color(0xffffff),amount*.8);}else if(m.color&&m.userData.nwColor)m.color.copy(m.userData.nwColor).lerp(new THREE.Color(0xffffff),amount*.8);});};
  handle.fade=(alpha)=>eachMaterial(handle.model,m=>{m.transparent=true;m.opacity=(m.userData.nwOpacity??1)*alpha;m.depthWrite=alpha>.98;});
  return handle;
 }
}
export class AnimationController{
 constructor(model,clips,cfg){this.model=model;this.clips=clips;this.cfg=cfg;this.mixer=new THREE.AnimationMixer(model);this.actions=new Map();this.state='';this.action=null;}
 play(state){
  if(this.state===state)return !!this.action;
  this.state=state;const name=this.cfg.animations[state],clip=name&&this.clips.find(c=>c.name===name);
  if(!clip){if(this.action)this.action.fadeOut(.12);this.action=null;return false;}
  let action=this.actions.get(state);if(!action){action=this.mixer.clipAction(clip);this.actions.set(state,action);}
  if(this.action&&this.action!==action)this.action.fadeOut(.12);
  action.reset();action.enabled=true;action.setEffectiveWeight(1);action.setEffectiveTimeScale(1);
  action.setLoop(state==='die'||state==='attack'?THREE.LoopOnce:THREE.LoopRepeat,state==='die'||state==='attack'?1:Infinity);
  action.clampWhenFinished=state==='die'||state==='attack';action.fadeIn(.12).play();this.action=action;return true;
 }
 update(dt){this.mixer.update(dt);}
 dispose(){this.mixer.stopAllAction();this.mixer.uncacheRoot(this.model);}
}
export {ASSETS_CONFIG};
