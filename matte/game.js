// =====================================================================
//  KATTEN GÖRANS MATTERESA
//
//  Göran har tappat sin guldbjällra. Följ honom på kartan och klara en
//  nivå i taget: 8 rätt ger 8 stjärnor, och man har 3 fiskar (liv).
//  Frågorna och nivåtrappan finns i fragor.js. Hela specifikationen
//  finns i SPEC.md.
//
//  Det mesta man vill ändra finns här högst upp: INSTALLNINGAR,
//  PLATSER (kartan) och REPLIKER (det Göran säger).
//
//  Testlänkar (resultaten kommer inte med på topplistan):
//    ?alder=9&niva=7   börjar direkt på en nivå
//    ?fro=42           samma frågor varje gång
//    ?test             visar det rätta svaret i ett hörn
// =====================================================================

const INSTALLNINGAR = {
  stjarnorForAttKlara: 8, // Så många rätt behövs för att klara en nivå
  fiskar: 3,              // Görans fiskar (liv)
  poangPerRatt: 10,       // Varje rätt svar ger så här mycket gånger nivån
  bonusPerNiva: 20,       // En klarad nivå ger så här mycket gånger nivån
  tidEfterRatt: 1.1,      // Sekunder innan nästa fråga kommer efter ett rätt svar
  sovEfter: 25,           // Sekunder utan tryck innan Göran somnar (bara på låtsas)
  musikTempo: 84,         // Den lugna musiken (slag per minut)
  lasUppTill: 8,          // Frågan läses upp av sig själv för barn upp till den här åldern
};

// Kartan: en ny plats för varje nivå. Har en ålder färre nivåer än 10
// hoppar kartan över några platser i mitten, men bröllopet och stolen
// är alltid sist.
const PLATSER = [
  { ikon: "🍽️", namn: t("Matskålen", "The food bowl"), sager: t("Jag börjar där jag oftast är.", "I'll start where I usually am."), farg: ["#fff6e5", "#ffe7c2"] },
  { ikon: "🧊", namn: t("Kylskåpet", "The fridge"), sager: t("Bjällran kan ha gömt sig bakom laxen. Jag måste kontrollera laxen. Noga.", "The bell might be hiding behind the salmon. I must check the salmon. Carefully."), farg: ["#eaf6ff", "#cfe9ff"] },
  { ikon: "🛋️", namn: t("Soffan", "The sofa"), sager: t("Under kuddarna hittar man allt. Utom bjällror, visar det sig.", "You find everything under the cushions. Except bells, it turns out."), farg: ["#fbeefe", "#efd5f7"] },
  { ikon: "🪟", namn: t("Fönsterbrädan", "The windowsill"), sager: t("Fåglarna kanske har sett något. De vägrar svara.", "The birds might have seen something. They refuse to answer."), farg: ["#eef7ff", "#d6eaff"] },
  { ikon: "🌷", namn: t("Trädgården", "The garden"), sager: t("Det luktar gräs. Jag är inte en utekatt, men jag gör ett undantag.", "It smells of grass. I'm not an outdoor cat, but I'll make an exception."), farg: ["#f0fbe8", "#d4f0c2"] },
  { ikon: "🐟", namn: t("Fisktorget", "The fish market"), sager: t("Jag letar bara efter bjällran. Att det luktar fisk är en slump.", "I'm only looking for the bell. The smell of fish is a coincidence."), farg: ["#e9fbf7", "#c7efe6"] },
  { ikon: "⚓", namn: t("Hamnen", "The harbour"), sager: t("Båtarna har mycket fisk. Det har inget med saken att göra.", "The boats have lots of fish. That has nothing to do with it."), farg: ["#e9f2ff", "#d3e4ff"] },
  { ikon: "📚", namn: t("Biblioteket", "The library"), sager: t("Här är det tyst. Perfekt för att tänka. Med ögonen stängda.", "It's quiet here. Perfect for thinking. With my eyes closed."), farg: ["#fbf3e6", "#f0dfc0"] },
  { ikon: "💒", namn: t("Bröllopsfesten", "The wedding party"), sager: t("Här var jag tärna. Kanske tappade jag den i tårtan. Jag måste kontrollera tårtan. Noga.", "I was a bridesmaid here. Maybe I dropped it in the cake. I must check the cake. Carefully."), farg: ["#fff0f4", "#ffd6e2"] },
  { ikon: "🪑", namn: t("Görans egen stol", "Gerald's own chair"), sager: t("Min egen stol. Här har jag inte letat. Jag har bara suttit.", "My own chair. I haven't looked here. I've only sat on it."), farg: ["#fff6e5", "#ffd9a0"] },
];

// Det Göran säger. Han säger aldrig samma sak två gånger i rad.
const REPLIKER = {
  ratt: [
    t("Kattenkelt!", "Purr-fectly simple!"), t("Purrfekt!", "Purrfect!"), t("Mjau-gnifikt!", "Meow-gnificent!"),
    t("Precis som jag tänkte. Ungefär.", "Just as I thought. Roughly."), t("Det där var värt en fiskpinne.", "That was worth a fish finger."),
    t("Jag skulle ha sagt samma sak. Efter en tupplur.", "I'd have said the same. After a nap."), t("Rätt! Morrhåren darrar av stolthet.", "Correct! My whiskers are trembling with pride."),
  ],
  iRad3: [t("Nu går det undan! Lugnt, jag är med.", "Now we're moving! Don't worry, I'm keeping up.")],
  iRad5: [t("Fem i rad! Det är lika mycket som fem fiskpinnar. Jag har räknat.", "Five in a row! That's as many as five fish fingers. I counted.")],
  fel: [
    t("Mjaa… nästan. Titta här.", "Meeow… almost. Look here."), t("Bra försök! Så här gör man.", "Good try! This is how it's done."),
    t("Det där var svårt. Jag fick också tänka länge.", "That was a hard one. I had to think for a while too."), t("Vi tittar tillsammans.", "Let's look together."),
  ],
  visa: [
    t("Jag har lyssnat på en podd om det här. Följ min tass. 🐾", "I've listened to a podcast about this. Follow my paw. 🐾"),
    t("Det här kan jag. Jag har läst baksidan av en bok om det.", "I know this. I've read the back of a book about it."),
    t("Följ min tass. 🐾", "Follow my paw. 🐾"),
  ],
  slutFiskar: [
    t("Även jag missar ibland. En gång missade jag en hel lax. Den låg på bordet.", "Even I miss sometimes. Once I missed a whole salmon. It was on the table."),
    t("Vi tar en paus och försöker igen. Jag tar en tupplur under tiden.", "Let's take a break and try again. I'll have a nap meanwhile."),
  ],
  klar: [
    t("Jag sa ju att du var ett geni. Jag sa det inte högt, men jag tänkte det.", "I told you you were a genius. I didn't say it out loud, but I thought it."),
    t("Purrfekt! Bjällran är inte här, men du är fantastisk.", "Purrfect! The bell isn't here, but you're fantastic."),
    t("Jag är så stolt att flugan sitter snett.", "I'm so proud my bow tie is crooked."),
  ],
  start: [
    t("Jag vilade bara ögonen. Det heter att tänka.", "I was only resting my eyes. It's called thinking."),
    t("Jag har lyssnat på en podd om algebra. Halva. Jag somnade.", "I listened to a podcast about algebra. Half of it. I fell asleep."),
    t("Jag har bokat in en tupplur klockan två. Och tre. Och fyra.", "I've booked a nap at two. And three. And four."),
    t("Jag har köpt ett gymkort. Jag har inte varit där, men jag tänker på det.", "I've bought a gym membership. I haven't been, but I think about it."),
  ],
};

// Kortare repliker för 5–7 år, som går att förstå utan att läsa så mycket
const REPLIKER_SMA = {
  ratt: [t("Kattenkelt! 🐾", "Easy-peasy! 🐾"), t("Purrfekt! ⭐", "Purrfect! ⭐"), t("Rätt! 😺", "Right! 😺"), t("Mjau-bra! 🎉", "Meow-great! 🎉")],
  iRad3: [t("Tre i rad! 🐟🐟🐟", "Three in a row! 🐟🐟🐟")],
  iRad5: [t("Fem i rad! ⭐", "Five in a row! ⭐")],
  fel: [t("Nästan! Titta här 👆", "Almost! Look here 👆"), t("Vi tittar tillsammans 👀", "Let's look together 👀")],
  visa: [t("Titta! 👀", "Look! 👀"), t("Följ min tass 🐾", "Follow my paw 🐾")],
};

// ---------- Göran, ritad med former ----------
//  lage: "vaken", "sover" eller "stolt". bjallra: guldbjällran sitter på bandet.

