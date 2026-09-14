const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const fs=require('fs');
(async()=>{
 const origin=process.argv[2],label=process.argv[3];
 const routes=['/','/blog/home-renovation-cost-london-2026','/house-extension','/locations/hackney','/renovation-calculator'];
 const browser=await chromium.launch({channel:'chrome',headless:true});const results=[];
 for(const path of routes) for(let run=1;run<=3;run++) {
  const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:1,isMobile:true,hasTouch:true,userAgent:'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36'});
  const page=await context.newPage(); const cdp=await context.newCDPSession(page);
  await cdp.send('Network.enable');await cdp.send('Network.setCacheDisabled',{cacheDisabled:true});
  await cdp.send('Network.emulateNetworkConditions',{offline:false,latency:150,downloadThroughput:1600000/8,uploadThroughput:750000/8});
  await cdp.send('Emulation.setCPUThrottlingRate',{rate:4});await cdp.send('Performance.enable');
  await page.addInitScript(()=>{
   window.__lab={lcp:0,lcpElement:null,cls:0,shifts:[],longTasks:0};
   new PerformanceObserver(list=>{for(const e of list.getEntries()){window.__lab.lcp=e.startTime;window.__lab.lcpElement=e.element?.outerHTML.slice(0,250)}}).observe({type:'largest-contentful-paint',buffered:true});
   new PerformanceObserver(list=>{for(const e of list.getEntries())if(!e.hadRecentInput){window.__lab.cls+=e.value;window.__lab.shifts.push(...(e.sources||[]).map(s=>s.node?.outerHTML?.slice(0,140)).filter(Boolean))}}).observe({type:'layout-shift',buffered:true});
   new PerformanceObserver(list=>{for(const e of list.getEntries())window.__lab.longTasks+=Math.max(0,e.duration-50)}).observe({type:'longtask',buffered:true});
  });
  let status,error;
  try{status=(await page.goto(origin+path,{waitUntil:'load',timeout:60000})).status();await page.waitForTimeout(4000)}catch(e){error=e.message.slice(0,150)}
  const result=await page.evaluate(()=>({...window.__lab,overflow:document.documentElement.scrollWidth>innerWidth,transferred:performance.getEntriesByType('resource').reduce((sum,e)=>sum+e.transferSize,0),title:document.title})).catch(()=>({}));
  results.push({path,run,status,error,...result});console.log(label,path,run,JSON.stringify({lcp:result.lcp,cls:result.cls,longTasks:result.longTasks,status,error}));
  fs.writeFileSync(`${process.env.SEO_EVIDENCE_DIR || "."}/performance-${label}.json`,JSON.stringify({origin,label,configuration:{viewport:'390x844',cpuSlowdown:4,latencyMs:150,downloadMbps:1.6,uploadMbps:0.75,cache:'disabled',consent:'fresh/unset',runs:3,observation:'load plus 4 seconds'},results},null,2));
  await context.close();
 }
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
