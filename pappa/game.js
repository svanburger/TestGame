// =====================================================================
//  LÅT PAPPA VILA
//
//  Pappa vilar i fåtöljen och scrollar på telefonen. Du är ett barn som
//  springer runt i vardagsrummet och leker – men tyst, så att pappa får
//  vila!
//
//  Dra med fingret (eller tryck) för att springa. Ställ dig bredvid en
//  sak för att leka med den. Hunden släpar fram leksaker. Plocka upp dem
//  och lägg dem i leksakslådan, det ger mest poäng.
//
//  Allt man gör låter lite. Blir det för mycket ljud blir pappa störd.
//  Stör man pappa 3 gånger är spelet slut. Är det tyst länge somnar
//  pappa, och då får man dubbla poäng.
//
//  Börja med att ändra i INSTALLNINGAR här nedanför.
// =====================================================================

const INSTALLNINGAR = {
  // Saker att leka med. "poang" är poäng per sekund och "ljud" hur mycket
  // det låter. "plats" är var i rummet saken står: [0, 0] är uppe till
  // vänster och [1, 1] är nere till höger.
  lekar: [
    { typ: "bok", bild: "📖", poang: 1, ljud: 0, plats: [0.1, 0.15] },
    { typ: "rita", bild: "🖍️", poang: 2, ljud: 4, plats: [0.9, 0.15] },
    { typ: "boll", bild: "⚽", poang: 3, ljud: 15, plats: [0.12, 0.88] },
    { typ: "klossar", bild: "🧱", poang: 5, ljud: 9, plats: [0.5, 0.9] },
    { typ: "trumma", bild: "🥁", poang: 12, ljud: 42, plats: [0.88, 0.88] },
  ],
  leksaker: ["🧸", "🚗", "🦖", "🤖", "🦆", "🚂", "🧩", "🪀"], // Det som hunden släpar fram
  hund: "🐕",

  poang: {
    vila: 1,        // Varje sekund som pappa får vila
    stada: 25,      // Varje leksak man lägger i lådan
    teckning: 20,   // När en teckning är klar
  },
  buller: {
    springa: 5,     // Per sekund när man springer
    matta: 45,      // Per sekund när man är på pappas matta
    trampa: 20,     // När man kliver på en leksak och redan har händerna fulla
    rasa: 30,       // När klosstornet rasar
  },

  liv: 3,              // Hur många gånger man får störa pappa
  lugnStart: 16,       // Hur snabbt pappa lugnar sig i början...
  lugnMinst: 6,        // ...och när han är som tröttast
  blirTrott: 0.06,     // Hur fort pappa blir tröttare (och lättare att störa)
  somnaEfter: 6,       // Så många sekunder tyst innan pappa somnar
  barMax: 3,           // Hur många leksaker man kan bära på en gång
  maxLeksaker: 8,      // Hur många leksaker som mest ligger på golvet
  hundTappar: 8,       // Sekunder mellan varje leksak hunden släpper i början...
  hundTapparMinst: 3.5, // ...och som tätast
  fart: 4.5,           // Hur fort barnet springer

  barnFarg: "#ff7a59", // Barnets tröja
  harFarg: "#5a3a22",  // Barnets hår
  pappaFarg: "#4a7bb7", // Pappas tröja
  ljud: true,
  musik: true,         // Vaggvisan i bakgrunden
};

// ---------------------------------------------------------------------
//  Härifrån och ner är själva spelet.
//
//  Allt i rummet mäts i "enheter". En enhet är ungefär så stor som
//  barnet. Variabeln u säger hur många pixlar en enhet är på just den här
//  skärmen. x och y räknas från golvets övre vänstra hörn.
// ---------------------------------------------------------------------

const P = INSTALLNINGAR.poang;
const B = INSTALLNINGAR.buller;
const canvas = document.getElementById("spel");
const ctx = canvas.getContext("2d");
const hemKnapp = document.getElementById("hem");
const pausKnapp = document.getElementById("paus");
const pausmeny = document.getElementById("pausmeny");
const musikKnapp = document.getElementById("musikKnapp");
const TYPSNITT = 'ui-rounded, system-ui, -apple-system, "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif';

const STOL = 1.3; // Hur stor fåtöljen är (man kan inte springa igenom den)
const KLOSSFARGER = ["#e74c3c", "#3498db", "#f1c40f", "#2ecc71", "#9b59b6"];
const KRITFARGER = ["#e74c3c", "#3498db", "#2ecc71", "#f1c40f", "#9b59b6", "#ff8fb1"];

let bredd = 0;
let hojd = 0;
let u = 0;
let marginal = { topp: 0, vanster: 0, hoger: 0, botten: 0 };
let golv = { x: 0, y: 0, b: 1, h: 1 }; // x och y i pixlar, b (bredd) och h (höjd) i enheter

// Hur skarpt spelet ritas. 2 är skarpast på iPad. Hinner enheten inte med
// sänks det av sig självt, så att spelet flyter i stället för att hacka.
let pixelSkala = Math.min(window.devicePixelRatio || 1, 2);
let bildtider = [];
const emojiMinne = new Map(); // Färdigritade emojis
const rum = document.createElement("canvas"); // Vardagsrummet, ritat en gång

let lage = "start"; // "start", "spelar", "paus" eller "slut"
let poang = 0;
let poangRest = 0;   // Delar av poäng som inte blivit en hel poäng än
let rekord = lasRekord();
let tid = 0;
let speltid = 0;
let tidSedanSlut = 0;

let buller = 0;      // 0–100. När det når 100 blir pappa störd.
let bullerIn = 0;    // Hur mycket det låter just nu, per sekund
let livKvar = INSTALLNINGAR.liv;
let stordTid = 0;    // Tid kvar som pappa säger till (då står allt still)
let sover = false;
let tystTid = 0;     // Hur länge det varit tyst
let varnad = false;
let pappaSager = "";
let pratTid = 0;
let skakning = 0;
let antalStadade = 0;
let aktivLek = null; // Det barnet leker med just nu

const matta = { x: 0, y: 0, r: 2 }; // Pappas matta. Fåtöljen står mitt på den.
const lada = { x: 0, y: 0, pop: 0 }; // Leksakslådan
const korg = { x: 0, y: 0 };         // Hundens korg
const lekar = INSTALLNINGAR.lekar.map((l) => ({
  ...l,
  x: 0,
  y: 0,
  standX: 0,     // Där barnet står när det leker
  standY: 0,
  klocka: 0,
  fas: 0,
  streck: [],    // Teckningen
  torn: [],      // Klosstornet
  rasHojd: 6,
  bitar: [],     // Klossar som flyger när tornet rasar
}));
let barn = nyttBarn();
let hund = nyHund();
let leksaker = [];
let texter = [];      // Texter som flyger upp
const tangent = {};   // Vilka tangenter som är nedtryckta

function nyttBarn() {
  return { x: golv.b * 0.3, y: golv.h * 0.7, malX: 0, malY: 0, harMal: false, ror: false, riktning: 1, gangFas: 0, bar: [] };
}

function nyHund() {
  return { x: korg.x, y: korg.y, malX: korg.x, malY: korg.y, vila: 2, riktning: 1, fas: 0, tappaTid: 4, bar: slumpa(INSTALLNINGAR.leksaker) };
}

// ---------- Små hjälpfunktioner ----------

function slumpa(lista) {
  return lista[Math.floor(Math.random() * lista.length)];
}

function begr(v, minst, mest) {
  return Math.min(mest, Math.max(minst, v));
}

// Ger samma "slumptal" varje gång för samma n (så att golvplankorna inte blinkar)
function slumpTal(n) {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
}

function X(x) {
  return golv.x + x * u;
}

function Y(y) {
  return golv.y + y * u;
}

function rundRekt(c, x, y, w, h, r) {
  c.beginPath();
  c.moveTo(x + r, y);
  c.arcTo(x + w, y, x + w, y + h, r);
  c.arcTo(x + w, y + h, x, y + h, r);
  c.arcTo(x, y + h, x, y, r);
  c.arcTo(x, y, x + w, y, r);
  c.closePath();
}

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
  const gammaltGolv = golv;
  bredd = window.innerWidth;
  hojd = window.innerHeight;
  canvas.width = Math.round(bredd * pixelSkala);
  canvas.height = Math.round(hojd * pixelSkala);
  canvas.style.width = bredd + "px";
  canvas.style.height = hojd + "px";
  ctx.setTransform(pixelSkala, 0, 0, pixelSkala, 0, 0);

  u = Math.min(bredd, hojd) / 9;
  const golvTopp = marginal.topp + Math.max(u * 1.5, 100); // Väggen ovanför golvet har plats för poäng och ljudmätare
  golv = {
    x: marginal.vanster + u * 0.3,
    y: golvTopp,
    b: (bredd - marginal.vanster - marginal.hoger - u * 0.6) / u,
    h: (hojd - golvTopp - marginal.botten - u * 0.3) / u,
  };

  // Flytta det som rör sig så att det hamnar på samma ställe i det nya rummet
  const sx = golv.b / gammaltGolv.b;
  const sy = golv.h / gammaltGolv.h;
  for (const s of [barn, hund, ...leksaker]) {
    s.x *= sx;
    s.y *= sy;
    if (s.malX !== undefined) {
      s.malX *= sx;
      s.malY *= sy;
    }
  }

  placeraSaker();
  emojiMinne.clear();
  ritaRummet();
}

