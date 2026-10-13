// =====================================================================
//  HUNDPROMENADEN
//
//  Du är ute och går med hunden. Hunden vill nosa på allt, jaga allt och
//  bajsa överallt. Ta dig hem med en glad hund och en ren trottoar!
//
//  Dra med fingret för att gå. Hunden sitter i kopplet och drar åt sitt
//  eget håll. Tryck på hunden så säger du "Fot!" och då kommer den till
//  dig. Gå över bajset för att plocka upp det (då går det åt en påse).
//
//  Hundmätaren högst upp visar hur hunden mår. Har den för tråkigt drar
//  den ännu mer, och blir den för vild smiter den. Smiter hunden 3 gånger
//  är promenaden slut.
//
//  Börja med att ändra i INSTALLNINGAR här nedanför.
//
//  Texterna finns på svenska och engelska och skrivs så här:
//  t("svenska", "English"). Ändrar du en text, ändra gärna båda!
// =====================================================================

const INSTALLNINGAR = {
  // Hundarna man kan välja mellan på startskärmen. Siffrorna gångras med de
  // vanliga inställningarna längre ner: fart 1.25 = 25 % snabbare än vanligt.
  //   storlek, bredd, hojd: hur stor hunden är (taxen är lång och låg)
  //   farg: färgar emojin lite (taxen blir brun)
  //   drag: hur hårt den drar i kopplet
  //   vild: hur fort den blir vild när den jagar något
  //   las: vad man måste göra för att få välja den
  hundar: [
    { namn: t("Hunden", "The Dog"), med: t("hunden", "the dog"), bild: "🐕", text: t("Lagom på allt. Bra att börja med.", "A bit of everything. Good to start with.") },
    { namn: t("Taxen", "The Dachshund"), med: t("taxen", "the dachshund"), bild: "🐕", farg: "#7a3410", bredd: 1.45, hojd: 0.72, fart: 1.25, drag: 0.8, grava: true,
      text: t("Kort och snabb. Gräver efter ben överallt.", "Short and fast. Digs for bones everywhere.") },
    { namn: t("Pudeln", "The Poodle"), med: t("pudeln", "the poodle"), bild: "🐩", vild: 0.7, bajsTakt: [18, 26], fin: true,
      text: t("Fin och lugn. Vägrar gå i pölar. Hatar att bli blöt.", "Fancy and calm. Won't step in puddles. Hates getting wet.") },
    { namn: t("Sankt Bernhard", "St. Bernard"), med: t("Sankt Bernhard", "the St. Bernard"), bild: "🦮", storlek: 1.4, fart: 0.85, drag: 1.3, koppel: 1.15, storBajs: true, las: { rekord: 800 },
      text: t("Jättestor. Drar dig överallt. Jättestora bajs.", "Huge. Drags you everywhere. Huge poops.") },
    { namn: t("Katten", "The Cat"), med: t("katten", "the cat"), bild: "🐈", ansikte: "🐱", katt: true, bajsTakt: [28, 38], las: { hemma: true },
      text: t("Går inte i koppel. Eller?", "Doesn't do leashes. Or does it?") },
  ],
  koppel: 2.6,          // Hur långt kopplet är (1 = ungefär så långt som barnet är långt)
  fart: 2.7,            // Hur fort barnet går
  hundFart: 3,          // Hur fort hunden går
  jaktFart: 5,          // ...och springer när den jagar något
  smitFart: 2.2,        // Hur fort hunden springer när den smitit (lägre = lättare att fånga)

  pasarStart: 3,        // Bajspåsar man har när man börjar
  pasarMax: 5,          // Så många får man plats med i fickan
  bajsTakt: [13, 20],   // Sekunder mellan varje bajs (som minst och som mest)
  regnbage: 0.04,       // Chansen att ett bajs blir ett 🌈 regnbågsbajs (0.04 = 4 %)
  fotVila: 3.5,         // Sekunder innan man kan säga "Fot!" igen
  liv: 3,               // Hur många gånger hunden får smita

  // Hundmätaren går från 0 (jättetråkigt) till 100 (så vild att den
  // smiter). Siffrorna är hur mycket den ändras per sekund.
  humor: {
    start: 50,
    tristGa: -1.8,      // När man bara går
    tristStilla: -4,    // När man står still
    nosa: 8,
    halsa: 8,
    jaga: 14,
    plask: 18,          // På en gång när hunden hoppar i dammen
    fot: -14,           // På en gång när man säger "Fot!"
    bajs: 6,            // Skönt att bli av med
  },

  poang: {
    steg: 1,            // För varje steg framåt
    bajs: 15,           // För varje bajs man plockar upp
    regnbage: 250,      // För ett regnbågsbajs!
    lamna: 25,          // Så mycket man förlorar om man lämnar ett bajs
    trassel: 10,        // När man trasslar loss kopplet
    halsa: 10,          // När hunden hälsat på en annan hund
    fot: 5,             // När man säger "Fot!" precis när hunden sett något
    viral: 30,          // När influencern filmar något pinsamt
    boll: 10,           // När man plockar upp padelbollen själv
    apport: 20,         // När hunden kommer tillbaka med bollen
  },

  // Saker att plocka upp längs vägen. Ju lägre "vanlig", desto ovanligare.
  godsaker: [
    { bild: "🦴", poang: 5, vanlig: 10 },
    { bild: "🎾", poang: 10, vanlig: 5 },
    { bild: "🧸", poang: 20, vanlig: 3 },
    { bild: "🥩", poang: 40, vanlig: 1.5 },
    { bild: "🦴", poang: 100, vanlig: 0.5, guld: true }, // Guldben!
    { bild: "🛍️", poang: 0, vanlig: 2, pase: true },     // En extra bajspåse
  ],

  // Oväntade händelser som dyker upp då och då, på alla banor
  handelser: {
    forstaEfter: 25,      // Sekunder in på banan innan den första
    mellanrum: [28, 45],  // Sekunder mellan händelserna (som minst och som mest)
    regnTid: 12,          // Hur länge regnskuren håller på
    brevbarare: true,     // Brevbäraren kommer springande. Hunden HATAR brevbärare.
    regn: true,           // Regnskur! Hunden vill hem och drar som en galning.
    brandbil: true,       // Brandbilen åker förbi och hunden sätter sig och ylar
    glassbil: true,       // Glassbilen stannar och spelar sin melodi. Hunden springer dit.
    glassbilTid: 12,      // Hur länge glassbilen står kvar
  },

  katter: ["🐈", "🐈‍⬛"],
  andraHundar: ["🐩", "🐕‍🦺", "🦮"],

  // Promenaden går genom de här banorna, i den här ordningen. "typ" säger
  // hur banan ser ut och vad som finns där.
  banor: [
    { typ: "kvarter", namn: t("Kvarteret", "Our Street"), langd: 170, ikon: "🏘️" },
    { typ: "park", namn: t("Parken", "The Park"), langd: 190, ikon: "🌳", tips: t("Parken! Akta ankorna…", "The park! Watch out for the ducks…") },
    { typ: "stad", namn: t("Stan", "Downtown"), langd: 170, ikon: "🏙️", tips: t("Stan! Akta cykelbuden…", "Downtown! Watch out for the bike couriers…") },
    { typ: "strand", namn: t("Stranden", "The Beach"), langd: 170, ikon: "🏖️", tips: t("Stranden! Akta måsarna…", "The beach! Watch out for the seagulls…") },
  ],

  // Det folk säger. Lägg gärna till saker era egna grannar säger!
  pratbubblor: {
    hundagare: [t("Han är snäll, han vill bara hälsa!", "He's friendly, he just wants to say hi!"), t("Han har aldrig gjort så förut.", "He's never done that before.")],
    hundagareKatt: [t("…är det där en katt?", "…is that a cat?"), t("I koppel?", "On a leash?")], // Om man går med katten
    influencerPudel: [t("Coco, titta! En kollega!", "Coco, look! A colleague!")], // Om man går med pudeln
    // Influencern dyker upp tre gånger. Hon filmar allt.
    influencer: [
      [t("Säg hej till följarna, Coco!", "Say hi to my followers, Coco!"), t("Glöm inte att gilla!", "Don't forget to like!")],
      [t("Får jag filma er hund? Den är så… autentisk.", "Can I film your dog? It's so… authentic."), t("Jag taggar er! Eller… vad heter ni?", "I'll tag you! Or… what are your names?")],
      [t("Coco går inte på grus.", "Coco doesn't walk on gravel."), t("Inlägget är i samarbete med Bajspåsen AB.", "This post is sponsored by PoopBag Inc.")],
      [t("Jag gör en fika-reel. Det tar bara 45 minuter.", "I'm making a coffee reel. It only takes 45 minutes."), t("Kanelbullen får man inte äta. Den är rekvisita.", "You can't eat the cinnamon bun. It's a prop.")],
      [t("Schh. Jag mediterar. Live.", "Shh. I'm meditating. Live."), t("Glöm inte att prenumerera på min inre frid.", "Don't forget to subscribe to my inner peace.")],
    ],
    influencerViral: [ // När hon filmar något pinsamt
      t("Det här går VIRALT!", "This is going VIRAL!"),
      t("Följarna kommer ÄLSKA det här!", "My followers will LOVE this!"),
      t("#nofilter #hundliv", "#nofilter #doglife"),
      t("Kan du göra om det? Jag hade fel vinkel.", "Can you do that again? Wrong angle."),
    ],
    influencerTrakigt: [ // När hon filmar något bra
      t("Hmm. Det där får inga likes.", "Hmm. That won't get any likes."),
      t("Gulligt. Men tråkigt.", "Cute. But boring."),
    ],
    padel: [t("Har du testat padel?", "Have you tried padel?"), t("Oj! Bollen!", "Oops! The ball!"), t("Du borde verkligen testa padel.", "You really should try padel.")],
    sparkcykel: [ // Barnet säger det när det ser en elsparkcykel mitt i vägen
      t("Någon har parkerat mitt i vägen. Igen.", "Someone parked it in the middle of the path. Again."),
      t("Ännu en.", "Another one."),
      t("Hur många finns det?!", "How many are there?!"),
    ],
    rattvisa: [t("Rättvisa.", "Justice.")], // När hunden kissar på en elsparkcykel

    // I stan
    lattepappa: [t("Tredje latten idag. Barnet sover.", "Third latte today. The baby's asleep."), t("Föräldraledig. Som semester, fast tvärtom.", "Parental leave. Like a vacation, but the opposite.")],
    musikant: [t("Den här har jag skrivit själv. Den heter Wonderwall.", "I wrote this one myself. It's called Wonderwall."), t("Swish går bra!", "I take tips!")],
    brevbarare: [t("Bara räkningar idag!", "Only bills today!"), t("Han hatar mig. Det är okej.", "He hates me. It's fine."), t("Tack! Ni är de första i år som inte jagat mig.", "Thanks! You're the first this year who didn't chase me.")],
    brevbarareHandelse: [t("Ett paket till… nej, inte till er.", "A package for… no, not for you.")], // När han kommer som en oväntad händelse
    glassbil: [ // Det som står när glassbilen kommer, och vad folk säger
      t("När glassbilen spelar musik betyder det att glassen är slut.", "When the ice cream truck plays music, it means it's sold out."),
      t("Det tror jag inte på.", "I don't believe that."),       // Barnet
      t("Glass! Glass! Glass!", "Ice cream! Ice cream!"),         // Glassbilen
      t("Bara kort. Inga kontanter.", "Card only. No cash."),      // Glassbilen när man köper
    ],
    regn: [ // Det som står när regnskuren kommer, och vad folk säger
      t("Det var väl skönt med lite friskluft?", "Isn't it nice with some fresh air?"),
      t("Mitt hår!!", "My hair!!"),                  // Influencern
      t("Vi skulle ha tagit paraply.", "We should have brought an umbrella."), // Barnet
    ],
    cykelbud: [t("Akta! Matleverans!", "Watch out! Food delivery!"), t("Ge mig fem stjärnor!", "Give me five stars!")],

    // På stranden
    byggare: [t("Rör inte mitt slott!", "Don't touch my castle!"), t("MITT SLOTT!", "MY CASTLE!"), t("Tack för att du höll i hunden!", "Thanks for holding your dog!")],
    solbadare: [t("Jag ska bara bli lite brun.", "I'm just getting a little tan."), t("…eller röd.", "…or red.")],
    detektor: [t("34 kapsyler och en nyckel. Inte min nyckel.", "34 bottle caps and a key. Not my key."), t("En skatt! …Nej, en kapsyl.", "Treasure! …No, a bottle cap.")],
    kallbadare: [t("Det är jätteskönt!", "It's lovely!"), t("…12 grader.", "…54 degrees.")],
    mas: [t("MÅSEN!", "SEAGULL!"), t("Hallå!? Min glass!", "Hey!? My ice cream!")],

    // Fler figurer man möter
    techinvesterare: [ // I stan. Vill investera när man plockar upp bajs.
      t("Vi disruptar hundpromenader. Som Uber, fast för bajs.", "We're disrupting dog walking. Like Uber, but for poop."),
      t("Ring mig när ni vill skala upp.", "Call me when you're ready to scale."),
      t("Cirkulär ekonomi! Jag investerar!", "Circular economy! I'm investing!"),
    ],
    homeopat: [ // I kvarteret. Ger hunden en droppe för lugn.
      t("Han behöver en droppe för lugn. Utspädd en miljon gånger.", "He needs a drop for calm. Diluted a million times."),
      t("Det kan ta några år innan det verkar.", "It can take a few years to work."),
      t("Effekt: ingen.", "Effect: none."),               // Står vid hunden efter droppen
    ],
    alfa: [ // I parken. Blir skrämd om hunden springer fram till honom.
      t("Jag vaknar 04.30. Isbad, sen 300 armhävningar.", "I wake up at 4:30. Ice bath, then 300 push-ups."),
      t("AAH! …Jag blev inte rädd. Det var uppvärmning.", "AAH! …I wasn't scared. That was a warm-up."),
      t("Din hund behöver en morgonrutin.", "Your dog needs a morning routine."),
    ],
    matskribent: [ // Vid korvkiosken. Recenserar allt, även bajs.
      t("Korven har en ton av… korv. Fyra av fem.", "This hot dog has notes of… hot dog. Four out of five."),
      t("Modiga smaker, men inte helt övertygande.", "Bold flavors, but not entirely convincing."),
      t("Jordig doftprofil. Lätt nötig. Två av fem.", "Earthy bouquet. Slightly nutty. Two out of five."),
    ],
    larare: [ // I parken, med en klass i reflexvästar
      t("Barn, vad känner vi när vi ser en hund? Vi sätter ord på det.", "Children, what do we feel when we see a dog? Let's put it into words."),
      t("Kom ihåg: alla hundar är olika och lika värda.", "Remember: all dogs are different and equally valuable."),
      t("Fint! Ni visade respekt för vårt gemensamma rum.", "Lovely! You showed respect for our shared space."),
      t("Det här tar vi upp i veckobrevet.", "I'll mention this in the weekly newsletter."), // Om hunden bajsar i närheten
    ],
    klassen: [t("HUNDEN!!", "DOGGY!!"), t("Får jag klappa?", "Can I pet it?"), t("Den luktar!", "It smells!")],
    ordningsvakt: [ // I stan, mitt på gågatan
      t("Stopp! Kontroll. Har hunden legitimation?", "Stop! Checkpoint. Does the dog have ID?"),
      t("…Okej. Ni får passera. Den här gången.", "…Fine. You may pass. This time."),
      t("PRRRT! Det där är inte tillåtet!", "TWEET! That is not allowed!"),       // Om barnet släpas förbi
      t("Nedskräpning! Jag skriver en rapport.", "Littering! I'm writing a report."), // Om hunden bajsar i närheten
    ],
    psykolog: [ // I stan, med en soffa på trottoaren
      t("Och hur känns det när hunden drar?", "And how does it feel when the dog pulls?"),
      t("Intressant. Ni har en otrygg anknytning.", "Interesting. You have an insecure attachment."),
      t("Det blir 1 200 kr. Vi ses nästa vecka.", "That'll be $150. See you next week."),
    ],
    mute: [t("…nej, jag är på mute.", "…no, I'm on mute."), t("Hörs jag nu?", "Can you hear me now?"), t("HÖRS JAG NU?", "CAN YOU HEAR ME NOW?")],
    // Joggaren springer förbi en gång per bana. På stranden orkar han inte mer.
    joggare: [t("Morsning!", "Morning!"), t("Halvmara i maj!", "Half marathon in May!"), t("…halv… mara… i… maj…", "…half… mara… thon… in… May…"), t("Jag har sprungit sedan parken!", "I've been running since the park!"), t("Maj… nästa år…", "May… next year…")],
    gubbe: [t("Jag har bott här i 34 år.", "I've lived here for 34 years.")],
    pappa: [t("Bara fem minuter till…", "Just five more minutes…")],
    tradgubbe: [t("Jag tar dem på vägen tillbaka.", "I'll grab them on the way back.")],
    granne: [t("Vi VET vem du är.", "We KNOW who you are.")],      // Om man lämnar ett bajs
    blot: [t("Tack. Så. Mycket.", "Thanks. So. Much.")],         // Om en blöt hund skakar sig bredvid en
  },

  // Lappar som sitter på lyktstolparna i kvarteret
  lappar: [
    t("Till den som INTE plockar upp efter sin hund. Vi VET vem du är. /Brf Solgläntan", "To whoever does NOT pick up after their dog. We KNOW who you are. /Sunnyside Neighbors"),
    t("Bortsprungen katt. Svarar på namnet Måns. Svarar egentligen inte alls.", "Lost cat. Answers to the name Mittens. Doesn't really answer at all."),
    t("Säljes: barnvagn, nästan oanvänd. Barnet vägrade.", "For sale: stroller, almost unused. The baby refused."),
    t("Hittad: en vante. Sitter på staketet. Har suttit där sedan 2019.", "Found: one mitten. It's on the fence. It's been there since 2019."),
    t("Ny padelbana öppnar snart! (Den 47:e i kommunen.)", "New padel court opening soon! (The 47th in town.)"),
  ],
  // Lappar på lyktstolparna i stan
  lapparStan: [
    t("Uthyres: etta, 12 kvm, 14 000 kr/mån. Charmig! (Ingen dusch.)", "For rent: studio, 130 sq ft, $2,400/month. Charming! (No shower.)"),
    t("Hittad: en hörlur. Bara vänster.", "Found: one earbud. Left only."),
    t("Gratis att hämta: soffa. Lukten ingår.", "Free to take: sofa. Smell included."),
  ],
  // Skyltarna (trottoarpratarna) utanför butikerna i stan
  butiker: [
    t("Hundfrisör Lurvig", "Shaggy Dog Groomer"),
    t("Café Havremjölk", "Oat Milk Café"),
    t("Vintage (= gammalt)", "Vintage (= old)"),
    t("Padelbutiken", "The Padel Shop"),
    t("Kebab & Sushi", "Kebab & Sushi"),
    t("Lokal uthyres", "Space for rent"),
    t("Kaffe 72 kr", "Coffee $7"),
  ],
  // Skyltar på stranden
  skyltarStrand: [
    t("Badvakt i tjänst: tisdagar 13.00–13.15", "Lifeguard on duty: Tuesdays 1:00–1:15 pm"),
    t("Förbjudet att mata måsarna. (Måsarna har inte läst skylten.)", "Do not feed the seagulls. (The seagulls haven't read this sign.)"),
  ],
  glassSkylt: t("Glass 49 kr. Smälter på 4 minuter.", "Ice cream $6. Melts in 4 minutes."),
  kioskSkylt: t("Korv med bröd 45 kr. (Ja, 45.)", "Hot dog $9. (Yes, 9.)"),
  rastgardSkylt: t("Hundrastgård – Hundar ska vara kopplade", "Dog park – Dogs must be on a leash"),

  karlek: t("Det här är kärlek.", "This is love."),  // Syns ibland när man plockar upp
  ingenSag: t("Ingen såg. Eller?", "No one saw. Right?"),  // Om man lämnar ett bajs när påsarna är slut

  utmarkelser: {
    ensamstaende: { namn: t("Ensamstående förälder", "Single parent"), text: t("Släpad efter hunden i 8 sekunder.", "Dragged by the dog for 8 seconds.") },
    detVarInteJag: { namn: t("Det var inte jag", "It wasn't me"), text: t("Ett bajs blev kvar. Ingen såg. Eller?", "A poop got left behind. No one saw. Right?") },
    vardagslyx: { namn: t("Vardagslyx", "Treat yourself"), text: t("Korv till dig själv. Inte till hunden.", "A hot dog for you. Not for the dog.") },
    vuxenpoang: { namn: t("Vuxenpoäng", "Grown-up points"), text: t("Du har sagt \"Fot!\" 25 gånger.", "You've said \"Heel!\" 25 times.") },
    hogskolepoang: { namn: t("Högskolepoäng", "College credit"), text: t("Du har nu en högskolepoäng i hundägande.", "You now have a college credit in dog care.") },
    postvan: { namn: t("Brevbärarens vän", "Mail carrier's friend"), text: t("Hunden lät brevbäraren vara. För en gångs skull.", "The dog left the mail carrier alone. For once.") },
    veckobrevet: { namn: t("Veckobrevet", "The newsletter"), text: t("Din hund nämndes i veckobrevet.", "Your dog was mentioned in the weekly newsletter.") },
    rapporterad: { namn: t("Rapporterad", "Reported"), text: t("Någon har skrivit en rapport om dig.", "Someone has written a report about you.") },
    riskkapital: { namn: t("Riskkapital", "Venture capital"), text: t("Någon investerade i ditt bajs.", "Someone invested in your poop.") },
    foraldralognen: { namn: t("Föräldralögnen", "The parent lie"), text: t("Glassbilen hade visst glass.", "The ice cream truck had ice cream after all.") },
    friskluft: { namn: t("Friskluft", "Fresh air"), text: t("Ute i hela regnskuren. Det var väl skönt?", "Out in the whole rain shower. Wasn't that nice?") },
    kattmanniska: { namn: t("Kattmänniska", "Cat person"), text: t("Du gick hela vägen hem med en katt. I koppel.", "You walked a cat all the way home. On a leash.") },
    viral: { namn: t("Viral", "Viral"), text: t("Du blev viral. Tyvärr för fel sak.", "You went viral. For the wrong reason.") },
    masad: { namn: t("Måsad", "Gulled"), text: t("En mås tog din glass. Som alltid.", "A seagull took your ice cream. As always.") },
    kritiker: { namn: t("Arkitekturkritiker", "Architecture critic"), text: t("Hunden recenserade ett sandslott.", "The dog reviewed a sandcastle.") },
  },

  // Betyget när man kommer fram, efter hur många stjärnor man fick
  betyg: {
    3: t("Hunden är glad. Grannarna är glada. Ingen tror på dig.", "The dog is happy. The neighbors are happy. Nobody believes you."),
    2: t("Ungefär som en vanlig tisdag.", "Pretty much a normal Tuesday."),
    1: t("Mamma tar nästa promenad.", "Mom is doing the next walk."),
  },
  slut: t("Hunden hittade hem själv. Den har aldrig varit gladare.", "The dog found its way home. It's never been happier."),

  // Hundarna som är låsta från början
  lasText: {
    rekord: t("Lås upp: få 800 poäng", "Unlock: score 800 points"),
    hemma: t("Lås upp: kom hem en gång", "Unlock: make it home once"),
  },

  barnFarg: "#4aa3df",  // Barnets jacka
  harFarg: "#5a3a22",   // Barnets hår
  koppelFarg: "#e63946",
  ljud: true,
  musik: true,          // Promenadvisslan i bakgrunden
};

// ---------------------------------------------------------------------
//  Härifrån och ner är själva spelet.
//
//  Allt mäts i "enheter". En enhet är ungefär så stor som barnet.
//  Variabeln u säger hur många pixlar en enhet är på just den här
//  skärmen. x är hur långt åt sidan något är (0 = mitt på vägen) och v
//  är hur långt fram på promenaden det är (0 = där man börjar).
// ---------------------------------------------------------------------

const H = INSTALLNINGAR.humor;
const P = INSTALLNINGAR.poang;
const PRAT = INSTALLNINGAR.pratbubblor;
let KOPPEL = INSTALLNINGAR.koppel; // Sankt Bernhard har lite längre koppel
const canvas = document.getElementById("spel");
const ctx = canvas.getContext("2d");
const hemKnapp = document.getElementById("hem");
const pausKnapp = document.getElementById("paus");
const pausmeny = document.getElementById("pausmeny");
const musikKnapp = document.getElementById("musikKnapp");
const TYPSNITT = 'ui-rounded, system-ui, -apple-system, "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif';
const HANDSTIL = '"Marker Felt", "Chalkboard SE", "Comic Sans MS", ui-rounded, cursive';
const HUSFARGER = ["#f2d98d", "#e8b4a0", "#b9d7ea", "#c9e4b4", "#f0c8d8", "#ece6d6"];
const TAKFARGER = ["#a8443a", "#6b4a3a", "#4a5a6b", "#7a3b5a", "#5a6b3a"];
const VARV = Math.PI * 2;

let bredd = 0;
let hojd = 0;
let u = 0;
let marginal = { topp: 0, vanster: 0, hoger: 0, botten: 0 };
let panelH = 0; // Hur hög panelen högst upp är
let ankare = 0; // Där på skärmen (y) som kameran pekar

// Hur skarpt spelet ritas. 2 är skarpast på iPad. Hinner enheten inte med
// sänks det av sig självt, så att spelet flyter i stället för att hacka.
let pixelSkala = Math.min(window.devicePixelRatio || 1, 2);
let bildtider = [];
const emojiMinne = new Map(); // Färdigritade emojis

let lage = "start"; // "start", "spelar", "paus", "mellan", "hemma" eller "slut"
let banNr = 0;
let langd = 100;     // Hur lång promenaden är
let grans = 3.3;     // Hur långt ut åt sidorna man kan gå
let poang = 0;
let rekord = lasRekord();
let valdHund = Number(lasInstallning("hund-val")) || 0;
if (!INSTALLNINGAR.hundar[valdHund] || arLast(INSTALLNINGAR.hundar[valdHund])) valdHund = 0;
let hundTyp = INSTALLNINGAR.hundar[valdHund];
KOPPEL = INSTALLNINGAR.koppel * (hundTyp.koppel || 1);
let startKnappar = []; // Korten och knappen på startskärmen
let tid = 0;
let speltid = 0;
let tidSedanSlut = 0;
let slutOm = 0;      // Tid kvar innan spelet tar slut (när hunden smitit för sista gången)

let livKvar = INSTALLNINGAR.liv;
let pasar = INSTALLNINGAR.pasarStart;
let humor = H.start;
let humorTrend = 0;  // Om hundmätaren går upp eller ner just nu
let kamera = 0;      // Var på promenaden kameran är
let langst = 0;      // Längst fram man har gått (för poängen)

let saker = [];      // Allt längs vägen: träd, lyktstolpar, katter, folk...
let bajsen = [];
let texter = [];     // Texter som flyger upp
let bubblor = [];    // Pratbubblor
let tassar = [];     // Leriga tassavtryck
let trassel = [];    // Träd och stolpar som kopplet går runt
let trasslad = null; // Det kopplet sitter fast runt just nu
let lapp = null;     // Lappen man läser just nu
let toaster = [];    // Utmärkelser som ska visas
let tips = "";
let tipsTid = 0;
const visadeTips = new Set();
const fatt = new Set(); // Utmärkelser man fått
let stat = nyStatistik();
let betygLista = [];
let fotAntal = 0;
let foljare = 0;     // Nya följare från influencerns filmer
let sparkAntal = 0;  // Hur många elsparkcyklar barnet har sett
let kikare = null;   // Någon som tittar ut genom gardinen
let banStartPoang = 0; // Poängen när banan började (om man försöker igen)
let bilar = [];      // Bilarna på gatan i stan
let masOm = 0;       // Tid tills måsen tar glassen
let nastaHandelse = 0; // Tid tills nästa oväntade händelse
let regn = 0;        // Tid kvar av regnskuren
let regnStyrka = 0;  // 0–1, hur mycket det syns och hörs att det regnar
let brandbil = null; // Brandbilen som åker förbi
let slapTid = 0;
let plockadeTotalt = 0;
let senastWii = -10;
let skakning = 0;

let barn = nyttBarn();
let hund = nyHund();
const hand = { x: 0, y: 0 };     // Där kopplet sitter i barnets hand (pixlar)
const halsband = { x: 0, y: 0 }; // Där kopplet sitter på hunden (pixlar)
const tangent = {};

function nyttBarn() {
  return { x: 0.4, v: 1.2, malX: 0, malV: 0, harMal: false, ror: false, riktning: 1, gangFas: 0, stilla: 0, slapas: 0, lerskor: 0, korv: 0, kioskTid: 0 };
}

function nyHund() {
  return {
    x: 1.1, v: 2.4, lage: "gar", tid: 0, mal: null, malX: 1.1, malV: 2.4, ox: 0.8, ov: 1.4, vandra: 0,
    riktning: 1, fas: 0, fotVila: 0, nosVila: 2, skall: 0, lerig: 0, blot: 0, los: false, sparSteg: 0,
    bajsTid: bajsTakt(),
    nyss: new Set(), // Saker hunden redan brytt sig om
  };
}

