const {test,expect}=require('@playwright/test');
const URL='http://127.0.0.1:4173/prototypes/nightwatch/';
test.beforeEach(async({page})=>{await page.goto(URL);await expect(page.locator('#bagGrid .bag-cell')).toHaveCount(20);});
test('loads live game, 20-slot backpack and 15 crafting paths with no JS error',async({page})=>{
 const errors=[];page.on('pageerror',err=>errors.push(err.message));
 await expect(page.locator('canvas#battlefield')).toBeVisible();
 await expect(page.locator('#stashItems .item-card')).toHaveCount(5);
 await page.locator('#openCraftBook').click();await expect(page.locator('#dialogTitle')).toContainText('合成');
 await expect(page.locator('#modalBody .recipe')).toHaveCount(15);
 await page.locator('#closeOverlay').click();
 await page.locator('#openBestiary').click();await expect(page.locator('#modalBody .codex-card')).toHaveCount(8);
 await page.locator('#closeOverlay').click();await expect.poll(()=>errors).toEqual([]);
});
test('monster advances leftward across real battlefield and is recorded in bestiary',async({page},testInfo)=>{
 await page.locator('#startWaveBtn').click();
 await expect.poll(()=>page.evaluate(()=>window.__nightwatch.state.monsters.length),{timeout:5000}).toBeGreaterThan(0);
 const old=await page.evaluate(()=>window.__nightwatch.state.monsters[0].x);
 await page.waitForTimeout(340);
 const newer=await page.evaluate(()=>window.__nightwatch.state.monsters[0]?.x ?? -1);
 expect(newer).toBeLessThan(old);
 await expect.poll(()=>page.evaluate(()=>window.__nightwatch.state.discovered.has('rat'))).toBeTruthy();
 await page.screenshot({path:testInfo.outputPath('nightwatch-battle.png'),fullPage:true});
});
test('buying a second bow and crafting the repeater consumes components',async({page})=>{
 await page.locator('[data-dock="market"]').click();
 await page.locator('#shopItems [data-buy="0"]').click();
 await page.locator('[data-dock="inventory"]').click();
 const bows=await page.evaluate(()=>window.__nightwatch.state.items.filter(x=>x.type==='bow').map(x=>x.id));
 expect(bows).toHaveLength(2);
 await page.locator('#stashItems [data-mat="'+bows[0]+'"]').click();
 await page.locator('#stashItems [data-mat="'+bows[1]+'"]').click();
 await expect(page.locator('[data-pane="forge"]')).toBeVisible();
 await expect(page.locator('#craftResult')).toContainText('风暴连弩');
 const before=await page.evaluate(()=>window.__nightwatch.state.gold);
 await page.locator('#combineBtn').click();
 const result=await page.evaluate(()=>({gear:window.__nightwatch.state.items.map(x=>x.type),gold:window.__nightwatch.state.gold}));
 expect(result.gear.filter(x=>x==='bow')).toHaveLength(0);
 expect(result.gear).toContain('repeater');
 expect(result.gold).toBe(before-4);
});
test('player can move a support aura beside weapon and preview active synergy',async({page})=>{
 const ember=await page.evaluate(()=>window.__nightwatch.state.items.find(x=>x.type==='ember').id);
 await page.locator('#stashItems [data-equip="'+ember+'"]').click();
 await page.locator('#bagGrid [data-cell="1,0"]').click();
 const stats=await page.evaluate(()=>window.__nightwatch.build());
 expect(stats.links).toContain('燃烧');
 await expect(page.locator('#buildNotes')).toContainText('燃烧');
});
test('game processes real combat to victory, grants loot, and prepares next wave',async({page})=>{
 await page.locator('#startWaveBtn').click();
 const result=await page.evaluate(()=>{const api=window.__nightwatch;let i=0;while(api.state.phase==='battle'&&i++<1200)api.step(.05);return{phase:api.state.phase,step:i,gate:api.state.gate}});
 expect(result.phase).toBe('reward');
 await expect(page.locator('#modalBody [data-reward]')).toHaveCount(3);
 await page.locator('#modalBody [data-reward]').first().click();
 await expect(page.locator('#waveHeading')).toContainText('第 2 波');
 await expect(page.locator('#startWaveBtn')).toBeEnabled();
});
test('mobile viewport does not overflow and retains all primary controls',async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.reload();
 await expect(page.locator('#startWaveBtn')).toBeVisible();
 await page.locator('[data-dock="forge"]').click();
 await expect(page.locator('#combineBtn')).toBeVisible();
 const layout=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,width:window.innerWidth}));
 expect(layout.scroll).toBeLessThanOrEqual(layout.width+2);
});