function placeraSaker() {
  matta.x = golv.b * 0.5;
  matta.y = golv.h * 0.42;
  matta.r = begr(Math.min(golv.h * 0.32, golv.b * 0.24), 1.8, 2.3);
  lada.x = golv.b * 0.92;
  lada.y = golv.h * 0.5;
  korg.x = golv.b * 0.08;
  korg.y = golv.h * 0.5;
  for (const l of lekar) {
    l.x = golv.b * l.plats[0];
    l.y = golv.h * l.plats[1];
    const sida = l.x < golv.b / 2 ? 1 : -1; // Barnet står på den sida som är närmast mitten av rummet
    l.standX = begr(l.x + sida * 0.85, 0.4, golv.b - 0.4);
    l.standY = begr(l.y + 0.05, 0.6, golv.h - 0.15);
  }
}

// Mäter hur snabbt bilderna ritas. Går det för långsamt ritar vi med färre pixlar.
function kollaFart(dt) {
  if (lage !== "spelar" || pixelSkala <= 1) return;
  bildtider.push(dt);
  if (bildtider.length < 60) return;
  const snitt = bildtider.reduce((summa, t) => summa + t, 0) / bildtider.length;
  bildtider = [];
  if (snitt > 0.024) {
    pixelSkala = Math.max(1, pixelSkala - 0.5);
    anpassaStorlek();
  }
}

window.addEventListener("resize", anpassaStorlek);

// ---------- Styrning ----------

let fingerNere = false;

// Barnet springer dit man trycker. Trycker man på en sak springer det dit och leker.
function springTill(px, py, fastna) {
  if (stordTid > 0) return;
  let x = (px - golv.x) / u;
  let y = (py - golv.y) / u;
  if (fastna) {
    for (const l of lekar) {
      if (Math.hypot(x - l.x, y - (l.y - 0.3)) < 0.9) {
        x = l.standX;
        y = l.standY;
        break;
      }
    }
    if (Math.hypot(x - lada.x, y - (lada.y - 0.3)) < 1) {
      x = lada.x + (lada.x < golv.b / 2 ? 0.9 : -0.9);
      y = lada.y;
    }
  }
  // Man kan inte springa in i fåtöljen
  const dx = x - matta.x;
  const dy = y - matta.y;
  const d = Math.hypot(dx, dy);
  if (d < STOL && d > 0) {
    x = matta.x + (dx / d) * STOL;
    y = matta.y + (dy / d) * STOL;
  }
  barn.malX = begr(x, 0.4, golv.b - 0.4);
  barn.malY = begr(y, 0.6, golv.h - 0.15);
  barn.harMal = true;
}

canvas.addEventListener("pointerdown", (e) => {
  e.preventDefault();
  startaLjud();
  if (lage === "start" || (lage === "slut" && tidSedanSlut > 1)) {
    startaSpel();
    return;
  }
  if (lage !== "spelar") return;
  fingerNere = true;
  try {
    canvas.setPointerCapture(e.pointerId);
  } catch (fel) {
    // Gör inget – det fungerar ändå
  }
  springTill(e.clientX, e.clientY, true);
});

canvas.addEventListener("pointermove", (e) => {
  if (fingerNere && lage === "spelar") springTill(e.clientX, e.clientY, false);
});

canvas.addEventListener("pointerup", (e) => {
  if (!fingerNere) return;
  fingerNere = false;
  if (lage === "spelar") springTill(e.clientX, e.clientY, true);
});

canvas.addEventListener("pointercancel", () => {
  fingerNere = false;
});

window.addEventListener("keydown", (e) => {
  if (e.key === "p" || e.key === "Escape") {
    if (lage === "spelar") pausa();
    else if (lage === "paus") fortsatt();
    return;
  }
  if (lage === "start" || (lage === "slut" && tidSedanSlut > 1)) {
    if (e.key === " " || e.key === "Enter") {
      startaLjud();
      startaSpel();
    }
    return;
  }
  tangent[e.key.toLowerCase()] = true;
});

window.addEventListener("keyup", (e) => {
  tangent[e.key.toLowerCase()] = false;
});

// Stoppa nyp-zoom i Safari på iPad/iPhone
document.addEventListener("gesturestart", (e) => e.preventDefault());

// ---------- Paus ----------

function pausa() {
  if (lage !== "spelar") return;
  lage = "paus";
  fingerNere = false;
  for (const k in tangent) tangent[k] = false;
  pausmeny.hidden = false;
  document.getElementById("fortsatt").focus();
}

function fortsatt() {
  if (lage !== "paus") return;
  lage = "spelar";
  pausmeny.hidden = true;
  startaLjud();
}

function visaMusikKnapp() {
  musikKnapp.textContent = musikPa ? "♪ Musik: på" : "♪ Musik: av";
}

pausKnapp.addEventListener("click", pausa);
document.getElementById("fortsatt").addEventListener("click", fortsatt);
document.getElementById("borjaOm").addEventListener("click", () => {
  pausmeny.hidden = true;
  startaLjud();
  startaSpel();
});
musikKnapp.addEventListener("click", () => {
  musikPa = !musikPa;
  sparaInstallning("musik-pappa", musikPa ? "pa" : "av");
  visaMusikKnapp();
});

// Pausa av sig själv om man byter app eller flik
document.addEventListener("visibilitychange", () => {
  if (document.hidden) pausa();
});

// ---------- Vägen runt pappas matta ----------

// Går linjen från a till b genom cirkeln?
function korsar(ax, ay, bx, by, cx, cy, r) {
  const vx = bx - ax;
  const vy = by - ay;
  const langd2 = vx * vx + vy * vy || 1;
  const t = begr(((cx - ax) * vx + (cy - ay) * vy) / langd2, 0, 1);
  return Math.hypot(ax + vx * t - cx, ay + vy * t - cy) < r;
}

// Ger punkten man ska gå mot för att ta sig till målet utan att gå över
// pappas matta. Står man redan på mattan, eller vill dit, går man raka vägen.
function vagMot(fx, fy, tx, ty) {
  const cx = matta.x;
  const cy = matta.y;
  const runt = matta.r + 0.35;
  const dFran = Math.hypot(fx - cx, fy - cy);
  if (dFran < matta.r + 0.1 || Math.hypot(tx - cx, ty - cy) < matta.r + 0.2) return [tx, ty];
  if (!korsar(fx, fy, tx, ty, cx, cy, matta.r + 0.2)) return [tx, ty];
  const bas = Math.atan2(fy - cy, fx - cx);
  if (dFran <= runt) {
    // Gå runt mattans kant, åt det håll där målet ligger
    const kryss = (fx - cx) * (ty - cy) - (fy - cy) * (tx - cx);
    const v = bas + (kryss > 0 ? 0.35 : -0.35);
    return [cx + Math.cos(v) * (runt + 0.05), cy + Math.sin(v) * (runt + 0.05)];
  }
  // Gå mot den kant av mattan som är närmast målet
  const a = Math.acos(runt / dFran);
  const p1 = [cx + Math.cos(bas + a) * runt, cy + Math.sin(bas + a) * runt];
  const p2 = [cx + Math.cos(bas - a) * runt, cy + Math.sin(bas - a) * runt];
  return Math.hypot(p1[0] - tx, p1[1] - ty) < Math.hypot(p2[0] - tx, p2[1] - ty) ? p1 : p2;
}

function paMattan() {
  return Math.hypot(barn.x - matta.x, barn.y - matta.y) < matta.r;
}

// En plats på golvet som inte är på mattan eller vid lekplatserna
function slumpPunkt() {
  let x = 0;
  let y = 0;
  for (let forsok = 0; forsok < 30; forsok++) {
    x = 0.6 + Math.random() * (golv.b - 1.2);
    y = 0.9 + Math.random() * (golv.h - 1.4);
    if (Math.hypot(x - matta.x, y - matta.y) < matta.r + 0.4) continue;
    if (lekar.some((l) => Math.hypot(x - l.x, y - l.y) < 1.1)) continue;
    if (Math.hypot(x - lada.x, y - lada.y) < 1.2 || Math.hypot(x - korg.x, y - korg.y) < 1) continue;
    break;
  }
  return [x, y];
}

// ---------- Spelets regler ----------

function laggLeksak(x, y, bild) {
  leksaker.push({
    x: begr(x, 0.5, golv.b - 0.5),
    y: begr(y, 0.7, golv.h - 0.2),
    bild,
    pop: 1,
    trampad: 0,
  });
}

function aterstall() {
  barn = nyttBarn();
  hund = nyHund();
  leksaker = [];
  texter = [];
  for (const l of lekar) {
    l.streck = [];
    l.torn = [];
    l.bitar = [];
    l.fas = 0;
    l.klocka = 0;
  }
  for (let i = 0; i < 3; i++) {
    const [x, y] = slumpPunkt();
    laggLeksak(x, y, slumpa(INSTALLNINGAR.leksaker));
  }
}

function startaSpel() {
  lage = "spelar";
  poang = 0;
  poangRest = 0;
  speltid = 0;
  buller = 0;
  bullerIn = 0;
  livKvar = INSTALLNINGAR.liv;
  stordTid = 0;
  sover = false;
  tystTid = 0;
  varnad = false;
  pratTid = 0;
  antalStadade = 0;
  aktivLek = null;
  musikSteg = 0;
  aterstall();
}

function slutaSpel() {
  lage = "slut";
  tidSedanSlut = 0;
  if (poang > rekord) {
    rekord = poang;
    sparaRekord(rekord);
  }
}

