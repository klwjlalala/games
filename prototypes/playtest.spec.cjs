const {test,expect}=require('@playwright/test');
const URL='http://127.0.0.1:4173/prototypes/';
test.beforeEach(async({page})=>{await page.goto(URL);await expect(page.locator('#tGame .t-board')).toBeVisible()});

test('loads both games without JavaScript errors',async({page})=>{
  const errors=[];page.on('pageerror',err=>errors.push(err.message));
  await expect(page.locator('#tGame .tile')).toHaveCount(49);
  await page.locator('#tabB').click();
  await expect(page.locator('#bGame .slot')).toHaveCount(12);
  await expect(page.locator('#bGame .gear')).toHaveCount(4);
  await expect.poll(()=>errors).toEqual([]);
});

test('tactical dash traverses two cells and consumes one charge',async({page})=>{
  await page.locator('#tGame [data-mode="dash"]').click();
  await page.locator('#tGame [data-tile="2,3"]').click();
  const s=await page.evaluate(()=>{const t=window.__playtest.tactics;return {x:t.p.x,y:t.p.y,turn:t.turn,dash:t.dash}});
  expect(s).toEqual({x:2,y:3,turn:1,dash:1});
});

test('tactical checkpoint offers meaningful supplies and progressively introduces enemies',async({page})=>{
  await page.evaluate(()=>{
    const t=window.__playtest.tactics;t.enemies=[];t.walls=[];t.gotKey=true;t.p={x:5,y:3};
    window.__playtest.tacticsAction('move',1,0);
  });
  await expect(page.locator('#tGame [data-upgrade]')).toHaveCount(3);
  await page.locator('#tGame [data-upgrade="dash"]').click();
  const s=await page.evaluate(()=>{const t=window.__playtest.tactics;return {stage:t.stage,dash:t.dash,enemies:t.enemies.map(x=>x.kind)}});
  expect(s).toEqual({stage:2,dash:4,enemies:['hunter','turret']});
});

test('turret marks a ray from itself rather than a remote column',async({page})=>{
  await page.evaluate(()=>{
    const t=window.__playtest.tactics;t.p={x:0,y:3};t.walls=[];
    t.enemies=[{id:2,kind:'turret',x:5,y:3}];window.__playtest.tacticsAction('wait');
  });
  await expect(page.locator('#tGame [data-tile="0,3"]')).toHaveClass(/danger/);
  await expect(page.locator('#tGame [data-tile="0,2"]')).not.toHaveClass(/danger/);
});

test('backpack synergies actually influence combat and lead to loot',async({page})=>{
  await page.locator('#tabB').click();
  await page.locator('#bGame [data-gear="3"]').click();
  await page.locator('#bGame [data-place="2,1"]').click();
  await page.locator('#bGame [data-gear="4"]').click();
  await page.locator('#bGame [data-place="2,2"]').click();
  const effects=await page.evaluate(()=>window.__playtest.backpackStats());
  expect(effects.physical).toBe(8);
  expect(effects.burn).toBe(2);
  await page.locator('#bFight').click();
  await expect(page.getByText('战利品三选一')).toBeVisible({timeout:8500});
  await expect(page.locator('#bGame [data-loot]')).toHaveCount(3);
  await page.locator('#bGame [data-loot]').first().click();
  await expect(page.locator('#bGame .badge')).toContainText('第 2 / 5 夜');
});

test('backpack reset returns to a clean first-night state',async({page})=>{
  await page.locator('#tabB').click();
  await page.locator('#bGame [data-gear="3"]').click();
  await page.locator('#bGame [data-place="2,1"]').click();
  await page.locator('#bReset').click();
  const s=await page.evaluate(()=>{const b=window.__playtest.backpack;return{night:b.night,items:b.items.length,placed:b.items.filter(x=>x.x!==null).length}});
  expect(s).toEqual({night:1,items:4,placed:2});
});
