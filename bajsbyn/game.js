// =====================================================================
//  BAJSBYN – ett spel i 3D
//
//  Morfar tappar sina guldbajsar hela tiden. Spring, hoppa upp på
//  lådtornen och hitta dem! Bajsarna hamnar på nya ställen varje gång.
//
//  Fyra lägen:
//    🗺️ Banor   – tio uppdrag från Morfar, 1–3 ⭐ per bana
//    ⏱️ Jakten  – 100 bajsar, hur många hinner du på 90 sekunder?
//    🔗 Kedjan  – en bajs i taget, hinn till nästa innan tiden tar slut
//    🌼 Lugnt   – ingen tid, leta i lugn och ro
//
//  💎 Diamantbajs (en bajskorv av diamant) = 5 poäng. ⏰ Klocka = 5 sekunder extra.
//  Allt i 3D byggs av kod med Three.js (../three.min.js), utan modellfiler.
// =====================================================================

const INSTALLNINGAR = {
  springfart: 8.5,        // meter per sekund
  hoppfart: 9.5,          // så högt man hoppar (räcker upp på en låda)
  tyngdkraft: 25,
  stegHojd: 0.35,         // så höga kanter man går upp på utan att hoppa
  kameraAvstand: 8,
  kameraHojd: 4.5,
  kameraSving: 2.5,       // hur fort kameran svänger med höger spak / Q och E
  sikt: 110,              // meter; längre bort syns bara dimma
  plockAvstand: 1.5,      // så nära man ska komma en bajs för att ta den
  dodzon: 0.25,
  vardeGuld: 1,
  vardeDiamant: 5,
  klockTid: 5,            // sekunder extra för en klocka
  stjarnor: [0.25, 0.5],  // så stor del av tiden som ska vara kvar för ⭐⭐ och ⭐⭐⭐
  storlek: 55,            // staketet står så här långt från mitten åt alla håll
};

// Lägena. guld/diamanter/klockor = hur många som läggs ut. torn = lådtorn att hoppa upp på.
// hoga = så stor del av bajsarna som ligger högt upp. omrade: "nara" (vid torget) eller "kant" (vid staketet).
const LAGEN = {
  banor: { ikon: "🗺️", namn: t("Banor", "Levels"), om: t("Uppdrag från Morfar. Klara dem med tre stjärnor!", "Missions from Grandpa. Get three stars on all of them!") },
  jakt: { ikon: "⏱️", namn: t("Jakten", "The Hunt"), om: t("100 bajsar. Hur många hinner du ta på 90 sekunder?", "100 poops. How many can you grab in 90 seconds?"),
    guld: 90, diamanter: 6, klockor: 4, tid: 90, torn: 8, hoga: 0.15 },
  kedja: { ikon: "🔗", namn: t("Kedjan", "The Chain"), om: t("En bajs i taget. Hinn till nästa innan tiden tar slut!", "One poop at a time. Reach the next one before time runs out!"),
    startTid: 10, maxTid: 15, torn: 8 },
  lugnt: { ikon: "🌼", namn: t("Lugnt läge", "Relaxed"), om: t("Ingen tid. Leta i lugn och ro.", "No timer. Search at your own pace."),
    guld: 15, diamanter: 1, torn: 6, hoga: 0.2 },
};

// Banorna. Nya banor läggs till sist i listan.
// krav: "guld" (hitta alla guld) eller "diamanter" (hitta alla diamanter).
// vader: "dimma", "kvall" eller "sno". robot: true = robotgräsklipparen kör runt och flyttar bajsar.
const BANOR = [
  { namn: t("Första jakten", "The first hunt"), text: t("Jag har tappat 5 guldbajsar nära torget. Kan du hitta dem?", "I've dropped 5 golden poops near the square. Can you find them?"),
    guld: 5, tid: 90, omrade: "nara" },
  { namn: t("Hela byn", "The whole village"), text: t("Nu ligger 8 guldbajsar överallt i byn!", "Now there are 8 golden poops all over the village!"),
    guld: 8, tid: 100 },
  { namn: t("Högt upp", "Up high"), text: t("6 guldbajsar ligger uppe på lådtornen. Hoppa!", "6 golden poops are on top of the box towers. Jump!"),
    guld: 6, tid: 120, hoga: 1, torn: 8 },
  { namn: t("Diamantjakt", "Diamond hunt"), text: t("Någonstans finns 3 diamantbajsar. Hitta dem! Guldbajsarna ger extra poäng.", "Somewhere there are 3 diamond poops. Find them! Golden ones give bonus points."),
    guld: 15, diamanter: 3, krav: "diamanter", tid: 120 },
  { namn: t("Bråttom!", "Hurry!"), text: t("12 guldbajsar på 45 sekunder! Klockorna ger mer tid.", "12 golden poops in 45 seconds! The clocks give you more time."),
    guld: 12, klockor: 4, tid: 45, omrade: "nara" },
  { namn: t("Vid staketet", "By the fence"), text: t("Bajsarna har rullat ut till staketet. Hitta 10!", "The poops have rolled out to the fence. Find 10!"),
    guld: 10, tid: 110, omrade: "kant" },
  { namn: t("Dimma", "Fog"), text: t("Det har blivit dimmigt. Följ pilen och hitta 8!", "It's gone foggy. Follow the arrow and find 8!"),
    guld: 8, tid: 120, vader: "dimma" },
  { namn: t("Kvällsjakt", "Evening hunt"), text: t("Det har blivit kväll. Guldbajsarna lyser i mörkret. Hitta 10!", "It's evening. The golden poops glow in the dark. Find 10!"),
    guld: 10, tid: 120, vader: "kvall" },
  { namn: t("Tornstaden", "Tower town"), text: t("Lådtorn överallt! Hitta 10. De flesta ligger högt upp.", "Box towers everywhere! Find 10. Most of them are up high."),
    guld: 10, tid: 150, hoga: 0.7, torn: 12 },
  { namn: t("Allt på en gång", "Everything at once"), text: t("20 guldbajsar i kvällsmörkret, med diamantbajsar och klockor. Lycka till!", "20 golden poops in the dark, with diamond poops and clocks. Good luck!"),
    guld: 20, diamanter: 2, klockor: 3, tid: 150, hoga: 0.3, torn: 8, vader: "kvall" },
  { namn: t("Första snön", "First snow"), text: t("Första snön! Allt är vitt, men guldbajsarna syns ändå. Hitta 10!", "First snow! Everything is white, but the golden poops still show. Find 10!"),
    guld: 10, tid: 120, vader: "sno" },
  { namn: t("Robotgräsklipparen", "The robot mower"), text: t("Min nya robotgräsklippare flyttar bajsarna den kör på. Den har en app. Appen säger att allt går jättebra. Hitta 10!",
    "My new robot mower moves every poop it runs over. It has an app. The app says everything is going great. Find 10!"),
    guld: 10, tid: 150, robot: true },
];

// ---------------------------------------------------------------------
//  Renderaren, himlen och ljuset
// ---------------------------------------------------------------------

const duk = document.getElementById("spel");
let renderare;
try {
  // Three.js r159 tar WebGL 2 om det finns och annars WebGL 1
  renderare = new THREE.WebGLRenderer({ canvas: duk, antialias: false, powerPreference: "high-performance" });
} catch (fel) {
  document.querySelector("#startruta p").textContent =
    t("Den här enheten klarar tyvärr inte 3D (WebGL saknas).", "Sorry, this device can't show 3D (no WebGL).");
  throw fel;
}
renderare.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
renderare.shadowMap.enabled = true;

const scen = new THREE.Scene();
scen.fog = new THREE.Fog(0xcfeaff, INSTALLNINGAR.sikt * 0.35, INSTALLNINGAR.sikt);
const kamera = new THREE.PerspectiveCamera(60, 1, 0.1, 400);

// Himlen: en stor kula med en färgskala från horisonten och uppåt
const himmel = new THREE.Mesh(new THREE.SphereGeometry(300, 24, 12), new THREE.ShaderMaterial({
  uniforms: { topp: { value: new THREE.Color(0x3d8fe0) }, horisont: { value: new THREE.Color(0xcfeaff) } },
  vertexShader: "varying vec3 vRiktning; void main() { vRiktning = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",
  fragmentShader: "uniform vec3 topp; uniform vec3 horisont; varying vec3 vRiktning; void main() { float h = max(vRiktning.y, 0.0); gl_FragColor = vec4(mix(horisont, topp, pow(h, 0.55)), 1.0); \n#include <colorspace_fragment>\n }",
  side: THREE.BackSide,
  depthWrite: false,
}));
scen.add(himmel);

const himmelsljus = new THREE.HemisphereLight(0xfff4e0, 0x5a7a3a, 0.95);
scen.add(himmelsljus);
const sol = new THREE.DirectionalLight(0xfff0d0, 1.7);
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

const kub = new THREE.BoxGeometry(1, 1, 1);
function lada(b, h, d, farg, x, y, z, foralder) {
  const del = new THREE.Mesh(kub, typeof farg === "number" ? material(farg) : farg);
  del.scale.set(b, h, d);
  del.position.set(x, y, z);
  del.castShadow = true;
  del.receiveShadow = true;
  (foralder || scen).add(del);
  return del;
}

// Samma slumptal varje gång med samma frö
function slump(fro) {
  let s = Math.max(1, Math.floor(fro) % 2147483646);
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

// ---------------------------------------------------------------------
//  Hinder: allt man kan krocka med eller stå på
// ---------------------------------------------------------------------

const HOGT = 99;   // Så högt att man inte kan stå ovanpå (husens tak)
const hinder = [];    // det som står still: hus, träd, staket ...
let rorliga = [];     // lådtornen, som byggs om varje runda
const ALLA_HINDER = [hinder, null];

function nyttHinder(x, z, bredd, djup, topp, hojd) {
  return { x: x, z: z, hb: bredd / 2, hd: djup / 2, topp: topp, hojd: hojd !== undefined ? hojd : (topp === HOGT ? 5 : topp) };
}
function laggTillHinder(x, z, bredd, djup, topp, hojd) {
  const h = nyttHinder(x, z, bredd, djup, topp, hojd);
  hinder.push(h);
  return h;
}
function overlappar(x, z, h, marginal) {
  return Math.abs(x - h.x) < h.hb + marginal && Math.abs(z - h.z) < h.hd + marginal;
}
function varjeHinder(gor) {
  ALLA_HINDER[1] = rorliga;
  for (const lista of ALLA_HINDER) for (const h of lista) if (gor(h)) return true;
  return false;
}
// Hur högt marken är där man står (lådor räknas som mark)
function golvhojd(x, z, fotY, radie) {
  let golv = 0;
  varjeHinder((h) => {
    if (h.topp <= fotY + INSTALLNINGAR.stegHojd && h.topp > golv && overlappar(x, z, h, radie * 0.7)) golv = h.topp;
    return false;
  });
  return golv;
}
function iVagen(x, z, fotY, radie) {
  return varjeHinder((h) => h.topp > fotY + INSTALLNINGAR.stegHojd && overlappar(x, z, h, radie));
}
function ledigPlats(x, z, marginal) {
  return !varjeHinder((h) => overlappar(x, z, h, marginal));
}

// ---------------------------------------------------------------------
//  Byn
// ---------------------------------------------------------------------

const DAMM = { x: 20, z: 20, radie: 7 };
const MORFAR_PLATS = { x: 0, z: -6 };
const BAJSIS_PLATS = { x: 11, z: 20 };
const START = { x: 0, z: 2 };

// Marken: små färgskiftningar, och mjuka kullar utanför staketet
(function byggMarken() {
  const g = new THREE.PlaneGeometry(400, 400, 80, 80);
  g.rotateX(-Math.PI / 2);
  const pos = g.attributes.position;
  const farger = new Float32Array(pos.count * 3);
  const ljus = new THREE.Color(0x86cf5a), mork = new THREE.Color(0x5aa83f), f = new THREE.Color();
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i), z = pos.getZ(i);
    const utanfor = Math.max(Math.abs(x), Math.abs(z)) - 62;
    if (utanfor > 0) pos.setY(i, utanfor * 0.3 * (0.6 + 0.4 * Math.sin(x * 0.11) * Math.cos(z * 0.13)));
    const brus = 0.5 + 0.25 * Math.sin(x * 0.37 + z * 0.21) + 0.25 * Math.sin(x * 0.13 - z * 0.41);
    f.copy(mork).lerp(ljus, brus);
    farger[i * 3] = f.r; farger[i * 3 + 1] = f.g; farger[i * 3 + 2] = f.b;
  }
  g.setAttribute("color", new THREE.BufferAttribute(farger, 3));
  g.computeVertexNormals();
  const mark = new THREE.Mesh(g, new THREE.MeshLambertMaterial({ vertexColors: true, flatShading: true }));
  allaMaterial.push(mark.material);
  mark.receiveShadow = true;
  scen.add(mark);
})();

