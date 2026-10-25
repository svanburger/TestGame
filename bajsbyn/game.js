// =====================================================================
//  BAJSBYN – ett spel i 3D
//
//  Morfar har tappat tio guldbajsar runt om i byn. Spring, hoppa upp på
//  lådor och tak, och hitta alla. Gå sedan tillbaka till morfar. Ju
//  snabbare man är, desto fler poäng. Bajsis vid dammen har tips (och
//  dåliga skämt). En pil ovanför huvudet visar vägen.
//
//  Allt i 3D byggs av kod med Three.js (../three.min.js), utan modellfiler.
//  Styrning: joystick + HOPP på iPad, piltangenter/WASD + mellanslag på
//  datorn, och handkontroll (spak, A = hoppa, X = prata, Start = paus).
// =====================================================================

const INSTALLNINGAR = {
  springfart: 8,          // meter per sekund
  hoppfart: 9.5,          // så högt man hoppar (9,5 räcker upp på en låda)
  tyngdkraft: 25,
  stegHojd: 0.35,         // så höga kanter man går upp på utan att hoppa
  kameraAvstand: 8,
  kameraHojd: 4.5,
  kameraSving: 2.5,       // hur fort kameran svänger med höger spak / Q och E
  sikt: 110,              // meter; längre bort syns bara dimma
  pratAvstand: 3.2,       // så nära man ska stå för att kunna prata
  plockAvstand: 1.4,      // så nära man ska komma en guldbajs för att ta den
  dodzon: 0.2,            // så mycket man kan luta spaken utan att något händer
  // Poäng: man börjar på maxPoang och tappar poangPerSekund för varje sekund
  maxPoang: 3000,
  poangPerSekund: 5,
  minstaPoang: 100,
  // Rösterna: rostlage 1 och tempo 1 är vanligt. Ändrar man för mycket låter det som en robot.
  bajsis: { namn: "Bajsis", rostlage: 1.6, tempo: 1.15, rostNummer: 0 },
  morfar: { namn: t("Morfar", "Grandpa"), rostlage: 0.8, tempo: 0.9, rostNummer: 1 },
};

// Byn. x är åt höger, z är mot kameran när spelet börjar. Allt är i meter.
const KARTA = {
  storlek: 55,   // Staketet står så här långt från mitten åt alla håll
  // Hus: [x, z, bredd, djup, höjd]
  hus: [
    [0, -14, 7, 6, 4],      // morfars hus
    [-14, -12, 6, 5, 3.5],
    [14, -12, 6, 6, 4],
    [-22, 4, 5, 6, 3],
    [22, 2, 6, 5, 3.5],
    [-12, 22, 6, 5, 3],
    [6, 30, 5, 5, 3.5],
    [-34, -26, 6, 6, 4],
    [34, -24, 5, 6, 3],
    [-40, 30, 6, 5, 3.5],
    [40, 36, 6, 6, 4],
    [0, -40, 8, 5, 4.5],
  ],
  // Lådor och bodar man kan hoppa upp på: [x, z, bredd, djup, höjd]
  lador: [
    [-28, -6, 1.6, 1.6, 0.8],   // en trappa av lådor
    [-26.4, -6, 1.6, 1.6, 1.6],
    [-24.8, -6, 1.6, 1.6, 2.4],
    [28, -36.6, 1.4, 1.4, 0.8], // lådan framför boden
    [-6, 10, 1.4, 1.4, 0.8],
    [-4.6, 10, 1.4, 1.4, 1.4],
  ],
  bodar: [[28, -40, 5, 4.6, 1.6]],   // bod med platt tak
  damm: { x: 20, z: 20, radie: 7 },
  morfar: { x: 0, z: -6 },
  bajsis: { x: 11, z: 20 },
  start: { x: 0, z: 2 },
  // Guldbajsarna: [x, z]. Står de på en låda eller bod hamnar de ovanpå.
  guldbajsar: [
    [6, -2], [-14, -5], [20, 30], [-24.8, -6], [28, -40],
    [-40, 42], [45, 10], [-45, -10], [0, -50], [-4.6, 10],
  ],
  trad: 160,
};

// ---------------------------------------------------------------------
//  Renderaren, scenen och ljuset
// ---------------------------------------------------------------------

const duk = document.getElementById("spel");
let renderare;
try {
  // Three.js r159 tar WebGL 2 om det finns och annars WebGL 1
  renderare = new THREE.WebGLRenderer({ canvas: duk, antialias: false, powerPreference: "high-performance" });
} catch (fel) {
  document.querySelector("#startruta p").textContent =
    t("Den här enheten klarar tyvärr inte 3D (WebGL saknas).", "Sorry, this device can't show 3D (no WebGL).");
  document.getElementById("spela").hidden = true;
  throw fel;
}
renderare.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
renderare.shadowMap.enabled = true;

const himmelsfarg = 0x9fd8ff;
const scen = new THREE.Scene();
scen.background = new THREE.Color(himmelsfarg);
scen.fog = new THREE.Fog(himmelsfarg, INSTALLNINGAR.sikt * 0.35, INSTALLNINGAR.sikt);
const kamera = new THREE.PerspectiveCamera(60, 1, 0.1, INSTALLNINGAR.sikt);

scen.add(new THREE.HemisphereLight(0xffffff, 0x5a7a3a, 0.9));
const sol = new THREE.DirectionalLight(0xffffff, 1.6);
sol.castShadow = true;
sol.shadow.mapSize.set(1024, 1024);
Object.assign(sol.shadow.camera, { left: -30, right: 30, top: 30, bottom: -30, near: 1, far: 120 });
scen.add(sol, sol.target);

