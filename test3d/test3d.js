// =====================================================================
//  3D-TEST – visar vad iPaden och Xboxen klarar innan vi bygger 3D-spelet
//
//  En liten lågpoly-värld av hus och träd, och en figur som springer och
//  hoppar. Sidan visar bilder per sekund, WebGL-version, skärmstorlek,
//  handkontrollens knappar och vilka svenska röster som finns.
//  Allt byggs av kod, utan modellfiler.
// =====================================================================

const INSTALLNINGAR = {
  // Nivåerna man kan välja i panelen
  nivaer: {
    latt:   { namn: t("Lätt", "Light"),   trad: 40,  hus: 8,  sikt: 60,  upplosning: 0.6, skuggor: false },
    mellan: { namn: t("Mellan", "Medium"), trad: 150, hus: 25, sikt: 120, upplosning: 1,   skuggor: false },
    tung:   { namn: t("Tung", "Heavy"),   trad: 500, hus: 80, sikt: 250, upplosning: "skarm", skuggor: true },
  },
  startniva: "mellan",
  varldensStorlek: 300,   // Marken är så här många meter åt varje håll
  springfart: 9,          // meter per sekund
  hoppfart: 9,
  tyngdkraft: 25,
  kameraAvstand: 9,
  kameraHojd: 5,
  dodzon: 0.2,            // Så mycket man kan luta spaken utan att något händer
  // Det figurerna säger
  bajsis: { mening: "Hej! Jag heter Bajsis och jag älskar att hoppa!", rostlage: 1.6, tempo: 1.15 },
  morfar: { mening: "Goddag, goddag. Jag är morfar, och jag går lite långsamt.", rostlage: 0.8, tempo: 0.9 },
};

// ---------------------------------------------------------------------
//  WebGL: vad klarar enheten?
// ---------------------------------------------------------------------

function provaWebGL(namn) {
  try {
    const gl = document.createElement("canvas").getContext(namn);
    return gl ? true : false;
  } catch (e) {
    return false;
  }
}

const harWebGL2 = provaWebGL("webgl2");
const harWebGL1 = provaWebGL("webgl") || provaWebGL("experimental-webgl");

const felruta = document.getElementById("fel");
function visaFel(text) {
  felruta.textContent = text;
  felruta.hidden = false;
}
window.addEventListener("error", (e) => visaFel(t("Fel: ", "Error: ") + e.message));

if (!harWebGL1 && !harWebGL2) {
  visaFel(t("Den här enheten har inte WebGL, så 3D fungerar inte.", "This device has no WebGL, so 3D won't work."));
  throw new Error("Ingen WebGL");
}

const duk = document.getElementById("spel");
// Three.js r159 provar själv WebGL 2 först och tar WebGL 1 om 2 saknas
const renderare = new THREE.WebGLRenderer({ canvas: duk, antialias: false, powerPreference: "high-performance" });
const gl = renderare.getContext();
const webglVersion = renderare.capabilities.isWebGL2 ? "WebGL 2" : "WebGL 1";

// Grafikkortets namn (finns inte alltid)
let grafikkort = t("okänt", "unknown");
const felsokInfo = gl.getExtension("WEBGL_debug_renderer_info");
if (felsokInfo) grafikkort = gl.getParameter(felsokInfo.UNMASKED_RENDERER_WEBGL);

// ---------------------------------------------------------------------
//  Scenen
// ---------------------------------------------------------------------

const himmelsfarg = 0x9fd8ff;
const scen = new THREE.Scene();
scen.background = new THREE.Color(himmelsfarg);
scen.fog = new THREE.Fog(himmelsfarg, 20, 120);

const kamera = new THREE.PerspectiveCamera(60, 1, 0.1, 120);

const himmelsljus = new THREE.HemisphereLight(0xffffff, 0x5a7a3a, 0.9);
scen.add(himmelsljus);
const sol = new THREE.DirectionalLight(0xffffff, 1.6);
sol.position.set(30, 50, 20);
sol.shadow.mapSize.set(1024, 1024);
const skuggruta = sol.shadow.camera;
skuggruta.left = -40; skuggruta.right = 40; skuggruta.top = 40; skuggruta.bottom = -40;
skuggruta.near = 1; skuggruta.far = 150;
scen.add(sol);
scen.add(sol.target);

