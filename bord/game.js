// =====================================================================
//  BORDSPLACERINGEN
//
//  Mormor fyller 80 och hela släkten kommer. Dra gästerna till stolarna
//  så att alla blir nöjda. Listan "Gästernas önskemål" visar vad gästerna
//  vill, och önskemålen blir gröna när det stämmer. Vid bordet syns 😊
//  eller 😟 på varje gäst. Tryck på "Servera!" när alla sitter, så får
//  man se hur många stjärnor det blev.
//
//  ⭐     Alla sitter vid bordet.
//  ⭐⭐   Alla önskemål stämmer.
//  ⭐⭐⭐ Någon har dessutom en hemlig önskan. Titta efter tankebubblor!
//        (Den hemliga önskan syns först när man har klarat banan en gång.)
//
//  Spelet har två lager:
//  - Barnen löser pusslet med bilderna. Man ska aldrig behöva läsa något
//    för att klara en bana.
//  - De vuxna får lite extra i det gästerna säger.
//  Skämten för vuxna handlar om vuxnas fåniga vanor (pärmar, surdegar,
//  wifi, att ge råd om allt), aldrig om vuxna saker. Allt som står ska gå
//  att läsa högt för en sjuåring vid middagsbordet.
//
//  Börja med att ändra i INSTALLNINGAR här nedanför.
//
//  All text finns på svenska och engelska. Den skrivs så här:
//    t("svenska", "English")
//  (Döp därför aldrig en egen variabel till bara t.)
// =====================================================================