// Lågpoly: platta ytor i stället för mjuka (flatShading)
const allaMaterial = [];
function material(farg, glod) {
  const m = new THREE.MeshLambertMaterial({ color: farg, flatShading: true, emissive: glod || 0x000000 });
  allaMaterial.push(m);
  return m;
}

function lada(b, h, d, farg, x, y, z) {
  const del = new THREE.Mesh(new THREE.BoxGeometry(b, h, d), typeof farg === "number" ? material(farg) : farg);
  del.position.set(x, y, z);
  del.castShadow = true;
  return del;
}

// ---------------------------------------------------------------------
//  Hinder: allt man kan krocka med eller stå på
// ---------------------------------------------------------------------

const HOGT = 99;   // Så högt att man inte kan stå ovanpå (husens tak)
const hinder = [];   // { x, z, hb, hd, topp }  (hb/hd = halva bredden/djupet)

function laggTillHinder(x, z, bredd, djup, topp) {
  hinder.push({ x: x, z: z, hb: bredd / 2, hd: djup / 2, topp: topp });
}

function overlappar(x, z, h, marginal) {
  return Math.abs(x - h.x) < h.hb + marginal && Math.abs(z - h.z) < h.hd + marginal;
}

// Hur högt marken är där man står (lådor och bodar räknas som mark)
function golvhojd(x, z, fotY) {
  let golv = 0;
  for (const h of hinder) {
    if (h.topp <= fotY + INSTALLNINGAR.stegHojd && h.topp > golv && overlappar(x, z, h, 0.3)) golv = h.topp;
  }
  return golv;
}

// Står något i vägen på den här platsen?
function iVagen(x, z, fotY) {
  for (const h of hinder) {
    if (h.topp > fotY + INSTALLNINGAR.stegHojd && overlappar(x, z, h, 0.4)) return true;
  }
  return false;
}

// ---------------------------------------------------------------------
//  Byn
// ---------------------------------------------------------------------

// Marken, vägarna och dammen
const mark = new THREE.Mesh(new THREE.PlaneGeometry(400, 400), material(0x6cbf4a));
mark.rotation.x = -Math.PI / 2;
mark.receiveShadow = true;
scen.add(mark);

function platta(bredd, djup, farg, x, z, y) {
  const p = new THREE.Mesh(new THREE.PlaneGeometry(bredd, djup), material(farg));
  p.rotation.x = -Math.PI / 2;
  p.position.set(x, y, z);
  p.receiveShadow = true;
  scen.add(p);
}
platta(4, KARTA.storlek * 2, 0xd9b77a, 0, 0, 0.02);
platta(KARTA.storlek * 2, 4, 0xd9b77a, 0, 0, 0.03);
const damm = new THREE.Mesh(new THREE.CircleGeometry(KARTA.damm.radie, 16), material(0x3d8fd6));
damm.rotation.x = -Math.PI / 2;
damm.position.set(KARTA.damm.x, 0.04, KARTA.damm.z);
scen.add(damm);

// Husen
const husKropp = new THREE.BoxGeometry(1, 1, 1);
const takForm = new THREE.ConeGeometry(0.75, 1, 4);   // pyramid med fyra sidor
const takMaterial = material(0xb33a2a);
const dorrMaterial = material(0x6b4423);
const fonsterMaterial = material(0x9ec5e8, 0x223344);
const vaggMaterial = [0xf3e2b8, 0xe88a5a, 0xf5f5f5, 0xf1c84b, 0xc9e3a5].map((f) => material(f));

KARTA.hus.forEach(([x, z, bredd, djup, hojd], nr) => {
  const vagg = new THREE.Mesh(husKropp, vaggMaterial[nr % vaggMaterial.length]);
  vagg.scale.set(bredd, hojd, djup);
  vagg.position.set(x, hojd / 2, z);
  const tak = new THREE.Mesh(takForm, takMaterial);
  tak.scale.set(bredd, 2.5, djup);
  tak.rotation.y = Math.PI / 4;
  tak.position.set(x, hojd + 1.25, z);
  // Dörr och fönster på framsidan (mot +z)
  const dorr = new THREE.Mesh(husKropp, dorrMaterial);
  dorr.scale.set(1, 2, 0.1);
  dorr.position.set(x, 1, z + djup / 2 + 0.05);
  const fonster1 = new THREE.Mesh(husKropp, fonsterMaterial);
  fonster1.scale.set(1, 1, 0.1);
  fonster1.position.set(x - bredd / 4 - 0.4, hojd * 0.6, z + djup / 2 + 0.05);
  const fonster2 = fonster1.clone();
  fonster2.position.x = x + bredd / 4 + 0.4;
  vagg.castShadow = tak.castShadow = true;
  vagg.receiveShadow = true;
  scen.add(vagg, tak, dorr, fonster1, fonster2);
  laggTillHinder(x, z, bredd, djup, HOGT);
});

// Lådor och bodar
const ladMaterial = material(0xc8964f);
KARTA.lador.forEach(([x, z, bredd, djup, hojd]) => {
  const l = lada(bredd, hojd, djup, ladMaterial, x, hojd / 2, z);
  l.receiveShadow = true;
  scen.add(l);
  laggTillHinder(x, z, bredd, djup, hojd);
});
KARTA.bodar.forEach(([x, z, bredd, djup, hojd]) => {
  const bod = lada(bredd, hojd, djup, 0x9a6b3d, x, hojd / 2, z);
  bod.receiveShadow = true;
  scen.add(bod);
  laggTillHinder(x, z, bredd, djup, hojd);
});