// ---------- Hundarna ----------

function arLast(h) {
  if (!h.las) return false;
  if (h.las.rekord && rekord >= h.las.rekord) return false;
  if (h.las.hemma && lasInstallning("hund-hemma") === "ja") return false;
  return true;
}

function lasText(h) {
  return h.las.rekord ? INSTALLNINGAR.lasText.rekord : INSTALLNINGAR.lasText.hemma;
}

function valjHund(i) {
  valdHund = i;
  hundTyp = INSTALLNINGAR.hundar[i];
  KOPPEL = INSTALLNINGAR.koppel * (hundTyp.koppel || 1);
  sparaInstallning("hund-val", String(i));
}

function hundFart() {
  return INSTALLNINGAR.hundFart * (hundTyp.fart || 1);
}

function jaktFart() {
  return INSTALLNINGAR.jaktFart * (hundTyp.fart || 1);
}

function bajsTakt() {
  const [minst, mest] = hundTyp.bajsTakt || INSTALLNINGAR.bajsTakt;
  return slumpMellan(minst, mest);
}

function nyStatistik() {
  return { banTid: 0, gladTid: 0, bajsat: 0, plockade: 0, lamnat: 0, rymt: 0 };
}

// ---------- Små hjälpfunktioner ----------

function slumpa(lista) {
  return lista[Math.floor(Math.random() * lista.length)];
}

function slumpMellan(a, b) {
  return a + Math.random() * (b - a);
}

function slumpSida() {
  return Math.random() < 0.5 ? -1 : 1;
}

// Väljer en sak ur listan. Saker med högt "vanlig" väljs oftare.
function slumpViktat(lista) {
  const summa = lista.reduce((s, t) => s + t.vanlig, 0);
  let r = Math.random() * summa;
  for (const t of lista) {
    r -= t.vanlig;
    if (r <= 0) return t;
  }
  return lista[0];
}

function begr(v, minst, mest) {
  return Math.min(mest, Math.max(minst, v));
}

// Ger samma "slumptal" varje gång för samma n (så att gräset inte blinkar)
function slumpTal(n) {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
}

function avst(a, b) {
  return Math.hypot(a.x - b.x, a.v - b.v);
}

// Gör om en vinkel så att den ligger mellan -π och π
function vinkelNorm(a) {
  while (a > Math.PI) a -= VARV;
  while (a < -Math.PI) a += VARV;
  return a;
}

// Från promenaden till pixlar på skärmen
function SX(x) {
  return bredd / 2 + x * u;
}

function SY(v) {
  return ankare - (v - kamera) * u;
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

  u = Math.min(bredd, hojd) / 10;
  panelH = marginal.topp + Math.max(110, u * 1.4);
  ankare = panelH + (hojd - panelH - marginal.botten) * 0.68;
  satGrans();
  uppdateraKamera(0, true);
  emojiMinne.clear();
}

// Hur långt ut åt sidorna man kan gå, och hur långt ut hunden går av sig själv
const GRANSER = { kvarter: [3.3, 2], park: [4.4, 2.6], stad: [2.6, 2.2], strand: [4.4, 2.6] };
const MARKFARG = { kvarter: "#8ccd66", park: "#84c75c", stad: "#d6d1c8", strand: "#f0d9a0" };

function banTyp() {
  return INSTALLNINGAR.banor[banNr].typ;
}

function satGrans() {
  grans = Math.min(GRANSER[banTyp()][0], bredd / 2 / u - 0.4);
}

// Var vattnet börjar på stranden (det går lite i vågor)
function strandlinje(v) {
  return 3.1 + Math.sin(v * 0.45) * 0.35 + Math.sin(v * 1.3) * 0.15;
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

let fingerNere = false;
let fingerX = 0;
let fingerY = 0;

// Barnet går mot det ställe på skärmen där fingret är
function malFranFinger() {
  barn.malX = (fingerX - bredd / 2) / u;
  barn.malV = kamera + (ankare - fingerY) / u;
  barn.harMal = true;
}

function tryckIgang() {
  if (lage === "slut" && tidSedanSlut > 1 && banNr > 0) {
    forsokIgen();
    return true;
  }
  if ((lage === "slut" || lage === "hemma") && tidSedanSlut > 1) {
    visaStart(); // Tillbaka till startskärmen, där man kan välja en annan hund
    return true;
  }
  if (lage === "start") {
    if (!arLast(hundTyp)) startaSpel();
    return true;
  }
  if (lage === "mellan" && tidSedanSlut > 1) {
    nastaBana();
    return true;
  }
  return false;
}

// Tryck på startskärmen: välj en hund eller tryck på knappen för att gå ut
function tryckPaStart(px, py) {
  for (const k of startKnappar) {
    if (px < k.x || px > k.x + k.w || py < k.y || py > k.y + k.h) continue;
    if (k.start) {
      tryckIgang();
    } else if (k.i !== valdHund) {
      const h = INSTALLNINGAR.hundar[k.i];
      valjHund(k.i);
      spelaTon(arLast(h) ? 300 : 700, arLast(h) ? 200 : 1000, 0.1, "triangle", 0.08);
    }
    return;
  }
}

canvas.addEventListener("pointerdown", (e) => {
  e.preventDefault();
  startaLjud();
  if (lage === "start") {
    tryckPaStart(e.clientX, e.clientY);
    return;
  }
  if (tryckIgang() || lage !== "spelar") return;
  // Trycker man på hunden säger barnet "Fot!"
  const hs = hundTyp.storlek || 1;
  if (Math.hypot(e.clientX - SX(hund.x), e.clientY - (SY(hund.v) - u * 0.35 * hs)) < u * 0.85 * hs) {
    sagFot();
    return;
  }
  fingerNere = true;
  try {
    canvas.setPointerCapture(e.pointerId);
  } catch (fel) {
    // Gör inget – det fungerar ändå
  }
  fingerX = e.clientX;
  fingerY = e.clientY;
  malFranFinger();
});

canvas.addEventListener("pointermove", (e) => {
  if (!fingerNere) return;
  fingerX = e.clientX;
  fingerY = e.clientY;
});

canvas.addEventListener("pointerup", () => {
  fingerNere = false;
});

canvas.addEventListener("pointercancel", () => {
  fingerNere = false;
});

window.addEventListener("keydown", (e) => {
  if (e.key === "p" || e.key === "Escape") {
    if (lage === "spelar") pausa();
    else if (lage === "paus") fortsatt();
    return;
  }
  if (lage === "start" && (e.key === "ArrowLeft" || e.key === "ArrowRight")) {
    const n = INSTALLNINGAR.hundar.length;
    valjHund((valdHund + (e.key === "ArrowLeft" ? n - 1 : 1)) % n);
    return;
  }
  if (e.key === " " || e.key === "Enter") {
    startaLjud();
    if (!tryckIgang() && lage === "spelar" && e.key === " ") sagFot();
    e.preventDefault();
    return;
  }
  tangent[e.key.toLowerCase()] = true;
});

window.addEventListener("keyup", (e) => {
  tangent[e.key.toLowerCase()] = false;
});

// Stoppa nyp-zoom i Safari på iPad/iPhone
document.addEventListener("gesturestart", (e) => e.preventDefault());

// ---------- Paus ----------

function pausa() {
  if (lage !== "spelar") return;
  lage = "paus";
  fingerNere = false;
  for (const k in tangent) tangent[k] = false;
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
  sparaInstallning("musik-hund", musikPa ? "pa" : "av");
  visaMusikKnapp();
});

// Pausa av sig själv om man byter app eller flik
document.addEventListener("visibilitychange", () => {
  if (document.hidden) pausa();
});

// ---------- Bygga promenaden ----------

function nyPerson(sort, x, v, extra) {
  const p = { typ: "person", sort, x, v, fart: 0, fas: Math.random() * 6, sagt: 0, vila: 0, ...extra };
  if (sort === "joggare") {
    p.bild = "🏃";
    p.fart = -3.6;
    if (p.pass === 4) {
      // Utslagen på stranden
      p.bild = "🥵";
      p.fart = 0;
      p.ligger = true;
    }
  } else if (sort === "hundagare") {
    p.bild = slumpa(["🚶‍♂️", "🚶‍♀️", "🚶"]);
    p.fart = -1;
    p.hund = slumpa(INSTALLNINGAR.andraHundar);
  } else if (sort === "influencer") {
    p.bild = p.pass === 4 ? "🧘‍♀️" : "🧍‍♀️";
    p.fart = [-0.8, -0.5, -0.8, -0.6, 0][p.pass] || 0;
    p.telefon = true;
    p.viralVila = 0;
    if (p.pass === 2) {
      p.vaska = true; // Coco åker i handväskan
    } else if (p.pass === 4) {
      p.stativ = true; // Yoga på stranden, med telefonen på ett stativ
    } else {
      p.hund = "🐩";
      p.rosett = true;
    }
  } else if (sort === "padel") {
    p.bild = "🤾‍♂️";
    p.racket = true;
  } else if (sort === "mute") {
    p.bild = "🚶‍♀️";
    p.fart = -0.9;
    p.lurar = true;
  } else if (sort === "gubbe") {
    p.bild = "👴";
  } else if (sort === "pappa") {
    p.bild = "🧔";
    p.telefon = true;
  } else if (sort === "tradgubbe") {
    p.bild = "🧍‍♂️";
  } else if (sort === "granne") {
    p.bild = "👵";
  } else if (sort === "lattepappa") {
    p.bild = "🧍‍♂️";
    p.vagn = true;
    p.kaffe = true;
  } else if (sort === "musikant") {
    p.bild = "🕺";
    p.gitarr = true;
  } else if (sort === "brevbarare" && p.handelse) {
    // Kommer springande med ett paket. Hunden ser honom på jättelångt håll.
    p.bild = "🏃";
    p.fart = -1.8;
    p.lockar = 6;
    p.paket = true;
  } else if (sort === "brevbarare") {
    p.bild = "🚶‍♂️";
    p.fart = -0.8;
    p.lockar = 4.5; // Hunden HATAR brevbärare och ser dem på långt håll
    p.post = true;
  } else if (sort === "cykelbud") {
    p.bild = "🚴";
    p.fart = -5.5;
    p.lockar = 3.2;
    p.matlada = true;
  } else if (sort === "byggare") {
    p.bild = "👧";
    p.hink = true;
  } else if (sort === "solbadare") {
    p.bild = "😎";
  } else if (sort === "detektor") {
    p.bild = "🧍‍♂️";
    p.fart = -0.35;
    p.detektor = true;
  } else if (sort === "kallbadare") {
    p.bild = "🏊";
    p.iVatten = true;
    p.lockar = 3.5; // Hunden vill bada med honom
  } else if (sort === "techinvesterare") {
    p.bild = "🕴️"; // Svävar fram
    p.skala = 1.3;
    p.fart = -0.9;
    p.lurar = true;
    p.telefon = true;
  } else if (sort === "homeopat") {
    p.bild = "🧍‍♀️";
    p.fart = -0.7;
    p.extra = [["🌿", -0.3, -0.85, 0.3], ["🧪", 0.3, -0.5, 0.3]];
  } else if (sort === "alfa") {
    p.bild = "🏋️‍♂️";
    p.lockar = 2.8; // Hunden vill hälsa. Det vill inte han.
    p.extra = [["🥤", 0.45, -0.25, 0.3]];
  } else if (sort === "matskribent") {
    p.bild = "🤵";
    p.extra = [["📝", 0.3, -0.5, 0.3], ["🌭", -0.3, -0.55, 0.3]];
  } else if (sort === "psykolog") {
    p.bild = "🧍";
    p.extra = [["🛋️", -0.95, -0.3, 0.85], ["📋", 0.3, -0.5, 0.3]];
  } else if (sort === "larare") {
    p.bild = "🧍‍♀️";
    p.fart = -0.6;
    p.lockar = 3.2; // Hunden vill hälsa på barnen
    p.klass = 4;    // Så många barn i reflexväst som går efter
    p.extra = [["📚", 0.3, -0.45, 0.3]];
  } else if (sort === "ordningsvakt") {
    p.bild = "🧍‍♂️";
    p.extra = [["🦺", 0, -0.5, 0.45], ["📋", 0.38, -0.45, 0.28]];
  }
  if (p.hund) {
    p.hundX = x + 0.7;
    p.hundV = v + 0.1;
  }
  return p;
}

// Finns det plats för något här?
function ledigt(x, v, r) {
  for (const s of saker) {
    if (s.typ === "damm") {
      if (((x - s.x) / (s.rx + r)) ** 2 + ((v - s.v) / (s.rv + r)) ** 2 < 1) return false;
    } else if (s.typ === "rastgard") {
      if (x * s.sida > 2.1 - r && v > s.v0 - r && v < s.v1 + r) return false;
    } else if (s.x !== undefined && s.typ !== "person") {
      const rs = s.typ === "kiosk" ? 1.4 : s.typ === "bank" ? 1 : 0.5;
      if (Math.hypot(s.x - x, s.v - v) < r + rs) return false;
    }
  }
  return true;
}

function laggGodsak(x, v) {
  if (!ledigt(x, v, 0.5)) return;
  const g = slumpViktat(INSTALLNINGAR.godsaker);
  saker.push({ typ: "godsak", x, v, bild: g.bild, poang: g.poang, guld: !!g.guld, pase: !!g.pase, fas: Math.random() * 6 });
}

function laggPol(x, v) {
  if (ledigt(x, v, 0.6)) saker.push({ typ: "pol", x, v, r: slumpMellan(0.45, 0.65) });
}

// Elsparkcyklar som någon har slängt mitt på trottoaren
function laggSparkcyklar(antal, kant) {
  for (let i = 0; i < antal; i++) {
    const v = slumpMellan(langd * 0.1, langd * 0.9);
    const x = slumpSida() * slumpMellan(kant - 0.6, kant);
    if (ledigt(x, v, 0.8)) saker.push({ typ: "sparkcykel", x, v, stam: 0.18, nosbar: true, lutning: slumpMellan(-0.3, 0.3) });
  }
}

function laggAutomater(sidX) {
  for (let v = 20; v < langd - 8; v += 30) {
    let vv = v;
    const sida = slumpSida();
    while (!ledigt(sida * sidX, vv, 0.6) && vv < v + 6) vv += 1;
    saker.push({ typ: "automat", x: sida * sidX, v: vv, stam: 0.12, nosbar: true });
  }
}

function byggKvarteret() {
  // Hus på båda sidor om trottoaren
  const hus = [];
  for (const sida of [-1, 1]) {
    let v = -8;
    while (v < langd + 10) {
      const l = slumpMellan(5, 8);
      const h = { typ: "hus", sida, v0: v, v1: v + l, farg: slumpa(HUSFARGER), tak: slumpa(TAKFARGER) };
      saker.push(h);
      hus.push(h);
      v += l + slumpMellan(1.2, 2.7);
    }
  }

  // Den sura gubben med den perfekta gräsmattan bor ungefär 40 % in på promenaden
  const mitt = langd * 0.42;
  const gubbHus = hus
    .filter((h) => h.v0 > 12 && h.v1 < langd - 12)
    .sort((a, b) => Math.abs((a.v0 + a.v1) / 2 - mitt) - Math.abs((b.v0 + b.v1) / 2 - mitt))[0];
  const gras = { typ: "grasmatta", sida: gubbHus.sida, v0: gubbHus.v0 - 0.6, v1: gubbHus.v1 + 0.6 };
  saker.push(gras);
  saker.push(nyPerson("gubbe", gubbHus.sida * 3.1, (gras.v0 + gras.v1) / 2, { gras }));

  // Staket framför de flesta andra husen. Där sitter katterna.
  const staket = [];
  for (const h of hus) {
    if (h === gubbHus || Math.random() < 0.35) continue;
    const s = { typ: "staket", sida: h.sida, v0: h.v0, v1: h.v1 };
    saker.push(s);
    staket.push(s);
  }

  // Lyktstolpar, varannan på varje sida. På några sitter det lappar.
  const lyktor = [];
  let sida = slumpSida();
  for (let v = 5; v < langd - 4; v += slumpMellan(8, 12)) {
    const l = { typ: "lykta", x: sida * 1.85, v, stam: 0.12, nosbar: true };
    saker.push(l);
    lyktor.push(l);
    sida = -sida;
  }
  INSTALLNINGAR.lappar.forEach((text, i) => {
    const l = lyktor[Math.floor(((i + 0.4) / INSTALLNINGAR.lappar.length) * lyktor.length)];
    if (l) l.lapp = text;
  });

  // Några träd i trädgårdarna
  for (let v = 4; v < langd; v += slumpMellan(8, 14)) {
    const s = slumpSida();
    const x = s * slumpMellan(2.5, 2.9);
    const paGras = s === gras.sida && v > gras.v0 - 1 && v < gras.v1 + 1;
    if (!paGras && ledigt(x, v, 0.8)) saker.push({ typ: "trad", x, v, stam: 0.2, nosbar: true, storlek: slumpMellan(1.3, 1.7) });
  }

  laggAutomater(1.95);

  // Det som händer längs vägen
  for (let v = 10; v < langd - 8; v += slumpMellan(4.5, 7.5)) {
    const r = Math.random();
    if (r < 0.32) {
      const s = slumpSida();
      const pa = staket.find((st) => st.sida === s && v > st.v0 + 0.5 && v < st.v1 - 0.5);
      const x = pa ? s * 3.45 : s * slumpMellan(2.6, 3.1);
      const paGras = s === gras.sida && v > gras.v0 - 1 && v < gras.v1 + 1;
      if (!paGras && ledigt(x, v, 0.5)) saker.push({ typ: "katt", x, v, bild: slumpa(INSTALLNINGAR.katter), ut: 1 });
    } else if (r < 0.48) {
      laggPol(slumpMellan(-1, 1), v);
    } else {
      laggGodsak(slumpMellan(-1.3, 1.3), v);
    }
  }

  // Folk man möter
  saker.push(nyPerson("joggare", 1, langd * 0.2, { pass: 0 }));
  saker.push(nyPerson("hundagare", -0.9, langd * 0.32));
  saker.push(nyPerson("influencer", 0.8, langd * 0.47, { pass: 0 }));
  saker.push(nyPerson("mute", 0.9, langd * 0.58));
  saker.push(nyPerson("padel", slumpSida() * 2.9, langd * 0.69));
  saker.push(nyPerson("hundagare", -0.9, langd * 0.8));
  saker.push(nyPerson("homeopat", 0.8, langd * 0.9));
  laggSparkcyklar(3, 1.4);
}

function byggParken() {
  // Dammen med ankorna
  const damm = { typ: "damm", x: slumpSida() * 3.75, v: langd * 0.27, rx: 1.9, rv: 1.5 };
  saker.push(damm);
  for (let i = 0; i < 3; i++) saker.push({ typ: "anka", damm, vinkel: i * 2.1, x: damm.x, v: damm.v, lyft: 0, ut: 1 });

  // Trädet med bajspåsarna, och mannen som ska ta dem på vägen tillbaka
  const s2 = slumpSida();
  const tv = langd * 0.41;
  saker.push({ typ: "trad", x: s2 * 2.6, v: tv, stam: 0.22, nosbar: true, storlek: 1.8, pasar: true });
  saker.push(nyPerson("tradgubbe", s2 * 1.75, tv - 0.5));

  // Korvkiosken och pappa på parkbänken
  const s3 = slumpSida();
  saker.push({ typ: "kiosk", x: s3 * 2.8, v: langd * 0.52, sida: s3, kopt: false });
  saker.push(nyPerson("matskribent", s3 * 1.7, langd * 0.52 + 1.1));
  saker.push(nyPerson("alfa", -s3 * 2.3, langd * 0.46));
  saker.push(nyPerson("larare", 0.6, langd * 0.69));
  const bank = { typ: "bank", x: -s3 * 2.4, v: langd * 0.63 };
  saker.push(bank);
  saker.push(nyPerson("pappa", bank.x, bank.v - 0.05));

  // Hundrastgården
  const s5 = slumpSida();
  const rv = langd * 0.8;
  saker.push({ typ: "rastgard", sida: s5, v0: rv, v1: rv + 3.6 });
  saker.push({ typ: "skylt", x: s5 * 1.85, v: rv - 0.4, text: INSTALLNINGAR.rastgardSkylt });

  // Parklampor
  let sida = slumpSida();
  for (let v = 8; v < langd - 6; v += slumpMellan(15, 20)) {
    if (ledigt(sida * 1.65, v, 0.6)) saker.push({ typ: "lykta", x: sida * 1.65, v, stam: 0.12, nosbar: true });
    sida = -sida;
  }

  laggAutomater(1.7);

  // Massor av träd
  for (let v = 1; v < langd + 4; v += slumpMellan(1.4, 3)) {
    const x = slumpSida() * slumpMellan(2.1, 4.9);
    if (ledigt(x, v, 0.9)) saker.push({ typ: "trad", x, v, stam: 0.22, nosbar: true, storlek: slumpMellan(1.4, 2) });
  }

  // Ekorrar i några av träden nära vägen
  const naraTrad = saker.filter((s) => s.typ === "trad" && !s.pasar && Math.abs(s.x) < 3.2 && s.v > 10 && s.v < langd - 10);
  for (let i = 0; i < 6 && naraTrad.length; i++) {
    const t = naraTrad.splice(Math.floor(Math.random() * naraTrad.length), 1)[0];
    saker.push({ typ: "ekorre", trad: t, vinkel: Math.random() * VARV, varv: slumpSida(), x: t.x, v: t.v, ut: 1, tid: 0 });
  }

  // Det som händer längs vägen
  for (let v = 8; v < langd - 8; v += slumpMellan(5, 8)) {
    const r = Math.random();
    if (r < 0.1) {
      const x = slumpSida() * slumpMellan(2.4, 3.2);
      if (ledigt(x, v, 0.6)) saker.push({ typ: "katt", x, v, bild: slumpa(INSTALLNINGAR.katter), ut: 1 });
    } else if (r < 0.28) {
      laggPol(slumpMellan(-0.9, 0.9), v);
    } else {
      laggGodsak(slumpMellan(-1.2, 1.2), v);
    }
  }

  // Folk man möter
  saker.push(nyPerson("joggare", 1, langd * 0.13, { pass: 1 }));
  saker.push(nyPerson("hundagare", -0.8, langd * 0.21));
  saker.push(nyPerson("influencer", 0.8, langd * 0.35, { pass: 1 }));
  saker.push(nyPerson("hundagare", -0.8, langd * 0.6));
  saker.push(nyPerson("influencer", 0.8, langd * 0.76, { pass: 2 }));
  saker.push(nyPerson("joggare", 1, langd * 0.9, { pass: 2 }));
  laggSparkcyklar(2, 1.1);
}

const BUTIKSFARGER = ["#e8b4a0", "#f2d98d", "#b9d7ea", "#d9c8f0", "#c9e4b4", "#f0c8d8"];
const MARKISFARGER = ["#e63946", "#2a9d8f", "#f4a261", "#264653", "#9b5de5"];
const HYTTFARGER = ["#4aa3df", "#e63946", "#2ecc71", "#f4a261", "#9b59b6"];

// En flock fåglar som pickar på marken (duvor i stan, måsar på stranden)
function laggFaglar(x, v, antal) {
  const flock = {};
  for (let i = 0; i < antal; i++) {
    const hx = x + slumpMellan(-0.8, 0.8);
    const hv = v + slumpMellan(-0.7, 0.7);
    saker.push({ typ: "fagel", flock, hemX: hx, hemV: hv, x: hx, v: hv, fas: Math.random() * 6, lyft: 0, ut: 1, riktning: slumpSida() });
  }
}

function byggStan() {
  // Fontänen med duvorna
  const fv = langd * 0.3;
  saker.push({ typ: "damm", fontan: true, x: -1.3, v: fv, rx: 0.85, rv: 0.85 });
  laggFaglar(0.7, fv, 6);

  // Caféet med lattepappan, och gatumusikanten
  const cafe = { typ: "cafe", x: -2.05, v: langd * 0.5 };
  saker.push(cafe);
  saker.push(nyPerson("lattepappa", -1.35, cafe.v - 0.35));
  saker.push(nyPerson("musikant", 1.9, langd * 0.64));

  // Lyktstolpar vid trottoarkanten, med lappar
  const lyktor = [];
  for (let v = 6; v < langd - 4; v += slumpMellan(10, 14)) {
    if (!ledigt(2.4, v, 0.6)) continue;
    const l = { typ: "lykta", x: 2.4, v, stam: 0.12, nosbar: true };
    saker.push(l);
    lyktor.push(l);
  }
  INSTALLNINGAR.lapparStan.forEach((text, i) => {
    const l = lyktor[Math.floor(((i + 0.5) / INSTALLNINGAR.lapparStan.length) * lyktor.length)];
    if (l) l.lapp = text;
  });

  // Butiker till vänster, med en skylt utanför de flesta
  const namn = [...INSTALLNINGAR.butiker].sort(() => Math.random() - 0.5);
  let n = 0;
  for (let v = -8; v < langd + 10; ) {
    const l = slumpMellan(5, 7);
    saker.push({ typ: "butik", v0: v, v1: v + l, farg: slumpa(BUTIKSFARGER), markis: slumpa(MARKISFARGER) });
    const sv = v + l / 2;
    if (sv > 4 && sv < langd - 4 && ledigt(-2.2, sv, 0.8)) {
      saker.push({ typ: "pratare", x: -2.2, v: sv, text: namn[n++ % namn.length], stam: 0.15, nosbar: true });
    }
    v += l + 0.15;
  }

  laggAutomater(2.4);
  laggSparkcyklar(5, 2.2);

  // Det som händer längs vägen
  for (let v = 8; v < langd - 8; v += slumpMellan(5, 8)) {
    const r = Math.random();
    if (r < 0.25) {
      if (ledigt(0.5, v, 1.5)) laggFaglar(slumpMellan(-0.5, 1.2), v, 4);
    } else if (r < 0.35) {
      laggPol(slumpMellan(-1, 1.5), v);
    } else {
      laggGodsak(slumpMellan(-1.5, 1.8), v);
    }
  }

  // Folk man möter
  saker.push(nyPerson("joggare", 1, langd * 0.14, { pass: 3 }));
  saker.push(nyPerson("cykelbud", 0.9, langd * 0.24));
  saker.push(nyPerson("techinvesterare", 0.8, langd * 0.34));
  saker.push(nyPerson("psykolog", -1.6, langd * 0.8));
  saker.push(nyPerson("ordningsvakt", 0.3, langd * 0.58));
  saker.push(nyPerson("brevbarare", -0.6, langd * 0.42));
  saker.push(nyPerson("influencer", 0.8, langd * 0.56, { pass: 3 }));
  saker.push(nyPerson("cykelbud", -0.3, langd * 0.74));
  saker.push(nyPerson("hundagare", -0.8, langd * 0.9));
}

function byggStranden() {
  // Badhytter längst till vänster
  for (let v = 1; v < langd + 4; v += slumpMellan(2.4, 4)) {
    saker.push({ typ: "badhytt", x: -3.9, v, farg: slumpa(HYTTFARGER) });
  }

  // Glasskiosken (och måsen som tar glassen)
  saker.push({ typ: "kiosk", x: -2.65, v: langd * 0.36, sida: -1, kopt: false, glass: true });

  // Sandslottet och flickan som byggt det
  const slott = { typ: "sandslott", x: 2, v: langd * 0.54 };
  saker.push(slott);
  saker.push(nyPerson("byggare", 2.5, slott.v - 0.35, { slott }));

  // Folk på stranden
  saker.push(nyPerson("solbadare", -2.3, langd * 0.22));
  saker.push(nyPerson("kallbadare", strandlinje(langd * 0.68) + 0.9, langd * 0.68));
  saker.push(nyPerson("joggare", -2.1, langd * 0.62, { pass: 4 }));
  saker.push(nyPerson("influencer", -2.3, langd * 0.83, { pass: 4 }));

  // Skyltar
  const ikoner = [["🛟", "⏰"], ["🕊️", "🚫"]];
  INSTALLNINGAR.skyltarStrand.forEach((text, i) => {
    saker.push({ typ: "skylt", x: i % 2 ? 1.6 : -1.6, v: langd * (0.12 + i * 0.33), text, ikoner: ikoner[i % 2] });
  });

  laggAutomater(1.55);

  // Tånghögar att nosa på
  for (let v = 3; v < langd - 2; v += slumpMellan(3.5, 6)) {
    const x = slumpSida() * slumpMellan(1.6, 2.3);
    if (ledigt(x, v, 0.6)) saker.push({ typ: "tang", x, v, stam: 0.1, nosbar: true, fas: Math.random() * 6 });
  }

  // Parasoller på sanden
  for (let v = 4; v < langd - 2; v += slumpMellan(4, 7)) {
    const sida = slumpSida();
    const x = sida > 0 ? slumpMellan(1.8, strandlinje(v) - 0.9) : slumpMellan(-3, -1.8);
    if (ledigt(x, v, 0.9)) saker.push({ typ: "parasoll", x, v, stam: 0.06, nosbar: true });
  }

  // Krabbor vid vattenbrynet
  for (let i = 0; i < 7; i++) {
    const v = slumpMellan(langd * 0.08, langd * 0.95);
    const x = strandlinje(v) - 0.6;
    if (ledigt(x, v, 0.5)) saker.push({ typ: "krabba", x, v, fas: Math.random() * 6, riktning: slumpSida(), ut: 1 });
  }

  // Det som händer längs vägen
  for (let v = 8; v < langd - 8; v += slumpMellan(5, 8)) {
    if (Math.random() < 0.3) {
      if (ledigt(2, v, 1.5)) laggFaglar(2, v, 4); // Måsar
    } else {
      laggGodsak(slumpMellan(-1, 1), v);
    }
  }

  // Folk man möter
  saker.push(nyPerson("hundagare", -0.6, langd * 0.18));
  saker.push(nyPerson("detektor", -1.9, langd * 0.46));
  saker.push(nyPerson("hundagare", 0.6, langd * 0.75));
}

