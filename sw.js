const CACHE='fajr-to-fajr-v18';
const ASSETS=['./','./index.html','./style.css','./app.js','./manifest.webmanifest','./icon.svg','./icon-192.png','./icon-512.png'];

self.addEventListener('install',event=>{
  event.waitUntil(
    caches.open(CACHE)
      .then(cache=>cache.addAll(ASSETS))
      .then(()=>self.skipWaiting())
  );
});

self.addEventListener('activate',event=>{
  event.waitUntil(
    caches.keys()
      .then(keys=>Promise.all(
        keys.filter(key=>key.startsWith('fajr-to-fajr-')&&key!==CACHE)
          .map(key=>caches.delete(key))
      ))
      .then(()=>self.clients.claim())
  );
});

self.addEventListener('fetch',event=>{
  const request=event.request;
  if(request.method!=='GET') return;
  const requestUrl=new URL(request.url);
  // Leave third-party APIs and external resources to the browser/network.
  if(requestUrl.origin!==self.location.origin){
    event.respondWith(fetch(request));
    return;
  }
  event.respondWith((async()=>{
    const cached=await caches.match(request);
    if(cached) return cached;
    try{
      const response=await fetch(request);
      if(response.ok){
        const copy=response.clone();
        const cache=await caches.open(CACHE);
        await cache.put(request,copy);
      }
      return response;
    }catch(error){
      // Only document navigations may fall back to the app shell.
      if(request.mode==='navigate'){
        const shell=await caches.match('./index.html');
        if(shell) return shell;
      }
      return new Response('This resource is unavailable offline.',{
        status:503,
        statusText:'Service Unavailable',
        headers:{'Content-Type':'text/plain; charset=utf-8','Cache-Control':'no-store'}
      });
    }
  })());
});
