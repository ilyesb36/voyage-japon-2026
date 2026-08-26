const C='jp2026-v4';
const PAGES=['./','index.html','guide.html','jour-par-jour.html','journees.html','villes.html','hotels.html','budget.html','manifest.webmanifest','theme.css','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(PAGES)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C&&k!=='jp-img').map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  if(e.request.method!=='GET')return;
  if(u.origin===location.origin){
    const isHTML=e.request.mode==='navigate'||u.pathname.endsWith('.html')||u.pathname.endsWith('/');
    if(isHTML){
      e.respondWith(fetch(e.request).then(n=>{if(n.ok)caches.open(C).then(c=>c.put(e.request,n.clone()));return n;}).catch(()=>caches.match(e.request,{ignoreSearch:true})));
    } else {
      e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(r=>{
        const f=fetch(e.request).then(n=>{if(n.ok)caches.open(C).then(c=>c.put(e.request,n.clone()));return n;}).catch(()=>r);
        return r||f;}));
    }
  } else if(/upload\.wikimedia|bstatic|cartocdn|unpkg|fonts\.g/.test(u.host)){
    e.respondWith(caches.open('jp-img').then(c=>c.match(e.request).then(r=>{
      const f=fetch(e.request).then(n=>{if(n.ok)c.put(e.request,n.clone());return n;}).catch(()=>r);
      return r||f;})));
  }
});