// Staketet runt byn: alla stolpar ritas på en gång ("instanser")
(function byggStaket() {
  const s = KARTA.storlek, avstand = 4;
  const platser = [];
  for (let i = -s; i <= s; i += avstand) platser.push([i, -s], [i, s], [-s, i], [s, i]);
  const stolpar = new THREE.InstancedMesh(new THREE.BoxGeometry(0.3, 1.2, 0.3), material(0xf5f5f5), platser.length);
  const m = new THREE.Matrix4();
  platser.forEach(([x, z], nr) => stolpar.setMatrixAt(nr, m.makeTranslation(x, 0.6, z)));
  scen.add(stolpar);
  const regelMaterial = material(0xf5f5f5);
  [[0, -s, s * 2, 0.15], [0, s, s * 2, 0.15], [-s, 0, 0.15, s * 2], [s, 0, 0.15, s * 2]].forEach(([x, z, b, d]) => {
    scen.add(lada(b, 0.15, d, regelMaterial, x, 0.9, z));
  });
})();

// Samma slumptal varje gång, så att byn alltid ser likadan ut
function slump(fro) {
  let s = fro;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

// Träden: alla stammar ritas på en gång, och alla kronor på en gång
(function byggTrad() {
  const r = slump(7);
  const platser = [];
  const ledigt = (x, z) => {
    if (Math.abs(x) < 3 || Math.abs(z) < 3) return false;              // inte på vägarna
    if (Math.hypot(x - KARTA.damm.x, z - KARTA.damm.z) < KARTA.damm.radie + 2) return false;
    if (Math.hypot(x, z) < 10) return false;                           // inte på torget
    if (hinder.some((h) => overlappar(x, z, h, 2.5))) return false;
    const narFigur = [KARTA.morfar, KARTA.bajsis, KARTA.start].some((p) => Math.hypot(x - p.x, z - p.z) < 4);
    const narBajs = KARTA.guldbajsar.some(([bx, bz]) => Math.hypot(x - bx, z - bz) < 3);
    return !narFigur && !narBajs;
  };
  for (let forsok = 0; platser.length < KARTA.trad && forsok < 5000; forsok++) {
    const x = (r() * 2 - 1) * (KARTA.storlek - 3);
    const z = (r() * 2 - 1) * (KARTA.storlek - 3);
    if (ledigt(x, z)) platser.push([x, z, 0.8 + r() * 0.7, r() * Math.PI]);
  }
  const stammar = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.2, 0.3, 2, 6), material(0x7a4a24), platser.length);
  const kronor = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1.4, 0), material(0x2f8a3a), platser.length);
  const m = new THREE.Matrix4(), plats = new THREE.Vector3(), vrid = new THREE.Quaternion(), skala = new THREE.Vector3();
  const upp = new THREE.Vector3(0, 1, 0);
  platser.forEach(([x, z, s, vinkel], nr) => {
    vrid.setFromAxisAngle(upp, vinkel);
    skala.set(s, s, s);
    stammar.setMatrixAt(nr, m.compose(plats.set(x, s, z), vrid, skala));
    kronor.setMatrixAt(nr, m.compose(plats.set(x, s * 2.8, z), vrid, skala));
    laggTillHinder(x, z, 0.6, 0.6, HOGT);
  });
  stammar.castShadow = kronor.castShadow = true;
  scen.add(stammar, kronor);
})();

// ---------------------------------------------------------------------
//  Figurerna
// ---------------------------------------------------------------------

// En arm eller ett ben som svänger runt axeln/höften
function led(b, h, farg, x, y) {
  const fast = new THREE.Group();
  fast.position.set(x, y, 0);
  fast.add(lada(b, h, b, farg, 0, -h / 2, 0));
  return fast;
}

// En gubbe av lådor. Framsidan (ögonen) är åt +z.
function byggGubbe(farger) {
  const grupp = new THREE.Group();
  grupp.add(lada(0.8, 0.9, 0.5, farger.trija, 0, 1.35, 0));
  grupp.add(lada(0.6, 0.6, 0.6, farger.hud, 0, 2.15, 0));
  grupp.add(lada(0.12, 0.12, 0.05, 0x000000, -0.14, 2.2, 0.31));
  grupp.add(lada(0.12, 0.12, 0.05, 0x000000, 0.14, 2.2, 0.31));
  const delar = {
    grupp: grupp,
    vansterArm: led(0.22, 0.8, farger.trija, -0.52, 1.75),
    hogerArm: led(0.22, 0.8, farger.trija, 0.52, 1.75),
    vansterBen: led(0.28, 0.9, farger.byxor, -0.2, 0.9),
    hogerBen: led(0.28, 0.9, farger.byxor, 0.2, 0.9),
  };
  grupp.add(delar.vansterArm, delar.hogerArm, delar.vansterBen, delar.hogerBen);
  return delar;
}

function svingaArmarOchBen(gubbe, sving) {
  gubbe.vansterArm.rotation.x = sving;
  gubbe.hogerArm.rotation.x = -sving;
  gubbe.vansterBen.rotation.x = -sving;
  gubbe.hogerBen.rotation.x = sving;
}

// Spelaren
const spelare = byggGubbe({ trija: 0xe0413a, byxor: 0x2f4f9a, hud: 0xf2c49b });
scen.add(spelare.grupp);
const rorelse = { fartY: 0, paMarken: true, vinkel: Math.PI, steg: 0, hoppMinne: 0 };

