'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const files=['engine.js','render.js'].map(name=>fs.readFileSync(path.join(__dirname,name),'utf8'));
const element=()=>({style:{},innerHTML:'',textContent:'',classList:{add(){},remove(){},toggle(){}},setAttribute(){},addEventListener(){},querySelectorAll(){return []}});
let drawCalls=0;const ctx=new Proxy({createLinearGradient(){return{addColorStop(){}}},createRadialGradient(){return{addColorStop(){}}}},{
 get(t,k){return k in t?t[k]:()=>{drawCalls++}},set(t,k,v){t[k]=v;return true}
});
const canvas=element();canvas.getContext=()=>ctx;
const els=new Map(),document={hidden:false,activeElement:{tagName:'BODY'},querySelector(x){if(x==='#battlefield')return canvas;if(!els.has(x))els.set(x,element());return els.get(x)},querySelectorAll(){return []},addEventListener(){}};
const storage={m:new Map(),getItem(k){return this.m.get(k)||null},setItem(k,v){this.m.set(k,v)}};
const g=new Function('document','window','localStorage','requestAnimationFrame','cancelAnimationFrame','setTimeout','clearTimeout',
 files.join('\n')+'\nreturn window.__nightwatch')(document,{},storage,()=>1,()=>{},()=>1,()=>{});
const expect=(condition,msg)=>assert(condition,msg);
expect(Object.keys(g.data.monsters).length===8,'8 monster types expected');
expect(g.data.recipes.length===15,'15 crafting recipes expected');
g.draw();expect(drawCalls>100,'canvas not painting');
let recipePass=0;
for(let i=0;i<g.data.recipes.length;i++){
 const [a,b,out,cost]=g.data.recipes[i];
 g.reset();const s=g.state;s.gold=200;s.items=[{id:10001,type:a,x:0,y:0,rot:0},{id:10002,type:b,x:null,y:null,rot:0}];
 g.chooseMaterial(10001);g.chooseMaterial(10002);g.craft();
 expect(s.items.length===1&&s.items[0].type===out,'invalid recipe '+a+' + '+b);
 expect(s.gold===200-cost,'craft coin deduction broken');recipePass++;
}
g.reset();g.state.gold=0;g.state.items=[{id:10001,type:'bow',x:0,y:0,rot:0},{id:10002,type:'bow',x:null,y:null,rot:0}];
g.chooseMaterial(10001);g.chooseMaterial(10002);g.craft();expect(g.state.items.length===2,'craft must not consume when lacking coins');
g.reset();g.setSeed(42);g.startWave();expect(g.state.phase==='battle','battle did not start');
g.step(.75);expect(g.state.monsters.length>0,'no monsters spawned');
const startX=g.state.monsters[0].x;g.state.turrets=[];g.step(.55);
expect(g.state.monsters[0].x<startX,'monster is not advancing toward gate');
g.draw();let i=0;while(g.state.phase==='battle'&&i++<2000)g.step(.05);
expect(g.state.phase==='reward','first wave failed to resolve');
expect(g.state.discovered.has('rat'),'codex did not record real encounter');
const oldWave=g.state.wave;g.reward('staff');expect(g.state.wave===oldWave+1&&g.state.phase==='prepare','reward transition failed');
const first='bow';g.reset();g.setSeed(712);g.startWave();g.state.turrets=[];i=0;while(g.state.phase==='battle'&&i++<2000)g.step(.06);
expect(g.state.gate<g.state.maxGate,'leaks did not harm gate');
const boss=g.makeWave(5);expect(boss.some(x=>x.type==='boss'&&x.lane===1),'boss must spawn every fifth wave');
const build=g.build();expect(build.weapons.length===2,'starting weapons mismatch');
function play(seed,active){
 g.reset();g.setSeed(seed);let cleared=0;
 for(let n=0;n<10;n++){
 if(active){
 for(const it of g.state.items){if(it.x!==null||it.type!=='staff')continue;
 let placed=false;for(let y=0;y<4&&!placed;y++)for(let x=0;x<5&&!placed;x++)placed=g.equipById(it.id,x,y)}
 }
 g.startWave();let ct=0;while(g.state.phase==='battle'&&ct++<2500)g.step(.05);
 if(g.state.phase==='gameover')break;
 expect(g.state.phase==='reward','wave stalled');cleared++;g.reward(active?'staff':'whet')
 }return cleared
}
let base=0,active=0;
for(let seed=1;seed<=10;seed++){base+=play(seed*719+33,false);active+=play(seed*719+33,true)}
expect(active>base+10,'reward equipment must meaningfully extend survival');
console.log('PASS: '+recipePass+' synthesized recipes; coin safety; animated field; reward & codex; boss scheduling; turret attacks.');
console.log('BALANCE: baseline average '+(base/10).toFixed(1)+' waves; actively adding weapons '+(active/10).toFixed(1)+' waves over 10 seeds.');
console.log('BOUNDARY: real browser visual checks and human replay desire require separate validation.');
