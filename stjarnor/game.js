// =====================================================================
//  VÅRT SPEL – Fånga stjärnorna!
//
//  Det här är ett litet startspel. Styr figuren med fingret (eller
//  piltangenterna på datorn), fånga det som är bra och undvik bomberna.
//
//  Texter skrivs som t("svenska", "English"), så finns spelet på båda
//  språken. Se sprak.js.
//
//  Börja med att ändra i INSTALLNINGAR här nedanför – testa att byta
//  figurer, färger och hastighet. Ladda om sidan för att se ändringen.
// =====================================================================

const INSTALLNINGAR = {
  spelare: "🐱",                 // Den du styr
  braSaker: ["⭐", "🍓", "🍪"],   // Ge poäng när man fångar dem
  daligaSaker: ["💣"],           // Kostar ett liv
  chansForDalig: 0.25,           // 0 = aldrig bomber, 1 = bara bomber
  liv: 3,
  falltidStart: 4,               // Sekunder det tar för en sak att falla hela vägen i början
  falltidMinst: 1.5,             // ...och när spelet är som svårast
  himmelUppe: "#1b2a4a",
  himmelNere: "#4a6fa5",
  textfarg: "#ffffff",
  ljud: true,
};

// ---------------------------------------------------------------------
//  Härifrån och ner är själva spelet.
// ---------------------------------------------------------------------

const canvas = document.getElementById("spel");
const ctx = canvas.getContext("2d");
const hemKnapp = document.getElementById("hem");
const pausKnapp = document.getElementById("paus");
const pausmeny = document.getElementById("pausmeny");
const TYPSNITT = 'system-ui, -apple-system, "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif';

let bredd = 0;
let hojd = 0;
let marginal = { topp: 0, vanster: 0, hoger: 0, botten: 0 }; // Plats som notch/hemknapp tar
let enhet = 0; // En "storleksenhet" som beror på skärmen, så att allt ser lika stort ut på telefon och iPad

let lage = "start"; // "start", "spelar" eller "slut"
let poang = 0;
let rekord = lasRekord();
let liv = INSTALLNINGAR.liv;
let speltid = 0;
let tidTillNastaSak = 0;
let tidSedanSlut = 0;

const spelare = { x: 0, y: 0, malX: 0 };
let saker = [];    // Det som faller
let effekter = []; // "+1" som flyger upp när man fångar något

// ---------- Skärmstorlek ----------

function lasMarginal(namn) {
  return parseFloat(getComputedStyle(document.documentElement).getPropertyValue(namn)) || 0;
}

function anpassaStorlek() {
  marginal = {
    topp: lasMarginal("--sakert-topp"),
    vanster: lasMarginal("--sakert-vanster"),
    hoger: lasMarginal("--sakert-hoger"),
    botten: lasMarginal("--sakert-botten"),
  };
  const dpr = window.devicePixelRatio || 1;
  bredd = window.innerWidth;
  hojd = window.innerHeight;
  canvas.width = Math.round(bredd * dpr);
  canvas.height = Math.round(hojd * dpr);
  canvas.style.width = bredd + "px";
  canvas.style.height = hojd + "px";
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0); // Skarp grafik även på Retina-skärmar
  enhet = Math.min(bredd, hojd) / 10;
  spelare.y = hojd - marginal.botten - enhet * 1.6;
  spelare.x = Math.min(Math.max(spelare.x || bredd / 2, 0), bredd);
  spelare.malX = spelare.x;
}

window.addEventListener("resize", anpassaStorlek);
anpassaStorlek();

// ---------- Styrning: finger, mus och tangentbord ----------

canvas.addEventListener("pointerdown", (e) => {
  startaLjud();
  if (lage === "start" || (lage === "slut" && tidSedanSlut > 0.8)) {
    startaSpel();
  }
  spelare.malX = e.clientX;
});

canvas.addEventListener("pointermove", (e) => {
  // På dator följer figuren musen, på iPad/telefon följer den fingret
  if (e.pointerType === "mouse" || e.buttons > 0 || e.pressure > 0) {
    spelare.malX = e.clientX;
  }
});

const nedtryckt = {};
window.addEventListener("keydown", (e) => {
  nedtryckt[e.key] = true;
  if (e.key === "p" || e.key === "Escape") {
    if (lage === "spelar") pausa();
    else if (lage === "paus") fortsatt();
  }
  if ((e.key === " " || e.key === "Enter") && (lage === "start" || lage === "slut")) {
    startaLjud();
    startaSpel();
  }
});
window.addEventListener("keyup", (e) => { nedtryckt[e.key] = false; });

// Stoppa nyp-zoom i Safari på iPad/iPhone
document.addEventListener("gesturestart", (e) => e.preventDefault());

// ---------- Paus ----------

