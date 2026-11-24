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
 const eq=s.phase==='battle'&&s.turrets.length?s.turrets:calculate().weapons.map((w,i)=>({...w,lane:i%3,y:LANES[i%3]-(Math.floor(i/3)*17-8)}));
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
 if(s.phase==='prepare'){ctx.save();ctx.textAlign='center';ctx.shadowColor='#102522';ctx.shadowBlur=12;ctx.font='600 25px Georgia, serif';ctx.fillStyle='#f2dfb9';ctx.fillText('长夜将至',500,53);ctx.font='10px Georgia, serif';ctx.fillStyle='#dec8a1';ctx.fillText('T H E   L O N G   N I G H T',500,72);ctx.shadowBlur=0;ctx.strokeStyle='#d9bf886a';ctx.lineWidth=.8;ctx.beginPath();ctx.moveTo(348,82);ctx.lineTo(652,82);ctx.stroke();ctx.restore()}
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
