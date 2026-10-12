// =====================================================================
//  LAGOM TRYCK
//
//  Pappa har ätit bönor. Håll fingret på skärmen så krystar han, och
//  släpp så kommer fisen. Ju längre man håller, desto större fis och
//  desto mer poäng. Men någonstans går gränsen, och man vet aldrig
//  riktigt var...
//
//  Fisa när det låter mycket runt omkring, så hör ingen något. Då blir
//  det dubbla poäng. Hör någon fisen kan man skylla på hunden.
//
//  Trycker pappa för hårt bajsar han på sig, och då går ett par
//  underbyxor åt. När alla underbyxor är slut är spelet slut.
//
//  Börja med att ändra i INSTALLNINGAR här nedanför.
//
//  All text finns på svenska och engelska. Den skrivs så här:
//    t("svenska", "English")
//  (Döp därför aldrig en egen variabel till bara t.)
// =====================================================================

const INSTALLNINGAR = {
  underbyxor: 3,          // Hur många par underbyxor pappa har med sig
  krystFart: 26,          // Hur fort trycket ökar när man håller fingret
  grans: [58, 96],        // Någonstans mellan de här trycken bajsar pappa på sig (slumpas varje gång)
  svarareVarjeDag: 8,     // Så mycket lägre kan gränsen hamna för varje ny dag

  // Hur långt före gränsen pappa börjar visa tecken
  varningar: {
    kurr: 28,             // Magen kurrar
    svett: 16,            // Pappa svettas
    panik: 7,             // Ögonen spärras upp och det säger "blubb"
  },
  bromsspar: 5,           // Släpper man så här nära gränsen blir det bromsspår
  minstaFis: 6,           // Mindre tryck än så blir ingen fis alls
  vilaEfterFis: 0.5,      // Sekunder innan pappa kan krysta igen

  poang: {
    ingenHorde: 2,        // Gånger poängen om ingen hörde fisen
    bromsspar: 1.5,       // Gånger poängen för en fis med bromsspår (modigt!)
    hunden: 1.5,          // Gånger poängen när man skyller på hunden
  },
  hundGanger: 2,          // Hur många gånger per bana man får skylla på hunden

  pappaFarg: "#4a7bb7",   // Pappas tröja
  ljud: true,
  musik: true,            // Hissmusik, sång och orgel

  // Fisarnas namn. "fran" är minsta tryck för att fisen ska få det namnet.
  // "ljud" är hur den låter: "pip", "brrt", "ballong", "trumpet", "motor" eller "mullr".
  fisar: [
    { fran: 0, namn: t("Pipet", "The Squeaker"), ljud: "pip" },
    { fran: 0, namn: t("Smygprutten", "The Sneaky Toot"), ljud: "brrt" },
    { fran: 25, namn: t("Pruttelutten", "The Tootle-Toot"), ljud: "brrt" },
    { fran: 25, namn: t("Ballongen", "The Balloon"), ljud: "ballong" },
    { fran: 50, namn: t("Trumpeten", "The Trumpet"), ljud: "trumpet" },
    { fran: 50, namn: t("Motorcykeln", "The Motorbike"), ljud: "motor" },
    { fran: 75, namn: t("Åskan", "The Thunder"), ljud: "mullr" },
    { fran: 75, namn: t("Mistluren", "The Foghorn"), ljud: "trumpet" },
    { fran: 75, namn: t("Tubakonserten", "The Tuba Concert"), ljud: "motor" },
  ],

  // Visas när man byter bana och på startskärmen
  tips: [
    t("Tips: Lita aldrig på en fis efter 40.", "Tip: Never trust a fart after 40."),
    t("Tips: Den som känner lukten först har själv gjort det.", "Tip: Whoever smelt it dealt it."),
    t("Tips: Skyll på hunden. Hunden kan inte säga emot.", "Tip: Blame the dog. The dog can't argue back."),
    t("Tips: En tyst fis är inte alltid en snäll fis.", "Tip: A quiet fart isn't always a nice fart."),
    t("Tips: Hissmusik finns av en anledning.", "Tip: Elevator music exists for a reason."),
    t("Tips: Mormor hör ändå inte så bra.", "Tip: Grandma can't hear very well anyway."),
    t("Tips: Svettas pappa? Då är det dags att släppa.", "Tip: Is Dad sweating? Time to let go."),
    t("Tips: Säger magen blubb är det bråttom.", "Tip: If the tummy says blub, hurry up!"),
    t("Visste du att en människa fiser 10–20 gånger om dagen? Pappa lite oftare.", "Did you know people fart 10–20 times a day? Dad a bit more."),
    t("Bönor är nyttiga. Ju mer man äter, desto mer…", "Beans are good for you. The more you eat, the more you…"),
  ],

  // Visas när pappa bajsar på sig
  olyckor: [
    t("Ett nytt kapitel börjar.", "A new chapter begins."),
    t("Ibland går det inte som man tänkt.", "Sometimes things don't go as planned."),
    t("Det här stannar mellan oss.", "This stays between us."),
    t("Andas lugnt. Det har hänt de bästa.", "Breathe. It happens to the best of us."),
    t("Vi pratar inte mer om det här.", "We will never speak of this again."),
    t("Det där var ingen fis.", "That was not a fart."),
  ],

  // Det folk säger när de känner lukten
  luktar: [t("Vad luktar det?", "What's that smell?"), t("Fy!", "Ew!"), t("Någon har ätit ägg.", "Someone ate eggs."), t("Usch, vad är det som luktar?", "Yuck, what is that smell?")],

  // Titeln man får när spelet är slut, efter hur många poäng man fick
  titlar: [
    { poang: 0, namn: t("Pruttpraktikant", "Toot Trainee") },
    { poang: 600, namn: t("Gasexpert", "Gas Expert") },
    { poang: 1500, namn: t("Ventilansvarig", "Chief Valve Officer") },
    { poang: 3000, namn: t("Fismästare", "Fart Master") },
    { poang: 5000, namn: t("Klimatbov", "Climate Villain") },
  ],

  // ---------------------------------------------------------------
  //  BANORNA
  //
  //  Varje bana har en tidslinje. Varje rad är en bit av banan:
  //    tid     = hur många sekunder biten är
  //    niva    = hur mycket det låter i rummet (0–100). Fisar som är
  //              mindre än så hörs inte.
  //    ikon    = det som syns bredvid ljudmätaren
  //    text    = det som står under ljudmätaren (om man vill)
  //    ljud    = ett ljud som spelas när biten börjar (om man vill)
  //    musik   = musik som spelas under biten: "hiss", "sang", "brud" eller "marsch"
  //    puls    = [på, av]: ljudet kommer och går (sekunder på och av)
  //    ansikte = hur alla i rummet ser ut under biten
  //    sorl    = hur mycket folk pratar i bakgrunden (0–1)
  //
  //  "folk" är de som står i rummet. pos är var de står: minus är till
  //  vänster om pappa och plus till höger.
  // ---------------------------------------------------------------
  banor: [
    {
      namn: t("Hissen", "The Elevator"),
      ikon: "🛗",
      rum: "hiss",
      tips: t("Hissmusiken döljer små fisar. Vänta in plinget!", "Elevator music hides small farts. Wait for the ding!"),
      hund: { bild: "🐕", namn: "Fido", pos: 1.15 },
      folk: [
        { pos: -3.3, troja: "#27ae60", har: "#e0b34a" },
        { pos: -1.9, troja: "#34495e", har: "#2c2c2c" },
        { pos: 2.2, troja: "#8e44ad", har: "#b5462f" },
      ],
      horde: [t("Vem var det?", "Who did that?"), t("Öh…", "Uh…"), t("Nu tar jag trappan.", "I'm taking the stairs."), t("Någon har ätit bönor.", "Someone ate beans.")],
      tidslinje: [
        { tid: 3.5, niva: 28, ikon: "🎵", musik: "hiss", text: t("Släpp fisen i det blå, så hör ingen!", "Let it go in the blue and nobody hears!") },
        { tid: 0.9, niva: 80, ikon: "🔔", ljud: "pling", musik: "hiss" },
        { tid: 3.5, niva: 28, ikon: "🎵", musik: "hiss" },
        { tid: 1.4, niva: 58, ikon: "🤧", ljud: "hosta", musik: "hiss", text: t("Någon hostar.", "Someone coughs.") },
        { tid: 3, niva: 28, ikon: "🎵", musik: "hiss" },
        { tid: 2.5, niva: 62, ikon: "🚪", ljud: "dorrar", musik: "hiss", text: t("Dörrarna öppnas…", "The doors open…") },
        { tid: 4.5, niva: 5, ikon: "🤫", ansikte: "😐", text: t("Oj! Musiken tystnade…", "Uh-oh! The music stopped…") },
        { tid: 3, niva: 28, ikon: "🎵", musik: "hiss" },
        { tid: 0.9, niva: 80, ikon: "🔔", ljud: "pling", musik: "hiss" },
        { tid: 3, niva: 28, ikon: "🎵", musik: "hiss" },
        { tid: 1.2, niva: 85, ikon: "🤧", ljud: "nys", musik: "hiss", text: t("ATJO!", "ACHOO!") },
        { tid: 4, niva: 28, ikon: "🎵", musik: "hiss" },
        { tid: 1.5, niva: 82, ikon: "🔔", ljud: "pling", text: t("Framme!", "We're here!") },
      ],
    },
    {
      namn: t("Biblioteket", "The Library"),
      ikon: "📚",
      rum: "bibliotek",
      tips: t("Här är det tyst. Väldigt tyst.", "It's quiet here. Very quiet."),
      hund: { bild: "🦮", namn: "Sixten", pos: 1.15 },
      folk: [
        { pos: -3.3, troja: "#7f8c8d", har: "#cfcfcf", ansikte: "😐" },
        { pos: -1.9, troja: "#e67e22", har: "#5a3a22" },
        { pos: 2.2, troja: "#2c3e50", har: "#8a6a4a" },
        { pos: 3.5, troja: "#ff7a59", har: "#e0b34a", liten: true },
      ],
      horde: [t("SCHHH!", "SHHH!"), t("Vad var det där?!", "What was that?!"), t("Det här är ett bibliotek!", "This is a library!")],
      tidslinje: [
        { tid: 4, niva: 4, ikon: "🤫", text: t("Schhh… här måste man vara tyst.", "Shhh… you have to be quiet here.") },
        { tid: 4, niva: 60, ikon: "📚", ljud: "stampel", puls: [0.3, 0.5], text: t("Bibliotekarien stämplar böcker.", "The librarian stamps books.") },
        { tid: 3, niva: 4, ikon: "🤫" },
        { tid: 3, niva: 50, ikon: "🛒", ljud: "vagn", text: t("Bokvagnen gnisslar.", "The book cart squeaks.") },
        { tid: 3, niva: 4, ikon: "🤫" },
        { tid: 2, niva: 82, ikon: "👶", ljud: "bebis", text: t("En bebis skriker!", "A baby is screaming!") },
        { tid: 1.2, niva: 45, ikon: "🤫", ljud: "schh", text: t("SCHHH!", "SHHH!") },
        { tid: 4, niva: 4, ikon: "🤫" },
        { tid: 3, niva: 52, ikon: "🖨️", ljud: "skrivare", text: t("Skrivaren skriver ut.", "The printer is printing.") },
        { tid: 3, niva: 4, ikon: "🤫" },
        { tid: 0.7, niva: 88, ikon: "📕", ljud: "bok", text: t("BOM! Någon tappade en tjock bok.", "BOOM! Someone dropped a big book.") },
        { tid: 3.5, niva: 4, ikon: "🤫" },
        { tid: 4, niva: 60, ikon: "📚", ljud: "stampel", puls: [0.3, 0.5] },
      ],
    },
    {
      namn: t("Mormor fyller 80", "Grandma Turns 80"),
      ikon: "🎂",
      rum: "kalas",
      tips: t("Vänta in sången. Då är det fritt fram!", "Wait for the song. Then go for it!"),
      hund: { bild: "🐕", namn: "Ludde", pos: 1.15 },
      folk: [
        { pos: -3.5, troja: "#16a085", har: "#3b2a1a", hatt: "fest" },
        { pos: -2.0, troja: "#9b59b6", ansikte: "👵", sitter: true, dov: true },
        { pos: 2.2, troja: "#f1c40f", har: "#5a3a22", liten: true, hatt: "fest" },
        { pos: 3.5, troja: "#e84393", har: "#2c2c2c", hatt: "fest" },
      ],
      horde: [t("Vem var det?", "Who did that?"), t("Men pappa!", "Oh, Dad!"), t("Usch!", "Yuck!"), t("Inte på kalaset!", "Not at the party!")],
      tidslinje: [
        { tid: 5, niva: 32, ikon: "🗣️", sorl: 1, text: t("Alla pratar i munnen på varandra.", "Everyone is talking at once.") },
        { tid: 1.5, niva: 40, ikon: "🥂", ljud: "klirr", text: t("Pling pling! Morbror ska hålla tal.", "Ding ding! Uncle is giving a speech.") },
        { tid: 6, niva: 10, ikon: "🎤", ljud: "tal", text: t("Mormor, du är som en fin ost. Bättre med åren!", "Grandma, you're like a fine cheese. Better with age!") },
        { tid: 3, niva: 85, ikon: "👏", ljud: "applad", ansikte: "😃" },
        { tid: 4, niva: 32, ikon: "🗣️", sorl: 1 },
        { tid: 12, niva: 88, ikon: "🎶", musik: "sang", ansikte: "😄", text: t("Alla sjunger för mormor! Fritt fram!", "Everyone sings for Grandma! Go for it!") },
        { tid: 2.4, niva: 90, ikon: "🎉", ljud: "hurra", puls: [0.35, 0.25], pulsNiva: 20, ansikte: "😄", text: t("Hurra! Hurra! Hurra!", "Hip hip hooray!") },
        { tid: 3.5, niva: 6, ikon: "🕯️", ansikte: "😐", text: t("Schh… mormor ska blåsa ut ljusen.", "Shhh… Grandma is blowing out the candles.") },
        { tid: 2.5, niva: 85, ikon: "👏", ljud: "applad", ansikte: "😃" },
        { tid: 4, niva: 32, ikon: "🗣️", sorl: 1 },
      ],
    },
    {
      namn: t("Bröllopet", "The Wedding"),
      ikon: "💒",
      rum: "kyrka",
      tips: t("Orgeln är din bästa vän.", "The organ is your best friend."),
      hund: null, // Ingen hund i kyrkan...
      folk: [
        { pos: -3.4, troja: "#2c3e50", har: "#2c2c2c" },
        { pos: -1.9, troja: "#e84393", har: "#b5462f", hatt: "dam" },
        { pos: 1.9, troja: "#34495e", har: "#8a6a4a" },
        { pos: 3.4, troja: "#f39c12", har: "#e8e8e8", hatt: "dam" },
      ],
      horde: [t("Det här är en kyrka!", "This is a church!"), t("Åh nej…", "Oh no…"), t("Var det orgeln?", "Was that the organ?"), t("Inte nu!", "Not now!")],
      tidslinje: [
        { tid: 9, niva: 72, ikon: "🎹", musik: "brud", ansikte: "🥲", text: t("Här kommer bruden! Orgeln spelar.", "Here comes the bride! The organ plays.") },
        { tid: 5, niva: 16, ikon: "🗣️", ljud: "tal", text: t("Vi är samlade här i dag…", "We are gathered here today…") },
        { tid: 5, niva: 3, ikon: "🤫", ansikte: "😐", text: t("Om någon har något att invända, tala nu…", "If anyone objects, speak now…") },
        { tid: 2, niva: 16, ikon: "🗣️", text: t("…eller tig för alltid.", "…or forever hold your peace.") },
        { tid: 1.5, niva: 30, ikon: "💍", text: t("JA!", "I DO!") },
        { tid: 4, niva: 86, ikon: "👏", ljud: "applad", ansikte: "😃", text: t("Ni får kyssa varandra!", "You may now kiss!") },
        { tid: 3, niva: 14, ikon: "🗣️" },
        { tid: 1.3, niva: 72, ikon: "🤧", ljud: "snyt", text: t("Moster snyter sig. Högt.", "Auntie blows her nose. Loudly.") },
        { tid: 3, niva: 14, ikon: "🗣️" },
        { tid: 9, niva: 84, ikon: "🎺", musik: "marsch", ansikte: "😃", text: t("Bröllopsmarschen! Ut ur kyrkan!", "The wedding march! Out of the church!") },
      ],
    },
  ],
};

