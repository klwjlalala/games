/* 03 — A CUP OF LOGIC */
const TEA_LEVELS=[
  {caps:[8,5,3],start:[8,0,0],goal:[4,4,0],names:['大茶海','公道杯','闻香杯'],par:7},
  {caps:[7,4,3],start:[7,0,0],goal:[5,2,0],names:['煮水壶','茶盏','小杯'],par:6},
  {caps:[9,7,4],start:[9,0,0],goal:[3,6,0],names:['储水壶','大茶杯','小茶杯'],par:6}
];
function shortestPour(state,level){
  const key=s=>s.join(',');const queue=[{s:[...state],first:null}];const seen=new Set([key(state)]);let head=0;
  while(head<queue.length){const cur=queue[head++];if(cur.s.every((v,i)=>v===level.goal[i]))return cur.first;
    for(let i=0;i<3;i++)for(let j=0;j<3;j++){if(i===j)continue;const amount=Math.min(cur.s[i],level.caps[j]-cur.s[j]);if(amount<=0)continue;const next=[...cur.s];next[i]-=amount;next[j]+=amount;const k=key(next);if(seen.has(k))continue;seen.add(k);queue.push({s:next,first:cur.first||[i,j]});}
  }return null;
}
function renderTea(stage){
  let levelIndex=Math.min(maxLevel('tea'),2),level,values,moves=0,selected=null,done=false,status='先选择一只杯子作为倒水来源。';
  function initLevel(){level=TEA_LEVELS[levelIndex];values=[...level.start];moves=0;selected=null;done=false;status='先选择一只杯子作为倒水来源。';render();}
  function pour(from,to){if(from===to){selected=null;status='已取消选择。';render();return;}const amount=Math.min(values[from],level.caps[to]-values[to]);if(amount<=0){status=values[from]===0?'这只杯子已经空了。':'目标杯已经满了。';showToast(status);return;}values[from]-=amount;values[to]+=amount;moves++;selected=null;status=`倒出了 ${amount} 格茶水。`;if(values.every((v,i)=>v===level.goal[i])){done=true;setLevelProgress('tea',levelIndex+1);}render();if(done)showSuccess();}
  function render(){
    setStageMeta(`LEVEL 0${levelIndex+1} / 03`,done?'茶汤恰到好处':'先选来源杯，再选目标杯');
    stage.innerHTML=`<div class="tea-game">
      <div class="game-panel-head"><div><div class="game-panel-title">把茶水倒到目标刻度</div><div class="game-panel-sub">茶水会一直流动，直到来源空了或目标满了</div></div><span class="level-pill">目标水位已标出</span></div>
      <div class="tea-cups">${values.map((v,i)=>`<div class="tea-cup-wrap"><button class="tea-cup ${selected===i?'selected':''}" data-cup="${i}" aria-label="${level.names[i]}，当前 ${v} 格"><span class="tea-water" style="height:${v/level.caps[i]*100}%"></span><span class="tea-cup-number">${v} / ${level.caps[i]}</span></button><div class="tea-cup-name">${level.names[i]}</div><div class="tea-capacity">容量 ${level.caps[i]} 格</div><div class="tea-target">目标：${level.goal[i]} 格</div><div class="tea-meter"><span style="width:${v/level.caps[i]*100}%"></span></div></div>`).join('')}</div>
      <div class="tea-status" id="teaStatus">${status}</div>
      <div class="tea-counter"><div><strong>${moves}</strong><span>已倒次数</span></div><div><strong>${level.par}</strong><span>参考最少步数</span></div><div><strong>${values.reduce((a,b)=>a+b,0)}</strong><span>茶水总量</span></div></div>
      <div class="game-actions" style="justify-content:center"><button class="action-button" id="teaHint">✦ 给我提示</button><button class="action-button" id="teaReset">重新倒水</button></div>
      <div id="teaResult"></div>
    </div>`;
    $$('[data-cup]',stage).forEach(btn=>btn.addEventListener('click',()=>{if(done)return;const i=Number(btn.dataset.cup);if(selected===null){if(values[i]===0){showToast('这只杯子是空的，不能作为来源');return;}selected=i;status=`已选择「${level.names[i]}」，再选一只目标杯。`;render();}else pour(selected,i);}));
    $('#teaHint',stage).addEventListener('click',()=>{const step=shortestPour(values,level);if(!step){showToast('已经无法继续倒水，请重新开始');return;}status=`提示：把「${level.names[step[0]]}」倒入「${level.names[step[1]]}」。`;$('#teaStatus',stage).textContent=status;});
    $('#teaReset',stage).addEventListener('click',initLevel);
  }
  function showSuccess(){const target=$('#teaResult',stage);target.innerHTML=`<div class="success-panel"><div class="success-icon">🍵</div><h3>${levelIndex===2?'三道茶汤都恰到好处':'这一盏，刚刚好。'}</h3><p>你用了 ${moves} 次倾倒完成目标。${moves<=level.par?'步骤非常漂亮。':'还可以尝试更少的步骤。'}</p><div class="game-actions"><button class="action-button" id="teaReplay">再来一次</button><button class="action-button primary" id="teaNext">${levelIndex<2?'下一道茶 →':'从第一道重新开始 →'}</button></div></div>`;$('#teaReplay',stage).addEventListener('click',initLevel);$('#teaNext',stage).addEventListener('click',()=>{levelIndex=levelIndex<2?levelIndex+1:0;initLevel();});}
  initLevel();return {restart:initLevel};
}

