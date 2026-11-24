/* Canvas battlefield painter and real-time runtime loop. */
'use strict';
const CC={sky:'#0b1830',lane:'#304657',line:'#84c9bd',arrow:'#f7d398',magic:'#b8a1ff',fire:'#ffa46c',cold:'#9ce8f8'};
let hudTick=0;
function polygon(points,fill,stroke='',lineWidth=1){ctx.beginPath();ctx.moveTo(points[0][0],points[0][1]);for(let i=1;i<points.length;i++)ctx.lineTo(points[i][0],points[i][1]);ctx.closePath();ctx.fillStyle=fill;ctx.fill();if(stroke){ctx.lineWidth=lineWidth;ctx.strokeStyle=stroke;ctx.stroke()}}
function ellipse(x,y,rx,ry,color){ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,TAU);ctx.fillStyle=color;ctx.fill()}
function roundedRect(x,y,w,h,r,color){ctx.fillStyle=color;ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.fill()}

/* The Moonlit Watch — hand-painted-style procedural scenery.
   Fixed gameplay coordinates; the landscape itself is cached once per viewport. */
let landscapeCanvas=null;
function landscape(c){
 const rand=rng(743918);
 const poly=(ps,color,stroke=null,lw=1)=>{c.beginPath();c.moveTo(...ps[0]);for(let i=1;i<ps.length;i++)c.lineTo(...ps[i]);c.closePath();c.fillStyle=color;c.fill();if(stroke){c.strokeStyle=stroke;c.lineWidth=lw;c.stroke()}};
 const oval=(x,y,rx,ry,color)=>{c.beginPath();c.ellipse(x,y,rx,ry,0,0,TAU);c.fillStyle=color;c.fill()};
 const line=(ps,color,width=1)=>{c.beginPath();c.moveTo(...ps[0]);for(let i=1;i<ps.length;i++)c.lineTo(...ps[i]);c.strokeStyle=color;c.lineWidth=width;c.stroke()};
 const gradient=c.createLinearGradient(0,0,0,H);gradient.addColorStop(0,'#10192c');gradient.addColorStop(.40,'#344451');gradient.addColorStop(.66,'#6f7470');gradient.addColorStop(1,'#263d3a');
 c.fillStyle=gradient;c.fillRect(0,0,W,H);
 // Engraved celestial disc, mottled with translucent ink washes.
 const halo=c.createRadialGradient(775,65,8,775,65,155);halo.addColorStop(0,'#f3d8a792');halo.addColorStop(.32,'#e9d9b245');halo.addColorStop(.67,'#a1b9b015');halo.addColorStop(1,'#a1b9b000');c.fillStyle=halo;c.fillRect(600,0,350,235);
 oval(775,65,42,42,'#e6d5b2');oval(770,59,39,39,'#f0e3bf');
 c.save();c.beginPath();c.arc(775,65,40,0,TAU);c.clip();
 for(let i=0;i<43;i++){const x=746+rand()*58,y=35+rand()*60,rr=3+rand()*13;oval(x,y,rr,rr*.55,'rgba(139,141,130,'+(.035+rand()*.07)+')')}c.restore();
 for(let i=0;i<83;i++){const x=rand()*W,y=7+rand()*126,r=rand()<.13?1.4:.55;c.globalAlpha=.22+rand()*.55;oval(x,y,r,r,'#f0ddbf')}c.globalAlpha=1;
 // Asymmetrical mountain silhouettes and etched rock facets.
 const ridges=[
 {base:176,color:'#566873',edge:'#8a9184',pts:[[0,126],[64,89],[104,107],[158,58],[205,105],[257,80],[309,124],[366,88],[414,114],[469,70],[515,93],[567,42],[624,107],[680,75],[736,112],[803,93],[859,130],[929,66],[1005,119],[1080,86]]},
 {base:198,color:'#344b54',edge:'#6e7975',pts:[[0,143],[70,126],[117,145],[183,104],[229,149],[292,128],[335,155],[391,109],[447,142],[493,121],[547,165],[601,109],[663,151],[731,123],[799,154],[846,116],[912,155],[966,115],[1040,153],[1080,139]]},
 {base:213,color:'#253d43',edge:'#495f5c',pts:[[0,171],[67,155],[128,179],[200,143],[271,181],[339,150],[406,175],[486,143],[543,184],[617,156],[673,183],[750,146],[827,177],[906,154],[980,183],[1080,149]]}
 ];
 for(const ridge of ridges){
  poly([...ridge.pts,[W,ridge.base],[0,ridge.base]],ridge.color);
  for(let i=1;i<ridge.pts.length-1;i++){const [x,y]=ridge.pts[i],p=ridge.pts[i-1],n=ridge.pts[i+1];if(y<p[1]&&y<n[1]){
    poly([[x,y],[x-9,y+25],[x+7,y+58],[p[0]+(x-p[0])*.40,ridge.base-3]],ridge.edge+'45');
    line([[x,y],[x+11,y+21],[x+4,y+32]],ridge.edge+'85',.7);
  }}
 }
 // The far village lights beneath a ruined bell tower.
 const ruins=(x,y,sc)=>{
  c.save();c.translate(x,y);c.scale(sc,sc);
  poly([[-37,14],[-37,-5],[-22,-16],[-7,-6],[-7,14]],'#263d40');
  poly([[-7,14],[-7,-34],[3,-46],[13,-34],[13,14]],'#1c3539');
  poly([[13,14],[13,-6],[34,-23],[51,-6],[51,14]],'#233b3d');
  c.fillStyle='#bfa06b';c.fillRect(0,-24,4,7);c.fillRect(-22,-1,4,5);c.fillRect(31,1,4,5);
  line([[3,-46],[3,-56]],'#1b3033',1.3);c.restore();
 };
 ruins(418,169,.8);ruins(890,175,.9);
 const fir=(x,y,h,color,highlight)=>{
  c.fillStyle=color;c.fillRect(x-1.2,y-h*.74,2.4,h*.77);
  for(let j=0;j<4;j++){const top=y-h+(h*.19*j),half=h*(.15+.045*j),base=top+h*.46;
    poly([[x,top],[x-half*.38,top+h*.20],[x-half,base],[x-2,base-4],[x+half*.86,base+1],[x+half*.29,top+h*.2]],color);
    if(highlight)line([[x,top],[x-half*.25,top+h*.18],[x-half*.72,base-2]],highlight,.65)
  }
 };
 for(let layer=0;layer<2;layer++)for(let i=0;i<62;i++){let x=i*18-12+rand()*16,y=layer?200+rand()*13:186+rand()*11,h=(layer?19:14)+rand()*(layer?39:29);fir(x,y,h,layer?'#1b3437':'#354b4d',layer?'#45605a':'#6c7c70')}
 // Undulating meadows, with open earthen paths rather than neon lanes.
 poly([[0,205],[245,194],[499,207],[734,196],[1080,201],[1080,H],[0,H]],'#2a4440');
 for(let i=0;i<3;i++){
   const y=LANES[i],top=y-25,bot=y+25;
   const dirt=c.createLinearGradient(0,top,0,bot);dirt.addColorStop(0,'#51615a');dirt.addColorStop(.48,'#6b695b');dirt.addColorStop(1,'#3d4e46');
   c.beginPath();c.moveTo(139,top+6);c.bezierCurveTo(390,top-5,684,top+7,1080,top-2);c.lineTo(1080,bot);c.bezierCurveTo(745,bot+5,409,bot-5,139,bot+1);c.closePath();c.fillStyle=dirt;c.fill();
   c.strokeStyle='#abb09538';c.lineWidth=1.4;c.beginPath();c.moveTo(191,top+5);c.bezierCurveTo(426,top-3,739,top+7,1080,top);c.stroke();
   c.strokeStyle='#192e2caa';c.lineWidth=2;c.beginPath();c.moveTo(195,bot+3);c.bezierCurveTo(409,bot-3,734,bot+7,1080,bot+2);c.stroke();
   for(let k=0;k<135;k++){const x=197+rand()*875,yy=y-19+rand()*39;oval(x,yy,rand()*5+.6,rand()*1.2+.45,['#8b846a50','#263d344d','#afa3893a','#c2b89a24'][k%4])}
   for(let k=0;k<17;k++){const x=250+k*49+rand()*21,yy=bot-1+rand()*5;poly([[x-4,yy+2],[x,yy-2],[x+7,yy-1],[x+5,yy+3]],'#a59d7e45')}
 }
 // Foreground foliage with luminous tips; hand-placed irregular strokes.
 for(let i=0;i<250;i++){const x=rand()*W,y=(i<120?361:194+Math.floor(rand()*3)*65)+rand()*17,h=3+rand()*12;
  if(x<170)continue;
  line([[x,y],[x-1,y-h],[x-4,y-h-2]],i%5===0?'#74856d':'#243b34',.8+rand()*1.25);
  if(i%6===0){oval(x-4,y-h-1,2,1.4,'#b8b0848c')}
 }
 for(let k=0;k<3;k++){const y=LANES[k];const r=c.createRadialGradient(1074,y,2,1074,y,71);r.addColorStop(0,'#9d627657');r.addColorStop(.45,'#6e48543a');r.addColorStop(1,'#6e485400');c.fillStyle=r;c.fillRect(995,y-72,85,144);line([[1072,y-27],[1066,y-16],[1064,y],[1068,y+15],[1074,y+25]],'#b8878b70',1.6)}
 const vignette=c.createRadialGradient(530,190,140,530,190,610);vignette.addColorStop(0,'#07151b00');vignette.addColorStop(.75,'#0a171a10');vignette.addColorStop(1,'#07151b7d');c.fillStyle=vignette;c.fillRect(0,0,W,H);
}
function drawBackground(t){
 if(!landscapeCanvas&&typeof document.createElement==='function'){landscapeCanvas=document.createElement('canvas');landscapeCanvas.width=W;landscapeCanvas.height=H;landscape(landscapeCanvas.getContext('2d'))}
 if(landscapeCanvas)ctx.drawImage(landscapeCanvas,0,0);else landscape(ctx);
 // Moving ribbons of low fog, fireflies, and drifting pale embers.
 for(let k=0;k<3;k++){const x=((t*(5+k*2)+k*391)%(W+320))-160,y=177+k*65;const g=ctx.createRadialGradient(x,y,0,x,y,205);g.addColorStop(0,'#c2cfbb13');g.addColorStop(1,'#c2cfbb00');ctx.fillStyle=g;ctx.fillRect(x-205,y-32,410,64)}
 for(let i=0;i<21;i++){const x=(i*137.11+t*(7+i%4))%W,y=135+(i*43)%230+Math.sin(t*.8+i)*7;ctx.globalAlpha=.12+.24*(.5+.5*Math.sin(t*1.7+i));ellipse(x,y,i%4===0?1.7:.8,i%4===0?1.7:.8,'#f6d59a')}ctx.globalAlpha=1;
}
function drawGate(t){
 ctx.save();const shake=s.gateFlash>0?Math.sin(t*51)*s.gateFlash*6:0;ctx.translate(shake,0);
 ellipse(91,360,113,16,'#091718a8');
 const stone=ctx.createLinearGradient(5,0,170,0);stone.addColorStop(0,'#1d2b31');stone.addColorStop(.37,'#52605a');stone.addColorStop(.72,'#394a47');stone.addColorStop(1,'#17282d');
 // Gothic watchtower: buttresses, crenellations, lancet window and masonry.
 polygon([[5,365],[12,170],[25,165],[25,103],[14,103],[14,87],[35,87],[35,69],[51,69],[51,87],[67,87],[67,69],[83,69],[83,87],[101,87],[101,69],[117,69],[117,87],[139,87],[139,103],[130,103],[130,165],[154,170],[174,365]],stone,'#10282b',3);
 for(let y=112;y<355;y+=17){const left=y<164?26:18,right=y<164?130:155;ctx.strokeStyle='#b4b8a030';ctx.lineWidth=.85;ctx.beginPath();ctx.moveTo(left,y);ctx.lineTo(right,y);ctx.stroke();
  for(let x=left+((Math.floor(y/17)%2)*13);x<right;x+=27){ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x,y+16);ctx.stroke()}}
 polygon([[22,98],[22,91],[135,91],[135,99]],'#848b76','#1e3936',1);
 polygon([[13,365],[13,186],[35,175],[40,365]],'#627168','#243b3d',1.6);
 polygon([[139,365],[136,175],[158,185],[174,365]],'#354945','#1b3334',1.6);
 const arch=(x,y,w,h,color)=>{ctx.beginPath();ctx.moveTo(x-w/2,y+h);ctx.lineTo(x-w/2,y+20);ctx.quadraticCurveTo(x-w/2,y-6,x,y-27);ctx.quadraticCurveTo(x+w/2,y-6,x+w/2,y+20);ctx.lineTo(x+w/2,y+h);ctx.closePath();ctx.fillStyle=color;ctx.fill()};
 arch(85,207,83,143,'#162b2e');arch(85,214,66,137,'#0e2026');
 const wood=ctx.createLinearGradient(50,0,119,0);wood.addColorStop(0,'#302e28');wood.addColorStop(.52,'#6b5940');wood.addColorStop(1,'#292f2a');arch(85,220,59,130,wood);
 ctx.lineWidth=1.1;ctx.strokeStyle='#100f0da0';for(let x=60;x<113;x+=9){ctx.beginPath();ctx.moveTo(x,229);ctx.lineTo(x,348);ctx.stroke()}
 for(const y of [254,303,337]){roundedRect(53,y,64,5,2,'#303f3c');for(let x=57;x<117;x+=13)ellipse(x,y+2.5,1.6,1.6,'#b2a07b')}
 roundedRect(82,230,6,119,1,'#c4aa75');ellipse(75,282,4.1,4.1,'#ac9161');ellipse(96,282,4.1,4.1,'#ac9161');
 arch(78,126,24,32,'#101e24');arch(78,129,13,27,'#ddb378');ctx.globalAlpha=.28+.12*Math.sin(t*3);ellipse(78,144,22,34,'#e4b57a30');ctx.globalAlpha=1;
 // Fluttering pennant bearing an engraved four-point star.
 const sway=Math.sin(t*1.8)*4;polygon([[34,120],[58,120],[58+sway,179],[46+sway,171],[34,181]],'#583d43','#bc9872',1.15);
 polygon([[46,134],[49,143],[55,146],[49,150],[46,159],[43,150],[37,146],[43,143]],'#d8b980');
 for(const [x,y] of [[28,209],[141,209]]){
 const glow=ctx.createRadialGradient(x,y,2,x,y,65);glow.addColorStop(0,'#ffd59d6f');glow.addColorStop(.33,'#e8a56729');glow.addColorStop(1,'#e8a56700');ctx.fillStyle=glow;ctx.fillRect(x-65,y-65,130,130);
 roundedRect(x-4,y-8,8,21,2,'#302e27');polygon([[x-6,y+2],[x-3,y-7],[x,y-14-Math.sin(t*8)*3],[x+3,y-6],[x+6,y+2]],'#f1b879');ellipse(x,y-3,2.5,6,'#fff0b3');
 }
 // Arcane crest, bronze inlay.
 ellipse(85,188,15,15,'#213c3d');ctx.strokeStyle='#c3a270';ctx.lineWidth=1.8;ctx.beginPath();ctx.arc(85,188,13,0,TAU);ctx.stroke();
 polygon([[85,176],[88,184],[97,188],[88,191],[85,200],[81,191],[73,188],[81,184]],'#e2c08c');
 ctx.restore();
}


