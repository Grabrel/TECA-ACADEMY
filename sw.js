const VERSION='teca-tjsp-v3.1-20261111-autossuficiente';
const ASSETS=['./','./index.html','./manifest.webmanifest','./assets/icon.svg','./calendario_tjsp2607.ics'];
self.addEventListener('install',event=>{event.waitUntil(caches.open(VERSION).then(async cache=>{await cache.addAll(ASSETS)}).then(()=>self.skipWaiting()))});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(x=>x!==VERSION&&x.startsWith('teca-tjsp-')).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',event=>{if(event.request.method!=='GET'||new URL(event.request.url).origin!==location.origin)return;event.respondWith(fetch(event.request).then(response=>{if(response.ok){let copy=response.clone();caches.open(VERSION).then(cache=>cache.put(event.request,copy))}return response}).catch(()=>caches.match(event.request).then(found=>found||caches.match('./index.html'))))});
