/* Nightwatch: endless backpack defense. Pure browser engine. */
'use strict';
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const W=1080,H=390,GATE=181,LANES=[209,274,337],TAU=Math.PI*2;
const ITEMS={
 bow:{name:'守夜弓',icon:'🏹',tier:1,w:1,h:2,kind:'weapon',damage:9,rate:1.05,range:850,element:'physical',price:7,desc:'稳定单体攻击 · 护甲会减伤'},
 staff:{name:'星火法杖',icon:'🪄',tier:1,w:1,h:2,kind:'weapon',damage:12,rate:1.45,range:790,element:'magic',price:8,desc:'魔法弹无视护甲 · 对幽灵有效'},
 shield:{name:'木铁盾',icon:'🛡️',tier:1,w:1,h:2,kind:'wall',guard:1,price:6,desc:'抵挡漏怪造成的城门伤害'},
 ember:{name:'余烬火种',icon:'🔥',tier:1,w:1,h:1,kind:'support',price:5,desc:'相邻武器附带燃烧，每秒伤害2'},
 frost:{name:'凝霜晶',icon:'❄️',tier:1,w:1,h:1,kind:'support',price:5,desc:'相邻武器附带减速 30%'},
 venom:{name:'毒剂瓶',icon:'🧪',tier:1,w:1,h:1,kind:'support',price:5,desc:'相邻武器附带中毒，每秒伤害3'},
 whet:{name:'磨刀石',icon:'💎',tier:1,w:1,h:1,kind:'support',price:5,desc:'相邻武器物理攻击 +4'},
 repeater:{name:'风暴连弩',icon:'🏹',tier:2,w:2,h:1,kind:'weapon',damage:8,rate:.43,range:890,element:'physical',price:16,desc:'超高速连射 · 易受护甲克制'},
 storm:{name:'雷击法杖',icon:'⚡',tier:2,w:1,h:2,kind:'weapon',damage:17,rate:1.1,range:840,element:'magic',chain:2,price:17,desc:'法术闪电在两名敌人间连锁'},
 bastion:{name:'城防壁垒',icon:'🏰',tier:2,w:2,h:2,kind:'wall',guard:3,regen:1,price:16,desc:'城门减伤3 · 每波额外修复1'},
 brazier:{name:'炽焰熔炉',icon:'🌋',tier:2,w:1,h:1,kind:'support',price:14,desc:'相邻武器附带每秒5点燃烧'},
 glacial:{name:'极寒晶核',icon:'🧊',tier:2,w:1,h:1,kind:'support',price:14,desc:'相邻武器附带55%减速'},
 blight:{name:'剧毒之心',icon:'☣️',tier:2,w:1,h:1,kind:'support',price:14,desc:'相邻武器附带每秒6点毒素'},
 forge:{name:'精磨核心',icon:'⚙️',tier:2,w:1,h:1,kind:'support',price:14,desc:'相邻武器物理攻击 +9'},
 flamebow:{name:'烈焰连弩',icon:'🔥',tier:3,w:2,h:2,kind:'weapon',damage:13,rate:.63,range:880,element:'physical',burn:5,splash:47,price:32,desc:'溅射爆燃 · 小范围连续清怪'},
 icebow:{name:'永霜连弩',icon:'🏹',tier:3,w:2,h:2,kind:'weapon',damage:15,rate:.71,range:925,element:'physical',slow:.57,price:32,desc:'高频冰霜攻击 · 强力减速'},
 plague:{name:'瘟疫雷云',icon:'☣️',tier:3,w:2,h:2,kind:'weapon',damage:20,rate:1.45,range:890,element:'magic',poison:7,splash:67,price:35,desc:'范围毒云 · 持续伤害'},
 thunderfire:{name:'天火雷炮',icon:'🌠',tier:3,w:2,h:2,kind:'weapon',damage:35,rate:1.85,range:920,element:'magic',burn:5,splash:72,price:36,desc:'高爆魔法范围伤害'},
 citadel:{name:'冰棘城塞',icon:'🧊',tier:3,w:2,h:2,kind:'wall',guard:4,regen:3,price:32,desc:'城门大幅减伤 · 每波修复3'},
 furnacewall:{name:'熔火城墙',icon:'🏯',tier:3,w:2,h:2,kind:'wall',guard:3,regen:1,damage:14,rate:1.4,range:520,element:'magic',burn:4,price:32,desc:'城墙防护 · 自动反击附近怪物'},
 apocalypse:{name:'末日天幕',icon:'☄️',tier:4,w:2,h:2,kind:'weapon',damage:67,rate:2.65,range:980,element:'magic',poison:8,burn:6,splash:105,price:75,desc:'大范围陨落轰击 · 毒火叠加'},
 aurora:{name:'极光机关',icon:'🌌',tier:4,w:2,h:2,kind:'weapon',damage:40,rate:1.03,range:980,element:'magic',slow:.65,chain:4,price:75,desc:'连锁极寒法术 · 控制快速敌人'}
};
const RECIPES=[
 ['bow','bow','repeater',4],['staff','staff','storm',4],['shield','shield','bastion',4],
 ['ember','ember','brazier',4],['frost','frost','glacial',4],['venom','venom','blight',4],['whet','whet','forge',4],
 ['repeater','ember','flamebow',8],['repeater','frost','icebow',8],['storm','venom','plague',8],
 ['storm','ember','thunderfire',8],['bastion','glacial','citadel',8],['bastion','brazier','furnacewall',8],
 ['flamebow','plague','apocalypse',16],['icebow','storm','aurora',16]
];
const MONSTERS={
 rat:{name:'掠粮鼠',icon:'🐀',hp:22,speed:67,armor:0,leak:1,bounty:2,r:19,flavor:'成群结队，速度一般。',counter:'基础箭矢即可阻挡。'},
 bat:{name:'暮影蝠',icon:'🦇',hp:17,speed:113,armor:0,leak:1,bounty:2,r:18,flavor:'飞行迅捷，常从侧翼突围。',counter:'冰霜减速和高频连弩。'},
 shell:{name:'铁甲虫',icon:'🪲',hp:78,speed:43,armor:8,leak:2,bounty:4,r:25,flavor:'重甲会大幅抵消物理伤害。',counter:'奥术法杖与雷击法术（无视护甲）。'},
 wolf:{name:'裂风狼',icon:'🐺',hp:56,speed:82,armor:2,leak:2,bounty:3,r:23,flavor:'半血后会加速冲锋。',counter:'冰霜或高爆伤害，别让它接近城门。'},
 mage:{name:'腐蚀祭司',icon:'🧙',hp:74,speed:49,armor:3,leak:2,bounty:5,r:25,flavor:'持续恢复附近怪物的生命。',counter:'范围伤害或优先击杀。'},
 wisp:{name:'游魂',icon:'👻',hp:53,speed:72,armor:0,leak:2,bounty:4,r:22,flavor:'物理伤害减半，且不受中毒影响。',counter:'魔法攻击和减速最有效。'},
 brute:{name:'破城巨兽',icon:'🦏',hp:166,speed:38,armor:5,leak:4,bounty:8,r:32,flavor:'厚血量与极高破门伤害。',counter:'高阶伤害配合冰霜控制。'},
 boss:{name:'永夜龙',icon:'🐉',hp:260,speed:40,armor:6,leak:7,bounty:22,r:44,flavor:'每五波出现。体型巨大，身边怪物会跑得更快。',counter:'溅射与减速并重，留足城门生命。'}
};
const BASIC=['bow','staff','shield','ember','frost','venom','whet'];
const KEY='nightwatch_v2_';
const read=(key,fallback)=>{try{const val=localStorage.getItem(KEY+key);return val?JSON.parse(val):fallback}catch{return fallback}};
const save=(key,value)=>{try{localStorage.setItem(KEY+key,JSON.stringify(value))}catch{}};
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
function rng(seed){let s=seed>>>0||1234567;return()=>{s^=s<<13;s^=s>>>17;s^=s<<5;return(s>>>0)/4294967296}};
const canvas=$('#battlefield'),ctx=canvas.getContext('2d');
let s=null,idSeq=0,lastTime=0,now=0,visualTime=0,frameId=0,toastTimer=null,modalMode='',gamePaused=false,speed=1;
const stars=Array.from({length:55},(_,i)=>({x:(i*613+171)%W,y:12+(i*47)%139,a:.25+(i%5)*.13,r:(i%3===0?1.6:.9)}));
function item(type,x=null,y=null){return{id:++idSeq,type,x,y,rot:0}};
function size(it){const def=ITEMS[it.type];return it.rot?{w:def.h,h:def.w}:{w:def.w,h:def.h}};
function rect(it){const wh=size(it);return{x:it.x,y:it.y,w:wh.w,h:wh.h}};
function adjacent(a,b){
 const p=rect(a),q=rect(b);
 return ((p.x+p.w===q.x||q.x+q.w===p.x)&&p.y<q.y+q.h&&q.y<p.y+p.h)
 ||((p.y+p.h===q.y||q.y+q.h===p.y)&&p.x<q.x+q.w&&q.x<p.x+p.w);
}
function equipped(){return s.items.filter(x=>x.x!==null)};
function gridMap(){const m=new Map();for(const it of equipped()){const r=rect(it);for(let y=r.y;y<r.y+r.h;y++)for(let x=r.x;x<r.x+r.w;x++)m.set(x+','+y,it)}return m}
function fits(it,x,y){const wh=size(it),map=gridMap();if(x<0||y<0||x+wh.w>5||y+wh.h>4)return false;for(let yy=y;yy<y+wh.h;yy++)for(let xx=x;xx<x+wh.w;xx++){const occupant=map.get(xx+','+yy);if(occupant&&occupant.id!==it.id)return false}return true}
function calculate(){
 const eq=equipped(),weapons=[];let guard=0,regen=0,activeCount=0;
 for(const it of eq){const d=ITEMS[it.type];if(d.kind==='wall'){guard+=d.guard||0;regen+=d.regen||0}
 if(d.damage){const w={itemId:it.id,type:it.type,icon:d.icon,name:d.name,damage:d.damage,rate:d.rate,range:d.range,element:d.element||'physical',burn:d.burn||0,poison:d.poison||0,slow:d.slow||0,splash:d.splash||0,chain:d.chain||1};
 const links=[];
 for(const p of eq){if(p.id===it.id||!adjacent(it,p))continue;const pd=ITEMS[p.type];if(pd.kind!=='support')continue;
 if(p.type==='ember'||p.type==='brazier'){w.burn=Math.max(w.burn,p.type==='brazier'?5:2);links.push('燃烧')}
 if(p.type==='frost'||p.type==='glacial'){w.slow=Math.max(w.slow,p.type==='glacial'?.55:.30);links.push('减速')}
 if(p.type==='venom'||p.type==='blight'){w.poison=Math.max(w.poison,p.type==='blight'?6:3);links.push('中毒')}
 if((p.type==='whet'||p.type==='forge')&&w.element==='physical'){w.damage+=p.type==='forge'?9:4;links.push('强化')}
 }w.links=links;weapons.push(w);activeCount++}
 }
 return{weapons,guard:Math.min(6,guard),regen,dps:weapons.reduce((acc,w)=>acc+w.damage/w.rate,0),links:weapons.flatMap(w=>w.links),activeCount,used:eq.reduce((n,it)=>{const v=size(it);return n+v.w*v.h},0)};
}
function stockFor(wave){const r=rng(s.seed+wave*33133),pool=[...BASIC];for(let i=pool.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[pool[i],pool[j]]=[pool[j],pool[i]]}return wave===1?['bow','staff','ember']:pool.slice(0,3)}
function newGame(){if(frameId)cancelAnimationFrame(frameId);idSeq=0;
 s={wave:1,gate:24,maxGate:24,gold:14,seed:(Date.now()^Math.floor(Math.random()*1e6))>>>0,
 items:[item('bow',0,0),item('staff',2,0),item('shield',4,0),item('ember'),item('whet')],
 shop:[],picked:null,materials:[],phase:'prepare',waveQueue:[],spawnAt:0,spawnIndex:0,
 elapsed:0,monsters:[],shots:[],particles:[],bursts:[],turrets:[],notes:[],lastResult:null,
 discovered:new Set(read('codex',[])),best:read('best',0),kills:0,totalLeaks:0,gateFlash:0,ended:false};
 s.shop=stockFor(s.wave).map(type=>({type,sold:false}));gamePaused=false;speed=1;lastTime=0;
 $('#pauseBtn').textContent='⏸ 暂停';$('#speedBtn').textContent='速度 ×1';closeDialog();render();requestLoop();
}
function tip(message){const el=$('#tip');el.textContent=message;el.classList.add('show');if(toastTimer)clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),2400)}
function toastBattle(message){const el=$('#battleToast');el.textContent=message;el.classList.add('show');setTimeout(()=>el.classList.remove('show'),2000)}
function recipeOf(a,b){if(!a||!b)return null;return RECIPES.find(r=>(r[0]===a.type&&r[1]===b.type)||(r[0]===b.type&&r[1]===a.type))||null}
function selectedParts(){return s.materials.map(id=>s.items.find(i=>i.id===id)).filter(Boolean)}
function addMaterial(id){if(s.phase!=='prepare')return;const index=s.materials.indexOf(id);if(index>=0)s.materials.splice(index,1);else{if(s.materials.length>=2)s.materials.shift();s.materials.push(id)}render()}
function craft(){if(s.phase!=='prepare')return;const parts=selectedParts(),recipe=recipeOf(...parts);if(!recipe){tip('这两件装备没有对应合成配方');return}if(s.gold<recipe[3]){tip('金币不足：需要 '+recipe[3]+' 枚');return}
 s.gold-=recipe[3];const ids=new Set(parts.map(x=>x.id));s.items=s.items.filter(it=>!ids.has(it.id));const created=item(recipe[2]);s.items.push(created);
 s.materials=[];s.picked=created.id;tip('合成成功：'+ITEMS[created.type].name+'！已放入仓库');render();
}
function selectItem(id){if(s.phase!=='prepare')return;const it=s.items.find(i=>i.id===id);if(!it)return;
 if(it.x!==null){it.x=null;it.y=null}
 s.picked=s.picked===id?null:id;render()}
