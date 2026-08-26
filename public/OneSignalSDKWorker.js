// ⛔ CACHED - Disabled until ranking & clicks recover (26/08/2026)
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', () => self.clients.claim());
