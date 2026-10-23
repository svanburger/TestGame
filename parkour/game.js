// =====================================================================
//  PARKOURKATTEN
//
//  Katten springer av sig själv. Tryck på skärmen för att hoppa och
//  tryck en gång till i luften för att göra en volt. Knappen nere till
//  vänster gör en kullerbytta på gatan, eller hoppar ner från ett tak.
//
//  Akta dig för de onda djuren! Varje gång katten blir skrämd blir den
//  lite mer tilltufsad. Efter 3 gånger förvandlas den till en ond katt.
//  Då är det katten som skrämmer de söta djuren, och det ger mest poäng.
//
//  Plocka godsaker på vägen. Ju ovanligare godsak, desto mer poäng.
//
//  Texter skrivs som t("svenska", "English"), så finns spelet på båda
//  språken. Se sprak.js.
//
//  Börja med att ändra i INSTALLNINGAR här nedanför.
// =====================================================================

const INSTALLNINGAR = {
  ondaDjur: ["🐺", "🐍", "🐊", "🐗", "🐻", "🦂", "🕷️", "🦍"], // Står i vägen och skrämmer katten
  springandeDjur: ["🐀", "🐕", "🦡"],   // Springer emot katten – hoppa över dem!
  flygandeDjur: ["🦅", "🦇", "🐝"],     // Flyger lågt – rulla under dem!
  sotaDjur: ["🐱", "🐰", "🐥", "🐹", "🐶", "🦔"], // Dem skrämmer den onda katten

  // Godsaker att plocka. Ju lägre "vanlighet", desto mer sällan dyker den upp.
  godsaker: [
    { bild: "🐟", poang: 5, vanlighet: 60 },
    { bild: "🥛", poang: 10, vanlighet: 20 },
    { bild: "🧀", poang: 20, vanlighet: 10 },
    { bild: "🍗", poang: 40, vanlighet: 6 },
    { bild: "👑", poang: 100, vanlighet: 3 },
    { bild: "💎", poang: 250, vanlighet: 1 },
  ],

  skramdGanger: 3,                      // Hur många gånger man kan bli skrämd innan man blir ond
  ondTid: 45,                           // Hur många sekunder man är ond katt innan spelet tar slut
  fartStart: 6,                         // Hur fort katten springer i början
  fartMax: 10.5,                        // ...och som snabbast
  poang: {
    hopp: 5,
    volt: 20,
    kullerbytta: 10,
    uppPaTak: 10,
    langhopp: 15,
    skramma: 100,                       // När den onda katten skrämmer ett sött djur
  },
  kattFarg: "#f2a65a",
  ondKattFarg: "#3d2c4f",
  ljud: true,
  musik: true,                          // Trudilutten i bakgrunden
};

// ---------------------------------------------------------------------
//  Härifrån och ner är själva spelet.
//
//  Allt i spelvärlden mäts i "enheter". En enhet är ungefär så stor som
//  katten. Variabeln u säger hur många pixlar en enhet är på just den
//  här skärmen. h betyder höjd över gatan, i enheter.
// ---------------------------------------------------------------------

const P = INSTALLNINGAR.poang;
const canvas = document.getElementById("spel");
const ctx = canvas.getContext("2d");
const hemKnapp = document.getElementById("hem");
const pausKnapp = document.getElementById("paus");
const pausmeny = document.getElementById("pausmeny");
const musikKnapp = document.getElementById("musikKnapp");
const TYPSNITT = 'ui-rounded, system-ui, -apple-system, "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif';

const TYNGD = 40;      // Hur snabbt katten faller
const HOPPKRAFT = 16;  // Hur högt katten hoppar
const NIVA1 = 2.5;     // Höjden på låga tak
const NIVA2 = 5;       // Höjden på höga tak
const MARK = { mark: true, h: 0 }; // Gatan

let bredd = 0;
let hojd = 0;
let u = 0;       // Pixlar per enhet
let markY = 0;   // Var gatan är på skärmen, i pixlar
let marginal = { topp: 0, vanster: 0, hoger: 0, botten: 0 };

// Hur skarpt spelet ritas. 2 är skarpast på iPad. Hinner enheten inte med
// sänks det av sig självt, så att spelet flyter i stället för att hacka.
let pixelSkala = Math.min(window.devicePixelRatio || 1, 2);
let bildtider = [];
const emojiMinne = new Map(); // Färdigritade emojis
let himmelNyckel = "";        // Vilken himmel som visas just nu

let lage = "start"; // "start", "spelar" eller "slut"
let poang = 0;
let rekord = lasRekord();
let tid = 0;
let speltid = 0;
let tidSedanSlut = 0;
let fart = INSTALLNINGAR.fartStart;
let kameraX = 0;
let nastaX = 0;  // Var nästa bit av banan ska byggas

let katt = nyKatt();
let plattformar = []; // Taken man kan springa på
let djur = [];
let godis = [];       // Godsakerna som ligger på banan
let texter = [];      // Poängtexter som flyger upp

let combo = 0;        // Gör man trick tätt efter varandra blir poängen gånger fler
let comboTid = 0;
let ondTidKvar = 0;
let forvandlingVisas = 0;
let skakning = 0;
let antalTrick = 0;
let antalSkramda = 0;

