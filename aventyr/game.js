// =====================================================================
//  ENSAMMA HEMMA PÅ LÖRDAG – äventyrsspelet i 3D
//
//  Storyn finns i STORY.md i samma mapp. Här finns kapitel 1–3:
//    1. Lappen        – mata Kanel, vattna blommorna, (ingen glass?)
//    2. Fem minuter   – pappas kran sprutar, stäng huvudkranen
//    3. Var är Kanel? – leta ledtrådar och gå skogsvägen till kolonilotterna
//
//  Man väljer två syskon. Man styr det ena och det andra följer efter.
//  Varje barn har en förmåga (krypa, klättra, bära, läsa), och vissa saker
//  går bara att göra med rätt barn. ❤️ för snälla saker, 💥 för busiga.
//
//  Allt i 3D byggs av kod med Three.js (../three.min.js), utan modellfiler.
//  Styrning: joystick + HOPP på iPad, piltangenter/WASD + mellanslag på
//  datorn (T = gör/prata, C = byt barn, Q/E = vrid kameran), och
//  handkontroll (spak, A = hoppa, X = gör/prata, Y = byt barn, Start = paus).
// =====================================================================

const INSTALLNINGAR = {
  springfart: 7.5,        // meter per sekund (lillasyster springer fortare)
  hoppfart: 8.5,          // lillasyster hoppar högre
  tyngdkraft: 25,
  stegHojd: 0.35,         // så höga kanter man går upp på utan att hoppa
  sikt: 120,              // meter; längre bort syns bara dimma
  gorAvstand: 2.2,        // så nära man ska stå för att kunna göra något
  dodzon: 0.25,
  // Kameran ute och inne (inne tittar den mer uppifrån, som i ett dockskåp)
  kameraUte: { avstand: 8, hojd: 4.5 },
  kameraInne: { avstand: 6.5, hojd: 8.5 },
  kameraSving: 2.5,
  // Poäng i slutet
  poangHjarta: 100,
  poangKaos: 100,
  poangSak: 50,
  poangUtmarkelse: 200,
  adress: t("Lördagsgatan 6", "6 Saturday Street"),
};

// Hemmet inuti ligger en bit bort (x = 300), så att det inte syns utifrån
const INNE = { x: 300, z: 0 };
function ix(x) { return INNE.x + x; }
function iz(z) { return INNE.z + z; }
function arInne(p) { return p.x > 200; }

// ---------------------------------------------------------------------
//  Renderaren, scenen och ljuset
// ---------------------------------------------------------------------

// Går något fel syns det i startrutan (eller överst på skärmen), så att man kan berätta vad det står
window.addEventListener("error", (e) => {
  const ruta = document.getElementById("felruta");
  if (!ruta) return;
  ruta.textContent = "⚠️ " + t("Fel: ", "Error: ") + e.message + t(" Ladda om sidan.", " Reload the page.");
  ruta.hidden = false;
});

const duk = document.getElementById("spel");
let renderare;
try {
  // Three.js r159 tar WebGL 2 om det finns och annars WebGL 1
  renderare = new THREE.WebGLRenderer({ canvas: duk, antialias: false, powerPreference: "high-performance" });
} catch (fel) {
  document.getElementById("startInfo").textContent =
    t("Den här enheten klarar tyvärr inte 3D (WebGL saknas).", "Sorry, this device can't show 3D (no WebGL).");
  document.getElementById("borja").hidden = true;
  throw fel;
}
renderare.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
renderare.shadowMap.enabled = true;

const himmelsfarg = 0xa8dcff;
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
const materialMinne = {};
function material(farg, glod) {
  const nyckel = farg + "/" + (glod || 0);
  if (materialMinne[nyckel]) return materialMinne[nyckel];
  const m = new THREE.MeshLambertMaterial({ color: farg, flatShading: true, emissive: glod || 0x000000 });
  allaMaterial.push(m);
  materialMinne[nyckel] = m;
  return m;
}
function genomskinligt(farg, synlighet) {
  const m = new THREE.MeshLambertMaterial({ color: farg, transparent: true, opacity: synlighet });
  allaMaterial.push(m);
  return m;
}

const kub = new THREE.BoxGeometry(1, 1, 1);
// En låda med mitten i (x, y, z)
function lada(b, h, d, farg, x, y, z, foralder) {
  const del = new THREE.Mesh(kub, typeof farg === "number" ? material(farg) : farg);
  del.scale.set(b, h, d);
  del.position.set(x, y, z);
  del.castShadow = true;
  del.receiveShadow = true;
  (foralder || scen).add(del);
  return del;
}

// En platt yta på marken (väg, matta, vattenpöl ...)
function platta(bredd, djup, farg, x, z, y) {
  const p = new THREE.Mesh(new THREE.PlaneGeometry(bredd, djup), typeof farg === "number" ? material(farg) : farg);
  p.rotation.x = -Math.PI / 2;
  p.position.set(x, y || 0.02, z);
  p.receiveShadow = true;
  scen.add(p);
  return p;
}

function cirkel(radie, farg, x, z, y) {
  const c = new THREE.Mesh(new THREE.CircleGeometry(radie, 18), typeof farg === "number" ? material(farg) : farg);
  c.rotation.x = -Math.PI / 2;
  c.position.set(x, y || 0.03, z);
  scen.add(c);
  return c;
}

// En skylt med text (ritas på en liten bild)
function skylt(text, x, y, z, vinkel, bredd, bakgrund) {
  const bild = document.createElement("canvas");
  bild.width = 512;
  bild.height = 128;
  const g = bild.getContext("2d");
  g.fillStyle = bakgrund || "#fffbe8";
  g.fillRect(0, 0, 512, 128);
  g.fillStyle = "#2b1d0e";
  g.font = "bold 64px system-ui, -apple-system, sans-serif";
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.fillText(text, 256, 68, 490);
  const textur = new THREE.CanvasTexture(bild);
  const s = new THREE.Mesh(new THREE.PlaneGeometry(bredd || 4, (bredd || 4) / 4), new THREE.MeshBasicMaterial({ map: textur }));
  s.position.set(x, y, z);
  s.rotation.y = vinkel || 0;
  scen.add(s);
  return s;
}

// Samma slumptal varje gång, så att staden alltid ser likadan ut
function slump(fro) {
  let s = fro;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

// ---------------------------------------------------------------------
//  Hinder: allt man kan krocka med eller stå på
// ---------------------------------------------------------------------

const HOGT = 99;   // Så högt att man inte kan stå ovanpå (väggar, tak)
const hinder = [];   // { x, z, hb, hd, topp }  (hb/hd = halva bredden/djupet)

// hojd = hur högt det syns (för kameran). Utan hojd: 5 meter för höga saker.
function laggTillHinder(x, z, bredd, djup, topp, hojd) {
  const h = { x: x, z: z, hb: bredd / 2, hd: djup / 2, topp: topp, hojd: hojd !== undefined ? hojd : (topp === HOGT ? 5 : topp) };
  hinder.push(h);
  return h;
}

function overlappar(x, z, h, marginal) {
  return Math.abs(x - h.x) < h.hb + marginal && Math.abs(z - h.z) < h.hd + marginal;
}

// Hur högt marken är där man står (soffor, lådor och kanter räknas som mark)
function golvhojd(x, z, fotY, radie) {
  let golv = 0;
  for (const h of hinder) {
    if (h.topp <= fotY + INSTALLNINGAR.stegHojd && h.topp > golv && overlappar(x, z, h, radie * 0.7)) golv = h.topp;
  }
  return golv;
}

function iVagen(x, z, fotY, radie) {
  for (const h of hinder) {
    if (h.topp > fotY + INSTALLNINGAR.stegHojd && overlappar(x, z, h, radie)) return true;
  }
  return false;
}

// En möbel eller vägg: syns och går inte att gå igenom
function mobel(b, h, d, farg, x, z, kanStaPa) {
  const m = lada(b, h, d, farg, x, h / 2, z);
  laggTillHinder(x, z, b, d, kanStaPa ? h : HOGT, h);
  return m;
}

// ---------------------------------------------------------------------
//  Staden
// ---------------------------------------------------------------------

const GRANSER = { xMin: -98, xMax: 98, zMin: -103, zMax: 78 };

const mark = new THREE.Mesh(new THREE.PlaneGeometry(900, 500), material(0x6cbf4a));
mark.rotation.x = -Math.PI / 2;
mark.position.x = 150;
mark.receiveShadow = true;
scen.add(mark);

// Huvudgatan (z = 0) med trottoarer, och övergångsstället vid skogsvägen
platta(200, 8, 0x55595e, 0, 0, 0.02);
platta(200, 3, 0xb9b9b4, 0, -5.5, 0.03);
platta(200, 3, 0xb9b9b4, 0, 5.5, 0.03);
for (let x = -100; x < 100; x += 6) platta(2.5, 0.25, 0xf2f2f2, x, 0, 0.035);
for (let z = -3.5; z <= 3.5; z += 1) platta(4, 0.55, 0xf2f2f2, -70, z, 0.04);
const OVERGANG = { x: -70, soder: 6.2, norr: -6.2 };

// Skogsvägen: smal, utan trottoar, norrut till kolonilotterna
const SKOGSVAG = { x: -75, zStart: -7, zSlut: -88 };
platta(5.4, 81, 0x4d5054, SKOGSVAG.x, (SKOGSVAG.zStart + SKOGSVAG.zSlut) / 2, 0.025);
platta(0.15, 81, 0xd8d8d0, SKOGSVAG.x - 2.6, (SKOGSVAG.zStart + SKOGSVAG.zSlut) / 2, 0.03);
platta(0.15, 81, 0xd8d8d0, SKOGSVAG.x + 2.6, (SKOGSVAG.zStart + SKOGSVAG.zSlut) / 2, 0.03);
skylt(t("Skogsvägen", "Forest Road"), SKOGSVAG.x + 4, 2.4, -9, 0, 3.2);
mobel(0.15, 2.4, 0.15, 0x666666, SKOGSVAG.x + 4, -9.1);

// Lyktstolpar längs norra trottoaren
const LYKTSTOLPAR = [-40, -20, 0, 20, 40];
LYKTSTOLPAR.forEach((x) => {
  mobel(0.25, 4.5, 0.25, 0x444a52, x, -6.6);
  lada(0.6, 0.3, 0.6, 0xfff2b0, x, 4.6, -6.6);
});

// Radhusen söder om gatan. Vårt är nummer 6 (x = 5).
const HEM = { x: 5, dorrZ: 11.45 };
(function byggRadhus() {
  const farger = [0xe8b07a, 0xf3e2b8, 0xd8735a, 0xc9e3a5];
  [-15, -5, 5, 15].forEach((x, nr) => {
    lada(10, 5, 9, farger[nr], x, 2.5, 16);
    lada(1.2, 2.2, 0.15, x === HEM.x ? 0x2f6fd0 : 0x6b4423, x, 1.1, 11.45);
    lada(1.4, 1.2, 0.12, 0x9ec5e8, x - 3, 3.1, 11.45);
    lada(1.4, 1.2, 0.12, 0x9ec5e8, x + 3, 3.1, 11.45);
  });
  laggTillHinder(0, 16, 40, 9, HOGT, 7.5);
  // Taket: två lutande skivor
  [-1, 1].forEach((sida) => {
    const tak = lada(41, 0.3, 5.4, 0x8a3a2a, 0, 6.3, 16 + sida * 2.3);
    tak.rotation.x = sida * 0.55;
  });
  // Häckar mellan trädgårdarna
  [-20, -10, 0, 10, 20].forEach((x) => mobel(0.6, 1, 4, 0x2f7a3a, x, 9.5, true));
  skylt(INSTALLNINGAR.adress, HEM.x, 4.4, 11.38, Math.PI, 2.8);
})();

// Föreningslokalen och cykelrummet norr om gatan, med staket bakom
(function byggKvarteret() {
  mobel(16, 4, 10, 0xd9cfb8, -30, -18);
  lada(1.4, 2.2, 0.15, 0x6b4423, -30, 1.1, -12.95);
  skylt(t("Föreningslokal", "Community Hall"), -30, 3.3, -12.9, 0, 5);
  mobel(6, 3, 6, 0xb8a888, -16, -17);
  skylt(t("Cykelrum", "Bike Room"), -16, 2.4, -13.95, 0, 3);
  for (let x = -40; x <= -12; x += 0.8) lada(0.12, 1.3, 0.12, 0xf5f5f5, x, 0.65, -27);
  lada(28, 0.12, 0.12, 0xf5f5f5, -26, 1.1, -27);
  laggTillHinder(-26, -27, 28, 0.3, HOGT);
})();

// Butikerna i stan, norr om gatan österut
const BUTIKER = [
  { x: 28, bredd: 12, farg: 0xc9d6e3, text: t("Gym 💪", "Gym 💪") },
  { x: 42, bredd: 12, farg: 0xf3c6d6, text: t("Nagelstället 💅", "Nail Salon 💅") },
  { x: 56, bredd: 12, farg: 0xd6c9f3, text: t("Sound healing 🔔", "Sound healing 🔔") },
  { x: 70, bredd: 12, farg: 0xf3e2b8, text: t("Café Havre ☕", "Café Oat ☕") },
  { x: 86, bredd: 14, farg: 0xbfbfbf, text: t("Däckverkstad 🔧", "Tyre Shop 🔧") },
];
BUTIKER.forEach((b) => {
  mobel(b.bredd, 5, 9, b.farg, b.x, -13.5);
  lada(1.6, 2.4, 0.15, 0x6b4423, b.x, 1.2, -8.95);
  lada(3, 1.6, 0.12, 0x9ec5e8, b.x - 3.5, 1.8, -8.95);
  skylt(b.text, b.x, 3.7, -8.9, 0, Math.min(6, b.bredd - 1));
});
// Däcken utanför däckverkstaden
for (let i = 0; i < 4; i++) {
  const dack = new THREE.Mesh(new THREE.TorusGeometry(0.45, 0.2, 6, 10), material(0x222222));
  dack.rotation.x = Math.PI / 2;
  dack.position.set(91, 0.2 + i * 0.4, -7.5);
  scen.add(dack);
}

// Parken söder om gatan
const DAMM = { x: 25, z: 48, radie: 8 };
(function byggParken() {
  platta(3, 66, 0xd9b77a, 25, 41, 0.02);
  cirkel(DAMM.radie, 0x3d8fd6, DAMM.x, DAMM.z, 0.04);
  // Fontänen med isbadaren
  const kant = new THREE.Mesh(new THREE.CylinderGeometry(2.6, 2.8, 0.6, 12), material(0xbdbdb5));
  kant.position.set(45, 0.3, 28);
  kant.receiveShadow = true;
  scen.add(kant);
  cirkel(2.3, 0x6ab7f0, 45, 28, 0.62);
  lada(0.5, 1.8, 0.5, 0xbdbdb5, 47.5, 0.9, 28);
  laggTillHinder(45, 28, 5, 5, 0.6);
  // Korvkiosken
  mobel(4, 2.8, 3, 0xe0413a, 12, 30);
  lada(4.6, 0.3, 3.6, 0xffffff, 12, 2.95, 30);
  skylt(t("Korv 🌭", "Hot dogs 🌭"), 12, 2.2, 31.55, 0, 2.6);
  // Padelbanan med glasväggar
  platta(10, 20, 0x2f6fd0, 58, 58, 0.03);
  const glas = genomskinligt(0xcfefff, 0.35);
  lada(10, 3, 0.15, glas, 58, 1.5, 48);
  lada(10, 3, 0.15, glas, 58, 1.5, 68);
  lada(0.15, 3, 20, glas, 63, 1.5, 58);
  lada(0.15, 3, 8, glas, 53, 1.5, 52);
  lada(0.15, 3, 8, glas, 53, 1.5, 64);
  laggTillHinder(58, 48, 10, 0.3, HOGT);
  laggTillHinder(58, 68, 10, 0.3, HOGT);
  laggTillHinder(63, 58, 0.3, 20, HOGT);
  laggTillHinder(53, 52, 0.3, 8, HOGT);
  laggTillHinder(53, 64, 0.3, 8, HOGT);
  lada(10, 0.9, 0.08, 0xffffff, 58, 0.45, 58);
  // Parkbänken
  mobel(3, 0.5, 0.8, 0x8b5a2b, 5, 42, true);
})();

// Skolgården (tom på lördagar)
(function byggSkolgarden() {
  platta(28, 22, 0x6e7378, -45, 45, 0.025);
  for (let x = -59; x <= -31; x += 1) lada(0.08, 1.4, 0.08, 0x9aa0a6, x, 0.7, 56);
  laggTillHinder(-45, 56, 28, 0.3, HOGT);
  mobel(0.2, 3, 0.2, 0xffffff, -45, 54);
  lada(1.2, 0.8, 0.1, 0xffffff, -45, 3, 53.9);
  skylt(t("Skolgården", "School Yard"), -45, 2.2, 34, Math.PI, 3.4);
})();

// Kolonilotterna längst norrut
const KANELS_GOMSTALLE = { x: -66, z: -93.5 };
(function byggKolonilotterna() {
  const r = slump(11);
  for (let x = -92; x <= -60; x += 8) {
    for (let z = -100; z <= -92; z += 6) {
      if (x === -68 && z === -100) continue;   // där står växthuset
      mobel(5, 0.25, 4, 0x6b4a2b, x, z, true);
      for (let i = 0; i < 5; i++) lada(0.4, 0.4 + r() * 0.4, 0.4, 0x3fa34d, x - 2 + i, 0.5, z + (r() - 0.5) * 2);
    }
  }
  mobel(3, 2.6, 3, 0xd8735a, -88, -88);
  mobel(4, 2.6, 4, genomskinligt(0xe8fff0, 0.45), -66, -97);
  skylt(t("Kolonilotterna", "Allotments"), -78, 2.4, -86, 0, 4);
  mobel(0.15, 2.4, 0.15, 0x666666, -78, -86.1);
})();

// Här ska det inte stå några träd (figurer, saker att hitta, skräp ...)
const FRIA_PLATSER = [[10, 62], [35, 66], [16, 56], [20, 38], [40, 40], [30, 61], [8, 50], [12, 32], [5, 43], [45, 28], [-23, 9]];

// Träden: alla stammar ritas på en gång, och alla kronor på en gång
(function byggTrad() {
  const r = slump(7);
  const platser = [];
  const ledigt = (x, z) => {
    if (z > -9 && z < 9) return false;                                   // gatan och trottoarerna
    if (Math.abs(x - SKOGSVAG.x) < 4.5 && z < -5) return false;           // skogsvägen
    if (Math.abs(x - 25) < 3 && z > 8) return false;                      // gången i parken
    if (Math.hypot(x - DAMM.x, z - DAMM.z) < DAMM.radie + 2) return false;
    if (x > -61 && x < -29 && z > 32 && z < 58) return false;             // skolgården
    if (x > -94 && x < -56 && z < -84) return false;                      // kolonilotterna
    if (x > -30 && x < 30 && z > 7 && z < 24) return false;               // radhusen
    if (x > 50 && x < 66 && z > 45 && z < 71) return false;               // padelbanan
    if (FRIA_PLATSER.some(([fx, fz]) => Math.hypot(x - fx, z - fz) < 3.2)) return false;
    if (platser.some((q) => Math.hypot(q[0] - x, q[1] - z) < 2.8)) return false;   // inte träd i träd
    return !hinder.some((h) => overlappar(x, z, h, 2.2));
  };
  const lagg = (x, z) => { if (ledigt(x, z)) platser.push([x, z, 0.8 + r() * 0.7, r() * Math.PI]); };
  // Tät skog längs skogsvägen
  for (let z = -12; z > -84; z -= 2.6) {
    lagg(SKOGSVAG.x - 6 - r() * 8, z + r() * 2);
    lagg(SKOGSVAG.x + 6 + r() * 8, z + r() * 2);
  }
  for (let forsok = 0; platser.length < 260 && forsok < 6000; forsok++) {
    lagg(GRANSER.xMin + 2 + r() * (GRANSER.xMax - GRANSER.xMin - 4), GRANSER.zMin + 2 + r() * (GRANSER.zMax - GRANSER.zMin - 4));
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

// Ett par träd som behövs på bestämda platser (drake och ekorre)
function ettTrad(x, z) {
  lada(0.5, 2.4, 0.5, 0x7a4a24, x, 1.2, z);
  const krona = new THREE.Mesh(new THREE.IcosahedronGeometry(1.8, 0), material(0x2f8a3a));
  krona.position.set(x, 3.4, z);
  krona.castShadow = true;
  scen.add(krona);
  laggTillHinder(x, z, 0.6, 0.6, HOGT);
}
ettTrad(10, 62);
ettTrad(35, 66);
const drake = new THREE.Mesh(new THREE.OctahedronGeometry(0.6, 0), material(0xff5aa0));
drake.scale.z = 0.2;
drake.position.set(10.8, 4.6, 62.6);
scen.add(drake);

// ---------------------------------------------------------------------
//  Hemmet inuti (låga väggar, som ett dockskåp)
// ---------------------------------------------------------------------

const VAGGHOJD = 1.3;
function vagg(x1, z1, x2, z2) {
  const b = Math.max(0.2, Math.abs(x2 - x1)), d = Math.max(0.2, Math.abs(z2 - z1));
  mobel(b, VAGGHOJD, d, 0xf7efe0, ix((x1 + x2) / 2), iz((z1 + z2) / 2));
}
const inneMobel = (b, h, d, farg, x, z, kanStaPa) => mobel(b, h, d, farg, ix(x), iz(z), kanStaPa);

(function byggHemmet() {
  platta(20, 14, 0xc89a62, ix(0), iz(0), 0.02);   // golvet
  platta(10, 7, 0xe8e8e8, ix(-5), iz(-3.5), 0.03); // köksgolvet
  platta(6, 7, 0xd0d8e0, ix(-7), iz(3.5), 0.03);   // tvättstugan
  platta(5, 3, 0x6a9a6a, ix(5), iz(-3.5), 0.03);   // mattan i vardagsrummet
  // Ytterväggarna (dörren i söder, x 4,2–5,8)
  vagg(-10, -7, 10, -7);
  vagg(-10, 7, 4.2, 7);
  vagg(5.8, 7, 10, 7);
  vagg(-10, -7, -10, 7);
  vagg(10, -7, 10, 7);
  // Innerväggarna
  vagg(0, -7, 0, -2.4);       // kök | vardagsrum
  vagg(-10, 0, -4, 0);        // kök | tvättstuga
  vagg(-4, 0, -4, 2.4);       // tvättstuga | gång
  vagg(-4, 4, -4, 7);
  vagg(1.6, 1, 10, 1);        // vardagsrum | hall
  lada(1.6, 2.2, 0.15, 0x2f6fd0, ix(5), 1.1, iz(7.15));   // ytterdörren
  // Köket
  inneMobel(1.2, 2.2, 1.2, 0xffffff, -9.2, -6.2);   // kylskåpet
  inneMobel(1.2, 1.4, 1.2, 0xe8f4ff, -7.8, -6.2);   // frysen
  inneMobel(3, 1, 1.2, 0xbfbfbf, -4.5, -6.4);       // diskbänken
  lada(0.12, 0.5, 0.12, 0xd0d0d0, ix(-4.5), 1.25, iz(-6.6));   // kranen
  inneMobel(1, 2, 2, 0xd8b88a, -9.4, -3);            // skafferiet
  inneMobel(2.4, 0.8, 1.6, 0xb07a44, -5, -2.5);      // köksbordet
  lada(0.5, 0.08, 0.5, 0xd0d0d0, ix(-9.2), 1.4, iz(-5.58)).rotation.x = Math.PI / 2;   // lappen
  // Vardagsrummet
  inneMobel(4, 0.6, 1.2, 0x5a7ab0, 5, -6.2, true);   // soffan (man kan hoppa upp på den)
  lada(4, 0.8, 0.3, 0x4a6aa0, ix(5), 0.9, iz(-6.7));
  inneMobel(1.6, 0.45, 0.8, 0x8b5a2b, 5, -3.6, true);   // soffbordet
  inneMobel(0.6, 2.2, 1.6, 0x8b5a2b, 9.5, -3.5);     // bokhyllan
  // Hallen och tvättstugan
  inneMobel(1.2, 2, 0.6, 0x8b5a2b, 0.8, 6.5);        // garderoben
  inneMobel(1, 1, 1, 0xf5f5f5, -9.3, 6.3);            // tvättmaskinen
  lada(0.15, 0.15, 1, 0x888888, ix(-9.75), 0.9, iz(3.5));  // vattenröret
})();

// Huvudkranen: ett rött hjul på röret i tvättstugan
const huvudkranHjul = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.06, 6, 12), material(0xd0302a));
huvudkranHjul.position.set(ix(-9.55), 0.9, iz(3.5));
huvudkranHjul.rotation.y = Math.PI / 2;
scen.add(huvudkranHjul);

// Kanels tassar i leran utanför huset (syns i kapitel 3)
const TASSAR = [];
for (let i = 0; i < 12; i++) {
  TASSAR.push(cirkel(0.13, 0x5a3a1a, 3.5 - i * 1.1, 7.9 - i * 0.08 + (i % 2) * 0.3, 0.05));
}

// Kanels matskål
const skal = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.22, 0.15, 10), material(0xe0413a));
skal.position.set(ix(-1), 0.08, iz(-1));
scen.add(skal);
const skalMat = lada(0.4, 0.06, 0.4, 0x8b5a2b, ix(-1), 0.16, iz(-1));
skalMat.visible = false;