// ---------------------------------------------------------------------
//  Härifrån och ner är själva spelet.
//
//  Allt mäts i "enheter". Pappa är ungefär 3,3 enheter lång. Variabeln
//  u säger hur många pixlar en enhet är på just den här skärmen.
// ---------------------------------------------------------------------

const S = INSTALLNINGAR;
const canvas = document.getElementById("spel");
const ctx = canvas.getContext("2d");
const hemKnapp = document.getElementById("hem");
const pausKnapp = document.getElementById("paus");
const pausmeny = document.getElementById("pausmeny");
const musikKnapp = document.getElementById("musikKnapp");
const TYPSNITT = 'ui-rounded, system-ui, -apple-system, "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif';

const OLYCKA_TID = 3; // Sekunder som allt står still när pappa har bajsat på sig
const ANSIKTEN = ["😌", "😬", "😰", "😱"]; // Pappas ansikte på mätaren: lugn, kurrar, svettas, panik
const NEUTRALA = ["🙂", "😊", "😐"];

let bredd = 0;
let hojd = 0;
let u = 0;
let marginal = { topp: 0, vanster: 0, hoger: 0, botten: 0 };
let golvY = 0;     // Där fötterna står (pixlar)
let horisont = 0;  // Där väggen slutar och golvet börjar
let mittX = 0;     // Där pappa står
let spridning = 1; // Hur utspridda de andra står (mer på breda skärmar)
let hissDorr = null;

// Hur skarpt spelet ritas. Hinner enheten inte med sänks det av sig självt.
let pixelSkala = Math.min(window.devicePixelRatio || 1, 2);
let bildtider = [];
const emojiMinne = new Map(); // Färdigritade emojis
const bakgrund = document.createElement("canvas"); // Rummet, ritat en gång
let bakgrundRum = "";

let lage = "start"; // "start", "spelar", "paus" eller "slut"
let fas = "intro";  // När man spelar: "intro" (banans namn), "bana" eller "klar"
let fasTid = 0;
let poang = 0;
let rekord = lasRekord();
let tid = 0;
let tidSedanSlut = 0;
let startTips = slumpa(S.tips);
let introTips = "";

let dag = 1;
let banNr = 0;
let banTid = 0;
let banLangd = 0;
let segNr = -1;
let segStart = [];
let vaning = 1;

let tryck = 0;         // 0–100. Hur hårt pappa krystar.
let krystar = false;
let krystPekare = null; // Fingret (eller tangenten) som håller
let grans = 80;        // Vid det här trycket bajsar pappa på sig. Hemligt!
let varn = [50, 60, 70]; // Där kurr, svett och panik börjar
let steg = 0;          // 0 = lugn, 1 = kurr, 2 = svett, 3 = panik
let blubbTid = 0;
let vila = 0;
let omgivning = 0;     // Hur mycket det låter i rummet just nu

let underbyxor = [];   // 0 = rena, 1 = bromsspår, 2 = slut
let hundKvar = 0;
let hundFonster = 0;   // Tid kvar som man kan skylla på hunden
let hordaPoang = 0;
let olyckaTid = 0;
let olyckaText = "";
let slutOm = 0;
let lattnadTid = 0;
let rodnadTid = 0;
let skakning = 0;
let pappaPrat = "";
let pappaPratTid = 0;
let tips = "";
let tipsTid = 0;

let folk = [];
let hund = null;
let moln = [];   // Lukten
let texter = []; // Texter som flyger upp
let noter = [];  // Noter när alla sjunger
let fisNr = 0;
let luktKommenterad = -1;

let banPoang = 0;
let banFisar = 0;
let banSmyg = 0;
let antalFisar = 0;
let antalSmyg = 0;
let storstaTryck = 0;
let storstaFis = "";

// ---------- Små hjälpfunktioner ----------

function slumpa(lista) {
  return lista[Math.floor(Math.random() * lista.length)];
}

function begr(v, minst, mest) {
  return Math.min(mest, Math.max(minst, v));
}