// Lågpoly: platta ytor i stället för mjuka (flatShading)
function material(farg) {
  return new THREE.MeshLambertMaterial({ color: farg, flatShading: true });
}

// Marken
const mark = new THREE.Mesh(
  new THREE.PlaneGeometry(INSTALLNINGAR.varldensStorlek * 2, INSTALLNINGAR.varldensStorlek * 2),
  material(0x6cbf4a)
);
mark.rotation.x = -Math.PI / 2;
mark.receiveShadow = true;
scen.add(mark);

// Delas av alla hus och träd, så att de bara finns en gång i minnet
const delat = {
  husKropp: new THREE.BoxGeometry(1, 1, 1),
  tak: new THREE.ConeGeometry(0.75, 1, 4),   // pyramid med fyra sidor
  stam: new THREE.CylinderGeometry(0.2, 0.3, 2, 6),
  krona: new THREE.IcosahedronGeometry(1.4, 0),
  stamMaterial: material(0x7a4a24),
  kronMaterial: material(0x2f8a3a),
  takMaterial: material(0xb33a2a),
  vaggMaterial: [0xf3e2b8, 0xe88a5a, 0x9ec5e8, 0xf5f5f5, 0xf1c84b].map(material),
};

// Hus och träd ligger i en egen grupp som byggs om när man byter nivå
let varld = null;
let husLista = [];   // { x, z, halvBredd, halvDjup } för att inte springa igenom husen

