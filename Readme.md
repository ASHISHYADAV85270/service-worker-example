  # Service Worker Implementation

This project demonstrates the use of a service worker for caching and providing offline support for a simple web application.

## Features
- **Cache Management:**
  - Caches essential files listed in the `allowedCacheFileList`.
  - Deletes old caches when a new service worker is activated.
- **Offline Support:**
  - Serves cached files when the network is unavailable.
  - Fetches files from the network and updates the cache when online.
- **Dynamic Caching:**
  - Fetches files from the network first and falls back to the cache if the network request fails.

## File List to Cache
The following files are added to the cache during the service worker installation:
- `index.html`
- `index.js`
- `virat.jpg`
- `index.css`

## Code Explanation

### Cache Name and File List
```javascript
const CACHE_NAME = "app-data-cache2";
const allowedCacheFileList = [
  "./index.html",
  "./index.js",
  "./virat.jpg",
  "./index.css",
];
```
These define the cache name and the list of files to be cached.

### Install Event
```javascript
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      cache.addAll(allowedCacheFileList);
    })
  );
});
```
- Opens the cache and adds the specified files to it.
- Ensures the service worker waits until caching is complete.

### Activate Event
```javascript
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
```
- Deletes old caches that do not match the current `CACHE_NAME`.

### Fetch Event
```javascript
self.addEventListener("fetch", (e) => {
  e.respondWith(
    fetch(e.request)
      .then((res) => {
        if (!allowedCacheFileList.includes(e.request.url)) {
          return res;
        }
        const clonedResponse = res.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(e.request, clonedResponse);
        });
        return res;
      })
      .catch(() => {
        return caches.match(e.request).then((res) => res);
      })
  );
});
```
- Attempts to fetch the requested file from the network.
- If successful and the file is in the allowed cache list, it updates the cache.
- If the network request fails, it retrieves the file from the cache.

### Service Worker Registration
```javascript
if (navigator.serviceWorker) {
  navigator.serviceWorker
    .register("./sw.js", { scope: "/" })
    .then((res) => {
      console.log("Service worker registered successfully", res);
    })
    .catch((err) => {
      console.log("Service worker registration failed", err);
    });
}
```
- Registers the service worker.
- Sets the scope to the root directory and all subdirectories.

## Notes
1. **Cloned Response:**
   - Responses are cloned before storing them in the cache because the response stream can only be consumed once.
2. **Dynamic Caching:**
   - The service worker dynamically caches files and updates existing entries for files in the `allowedCacheFileList`.
3. **Best Practices:**
   - Avoid caching large or frequently changing files unless necessary.
   - Test thoroughly to ensure the service worker behaves as expected.

## Testing
1. Open the project in a browser that supports service workers (e.g., Chrome, Firefox).
2. Check the "Application" tab in DevTools to view the cached files.
3. Disable the network to test offline support.

## Troubleshooting
- Ensure the service worker file (`sw.js`) is located in the root directory or adjust the registration path accordingly.
- Use HTTPS or `localhost` for testing, as service workers require a secure context.

## License
This project is open-source and free to use.

