'use strict';

const GAMES = [
  { id:'truck', no:'01', name:'最后一车', en:'THE LAST LOAD', tag:'空间益智', desc:'把所有货物塞进有限的车厢。顺序、旋转和空间利用，每一步都很关键。', short:'把货物装进刚刚好的车厢', emoji:'📦', color:'linear-gradient(135deg,#f5d17c,#d99a52)', time:'3–6 MIN', difficulty:'轻度烧脑', goals:['把所有货物放进车厢','货物不能重叠，也不能超出边界','选中货物后可旋转，再点击目标格放置'], tip:'先放占地最大的货物。点击货物选中，再点击车厢中的位置；也可以旋转后再放。' },
  { id:'demo', no:'02', name:'拆迁队：最后一铲', en:'ONE LAST BLAST', tag:'物理解压', desc:'找准爆破点，用有限的炸药拆掉整栋建筑。位置不对，就得重新想办法。', short:'找准爆破点，一次拆个痛快', emoji:'💥', color:'linear-gradient(135deg,#f5a28b,#d86f67)', time:'2–4 MIN', difficulty:'观察判断', goals:['点击画面选择爆破位置','每关炸药数量有限','清除所有红色建筑方块即可通关'], tip:'爆破范围有限。尽量让一次爆炸覆盖更多方块，别把炸药浪费在边缘。' },
  { id:'tea', no:'03', name:'茶汤有度', en:'A CUP OF LOGIC', tag:'逻辑益智', desc:'在不同容量的茶杯之间倒水，最终让每只杯子都达到指定水位。', short:'把每一杯茶倒到恰好的刻度', emoji:'🍵', color:'linear-gradient(135deg,#c7dba2,#83b99d)', time:'3–5 MIN', difficulty:'耐心推理', goals:['点击一只杯子作为倒水来源','再点击另一只杯子进行倾倒','水会一直倒到来源为空或目标装满'], tip:'每次倒水都会尽可能倒满目标杯或倒空来源杯。卡住时可以使用提示，系统会计算下一步。' },
  { id:'restore', no:'04', name:'旧物修复所', en:'THE RESTORE ROOM', tag:'收集治愈', desc:'擦去旧物上的灰尘，找回缺失的零件，让沉睡多年的老物件重新运转。', short:'把一件旧物重新修好', emoji:'📻', color:'linear-gradient(135deg,#d4b5a0,#ad8b79)', time:'3–5 MIN', difficulty:'轻松收集', goals:['先点击物品上的灰尘完成清理','从零件托盘选择一个零件','再点击对应的安装位置'], tip:'先清洁，再装配。零件必须放入对应的槽位，全部安装完成即可修复成功。' },
  { id:'mine', no:'05', name:'地底 100 层', en:'DOWN THE SHAFT', tag:'反应挑战', desc:'矿车不断向地底冲刺。躲开落石、尖刺，收集矿晶，看看你能深入多少米。', short:'躲避障碍，向地底不断深入', emoji:'⛏️', color:'linear-gradient(135deg,#a7b6d1,#7188ad)', time:'1–2 MIN', difficulty:'手眼协调', goals:['使用 ← → 或屏幕按钮切换轨道','避开落石和尖刺，收集蓝色矿晶','坚持 35 秒即可完成本次挑战'], tip:'不要只盯着眼前的障碍，提前观察下一波。受伤后会短暂无敌，抓住时间调整位置。' },
  { id:'forest', no:'06', name:'玄岳背上的小森林', en:'THE TURTLE GARDEN', tag:'生态布局', desc:'在沉睡巨龟的背上安放树木、水源与洞穴，让一座小小的生态岛慢慢苏醒。', short:'在巨龟背上拼出一片森林', emoji:'🐢', color:'linear-gradient(135deg,#a9d2aa,#5e9b83)', time:'4–7 MIN', difficulty:'空间规划', goals:['选中一种地形，再点击龟背上的空格','树木、水源、洞穴等需要满足相邻关系','全部摆放后检查生态目标'], tip:'先规划水源和树木，再安排洞穴、岩石与动物。点击已经放好的格子，可以把地形取回重新摆放。' }
];

const $ = (selector, root=document) => root.querySelector(selector);
const $$ = (selector, root=document) => [...root.querySelectorAll(selector)];
let activeGame = null;
let activeController = null;
let toastTimer = null;
let progress = loadProgress();