// Pappa blir tröttare ju längre man spelar, och då lugnar han sig långsammare
function lugnNu() {
  return Math.max(INSTALLNINGAR.lugnMinst, INSTALLNINGAR.lugnStart - speltid * INSTALLNINGAR.blirTrott);
}

function ge(text, mangd, x, y, farg) {
  const p = mangd * (sover ? 2 : 1);
  poang += p;
  texter.push({ x, y, text: text ? `${text} +${p}` : `+${p}`, kvar: 1.3, stor: !!text, farg });
}

// Något låter plötsligt
function larm(mangd) {
  buller += mangd * (sover ? 1.5 : 1);
}

function prata(text, langd) {
  pappaSager = text;
  pratTid = langd;
}

function bliStord() {
  livKvar -= 1;
  buller = 100;
  sover = false;
  tystTid = 0;
  aktivLek = null;
  barn.harMal = false;
  barn.ror = false;
  skakning = 0.4;
  stordTid = livKvar > 0 ? 2.2 : 2.6;
  if (livKvar > 0) {
    prata(slumpa(["Men snälla, jag vilar ju!", "Kan du vara lite tystare?", "Snälla, låt mig vila!", "Schhh! Pappa vilar!"]), stordTid);
  } else {
    prata("Nu orkar jag inte mer!", stordTid);
  }
  // Står barnet på mattan flyttas det ut till kanten
  const dx = barn.x - matta.x;
  const dy = barn.y - matta.y;
  const d = Math.hypot(dx, dy);
  if (d < matta.r + 0.3) {
    const v = d > 0.01 ? Math.atan2(dy, dx) : Math.PI / 2;
    barn.x = begr(matta.x + Math.cos(v) * (matta.r + 0.4), 0.4, golv.b - 0.4);
    barn.y = begr(matta.y + Math.sin(v) * (matta.r + 0.4), 0.6, golv.h - 0.15);
  }
  spelaTon(260, 90, 0.6, "sawtooth", 0.12);
  if (navigator.vibrate) navigator.vibrate(250);
}

function uppdateraBarn(dt) {
  const b = barn;
  const kx = (tangent.arrowright || tangent.d ? 1 : 0) - (tangent.arrowleft || tangent.a ? 1 : 0);
  const ky = (tangent.arrowdown || tangent.s ? 1 : 0) - (tangent.arrowup || tangent.w ? 1 : 0);
  let dx = 0;
  let dy = 0;
  let kvar = Infinity;
  if (kx || ky) {
    b.harMal = false;
    dx = kx;
    dy = ky;
  } else if (b.harMal) {
    kvar = Math.hypot(b.malX - b.x, b.malY - b.y);
    if (kvar < 0.05) {
      b.harMal = false;
    } else {
      const [vx, vy] = vagMot(b.x, b.y, b.malX, b.malY);
      dx = vx - b.x;
      dy = vy - b.y;
    }
  }

  const langd = Math.hypot(dx, dy);
  b.ror = langd > 0;
  if (b.ror) {
    const steg = Math.min(kvar, INSTALLNINGAR.fart * dt);
    b.x += (dx / langd) * steg;
    b.y += (dy / langd) * steg;
    if (Math.abs(dx / langd) > 0.3) b.riktning = Math.sign(dx);
    b.gangFas += dt * 13;
  }

  // Barnet kan inte springa genom fåtöljen eller ut ur rummet
  const sx = b.x - matta.x;
  const sy = b.y - matta.y;
  const d = Math.hypot(sx, sy);
  if (d < STOL && d > 0) {
    b.x = matta.x + (sx / d) * STOL;
    b.y = matta.y + (sy / d) * STOL;
  }
  b.x = begr(b.x, 0.4, golv.b - 0.4);
  b.y = begr(b.y, 0.6, golv.h - 0.15);
}

function uppdateraHund(dt) {
  const h = hund;
  h.fas += dt;
  if (h.vila > 0) {
    h.vila -= dt;
  } else {
    const d = Math.hypot(h.malX - h.x, h.malY - h.y);
    if (d < 0.1) {
      h.vila = 0.8 + Math.random() * 2;
      [h.malX, h.malY] = slumpPunkt();
    } else {
      const [vx, vy] = vagMot(h.x, h.y, h.malX, h.malY);
      const dx = vx - h.x;
      const dy = vy - h.y;
      const l = Math.hypot(dx, dy) || 1;
      const steg = Math.min(d, 1.8 * dt);
      h.x += (dx / l) * steg;
      h.y += (dy / l) * steg;
      if (Math.abs(dx / l) > 0.3) h.riktning = Math.sign(dx);
    }
  }

  if (lage !== "spelar") return;
  h.tappaTid -= dt;
  if (h.tappaTid <= 0) {
    const vantan = Math.max(INSTALLNINGAR.hundTapparMinst, INSTALLNINGAR.hundTappar - speltid * 0.03);
    h.tappaTid = vantan * (0.7 + Math.random() * 0.6);
    if (leksaker.length < INSTALLNINGAR.maxLeksaker && Math.hypot(h.x - matta.x, h.y - matta.y) > STOL + 0.4) {
      laggLeksak(h.x + h.riktning * 0.45, h.y + 0.1, h.bar);
      h.bar = slumpa(INSTALLNINGAR.leksaker);
      spelaTon(300, 200, 0.08, "sine", 0.06);
    }
  }
}

function uppdateraLeksaker() {
  const b = barn;
  for (const t of leksaker) {
    if (Math.hypot(t.x - b.x, t.y - b.y) > 0.55) continue;
    if (b.bar.length < INSTALLNINGAR.barMax) {
      // Plocka upp
      t.borta = true;
      b.bar.push(t.bild);
      spelaTon(500, 900, 0.1, "sine", 0.1);
    } else if (t.trampad <= 0) {
      // Händerna är fulla – aj, man klev på leksaken!
      t.trampad = 1.2;
      larm(B.trampa);
      texter.push({ x: b.x, y: b.y - 1.4, text: "Aj!", kvar: 1, stor: true, farg: "#ffb3b3" });
      const dx = t.x - b.x || 0.1;
      const dy = t.y - b.y;
      const d = Math.hypot(dx, dy);
      t.x = begr(t.x + (dx / d) * 0.6, 0.5, golv.b - 0.5);
      t.y = begr(t.y + (dy / d) * 0.6, 0.7, golv.h - 0.2);
      spelaTon(1400, 2200, 0.12, "square", 0.07);
    }
  }
  leksaker = leksaker.filter((t) => !t.borta);

  // Lägg leksakerna i lådan
  if (b.bar.length && Math.hypot(b.x - lada.x, b.y - lada.y) < 1.15) {
    const antal = b.bar.length;
    antalStadade += antal;
    b.bar = [];
    lada.pop = 1;
    ge("Städat!", P.stada * antal, lada.x, lada.y - 1.3, "#ffe14d");
    if (antal >= INSTALLNINGAR.barMax) ge("Städmästare!", P.stada, lada.x, lada.y - 1.9, "#ffe14d");
    spelaTon(700, 1000, 0.1, "triangle", 0.1);
    setTimeout(() => spelaTon(1000, 1500, 0.15, "triangle", 0.1), 100);
  }
}

// Har det gått ett "slag" sedan förra bilden? takt = slag per sekund
function slag(l, forra, takt) {
  return Math.floor(l.fas * takt) !== Math.floor(forra * takt);
}

function nyttStreck(l) {
  const forra = l.streck[l.streck.length - 1];
  const fortsatt = forra && Math.random() < 0.75;
  const x1 = fortsatt ? forra.x2 : (Math.random() - 0.5) * 0.66;
  const y1 = fortsatt ? forra.y2 : (Math.random() - 0.5) * 0.4;
  l.streck.push({
    x1,
    y1,
    x2: begr(x1 + (Math.random() - 0.5) * 0.3, -0.35, 0.35),
    y2: begr(y1 + (Math.random() - 0.5) * 0.25, -0.21, 0.21),
    farg: fortsatt ? forra.farg : slumpa(KRITFARGER),
  });
}