function pausa() {
  if (lage !== "spelar") return;
  lage = "paus";
  pausmeny.hidden = false;
  document.getElementById("fortsatt").focus();
}

function fortsatt() {
  if (lage !== "paus") return;
  lage = "spelar";
  pausmeny.hidden = true;
}

pausKnapp.addEventListener("click", pausa);
document.getElementById("fortsatt").addEventListener("click", fortsatt);
document.getElementById("borjaOm").addEventListener("click", () => {
  pausmeny.hidden = true;
  startaSpel();
});

// Pausa av sig själv om man byter app eller flik
document.addEventListener("visibilitychange", () => {
  if (document.hidden) pausa();
});

// ---------- Spelets regler ----------

function startaSpel() {
  lage = "spelar";
  poang = 0;
  liv = INSTALLNINGAR.liv;
  speltid = 0;
  tidTillNastaSak = 0.5;
  saker = [];
  effekter = [];
}

function slumpa(lista) {
  return lista[Math.floor(Math.random() * lista.length)];
}

function skapaSak() {
  const dalig = Math.random() < INSTALLNINGAR.chansForDalig;
  const falltid = Math.max(INSTALLNINGAR.falltidMinst, INSTALLNINGAR.falltidStart - speltid * 0.04);
  saker.push({
    x: enhet * 0.6 + Math.random() * (bredd - enhet * 1.2),
    y: -enhet,
    fart: hojd / falltid,
    dalig: dalig,
    bild: dalig ? slumpa(INSTALLNINGAR.daligaSaker) : slumpa(INSTALLNINGAR.braSaker),
    snurr: (Math.random() - 0.5) * 2,
    vinkel: 0,
  });
}

function uppdatera(dt) {
  if (lage === "paus") return; // Allt står still under pausen

  // Effekter flyger upp och tonar bort i alla lägen
  for (const ef of effekter) {
    ef.y -= enhet * 2 * dt;
    ef.kvar -= dt;
  }
  effekter = effekter.filter((ef) => ef.kvar > 0);

  if (lage === "slut") tidSedanSlut += dt;
  if (lage !== "spelar") return;

  speltid += dt;

  // Piltangenter på datorn
  if (nedtryckt["ArrowLeft"]) spelare.malX = spelare.x - enhet * 2;
  if (nedtryckt["ArrowRight"]) spelare.malX = spelare.x + enhet * 2;
  spelare.malX = Math.min(Math.max(spelare.malX, enhet * 0.5), bredd - enhet * 0.5);

  // Figuren glider mjukt mot fingret
  spelare.x += (spelare.malX - spelare.x) * Math.min(1, dt * 12);

  // Nya saker kommer tätare ju längre man spelar
  tidTillNastaSak -= dt;
  if (tidTillNastaSak <= 0) {
    skapaSak();
    tidTillNastaSak = Math.max(0.35, 1.0 - speltid * 0.01);
  }

  for (const sak of saker) {
    sak.y += sak.fart * dt;
    sak.vinkel += sak.snurr * dt;

    const dx = sak.x - spelare.x;
    const dy = sak.y - spelare.y;
    if (Math.hypot(dx, dy) < enhet * 0.85) {
      sak.borta = true;
      if (sak.dalig) {
        liv -= 1;
        effekter.push({ x: sak.x, y: sak.y, text: "💥", kvar: 0.8 });
        spelaLjud(120, 0.3, "sawtooth");
        if (navigator.vibrate) navigator.vibrate(150);
        if (liv <= 0) slutaSpel();
      } else {
        poang += 1;
        effekter.push({ x: sak.x, y: sak.y, text: "+1", kvar: 0.8 });
        spelaLjud(600 + Math.random() * 300, 0.15, "triangle");
      }
    } else if (sak.y > hojd + enhet) {
      sak.borta = true; // Föll ut ur skärmen
    }
  }
  saker = saker.filter((sak) => !sak.borta);
}

function slutaSpel() {
  lage = "slut";
  tidSedanSlut = 0;
  if (poang > rekord) {
    rekord = poang;
    sparaRekord(rekord);
  }
}

// ---------- Rita ----------

function ritaText(text, x, y, storlek, farg, just = "center") {
  ctx.font = `bold ${storlek}px ${TYPSNITT}`;
  ctx.textAlign = just;
  ctx.textBaseline = "middle";
  ctx.fillStyle = farg || INSTALLNINGAR.textfarg;
  ctx.fillText(text, x, y);
}