function byggBana() {
  saker = [];
  bajsen = [];
  texter = [];
  bubblor = [];
  tassar = [];
  trassel = [];
  trasslad = null;
  lapp = null;
  kikare = null;
  fingerNere = false;
  langd = INSTALLNINGAR.banor[banNr].langd;
  satGrans();
  bilar = [];
  masOm = 0;
  regn = 0;
  regnStyrka = 0;
  brandbil = null;
  nastaHandelse = INSTALLNINGAR.handelser.forstaEfter;
  banStartPoang = poang;
  const typ = banTyp();
  if (typ === "kvarter") byggKvarteret();
  else if (typ === "park") byggParken();
  else if (typ === "stad") byggStan();
  else byggStranden();
  barn = nyttBarn();
  const gammalHund = hund;
  hund = nyHund();
  if (lage !== "start") hund.bajsTid = Math.max(6, gammalHund.bajsTid);
  langst = barn.v;
  stat = nyStatistik();
  uppdateraKamera(0, true);
}

// ---------- Spelets regler ----------

function visaStart() {
  lage = "start";
  banNr = 0;
  byggBana();
  if (arLast(hundTyp)) valjHund(0);
}

function startaSpel() {
  valjHund(valdHund);
  lage = "spelar";
  poang = 0;
  speltid = 0;
  slutOm = 0;
  livKvar = INSTALLNINGAR.liv;
  pasar = INSTALLNINGAR.pasarStart;
  humor = H.start;
  humorTrend = 0;
  fatt.clear();
  visadeTips.clear();
  toaster = [];
  betygLista = [];
  fotAntal = 0;
  foljare = 0;
  sparkAntal = 0;
  slapTid = 0;
  plockadeTotalt = 0;
  musikSteg = 0;
  banNr = 0;
  byggBana();
  visaTips(t("Dra med fingret för att gå. Tryck på hunden: Fot!", "Drag your finger to walk. Tap the dog: Heel!"), 5);
}

function nastaBana() {
  banNr += 1;
  lage = "spelar";
  byggBana();
  const b = INSTALLNINGAR.banor[banNr];
  visaTips(b.tips || b.namn + "!", 3.5);
}

// Försök igen från början av banan man var på, med poängen man hade då
function forsokIgen() {
  lage = "spelar";
  poang = banStartPoang;
  slutOm = 0;
  livKvar = INSTALLNINGAR.liv;
  pasar = INSTALLNINGAR.pasarStart;
  humor = H.start;
  humorTrend = 0;
  byggBana();
  visaTips(INSTALLNINGAR.banor[banNr].namn + t(" – igen!", " – again!"), 3);
}

function raknaStjarnor(s) {
  let st = 3;
  if (s.gladTid / Math.max(1, s.banTid) < 0.6) st -= 1;
  if (s.lamnat > 0 || s.rymt > 0) st -= 1;
  return Math.max(1, st);
}

function banaKlar() {
  betygLista.push(raknaStjarnor(stat));
  tidSedanSlut = 0;
  fingerNere = false;
  bubblor = [];
  if (banNr < INSTALLNINGAR.banor.length - 1) {
    lage = "mellan";
    spelaArpeggio([523, 659, 784]);
  } else {
    lage = "hemma";
    if (hundTyp.katt) utmarkelse("kattmanniska");
    sparaInstallning("hund-hemma", "ja");
    sparaOmRekord();
    spelaArpeggio([523, 659, 784, 1047]);
  }
}

function slutaSpel() {
  lage = "slut";
  tidSedanSlut = 0;
  fingerNere = false;
  sparaOmRekord();
}

function sparaOmRekord() {
  if (poang > rekord) {
    rekord = poang;
    sparaRekord(rekord);
  }
}

function ge(text, mangd, x, v, farg) {
  poang = Math.max(0, poang + mangd);
  const tal = mangd > 0 ? ` +${mangd}` : mangd < 0 ? ` ${mangd}` : "";
  texter.push({ x, v, text: (text || "") + tal, kvar: 1.5, stor: !!text, farg });
}

function visaText(text, x, v, farg, stor = true, kvar = 1.3) {
  texter.push({ x, v, text, kvar, stor, farg });
}

function saga(agare, text, langd = 2.8) {
  bubblor = bubblor.filter((b) => b.agare !== agare);
  bubblor.push({ agare, text, kvar: langd });
}

function visaTips(text, langd) {
  tips = text;
  tipsTid = langd;
}

function visaTipsEnGang(nyckel, text, langd = 4) {
  if (visadeTips.has(nyckel)) return;
  visadeTips.add(nyckel);
  visaTips(text, langd);
}

function visaLapp(text) {
  lapp = { text, kvar: 5.5, vinkel: slumpMellan(-0.04, 0.04) };
  spelaTon(2600, 1800, 0.06, "triangle", 0.04);
  spelaTon(2200, 1500, 0.06, "triangle", 0.04, 0.08);
}

function utmarkelse(nyckel) {
  if (fatt.has(nyckel)) return;
  fatt.add(nyckel);
  const m = INSTALLNINGAR.utmarkelser[nyckel];
  if (!m) return;
  toaster.push({ namn: m.namn, text: m.text, kvar: 4.5 });
  spelaArpeggio([784, 988, 1175, 1568]);
}

function sagFot() {
  const h = hund;
  if (h.los) {
    saga(barn, t("Fot!!", "Heel!!"), 0.9);
    visaText(t("Hunden lyssnar inte!", "The dog isn't listening!"), h.x, h.v + 1, "#ffd1d1");
    return;
  }
  if (h.lage === "bajsar") {
    saga(barn, t("Fot…?", "Heel…?"), 0.9);
    visaText(t("Det går inte att stoppa.", "There's no stopping it."), h.x, h.v + 1, "#ffe9b3");
    return;
  }
  if (h.lage === "trasslad") {
    saga(barn, t("Fot…?", "Heel…?"), 0.9);
    visaTips(t("Kopplet har trasslat sig! Gå runt trädet.", "The leash is tangled! Walk around the tree."), 3);
    return;
  }
  if (h.lage === "apport") {
    saga(barn, t("Hit med bollen!", "Bring the ball!"), 1);
    return;
  }
  if (h.fotVila > 0) {
    saga(barn, t("Fot…?", "Heel…?"), 0.9);
    return;
  }
  if (hundTyp.katt && Math.random() < 0.4) {
    saga(barn, t("Fot!", "Heel!"), 1);
    visaText(t("Katten ignorerar dig.", "The cat ignores you."), h.x, h.v + 1, "#ffe9b3");
    h.fotVila = 1.5;
    return;
  }
  saga(barn, t("Fot!", "Heel!"), 1);
  spelaTon(1400, 1500, 0.12, "sine", 0.08);
  spelaTon(1500, 2100, 0.2, "sine", 0.08, 0.14);
  fotAntal += 1;
  if (fotAntal >= 25) utmarkelse("vuxenpoang");
  if (h.lage === "spand") ge(hundTyp.katt ? t("Bra katt!", "Good cat!") : t("Bra hund!", "Good dog!"), P.fot, h.x, h.v + 1, "#b6f09c");
  if (h.lage === "halsar" && h.mal) {
    h.mal.vantar = false;
    h.mal.halsat = true;
  }
  h.lage = "fot";
  h.mal = null;
  h.tid = 3;
  h.fotVila = INSTALLNINGAR.fotVila;
  humor = Math.max(0, humor + H.fot);
}

// ---------- Barnet ----------

function uppdateraBarn(dt) {
  const b = barn;
  if (fingerNere) malFranFinger();
  const kx = (tangent.arrowright || tangent.d ? 1 : 0) - (tangent.arrowleft || tangent.a ? 1 : 0);
  const kv = (tangent.arrowup || tangent.w ? 1 : 0) - (tangent.arrowdown || tangent.s ? 1 : 0);
  let dx = 0;
  let dv = 0;
  let kvar = Infinity;
  if (kx || kv) {
    b.harMal = false;
    dx = kx;
    dv = kv;
  } else if (b.harMal) {
    kvar = Math.hypot(b.malX - b.x, b.malV - b.v);
    if (kvar < 0.05) {
      b.harMal = false;
    } else {
      dx = b.malX - b.x;
      dv = b.malV - b.v;
    }
  }
  if (b.stopp > 0) {
    // Ordningsvakten har stoppat barnet för kontroll
    b.stopp -= dt;
    dx = 0;
    dv = 0;
  }
  const l = Math.hypot(dx, dv);
  b.ror = l > 0;
  if (b.ror) {
    const steg = Math.min(kvar, INSTALLNINGAR.fart * dt);
    b.x += (dx / l) * steg;
    b.v += (dv / l) * steg;
    if (Math.abs(dx / l) > 0.3) b.riktning = Math.sign(dx);
    b.gangFas += dt * 11;
    b.stilla = 0;
  } else {
    b.stilla += dt;
  }
  b.slapas = Math.max(0, b.slapas - dt);
  b.lerskor = Math.max(0, b.lerskor - dt);
  b.korv = Math.max(0, b.korv - dt);
}

// Puttar ut barnet eller hunden från träd, kiosken, bänken och dammen
function hindra(f, arBarn) {
  for (const s of saker) {
    if (s.x === undefined && s.typ !== "rastgard") continue;
    if (s.typ === "rastgard") {
      // Staketet runt hundrastgården
      const inne = f.x * s.sida;
      if (inne > 2.15 && f.v > s.v0 - 0.2 && f.v < s.v1 + 0.2) {
        const tillSida = inne - 2.15;
        const tillTopp = s.v1 + 0.2 - f.v;
        const tillBotten = f.v - (s.v0 - 0.2);
        const minst = Math.min(tillSida, tillTopp, tillBotten);
        if (minst === tillSida) f.x = s.sida * 2.15;
        else if (minst === tillTopp) f.v = s.v1 + 0.2;
        else f.v = s.v0 - 0.2;
      }
      continue;
    }
    if (Math.abs(s.v - f.v) > 3) continue;
    let r = 0;
    if (s.stam) r = s.stam + 0.22;
    else if (s.typ === "kiosk") r = 0.95;
    else if (s.typ === "bank" || s.typ === "badhytt") r = 0.6;
    else if (s.typ === "cafe") r = 0.55;
    else if (s.typ === "glassbil" && s.fas === "star") r = 0.9;
    else if (s.typ === "sandslott" && arBarn) r = 0.45; // Barnet trampar inte på slottet (men hunden...)
    if (r) {
      // Går man rakt in i något glider man av åt sidan i stället för att fastna
      const dx = Math.abs(f.x - s.x) < 0.04 ? (f.x >= s.x ? 0.04 : -0.04) : f.x - s.x;
      const dv = f.v - s.v;
      const d = Math.hypot(dx, dv);
      if (d < r) {
        const nx = d > 0.001 ? dx / d : 1;
        const nv = d > 0.001 ? dv / d : 0;
        f.x = s.x + nx * r;
        f.v = s.v + nv * r;
      }
    } else if (s.typ === "damm" && arBarn) {
      // Barnet går inte ner i dammen (men det gör hunden!)
      const rx = s.rx + 0.25;
      const rv = s.rv + 0.25;
      const q = ((f.x - s.x) / rx) ** 2 + ((f.v - s.v) / rv) ** 2;
      if (q < 1) {
        const k = 1 / Math.sqrt(Math.max(q, 0.0001));
        // Går man rakt in i den glider man av åt sidan
        const dx = Math.abs(f.x - s.x) < 0.04 ? (f.x >= s.x ? 0.04 : -0.04) : f.x - s.x;
        f.x = s.x + dx * k;
        f.v = s.v + (f.v - s.v) * k;
      }
    }
  }
  f.x = begr(f.x, -grans, grans);
  f.v = begr(f.v, 0.3, langd + 0.3);
  if (banTyp() === "strand") {
    // Barnet stannar vid vattenbrynet. Hunden kan springa en bit ut i vattnet.
    f.x = Math.min(f.x, strandlinje(f.v) + (arBarn ? -0.25 : 1));
  }
}

function iDammen(f, d, marg = 0.85) {
  return ((f.x - d.x) / d.rx) ** 2 + ((f.v - d.v) / d.rv) ** 2 < marg;
}

function paGras(f, g) {
  const ut = f.x * g.sida;
  return ut > 1.65 && ut < 3.7 && f.v > g.v0 && f.v < g.v1;
}

// ---------- Hunden ----------

// Hur mycket hunden drar i kopplet. 0 = inte alls, 1 = barnet åker med.
// Stora hundar drar mer och små mindre.
function hundDrag() {
  const d = grundDrag();
  return d === 0 ? 0 : begr(d * (hundTyp.drag || 1), 0.05, 0.97);
}

function grundDrag() {
  const tristBonus = humor < 20 ? 0.1 : 0;
  switch (hund.lage) {
    case "fot": return 0;
    case "gar": return regn > 0 ? 0.75 : 0.25; // I regnet drar hunden som en galning
    case "ylar": return 0.9;
    case "spand": return 0.5;
    case "nosar":
    case "halsar":
    case "pol": return 0.6;
    case "apport": return 0.2;
    case "jagar":
    case "tillGras": return 0.78 + tristBonus;
    case "tigger": return 0.85;
    case "bajsar": return 0.97;
    case "vilar": return 0.95; // Katten har lagt sig och vägrar gå
    default: return 0.3;
  }
}

// Flyttar f en bit mot (x, v). Svarar true när den är framme.
function gaMot(f, x, v, fart, dt) {
  const dx = x - f.x;
  const dv = v - f.v;
  const d = Math.hypot(dx, dv);
  if (d < 0.03) return true;
  const steg = Math.min(d, fart * dt);
  f.x += (dx / d) * steg;
  f.v += (dv / d) * steg;
  if (Math.abs(dx / d) > 0.25) f.riktning = Math.sign(dx);
  return d - steg < 0.05;
}

function tittaMot(x) {
  if (Math.abs(x - hund.x) > 0.1) hund.riktning = Math.sign(x - hund.x);
}

function tillbaka() {
  hund.lage = "gar";
  hund.mal = null;
  hund.vandra = 0;
  hund.boll = false;
}

function bliSpand(s) {
  hund.nyss.add(s);
  hund.lage = "spand";
  hund.mal = s;
  hund.tid = 0.8;
  spelaTon(700, 1000, 0.08, "square", 0.04);
  visaTipsEnGang("spand", t("Hunden har sett något! Tryck på hunden: Fot!", "The dog saw something! Tap the dog: Heel!"), 3.5);
}

// Hunden har stått och spänt sig. Nu kör den!
function efterSpand() {
  const h = hund;
  const s = h.mal;
  if (!s || s.borta) {
    tillbaka();
    return;
  }
  h.tid = 4;
  h.skall = 0;
  if (s.typ === "katt") {
    s.flyr = true;
    s.flyTid = 0;
    h.lage = "jagar";
    saga(s, t("FRÄÄS!", "HISSS!"), 1);
  } else if (s.typ === "ekorre") {
    s.springer = true;
    s.tid = 3.4;
    h.lage = "jagar";
  } else if (["anka", "boll", "fagel", "krabba", "sandslott"].includes(s.typ)) {
    h.lage = "jagar";
  } else if (s.typ === "person" && s.lockar) {
    // Brevbäraren eller cykelbudet
    h.lage = "jagar";
    h.tid = s.sort === "cykelbud" ? 2.5 : 3.5;
  } else if (s.typ === "pol") {
    h.lage = "pol";
  } else if (s.typ === "kiosk" || s.typ === "glassbil") {
    h.lage = "tigger";
    h.tid = 6;
  } else if (s.typ === "person") {
    h.lage = "halsar";
    h.tid = 2.6;
    s.vantar = true;
  } else if (s.typ === "grasmatta") {
    h.lage = "tillGras";
    h.malX = s.sida * 2.7;
    h.malV = begr(h.v + 1, s.v0 + 0.8, s.v1 - 0.8);
    h.tid = 5;
    visaTipsEnGang("gras", t("Hunden vill bajsa på gubbens gräsmatta! Säg Fot!", "The dog wants to poop on the old man's lawn! Say Heel!"), 3.5);
  } else {
    tillbaka();
  }
}

// Letar efter något kul i närheten: katter, ekorrar, ankor, pölar...
function hittaFrestelse(dt) {
  const h = hund;
  const rack = humor < 20 ? 1.4 : 1; // Har hunden tråkigt ser den mer
  let bast = null;
  let bastD = Infinity;
  for (const s of saker) {
    if (s.x === undefined || Math.abs(s.v - h.v) > 5 || h.nyss.has(s) || s.borta) continue;
    let d = Math.hypot(s.x - h.x, s.v - h.v);
    let r = 0;
    if (s.typ === "katt" && !s.flyr && !hundTyp.katt) r = 3.2; // Katten jagar inte andra katter
    else if (s.typ === "ekorre" && !s.springer) r = 3;
    else if (s.typ === "anka" && !s.flyger) r = 3.4;
    else if (s.typ === "boll" && !s.flyger && !hundTyp.katt) r = 3.5; // Katter apporterar inte
    else if (s.typ === "fagel" && !s.flyger) r = 3.2;
    else if (s.typ === "krabba" && !s.flyr) r = 2.8;
    else if (s.typ === "sandslott" && !s.raserat) r = 2.8;
    else if (s.typ === "person" && s.lockar && !s.jagad) r = s.lockar;
    else if (s.typ === "glassbil" && s.fas === "star" && !hundTyp.katt) r = 8; // Alla hundar springer till glassbilen
    else if (s.typ === "pol" && !hundTyp.fin) r = 1.8; // Pudeln går inte i pölar
    else if (s.typ === "kiosk") r = 2.8;
    else if (s.typ === "person" && s.hund && !s.halsat) {
      d = Math.hypot(s.hundX - h.x, s.hundV - h.v);
      r = 2.4;
    }
    if (r && d < r * rack && d < bastD) {
      bast = s;
      bastD = d;
    }
  }
  if (bast) {
    bliSpand(bast);
    return true;
  }

  // Snart bajsdags? Då vill hunden helst till gubbens gräsmatta.
  if (h.bajsTid < 5) {
    for (const s of saker) {
      if (s.typ === "grasmatta" && !h.nyss.has(s) && h.v > s.v0 - 4 && h.v < s.v1 - 1) {
        bliSpand(s);
        return true;
      }
    }
  }

  // Nosa på träd och stolpar
  if (h.nosVila <= 0) {
    for (const s of saker) {
      if (!s.nosbar || h.nyss.has(s) || Math.abs(s.v - h.v) > 2) continue;
      const d = Math.hypot(s.x - h.x, s.v - h.v);
      const spark = s.typ === "sparkcykel";
      if (d < (spark ? 2.4 : 1.7) && Math.random() < dt * (spark ? 4 : 1.5)) {
        h.nyss.add(s);
        h.lage = "nosar";
        h.mal = s;
        h.tid = 2.4;
        h.nosVila = 3;
        const nx = d > 0.01 ? (h.x - s.x) / d : 1;
        const nv = d > 0.01 ? (h.v - s.v) / d : 0;
        h.malX = s.x + nx * (s.stam + 0.3);
        h.malV = s.v + nv * (s.stam + 0.3);
        visaText("sniff sniff", h.x, h.v + 0.9, "#ffffff", false, 1);
        return true;
      }
    }
  }
  return false;
}

// Taxen gräver en grop, och ibland hittar den ett ben
function grava(h) {
  const x = h.x + h.riktning * 0.25;
  const v = h.v - 0.1;
  saker.push({ typ: "grop", x, v });
  visaText(t("Gräv gräv!", "Dig dig!"), h.x, h.v + 0.9, "#e0bf7a", false, 1.2);
  spelaTon(200, 150, 0.15, "triangle", 0.06);
  if (Math.random() < 0.4) {
    saker.push({ typ: "godsak", x: x - h.riktning * 0.5, v, bild: "🦴", poang: 15, guld: false, pase: false, fas: 0 });
    visaText(t("Hittade ett ben!", "Found a bone!"), x, v + 1.5, "#ffe14d", true, 1.5);
  }
}

function borjaBajsa() {
  hund.lage = "bajsar";
  hund.tid = 1.8;
  hund.mal = null;
  visaTipsEnGang("bajs", t("Hunden bajsar! Gå dit och plocka upp 💩", "The dog is pooping! Go pick it up 💩"), 4);
}

function laggBajs() {
  const h = hund;
  const b = {
    x: begr(h.x - h.riktning * 0.3, -grans, grans),
    v: h.v - 0.1,
    regnbage: Math.random() < INSTALLNINGAR.regnbage,
    pop: 1,
    trampad: false,
    fas: Math.random() * 6,
    stor: !!hundTyp.storBajs,
  };
  // Hamnade det i vattnet (dammen, fontänen eller havet) går det inte att plocka upp
  const iVatten = saker.some((s) => s.typ === "damm" && iDammen(b, s, 1)) || (banTyp() === "strand" && b.x > strandlinje(b.v));
  if (iVatten) {
    visaText(t("Plopp! …i vattnet.", "Plop! …in the water."), b.x, b.v + 1, "#9fd4ff", true, 1.8);
    spelaTon(500, 200, 0.2, "sine", 0.08);
    h.bajsTid = bajsTakt();
    tillbaka();
    return;
  }
  bajsen.push(b);
  stat.bajsat += 1;
  humor = Math.min(100, humor + H.bajs);
  h.bajsTid = bajsTakt();
  spelaTon(190, 90, 0.25, "square", 0.05);
  viral(b.x, b.v);
  const vuxen = saker.find((p) => (p.sort === "larare" || p.sort === "ordningsvakt") && !p.bajsSett && Math.hypot(p.x - b.x, p.v - b.v) < 6);
  if (vuxen) {
    vuxen.bajsSett = true;
    saga(vuxen, PRAT[vuxen.sort][3], 3);
    utmarkelse(vuxen.sort === "larare" ? "veckobrevet" : "rapporterad");
  }
  const kritiker = saker.find((p) => p.sort === "matskribent" && !p.recenserat && Math.hypot(p.x - b.x, p.v - b.v) < 6);
  if (kritiker) {
    kritiker.recenserat = true;
    saga(kritiker, PRAT.matskribent[2], 3.2);
    visaText("⭐⭐☆☆☆", kritiker.x, kritiker.v + 2.2, "#ffe14d", true, 2.2);
  }
  if (banTyp() === "kvarter" && Math.random() < 0.35) kika(b.x, b.v);
  if (b.regnbage) {
    visaText(t("🌈 Ett regnbågsbajs!", "🌈 A rainbow poop!"), b.x, b.v + 1, "#ffe14d");
    spelaArpeggio([1047, 1319, 1568, 2093]);
  }
  // Bajsade den på gubbens gräsmatta?
  for (const s of saker) {
    if (s.typ === "grasmatta" && paGras(b, s)) {
      const gubbe = saker.find((p) => p.sort === "gubbe" && p.gras === s);
      if (gubbe) {
        saga(gubbe, PRAT.gubbe[0], 3);
        gubbe.vila = 7;
      }
    }
  }
  tillbaka();
}

function borjaSmita() {
  const h = hund;
  livKvar -= 1;
  stat.rymt += 1;
  h.los = true;
  h.lage = "smiter";
  h.mal = null;
  h.vandra = 0;
  trasslad = null;
  trassel = [];
  humor = 70;
  skakning = 0.35;
  visaText(t("Hunden smiter!", "The dog ran away!"), h.x, h.v + 1.2, "#ff8a7a");
  spelaTon(500, 150, 0.6, "sawtooth", 0.1);
  if (navigator.vibrate) navigator.vibrate(250);
  viral(h.x, h.v);
  if (livKvar <= 0) slutOm = 2.6;
  else visaTips(t("Spring ikapp hunden!", "Run and catch the dog!"), 3);
}

function fangaHund() {
  const h = hund;
  h.los = false;
  humor = 55;
  tillbaka();
  ge(t("Fångad!", "Caught!"), 0, h.x, h.v + 1, "#b6f09c");
  spelaArpeggio([523, 784]);
}