function uppdateraLek(dt) {
  // Man leker när man står still bredvid en sak
  let ny = null;
  if (!barn.ror && !barn.harMal) {
    for (const l of lekar) {
      if (Math.hypot(barn.x - l.standX, barn.y - l.standY) < 0.7 || Math.hypot(barn.x - l.x, barn.y - l.y) < 1.1) {
        ny = l;
        break;
      }
    }
  }
  if (ny !== aktivLek) {
    aktivLek = ny;
    if (ny) {
      ny.klocka = 0;
      if (Math.abs(ny.x - barn.x) > 0.1) barn.riktning = Math.sign(ny.x - barn.x);
    }
  }
  if (!aktivLek) return;

  const l = aktivLek;
  const forra = l.fas;
  l.fas += dt;
  l.klocka += dt;
  if (l.klocka >= 1) {
    l.klocka -= 1;
    texter.push({ x: l.x, y: l.y - 1, text: "+" + l.poang * (sover ? 2 : 1), kvar: 1 });
  }

  if (l.typ === "rita" && slag(l, forra, 4.5)) {
    nyttStreck(l);
    if (l.streck.length >= 26) {
      l.streck = [];
      ge("Teckning klar!", P.teckning, l.x, l.y - 1.6, "#ffe14d");
      spelaTon(800, 1200, 0.12, "triangle", 0.08);
      setTimeout(() => spelaTon(1200, 1600, 0.18, "triangle", 0.08), 120);
    }
  }

  if (l.typ === "boll" && slag(l, forra, 2.4)) {
    spelaTon(140, 70, 0.15, "sine", 0.25); // Bollen studsar i golvet
  }

  if (l.typ === "klossar" && slag(l, forra, 1.4)) {
    if (l.torn.length >= l.rasHojd) {
      // Tornet rasar!
      l.torn.forEach((farg, i) => {
        l.bitar.push({
          dx: (Math.random() - 0.5) * 0.1,
          dy: -(i + 0.5) * 0.3,
          vx: (Math.random() - 0.5) * 4,
          vy: -Math.random() * 3,
          v: 0,
          vv: (Math.random() - 0.5) * 12,
          farg,
          kvar: 1.4,
        });
      });
      l.torn = [];
      l.rasHojd = 5 + Math.floor(Math.random() * 4);
      larm(B.rasa);
      skakning = 0.15;
      texter.push({ x: l.x, y: l.y - 1.6, text: "KRASCH!", kvar: 1.2, stor: true, farg: "#ff8a7a" });
      spelaTon(400, 60, 0.4, "sawtooth", 0.12);
      setTimeout(() => spelaTon(900, 300, 0.2, "square", 0.06), 80);
    } else {
      l.torn.push(KLOSSFARGER[l.torn.length % KLOSSFARGER.length]);
      spelaTon(1100, 900, 0.05, "square", 0.04);
    }
  }

  if (l.typ === "trumma" && slag(l, forra, 5)) {
    if (Math.floor(l.fas * 5) % 2) spelaTon(180, 60, 0.18, "triangle", 0.25);
    else spelaTon(320, 140, 0.08, "square", 0.08);
    texter.push({
      x: l.x + (Math.random() - 0.5) * 0.8,
      y: l.y - 0.9,
      text: Math.random() < 0.5 ? "♪" : "♫",
      kvar: 0.9,
      farg: slumpa(["#ffe14d", "#ff9ecb", "#9fd8ff", "#b6f09c"]),
    });
  }
}

function uppdateraBitar(l, dt) {
  for (const b of l.bitar) {
    b.vy += 9 * dt;
    b.dx += b.vx * dt;
    b.dy += b.vy * dt;
    b.v += b.vv * dt;
    if (b.dy > 0.1) {
      b.dy = 0.1;
      b.vy *= -0.3;
      b.vx *= 0.6;
      b.vv *= 0.5;
    }
    b.kvar -= dt;
  }
  l.bitar = l.bitar.filter((b) => b.kvar > 0);
}

function uppdateraBuller(dt) {
  bullerIn = 0;
  if (barn.ror) bullerIn += B.springa;
  if (paMattan()) bullerIn += B.matta;
  if (aktivLek) bullerIn += aktivLek.ljud;
  if (sover) bullerIn *= 1.5; // När pappa sover vaknar han lätt
  buller = Math.max(0, buller + (bullerIn - lugnNu()) * dt);

  if (sover) {
    if (buller > 45) {
      sover = false;
      tystTid = 0;
      prata("Va? Jag sov inte!", 1.8);
      spelaTon(300, 600, 0.3, "sine", 0.08);
    }
  } else {
    tystTid = buller < 15 ? tystTid + dt : 0;
    if (tystTid >= INSTALLNINGAR.somnaEfter) {
      sover = true;
      texter.push({ x: matta.x, y: matta.y - 1.8, text: "Pappa somnade! Dubbla poäng", kvar: 2.5, stor: true, farg: "#cfe8ff" });
      spelaTon(600, 300, 0.6, "sine", 0.08);
    }
  }

  // Pappa börjar märka att det låter
  if (!sover && buller >= 70 && !varnad) {
    varnad = true;
    prata(slumpa(["Hmm?", "Vad är det som låter?", "Lite tystare...", "Hallå?"]), 1.4);
    spelaTon(200, 170, 0.35, "triangle", 0.15);
  }
  if (buller < 55) varnad = false;

  if (buller >= 100) bliStord();
}

function uppdatera(dt) {
  if (lage === "paus") return; // Allt står still under pausen
  tid += dt;
  for (const t of texter) {
    t.y -= 1.2 * dt;
    t.kvar -= dt;
  }
  texter = texter.filter((t) => t.kvar > 0);
  for (const l of lekar) uppdateraBitar(l, dt);
  for (const t of leksaker) {
    if (t.pop > 0) t.pop -= dt * 3;
    if (t.trampad > 0) t.trampad -= dt;
  }
  if (skakning > 0) skakning -= dt;
  if (pratTid > 0) pratTid -= dt;
  if (lada.pop > 0) lada.pop -= dt * 2;
  uppdateraHund(dt);
  if (lage === "slut") tidSedanSlut += dt;
  if (lage !== "spelar") return;

  // Medan pappa säger till står allt still
  if (stordTid > 0) {
    stordTid -= dt;
    if (stordTid <= 0) {
      buller = 0;
      if (livKvar <= 0) slutaSpel();
    }
    return;
  }

  speltid += dt;
  uppdateraBarn(dt);
  uppdateraLeksaker();
  uppdateraLek(dt);
  uppdateraBuller(dt);
  if (stordTid > 0) return;

  // Poäng för varje sekund pappa får vila, och mer för det man leker med
  poangRest += (P.vila + (aktivLek ? aktivLek.poang : 0)) * (sover ? 2 : 1) * dt;
  const hela = Math.floor(poangRest);
  poang += hela;
  poangRest -= hela;
}

// ---------- Rita ----------

function ritaText(text, x, y, storlek, farg = "#ffffff", just = "center") {
  ctx.font = `bold ${storlek}px ${TYPSNITT}`;
  ctx.textAlign = just;
  ctx.textBaseline = "middle";
  ctx.lineJoin = "round";
  ctx.lineWidth = storlek * 0.18;
  ctx.strokeStyle = "rgba(40, 20, 10, 0.65)";
  ctx.strokeText(text, x, y);
  ctx.fillStyle = farg;
  ctx.fillText(text, x, y);
}

// Att rita emojis som text är långsamt på iPad. Därför ritas varje emoji
// en gång på en egen liten bild (emojiMinne), som sedan återanvänds.

function emojiBild(bild, storlek) {
  const nyckel = bild + "|" + Math.round(storlek * pixelSkala);
  let liten = emojiMinne.get(nyckel);
  if (!liten) {
    const sida = Math.ceil(storlek * 1.5 * pixelSkala);
    liten = document.createElement("canvas");
    liten.width = sida;
    liten.height = sida;
    const c = liten.getContext("2d");
    c.font = `${storlek * pixelSkala}px ${TYPSNITT}`;
    c.textAlign = "center";
    c.textBaseline = "middle";
    c.fillText(bild, sida / 2, sida / 2);
    emojiMinne.set(nyckel, liten);
  }
  return liten;
}

