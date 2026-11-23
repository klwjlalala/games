/* 02 — ONE LAST BLAST */
const DEMO_LEVELS=[
  {charges:1,radius:132,blocks:[[270,250],[350,250],[430,250],[310,170],[390,170],[350,90]]},
  {charges:2,radius:105,blocks:[[205,235],[265,235],[325,235],[265,165],[405,235],[465,235],[525,235],[465,165]]},
  {charges:3,radius:100,blocks:[[175,190],[235,190],[205,250],[350,130],[410,130],[380,190],[525,190],[585,190],[555,250]]}
];
function renderDemolition(stage){
  let levelIndex=Math.min(maxLevel('demo'),2),level,blocks=[],charges,selected=null,flash=null,debris=[],done=false;
  let canvas,ctx,raf=0;
  function initLevel(){
    level=DEMO_LEVELS[levelIndex];blocks=level.blocks.map((p,i)=>({id:i,x:p[0],y:p[1],w:54,h:44,alive:true,shade:i%3}));charges=level.charges;selected=null;flash=null;debris=[];done=false;render();}
  function draw(){
    if(!ctx)return;
    const w=720,h=480;ctx.clearRect(0,0,w,h);
    const bg=ctx.createLinearGradient(0,0,0,h);bg.addColorStop(0,'#243448');bg.addColorStop(1,'#17212e');ctx.fillStyle=bg;ctx.fillRect(0,0,w,h);
    ctx.strokeStyle='rgba(255,255,255,.055)';ctx.lineWidth=1;for(let x=0;x<w;x+=40){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,h);ctx.stroke();}for(let y=0;y<h;y+=40){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(w,y);ctx.stroke();}
    ctx.fillStyle='#344451';ctx.fillRect(0,420,w,60);ctx.fillStyle='#61736f';ctx.fillRect(0,420,w,5);ctx.fillStyle='rgba(255,255,255,.12)';for(let x=0;x<w;x+=30)ctx.fillRect(x,436,13,2);
    // blast radius preview
    if(selected){ctx.beginPath();ctx.arc(selected.x,selected.y,level.radius,0,Math.PI*2);ctx.fillStyle='rgba(245,202,99,.07)';ctx.fill();ctx.strokeStyle='rgba(245,202,99,.65)';ctx.setLineDash([7,7]);ctx.stroke();ctx.setLineDash([]);ctx.beginPath();ctx.arc(selected.x,selected.y,7,0,Math.PI*2);ctx.fillStyle='#f5ca63';ctx.fill();}
    blocks.filter(b=>b.alive).forEach(b=>{
      ctx.fillStyle='rgba(0,0,0,.22)';ctx.fillRect(b.x-b.w/2+5,b.y-b.h/2+7,b.w,b.h);
      const grad=ctx.createLinearGradient(b.x-b.w/2,b.y-b.h/2,b.x+b.w/2,b.y+b.h/2);grad.addColorStop(0,['#f49a82','#f1bd70','#ed8a75'][b.shade]);grad.addColorStop(1,['#c95f5c','#c68b4d','#bb5d58'][b.shade]);ctx.fillStyle=grad;ctx.fillRect(b.x-b.w/2,b.y-b.h/2,b.w,b.h);
      ctx.strokeStyle='rgba(255,255,255,.42)';ctx.lineWidth=2;ctx.strokeRect(b.x-b.w/2+1,b.y-b.h/2+1,b.w-2,b.h-2);
      ctx.strokeStyle='rgba(91,45,42,.3)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(b.x-b.w/2+12,b.y-b.h/2+12);ctx.lineTo(b.x-b.w/2+21,b.y-b.h/2+20);ctx.moveTo(b.x+b.w/2-15,b.y+b.h/2-12);ctx.lineTo(b.x+b.w/2-23,b.y+b.h/2-20);ctx.stroke();
      ctx.fillStyle='rgba(255,255,255,.72)';ctx.font='bold 10px sans-serif';ctx.textAlign='center';ctx.fillText('拆',b.x,b.y+4);
    });
    if(flash){const t=Math.max(0,(flash.until-Date.now())/420);if(t>0){const r=level.radius*(1-t*.72);const g=ctx.createRadialGradient(flash.x,flash.y,0,flash.x,flash.y,r);g.addColorStop(0,`rgba(255,244,190,${.85*t})`);g.addColorStop(.35,`rgba(255,166,87,${.55*t})`);g.addColorStop(1,'rgba(255,102,70,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(flash.x,flash.y,r,0,Math.PI*2);ctx.fill();}else flash=null;}
    ctx.fillStyle='rgba(255,255,255,.35)';ctx.font='10px monospace';ctx.textAlign='left';ctx.fillText('DEMOLITION ZONE / 点击选择爆破点',18,25);
    debris.forEach(p=>{p.x+=p.vx*.016;p.y+=p.vy*.016;p.vy+=.42;p.life-=.016;ctx.globalAlpha=Math.max(0,p.life/.72);ctx.fillStyle=p.color;ctx.fillRect(p.x,p.y,p.size,p.size);ctx.globalAlpha=1;});debris=debris.filter(p=>p.life>0);
    if(flash||debris.length)raf=requestAnimationFrame(draw);
  }
  function render(){
    setStageMeta(`LEVEL 0${levelIndex+1} / 03`,done?'拆除完成！':'点击建筑附近，选择爆破位置');
    stage.innerHTML=`<div class="demolition-wrap">
      <div class="game-panel-head"><div><div class="game-panel-title">拆掉红色建筑方块</div><div class="game-panel-sub">找准位置，让一次爆破覆盖更多目标</div></div><span class="level-pill">爆破半径 ${level.radius}px</span></div>
      <div class="demo-hud"><div class="demo-hud-stat">剩余目标 <strong id="demoRemaining">${blocks.length}</strong></div><div class="demo-hud-stat">剩余炸药 <strong id="demoCharges">${'💣 '.repeat(charges)}</strong></div></div>
      <div class="demo-canvas-wrap"><canvas class="demo-canvas" id="demoCanvas" width="720" height="480" aria-label="拆迁游戏画布"></canvas></div>
      <div class="demo-controls"><p>点击画面放置炸药。虚线圆圈表示爆破范围，确认后点击引爆。</p><div class="demo-legend"><span><i class="legend-dot red"></i>拆除目标</span></div></div>
      <div class="game-actions"><button class="action-button primary" id="demoBlast" ${charges<=0?'disabled':''}>💥 引爆</button><button class="action-button" id="demoReset">重新布置</button></div>
      <div id="demoResult"></div>
    </div>`;
    canvas=$('#demoCanvas',stage);ctx=canvas.getContext('2d');draw();
    canvas.addEventListener('click',e=>{if(done||charges<=0)return;const rect=canvas.getBoundingClientRect();selected={x:(e.clientX-rect.left)/rect.width*720,y:(e.clientY-rect.top)/rect.height*480};draw();});
    $('#demoBlast',stage).addEventListener('click',detonate);
    $('#demoReset',stage).addEventListener('click',initLevel);
  }
  function detonate(){
    if(done||charges<=0)return;if(!selected){showToast('先在画面中选择爆破位置');return;}
    const hit=blocks.filter(b=>b.alive&&Math.hypot(b.x-selected.x,b.y-selected.y)<=level.radius);
    if(hit.length===0){charges--;showToast('没有命中目标，这次炸药浪费了');}
    else{hit.forEach(b=>{b.alive=false;for(let i=0;i<7;i++){const a=Math.random()*Math.PI*2,speed=2+Math.random()*6;debris.push({x:b.x+(Math.random()-.5)*28,y:b.y+(Math.random()-.5)*24,vx:Math.cos(a)*speed,vy:Math.sin(a)*speed-2,life:.45+Math.random()*.35,size:3+Math.random()*6,color:['#f5ca63','#f39a82','#d7e1e8'][i%3]});}});charges--;flash={...selected,until:Date.now()+420};showToast(`漂亮！一次清除了 ${hit.length} 个方块`);}
    selected=null;
    $('#demoRemaining',stage).textContent=blocks.filter(b=>b.alive).length;$('#demoCharges',stage).textContent='💣 '.repeat(charges)||'—';
    $('#demoBlast',stage).disabled=charges<=0;
    draw();
    if(blocks.every(b=>!b.alive)){done=true;setLevelProgress('demo',levelIndex+1);showResult();}
    else if(charges<=0){showFail();}
  }
  function showResult(){const target=$('#demoResult',stage);target.innerHTML=`<div class="success-panel"><div class="success-icon">🏗️</div><h3>${levelIndex===2?'拆迁任务全部完成！':'这栋楼，拆得漂亮！'}</h3><p>目标方块全部清除。你的爆破点选得很准。</p><div class="game-actions"><button class="action-button" id="demoReplay">再拆一次</button><button class="action-button primary" id="demoNext">${levelIndex<2?'下一处工地 →':'重新挑战 →'}</button></div></div>`;$('#demoReplay',stage).addEventListener('click',initLevel);$('#demoNext',stage).addEventListener('click',()=>{levelIndex=levelIndex<2?levelIndex+1:0;initLevel();});}
  function showFail(){const target=$('#demoResult',stage);target.innerHTML=`<div class="success-panel" style="border-color:#ff927e44;background:#ff927e0c"><div class="success-icon">🧱</div><h3>炸药用完了</h3><p>还有 ${blocks.filter(b=>b.alive).length} 个目标没清除。换个爆破点再试一次。</p><div class="game-actions"><button class="action-button primary" id="demoRetry">重新挑战</button></div></div>`;$('#demoRetry',stage).addEventListener('click',initLevel);}
  initLevel();
  return {restart:initLevel,destroy:()=>cancelAnimationFrame(raf)};
}