const INSTALLNINGAR = {
  ljud: true,
  musik: true,          // Mysig musik i bakgrunden. Melodierna finns längst ner i game.js (MUSIK).
  visaGrona: true,      // Önskemålen blir gröna (eller röda) direkt. Sätt till false för ett svårare spel.
  tankeVarje: 5,        // Sekunder mellan tankebubblorna som visar den hemliga önskan
  mormorFragor: 2,      // Hur många gånger man får fråga mormor på varje bana

  // ---------------------------------------------------------------
  //  GÄSTERNA
  //
  //  ansikte = hur gästen ser ut
  //  sak     = den lilla bilden som gör att man känner igen gästen
  //  troja   = färgen runt ansiktet
  //  om      = vem gästen är (visas när man trycker på gästen)
  //  prat    = något som gästen kan säga
  // ---------------------------------------------------------------
  folk: {
    mormor: {
      namn: t("Mormor", "Grandma"), ansikte: "👵", sak: "💐", troja: "#c0392b",
      om: t("Fyller 80 i dag!", "Turns 80 today!"),
      prat: [
        t("Jag sa ju att jag inte ville ha några presenter.", "I said I didn't want any presents."),
        t("Ät nu, det finns mer i köket!", "Eat up, there's more in the kitchen!"),
        t("Jag sa ju att jag inte ville ha något kalas.", "I said I didn't want a party."),
        t("Jag ville inte ha någon tårta. Men en liten bit då.", "I didn't want any cake. Well, just a small piece."),
      ],
    },
    morfar: {
      namn: t("Morfar", "Grandpa"), ansikte: "👴", sak: "🔭", troja: "#2e86c1",
      om: t("Tittar på fåglar.", "Watches birds."),
      prat: [
        t("Där! En talgoxe!", "Look! A robin!"),
        t("Jag vilar bara ögonen.", "I'm just resting my eyes."),
        t("VA? JAG HÖR INTE VAD DU SÄGER!", "WHAT? I CAN'T HEAR YOU!"),
      ],
    },
    bengt: {
      namn: t("Morbror Bengt", "Uncle Bengt"), ansikte: "👨‍🦳", sak: "📁", troja: "#7f8c8d",
      om: t("Har en pärm om allt.", "Has a binder about everything."),
      prat: [
        t("Jag har gjort en tabell.", "I've made a spreadsheet."),
        t("Det finns en pärm om det.", "There's a binder about that."),
        t("Jag har en pärm om sill också.", "I have a binder about herring too."),
        t("Gäddan var SÅ här stor!", "The pike was THIS big!"),
        t("Mamma, du är som en fin ost. Bättre med åren!", "Mum, you're like a fine cheese. Better with age!"),
        t("Vänta, var är sidan 7?", "Wait, where's page 7?"),
      ],
    },
    eva: {
      namn: t("Moster Eva", "Aunt Eva"), ansikte: "👩‍🦰", sak: "👟", troja: "#e67e22",
      om: t("Springer överallt.", "Runs everywhere."),
      prat: [
        t("Jag sprang hit. Det var bara tre mil.", "I ran here. It was only twenty miles."),
        t("Har ni provat att bada i is?", "Have you tried ice baths?"),
        t("Fint tal, Bengt. Lite långt bara.", "Nice speech, Bengt. Just a bit long."),
        t("Mamma gillar MIG mest!", "Mum likes ME best!"),
        t("Mitt tal blir kortare än Bengts. Det är inte en tävling.", "My speech will be shorter than Bengt's. It's not a competition."),
      ],
    },
    kerstin: {
      namn: t("Grannen Kerstin", "Kerstin next door"), ansikte: "👩‍🦳", sak: "🔌", troja: "#16a085",
      om: t("Har köpt en elbil.", "Just bought an electric car."),
      prat: [
        t("Den är tyst som en mus.", "It's quiet as a mouse."),
        t("Har jag berättat att jag har elbil?", "Did I mention I have an electric car?"),
        t("Den laddar sig själv på natten. Nästan.", "It charges itself overnight. Almost."),
      ],
    },
    sven: {
      namn: t("Grannen Sven", "Sven next door"), ansikte: "🧓", sak: "🌹", troja: "#8e44ad",
      om: t("Odlar rosor.", "Grows roses."),
      prat: [
        t("Det är bajs som gör rosorna fina.", "It's the poop that makes the roses pretty."),
        t("Rosor behöver kärlek. Och bajs.", "Roses need love. And poop."),
      ],
    },
    gunnel: {
      namn: t("Tant Gunnel", "Auntie Gunnel"), ansikte: "👱‍♀️", sak: "🧶", troja: "#e84393",
      om: t("Stickar och ger råd.", "Knits and gives advice."),
      prat: [
        t("Ta på dig en mössa!", "Put a hat on!"),
        t("Så där gjorde vi aldrig på min tid.", "We never did that in my day."),
        t("Ska inte bebisen ha mössa? Och vantar? Och…", "Shouldn't the baby wear a hat? And mittens? And…"),
        t("Och vad ska DU bli när du blir stor?", "And what do YOU want to be when you grow up?"),
      ],
    },
    mamma: {
      namn: t("Mamma", "Mum"), ansikte: "👩", sak: "📋", troja: "#27ae60",
      om: t("Har gjort en lista.", "Has made a list."),
      prat: [
        t("Står det inte på listan händer det inte.", "If it's not on the list, it doesn't happen."),
        t("Inga mobiler vid bordet. Utom min.", "No phones at the table. Except mine."),
        t("Hunden får egentligen ingen mat från bordet.", "The dog doesn't actually get food from the table."),
        t("Vad skönt att få äta i lugn och ro.", "How nice to eat in peace and quiet."),
      ],
    },
    pappa: {
      namn: t("Pappa", "Dad"), ansikte: "👨", sak: "🫘", troja: "#4a7bb7",
      om: t("Har ätit bönor.", "Has eaten beans."),
      prat: [
        t("Jag mår bra. Tror jag.", "I'm fine. I think."),
        t("Det var inte jag. Det var hunden.", "It wasn't me. It was the dog."),
        t("Jag ska bara… gå ut en liten sväng.", "I'll just… pop outside for a bit."),
      ],
    },
    bebis: {
      namn: t("Lillasyster", "Baby sister"), ansikte: "👶", sak: "🍼", troja: "#f1c40f",
      om: t("Kastar mat.", "Throws food."),
      prat: [t("Ba!", "Ba!"), t("Brrrrr!", "Brrrrr!")],
    },
    du: {
      namn: t("Du", "You"), ansikte: "👧", sak: "🎈", troja: "#ff7a59",
      om: t("Det är du!", "That's you!"),
      prat: [
        t("När kommer tårtan?", "When is the cake coming?"),
        t("Får hunden också tårta?", "Does the dog get cake too?"),
        t("Min köttbulle rullade iväg!", "My meatball rolled away!"),
      ],
    },
    linnea: {
      namn: t("Kusin Linnea", "Cousin Linnea"), ansikte: "👩‍🦱", sak: "🥖", troja: "#a569bd",
      om: t("Har med sig sin surdeg Göran.", "Brought her sourdough, Gerald."),
      prat: [
        t("Göran är tre år gammal.", "Gerald is three years old."),
        t("Säg hej till Göran!", "Say hi to Gerald!"),
        t("Göran blir ledsen i mörkret.", "Gerald gets sad in the dark."),
      ],
    },
    max: {
      namn: t("Kusin Max", "Cousin Max"), ansikte: "🧑", sak: "🎧", troja: "#34495e",
      om: t("Är 15 år.", "Is 15 years old."),
      prat: [
        t("Mm.", "Mm."),
        t("Jag kollar bara en sak.", "I'm just checking something."),
        t("Det laddar inte! Värsta dagen i mitt liv.", "It won't load! Worst day of my life."),
      ],
    },

    // Bröllopet: kusin Linnea gifter sig med Viktor
    brud: {
      namn: t("Bruden", "The bride"), ansikte: "👰", sak: "🌸", troja: "#f8f9f9",
      om: t("Kusin Linnea. Gifter sig i dag! Har planerat i elva år.", "Cousin Linnea. Getting married today! Has been planning for eleven years."),
      prat: [
        t("Inget kan gå fel i dag.", "Nothing can go wrong today."),
        t("Göran är min tärna. Han har varit med från början.", "Gerald is my bridesmaid. He's been there from the start."),
        t("Har alla sett Göran? Han har fluga.", "Has everyone seen Gerald? He's wearing a bow tie."),
      ],
    },
    viktor: {
      namn: t("Brudgummen", "The groom"), ansikte: "🤵", sak: "💻", troja: "#2c3e50",
      om: t("Viktor. Har gjort en app för bröllopet.", "Viktor. Made an app for the wedding."),
      prat: [
        t("Ladda ner appen, så ser ni var ni ska sitta.", "Download the app to see where you're sitting."),
        t("Appen kraschade. Vi kör på papper.", "The app crashed. We're going with paper."),
        t("Jag har inte gråtit. Det är pollen.", "I'm not crying. It's pollen."),
      ],
    },
    birgitta: {
      namn: t("Birgitta", "Birgitta"), ansikte: "💁‍♀️", sak: "👒", troja: "#af7ac5",
      om: t("Brudgummens mamma. Har den största hatten.", "The groom's mum. Has the biggest hat."),
      prat: [
        t("Viktor var ett så duktigt barn.", "Viktor was such a good boy."),
        t("Min tårta hade varit godare. Men det är inte min dag.", "My cake would have been nicer. But it's not my day."),
        t("Ser ni mig bakom hatten?", "Can you see me behind the hat?"),
      ],
    },
    kalle: {
      namn: t("Bestman Kalle", "Best man Kalle"), ansikte: "🧔", sak: "🎸", troja: "#d35400",
      om: t("Ska spela en låt han har skrivit själv.", "Is going to play a song he wrote himself."),
      prat: [
        t("Låten är elva minuter. Den har tre refränger.", "The song is eleven minutes long. It has three choruses."),
        t("Den handlar om när Viktor och jag var små.", "It's about when Viktor and I were little."),
        t("Det rimmar inte. Det är meningen.", "It doesn't rhyme. That's on purpose."),
      ],
    },
    fotograf: {
      namn: t("Fotografen Fia", "Fia the photographer"), ansikte: "👩‍🎤", sak: "📸", troja: "#16a085",
      om: t("Tar 4 000 bilder. Nästan alla på bruden.", "Takes 4,000 photos. Nearly all of the bride."),
      prat: [
        t("Alla säger omelett!", "Everybody say cheese!"),
        t("Bara en bild till. Och en till.", "Just one more photo. And another."),
        t("Kan alla gå ut i regnet? Det blir så fint ljus.", "Can everyone go out in the rain? The light is so nice."),
      ],
    },
    goran: {
      namn: t("Göran", "Gerald"), ansikte: "🥖", sak: "🎀", troja: "#f5cba7",
      om: t("Brudens surdeg. Är tre år.", "The bride's sourdough. Is three years old."),
      prat: [
        t("…", "…"),
        t("(Göran säger ingenting. Han är en surdeg.)", "(Gerald says nothing. He is a sourdough.)"),
      ],
    },
  },

  // Det mormor säger när man trycker på "Fråga mormor"
  mormorSager: [
    t("Mormor vet bäst.", "Grandma knows best."),
    t("Så här gjorde vi alltid förr.", "This is how we always did it."),
    t("Lita på mormor.", "Trust Grandma."),
    t("Jag har gjort bordsplaceringar i 60 år.", "I've been doing seating plans for 60 years."),
  ],

  // Titeln man får efter sista banan på en fest. "andel" är hur stor del
  // av festens stjärnor man har (1 = alla).
  titlar: [
    { andel: 0, namn: t("Bordsplacerare", "Seat Shuffler") },
    { andel: 0.4, namn: t("Släktfixare", "Family Fixer") },
    { andel: 0.7, namn: t("Släktdiplomat", "Family Diplomat") },
    { andel: 1, namn: t("Mormors favorit", "Grandma's Favourite") },
  ],

  // ---------------------------------------------------------------
  //  FESTERNA OCH BANORNA
  //
  //  bord: ett långbord, eller en lista med flera bord.
  //
  //    Ett långbord: { perSida: 4, gavlar: "vh" }
  //        perSida = hur många stolar det är på varje långsida.
  //        gavlar  = "v" om det finns en stol på vänster kortända,
  //                  "h" för höger och "vh" för båda.
  //        enSida: true = stolar bara på övre sidan (som ett brudbord)
  //        Stolarna heter:
  //          v              = vänster kortända
  //          h              = höger kortända
  //          u0, u1, u2 ... = uppe, från vänster
  //          n0, n1, n2 ... = nere, från vänster
  //
  //    Ett runt bord: { typ: "rund", stolar: 6 }
  //        Stolarna heter 0, 1, 2 ... medsols, och 0 är högst upp. Är det
  //        ett jämnt antal stolar sitter man mittemot någon.
  //
  //    Flera bord: [{ perSida: 4, enSida: true }, { typ: "rund", stolar: 6 }]
  //        Varje bord får en bokstav: a, b, c ... Bokstaven sätts före
  //        stolens namn, t.ex. au1 (bord a, uppe, stol 1) eller b3
  //        (runda bord b, stol 3). Borden läggs ut av sig själva.
  //
  //  markeringar: bilder vid stolarna, t.ex. { v: "👑", u2: "🪟" } eller { au1: "💍", b3: "🚪" }
  //
  //  gaster: vilka som är med (från folk här ovanför)
  //
  //  guide: true betyder att en hand visar hur man gör med det första
  //         önskemålet (bra på första banan). Resten klurar man ut själv.
  //
  //  regler: gästernas önskemål. Det finns sex sorter:
  //    { typ: "bredvid", a: "mamma", b: "bebis" }      a vill sitta bredvid b
  //    { typ: "bredvid", a: "du", b: ["mamma", "pappa"] }   ...bredvid någon av dem
  //    { typ: "inteBredvid", a: "bengt", b: "kerstin" } a och b ska inte sitta bredvid varandra
  //    { typ: "mittemot", a: "bengt", b: "morfar" }    a ska sitta mittemot b
  //    { typ: "plats", a: "mormor", ikon: "👑" }       a ska sitta vid en stol med den bilden
  //    { typ: "sammaBord", a: "du", b: "mamma" }       a vill sitta vid samma bord som b
  //    { typ: "annatBord", a: "eva", b: "bengt" }      a och b ska sitta vid olika bord
  //
  //  Till varje regel kan man skriva:
  //    text  = vad önskemålet betyder (visas när man trycker på det)
  //    sager = vad någon säger om det (vem = vem som säger det, annars a)
  //  Har man skrivit en regel en gång behöver man inte skriva texterna
  //  igen. Samma regel på en senare bana lånar dem.
  //
  //  musik: vilken melodi som spelas på festen (från MUSIK längst ner i game.js)
  //
  //  hemlig: ett önskemål som inte syns i listan. Den som vill något
  //  får en tankebubbla då och då. "tanke" är det som syns i bubblan.

  // ---------------------------------------------------------------
  fester: [
    {
      namn: t("Mormor fyller 80", "Grandma Turns 80"),
      ikon: "🎂",
      musik: "kalas",
      banor: [
        {
          namn: t("Fikat", "Coffee"),
          ikon: "☕",
          tips: t("Hjälp gästerna att hitta rätt plats!", "Help the guests find the right seat!"),
          guide: true,
          bord: { perSida: 2, gavlar: "v" },
          markeringar: { v: "👑", u0: "🪟", n1: "🪟" },
          gaster: ["mormor", "morfar", "mamma", "bebis"],
          regler: [
            {
              typ: "plats", a: "mormor", ikon: "👑",
              text: t("Mormor ska sitta på hedersplatsen.", "Grandma sits in the seat of honour."),
              vem: "mamma",
              sager: t("Mormor har suttit där sedan 1987. Ingen har vågat fråga.", "Grandma has sat there since 1987. Nobody has dared to ask."),
            },
            {
              typ: "bredvid", a: "bebis", b: "mamma",
              text: t("Lillasyster vill sitta bredvid mamma.", "Baby sister wants to sit next to Mum."),
              vem: "mamma",
              sager: t("Hon äter själv nu. Det är bra för motoriken.", "She feeds herself now. It's good for her motor skills."),
            },
            {
              typ: "plats", a: "morfar", ikon: "🪟",
              text: t("Morfar vill sitta vid fönstret.", "Grandpa wants to sit by the window."),
              sager: t("Jag tittar efter fåglar. Inte på grannens nya bil.", "I'm looking for birds. Not at the neighbour's new car."),
            },
          ],
          hemlig: {
            typ: "bredvid", a: "morfar", b: "mormor",
            text: t("Morfar ville sitta bredvid mormor.", "Grandpa wanted to sit next to Grandma."),
            sager: t("Efter 55 år vill jag fortfarande sitta bredvid henne.", "After 55 years I still want to sit next to her."),
          },
        },
        {
          namn: t("Förrätten", "The Starter"),
          ikon: "🥗",
          tips: t("Vissa gäster vill INTE sitta bredvid varandra.", "Some guests do NOT want to sit together."),
          bord: { perSida: 3, gavlar: "v" },
          markeringar: { v: "👑", u2: "🪟" },
          gaster: ["mormor", "morfar", "mamma", "bebis", "bengt", "kerstin"],
          regler: [
            { typ: "plats", a: "mormor", ikon: "👑" },
            { typ: "plats", a: "morfar", ikon: "🪟" },
            { typ: "bredvid", a: "bebis", b: "mamma" },
            {
              typ: "inteBredvid", a: "bengt", b: "kerstin",
              text: t("Morbror Bengt och grannen Kerstin ska inte sitta bredvid varandra.", "Uncle Bengt and Kerstin next door should not sit together."),
              sager: t("Har du läst om batterierna? Jag har en pärm.", "Have you read about the batteries? I have a binder."),
            },
          ],
          hemlig: {
            typ: "bredvid", a: "bengt", b: "mormor",
            text: t("Morbror Bengt ville sitta bredvid mormor.", "Uncle Bengt wanted to sit next to Grandma."),
            sager: t("Jag är mammas favorit. Det vet alla.", "I'm Mum's favourite. Everybody knows."),
          },
        },
        {
          namn: t("Varmrätten", "The Main Course"),
          ikon: "🍖",
          tips: t("Nytt: ↕️ betyder mittemot varandra.", "New: ↕️ means across from each other."),
          bord: { perSida: 4, gavlar: "v" },
          markeringar: { v: "👑", u1: "🪟", n3: "🚪" },
          gaster: ["mormor", "morfar", "mamma", "pappa", "bebis", "du", "bengt", "kerstin"],
          regler: [
            { typ: "plats", a: "mormor", ikon: "👑" },
            {
              typ: "plats", a: "pappa", ikon: "🚪",
              text: t("Pappa vill sitta nära dörren.", "Dad wants to sit near the door."),
              sager: t("Jag åt bönor till lunch. Det är bäst så.", "I had beans for lunch. It's better this way."),
            },
            {
              typ: "bredvid", a: "du", b: ["mamma", "pappa"],
              text: t("Du vill sitta bredvid mamma eller pappa. Någon måste skära köttet!", "You want to sit next to Mum or Dad. Someone has to cut your meat!"),
              vem: "mamma",
              sager: t("Små bitar. Inte större än en ärta.", "Small pieces. No bigger than a pea."),
            },
            { typ: "bredvid", a: "bebis", b: "mamma" },
            {
              typ: "mittemot", a: "bengt", b: "morfar",
              text: t("Morbror Bengt och morfar vill sitta mittemot varandra och prata om fiske.", "Uncle Bengt and Grandpa want to sit across from each other and talk about fishing."),
              vem: "morfar",
              sager: t("Bengt har en pärm om gäddor. Den är tjock.", "Bengt has a binder about pike. It's a thick one."),
            },
            { typ: "inteBredvid", a: "bengt", b: "kerstin" },
          ],
          hemlig: {
            typ: "plats", a: "kerstin", ikon: "🪟", tanke: "🪟🚗",
            text: t("Grannen Kerstin ville sitta vid fönstret.", "Kerstin next door wanted to sit by the window."),
            sager: t("Jag vill bara se att bilen laddar.", "I just want to check the car is charging."),
          },
        },
        {
          namn: t("Talet", "The Speech"),
          ikon: "🎤",
          tips: t("Nu är det fullt vid bordet. Alla stolar behövs!", "The table is full now. Every chair is needed!"),
          bord: { perSida: 4, gavlar: "vh" },
          markeringar: { v: "👑", h: "🎤", u0: "🪟", n3: "🚪" },
          gaster: ["mormor", "morfar", "mamma", "pappa", "bebis", "du", "bengt", "eva", "gunnel", "kerstin"],
          regler: [
            { typ: "plats", a: "mormor", ikon: "👑" },
            {
              typ: "plats", a: "bengt", ikon: "🎤",
              text: t("Morbror Bengt ska hålla tal. Han ska sitta på talarplatsen.", "Uncle Bengt is giving a speech. He sits in the speaker's seat."),
              sager: t("Talet är 14 sidor. Det här är bara del 1.", "The speech is 14 pages. This is just part 1."),
            },
            {
              typ: "inteBredvid", a: "eva", b: "bengt",
              text: t("Moster Eva och morbror Bengt bråkar alltid om vem som är mormors favorit.", "Aunt Eva and Uncle Bengt always argue about who is Grandma's favourite."),
              sager: t("Det handlar inte om det. Det handlar om principen.", "It's not about that. It's the principle."),
            },
            {
              typ: "inteBredvid", a: "gunnel", b: "mamma",
              text: t("Tant Gunnel ger mamma råd hela tiden. De ska inte sitta bredvid varandra.", "Auntie Gunnel keeps giving Mum advice. They should not sit together."),
              sager: t("Låt bebisen sova ute. Det gjorde vi. Även i januari.", "Let the baby nap outside. We did. Even in January."),
            },
            { typ: "bredvid", a: "bebis", b: "mamma" },
            { typ: "plats", a: "pappa", ikon: "🚪" },
            { typ: "bredvid", a: "du", b: ["mamma", "pappa"] },
            { typ: "plats", a: "morfar", ikon: "🪟" },
          ],
          hemlig: {
            typ: "bredvid", a: "eva", b: "du",
            text: t("Moster Eva ville sitta bredvid dig.", "Aunt Eva wanted to sit next to you."),
            sager: t("Jag är ju den roliga mostern.", "I'm the fun aunt, after all."),
          },
        },
        {
          namn: t("Tårtan", "The Cake"),
          ikon: "🎂",
          tips: t("Alla är här! Kusinerna också.", "Everyone is here! The cousins too."),
          bord: { perSida: 5, gavlar: "vh" },
          markeringar: { v: "👑", h: "🎤", u2: "🪟", u4: "🚪", n4: "📶" },
          gaster: ["mormor", "morfar", "mamma", "pappa", "bebis", "du", "bengt", "eva", "gunnel", "sven", "linnea", "max"],
          regler: [
            { typ: "plats", a: "mormor", ikon: "👑" },
            {
              typ: "plats", a: "eva", ikon: "🎤",
              text: t("Nu ska moster Eva hålla tal! Hon ska sitta på talarplatsen.", "Now Aunt Eva is giving a speech! She sits in the speaker's seat."),
              sager: t("Mitt tal är kortare än Bengts. Det är inte en tävling.", "My speech is shorter than Bengt's. It's not a competition."),
            },
            { typ: "inteBredvid", a: "eva", b: "bengt" },
            {
              typ: "plats", a: "linnea", ikon: "🪟",
              text: t("Kusin Linnea vill sitta vid fönstret.", "Cousin Linnea wants to sit by the window."),
              sager: t("Göran behöver ljus. Göran är min surdeg.", "Gerald needs light. Gerald is my sourdough."),
            },
            {
              typ: "plats", a: "max", ikon: "📶",
              text: t("Kusin Max vill sitta närmast wifi:n.", "Cousin Max wants to sit closest to the wifi."),
              sager: t("Jag är inte på mobilen. Jag kollar bara en sak.", "I'm not on my phone. I'm just checking something."),
            },
            { typ: "plats", a: "pappa", ikon: "🚪" },
            { typ: "bredvid", a: "bebis", b: "mamma" },
            { typ: "bredvid", a: "du", b: ["mamma", "pappa"] },
            { typ: "inteBredvid", a: "gunnel", b: "mamma" },
            {
              typ: "inteBredvid", a: "gunnel", b: "max",
              text: t("Tant Gunnel frågar alltid Max vad han ska bli när han blir stor.", "Auntie Gunnel always asks Max what he wants to be when he grows up."),
              vem: "max",
              sager: t("Jag vet inte. Jag är 15.", "I don't know. I'm 15."),
            },
          ],
          hemlig: {
            typ: "bredvid", a: "gunnel", b: "sven", tanke: "💗🌹",
            text: t("Tant Gunnel ville sitta bredvid grannen Sven.", "Auntie Gunnel wanted to sit next to Sven next door."),
            sager: t("Sven har så fina… rosor.", "Sven has such lovely… roses."),
          },
        },
      ],
    },
    {
      namn: t("Bröllopet", "The Wedding"),
      ikon: "💒",
      musik: "brollop",
      banor: [
        {
          namn: t("Brudbordet", "The Top Table"),
          ikon: "💍",
          tips: t("Nytt: runda bord! Där sitter alla i en ring.", "New: round tables! Everyone sits in a ring."),
          bord: [{ perSida: 3, enSida: true }, { typ: "rund", stolar: 4 }],
          markeringar: { au1: "💍", au2: "💍", b1: "🪟" },
          gaster: ["brud", "viktor", "goran", "mormor", "morfar", "du"],
          regler: [
            {
              typ: "plats", a: "brud", ikon: "💍",
              text: t("Bruden ska sitta på en av brudparets platser.", "The bride sits in one of the couple's seats."),
              sager: t("Jag har planerat det här i elva år. Inget kan gå fel.", "I've planned this for eleven years. Nothing can go wrong."),
            },
            {
              typ: "plats", a: "viktor", ikon: "💍",
              text: t("Brudgummen ska också sitta på en av brudparets platser.", "The groom also sits in one of the couple's seats."),
              sager: t("Jag gjorde en app för bordsplaceringen. Den kraschade.", "I made an app for the seating plan. It crashed."),
            },
            {
              typ: "bredvid", a: "goran", b: "brud",
              text: t("Göran ska sitta bredvid bruden. Göran är hennes surdeg.", "Gerald sits next to the bride. Gerald is her sourdough."),
              vem: "brud",
              sager: t("Göran är min tärna. Han har varit med från början.", "Gerald is my bridesmaid. He's been there from the start."),
            },
            {
              typ: "mittemot", a: "morfar", b: "mormor",
              text: t("Morfar vill sitta mittemot mormor, så att han kan se henne.", "Grandpa wants to sit across from Grandma so he can see her."),
              sager: t("Hon är lika fin som på vårt bröllop.", "She's as lovely as on our wedding day."),
            },
            {
              typ: "bredvid", a: "du", b: "mormor",
              text: t("Du vill sitta bredvid mormor.", "You want to sit next to Grandma."),
              vem: "mormor",
              sager: t("Du får min tårtbit om du inte säger något till mamma.", "You can have my piece of cake if you don't tell Mum."),
            },
          ],
          hemlig: {
            typ: "plats", a: "mormor", ikon: "🪟",
            text: t("Mormor ville sitta vid fönstret.", "Grandma wanted to sit by the window."),
            sager: t("Där ute står morfars gamla bil. Vi åkte i den till vårt bröllop.", "Grandpa's old car is out there. We drove it to our wedding."),
          },
        },
        {
          namn: t("Fotografen", "The Photographer"),
          ikon: "📸",
          tips: t("Nu är det fullt vid det runda bordet.", "The round table is full now."),
          bord: [{ perSida: 3, enSida: true }, { typ: "rund", stolar: 6 }],
          markeringar: { au1: "💍", au2: "💍", b3: "🚪" },
          gaster: ["brud", "viktor", "goran", "mormor", "morfar", "du", "fotograf", "mamma", "bebis"],
          regler: [
            { typ: "plats", a: "brud", ikon: "💍" },
            { typ: "plats", a: "viktor", ikon: "💍" },
            { typ: "bredvid", a: "goran", b: "brud" },
            {
              typ: "plats", a: "fotograf", ikon: "🚪",
              text: t("Fotografen vill sitta nära dörren, så att hon kan springa ut och ta bilder.", "The photographer wants to sit near the door so she can run out and take photos."),
              sager: t("Bara en bild till. Och en till.", "Just one more photo. And another."),
            },
            {
              typ: "inteBredvid", a: "fotograf", b: "mormor",
              text: t("Fotografen ska inte sitta bredvid mormor. Mormor blundar på alla bilder.", "The photographer should not sit next to Grandma. Grandma blinks in every photo."),
              sager: t("Mormor har blundat på 312 bilder. Jag har räknat.", "Grandma has blinked in 312 photos. I counted."),
            },
            { typ: "mittemot", a: "morfar", b: "mormor" },
            { typ: "bredvid", a: "du", b: "mormor" },
            { typ: "bredvid", a: "bebis", b: "mamma" },
          ],
          hemlig: {
            typ: "mittemot", a: "bebis", b: "fotograf", tanke: "👀📸",
            text: t("Lillasyster ville sitta mittemot fotografen, så att hon kommer med på bild.", "Baby sister wanted to sit across from the photographer so she'd be in the photos."),
            vem: "fotograf",
            sager: t("Hon är den enda som tittar in i kameran.", "She's the only one who looks at the camera."),
          },
        },
        {
          namn: t("Middagen", "The Dinner"),
          ikon: "🍝",
          tips: t("Nytt: 🤝 vid samma bord och 🙅 vid olika bord.", "New: 🤝 at the same table and 🙅 at different tables."),
          bord: [{ perSida: 3, enSida: true }, { typ: "rund", stolar: 4 }, { typ: "rund", stolar: 4 }],
          markeringar: { au1: "💍", au2: "💍" },
          gaster: ["brud", "viktor", "goran", "mormor", "morfar", "birgitta", "kalle", "mamma", "bebis", "du"],
          regler: [
            { typ: "plats", a: "brud", ikon: "💍" },
            { typ: "plats", a: "viktor", ikon: "💍" },
            { typ: "bredvid", a: "goran", b: "brud" },
            {
              typ: "annatBord", a: "birgitta", b: "mormor",
              text: t("Viktors mamma Birgitta och mormor ska sitta vid olika bord. Båda tycker att de bakar godast tårta.", "Viktor's mum Birgitta and Grandma should sit at different tables. Both think they bake the best cake."),
              vem: "mormor",
              sager: t("Hennes tårta är god. För att vara köpt.", "Her cake is nice. For a shop-bought one."),
            },
            {
              typ: "annatBord", a: "kalle", b: "bebis",
              text: t("Bestman Kalle ska spela gitarr. Lillasyster ska sitta vid ett annat bord, så att hon kan sova.", "Best man Kalle is going to play the guitar. Baby sister should sit at another table so she can sleep."),
              sager: t("Låten är elva minuter. Den har tre refränger.", "The song is eleven minutes long. It has three choruses."),
            },
            {
              typ: "bredvid", a: "bebis", b: "mamma",
              text: t("Lillasyster vill sitta bredvid mamma.", "Baby sister wants to sit next to Mum."),
              vem: "mamma",
              sager: t("Hon äter själv nu. Det är bra för motoriken.", "She feeds herself now. It's good for her motor skills."),
            },
            {
              typ: "sammaBord", a: "du", b: "mamma",
              text: t("Du vill sitta vid samma bord som mamma.", "You want to sit at the same table as Mum."),
              vem: "mamma",
              sager: t("Då ser jag att du äter något annat än tårta.", "Then I can see you eat something other than cake."),
            },
            {
              typ: "sammaBord", a: "morfar", b: "mormor",
              text: t("Morfar vill sitta vid samma bord som mormor.", "Grandpa wants to sit at the same table as Grandma."),
              sager: t("Vi har suttit vid samma bord i 55 år.", "We've sat at the same table for 55 years."),
            },
          ],
          hemlig: {
            typ: "bredvid", a: "birgitta", b: "bebis",
            text: t("Birgitta ville sitta bredvid lillasyster.", "Birgitta wanted to sit next to baby sister."),
            sager: t("Viktor var också en så söt bebis. Jag har bilder. 400 stycken.", "Viktor was such a cute baby too. I have pictures. 400 of them."),
          },
        },
        {
          namn: t("Bestmannens låt", "The Best Man's Song"),
          ikon: "🎸",
          tips: t("Bestman Kalle ska spela. Vem vill höra, och vem vill inte?", "Best man Kalle is going to play. Who wants to listen, and who doesn't?"),
          bord: [{ perSida: 3, enSida: true }, { typ: "rund", stolar: 5 }, { typ: "rund", stolar: 4 }],
          markeringar: { au1: "💍", au2: "💍", b0: "🎤" },
          gaster: ["brud", "viktor", "goran", "kalle", "mormor", "morfar", "birgitta", "mamma", "bebis", "du", "eva"],
          regler: [
            { typ: "plats", a: "brud", ikon: "💍" },
            { typ: "plats", a: "viktor", ikon: "💍" },
            { typ: "bredvid", a: "goran", b: "brud" },
            {
              typ: "plats", a: "kalle", ikon: "🎤",
              text: t("Bestman Kalle ska spela sin låt. Han ska sitta vid mikrofonen.", "Best man Kalle is playing his song. He sits by the microphone."),
              sager: t("Den har tre refränger. Och ett gitarrsolo.", "It has three choruses. And a guitar solo."),
            },
            { typ: "annatBord", a: "kalle", b: "bebis" },
            {
              typ: "sammaBord", a: "eva", b: "kalle",
              text: t("Moster Eva vill sitta vid samma bord som Kalle. Hon vill sjunga med.", "Aunt Eva wants to sit at the same table as Kalle. She wants to sing along."),
              sager: t("Jag kan alla tre refrängerna.", "I know all three choruses."),
            },
            { typ: "bredvid", a: "bebis", b: "mamma" },
            { typ: "annatBord", a: "birgitta", b: "mormor" },
            { typ: "sammaBord", a: "du", b: "mamma" },
          ],
          hemlig: {
            typ: "inteBredvid", a: "morfar", b: "kalle", tanke: "🙉🎸",
            text: t("Morfar ville inte sitta bredvid Kalle.", "Grandpa didn't want to sit next to Kalle."),
            sager: t("Jag har hört låten. Två gånger.", "I've heard the song. Twice."),
          },
        },
        {
          namn: t("Talen", "The Speeches"),
          ikon: "🎤",
          tips: t("Nu är det tre bord. Titta noga på vem som ska sitta var!", "Now there are three tables. Look carefully at who sits where!"),
          bord: [{ perSida: 4, enSida: true }, { typ: "rund", stolar: 6 }, { typ: "rund", stolar: 4 }],
          markeringar: { au1: "💍", au2: "💍", au3: "🎤", b3: "🚪" },
          gaster: ["brud", "viktor", "goran", "kalle", "mormor", "morfar", "birgitta", "bengt", "eva", "mamma", "pappa", "bebis", "du"],
          regler: [
            { typ: "plats", a: "brud", ikon: "💍" },
            { typ: "plats", a: "viktor", ikon: "💍" },
            { typ: "bredvid", a: "goran", b: "brud" },
            {
              typ: "plats", a: "kalle", ikon: "🎤",
              text: t("Bestman Kalle ska hålla tal. Han ska sitta vid mikrofonen.", "Best man Kalle is giving a speech. He sits by the microphone."),
              sager: t("Först talet, sen låten. Det tar bara en timme.", "First the speech, then the song. It only takes an hour."),
            },
            {
              typ: "annatBord", a: "eva", b: "bengt",
              text: t("Moster Eva och morbror Bengt ska sitta vid olika bord. De tävlar om vem som håller längst tal.", "Aunt Eva and Uncle Bengt should sit at different tables. They compete over who gives the longest speech."),
              sager: t("Mitt tal är kortare. Det är inte en tävling.", "My speech is shorter. It's not a competition."),
            },
            { typ: "annatBord", a: "birgitta", b: "mormor" },
            { typ: "bredvid", a: "bebis", b: "mamma" },
            {
              typ: "plats", a: "pappa", ikon: "🚪",
              text: t("Pappa vill sitta nära dörren.", "Dad wants to sit near the door."),
              sager: t("Det var bönsallad på förfesten. Det är bäst så.", "There was bean salad before the party. It's better this way."),
            },
            {
              typ: "sammaBord", a: "du", b: ["mamma", "pappa"],
              text: t("Du vill sitta vid samma bord som mamma eller pappa.", "You want to sit at the same table as Mum or Dad."),
              vem: "mamma",
              sager: t("Då ser jag att du äter något annat än tårta.", "Then I can see you eat something other than cake."),
            },
            {
              typ: "mittemot", a: "bengt", b: "morfar",
              text: t("Morbror Bengt vill sitta mittemot morfar och visa sin pärm om bröllop.", "Uncle Bengt wants to sit across from Grandpa and show him his binder about weddings."),
              vem: "morfar",
              sager: t("VA? JAG HÖR INTE!", "WHAT? I CAN'T HEAR YOU!"),
            },
          ],
          hemlig: {
            typ: "bredvid", a: "eva", b: "du",
            text: t("Moster Eva ville sitta bredvid dig.", "Aunt Eva wanted to sit next to you."),
            sager: t("Jag är ju den roliga mostern.", "I'm the fun aunt, after all."),
          },
        },
        {
          namn: t("Dansen", "The Dance"),
          ikon: "💃",
          tips: t("Nu ska det dansas! Någon vill sitta nära dansgolvet 💃.", "Time to dance! Someone wants to sit near the dance floor 💃."),
          bord: [{ perSida: 4, enSida: true }, { typ: "rund", stolar: 6 }, { typ: "rund", stolar: 5 }],
          markeringar: { au1: "💍", au2: "💍", au3: "🎤", c2: "💃" },
          gaster: ["brud", "viktor", "goran", "kalle", "mormor", "morfar", "birgitta", "bengt", "eva", "gunnel", "sven", "mamma", "pappa", "du"],
          regler: [
            { typ: "plats", a: "brud", ikon: "💍" },
            { typ: "plats", a: "viktor", ikon: "💍" },
            { typ: "bredvid", a: "goran", b: "brud" },
            { typ: "plats", a: "kalle", ikon: "🎤" },
            { typ: "bredvid", a: "gunnel", b: "sven" },
            {
              typ: "plats", a: "sven", ikon: "💃",
              text: t("Grannen Sven vill sitta närmast dansgolvet.", "Sven next door wants to sit closest to the dance floor."),
              sager: t("Mina knän är 78 år. Mina fötter är 25.", "My knees are 78. My feet are 25."),
            },
            { typ: "annatBord", a: "eva", b: "bengt" },
            { typ: "annatBord", a: "birgitta", b: "mormor" },
            {
              typ: "mittemot", a: "pappa", b: "mamma",
              text: t("Pappa vill sitta mittemot mamma, så att han kan bjuda upp henne.", "Dad wants to sit across from Mum so he can ask her to dance."),
              sager: t("Jag har övat. I köket.", "I've been practising. In the kitchen."),
            },
            { typ: "sammaBord", a: "du", b: ["mamma", "pappa"] },
          ],
          hemlig: {
            typ: "bredvid", a: "mormor", b: "morfar",
            text: t("Mormor ville sitta bredvid morfar.", "Grandma wanted to sit next to Grandpa."),
            sager: t("Vi ska dansa samma vals som på vårt bröllop.", "We're going to dance the same waltz as at our wedding."),
          },
        },
        {
          namn: t("Bröllopstårtan", "The Wedding Cake"),
          ikon: "🎂",
          tips: t("Alla är här! Nu blir det fullt vid alla bord.", "Everyone is here! Every table will be full."),
          bord: [{ perSida: 4, enSida: true }, { typ: "rund", stolar: 6 }, { typ: "rund", stolar: 6 }],
          markeringar: { au1: "💍", au2: "💍", au3: "🎤", b3: "🚪", c0: "📶" },
          gaster: ["brud", "viktor", "goran", "kalle", "mormor", "morfar", "birgitta", "bengt", "eva", "gunnel", "sven", "mamma", "pappa", "bebis", "du", "max"],
          regler: [
            { typ: "plats", a: "brud", ikon: "💍" },
            { typ: "plats", a: "viktor", ikon: "💍" },
            { typ: "bredvid", a: "goran", b: "brud" },
            { typ: "plats", a: "kalle", ikon: "🎤" },
            {
              typ: "bredvid", a: "gunnel", b: "sven",
              text: t("Tant Gunnel och grannen Sven vill sitta bredvid varandra. De har börjat dansa ihop!", "Auntie Gunnel and Sven next door want to sit together. They've started dancing together!"),
              vem: "sven",
              sager: t("Vi dansar på tisdagar. Och onsdagar. Och torsdagar.", "We dance on Tuesdays. And Wednesdays. And Thursdays."),
            },
            {
              typ: "plats", a: "max", ikon: "📶",
              text: t("Kusin Max vill sitta närmast wifi:n.", "Cousin Max wants to sit closest to the wifi."),
              sager: t("Jag är inte på mobilen. Jag kollar bara en sak.", "I'm not on my phone. I'm just checking something."),
            },
            {
              typ: "annatBord", a: "gunnel", b: "max",
              text: t("Tant Gunnel och kusin Max ska sitta vid olika bord. Hon frågar alltid vad han ska bli när han blir stor.", "Auntie Gunnel and Cousin Max should sit at different tables. She always asks what he wants to be when he grows up."),
              vem: "max",
              sager: t("Jag vet inte. Jag är 15.", "I don't know. I'm 15."),
            },
            { typ: "annatBord", a: "birgitta", b: "mormor" },
            { typ: "annatBord", a: "eva", b: "bengt" },
            { typ: "bredvid", a: "bebis", b: "mamma" },
            { typ: "plats", a: "pappa", ikon: "🚪" },
            { typ: "sammaBord", a: "du", b: ["mamma", "pappa"] },
          ],
          hemlig: {
            typ: "bredvid", a: "birgitta", b: "bengt", tanke: "💗📁",
            text: t("Birgitta ville sitta bredvid morbror Bengt.", "Birgitta wanted to sit next to Uncle Bengt."),
            sager: t("Har du också en pärm? Vilken fin pärm.", "You have a binder too? What a lovely binder."),
          },
        },
        {
          namn: t("Nattkorven", "The Midnight Hot Dogs"),
          ikon: "🌭",
          tips: t("Sista banan! Alla är hungriga igen. Fyra bord!", "The last level! Everyone is hungry again. Four tables!"),
          bord: [{ perSida: 4, enSida: true }, { typ: "rund", stolar: 6 }, { typ: "rund", stolar: 6 }, { typ: "rund", stolar: 5 }],
          markeringar: { au1: "💍", au2: "💍", au3: "🎤", b3: "🚪", c0: "📶", d2: "💃" },
          gaster: ["brud", "viktor", "goran", "kalle", "mormor", "morfar", "birgitta", "bengt", "eva", "gunnel", "sven", "kerstin", "mamma", "pappa", "bebis", "du", "max", "fotograf"],
          regler: [
            { typ: "plats", a: "brud", ikon: "💍" },
            { typ: "plats", a: "viktor", ikon: "💍" },
            { typ: "bredvid", a: "goran", b: "brud" },
            { typ: "plats", a: "kalle", ikon: "🎤" },
            { typ: "plats", a: "max", ikon: "📶" },
            { typ: "plats", a: "pappa", ikon: "🚪" },
            { typ: "plats", a: "sven", ikon: "💃" },
            { typ: "bredvid", a: "gunnel", b: "sven" },
            { typ: "inteBredvid", a: "fotograf", b: "mormor" },
            {
              typ: "inteBredvid", a: "bengt", b: "kerstin",
              text: t("Morbror Bengt och grannen Kerstin ska inte sitta bredvid varandra.", "Uncle Bengt and Kerstin next door should not sit together."),
              sager: t("Har du läst om batterierna? Jag har en pärm.", "Have you read about the batteries? I have a binder."),
            },
            { typ: "annatBord", a: "birgitta", b: "mormor" },
            { typ: "bredvid", a: "bebis", b: "mamma" },
            { typ: "sammaBord", a: "du", b: ["mamma", "pappa"] },
          ],
          hemlig: {
            typ: "bredvid", a: "fotograf", b: "du",
            text: t("Fotografen ville sitta bredvid dig.", "The photographer wanted to sit next to you."),
            sager: t("Du är den enda som inte blundar på bilderna.", "You're the only one who doesn't blink in the photos."),
          },
        },
      ],
    },
  ],
};