// Samma slumptal varje gång, så att världen ser likadan ut på alla nivåer
function slump(fro) {
  let s = fro;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function byggVarld(niva) {
  if (varld) {
    scen.remove(varld);
    varld.traverse((del) => { if (del.isInstancedMesh) del.dispose(); });
  }
  varld = new THREE.Group();
  husLista = [];
  const r = slump(42);
  const storlek = INSTALLNINGAR.varldensStorlek - 10;
  const skuggor = niva.skuggor;

  // Hus: vanliga meshar (ett ritanrop per del), så att vi ser vad det kostar
  for (let i = 0; i < niva.hus; i++) {
    let x, z;
    do {
      x = (r() * 2 - 1) * storlek;
      z = (r() * 2 - 1) * storlek;
    } while (Math.abs(x) < 8 && Math.abs(z) < 8);   // Inget hus där figuren startar
    const bredd = 4 + r() * 4, djup = 4 + r() * 4, hojd = 3 + r() * 3;
    const vagg = new THREE.Mesh(delat.husKropp, delat.vaggMaterial[i % delat.vaggMaterial.length]);
    vagg.scale.set(bredd, hojd, djup);
    vagg.position.set(x, hojd / 2, z);
    const tak = new THREE.Mesh(delat.tak, delat.takMaterial);
    tak.scale.set(bredd, 2.5, djup);
    tak.rotation.y = Math.PI / 4;
    tak.position.set(x, hojd + 1.25, z);
    vagg.castShadow = tak.castShadow = skuggor;
    vagg.receiveShadow = skuggor;
    varld.add(vagg, tak);
    husLista.push({ x: x, z: z, halvBredd: bredd / 2, halvDjup: djup / 2 });
  }

  // Träd: "instanser" – alla stammar ritas på en gång, och alla kronor på en gång
  const stammar = new THREE.InstancedMesh(delat.stam, delat.stamMaterial, niva.trad);
  const kronor = new THREE.InstancedMesh(delat.krona, delat.kronMaterial, niva.trad);
  const m = new THREE.Matrix4(), plats = new THREE.Vector3(), vrid = new THREE.Quaternion(), skala = new THREE.Vector3();
  for (let i = 0; i < niva.trad; i++) {
    let x, z;
    do {
      x = (r() * 2 - 1) * storlek;
      z = (r() * 2 - 1) * storlek;
    } while ((Math.abs(x) < 5 && Math.abs(z) < 5) || krockarMedHus(x, z, 1));
    const s = 0.8 + r() * 0.7;
    vrid.setFromAxisAngle(new THREE.Vector3(0, 1, 0), r() * Math.PI);
    skala.set(s, s, s);
    m.compose(plats.set(x, s, z), vrid, skala);
    stammar.setMatrixAt(i, m);
    m.compose(plats.set(x, s * 2.8, z), vrid, skala);
    kronor.setMatrixAt(i, m);
  }
  stammar.castShadow = kronor.castShadow = skuggor;
  varld.add(stammar, kronor);
  scen.add(varld);
}

function krockarMedHus(x, z, marginal) {
  for (const hus of husLista) {
    if (Math.abs(x - hus.x) < hus.halvBredd + marginal && Math.abs(z - hus.z) < hus.halvDjup + marginal) return hus;
  }
  return null;
}

// ---------------------------------------------------------------------
//  Figuren: en gubbe av lådor
// ---------------------------------------------------------------------

function lada(b, h, d, farg, x, y, z) {
  const del = new THREE.Mesh(new THREE.BoxGeometry(b, h, d), material(farg));
  del.position.set(x, y, z);
  del.castShadow = true;
  return del;
}

// En arm eller ett ben som svänger runt axeln/höften
function led(b, h, farg, x, y) {
  const fast = new THREE.Group();
  fast.position.set(x, y, 0);
  fast.add(lada(b, h, b, farg, 0, -h / 2, 0));
  return fast;
}

const figur = new THREE.Group();
figur.add(lada(0.8, 0.9, 0.5, 0x8b5a2b, 0, 1.35, 0));          // kropp
figur.add(lada(0.6, 0.6, 0.6, 0x9c6a3a, 0, 2.15, 0));          // huvud
figur.add(lada(0.12, 0.12, 0.05, 0x000000, -0.14, 2.2, 0.31)); // ögon
figur.add(lada(0.12, 0.12, 0.05, 0x000000, 0.14, 2.2, 0.31));
const vansterArm = led(0.22, 0.8, 0x8b5a2b, -0.52, 1.75);
const hogerArm = led(0.22, 0.8, 0x8b5a2b, 0.52, 1.75);
const vansterBen = led(0.28, 0.9, 0x4a3018, -0.2, 0.9);
const hogerBen = led(0.28, 0.9, 0x4a3018, 0.2, 0.9);
figur.add(vansterArm, hogerArm, vansterBen, hogerBen);
scen.add(figur);

const spelare = {
  fartY: 0,
  paMarken: true,
  vinkel: 0,       // åt vilket håll figuren tittar
  steg: 0,         // hur långt i springrörelsen armar och ben har kommit
};
let kameraVinkel = 0;

// ---------------------------------------------------------------------
//  Styrning: tangentbord, touch och handkontroll
// ---------------------------------------------------------------------

const tangenter = {};
let senasteTangent = "–";
let senasteMus = "–";
window.addEventListener("keydown", (e) => {
  tangenter[e.code || e.key] = true;
  senasteTangent = e.key + (e.code ? " (" + e.code + ")" : "");
  if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space"].indexOf(e.code) >= 0) e.preventDefault();
});
window.addEventListener("keyup", (e) => { tangenter[e.code || e.key] = false; });
// Om Xboxen gör handkontrollen till en muspekare syns det här
window.addEventListener("mousemove", (e) => { senasteMus = Math.round(e.clientX) + ", " + Math.round(e.clientY); });

// Gammal Edge på Xbox: be om handkontrollen i stället för muspekaren
if ("gamepadInputEmulation" in navigator) {
  try { navigator.gamepadInputEmulation = "gamepad"; } catch (e) { /* går inte – inget att göra */ }
}

const harTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
const joystick = document.getElementById("joystick");
const pinne = document.getElementById("pinne");
const hoppknapp = document.getElementById("hopp");
joystick.hidden = hoppknapp.hidden = !harTouch;

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
  const touch = e.changedTouches[0];
  spak.finger = touch.identifier;
  flyttaSpak(touch);
}, { passive: false });
joystick.addEventListener("touchmove", (e) => {
  e.preventDefault();
  for (const touch of e.changedTouches) if (touch.identifier === spak.finger) flyttaSpak(touch);
}, { passive: false });
const slutaTouch = (e) => {
  for (const touch of e.changedTouches) if (touch.identifier === spak.finger) slappSpak();
};
joystick.addEventListener("touchend", slutaTouch);
joystick.addEventListener("touchcancel", slutaTouch);