function platta(bredd, djup, farg, x, z, y) {
  const p = new THREE.Mesh(new THREE.PlaneGeometry(bredd, djup), material(farg));
  p.rotation.x = -Math.PI / 2;
  p.position.set(x, y || 0.02, z);
  p.receiveShadow = true;
  scen.add(p);
  return p;
}
platta(3.5, INSTALLNINGAR.storlek * 2, 0xd9b77a, 0, 0, 0.02);
platta(INSTALLNINGAR.storlek * 2, 3.5, 0xd9b77a, 0, 0, 0.03);
const torget = new THREE.Mesh(new THREE.CircleGeometry(7, 24), material(0xc9b48a));
torget.rotation.x = -Math.PI / 2;
torget.position.y = 0.04;
torget.receiveShadow = true;
scen.add(torget);

// Dammen med vass
const vattenMaterial = new THREE.MeshLambertMaterial({ color: 0x3d8fd6, emissive: 0x0a2a4a });
allaMaterial.push(vattenMaterial);
const damm = new THREE.Mesh(new THREE.CircleGeometry(DAMM.radie, 24), vattenMaterial);
damm.rotation.x = -Math.PI / 2;
damm.position.set(DAMM.x, 0.05, DAMM.z);
scen.add(damm);
const dammKant = new THREE.Mesh(new THREE.RingGeometry(DAMM.radie, DAMM.radie + 0.8, 24), material(0xa89a7a));
dammKant.rotation.x = -Math.PI / 2;
dammKant.position.set(DAMM.x, 0.045, DAMM.z);
scen.add(dammKant);

// Husen: väggar, sadeltak med takfot, skorsten, dörr och fönster
const HUS = [
  [0, -14, 7, 6, 4, 0xf3e2b8, 0xb33a2a],   // morfars hus
  [-14, -12, 6, 5, 3.5, 0xe88a5a, 0x6b3a2a],
  [14, -12, 6, 6, 4, 0xf5f5f5, 0x2f5a8a],
  [-22, 4, 5, 6, 3, 0xf1c84b, 0xb33a2a],
  [22, 2, 6, 5, 3.5, 0xc9e3a5, 0x6b3a2a],
  [-12, 22, 6, 5, 3, 0x9ec5e8, 0xb33a2a],
  [6, 32, 5, 5, 3.5, 0xf3c6d6, 0x2f5a8a],
  [-34, -26, 6, 6, 4, 0xe88a5a, 0x6b3a2a],
  [34, -24, 5, 6, 3, 0xf3e2b8, 0xb33a2a],
  [-40, 30, 6, 5, 3.5, 0xf5f5f5, 0x6b3a2a],
  [40, 36, 6, 6, 4, 0xf1c84b, 0x2f5a8a],
  [0, -40, 8, 5, 4.5, 0xc9e3a5, 0xb33a2a],
];
function byggHus(x, z, bredd, djup, hojd, vaggFarg, takFarg) {
  lada(bredd, hojd, djup, vaggFarg, x, hojd / 2, z);
  // Sadeltaket: en trekant som dras ut längs huset
  const fot = 0.4, takHojd = Math.min(2.4, djup * 0.45);
  const form = new THREE.Shape();
  form.moveTo(-djup / 2 - fot, 0);
  form.lineTo(djup / 2 + fot, 0);
  form.lineTo(0, takHojd);
  form.lineTo(-djup / 2 - fot, 0);
  const takForm = new THREE.ExtrudeGeometry(form, { depth: bredd + fot * 2, bevelEnabled: false });
  takForm.rotateY(Math.PI / 2);
  const tak = new THREE.Mesh(takForm, material(takFarg));
  tak.position.set(x - bredd / 2 - fot, hojd, z);
  tak.castShadow = true;
  scen.add(tak);
  lada(0.7, 1.6, 0.7, 0x8a5a4a, x + bredd * 0.25, hojd + takHojd * 0.6, z - djup * 0.15);   // skorsten
  // Dörr och fönster på framsidan (mot +z), och fönster på sidorna
  lada(1.1, 2.1, 0.12, 0x6b4423, x, 1.05, z + djup / 2 + 0.05);
  lada(0.25, 0.25, 0.14, 0xffd23f, x + 0.35, 1.1, z + djup / 2 + 0.06);
  [-1, 1].forEach((sida) => {
    const fx = x + sida * (bredd / 4 + 0.5);
    lada(1.3, 1.3, 0.1, 0xffffff, fx, hojd * 0.62, z + djup / 2 + 0.05);
    lada(1, 1, 0.12, 0x9ec5e8, fx, hojd * 0.62, z + djup / 2 + 0.06);
    lada(0.1, 1.3, 1.3, 0xffffff, x + sida * (bredd / 2 + 0.05), hojd * 0.62, z);
    lada(0.12, 1, 1, 0x9ec5e8, x + sida * (bredd / 2 + 0.06), hojd * 0.62, z);
  });
  laggTillHinder(x, z, bredd, djup, HOGT, hojd + takHojd);
}
HUS.forEach((h) => byggHus.apply(null, h));

// Staketet runt byn
(function byggStaket() {
  const s = INSTALLNINGAR.storlek, platser = [];
  for (let i = -s; i <= s; i += 2.5) platser.push([i, -s], [i, s], [-s, i], [s, i]);
  const stolpar = new THREE.InstancedMesh(new THREE.BoxGeometry(0.25, 1.1, 0.25), material(0xf5f5f5), platser.length);
  const m = new THREE.Matrix4();
  platser.forEach(([x, z], nr) => stolpar.setMatrixAt(nr, m.makeTranslation(x, 0.55, z)));
  stolpar.castShadow = true;
  scen.add(stolpar);
  [0.45, 0.85].forEach((y) => {
    [[0, -s, s * 2, 0.1], [0, s, s * 2, 0.1], [-s, 0, 0.1, s * 2], [s, 0, 0.1, s * 2]].forEach(([x, z, b, d]) => lada(b, 0.12, d, 0xf5f5f5, x, y, z));
  });
})();

// Lyktstolpar runt torget (de lyser på kvällen)
const lampMaterial = new THREE.MeshLambertMaterial({ color: 0xfff2b0, emissive: 0x000000 });
allaMaterial.push(lampMaterial);
[[8, 8], [-8, 8], [8, -8], [-8, -8], [24, -4], [-24, -4]].forEach(([x, z]) => {
  lada(0.2, 3.6, 0.2, 0x3a3f46, x, 1.8, z);
  lada(0.55, 0.45, 0.55, lampMaterial, x, 3.8, z);
  laggTillHinder(x, z, 0.3, 0.3, HOGT, 4);
});

// Parkbänkar
[[5, 9.5, 0], [-5, -9.5, 0], [16, 14, Math.PI / 2]].forEach(([x, z, v]) => {
  const g = new THREE.Group();
  lada(2.2, 0.12, 0.6, 0x8b5a2b, 0, 0.5, 0, g);
  lada(2.2, 0.5, 0.1, 0x8b5a2b, 0, 0.8, -0.28, g);
  [-0.9, 0.9].forEach((bx) => lada(0.12, 0.5, 0.5, 0x3a3f46, bx, 0.25, 0, g));
  g.position.set(x, 0, z);
  g.rotation.y = v;
  scen.add(g);
  laggTillHinder(x, z, v ? 0.7 : 2.2, v ? 2.2 : 0.7, 0.55);
});

// Instanser med olika färg: alla ritas på en gång (bra för iPaden)
function instanser(form, farger, platser, skugga) {
  const mesh = new THREE.InstancedMesh(form, material(0xffffff), platser.length);
  const m = new THREE.Matrix4(), q = new THREE.Quaternion(), s = new THREE.Vector3(), p = new THREE.Vector3(), upp = new THREE.Vector3(0, 1, 0);
  const f = new THREE.Color();
  platser.forEach((pl, nr) => {
    q.setFromAxisAngle(upp, pl.vinkel || 0);
    s.set(pl.skala, pl.skalaY || pl.skala, pl.skala);
    mesh.setMatrixAt(nr, m.compose(p.set(pl.x, pl.y, pl.z), q, s));
    mesh.setColorAt(nr, f.setHex(farger[nr % farger.length]).offsetHSL(0, 0, (pl.ljus || 0)));
  });
  mesh.castShadow = !!skugga;
  mesh.receiveShadow = true;
  scen.add(mesh);
  return mesh;
}