// ---------------------------------------------------------------------
//  Härifrån och ner är själva spelet.
// ---------------------------------------------------------------------

const S = INSTALLNINGAR;
const canvas = document.getElementById("spel");
const ctx = canvas.getContext("2d");
const hemKnapp = document.getElementById("hem");
const pausKnapp = document.getElementById("paus");
const pausmeny = document.getElementById("pausmeny");
const ljudKnapp = document.getElementById("ljudKnapp");
const musikKnapp = document.getElementById("musikKnapp");
const TYPSNITT = 'ui-rounded, system-ui, -apple-system, "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif';

// Bilden och orden mitt på önskemålen
const REGEL_IKON = { bredvid: "💕", inteBredvid: "🚫", mittemot: "↕️", plats: "➡️", sammaBord: "🤝", annatBord: "🙅" };
const REGEL_ORD = {
  bredvid: t("vill sitta bredvid", "wants to sit next to"),
  inteBredvid: t("vill INTE sitta bredvid", "does NOT want to sit next to"),
  mittemot: t("vill sitta mittemot", "wants to sit across from"),
  plats: t("vill sitta vid", "wants to sit at"),
  sammaBord: t("vill sitta vid samma bord", "wants the same table"),
  annatBord: t("vill sitta vid ANNAT bord", "wants ANOTHER table"),
};

let bredd = 0;
let hojd = 0;
let marginal = { topp: 0, vanster: 0, hoger: 0, botten: 0 };
let pixelSkala = Math.min(window.devicePixelRatio || 1, 2);
const emojiMinne = new Map(); // Färdigritade emojis

let lage = "meny"; // "meny", "intro", "placera", "resultat" eller "paus"
let lageForePaus = "placera";
let lageTid = 0;
let tid = 0;
let ljudPa = S.ljud && lasInstallning("ljud-bord") !== "av";
let stjarnor = lasStjarnor();

let festNr = 0;
let banNr = 0;
let B = null;          // Banan som spelas just nu (färdig att använda, se forbered)
let L = null;          // Var allt ligger på skärmen (se gorLayout)
let plats = {};        // Gäst -> stol (eller null om gästen inte sitter)
let ritadPos = {};     // Där gästerna ritas just nu (glider mot rätt plats)
let status = [];       // För varje regel: true, false eller null (inte klart än)
let drag = null;       // Gästen som dras med fingret
let vald = null;       // Gästen man har tryckt på
let info = null;       // Rutan med text som visas när man trycker på något
let skak = {};         // Saker som skakar en stund
let mormorLosning = null;
let mormorKvar = 0;    // Hur många frågor till mormor som finns kvar på banan
let hemligHittad = false;
let tankeKlocka = 0;
let tankeNu = 0;       // Tankebubblan syns direkt en stund, t.ex. när man trycker på den hemliga önskan
let guideLosning = null; // På den guidade banan: en lösning som handen visar
let guideKlar = false;    // Handen visar bara det första önskemålet, sedan får man klura själv
let guideKlarTid = 0;     // Hur länge "Nu får du klura själv" syns
let markerade = null;     // Gäster som lyser en stund när man tryckt på ett önskemål

let resultat = null;
let menyKnappar = [];
let resultatKnappar = [];

// ---------- Små hjälpfunktioner ----------

function slumpa(lista) {
  return lista[Math.floor(Math.random() * lista.length)];
}

function begr(v, minst, mest) {
  return Math.min(mest, Math.max(minst, v));
}

function rundRekt(c, x, y, w, h, r) {
  r = Math.min(r, w / 2, h / 2);
  c.beginPath();
  c.moveTo(x + r, y);
  c.arcTo(x + w, y, x + w, y + h, r);
  c.arcTo(x + w, y + h, x, y + h, r);
  c.arcTo(x, y + h, x, y, r);
  c.arcTo(x, y, x + w, y, r);
  c.closePath();
}

function inuti(px, py, r) {
  return r && px >= r.x && px <= r.x + r.w && py >= r.y && py <= r.y + r.h;
}

// Delar upp en text i rader som får plats (ctx.font måste vara satt)
function radbryt(text, maxBredd) {
  const ord = String(text).split(" ");
  const rader = [];
  let rad = "";
  for (const o of ord) {
    const prova = rad ? rad + " " + o : o;
    if (rad && ctx.measureText(prova).width > maxBredd) {
      rader.push(rad);
      rad = o;
    } else {
      rad = prova;
    }
  }
  if (rad) rader.push(rad);
  return rader;
}

function gast(id) {
  return S.folk[id] || { namn: id, ansikte: "🙂", sak: "", troja: "#999999", prat: [] };
}

// ---------- Bordet och reglerna ----------

