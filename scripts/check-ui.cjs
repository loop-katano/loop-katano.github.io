const { chromium }=require('playwright');
const fs=require('node:fs');
const path=require('node:path');
(async()=>{
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH||chromium.executablePath(),args:['--no-sandbox']});
const page=await browser.newPage({viewport:{width:1440,height:1000},deviceScaleFactor:1});
const errors=[];page.on('pageerror',e=>errors.push(e.message));
fs.mkdirSync('preview-checks',{recursive:true});
for(const [name,route] of [['home','/'],['map','/projects/meetpoint'],['jobs','/projects/job-intelligence'],['football','/projects/football-analytics']]){
 await page.goto('http://127.0.0.1:5173'+route);await page.waitForTimeout(400);
 await page.screenshot({path:`preview-checks/${name}.png`,fullPage:true});
 console.log(name,await page.title(),await page.locator('h1').innerText());
}
await page.goto('http://127.0.0.1:5173/projects/meetpoint');
await page.getByRole('button',{name:'保存当前方案'}).click();
if(!await page.getByRole('status').innerText().then(t=>t.includes('已保存')))throw Error('map save');
await page.locator('#meet-radius').fill('0.3');
await page.waitForTimeout(100);
if(!await page.getByText('当前范围内没有共同候选').isVisible())throw Error('empty state');
await page.getByRole('button',{name:'放宽条件'}).click();
await page.getByRole('button',{name:'在地图上选点'}).first().click();
await page.locator('.city-map svg').click({position:{x:370,y:230}});
if(await page.getByRole('button',{name:'取消选点'}).count())throw Error('point pick');
await page.goto('http://127.0.0.1:5173/projects/job-intelligence');
const status=page.locator('.clean-job-row select').first();await status.selectOption('准备投递');await page.reload();
if(await page.locator('.clean-job-row select').first().inputValue()!=='准备投递')throw Error('status persistence');
await page.locator('.product-nav button').nth(1).click();await page.getByRole('textbox',{name:'搜索岗位'}).fill('不存在的企业xyz');
if(!await page.getByText('没有匹配的岗位，请更换关键词。').isVisible())throw Error('job search');
await page.goto('http://127.0.0.1:5173/projects/football-analytics');
await page.getByRole('button',{name:'向前推进',exact:true}).click();await page.getByLabel('球员筛选').selectOption('5503');
await page.getByRole('button',{name:'持球事件热区',exact:true}).click();await page.getByLabel('比赛时段').selectOption('2');
await page.screenshot({path:'preview-checks/football-heat.png',fullPage:true});
for(const [name,route] of [['home','/'],['map','/projects/meetpoint'],['jobs','/projects/job-intelligence'],['football','/projects/football-analytics']]){
 await page.setViewportSize({width:390,height:844});await page.goto('http://127.0.0.1:5173'+route);await page.waitForTimeout(200);
 const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1);if(overflow)throw Error(name+' mobile overflow');
 await page.screenshot({path:`preview-checks/${name}-mobile.png`,fullPage:true});
}
console.log('UI errors:',errors);if(errors.length)throw Error(errors.join('\n'));
await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