function clickCell(x,y){if(s.phase!=='prepare')return;const map=gridMap(),found=map.get(x+','+y);
 if(found){found.x=null;found.y=null;s.picked=found.id;render();return}
 const it=s.items.find(it=>it.id===s.picked);if(!it)return;
 if(!fits(it,x,y)){tip('位置不足，试着旋转装备或移开相邻装备');return}
 it.x=x;it.y=y;s.picked=null;render();
}
function rotateSelected(){if(s.phase!=='prepare')return;const it=s.items.find(it=>it.id===s.picked);if(!it)return;
 const x=it.x,y=it.y;it.x=null;it.y=null;it.rot=1-it.rot;
 if(x!==null&&fits(it,x,y)){it.x=x;it.y=y}render()
}
function clearBag(){if(s.phase!=='prepare')return;for(const it of s.items){it.x=null;it.y=null}s.picked=null;render()}
function sell(id){if(s.phase!=='prepare')return;const it=s.items.find(it=>it.id===id);if(!it)return;
 const value=Math.floor(ITEMS[it.type].price*.5);s.gold+=value;s.items=s.items.filter(i=>i.id!==id);s.materials=s.materials.filter(x=>x!==id);if(s.picked===id)s.picked=null;tip('出售 '+ITEMS[it.type].name+'，获得 '+value+' 金币');render();
}
function buy(index){if(s.phase!=='prepare')return;const offer=s.shop[index];if(!offer||offer.sold)return;const d=ITEMS[offer.type];
 if(s.gold<d.price){tip('金币不足');return} s.gold-=d.price;offer.sold=true;s.items.push(item(offer.type));tip('获得 '+d.name+'，可放入背包或参与合成');render();
}
function repair(){if(s.phase!=='prepare')return;if(s.gate===s.maxGate){tip('城门已经满血');return}if(s.gold<8){tip('修复需要8金币');return}s.gold-=8;s.gate=Math.min(s.maxGate,s.gate+5);tip('修复城门 +5');render()}
function makeWave(wave){
 const r=rng(s.seed+wave*19777),pool=['rat'],picks=[];
 if(wave>=2)pool.push('bat');if(wave>=3)pool.push('shell');if(wave>=4)pool.push('wolf');
 if(wave>=6)pool.push('mage');if(wave>=7)pool.push('wisp');if(wave>=8)pool.push('brute');
 const count=Math.min(36,5+Math.floor(wave*1.5)),bossWave=wave%5===0;
 for(let i=0;i<count;i++){let type=pool[Math.floor(r()*pool.length)];if(wave<=2&&i<2)type='rat';
 const lane=Math.floor(r()*3),delay=.55+i*Math.max(.34,.94-wave*.025);
 picks.push({type,lane,delay})}
 if(bossWave)picks.push({type:'boss',lane:1,delay:2.2+count*Math.max(.34,.94-wave*.025)});
 picks.sort((a,b)=>a.delay-b.delay);return picks
}
function waveForecast(){const list=makeWave(s.wave),kinds=[...new Set(list.map(x=>x.type))];return kinds.map(k=>MONSTERS[k].icon+' '+MONSTERS[k].name).join('、')+(s.wave%5===0?' · ⚠ 首领波！':'')}
function startWave(){if(s.phase!=='prepare')return;const b=calculate();if(!b.weapons.length){tip('先装一件可以攻击的装备（弓、法杖或合成武器）');return}
 s.waveQueue=makeWave(s.wave);s.spawnIndex=0;s.elapsed=0;s.monsters=[];s.shots=[];s.particles=[];s.bursts=[];s.notes=[];
 s.turrets=b.weapons.map((w,i)=>({...w,lane:i%3,y:LANES[i%3]-(Math.floor(i/3)*17-8),cool:.22+i*.18,fireCount:0}));
 s.currentBuild=b;s.phase='battle';gamePaused=false;speed=1;$('#pauseBtn').textContent='⏸ 暂停';$('#speedBtn').textContent='速度 ×1';toastBattle('第 '+s.wave+' 波来袭！防线自动开火');render();
}
function pause(){if(s.phase!=='battle')return;gamePaused=!gamePaused;$('#pauseBtn').textContent=gamePaused?'▶ 继续':'⏸ 暂停';$('#waveTag').textContent=gamePaused?'已暂停':'交战中'}
function toggleSpeed(){if(s.phase!=='battle')return;speed=speed===1?2:1;$('#speedBtn').textContent='速度 ×'+speed}
function encounter(m){if(!s.discovered.has(m.type)){s.discovered.add(m.type);save('codex',[...s.discovered]);$('#bestiaryCounter').textContent=s.discovered.size+' / 8 已发现';if(m.type==='boss')toastBattle('⚠ 永夜龙出现了！')} }
function spawnMonster(template){const d=MONSTERS[template.type],scale=1+(s.wave-1)*.16,boost=s.wave>5?Math.floor((s.wave-5)/5):0;
 const maxHp=Math.round(d.hp*scale),monster={id:++idSeq,type:template.type,lane:template.lane,x:1046+(Math.random()*35),y:LANES[template.lane],hp:maxHp,maxHp,armor:d.armor+boost,speed:d.speed*(1+Math.min(.32,(s.wave-1)*.014)),r:d.r,leak:d.leak,bounty:d.bounty,poison:0,poisonTime:0,burn:0,burnTime:0,slow:0,slowTime:0,healCd:2,bodyTime:Math.random()*6};
 s.monsters.push(monster);encounter(monster)
}
function vfx(x,y,color,count=7,spread=100){for(let i=0;i<count;i++){const angle=Math.random()*TAU,vel=spread*(.3+Math.random());s.particles.push({x,y,vx:Math.cos(angle)*vel,vy:Math.sin(angle)*vel,life:.4+Math.random()*.45,total:.85,color,size:1.5+Math.random()*3})}}
function floatText(x,y,message,color='#fdd8a1'){s.particles.push({x,y,life:.9,total:.9,color,text:message,vx:(Math.random()-.5)*12,vy:-38,size:14})}
function takeHit(m,damage,element){if(!m||m.hp<=0)return;let value=damage;if(element==='physical')value=Math.max(1,damage-m.armor);if(m.type==='wisp'&&element==='physical')value=Math.max(1,Math.round(value*.5));
 m.hp-=value;if(Math.random()<.34)floatText(m.x,m.y-20,Math.round(value),element==='magic'?'#a6cdfa':'#ffe0ac');
 if(m.hp<=0){killMonster(m);return}vfx(m.x,m.y,'#e9b6a5',3,52)
}
function killMonster(m){if(m._dead)return;m._dead=true;s.gold+=m.bounty;s.kills++;vfx(m.x,m.y,'#ffc67d',13,170);floatText(m.x,m.y-28,'+'+m.bounty+'G','#ffe69c');
 s.bursts.push({x:m.x,y:m.y,r:4,life:.35,max:.35,color:'#ffbf82'});}
