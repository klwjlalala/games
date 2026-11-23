/* 01 — THE LAST LOAD */
const TRUCK_LEVELS = [
  {cols:5,rows:4,par:7,pieces:[
    {id:'a',w:3,h:2,name:'冷链大箱',icon:'🧊',kind:'cold'},
    {id:'b',w:2,h:2,name:'精密仪器',icon:'📺',kind:'fragile'},
    {id:'c',w:2,h:2,name:'木箱货物',icon:'🪵',kind:'wood'},
    {id:'d',w:2,h:1,name:'蔬果箱',icon:'🥬',kind:'green'},
    {id:'e',w:2,h:1,name:'礼品箱',icon:'🎁',kind:'gold'},
    {id:'f',w:1,h:2,name:'玻璃瓶',icon:'🧴',kind:'fragile'}
  ]},
  {cols:4,rows:4,par:8,pieces:[
    {id:'a',w:2,h:2,name:'工具箱',icon:'🧰',kind:'wood'},
    {id:'b',w:2,h:2,name:'冷藏箱',icon:'🧊',kind:'cold'},
    {id:'c',w:2,h:1,name:'水果箱',icon:'🍎',kind:'green'},
    {id:'d',w:2,h:1,name:'礼物箱',icon:'🎁',kind:'gold'},
    {id:'e',w:2,h:1,name:'玻璃箱',icon:'🥛',kind:'fragile'},
    {id:'f',w:2,h:1,name:'木板箱',icon:'🪵',kind:'wood'}
  ]},
  {cols:6,rows:4,par:6,pieces:[
    {id:'a',w:3,h:2,name:'超大货柜',icon:'🧊',kind:'cold'},
    {id:'b',w:3,h:2,name:'超大货柜',icon:'📦',kind:'gold'},
    {id:'c',w:3,h:2,name:'超大货柜',icon:'🪵',kind:'wood'},
    {id:'d',w:3,h:2,name:'超大货柜',icon:'🥬',kind:'green'}
  ]}
];
function renderTruck(stage){
  let levelIndex = Math.min(maxLevel('truck'), TRUCK_LEVELS.length-1);
  let level, pieces, selectedId=null, moves=0, done=false;
  function initLevel(){
    level=TRUCK_LEVELS[levelIndex]; pieces=level.pieces.map(p=>({...p,baseW:p.w,baseH:p.h,x:null,y:null}));
    // The tray order is intentionally mixed so the player has to plan the loading sequence.
    pieces = [...pieces].sort((a,b)=>((a.id.charCodeAt(0)*7+levelIndex*5)%11)-((b.id.charCodeAt(0)*7+levelIndex*5)%11));
    selectedId=null;moves=0;done=false;render();
  }
  function pieceById(id){return pieces.find(p=>p.id===id);}
  function canPlace(piece,x,y){
    if(x<0||y<0||x+piece.w>level.cols||y+piece.h>level.rows)return false;
    for(const other of pieces){if(other.id===piece.id||other.x===null)continue;
      if(x<other.x+other.w&&x+piece.w>other.x&&y<other.y+other.h&&y+piece.h>other.y)return false;
    }
    return true;
  }
  function render(){
    setStageMeta(`LEVEL 0${levelIndex+1} / 03`,done?'装车完成！':selectedId?'已选中货物 · 选择目标位置':'选择货物开始装车');
    stage.innerHTML=`
      <div class="game-panel-head"><div><div class="game-panel-title">把货物装进车厢</div><div class="game-panel-sub">点击货物选中，再点击车厢中的空位放置</div></div><span class="level-pill">${level.cols} × ${level.rows} 货厢</span></div>
      <div class="truck-layout">
        <div class="truck-board-card"><div class="truck-board-label"><span>LOADING BAY / 货厢</span><span>必须填满每一格</span></div>
          <div class="truck-board" id="truckBoard" style="aspect-ratio:${level.cols}/${level.rows};background-size:${100/level.cols}% ${100/level.rows}%">
            ${Array.from({length:level.cols*level.rows},(_,i)=>`<button class="truck-cell-hit" data-cell="${i%level.cols},${Math.floor(i/level.cols)}" aria-label="位置 ${i%level.cols+1},${Math.floor(i/level.cols)+1}" style="left:${(i%level.cols)/level.cols*100}%;top:${Math.floor(i/level.cols)/level.rows*100}%;width:${100/level.cols}%;height:${100/level.rows}%"></button>`).join('')}
          </div>
          <div class="truck-score"><div><strong>${pieces.filter(p=>p.x!==null).length}/${pieces.length}</strong><span>已装货物</span></div><div><strong>${moves}</strong><span>放置次数</span></div><div><strong>${level.par}</strong><span>参考步数</span></div></div>
        </div>
        <div class="truck-tray-card"><div class="mini-label">CARGO LIST / 待装货物</div><div class="truck-tray" id="truckTray"></div>
          <div class="truck-instructions">${selectedId?'已选中：点击空白格放置。也可以旋转货物。':'先挑选一件货物。大件优先，边角留给小件。'}</div>
          <div class="game-actions"><button class="action-button" id="truckRotate" ${selectedId?'':'disabled'}>↻ 旋转货物</button><button class="action-button" id="truckClear">清空车厢</button></div>
        </div>
      </div>
      <div id="truckResult"></div>`;
    const board=$('#truckBoard',stage), tray=$('#truckTray',stage);
    pieces.filter(p=>p.x!==null).forEach(p=>{
      const el=document.createElement('button');el.className=`truck-piece ${p.kind}${p.id===selectedId?' selected':''}`;el.style.left=`${p.x/level.cols*100}%`;el.style.top=`${p.y/level.rows*100}%`;el.style.width=`${p.w/level.cols*100}%`;el.style.height=`${p.h/level.rows*100}%`;el.dataset.piece=p.id;el.innerHTML=`<span>${p.icon}</span><small>${p.w}×${p.h}</small>`;el.title=p.name;
      el.addEventListener('click',e=>{e.stopPropagation();if(done)return;selectedId=selectedId===p.id?null:p.id;render();});board.appendChild(el);
    });
    pieces.filter(p=>p.x===null).forEach(p=>{
      const btn=document.createElement('button');btn.className=`truck-item ${p.id===selectedId?'selected':''}`;btn.dataset.trayId=p.id;btn.innerHTML=`<span class="item-emoji">${p.icon}</span><span><strong>${p.name}</strong><small>${p.w} × ${p.h} 格</small></span>`;btn.addEventListener('click',()=>{if(done)return;selectedId=selectedId===p.id?null:p.id;render();});tray.appendChild(btn);
    });
    $$('.truck-cell-hit',board).forEach(btn=>btn.addEventListener('click',()=>{
      if(done||!selectedId)return;
      const [x,y]=btn.dataset.cell.split(',').map(Number),p=pieceById(selectedId);
      if(!canPlace(p,x,y)){showToast('这里放不下，试试别的位置或旋转货物');return;}
      p.x=x;p.y=y;moves++;selectedId=null;
      const filled=pieces.reduce((sum,p)=>sum+(p.x===null?0:p.w*p.h),0);
      if(pieces.every(p=>p.x!==null)&&filled===level.cols*level.rows){done=true;setLevelProgress('truck',levelIndex+1);}
      render();
      if(done) showTruckSuccess();
    }));
    $('#truckRotate',stage).addEventListener('click',()=>{
      const p=pieceById(selectedId);if(!p)return;
      const oldW=p.w,oldH=p.h;p.w=oldH;p.h=oldW;
      if(p.x!==null&&!canPlace(p,p.x,p.y)){p.w=oldW;p.h=oldH;showToast('旋转后会和其他货物冲突');return;}
      render();
    });
    $('#truckClear',stage).addEventListener('click',()=>{if(done)return;pieces.forEach(p=>{p.x=null;p.y=null;p.w=p.baseW;p.h=p.baseH;});selectedId=null;moves=0;render();});
  }
  function showTruckSuccess(){
    const target=$('#truckResult',stage);if(!target)return;
    target.innerHTML=`<div class="success-panel"><div class="success-icon">🚚</div><h3>${levelIndex===2?'三趟货物全部装载完成！':'装车完成，准时发车！'}</h3><p>你用了 ${moves} 次放置完成这次装车。${moves<=level.par?'布局很利落！':'还有空间优化的余地，再挑战一次？'}</p><div class="game-actions"><button class="action-button" id="truckReplay">再装一次</button>${levelIndex<2?'<button class="action-button primary" id="truckNext">下一车 →</button>':'<button class="action-button primary" id="truckAgain">从头挑战 →</button>'}</div></div>`;
    $('#truckReplay',stage).addEventListener('click',initLevel);
    const next=$('#truckNext',stage)||$('#truckAgain',stage);next.addEventListener('click',()=>{levelIndex=levelIndex<2?levelIndex+1:0;initLevel();});
  }
  initLevel();
  return {restart:initLevel};
}

