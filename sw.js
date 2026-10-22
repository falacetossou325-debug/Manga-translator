const C = "mt-v1";
const SHELL = ["./", "./index.html", "./manifest.json", "./icon.svg"];
self.addEventListener("install", e => { e.waitUntil(caches.open(C).then(c => c.addAll(SHELL))); self.skipWaiting(); });
self.addEventListener("activate", e => e.waitUntil(clients.claim()));
self.addEventListener("fetch", e => {
  const u = new URL(e.request.url);
  // les modèles Hugging Face sont déjà mis en cache par transformers.js
  if (e.request.method !== "GET" || /huggingface\.co$|hf\.co$/.test(u.hostname)) return;
  e.respondWith(caches.match(e.request).then(hit => hit || fetch(e.request).then(r => {
    if (r.status === 200 || r.type === "opaque") { const cp = r.clone(); caches.open(C).then(c => c.put(e.request, cp)); }
    return r;
  }).catch(() => hit)));
});