function nyKatt() {
  return {
    x: 0,
    h: 0,
    vy: 0,             // Fart uppåt
    yta: MARK,         // Det katten står på, eller null i luften
    startYta: MARK,    // Där senaste hoppet började
    ignorera: null,    // Taket man just hoppat ner från
    hoppAnvanda: 0,
    coyote: 0,         // Lite extra tid att hoppa precis efter att man sprungit av ett tak
    vinkel: 0,
    voltar: false,
    rull: 0,
    skramd: 0,         // Tid kvar som katten är rädd (och inte kan bli skrämd igen)
    tufs: 0,           // Hur många gånger katten blivit skrämd
    ond: false,
    springFas: 0,
  };
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
  bredd = window.innerWidth;
  hojd = window.innerHeight;
  canvas.width = Math.round(bredd * pixelSkala);
  canvas.height = Math.round(hojd * pixelSkala);
  canvas.style.width = bredd + "px";
  canvas.style.height = hojd + "px";
  ctx.setTransform(pixelSkala, 0, 0, pixelSkala, 0, 0);
  u = Math.min(hojd / 11, bredd / 14);
  markY = hojd - marginal.botten - u * 1.2;
  emojiMinne.clear();
  himmelNyckel = "";
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
anpassaStorlek();

function skarmX(x) {
  return (x - kameraX) * u;
}

function skarmY(h) {
  return markY - h * u;
}

// ---------- Styrning ----------

function nerKnapp() {
  const r = Math.max(u * 0.9, 36);
  return { x: marginal.vanster + r + 16, y: hojd - marginal.botten - r - 16, r };
}

canvas.addEventListener("pointerdown", (e) => {
  e.preventDefault();
  startaLjud();
  if (lage === "start" || (lage === "slut" && tidSedanSlut > 1)) {
    startaSpel();
    return;
  }
  if (lage !== "spelar") return;
  const knapp = nerKnapp();
  if (Math.hypot(e.clientX - knapp.x, e.clientY - knapp.y) < knapp.r * 1.3) ner();
  else hoppa();
});

window.addEventListener("keydown", (e) => {
  if (e.repeat) return;
  const hopp = e.key === " " || e.key === "ArrowUp" || e.key === "w";
  if (e.key === "p" || e.key === "Escape") {
    if (lage === "spelar") pausa();
    else if (lage === "paus") fortsatt();
    return;
  }
  if (lage === "start" || (lage === "slut" && tidSedanSlut > 1)) {
    if (hopp || e.key === "Enter") {
      startaLjud();
      startaSpel();
    }
    return;
  }
  if (lage !== "spelar") return;
  if (hopp) hoppa();
  if (e.key === "ArrowDown" || e.key === "s") ner();
});

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
  startaLjud();
}

function visaMusikKnapp() {
  musikKnapp.textContent = musikPa ? t("♪ Musik: på", "♪ Music: on") : t("♪ Musik: av", "♪ Music: off");
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
  sparaInstallning("musik-parkour", musikPa ? "pa" : "av");
  visaMusikKnapp();
});

// Pausa av sig själv om man byter app eller flik
document.addEventListener("visibilitychange", () => {
  if (document.hidden) pausa();
});

function hoppa() {
  const k = katt;
  if (k.yta || k.coyote > 0) {
    if (k.yta) k.startYta = k.yta;
    k.yta = null;
    k.coyote = 0;
    k.vy = HOPPKRAFT;
    k.hoppAnvanda = 1;
    k.rull = 0;
    ge("", P.hopp, false);
    spelaTon(400, 700, 0.12, "square", 0.06);
  } else if (k.hoppAnvanda < 2) {
    k.vy = HOPPKRAFT;
    k.hoppAnvanda = 2;
    k.voltar = true;
    k.vinkel = 0;
    ge(t("Volt!", "Flip!"), P.volt, true);
    spelaTon(500, 1300, 0.25, "triangle", 0.12);
  }
}

function ner() {
  const k = katt;
  if (k.yta && !k.yta.mark) {
    // Hoppa ner från taket
    k.startYta = k.yta;
    k.ignorera = k.yta;
    k.yta = null;
    k.vy = 0;
    k.hoppAnvanda = 1;
  } else if (k.yta) {
    if (k.rull <= 0) {
      k.rull = 0.6;
      ge(t("Kullerbytta!", "Roll!"), P.kullerbytta, true);
      spelaTon(300, 150, 0.2, "triangle", 0.1);
    }
  } else {
    k.vy = Math.min(k.vy, -22); // Dyk snabbt neråt
  }
}

// ---------- Banan byggs bit för bit medan man springer ----------

function slumpa(lista) {
  return lista[Math.floor(Math.random() * lista.length)];
}

// Ger samma "slumptal" varje gång för samma n (så att fönster och hus inte blinkar)
function slumpTal(n) {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
}

// typ är "ond" (står still), "springer", "flyger" eller "sot" (söta djur)
function laggDjur(typ, x, yta) {
  let bild = slumpa(INSTALLNINGAR.sotaDjur);
  if (typ === "ond") bild = slumpa(INSTALLNINGAR.ondaDjur);
  if (typ === "springer") bild = slumpa(INSTALLNINGAR.springandeDjur);
  if (typ === "flyger") bild = slumpa(INSTALLNINGAR.flygandeDjur);
  djur.push({
    typ,
    x,
    h: typ === "flyger" ? 0.6 : yta.h,
    bild,
    fas: Math.random() * 6,
    flyr: false,
    vx: 0,
    vy: 0,
  });
}

// Väljer en godsak. Vanliga godsaker väljs oftare än ovanliga.
function slumpaGodsak(minstPoang = 0) {
  const lista = INSTALLNINGAR.godsaker.filter((g) => g.poang >= minstPoang);
  let kvar = Math.random() * lista.reduce((summa, g) => summa + g.vanlighet, 0);
  for (const g of lista) {
    kvar -= g.vanlighet;
    if (kvar < 0) return g;
  }
  return lista[0];
}

function laggGodsak(x, h, godsak) {
  godis.push({ x, h, bild: godsak.bild, poang: godsak.poang, tagen: false });
}

function godisrad(x, h, langd) {
  const antal = Math.max(1, Math.floor(langd / 1.2));
  for (let i = 0; i < antal; i++) laggGodsak(x + i * 1.2, h + 0.7, slumpaGodsak());
}

// Ett onda djur som passar på gatan
function ondPaGatan() {
  const r = Math.random();
  if (r < 0.3) return "flyger";
  if (r < 0.55) return "springer";
  return "ond";
}