function drawTurrets(t){
 const eq=s.phase==='battle'&&s.turrets.length?s.turrets:calculate().weapons.map((w,i)=>({...w,lane:i%3,y:LANES[i%3]-(Math.floor(i/3)*17-8),cool:1}));
 const sorted=eq.slice().sort((a,b)=>a.y-b.y);
 for(const w of sorted){
  const x=183+(w.lane%3)*8,y=w.y+5,magic=w.element==='magic',energy=w.slow?'#a8e4e6':w.burn?'#f3ad72':magic?'#c3b3e9':'#e5d1a0';
  const recoil=s.phase==='battle'&&w.cool!==undefined?Math.max(0,(w.cool-(w.rate-.18))/.18):0;
  ctx.save();ctx.translate(x,y);
  ellipse(-6,22,31,7,'#101c1abb');
  const steel=ctx.createLinearGradient(-25,-12,23,20);steel.addColorStop(0,'#9ca393');steel.addColorStop(.42,'#5e746b');steel.addColorStop(1,'#293d3b');
  polygon([[-26,16],[-22,-6],[-10,-18],[11,-18],[24,-4],[28,16]],steel,'#172d2e',2.2);
  polygon([[-23,9],[-17,-4],[17,-4],[23,9]],'#3d524a','#b1b59a',.8);
  roundedRect(-24,12,50,7,2,'#344b44');
  for(const dx of [-18,17])ellipse(dx,15,2.2,2.2,'#c3b080');
  ctx.translate(-recoil*5,0);
  if(magic){
    polygon([[-11,0],[-5,-16],[7,-21],[16,-8],[12,5]],'#746d86','#d4c1a0',1.3);
    polygon([[1,-20],[6,-30],[13,-21],[7,-11]],energy,'#f7dfb1',1.1);
    ctx.strokeStyle=energy;ctx.lineWidth=1.3;ctx.beginPath();ctx.ellipse(7,-20,17,10,t*.5,0,TAU);ctx.stroke();
    ctx.strokeStyle='#c9b89b';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(3,-8);ctx.lineTo(28,-13);ctx.stroke();
  }else{
    polygon([[-17,-7],[8,-16],[26,-11],[14,1],[-11,2]],'#7f6b4f','#e2d3a7',1.4);
    ctx.strokeStyle='#d2b684';ctx.lineWidth=3.2;ctx.beginPath();ctx.moveTo(-5,-24);ctx.quadraticCurveTo(11,-15,15,-8);ctx.quadraticCurveTo(12,1,-4,10);ctx.stroke();
    ctx.strokeStyle='#e2d4af';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(-5,-24);ctx.lineTo(15,-8);ctx.lineTo(-4,10);ctx.stroke();
    ctx.strokeStyle=energy;ctx.lineWidth=1.8;ctx.beginPath();ctx.moveTo(4,-8);ctx.lineTo(32,-13);ctx.stroke();
  }
  const glow=ctx.createRadialGradient(30,-13,1,30,-13,15+recoil*18);glow.addColorStop(0,energy);glow.addColorStop(.2,energy+'8a');glow.addColorStop(1,energy+'00');ctx.fillStyle=glow;ctx.fillRect(0,-43,60,60);
  ctx.restore();
 }
}
function drawMonster(m,t){
 const r=m.r,phase=t*8+m.bodyTime,bob=Math.sin(phase)*1.8,pct=clamp(m.hp/m.maxHp,0,1),x=m.x,y=m.y+bob;
 ctx.save();ctx.translate(x,y);
 ellipse(0,r*.78,r*1.17,Math.max(4,r*.16),'#0c1d1a9c');
 const outline='#182a2a',rim='#e2d6b08a';
 const wash=(x1,y1,x2,y2,a,b)=>{const g=ctx.createLinearGradient(x1,y1,x2,y2);g.addColorStop(0,a);g.addColorStop(.48,b);g.addColorStop(1,'#293839');return g};
 const limb=(points,color,w)=>{ctx.strokeStyle=outline;ctx.lineCap='round';ctx.lineJoin='round';ctx.lineWidth=w+3;ctx.beginPath();ctx.moveTo(...points[0]);for(let j=1;j<points.length;j++)ctx.lineTo(...points[j]);ctx.stroke();ctx.lineWidth=w;ctx.strokeStyle=color;ctx.stroke()};
 const eye=(xx,yy,size=2.7)=>{ctx.shadowColor='#f4b579';ctx.shadowBlur=7;ellipse(xx,yy,size,size*.68,'#ffd6a0');ctx.shadowBlur=0;ellipse(xx-.4,yy+.1,size*.4,size*.46,'#6a302c')};
 const rune=(xx,yy,color)=>polygon([[xx,yy-6],[xx+4,yy],[xx,yy+6],[xx-4,yy]],color,'#f4e1b280',.8);
 if(m.type==='rat'){
  const stride=Math.sin(phase*1.8)*6;
  limb([[8,7],[14,13+stride],[7,18]],'#8d7462',4);limb([[-13,7],[-17,14-stride],[-25,17]],'#a18b74',4);
  ctx.strokeStyle='#503f3d';ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(16,4);ctx.bezierCurveTo(31,-12,43,18+stride,59,1);ctx.stroke();ctx.strokeStyle='#ae8d79';ctx.lineWidth=2.2;ctx.stroke();
  ellipse(0,-1,26,13,wash(-8,-15,4,15,'#c5ad89','#8b7466'));
  polygon([[-12,-9],[-23,-13],[-29,-6],[-42,4],[-28,9],[-13,8]],wash(-25,-13,-19,10,'#c3a88b','#92776b'),outline,1.4);
  ellipse(-20,-13,8,10,'#a68d78');ellipse(-21,-13,4,6,'#d3a08b');
  polygon([[-26,-5],[-20,-9],[-12,-6]],'#cab59b8c');
  eye(-27,-3,2.4);ellipse(-41,4,2.6,2.2,'#292f2b');
  for(let i=0;i<3;i++){ctx.strokeStyle='#d8c0a97a';ctx.lineWidth=.7;ctx.beginPath();ctx.moveTo(-37,3+i*2);ctx.lineTo(-47,0+i*5);ctx.stroke()}
 }else if(m.type==='bat'){
  const flap=Math.sin(phase*1.4)*12;
  const left=[[-4,0],[-13,-15-flap],[-33,-31-flap],[-49,-15-flap],[-40,15],[-30,6],[-19,17],[-10,6]];
  const right=[[4,0],[13,-15-flap],[33,-31-flap],[49,-15-flap],[40,15],[30,6],[19,17],[10,6]];
  for(const wing of [left,right])polygon(wing,wash(0,-30-flap,0,17,'#b3a2bc','#6b5b7b'),outline,1.8);
  for(const side of [-1,1]){for(const [ax,ay] of [[33,-31-flap],[40,15],[19,17]])limb([[side*7,-4],[side*ax*.55,ay*.5],[side*ax,ay]],'#a48ea1',1)}
  ellipse(0,-1,12,18,wash(-10,-17,8,15,'#88738c','#514b60'));
  polygon([[-11,-10],[-14,-27],[-4,-17],[4,-17],[14,-27],[11,-10]],'#87788e',outline,1.2);
  eye(-5,-7);eye(5,-7);polygon([[-4,2],[0,8],[4,2]],'#ead2b1');
 }else if(m.type==='shell'){
  for(let j=0;j<3;j++){const stride=Math.sin(phase*1.7+j*2)*5;for(const side of [-1,1])limb([[side*(12+j*4),4+j*3],[side*(24+j*4),10+stride],[side*(30+j*4),18-stride]],'#7b917a',4)}
  ellipse(-23,0,12,11,'#465b51');ellipse(1,-2,29,21,wash(0,-24,0,21,'#b2c0a3','#617d6b'));
  polygon([[-23,-7],[-12,-22],[10,-22],[25,-7],[16,12],[-9,14]],'#6f8d75',outline,2);
  polygon([[-12,-22],[0,-11],[10,-22],[25,-7],[11,-3],[0,-11],[-12,-3],[-23,-7]],'#bdc6a164',rim,.8);
  for(let i=0;i<3;i++){ctx.strokeStyle='#334f48';ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(-9+i*9,-19);ctx.lineTo(-11+i*10,11);ctx.stroke()}
  eye(-29,-2,2.5);rune(0,-5,'#b3c3a6');
 }else if(m.type==='wolf'){
  const step=Math.sin(phase*1.65)*7;
  limb([[15,5],[24,15+step],[14,21]],'#88837e',5);limb([[-10,6],[-21,16-step],[-22,21]],'#a29b8e',5);
  polygon([[15,-7],[30,-6],[42,-15],[33,4],[21,7]],'#a49b8a',outline,1.4);
  polygon([[-31,-4],[-22,-20],[-9,-20],[10,-16],[28,-7],[22,9],[3,13],[-19,9]],wash(-2,-25,0,13,'#b9b3a3','#7d7c78'),outline,1.8);
  polygon([[-31,-6],[-31,-27],[-19,-18],[-11,-30],[-8,-15],[-23,-11],[-39,4],[-29,10]],'#9c9488',outline,1.2);
  polygon([[-26,-6],[-46,6],[-28,11],[-16,1]],'#c0b6a1',outline,1.1);
  eye(-29,-5,3.2);ellipse(-44,6,3.3,2.3,'#232f2e');
  for(let i=0;i<3;i++)polygon([[-9+i*5,-14],[0+i*5,-8],[-5+i*5,-4]],'#d6cbb479');
  if(pct<.5){ctx.strokeStyle='#f1a27b';ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(0,0,29,Math.PI*.13,Math.PI*.78);ctx.stroke()}
 }else if(m.type==='mage'){
  const robe=wash(-12,-20,18,23,'#ad9ac4','#615d7a');
  polygon([[-22,23],[-14,-10],[-8,-19],[8,-19],[15,-8],[25,23],[9,17],[0,25],[-9,18]],robe,outline,1.7);
  polygon([[-18,-12],[0,-40],[17,-12],[9,-3],[-9,-3]],'#80728f',outline,1.4);
  polygon([[-11,-12],[0,-26],[11,-12],[8,0],[-8,0]],'#2d3545','#b8a5bf',1);
  eye(-5,-8);eye(5,-8);
  ctx.strokeStyle='#c7ac77';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(0,4);ctx.lineTo(0,18);ctx.stroke();rune(0,8,'#b7cc98');
  limb([[17,5],[23,-3],[27,-30]],'#b7a17a',3);ellipse(27,-31,6.8,6.8,'#a4d7bc');
  ctx.strokeStyle='#d7e1b9';ctx.lineWidth=1.2;ctx.beginPath();ctx.arc(27,-31,12,t,Math.PI+t);ctx.stroke();
 }else if(m.type==='wisp'){
  ctx.globalAlpha=.87;const aura=ctx.createRadialGradient(0,-6,2,0,-6,45);aura.addColorStop(0,'#b8e4d84d');aura.addColorStop(1,'#b8e4d800');ctx.fillStyle=aura;ctx.fillRect(-47,-52,94,94);
  const flame=Math.sin(phase*.7)*5;
  polygon([[0,-37-flame],[16,-15],[23,1],[13,17],[5,10],[0,25],[-8,14],[-19,19],[-25,1],[-15,-17]],wash(0,-35,0,22,'#d3f1d6','#77a9ab'),'#cee8d5',1.2);
  polygon([[-10,-15],[0,-26],[10,-15],[12,3],[0,10],[-12,3]],'#527e83','#b9e1ce',1);
  eye(-5,-7,3);eye(5,-7,3);rune(0,1,'#b8e0cf');ctx.globalAlpha=1;
 }else if(m.type==='brute'){
  const step=Math.sin(phase*1.3)*4;
  limb([[-17,15],[-21,24+step],[-29,28]],'#7d8b81',9);limb([[17,15],[24,25-step],[15,29]],'#758981',9);
  ellipse(0,2,34,28,wash(0,-30,0,28,'#aab5a6','#687f7d'));
  polygon([[-30,-4],[-45,-29],[-34,-26],[-22,-5]],'#d5caad',outline,1.5);
  polygon([[20,-6],[45,-32],[41,-15],[33,8]],'#d5caad',outline,1.5);
  polygon([[-27,-12],[-15,-24],[11,-25],[29,-7],[24,15],[5,23],[-21,17]],'#657b7b',outline,2);
  for(let i=0;i<4;i++)polygon([[-18+i*11,-20],[-10+i*11,-12],[-16+i*11,-6]],'#c2cbbb72');
  polygon([[-27,-5],[-13,-13],[1,-8],[-1,7],[-15,13],[-28,5]],'#526867',outline,1.2);
  eye(-23,-5,3.9);eye(-14,-5,3.5);rune(8,-5,'#d2b28f');
 }else if(m.type==='boss'){
  const flap=Math.sin(phase*.6)*9;
  const wingColor=wash(0,-55-flap,0,24,'#bb918d','#755e78');
  for(const side of [-1,1]){
    polygon([[side*11,-5],[side*31,-38-flap],[side*62,-53-flap],[side*54,-22-flap],[side*69,2],[side*43,9],[side*28,22],[side*15,10]],wingColor,outline,2);
    limb([[side*15,-6],[side*31,-38-flap],[side*62,-53-flap]],'#d3b4a2',1.5);
    limb([[side*17,-3],[side*44,-15-flap],[side*69,2]],'#a58c98',1.6);
  }
  ctx.strokeStyle=outline;ctx.lineWidth=12;ctx.beginPath();ctx.moveTo(21,13);ctx.bezierCurveTo(49,25,51,-9,76,-5);ctx.stroke();ctx.lineWidth=7;ctx.strokeStyle='#9b7b81';ctx.stroke();
  ellipse(0,2,36,29,wash(-10,-34,8,28,'#d1a99a','#856b80'));
  polygon([[-20,-9],[-26,-27],[-10,-40],[5,-43],[20,-29],[17,-4],[4,14],[-16,14]],'#9a7881',outline,2);
  polygon([[-23,-22],[-37,-49],[-21,-43],[-11,-27]],'#e7c6a0',outline,1.5);
  polygon([[9,-31],[22,-57],[30,-46],[24,-21]],'#e7c6a0',outline,1.5);
  polygon([[-21,-7],[-43,-1],[-33,13],[-11,14]],'#ad8e89',outline,1.6);
  eye(-17,-18,5);eye(5,-19,4.2);
  for(let j=0;j<4;j++)rune(-5+j*8,0+j*4,'#ecc6a1a0');
  for(let j=0;j<3;j++)polygon([[12+j*9,-22],[17+j*9,-33],[24+j*9,-16]],'#e3bc93',outline,1);
 }
 ctx.restore();
 // A short warm highlight on hit, restrained status glyphs, and legible HP.
 if(m.hitPulse>0){ctx.globalAlpha=Math.min(.48,m.hitPulse*2);const g=ctx.createRadialGradient(x,y-4,1,x,y-4,r*1.4);g.addColorStop(0,'#fff0b4');g.addColorStop(1,'#fff0b400');ctx.fillStyle=g;ctx.fillRect(x-r*1.5,y-r*1.5,r*3,r*3);ctx.globalAlpha=1}
 if(m.burnTime>0){const f=3+Math.sin(phase*2)*2;polygon([[x+r*.50,y+r*.28],[x+r*.40,y-r*.25],[x+r*.64,y-r*.75-f],[x+r*.8,y-r*.15],[x+r*.92,y+r*.20]],'#f1aa68','#f5d39a',.65)}
 if(m.poisonTime>0){ctx.strokeStyle='#bacf859a';ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(x,y,r+5,.1,Math.PI*1.6);ctx.stroke()}
 if(m.slowTime>0){ctx.strokeStyle='#abe3e6ba';ctx.lineWidth=2;ctx.beginPath();ctx.arc(x,y,r+8,Math.sin(t),Math.PI+Math.sin(t));ctx.stroke()}
 const bw=m.type==='boss'?100:Math.max(38,r*2.4),py=y-r-17-(m.type==='boss'?8:0);
 roundedRect(x-bw/2-1,py-1,bw+2,8,3,'#142824');
 roundedRect(x-bw/2,py,bw,6,2,'#4e3c38');
 if(pct>0){const g=ctx.createLinearGradient(0,py,0,py+6);g.addColorStop(0,m.type==='boss'?'#e8ca8b':pct>.5?'#cfdfa8':'#f1ba93');g.addColorStop(1,m.type==='boss'?'#b17e59':pct>.5?'#82a88c':'#ad7467');roundedRect(x-bw/2,py,bw*pct,6,2,g)}
 if(m.armor>=6){ctx.fillStyle='#d7c99e';ctx.font='10px Georgia,serif';ctx.fillText('◆',x+bw/2+6,py+5)}
}