// Vattenkannan
const kanna = new THREE.Group();
lada(0.4, 0.45, 0.3, 0x3fa34d, 0, 0.23, 0, kanna);
lada(0.08, 0.08, 0.4, 0x3fa34d, 0, 0.35, 0.3, kanna).rotation.x = -0.6;
kanna.position.set(ix(-6.5), 0, iz(1.5));
scen.add(kanna);

// Blommorna
const BLOMMOR = [[9.2, -6.3], [9.2, -1.4], [1.2, -6.3]].map(([x, z]) => {
  lada(0.5, 0.5, 0.5, 0xb5651d, ix(x), 0.25, iz(z));
  const blad = new THREE.Mesh(new THREE.IcosahedronGeometry(0.35, 0), material(0x8a9a4a));
  blad.position.set(ix(x), 0.75, iz(z));
  scen.add(blad);
  laggTillHinder(ix(x), iz(z), 0.5, 0.5, HOGT);
  return { x: ix(x), z: iz(z), blad: blad, vattnad: false };
});

// Vattnet som sprutar i kapitel 2
const vattenMaterial = genomskinligt(0x4aa8ff, 0.6);
const vattenGolv = platta(10, 7, vattenMaterial, ix(-5), iz(-3.5), 0.05);
const droppar = [];
for (let i = 0; i < 24; i++) {
  const d = lada(0.1, 0.1, 0.1, vattenMaterial, 0, 0, 0);
  d.castShadow = false;
  droppar.push({ mesh: d, tid: i / 24 });
}
const POLAR = [[-6.6, -4.6], [-2.2, -3.6], [-2, 2.5]].map(([x, z]) => {
  return { x: ix(x), z: iz(z), mesh: cirkel(0.9, vattenMaterial, ix(x), iz(z), 0.06), torkad: false };
});

// Leksakerna som kan segla iväg i kapitel 2
const LEKSAKER = [[-8, -4.4], [-6.6, -0.9], [-3, -4.6], [-1.4, -5.6], [-8.5, -1.2]].map(([x, z], nr) => {
  const g = new THREE.Group();
  const farger = [0xff5aa0, 0xffd23f, 0x3fa34d, 0x2f6fd0, 0xff7a1a];
  lada(0.4, 0.3, 0.4, farger[nr], 0, 0.2, 0, g);
  const segel = new THREE.Mesh(new THREE.ConeGeometry(0.25, 0.6, 3), material(0xffffff));
  segel.position.y = 0.65;
  segel.visible = false;
  g.add(segel);
  g.position.set(ix(x), 0, iz(z));
  scen.add(g);
  return { grupp: g, segel: segel, start: { x: ix(x), z: iz(z) }, seglar: 0, seglat: false };
});

// ---------------------------------------------------------------------
//  Figurerna
// ---------------------------------------------------------------------

// En arm eller ett ben som svänger runt axeln/höften
function led(b, h, farg, x, y, foralder) {
  const fast = new THREE.Group();
  fast.position.set(x, y, 0);
  lada(b, h, b, farg, 0, -h / 2, 0, fast);
  foralder.add(fast);
  return fast;
}

// En gubbe av lådor. Framsidan (ögonen) är åt +z. storlek 1 = vuxen.
function byggGubbe(f, storlek) {
  const grupp = new THREE.Group();
  lada(0.8, 0.9, 0.5, f.trija, 0, 1.35, 0, grupp);
  const huvud = new THREE.Group();
  huvud.position.y = 2.15;
  lada(0.6, 0.6, 0.6, f.hud || 0xf2c49b, 0, 0, 0, huvud);
  lada(0.12, 0.12, 0.05, 0x000000, -0.14, 0.05, 0.31, huvud);
  lada(0.12, 0.12, 0.05, 0x000000, 0.14, 0.05, 0.31, huvud);
  if (f.har !== undefined) {
    lada(0.66, 0.16, 0.66, f.har, 0, 0.35, 0, huvud);
    lada(0.66, f.langtHar ? 0.8 : 0.35, 0.14, f.har, 0, f.langtHar ? -0.15 : 0.1, -0.3, huvud);
  }
  grupp.add(huvud);
  const g = {
    grupp: grupp,
    huvud: huvud,
    vansterArm: led(0.22, 0.8, f.armar || f.trija, -0.52, 1.75, grupp),
    hogerArm: led(0.22, 0.8, f.armar || f.trija, 0.52, 1.75, grupp),
    vansterBen: led(0.28, 0.9, f.byxor, -0.2, 0.9, grupp),
    hogerBen: led(0.28, 0.9, f.byxor, 0.2, 0.9, grupp),
  };
  grupp.scale.setScalar(storlek || 1);
  scen.add(grupp);
  return g;
}

function svingaArmarOchBen(g, sving) {
  g.vansterArm.rotation.x = sving;
  g.hogerArm.rotation.x = -sving;
  g.vansterBen.rotation.x = -sving;
  g.hogerBen.rotation.x = sving;
}

// Fyrfotadjur: katt, tax, pudel och ekorre
function byggDjur(f) {
  const grupp = new THREE.Group();
  lada(f.bredd, f.hojd, f.langd, f.farg, 0, f.benLangd + f.hojd / 2, 0, grupp);
  lada(f.huvud, f.huvud, f.huvud, f.farg, 0, f.benLangd + f.hojd, f.langd / 2 + f.huvud * 0.3, grupp);
  lada(0.07, 0.07, 0.03, 0x000000, -f.huvud * 0.25, f.benLangd + f.hojd + 0.05, f.langd / 2 + f.huvud * 0.81, grupp);
  lada(0.07, 0.07, 0.03, 0x000000, f.huvud * 0.25, f.benLangd + f.hojd + 0.05, f.langd / 2 + f.huvud * 0.81, grupp);
  [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([sx, sz]) => {
    lada(0.1, f.benLangd, 0.1, f.farg, sx * f.bredd * 0.35, f.benLangd / 2, sz * f.langd * 0.38, grupp);
  });
  if (f.oron) {
    [-1, 1].forEach((sx) => {
      const ora = new THREE.Mesh(new THREE.ConeGeometry(0.07, 0.16, 4), material(f.farg));
      ora.position.set(sx * f.huvud * 0.3, f.benLangd + f.hojd + f.huvud * 0.55, f.langd / 2 + f.huvud * 0.3);
      grupp.add(ora);
    });
  }
  const svans = lada(0.08, 0.08, f.svans, f.svansFarg || f.farg, 0, f.benLangd + f.hojd, -f.langd / 2 - f.svans / 2 + 0.05, grupp);
  svans.rotation.x = f.svansVinkel || 0.6;
  if (f.rosett) lada(0.25, 0.12, 0.08, f.rosett, 0, f.benLangd + f.hojd + f.huvud * 0.55, f.langd / 2 + f.huvud * 0.3, grupp);
  scen.add(grupp);
  return { grupp: grupp, svans: svans };
}

const kanel = byggDjur({ farg: 0xe08a3a, bredd: 0.32, hojd: 0.28, langd: 0.6, huvud: 0.3, benLangd: 0.2, svans: 0.5, oron: true, svansVinkel: 1.1 });
const korven = byggDjur({ farg: 0x8b4a1f, bredd: 0.3, hojd: 0.28, langd: 0.9, huvud: 0.3, benLangd: 0.12, svans: 0.3 });
const coco = byggDjur({ farg: 0xffffff, bredd: 0.35, hojd: 0.35, langd: 0.55, huvud: 0.32, benLangd: 0.35, svans: 0.2, rosett: 0xff5aa0 });
const ekorre = byggDjur({ farg: 0xa0522d, bredd: 0.18, hojd: 0.18, langd: 0.3, huvud: 0.18, benLangd: 0.1, svans: 0.45, oron: true, svansVinkel: 1.4 });
ekorre.grupp.position.set(36.3, 0, 66.5);

// Måsarna som kommer till kattfällan
const masar = [0, 1, 2].map(() => {
  const g = new THREE.Group();
  lada(0.25, 0.2, 0.5, 0xffffff, 0, 0, 0, g);
  const vingar = lada(1.2, 0.05, 0.3, 0xdddddd, 0, 0.05, 0, g);
  g.visible = false;
  scen.add(g);
  return { grupp: g, vingar: vingar };
});
const fiskfalla = lada(0.8, 0.3, 0.6, 0xc8964f, HEM.x, 0.15, 8.6);
fiskfalla.visible = false;

// Ankorna i dammen
const ankor = [0, 1, 2].map((nr) => {
  const a = lada(0.4, 0.3, 0.5, 0xffd23f, DAMM.x, 0.18, DAMM.z);
  return { mesh: a, fas: nr * 2.1 };
});

// Bilarna: en på huvudgatan och en på skogsvägen
function byggBil(farg) {
  const g = new THREE.Group();
  lada(1.8, 0.8, 3.8, farg, 0, 0.7, 0, g);
  lada(1.6, 0.7, 2, 0xcfe8ff, 0, 1.4, -0.2, g);
  [[-0.9, -1.2], [0.9, -1.2], [-0.9, 1.2], [0.9, 1.2]].forEach(([x, z]) => {
    const hjul = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.25, 10), material(0x222222));
    hjul.rotation.z = Math.PI / 2;
    hjul.position.set(x, 0.35, z);
    g.add(hjul);
  });
  scen.add(g);
  return g;
}
// En bil kör fram och tillbaka längs en väg. Den kör alltid på höger sida.
const BILAR = [
  { grupp: byggBil(0x2f6fd0), axel: "x", mitt: 0, fran: -95, till: 95, pos: -40, riktning: 1, fart: 9, vantar: 0, tutat: 0 },
  { grupp: byggBil(0xe0413a), axel: "z", mitt: SKOGSVAG.x, fran: -86, till: -8, pos: -50, riktning: 1, fart: 7, vantar: 0, tutat: 0, skogsvag: true },
];

// Glassbilen står parkerad bredvid radhusen
const glassbil = byggBil(0xffffff);
glassbil.position.set(-28, 0, 10);
glassbil.rotation.y = Math.PI / 2;
laggTillHinder(-28, 10, 4, 2, HOGT);
skylt(t("Glass 🍦", "Ice cream 🍦"), -28, 2.4, 9, Math.PI, 2.4);

// Pilen ovanför huvudet som visar vägen
const pil = new THREE.Group();
(function byggPil() {
  const spets = new THREE.Mesh(new THREE.ConeGeometry(0.3, 0.8, 4), material(0xffd23f, 0x553300));
  spets.rotation.x = Math.PI / 2;
  pil.add(spets);
})();
scen.add(pil);

// ---------------------------------------------------------------------
//  Barnen
// ---------------------------------------------------------------------

const FORMAGOR = {
  krypa: t("kan krypa in där", "can crawl in there"),
  klattra: t("kan klättra upp dit", "can climb up there"),
  bara: t("kan bära det", "can carry that"),
  lasa: t("kan läsa och låsa upp det", "can read and unlock that"),
};

