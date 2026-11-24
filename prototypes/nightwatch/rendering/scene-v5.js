import * as THREE from 'three';
import {AssetManager,ASSETS_CONFIG} from './AssetManager.js';

const TILE=65,GATE=181,LANE0=209,WIDTH=1080,HEIGHT=480;
const vec=(x=0,y=0,z=0)=>new THREE.Vector3(x,y,z);
const gridX=x=>(x-GATE)/TILE;
const gridZ=y=>(y-LANE0)/TILE-1;
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const lerp=(a,b,t)=>a+(b-a)*t;
function start(){
 const game=window.__nightwatch;
 if(!game||!game.state)return;
 const overlay=document.getElementById('battlefield'),ctx=overlay.getContext('2d'),parent=overlay.parentElement,oldDraw=window.drawScene;
 let renderer;
 try{renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,powerPreference:'high-performance'});}catch(e){game.renderMode='canvas-fallback';game.renderError=String(e);return;}
 renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.5));renderer.setSize(WIDTH,HEIGHT,false);
 renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
 renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.2;
 renderer.domElement.className='nw-webgl';renderer.domElement.setAttribute('aria-hidden','true');
 parent.insertBefore(renderer.domElement,overlay);overlay.classList.add('nw-overlay');
 const scene=new THREE.Scene();scene.background=new THREE.Color(0x263d43);scene.fog=new THREE.Fog(0x263d43,18,34);
 const camera=new THREE.OrthographicCamera(-8.4,8.4,3.733,-3.733,.1,100);
 camera.position.set(6.25,12,15);camera.lookAt(6.25,.25,0);
 const hemi=new THREE.HemisphereLight(0xd6e7ff,0x48543d,2.1);scene.add(hemi);
 const sun=new THREE.DirectionalLight(0xffdfb8,2.8);sun.position.set(-3,11,7);sun.target.position.set(5,0,0);sun.castShadow=true;
 sun.shadow.mapSize.set(2048,2048);sun.shadow.camera.left=-12;sun.shadow.camera.right=12;sun.shadow.camera.top=9;sun.shadow.camera.bottom=-9;sun.shadow.camera.near=.5;sun.shadow.camera.far=32;sun.shadow.bias=-.0002;sun.shadow.normalBias=.035;sun.shadow.radius=3;scene.add(sun,sun.target);
 const rim=new THREE.DirectionalLight(0x8db9ff,.8);rim.position.set(8,4,-8);scene.add(rim);
 const assets=new AssetManager();
 const geometry=new THREE.BoxGeometry(1,.12,1);
 const materials=[0x55764e,0x648557].map(color=>new THREE.MeshStandardMaterial({color,roughness:1,metalness:0}));
 const tileGroup=new THREE.Group();scene.add(tileGroup);
 for(let row=0;row<3;row++)for(let col=0;col<14;col++){const m=new THREE.Mesh(geometry,materials[(row+col)%2]);m.position.set(col+.5,-.065,row-1);m.receiveShadow=true;tileGroup.add(m);}
 const base=new THREE.Mesh(new THREE.BoxGeometry(18,.5,7.7),new THREE.MeshStandardMaterial({color:0x3a5344,roughness:1}));base.position.set(5.8,-.32,0);base.receiveShadow=true;scene.add(base);
 const edge=new THREE.Mesh(new THREE.BoxGeometry(18,.16,7.7),new THREE.MeshStandardMaterial({color:0x34453e,roughness:.95}));edge.position.set(5.8,-.63,0);scene.add(edge);
 const decor=[];
 function place(id,x,z,angle=0,scale=1){const h=assets.create(id);h.root.position.set(x,0,z);h.root.rotation.y=angle;h.root.scale.setScalar(scale);scene.add(h.root);decor.push(h);return h;}
 place('castle_gate',-1.30,0,0,1.07);
 place('watchtower',-1.45,-2.08,0,1.2);place('watchtower',-1.45,2.08,Math.PI,1.2);
 place('castle_wall',-1.63,-1.56,0,1.2);place('castle_wall',-1.63,1.56,0,1.2);
 place('torch',-.60,-1.78,0,1);place('torch',-.60,1.78,0,1);
 place('banner',-1.32,-1.24,0,1.1);
 place('ruins',11.8,-4.2,.4,1);place('mountain',9,-7.8,0,1.6);place('mountain',2,-8.5,.7,1.5);
 for(let i=0;i<12;i++){const x=-.4+i*1.24,z=-2.8-(i%3)*.42;place(i%4===0?'dead_tree':i%2?'pine_tree_a':'pine_tree_b',x,z,i*1.7,.87+(i%3)*.16);}
 for(let i=0;i<10;i++){const x=-.5+i*1.42,z=2.3+(i%2)*.55;place(i%3===0?'rock_a':i%3===1?'bush':'rock_b',x,z,i*2.1,.85);place('grass_clump',x+.36,z-.23,i*.9);}
 const debugGroup=new THREE.Group();scene.add(debugGroup);debugGroup.visible=false;
 const gridLines=[];for(let x=0;x<=14;x++)gridLines.push(x,.012,-1.5,x,.012,1.5);
 for(let z=-1.5;z<=1.51;z+=1)gridLines.push(0,.012,z,14,.012,z);
 const debugGrid=new THREE.LineSegments(new THREE.BufferGeometry().setAttribute('position',new THREE.Float32BufferAttribute(gridLines,3)),new THREE.LineBasicMaterial({color:0xbfeedd}));debugGroup.add(debugGrid);
 const debugPanel=document.createElement('div');debugPanel.className='nw-debug';debugPanel.hidden=true;parent.appendChild(debugPanel);
 const debugEntities=new Map();
 function makeDebug(key,handle,kind,radius){
  const g=new THREE.Group(),point=new THREE.Mesh(new THREE.SphereGeometry(.055,9,6),new THREE.MeshBasicMaterial({color:0xff3434,depthTest:false}));point.renderOrder=99;
  const arrow=new THREE.ArrowHelper(vec(1,0,0),vec(),.62,0x66bdff,.18,.10);g.add(arrow);
  const lines=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(1,1,1)),new THREE.LineBasicMaterial({color:0x81e7fc,depthTest:false}));g.add(lines);
  if(kind==='gun')g.add(point);
  let collider;if(kind==='enemy'){collider=new THREE.Mesh(new THREE.CylinderGeometry(radius,radius,.035,24),new THREE.MeshBasicMaterial({color:0xffdd49,wireframe:true,depthTest:false}));g.add(collider);}
  debugGroup.add(g);debugEntities.set(key,{g,point,lines,arrow,collider,handle,kind});
 }
 function syncDebug(key,h,kind,radius=0){
  if(!debugGroup.visible)return;
  if(!debugEntities.has(key))makeDebug(key,h,kind,radius);
  const d=debugEntities.get(key);d.g.position.copy(h.root.position);d.g.rotation.y=h.root.rotation.y;
  const info=assets.status[h.id],dims=info?.dimensions||[h.cfg.tileFitRatio,h.height,h.cfg.tileFitRatio];
  d.lines.scale.set(...dims);d.lines.position.set(0,h.cfg.groundOffset+dims[1]/2,0);
  h.motion.updateWorldMatrix(true,false);const p=h.motion.localToWorld(h.muzzle.clone());d.g.worldToLocal(p);d.point.position.copy(p);
  if(d.collider)d.collider.position.y=.025;
 }
 function clearDebug(key){const d=debugEntities.get(key);if(!d)return;d.g.removeFromParent();d.g.traverse(n=>{if(n.isMesh||n.isLine){n.geometry?.dispose();n.material?.dispose();}});debugEntities.delete(key);}
 const guns=new Map(),enemies=new Map(),shots=new Map(),dying=[],coins=[];
 let lastState=null,lastT=null,sceneFailed=false,frameMs=16.67;
 const shotType=p=>p.sourceType==='apocalypse'?'meteor':p.sourceType==='thunderfire'||p.sourceType==='storm'?'thunder_orb':p.poison?'poison_orb':p.slow?'ice_shard':p.burn?'fire_bolt':p.element==='magic'?'arcane_orb':p.sourceType==='repeater'?'bolt':'arrow';
 function createActor(type,map,key,kind){const h=assets.create(type);scene.add(h.root);h.kind=kind;h.lastFire=-1;h.lastPulse=0;h.spawned=true;map.set(key,h);return h;}
 function disposeActor(map,key){const h=map.get(key);h?.dispose();map.delete(key);clearDebug(key);}
 function resetActors(){for(const [k] of guns)disposeActor(guns,k);for(const [k] of enemies)disposeActor(enemies,k);for(const h of shots.values())h.dispose();shots.clear();for(const h of dying)h.dispose();dying.length=0;for(const h of coins)h.dispose();coins.length=0;}
 function actors(s,t,dt){
  const equipped=s.items.filter(x=>x.x!==null);
  const ws=s.phase==='battle'||s.phase==='reward'||s.phase==='gameover'?s.turrets:game.build().weapons;
  const liveGunIds=new Set();const display=ws.map((w,i)=>({id:w.itemId,type:w.type,w,i,wall:false}));
  // Existing shields still contribute global gate reduction, not a fabricated collision body.
  for(const it of equipped.filter(x=>['shield','bastion','citadel'].includes(x.type)))display.push({id:it.id,type:it.type,w:null,i:display.length,wall:true});
  for(const d of display){const key='g'+d.id;liveGunIds.add(key);let h=guns.get(key);if(h&&h.id!==d.type){disposeActor(guns,key);h=null;}if(!h)h=createActor(d.type,guns,key,'gun');
   const row=d.i%3,col=Math.floor(d.i/3);h.root.position.set(.38+col*.92,0,row-1);h.root.rotation.y=0;
   if(d.w&&d.w.fireCount!==undefined&&h.lastFire!==d.w.fireCount){if(h.lastFire>=0&&d.w.fireCount>h.lastFire)h.fire=t;h.lastFire=d.w.fireCount;}
   const f=t-h.fire,attacking=f>=0&&f<.28;const native=h.animation?.play(attacking?'attack':'idle');h.animation?.update(dt);
   h.motion.position.set(0,h.cfg.groundOffset,0);h.motion.rotation.set(0,0,0);h.motion.scale.set(1,1,1);
   if(!native){const breathe=1+.016*Math.sin(t*2.7+d.i);h.motion.scale.set(1,breathe,1);
    if(attacking){const k=f/.28,burst=Math.sin(k*Math.PI);h.motion.position.x=.095*burst-.025*Math.sin(k*2*Math.PI);h.motion.scale.set(1+.045*burst,1-.10*burst,1+.025*burst);}}
   syncDebug(key,h,'gun');
  }
  for(const [key] of guns)if(!liveGunIds.has(key))disposeActor(guns,key);
  const liveEnemies=new Set();
  for(const m of s.monsters){const key='e'+m.id;liveEnemies.add(key);let h=enemies.get(key);if(!h){h=createActor(m.type,enemies,key,'enemy');h.entity=m;h.lastHeal=m.healCd;h.hit=0;}
   h.entity=m;h.root.position.set(gridX(m.x),0,gridZ(m.y));h.root.rotation.y=Math.PI;
   if((m.hitPulse||0)>(h.lastPulse||0)+.015)h.hit=.1;h.lastPulse=m.hitPulse||0;
   h.hit=Math.max(0,h.hit-dt);h.flash(h.hit>0?1:0);
   if(m.type==='mage'&&m.healCd>h.lastHeal+.5)h.fire=t;h.lastHeal=m.healCd;
   const attack=t-h.fire<.45;let native=h.animation?.play(attack?'attack':'walk');
   if(!native&&['bat','boss'].includes(m.type))h.animation?.play('idle');
   h.animation?.update(dt);
   h.motion.position.set(0,h.cfg.groundOffset,0);h.motion.rotation.set(0,0,0);h.motion.scale.set(1,1,1);
   if(!native){const q=t*(m.speed/TILE*5+3)+(m.bodyTime||0);h.motion.position.y+=Math.abs(Math.sin(q))*.035;h.motion.rotation.x=Math.sin(q)*.055;h.motion.rotation.z=Math.sin(q)*.035;if(attack)h.motion.position.x=.08*Math.sin(Math.PI*clamp((t-h.fire)/.45,0,1));}
   if(h.hit>0)h.motion.position.z+=Math.sin(t*90)*.025;
   syncDebug(key,h,'enemy',m.r*.5/TILE);
  }
  for(const [key,h] of enemies)if(!liveEnemies.has(key)){
   enemies.delete(key);clearDebug(key);if(h.entity?.hp<=0){h.death=t;h.animation?.play('die');dying.push(h);const coin=assets.create('gold_coin');coin.root.position.copy(h.root.position);coin.origin=h.root.position.clone();coin.born=t;scene.add(coin.root);coins.push(coin);}else h.dispose();
  }
  for(let i=dying.length-1;i>=0;i--){const h=dying[i],f=(t-h.death)/.7;if(f>=1){h.dispose();dying.splice(i,1);continue;}
   const native=h.animation?.play('die');h.animation?.update(dt);if(!native){h.motion.rotation.z=-Math.PI*.5*f;h.motion.scale.setScalar(1-.65*f);}h.fade(1-f);}
  for(let i=coins.length-1;i>=0;i--){const h=coins[i],f=(t-h.born)/.82;if(f>=1){h.dispose();coins.splice(i,1);continue;}
   const k=clamp((f-.32)/.68,0,1);h.root.position.copy(h.origin).lerp(vec(-.7,.5,-1.7),k*k);h.root.position.y+=Math.sin(Math.PI*clamp(f/.32,0,1))*.46+.10;h.root.rotation.y=t*9;h.root.scale.setScalar(1-k*.45);}
  const liveShots=new Set(s.shots);
  for(const p of s.shots){let h=shots.get(p);if(!h){h=createActor(shotType(p),shots,p,'shot');const source=guns.get('g'+p.sourceId);if(source){source.motion.updateWorldMatrix(true,false);h.launch=source.motion.localToWorld(source.muzzle.clone());}else h.launch=vec(gridX(p.originX??p.x),.5,gridZ(p.originY??p.y));}
   const target=enemies.get('e'+p.target),dest=target?target.root.position.clone().add(vec(0,target.cfg.groundOffset+target.height*.52,0)):vec(gridX(p.targetX),.35,gridZ(p.targetY));
   const dx=p.targetX-(p.originX??p.x),dy=p.targetY-(p.originY??p.y),len=Math.hypot(dx,dy)||1;
   const k=clamp(1-Math.hypot(p.targetX-p.x,p.targetY-p.y)/len,0,1);h.root.position.copy(h.launch).lerp(dest,k);
   h.root.position.y+=Math.sin(k*Math.PI)*.055;
   const direction=dest.sub(h.root.position);if(direction.lengthSq()>1e-8)h.root.quaternion.setFromUnitVectors(vec(1,0,0),direction.normalize());
  }
  for(const [p,h] of shots)if(!liveShots.has(p)){h.dispose();shots.delete(p);}
 }
 function project(p){const q=p.clone().project(camera);return[(q.x*.5+.5)*WIDTH,(.5-q.y*.5)*HEIGHT];}
 function drawHud(s,t){
  ctx.clearRect(0,0,WIDTH,HEIGHT);
  for(const h of enemies.values()){const m=h.entity;if(m.hp>=m.maxHp&&m.type!=='boss')continue;const [x,y]=project(h.root.position.clone().add(vec(0,h.height+h.cfg.groundOffset+.13,0))),w=m.type==='boss'?65:29;ctx.fillStyle='#1b302d';ctx.fillRect(x-w/2-1,y-1,w+2,6);ctx.fillStyle='#613c43';ctx.fillRect(x-w/2,y,w,4);ctx.fillStyle=m.type==='boss'?'#e5c17e':'#a9d391';ctx.fillRect(x-w/2,y,w*clamp(m.hp/m.maxHp,0,1),4);}
  for(const p of s.particles){const [x,y]=project(vec(gridX(p.x),.42,gridZ(p.y)));ctx.globalAlpha=clamp(p.life/p.total,0,1);ctx.fillStyle=p.color;if(p.text){ctx.font='bold 13px Georgia,serif';ctx.textAlign='center';ctx.fillText(p.text,x,y);}else{ctx.beginPath();ctx.arc(x,y,Math.max(1,p.size*.6),0,Math.PI*2);ctx.fill();}ctx.globalAlpha=1;}
  for(const b of s.bursts){const [x,y]=project(vec(gridX(b.x),.25,gridZ(b.y)));ctx.globalAlpha=clamp(b.life/b.max,0,1)*.7;ctx.strokeStyle=b.color;ctx.lineWidth=1.5;ctx.beginPath();ctx.ellipse(x,y,Math.max(2,b.r*.85),Math.max(1,b.r*.30),0,0,Math.PI*2);ctx.stroke();ctx.globalAlpha=1;}
  if(s.phase==='prepare'){ctx.fillStyle='#f2dfb9';ctx.textAlign='center';ctx.font='600 23px Georgia,serif';ctx.fillText('THE LAST WATCH',WIDTH/2,48);ctx.font='10px Georgia,serif';ctx.fillText('THE KINGDOM SLEEPS. THE GATE REMAINS.',WIDTH/2,66);}
  if(s.phase==='battle'&&typeof gamePaused!=='undefined'&&gamePaused){ctx.fillStyle='#0b1b20a8';ctx.fillRect(0,0,WIDTH,HEIGHT);ctx.fillStyle='#e8d6b0';ctx.textAlign='center';ctx.font='600 34px Georgia,serif';ctx.fillText('PAUSED',WIDTH/2,HEIGHT/2);}
  if(s.gateFlash>0){ctx.fillStyle='rgba(207,81,67,'+Math.min(.16,s.gateFlash*.25)+')';ctx.fillRect(0,0,WIDTH,HEIGHT);}
 }
 function fallback(e){if(sceneFailed)return;sceneFailed=true;game.renderMode='canvas-fallback';game.renderError=String(e);renderer.domElement.remove();overlay.classList.remove('nw-overlay');debugPanel.remove();window.drawScene=oldDraw;game.draw=()=>oldDraw(performance.now()/1000);if(oldDraw)oldDraw(performance.now()/1000);}
 renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();fallback('WebGL context lost');});
 function paint(t){if(sceneFailed)return;try{const s=game.state;if(!s)return;if(lastState!==s){resetActors();lastState=s;lastT=t;}
   const elapsed=lastT==null?.016:clamp(t-lastT,0,.06);lastT=t;const paused=s.phase==='battle'&&typeof gamePaused!=='undefined'&&gamePaused;const dt=paused?0:elapsed;frameMs=lerp(frameMs,Math.max(1,elapsed*1000),.05);
   actors(s,t,dt);renderer.render(scene,camera);drawHud(s,t);
   if(debugGroup.visible){const status=Object.values(assets.status);debugPanel.textContent='F2  ASSETS / V4 LOGIC\n'+Math.round(1000/frameMs)+' fps | '+renderer.info.render.calls+' draws\n'+status.filter(x=>x.state==='loaded').length+' / '+Object.keys(ASSETS_CONFIG).length+' loaded\n'+status.filter(x=>x.state==='fallback').length+' fallback\nCyan: model bounds | red: muzzle\nYellow: legacy hit radius | blue: +X facing';}
  }catch(e){fallback(e);}}
 game.renderMode='three';game.assets={status:assets.status,errors:assets.errors,preload:()=>assets.preloadAll(),config:ASSETS_CONFIG,debug:()=>debugGroup.visible,
  snapshot:()=>({mode:game.renderMode,errors:{...assets.errors},status:{...assets.status},guns:[...guns.values()].map(h=>({id:h.id,loaded:h.loaded,position:h.root.position.toArray(),muzzle:h.motion.localToWorld(h.muzzle.clone()).toArray()})),enemies:[...enemies.values()].map(h=>({id:h.id,loaded:h.loaded,state:h.animation?.state,rotation:h.root.rotation.y})),drawCalls:renderer.info.render.calls})};
 document.addEventListener('keydown',e=>{if(e.key!=='F2'||sceneFailed)return;e.preventDefault();debugGroup.visible=!debugGroup.visible;debugPanel.hidden=!debugGroup.visible;if(!debugGroup.visible)for(const key of [...debugEntities.keys()])clearDebug(key);});
 window.drawScene=paint;game.draw=()=>paint(lastT??0);paint(0);
 // Explicit full-inventory preflight available for the browser regression; ordinary gameplay loads on demand.
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
