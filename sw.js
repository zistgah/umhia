/* Copyright © 2026 Abhishek Choudhary. SPDX-License-Identifier: GPL-3.0-or-later */
const SHELL = ["./index.html", "./css/app.css", "./js/app.js", "./manifest.webmanifest"];
self.addEventListener("install", (event) => {
  event.waitUntil(caches.open("umhia-0.2.1").then((cache) => cache.addAll(SHELL)));
});
self.addEventListener("fetch", (event) => {
  event.respondWith(caches.match(event.request).then((hit) => hit || fetch(event.request)));
});