function goranSvg(lage = "vaken", bjallra = false) {
  const ogon = lage === "sover"
    ? '<path d="M70 92 q10 8 20 0 M110 92 q10 8 20 0" stroke="#2b1d0e" stroke-width="4" fill="none" stroke-linecap="round"/>'
    : lage === "stolt"
      ? '<path d="M70 96 q10 -10 20 0 M110 96 q10 -10 20 0" stroke="#2b1d0e" stroke-width="4" fill="none" stroke-linecap="round"/>'
      : '<circle cx="80" cy="94" r="7" fill="#2b1d0e"/><circle cx="120" cy="94" r="7" fill="#2b1d0e"/><circle cx="82" cy="92" r="2" fill="#fff"/><circle cx="122" cy="92" r="2" fill="#fff"/>';
  const glas = lage === "sover" ? "" : `
    <circle cx="80" cy="94" r="17" fill="rgba(255,255,255,.25)" stroke="#5a3a22" stroke-width="4"/>
    <circle cx="120" cy="94" r="17" fill="rgba(255,255,255,.25)" stroke="#5a3a22" stroke-width="4"/>
    <path d="M97 94 h6" stroke="#5a3a22" stroke-width="4"/>
    ${lage === "stolt" ? '<path d="M66 82 l6 6 M128 80 l5 -5" stroke="#fff" stroke-width="3"/>' : ""}`;
  const kudde = lage === "sover" ? '<ellipse cx="100" cy="182" rx="98" ry="22" fill="#b55d8a"/><ellipse cx="100" cy="176" rx="90" ry="16" fill="#d77fab"/>' : "";
  const zzz = lage === "sover" ? '<text x="150" y="40" font-size="26" font-weight="900" fill="#5a6b8c">Z z z</text>' : "";
  const lut = lage === "stolt" ? 'transform="rotate(-8 100 120)"' : "";
  const bjall = bjallra
    ? '<circle cx="100" cy="146" r="10" fill="#f2c230" stroke="#a37b0c" stroke-width="2.5"/><path d="M94 148 h12" stroke="#a37b0c" stroke-width="2.5"/><circle cx="100" cy="151" r="2" fill="#a37b0c"/>'
    : '<circle cx="100" cy="142" r="6" fill="none" stroke="#d4af37" stroke-width="2" stroke-dasharray="3 3"/>';
  return `<svg viewBox="0 0 200 200" aria-hidden="true">${kudde}
    <g ${lut}>
    <path d="M150 160 q45 -10 30 -60" stroke="#e8a96e" stroke-width="14" fill="none" stroke-linecap="round"/>
    <ellipse cx="100" cy="148" rx="62" ry="40" fill="#f5cba7" stroke="#c98b56" stroke-width="3"/>
    <ellipse cx="100" cy="156" rx="34" ry="22" fill="#fde6d2"/>
    <path d="M58 70 L64 34 L88 58 Z M142 70 L136 34 L112 58 Z" fill="#f5cba7" stroke="#c98b56" stroke-width="3" stroke-linejoin="round"/>
    <path d="M66 62 L68 44 L80 58 Z M134 62 L132 44 L120 58 Z" fill="#f2a3a3"/>
    <circle cx="100" cy="96" r="46" fill="#f5cba7" stroke="#c98b56" stroke-width="3"/>
    <path d="M84 66 q4 -8 8 0 M96 64 q4 -8 8 0 M108 66 q4 -8 8 0" stroke="#e0a370" stroke-width="3" fill="none"/>
    ${ogon}${glas}
    <path d="M95 110 l5 5 l5 -5 z" fill="#e27a8a"/>
    <path d="M100 115 q-6 8 -12 4 M100 115 q6 8 12 4" stroke="#2b1d0e" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <path d="M60 108 h-26 M60 114 l-24 6 M140 108 h26 M140 114 l24 6" stroke="#8a6a4a" stroke-width="2"/>
    <path d="M70 136 q30 10 60 0" stroke="#d4af37" stroke-width="6" fill="none"/>
    ${bjall}
    <path d="M100 132 l-18 -10 v20 z M100 132 l18 -10 v20 z" fill="#d23b4b" stroke="#8a1f2b" stroke-width="2"/>
    <circle cx="100" cy="132" r="5" fill="#a8293a"/>
    </g>${zzz}</svg>`;
}

// ---------- Hjälpfunktioner ----------

const F = window.Fragor;
const params = new URLSearchParams(location.search);
const TESTLAGE = params.has("test") || params.has("alder") || params.has("fro");
const scen = document.getElementById("scen");
const pausKnapp = document.getElementById("paus");
const pausmeny = document.getElementById("pausmeny");
const TOPPLISTA_ID = { 5: "mattefem", 6: "mattesex", 7: "mattesju", 8: "matteatta", 9: "mattenio", 10: "mattetio", 11: "matteelva", 12: "mattetolv" };

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const tal = (x) => F.tal(x);

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
    // Privat läge e.d. – gäller tills sidan laddas om
  }
}

const senastSagt = {};
function replik(sort) {
  const lista = (S.alder <= 7 && REPLIKER_SMA[sort]) || REPLIKER[sort];
  let r;
  do r = lista[Math.floor(Math.random() * lista.length)];
  while (lista.length > 1 && r === senastSagt[sort]);
  senastSagt[sort] = r;
  return r;
}

function skapa(html) {
  const mall = document.createElement("template");
  mall.innerHTML = html.trim();
  return mall.content.firstElementChild;
}

// Ett bråk som "3/4" skrivs med täljaren ovanför nämnaren
function brakHtml(b) {
  const [a, c] = String(b).split("/");
  return `<span class="brak"><span>${esc(a)}</span><span>${esc(c)}</span></span>`;
}

// ---------- Scenen skalas så att den fyller skärmen ----------

let staende = false;
function anpassaScen() {
  const b = window.innerWidth, h = window.innerHeight;
  staende = h > b * 1.1;
  const sb = staende ? 768 : 1024, sh = staende ? 1024 : 768;
  const skala = Math.min(b / sb, h / sh);
  scen.style.width = sb + "px";
  scen.style.height = sh + "px";
  scen.style.transform = `scale(${skala}) translate(-50%, -50%)`;
  // Hus- och pausknappen ligger utanför scenen och skalas inte. Stjärnorna börjar till höger om dem.
  scen.style.setProperty("--vanster", Math.max(150, Math.round(140 / skala)) + "px");
  scen.classList.toggle("staende", staende);
}
window.addEventListener("resize", () => {
  const fore = staende;
  anpassaScen();
  if (fore !== staende && ritaOm) ritaOm();
});
anpassaScen();
let ritaOm = null; // Ritar den aktuella skärmen igen (när skärmen vrids)

// ---------- Ljud (skapas med kod) ----------

let ljud = null;
let ljudPa = lasInstallning("matte-ljud") !== "av";
function startaLjud() {
  try {
    if (!ljud) ljud = new (window.AudioContext || window.webkitAudioContext)();
    if (window.Musik) {
      Musik.lasUpp(ljud);
      Musik.tempo(INSTALLNINGAR.musikTempo);
      Musik.starta(ljud);
      Musik.paus(!pausmeny.hidden);
    } else if (ljud.state === "suspended") ljud.resume();
  } catch (e) {
    ljud = null;
  }
}

function ton(frekvens, start, langd, { typ = "sine", volym = 0.18, till = null } = {}) {
  if (!ljud || !ljudPa) return;
  try {
    const t0 = ljud.currentTime + start;
    const o = ljud.createOscillator();
    const g = ljud.createGain();
    o.type = typ;
    o.frequency.setValueAtTime(frekvens, t0);
    if (till) o.frequency.exponentialRampToValueAtTime(till, t0 + langd);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(volym, t0 + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + langd);
    o.connect(g);
    g.connect(ljud.destination);
    o.start(t0);
    o.stop(t0 + langd + 0.05);
  } catch (e) {
    // Inget ljud – spelet fungerar ändå
  }
}

const DUR = [0, 2, 4, 5, 7, 9, 11, 12, 14];
const LJUD = {
  // Plinget blir en ton högre för varje rätt i rad
  ratt(iRad) {
    const f = 880 * Math.pow(2, DUR[Math.min(iRad, DUR.length) - 1] / 12);
    ton(f, 0, 0.18);
    ton(f * 2, 0.0, 0.12, { volym: 0.05 });
  },
  fel() {
    ton(220, 0, 0.35, { volym: 0.14, till: 180 });
  },
  blubb() {
    ton(500, 0.15, 0.12, { volym: 0.08, till: 900 });
  },
  klick() {
    ton(1200, 0, 0.03, { volym: 0.04, typ: "triangle" });
  },
  fanfar() {
    [523, 659, 784, 1047].forEach((f, i) => ton(f, i * 0.14, 0.25, { typ: "triangle", volym: 0.16 }));
    [523, 659, 784].forEach((f) => ton(f, 0.6, 1.0, { typ: "triangle", volym: 0.09 }));
  },
  bjallra() {
    [0, 0.35, 0.7].forEach((s) => {
      ton(1568, s, 1.2, { volym: 0.12 });
      ton(2093, s, 0.9, { volym: 0.06 });
    });
  },
};

// ---------- Bilderna till frågorna ----------
//  Varje bild i fragor.js har en typ. Här ritas den som HTML eller SVG.

