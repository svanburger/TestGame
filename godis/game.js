// =====================================================================
//  BUS ELLER GODIS
//
//  Det är Halloween! Klä ut dig och ring på hos grannarna i kvarteret.
//  Du får samla godis mellan klockan 18 och 20 (det är 5 minuter på
//  riktigt). Klockan syns uppe till höger och godishinken i mitten.
//
//  Dra med fingret (eller tryck) för att gå. Gå fram till en dörr med en
//  lysande pumpa 🎃 så ringer du på. Man får gå till vilket hus man vill.
//  Akta bananskalen och hundarna! Tappar du godis kan du plocka upp det
//  igen, om du är snabb.
//
//  Klockan 20 går man hem. Där tar pappa föräldraskatt...
//
//  Spelet har två lager:
//  - Barnen samlar godis och tittar på klockan och hinken.
//  - De vuxna får lite extra i det grannarna säger.
//  Skämten för vuxna handlar om vuxnas fåniga vanor (stadgar, startups,
//  föräldrachatten), aldrig om vuxna saker. Allt som står ska gå att läsa
//  högt för en sjuåring.
//
//  Börja med att ändra i INSTALLNINGAR här nedanför.
//
//  All text finns på svenska och engelska. Den skrivs så här:
//    t("svenska", "English")
//  (Döp därför aldrig en egen variabel till bara t.)
// =====================================================================

const INSTALLNINGAR = {
  ljud: true,
  musik: true,          // Läskig (men snäll) musik. Melodierna finns längst ner i game.js (MUSIK).
  speltid: 300,         // Sekunder från klockan 18 till 20. 300 = 5 minuter.
  fart: 2.9,            // Hur fort barnet går
  skatt: 0.3,           // Föräldraskatten: hur mycket pappa tar (0.3 = 30 %)
  stjarnor: [12, 25, 38], // Godis man måste ha kvar EFTER skatten för 1, 2 och 3 stjärnor
  bananskal: 9,         // Hur många bananskal som ligger på gatorna från början
  tappatKvar: 7,        // Sekunder som tappat godis ligger kvar på marken innan det är borta
  visaGodis: 1.2,       // Sekunder som det man får syns vid dörren innan det flyger iväg
  flygTid: 0.8,         // Sekunder som det tar för godiset att flyga in i hinken
  hundKoppel: 4,        // Hur långt hundarnas flexikoppel räcker
  hundSer: 2.6,         // Hur nära man kan gå innan hunden springer fram
  hundJagar: 2,         // Sekunder som hunden springer efter en innan den ger upp
  hundVila: 10,         // Sekunder innan hunden vill ha mer godis
  vindpustar: 2,        // Hur många vindpustar det blir på en kväll

  // ---------------------------------------------------------------
  //  DRÄKTERNA man kan välja på startskärmen
  //  ata = vad tant Majken säger
  // ---------------------------------------------------------------
  drakter: [
    { typ: "spoke", namn: t("Spöket", "The Ghost"), text: t("Ett lakan med två hål. Mamma vet inte än.", "A sheet with two holes. Mum doesn't know yet."),
      ata: t("Spöken måste också äta.", "Ghosts need to eat too.") },
    { typ: "haxa", namn: t("Häxan", "The Witch"), text: t("Har en kvast. Den flyger inte. Än.", "Has a broom. It doesn't fly. Yet."),
      ata: t("Häxor måste också äta.", "Witches need to eat too.") },
    { typ: "pumpa", namn: t("Pumpan", "The Pumpkin"), text: t("Rund och glad. Svår att sitta ner i.", "Round and happy. Hard to sit down in."),
      ata: t("Pumpor måste också äta.", "Pumpkins need to eat too.") },
    { typ: "skelett", namn: t("Skelettet", "The Skeleton"), text: t("Lyser i mörkret. Nästan.", "Glows in the dark. Almost."),
      ata: t("Och skelett måste äta MEST!", "And skeletons need to eat the MOST!") },
  ],

  // ---------------------------------------------------------------
  //  HUSEN – i ordning från vänster till höger, rad för rad uppifrån.
  //  Det blir 4 rader med 6 hus i varje.
  //
  //  bild    = den som öppnar dörren
  //  rep     = vad de säger. B("...") är det barnet säger.
  //  godis   = hur mycket godis man får
  //  sak     = konstiga saker man får (de räknas inte som godis)
  //  ger     = vid vilken replik man får godiset (0 = första)
  //  oppnar, stanger = när huset öppnar och stänger ("19:30")
  //  lapp    = lappen på dörren när huset är stängt
  //  special = huset gör något eget (se ringPa i koden)
  // ---------------------------------------------------------------
  hus: [
    // Rad 1 (längst upp)
    { namn: t("Tandläkaren", "The dentist"), bild: "🧑‍⚕️", godis: 1, sak: ["🪥"], ger: 1, stanger: "19:00",
      rep: [t("Bus eller godis? Ta två!", "Trick or treat? Take two!"), t("...Tandborstar alltså. Och EN godis.", "...Toothbrushes, that is. And ONE candy."), t("Vi ses om ett halvår!", "See you in six months!")],
      lapp: t("Stängt. Akuta tandbesvär: borsta.", "Closed. Dental emergencies: brush.") },
    { namn: t("Spökhuset", "The haunted house"), bild: "🧔", godis: 5, special: "spok",
      rep: [t("Förlåt! Det här är årets höjdpunkt för mig.", "Sorry! This is the highlight of my year."), t("Ta fem. Jag har övat sedan augusti.", "Take five. I've been practising since August.")], ger: 1 },
    { namn: t("Tech-investeraren", "The tech investor"), bild: "🧑‍💻", godis: 0, sak: ["📜"], ger: 1,
      rep: [t("Godis? Jag investerar hellre i dig.", "Candy? I'd rather invest in you."), t("Här: 0,01 % av min godis-startup. Den är värd 40 miljoner.", "Here: 0.01% of my candy startup. It's worth 40 million."), B(t("Hur mycket godis har den?", "How much candy does it have?")), t("Inget än. Men tänk potentialen!", "None yet. But think of the potential!")] },
    { namn: t("Homeopaten", "The homeopath"), bild: "🧘", godis: 1, sak: ["💧"],
      rep: [t("Jag har homeopatiskt godis!", "I have homeopathic candy!"), t("En kola utspädd i tusen liter vatten. Ju mindre godis, desto starkare.", "One toffee diluted in a thousand litres of water. The less candy, the stronger it is."), t("Och en vanlig kola. Mot biverkningarna.", "And a normal toffee. For the side effects.")] },
    { namn: t("Huset med tv:n", "The house with the TV"), special: "tv", godis: 0,
      rep: [t("Vi är inte hemma!", "We're not home!"), B(t("Men ni pratar ju?", "But you're talking?")), t("Det är tv:n!", "That's the TV!")] },
    { namn: t("Chokladkakehuset", "The chocolate bar house"), bild: "🧓", godis: 10, special: "choklad", ger: 1,
      rep: [t("Oj, ett barn! Ingen brukar hitta hit.", "Oh, a child! Nobody ever finds us up here."), t("Vi köpte fel och har bara hela chokladkakor. Ta massor!", "We bought the wrong thing and only have full-size chocolate bars. Take loads!")] },

    // Rad 2
    { namn: t("Matskribenten", "The food critic"), bild: "🧑‍🍳", godis: 3, ger: 2,
      rep: [t("Välkommen. I kväll serverar vi en kola.", "Welcome. Tonight we are serving a toffee."), t("Toner av karamell, rök och en gnutta besvikelse.", "Notes of caramel, smoke and a hint of disappointment."), t("Fyra gafflar av fem. Ta tre.", "Four forks out of five. Take three.")] },
    { namn: t("Skålen", "The bowl"), special: "skal", godis: 1 },
    { namn: t("Influencern", "The influencer"), bild: "💁‍♀️", godis: 5, ger: 3,
      rep: [t("Vänta! Jag ska bara filma.", "Wait! I just need to film this."), t("Säg 'spöke' till följarna!", "Say 'spooky' to my followers!"), B(t("...Spöke?", "...Spooky?")), t("Perfekt! #halloween #äkta #inteallsregisserat", "Perfect! #halloween #authentic #notstagedatall")] },
    { namn: t("Ordföranden i föreningen", "The housing board chairman"), bild: "👨‍💼", godis: 1, sak: ["📋"], ger: 2,
      rep: [t("Enligt föreningens stadgar, paragraf 14...", "According to the association's bylaws, section 14..."), t("...får godis bara delas ut till boende.", "...candy may only be given to residents."), t("Nåja. EN. Men det protokollförs.", "Oh well. ONE. But it goes in the minutes.")] },
    { namn: t("Alfahannen", "The alpha male"), bild: "🏋️‍♂️", godis: 2, sak: ["🧱"], ger: 1,
      rep: [t("Godis? Jag kör bara protein.", "Candy? I only do protein."), t("Här. En proteinbar. Den smakar kartong. Och disciplin.", "Here. A protein bar. It tastes like cardboard. And discipline."), t("Okej, och två godis. Det är fuskdag.", "Fine, and two candies. It's cheat day.")] },
    { namn: t("Pumpafamiljen", "The pumpkin family"), bild: "👨‍👩‍👧", godis: 6, special: "pumpa", oppnar: "19:00", ger: 2,
      rep: [t("Välkommen! Vi har skurit fjorton pumpor.", "Welcome! We've carved fourteen pumpkins."), t("Vi har inte sovit sedan i tisdags.", "We haven't slept since Tuesday."), t("Ta sex!", "Take six!")],
      lapp: t("Kom tillbaka klockan 19! Vi skär pumpor. (Pumpa nr 14)", "Come back at 7! We're carving pumpkins. (Pumpkin no. 14)") },

    // Rad 3
    { namn: t("Psykologen", "The psychologist"), bild: "🧑‍🦳", godis: 2, stanger: "19:30", ger: 1,
      rep: [t("Bus eller godis... Hur känns det att få välja?", "Trick or treat... How does it feel to get to choose?"), t("Och hur känns det att få två godis?", "And how does it feel to get two candies?"), t("Det får vi prata mer om nästa gång.", "We can talk more about that next time.")],
      lapp: t("Mottagningen är stängd. Boka ny tid.", "The practice is closed. Please book a new appointment.") },
    { namn: t("Grannen som är greve", "The neighbour who is a count"), bild: "🧛", godis: 4, ger: 2,
      rep: [t("MUAHAHA! Jag är greve Dracula!", "MWAHAHA! I am Count Dracula!"), t("Jag har planerat den här dräkten sedan i mars.", "I've been planning this costume since March."), t("Ta fyra. Säg att jag var läskigast.", "Take four. Tell everyone I was the scariest.")] },
    { namn: t("Fastighetsmäklaren", "The estate agent"), bild: "👩‍💼", godis: 3, special: "maklare", ger: 1,
      rep: [t("Wow, vilken hink! Ljus och luftig, med stor potential.", "Wow, what a bucket! Light and airy, with great potential."), t("Visning pågår. Budgivningen börjar på tre godis.", "Viewing in progress. Bidding starts at three candies.")] },
    { namn: t("Huset med bebisen", "The house with the baby"), special: "bebis", godis: 3 },
    { namn: t("Paret som inte firar", "The couple who don't celebrate"), bild: "👫", godis: 2, ger: 3,
      rep: [t("Vi firar inte Halloween. Det är amerikanskt.", "We don't celebrate Halloween. It's too commercial."), t("Men vi köpte ju godis?", "But we bought candy?"), t("Det var till OSS.", "That was for US."), t("...Okej, ta två.", "...Fine, take two.")] },
    { namn: t("Ordningsvakten", "The security guard"), bild: "👮", godis: 1, sak: ["🦺"], ger: 2,
      rep: [t("Halt! Har du reflex?", "Halt! Do you have a reflector?"), t("Ingen reflex, inget godis. Det är reglerna.", "No reflector, no candy. Those are the rules."), t("...Här. En reflex. Och EN godis. Gå säkert.", "...Here. A reflector. And ONE candy. Walk safely.")] },

    // Rad 4 (längst ner, där man bor)
    { namn: t("Sture", "Stanley"), bild: "👴", godis: 4, stanger: "18:45", special: "sture",
      rep: [t("Skynda dig, jag lägger mig kvart i sju.", "Hurry up, I go to bed at quarter to seven."), t("Det här godiset är från förra året.", "This candy is from last year."), t("Godis blir inte dåligt. Jag har testat. På mig.", "Candy doesn't go bad. I've tested it. On me.")],
      lapp: t("Sover. Godis nästa år. /Sture", "Asleep. Candy next year. /Stanley") },
    { namn: t("Hemma", "Home"), bild: "👩", special: "hem" },
    { namn: t("Tant Majken", "Auntie Maggie"), bild: "👵", godis: 8, special: "majken",
      rep: [t("Men så fint! Ta mer, ta mer!", "Oh, how lovely! Take more, take more!"), B(t("Tack!", "Thank you!")), t("Du är ju alldeles för smal. Ta mer!", "You're far too skinny. Take more!")] },
    { namn: t("Hälsofamiljen", "The health family"), bild: "🧑‍🌾", godis: 0, sak: ["🥕", "🍇"],
      rep: [t("Vi har naturens eget godis!", "We have nature's own candy!"), t("Russin och morötter. Lika gott! Nästan.", "Raisins and carrots. Just as good! Almost."), B(t("...Tack?", "...Thanks?"))] },
    { namn: t("Skämtpappan", "The dad who jokes"), bild: "🧔‍♂️", godis: 3, ger: 2,
      rep: [t("Varför är spöken så dåliga på att ljuga?", "Why are ghosts such bad liars?"), t("Man ser rakt igenom dem! HAHAHA!", "You can see right through them! HAHAHA!"), t("...Ta tre. Snälla, skratta.", "...Take three. Please laugh.")] },
    { namn: t("Läraren", "The teacher"), bild: "👩‍🏫", godis: 2, ger: 1,
      rep: [t("Hej! Här får alla lika mycket. Det är vår värdegrund.", "Hello! Here everyone gets the same. Those are our core values."), t("Även de som inte ringde på. Så du får två.", "Even the ones who didn't knock. So you get two."), t("Och en fråga att fundera på: Vad ÄR godis?", "And a question to reflect on: What IS candy?")] },
  ],

  // Vad mamma säger om man kommer hem för tidigt (före hemTid)
  hemTid: "19:30",
  tidigtHem: [
    t("Redan hemma? Ut och ring på mer!", "Home already? Go out and knock on more doors!"),
    t("Det är ju massor av tid kvar! Ut med dig!", "There's loads of time left! Out you go!"),
    t("Pappa har inte ens tagit fram skålen än.", "Dad hasn't even got his bowl out yet."),
  ],

  // ---------------------------------------------------------------
  //  FOLK på gatorna. De säger något när man går förbi.
  // ---------------------------------------------------------------
  folk: {
    banan: [
      t("Jag äter nyttigt nu. Så att jag kan äta ditt godis sen.", "I'm eating healthy now. So I can eat your candy later."),
      t("Det här är min sjätte banan. Jag har en plan.", "This is my sixth banana. I have a plan."),
      t("Har du sett mitt bananskal? Jag la det någonstans.", "Have you seen my banana peel? I put it somewhere."),
    ],
    hund: [
      t("Han är snäll! Han vill bara hälsa!", "He's friendly! He just wants to say hello!"),
      t("Det är flexikopplet. Det har en egen vilja.", "It's the retractable leash. It has a mind of its own."),
      t("Han får inte äta godis. Därför tar han ditt.", "He's not allowed candy. That's why he takes yours."),
    ],
    hundSnodde: [
      t("Förlåt! Han gör aldrig så här.", "Sorry! He never does this."),
      t("Han har inte ätit sedan... middagen.", "He hasn't eaten since... dinner."),
      t("Han gör aldrig så här. Förutom igår.", "He never does this. Except yesterday."),
    ],
    pudel: [
      t("Hon är på diet. Därför tar hon andras godis.", "She's on a diet. That's why she takes other people's candy."),
      t("Hon har vunnit pris för sin frisyr.", "She's won a prize for her hairdo."),
    ],
    barn: [
      t("Det finns ett hus med HELA chokladkakor! Längst upp till höger!", "There's a house with FULL chocolate bars! Top right!"),
      t("Akta spökhuset! Men gå dit ändå.", "Watch out for the haunted house! But go anyway."),
      t("Pumpafamiljen öppnar klockan sju. De har massor!", "The pumpkin family opens at seven. They have loads!"),
      t("Gå inte till tandläkaren. Lita på mig.", "Don't go to the dentist. Trust me."),
      t("Akta bananskalen. Min kompis tappade allt!", "Watch out for banana peels. My friend dropped everything!"),
      t("Sture lägger sig kvart i sju. Skynda!", "Stanley goes to bed at quarter to seven. Hurry!"),
    ],
    tonaring: [
      t("Jag är utklädd till trött tonåring.", "I'm dressed up as a tired teenager."),
      t("Jag är för gammal för det här. Men inte för godis.", "I'm too old for this. But not for candy."),
      t("Min dräkt är att jag har mössa.", "My costume is that I'm wearing a hat."),
    ],
    foraldrar: [
      t("Vi följer bara med för att se att det är säkert.", "We're just here to make sure it's safe."),
      t("Föräldrachatten har 412 olästa. Alla handlar om när vi ska gå hem.", "The parents' group chat has 412 unread messages. All about when to go home."),
      t("Jag tog bara en. Eller två. Det var tre.", "I only took one. Or two. It was three."),
    ],
  },

  // Sms som kommer under kvällen ("tid", "från", "text")
  sms: [
    { tid: "18:30", fran: t("Pappa", "Dad"), text: t("Glöm inte att jag gillar de med choklad. Bara så du vet.", "Don't forget I like the chocolate ones. Just so you know.") },
    { tid: "19:00", fran: t("Mamma", "Mum"), text: t("Har du jacka på dig? ❤️", "Are you wearing your jacket? ❤️") },
    { tid: "19:45", fran: t("Mamma", "Mum"), text: t("15 minuter kvar! Pappa har redan tagit fram en skål.", "15 minutes left! Dad has already got a bowl out.") },
  ],

  // De konstiga sakerna man kan få, och vad som händer med dem hemma
  skrap: {
    "🪥": t("Tandborsten – tandläkaren blir glad.", "Toothbrush – the dentist will be pleased."),
    "📜": t("Aktiebrevet – värde: 0 kr. Just nu.", "Share certificate – value: zero. For now."),
    "💧": t("Homeopatiskt godis – smakar vatten. Är vatten.", "Homeopathic candy – tastes like water. Is water."),
    "📋": t("Stadgarna – 48 sidor. Inga bilder.", "The bylaws – 48 pages. No pictures."),
    "🧱": t("Proteinbaren – pappa: \"Den skattar vi inte.\"", "Protein bar – Dad: \"We won't tax that one.\""),
    "🦺": t("Reflexen – mamma blir glad.", "Reflector – Mum will be pleased."),
    "🥕": t("Moroten – pappa: \"Den får du behålla!\"", "Carrot – Dad: \"You can keep that one!\""),
    "🍇": t("Russinen – ingen vill ha dem. Inte ens pappa.", "Raisins – nobody wants them. Not even Dad."),
  },

  // Vad pappa säger när han tar föräldraskatt
  pappa: [
    t("Jag måste bara kontrollera att det är säkert. *tugg*", "I just need to check that it's safe. *chew*"),
    t("Det heter föräldraskatt. Det står i lagen. Någonstans.", "It's called the parent tax. It's in the law. Somewhere."),
    t("Den här såg misstänkt god ut. Den tar jag.", "This one looked suspiciously tasty. I'll take it."),
    t("Jag tar bara de med choklad. För din skull.", "I'm only taking the chocolate ones. For your sake."),
  ],

  betyg: [
    t("Lite tunt i hinken...", "A bit thin in the bucket..."),
    t("Bra jobbat!", "Well done!"),
    t("Superbra! Hinken är tung!", "Super! What a heavy bucket!"),
    t("Godiskungen i kvarteret!", "Candy champion of the neighbourhood!"),
  ],

  utmarkelser: {
    choklad: { namn: t("Chokladkakor!", "Chocolate bars!"), text: t("Hittade huset med hela chokladkakor.", "Found the house with full-size bars.") },
    modig: { namn: t("Modig", "Brave"), text: t("Ringde på hos spökhuset.", "Knocked at the haunted house.") },
    sture: { namn: t("I sista stund", "Just in time"), text: t("Hann till Sture innan han la sig.", "Got to Stanley before bedtime.") },
    pumpa: { namn: t("Värt att vänta på", "Worth the wait"), text: t("Kom tillbaka till pumpafamiljen.", "Came back for the pumpkin family.") },
    allaHus: { namn: t("Hela kvarteret", "The whole street"), text: t("Ringde på i alla hus!", "Knocked on every door!") },
    banan: { namn: t("Bananproffs", "Banana pro"), text: t("Halkade inte en enda gång.", "Didn't slip once.") },
    hund: { namn: t("Hundviskare", "Dog whisperer"), text: t("Ingen hund snodde något.", "No dog stole anything.") },
    plock: { namn: t("Snabba fingrar", "Quick fingers"), text: t("Plockade upp 10 tappade godis.", "Picked up 10 dropped candies.") },
  },
};

