(function () {
  var waitingWorker = null,
    reloadAfterUpdate = false,
    banner = document.getElementById("update-banner");

  function showUpdate(worker) {
    waitingWorker = worker;
    banner.style.position = "fixed";
    banner.style.top = "calc(env(safe-area-inset-top, 0px) + 10px)";
    banner.style.left = "50%";
    banner.style.zIndex = "1000";
    banner.style.display = "flex";
    banner.style.alignItems = "center";
    banner.style.gap = "12px";
    banner.style.padding = "10px 14px";
    banner.style.borderRadius = "14px";
    banner.style.background = "rgba(20, 28, 58, 0.97)";
    banner.style.transform = "translateX(-50%)";
    banner.classList.remove("hid");
  }

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.addEventListener("controllerchange", function () {
      if (reloadAfterUpdate) location.reload();
    });
    addEventListener("load", function () {
      navigator.serviceWorker
        .register("sw.js")
        .then(function (registration) {
          if (registration.waiting && navigator.serviceWorker.controller)
            showUpdate(registration.waiting);

          function watchInstalling(worker) {
            if (!worker) return;
            function checkState() {
              if (
                worker.state === "installed" &&
                navigator.serviceWorker.controller
              )
                showUpdate(registration.waiting || worker);
            }
            checkState();
            worker.addEventListener("statechange", checkState);
          }

          watchInstalling(registration.installing);
          registration.addEventListener("updatefound", function () {
            watchInstalling(registration.installing);
          });
        })
        .catch(function (error) {
          console.error("Service worker registration failed:", error);
        });
    });
  }

  document.getElementById("update-now").addEventListener("click", function () {
    if (!waitingWorker) return;
    reloadAfterUpdate = true;
    waitingWorker.postMessage({ type: "SKIP_WAITING" });
  });
})();