function projectileHit(p,m){if(!m||m._dead)return;let targets=[m];if(p.splash){for(const next of s.monsters)if(next!==m&&!next._dead&&Math.hypot(next.x-m.x,next.y-m.y)<p.splash)targets.push(next)}
 if(p.chain>1){const nearest=s.monsters.filter(z=>!z._dead&&!targets.includes(z)&&Math.hypot(z.x-m.x,z.y-m.y)<140).sort((a,b)=>Math.hypot(a.x-m.x,a.y-m.y)-Math.hypot(b.x-m.x,b.y-m.y)).slice(0,p.chain-1);targets.push(...nearest)}
 for(let i=0;i<targets.length;i++){const e=targets[i];takeHit(e,p.damage*(i===0?1:.62),p.element);
 if(!e._dead){if(e.type!=='wisp'&&p.poison){e.poison=Math.max(e.poison,p.poison);e.poisonTime=4}
 if(p.burn){e.burn=Math.max(e.burn,p.burn);e.burnTime=3}
 if(p.slow){e.slow=Math.max(e.slow,p.slow);e.slowTime=2.7}}
 if(i>0)s.bursts.push({x:e.x,y:e.y,r:6,life:.20,max:.2,color:'#b1ceff'})}
 if(p.splash||p.chain>1)s.bursts.push({x:m.x,y:m.y,r:p.splash||55,life:.43,max:.43,color:p.burn?'#ffad67':'#95d0f8'});
 vfx(m.x,m.y,p.element==='magic'?'#b2b4ff':'#ffbc78',8,115);
}
function enemyTarget(weapon){return s.monsters.filter(m=>!m._dead&&m.hp>0&&m.x-GATE<=weapon.range).sort((a,b)=>a.x-b.x)[0]||null}
function shoot(w,tgt){const originY=w.y,originX=186+(w.lane%3)*8;const magic=w.element==='magic';
 s.shots.push({x:originX,y:originY,target:tgt.id,targetX:tgt.x,targetY:tgt.y,life:1.35,vel:magic?900:1100,damage:w.damage,element:w.element,burn:w.burn,poison:w.poison,slow:w.slow,splash:w.splash,chain:w.chain,color:w.slow?'#96e4ef':w.burn?'#ffb36d':magic?'#bba3ff':'#ffd59b',r:w.splash?7:4});
 w.fireCount++;s.bursts.push({x:originX,y:originY,r:16,life:.14,max:.14,color:magic?'#a59ff8':'#fff0b5'});
}
function updateBattle(dt){
 s.elapsed+=dt;const list=s.waveQueue;
 while(s.spawnIndex<list.length&&list[s.spawnIndex].delay<=s.elapsed){spawnMonster(list[s.spawnIndex]);s.spawnIndex++}
 const boss=s.monsters.find(m=>m.type==='boss'&&!m._dead);
 for(const m of s.monsters){
 if(m._dead)continue;
 if(m.burnTime>0){m.burnTime-=dt;m.hp-=m.burn*dt}
 if(m.poisonTime>0){m.poisonTime-=dt;m.hp-=m.poison*dt}
 if(m.hp<=0){killMonster(m);continue}
 if(m.slowTime>0)m.slowTime-=dt;
 if(m.type==='mage'){m.healCd-=dt;if(m.healCd<=0){m.healCd=2;for(const ally of s.monsters)if(!ally._dead&&Math.hypot(ally.x-m.x,ally.y-m.y)<115)ally.hp=Math.min(ally.maxHp,ally.hp+8);vfx(m.x,m.y,'#a2e8af',9,70)}}
 let vel=m.speed*(m.slowTime>0?1-m.slow:1);
 if(m.type==='wolf'&&m.hp<m.maxHp*.5)vel*=1.42;
 if(boss&&boss!==m&&Math.hypot(boss.x-m.x,boss.y-m.y)<180)vel*=1.2;
 m.x-=vel*dt;
 if(m.x<=GATE){m._dead=true;let damage=Math.max(1,m.leak-s.currentBuild.guard);s.gate=Math.max(0,s.gate-damage);s.totalLeaks+=damage;s.gateFlash=.55;
 vfx(GATE,m.y,'#ff9c89',14,175);floatText(GATE,m.y-34,'城门 -'+damage,'#ff9e9c');if(s.gate<=0){defeat();return}}
 }
 for(const w of s.turrets){w.cool-=dt;if(w.cool<=0){const tgt=enemyTarget(w);if(tgt){shoot(w,tgt);w.cool+=w.rate;w.cool=Math.max(.04,w.cool)}else w.cool=0}}
 for(const p of s.shots){p.life-=dt;const target=s.monsters.find(m=>m.id===p.target&&!m._dead);if(!target){p.life=0;continue}
 const dx=target.x-p.x,dy=target.y-p.y,d=Math.hypot(dx,dy);if(d<p.vel*dt+target.r*.5){p.life=0;projectileHit(p,target);continue}
 p.x+=dx/d*p.vel*dt;p.y+=dy/d*p.vel*dt;p.targetX=target.x;p.targetY=target.y}
 s.monsters=s.monsters.filter(m=>!m._dead);s.shots=s.shots.filter(p=>p.life>0);
 if(s.spawnIndex>=list.length&&!s.monsters.length&&!s.shots.length)winWave();
}
function winWave(){s.phase='reward';const cleared=s.wave,award=4+Math.floor(cleared/2);s.gold+=award;s.gate=Math.min(s.maxGate,s.gate+s.currentBuild.regen);
 s.best=Math.max(s.best,cleared);save('best',s.best);
 s.lastResult={cleared,award,gate:s.gate,kills:s.kills};
 render();openReward();}