test('V4 miniature battlefield and desktop composition and multi-slot illustrated gear',async({page},testInfo)=>{
 await page.setViewportSize({width:1440,height:1000});await page.reload();
 await expect(page.locator('#bagGrid .bag-art')).toHaveCount(3);
 await expect(page.locator('#stashItems .gear-art')).toHaveCount(5);
 const b=await page.evaluate(()=>{
  const arena=document.querySelector('.arena-shell').getBoundingClientRect();
  const bag=document.querySelector('.bag-panel').getBoundingClientRect();
  const cell=document.querySelector('[data-cell="0,0"]').getBoundingClientRect();
  const item=document.querySelector('[data-cell="0,0"] .bag-art').getBoundingClientRect();
  return {arenaRight:arena.right,bagLeft:bag.left,arenaTop:arena.top,bagTop:bag.top,itemHeight:item.height,cellHeight:cell.height,scrollWidth:document.documentElement.scrollWidth};
 });
 expect(b.bagLeft).toBeGreaterThanOrEqual(b.arenaRight-1);
 expect(Math.abs(b.bagTop-b.arenaTop)).toBeLessThan(4);
 expect(b.itemHeight).toBeGreaterThan(b.cellHeight*1.7);
 expect(b.scrollWidth).toBeLessThanOrEqual(1442);
 await page.screenshot({path:testInfo.outputPath('nightwatch-v4-desktop.png'),fullPage:true});
 await page.locator('#openCraftBook').click();
 await expect(page.locator('.recipe .gear-art')).toHaveCount(45);
 await page.screenshot({path:testInfo.outputPath('nightwatch-v4-recipes.png'),fullPage:true});
 await page.locator('#closeOverlay').click();
 await page.locator('#openBestiary').click();
 await expect(page.locator('.codex-avatar .monster-art')).toHaveCount(8);
 await page.screenshot({path:testInfo.outputPath('nightwatch-v4-bestiary.png'),fullPage:true});
});


test('V4 laptop fits the battlefield, bag and preparation dock into one screen',async({page},testInfo)=>{
 await page.setViewportSize({width:1280,height:720});await page.reload();
 await expect(page.locator('#bagGrid .bag-cell')).toHaveCount(20);
 const layout=await page.evaluate(()=>({w:innerWidth,h:innerHeight,scroll:document.documentElement.scrollWidth,sh:document.documentElement.scrollHeight,dock:document.querySelector('.dock').getBoundingClientRect().bottom,canvas:{w:document.querySelector('canvas').width,h:document.querySelector('canvas').height}}));
 expect(layout.scroll).toBeLessThanOrEqual(layout.w+2);
 expect(layout.dock).toBeLessThanOrEqual(layout.h+2);
 expect(layout.canvas).toEqual({w:1080,h:480});
 await page.screenshot({path:testInfo.outputPath('nightwatch-v4-laptop.png'),fullPage:true});
});

test('V4 mesh scene draws actual battle state, pauses safely, and resumes',async({page},testInfo)=>{
 const errors=[];page.on('pageerror',err=>errors.push(err.message));
 await page.locator('#startWaveBtn').click();
 await expect.poll(()=>page.evaluate(()=>window.__nightwatch.state.monsters.length),{timeout:6000}).toBeGreaterThan(0);
 await page.locator('#pauseBtn').click();
 const x=await page.evaluate(()=>window.__nightwatch.state.monsters[0]?.x);
 await page.waitForTimeout(260);
 expect(await page.evaluate(()=>window.__nightwatch.state.monsters[0]?.x)).toBe(x);
 await page.locator('#pauseBtn').click();
 await expect.poll(()=>page.evaluate(()=>window.__nightwatch.state.monsters[0]?.x ?? -1)).toBeLessThan(x);
 await page.screenshot({path:testInfo.outputPath('nightwatch-v4-live-combat.png'),fullPage:true});
 expect(errors).toEqual([]);
});
