const cacheName = "roya-platform-v1"; // اسم الكاش
const assets = [
  "/",
  "/index.html",
  "/schedule.html",
  "/style.css",
  "/scriot.js",
  "/manifest.json",
  "/icon-192.png",
];

// تثبيت التطبيق وتخزين الملفات
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(cacheName).then(cache => {
      return cache.addAll(assets);
    })
  );
});

// تفعيل الخدمة وحذف الكاش القديم عند التحديث
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(keys.filter(key => key !== cacheName).map(key => caches.delete(key)));
    })
  );
});

// استراتيجية Fetch: عرض الكاش أولاً ثم الشبكة
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