const BARN = {
  lillebror: {
    namn: t("Lillebror", "Little Brother"), ikon: "👦", alder: 5, han: t("han", "he"),
    kan: t("Kryper genom små hål. Djuren litar på honom.", "Crawls through small holes. Animals trust him."),
    formaga: "krypa", storlek: 0.72, fart: 1, hopp: 1,
    farger: { trija: 0x3fa34d, byxor: 0x2f4f9a, har: 0xe8c060 },
    rostlage: 1.5, tempo: 1.05, rostNummer: 0,
    repliker: [t("Katten sa att hon vill ha glass.", "The cat said she wants ice cream."), t("Varför?", "Why?"),
      t("Jag är inte trött. Jag blinkar bara långsamt.", "I'm not tired. I'm just blinking slowly.")],
  },
  lillasyster: {
    namn: t("Lillasyster", "Little Sister"), ikon: "👧", alder: 6, han: t("hon", "she"),
    kan: t("Springer fortast och klättrar upp överallt.", "Runs the fastest and climbs everywhere."),
    formaga: "klattra", storlek: 0.78, fart: 1.2, hopp: 1.25,
    farger: { trija: 0xf06aa0, byxor: 0x6a3a8a, har: 0x7a4a24, langtHar: true },
    rostlage: 1.45, tempo: 1.15, rostNummer: 1,
    repliker: [t("Jag har en plan!", "I have a plan!"), t("Plan B!", "Plan B!"),
      t("Det där räknas inte, jag var inte klar.", "That doesn't count, I wasn't ready.")],
  },
  storebror: {
    namn: t("Storebror", "Big Brother"), ikon: "🧒", alder: 11, han: t("han", "he"),
    kan: t("Bär tunga saker och bygger av det han hittar.", "Carries heavy things and builds stuff."),
    formaga: "bara", storlek: 0.92, fart: 1, hopp: 1,
    farger: { trija: 0x2f6fd0, byxor: 0x333333, har: 0x3a2a1a },
    rostlage: 1.1, tempo: 1, rostNummer: 2,
    repliker: [t("Ge mig tre minuter och silvertejp.", "Give me three minutes and some duct tape."),
      t("Det är inte trasigt, det är en prototyp.", "It's not broken, it's a prototype.")],
  },
  storasyster: {
    namn: t("Storasyster", "Big Sister"), ikon: "👩", alder: 12, han: t("hon", "she"),
    kan: t("Har telefonen och nycklarna. Läser lappar och låser upp.", "Has the phone and the keys. Reads notes and unlocks doors."),
    formaga: "lasa", storlek: 1, fart: 1, hopp: 1,
    farger: { trija: 0x8a4fc9, byxor: 0x2f4f9a, har: 0x5a3a1a, langtHar: true },
    rostlage: 1.25, tempo: 1.05, rostNummer: 3,
    repliker: [t("Jag har ansvaret.", "I'm in charge."), t("Det står faktiskt på lappen.", "It actually says so on the note."),
      t("Säg inget till mamma.", "Don't tell Mum.")],
  },
};
Object.keys(BARN).forEach((id) => { BARN[id].id = id; });

// Laget: de två barnen man har valt. lag[aktiv] är det man styr.
let lag = [];
let aktiv = 0;
let tvaSpelare = false;   // Två spelare: var sitt barn, på samma skärm
// Barnen som spelarna styr: ett barn med en spelare, båda med två
function styrda() { return tvaSpelare ? lag : [aktivtBarn()]; }
// Står något av barnen nära platsen?
function narNagon(q, radie) {
  return styrda().some((b) => Math.hypot(b.gubbe.grupp.position.x - q.x, b.gubbe.grupp.position.z - q.z) <= radie);
}
// "Byt till Lillebror" med en spelare, "Låt Lillebror göra det" med två
function bytTill(annan) {
  return tvaSpelare ? t("Låt ", "Let ") + annan.data.namn + t(" göra det! ", " do it! ") : t("Byt till ", "Switch to ") + annan.data.namn + " (🔄). ";
}
function aktivtBarn() { return lag[aktiv]; }
function andraBarnet() { return lag[1 - aktiv]; }
function aldst() { return lag[0].data.alder > lag[1].data.alder ? lag[0] : lag[1]; }

function skapaLag(idn) {
  lag.forEach((b) => scen.remove(b.gubbe.grupp));
  lag = idn.map((id) => {
    const data = BARN[id];
    return { id: id, data: data, gubbe: byggGubbe(data.farger, data.storlek), fartY: 0, paMarken: true, vinkel: 0, steg: 0, hoppMinne: 0, fast: 0 };
  });
  aktiv = 0;
  uppdateraBytKnapp();
}

// Den som pratar: barnen, de vuxna och berättaren
const BERATTARE = { namn: "📖", rostlage: 1, tempo: 1, rostNummer: 4 };
function talare(barn) { return { namn: barn.data.ikon + " " + barn.data.namn, rostlage: barn.data.rostlage, tempo: barn.data.tempo, rostNummer: barn.data.rostNummer }; }

// ---------------------------------------------------------------------
//  De vuxna, grannarna och djuren man kan prata med
// ---------------------------------------------------------------------

// plats: [x, z] i alla kapitel, eller { 1: [x, z], 2: ... } per kapitel (null = inte där)
const FIGURER = {
  pappa: {
    namn: t("👨 Pappa", "👨 Dad"), farger: { trija: 0x4a7a4a, byxor: 0x333355, har: 0x6a4a2a }, rostlage: 0.85, tempo: 1, rostNummer: 5,
    plats: { 1: [ix(-5), iz(-0.8)], 2: [86, -7.4], 3: [86, -7.4] }, hemlig: true,
    repliker: [t("Jag är nummer 47 i kön. Nu 46! Det går framåt.", "I'm number 47 in the queue. Now 46! We're getting there."),
      t("Vem har flyttat kvittot från Biltema?", "Who moved the receipt from the hardware store?"),
      t("Fem minuter, max.", "Five minutes, tops."), t("Det är inte kallt, det är friskt.", "It's not cold, it's fresh.")],
  },
  mamma: {
    namn: t("👩 Mamma", "👩 Mum"), farger: { trija: 0xe06a8a, byxor: 0x333333, har: 0x3a2a1a, langtHar: true }, rostlage: 1.1, tempo: 1.05, rostNummer: 6,
    plats: [42, -7.4], hemlig: true,
    repliker: [t("Jag har inte satt mig en enda gång i dag.", "I haven't sat down once today."),
      t("Någon måste ju tänka på allt.", "Someone has to think of everything."),
      t("Jag behöver bara ladda batterierna lite.", "I just need to recharge my batteries a bit.")],
  },
  david: {
    namn: "🧘 David", farger: { trija: 0xe8dcc0, byxor: 0x7a6a5a, har: 0x9a6a3a }, rostlage: 0.95, tempo: 0.85, rostNummer: 7,
    plats: [70, -7.4],
    repliker: [t("Det här är ett rum med väldigt bra energier.", "This is a room with really good energy."),
      t("Havrelatte, extra havre.", "Oat latte, extra oat."),
      t("Det där var ett fint ögonblick. Kan vi ta det igen till podden?", "That was a beautiful moment. Can we do it again for the podcast?"),
      t("Vi börjar med tre djupa andetag. Fyra om man är kreativ.", "Let's start with three deep breaths. Four if you're creative.")],
  },
  mormor: {
    namn: t("👵 Mormor", "👵 Grandma"), farger: { trija: 0xffffff, byxor: 0x2f6fd0, har: 0xdddddd }, rostlage: 1.15, tempo: 1.1, rostNummer: 8,
    plats: [58, 52],
    repliker: [t("Har ni testat padel?", "Have you tried padel?"), t("Glasväggen är min bästa vän.", "The glass wall is my best friend."),
      t("Jag är 74 år, inte trött.", "I'm 74, not tired.")],
  },
  padelgrannen: {
    namn: t("🎾 Padelgrannen", "🎾 The padel neighbour"), farger: { trija: 0xffd23f, byxor: 0xffffff, har: 0x222222 }, rostlage: 0.9, tempo: 1.15, rostNummer: 9,
    plats: [58, 64],
    repliker: [t("Har ni testat padel?", "Have you tried padel?"), t("Er mormor är omöjlig att slå.", "Your grandma is impossible to beat.")],
  },
  bengt: {
    namn: t("📁 Morbror Bengt", "📁 Uncle Bengt"), farger: { trija: 0x556b8a, byxor: 0x333333, har: 0x999999 }, rostlage: 0.8, tempo: 0.95, rostNummer: 10,
    plats: [-31, -11.5], granne: true,
    repliker: [t("Jag vill bara få till protokollet att ingen har bestämt vem som äger den gröna cykeln.", "I just want it in the minutes that nobody has decided who owns the green bike."),
      t("Den har stått där sedan 2014.", "It's been there since 2014."),
      t("Vi tar ett bensträckare och återkommer till punkt 14.", "Let's take a break and come back to item 14.")],
  },
  gunnel: {
    namn: t("☂️ Tant Gunnel", "☂️ Auntie Gunnel"), farger: { trija: 0xb06a9a, byxor: 0x555555, har: 0xcccccc }, rostlage: 1.2, tempo: 1, rostNummer: 11,
    plats: [-28, -11.5], granne: true,
    repliker: [t("Ska ni inte ha mössa? Det kan bli snö.", "Shouldn't you wear a hat? It might snow."),
      t("Man ska alltid ha en extra strumpa i fickan.", "You should always keep a spare sock in your pocket.")],
  },
  sture: {
    namn: "🕡 Sture", farger: { trija: 0x8a8a6a, byxor: 0x444444, har: 0xeeeeee }, rostlage: 0.75, tempo: 0.85, rostNummer: 12,
    plats: [-34, -11.5], granne: true,
    repliker: [t("Jag vill hem. Jag lägger mig kvart i sju.", "I want to go home. I go to bed at quarter to seven."),
      t("Är det fortfarande punkt 14?", "Is it still item 14?")],
  },
  majken: {
    namn: t("🍬 Tant Majken", "🍬 Auntie Majken"), farger: { trija: 0xd86a4a, byxor: 0x6a4a6a, har: 0xdddddd }, rostlage: 1.25, tempo: 0.95, rostNummer: 13,
    plats: [-23, 9], granne: true,
    repliker: [t("Vill ni ha en karamell? Jag har alltid något i fickan.", "Would you like a sweet? I always have something in my pocket."),
      t("Vad duktiga ni är som är ute och går.", "How good of you to be out for a walk.")],
  },
  influencern: {
    namn: t("📱 Influencern", "📱 The influencer"), farger: { trija: 0xff9ad0, byxor: 0xffffff, har: 0xffe08a, langtHar: true }, rostlage: 1.3, tempo: 1.2, rostNummer: 14,
    plats: [16, 56], granne: true,
    repliker: [t("Vänta, kan ni göra det där igen? Jag filmar!", "Wait, can you do that again? I'm filming!"),
      t("Coco, titta in i kameran!", "Coco, look at the camera!")],
  },
  alfahannen: {
    namn: t("🏋️ Alfahannen", "🏋️ The tough guy"), farger: { trija: 0xf2c49b, byxor: 0x222222, har: 0x222222 }, rostlage: 0.6, tempo: 0.95, rostNummer: 15,
    plats: [45, 28.6],
    repliker: [t("Jag fryser inte. Det här är uppvärmning.", "I'm not cold. This is my warm-up."), t("Isbad! Varje dag!", "Ice bath! Every day!")],
  },
  ordningsvakten: {
    namn: t("🦺 Ordningsvakten", "🦺 The security guard"), farger: { trija: 0xffd23f, byxor: 0x222244, har: 0x222222 }, rostlage: 0.8, tempo: 0.9, rostNummer: 16,
    plats: [60, 5.5], granne: true,
    repliker: [t("Legitimation, tack.", "ID, please."), t("Även katter ska ha legitimation.", "Even cats need ID.")],
  },
  bananpappan: {
    namn: t("🍌 Bananpappan", "🍌 Banana Dad"), farger: { trija: 0xffe040, byxor: 0xffe040, armar: 0xffe040, har: 0xffe040 }, rostlage: 1, tempo: 1.1, rostNummer: 17,
    plats: [-5, -5.5],
    repliker: [t("Jag är en banan! Varför? Därför!", "I'm a banana! Why? Because!")],
  },
  skamtpappan: {
    namn: t("😄 Skämtpappan", "😄 Joke Dad"), farger: { trija: 0x3a8a8a, byxor: 0x444444, har: 0x6a4a2a }, rostlage: 0.95, tempo: 1, rostNummer: 18,
    plats: [35, 5.5],
    repliker: [t("Vad sa den ena väggen till den andra? Vi ses i hörnet!", "What did one wall say to the other? Meet you at the corner!"),
      t("Varför har elefanter röda naglar? Så att de kan gömma sig i jordgubbslandet!", "Why do elephants paint their toenails red? To hide in strawberry fields!")],
  },
  brevbararen: {
    namn: t("📮 Brevbäraren", "📮 The postman"), farger: { trija: 0x2f4f9a, byxor: 0x2f4f9a, har: 0x222222 }, rostlage: 1, tempo: 1.3, rostNummer: 19,
    plats: [-10, 6.2], granne: true,
    repliker: [t("Taxen HATAR mig!", "That dachshund HATES me!"), t("Jag springer inte, jag är bara lite sen.", "I'm not running, I'm just a bit late.")],
  },
};

Object.keys(FIGURER).forEach((id) => {
  const f = FIGURER[id];
  f.id = id;
  f.gubbe = byggGubbe(f.farger, 1);
  f.nr = 0;
  f.vinkel = 0;
});
// Saker de vuxna har
lada(0.15, 0.25, 0.15, 0xf5f5f5, 0.3, 1.5, 0.35, FIGURER.david.gubbe.grupp);   // havrelatten
lada(0.25, 0.5, 0.08, 0x111111, 0.4, 1.6, 0.35, FIGURER.pappa.gubbe.grupp);    // telefonen
lada(0.1, 0.5, 0.06, 0x111111, 0.4, 1.9, 0.3, FIGURER.influencern.gubbe.grupp); // telefonen
lada(0.5, 0.06, 0.3, 0x222222, -0.6, 1.4, 0.3, FIGURER.mormor.gubbe.grupp);     // padelracket
lada(0.25, 0.35, 0.2, 0x8b5a2b, -0.55, 1.1, 0, FIGURER.brevbararen.gubbe.grupp); // väskan
lada(0.5, 0.6, 0.12, 0x2f6fd0, -0.35, 1.4, 0.3, FIGURER.bengt.gubbe.grupp);     // pärmen

// Djuren man kan prata med (eller klappa)
const DJUR = {
  ekorren: { namn: t("🐿️ Ekorren", "🐿️ The squirrel"), grupp: ekorre.grupp, rostlage: 1.8, tempo: 1.3, rostNummer: 20 },
  coco: { namn: "🐩 Coco", grupp: coco.grupp, rostlage: 1.6, tempo: 1.2, rostNummer: 21 },
};

function figurPlats(f) {
  const p = Array.isArray(f.plats) ? f.plats : f.plats[S.kapitel];
  return p || null;
}

// ---------------------------------------------------------------------
//  Läget i spelet (det som sparas mellan kapitlen)
// ---------------------------------------------------------------------

// S = det som följer med hela dagen. F = det som gäller i kapitlet just nu.
let S = { kapitel: 1, barn: [], hjartan: 0, kaos: 0, hittat: [], utmarkelser: [] };
let F = {};
let kapitelStart = null;   // Kopia av S när kapitlet började (för "Börja om kapitlet")
const SPARNYCKEL = "aventyr-spar";

function spara() {
  try { localStorage.setItem(SPARNYCKEL, JSON.stringify(S)); } catch (e) { /* går inte att spara – spelet fungerar ändå */ }
}
function lasSparat() {
  try { return JSON.parse(localStorage.getItem(SPARNYCKEL)); } catch (e) { return null; }
}
function glomSparat() {
  try { localStorage.removeItem(SPARNYCKEL); } catch (e) { /* inget att göra */ }
}

const UTMARKELSER = {
  glass: t("🍦 Glass före middag", "🍦 Ice cream before dinner"),
  lappen: t("📝 Lappens hjältar", "📝 Heroes of the note"),
  kran: t("🔧 Kranens herre", "🔧 Master of the tap"),
  kaos: t("⛵ Kapten Kaos", "⛵ Captain Chaos"),
  viral: t("📱 Viral i fel sekund", "📱 Viral at the wrong moment"),
  katt: t("🐱 Kattviskaren", "🐱 The cat whisperer"),
  trafik: t("🦺 Trafikproffsen", "🦺 Traffic pros"),
};

// ---------------------------------------------------------------------
//  Ljud
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
function pling(toner, typ, langd) {
  if (!ljud) return;
  toner.forEach((ton, nr) => {
    const osc = ljud.createOscillator(), volym = ljud.createGain();
    const start = ljud.currentTime + nr * 0.1;
    osc.type = typ || "triangle";
    osc.frequency.value = ton;
    volym.gain.setValueAtTime(0.2, start);
    volym.gain.exponentialRampToValueAtTime(0.001, start + (langd || 0.3));
    osc.connect(volym).connect(ljud.destination);
    osc.start(start);
    osc.stop(start + (langd || 0.3));
  });
}
const LJUD = {
  hjarta: () => pling([660, 880, 1100]),
  kaos: () => pling([300, 200, 400], "square", 0.2),
  sak: () => pling([880, 1320, 1760]),
  sms: () => pling([1200, 1500], "sine", 0.2),
  hopp: () => pling([330], "triangle", 0.15),
  tut: () => pling([220, 220], "sawtooth", 0.25),
  glassbil: () => pling([784, 659, 784, 880, 784, 659], "sine", 0.25),
};

// ---------------------------------------------------------------------
//  Repliker, pratbubbla och tal
// ---------------------------------------------------------------------

const harTal = "speechSynthesis" in window;
if (harTal) speechSynthesis.getVoices();   // Safari börjar ladda rösterna först när man frågar

const bubbla = document.getElementById("bubbla");
let ko = [];            // repliker som väntar: { vem, text, narKlar }
let replik = null;      // den som syns nu: { tid, max, narKlar }
let filmPagar = false;  // en scen spelas: då går det inte att göra andra saker

// Läser upp utan emojis (annars säger rösten "röd hjärta" osv.)
function utanEmoji(text) {
  return text.replace(/[☀-➿️‍]|[\uD83C-\uDBFF][\uDC00-\uDFFF]/g, "").trim();
}

function tala(vem, text) {
  if (!harTal) return;
  const roster = speechSynthesis.getVoices().filter((r) => r.lang.toLowerCase().indexOf(SPRAK) === 0);
  const yttrande = new SpeechSynthesisUtterance(utanEmoji(text));
  yttrande.lang = SPRAK === "sv" ? "sv-SE" : "en-GB";
  if (roster.length) yttrande.voice = roster[vem.rostNummer % roster.length];
  yttrande.pitch = vem.rostlage;
  yttrande.rate = vem.tempo;
  speechSynthesis.cancel();
  speechSynthesis.speak(yttrande);
}

function tystna() {
  ko = [];
  replik = null;
  if (harTal) speechSynthesis.cancel();
  bubbla.hidden = true;
}