// Gör om bordet i inställningarna till en lista med bord. Ett ensamt
// långbord har stolar utan bokstav (v, u0, n0 ...). Har banan flera bord
// får varje bord en bokstav: a, b, c ... (au0, b3 ...).
function bordLista(def) {
  if (Array.isArray(def)) return def.map((b, i) => ({ ...b, typ: b.typ || "lang", bokstav: String.fromCharCode(97 + i) }));
  return [{ ...def, typ: def.typ || "lang", bokstav: "" }];
}

// Bygger stolarna runt alla bord, och vilka stolar som är bredvid och mittemot varandra
function byggBord(def) {
  const borden = bordLista(def);
  const platser = [];
  const granne = {};
  const mittemot = {};
  const bordAv = {};
  const ny = (id, nr, sida, i) => {
    platser.push({ id, bord: nr, sida, i });
    granne[id] = [];
    mittemot[id] = null;
    bordAv[id] = nr;
  };
  const koppla = (a, b) => {
    if (a in granne && b in granne && a !== b && !granne[a].includes(b)) {
      granne[a].push(b);
      granne[b].push(a);
    }
  };
  borden.forEach((b, nr) => {
    const x = b.bokstav;
    if (b.typ === "rund") {
      // Stolarna går medsols, och stol 0 är högst upp
      const n = b.stolar;
      for (let i = 0; i < n; i++) ny(x + i, nr, "rund", i);
      for (let i = 0; i < n; i++) koppla(x + i, x + ((i + 1) % n));
      if (n % 2 === 0) for (let i = 0; i < n; i++) mittemot[x + i] = x + ((i + n / 2) % n);
      return;
    }
    const n = b.perSida;
    const gavlar = b.gavlar || "";
    if (gavlar.includes("v")) ny(x + "v", nr, "v", -1);
    for (let i = 0; i < n; i++) ny(x + "u" + i, nr, "u", i);
    if (!b.enSida) for (let i = 0; i < n; i++) ny(x + "n" + i, nr, "n", i);
    if (gavlar.includes("h")) ny(x + "h", nr, "h", n);
    for (let i = 0; i < n - 1; i++) {
      koppla(x + "u" + i, x + "u" + (i + 1));
      koppla(x + "n" + i, x + "n" + (i + 1));
    }
    koppla(x + "v", x + "u0");
    koppla(x + "v", x + "n0");
    koppla(x + "h", x + "u" + (n - 1));
    koppla(x + "h", x + "n" + (n - 1));
    if (!b.enSida) {
      for (let i = 0; i < n; i++) {
        mittemot[x + "u" + i] = x + "n" + i;
        mittemot[x + "n" + i] = x + "u" + i;
      }
    }
    if (x + "v" in granne && x + "h" in granne) {
      mittemot[x + "v"] = x + "h";
      mittemot[x + "h"] = x + "v";
    }
  });
  return { borden, platser, granne, mittemot, bordAv };
}

function regelB(r) {
  if (Array.isArray(r.b)) return r.b;
  return r.b ? [r.b] : [];
}

function regelGaster(r) {
  return [r.a, ...regelB(r)];
}

// Stämmer regeln? true = ja, false = nej, null = går inte att säga än
function stammer(r, plac, bana) {
  const pa = plac[r.a];
  if (!pa) return null;
  if (r.typ === "plats") return bana.markeringar[pa] === r.ikon;
  const pb = regelB(r).map((b) => plac[b]);
  const bredvid = pb.some((p) => p && bana.bord.granne[pa].includes(p));
  const allaSitter = pb.every((p) => p);
  if (r.typ === "bredvid") return bredvid ? true : allaSitter ? false : null;
  if (r.typ === "inteBredvid") return bredvid ? false : allaSitter ? true : null;
  if (r.typ === "mittemot") return pb[0] ? bana.bord.mittemot[pa] === pb[0] : null;
  const sammaBord = pb.some((p) => p && bana.bord.bordAv[p] === bana.bord.bordAv[pa]);
  if (r.typ === "sammaBord") return sammaBord ? true : allaSitter ? false : null;
  if (r.typ === "annatBord") return sammaBord ? false : allaSitter ? true : null;
  return null;
}

// Letar upp en placering där alla regler stämmer. Gästerna prövar helst
// stolen de redan sitter på i "forst", så att lösningen blir lik den man har.
function losa(bana, forst = {}, regler = bana.regler) {
  const antalRegler = (id) => regler.filter((r) => regelGaster(r).includes(id)).length;
  // Vilka stolar varje gäst kan sitta på. Ska gästen sitta vid en bild är det bara de stolarna.
  const allaStolar = bana.bord.platser.map((p) => p.id);
  const mojliga = {};
  for (const id of bana.gaster) {
    mojliga[id] = allaStolar;
    for (const r of regler) {
      if (r.typ === "plats" && r.a === id) mojliga[id] = mojliga[id].filter((p) => bana.markeringar[p] === r.ikon);
    }
  }
  // Gäster med få möjliga stolar och många önskemål placeras först. Då hittas en lösning snabbare.
  const ordning = [...bana.gaster].sort((x, y) => mojliga[x].length - mojliga[y].length || antalRegler(y) - antalRegler(x));
  const plac = {};
  const upptagen = {};
  const funkar = (id) => regler.every((r) => !regelGaster(r).includes(id) || stammer(r, plac, bana) !== false);
  const prova = (k) => {
    if (k === ordning.length) return true;
    const id = ordning[k];
    const egna = mojliga[id];
    const val = forst[id] && egna.includes(forst[id]) ? [forst[id], ...egna.filter((p) => p !== forst[id])] : egna;
    for (const p of val) {
      if (upptagen[p]) continue;
      plac[id] = p;
      upptagen[p] = true;
      if (funkar(id) && prova(k + 1)) return true;
      delete plac[id];
      upptagen[p] = false;
    }
    return false;
  };
  return prova(0) ? { ...plac } : null;
}

// Gör en bana färdig att spela. Regler utan texter lånar texterna från
// samma regel på en annan bana i samma fest.
function forbered(fNr, bNr) {
  const fest = S.fester[fNr];
  const def = fest.banor[bNr];
  const samma = (x, y) => x.typ === y.typ && x.a === y.a && JSON.stringify(x.b) === JSON.stringify(y.b) && x.ikon === y.ikon;
  const fyllI = (r) => {
    if (r.text) return { ...r };
    for (const annan of fest.banor) {
      for (const k of [...(annan.regler || []), annan.hemlig]) {
        if (k && k.text && samma(k, r)) return { ...k, ...r, text: k.text };
      }
    }
    return { ...r, text: standardText(r) };
  };
  return {
    def,
    namn: def.namn,
    ikon: def.ikon,
    bord: byggBord(def.bord),
    markeringar: def.markeringar || {},
    gaster: def.gaster,
    regler: (def.regler || []).map(fyllI),
    hemlig: def.hemlig ? fyllI(def.hemlig) : null,
  };
}

function standardText(r) {
  const a = gast(r.a).namn;
  const b = regelB(r).map((id) => gast(id).namn).join(t(" eller ", " or "));
  if (r.typ === "bredvid") return t(`${a} vill sitta bredvid ${b}.`, `${a} wants to sit next to ${b}.`);
  if (r.typ === "inteBredvid") return t(`${a} och ${b} ska inte sitta bredvid varandra.`, `${a} and ${b} should not sit together.`);
  if (r.typ === "mittemot") return t(`${a} vill sitta mittemot ${b}.`, `${a} wants to sit across from ${b}.`);
  if (r.typ === "sammaBord") return t(`${a} vill sitta vid samma bord som ${b}.`, `${a} wants to sit at the same table as ${b}.`);
  if (r.typ === "annatBord") return t(`${a} och ${b} ska sitta vid olika bord.`, `${a} and ${b} should sit at different tables.`);
  return t(`${a} ska sitta vid ${r.ikon}.`, `${a} sits at ${r.ikon}.`);
}

// Det som syns i tankebubblan för den hemliga önskan
function tanke(r) {
  if (r.tanke) return r.tanke;
  const b = regelB(r)[0];
  if (r.typ === "bredvid") return "💗" + gast(b).ansikte;
  if (r.typ === "mittemot") return "👀" + gast(b).ansikte;
  if (r.typ === "inteBredvid" || r.typ === "annatBord") return "🙄" + gast(b).ansikte;
  if (r.typ === "sammaBord") return "🤝" + gast(b).ansikte;
  return "💭" + r.ikon;
}

// ---------- Skärmstorlek och var allt ligger ----------

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
  emojiMinne.clear();
  gorLayout();
}

window.addEventListener("resize", anpassaStorlek);

// Hur stora önskemålen kan vara för att alla ska få plats
function kortStorlek(w, antal, maxH) {
  let svar = null;
  for (let c = 26; c >= 9; c -= 0.5) {
    const kw = c * 8.4;
    const kh = c * 3.5;
    const mellan = c * 0.5;
    const kol = Math.max(1, Math.min(antal, Math.floor((w + mellan) / (kw + mellan))));
    const rader = Math.ceil(antal / kol);
    const h = rader * kh + (rader - 1) * mellan;
    svar = { c, kw, kh, mellan, kol, rader, h };
    if (h <= maxH) break;
  }
  return svar;
}

// Väntbänken: där gästerna står innan de sitter
function bankMatt(w, antal, r) {
  const perRad = Math.max(1, Math.floor(w / (r * 2.7)));
  const rader = Math.ceil(antal / perRad);
  return { perRad, rader, radH: r * 2.75, h: rader * r * 2.75 + r * 0.5 };
}

// Hur stort ett bord är, mätt i stolsbredder, med stolar och bilder runt om.
// ox/oy är var bordet börjar (långbord) eller har sin mitt (runda bord).
function bordMatt(b) {
  if (b.typ === "rund") {
    const ring = Math.max((b.stolar * 1.05) / (Math.PI * 2), 1.2); // Där stolarna står
    const ytter = ring + 0.9;
    return { w: ytter * 2, h: ytter * 2, ox: ytter, oy: ytter, ring };
  }
  const gavlar = b.gavlar || "";
  // Vid en kortända behövs plats för stolen och bilden utanför den
  const vanster = gavlar.includes("v") ? 1.4 : 0.15;
  const hoger = gavlar.includes("h") ? 1.4 : 0.15;
  const under = b.enSida ? 0.2 : 1.35;
  return { w: vanster + b.perSida + hoger, h: 1.3 + 1.2 + under, ox: vanster, oy: 1.3 };
}

// Alla sätt att dela upp borden i rader, i tur och ordning: [[0, 1], [2]] betyder bord 0 och 1 i första raden
function radIndelningar(antal) {
  const svar = [];
  for (let mask = 0; mask < 1 << Math.max(0, antal - 1); mask++) {
    const rader = [[0]];
    for (let i = 1; i < antal; i++) {
      if (mask & (1 << (i - 1))) rader.push([i]);
      else rader[rader.length - 1].push(i);
    }
    svar.push(rader);
  }
  return svar;
}

function gorLayout() {
  if (!B) return;
  const vk = marginal.vanster + 14;
  const hk = bredd - marginal.hoger - 14;
  const ts = begr(Math.min(bredd, hojd) / 34, 13, 21); // Vanlig textstorlek
  // Under knapparna och rubriken. På den guidade banan behövs plats för instruktionen.
  const topp = marginal.topp + 80 + (B.def.guide ? ts * 2.6 : 0);
  const botten = hojd - marginal.botten - 12;
  const antalKort = B.regler.length + (visaHemligKort() ? 1 : 0);
  const rubrikH = ts * 2.1; // Rubriken "Gästernas önskemål" ovanför korten
  const n = B.gaster.length;
  const knappH = begr(hojd * 0.09, 46, 68);
  const liggande = bredd > hojd * 1.1;

  let bordZon;
  let regelZon;
  let knappZon;
  let kort;
  if (liggande) {
    const rw = begr((hk - vk) * 0.38, 230, 460);
    const zonTopp = marginal.topp + 80;
    regelZon = { x: hk - rw, y: zonTopp + rubrikH, w: rw, h: botten - knappH - 24 - zonTopp - rubrikH };
    knappZon = { x: hk - rw, y: botten - knappH, w: rw, h: knappH };
    bordZon = { x: vk, y: topp, w: hk - rw - 24 - vk, h: botten - topp };
    kort = kortStorlek(regelZon.w - 16, antalKort, regelZon.h - 12);
  } else {
    knappZon = { x: vk, y: botten - knappH, w: hk - vk, h: knappH };
    kort = kortStorlek(hk - vk - 16, antalKort, (knappZon.y - topp) * 0.36);
    regelZon = { x: vk, y: knappZon.y - 22 - kort.h, w: hk - vk, h: kort.h + 12 };
    bordZon = { x: vk, y: topp, w: hk - vk, h: regelZon.y - rubrikH - 14 - topp };
  }

  // Borden och bänken delar på bordZon. Prova alla sätt att lägga borden i
  // rader, och krymp stolarna tills allt får plats. Det sätt som ger störst
  // stolar vinner.
  const matt = B.bord.borden.map(bordMatt);
  const MELLAN = 0.35; // Mellanrum mellan borden, i stolsbredder
  let bast = null;
  for (const rader of radIndelningar(matt.length)) {
    const radW = rader.map((rad) => rad.reduce((summa, i) => summa + matt[i].w, 0) + (rad.length - 1) * MELLAN);
    const radH = rader.map((rad) => Math.max(...rad.map((i) => matt[i].h)));
    const totW = Math.max(...radW);
    const totH = radH.reduce((a, b) => a + b, 0) + (rader.length - 1) * MELLAN;
    let sp = Math.min(bordZon.w / totW, bordZon.h / totH, 130);
    let bank = bankMatt(bordZon.w, n, sp * 0.4);
    for (let k = 0; k < 80 && sp * totH + bank.h > bordZon.h; k++) {
      sp *= 0.96;
      bank = bankMatt(bordZon.w, n, sp * 0.4);
    }
    if (!bast || sp > bast.sp + 0.5) bast = { sp, bank, rader, radW, radH, totH };
  }
  const { sp, bank } = bast;
  const r = sp * 0.4;

  const stolar = {};
  const borden = [];
  let y = bordZon.y + (bordZon.h - bank.h - bast.totH * sp) / 2;
  bast.rader.forEach((rad, radNr) => {
    let x = bordZon.x + (bordZon.w - bast.radW[radNr] * sp) / 2;
    for (const nr of rad) {
      const b = B.bord.borden[nr];
      const m = matt[nr];
      const topp = y + ((bast.radH[radNr] - m.h) / 2) * sp;
      if (b.typ === "rund") {
        const cx = x + m.ox * sp;
        const cy = topp + m.oy * sp;
        borden.push({ typ: "rund", cx, cy, R: (m.ring - 0.45) * sp });
        for (let i = 0; i < b.stolar; i++) {
          const vinkel = -Math.PI / 2 + (i * Math.PI * 2) / b.stolar;
          const ut = [Math.cos(vinkel), Math.sin(vinkel)];
          stolar[b.bokstav + i] = { x: cx + ut[0] * m.ring * sp, y: cy + ut[1] * m.ring * sp, ut, sida: "rund", bord: nr };
        }
      } else {
        const bx = x + m.ox * sp;
        const by = topp + m.oy * sp;
        const bw = b.perSida * sp;
        const bh = sp * 1.2;
        borden.push({ typ: "lang", bx, by, bw, bh, gavlar: b.gavlar || "", enSida: !!b.enSida });
        for (const p of B.bord.platser) {
          if (p.bord !== nr) continue;
          let sx = bx + (p.i + 0.5) * sp;
          let sy = by + bh / 2;
          let ut = [0, 0];
          if (p.sida === "u") {
            sy = by - sp * 0.4;
            ut = [0, -1];
          } else if (p.sida === "n") {
            sy = by + bh + sp * 0.4;
            ut = [0, 1];
          } else if (p.sida === "v") {
            sx = bx - sp * 0.52;
            ut = [-1, 0];
          } else {
            sx = bx + bw + sp * 0.52;
            ut = [1, 0];
          }
          stolar[p.id] = { x: sx, y: sy, ut, sida: p.sida, bord: nr };
        }
      }
      x += (m.w + MELLAN) * sp;
    }
    y += (bast.radH[radNr] + MELLAN) * sp;
  });

  // Önskemålen
  const kortRutor = [];
  const radBredd = kort.kol * kort.kw + (kort.kol - 1) * kort.mellan;
  for (let i = 0; i < antalKort; i++) {
    const kol = i % kort.kol;
    const rad = Math.floor(i / kort.kol);
    kortRutor.push({
      x: regelZon.x + (regelZon.w - radBredd) / 2 + kol * (kort.kw + kort.mellan),
      y: regelZon.y + 6 + rad * (kort.kh + kort.mellan),
      w: kort.kw,
      h: kort.kh,
    });
  }

  // Knapparna
  const mellan = 12;
  const mormorW = Math.min((knappZon.w - mellan) * 0.42, 230);
  const serveraW = Math.min(knappZon.w - mellan - mormorW, 300);
  const knappStart = knappZon.x + (knappZon.w - mormorW - mellan - serveraW) / 2;

  L = {
    sp, r,
    stolar,
    borden,
    bank: { x: bordZon.x, y: bordZon.y + bordZon.h - bank.h, w: bordZon.w, h: bank.h, ...bank },
    kort: kortRutor,
    c: kort.c,
    // Papperet bakom önskemålen, med rubriken högst upp
    onskan: {
      x: regelZon.x + (regelZon.w - radBredd) / 2 - 8,
      y: regelZon.y - rubrikH,
      w: radBredd + 16,
      h: rubrikH + 12 + kort.h,
    },
    rubrikH,
    mormor: { x: knappStart, y: knappZon.y, w: mormorW, h: knappZon.h },
    servera: { x: knappStart + mormorW + mellan, y: knappZon.y, w: serveraW, h: knappZon.h },
    ts,
    guideY: marginal.topp + 80 + ts * 1.1,
  };
}

