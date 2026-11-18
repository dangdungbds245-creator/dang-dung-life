// Đăng Dũng Life — © 2026 Đăng Dũng
// Mở app tức thì từ bộ nhớ máy, tải bản mới ngầm phía sau (stale-while-revalidate)
const C='ddlife-v12',SHELL=['index.html','app.js','data.js'],F=['./',...SHELL,'manifest.webmanifest','icon-180.png','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(F)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
let notified=false,upd=false;
self.addEventListener('message',e=>{if(e.data==='check'&&upd&&e.source)e.source.postMessage('updated')});
async function refresh(req){
  const c=await caches.open(C),old=await c.match(req,{ignoreSearch:true});
  const r=await fetch(req,{cache:'no-cache'});if(!r.ok)return r;
  const name=new URL(req.url).pathname.split('/').pop()||'index.html';
  if(old&&SHELL.includes(name)&&!notified){const [a,b]=await Promise.all([old.clone().text(),r.clone().text()]);
    if(a!==b){notified=upd=true;(await self.clients.matchAll({type:'window'})).forEach(w=>w.postMessage('updated'))}}
  await c.put(req,r.clone());return r}
self.addEventListener('fetch',e=>{const u=new URL(e.request.url);if(e.request.method!=='GET'||u.origin!==location.origin)return;
  if(e.request.mode==='navigate')notified=upd=false;
  const key=e.request.mode==='navigate'?new Request(new URL('index.html',self.registration.scope)):e.request;
  e.respondWith(caches.match(key,{ignoreSearch:true}).then(hit=>{
    const net=refresh(key);
    if(hit){e.waitUntil(net.catch(()=>{}));return hit}
    return net.catch(()=>caches.match('./'))}))});
self.addEventListener('notificationclick',e=>{e.notification.close();
  e.waitUntil(self.clients.matchAll({type:'window',includeUncontrolled:true}).then(l=>l.length?l[0].focus():self.clients.openWindow('./index.html')))});
self.addEventListener('push',e=>{let d={};try{d=e.data.json()}catch{d={title:'Đăng Dũng Life',body:e.data?e.data.text():''}}
  e.waitUntil(self.registration.showNotification(d.title||'Đăng Dũng Life',{body:d.body||'',icon:'icon-192.png',badge:'icon-192.png',tag:d.tag||'dd-push',data:{url:d.url||'./'}}))});