function uppdateraHund(dt) {
  const h = hund;
  const fore = { x: h.x, v: h.v };
  h.fas += dt;
  h.tid -= dt;
  h.fotVila = Math.max(0, h.fotVila - dt);
  h.nosVila -= dt;
  h.lerig = Math.max(0, h.lerig - dt);
  h.blot = Math.max(0, h.blot - dt);
  if (h.lage !== "bajsar") h.bajsTid -= dt;
  const vandraGrans = Math.min(grans, GRANSER[banTyp()][1]);

  switch (h.lage) {
    case "gar": {
      // Hunden springer runt en bit framför barnet
      h.vandra -= dt;
      if (h.vandra <= 0) {
        h.vandra = slumpMellan(1.5, 3.5);
        h.ox = slumpMellan(-1.6, 1.6);
        h.ov = barn.ror ? slumpMellan(1, 2.2) : slumpMellan(-0.8, 1.2);
      }
      if (regn > 0) {
        // Hunden vill hem NU och drar framåt
        h.ox = begr(h.ox, -0.6, 0.6);
        h.ov = 3;
      }
      h.malX = begr(barn.x + h.ox, -vandraGrans, vandraGrans);
      h.malV = barn.v + h.ov;
      const damm = saker.find((s) => s.typ === "damm" && iDammen({ x: h.malX, v: h.malV }, s, 1.3));
      if (damm) h.malX = damm.x - Math.sign(damm.x) * (damm.rx + 0.6);
      if (banTyp() === "strand") h.malX = Math.min(h.malX, strandlinje(h.malV) - 0.7);
      gaMot(h, h.malX, h.malV, hundFart() * (regn > 0 ? 1.5 : 1), dt);
      if (regn > 0) {
        if (h.bajsTid <= 0) borjaBajsa(); // Bara bajsa, inget annat är viktigt i regnet
      } else if (!hittaFrestelse(dt) && h.bajsTid <= 0) borjaBajsa();
      else if (h.lage === "gar" && hundTyp.katt && Math.random() < dt * 0.05) {
        h.lage = "vilar";
        h.tid = 2.5;
        visaText(t("Katten har lagt sig.", "The cat lay down."), h.x, h.v + 1, "#ffe9b3");
      }
      break;
    }
    case "vilar":
      if (h.tid <= 0) tillbaka();
      break;
    case "ylar":
      // Sitter och ylar med brandbilen
      h.skall -= dt;
      if (h.skall <= 0) {
        h.skall = 1;
        visaText(t("Auuuuu!", "Awoooo!"), h.x, h.v + 1.1, "#ffffff", true, 0.9);
        spelaTon(450, 750, 0.5, "sine", 0.06);
        spelaTon(750, 520, 0.5, "sine", 0.06, 0.5);
      }
      if (h.tid <= 0) tillbaka();
      break;
    case "spand":
      if (h.mal) tittaMot(h.mal.x);
      if (h.tid <= 0) efterSpand();
      break;
    case "jagar": {
      const m = h.mal;
      if (!m || m.borta || m.flyger || m.flyr && m.typ === "krabba" || m.raserat || m.jagad || h.tid <= 0 || (m.typ === "katt" && m.ut < 0.5) || (m.typ === "ekorre" && !m.springer)) {
        tillbaka();
        break;
      }
      gaMot(h, m.x, m.v, jaktFart(), dt);
      h.skall -= dt;
      if (h.skall <= 0) {
        h.skall = 0.6;
        visaText(hundTyp.katt ? t("MJAU!", "MEOW!") : t("VOFF!", "WOOF!"), h.x + slumpMellan(-0.3, 0.3), h.v + 1, "#ffffff", true, 0.7);
        spelaTon(420, 220, 0.12, "sawtooth", 0.06);
      }
      if (m.typ === "anka" && iDammen(h, m.damm)) plask(m.damm);
      if (m.typ === "krabba" && avst(h, m) < 0.45) {
        // Krabban nyper hunden i nosen
        m.flyr = true;
        visaText(t("NYP!", "PINCH!"), m.x, m.v + 0.8, "#ff8a7a");
        visaText(t("Aj aj aj!", "Ow ow ow!"), h.x, h.v + 1.3, "#ffffff", true, 1.4);
        spelaTon(1300, 1900, 0.12, "sine", 0.08);
        spelaTon(1300, 1900, 0.12, "sine", 0.08, 0.18);
        humor = Math.max(0, humor - 20);
        viral(h.x, h.v);
        h.lage = "fot"; // Springer tillbaka till barnet
        h.mal = null;
        h.tid = 2;
        break;
      }
      if (m.typ === "sandslott" && avst(h, m) < 0.55) {
        // KRASCH! Hunden springer rakt igenom sandslottet
        m.raserat = true;
        const byggare = saker.find((p) => p.sort === "byggare" && p.slott === m);
        if (byggare) {
          byggare.bild = "😭";
          byggare.sagt = 2;
          saga(byggare, PRAT.byggare[1], 3);
        }
        ge(t("KRASCH!", "CRASH!"), -20, m.x, m.v + 1, "#ff8a7a");
        spelaTon(300, 80, 0.4, "sawtooth", 0.08);
        skakning = 0.2;
        utmarkelse("kritiker");
        viral(m.x, m.v);
        tillbaka();
        break;
      }
      if (m.typ === "person" && avst(h, m) < 0.7) {
        // Hunden kom ikapp brevbäraren
        m.jagad = true;
        if (m.sort === "brevbarare") {
          saga(m, PRAT.brevbarare[1], 3);
          visaText("✉️ ✉️ ✉️", m.x, m.v + 1.2, "#ffffff", true, 1.5);
        } else if (m.sort === "larare") {
          // Klassen jublar
          m.glad = 2.5;
          m.sagt = 2;
          saga(m, PRAT.larare[1], 3);
          visaText(slumpa(PRAT.klassen), m.x + 0.4, m.v + 2, "#ffe14d", true, 1.6);
          humor = Math.min(100, humor + 8);
          spelaArpeggio([660, 880, 990]);
        } else if (m.sort === "alfa") {
          m.skramd = 1.2;
          m.sagt = 2;
          saga(m, PRAT.alfa[1], 3);
          spelaTon(900, 1600, 0.2, "sawtooth", 0.06);
          viral(m.x, m.v);
        }
        tillbaka();
        break;
      }
      if (m.typ === "boll" && avst(h, m) < 0.4) {
        m.borta = true;
        h.boll = true;
        h.lage = "apport";
        h.mal = null;
        h.tid = 6;
      }
      break;
    }
    case "apport": {
      const sida = Math.sign(h.x - barn.x) || 1;
      gaMot(h, barn.x + sida * 0.5, barn.v + 0.2, hundFart() * 1.3, dt);
      if (avst(h, barn) < 0.9) {
        ge(t("Apport! Duktig hund!", "Fetch! Good dog!"), P.apport, h.x, h.v + 1, "#b6f09c");
        humor += (50 - humor) * 0.5; // En nöjd och lite trött hund
        humorTrend = 0;
        spelaArpeggio([660, 880, 1100]);
        tillbaka();
      } else if (h.tid <= 0) {
        tillbaka();
      }
      break;
    }
    case "tillGras":
      if (gaMot(h, h.malX, h.malV, hundFart() * 1.3, dt) || h.tid <= 0) borjaBajsa();
      break;
    case "nosar":
      gaMot(h, h.malX, h.malV, hundFart(), dt);
      if (h.mal) tittaMot(h.mal.x);
      if (h.tid <= 0) {
        if (hundTyp.grava && h.mal && h.mal.typ !== "sparkcykel" && Math.random() < 0.6) {
          grava(h);
        } else if (h.mal && h.mal.typ === "sparkcykel") {
          // Hunden kissar alltid på elsparkcyklar
          h.mal.kiss = true;
          visaText(slumpa(PRAT.rattvisa), h.x, h.v + 1, "#fff3a0", true, 1.8);
        } else if (h.mal && h.mal.typ === "lykta" && Math.random() < 0.5) {
          h.mal.kiss = true;
          visaText("pssss", h.x, h.v + 0.8, "#fff3a0", false, 1);
        }
        tillbaka();
      }
      break;
    case "bajsar":
      if (h.tid <= 0) laggBajs();
      break;
    case "halsar": {
      const p = h.mal;
      if (!p || p.borta || Math.hypot(p.hundX - h.x, p.hundV - h.v) > 4) {
        if (p) p.vantar = false;
        tillbaka();
        break;
      }
      const sida = Math.sign(h.x - p.hundX) || 1;
      gaMot(h, p.hundX + sida * 0.55, p.hundV, hundFart() * 1.2, dt);
      tittaMot(p.hundX);
      if (h.tid <= 0) {
        p.vantar = false;
        p.halsat = true;
        ge(t("Hej hej!", "Hello!"), P.halsa, h.x, h.v + 1, "#b6f09c");
        tillbaka();
      }
      break;
    }
    case "tigger": {
      const k = h.mal;
      if (!k) {
        tillbaka();
        break;
      }
      gaMot(h, k.x - k.sida * (k.typ === "glassbil" ? 1.3 : 1.05), k.v - 0.2, hundFart() * 1.2, dt);
      if (h.tid <= 0 || k.borta || k.fas === "ut") tillbaka();
      break;
    }
    case "pol": {
      const p = h.mal;
      if (!p) {
        tillbaka();
        break;
      }
      if (gaMot(h, p.x, p.v, hundFart() * 1.3, dt) || h.tid <= 0) {
        if (avst(h, p) < 0.5) {
          h.lerig = 12;
          humor = Math.min(100, humor + 10);
          visaText(t("PLASK!", "SPLASH!"), h.x, h.v + 1, "#c9a27a");
          viral(h.x, h.v);
          spelaTon(700, 150, 0.3, "sine", 0.12);
        }
        tillbaka();
      }
      break;
    }
    case "fot": {
      const sida = Math.sign(h.x - barn.x) || 1;
      gaMot(h, barn.x + sida * 0.6, barn.v + 0.15, hundFart() * 1.5, dt);
      if (h.tid <= 0) tillbaka();
      break;
    }
    case "smiter": {
      h.vandra -= dt;
      if (h.vandra <= 0) {
        h.vandra = 1.2;
        const toppV = kamera + (ankare - panelH) / u - 1;
        h.malX = slumpMellan(-grans + 0.3, grans - 0.3);
        h.malV = Math.min(barn.v + slumpMellan(1.5, 4), toppV, langd - 1);
        if (banTyp() === "strand") h.malX = Math.min(h.malX, strandlinje(h.malV) - 0.5);
        if (slutOm > 0) h.malV = barn.v + 30; // Sista gången springer den sin väg
      }
      gaMot(h, h.malX, h.malV, INSTALLNINGAR.smitFart * (slutOm > 0 ? 2 : 1), dt);
      if (slutOm <= 0 && avst(h, barn) < 0.8) fangaHund();
      break;
    }
    case "trasslad":
      break;
    default:
      tillbaka();
  }

  // Hamnar hunden i vattnet blir det PLASK (dammen, fontänen eller havet)
  if (h.blot <= 0) {
    const vatten = saker.find((s) => s.typ === "damm" && iDammen(h, s));
    if (vatten) plask(vatten);
    else if (banTyp() === "strand" && h.x > strandlinje(h.v) + 0.15) plask(null);
  }

  // Leriga tassar lämnar spår
  h.sparSteg += Math.hypot(h.x - fore.x, h.v - fore.v);
  if (h.lerig > 0 && h.sparSteg > 0.35) {
    h.sparSteg = 0;
    tassar.push({ x: h.x + slumpMellan(-0.1, 0.1), v: h.v, kvar: 6 });
  }
}

function plask(damm) {
  const h = hund;
  for (const s of saker) {
    if (s.typ === "anka" && damm && s.damm === damm) s.flyger = true;
  }
  h.blot = 10;
  if (hundTyp.fin) {
    humor = Math.max(0, humor - 15);
    visaText(t("Pudeln är förolämpad.", "The poodle is offended."), h.x, h.v + 1.7, "#ffe9b3", true, 2);
  } else {
    humor = Math.min(100, humor + H.plask);
  }
  visaText(t("PLASK!", "SPLASH!"), h.x, h.v + 1.1, "#9fd4ff");
  viral(h.x, h.v);
  skakning = 0.2;
  spelaTon(900, 120, 0.45, "sine", 0.15);
  spelaTon(600, 90, 0.4, "triangle", 0.08, 0.1);
  if (h.los) return; // Har hunden smitit fortsätter den springa
  tillbaka();
  h.ox = damm ? -Math.sign(damm.x) * 0.8 : -1;
  h.ov = 1;
  h.vandra = 2;
}

// ---------- Kopplet ----------

// Hunden och barnet drar i var sin ände. Svarar med hur långt barnet drogs.
function kopplet() {
  if (hund.los) return 0;
  if (trasslad) {
    // Kopplet sitter fast runt stammen
    const s = trasslad.sak;
    fast(hund, s, s.stam + 0.5);
    fast(barn, s, s.stam + KOPPEL * 0.55);
    return 0;
  }
  const dx = hund.x - barn.x;
  const dv = hund.v - barn.v;
  const d = Math.hypot(dx, dv);
  if (d <= KOPPEL) return 0;
  const over = d - KOPPEL;
  const drag = hundDrag();
  barn.x += (dx / d) * over * drag;
  barn.v += (dv / d) * over * drag;
  hund.x -= (dx / d) * over * (1 - drag);
  hund.v -= (dv / d) * over * (1 - drag);
  return over * drag;
}

function fast(f, s, r) {
  const dx = f.x - s.x;
  const dv = f.v - s.v;
  const d = Math.hypot(dx, dv);
  if (d > r) {
    f.x = s.x + (dx / d) * r;
    f.v = s.v + (dv / d) * r;
  }
}

// Kopplet töjer sig inte. Har något puttat isär dem följer hunden med.
function hartKoppel() {
  if (hund.los || trasslad) return;
  const max = KOPPEL * 1.03;
  const dx = hund.x - barn.x;
  const dv = hund.v - barn.v;
  const d = Math.hypot(dx, dv);
  if (d > max) {
    hund.x = barn.x + (dx / d) * max;
    hund.v = barn.v + (dv / d) * max;
  }
}

// Håller koll på hur många varv kopplet går runt varje träd och stolpe.
// Går man förbi en stolpe på andra sidan än hunden hakar kopplet bara i
// (knappt ett varv). Har hunden sprungit runt ett träd sitter det fast.
const TRASSLA = Math.PI * 2.2;
function uppdateraTrassel() {
  if (hund.los) {
    trassel = [];
    trasslad = null;
    return;
  }
  const nara = (s, r) => avst(s, barn) < r && avst(s, hund) < r;
  for (const s of saker) {
    if (!s.stam || Math.abs(s.v - barn.v) > KOPPEL + 2) continue;
    const skillnad = vinkelNorm(Math.atan2(hund.v - s.v, hund.x - s.x) - Math.atan2(barn.v - s.v, barn.x - s.x));
    const t = trassel.find((t) => t.sak === s);
    if (!t) {
      if (nara(s, KOPPEL + 0.8)) trassel.push({ sak: s, w: skillnad, forra: skillnad });
      continue;
    }
    t.w += vinkelNorm(skillnad - t.forra);
    t.forra = skillnad;
  }
  trassel = trassel.filter((t) => t === trasslad || nara(t.sak, KOPPEL + 0.8) || (Math.abs(t.w) > 1.2 && nara(t.sak, KOPPEL + 1.6)));

  if (!trasslad) {
    const fast = trassel.find((t) => Math.abs(t.w) >= TRASSLA);
    if (fast) {
      trasslad = fast;
      if (hund.lage === "halsar" && hund.mal) hund.mal.vantar = false;
      hund.lage = "trasslad";
      hund.mal = null;
      visaTips(t("Kopplet har trasslat sig! Gå runt trädet.", "The leash is tangled! Walk around the tree."), 4);
      visaText(t("Trassel!", "Tangled!"), hund.x, hund.v + 1, "#ffe9b3");
      spelaTon(300, 180, 0.35, "triangle", 0.08);
    }
  } else if (Math.abs(trasslad.w) <= Math.PI * 0.8) {
    trasslad = null;
    tillbaka();
    ge(t("Löst!", "Untangled!"), P.trassel, hund.x, hund.v + 1, "#b6f09c");
    spelaTon(600, 1000, 0.12, "triangle", 0.1);
  }
}

// ---------- Allt längs vägen ----------

function uppdateraSaker(dt) {
  let nagonBorta = false;
  for (const s of saker) {
    switch (s.typ) {
      case "katt":
        if (s.flyr) {
          // Katten springer ut åt sidan och klättrar över staketet
          const sida = Math.sign(s.x) || 1;
          s.x += sida * 2.8 * dt;
          s.v += 1.4 * dt;
          s.flyTid += dt;
          if (s.flyTid > 1.1) s.ut -= dt * 1.5;
          if (s.ut <= 0) s.borta = true;
        }
        break;
      case "fagel":
        if (s.flyger) {
          s.lyft += dt * 1.8;
          s.v += dt * 1.2;
          s.x += s.riktning * dt;
          s.ut -= dt * 0.6;
          if (s.ut <= 0) s.borta = true;
        } else {
          // Pickar och tassar runt lite
          s.fas += dt;
          s.x = s.hemX + Math.sin(s.fas * 0.7) * 0.25;
          s.v = s.hemV + Math.cos(s.fas * 0.5) * 0.15;
          if (avst(s, hund) < 1.3 || avst(s, barn) < 0.8) {
            // Hela flocken flyger iväg
            if (!s.flock.flugit) {
              s.flock.flugit = true;
              visaText(t("FLAX FLAX!", "FLAP FLAP!"), s.x, s.v + 0.8, "#ffffff");
              spelaTon(900, 1400, 0.08, "triangle", 0.05);
              spelaTon(1000, 1500, 0.08, "triangle", 0.05, 0.1);
            }
            for (const f of saker) if (f.flock === s.flock) f.flyger = true;
          }
        }
        break;
      case "krabba":
        s.fas += dt;
        if (s.flyr) {
          // Krabban springer ut i vattnet
          s.x += 1.5 * dt;
          s.ut -= dt * 0.8;
          if (s.ut <= 0) s.borta = true;
        } else {
          // Går i sidled fram och tillbaka
          if (Math.sin(s.fas * 0.8) > 0.95) s.riktning = -s.riktning;
          s.v += s.riktning * 0.35 * dt;
        }
        break;
      case "glassbil": {
        if (s.fas === "in") {
          // Kör in och stannar
          s.x += Math.sign(s.malX - s.x) * Math.min(6 * dt, Math.abs(s.malX - s.x));
          if (Math.abs(s.x - s.malX) < 0.01) {
            s.fas = "star";
            saga(s, PRAT.glassbil[2], 2.5);
          }
        } else if (s.fas === "star") {
          s.kvar -= dt;
          s.melodi -= dt;
          if (s.melodi <= 0) {
            s.melodi = 4;
            spelaGlassmelodi();
          }
          // Står man vid luckan en stund köper man en glass
          const framX = s.x - s.sida * 1.3;
          if (!s.kopt && Math.hypot(barn.x - framX, barn.v - s.v) < 1) {
            s.kopTid = (s.kopTid || 0) + dt;
            if (s.kopTid > 1) {
              s.kopt = true;
              barn.korv = 10;
              barn.mat = "🍦";
              saga(s, PRAT.glassbil[3], 2.2);
              visaText(t("-35 kr", "-$5"), s.x, s.v + 1.8, "#ffd1d1");
              utmarkelse("foraldralognen");
              if (banTyp() === "strand") masOm = 2.5; // Måsen har sett glassen…
            }
          } else {
            s.kopTid = 0;
          }
          if (s.kvar <= 0) {
            s.fas = "ut";
            s.kvar = 3;
            if (hund.mal === s) tillbaka();
          }
        } else {
          // Kör iväg framåt
          s.v += 6 * dt;
          s.kvar -= dt;
          if (s.kvar <= 0) s.borta = true;
        }
        break;
      }
      case "masattack": {
        // Måsen dyker ner, tar glassen och flyger iväg
        s.fas += dt / (s.har ? 1.5 : 0.9);
        if (!s.har) {
          const f = Math.min(1, s.fas);
          s.x = s.franX + (barn.x - s.franX) * f;
          s.v = s.franV + (barn.v - s.franV) * f;
          s.z = 3 - 2 * f;
          if (s.fas >= 1) {
            s.har = barn.korv > 0;
            s.fas = 0;
            if (s.har) {
              barn.korv = 0;
              visaText(PRAT.mas[0], barn.x, barn.v + 2, "#ff8a7a");
              saga(barn, PRAT.mas[1], 2);
              spelaTon(1500, 900, 0.25, "sawtooth", 0.06);
              utmarkelse("masad");
              viral(barn.x, barn.v);
            } else {
              s.har = true; // Glassen var redan slut – flyg iväg ändå
            }
          }
        } else {
          s.x -= 2.5 * dt;
          s.v += 3 * dt;
          s.z += 2 * dt;
          if (s.fas >= 1) s.borta = true;
        }
        break;
      }
      case "ekorre": {
        const t = s.trad;
        if (s.springer) {
          s.vinkel += s.varv * 3.2 * dt;
          s.tid -= dt;
          if (s.tid <= 0) {
            s.springer = false;
            s.klattrar = true;
          }
        }
        if (s.klattrar) {
          s.ut -= dt * 1.2;
          if (s.ut <= 0) s.borta = true;
        }
        const r = t.stam + 0.45;
        s.x = t.x + Math.cos(s.vinkel) * r;
        s.v = t.v + Math.sin(s.vinkel) * r * 0.8;
        break;
      }
      case "anka": {
        const d = s.damm;
        if (s.flyger) {
          s.lyft += dt * 1.6;
          s.v += dt * 1.2;
          s.ut -= dt * 0.6;
          if (s.ut <= 0) s.borta = true;
        } else {
          s.vinkel += (hund.mal === s ? 1.5 : 0.35) * dt;
          s.x = d.x + Math.cos(s.vinkel) * d.rx * 0.55;
          s.v = d.v + Math.sin(s.vinkel) * d.rv * 0.5;
        }
        break;
      }
      case "person":
        uppdateraPerson(s, dt);
        break;
      case "godsak":
        if (avst(s, barn) < 0.6) {
          s.borta = true;
          if (s.pase) {
            pasar = Math.min(INSTALLNINGAR.pasarMax, pasar + 1);
            visaText("+1 🛍️", s.x, s.v + 0.8, "#ffffff");
          } else {
            ge(s.guld ? t("Guldben!", "Golden bone!") : "", s.poang, s.x, s.v + 0.8, s.guld ? "#ffe14d" : "#ffffff");
          }
          spelaTon(880, 1760, 0.15, "triangle", 0.09);
        }
        break;
      case "boll":
        if (s.flyger) {
          // Padelbollen flyger i en båge och landar på vägen
          s.flyg = Math.min(1, s.flyg + dt / 1.1);
          s.x = s.franX + (s.tillX - s.franX) * s.flyg;
          s.v = s.franV + (s.tillV - s.franV) * s.flyg;
          s.z = Math.sin(s.flyg * Math.PI) * 2;
          if (s.flyg >= 1) {
            s.flyger = false;
            s.z = 0;
            spelaTon(320, 200, 0.08, "sine", 0.08);
          }
        } else if (avst(s, barn) < 0.55) {
          s.borta = true;
          ge(t("Boll!", "Ball!"), P.boll, s.x, s.v + 0.8, "#ffffff");
          spelaTon(880, 1760, 0.15, "triangle", 0.09);
        }
        break;
      case "sparkcykel":
        if (!s.sedd && avst(s, barn) < 1.8) {
          s.sedd = true;
          const rep = PRAT.sparkcykel;
          saga(barn, rep[Math.min(sparkAntal, rep.length - 1)], 2.6);
          sparkAntal += 1;
        }
        break;
      case "automat":
        if (!s.tagen && pasar < INSTALLNINGAR.pasarMax && avst(s, barn) < 1.1) {
          s.tagen = true;
          visaText(`+${INSTALLNINGAR.pasarMax - pasar} 🛍️`, s.x, s.v + 1.4, "#ffffff");
          pasar = INSTALLNINGAR.pasarMax;
          spelaArpeggio([660, 880]);
        }
        break;
      case "lykta":
        if (s.lapp && !s.last && avst(s, barn) < 1.9) {
          s.last = true;
          visaLapp(s.lapp);
        }
        break;
      case "skylt":
        if (!s.last && avst(s, barn) < 2.2) {
          s.last = true;
          visaLapp(s.text);
        }
        break;
      case "kiosk": {
        if (!s.last && avst(s, barn) < 2.8) {
          s.last = true;
          visaLapp(s.glass ? INSTALLNINGAR.glassSkylt : INSTALLNINGAR.kioskSkylt);
        }
        // Står man vid luckan en stund köper man en korv (eller glass). Till sig själv.
        const framX = s.x - s.sida * 1.05;
        if (!s.kopt && Math.hypot(barn.x - framX, barn.v - s.v) < 0.9) {
          barn.kioskTid += dt;
          if (barn.kioskTid > 1) {
            s.kopt = true;
            barn.korv = 10;
            if (s.glass) {
              barn.mat = "🍦";
              saga(barn, t("En glass, tack!", "An ice cream, please!"), 1.5);
              visaText(t("-49 kr", "-$6"), s.x, s.v + 1.6, "#ffd1d1");
              masOm = 2.5; // Måsen har sett glassen
            } else {
              barn.mat = "🌭";
              saga(barn, t("En korv, tack!", "A hot dog, please!"), 1.5);
              visaText(t("-45 kr", "-$9"), s.x, s.v + 1.6, "#ffd1d1");
              utmarkelse("vardagslyx");
            }
          }
        } else {
          barn.kioskTid = 0;
        }
        break;
      }
    }
    if (s.borta) nagonBorta = true;
  }
  if (nagonBorta) saker = saker.filter((s) => !s.borta);
}

// ---------- Oväntade händelser ----------

const HA = INSTALLNINGAR.handelser;
let forraHandelse = "";

function uppdateraHandelser(dt) {
  // Regnet
  if (regn > 0) {
    regn -= dt;
    if (regn <= 0) {
      regn = 0;
      hund.blot = Math.max(hund.blot, 8); // En blöt hund som skakar sig på folk
      visaText(t("Regnet slutade. Hunden är blöt.", "The rain stopped. The dog is wet."), barn.x, barn.v + 1.8, "#cfe8ff", true, 2.2);
      utmarkelse("friskluft");
    }
  }
  regnStyrka += ((regn > 0 ? 1 : 0) - regnStyrka) * Math.min(1, dt * 1.5);

  // Brandbilen
  if (brandbil) {
    brandbil.x += brandbil.fart * dt;
    brandbil.kvar -= dt;
    brandbil.siren -= dt;
    if (brandbil.siren <= 0) {
      brandbil.siren = 0.5;
      brandbil.hog = !brandbil.hog;
      spelaTon(brandbil.hog ? 960 : 720, brandbil.hog ? 960 : 720, 0.45, "square", 0.035);
    }
    if (brandbil.kvar <= 0) brandbil = null;
  }

  // Dags för något oväntat?
  const pagar = regn > 0 || brandbil || saker.some((p) => p.handelse && !p.borta);
  if (pagar || hund.los || barn.v > langd - 15) return;
  nastaHandelse -= dt;
  if (nastaHandelse > 0) return;
  nastaHandelse = slumpMellan(HA.mellanrum[0], HA.mellanrum[1]);
  const val = ["brevbarare", "regn", "brandbil", "glassbil"].filter((h) => HA[h] && h !== forraHandelse);
  if (!val.length) return;
  startaHandelse(slumpa(val));
}

// Något oväntat händer! Först ett ❗ och ett ljud.
function startaHandelse(typ) {
  forraHandelse = typ;
  spelaTon(880, 1320, 0.12, "square", 0.07);
  spelaTon(1320, 880, 0.12, "square", 0.07, 0.14);
  if (typ === "brevbarare") {
    const p = nyPerson("brevbarare", slumpa([-0.7, 0.7]), barn.v + 8.5, { handelse: true });
    saker.push(p);
    visaText(t("❗ Brevbäraren kommer!", "❗ The mail carrier!"), barn.x, barn.v + 2, "#ffe14d", true, 2);
    visaTips(t("Brevbäraren! Säg Fot innan hunden får syn på honom!", "The mail carrier! Say Heel before the dog sees him!"), 4);
  } else if (typ === "glassbil") {
    // Glassbilen kör in från sidan och stannar en bit framför barnet.
    // I stan står den på gatan och på stranden på sanden (inte i havet).
    const sida = banTyp() === "stad" ? 1 : banTyp() === "strand" ? -1 : slumpSida();
    const malX = sida * 3.4;
    saker.push({
      typ: "glassbil", handelse: true, sida, malX, x: sida * (bredd / 2 / u + 2), v: barn.v + 3.8,
      fas: "in", kvar: HA.glassbilTid, melodi: 0, kopt: false,
    });
    visaText(t("❗ Glassbilen!", "❗ Ice cream truck!"), barn.x, barn.v + 2, "#ffc4f2", true, 2);
    visaLapp(t("📜 Familjeregel: ", "📜 Family rule: ") + PRAT.glassbil[0]);
    saga(barn, PRAT.glassbil[1], 2.5);
  } else if (typ === "regn") {
    regn = HA.regnTid;
    visaText(t("❗ Regnskur! 🌧️", "❗ Rain shower! 🌧️"), barn.x, barn.v + 2, "#cfe8ff", true, 2);
    visaTips(PRAT.regn[0], 4);
    saga(barn, PRAT.regn[2], 2.5);
    // Influencern i närheten bryr sig mest om håret
    const inf = saker.find((p) => p.sort === "influencer" && avst(p, barn) < 8);
    if (inf) saga(inf, PRAT.regn[1], 2.5);
    // Det blir nya pölar längre fram
    for (let i = 0; i < 3; i++) laggPol(slumpMellan(-1, 1), barn.v + 4 + i * slumpMellan(2.5, 4));
  } else {
    // Brandbilen kör förbi högst upp på skärmen
    const fran = slumpSida();
    brandbil = { x: fran * -(bredd / 2 / u + 2), fart: fran * 7, kvar: 4.5, siren: 0, hog: false };
    visaText(t("❗ Brandbilen!", "❗ Fire truck!"), barn.x, barn.v + 2, "#ff8a7a", true, 2);
    if (hundTyp.katt) {
      visaText(t("Katten bryr sig inte.", "The cat doesn't care."), hund.x, hund.v + 1.3, "#ffe9b3", true, 2);
    } else if (!hund.los && !["bajsar", "trasslad", "apport"].includes(hund.lage)) {
      if (hund.lage === "halsar" && hund.mal) hund.mal.vantar = false;
      hund.lage = "ylar";
      hund.mal = null;
      hund.tid = 3.5;
      hund.skall = 0;
      humor = Math.min(100, humor + 5);
    }
  }
}

function ritaRegn() {
  if (regnStyrka < 0.02) return;
  ctx.fillStyle = `rgba(40, 60, 90, ${0.28 * regnStyrka})`;
  ctx.fillRect(0, 0, bredd, hojd);
  ctx.strokeStyle = `rgba(200, 220, 255, ${0.6 * regnStyrka})`;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  const antal = Math.round(90 * regnStyrka);
  for (let i = 0; i < antal; i++) {
    const x = (slumpTal(i * 3.1) * (bredd + 100) + tid * 120) % (bredd + 100) - 50;
    const y = (slumpTal(i * 7.7) * hojd + tid * (700 + slumpTal(i) * 300)) % hojd;
    ctx.moveTo(x, y);
    ctx.lineTo(x - 6, y + 18);
  }
  ctx.stroke();
}

function ritaGlassbil(s) {
  const x = SX(s.x);
  const y = SY(s.v);
  const st = u * 1.7;
  skugga(x, y, st * 0.5, u * 0.15);
  const skak = s.fas === "star" ? 0 : Math.sin(tid * 30) * u * 0.02;
  ctx.save();
  ctx.translate(x, y - st * 0.4 + skak);
  if (s.sida < 0) ctx.scale(-1, 1); // Emojin pekar åt vänster
  ritaEmoji("🚚", 0, 0, st);
  ctx.restore();
  // Rosa tak med en stor glass
  ctx.fillStyle = "#ff9ed1";
  rundRekt(ctx, x - st * 0.3, y - st * 0.78 + skak, st * 0.6, st * 0.14, st * 0.05);
  ctx.fill();
  ritaEmoji("🍦", x, y - st * 0.95 + skak, u * 0.55);
  if (s.fas === "star") {
    for (let i = 0; i < 3; i++) {
      const f = (tid * 0.7 + i / 3) % 1;
      ctx.globalAlpha = Math.sin(f * Math.PI);
      ritaText(i % 2 ? "♫" : "♪", x - s.sida * st * (0.2 + f * 0.4), y - st * (0.9 + f * 0.5), u * 0.32, "#ffffff");
      ctx.globalAlpha = 1;
    }
  }
}

function ritaBrandbil() {
  if (!brandbil) return;
  const x = SX(brandbil.x);
  const y = panelH + u * 1.1;
  ctx.save();
  ctx.translate(x, y);
  if (brandbil.fart > 0) ctx.scale(-1, 1); // Emojin pekar åt vänster
  ritaEmoji("🚒", 0, 0, u * 1.4);
  ctx.restore();
  if (brandbil.hog) ritaEmoji("🚨", x, y - u * 0.75, u * 0.4);
}

// Säger första repliken när man kommer nära och den andra när man gått förbi
function tvaRepliker(p, rep, d, nara) {
  if (!p.sagt && d < nara) {
    p.sagt = 1;
    saga(p, rep[0], 3.2);
  } else if (p.sagt === 1 && rep[1] && barn.v - p.v > 1.2) {
    p.sagt = 2;
    saga(p, rep[1], 3);
  }
}