// Träd, buskar, blommor och stenar
const FRIA = [START, MORFAR_PLATS, BAJSIS_PLATS];
(function byggNaturen() {
  const r = slump(7);
  const ledigt = (x, z, marginal) => {
    if (Math.abs(x) < 3 || Math.abs(z) < 3) return false;                       // inte på gångarna
    if (Math.hypot(x, z) < 9) return false;                                      // inte på torget
    if (Math.hypot(x - DAMM.x, z - DAMM.z) < DAMM.radie + 1.5) return false;
    if (FRIA.some((p) => Math.hypot(x - p.x, z - p.z) < 4)) return false;
    return ledigPlats(x, z, marginal);
  };
  const s = INSTALLNINGAR.storlek - 2;
  const slumpa = (antal, marginal, gor) => {
    for (let forsok = 0, n = 0; n < antal && forsok < antal * 30; forsok++) {
      const x = (r() * 2 - 1) * s, z = (r() * 2 - 1) * s;
      if (ledigt(x, z, marginal)) { gor(x, z); n++; }
    }
  };
  // Lövträd och granar (stammarna är hinder)
  const stammar = [], kronor = [], granar = [];
  slumpa(110, 2.4, (x, z) => {
    const st = 0.8 + r() * 0.6;
    stammar.push({ x: x, y: st, z: z, skala: st, vinkel: r() * 3 });
    if (r() < 0.35) {
      [0, 1, 2].forEach((i) => granar.push({ x: x, y: st * (2 + i * 0.9), z: z, skala: st * (1.3 - i * 0.3), skalaY: st, vinkel: r() * 3, ljus: (r() - 0.5) * 0.08 }));
    } else {
      kronor.push({ x: x, y: st * 2.7, z: z, skala: st * 1.15, vinkel: r() * 3, ljus: (r() - 0.5) * 0.1 });
      kronor.push({ x: x + 0.4 * st, y: st * 3.4, z: z - 0.2, skala: st * 0.75, vinkel: r() * 3, ljus: (r() - 0.5) * 0.1 });
    }
    laggTillHinder(x, z, 0.6, 0.6, HOGT, 5);
  });
  instanser(new THREE.CylinderGeometry(0.2, 0.3, 2, 6), [0x7a4a24], stammar, true);
  instanser(new THREE.IcosahedronGeometry(1.4, 0), [0x3f9a3a, 0x2f8a3a, 0x58aa3a, 0x6aa83a], kronor, true);
  instanser(new THREE.ConeGeometry(1.3, 1.6, 7), [0x2a6e3a, 0x2f7a40], granar, true);
  // Buskar, blommor och stenar
  const buskar = [], blommor = [], stenar = [];
  slumpa(70, 1.2, (x, z) => buskar.push({ x: x, y: 0.35, z: z, skala: 0.5 + r() * 0.5, skalaY: 0.4 + r() * 0.3, vinkel: r() * 3, ljus: (r() - 0.5) * 0.1 }));
  slumpa(260, 0.4, (x, z) => blommor.push({ x: x, y: 0.15, z: z, skala: 0.12 + r() * 0.06, vinkel: r() * 3 }));
  slumpa(40, 0.8, (x, z) => stenar.push({ x: x, y: 0.1, z: z, skala: 0.3 + r() * 0.4, skalaY: 0.25 + r() * 0.2, vinkel: r() * 3, ljus: (r() - 0.5) * 0.1 }));
  instanser(new THREE.IcosahedronGeometry(1, 0), [0x3f8a3a, 0x4a9a40, 0x357a35], buskar, true);
  instanser(new THREE.IcosahedronGeometry(1, 0), [0xff5a7a, 0xffe14a, 0xffffff, 0xc78aff, 0xff9a3a], blommor, false);
  instanser(new THREE.DodecahedronGeometry(1, 0), [0x9a9a92, 0x8a8a84, 0xaaa8a0], stenar, true);
  // Vass runt dammen
  const vass = [];
  for (let i = 0; i < 40; i++) {
    const v = r() * Math.PI * 2, d = DAMM.radie + 0.2 + r() * 0.5;
    vass.push({ x: DAMM.x + Math.cos(v) * d, y: 0.5, z: DAMM.z + Math.sin(v) * d, skala: 0.08, skalaY: 0.8 + r() * 0.6, vinkel: r() * 3 });
  }
  instanser(new THREE.BoxGeometry(1, 1, 1), [0x6a8a3a, 0x7a9a4a], vass, false);
})();

// Molnen glider sakta över himlen
const moln = [];
(function byggMoln() {
  const r = slump(3);
  const vitt = new THREE.MeshLambertMaterial({ color: 0xffffff, emissive: 0x666666, flatShading: true, fog: false });
  allaMaterial.push(vitt);
  for (let i = 0; i < 12; i++) {
    const g = new THREE.Group();
    for (let j = 0; j < 4; j++) {
      const bit = new THREE.Mesh(new THREE.IcosahedronGeometry(3 + r() * 3, 0), vitt);
      bit.position.set(j * 4 - 6, r() * 2, (r() - 0.5) * 4);
      bit.scale.y = 0.6;
      g.add(bit);
    }
    g.position.set((r() * 2 - 1) * 200, 45 + r() * 25, (r() * 2 - 1) * 200);
    scen.add(g);
    moln.push(g);
  }
})();

// ---------------------------------------------------------------------
//  Lådtornen: byggs om varje runda, så att byn ser lite olika ut
// ---------------------------------------------------------------------

// Lådorna får en textur med plankor (ritas på en liten bild)
const ladMaterial = (function () {
  const bild = document.createElement("canvas");
  bild.width = bild.height = 64;
  const g = bild.getContext("2d");
  g.fillStyle = "#c8964f";
  g.fillRect(0, 0, 64, 64);
  g.fillStyle = "#a8763a";
  for (let y = 0; y < 64; y += 16) g.fillRect(0, y, 64, 2);
  g.strokeStyle = "#7a5228";
  g.lineWidth = 6;
  g.strokeRect(0, 0, 64, 64);
  g.beginPath();
  g.moveTo(4, 4);
  g.lineTo(60, 60);
  g.stroke();
  const textur = new THREE.CanvasTexture(bild);
  textur.colorSpace = THREE.SRGBColorSpace;
  const m = new THREE.MeshLambertMaterial({ map: textur });
  allaMaterial.push(m);
  return m;
})();

const tornGrupp = new THREE.Group();
scen.add(tornGrupp);
let hogaPlatser = [];   // toppen av varje lådtorn: { x, y, z }

// Ett torn är en trappa av tre lådor (0,8, 1,6 och 2,4 meter höga)
function byggTorn(antal, r) {
  while (tornGrupp.children.length) tornGrupp.remove(tornGrupp.children[0]);
  rorliga = sno.visible ? snoHinder.slice() : [];   // snögubbarna står i vägen när det är snö
  hogaPlatser = [];
  const s = INSTALLNINGAR.storlek - 4, sida = 1.4;
  for (let forsok = 0; hogaPlatser.length < antal && forsok < 600; forsok++) {
    const x = (r() * 2 - 1) * s, z = (r() * 2 - 1) * s;
    const riktning = Math.floor(r() * 4);
    const dx = [1, -1, 0, 0][riktning] * sida, dz = [0, 0, 1, -1][riktning] * sida;
    const lador = [0, 1, 2].map((i) => ({ x: x + dx * i, z: z + dz * i, h: 0.8 * (i + 1) }));
    const fritt = lador.every((l) => Math.abs(l.x) < s && Math.abs(l.z) < s && Math.hypot(l.x, l.z) > 9 &&
      Math.hypot(l.x - DAMM.x, l.z - DAMM.z) > DAMM.radie + 2 && Math.abs(l.x) > 2.5 && Math.abs(l.z) > 2.5 &&
      ledigPlats(l.x, l.z, 2.2) && !FRIA.some((p) => Math.hypot(l.x - p.x, l.z - p.z) < 4));
    if (!fritt) continue;
    lador.forEach((l) => {
      const m = new THREE.Mesh(kub, ladMaterial);
      m.scale.set(sida, l.h, sida);
      m.position.set(l.x, l.h / 2, l.z);
      m.castShadow = m.receiveShadow = true;
      tornGrupp.add(m);
      rorliga.push(nyttHinder(l.x, l.z, sida, sida, l.h));
    });
    hogaPlatser.push({ x: lador[2].x, y: 2.4, z: lador[2].z });
  }
}

// ---------------------------------------------------------------------
//  Bajsarna: guld, diamant och klocka. Alla av en sort ritas på en gång.
// ---------------------------------------------------------------------

// Sätter ihop flera former med egna färger till en form
function slaIhop(delar) {
  const bitar = delar.map(([form, farg]) => {
    const g = form.index ? form.toNonIndexed() : form;
    const n = g.attributes.position.count, c = new THREE.Color(farg), f = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) { f[i * 3] = c.r; f[i * 3 + 1] = c.g; f[i * 3 + 2] = c.b; }
    return { g: g, f: f, n: n };
  });
  const totalt = bitar.reduce((s, b) => s + b.n, 0);
  const pos = new Float32Array(totalt * 3), farg = new Float32Array(totalt * 3);
  let o = 0;
  bitar.forEach((b) => {
    pos.set(b.g.attributes.position.array, o * 3);
    farg.set(b.f, o * 3);
    o += b.n;
  });
  const ut = new THREE.BufferGeometry();
  ut.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  ut.setAttribute("color", new THREE.BufferAttribute(farg, 3));
  ut.computeVertexNormals();
  return ut;
}
function kula(radie, x, y, z, platt) {
  const g = new THREE.SphereGeometry(radie, 10, 7);
  if (platt) g.scale(1, platt, 1);
  return g.translate(x, y, z);
}

const FORMER = {
  // Guldbajs med ögon
  guld: slaIhop([
    [kula(0.4, 0, 0, 0, 0.75), 0xffc83d], [kula(0.3, 0, 0.32, 0, 0.75), 0xffc83d], [kula(0.18, 0, 0.56, 0, 0.75), 0xffc83d],
    [new THREE.ConeGeometry(0.1, 0.22, 6).translate(0, 0.72, 0), 0xffc83d],
    [kula(0.09, -0.11, 0.36, 0.25), 0xffffff], [kula(0.09, 0.11, 0.36, 0.25), 0xffffff],
    [kula(0.045, -0.11, 0.36, 0.33), 0x222222], [kula(0.045, 0.11, 0.36, 0.33), 0x222222],
  ]),
  // Diamantbajs: en bajskorv av glittrande diamant (kantiga kulor)
  diamant: slaIhop([
    [new THREE.IcosahedronGeometry(0.4, 0).scale(1, 0.75, 1), 0x6ff0ff],
    [new THREE.IcosahedronGeometry(0.3, 0).scale(1, 0.75, 1).translate(0, 0.32, 0), 0x9ff8ff],
    [new THREE.IcosahedronGeometry(0.18, 0).scale(1, 0.75, 1).translate(0, 0.56, 0), 0xc8fcff],
    [new THREE.OctahedronGeometry(0.1, 0).scale(1, 1.8, 1).translate(0, 0.75, 0), 0xffffff],
    [kula(0.09, -0.11, 0.36, 0.25), 0xffffff], [kula(0.09, 0.11, 0.36, 0.25), 0xffffff],
    [kula(0.045, -0.11, 0.36, 0.33), 0x222222], [kula(0.045, 0.11, 0.36, 0.33), 0x222222],
  ]),
  // Klocka: en röd väckarklocka (ingen bajs)
  klocka: slaIhop([
    [new THREE.CylinderGeometry(0.42, 0.42, 0.22, 16).rotateX(Math.PI / 2).translate(0, 0.35, 0), 0xe0413a],
    [new THREE.CylinderGeometry(0.34, 0.34, 0.05, 16).rotateX(Math.PI / 2).translate(0, 0.35, 0.12), 0xffffff],
    [new THREE.BoxGeometry(0.04, 0.24, 0.03).translate(0, 0.44, 0.16), 0x222222],
    [new THREE.BoxGeometry(0.18, 0.04, 0.03).translate(0.07, 0.35, 0.16), 0x222222],
    [kula(0.12, -0.26, 0.74, 0), 0xffd23f], [kula(0.12, 0.26, 0.74, 0), 0xffd23f],
    [new THREE.CylinderGeometry(0.04, 0.04, 0.2).translate(-0.25, 0.05, 0), 0x333333],
    [new THREE.CylinderGeometry(0.04, 0.04, 0.2).translate(0.25, 0.05, 0), 0x333333],
  ]),
};
const TYPER = ["guld", "diamant", "klocka"];
const KAPACITET = { guld: 120, diamant: 12, klocka: 12 };
const GLOD = { guld: 0x553300, diamant: 0x105060, klocka: 0x401010 };
const RINGFARG = { guld: 0xffc83d, diamant: 0x6ff0ff, klocka: 0xff6b5a };

