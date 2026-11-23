/* 04 — THE RESTORE ROOM */
const RESTORE_LEVELS=[
  {name:'老式收音机',emoji:'📻',parts:[['antenna','天线','📡'],['speaker','扬声器','🔊'],['dial','调频旋钮','🎛️'],['battery','电池仓','🔋'],['knob','音量旋钮','⚙️']]},
  {name:'胶片相机',emoji:'📷',parts:[['lens','镜头','🔍'],['shutter','快门','📸'],['flash','闪光灯','💡'],['film','胶卷','🎞️'],['strap','相机背带','〰️']]},
  {name:'机械座钟',emoji:'🕰️',parts:[['hands','指针','🕒'],['gear','齿轮','⚙️'],['pendulum','钟摆','🪙'],['bell','报时铃','🔔'],['key','发条钥匙','🗝️']]}
];
function renderRestore(stage){
  let levelIndex=Math.min(maxLevel('restore'),2),level,cleaned=0,cleanedDust=[],installed={},selected=null,done=false;
  const dustPositions=[['22%','30%'],['67%','22%'],['54%','67%']];
  function initLevel(){level=RESTORE_LEVELS[levelIndex];cleaned=0;cleanedDust=[];installed={};selected=null;done=false;render();}
  function render(){
    setStageMeta(`LEVEL 0${levelIndex+1} / 03`,done?'修复完成！':cleaned<3?'先清洁旧物表面':'选择零件并放入对应槽位');
    const count=Object.keys(installed).length;
    stage.innerHTML=`<div class="game-panel-head"><div><div class="game-panel-title">${cleaned<3?'第一步：清洁表面':'第二步：安装零件'}</div><div class="game-panel-sub">${cleaned<3?`找到并擦掉旧物上的灰尘（${cleaned}/3）`:'从零件托盘选择零件，再点击对应的安装位置'}</div></div><span class="level-pill">${level.name}</span></div>
      <div class="restore-layout">
        <div class="restore-object"><div class="artifact-emoji">${level.emoji}</div><div class="artifact-name">${level.name}</div><div class="artifact-state">${cleaned<3?'积满灰尘 · 等待清洁':done?'已恢复运转 · 状态良好':'等待安装缺失零件'}</div>
          ${cleaned<3?dustPositions.map((p,i)=>cleanedDust.includes(i)?'':`<button class="dust-spot" data-dust="${i}" aria-label="擦掉灰尘" style="position:absolute;left:${p[0]};top:${p[1]};width:29px;height:29px;border-radius:50%;border:1px solid #f5ca6390;background:#f5ca6338;color:#f5d988;font-size:15px;box-shadow:0 0 20px #f5ca6330">✦</button>`).join(''):`<div class="restore-slots">${level.parts.map(([id,name,icon])=>`<button class="restore-slot ${installed[id]?'filled':''}" data-slot="${id}" ${cleaned<3?'disabled':''}><span class="slot-icon">${installed[id]?icon:'＋'}</span><span class="slot-copy"><strong>${name}</strong><small>${installed[id]?'已安装':'等待零件'}</small></span></button>`).join('')}</div>`}
        </div>
        <div class="restore-tray"><div class="mini-label">SPARE PARTS / 零件托盘</div><div class="restore-parts">${level.parts.map(([id,name,icon])=>`<button class="restore-part ${selected===id?'selected':''}" data-part="${id}" ${cleaned<3||installed[id]?'disabled':''}><span>${icon}</span><span><strong>${name}</strong><small>${installed[id]?'已安装':'待安装'}</small></span></button>`).join('')}</div><div class="restore-progress"><span style="width:${count/level.parts.length*100}%"></span></div><div class="restore-progress-label"><span>修复进度</span><strong>${count} / ${level.parts.length}</strong></div><div class="game-actions"><button class="action-button" id="restoreReset">重新修复</button></div><p class="game-note">${cleaned<3?'点击物品上发光的灰尘，把它们全部擦干净。':'每个零件都有唯一对应的安装位置。装错了不会消耗零件。'}</p></div>
      </div><div id="restoreResult"></div>`;
    $$('[data-dust]',stage).forEach(btn=>btn.addEventListener('click',()=>{if(cleaned>=3)return;cleanedDust.push(Number(btn.dataset.dust));cleaned=cleanedDust.length;render();if(cleaned===3)showToast('清洁完成！开始安装零件吧');}));
    $$('[data-part]',stage).forEach(btn=>btn.addEventListener('click',()=>{if(cleaned<3||btn.disabled)return;selected=selected===btn.dataset.part?null:btn.dataset.part;render();}));
    $$('[data-slot]',stage).forEach(btn=>btn.addEventListener('click',()=>{
      if(!selected||btn.disabled)return;const slot=btn.dataset.slot;
      if(slot!==selected){btn.classList.add('wrong');setTimeout(()=>btn.classList.remove('wrong'),400);showToast('这个零件和安装位置不匹配');return;}
      installed[slot]=true;selected=null;if(Object.keys(installed).length===level.parts.length){done=true;setLevelProgress('restore',levelIndex+1);}render();if(done)showSuccess();
    }));
    $('#restoreReset',stage).addEventListener('click',initLevel);
  }
  function showSuccess(){const target=$('#restoreResult',stage);target.innerHTML=`<div class="success-panel"><div class="success-icon">✨</div><h3>${level.name}，焕然一新！</h3><p>灰尘已经擦净，所有零件都回到了正确的位置。又一件旧物重新拥有了生命。</p><div class="game-actions"><button class="action-button" id="restoreReplay">再修一次</button><button class="action-button primary" id="restoreNext">${levelIndex<2?'下一件旧物 →':'再开一间修复室 →'}</button></div></div>`;$('#restoreReplay',stage).addEventListener('click',initLevel);$('#restoreNext',stage).addEventListener('click',()=>{levelIndex=levelIndex<2?levelIndex+1:0;initLevel();});}
  initLevel();return {restart:initLevel};
}