// Något som barnet säger (i husens repliker)
function B(text) {
  return { barn: true, text };
}

const S = INSTALLNINGAR;
const canvas = document.getElementById("spel");
const ctx = canvas.getContext("2d");
const hemKnapp = document.getElementById("hem");
const pausKnapp = document.getElementById("paus");
const pausmeny = document.getElementById("pausmeny");
const musikKnapp = document.getElementById("musikKnapp");
const TYPSNITT = 'ui-rounded, system-ui, -apple-system, "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif';
const HANDSTIL = '"Marker Felt", "Chalkboard SE", "Comic Sans MS", ui-rounded, cursive';
const HUSFARGER = ["#c9a96e", "#b07a6a", "#7d97b0", "#8fae84", "#b08aa0", "#a8a090", "#c48f5a"];
const TAKFARGER = ["#5a2b2b", "#3b3040", "#2f3b4a", "#4a2f45", "#3a4030"];
const GODISBILDER = ["🍬", "🍭", "🍫", "🍬", "🍪", "🍭"];
const VARV = Math.PI * 2;

// Kvarteret: fyra gator bredvid varandra, och tre tvärgator.
// x går åt höger och y nedåt (som på skärmen). 1 = ungefär ett barn högt.
const GATOR_Y = [0, 9, 18, 27];
const TVARGATOR_X = [0, 21, 42];
const HUS_X = [4.5, 10.5, 16.5, 25.5, 31.5, 37.5];
const VARLD = { x0: -2.6, x1: 44.6, y0: -7.6, y1: 29.8 };
const GATA = 0.8;     // Halva bredden på asfalten
const TROTTOAR = 1.3; // Halva bredden på gatan med trottoarer
const HUS_B = 4.6;    // Hur brett ett hus är
const HUS_DJUP = 3;   // Hur djupt ett hus är
const FRAM = 2.2;     // Hur långt från gatans mitt husens framsida är

let bredd = 0;
let hojd = 0;
let u = 0;
let marginal = { topp: 0, vanster: 0, hoger: 0, botten: 0 };
let panelH = 0;
let mittY = 0;        // Där på skärmen (y) som kameran pekar
let kamX = 0;
let kamY = 0;
let pixelSkala = Math.min(window.devicePixelRatio || 1, 2);
let bildtider = [];
const emojiMinne = new Map(); // Färdigritade emojis

let lage = "start";   // "start", "spelar", "paus" eller "slut"
let tid = 0;
let speltid = 0;
let tidSedanSlut = 0;
let klocka = 18 * 60; // Minuter efter midnatt
let valdDrakt = Number(lasInstallning("drakt-godis")) || 0;
if (!S.drakter[valdDrakt]) valdDrakt = 0;
let drakt = S.drakter[valdDrakt];
let rekord = lasRekord();
let startKnappar = [];

let godis = 0;        // Godiset i hinken
let skrapSaker = [];  // De konstiga sakerna i hinken
let flygande = [];    // Godis som flyger in i hinken, konstiga saker som flyger in i ryggsäcken, och godis som hundarna snor
let tappat = [];      // Godis som ligger på marken
let husLista = [];
let trad = [];
let lyktor = [];
let dekor = [];       // Löv, gravstenar och annat som bara syns
let bananer = [];
let folk = [];
let hundar = [];
let texter = [];
let bubblor = [];
let fladdermoss = [];
let samtal = null;    // Huset man ringer på just nu
let lapp = null;
let tips = null;      // { text, kvar, sms }
let toaster = [];
let hinkStuds = 0;
let fickStuds = 0;
let skakning = 0;
let vind = null;      // Vindpusten som blåser just nu
let vindTider = [];
let smsKvar = [];
let resultat = null;
let stat = nyStatistik();
const fatt = new Set();
const visadeTips = new Set();
const tangent = {};

let barn = nyttBarn(0, 0);

function nyttBarn(x, y) {
  return { x, y, malX: x, malY: y, harMal: false, riktning: 1, gangFas: 0, ror: false, halkar: 0, hopp: 0 };
}

function nyStatistik() {
  return { halkat: 0, snott: 0, upplockat: 0, besokta: 0, tappat: 0 };
}

// ---------- Små hjälpfunktioner ----------

function slumpa(lista) {
  return lista[Math.floor(Math.random() * lista.length)];
}

function slumpMellan(a, b) {
  return a + Math.random() * (b - a);
}

function begr(v, minst, mest) {
  return Math.max(minst, Math.min(mest, v));
}

