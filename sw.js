const CACHE_NAME = "perfect-day-v028-shell";
const SHELL_ASSETS = [
  "/",
  "/index.html",
  "/styles.css",
  "/script.js",
  "/supabase-app.js",
  "/leaderboard.html",
  "/daily-challenge.html",
  "/stats.html",
  "/past-games.html",
  "/achievements.html",
  "/friends.html",
  "/head-to-head.html",
  "/profile.html",
  "/login.html",
  "/signup.html",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/manifest.json"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(SHELL_ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  const req = event.request;
  const url = new URL(req.url);

  // Never cache live weather, Supabase, or non-GET requests.
  if (req.method !== "GET" || url.pathname.startsWith("/api/") || url.hostname.includes("supabase.co")) {
    return;
  }

  // Network-first for HTML/navigation so users get the newest version after deploys.
  if (req.mode === "navigate" || req.headers.get("accept")?.includes("text/html")) {
    event.respondWith(
      fetch(req)
        .then(response => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(req, copy));
          return response;
        })
        .catch(() => caches.match(req).then(cached => cached || caches.match("/index.html")))
    );
    return;
  }

  // Stale-while-revalidate for static assets.
  event.respondWith(
    caches.match(req).then(cached => {
      const networkFetch = fetch(req).then(response => {
        if (response && response.status === 200) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(req, copy));
        }
        return response;
      }).catch(() => cached);
      return cached || networkFetch;
    })
  );
});