// Någon säger något nu (det som sades förut avbryts, utom under en scen)
function sag(vem, text) {
  if (filmPagar) return koa(vem, text);
  tystna();
  koa(vem, text);
}
// Lägg en replik sist i kön
function koa(vem, text, narKlar) {
  ko.push({ vem: vem, text: text, narKlar: narKlar });
}
// Flera repliker efter varandra. Med film = true kan man inte göra något annat under tiden.
function sekvens(rader, narKlar, film) {
  if (!filmPagar) tystna();
  if (film) filmPagar = true;
  rader.forEach((r, nr) => {
    const sist = nr === rader.length - 1;
    koa(r[0], r[1], sist ? () => { if (film) filmPagar = false; if (narKlar) narKlar(); } : null);
  });
  if (!rader.length) {
    if (film) filmPagar = false;
    if (narKlar) narKlar();
  }
}

function uppdateraRepliker(dt) {
  if (replik) {
    replik.tid -= dt;
    replik.max -= dt;
    const talar = harTal && speechSynthesis.speaking;
    if ((replik.tid <= 0 && !talar) || replik.max <= 0) {
      const klar = replik.narKlar;
      replik = null;
      if (!ko.length) bubbla.hidden = true;
      if (klar) klar();
    }
  }
  if (!replik && ko.length) {
    const r = ko.shift();
    document.getElementById("vemPratar").textContent = r.vem.namn;
    document.getElementById("repliken").textContent = r.text;
    bubbla.hidden = false;
    tala(r.vem, r.text);
    replik = { tid: Math.max(2, r.text.length * 0.055), max: Math.max(5, r.text.length * 0.2), narKlar: r.narKlar };
  }
}

// Sms till storasysters telefon (läses upp med avsändarens röst)
const smsRuta = document.getElementById("sms");
let smsTid = 0;
function sms(fran, text) {
  LJUD.sms();
  document.getElementById("smsFran").textContent = "📱 " + t("Sms från ", "Text from ") + fran.namn.replace(/^\S+ /, "");
  document.getElementById("smsText").textContent = text;
  smsRuta.hidden = false;
  smsTid = 8;
  koa(fran, text);
}

// ---------------------------------------------------------------------
//  Poäng
// ---------------------------------------------------------------------

const poangRuta = document.getElementById("poang");
function visaPoang() {
  poangRuta.textContent = "❤️ " + S.hjartan + "   💥 " + S.kaos + "   ⭐ " + S.hittat.length;
}
function studsa() {
  poangRuta.style.transform = "scale(1.25)";
  setTimeout(() => { poangRuta.style.transform = ""; }, 200);
}
function hjarta(antal) {
  S.hjartan += antal || 1;
  LJUD.hjarta();
  visaPoang();
  studsa();
}
function kaos(antal) {
  S.kaos += antal || 1;
  LJUD.kaos();
  visaPoang();
  studsa();
}
function utmarkelse(id) {
  if (S.utmarkelser.indexOf(id) >= 0) return;
  S.utmarkelser.push(id);
  LJUD.sak();
  koa(BERATTARE, "🏅 " + t("Utmärkelse: ", "Award: ") + UTMARKELSER[id] + "!");
}
function totalPoang() {
  return S.hjartan * INSTALLNINGAR.poangHjarta + S.kaos * INSTALLNINGAR.poangKaos +
    S.hittat.length * INSTALLNINGAR.poangSak + S.utmarkelser.length * INSTALLNINGAR.poangUtmarkelse;
}

// Kylskåpsdörren: bilderna blinkar när något behövs hemma
function behov(namn, blinkar) {
  document.querySelector('#kylskap [data-behov="' + namn + '"]').className = blinkar ? "blinkar" : "";
}

// ---------------------------------------------------------------------
//  Saker man kan göra: det som står på knappen när man är nära
// ---------------------------------------------------------------------

// { plats: () => {x, z}, radie, etikett: () => text, aktiv: () => bool, gor: () => ... }
const saker = [];
function sak(def) {
  if (typeof def.plats !== "function") {
    const p = def.plats;
    def.plats = () => p;
  }
  saker.push(def);
  return def;
}

// Kollar om barnet man styr har rätt förmåga, och säger annars vem som har det
function provaFormaga(krav, narLyckas) {
  const barn = aktivtBarn();
  if (!krav || barn.data.formaga === krav) return narLyckas(barn);
  const annan = lag.find((b) => b.data.formaga === krav);
  if (annan) {
    sag(talare(barn), bytTill(annan) + annan.data.namn + " " + FORMAGOR[krav] + "!");
  } else {
    const vem = Object.keys(BARN).map((id) => BARN[id]).find((b) => b.formaga === krav);
    sag(talare(barn), t("Det här kan bara ", "Only ") + vem.namn + t(" göra, och " + vem.han + " är inte med i dag.", " can do this, and " + vem.han + " isn't here today."));
  }
  return false;
}

// Saker att hitta. Vissa går bara att hitta med rätt barn.
const HITTESAKER = [
  { id: "glasogon", x: ix(6.6), z: iz(-5.2), krav: null, namn: t("👓 Pappas glasögon", "👓 Dad's glasses"),
    text: t("Pappas glasögon låg i soffan! Han letar nog efter dem.", "Dad's glasses were in the sofa! He's probably looking for them.") },
  { id: "mus", x: ix(3.4), z: iz(-5.2), krav: "krypa", namn: t("🐭 Under soffan", "🐭 Under the sofa"),
    text: t("Kanels leksaksmus låg under soffan! Och tre russin.", "Kanel's toy mouse was under the sofa! And three raisins.") },
  { id: "kvitto", x: ix(8.6), z: iz(-3.5), y: 2.6, krav: "klattra", namn: t("🧾 Högst upp i bokhyllan", "🧾 Top of the bookcase"),
    text: t("Ett kvitto på 49 kronor! Det är det pappa letar efter!", "A receipt for 49 kronor! That's what Dad is looking for!") },
  { id: "godis", x: ix(0.8), z: iz(5.6), krav: "lasa", namn: t("🔒 Det låsta skåpet", "🔒 The locked cupboard"),
    text: t("Mormors hemliga godislåda! Vi tar bara en var.", "Grandma's secret sweet box! Just one each.") },
  { id: "walkman", x: ix(-6), z: iz(5.4), krav: "bara", namn: t("📦 Den tunga lådan", "📦 The heavy box"),
    text: t("Under lådan låg pappas gamla freestyle. Vad är det?", "Under the box was Dad's old Walkman. What's that?") },
  { id: "leif", x: ix(5), z: iz(-2.9), krav: null, fran: 2, namn: t("📱 Plattan på soffbordet", "📱 The tablet on the coffee table"),
    text: t("Leifs instruktionsfilm! \"Först stänger man huvudkranen.\" Den måste pappa se!", "Leif's how-to video! \"First, turn off the main water valve.\" Dad needs to see this!") },
  { id: "cykellapp", x: 0, z: -5.4, krav: "lasa", namn: t("📝 Lappen på lyktstolpen", "📝 The note on the lamp post"),
    text: t("\"Försvunnen: grön cykel. Sedan 2014. Hälsningar, Bengt.\"", "\"Missing: green bike. Since 2014. Regards, Bengt.\"") },
  { id: "drake", x: 10, z: 60.6, krav: "klattra", namn: t("🪁 Draken i trädet", "🪁 The kite in the tree"),
    text: t("En drake satt fast i trädet! Nu kan den flyga igen.", "A kite was stuck in the tree! Now it can fly again.") },
  { id: "tia", x: 12, z: 32, krav: "krypa", namn: t("🌭 Under korvkiosken", "🌭 Under the hot dog stand"),
    text: t("En tappad tia under korvkiosken!", "A lost coin under the hot dog stand!") },
  { id: "boll", x: 5, z: 43.2, krav: "bara", namn: t("🪑 Den tunga bänken", "🪑 The heavy bench"),
    text: t("Under bänken låg mormors padelboll!", "Grandma's padel ball was under the bench!") },
];
const glitter = new THREE.OctahedronGeometry(0.18, 0);
HITTESAKER.forEach((h) => {
  h.markor = new THREE.Mesh(glitter, material(0xffe040, 0x886600));
  h.markor.position.set(h.x, h.y || 1.6, h.z);
  scen.add(h.markor);
  sak({
    plats: { x: h.x, z: h.z }, radie: 1.5,
    etikett: () => "⭐ " + h.namn,
    aktiv: () => S.hittat.indexOf(h.id) < 0 && S.kapitel >= (h.fran || 1),
    gor: () => provaFormaga(h.krav, (barn) => {
      S.hittat.push(h.id);
      LJUD.sak();
      visaPoang();
      studsa();
      sag(talare(barn), h.text);
      if (h.id === "leif") F.harFilm = true;
      if (h.id === "drake") drake.visible = false;
    }),
  });
});

// Skräp i parken att plocka upp
const SKRAP = [[20, 38], [40, 40], [30, 61], [8, 50]].map(([x, z]) => {
  const burk = lada(0.15, 0.25, 0.15, 0xd0302a, x, 0.13, z);
  const s = { x: x, z: z, mesh: burk, plockat: false };
  sak({
    plats: { x: x, z: z }, radie: 1.6,
    etikett: () => t("🗑️ Plocka upp skräpet", "🗑️ Pick up the litter"),
    aktiv: () => !s.plockat,
    gor: () => {
      s.plockat = true;
      burk.visible = false;
      hjarta();
      sag(talare(aktivtBarn()), t("Skräp ska i soptunnan!", "Litter goes in the bin!"));
    },
  });
  return s;
});

// Dörrarna hem
sak({
  plats: { x: HEM.x, z: 10.3 }, radie: 2,
  etikett: () => t("🚪 Gå in", "🚪 Go inside"),
  aktiv: () => true,
  gor: () => teleportera(ix(5), iz(5.4), 0),
});
sak({
  plats: { x: ix(5), z: iz(6.3) }, radie: 1.6,
  etikett: () => t("🚪 Gå ut", "🚪 Go outside"),
  aktiv: () => true,
  gor: () => teleportera(HEM.x, 8.6, 0),
});

// Glassbilen
sak({
  plats: { x: -28, z: 7.8 }, radie: 2.4,
  etikett: () => t("🍦 Glassbilen", "🍦 The ice cream van"),
  aktiv: () => true,
  gor: () => {
    LJUD.glassbil();
    sag(BERATTARE, t("Glassbilen spelar sin melodi. Enligt familjeregeln betyder det att glassen är slut.",
      "The ice cream van plays its tune. According to the family rule, that means the ice cream has run out."));
  },
});

// Övergångsstället: stanna och titta åt båda hållen
let tittaTid = 0;
[OVERGANG.soder, OVERGANG.norr].forEach((z) => {
  sak({
    plats: { x: OVERGANG.x, z: z }, radie: 2.2,
    etikett: () => t("👀 Stanna och titta", "👀 Stop and look"),
    aktiv: () => tittaTid <= 0,
    gor: () => {
      tittaTid = 2.4;
      F.tittadeVid = speltid;
      sag(talare(aktivtBarn()), t("Vänster, höger, vänster igen. Nu kan vi gå!", "Left, right, left again. Now we can cross!"));
      if (!F.tittatHjarta) {
        F.tittatHjarta = true;
        hjarta();
      }
    },
  });
});

// Prata med de vuxna och grannarna
Object.keys(FIGURER).forEach((id) => {
  const f = FIGURER[id];
  sak({
    plats: () => f.gubbe.grupp.position, radie: 2.4,
    etikett: () => "💬 " + t("Prata med ", "Talk to ") + f.namn.replace(/^\S+ /, ""),
    aktiv: () => f.gubbe.grupp.visible,
    gor: () => prataMed(f),
  });
});

function prataMed(f) {
  // Kapitlen kan ha egna repliker (t.ex. ledtrådar)
  if (kapitel && kapitel.prata && kapitel.prata(f)) return;
  const text = f.repliker[f.nr % f.repliker.length];
  f.nr++;
  if (f.hemlig && !arInne(f.gubbe.grupp.position)) {
    // Mamma och pappa får inte se att barnen är ute!
    sekvens([
      [talare(aktivtBarn()), t("Psst! " + f.namn.replace(/^\S+ /, "") + " får inte se oss!", "Psst! " + f.namn.replace(/^\S+ /, "") + " mustn't see us!")],
      [f, text],
      [BERATTARE, t("Ingen märker något.", "Nobody notices a thing.")],
    ]);
    return;
  }
  sag(f, text);
  if (f.id === "mormor") koa(BERATTARE, t("Mormor blinkar.", "Grandma winks."));
  if (f.id === "influencern" && !F.viral) {
    F.viral = true;
    kaos();
    koa(BERATTARE, t("Oj! Det blev viralt.", "Oops! That went viral."));
    utmarkelse("viral");
  }
}

// Ekorren och Coco
sak({
  plats: () => ekorre.grupp.position, radie: 2.2,
  etikett: () => t("🐿️ Ekorren", "🐿️ The squirrel"),
  aktiv: () => true,
  gor: () => {
    if (kapitel && kapitel.prata && kapitel.prata(DJUR.ekorren)) return;
    sag(BERATTARE, t("Ekorren vet var allt är. Men den säger inget.", "The squirrel knows where everything is. But it isn't telling."));
  },
});
sak({
  plats: () => coco.grupp.position, radie: 1.8,
  etikett: () => t("🐩 Klappa Coco", "🐩 Pet Coco"),
  aktiv: () => coco.grupp.visible,
  gor: () => {
    if (!F.klappatCoco) { F.klappatCoco = true; hjarta(); }
    sag(DJUR.coco, t("Voff! (Coco har en rosett som matchar influencerns tröja.)", "Woof! (Coco's bow matches the influencer's top.)"));
  },
});

// ---------------------------------------------------------------------
//  Kapitlen
// ---------------------------------------------------------------------

let kapitel = null;
let kapitelTid = 0;
let smsPlan = [];   // { tid, fran, text }

// Gemensamma platser för målen
const PLATS = {
  lappen: { x: ix(-9.2), z: iz(-4.8) },
  skafferi: { x: ix(-8.4), z: iz(-3) },
  skal: { x: ix(-1), z: iz(-1) },
  kanna: { x: ix(-6.5), z: iz(1.5) },
  frysen: { x: ix(-7.8), z: iz(-5.2) },
  kran: { x: ix(-4.5), z: iz(-5.4) },
  huvudkran: { x: ix(-8.8), z: iz(3.5) },
  hall: { x: ix(5), z: iz(4) },
  dorrUte: { x: HEM.x, z: 9.6 },
  dorrInne: { x: ix(5), z: iz(6) },
  korven: { x: ix(8.5), z: iz(5.4) },
  fallan: { x: HEM.x, z: 8.4 },
  mjau: { x: -26, z: -25 },
  tassar: { x: 2, z: 7.6 },
  kanel: KANELS_GOMSTALLE,
};

// Vilken figur är närmast av några platser (för pilen)
function narmast(platser) {
  const p = aktivtBarn().gubbe.grupp.position;
  let bast = null, avstand = Infinity;
  platser.forEach((q) => {
    const d = Math.hypot(q.x - p.x, q.z - p.z);
    if (d < avstand) { avstand = d; bast = q; }
  });
  return bast;
}

// Ställer in världen för ett kapitel (vatten, katt, figurer ...)
function stallInVarlden() {
  const k = S.kapitel;
  Object.keys(FIGURER).forEach((id) => {
    const f = FIGURER[id], p = figurPlats(f);
    f.gubbe.grupp.visible = !!p;
    f.flyttad = null;
    if (p) f.gubbe.grupp.position.set(p[0], 0, p[1]);
  });
  // Vattnet sprutar bara i kapitel 2
  vattenGolv.visible = false;
  droppar.forEach((d) => { d.mesh.visible = false; });
  POLAR.forEach((p) => { p.mesh.visible = false; p.torkad = false; });
  LEKSAKER.forEach((l) => {
    l.grupp.position.set(l.start.x, 0, l.start.z);
    l.segel.visible = false;
    l.seglar = 0;
    l.seglat = false;
    l.grupp.visible = k === 2;
  });
  // Kanel är hemma i kapitel 1–2 och gömmer sig i kapitel 3
  kanel.grupp.visible = k < 3;
  kanel.grupp.position.set(ix(-1.6), 0, iz(-1.6));
  korven.grupp.visible = true;
  korven.grupp.position.set(PLATS.korven.x, 0, PLATS.korven.z);
  foljare.length = 0;
  skalMat.visible = k > 1;
  BLOMMOR.forEach((b) => {
    b.vattnad = k > 1;
    b.blad.scale.setScalar(b.vattnad ? 1.4 : 1);
    b.blad.material = material(b.vattnad ? 0x3fa34d : 0x8a9a4a);
  });
  kanna.visible = k === 1;
  fiskfalla.visible = false;
  TASSAR.forEach((tass) => { tass.visible = k === 3; });
  masar.forEach((m) => { m.grupp.visible = false; });
  coco.grupp.position.set(17.5, 0, 55.5);
  coco.grupp.visible = true;
  ["katt", "blommor", "kran", "hund"].forEach((b) => behov(b, false));
}

function startaKapitel(nr) {
  S.kapitel = nr;
  Musik.tempo(100);
  F = {};
  kapitelTid = 0;
  kapitelStart = JSON.parse(JSON.stringify(S));
  spara();
  stallInVarlden();
  kapitel = KAPITEL[nr - 1];
  kapitel.starta();
  visaPoang();
  visaKapitelkort(nr, kapitel.titel, () => { if (kapitel.efterKort) kapitel.efterKort(); });
}

function nastaKapitel() {
  if (S.kapitel >= KAPITEL.length) return slut();
  startaKapitel(S.kapitel + 1);
}