function avst(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function minuter(text) {
  const [h, m] = text.split(":").map(Number);
  return h * 60 + m;
}

function klockText(min) {
  const h = Math.floor(min / 60);
  const m = Math.floor(min % 60);
  return h + ":" + String(m).padStart(2, "0");
}

// En "slumpgenerator" som ger samma tal varje gång för samma frö
function fro(n) {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

function SX(x) {
  return bredd / 2 + (x - kamX) * u;
}

function SY(y) {
  return mittY + (y - kamY) * u;
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

  u = Math.min(bredd, hojd) / 9;
  panelH = marginal.topp + Math.max(100, Math.min(140, u * 1.5));
  mittY = panelH + (hojd - panelH - marginal.botten) * 0.55;
  uppdateraKamera(0, true);
  emojiMinne.clear();
}

// Mäter hur snabbt bilderna ritas. Går det för långsamt ritar vi med färre pixlar.
function kollaFart(dt) {
  if (lage !== "spelar" || pixelSkala <= 1) return;
  bildtider.push(dt);
  if (bildtider.length < 60) return;
  const snitt = bildtider.reduce((summa, d) => summa + d, 0) / bildtider.length;
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
  barn.malX = kamX + (fingerX - bredd / 2) / u;
  barn.malY = kamY + (fingerY - mittY) / u;
  barn.harMal = true;
}

function tryckPaStart(px, py) {
  for (const k of startKnappar) {
    if (px < k.x || px > k.x + k.w || py < k.y || py > k.y + k.h) continue;
    if (k.start) {
      startaSpel();
    } else if (k.i !== valdDrakt) {
      valdDrakt = k.i;
      drakt = S.drakter[k.i];
      sparaInstallning("drakt-godis", String(k.i));
      spelaTon(700, 1000, 0.1, "triangle", 0.08);
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
  if (lage === "slut") {
    if (tidSedanSlut > 3.5) visaStart();
    return;
  }
  if (lage !== "spelar") return;
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
    const n = S.drakter.length;
    valdDrakt = (valdDrakt + (e.key === "ArrowLeft" ? n - 1 : 1)) % n;
    drakt = S.drakter[valdDrakt];
    sparaInstallning("drakt-godis", String(valdDrakt));
    return;
  }
  if (e.key === " " || e.key === "Enter") {
    startaLjud();
    if (lage === "start") startaSpel();
    else if (lage === "slut" && tidSedanSlut > 3.5) visaStart();
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
  sparaInstallning("musik-godis", musikPa ? "pa" : "av");
  visaMusikKnapp();
});

// Pausa av sig själv om man byter app eller flik
document.addEventListener("visibilitychange", () => {
  if (document.hidden) pausa();
});

// ---------- Bygga kvarteret ----------

function ledigt(x, y, r) {
  if (x < VARLD.x0 + r || x > VARLD.x1 - r || y < VARLD.y0 + r || y > VARLD.y1 - r) return false;
  for (const h of husLista) {
    if (x > h.x - HUS_B / 2 - r && x < h.x + HUS_B / 2 + r && y > h.bak - r && y < h.fram + r) return false;
  }
  for (const s of trad) {
    if (Math.hypot(x - s.x, y - s.y) < s.r + r) return false;
  }
  return true;
}

function byggKvarteret() {
  husLista = [];
  trad = [];
  lyktor = [];
  dekor = [];
  bananer = [];
  folk = [];
  hundar = [];

  S.hus.forEach((def, i) => {
    const rad = Math.floor(i / HUS_X.length);
    const gy = GATOR_Y[rad];
    husLista.push({
      def, nr: i, x: HUS_X[i % HUS_X.length], fram: gy - FRAM, bak: gy - FRAM - HUS_DJUP,
      farg: def.special === "hem" ? "#e0b0a0" : HUSFARGER[(i * 5 + 2) % HUSFARGER.length],
      tak: TAKFARGER[(i * 3 + 1) % TAKFARGER.length],
      oppnar: def.oppnar ? minuter(def.oppnar) : 0,
      stanger: def.stanger ? minuter(def.stanger) : 99999,
      besokt: false, provat: false, oppen: 0, skrammer: 0, meddelat: false,
    });
  });

  // Träd i trädgårdarna bakom husen och längst ner
  let n = 1;
  for (const gy of [...GATOR_Y, 36]) {
    for (let x = VARLD.x0 + 1; x < VARLD.x1 - 0.5; x += 2.2 + fro(n++) * 2.2) {
      const y = gy - FRAM - HUS_DJUP - 0.9 - fro(n++) * 1.2;
      if (TVARGATOR_X.some((gx) => Math.abs(x - gx) < TROTTOAR + 0.6)) continue;
      if (y < VARLD.y0 + 0.5 || y > VARLD.y1 - 0.4) continue;
      trad.push({ x, y, r: 0.35, storlek: 0.85 + fro(n++) * 0.5, gran: fro(n++) < 0.3 });
    }
  }
  // Längst ner (under den sista gatan) är det en gräsmatta med några träd
  for (let x = VARLD.x0 + 1.5; x < VARLD.x1 - 1; x += 3 + fro(n++) * 3) {
    if (TVARGATOR_X.some((gx) => Math.abs(x - gx) < TROTTOAR + 0.6)) continue;
    trad.push({ x, y: GATOR_Y[3] + 2.1 + fro(n++) * 0.6, r: 0.35, storlek: 0.9 + fro(n++) * 0.4, gran: fro(n++) < 0.5 });
  }

  // Gatlyktor längs trottoarerna
  for (const gy of GATOR_Y) {
    for (let x = 3.5; x < 42; x += 7) {
      if (TVARGATOR_X.some((gx) => Math.abs(x - gx) < 2)) continue;
      lyktor.push({ x, y: gy + TROTTOAR - 0.15 });
    }
  }
  for (const gx of TVARGATOR_X) {
    for (let y = 4.5; y < 27; y += 9) lyktor.push({ x: gx + TROTTOAR - 0.15, y });
  }

  // Löv, gravstenar och pumpor
  for (let i = 0; i < 70; i++) {
    const x = slumpMellan(VARLD.x0 + 0.5, VARLD.x1 - 0.5);
    const y = slumpMellan(VARLD.y0 + 0.5, VARLD.y1 - 0.5);
    if (!ledigt(x, y, 0.3)) continue;
    dekor.push({ x, y, bild: "🍂", storlek: slumpMellan(0.25, 0.4), vinkel: slumpMellan(-1, 1), mark: true });
  }
  for (const h of husLista) {
    if (h.def.special === "spok") {
      for (const dx of [-1.6, -0.6, 0.9, 1.8]) dekor.push({ x: h.x + dx, y: h.bak - 0.9 - Math.abs(dx) * 0.2, bild: "🪦", storlek: 0.6 });
    } else if (fro(h.nr * 7) < 0.3) {
      dekor.push({ x: h.x + (fro(h.nr * 3) < 0.5 ? -1.4 : 1.4), y: h.bak - 0.8, bild: "🪦", storlek: 0.5 });
    }
  }

  // Bananskalen ligger på gatorna
  for (let i = 0; i < S.bananskal; i++) laggBananskal();

  // Folket på gatorna. De går runt i en slinga mellan gatukorsningarna.
  const k = (xi, yi) => ({ x: TVARGATOR_X[xi], y: GATOR_Y[yi] });
  folk.push(nyttFolk("banan", [k(0, 1), k(1, 1), k(1, 3), k(0, 3)], 1.1));
  const agare1 = nyttFolk("hund", [k(1, 0), k(2, 0), k(2, 2), k(1, 2)], 0.8);
  const agare2 = nyttFolk("pudel", [k(2, 1), k(2, 3), k(1, 3), k(1, 1)], 0.7);
  folk.push(agare1, agare2);
  hundar.push(nyHund(agare1, "🐕"), nyHund(agare2, "🐩"));
  const grupp = nyttFolk("barn", [k(0, 0), k(2, 0), k(2, 3), k(0, 3)], 1.4);
  grupp.drakter = ["skelett", "pumpa"];
  folk.push(grupp);
  folk.push(nyttFolk("tonaring", [{ x: 22, y: 4.6 }], 0));
  folk.push(nyttFolk("foraldrar", [{ x: 1.1, y: 13.4 }], 0));
}

function laggBananskal(x, y) {
  for (let forsok = 0; forsok < 30 && x === undefined; forsok++) {
    const vagrat = Math.random() < 0.65;
    const nx = vagrat ? slumpMellan(-1, 43) : slumpa(TVARGATOR_X) + slumpMellan(-1.1, 1.1);
    const ny = vagrat ? slumpa(GATOR_Y) + slumpMellan(-1.1, 1.1) : slumpMellan(0, 27);
    const hem = husLista.find((h) => h.def.special === "hem");
    if (hem && Math.hypot(nx - hem.x, ny - hem.fram) < 4) continue;
    if (bananer.some((b) => Math.hypot(b.x - nx, b.y - ny) < 3)) continue;
    x = nx;
    y = ny;
  }
  if (x === undefined) return;
  bananer.push({ x, y, vinkel: slumpMellan(0, VARV), ny: 0 });
}

function nyttFolk(sort, slinga, fart) {
  return { sort, slinga, fart, mal: 1 % slinga.length, x: slinga[0].x, y: slinga[0].y, riktning: 1, pratOm: 0, repNr: 0, bananOm: 20, gangFas: 0 };
}

function nyHund(agare, bild) {
  return { agare, bild, x: agare.x + 1, y: agare.y, jagar: 0, vila: 3, bar: "", barKvar: 0, malX: agare.x, malY: agare.y, bytOm: 0, riktning: 1, gangFas: 0 };
}

// ---------- Starta och sluta ----------

function visaStart() {
  lage = "start";
  resultat = null;
  pausmeny.hidden = true;
}

function startaSpel() {
  lage = "spelar";
  pausmeny.hidden = true;
  speltid = 0;
  tidSedanSlut = 0;
  klocka = 18 * 60;
  godis = 0;
  skrapSaker = [];
  flygande = [];
  tappat = [];
  texter = [];
  bubblor = [];
  fladdermoss = [];
  samtal = null;
  lapp = null;
  tips = null;
  toaster = [];
  vind = null;
  resultat = null;
  stat = nyStatistik();
  fatt.clear();
  visadeTips.clear();
  byggKvarteret();
  const hem = husLista.find((h) => h.def.special === "hem");
  barn = nyttBarn(hem.x, hem.fram + 0.9);
  hem.provat = true; // Mamma säger inget förrän man har gått därifrån
  // Vindpustarna kommer på slumpade tider under kvällen
  vindTider = [];
  for (let i = 0; i < S.vindpustar; i++) {
    const del = 120 / S.vindpustar;
    vindTider.push(18 * 60 + 15 + i * del + Math.random() * (del - 25));
  }
  smsKvar = S.sms.map((m) => ({ ...m, min: minuter(m.tid) }));
  uppdateraKamera(0, true);
  visaTips(t("Gå till husen med 🎃 och ring på!", "Walk to the houses with a 🎃 and knock!"), 5);
}

function slutaKvallen(hemma) {
  // Godis som fortfarande flyger hamnar i hinken
  for (const f of flygande) landa(f);
  flygande = [];
  samtal = null;
  if (stat.halkat === 0 && godis >= 10) utmarkelse("banan");
  if (stat.snott === 0 && godis >= 10) utmarkelse("hund");
  const skatt = Math.round(godis * S.skatt);
  const kvar = godis - skatt;
  let stjarnor = 0;
  while (stjarnor < 3 && kvar >= S.stjarnor[stjarnor]) stjarnor++;
  const nyttRekord = kvar > rekord;
  if (nyttRekord) {
    rekord = kvar;
    sparaRekord(rekord);
  }
  // Två av de konstiga sakerna får en kommentar
  const olika = [...new Set(skrapSaker)];
  const kommentarer = [];
  while (olika.length && kommentarer.length < 2) kommentarer.push(S.skrap[olika.splice(Math.floor(Math.random() * olika.length), 1)[0]]);
  resultat = { hemma, samlat: godis, hus: stat.besokta, skatt, kvar, stjarnor, nyttRekord, kommentarer, pappa: slumpa(S.pappa), saker: skrapSaker.slice() };
  lage = "slut";
  tidSedanSlut = 0;
  fingerNere = false;
  spelaArpeggio([523, 659, 784, 1047]);
}

// ---------- Texter, bubblor och tips ----------

function visaText(text, x, y, farg, stor = true, kvar = 1.4, stilla = false) {
  texter.push({ text, x, y, farg, stor, kvar, stilla });
}

function saga(agare, text, langd) {
  bubblor = bubblor.filter((b) => b.agare !== agare);
  bubblor.push({ agare, text, kvar: langd || begr(1.6 + text.length * 0.045, 2.2, 4.5) });
}

function visaTips(text, langd, sms = false) {
  tips = { text, kvar: langd, sms };
}

function visaTipsEnGang(nyckel, text, langd = 4) {
  if (visadeTips.has(nyckel)) return;
  visadeTips.add(nyckel);
  visaTips(text, langd);
}

function visaLapp(text) {
  lapp = { text, kvar: 5, vinkel: slumpMellan(-0.04, 0.04) };
  spelaTon(2600, 1800, 0.06, "triangle", 0.04);
  spelaTon(2200, 1500, 0.06, "triangle", 0.04, 0.08);
}

function utmarkelse(nyckel) {
  if (fatt.has(nyckel)) return;
  fatt.add(nyckel);
  const m = S.utmarkelser[nyckel];
  if (!m) return;
  toaster.push({ namn: m.namn, text: m.text, kvar: 4.5 });
  spelaArpeggio([784, 988, 1175, 1568]);
}

// ---------- Godiset ----------

// Hinken högst upp på skärmen (där godiset flyger in)
function hinkPlats() {
  return { x: bredd / 2, y: marginal.topp + (panelH - marginal.topp) * 0.5 };
}

// Ryggsäcken uppe till vänster, där de konstiga sakerna hamnar (i är platsen för saken, -1 är själva ryggsäcken)
function fickPlats(i) {
  const under = marginal.topp + 68; // Under hus- och pausknappen
  const storlek = begr((panelH - under) * 0.85, 18, 30);
  const x0 = marginal.vanster + 14 + storlek / 2;
  const y = (under + panelH) / 2;
  if (i < 0) return { x: x0, y, storlek };
  // Får inte alla plats tränger de ihop sig
  const antal = skrapSaker.length + flygande.filter((f) => f.mal === "ficka").length;
  const forst = x0 + storlek * 1.15;
  const sist = bredd / 2 - (panelH - marginal.topp) * 0.45 - storlek * 0.6;
  const steg = Math.min(storlek * 0.95, (sist - forst) / Math.max(1, antal - 1));
  return { x: forst + i * steg, y, storlek };
}

// Det man får visas en stund vid dörren. Sedan flyger godiset in i hinken
// och de konstiga sakerna in i ryggsäcken.
function geGodis(x, y, antal, saker = [], bild = "") {
  const alla = [];
  for (let i = 0; i < antal; i++) alla.push({ bild: bild || slumpa(GODISBILDER), mal: "hink" });
  for (const sak of saker) alla.push({ bild: sak, mal: "ficka" });
  // Sakerna lägger sig på båda sidor om dörren (pratbubblan är ovanför)
  const perSida = Math.ceil(alla.length / 2);
  const mellan = Math.min(0.6, 1.3 / Math.max(1, perSida - 1));
  alla.forEach((f, i) => {
    const sida = i % 2 ? 1 : -1;
    f.x = x + sida * (0.85 + Math.floor(i / 2) * mellan);
    f.y = y - 0.75 - (Math.floor(i / 2) % 2) * 0.25;
    f.vis = -i * 0.07; // Kommer fram en i taget
    f.fas = 0;
    flygande.push(f);
  });
  // Texten står under barnet, så att den inte skymmer det man får
  if (antal > 0) visaText("+" + antal + " 🍬", x, y + 1.75, "#ffe14d", true, 2.6, true);
  else if (saker.length) visaText(t("Inget godis!", "No candy!"), x, y + 1.75, "#ffb3b3", true, 2.6, true);
}

function landa(f) {
  if (f.mal === "ficka") skrapSaker.push(f.bild);
  else if (f.mal === "hink") godis += 1;
  else if (f.hund) {
    f.hund.bar = f.bild;
    f.hund.barKvar = 4;
  }
}

function uppdateraFlygande(dt) {
  for (const f of flygande) {
    if (f.vis < S.visaGodis) {
      const fore = f.vis;
      f.vis += dt;
      if (fore < 0 && f.vis >= 0) spelaTon(f.mal === "ficka" ? 500 : 900, f.mal === "ficka" ? 350 : 1300, 0.08, "triangle", 0.04);
      continue;
    }
    f.fas += dt / S.flygTid;
    if (f.fas >= 1) {
      landa(f);
      if (f.mal === "hink") {
        hinkStuds = 1;
        spelaTon(1100 + Math.random() * 500, 1700, 0.07, "triangle", 0.05);
      } else if (f.mal === "ficka") {
        fickStuds = 1;
        spelaTon(300, 200, 0.12, "sine", 0.07);
      }
    }
  }
  flygande = flygande.filter((f) => f.fas < 1);
}

// Godis ramlar ur hinken och hamnar på marken runt (x, y)
function tappa(antal, x, y, spridning, vindX = 0) {
  const n = Math.min(antal, godis);
  godis -= n;
  stat.tappat += n;
  for (let i = 0; i < n; i++) {
    let mx = x;
    let my = y;
    for (let forsok = 0; forsok < 12; forsok++) {
      const vinkel = Math.random() * VARV;
      const r = slumpMellan(0.7, spridning);
      const nx = x + Math.cos(vinkel) * r + vindX * slumpMellan(0.7, 1.2);
      const ny = y + Math.sin(vinkel) * r * 0.8;
      if (ledigt(nx, ny, 0.25)) {
        mx = nx;
        my = ny;
        break;
      }
    }
    tappat.push({ fx: x, fy: y, x: mx, y: my, fas: 0, kvar: S.tappatKvar, bild: slumpa(GODISBILDER), vinkel: slumpMellan(-0.6, 0.6) });
  }
  return n;
}

function uppdateraTappat(dt) {
  for (const g of tappat) {
    if (g.fas < 1) {
      g.fas = Math.min(1, g.fas + dt / 0.55);
      continue;
    }
    g.kvar -= dt;
    if (Math.hypot(barn.x - g.x, barn.y - g.y) < 0.75 && barn.halkar <= 0) {
      g.kvar = -1;
      g.plockad = true;
      godis += 1;
      hinkStuds = 1;
      stat.upplockat += 1;
      if (stat.upplockat >= 10) utmarkelse("plock");
      visaText("+1", g.x, g.y - 0.8, "#ffe14d", false, 0.8);
      spelaTon(1300, 1900, 0.07, "triangle", 0.06);
    }
  }
  const borta = tappat.filter((g) => g.kvar <= 0 && !g.plockad);
  if (borta.length) visaTipsEnGang("borta", t("Plocka upp godiset innan det försvinner!", "Pick the candy up before it disappears!"), 3);
  tappat = tappat.filter((g) => g.kvar > 0);
}

// ---------- Barnet ----------

// Flyttar något (barnet eller en hund) och ser till att det inte går in i hus och träd
function flytta(f, dx, dy, r) {
  const kolla = (x, y) => {
    if (x < VARLD.x0 + r || x > VARLD.x1 - r || y < VARLD.y0 + r || y > VARLD.y1 - r) return false;
    for (const h of husLista) {
      if (x > h.x - HUS_B / 2 - r && x < h.x + HUS_B / 2 + r && y > h.bak - r && y < h.fram + r) return false;
    }
    return true;
  };
  if (kolla(f.x + dx, f.y)) f.x += dx;
  if (kolla(f.x, f.y + dy)) f.y += dy;
  // Träden knuffar ut en åt sidan
  for (const s of trad) {
    const ax = f.x - s.x;
    const ay = f.y - s.y;
    const d = Math.hypot(ax, ay);
    const min = s.r + r;
    if (d < min && d > 0.0001 && kolla(s.x + (ax / d) * min, s.y + (ay / d) * min)) {
      f.x = s.x + (ax / d) * min;
      f.y = s.y + (ay / d) * min;
    }
  }
}

function uppdateraBarn(dt) {
  const b = barn;
  if (fingerNere) malFranFinger();
  let dx = 0;
  let dy = 0;
  if (tangent.arrowleft || tangent.a) dx -= 1;
  if (tangent.arrowright || tangent.d) dx += 1;
  if (tangent.arrowup || tangent.w) dy -= 1;
  if (tangent.arrowdown || tangent.s) dy += 1;
  if (dx || dy) {
    b.harMal = false;
  } else if (b.harMal) {
    dx = b.malX - b.x;
    dy = b.malY - b.y;
    if (Math.hypot(dx, dy) < 0.12) {
      b.harMal = fingerNere;
      dx = 0;
      dy = 0;
    }
  }
  b.halkar = Math.max(0, b.halkar - dt);
  b.hopp = Math.max(0, b.hopp - dt);
  const langd = Math.hypot(dx, dy);
  b.ror = langd > 0 && b.halkar <= 0;
  if (b.ror) {
    const fart = S.fart * (vind ? 0.8 : 1);
    const steg = Math.min(fart * dt, langd);
    flytta(b, (dx / langd) * steg, (dy / langd) * steg, 0.3);
    if (Math.abs(dx) > 0.05) b.riktning = dx > 0 ? 1 : -1;
    b.gangFas += dt * 11;
  }

  // Bananskal!
  if (b.halkar <= 0) {
    for (const ban of bananer) {
      if (Math.hypot(b.x - ban.x, b.y - ban.y) > 0.45) continue;
      ban.borta = true;
      b.halkar = 0.9;
      b.harMal = false;
      stat.halkat += 1;
      const n = tappa(2 + Math.floor(Math.random() * 2), b.x, b.y, 1.5);
      visaText(t("Halka! 🍌", "Slip! 🍌"), b.x, b.y - 1.6, "#ffe14d");
      spelaTon(700, 140, 0.5, "sawtooth", 0.06);
      skakning = 0.25;
      if (n > 0) visaTipsEnGang("halka", t("Akta bananskalen! Plocka upp godiset snabbt!", "Watch out for banana peels! Pick up the candy, quick!"), 4);
      break;
    }
    bananer = bananer.filter((ban) => !ban.borta);
  }

  // Ringa på hos husen
  for (const h of husLista) {
    const d = Math.hypot(b.x - h.x, b.y - (h.fram + 0.35));
    if (h.provat && d > 1.4) h.provat = false;
    if (d < 0.6 && !samtal && !h.provat && b.halkar <= 0) ringPa(h);
  }
}

// ---------- Husen ----------

function husOppet(h) {
  const sp = h.def.special;
  if (sp === "tv") return false;
  if (sp === "hem" || sp === "bebis" || sp === "skal") return true;
  return klocka >= h.oppnar && klocka < h.stanger;
}

// Huset har en lysande pumpa: där får man godis
function harPumpa(h) {
  return husOppet(h) && !h.besokt && h.def.special !== "hem";
}

function ringPa(h) {
  const def = h.def;
  const sp = def.special;
  h.provat = true;

  if (sp === "hem") {
    if (klocka < minuter(S.hemTid)) {
      saga(h, slumpa(S.tidigtHem));
      h.oppen = 2.5;
      spelaRingklocka();
      backa(h);
    } else {
      saga(h, t("Välkommen hem! Pappa väntar med en skål...", "Welcome home! Dad is waiting with a bowl..."));
      slutaKvallen(true);
    }
    return;
  }
  if (h.besokt) {
    if (sp !== "tv") saga(barn, t("Här har jag redan varit.", "I've already been here."), 1.8);
    return;
  }
  if (sp === "tv") {
    // Ingen öppnar, men någon svarar...
    samtal = { h, rader: def.rep.map(rad), i: -1, vanta: 1.1, godis: 0, sak: [], ger: 99, dorr: false };
    saga(barn, t("Bus eller godis!", "Trick or treat!"), 1.2);
    spelaRingklocka();
    return;
  }
  if (!husOppet(h)) {
    if (klocka < h.oppnar) saga(barn, t("De är inte klara än...", "They're not ready yet..."), 2);
    else saga(barn, t("Släckt... ingen öppnar.", "Lights off... nobody's home."), 2);
    if (def.lapp) visaLapp(def.lapp);
    spelaTon(300, 250, 0.2, "sine", 0.05);
    return;
  }
  if (sp === "skal") {
    h.besokt = true;
    stat.besokta += 1;
    visaLapp(t("TA EN. Vi litar på er! ❤️", "TAKE ONE. We trust you! ❤️"));
    if (klocka < 18 * 60 + 20) {
      saga(barn, t("En. Okej. En.", "One. Okay. One."), 2.2);
      geGodis(h.x, h.fram, def.godis);
    } else {
      saga(barn, t("Den är tom... Någon tog alla.", "It's empty... Someone took them all."), 2.8);
    }
    kollaAllaHus();
    return;
  }
  if (sp === "bebis") {
    // Psst! Man ska inte ringa på här.
    h.besokt = true;
    stat.besokta += 1;
    visaLapp(t("PSST! Ring inte på. Bebisen sover. Det tog tre timmar. Ta godis ur påsen. 🙏", "PSST! Don't knock. The baby is asleep. It took three hours. Take candy from the bag. 🙏"));
    saga(barn, t("(viskar) ...bus eller godis...", "(whispers) ...trick or treat..."), 2.6);
    geGodis(h.x, h.fram, def.godis);
    kollaAllaHus();
    return;
  }

  let rader = def.rep.map(rad);
  if (sp === "majken") rader = rader.concat([rad(drakt.ata)]);
  samtal = { h, rader, i: -1, vanta: 1.0, godis: def.godis || 0, sak: def.sak || [], ger: def.ger || 0, dorr: true };
  saga(barn, t("Bus eller godis!", "Trick or treat!"), 1.2);
  spelaRingklocka();
  backa(h);
  if (sp === "spok") {
    samtal.vanta = 2.4; // Först kommer skelettet...
    h.skrammer = 1.6;
  }
}

// Barnet tar ett steg tillbaka från dörren, så att man ser vem som öppnar
function backa(h) {
  fingerNere = false;
  barn.malX = barn.x;
  barn.malY = h.fram + 1.05;
  barn.harMal = true;
}

function rad(r) {
  return typeof r === "string" ? { text: r, barn: false } : r;
}

function uppdateraSamtal(dt) {
  if (!samtal) return;
  const s = samtal;
  const h = s.h;
  if (h.skrammer > 0) {
    const fore = h.skrammer;
    h.skrammer -= dt;
    if (fore > 1.0 && h.skrammer <= 1.0) {
      // BUH!
      skakning = 0.4;
      barn.hopp = 0.6;
      spelaTon(220, 55, 0.7, "sawtooth", 0.12);
      spelaTon(900, 250, 0.5, "square", 0.04);
      visaText(t("BUH!", "BOO!"), h.x + 1.3, h.fram - 1.0, "#ffffff", true, 1.6);
      if (tappa(3, barn.x, barn.y, 1.6) > 0) saga(barn, t("AAAH! Mitt godis!", "AAAH! My candy!"), 1.5);
      utmarkelse("modig");
    }
  }
  // Har barnet gått vidare får det godiset ändå, och samtalet tar slut
  const gattVidare = Math.hypot(barn.x - h.x, barn.y - h.fram) > 3.5 && h.skrammer <= 0;
  s.vanta -= dt;
  if (s.dorr) h.oppen = Math.max(h.oppen, 1.2);
  if (s.vanta > 0 && !gattVidare) return;
  s.i += 1;
  if (s.i >= s.ger || gattVidare) geHusetsGodis(s);
  if (s.i >= s.rader.length || gattVidare) {
    h.besokt = true;
    stat.besokta += 1;
    samtal = null;
    kollaAllaHus();
    return;
  }
  const r = s.rader[s.i];
  const langd = begr(1.5 + r.text.length * 0.045, 2, 4.2);
  saga(r.barn ? barn : h, r.text, langd + 0.3);
  s.vanta = langd;
}

function geHusetsGodis(s) {
  if (s.gett || s.ger >= 99) return;
  s.gett = true;
  const sp = s.h.def.special;
  geGodis(s.h.x, s.h.fram, s.godis, s.sak, sp === "choklad" ? "🍫" : "");
  if (sp === "choklad") utmarkelse("choklad");
  if (sp === "sture") utmarkelse("sture");
  if (sp === "pumpa") utmarkelse("pumpa");
}

function kollaAllaHus() {
  if (husLista.every((h) => h.besokt || h.def.special === "hem")) utmarkelse("allaHus");
}

function uppdateraHus(dt) {
  for (const h of husLista) {
    h.oppen = Math.max(0, h.oppen - dt);
    // Huset med pumpafamiljen får fler pumpor när de har skurit klart
    if (h.def.special === "pumpa" && klocka >= h.oppnar && !h.meddelat) {
      h.meddelat = true;
      if (Math.hypot(barn.x - h.x, barn.y - h.fram) < 12) visaText(t("Pumpafamiljen har öppnat!", "The pumpkin family is open!"), h.x, h.fram - 3, "#ffb347");
      visaTips(t("🎃 Pumpafamiljen har öppnat!", "🎃 The pumpkin family is open!"), 3.5);
    }
  }
}

// ---------- Folket på gatorna ----------

function uppdateraFolk(dt) {
  for (const p of folk) {
    if (p.slinga.length > 1) {
      const mal = p.slinga[p.mal];
      const dx = mal.x - p.x;
      const dy = mal.y - p.y;
      const d = Math.hypot(dx, dy);
      // Hundägarna står still en stund när hunden har snott något
      const fart = p.fart * (p.stannar > 0 ? 0 : 1);
      p.stannar = Math.max(0, (p.stannar || 0) - dt);
      if (d < 0.1) {
        p.mal = (p.mal + 1) % p.slinga.length;
      } else if (fart > 0) {
        const steg = Math.min(d, fart * dt);
        p.x += (dx / d) * steg;
        p.y += (dy / d) * steg;
        if (Math.abs(dx) > 0.05) p.riktning = dx > 0 ? 1 : -1;
        p.gangFas += dt * 8;
      }
    }
    // Pratar när man går förbi
    p.pratOm -= dt;
    const lista = S.folk[p.sort];
    if (p.pratOm <= 0 && lista && avst(p, barn) < 2.4) {
      saga(p, lista[p.repNr % lista.length]);
      p.repNr += 1;
      p.pratOm = 9;
    }
    // Bananpappan tappar bananskal
    if (p.sort === "banan") {
      p.bananOm -= dt;
      if (p.bananOm <= 0 && bananer.length < S.bananskal + 3 && avst(p, barn) > 2) {
        laggBananskal(p.x + slumpMellan(-0.4, 0.4), p.y + slumpMellan(-0.4, 0.4));
        p.bananOm = slumpMellan(28, 38);
        if (avst(p, barn) < 9) saga(p, t("Oj. Där åkte ett bananskal.", "Oops. There goes a banana peel."), 2.2);
      }
    }
  }
}

function uppdateraHundar(dt) {
  for (const d of hundar) {
    const a = d.agare;
    d.vila = Math.max(0, d.vila - dt);
    d.barKvar = Math.max(0, d.barKvar - dt);
    if (d.barKvar <= 0) d.bar = "";
    const tillBarn = avst(d, barn);
    let fart = 1.6;
    if (d.jagar > 0) {
      d.jagar -= dt;
      d.malX = barn.x;
      d.malY = barn.y;
      fart = 3.8;
      if (d.jagar <= 0) d.vila = 3; // Ger upp
      if (tillBarn < 0.55) {
        // Hunden snor ett godis!
        d.jagar = 0;
        d.vila = S.hundVila;
        if (godis > 0) {
          godis -= 1;
          stat.snott += 1;
          // Godiset flyger ur hinken och in i munnen på hunden
          flygande.push({ bild: slumpa(GODISBILDER), mal: "hund", hund: d, vis: S.visaGodis, fas: 0 });
          hinkStuds = 1;
          visaText(t("Hunden snodde godis!", "The dog stole candy!"), barn.x, barn.y + 0.8, "#ffb3b3", true, 2.4, true);
          saga(a, slumpa(S.folk.hundSnodde), 2.8);
          a.stannar = 2;
          spelaTon(500, 300, 0.08, "square", 0.07);
          visaTipsEnGang("hund", t("Spring ifrån hundarna! De vill ha ditt godis.", "Run away from the dogs! They want your candy."), 4);
        }
      }
    } else {
      d.bytOm -= dt;
      if (d.bytOm <= 0) {
        // Nosar runt ägaren
        d.malX = a.x + slumpMellan(-2.5, 2.5);
        d.malY = a.y + slumpMellan(-2, 2);
        d.bytOm = slumpMellan(1, 2.5);
      }
      if (d.vila <= 0 && godis > 0 && tillBarn < S.hundSer && Math.hypot(barn.x - a.x, barn.y - a.y) < S.hundKoppel + 1.5) {
        d.jagar = S.hundJagar;
        visaText(t("Voff!", "Woof!"), d.x, d.y - 1, "#ffffff", false, 0.9);
        spelaTon(520, 330, 0.09, "square", 0.07);
        spelaTon(520, 330, 0.09, "square", 0.07, 0.15);
      }
    }
    const dx = d.malX - d.x;
    const dy = d.malY - d.y;
    const l = Math.hypot(dx, dy);
    if (l > 0.1) {
      const steg = Math.min(l, fart * dt);
      flytta(d, (dx / l) * steg, (dy / l) * steg, 0.25);
      if (Math.abs(dx) > 0.05) d.riktning = dx > 0 ? 1 : -1;
      d.gangFas += dt * 12;
    }
    // Flexikopplet räcker inte längre än så här
    const ax = d.x - a.x;
    const ay = d.y - a.y;
    const al = Math.hypot(ax, ay);
    if (al > S.hundKoppel) {
      d.x = a.x + (ax / al) * S.hundKoppel;
      d.y = a.y + (ay / al) * S.hundKoppel;
    }
  }
}

// ---------- Vinden, sms och fladdermössen ----------

function uppdateraHandelser(dt) {
  if (vindTider.length && klocka >= vindTider[0] && !samtal && barn.halkar <= 0) {
    vindTider.shift();
    vind = { kvar: 2.4, riktning: Math.random() < 0.5 ? -1 : 1, blast: false, lov: [] };
    visaText(t("Det blåser!", "It's windy!"), barn.x, barn.y - 1.7, "#cfe8ff");
    spelaTon(250, 700, 1.2, "sine", 0.05);
  }
  if (vind) {
    vind.kvar -= dt;
    if (Math.random() < dt * 25) {
      vind.lov.push({ x: vind.riktning > 0 ? -20 : bredd + 20, y: slumpMellan(panelH, hojd), fart: slumpMellan(0.8, 1.3), vinkel: 0 });
    }
    for (const l of vind.lov) {
      l.x += vind.riktning * bredd * 0.9 * l.fart * dt;
      l.y += Math.sin(tid * 5 + l.fart * 9) * 40 * dt;
      l.vinkel += dt * 6;
    }
    if (!vind.blast && vind.kvar < 1.6) {
      vind.blast = true;
      if (godis >= 2) {
        tappa(2, barn.x, barn.y, 1.2, vind.riktning * 2.6);
        visaTipsEnGang("vind", t("Vinden tog lite godis! Spring och hämta det!", "The wind took some candy! Run and get it!"), 4);
      }
    }
    if (vind.kvar <= 0) vind = null;
  }
  if (smsKvar.length && klocka >= smsKvar[0].min) {
    const m = smsKvar.shift();
    visaTips("📱 " + m.fran + ": " + m.text, 5.5, true);
    spelaTon(1568, 1568, 0.08, "sine", 0.06);
    spelaTon(2093, 2093, 0.1, "sine", 0.06, 0.12);
  }
  if (Math.random() < dt * 0.12 && fladdermoss.length < 3) {
    const fran = Math.random() < 0.5 ? -1 : 1;
    fladdermoss.push({ x: fran < 0 ? -30 : bredd + 30, y: slumpMellan(panelH + 20, hojd * 0.6), riktning: -fran, fas: 0 });
  }
  for (const f of fladdermoss) {
    f.x += f.riktning * bredd * 0.35 * dt;
    f.fas += dt * 14;
  }
  fladdermoss = fladdermoss.filter((f) => f.x > -40 && f.x < bredd + 40);
}

// ---------- Kameran ----------

function uppdateraKamera(dt, direkt) {
  const halvB = bredd / 2 / u;
  const upp = (mittY - panelH) / u;
  const ner = (hojd - mittY) / u;
  let malX = barn.x;
  let malY = barn.y - 0.6;
  // Kanterna på kvarteret (lite extra upptill för taken)
  const x0 = VARLD.x0 + halvB;
  const x1 = VARLD.x1 - halvB;
  const y0 = VARLD.y0 - 0.5 + upp;
  const y1 = VARLD.y1 - ner;
  malX = x0 > x1 ? (VARLD.x0 + VARLD.x1) / 2 : begr(malX, x0, x1);
  malY = y0 > y1 ? (VARLD.y0 + VARLD.y1) / 2 : begr(malY, y0, y1);
  if (direkt) {
    kamX = malX;
    kamY = malY;
  } else {
    const k = Math.min(1, dt * 5);
    kamX += (malX - kamX) * k;
    kamY += (malY - kamY) * k;
  }
}

// ---------- Allt som händer varje bildruta ----------

function uppdatera(dt) {
  tid += dt;
  for (const ts of toaster) ts.kvar -= dt;
  toaster = toaster.filter((ts) => ts.kvar > 0);
  if (lapp) {
    lapp.kvar -= dt;
    if (lapp.kvar <= 0) lapp = null;
  }
  if (tips) {
    tips.kvar -= dt;
    if (tips.kvar <= 0) tips = null;
  }
  hinkStuds = Math.max(0, hinkStuds - dt * 4);
  fickStuds = Math.max(0, fickStuds - dt * 4);
  skakning = Math.max(0, skakning - dt);

  if (lage === "slut") {
    tidSedanSlut += dt;
    return;
  }
  if (lage !== "spelar") return;

  speltid += dt;
  const fore = klocka;
  klocka = 18 * 60 + Math.min(1, speltid / S.speltid) * 120;
  if (fore < 19 * 60 + 50 && klocka >= 19 * 60 + 50) {
    visaTips(t("⏰ 10 minuter kvar!", "⏰ 10 minutes left!"), 3.5);
    spelaTon(880, 880, 0.15, "square", 0.05);
    spelaTon(880, 880, 0.15, "square", 0.05, 0.25);
  }
  for (const tx of texter) {
    tx.kvar -= dt;
    if (!tx.stilla) tx.y -= dt * 0.6;
  }
  texter = texter.filter((tx) => tx.kvar > 0);
  for (const b of bubblor) b.kvar -= dt;
  bubblor = bubblor.filter((b) => b.kvar > 0);

  uppdateraBarn(dt);
  if (lage !== "spelar") return; // Kom hem
  uppdateraSamtal(dt);
  uppdateraHus(dt);
  uppdateraFolk(dt);
  uppdateraHundar(dt);
  uppdateraHandelser(dt);
  uppdateraFlygande(dt);
  uppdateraTappat(dt);
  uppdateraKamera(dt, false);

  if (klocka >= 20 * 60) {
    slutaKvallen(false);
  }
}

// =====================================================================
//  RITA
// =====================================================================

function ritaText(text, x, y, storlek, farg = "#ffffff", just = "center") {
  ctx.font = `bold ${storlek}px ${TYPSNITT}`;
  ctx.textAlign = just;
  ctx.textBaseline = "middle";
  ctx.lineJoin = "round";
  ctx.lineWidth = storlek * 0.18;
  ctx.strokeStyle = "rgba(15, 8, 30, 0.75)";
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

function ritaEmoji(bild, x, y, storlek, spegla = false, vinkel = 0) {
  const liten = emojiBild(bild, storlek);
  const sida = liten.width / pixelSkala;
  if (spegla || vinkel) {
    ctx.save();
    ctx.translate(x, y);
    if (vinkel) ctx.rotate(vinkel);
    if (spegla) ctx.scale(-1, 1);
    ctx.drawImage(liten, -sida / 2, -sida / 2, sida, sida);
    ctx.restore();
  } else {
    ctx.drawImage(liten, x - sida / 2, y - sida / 2, sida, sida);
  }
}

function skugga(x, y, rx, ry) {
  ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, VARV);
  ctx.fill();
}

// Den del av kvarteret som syns på skärmen
function synligt() {
  return {
    x0: kamX - bredd / 2 / u - 3,
    x1: kamX + bredd / 2 / u + 3,
    y0: kamY - (mittY - panelH) / u - 2,
    y1: kamY + (hojd - mittY) / u + 4,
  };
}

function ritaMarken() {
  // Skogen runt kvarteret
  ctx.fillStyle = "#0f1a14";
  ctx.fillRect(0, 0, bredd, hojd);
  ctx.fillStyle = "#223b28";
  ctx.fillRect(SX(VARLD.x0), SY(VARLD.y0), (VARLD.x1 - VARLD.x0) * u, (VARLD.y1 - VARLD.y0) * u);

  const sist = GATOR_Y[GATOR_Y.length - 1];
  const hoger = TVARGATOR_X[TVARGATOR_X.length - 1];
  // Trottoarerna
  ctx.fillStyle = "#4b4d5a";
  for (const gy of GATOR_Y) ctx.fillRect(SX(-TROTTOAR), SY(gy - TROTTOAR), (hoger + 2 * TROTTOAR) * u, 2 * TROTTOAR * u);
  for (const gx of TVARGATOR_X) ctx.fillRect(SX(gx - TROTTOAR), SY(-TROTTOAR), 2 * TROTTOAR * u, (sist + 2 * TROTTOAR) * u);
  // Gångarna fram till dörrarna
  ctx.fillStyle = "#62596b";
  for (const h of husLista) ctx.fillRect(SX(h.x - 0.45), SY(h.fram) - 1, 0.9 * u, (FRAM - TROTTOAR) * u + 2);
  // Asfalten
  ctx.fillStyle = "#2a2b35";
  for (const gy of GATOR_Y) ctx.fillRect(SX(-GATA), SY(gy - GATA), (hoger + 2 * GATA) * u, 2 * GATA * u);
  for (const gx of TVARGATOR_X) ctx.fillRect(SX(gx - GATA), SY(-GATA), 2 * GATA * u, (sist + 2 * GATA) * u);
  // Streck i mitten av gatan
  ctx.strokeStyle = "rgba(230, 220, 170, 0.35)";
  ctx.lineWidth = Math.max(2, u * 0.06);
  ctx.setLineDash([u * 0.5, u * 0.6]);
  ctx.beginPath();
  for (const gy of GATOR_Y) {
    ctx.moveTo(SX(0), SY(gy));
    ctx.lineTo(SX(hoger), SY(gy));
  }
  for (const gx of TVARGATOR_X) {
    ctx.moveTo(SX(gx), SY(0));
    ctx.lineTo(SX(gx), SY(sist));
  }
  ctx.stroke();
  ctx.setLineDash([]);
}

function ritaTrad(s) {
  const x = SX(s.x);
  const y = SY(s.y);
  const st = u * s.storlek;
  skugga(x, y, st * 0.45, st * 0.14);
  ctx.fillStyle = "#3b2618";
  ctx.fillRect(x - st * 0.09, y - st * 0.55, st * 0.18, st * 0.55);
  if (s.gran) {
    ctx.fillStyle = "#16301f";
    for (let i = 0; i < 3; i++) {
      const b = st * (0.62 - i * 0.14);
      const yy = y - st * (0.4 + i * 0.42);
      ctx.beginPath();
      ctx.moveTo(x - b, yy);
      ctx.lineTo(x + b, yy);
      ctx.lineTo(x, yy - st * 0.7);
      ctx.closePath();
      ctx.fill();
    }
  } else {
    ctx.fillStyle = "#1b3a25";
    ctx.beginPath();
    ctx.arc(x, y - st * 1.0, st * 0.55, 0, VARV);
    ctx.arc(x - st * 0.35, y - st * 0.75, st * 0.38, 0, VARV);
    ctx.arc(x + st * 0.35, y - st * 0.75, st * 0.38, 0, VARV);
    ctx.fill();
    ctx.fillStyle = "#26492f";
    ctx.beginPath();
    ctx.arc(x - st * 0.12, y - st * 1.12, st * 0.3, 0, VARV);
    ctx.fill();
  }
}

function ritaLykta(s) {
  const x = SX(s.x);
  const y = SY(s.y);
  ctx.strokeStyle = "#15161c";
  ctx.lineWidth = Math.max(2, u * 0.08);
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x, y - u * 1.7);
  ctx.stroke();
  ctx.fillStyle = "#15161c";
  ctx.fillRect(x - u * 0.14, y - u * 1.85, u * 0.28, u * 0.08);
  ctx.fillStyle = "#ffe7a0";
  ctx.fillRect(x - u * 0.1, y - u * 1.77, u * 0.2, u * 0.12);
}

function ritaDekor(s) {
  ritaEmoji(s.bild, SX(s.x), SY(s.y) - u * s.storlek * 0.4, u * s.storlek);
}

function fonsterFarg(h) {
  const sp = h.def.special;
  if (sp === "tv") {
    // Tv:n flimrar i fönstret
    const f = Math.sin(tid * 9) + Math.sin(tid * 23);
    return f > 0.6 ? "#a9c8ff" : f > -0.4 ? "#6f8fd6" : "#4a5f9e";
  }
  if (sp === "pumpa" && klocka < h.oppnar) return "#ffb347";
  if (!husOppet(h)) return "#1b2233";
  if (sp === "spok") return Math.sin(tid * 3) > 0.9 ? "#ffffff" : "#9b6bd6";
  if (sp === "choklad") return "#ffe9a0";
  return "#ffd36b";
}

function ritaHus(h) {
  const def = h.def;
  const sp = def.special;
  const x0 = SX(h.x - HUS_B / 2);
  const x1 = SX(h.x + HUS_B / 2);
  const w = x1 - x0;
  const mitt = SX(h.x);
  const bas = SY(h.fram);
  const vaggH = u * 1.9;
  const vaggTopp = bas - vaggH;
  const takTopp = SY(h.bak) - u * 0.7;

  ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
  ctx.fillRect(x0 + u * 0.15, bas - u * 0.05, w, u * 0.22);
  // Väggen
  ctx.fillStyle = h.farg;
  ctx.fillRect(x0, vaggTopp, w, vaggH);
  ctx.strokeStyle = "rgba(0, 0, 0, 0.13)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let y = vaggTopp + u * 0.24; y < bas - 1; y += u * 0.24) {
    ctx.moveTo(x0, y);
    ctx.lineTo(x1, y);
  }
  ctx.stroke();
  // Taket
  ctx.fillStyle = h.tak;
  ctx.beginPath();
  ctx.moveTo(x0 - u * 0.25, vaggTopp + u * 0.06);
  ctx.lineTo(x1 + u * 0.25, vaggTopp + u * 0.06);
  ctx.lineTo(x1 - u * 0.5, takTopp);
  ctx.lineTo(x0 + u * 0.5, takTopp);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "rgba(0, 0, 0, 0.25)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  for (let i = 1; i < 4; i++) {
    const y = vaggTopp + ((takTopp - vaggTopp) * i) / 4;
    const k = i / 4;
    ctx.moveTo(x0 - u * 0.25 + u * 0.75 * k, y);
    ctx.lineTo(x1 + u * 0.25 - u * 0.75 * k, y);
  }
  ctx.stroke();
  // Skorstenen
  ctx.fillStyle = "#4a3030";
  ctx.fillRect(x1 - u * 1.2, takTopp - u * 0.35, u * 0.35, u * 0.6);

  // Fönstren
  const ff = fonsterFarg(h);
  for (const dx of [-1.45, 1.45]) {
    const fx = SX(h.x + dx) - u * 0.42;
    const fy = vaggTopp + u * 0.38;
    ctx.fillStyle = "#2b1d0e";
    ctx.fillRect(fx - 2, fy - 2, u * 0.84 + 4, u * 0.72 + 4);
    ctx.fillStyle = ff;
    ctx.fillRect(fx, fy, u * 0.84, u * 0.72);
    ctx.fillStyle = "#2b1d0e";
    ctx.fillRect(fx + u * 0.4, fy, u * 0.04, u * 0.72);
    ctx.fillRect(fx, fy + u * 0.34, u * 0.84, u * 0.04);
  }
  // Det runda fönstret på vinden
  ctx.fillStyle = "#2b1d0e";
  ctx.beginPath();
  ctx.arc(mitt, (vaggTopp + takTopp) / 2, u * 0.26, 0, VARV);
  ctx.fill();
  ctx.fillStyle = sp === "spok" ? "#9b6bd6" : husOppet(h) ? "#e8b85a" : "#1b2233";
  ctx.beginPath();
  ctx.arc(mitt, (vaggTopp + takTopp) / 2, u * 0.2, 0, VARV);
  ctx.fill();

  // Dörren
  const dw = u * 0.85;
  const dh = u * 1.25;
  const dx = mitt - dw / 2;
  const dy = bas - dh;
  if (h.oppen > 0 || h.skrammer > 0) {
    ctx.fillStyle = sp === "spok" ? "#5b3a7a" : "#ffcf70";
    ctx.fillRect(dx, dy, dw, dh);
    if (h.skrammer > 0 && h.skrammer < 1.25) {
      // Skelettet hoppar fram!
      const upp = Math.min(1, (1.25 - h.skrammer) * 6);
      ritaEmoji("💀", mitt, dy + dh * 0.45, u * (0.6 + upp * 0.9));
    } else if (def.bild) {
      ritaEmoji(def.bild, mitt, dy + dh * 0.52, u * 0.95);
    }
    ctx.fillStyle = "#5a3520";
    ctx.fillRect(dx - dw * 0.18, dy, dw * 0.2, dh);
  } else {
    ctx.fillStyle = "#5a3520";
    ctx.fillRect(dx, dy, dw, dh);
    ctx.strokeStyle = "rgba(0, 0, 0, 0.35)";
    ctx.lineWidth = 2;
    ctx.strokeRect(dx + dw * 0.15, dy + dh * 0.1, dw * 0.7, dh * 0.35);
    ctx.strokeRect(dx + dw * 0.15, dy + dh * 0.52, dw * 0.7, dh * 0.38);
    ctx.fillStyle = "#e8c45a";
    ctx.beginPath();
    ctx.arc(dx + dw * 0.8, dy + dh * 0.55, u * 0.05, 0, VARV);
    ctx.fill();
    // En lapp på dörren
    if ((def.lapp && !husOppet(h)) || sp === "bebis" || sp === "tv") {
      ctx.fillStyle = "#fffdf2";
      ctx.fillRect(mitt - u * 0.2, dy + dh * 0.15, u * 0.4, u * 0.3);
      ctx.fillStyle = "#555";
      ctx.fillRect(mitt - u * 0.13, dy + dh * 0.22, u * 0.26, 2);
      ctx.fillRect(mitt - u * 0.13, dy + dh * 0.29, u * 0.2, 2);
    }
  }
  // Trappan
  ctx.fillStyle = "#6f6878";
  ctx.fillRect(dx - u * 0.12, bas - u * 0.08, dw + u * 0.24, u * 0.14);
  // Lampan vid dörren
  ctx.fillStyle = husOppet(h) ? "#ffe7a0" : "#3a3a44";
  ctx.beginPath();
  ctx.arc(dx - u * 0.25, dy + u * 0.2, u * 0.09, 0, VARV);
  ctx.fill();

  // Pynt
  if (fro(h.nr + 0.5) < 0.55 || sp === "spok") ritaEmoji("🕸️", x0 + u * 0.3, vaggTopp + u * 0.3, u * 0.55);
  if (sp === "spok") {
    ritaEmoji("🕸️", x1 - u * 0.3, vaggTopp + u * 0.3, u * 0.55);
    ritaEmoji("👻", x1 - u * 0.45, vaggTopp + u * 1.3, u * 0.55, false, Math.sin(tid * 2) * 0.2);
  } else if (fro(h.nr + 1.5) < 0.35 && sp !== "hem") {
    ritaEmoji("🦇", x1 - u * 0.4, vaggTopp + u * 0.25, u * 0.4);
  }
  if (sp === "hem") {
    // Hemma
    ctx.fillStyle = "#ffffff";
    rundRekt(ctx, mitt - u * 0.9, takTopp + u * 0.05, u * 1.8, u * 0.55, u * 0.15);
    ctx.fill();
    ctx.fillStyle = "#c0392b";
    ctx.font = `bold ${u * 0.36}px ${TYPSNITT}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("❤️ " + t("HEM", "HOME"), mitt, takTopp + u * 0.33, u * 1.7);
  }
  if (sp === "skal") ritaEmoji("🥣", mitt + u * 0.85, bas - u * 0.15, u * 0.5);
  if (sp === "bebis") {
    ritaEmoji("😴", mitt, dy - u * 0.25, u * 0.4);
    ritaEmoji("🛍️", mitt + u * 0.15, dy + dh * 0.65, u * 0.4);
  }
  if (sp === "maklare") {
    const sx = SX(h.x + 1.9);
    const sy = SY(h.fram + 0.6);
    ctx.fillStyle = "#3b2618";
    ctx.fillRect(sx - 2, sy - u * 0.9, 4, u * 0.9);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(sx - u * 0.55, sy - u * 1.2, u * 1.1, u * 0.45);
    ctx.fillStyle = "#c0392b";
    ctx.font = `bold ${u * 0.17}px ${TYPSNITT}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(t("TILL SALU", "FOR SALE"), sx, sy - u * 0.975, u * 1.0);
  }
  if (sp === "pumpa") {
    if (klocka >= h.oppnar) {
      for (const [px, py] of [[-1.9, 0.45], [-1.35, 0.55], [1.35, 0.55], [1.9, 0.4], [-2.05, -0.05], [2.05, -0.1]]) {
        ritaEmoji("🎃", SX(h.x + px), SY(h.fram + py), u * 0.42);
      }
    } else {
      // Skylt: öppnar klockan 19
      ctx.fillStyle = "#fffdf2";
      rundRekt(ctx, mitt - u * 0.75, dy - u * 0.6, u * 1.5, u * 0.5, u * 0.12);
      ctx.fill();
      ctx.fillStyle = "#26304a";
      ctx.font = `bold ${u * 0.32}px ${TYPSNITT}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("🕖 " + def.oppnar, mitt, dy - u * 0.35, u * 1.4);
    }
  }

  // Pumpan visar att man får godis här, bocken att man har varit här
  if (harPumpa(h)) {
    const studs = Math.abs(Math.sin(tid * 3 + h.nr)) * u * 0.06;
    ritaEmoji("🎃", mitt - u * 0.85, bas - u * 0.22 - studs, u * 0.6);
  } else if (h.besokt && sp !== "tv") {
    ctx.fillStyle = "#3bb54a";
    ctx.beginPath();
    ctx.arc(mitt, dy - u * 0.28, u * 0.22, 0, VARV);
    ctx.fill();
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = Math.max(2, u * 0.06);
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(mitt - u * 0.1, dy - u * 0.28);
    ctx.lineTo(mitt - u * 0.02, dy - u * 0.2);
    ctx.lineTo(mitt + u * 0.11, dy - u * 0.38);
    ctx.stroke();
  }
}

// ---------- Dräkterna (barnet och de andra barnen) ----------

function ritaDrakt(typ, x, y, s, o = {}) {
  const fas = o.fas || 0;
  const r = o.riktning || 1;
  const studs = o.ror ? Math.abs(Math.sin(fas)) * 0.06 : 0;
  const hopp = o.hopp > 0 ? Math.sin((o.hopp / 0.6) * Math.PI) * 0.45 : 0;
  skugga(x, y, s * 0.32, s * 0.1);
  ctx.save();
  ctx.translate(x, y - (studs + hopp) * s);
  ctx.scale(s, s);
  if (o.halkar > 0) {
    // Snurrar runt när man halkar
    ctx.translate(0, -0.45);
    ctx.rotate(((0.9 - o.halkar) / 0.9) * VARV * 1.5 * r);
    ctx.translate(0, 0.45);
  }
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  const kant = "#1a1020";
  const lw = 0.035;
  const fylld = (farg) => {
    ctx.fillStyle = farg;
    ctx.fill();
    ctx.strokeStyle = kant;
    ctx.lineWidth = lw;
    ctx.stroke();
  };
  const lyft = (i) => (o.ror ? Math.max(0, Math.sin(fas + (i > 0 ? Math.PI : 0))) * 0.08 : 0);
  const ben = (farg, sko) => {
    for (const i of [-1, 1]) {
      rundRekt(ctx, i * 0.09 - 0.05, -0.3 - lyft(i), 0.1, 0.28, 0.04);
      fylld(farg);
      ctx.beginPath();
      ctx.ellipse(i * 0.09 + r * 0.02, -0.03 - lyft(i), 0.075, 0.045, 0, 0, VARV);
      fylld(sko);
    }
  };
  const ansikte = (hy) => {
    ctx.beginPath();
    ctx.arc(0, hy, 0.17, 0, VARV);
    fylld("#f6cfa5");
    ctx.fillStyle = "#1a1020";
    ctx.beginPath();
    ctx.arc(r * 0.04 - 0.06, hy - 0.01, 0.025, 0, VARV);
    ctx.arc(r * 0.04 + 0.06, hy - 0.01, 0.025, 0, VARV);
    ctx.fill();
    ctx.strokeStyle = "#1a1020";
    ctx.lineWidth = 0.025;
    ctx.beginPath();
    ctx.arc(r * 0.04, hy + 0.05, 0.05, 0.2, Math.PI - 0.2);
    ctx.stroke();
  };
  const hink = () => {
    if (!o.hink) return;
    const hx = r * 0.37;
    const hy = -0.4;
    ctx.strokeStyle = "#1a1020";
    ctx.lineWidth = 0.03;
    ctx.beginPath();
    ctx.arc(hx, hy - 0.08, 0.12, Math.PI, 0);
    ctx.stroke();
    if (godis > 0) {
      ctx.fillStyle = "#ff5fa2";
      ctx.beginPath();
      ctx.arc(hx - 0.04, hy - 0.1, 0.05, 0, VARV);
      ctx.fill();
      ctx.fillStyle = "#5fd3ff";
      ctx.beginPath();
      ctx.arc(hx + 0.05, hy - 0.11, 0.045, 0, VARV);
      ctx.fill();
    }
    ctx.beginPath();
    ctx.moveTo(hx - 0.13, hy - 0.09);
    ctx.lineTo(hx + 0.13, hy - 0.09);
    ctx.lineTo(hx + 0.1, hy + 0.13);
    ctx.lineTo(hx - 0.1, hy + 0.13);
    ctx.closePath();
    fylld("#ff8a1f");
    ctx.fillStyle = "#4a1d00";
    ctx.beginPath();
    ctx.moveTo(hx - 0.07, hy - 0.02);
    ctx.lineTo(hx - 0.03, hy - 0.02);
    ctx.lineTo(hx - 0.05, hy - 0.05);
    ctx.moveTo(hx + 0.03, hy - 0.02);
    ctx.lineTo(hx + 0.07, hy - 0.02);
    ctx.lineTo(hx + 0.05, hy - 0.05);
    ctx.fill();
    ctx.fillRect(hx - 0.06, hy + 0.04, 0.12, 0.03);
  };

  if (typ === "spoke") {
    for (const i of [-1, 1]) {
      ctx.beginPath();
      ctx.ellipse(i * 0.1 + r * 0.02, -0.03 - lyft(i), 0.075, 0.045, 0, 0, VARV);
      fylld("#333344");
    }
    const vag = Math.sin(fas) * 0.025;
    ctx.beginPath();
    ctx.moveTo(-0.34, -0.1);
    ctx.quadraticCurveTo(-0.26, -0.02 + vag, -0.17, -0.1);
    ctx.quadraticCurveTo(-0.08, -0.02 - vag, 0, -0.1);
    ctx.quadraticCurveTo(0.08, -0.02 + vag, 0.17, -0.1);
    ctx.quadraticCurveTo(0.26, -0.02 - vag, 0.34, -0.1);
    ctx.quadraticCurveTo(0.37, -0.5, 0.3, -0.82);
    ctx.arc(0, -0.82, 0.3, 0, Math.PI, true);
    ctx.quadraticCurveTo(-0.37, -0.5, -0.34, -0.1);
    fylld("#f2f2f8");
    ctx.fillStyle = "#1a1020";
    ctx.beginPath();
    ctx.ellipse(r * 0.06 - 0.1, -0.86, 0.05, 0.075, 0, 0, VARV);
    ctx.ellipse(r * 0.06 + 0.1, -0.86, 0.05, 0.075, 0, 0, VARV);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(r * 0.05, -0.7, 0.04, 0.055, 0, 0, VARV);
    ctx.fill();
    hink();
  } else if (typ === "haxa") {
    ben("#3a2a4a", "#111111");
    ctx.beginPath();
    ctx.moveTo(-0.3, -0.24);
    ctx.lineTo(0.3, -0.24);
    ctx.lineTo(0.14, -0.7);
    ctx.lineTo(-0.14, -0.7);
    ctx.closePath();
    fylld("#6a2c91");
    hink();
    ctx.fillStyle = "#e8742a";
    ctx.fillRect(-0.21, -0.88, 0.07, 0.24);
    ctx.fillRect(0.14, -0.88, 0.07, 0.24);
    ansikte(-0.84);
    ctx.beginPath();
    ctx.ellipse(0, -0.97, 0.31, 0.07, 0, 0, VARV);
    fylld("#1b1b24");
    ctx.beginPath();
    ctx.moveTo(-0.17, -0.98);
    ctx.lineTo(0.17, -0.98);
    ctx.quadraticCurveTo(0.05, -1.2, r * 0.22, -1.42);
    ctx.quadraticCurveTo(-0.05, -1.22, -0.17, -0.98);
    fylld("#1b1b24");
    ctx.fillStyle = "#9b59d6";
    ctx.fillRect(-0.15, -1.06, 0.3, 0.05);
  } else if (typ === "pumpa") {
    ben("#2f6b2f", "#222222");
    ctx.beginPath();
    ctx.ellipse(0, -0.5, 0.37, 0.32, 0, 0, VARV);
    fylld("#ff8a1f");
    ctx.strokeStyle = "rgba(120, 50, 0, 0.5)";
    ctx.lineWidth = 0.025;
    ctx.beginPath();
    ctx.ellipse(0, -0.5, 0.14, 0.31, 0, 0, VARV);
    ctx.stroke();
    ctx.fillStyle = "#3a1c00";
    ctx.beginPath();
    for (const i of [-1, 1]) {
      ctx.moveTo(r * 0.03 + i * 0.13 - 0.06, -0.52);
      ctx.lineTo(r * 0.03 + i * 0.13 + 0.06, -0.52);
      ctx.lineTo(r * 0.03 + i * 0.13, -0.62);
    }
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(r * 0.03 - 0.17, -0.42);
    for (let i = 0; i <= 6; i++) ctx.lineTo(r * 0.03 - 0.17 + i * 0.057, i % 2 ? -0.36 : -0.42);
    ctx.lineTo(r * 0.03 + 0.12, -0.32);
    ctx.lineTo(r * 0.03 - 0.12, -0.32);
    ctx.closePath();
    ctx.fill();
    hink();
    ansikte(-0.93);
    ctx.fillStyle = "#3d7a2a";
    ctx.fillRect(-0.03, -1.17, 0.06, 0.1);
    ctx.beginPath();
    ctx.ellipse(0.08, -1.12, 0.08, 0.035, -0.4, 0, VARV);
    ctx.fill();
  } else {
    // Skelettet
    ben("#1b1b1f", "#111111");
    ctx.strokeStyle = "#f2f2ea";
    ctx.lineWidth = 0.03;
    ctx.beginPath();
    for (const i of [-1, 1]) {
      ctx.moveTo(i * 0.09, -0.28 - lyft(i));
      ctx.lineTo(i * 0.09, -0.08 - lyft(i));
    }
    ctx.stroke();
    rundRekt(ctx, -0.21, -0.74, 0.42, 0.5, 0.08);
    fylld("#1b1b1f");
    ctx.strokeStyle = "#f2f2ea";
    ctx.lineWidth = 0.035;
    ctx.beginPath();
    ctx.moveTo(0, -0.7);
    ctx.lineTo(0, -0.3);
    for (let i = 0; i < 3; i++) {
      const yy = -0.64 + i * 0.1;
      ctx.moveTo(-0.13, yy);
      ctx.quadraticCurveTo(0, yy - 0.04, 0.13, yy);
    }
    ctx.stroke();
    hink();
    ctx.beginPath();
    ctx.arc(0, -0.9, 0.19, 0, VARV);
    fylld("#f2f2ea");
    ctx.fillStyle = "#1a1020";
    ctx.beginPath();
    ctx.arc(r * 0.04 - 0.07, -0.92, 0.05, 0, VARV);
    ctx.arc(r * 0.04 + 0.07, -0.92, 0.05, 0, VARV);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(r * 0.04, -0.87);
    ctx.lineTo(r * 0.04 - 0.025, -0.82);
    ctx.lineTo(r * 0.04 + 0.025, -0.82);
    ctx.fill();
    ctx.strokeStyle = "#1a1020";
    ctx.lineWidth = 0.02;
    ctx.beginPath();
    ctx.moveTo(r * 0.04 - 0.08, -0.77);
    ctx.lineTo(r * 0.04 + 0.08, -0.77);
    for (let i = -2; i <= 2; i++) {
      ctx.moveTo(r * 0.04 + i * 0.035, -0.8);
      ctx.lineTo(r * 0.04 + i * 0.035, -0.74);
    }
    ctx.stroke();
  }
  ctx.restore();
}

function ritaBarnet() {
  ritaDrakt(drakt.typ, SX(barn.x), SY(barn.y), u, { fas: barn.gangFas, riktning: barn.riktning, ror: barn.ror, halkar: barn.halkar, hopp: barn.hopp, hink: true });
}

// ---------- Folket ----------

const FOLKBILD = { banan: "🚶‍♂️", hund: "🚶‍♀️", pudel: "🚶", tonaring: "🧍", foraldrar: "🧍‍♂️" };

function ritaFolk(p) {
  const x = SX(p.x);
  const y = SY(p.y);
  if (p.sort === "barn") {
    p.drakter.forEach((typ, i) => {
      const dx = (i - 0.5) * 0.75;
      ritaDrakt(typ, SX(p.x + dx), SY(p.y + i * 0.15), u * 0.82, { fas: p.gangFas + i, riktning: p.riktning, ror: true, hink: false });
    });
    return;
  }
  const st = u * 1.15;
  skugga(x, y, u * 0.3, u * 0.09);
  ritaEmoji(FOLKBILD[p.sort], x, y - st * 0.5, st, p.riktning > 0 && p.slinga.length > 1);
  if (p.sort === "banan") ritaEmoji("🍌", x + p.riktning * u * 0.3, y - u * 0.65, u * 0.38);
  if (p.sort === "tonaring") ritaEmoji("📱", x + u * 0.25, y - u * 0.62, u * 0.3);
  if (p.sort === "foraldrar") {
    skugga(x + u * 0.7, y + u * 0.1, u * 0.3, u * 0.09);
    ritaEmoji("🧍‍♀️", x + u * 0.7, y + u * 0.1 - st * 0.5, st);
    ritaEmoji("☕", x + u * 0.25, y - u * 0.55, u * 0.3);
  }
}

function ritaHund(d) {
  const a = d.agare;
  // Flexikopplet
  const hx = SX(a.x) + a.riktning * u * 0.2;
  const hy = SY(a.y) - u * 0.55;
  const kx = SX(d.x);
  const ky = SY(d.y) - u * 0.35;
  ctx.strokeStyle = "#d33a3a";
  ctx.lineWidth = Math.max(1.5, u * 0.035);
  ctx.beginPath();
  ctx.moveTo(hx, hy);
  ctx.quadraticCurveTo((hx + kx) / 2, Math.max(hy, ky) + u * 0.3, kx, ky);
  ctx.stroke();
  const x = SX(d.x);
  const y = SY(d.y);
  skugga(x, y, u * 0.3, u * 0.08);
  const studs = d.jagar > 0 ? Math.abs(Math.sin(d.gangFas)) * u * 0.08 : 0;
  ritaEmoji(d.bild, x, y - u * 0.32 - studs, u * 0.7, d.riktning > 0);
  if (d.bar) ritaEmoji(d.bar, x - d.riktning * u * 0.32, y - u * 0.3 - studs, u * 0.3);
  if (d.jagar > 0) ritaText("!", x, y - u * 0.95, u * 0.45, "#ffe14d");
}

// ---------- Godiset på marken och i luften ----------

function ritaTappat(g) {
  let x = g.x;
  let y = g.y;
  let hojdUpp = 0;
  if (g.fas < 1) {
    x = g.fx + (g.x - g.fx) * g.fas;
    y = g.fy + (g.y - g.fy) * g.fas;
    hojdUpp = Math.sin(g.fas * Math.PI) * 1.3 + (1 - g.fas) * 0.4;
  }
  if (g.fas >= 1 && g.kvar < 2 && Math.sin(tid * 18) < 0) return; // Blinkar innan det försvinner
  if (g.fas >= 1) skugga(SX(x), SY(y), u * 0.16, u * 0.05);
  ritaEmoji(g.bild, SX(x), SY(y) - u * (0.15 + hojdUpp), u * 0.42, false, g.vinkel);
}

function ritaFlygande() {
  const hink = hinkPlats();
  let iFickan = skrapSaker.length;
  for (const f of flygande) {
    const fickNr = f.mal === "ficka" ? iFickan++ : 0;
    if (f.vis < 0) continue;
    if (f.mal === "hund") {
      // Från hinken till hundens mun
      const d = f.hund;
      const k = f.fas;
      const mx = SX(d.x) - d.riktning * u * 0.32;
      const my = SY(d.y) - u * 0.3;
      const x = hink.x + (mx - hink.x) * k;
      const y = hink.y + (my - hink.y) * k - Math.sin(k * Math.PI) * u * 1.2;
      ritaEmoji(f.bild, x, y, u * (0.6 - k * 0.3));
      continue;
    }
    // Först syns saken stort vid dörren, sedan flyger den iväg
    const sx = SX(f.x);
    const sy = SY(f.y) - Math.sin(tid * 4 + f.x * 3) * u * 0.06;
    const stor = u * 0.8;
    if (f.vis < S.visaGodis) {
      const pop = Math.min(1, f.vis / 0.25);
      const studs = pop < 1 ? Math.sin(pop * Math.PI) * 0.25 : 0;
      ritaEmoji(f.bild, sx, sy + (1 - pop) * u * 0.8, stor * (pop * 0.9 + 0.1 + studs));
      continue;
    }
    const mal = f.mal === "ficka" ? fickPlats(fickNr) : { x: hink.x, y: hink.y, storlek: u * 0.4 };
    const k = f.fas * f.fas * (3 - 2 * f.fas); // Mjuk start och mjuk landning
    const x = sx + (mal.x - sx) * k;
    const y = sy + (mal.y - sy) * k - Math.sin(k * Math.PI) * u * 1.2;
    ritaEmoji(f.bild, x, y, stor + (mal.storlek - stor) * k);
  }
}

// De konstiga sakerna man har fått ligger i ryggsäcken uppe till vänster
function ritaFickan() {
  if (!skrapSaker.length && !flygande.some((f) => f.mal === "ficka" && f.fas > 0)) return;
  const p = fickPlats(-1);
  ritaEmoji("🎒", p.x, p.y, p.storlek * (1 + fickStuds * 0.15));
  skrapSaker.forEach((sak, i) => {
    const q = fickPlats(i);
    ritaEmoji(sak, q.x, q.y, q.storlek * 0.9);
  });
}

// ---------- Mörkret och ljuset ----------

function ritaNatten(syn) {
  // Det blir mörkare ju senare det blir. Runt barnet är det ljusare.
  const sen = (klocka - 18 * 60) / 120;
  const bx = SX(barn.x);
  const by = SY(barn.y) - u * 0.5;
  const mork = ctx.createRadialGradient(bx, by, u * 2.2, bx, by, Math.max(bredd, hojd) * 0.8);
  mork.addColorStop(0, "rgba(10, 5, 35, 0)");
  mork.addColorStop(1, `rgba(10, 5, 35, ${0.4 + sen * 0.2})`);
  ctx.fillStyle = mork;
  ctx.fillRect(0, 0, bredd, hojd);

  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  const glod = (x, y, r, farg, styrka) => {
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, `rgba(${farg}, ${styrka})`);
    g.addColorStop(1, `rgba(${farg}, 0)`);
    ctx.fillStyle = g;
    ctx.fillRect(x - r, y - r, r * 2, r * 2);
  };
  for (const l of lyktor) {
    if (l.x < syn.x0 || l.x > syn.x1 || l.y < syn.y0 || l.y > syn.y1) continue;
    glod(SX(l.x), SY(l.y) - u * 1.7, u * 1.3, "255, 220, 140", 0.35);
    glod(SX(l.x), SY(l.y) - u * 0.2, u * 2, "255, 210, 130", 0.12);
  }
  for (const h of husLista) {
    if (h.x < syn.x0 - 3 || h.x > syn.x1 + 3 || h.fram < syn.y0 || h.fram > syn.y1) continue;
    if (harPumpa(h)) glod(SX(h.x) - u * 0.85, SY(h.fram) - u * 0.25, u * (0.9 + Math.sin(tid * 7 + h.nr) * 0.06), "255, 150, 40", 0.4);
    if (husOppet(h) || h.def.special === "tv") {
      const tv = h.def.special === "tv";
      for (const dx of [-1.45, 1.45]) glod(SX(h.x + dx), SY(h.fram) - u * 1.15, u * 0.9, tv ? "120, 160, 255" : "255, 200, 110", 0.16);
    }
    if (h.oppen > 0) glod(SX(h.x), SY(h.fram) - u * 0.4, u * 1.4, "255, 200, 110", 0.25);
  }
  ctx.restore();
}

// ---------- Bubblor och texter ----------

function bubbelStorlek() {
  return begr(u * 0.36, 17, 26);
}

function ritaPratbubbla(text, x, y) {
  const storlek = bubbelStorlek();
  ctx.font = `bold ${storlek}px ${TYPSNITT}`;
  const rader = radbryt(text, Math.min(bredd * 0.7, storlek * 13));
  const w = Math.max(...rader.map((r) => ctx.measureText(r).width)) + storlek * 1.2;
  const h = rader.length * storlek * 1.25 + storlek * 0.6;
  const vanster = begr(x - w / 2, 8, bredd - w - 8);
  const topp = begr(y - h - storlek * 0.5, panelH + 4, hojd - h - 8);
  ctx.fillStyle = "#ffffff";
  ctx.strokeStyle = "#1a1020";
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
  ctx.fillStyle = "#1a1020";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  rader.forEach((r, i) => ctx.fillText(r, vanster + w / 2, topp + storlek * 0.3 + storlek * 1.25 * (i + 0.5)));
}

function bubbelPlats(a) {
  if (a === barn) return { x: SX(barn.x), y: SY(barn.y) - u * 1.45 };
  if (a.fram !== undefined) return { x: SX(a.x), y: SY(a.fram) - u * 1.6 };
  return { x: SX(a.x), y: SY(a.y) - u * 1.35 };
}

function ritaTexter() {
  for (const tx of texter) {
    const storlek = Math.max(18, u * (tx.stor ? 0.45 : 0.32));
    ctx.font = `bold ${storlek}px ${TYPSNITT}`;
    const halv = ctx.measureText(tx.text).width / 2 + 8;
    ctx.globalAlpha = begr(tx.kvar * 1.5, 0, 1);
    ritaText(tx.text, begr(SX(tx.x), halv, bredd - halv), Math.max(panelH + storlek, SY(tx.y)), storlek, tx.farg || "#ffffff");
  }
  ctx.globalAlpha = 1;
}

// Pilar vid kanten som visar var de närmaste husen med pumpor är
function ritaPilar() {
  const lista = husLista
    .filter(harPumpa)
    .map((h) => ({ h, d: Math.hypot(h.x - barn.x, h.fram - barn.y) }))
    .sort((a, b) => a.d - b.d)
    .slice(0, 3);
  const r = Math.max(20, u * 0.42);
  for (const { h } of lista) {
    const sx = SX(h.x - 0.85);
    const sy = SY(h.fram) - u * 0.3;
    const kant = r + 6;
    const x0 = kant;
    const x1 = bredd - kant;
    const y0 = panelH + kant;
    const y1 = hojd - marginal.botten - kant;
    if (sx > x0 && sx < x1 && sy > y0 && sy < y1) continue;
    const ex = begr(sx, x0, x1);
    const ey = begr(sy, y0, y1);
    const vinkel = Math.atan2(sy - ey, sx - ex);
    ctx.globalAlpha = 0.85;
    ctx.fillStyle = "rgba(20, 10, 40, 0.75)";
    ctx.beginPath();
    ctx.arc(ex, ey, r, 0, VARV);
    ctx.fill();
    ctx.fillStyle = "#ffb347";
    ctx.beginPath();
    ctx.moveTo(ex + Math.cos(vinkel) * (r + 9), ey + Math.sin(vinkel) * (r + 9));
    ctx.lineTo(ex + Math.cos(vinkel + 0.5) * r, ey + Math.sin(vinkel + 0.5) * r);
    ctx.lineTo(ex + Math.cos(vinkel - 0.5) * r, ey + Math.sin(vinkel - 0.5) * r);
    ctx.fill();
    ritaEmoji("🎃", ex, ey, r * 1.1);
    ctx.globalAlpha = 1;
  }
}

// ---------- Panelen högst upp: hinken och klockan ----------

const HINK_MAX = Math.ceil(S.stjarnor[2] / (1 - S.skatt) * 1.15);
// Hur mycket man behöver i hinken (före skatten) för varje stjärna
const HINK_STJARNOR = S.stjarnor.map((n) => Math.ceil(n / (1 - S.skatt)));
const GODISPRICKAR = Array.from({ length: 60 }, (_, i) => ({ x: fro(i * 3.1), y: fro(i * 7.7), f: ["#ff5fa2", "#5fd3ff", "#ffe14d", "#8be36b", "#c18bff", "#ff8a4d"][i % 6] }));

function ritaHink(cx, cy, hh) {
  const studs = 1 + hinkStuds * 0.08;
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(studs, studs);
  const toppY = -hh * 0.36;
  const bottenY = hh * 0.44;
  const wT = hh * 0.5;
  const wB = hh * 0.38;
  const form = () => {
    ctx.beginPath();
    ctx.moveTo(-wT, toppY);
    ctx.lineTo(wT, toppY);
    ctx.lineTo(wB, bottenY - hh * 0.08);
    ctx.quadraticCurveTo(wB, bottenY, wB - hh * 0.08, bottenY);
    ctx.lineTo(-wB + hh * 0.08, bottenY);
    ctx.quadraticCurveTo(-wB, bottenY, -wB, bottenY - hh * 0.08);
    ctx.closePath();
  };
  // Handtaget
  ctx.strokeStyle = "#c9c2d8";
  ctx.lineWidth = Math.max(3, hh * 0.06);
  ctx.beginPath();
  ctx.ellipse(0, toppY, wT * 0.85, hh * 0.25, 0, Math.PI, 0);
  ctx.stroke();
  // Godiset i hinken
  const niva = Math.min(1, godis / HINK_MAX);
  ctx.save();
  form();
  ctx.clip();
  ctx.fillStyle = "#3a1a08";
  ctx.fillRect(-wT, toppY, wT * 2, bottenY - toppY);
  const hojdG = (bottenY - toppY) * niva;
  if (hojdG > 0) {
    ctx.fillStyle = "#ff5fa2";
    ctx.fillRect(-wT, bottenY - hojdG, wT * 2, hojdG);
    for (const p of GODISPRICKAR) {
      const py = bottenY - p.y * hojdG;
      ctx.fillStyle = p.f;
      ctx.beginPath();
      ctx.arc(-wT + p.x * wT * 2, py, hh * 0.06, 0, VARV);
      ctx.fill();
    }
  }
  // Pumpans ansikte syns lite genom godiset
  ctx.fillStyle = "rgba(255, 138, 31, 0.35)";
  ctx.fillRect(-wT, toppY, wT * 2, bottenY - toppY);
  ctx.restore();
  form();
  ctx.strokeStyle = "#ff8a1f";
  ctx.lineWidth = Math.max(3, hh * 0.07);
  ctx.stroke();
  // Strecken för stjärnorna
  const stSt = Math.max(12, hh * 0.2);
  HINK_STJARNOR.forEach((n, i) => {
    const y = bottenY - (bottenY - toppY) * Math.min(1, n / HINK_MAX);
    const nadd = godis >= n;
    ctx.strokeStyle = nadd ? "#ffe14d" : "rgba(255, 255, 255, 0.6)";
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(-wT * 0.9, y);
    ctx.lineTo(wT * 0.95, y);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.globalAlpha = nadd ? 1 : 0.4;
    ritaEmoji("⭐", wT + stSt * 0.55 + i * stSt * 0.15, y, stSt);
    ctx.globalAlpha = 1;
  });
  // Full hink: godiset sticker upp över kanten
  if (godis > HINK_MAX) {
    const extra = Math.min(6, Math.ceil((godis - HINK_MAX) / 5));
    for (let i = 0; i < extra; i++) ritaEmoji(GODISBILDER[i % GODISBILDER.length], -wT * 0.6 + (i % 3) * wT * 0.6, toppY - hh * 0.06 - Math.floor(i / 3) * hh * 0.16, hh * 0.24);
  }
  ctx.restore();
  // Hur mycket godis
  ritaText(String(godis), cx, cy + hh * 0.06, Math.max(22, hh * 0.42), "#ffffff");
}

function ritaKlocka(hoger, cy, storlek) {
  const sen = klocka >= 19 * 60 + 50;
  const farg = sen ? (Math.sin(tid * 8) > 0 ? "#ff6b5a" : "#ffffff") : "#ffffff";
  const text = klockText(klocka);
  ctx.font = `bold ${storlek}px ${TYPSNITT}`;
  const tw = ctx.measureText("20:00").width;
  ritaText(text, hoger, cy, storlek, farg, "right");
  // En riktig klocka bredvid, om det får plats
  if (bredd < 460) return;
  const r = storlek * 0.75;
  const kx = hoger - tw - r - storlek * 0.4;
  ctx.fillStyle = "#fffdf2";
  ctx.strokeStyle = sen ? "#ff6b5a" : "#1a1020";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(kx, cy, r, 0, VARV);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#1a1020";
  for (let i = 0; i < 12; i++) {
    const v = (i / 12) * VARV;
    ctx.fillRect(kx + Math.cos(v) * r * 0.8 - 1.5, cy + Math.sin(v) * r * 0.8 - 1.5, 3, 3);
  }
  const visare = (andel, langd, bred) => {
    const v = andel * VARV - Math.PI / 2;
    ctx.lineWidth = bred;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(kx, cy);
    ctx.lineTo(kx + Math.cos(v) * r * langd, cy + Math.sin(v) * r * langd);
    ctx.stroke();
  };
  // Den röda tårtbiten visar tiden som är kvar till klockan 20
  const nuV = (((klocka / 60) % 12) / 12) * VARV - Math.PI / 2;
  const slutV = (8 / 12) * VARV - Math.PI / 2;
  if (slutV > nuV) {
    ctx.fillStyle = "rgba(255, 107, 90, 0.45)";
    ctx.beginPath();
    ctx.moveTo(kx, cy);
    ctx.arc(kx, cy, r * 0.92, nuV, slutV);
    ctx.closePath();
    ctx.fill();
  }
  ctx.strokeStyle = "#1a1020";
  visare(((klocka / 60) % 12) / 12, 0.5, 4);
  visare((klocka % 60) / 60, 0.78, 2.5);
}

function ritaPanel() {
  const band = ctx.createLinearGradient(0, 0, 0, panelH);
  band.addColorStop(0, "rgba(20, 8, 40, 0.88)");
  band.addColorStop(1, "rgba(20, 8, 40, 0.6)");
  ctx.fillStyle = band;
  ctx.fillRect(0, 0, bredd, panelH);
  const hink = hinkPlats();
  ritaHink(hink.x, hink.y, (panelH - marginal.topp) * 0.8);
  ritaFickan();
  const storlek = begr(u * 0.55, 24, 40);
  ritaKlocka(bredd - marginal.hoger - 14, hink.y, storlek);
}

function ritaTips() {
  if (!tips) return;
  const storlek = bubbelStorlek();
  ctx.font = `bold ${storlek}px ${TYPSNITT}`;
  const rader = radbryt(tips.text, Math.min(bredd - 48, storlek * 22));
  const w = Math.max(...rader.map((r) => ctx.measureText(r).width)) + storlek * 1.4;
  const h = rader.length * storlek * 1.3 + storlek * 0.7;
  const y = panelH + 10;
  ctx.globalAlpha = begr(tips.kvar * 2, 0, 1);
  ctx.fillStyle = tips.sms ? "#ffffff" : "rgba(20, 8, 40, 0.85)";
  rundRekt(ctx, bredd / 2 - w / 2, y, w, h, storlek * 0.6);
  ctx.fill();
  if (tips.sms) {
    ctx.strokeStyle = "#5fa8ff";
    ctx.lineWidth = 3;
    ctx.stroke();
  }
  ctx.fillStyle = tips.sms ? "#1a1020" : "#ffffff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  rader.forEach((r, i) => ctx.fillText(r, bredd / 2, y + storlek * 0.35 + storlek * 1.3 * (i + 0.5)));
  ctx.globalAlpha = 1;
  return y + h;
}

function ritaLapp(topp) {
  const storlek = begr(u * 0.36, 17, 26);
  ctx.font = `${storlek}px ${HANDSTIL}`;
  const maxB = Math.min(bredd - 60, storlek * 16);
  const rader = radbryt(lapp.text, maxB);
  const w = Math.max(...rader.map((r) => ctx.measureText(r).width)) + storlek * 2;
  const h = rader.length * storlek * 1.35 + storlek * 1.4;
  ctx.save();
  ctx.globalAlpha = Math.min(1, lapp.kvar * 2);
  ctx.translate(bredd / 2, topp + h / 2);
  ctx.rotate(lapp.vinkel);
  ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
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
function ritaToast(ts) {
  const storlek = begr(u * 0.34, 16, 24);
  ctx.font = `bold ${storlek}px ${TYPSNITT}`;
  const w = Math.min(bredd - 24, Math.max(ctx.measureText("🏆 " + ts.namn).width, ctx.measureText(ts.text).width * 0.8) + storlek * 2.5);
  const h = storlek * 3.2;
  const framme = Math.min(1, (4.5 - ts.kvar) * 4, ts.kvar * 3);
  const y = hojd - marginal.botten - 16 - h * framme;
  ctx.globalAlpha = begr(framme, 0, 1);
  ctx.fillStyle = "rgba(30, 12, 50, 0.92)";
  rundRekt(ctx, bredd / 2 - w / 2, y, w, h, storlek * 0.8);
  ctx.fill();
  ctx.strokeStyle = "#ffb347";
  ctx.lineWidth = 2.5;
  ctx.stroke();
  ctx.fillStyle = "#ffb347";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("🏆 " + ts.namn, bredd / 2, y + h * 0.33, w - storlek);
  ctx.fillStyle = "#ffffff";
  ctx.font = `${storlek * 0.8}px ${TYPSNITT}`;
  ctx.fillText(ts.text, bredd / 2, y + h * 0.68, w - storlek);
  ctx.globalAlpha = 1;
}

// ---------- Start- och slutskärmen ----------

// En rad med kort, ett för varje dräkt. Svarar med var nästa rad ska börja.
function ritaDraktkort(topp, maxHojd) {
  const lista = S.drakter;
  const mellan = 10;
  const kw = Math.min(150, (bredd - 32 - mellan * (lista.length - 1)) / lista.length);
  const kh = Math.min(maxHojd, kw * 1.3);
  const total = kw * lista.length + mellan * (lista.length - 1);
  let x = bredd / 2 - total / 2;
  const ts = begr(kw * 0.15, 13, 20);
  lista.forEach((d, i) => {
    const vald = i === valdDrakt;
    ctx.fillStyle = vald ? "rgba(255, 179, 71, 0.95)" : "rgba(255, 255, 255, 0.16)";
    rundRekt(ctx, x, topp, kw, kh, 16);
    ctx.fill();
    if (vald) {
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 3;
      ctx.stroke();
    }
    const st = Math.min(kw * 0.62, kh * 0.55);
    ritaDrakt(d.typ, x + kw / 2, topp + kh * 0.72, st, { fas: tid * 6, ror: vald, riktning: 1, hink: true });
    ctx.font = `bold ${ts}px ${TYPSNITT}`;
    ctx.fillStyle = vald ? "#2b1d0e" : "#ffffff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(d.namn, x + kw / 2, topp + kh - ts * 0.9, kw - 8);
    startKnappar.push({ x, y: topp, w: kw, h: kh, i });
    x += kw + mellan;
  });
  return topp + kh + 14;
}

function ritaSkarmar() {
  startKnappar = [];
  if (lage === "spelar" || lage === "paus") return;
  const ts = Math.min(bredd, hojd) / 14; // Textstorlek
  const mitt = bredd / 2;
  const lag = hojd < 520; // Telefon på bredden: mindre plats

  ctx.fillStyle = "rgba(15, 6, 30, 0.72)";
  ctx.fillRect(0, 0, bredd, hojd);
  let y = marginal.topp + Math.max(ts * 1.6, hojd * 0.08, 68 + ts * 0.9);
  const rad = (text, storlek, farg) => {
    ctx.font = `bold ${storlek}px ${TYPSNITT}`;
    for (const r of radbryt(text, bredd - 40)) {
      const ryms = (bredd - 32) / ctx.measureText(r).width;
      ritaText(r, mitt, y, ryms < 1 ? storlek * ryms : storlek, farg);
      y += storlek * 1.35;
    }
    y += storlek * 0.1;
  };
  const stjarnor = (st) => "⭐".repeat(st) + "☆".repeat(3 - st);
  const liten = Math.max(15, ts * 0.5); // Små texter blir aldrig mindre än så här

  if (lage === "start") {
    rad("🎃 " + t("Bus eller godis", "Trick or Treat") + (bredd > 520 ? " 🎃" : ""), ts * (lag ? 1.05 : 1.3), "#ffb347");
    if (!lag) rad(t("Välj dräkt", "Choose your costume"), ts * 0.65, "#ffffff");
    y = ritaDraktkort(y - ts * 0.2, lag ? hojd * 0.32 : hojd * 0.26);
    rad(drakt.text, ts * 0.55, "#ffffff");
    rad(t("Samla godis 18–20. Ring på där det lyser 🎃", "Collect candy from 6 to 8 pm. Knock where you see a 🎃"), liten, "#d5def0");
    if (!lag) rad(t("Akta bananskal 🍌 och hundar 🐕", "Watch out for banana peels 🍌 and dogs 🐕"), liten, "#d5def0");
    // Knappen
    const kh = ts * 1.3;
    const kt = "▶ " + t("Ut och knacka!", "Go trick-or-treating!");
    ctx.font = `bold ${ts * 0.7}px ${TYPSNITT}`;
    const kw = Math.min(bredd - 32, ctx.measureText(kt).width + ts * 1.6);
    const ky = y + ts * 0.1;
    ctx.fillStyle = "#ffb347";
    rundRekt(ctx, mitt - kw / 2, ky, kw, kh, kh / 2);
    ctx.fill();
    ctx.fillStyle = "#2b1d0e";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(kt, mitt, ky + kh / 2, kw - ts * 0.6);
    startKnappar.push({ x: mitt - kw / 2, y: ky, w: kw, h: kh, start: true });
    y = ky + kh + ts * 0.6;
    if (rekord > 0) rad(t("Rekord: ", "High score: ") + rekord + " 🍬", ts * 0.55, "#d5def0");
  }

  if (lage === "slut" && resultat) {
    const r = resultat;
    const procent = Math.round(S.skatt * 100);
    rad(r.hemma ? t("Hemma! 🏠", "Home! 🏠") : t("Klockan är 20! Dags att gå hem 🕗", "It's 8 o'clock! Time to go home 🕗"), ts * (lag ? 0.85 : 1.05), "#ffb347");
    rad(t(`Du samlade ${r.samlat} godis 🍬 i ${r.hus} hus`, `You collected ${r.samlat} candies 🍬 from ${r.hus} houses`), ts * 0.75);
    if (r.saker.length && !lag) rad(t("Och: ", "And: ") + r.saker.join(" "), ts * 0.6, "#d5def0");
    if (!lag && hojd > 700) for (const k of r.kommentarer) rad(k, liten, "#d5def0");
    if (tidSedanSlut > 1.2) {
      const visat = Math.min(r.skatt, Math.round(r.skatt * (tidSedanSlut - 1.2)));
      rad(t(`👨 Föräldraskatt ${procent} %: −${visat} 🍬`, `👨 Parent tax ${procent}%: −${visat} 🍬`), ts * 0.7, "#ffb3b3");
      rad(t("Pappa: ", "Dad: ") + "\"" + r.pappa + "\"", liten, "#ffd6d6");
    }
    if (tidSedanSlut > 2.4) {
      rad(t(`Kvar till dig: ${r.kvar} 🍬`, `Yours to keep: ${r.kvar} 🍬`), ts * 0.9, "#ffe14d");
      rad(stjarnor(r.stjarnor) + "  " + S.betyg[r.stjarnor], ts * 0.7);
      rad(r.nyttRekord ? t("🏆 Nytt rekord! 🏆", "🏆 New high score! 🏆") : t("Rekord: ", "High score: ") + rekord + " 🍬", ts * 0.55, "#d5def0");
      if (fatt.size && !lag) rad("🏆 " + [...fatt].map((k) => S.utmarkelser[k].namn).join(" · "), liten, "#d5def0");
    }
    if (tidSedanSlut > 3.5) rad(t("Tryck för att gå ut igen", "Tap to go out again"), ts * 0.65);
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
  const iBild = (x, y) => x > syn.x0 && x < syn.x1 && y > syn.y0 && y < syn.y1;

  for (const s of dekor) {
    if (s.mark && iBild(s.x, s.y)) ritaEmoji(s.bild, SX(s.x), SY(s.y), u * s.storlek, false, s.vinkel);
  }
  for (const b of bananer) {
    if (iBild(b.x, b.y)) ritaEmoji("🍌", SX(b.x), SY(b.y) - u * 0.1, u * 0.5, false, b.vinkel);
  }
  for (const g of tappat) {
    if (g.fas >= 1 && iBild(g.x, g.y)) ritaTappat(g);
  }

  // Det som står längre bort ritas först, så att det närmare hamnar framför
  const lista = [];
  for (const h of husLista) if (iBild(h.x, h.fram) || iBild(h.x - HUS_B / 2, h.fram) || iBild(h.x + HUS_B / 2, h.fram)) lista.push([h.fram, () => ritaHus(h)]);
  for (const s of trad) if (iBild(s.x, s.y)) lista.push([s.y, () => ritaTrad(s)]);
  for (const s of lyktor) if (iBild(s.x, s.y)) lista.push([s.y, () => ritaLykta(s)]);
  for (const s of dekor) if (!s.mark && iBild(s.x, s.y)) lista.push([s.y, () => ritaDekor(s)]);
  for (const p of folk) if (iBild(p.x, p.y)) lista.push([p.y, () => ritaFolk(p)]);
  for (const d of hundar) if (iBild(d.x, d.y)) lista.push([d.y, () => ritaHund(d)]);
  lista.push([barn.y, ritaBarnet]);
  lista.sort((a, b) => a[0] - b[0]);
  for (const [, ritaDen] of lista) ritaDen();

  for (const g of tappat) {
    if (g.fas < 1) ritaTappat(g);
  }
  ritaNatten(syn);
  for (const f of fladdermoss) {
    ritaEmoji("🦇", f.x, f.y + Math.sin(f.fas) * 6, u * 0.45, f.riktning > 0);
  }
  if (vind) {
    for (const l of vind.lov) ritaEmoji("🍂", l.x, l.y, u * 0.4, false, l.vinkel);
  }
  ritaTexter();
  if (lage === "spelar") ritaPilar();
  for (const b of bubblor) {
    const p = bubbelPlats(b.agare);
    ctx.globalAlpha = Math.min(1, b.kvar * 3);
    ritaPratbubbla(b.text, p.x, p.y);
    ctx.globalAlpha = 1;
  }
  ctx.restore();

  if (lage === "spelar" || lage === "paus") {
    ritaPanel();
    ritaFlygande();
    const under = ritaTips() || panelH + 10;
    if (lapp) ritaLapp(under + 16);
    if (toaster.length) ritaToast(toaster[0]);
  }
  ritaSkarmar();
}

// ---------- Spel-loopen: körs ungefär 60 gånger per sekund ----------

let forraTiden = performance.now();
function loop(nu) {
  const dt = Math.min(0.05, (nu - forraTiden) / 1000);
  forraTiden = nu;
  kollaFart(dt);
  uppdatera(dt);
  rita();
  schemalaggMusik();
  requestAnimationFrame(loop);
}

// ---------- Ljud (skapas direkt i webbläsaren, inga ljudfiler behövs) ----------

let ljudmotor = null;
function startaLjud() {
  // iPad/iPhone tillåter bara ljud efter att man tryckt på skärmen
  if (!S.ljud) return;
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
    const start = ljudmotor.currentTime + sen;
    const ton = ljudmotor.createOscillator();
    const styrka = ljudmotor.createGain();
    ton.type = typ;
    ton.frequency.setValueAtTime(fran, start);
    ton.frequency.exponentialRampToValueAtTime(till, start + langd);
    styrka.gain.setValueAtTime(volym, start);
    styrka.gain.exponentialRampToValueAtTime(0.001, start + langd);
    ton.connect(styrka);
    styrka.connect(ljudmotor.destination);
    ton.start(start);
    ton.stop(start + langd);
  } catch (e) {
    // Inget ljud – spelet fungerar ändå
  }
}

function spelaArpeggio(toner) {
  toner.forEach((f, i) => spelaTon(f, f, 0.18, "triangle", 0.09, i * 0.09));
}

// Ding-dong!
function spelaRingklocka() {
  spelaTon(880, 880, 0.45, "sine", 0.12);
  spelaTon(698, 698, 0.7, "sine", 0.12, 0.32);
}

// ---------- Bakgrundsmusiken ----------
//
//  Varje siffra är en ton (60 = mellersta C, 62 = D, 64 = E ...).
//  null betyder paus. Ändra siffrorna för att göra en egen melodi!

const MUSIK = {
  kvall: {
    steg: 0.26, // Sekunder per ton – lägre = snabbare
    melodi: [69, null, 72, 76, 75, null, 72, null, 69, null, 71, 72, 71, null, 68, null,
             69, null, 72, 76, 77, null, 76, null, 74, 72, 71, null, 69, null, null, null],
    bas: [45, 52, 45, 52, 41, 48, 40, 47, 45, 52, 45, 52, 41, 48, 40, 44],
  },
  brattom: {
    steg: 0.17,
    melodi: [69, 72, 76, 72, 75, 72, 76, 72, 69, 72, 76, 79, 77, 76, 74, 71],
    bas: [45, 52, 45, 52, 40, 47, 40, 47],
  },
};

let musikPa = S.musik && lasInstallning("musik-godis") !== "av";
let musikSteg = 0;
let musikNastaTid = 0;

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
  const latt = klocka >= 19 * 60 + 45 ? MUSIK.brattom : MUSIK.kvall;
  const nu = ljudmotor.currentTime;
  if (musikNastaTid < nu) musikNastaTid = nu + 0.05;
  try {
    while (musikNastaTid < nu + 0.25) {
      const i = musikSteg % latt.melodi.length;
      const not = latt.melodi[i];
      if (not) spelaNot(not, musikNastaTid, latt.steg * 1.4, "triangle", 0.04);
      if (i % 2 === 0) {
        const bas = latt.bas[(i / 2) % latt.bas.length];
        if (bas) spelaNot(bas, musikNastaTid, latt.steg * 2.2, "sine", 0.06);
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
  return Number(lasInstallning("rekord-godis")) || 0;
}

function sparaRekord(varde) {
  sparaInstallning("rekord-godis", String(varde));
}

// ---------- Kör igång ----------

visaMusikKnapp();
byggKvarteret();
{
  const hem = husLista.find((h) => h.def.special === "hem");
  barn = nyttBarn(hem.x, hem.fram + 0.9);
}
anpassaStorlek();
requestAnimationFrame(loop);