const bajsMesh = {};
TYPER.forEach((typ) => {
  const glans = typ === "diamant";   // diamanten blänker mer
  const m = new THREE.MeshPhongMaterial({ vertexColors: true, flatShading: true, shininess: glans ? 160 : 80, specular: glans ? 0xffffff : 0x777777, emissive: GLOD[typ] });
  allaMaterial.push(m);
  const mesh = new THREE.InstancedMesh(FORMER[typ], m, KAPACITET[typ]);
  mesh.castShadow = true;
  mesh.count = 0;
  mesh.frustumCulled = false;
  scen.add(mesh);
  bajsMesh[typ] = mesh;
});

// Ett mjukt sken på marken under varje bajs, så att de syns på avstånd
const skenTextur = (function () {
  const bild = document.createElement("canvas");
  bild.width = bild.height = 64;
  const g = bild.getContext("2d");
  const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, "rgba(255,255,255,1)");
  grad.addColorStop(0.4, "rgba(255,255,255,0.5)");
  grad.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(bild);
})();
const skenMaterial = new THREE.MeshBasicMaterial({ map: skenTextur, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0.8 });
const sken = new THREE.InstancedMesh(new THREE.PlaneGeometry(2.4, 2.4).rotateX(-Math.PI / 2), skenMaterial, 150);
sken.count = 0;
sken.frustumCulled = false;
sken.setColorAt(0, new THREE.Color());
scen.add(sken);

let bajsar = [];   // { typ, x, y, z, tagen, forsvinner, fas }

// Gnistor när man tar en bajs
const GNISTOR = 60;
const gnistMesh = new THREE.InstancedMesh(new THREE.BoxGeometry(0.12, 0.12, 0.12), new THREE.MeshBasicMaterial({ color: 0xffffff }), GNISTOR);
gnistMesh.count = 0;
gnistMesh.frustumCulled = false;
gnistMesh.setColorAt(0, new THREE.Color());
scen.add(gnistMesh);
let gnistor = [];
function gnistra(x, y, z, farg) {
  for (let i = 0; i < 18; i++) {
    if (gnistor.length >= GNISTOR) gnistor.shift();
    const v = Math.random() * Math.PI * 2, upp = 3 + Math.random() * 4;
    gnistor.push({ x: x, y: y, z: z, vx: Math.cos(v) * (1 + Math.random() * 2), vy: upp, vz: Math.sin(v) * (1 + Math.random() * 2), liv: 0.8, farg: farg });
  }
}

// ---------------------------------------------------------------------
//  Figurerna
// ---------------------------------------------------------------------

function led(b, h, farg, x, y, foralder) {
  const fast = new THREE.Group();
  fast.position.set(x, y, 0);
  lada(b, h, b, farg, 0, -h / 2, 0, fast);
  foralder.add(fast);
  return fast;
}

// En gubbe av lådor. Framsidan (ögonen) är åt +z.
function byggGubbe(f, storlek) {
  const grupp = new THREE.Group();
  lada(0.8, 0.9, 0.5, f.trija, 0, 1.35, 0, grupp);
  const huvud = new THREE.Group();
  huvud.position.y = 2.15;
  lada(0.6, 0.6, 0.6, 0xf2c49b, 0, 0, 0, huvud);
  lada(0.12, 0.12, 0.05, 0x000000, -0.14, 0.05, 0.31, huvud);
  lada(0.12, 0.12, 0.05, 0x000000, 0.14, 0.05, 0.31, huvud);
  lada(0.66, 0.16, 0.66, f.har, 0, 0.35, 0, huvud);
  lada(0.66, 0.4, 0.14, f.har, 0, 0.1, -0.3, huvud);
  grupp.add(huvud);
  const g = {
    grupp: grupp,
    vansterArm: led(0.22, 0.8, f.trija, -0.52, 1.75, grupp),
    hogerArm: led(0.22, 0.8, f.trija, 0.52, 1.75, grupp),
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

const spelare = byggGubbe({ trija: 0xe0413a, byxor: 0x2f4f9a, har: 0x7a4a24 }, 0.85);
const rorelse = { fartY: 0, paMarken: true, vinkel: Math.PI, steg: 0, hoppMinne: 0 };

// Morfar: grått hår, skägg och hatt
const morfar = byggGubbe({ trija: 0x7a5c99, byxor: 0x5a4a3a, har: 0xdddddd }, 1);
lada(0.5, 0.3, 0.1, 0xdddddd, 0, 1.95, 0.33, morfar.grupp);
const hatt = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.35, 0.35, 8), material(0x333333));
hatt.position.y = 2.7;
morfar.grupp.add(hatt);
morfar.grupp.position.set(MORFAR_PLATS.x, 0, MORFAR_PLATS.z);
laggTillHinder(MORFAR_PLATS.x, MORFAR_PLATS.z, 0.8, 0.6, HOGT, 2.8);

// Bajsis: tre bruna kulor på varandra, med ögon
const bajsis = new THREE.Group();
(function byggBajsis() {
  const brun = material(0x7a4a24);
  [[0.75, 0.6], [0.55, 1.35], [0.35, 1.9]].forEach(([radie, y]) => {
    const k = new THREE.Mesh(new THREE.SphereGeometry(radie, 10, 7), brun);
    k.scale.y = 0.75;
    k.position.y = y;
    k.castShadow = true;
    bajsis.add(k);
  });
  const topp = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.4, 6), brun);
  topp.position.y = 2.25;
  bajsis.add(topp);
  [-0.2, 0.2].forEach((x) => {
    const oga = new THREE.Mesh(new THREE.SphereGeometry(0.14, 8, 6), material(0xffffff));
    oga.position.set(x, 1.45, 0.48);
    const pupill = new THREE.Mesh(new THREE.SphereGeometry(0.07, 6, 4), material(0x000000));
    pupill.position.set(x, 1.45, 0.6);
    bajsis.add(oga, pupill);
  });
})();
bajsis.position.set(BAJSIS_PLATS.x, 0, BAJSIS_PLATS.z);
scen.add(bajsis);
laggTillHinder(BAJSIS_PLATS.x, BAJSIS_PLATS.z, 1.2, 1.2, HOGT, 2.4);

// Pilen ovanför huvudet som visar vägen till närmaste bajs
const pil = new THREE.Group();
(function byggPil() {
  const spets = new THREE.Mesh(new THREE.ConeGeometry(0.3, 0.8, 4), material(0xffd23f, 0x553300));
  spets.rotation.x = Math.PI / 2;
  pil.add(spets);
})();
scen.add(pil);

// Snön (banan "Första snön"): ett vitt täcke, snögubbar och snöflingor som faller
const sno = new THREE.Group();
sno.visible = false;
scen.add(sno);
const snoHinder = [];
const FLINGOR = 1200;
const flingor = (function byggSno() {
  const tacke = new THREE.Mesh(new THREE.PlaneGeometry(124, 124), material(0xf4f8fc, 0x3a3e44));
  tacke.rotation.x = -Math.PI / 2;
  tacke.position.y = 0.07;
  tacke.receiveShadow = true;
  sno.add(tacke);
  [[-6, 14], [30, -10], [-30, 12], [12, -26], [-18, -36]].forEach(([x, z]) => {
    const g = new THREE.Group();
    [[0.7, 0.6], [0.5, 1.5], [0.35, 2.15]].forEach(([radie, y]) => {
      const k = new THREE.Mesh(new THREE.SphereGeometry(radie, 10, 7), material(0xffffff));
      k.position.y = y;
      k.castShadow = true;
      g.add(k);
    });
    const nasa = new THREE.Mesh(new THREE.ConeGeometry(0.07, 0.35, 6), material(0xff7a1a));
    nasa.rotation.x = Math.PI / 2;
    nasa.position.set(0, 2.15, 0.45);
    g.add(nasa);
    lada(0.08, 0.08, 0.05, 0x222222, -0.12, 2.27, 0.32, g);
    lada(0.08, 0.08, 0.05, 0x222222, 0.12, 2.27, 0.32, g);
    lada(0.5, 0.3, 0.5, 0x333333, 0, 2.6, 0, g);   // hatt
    g.position.set(x, 0, z);
    sno.add(g);
    snoHinder.push(nyttHinder(x, z, 1.3, 1.3, HOGT, 2.8));
  });
  const pos = new Float32Array(FLINGOR * 3);
  for (let i = 0; i < FLINGOR; i++) {
    pos[i * 3] = (Math.random() - 0.5) * 60;
    pos[i * 3 + 1] = Math.random() * 25;
    pos[i * 3 + 2] = (Math.random() - 0.5) * 60;
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  // Runda, mjuka flingor (samma mjuka bild som skenet under bajsarna)
  const p = new THREE.Points(g, new THREE.PointsMaterial({ color: 0xffffff, size: 0.25, map: skenTextur, transparent: true, depthWrite: false }));
  p.frustumCulled = false;
  sno.add(p);
  return p;
})();
function uppdateraSno(dt) {
  if (!sno.visible) return;
  const pos = flingor.geometry.attributes.position;
  for (let i = 0; i < FLINGOR; i++) {
    let y = pos.getY(i) - dt * (1.2 + (i % 4) * 0.25);
    if (y < 0) y += 25;
    pos.setY(i, y);
    pos.setX(i, pos.getX(i) + Math.sin(klocka + i) * dt * 0.3);
  }
  pos.needsUpdate = true;
  flingor.position.set(spelare.grupp.position.x, 0, spelare.grupp.position.z);
}

// Robotgräsklipparen (en bana): kör runt i byn och flyttar bajsarna den kör på
const robot = new THREE.Group();
lada(1.3, 0.35, 1, 0x3fa34d, 0, 0.32, 0, robot);
lada(0.9, 0.14, 0.7, 0x2f7a30, 0, 0.56, -0.05, robot);
lada(0.18, 0.12, 0.12, 0xff7a1a, 0, 0.68, 0.25, robot);
[[-0.6, -0.35], [0.6, -0.35], [-0.6, 0.35], [0.6, 0.35]].forEach(([x, z]) => {
  const hjul = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.12, 10), material(0x222222));
  hjul.rotation.z = Math.PI / 2;
  hjul.position.set(x, 0.2, z);
  robot.add(hjul);
});
robot.visible = false;
scen.add(robot);
const robotInfo = { mal: null, flyttade: 0 };
const ROBOT_REPLIKER = [
  t("Appen säger att allt går jättebra.", "The app says everything is going great."),
  t("Den har fått en uppdatering. Nu flyttar den bajsar snabbare.", "It got an update. Now it moves poops faster."),
  t("Jag har läst manualen. Alla trehundra sidor. Ingen av dem handlar om bajs.", "I read the manual. All three hundred pages. None of them are about poop."),
  t("Den var billigare än en trädgårdsmästare. Säger jag till mormor.", "It was cheaper than a gardener. That's what I tell Grandma."),
];
function uppdateraRobot(dt) {
  if (!robot.visible) return;
  const r = robot.position;
  if (!robotInfo.mal || Math.hypot(robotInfo.mal.x - r.x, robotInfo.mal.z - r.z) < 1) robotInfo.mal = markPlats(Math.random, null, []) || { x: 0, z: 0 };
  const dx = robotInfo.mal.x - r.x, dz = robotInfo.mal.z - r.z, d = Math.hypot(dx, dz) || 1;
  const nx = r.x + dx / d * 3.5 * dt, nz = r.z + dz / d * 3.5 * dt;
  if (iVagen(nx, nz, 0, 0.7)) robotInfo.mal = null;   // något i vägen: kör någon annanstans
  else r.set(nx, 0, nz);
  robot.rotation.y = Math.atan2(dx, dz);
  // Bajsar på marken som roboten kör på hamnar någon annanstans
  bajsar.forEach((b) => {
    if (b.tagen || b.y > 1 || Math.hypot(b.x - r.x, b.z - r.z) > 1.1) return;
    const ny = markPlats(runda.r, null, bajsar);
    if (!ny) return;
    gnistra(b.x, b.y, b.z, 0x3fa34d);
    b.x = ny.x;
    b.z = ny.z;
    klang([hz(48), hz(43)], 0.1, 0.12, 0.3);
    if (robotInfo.flyttade++ % 3 === 0) sag(MORFAR, ROBOT_REPLIKER[Math.floor(robotInfo.flyttade / 3) % ROBOT_REPLIKER.length]);
  });
}