const KAPITEL = [
  // ------------------------------------------------- Kapitel 1: Lappen
  {
    titel: t("Lappen ☀️", "The Note ☀️"),
    starta() {
      placeraLaget(ix(-7.2), iz(-4.4), 0);
      behov("katt", true);
      behov("blommor", true);
      smsPlan = [
        { tid: 25, fran: FIGURER.mamma, text: t("Glöm inte blommorna!! ❤️🌱", "Don't forget the flowers!! ❤️🌱") },
        { tid: 70, fran: FIGURER.mormor, text: t("Har ni testat padel? 🐙", "Have you tried padel? 🐙") },
        { tid: 75, fran: BERATTARE, text: t("(🐙 betyder \"kramar till er alla\" när mormor skriver.)", "(🐙 means \"hugs to you all\" when Grandma texts.)") },
      ];
    },
    efterKort() {
      sekvens([
        [BERATTARE, t("Det är lördag. Alla vuxna har tråkiga vuxensaker att göra.", "It's Saturday. All the grown-ups have boring grown-up things to do.")],
        [FIGURER.pappa, t("Jag är nummer 47 i kön. Nu 46! Det går framåt.", "I'm number 47 in the queue. Now 46! We're getting there.")],
        [talare(aktivtBarn()), t("Det sitter en lapp på kylskåpet!", "There's a note on the fridge!")],
      ]);
    },
    mal() {
      if (!F.lappLast) return { text: t("Läs lappen på kylskåpet", "Read the note on the fridge"), plats: PLATS.lappen };
      if (!F.valGjort) return null;
      if (!F.kanelMatad) {
        return F.harKattmat
          ? { text: t("Ge Kanel mat", "Feed Kanel"), plats: PLATS.skal }
          : { text: t("Hämta kattmat i skafferiet", "Get cat food from the pantry"), plats: PLATS.skafferi };
      }
      const ovattnade = BLOMMOR.filter((b) => !b.vattnad);
      if (ovattnade.length) {
        return F.harKanna
          ? { text: t("Vattna blommorna", "Water the flowers") + " (" + (3 - ovattnade.length) + "/3)", plats: narmast(ovattnade) }
          : { text: t("Hämta vattenkannan i tvättstugan", "Get the watering can from the laundry room"), plats: PLATS.kanna };
      }
      if (!F.adress) return { text: t("Sätt upp en lapp med adressen", "Put up a note with the address"), plats: PLATS.lappen };
      return null;
    },
    uppdatera() {
      if (!F.klar && F.kanelMatad && F.adress && BLOMMOR.every((b) => b.vattnad)) {
        F.klar = true;
        utmarkelse("lappen");
        sekvens([
          [talare(aldst()), t("Allt på lappen är klart!", "Everything on the note is done!")],
          [FIGURER.pappa, t("Kranen droppar. Det tar fem minuter, max.", "The tap is dripping. It'll take five minutes, tops.")],
          [BERATTARE, t("Två timmar senare ...", "Two hours later ...")],
          [FIGURER.pappa, t("Jag tittar på en film med en man som heter Leif. Nu ska jag bara hämta däcken. Fem minuter!", "I'm watching a video by a man called Leif. Now I just need to get the tyres. Five minutes!")],
        ], () => nastaKapitel(), true);
      }
    },
  },
  // ------------------------------------------------- Kapitel 2: Fem minuter
  {
    titel: t("Fem minuter 💧", "Five Minutes 💧"),
    starta() {
      placeraLaget(PLATS.hall.x, PLATS.hall.z, 0);
      vattenGolv.visible = true;
      droppar.forEach((d) => { d.mesh.visible = true; });
      POLAR.forEach((p) => { p.mesh.visible = true; });
      behov("kran", true);
      behov("hund", true);
      smsPlan = [
        { tid: 4, fran: FIGURER.pappa, text: t("Allt lugnt? Rör inte kranen. Jag fixar den sen.", "All good? Don't touch the tap. I'll fix it later.") },
        { tid: 60, fran: FIGURER.pappa, text: t("Har ni sett ett kvitto på 49 kr? Viktigt.", "Have you seen a receipt for 49 kronor? Important.") },
      ];
    },
    efterKort() {
      sag(talare(aktivtBarn()), t("Det sprutar vatten i köket!!", "Water is spraying in the kitchen!!"));
    },
    mal() {
      if (!F.valGjort) return { text: t("Spring till köket!", "Run to the kitchen!"), plats: PLATS.kran };
      if (F.bat && LEKSAKER.some((l) => !l.seglat)) {
        const kvar = LEKSAKER.filter((l) => !l.seglat);
        return { text: t("Låt leksakerna segla", "Let the toys sail") + " (" + (5 - kvar.length) + "/5)", plats: narmast(kvar.map((l) => l.grupp.position)) };
      }
      if (!F.kranStangd) return { text: t("Stäng huvudkranen i tvättstugan", "Turn off the main valve in the laundry room"), plats: PLATS.huvudkran };
      const blota = POLAR.filter((p) => !p.torkad);
      if (blota.length) return { text: t("Torka upp vattnet", "Mop up the water") + " (" + (3 - blota.length) + "/3)", plats: narmast(blota) };
      if (F.harFilm && !F.visatFilm) return { text: t("Visa pappa Leifs film (han är på däckverkstaden)", "Show Dad Leif's video (he's at the tyre shop)"), plats: { x: 86, z: -6 } };
      return null;
    },
    uppdatera(dt) {
      const p = aktivtBarn().gubbe.grupp.position;
      // Valet kommer när man kommer in i köket
      if (!F.valGjort && !F.valVisas && styrda().some((b) => { const q = b.gubbe.grupp.position; return arInne(q) && q.x < ix(0) && q.z < iz(0); })) {
        F.valVisas = true;
        valj(t("Det sprutar vatten! Vad gör vi?", "Water is spraying! What do we do?"), [
          { ikon: "🔧", text: t("Stänga huvudkranen i tvättstugan", "Turn off the main valve in the laundry room"), gor: () => {
            F.valGjort = true;
            sag(talare(aldst()), t("Huvudkranen sitter i tvättstugan. Kom!", "The main valve is in the laundry room. Come on!"));
          } },
          { ikon: "🚤", text: t("Bygga en båt och segla leksakerna", "Build a boat and sail the toys"), gor: () => {
            F.valGjort = true;
            F.bat = true;
            const bygg = lag.find((b) => b.data.formaga === "bara");
            sag(bygg ? talare(bygg) : talare(aktivtBarn()), bygg ? t("Ge mig tre minuter och silvertejp.", "Give me three minutes and some duct tape.")
              : t("Vi gör segel av papper!", "Let's make sails out of paper!"));
            LEKSAKER.forEach((l) => { l.segel.visible = true; });
          } },
        ]);
      }
      Musik.tempo(F.kranStangd ? 100 : 118);
      // Vattnet sprutar
      if (!F.kranStangd) {
        droppar.forEach((d) => {
          d.tid = (d.tid + dt * 0.8) % 1;
          const s = d.tid;
          const sida = Math.sin(d.tid * 40) * 0.6;
          d.mesh.position.set(ix(-4.5) + sida * s * 1.5, 1.3 + s * 2.2 - s * s * 3.2, iz(-6.6) + s * 2.5);
        });
      }
      // Leksakerna seglar
      LEKSAKER.forEach((l) => {
        if (!l.seglar) return;
        l.seglar -= dt;
        const g = l.grupp;
        g.position.x += Math.sin(l.seglar * 2) * dt * 1.5;
        g.position.z += Math.cos(l.seglar * 2) * dt * 1.5;
        g.position.x = Math.max(ix(-9.5), Math.min(ix(-0.5), g.position.x));
        g.position.z = Math.max(iz(-6.5), Math.min(iz(-0.5), g.position.z));
        g.rotation.y += dt * 2;
        if (l.seglar <= 0) l.seglar = 0;
      });
      if (F.bat) {
        LEKSAKER.forEach((l) => {
          if (l.seglat || !narNagon(l.grupp.position, 1.1)) return;
          l.seglat = true;
          l.seglar = 3;
          kaos();
          if (LEKSAKER.every((x) => x.seglat)) {
            utmarkelse("kaos");
            sag(talare(aktivtBarn()), t("Alla leksaker seglar! Nu stänger vi huvudkranen.", "All the toys are sailing! Now let's turn off the main valve."));
          }
        });
      }
      // Korven följer med ut och kissar i parken
      if (F.korvenUte && !F.korvenKlar && Math.hypot(korven.grupp.position.x - 25, korven.grupp.position.z - 40) < 18) {
        F.korvenKlar = true;
        hjarta();
        behov("hund", false);
        sag(BERATTARE, t("Korven har kissat på ett träd och skällt på brevbäraren. Duktig hund!", "Korven peed on a tree and barked at the postman. Good dog!"));
      }
      if (F.korvenUte && F.korvenKlar && arInne(p)) {
        F.korvenUte = false;
        sluta(korven.grupp);
        korven.grupp.position.set(PLATS.korven.x, 0, PLATS.korven.z);
      }
      // Klart: kranen är stängd och golvet torrt
      if (!F.klar && F.kranStangd && POLAR.every((x) => x.torkad) && (!F.bat || LEKSAKER.every((l) => l.seglat))) {
        F.klar = true;
        sekvens([
          [talare(aldst()), t("Nu bär vi ut det sista vattnet i hinkar.", "Now let's carry out the last of the water in buckets.")],
          [BERATTARE, t("Men ytterdörren står öppen ...", "But the front door is open ...")],
        ], () => {
          kanel.grupp.visible = true;
          flytta(kanel.grupp, ix(5), iz(7.5), 2, () => {
            kanel.grupp.visible = false;
            sekvens([[talare(aktivtBarn()), t("Kanel! Kom tillbaka!", "Kanel! Come back!")]], () => nastaKapitel(), true);
          });
        }, true);
      }
    },
  },
  // ------------------------------------------------- Kapitel 3: Var är Kanel?
  {
    titel: t("Var är Kanel? 🐱", "Where Is Kanel? 🐱"),
    starta() {
      placeraLaget(PLATS.hall.x, PLATS.hall.z, 0);
      behov("katt", true);
      F.ledtradar = [];
      F.fragade = [];
      F.lapparUppe = [];
      F.bilOk = 0;
      smsPlan = [
        { tid: 30, fran: FIGURER.mamma, text: t("Har ni ätit? Det finns mat i kylen. Tror jag.", "Have you eaten? There's food in the fridge. I think.") },
        { tid: 120, fran: FIGURER.mamma, text: t("Jag är helt slut. Har varit igång sen sju.", "I'm exhausted. I've been on the go since seven.") },
      ];
    },
    efterKort() {
      sekvens([
        [talare(aktivtBarn()), t("Kanel är borta! Hon sprang ut genom dörren.", "Kanel is gone! She ran out the door.")],
      ], () => {
        valj(t("Hur ska vi hitta Kanel?", "How do we find Kanel?"), [
          { ikon: "📝", text: t("Sätta upp lappar och fråga grannarna", "Put up notes and ask the neighbours"), gor: () => {
            F.valGjort = true;
            F.lappar = true;
            sag(talare(aldst()), t("Vi sätter upp lappar på lyktstolparna och frågar grannarna.", "Let's put notes on the lamp posts and ask the neighbours."));
          } },
          { ikon: "🐟", text: t("Bygga en kattfälla av mormors fiskpinnar", "Build a cat trap with Grandma's fish fingers"), gor: () => {
            F.valGjort = true;
            F.falla = true;
            sag(talare(aktivtBarn()), t("Jag har en plan! Fiskpinnar framför huset!", "I have a plan! Fish fingers in front of the house!"));
          } },
        ]);
      }, true);
    },
    mal() {
      const p = aktivtBarn().gubbe.grupp.position;
      if (!F.valGjort) return null;
      if (F.lappar && F.lapparUppe.length < 3) {
        const kvar = LYKTSTOLPAR.filter((x) => F.lapparUppe.indexOf(x) < 0 && x !== 0).map((x) => ({ x: x, z: -5.4 }));
        return { text: t("Sätt upp lappar på lyktstolparna", "Put notes on the lamp posts") + " (" + F.lapparUppe.length + "/3)", plats: narmast(kvar) };
      }
      if (F.falla && !F.fallaUte) return { text: t("Ställ ut kattfällan framför huset", "Put the cat trap in front of the house"), plats: PLATS.fallan };
      if (F.ledtradar.length < 2) {
        const platser = [];
        if (F.ledtradar.indexOf("tassar") < 0) platser.push(PLATS.tassar);
        if (F.ledtradar.indexOf("mjau") < 0) platser.push(PLATS.mjau);
        if (F.ledtradar.indexOf("ekorre") < 0) platser.push(ekorre.grupp.position);
        if (F.lappar && F.ledtradar.indexOf("majken") < 0) platser.push(FIGURER.majken.gubbe.grupp.position);
        return { text: t("Leta ledtrådar", "Look for clues") + " (" + F.ledtradar.length + "/2)", plats: narmast(platser) };
      }
      if (!F.kanelHittad) {
        // Söder om gatan: gå först till övergångsstället
        if (!arInne(p) && p.z > 4) return { text: t("Gå över gatan vid övergångsstället", "Cross at the crossing"), plats: { x: OVERGANG.x, z: OVERGANG.soder } };
        return { text: t("Gå skogsvägen till kolonilotterna", "Take the forest road to the allotments"), plats: PLATS.kanel };
      }
      if (!arInne(p) && p.z < -4 && p.x < -40) return { text: t("Gå hem med Kanel", "Take Kanel home"), plats: { x: OVERGANG.x, z: OVERGANG.norr } };
      return { text: t("Gå hem med Kanel", "Take Kanel home"), plats: PLATS.dorrUte };
    },
    prata(f) {
      if (!F.valGjort) return false;
      if (f === FIGURER.majken && F.lappar && F.ledtradar.indexOf("majken") < 0) {
        ledtrad("majken", f, t("En orange katt? Ja, hon sprang mot skogsvägen. Vill ni ha en karamell?", "An orange cat? Yes, she ran towards the forest road. Would you like a sweet?"));
        return true;
      }
      if (f === DJUR.ekorren) {
        if (F.ledtradar.indexOf("ekorre") >= 0) return false;
        const text = aktivtBarn().data.formaga === "krypa"
          ? t("Ekorren litar på Lillebror. Den pekar med svansen mot skogsvägen!", "The squirrel trusts Little Brother. It points its tail at the forest road!")
          : t("Ekorren säger inget. Men den tittar mot skogen ...", "The squirrel says nothing. But it's looking towards the forest ...");
        ledtrad("ekorre", BERATTARE, text);
        return true;
      }
      if (F.lappar && f.granne && F.fragade.indexOf(f.id) < 0) {
        F.fragade.push(f.id);
        hjarta();
        sekvens([
          [talare(aktivtBarn()), t("Har du sett en orange katt? Hon heter Kanel.", "Have you seen an orange cat? Her name is Kanel.")],
          [f, f.repliker[0]],
        ]);
        return true;
      }
      return false;
    },
    uppdatera(dt) {
      const barn = aktivtBarn(), p = barn.gubbe.grupp.position;
      // Tassarna framför huset
      if (F.valGjort && F.ledtradar.indexOf("tassar") < 0 && narNagon(PLATS.tassar, 2.5)) {
        ledtrad("tassar", talare(barn), t("Tassar i leran! Kanel har sprungit åt det här hållet.", "Paw prints in the mud! Kanel went this way."));
      }
      // Kattfällan: måsar, Coco och ordningsvakten kommer
      if (F.fallaUte) {
        F.fallaTid += dt;
        if (F.fallaTid > 3 && !F.masar) {
          F.masar = true;
          masar.forEach((m) => { m.grupp.visible = true; });
          kaos();
          sag(BERATTARE, t("Måsarna tar fiskpinnarna!", "The gulls are taking the fish fingers!"));
        }
        if (F.fallaTid > 9 && !F.coco) {
          F.coco = true;
          flytta(coco.grupp, HEM.x + 1, 8.2, 3);
          flyttaFigur(FIGURER.influencern, HEM.x + 3, 7.6, 3);
          kaos();
          ledtrad("coco", DJUR.coco, t("Voff! (Coco nosar på fällan och springer sedan mot skogsvägen.)", "Woof! (Coco sniffs the trap and runs towards the forest road.)"));
        }
        if (F.fallaTid > 16 && !F.vakten) {
          F.vakten = true;
          flyttaFigur(FIGURER.ordningsvakten, HEM.x - 1.5, 7.4, 4, () => {
            kaos();
            sag(FIGURER.ordningsvakten, t("Legitimation, tack. Både fällan och fiskpinnarna.", "ID, please. Both the trap and the fish fingers."));
          });
        }
        masar.forEach((m, nr) => {
          if (!m.grupp.visible) return;
          const v = klocka * 1.5 + nr * 2.1;
          m.grupp.position.set(HEM.x + Math.cos(v) * 3, 4 + Math.sin(v * 2) * 0.4, 8.6 + Math.sin(v) * 3);
          m.grupp.rotation.y = -v;
          m.vingar.rotation.z = Math.sin(klocka * 12) * 0.4;
        });
      }
      // Två ledtrådar: Kanel syns vid kolonilotterna
      if (F.ledtradar.length >= 2 && !F.kanelSynlig) {
        F.kanelSynlig = true;
        kanel.grupp.visible = true;
        kanel.grupp.position.set(KANELS_GOMSTALLE.x, 0, KANELS_GOMSTALLE.z - 0.8);
        koa(talare(aldst()), t("Alla ledtrådar pekar mot skogsvägen. Kanel är nog vid kolonilotterna!", "All the clues point to the forest road. Kanel must be at the allotments!"));
      }
      // Kanel hemma igen
      if (F.kanelHittad && !F.klar && arInne(p)) {
        F.klar = true;
        hjarta(2);
        behov("katt", false);
        sluta(kanel.grupp);
        kanel.grupp.position.set(ix(5), 0.6, iz(-6.2));
        sekvens([
          [talare(aldst()), t("Kanel är hemma igen!", "Kanel is home again!")],
          [BERATTARE, t("Kanel lägger sig i soffan och somnar. Som om ingenting har hänt.", "Kanel curls up on the sofa and falls asleep. As if nothing happened.")],
        ], () => nastaKapitel(), true);
      }
    },
  },
];

// Ledtrådar i kapitel 3
function ledtrad(id, vem, text) {
  if (F.ledtradar.indexOf(id) >= 0) return;
  F.ledtradar.push(id);
  LJUD.sak();
  sag(vem, "🔍 " + text);
}

