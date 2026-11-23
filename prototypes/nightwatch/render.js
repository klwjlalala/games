/* Canvas battlefield painter and real-time runtime loop. */
'use strict';
const CC={sky:'#0b1830',lane:'#304657',line:'#84c9bd',arrow:'#f7d398',magic:'#b8a1ff',fire:'#ffa46c',cold:'#9ce8f8'};
let hudTick=0;
function polygon(points,fill,stroke='',lineWidth=1){ctx.beginPath();ctx.moveTo(points[0][0],points[0][1]);for(let i=1;i<points.length;i++)ctx.lineTo(points[i][0],points[i][1]);ctx.closePath();ctx.fillStyle=fill;ctx.fill();if(stroke){ctx.lineWidth=lineWidth;ctx.strokeStyle=stroke;ctx.stroke()}}
function ellipse(x,y,rx,ry,color){ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,TAU);ctx.fillStyle=color;ctx.fill()}
function roundedRect(x,y,w,h,r,color){ctx.fillStyle=color;ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.fill()}
function drawBackground(t){
 const bg=ctx.createLinearGradient(0,0,0,H);bg.addColorStop(0,'#0a1427');bg.addColorStop(.50,'#20364a');bg.addColorStop(.7,'#182c3e');bg.addColorStop(1,'#0c1b29');ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);
 const moonAlpha=.48+.07*Math.sin(t*.2);const mg=ctx.createRadialGradient(797,68,6,797,68,118);mg.addColorStop(0,'rgba(167,223,217,'+moonAlpha+')');mg.addColorStop(.34,'rgba(137,194,209,.16)');mg.addColorStop(1,'rgba(127,186,200,0)');ctx.fillStyle=mg;ctx.fillRect(675,-53,243,243);
 ellipse(800,67,31,31,'#c2ded8');ellipse(786,60,25,28,'#d4ebe4');
 for(const st of stars){ctx.globalAlpha=st.a*(.75+Math.sin(t*1.1+st.x)*.25);ellipse(st.x,st.y,st.r,st.r,'#c9f2ee')}ctx.globalAlpha=1;
 const mountain=(y,color,freq,amp)=>{ctx.beginPath();ctx.moveTo(0,H);ctx.lineTo(0,y);for(let x=0;x<=W;x+=22){const sy=y+Math.sin(x*.011+freq)*amp+Math.sin(x*.026+freq*2)*amp*.45;ctx.lineTo(x,sy)}ctx.lineTo(W,H);ctx.closePath();ctx.fillStyle=color;ctx.fill()};
 mountain(174,'#1d3342',1.6,31);mountain(191,'#213748',3.2,22);mountain(199,'#213944',6.4,15);
 for(let i=0;i<25;i++){const x=200+i*43,y=195+(i%4)*4,r=11+(i*9)%15;polygon([[x-r,y+12],[x,y-r-10],[x+r,y+12]],'#132d35');ctx.fillStyle='#173744';ctx.fillRect(x-3,y,6,17)}
 const fog=ctx.createLinearGradient(0,167,0,230);fog.addColorStop(0,'#9ed4b20c');fog.addColorStop(1,'#c0f0c500');ctx.fillStyle=fog;ctx.fillRect(0,165,W,65);
 for(let lane=0;lane<3;lane++){
  const y=LANES[lane],top=y-30,bottom=y+23;
  const stripe=ctx.createLinearGradient(0,top,0,bottom);stripe.addColorStop(0,lane%2?'#253a46':'#223640');stripe.addColorStop(.72,'#243f46');stripe.addColorStop(1,'#132732');roundedRect(161,top,W-176,53,8,stripe);
  ctx.strokeStyle='#789a9c3a';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(184,top+4);ctx.lineTo(1059,top+4);ctx.stroke();
  ctx.setLineDash([16,15]);ctx.lineWidth=1;ctx.strokeStyle='#85aea748';ctx.beginPath();ctx.moveTo(192,bottom-7);ctx.lineTo(1050,bottom-7);ctx.stroke();ctx.setLineDash([]);
  for(let x=235;x<W;x+=91){ellipse(x,y+20,4,2,'#0c2d33')}
 }
 for(let i=0;i<3;i++){const y=LANES[i];const glow=ctx.createRadialGradient(1059,y,2,1059,y,65);glow.addColorStop(0,'#bd76d93a');glow.addColorStop(1,'#a663ce00');ctx.fillStyle=glow;ctx.fillRect(990,y-65,90,130);ctx.lineWidth=1.8;ctx.strokeStyle='#b786d34f';ctx.beginPath();ctx.ellipse(1060,y,15,30,0,0,TAU);ctx.stroke()}
 // Foreground grass
 for(let x=185;x<W;x+=19){const off=(x*7)%8;ctx.strokeStyle=x%3===0?'#2e584b':'#274951';ctx.lineWidth=1.1;ctx.beginPath();ctx.moveTo(x,372);ctx.lineTo(x-4,363-off);ctx.moveTo(x,372);ctx.lineTo(x+3,362-off);ctx.stroke()}
}
function drawGate(t){
 ctx.save();
 const shake=s.gateFlash>0?(Math.random()-.5)*s.gateFlash*8:0;ctx.translate(shake,0);
 const halo=ctx.createRadialGradient(114,256,20,114,256,130);halo.addColorStop(0,'#59c4ad30');halo.addColorStop(1,'#59c4ad00');ctx.fillStyle=halo;ctx.fillRect(0,123,240,252);
 ellipse(91,365,101,15,'#050c16ab');
 roundedRect(26,155,137,221,14,'#162737');
 roundedRect(37,161,121,203,12,'#415563');
 roundedRect(48,170,102,191,9,'#172b3a');
 for(let y=174;y<358;y+=28){ctx.strokeStyle='#607d86';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(38,y);ctx.lineTo(155,y);ctx.stroke()}
 for(let y=190;y<352;y+=56){ctx.strokeStyle='#273a4d';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(98,y-20);ctx.lineTo(98,y+7);ctx.stroke()}
 roundedRect(59,186,79,171,8,'#112b38');
 for(let i=0;i<5;i++){const y=202+i*29;ctx.strokeStyle='#4d6e75';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(60,y);ctx.lineTo(136,y);ctx.stroke()}
 roundedRect(93,179,12,187,4,'#647e7f');
 roundedRect(31,139,127,20,7,'#6c8f91');
 roundedRect(25,138,15,230,5,'#617982');roundedRect(151,138,15,230,5,'#617982');
 // glowing crest
 const shimmer=.65+.2*Math.sin(t*2.2);ctx.globalAlpha=shimmer;ellipse(96,159,12,12,'#6de0c5');ctx.globalAlpha=1;
 ctx.font='bold 13px system-ui';ctx.textAlign='center';ctx.fillStyle='#142c32';ctx.fillText('✦',96,164);
 polygon([[102,183],[124,190],[124,229],[102,216]],'#6b3c48','#ac6470',1);
 ctx.fillStyle='#ffdfaf';ctx.font='bold 9px system-ui';ctx.fillText('守',113,207);
 ctx.restore();
}
function drawTurrets(t){
 const eq=s.turrets.length?s.turrets:calculate().weapons.map((w,i)=>({...w,lane:i%3,y:LANES[i%3]-(Math.floor(i/3)*17-8)}));
 const sorted=eq.slice().sort((a,b)=>a.y-b.y);
 for(const w of sorted){
  const x=183+(w.lane%3)*8,y=w.y+5;
  ctx.save();ctx.translate(x,y);
  ellipse(-4,24,32,6,'#0007');
  polygon([[-24,19],[-18,-6],[-8,-21],[9,-19],[22,-3],[28,19]],'#536878','#293d4d',3);
  polygon([[-19,7],[-8,-13],[7,-13],[19,7]],w.element==='magic'?'#6a5b99':'#6b6759');
  roundedRect(-17,11,35,11,4,'#2b4154');
  ctx.lineWidth=5;ctx.lineCap='round';ctx.strokeStyle='#c8d6df';ctx.beginPath();ctx.moveTo(5,-4);ctx.lineTo(33,-15);ctx.stroke();
  const energy=w.element==='magic'?'#c5a5fb':w.burn?'#f6aa7a':w.slow?'#80dbe9':'#e4dcae';
  ellipse(5,-7,7,7,energy);ellipse(32,-15,4,4,energy);
  ctx.font='15px system-ui';ctx.textAlign='center';ctx.fillStyle='#d9f4ed';ctx.fillText(w.icon,0,8);
  ctx.restore();
 }
}
function drawMonster(m,t){
 const d=MONSTERS[m.type],r=m.r,bob=Math.sin(t*5+m.bodyTime)*2.4,pct=clamp(m.hp/m.maxHp,0,1),x=m.x,y=m.y+bob;
 ctx.save();ctx.translate(x,y);
 ellipse(0,r*.92,r*1.1,6,'#07151aa8');
 if(m.type==='rat'){
  ctx.lineWidth=4;ctx.strokeStyle='#b2786c';ctx.beginPath();ctx.moveTo(16,5);ctx.bezierCurveTo(35,-12,50,16,58,1);ctx.stroke();
  ellipse(0,0,24,13,'#a27d6b');ellipse(-16,-11,9,11,'#c99989');ellipse(-8,-6,6,7,'#e1b3a3');
  polygon([[-28,-7],[-22,8],[-41,5]],'#8d685f');ellipse(-20,-2,2.8,2.8,'#ff5f6a');ellipse(-38,5,2,2,'#e4c3ad');
 }else if(m.type==='bat'){
  const f=Math.sin(t*12+m.bodyTime)*12;polygon([[-3,-4],[-15,-19-f],[-32,-4-f],[-41,-13-f],[-39,15-f],[-16,11],[0,8]],'#6b547e','#9b77a7',1);
  polygon([[1,3],[18,11],[41,15-f],[37,-13-f],[31,-4-f],[15,-19-f]],'#6b547e','#9b77a7',1);
  ellipse(0,-4,12,17,'#4a395f');polygon([[-13,-17],[-5,-27],[-1,-15]],'#57476a');polygon([[1,-15],[7,-27],[13,-16]],'#57476a');
  ellipse(-5,-6,3,3,'#f48b9e');ellipse(5,-6,3,3,'#f48b9e');
 }else if(m.type==='shell'){
  ellipse(0,3,29,15,'#5a5a4a');for(const dx of [-18,18]){ellipse(dx,15,10,5,'#6c7b62')}
  ellipse(0,-5,26,21,'#4c7064');polygon([[-20,-8],[-8,-23],[9,-23],[21,-8],[11,10],[-11,10]],'#637c70','#9ab09c',2);
  ctx.strokeStyle='#a7b7a1';ctx.lineWidth=2;for(let i=0;i<5;i++){ctx.beginPath();ctx.moveTo((i-2)*9,-17);ctx.lineTo((i-2)*9,8);ctx.stroke()}
  ellipse(-25,1,10,10,'#718371');ellipse(-31,-1,3,3,'#fb9c80');
 }else if(m.type==='wolf'){
  polygon([[-29,9],[-20,-15],[-8,-20],[10,-13],[25,0],[21,14],[-18,16]],'#756f72','#9b9191',1);
  polygon([[-30,-9],[-32,-30],[-18,-19]],'#a3989b');polygon([[-15,-20],[-9,-34],[0,-17]],'#90858b');
  polygon([[-27,3],[-42,11],[-22,15]],'#b8aba7');
  ellipse(-23,-8,3.7,3.7,'#fd9b65');ellipse(-32,1,4,3,'#332f38');
  const leg=Math.sin(t*11+m.bodyTime)*4;for(const xx of [-14,12]){roundedRect(xx,12+leg*(xx<0?1:-1),6,13,2,'#595963')}
 }else if(m.type==='mage'){
  ellipse(0,0,24,26,'#513f6d');polygon([[-25,17],[-13,-8],[4,-14],[24,18]],'#46345f','#a18ab1',1);
  polygon([[-17,-14],[0,-40],[16,-14]],'#7b6897');polygon([[-23,-15],[23,-15],[14,-10],[-17,-10]],'#382d53');
  ellipse(-7,-6,3,2,'#81ecbf');ellipse(7,-6,3,2,'#81ecbf');
  ctx.strokeStyle='#b79f6b';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(20,-25);ctx.lineTo(27,23);ctx.stroke();
  ellipse(19,-30,7,7,'#89c4bd');
 }else if(m.type==='wisp'){
  const flare=Math.sin(t*4+m.bodyTime)*5;polygon([[0,-38-flare],[17,-14],[23,3],[11,21],[0,14],[-11,23],[-24,5],[-14,-14]],'#9bcdd4','#ddeff5',1);
  polygon([[0,-27-flare],[12,-11],[13,5],[0,11],[-13,4],[-13,-11]],'#6a9fb6');
  ellipse(-6,-4,3.3,3.3,'#273755');ellipse(6,-4,3.3,3.3,'#273755');
 }else if(m.type==='brute'){
  ellipse(0,0,34,29,'#636c73');polygon([[-28,-7],[-43,-24],[-38,2]],'#c0bbae','#d6d0c2',2);
  polygon([[22,-8],[44,-27],[39,6]],'#c0bbae','#d6d0c2',2);ellipse(-10,-8,13,10,'#697c84');
  polygon([[-19,-18],[4,-26],[26,-7],[16,17],[-18,20]],'#4e6371','#81939a',3);
  ellipse(-20,-8,4.2,4.2,'#ff6c68');ellipse(-14,-8,4.2,4.2,'#ff6c68');
  for(const xx of [-21,14])roundedRect(xx,18,10,13,4,'#4b555e');
 }else if(m.type==='boss'){
  const flutter=Math.sin(t*4+m.bodyTime)*8;
  polygon([[-16,-9],[-46,-42-flutter],[-61,10],[-24,17]],'#5b456b','#ad7a8c',2);
  polygon([[13,-7],[44,-42-flutter],[58,10],[18,17]],'#6a4b6b','#ad7a8c',2);
  ellipse(0,2,37,32,'#654d68');polygon([[-20,-11],[-15,-39],[5,-47],[16,-21],[17,11],[-15,17]],'#876278','#bf8d9c',2);
  polygon([[-30,-20],[-25,-45],[-12,-30]],'#d2bc9f');polygon([[14,-28],[31,-49],[27,-16]],'#d2bc9f');
  ellipse(-13,-6,5,4,'#ffb57f');ellipse(4,-6,5,4,'#ffb57f');
  ctx.strokeStyle='#dc8a7c';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(25,15);ctx.bezierCurveTo(53,24,58,-15,75,-12);ctx.stroke();
 }
 ctx.restore();
 // Debuff rings and HP bar; visible at a glance
 if(m.burnTime>0){ctx.globalAlpha=.8;ellipse(x+r*.7,y-r*.4,4+Math.sin(t*11)*2,10,'#ff8d52');ctx.globalAlpha=1}
 if(m.poisonTime>0){ctx.lineWidth=1.5;ctx.strokeStyle='#9fdf80';ctx.beginPath();ctx.arc(x,y,r+5,0,TAU);ctx.stroke()}
 if(m.slowTime>0){ctx.strokeStyle='#a1e5f3';ctx.lineWidth=2;ctx.beginPath();ctx.arc(x,y,r+9,Math.sin(t),Math.PI+Math.sin(t));ctx.stroke()}
 const bw=m.type==='boss'?101:Math.max(39,r*2.5),py=y-r-17;
 roundedRect(x-bw/2,py,bw,6,3,'#412b35');roundedRect(x-bw/2,py,bw*pct,6,3,m.type==='boss'?'#eab878':pct>.5?'#85d2a2':'#e5907f');
 if(m.armor>=6){ctx.fillStyle='#b2cad0';ctx.font='11px system-ui';ctx.fillText('◆',x+bw/2+8,py+6)}
}
function drawProjectiles(t){
 for(const p of s.shots){ctx.globalAlpha=.22;ctx.strokeStyle=p.color;ctx.lineWidth=p.r*3;ctx.beginPath();ctx.moveTo(p.x-28,p.y);ctx.lineTo(p.x,p.y);ctx.stroke();ctx.globalAlpha=1;ctx.strokeStyle=p.color;ctx.lineWidth=p.r;ctx.beginPath();ctx.moveTo(p.x-15,p.y);ctx.lineTo(p.x,p.y);ctx.stroke();ellipse(p.x,p.y,p.r,p.r,p.color)}
 for(const b of s.bursts){const pct=b.life/b.max;ctx.globalAlpha=.55*pct;ctx.strokeStyle=b.color;ctx.lineWidth=4*pct;ctx.beginPath();ctx.arc(b.x,b.y,b.r*(1+(1-pct)*.5),0,TAU);ctx.stroke();ctx.globalAlpha=1}
}
function drawParticles(){
 for(const p of s.particles){ctx.globalAlpha=clamp(p.life/p.total,0,1);if(p.text){ctx.fillStyle=p.color;ctx.font='bold '+p.size+'px system-ui';ctx.textAlign='center';ctx.fillText(p.text,p.x,p.y)}else{ellipse(p.x,p.y,p.size,p.size,p.color)}ctx.globalAlpha=1}
}
function drawOverlayStatus(t){
 if(s.phase==='prepare'){const g=ctx.createLinearGradient(345,25,765,25);g.addColorStop(0,'#061c29a0');g.addColorStop(.5,'#12323ac7');g.addColorStop(1,'#061c29a0');roundedRect(362,33,355,55,13,g);ctx.textAlign='center';ctx.fillStyle='#b4ecdf';ctx.font='bold 18px system-ui';ctx.fillText('背包装好了吗？怪物正从远方集结',540,66);
 ctx.font='11px system-ui';ctx.fillStyle='#9fb4c0';ctx.fillText('合成你的防线 · 波次开启后无法调整装备',540,83)}
 else if(s.phase==='battle'&&gamePaused){ctx.fillStyle='#081423a2';ctx.fillRect(0,0,W,H);ctx.fillStyle='#e0f6ee';ctx.font='bold 37px system-ui';ctx.textAlign='center';ctx.fillText('战斗已暂停',W/2,H/2);ctx.font='17px system-ui';ctx.fillText('点击继续，或者按空格键',W/2,H/2+35)}
 else if(s.phase==='reward'){ctx.fillStyle='#0c293159';ctx.fillRect(0,0,W,H)}
 else if(s.phase==='gameover'){ctx.fillStyle='#270d2491';ctx.fillRect(0,0,W,H)}
}
function drawScene(t){
 if(!s||!ctx)return;ctx.clearRect(0,0,W,H);drawBackground(t);
 ctx.save();ctx.shadowColor='#72ebc150';ctx.shadowBlur=17;drawGate(t);ctx.restore();
 drawTurrets(t);
 for(const m of s.monsters.slice().sort((a,b)=>a.y-b.y))drawMonster(m,t);
 drawProjectiles(t);drawParticles();
 drawOverlayStatus(t);
 if(s.gateFlash>0){ctx.fillStyle='rgba(255,83,93,'+(s.gateFlash*.22)+')';ctx.fillRect(0,0,W,H)}
}
function updateVisuals(dt){
 s.gateFlash=Math.max(0,s.gateFlash-dt);
 for(const p of s.particles){p.life-=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;if(!p.text)p.vy+=90*dt}
 s.particles=s.particles.filter(p=>p.life>0);
 for(const b of s.bursts)b.life-=dt;s.bursts=s.bursts.filter(b=>b.life>0)
}
function requestLoop(){
 let raf=0;
 const loop=(timestamp)=>{
  if(!s)return;
  const dt=lastTime?Math.min(.055,(timestamp-lastTime)/1000):.016;lastTime=timestamp;visualTime+=dt;
  if(s.phase==='battle'&&!gamePaused&&!document.hidden){
   const elapsed=dt*speed,slices=Math.max(1,Math.ceil(elapsed/.024)),step=elapsed/slices;
   for(let i=0;i<slices;i++){if(s.phase!=='battle')break;updateBattle(step)}
  }
  updateVisuals(dt);drawScene(visualTime);
  hudTick+=dt;if(hudTick>.16&&s.phase==='battle'){hudTick=0;
   $('#gateLabel').textContent=s.gate+' / '+s.maxGate;$('#goldLabel').textContent=s.gold;
   $('#gateFill').style.width=(s.gate/s.maxGate*100)+'%';
   $('#dangerNote').textContent='已出场 '+s.spawnIndex+'/'+s.waveQueue.length+' · 剩余敌人 '+s.monsters.length+' · 击杀 '+s.kills;
   $('#fpsLabel').textContent='● '+(gamePaused?'PAUSED':speed+'× LIVE')}
  frameId=requestAnimationFrame(loop)
 };
 frameId=requestAnimationFrame(loop);
}
window.__nightwatch={
 get state(){return s},data:{items:ITEMS,recipes:RECIPES,monsters:MONSTERS},reset:newGame,build:calculate,makeWave,
 equipById:(id,x,y)=>{if(s.phase!=='prepare')return false;const it=s.items.find(x=>x.id===id);if(!it||!fits(it,x,y))return false;it.x=x;it.y=y;render();return true},
 chooseMaterial:addMaterial,craft,buy,repair,startWave,step:(dt)=>{if(s.phase==='battle'){updateBattle(dt);updateVisuals(dt)}},reward:pickReward,close:closeDialog,
 setSeed:(seed)=>{s.seed=seed;s.shop=stockFor(s.wave).map(type=>({type,sold:false}));render()},draw:()=>drawScene(visualTime),
 getSnapshot:()=>({phase:s.phase,wave:s.wave,gate:s.gate,gold:s.gold,kills:s.kills,monsters:s.monsters.length,spawned:s.spawnIndex,roundSize:s.waveQueue.length,equipment:equipped().map(x=>x.type),codex:[...s.discovered],best:s.best})
};
newGame();