// Var gästerna på bänken står (de som inte sitter, i tur och ordning)
function bankPositioner() {
  const pos = {};
  const vantar = B.gaster.filter((id) => !plats[id]);
  const b = L.bank;
  vantar.forEach((id, k) => {
    const rad = Math.floor(k / b.perRad);
    const iRad = Math.min(b.perRad, vantar.length - rad * b.perRad);
    const kol = k % b.perRad;
    const steg = L.r * 2.7;
    pos[id] = {
      x: b.x + b.w / 2 + (kol - (iRad - 1) / 2) * steg,
      y: b.y + L.r * 1.25 + rad * b.radH,
    };
  });
  return pos;
}

function malPos(id, bankPos) {
  if (plats[id]) return L.stolar[plats[id]];
  return bankPos[id] || { x: bredd / 2, y: hojd };
}

// ---------- Banorna ----------

function bastaStjarnor(fNr, bNr) {
  return stjarnor[fNr + "-" + bNr] || 0;
}

function upplast(fNr, bNr) {
  return bNr === 0 || bastaStjarnor(fNr, bNr - 1) > 0;
}

function startaBana(fNr, bNr) {
  festNr = fNr;
  banNr = bNr;
  B = forbered(fNr, bNr);
  plats = {};
  for (const id of B.gaster) plats[id] = null;
  ritadPos = {};
  drag = null;
  vald = null;
  info = null;
  skak = {};
  mormorLosning = null;
  mormorKvar = S.mormorFragor;
  hemligHittad = bastaStjarnor(fNr, bNr) >= 3;
  tankeKlocka = 0;
  tankeNu = 0;
  markerade = null;
  guideLosning = null;
  guideKlar = false;
  guideKlarTid = 0;
  resultat = null;
  gorLayout();
  const bp = bankPositioner();
  for (const id of B.gaster) ritadPos[id] = { x: bp[id].x, y: hojd + L.r * 2 };
  uppdateraStatus(false);
  bytLage("intro");
}

function bytLage(nytt) {
  lage = nytt;
  lageTid = 0;
}

// Den hemliga önskan visas först när man har klarat banan en gång, så att det inte blir för mycket på en gång
function visaHemligKort() {
  return !!B.hemlig && (bastaStjarnor(festNr, banNr) > 0 || hemligHittad);
}

function allaSitter() {
  return B.gaster.every((id) => plats[id]);
}

// Räknar om vilka regler som stämmer. Spelar ett ljud när ett önskemål blir grönt.
function uppdateraStatus(medLjud = true) {
  const forra = status;
  status = B.regler.map((r) => stammer(r, plats, B));
  if (B.def.guide) {
    guideLosning = losa(B, plats);
    if (!guideKlar && status[0] === true) {
      guideKlar = true;
      guideKlarTid = 4;
    }
  }
  if (!medLjud || !S.visaGrona) return;
  if (status.some((s, i) => s === true && forra[i] !== true)) effekt("ding");
  else if (status.some((s, i) => s === false && forra[i] !== false)) effekt("fel");
}

// Sätter gästen på en stol. Sitter någon där redan byter de plats.
function satt(id, stol) {
  const forra = plats[id];
  if (stol) {
    const dar = B.gaster.find((g) => plats[g] === stol);
    if (dar && dar !== id) plats[dar] = forra;
  }
  plats[id] = stol;
  effekt(stol ? "plopp" : "lyft");
  uppdateraStatus();
}

// Närmaste stol inom räckhåll från en punkt
function narmasteStol(x, y) {
  let basta = null;
  let bastAvst = L.sp * 0.75;
  for (const [id, s] of Object.entries(L.stolar)) {
    const d = Math.hypot(x - s.x, y - s.y);
    if (d < bastAvst) {
      bastAvst = d;
      basta = id;
    }
  }
  return basta;
}

function gastVid(x, y) {
  const bp = bankPositioner();
  let basta = null;
  let bastAvst = L.r * 1.2;
  for (const id of B.gaster) {
    const p = ritadPos[id] || malPos(id, bp);
    const d = Math.hypot(x - p.x, y - p.y);
    if (d < bastAvst) {
      bastAvst = d;
      basta = id;
    }
  }
  return basta;
}

function visaInfo(rader, x, y) {
  info = { rader, x, y, tid: 7 };
}

// En slumpad replik, men aldrig samma två gånger i rad
const senastPrat = {};
function nastaPrat(id) {
  const lista = gast(id).prat;
  let nr = Math.floor(Math.random() * lista.length);
  if (lista.length > 1 && nr === senastPrat[id]) nr = (nr + 1) % lista.length;
  senastPrat[id] = nr;
  return lista[nr];
}

function infoOmGast(id) {
  const g = gast(id);
  const p = ritadPos[id];
  const rader = [[`${g.ansikte} ${g.namn}`, "rubrik"], [g.om, "vanlig"]];
  // Gästens önskemål, med en bock eller ett kryss
  B.regler.forEach((r, i) => {
    if (!regelGaster(r).includes(id)) return;
    const s = status[i];
    rader.push([`${s === true ? "✅" : s === false ? "❌" : "⬜"} ${r.text}`, "vanlig"]);
  });
  if (visaHemligKort() && B.hemlig.a === id) {
    if (hemligHittad) rader.push([`⭐ ${B.hemlig.text}`, "vanlig"]);
    else rader.push([t(`💭 Tänker på: ${tanke(B.hemlig)}`, `💭 Is thinking of: ${tanke(B.hemlig)}`), "vanlig"]);
    tankeNu = 4;
  }
  if (g.prat.length) rader.push([`”${nastaPrat(id)}”`, "citat"]);
  visaInfo(rader, p.x, p.y - L.r);
}

function infoOmRegel(i) {
  const k = L.kort[i];
  if (i === B.regler.length) {
    if (hemligHittad) {
      const h = B.hemlig;
      visaInfo([[h.text, "rubrik"], [`${gast(h.vem || h.a).namn}: ”${h.sager}”`, "citat"]], k.x + k.w / 2, k.y);
    } else {
      visaInfo([
        [t("Någon har en hemlig önskan!", "Someone has a secret wish!"), "rubrik"],
        [t("Gästen med 💭 tänker på den. Titta på tankebubblan: vad vill hen?", "The guest with 💭 is thinking about it. Look at the thought bubble: what do they want?"), "vanlig"],
      ], k.x + k.w / 2, k.y);
      markerade = { ids: [B.hemlig.a], tid: 2.5 };
      tankeNu = 4;
    }
    return;
  }
  const r = B.regler[i];
  markerade = { ids: regelGaster(r), tid: 2.5 };
  const rader = [[r.text, "rubrik"]];
  if (r.sager) rader.push([`${gast(r.vem || r.a).namn}: ”${r.sager}”`, "citat"]);
  visaInfo(rader, k.x + k.w / 2, k.y);
}

// Mormor flyttar en gäst till rätt plats
function fragaMormor() {
  const m = L.mormor;
  if (mormorKvar <= 0) {
    effekt("fel");
    visaInfo([[t("👵 Nu vilar mormor. Du får klura själv!", "👵 Grandma is resting now. You'll have to figure it out!"), "rubrik"]], m.x + m.w / 2, m.y);
    return;
  }
  if (!mormorLosning) mormorLosning = losa(B, plats);
  const los = mormorLosning;
  if (!los) return;
  const fel = B.gaster.filter((id) => plats[id] !== los[id]);
  if (fel.length === 0) {
    visaInfo([[t("👵 Det ser väl fint ut? Servera!", "👵 Looks lovely to me. Serve!"), "rubrik"]], m.x + m.w / 2, m.y);
    return;
  }
  mormorKvar -= 1;
  // Helst någon som sitter fel, annars någon som inte sitter än
  const sitterFel = fel.filter((id) => plats[id] && B.regler.some((r, i) => status[i] === false && regelGaster(r).includes(id)));
  const id = sitterFel[0] || fel.find((g) => !plats[g]) || fel[0];
  satt(id, los[id]);
  effekt("magi");
  vald = null;
  const s = L.stolar[los[id]];
  skak["gast-" + id] = 0.6;
  visaInfo([[`👵 ${slumpa(S.mormorSager)}`, "rubrik"], [`${gast(id).ansikte} ➡️ ${gast(id).namn}`, "vanlig"]], s.x, s.y - L.r);
}

function servera() {
  if (!allaSitter()) {
    effekt("fel");
    skak.bank = 0.5;
    const s = L.servera;
    visaInfo([[t("Alla gäster måste sitta först!", "All the guests have to sit down first!"), "rubrik"]], s.x + s.w / 2, s.y);
    return;
  }
  uppdateraStatus(false);
  info = null;
  vald = null;
  visaResultat();
}

function visaResultat() {
  const fel = status.filter((s) => s !== true).length;
  const hemligOk = B.hemlig ? stammer(B.hemlig, plats, B) === true : false;
  let antal = 1;
  if (fel === 0) antal = 2;
  if (fel === 0 && (hemligOk || !B.hemlig)) antal = 3;
  const nyckel = festNr + "-" + banNr;
  const forra = stjarnor[nyckel] || 0;
  if (antal > forra) {
    stjarnor[nyckel] = antal;
    sparaStjarnor();
  }
  if (hemligOk && fel === 0) hemligHittad = true;
  resultat = { antal, fel, hemligOk, nytt: antal > forra, forstaGangen: forra === 0 };
  bytLage("resultat");
  gorLayout();
  effekt(fel === 0 ? "fanfar" : "tuta");
}

function forsokIgen() {
  resultat = null;
  mormorLosning = null;
  // Önskemålen som inte stämde skakar, så att man ser vad som blev fel
  status.forEach((s, i) => {
    if (s === false) skak["kort-" + i] = 0.8;
  });
  bytLage("placera");
}

function nastaBana() {
  const fest = S.fester[festNr];
  if (banNr + 1 < fest.banor.length) startaBana(festNr, banNr + 1);
  else bytLage("meny");
}

function totalaStjarnor(fNr) {
  return S.fester[fNr].banor.reduce((summa, _, i) => summa + bastaStjarnor(fNr, i), 0);
}

function titel(andel) {
  let namn = S.titlar[0].namn;
  for (const x of S.titlar) if (andel >= x.andel) namn = x.namn;
  return namn;
}

// ---------- Styrning ----------

let pekare = null;

canvas.addEventListener("pointerdown", (e) => {
  e.preventDefault();
  startaLjud();
  const x = e.clientX;
  const y = e.clientY;

  if (lage === "meny") {
    for (const k of menyKnappar) {
      if (inuti(x, y, k) && upplast(k.fest, k.bana)) {
        effekt("plopp");
        startaBana(k.fest, k.bana);
        return;
      }
    }
    return;
  }
  if (lage === "intro") {
    if (lageTid > 0.5) bytLage("placera");
    return;
  }
  if (lage === "resultat") {
    for (const k of resultatKnappar) {
      if (inuti(x, y, k) && lageTid > 0.6) {
        effekt("plopp");
        k.gor();
        return;
      }
    }
    return;
  }
  if (lage !== "placera") return;

  if (inuti(x, y, L.servera)) {
    servera();
    return;
  }
  if (inuti(x, y, L.mormor)) {
    fragaMormor();
    return;
  }
  const id = gastVid(x, y);
  if (id) {
    drag = { id, x, y, startX: x, startY: y, flyttat: false };
    pekare = e.pointerId;
    try {
      canvas.setPointerCapture(e.pointerId);
    } catch (fel) {
      // Gör inget – det fungerar ändå
    }
    return;
  }
  // Har man valt en gäst kan man trycka på en stol för att sätta gästen där
  const stol = narmasteStol(x, y);
  if (vald && stol) {
    satt(vald, stol);
    vald = null;
    info = null;
    return;
  }
  if (vald && inuti(x, y, L.bank) && plats[vald]) {
    satt(vald, null);
    vald = null;
    info = null;
    return;
  }
  for (let i = 0; i < L.kort.length; i++) {
    if (inuti(x, y, L.kort[i])) {
      vald = null;
      infoOmRegel(i);
      effekt("pling");
      return;
    }
  }
  vald = null;
  info = null;
});

canvas.addEventListener("pointermove", (e) => {
  if (!drag || e.pointerId !== pekare) return;
  drag.x = e.clientX;
  drag.y = e.clientY;
  if (!drag.flyttat && Math.hypot(drag.x - drag.startX, drag.y - drag.startY) > 10) {
    drag.flyttat = true;
    info = null;
    vald = null;
    effekt("lyft");
  }
});

function slapp(e) {
  if (!drag || e.pointerId !== pekare) return;
  const d = drag;
  drag = null;
  pekare = null;
  if (lage !== "placera") return;
  if (d.flyttat) {
    ritadPos[d.id] = { x: d.x, y: d.y };
    const stol = narmasteStol(d.x, d.y);
    if (stol) satt(d.id, stol);
    else if (plats[d.id]) satt(d.id, null);
    return;
  }
  // Ett tryck utan att dra: välj gästen (eller byt plats med den som redan är vald)
  if (vald && vald !== d.id && (plats[d.id] || plats[vald])) {
    const stol = plats[d.id];
    if (stol) satt(vald, stol);
    else satt(d.id, plats[vald]);
    vald = null;
    info = null;
    return;
  }
  if (vald === d.id) {
    vald = null;
    info = null;
    return;
  }
  vald = d.id;
  infoOmGast(d.id);
  effekt("pling");
}
canvas.addEventListener("pointerup", slapp);
canvas.addEventListener("pointercancel", slapp);

window.addEventListener("keydown", (e) => {
  if (e.key === "p" || e.key === "Escape") {
    if (lage === "paus") fortsatt();
    else pausa();
    return;
  }
  if (e.key !== " " && e.key !== "Enter") return;
  startaLjud();
  if (lage === "intro") bytLage("placera");
  else if (lage === "placera" && allaSitter()) servera();
  else if (lage === "resultat" && resultatKnappar.length) resultatKnappar[resultatKnappar.length - 1].gor();
});

// Stoppa nyp-zoom i Safari på iPad/iPhone
document.addEventListener("gesturestart", (e) => e.preventDefault());

// ---------- Paus ----------

function pausa() {
  if (lage === "meny" || lage === "paus") return;
  lageForePaus = lage;
  lage = "paus";
  drag = null;
  pausmeny.hidden = false;
  tystaLjud(true);
  document.getElementById("fortsatt").focus();
}

function fortsatt() {
  if (lage !== "paus") return;
  lage = lageForePaus;
  pausmeny.hidden = true;
  startaLjud();
  tystaLjud(false);
}

function visaLjudKnapp() {
  ljudKnapp.textContent = ljudPa ? t("🔊 Ljud: på", "🔊 Sound: on") : t("🔈 Ljud: av", "🔈 Sound: off");
}

pausKnapp.addEventListener("click", pausa);
document.getElementById("fortsatt").addEventListener("click", fortsatt);
document.getElementById("borjaOm").addEventListener("click", () => {
  pausmeny.hidden = true;
  tystaLjud(false);
  startaBana(festNr, banNr);
});
document.getElementById("valjBana").addEventListener("click", () => {
  pausmeny.hidden = true;
  tystaLjud(false);
  bytLage("meny");
});
ljudKnapp.addEventListener("click", () => {
  ljudPa = !ljudPa;
  sparaInstallning("ljud-bord", ljudPa ? "pa" : "av");
  visaLjudKnapp();
});
visaLjudKnapp();

function visaMusikKnapp() {
  musikKnapp.textContent = musikPa ? t("♪ Musik: på", "♪ Music: on") : t("♪ Musik: av", "♪ Music: off");
}

musikKnapp.addEventListener("click", () => {
  musikPa = !musikPa;
  sparaInstallning("musik-bord", musikPa ? "pa" : "av");
  visaMusikKnapp();
});

// Pausa av sig själv om man byter app eller flik
document.addEventListener("visibilitychange", () => {
  if (document.hidden) pausa();
});

// ---------- Uppdatera (varje bildruta) ----------