hoppknapp.addEventListener("touchstart", (e) => {
  e.preventDefault();
  touchHopp = true;
  hoppknapp.classList.add("tryckt");
}, { passive: false });
hoppknapp.addEventListener("touchend", () => { touchHopp = false; hoppknapp.classList.remove("tryckt"); });
hoppknapp.addEventListener("touchcancel", () => { touchHopp = false; hoppknapp.classList.remove("tryckt"); });

// Handkontroller som har kopplats in (händelserna kommer inte i alla webbläsare)
let handkontrollHandelse = t("ingen händelse än", "no event yet");
window.addEventListener("gamepadconnected", (e) => { handkontrollHandelse = t("inkopplad: ", "connected: ") + e.gamepad.id; });
window.addEventListener("gamepaddisconnected", () => { handkontrollHandelse = t("urkopplad", "disconnected"); });

// Läser alla handkontroller och tangenter, och ger tillbaka vart man vill
function lasStyrning() {
  let x = 0, y = 0, hopp = false;
  if (tangenter.ArrowLeft || tangenter.KeyA) x -= 1;
  if (tangenter.ArrowRight || tangenter.KeyD) x += 1;
  if (tangenter.ArrowUp || tangenter.KeyW) y -= 1;
  if (tangenter.ArrowDown || tangenter.KeyS) y += 1;
  if (tangenter.Space) hopp = true;

  x += spak.x;
  y += spak.y;
  if (touchHopp) hopp = true;

  const rader = [];
  const kontroller = navigator.getGamepads ? navigator.getGamepads() : [];
  for (let i = 0; i < kontroller.length; i++) {
    const kontroll = kontroller[i];
    if (!kontroll) continue;
    const tryckta = [];
    kontroll.buttons.forEach((knapp, nr) => { if (knapp.pressed) tryckta.push(nr); });
    const axlar = kontroll.axes.map((a) => a.toFixed(2)).join(" ");
    rader.push("🎮 " + kontroll.id.slice(0, 40) + "\n   " + t("läge", "mapping") + ": " + (kontroll.mapping || "–") +
      "\n   " + t("knappar", "buttons") + ": " + (tryckta.length ? tryckta.join(", ") : "–") +
      "\n   " + t("spakar", "sticks") + ": " + axlar);

    // Vänster spak, och styrkorset (knapp 12–15 i "standard"-läget)
    const sx = kontroll.axes[0] || 0, sy = kontroll.axes[1] || 0;
    if (Math.abs(sx) > INSTALLNINGAR.dodzon) x += sx;
    if (Math.abs(sy) > INSTALLNINGAR.dodzon) y += sy;
    const tryckt = (nr) => kontroll.buttons[nr] && kontroll.buttons[nr].pressed;
    if (tryckt(12)) y -= 1;
    if (tryckt(13)) y += 1;
    if (tryckt(14)) x -= 1;
    if (tryckt(15)) x += 1;
    if (tryckt(0)) hopp = true;   // A-knappen
  }

  document.getElementById("kontrollStatus").textContent =
    (rader.length ? rader.join("\n") : "🎮 " + t("ingen handkontroll hittad", "no gamepad found") + " (" + handkontrollHandelse + ")") +
    "\n⌨️ " + senasteTangent + "   🖱 " + senasteMus;

  const langd = Math.sqrt(x * x + y * y);
  if (langd > 1) { x /= langd; y /= langd; }
  return { x: x, y: y, hopp: hopp };
}

// ---------------------------------------------------------------------
//  Varje bildruta
// ---------------------------------------------------------------------

