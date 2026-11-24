const {test,expect}=require('@playwright/test');
const URL='http://127.0.0.1:4173/prototypes/nightwatch/';
test.use({launchOptions:{args:['--enable-webgl','--use-angle=swiftshader','--enable-unsafe-swiftshader']}});
test('all 55 local GLBs parse, fit and have valid animation mappings',async({page},testInfo)=>{
 const errors=[],failed=[];page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.url().includes('/assets/models/')&&r.status()>=400)failed.push(r.url()+':'+r.status());});await page.goto(URL);
 await expect.poll(()=>page.evaluate(()=>window.__nightwatch?.renderMode),{timeout:15000}).toBe('three');
 await page.evaluate(()=>window.__nightwatch.assets.preload());
 const result=await page.evaluate(()=>({snap:window.__nightwatch.assets.snapshot(),config:window.__nightwatch.assets.config}));
 expect(Object.keys(result.snap.status)).toHaveLength(55);expect(result.snap.errors).toEqual({});
 for(const [id,cfg] of Object.entries(result.config)){const stat=result.snap.status[id];expect(stat.state,id).toBe('loaded');expect(Math.abs(stat.bottom),id).toBeLessThan(.0001);expect(Math.max(stat.dimensions[0],stat.dimensions[2]),id).toBeLessThanOrEqual(cfg.tileFitRatio+.0001);for(const clip of Object.values(cfg.animations))if(clip)expect(stat.clips,id).toContain(clip);}
 await page.keyboard.press('F2');await expect(page.locator('.nw-debug')).toBeVisible();
 await page.screenshot({path:testInfo.outputPath('asset-calibration.png'),fullPage:true});expect(errors).toEqual([]);expect(failed).toEqual([]);
});
test('live battle uses local models and preserves movement and pause',async({page},testInfo)=>{
 await page.goto(URL);await expect.poll(()=>page.evaluate(()=>window.__nightwatch?.renderMode)).toBe('three');
 await page.locator('#startWaveBtn').click();await expect.poll(()=>page.evaluate(()=>window.__nightwatch.state.monsters.length),{timeout:8000}).toBeGreaterThan(0);
 await expect.poll(()=>page.evaluate(()=>window.__nightwatch.assets.snapshot().enemies.some(x=>x.loaded)),{timeout:10000}).toBeTruthy();
 const x=await page.evaluate(()=>window.__nightwatch.state.monsters[0].x);await page.waitForTimeout(220);expect(await page.evaluate(()=>window.__nightwatch.state.monsters[0]?.x??0)).toBeLessThan(x);
 await page.screenshot({path:testInfo.outputPath('asset-live-battle.png'),fullPage:true});await page.locator('#pauseBtn').click();const paused=await page.evaluate(()=>window.__nightwatch.state.monsters[0]?.x);await page.waitForTimeout(200);expect(await page.evaluate(()=>window.__nightwatch.state.monsters[0]?.x)).toBe(paused);
});
test('missing model safely retains placeholder and core combat',async({page})=>{
 await page.route('**/assets/models/defenders/bow.glb',r=>r.abort());await page.goto(URL);
 await expect.poll(()=>page.evaluate(()=>window.__nightwatch?.assets?.status.bow?.state),{timeout:12000}).toBe('fallback');
 expect(await page.evaluate(()=>window.__nightwatch.renderMode)).toBe('three');
 await page.locator('#startWaveBtn').click();expect(await page.evaluate(()=>window.__nightwatch.state.phase)).toBe('battle');
});