const BILDER = {
  saker(b) {
    const alla = [];
    let nr = 0;
    b.grupper.forEach((g, gi) => {
      if (g.lada) return alla.push({ lada: true, grupp: gi });
      for (let i = 0; i < g.antal; i++) {
        const raknas = !g.overstruken;
        if (raknas) nr++;
        alla.push({ sak: g.sak, farg: g.farg, struken: g.overstruken, nr: raknas ? nr : null, grupp: gi });
      }
    });
    const n = alla.length;
    let storlek = n <= 5 ? 64 : n <= 10 ? 52 : n <= 16 ? 42 : n <= 24 ? 34 : 28;
    if (b.liten) storlek = Math.round(storlek * 0.55);
    const sak = (s) => s.lada
      ? `<span class="sak lada" style="font-size:${storlek * 1.4}px">🎁<b>?</b></span>`
      : `<span class="sak${s.farg ? " farg" : ""}${s.struken ? " struken" : ""}" style="font-size:${storlek}px">${s.sak}${b.numrera && s.nr ? `<i data-steg="${s.nr - 1}">${s.nr}</i>` : ""}</span>`;
    const under = b.under ? `<div class="under">${esc(b.under)}</div>` : "";

    if ((b.layout === "tarning" || b.layout === "spritt") && b.grupper.length === 1) {
      // Prickar som på en tärning, eller utspridda
      const sida = b.liten ? 150 : 300;
      const pos = b.layout === "tarning" ? tarningsPrickar(n) : spridda(n, b.grupper[0].antal * 7 + 3);
      return `<div class="saker-ruta" style="width:${sida}px;height:${sida}px">${alla.map((s, i) => `<span class="pos" style="left:${pos[i][0] * 100}%;top:${pos[i][1] * 100}%">${sak(s)}</span>`).join("")}</div>${under}`;
    }
    if (b.layout === "pase") return `<div class="pase">${alla.map(sak).join("")}</div>${under}`;
    if (b.layout === "grupper" || b.layout === "spegel") {
      const grupper = b.grupper.map((g, gi) => `<div class="sakgrupp">${alla.filter((s) => s.grupp === gi).map(sak).join("")}</div>`);
      const mellan = b.layout === "spegel" ? '<div class="spegellinje"></div>' : b.tecken ? `<div class="tecken">${b.tecken}</div>` : "";
      return `<div class="sakgrupper${b.layout === "spegel" ? " spegel" : ""}${b.tecken ? " med-tecken" : ""}">${grupper.join(mellan)}</div>${under}`;
    }
    return `<div class="sakrad">${alla.map(sak).join("")}</div>${under}`;
  },

  jamforRader(b) {
    return `<div class="jamfor">${b.rader.map((r, i) => `<div class="jamforrad${r.markera ? " markerad" : ""}" data-steg="${i}">${`<span>${r.sak}</span>`.repeat(r.antal)}<b>${r.antal}</b></div>`).join("")}</div>`;
  },

  tioruta(b) {
    let html = "";
    for (let i = 0; i < 10; i++) {
      const fylld = i < b.fyllda;
      html += `<span class="tiocell${!fylld && b.tomma ? " tomcell" : ""}">${fylld ? b.sak : b.tomma ? `<i data-steg="${i - b.fyllda}">${i - b.fyllda + 1}</i>` : ""}</span>`;
    }
    return `<div class="tioruta">${html}</div>`;
  },

  rad(b) {
    const delar = [];
    b.rutor.forEach((v, i) => {
      if (i > 0 && b.pilar) delar.push(`<span class="pil" data-steg="${i - 1}"><small>${esc(b.pilar[i - 1] || "")}</small>➜</span>`);
      if (i > 0 && b.grupp && i % b.grupp === 0) delar.push('<span class="avdelare"></span>');
      const markerad = b.markera === i || (b.markeraVarde !== undefined && v === b.markeraVarde);
      const steg = markerad ? ` data-steg="${b.pilar ? b.pilar.length : 0}"` : "";
      delar.push(`<span class="rruta${b.stenar ? " sten" : ""}${b.emoji ? " emojiruta" : ""}${markerad ? " markerad" : ""}${v === "?" ? " fraga" : ""}"${steg}>${esc(v)}</span>`);
    });
    return `<div class="radbild${b.rutor.length > 6 ? " tat" : ""}">${delar.join("")}</div>`;
  },

  tallinje(b) {
    // Få streck: en kortare linje som inte behöver krympas lika mycket bredvid knappsatsen
    const antalStreck = b.delar || (b.utanStreck ? 0 : Math.round((b.till - b.fran) / b.steg));
    const B = antalStreck && antalStreck <= 16 ? 660 : 860, X0 = 40, X1 = B - 40, Y = 110;
    const textStorlek = B < 860 ? 32 : 28;
    const x = (v) => X0 + ((v - b.fran) / (b.till - b.fran)) * (X1 - X0);
    let s = "";
    // Linjen (termometern är blå under noll och röd över)
    if (b.termometer && b.fran < 0 && b.till > 0) {
      s += `<line x1="${X0 - 10}" y1="${Y}" x2="${x(0)}" y2="${Y}" stroke="#3d8be0" stroke-width="8" stroke-linecap="round"/>`;
      s += `<line x1="${x(0)}" y1="${Y}" x2="${X1 + 10}" y2="${Y}" stroke="#e0533d" stroke-width="8" stroke-linecap="round"/>`;
    } else s += `<line x1="${X0 - 10}" y1="${Y}" x2="${X1 + 10}" y2="${Y}" stroke="#2b1d0e" stroke-width="5" stroke-linecap="round"/>`;
    // Strecken och siffrorna
    const streck = [];
    if (b.delar) for (let k = 0; k <= b.delar; k++) streck.push(k / b.delar);
    else if (!b.utanStreck) {
      const n = Math.round((b.till - b.fran) / b.steg);
      for (let k = 0; k <= n && k <= 200; k++) streck.push(F.runda(b.fran + k * b.steg));
    }
    const etikett = b.etikett || (streck.length <= 13 ? b.steg : b.steg * 5);
    const medSiffra = new Set(); // Värden som redan har en siffra under linjen
    const harEtikett = (v, k) => b.etiketter === "alla" || (b.delar ? k === 0 || k === b.delar : Math.abs(v / etikett - Math.round(v / etikett)) < 1e-6);
    streck.forEach((v, k) => {
      const lang = harEtikett(v, k);
      s += `<line x1="${x(v)}" y1="${Y - (lang ? 18 : 11)}" x2="${x(v)}" y2="${Y + (lang ? 18 : 11)}" stroke="#2b1d0e" stroke-width="${lang ? 4 : 2.5}"/>`;
      const vidPil = b.visaPil && b.pil !== undefined && Math.abs(v - b.pil) < 1e-9;
      if (vidPil) return; // Under pilen står svaret i grönt i stället
      if (b.brakEtiketter && b.delar) s += `<text x="${x(v)}" y="${Y + 50}" font-size="24" text-anchor="middle" font-weight="800">${k === 0 ? 0 : k === b.delar ? 1 : k + "/" + b.delar}</text>`;
      else if (lang) {
        medSiffra.add(F.runda(v));
        const farg = b.hopp && F.runda(v) === F.runda(b.hopp[1]) ? "#2e9e4f" : b.hopp && F.runda(v) === F.runda(b.hopp[0]) ? "#d0702a" : "#2b1d0e";
        s += `<text x="${x(v)}" y="${Y + 52}" font-size="${textStorlek}" text-anchor="middle" font-weight="800" fill="${farg}">${tal(v)}</text>`;
      }
    });
    if (b.utanStreck) {
      for (const v of [b.fran, b.till]) s += `<line x1="${x(v)}" y1="${Y - 14}" x2="${x(v)}" y2="${Y + 14}" stroke="#2b1d0e" stroke-width="4"/><text x="${x(v)}" y="${Y + 50}" font-size="26" text-anchor="middle" font-weight="700" opacity=".6">${tal(v)}</text>`;
    }
    // Hopp: en båge, eller en båge per steg
    const bage = (a, c, text, farg = "#3d8be0") => {
      const h = Math.min(70, 20 + Math.abs(x(c) - x(a)) / 3);
      return `<path d="M${x(a)} ${Y - 14} Q${(x(a) + x(c)) / 2} ${Y - 14 - h * 1.6} ${x(c)} ${Y - 14}" stroke="${farg}" stroke-width="4" fill="none"/>` +
        `<path d="M${x(c)} ${Y - 14} l${x(c) > x(a) ? -10 : 10} -8 M${x(c)} ${Y - 14} l${x(c) > x(a) ? -2 : 2} -12" stroke="${farg}" stroke-width="4" fill="none"/>` +
        (text ? `<text x="${(x(a) + x(c)) / 2}" y="${Y - 20 - h * 0.8}" font-size="24" text-anchor="middle" font-weight="800" fill="${farg}">${esc(text)}</text>` : "");
    };
    let hopp = 0; // Hoppen visas ett i taget
    if (b.hopp) {
      const [a, c] = b.hopp;
      if (b.enHoppPerSteg) {
        const st = c > a ? 1 : -1;
        for (let v = a; v !== c; v += st) s += `<g data-steg="${hopp++}">${bage(v, v + st, st > 0 ? "+1" : "−1")}</g>`;
      } else s += `<g data-steg="${hopp++}">${bage(a, c, b.hoppText || "")}</g>`;
      s += punkt(x(a), Y, "#d0702a", tal(a), !medSiffra.has(F.runda(a)));
      s += `<g data-steg="${hopp}">${punkt(x(c), Y, "#2e9e4f", tal(c), !medSiffra.has(F.runda(c)))}</g>`;
    }
    if (b.hoppFran !== undefined && b.pil !== undefined && b.hoppFran !== b.pil) {
      const st = b.steg;
      let nr = 0;
      for (let v = b.hoppFran; v < b.pil - 1e-9 && nr++ < 30; v = F.runda(v + st)) s += `<g data-steg="${hopp++}">${bage(v, F.runda(v + st), "+" + tal(st), "#3d8be0")}</g>`;
    }
    if (b.prickar) {
      const sorterade = [...b.prickar].sort((a, c) => a - c);
      sorterade.forEach((v, i) => {
        const nara = sorterade.some((w) => w !== v && Math.abs(x(w) - x(v)) < 110);
        const ovanfor = !nara || i % 2 === 0;
        const ty = ovanfor ? Y - 28 : Y + 56;
        if (v === b.markera) s += `<g data-steg="0"><circle cx="${x(v)}" cy="${Y}" r="15" fill="#2e9e4f" stroke="#2b1d0e" stroke-width="2"/><text x="${x(v)}" y="${ty}" font-size="36" text-anchor="middle" font-weight="900" fill="#2e9e4f">✔ ${tal(v)}</text></g>`;
        else s += `<circle cx="${x(v)}" cy="${Y}" r="10" fill="#3d8be0" stroke="#2b1d0e" stroke-width="2"/><text x="${x(v)}" y="${ty}" font-size="30" text-anchor="middle" font-weight="900" fill="#3d8be0">${tal(v)}</text>`;
      });
    }
    if (b.pil !== undefined) {
      s += `<path d="M${x(b.pil)} ${Y - 20} l-18 -32 h36 z" fill="#e0533d" stroke="#2b1d0e" stroke-width="2.5"/>`;
      if (b.visaPil) {
        const text = b.delar ? Math.round(b.pil * b.delar) + "/" + b.delar : tal(b.pil);
        s += `<text x="${x(b.pil)}" y="${Y + 84}" font-size="32" text-anchor="middle" font-weight="900" fill="#2e9e4f" data-steg="${hopp}">${text}</text>`;
      }
    }
    return `<svg class="tallinje" viewBox="0 0 ${B} 200" width="${B}" height="200">${s}</svg>`;

    function punkt(px, py, farg, text, visaText, ovanfor) {
      return `<circle cx="${px}" cy="${py}" r="10" fill="${farg}" stroke="#2b1d0e" stroke-width="2"/>` +
        (visaText ? `<text x="${px}" y="${ovanfor ? py - 26 : py + 50}" font-size="30" text-anchor="middle" font-weight="900" fill="${farg}">${text}</text>` : "");
    }
  },

  buntar(b) {
    const delar = [];
    const grupp = (antal, rita, varde) => {
      if (!antal) return;
      delar.push(`<div class="buntgrupp"><div class="buntar">${Array.from({ length: antal }, rita).join("")}</div>${b.visaTal ? `<b data-steg="${delar.length}">${tal(antal * varde)}</b>` : ""}</div>`);
    };
    grupp(b.tusental, () => '<span class="tusen">1000</span>', 1000);
    grupp(b.hundratal, () => '<span class="hundra"></span>', 100);
    grupp(b.tiotal, () => '<span class="tia"></span>', 10);
    grupp(b.ental, () => '<span class="etta"></span>', 1);
    const summa = b.tusental * 1000 + b.hundratal * 100 + b.tiotal * 10 + b.ental;
    const termer = [b.tusental * 1000, b.hundratal * 100, b.tiotal * 10, b.ental].filter((v) => v > 0);
    return `<div class="buntbild">${delar.join("")}</div>${b.visaTal ? `<div class="under" data-steg="${delar.length}">${termer.map(tal).join(" + ")} = ${tal(summa)}</div>` : ""}`;
  },

  grupper(b) {
    const fisk = b.antal * b.per <= 40;
    let summa = 0;
    const skalar = Array.from({ length: b.antal }, (_, i) => {
      summa += b.per;
      const innehall = fisk ? "<span>🐟</span>".repeat(b.per) : '<i class="prick"></i>'.repeat(b.per);
      return `<div class="skal"${b.numrera ? ` data-steg="${i}"` : ""}><div class="skalinne${fisk ? "" : " prickar"}" style="${skalKolumner(b.per)}">${innehall}</div>${b.numrera ? `<b>${summa}</b>` : ""}</div>`;
    });
    return `<div class="skalar${b.antal > 5 ? " tva-rader" : ""}">${skalar.join("")}</div>`;
  },

  dela(b) {
    if (b.utdelat) {
      const takt = Math.max(1, Math.floor((b.utdelat * b.katter) / 16)); // Många fiskar: några i taget
      return `<div class="dela">${Array.from({ length: b.katter }, (_, k) => `<div class="delkatt"><span>🐱</span><div>${Array.from({ length: b.utdelat }, (_, j) => `<span data-steg="${Math.floor((j * b.katter + k) / takt)}">🐟</span>`).join("")}</div><b data-steg="${Math.ceil((b.utdelat * b.katter) / takt)}">${b.utdelat}</b></div>`).join("")}</div>`;
    }
    return `<div class="delabild"><div class="sakrad">${'<span class="sak" style="font-size:30px">🐟</span>'.repeat(b.fiskar)}</div><div class="sakrad">${'<span class="sak" style="font-size:44px">🐱</span>'.repeat(b.katter)}</div></div>`;
  },

  pizza(b) {
    const r = b.liten ? 62 : 110, c = r + 6;
    let s = `<circle cx="${c}" cy="${c}" r="${r}" fill="#ffe1a0" stroke="#c98b56" stroke-width="5"/>`;
    for (let k = 0; k < b.delar; k++) {
      const v1 = (k / b.delar) * 2 * Math.PI - Math.PI / 2, v2 = ((k + 1) / b.delar) * 2 * Math.PI - Math.PI / 2;
      const stor = b.delar === 1 ? 1 : 0;
      const p = `M${c} ${c} L${c + r * Math.cos(v1)} ${c + r * Math.sin(v1)} A${r} ${r} 0 ${stor} 1 ${c + r * Math.cos(v2)} ${c + r * Math.sin(v2)} Z`;
      const vm = (v1 + v2) / 2;
      if (b.numrera) s += `<path d="${p}" fill="#ffe1a0" stroke="#8a4b1f" stroke-width="3"/>`; // Bitarna fylls i en i taget ovanpå
      let bit = `<path d="${p}" fill="${k < b.markerade ? "#e8743b" : "#ffe1a0"}" stroke="#8a4b1f" stroke-width="3"/>`;
      if (k < b.markerade) bit += `<circle cx="${c + r * 0.6 * Math.cos(vm)}" cy="${c + r * 0.6 * Math.sin(vm)}" r="${r * 0.1}" fill="#b3261e"/>`;
      if (b.numrera && k < b.markerade) bit += `<text x="${c + r * 0.35 * Math.cos(vm)}" y="${c + r * 0.35 * Math.sin(vm) + 9}" font-size="26" font-weight="900" text-anchor="middle" fill="#fff">${k + 1}</text>`;
      if (b.numrera && k >= b.markerade) bit = "";
      s += b.numrera && k < b.markerade ? `<g data-steg="${k}">${bit}</g>` : bit;
    }
    const svg = `<svg viewBox="0 0 ${2 * c} ${2 * c}" width="${2 * c}" height="${2 * c}">${s}</svg>`;
    if (!b.brak) return svg;
    const [k, n] = b.brak.split("/");
    return `<div class="pizzarad">${svg}<div class="under" data-steg="${k}">${t(`${k} av ${n} bitar =`, `${k} of ${n} slices =`)} ${brakHtml(b.brak)}</div></div>`;
  },

  brakGrupper(b) {
    // Bara i felbilden står det hur många det är i varje skål
    const visa = b.markerade > 0;
    const grupper = Array.from({ length: b.delar }, (_, i) => `<div class="skal${i < b.markerade ? " vald" : ""}"${i < b.markerade ? ` data-steg="${i}"` : ""}><div class="skalinne" style="${skalKolumner(Math.min(b.per, 12))}">${"<span>🐟</span>".repeat(Math.min(b.per, 12))}${b.per > 12 ? "…" : ""}</div>${visa ? `<b>${b.per}</b>` : ""}</div>`);
    return `<div class="skalar${b.delar > 5 ? " tva-rader" : ""}">${grupper.join("")}</div>${b.markerade > 1 ? `<div class="under" data-steg="${b.markerade}">${b.markerade} · ${b.per} = ${b.markerade * b.per}</div>` : ""}`;
  },

  rader(b) {
    return `${b.staplar ? BILDER.staplar(b.staplar) : ""}<div class="rader">${b.rader.map((r, i) => `<div data-steg="${i}">${esc(r)}</div>`).join("")}</div>`;
  },

  rutnat(b) {
    let s = "";
    for (let i = 0; i < 100; i++) {
      const rad = Math.floor(i / 10), kol = i % 10;
      s += `<rect x="${kol * 26 + 2}" y="${rad * 26 + 2}" width="24" height="24" rx="3" fill="${i < b.fyllda ? "#ffd95e" : "#fff"}" stroke="#2b1d0e" stroke-width="1.5"/>`;
    }
    if (b.raknaRader) {
      for (let rad = 0; rad * 10 < b.fyllda; rad++) {
        const varde = Math.min(b.fyllda, (rad + 1) * 10);
        s += `<text x="${266}" y="${rad * 26 + 21}" font-size="18" font-weight="800" data-steg="${rad}">${varde}</text>`;
      }
    }
    const svg = `<svg viewBox="0 0 ${b.raknaRader ? 300 : 264} 264" width="${b.raknaRader ? 300 : 264}" height="264">${s}</svg>`;
    if (!b.under) return svg;
    return `<div class="pizzarad">${svg}<div class="under">${brakHtml(b.under[0])} = ${esc(b.under[1])} = ${esc(b.under[2])}</div></div>`;
  },

  stapel(b) {
    const B = 560, del = B / b.delar;
    let s = "";
    for (let i = 0; i < b.delar; i++) {
      s += `<rect x="${i * del + 2}" y="2" width="${del}" height="64" fill="${i < b.markerade ? "#ffd95e" : "#fff"}" stroke="#2b1d0e" stroke-width="3"/>`;
      const text = b.visaVarden ? (b.delar <= 10 || i < b.markerade ? tal(b.hel / b.delar) : "") : i < b.markerade && b.delar <= 10 ? "?" : "";
      if (text) s += `<text${b.visaVarden && i < b.markerade ? ` data-steg="${i}"` : ""} x="${i * del + del / 2 + 2}" y="44" font-size="${b.delar > 10 ? 14 : 24}" font-weight="800" text-anchor="middle">${text}</text>`;
    }
    s += `<path d="M2 80 v10 h${B} v-10" stroke="#2b1d0e" stroke-width="3" fill="none"/><text x="${B / 2}" y="120" font-size="28" font-weight="900" text-anchor="middle">${tal(b.hel)}</text>`;
    return `<svg viewBox="0 0 ${B + 6} 130" width="${B + 6}" height="130">${s}</svg>${b.visaVarden && b.markerade > 1 ? `<div class="under">${b.markerade} · ${tal(b.hel / b.delar)} = ${tal((b.markerade * b.hel) / b.delar)}</div>` : ""}`;
  },

  vag(b) {
    const sida = (s) => `${'<span class="lada-x">x</span>'.repeat(s.lador)}${s.fiskar ? `<span class="fiskar">${s.lador ? "+ " : ""}${s.fiskar} 🐟</span>` : ""}`;
    return `<div class="vag"><div class="vagskal">${sida(b.vanster)}</div><div class="vagmitt">⚖️</div><div class="vagskal">${sida(b.hoger)}</div></div>`;
  },

  recept(b) {
    return `<div class="recept">${b.rader.map((r, i) => `<div class="receptrad${b.markera === i ? " markerad" : ""}" data-steg="${i}"><span>🐟 ${esc(String(r[0]))}</span><span>➜</span><span>🐱 ${esc(String(r[1]))}</span></div>`).join("")}</div>`;
  },

  staplar(b) {
    const max = Math.max(...b.varden), H = 170, B = 70;
    let s = "";
    b.varden.forEach((v, i) => {
      const h = (v / max) * H;
      s += `<rect x="${i * (B + 18) + 10}" y="${H - h + 30}" width="${B}" height="${h}" rx="6" fill="#7fc3f0" stroke="#2b1d0e" stroke-width="3"/>`;
      s += `<text x="${i * (B + 18) + 10 + B / 2}" y="${H - h + 22}" font-size="26" font-weight="900" text-anchor="middle">${v}</text>`;
      s += `<text x="${i * (B + 18) + 10 + B / 2}" y="${H + 62}" font-size="30" text-anchor="middle">🐱</text>`;
    });
    if (b.linje) s += `<line x1="0" x2="${b.varden.length * (B + 18) + 10}" y1="${H - (b.linje / max) * H + 30}" y2="${H - (b.linje / max) * H + 30}" stroke="#2e9e4f" stroke-width="4" stroke-dasharray="10 6" data-steg="0"/>`;
    const w = b.varden.length * (B + 18) + 14;
    return `<svg viewBox="0 0 ${w} ${H + 72}" width="${w}" height="${H + 72}">${s}</svg>`;
  },

  emoji(b) {
    return `<div class="emojibild">${esc(b.text)}</div>`;
  },
};