function uppdatera(dt) {
  const styr = lasStyrning();
  const fart = Math.sqrt(styr.x * styr.x + styr.y * styr.y);

  if (fart > 0.05) {
    // Styrningen gäller sett från kameran: uppåt = bort från kameran
    const riktning = kameraVinkel + Math.atan2(-styr.x, -styr.y);
    const steg = INSTALLNINGAR.springfart * fart * dt;
    const nyX = figur.position.x - Math.sin(riktning) * steg;
    const nyZ = figur.position.z - Math.cos(riktning) * steg;
    const grans = INSTALLNINGAR.varldensStorlek - 2;
    // Går man in i ett hus glider man längs väggen
    if (!krockarMedHus(nyX, figur.position.z, 0.5)) figur.position.x = Math.max(-grans, Math.min(grans, nyX));
    if (!krockarMedHus(figur.position.x, nyZ, 0.5)) figur.position.z = Math.max(-grans, Math.min(grans, nyZ));

    // Figuren vrider sig mjukt åt det håll den springer
    let skillnad = riktning - spelare.vinkel;
    skillnad = Math.atan2(Math.sin(skillnad), Math.cos(skillnad));
    spelare.vinkel += skillnad * Math.min(1, dt * 12);
    spelare.steg += dt * 12 * fart;

    // Kameran svänger långsamt in bakom figuren
    let kameraSkillnad = spelare.vinkel - kameraVinkel;
    kameraSkillnad = Math.atan2(Math.sin(kameraSkillnad), Math.cos(kameraSkillnad));
    kameraVinkel += kameraSkillnad * Math.min(1, dt * 1.5 * fart);
  }
  figur.rotation.y = spelare.vinkel + Math.PI;

  // Armar och ben svänger när man springer, och går tillbaka när man står still
  const sving = fart > 0.05 ? Math.sin(spelare.steg) * 0.8 * fart : 0;
  vansterArm.rotation.x = sving;
  hogerArm.rotation.x = -sving;
  vansterBen.rotation.x = -sving;
  hogerBen.rotation.x = sving;

  // Hopp
  if (styr.hopp && spelare.paMarken) {
    spelare.fartY = INSTALLNINGAR.hoppfart;
    spelare.paMarken = false;
  }
  spelare.fartY -= INSTALLNINGAR.tyngdkraft * dt;
  figur.position.y += spelare.fartY * dt;
  if (figur.position.y <= 0) {
    figur.position.y = 0;
    spelare.fartY = 0;
    spelare.paMarken = true;
  }
  if (!spelare.paMarken) {
    vansterArm.rotation.x = hogerArm.rotation.x = Math.PI * 0.9;   // armarna upp i luften
  }

  // Kameran följer efter, bakom och lite ovanför
  const mal = new THREE.Vector3(
    figur.position.x + Math.sin(kameraVinkel) * INSTALLNINGAR.kameraAvstand,
    figur.position.y * 0.5 + INSTALLNINGAR.kameraHojd,
    figur.position.z + Math.cos(kameraVinkel) * INSTALLNINGAR.kameraAvstand
  );
  kamera.position.lerp(mal, Math.min(1, dt * 6));
  kamera.lookAt(figur.position.x, figur.position.y + 1.8, figur.position.z);

  // Solen och dess skuggruta följer med figuren
  sol.position.set(figur.position.x + 30, 50, figur.position.z + 20);
  sol.target.position.copy(figur.position);
}

// ---------------------------------------------------------------------
//  Nivåer: lätt, mellan, tung
// ---------------------------------------------------------------------

let nivaNamn = INSTALLNINGAR.startniva;

function valjNiva(namn) {
  nivaNamn = namn;
  const niva = INSTALLNINGAR.nivaer[namn];
  const upplosning = niva.upplosning === "skarm" ? Math.min(window.devicePixelRatio || 1, 2) : niva.upplosning;
  renderare.setPixelRatio(upplosning);
  renderare.shadowMap.enabled = niva.skuggor;
  sol.castShadow = niva.skuggor;
  mark.material.needsUpdate = true;   // materialen behöver byggas om när skuggorna slås av och på
  delat.vaggMaterial.concat([delat.takMaterial, delat.stamMaterial, delat.kronMaterial]).forEach((m) => { m.needsUpdate = true; });
  kamera.far = niva.sikt;
  scen.fog.near = niva.sikt * 0.3;
  scen.fog.far = niva.sikt;
  byggVarld(niva);
  anpassaStorlek();
  document.querySelectorAll("#nivaKnappar button").forEach((knapp) => {
    knapp.className = knapp.dataset.niva === namn ? "vald" : "";
  });
  matning.borja();
}

const nivaKnappar = document.getElementById("nivaKnappar");
Object.keys(INSTALLNINGAR.nivaer).forEach((namn) => {
  const knapp = document.createElement("button");
  knapp.type = "button";
  knapp.dataset.niva = namn;
  knapp.textContent = INSTALLNINGAR.nivaer[namn].namn;
  knapp.addEventListener("click", () => valjNiva(namn));
  nivaKnappar.appendChild(knapp);
});

