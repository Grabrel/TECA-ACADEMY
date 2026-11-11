const VERSION='teca-tjsp-v3-20261110';
const ASSETS=['./','./index.html','./styles.css','./app.js','./manifest.webmanifest','./assets/icon.svg','./data/lessons.js','./data/events.js','./calendario_tjsp2607.ics'];
self.addEventListener('install',event=>{event.waitUntil(caches.open(VERSION).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(x=>x!==VERSION).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',event=>{if(event.request.method!=='GET'||new URL(event.request.url).origin!==location.origin)return;event.respondWith(caches.match(event.request).then(found=>found||fetch(event.request).then(response=>{if(response.ok){let c=response.clone();caches.open(VERSION).then(cache=>cache.put(event.request,c))}return response})))})