// Bilarna som kör på gatan i stan (de är bara till för syns skull)
function uppdateraBilar(dt) {
  if (banTyp() !== "stad") return;
  for (const b of bilar) b.v += b.fart * dt;
  bilar = bilar.filter((b) => Math.abs(b.v - kamera) < 16);
  for (const [x, fart] of [[3.6, -6], [5.5, 5]]) {
    const iFilen = bilar.filter((b) => b.x === x);
    const ledig = iFilen.every((b) => Math.abs(b.v - (kamera + (fart < 0 ? 14 : -14))) > 4);
    if (iFilen.length < 2 && ledig && Math.random() < dt * 0.8) {
      bilar.push({ x, fart: fart * slumpMellan(0.85, 1.15), v: kamera + (fart < 0 ? 14 : -14), bild: slumpa(["🚗", "🚕", "🚙", "🚌", "🚐"]) });
    }
  }
  if (Math.random() < dt * 0.06) spelaTon(520, 520, 0.12, "square", 0.025); // Tuuut
}

function uppdateraPerson(p, dt) {
  const d = avst(p, barn);
  p.vila = Math.max(0, p.vila - dt);
  if (p.fart && !p.vantar && (p.gar || p.v - barn.v < 9)) {
    p.gar = true;
    p.v += p.fart * dt;
    p.fas += dt * (p.sort === "joggare" ? 2.5 : 1);
  }
  if (p.hund) {
    // Den andra hunden går bredvid, eller drar mot vår hund när de hälsar
    let hx = p.x + 0.7;
    let hv = p.v + 0.1;
    if (p.vantar) {
      hx = p.x + begr(hund.x - p.x, -0.9, 0.9);
      hv = p.v + begr(hund.v - p.v, -0.6, 0.6);
    }
    p.hundX += (hx - p.hundX) * Math.min(1, dt * 5);
    p.hundV += (hv - p.hundV) * Math.min(1, dt * 5);
  }
  if (p.tillfallig !== undefined) {
    p.tillfallig -= dt;
    if (p.tillfallig <= 0) p.borta = true;
  }
  if (p.v < barn.v - 14) p.borta = true;

  if (p.sort === "influencer") {
    p.viralVila = Math.max(0, p.viralVila - dt);
    p.filmar = d < 6.5 && barn.v - p.v < 2.5; // Hon filmar när man är nära
  }

  const rep = PRAT[p.sort] || [];
  switch (p.sort) {
    case "joggare":
      if (!p.sagt && d < 4.5) {
        p.sagt = 1;
        saga(p, rep[p.pass] || rep[0], 2.6);
      }
      break;
    case "influencer": {
      const r = PRAT.influencer[p.pass] || PRAT.influencer[0];
      if (!p.sagt && d < 4.8) {
        p.sagt = 1;
        if (p.hund) p.skallTid = 2;
        saga(p, hundTyp.fin && p.hund ? PRAT.influencerPudel[0] : r[0], 3.2);
      } else if (p.sagt === 1 && barn.v - p.v > 1.2) {
        p.sagt = 2;
        saga(p, r[1], 3);
      }
      break;
    }
    case "padel":
      if (p.sagt === 0 && d < 5.5) {
        p.sagt = 1;
        saga(p, rep[0], 2.6);
      } else if (p.sagt === 1 && d < 3) {
        // Bollen flyger över staketet och landar på trottoaren
        p.sagt = 2;
        saga(p, rep[1], 2);
        saker.push({ typ: "boll", x: p.x, v: p.v, franX: p.x, franV: p.v, tillX: slumpMellan(-0.8, 0.8), tillV: barn.v + slumpMellan(2, 3), flyg: 0, z: 0, flyger: true });
        spelaTon(500, 700, 0.06, "square", 0.05);
      } else if (p.sagt === 2 && barn.v - p.v > 1.5) {
        p.sagt = 3;
        saga(p, rep[2], 3);
      }
      break;
    case "hundagare": {
      const r = hundTyp.katt ? PRAT.hundagareKatt : rep;
      if (!p.sagt && d < 4.8) {
        p.sagt = 1;
        p.skallTid = 3.5;
        saga(p, r[0], 3.2);
      } else if (p.sagt === 1 && p.halsat && barn.v - p.v > 1.2) {
        p.sagt = 2;
        saga(p, r[1], 3);
      }
      break;
    }
    case "mute":
      if (p.sagt === 0 && d < 6) {
        p.sagt = 1;
        saga(p, rep[0], 2.6);
      } else if (p.sagt === 1 && d < 3) {
        p.sagt = 2;
        saga(p, rep[1], 2);
      } else if (p.sagt === 2 && barn.v - p.v > 1.5) {
        p.sagt = 3;
        saga(p, rep[2], 2.4);
      }
      break;
    case "gubbe":
      if (p.vila <= 0 && (paGras(hund, p.gras) || paGras(barn, p.gras))) {
        p.vila = 7;
        saga(p, rep[0], 3);
      }
      break;
    case "pappa":
    case "tradgubbe":
      if (!p.sagt && d < 3.4) {
        p.sagt = 1;
        saga(p, rep[0], 3.2);
      }
      break;
    case "byggare":
      if (!p.sagt && d < 4.5) {
        p.sagt = 1;
        saga(p, rep[0], 3);
      } else if (p.sagt === 1 && !p.slott.raserat && barn.v - p.v > 2) {
        // Man höll i hunden hela vägen förbi slottet
        p.sagt = 3;
        saga(p, rep[2], 3);
        ge(t("Snällt!", "Nice!"), 10, p.x, p.v + 1.6, "#b6f09c");
      }
      break;
    case "musikant":
      if (!p.ylat && d < 3) {
        // Hunden sjunger med
        p.ylat = true;
        visaText(hundTyp.katt ? t("Mjaaaau!", "Meooow!") : t("Auuuuu!", "Awoooo!"), hund.x, hund.v + 1.2, "#ffffff", true, 1.6);
        spelaTon(450, 750, 0.5, "sine", 0.07);
        spelaTon(750, 520, 0.6, "sine", 0.07, 0.5);
        humor = Math.min(100, humor + 5);
      }
      tvaRepliker(p, rep, d, 4.5);
      break;
    case "cykelbud":
      if (!p.plingat && d < 6) {
        p.plingat = true;
        visaText(t("Pling pling!", "Ring ring!"), p.x, p.v + 1.3, "#ffffff", true, 1.2);
        spelaTon(2000, 2000, 0.08, "triangle", 0.06);
        spelaTon(2000, 2000, 0.08, "triangle", 0.06, 0.15);
      }
      tvaRepliker(p, rep, d, 5);
      break;
    case "brevbarare":
      if (!p.sagt && d < 6) {
        p.sagt = 1;
        saga(p, p.handelse ? PRAT.brevbarareHandelse[0] : rep[0], 3);
      } else if (p.sagt === 1 && !p.jagad && barn.v - p.v > 1.5) {
        // Han kom förbi utan att bli jagad!
        p.sagt = 2;
        saga(p, rep[2], 3);
        ge(t("Snällt!", "Nice!"), 20, p.x, p.v + 1.6, "#b6f09c");
        utmarkelse("postvan");
      }
      break;
    case "detektor":
      p.pip = (p.pip || 0) - dt;
      if (p.pip <= 0 && d < 8) {
        p.pip = slumpMellan(1.5, 3);
        visaText("pip", p.x + 0.6, p.v + 0.4, "#ffffff", false, 0.8);
        spelaTon(1800, 1800, 0.05, "square", 0.02);
      }
      tvaRepliker(p, rep, d, 4.5);
      break;
    case "lattepappa":
    case "solbadare":
    case "kallbadare":
    case "techinvesterare":
    case "matskribent":
      tvaRepliker(p, rep, d, 4.5);
      break;
    case "homeopat":
      tvaRepliker(p, rep, d, 4.5);
      if (!p.droppe && avst(p, hund) < 1.8) {
        // En droppe till hunden. Hundmätaren rör sig inte en millimeter.
        p.droppe = true;
        visaText("💧", hund.x, hund.v + 1, "#9fd4ff", true, 1.2);
        visaText(rep[2], hund.x, hund.v + 1.6, "#ffe9b3", true, 2.2);
      }
      break;
    case "alfa":
      p.skramd = Math.max(0, (p.skramd || 0) - dt);
      if (!p.sagt && d < 4.5) {
        p.sagt = 1;
        saga(p, rep[0], 3.2);
      } else if (p.sagt === 1 && !p.jagad && barn.v - p.v > 1.5) {
        p.sagt = 3;
        saga(p, rep[2], 3);
      }
      break;
    case "larare":
      p.glad = Math.max(0, (p.glad || 0) - dt);
      if (!p.sagt && d < 5) {
        p.sagt = 1;
        saga(p, rep[0], 3.5);
      } else if (p.sagt === 1 && !p.jagad && barn.v - p.v > 2.5) {
        // Man höll i hunden när man gick förbi klassen
        p.sagt = 3;
        saga(p, rep[2], 3);
        ge(t("⭐ Guldstjärna!", "⭐ Gold star!"), 15, p.x, p.v + 1.8, "#ffe14d");
      }
      break;
    case "ordningsvakt":
      if (!p.sagt && d < 2.2) {
        // Stopp! Kontroll!
        p.sagt = 1;
        barn.stopp = 2;
        saga(p, rep[0], 2.2);
        visaText("PRRRT!", p.x, p.v + 1.8, "#ffffff", true, 1);
        spelaTon(2600, 2400, 0.4, "square", 0.04);
      } else if (p.sagt === 1 && barn.stopp <= 0) {
        p.sagt = 2;
        saga(p, rep[1], 2.6);
      }
      if (!p.visslat && barn.slapas > 0 && d < 6) {
        p.visslat = true;
        saga(p, rep[2], 2.4);
        visaText("PRRRT!", p.x, p.v + 1.8, "#ffffff", true, 1);
        spelaTon(2600, 2400, 0.4, "square", 0.04);
      }
      break;
    case "psykolog":
      if (!p.sagt && d < 4.5) {
        p.sagt = 1;
        saga(p, rep[0], 3.2);
      } else if (p.sagt === 1 && barn.slapas > 0 && d < 6) {
        p.sagt = 2;
        saga(p, rep[1], 3);
      } else if (p.sagt >= 1 && p.sagt < 3 && barn.v - p.v > 1.5) {
        p.sagt = 3;
        saga(p, rep[2], 3);
      }
      break;
  }

  // Den andra hunden skäller medan de närmar sig
  if (p.skallTid > 0) {
    p.skallTid -= dt;
    p.skall = (p.skall || 0) - dt;
    if (p.skall <= 0) {
      p.skall = 0.5;
      visaText(t("VOFF!", "WOOF!"), p.hundX + slumpMellan(-0.2, 0.2), p.hundV + 0.9, "#ffffff", false, 0.6);
      spelaTon(520, 300, 0.1, "sawtooth", 0.04);
    }
  }

  // En blöt hund skakar sig bredvid folk
  if (hund.blot > 0 && !p.blotad && Math.hypot(p.x - hund.x, p.v - hund.v) < 1.6) {
    p.blotad = true;
    saga(p, PRAT.blot[0], 2.5);
    visaText("💦", p.x, p.v + 1.2, "#9fd4ff");
  }
}

// ---------- Bajs ----------

function uppdateraBajs(dt) {
  const botten = kamera - (hojd - ankare) / u;
  for (const b of bajsen) {
    b.pop = Math.max(0, b.pop - dt * 3);
    b.fas += dt;
    if (avst(b, barn) < (b.stor ? 0.7 : 0.55)) {
      if (pasar > 0) {
        plocka(b);
        continue;
      }
      if (!b.trampad) {
        // Ingen påse... och så klev man i det
        b.trampad = true;
        barn.lerskor = 6;
        ge(t("BLÄÄ!", "EWW!"), -5, b.x, b.v + 1, "#c9a27a");
        spelaTon(220, 110, 0.5, "sawtooth", 0.08);
        viral(b.x, b.v);
        kika(b.x, b.v);
      }
    }
    if (b.v < botten - 0.7) lamna(b);
  }
  bajsen = bajsen.filter((b) => !b.borta);
}

function plocka(b) {
  b.borta = true;
  pasar -= 1;
  if (b.stor && pasar > 0) {
    pasar -= 1;
    visaText(t("Det gick åt två påsar.", "That took two bags."), b.x, b.v + 1.6, "#ffe9b3", false, 1.6);
  }
  stat.plockade += 1;
  plockadeTotalt += 1;
  if (b.regnbage) {
    ge(t("🌈 Regnbågsbajs!", "🌈 Rainbow poop!"), P.regnbage, b.x, b.v + 1, "#ffe14d");
    spelaArpeggio([1047, 1319, 1568, 2093, 2637]);
  } else {
    ge(Math.random() < 0.25 ? INSTALLNINGAR.karlek : "", P.bajs * (b.stor ? 2 : 1), b.x, b.v + 1, "#ffffff");
    spelaTon(600, 1200, 0.15, "triangle", 0.09);
  }
  brasak(b.x, b.v);
  const investerare = saker.find((p) => p.sort === "techinvesterare" && !p.investerat && Math.hypot(p.x - b.x, p.v - b.v) < 6);
  if (investerare) {
    investerare.investerat = true;
    saga(investerare, PRAT.techinvesterare[2], 3);
    ge(t("💰 Riskkapital!", "💰 Venture capital!"), 50, b.x, b.v + 1.8, "#ffe14d");
    utmarkelse("riskkapital");
  }
  if (plockadeTotalt === 10) utmarkelse("hogskolepoang");
  if (pasar === 0) visaTipsEnGang("slut", t("Slut på påsar! Leta efter en påsautomat 🛍️", "Out of bags! Look for a bag dispenser 🛍️"), 4);
}

// Bajset försvann nedanför skärmen utan att någon plockade upp det
function lamna(b) {
  b.borta = true;
  stat.lamnat += 1;
  if (pasar > 0) {
    // Grannen dyker upp. Grannen såg.
    const g = nyPerson("granne", begr(b.x, -grans, grans), kamera - (hojd - ankare) / u + 1.2, { tillfallig: 3 });
    saker.push(g);
    saga(g, PRAT.granne[0], 3);
    ge("", -P.lamna, g.x, g.v + 1.6, "#ff8a7a");
    spelaTon(200, 170, 0.35, "triangle", 0.15);
  } else {
    ge(INSTALLNINGAR.ingenSag, -P.lamna, barn.x, barn.v - 1, "#ffe9b3");
    kika(barn.x, barn.v);
    utmarkelse("detVarInteJag");
  }
}

// ---------- Influencern filmar ----------

function formatera(tal) {
  return tal.toLocaleString(SPRAK === "sv" ? "sv-SE" : "en-US");
}

// Influencern som filmar just nu, om hon är nära (x, v)
function filmare(x, v) {
  return saker.find((p) => p.sort === "influencer" && p.filmar && p.viralVila <= 0 && Math.hypot(p.x - x, p.v - v) < 7);
}

// Något pinsamt hände på film. Det går viralt!
function viral(x, v) {
  const p = filmare(x, v);
  if (!p) return;
  p.viralVila = 3;
  const nya = Math.round(slumpMellan(800, 4500) / 10) * 10;
  foljare += nya;
  ge(t("📱 VIRALT!", "📱 VIRAL!"), P.viral, x, v + 1.6, "#ff9ff3");
  visaText(`+${formatera(nya)} ${t("följare", "followers")}`, x, v + 2.3, "#ffffff", false, 1.8);
  saga(p, slumpa(PRAT.influencerViral), 2.6);
  spelaArpeggio([880, 1175, 1568]);
  utmarkelse("viral");
}

// Något bra hände på film. Ingen bryr sig.
function brasak(x, v) {
  const p = filmare(x, v);
  if (!p) return;
  p.viralVila = 3;
  visaText(t("📱 3 likes", "📱 3 likes"), x, v + 1.9, "#ffffff", false, 1.8);
  saga(p, slumpa(PRAT.influencerTrakigt), 2.6);
}

// Någon i ett hus i närheten tittar ut genom gardinen
function kika(x, v) {
  if (banTyp() !== "kvarter") return;
  let bast = null;
  let bastD = 6;
  for (const h of saker) {
    if (h.typ !== "hus") continue;
    for (let fv = h.v0 + 0.8; fv < h.v1 - 0.5; fv += 1.6) {
      const d = Math.hypot(h.sida * 3.9 - x, fv - v);
      if (d < bastD) {
        bast = { hus: h, v: fv };
        bastD = d;
      }
    }
  }
  if (!bast) return;
  kikare = { ...bast, kvar: 3.5 };
  visaText(t("*gardinen rör sig*", "*the curtain twitches*"), bast.hus.sida * 3.2, bast.v + 0.7, "#ffffff", false, 2.2);
}

// ---------- Hundmätaren ----------

function uppdateraHumor(dt) {
  if (hund.los) return;
  const fore = humor;
  let f = 0;
  switch (hund.lage) {
    case "gar": f = regn > 0 ? 0 : barn.stilla > 1.5 ? H.tristStilla : H.tristGa; break;
    case "nosar": f = humor < 65 ? H.nosa : -4; break;
    case "halsar": f = H.halsa; break;
    case "jagar":
    case "tillGras": f = H.jaga * (hundTyp.vild || 1); break;
    case "tigger": f = 2; break;
    case "pol": f = 6; break;
    case "apport": f = 0; break;
    case "fot": f = -2; break;
    case "trasslad": f = -3; break;
  }
  humor = begr(humor + f * dt, 0, 100);
  if (dt > 0) humorTrend += ((humor - fore) / dt - humorTrend) * Math.min(1, dt * 4);
  if (humor >= 25 && humor <= 75) stat.gladTid += dt;
  if (humor < 20) visaTipsEnGang("trist", t("Hunden har tråkigt. Låt den nosa på ett träd!", "The dog is bored. Let it sniff a tree!"), 4);
  if (humor > 80) visaTipsEnGang("vild", t("Hunden blir för vild! Tryck på hunden: Fot!", "The dog is getting too wild! Tap the dog: Heel!"), 4);
  if (humor >= 100) borjaSmita();
}

// ---------- Kameran ----------

// Kameran följer med när barnet går för långt upp eller ner på skärmen
function uppdateraKamera(dt, direkt) {
  const spelH = hojd - panelH - marginal.botten;
  const topp = panelH + spelH * 0.45;
  const botten = panelH + spelH * 0.85;
  const y = SY(barn.v);
  let mal = kamera;
  if (direkt) mal = barn.v;
  else if (y < topp) mal = kamera + (topp - y) / u;
  else if (y > botten) mal = kamera - (y - botten) / u;
  kamera = direkt ? mal : kamera + (mal - kamera) * Math.min(1, dt * 8);
  const minst = (hojd - ankare) / u - 1.5;
  const mest = langd + 5 - (ankare - panelH) / u; // Så att man ser hela huset eller grinden i slutet
  kamera = begr(kamera, minst, Math.max(minst, mest));
}

function uppdatera(dt) {
  if (lage === "paus") return; // Allt står still under pausen
  tid += dt;
  skakning = Math.max(0, skakning - dt);
  tipsTid = Math.max(0, tipsTid - dt);
  if (lapp) {
    lapp.kvar -= dt;
    if (lapp.kvar <= 0) lapp = null;
  }
  if (toaster.length) {
    toaster[0].kvar -= dt;
    if (toaster[0].kvar <= 0) toaster.shift();
  }
  if (kikare) {
    kikare.kvar -= dt;
    if (kikare.kvar <= 0) kikare = null;
  }
  for (const t of texter) {
    t.kvar -= dt;
    t.v += dt * 0.8;
  }
  texter = texter.filter((t) => t.kvar > 0);
  for (const b of bubblor) b.kvar -= dt;
  bubblor = bubblor.filter((b) => b.kvar > 0);
  for (const t of tassar) t.kvar -= dt;
  tassar = tassar.filter((t) => t.kvar > 0);
  if (lage !== "spelar") {
    tidSedanSlut += dt;
    return;
  }

  speltid += dt;
  stat.banTid += dt;
  uppdateraBarn(dt);
  uppdateraHund(dt);
  const drogs = kopplet();
  if (drogs / Math.max(dt, 0.001) > 1.3 && hundDrag() >= 0.7) {
    // Barnet släpas efter hunden!
    if (barn.slapas <= 0 && tid - senastWii > 2.5) {
      senastWii = tid;
      visaText(slumpa([t("Wiiiii!", "Wheeee!"), t("Neeej!", "Nooo!"), t("Vänta!", "Wait!")]), barn.x, barn.v + 1.2, "#ffffff");
      viral(barn.x, barn.v);
    }
    barn.slapas = 0.25;
    slapTid += dt;
    if (slapTid >= 8) utmarkelse("ensamstaende");
  }
  hindra(barn, true);
  hindra(hund, false);
  hartKoppel();
  uppdateraTrassel();
  uppdateraSaker(dt);
  uppdateraBilar(dt);
  uppdateraHandelser(dt);
  if (masOm > 0) {
    masOm -= dt;
    if (masOm <= 0 && barn.korv > 0) {
      saker.push({ typ: "masattack", x: grans + 1, v: barn.v + 5, franX: grans + 1, franV: barn.v + 5, z: 3, fas: 0, har: false });
      spelaTon(1600, 1200, 0.3, "sawtooth", 0.05);
    }
  }
  uppdateraBajs(dt);
  uppdateraHumor(dt);
  uppdateraKamera(dt);
  while (barn.v > langst + 1) {
    langst += 1;
    poang += P.steg;
  }
  if (slutOm > 0) {
    slutOm -= dt;
    if (slutOm <= 0) slutaSpel();
    return;
  }
  if (barn.v >= langd - 0.8) {
    if (hund.los) visaTipsEnGang("fanga", t("Fånga hunden först!", "Catch the dog first!"), 3);
    else banaKlar();
  }
}

// ---------- Rita ----------

function ritaText(text, x, y, storlek, farg = "#ffffff", just = "center") {
  ctx.font = `bold ${storlek}px ${TYPSNITT}`;
  ctx.textAlign = just;
  ctx.textBaseline = "middle";
  ctx.lineJoin = "round";
  ctx.lineWidth = storlek * 0.18;
  ctx.strokeStyle = "rgba(30, 30, 10, 0.65)";
  ctx.strokeText(text, x, y);
  ctx.fillStyle = farg;
  ctx.fillText(text, x, y);
}

// Delar upp en text i rader som får plats (ctx.font måste vara satt)
function radbryt(text, maxBredd) {
  const ord = text.split(" ");
  const rader = [];
  let rad = "";
  for (const o of ord) {
    const test = rad ? rad + " " + o : o;
    if (rad && ctx.measureText(test).width > maxBredd) {
      rader.push(rad);
      rad = o;
    } else {
      rad = test;
    }
  }
  if (rad) rader.push(rad);
  return rader;
}

// Att rita emojis som text är långsamt på iPad. Därför ritas varje emoji
// en gång på en egen liten bild (emojiMinne), som sedan återanvänds.

function emojiBild(bild, storlek, farg) {
  const nyckel = bild + "|" + Math.round(storlek * pixelSkala) + "|" + (farg || "");
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
    if (farg) {
      // Färga emojin (men bara där den redan syns)
      c.globalCompositeOperation = "source-atop";
      c.globalAlpha = 0.55;
      c.fillStyle = farg;
      c.fillRect(0, 0, sida, sida);
    }
    emojiMinne.set(nyckel, liten);
  }
  return liten;
}

