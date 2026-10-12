// =====================================================================
//  SPRÅK – svenska eller engelska
//
//  Spelen visas på svenska om webbläsaren är inställd på svenska, eller
//  om enheten står på svensk tid (då är man nog i Sverige). Annars visas
//  de på engelska. I menyn kan man byta språk, och valet sparas.
//
//  Så här skriver man text som ska finnas på båda språken:
//
//    I game.js:     t("Tryck för att börja", "Tap to start")
//    I HTML:        <button data-en="Continue">Fortsätt</button>
//                   (svenskan står i HTML:en, engelskan i data-en)
//
//  Den här filen ska laddas före game.js, längst ner i <body>:
//    <script src="../sprak.js"></script>
//    <script src="game.js"></script>
// =====================================================================

(function () {
  function valjSprak() {
    // 1. Har man själv valt språk i menyn?
    try {
      const sparat = localStorage.getItem("sprak");
      if (sparat === "sv" || sparat === "en") return sparat;
    } catch (e) {
      // Privat läge e.d. – gissa i stället
    }

    // 2. Är webbläsaren inställd på svenska? ("sv", "sv-SE", "sv-FI" ...)
    const sprakLista = navigator.languages && navigator.languages.length
      ? navigator.languages
      : [navigator.language || ""];
    if (sprakLista.some((sprak) => /^sv(-|$)/i.test(sprak))) return "sv";

    // 3. Står enheten på svensk tid? Då är man troligen i Sverige.
    try {
      if (Intl.DateTimeFormat().resolvedOptions().timeZone === "Europe/Stockholm") return "sv";
    } catch (e) {
      // Gammal webbläsare – strunta i tidszonen
    }

    return "en";
  }

  const SPRAK = valjSprak();

  window.SPRAK = SPRAK;
  window.t = function (svenska, engelska) {
    return SPRAK === "sv" ? svenska : engelska;
  };
  window.bytSprak = function (nytt) {
    try {
      localStorage.setItem("sprak", nytt);
    } catch (e) {
      // Går inte att spara – språket gäller bara tills sidan laddas om
    }
    location.reload();
  };

  document.documentElement.lang = SPRAK;

  // Byt ut texten i HTML:en mot engelska där det finns data-en, data-en-aria-label och data-en-content
  if (SPRAK === "en") {
    for (const el of document.querySelectorAll("[data-en]")) el.textContent = el.dataset.en;
    for (const el of document.querySelectorAll("[data-en-aria-label]")) el.setAttribute("aria-label", el.dataset.enAriaLabel);
    for (const el of document.querySelectorAll("[data-en-content]")) el.setAttribute("content", el.dataset.enContent);
  }
})();