// Fiskarna i en skål ligger i jämna rader: 6 blir 3 + 3, 10 blir 5 + 5
function skalKolumner(antal) {
  const kolumner = antal <= 3 ? antal : antal <= 10 ? Math.ceil(antal / 2) : Math.ceil(antal / 3);
  return `grid-template-columns: repeat(${kolumner}, auto)`;
}

function ritaBild(b) {
  if (!b) return "";
  const rita = BILDER[b.typ];
  return rita ? rita(b) : "";
}

function tarningsPrickar(n) {
  const T = {
    1: [[0.5, 0.5]], 2: [[0.25, 0.25], [0.75, 0.75]], 3: [[0.2, 0.2], [0.5, 0.5], [0.8, 0.8]],
    4: [[0.25, 0.25], [0.75, 0.25], [0.25, 0.75], [0.75, 0.75]], 5: [[0.2, 0.2], [0.8, 0.2], [0.5, 0.5], [0.2, 0.8], [0.8, 0.8]],
    6: [[0.25, 0.18], [0.75, 0.18], [0.25, 0.5], [0.75, 0.5], [0.25, 0.82], [0.75, 0.82]],
  };
  if (T[n]) return T[n];
  // Fler än sex: två tärningsmönster bredvid varandra
  const a = Math.ceil(n / 2), b = n - a;
  return [...T[a].map(([x, y]) => [x * 0.5, y]), ...T[b].map(([x, y]) => [0.5 + x * 0.5, y])];
}

