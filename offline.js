// Startar sw.js, som sparar spelen på enheten så att de fungerar utan
// internet. Se sw.js. Den här filen laddas av menyn och alla spelen.

(function () {
  if (!("serviceWorker" in navigator) || location.protocol === "file:") return;
  // sw.js ligger bredvid den här filen, i projektets rot
  const adress = new URL("sw.js", document.currentScript.src);
  window.addEventListener("load", () => {
    navigator.serviceWorker.register(adress).catch(() => {
      // Går inte (t.ex. privat läge) – spelen fungerar ändå, men bara med internet
    });
  });
})();
