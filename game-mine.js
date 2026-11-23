/* 05 — DOWN THE SHAFT */
function renderMine(stage){
  let canvas,ctx,raf=0,running=false,paused=false,overlay;
  let last=0,elapsed=0,distance=0,score=0,lives=3,lane=1,invuln=0,spawnTimer=0,spawnCount=0,hazards=[],particles=[],lastLane=-1;
  const laneX=[145,320,495],playerY=462,duration=35;
  function initRun(){running=false;paused=false;elapsed=0;distance=0;score=0;lives=3;lane=1;invuln=0;spawnTimer=.5;spawnCount=0;hazards=[];particles=[];lastLane=-1;setStageMeta('CHALLENGE / 35 SEC','准备开始下潜');draw();showOverlay('start');updateHud();}
  function showOverlay(type){
    overlay.hidden=false;
    if(type==='start')overlay.innerHTML=`<div class="mini-label">MINING RUN / 001</div><h3>向地底进发！</h3><p>左右切换轨道，避开落石和尖刺。收集矿晶，撑过 35 秒就能完成挑战。</p><button class="action-button primary" id="mineStart">开始下潜 →</button>`;
    else if(type==='pause')overlay.innerHTML=`<div class="mini-label">PAUSED</div><h3>暂时停靠</h3><p>深呼吸，准备好再继续。</p><button class="action-button primary" id="mineResume">继续下潜 →</button>`;
    else overlay.innerHTML=`<div class="mini-label">RUN COMPLETE</div><h3>${lives>0?'成功抵达深层矿区！':'矿车需要维修'}</h3><p>深入 ${distance} 米 · 收集 ${score} 枚矿晶 · ${lives>0?'你完成了本次挑战。':'再调整一下路线，下一次会更远。'}</p><button class="action-button primary" id="mineAgain">再跑一趟 →</button>`;
    $('#mineStart',overlay)?.addEventListener('click',startRun);$('#mineResume',overlay)?.addEventListener('click',resumeRun);$('#mineAgain',overlay)?.addEventListener('click',startRun);
  }
  function updateHud(){
    $('#mineLives',stage).textContent='❤️'.repeat(lives)+'🖤'.repeat(3-lives);
    $('#mineDistance',stage).textContent=`${distance}m`;
    $('#mineScore',stage).textContent=String(score).padStart(2,'0');
    $('#mineTime',stage).textContent=`${Math.max(0,duration-elapsed).toFixed(0)}s`;
  }
  function startRun(){elapsed=0;distance=0;score=0;lives=3;lane=1;invuln=0;spawnTimer=.4;spawnCount=0;hazards=[];particles=[];lastLane=-1;running=true;paused=false;overlay.hidden=true;setStageMeta('RUNNING / 35 SEC','避开障碍，收集矿晶');last=performance.now();cancelAnimationFrame(raf);raf=requestAnimationFrame(loop);}
  function pauseRun(){if(!running)return;running=false;paused=true;cancelAnimationFrame(raf);setStageMeta('PAUSED','矿车已暂停');showOverlay('pause');}
  function resumeRun(){if(paused){paused=false;running=true;setStageMeta('RUNNING / 35 SEC','避开障碍，收集矿晶');last=performance.now();overlay.hidden=true;raf=requestAnimationFrame(loop);}}
  function endRun(win=false){running=false;paused=false;cancelAnimationFrame(raf);setStageMeta(win?'CHALLENGE COMPLETE':'RUN ENDED',win?'成功抵达深层矿区':'矿车需要维修');if(win)setLevelProgress('mine',1);showOverlay('end');}
  function moveLane(dir){if(!running)return;lane=Math.max(0,Math.min(2,lane+dir));}
  function spawn(){spawnCount++;let type=spawnCount%5===0?'coin':(Math.random()<.5?'rock':'spike');let choices=[0,1,2].filter(v=>v!==lastLane);let next=choices[Math.floor(Math.random()*choices.length)];lastLane=next;hazards.push({lane:next,y:-55,type,spin:Math.random()*6});}
  function loop(now){if(!running)return;const dt=Math.min(.04,(now-last)/1000);last=now;elapsed+=dt;distance=Math.floor(elapsed*38);invuln=Math.max(0,invuln-dt);spawnTimer-=dt;
    if(spawnTimer<=0){spawn();spawnTimer=Math.max(.55,.95-elapsed*.008)+(Math.random()*.18);}
    const speed=205+elapsed*4.2;
    hazards.forEach(h=>h.y+=speed*dt);
    hazards=hazards.filter(h=>h.y<600);
    for(const h of hazards){if(h.lane!==lane||Math.abs(h.y-playerY)>32||h.hit)continue;h.hit=true;
      if(h.type==='coin'){score+=1;particles.push({x:laneX[lane],y:h.y,life:.6,text:'+1'});}
      else if(invuln<=0){lives--;invuln=1.25;particles.push({x:laneX[lane],y:playerY,life:.65,text:'OUCH'});if(lives<=0){updateHud();draw();endRun(false);return;}}
    }
    hazards=hazards.filter(h=>!h.hit);updateHud();draw();
    if(elapsed>=duration){endRun(true);return;}
    raf=requestAnimationFrame(loop);
  }
  function draw(){if(!ctx)return;const w=640,h=560;ctx.clearRect(0,0,w,h);
    const bg=ctx.createLinearGradient(0,0,0,h);bg.addColorStop(0,'#162638');bg.addColorStop(1,'#0a111c');ctx.fillStyle=bg;ctx.fillRect(0,0,w,h);
    // mine walls and perspective rails
    ctx.fillStyle='#263949';ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(82,0);ctx.lineTo(160,560);ctx.lineTo(0,560);ctx.fill();ctx.beginPath();ctx.moveTo(640,0);ctx.lineTo(558,0);ctx.lineTo(480,560);ctx.lineTo(640,560);ctx.fill();
    ctx.strokeStyle='#597080';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(82,0);ctx.lineTo(160,560);ctx.moveTo(558,0);ctx.lineTo(480,560);ctx.stroke();
    for(let i=0;i<3;i++){const x=laneX[i];ctx.strokeStyle='rgba(142,176,194,.22)';ctx.lineWidth=2;ctx.setLineDash([18,17]);ctx.beginPath();ctx.moveTo(x-48,0);ctx.lineTo(x-48,560);ctx.moveTo(x+48,0);ctx.lineTo(x+48,560);ctx.stroke();ctx.setLineDash([]);}
    // passing light strips
    for(let i=0;i<8;i++){const y=((elapsed*180+i*82)%650)-80;ctx.fillStyle='rgba(128,164,185,.08)';ctx.fillRect(92,y,456,2);}
    hazards.forEach(h=>{const x=laneX[h.lane];if(h.type==='coin'){ctx.save();ctx.translate(x,h.y);ctx.rotate(Math.sin(h.spin+elapsed*3)*.25);ctx.fillStyle='#73d4f2';ctx.beginPath();ctx.arc(0,0,15,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#d9f8ff';ctx.lineWidth=3;ctx.stroke();ctx.fillStyle='#17435b';ctx.font='bold 13px sans-serif';ctx.textAlign='center';ctx.fillText('✦',0,5);ctx.restore();}else if(h.type==='rock'){ctx.fillStyle='#788797';ctx.beginPath();ctx.moveTo(x-22,h.y+13);ctx.lineTo(x-15,h.y-17);ctx.lineTo(x+4,h.y-24);ctx.lineTo(x+25,h.y-7);ctx.lineTo(x+18,h.y+20);ctx.lineTo(x-8,h.y+25);ctx.closePath();ctx.fill();ctx.strokeStyle='#c2cbd2';ctx.lineWidth=2;ctx.stroke();}else{ctx.fillStyle='#e58b72';ctx.beginPath();ctx.moveTo(x-24,h.y+20);ctx.lineTo(x-10,h.y-20);ctx.lineTo(x+1,h.y+4);ctx.lineTo(x+14,h.y-23);ctx.lineTo(x+25,h.y+20);ctx.closePath();ctx.fill();ctx.strokeStyle='#ffc2a7';ctx.lineWidth=2;ctx.stroke();}});
    // player cart
    const px=laneX[lane];ctx.save();if(invuln>0&&Math.floor(invuln*12)%2===0)ctx.globalAlpha=.35;
    ctx.fillStyle='#f5ca63';ctx.beginPath();ctx.roundRect(px-29,playerY-20,58,36,10);ctx.fill();ctx.fillStyle='#263444';ctx.fillRect(px-18,playerY-13,36,13);ctx.fillStyle='#8ad7bf';ctx.fillRect(px-11,playerY-10,22,8);ctx.fillStyle='#e5edf4';ctx.beginPath();ctx.arc(px,playerY-28,13,Math.PI,0);ctx.fill();ctx.fillStyle='#d9a94e';ctx.fillRect(px-18,playerY-29,36,5);ctx.fillStyle='#111923';ctx.beginPath();ctx.arc(px-17,playerY+17,8,0,Math.PI*2);ctx.arc(px+17,playerY+17,8,0,Math.PI*2);ctx.fill();ctx.restore();
    particles.forEach(p=>{p.life-=.016;ctx.globalAlpha=Math.max(0,p.life/.6);ctx.fillStyle='#f5ca63';ctx.font='bold 13px sans-serif';ctx.textAlign='center';ctx.fillText(p.text,p.x,p.y-20*(1-p.life/.6));ctx.globalAlpha=1;});particles=particles.filter(p=>p.life>0);
    ctx.fillStyle='rgba(255,255,255,.35)';ctx.font='10px monospace';ctx.textAlign='left';ctx.fillText('SHAFT  /  DESCENT',20,25);
  }
  stage.innerHTML=`<div class="mine-game"><div class="game-panel-head"><div><div class="game-panel-title">矿车正在下潜</div><div class="game-panel-sub">保持移动，提前规划安全路线</div></div><span class="level-pill">挑战时间 ${duration}s</span></div>
    <div class="mine-hud"><div><div class="mini-label">LIVES</div><div class="mine-lives" id="mineLives">❤️❤️❤️</div></div><div class="mine-score"><div><strong id="mineDistance">0m</strong><span>深入距离</span></div><div><strong id="mineScore">00</strong><span>矿晶数量</span></div><div><strong id="mineTime">35s</strong><span>剩余时间</span></div></div></div>
    <div class="mine-canvas-wrap"><canvas class="mine-canvas" id="mineCanvas" width="640" height="560"></canvas><div class="mine-overlay" id="mineOverlay"></div></div>
    <div class="mine-controls"><button class="mine-control" id="mineLeft" aria-label="向左">←</button><button class="mine-control" id="minePause" aria-label="暂停">Ⅱ</button><button class="mine-control" id="mineRight" aria-label="向右">→</button></div><div class="mine-hint">键盘 ← → / A D　·　手机点击左右按钮</div>
  </div>`;
  canvas=$('#mineCanvas',stage);ctx=canvas.getContext('2d');overlay=$('#mineOverlay',stage);
  $('#mineLeft',stage).addEventListener('click',()=>moveLane(-1));$('#mineRight',stage).addEventListener('click',()=>moveLane(1));$('#minePause',stage).addEventListener('click',()=>running?pauseRun():resumeRun());
  function onKey(e){if(activeGame!=='mine')return;if(['ArrowLeft','ArrowRight','a','A','d','D',' '].includes(e.key))e.preventDefault();if(e.key==='ArrowLeft'||e.key==='a'||e.key==='A')moveLane(-1);if(e.key==='ArrowRight'||e.key==='d'||e.key==='D')moveLane(1);if(e.key===' '){running?pauseRun():resumeRun();}}
  window.addEventListener('keydown',onKey);initRun();
  return {restart:initRun,destroy:()=>{running=false;cancelAnimationFrame(raf);window.removeEventListener('keydown',onKey);}};
}