// ---------------------------------------------------------------------
//  Väder: dag, dimma, kväll och snö
// ---------------------------------------------------------------------

const VADER = {
  dag: { topp: 0x3d8fe0, horisont: 0xcfeaff, dimma: 0xcfeaff, nara: 0.35, langt: 1, himmel: 0.95, sol: 1.7, solFarg: 0xfff0d0, lampa: 0x000000, glod: 1, moln: 0xffffff },
  dimma: { topp: 0xb8c4cc, horisont: 0xd8dde0, dimma: 0xd8dde0, nara: 0.03, langt: 0.3, himmel: 0.9, sol: 0.8, solFarg: 0xffffff, lampa: 0x000000, glod: 1.6, moln: 0xdddddd },
  sno: { topp: 0xaebfd0, horisont: 0xeef3f8, dimma: 0xeef3f8, nara: 0.12, langt: 0.65, himmel: 1, sol: 1.2, solFarg: 0xffffff, lampa: 0x000000, glod: 1.4, moln: 0xffffff },
  kvall: { topp: 0x0d1838, horisont: 0x3a3a6a, dimma: 0x1a2040, nara: 0.2, langt: 0.8, himmel: 0.5, sol: 0.45, solFarg: 0x8aa0ff, lampa: 0xffd060, glod: 3, moln: 0x444466 },
};
function stallVader(namn) {
  const v = VADER[namn] || VADER.dag;
  himmel.material.uniforms.topp.value.setHex(v.topp);
  himmel.material.uniforms.horisont.value.setHex(v.horisont);
  scen.fog.color.setHex(v.dimma);
  scen.fog.near = INSTALLNINGAR.sikt * v.nara;
  scen.fog.far = INSTALLNINGAR.sikt * v.langt;
  himmelsljus.intensity = v.himmel;
  sol.intensity = v.sol;
  sol.color.setHex(v.solFarg);
  lampMaterial.emissive.setHex(v.lampa);
  TYPER.forEach((typ) => bajsMesh[typ].material.emissive.setHex(GLOD[typ]).multiplyScalar(v.glod));
  skenMaterial.opacity = Math.min(1, 0.6 * v.glod);
  moln.forEach((g) => g.children.forEach((b) => b.material.color.setHex(v.moln)));
  // Snö: vitt täcke och frusen damm
  sno.visible = namn === "sno";
  damm.position.y = sno.visible ? 0.09 : 0.05;
  vattenMaterial.color.setHex(sno.visible ? 0xc8e8f8 : 0x3d8fd6);
}

// ---------------------------------------------------------------------
//  Ljud och tal
// ---------------------------------------------------------------------

let ljud = null, eko = null;
function startaLjud() {
  try {
    if (!ljud) {
      ljud = new (window.AudioContext || window.webkitAudioContext)();
      // Ett kort eko gör plingen mjukare och rundare
      eko = ljud.createDelay(1);
      eko.delayTime.value = 0.16;
      const tillbaka = ljud.createGain(), mork = ljud.createBiquadFilter();
      tillbaka.gain.value = 0.3;
      mork.type = "lowpass";
      mork.frequency.value = 2500;
      eko.connect(mork);
      mork.connect(tillbaka);
      tillbaka.connect(eko);
      mork.connect(ljud.destination);
    }
    Musik.lasUpp(ljud);   // startar ljudet, och gör att det hörs även när iPaden står på ljudlöst
  } catch (e) {
    ljud = null;   // Inget ljud – spelet fungerar ändå
  }
}
// iPad och Xbox startar ljudet först när man har tryckt någonstans
["pointerdown", "touchend", "keydown"].forEach((h) => document.addEventListener(h, startaLjud, true));

// En mjuk klockton: grundton och en svag överton som klingar ut, med eko
function klang(toner, mellanrum, volym, langd) {
  if (!ljud) return;
  toner.forEach((frekvens, nr) => {
    const start = ljud.currentTime + 0.01 + nr * mellanrum;
    [[1, 1], [3, 0.12]].forEach(([gange, andel]) => {
      const osc = ljud.createOscillator(), v = ljud.createGain(), till = ljud.createGain();
      osc.type = "sine";
      osc.frequency.value = frekvens * gange;
      v.gain.setValueAtTime(0.0001, start);
      v.gain.exponentialRampToValueAtTime(volym * andel, start + 0.008);
      v.gain.exponentialRampToValueAtTime(0.0001, start + langd * (gange === 1 ? 1 : 0.5));
      till.gain.value = 0.35;
      osc.connect(v);
      v.connect(ljud.destination);
      v.connect(till).connect(eko);
      osc.start(start);
      osc.stop(start + langd + 0.05);
    });
  });
}
function hz(ton) {
  return 440 * Math.pow(2, (ton - 69) / 12);
}
// Plingen går ett steg upp i en glad skala för varje bajs man tar i rad
const SKALA = [72, 74, 76, 79, 81, 84, 86, 88];
let iRad = 0, senastTagen = -10;
const LJUD = {
  guld: () => {
    iRad = speltid - senastTagen < 3 ? Math.min(iRad + 1, SKALA.length - 1) : 0;
    senastTagen = speltid;
    const ton = SKALA[iRad];
    klang([hz(ton), hz(ton + 7)], 0.07, 0.16, 0.8);
  },
  diamant: () => klang([79, 84, 88, 91, 96].map(hz), 0.06, 0.13, 1),
  klocka: () => klang([hz(84), hz(79), hz(84), hz(79)], 0.12, 0.1, 0.25),
  hopp: () => klang([hz(67)], 0, 0.05, 0.18),
  tick: () => klang([hz(93)], 0, 0.07, 0.12),
  nedrakning: () => klang([hz(72)], 0, 0.14, 0.5),
  kor: () => klang([hz(72), hz(76), hz(79), hz(84)], 0.05, 0.13, 0.9),
  vinst: () => klang([72, 76, 79, 84, 88, 91].map(hz), 0.09, 0.14, 1.1),
  slut: () => klang([79, 76, 72].map(hz), 0.15, 0.12, 0.8),
};

const harTal = "speechSynthesis" in window;
if (harTal) speechSynthesis.getVoices();   // Safari börjar ladda rösterna först när man frågar
const MORFAR = { namn: t("👴 Morfar", "👴 Grandpa"), rostlage: 0.8, tempo: 0.9, rostNummer: 1 };
const BAJSIS = { namn: t("💩 Bajsis", "💩 Poopsie"), rostlage: 1.6, tempo: 1.15, rostNummer: 0 };
const bubbla = document.getElementById("bubbla");
let bubblaTid = 0;

// Läser upp utan emojis (annars säger rösten namnet på dem)
function utanEmoji(text) {
  return text.replace(/[☀-➿️‍]|[\uD83C-\uDBFF][\uDC00-\uDFFF]/g, "").trim();
}
function sag(vem, text) {
  document.getElementById("vemPratar").textContent = vem.namn;
  document.getElementById("repliken").textContent = text;
  bubbla.hidden = false;
  bubblaTid = Math.max(2.5, text.length * 0.07);
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
  if (harTal) speechSynthesis.cancel();
  bubbla.hidden = true;
  bubblaTid = 0;
}
const HEJA = [t("Bra!", "Nice!"), t("Där var en!", "There's one!"), t("Du är bäst!", "You're the best!"),
  t("Prutt! Jag menar: snyggt!", "Toot! I mean: great!"), t("Wow!", "Wow!"), t("Fortsätt så!", "Keep going!")];

// ---------------------------------------------------------------------
//  Sparat på enheten: stjärnor och bästa resultat
// ---------------------------------------------------------------------

function las(namn, standard) {
  try { return JSON.parse(localStorage.getItem(namn)) || standard; } catch (e) { return standard; }
}
function spara(namn, varde) {
  try { localStorage.setItem(namn, JSON.stringify(varde)); } catch (e) { /* går inte – gäller tills sidan laddas om */ }
}
let stjarnor = las("bajsbyn-stjarnor", []);   // bästa antal ⭐ per bana
let basta = las("bajsbyn-basta", {});         // bästa resultat i jakten och kedjan

// ---------------------------------------------------------------------
//  Styrning: tangentbord, touch och handkontroll
// ---------------------------------------------------------------------

const tangenter = {};
window.addEventListener("keydown", (e) => {
  tangenter[e.code] = true;
  if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space"].indexOf(e.code) >= 0 && lage === "spelar") e.preventDefault();
  if (e.repeat) return;
  if (e.code === "KeyP" || e.code === "Escape") {
    if (lage === "spelar") pausa();
    else if (lage === "paus") fortsatt();
  }
});
window.addEventListener("keyup", (e) => { tangenter[e.code] = false; });

const harTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
const joystick = document.getElementById("joystick");
const pinne = document.getElementById("pinne");
const hoppknapp = document.getElementById("hopp");
const spak = { x: 0, y: 0, finger: null };
let touchHopp = false;

