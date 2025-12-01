const CACHE_NAME = 'js-quiz-v2';
const STATIC_CACHE = 'js-quiz-static-v2';
const QUESTIONS_CACHE = 'js-quiz-questions-v2';

// Get basePath from service worker location
// For GitHub Pages: /repo-name
function getBasePath() {
  const pathname = self.location.pathname;
  // Extract basePath (e.g., /js-quizzy from /js-quizzy/sw.js)
  const match = pathname.match(/^(\/[^/]+)/);
  return match ? match[1] : '';
}

const basePath = getBasePath();

const STATIC_ASSETS = [
  `${basePath}/`,
  `${basePath}/quiz`,
  `${basePath}/stats`,
  `${basePath}/manifest.json`,
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      // Use addAll but catch errors for individual files
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('Some assets failed to cache:', err);
        // Try to cache assets individually
        return Promise.allSettled(
          STATIC_ASSETS.map(url => 
            fetch(url).then(response => {
              if (response.ok && response.status !== 206) {
                return cache.put(url, response);
              }
            }).catch(() => {})
          )
        );
      });
    })
  );
  // Force activation of new service worker
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => {
            return name !== CACHE_NAME && 
                   name !== STATIC_CACHE && 
                   name !== QUESTIONS_CACHE;
          })
          .map((name) => caches.delete(name))
      );
    })
  );
  return self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Questions JSON - network first, fallback to cache
  const questionsPath = `${basePath}/questions/`;
  if (url.pathname.startsWith(questionsPath) || url.pathname.startsWith('/questions/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Only cache successful full responses (not 206 Partial Content)
          // Cache API doesn't support partial responses
          if (response.ok && response.status !== 206) {
            const responseClone = response.clone();
            caches.open(QUESTIONS_CACHE).then((cache) => {
              cache.put(request, responseClone).catch((err) => {
                console.warn('Failed to cache response:', err);
              });
            });
            return response;
          }
          // For 206 or other non-ok responses, try cache first
          if (response.status === 206) {
            return caches.match(request).then((cachedResponse) => {
              return cachedResponse || response;
            });
          }
          throw new Error('Network response not ok');
        })
        .catch(() => {
          return caches.match(request).then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            // Fallback to all.json if specific file not found
            const allJsonPath = `${basePath}/questions/all.json`;
            if (url.pathname !== allJsonPath && url.pathname !== '/questions/all.json') {
              return caches.match(allJsonPath).then(cached => {
                if (cached) return cached;
                return caches.match('/questions/all.json');
              });
            }
            return new Response('Questions not available', { status: 404 });
          });
        })
    );
    return;
  }

  // Static assets - cache first, fallback to network
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(request).then((response) => {
          // Only cache successful full responses (not 206 Partial Content)
          // Cache API doesn't support partial responses
          if (response.ok && response.status !== 206) {
            const responseClone = response.clone();
            caches.open(STATIC_CACHE).then((cache) => {
              cache.put(request, responseClone).catch((err) => {
                console.warn('Failed to cache response:', err);
              });
            });
          }
          return response;
        });
      })
    );
  }
});