function anpassaStorlek() {
  const bredd = window.innerWidth, hojd = window.innerHeight;
  renderare.setSize(bredd, hojd, false);
  kamera.aspect = bredd / hojd;
  kamera.updateProjectionMatrix();
  visaInfo();
}
window.addEventListener("resize", anpassaStorlek);
window.addEventListener("orientationchange", () => setTimeout(anpassaStorlek, 300));

// ---------------------------------------------------------------------
//  Bilder per sekund
// ---------------------------------------------------------------------

const fpsText = document.getElementById("fps");
const matning = {
  bilder: 0, tid: 0,
  totalBilder: 0, totalTid: 0, samsta: Infinity,
  borja() {
    this.bilder = this.tid = this.totalBilder = this.totalTid = 0;
    this.samsta = Infinity;
  },
  rakna(dt) {
    this.bilder++;
    this.tid += dt;
    this.totalBilder++;
    this.totalTid += dt;
    if (this.tid >= 0.5) {
      const fps = this.bilder / this.tid;
      // De första sekunderna efter nivåbyte räknas inte in i "sämsta"
      if (this.totalTid > 2) this.samsta = Math.min(this.samsta, fps);
      const snitt = this.totalBilder / this.totalTid;
      fpsText.textContent = Math.round(fps) + " fps  ·  " + INSTALLNINGAR.nivaer[nivaNamn].namn +
        "  ·  " + t("snitt", "avg") + " " + Math.round(snitt) +
        (this.samsta < Infinity ? ", " + t("sämst", "worst") + " " + Math.round(this.samsta) : "");
      this.bilder = this.tid = 0;
      visaInfo();
    }
  },
};

// ---------------------------------------------------------------------
//  Om enheten (det Andreas skickar tillbaka)
// ---------------------------------------------------------------------

const infoRuta = document.getElementById("info");
function infoText() {
  const ar = navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;
  const niva = INSTALLNINGAR.nivaer[nivaNamn];
  const snitt = matning.totalTid > 0 ? Math.round(matning.totalBilder / matning.totalTid) : "–";
  return [
    "User agent: " + navigator.userAgent,
    "Platform: " + (navigator.platform || "–") + (ar ? " (iPad som säger att den är en Mac)" : ""),
    "Touch: " + (harTouch ? t("ja", "yes") : t("nej", "no")) + ", maxTouchPoints " + (navigator.maxTouchPoints || 0),
    "WebGL 2: " + (harWebGL2 ? t("ja", "yes") : t("nej", "no")) + ", WebGL 1: " + (harWebGL1 ? t("ja", "yes") : t("nej", "no")),
    t("Används: ", "In use: ") + webglVersion + ", Three.js r" + THREE.REVISION,
    "GPU: " + grafikkort,
    "Max texture: " + gl.getParameter(gl.MAX_TEXTURE_SIZE),
    t("Skärm: ", "Screen: ") + screen.width + "×" + screen.height + ", devicePixelRatio " + (window.devicePixelRatio || 1),
    t("Fönster: ", "Window: ") + window.innerWidth + "×" + window.innerHeight,
    t("Ritar i: ", "Drawing at: ") + duk.width + "×" + duk.height + " px",
    t("Nivå: ", "Level: ") + niva.namn + " (" + niva.trad + t(" träd, ", " trees, ") + niva.hus + t(" hus, sikt ", " houses, view ") + niva.sikt + " m" + (niva.skuggor ? t(", skuggor", ", shadows") : "") + ")",
    "FPS " + t("snitt", "avg") + ": " + snitt + ", " + t("sämst", "worst") + ": " + (matning.samsta < Infinity ? Math.round(matning.samsta) : "–"),
    t("Ritanrop: ", "Draw calls: ") + renderare.info.render.calls + t(", trianglar: ", ", triangles: ") + renderare.info.render.triangles,
    t("Svenska röster: ", "Swedish voices: ") + svenskaRoster().length + " / " + allaRoster().length,
    "gamepadInputEmulation: " + (navigator.gamepadInputEmulation || "–"),
  ].join("\n");
}
function visaInfo() {
  if (!panel.hidden) infoRuta.textContent = infoText();
}