function flyttaSpak(touch) {
  const r = joystick.getBoundingClientRect();
  const radie = r.width / 2;
  let dx = (touch.clientX - (r.left + radie)) / radie;
  let dy = (touch.clientY - (r.top + radie)) / radie;
  const langd = Math.sqrt(dx * dx + dy * dy);
  if (langd > 1) { dx /= langd; dy /= langd; }
  spak.x = dx;
  spak.y = dy;
  pinne.style.transform = "translate(" + dx * radie * 0.6 + "px," + dy * radie * 0.6 + "px)";
}
function slappTouch() {
  spak.x = spak.y = 0;
  spak.finger = null;
  pinne.style.transform = "";
  touchHopp = false;
  hoppknapp.classList.remove("tryckt");
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
  for (const touch of e.changedTouches) {
    if (touch.identifier === spak.finger) {
      spak.x = spak.y = 0;
      spak.finger = null;
      pinne.style.transform = "";
    }
  }
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
let kameraDrag = null;
let senastManuellKamera = -10;
let kameraVinkel = 0;
let speltid = 0;
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

function lasStyrning() {
  let x = 0, y = 0, sving = 0, hopp = false, paus = false, valj = false, navX = 0, navY = 0;
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
  const alla = navigator.getGamepads ? Array.prototype.slice.call(navigator.getGamepads()) : [];
  alla.filter((k) => k).forEach((k) => {
    const axel = (i) => {
      const v = k.axes[i] || 0;
      return Math.abs(v) > INSTALLNINGAR.dodzon ? v : 0;
    };
    const tryckt = (i) => !!(k.buttons[i] && k.buttons[i].pressed);
    if (k.buttons.some((b) => b.pressed)) {
      anvanderHandkontroll = true;
      if (!ljud || ljud.state !== "running") startaLjud();
    }
    x += axel(0);
    y += axel(1);
    sving -= axel(2);
    if (tryckt(12)) { y -= 1; navY -= 1; }
    if (tryckt(13)) { y += 1; navY += 1; }
    if (tryckt(14)) { x -= 1; navX -= 1; }
    if (tryckt(15)) { x += 1; navX += 1; }
    if (Math.abs(axel(0)) > 0.6) navX += Math.sign(axel(0));
    if (Math.abs(axel(1)) > 0.6) navY += Math.sign(axel(1));
    if (tryckt(0)) { hopp = true; valj = true; }   // A
    if (tryckt(9)) paus = true;                    // Start/Meny
  });
  const langd = Math.sqrt(x * x + y * y);
  if (langd > 1) { x /= langd; y /= langd; }
  const nav = (nyttTryck("hoger", navX > 0 || navY > 0) ? 1 : 0) - (nyttTryck("vanster", navX < 0 || navY < 0) ? 1 : 0);
  return {
    x: x, y: y, sving: Math.max(-1, Math.min(1, sving)),
    hoppNytt: nyttTryck("hopp", hopp),
    pausNytt: nyttTryck("paus", paus),
    valjNytt: nyttTryck("valj", valj),
    nav: nav,
  };
}

// Handkontrollen i menyerna: styrkorset flyttar, A väljer
let menyFokus = 0;
function synligaKnappar() {
  const rutor = [document.querySelector(".tl-bakgrund"), document.getElementById("slutruta"), document.getElementById("pausmeny"),
    document.getElementById("banruta"), document.getElementById("startruta")];
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
  if (!knappar) return false;
  if (!anvanderHandkontroll) return true;
  if (styr.nav) menyFokus += styr.nav;
  menyFokus = ((menyFokus % knappar.length) + knappar.length) % knappar.length;
  document.querySelectorAll(".fokus").forEach((k) => k.classList.remove("fokus"));
  knappar[menyFokus].classList.add("fokus");
  if (styr.nav) knappar[menyFokus].scrollIntoView({ block: "nearest" });
  if (styr.valjNytt) {
    knappar[menyFokus].click();
    menyFokus = 0;
  }
  return true;
}
const knapphjalp = document.getElementById("knapphjalp");
function harHandkontroll() {
  if (anvanderHandkontroll) return true;
  const alla = navigator.getGamepads ? navigator.getGamepads() : [];
  for (let i = 0; i < alla.length; i++) if (alla[i]) return true;
  return false;
}

// ---------------------------------------------------------------------
//  Menyerna: läge, bana, paus och slut
// ---------------------------------------------------------------------

let lage = "meny";   // "meny", "nedrakning", "spelar", "paus" eller "slut"
let runda = null;    // det som gäller i rundan just nu

const hud = document.getElementById("hud");
const raknare = document.getElementById("raknare");
const uppdragRuta = document.getElementById("uppdrag");
const nedrakningRuta = document.getElementById("nedrakning");
const pausKnapp = document.getElementById("paus");
const startruta = document.getElementById("startruta");
const banruta = document.getElementById("banruta");
const pausmeny = document.getElementById("pausmeny");
const slutruta = document.getElementById("slutruta");

function visaRuta(ruta) {
  [startruta, banruta, pausmeny, slutruta].forEach((r) => { r.hidden = r !== ruta; });
  menyFokus = 0;
}

function visaLagen() {
  const lista = document.getElementById("lagen");
  lista.innerHTML = "";
  Object.keys(LAGEN).forEach((id) => {
    const l = LAGEN[id];
    const kort = document.createElement("button");
    kort.type = "button";
    kort.className = "lageskort l-" + id;
    kort.innerHTML = '<span class="ikon"></span><span class="namn"></span><span class="om"></span><span class="basta"></span>';
    kort.querySelector(".ikon").textContent = l.ikon;
    kort.querySelector(".namn").textContent = l.namn;
    kort.querySelector(".om").textContent = l.om;
    let b = "";
    if (id === "banor") b = "⭐ " + stjarnor.reduce((s, n) => s + (n || 0), 0) + "/" + BANOR.length * 3;
    if (id === "jakt" && basta.jakt) b = t("Bäst: ", "Best: ") + basta.jakt + t(" poäng", " points");
    if (id === "kedja" && basta.kedja) b = t("Bäst: ", "Best: ") + basta.kedja + t(" i rad", " in a row");
    kort.querySelector(".basta").textContent = b;
    kort.addEventListener("click", () => {
      startaLjud();
      if (id === "banor") visaBanor();
      else startaRunda(id, null);
    });
    lista.appendChild(kort);
  });
  visaRuta(startruta);
  lage = "meny";
}

function visaBanor() {
  const lista = document.getElementById("banor");
  lista.innerHTML = "";
  BANOR.forEach((b, nr) => {
    const oppen = nr === 0 || (stjarnor[nr - 1] || 0) > 0;
    const knapp = document.createElement("button");
    knapp.type = "button";
    knapp.className = "banknapp" + (oppen ? "" : " last");
    knapp.innerHTML = '<span class="nr"></span><span class="stjarnor"></span>';
    knapp.querySelector(".nr").textContent = oppen ? String(nr + 1) : "🔒";
    const n = stjarnor[nr] || 0;
    knapp.querySelector(".stjarnor").textContent = "⭐".repeat(n) + "☆".repeat(3 - n);
    knapp.setAttribute("aria-label", t("Bana ", "Level ") + (nr + 1) + ": " + b.namn);
    knapp.addEventListener("click", () => {
      if (!oppen) {
        document.getElementById("banInfo").textContent = t("Klara bana " + nr + " först!", "Finish level " + nr + " first!");
        return;
      }
      startaRunda("banor", nr);
    });
    lista.appendChild(knapp);
  });
  document.getElementById("banInfo").textContent = t("Klara en bana för att låsa upp nästa. Ju mer tid som är kvar, desto fler stjärnor!",
    "Finish a level to unlock the next. The more time left, the more stars!");
  visaRuta(banruta);
}

// Musiken på/av
const musikKnappar = document.querySelectorAll(".musikknapp");
function visaMusikKnapp() {
  musikKnappar.forEach((k) => { k.textContent = Musik.arPa() ? t("🎵 Musik: på", "🎵 Music: on") : t("🔇 Musik: av", "🔇 Music: off"); });
}
musikKnappar.forEach((k) => k.addEventListener("click", () => { Musik.vaxla(); visaMusikKnapp(); }));
visaMusikKnapp();

document.querySelectorAll(".tillLagen").forEach((k) => k.addEventListener("click", () => {
  tystna();
  avslutaRunda();
  visaLagen();
}));
document.querySelectorAll(".igenKnapp").forEach((k) => k.addEventListener("click", () => startaRunda(runda.lageId, runda.bana)));
document.getElementById("nastaBana").addEventListener("click", () => startaRunda("banor", runda.bana + 1));
document.getElementById("fortsatt").addEventListener("click", fortsatt);
pausKnapp.addEventListener("click", pausa);
document.addEventListener("visibilitychange", () => { if (document.hidden) pausa(); });

function pausa() {
  if (lage !== "spelar") return;
  lage = "paus";
  tystna();
  visaRuta(pausmeny);
  slappTouch();
  Musik.paus(true);
}
function fortsatt() {
  if (lage !== "paus") return;
  lage = "spelar";
  pausmeny.hidden = true;
  Musik.paus(false);
}

function visaSpelknappar(synlig) {
  hud.hidden = !synlig;
  pausKnapp.hidden = !synlig;
  joystick.hidden = hoppknapp.hidden = !(synlig && harTouch);
}
function avslutaRunda() {
  visaSpelknappar(false);
  nedrakningRuta.hidden = true;
  Musik.tempo(96);
}

// ---------------------------------------------------------------------
//  En runda
// ---------------------------------------------------------------------

// Hittar en ledig plats på marken. omrade: "nara", "kant" eller inget.
function markPlats(r, omrade, upptagna, kring) {
  const s = INSTALLNINGAR.storlek - 3;
  for (let forsok = 0; forsok < 400; forsok++) {
    let x, z;
    if (kring) {
      // Kedjan: en bit bort från spelaren
      const v = r() * Math.PI * 2, d = kring.min + r() * (kring.max - kring.min);
      x = kring.x + Math.cos(v) * d;
      z = kring.z + Math.sin(v) * d;
    } else {
      x = (r() * 2 - 1) * s;
      z = (r() * 2 - 1) * s;
    }
    if (Math.abs(x) > s || Math.abs(z) > s) continue;
    const d = Math.hypot(x, z);
    if (omrade === "nara" && d > 26) continue;
    if (omrade === "kant" && d < 38) continue;
    if (Math.hypot(x - START.x, z - START.z) < 5) continue;
    if (Math.hypot(x - DAMM.x, z - DAMM.z) < DAMM.radie + 1) continue;
    if (!ledigPlats(x, z, 1)) continue;
    if (upptagna.some((p) => Math.hypot(p.x - x, p.z - z) < 3)) continue;
    return { x: x, y: 0.45, z: z };
  }
  return null;
}

// Lägger ut bajsar: guld, diamanter och klockor
function laggUt(def, r) {
  bajsar = [];
  const lediga = hogaPlatser.slice();
  const lagg = (typ, antal) => {
    for (let i = 0; i < antal; i++) {
      let plats = null;
      if (lediga.length && r() < (def.hoga || 0)) {
        const hog = lediga.splice(Math.floor(r() * lediga.length), 1)[0];
        plats = { x: hog.x, y: hog.y + 0.45, z: hog.z };
      }
      if (!plats) plats = markPlats(r, def.omrade, bajsar);
      if (plats) bajsar.push({ typ: typ, x: plats.x, y: plats.y, z: plats.z, tagen: false, forsvinner: 0, fas: r() * 6 });
    }
  };
  lagg("diamant", def.diamanter || 0);
  lagg("klocka", def.klockor || 0);
  lagg("guld", def.guld || 0);
}

function startaRunda(lageId, bana) {
  startaLjud();
  tystna();
  const def = lageId === "banor" ? BANOR[bana] : LAGEN[lageId];
  const fro = Math.floor(Math.random() * 1e9);
  const r = slump(fro);
  runda = {
    lageId: lageId, bana: bana, def: def, r: r,
    poang: 0, guld: 0, diamanter: 0, klockor: 0, kedja: 0,
    tid: lageId === "kedja" ? def.startTid : (def.tid || null), startTid: lageId === "kedja" ? def.startTid : (def.tid || null),
    tid0: 0, forraSekund: 99,
  };
  stallVader(def.vader || "dag");
  // Spelaren börjar på torget, med Morfar framför sig
  spelare.grupp.position.set(START.x, 0, START.z);
  rorelse.fartY = 0;
  rorelse.vinkel = Math.PI;
  kameraVinkel = 0;
  byggTorn(def.torn !== undefined ? def.torn : 6, r);
  if (lageId === "kedja") {
    bajsar = [];
    nastaILedet();
  } else {
    laggUt(def, r);
  }
  robot.visible = !!def.robot;
  robot.position.set(10, 0, 10);
  robotInfo.mal = null;
  robotInfo.flyttade = 0;
  placeraKamera(1, true);
  visaRuta(null);
  visaSpelknappar(true);
  Musik.starta(ljud);
  Musik.paus(false);
  Musik.tempo(96);
  // Morfar (eller Bajsis) berättar uppdraget, sedan 3, 2, 1, KÖR!
  const text = lageId === "banor" ? t("Bana ", "Level ") + (bana + 1) + ": " + def.text
    : lageId === "jakt" ? t("Jag har tappat hundra guldbajsar! Hur många hinner du hitta?", "I've dropped a hundred golden poops! How many can you find?")
      : lageId === "kedja" ? t("Hinn till nästa guldbajs innan tiden tar slut! Varje bajs ger mer tid.", "Reach the next golden poop before time runs out! Each one gives you more time.")
        : t("Ingen brådska! Leta i lugn och ro.", "No rush! Take your time.");
  sag(lageId === "lugnt" ? BAJSIS : MORFAR, text);
  visaHud();
  lage = "nedrakning";
  nedTid = lageId === "lugnt" ? 0.01 : 3.99;
  forraNed = 4;
}

// Kedjan: lägger ut nästa bajs en bit bort
function nastaILedet() {
  const n = runda.kedja;
  const p = spelare.grupp.position;
  const avstand = Math.min(42, 10 + n * 1.6);
  let plats = null;
  if (n >= 5 && hogaPlatser.length && runda.r() < 0.3) {
    const mojliga = hogaPlatser.filter((h) => Math.hypot(h.x - p.x, h.z - p.z) > avstand * 0.5);
    if (mojliga.length) {
      const h = mojliga[Math.floor(runda.r() * mojliga.length)];
      plats = { x: h.x, y: h.y + 0.45, z: h.z };
    }
  }
  if (!plats) plats = markPlats(runda.r, null, [], { x: p.x, z: p.z, min: avstand * 0.7, max: avstand });
  if (!plats) plats = markPlats(runda.r, null, []);
  const typ = n > 0 && n % 7 === 0 ? "diamant" : "guld";
  bajsar = [{ typ: typ, x: plats.x, y: plats.y, z: plats.z, tagen: false, forsvinner: 0, fas: 0 }];
}

let nedTid = 0, forraNed = 4;
function uppdateraNedrakning(dt) {
  nedTid -= dt;
  const sekund = Math.ceil(nedTid);
  if (sekund !== forraNed && sekund >= 1) {
    forraNed = sekund;
    nedrakningRuta.textContent = String(sekund);
    nedrakningRuta.hidden = false;
    nedrakningRuta.classList.remove("puls");
    void nedrakningRuta.offsetWidth;
    nedrakningRuta.classList.add("puls");
    LJUD.nedrakning();
  }
  if (nedTid <= 0) {
    lage = "spelar";
    if (runda.lageId !== "lugnt") {
      nedrakningRuta.textContent = t("KÖR!", "GO!");
      nedrakningRuta.classList.remove("puls");
      void nedrakningRuta.offsetWidth;
      nedrakningRuta.classList.add("puls");
      LJUD.kor();
      setTimeout(() => { nedrakningRuta.hidden = true; }, 800);
    }
  }
}

function tidText(sekunder, decimal) {
  if (decimal && sekunder < 10) return sekunder.toFixed(1);
  const s = Math.max(0, Math.ceil(sekunder));
  return Math.floor(s / 60) + ":" + (s % 60 < 10 ? "0" : "") + (s % 60);
}

// Hur många som behövs för att klara banan
function kravet() {
  const d = runda.def;
  if (runda.lageId === "banor" && d.krav === "diamanter") return { har: runda.diamanter, av: d.diamanter, ikon: "💎" };
  if (runda.lageId === "banor" || runda.lageId === "lugnt") return { har: runda.guld, av: d.guld, ikon: "💩" };
  return null;
}

function visaHud() {
  const k = kravet();
  let text = runda.lageId === "kedja" ? "🔗 " + runda.kedja : k ? k.ikon + " " + k.har + "/" + k.av : "💩 " + runda.poang;
  let html = "";
  if (runda.tid !== null) {
    const bratt = runda.tid <= 5;
    html = ' &nbsp; <span class="tid' + (bratt ? " brattom" : "") + '">⏱ ' + tidText(runda.tid, runda.lageId === "kedja") + "</span>";
  }
  const nyckel = text + html;
  if (raknare.dataset.text !== nyckel) {
    raknare.dataset.text = nyckel;
    raknare.textContent = text;
    if (html) raknare.insertAdjacentHTML("beforeend", html);
  }
  const uppdrag = runda.lageId === "banor" ? (runda.bana + 1) + ". " + runda.def.namn
    : runda.lageId === "jakt" ? t("Ta så många du hinner!", "Grab as many as you can!")
      : runda.lageId === "kedja" ? t("Hinn till nästa!", "Reach the next one!") : t("Leta i lugn och ro", "Take your time");
  if (uppdragRuta.textContent !== uppdrag) uppdragRuta.textContent = uppdrag;
}

// "+1" som hoppar upp där bajsen var
const skarmPunkt = new THREE.Vector3();
function plopp(text, b) {
  skarmPunkt.set(b.x, b.y + 0.8, b.z).project(kamera);
  const el = document.createElement("div");
  el.className = "plopp";
  el.textContent = text;
  el.style.left = ((skarmPunkt.x + 1) / 2 * window.innerWidth) + "px";
  el.style.top = ((1 - skarmPunkt.y) / 2 * window.innerHeight) + "px";
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 900);
}