function uppdatera(dt) {
  if (lage === "paus") return;
  tid += dt;
  lageTid += dt;
  for (const k of Object.keys(skak)) {
    skak[k] -= dt;
    if (skak[k] <= 0) delete skak[k];
  }
  if (info) {
    info.tid -= dt;
    if (info.tid <= 0) info = null;
  }
  if (!B || lage === "meny") return;

  // Gästerna glider mot sina platser
  const bp = bankPositioner();
  const fart = 1 - Math.exp(-dt * 14);
  for (const id of B.gaster) {
    const mal = malPos(id, bp);
    const p = ritadPos[id] || (ritadPos[id] = { x: mal.x, y: mal.y });
    p.x += (mal.x - p.x) * fart;
    p.y += (mal.y - p.y) * fart;
  }

  if (lage === "placera") tankeKlocka += dt;
  tankeNu = Math.max(0, tankeNu - dt);
  if (lage === "placera" && guideKlar) guideKlarTid = Math.max(0, guideKlarTid - dt);
  if (markerade) {
    markerade.tid -= dt;
    if (markerade.tid <= 0) markerade = null;
  }

}

// ---------- Rita: hjälpfunktioner ----------

// Text med mörk kant, för rutor och skärmar
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

// Vanlig text utan kant. Krymper texten om den inte får plats i maxBredd.
function skriv(text, x, y, storlek, farg = "#4a3220", just = "center", stil = "bold", maxBredd = 0) {
  ctx.font = `${stil} ${storlek}px ${TYPSNITT}`;
  if (maxBredd > 0) {
    const w = ctx.measureText(text).width;
    if (w > maxBredd) ctx.font = `${stil} ${storlek * (maxBredd / w)}px ${TYPSNITT}`;
  }
  ctx.textAlign = just;
  ctx.textBaseline = "middle";
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

function ritaEmoji(bild, x, y, storlek) {
  const liten = emojiBild(bild, storlek);
  const sida = liten.width / pixelSkala;
  ctx.drawImage(liten, x - sida / 2, y - sida / 2, sida, sida);
}

function cirkel(x, y, r) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
}

// ---------- Rita: rummet och bordet ----------

function ritaRum() {
  const g = ctx.createLinearGradient(0, 0, 0, hojd);
  g.addColorStop(0, "#f7e9cd");
  g.addColorStop(1, "#ead0a4");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, bredd, hojd);

  // Flaggspel högst upp
  const farger = ["#e74c3c", "#f1c40f", "#2ecc71", "#3498db", "#9b59b6"];
  const steg = 34;
  const y0 = marginal.topp + 2;
  ctx.strokeStyle = "rgba(90, 60, 30, 0.5)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(0, y0);
  ctx.lineTo(bredd, y0);
  ctx.stroke();
  for (let i = 0, x = 4; x < bredd; i++, x += steg) {
    ctx.fillStyle = farger[i % farger.length];
    ctx.beginPath();
    ctx.moveTo(x, y0);
    ctx.lineTo(x + steg - 6, y0);
    ctx.lineTo(x + (steg - 6) / 2, y0 + 16);
    ctx.closePath();
    ctx.fill();
  }
}

function ritaBord() {
  const { sp } = L;
  const tarta = lage === "resultat";
  L.borden.forEach((b, nr) => {
    // Mitt på bordet: blommor, och tårta på första bordet när man har serverat
    const mitten = tarta && nr === 0 ? "🎂" : "💐";
    if (b.typ === "rund") {
      ctx.fillStyle = "rgba(170, 70, 60, 0.18)";
      cirkel(b.cx, b.cy, b.R + sp * 1.25);
      ctx.fill();
      ctx.fillStyle = "rgba(90, 50, 20, 0.18)";
      cirkel(b.cx, b.cy + sp * 0.08, b.R);
      ctx.fill();
      ctx.fillStyle = "#fffdf6";
      ctx.strokeStyle = "#dccaa8";
      ctx.lineWidth = 2;
      cirkel(b.cx, b.cy, b.R);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "rgba(231, 120, 120, 0.22)";
      cirkel(b.cx, b.cy, b.R * 0.45);
      ctx.fill();
      ritaEmoji(mitten, b.cx, b.cy, sp * (mitten === "🎂" ? 0.55 : 0.4));
      return;
    }
    const { bx, by, bw, bh, gavlar } = b;
    // Mattan under bordet
    const mv = gavlar.includes("v") ? 1.15 : 0.35;
    const mh = gavlar.includes("h") ? 1.15 : 0.35;
    ctx.fillStyle = "rgba(170, 70, 60, 0.18)";
    rundRekt(ctx, bx - sp * mv, by - sp * 1.0, bw + sp * (mv + mh), bh + sp * (b.enSida ? 1.35 : 2.0), sp * 0.3);
    ctx.fill();
    // Duken
    ctx.fillStyle = "rgba(90, 50, 20, 0.18)";
    rundRekt(ctx, bx - sp * 0.05, by + sp * 0.08, bw + sp * 0.1, bh, sp * 0.18);
    ctx.fill();
    ctx.fillStyle = "#fffdf6";
    ctx.strokeStyle = "#dccaa8";
    ctx.lineWidth = 2;
    rundRekt(ctx, bx - sp * 0.05, by, bw + sp * 0.1, bh, sp * 0.18);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "rgba(231, 120, 120, 0.25)";
    ctx.fillRect(bx, by + bh / 2 - sp * 0.12, bw, sp * 0.24);
    ritaEmoji(mitten, bx + bw / 2, by + bh / 2, sp * (mitten === "🎂" ? 0.6 : 0.45));
    if (bw >= sp * 4) {
      ritaEmoji("🕯️", bx + bw * 0.22, by + bh / 2, sp * 0.3);
      ritaEmoji("🕯️", bx + bw * 0.78, by + bh / 2, sp * 0.3);
    }
  });

  // Tallrikarna, med tårta på när man har serverat
  for (const [id, s] of Object.entries(L.stolar)) {
    const b = L.borden[s.bord];
    let px = s.x;
    let py = s.y;
    if (b.typ === "rund") {
      px = b.cx + s.ut[0] * (b.R - sp * 0.25);
      py = b.cy + s.ut[1] * (b.R - sp * 0.25);
    } else if (s.sida === "u") py = b.by + sp * 0.27;
    else if (s.sida === "n") py = b.by + b.bh - sp * 0.27;
    else if (s.sida === "v") px = b.bx + sp * 0.22;
    else px = b.bx + b.bw - sp * 0.22;
    ctx.fillStyle = "#ffffff";
    ctx.strokeStyle = "#cfd6de";
    ctx.lineWidth = 2;
    cirkel(px, py, sp * 0.17);
    ctx.fill();
    ctx.stroke();
    if (tarta && B.gaster.some((g) => plats[g] === id)) ritaEmoji("🍰", px, py, sp * 0.24);
  }
}

function ritaStolar() {
  const { r } = L;
  const visaLedig = (drag && drag.flyttat) || vald;
  const nara = drag && drag.flyttat ? narmasteStol(drag.x, drag.y) : null;
  for (const [id, s] of Object.entries(L.stolar)) {
    const x = s.x + s.ut[0] * r * 0.15;
    const y = s.y + s.ut[1] * r * 0.15;
    const sida = r * 2.15;
    const rund = s.sida === "rund";
    const form = (krymp) => {
      if (rund) cirkel(x, y, sida / 2 - krymp);
      else rundRekt(ctx, x - sida / 2 + krymp, y - sida / 2 + krymp, sida - krymp * 2, sida - krymp * 2, r * 0.4);
    };
    ctx.fillStyle = id === nara ? "#ffe08a" : "#c08a52";
    ctx.strokeStyle = "#8a5a2b";
    ctx.lineWidth = 2;
    form(0);
    ctx.fill();
    ctx.stroke();
    // Lediga stolar lyser lite när man håller i en gäst
    if (visaLedig && !B.gaster.some((g) => plats[g] === id)) {
      ctx.strokeStyle = `rgba(255, 255, 255, ${0.5 + Math.sin(tid * 6) * 0.3})`;
      ctx.lineWidth = 3;
      form(4);
      ctx.stroke();
    }
    const bild = B.markeringar[id];
    if (bild) {
      const mx = s.x + s.ut[0] * r * 1.55;
      const my = s.y + s.ut[1] * r * 1.55;
      ctx.fillStyle = "#ffffff";
      ctx.strokeStyle = "#dccaa8";
      cirkel(mx, my, r * 0.52);
      ctx.fill();
      ctx.stroke();
      ritaEmoji(bild, mx, my, r * 0.62);
    }
  }
}

