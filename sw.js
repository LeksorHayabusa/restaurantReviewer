const staticCacheName = 'restoCache_v4',
    filesToCache = [
        '/',
        'js/main.js',
        'js/dbhelper.js',
        'js/restaurant_info.js',
        'css/styles.css',
        'restaurant.html',
        'data/restaurants.json'
        ];
//stores the cached copy and applies installed service worker
self.addEventListener('install', function(event) {
  console.log('installing')
  event.waitUntil(
    caches.open(staticCacheName).then(function(cache) {
      return cache.addAll(filesToCache)
    })
  )
})
//looks for cached copy and updates it if found from cache
self.addEventListener('activate', function(event) {
  console.log('activation')
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(cacheNames.filter(function(cacheName) {
        //must separate and work with some cache lists 
        return cacheName.startsWith('restoCache') && cacheName != staticCacheName
          }).map(function(cacheName) {
            caches.delete(cacheName)
          })
        )
    })
  )
})
//looks for the response from the cashe and returns it.
//otherwise the response will be upload from the network and stored in the cache
self.addEventListener('fetch', function(event) {  
event.respondWith(
    caches.open(staticCacheName).then(cache => {
      return cache.match(event.request).then(response => {
        return response || fetch(event.request).then(response => {
          cache.put(event.request, response.clone());
          return response;
        })
      })
    })
  )
})
//listens to the app messages
self.addEventListener('message', function(event) {
  if (event.data.action == 'skipWaiting') {
    console.log('SW skipping waiting')
    self.skipWaiting();
  }
})