// Ger samma "slumptal" varje gång för samma n (så att böckerna inte blinkar)
function slumpTal(n) {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
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

// 1.5 blir "1,5" på svenska och "1.5" på engelska
function tal(v) {
  return t(String(v).replace(".", ","), String(v));
}

// Engelska: 1 fart, 2 farts
function antal(n, ett, flera) {
  return n + " " + (n === 1 ? ett : flera);
}

function bana() {
  return S.banor[banNr];
}

function segment() {
  return segNr >= 0 ? bana().tidslinje[segNr] : null;
}

function personX(p) {
  return mittX + p.pos * spridning * u;
}

function hundX() {
  return mittX + hund.pos * u;
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

  u = Math.min(bredd / 7.5, hojd / 9.5);
  golvY = hojd - marginal.botten - u * 1.9; // Under fötterna finns plats för hundknappen
  horisont = golvY - u * 0.55;
  mittX = (marginal.vanster + bredd - marginal.hoger) / 2;
  spridning = begr(((bredd - marginal.vanster - marginal.hoger) / 2 / u - 0.8) / 3.7, 0.7, 1.5);
  emojiMinne.clear();
  bakgrundRum = ""; // Rummet ritas om nästa gång
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

function hundKnapp() {
  const r = begr(u * 0.75, 34, 58);
  return { x: bredd - marginal.hoger - r - 16, y: hojd - marginal.botten - r - 16, r };
}

canvas.addEventListener("pointerdown", (e) => {
  e.preventDefault();
  startaLjud();
  if (lage === "start" || (lage === "slut" && tidSedanSlut > 1)) {
    startaSpel();
    return;
  }
  if (lage !== "spelar") return;
  if (fas === "intro") {
    if (fasTid > 0.6) borjaBana();
    return;
  }
  if (fas === "klar") {
    if (fasTid > 1) nastaBana();
    return;
  }
  const k = hundKnapp();
  if (Math.hypot(e.clientX - k.x, e.clientY - k.y) < k.r * 1.15) {
    skyllPaHunden();
    return;
  }
  if (krystar) return;
  if (borjaKrysta()) {
    krystPekare = e.pointerId;
    try {
      canvas.setPointerCapture(e.pointerId);
    } catch (fel) {
      // Gör inget – det fungerar ändå
    }
  }
});

function slappFinger(e) {
  if (krystar && e.pointerId === krystPekare) slappFis();
}
canvas.addEventListener("pointerup", slappFinger);
canvas.addEventListener("pointercancel", slappFinger);

function arKnapp(e) {
  return e.key === " " || e.key === "Enter" || e.key === "ArrowDown";
}

window.addEventListener("keydown", (e) => {
  if (e.key === "p" || e.key === "Escape") {
    if (lage === "spelar") pausa();
    else if (lage === "paus") fortsatt();
    return;
  }
  if (e.repeat) return;
  if (lage === "start" || (lage === "slut" && tidSedanSlut > 1)) {
    if (arKnapp(e)) {
      startaLjud();
      startaSpel();
    }
    return;
  }
  if (lage !== "spelar") return;
  if (fas === "intro") {
    if (arKnapp(e) && fasTid > 0.6) borjaBana();
    return;
  }
  if (fas === "klar") {
    if (arKnapp(e) && fasTid > 1) nastaBana();
    return;
  }
  if (e.key === "h" || e.key === "H") {
    skyllPaHunden();
    return;
  }
  if (arKnapp(e) && !krystar) {
    e.preventDefault();
    startaLjud();
    if (borjaKrysta()) krystPekare = "tangent";
  }
});

window.addEventListener("keyup", (e) => {
  if (arKnapp(e) && krystar && krystPekare === "tangent") slappFis();
});

// Stoppa nyp-zoom i Safari på iPad/iPhone
document.addEventListener("gesturestart", (e) => e.preventDefault());

// ---------- Paus ----------

function pausa() {
  if (lage !== "spelar") return;
  lage = "paus";
  // Håller man inne när man pausar försvinner trycket, utan fis
  krystar = false;
  krystPekare = null;
  tryck = 0;
  steg = 0;
  pausmeny.hidden = false;
  tystaLjud(true);
  document.getElementById("fortsatt").focus();
}

function fortsatt() {
  if (lage !== "paus") return;
  lage = "spelar";
  pausmeny.hidden = true;
  startaLjud();
  tystaLjud(false);
}

function visaMusikKnapp() {
  musikKnapp.textContent = musikPa ? t("♪ Musik: på", "♪ Music: on") : t("♪ Musik: av", "♪ Music: off");
}

pausKnapp.addEventListener("click", pausa);
document.getElementById("fortsatt").addEventListener("click", fortsatt);
document.getElementById("borjaOm").addEventListener("click", () => {
  pausmeny.hidden = true;
  startaLjud();
  tystaLjud(false);
  startaSpel();
});
musikKnapp.addEventListener("click", () => {
  musikPa = !musikPa;
  sparaInstallning("musik-fis", musikPa ? "pa" : "av");
  visaMusikKnapp();
});

// Pausa av sig själv om man byter app eller flik
document.addEventListener("visibilitychange", () => {
  if (document.hidden) pausa();
});

// ---------- Spelets regler ----------

function startaSpel() {
  lage = "spelar";
  poang = 0;
  dag = 1;
  underbyxor = new Array(S.underbyxor).fill(0);
  antalFisar = 0;
  antalSmyg = 0;
  storstaTryck = 0;
  storstaFis = "";
  slutOm = 0;
  olyckaText = "";
  visaIntro(0);
}

function laddaBana(nr) {
  banNr = nr;
  const b = bana();
  folk = b.folk.map((p) => ({ ...p, reaktion: "", reaktionTid: 0, prat: "", pratTid: 0, luktat: -1, fas: Math.random() * 6 }));
  hund = b.hund ? { ...b.hund, argTid: 0 } : null;
  segStart = [];
  let summa = 0;
  for (const s of b.tidslinje) {
    segStart.push(summa);
    summa += s.tid;
  }
  banLangd = summa;
  banTid = 0;
  segNr = -1;
  vaning = 1;
  omgivning = b.tidslinje[0].niva;
  moln = [];
  texter = [];
  noter = [];
  tryck = 0;
  krystar = false;
  krystPekare = null;
  steg = 0;
  vila = 0;
  olyckaTid = 0;
  lattnadTid = 0;
  rodnadTid = 0;
  pappaPratTid = 0;
  tipsTid = 0;
  hundKvar = S.hundGanger;
  hundFonster = 0;
  banPoang = 0;
  banFisar = 0;
  banSmyg = 0;
}

function visaIntro(nr) {
  laddaBana(nr);
  fas = "intro";
  fasTid = 0;
  introTips = slumpa(S.tips);
}

function borjaBana() {
  fas = "bana";
  fasTid = 0;
  vila = 0.3;
  nyGrans();
}

function avslutaBana() {
  if (krystar) slappFis();
  fas = "klar";
  fasTid = 0;
  effekt("klar");
}

function nastaBana() {
  let nr = banNr + 1;
  if (nr >= S.banor.length) {
    nr = 0;
    dag += 1;
  }
  visaIntro(nr);
}

function slutaSpel() {
  lage = "slut";
  tidSedanSlut = 0;
  krystar = false;
  pappaPratTid = 0;
  for (const p of folk) p.pratTid = 0;
  if (poang > rekord) {
    rekord = poang;
    sparaRekord(rekord);
  }
}

// Varje ny dag krystar pappa fortare, gränsen kan hamna lägre och
// varningarna kommer senare.
function svarighet() {
  const d = dag - 1;
  return {
    fart: S.krystFart * (1 + d * 0.15),
    min: Math.max(28, S.grans[0] - d * S.svarareVarjeDag),
    max: Math.max(40, Math.min(99, S.grans[1] - d * 2)),
    varning: Math.max(0.55, 1 - d * 0.12),
  };
}

// Slumpar var gränsen hamnar till nästa fis
function nyGrans() {
  const sv = svarighet();
  grans = sv.min + Math.random() * (sv.max - sv.min);
  const v = S.varningar;
  const darr = () => (Math.random() - 0.5) * 4;
  varn = [
    grans - v.kurr * sv.varning + darr(),
    grans - v.svett * sv.varning + darr(),
    grans - Math.max(2.5, v.panik * sv.varning + darr() * 0.5),
  ];
}

function kvarUnderbyxor() {
  return underbyxor.filter((s) => s < 2).length;
}

function ge(mangd) {
  poang += mangd;
  banPoang += mangd;
}

function textHojd(stor) {
  return u * (stor ? 0.42 : 0.32) * 1.3;
}

function flyg(text, x, y, farg = "#ffffff", stor = false) {
  // Flyger det redan texter på samma ställe flyttas de upp, så att de inte hamnar på varandra
  const nyHalv = textHojd(stor) / 2;
  let tak = y - nyHalv;
  const ivagen = texter
    .filter((tx) => Math.abs(tx.x - x) < u * 3 && tx.y - textHojd(tx.stor) / 2 < y + nyHalv)
    .sort((a, b) => b.y - a.y);
  for (const tx of ivagen) {
    const halv = textHojd(tx.stor) / 2;
    if (tx.y + halv > tak) tx.y = tak - halv;
    tak = tx.y - halv;
  }
  texter.push({ text, x, y, farg, stor, kvar: 1.7 });
}

function visaTips(text, langd) {
  tips = text;
  tipsTid = langd;
}

function reagera(p, ansikte, langd) {
  p.reaktion = ansikte;
  p.reaktionTid = langd;
}

function sag(p, text, langd = 2.2) {
  p.prat = text;
  p.pratTid = langd;
}

function pappaSager(text, langd = 2) {
  pappaPrat = text;
  pappaPratTid = langd;
}

function borjaKrysta() {
  if (fas !== "bana" || olyckaTid > 0 || vila > 0 || slutOm > 0) return false;
  krystar = true;
  steg = 0;
  return true;
}

function valjFis(t) {
  let niva = 0;
  for (const f of S.fisar) if (f.fran <= t && f.fran > niva) niva = f.fran;
  return slumpa(S.fisar.filter((f) => f.fran === niva));
}

function slappFis() {
  if (!krystar) return;
  krystar = false;
  krystPekare = null;
  const kraft = tryck;
  tryck = 0;
  steg = 0;
  vila = S.vilaEfterFis;
  if (kraft < S.minstaFis) {
    if (kraft > 2) flyg(t("…inget kom", "…nothing came out"), mittX, golvY - u * 4.6);
    return;
  }

  fisNr += 1;
  const typ = valjFis(kraft);
  const hords = kraft > omgivning + 2;
  const nara = kraft >= grans - S.bromsspar;
  let ganger = 1;
  if (!hords) ganger *= S.poang.ingenHorde;
  if (nara) ganger *= S.poang.bromsspar;
  const p = Math.max(1, Math.round((kraft * kraft) / 100 * ganger));
  ge(p);
  antalFisar += 1;
  banFisar += 1;
  if (kraft > storstaTryck) {
    storstaTryck = kraft;
    storstaFis = typ.namn;
  }

  let y = golvY - u * 4.6;
  flyg(`${typ.namn} +${p}`, mittX, y, "#ffffff", true);
  y += u * 0.5;
  if (hords) {
    flyg(t("Det hördes! 😳", "They heard it! 😳"), mittX, y, "#ffb3b3");
    folkHorde(p);
  } else {
    antalSmyg += 1;
    banSmyg += 1;
    flyg(t(`Ingen hörde! ×${tal(S.poang.ingenHorde)}`, `Nobody heard! ×${tal(S.poang.ingenHorde)}`), mittX, y, "#9dffb0");
    lattnadTid = 0.9;
    effekt("smyg");
  }
  y += u * 0.45;
  if (nara) {
    flyg(t(`Bromsspår! ×${tal(S.poang.bromsspar)}`, `Skid marks! ×${tal(S.poang.bromsspar)}`), mittX, y, "#e8a868");
    bromsspar();
  }

  fisLjud(kraft, typ.ljud, !hords);
  puffa(kraft, fisNr);
  nyGrans();
}

// Lukten kommer ut bakom pappa och sprider sig åt sidorna
function puffa(t, nr) {
  const antal = 5 + Math.round(t / 9);
  for (let i = 0; i < antal; i++) {
    const sida = Math.random() < 0.5 ? -1 : 1;
    moln.push({
      x: mittX + sida * u * 0.35,
      y: golvY - u * (1.0 + Math.random() * 0.3),
      vx: sida * u * (0.3 + Math.random() * 0.9) * (0.5 + t / 100),
      vy: -u * (0.05 + Math.random() * 0.25),
      r: u * (0.18 + Math.random() * 0.15) * (0.6 + t / 100),
      vaxt: u * (0.25 + Math.random() * 0.3),
      liv: 0,
      max: 2.6 + Math.random() * 1.5 + t / 50,
      fis: nr,
    });
  }
}

function folkHorde(p) {
  hordaPoang = p;
  hundFonster = 3;
  rodnadTid = 2.4;
  const pratare = slumpa(folk);
  for (const q of folk) {
    if (q.dov) {
      // Mormor hör inte så bra
      if (q === pratare || Math.random() < 0.5) sag(q, t("Vad sa du?", "Say what?"));
      continue;
    }
    reagera(q, slumpa(["😳", "🤨", "😮"]), 2.4);
  }
  if (!pratare.dov) sag(pratare, slumpa(bana().horde));
  effekt("horde");
}

function olycka() {
  krystar = false;
  krystPekare = null;
  tryck = 0;
  steg = 0;
  olyckaTid = OLYCKA_TID;
  olyckaText = slumpa(S.olyckor);
  skakning = 0.5;
  const i = underbyxor.findIndex((s) => s < 2);
  if (i >= 0) underbyxor[i] = 2;
  for (const q of folk) reagera(q, slumpa(["😱", "🤢", "😳"]), OLYCKA_TID);
  sag(slumpa(folk), t("Oj.", "Oops."), 2);
  fisNr += 1;
  puffa(30, fisNr);
  effekt("olycka");
  nyGrans();
}

function bromsspar() {
  const i = underbyxor.findIndex((s) => s < 2);
  if (i < 0) return;
  underbyxor[i] += 1;
  if (underbyxor[i] === 2) visaTips(t("Dags att byta underbyxor!", "Time for clean underpants!"), 2.5);
  if (kvarUnderbyxor() === 0) {
    olyckaText = t("Det blev ett bromsspår för mycket.", "One skid mark too many.");
    slutOm = 2;
  }
}

function skyllPaHunden() {
  if (fas !== "bana" || olyckaTid > 0 || slutOm > 0) return;
  if (hundFonster <= 0) {
    visaTips(t("Skyll på hunden när någon har hört en fis!", "Blame the dog when someone hears a fart!"), 2);
    return;
  }
  if (hundKvar <= 0) {
    visaTips(t("Ingen tror på det längre…", "Nobody believes that anymore…"), 2);
    return;
  }
  hundFonster = 0;
  hundKvar -= 1;

  if (!hund) {
    // Det finns ingen hund här. Dubbelt pinsamt!
    const minus = Math.min(poang, hordaPoang);
    poang -= minus;
    banPoang -= minus;
    pappaSager(t("Fy, hunden!", "Bad dog!"));
    const q = slumpa(folk);
    sag(q, t("Vilken hund?", "What dog?"), 2.5);
    for (const r of folk) reagera(r, "🤨", 2.5);
    flyg(t(`Det finns ingen hund här! −${minus}`, `There is no dog here! −${minus}`), mittX, golvY - u * 5.1, "#ffb3b3", true);
    rodnadTid = 3;
    effekt("syrsor");
    return;
  }

  const extra = Math.round(hordaPoang * (S.poang.hunden - 1));
  ge(extra);
  pappaSager(t(`Fy, ${hund.namn}!`, `Bad ${hund.namn}!`));
  hund.argTid = 2.5;
  for (const r of folk) {
    if (!r.dov) reagera(r, "😒", 2.2);
  }
  flyg(t(`Hunden fick skulden! +${extra}`, `The dog got the blame! +${extra}`), mittX, golvY - u * 5.1, "#ffe14d", true);
  rodnadTid = 0;
  effekt("voff");
}

function luktKommentar() {
  if (hund && Math.random() < 0.4) return t(`Har ${hund.namn} ätit något konstigt?`, `${hund.namn}, what did you eat?`);
  return slumpa(S.luktar);
}

function startaSegment(s) {
  if (s.text) visaTips(s.text, Math.min(s.tid + 0.3, 4));
  if (s.ljud) effekt(s.ljud, s);
  if (s.ljud === "pling") vaning += 1;
}

// Hur mycket det ska låta i rummet just nu
function malNiva() {
  const s = segment();
  if (!s) return 0;
  if (s.puls) {
    const t = banTid - segStart[segNr];
    const varv = s.puls[0] + s.puls[1];
    return t % varv < s.puls[0] ? s.niva : s.pulsNiva !== undefined ? s.pulsNiva : 4;
  }
  return s.niva;
}

// Lukten, texterna och folkets miner. Det rör sig även när spelet står still.
function uppdateraPynt(dt) {
  for (const t of texter) {
    t.y -= u * 0.55 * dt;
    t.kvar -= dt;
  }
  texter = texter.filter((t) => t.kvar > 0);

  for (const n of noter) {
    n.y -= u * 0.8 * dt;
    n.x += Math.sin(tid * 3 + n.fas) * u * 0.3 * dt;
    n.kvar -= dt;
  }
  noter = noter.filter((n) => n.kvar > 0);

  for (const m of moln) {
    m.liv += dt;
    m.x += m.vx * dt;
    m.y += m.vy * dt;
    m.vx *= 1 - Math.min(1, dt * 0.6);
    m.r += m.vaxt * dt;
    if (lage !== "spelar" || m.liv < 0.5) continue;
    // Når lukten någon så känner de den
    for (const p of folk) {
      if (p.luktat === m.fis) continue;
      if (Math.abs(personX(p) - m.x) < u * 0.6 + m.r * 0.5) {
        p.luktat = m.fis;
        if (p.reaktionTid < 0.5) reagera(p, "🤢", 2.2);
        if (luktKommenterad !== m.fis && p.pratTid <= 0 && Math.random() < 0.5) {
          luktKommenterad = m.fis;
          sag(p, luktKommentar());
        }
      }
    }
  }
  moln = moln.filter((m) => m.liv < m.max);

  for (const p of folk) {
    p.reaktionTid -= dt;
    p.pratTid -= dt;
  }
  if (hund) hund.argTid -= dt;

  // Noter flyger upp när alla sjunger
  const s = segment();
  if (lage === "spelar" && fas === "bana" && olyckaTid <= 0 && s && s.musik === "sang" && Math.random() < dt * 3) {
    const p = slumpa(folk);
    noter.push({ x: personX(p) + (Math.random() - 0.5) * u * 0.6, y: golvY - u * 3, bild: slumpa(["🎵", "🎶"]), fas: Math.random() * 6, kvar: 1.5 });
  }
}

function uppdatera(dt) {
  if (lage === "paus") return; // Allt står still under pausen
  tid += dt;
  uppdateraPynt(dt);
  if (lage === "slut") {
    tidSedanSlut += dt;
    return;
  }
  if (lage !== "spelar") return;

  fasTid += dt;
  if (fas === "intro") {
    if (fasTid > 4.5) borjaBana();
    return;
  }
  if (fas === "klar") {
    if (fasTid > 3.5) nastaBana();
    return;
  }

  skakning = Math.max(0, skakning - dt);
  lattnadTid -= dt;
  rodnadTid -= dt;
  pappaPratTid -= dt;
  tipsTid -= dt;

  // När pappa har bajsat på sig står allt still en stund
  if (olyckaTid > 0) {
    olyckaTid -= dt;
    if (olyckaTid <= 0 && kvarUnderbyxor() === 0) slutaSpel();
    return;
  }
  if (slutOm > 0) {
    slutOm -= dt;
    if (slutOm <= 0) {
      slutaSpel();
      return;
    }
  }

  banTid += dt;
  const b = bana();
  while (segNr + 1 < b.tidslinje.length && banTid >= segStart[segNr + 1]) {
    segNr += 1;
    startaSegment(b.tidslinje[segNr]);
  }
  omgivning += (malNiva() - omgivning) * Math.min(1, dt * 14);
  vila -= dt;
  hundFonster -= dt;

  if (krystar) {
    tryck += svarighet().fart * (1 + tryck / 100) * dt;
    const nytt = tryck >= varn[2] ? 3 : tryck >= varn[1] ? 2 : tryck >= varn[0] ? 1 : 0;
    if (nytt > steg) {
      if (nytt === 1) {
        effekt("kurr");
        flyg(t("*kurr*", "*grumble*"), mittX + u * 0.9, golvY - u * 2.1, "#ffffff");
      }
      if (nytt === 3) {
        effekt("blubb");
        blubbTid = 0.55;
        flyg(t("*blubb*", "*blub*"), mittX - u * 0.9, golvY - u * 1.5, "#e8a868");
      }
      steg = nytt;
    }
    if (steg === 3) {
      blubbTid -= dt;
      if (blubbTid <= 0) {
        effekt("blubb");
        blubbTid = 0.55;
      }
    }
    if (tryck >= grans) olycka();
  }

  if (banTid >= banLangd && olyckaTid <= 0 && slutOm <= 0) avslutaBana();
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

function ritaEmoji(bild, x, y, storlek, just = "center", c = ctx) {
  const liten = emojiBild(bild, storlek);
  const sida = liten.width / pixelSkala;
  let vanster = x - sida / 2;
  if (just === "left") vanster = x - (sida - storlek) / 2;
  if (just === "right") vanster = x - storlek - (sida - storlek) / 2;
  c.drawImage(liten, vanster, y - sida / 2, sida, sida);
}

// ---------- Rummen (ritas en gång på en egen bild) ----------

function ritaBakgrund() {
  bakgrund.width = canvas.width;
  bakgrund.height = canvas.height;
  const c = bakgrund.getContext("2d");
  c.setTransform(pixelSkala, 0, 0, pixelSkala, 0, 0);
  c.lineJoin = "round";
  c.lineCap = "round";
  const rum = bana().rum;
  hissDorr = null;
  if (rum === "hiss") ritaHiss(c);
  else if (rum === "bibliotek") ritaBibliotek(c);
  else if (rum === "kalas") ritaKalas(c);
  else ritaKyrka(c);
  // Skugga där väggen möter golvet
  c.fillStyle = "rgba(0, 0, 0, 0.18)";
  c.fillRect(0, horisont, bredd, u * 0.08);
  bakgrundRum = rum;
}

// Hur högt upp man kan rita saker utan att de hamnar under poängen och mätaren
function hogstUpp() {
  return marginal.topp + 150;
}

function golvplankor(c, farg, linje) {
  c.fillStyle = farg;
  c.fillRect(0, horisont, bredd, hojd - horisont);
  c.strokeStyle = linje;
  c.lineWidth = 2;
  let steg = u * 0.25;
  for (let y = horisont + steg; y < hojd; y += steg) {
    c.beginPath();
    c.moveTo(0, y);
    c.lineTo(bredd, y);
    c.stroke();
    steg *= 1.25;
  }
}

function ritaHiss(c) {
  const vagg = c.createLinearGradient(0, 0, bredd, 0);
  const metall = ["#a9b1ba", "#d3d9df", "#b3bbc4", "#dfe4e9", "#a9b1ba"];
  metall.forEach((f, i) => vagg.addColorStop(i / (metall.length - 1), f));
  c.fillStyle = vagg;
  c.fillRect(0, 0, bredd, horisont);
  c.strokeStyle = "rgba(70, 80, 95, 0.25)";
  c.lineWidth = 2;
  const panel = u * 1.7;
  for (let x = mittX % panel; x < bredd; x += panel) {
    c.beginPath();
    c.moveTo(x, 0);
    c.lineTo(x, horisont);
    c.stroke();
  }

  // Dörrarna (själva dörrarna ritas varje gång eftersom de kan öppnas)
  const db = u * 3.6;
  const dTopp = Math.max(hogstUpp(), horisont - u * 4.9);
  hissDorr = { x: mittX - db / 2, y: dTopp, b: db, h: horisont - dTopp, visare: null };
  c.fillStyle = "#59616b";
  c.fillRect(hissDorr.x - u * 0.18, dTopp - u * 0.18, db + u * 0.36, hissDorr.h + u * 0.18);
  if (dTopp - u * 0.95 > marginal.topp + 112) {
    hissDorr.visare = { x: mittX, y: dTopp - u * 0.6 };
    c.fillStyle = "#2b2f36";
    rundRekt(c, mittX - u * 0.75, dTopp - u * 0.95, u * 1.5, u * 0.65, u * 0.12);
    c.fill();
  }

  // Ledstång bredvid dörrarna
  const ly = golvY - u * 1.7;
  c.fillStyle = "#e9edf1";
  c.strokeStyle = "#6b7480";
  c.lineWidth = 2;
  for (const [a, b] of [[0, hissDorr.x - u * 0.4], [hissDorr.x + db + u * 0.4, bredd]]) {
    if (b - a < u * 0.3) continue;
    rundRekt(c, a, ly, b - a, u * 0.13, u * 0.06);
    c.fill();
    c.stroke();
  }

  // Knapparna
  const kx = hissDorr.x + db + u * 0.75;
  if (kx + u * 0.6 < bredd) {
    c.fillStyle = "#c2c9d1";
    rundRekt(c, kx, dTopp + u * 0.3, u * 0.55, u * 1.5, u * 0.1);
    c.fill();
    c.stroke();
    for (let i = 0; i < 4; i++) {
      c.fillStyle = i === 2 ? "#ffd27a" : "#eef1f4";
      c.beginPath();
      c.arc(kx + u * 0.275, dTopp + u * (0.55 + i * 0.33), u * 0.1, 0, Math.PI * 2);
      c.fill();
      c.stroke();
    }
  }

  // Golvet
  c.fillStyle = "#4f545b";
  c.fillRect(0, horisont, bredd, hojd - horisont);
  c.fillStyle = "rgba(255, 255, 255, 0.07)";
  const prick = u * 0.35;
  for (let y = horisont + prick * 0.7; y < hojd; y += prick) {
    for (let x = (y * 0.37) % prick; x < bredd; x += prick) {
      c.beginPath();
      c.arc(x, y, u * 0.04, 0, Math.PI * 2);
      c.fill();
    }
  }
}

function ritaHissDorrar() {
  const d = hissDorr;
  if (!d) return;
  let oppen = 0;
  const s = segment();
  if (lage === "spelar" && fas === "bana" && s && s.ljud === "dorrar") {
    oppen = Math.sin(Math.PI * begr((banTid - segStart[segNr]) / s.tid, 0, 1));
  }
  const glipa = d.b * 0.92 * oppen;
  if (glipa > 1) {
    // Korridoren utanför
    ctx.fillStyle = "#f3e3bf";
    ctx.fillRect(mittX - glipa / 2, d.y, glipa, d.h);
    ctx.fillStyle = "#c7a77a";
    ctx.fillRect(mittX - glipa / 2, d.y + d.h * 0.75, glipa, d.h * 0.25);
  }
  const halv = (d.b - glipa) / 2;
  ctx.fillStyle = "#c5ccd4";
  ctx.strokeStyle = "rgba(60, 70, 80, 0.5)";
  ctx.lineWidth = 2;
  ctx.fillRect(d.x, d.y, halv, d.h);
  ctx.strokeRect(d.x, d.y, halv, d.h);
  ctx.fillRect(d.x + d.b - halv, d.y, halv, d.h);
  ctx.strokeRect(d.x + d.b - halv, d.y, halv, d.h);
  if (d.visare) ritaText(`▲ ${vaning}`, d.visare.x, d.visare.y, u * 0.38, "#ff5a4f");
}

function ritaBibliotek(c) {
  c.fillStyle = "#5e3b20";
  c.fillRect(0, 0, bredd, horisont);
  const rad = u * 1.05;
  const farger = ["#b5523b", "#3d6b9a", "#4f8a4b", "#d9a43b", "#7a4f8a", "#2f4f5f", "#c97b4a", "#8c2f39"];
  let nr = 0;
  for (let botten = horisont - u * 0.1; botten > -rad; botten -= rad) {
    let x = 0;
    while (x < bredd) {
      nr += 1;
      const w = u * (0.13 + slumpTal(nr) * 0.13);
      const h = u * (0.6 + slumpTal(nr + 50) * 0.32);
      if (slumpTal(nr + 99) < 0.06) {
        x += w * 2; // En lucka i hyllan
        continue;
      }
      c.fillStyle = farger[Math.floor(slumpTal(nr + 7) * farger.length)];
      c.fillRect(x, botten - h, w - 1, h);
      c.fillStyle = "rgba(255, 255, 255, 0.25)";
      c.fillRect(x + w * 0.2, botten - h * 0.8, w * 0.6 - 1, u * 0.05);
      x += w;
    }
    c.fillStyle = "#8a5a33";
    c.fillRect(0, botten, bredd, u * 0.12);
  }
  c.fillStyle = "#6b4426";
  for (let x = (mittX % (u * 3.4)) - u * 0.07; x < bredd; x += u * 3.4) c.fillRect(x, 0, u * 0.14, horisont);

  // Skylten
  const sy = Math.max(hogstUpp() + u * 0.35, horisont - u * 6.5);
  if (sy < golvY - u * 3.8) {
    c.fillStyle = "#ffffff";
    c.strokeStyle = "#2b1d0e";
    c.lineWidth = 3;
    rundRekt(c, mittX - u * 1.25, sy - u * 0.32, u * 2.5, u * 0.64, u * 0.14);
    c.fill();
    c.stroke();
    ritaEmoji("🤫", mittX - u * 0.85, sy, u * 0.42, "center", c);
    c.fillStyle = "#2b1d0e";
    c.font = `bold ${u * 0.34}px ${TYPSNITT}`;
    c.textAlign = "center";
    c.textBaseline = "middle";
    c.fillText(t("TYST, TACK", "BE QUIET"), mittX + u * 0.2, sy);
  }

  golvplankor(c, "#b8895a", "rgba(90, 50, 20, 0.25)");
}

function ritaKalas(c) {
  c.fillStyle = "#fbe5cf";
  c.fillRect(0, 0, bredd, horisont);
  c.fillStyle = "rgba(240, 140, 160, 0.18)";
  for (let x = 0; x < bredd; x += u * 1.2) c.fillRect(x, 0, u * 0.5, horisont);
  golvplankor(c, "#c48d58", "rgba(90, 50, 20, 0.25)");

  // Flaggspel
  const fy = Math.max(hogstUpp(), horisont - u * 5.4);
  if (fy < golvY - u * 3.8) {
    const farger = ["#e84393", "#f1c40f", "#3498db", "#2ecc71", "#e67e22"];
    const svacka = u * 0.5;
    c.strokeStyle = "#7a5640";
    c.lineWidth = 2;
    c.beginPath();
    c.moveTo(0, fy);
    c.quadraticCurveTo(bredd / 2, fy + svacka * 2, bredd, fy);
    c.stroke();
    let i = 0;
    for (let x = u * 0.3; x < bredd; x += u * 0.6) {
      const t = x / bredd;
      const y = fy + svacka * 4 * t * (1 - t);
      c.fillStyle = farger[i % farger.length];
      c.beginPath();
      c.moveTo(x - u * 0.2, y);
      c.lineTo(x + u * 0.2, y);
      c.lineTo(x, y + u * 0.38);
      c.closePath();
      c.fill();
      i += 1;
    }
  }

  // Skylten
  const sy = Math.max(hogstUpp() + u * 0.9, horisont - u * 4.5);
  if (sy < golvY - u * 3.9) {
    const w = Math.min(bredd * 0.8, u * 6.5);
    c.fillStyle = "#ffffff";
    c.strokeStyle = "#e84393";
    c.lineWidth = 3;
    rundRekt(c, mittX - w / 2, sy - u * 0.35, w, u * 0.7, u * 0.2);
    c.fill();
    c.stroke();
    c.fillStyle = "#e84393";
    c.font = `bold ${u * 0.36}px ${TYPSNITT}`;
    c.textAlign = "center";
    c.textBaseline = "middle";
    c.fillText(t("GRATTIS MORMOR 80 ÅR!", "HAPPY 80TH, GRANDMA!"), mittX, sy, w - u * 0.4);
  }

  // Bord med tårta
  const tx = mittX - u * 1.15 * spridning;
  const bordY = horisont - u * 0.6;
  c.fillStyle = "#7a4e2b";
  c.fillRect(tx - u * 0.55, bordY, u * 0.1, horisont - bordY + u * 0.15);
  c.fillRect(tx + u * 0.45, bordY, u * 0.1, horisont - bordY + u * 0.15);
  c.fillStyle = "#ffffff";
  c.strokeStyle = "#e84393";
  c.lineWidth = 2;
  rundRekt(c, tx - u * 0.68, bordY - u * 0.08, u * 1.36, u * 0.22, u * 0.06);
  c.fill();
  c.stroke();
  ritaEmoji("🎂", tx, bordY - u * 0.45, u * 0.85, "center", c);

  // Ballonger
  const by = horisont - u * 3.4;
  if (by > hogstUpp()) {
    ritaEmoji("🎈", marginal.vanster + u * 0.7, by, u * 0.9, "center", c);
    ritaEmoji("🎈", bredd - marginal.hoger - u * 0.7, by - u * 0.3, u * 0.9, "center", c);
  }
}

function ritaFonster(c, x, y, w, h) {
  c.save();
  c.beginPath();
  c.moveTo(x - w / 2, y + h);
  c.lineTo(x - w / 2, y + w / 2);
  c.arc(x, y + w / 2, w / 2, Math.PI, 0);
  c.lineTo(x + w / 2, y + h);
  c.closePath();
  c.save();
  c.clip();
  const farger = ["#d6453d", "#3d6fd6", "#f2c94c", "#3fae6a", "#9b59b6"];
  const ruta = w / 3;
  let i = 0;
  for (let yy = y; yy < y + h; yy += ruta) {
    for (let xx = x - w / 2; xx < x + w / 2; xx += ruta) {
      c.fillStyle = farger[(i * 7 + Math.floor(yy / ruta)) % farger.length];
      c.fillRect(xx, yy, ruta, ruta);
      i += 1;
    }
  }
  c.strokeStyle = "rgba(40, 30, 20, 0.7)";
  c.lineWidth = 2;
  for (let yy = y; yy < y + h; yy += ruta) {
    c.beginPath();
    c.moveTo(x - w / 2, yy);
    c.lineTo(x + w / 2, yy);
    c.stroke();
  }
  for (let xx = x - w / 2; xx < x + w / 2; xx += ruta) {
    c.beginPath();
    c.moveTo(xx, y);
    c.lineTo(xx, y + h);
    c.stroke();
  }
  c.restore();
  c.strokeStyle = "#7a6a55";
  c.lineWidth = 4;
  c.stroke();
  c.restore();
}

function ritaKyrka(c) {
  c.fillStyle = "#ddd4c4";
  c.fillRect(0, 0, bredd, horisont);
  c.strokeStyle = "rgba(120, 100, 80, 0.18)";
  c.lineWidth = 2;
  const sten = u * 0.5;
  let radNr = 0;
  for (let y = horisont; y > 0; y -= sten) {
    c.beginPath();
    c.moveTo(0, y);
    c.lineTo(bredd, y);
    c.stroke();
    for (let x = (radNr % 2) * sten; x < bredd; x += sten * 2) {
      c.beginPath();
      c.moveTo(x, y);
      c.lineTo(x, y - sten);
      c.stroke();
    }
    radNr += 1;
  }

  // Fönster
  const fTopp = Math.max(hogstUpp(), horisont - u * 4.8);
  const fH = horisont - u * 1.2 - fTopp;
  if (fH > u * 0.8) {
    for (const pos of [-4.6, -2.6, 2.6, 4.6]) {
      const x = mittX + pos * spridning * u;
      if (x < -u || x > bredd + u) continue;
      ritaFonster(c, x, fTopp, u * 1.1, fH);
    }
  }

  // Altaret med brudparet
  const altare = horisont - u * 3.9;
  if (altare - u * 1.4 > hogstUpp()) {
    c.fillStyle = "#c9bfae";
    c.strokeStyle = "rgba(90, 70, 50, 0.4)";
    rundRekt(c, mittX - u * 1.7, altare, u * 3.4, horisont - altare, u * 0.1);
    c.fill();
    c.stroke();
    ritaEmoji("👰", mittX - u * 0.55, altare - u * 0.6, u * 1.15, "center", c);
    ritaEmoji("🤵", mittX + u * 0.55, altare - u * 0.6, u * 1.15, "center", c);
    ritaEmoji("🕯️", mittX - u * 1.4, altare - u * 0.4, u * 0.7, "center", c);
    ritaEmoji("🕯️", mittX + u * 1.4, altare - u * 0.4, u * 0.7, "center", c);
  }

  // Stengolv och röd matta
  c.fillStyle = "#a99f90";
  c.fillRect(0, horisont, bredd, hojd - horisont);
  c.strokeStyle = "rgba(60, 50, 40, 0.2)";
  for (let x = (mittX % (u * 0.9)) - u * 0.9; x < bredd + u; x += u * 0.9) {
    c.beginPath();
    c.moveTo(x, horisont);
    c.lineTo(mittX + (x - mittX) * 1.6, hojd);
    c.stroke();
  }
  c.fillStyle = "#a8323a";
  c.beginPath();
  c.moveTo(mittX - u * 0.8, horisont);
  c.lineTo(mittX + u * 0.8, horisont);
  c.lineTo(mittX + u * 1.4, hojd);
  c.lineTo(mittX - u * 1.4, hojd);
  c.closePath();
  c.fill();
  c.strokeStyle = "#e0b34a";
  c.lineWidth = 3;
  c.stroke();
}

// ---------- Folket, hunden och pappa ----------

function personAnsikte(p) {
  if (p.reaktionTid > 0) return p.reaktion;
  if (p.ansikte) return p.ansikte;
  const s = segment();
  if (lage === "spelar" && fas === "bana" && s && s.ansikte) return s.ansikte;
  return NEUTRALA[Math.floor(p.fas) % NEUTRALA.length];
}

// Var personens huvud är (i pixlar), så att pratbubblan hamnar rätt
function personHuvud(p) {
  const sc = u * (p.liten ? 0.72 : 1);
  const lyft = p.sitter ? 0.5 : 0;
  return { x: personX(p), y: golvY + (-2.5 + lyft) * sc, sc };
}

function ritaPerson(p) {
  const sc = u * (p.liten ? 0.72 : 1);
  const x = personX(p);
  const lyft = p.sitter ? 0.5 : 0;
  const s = segment();
  const spelar = lage === "spelar" && fas === "bana" && olyckaTid <= 0 && s;
  const klappar = spelar && s.ljud === "applad";
  const gung = spelar && (s.musik === "sang" || s.musik === "marsch") ? Math.sin(tid * 5 + p.fas) * 0.06 : 0;
  const kant = "#3a2a20";
  const lw = 0.04;
  const fylld = (farg) => {
    ctx.fillStyle = farg;
    ctx.fill();
    ctx.strokeStyle = kant;
    ctx.lineWidth = lw;
    ctx.stroke();
  };

  ctx.save();
  ctx.translate(x, golvY);
  ctx.scale(sc, sc);
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  ctx.fillStyle = "rgba(0, 0, 0, 0.16)";
  ctx.beginPath();
  ctx.ellipse(0, 0, 0.55, 0.12, 0, 0, Math.PI * 2);
  ctx.fill();

  if (p.sitter) {
    rundRekt(ctx, -0.55, -1.75, 1.1, 1.2, 0.12);
    fylld("#8a5a33");
    rundRekt(ctx, -0.6, -0.65, 1.2, 0.18, 0.06);
    fylld("#a0693c");
    for (const sx of [-0.5, 0.42]) {
      rundRekt(ctx, sx, -0.5, 0.08, 0.5, 0.03);
      fylld("#7a4e2b");
    }
  }
  ctx.rotate(gung);

  // Ben
  for (const sida of [-1, 1]) {
    if (p.sitter) {
      rundRekt(ctx, sida * 0.2 - 0.12, -0.6, 0.24, 0.55, 0.08);
      fylld("#3d4a5c");
    } else {
      rundRekt(ctx, sida * 0.17 - 0.12, -1.05, 0.24, 1.0, 0.08);
      fylld("#3d4a5c");
    }
    ctx.beginPath();
    ctx.ellipse(sida * 0.19, -0.04, 0.16, 0.08, 0, 0, Math.PI * 2);
    fylld("#2b2b2b");
  }

  // Kropp och armar
  const kTopp = -2.1 + lyft;
  rundRekt(ctx, -0.42, kTopp, 0.84, 1.15, 0.26);
  fylld(p.troja);
  const ay = kTopp + 0.2;
  for (const sida of [-1, 1]) {
    ctx.beginPath();
    ctx.moveTo(sida * 0.38, ay);
    if (klappar) {
      const k = Math.abs(Math.sin(tid * 12 + p.fas)) * 0.12;
      ctx.lineTo(sida * 0.5, ay + 0.45);
      ctx.lineTo(sida * (0.06 + k), ay + 0.35);
    } else {
      ctx.lineTo(sida * 0.55, ay + 0.85);
    }
    ctx.strokeStyle = kant;
    ctx.lineWidth = 0.2;
    ctx.stroke();
    ctx.strokeStyle = p.troja;
    ctx.lineWidth = 0.2 - lw * 2;
    ctx.stroke();
  }

  // Håret syns runt ansiktet
  const hy = kTopp - 0.4;
  if (p.har) {
    ctx.beginPath();
    ctx.ellipse(0, hy - 0.12, 0.52, 0.5, 0, 0, Math.PI * 2);
    fylld(p.har);
  }
  ctx.restore();

  // Ansiktet är en emoji, så att det syns tydligt vad personen tycker
  const hx = x - hy * Math.sin(gung) * sc;
  const hpy = golvY + hy * Math.cos(gung) * sc;
  ritaEmoji(personAnsikte(p), hx, hpy, sc * 0.86);

  if (p.hatt === "fest") {
    const topp = hpy - sc * 0.95;
    ctx.fillStyle = "#3498db";
    ctx.strokeStyle = kant;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(hx - sc * 0.24, hpy - sc * 0.32);
    ctx.lineTo(hx + sc * 0.24, hpy - sc * 0.32);
    ctx.lineTo(hx, topp);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#f1c40f";
    ctx.beginPath();
    ctx.arc(hx, topp, sc * 0.08, 0, Math.PI * 2);
    ctx.fill();
  } else if (p.hatt === "dam") {
    ctx.fillStyle = "#6c3483";
    ctx.strokeStyle = kant;
    ctx.lineWidth = 2;
    rundRekt(ctx, hx - sc * 0.22, hpy - sc * 0.66, sc * 0.44, sc * 0.3, sc * 0.08);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(hx, hpy - sc * 0.36, sc * 0.48, sc * 0.09, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }
}

function ritaHund() {
  if (!hund) return;
  const x = hundX();
  const st = u * 0.95;
  const arg = hund.argTid > 0;
  const hopp = arg ? Math.abs(Math.sin(tid * 14)) * u * 0.06 : Math.abs(Math.sin(tid * 2.5)) * u * 0.02;
  ctx.fillStyle = "rgba(0, 0, 0, 0.16)";
  ctx.beginPath();
  ctx.ellipse(x, golvY, st * 0.45, st * 0.1, 0, 0, Math.PI * 2);
  ctx.fill();
  ritaEmoji(hund.bild, x, golvY - st * 0.45 - hopp, st);
  if (arg) ritaEmoji("💢", x - st * 0.35, golvY - st * 0.95, st * 0.4);
}

function ritaMoln() {
  for (const m of moln) {
    const a = (1 - m.liv / m.max) * 0.5;
    ctx.fillStyle = `rgba(150, 185, 70, ${a})`;
    ctx.beginPath();
    ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
    ctx.fill();
  }
}

function ritaPappa() {
  const s = u;
  const olyck = olyckaTid > 0;
  const tr = krystar ? tryck / 100 : 0;
  const panik = krystar && steg >= 3;
  const lattnad = !krystar && !olyck && lattnadTid > 0;
  const rodnar = !krystar && !olyck && !lattnad && rodnadTid > 0;
  let skak = 0;
  if (krystar) skak = 0.008 + tr * 0.012 + (steg >= 2 ? 0.012 : 0) + (panik ? 0.025 : 0);
  if (olyck && olyckaTid > OLYCKA_TID - 0.4) skak = 0.05;
  const dx = (Math.random() - 0.5) * skak * 2;
  const sank = krystar ? 0.1 + tr * 0.16 : 0; // Pappa böjer på knäna när han krystar
  const andas = Math.sin(tid * 2.2) * 0.02;
  const kant = "#4a2618";
  const hud = "#f0c39a";
  const har = "#6b4a2b";
  const byxor = "#3d4a5c";
  const lw = 0.035;

  ctx.save();
  ctx.translate(mittX + dx * s, golvY);
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
  const arm = (punkter, farg) => {
    ctx.beginPath();
    ctx.moveTo(punkter[0][0], punkter[0][1]);
    for (const [px, py] of punkter.slice(1)) ctx.lineTo(px, py);
    tjockLinje(farg, 0.2);
    const [hx, hy] = punkter[punkter.length - 1];
    ctx.beginPath();
    ctx.arc(hx, hy, 0.1, 0, Math.PI * 2);
    fylld(hud);
  };

  ctx.fillStyle = "rgba(0, 0, 0, 0.18)";
  ctx.beginPath();
  ctx.ellipse(0, 0, 0.8, 0.16, 0, 0, Math.PI * 2);
  ctx.fill();

  // Ben. I panik trycker pappa ihop knäna.
  const hoftY = -1.25 + sank;
  const knaX = panik || olyck ? 0.06 : 0.24 + sank * 0.3;
  for (const sida of [-1, 1]) {
    ctx.beginPath();
    ctx.moveTo(sida * 0.22, hoftY);
    ctx.lineTo(sida * knaX, -0.62 + sank * 0.4);
    ctx.lineTo(sida * 0.26, -0.1);
    tjockLinje(byxor, 0.34);
    ctx.beginPath();
    ctx.ellipse(sida * 0.3, -0.06, 0.2, 0.1, 0, 0, Math.PI * 2);
    fylld("#5a3a22");
  }
  ctx.beginPath();
  ctx.ellipse(0, hoftY, 0.48, 0.26, 0, 0, Math.PI * 2);
  fylld(byxor);

  const by = -1.9 + sank; // Magens mitt
  const axelY = by - 0.5;
  // I panik håller pappa händerna för baken (armarna hamnar bakom kroppen)
  if (panik || olyck) {
    for (const sida of [-1, 1]) arm([[sida * 0.45, axelY], [sida * 0.72, by + 0.1], [sida * 0.4, hoftY + 0.05]], S.pappaFarg);
  }

  // Magen
  const bulle = 1 + tr * 0.1 + andas;
  ctx.beginPath();
  ctx.ellipse(0, by, 0.62 * bulle, 0.76, 0, 0, Math.PI * 2);
  fylld(S.pappaFarg);
  if (krystar && steg >= 1) {
    // Magen kurrar
    ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
    ctx.lineWidth = 0.04;
    for (const sida of [-1, 1]) {
      ctx.beginPath();
      for (let i = 0; i <= 8; i++) {
        const yy = by - 0.2 + i * 0.05;
        const xx = sida * (0.62 * bulle + 0.14) + Math.sin(i * 1.6 + tid * 18) * 0.04;
        if (i === 0) ctx.moveTo(xx, yy);
        else ctx.lineTo(xx, yy);
      }
      ctx.stroke();
    }
  }

  if (!panik && !olyck) {
    for (const sida of [-1, 1]) {
      const axel = [sida * 0.45, axelY];
      if (krystar) arm([axel, [sida * 0.85, by - 0.05], [sida * 0.5, by + 0.25]], S.pappaFarg); // Knutna händer
      else if (lattnad) arm([axel, [sida * 0.85, by - 0.3], [sida * 0.95, axelY - 0.6]], S.pappaFarg); // Skönt!
      else if (rodnar && sida > 0) arm([axel, [0.85, by - 0.4], [0.5, axelY - 0.6]], S.pappaFarg); // Kliar sig i nacken
      else arm([axel, [sida * 0.72, by], [sida * 0.74, by + 0.45]], S.pappaFarg);
    }
  }

  // Huvud
  const hy = by - 1.08;
  ctx.beginPath();
  ctx.arc(0, hy, 0.42, 0, Math.PI * 2);
  fylld(hud);
  if (krystar) {
    ctx.fillStyle = `rgba(255, 50, 40, ${0.12 + tr * 0.4})`; // Röd i ansiktet
    ctx.fill();
  } else if (olyck) {
    ctx.fillStyle = "rgba(150, 210, 120, 0.45)"; // Lite grön
    ctx.fill();
  }

  // Hår och skägg
  ctx.beginPath();
  ctx.arc(0, hy, 0.43, Math.PI, 0);
  ctx.lineTo(0.35, hy - 0.14);
  ctx.quadraticCurveTo(0, hy - 0.3, -0.35, hy - 0.14);
  ctx.closePath();
  fylld(har);
  ctx.beginPath();
  ctx.arc(0, hy + 0.02, 0.41, 0.12 * Math.PI, 0.88 * Math.PI);
  ctx.quadraticCurveTo(0, hy + 0.12, 0.41 * Math.cos(0.12 * Math.PI), hy + 0.02 + 0.41 * Math.sin(0.12 * Math.PI));
  ctx.closePath();
  ctx.fillStyle = har;
  ctx.fill();

  // Kinder
  if (krystar) {
    for (const sida of [-1, 1]) {
      ctx.fillStyle = "rgba(255, 110, 100, 0.7)";
      ctx.beginPath();
      ctx.arc(sida * 0.27, hy + 0.08, 0.1 + tr * 0.04, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (rodnar || lattnad) {
    for (const sida of [-1, 1]) {
      ctx.fillStyle = "rgba(255, 120, 140, 0.55)";
      ctx.beginPath();
      ctx.ellipse(sida * 0.27, hy + 0.08, 0.1, 0.06, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Ögon och ögonbryn
  const ey = hy - 0.02;
  for (const sida of [-1, 1]) {
    const ex = sida * 0.15;
    ctx.strokeStyle = "#1a1a1a";
    ctx.fillStyle = "#1a1a1a";
    ctx.lineWidth = 0.045;
    ctx.beginPath();
    if (panik || olyck) {
      ctx.arc(ex, ey, 0.095, 0, Math.PI * 2);
      fylld("#ffffff");
      const jx = panik ? (Math.random() - 0.5) * 0.03 : 0;
      ctx.fillStyle = "#1a1a1a";
      ctx.beginPath();
      ctx.arc(ex + jx, ey + 0.01, 0.032, 0, Math.PI * 2);
      ctx.fill();
    } else if (krystar) {
      // Hårt hopknipna ögon: > <
      ctx.moveTo(ex + sida * 0.065, ey - 0.055);
      ctx.lineTo(ex - sida * 0.05, ey);
      ctx.lineTo(ex + sida * 0.065, ey + 0.055);
      ctx.stroke();
    } else if (lattnad) {
      ctx.arc(ex, ey + 0.03, 0.06, Math.PI * 1.15, Math.PI * 1.85);
      ctx.stroke();
    } else if (tid % 4 < 0.12) {
      ctx.moveTo(ex - 0.05, ey);
      ctx.lineTo(ex + 0.05, ey);
      ctx.stroke();
    } else {
      ctx.ellipse(ex + (rodnar ? 0.035 : 0), ey, 0.045, 0.058, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.beginPath();
    if (krystar && !panik) {
      ctx.moveTo(ex + sida * 0.1, ey - 0.16);
      ctx.lineTo(ex - sida * 0.07, ey - 0.1);
    } else if (panik || olyck) {
      ctx.moveTo(ex - 0.08, ey - 0.17);
      ctx.quadraticCurveTo(ex, ey - 0.25, ex + 0.08, ey - 0.17);
    } else if (rodnar) {
      ctx.moveTo(ex + sida * 0.09, ey - 0.12);
      ctx.lineTo(ex - sida * 0.07, ey - 0.17);
    } else {
      ctx.moveTo(ex - 0.08, ey - 0.13);
      ctx.lineTo(ex + 0.08, ey - 0.13);
    }
    ctx.strokeStyle = har;
    ctx.lineWidth = 0.05;
    ctx.stroke();
  }

  // Näsa
  ctx.fillStyle = "#e3a37f";
  ctx.beginPath();
  ctx.ellipse(0, hy + 0.07, 0.06, 0.05, 0, 0, Math.PI * 2);
  ctx.fill();

  // Mun
  const my = hy + 0.22;
  ctx.strokeStyle = "#3a1a10";
  ctx.fillStyle = "#5a2a1a";
  ctx.lineWidth = 0.04;
  ctx.beginPath();
  if (olyck) {
    ctx.ellipse(0, my, 0.05, 0.065, 0, 0, Math.PI * 2);
    ctx.fill();
  } else if (panik) {
    ctx.moveTo(-0.11, my);
    for (let i = 1; i <= 6; i++) ctx.lineTo(-0.11 + i * 0.0367, my + (i % 2 ? -0.025 : 0.025));
    ctx.stroke();
  } else if (krystar) {
    ctx.moveTo(-0.1, my);
    ctx.lineTo(0.1, my);
    ctx.lineWidth = 0.055;
    ctx.stroke();
  } else if (lattnad) {
    ctx.arc(0, my - 0.04, 0.11, 0, Math.PI);
    ctx.closePath();
    ctx.fill();
  } else if (rodnar) {
    ctx.moveTo(-0.1, my);
    ctx.quadraticCurveTo(-0.05, my - 0.04, 0, my);
    ctx.quadraticCurveTo(0.05, my + 0.04, 0.1, my);
    ctx.stroke();
  } else {
    ctx.arc(0, hy + 0.12, 0.1, 0.2 * Math.PI, 0.8 * Math.PI);
    ctx.stroke();
  }
  ctx.restore();

  // Svettdroppe
  if ((krystar && steg >= 2) || olyck) {
    const f = (tid * 0.8) % 1;
    ctx.globalAlpha = 1 - f * 0.6;
    ritaEmoji("💧", mittX + s * 0.45, golvY + (hy - 0.15 + f * 0.35) * s, s * 0.32);
    ctx.globalAlpha = 1;
  }
  // Det som inte skulle hända
  if (olyck) {
    const t = OLYCKA_TID - olyckaTid;
    const studs = Math.abs(Math.sin(t * 6)) * Math.max(0, 1 - t) * 0.5;
    ritaEmoji("💩", mittX, golvY + (hy - 0.95 - studs) * s, s * (0.6 + Math.min(t * 2, 1) * 0.3));
  }
}

function ritaBubbla(text, x, y) {
  const storlek = Math.max(14, u * 0.3);
  ctx.font = `bold ${storlek}px ${TYPSNITT}`;
  const w = ctx.measureText(text).width + storlek * 1.1;
  const h = storlek * 1.7;
  const vanster = begr(x - w / 2, 8, bredd - w - 8);
  const topp = Math.max(8, y - h - storlek * 0.45);
  ctx.fillStyle = "#ffffff";
  ctx.strokeStyle = "#2b1d0e";
  ctx.lineWidth = 2.5;
  rundRekt(ctx, vanster, topp, w, h, storlek * 0.6);
  ctx.fill();
  ctx.stroke();
  const px = begr(x, vanster + storlek, vanster + w - storlek);
  ctx.beginPath();
  ctx.moveTo(px - storlek * 0.35, topp + h - 1.5);
  ctx.lineTo(px, topp + h + storlek * 0.45);
  ctx.lineTo(px + storlek * 0.35, topp + h - 1.5);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#2b1d0e";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, vanster + w / 2, topp + h / 2);
}

function ritaBubblor() {
  for (const p of folk) {
    if (p.pratTid <= 0) continue;
    const h = personHuvud(p);
    ritaBubbla(p.prat, h.x, h.y - h.sc * 0.5);
  }
  if (hund && hund.argTid > 0) ritaBubbla("?!", hundX(), golvY - u * 1.05);
  if (pappaPratTid > 0) ritaBubbla(pappaPrat, mittX, golvY - u * 3.5);
}

function ritaTexter() {
  for (const n of noter) {
    ctx.globalAlpha = begr(n.kvar, 0, 1);
    ritaEmoji(n.bild, n.x, n.y, u * 0.4);
  }
  for (const t of texter) {
    const storlek = u * (t.stor ? 0.42 : 0.32);
    ctx.font = `bold ${storlek}px ${TYPSNITT}`;
    const halv = ctx.measureText(t.text).width / 2 + 8;
    ctx.globalAlpha = begr(t.kvar * 1.5, 0, 1);
    ritaText(t.text, begr(t.x, halv, bredd - halv), t.y, storlek, t.farg);
  }
  ctx.globalAlpha = 1;
}

// ---------- Poäng, underbyxor och ljudmätaren ----------

function ritaPanel() {
  const storlek = begr(u * 0.5, 20, 34);
  const rad1 = marginal.topp + 40; // I höjd med hus- och pausknappen
  const vanster = marginal.vanster + 150; // Till höger om knapparna
  const hoger = bredd - marginal.hoger - 16;

  ritaEmoji("⭐", vanster, rad1, storlek, "left");
  ritaText(String(poang), vanster + storlek * 1.3, rad1, storlek, "#ffffff", "left");

  // Underbyxorna. Bromsspår syns som en brun fläck.
  const n = underbyxor.length;
  for (let i = 0; i < n; i++) {
    const x = hoger - (n - 1 - i) * storlek * 1.25 - storlek * 0.5;
    ctx.globalAlpha = underbyxor[i] >= 2 ? 0.25 : 1;
    ritaEmoji("🩲", x, rad1, storlek * 0.95);
    if (underbyxor[i] === 1) {
      ctx.fillStyle = "#6b3f1d";
      ctx.beginPath();
      ctx.ellipse(x, rad1 + storlek * 0.08, storlek * 0.13, storlek * 0.08, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  // Ljudmätaren. Det blå är hur mycket det låter i rummet. Släpper man
  // fisen medan pappas ansikte är i det blå hör ingen något.
  const rad2 = marginal.topp + 88;
  const ikon = storlek * 0.9;
  const w = Math.min(bredd - marginal.vanster - marginal.hoger - 32 - ikon * 3.6, 520);
  const x0 = bredd / 2 - w / 2;
  const mh = Math.max(16, storlek * 0.6);
  const y0 = rad2 - mh / 2;

  ctx.fillStyle = "rgba(25, 20, 40, 0.45)";
  rundRekt(ctx, x0 - ikon * 1.75, rad2 - ikon * 0.85, w + ikon * 3.5, ikon * 1.7, ikon * 0.85);
  ctx.fill();
  ctx.fillStyle = "rgba(255, 110, 90, 0.55)";
  rundRekt(ctx, x0, y0, w, mh, mh / 2);
  ctx.fill();
  ctx.save();
  rundRekt(ctx, x0, y0, w, mh, mh / 2);
  ctx.clip();
  const bla = ctx.createLinearGradient(x0, 0, x0 + w, 0);
  bla.addColorStop(0, "#9fdcff");
  bla.addColorStop(1, "#3d8be0");
  ctx.fillStyle = bla;
  ctx.fillRect(x0, y0, w * begr(omgivning / 100, 0, 1), mh);
  ctx.restore();
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 2.5;
  rundRekt(ctx, x0, y0, w, mh, mh / 2);
  ctx.stroke();

  // Till vänster: det som låter i rummet
  const seg = segment();
  const puls = omgivning > 50 ? 1 + Math.abs(Math.sin(tid * 8)) * 0.12 : 1;
  ctx.save();
  ctx.translate(x0 - ikon * 0.95, rad2);
  ctx.scale(puls, puls);
  ritaEmoji(seg ? seg.ikon : bana().tidslinje[0].ikon, 0, 0, ikon);
  ctx.restore();

  // Till höger: en klocka som visar hur mycket som är kvar av banan
  const kx = x0 + w + ikon * 0.95;
  const kr = ikon * 0.42;
  const kvar = fas === "bana" ? begr(1 - banTid / banLangd, 0, 1) : 1;
  ctx.fillStyle = "rgba(255, 255, 255, 0.25)";
  ctx.beginPath();
  ctx.arc(kx, rad2, kr, 0, Math.PI * 2);
  ctx.fill();
  if (kvar > 0) {
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.moveTo(kx, rad2);
    ctx.arc(kx, rad2, kr, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * kvar);
    ctx.closePath();
    ctx.fill();
  }
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(kx, rad2, kr, 0, Math.PI * 2);
  ctx.stroke();

  // Pappas ansikte åker med trycket
  if (krystar) {
    const mx = x0 + w * begr(tryck / 100, 0, 1);
    ctx.fillStyle = tryck <= omgivning + 2 ? "#5cff8a" : "#ff5a4f";
    ctx.beginPath();
    ctx.arc(mx, rad2, ikon * 0.62, 0, Math.PI * 2);
    ctx.fill();
    ritaEmoji(ANSIKTEN[steg], mx, rad2, ikon * 1.05);
  }

  // Tips under mätaren
  if (tipsTid > 0 && fas === "bana") {
    const ts = Math.max(14, storlek * 0.55);
    ctx.font = `bold ${ts}px ${TYPSNITT}`;
    const tw = Math.min(ctx.measureText(tips).width + ts * 1.4, bredd - 16);
    const ty = rad2 + ikon * 0.85 + ts * 1.1;
    ctx.globalAlpha = Math.min(1, tipsTid * 2);
    ctx.fillStyle = "rgba(40, 25, 15, 0.75)";
    rundRekt(ctx, bredd / 2 - tw / 2, ty - ts * 0.85, tw, ts * 1.7, ts * 0.85);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(tips, bredd / 2, ty, tw - ts);
    ctx.globalAlpha = 1;
  }
}

function ritaHundKnapp() {
  if (lage !== "spelar" || fas !== "bana") return;
  const k = hundKnapp();
  const aktiv = hundFonster > 0 && hundKvar > 0 && olyckaTid <= 0;
  const puls = aktiv ? 1 + Math.sin(tid * 10) * 0.06 : 1;
  ctx.save();
  ctx.translate(k.x, k.y);
  ctx.scale(puls, puls);
  ctx.globalAlpha = aktiv ? 1 : 0.5;
  ctx.fillStyle = aktiv ? "#ffd95e" : "rgba(255, 255, 255, 0.8)";
  ctx.strokeStyle = "#2b1d0e";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(0, 0, k.r, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ritaEmoji(hund ? hund.bild : "🐕", 0, 0, k.r * 1.1);
  // Hur många gånger man har kvar
  ctx.fillStyle = hundKvar > 0 ? "#ff5a4f" : "#888888";
  ctx.beginPath();
  ctx.arc(k.r * 0.72, -k.r * 0.72, k.r * 0.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.font = `bold ${k.r * 0.36}px ${TYPSNITT}`;
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(String(hundKvar), k.r * 0.72, -k.r * 0.7);
  ctx.restore();

  if (aktiv) {
    const ts = Math.max(14, k.r * 0.38);
    ctx.font = `bold ${ts}px ${TYPSNITT}`;
    const text = t("Skyll på hunden!", "Blame the dog!");
    const tw = ctx.measureText(text).width + ts * 1.2;
    const tx = Math.min(k.x, bredd - marginal.hoger - tw / 2 - 8);
    const ty = k.y - k.r - ts * 1.1;
    ctx.fillStyle = "#ffd95e";
    ctx.strokeStyle = "#2b1d0e";
    ctx.lineWidth = 2.5;
    rundRekt(ctx, tx - tw / 2, ty - ts * 0.8, tw, ts * 1.6, ts * 0.8);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#2b1d0e";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, tx, ty);
  }
}

// ---------- Skärmar och rutor ----------

// Ritar rader med text i en mörk ruta mitt på skärmen
function ritaRuta(rader, mittY, morker = 0.8) {
  const t = Math.min(bredd, hojd) / 14;
  const hojder = rader.map(([, storlek]) => storlek * t * 1.45);
  const total = hojder.reduce((a, b) => a + b, 0) + t * 0.6;
  const w = Math.min(bredd - 24, t * 15);
  const topp = Math.max(marginal.topp + 8, mittY - total / 2);
  ctx.fillStyle = `rgba(25, 15, 40, ${morker})`;
  rundRekt(ctx, bredd / 2 - w / 2, topp, w, total, t * 0.6);
  ctx.fill();
  let y = topp + t * 0.3;
  rader.forEach(([text, storlek, farg], i) => {
    const s = storlek * t;
    ctx.font = `bold ${s}px ${TYPSNITT}`;
    const ryms = (w - t * 0.8) / ctx.measureText(text).width;
    ritaText(text, bredd / 2, y + hojder[i] / 2, ryms < 1 ? s * ryms : s, farg || "#ffffff");
    y += hojder[i];
  });
}

function ritaRutor() {
  if (lage !== "spelar" && lage !== "paus") return;
  const b = bana();
  if (fas === "intro") {
    const rader = [[t(`Dag ${dag}`, `Day ${dag}`), 0.6, "#ffd27a"], [`${b.ikon} ${b.namn}`, 1.2], [b.tips, 0.6]];
    if (dag === 1 && banNr === 0) rader.push([t("Håll fingret = krysta · Släpp = fisa", "Hold = push · Let go = fart"), 0.55, "#9dffb0"]);
    if (dag > 1 && banNr === 0) rader.push([t("Allt går lite fortare nu…", "Everything is a bit faster now…"), 0.55, "#ffb3b3"]);
    rader.push([introTips, 0.45, "#d5def0"]);
    if (fasTid > 0.6) rader.push([t("Tryck för att börja", "Tap to start"), 0.6]);
    ritaRuta(rader, hojd * 0.45);
  } else if (fas === "klar") {
    const sista = banNr === S.banor.length - 1;
    const nasta = S.banor[sista ? 0 : banNr + 1];
    ritaRuta([
      [t(`${b.ikon} ${b.namn} – klart!`, `${b.ikon} ${b.namn} – done!`), 1.0, "#ffd27a"],
      [t(`+${banPoang} poäng`, `+${antal(banPoang, "point", "points")}`), 0.9],
      [t(`${banFisar} fisar · ${banSmyg} hördes inte`, `${antal(banFisar, "fart", "farts")} · ${banSmyg} unheard`), 0.55, "#d5def0"],
      [sista ? t("Dagen är slut. I morgon blir det svårare!", "That's the day! Tomorrow gets harder!") : t(`Nästa: ${nasta.ikon} ${nasta.namn}`, `Next: ${nasta.ikon} ${nasta.namn}`), 0.55, "#9dffb0"],
    ], hojd * 0.45);
  } else if (olyckaTid > 0 && olyckaTid < OLYCKA_TID - 0.4) {
    ritaRuta([[olyckaText, 0.75], ["−1 🩲", 0.75, "#ffb3b3"]], hojd * 0.3, 0.7);
  }
}

function titel(p) {
  let namn = S.titlar[0].namn;
  for (const t of S.titlar) if (p >= t.poang) namn = t.namn;
  return namn;
}

function ritaSkarmar() {
  if (lage !== "start" && lage !== "slut") return;
  const ts = Math.min(bredd, hojd) / 14; // Textstorlek
  const mitt = bredd / 2;
  ctx.fillStyle = "rgba(25, 15, 40, 0.6)";
  ctx.fillRect(0, 0, bredd, hojd);
  let y = marginal.topp + Math.max(ts * 1.6, hojd * 0.1);
  const rad = (text, storlek, farg) => {
    // Krymper texten om den inte får plats på skärmen
    ctx.font = `bold ${storlek}px ${TYPSNITT}`;
    const ryms = (bredd - 32) / ctx.measureText(text).width;
    ritaText(text, mitt, y, ryms < 1 ? storlek * ryms : storlek, farg);
    y += storlek * 1.45;
  };

  if (lage === "start") {
    rad(t("Lagom tryck", "Just the Right Push"), ts * 1.4, "#ffd27a");
    y += ts * 0.3;
    rad(t("Håll fingret på skärmen för att krysta", "Hold your finger on the screen to push"), ts * 0.65);
    rad(t("Släpp för att fisa – större fis, mer poäng", "Let go to fart – bigger fart, more points"), ts * 0.65);
    rad(t("Fisa när det låter mycket, så hör ingen", "Fart when it's noisy, so nobody hears"), ts * 0.65);
    rad(t("Men tryck inte för hårt… 💩", "But don't push too hard… 💩"), ts * 0.65, "#ffb3b3");
    y += ts * 0.4;
    rad(t("Tryck för att börja", "Tap to start"), ts * 0.85);
    if (rekord > 0) rad(t("Rekord: ", "High score: ") + rekord, ts * 0.6, "#d5def0");
    y += ts * 0.3;
    rad(startTips, ts * 0.5, "#d5def0");
  }

  if (lage === "slut") {
    rad(t("Slut på rena underbyxor!", "Out of clean underpants!"), ts * 1.1, "#ffd27a");
    if (olyckaText) rad(olyckaText, ts * 0.6, "#d5def0");
    rad(t(poang + " poäng", antal(poang, "point", "points")), ts * 1.0);
    rad(poang > 0 && poang === rekord ? t("🏆 Nytt rekord! 🏆", "🏆 New high score! 🏆") : t("Rekord: ", "High score: ") + rekord, ts * 0.7);
    rad(t("Du är nu: ", "You are now: ") + titel(poang), ts * 0.75, "#9dffb0");
    rad(t(`Dag ${dag} · ${antalFisar} fisar · ${antalSmyg} hördes inte`, `Day ${dag} · ${antal(antalFisar, "fart", "farts")} · ${antalSmyg} unheard`), ts * 0.55, "#d5def0");
    if (storstaFis) rad(t(`Största fisen: ${storstaFis}`, `Biggest fart: ${storstaFis}`), ts * 0.55, "#d5def0");
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

  if (bakgrundRum !== bana().rum) ritaBakgrund();
  ctx.save();
  if (skakning > 0) ctx.translate((Math.random() - 0.5) * u * 0.2, (Math.random() - 0.5) * u * 0.2);
  ctx.drawImage(bakgrund, 0, 0, bredd, hojd);
  ritaHissDorrar();
  for (const p of folk) ritaPerson(p);
  ritaMoln();
  ritaHund();
  ritaPappa();
  ritaTexter();
  ritaBubblor();
  ctx.restore();

  if (lage === "spelar" || lage === "paus") {
    ritaPanel();
    ritaHundKnapp();
  }
  ritaRutor();
  ritaSkarmar();
}

// ---------- Spel-loopen: körs ungefär 60 gånger per sekund ----------

anpassaStorlek();
laddaBana(0);

let forraTiden = performance.now();
function loop(nu) {
  const dt = Math.min(0.05, (nu - forraTiden) / 1000);
  forraTiden = nu;
  kollaFart(dt);
  uppdatera(dt);
  rita();
  schemalaggMusik();
  uppdateraSorl(dt);
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

// ---------- Ljud (skapas direkt i webbläsaren, inga ljudfiler behövs) ----------

let ljudmotor = null;
let huvudvolym = null; // Allt ljud går hit, så att allt kan tystas när man pausar
let brusBuffer = null;
let appladBuffer = null;
let sorlStyrka = null;

function startaLjud() {
  // iPad/iPhone tillåter bara ljud efter att man tryckt på skärmen
  if (!S.ljud) return;
  try {
    if (!ljudmotor) {
      ljudmotor = new (window.AudioContext || window.webkitAudioContext)();
      huvudvolym = ljudmotor.createGain();
      // Dämpar ljudet om många ljud låter samtidigt, så att det inte knastrar
      const dampare = ljudmotor.createDynamicsCompressor();
      dampare.threshold.value = -10;
      dampare.knee.value = 6;
      dampare.ratio.value = 8;
      huvudvolym.connect(dampare);
      dampare.connect(ljudmotor.destination);
      brusBuffer = skapaBrus();
      appladBuffer = skapaApplad();
      // Sorlet när många pratar på kalaset
      const sorl = ljudmotor.createBufferSource();
      sorl.buffer = brusBuffer;
      sorl.loop = true;
      const filter = ljudmotor.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.value = 480;
      filter.Q.value = 0.8;
      sorlStyrka = ljudmotor.createGain();
      sorlStyrka.gain.value = 0;
      sorl.connect(filter);
      filter.connect(sorlStyrka);
      sorlStyrka.connect(huvudvolym);
      sorl.start();
    }
    if (ljudmotor.state === "suspended") ljudmotor.resume();
  } catch (e) {
    ljudmotor = null;
  }
}

function tystaLjud(tyst) {
  if (!huvudvolym) return;
  try {
    huvudvolym.gain.setTargetAtTime(tyst ? 0 : 1, ljudmotor.currentTime, 0.02);
  } catch (e) {
    // Inget ljud – spelet fungerar ändå
  }
}

function skapaBrus() {
  const n = Math.floor(ljudmotor.sampleRate * 2);
  const buffer = ljudmotor.createBuffer(1, n, ljudmotor.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < n; i++) data[i] = Math.random() * 2 - 1;
  return buffer;
}

// Massor av små klapp, slumpvis utspridda
function skapaApplad() {
  const sr = ljudmotor.sampleRate;
  const n = Math.floor(sr * 2);
  const buffer = ljudmotor.createBuffer(1, n, sr);
  const data = buffer.getChannelData(0);
  for (let k = 0; k < 420; k++) {
    const start = Math.floor(Math.random() * n);
    const langd = Math.floor(sr * (0.008 + Math.random() * 0.02));
    const styrka = 0.2 + Math.random() * 0.5;
    for (let i = 0; i < langd; i++) {
      data[(start + i) % n] += (Math.random() * 2 - 1) * styrka * Math.exp(-i / (langd * 0.3));
    }
  }
  return buffer;
}

function ton(fran, till, langd, typ, volym, start) {
  if (!ljudmotor) return;
  const t = start === undefined ? ljudmotor.currentTime : start;
  const o = ljudmotor.createOscillator();
  const g = ljudmotor.createGain();
  o.type = typ;
  o.frequency.setValueAtTime(fran, t);
  o.frequency.exponentialRampToValueAtTime(till, t + langd);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(volym, t + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, t + langd);
  o.connect(g);
  g.connect(huvudvolym);
  o.start(t);
  o.stop(t + langd + 0.02);
}

function brus(start, langd, typ, frekvens, volym, q = 1, slutFrekvens) {
  const kalla = ljudmotor.createBufferSource();
  kalla.buffer = brusBuffer;
  kalla.loop = true;
  const filter = ljudmotor.createBiquadFilter();
  filter.type = typ;
  filter.frequency.setValueAtTime(frekvens, start);
  if (slutFrekvens) filter.frequency.exponentialRampToValueAtTime(slutFrekvens, start + langd);
  filter.Q.value = q;
  const g = ljudmotor.createGain();
  g.gain.setValueAtTime(0.0001, start);
  g.gain.exponentialRampToValueAtTime(volym, start + Math.min(0.03, langd * 0.2));
  g.gain.setValueAtTime(volym, start + langd * 0.6);
  g.gain.exponentialRampToValueAtTime(0.0001, start + langd);
  kalla.connect(filter);
  filter.connect(g);
  g.connect(huvudvolym);
  kalla.start(start, Math.random() * 1.5);
  kalla.stop(start + langd + 0.05);
}

// En ton som går genom ett filter, med darr om man vill
function filterTon(start, langd, typ, fran, till, filterTyp, filterFrekvens, q, volym, darr = 0, darrFart = 6) {
  const o = ljudmotor.createOscillator();
  o.type = typ;
  o.frequency.setValueAtTime(fran, start);
  o.frequency.linearRampToValueAtTime(till, start + langd);
  if (darr) {
    const lfo = ljudmotor.createOscillator();
    const lfoStyrka = ljudmotor.createGain();
    lfo.frequency.value = darrFart;
    lfoStyrka.gain.value = darr;
    lfo.connect(lfoStyrka);
    lfoStyrka.connect(o.frequency);
    lfo.start(start);
    lfo.stop(start + langd + 0.05);
  }
  const filter = ljudmotor.createBiquadFilter();
  filter.type = filterTyp;
  filter.frequency.value = filterFrekvens;
  filter.Q.value = q;
  const g = ljudmotor.createGain();
  g.gain.setValueAtTime(0.0001, start);
  g.gain.exponentialRampToValueAtTime(volym, start + 0.04);
  g.gain.setValueAtTime(volym, start + langd * 0.7);
  g.gain.exponentialRampToValueAtTime(0.0001, start + langd);
  o.connect(filter);
  filter.connect(g);
  g.connect(huvudvolym);
  o.start(start);
  o.stop(start + langd + 0.05);
}

// Själva fisen. Större tryck = längre, mörkare och högre.
function fisLjud(storlek, sort, dold) {
  if (!ljudmotor) return;
  try {
    const t = ljudmotor.currentTime;
    const st = storlek / 100;
    let langd = 0.2 + st * 1.2;
    let f = 120 - st * 60;
    let slutF = f * 0.75;
    let fladder = 22 + Math.random() * 12;
    let djup = 0.35;
    let typ = "sawtooth";
    let vol = (0.18 + st * 0.3) * (dold ? 0.6 : 1);
    let filt = 500 + st * 700;
    let pulsera = false;
    if (sort === "pip") {
      f = 300 + Math.random() * 80;
      slutF = f * 1.25;
      langd = 0.15 + st * 0.4;
      typ = "square";
      filt = 1800;
      djup = 0.15;
      vol *= 0.6;
    } else if (sort === "ballong") {
      slutF = f * 3.2;
      langd += 0.2;
      typ = "square";
      filt = 1500;
      djup = 0.2;
    } else if (sort === "trumpet") {
      f = 150 + Math.random() * 30;
      slutF = f * 0.9;
      typ = "square";
      filt = 1400;
      djup = 0.12;
      fladder = 30;
    } else if (sort === "motor") {
      fladder = 14 + Math.random() * 6;
      djup = 0.6;
      pulsera = true;
      vol *= 0.55; // Hackandet lägger till nästan lika mycket till, annars knastrar det
    } else if (sort === "mullr") {
      f = 55;
      slutF = 40;
      langd += 0.4;
      filt = 400;
      djup = 0.5;
      vol *= 1.2;
    }

    const o = ljudmotor.createOscillator();
    o.type = typ;
    o.frequency.setValueAtTime(f, t);
    o.frequency.exponentialRampToValueAtTime(slutF, t + langd);
    const lfo = ljudmotor.createOscillator();
    lfo.type = "square";
    lfo.frequency.value = fladder;
    const lfoStyrka = ljudmotor.createGain();
    lfoStyrka.gain.value = f * djup;
    lfo.connect(lfoStyrka);
    lfoStyrka.connect(o.frequency);
    const filter = ljudmotor.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = filt;
    filter.Q.value = 4;
    const g = ljudmotor.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.02);
    g.gain.setValueAtTime(vol, t + langd * 0.7);
    g.gain.exponentialRampToValueAtTime(0.0001, t + langd);
    if (pulsera) {
      // Motorcykeln: ljudet hackar
      const puls = ljudmotor.createOscillator();
      const pulsStyrka = ljudmotor.createGain();
      puls.frequency.value = 11;
      pulsStyrka.gain.value = vol * 0.8;
      puls.connect(pulsStyrka);
      pulsStyrka.connect(g.gain);
      puls.start(t);
      puls.stop(t + langd + 0.05);
    }
    o.connect(filter);
    filter.connect(g);
    g.connect(huvudvolym);
    o.start(t);
    lfo.start(t);
    o.stop(t + langd + 0.05);
    lfo.stop(t + langd + 0.05);
    brus(t, langd * 0.8, "lowpass", 350, vol * 0.5);
  } catch (e) {
    // Inget ljud – spelet fungerar ändå
  }
}

// Ljud som hör till banorna och till det som händer
function effekt(namn, s) {
  if (!ljudmotor) return;
  try {
    const t = ljudmotor.currentTime;
    const langd = s ? s.tid : 1;
    const varv = s && s.puls ? s.puls[0] + s.puls[1] : 1;
    switch (namn) {
      case "pling":
        ton(1319, 1318, 0.7, "sine", 0.14, t);
        ton(1047, 1046, 1.0, "sine", 0.12, t + 0.28);
        break;
      case "hosta":
        for (const d of [0, 0.3, 0.55]) brus(t + d, 0.2, "bandpass", 700, 0.45, 1.2, 400);
        break;
      case "nys":
        brus(t, 0.5, "highpass", 2000, 0.05, 0.7);
        ton(250, 500, 0.5, "triangle", 0.04, t);
        brus(t + 0.55, 0.4, "bandpass", 1600, 0.7, 0.8, 600);
        break;
      case "dorrar":
        ton(880, 880, 0.4, "sine", 0.06, t);
        brus(t, langd, "lowpass", 300, 0.18, 0.7, 150);
        break;
      case "stampel":
        for (let d = 0; d < langd - 0.05; d += varv) {
          ton(150, 45, 0.14, "sine", 0.45, t + d);
          brus(t + d, 0.06, "lowpass", 900, 0.3);
        }
        break;
      case "vagn":
        for (let d = 0; d < langd - 0.2; d += 0.45) {
          ton(1700, 2300, 0.18, "triangle", 0.035, t + d);
          ton(2300, 1600, 0.15, "triangle", 0.03, t + d + 0.2);
        }
        break;
      case "bebis":
        for (const d of [0, 0.9]) filterTon(t + d, 0.8, "sawtooth", 430, 560, "bandpass", 1300, 1.5, 0.14, 25, 7);
        break;
      case "schh":
        brus(t, 1.0, "highpass", 3500, 0.22, 0.7);
        break;
      case "skrivare":
        for (let d = 0; d < langd - 0.1; d += 0.12) brus(t + d, 0.1, "bandpass", 2400, 0.12, 2);
        break;
      case "bok":
        ton(110, 35, 0.45, "sine", 0.6, t);
        brus(t, 0.25, "lowpass", 400, 0.5);
        break;
      case "klirr":
        for (const d of [0, 0.3, 0.6]) {
          ton(2637, 2600, 0.3, "sine", 0.07, t + d);
          ton(3951, 3900, 0.2, "sine", 0.04, t + d);
        }
        break;
      case "tal": {
        // Någon pratar: "wa wa wa"
        let d = 0;
        while (d < langd - 0.2) {
          const l = 0.1 + Math.random() * 0.16;
          const f0 = 120 + Math.random() * 60;
          filterTon(t + d, l, "sawtooth", f0, f0 * (0.85 + Math.random() * 0.3), "bandpass", 700 + Math.random() * 500, 3, 0.08);
          d += l + 0.03 + Math.random() * 0.12 + (Math.random() < 0.12 ? 0.3 : 0);
        }
        break;
      }
      case "applad": {
        const kalla = ljudmotor.createBufferSource();
        kalla.buffer = appladBuffer;
        kalla.loop = true;
        const filter = ljudmotor.createBiquadFilter();
        filter.type = "bandpass";
        filter.frequency.value = 2200;
        filter.Q.value = 0.4;
        const g = ljudmotor.createGain();
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(0.5, t + 0.25);
        g.gain.setValueAtTime(0.5, t + Math.max(0.3, langd - 0.6));
        g.gain.exponentialRampToValueAtTime(0.0001, t + langd);
        kalla.connect(filter);
        filter.connect(g);
        g.connect(huvudvolym);
        kalla.start(t, Math.random() * 1.5);
        kalla.stop(t + langd + 0.05);
        break;
      }
      case "hurra":
        for (let d = 0; d < langd - 0.1; d += varv) {
          for (const ton0 of [300, 330, 360]) filterTon(t + d, s.puls[0], "sawtooth", ton0, ton0 * 1.3, "bandpass", 1000, 1, 0.05);
        }
        break;
      case "snyt":
        // Moster snyter sig som en gås
        for (const d of [0, 0.65]) filterTon(t + d, 0.55, "square", 240, 200, "bandpass", 700, 4, 0.16, 10, 18);
        break;
      case "kurr":
        filterTon(t, 0.9, "sine", 80, 52, "lowpass", 300, 1, 0.3, 8, 9);
        brus(t, 0.6, "lowpass", 200, 0.15);
        break;
      case "blubb":
        ton(560, 160, 0.11, "sine", 0.2, t);
        ton(420, 130, 0.12, "sine", 0.16, t + 0.13);
        break;
      case "smyg":
        ton(880, 880, 0.12, "sine", 0.07, t + 0.3);
        ton(1319, 1319, 0.25, "sine", 0.07, t + 0.4);
        break;
      case "horde":
        ton(196, 190, 0.22, "triangle", 0.14, t + 0.2);
        ton(185, 150, 0.6, "triangle", 0.14, t + 0.45);
        break;
      case "olycka": {
        brus(t, 0.35, "lowpass", 300, 0.6);
        ton(95, 30, 0.45, "sine", 0.5, t);
        // Ledsen trombon: wah wah wah waaah
        const toner = [311, 294, 277, 262];
        toner.forEach((f, i) => {
          const sist = i === toner.length - 1;
          filterTon(t + 0.7 + i * 0.4, sist ? 1.0 : 0.36, "sawtooth", f, sist ? f * 0.97 : f, "lowpass", 1100, 1, 0.12, sist ? 6 : 0, 6);
        });
        break;
      }
      case "voff":
        ton(520, 280, 0.13, "sawtooth", 0.12, t);
        brus(t, 0.1, "bandpass", 900, 0.25, 1.5);
        ton(300, 560, 0.16, "sawtooth", 0.1, t + 0.35);
        brus(t + 0.35, 0.1, "bandpass", 900, 0.2, 1.5);
        break;
      case "syrsor":
        // Pinsam tystnad
        for (let k = 0; k < 3; k++) {
          for (let i = 0; i < 4; i++) ton(4300, 4300, 0.035, "sine", 0.035, t + 0.2 + k * 0.45 + i * 0.06);
        }
        break;
      case "klar":
        [523, 659, 784, 1047].forEach((f, i) => ton(f, f, 0.25, "triangle", 0.09, t + i * 0.12));
        break;
    }
  } catch (e) {
    // Inget ljud – spelet fungerar ändå
  }
}

let sorlKoll = 0;
function uppdateraSorl(dt) {
  if (!sorlStyrka) return;
  sorlKoll -= dt;
  if (sorlKoll > 0) return;
  sorlKoll = 0.1;
  const s = segment();
  const aktiv = lage === "spelar" && fas === "bana" && olyckaTid <= 0 && s && s.sorl;
  const mal = aktiv ? s.sorl * 0.09 * (0.6 + 0.4 * Math.abs(Math.sin(tid * 2.7) * Math.sin(tid * 1.1 + 1))) : 0;
  try {
    sorlStyrka.gain.setTargetAtTime(mal, ljudmotor.currentTime, 0.12);
  } catch (e) {
    // Inget ljud – spelet fungerar ändå
  }
}

// ---------- Musiken ----------
//
//  Varje siffra är en ton (60 = mellersta C, 62 = D, 64 = E ...).
//  "-" betyder att tonen före hålls kvar, och null betyder paus.
//  "bas" har en ton för varannan meloditon. Ändra för att göra egen musik!

const MUSIK = {
  hiss: {
    steg: 0.2, // Sekunder per ton – lägre = snabbare
    ljud: "hiss",
    melodi: [76, "-", 74, 76, null, 71, "-", 72, null, null, 69, "-", "-", null, null, null,
             74, "-", 72, 74, null, 69, "-", 71, null, null, 67, "-", "-", null, null, null],
    bas: [45, null, 52, null, 50, null, 57, null, 43, null, 50, null, 48, null, 55, null],
  },
  sang: {
    steg: 0.28,
    ljud: "kor",
    melodi: [72, "-", 72, 74, 76, "-", 72, "-", 77, "-", 76, 74, 72, "-", null, null,
             67, "-", 69, 71, 72, "-", 76, "-", 74, "-", 71, "-", 72, "-", "-", null],
    bas: [48, 55, 48, 55, 53, 57, 48, 55, 43, 47, 48, 52, 43, 47, 48, null],
  },
  brud: {
    steg: 0.25,
    ljud: "orgel",
    melodi: [67, "-", 72, "-", "-", 72, 72, "-", "-", "-",
             67, "-", 74, "-", "-", 71, 72, "-", "-", "-",
             67, "-", 72, "-", "-", 77, 77, "-", 76, "-", 74, "-", "-", 72, 71, "-", 72, "-", 74, "-", "-", "-", null, null],
    bas: [48, "-", 53, "-", 43, "-", 48, "-"],
  },
  marsch: {
    steg: 0.16,
    ljud: "orgel",
    melodi: [72, 72, 72, 72, "-", "-", 72, 72, 72, 72, "-", "-", 72, 72, 72, 72, "-", "-", 72, "-", 72, "-", 72, "-", 72, "-",
             76, "-", "-", "-", 81, "-", "-", "-", 79, "-", "-", "-", "-", "-", 77, "-", 76, "-", 74, "-", 72, "-", "-", "-", "-", "-", null, null],
    bas: [48, "-", 48, "-", 53, "-", 55, "-", 48, "-", 45, "-", 50, "-", 55, "-"],
  },
};

let musikPa = S.musik && lasInstallning("musik-fis") !== "av";
let musikNamn = null;
let musikSteg = 0;
let musikNastaTid = 0;
visaMusikKnapp();

// Hur många steg en ton ska hållas (sig själv plus alla "-" efter)
function notLangd(lista, i) {
  let n = 1;
  while (lista[(i + n) % lista.length] === "-" && n < lista.length) n += 1;
  return n;
}

function spelaRost(not, start, langd, ljud, bas) {
  const f = 440 * Math.pow(2, (not - 69) / 12);
  const g = ljudmotor.createGain();
  g.connect(huvudvolym);
  const toner = [];
  let filter = null;
  if (ljud === "hiss") {
    toner.push([bas ? "sine" : "triangle", f, 0]);
    g.gain.setValueAtTime(0.0001, start);
    g.gain.exponentialRampToValueAtTime(bas ? 0.07 : 0.05, start + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, start + langd * 1.2);
  } else {
    // Kör och orgel: tonen hålls jämnt och slutar mjukt
    if (ljud === "kor") {
      if (bas) toner.push(["triangle", f, 0]);
      else for (const cent of [-10, 0, 10]) toner.push(["sawtooth", f, cent]);
    } else if (bas) {
      toner.push(["square", f, 0], ["sine", f * 1.5, 0]);
    } else {
      toner.push(["square", f, 0], ["sine", f * 2, 0]);
    }
    filter = ljudmotor.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = ljud === "kor" ? 1600 : bas ? 900 : 2000;
    filter.connect(g);
    const vol = ljud === "kor" ? (bas ? 0.06 : 0.03) : 0.035;
    g.gain.setValueAtTime(0.0001, start);
    g.gain.exponentialRampToValueAtTime(vol, start + 0.04);
    g.gain.setValueAtTime(vol, start + langd * 0.9);
    g.gain.exponentialRampToValueAtTime(0.0001, start + langd + 0.1);
  }
  for (const [typ, frekvens, cent] of toner) {
    const o = ljudmotor.createOscillator();
    o.type = typ;
    o.frequency.value = frekvens;
    o.detune.value = cent;
    o.connect(filter || g);
    o.start(start);
    o.stop(start + langd * 1.2 + 0.15);
  }
}

// Lägger ut tonerna en liten bit i förväg så att musiken inte hackar
function schemalaggMusik() {
  if (!ljudmotor) return;
  const s = segment();
  const spelas = musikPa && lage === "spelar" && fas === "bana" && olyckaTid <= 0;
  const namn = spelas && s && s.musik ? s.musik : null;
  if (namn !== musikNamn) {
    if (namn && namn !== "hiss") musikSteg = 0; // Hissmusiken fortsätter där den var
    musikNamn = namn;
    musikNastaTid = 0;
  }
  if (!namn) return;
  const latt = MUSIK[namn];
  const nu = ljudmotor.currentTime;
  if (musikNastaTid < nu) musikNastaTid = nu + 0.03;
  try {
    while (musikNastaTid < nu + 0.2) {
      const i = musikSteg % latt.melodi.length;
      const not = latt.melodi[i];
      if (typeof not === "number") spelaRost(not, musikNastaTid, notLangd(latt.melodi, i) * latt.steg, latt.ljud, false);
      if (latt.bas && musikSteg % 2 === 0) {
        const j = (musikSteg / 2) % latt.bas.length;
        const b = latt.bas[j];
        if (typeof b === "number") spelaRost(b, musikNastaTid, notLangd(latt.bas, j) * latt.steg * 2, latt.ljud, true);
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
    return Number(localStorage.getItem("rekord-fis")) || 0;
  } catch (e) {
    return 0;
  }
}

function sparaRekord(varde) {
  try {
    localStorage.setItem("rekord-fis", String(varde));
  } catch (e) {
    // Privat läge e.d. – rekordet sparas bara tills sidan laddas om
  }
}