function drawProjectiles(t){
 for(const p of s.shots){const dx=p.targetX-p.x,dy=p.targetY-p.y,len=Math.hypot(dx,dy)||1,ux=dx/len,uy=dy/len;ctx.save();ctx.shadowColor=p.color;ctx.shadowBlur=p.element==='magic'?12:5;ctx.globalAlpha=.3;ctx.strokeStyle=p.color;ctx.lineWidth=p.r*2.2;ctx.beginPath();ctx.moveTo(p.x-ux*35,p.y-uy*35);ctx.lineTo(p.x,p.y);ctx.stroke();ctx.globalAlpha=1;ctx.lineWidth=Math.max(2,p.r*.65);ctx.beginPath();ctx.moveTo(p.x-ux*17,p.y-uy*17);ctx.lineTo(p.x,p.y);ctx.stroke();ellipse(p.x,p.y,p.r,p.r,p.color);ellipse(p.x,p.y,p.r*.48,p.r*.48,'#fff1c9');ctx.restore()}
 for(const b of s.bursts){const pct=b.life/b.max;ctx.globalAlpha=.55*pct;ctx.strokeStyle=b.color;ctx.lineWidth=4*pct;ctx.beginPath();ctx.arc(b.x,b.y,b.r*(1+(1-pct)*.5),0,TAU);ctx.stroke();ctx.globalAlpha=1}
}
function drawParticles(){
 for(const p of s.particles){ctx.globalAlpha=clamp(p.life/p.total,0,1);if(p.text){ctx.fillStyle=p.color;ctx.font='bold '+p.size+'px system-ui';ctx.textAlign='center';ctx.fillText(p.text,p.x,p.y)}else{ellipse(p.x,p.y,p.size,p.size,p.color)}ctx.globalAlpha=1}
}
function drawOverlayStatus(t){
 if(s.phase==='prepare'){ctx.save();ctx.textAlign='center';ctx.shadowColor='#102522';ctx.shadowBlur=12;ctx.font='600 25px Georgia, serif';ctx.fillStyle='#f2dfb9';ctx.fillText('长夜将至',500,53);ctx.font='10px Georgia, serif';ctx.fillStyle='#dec8a1';ctx.fillText('T H E   L O N G   N I G H T',500,72);ctx.shadowBlur=0;ctx.strokeStyle='#d9bf886a';ctx.lineWidth=.8;ctx.beginPath();ctx.moveTo(348,82);ctx.lineTo(652,82);ctx.stroke();ctx.restore()}
 else if(s.phase==='battle'&&gamePaused){ctx.fillStyle='#081423a2';ctx.fillRect(0,0,W,H);ctx.fillStyle='#e0f6ee';ctx.font='bold 37px system-ui';ctx.textAlign='center';ctx.fillText('战斗已暂停',W/2,H/2);ctx.font='17px system-ui';ctx.fillText('点击继续，或者按空格键',W/2,H/2+35)}
 else if(s.phase==='reward'){ctx.fillStyle='#0c293159';ctx.fillRect(0,0,W,H)}
 else if(s.phase==='gameover'){ctx.fillStyle='#270d2491';ctx.fillRect(0,0,W,H)}
}
function drawScene(t){
 if(!s||!ctx)return;ctx.clearRect(0,0,W,H);drawBackground(t);
 drawGate(t);
 drawTurrets(t);
 for(const m of s.monsters.slice().sort((a,b)=>a.y-b.y))drawMonster(m,t);
 drawProjectiles(t);drawParticles();
 drawOverlayStatus(t);
 if(s.gateFlash>0){ctx.fillStyle='rgba(255,83,93,'+(s.gateFlash*.22)+')';ctx.fillRect(0,0,W,H)}
}
function updateVisuals(dt){
 s.gateFlash=Math.max(0,s.gateFlash-dt);for(const m of s.monsters)m.hitPulse=Math.max(0,(m.hitPulse||0)-dt*2.8);
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