function byggSektion() {
  const val = Math.random();
  const fara = katt.ond ? "sot" : "ond";

  // En lugn bit gata, kanske med ett djur som springer eller flyger
  if (val < 0.3) {
    const langd = 8 + Math.random() * 6;
    if (Math.random() < 0.65) {
      laggDjur(katt.ond ? "sot" : ondPaGatan(), nastaX + langd * 0.6, MARK);
    } else {
      godisrad(nastaX + 2, 0, langd - 4);
    }
    nastaX += langd;
    return;
  }

  // En rad med tak. Antingen uppe på taken eller nere på gatan finns ett djur.
  const tak = [];
  let x = nastaX + 1;
  const antal = 2 + Math.floor(Math.random() * 3);
  const trappa = val > 0.75;
  for (let i = 0; i < antal; i++) {
    const w = 3 + Math.random() * 3;
    const p = { x, h: trappa && i % 2 === 1 ? NIVA2 : NIVA1, w, fro: Math.random() * 1000 };
    plattformar.push(p);
    tak.push(p);
    x += w + 1.6 + Math.random() * 1.4;
  }
  const slut = x;

  const r = Math.random();
  let paTak;
  let paMark;
  if (katt.ond) {
    paTak = r < 0.5;
    paMark = r >= 0.3;
  } else {
    paTak = r < 0.35;
    paMark = r >= 0.35 && r < 0.75;
  }

  const mittTak = tak[Math.floor(tak.length / 2)];
  if (paTak) laggDjur(fara, mittTak.x + mittTak.w * 0.6, mittTak);
  else for (const p of tak) godisrad(p.x + 0.8, p.h, p.w - 1.6);

  const forsta = tak[0];
  const markTyp = katt.ond ? "sot" : Math.random() < 0.35 ? "springer" : "ond";
  if (paMark) laggDjur(markTyp, forsta.x + 3.5 + Math.random() * Math.max(0, slut - forsta.x - 6), MARK);
  else godisrad(forsta.x + 2, 0, slut - forsta.x - 4);

  // Ibland svävar en ovanlig godsak högt upp mellan två tak – gör en volt för att nå den!
  if (tak.length >= 2 && Math.random() < 0.3) {
    const glipa = tak[0].x + tak[0].w + 0.8;
    laggGodsak(glipa, Math.max(tak[0].h, tak[1].h) + 3, slumpaGodsak(40));
  }

  nastaX = slut + 1;
}

function fyllVarlden() {
  while (nastaX < kameraX + bredd / u + 12) byggSektion();
}

function rensa() {
  const vanster = kameraX - 5;
  const hoger = kameraX + bredd / u + 20;
  plattformar = plattformar.filter((p) => p.x + p.w > vanster);
  djur = djur.filter((a) => a.x > vanster && a.x < hoger && a.h < 40);
  godis = godis.filter((g) => !g.tagen && g.x > vanster);
  texter = texter.filter((t) => t.kvar > 0);
}

function aterstallVarld() {
  katt = nyKatt();
  plattformar = [];
  djur = [];
  godis = [];
  texter = [];
  nastaX = 14; // Lite tom gata i början
  kameraX = katt.x - (bredd * 0.25) / u;
  fyllVarlden();
}

// ---------- Spelets regler ----------

function startaSpel() {
  lage = "spelar";
  poang = 0;
  speltid = 0;
  combo = 0;
  comboTid = 0;
  ondTidKvar = 0;
  forvandlingVisas = 0;
  antalTrick = 0;
  antalSkramda = 0;
  musikSteg = 0;
  aterstallVarld();
}

// Ger poäng och visar en text. Trick gjorda tätt efter varandra ger "combo".
function ge(namn, bas, trick, x = katt.x, h = katt.h + 1.6) {
  if (trick) {
    combo = comboTid > 0 ? Math.min(5, combo + 1) : 1;
    comboTid = 2.5;
    if (namn) antalTrick += 1;
  }
  const p = bas * Math.max(1, combo);
  poang += p;
  texter.push({ x, h, text: namn ? `${namn} +${p}` : `+${p}`, kvar: 1, stor: !!namn });
}

function landa(yta) {
  const k = katt;
  const fran = k.startYta;
  k.h = yta.h;
  k.vy = 0;
  k.yta = yta;
  k.hoppAnvanda = 0;
  k.voltar = false;
  k.vinkel = 0;
  if (!yta.mark && fran !== yta) {
    if (fran.mark || fran.h < yta.h - 0.1) ge(t("Upp på taket!", "Up on the roof!"), P.uppPaTak, true);
    else ge(t("Långhopp!", "Long jump!"), P.langhopp, true);
  }
}

function blirSkramd(a) {
  const k = katt;
  k.tufs += 1;
  k.skramd = 1.6;
  if (k.yta) k.startYta = k.yta;
  k.yta = null;
  k.vy = 11;
  k.hoppAnvanda = 1;
  k.rull = 0;
  combo = 0;
  comboTid = 0;
  texter.push({ x: a.x, h: a.h + 1.5, text: t("BU!", "BOO!"), kvar: 1, stor: true, farg: "#ff6b6b" });
  spelaTon(500, 120, 0.4, "sawtooth", 0.12);
  if (navigator.vibrate) navigator.vibrate(200);
  skakning = 0.3;
  if (k.tufs >= INSTALLNINGAR.skramdGanger) forvandla();
}

function forvandla() {
  katt.ond = true;
  katt.skramd = 0;
  ondTidKvar = INSTALLNINGAR.ondTid;
  forvandlingVisas = 3;
  skakning = 0.6;
  musikSteg = 0; // Byt till den läskiga trudilutten
  // Alla onda djur som finns kvar blir söta djur
  for (const a of djur) {
    if (a.flyr || a.typ === "sot") continue;
    if (a.typ === "flyger") a.h = 0;
    a.typ = "sot";
    a.bild = slumpa(INSTALLNINGAR.sotaDjur);
  }
  spelaTon(400, 80, 0.7, "sawtooth", 0.15);
  setTimeout(() => spelaTon(250, 50, 0.9, "square", 0.1), 300);
}

function skrammaDjur(a) {
  a.flyr = true;
  a.vx = fart + 3;
  a.vy = 6;
  antalSkramda += 1;
  ge(t("BUU!", "BOOO!"), P.skramma, true, a.x, a.h + 1.6);
  spelaTon(160, 60, 0.35, "sawtooth", 0.15);
  skakning = 0.15;
}

function slutaSpel() {
  lage = "slut";
  tidSedanSlut = 0;
  if (poang > rekord) {
    rekord = poang;
    sparaRekord(rekord);
  }
  Topplista.nyttResultat("parkour", poang); // Har man kommit med får man skriva sitt namn
}

// Krockar katten med djuret?
function traffar(a) {
  const k = katt;
  const kattHojd = k.rull > 0 ? 0.5 : 0.9;
  const mittH = a.h + 0.45;
  const nx = Math.max(k.x - 0.45, Math.min(a.x, k.x + 0.6));
  const nh = Math.max(k.h, Math.min(mittH, k.h + kattHojd));
  return (nx - a.x) ** 2 + (nh - mittH) ** 2 < 0.38 * 0.38;
}

