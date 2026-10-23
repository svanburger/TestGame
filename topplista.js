// =====================================================================
//  TOPPLISTA – de 10 bästa resultaten i varje spel, med namn
//
//  När ett spel är slut och man har kommit med på topplistan får man
//  skriva sitt namn. Namnen man har skrivit förut syns som knappar, så att
//  man inte behöver skriva samma namn varje gång.
//
//  Topplistan sparas i webbläsaren på just den här enheten.
//
//  Så här använder ett spel topplistan:
//
//    När spelet är slut:   Topplista.nyttResultat("stjarnor", poang);
//    En knapp som visar topplistan (t.ex. i pausmenyn):
//      <button data-topplista="stjarnor">🏆 Topplista</button>
//    Utan namn på spelet (data-topplista="") visas alla spelen, som i menyn.
//
//  Den här filen ska laddas efter sprak.js och före game.js:
//    <script src="../sprak.js"></script>
//    <script src="../topplista.js"></script>
//    <script src="game.js"></script>
// =====================================================================

(function () {
  const INSTALLNINGAR = {
    antal: 10,         // Hur många som får plats på varje topplista
    langstaNamn: 14,   // Max antal tecken i ett namn
    sparadeNamn: 6,    // Hur många namn som syns som knappar
    fordrojning: 0.7,  // Sekunder innan man får skriva sitt namn (spelen kan ändra det)
  };

  // Spelen som har en topplista, i samma ordning som i menyn.
  // Bordsplaceringen är ett pussel utan poäng, så den har ingen topplista.
  const SPELEN = [
    { id: "stjarnor", ikon: "⭐", namn: t("Fånga stjärnorna", "Catch the Stars") },
    { id: "parkour", ikon: "🐱", namn: t("Parkourkatten", "Parkour Cat") },
    { id: "pappa", ikon: "🛋️", namn: t("Låt pappa vila", "Let Dad Rest") },
    { id: "hund", ikon: "🐕", namn: t("Hundpromenaden", "Dog Walk") },
    { id: "fis", ikon: "💨", namn: t("Lagom tryck", "Just the Right Push") },
    { id: "godis", ikon: "🎃", namn: t("Bus eller godis", "Trick or Treat"), enhet: "🍬" },
  ];

  const MEDALJER = ["🥇", "🥈", "🥉"];

  function hittaSpel(id) {
    return SPELEN.find((s) => s.id === id) || { id, ikon: "🏆", namn: id };
  }

  function visaPoang(spel, poang) {
    const tal = poang.toLocaleString(SPRAK === "sv" ? "sv-SE" : "en-GB");
    if (spel.enhet) return tal + " " + spel.enhet;
    return tal + " " + (SPRAK === "sv" ? "poäng" : poang === 1 ? "point" : "points");
  }

  // ---------- Spara och läsa ----------

  function las(namn, standard) {
    try {
      return JSON.parse(localStorage.getItem(namn)) || standard;
    } catch (e) {
      return standard;
    }
  }

  function spara(namn, varde) {
    try {
      localStorage.setItem(namn, JSON.stringify(varde));
    } catch (e) {
      // Privat läge e.d. – topplistan sparas bara tills sidan laddas om
    }
  }

  let listor = las("topplista", {});
  let gamlaNamn = las("topplista-namn", []);

  function listaFor(spelId) {
    return Array.isArray(listor[spelId]) ? listor[spelId] : [];
  }

  // Bäst först. Har två lika många poäng står den som kom först överst.
  function sortera(lista) {
    return lista.sort((a, b) => b.poang - a.poang || a.tid - b.tid);
  }

  // Vilken plats (1, 2, 3 ...) ett resultat skulle få, eller 0 om det inte kommer med
  function platsFor(spelId, poang) {
    if (!(poang > 0)) return 0;
    const lista = listaFor(spelId);
    let plats = 1;
    for (const rad of lista) if (rad.poang >= poang) plats++;
    return plats <= INSTALLNINGAR.antal ? plats : 0;
  }

  function laggTill(spelId, namn, poang) {
    const rad = { namn, poang, tid: Date.now() };
    listor = las("topplista", {}); // Ett annat spel i en annan flik kan ha sparat under tiden
    listor[spelId] = sortera([...listaFor(spelId), rad]).slice(0, INSTALLNINGAR.antal);
    spara("topplista", listor);
    gamlaNamn = [namn, ...gamlaNamn.filter((n) => n !== namn)].slice(0, INSTALLNINGAR.sparadeNamn);
    spara("topplista-namn", gamlaNamn);
    return rad;
  }

  // ---------- Rutan som visas ovanpå spelet ----------

  let ruta = null;      // Hela rutan, eller null när den är stängd
  let narStangd = null; // Körs när rutan stängs

  function skapa(tagg, klass, text) {
    const el = document.createElement(tagg);
    if (klass) el.className = klass;
    if (text !== undefined) el.textContent = text;
    return el;
  }

  function oppna(innehall) {
    stang();
    ruta = skapa("div", "tl-bakgrund");
    const kort = skapa("div", "tl-ruta");
    kort.setAttribute("role", "dialog");
    kort.setAttribute("aria-modal", "true");
    kort.append(...innehall);
    ruta.append(kort);
    // Trycker man utanför rutan stängs den
    ruta.addEventListener("pointerdown", (e) => {
      if (e.target === ruta) {
        e.preventDefault();
        stang();
      }
    });
    document.body.append(ruta);
  }

  function stang() {
    if (!ruta) return;
    ruta.remove();
    ruta = null;
    const sen = narStangd;
    narStangd = null;
    if (sen) sen();
  }

  // Medan rutan är öppen ska tangenterna inte styra spelet bakom
  // (mellanslag och Enter startar annars om spelet). Den här lyssnaren
  // körs före spelets egna, eftersom den här filen laddas före game.js.
  window.addEventListener("keydown", (e) => {
    if (!ruta) return;
    if (e.key === "Escape") {
      e.preventDefault();
      stang();
    }
    e.stopPropagation();
  }, true);

  // Listan med de bästa. markera = raden som ska lysa (den man nyss fick).
  function ritaLista(spel, markera) {
    const lista = listaFor(spel.id);
    if (lista.length === 0) {
      return skapa("p", "tl-tom", t("Ingen är med här än. Spela och bli först! 🏁", "Nobody is here yet. Play and be the first! 🏁"));
    }
    const ol = skapa("ol", "tl-lista");
    lista.forEach((rad, i) => {
      const li = skapa("li", "tl-rad");
      if (markera && rad.tid === markera.tid && rad.namn === markera.namn) li.classList.add("tl-ny");
      li.append(
        skapa("span", "tl-plats", MEDALJER[i] || String(i + 1)),
        skapa("span", "tl-namn", rad.namn),
        skapa("span", "tl-poang", visaPoang(spel, rad.poang))
      );
      ol.append(li);
    });
    return ol;
  }

  function knapp(text, klass, vidTryck) {
    const b = skapa("button", "menyknapp " + (klass || ""), text);
    b.type = "button";
    b.addEventListener("click", vidTryck);
    return b;
  }

  // Visar topplistan för ett spel. Utan spel visas flikar för alla spelen.
  function visa(spelId, markera) {
    const rubrik = skapa("h2", "tl-rubrik", "🏆 " + t("Topplista", "High scores"));
    const delar = [rubrik];
    const plats = skapa("div", "tl-innehall");

    function valj(spel) {
      plats.replaceChildren(skapa("h3", "tl-spelnamn", spel.ikon + " " + spel.namn), ritaLista(spel, markera));
      for (const f of flikar.children) f.setAttribute("aria-selected", String(f.dataset.spel === spel.id));
    }

    const flikar = skapa("div", "tl-flikar");
    flikar.setAttribute("role", "tablist");
    if (!spelId) {
      for (const spel of SPELEN) {
        const f = skapa("button", "tl-flik", spel.ikon);
        f.type = "button";
        f.dataset.spel = spel.id;
        f.setAttribute("role", "tab");
        f.setAttribute("aria-label", spel.namn);
        f.addEventListener("click", () => valj(spel));
        flikar.append(f);
      }
      delar.push(flikar);
    }
    delar.push(plats, knapp(t("Klar", "Done"), "", stang));
    oppna(delar);

    // I menyn visas först spelet där någon senast kom med
    let forst = spelId ? hittaSpel(spelId) : SPELEN[0];
    if (!spelId) {
      let senast = 0;
      for (const spel of SPELEN) {
        for (const rad of listaFor(spel.id)) {
          if (rad.tid > senast) {
            senast = rad.tid;
            forst = spel;
          }
        }
      }
    }
    valj(forst);
  }

  // Man har kommit med på topplistan – skriv sitt namn
  function fragaNamn(spel, poang, plats, klar) {
    const rubrik = skapa("h2", "tl-rubrik", t("🏆 Du kom med på topplistan!", "🏆 You made the high scores!"));
    const info = skapa("p", "tl-info", (MEDALJER[plats - 1] || "") + " " +
      t("Plats " + plats + " med " + visaPoang(spel, poang), "Place " + plats + " with " + visaPoang(spel, poang)));

    const form = skapa("form", "tl-form");
    const etikett = skapa("label", "tl-etikett", t("Vad heter du?", "What's your name?"));
    const falt = skapa("input", "tl-falt");
    falt.id = "tl-namn";
    etikett.htmlFor = falt.id;
    falt.type = "text";
    falt.maxLength = INSTALLNINGAR.langstaNamn;
    falt.autocomplete = "off";
    falt.autocapitalize = "words";
    falt.spellcheck = false;
    falt.enterKeyHint = "done";
    falt.value = gamlaNamn[0] || "";

    const sparaKnapp = skapa("button", "menyknapp", t("Spara", "Save"));
    sparaKnapp.type = "submit";
    const uppdateraKnapp = () => { sparaKnapp.disabled = falt.value.trim() === ""; };
    falt.addEventListener("input", uppdateraKnapp);
    uppdateraKnapp();

    form.append(etikett, falt);

    // Namn man har skrivit förut, så att man bara behöver trycka
    if (gamlaNamn.length) {
      const namnKnappar = skapa("div", "tl-namnknappar");
      for (const namn of gamlaNamn) {
        const b = skapa("button", "tl-namnknapp", namn);
        b.type = "button";
        b.addEventListener("click", () => {
          falt.value = namn;
          uppdateraKnapp();
          sparaKnapp.focus();
        });
        namnKnappar.append(b);
      }
      form.append(namnKnappar);
    }
    form.append(sparaKnapp);

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const namn = falt.value.trim().slice(0, INSTALLNINGAR.langstaNamn);
      if (!namn) return;
      falt.blur(); // Fäll ner tangentbordet på iPad/telefon
      const rad = laggTill(spel.id, namn, poang);
      narStangd = null; // Rutan byts mot listan, spelet ska inte få veta något än
      visa(spel.id, rad);
      narStangd = klar;
    });

    const hoppaOver = knapp(t("Spara inte", "Don't save"), "sekundar", stang);

    narStangd = null;
    oppna([rubrik, info, form, hoppaOver]);
    narStangd = klar;
    // På dator kan man skriva direkt. På iPad kommer tangentbordet först när man trycker i rutan.
    if (!falt.value) falt.focus({ preventScroll: true });
    else sparaKnapp.focus({ preventScroll: true });
  }

  // Anropas av spelen när spelet är slut
  function nyttResultat(spelId, poang, val = {}) {
    const plats = platsFor(spelId, poang);
    if (!plats) return false;
    const spel = hittaSpel(spelId);
    const fordrojning = val.fordrojning ?? INSTALLNINGAR.fordrojning;
    setTimeout(() => fragaNamn(spel, poang, plats, val.narKlar), fordrojning * 1000);
    return true;
  }

  // Knappar med data-topplista öppnar topplistan
  document.addEventListener("click", (e) => {
    const el = e.target.closest && e.target.closest("[data-topplista]");
    if (!el) return;
    e.preventDefault();
    visa(el.dataset.topplista || null);
  });

  // ---------- Utseende ----------

  const stil = document.createElement("style");
  stil.textContent = `
    .tl-bakgrund {
      position: fixed;
      inset: 0;
      z-index: 50;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: calc(env(safe-area-inset-top, 0px) + 16px) 16px calc(env(safe-area-inset-bottom, 0px) + 16px);
      background: rgba(10, 8, 30, 0.65);
      touch-action: none;
    }
    .tl-ruta {
      display: grid;
      gap: 12px;
      width: min(400px, 100%);
      max-height: 100%;
      box-sizing: border-box;
      overflow-y: auto;
      overscroll-behavior: contain;
      touch-action: pan-y;
      padding: 24px;
      border-radius: 28px;
      background: #ffffff;
      color: #2b1d0e;
      text-align: center;
      font-family: ui-rounded, "SF Pro Rounded", system-ui, -apple-system, sans-serif;
      box-shadow: 0 10px 0 rgba(0, 0, 0, 0.25);
    }
    .tl-ruta .menyknapp {
      display: block;
      width: 100%;
      padding: 14px 20px;
      border: 0;
      border-radius: 18px;
      font: inherit;
      font-size: 1.3rem;
      font-weight: 700;
      color: #2b1d0e;
      background: #ffd95e;
      box-shadow: 0 4px 0 rgba(0, 0, 0, 0.2);
      cursor: pointer;
      touch-action: manipulation;
    }
    .tl-ruta .menyknapp.sekundar { background: #e6ecf5; }
    .tl-ruta .menyknapp:disabled { opacity: 0.45; cursor: default; }
    .tl-rubrik { margin: 0; font-size: 1.7rem; text-wrap: balance; }
    .tl-spelnamn { margin: 0; font-size: 1.2rem; }
    .tl-info { margin: 0; font-size: 1.25rem; font-weight: 700; }
    .tl-innehall { display: grid; gap: 10px; }
    .tl-tom { margin: 8px 0; font-size: 1.1rem; color: #6b5a48; }
    .tl-lista {
      display: grid;
      gap: 4px;
      margin: 0;
      padding: 0;
      list-style: none;
      text-align: left;
    }
    .tl-rad {
      display: grid;
      grid-template-columns: 2.2em 1fr auto;
      align-items: center;
      gap: 8px;
      padding: 7px 12px;
      border-radius: 14px;
      background: #f4f6fb;
      font-size: 1.15rem;
    }
    .tl-rad.tl-ny {
      background: #ffe98f;
      box-shadow: inset 0 0 0 3px #f2b705;
      animation: tl-lys 1s ease-in-out 3;
    }
    .tl-plats { text-align: center; font-weight: 800; }
    .tl-namn { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-weight: 700; }
    .tl-poang { font-variant-numeric: tabular-nums; white-space: nowrap; }
    .tl-flikar {
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      gap: 6px;
    }
    .tl-flik {
      width: 52px;
      height: 52px;
      padding: 0;
      border: 0;
      border-radius: 16px;
      font-size: 1.7rem;
      background: #e6ecf5;
      cursor: pointer;
      touch-action: manipulation;
    }
    .tl-flik[aria-selected="true"] {
      background: #ffd95e;
      box-shadow: 0 3px 0 rgba(0, 0, 0, 0.2);
    }
    .tl-form { display: grid; gap: 10px; }
    .tl-etikett { font-size: 1.1rem; font-weight: 700; }
    .tl-falt {
      width: 100%;
      box-sizing: border-box;
      padding: 12px 16px;
      border: 3px solid #d5def0;
      border-radius: 16px;
      font: inherit;
      font-size: 1.4rem;
      text-align: center;
      color: #2b1d0e;
      background: #ffffff;
      -webkit-user-select: text;
      user-select: text;
      touch-action: manipulation;
    }
    .tl-falt:focus { outline: none; border-color: #4a90e2; }
    .tl-namnknappar {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 6px;
    }
    .tl-namnknapp {
      padding: 8px 14px;
      border: 0;
      border-radius: 999px;
      font: inherit;
      font-size: 1.05rem;
      font-weight: 700;
      color: #2b1d0e;
      background: #e6ecf5;
      cursor: pointer;
      touch-action: manipulation;
    }
    .tl-ruta button:focus-visible,
    .tl-ruta .menyknapp:focus-visible {
      outline: 4px solid #4a90e2;
      outline-offset: 3px;
    }
    @keyframes tl-lys {
      50% { transform: scale(1.03); }
    }
    @media (max-height: 520px) {
      .tl-ruta { gap: 8px; padding: 16px; }
      .tl-rubrik { font-size: 1.35rem; }
      .tl-rad { padding: 4px 10px; font-size: 1rem; }
      .tl-ruta .menyknapp { padding: 10px 14px; font-size: 1.1rem; }
    }
    @media (prefers-reduced-motion: reduce) {
      .tl-rad.tl-ny { animation: none; }
    }
  `;
  document.head.append(stil);

  window.Topplista = {
    nyttResultat,
    visa: (spelId) => visa(spelId || null),
    arOppen: () => !!ruta,
  };
})();
