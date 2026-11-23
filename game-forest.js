/* 06 — THE TURTLE GARDEN */
const FOREST_LEVELS=[
  {tiles:[['t1','树木','🌳','tree'],['t2','树木','🌳','tree'],['t3','树木','🌲','tree'],['w1','水源','💧','water'],['w2','水源','💧','water'],['c1','洞穴','🕳️','cave'],['r1','岩石','🪨','rock'],['m1','草地','🌿','meadow']],rules:{trees:2,animal:false,flower:false}},
  {tiles:[['t1','树木','🌳','tree'],['t2','树木','🌳','tree'],['t3','树木','🌲','tree'],['t4','树木','🌲','tree'],['w1','水源','💧','water'],['w2','水源','💧','water'],['c1','洞穴','🕳️','cave'],['r1','岩石','🪨','rock'],['m1','草地','🌿','meadow'],['f1','花丛','🌼','flower'],['a1','小动物','🦊','animal']],rules:{trees:3,animal:true,flower:true}},
  {tiles:[['t1','树木','🌳','tree'],['t2','树木','🌳','tree'],['t3','树木','🌲','tree'],['t4','树木','🌲','tree'],['t5','树木','🌴','tree'],['w1','水源','💧','water'],['w2','水源','💧','water'],['w3','水源','💧','water'],['c1','洞穴','🕳️','cave'],['r1','岩石','🪨','rock'],['m1','草地','🌿','meadow'],['m2','草地','🌱','meadow'],['f1','花丛','🌼','flower'],['a1','小动物','🦊','animal']],rules:{trees:4,animal:true,flower:true}}
];
function renderForest(stage){
  let levelIndex=Math.min(maxLevel('forest'),2),level,placed={},selected=null,done=false,message='把所有地形放到龟背上，再检查生态关系。';
  function initLevel(){level=FOREST_LEVELS[levelIndex];placed={};selected=null;done=false;message='把所有地形放到龟背上，再检查生态关系。';render();}
  function tileById(id){return level.tiles.find(t=>t[0]===id);}
  function adjacent(i,j){const x=i%5,y=Math.floor(i/5),xx=j%5,yy=Math.floor(j/5);return Math.abs(x-xx)+Math.abs(y-yy)===1;}
  function positions(type){return Object.entries(placed).filter(([cell,id])=>tileById(id)[3]===type).map(([cell])=>Number(cell));}
  function connectedTreeCount(){const trees=positions('tree');if(!trees.length)return 0;const remaining=new Set(trees);let largest=0;while(remaining.size){const start=remaining.values().next().value,seen=new Set([start]),q=[start];remaining.delete(start);while(q.length){const n=q.shift();for(const t of [...remaining]){if(adjacent(n,t)){seen.add(t);remaining.delete(t);q.push(t);}}}largest=Math.max(largest,seen.size);}return largest;}
  function validate(){const reasons=[];const water=positions('water'),trees=positions('tree'),caves=positions('cave'),rocks=positions('rock'),meadows=positions('meadow'),flowers=positions('flower'),animals=positions('animal');
    if(Object.keys(placed).length!==level.tiles.length)reasons.push(`还有 ${level.tiles.length-Object.keys(placed).length} 块地形没有放置`);
    if(water.some(w=>!trees.some(t=>adjacent(w,t))))reasons.push('每一处水源都需要紧挨至少一棵树');
    if(caves.some(c=>!rocks.some(r=>adjacent(c,r))))reasons.push('洞穴需要紧挨岩石');
    if(meadows.length&&meadows.some(m=>!trees.some(t=>adjacent(m,t))))reasons.push('草地需要靠近树木');
    if(level.rules.animal&&animals.some(a=>!meadows.some(m=>adjacent(a,m))))reasons.push('小动物需要靠近草地');
    if(level.rules.flower&&flowers.some(f=>!water.some(w=>adjacent(f,w))))reasons.push('花丛需要靠近水源');
    if(connectedTreeCount()<level.rules.trees)reasons.push(`至少需要 ${level.rules.trees} 棵树连成一片森林`);
    return reasons;
  }
  function render(){
    setStageMeta(`LEVEL 0${levelIndex+1} / 03`,done?'森林苏醒了！':selected?'已选中地形 · 选择龟背空位':'规划一片适合生长的森林');
    const placedIds=new Set(Object.values(placed));
    const rules=[`水源旁边必须有树木`,`洞穴旁边必须有岩石`,`草地需要靠近树木`,...(level.rules.animal?['小动物需要靠近草地']:[]),...(level.rules.flower?['花丛需要靠近水源']:[]),`至少 ${level.rules.trees} 棵树连成森林`];
    stage.innerHTML=`<div class="game-panel-head"><div><div class="game-panel-title">让玄岳背上的森林苏醒</div><div class="game-panel-sub">选中地形，再点击龟背上的格子。点击已放置的地形可取回。</div></div><span class="level-pill">生态岛 ${levelIndex+1} / 3</span></div>
      <div class="forest-layout"><div class="forest-board-card"><div class="truck-board-label"><span>THE TURTLE SHELL / 玄岳背部</span><span>${Object.keys(placed).length}/${level.tiles.length} 已放置</span></div><div class="forest-shell">${Array.from({length:25},(_,i)=>{const id=placed[i],t=id?tileById(id):null;return `<button class="forest-cell ${t?'occupied':''}" data-forest-cell="${i}" aria-label="第 ${i+1} 格">${t?t[2]:'·'}${t?`<small>${t[1]}</small>`:''}</button>`;}).join('')}</div><div class="game-actions"><button class="action-button primary" id="forestCheck">✓ 检查生态</button><button class="action-button" id="forestHint">✦ 规划提示</button><button class="action-button" id="forestClear">清空重摆</button></div><p class="game-note" id="forestMessage">${message}</p></div>
      <div class="forest-tray"><div class="forest-tray-head"><div class="mini-label">LANDSCAPE TILES / 地形</div><div class="forest-tiles">${level.tiles.map(t=>`<button class="forest-tile ${selected===t[0]?'selected':''}" data-forest-tile="${t[0]}" ${placedIds.has(t[0])?'disabled':''}><span>${t[2]}</span><span><strong>${t[1]}</strong><small>${placedIds.has(t[0])?'已放置':'待放置'}</small></span></button>`).join('')}</div></div><div><div class="mini-label">ECOLOGY RULES / 生态条件</div><div class="forest-goals">${rules.map((r,i)=>`<div class="forest-goal"><b>${i+1}</b><span>${r}</span></div>`).join('')}</div></div></div></div><div id="forestResult"></div>`;
    $$('[data-forest-tile]',stage).forEach(btn=>btn.addEventListener('click',()=>{selected=selected===btn.dataset.forestTile?null:btn.dataset.forestTile;render();}));
    $$('[data-forest-cell]',stage).forEach(btn=>btn.addEventListener('click',()=>{const i=Number(btn.dataset.forestCell);if(done)return;if(placed[i]){if(selected){showToast('先放下手中的地形，或点击空格');return;}selected=placed[i];delete placed[i];render();return;}if(!selected){showToast('先从右侧选择一块地形');return;}placed[i]=selected;selected=null;message='地形已放置。继续布置，留意右侧的生态条件。';render();}));
    $('#forestCheck',stage).addEventListener('click',()=>{const reasons=validate();if(reasons.length){message='还需要调整：'+reasons.join('；');$('#forestMessage',stage).textContent=message;showToast('生态条件还没有全部满足');}else{done=true;setLevelProgress('forest',levelIndex+1);render();showSuccess();}});
    $('#forestHint',stage).addEventListener('click',()=>{message='先放置水源，再把树木放在水源旁边；洞穴和岩石也要相邻。最后让树木彼此连接。';$('#forestMessage',stage).textContent=message;});
    $('#forestClear',stage).addEventListener('click',()=>{placed={};selected=null;message='已清空地形，可以重新规划。';render();});
  }
  function showSuccess(){const target=$('#forestResult',stage);target.innerHTML=`<div class="success-panel"><div class="success-icon">🌳</div><h3>${levelIndex===2?'玄岳的森林彻底苏醒了！':'一座小小生态岛诞生了！'}</h3><p>水源、森林与栖息地形成了完整的生态关系。巨龟依然沉睡，背上的生命已经开始生长。</p><div class="game-actions"><button class="action-button" id="forestReplay">重新布置</button><button class="action-button primary" id="forestNext">${levelIndex<2?'下一片森林 →':'从第一片森林再来 →'}</button></div></div>`;$('#forestReplay',stage).addEventListener('click',initLevel);$('#forestNext',stage).addEventListener('click',()=>{levelIndex=levelIndex<2?levelIndex+1:0;initLevel();});}
  initLevel();return {restart:initLevel};
}