function ritaEmoji(bild, x, y, storlek, just = "center", spegla = false, farg = "") {
  const liten = emojiBild(bild, storlek, farg);
  const sida = liten.width / pixelSkala;
  let vanster = x - sida / 2;
  if (just === "left") vanster = x - (sida - storlek) / 2;
  if (just === "right") vanster = x - storlek - (sida - storlek) / 2;
  if (spegla) {
    ctx.save();
    ctx.translate(x * 2, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(liten, vanster, y - sida / 2, sida, sida);
    ctx.restore();
  } else {
    ctx.drawImage(liten, vanster, y - sida / 2, sida, sida);
  }
}

function skugga(x, y, rx, ry) {
  ctx.fillStyle = "rgba(30, 50, 10, 0.25)";
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();
}

// Det synliga området av promenaden
function synligt() {
  return {
    botten: kamera - (hojd - ankare) / u - 1,
    topp: kamera + ankare / u + 1,
    halv: bredd / 2 / u + 1,
  };
}

function ritaMarken() {
  const syn = synligt();
  const typ = banTyp();
  ctx.fillStyle = MARKFARG[typ];
  ctx.fillRect(0, 0, bredd, hojd);
  if (typ === "kvarter" || typ === "park") ritaGras(syn, typ === "park");
  else if (typ === "stad") ritaGatan(syn);
  else ritaSanden(syn);

  // Gubbens gräsmatta, hundrastgården och dammen ligger under vägen
  for (const s of saker) {
    if (s.typ === "grasmatta" && s.v1 > syn.botten && s.v0 < syn.topp) ritaGrasmatta(s);
    if (s.typ === "rastgard" && s.v1 > syn.botten && s.v0 < syn.topp) ritaRastgard(s);
    if (s.typ === "damm" && !s.fontan && Math.abs(s.v - kamera) < 14) ritaDamm(s);
  }

  ritaVagen(syn, typ);
  for (const s of saker) {
    if (s.fontan && Math.abs(s.v - kamera) < 14) ritaDamm(s); // Fontänen står mitt på gågatan
  }

  for (const s of saker) {
    if (s.typ === "hus" && s.v1 > syn.botten && s.v0 < syn.topp) ritaHus(s);
    if (s.typ === "butik" && s.v1 > syn.botten && s.v0 < syn.topp) ritaButik(s);
  }
  if (kikare) {
    // Ögon i fönstret
    const h = kikare.hus;
    ctx.globalAlpha = Math.min(1, kikare.kvar * 2);
    ritaEmoji("👀", SX(h.sida * 3.8) + h.sida * u * 0.175, SY(kikare.v), u * 0.3);
    ctx.globalAlpha = 1;
  }
  for (const s of saker) {
    if (s.typ === "staket" && s.v1 > syn.botten && s.v0 < syn.topp) ritaStaket(s);
    if (s.typ === "pol" && s.v > syn.botten && s.v < syn.topp) ritaPol(s);
    if (s.typ === "grop" && s.v > syn.botten && s.v < syn.topp) {
      ctx.fillStyle = "#8a6038";
      ctx.beginPath();
      ctx.ellipse(SX(s.x), SY(s.v), u * 0.3, u * 0.14, 0, 0, VARV);
      ctx.fill();
      ctx.fillStyle = "#4a2f18";
      ctx.beginPath();
      ctx.ellipse(SX(s.x), SY(s.v) + u * 0.02, u * 0.18, u * 0.08, 0, 0, VARV);
      ctx.fill();
    }
    if (s.kiss && s.v > syn.botten && s.v < syn.topp) {
      ctx.fillStyle = "rgba(240, 220, 90, 0.55)";
      ctx.beginPath();
      ctx.ellipse(SX(s.x) + u * 0.15, SY(s.v) + u * 0.05, u * 0.25, u * 0.09, 0, 0, VARV);
      ctx.fill();
    }
  }
  ritaMal();

  // Leriga tassavtryck
  for (const tass of tassar) {
    ctx.fillStyle = `rgba(110, 75, 40, ${Math.min(0.6, tass.kvar * 0.3)})`;
    ctx.beginPath();
    ctx.arc(SX(tass.x), SY(tass.v), u * 0.05, 0, VARV);
    ctx.fill();
  }
}

// Grästuvor (och blommor i parken)
function ritaGras(syn, park) {
  const ruta = 0.8;
  ctx.strokeStyle = park ? "#69ae44" : "#72b551";
  ctx.lineWidth = Math.max(1.5, u * 0.03);
  ctx.lineCap = "round";
  ctx.beginPath();
  const blommor = [];
  for (let i = Math.floor(syn.botten / ruta); i <= syn.topp / ruta; i++) {
    for (let j = Math.floor(-syn.halv / ruta); j <= syn.halv / ruta; j++) {
      const r = slumpTal(i * 71 + j * 17 + banNr * 1000);
      if (r > 0.42) continue;
      const x = SX((j + slumpTal(i * 13 + j * 7)) * ruta);
      const y = SY((i + slumpTal(i * 5 + j * 29)) * ruta);
      if (park && r < 0.04) {
        blommor.push([x, y, r]);
        continue;
      }
      ctx.moveTo(x - u * 0.07, y - u * 0.08);
      ctx.lineTo(x, y);
      ctx.lineTo(x + u * 0.07, y - u * 0.1);
    }
  }
  ctx.stroke();
  for (const [x, y, r] of blommor) {
    ctx.fillStyle = ["#ffffff", "#ffd84d", "#ff8fb1"][Math.floor(r * 75) % 3];
    for (let k = 0; k < 4; k++) {
      ctx.beginPath();
      ctx.arc(x + Math.cos(k * 1.57) * u * 0.05, y + Math.sin(k * 1.57) * u * 0.05, u * 0.04, 0, VARV);
      ctx.fill();
    }
  }
}

// Bilgatan till höger i stan, med bilar som kör förbi
function ritaGatan(syn) {
  const kant = SX(2.75);
  ctx.fillStyle = "#5b5f66";
  ctx.fillRect(kant, 0, bredd - kant, hojd);
  ctx.fillStyle = "#9a958c"; // Trottoarkanten
  ctx.fillRect(kant - u * 0.08, 0, u * 0.08, hojd);
  ctx.fillStyle = "#f2f2f2";
  for (let v = Math.floor(syn.botten / 2) * 2; v <= syn.topp; v += 2) {
    ctx.fillRect(SX(4.55) - u * 0.04, SY(v + 1), u * 0.08, u * 1);
  }
  for (const b of bilar) {
    ctx.save();
    ctx.translate(SX(b.x), SY(b.v));
    ctx.rotate(b.fart < 0 ? -Math.PI / 2 : Math.PI / 2);
    ritaEmoji(b.bild, 0, 0, u * 1.1);
    ctx.restore();
  }
}

// Sanden, sanddynerna och havet till höger
function ritaSanden(syn) {
  // Strandgräs och prickar i sanden
  ctx.strokeStyle = "#9bb35a";
  ctx.lineWidth = Math.max(1.5, u * 0.03);
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.fillStyle = "rgba(170, 130, 70, 0.3)";
  const ruta = 0.7;
  for (let i = Math.floor(syn.botten / ruta); i <= syn.topp / ruta; i++) {
    for (let j = Math.floor(-syn.halv / ruta); j <= syn.halv / ruta; j++) {
      const r = slumpTal(i * 53 + j * 31 + 77);
      const xe = (j + slumpTal(i * 11 + j * 3)) * ruta;
      const x = SX(xe);
      const y = SY((i + slumpTal(i * 7 + j * 19)) * ruta);
      if (r < 0.35) ctx.fillRect(x, y, 2, 2);
      if (xe < -2.2 && r > 0.75) {
        ctx.moveTo(x - u * 0.1, y - u * 0.15);
        ctx.lineTo(x, y);
        ctx.lineTo(x + u * 0.03, y - u * 0.22);
        ctx.moveTo(x, y);
        ctx.lineTo(x + u * 0.12, y - u * 0.14);
      }
    }
  }
  ctx.stroke();

  // Havet
  const steg = 0.4;
  const v0 = Math.floor(syn.botten / steg) * steg;
  const kust = (vatt, extra) => {
    ctx.beginPath();
    ctx.moveTo(bredd, SY(v0));
    for (let v = v0; v <= syn.topp + steg; v += steg) ctx.lineTo(SX(strandlinje(v) + extra(v)), SY(v));
    ctx.lineTo(bredd, SY(syn.topp + steg));
    ctx.closePath();
    ctx.fillStyle = vatt;
    ctx.fill();
  };
  kust("#dcc48e", () => -0.35); // Blöt sand
  kust("#4fa8d8", () => 0);
  kust("#3b8fc4", () => 1.4);
  // Vågor som rullar in
  ctx.strokeStyle = "rgba(255, 255, 255, 0.85)";
  ctx.lineWidth = Math.max(2, u * 0.05);
  ctx.beginPath();
  const vag = Math.sin(tid * 1.5) * 0.12;
  for (let v = v0; v <= syn.topp + steg; v += steg) {
    const x = SX(strandlinje(v) + vag + 0.05);
    if (v === v0) ctx.moveTo(x, SY(v));
    else ctx.lineTo(x, SY(v));
  }
  ctx.stroke();
}

// Trottoaren, grusvägen, gågatan eller strandpromenaden
function ritaVagen(syn, typ) {
  const halvVag = { kvarter: 1.6, park: 1.3, stad: 2.6, strand: 1.2 }[typ];
  const x0 = SX(-halvVag);
  const x1 = SX(halvVag);
  ctx.fillStyle = { kvarter: "#cfc9be", park: "#e3d1a0", stad: "#c9c3ba", strand: "#b98a5a" }[typ];
  ctx.fillRect(x0, 0, x1 - x0, hojd);
  if (typ === "park") {
    // Småsten i gruset
    ctx.fillStyle = "rgba(150, 120, 70, 0.35)";
    for (let i = Math.floor(syn.botten / 0.5); i <= syn.topp / 0.5; i++) {
      for (let j = 0; j < 3; j++) {
        const x = -halvVag + slumpTal(i * 3 + j * 11) * halvVag * 2;
        const v = i * 0.5 + slumpTal(i * 7 + j) * 0.5;
        ctx.beginPath();
        ctx.arc(SX(x), SY(v), u * 0.03, 0, VARV);
        ctx.fill();
      }
    }
  } else if (typ === "strand") {
    // Plankor
    ctx.strokeStyle = "rgba(90, 55, 25, 0.45)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    for (let v = Math.floor(syn.botten / 0.35) * 0.35; v <= syn.topp; v += 0.35) {
      ctx.moveTo(x0, SY(v));
      ctx.lineTo(x1, SY(v));
    }
    ctx.stroke();
    ctx.fillStyle = "#8a5f36";
    ctx.fillRect(x0 - u * 0.08, 0, u * 0.08, hojd);
    ctx.fillRect(x1, 0, u * 0.08, hojd);
  } else {
    // Plattor (stora i stan)
    const ruta = typ === "stad" ? 1.3 : 1;
    ctx.strokeStyle = "rgba(120, 110, 100, 0.35)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    for (let v = Math.floor(syn.botten / ruta) * ruta; v <= syn.topp; v += ruta) {
      ctx.moveTo(x0, SY(v));
      ctx.lineTo(x1, SY(v));
    }
    for (let x = -halvVag + ruta; x < halvVag; x += ruta) {
      ctx.moveTo(SX(x), 0);
      ctx.lineTo(SX(x), hojd);
    }
    if (typ === "kvarter") {
      ctx.moveTo(SX(0), 0);
      ctx.lineTo(SX(0), hojd);
    }
    ctx.stroke();
    if (typ === "kvarter") {
      ctx.fillStyle = "#a9a39a"; // Trottoarkanten
      ctx.fillRect(x0 - u * 0.06, 0, u * 0.06, hojd);
      ctx.fillRect(x1, 0, u * 0.06, hojd);
    }
  }
}

function ritaHus(h) {
  const inne = SX(h.sida * 3.8);
  const ute = SX(h.sida * 14);
  const x0 = Math.min(inne, ute);
  const x1 = Math.max(inne, ute);
  const y0 = SY(h.v1);
  const y1 = SY(h.v0);
  // Skugga på gräset
  ctx.fillStyle = "rgba(30, 60, 20, 0.22)";
  ctx.fillRect(h.sida > 0 ? x0 - u * 0.2 : x1, y0 + u * 0.15, u * 0.2, y1 - y0);
  // Väggen mot gatan
  ctx.fillStyle = h.farg;
  ctx.fillRect(x0, y0, x1 - x0, y1 - y0);
  // Fönster och dörr på väggen
  const vagg = u * 0.35;
  const vx = h.sida > 0 ? x0 : x1 - vagg;
  ctx.fillStyle = "#9fd0ee";
  for (let v = h.v0 + 0.8; v < h.v1 - 0.5; v += 1.6) {
    ctx.fillRect(vx + vagg * 0.25, SY(v) - u * 0.25, vagg * 0.5, u * 0.5);
  }
  const mitt = SY((h.v0 + h.v1) / 2);
  ctx.fillStyle = "#7a4a2a";
  ctx.fillRect(vx + vagg * 0.15, mitt - u * 0.3, vagg * 0.7, u * 0.6);
  // Taket
  const tx0 = h.sida > 0 ? x0 + vagg : x0;
  const tx1 = h.sida > 0 ? x1 : x1 - vagg;
  ctx.fillStyle = h.tak;
  ctx.fillRect(tx0, y0, tx1 - tx0, y1 - y0);
  ctx.strokeStyle = "rgba(0, 0, 0, 0.18)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  for (let y = y0 + u * 0.3; y < y1; y += u * 0.3) {
    ctx.moveTo(tx0, y);
    ctx.lineTo(tx1, y);
  }
  ctx.stroke();
  ctx.strokeStyle = "rgba(0, 0, 0, 0.3)";
  ctx.lineWidth = 3;
  ctx.strokeRect(x0, y0, x1 - x0, y1 - y0);
}

function ritaStaket(s) {
  const x = SX(s.sida * 3.5);
  ctx.strokeStyle = "#f4efe2";
  ctx.lineWidth = Math.max(2, u * 0.05);
  ctx.beginPath();
  ctx.moveTo(x - u * 0.06, SY(s.v0));
  ctx.lineTo(x - u * 0.06, SY(s.v1));
  ctx.moveTo(x + u * 0.06, SY(s.v0));
  ctx.lineTo(x + u * 0.06, SY(s.v1));
  ctx.stroke();
  ctx.fillStyle = "#ffffff";
  ctx.strokeStyle = "rgba(80, 70, 50, 0.5)";
  ctx.lineWidth = 1;
  for (let v = s.v0; v <= s.v1; v += 0.45) {
    ctx.fillRect(x - u * 0.09, SY(v) - u * 0.05, u * 0.18, u * 0.1);
    ctx.strokeRect(x - u * 0.09, SY(v) - u * 0.05, u * 0.18, u * 0.1);
  }
}

function ritaGrasmatta(g) {
  const inne = SX(g.sida * 1.65);
  const ute = SX(g.sida * 3.75);
  const x0 = Math.min(inne, ute);
  const w = Math.abs(ute - inne);
  // Perfekt klippt, med ränder
  for (let v = g.v0, i = 0; v < g.v1; v += 0.6, i++) {
    ctx.fillStyle = i % 2 ? "#5fc23e" : "#6dd04b";
    const y = SY(Math.min(v + 0.6, g.v1));
    ctx.fillRect(x0, y, w, SY(v) - y);
  }
  // Liten skylt: "Beträd ej gräsmattan"
  const sx = SX(g.sida * 2.3);
  const sy = SY(g.v0 + 0.5);
  ctx.fillStyle = "#6b4a2a";
  ctx.fillRect(sx - u * 0.03, sy - u * 0.5, u * 0.06, u * 0.5);
  ctx.fillStyle = "#ffffff";
  ctx.strokeStyle = "#c0392b";
  ctx.lineWidth = 2;
  rundRekt(ctx, sx - u * 0.4, sy - u * 0.8, u * 0.8, u * 0.34, 4);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#c0392b";
  ctx.font = `bold ${Math.max(7, u * 0.11)}px ${TYPSNITT}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(t("BETRÄD EJ", "KEEP OFF"), sx, sy - u * 0.69);
  ctx.fillText(t("GRÄSMATTAN", "THE GRASS"), sx, sy - u * 0.56);
}

function ritaRastgard(r) {
  const inne = SX(r.sida * 2.2);
  const ute = SX(r.sida * 5.2);
  const x0 = Math.min(inne, ute);
  const w = Math.abs(ute - inne);
  const y0 = SY(r.v1);
  const h = SY(r.v0) - y0;
  ctx.fillStyle = "#c9b27c";
  ctx.fillRect(x0, y0, w, h);
  ctx.strokeStyle = "#7a5a3a";
  ctx.lineWidth = Math.max(2, u * 0.04);
  ctx.strokeRect(x0, y0, w, h);
  ctx.fillStyle = "#5a3a22";
  for (let x = x0; x <= x0 + w + 1; x += u * 0.5) {
    ctx.fillRect(x - 2, y0 - 2, 4, 4);
    ctx.fillRect(x - 2, y0 + h - 2, 4, 4);
  }
  ritaEmoji("🦴", x0 + w * 0.5, y0 + h * 0.5, u * 0.4);
  ritaEmoji("🎾", x0 + w * 0.3, y0 + h * 0.3, u * 0.3);
}

function ritaDamm(d) {
  const x = SX(d.x);
  const y = SY(d.v);
  if (d.fontan) {
    // Stenkant, vatten och en stråle i mitten
    ctx.fillStyle = "#a9a39a";
    ctx.beginPath();
    ctx.arc(x, y, (d.rx + 0.15) * u, 0, VARV);
    ctx.fill();
    ctx.fillStyle = "#6cb8e8";
    ctx.beginPath();
    ctx.arc(x, y, d.rx * u, 0, VARV);
    ctx.fill();
    ctx.fillStyle = "#a9a39a";
    ctx.beginPath();
    ctx.arc(x, y, u * 0.15, 0, VARV);
    ctx.fill();
    ctx.fillStyle = "rgba(220, 240, 255, 0.9)";
    for (let i = 0; i < 10; i++) {
      const f = (tid * 1.2 + i / 10) % 1;
      const a = i * 2.4;
      const r = f * d.rx * u * 0.8;
      ctx.beginPath();
      ctx.arc(x + Math.cos(a) * r, y + Math.sin(a) * r * 0.8 - Math.sin(f * Math.PI) * u * 0.6, u * 0.04, 0, VARV);
      ctx.fill();
    }
    return;
  }
  ctx.fillStyle = "#6f9e5a";
  ctx.beginPath();
  ctx.ellipse(x, y, (d.rx + 0.18) * u, (d.rv + 0.18) * u, 0, 0, VARV);
  ctx.fill();
  ctx.fillStyle = "#5aa9e6";
  ctx.beginPath();
  ctx.ellipse(x, y, d.rx * u, d.rv * u, 0, 0, VARV);
  ctx.fill();
  ctx.strokeStyle = "rgba(255, 255, 255, 0.35)";
  ctx.lineWidth = 2;
  for (let i = 0; i < 3; i++) {
    const f = ((tid * 0.3 + i / 3) % 1) * 0.8 + 0.1;
    ctx.beginPath();
    ctx.ellipse(x + u * 0.3, y - u * 0.2, d.rx * u * f * 0.5, d.rv * u * f * 0.4, 0, 0, VARV);
    ctx.stroke();
  }
  ritaEmoji("🪷", x - d.rx * u * 0.5, y + d.rv * u * 0.4, u * 0.35);
}

function ritaPol(p) {
  const x = SX(p.x);
  const y = SY(p.v);
  ctx.fillStyle = "rgba(100, 130, 170, 0.75)";
  ctx.beginPath();
  ctx.ellipse(x, y, p.r * u, p.r * u * 0.6, 0, 0, VARV);
  ctx.fill();
  ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
  ctx.beginPath();
  ctx.ellipse(x - p.r * u * 0.3, y - p.r * u * 0.15, p.r * u * 0.3, p.r * u * 0.12, 0, 0, VARV);
  ctx.fill();
}

// En grind till nästa bana i slutet, och huset man bor i i slutet av sista banan
function ritaMal() {
  const y = SY(langd);
  if (y < -u * 6 || y > hojd + u) return;
  const nasta = INSTALLNINGAR.banor[banNr + 1];
  if (nasta) {
    // Häck (eller mur i stan) med en grind, och nästa bana på andra sidan
    const oppning = banTyp() === "stad" ? 2.9 : 1.9;
    ctx.fillStyle = MARKFARG[nasta.typ];
    ctx.fillRect(0, 0, bredd, y - u * 0.8);
    ctx.fillStyle = banTyp() === "stad" ? "#8a8f98" : "#3f8f3a";
    ctx.fillRect(0, y - u * 0.8, SX(-oppning), u * 0.8);
    ctx.fillRect(SX(oppning), y - u * 0.8, bredd - SX(oppning), u * 0.8);
    for (const sida of [-1, 1]) {
      const px = SX(sida * oppning);
      ctx.fillStyle = "#9a9a9a";
      ctx.fillRect(px - u * 0.25, y - u * 1.6, u * 0.5, u * 1.6);
      ctx.fillStyle = "#7d7d7d";
      ctx.fillRect(px - u * 0.3, y - u * 1.75, u * 0.6, u * 0.2);
    }
    ctx.strokeStyle = "#3a3a3a";
    ctx.lineWidth = Math.max(3, u * 0.08);
    ctx.beginPath();
    ctx.moveTo(SX(-oppning), y - u * 1.6);
    ctx.quadraticCurveTo(SX(0), y - u * 2.6, SX(oppning), y - u * 1.6);
    ctx.stroke();
    ritaText(nasta.namn.toUpperCase(), SX(0), y - u * 2, u * 0.42, "#ffe9b3");
    ritaEmoji(nasta.ikon, SX(0), y - u * 2.75, u * 0.5);
  } else {
    // Hemma!
    const x0 = SX(-3.2);
    const x1 = SX(3.2);
    ctx.fillStyle = "#f2d98d";
    ctx.fillRect(x0, y - u * 4, x1 - x0, u * 3.4);
    ctx.fillStyle = "#a8443a";
    ctx.beginPath();
    ctx.moveTo(x0 - u * 0.4, y - u * 3.6);
    ctx.lineTo(SX(0), y - u * 6);
    ctx.lineTo(x1 + u * 0.4, y - u * 3.6);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#7a4a2a";
    ctx.fillRect(SX(-0.45), y - u * 1.9, u * 0.9, u * 1.3);
    ctx.fillStyle = "#ffd84d";
    ctx.beginPath();
    ctx.arc(SX(0.3), y - u * 1.25, u * 0.06, 0, VARV);
    ctx.fill();
    ctx.fillStyle = "#9fd0ee";
    ctx.fillRect(SX(-2.4), y - u * 3.2, u * 1, u * 0.8);
    ctx.fillRect(SX(1.4), y - u * 3.2, u * 1, u * 0.8);
    ctx.fillStyle = "#c0392b";
    ctx.fillRect(SX(-0.7), y - u * 0.6, u * 1.4, u * 0.4); // Dörrmatta
    ritaText(t("HEM", "HOME"), SX(0), y - u * 2.4, u * 0.45, "#ffffff");
  }
}

// ---------- Rita det som står upp (träd, folk, hunden, barnet...) ----------

function ritaTrad(s) {
  const x = SX(s.x);
  const y = SY(s.v);
  const st = s.storlek * u;
  skugga(x, y, st * 0.35, st * 0.12);
  ritaEmoji("🌳", x, y - st * 0.42, st);
  if (s.pasar) {
    // Tre bajspåsar hänger i grenarna
    ctx.strokeStyle = "#3a2a1a";
    ctx.lineWidth = 1.5;
    for (let i = 0; i < 3; i++) {
      const px = x + (i - 1) * st * 0.22;
      const py = y - st * 0.42 + Math.sin(tid * 2 + i) * u * 0.03;
      ctx.beginPath();
      ctx.moveTo(px, py - u * 0.2);
      ctx.lineTo(px, py);
      ctx.stroke();
      ctx.fillStyle = "#1f2a1f";
      ctx.beginPath();
      ctx.ellipse(px, py + u * 0.14, u * 0.13, u * 0.16, 0, 0, VARV);
      ctx.fill();
    }
  }
}

function ritaLykta(s) {
  const x = SX(s.x);
  const y = SY(s.v);
  skugga(x, y, u * 0.18, u * 0.06);
  ctx.fillStyle = "#3d4450";
  ctx.fillRect(x - u * 0.05, y - u * 1.7, u * 0.1, u * 1.7);
  ctx.fillRect(x - u * 0.1, y - u * 0.1, u * 0.2, u * 0.1);
  ctx.beginPath();
  ctx.ellipse(x, y - u * 1.75, u * 0.2, u * 0.1, 0, 0, VARV);
  ctx.fill();
  ctx.fillStyle = "#fff3b0";
  ctx.beginPath();
  ctx.ellipse(x, y - u * 1.68, u * 0.12, u * 0.05, 0, 0, VARV);
  ctx.fill();
  if (s.lapp) {
    ctx.save();
    ctx.translate(x, y - u * 0.95);
    ctx.rotate(0.08);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(-u * 0.16, -u * 0.2, u * 0.32, u * 0.4);
    ctx.fillStyle = "#555555";
    for (let i = 0; i < 4; i++) ctx.fillRect(-u * 0.11, -u * 0.13 + i * u * 0.08, u * 0.22, 1.5);
    ctx.restore();
  }
}

function ritaAutomat(s) {
  const x = SX(s.x);
  const y = SY(s.v);
  skugga(x, y, u * 0.2, u * 0.07);
  ctx.fillStyle = "#2f7d4a";
  ctx.fillRect(x - u * 0.04, y - u * 0.9, u * 0.08, u * 0.9);
  rundRekt(ctx, x - u * 0.25, y - u * 1.35, u * 0.5, u * 0.5, 5);
  ctx.fill();
  ritaEmoji("🛍️", x, y - u * 1.1, u * 0.32);
  if (!s.tagen && lage === "spelar" && pasar < INSTALLNINGAR.pasarMax) {
    const studs = Math.abs(Math.sin(tid * 3)) * u * 0.1;
    ritaText("+🛍️", x, y - u * 1.65 - studs, u * 0.3);
  }
}

function ritaKatt(s) {
  const x = SX(s.x);
  const y = SY(s.v);
  ctx.globalAlpha = begr(s.ut, 0, 1);
  const hopp = s.flyr ? Math.abs(Math.sin(tid * 14)) * u * 0.15 : 0;
  if (!s.flyr) skugga(x, y, u * 0.2, u * 0.06);
  ritaEmoji(s.bild, x, y - u * 0.25 - hopp, u * 0.55, "center", s.flyr ? s.x > 0 : s.x < 0);
  ctx.globalAlpha = 1;
}

function ritaEkorre(s) {
  const x = SX(s.x);
  const y = SY(s.v);
  ctx.globalAlpha = begr(s.ut, 0, 1);
  const upp = s.klattrar ? (1 - s.ut) * u * 1.2 : 0;
  ritaEmoji("🐿️", x, y - u * 0.2 - upp, u * 0.42, "center", Math.cos(s.vinkel) * s.varv > 0);
  ctx.globalAlpha = 1;
}

function ritaAnka(s) {
  const x = SX(s.x);
  const y = SY(s.v) - s.lyft * u;
  ctx.globalAlpha = begr(s.ut, 0, 1);
  const gung = s.flyger ? 0 : Math.sin(tid * 3 + s.vinkel) * u * 0.03;
  ritaEmoji("🦆", x, y - u * 0.15 + gung, u * 0.45, "center", Math.sin(s.vinkel) > 0);
  ctx.globalAlpha = 1;
}

function ritaGodsak(s) {
  const x = SX(s.x);
  const y = SY(s.v) - u * 0.2 + Math.sin(tid * 3 + s.fas) * u * 0.06;
  if (s.guld) {
    const g = ctx.createRadialGradient(x, y, 0, x, y, u * 0.5);
    g.addColorStop(0, "rgba(255, 225, 77, 0.8)");
    g.addColorStop(1, "rgba(255, 225, 77, 0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, u * 0.5, 0, VARV);
    ctx.fill();
    ritaEmoji("✨", x + Math.cos(tid * 2) * u * 0.3, y + Math.sin(tid * 2) * u * 0.3, u * 0.25);
  }
  ritaEmoji(s.bild, x, y, u * 0.4);
}

function ritaKiosk(k) {
  const x = SX(k.x);
  const y = SY(k.v);
  const w = u * 1.6;
  skugga(x, y, w * 0.6, u * 0.15);
  ctx.fillStyle = "#f5efe0";
  ctx.fillRect(x - w / 2, y - u * 1.3, w, u * 1.3);
  ctx.strokeStyle = "#7a5a3a";
  ctx.lineWidth = 2;
  ctx.strokeRect(x - w / 2, y - u * 1.3, w, u * 1.3);
  // Lucka med korvgubben
  ctx.fillStyle = "#4a3a2a";
  ctx.fillRect(x - w * 0.35, y - u * 1.05, w * 0.7, u * 0.5);
  ritaEmoji("🧑‍🍳", x, y - u * 0.85, u * 0.45);
  ctx.fillStyle = "#c9a27a";
  ctx.fillRect(x - w * 0.4, y - u * 0.58, w * 0.8, u * 0.1);
  // Randigt tak
  for (let i = 0; i < 6; i++) {
    ctx.fillStyle = i % 2 ? "#ffffff" : k.glass ? "#ff8fb1" : "#e63946";
    ctx.fillRect(x - w * 0.55 + (i * w * 1.1) / 6, y - u * 1.55, (w * 1.1) / 6 + 0.5, u * 0.28);
  }
  ritaEmoji(k.glass ? "🍦" : "🌭", x, y - u * 1.8, u * 0.45);
  ritaText(k.glass ? t("49:-", "$6") : t("45:-", "$9"), x + w * 0.42, y - u * 0.3, u * 0.22, "#ffe14d");
}

function ritaBank(b) {
  const x = SX(b.x);
  const y = SY(b.v);
  skugga(x, y, u * 0.75, u * 0.12);
  ctx.fillStyle = "#8a5a32";
  ctx.fillRect(x - u * 0.7, y - u * 0.5, u * 1.4, u * 0.12);
  ctx.fillRect(x - u * 0.7, y - u * 0.75, u * 1.4, u * 0.1);
  ctx.fillStyle = "#3d3d3d";
  ctx.fillRect(x - u * 0.6, y - u * 0.4, u * 0.08, u * 0.4);
  ctx.fillRect(x + u * 0.52, y - u * 0.4, u * 0.08, u * 0.4);
}

function ritaSkylt(s) {
  const x = SX(s.x);
  const y = SY(s.v);
  ctx.fillStyle = "#6b4a2a";
  ctx.fillRect(x - u * 0.04, y - u * 1, u * 0.08, u * 1);
  ctx.fillStyle = "#ffffff";
  ctx.strokeStyle = "#2f7d4a";
  ctx.lineWidth = 2;
  rundRekt(ctx, x - u * 0.45, y - u * 1.4, u * 0.9, u * 0.5, 4);
  ctx.fill();
  ctx.stroke();
  const [ikon1, ikon2] = s.ikoner || ["🐕", "🔗"];
  ritaEmoji(ikon1, x - u * 0.2, y - u * 1.15, u * 0.28);
  ritaEmoji(ikon2, x + u * 0.18, y - u * 1.15, u * 0.24);
}

// Butikerna i stan: väggen med skyltfönster, en randig markis och taket
function ritaButik(b) {
  const inne = SX(-2.95);
  const x0 = SX(-14);
  const y0 = SY(b.v1);
  const y1 = SY(b.v0);
  const vagg = u * 0.35;
  ctx.fillStyle = "#6b6f78";
  ctx.fillRect(x0, y0, inne - x0, y1 - y0);
  ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
  for (let y = y0 + u * 0.4; y < y1; y += u * 0.4) ctx.fillRect(x0, y, inne - vagg - x0, 2);
  ctx.fillStyle = b.farg;
  ctx.fillRect(inne - vagg, y0, vagg, y1 - y0);
  // Skyltfönster och dörr
  ctx.fillStyle = "#bfe3f5";
  ctx.fillRect(inne - vagg * 0.75, y0 + u * 0.5, vagg * 0.5, y1 - y0 - u * 1.4);
  ctx.fillStyle = "#5a3a22";
  ctx.fillRect(inne - vagg * 0.8, y1 - u * 0.75, vagg * 0.6, u * 0.45);
  // Markis
  const mx = inne;
  const mw = u * 0.32;
  for (let v = b.v0 + 0.3, i = 0; v < b.v1 - 0.3; v += 0.4, i++) {
    ctx.fillStyle = i % 2 ? "#ffffff" : b.markis;
    const ya = SY(Math.min(v + 0.4, b.v1 - 0.3));
    ctx.fillRect(mx, ya, mw, SY(v) - ya);
  }
  ctx.fillStyle = "rgba(0, 0, 0, 0.12)";
  ctx.fillRect(mx + mw, SY(b.v1 - 0.3), u * 0.12, SY(b.v0 + 0.3) - SY(b.v1 - 0.3));
  ctx.strokeStyle = "rgba(0, 0, 0, 0.3)";
  ctx.lineWidth = 2;
  ctx.strokeRect(x0, y0, inne - x0, y1 - y0);
}

// Trottoarpratare: en skylt med butikens namn
function ritaPratare(s) {
  const x = SX(s.x);
  const y = SY(s.v);
  const w = u * 1.3;
  const h = u * 0.6;
  skugga(x, y, w * 0.45, u * 0.08);
  ctx.strokeStyle = "#7a5a3a";
  ctx.lineWidth = Math.max(2, u * 0.05);
  ctx.beginPath();
  ctx.moveTo(x - w * 0.4, y);
  ctx.lineTo(x - w * 0.35, y - h - u * 0.3);
  ctx.moveTo(x + w * 0.4, y);
  ctx.lineTo(x + w * 0.35, y - h - u * 0.3);
  ctx.stroke();
  ctx.fillStyle = "#2f3640";
  rundRekt(ctx, x - w / 2, y - h - u * 0.35, w, h, 4);
  ctx.fill();
  ctx.strokeStyle = "#a8774a";
  ctx.stroke();
  ctx.fillStyle = "#ffffff";
  ctx.font = `${Math.max(9, u * 0.17)}px ${HANDSTIL}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(s.text, x, y - h / 2 - u * 0.35, w - u * 0.15);
}