function uppdateraKatt(dt) {
  const k = katt;
  k.x += fart * dt;
  k.springFas += dt * fart * 1.6;
  if (k.skramd > 0) k.skramd -= dt;
  if (k.rull > 0) k.rull -= dt;
  if (k.coyote > 0) k.coyote -= dt;

  if (k.voltar) {
    k.vinkel += dt * Math.PI * 4;
    if (k.vinkel >= Math.PI * 2) {
      k.vinkel = 0;
      k.voltar = false;
    }
  }

  // Sprang katten av kanten på taket?
  if (k.yta && !k.yta.mark && k.x - 0.2 > k.yta.x + k.yta.w) {
    k.startYta = k.yta;
    k.yta = null;
    k.vy = 0;
    k.hoppAnvanda = 1;
    k.coyote = 0.12;
  }

  if (!k.yta) {
    const forraH = k.h;
    k.vy -= TYNGD * dt;
    k.h += k.vy * dt;
    if (k.vy <= 0) {
      for (const p of plattformar) {
        const ovanfor = k.x >= p.x - 0.25 && k.x <= p.x + p.w + 0.25;
        if (p !== k.ignorera && ovanfor && forraH >= p.h - 0.001 && k.h <= p.h) {
          landa(p);
          break;
        }
      }
      if (!k.yta && k.h <= 0) landa(MARK);
    }
    if (k.ignorera && k.h < k.ignorera.h - 0.3) k.ignorera = null;
  }
}

function uppdatera(dt) {
  if (lage === "paus") return; // Allt står still under pausen
  tid += dt;
  for (const t of texter) {
    t.h += 1.5 * dt;
    t.kvar -= dt;
  }
  if (skakning > 0) skakning -= dt;
  if (lage === "slut") tidSedanSlut += dt;
  if (lage !== "spelar") {
    katt.springFas += dt * 10;
    return;
  }

  speltid += dt;
  fart = Math.min(INSTALLNINGAR.fartMax, INSTALLNINGAR.fartStart + speltid * 0.05) + (katt.ond ? 1 : 0);
  if (comboTid > 0) {
    comboTid -= dt;
    if (comboTid <= 0) combo = 0;
  }
  if (forvandlingVisas > 0) forvandlingVisas -= dt;
  if (katt.ond) {
    ondTidKvar -= dt;
    if (ondTidKvar <= 0) {
      slutaSpel();
      return;
    }
  }

  uppdateraKatt(dt);
  kameraX = katt.x - (bredd * 0.25) / u;

  for (const a of djur) {
    a.fas += dt;
    if (a.flyr) {
      a.x += a.vx * dt;
      a.h += a.vy * dt;
      continue;
    }
    if (a.typ === "flyger") a.x -= 2.5 * dt;
    if (a.typ === "springer") a.x -= 3 * dt;
    if (!traffar(a)) continue;
    if (a.typ === "sot") {
      if (katt.ond) skrammaDjur(a);
    } else if (!katt.ond && katt.skramd <= 0) {
      blirSkramd(a);
    }
  }

  for (const g of godis) {
    if (!g.tagen && Math.abs(g.x - (katt.x + 0.1)) < 0.6 && g.h > katt.h - 0.2 && g.h < katt.h + 1.1) {
      g.tagen = true;
      const ovanlig = g.poang >= 40;
      ge("", g.poang, false, g.x, g.h + 0.5);
      if (ovanlig) {
        texter[texter.length - 1].stor = true;
        texter[texter.length - 1].farg = "#ffe14d";
        spelaTon(700, 1400, 0.1, "square", 0.08);
        setTimeout(() => spelaTon(1000, 2000, 0.15, "square", 0.08), 90);
      } else {
        spelaTon(900, 1400, 0.08, "sine", 0.08);
      }
    }
  }

  fyllVarlden();
  rensa();
}

// ---------- Rita ----------