function rita() {
  // Pausknappen syns bara när man spelar. Under pausen finns allt i pausmenyn.
  pausKnapp.hidden = lage !== "spelar";
  hemKnapp.hidden = lage === "paus";

  const himmel = ctx.createLinearGradient(0, 0, 0, hojd);
  himmel.addColorStop(0, INSTALLNINGAR.himmelUppe);
  himmel.addColorStop(1, INSTALLNINGAR.himmelNere);
  ctx.fillStyle = himmel;
  ctx.fillRect(0, 0, bredd, hojd);

  for (const sak of saker) {
    ctx.save();
    ctx.translate(sak.x, sak.y);
    ctx.rotate(sak.vinkel);
    ritaText(sak.bild, 0, 0, enhet);
    ctx.restore();
  }

  ritaText(INSTALLNINGAR.spelare, spelare.x, spelare.y, enhet * 1.3);

  for (const ef of effekter) {
    ctx.globalAlpha = Math.max(0, ef.kvar / 0.8);
    ritaText(ef.text, ef.x, ef.y, enhet * 0.7);
  }
  ctx.globalAlpha = 1;

  const topp = marginal.topp + Math.max(enhet * 0.8, 40);
  if (lage === "spelar" || lage === "paus") {
    ritaText("⭐ " + poang, marginal.vanster + 150, topp, enhet * 0.6, undefined, "left"); // Till höger om knapparna
    ritaText("❤️".repeat(Math.max(0, liv)), bredd - marginal.hoger - enhet * 1.8, topp, enhet * 0.5);
  }

  if (lage === "start") {
    ritaText(t("Fånga stjärnorna!", "Catch the stars!"), bredd / 2, hojd * 0.35, enhet * 0.9);
    ritaText(t("Undvik 💣", "Dodge the 💣"), bredd / 2, hojd * 0.35 + enhet * 1.2, enhet * 0.55);
    ritaText(t("Tryck för att börja", "Tap to start"), bredd / 2, hojd * 0.55, enhet * 0.55);
    if (rekord > 0) ritaText(t("Rekord: ", "High score: ") + rekord, bredd / 2, hojd * 0.55 + enhet, enhet * 0.45);
  }

  if (lage === "slut") {
    ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
    ctx.fillRect(0, 0, bredd, hojd);
    ritaText(t("Slut!", "Game over!"), bredd / 2, hojd * 0.3, enhet * 1.2);
    ritaText(t("Du fick " + poang + " poäng", "You got " + poang + (poang === 1 ? " point" : " points")), bredd / 2, hojd * 0.3 + enhet * 1.4, enhet * 0.6);
    const nyttRekord = poang > 0 && poang === rekord;
    ritaText(nyttRekord ? t("🏆 Nytt rekord! 🏆", "🏆 New high score! 🏆") : t("Rekord: ", "High score: ") + rekord, bredd / 2, hojd * 0.3 + enhet * 2.3, enhet * 0.5);
    if (tidSedanSlut > 0.8) ritaText(t("Tryck för att spela igen", "Tap to play again"), bredd / 2, hojd * 0.65, enhet * 0.55);
  }
}

// ---------- Spel-loopen: körs ungefär 60 gånger per sekund ----------

let forraTiden = performance.now();
function loop(nu) {
  const dt = Math.min(0.05, (nu - forraTiden) / 1000); // Max 0,05 s så att inget hoppar om fliken legat i bakgrunden
  forraTiden = nu;
  uppdatera(dt);
  rita();
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

// ---------- Ljud (skapas direkt i webbläsaren, inga ljudfiler behövs) ----------

let ljudmotor = null;
function startaLjud() {
  // iPad/iPhone tillåter bara ljud efter att man tryckt på skärmen
  if (!INSTALLNINGAR.ljud) return;
  try {
    if (!ljudmotor) ljudmotor = new (window.AudioContext || window.webkitAudioContext)();
    if (ljudmotor.state === "suspended") ljudmotor.resume();
  } catch (e) {
    ljudmotor = null;
  }
}

function spelaLjud(frekvens, langd, typ) {
  if (!ljudmotor) return;
  try {
    const t = ljudmotor.currentTime;
    const ton = ljudmotor.createOscillator();
    const volym = ljudmotor.createGain();
    ton.type = typ;
    ton.frequency.setValueAtTime(frekvens, t);
    volym.gain.setValueAtTime(0.2, t);
    volym.gain.exponentialRampToValueAtTime(0.001, t + langd);
    ton.connect(volym);
    volym.connect(ljudmotor.destination);
    ton.start(t);
    ton.stop(t + langd);
  } catch (e) {
    // Inget ljud – spelet fungerar ändå
  }
}

// ---------- Rekord sparas i webbläsaren på just den här enheten ----------

function lasRekord() {
  try {
    return Number(localStorage.getItem("rekord")) || 0;
  } catch (e) {
    return 0;
  }
}

function sparaRekord(varde) {
  try {
    localStorage.setItem("rekord", String(varde));
  } catch (e) {
    // Privat läge e.d. – rekordet sparas bara tills sidan laddas om
  }
}