// Kapitlens egna saker att göra
sak({ // Lappen på kylskåpet, och adresslappen
  plats: PLATS.lappen, radie: 1.8,
  etikett: () => !F.lappLast ? t("📝 Läs lappen", "📝 Read the note") : t("📝 Sätt upp adresslappen", "📝 Put up the address note"),
  aktiv: () => S.kapitel === 1 && (!F.lappLast || (F.valGjort && !F.adress)),
  gor: () => {
    const barn = aktivtBarn();
    if (!F.lappLast) {
      F.lappLast = true;
      sekvens([
        [talare(barn), t("\"Mata katten. Vattna blommorna. Ingen glass före middag. Puss! /Mamma och pappa\"", "\"Feed the cat. Water the flowers. No ice cream before dinner. Love, Mum and Dad\"")],
        lag.some((b) => b.id === "storasyster") ? [talare(lag.find((b) => b.id === "storasyster")), t("Det står faktiskt på lappen.", "It actually says so on the note.")]
          : [talare(andraBarnet()), t("Glass? Vilken glass?", "Ice cream? What ice cream?")],
      ], () => {
        valj(t("Vad gör vi först?", "What do we do first?"), [
          { ikon: "🐱🌱", text: t("Mata Kanel och vattna blommorna", "Feed Kanel and water the flowers"), gor: () => {
            F.valGjort = true;
            sag(talare(aldst()), t("Jag har ansvaret. Först katten, sen blommorna.", "I'm in charge. Cat first, then the flowers."));
          } },
          { ikon: "🍦", text: t("Äta glass till frukost", "Eat ice cream for breakfast"), gor: () => {
            valj(t("Med strössel?", "With sprinkles?"), [
              { ikon: "🍦✨", text: t("Ja, massor!", "Yes, loads!"), gor: () => glass(2) },
              { ikon: "🍦", text: t("Nej, bara glass", "No, just ice cream"), gor: () => glass(1) },
            ]);
          } },
        ]);
      }, true);
      return;
    }
    // Adresslappen: oftast storasyster, annars den äldsta
    F.adress = true;
    hjarta();
    const vem = lag.find((b) => b.id === "storasyster") || aldst();
    sekvens([
      [talare(vem), t("Jag sätter upp en lapp med vår adress och mammas och pappas telefonnummer.", "I'm putting up a note with our address and Mum's and Dad's phone numbers.")],
      [talare(vem), t("Vi bor på " + INSTALLNINGAR.adress + ". Säg det högt!", "We live at " + INSTALLNINGAR.adress + ". Say it out loud!")],
      [talare(andraBarnet() === vem ? aktivtBarn() : andraBarnet()), INSTALLNINGAR.adress + "!"],
      [BERATTARE, t("Ringer man 112 frågar de vad som har hänt och var. Därför är det bra att kunna sin adress.", "When you call 112 (the Swedish 911), they ask what happened and where. That's why it's good to know your address.")],
    ]);
  },
});

function glass(antal) {
  F.valGjort = true;
  kaos(antal);
  utmarkelse("glass");
  sekvens([
    [talare(aktivtBarn()), t("Mmm! Glass till frukost!", "Mmm! Ice cream for breakfast!")],
    [FIGURER.pappa, t("Mm, mm. Nummer 45.", "Mm-hm. Number 45.")],
    [BERATTARE, t("Pappa märker ingenting. Men Kanel är fortfarande hungrig.", "Dad doesn't notice a thing. But Kanel is still hungry.")],
  ]);
}

sak({ // Frysen
  plats: PLATS.frysen, radie: 1.2,
  etikett: () => t("🍦 Frysen", "🍦 The freezer"),
  aktiv: () => S.kapitel === 1 && F.valGjort,
  gor: () => sag(talare(aktivtBarn()), t("Glassen ligger kvar. Den tittar på mig.", "The ice cream is still there. It's looking at me.")),
});
sak({ // Kattmaten
  plats: PLATS.skafferi, radie: 1.6,
  etikett: () => t("🥫 Ta kattmat", "🥫 Take cat food"),
  aktiv: () => S.kapitel === 1 && F.valGjort && !F.harKattmat,
  gor: () => {
    F.harKattmat = true;
    sag(talare(aktivtBarn()), t("Kattmat! Nu till Kanels skål.", "Cat food! Now to Kanel's bowl."));
  },
});
sak({ // Kanels skål
  plats: PLATS.skal, radie: 1.6,
  etikett: () => t("🐱 Ge Kanel mat", "🐱 Feed Kanel"),
  aktiv: () => S.kapitel === 1 && F.harKattmat && !F.kanelMatad,
  gor: () => {
    F.kanelMatad = true;
    skalMat.visible = true;
    hjarta();
    behov("katt", false);
    sag(talare(aktivtBarn()), lag.some((b) => b.id === "lillebror") && aktivtBarn().id === "lillebror"
      ? t("Katten sa tack. Och att hon vill ha glass.", "The cat said thank you. And that she wants ice cream.")
      : t("Varsågod, Kanel!", "There you go, Kanel!"));
  },
});
sak({ // Vattenkannan
  plats: PLATS.kanna, radie: 1.6,
  etikett: () => t("🪣 Ta vattenkannan", "🪣 Take the watering can"),
  aktiv: () => S.kapitel === 1 && F.valGjort && !F.harKanna,
  gor: () => {
    F.harKanna = true;
    kanna.visible = false;
    sag(talare(aktivtBarn()), t("Vattenkannan! Blommorna står i vardagsrummet.", "The watering can! The flowers are in the living room."));
  },
});
BLOMMOR.forEach((b) => sak({ // Blommorna
  plats: { x: b.x, z: b.z }, radie: 1.6,
  etikett: () => t("🌱 Vattna blomman", "🌱 Water the flower"),
  aktiv: () => S.kapitel === 1 && F.harKanna && !b.vattnad,
  gor: () => {
    b.vattnad = true;
    b.blad.scale.setScalar(1.4);
    b.blad.material = material(0x3fa34d);
    hjarta();
    if (BLOMMOR.every((x) => x.vattnad)) behov("blommor", false);
  },
}));
sak({ // Huvudkranen
  plats: PLATS.huvudkran, radie: 1.6,
  etikett: () => t("🔧 Stäng huvudkranen", "🔧 Turn off the main valve"),
  aktiv: () => S.kapitel === 2 && F.valGjort && !F.kranStangd && (!F.bat || LEKSAKER.every((l) => l.seglat)),
  gor: () => {
    F.kranStangd = true;
    hjarta();
    behov("kran", false);
    huvudkranHjul.rotation.x += Math.PI / 2;
    vattenGolv.visible = false;
    droppar.forEach((d) => { d.mesh.visible = false; });
    sekvens([
      [talare(aldst()), t("Huvudkranen stänger av vattnet i hela huset. Om det läcker stänger man den!", "The main valve shuts off the water in the whole house. If something leaks, you close it!")],
      [BERATTARE, t("Om vattenmätaren snurrar fast alla kranar är stängda, kan det läcka någonstans.", "If the water meter keeps turning when every tap is off, there may be a leak somewhere.")],
      [talare(aktivtBarn()), t("Nu torkar vi upp!", "Now let's mop up!")],
    ]);
  },
});
POLAR.forEach((p) => sak({ // Vattenpölarna
  plats: { x: p.x, z: p.z }, radie: 1.6,
  etikett: () => t("🧽 Torka upp", "🧽 Mop up"),
  aktiv: () => S.kapitel === 2 && F.kranStangd && !p.torkad,
  gor: () => {
    p.torkad = true;
    p.mesh.visible = false;
    hjarta();
  },
}));
sak({ // Korven måste ut
  plats: () => korven.grupp.position, radie: 1.8,
  etikett: () => F.korvenUte || S.kapitel !== 2 ? t("🐕 Klappa Korven", "🐕 Pet Korven") : t("🐕 Gå ut med Korven", "🐕 Take Korven out"),
  aktiv: () => korven.grupp.visible,
  gor: () => {
    if (S.kapitel === 2 && !F.korvenUte && !F.korvenKlar) {
      F.korvenUte = true;
      folj(korven.grupp, 1.4);
      sag(talare(aktivtBarn()), t("Kom, Korven! Vi går till parken.", "Come on, Korven! Let's go to the park."));
      return;
    }
    if (!F.klappatKorven) { F.klappatKorven = true; hjarta(); }
    sag(BERATTARE, t("Korven viftar på svansen och skäller lite på brevlådan.", "Korven wags his tail and barks a bit at the letterbox."));
  },
});
sak({ // Klappa Kanel
  plats: () => kanel.grupp.position, radie: 1.4,
  etikett: () => t("🐱 Klappa Kanel", "🐱 Pet Kanel"),
  aktiv: () => kanel.grupp.visible && S.kapitel < 3,
  gor: () => {
    if (!F.klappatKanel) { F.klappatKanel = true; hjarta(); }
    sag(BERATTARE, t("Kanel spinner. Prrrr.", "Kanel purrs. Prrrr."));
  },
});
sak({ // Pappa och Leifs film (på däckverkstaden)
  plats: () => FIGURER.pappa.gubbe.grupp.position, radie: 2.4,
  etikett: () => t("📱 Visa pappa Leifs film", "📱 Show Dad Leif's video"),
  prioritet: 1,
  aktiv: () => S.kapitel === 2 && F.harFilm && !F.visatFilm,
  gor: () => {
    F.visatFilm = true;
    utmarkelse("kran");
    sekvens([
      [talare(aktivtBarn()), t("Pappa, titta! Leif säger att man stänger huvudkranen först.", "Dad, look! Leif says you turn off the main valve first.")],
      [FIGURER.pappa, t("Aha! Huvudkranen FÖRST. Leif är ett geni. ... Vänta, varför är ni här?", "Aha! The main valve FIRST. Leif is a genius. ... Wait, why are you here?")],
      [talare(aktivtBarn()), t("Vi var bara ... ute och gick. Hej då!", "We were just ... out for a walk. Bye!")],
    ]);
  },
});
LYKTSTOLPAR.filter((x) => x !== 0).forEach((x) => sak({ // Lappar om Kanel
  plats: { x: x, z: -5.4 }, radie: 1.8,
  etikett: () => t("📝 Sätt upp en lapp om Kanel", "📝 Put up a note about Kanel"),
  aktiv: () => S.kapitel === 3 && F.lappar && F.lapparUppe.indexOf(x) < 0,
  gor: () => {
    F.lapparUppe.push(x);
    lada(0.5, 0.6, 0.05, 0xffffff, x, 1.6, -6.45);
    hjarta();
    sag(talare(aktivtBarn()), t("\"Försvunnen katt: Kanel. Orange. Gillar glass.\"", "\"Missing cat: Kanel. Orange. Likes ice cream.\""));
  },
}));
sak({ // Kattfällan
  plats: PLATS.fallan, radie: 2,
  etikett: () => t("🐟 Ställ ut kattfällan", "🐟 Put out the cat trap"),
  aktiv: () => S.kapitel === 3 && F.falla && !F.fallaUte,
  gor: () => {
    F.fallaUte = true;
    F.fallaTid = 0;
    fiskfalla.visible = true;
    kaos();
    sag(talare(aktivtBarn()), t("Mormors fiskpinnar! Ingen katt kan stå emot.", "Grandma's fish fingers! No cat can resist."));
  },
});
sak({ // Jamandet bakom staketet
  plats: PLATS.mjau, radie: 2.2,
  etikett: () => t("🐾 Det jamar bakom staketet", "🐾 Meowing behind the fence"),
  aktiv: () => S.kapitel === 3 && F.valGjort && F.ledtradar.indexOf("mjau") < 0,
  gor: () => {
    const barn = aktivtBarn();
    const kan = lag.find((b) => b.data.formaga === "krypa" || b.data.formaga === "klattra");
    if (barn.data.formaga === "krypa") return ledtrad("mjau", talare(barn), t("Jag kryper in under staketet ... Kanels halsband med bjällran! Spåren går mot skogen.", "I'll crawl under the fence ... Kanel's collar with the bell! The tracks go towards the forest."));
    if (barn.data.formaga === "klattra") return ledtrad("mjau", talare(barn), t("Jag klättrar över! ... Kanels halsband! Spåren går mot skogen.", "I'll climb over! ... Kanel's collar! The tracks go towards the forest."));
    if (kan) return sag(talare(barn), bytTill(kan) + kan.data.namn + " " + FORMAGOR[kan.data.formaga] + "!");
    ledtrad("mjau", talare(barn), t("Vi kommer inte in. Men jamandet går mot skogen!", "We can't get in. But the meowing is heading towards the forest!"));
  },
});
sak({ // Kanel vid kolonilotterna
  plats: () => kanel.grupp.position, radie: 2,
  etikett: () => t("🐱 Kanel! Ta med henne hem", "🐱 Kanel! Take her home"),
  aktiv: () => S.kapitel === 3 && F.kanelSynlig && !F.kanelHittad,
  gor: () => {
    F.kanelHittad = true;
    hjarta(2);
    utmarkelse("katt");
    folj(kanel.grupp, 1.2);
    sag(talare(aktivtBarn()), t("Kanel! Där är du! Nu går vi hem. Längst till vänster på skogsvägen.", "Kanel! There you are! Let's go home. Keep to the left on the forest road."));
  },
});

// ---------------------------------------------------------------------
//  De som följer efter: syskonet, Korven och Kanel
// ---------------------------------------------------------------------

const foljare = [];   // { grupp, avstand, fast }
function folj(grupp, avstand) {
  if (!foljare.some((f) => f.grupp === grupp)) foljare.push({ grupp: grupp, avstand: avstand, fast: 0 });
}
function sluta(grupp) {
  const nr = foljare.findIndex((f) => f.grupp === grupp);
  if (nr >= 0) foljare.splice(nr, 1);
}

// Flyttar något i en rak linje under en viss tid (till exempel Kanel som springer ut)
const flyttar = [];
function flytta(grupp, x, z, tid, narKlar) {
  flyttar.push({ grupp: grupp, franX: grupp.position.x, franZ: grupp.position.z, x: x, z: z, tid: tid, gatt: 0, narKlar: narKlar });
}
function flyttaFigur(f, x, z, tid, narKlar) {
  f.gubbe.grupp.visible = true;
  flytta(f.gubbe.grupp, x, z, tid, narKlar);
}
function uppdateraFlyttar(dt) {
  for (let i = flyttar.length - 1; i >= 0; i--) {
    const f = flyttar[i];
    f.gatt = Math.min(f.tid, f.gatt + dt);
    const a = f.gatt / f.tid;
    f.grupp.position.x = f.franX + (f.x - f.franX) * a;
    f.grupp.position.z = f.franZ + (f.z - f.franZ) * a;
    f.grupp.rotation.y = Math.atan2(f.x - f.franX, f.z - f.franZ);
    if (a >= 1) {
      flyttar.splice(i, 1);
      if (f.narKlar) f.narKlar();
    }
  }
}

// Ett barn (eller djur) går efter den som är framför
function gaEfter(grupp, ledare, avstand, fart, dt, info) {
  const p = grupp.position;
  const dx = ledare.x - p.x, dz = ledare.z - p.z;
  const d = Math.hypot(dx, dz);
  let gar = false;
  if (d > 14 || arInne(p) !== arInne(ledare)) {
    // För långt bort, eller på andra sidan dörren: hoppa fram till ledaren
    p.set(ledare.x - Math.sin(Math.atan2(dx, dz)) * avstand, ledare.y, ledare.z - Math.cos(Math.atan2(dx, dz)) * avstand);
    info.fast = 0;
  } else if (d > avstand) {
    const steg = Math.min(d - avstand, fart * dt * Math.min(1.5, d / avstand));
    const nx = p.x + (dx / d) * steg, nz = p.z + (dz / d) * steg;
    let rorde = false;
    if (!iVagen(nx, p.z, p.y, 0.3)) { p.x = nx; rorde = true; }
    if (!iVagen(p.x, nz, p.y, 0.3)) { p.z = nz; rorde = true; }
    info.fast = rorde ? 0 : info.fast + dt;
    if (info.fast > 1.5) {
      p.set(ledare.x, ledare.y, ledare.z);
      info.fast = 0;
    }
    grupp.rotation.y = Math.atan2(dx, dz);
    gar = true;
  }
  p.y = golvhojd(p.x, p.z, Math.max(p.y, ledare.y), 0.3);
  return gar;
}

// ---------------------------------------------------------------------
//  Styrning: tangentbord, touch och handkontroll
// ---------------------------------------------------------------------

const tangenter = {};
let vantandeGor = false, vantandeByt = false;
window.addEventListener("keydown", (e) => {
  tangenter[e.code] = true;
  if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space"].indexOf(e.code) >= 0 && lage !== "start") e.preventDefault();
  if (e.repeat) return;
  if (e.code === "KeyP" || e.code === "Escape") {
    if (lage === "spelar") pausa();
    else if (lage === "paus") fortsatt();
  }
  if (e.code === "KeyC" && lage === "spelar") vantandeByt = true;
});
window.addEventListener("keyup", (e) => { tangenter[e.code] = false; });

const harTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
const joystick = document.getElementById("joystick");
const joystick2 = document.getElementById("joystick2");
const hoppknapp = document.getElementById("hopp");
const hoppknapp2 = document.getElementById("hopp2");

// En joystick för tummen. Med två spelare på iPad har man en var.
function skapaSpak(ruta, pinne) {
  const spak = { x: 0, y: 0, finger: null, slapp: () => {} };
  if (!ruta || !pinne) return spak;
  function flytta(touch) {
    const r = ruta.getBoundingClientRect();
    const radie = r.width / 2;
    let dx = (touch.clientX - (r.left + radie)) / radie;
    let dy = (touch.clientY - (r.top + radie)) / radie;
    const langd = Math.sqrt(dx * dx + dy * dy);
    if (langd > 1) { dx /= langd; dy /= langd; }
    spak.x = dx;
    spak.y = dy;
    pinne.style.transform = "translate(" + dx * radie * 0.6 + "px," + dy * radie * 0.6 + "px)";
  }
  spak.slapp = () => {
    spak.x = spak.y = 0;
    spak.finger = null;
    pinne.style.transform = "";
  };
  ruta.addEventListener("touchstart", (e) => {
    e.preventDefault();
    spak.finger = e.changedTouches[0].identifier;
    flytta(e.changedTouches[0]);
  }, { passive: false });
  ruta.addEventListener("touchmove", (e) => {
    e.preventDefault();
    for (const touch of e.changedTouches) if (touch.identifier === spak.finger) flytta(touch);
  }, { passive: false });
  const sluta = (e) => {
    for (const touch of e.changedTouches) if (touch.identifier === spak.finger) spak.slapp();
  };
  ruta.addEventListener("touchend", sluta);
  ruta.addEventListener("touchcancel", sluta);
  return spak;
}

function skapaHopp(knapp) {
  const hopp = { nere: false, slapp: () => {} };
  if (!knapp) return hopp;
  knapp.addEventListener("touchstart", (e) => {
    e.preventDefault();
    hopp.nere = true;
    knapp.classList.add("tryckt");
  }, { passive: false });
  hopp.slapp = () => {
    hopp.nere = false;
    knapp.classList.remove("tryckt");
  };
  knapp.addEventListener("touchend", hopp.slapp);
  knapp.addEventListener("touchcancel", hopp.slapp);
  return hopp;
}