// Morfar: grått hår, skägg och hatt
const morfar = byggGubbe({ trija: 0x7a5c99, byxor: 0x5a4a3a, hud: 0xf2c49b });
morfar.grupp.add(lada(0.64, 0.15, 0.64, 0xdddddd, 0, 2.5, 0));
morfar.grupp.add(lada(0.5, 0.3, 0.1, 0xdddddd, 0, 1.95, 0.33));
const hatt = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.35, 0.35, 8), material(0x333333));
hatt.position.y = 2.7;
hatt.castShadow = true;
morfar.grupp.add(hatt);
morfar.grupp.position.set(KARTA.morfar.x, 0, KARTA.morfar.z);
scen.add(morfar.grupp);
laggTillHinder(KARTA.morfar.x, KARTA.morfar.z, 0.8, 0.6, HOGT);

// Bajsis: tre bruna kulor på varandra, med ögon
const bajsis = new THREE.Group();
(function byggBajsis() {
  const brun = material(0x7a4a24);
  [[0.75, 0.6], [0.55, 1.35], [0.35, 1.9]].forEach(([radie, y]) => {
    const kula = new THREE.Mesh(new THREE.SphereGeometry(radie, 8, 6), brun);
    kula.scale.y = 0.75;
    kula.position.y = y;
    kula.castShadow = true;
    bajsis.add(kula);
  });
  const topp = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.4, 6), brun);
  topp.position.y = 2.25;
  bajsis.add(topp);
  const vitt = material(0xffffff), svart = material(0x000000);
  [-0.2, 0.2].forEach((x) => {
    const oga = new THREE.Mesh(new THREE.SphereGeometry(0.14, 6, 4), vitt);
    oga.position.set(x, 1.45, 0.48);
    const pupill = new THREE.Mesh(new THREE.SphereGeometry(0.07, 6, 4), svart);
    pupill.position.set(x, 1.45, 0.6);
    bajsis.add(oga, pupill);
  });
})();
bajsis.position.set(KARTA.bajsis.x, 0, KARTA.bajsis.z);
scen.add(bajsis);
laggTillHinder(KARTA.bajsis.x, KARTA.bajsis.z, 1.2, 1.2, HOGT);

// Guldbajsarna
const guldbajsar = [];
(function byggGuldbajsar() {
  const guld = material(0xffc83d, 0x664400);
  const former = [[0.4, 0], [0.3, 0.32], [0.18, 0.56]].map(([radie, y]) => {
    const f = new THREE.SphereGeometry(radie, 8, 5);
    f.scale(1, 0.75, 1);
    f.translate(0, y, 0);
    return f;
  });
  KARTA.guldbajsar.forEach(([x, z]) => {
    const g = new THREE.Group();
    former.forEach((f) => {
      const del = new THREE.Mesh(f, guld);
      del.castShadow = true;
      g.add(del);
    });
    const y = golvhojd(x, z, 50) + 0.5;
    g.position.set(x, y, z);
    scen.add(g);
    guldbajsar.push({ grupp: g, y: y, tagen: false, forsvinner: 0 });
  });
})();

// Pilen ovanför huvudet som visar vägen
const pil = new THREE.Group();
(function byggPil() {
  const spets = new THREE.Mesh(new THREE.ConeGeometry(0.35, 0.9, 4), material(0xffd23f, 0x553300));
  spets.rotation.x = Math.PI / 2;   // pekar framåt (+z) i stället för uppåt
  pil.add(spets);
})();
scen.add(pil);

// ---------------------------------------------------------------------
//  Ljud och tal
// ---------------------------------------------------------------------

let ljud = null;
function startaLjud() {
  try {
    if (!ljud) ljud = new (window.AudioContext || window.webkitAudioContext)();
    if (ljud.state === "suspended") ljud.resume();
  } catch (e) {
    ljud = null;   // Inget ljud – spelet fungerar ändå
  }
}

function pling(toner) {
  if (!ljud) return;
  toner.forEach((ton, nr) => {
    const osc = ljud.createOscillator(), volym = ljud.createGain();
    const start = ljud.currentTime + nr * 0.09;
    osc.type = "triangle";
    osc.frequency.value = ton;
    volym.gain.setValueAtTime(0.25, start);
    volym.gain.exponentialRampToValueAtTime(0.001, start + 0.3);
    osc.connect(volym).connect(ljud.destination);
    osc.start(start);
    osc.stop(start + 0.3);
  });
}

const harTal = "speechSynthesis" in window;
if (harTal) speechSynthesis.getVoices();   // Safari börjar ladda rösterna först när man frågar

const bubbla = document.getElementById("bubbla");
let bubblaTid = 0;

// En figur säger något: det syns i en pratbubbla och läses upp
function sag(vem, text) {
  document.getElementById("vemPratar").textContent = vem.namn;
  document.getElementById("repliken").textContent = text;
  bubbla.hidden = false;
  bubblaTid = Math.max(3, text.length * 0.08);
  if (!harTal) return;
  const roster = speechSynthesis.getVoices().filter((r) => r.lang.toLowerCase().indexOf(SPRAK) === 0);
  const yttrande = new SpeechSynthesisUtterance(text);
  yttrande.lang = SPRAK === "sv" ? "sv-SE" : "en-GB";
  if (roster.length) yttrande.voice = roster[vem.rostNummer % roster.length];
  yttrande.pitch = vem.rostlage;
  yttrande.rate = vem.tempo;
  speechSynthesis.cancel();   // Den som pratade förut slutar, så att det inte blir kö
  speechSynthesis.speak(yttrande);
}

function tystna() {
  if (harTal) speechSynthesis.cancel();
  bubbla.hidden = true;
  bubblaTid = 0;
}