function ritaEmoji(bild, x, y, storlek, just = "center", spegla = false) {
  const liten = emojiBild(bild, storlek);
  const sida = liten.width / pixelSkala;
  let vanster = x - sida / 2;
  if (just === "left") vanster = x - (sida - storlek) / 2;
  if (just === "right") vanster = x - storlek - (sida - storlek) / 2;
  if (spegla) {
    ctx.save();
    ctx.translate(x * 2, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(liten, vanster, y - sida / 2, sida, sida);
    ctx.restore();
  } else {
    ctx.drawImage(liten, vanster, y - sida / 2, sida, sida);
  }
}

function skugga(x, y, rx, ry) {
  ctx.fillStyle = "rgba(70, 35, 10, 0.22)";
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();
}

// Vardagsrummet ritas en gång på en egen bild (rum), som sedan bara
// klistras in varje gång. Det sparar mycket arbete så att det inte hackar.

function ritaRummet() {
  rum.width = canvas.width;
  rum.height = canvas.height;
  const c = rum.getContext("2d");
  c.setTransform(pixelSkala, 0, 0, pixelSkala, 0, 0);

  // Tapet
  c.fillStyle = "#efdcb6";
  c.fillRect(0, 0, bredd, golv.y);
  c.fillStyle = "#e8d2a4";
  for (let x = 0; x < bredd; x += u * 0.7) c.fillRect(x, 0, u * 0.3, golv.y);

  // Trägolv
  c.fillStyle = "#d4a067";
  c.fillRect(0, golv.y, bredd, hojd - golv.y);
  const plankH = u * 0.55;
  let rad = 0;
  for (let y = golv.y; y < hojd; y += plankH, rad++) {
    let x = -slumpTal(rad) * u * 3;
    let i = 0;
    while (x < bredd) {
      const langd = u * (2.5 + slumpTal(rad * 31 + i) * 2.5);
      c.fillStyle = slumpTal(rad * 17 + i * 5) > 0.5 ? "#d9a86f" : "#cf9b5f";
      c.fillRect(x, y, langd, plankH);
      c.fillStyle = "rgba(90, 50, 20, 0.2)";
      c.fillRect(x, y, 1.5, plankH);
      x += langd;
      i++;
    }
    c.fillStyle = "rgba(90, 50, 20, 0.2)";
    c.fillRect(0, y, bredd, 1.5);
  }

  // Golvlist och skugga under väggen
  c.fillStyle = "#fff6e6";
  c.fillRect(0, golv.y - u * 0.18, bredd, u * 0.18);
  c.fillStyle = "rgba(90, 50, 20, 0.15)";
  c.fillRect(0, golv.y, bredd, u * 0.12);

  // Hundens korg
  c.fillStyle = "#8e6bb5";
  c.beginPath();
  c.ellipse(X(korg.x), Y(korg.y), u * 0.75, u * 0.5, 0, 0, Math.PI * 2);
  c.fill();
  c.fillStyle = "#c2a8e0";
  c.beginPath();
  c.ellipse(X(korg.x), Y(korg.y), u * 0.55, u * 0.33, 0, 0, Math.PI * 2);
  c.fill();

  // Pappas matta
  const mx = X(matta.x);
  const my = Y(matta.y);
  c.fillStyle = "#7fa7d6";
  c.beginPath();
  c.arc(mx, my, matta.r * u, 0, Math.PI * 2);
  c.fill();
  c.lineWidth = u * 0.12;
  c.strokeStyle = "#5f86b8";
  c.stroke();
  c.lineWidth = u * 0.05;
  c.strokeStyle = "#b9d3f0";
  c.setLineDash([u * 0.15, u * 0.12]);
  c.beginPath();
  c.arc(mx, my, matta.r * u * 0.78, 0, Math.PI * 2);
  c.stroke();
  c.setLineDash([]);

  // Mattor och möbler vid lekplatserna
  for (const l of lekar) {
    const x = X(l.x);
    const y = Y(l.y);
    if (l.typ === "bok") {
      // Sittsäck
      c.fillStyle = "#d9584a";
      c.beginPath();
      c.ellipse(x, y - u * 0.05, u * 0.55, u * 0.42, 0, 0, Math.PI * 2);
      c.fill();
      c.fillStyle = "#ef7e6f";
      c.beginPath();
      c.ellipse(x - u * 0.1, y - u * 0.15, u * 0.3, u * 0.2, 0, 0, Math.PI * 2);
      c.fill();
      continue;
    }
    const farg = { rita: "#cfe6f5", boll: "#bfe3a5", klossar: "#f7d36b", trumma: "#eab0cf" }[l.typ] || "#e6ddd0";
    c.fillStyle = farg;
    c.beginPath();
    c.ellipse(x, y + u * 0.05, u * 0.8, u * 0.5, 0, 0, Math.PI * 2);
    c.fill();
  }

  // Leksakslådan
  const lx = X(lada.x);
  const ly = Y(lada.y);
  c.fillStyle = "rgba(70, 35, 10, 0.22)";
  c.beginPath();
  c.ellipse(lx, ly + u * 0.05, u * 0.8, u * 0.2, 0, 0, Math.PI * 2);
  c.fill();
  c.fillStyle = "#5b3a1e";
  rundRekt(c, lx - u * 0.68, ly - u * 0.85, u * 1.36, u * 0.4, u * 0.08);
  c.fill();
  c.font = `${u * 0.45}px ${TYPSNITT}`;
  c.textAlign = "center";
  c.textBaseline = "middle";
  c.fillText("🧸", lx - u * 0.3, ly - u * 0.78);
  c.fillText("🚂", lx + u * 0.25, ly - u * 0.72);
  c.fillStyle = "#b0763f";
  rundRekt(c, lx - u * 0.7, ly - u * 0.55, u * 1.4, u * 0.6, u * 0.08);
  c.fill();
  c.fillStyle = "rgba(90, 50, 20, 0.35)";
  c.fillRect(lx - u * 0.7, ly - u * 0.27, u * 1.4, 2);
  c.fillStyle = "#fff6e6";
  c.font = `bold ${u * 0.22}px ${TYPSNITT}`;
  c.fillText("LEKSAKER", lx, ly - u * 0.38);
}

function ljudIkon(ljud) {
  if (ljud <= 0) return "🤫";
  if (ljud < 10) return "🔈";
  if (ljud < 25) return "🔉";
  return "🔊";
}

// Liten skylt under en sak: hur mycket det låter och hur mycket poäng det ger
function ritaSkylt(ikon, text, x, y) {
  const s = u * 0.3;
  ritaEmoji(ikon, x - s * 0.9, y, s);
  ritaText(text, x - s * 0.2, y, s, "#ffffff", "left");
}

function ritaLek(l) {
  const x = X(l.x);
  const y = Y(l.y);
  const s = u;
  const aktiv = aktivLek === l;

  if (l.typ === "bok") {
    if (!aktiv) ritaEmoji(l.bild, x, y - s * 0.25, s * 0.55);
  } else if (l.typ === "rita") {
    // Papper med teckningen
    ctx.save();
    ctx.translate(x, y - s * 0.05);
    ctx.rotate(-0.08);
    ctx.fillStyle = "rgba(70, 35, 10, 0.2)";
    ctx.fillRect(-s * 0.4, -s * 0.24, s * 0.84, s * 0.54);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(-s * 0.42, -s * 0.27, s * 0.84, s * 0.54);
    ctx.lineCap = "round";
    ctx.lineWidth = Math.max(2, s * 0.04);
    for (const st of l.streck) {
      ctx.strokeStyle = st.farg;
      ctx.beginPath();
      ctx.moveTo(st.x1 * s, st.y1 * s);
      ctx.lineTo(st.x2 * s, st.y2 * s);
      ctx.stroke();
    }
    ctx.restore();
    ritaEmoji(l.bild, x + s * 0.5, y + s * 0.25, s * 0.4);
  } else if (l.typ === "boll") {
    if (!aktiv) {
      skugga(x, y + s * 0.05, s * 0.25, s * 0.08);
      ritaEmoji(l.bild, x, y - s * 0.2, s * 0.5);
    }
  } else if (l.typ === "klossar") {
    const k = s * 0.3;
    const lista = l.torn.length ? l.torn : [];
    if (!lista.length && !l.bitar.length) {
      // En liten hög med klossar
      const hog = [[-0.32, 0, 0], [0.02, 0, 1], [-0.15, -1, 2]];
      for (const [hx, hy, i] of hog) {
        ctx.fillStyle = KLOSSFARGER[i];
        ctx.fillRect(x + hx * s, y + (hy - 1) * k + s * 0.05, k, k);
        ctx.strokeStyle = "rgba(0, 0, 0, 0.3)";
        ctx.lineWidth = 1.5;
        ctx.strokeRect(x + hx * s, y + (hy - 1) * k + s * 0.05, k, k);
      }
    }
    lista.forEach((farg, i) => {
      const vingla = Math.sin(tid * 3 + i) * i * s * 0.006;
      ctx.fillStyle = farg;
      ctx.fillRect(x - k / 2 + vingla, y - (i + 1) * k + s * 0.05, k, k);
      ctx.strokeStyle = "rgba(0, 0, 0, 0.3)";
      ctx.lineWidth = 1.5;
      ctx.strokeRect(x - k / 2 + vingla, y - (i + 1) * k + s * 0.05, k, k);
    });
    for (const b of l.bitar) {
      ctx.save();
      ctx.globalAlpha = Math.min(1, b.kvar * 2);
      ctx.translate(X(l.x + b.dx), Y(l.y + b.dy) - k / 2);
      ctx.rotate(b.v);
      ctx.fillStyle = b.farg;
      ctx.fillRect(-k / 2, -k / 2, k, k);
      ctx.restore();
    }
  } else if (l.typ === "trumma") {
    const skak = aktiv ? Math.sin(tid * 40) * s * 0.04 : 0;
    ritaEmoji(l.bild, x + skak, y - s * 0.3, s * 0.75);
  } else {
    // Egna saker man lagt till i INSTALLNINGAR vickar när man leker med dem
    const vick = aktiv ? Math.sin(tid * 10) * s * 0.06 : 0;
    ritaEmoji(l.bild, x + vick, y - s * 0.3, s * 0.65);
  }

  if (lage === "spelar" && !aktiv) ritaSkylt(ljudIkon(l.ljud), "+" + l.poang, x, y + s * 0.62);
}

function ritaLeksak(t) {
  const x = X(t.x);
  const y = Y(t.y);
  const gung = Math.sin(tid * 3 + t.x * 2) * u * 0.03;
  skugga(x, y, u * 0.25, u * 0.08);
  ctx.save();
  ctx.translate(x, y - u * 0.22 + gung);
  const storre = 1 + Math.max(0, t.pop) * 0.6;
  ctx.scale(storre, storre);
  ritaEmoji(t.bild, 0, 0, u * 0.5);
  ctx.restore();
}

function ritaHund() {
  const h = hund;
  const x = X(h.x);
  const y = Y(h.y);
  const gar = h.vila <= 0;
  const studs = gar ? Math.abs(Math.sin(h.fas * 10)) * u * 0.06 : 0;
  skugga(x, y, u * 0.38, u * 0.1);
  // Emojin tittar åt vänster, så den speglas när hunden går åt höger
  ritaEmoji(INSTALLNINGAR.hund, x, y - u * 0.35 - studs, u * 0.8, "center", h.riktning > 0);
  if (lage === "spelar" && h.tappaTid < 2) {
    // Hunden bär nästa leksak i munnen
    ritaEmoji(h.bar, x + h.riktning * u * 0.4, y - u * 0.3 - studs, u * 0.35);
  }
}

function ritaBarnet() {
  const b = barn;
  const x = X(b.x);
  const y = Y(b.y);
  const s = u;
  const lek = aktivLek;
  const sitter = lek && (lek.typ === "bok" || lek.typ === "rita" || lek.typ === "klossar");
  const studs = b.ror ? Math.abs(Math.sin(b.gangFas)) * 0.06 : 0;
  const kant = "#4a2a14";
  const hud = "#f6cfa5";
  const lw = Math.max(1.5 / s, 0.035);
  const r = b.riktning;

  skugga(x, y, s * 0.32, s * 0.1);

  ctx.save();
  ctx.translate(x, y - studs * s);
  ctx.scale(s, s);
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  const fylld = (farg) => {
    ctx.fillStyle = farg;
    ctx.fill();
    ctx.strokeStyle = kant;
    ctx.lineWidth = lw;
    ctx.stroke();
  };

  if (sitter) {
    // Sitter på golvet med benen framför sig
    for (const i of [-1, 1]) {
      ctx.beginPath();
      ctx.ellipse(i * 0.12, -0.06, 0.11, 0.07, 0, 0, Math.PI * 2);
      fylld("#3b5998");
    }
    ctx.translate(0, 0.17);
  } else {
    // Ben som springer
    for (const i of [-1, 1]) {
      const lyft = b.ror ? Math.max(0, Math.sin(b.gangFas + (i > 0 ? Math.PI : 0))) * 0.1 : 0;
      rundRekt(ctx, i * 0.1 - 0.06, -0.32 - lyft, 0.12, 0.3, 0.05);
      fylld("#3b5998");
      ctx.beginPath();
      ctx.ellipse(i * 0.1, -0.03 - lyft, 0.08, 0.05, 0, 0, Math.PI * 2);
      fylld("#333333");
    }
  }

  // Armar
  for (const i of [-1, 1]) {
    let hx = i * 0.27;
    let hy = -0.32 + (b.ror ? Math.sin(b.gangFas + (i > 0 ? 0 : Math.PI)) * 0.06 : 0);
    if (b.bar.length) {
      hx = i * 0.17; // Armarna uppe och håller leksakerna
      hy = -1.08;
    } else if (lek && lek.typ === "trumma") {
      hx = i * 0.25;
      hy = -0.42 + Math.sin(tid * 30 + i * 1.5) * 0.1;
    } else if (lek && lek.typ === "bok") {
      hx = i * 0.14;
      hy = -0.42;
    } else if (lek && lek.typ === "boll" && i === r) {
      hy = -0.3 + Math.abs(Math.sin(lek.fas * 2.4 * Math.PI)) * -0.08;
    }
    ctx.beginPath();
    ctx.moveTo(i * 0.15, -0.56);
    ctx.lineTo(hx, hy);
    ctx.strokeStyle = kant;
    ctx.lineWidth = 0.11;
    ctx.stroke();
    ctx.strokeStyle = INSTALLNINGAR.barnFarg;
    ctx.lineWidth = 0.11 - lw * 2;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(hx, hy, 0.05, 0, Math.PI * 2);
    fylld(hud);
  }

  // Kropp
  rundRekt(ctx, -0.2, -0.64, 0.4, 0.38, 0.1);
  fylld(INSTALLNINGAR.barnFarg);

  // Huvud
  const hy = -0.86;
  ctx.beginPath();
  ctx.arc(0, hy, 0.24, 0, Math.PI * 2);
  fylld(hud);
  // Hår och en liten tofs i nacken
  ctx.beginPath();
  ctx.arc(-r * 0.24, hy - 0.06, 0.08, 0, Math.PI * 2);
  fylld(INSTALLNINGAR.harFarg);
  ctx.beginPath();
  ctx.arc(0, hy, 0.25, Math.PI, 0);
  ctx.quadraticCurveTo(r * 0.05, hy - 0.08, -0.25, hy);
  ctx.closePath();
  fylld(INSTALLNINGAR.harFarg);
  // Kinder
  ctx.fillStyle = "rgba(255, 120, 120, 0.35)";
  for (const i of [-1, 1]) {
    ctx.beginPath();
    ctx.arc(i * 0.14 + r * 0.03, hy + 0.08, 0.045, 0, Math.PI * 2);
    ctx.fill();
  }
  // Ögon (tittar ner i boken när man läser)
  const ner = lek && (lek.typ === "bok" || lek.typ === "rita") ? 0.04 : 0;
  ctx.fillStyle = "#222222";
  for (const i of [-1, 1]) {
    ctx.beginPath();
    ctx.arc(i * 0.08 + r * 0.04, hy + 0.01 + ner, 0.03, 0, Math.PI * 2);
    ctx.fill();
  }
  // Mun
  ctx.beginPath();
  if (stordTid > 0) ctx.arc(r * 0.04, hy + 0.15, 0.05, 1.15 * Math.PI, 1.85 * Math.PI);
  else ctx.arc(r * 0.04, hy + 0.08, 0.07, 0.2 * Math.PI, 0.8 * Math.PI);
  ctx.strokeStyle = kant;
  ctx.lineWidth = lw;
  ctx.stroke();
  ctx.restore();

  const sittY = sitter ? s * 0.17 : 0;
  if (lek && lek.typ === "bok") ritaEmoji("📖", x, y - s * 0.42 + sittY, s * 0.42);
  if (lek && lek.typ === "boll") {
    // Barnet studsar bollen
    const h = Math.abs(Math.sin(lek.fas * 2.4 * Math.PI)) * 0.6;
    const bx = x + r * s * 0.4;
    skugga(bx, y + s * 0.05, s * (0.2 - h * 0.1), s * 0.06);
    ritaEmoji(lek.bild, bx, y - (0.15 + h) * s, s * 0.4);
  }
  // Leksakerna man bär
  b.bar.forEach((bild, i) => ritaEmoji(bild, x, y - (1.3 + i * 0.32) * s - studs * s, s * 0.42));

  // Ljudvågor när det låter mer än pappa hinner lugna sig
  const styrka = Math.min(1, (bullerIn - lugnNu()) / 25);
  if (lage === "spelar" && stordTid <= 0 && styrka > 0) {
    ctx.strokeStyle = `rgba(255, 255, 255, ${0.35 + 0.55 * styrka})`;
    ctx.lineWidth = Math.max(2, s * 0.05);
    ctx.lineCap = "round";
    const vy = y - s * 0.8 + sittY;
    for (let i = 0; i < 2; i++) {
      const rr = (0.38 + i * 0.16 + ((tid * 0.5) % 0.16)) * s;
      for (const sida of [0, Math.PI]) {
        ctx.beginPath();
        ctx.arc(x, vy, rr, sida - 0.5, sida + 0.5);
        ctx.stroke();
      }
    }
  }
}

function ritaPappan() {
  const s = u;
  const arg = stordTid > 0 || lage === "slut";
  const tittar = !sover && (arg || buller >= 70);
  const undrar = !sover && !tittar && buller >= 35;
  const kant = "#4a2618";
  const hud = "#f0c39a";
  const har = "#6b4a2b";
  const lw = Math.max(1.5 / s, 0.035);
  const cx = X(matta.x);
  const cy = Y(matta.y);

  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(s, s);
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  const fylld = (farg) => {
    ctx.fillStyle = farg;
    ctx.fill();
    ctx.strokeStyle = kant;
    ctx.lineWidth = lw;
    ctx.stroke();
  };
  const tjockLinje = (farg, tjocklek) => {
    ctx.strokeStyle = kant;
    ctx.lineWidth = tjocklek;
    ctx.stroke();
    ctx.strokeStyle = farg;
    ctx.lineWidth = tjocklek - lw * 2;
    ctx.stroke();
  };

  // Skugga
  ctx.fillStyle = "rgba(30, 40, 80, 0.2)";
  ctx.beginPath();
  ctx.ellipse(0, 0.5, 1.25, 0.6, 0, 0, Math.PI * 2);
  ctx.fill();

  // Fotpall, ryggstöd och sits
  rundRekt(ctx, -0.48, 0.78, 0.96, 0.5, 0.14);
  fylld("#a54835");
  rundRekt(ctx, -0.95, -1.3, 1.9, 0.8, 0.32);
  fylld("#b5523b");
  rundRekt(ctx, -0.72, -0.62, 1.44, 1.15, 0.22);
  fylld("#c9654c");

  // Ben och tofflor
  for (const bx of [-0.3, 0.05]) {
    rundRekt(ctx, bx, 0.05, 0.25, 0.85, 0.1);
    fylld("#3d4a5c");
  }
  for (const fx of [-0.175, 0.175]) {
    ctx.beginPath();
    ctx.ellipse(fx, 0.95, 0.15, 0.11, 0, 0, Math.PI * 2);
    fylld("#7a5640");
  }

  // Kropp och armstöd
  rundRekt(ctx, -0.5, -0.78, 1.0, 1.0, 0.32);
  fylld(INSTALLNINGAR.pappaFarg);
  rundRekt(ctx, -1.1, -0.8, 0.42, 1.4, 0.18);
  fylld("#a54835");
  rundRekt(ctx, 0.68, -0.8, 0.42, 1.4, 0.18);
  fylld("#a54835");

  // Telefonen: framför ansiktet, sänkt när han tittar upp, på magen när han sover
  let telX = 0;
  let telY = -0.32;
  let telV = 0;
  if (sover) {
    telX = 0.12;
    telY = -0.05;
    telV = 0.5;
  } else if (tittar) {
    telY = -0.12;
  }

  // Armar
  for (const sida of [-1, 1]) {
    ctx.beginPath();
    ctx.moveTo(sida * 0.4, -0.62);
    ctx.lineTo(sida * 0.55, -0.15);
    ctx.lineTo(telX + sida * 0.17, telY + 0.1);
    tjockLinje(INSTALLNINGAR.pappaFarg, 0.2);
  }

  ctx.save();
  ctx.translate(telX, telY);
  ctx.rotate(telV);
  rundRekt(ctx, -0.15, -0.22, 0.3, 0.44, 0.05);
  fylld("#1f2430");
  ctx.fillStyle = sover ? "#2c4c66" : "#9fd8ff";
  ctx.fillRect(-0.12, -0.18, 0.24, 0.36);
  if (!sover) {
    // Det pappa scrollar förbi
    const skroll = (tid * 0.3) % 0.36;
    for (let i = 0; i < 3; i++) {
      const ly = -0.18 + ((i * 0.12 - skroll + 0.36) % 0.36);
      if (ly > 0.14) continue;
      ctx.fillStyle = i % 2 ? "#ffffff" : "#ffd27a";
      ctx.fillRect(-0.09, ly + 0.01, 0.18, 0.04);
    }
  }
  for (const sida of [-1, 1]) {
    ctx.beginPath();
    ctx.arc(sida * 0.16, 0.1, 0.075, 0, Math.PI * 2);
    fylld(hud);
  }
  ctx.restore();

  // Huvud
  const hy = -1.0;
  ctx.beginPath();
  ctx.arc(0, hy, 0.36, 0, Math.PI * 2);
  fylld(hud);
  if (arg) {
    ctx.fillStyle = "rgba(255, 70, 50, 0.25)"; // Röd i ansiktet
    ctx.fill();
  } else if (!sover) {
    ctx.fillStyle = "rgba(150, 215, 255, 0.18)"; // Skenet från telefonen
    ctx.fill();
  }

  // Hår och skägg
  ctx.beginPath();
  ctx.arc(0, hy, 0.37, Math.PI, 0);
  ctx.lineTo(0.3, hy - 0.12);
  ctx.quadraticCurveTo(0, hy - 0.26, -0.3, hy - 0.12);
  ctx.closePath();
  fylld(har);
  ctx.beginPath();
  ctx.arc(0, hy + 0.02, 0.35, 0.12 * Math.PI, 0.88 * Math.PI);
  ctx.quadraticCurveTo(0, hy + 0.1, 0.35 * Math.cos(0.12 * Math.PI), hy + 0.02 + 0.35 * Math.sin(0.12 * Math.PI));
  ctx.closePath();
  ctx.fillStyle = har;
  ctx.fill();

  // Ögon och ögonbryn
  const ey = hy - 0.03;
  let tittX = 0;
  let tittY = 0;
  if (tittar) {
    const dx = barn.x - matta.x;
    const dy = barn.y - matta.y;
    const d = Math.hypot(dx, dy) || 1;
    tittX = (dx / d) * 0.035;
    tittY = (dy / d) * 0.035;
  }
  for (const sida of [-1, 1]) {
    const ex = sida * 0.13;
    if (sover) {
      ctx.beginPath();
      ctx.arc(ex, ey, 0.06, 0.15 * Math.PI, 0.85 * Math.PI);
      ctx.strokeStyle = kant;
      ctx.lineWidth = lw * 1.3;
      ctx.stroke();
    } else if (tittar) {
      ctx.beginPath();
      ctx.arc(ex, ey, 0.075, 0, Math.PI * 2);
      fylld("#ffffff");
      ctx.fillStyle = "#1a1a1a";
      ctx.beginPath();
      ctx.arc(ex + tittX, ey + tittY, 0.035, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Tittar ner i telefonen
      ctx.fillStyle = "#1a1a1a";
      ctx.beginPath();
      ctx.ellipse(ex, ey + 0.03, 0.045, 0.035, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.beginPath();
    if (arg) {
      ctx.moveTo(ex + sida * 0.09, ey - 0.14);
      ctx.lineTo(ex - sida * 0.08, ey - 0.08);
    } else if (undrar && sida > 0) {
      ctx.moveTo(ex - 0.08, ey - 0.16);
      ctx.quadraticCurveTo(ex, ey - 0.2, ex + 0.08, ey - 0.15);
    } else {
      ctx.moveTo(ex - 0.08, ey - 0.11);
      ctx.lineTo(ex + 0.08, ey - 0.11);
    }
    ctx.strokeStyle = har;
    ctx.lineWidth = 0.045;
    ctx.stroke();
  }

  // Näsa
  ctx.fillStyle = "#e3a37f";
  ctx.beginPath();
  ctx.ellipse(0, hy + 0.06, 0.05, 0.045, 0, 0, Math.PI * 2);
  ctx.fill();

  // Mun
  ctx.strokeStyle = "#3a1a10";
  ctx.lineWidth = lw * 1.2;
  ctx.fillStyle = "#5a2a1a";
  ctx.beginPath();
  if (sover) {
    ctx.ellipse(0, hy + 0.19, 0.04, 0.045, 0, 0, Math.PI * 2);
    ctx.fill();
  } else if (arg) {
    ctx.ellipse(0, hy + 0.2, 0.1, 0.065, 0, 0, Math.PI * 2);
    ctx.fill();
  } else if (tittar) {
    ctx.moveTo(-0.08, hy + 0.19);
    ctx.lineTo(0.08, hy + 0.19);
    ctx.stroke();
  } else {
    ctx.arc(0, hy + 0.12, 0.08, 0.2 * Math.PI, 0.8 * Math.PI);
    ctx.stroke();
  }
  ctx.restore();

  // Zzz när pappa sover, ! när han märker något, 💢 när han blir störd
  if (sover) {
    for (let i = 0; i < 3; i++) {
      const fas = (tid * 0.5 + i / 3) % 1;
      ctx.globalAlpha = 1 - fas;
      ritaText("z", cx + (0.35 + fas * 0.5) * s, cy - (1.3 + fas * 0.8) * s, (0.25 + fas * 0.2) * s, "#ffffff");
    }
    ctx.globalAlpha = 1;
  } else if (arg) {
    ritaEmoji("💢", cx + s * 0.4, cy - s * 1.35, s * 0.45);
  } else if (tittar && Math.floor(tid * 4) % 2 === 0) {
    ritaText("!", cx + s * 0.45, cy - s * 1.45, s * 0.55, "#ffdd33");
  }
}

function ritaPratbubbla(text, x, y) {
  const storlek = Math.max(16, u * 0.36);
  ctx.font = `bold ${storlek}px ${TYPSNITT}`;
  const w = ctx.measureText(text).width + storlek * 1.2;
  const h = storlek * 1.8;
  const vanster = begr(x - w / 2, 8, bredd - w - 8);
  const topp = Math.max(marginal.topp + 8, y - h - storlek * 0.5);
  ctx.fillStyle = "#ffffff";
  ctx.strokeStyle = "#2b1d0e";
  ctx.lineWidth = 3;
  rundRekt(ctx, vanster, topp, w, h, storlek * 0.6);
  ctx.fill();
  ctx.stroke();
  // Pilen ner mot pappa
  const px = begr(x, vanster + storlek, vanster + w - storlek);
  ctx.beginPath();
  ctx.moveTo(px - storlek * 0.4, topp + h - 1.5);
  ctx.lineTo(px, topp + h + storlek * 0.5);
  ctx.lineTo(px + storlek * 0.4, topp + h - 1.5);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#2b1d0e";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, vanster + w / 2, topp + h / 2);
}

function ritaTexter() {
  for (const t of texter) {
    const storlek = u * (t.stor ? 0.42 : 0.32);
    ctx.font = `bold ${storlek}px ${TYPSNITT}`;
    const halv = ctx.measureText(t.text).width / 2 + 8;
    ctx.globalAlpha = begr(t.kvar * 1.5, 0, 1);
    ritaText(t.text, begr(X(t.x), halv, bredd - halv), Y(t.y), storlek, t.farg || "#ffffff");
  }
  ctx.globalAlpha = 1;
}

function ritaPanel() {
  const storlek = begr(u * 0.5, 20, 34);
  const rad1 = marginal.topp + 40; // I höjd med hus- och pausknappen
  const vanster = marginal.vanster + 150; // Till höger om knapparna
  const hoger = bredd - marginal.hoger - 16;

  ritaEmoji("⭐", vanster, rad1, storlek, "left");
  ritaText(String(poang), vanster + storlek * 1.3, rad1, storlek, "#ffffff", "left");
  if (sover) {
    const textBredd = ctx.measureText(String(poang)).width;
    ritaText("x2", vanster + storlek * 1.6 + textBredd, rad1, storlek * 0.8, "#ffe14d", "left");
  }
  for (let i = 0; i < INSTALLNINGAR.liv; i++) {
    ritaEmoji(i < livKvar ? "❤️" : "💔", hoger - i * storlek * 1.2, rad1, storlek * 0.85, "right");
  }

  // Ljudmätaren: blir den full blir pappa störd
  const rad2 = marginal.topp + 86;
  const ikon = storlek * 0.9;
  const w = Math.min(bredd - marginal.vanster - marginal.hoger - 32 - ikon * 3, 520);
  const x0 = bredd / 2 - w / 2;
  const mh = Math.max(12, storlek * 0.45);
  ctx.fillStyle = "rgba(90, 55, 25, 0.3)";
  rundRekt(ctx, x0, rad2 - mh / 2, w, mh, mh / 2);
  ctx.fill();
  const andel = begr(buller / 100, 0, 1);
  if (andel > 0.01) {
    let farg = "#5cc46a";
    if (andel > 0.5) farg = "#ffc93c";
    if (andel > 0.75) farg = "#ff5a4f";
    if (andel > 0.85 && Math.floor(tid * 6) % 2 === 0) farg = "#ff9a8f";
    ctx.fillStyle = farg;
    rundRekt(ctx, x0, rad2 - mh / 2, Math.max(mh, w * andel), mh, mh / 2);
    ctx.fill();
  }
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 2.5;
  rundRekt(ctx, x0, rad2 - mh / 2, w, mh, mh / 2);
  ctx.stroke();
  ritaEmoji(ljudIkon(bullerIn), x0 - ikon * 0.75, rad2, ikon);
  let ansikte = "😌";
  if (sover) ansikte = "😴";
  else if (stordTid > 0) ansikte = "😠";
  else if (buller >= 70) ansikte = "😒";
  else if (buller >= 35) ansikte = "🤨";
  ritaEmoji(ansikte, x0 + w + ikon * 0.75, rad2, ikon);
}

function ritaSkarmar() {
  if (lage === "spelar" || lage === "paus") return;
  const t = Math.min(bredd, hojd) / 14; // Textstorlek
  const mitt = bredd / 2;

  ctx.fillStyle = "rgba(25, 15, 40, 0.55)";
  ctx.fillRect(0, 0, bredd, hojd);
  let y = marginal.topp + Math.max(t * 1.6, hojd * 0.12);
  const rad = (text, storlek, farg) => {
    // Krymper texten om den inte får plats på skärmen
    ctx.font = `bold ${storlek}px ${TYPSNITT}`;
    const ryms = (bredd - 32) / ctx.measureText(text).width;
    const s = ryms < 1 ? storlek * ryms : storlek;
    ritaText(text, mitt, y, s, farg);
    y += storlek * 1.45;
  };

  if (lage === "start") {
    rad("Låt pappa vila", t * 1.4, "#ffd27a");
    y += t * 0.3;
    rad("Dra med fingret för att springa", t * 0.7);
    rad("Ställ dig vid en sak för att leka", t * 0.7);
    rad("Lägg leksakerna i lådan = mer poäng", t * 0.7);
    rad("Var tyst och gå inte på pappas matta!", t * 0.7, "#ffb3b3");
    y += t * 0.4;
    rad("Tryck för att börja", t * 0.85, "#ffffff");
    if (rekord > 0) rad("Rekord: " + rekord, t * 0.6, "#d5def0");
  }

  if (lage === "slut") {
    const min = Math.floor(speltid / 60);
    const sek = String(Math.floor(speltid % 60)).padStart(2, "0");
    rad("Pappa orkar inte mer!", t * 1.2, "#ffd27a");
    rad(poang + " poäng", t * 1.0);
    rad(poang > 0 && poang === rekord ? "🏆 Nytt rekord! 🏆" : "Rekord: " + rekord, t * 0.7);
    rad(`Pappa vilade ${min}:${sek} · ${antalStadade} leksaker städade`, t * 0.6, "#d5def0");
    y += t * 0.4;
    if (tidSedanSlut > 1) rad("Tryck för att spela igen", t * 0.8);
  }
}

function rita() {
  // Pausknappen syns bara när man spelar. Under pausen finns allt i pausmenyn.
  const visaPaus = lage === "spelar";
  if (pausKnapp.hidden === visaPaus) pausKnapp.hidden = !visaPaus;
  const visaHem = lage !== "paus";
  if (hemKnapp.hidden === visaHem) hemKnapp.hidden = !visaHem;

  ctx.save();
  if (skakning > 0) ctx.translate((Math.random() - 0.5) * u * 0.2, (Math.random() - 0.5) * u * 0.2);
  ctx.drawImage(rum, 0, 0, bredd, hojd);

  // Mattans kant blinkar rött när barnet står på den
  if (lage === "spelar" && paMattan()) {
    ctx.strokeStyle = `rgba(255, 80, 80, ${0.55 + Math.sin(tid * 12) * 0.3})`;
    ctx.lineWidth = u * 0.14;
    ctx.beginPath();
    ctx.arc(X(matta.x), Y(matta.y), matta.r * u, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Det som står längre ner i rummet ritas sist, så att det hamnar framför
  const lista = [];
  for (const l of lekar) lista.push([l.y, () => ritaLek(l)]);
  for (const t of leksaker) lista.push([t.y, () => ritaLeksak(t)]);
  lista.push([hund.y, ritaHund]);
  lista.push([barn.y + 0.01, ritaBarnet]);
  lista.push([matta.y + 0.5, ritaPappan]);
  lista.sort((a, b) => a[0] - b[0]);
  for (const [, ritaDen] of lista) ritaDen();

  if (lage === "spelar" && !aktivLek) ritaSkylt("🧸", "+" + P.stada, X(lada.x), Y(lada.y) + u * 0.4);
  if (lada.pop > 0) ritaEmoji("✨", X(lada.x), Y(lada.y) - u * (1 + (1 - lada.pop) * 0.4), u * 0.6);
  ritaTexter();
  if (pratTid > 0) ritaPratbubbla(pappaSager, X(matta.x), Y(matta.y) - u * 1.45);
  ctx.restore();

  if (lage === "spelar" || lage === "paus") ritaPanel();
  ritaSkarmar();
}

// ---------- Spel-loopen: körs ungefär 60 gånger per sekund ----------

anpassaStorlek();
aterstall();

let forraTiden = performance.now();
function loop(nu) {
  const dt = Math.min(0.05, (nu - forraTiden) / 1000);
  forraTiden = nu;
  kollaFart(dt);
  uppdatera(dt);
  rita();
  schemalaggMusik();
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

function spelaTon(fran, till, langd, typ, volym) {
  if (!ljudmotor) return;
  try {
    const t = ljudmotor.currentTime;
    const ton = ljudmotor.createOscillator();
    const styrka = ljudmotor.createGain();
    ton.type = typ;
    ton.frequency.setValueAtTime(fran, t);
    ton.frequency.exponentialRampToValueAtTime(till, t + langd);
    styrka.gain.setValueAtTime(volym, t);
    styrka.gain.exponentialRampToValueAtTime(0.001, t + langd);
    ton.connect(styrka);
    styrka.connect(ljudmotor.destination);
    ton.start(t);
    ton.stop(t + langd);
  } catch (e) {
    // Inget ljud – spelet fungerar ändå
  }
}

// ---------- Vaggvisan (bakgrundsmusik) ----------
//
//  Varje siffra är en ton (60 = mellersta C, 62 = D, 64 = E ...).
//  null betyder paus. Ändra siffrorna för att göra en egen melodi!

const MUSIK = {
  vaken: {
    steg: 0.3, // Sekunder per ton – lägre = snabbare
    melodi: [67, null, 72, null, 72, 74, 76, null, 74, null, 72, null, 69, null, 67, null,
             67, null, 72, null, 72, 74, 76, null, 79, null, 77, 76, 74, null, null, null],
    bas: [48, 55, 48, 55, 53, 57, 53, 57, 48, 55, 48, 55, 50, 55, 43, 47],
  },
  sover: {
    steg: 0.42,
    melodi: [84, null, 79, null, 81, null, 79, null, 76, null, 77, null, 79, null, null, null,
             84, null, 79, null, 81, null, 83, null, 84, null, 79, null, 76, null, null, null],
    bas: [48, null, 53, null, 48, null, 55, null, 48, null, 53, null, 55, null, 48, null],
  },
};

let musikPa = INSTALLNINGAR.musik && lasInstallning("musik-pappa") !== "av";
let musikSteg = 0;
let musikNastaTid = 0;
visaMusikKnapp();

function spelaNot(not, start, langd, typ, volym) {
  const ton = ljudmotor.createOscillator();
  const styrka = ljudmotor.createGain();
  ton.type = typ;
  ton.frequency.value = 440 * Math.pow(2, (not - 69) / 12);
  styrka.gain.setValueAtTime(0, start);
  styrka.gain.linearRampToValueAtTime(volym, start + 0.02);
  styrka.gain.exponentialRampToValueAtTime(0.001, start + langd);
  ton.connect(styrka);
  styrka.connect(ljudmotor.destination);
  ton.start(start);
  ton.stop(start + langd + 0.02);
}

// Lägger ut tonerna en liten bit i förväg så att musiken inte hackar
function schemalaggMusik() {
  if (!ljudmotor || !musikPa || lage !== "spelar") return;
  const latt = sover ? MUSIK.sover : MUSIK.vaken;
  const nu = ljudmotor.currentTime;
  if (musikNastaTid < nu) musikNastaTid = nu + 0.05;
  try {
    while (musikNastaTid < nu + 0.25) {
      const i = musikSteg % latt.melodi.length;
      const not = latt.melodi[i];
      if (not) spelaNot(not, musikNastaTid, latt.steg * 1.6, sover ? "sine" : "triangle", 0.045);
      if (i % 2 === 0) {
        const bas = latt.bas[(i / 2) % latt.bas.length];
        if (bas) spelaNot(bas, musikNastaTid, latt.steg * 2.5, "sine", 0.06);
      }
      musikNastaTid += latt.steg;
      musikSteg += 1;
    }
  } catch (e) {
    musikPa = false; // Webbläsaren klarar inte ljudet – spela vidare utan musik
  }
}

// ---------- Rekord och inställningar sparas i webbläsaren på just den här enheten ----------

function lasInstallning(namn) {
  try {
    return localStorage.getItem(namn);
  } catch (e) {
    return null;
  }
}

function sparaInstallning(namn, varde) {
  try {
    localStorage.setItem(namn, varde);
  } catch (e) {
    // Privat läge e.d. – inställningen sparas inte
  }
}

function lasRekord() {
  try {
    return Number(localStorage.getItem("rekord-pappa")) || 0;
  } catch (e) {
    return 0;
  }
}

function sparaRekord(varde) {
  try {
    localStorage.setItem("rekord-pappa", String(varde));
  } catch (e) {
    // Privat läge e.d. – rekordet sparas bara tills sidan laddas om
  }
}
