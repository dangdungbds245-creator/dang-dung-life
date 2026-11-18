// Đăng Dũng Life — © 2026 Đăng Dũng
const C='ddlife-v5',F=['./','index.html','app.js','data.js','manifest.webmanifest','icon-180.png','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(F)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{if(e.request.method!=='GET'||new URL(e.request.url).origin!==location.origin)return;
  e.respondWith(fetch(e.request,{cache:'no-cache'}).then(r=>{const c=r.clone();caches.open(C).then(x=>x.put(e.request,c));return r}).catch(()=>caches.match(e.request,{ignoreSearch:true})))});
self.addEventListener('notificationclick',e=>{e.notification.close();
  e.waitUntil(self.clients.matchAll({type:'window',includeUncontrolled:true}).then(l=>l.length?l[0].focus():self.clients.openWindow('./index.html')))});
self.addEventListener('push',e=>{let d={};try{d=e.data.json()}catch{d={title:'Đăng Dũng Life',body:e.data?e.data.text():''}}
  e.waitUntil(self.registration.showNotification(d.title||'Đăng Dũng Life',{body:d.body||'',icon:'icon-192.png',badge:'icon-192.png',tag:d.tag||'dd-push',data:{url:d.url||'./'}}))});