function defeat(){s.phase='gameover';s.best=Math.max(s.best,s.wave-1);save('best',s.best);render();openDialog('result')}
function pickReward(type){if(s.phase!=='reward')return;s.items.push(item(type));s.wave++;s.shop=stockFor(s.wave).map(type=>({type,sold:false}));s.phase='prepare';s.picked=null;s.materials=[];closeDialog();tip('获得 '+ITEMS[type].name+'！下一波敌情已刷新');render()}
function rewardChoices(){const r=rng(s.seed+s.wave*33227);const pool=[...BASIC];for(let i=pool.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[pool[i],pool[j]]=[pool[j],pool[i]]}return pool.slice(0,3)}
function render(){
 if(!s)return;
 const battle=s.phase==='battle',prep=s.phase==='prepare',build=calculate();
 $('#waveHeading').textContent='第 '+s.wave+' 波 · '+(s.wave%5===0?'首领降临':'黎明前');
 $('#waveTag').textContent=s.phase==='battle'?(gamePaused?'已暂停':'交战中'):s.phase==='reward'?'波次通过':s.phase==='gameover'?'防线失守':'准备中';
 $('#waveProgress').textContent=s.wave+' / ∞';
 $('#gateLabel').textContent=s.gate+' / '+s.maxGate;$('#goldLabel').textContent=s.gold;$('#bestLabel').textContent=s.best;
 $('#gateFill').style.width=(s.gate/s.maxGate*100)+'%';
 $('#dangerNote').textContent=battle?'击退 '+(s.spawnIndex)+'/'+s.waveQueue.length+' 名来敌 · 场上 '+s.monsters.length:'城门伤害无法自动回复，别忘了修复城墙';
 $('#forecastText').textContent=battle?'敌潮正在逼近城门':waveForecast();
 $('#pauseBtn').disabled=!battle;$('#speedBtn').disabled=!battle;$('#startWaveBtn').disabled=!prep;
 $('#startWaveBtn').textContent=prep?'⚔ 开始第 '+s.wave+' 波':battle?'⚔ 正在防守…':s.phase==='reward'?'领取战利品':'游戏结束';
 $('#bagUsage').textContent=build.used+' / 20 格';
 $('#stashCount').textContent=s.items.length+' 件';
 const occ=gridMap(),cells=[];
 for(let y=0;y<4;y++)for(let x=0;x<5;x++){const it=occ.get(x+','+y),atAnchor=it&&it.x===x&&it.y===y;let className='bag-cell'+(it?' occupied':'')+(atAnchor?' anchor':'')+(s.picked&&!it?' can-drop':'')+(it&&s.picked===it.id?' picked':'');
 cells.push('<button class="'+className+'" data-cell="'+x+','+y+'" '+(prep?'':'disabled')+' title="'+(it?ITEMS[it.type].name:'空格')+'">'+(atAnchor?ITEMS[it.type].icon:it?'◆':'')+(atAnchor?'<i>'+size(it).w+'×'+size(it).h+'</i>':'')+'</button>')}
 $('#bagGrid').innerHTML=cells.join('');
 $('#bagGrid').querySelectorAll('[data-cell]').forEach(el=>el.onclick=()=>{const [x,y]=el.dataset.cell.split(',').map(Number);clickCell(x,y)});
 $('#rotateGear').disabled=!prep||!s.picked;$('#unequipAll').disabled=!prep;
 const stats=[['攻击装置',build.activeCount+' 件'],['每秒基础伤害',build.dps.toFixed(1)],['城门减伤',build.guard+' 点'],['每波自动修门',build.regen+' 点']];
 $('#buildStats').innerHTML=stats.map(z=>'<div class="build-stat"><strong>'+z[1]+'</strong><span>'+z[0]+'</span></div>').join('');
 $('#buildNotes').textContent=build.links.length?'已激活联动：'+[...new Set(build.links)].join(' / '):'让火种、冰晶、毒瓶和磨刀石紧贴攻击装备，才能触发联动。';
 $('#stashItems').innerHTML=s.items.map(it=>{const d=ITEMS[it.type],selected=s.picked===it.id,material=s.materials.includes(it.id);
 return '<div class="item-card tier-'+d.tier+(selected?' active':'')+(material?' material':'')+'"><div class="item-icon">'+d.icon+'</div><div class="item-info"><b>'+d.name+(it.x!==null?' · 已装备':'')+'</b><small>阶级 '+d.tier+' · '+size(it).w+'×'+size(it).h+' 格 · '+d.desc+'</small></div><div class="item-actions"><button data-equip="'+it.id+'" class="tiny-button" '+(prep?'':'disabled')+'>'+(selected?'已选中':'摆放')+'</button><button data-mat="'+it.id+'" class="tiny-button'+(material?' selected':'')+'" '+(prep?'':'disabled')+'>作材料</button><button data-sell="'+it.id+'" class="tiny-button" '+(prep?'':'disabled')+'>卖 '+Math.floor(d.price*.5)+'G</button></div></div>'
 }).join('');
 if(!s.items.length)$('#stashItems').innerHTML='<div class="empty-state">仓库空空如也 · 可从夜市购买装备</div>';
 $$('#stashItems [data-equip]').forEach(el=>el.onclick=()=>selectItem(+el.dataset.equip));
 $$('#stashItems [data-mat]').forEach(el=>el.onclick=()=>addMaterial(+el.dataset.mat));
 $$('#stashItems [data-sell]').forEach(el=>el.onclick=()=>sell(+el.dataset.sell));
 $('#shopItems').innerHTML=s.shop.map((offer,i)=>{const d=ITEMS[offer.type];return '<button class="shop-item" data-buy="'+i+'" '+(!prep||offer.sold||s.gold<d.price?'disabled':'')+'><span class="icon">'+d.icon+'</span><b>'+d.name+'</b><small>'+(offer.sold?'售罄':'🪙 '+d.price)+'</small></button>'}).join('');
 $$('#shopItems [data-buy]').forEach(el=>el.onclick=()=>buy(+el.dataset.buy));
 $('#repairGate').disabled=!prep||s.gate===s.maxGate||s.gold<8;
 const parts=selectedParts();for(let i=0;i<2;i++){const slot=$('#material'+(i===0?'A':'B')),p=parts[i];slot.classList.toggle('filled',!!p);slot.innerHTML=p?'<span>'+ITEMS[p.type].icon+'</span><small>'+ITEMS[p.type].name+'</small>':'<span>＋</span><small>材料 '+(i===0?'A':'B')+'</small>'}
 const result=recipeOf(...parts);
 $('#craftResult').classList.toggle('matched',!!result);
 $('#craftResult').innerHTML=result?'<b>'+ITEMS[result[2]].icon+' '+ITEMS[result[2]].name+'</b><small>耗费 '+result[3]+' 金币 · '+ITEMS[result[2]].desc+'</small>':parts.length===2?'<b>没有匹配的配方</b><small>点击「查看配方图」寻找可行的合成路线</small>':'<b>选择两件材料</b><small>点击仓库物品的「作材料」，自动预览配方</small>';
 $('#combineBtn').disabled=!prep||!result||s.gold<result[3];
 $('#combineBtn').textContent=result?'⚒ 合成 '+ITEMS[result[2]].name+' · 🪙 '+result[3]:'⚒ 合成装备';
 $('#clearMaterials').disabled=!prep||!s.materials.length;
 $('#bestiaryCounter').textContent=s.discovered.size+' / 8 已发现';
}
function openDialog(mode){
 modalMode=mode;$('#overlay').classList.remove('hidden');$('#overlay').setAttribute('aria-hidden','false');let body='',title='';
 if(mode==='guide'){title='新手上路 · 四步守住城门';body='<div class="guide-step"><i>1</i><div><strong>先摆装备，再开始波次</strong><p>打开下方背包，把武器拖进或点入格子。弓弩负责物理射击，法杖绕过护甲，盾牌能减轻漏怪伤害。</p></div></div><div class="guide-step"><i>2</i><div><strong>看着怪物从右边冲锋</strong><p>装备自动攻击，你可以看到弹道、血条、减速与范围爆炸。漏过城门的怪物会消耗城门生命。交战中不能重新布阵。</p></div></div><div class="guide-step"><i>3</i><div><strong>融合装备，走不同合成分支</strong><p>点击仓库两件装备的「作材料」，按配方花金币合成。合成会真正消耗旧装备，成品回到仓库；高阶装备更强，但要重新布局。</p></div></div><div class="guide-step"><i>4</i><div><strong>打过一波，领一件战利品</strong><p>战斗结束三选一领取装备，夜市同步刷新。每五波有首领；没有终点，尽量挑战最佳波次。关闭浏览器后最佳记录与怪物图鉴仍保留。</p></div></div>'}
 else if(mode==='recipes'){title='装备合成路线图';body='<p class="micro">每次消耗两件装备与金币。材料无论是否装备都可以合成，输出装备自动回到仓库。<strong>合成是选择，不总是强化：</strong>高阶装备可能失去低阶物品的相邻光环效果。</p>';
 for(const tier of [2,3,4]){const recipes=RECIPES.filter(r=>ITEMS[r[2]].tier===tier);
 body+='<div class="recipe-group"><h3>阶级 '+tier+' / '+(tier===2?'基础重铸':tier===3?'元素进阶':'终极机关')+'</h3><div class="recipe-grid">';
 for(const r of recipes){const sources=[r[0],r[1]],counts={};for(const it of s.items)counts[it.type]=(counts[it.type]||0)+1;const possible=sources.every(t=>{const n=counts[t]||0;counts[t]=n-1;return n>0})&&s.gold>=r[3];
 body+='<div class="recipe'+(possible?' match':'')+'"><span class="formula">'+ITEMS[r[0]].icon+' + '+ITEMS[r[1]].icon+' → '+ITEMS[r[2]].icon+'</span><b>'+ITEMS[r[0]].name+' + '+ITEMS[r[1]].name+' → '+ITEMS[r[2]].name+'</b><small>金币 '+r[3]+' · '+ITEMS[r[2]].desc+(possible?' · ✓ 当前可合成':'')+'</small></div>'}body+='</div></div>'}}
 else if(mode==='bestiary'){title='怪物图鉴 · 永夜来客';body='<p class="micro">怪物初次出现在战场时自动记录。未遇到的怪物将隐藏具体能力和弱点。</p><div class="codex-grid">';
 for(const type of Object.keys(MONSTERS)){const m=MONSTERS[type],seen=s.discovered.has(type);
 body+='<div class="codex-card'+(seen?'':' unknown')+'"><div class="codex-avatar">'+(seen?m.icon:'❔')+'</div><div class="codex-copy"><b>'+(seen?m.name:'尚未遇见')+'</b><small>'+(seen?('生命 '+m.hp+' · 护甲 '+m.armor+' · 破门 '+m.leak):'未知威胁')+'</small><p>'+(seen?m.flavor:'再多守住几波，图鉴将自动解锁。')+'</p>'+(seen?'<div class="codex-tag">克制建议：'+m.counter+'</div>':'')+'</div></div>'}body+='</div>'}
 else if(mode==='result'){title='防线失守';body='<div class="result-view"><div class="hero">🌑</div><h3>你坚守到了第 '+s.wave+' 波</h3><p>累计消灭 '+s.kills+' 只怪物，城门承受了 '+s.totalLeaks+' 点伤害。当前最佳：通关第 '+s.best+' 波。调整合成路线后可以再试一次。</p><button id="restartBtn" class="button gold">重新守夜 · 从第1波开始 ↻</button></div>'}
 else if(mode==='reward'){title='第 '+s.wave+' 波守住了！';const opt=rewardChoices();body='<div class="result-view"><div class="hero">🌅</div><h3>黎明短暂降临</h3><p>防线尚存 '+s.gate+'/'+s.maxGate+' 点生命。获得守夜奖励 '+s.lastResult.award+' 金币，再从三件装备中挑选一件。</p></div><div class="reward-grid">'+opt.map(type=>'<button class="reward-card" data-reward="'+type+'"><span>'+ITEMS[type].icon+'</span><b>'+ITEMS[type].name+'</b><small>'+ITEMS[type].desc+'</small></button>').join('')+'</div>'}
 $('#dialogTitle').textContent=title;$('#modalEyebrow').textContent={guide:'GUIDE / HOW TO SURVIVE',recipes:'FORGE / SYNTHESIS TREE',bestiary:'MONSTER ARCHIVE / DISCOVERIES',reward:'DAYBREAK / EQUIPMENT REWARD',result:'LAST DEFENSE / DEFEAT'}[mode]||'NIGHTWATCH';
 $('#modalBody').innerHTML=body;
 $$('#modalBody [data-reward]').forEach(el=>el.onclick=()=>pickReward(el.dataset.reward));
 if($('#restartBtn'))$('#restartBtn').onclick=newGame;
}
function openReward(){openDialog('reward')}
function closeDialog(){if(s&&['reward','gameover'].includes(s.phase))return;$('#overlay').classList.add('hidden');modalMode=''}
$('#openCraftBook').onclick=()=>openDialog('recipes');$('#openBestiary').onclick=()=>openDialog('bestiary');$('#showGuide').onclick=()=>openDialog('guide');
$('#closeOverlay').onclick=closeDialog;$('#overlay').addEventListener('click',e=>{if(e.target===$('#overlay'))closeDialog()});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeDialog();if(e.key===' '&&s&&s.phase==='battle'&&!['INPUT','TEXTAREA'].includes(document.activeElement.tagName)){e.preventDefault();pause()}});
$('#rotateGear').onclick=rotateSelected;$('#unequipAll').onclick=clearBag;$('#combineBtn').onclick=craft;$('#clearMaterials').onclick=()=>{s.materials=[];render()};
$('#repairGate').onclick=repair;$('#startWaveBtn').onclick=startWave;$('#pauseBtn').onclick=pause;$('#speedBtn').onclick=toggleSpeed;