const BAJSIS_REPLIKER = [
  t("Hej! Jag är Bajsis. Vissa guldbajsar ligger högt upp. Hoppa upp på lådorna!",
    "Hi! I'm Poopsie. Some golden poops are up high. Jump onto the boxes!"),
  t("Prutt! Ursäkta, det var bara en liten.", "Toot! Sorry, that was just a small one."),
  t("Morfar är snäll, men han tappar allt. Igår tappade han tänderna i soppan.",
    "Grandpa is nice, but he loses everything. Yesterday he dropped his teeth in the soup."),
  t("Följ den gula pilen ovanför ditt huvud. Den pekar på närmaste guldbajsen.",
    "Follow the yellow arrow above your head. It points to the nearest golden poop."),
  t("Vet du varför jag aldrig badar i dammen? Jag är rädd att jag ska flyta!",
    "Do you know why I never swim in the pond? I'm afraid I'll float!"),
  t("En guldbajs ligger på taket till boden. Hoppa från lådan!",
    "One golden poop is on the shed roof. Jump from the box!"),
];
INSTALLNINGAR.bajsis.namn = t("Bajsis", "Poopsie");
let bajsisNummer = 0;

function prataMed(vem) {
  if (vem === INSTALLNINGAR.bajsis) {
    sag(vem, BAJSIS_REPLIKER[bajsisNummer % BAJSIS_REPLIKER.length]);
    bajsisNummer++;
    return;
  }
  const kvar = guldbajsar.filter((g) => !g.tagen).length;
  const hittade = guldbajsar.length - kvar;
  if (hittade === 0) {
    sag(vem, t("Hej hej! Jag har tappat mina tio guldbajsar runt om i byn. Kan du hitta dem åt mig? Pilen visar vägen!",
      "Hello there! I've lost my ten golden poops around the village. Can you find them for me? The arrow shows the way!"));
  } else {
    sag(vem, t("Du har hittat " + hittade + ". Bara " + kvar + " kvar. Du är bäst!",
      "You've found " + hittade + ". Only " + kvar + " left. You're the best!"));
  }
}

// ---------------------------------------------------------------------
//  Styrning: tangentbord, touch och handkontroll
// ---------------------------------------------------------------------

const tangenter = {};
window.addEventListener("keydown", (e) => {
  tangenter[e.code] = true;
  if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space"].indexOf(e.code) >= 0) e.preventDefault();
  if (e.repeat) return;
  if (e.code === "KeyP" || e.code === "Escape") {
    if (lage === "spelar") pausa();
    else if (lage === "paus") fortsatt();
  }
  if ((e.code === "Enter" || e.code === "KeyT") && lage === "spelar") vantandePrat = true;
});
window.addEventListener("keyup", (e) => { tangenter[e.code] = false; });

let vantandePrat = false;
const harTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
const joystick = document.getElementById("joystick");
const pinne = document.getElementById("pinne");
const hoppknapp = document.getElementById("hopp");
const spak = { x: 0, y: 0, finger: null };
let touchHopp = false;

function flyttaSpak(touch) {
  const ruta = joystick.getBoundingClientRect();
  const radie = ruta.width / 2;
  let dx = (touch.clientX - (ruta.left + radie)) / radie;
  let dy = (touch.clientY - (ruta.top + radie)) / radie;
  const langd = Math.sqrt(dx * dx + dy * dy);
  if (langd > 1) { dx /= langd; dy /= langd; }
  spak.x = dx;
  spak.y = dy;
  pinne.style.transform = "translate(" + dx * radie * 0.6 + "px," + dy * radie * 0.6 + "px)";
}
function slappSpak() {
  spak.x = spak.y = 0;
  spak.finger = null;
  pinne.style.transform = "";
}
joystick.addEventListener("touchstart", (e) => {
  e.preventDefault();
  spak.finger = e.changedTouches[0].identifier;
  flyttaSpak(e.changedTouches[0]);
}, { passive: false });
joystick.addEventListener("touchmove", (e) => {
  e.preventDefault();
  for (const touch of e.changedTouches) if (touch.identifier === spak.finger) flyttaSpak(touch);
}, { passive: false });
const slutaSpak = (e) => {
  for (const touch of e.changedTouches) if (touch.identifier === spak.finger) slappSpak();
};
joystick.addEventListener("touchend", slutaSpak);
joystick.addEventListener("touchcancel", slutaSpak);

hoppknapp.addEventListener("touchstart", (e) => {
  e.preventDefault();
  touchHopp = true;
  hoppknapp.classList.add("tryckt");
}, { passive: false });
const slutaHopp = () => { touchHopp = false; hoppknapp.classList.remove("tryckt"); };
hoppknapp.addEventListener("touchend", slutaHopp);
hoppknapp.addEventListener("touchcancel", slutaHopp);

// Dra med fingret (eller musen) på skärmen för att vrida kameran
let kameraDrag = null;   // { id, x }
let senastManuellKamera = -10;
function vridKamera(nyttX) {
  kameraVinkel -= (nyttX - kameraDrag.x) * 0.008;
  kameraDrag.x = nyttX;
  senastManuellKamera = speltid;
}
duk.addEventListener("touchstart", (e) => {
  if (!kameraDrag) kameraDrag = { id: e.changedTouches[0].identifier, x: e.changedTouches[0].clientX };
}, { passive: true });
duk.addEventListener("touchmove", (e) => {
  for (const touch of e.changedTouches) if (kameraDrag && touch.identifier === kameraDrag.id) vridKamera(touch.clientX);
}, { passive: true });
duk.addEventListener("touchend", (e) => {
  for (const touch of e.changedTouches) if (kameraDrag && touch.identifier === kameraDrag.id) kameraDrag = null;
});
duk.addEventListener("mousedown", (e) => { kameraDrag = { id: "mus", x: e.clientX }; });
window.addEventListener("mousemove", (e) => { if (kameraDrag && kameraDrag.id === "mus") vridKamera(e.clientX); });
window.addEventListener("mouseup", () => { if (kameraDrag && kameraDrag.id === "mus") kameraDrag = null; });

