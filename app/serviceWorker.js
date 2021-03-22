const CACHE_NAME = 'my-site-cache-v1';
const urlsToCache = [
  '/',
  '/css/main.css',
  '/js/main.js'
];

self.addEventListener('install', event => {
  console.log('installing service worker now')
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function (cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  if (event.request.url.indexOf('getRecent') !== -1) {
    event.respondWith(fetch(event.request)
      .catch(e => new Response('', {status: 500, "statusText" : "offline"})));
    return
  }
  event.respondWith(caches.match(event.request)
    .then(response => {
      // Cache hit - return response
      if (response) {
        console.log('cache hit!', event.request.url)
        return response;
      }

      console.log('cache miss', event.request.url)

      return fetch(event.request).then(
        response => {
          // Check if we received a valid response
          if (!response || response.status !== 200 || event.request.url.indexOf('chrome-extension')) {
            return response;
          }

          // IMPORTANT: Clone the response. A response is a stream
          // and because we want the browser to consume the response
          // as well as the cache consuming the response, we need
          // to clone it so we have two streams.
          const responseToCache = response.clone();

          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });

          return response;
        }
      );
    }));
})