const spakar = [skapaSpak(joystick, document.getElementById("pinne")), skapaSpak(joystick2, document.getElementById("pinne2"))];
const hoppar = [skapaHopp(hoppknapp), skapaHopp(hoppknapp2)];
function slappTouch() {
  spakar.forEach((s) => s.slapp());
  hoppar.forEach((h) => h.slapp());
}
// Visar knapparna för fingrarna (bara på touchskärmar)
function visaTouch(synlig) {
  joystick.hidden = hoppknapp.hidden = !(synlig && harTouch);
  if (joystick2 && hoppknapp2) joystick2.hidden = hoppknapp2.hidden = !(synlig && harTouch && tvaSpelare);
  bytKnapp.hidden = !synlig || tvaSpelare;
}

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

// Knappar som bara ska räknas en gång per tryck
const forraKnappar = {};
function nyttTryck(namn, nere) {
  const ny = nere && !forraKnappar[namn];
  forraKnappar[namn] = nere;
  return ny;
}
let anvanderHandkontroll = false;

// Läser tangentbord, touch och handkontroller. Med två spelare:
//   spelare 1: WASD, mellanslag = hoppa, F = gör, vänster joystick, första handkontrollen
//   spelare 2: piltangenterna, höger Shift = hoppa, Enter = gör, höger joystick, andra handkontrollen
function lasStyrning() {
  const sp = [{ x: 0, y: 0, hopp: false, gor: false }, { x: 0, y: 0, hopp: false, gor: false }];
  const s1 = sp[0], s2 = tvaSpelare ? sp[1] : sp[0];
  let sving = 0, byt = false, paus = false, valjTryck = false, navX = 0, navY = 0;
  if (tangenter.KeyA) s1.x -= 1;
  if (tangenter.KeyD) s1.x += 1;
  if (tangenter.KeyW) s1.y -= 1;
  if (tangenter.KeyS) s1.y += 1;
  if (tangenter.Space) s1.hopp = true;
  if (tangenter.KeyF || tangenter.KeyT) s1.gor = true;
  if (tangenter.ArrowLeft) s2.x -= 1;
  if (tangenter.ArrowRight) s2.x += 1;
  if (tangenter.ArrowUp) s2.y -= 1;
  if (tangenter.ArrowDown) s2.y += 1;
  if (tangenter.ShiftRight || tangenter.Numpad0) s2.hopp = true;
  if (tangenter.Enter) s2.gor = true;
  if (tangenter.KeyQ) sving += 1;
  if (tangenter.KeyE) sving -= 1;
  s1.x += spakar[0].x;
  s1.y += spakar[0].y;
  if (hoppar[0].nere) s1.hopp = true;
  if (tvaSpelare) {
    s2.x += spakar[1].x;
    s2.y += spakar[1].y;
    if (hoppar[1].nere) s2.hopp = true;
  }

  const alla = navigator.getGamepads ? Array.prototype.slice.call(navigator.getGamepads()) : [];
  alla.filter((k) => k).forEach((k, nr) => {
    const s = tvaSpelare && nr === 1 ? s2 : s1;
    const axel = (i) => {
      const v = k.axes[i] || 0;
      return Math.abs(v) > INSTALLNINGAR.dodzon ? v : 0;
    };
    const tryckt = (i) => !!(k.buttons[i] && k.buttons[i].pressed);
    if (k.buttons.some((b) => b.pressed)) anvanderHandkontroll = true;
    s.x += axel(0);
    s.y += axel(1);
    sving -= axel(2);                           // höger spak vrider kameran
    if (tryckt(12)) { s.y -= 1; navY -= 1; }    // styrkorset
    if (tryckt(13)) { s.y += 1; navY += 1; }
    if (tryckt(14)) { s.x -= 1; navX -= 1; }
    if (tryckt(15)) { s.x += 1; navX += 1; }
    if (Math.abs(axel(0)) > 0.6) navX += Math.sign(axel(0));
    if (Math.abs(axel(1)) > 0.6) navY += Math.sign(axel(1));
    if (tryckt(0)) { s.hopp = true; valjTryck = true; }   // A
    if (tryckt(2)) s.gor = true;                // X
    if (tryckt(3)) byt = true;                  // Y
    if (tryckt(9)) paus = true;                 // Start/Meny
  });

  const spelare = sp.map((s, nr) => {
    const langd = Math.sqrt(s.x * s.x + s.y * s.y);
    if (langd > 1) { s.x /= langd; s.y /= langd; }
    return { x: s.x, y: s.y, hoppNytt: nyttTryck("hopp" + nr, s.hopp), gorNytt: nyttTryck("gor" + nr, s.gor) };
  });
  // Menyerna: ett steg per tryck
  const nav = (nyttTryck("hoger", navX > 0 || navY > 0) ? 1 : 0) - (nyttTryck("vanster", navX < 0 || navY < 0) ? 1 : 0);
  return {
    spelare: spelare,
    sving: Math.max(-1, Math.min(1, sving)),
    bytNytt: nyttTryck("byt", byt),
    pausNytt: nyttTryck("paus", paus),
    valjNytt: nyttTryck("valj", valjTryck),
    nav: nav,
  };
}

// Finns det en handkontroll? (Den syns för sidan först när man har tryckt på en knapp.)
const knapphjalp = document.getElementById("knapphjalp");
function harHandkontroll() {
  if (anvanderHandkontroll) return true;
  const alla = navigator.getGamepads ? navigator.getGamepads() : [];
  for (let i = 0; i < alla.length; i++) if (alla[i]) return true;
  return false;
}

// Handkontrollen i menyerna: styrkorset flyttar, A väljer
let menyFokus = 0;
function synligaKnappar() {
  const tl = document.querySelector(".tl-bakgrund");
  const rutor = [tl, document.getElementById("valruta"), document.getElementById("startruta"),
    document.getElementById("pausmeny"), document.getElementById("slutruta")];
  for (const ruta of rutor) {
    if (ruta && !ruta.hidden) {
      const knappar = Array.prototype.filter.call(ruta.querySelectorAll("button, a.menyknapp"), (k) => !k.hidden && !k.disabled && k.offsetParent !== null);
      if (knappar.length) return knappar;
    }
  }
  return null;
}
function menyStyrning(styr) {
  const knappar = synligaKnappar();
  if (!knappar || !knappar.length) return false;
  if (!anvanderHandkontroll) return true;
  if (styr.nav) menyFokus += styr.nav;
  menyFokus = ((menyFokus % knappar.length) + knappar.length) % knappar.length;
  document.querySelectorAll(".fokus").forEach((k) => k.classList.remove("fokus"));
  knappar[menyFokus].classList.add("fokus");
  if (styr.nav) knappar[menyFokus].scrollIntoView({ block: "nearest" });   // rutan kan vara högre än skärmen
  if (styr.valjNytt) {
    knappar[menyFokus].click();
    menyFokus = 0;
  }
  return true;
}

// ---------------------------------------------------------------------
//  Rutorna: start, val, kapitel, paus och slut
// ---------------------------------------------------------------------

let lage = "start";   // "start", "spelar", "val", "kort", "paus" eller "slut"
let speltid = 0;
let kameraVinkel = 0;

const hud = document.getElementById("hud");
const kylskap = document.getElementById("kylskap");
const malRuta = document.getElementById("mal");
const goraKnapp = document.getElementById("prata");
const bytKnapp = document.getElementById("byt");
const pausKnapp = document.getElementById("paus");
const startruta = document.getElementById("startruta");
const pausmeny = document.getElementById("pausmeny");
const slutruta = document.getElementById("slutruta");
const valruta = document.getElementById("valruta");
const kapitelkort = document.getElementById("kapitelkort");

// En eller två spelare
let antalSpelare = 1;
document.querySelectorAll(".antalknapp").forEach((k) => {
  k.addEventListener("click", () => {
    antalSpelare = Number(k.dataset.antal);
    visaBarnval();
  });
});

// Musiken på/av (i startrutan och pausmenyn)
const musikKnappar = document.querySelectorAll(".musikknapp");
function visaMusikKnapp() {
  musikKnappar.forEach((k) => { k.textContent = Musik.arPa() ? t("🎵 Musik: på", "🎵 Music: on") : t("🔇 Musik: av", "🔇 Music: off"); });
}
musikKnappar.forEach((k) => k.addEventListener("click", () => { Musik.vaxla(); visaMusikKnapp(); }));
visaMusikKnapp();

// Välj två syskon
let valdaBarn = ["lillebror", "storasyster"];
const barnval = document.getElementById("barnval");
Object.keys(BARN).forEach((id) => {
  const b = BARN[id];
  const kort = document.createElement("button");
  kort.type = "button";
  kort.className = "barnkort";
  kort.dataset.barn = id;
  kort.innerHTML = '<span class="spelarnr"></span><span class="stor"></span><span class="namn"></span><span class="kan"></span>';
  kort.querySelector(".stor").textContent = b.ikon;
  kort.querySelector(".namn").textContent = b.namn + " (" + b.alder + ")";
  kort.querySelector(".kan").textContent = b.kan;
  kort.addEventListener("click", () => {
    const nr = valdaBarn.indexOf(id);
    if (nr >= 0) valdaBarn.splice(nr, 1);
    else {
      valdaBarn.push(id);
      if (valdaBarn.length > 2) valdaBarn.shift();
    }
    visaBarnval();
  });
  barnval.appendChild(kort);
});
function visaBarnval() {
  barnval.querySelectorAll(".barnkort").forEach((k) => {
    const nr = valdaBarn.indexOf(k.dataset.barn);
    k.classList.toggle("vald", nr >= 0);
    // Med två spelare: vem styr vilket barn
    k.querySelector(".spelarnr").textContent = antalSpelare === 2 && nr >= 0 ? (nr === 0 ? t("🔵 Spelare 1", "🔵 Player 1") : t("🟠 Spelare 2", "🟠 Player 2")) : "";
  });
  document.querySelectorAll(".antalknapp").forEach((k) => k.classList.toggle("vald", Number(k.dataset.antal) === antalSpelare));
  document.getElementById("startInfo").textContent = antalSpelare === 2
    ? t("Välj två syskon. Spelare 1 styr det första och spelare 2 det andra. Ni behöver två handkontroller, eller en var sida av iPaden.",
      "Choose two siblings. Player 1 plays the first and player 2 the second. You need two controllers, or one side of the iPad each.")
    : t("Välj två syskon. Du styr det ena och det andra följer efter. Du kan byta när du vill!",
      "Choose two siblings. You play one, and the other follows. You can switch whenever you like!");
  // Börja säger själv vad som fattas (en avstängd knapp syns inte på mobilen)
  document.getElementById("borja").textContent = valdaBarn.length === 2 ? t("▶ Börja", "▶ Start")
    : t("Välj ett barn till (" + valdaBarn.length + "/2)", "Choose one more child (" + valdaBarn.length + "/2)");
}
visaBarnval();

const sparat = lasSparat();
const fortsattKnapp = document.getElementById("fortsattSparat");
if (sparat && sparat.kapitel > 1 && sparat.barn && sparat.barn.length === 2) {
  fortsattKnapp.hidden = false;
  fortsattKnapp.textContent = t("▶ Fortsätt (kapitel ", "▶ Continue (chapter ") + sparat.kapitel + ")";
}

function borjaSpela(nyttS) {
  startaLjud();
  S = nyttS;
  skapaLag(S.barn);
  startruta.hidden = slutruta.hidden = pausmeny.hidden = true;
  pausKnapp.hidden = false;
  hud.hidden = kylskap.hidden = false;
  tvaSpelare = S.spelare === 2;
  document.body.classList.toggle("tva", tvaSpelare);
  visaTouch(true);
  if (ljud) Musik.starta(ljud);
  startaKapitel(S.kapitel);
}
document.getElementById("borja").addEventListener("click", () => {
  if (valdaBarn.length !== 2) {
    barnval.classList.remove("blinka");
    void barnval.offsetWidth;   // starta om blinkningen
    barnval.classList.add("blinka");
    return;
  }
  glomSparat();
  borjaSpela({ kapitel: 1, barn: valdaBarn.slice(), spelare: antalSpelare, hjartan: 0, kaos: 0, hittat: [], utmarkelser: [] });
});
fortsattKnapp.addEventListener("click", () => borjaSpela(lasSparat()));
document.getElementById("igen").addEventListener("click", () => {
  slutruta.hidden = true;
  startruta.hidden = false;
  fortsattKnapp.hidden = true;
  lage = "start";
});
document.getElementById("borjaOmKapitel").addEventListener("click", () => {
  pausmeny.hidden = true;
  tystna();
  filmPagar = false;
  flyttar.length = 0;
  S = JSON.parse(JSON.stringify(kapitelStart));
  startaKapitel(S.kapitel);
});

function visaKapitelkort(nr, titel, narKlar) {
  lage = "kort";
  document.getElementById("kapitelNummer").textContent = t("Kapitel ", "Chapter ") + nr;
  document.getElementById("kapitelTitel").textContent = titel;
  kapitelkort.hidden = false;
  tystna();
  tala(BERATTARE, t("Kapitel ", "Chapter ") + nr + ". " + titel);
  setTimeout(() => {
    kapitelkort.hidden = true;
    lage = "spelar";
    if (narKlar) narKlar();
  }, 2800);
}

// Ett val med två stora bilder. Båda är roliga – inget är fel.
function valj(fraga, alternativ) {
  lage = "val";
  document.getElementById("valFraga").textContent = fraga;
  const knappar = document.getElementById("valknappar");
  knappar.innerHTML = "";
  alternativ.forEach((alt) => {
    const k = document.createElement("button");
    k.type = "button";
    k.className = "valknapp";
    k.innerHTML = '<span class="stor"></span><span></span>';
    k.firstChild.textContent = alt.ikon;
    k.lastChild.textContent = alt.text;
    k.addEventListener("click", () => {
      valruta.hidden = true;
      lage = "spelar";
      tystna();
      alt.gor();
    });
    knappar.appendChild(k);
  });
  valruta.hidden = false;
  menyFokus = 0;
  tala(talare(aktivtBarn()), fraga + " " + alternativ.map((a) => a.text).join(t(", eller ", ", or ")) + "?");
}

function pausa() {
  if (lage !== "spelar") return;
  lage = "paus";
  if (harTal) speechSynthesis.cancel();
  pausmeny.hidden = false;
  menyFokus = 0;
  slappTouch();
  Musik.paus(true);
}
function fortsatt() {
  if (lage !== "paus") return;
  lage = "spelar";
  pausmeny.hidden = true;
  Musik.paus(false);
}

function slut() {
  lage = "slut";
  const lista = document.getElementById("slutLista");
  lista.innerHTML = "";
  const rader = [
    "❤️ " + S.hjartan + " × " + INSTALLNINGAR.poangHjarta,
    "💥 " + S.kaos + " × " + INSTALLNINGAR.poangKaos,
    "⭐ " + S.hittat.length + " × " + INSTALLNINGAR.poangSak,
  ].concat(S.utmarkelser.map((id) => UTMARKELSER[id] + " +" + INSTALLNINGAR.poangUtmarkelse));
  rader.push(t("Totalt: ", "Total: ") + totalPoang() + t(" poäng", " points"));
  rader.forEach((r) => {
    const li = document.createElement("li");
    li.textContent = r;
    lista.appendChild(li);
  });
  slutruta.hidden = false;
  pausKnapp.hidden = true;
  visaTouch(false);
  goraKnapp.hidden = true;
  menyFokus = 0;
  glomSparat();
  Topplista.nyttResultat("aventyr", totalPoang(), { fordrojning: 1.5 });
}

pausKnapp.addEventListener("click", pausa);
document.getElementById("fortsatt").addEventListener("click", fortsatt);
goraKnapp.addEventListener("click", () => { vantandeGor = true; });
bytKnapp.addEventListener("click", () => { vantandeByt = true; });
document.addEventListener("visibilitychange", () => { if (document.hidden) pausa(); });

function uppdateraBytKnapp() {
  if (lag.length === 2) bytKnapp.textContent = "🔄" + andraBarnet().data.ikon;
}

// ---------------------------------------------------------------------
//  Rörelse, kamera och varje bildruta
// ---------------------------------------------------------------------

function placeraLaget(x, z, vinkel) {
  lag.forEach((b, nr) => {
    b.gubbe.grupp.position.set(x + (nr === aktiv ? 0 : 1.2), 0, z + (nr === aktiv ? 0 : 1));
    b.vinkel = vinkel;
    b.fartY = 0;
  });
  kameraVinkel = vinkel;
  placeraKamera(1, true);
}

function teleportera(x, z, vinkel) {
  const barn = aktivtBarn();
  barn.gubbe.grupp.position.set(x, 0, z);
  barn.vinkel = vinkel;
  andraBarnet().gubbe.grupp.position.set(x + 0.8, 0, z + 1);
  foljare.forEach((f, nr) => f.grupp.position.set(x - 0.8, 0, z + 1 + nr * 0.6));
  kameraVinkel = vinkel;
  placeraKamera(1, true);
}

function bytBarn() {
  if (tvaSpelare) return;
  aktiv = 1 - aktiv;
  uppdateraBytKnapp();
  const barn = aktivtBarn();
  const repliker = barn.data.repliker;
  sag(talare(barn), repliker[Math.floor(Math.random() * repliker.length)]);
}

// Hur långt isär barnen får gå när man är två (så att båda syns)
const MAX_ISAR = { ute: 16, inne: 9 };