function ritaText(text, x, y, storlek, farg = "#ffffff", just = "center") {
  ctx.font = `bold ${storlek}px ${TYPSNITT}`;
  ctx.textAlign = just;
  ctx.textBaseline = "middle";
  ctx.lineJoin = "round";
  ctx.lineWidth = storlek * 0.18;
  ctx.strokeStyle = "rgba(20, 15, 40, 0.6)";
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

function ritaEmoji(bild, x, y, storlek, just = "center") {
  const liten = emojiBild(bild, storlek);
  const sida = liten.width / pixelSkala;
  let vanster = x - sida / 2;
  if (just === "left") vanster = x - (sida - storlek) / 2;
  if (just === "right") vanster = x - storlek - (sida - storlek) / 2;
  ctx.drawImage(liten, vanster, y - sida / 2, sida, sida);
}

function blanda(a, b, t) {
  const pa = parseInt(a.slice(1), 16);
  const pb = parseInt(b.slice(1), 16);
  const kanal = (skift) => Math.round(((pa >> skift) & 255) * (1 - t) + ((pb >> skift) & 255) * t);
  return `rgb(${kanal(16)}, ${kanal(8)}, ${kanal(0)})`;
}

// Himlen är en bakgrund bakom spelet (CSS) i stället för att målas om varje
// bild. Det sparar mycket arbete, och är det som gör att det inte hackar.

function uppdateraHimmel() {
  const ond = katt.ond;
  const nere = Math.round((markY / hojd) * 100) + "%";
  const nyckel = ond + nere;
  if (nyckel === himmelNyckel) return;
  himmelNyckel = nyckel;
  canvas.style.background = ond
    ? `linear-gradient(#2a1240, #c2415b ${nere})`
    : `linear-gradient(#7ec8f0, #fde2b8 ${nere})`;
}

function ritaHimmel() {
  const ond = katt.ond;

  // Sol eller blodröd måne
  ctx.fillStyle = ond ? "#ff5a5a" : "#fff2a8";
  ctx.beginPath();
  ctx.arc(bredd * 0.8, marginal.topp + hojd * 0.18, u * 0.9, 0, Math.PI * 2);
  ctx.fill();

  // Stad långt borta som rör sig långsamt
  const husBredd = 2.2;
  const forskjut = kameraX * 0.3;
  const forsta = Math.floor(forskjut / husBredd) - 1;
  const antal = Math.ceil(bredd / (husBredd * u)) + 3;
  ctx.fillStyle = ond ? "rgba(25, 5, 35, 0.55)" : "rgba(70, 110, 160, 0.35)";
  for (let j = forsta; j < forsta + antal; j++) {
    const hh = 2 + slumpTal(j) * 5;
    ctx.fillRect((j * husBredd - forskjut) * u, markY - hh * u, husBredd * u - 2, hh * u);
  }
}

function ritaHus() {
  const ond = katt.ond;
  for (const p of plattformar) {
    const x = skarmX(p.x);
    const w = p.w * u;
    if (x > bredd || x + w < 0) continue;
    const topp = skarmY(p.h);
    ctx.fillStyle = ond ? "#4b2d4f" : "#c8735a";
    ctx.fillRect(x, topp, w, markY - topp);

    const kolumner = Math.max(1, Math.floor(p.w / 1.1));
    const rader = Math.max(1, Math.floor((p.h - 0.4) / 1.2));
    for (let c = 0; c < kolumner; c++) {
      for (let r = 0; r < rader; r++) {
        const tant = slumpTal(p.fro + c * 7 + r * 13) > 0.45;
        ctx.fillStyle = tant ? (ond ? "#ff8f6b" : "#ffe9a8") : (ond ? "#2b1830" : "#6e3d33");
        ctx.fillRect(x + ((c + 0.5) * w) / kolumner - u * 0.25, topp + (r + 0.6) * 1.2 * u, u * 0.5, u * 0.6);
      }
    }

    // Takkanten man springer på
    ctx.fillStyle = ond ? "#2b1830" : "#6b3b2e";
    ctx.fillRect(x - u * 0.1, topp - u * 0.1, w + u * 0.2, u * 0.3);
  }
}

function ritaGata() {
  const ond = katt.ond;
  ctx.fillStyle = ond ? "#231a2b" : "#454b57";
  ctx.fillRect(-u, markY, bredd + 2 * u, hojd - markY + u);
  ctx.fillStyle = ond ? "#4a3a52" : "#a9b2bc";
  ctx.fillRect(-u, markY, bredd + 2 * u, u * 0.25);

  ctx.fillStyle = ond ? "#7a5a86" : "#e8e2c8";
  const y = markY + (hojd - markY) * 0.55;
  const steg = 2;
  for (let x = Math.floor(kameraX / steg) * steg; x < kameraX + bredd / u + steg; x += steg) {
    ctx.fillRect(skarmX(x), y, u * 0.9, Math.max(2, u * 0.1));
  }
}

function ritaSaker() {
  for (const g of godis) {
    const gung = Math.sin(tid * 4 + g.x) * u * 0.08;
    const ovanlig = g.poang >= 40;
    if (ovanlig) {
      // Ovanliga godsaker glittrar
      ctx.fillStyle = `rgba(255, 240, 150, ${0.35 + Math.sin(tid * 6 + g.x) * 0.2})`;
      ctx.beginPath();
      ctx.arc(skarmX(g.x), skarmY(g.h) + gung, u * 0.5, 0, Math.PI * 2);
      ctx.fill();
    }
    ritaEmoji(g.bild, skarmX(g.x), skarmY(g.h) + gung, u * (ovanlig ? 0.7 : 0.6));
  }
  for (const a of djur) {
    const x = skarmX(a.x);
    if (x < -u * 2 || x > bredd + u * 2) continue;
    let gung = Math.abs(Math.sin(a.fas * 3)) * -u * 0.12;
    if (a.typ === "flyger") gung = Math.sin(a.fas * 8) * u * 0.12;
    if (a.typ === "springer") gung = Math.abs(Math.sin(a.fas * 12)) * -u * 0.15;
    const y = skarmY(a.h + 0.5) + gung;
    ritaEmoji(a.bild, x, y, u * 1.05);
    if (a.flyr) ritaEmoji("😱", x + u * 0.3, y - u * 0.8, u * 0.55);
  }
}

// Ritar katten. Allt mäts i "katt-storlekar", så 1 = en enhet.
function ritaKatt(x, y, s, k) {
  const ond = k.ond;
  const radd = k.skramd > 0 && !ond;
  const tufs = ond ? 0 : Math.min(k.tufs, 2);
  const pals = ond ? INSTALLNINGAR.ondKattFarg : blanda(INSTALLNINGAR.kattFarg, "#9c8f84", tufs * 0.3);
  const ljus = ond ? "#6b5585" : "#fff3e2";
  const kant = ond ? "#140a1c" : "#6e3f1c";
  const lw = Math.max(1.5 / s, 0.045);

  ctx.save();
  if (radd && Math.floor(tid * 12) % 2 === 0) ctx.globalAlpha = 0.5; // Blinkar när den är rädd
  ctx.translate(x, y);
  ctx.scale(s, s);
  ctx.lineJoin = "round";
  ctx.lineCap = "round";

  if (ond) {
    // Lila sken runt den onda katten
    const sken = ctx.createRadialGradient(0, -0.55, 0.1, 0, -0.55, 1.1);
    sken.addColorStop(0, "rgba(200, 70, 255, 0.45)");
    sken.addColorStop(1, "rgba(200, 70, 255, 0)");
    ctx.fillStyle = sken;
    ctx.beginPath();
    ctx.arc(0, -0.55, 1.1, 0, Math.PI * 2);
    ctx.fill();
  }

  // Tjock linje med kant runt, till svans och ben
  const tjockLinje = (tjocklek) => {
    ctx.strokeStyle = kant;
    ctx.lineWidth = tjocklek;
    ctx.stroke();
    ctx.strokeStyle = pals;
    ctx.lineWidth = tjocklek - lw * 2;
    ctx.stroke();
  };

  const fylld = (farg) => {
    ctx.fillStyle = farg;
    ctx.fill();
    ctx.strokeStyle = kant;
    ctx.lineWidth = lw;
    ctx.stroke();
  };

  if (k.rull > 0) {
    // Kullerbytta: katten är en snurrande boll
    ctx.translate(0, -0.33);
    ctx.rotate(tid * 14);
    ctx.beginPath();
    ctx.moveTo(-0.1, -0.3);
    ctx.lineTo(0.05, -0.48);
    ctx.lineTo(0.18, -0.26);
    fylld(pals);
    ctx.beginPath();
    ctx.arc(0, 0, 0.33, 0, Math.PI * 2);
    fylld(pals);
    ctx.beginPath();
    ctx.arc(0, 0, 0.2, 0.5, 2.5);
    ctx.strokeStyle = kant;
    ctx.lineWidth = lw;
    ctx.stroke();
    ctx.restore();
    return;
  }

  // Volt: snurra runt kattens mitt
  ctx.translate(0, -0.5);
  ctx.rotate(k.vinkel);
  ctx.translate(0, 0.5);

  const iLuften = !k.yta;

  // Svans
  const vift = Math.sin(tid * 5) * 0.12;
  let svansSlut = [-0.95, -1.0 + vift];
  if (tufs >= 2) svansSlut = [-1.0, -0.3]; // Hängande svans
  if (radd) svansSlut = [-0.8, -1.25];     // Rakt upp av skräck
  ctx.beginPath();
  ctx.moveTo(-0.4, -0.55);
  ctx.quadraticCurveTo(-0.95, -0.55, svansSlut[0], svansSlut[1]);
  tjockLinje(0.17);

  // Ben
  [-0.3, -0.12, 0.18, 0.34].forEach((bx, i) => {
    const fasForskjutning = (i % 2 ? Math.PI : 0) + (i < 2 ? 0 : Math.PI / 2);
    const sving = iLuften ? (i < 2 ? -0.5 : 0.5) : Math.sin(k.springFas + fasForskjutning);
    const lyft = iLuften ? 0.06 : Math.max(0, Math.sin(k.springFas + fasForskjutning + Math.PI / 2)) * 0.08;
    ctx.beginPath();
    ctx.moveTo(bx, -0.35);
    ctx.lineTo(bx + sving * 0.16, -0.03 - lyft);
    tjockLinje(0.15);
  });

  // Kropp och mage
  ctx.beginPath();
  ctx.ellipse(0, -0.5, 0.48, 0.26, 0, 0, Math.PI * 2);
  fylld(pals);
  ctx.beginPath();
  ctx.ellipse(0.05, -0.4, 0.28, 0.12, 0, 0, Math.PI * 2);
  ctx.fillStyle = ljus;
  ctx.fill();

  if (!ond) {
    ctx.strokeStyle = blanda("#c4682a", "#7d6f63", tufs * 0.3);
    ctx.lineWidth = lw * 1.4;
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.moveTo(-0.27 + i * 0.17, -0.74);
      ctx.lineTo(-0.22 + i * 0.17, -0.6);
      ctx.stroke();
    }
  }

  // Taggig päls: ond, rädd eller tilltufsad
  const taggar = ond ? 6 : radd ? 7 : tufs * 3;
  for (let i = 0; i < taggar; i++) {
    const t = taggar === 1 ? 0.5 : i / (taggar - 1);
    const px = -0.38 + t * 0.7;
    const py = -0.5 - 0.26 * Math.sqrt(Math.max(0, 1 - (px / 0.48) ** 2));
    const langd = radd ? 0.2 : ond ? 0.16 : 0.08 + slumpTal(i + tufs * 10) * 0.1;
    const luta = ond || radd ? 0 : (slumpTal(i * 3 + 1) - 0.5) * 0.15;
    ctx.beginPath();
    ctx.moveTo(px - 0.05, py + 0.03);
    ctx.lineTo(px + luta, py - langd);
    ctx.lineTo(px + 0.05, py + 0.03);
    fylld(pals);
  }

  // Smutsfläckar när den är tilltufsad
  if (tufs >= 1) {
    ctx.fillStyle = "rgba(90, 70, 50, 0.45)";
    const flackar = [[-0.2, -0.45], [0.15, -0.6], [-0.05, -0.35], [0.3, -0.48]];
    for (const [fx, fy] of flackar.slice(0, tufs * 2)) {
      ctx.beginPath();
      ctx.arc(fx, fy, 0.045, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Huvud
  const hx = 0.44;
  const hy = -0.86;
  const oraHojd = ond ? 0.52 : 0.42;
  ctx.beginPath();
  ctx.moveTo(hx - 0.26, hy - 0.12);
  ctx.lineTo(hx - 0.2, hy - oraHojd);
  ctx.lineTo(hx - 0.02, hy - 0.27);
  fylld(pals);
  ctx.beginPath();
  ctx.moveTo(hx + 0.02, hy - 0.28);
  if (tufs >= 1) ctx.lineTo(hx + 0.36, hy - 0.3); // Vikt öra
  else ctx.lineTo(hx + 0.2, hy - oraHojd - 0.03);
  ctx.lineTo(hx + 0.27, hy - 0.1);
  fylld(pals);

  ctx.beginPath();
  ctx.arc(hx, hy, 0.3, 0, Math.PI * 2);
  fylld(pals);

  if (!ond) {
    ctx.fillStyle = "#f7a8b8";
    ctx.beginPath();
    ctx.moveTo(hx - 0.19, hy - 0.2);
    ctx.lineTo(hx - 0.18, hy - oraHojd + 0.1);
    ctx.lineTo(hx - 0.08, hy - 0.25);
    ctx.fill();
  }

  // Nosparti
  ctx.beginPath();
  ctx.ellipse(hx + 0.13, hy + 0.1, 0.14, 0.09, 0, 0, Math.PI * 2);
  ctx.fillStyle = ljus;
  ctx.fill();

  // Ögon
  for (const ex of [hx, hx + 0.19]) {
    const ey = hy - 0.03;
    if (ond) {
      ctx.fillStyle = "#ffdd33";
      ctx.beginPath();
      ctx.ellipse(ex, ey, 0.07, 0.06, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#000000";
      ctx.fillRect(ex - 0.012, ey - 0.05, 0.024, 0.1);
    } else if (radd) {
      ctx.beginPath();
      ctx.arc(ex, ey, 0.085, 0, Math.PI * 2);
      fylld("#ffffff");
      ctx.fillStyle = "#000000";
      ctx.beginPath();
      ctx.arc(ex + 0.01, ey, 0.03, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillStyle = "#1a1a1a";
      ctx.beginPath();
      ctx.ellipse(ex, ey, 0.055, 0.075, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(ex + 0.018, ey - 0.03, 0.022, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  if (ond) {
    // Arga ögonbryn
    ctx.strokeStyle = kant;
    ctx.lineWidth = lw * 1.6;
    ctx.beginPath();
    ctx.moveTo(hx - 0.08, hy - 0.15);
    ctx.lineTo(hx + 0.06, hy - 0.09);
    ctx.moveTo(hx + 0.13, hy - 0.09);
    ctx.lineTo(hx + 0.27, hy - 0.15);
    ctx.stroke();
  }

  // Näsa
  ctx.fillStyle = "#e5737f";
  ctx.beginPath();
  ctx.moveTo(hx + 0.2, hy + 0.05);
  ctx.lineTo(hx + 0.27, hy + 0.05);
  ctx.lineTo(hx + 0.235, hy + 0.095);
  ctx.fill();

  // Mun
  ctx.strokeStyle = kant;
  ctx.lineWidth = lw;
  if (ond) {
    ctx.beginPath();
    ctx.moveTo(hx + 0.06, hy + 0.14);
    ctx.quadraticCurveTo(hx + 0.18, hy + 0.24, hx + 0.3, hy + 0.13);
    ctx.stroke();
    ctx.fillStyle = "#ffffff";
    for (const tx of [hx + 0.12, hx + 0.22]) {
      ctx.beginPath();
      ctx.moveTo(tx - 0.025, hy + 0.17);
      ctx.lineTo(tx, hy + 0.24);
      ctx.lineTo(tx + 0.025, hy + 0.17);
      ctx.fill();
    }
  } else if (radd) {
    ctx.fillStyle = "#5a2a2a";
    ctx.beginPath();
    ctx.ellipse(hx + 0.2, hy + 0.18, 0.04, 0.05, 0, 0, Math.PI * 2);
    ctx.fill();
  } else {
    ctx.beginPath();
    ctx.arc(hx + 0.2, hy + 0.12, 0.035, 0, Math.PI);
    ctx.moveTo(hx + 0.305, hy + 0.12);
    ctx.arc(hx + 0.27, hy + 0.12, 0.035, 0, Math.PI);
    ctx.stroke();
  }

  // Morrhår
  ctx.globalAlpha *= 0.7;
  ctx.lineWidth = lw * 0.7;
  ctx.beginPath();
  for (const [mx, my] of [[0.48, 0.04], [0.5, 0.11], [0.47, 0.18]]) {
    ctx.moveTo(hx + 0.27, hy + 0.1);
    ctx.lineTo(hx + mx, hy + my);
  }
  ctx.stroke();
  ctx.globalAlpha /= 0.7;

  // Plåster på huvudet när den är riktigt tilltufsad
  if (tufs >= 2) {
    ctx.save();
    ctx.translate(hx - 0.1, hy - 0.17);
    ctx.rotate(-0.5);
    ctx.beginPath();
    ctx.rect(-0.13, -0.045, 0.26, 0.09);
    fylld("#f3c99b");
    ctx.strokeStyle = "#c79a6b";
    ctx.beginPath();
    ctx.moveTo(-0.03, -0.03);
    ctx.lineTo(0.03, 0.03);
    ctx.moveTo(0.03, -0.03);
    ctx.lineTo(-0.03, 0.03);
    ctx.stroke();
    ctx.restore();
  }

  ctx.restore();

  if (radd) {
    ritaText("!!", x + s * 0.45, y - s * 1.55, s * 0.45, "#ffef5a");
    ritaEmoji("💦", x + s * 0.85, y - s * 1.1, s * 0.35);
  }
}

function ritaTexter() {
  for (const t of texter) {
    ctx.globalAlpha = Math.max(0, Math.min(1, t.kvar * 1.5));
    ritaText(t.text, skarmX(t.x), skarmY(t.h), u * (t.stor ? 0.5 : 0.38), t.farg || "#ffffff");
  }
  ctx.globalAlpha = 1;
}

function ritaPanel() {
  const topp = marginal.topp + Math.max(u * 0.7, 40);
  const vanster = marginal.vanster + 150; // Till höger om hus- och pausknapparna
  const hoger = bredd - marginal.hoger - u * 0.5;
  const storlek = Math.max(20, u * 0.6);

  ritaEmoji("⭐", vanster, topp, storlek, "left");
  ritaText(String(poang), vanster + storlek * 1.3, topp, storlek, "#ffffff", "left");
  if (combo > 1) {
    const textBredd = ctx.measureText(String(poang)).width;
    ritaText("x" + combo, vanster + storlek * 1.6 + textBredd, topp, storlek * 0.8, "#ffe14d", "left");
  }

  if (katt.ond) {
    const sek = Math.max(0, Math.ceil(ondTidKvar));
    ritaText(String(sek), hoger, topp, storlek, "#ffffff", "right");
    const textBredd = ctx.measureText(String(sek)).width;
    ritaEmoji("😈", hoger - textBredd - storlek * 0.3, topp, storlek, "right");
  } else {
    for (let i = 0; i < INSTALLNINGAR.skramdGanger; i++) {
      const bild = i < katt.tufs ? "🙀" : "😺";
      ritaEmoji(bild, hoger - i * storlek * 1.2, topp, storlek, "right");
    }
  }

  // Ner-knappen
  const knapp = nerKnapp();
  ctx.fillStyle = "rgba(255, 255, 255, 0.25)";
  ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(knapp.x, knapp.y, knapp.r, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  const a = knapp.r * 0.45;
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.moveTo(knapp.x - a, knapp.y - a * 0.2);
  ctx.lineTo(knapp.x + a, knapp.y - a * 0.2);
  ctx.lineTo(knapp.x, knapp.y + a * 0.9);
  ctx.closePath();
  ctx.fill();
  ctx.fillRect(knapp.x - a * 0.3, knapp.y - a, a * 0.6, a * 0.9);
}

function ritaSkarmar() {
  const ts = Math.min(bredd, hojd) / 14; // Textstorlek
  const mitt = bredd / 2;

  if (forvandlingVisas > 0 && lage === "spelar") {
    ctx.globalAlpha = Math.min(1, forvandlingVisas);
    ctx.fillStyle = "rgba(120, 20, 160, 0.35)";
    ctx.fillRect(0, 0, bredd, hojd);
    ritaText(t("Du blev en ond katt! 😈", "You turned into an evil cat! 😈"), mitt, hojd * 0.32, ts * 1.1, "#ffffff");
    ritaText(t("Skräm de söta djuren!", "Scare the cute animals!"), mitt, hojd * 0.32 + ts * 1.4, ts * 0.8, "#ffd6ff");
    ctx.globalAlpha = 1;
  }

  if (lage === "spelar" || lage === "paus") return;

  ctx.fillStyle = "rgba(15, 10, 35, 0.45)";
  ctx.fillRect(0, 0, bredd, hojd);
  let y = marginal.topp + Math.max(ts * 1.6, hojd * 0.14);
  const rad = (text, storlek, farg) => {
    ritaText(text, mitt, y, storlek, farg);
    y += storlek * 1.45;
  };

  if (lage === "start") {
    rad(t("Parkourkatten", "Parkour Cat"), ts * 1.4, "#ffd27a");
    y += ts * 0.3;
    rad(t("Tryck = hoppa", "Tap = jump"), ts * 0.7);
    rad(t("Tryck igen i luften = volt", "Tap again in the air = flip"), ts * 0.7);
    rad(t("⬇ = kullerbytta / hoppa ner", "⬇ = roll / jump down"), ts * 0.7);
    rad(t("Akta dig för de onda djuren!", "Watch out for the evil animals!"), ts * 0.7, "#ffb3b3");
    y += ts * 0.4;
    rad(t("Tryck för att börja", "Tap to start"), ts * 0.85, "#ffffff");
    if (rekord > 0) rad(t("Rekord: ", "High score: ") + rekord, ts * 0.6, "#d5def0");
    if (hojd > bredd) rad(t("Tips: vänd skärmen på bredden", "Tip: turn the screen sideways"), ts * 0.55, "#d5def0");
  }

  if (lage === "slut") {
    rad(t("Slut!", "Game over!"), ts * 1.4, "#ffd27a");
    rad(poang + t(" poäng", poang === 1 ? " point" : " points"), ts * 1.0);
    rad(poang > 0 && poang === rekord ? t("🏆 Nytt rekord! 🏆", "🏆 New high score! 🏆") : t("Rekord: ", "High score: ") + rekord, ts * 0.7);
    rad(t(`${antalTrick} trick · ${antalSkramda} skrämda djur`, `${antalTrick} ${antalTrick === 1 ? "trick" : "tricks"} · ${antalSkramda} scared ${antalSkramda === 1 ? "animal" : "animals"}`), ts * 0.6, "#d5def0");
    y += ts * 0.4;
    if (tidSedanSlut > 1) rad(t("Tryck för att spela igen", "Tap to play again"), ts * 0.8);
  }
}

function rita() {
  // Pausknappen syns bara när man spelar. Under pausen finns allt i pausmenyn.
  const visaPaus = lage === "spelar";
  if (pausKnapp.hidden === visaPaus) pausKnapp.hidden = !visaPaus;
  const visaHem = lage !== "paus";
  if (hemKnapp.hidden === visaHem) hemKnapp.hidden = !visaHem;

  uppdateraHimmel();
  ctx.clearRect(0, 0, bredd, hojd);
  ctx.save();
  if (skakning > 0) ctx.translate((Math.random() - 0.5) * u * 0.3, (Math.random() - 0.5) * u * 0.3);
  ritaHimmel();
  ritaHus();
  ritaGata();
  ritaSaker();
  ritaKatt(skarmX(katt.x), skarmY(katt.h), u, katt);
  ritaTexter();
  ctx.restore();

  if (lage === "spelar" || lage === "paus") ritaPanel();
  ritaSkarmar();
}

// ---------- Spel-loopen: körs ungefär 60 gånger per sekund ----------

aterstallVarld();

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

// ---------- Trudilutten (bakgrundsmusik) ----------
//
//  Varje siffra är en ton (60 = mellersta C, 62 = D, 64 = E ...).
//  null betyder paus. Ändra siffrorna för att göra en egen melodi!

const MUSIK = {
  glad: {
    steg: 0.15, // Sekunder per ton – lägre = snabbare
    melodi: [72, null, 76, 79, 76, null, 72, 74, 76, null, 77, 76, 74, null, null, null,
             72, null, 76, 79, 81, null, 79, 76, 77, 76, 74, 71, 72, null, null, null],
    bas: [48, 55, 48, 55, 53, 60, 55, 50, 48, 55, 57, 52, 53, 55, 48, 48],
  },
  ond: {
    steg: 0.19,
    melodi: [69, null, 72, null, 71, null, 68, null, 69, null, 76, null, 75, null, null, null,
             69, null, 72, 74, 75, null, 74, 72, 71, null, 68, null, 69, null, null, null],
    bas: [45, 45, 52, 52, 44, 44, 52, 52, 45, 45, 48, 48, 44, 44, 45, 45],
  },
};

let musikPa = INSTALLNINGAR.musik && lasInstallning("musik-parkour") !== "av";
let musikSteg = 0;
let musikNastaTid = 0;
visaMusikKnapp();

function spelaNot(not, start, langd, typ, volym) {
  const ton = ljudmotor.createOscillator();
  const styrka = ljudmotor.createGain();
  ton.type = typ;
  ton.frequency.value = 440 * Math.pow(2, (not - 69) / 12);
  styrka.gain.setValueAtTime(0, start);
  styrka.gain.linearRampToValueAtTime(volym, start + 0.01);
  styrka.gain.exponentialRampToValueAtTime(0.001, start + langd);
  ton.connect(styrka);
  styrka.connect(ljudmotor.destination);
  ton.start(start);
  ton.stop(start + langd + 0.02);
}

// Lägger ut tonerna en liten bit i förväg så att musiken inte hackar
function schemalaggMusik() {
  if (!ljudmotor || !musikPa || lage !== "spelar") return;
  const latt = katt.ond ? MUSIK.ond : MUSIK.glad;
  const nu = ljudmotor.currentTime;
  if (musikNastaTid < nu) musikNastaTid = nu + 0.05;
  try {
    while (musikNastaTid < nu + 0.25) {
      const i = musikSteg % latt.melodi.length;
      const not = latt.melodi[i];
      if (not) spelaNot(not, musikNastaTid, latt.steg * 0.9, "square", 0.035);
      if (i % 2 === 0) {
        const bas = latt.bas[(i / 2) % latt.bas.length];
        if (bas) spelaNot(bas, musikNastaTid, latt.steg * 1.8, "triangle", 0.07);
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
    return Number(localStorage.getItem("rekord-parkour")) || 0;
  } catch (e) {
    return 0;
  }
}

function sparaRekord(varde) {
  try {
    localStorage.setItem("rekord-parkour", String(varde));
  } catch (e) {
    // Privat läge e.d. – rekordet sparas bara tills sidan laddas om
  }
}
