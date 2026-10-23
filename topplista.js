// =====================================================================
//  TOPPLISTA – de 10 bästa resultaten i varje spel, med namn
//
//  När ett spel är slut och man har kommit med på topplistan får man
//  skriva sitt namn. Namnen man har skrivit förut syns som knappar, så att
//  man inte behöver skriva samma namn varje gång.
//
//  Topplistan sparas i webbläsaren på just den här enheten. Har man
//  kopplat in Supabase (se nedan och README) kan familjen dela topplista:
//  alla enheter med samma familjekod ser samma lista. Utan internet sparas
//  resultaten på enheten och skickas när det finns internet igen.
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

    // Familjens topplista. Fyll i från Supabase: Project Settings → API.
    // Är de tomma finns topplistan bara på varje enhet för sig.
    supabaseAdress: "https://picwtecaatrjjaryjsox.supabase.co", // Project URL
    supabaseNyckel: "sb_publishable_HjMcny2OxWmqar6deibNjA_XNJYLraz", // Publishable key (sb_publishable_...) eller den gamla "anon public"-nyckeln
    familjeLank: false,  // true = man kan skicka en länk som gör att en annan enhet går med i familjen
    familjelista: false, // true = familjens topplista syns i menyn. false = topplistan finns bara på varje enhet
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

  // Familjens topplista
  const MED_SUPABASE = !!(INSTALLNINGAR.familjelista && INSTALLNINGAR.supabaseAdress && INSTALLNINGAR.supabaseNyckel);
  let familj = MED_SUPABASE ? las("topplista-familj", "") : "";
  let familjListor = las("topplista-familjlistor", {}); // Det senaste vi hämtade
  let ko = las("topplista-ko", []);                      // Resultat som inte har skickats än
  let natStatus = "";    // "hamtar", "fel" eller "" (allt gick bra)
  let narHamtat = null;  // Körs när en ny familjelista har hämtats

  function egenLista(spelId) {
    return Array.isArray(listor[spelId]) ? listor[spelId] : [];
  }

  // Den lista som visas: familjens (med det som inte har skickats än), annars enhetens
  function listaFor(spelId) {
    if (!familj) return egenLista(spelId);
    const fran = Array.isArray(familjListor[spelId]) ? familjListor[spelId] : [];
    const alla = [...fran];
    for (const rad of ko) {
      if (rad.spel === spelId && !alla.some((r) => r.tid === rad.tid && r.namn === rad.namn)) alla.push(rad);
    }
    return sortera(alla).slice(0, INSTALLNINGAR.antal);
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
    listor[spelId] = sortera([...egenLista(spelId), rad]).slice(0, INSTALLNINGAR.antal);
    spara("topplista", listor);
    if (familj) {
      ko = [...ko, { spel: spelId, ...rad }];
      spara("topplista-ko", ko);
      skicka();
    }
    gamlaNamn = [namn, ...gamlaNamn.filter((n) => n !== namn)].slice(0, INSTALLNINGAR.sparadeNamn);
    spara("topplista-namn", gamlaNamn);
    return rad;
  }

  // ---------- Familjens topplista (Supabase) ----------
  //
  //  Supabase-projektet har två funktioner (se supabase.sql):
  //    spara_resultat  – sparar ett resultat för en familj
  //    hamta_topplista – hämtar de 10 bästa i varje spel för en familj
  //  Utan rätt familjekod kan man inte se någon annans lista.

  const KOD_TECKEN = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // Inga O/0 eller I/1 som går att blanda ihop

  function nyKod() {
    const slump = new Uint32Array(8);
    crypto.getRandomValues(slump);
    return Array.from(slump, (n) => KOD_TECKEN[n % KOD_TECKEN.length]).join("");
  }

  // "k7qm 2xpa" och "K7QM-2XPA" blir "K7QM2XPA". Fel längd blir "".
  function stadaKod(text) {
    const kod = String(text || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
    return kod.length === 8 ? kod : "";
  }

  function visaKod(kod) {
    return kod.slice(0, 4) + "-" + kod.slice(4);
  }

  function anropa(funktion, data) {
    const nyckel = INSTALLNINGAR.supabaseNyckel;
    const huvuden = { "Content-Type": "application/json", apikey: nyckel };
    // Den gamla anon-nyckeln ska också skickas som Authorization. Den nya (sb_...) ska inte det.
    if (!nyckel.startsWith("sb_")) huvuden.Authorization = "Bearer " + nyckel;
    const adress = INSTALLNINGAR.supabaseAdress.replace(/\/+$/, "") + "/rest/v1/rpc/" + funktion;
    return fetch(adress, { method: "POST", headers: huvuden, body: JSON.stringify(data) }).then((svar) => {
      if (!svar.ok) throw new Error("Supabase svarade " + svar.status);
      return svar.status === 204 ? null : svar.json();
    });
  }

  // Skickar det som ligger i kön, och hämtar sedan familjens lista
  let skickar = null;
  function skicka() {
    if (!familj) return Promise.resolve();
    if (skickar) return skickar;
    natStatus = "hamtar";
    skickar = (async () => {
      try {
        // En i taget. Det som kommer till medan vi skickar följer med i samma vända.
        for (let varv = 0; ko.length && varv < 500; varv++) {
          const rad = ko[0];
          await anropa("spara_resultat", { p_familj: familj, p_spel: rad.spel, p_namn: rad.namn, p_poang: rad.poang, p_tid: rad.tid });
          ko = ko.filter((r) => r !== rad);
          spara("topplista-ko", ko);
        }
        const rader = await anropa("hamta_topplista", { p_familj: familj });
        const nya = {};
        for (const r of rader || []) (nya[r.spel] = nya[r.spel] || []).push({ namn: r.namn, poang: r.poang, tid: Number(r.tid) });
        familjListor = nya;
        spara("topplista-familjlistor", familjListor);
        natStatus = "";
      } catch (e) {
        natStatus = "fel"; // Inget internet, eller projektet sover. Det som inte skickats ligger kvar i kön.
      } finally {
        skickar = null;
        if (narHamtat) narHamtat();
      }
    })();
    return skickar;
  }

  function gaMed(kod) {
    familj = kod;
    spara("topplista-familj", familj);
    familjListor = {};
    spara("topplista-familjlistor", familjListor);
    // Enhetens egna resultat följer med till familjens lista. Samma resultat sparas bara en gång.
    const alla = [];
    for (const spel of Object.keys(listor)) for (const rad of egenLista(spel)) alla.push({ spel, ...rad });
    ko = alla;
    spara("topplista-ko", ko);
    return skicka();
  }

  function lamna() {
    familj = "";
    spara("topplista-familj", "");
    familjListor = {};
    spara("topplista-familjlistor", {});
    ko = [];
    spara("topplista-ko", []);
  }

  // En länk med ?familj=KOD gör att enheten går med i familjen (om familjeLank är på)
  if (MED_SUPABASE && !INSTALLNINGAR.familjeLank) skicka();
  if (MED_SUPABASE && INSTALLNINGAR.familjeLank) {
    try {
      const url = new URL(location.href);
      const kod = stadaKod(url.searchParams.get("familj"));
      if (url.searchParams.has("familj")) {
        url.searchParams.delete("familj");
        history.replaceState(null, "", url.href);
      }
      if (kod && kod !== familj) gaMed(kod);
      else skicka();
    } catch (e) {
      // Gammal webbläsare – strunta i länken
    }
  }
  if (MED_SUPABASE) window.addEventListener("online", () => skicka());

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
    narHamtat = null;
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

  // En rad under listan som säger vems lista det är
  function varListan() {
    let text = t("📱 Sparad på den här enheten", "📱 Saved on this device");
    if (familj) {
      text = t("👨‍👩‍👧 Familjens topplista", "👨‍👩‍👧 The family's high scores");
      if (natStatus === "hamtar") text += t(" · hämtar…", " · loading…");
      if (natStatus === "fel") text += t(" · utan internet just nu", " · offline right now");
    }
    return skapa("p", "tl-var", text);
  }

  // Där man skapar en familjekod, går med i en familj eller lämnar den
  function familjeDel(ritaOm) {
    const del = skapa("div", "tl-familj");
    function visaDel(lage) {
      del.replaceChildren();
      if (familj) {
        del.append(
          skapa("p", "tl-familjtext", t("Familjekod: ", "Family code: ")),
          skapa("p", "tl-kod", visaKod(familj)),
          skapa("p", "tl-familjtext", INSTALLNINGAR.familjeLank
            ? t("Skriv in koden på de andra iPadsen och telefonerna, eller skicka länken.", "Enter the code on the other iPads and phones, or send the link.")
            : t("Skriv in koden på de andra iPadsen och telefonerna.", "Enter the code on the other iPads and phones."))
        );
        const rad = skapa("div", INSTALLNINGAR.familjeLank ? "tl-knapprad" : "");
        if (INSTALLNINGAR.familjeLank) rad.append(
          knapp(t("📤 Skicka länk", "📤 Send link"), "sekundar", async () => {
            const lank = new URL("./?familj=" + familj, document.baseURI).href;
            try {
              if (navigator.share) await navigator.share({ title: "Bajskorv Studios", text: t("Vår familjs topplista", "Our family's high scores"), url: lank });
              else {
                await navigator.clipboard.writeText(lank);
                visaTips(t("Länken är kopierad!", "The link is copied!"));
              }
            } catch (e) {
              // Man ångrade sig – gör inget
            }
          })
        );
        rad.append(
          knapp(t("Lämna", "Leave"), "sekundar", () => {
            lamna();
            visaDel();
            ritaOm();
          })
        );
        del.append(rad);
      } else if (lage === "skrivKod") {
        const form = skapa("form", "tl-form");
        const falt = skapa("input", "tl-falt");
        falt.placeholder = "ABCD-1234";
        falt.maxLength = 12;
        falt.autocomplete = "off";
        falt.autocapitalize = "characters";
        falt.spellcheck = false;
        falt.setAttribute("aria-label", t("Familjekod", "Family code"));
        const gaKnapp = skapa("button", "menyknapp", t("Gå med", "Join"));
        gaKnapp.type = "submit";
        form.append(falt, gaKnapp);
        form.addEventListener("submit", (e) => {
          e.preventDefault();
          const kod = stadaKod(falt.value);
          if (!kod) {
            visaTips(t("Koden har 8 tecken, t.ex. ABCD-1234.", "The code has 8 characters, e.g. ABCD-1234."));
            return;
          }
          falt.blur();
          gaMed(kod);
          visaDel();
          ritaOm();
        });
        del.append(skapa("p", "tl-familjtext", t("Skriv familjekoden:", "Enter the family code:")), form);
        falt.focus({ preventScroll: true });
      } else {
        del.append(skapa("p", "tl-familjtext", t("🌍 Dela topplistan med familjens andra iPads och telefoner", "🌍 Share the high scores with the family's other iPads and phones")));
        const rad = skapa("div", "tl-knapprad");
        rad.append(
          knapp(t("Ny familjekod", "New family code"), "sekundar", () => {
            gaMed(nyKod());
            visaDel();
            ritaOm();
          }),
          knapp(t("Jag har en kod", "I have a code"), "sekundar", () => visaDel("skrivKod"))
        );
        del.append(rad);
      }
    }
    const tipsRad = skapa("p", "tl-familjtips");
    function visaTips(text) {
      tipsRad.textContent = text;
      del.append(tipsRad);
    }
    visaDel();
    return del;
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

    let valt = null;
    function valj(spel) {
      valt = spel;
      plats.replaceChildren(skapa("h3", "tl-spelnamn", spel.ikon + " " + spel.namn), ritaLista(spel, markera));
      if (MED_SUPABASE) plats.append(varListan()); // Bara när det finns två sorters listor
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
    delar.push(plats);
    // I menyn kan man koppla ihop familjens enheter
    if (!spelId && MED_SUPABASE) delar.push(familjeDel(() => valj(valt)));
    delar.push(knapp(t("Klar", "Done"), "", stang));
    oppna(delar);
    // Har familjens lista ändrats när den har hämtats ritas den om
    narHamtat = () => {
      if (ruta && valt && plats.isConnected) valj(valt);
    };
    if (familj) skicka();

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
    falt.value = gamlaNamn[0] || ""; // Namnet man skrev senast på den här enheten
    // Trycker man i rutan markeras namnet, så att ett nytt namn skrivs över det gamla
    falt.addEventListener("focus", () => setTimeout(() => falt.setSelectionRange(0, falt.value.length), 0));

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
    .tl-var { margin: 0; font-size: 0.9rem; color: #6b5a48; }
    .tl-familj {
      display: grid;
      gap: 8px;
      padding: 14px;
      border-radius: 18px;
      background: #f4f6fb;
    }
    .tl-familjtext, .tl-familjtips { margin: 0; font-size: 1rem; }
    .tl-familjtips { font-weight: 700; color: #b5462f; }
    .tl-kod {
      margin: 0;
      font-size: 1.8rem;
      font-weight: 800;
      letter-spacing: 0.12em;
      font-variant-numeric: tabular-nums;
      -webkit-user-select: all;
      user-select: all;
    }
    .tl-knapprad { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
    .tl-knapprad .menyknapp { font-size: 1.05rem; padding: 10px 8px; }
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