function taBajs(b) {
  b.tagen = true;
  b.forsvinner = 0.35;
  gnistra(b.x, b.y + 0.4, b.z, RINGFARG[b.typ]);
  if (b.typ === "guld") {
    runda.guld++;
    runda.poang += INSTALLNINGAR.vardeGuld;
    LJUD.guld();
    plopp("+" + INSTALLNINGAR.vardeGuld, b);
  } else if (b.typ === "diamant") {
    runda.diamanter++;
    runda.poang += INSTALLNINGAR.vardeDiamant;
    LJUD.diamant();
    plopp("💎 +" + INSTALLNINGAR.vardeDiamant, b);
  } else {
    runda.klockor++;
    if (runda.tid !== null) runda.tid += INSTALLNINGAR.klockTid;
    LJUD.klocka();
    plopp("⏰ +" + INSTALLNINGAR.klockTid + "s", b);
  }
  if (runda.lageId === "lugnt") sag(BAJSIS, HEJA[Math.floor(Math.random() * HEJA.length)]);
  if (runda.lageId === "kedja") {
    // Mer tid för varje bajs, men lite mindre ju längre kedjan blir
    const n = runda.kedja;
    runda.kedja++;
    runda.tid = Math.min(runda.def.maxTid, runda.tid + Math.max(3, 7 - n * 0.2));
    nastaILedet();
  }
}

function kollaSlut() {
  const k = kravet();
  if (k && k.har >= k.av) return slut(true);
  if (runda.lageId === "jakt" && bajsar.every((b) => b.tagen)) return slut(true);
  if (runda.tid !== null && runda.tid <= 0) return slut(runda.lageId !== "banor");
  return false;
}

function slut(klarade) {
  lage = "slut";
  avslutaRunda();
  hud.hidden = false;
  const titel = document.getElementById("sluttitel");
  const textRuta = document.getElementById("slutText");
  const stjarnRuta = document.getElementById("slutStjarnor");
  const nasta = document.getElementById("nastaBana");
  const tl = document.getElementById("slutTopplista");
  stjarnRuta.innerHTML = "";
  nasta.hidden = true;
  tl.hidden = true;
  if (runda.lageId === "banor") {
    let n = 0;
    if (klarade) {
      const kvar = runda.tid / runda.startTid;
      n = kvar >= INSTALLNINGAR.stjarnor[1] ? 3 : kvar >= INSTALLNINGAR.stjarnor[0] ? 2 : 1;
      if (n > (stjarnor[runda.bana] || 0)) {
        stjarnor[runda.bana] = n;
        spara("bajsbyn-stjarnor", stjarnor);
      }
      nasta.hidden = runda.bana >= BANOR.length - 1;
      // Sista banan: alla stjärnor man har samlat går till topplistan
      // (inte efter varje bana, annars fyller ett barn hela listan)
      if (runda.bana === BANOR.length - 1) {
        Topplista.nyttResultat("bajsbanor", stjarnor.reduce((summa, n) => summa + (n || 0), 0), { fordrojning: 1.5 });
      }
    }
    tl.dataset.topplista = "bajsbanor";
    tl.hidden = false;
    for (let i = 0; i < 3; i++) stjarnRuta.insertAdjacentHTML("beforeend", i < n ? "<span>⭐</span>" : '<span class="tom">⭐</span>');
    titel.textContent = klarade ? t("🎉 Bana klar!", "🎉 Level complete!") : t("⏱ Tiden tog slut!", "⏱ Time's up!");
    textRuta.textContent = klarade
      ? (n === 3 ? t("Tre stjärnor! Morfar är jättestolt.", "Three stars! Grandpa is very proud.") : t("Bra jobbat! Försök igen för fler stjärnor.", "Well done! Try again for more stars."))
        + (runda.bana === BANOR.length - 1 ? t(" Du har klarat alla banor!", " You've finished every level!") : "")
      : t("Försök igen. Följ den gula pilen!", "Try again. Follow the yellow arrow!");
    sag(MORFAR, klarade ? t("Tack snälla du!", "Thank you so much!") : t("Nästan! Vi försöker igen.", "So close! Let's try again."));
    if (klarade) LJUD.vinst(); else LJUD.slut();
  } else if (runda.lageId === "jakt" || runda.lageId === "kedja") {
    const id = runda.lageId;
    const resultat = id === "jakt" ? runda.poang : runda.kedja;
    const rekord = resultat > (basta[id] || 0);
    if (rekord) {
      basta[id] = resultat;
      spara("bajsbyn-basta", basta);
    }
    titel.textContent = rekord ? t("🏆 Nytt rekord!", "🏆 New record!") : t("⏱ Tiden är ute!", "⏱ Time's up!");
    textRuta.textContent = id === "jakt"
      ? t("Du hittade " + runda.guld + " guldbajsar och " + runda.diamanter + " diamanter och fick " + resultat + " poäng!",
        "You found " + runda.guld + " golden poops and " + runda.diamanter + " diamonds and scored " + resultat + " points!")
      : t("Du klarade " + resultat + " i rad!", "You got " + resultat + " in a row!");
    const spelId = id === "jakt" ? "bajsjakt" : "bajskedja";
    tl.dataset.topplista = spelId;
    tl.hidden = false;
    LJUD.vinst();
    if (resultat > 0) Topplista.nyttResultat(spelId, resultat, { fordrojning: 1.2 });
  } else {
    titel.textContent = t("🌼 Alla hittade!", "🌼 All found!");
    textRuta.textContent = t("Bajsis är jättestolt. Vill du leta i en ny by?", "Poopsie is very proud. Want to search a new village?");
    sag(BAJSIS, t("Du hittade alla! Prutt av glädje!", "You found them all! A happy toot!"));
    LJUD.vinst();
  }
  visaRuta(slutruta);
  return true;
}