// Knappar som bara ska räknas en gång per tryck (inte hela tiden man håller ner)
const forraKnappar = {};
function nyttTryck(namn, nere) {
  const ny = nere && !forraKnappar[namn];
  forraKnappar[namn] = nere;
  return ny;
}

// Läser tangenter, touch och handkontroller och säger vad spelaren vill göra
function lasStyrning() {
  let x = 0, y = 0, sving = 0, hopp = false, prat = false, paus = false;
  if (tangenter.ArrowLeft || tangenter.KeyA) x -= 1;
  if (tangenter.ArrowRight || tangenter.KeyD) x += 1;
  if (tangenter.ArrowUp || tangenter.KeyW) y -= 1;
  if (tangenter.ArrowDown || tangenter.KeyS) y += 1;
  if (tangenter.KeyQ) sving += 1;
  if (tangenter.KeyE) sving -= 1;
  if (tangenter.Space) hopp = true;
  x += spak.x;
  y += spak.y;
  if (touchHopp) hopp = true;

  const kontroller = navigator.getGamepads ? navigator.getGamepads() : [];
  for (let i = 0; i < kontroller.length; i++) {
    const k = kontroller[i];
    if (!k) continue;
    const axel = (nr) => {
      const v = k.axes[nr] || 0;
      return Math.abs(v) > INSTALLNINGAR.dodzon ? v : 0;
    };
    const tryckt = (nr) => !!(k.buttons[nr] && k.buttons[nr].pressed);
    x += axel(0);
    y += axel(1);
    sving -= axel(2);   // höger spak vrider kameran
    if (tryckt(12)) y -= 1;   // styrkorset
    if (tryckt(13)) y += 1;
    if (tryckt(14)) x -= 1;
    if (tryckt(15)) x += 1;
    if (tryckt(0)) hopp = true;           // A
    if (tryckt(2) || tryckt(3)) prat = true;   // X eller Y
    if (tryckt(9)) paus = true;           // Start/Meny
  }

  const langd = Math.sqrt(x * x + y * y);
  if (langd > 1) { x /= langd; y /= langd; }
  return {
    x: x, y: y, sving: Math.max(-1, Math.min(1, sving)),
    hoppNytt: nyttTryck("hopp", hopp),
    pratNytt: nyttTryck("prat", prat),
    pausNytt: nyttTryck("paus", paus),
  };
}

// ---------------------------------------------------------------------
//  Spelet
// ---------------------------------------------------------------------

let lage = "start";   // "start", "spelar", "paus" eller "slut"
let speltid = 0;      // sekunder sedan spelet började (räknas inte under paus)
let kameraVinkel = 0;

const hud = document.getElementById("hud");
const pratKnapp = document.getElementById("prata");
const pausKnapp = document.getElementById("paus");
const startruta = document.getElementById("startruta");
const pausmeny = document.getElementById("pausmeny");
const slutruta = document.getElementById("slutruta");

function nollstall() {
  spelare.grupp.position.set(KARTA.start.x, 0, KARTA.start.z);
  rorelse.fartY = 0;
  rorelse.paMarken = true;
  rorelse.vinkel = Math.PI;   // tittar mot morfar
  kameraVinkel = 0;
  speltid = 0;
  guldbajsar.forEach((g) => {
    g.tagen = false;
    g.forsvinner = 0;
    g.grupp.visible = true;
    g.grupp.scale.set(1, 1, 1);
  });
  placeraKamera(1);
  visaHud();
}

function startaSpel() {
  startaLjud();
  nollstall();
  lage = "spelar";
  startruta.hidden = slutruta.hidden = pausmeny.hidden = true;
  pausKnapp.hidden = false;
  hud.hidden = false;
  joystick.hidden = hoppknapp.hidden = !harTouch;
  prataMed(INSTALLNINGAR.morfar);
}

function pausa() {
  if (lage !== "spelar") return;
  lage = "paus";
  tystna();
  pausmeny.hidden = false;
  slappSpak();
  slutaHopp();
}

function fortsatt() {
  if (lage !== "paus") return;
  lage = "spelar";
  pausmeny.hidden = true;
}

function slut() {
  lage = "slut";
  const sekunder = Math.round(speltid);
  const poang = Math.max(INSTALLNINGAR.minstaPoang, Math.round(INSTALLNINGAR.maxPoang - sekunder * INSTALLNINGAR.poangPerSekund));
  sag(INSTALLNINGAR.morfar, t("Alla tio! Tack snälla du! Nu ska jag ha dem i en låda så att jag inte tappar dem igen.",
    "All ten! Thank you so much! Now I'll keep them in a box so I don't lose them again."));
  document.getElementById("slutText").textContent =
    t("Du hittade alla guldbajsar på " + tidText(sekunder) + " och fick " + poang + " poäng!",
      "You found all the golden poops in " + tidText(sekunder) + " and got " + poang + " points!");
  setTimeout(() => {
    slutruta.hidden = false;
    pausKnapp.hidden = true;
    joystick.hidden = hoppknapp.hidden = pratKnapp.hidden = true;
    Topplista.nyttResultat("bajsbyn", poang, { fordrojning: 1 });
  }, 2500);
}

function tidText(sekunder) {
  const s = Math.floor(sekunder % 60);
  return Math.floor(sekunder / 60) + ":" + (s < 10 ? "0" : "") + s;
}

