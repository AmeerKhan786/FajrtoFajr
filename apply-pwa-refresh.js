#!/usr/bin/env node
'use strict';
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const read = f => fs.readFileSync(path.join(root, f), 'utf8');
const write = (f, s) => fs.writeFileSync(path.join(root, f), s, 'utf8');
const replaceOnce = (s, old, next, file) => {
  const count = s.split(old).length - 1;
  if (count !== 1) throw new Error(`${file}: expected exactly one match for replacement, found ${count}. No further edits applied to this file.`);
  return s.replace(old, next);
};

const sw = `const CACHE='fajr-to-fajr-v16';
const ASSETS=['./','./index.html','./style.css?v=16','./app.js?v=16','./manifest.webmanifest?v=16','./icon.svg','./icon-192.png','./icon-512.png'];
self.addEventListener('install',event=>event.waitUntil((async()=>{
 const cache=await caches.open(CACHE);
 await Promise.all(ASSETS.map(async asset=>{
  const request=new Request(asset,{cache:'reload'});
  const response=await fetch(request);
  if(response.ok)await cache.put(request,response);
 }));
 await self.skipWaiting();
})()));
self.addEventListener('message',event=>{if(event.data==='SKIP_WAITING')self.skipWaiting()});
self.addEventListener('activate',event=>event.waitUntil((async()=>{
 const keys=await caches.keys();
 await Promise.all(keys.filter(key=>key.startsWith('fajr-to-fajr-')&&key!==CACHE).map(key=>caches.delete(key)));
 await self.clients.claim();
})()));
self.addEventListener('fetch',event=>{
 const request=event.request;
 if(request.method!=='GET'||new URL(request.url).origin!==location.origin)return;
 if(request.mode==='navigate'){
  event.respondWith((async()=>{
   try{
    const response=await fetch(request,{cache:'no-store'});
    if(response.ok){const cache=await caches.open(CACHE);await cache.put('./index.html',response.clone());}
    return response;
   }catch{
    return (await caches.match(request))||(await caches.match('./index.html'))||Response.error();
   }
  })());
  return;
 }
 event.respondWith((async()=>{
  const cached=await caches.match(request);
  if(cached)return cached;
  try{
   const response=await fetch(request);
   if(response.ok){const cache=await caches.open(CACHE);cache.put(request,response.clone());}
   return response;
  }catch{return (await caches.match('./index.html'))||Response.error();}
 })());
});
`;

let index = read('index.html');
index = replaceOnce(index, '<link rel="manifest" href="./manifest.webmanifest">', '<link rel="manifest" href="./manifest.webmanifest?v=16">', 'index.html');
index = replaceOnce(index, '<link rel="stylesheet" href="./style.css">', '<link rel="stylesheet" href="./style.css?v=16">', 'index.html');
index = replaceOnce(index, '<script src="./app.js" defer></script>', '<script src="./app.js?v=16" defer></script>', 'index.html');
index = replaceOnce(index, '<span>Private by default · Stored on this device</span>', '<span>Private by default · Stored on this device · v16</span>', 'index.html');
write('index.html', index);

let app = read('app.js');
const oldRegistration = "if('serviceWorker'in navigator&&location.protocol!=='file:')window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));";
const newRegistration = `if('serviceWorker'in navigator&&location.protocol!=='file:')window.addEventListener('load',async()=>{
 let reloading=false;
 navigator.serviceWorker.addEventListener('controllerchange',()=>{
  if(reloading)return;
  reloading=true;
  window.location.reload();
 });
 try{
  const registration=await navigator.serviceWorker.register('./sw.js',{updateViaCache:'none'});
  await registration.update();
  if(registration.waiting)registration.waiting.postMessage('SKIP_WAITING');
 }catch(error){console.warn('PWA update check failed',error);}
});`;
app = replaceOnce(app, oldRegistration, newRegistration, 'app.js');
write('app.js', app);
write('sw.js', sw);

let readme=read('README.md');
readme=replaceOnce(readme, '# Fajr to Fajr — 100 Day Challenge v13', '# Fajr to Fajr — 100 Day Challenge v16', 'README.md');
readme += `\n\n## v16 — PWA update reliability\n- Versioned app-shell CSS, JavaScript and manifest URLs to bypass stale browser asset caches.\n- Service worker now precaches with cache revalidation, uses network-first navigation, deletes prior app caches and activates updates immediately.\n- App explicitly checks for service-worker updates and reloads once after a controller changes.\n- This update is intended to resolve installed PWA clients stuck on older UI. Existing local data remains in browser storage; export a backup before troubleshooting/reinstalling.\n`;
write('README.md', readme);

let changelog=read('CHANGELOG.md');
const duplicateBlock = `## v15 — Deeper accountability
- Added prayer punctuality, delayed status, Sunnah/Nafl, Quran memorisation and revision analytics.
- Added a cautious descriptive sleep vs unnecessary phone-use comparison (no causal inference).
- Added printable personal journey report for all available dates since challenge start.
- Bumped service-worker cache to v15.
`;
if(changelog.includes(duplicateBlock)) changelog=changelog.replace(duplicateBlock,'');
changelog += `\n\n## v16 — PWA update reliability\n- Versioned CSS, JavaScript and manifest URLs to force a fresh asset fetch.\n- Service worker uses revalidated precaching, network-first navigation, immediate activation and removes previous caches.\n- App checks for service-worker updates on launch and reloads once after the new controller takes over.\n`;
write('CHANGELOG.md', changelog);

let qa=read('QA_REPORT.md');
qa=qa.replace('# Fajr to Fajr v15 — QA report', '# Fajr to Fajr v16 — QA report');
qa += `\n\n## v16 update validation additions\n- Confirm the service-worker cache is v16 and old caches are removed on activation.\n- Confirm versioned app assets load (CSS, JS, manifest) after update.\n- Confirm an installed app checks for an update on launch and refreshes after controller change.\n- Confirm navigation is network-first while offline navigation falls back to the cached shell.\n`;
write('QA_REPORT.md', qa);

let tests=read('test-app.cjs');
const marker="console.log('PASS:";
if(!tests.includes(marker)) throw new Error('test-app.cjs: PASS summary marker not found; test file not changed.');
const newAssertions = `// PWA release/update regressions
assert(sw.includes("fajr-to-fajr-v16"),'Service-worker cache must be bumped to v16');
assert(sw.includes("request.mode==='navigate'"),'Navigation must use network-first update strategy');
assert(sw.includes("cache:'reload'"),'Precache must revalidate instead of using stale browser cache');
assert(sw.includes("SKIP_WAITING"),'Service worker must support immediate activation message');
assert(html.includes('app.js?v=16')&&html.includes('style.css?v=16')&&html.includes('manifest.webmanifest?v=16'),'HTML app assets must use versioned URLs');
assert(js.includes("updateViaCache:'none'")&&js.includes('registration.update()'),'App must explicitly check for a service-worker update on launch');
assert(js.includes("controllerchange")&&js.includes('window.location.reload()'),'App must refresh after updated worker controls the page');
`;
tests=tests.replace(marker,newAssertions+marker);
write('test-app.cjs', tests);
console.log('Updated index.html, app.js, sw.js, README.md, CHANGELOG.md, QA_REPORT.md and test-app.cjs. Run node --check app.js && node --check sw.js && node --check test-app.cjs && TZ=Asia/Kolkata node test-app.cjs');
