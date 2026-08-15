/* Офлайн-режим. Меняете index.html — поднимите номер версии ниже. */
var CACHE = "dash-v12";
var FILES = ["./", "./index.html", "./sw.js"];

self.addEventListener("install", function (e) {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(FILES).catch(function () {}); }));
});
self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (k) {
    return Promise.all(k.map(function (n) { return n === CACHE ? null : caches.delete(n) }));
  }).then(function () { return self.clients.claim() }));
});
self.addEventListener("fetch", function (e) {
  if (e.request.method !== "GET") return;
  e.respondWith(caches.match(e.request).then(function (hit) {
    var net = fetch(e.request).then(function (res) {
      if (res && res.status === 200 && res.type === "basic") {
        var copy = res.clone();
        caches.open(CACHE).then(function (c) { c.put(e.request, copy) });
      }
      return res;
    }).catch(function () { return hit });
    return hit || net;
  }));
});