function spridda(n, fro) {
  const s = F.skapaSlump(fro);
  const sida = Math.ceil(Math.sqrt(n * 1.6));
  const rutor = s.blanda(Array.from({ length: sida * sida }, (_, i) => i)).slice(0, n);
  return rutor.map((r) => [((r % sida) + 0.5 + (s() - 0.5) * 0.4) / sida, (Math.floor(r / sida) + 0.5 + (s() - 0.5) * 0.4) / sida]);
}

// ---------- Rösten: läser upp frågan ----------
//  Webbläsarens egen talsyntes (svensk eller engelsk röst). För de yngsta
//  (upp till INSTALLNINGAR.lasUppTill år) läses frågan upp av sig själv,
//  och alla kan trycka på 🔊. Finns ingen röst på enheten syns ingen 🔊.

let rost = null;
let rostPa = lasInstallning("matte-rost") !== "av";
function hittaRost() {
  if (!("speechSynthesis" in window)) return;
  const roster = speechSynthesis.getVoices();
  const sprak = SPRAK === "sv" ? /^sv/i : /^en/i;
  const passande = roster.filter((v) => sprak.test(v.lang));
  // Helst en lokal röst (fungerar utan internet)
  rost = passande.find((v) => v.localService) || passande[0] || null;
}
if ("speechSynthesis" in window) {
  hittaRost();
  speechSynthesis.addEventListener?.("voiceschanged", () => {
    hittaRost();
    if (lage === "fraga") document.querySelectorAll(".lasknapp").forEach((b) => (b.hidden = !rost));
  });
}

function prata(text) {
  if (!rost || !text) return;
  try {
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = rost.lang;
    try {
      u.voice = rost;
    } catch (e) {
      // Rösten går inte att välja – då används språket
    }
    u.rate = 0.9;
    speechSynthesis.speak(u);
  } catch (e) {
    // Ingen röst – spelet fungerar ändå
  }
}
function tystna() {
  try {
    if ("speechSynthesis" in window) speechSynthesis.cancel();
  } catch (e) {
    // ingenting att tysta
  }
}

// Bråk med ord: "tre fjärdedelar", "three quarters"
function brakOrd(b) {
  const [k, n] = String(b).split("/").map(Number);
  if (SPRAK === "sv") {
    if (n === 2) return k === 1 ? "en halv" : k + " halvor";
    const del = { 3: "tredjedel", 4: "fjärdedel", 5: "femtedel", 6: "sjättedel", 7: "sjundedel", 8: "åttondel", 9: "niondel", 10: "tiondel", 100: "hundradel" }[n] || n + "-del";
    return k === 1 ? "en " + del : k + " " + del + "ar";
  }
  const del = { 2: "half", 3: "third", 4: "quarter", 5: "fifth", 6: "sixth", 7: "seventh", 8: "eighth", 9: "ninth", 10: "tenth", 100: "hundredth" }[n] || n + "th";
  return k === 1 ? "one " + del : k + " " + (del === "half" ? "halves" : del + "s");
}

// Räknesätten med ord
function ordFor(text) {
  return String(text)
    .replace(/½ av|½ of/g, t("hälften av", "half of"))
    .replace(/(\d+)\/(\d+)/g, (m) => brakOrd(m))
    .replace(/ \+ /g, t(" plus ", " plus "))
    .replace(/ − /g, t(" minus ", " minus "))
    .replace(/−/g, t("minus ", "minus "))
    .replace(/ · /g, t(" gånger ", " times "))
    .replace(/ \/ /g, t(" delat med ", " divided by "))
    .replace(/(\d)x/g, "$1 x")
    .replace(/%/g, t("procent", "percent"));
}

// Det som läses upp för en fråga
function lasText(q) {
  const ra = (q.text || "").trim();
  // Uttryck som "3 + 2 = ?": "Vad blir 3 plus 2?"
  const vadBlir = () => {
    if (/= \?$/.test(ra)) return t("Vad blir ", "What is ") + ordFor(ra.replace(/ = \?$/, "")) + "?";
    // "6 + ? = 10": "6 plus hur många blir 10?"
    const mening = ordFor(ra.replace("?", t("hur många", "what")).replace(" = ", t(" blir ", " makes "))) + "?";
    return mening.charAt(0).toUpperCase() + mening.slice(1);
  };
  switch (q.typ) {
    case "rakna": return t("Hur många är det? Räkna!", "How many are there? Count!");
    case "flest": return ra.startsWith("⬆️") ? t("Vilken tallrik har flest?", "Which plate has the most?") : t("Vilken tallrik har minst?", "Which plate has the fewest?");
    case "siffraAntal": return t(`Vilken bild har ${q.svar} stycken?`, `Which picture has ${q.svar} things?`);
    case "talrad": return t("Vilket tal saknas?", "Which number is missing?");
    case "monster": return t("Vad kommer sedan?", "What comes next?");
    case "delHelhet": return t(`Det är ${q.text.split("= ")[1]} möss. Hur många gömmer sig i lådan?`, `There are ${q.text.split("= ")[1]} mice. How many are hiding in the box?`);
    case "tiokamrat": return t("Hur många fattas för att det ska bli tio?", "How many more to make ten?");
    case "jamforTal": return ra.startsWith("⬆️") ? t("Vilket tal är störst?", "Which number is the largest?") : t("Vilket tal är minst?", "Which number is the smallest?");
    case "tiotalEntal": return t("Vilket tal visar bilden?", "Which number does the picture show?");
    case "talmonster": return t("Vilket tal kommer sedan?", "Which number comes next?");
    case "tallinje":
    case "brakTallinje": return t("Vilket tal pekar den röda pilen på?", "Which number is the red arrow pointing at?");
    case "brakPizza": return q.brakText ? t(`Vilken pizza visar ${brakOrd(q.brakText)}?`, `Which pizza shows ${brakOrd(q.brakText)}?`) : t("Hur stor del av pizzan är färgad?", "How much of the pizza is coloured?");
    case "brakAvAntal": return t(`Vad är ${brakOrd(q.brakText)} av ${q.textEfter.match(/\d+/)[0]}?`, `What is ${brakOrd(q.brakText)} of ${q.textEfter.match(/\d+/)[0]}?`);
    case "sammaTal": return t("Vilket är samma tal som ", "Which is the same number as ") + (q.fore.brak ? brakOrd(q.fore.brak) : ordFor(q.fore.text)) + "?";
    case "procentRutnat": return t("Hur många procent av rutorna är gula?", "What percentage of the squares are yellow?");
    case "vag": return t("Vad är x? ", "What is x? ") + ordFor(ra.replace(" = ", t(" är lika med ", " equals "))) + ".";
    case "proportion": {
      const [[f, k], [, k2]] = q.bild.rader;
      return t(`${f} fiskar räcker till ${k} katter. Hur många fiskar behövs till ${k2} katter?`, `${f} fish are enough for ${k} cats. How many fish are needed for ${k2} cats?`);
    }
    case "medelvarde": return t("Vad är medelvärdet?", "What is the mean?");
    case "typvardeMedian": return ra.startsWith("median") ? t("Vad är medianen?", "What is the median?") : t("Vad är typvärdet?", "What is the mode?");
    case "chans": return t("Hur stor är chansen att få en fisk ur påsen?", "What is the chance of getting a fish from the bag?");
    case "lastal": return q.text;
    default: return vadBlir();
  }
}

// ---------- Spelets läge ----------

const S = {
  alder: Number(lasInstallning("matte-alder")) || 7,
  niva: 1,
  poang: 0,       // Poängen från klarade nivåer
  forsok: null,   // { stjarnor, fiskar, nr, sedda }
  iRad: 0,        // Rätt i rad
  visadeTyper: new Set(), // Frågetyper Göran redan har visat
  hjalpTyper: new Set(),  // Frågetyper där nästa fråga får en hjälpbild
  test: false,    // Startad med testlänk: kommer inte med på topplistan
};
const fro = params.has("fro") ? Number(params.get("fro")) : Math.floor(Math.random() * 1e9);
const slump = F.skapaSlump(fro);
const exempelSlump = F.skapaSlump(fro + 99);
let fraga = null;
let lage = "start"; // start, karta, fraga, klar, slut
let senastTryck = Date.now();

const antalNivaer = () => F.NIVAER[S.alder].length;
// Vilka platser på kartan en ålder använder (bröllopet och stolen är alltid sist)
function platserFor(antal) {
  return [...Array.from({ length: antal - 2 }, (_, i) => i), 8, 9];
}
const platsFor = (niva) => PLATSER[platserFor(antalNivaer())[niva - 1]];

function visa(html, klass = "") {
  scen.replaceChildren(skapa(`<div class="skarm ${klass}">${html}</div>`));
  pausKnapp.hidden = !(lage === "fraga" || lage === "karta");
  document.getElementById("pausTopplista").dataset.topplista = TOPPLISTA_ID[S.alder];
  return scen.firstElementChild;
}

// ---------- Start ----------