function ritaCafe(c) {
  const x = SX(c.x);
  const y = SY(c.v);
  for (const [dx, dv] of [[0, 0], [0.1, 1.1]]) {
    const tx = x + dx * u;
    const ty = y - dv * u;
    skugga(tx, ty, u * 0.35, u * 0.1);
    ctx.fillStyle = "#3d3d3d";
    ctx.fillRect(tx - u * 0.03, ty - u * 0.45, u * 0.06, u * 0.45);
    ctx.fillStyle = "#ffffff";
    ctx.strokeStyle = "#555555";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(tx, ty - u * 0.48, u * 0.32, u * 0.12, 0, 0, VARV);
    ctx.fill();
    ctx.stroke();
    ritaEmoji(dv ? "🥐" : "☕", tx, ty - u * 0.62, u * 0.26);
  }
}

function ritaBadhytt(b) {
  const x = SX(b.x);
  const y = SY(b.v);
  const w = u * 0.95;
  const h = u * 1.1;
  skugga(x, y, w * 0.6, u * 0.12);
  for (let i = 0; i < 5; i++) {
    ctx.fillStyle = i % 2 ? "#ffffff" : b.farg;
    ctx.fillRect(x - w / 2 + (i * w) / 5, y - h, w / 5 + 0.5, h);
  }
  ctx.fillStyle = "#5a3a22";
  ctx.fillRect(x - w * 0.18, y - h * 0.65, w * 0.36, h * 0.65);
  ctx.fillStyle = b.farg;
  ctx.beginPath();
  ctx.moveTo(x - w * 0.6, y - h);
  ctx.lineTo(x, y - h - u * 0.45);
  ctx.lineTo(x + w * 0.6, y - h);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "rgba(0, 0, 0, 0.3)";
  ctx.lineWidth = 1.5;
  ctx.stroke();
}

function ritaParasoll(s) {
  const x = SX(s.x);
  const y = SY(s.v);
  skugga(x - u * 0.2, y, u * 0.6, u * 0.18);
  ritaEmoji("⛱️", x, y - u * 0.55, u * 1.2);
}

function ritaTang(s) {
  const x = SX(s.x);
  const y = SY(s.v);
  ctx.fillStyle = "#4f6b2f";
  for (const [dx, dy, r] of [[-0.15, 0, 0.16], [0.1, -0.03, 0.14], [0, -0.1, 0.12], [0.2, 0.04, 0.1]]) {
    ctx.beginPath();
    ctx.ellipse(x + dx * u, y + dy * u, r * u * 1.5, r * u * 0.7, 0, 0, VARV);
    ctx.fill();
  }
  ritaEmoji("🐚", x + u * 0.25, y - u * 0.1, u * 0.22);
}

function ritaFagel(s) {
  const x = SX(s.x);
  const y = SY(s.v) - s.lyft * u;
  ctx.globalAlpha = begr(s.ut, 0, 1);
  if (!s.flyger) skugga(x, SY(s.v), u * 0.13, u * 0.04);
  const pick = s.flyger ? 0 : Math.max(0, Math.sin(s.fas * 6)) * u * 0.05;
  ritaEmoji("🕊️", x, y - u * 0.15 + pick, u * 0.36, "center", s.flyger ? s.riktning > 0 : Math.cos(s.fas * 0.7) > 0);
  ctx.globalAlpha = 1;
}

function ritaKrabba(s) {
  const x = SX(s.x) + Math.sin(s.fas * 18) * u * 0.02;
  const y = SY(s.v);
  ctx.globalAlpha = begr(s.ut, 0, 1);
  skugga(x, y, u * 0.16, u * 0.05);
  ritaEmoji("🦀", x, y - u * 0.13, u * 0.36);
  ctx.globalAlpha = 1;
}

function ritaSandslott(s) {
  const x = SX(s.x);
  const y = SY(s.v);
  if (s.raserat) {
    // En sandhög. Hunden har recenserat.
    ctx.fillStyle = "#e0bf7a";
    ctx.beginPath();
    ctx.ellipse(x, y - u * 0.05, u * 0.5, u * 0.18, 0, 0, VARV);
    ctx.fill();
    ritaEmoji("🚩", x + u * 0.25, y - u * 0.2, u * 0.25);
    return;
  }
  skugga(x, y, u * 0.45, u * 0.12);
  ritaEmoji("🏰", x, y - u * 0.38, u * 0.8);
}

// Måsen som tar glassen
function ritaMasattack(s) {
  const x = SX(s.x);
  const y = SY(s.v) - s.z * u;
  skugga(SX(s.x), SY(s.v), u * 0.2, u * 0.06);
  const flax = 1 + Math.sin(tid * 20) * 0.1;
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(1, flax);
  ritaEmoji("🕊️", 0, 0, u * 0.6, "center", !s.har);
  ctx.restore();
  if (s.har) ritaEmoji("🍦", x, y + u * 0.3, u * 0.3);
}

// Solbadaren ligger på en randig handduk
function ritaSolbadare(p, x, y, st) {
  const w = st * 1.4;
  const h = st * 0.5;
  for (let i = 0; i < 6; i++) {
    ctx.fillStyle = i % 2 ? "#ffffff" : "#ff6b5a";
    ctx.fillRect(x - w / 2 + (i * w) / 6, y - h, w / 6 + 0.5, h);
  }
  ctx.fillStyle = "#f2b48a"; // Kroppen (blir lite röd)
  rundRekt(ctx, x - w * 0.3, y - h * 0.72, w * 0.62, h * 0.44, h * 0.2);
  ctx.fill();
  ctx.fillStyle = "#2a6fdb";
  ctx.fillRect(x + w * 0.02, y - h * 0.72, w * 0.14, h * 0.44);
  ritaEmoji(p.bild, x - w * 0.36, y - h * 0.5, st * 0.42);
}

function ritaBoll(s) {
  const x = SX(s.x);
  const y = SY(s.v);
  skugga(x, y, u * 0.14 * (1 - s.z * 0.2), u * 0.05);
  ritaEmoji("🎾", x, y - u * 0.15 - s.z * u, u * 0.3);
}

// En elsparkcykel som ligger på sidan
function ritaSparkcykel(s) {
  const x = SX(s.x);
  const y = SY(s.v);
  skugga(x, y, u * 0.45, u * 0.1);
  ctx.save();
  ctx.translate(x, y - u * 0.12);
  ctx.rotate((s.x > 0 ? 1.35 : -1.35) + s.lutning);
  ritaEmoji("🛴", 0, 0, u * 0.62);
  ctx.restore();
}

function ritaPerson(p) {
  const x = SX(p.x);
  const y = SY(p.v);
  const st = u * 0.95 * (p.skala || 1);
  const sitter = p.sort === "pappa";
  let studs = p.gar && !p.vantar ? Math.abs(Math.sin(p.fas * 8)) * u * 0.05 : 0;
  if (p.skramd > 0) studs = Math.abs(Math.sin(p.skramd * 12)) * u * 0.35;
  if (p.sort === "granne") ctx.globalAlpha = begr(p.tillfallig * 2, 0, 1);
  if (p.hund) {
    // Den andra hunden i koppel
    const hx = SX(p.hundX);
    const hy = SY(p.hundV);
    ctx.strokeStyle = "#5a3a22";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x + st * 0.2, y - st * 0.45);
    ctx.quadraticCurveTo((x + hx) / 2, Math.max(y, hy) - st * 0.1, hx, hy - u * 0.35);
    ctx.stroke();
    skugga(hx, hy, u * 0.25, u * 0.07);
    const hopp = p.skallTid > 0 ? Math.abs(Math.sin(tid * 12)) * u * 0.08 : 0;
    ritaEmoji(p.hund, hx, hy - u * 0.28 - hopp, u * 0.58, "center", hund.x > p.hundX);
    if (p.rosett) ritaEmoji("🎀", hx + (hund.x > p.hundX ? 1 : -1) * u * 0.15, hy - u * 0.5 - hopp, u * 0.22);
    if (hund.lage === "halsar" && hund.mal === p) ritaEmoji("💕", (hx + SX(hund.x)) / 2, Math.min(hy, SY(hund.v)) - u * 0.85, u * 0.35);
  }
  if (p.sort === "solbadare") {
    ritaSolbadare(p, x, y, st);
    return;
  }
  if (p.ligger) {
    // Joggaren ligger utslagen i sanden
    skugga(x, y, st * 0.45, st * 0.1);
    ctx.save();
    ctx.translate(x, y - st * 0.25);
    ctx.rotate(-1.4);
    ritaEmoji("🏃", 0, 0, st);
    ctx.restore();
    ritaEmoji(p.bild, x - st * 0.45, y - st * 0.35, st * 0.4);
    ritaEmoji("💦", x - st * 0.2, y - st * 0.7 - Math.abs(Math.sin(tid * 3)) * st * 0.1, st * 0.25);
    return;
  }
  if (p.iVatten) {
    // Kallbadaren ute i vattnet
    const gung = Math.sin(tid * 2) * u * 0.05;
    ctx.strokeStyle = "rgba(255, 255, 255, 0.7)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(x, y, st * 0.45, st * 0.12, 0, 0, VARV);
    ctx.stroke();
    ritaEmoji(p.bild, x, y - st * 0.25 + gung, st);
    ritaEmoji("🥶", x + st * 0.35, y - st * 0.75 + gung, st * 0.35);
    return;
  }
  if (p.vagn) {
    // Barnvagnen bredvid lattepappan
    const vx = x - st * 0.75;
    ctx.fillStyle = "#2f4f7a";
    rundRekt(ctx, vx - st * 0.3, y - st * 0.6, st * 0.6, st * 0.38, st * 0.12);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(vx - st * 0.12, y - st * 0.6, st * 0.2, Math.PI, 0);
    ctx.fill();
    ctx.fillStyle = "#222222";
    for (const i of [-1, 1]) {
      ctx.beginPath();
      ctx.arc(vx + i * st * 0.2, y - st * 0.12, st * 0.1, 0, VARV);
      ctx.fill();
    }
    ritaEmoji("😴", vx + st * 0.1, y - st * 0.62, st * 0.24);
  }
  // Klassen i reflexvästar går två och två bakom läraren
  if (p.klass) {
    for (let i = 0; i < p.klass; i++) {
      const kx = x + (i % 2 ? 0.35 : -0.35) * st;
      const ky = y - (0.7 + Math.floor(i / 2) * 0.6) * st; // Bakom läraren (längre upp på vägen)
      const hopp = p.glad > 0 ? Math.abs(Math.sin(tid * 10 + i)) * st * 0.2 : Math.abs(Math.sin(p.fas * 8 + i)) * st * 0.04;
      const ks = st * 0.62;
      skugga(kx, ky, ks * 0.25, ks * 0.07);
      ritaEmoji(i % 2 ? "🧍‍♂️" : "🧍‍♀️", kx, ky - ks * 0.48 - hopp, ks);
      ritaEmoji("🦺", kx, ky - ks * 0.52 - hopp, ks * 0.42);
    }
  }
  if (!sitter) skugga(x, y, st * 0.3, st * 0.09);
  ritaEmoji(p.bild, x, y - st * (sitter ? 0.6 : 0.48) - studs, st);
  if (p.vaska) {
    // Coco tittar upp ur handväskan
    ritaEmoji("🐩", x - st * 0.32, y - st * 0.62 - studs, st * 0.34);
    ritaEmoji("🎀", x - st * 0.22, y - st * 0.78 - studs, st * 0.16);
    ritaEmoji("👜", x - st * 0.32, y - st * 0.38 - studs, st * 0.42);
  }
  if (p.racket) ritaEmoji("🏓", x + st * 0.3, y - st * 0.55 - studs, st * 0.38);
  if (p.kaffe) ritaEmoji("☕", x + st * 0.3, y - st * 0.5, st * 0.3);
  if (p.gitarr) {
    ritaEmoji("🎸", x + st * 0.12, y - st * 0.4, st * 0.5);
    ritaEmoji("🎩", x + st * 0.65, y - st * 0.08, st * 0.32);
    for (let i = 0; i < 2; i++) {
      const f = (tid * 0.6 + i / 2) % 1;
      ctx.globalAlpha = Math.sin(f * Math.PI);
      ritaText(i ? "♫" : "♪", x - st * 0.4 + f * st * 0.2, y - st * (1 + f * 0.8), st * 0.3, "#ffffff");
      ctx.globalAlpha = 1;
    }
  }
  if (p.post) ritaEmoji("✉️", x + st * 0.28, y - st * 0.42 - studs, st * 0.28);
  if (p.paket) ritaEmoji("📦", x + st * 0.25, y - st * 0.55 - studs, st * 0.38);
  if (p.extra) {
    for (const [bild, dx, dy, storlek] of p.extra) ritaEmoji(bild, x + st * dx, y + st * dy - studs, st * storlek);
  }
  if (p.matlada) ritaEmoji("📦", x - st * 0.18, y - st * 0.8 - studs, st * 0.34);
  if (p.hink) ritaEmoji("🪣", x + st * 0.38, y - st * 0.12, st * 0.3);
  if (p.detektor) {
    // Metalldetektorn sveper fram och tillbaka
    const sv = Math.sin(tid * 2.5) * st * 0.2;
    ctx.strokeStyle = "#555555";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x + st * 0.2, y - st * 0.45 - studs);
    ctx.lineTo(x + st * 0.6 + sv, y - st * 0.03);
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(x + st * 0.6 + sv, y - st * 0.02, st * 0.14, st * 0.05, 0, 0, VARV);
    ctx.stroke();
  }
  if (p.stativ) {
    // Telefonstativet framför yogan
    ctx.strokeStyle = "#333333";
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (const i of [-1, 0, 1]) {
      ctx.moveTo(x + st * 0.28, y - st * 0.7);
      ctx.lineTo(x + st * (0.28 + i * 0.15), y);
    }
    ctx.stroke();
  }
  if (p.filmar) {
    // Telefonen uppe och en blinkande REC-lampa
    ritaEmoji("📱", x + st * 0.28, y - st * 0.8 - studs, st * 0.34);
    if (Math.sin(tid * 6) > -0.3) {
      const rx = x + st * 0.55;
      const ry = y - st * 1.05 - studs;
      ctx.fillStyle = "rgba(0, 0, 0, 0.55)";
      rundRekt(ctx, rx - st * 0.08, ry - st * 0.12, st * 0.62, st * 0.24, st * 0.12);
      ctx.fill();
      ctx.fillStyle = "#ff3b3b";
      ctx.beginPath();
      ctx.arc(rx + st * 0.05, ry, st * 0.06, 0, VARV);
      ctx.fill();
      ctx.fillStyle = "#ffffff";
      ctx.font = `bold ${Math.max(9, st * 0.16)}px ${TYPSNITT}`;
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillText("REC", rx + st * 0.15, ry + 1);
    }
  } else if (p.telefon) {
    ritaEmoji("📱", x + st * 0.22, y - st * (sitter ? 0.45 : 0.6) - studs, st * 0.3);
  }
  if (p.lurar) ritaEmoji("🎧", x, y - st * 0.92 - studs, st * 0.32);
  ctx.globalAlpha = 1;
}

