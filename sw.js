const CACHE="metria-recover-v1";
const CORE=["app.html","recover.js","manifest.webmanifest","icon.svg"];
self.addEventListener("install",event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(CORE.map(url=>new Request(url,{cache:"reload"})))).then(()=>self.skipWaiting())));
self.addEventListener("activate",event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener("fetch",event=>{if(event.request.method!=="GET")return;const url=new URL(event.request.url);if(url.origin!==self.location.origin)return;event.respondWith(fetch(event.request,{cache:"no-store"}).then(response=>{if(response.ok)caches.open(CACHE).then(cache=>cache.put(event.request,response.clone()));return response}).catch(()=>caches.match(event.request,{ignoreSearch:true}).then(hit=>hit||caches.match("app.html"))))});
self.addEventListener("notificationclick",event=>{event.notification.close();event.waitUntil(clients.openWindow("app.html#scan"))});
