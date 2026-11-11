const V='teca-academia-v3.7-companheiros-perfil-20261111';
const ASSETS=['./','./index.html','./academy-base.css?v=3.7','./theme.css?v=3.7','./social-v3.7.css?v=3.7','./social-v3.7.js','./academy-v3.7.js','./bolognesi-library-v3.7.js','./auth-v3.7.js','./config.js?v=3.7','./manifest.webmanifest','./assets/nara-mark.png','./assets/icon-192.png','./assets/icon-512.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(V).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith('teca-')&&k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET'||new URL(r.url).origin!==location.origin)return;e.respondWith(fetch(r).then(res=>{if(res.ok){const copy=res.clone();caches.open(V).then(c=>c.put(r,copy)).catch(()=>{})}return res}).catch(()=>caches.match(r).then(hit=>hit||Response.error())))});