function visaStart() {
  lage = "start";
  ritaOm = visaStart;
  const aldrar = Object.keys(F.NIVAER).map(Number);
  const el = visa(`
    <div class="titel">🐱 ${t("Katten Görans matteresa", "Gerald the Cat's Maths Trip")}</div>
    <div class="undertitel">${t("Hjälp Göran att hitta sin guldbjällra!", "Help Gerald find his golden bell!")}</div>
    <div class="goran" data-lage="sover" style="left:${staende ? 244 : 372}px; top:${staende ? 200 : 150}px; width:280px; height:230px;">${goranSvg("sover")}</div>
    <div class="bubbla" style="${staende ? "left:0; right:0; margin:auto; width:max-content; top:450px" : "left:640px; top:190px"}; font-size:19px; max-width:${staende ? 560 : 330}px">${esc(replik("start"))}</div>
    <div style="position:absolute; top:${staende ? 545 : 410}px; width:100%; text-align:center; font-size:26px; font-weight:800;">${t("Hur gammal är du?", "How old are you?")}</div>
    <div class="aldrar" style="position:absolute; top:${staende ? 595 : 460}px; left:0; right:0; margin:auto; ${staende ? "max-width:520px" : ""}">
      ${aldrar.map((a) => `<button class="knapp alder" type="button" data-alder="${a}" aria-pressed="${a === S.alder}">${a}<small>${t("år", "yrs")}</small></button>`).join("")}
    </div>
    <div style="position:absolute; bottom:${staende ? 70 : 40}px; left:0; right:0; display:flex; justify-content:center; gap:20px;">
      <button class="knapp guld" type="button" id="borja" style="width:300px; height:84px; font-size:34px;">▶ ${t("Börja", "Start")}</button>
      <button class="knapp" type="button" id="startTopplista" style="width:84px; height:84px; font-size:38px;" aria-label="${t("Topplista", "High scores")}">🏆</button>
    </div>`);
  el.style.background = "linear-gradient(#ffe9c7, #ffd1a1)";
  el.querySelectorAll(".alder").forEach((b) => b.addEventListener("click", () => {
    S.alder = Number(b.dataset.alder);
    sparaInstallning("matte-alder", String(S.alder));
    el.querySelectorAll(".alder").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    document.getElementById("pausTopplista").dataset.topplista = TOPPLISTA_ID[S.alder];
    LJUD.klick();
  }));
  el.querySelector("#borja").addEventListener("click", () => startaRunda());
  el.querySelector("#startTopplista").addEventListener("click", () => Topplista.visa ? Topplista.visa(TOPPLISTA_ID[S.alder]) : document.getElementById("pausTopplista").click());
}

function startaRunda(niva = 1) {
  S.niva = niva;
  S.poang = 0;
  S.iRad = 0;
  S.visadeTyper = new Set();
  S.hjalpTyper = new Set();
  visaKarta();
}

// ---------- Kartan ----------

function visaKarta(gick = false) {
  lage = "karta";
  ritaOm = () => visaKarta(false);
  const antal = antalNivaer();
  const index = platserFor(antal);
  const POS = [[120, 640], [280, 600], [430, 650], [580, 590], [720, 520], [600, 420], [420, 380], [260, 300], [420, 200], [640, 170]];
  const pos = (i) => {
    const [x, y] = POS[i];
    return staende ? [Math.round(x * 0.75 + 60), Math.round(y * 1.2 + 10)] : [x, y];
  };
  const punkter = index.map(pos);
  const vag = "M" + punkter.map((p) => p.join(" ")).join(" L");
  let svg = `<path d="${vag}" stroke="#e8d3a7" stroke-width="34" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
  svg += `<path d="${vag}" stroke="#d8bd86" stroke-width="4" stroke-dasharray="2 14" fill="none"/>`;
  index.forEach((pi, i) => {
    const [x, y] = punkter[i];
    const klar = i < S.niva - 1, nu = i === S.niva - 1;
    svg += `<circle cx="${x}" cy="${y}" r="${nu ? 50 : 42}" fill="${klar ? "#fff" : nu ? "#ffd95e" : "#d6d6d6"}" stroke="#2b1d0e" stroke-width="${nu ? 6 : 3}"/>`;
    svg += `<text x="${x}" y="${y + 14}" font-size="40" text-anchor="middle" ${!klar && !nu ? 'opacity=".35"' : ""}>${PLATSER[pi].ikon}</text>`;
    if (klar) svg += `<text x="${x + 32}" y="${y - 26}" font-size="26">✅</text>`;
    if (!klar && !nu) svg += `<text x="${x + 24}" y="${y - 22}" font-size="22">🔒</text>`;
    if (nu) svg += `<text x="${x}" y="${y + 80}" font-size="22" font-weight="800" text-anchor="middle">${esc(PLATSER[pi].namn)}</text>`;
  });
  const [gx, gy] = punkter[S.niva - 1];
  const plats = platsFor(S.niva);
  const bubblaVanster = gx > (staende ? 384 : 512);
  const el = visa(`
    <svg class="karta" viewBox="0 0 ${staende ? 768 : 1024} ${staende ? 1024 : 768}">${svg}</svg>
    <div class="poangruta">⭐ ${S.poang}</div>
    <div class="alderruta">${S.alder} ${t("år", "yrs")} · ${t("nivå", "level")} ${S.niva}/${antal}</div>
    <div class="goran kartgoran" style="left:${gx - 75}px; top:${gy - 150}px; width:150px; height:130px;">${goranSvg("vaken")}</div>
    <div class="bubbla" style="${bubblaVanster ? `right:${(staende ? 768 : 1024) - gx + 80}px` : `left:${gx + 80}px`}; top:${Math.max(110, gy - 170)}px; font-size:19px; max-width:280px;">${esc(plats.sager)}</div>
    <button class="knapp guld" type="button" id="spela" style="position:absolute; right:40px; bottom:40px; width:220px; height:84px; font-size:34px;">▶ ${t("Spela", "Play")}</button>`);
  el.style.background = "#cfe8c4";
  if (gick) el.querySelector(".kartgoran").animate([{ transform: "translateY(30px) scale(.9)", opacity: 0.3 }, { transform: "none", opacity: 1 }], { duration: 700, easing: "ease-out" });
  el.querySelector("#spela").addEventListener("click", startaForsok);
}

// ---------- En nivå ----------

function startaForsok() {
  S.forsok = { stjarnor: 0, fiskar: INSTALLNINGAR.fiskar, nr: 0, sedda: new Set() };
  S.iRad = 0;
  nastaFraga();
}

function nastaFraga() {
  fraga = F.nyFraga(S.alder, S.niva, S.forsok.nr, slump, S.forsok.sedda);
  S.forsok.nr++;
  if (!S.visadeTyper.has(fraga.typ)) {
    S.visadeTyper.add(fraga.typ);
    visaExempel(fraga.typ, () => ritaFraga());
  } else ritaFraga();
}

// Topprad med stjärnor och fiskar
function topprad(nyStjarna = false, bortFisk = false) {
  const st = S.forsok.stjarnor, fi = S.forsok.fiskar;
  let stj = "";
  for (let i = 0; i < INSTALLNINGAR.stjarnorForAttKlara; i++) stj += i < st ? `<span class="${nyStjarna && i === st - 1 ? "ny-stjarna" : ""}">⭐</span>` : '<span class="tom">⭐</span>';
  let fis = "";
  for (let i = 0; i < INSTALLNINGAR.fiskar; i++) fis += i < fi ? "<span>🐟</span>" : i === fi && bortFisk ? '<span class="simmar-bort">🐟</span>' : '<span class="tom">🐟</span>';
  return `<div class="topprad"><span class="stjarnrad" aria-label="${st} ${t("stjärnor", "stars")}">${stj}</span><span class="fiskrad" aria-label="${fi} ${t("fiskar", "fish")}">${fis}</span></div>`;
}

// Frågans text. Efter ett fel byts ? mot det rätta svaret (grönt).
function fragtextHtml(q, visaSvar) {
  const svar = visaSvar ? `<span class="svarstal">${typeof q.svar === "string" && q.svar.includes("/") ? brakHtml(q.svar) : esc(typeof q.svar === "number" ? tal(q.svar) : q.svar)}</span>` : '<span class="ruta">?</span>';
  const delar = [];
  if (q.fore) delar.push(q.fore.brak ? brakHtml(q.fore.brak) : esc(q.fore.text));
  if (q.brakText) delar.push(brakHtml(q.brakText));
  let text = esc(q.text || "") + esc(q.textEfter || "");
  if (q.stor) return `<div class="fragtext jatte">${text}</div>`;
  // Ekvationer: frågan står på en egen rad under ("x = ?")
  if (q.rad2) text += "<br>" + esc(q.rad2);
  if (text.trim() === "?" || text.trim() === "? ") text = svar;
  else if (text.includes("?")) text = text.replace("?", svar);
  else if (visaSvar && !q.knappar && text.trim()) text += " = " + svar;
  // Samma röda pil som på tallinjen
  text = text.replace("▼", '<span class="rodpil">▼</span>');
  const html = delar.join(" ") + " " + text;
  const langd = Math.max((q.text || "").length + (q.textEfter || "").length, (q.rad2 || "").length);
  const smal = !q.knappar; // Bredvid knappsatsen är det mindre plats
  if (!html.trim()) return "";
  return `<div class="fragtext${langd > (smal ? 16 : 22) ? " liten" : langd > (smal ? 8 : 12) ? " mellan" : ""}">${html}</div>`;
}

const ritadFraga = new WeakSet(); // Frågor som redan har lästs upp (när skärmen ritas om)
function ritaFraga(efterFel = false) {
  lage = "fraga";
  ritaOm = () => ritaFraga(efterFel);
  const q = fraga;
  const knappsats = !q.knappar;
  const plats = platsFor(S.niva);
  const hjalp = !efterFel && S.hjalpTyper.has(q.typ) && q.hjalp;
  const bildHtml = efterFel ? ritaBild(q.felbild) : ritaBild(q.bild);
  const text = q.lastal
    ? `<div class="lastext">${esc(q.text)}</div>`
    : fragtextHtml(q, efterFel);
  const testSvar = params.has("test") ? `<div style="position:absolute;right:8px;bottom:4px;font-size:14px;opacity:.5">${esc(String(q.svar))}</div>` : "";
  const el = visa(`
    ${topprad()}
    <div class="fragyta">
      ${text}
      ${bildHtml || hjalp ? `<div class="bild">${bildHtml}${hjalp ? `<div class="hjalpbild">${ritaBild(q.hjalp)}</div>` : ""}</div>` : ""}
    </div>
    ${efterFel ? "" : knappsats ? knappsatsHtml(q) : svarsknapparHtml(q)}
    <div class="goran fraggoran" style="left:10px; bottom:10px; width:200px; height:170px;">${goranSvg("vaken")}</div>
    <div class="bubbla fragbubbla" style="left:150px; bottom:180px; font-size:19px;"></div>
    ${efterFel ? `<button class="knapp guld vidare" type="button" id="vidare" aria-label="${t("Nästa", "Next")}">▶</button>` : `<button class="knapp glasogon" type="button" id="visaIgen" aria-label="${t("Visa hur man gör", "Show how")}">👓</button><button class="knapp lasknapp" type="button" id="lasUpp" aria-label="${t("Läs upp frågan", "Read the question")}"${rost ? "" : " hidden"}>🔊</button>`}
    ${testSvar}`, efterFel ? "utan-svar" : knappsats ? "med-knappsats" : "");
  el.style.background = `linear-gradient(${plats.farg[0]}, ${plats.farg[1]})`;
  // Passar bilden inte på skärmen görs den mindre
  krympBild(el);
  if (efterFel) {
    animera(el);
    el.querySelector("#vidare").addEventListener("click", () => {
      if (S.forsok.fiskar <= 0) visaMisslyckad();
      else nastaFraga();
    });
    return el;
  }
  el.querySelector("#visaIgen").addEventListener("click", () => visaExempel(q.typ, () => ritaFraga()));
  el.querySelector("#lasUpp").addEventListener("click", () => prata(lasText(q)));
  if (rostPa && S.alder <= INSTALLNINGAR.lasUppTill && !ritadFraga.has(q)) prata(lasText(q));
  ritadFraga.add(q);
  if (knappsats) kopplaKnappsats(el, q);
  else el.querySelectorAll(".svarsknapp").forEach((b) => b.addEventListener("click", () => svara(b.dataset.varde, b)));
  return el;
}