function styrBarnet(barn, dt, s, annan) {
  const pos = barn.gubbe.grupp.position;
  const fart = Math.sqrt(s.x * s.x + s.y * s.y);
  const radie = 0.35 * barn.data.storlek + 0.1;
  if (fart > 0.05) {
    // Styrningen gäller sett från kameran: uppåt = bort från kameran
    const riktning = kameraVinkel + Math.atan2(-s.x, -s.y);
    const steg = INSTALLNINGAR.springfart * barn.data.fart * fart * dt;
    const nyX = pos.x - Math.sin(riktning) * steg;
    const nyZ = pos.z - Math.cos(riktning) * steg;
    const inne = arInne(pos);
    const minX = inne ? ix(-10) : GRANSER.xMin, maxX = inne ? ix(10) : GRANSER.xMax;
    const minZ = inne ? iz(-7) : GRANSER.zMin, maxZ = inne ? iz(7) : GRANSER.zMax;
    // Med två spelare: man kan inte springa ifrån varandra
    const ap = annan ? annan.gubbe.grupp.position : null;
    const isar = inne ? MAX_ISAR.inne : MAX_ISAR.ute;
    const forLangt = (x, z) => ap && Math.hypot(x - ap.x, z - ap.z) > isar && Math.hypot(x - ap.x, z - ap.z) > Math.hypot(pos.x - ap.x, pos.z - ap.z);
    if (!iVagen(nyX, pos.z, pos.y, radie) && !forLangt(nyX, pos.z)) pos.x = Math.max(minX, Math.min(maxX, nyX));
    if (!iVagen(pos.x, nyZ, pos.y, radie) && !forLangt(pos.x, nyZ)) pos.z = Math.max(minZ, Math.min(maxZ, nyZ));
    let skillnad = riktning - barn.vinkel;
    skillnad = Math.atan2(Math.sin(skillnad), Math.cos(skillnad));
    barn.vinkel += skillnad * Math.min(1, dt * 12);
    barn.steg += dt * 12 * fart;
    // Kameran svänger långsamt in bakom (en spelare, om man inte nyss vridit den själv)
    if (!tvaSpelare && speltid - senastManuellKamera > 1.5) {
      let k = barn.vinkel - kameraVinkel;
      k = Math.atan2(Math.sin(k), Math.cos(k));
      kameraVinkel += k * Math.min(1, dt * 1.2 * fart);
    }
  }
  barn.gubbe.grupp.rotation.y = barn.vinkel + Math.PI;

  // Hopp och tyngdkraft
  if (s.hoppNytt) barn.hoppMinne = 0.15;
  barn.hoppMinne -= dt;
  if (barn.hoppMinne > 0 && barn.paMarken) {
    barn.hoppMinne = 0;
    barn.fartY = INSTALLNINGAR.hoppfart * barn.data.hopp;
    barn.paMarken = false;
    LJUD.hopp();
  }
  const fotForut = pos.y;
  barn.fartY -= INSTALLNINGAR.tyngdkraft * dt;
  pos.y += barn.fartY * dt;
  const golv = golvhojd(pos.x, pos.z, fotForut, radie);
  barn.paMarken = false;
  if (pos.y <= golv) {
    pos.y = golv;
    barn.fartY = 0;
    barn.paMarken = true;
  }
  svingaArmarOchBen(barn.gubbe, fart > 0.05 ? Math.sin(barn.steg) * 0.8 * fart : 0);
  if (!barn.paMarken) barn.gubbe.vansterArm.rotation.x = barn.gubbe.hogerArm.rotation.x = Math.PI * 0.9;
  // Titta åt båda hållen vid övergångsstället
  barn.gubbe.huvud.rotation.y = tittaTid > 0 && barn === aktivtBarn() ? Math.sin((2.4 - tittaTid) * Math.PI * 1.25) * 1.1 : 0;
}

// Det kameran tittar på: barnet, eller mitt emellan barnen när man är två
const fokus = new THREE.Vector3();
function kameraFokus() {
  if (!tvaSpelare) return fokus.copy(aktivtBarn().gubbe.grupp.position);
  return fokus.copy(lag[0].gubbe.grupp.position).add(lag[1].gubbe.grupp.position).multiplyScalar(0.5);
}

// Står ett hus mellan barnet och kameran? Svarar hur stor del av vägen som är fri (0–1).
function friSikt(fran, till) {
  if (arInne(fran)) return 1;   // inne är väggarna låga
  for (let i = 1; i <= 16; i++) {
    const a = i / 16;
    const x = fran.x + (till.x - fran.x) * a, z = fran.z + (till.z - fran.z) * a;
    const y = fran.y + 1.4 + (till.y - fran.y - 1.4) * a;
    for (const h of hinder) {
      if (h.hb < 0.5 || h.hd < 0.5) continue;   // träd, stolpar och staket skymmer inte mycket
      if (y < h.hojd + 0.4 && overlappar(x, z, h, 0.4)) return Math.max(0.15, (i - 1) / 16);
    }
  }
  return 1;
}

// Kameran följer efter, bakom och lite ovanför (mer uppifrån inne).
// Med två spelare backar den när barnen är långt isär, så att båda syns.
const kameraMal = new THREE.Vector3();
let kameraAvstand = INSTALLNINGAR.kameraUte.avstand, kameraHojd = INSTALLNINGAR.kameraUte.hojd;
function placeraKamera(dt, direkt) {
  const pos = kameraFokus();
  const profil = arInne(pos) ? INSTALLNINGAR.kameraInne : INSTALLNINGAR.kameraUte;
  const isar = tvaSpelare ? lag[0].gubbe.grupp.position.distanceTo(lag[1].gubbe.grupp.position) : 0;
  const a = direkt ? 1 : Math.min(1, dt * 3);
  kameraAvstand += (profil.avstand + isar * 0.55 - kameraAvstand) * a;
  kameraHojd += (profil.hojd + isar * 0.45 - kameraHojd) * a;
  kameraMal.set(
    pos.x + Math.sin(kameraVinkel) * kameraAvstand,
    pos.y * 0.6 + kameraHojd,
    pos.z + Math.cos(kameraVinkel) * kameraAvstand
  );
  // Ett hus i vägen: kameran går närmare och tittar mer uppifrån
  const fri = friSikt(pos, kameraMal);
  if (fri < 1) {
    kameraMal.x = pos.x + (kameraMal.x - pos.x) * fri;
    kameraMal.z = pos.z + (kameraMal.z - pos.z) * fri;
    kameraMal.y += (1 - fri) * 5;
  }
  if (direkt) kamera.position.copy(kameraMal);
  else kamera.position.lerp(kameraMal, Math.min(1, dt * (fri < 1 ? 10 : 6)));
  kamera.lookAt(pos.x, pos.y + 1.4, pos.z);
  sol.position.set(pos.x + 30, 50, pos.z + 20);
  sol.target.position.copy(pos);
}

// Bilarna kör fram och tillbaka och stannar för barnen
function uppdateraBilar(dt) {
  const barnen = styrda();
  BILAR.forEach((bil) => {
    const langs = bil.axel === "x" ? "x" : "z";
    const tvars = bil.axel === "x" ? "z" : "x";
    // Höger sida: kör man åt +x är höger +z, kör man åt +z är höger -x
    const korfalt = bil.axel === "x" ? bil.riktning * 1.8 : -bil.riktning * 0.9;
    const g = bil.grupp;
    g.position[tvars] = bil.mitt + korfalt;
    g.rotation.y = bil.axel === "x" ? bil.riktning * Math.PI / 2 : (bil.riktning > 0 ? 0 : Math.PI);
    if (bil.vantar > 0) { bil.vantar -= dt; return; }
    // Står ett barn framför bilen? Då stannar den och tutar.
    const iVagenFor = barnen.some((barn) => {
      const p = barn.gubbe.grupp.position;
      const framfor = (p[langs] - bil.pos) * bil.riktning;
      const iFilen = Math.abs(p[tvars] - g.position[tvars]) < (bil.skogsvag ? 1.2 : 1.6);
      return !arInne(p) && iFilen && framfor > 0 && framfor < 7;
    });
    bil.tutat = Math.max(0, bil.tutat - dt);
    if (iVagenFor) {
      if (!bil.tutat) {
        LJUD.tut();
        bil.tutat = 3;
        if (bil.skogsvag && S.kapitel === 3) {
          sag(talare(aldst()), t("Bilen stannar! Gå längst ut på kanten, till vänster, så kommer den förbi.", "The car has stopped! Walk right at the edge, on the left, so it can get past."));
        }
      }
      return;
    }
    const fore = bil.pos;
    bil.pos += bil.riktning * bil.fart * dt;
    if (bil.pos > bil.till || bil.pos < bil.fran) {
      bil.riktning *= -1;
      bil.pos = Math.max(bil.fran, Math.min(bil.till, bil.pos));
      bil.vantar = 2;
    }
    g.position[langs] = bil.pos;
    // Skogsvägen: går barnen längst till vänster när bilen kör förbi?
    if (bil.skogsvag && S.kapitel === 3 && F.valGjort) {
      barnen.forEach((barn) => {
        const p = barn.gubbe.grupp.position;
        if (Math.abs(p.x - SKOGSVAG.x) < 6 && (fore - p.z) * (bil.pos - p.z) <= 0) kollaVansterSida(barn);
      });
    }
  });
}

function kollaVansterSida(barn) {
  const p = barn.gubbe.grupp.position;
  // Vänster om dit barnet tittar
  const vx = -Math.cos(barn.vinkel);
  const paVanster = (p.x - SKOGSVAG.x) * vx > 0.3;
  if (paVanster) {
    F.bilOk++;
    hjarta();
    sag(talare(barn), t("Vi går längst till vänster, så vi möter bilarna och ser dem.", "We keep to the left, so we face the cars and can see them."));
    if (F.bilOk >= 2) utmarkelse("trafik");
  } else {
    sag(talare(aldst()), t("Oj! På vägar utan trottoar går man längst till vänster, så att man möter bilarna.", "Whoa! On roads without a pavement, you walk on the far left, facing the traffic."));
  }
}

// Det ett barn kan göra där det står: { sak, avstand } eller null
function narmasteSak(barn) {
  const p = barn.gubbe.grupp.position;
  let bast = null, avstand = Infinity;
  saker.forEach((s) => {
    if (!s.aktiv()) return;
    const q = s.plats();
    const d = Math.hypot(q.x - p.x, q.z - p.z);
    // Saker med prioritet går före (t.ex. "Visa pappa filmen" före "Prata med pappa")
    const poang = d - (s.prioritet || 0) * 5;
    if (d < (s.radie || INSTALLNINGAR.gorAvstand) && poang < avstand) { avstand = poang; bast = s; }
  });
  return bast ? { sak: bast, avstand: avstand } : null;
}

// Färgade ringar under barnen när man är två: blå = spelare 1, orange = spelare 2
const ringar = [0x4aa0ff, 0xff9a3a].map((farg) => {
  const ring = new THREE.Mesh(new THREE.RingGeometry(0.55, 0.75, 20), new THREE.MeshBasicMaterial({ color: farg }));
  ring.rotation.x = -Math.PI / 2;
  ring.visible = false;
  scen.add(ring);
  return ring;
});

function uppdatera(dt, styr) {
  speltid += dt;
  kapitelTid += dt;
  tittaTid = Math.max(0, tittaTid - dt);
  if (styr.bytNytt || vantandeByt) bytBarn();
  vantandeByt = false;
  if (styr.sving) {
    kameraVinkel += styr.sving * INSTALLNINGAR.kameraSving * dt;
    senastManuellKamera = speltid;
  }

  if (tvaSpelare) {
    lag.forEach((barn, nr) => styrBarnet(barn, dt, styr.spelare[nr], lag[1 - nr]));
  } else {
    styrBarnet(aktivtBarn(), dt, styr.spelare[0], null);
    // Syskonet följer efter
    const syskon = andraBarnet();
    syskon.fast = syskon.fast || 0;
    const gar = gaEfter(syskon.gubbe.grupp, aktivtBarn().gubbe.grupp.position, 1.6, INSTALLNINGAR.springfart * 1.1, dt, syskon);
    syskon.steg += gar ? dt * 12 : 0;
    svingaArmarOchBen(syskon.gubbe, gar ? Math.sin(syskon.steg) * 0.7 : 0);
  }
  ringar.forEach((ring, nr) => {
    ring.visible = tvaSpelare;
    if (tvaSpelare) ring.position.copy(lag[nr].gubbe.grupp.position).setY(lag[nr].gubbe.grupp.position.y + 0.06);
  });
  // Djuren går efter i en rad
  let framfor = (tvaSpelare ? lag[1] : andraBarnet()).gubbe.grupp.position;
  foljare.forEach((f) => {
    gaEfter(f.grupp, framfor, f.avstand, INSTALLNINGAR.springfart * 1.15, dt, f);
    framfor = f.grupp.position;
  });

  // Sms enligt kapitlets plan
  while (smsPlan.length && smsPlan[0].tid <= kapitelTid) {
    const s = smsPlan.shift();
    if (s.fran === BERATTARE) koa(BERATTARE, s.text);
    else sms(s.fran, s.text);
  }

  if (kapitel) kapitel.uppdatera(dt);
  uppdateraBilar(dt);

  // Knappen för det man kan göra. Med två spelare gör den som tryckte,
  // och knappen på skärmen gäller den som står närmast något.
  const forslag = filmPagar ? [] : styrda().map((barn) => narmasteSak(barn));
  let visad = null, visadNr = 0;
  forslag.forEach((f, nr) => {
    if (f && (!visad || f.avstand < visad.avstand)) { visad = f; visadNr = nr; }
  });
  goraKnapp.hidden = !visad;
  if (visad) {
    // Med handkontroll står X på knappen (X = gör/prata)
    const text = (tvaSpelare ? (visadNr === 0 ? "🔵 " : "🟠 ") : "") + visad.sak.etikett();
    const nyckel = text + (anvanderHandkontroll ? "/x" : "");
    if (goraKnapp.dataset.text !== nyckel) {
      goraKnapp.dataset.text = nyckel;
      goraKnapp.innerHTML = anvanderHandkontroll ? '<span class="xk x">X</span>' : "";
      goraKnapp.appendChild(document.createTextNode(text));
    }
  }
  const gor = (nr, f) => {
    if (tvaSpelare) aktiv = nr;   // den som gör saken är den som pratar
    f.sak.gor();
  };
  let gjort = false;
  styr.spelare.forEach((s, nr) => {
    const f = forslag[tvaSpelare ? nr : 0];
    if (!gjort && s.gorNytt && f) { gor(nr, f); gjort = true; }
  });
  if (!gjort && vantandeGor && visad) gor(visadNr, visad);
  vantandeGor = false;

  // Målet och pilen
  const ledare = kameraFokus();
  const mal = kapitel && !filmPagar ? kapitel.mal() : null;
  malRuta.hidden = !mal;
  if (mal) {
    const text = "🎯 " + mal.text;
    if (malRuta.textContent !== text) malRuta.textContent = text;
    // Är målet på andra sidan ytterdörren pekar pilen på dörren
    let mp = mal.plats;
    if (arInne(mp) !== arInne(ledare)) mp = arInne(ledare) ? PLATS.dorrInne : PLATS.dorrUte;
    pil.visible = Math.hypot(mp.x - ledare.x, mp.z - ledare.z) > 1.5;
    pil.position.set(ledare.x, ledare.y + (tvaSpelare ? 3.4 : 2.9 * aktivtBarn().data.storlek + 0.5) + Math.sin(speltid * 4) * 0.1, ledare.z);
    pil.rotation.y = Math.atan2(mp.x - ledare.x, mp.z - ledare.z);
  } else {
    pil.visible = false;
  }

  if (smsTid > 0) {
    smsTid -= dt;
    if (smsTid <= 0) smsRuta.hidden = true;
  }
  placeraKamera(dt);
}

// Sådant som rör sig hela tiden
let klocka = 0;
function animera(dt) {
  klocka += dt;
  uppdateraFlyttar(dt);
  // De vuxna gungar lite och tittar mot barnen när de är nära
  const p = lag.length ? aktivtBarn().gubbe.grupp.position : new THREE.Vector3();
  Object.keys(FIGURER).forEach((id, nr) => {
    const f = FIGURER[id], g = f.gubbe.grupp;
    if (!g.visible) return;
    g.rotation.z = Math.sin(klocka * 1.3 + nr) * 0.03;
    if (Math.hypot(p.x - g.position.x, p.z - g.position.z) < 6) {
      g.rotation.y = Math.atan2(p.x - g.position.x, p.z - g.position.z);
    }
  });
  // Mormor och padelgrannen spelar padel
  if (FIGURER.mormor.gubbe.grupp.visible) {
    FIGURER.mormor.gubbe.grupp.position.x = 58 + Math.sin(klocka * 1.7) * 3;
    FIGURER.padelgrannen.gubbe.grupp.position.x = 58 + Math.sin(klocka * 1.7 + 0.8) * 3;
    svingaArmarOchBen(FIGURER.mormor.gubbe, Math.sin(klocka * 6) * 0.5);
  }
  // Brevbäraren springer fram och tillbaka (taxen hatar honom)
  const brev = FIGURER.brevbararen;
  if (brev.gubbe.grupp.visible) {
    const v = Math.sin(klocka * 0.25);
    brev.gubbe.grupp.position.x = -10 + v * 28;
    brev.gubbe.grupp.rotation.y = Math.cos(klocka * 0.25) > 0 ? Math.PI / 2 : -Math.PI / 2;
    svingaArmarOchBen(brev.gubbe, Math.sin(klocka * 10) * 0.8);
  }
  // Ankorna simmar runt i dammen
  ankor.forEach((a) => {
    const v = klocka * 0.3 + a.fas;
    a.mesh.position.set(DAMM.x + Math.cos(v) * 4, 0.18, DAMM.z + Math.sin(v) * 4);
    a.mesh.rotation.y = -v;
  });
  // Saker att hitta glittrar
  HITTESAKER.forEach((h) => {
    h.markor.visible = S.hittat.indexOf(h.id) < 0 && S.kapitel >= (h.fran || 1);
    h.markor.rotation.y = klocka * 2;
    h.markor.position.y = (h.y || 1.6) + Math.sin(klocka * 3) * 0.1;
  });
  // Kanel och ekorren viftar på svansen
  kanel.svans.rotation.x = 1.1 + Math.sin(klocka * 3) * 0.3;
  ekorre.svans.rotation.x = 1.4 + Math.sin(klocka * 5) * 0.2;
  korven.svans.rotation.y = Math.sin(klocka * 8) * 0.5;
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
// Bakom startrutan syns radhusen
kamera.position.set(5, 6, -14);
kamera.lookAt(5, 2, 10);
stallInVarlden();

let forraTiden = performance.now();
function ruta(nu) {
  const verkligTid = Math.max(0, (nu - forraTiden) / 1000);
  // Max 0,1 sekunder per steg, så att ingen flyger iväg efter en paus
  const dt = Math.min(0.1, verkligTid);
  forraTiden = nu;
  const styr = lasStyrning();
  const iMeny = menyStyrning(styr);
  if (lage === "spelar") {
    if (styr.pausNytt) pausa();
    else uppdatera(dt, styr);
  } else if (lage === "paus" && styr.pausNytt) fortsatt();
  if (lage === "spelar" || lage === "val" || lage === "kort") uppdateraRepliker(dt);
  if (!iMeny) document.querySelectorAll(".fokus").forEach((k) => k.classList.remove("fokus"));
  // Xbox-knapparna syns i start- och pausrutan när en handkontroll är inkopplad
  const visaHjalp = (lage === "start" || lage === "paus") && harHandkontroll();
  if (knapphjalp.hidden === visaHjalp) knapphjalp.hidden = !visaHjalp;
  if (lage !== "paus") animera(dt);
  renderare.render(scen, kamera);
  kvalitet.rakna(verkligTid);
  requestAnimationFrame(ruta);
}
requestAnimationFrame(ruta);
