const CACHE='metria-runtime-v2-dense-head';
const CORE=['app.html','manifest.webmanifest','icon.svg','mobile-app.js','metria-avatar.js'];

self.addEventListener('install',event=>{
  event.waitUntil(
    caches.open(CACHE)
      .then(cache=>cache.addAll(CORE.map(url=>new Request(url,{cache:'reload'}))))
      .then(()=>self.skipWaiting())
  );
});

self.addEventListener('activate',event=>{
  event.waitUntil(
    caches.keys()
      .then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key))))
      .then(()=>self.clients.claim())
  );
});

self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET')return;
  const url=new URL(event.request.url);
  if(url.origin!==self.location.origin)return;

  event.respondWith(
    fetch(event.request,{cache:'no-store'})
      .then(response=>{
        if(response&&response.ok){
          const copy=response.clone();
          caches.open(CACHE).then(cache=>cache.put(event.request,copy));
        }
        return response;
      })
      .catch(async()=>{
        const cached=await caches.match(event.request,{ignoreSearch:true});
        if(cached)return cached;
        if(event.request.mode==='navigate')return caches.match('app.html');
        throw new Error('Offline and resource not cached');
      })
  );
});

self.addEventListener('periodicsync',event=>{
  if(event.tag!=='metria-daily')return;
  event.waitUntil(self.registration.showNotification('Your daily Metria update',{
    body:'Your private check-in and pattern review are ready.',
    icon:'icon.svg?v=2',
    badge:'icon.svg?v=2',
    tag:'metria-daily',
    data:{url:'app.html#daily'}
  }));
});

self.addEventListener('push',event=>{
  let data={};
  try{data=event.data?.json()||{}}catch{data={body:event.data?.text()}}
  event.waitUntil(self.registration.showNotification(data.title||'Your daily Metria update',{
    body:data.body||'Your private check-in and pattern review are ready.',
    icon:'icon.svg?v=2',
    badge:'icon.svg?v=2',
    tag:'metria-daily',
    data:{url:data.url||'app.html#daily'}
  }));
});

self.addEventListener('notificationclick',event=>{
  event.notification.close();
  const target=new URL(event.notification.data?.url||'app.html',self.location.href).href;
  event.waitUntil(clients.matchAll({type:'window',includeUncontrolled:true}).then(list=>{
    const existing=list.find(client=>client.url.startsWith(new URL('app.html',self.location.href).href));
    if(existing){existing.navigate(target);return existing.focus()}
    return clients.openWindow(target);
  }));
});