// Bilden som visar hur man tänker byggs upp steg för steg (element med data-steg).
// Hela animeringen tar högst cirka 4 sekunder. Det gröna svaret i frågan kommer sist.
function animera(el) {
  const bild = el.querySelector(".fragyta > .bild");
  if (!bild) return;
  const steg = [...bild.querySelectorAll("[data-steg]")];
  if (!steg.length) return;
  const sista = Math.max(...steg.map((s) => Number(s.dataset.steg)));
  const takt = Math.min(0.55, 4 / (sista + 1));
  steg.forEach((s) => s.style.setProperty("--i", s.dataset.steg));
  bild.style.setProperty("--takt", takt + "s");
  el.style.setProperty("--slut", (0.3 + (sista + 1) * takt).toFixed(2) + "s");
  el.classList.add("animerar");
}

function krympBild(el) {
  const yta = el.querySelector(".fragyta");
  if (!yta) return;
  const bild = yta.querySelector(":scope > .bild");
  if (!bild) return;
  // Hur mycket plats som finns kvar när texten och de andra delarna har fått sitt
  const andra = [...yta.children].filter((c) => c !== bild);
  const gap = 14 * andra.length;
  const ledigtH = yta.clientHeight - andra.reduce((h, c) => h + c.offsetHeight, 0) - gap;
  const skala = Math.min(1, yta.clientWidth / bild.scrollWidth, Math.max(0.3, ledigtH / bild.offsetHeight));
  if (skala < 1) {
    bild.style.transform = `scale(${skala})`;
    bild.style.margin = `${(-bild.offsetHeight * (1 - skala)) / 2}px ${(-bild.scrollWidth * (1 - skala)) / 2}px`;
  }
}

function svarsknapparHtml(q) {
  const med = q.knappar.some((k) => k.bild);
  return `<div class="svarsrad">${q.knappar.map((k) => {
    const innehall = k.bild ? ritaBild(k.bild) : k.brak ? brakHtml(k.brak) : esc(k.text);
    return `<button class="knapp svarsknapp${med ? " med-bild" : ""}${k.brak ? " brakknapp" : ""}" type="button" data-varde="${esc(String(k.varde))}">${innehall}</button>`;
  }).join("")}</div>`;
}

function knappsatsHtml(q) {
  const extra = [];
  if (q.decimal || (typeof q.svar === "number" && q.svar % 1 !== 0)) extra.push(sv() ? "," : ".");
  if (q.negativ) extra.push("−");
  return `<div class="knappsats">
    <div class="svarsruta" aria-live="polite"></div>
    ${["1", "2", "3", "4", "5", "6", "7", "8", "9", "⌫", "0", "✔"].map((k) => `<button class="knapp${k === "✔" ? " skicka" : ""}" type="button" data-tangent="${k}" aria-label="${k === "⌫" ? t("Sudda", "Delete") : k === "✔" ? t("Svara", "Answer") : k}">${k}</button>`).join("")}
    ${extra.length ? `<div class="extra">${extra.map((k) => `<button class="knapp" type="button" data-tangent="${k}">${k}</button>`).join("")}</div>` : ""}
  </div>`;
}
const sv = () => SPRAK === "sv";

let tangentLyssnare = null;
function kopplaKnappsats(el, q) {
  const ruta = el.querySelector(".svarsruta");
  const maxLangd = tal(q.svar).length + 2;
  const tryck = (k) => {
    if (lage !== "fraga" || !pausmeny.hidden) return;
    let v = ruta.textContent;
    if (k === "⌫") v = v.slice(0, -1);
    else if (k === "✔") {
      if (v && v !== "−") svara(v);
      return;
    } else if (k === "−") v = v.startsWith("−") ? v.slice(1) : "−" + v;
    else if (k === "," || k === ".") {
      if (!/[.,]/.test(v)) v = (v === "" || v === "−" ? v + "0" : v) + k;
    } else if (v.replace("−", "").length < maxLangd) v = v === "0" ? k : v === "−0" ? "−" + k : v + k;
    ruta.textContent = v;
    LJUD.klick();
  };
  el.querySelectorAll("[data-tangent]").forEach((b) => b.addEventListener("click", () => tryck(b.dataset.tangent)));
  tangentLyssnare = (e) => {
    if (/^[0-9]$/.test(e.key)) tryck(e.key);
    else if (e.key === "Backspace") tryck("⌫");
    else if (e.key === "Enter") tryck("✔");
    else if ((e.key === "," || e.key === ".") && el.querySelector('[data-tangent=","],[data-tangent="."]')) tryck(sv() ? "," : ".");
    else if (e.key === "-" && q.negativ) tryck("−");
    else return;
    e.preventDefault();
  };
}
document.addEventListener("keydown", (e) => {
  if (lage === "fraga" && pausmeny.hidden && tangentLyssnare && document.querySelector(".knappsats")) tangentLyssnare(e);
  else if (lage === "fraga" && pausmeny.hidden && /^[1-4]$/.test(e.key)) {
    const b = document.querySelectorAll(".svarsknapp")[Number(e.key) - 1];
    if (b) b.click();
  }
});

let svarar = false;
function svara(givet, knapp) {
  if (svarar || lage !== "fraga") return;
  svarar = true;
  tystna();
  const q = fraga;
  const ratt = F.arRatt(q, givet);
  const el = scen.firstElementChild;
  knapp = knapp || [...el.querySelectorAll(".svarsknapp")].find((b) => b.dataset.varde === String(givet));
  el.querySelectorAll(".svarsknapp, [data-tangent]").forEach((b) => (b.disabled = true));
  if (ratt) {
    S.forsok.stjarnor++;
    S.iRad++;
    S.hjalpTyper.delete(q.typ);
    LJUD.ratt(S.iRad);
    if (knapp) knapp.classList.add("ratt");
    else el.querySelector(".svarsruta")?.classList.add("ratt-svar");
    el.querySelector(".topprad").outerHTML = topprad(true);
    const sort = S.iRad === 5 ? "iRad5" : S.iRad === 3 ? "iRad3" : "ratt";
    el.querySelector(".fragbubbla").textContent = replik(sort);
    setTimeout(() => {
      svarar = false;
      if (lage !== "fraga") return;
      if (S.forsok.stjarnor >= INSTALLNINGAR.stjarnorForAttKlara) nivaKlar();
      else nastaFraga();
    }, INSTALLNINGAR.tidEfterRatt * 1000);
  } else {
    S.forsok.fiskar--;
    S.iRad = 0;
    S.hjalpTyper.add(q.typ);
    LJUD.fel();
    LJUD.blubb();
    if (knapp) knapp.classList.add("fel");
    setTimeout(() => {
      svarar = false;
      if (lage !== "fraga") return;
      const ny = ritaFraga(true);
      ny.querySelector(".topprad").outerHTML = topprad(false, true);
      ny.querySelector(".fragbubbla").textContent = replik("fel");
      // Rätt knapp visas också
      // Den rätta knappen visas också, men bara när svaret inte redan står grönt i frågan
      const rattKnapp = q.knappar && q.knappar.find((k) => String(k.varde) === String(q.svar));
      if (rattKnapp && rattKnapp.bild && q.typ !== "flest") ny.querySelector(".fragyta").insertAdjacentHTML("beforeend", `<div class="rattknapp">✔ ${ritaBild(rattKnapp.bild)}</div>`);
      krympBild(ny);
    }, 450);
  }
}

// Göran visar hur man gör med ett exempel (första gången en frågetyp kommer)
function visaExempel(typ, sedan) {
  lage = "fraga";
  ritaOm = () => visaExempel(typ, sedan);
  const recept = F.NIVAER[S.alder][S.niva - 1];
  let ex;
  for (let f = 0; f < 20; f++) {
    ex = F.TYPER[typ](recept, exempelSlump);
    if ((!fraga || ex.nyckel !== fraga.nyckel) && !(typ === "rakna" && ex.svar < 3)) break;
  }
  const plats = platsFor(S.niva);
  const text = ex.lastal ? `<div class="lastext">${esc(ex.text)}</div>` : fragtextHtml(ex, true);
  const el = visa(`
    ${topprad()}
    <div class="fragyta exempel">
      <div class="exempelskylt">👓 ${t("Så här gör man", "This is how")}</div>
      ${text}
      <div class="bild">${ritaBild(ex.felbild)}</div>
    </div>
    <div class="goran fraggoran" style="left:10px; bottom:10px; width:200px; height:170px;">${goranSvg("stolt")}</div>
    <div class="bubbla fragbubbla" style="left:150px; bottom:180px; font-size:19px;">${esc(replik("visa"))}</div>
    <button class="knapp guld vidare" type="button" id="nuDu" style="width:240px">${t("Nu du!", "Your turn!")} ▶</button>`, "utan-svar");
  el.style.background = `linear-gradient(${plats.farg[0]}, ${plats.farg[1]})`;
  krympBild(el);
  animera(el);
  el.querySelector("#nuDu").addEventListener("click", sedan);
}

// ---------- Klarad nivå ----------

