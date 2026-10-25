// =====================================================================
//  OFFLINE – gör att spelen fungerar utan internet
//
//  Det här är en "service worker": ett litet program som webbläsaren
//  kör i bakgrunden. Första gången man öppnar spelen med internet sparas
//  alla filerna på enheten. Sedan går spelen att starta även i bilen
//  eller på flyget.
//
//  Finns det internet hämtas alltid den senaste versionen (så syns det
//  man har ändrat direkt). Finns det inget internet, eller går det för
//  långsamt, används det som är sparat.
//
//  Lägger man till ett nytt spel ska dess mapp in i FILER här nedanför.
// =====================================================================

const CACHE = "bajskorv-studios";

// Allt som behövs för att spelen ska fungera utan internet
const FILER = [
  "./",
  "spel.css",
  "sprak.js",
  "offline.js",
  "topplista.js",
  "manifest.webmanifest",
  "favicon.svg",
  "favicon.png",
  "apple-touch-icon.png",
  "ikon-192.png",
  "ikon-512.png",
  ...["stjarnor", "parkour", "pappa", "hund", "fis", "bord", "godis", "bajsbyn"].flatMap((spel) => [spel + "/", spel + "/game.js"]),
  // 3D-testsidan (finns inte i menyn)
  "test3d/",
  "test3d/test3d.js",
  // Three.js, för 3D-spelen (MIT-licens, se three-LICENSE.txt)
  "three.min.js",
];

// Så länge väntar vi på internet innan vi tar det sparade i stället (millisekunder)
const VANTA_PA_NATET = 3000;

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE).then((cache) =>
      // En fil i taget, så att en fil som saknas inte stoppar resten
      Promise.all(FILER.map((fil) => cache.add(new Request(fil, { cache: "reload" })).catch(() => {})))
    ).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (e) => {
  const fraga = e.request;
  if (fraga.method !== "GET" || new URL(fraga.url).origin !== self.location.origin) return;
  e.respondWith(hamta(fraga));
});

async function hamta(fraga) {
  const cache = await caches.open(CACHE);
  const franNatet = fetch(fraga).then((svar) => {
    if (svar.ok) cache.put(fraga, svar.clone());
    return svar;
  });
  // Hämtningen fortsätter i bakgrunden, så att det sparade blir nytt till nästa gång
  franNatet.catch(() => {});

  const sparat = () => hittaSparat(cache, fraga);
  try {
    return await Promise.race([
      franNatet,
      new Promise((_, nej) => setTimeout(nej, VANTA_PA_NATET)),
    ]);
  } catch (fel) {
    // Inget internet, eller för långsamt: ta det sparade om det finns
    const svar = await sparat();
    if (svar) return svar;
    return franNatet; // Inget sparat – vänta på nätet i alla fall
  }
}

async function hittaSparat(cache, fraga) {
  const svar = await cache.match(fraga, { ignoreSearch: true });
  if (svar) return svar;
  // "hund/index.html" är samma sida som "hund/"
  const url = new URL(fraga.url);
  if (url.pathname.endsWith("/index.html")) {
    url.pathname = url.pathname.slice(0, -"index.html".length);
    return cache.match(url.href, { ignoreSearch: true });
  }
  return undefined;
}