// En gäst: ett ansikte i en rund tröja, och en liten sak som gör att man känner igen hen
function ritaGast(id, x, y, r, val = {}) {
  const g = gast(id);
  if (val.skugga !== false) {
    ctx.fillStyle = "rgba(60, 30, 10, 0.18)";
    ctx.beginPath();
    ctx.ellipse(x, y + r * 0.9, r * 0.8, r * 0.24, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  if (val.ring) {
    ctx.strokeStyle = val.ring;
    ctx.lineWidth = Math.max(3, r * 0.2);
    cirkel(x, y, r * 1.18);
    ctx.stroke();
  }
  ctx.fillStyle = g.troja;
  cirkel(x, y, r);
  ctx.fill();
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = Math.max(1.5, r * 0.1);
  ctx.stroke();
  ritaEmoji(g.ansikte, x, y - r * 0.02, r * 1.25);
  if (g.sak) {
    const sx = x + r * 0.74;
    const sy = y + r * 0.62;
    ctx.fillStyle = "#ffffff";
    cirkel(sx, sy, r * 0.42);
    ctx.fill();
    ctx.strokeStyle = g.troja;
    ctx.lineWidth = Math.max(1, r * 0.07);
    ctx.stroke();
    ritaEmoji(g.sak, sx, sy, r * 0.52);
  }
}

function ritaGaster() {
  const { r } = L;
  for (const id of B.gaster) {
    if (drag && drag.flyttat && drag.id === id) continue;
    const p = ritadPos[id];
    let x = p.x;
    let y = p.y;
    if (skak["gast-" + id]) y -= Math.abs(Math.sin(tid * 18)) * r * 0.3;
    if (!plats[id] && skak.bank) x += Math.sin(tid * 50) * r * 0.15;
    let ring = null;
    if (vald === id) ring = `rgba(255, 210, 63, ${0.7 + Math.sin(tid * 8) * 0.3})`;
    if (markerade && markerade.ids.includes(id)) {
      ring = `rgba(255, 190, 0, ${0.6 + Math.sin(tid * 10) * 0.4})`;
      y -= Math.abs(Math.sin(tid * 7)) * r * 0.2;
    }
    ritaGast(id, x, y, r, { ring });
    // Sitter gästen visar ett litet ansikte om hen är nöjd eller inte
    const humor = plats[id] && (S.visaGrona || lage !== "placera") ? gastHumor(id) : null;
    if (humor !== null) {
      const hx = x - r * 0.74;
      const hy = y - r * 0.66;
      ctx.fillStyle = humor ? "#c9f1c4" : "#ffd3cb";
      cirkel(hx, hy, r * 0.4);
      ctx.fill();
      ritaEmoji(humor ? "😊" : "😟", hx, hy, r * 0.56);
    }
    // Gästen med den hemliga önskan har en liten tankebubbla
    if (lage === "placera" && visaHemligKort() && B.hemlig.a === id) {
      const tx = x + r * 0.74;
      const ty = y - r * 0.7 - Math.abs(Math.sin(tid * 2.5)) * r * 0.08;
      ctx.fillStyle = "#f3ecff";
      ctx.strokeStyle = "#a991d4";
      ctx.lineWidth = 1.5;
      cirkel(tx, ty, r * 0.42);
      ctx.fill();
      ctx.stroke();
      ritaEmoji("💭", tx, ty, r * 0.58);
    }
    // Namnet syns på bänken
    if (!plats[id]) skriv(gast(id).namn, x, y + r * 1.42, Math.max(10, r * 0.36), "#4a3220", "center", "bold", r * 2.6);
  }
  // 💢 mellan två som sitter bredvid varandra fast de inte vill
  if (S.visaGrona || lage !== "placera") {
    B.regler.forEach((regel, i) => {
      if (regel.typ !== "inteBredvid" || status[i] !== false) return;
      for (const b of regelB(regel)) {
        const pa = plats[regel.a];
        const pb = plats[b];
        if (!pa || !pb || !B.bord.granne[pa].includes(pb)) continue;
        const a1 = ritadPos[regel.a];
        const b1 = ritadPos[b];
        ritaEmoji("💢", (a1.x + b1.x) / 2, (a1.y + b1.y) / 2 - r * 0.9 - Math.abs(Math.sin(tid * 6)) * r * 0.15, r * 0.7);
      }
    });
  }
  if (lage === "placera" && allaSitter()) {
    skriv(t("Alla sitter! 🍽️", "Everyone is seated! 🍽️"), L.bank.x + L.bank.w / 2, L.bank.y + L.r * 1.2, L.ts * 1.1, "#4a3220");
  }
}

// Är gästen nöjd? true = alla hens önskemål stämmer, false = något stämmer inte, null = inget att säga än
function gastHumor(id) {
  let svar = null;
  B.regler.forEach((r, i) => {
    if (!regelGaster(r).includes(id) || status[i] === null) return;
    if (status[i] === false) svar = false;
    else if (svar === null) svar = true;
  });
  return svar;
}

function ritaDragen() {
  if (!drag || !drag.flyttat) return;
  ritaGast(drag.id, drag.x, drag.y - L.r * 0.3, L.r * 1.12);
}

// ---------- Rita: önskemålen och knapparna ----------

// Papperet med rubriken "Gästernas önskemål" bakom korten
function ritaOnskelista() {
  const o = L.onskan;
  ctx.fillStyle = "rgba(60, 30, 10, 0.15)";
  rundRekt(ctx, o.x, o.y + 4, o.w, o.h, 16);
  ctx.fill();
  ctx.fillStyle = "#fffdf7";
  ctx.strokeStyle = "#d9c6a5";
  ctx.lineWidth = 2;
  rundRekt(ctx, o.x, o.y, o.w, o.h, 16);
  ctx.fill();
  ctx.stroke();
  const nojda = status.filter((x) => x === true).length;
  const visa = S.visaGrona || lage !== "placera";
  const rubrik = t("📋 Gästernas önskemål", "📋 The guests' wishes") + (visa ? `   ✅ ${nojda}/${status.length}` : "");
  skriv(rubrik, o.x + o.w / 2, o.y + L.rubrikH * 0.55, Math.min(L.ts * 1.05, L.rubrikH * 0.5), "#4a3220", "center", "bold", o.w - 20);
}

function ritaKort(i) {
  const k = L.kort[i];
  const c = L.c;
  const arHemlig = i === B.regler.length;
  const r = arHemlig ? B.hemlig : B.regler[i];
  const visa = S.visaGrona || lage === "resultat";
  const s = arHemlig ? null : status[i];
  const dx = skak["kort-" + i] ? Math.sin(tid * 45) * c * 0.35 : 0;
  const x = k.x + dx;

  let bakgrund = "#fffaf0";
  if (arHemlig) bakgrund = hemligHittad ? "#fff1c4" : "#f3ecff";
  else if (visa && s === true) bakgrund = "#c9f1c4";
  else if (visa && s === false) bakgrund = "#ffd3cb";
  ctx.fillStyle = bakgrund;
  ctx.strokeStyle = arHemlig && !hemligHittad ? "#a991d4" : "#d9c6a5";
  ctx.lineWidth = 2;
  if (arHemlig && !hemligHittad) ctx.setLineDash([6, 5]);
  rundRekt(ctx, x, k.y, k.w, k.h, c * 0.6);
  ctx.fill();
  ctx.stroke();
  ctx.setLineDash([]);

  const my = k.y + c * 1.4;
  const vx = x + c * 1.5;
  const hx = x + k.w - c * 1.5;
  const mx = x + k.w / 2;
  const ordY = k.y + k.h - c * 0.62;

  if (arHemlig && !hemligHittad) {
    ritaEmoji("💭", vx, my, c * 1.6);
    ritaEmoji("❓", mx, my, c * 1.2);
    ritaEmoji("⭐", hx, my, c * 1.4);
    skriv(t("en hemlig önskan", "a secret wish"), mx, ordY, c * 0.68, "#7a62a8", "center", "bold", k.w - c * 0.8);
    return;
  }

  ritaGast(r.a, vx, my, c, { skugga: false });
  ritaEmoji(REGEL_IKON[r.typ], mx, my, c * 1.15);
  if (r.typ === "plats") {
    ctx.fillStyle = "#c08a52";
    ctx.strokeStyle = "#8a5a2b";
    ctx.lineWidth = 1.5;
    rundRekt(ctx, hx - c, my - c, c * 2, c * 2, c * 0.4);
    ctx.fill();
    ctx.stroke();
    ritaEmoji(r.ikon, hx, my, c * 1.3);
  } else {
    const bs = regelB(r);
    if (bs.length === 1) {
      ritaGast(bs[0], hx, my, c, { skugga: false });
    } else {
      ritaGast(bs[0], hx - c * 0.5, my - c * 0.2, c * 0.72, { skugga: false });
      ritaGast(bs[1], hx + c * 0.42, my + c * 0.25, c * 0.72, { skugga: false });
    }
  }
  skriv(arHemlig ? "⭐ " + REGEL_ORD[r.typ] : REGEL_ORD[r.typ], mx, ordY, c * 0.68, "#4a3220", "center", "bold", k.w - c * 0.8);

  // En bock eller ett kryss i hörnet
  if (visa && (s === true || s === false)) {
    const bx = x + k.w - c * 0.45;
    const by = k.y + c * 0.45;
    ctx.fillStyle = s ? "#3fbf5a" : "#e0503c";
    cirkel(bx, by, c * 0.42);
    ctx.fill();
    skriv(s ? "✓" : "✗", bx, by + c * 0.03, c * 0.6, "#ffffff");
  }
}

function ritaKnapp(rekt, text, farg, aktiv = true, liten = "") {
  ctx.fillStyle = "rgba(60, 30, 10, 0.25)";
  rundRekt(ctx, rekt.x, rekt.y + 4, rekt.w, rekt.h, 18);
  ctx.fill();
  ctx.fillStyle = aktiv ? farg : "#d9d2c6";
  rundRekt(ctx, rekt.x, rekt.y, rekt.w, rekt.h, 18);
  ctx.fill();
  const storlek = Math.min(rekt.h * 0.38, 26);
  if (liten) {
    skriv(text, rekt.x + rekt.w / 2, rekt.y + rekt.h * 0.4, storlek, aktiv ? "#2b1d0e" : "#857a6b", "center", "bold", rekt.w - 16);
    skriv(liten, rekt.x + rekt.w / 2, rekt.y + rekt.h * 0.76, storlek * 0.62, aktiv ? "#6b5a45" : "#857a6b", "center", "bold", rekt.w - 16);
  } else {
    skriv(text, rekt.x + rekt.w / 2, rekt.y + rekt.h / 2, storlek, aktiv ? "#2b1d0e" : "#857a6b", "center", "bold", rekt.w - 16);
  }
}

function ritaKnappar() {
  if (lage !== "placera" && lage !== "intro") return;
  if (mormorKvar > 0) {
    const kvarText = mormorKvar === 1 ? t("1 fråga kvar", "1 question left") : t(`${mormorKvar} frågor kvar`, `${mormorKvar} questions left`);
    ritaKnapp(L.mormor, t("👵 Fråga mormor", "👵 Ask Grandma"), "#ffd95e", true, kvarText);
  } else {
    ritaKnapp(L.mormor, t("👵 Mormor vilar", "👵 Grandma is resting"), "#ffd95e", false, t("Inga frågor kvar", "No questions left"));
  }
  const kvar = B.gaster.filter((id) => !plats[id]).length;
  if (kvar === 0) {
    const puls = 1 + Math.sin(tid * 5) * 0.03;
    const s = L.servera;
    ctx.save();
    ctx.translate(s.x + s.w / 2, s.y + s.h / 2);
    ctx.scale(puls, puls);
    ritaKnapp({ x: -s.w / 2, y: -s.h / 2, w: s.w, h: s.h }, t("🍽️ Servera!", "🍽️ Serve!"), "#6fd27c");
    ctx.restore();
  } else {
    ritaKnapp(L.servera, t("🍽️ Servera", "🍽️ Serve"), "#6fd27c", false, t(`${kvar} kvar att placera`, `${kvar} left to seat`));
  }
}

// ---------- Guiden på första banan: en hand visar vad man ska göra ----------

// Handen visar bara hur man gör med det första önskemålet. Resten får man klura ut själv.
function guideSteg() {
  if (!B.def.guide || lage !== "placera" || !guideLosning) return null;
  if (guideKlar) {
    if (guideKlarTid <= 0) return null;
    return { text: t("Bra! Nu får du klura själv 🧩", "Well done! Now it's your turn to figure it out 🧩"), ingenPil: true };
  }
  const r = B.regler[0];
  // Flytta helst en av gästerna som inte sitter alls
  const fel = regelGaster(r).filter((id) => plats[id] !== guideLosning[id]);
  const id = fel.find((g) => !plats[g]) || fel[0];
  return { text: r.text, kort: 0, id, stol: id ? guideLosning[id] : null };
}

function ritaGuide() {
  const g = guideSteg();
  if (!g) return;
  const r = L.r;
  const dras = drag && drag.flyttat;

  // Önskemålet det gäller lyser
  if (g.kort !== undefined) {
    const k = L.kort[g.kort];
    ctx.strokeStyle = `rgba(255, 180, 0, ${0.6 + Math.sin(tid * 6) * 0.4})`;
    ctx.lineWidth = 5;
    rundRekt(ctx, k.x - 4, k.y - 4, k.w + 8, k.h + 8, L.c * 0.7);
    ctx.stroke();
  }

  // Handen drar gästen till rätt stol
  if (g.id && g.stol && !dras) {
    const fran = ritadPos[g.id];
    const till = L.stolar[g.stol];
    const sida = r * 2.3;
    ctx.strokeStyle = `rgba(255, 180, 0, ${0.6 + Math.sin(tid * 6) * 0.4})`;
    ctx.lineWidth = 4;
    rundRekt(ctx, till.x - sida / 2, till.y - sida / 2, sida, sida, r * 0.45);
    ctx.stroke();
    const cykel = (tid % 2.4) / 2.4;
    const del = begr((cykel - 0.15) / 0.55, 0, 1);
    const e = del * del * (3 - 2 * del);
    const x = fran.x + (till.x - fran.x) * e;
    const y = fran.y + (till.y - fran.y) * e;
    const synlig = begr(Math.min(cykel * 8, (1 - cykel) * 8), 0, 1);
    ctx.globalAlpha = synlig * 0.45;
    if (cykel > 0.15) ritaGast(g.id, x, y, r, { skugga: false });
    ctx.globalAlpha = synlig;
    ritaEmoji("👆", x + r * 0.2, y + r * 0.75, r * 1.1);
    ctx.globalAlpha = 1;
  }

  // Texten högst upp
  const ts = L.ts * 1.1;
  ctx.font = `bold ${ts}px ${TYPSNITT}`;
  const text = (g.ingenPil ? "" : "👆 ") + g.text;
  const maxW = L.bank.w - 10;
  const rader = radbryt(text, maxW - ts * 1.6);
  const w = Math.min(maxW, Math.max(...rader.map((x) => ctx.measureText(x).width)) + ts * 1.6);
  const h = rader.length * ts * 1.3 + ts * 0.7;
  const cx = L.bank.x + L.bank.w / 2;
  const y = L.guideY;
  ctx.globalAlpha = g.ingenPil ? begr(guideKlarTid * 2, 0, 1) : 1;
  ctx.fillStyle = g.ingenPil ? "#c9f1c4" : "#fff3b0";
  ctx.strokeStyle = g.ingenPil ? "#3fbf5a" : "#e0b84a";
  ctx.lineWidth = 2.5;
  rundRekt(ctx, cx - w / 2, y, w, h, Math.min(h / 2, ts));
  ctx.fill();
  ctx.stroke();
  rader.forEach((rad, i) => skriv(rad, cx, y + ts * 0.35 + (i + 0.5) * ts * 1.3, ts, "#4a3220"));
  ctx.globalAlpha = 1;
}

// Tankebubblan som visar den hemliga önskan
function ritaTanke() {
  if (!visaHemligKort() || lage !== "placera") return;
  const fas = tankeKlocka % S.tankeVarje;
  const visas = 3;
  const iCykeln = tankeKlocka >= 1.5 && fas <= visas;
  if (!iCykeln && tankeNu <= 0) return;
  const id = B.hemlig.a;
  if (drag && drag.flyttat && drag.id === id) return;
  const p = ritadPos[id];
  const r = L.r;
  ctx.globalAlpha = tankeNu > 0 ? begr(tankeNu * 4, 0, 1) : begr(Math.min(fas * 4, (visas - fas) * 4), 0, 1);
  const text = tanke(B.hemlig);
  const storlek = Math.max(18, r * 0.9);
  ctx.font = `${storlek}px ${TYPSNITT}`;
  const w = ctx.measureText(text).width + storlek * 0.9;
  const h = storlek * 1.55;
  const cx = begr(p.x + r * 0.9, w / 2 + 6, bredd - w / 2 - 6);
  const cy = Math.max(marginal.topp + h / 2 + 4, p.y - r * 2.1);
  ctx.fillStyle = "#ffffff";
  ctx.strokeStyle = "#a991d4";
  ctx.lineWidth = 2;
  cirkel(p.x + r * 0.45, p.y - r * 1.05, r * 0.12);
  ctx.fill();
  ctx.stroke();
  cirkel(p.x + r * 0.68, p.y - r * 1.4, r * 0.19);
  ctx.fill();
  ctx.stroke();
  rundRekt(ctx, cx - w / 2, cy - h / 2, w, h, h / 2);
  ctx.fill();
  ctx.stroke();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#000000";
  ctx.fillText(text, cx, cy);
  ctx.globalAlpha = 1;
}

// Rutan med text när man trycker på en gäst eller ett önskemål
function ritaInfo() {
  if (!info || !L) return;
  const ts = L.ts;
  const maxW = Math.min(bredd - 32, ts * 20);
  const stilar = {
    rubrik: { font: `bold ${ts}px ${TYPSNITT}`, farg: "#2b1d0e", h: ts * 1.3 },
    vanlig: { font: `${ts * 0.92}px ${TYPSNITT}`, farg: "#4a3220", h: ts * 1.25 },
    citat: { font: `italic ${ts * 0.88}px ${TYPSNITT}`, farg: "#7a6a55", h: ts * 1.22 },
  };
  const rader = [];
  let w = 0;
  for (const [text, stil] of info.rader) {
    const s = stilar[stil];
    ctx.font = s.font;
    for (const rad of radbryt(text, maxW)) {
      rader.push({ rad, s });
      w = Math.max(w, ctx.measureText(rad).width);
    }
  }
  const pad = ts * 0.7;
  w += pad * 2;
  const h = rader.reduce((summa, r) => summa + r.s.h, 0) + pad * 1.6;
  const x = begr(info.x - w / 2, 10, bredd - w - 10);
  let y = info.y - h - 14;
  const ovanfor = y > marginal.topp + 8;
  if (!ovanfor) y = info.y + L.r * 2.4;
  ctx.globalAlpha = begr(info.tid * 3, 0, 1);
  ctx.fillStyle = "rgba(60, 30, 10, 0.2)";
  rundRekt(ctx, x, y + 4, w, h, ts * 0.7);
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.strokeStyle = "#2b1d0e";
  ctx.lineWidth = 2;
  rundRekt(ctx, x, y, w, h, ts * 0.7);
  ctx.fill();
  ctx.stroke();
  const px = begr(info.x, x + ts, x + w - ts);
  ctx.beginPath();
  if (ovanfor) {
    ctx.moveTo(px - ts * 0.4, y + h - 1);
    ctx.lineTo(px, y + h + ts * 0.55);
    ctx.lineTo(px + ts * 0.4, y + h - 1);
  } else {
    ctx.moveTo(px - ts * 0.4, y + 1);
    ctx.lineTo(px, y - ts * 0.55);
    ctx.lineTo(px + ts * 0.4, y + 1);
  }
  ctx.fill();
  ctx.stroke();
  let ry = y + pad * 0.8;
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  for (const { rad, s } of rader) {
    ctx.font = s.font;
    ctx.fillStyle = s.farg;
    ctx.fillText(rad, x + pad, ry + s.h / 2);
    ry += s.h;
  }
  ctx.globalAlpha = 1;
}

// ---------- Rita: rubriken och stämningsmätaren ----------

function rubrikOmrade() {
  const vanster = marginal.vanster + 146; // Hus- och pausknappen
  const hoger = bredd - marginal.hoger - 14;
  if (bredd >= 640) {
    const halv = Math.min(bredd / 2 - vanster, hoger - bredd / 2);
    return { x: bredd / 2, w: halv * 2 };
  }
  return { x: (vanster + hoger) / 2, w: hoger - vanster };
}

function ritaRubrik() {
  const o = rubrikOmrade();
  const y = marginal.topp + 40;
  const fest = S.fester[festNr];
  const storlek = begr(L.ts * 1.5, 18, 32);
  skriv(`${B.ikon} ${B.namn}`, o.x, y - storlek * 0.25, storlek, "#4a3220", "center", "bold", o.w);
  skriv(t(`${fest.namn} · bana ${banNr + 1} av ${fest.banor.length}`, `${fest.namn} · level ${banNr + 1} of ${fest.banor.length}`), o.x, y + storlek * 0.75, storlek * 0.5, "#7a6a55", "center", "bold", o.w);
}

// ---------- Rita: rutor och skärmar ----------

// Ritar rader med text i en mörk ruta mitt på skärmen
function ritaRuta(rader, mittY) {
  const ts = Math.min(bredd, hojd) / 15;
  const hojder = rader.map(([, storlek]) => storlek * ts * 1.45);
  const total = hojder.reduce((a, b) => a + b, 0) + ts * 0.7;
  const w = Math.min(bredd - 24, ts * 14);
  const topp = Math.max(marginal.topp + 8, mittY - total / 2);
  ctx.fillStyle = "rgba(40, 25, 15, 0.85)";
  rundRekt(ctx, bredd / 2 - w / 2, topp, w, total, ts * 0.6);
  ctx.fill();
  let y = topp + ts * 0.35;
  rader.forEach(([text, storlek, farg], i) => {
    const s = storlek * ts;
    ctx.font = `bold ${s}px ${TYPSNITT}`;
    const ryms = (w - ts * 0.8) / ctx.measureText(text).width;
    ritaText(text, bredd / 2, y + hojder[i] / 2, ryms < 1 ? s * ryms : s, farg || "#ffffff");
    y += hojder[i];
  });
  return { topp, botten: topp + total };
}

function ritaIntro() {
  if (lage !== "intro") return;
  const fest = S.fester[festNr];
  const rader = [
    [t(`Bana ${banNr + 1} av ${fest.banor.length}`, `Level ${banNr + 1} of ${fest.banor.length}`), 0.55, "#ffd27a"],
    [`${B.ikon} ${B.namn}`, 1.1],
    [B.def.tips || "", 0.55, "#9dffb0"],
  ];
  if (B.def.guide) {
    rader.push([t("Varje gäst har ett önskemål om var hen vill sitta.", "Every guest has a wish about where to sit."), 0.5, "#d5def0"]);
    rader.push([t("Handen visar hur man gör. Sedan får du klura själv!", "The hand shows you how. Then it's your turn!"), 0.55, "#ffd27a"]);
  }
  if (lageTid > 0.5) rader.push([t("Tryck för att börja", "Tap to start"), 0.6]);
  ritaRuta(rader, hojd * 0.45);
}

function ritaResultat() {
  resultatKnappar = [];
  if (lage !== "resultat" || !resultat) return;
  ctx.fillStyle = "rgba(40, 25, 15, 0.45)";
  ctx.fillRect(0, 0, bredd, hojd);

  const fest = S.fester[festNr];
  const sista = banNr === fest.banor.length - 1;
  const ts = Math.min(bredd, hojd) / 15;
  const w = Math.min(bredd - 24, ts * 14);
  const x = bredd / 2 - w / 2;

  let rubrik = t("Oj, det blev lite stökigt!", "Oops, that got a bit messy!");
  if (resultat.fel === 0) rubrik = resultat.antal === 3 ? t("Perfekt middag!", "A perfect dinner!") : t("Lyckad middag!", "A lovely dinner!");
  const rader = [];
  if (resultat.fel > 0) {
    const en = resultat.fel === 1;
    rader.push([t(`${resultat.fel} önskemål blev inte ${en ? "uppfyllt" : "uppfyllda"}. Men alla fick mat!`, `${resultat.fel} ${en ? "wish wasn't" : "wishes weren't"} granted. But everyone got fed!`), "#ffd0c8"]);
  } else if (B.hemlig && !resultat.hemligOk && resultat.forstaGangen) {
    rader.push([t("💭 Psst! Någon har en hemlig önskan. Spela igen och titta efter tankebubblor!", "💭 Psst! Someone has a secret wish. Play again and look for thought bubbles!"), "#e3d4ff"]);
  } else if (B.hemlig && !resultat.hemligOk) {
    rader.push([t("💭 Någon hade en hemlig önskan…", "💭 Someone had a secret wish…"), "#e3d4ff"]);
  } else if (resultat.hemligOk) {
    rader.push([`💗 ${B.hemlig.text}`, "#ffe3f0"]);
  }
  if (sista) rader.push([t("Du är nu: ", "You are now: ") + titel(totalaStjarnor(festNr) / (fest.banor.length * 3)), "#9dffb0"]);

  // Mät hur hög rutan blir
  const textStorlek = ts * 0.5;
  ctx.font = `bold ${textStorlek}px ${TYPSNITT}`;
  const brutna = [];
  for (const [text, farg] of rader) for (const rad of radbryt(text, w - ts)) brutna.push([rad, farg]);
  const knappH = ts * 1.1;
  const h = ts * 1.2 + ts * 1.5 + brutna.length * textStorlek * 1.45 + ts * 0.4 + knappH + ts * 0.8;
  const y = Math.max(marginal.topp + 10, hojd / 2 - h / 2);
  ctx.fillStyle = "rgba(40, 25, 15, 0.92)";
  rundRekt(ctx, x, y, w, h, ts * 0.6);
  ctx.fill();

  let ry = y + ts * 0.8;
  ctx.font = `bold ${ts * 0.85}px ${TYPSNITT}`;
  const ryms = (w - ts) / ctx.measureText(rubrik).width;
  ritaText(rubrik, bredd / 2, ry, ts * 0.85 * Math.min(1, ryms), "#ffd27a");
  ry += ts * 1.3;
  // Stjärnorna poppar fram en i taget
  for (let i = 0; i < 3; i++) {
    const fram = begr((lageTid - 0.3 - i * 0.35) * 4, 0, 1);
    const sx = bredd / 2 + (i - 1) * ts * 1.4;
    const fylld = i < resultat.antal;
    ctx.globalAlpha = fylld ? fram : 0.25;
    ritaEmoji("⭐", sx, ry, ts * (fylld ? 0.6 + fram * 0.5 : 1.0));
  }
  ctx.globalAlpha = 1;
  ry += ts * 1.0;
  for (const [rad, farg] of brutna) {
    ritaText(rad, bredd / 2, ry + textStorlek * 0.7, textStorlek, farg);
    ry += textStorlek * 1.45;
  }
  ry += ts * 0.4;

  const knappW = (w - ts * 1.2) / 2;
  const igen = { x: x + ts * 0.4, y: ry, w: knappW, h: knappH, gor: forsokIgen };
  const nasta = { x: x + w - ts * 0.4 - knappW, y: ry, w: knappW, h: knappH, gor: nastaBana };
  ritaKnapp(igen, t("↻ Försök igen", "↻ Try again"), "#e6ecf5");
  ritaKnapp(nasta, sista ? t("🏁 Klar!", "🏁 Done!") : t("▶ Nästa bana", "▶ Next level"), "#ffd95e");
  resultatKnappar = [igen, nasta];
}

function ritaMeny() {
  menyKnappar = [];
  if (lage !== "meny") return;
  const ts = begr(Math.min(bredd, hojd) / 16, 16, 40);
  const vk = marginal.vanster + 16;
  const hk = bredd - marginal.hoger - 16;
  let y = marginal.topp + Math.max(90, hojd * 0.12);
  skriv(t("Bordsplaceringen", "The Seating Plan"), bredd / 2, y, ts * 1.5, "#4a3220", "center", "bold", hk - vk);
  y += ts * 1.25;
  skriv(t("Placera släkten runt bordet så att alla blir nöjda!", "Seat the family around the table so everyone is happy!"), bredd / 2, y, ts * 0.6, "#7a6a55", "center", "bold", hk - vk);
  y += ts * 1.3;
  // Ansiktena får bara plats om skärmen är hög nog
  if (hojd > 640) {
    const ansikten = ["👵", "👴", "👨‍🦳", "👩‍🦰", "👱‍♀️", "👰", "🤵", "👶", "👧"];
    const steg = Math.min(ts * 1.5, (hk - vk) / ansikten.length);
    ansikten.forEach((a, i) => {
      const studs = Math.abs(Math.sin(tid * 3 + i * 0.7)) * steg * 0.12;
      ritaEmoji(a, bredd / 2 + (i - (ansikten.length - 1) / 2) * steg, y - studs, steg * 0.8);
    });
    y += ts * 1.6;
  } else {
    y += ts * 0.4;
  }

  // Högst 5 banor per rad. Har en fest fler delas de lika på flera rader.
  const mellan = ts * 0.4;
  const rubrikH = ts * 0.9;
  const festMellan = ts * 0.7;
  const rader = S.fester.map((fest) => {
    const antalRader = Math.ceil(fest.banor.length / 5);
    return { antalRader, perRad: Math.ceil(fest.banor.length / antalRader) };
  });
  // Så stora knappar som får plats, både på bredden och på höjden
  let sida = Math.min(ts * 3.6, ...rader.map((r) => (hk - vk - mellan * (r.perRad - 1)) / r.perRad));
  const behov = (sd) => rader.reduce((summa, r) => summa + rubrikH + r.antalRader * (sd * 1.15 + mellan) + festMellan, 0);
  const finns = hojd - marginal.botten - ts * 1.4 - y;
  while (sida > 36 && behov(sida) > finns) sida *= 0.95;

  S.fester.forEach((fest, f) => {
    const max = fest.banor.length * 3;
    skriv(`${fest.ikon} ${fest.namn}  ·  ⭐ ${totalaStjarnor(f)}/${max}`, bredd / 2, y, Math.min(ts * 0.75, sida * 0.3), "#4a3220", "center", "bold", hk - vk);
    y += rubrikH;
    const { perRad } = rader[f];
    const antal = fest.banor.length;
    fest.banor.forEach((bana, b) => {
      const rad = Math.floor(b / perRad);
      const iRaden = Math.min(perRad, antal - rad * perRad);
      const start = bredd / 2 - (iRaden * sida + (iRaden - 1) * mellan) / 2;
      const k = { x: start + (b % perRad) * (sida + mellan), y: y + rad * (sida * 1.15 + mellan), w: sida, h: sida * 1.15, fest: f, bana: b };
      const oppen = upplast(f, b);
      ctx.fillStyle = "rgba(60, 30, 10, 0.2)";
      rundRekt(ctx, k.x, k.y + 4, k.w, k.h, sida * 0.18);
      ctx.fill();
      ctx.fillStyle = oppen ? "#fffaf0" : "#e3dbcf";
      ctx.strokeStyle = "#d9c6a5";
      ctx.lineWidth = 2;
      rundRekt(ctx, k.x, k.y, k.w, k.h, sida * 0.18);
      ctx.fill();
      ctx.stroke();
      ctx.globalAlpha = oppen ? 1 : 0.4;
      ritaEmoji(bana.ikon, k.x + sida / 2, k.y + sida * 0.36, sida * 0.42);
      skriv(String(b + 1), k.x + sida * 0.16, k.y + sida * 0.15, sida * 0.15, "#7a6a55");
      skriv(bana.namn, k.x + sida / 2, k.y + sida * 0.72, sida * 0.15, "#4a3220", "center", "bold", sida * 0.9);
      ctx.globalAlpha = 1;
      if (!oppen) {
        ritaEmoji("🔒", k.x + sida / 2, k.y + sida * 0.95, sida * 0.2);
      } else {
        const antalSt = bastaStjarnor(f, b);
        for (let i = 0; i < 3; i++) {
          ctx.globalAlpha = i < antalSt ? 1 : 0.22;
          ritaEmoji("⭐", k.x + sida / 2 + (i - 1) * sida * 0.24, k.y + sida * 0.95, sida * 0.19);
        }
        ctx.globalAlpha = 1;
      }
      menyKnappar.push(k);
    });
    y += rader[f].antalRader * (sida * 1.15 + mellan) + festMellan;
  });
  skriv(t("Tryck på en bana för att börja", "Tap a level to start"), bredd / 2, Math.min(y, hojd - marginal.botten - ts * 0.7), ts * 0.55, "#7a6a55");
}

function rita() {
  // Pausknappen syns bara när man spelar. Under pausen finns allt i pausmenyn.
  const visaPaus = lage !== "meny" && lage !== "paus";
  if (pausKnapp.hidden === visaPaus) pausKnapp.hidden = !visaPaus;
  const visaHem = lage !== "paus";
  if (hemKnapp.hidden === visaHem) hemKnapp.hidden = !visaHem;

  ritaRum();
  if (lage === "meny" || !B) {
    ritaMeny();
    return;
  }
  ritaBord();
  ritaStolar();
  ritaGaster();
  ritaOnskelista();
  for (let i = 0; i < L.kort.length; i++) ritaKort(i);
  ritaKnappar();
  ritaGuide();
  ritaTanke();
  ritaDragen();
  ritaRubrik();
  ritaInfo();
  ritaIntro();
  ritaResultat();
}

// ---------- Spel-loopen: körs ungefär 60 gånger per sekund ----------

anpassaStorlek();

let forraTiden = performance.now();
function loop(nu) {
  const dt = Math.min(0.05, (nu - forraTiden) / 1000);
  forraTiden = nu;
  uppdatera(dt);
  rita();
  schemalaggMusik();
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

// ---------- Ljud (skapas direkt i webbläsaren, inga ljudfiler behövs) ----------

let ljudmotor = null;
let huvudvolym = null;

function startaLjud() {
  // iPad/iPhone tillåter bara ljud efter att man tryckt på skärmen
  if (!S.ljud) return;
  try {
    if (!ljudmotor) {
      ljudmotor = new (window.AudioContext || window.webkitAudioContext)();
      huvudvolym = ljudmotor.createGain();
      huvudvolym.connect(ljudmotor.destination);
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

// En ton som glider från en frekvens till en annan
function ton(fran, till, langd, typ = "sine", volym = 0.15, start = 0) {
  const s = ljudmotor.currentTime + start;
  const o = ljudmotor.createOscillator();
  const g = ljudmotor.createGain();
  o.type = typ;
  o.frequency.setValueAtTime(fran, s);
  o.frequency.exponentialRampToValueAtTime(till, s + langd);
  g.gain.setValueAtTime(0.0001, s);
  g.gain.exponentialRampToValueAtTime(volym, s + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, s + langd);
  o.connect(g);
  g.connect(huvudvolym);
  o.start(s);
  o.stop(s + langd + 0.05);
}

function effekt(namn) {
  if (!ljudPa || !ljudmotor || lage === "paus") return;
  try {
    if (namn === "plopp") ton(500, 900, 0.09, "sine", 0.2);
    else if (namn === "lyft") ton(400, 520, 0.06, "sine", 0.1);
    else if (namn === "pling") ton(1200, 1250, 0.12, "triangle", 0.08);
    else if (namn === "ding") {
      ton(1320, 1320, 0.25, "triangle", 0.12);
      ton(1760, 1760, 0.35, "triangle", 0.1, 0.08);
    } else if (namn === "fel") ton(240, 170, 0.22, "square", 0.05);
    else if (namn === "magi") {
      [784, 988, 1175, 1568].forEach((f, i) => ton(f, f, 0.18, "triangle", 0.08, i * 0.06));
    } else if (namn === "fanfar") {
      [523, 659, 784, 1047].forEach((f, i) => ton(f, f, i === 3 ? 0.5 : 0.16, "triangle", 0.13, i * 0.13));
    } else if (namn === "tuta") {
      [392, 370, 349, 311].forEach((f, i) => ton(f, f * (i === 3 ? 0.9 : 1), i === 3 ? 0.6 : 0.28, "sawtooth", 0.05, i * 0.3));
    }
  } catch (e) {
    // Inget ljud – spelet fungerar ändå
  }
}

// ---------- Musiken ----------
//
//  Varje melodi har:
//    steg   = sekunder per slag (lägre = snabbare)
//    takt   = slag per takt (3 = vals)
//    melodi = en ton per slag. 60 är mellersta C, 62 är D, 64 är E ...
//             "-" betyder att tonen före hålls kvar, och null är paus.
//    takter = ett ackord per takt: basen spelas på första slaget och
//             ackordet mjukt på de andra.
//  Ackorden finns i ACKORD. Ändra för att göra egen musik!

const ACKORD = {
  F: { bas: 41, toner: [57, 60, 65] },
  C: { bas: 48, toner: [55, 60, 64] },
  G: { bas: 43, toner: [55, 59, 62] },
  D: { bas: 50, toner: [54, 57, 62] },
  Bb: { bas: 46, toner: [53, 58, 62] },
  Gm: { bas: 43, toner: [55, 58, 62] },
  Em: { bas: 40, toner: [55, 59, 64] },
  Am: { bas: 45, toner: [57, 60, 64] },
};

const MUSIK = {
  // En mysig vals till mormors fest
  kalas: {
    steg: 0.4,
    takt: 3,
    melodi: [
      72, "-", 69, 70, 69, 67, 65, "-", "-", 67, 69, 70,
      72, "-", 74, 72, 70, 69, 67, "-", "-", "-", null, null,
      72, "-", 69, 70, 69, 67, 65, "-", 69, 67, "-", 64,
      65, "-", "-", "-", null, null, 74, "-", 72, 70, "-", 69,
      67, "-", 69, 70, "-", null, 72, "-", 70, 69, "-", 67,
      65, "-", "-", "-", null, null,
    ],
    takter: ["F", "C", "F", "C", "Bb", "F", "C", "C", "F", "C", "F", "C", "F", "F", "Bb", "Gm", "C", "Bb", "F", "C", "F", "F"],
  },
  // En lugn och lite högtidlig melodi till bröllopet
  brollop: {
    steg: 0.45,
    takt: 4,
    melodi: [
      71, "-", 72, 74, 74, "-", 72, 71, 69, "-", 71, 72, 71, "-", "-", null,
      71, "-", 72, 74, 76, "-", 74, 72, 71, "-", 69, "-", 67, "-", "-", null,
      72, "-", 71, 72, 74, "-", 71, "-", 69, "-", 71, 72, 71, "-", 69, "-",
      71, "-", 72, 74, 76, "-", 74, 72, 71, "-", 69, 71, 67, "-", "-", null,
    ],
    takter: ["G", "Em", "Am", "G", "G", "C", "D", "G", "Am", "G", "D", "G", "G", "C", "D", "G"],
  },
};

let musikPa = S.musik && lasInstallning("musik-bord") !== "av";
let musikNamn = null;
let musikSteg = 0;
let musikNastaTid = 0;
let musikVolym = null; // Musiken har en egen volym, så att den hörs lagom under ljuden
visaMusikKnapp();

// Hur många slag en ton ska hållas (sig själv plus alla "-" efter)
function notLangd(lista, i) {
  let n = 1;
  while (lista[(i + n) % lista.length] === "-" && n < lista.length) n += 1;
  return n;
}

function frekvens(not) {
  return 440 * Math.pow(2, (not - 69) / 12);
}

// En ton som låter som en speldosa eller ett mjukt piano: slår an och klingar ut
function spelaTon(not, start, langd, volym, typ = "sine", overton = 0.25) {
  const g = ljudmotor.createGain();
  g.connect(musikVolym);
  g.gain.setValueAtTime(0.0001, start);
  g.gain.exponentialRampToValueAtTime(volym, start + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, start + langd);
  const f = frekvens(not);
  for (const [ton, styrka] of [[f, 1], [f * 2, overton]]) {
    if (styrka <= 0) continue;
    const o = ljudmotor.createOscillator();
    const og = ljudmotor.createGain();
    o.type = typ;
    o.frequency.value = ton;
    og.gain.value = styrka;
    o.connect(og);
    og.connect(g);
    o.start(start);
    o.stop(start + langd + 0.05);
  }
}

function aktuellMelodi() {
  const fest = S.fester[lage === "meny" || !B ? 0 : festNr];
  return fest.musik || "kalas";
}

// Lägger ut tonerna en liten bit i förväg så att musiken inte hackar
function schemalaggMusik() {
  if (!ljudmotor) return;
  const namn = musikPa && lage !== "paus" && !document.hidden ? aktuellMelodi() : null;
  if (namn !== musikNamn) {
    if (namn !== null && namn !== musikNamn) musikSteg = 0;
    musikNamn = namn;
    musikNastaTid = 0;
  }
  if (!namn || !MUSIK[namn]) return;
  const latt = MUSIK[namn];
  const nu = ljudmotor.currentTime;
  if (musikNastaTid < nu) musikNastaTid = nu + 0.05;
  try {
    if (!musikVolym) {
      musikVolym = ljudmotor.createGain();
      musikVolym.gain.value = 0.8;
      musikVolym.connect(huvudvolym);
    }
    while (musikNastaTid < nu + 0.25) {
      const i = musikSteg % latt.melodi.length;
      const not = latt.melodi[i];
      if (typeof not === "number") {
        const langd = notLangd(latt.melodi, i) * latt.steg;
        spelaTon(not, musikNastaTid, Math.max(langd * 1.4, 0.9), 0.05, "sine", 0.3);
      }
      // Bas på första slaget i takten, mjuka ackord på de andra
      const slag = musikSteg % latt.takt;
      const ackord = ACKORD[latt.takter[Math.floor(musikSteg / latt.takt) % latt.takter.length]];
      if (ackord) {
        if (slag === 0) spelaTon(ackord.bas, musikNastaTid, latt.steg * latt.takt, 0.07, "triangle", 0.4);
        else for (const ton of ackord.toner) spelaTon(ton, musikNastaTid, latt.steg * 0.9, 0.012, "triangle", 0);
      }
      musikNastaTid += latt.steg;
      musikSteg += 1;
    }
  } catch (e) {
    musikPa = false; // Webbläsaren klarar inte ljudet – spela vidare utan musik
  }
}

// ---------- Stjärnor och inställningar sparas i webbläsaren på just den här enheten ----------

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

function lasStjarnor() {
  try {
    return JSON.parse(localStorage.getItem("stjarnor-bord")) || {};
  } catch (e) {
    return {};
  }
}

function sparaStjarnor() {
  sparaInstallning("stjarnor-bord", JSON.stringify(stjarnor));
}
