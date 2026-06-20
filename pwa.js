(() => {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("/sw.js").catch(err => console.warn("Service worker registration failed", err));
    });
  }

  const isStandalone = window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone;
  if (isStandalone) document.documentElement.classList.add("is-pwa");

  let deferredInstallPrompt = null;
  window.addEventListener("beforeinstallprompt", event => {
    event.preventDefault();
    deferredInstallPrompt = event;
    document.dispatchEvent(new CustomEvent("perfectday-install-ready"));
  });

  window.PerfectDayPWA = {
    canInstall: () => !!deferredInstallPrompt,
    install: async () => {
      if (!deferredInstallPrompt) return false;
      deferredInstallPrompt.prompt();
      const result = await deferredInstallPrompt.userChoice;
      deferredInstallPrompt = null;
      return result.outcome === "accepted";
    },
    isStandalone: () => isStandalone
  };
})();
