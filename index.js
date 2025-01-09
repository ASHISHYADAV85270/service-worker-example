// check if service worker is supported by the browser
if (navigator.serviceWorker) {
  // register the service worker
  // scope is the directory where the service worker will be active
  // if the scope is not set, the service worker will be active in the current directory
  // if the scope is set, the service worker will be active in the current directory and all the subdirectories
  navigator.serviceWorker
    .register("./sw.js")
    .then((res) => {
      console.log("Service worker registered successfully", res);
    })
    .catch((err) => {
      console.log("Service worker registration failed", err);
    });
}
