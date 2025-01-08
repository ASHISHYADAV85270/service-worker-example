const CACHE_NAME = "app-data-cache2";
const allowedCacheFileList = [
  "./index.html",
  "./index.js",
  "./virat.jpg",
  "./index.css",
];

self.addEventListener("install", (e) => {
  console.log("Service worker installed");
  // this will wait until the service worker is installed
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      cache.addAll(allowedCacheFileList);
    })
  );
  console.log("Service worker installed");
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((currCache) => {
          if (currCache !== CACHE_NAME) {
            return caches.delete(currCache);
          }
        })
      );
    })
  );
});

self.addEventListener("fetch", (e) => {
  console.log("Service worker fetch");
  // offline experience way 1 ## bad practice
  // it is not a good way to do it  because it will fetch the file from the network every time
  // whenever a file is requested, the service worker will check if the file is in the cache
  // 1. if the file is in the cache, the service worker will return the file from the cache
  // 2. if the file is not in the cache, the service worker will return the file from the network

  // offline experience way 2
  // fetch from the network first if the file is not available in the network, the service worker will fetch the file from the cache
  // this is a good way to do it because it will fetch the file from the network first and then from the cache if the file is not available in the network
  // here cache is used as a fallback mechanism to provide the file to the user
  e.respondWith(
    fetch(e.request)
      .then((res) => {
        console.log("File fetched from the network");
        // for ignoring css file
        // if (e.request.url.endsWith(".css")) {
        //   return res;
        // }
        // if the file is not in the allowed cache file list, then we will not store it in the cache
        // it will not dummy.js file
        if (!allowedCacheFileList.includes(e.request.url)) {
          return res;
        }
        const clonedResponse = res.clone(); // why we are cloning the response?
        // because the response is a stream and we need to store it in the cache
        // and the response is read only so we need to clone it to store it in the cache
        caches.open(CACHE_NAME).then((cache) => {
          // store the file in the cache for future use
          // replace the file in the cache with the new file

          cache.put(e.request, clonedResponse);
        });
        return res;
      })
      .catch(() => {
        console.log("File fetched from the cache");
        return caches.match(e.request).then((res) => res);
      })
  );
});
