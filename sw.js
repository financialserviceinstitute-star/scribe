// Money Lab offline support. Bump V when you change files so users get the update.
const V='ml-v5',SHELL=['./','index.html','content.json','candles.json','manifest.webmanifest','icon.svg'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>Promise.all(SHELL.map(u=>c.add(u).catch(()=>{})))).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!=V).map(x=>caches.delete(x)))).then(()=>clients.claim()))});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!='GET')return;const u=new URL(r.url);
if(!(u.origin==location.origin||/fonts\.(googleapis|gstatic)\.com$/.test(u.host)))return; // live APIs/calendar are never cached
e.respondWith(caches.open(V).then(c=>fetch(r).then(res=>{if(res&&res.status==200)c.put(r,res.clone());return res}).catch(()=>c.match(r).then(m=>m||(r.mode=='navigate'?c.match('index.html'):Response.error())))))});