function loadProgress(){
  try { return JSON.parse(localStorage.getItem('playroom-progress-v1') || '{}'); }
  catch { return {}; }
}
function saveProgress(){ try { localStorage.setItem('playroom-progress-v1', JSON.stringify(progress)); } catch {} }
function maxLevel(id){ return Math.max(0, Number(progress[id]?.level || 0)); }
function setLevelProgress(id, level){
  progress[id] = progress[id] || {};
  progress[id].level = Math.max(Number(progress[id].level || 0), level);
  progress[id].played = true;
  saveProgress();
}
function showToast(message){
  const el = $('#toast'); if(!el) return;
  el.textContent = message; el.classList.add('show');
  clearTimeout(toastTimer); toastTimer = setTimeout(()=>el.classList.remove('show'), 2100);
}
function setStageMeta(label, hint){ $('#stageLabel').textContent = label; $('#stageHint').textContent = hint; }
function gameById(id){ return GAMES.find(g=>g.id===id); }
function escapeHtml(value){ return String(value).replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

function renderHome(){
  const grid = $('#gamesGrid');
  grid.innerHTML = GAMES.map(g=>`
    <article class="game-card" data-open-game="${g.id}" tabindex="0" role="button" aria-label="开始游戏：${g.name}">
      <div class="card-art" style="background:${g.color}">
        <span class="art-label">${g.no} / ${g.en}</span><span class="art-orbit"></span><span class="art-emoji">${g.emoji}</span>
      </div>
      <div class="card-body">
        <div class="card-top"><span class="card-number">NO. ${g.no}</span><span class="card-tag">${g.tag}</span></div>
        <h3>${g.name}</h3><p>${g.desc}</p>
        <div class="card-bottom"><span>${g.time}　·　${g.difficulty}</span><span class="play-arrow">↗</span></div>
      </div>
    </article>`).join('');
  $$('[data-open-game]', grid).forEach(card=>{
    card.addEventListener('click',()=>openGame(card.dataset.openGame));
    card.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openGame(card.dataset.openGame);}});
  });
}

function openGame(id){
  const game = gameById(id); if(!game) return;
  activeGame = id;
  $('#homeView').hidden = true; $('#gameView').hidden = false;
  $('#gameNavName').textContent = game.name;
  $('#gameInfo').innerHTML = `
    <div class="info-kicker">${game.no} / ${game.en}</div>
    <h1 class="info-title">${game.name}</h1>
    <p class="info-desc">${game.desc}</p>
    <div class="info-divider"></div>
    <div class="objective-title">HOW TO PLAY / 游戏目标</div>
    <div class="objective-list">${game.goals.map((goal,i)=>`<div class="objective-item"><span class="objective-bullet">${i+1}</span><span>${goal}</span></div>`).join('')}</div>
    <div class="info-tip">✳ 小提示：${game.tip}</div>
    <div class="info-stats"><div class="info-stat"><strong>${game.time.split(' ')[0]}</strong><span>预计游玩</span></div><div class="info-stat"><strong>${game.difficulty}</strong><span>体验类型</span></div></div>`;
  history.replaceState(null,'',`#${id}`);
  mountGame(id);
  window.scrollTo({top:0,behavior:'smooth'});
}
function backHome(){
  if(activeController?.destroy) activeController.destroy();
  activeGame = null; activeController = null;
  $('#gameView').hidden = true; $('#homeView').hidden = false;
  history.replaceState(null,'', '#home');
  window.scrollTo({top:0,behavior:'smooth'});
}
function mountGame(id){
  if(activeController?.destroy) activeController.destroy();
  const stage = $('#gameStage'); stage.innerHTML = '';
  if(id==='truck') activeController = renderTruck(stage);
  else if(id==='demo') activeController = renderDemolition(stage);
  else if(id==='tea') activeController = renderTea(stage);
  else if(id==='restore') activeController = renderRestore(stage);
  else if(id==='mine') activeController = renderMine(stage);
  else if(id==='forest') activeController = renderForest(stage);
}
$('#backHome').addEventListener('click', backHome);
$('#restartGame').addEventListener('click',()=>{ if(activeController?.restart) activeController.restart(); });
window.addEventListener('hashchange',()=>{
  const id = location.hash.replace('#','');
  if(!id || id==='home'){ if(activeGame) backHome(); }
  else if(gameById(id) && id!==activeGame) openGame(id);
});

