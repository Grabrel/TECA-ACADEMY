const V='teca-academia-v3.3-nara-20261111';
const ASSETS=['./','./index.html','./academy-base.css','./theme.css','./academy.js','./auth.js','./config.js','./manifest.webmanifest','./assets/nara-mark.png','./assets/icon-192.png','./assets/icon-512.png','./calendario_tjsp2607.ics'];
self.addEventListener('install',e=>e.waitUntil(caches.open(V).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith('teca-')&&k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET'||new URL(r.url).origin!==location.origin)return;e.respondWith(fetch(r).then(res=>{if(res.ok)caches.open(V).then(c=>c.put(r,res.clone()));return res}).catch(()=>caches.match(r).then(hit=>hit||Response.error())))});