function nivaKlar() {
  lage = "klar";
  const n = S.niva;
  const rattPoang = INSTALLNINGAR.stjarnorForAttKlara * INSTALLNINGAR.poangPerRatt * n;
  const bonus = INSTALLNINGAR.bonusPerNiva * n;
  const fore = S.poang;
  S.poang += rattPoang + bonus;
  const sista = n >= antalNivaer();
  LJUD.fanfar();
  ritaOm = null;
  const el = visa(`
    <div class="konfetti">${konfetti()}</div>
    <div class="stor-rubrik">${t(`Nivå ${n} klar!`, `Level ${n} done!`)} 🎉</div>
    <div style="font-size:40px; margin-top:8px">${"⭐".repeat(INSTALLNINGAR.stjarnorForAttKlara)}</div>
    <div class="goran" style="left:${staende ? 40 : 100}px; top:${staende ? 300 : 250}px; width:330px; height:280px;">${goranSvg("stolt")}</div>
    <div class="bubbla" style="left:${staende ? 330 : 460}px; top:${staende ? 260 : 260}px; max-width:${staende ? 400 : 440}px;">${esc(replik("klar"))}</div>
    <div class="poangtavla" style="position:absolute; left:${staende ? 120 : 500}px; top:${staende ? 620 : 430}px;">
      8 ${t("rätt", "correct")} <span style="color:var(--gron)">+${rattPoang}</span><br>
      ${t("Nivåbonus", "Level bonus")} <span style="color:var(--gron)">+${bonus}</span><br>
      ${t("Poäng", "Score")} ⭐ <b id="poangSiffra">${fore}</b>
    </div>
    <div style="position:absolute; bottom:50px; width:100%; text-align:center;">
      <button class="knapp" type="button" id="vidare" style="width:320px; height:84px; font-size:34px;">▶ ${sista ? t("Vidare", "Onwards") : t("Vidare", "Onwards")}</button>
    </div>`);
  el.style.background = "radial-gradient(circle at 50% 40%, #fff3c4, #ffc96b)";
  raknaUpp(el.querySelector("#poangSiffra"), fore, S.poang);
  el.querySelector("#vidare").addEventListener("click", () => {
    if (sista) visaFinal();
    else {
      S.niva++;
      visaKarta(true);
    }
  });
}

function raknaUpp(el, fran, till) {
  const start = performance.now(), tid = 900;
  const steg = (nu) => {
    const a = Math.min(1, (nu - start) / tid);
    el.textContent = Math.round(fran + (till - fran) * a);
    if (a < 1) requestAnimationFrame(steg);
  };
  requestAnimationFrame(steg);
}

function konfetti() {
  let html = "";
  for (let i = 0; i < 40; i++) {
    html += `<span style="left:${(i * 97) % 100}%; font-size:${18 + (i % 4) * 7}px; animation-duration:${2.2 + (i % 5) * 0.5}s; animation-delay:${(i % 8) * 0.15}s">${i % 3 ? "⭐" : "🦴"}</span>`;
  }
  return html;
}

// ---------- Slut ----------

function visaMisslyckad() {
  lage = "slut";
  ritaOm = null;
  const poang = S.poang + S.forsok.stjarnor * INSTALLNINGAR.poangPerRatt * S.niva;
  const el = scen.firstElementChild;
  el.querySelectorAll("#vidare").forEach((b) => b.remove());
  el.insertAdjacentHTML("beforeend", `
    <div class="dialog"><div class="dialogruta">
      <div class="goran" style="position:relative; width:180px; height:150px;">${goranSvg("vaken")}</div>
      <div style="font-size:24px; font-weight:700; max-width:520px">${esc(replik("slutFiskar"))}</div>
      <button class="knapp guld" type="button" id="igen">🔄 ${t("Försök igen", "Try again")}</button>
      <button class="knapp" type="button" id="skrivIn">🏆 ${t("Skriv in mig", "Save my score")} · ${poang} ${t("poäng", "points")}</button>
    </div></div>`);
  el.querySelector("#igen").addEventListener("click", startaForsok);
  el.querySelector("#skrivIn").addEventListener("click", () => avsluta(poang, S.niva - 1));
}

function visaFinal() {
  lage = "slut";
  ritaOm = null;
  LJUD.bjallra();
  const el = visa(`
    <div class="konfetti">${konfetti()}</div>
    <div class="stor-rubrik" style="margin-top:40px">🔔 ${t("Du hittade guldbjällran!", "You found the golden bell!")}</div>
    <div class="goran" style="left:${staende ? 60 : 110}px; top:${staende ? 250 : 190}px; width:340px; height:300px;">${goranSvg("stolt", true)}</div>
    <div class="bubbla" style="left:${staende ? 340 : 470}px; top:${staende ? 220 : 200}px; max-width:${staende ? 400 : 460}px;">${t("Den låg i min stol. Under mig. Jag har inte tappat den, jag har ruvat på den. Det var meningen. Tack, geni!", "It was in my chair. Under me. I didn't lose it, I was guarding it. On purpose. Thank you, genius!")}</div>
    <div class="poangtavla" style="position:absolute; left:${staende ? 140 : 520}px; top:${staende ? 640 : 440}px;">
      ${t("Alla", "All")} ${antalNivaer()} ${t("nivåer klara!", "levels done!")}<br>${t("Poäng", "Score")} ⭐ <b>${S.poang}</b>
    </div>
    <div style="position:absolute; bottom:50px; width:100%; text-align:center;">
      <button class="knapp guld" type="button" id="skrivIn" style="width:380px; height:84px; font-size:32px;">🏆 ${t("Skriv in mig", "Save my score")}</button>
    </div>`);
  el.style.background = "radial-gradient(circle at 50% 40%, #fff6d0, #ffc96b)";
  el.querySelector("#skrivIn").addEventListener("click", () => avsluta(S.poang, antalNivaer()));
}

// Rundan är slut: skriv in sig på topplistan (om man kom med) och börja om
function avsluta(poang, klaradNiva) {
  const tillbaka = () => visaStart();
  if (S.test) {
    visaRuta(t(`Testläge: ${poang} poäng, nivå ${klaradNiva}. Kommer inte med på topplistan.`, `Test mode: ${poang} points, level ${klaradNiva}. Not saved.`), tillbaka);
    return;
  }
  const med = poang > 0 && Topplista.nyttResultat(TOPPLISTA_ID[S.alder], poang, { niva: klaradNiva, narKlar: tillbaka, fordrojning: 0.2 });
  if (!med) visaRuta(t(`Du fick ${poang} poäng. Försök igen, så kommer du kanske med på topplistan!`, `You got ${poang} points. Try again and maybe you'll make the high scores!`), tillbaka);
}

function visaRuta(text, sedan) {
  const el = scen.firstElementChild;
  el.querySelectorAll(".dialog").forEach((d) => d.remove());
  el.insertAdjacentHTML("beforeend", `<div class="dialog"><div class="dialogruta">
    <div style="font-size:26px; font-weight:800">${esc(text)}</div>
    <button class="knapp guld" type="button" id="ok">▶ ${t("Till start", "Back to start")}</button>
    <button class="knapp" type="button" data-topplista="${TOPPLISTA_ID[S.alder]}">🏆 ${t("Topplista", "High scores")}</button>
  </div></div>`);
  el.querySelector("#ok").addEventListener("click", sedan);
}

// ---------- Paus, ljud och musik ----------

function pausa() {
  if (!(lage === "fraga" || lage === "karta")) return;
  pausmeny.hidden = false;
  tystna();
  if (window.Musik) Musik.paus(true);
}
function fortsatt() {
  pausmeny.hidden = true;
  if (window.Musik) Musik.paus(false);
}
pausKnapp.addEventListener("click", pausa);
document.getElementById("fortsatt").addEventListener("click", fortsatt);
document.getElementById("borjaOm").addEventListener("click", () => {
  fortsatt();
  visaStart();
});
document.addEventListener("visibilitychange", () => {
  if (document.hidden) pausa();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" || e.key === "p" || e.key === "P") {
    if (pausmeny.hidden) pausa();
    else fortsatt();
  }
});

const musikKnapp = document.getElementById("musikKnapp");
const ljudKnapp = document.getElementById("ljudKnapp");
const rostKnapp = document.getElementById("rostKnapp");
function visaLjudKnappar() {
  const musikPa = window.Musik ? Musik.arPa() : false;
  musikKnapp.textContent = musikPa ? t("♪ Musik: på", "♪ Music: on") : t("♪ Musik: av", "♪ Music: off");
  ljudKnapp.textContent = ljudPa ? t("🔊 Ljud: på", "🔊 Sound: on") : t("🔇 Ljud: av", "🔇 Sound: off");
  rostKnapp.textContent = rostPa ? t("🗣️ Läs upp frågan: på", "🗣️ Read questions aloud: on") : t("🗣️ Läs upp frågan: av", "🗣️ Read questions aloud: off");
}
musikKnapp.addEventListener("click", () => {
  if (window.Musik) Musik.vaxla();
  visaLjudKnappar();
});
rostKnapp.addEventListener("click", () => {
  rostPa = !rostPa;
  sparaInstallning("matte-rost", rostPa ? "pa" : "av");
  visaLjudKnappar();
});
ljudKnapp.addEventListener("click", () => {
  ljudPa = !ljudPa;
  sparaInstallning("matte-ljud", ljudPa ? "pa" : "av");
  visaLjudKnappar();
});
visaLjudKnappar();

// Ljudet får starta först när man har tryckt (Safari)
document.addEventListener("pointerdown", () => {
  startaLjud();
  senastTryck = Date.now();
  document.querySelectorAll(".goran.sovande").forEach((g) => {
    g.classList.remove("sovande");
    g.innerHTML = goranSvg("vaken");
  });
}, true);

// Göran somnar om ingen trycker på ett tag (det finns ingen tidsgräns, det är bara på låtsas)
setInterval(() => {
  if (Date.now() - senastTryck < INSTALLNINGAR.sovEfter * 1000) return;
  document.querySelectorAll(".fraggoran:not(.sovande), .kartgoran:not(.sovande)").forEach((g) => {
    g.classList.add("sovande");
    g.innerHTML = goranSvg("sover");
  });
}, 1000);

// ---------- Start ----------

if (params.has("alder") && F.NIVAER[Number(params.get("alder"))]) {
  S.alder = Number(params.get("alder"));
  S.test = true;
  const niva = Math.min(Math.max(1, Number(params.get("niva")) || 1), antalNivaer());
  startaRunda(niva);
} else {
  S.test = TESTLAGE;
  visaStart();
}