document.getElementById("kopiera").addEventListener("click", () => {
  const text = infoText();
  const knapp = document.getElementById("kopiera");
  const klart = () => { knapp.textContent = t("✅ Kopierat!", "✅ Copied!"); };
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(klart, () => kopieraGammalt(text, klart));
  } else {
    kopieraGammalt(text, klart);
  }
});
// För äldre webbläsare: markera texten i en dold ruta och kopiera
function kopieraGammalt(text, klart) {
  const ruta = document.createElement("textarea");
  ruta.value = text;
  document.body.appendChild(ruta);
  ruta.select();
  ruta.setSelectionRange(0, text.length);
  try { if (document.execCommand("copy")) klart(); } catch (e) { /* då får man markera texten själv */ }
  document.body.removeChild(ruta);
}

const panel = document.getElementById("panel");
document.getElementById("oppnaPanel").addEventListener("click", () => {
  panel.hidden = !panel.hidden;
  visaInfo();
  visaRoster();
});

// ---------------------------------------------------------------------
//  Svenskt tal
// ---------------------------------------------------------------------

const harTal = "speechSynthesis" in window;
function allaRoster() { return harTal ? speechSynthesis.getVoices() : []; }
function svenskaRoster() {
  return allaRoster().filter((rost) => /^sv/i.test(rost.lang));
}

const rostVal = document.getElementById("rostVal");
function visaRoster() {
  const lista = document.getElementById("roster");
  if (!harTal) {
    lista.textContent = t("Den här webbläsaren kan inte prata (speechSynthesis saknas).", "This browser can't speak (no speechSynthesis).");
    rostVal.hidden = true;
    return;
  }
  const svenska = svenskaRoster();
  lista.textContent = svenska.length
    ? svenska.map((r) => "• " + r.name + " (" + r.lang + ")" + (r.localService ? "" : t(" – via nätet", " – online"))).join("\n")
    : t("Inga svenska röster hittade. Bajsis och Morfar provar ändå med sv-SE.", "No Swedish voices found. The characters try sv-SE anyway.");
  // Listan där man kan välja vilken röst Bajsis använder (Morfar tar nästa)
  const tidigare = rostVal.value;
  rostVal.innerHTML = "";
  svenska.forEach((rost, nr) => {
    const val = document.createElement("option");
    val.value = String(nr);
    val.textContent = rost.name;
    rostVal.appendChild(val);
  });
  rostVal.hidden = svenska.length < 2;
  if (tidigare && Number(tidigare) < svenska.length) rostVal.value = tidigare;
}
if (harTal) {
  speechSynthesis.getVoices();   // Safari börjar ladda rösterna först när man frågar
  if ("onvoiceschanged" in speechSynthesis) speechSynthesis.addEventListener("voiceschanged", () => { visaRoster(); visaInfo(); });
}

function prata(vem, rostNummer) {
  if (!harTal) return;
  const svenska = svenskaRoster();
  const yttrande = new SpeechSynthesisUtterance(vem.mening);
  yttrande.lang = "sv-SE";
  if (svenska.length) yttrande.voice = svenska[rostNummer % svenska.length];
  yttrande.pitch = vem.rostlage;
  yttrande.rate = vem.tempo;
  speechSynthesis.cancel();   // Avbryt den som pratar, så att det inte blir kö
  speechSynthesis.speak(yttrande);
}
document.getElementById("prataBajsis").addEventListener("click", () => prata(INSTALLNINGAR.bajsis, Number(rostVal.value || 0)));
document.getElementById("prataMorfar").addEventListener("click", () => prata(INSTALLNINGAR.morfar, Number(rostVal.value || 0) + 1));

// ---------------------------------------------------------------------
//  Starta
// ---------------------------------------------------------------------

valjNiva(INSTALLNINGAR.startniva);

let forraTiden = performance.now();
function ruta(nu) {
  // Max 0,1 sekunder per steg, så att figuren inte flyger iväg efter en paus
  const verkligTid = (nu - forraTiden) / 1000;
  const dt = Math.min(0.1, verkligTid);
  forraTiden = nu;
  uppdatera(dt);
  renderare.render(scen, kamera);
  matning.rakna(verkligTid);
  requestAnimationFrame(ruta);
}
requestAnimationFrame(ruta);
