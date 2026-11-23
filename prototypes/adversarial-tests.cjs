'use strict';
const fs=require('node:fs');
const assert=require('node:assert/strict');
const html=fs.readFileSync(__dirname+'/index.html','utf8');
const match=html.match(/<script>([\s\S]+?)<\/script>/);
assert(match,'Missing inline game logic');
const script=match[1];
const fakeElement=()=>({innerHTML:'',classList:{toggle(){}},querySelector(){return fakeElement()},querySelectorAll(){return []}});
const document={elements:{},querySelector(s){return this.elements[s]||(this.elements[s]=fakeElement())},addEventListener(){}};
const store={getItem(){return '0'},setItem(){}};
const game=new Function('document','window','localStorage','setTimeout','clearTimeout',script+
  '\nreturn {newRunT,newStageT,getT:()=>t,actionT,intentsT,newRunB,getB:()=>b,chooseB,placeB,rotateB,fightB,tickB,calc,rewardOptions,takeReward,fits};'
)(document,{},store,()=>1,()=>{});
const key=p=>p.x+','+p.y;
const neighbors=[[1,0],[-1,0],[0,1],[0,-1]];
function baseReachable(t){
  const blocks=new Set(t.walls.map(key)),queue=[{x:0,y:3,got:false,d:0}],seen=new Set();
  while(queue.length){const q=queue.shift(),code=key(q)+':'+q.got;if(seen.has(code))continue;seen.add(code);
    if(q.got&&q.x===6&&q.y===3)return q.d;
    for(const [dx,dy] of neighbors){const x=q.x+dx,y=q.y+dy;if(x<0||x>6||y<0||y>6||blocks.has(x+','+y))continue;queue.push({x,y,got:q.got||(x===t.key.x&&y===t.key.y),d:q.d+1})}
  }return -1;
}
let mapChecks=0;
for(let seed=1;seed<=100;seed++){game.newRunT();const t=game.getT();t.seed=seed*7919;for(let stage=1;stage<=3;stage++){t.stage=stage;game.newStageT();assert.equal(t.enemies.length,stage);assert(baseReachable(t)>=0);assert(baseReachable(t)<=10);mapChecks++}}
game.newRunT();let t=game.getT();t.p={x:0,y:3};t.walls=[{x:3,y:3}];t.enemies=[{kind:'turret',x:5,y:3,id:2}];
let beam=game.intentsT()[0].cells.map(key);assert(beam.includes('4,3'));assert(!beam.includes('0,3'),'Laser shot through wall');
t.walls=[];t.enemies=[];t.key={x:1,y:3};game.actionT('dash',1,0);assert(t.gotKey,'Dashing across a key must collect it');
game.newRunT();t=game.getT();t.walls=[];t.enemies=[{kind:'hunter',x:4,y:3,id:1}];t.p={x:3,y:3};game.actionT('push',0,0,1);
assert.deepEqual({x:t.enemies[0].x,y:t.enemies[0].y},{x:5,y:3},'Pushed hunter must lose action');
game.newRunB();let b=game.getB();
const placeInitial=()=>{const p=game.getB();for(const [type,x,y] of [['ember',2,1],['whet',2,2]]){const it=p.items.find(q=>q.type===type);game.chooseB(it.id);game.placeB(x,y)}};
placeInitial();
assert.equal(game.calc().physical,8);assert.equal(game.calc().burn,2);
const attack=new Set(['dagger','wand','bow','blade','bomb','curse']);
const survival=new Set(['shield','plate','rune','heart']);
const synergy=new Set(['whet','ember','lens','spark']);
for(let seed=0;seed<100;seed++){b.seed=seed*997+77;const o=game.rewardOptions();assert.equal(o.length,3);assert.equal(o.filter(t=>attack.has(t)).length,1);assert.equal(o.filter(t=>survival.has(t)).length,1);assert.equal(o.filter(t=>synergy.has(t)).length,1)}
const mon=[{hp:18,atk:5,armor:0},{hp:29,atk:7,armor:2},{hp:37,atk:9,armor:1},{hp:46,atk:10,armor:5},{hp:55,atk:11,armor:4}];
function predict(c,night,hp){const m=mon[night-1];let enemy=m.hp;for(let round=1;round<=8;round++){enemy-=Math.max(0,c.physical-m.armor)+c.magic+c.burn+(round===1?c.burst:0);
if(enemy<=0)return{win:true,hp,round};hp=Math.min(42,Math.max(0,hp-Math.max(1,m.atk-c.armor)-c.self+c.heal));if(hp<=0)return{win:false,hp,round,enemy}}return{win:false,hp,round:8,enemy}}
function strategicReward(){
  const b=game.getB(),choices=game.rewardOptions(),next=b.night+1;let best={value:-Infinity};
  for(const type of choices){const candidate={id:-1,type,x:null,y:null,rot:0};b.items.push(candidate);
    for(const rot of [0,1]){candidate.rot=rot;for(let y=0;y<3;y++)for(let x=0;x<4;x++){
      candidate.x=candidate.y=null;if(!game.fits(candidate,x,y))continue;candidate.x=x;candidate.y=y;
      const c=game.calc(),p=predict(c,next,b.hp);
      const value=(p.win?400:-150)+p.hp*3-p.round*7+c.heal*3+c.armor*.8+c.physical*.2+c.magic*.9+c.burn*1.2+c.burst*.3+(p.win?0:-(p.enemy||0)*4);
      if(value>best.value)best={value,type,x,y,rot}
    }}
    b.items.pop();
  }
  if(!best.type){game.takeReward(choices[0]);return}
  game.takeReward(best.type);const item=game.getB().items.at(-1);game.chooseB(item.id);
  if(best.rot)game.rotateB();game.placeB(best.x,best.y);
}
function play(seed,smart){
  game.newRunB();const b=game.getB();b.seed=seed;placeInitial();let iterations=0;
  while(iterations++<5){game.fightB();let turns=0;while(b.mode==='fight'&&turns++<9)game.tickB();
    assert(turns<=9,'Battle failed to terminate');
    if(b.mode==='reward'){if(smart)strategicReward();else game.takeReward(game.rewardOptions()[0]);continue}
    assert(['win','lose'].includes(b.mode),'Unexpected final state '+b.mode);return{win:b.mode==='win',night:b.night,hp:b.hp}
  }
  throw Error('Five-night loop failed to terminate');
}
const stats={smart:{wins:0,fail:{}},baseline:{wins:0,fail:{}}};
for(let i=0;i<100;i++){const p=play(i*7919+77,true);stats.smart.wins+=+p.win;if(!p.win)stats.smart.fail[p.night]=(stats.smart.fail[p.night]||0)+1}
for(let i=0;i<40;i++){const p=play(i*7919+77,false);stats.baseline.wins+=+p.win;if(!p.win)stats.baseline.fail[p.night]=(stats.baseline.fail[p.night]||0)+1}
assert(stats.smart.wins>=50,'Strategic bot wins fewer than half its runs; potential unfair difficulty');
assert(stats.smart.wins<=95,'Strategic bot wins almost all its runs; potential solved build');
assert(stats.baseline.wins<=5,'Ignoring all loot is too effective');
console.log('TACTICS',mapChecks,'valid maps; turret wall; key dash; push stun all PASS');
console.log('BACKPACK smart',stats.smart.wins+'/100, no-loot baseline',stats.baseline.wins+'/40');
console.log('BACKPACK DETAILS',JSON.stringify(stats));
console.log('NOTE automated bots and browser tests cannot establish human enjoyment.');