function visaHud() {
  const hittade = guldbajsar.filter((g) => g.tagen).length;
  hud.textContent = "💩 " + hittade + "/" + guldbajsar.length + "   ⏱ " + tidText(speltid);
}

document.getElementById("spela").addEventListener("click", startaSpel);
document.getElementById("igen").addEventListener("click", startaSpel);
document.getElementById("borjaOm").addEventListener("click", startaSpel);
document.getElementById("fortsatt").addEventListener("click", fortsatt);
pausKnapp.addEventListener("click", pausa);
pratKnapp.addEventListener("click", () => { vantandePrat = true; });
document.addEventListener("visibilitychange", () => { if (document.hidden) pausa(); });

// Vem står man nära? (den man kan prata med)
function narmasteFigur() {
  const p = spelare.grupp.position;
  if (Math.hypot(p.x - KARTA.morfar.x, p.z - KARTA.morfar.z) < INSTALLNINGAR.pratAvstand) return INSTALLNINGAR.morfar;
  if (Math.hypot(p.x - KARTA.bajsis.x, p.z - KARTA.bajsis.z) < INSTALLNINGAR.pratAvstand + 0.5) return INSTALLNINGAR.bajsis;
  return null;
}

function uppdatera(dt, styr) {
  speltid += dt;
  const pos = spelare.grupp.position;
  const fart = Math.sqrt(styr.x * styr.x + styr.y * styr.y);

  // Kameran: höger spak, Q/E eller dra med fingret
  if (styr.sving) {
    kameraVinkel += styr.sving * INSTALLNINGAR.kameraSving * dt;
    senastManuellKamera = speltid;
  }

  if (fart > 0.05) {
    // Styrningen gäller sett från kameran: uppåt = bort från kameran
    const riktning = kameraVinkel + Math.atan2(-styr.x, -styr.y);
    const steg = INSTALLNINGAR.springfart * fart * dt;
    const nyX = pos.x - Math.sin(riktning) * steg;
    const nyZ = pos.z - Math.cos(riktning) * steg;
    const grans = KARTA.storlek - 0.8;
    // Går man in i något glider man längs med det
    if (!iVagen(nyX, pos.z, pos.y)) pos.x = Math.max(-grans, Math.min(grans, nyX));
    if (!iVagen(pos.x, nyZ, pos.y)) pos.z = Math.max(-grans, Math.min(grans, nyZ));

    // Figuren vrider sig mjukt åt det håll den springer
    let skillnad = riktning - rorelse.vinkel;
    skillnad = Math.atan2(Math.sin(skillnad), Math.cos(skillnad));
    rorelse.vinkel += skillnad * Math.min(1, dt * 12);
    rorelse.steg += dt * 12 * fart;

    // Kameran svänger långsamt in bakom figuren (om man inte nyss vridit den själv)
    if (speltid - senastManuellKamera > 1.5) {
      let kameraSkillnad = rorelse.vinkel - kameraVinkel;
      kameraSkillnad = Math.atan2(Math.sin(kameraSkillnad), Math.cos(kameraSkillnad));
      kameraVinkel += kameraSkillnad * Math.min(1, dt * 1.2 * fart);
    }
  }
  spelare.grupp.rotation.y = rorelse.vinkel + Math.PI;

  // Hopp och tyngdkraft. Lådor och bodar räknas som mark.
  // Trycker man precis innan man landar hoppar man ändå (hoppMinne)
  if (styr.hoppNytt) rorelse.hoppMinne = 0.15;
  rorelse.hoppMinne -= dt;
  if (rorelse.hoppMinne > 0 && rorelse.paMarken) {
    rorelse.hoppMinne = 0;
    rorelse.fartY = INSTALLNINGAR.hoppfart;
    rorelse.paMarken = false;
    pling([330]);
  }
  const fotForut = pos.y;
  rorelse.fartY -= INSTALLNINGAR.tyngdkraft * dt;
  pos.y += rorelse.fartY * dt;
  const golv = golvhojd(pos.x, pos.z, fotForut);
  rorelse.paMarken = false;
  if (pos.y <= golv) {
    pos.y = golv;
    rorelse.fartY = 0;
    rorelse.paMarken = true;
  }

  // Armar och ben
  svingaArmarOchBen(spelare, fart > 0.05 ? Math.sin(rorelse.steg) * 0.8 * fart : 0);
  if (!rorelse.paMarken) spelare.vansterArm.rotation.x = spelare.hogerArm.rotation.x = Math.PI * 0.9;

  // Plocka guldbajsar
  guldbajsar.forEach((g) => {
    if (g.tagen) return;
    const avstand = Math.hypot(pos.x - g.grupp.position.x, pos.y + 0.8 - g.grupp.position.y, pos.z - g.grupp.position.z);
    if (avstand < INSTALLNINGAR.plockAvstand + 0.6) {
      g.tagen = true;
      g.forsvinner = 0.35;
      pling([660, 880, 1320]);
      const kvar = guldbajsar.filter((b) => !b.tagen).length;
      if (kvar === 0) {
        sag(INSTALLNINGAR.bajsis, t("Du har hittat alla! Spring tillbaka till morfar!", "You found them all! Run back to Grandpa!"));
      }
    }
  });

  // Prata
  const figur = narmasteFigur();
  const allaHittade = guldbajsar.every((g) => g.tagen);
  if (allaHittade && figur === INSTALLNINGAR.morfar) {
    slut();
    return;
  }
  pratKnapp.hidden = !figur;
  if (figur) pratKnapp.textContent = "💬 " + t("Prata med ", "Talk to ") + figur.namn;
  if ((vantandePrat || styr.pratNytt) && figur) prataMed(figur);
  vantandePrat = false;

  // Pilen pekar mot närmaste guldbajs, eller mot morfar när alla är hittade
  let mal = null, narmast = Infinity;
  guldbajsar.forEach((g) => {
    if (g.tagen) return;
    const d = Math.hypot(g.grupp.position.x - pos.x, g.grupp.position.z - pos.z);
    if (d < narmast) { narmast = d; mal = g.grupp.position; }
  });
  if (!mal) mal = morfar.grupp.position;
  pil.position.set(pos.x, pos.y + 3.1 + Math.sin(speltid * 4) * 0.12, pos.z);
  pil.rotation.y = Math.atan2(mal.x - pos.x, mal.z - pos.z);

  visaHud();
  placeraKamera(dt);
}