function ritaBarnet() {
  const b = barn;
  const x = SX(b.x);
  const y = SY(b.v);
  const s = u;
  const slapas = b.slapas > 0;
  const studs = b.ror && !slapas ? Math.abs(Math.sin(b.gangFas)) * 0.06 : 0;
  const kant = "#4a2a14";
  const hud = "#f6cfa5";
  const lw = Math.max(1.5 / s, 0.035);

  // Åt vilket håll hunden är (för armen som håller kopplet)
  let mx = SX(hund.x) - x;
  let my = SY(hund.v) - s * 0.35 - (y - s * 0.56);
  const ml = Math.hypot(mx, my) || 1;
  mx /= ml;
  my /= ml;
  const r = slapas ? Math.sign(mx) || 1 : b.riktning;
  // Släpas barnet ligger det ner med huvudet mot hunden
  const vrid = slapas ? begr(Math.atan2(my, mx) + Math.PI / 2, -1.35, 1.35) : 0;

  skugga(x, y, s * 0.32, s * 0.1);
  ctx.save();
  ctx.translate(x, y - studs * s);
  ctx.rotate(vrid);
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

  // Ben (sprattlar när barnet släpas)
  for (const i of [-1, 1]) {
    let lyft = b.ror ? Math.max(0, Math.sin(b.gangFas + (i > 0 ? Math.PI : 0))) * 0.1 : 0;
    if (slapas) lyft = Math.max(0, Math.sin(tid * 25 + (i > 0 ? Math.PI : 0))) * 0.12;
    rundRekt(ctx, i * 0.1 - 0.06, -0.32 - lyft, 0.12, 0.3, 0.05);
    fylld("#3b5998");
    ctx.beginPath();
    ctx.ellipse(i * 0.1, -0.03 - lyft, 0.08, 0.05, 0, 0, Math.PI * 2);
    fylld(b.lerskor > 0 ? "#7a4a22" : "#333333");
  }

  // Armen som håller kopplet pekar mot hunden. Den andra armen svänger.
  const lx = mx * Math.cos(-vrid) - my * Math.sin(-vrid);
  const ly = mx * Math.sin(-vrid) + my * Math.cos(-vrid);
  const koppelSida = lx >= 0 ? 1 : -1;
  const axel = [koppelSida * 0.15, -0.56];
  const hl = hund.los ? [koppelSida * 0.3, -0.3] : [axel[0] + lx * 0.32, axel[1] + ly * 0.32];
  const andra = [-koppelSida * 0.27, -0.32 + (b.ror ? Math.sin(b.gangFas) * 0.06 : 0)];
  if (slapas) andra[1] = -0.75 + Math.sin(tid * 20) * 0.08; // Viftar
  if (b.korv > 0) andra[1] = -0.5;
  for (const [hx, hy, ax] of [[hl[0], hl[1], axel[0]], [andra[0], andra[1], -axel[0]]]) {
    ctx.beginPath();
    ctx.moveTo(ax, -0.56);
    ctx.lineTo(hx, hy);
    ctx.strokeStyle = kant;
    ctx.lineWidth = 0.11;
    ctx.stroke();
    ctx.strokeStyle = INSTALLNINGAR.barnFarg;
    ctx.lineWidth = 0.11 - lw * 2;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(hx, hy, 0.05, 0, Math.PI * 2);
    fylld(hud);
  }

  // Kropp
  rundRekt(ctx, -0.2, -0.64, 0.4, 0.38, 0.1);
  fylld(INSTALLNINGAR.barnFarg);

  // Huvud
  const hy = -0.86;
  ctx.beginPath();
  ctx.arc(0, hy, 0.24, 0, Math.PI * 2);
  fylld(hud);
  ctx.beginPath();
  ctx.arc(-r * 0.24, hy - 0.06, 0.08, 0, Math.PI * 2);
  fylld(INSTALLNINGAR.harFarg);
  ctx.beginPath();
  ctx.arc(0, hy, 0.25, Math.PI, 0);
  ctx.quadraticCurveTo(r * 0.05, hy - 0.08, -0.25, hy);
  ctx.closePath();
  fylld(INSTALLNINGAR.harFarg);
  ctx.fillStyle = "rgba(255, 120, 120, 0.35)";
  for (const i of [-1, 1]) {
    ctx.beginPath();
    ctx.arc(i * 0.14 + r * 0.03, hy + 0.08, 0.045, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = "#222222";
  for (const i of [-1, 1]) {
    ctx.beginPath();
    ctx.arc(i * 0.08 + r * 0.04, hy + 0.01, 0.03, 0, Math.PI * 2);
    ctx.fill();
  }
  // Munnen: ett stort O när man släpas, annars ett leende
  ctx.beginPath();
  if (slapas) {
    ctx.ellipse(r * 0.04, hy + 0.12, 0.045, 0.06, 0, 0, Math.PI * 2);
    ctx.fillStyle = "#6a1f1f";
    ctx.fill();
  } else {
    ctx.arc(r * 0.04, hy + 0.08, 0.07, 0.2 * Math.PI, 0.8 * Math.PI);
    ctx.strokeStyle = kant;
    ctx.lineWidth = lw;
    ctx.stroke();
  }
  ctx.restore();

  // Var handen med kopplet hamnade på skärmen
  const cs = Math.cos(vrid);
  const sn = Math.sin(vrid);
  hand.x = x + (cs * hl[0] - sn * hl[1]) * s;
  hand.y = y - studs * s + (sn * hl[0] + cs * hl[1]) * s;
  if (b.korv > 0) {
    ritaEmoji(b.mat || "🌭", x + (cs * andra[0] - sn * andra[1]) * s, y - studs * s + (sn * andra[0] + cs * andra[1]) * s - s * 0.1, s * 0.38);
  }
  if (b.lerskor > 0) {
    // Det luktar...
    ctx.strokeStyle = "rgba(120, 160, 60, 0.8)";
    ctx.lineWidth = 2;
    for (let i = 0; i < 2; i++) {
      const ox = x + (i ? 0.25 : -0.25) * s;
      const fas = tid * 3 + i;
      ctx.beginPath();
      for (let k = 0; k <= 8; k++) {
        const py = y - s * 0.1 - k * s * 0.05;
        const px = ox + Math.sin(fas + k * 0.8) * s * 0.05;
        if (k) ctx.lineTo(px, py);
        else ctx.moveTo(px, py);
      }
      ctx.stroke();
    }
  }
}

function ritaHund() {
  const h = hund;
  const x = SX(h.x);
  const y = SY(h.v);
  const st = u * 0.72 * (hundTyp.storlek || 1);
  const ror = h.lage === "jagar" || h.lage === "smiter" || h.lage === "fot" || h.lage === "tillGras";
  const studs = ror ? Math.abs(Math.sin(h.fas * 14)) * u * 0.07 : 0;
  const lang = hundTyp.bredd || 1;
  let sx = 1;
  let sy = 1;
  let dx = 0;
  let vrid = 0;
  if (h.lage === "vilar") {
    sy = 0.75;
  } else if (h.lage === "ylar") {
    sy = 0.88;
    vrid = h.riktning * 0.3; // Nosen upp mot himlen
  } else if (h.lage === "bajsar") {
    sx = 1.08;
    sy = 0.84;
    dx = (Math.random() - 0.5) * u * 0.05;
  } else if (h.lage === "tigger") {
    sy = 0.92;
  } else if (h.lage === "nosar") {
    vrid = -h.riktning * 0.18;
  }
  skugga(x, y, st * 0.42 * lang, st * 0.12);
  ctx.save();
  ctx.translate(x + dx, y - studs);
  ctx.rotate(vrid);
  ctx.scale(sx * lang, sy * (hundTyp.hojd || 1));
  ritaEmoji(hundTyp.bild, 0, -st * 0.45, st, "center", h.riktning > 0, hundTyp.farg);
  if (h.lerig > 0) {
    ctx.fillStyle = "rgba(110, 75, 40, 0.75)";
    for (const [ox, oy, r] of [[-0.2, -0.3, 0.07], [0.15, -0.25, 0.06], [0.02, -0.1, 0.08], [-0.3, -0.08, 0.05]]) {
      ctx.beginPath();
      ctx.arc(ox * st, oy * st, r * st, 0, VARV);
      ctx.fill();
    }
  }
  ctx.restore();
  halsband.x = x + h.riktning * st * 0.28 * lang;
  halsband.y = y - studs - st * 0.58 * (hundTyp.hojd || 1);
  if (h.boll) ritaEmoji("🎾", x + h.riktning * st * 0.42 * lang, y - studs - st * 0.45, u * 0.24);

  if (h.blot > 0) {
    ctx.fillStyle = "rgba(140, 200, 255, 0.85)";
    for (let i = 0; i < 4; i++) {
      const f = (tid * 1.5 + i / 4) % 1;
      ctx.beginPath();
      ctx.arc(x + (i - 1.5) * st * 0.25, y - st * 0.6 + f * st * 0.6, u * 0.04, 0, VARV);
      ctx.fill();
    }
  }
  const ovan = y - studs - st * 1.15;
  if (h.lage === "spand") {
    ritaEmoji("❗", x, ovan - Math.abs(Math.sin(tid * 10)) * u * 0.12, u * 0.45);
  } else if (h.lage === "trasslad") {
    ritaEmoji("❓", x, ovan + Math.sin(tid * 3) * u * 0.05, u * 0.4);
  } else if (h.lage === "tigger") {
    ritaEmoji("🥺", x, ovan, u * 0.35);
  } else if (h.lage === "bajsar") {
    ritaText("…", x, ovan, u * 0.4);
  } else if (h.lage === "vilar") {
    ritaEmoji("💤", x + st * 0.3, ovan + st * 0.3 - (tid % 1) * u * 0.2, u * 0.32);
  }
  // En ring som visar när man kan säga "Fot!" igen
  if (h.fotVila > 0 && !h.los && lage === "spelar") {
    ctx.strokeStyle = "rgba(255, 255, 255, 0.6)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(x, y - st * 0.4, st * 0.7, -Math.PI / 2, -Math.PI / 2 + VARV * (h.fotVila / INSTALLNINGAR.fotVila));
    ctx.stroke();
  }
}

function ritaBajs(b) {
  const x = SX(b.x);
  const y = SY(b.v);
  const st = u * 0.45 * (1 + b.pop * 0.6) * (b.stor ? 1.6 : 1);
  if (b.regnbage) {
    const farger = ["#ff5a5a", "#ffb84d", "#ffe14d", "#6dd04b", "#4aa3df", "#9b59b6"];
    ctx.lineWidth = u * 0.06;
    farger.forEach((f, i) => {
      ctx.strokeStyle = f;
      ctx.beginPath();
      ctx.arc(x, y, u * (0.55 - i * 0.06), Math.PI, 0);
      ctx.stroke();
    });
    ritaEmoji("✨", x + Math.cos(tid * 3) * u * 0.4, y - u * 0.3 + Math.sin(tid * 3) * u * 0.2, u * 0.25);
  } else if (lage === "spelar") {
    // En ring som blinkar, så att man ser att det ska plockas upp
    ctx.strokeStyle = `rgba(255, 233, 120, ${0.4 + Math.sin(tid * 6) * 0.3})`;
    ctx.lineWidth = 3;
    ctx.setLineDash([6, 5]);
    ctx.beginPath();
    ctx.ellipse(x, y - u * 0.05, u * 0.4, u * 0.2, 0, 0, VARV);
    ctx.stroke();
    ctx.setLineDash([]);
  }
  ctx.save();
  ctx.translate(x, y);
  if (b.trampad) ctx.scale(1.3, 0.55);
  ritaEmoji("💩", 0, -st * 0.35, st);
  ctx.restore();
  if (!b.regnbage) ritaEmoji("🪰", x + Math.cos(b.fas * 4) * u * 0.3, y - u * 0.5 + Math.sin(b.fas * 6) * u * 0.1, u * 0.2);
}

function ritaKoppel() {
  const bred = Math.max(2.5, u * 0.05);
  if (hund.los) {
    // Kopplet släpar efter hunden
    const ex = halsband.x - hund.riktning * u * 0.9;
    const ey = halsband.y + u * 0.55;
    ctx.strokeStyle = INSTALLNINGAR.koppelFarg;
    ctx.lineWidth = bred;
    ctx.beginPath();
    ctx.moveTo(halsband.x, halsband.y);
    ctx.quadraticCurveTo((halsband.x + ex) / 2, ey + Math.sin(tid * 15) * u * 0.1, ex, ey);
    ctx.stroke();
    return;
  }
  const streck = (rita) => {
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "rgba(60, 20, 20, 0.6)";
    ctx.lineWidth = bred + 2;
    rita();
    ctx.stroke();
    ctx.strokeStyle = INSTALLNINGAR.koppelFarg;
    ctx.lineWidth = bred;
    rita();
    ctx.stroke();
  };

  // Går kopplet runt ett träd?
  const runt = trasslad || trassel.find((t) => Math.abs(t.w) > Math.PI * 0.7 && avst(t.sak, barn) < KOPPEL + 0.8 && avst(t.sak, hund) < KOPPEL + 0.8);
  if (runt) {
    const s = runt.sak;
    const tx = SX(s.x);
    const ty = SY(s.v) - u * 0.3;
    const r = (s.stam + 0.06) * u;
    streck(() => {
      ctx.beginPath();
      ctx.moveTo(hand.x, hand.y);
      ctx.lineTo(tx, ty);
      ctx.lineTo(halsband.x, halsband.y);
    });
    if (trasslad) {
      for (let i = 0; i < 3; i++) {
        streck(() => {
          ctx.beginPath();
          ctx.ellipse(tx, ty - i * u * 0.09, r, r * 0.4, 0, 0, VARV);
        });
      }
      // En pil som visar åt vilket håll man ska gå runt trädet
      const bas = Math.atan2(barn.v - s.v, barn.x - s.x);
      const riktning = Math.sign(trasslad.w);
      const rr = KOPPEL * 0.55 + s.stam;
      ctx.strokeStyle = `rgba(255, 255, 255, ${0.5 + Math.sin(tid * 6) * 0.3})`;
      ctx.lineWidth = 4;
      ctx.beginPath();
      for (let k = 0; k <= 12; k++) {
        const a = bas + riktning * (0.25 + k * 0.08);
        const px = SX(s.x + Math.cos(a) * rr);
        const py = SY(s.v + Math.sin(a) * rr);
        if (k) ctx.lineTo(px, py);
        else ctx.moveTo(px, py);
      }
      ctx.stroke();
      const a = bas + riktning * 1.21;
      const spX = SX(s.x + Math.cos(a) * rr);
      const spY = SY(s.v + Math.sin(a) * rr);
      const fram = Math.atan2(SY(s.v + Math.sin(a + riktning * 0.1) * rr) - spY, SX(s.x + Math.cos(a + riktning * 0.1) * rr) - spX);
      ctx.fillStyle = ctx.strokeStyle;
      ctx.beginPath();
      ctx.moveTo(spX + Math.cos(fram) * 12, spY + Math.sin(fram) * 12);
      ctx.lineTo(spX + Math.cos(fram + 2.4) * 12, spY + Math.sin(fram + 2.4) * 12);
      ctx.lineTo(spX + Math.cos(fram - 2.4) * 12, spY + Math.sin(fram - 2.4) * 12);
      ctx.fill();
    }
    return;
  }

  // Slakt koppel hänger ner, sträckt koppel är rakt
  const d = avst(hund, barn);
  const slak = Math.max(0, 1 - d / KOPPEL);
  const mx = (hand.x + halsband.x) / 2;
  const my = (hand.y + halsband.y) / 2 + slak * u * 1.1;
  const darr = hundDrag() >= 0.7 && slak < 0.03 ? Math.sin(tid * 50) * 1.5 : 0;
  streck(() => {
    ctx.beginPath();
    ctx.moveTo(hand.x, hand.y);
    ctx.quadraticCurveTo(mx + darr, my + darr, halsband.x, halsband.y);
  });
}

function ritaPratbubbla(text, x, y) {
  const storlek = Math.max(14, u * 0.3);
  ctx.font = `bold ${storlek}px ${TYPSNITT}`;
  const rader = radbryt(text, Math.min(bredd * 0.6, storlek * 13));
  const w = Math.max(...rader.map((r) => ctx.measureText(r).width)) + storlek * 1.2;
  const h = rader.length * storlek * 1.25 + storlek * 0.6;
  const vanster = begr(x - w / 2, 8, bredd - w - 8);
  const topp = begr(y - h - storlek * 0.5, panelH + 4, hojd - h - 8);
  ctx.fillStyle = "#ffffff";
  ctx.strokeStyle = "#2b1d0e";
  ctx.lineWidth = 2.5;
  rundRekt(ctx, vanster, topp, w, h, storlek * 0.6);
  ctx.fill();
  ctx.stroke();
  if (y > topp + h) {
    const px = begr(x, vanster + storlek, vanster + w - storlek);
    ctx.beginPath();
    ctx.moveTo(px - storlek * 0.4, topp + h - 1.5);
    ctx.lineTo(px, topp + h + storlek * 0.5);
    ctx.lineTo(px + storlek * 0.4, topp + h - 1.5);
    ctx.fill();
    ctx.stroke();
  }
  ctx.fillStyle = "#2b1d0e";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  rader.forEach((r, i) => ctx.fillText(r, vanster + w / 2, topp + storlek * 0.3 + storlek * 1.25 * (i + 0.5)));
}

function ritaTexter() {
  for (const t of texter) {
    const storlek = u * (t.stor ? 0.4 : 0.28);
    ctx.font = `bold ${storlek}px ${TYPSNITT}`;
    const halv = ctx.measureText(t.text).width / 2 + 8;
    ctx.globalAlpha = begr(t.kvar * 1.5, 0, 1);
    ritaText(t.text, begr(SX(t.x), halv, bredd - halv), SY(t.v), storlek, t.farg || "#ffffff");
  }
  ctx.globalAlpha = 1;
}

function ritaPanel() {
  const band = ctx.createLinearGradient(0, 0, 0, panelH);
  band.addColorStop(0, "rgba(25, 45, 25, 0.7)");
  band.addColorStop(1, "rgba(25, 45, 25, 0.45)");
  ctx.fillStyle = band;
  ctx.fillRect(0, 0, bredd, panelH);

  const storlek = begr(u * 0.5, 20, 34);
  const rad1 = marginal.topp + 40; // I höjd med hus- och pausknappen
  const vanster = marginal.vanster + 150; // Till höger om knapparna
  const hoger = bredd - marginal.hoger - 16;

  ritaEmoji("⭐", vanster, rad1, storlek, "left");
  ritaText(String(poang), vanster + storlek * 1.3, rad1, storlek, "#ffffff", "left");
  const pasX = vanster + storlek * 1.6 + ctx.measureText(String(poang)).width;
  ritaEmoji("🛍️", pasX, rad1, storlek * 0.85, "left");
  ritaText("×" + pasar, pasX + storlek * 1.05, rad1, storlek * 0.8, pasar ? "#ffffff" : "#ff8a7a", "left");
  if (foljare > 0) {
    // Nya följare (om det får plats före hjärtana)
    const fx = pasX + storlek * 1.45 + ctx.measureText("×" + pasar).width;
    const text = formatera(foljare);
    ctx.font = `bold ${storlek * 0.7}px ${TYPSNITT}`;
    if (fx + storlek * 1.1 + ctx.measureText(text).width < hoger - INSTALLNINGAR.liv * storlek * 1.2) {
      ritaEmoji("📱", fx, rad1, storlek * 0.75, "left");
      ritaText(text, fx + storlek * 0.9, rad1, storlek * 0.7, "#ffc4f2", "left");
    }
  }
  for (let i = 0; i < INSTALLNINGAR.liv; i++) {
    ritaEmoji(i < livKvar ? "❤️" : "💔", hoger - i * storlek * 1.2, rad1, storlek * 0.85, "right");
  }

  // Hundmätaren: tråkigt till vänster, lagom i mitten, vild till höger
  const rad2 = marginal.topp + 86;
  const ikon = storlek * 0.9;
  const w = Math.min(bredd - marginal.vanster - marginal.hoger - 32 - ikon * 3.8, 520);
  const x0 = bredd / 2 - w / 2;
  const mh = Math.max(14, storlek * 0.5);
  const y0 = rad2 - mh / 2;
  ctx.save();
  rundRekt(ctx, x0, y0, w, mh, mh / 2);
  ctx.clip();
  ctx.fillStyle = "#8fa7c9";
  ctx.fillRect(x0, y0, w * 0.25, mh);
  ctx.fillStyle = "#5cc46a";
  ctx.fillRect(x0 + w * 0.25, y0, w * 0.5, mh);
  ctx.fillStyle = "#ff6b5a";
  ctx.fillRect(x0 + w * 0.75, y0, w * 0.25, mh);
  // Pilar som visar åt vilket håll mätaren går
  const spets = x0 + (w * humor) / 100;
  if (lage === "spelar" && !hund.los && Math.abs(humorTrend) > 1) {
    const upp = humorTrend > 0;
    ctx.lineWidth = Math.max(2, mh * 0.16);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    for (let i = 0; i < 3; i++) {
      const fas = (tid * 1.6 + i / 3) % 1;
      const langdP = mh * 2.4;
      const px = upp ? spets - ikon * 0.5 - langdP + fas * langdP : spets + ikon * 0.5 + langdP - fas * langdP;
      const v = mh * 0.28 * (upp ? 1 : -1);
      ctx.strokeStyle = `rgba(255, 255, 255, ${Math.sin(fas * Math.PI) * 0.95})`;
      ctx.beginPath();
      ctx.moveTo(px - v, y0 + mh * 0.22);
      ctx.lineTo(px, rad2);
      ctx.lineTo(px - v, y0 + mh * 0.78);
      ctx.stroke();
    }
  }
  ctx.restore();
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 2.5;
  rundRekt(ctx, x0, y0, w, mh, mh / 2);
  ctx.stroke();
  ritaEmoji("🥱", x0 - ikon * 1.0, rad2, ikon);
  ritaEmoji("🤪", x0 + w + ikon * 0.85, rad2, ikon);
  const fara = humor < 20 || humor > 80;
  const puls = fara && lage === "spelar" ? 1 + Math.abs(Math.sin(tid * 8)) * 0.2 : 1;
  ctx.save();
  ctx.translate(begr(spets, x0 + ikon * 0.45, x0 + w - ikon * 0.45), rad2);
  ctx.scale(puls, puls);
  ritaEmoji(hund.los ? "💨" : hundTyp.ansikte || "🐶", 0, 0, ikon * 1.1);
  ctx.restore();

  // Hur långt det är kvar (längs högerkanten)
  const px = bredd - marginal.hoger - 16;
  const py0 = panelH + 34;
  const py1 = hojd - marginal.botten - 24;
  if (py1 - py0 > 80) {
    ctx.strokeStyle = "rgba(255, 255, 255, 0.45)";
    ctx.lineWidth = 4;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(px, py0);
    ctx.lineTo(px, py1);
    ctx.stroke();
    const nasta = INSTALLNINGAR.banor[banNr + 1];
    ritaEmoji(nasta ? nasta.ikon : "🏠", px, py0 - 14, 22);
    ritaEmoji("🐾", px, py1 - (py1 - py0) * begr(barn.v / langd, 0, 1), 18);
  }

  // Tips under mätaren
  let ty = rad2 + mh / 2 + 6;
  if (tipsTid > 0 && lage === "spelar") {
    const ts = Math.max(14, storlek * 0.55);
    ctx.font = `bold ${ts}px ${TYPSNITT}`;
    const tw = Math.min(ctx.measureText(tips).width + ts * 1.4, bredd - 16);
    ty = Math.max(panelH + ts * 0.9, ty + ts * 1.1);
    ctx.globalAlpha = Math.min(1, tipsTid * 2);
    ctx.fillStyle = "rgba(25, 40, 20, 0.8)";
    rundRekt(ctx, bredd / 2 - tw / 2, ty - ts * 0.85, tw, ts * 1.7, ts * 0.85);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(tips, bredd / 2, ty, tw - ts);
    ctx.globalAlpha = 1;
    ty += ts * 1.2;
  }
  if (lapp) ritaLapp(ty + 12);
  if (toaster.length) ritaToast(toaster[0]);
}

// En lapp från en lyktstolpe, som man läser
function ritaLapp(topp) {
  const storlek = begr(u * 0.32, 15, 24);
  ctx.font = `${storlek}px ${HANDSTIL}`;
  const maxB = Math.min(bredd - 60, storlek * 18);
  const rader = radbryt(lapp.text, maxB);
  const w = Math.max(...rader.map((r) => ctx.measureText(r).width)) + storlek * 2;
  const h = rader.length * storlek * 1.35 + storlek * 1.4;
  ctx.save();
  ctx.globalAlpha = Math.min(1, lapp.kvar * 2);
  ctx.translate(bredd / 2, topp + h / 2);
  ctx.rotate(lapp.vinkel);
  ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
  ctx.fillRect(-w / 2 + 4, -h / 2 + 5, w, h);
  ctx.fillStyle = "#fffdf2";
  ctx.fillRect(-w / 2, -h / 2, w, h);
  ctx.fillStyle = "rgba(200, 220, 255, 0.6)"; // Tejp
  ctx.fillRect(-storlek * 1.5, -h / 2 - storlek * 0.35, storlek * 3, storlek * 0.7);
  ctx.fillStyle = "#26304a";
  ctx.font = `${storlek}px ${HANDSTIL}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  rader.forEach((r, i) => ctx.fillText(r, 0, -h / 2 + storlek * 0.7 + storlek * 1.35 * (i + 0.5)));
  ctx.restore();
}

// En utmärkelse längst ner på skärmen
function ritaToast(t) {
  const storlek = begr(u * 0.32, 15, 24);
  ctx.font = `bold ${storlek}px ${TYPSNITT}`;
  const w = Math.min(bredd - 24, Math.max(ctx.measureText("🏆 " + t.namn).width, ctx.measureText(t.text).width * 0.8) + storlek * 2.5);
  const h = storlek * 3.2;
  const framme = Math.min(1, (4.5 - t.kvar) * 4, t.kvar * 3);
  const y = hojd - marginal.botten - 16 - h * framme;
  ctx.globalAlpha = begr(framme, 0, 1);
  ctx.fillStyle = "rgba(40, 30, 10, 0.88)";
  rundRekt(ctx, bredd / 2 - w / 2, y, w, h, storlek * 0.8);
  ctx.fill();
  ctx.strokeStyle = "#ffd27a";
  ctx.lineWidth = 2.5;
  ctx.stroke();
  ctx.fillStyle = "#ffd27a";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("🏆 " + t.namn, bredd / 2, y + h * 0.33, w - storlek);
  ctx.fillStyle = "#ffffff";
  ctx.font = `${storlek * 0.8}px ${TYPSNITT}`;
  ctx.fillText(t.text, bredd / 2, y + h * 0.68, w - storlek);
  ctx.globalAlpha = 1;
}

// En rad med kort, ett för varje hund. Svarar med var nästa rad ska börja.
function ritaHundkort(topp, maxHojd) {
  const hundar = INSTALLNINGAR.hundar;
  const mellan = 10;
  let kw = Math.min(140, (bredd - 32 - mellan * (hundar.length - 1)) / hundar.length);
  let kh = kw * 1.25;
  if (kh > maxHojd) {
    kh = maxHojd;
    kw = kh / 1.25;
  }
  const x0 = bredd / 2 - (hundar.length * kw + (hundar.length - 1) * mellan) / 2;
  hundar.forEach((h, i) => {
    const x = x0 + i * (kw + mellan);
    const vald = i === valdHund;
    const last = arLast(h);
    const studs = vald ? Math.abs(Math.sin(tid * 4)) * kh * 0.04 : 0;
    ctx.fillStyle = vald ? "#ffd95e" : "rgba(255, 255, 255, 0.16)";
    rundRekt(ctx, x, topp, kw, kh, kw * 0.16);
    ctx.fill();
    if (vald) {
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 3;
      ctx.stroke();
    }
    ctx.globalAlpha = last ? 0.3 : 1;
    ctx.save();
    ctx.translate(x + kw / 2, topp + kh * 0.42 - studs);
    ctx.scale(h.bredd || 1, h.hojd || 1);
    ritaEmoji(h.bild, 0, 0, kw * 0.5 * Math.min(1.15, h.storlek || 1), "center", false, h.farg);
    ctx.restore();
    ctx.globalAlpha = 1;
    if (last) ritaEmoji("🔒", x + kw / 2, topp + kh * 0.42, kw * 0.32);
    ctx.font = `bold ${Math.max(10, kw * 0.14)}px ${TYPSNITT}`;
    ctx.fillStyle = vald ? "#2b1d0e" : "#ffffff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(h.namn, x + kw / 2, topp + kh * 0.84, kw - 8);
    startKnappar.push({ x, y: topp, w: kw, h: kh, i });
  });
  return topp + kh + Math.min(bredd, hojd) / 14 * 0.6;
}

function ritaSkarmar() {
  startKnappar = [];
  if (lage === "spelar" || lage === "paus") return;
  const ts = Math.min(bredd, hojd) / 14; // Textstorlek
  const mitt = bredd / 2;

  ctx.fillStyle = "rgba(20, 35, 20, 0.6)";
  ctx.fillRect(0, 0, bredd, hojd);
  // Första raden hamnar under hus-knappen (som slutar 68 px ner), även på en låg skärm
  let y = marginal.topp + Math.max(ts * 1.6, hojd * 0.1, 68 + ts * 0.9);
  const rad = (text, storlek, farg) => {
    // Bryter långa texter på flera rader och krymper ord som inte får plats
    ctx.font = `bold ${storlek}px ${TYPSNITT}`;
    for (const r of radbryt(text, bredd - 40)) {
      const ryms = (bredd - 32) / ctx.measureText(r).width;
      ritaText(r, mitt, y, ryms < 1 ? storlek * ryms : storlek, farg);
      y += storlek * 1.35;
    }
    y += storlek * 0.1;
  };
  const stjarnor = (st) => "⭐".repeat(st) + "☆".repeat(3 - st);

  if (lage === "start") {
    const lag = hojd < 520; // Telefon på bredden: mindre plats
    rad(t("Hundpromenaden", "Dog Walk"), ts * (lag ? 1.1 : 1.4), "#ffd27a");
    if (!lag) rad(t("Välj hund", "Choose your dog"), ts * 0.65, "#ffffff");
    y = ritaHundkort(y - ts * 0.2, lag ? hojd * 0.3 : hojd * 0.24);
    const vald = INSTALLNINGAR.hundar[valdHund];
    const last = arLast(vald);
    rad(last ? "🔒 " + lasText(vald) : vald.text, ts * 0.55, last ? "#ffb3b3" : "#ffffff");
    if (!lag) {
      rad(t("Dra med fingret för att gå · Tryck på hunden: Fot! · Gå över 💩", "Drag to walk · Tap the dog: Heel! · Walk over 💩"), ts * 0.45, "#d5def0");
    }
    // Knappen
    const kh = ts * 1.3;
    const kt = (last ? "🔒 " : "▶ ") + t("Gå ut med ", "Walk ") + (vald.med || vald.namn);
    ctx.font = `bold ${ts * 0.7}px ${TYPSNITT}`;
    const kw = Math.min(bredd - 32, ctx.measureText(kt).width + ts * 1.6);
    const ky = y + ts * 0.1;
    ctx.fillStyle = last ? "rgba(255, 255, 255, 0.25)" : "#ffd95e";
    rundRekt(ctx, mitt - kw / 2, ky, kw, kh, kh / 2);
    ctx.fill();
    ctx.fillStyle = last ? "#ffffff" : "#2b1d0e";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(kt, mitt, ky + kh / 2, kw - ts * 0.6);
    startKnappar.push({ x: mitt - kw / 2, y: ky, w: kw, h: kh, start: true });
    y = ky + kh + ts * 0.6;
    if (rekord > 0) rad(t("Rekord: ", "High score: ") + rekord, ts * 0.55, "#d5def0");
  }

  if (lage === "mellan") {
    const st = betygLista[betygLista.length - 1];
    rad(t(INSTALLNINGAR.banor[banNr].namn + " klart!", INSTALLNINGAR.banor[banNr].namn + " done!"), ts * 1.2, "#ffd27a");
    rad(stjarnor(st), ts * 1.1);
    rad(INSTALLNINGAR.betyg[st], ts * 0.7);
    const gladProcent = Math.round((100 * stat.gladTid) / Math.max(1, stat.banTid));
    rad(t(`💩 ${stat.plockade} av ${stat.bajsat} upplockade · 🐶 glad ${gladProcent} % av tiden`, `💩 ${stat.plockade} of ${stat.bajsat} picked up · 🐶 happy ${gladProcent}% of the time`), ts * 0.55, "#d5def0");
    rad(t(poang + " poäng", poang === 1 ? "1 point" : poang + " points"), ts * 0.85);
    y += ts * 0.3;
    if (tidSedanSlut > 1) rad(t("Tryck för att gå till ", "Tap to go to ") + INSTALLNINGAR.banor[banNr + 1].namn.toLowerCase(), ts * 0.75);
  }

  if (lage === "hemma") {
    const st = betygLista[betygLista.length - 1];
    rad(t("Hemma! 🏠", "Home! 🏠"), ts * 1.3, "#ffd27a");
    rad(stjarnor(st), ts * 1.1);
    rad(INSTALLNINGAR.betyg[st], ts * 0.7);
    rad(t(poang + " poäng", poang === 1 ? "1 point" : poang + " points"), ts * 1);
    rad(poang > 0 && poang === rekord ? t("🏆 Nytt rekord! 🏆", "🏆 New high score! 🏆") : t("Rekord: ", "High score: ") + rekord, ts * 0.65);
    if (foljare > 0) rad(t(`📱 ${formatera(foljare)} nya följare`, `📱 ${formatera(foljare)} new followers`), ts * 0.55, "#ffc4f2");
    if (fatt.size) rad("🏆 " + [...fatt].map((k) => INSTALLNINGAR.utmarkelser[k].namn).join(" · "), ts * 0.5, "#d5def0");
    y += ts * 0.3;
    if (tidSedanSlut > 1) rad(t("Tryck för att gå en ny promenad", "Tap to go for a new walk"), ts * 0.75);
  }

  if (lage === "slut") {
    rad(INSTALLNINGAR.slut, ts * 0.95, "#ffd27a");
    y += ts * 0.2;
    rad(t(poang + " poäng", poang === 1 ? "1 point" : poang + " points"), ts * 1);
    if (foljare > 0) rad(t(`📱 ${formatera(foljare)} nya följare`, `📱 ${formatera(foljare)} new followers`), ts * 0.55, "#ffc4f2");
    rad(poang > 0 && poang === rekord ? t("🏆 Nytt rekord! 🏆", "🏆 New high score! 🏆") : t("Rekord: ", "High score: ") + rekord, ts * 0.65);
    y += ts * 0.3;
    if (tidSedanSlut > 1) {
      if (banNr > 0) rad(t("Tryck för att försöka igen från ", "Tap to try again from ") + INSTALLNINGAR.banor[banNr].namn.toLowerCase(), ts * 0.75);
      else rad(t("Tryck för att försöka igen", "Tap to try again"), ts * 0.75);
    }
  }
}

function rita() {
  // Pausknappen syns bara när man spelar. Under pausen finns allt i pausmenyn.
  const visaPaus = lage === "spelar";
  if (pausKnapp.hidden === visaPaus) pausKnapp.hidden = !visaPaus;
  const visaHem = lage !== "paus";
  if (hemKnapp.hidden === visaHem) hemKnapp.hidden = !visaHem;

  ctx.save();
  if (skakning > 0) ctx.translate((Math.random() - 0.5) * u * 0.2, (Math.random() - 0.5) * u * 0.2);
  ritaMarken();

  const syn = synligt();
  const iBild = (v) => v > syn.botten - 2 && v < syn.topp + 2;
  for (const s of saker) {
    if (s.typ === "godsak" && iBild(s.v)) ritaGodsak(s);
  }
  for (const b of bajsen) {
    if (iBild(b.v)) ritaBajs(b);
  }

  // Det som står längre bort ritas först, så att det närmare hamnar framför
  const lista = [];
  for (const s of saker) {
    if (s.x === undefined || !iBild(s.v)) continue;
    let r = null;
    if (s.typ === "trad") r = ritaTrad;
    else if (s.typ === "lykta") r = ritaLykta;
    else if (s.typ === "automat") r = ritaAutomat;
    else if (s.typ === "katt") r = ritaKatt;
    else if (s.typ === "ekorre") r = ritaEkorre;
    else if (s.typ === "anka") r = ritaAnka;
    else if (s.typ === "person") r = ritaPerson;
    else if (s.typ === "kiosk") r = ritaKiosk;
    else if (s.typ === "bank") r = ritaBank;
    else if (s.typ === "skylt") r = ritaSkylt;
    else if (s.typ === "boll") r = ritaBoll;
    else if (s.typ === "pratare") r = ritaPratare;
    else if (s.typ === "cafe") r = ritaCafe;
    else if (s.typ === "badhytt") r = ritaBadhytt;
    else if (s.typ === "parasoll") r = ritaParasoll;
    else if (s.typ === "fagel") r = ritaFagel;
    else if (s.typ === "tang") r = ritaTang;
    else if (s.typ === "krabba") r = ritaKrabba;
    else if (s.typ === "sandslott") r = ritaSandslott;
    else if (s.typ === "glassbil") r = ritaGlassbil;
    else if (s.typ === "sparkcykel") r = ritaSparkcykel;
    if (r) lista.push([s.v, () => r(s)]);
  }
  lista.push([hund.v, ritaHund]);
  lista.push([barn.v - 0.01, ritaBarnet]);
  lista.sort((a, b) => b[0] - a[0]);
  for (const [, ritaDen] of lista) ritaDen();

  for (const s of saker) {
    if (s.typ === "masattack") ritaMasattack(s); // Måsen flyger över allt
  }
  ritaKoppel();
  ritaRegn();
  ritaBrandbil();
  ritaTexter();
  for (const b of bubblor) {
    const a = b.agare;
    const hojdUpp = a === barn ? 1.25 : a.typ === "glassbil" ? 2.3 : a.sort === "pappa" ? 1.3 : 1.45;
    ctx.globalAlpha = Math.min(1, b.kvar * 3);
    ritaPratbubbla(b.text, SX(a.x), SY(a.v) - u * hojdUpp);
    ctx.globalAlpha = 1;
  }
  ctx.restore();

  // Poäng och hjärtan syns bara under spelet. Skärmarna mellan banorna visar poängen själva.
  if (lage === "spelar" || lage === "paus") ritaPanel();
  ritaSkarmar();
}

// ---------- Spel-loopen: körs ungefär 60 gånger per sekund ----------

anpassaStorlek();
byggBana();

let forraTiden = performance.now();
function loop(nu) {
  const dt = Math.min(0.05, (nu - forraTiden) / 1000);
  forraTiden = nu;
  kollaFart(dt);
  uppdatera(dt);
  rita();
  schemalaggMusik();
  uppdateraRegnljud();
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

// En ton som glider från en frekvens till en annan. "sen" är hur många
// sekunder det dröjer innan den spelas.
function spelaTon(fran, till, langd, typ, volym, sen = 0) {
  if (!ljudmotor) return;
  try {
    const t = ljudmotor.currentTime + sen;
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

// Regnet låter som ett mjukt brus
let regnLjud = null;
function uppdateraRegnljud() {
  if (!ljudmotor) return;
  const mal = lage === "spelar" ? regnStyrka * 0.05 : 0;
  try {
    if (!regnLjud && mal > 0.002) {
      const buffert = ljudmotor.createBuffer(1, ljudmotor.sampleRate, ljudmotor.sampleRate);
      const data = buffert.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
      const kalla = ljudmotor.createBufferSource();
      kalla.buffer = buffert;
      kalla.loop = true;
      const filter = ljudmotor.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 1400;
      const styrka = ljudmotor.createGain();
      styrka.gain.value = 0;
      kalla.connect(filter);
      filter.connect(styrka);
      styrka.connect(ljudmotor.destination);
      kalla.start();
      regnLjud = { kalla, styrka };
    }
    if (regnLjud) {
      regnLjud.styrka.gain.value = mal;
      if (regnStyrka < 0.01 && regn <= 0) {
        regnLjud.kalla.stop();
        regnLjud = null;
      }
    }
  } catch (e) {
    regnLjud = null; // Inget regnljud – spelet fungerar ändå
  }
}

// Glassbilens melodi
function spelaGlassmelodi() {
  const toner = [784, 659, 784, 880, 784, 659, 523, 587, 659];
  toner.forEach((f, i) => spelaTon(f, f, 0.22, "square", 0.035, i * 0.2));
}

function spelaArpeggio(toner) {
  toner.forEach((f, i) => spelaTon(f, f, 0.18, "triangle", 0.09, i * 0.09));
}

// ---------- Promenadvisslan (bakgrundsmusik) ----------
//
//  Varje siffra är en ton (60 = mellersta C, 62 = D, 64 = E ...).
//  null betyder paus. Ändra siffrorna för att göra en egen melodi!

const MUSIK = {
  promenad: {
    steg: 0.22, // Sekunder per ton – lägre = snabbare
    melodi: [72, null, 76, 79, 81, null, 79, null, 76, null, 72, 74, 76, null, null, null,
             74, null, 77, 81, 79, null, 77, null, 76, null, 74, 72, 74, null, null, null],
    bas: [48, 55, 52, 55, 50, 57, 53, 57, 50, 57, 53, 57, 48, 55, 43, 55],
  },
  jakt: {
    steg: 0.14,
    melodi: [76, 76, 79, 76, 81, 79, 76, 74, 72, 74, 76, 79, 76, 74, 72, null],
    bas: [45, 52, 45, 52, 43, 50, 43, 50],
  },
};

let musikPa = INSTALLNINGAR.musik && lasInstallning("musik-hund") !== "av";
let musikSteg = 0;
let musikNastaTid = 0;
visaMusikKnapp();

function spelaNot(not, start, langd, typ, volym) {
  const ton = ljudmotor.createOscillator();
  const styrka = ljudmotor.createGain();
  ton.type = typ;
  ton.frequency.value = 440 * Math.pow(2, (not - 69) / 12);
  styrka.gain.setValueAtTime(0, start);
  styrka.gain.linearRampToValueAtTime(volym, start + 0.02);
  styrka.gain.exponentialRampToValueAtTime(0.001, start + langd);
  ton.connect(styrka);
  styrka.connect(ljudmotor.destination);
  ton.start(start);
  ton.stop(start + langd + 0.02);
}

// Lägger ut tonerna en liten bit i förväg så att musiken inte hackar
function schemalaggMusik() {
  if (!ljudmotor || !musikPa || lage !== "spelar") return;
  const latt = hund.los ? MUSIK.jakt : MUSIK.promenad;
  const nu = ljudmotor.currentTime;
  if (musikNastaTid < nu) musikNastaTid = nu + 0.05;
  try {
    while (musikNastaTid < nu + 0.25) {
      const i = musikSteg % latt.melodi.length;
      const not = latt.melodi[i];
      if (not) spelaNot(not, musikNastaTid, latt.steg * 1.4, "sine", 0.045);
      if (i % 2 === 0) {
        const bas = latt.bas[(i / 2) % latt.bas.length];
        if (bas) spelaNot(bas, musikNastaTid, latt.steg * 2.2, "triangle", 0.05);
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
    return Number(localStorage.getItem("rekord-hund")) || 0;
  } catch (e) {
    return 0;
  }
}

function sparaRekord(varde) {
  try {
    localStorage.setItem("rekord-hund", String(varde));
  } catch (e) {
    // Privat läge e.d. – rekordet sparas bara tills sidan laddas om
  }
}