// ---------------------------------------------------------------------
//  Varje bildruta
// ---------------------------------------------------------------------

function styrSpelaren(dt, styr) {
  const pos = spelare.grupp.position;
  const fart = Math.sqrt(styr.x * styr.x + styr.y * styr.y);
  const radie = 0.4;
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
    const grans = INSTALLNINGAR.storlek - 0.8;
    if (!iVagen(nyX, pos.z, pos.y, radie)) pos.x = Math.max(-grans, Math.min(grans, nyX));
    if (!iVagen(pos.x, nyZ, pos.y, radie)) pos.z = Math.max(-grans, Math.min(grans, nyZ));
    let skillnad = riktning - rorelse.vinkel;
    skillnad = Math.atan2(Math.sin(skillnad), Math.cos(skillnad));
    rorelse.vinkel += skillnad * Math.min(1, dt * 12);
    rorelse.steg += dt * 12 * fart;
    // Kameran svänger långsamt in bakom (om man inte nyss vridit den själv)
    if (speltid - senastManuellKamera > 1.5) {
      let k = rorelse.vinkel - kameraVinkel;
      k = Math.atan2(Math.sin(k), Math.cos(k));
      kameraVinkel += k * Math.min(1, dt * 1.2 * fart);
    }
  }
  spelare.grupp.rotation.y = rorelse.vinkel + Math.PI;
  // Hopp och tyngdkraft (trycker man precis innan man landar hoppar man ändå)
  if (styr.hoppNytt) rorelse.hoppMinne = 0.15;
  rorelse.hoppMinne -= dt;
  if (rorelse.hoppMinne > 0 && rorelse.paMarken) {
    rorelse.hoppMinne = 0;
    rorelse.fartY = INSTALLNINGAR.hoppfart;
    rorelse.paMarken = false;
    LJUD.hopp();
  }
  const fotForut = pos.y;
  rorelse.fartY -= INSTALLNINGAR.tyngdkraft * dt;
  pos.y += rorelse.fartY * dt;
  const golv = golvhojd(pos.x, pos.z, fotForut, radie);
  rorelse.paMarken = false;
  if (pos.y <= golv) {
    pos.y = golv;
    rorelse.fartY = 0;
    rorelse.paMarken = true;
  }
  svingaArmarOchBen(spelare, fart > 0.05 ? Math.sin(rorelse.steg) * 0.8 * fart : 0);
  if (!rorelse.paMarken) spelare.vansterArm.rotation.x = spelare.hogerArm.rotation.x = Math.PI * 0.9;
}

// Står ett hus mellan spelaren och kameran? Svarar hur stor del av vägen som är fri (0–1).
function friSikt(fran, till) {
  for (let i = 1; i <= 16; i++) {
    const a = i / 16;
    const x = fran.x + (till.x - fran.x) * a, z = fran.z + (till.z - fran.z) * a;
    const y = fran.y + 1.4 + (till.y - fran.y - 1.4) * a;
    for (const h of hinder) {
      // Trädens kronor är mycket bredare än stammen (stolparna är bara smala)
      if (h.hb < 0.5 || h.hd < 0.5) {
        if (h.hojd >= 5 && y > 1.5 && y < h.hojd + 0.4 && overlappar(x, z, h, 1.4)) return Math.max(0.15, (i - 1) / 16);
        continue;
      }
      if (y < h.hojd + 0.4 && overlappar(x, z, h, 0.4)) return Math.max(0.15, (i - 1) / 16);
    }
  }
  return 1;
}

const kameraMal = new THREE.Vector3();
function placeraKamera(dt, direkt) {
  const pos = spelare.grupp.position;
  kameraMal.set(
    pos.x + Math.sin(kameraVinkel) * INSTALLNINGAR.kameraAvstand,
    pos.y * 0.6 + INSTALLNINGAR.kameraHojd,
    pos.z + Math.cos(kameraVinkel) * INSTALLNINGAR.kameraAvstand
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
  himmel.position.copy(kamera.position);
  sol.position.set(pos.x + 30, 50, pos.z + 20);
  sol.target.position.copy(pos);
}

function uppdatera(dt, styr) {
  speltid += dt;
  styrSpelaren(dt, styr);
  uppdateraRobot(dt);
  const p = spelare.grupp.position;

  // Tiden
  if (runda.tid !== null) {
    runda.tid = Math.max(0, runda.tid - dt);
    const sekund = Math.ceil(runda.tid);
    if (sekund <= 5 && sekund !== runda.forraSekund && sekund > 0) LJUD.tick();
    runda.forraSekund = sekund;
    Musik.tempo(runda.tid < 10 ? 116 : 96);
  }

  // Ta bajsar
  bajsar.forEach((b) => {
    if (b.tagen) return;
    if (Math.hypot(p.x - b.x, p.y + 0.8 - b.y, p.z - b.z) < INSTALLNINGAR.plockAvstand + 0.4) taBajs(b);
  });
  visaHud();
  if (kollaSlut()) return;

  // Pilen pekar mot närmaste bajs
  let mal = null, narmast = Infinity;
  bajsar.forEach((b) => {
    if (b.tagen) return;
    const d = Math.hypot(b.x - p.x, b.z - p.z);
    if (d < narmast) { narmast = d; mal = b; }
  });
  pil.visible = !!mal && narmast > 2;
  if (mal) {
    pil.position.set(p.x, p.y + 3 + Math.sin(speltid * 4) * 0.1, p.z);
    pil.rotation.y = Math.atan2(mal.x - p.x, mal.z - p.z);
  }
  placeraKamera(dt);
}

// Sådant som rör sig hela tiden: bajsarna snurrar, gnistor, moln ...
let klocka = 0;
const matris = new THREE.Matrix4(), q = new THREE.Quaternion(), skala = new THREE.Vector3(), plats = new THREE.Vector3(), upp = new THREE.Vector3(0, 1, 0);
const farg = new THREE.Color();
function animera(dt) {
  klocka += dt;
  const antal = { guld: 0, diamant: 0, klocka: 0 };
  let skenAntal = 0;
  bajsar.forEach((b) => {
    let s = 1, y = b.y + Math.sin(klocka * 3 + b.fas) * 0.12;
    if (b.tagen) {
      if (b.forsvinner <= 0) return;
      b.forsvinner -= dt;
      s = Math.max(0, b.forsvinner / 0.35) * 1.5;
      y += (1 - b.forsvinner / 0.35) * 1.5;
    }
    q.setFromAxisAngle(upp, klocka * 2 + b.fas);
    skala.setScalar(s);
    bajsMesh[b.typ].setMatrixAt(antal[b.typ]++, matris.compose(plats.set(b.x, y, b.z), q, skala));
    if (!b.tagen) {
      q.identity();
      skala.setScalar(1 + Math.sin(klocka * 4 + b.fas) * 0.15);
      sken.setMatrixAt(skenAntal, matris.compose(plats.set(b.x, b.y - 0.4, b.z), q, skala));
      sken.setColorAt(skenAntal++, farg.setHex(RINGFARG[b.typ]));
    }
  });
  TYPER.forEach((typ) => {
    bajsMesh[typ].count = antal[typ];
    bajsMesh[typ].instanceMatrix.needsUpdate = true;
  });
  sken.count = skenAntal;
  sken.instanceMatrix.needsUpdate = true;
  if (sken.instanceColor) sken.instanceColor.needsUpdate = true;

  // Gnistor
  gnistor = gnistor.filter((g) => (g.liv -= dt) > 0);
  gnistor.forEach((g, nr) => {
    g.vy -= 12 * dt;
    g.x += g.vx * dt; g.y += g.vy * dt; g.z += g.vz * dt;
    q.setFromAxisAngle(upp, g.liv * 10);
    skala.setScalar(g.liv * 1.5);
    gnistMesh.setMatrixAt(nr, matris.compose(plats.set(g.x, g.y, g.z), q, skala));
    gnistMesh.setColorAt(nr, farg.setHex(g.farg));
  });
  gnistMesh.count = gnistor.length;
  gnistMesh.instanceMatrix.needsUpdate = true;
  if (gnistMesh.instanceColor) gnistMesh.instanceColor.needsUpdate = true;

  uppdateraSno(dt);
  // Molnen, dammen, Bajsis och Morfar
  moln.forEach((g, nr) => {
    g.position.x += dt * (1 + nr % 3);
    if (g.position.x > 220) g.position.x = -220;
  });
  vattenMaterial.emissive.setRGB(0.04, 0.16 + Math.sin(klocka * 1.5) * 0.03, 0.29);
  bajsis.scale.set(1 + Math.sin(klocka * 4) * 0.04, 1 - Math.sin(klocka * 4) * 0.05, 1 + Math.sin(klocka * 4) * 0.04);
  const p = spelare.grupp.position;
  bajsis.rotation.y = Math.atan2(p.x - bajsis.position.x, p.z - bajsis.position.z);
  morfar.grupp.rotation.y = Math.atan2(p.x - morfar.grupp.position.x, p.z - morfar.grupp.position.z);
  morfar.grupp.rotation.z = Math.sin(klocka * 1.5) * 0.04;
  if (lage !== "spelar") pil.visible = false;

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
stallVader("dag");
byggTorn(6, slump(5));
// Bakom menyn: några guldbajsar på torget och kameran som sakta snurrar runt
bajsar = [[3, 0.45, -2], [-3, 0.45, 3], [5, 0.45, 4]].map(([x, y, z], nr) => ({ typ: nr === 1 ? "diamant" : "guld", x: x, y: y, z: z, tagen: false, forsvinner: 0, fas: nr * 2 }));
spelare.grupp.position.set(START.x, 0, START.z);
visaLagen();

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
  } else if (lage === "paus" && styr.pausNytt) {
    fortsatt();
  } else if (lage === "nedrakning") {
    uppdateraNedrakning(dt);
    placeraKamera(dt);
  } else if (lage === "meny") {
    // Kameran snurrar sakta runt torget
    kameraVinkel += dt * 0.15;
    kamera.position.set(Math.sin(kameraVinkel) * 16, 7, Math.cos(kameraVinkel) * 16);
    kamera.lookAt(0, 1.5, 0);
    himmel.position.copy(kamera.position);
  }
  if (!iMeny) document.querySelectorAll(".fokus").forEach((k) => k.classList.remove("fokus"));
  const visaHjalp = (lage === "meny" || lage === "paus" || lage === "slut") && harHandkontroll();
  if (knapphjalp.hidden === visaHjalp) knapphjalp.hidden = !visaHjalp;
  if (lage !== "paus") animera(dt);
  renderare.render(scen, kamera);
  kvalitet.rakna(verkligTid);
  requestAnimationFrame(ruta);
}
requestAnimationFrame(ruta);