// Kameran följer efter, bakom och lite ovanför
const kameraMal = new THREE.Vector3();
function placeraKamera(dt) {
  const pos = spelare.grupp.position;
  kameraMal.set(
    pos.x + Math.sin(kameraVinkel) * INSTALLNINGAR.kameraAvstand,
    pos.y * 0.6 + INSTALLNINGAR.kameraHojd,
    pos.z + Math.cos(kameraVinkel) * INSTALLNINGAR.kameraAvstand
  );
  kamera.position.lerp(kameraMal, Math.min(1, dt * 6));
  kamera.lookAt(pos.x, pos.y + 1.8, pos.z);
  // Solen och dess skuggruta följer med spelaren
  sol.position.set(pos.x + 30, 50, pos.z + 20);
  sol.target.position.copy(pos);
}

// Sådant som rör sig hela tiden, även när man inte spelar
let klocka = 0;
function animera(dt) {
  klocka += dt;
  guldbajsar.forEach((g, nr) => {
    if (!g.grupp.visible) return;
    g.grupp.rotation.y = klocka * 2 + nr;
    g.grupp.position.y = g.y + Math.sin(klocka * 3 + nr) * 0.12;
    if (g.tagen) {
      g.forsvinner -= dt;
      const s = Math.max(0, g.forsvinner / 0.35);
      g.grupp.scale.set(2 - s, s, 2 - s);
      g.grupp.position.y += (1 - s) * 1.5;
      if (g.forsvinner <= 0) g.grupp.visible = false;
    }
  });
  // Bajsis studsar och Morfar gungar lite
  bajsis.scale.set(1 + Math.sin(klocka * 4) * 0.04, 1 - Math.sin(klocka * 4) * 0.05, 1 + Math.sin(klocka * 4) * 0.04);
  morfar.grupp.rotation.z = Math.sin(klocka * 1.5) * 0.04;
  // Bajsis och Morfar tittar mot spelaren
  const p = spelare.grupp.position;
  bajsis.rotation.y = Math.atan2(p.x - bajsis.position.x, p.z - bajsis.position.z);
  morfar.grupp.rotation.y = Math.atan2(p.x - morfar.grupp.position.x, p.z - morfar.grupp.position.z);
  pil.visible = lage === "spelar";

  if (bubblaTid > 0) {
    bubblaTid -= dt;
    if (bubblaTid <= 0) bubbla.hidden = true;
  }
}

// ---------------------------------------------------------------------
//  Kvalitet: blir det för få bilder per sekund sänks upplösningen,
//  och sedan stängs skuggorna av
// ---------------------------------------------------------------------

const kvalitet = {
  tid: 0, bilder: 0, steg: 0,
  rakna(verkligTid) {
    if (lage !== "spelar" || this.steg >= 2) return;
    this.tid += verkligTid;
    this.bilder++;
    if (this.tid < 4) return;
    if (this.bilder / this.tid < 24) {
      this.steg++;
      if (this.steg === 1) {
        renderare.setPixelRatio(1);
        anpassaStorlek();
      } else {
        renderare.shadowMap.enabled = false;
        sol.castShadow = false;
        allaMaterial.forEach((m) => { m.needsUpdate = true; });
      }
    }
    this.tid = this.bilder = 0;
  },
};

function anpassaStorlek() {
  renderare.setSize(window.innerWidth, window.innerHeight, false);
  kamera.aspect = window.innerWidth / window.innerHeight;
  kamera.updateProjectionMatrix();
}
window.addEventListener("resize", anpassaStorlek);
window.addEventListener("orientationchange", () => setTimeout(anpassaStorlek, 300));

// ---------------------------------------------------------------------
//  Starta
// ---------------------------------------------------------------------

anpassaStorlek();
nollstall();

let forraTiden = performance.now();
function ruta(nu) {
  const verkligTid = Math.max(0, (nu - forraTiden) / 1000);
  // Max 0,1 sekunder per steg, så att figuren inte flyger iväg efter en paus
  const dt = Math.min(0.1, verkligTid);
  forraTiden = nu;
  const styr = lasStyrning();
  const topplistaOppen = window.Topplista && Topplista.arOppen();
  if (lage === "start" && styr.hoppNytt && !topplistaOppen) startaSpel();
  else if (lage === "slut" && styr.hoppNytt && !slutruta.hidden && !topplistaOppen) startaSpel();
  else if (lage === "spelar") {
    if (styr.pausNytt) pausa();
    else uppdatera(dt, styr);
  } else if (lage === "paus" && (styr.pausNytt || styr.hoppNytt)) fortsatt();
  animera(dt);
  renderare.render(scen, kamera);
  kvalitet.rakna(verkligTid);
  requestAnimationFrame(ruta);
}
requestAnimationFrame(ruta);
