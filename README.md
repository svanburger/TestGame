# Bajskorv Studios 💩🎮

Små spel som körs helt i webbläsaren. Inga servrar, inga databaser och
inget att installera. Startsidan är en meny där man väljer spel.

| Fil / mapp   | Vad det är                                                |
|--------------|-----------------------------------------------------------|
| `index.html` | Menyn man ser först, med Bajskorv Studios-loggan.         |
| `spel.css`   | Gemensam stil för spelen (fyller skärmen, hus-knappen).   |
| `sprak.js`   | Väljer svenska eller engelska och översätter texterna.    |
| `favicon.svg` | Ikonen med bajshögen som syns i webbläsarens flik. `favicon.png` och `apple-touch-icon.png` (hemskärmen på iPad) är samma bild som PNG. |
| `stjarnor/`  | Spelet "Fånga stjärnorna".                                |
| `parkour/`   | Spelet "Parkourkatten".                                   |
| `pappa/`     | Spelet "Låt pappa vila".                                  |
| `hund/`      | Spelet "Hundpromenaden".                                  |
| `fis/`       | Spelet "Lagom tryck".                                     |
| `bord/`      | Spelet "Bordsplaceringen".                                |
| `godis/`     | Spelet "Bus eller godis".                                 |

Varje spel är en egen mapp med en `index.html` och en `game.js`. Det mesta
man vill ändra finns i `INSTALLNINGAR` högst upp i `game.js`. Spara filen
och ladda om sidan, så syns ändringen.

Spelen fungerar på iPad, telefon och dator. Uppe till vänster finns två
knappar: 🏠 tar en tillbaka till menyn och ⏸ pausar. I pausmenyn kan man
fortsätta, börja om eller gå till menyn. På datorn pausar man med P eller
Esc. Spelen pausar också av sig själva om man byter app.

## Svenska och engelska 🇸🇪🇬🇧

Alla spel finns på svenska och engelska. Språket väljs av sig självt:

- **Svenska** om webbläsaren är inställd på svenska, eller om enheten står
  på svensk tid (då är man nog i Sverige).
- **Engelska** annars.

Uppe till höger i menyn finns en knapp för att byta språk. Valet sparas på
enheten och gäller i alla spel.

När man skriver en ny text i ett spel skriver man den på båda språken:

```js
ritaText(t("Tryck för att börja", "Tap to start"), x, y, storlek);
```

I HTML skriver man svenskan som vanligt och engelskan i `data-en`:

```html
<button data-en="Continue">Fortsätt</button>
```

Varje spel laddar `sprak.js` före sin `game.js`.

## Fånga stjärnorna ⭐

Styr katten med fingret (eller musen/piltangenterna), fånga ⭐ 🍓 🍪 och
undvik 💣. Man har tre liv.

Testa att ändra i `stjarnor/game.js`:

- byta `spelare: "🐱"` mot `"🐶"`, `"🦄"` eller `"🚀"`
- lägga till fler saker i `braSaker`, till exempel `"🍕"` eller `"💎"`
- byta `"💣"` mot `"👻"` eller `"🦈"`
- göra spelet lättare eller svårare med `chansForDalig`, `liv` och `falltidStart`

## Parkourkatten 🐱

Katten springer av sig själv genom staden.

- **Tryck** för att hoppa. **Tryck igen i luften** för att göra en volt.
- **⬇-knappen** gör en kullerbytta på gatan (bra för att komma under örnen
  🦅), eller hoppar ner från ett tak.
- Varje bit av staden har två vägar: uppe på taken eller nere på gatan. På
  den ena står ofta ett ont djur. Tar man fel väg blir katten skrämd och lite
  mer tilltufsad: lurvig päls, vikt öra, plåster och hängande svans.
- Det finns tre sorters skurkar:
  - de som står still: 🐺🐍🐊🐗🐻🦂🕷️🦍
  - de som springer emot katten: 🐀🐕🦡 (hoppa över dem!)
  - de som flyger lågt: 🦅🦇🐝 (rulla under dem!)
- Blir katten skrämd 3 gånger förvandlas den till en **ond katt** 😈. Då blir
  alla djur söta 🐱🐰🐥🐹🐶🦔, och nu är det katten som skrämmer dem. Det ger
  mest poäng. Efter 45 sekunder som ond katt är spelet slut.

Poäng får man för hopp, volter, kullerbyttor, att ta sig upp på tak och
långhopp mellan tak. Gör man trick tätt efter varandra får man combo (upp
till x5), som gör poängen flera gånger större.

På vägen ligger godsaker. Ju ovanligare, desto mer poäng:

| Godsak | Poäng | Hur vanlig |
|--------|-------|------------|
| 🐟     | 5     | Överallt   |
| 🥛     | 10    | Ganska ofta |
| 🧀     | 20    | Ibland     |
| 🍗     | 40    | Sällan     |
| 👑     | 100   | Mycket sällan |
| 💎     | 250   | Jättesällan |

De ovanliga godsakerna glittrar. Ibland svävar en av dem högt upp mellan
två tak, och då måste man göra en volt för att nå den.

I bakgrunden spelar en trudilutt. När katten blir ond byter den till en
läskigare melodi. Musiken kan stängas av i pausmenyn.

Testa att ändra i `parkour/game.js`:

- vilka djur som är onda och söta (`ondaDjur`, `springandeDjur`,
  `flygandeDjur`, `sotaDjur`)
- vilka godsaker som finns, hur mycket poäng de ger och hur vanliga de är
  (`godsaker`)
- melodin: längst ner i `game.js` finns `MUSIK`, där varje siffra är en ton
- hur många gånger man kan bli skrämd (`skramdGanger`)
- hur länge man är ond katt (`ondTid`)
- hur fort katten springer (`fartStart`, `fartMax`)
- hur mycket poäng varje trick ger (`poang`)
- kattens färg (`kattFarg`, `ondKattFarg`)

## Låt pappa vila 🛋️

Pappa vilar i fåtöljen och scrollar på telefonen. Du är ett barn som
springer runt i vardagsrummet och leker, men tyst, så att pappa får vila.

- **Dra med fingret** (eller tryck någonstans) så springer barnet dit. På
  datorn går det också med piltangenterna eller WASD.
- **Tryck på en sak** så springer barnet dit och börjar leka. Man leker så
  länge man står still bredvid saken.
- Varje sekund som pappa får vila ger 1 poäng. Leker man ger det mer, men
  ju roligare sak, desto mer låter det:

  | Sak       | Poäng per sekund | Ljud |
  |-----------|------------------|------|
  | 📖 Läsa    | 1                | Tyst 🤫 |
  | 🖍️ Rita    | 2 (+20 när teckningen är klar) | Lite 🔈 |
  | ⚽ Boll    | 3                | Mellan 🔉 |
  | 🧱 Klossar | 5 (men tornet rasar ibland – KRASCH!) | Lite 🔈 |
  | 🥁 Trumma  | 12               | Jättemycket 🔊 |

- **Städa:** Hunden 🐕 släpar fram leksaker. Spring över dem för att plocka
  upp (man kan bära 3) och lägg dem i leksakslådan. Varje leksak ger 25
  poäng, och 3 på en gång ger lite extra. Har man händerna fulla och kliver
  på en leksak säger det "Aj!" och låter.
- **Ljudmätaren** högst upp visar hur mycket det låter. Pappas ansikte åker
  med på mätaren (😌 → 🤨 → 😒), och når den 😡 längst till höger blir pappa
  störd och man förlorar ett ❤️. Efter 3 gånger är spelet slut. Små pilar
  visar om det blir mer ljud (›››) eller om pappa lugnar sig (‹‹‹), och
  ikonen till vänster visar vad som låter just nu. När pappa börjar bli
  störd syns samma ansikte i en tankebubbla ovanför honom.
- **Oväntade händelser** dyker upp då och då (efter ett ❗) och då måste man
  springa och fixa dem:
  - ⚽ **Bollen rullar iväg** mot pappa. Fånga den innan den når fåtöljen,
    annars blir det BONK!
  - 🐕 **Hunden skäller.** Spring dit och klappa den.
  - 🏎️ **Leksaksbilen startar** och kör runt och tutar. Det låter extra
    mycket när den kör på mattan. Fånga den och lägg den i lådan.

  Varje fixad händelse ger 10 poäng.
- **Pappas matta** runt fåtöljen ska man inte gå på – då märker han dig
  direkt. Barnet går själv runt mattan om man trycker på andra sidan.
- Är det tyst en stund **somnar pappa** 😴. Då blir alla poäng dubbla, men
  han vaknar lättare.
- Ju längre man spelar, desto tröttare blir pappa och desto lättare blir
  han störd.

Testa att ändra i `pappa/game.js`:

- vad man kan leka med, hur mycket poäng det ger och hur mycket det låter
  (`lekar`)
- vilka leksaker hunden släpar fram (`leksaker`) och hur ofta (`hundTappar`)
- hur mycket poäng det blir för att städa (`poang`)
- hur lätt pappa blir störd (`lugnStart`, `lugnMinst`, `blirTrott`)
- hur många gånger man får störa pappa (`liv`)
- hur ofta det händer något oväntat och hur mycket det låter (`handelser`)
- barnets och pappas färger (`barnFarg`, `harFarg`, `pappaFarg`)
- vaggvisan: längst ner i `game.js` finns `MUSIK`

## Hundpromenaden 🐕

Du är ute och går med hunden. Hunden vill nosa på allt, jaga allt och
bajsa överallt. Ta dig hem med en glad hund och en ren trottoar!

- **Välj hund** på startskärmen (tryck på ett kort, eller använd
  piltangenterna):
  - **🐕 Hunden:** lagom på allt. Bra att börja med.
  - **🌭 Taxen:** kort och snabb, drar inte så hårt och gräver gropar
    överallt. Ibland hittar den ett ben.
  - **🐩 Pudeln:** fin och lugn. Blir inte lika vild, bajsar mer sällan och
    vägrar gå i pölar. Blir den blöt är den förolämpad. Influencern kallar
    den "en kollega".
  - **🦮 Sankt Bernhard:** jättestor och långsam, men drar dig överallt.
    Jättestora bajs som det går åt två påsar till. Låses upp när man fått
    800 poäng.
  - **🐈 Katten:** går inte i koppel. Eller? Lyssnar inte alltid på "Fot!",
    lägger sig ibland och vägrar gå, jagar inte katter och apporterar inte.
    Hundägarna undrar om det är en katt. Låses upp när man kommit hem en
    gång.
- **Dra med fingret** (eller använd piltangenterna/WASD) så går barnet dit.
  Hunden sitter i kopplet och drar åt sitt eget håll. När den drar riktigt
  hårt blir barnet släpat efter ("Wiiiii!").
- **Tryck på hunden** (eller mellanslag) så säger barnet **"Fot!"** och
  hunden kommer tillbaka. Sedan dröjer det en liten stund innan man kan säga
  det igen (ringen runt hunden visar när). När hunden fått syn på något
  visas ett ❗ – säger man "Fot!" precis då får man extra poäng.
- **💩 Bajs:** Hunden bajsar ibland. Gå över bajset för att plocka upp det,
  så går det åt en påse 🛍️. Påsar finns i påsautomaterna och ibland på
  marken. Lämnar man bajset dyker en granne upp. Har man inga påsar kvar
  kliver man i det. Ibland kommer ett glittrande **🌈 regnbågsbajs** som
  ger 250 poäng.
- **Hundmätaren** högst upp visar hur hunden mår, från 🥱 till 🤪. Hunden
  får tråkigt om den bara går, så låt den nosa på träd och stolpar och hälsa
  på andra hundar. Men jagar den katter, ekorrar och ankor blir den vild,
  och når mätaren 🤪 smiter den. Då måste man springa ikapp. Smiter hunden
  3 gånger är promenaden slut.
- **❗ Oväntade händelser** dyker upp då och då, på alla banor:
  - **📮 Brevbäraren** kommer springande med ett paket. Hunden HATAR
    brevbärare och ser honom på långt håll. Hinner man säga "Fot!" innan
    hunden jagar honom blir han glad, och man får utmärkelsen
    **Brevbärarens vän**.
  - **🌧️ Regnskur!** "Det var väl skönt med lite friskluft?" Det blir mörkt
    och regnar, det blir nya pölar, och hunden vill hem NU och drar barnet
    framåt som en galning. Efteråt är hunden blöt och skakar sig på folk.
  - **🚒 Brandbilen** kör förbi med sirenen på, och hunden sätter sig och
    ylar. (Katten bryr sig inte.)
  - **🍦 Glassbilen** kör fram och stannar och spelar sin melodi. Familjeregeln
    säger att glassen är slut när glassbilen spelar musik (barnet tror inte på
    det). Hunden springer dit och tigger. Ställer man sig vid luckan köper man
    en glass, och på stranden tar måsen den.
- **Trassel:** Jagar hunden en ekorre runt ett träd trasslar kopplet sig.
  Gå runt trädet åt det håll som pilen visar för att få loss det.
- Promenaden går genom fyra banor och sedan hem:
  - **🏘️ Kvarteret:** lyktstolpar med lappar, katter på staketen och en sur
    gubbe med en perfekt gräsmatta som hunden gärna vill bajsa på.
  - **🌳 Parken:** dammen med ankor, ekorrar, korvkiosken, hundrastgården och
    en pappa på en parkbänk.
  - **🏙️ Stan:** butiker med skyltar, bilar på gatan, en fontän med duvor,
    lattepappan på caféet, gatumusikanten som spelar "sin egen" låt
    Wonderwall (hunden ylar med), brevbäraren som hunden HATAR och cykelbud
    som vill ha fem stjärnor.
  - **🏖️ Stranden:** badhytter, parasoller, krabbor som nyper, måsar,
    flickan med sandslottet (håll i hunden!), solbadaren, mannen med
    metalldetektorn, kallbadaren som lockar ut hunden i vattnet och en
    glasskiosk. Köper man en glass tar måsen den.
- Förlorar man på en senare bana kan man **försöka igen från den banan**, med
  poängen man hade när banan började.
- **📱 Influencern** dyker upp på alla banor: med pudeln Coco i matchande
  rosett, när hon vill filma din "autentiska" hund, med Coco i handväskan,
  när hon gör en fika-reel i stan och när hon mediterar live på stranden. När hon filmar lyser en röd **REC**-lampa. Händer något
  pinsamt framför kameran (barnet släpas, hunden bajsar, plaskar, smiter
  eller man kliver i bajs) går det **viralt**: man får poäng och nya
  följare, som syns högst upp och när man kommer hem. Plockar man upp bajs
  på film blir det bara 3 likes.
- **🎾 Padelgrannen** frågar om man har testat padel och tappar bollen över
  staketet. Hunden springer efter den och kommer tillbaka med den
  (**apport**), och då blir den lugn och nöjd. Man kan också plocka upp
  bollen själv.
- **🛴 Elsparkcyklar** ligger slängda mitt i vägen. Hunden vill gärna nosa
  på dem, och kissar alltid på dem ("Rättvisa.").
- **👀 Grannarna ser allt.** Kliver man i bajs i kvarteret, eller lämnar
  det, rör sig en gardin och ett par ögon tittar ut.
- **Fler figurer man möter:**
  - **💼 Fastighetsmäklaren** (kvarteret) har visning: ljust och fräscht,
    bara lite fukt i källaren. Varje gång hunden skäller nära honom räknar
    han det som ett bud, och priset går upp. Kissar hunden på TILL
    SALU-skylten står det "husdjursvänligt" i annonsen, och bajs kallar han
    "lantlig charm".
  - **🌿 Homeopaten** (kvarteret) ger hunden en droppe för lugn, utspädd en
    miljon gånger. Effekt: ingen.
  - **🏋️ Alfahannen** (parken) vaknar 04.30 och tar isbad. Springer hunden
    fram till honom skriker han, men han blev inte rädd. Det var uppvärmning.
  - **🤵 Matskribenten** (vid korvkiosken) recenserar korven, och bajsar
    hunden i närheten recenserar han det också. Två av fem.
  - **🕴️ Tech-investeraren** (stan) disruptar hundpromenader. Plockar man upp
    bajs framför honom investerar han (Riskkapital!).
  - **🛋️ Psykologen** (stan) undrar hur det känns när hunden drar, och
    släpas barnet förbi har det en otrygg anknytning. Det blir 1 200 kr.
  - **📚 Läraren med värdegrund** (parken) går med sin klass i reflexvästar
    och sätter ord på känslor. Hunden vill hälsa på barnen ("HUNDEN!!"), och
    alla hundar är olika och lika värda. Håller man i hunden får man en
    guldstjärna, och bajsar hunden i närheten hamnar det i veckobrevet.
  - **🦺 Ordningsvakten** (stan) stoppar barnet för kontroll: har hunden
    legitimation? Han visslar om barnet släpas förbi och skriver en rapport
    om hunden bajsar i närheten.
- På vägen möter man folk som säger saker, och ibland får man en
  🏆 utmärkelse. När man kommer fram får man ⭐⭐⭐ för en glad hund och en
  ren trottoar.

Testa att ändra i `hund/game.js`:

- hundarna man kan välja (`hundar`): hur snabba, stora och vilda de är, hur
  hårt de drar och vad som krävs för att låsa upp dem

- vad folk säger (`pratbubblor`), till exempel vad influencern säger när
  något går viralt (`influencerViral`), lapparna på lyktstolparna
  (`lappar`) och betygen när man kommer hem (`betyg`)
- hur mycket poäng det blir när något går viralt eller hunden apporterar
  (`poang`)
- hur ofta hunden bajsar (`bajsTakt`) och hur ofta det blir regnbågsbajs
  (`regnbage`)
- hur många påsar man har (`pasarStart`, `pasarMax`)
- hur ofta det händer något oväntat, vilka händelser som finns och hur länge
  det regnar (`handelser`)
- hur långt kopplet är (`koppel`) och hur fort barnet och hunden går
  (`fart`, `hundFart`, `jaktFart`)
- hur fort hunden får tråkigt eller blir vild (`humor`)
- vilka godsaker som finns och hur mycket poäng de ger (`godsaker`)
- vilka hundar och katter man möter (`andraHundar`, `katter`)
- vilka banor promenaden går genom, i vilken ordning och hur långa de är
  (`banor`)
- lapparna i stan (`lapparStan`), butikernas skyltar (`butiker`) och
  skyltarna på stranden (`skyltarStrand`)
- promenadvisslan: längst ner i `game.js` finns `MUSIK`

## Lagom tryck 💨

Pappa har ätit bönor. Han ska fisa så mycket som möjligt, men får inte
trycka så hårt att han bajsar på sig.

- **Håll fingret** på skärmen så krystar pappa. Ju längre man håller,
  desto större fis och desto mer poäng. På datorn håller man inne
  mellanslag.
- **Släpp** så kommer fisen. Små fisar heter t.ex. *Pipet*, stora heter
  *Trumpeten* eller *Tubakonserten*.
- Någonstans finns en **gräns** där pappa bajsar på sig. Den flyttar sig
  varje gång, så man får titta efter tecknen:
  1. magen kurrar (*kurr*)
  2. pappa svettas 💧
  3. ögonen spärras upp, han håller sig för baken och det säger *blubb*
- Släpper man precis innan gränsen blir det **bromsspår**: 1,5 gånger
  poängen, men underbyxorna får en brun fläck. Två bromsspår och
  underbyxorna är slut. Bajsar pappa på sig går ett helt par åt direkt.
  Pappa har 3 par 🩲. När alla är slut är spelet slut.
- **Ljudmätaren** högst upp: det blå är hur mycket det låter i rummet.
  Medan man håller åker pappas ansikte med mätaren. Släpper man när
  ansiktet är i det blå hör ingen fisen, och då blir det dubbla poäng.
  Hör någon den blir de andra i rummet generade.
- **Skyll på hunden** 🐕: hör någon fisen lyser knappen nere till höger i
  3 sekunder. Trycker man då får hunden skulden och man får lite extra
  poäng. Det går 2 gånger per bana. På datorn trycker man H.
- Fyra banor, med olika ljud runt omkring:
  - 🛗 **Hissen:** hissmusik, pling, någon nyser. Ibland tystnar musiken.
  - 📚 **Biblioteket:** nästan helt tyst. Vänta på stämpeln, bebisen
    eller boken som tappas.
  - 🎂 **Mormor fyller 80:** alla sjunger, och då är det fritt fram. Mormor
    hör ändå inte så bra.
  - 💒 **Bröllopet:** orgeln är din bästa vän. Akta dig för *"Om någon har
    något att invända…"*. Här finns ingen hund…
- Efter alla fyra banorna börjar en ny dag. Då krystar pappa fortare och
  gränsen kan komma tidigare.
- När spelet är slut får man en titel, från *Pruttpraktikant* till
  *Klimatbov*.

Testa att ändra i `fis/game.js`:

- hur många underbyxor pappa har (`underbyxor`)
- hur fort trycket ökar och var gränsen hamnar (`krystFart`, `grans`)
- hur tidigt varningarna kommer (`varningar`)
- fisarnas namn och ljud (`fisar`)
- tipsen, texterna när det går fel och titlarna (`tips`, `olyckor`, `titlar`)
- banorna: varje bana har en `tidslinje` där man bestämmer hur mycket
  det låter och när. Man kan också göra en helt egen bana.
- musiken: längst ner i `game.js` finns `MUSIK`

## Bordsplaceringen 🍽️

Ett pusselspel. Släkten ska på fest. Placera gästerna runt borden så att
alla blir nöjda. Det finns två fester:

- **🎂 Mormor fyller 80:** ett långt bord, fem banor.
- **💒 Bröllopet:** kusin Linnea gifter sig med Viktor. Brudparet sitter
  vid brudbordet, och gästerna sitter vid runda bord. Åtta banor, från ett
  runt bord till tre. Brudens katt Göran ska förstås sitta bredvid
  bruden.

- **Dra en gäst** från bänken till en stol. Man kan också **trycka på en
  gäst och sedan på en stol**. Sitter någon redan där byter de plats. Drar
  man en gäst tillbaka till bänken reser hen sig.
- På första banan visar en **hand 👆** hur man gör med det första
  önskemålet. Sedan får man klura själv.
- **Gästernas önskemål** står i listan bredvid bordet, med bilder så att
  man inte behöver kunna läsa:
  - 💕 vill sitta **bredvid** någon
  - 🚫 vill **inte** sitta bredvid någon
  - ↕️ vill sitta **mittemot** någon
  - ➡️ ska sitta vid en **stol med en bild**, till exempel 👑 (hedersplatsen),
    🪟 (fönstret), 🚪 (dörren), 🎤 (talarplatsen), 📶 (wifi:n) eller 💍
    (brudparets platser)
  - 🤝 vill sitta vid **samma bord** som någon
  - 🙅 vill sitta vid ett **annat bord** än någon

  Vid ett runt bord sitter alla i en ring. Man sitter bredvid de två på
  var sida, och har bordet ett jämnt antal stolar sitter man mittemot den
  på andra sidan.

  Önskemålen blir gröna när det stämmer och röda när det inte gör det. Vid
  bordet har varje gäst ett litet 😊 eller 😟, och 💢 syns mellan två som
  inte vill sitta bredvid varandra.
- **Tryck på en gäst** så får man veta vem det är och vad hen önskar.
  **Tryck på ett önskemål** så lyser gästerna det gäller. Här finns också
  skämten för de vuxna.
- **👵 Fråga mormor** om man kör fast. Då flyttar mormor en gäst till rätt
  plats. Man får fråga 2 gånger på varje bana.
- **🍽️ Servera!** när alla sitter. Då ser man direkt hur många stjärnor det
  blev.
- Stjärnor:
  - ⭐ Alla sitter vid bordet (då kan man gå vidare till nästa bana).
  - ⭐⭐ Alla önskemål stämmer.
  - ⭐⭐⭐ Någon har dessutom en **hemlig önskan**. Den dyker upp när man
    har klarat banan en gång. Gästen som har den har en liten 💭, och då
    och då syns en tankebubbla med vad hen tänker på, till exempel 💗👵
    (vill sitta bredvid mormor). Trycker man på kortet "en hemlig önskan"
    eller på gästen syns tankebubblan direkt.
- Banorna:
  - 🎂 Mormor fyller 80: ☕ Fikat, 🥗 Förrätten, 🍖 Varmrätten, 🎤 Talet
    och 🎂 Tårtan.
  - 💒 Bröllopet: 💍 Brudbordet, 📸 Fotografen, 🍝 Middagen, 🎸 Bestmannens
    låt, 🎤 Talen, 💃 Dansen, 🎂 Bröllopstårtan och 🌭 Nattkorven.

  Det blir fler gäster, bord och önskemål för varje bana. Varje fest börjar
  med sin första bana öppen.
- Mysig musik spelar i bakgrunden: en vals på mormors fest och en lugn
  melodi på bröllopet. Den kan stängas av i pausmenyn.

**Om skämten:** Spelet ska gå att spela för barn, men det finns lite extra
för de vuxna i det gästerna säger. De vuxna skämten handlar om vuxnas
fåniga vanor (morbror Bengts pärmar, kusinens katt Göran som är med
överallt, tant Gunnel som ger råd om allt), aldrig om vuxna saker. Allt som står ska gå att
läsa högt för en sjuåring vid middagsbordet.

Testa att ändra i `bord/game.js`:

- gästerna (`folk`): namn, ansikte, sak, färg och vad de säger. Är det en
  pojke som spelar kan "Du" få ansiktet `"👦"`.
- banorna (`banor`): borden (`bord`, ett långbord eller en lista med flera
  bord, både långa och runda), bilderna vid stolarna
  (`markeringar`), vilka gäster som är med (`gaster`), önskemålen (`regler`)
  och den hemliga önskan (`hemlig`)
- vad mormor säger när man frågar henne (`mormorSager`) och hur många
  gånger man får fråga på varje bana (`mormorFragor`)
- titlarna man får efter sista banan på en fest (`titlar`)
- festerna (`fester`): man kan lägga till en helt egen fest med egna banor
- `guide: true` på en bana gör att handen visar hur man gör med det första önskemålet
- `visaGrona: false` gör spelet svårare: då blir önskemålen inte gröna
  förrän man serverar
- musiken: längst ner i `game.js` finns `MUSIK`, där varje siffra är en
  ton, och `ACKORD`. Varje fest väljer sin melodi med `musik`.

Hur man skriver en egen bana står längst upp i `game.js`. Går en bana inte
att lösa kan mormor inte hjälpa till, så prova att lösa den själv först.

## Bus eller godis 🎃

Det är Halloween! Klä ut dig och ring på hos grannarna i kvarteret. Man får
samla godis mellan klockan 18 och 20, vilket är 5 minuter på riktigt.

- **Välj dräkt** på startskärmen: spöke, häxa, pumpa eller skelett.
- **Dra med fingret** (eller tryck någonstans, eller använd
  piltangenterna/WASD) så går barnet dit. Man får gå vart man vill i
  kvarteret.
- **Gå fram till en dörr med en lysande pumpa 🎃** så ringer man på. Den som
  öppnar säger något och ger godis (eller något konstigt). Det man får syns
  en stund bredvid dörren. Sedan flyger godiset in i hinken och de konstiga
  sakerna (morötter, russin, tandborstar ...) in i ryggsäcken 🎒 uppe till
  vänster. Har man varit där syns en grön bock. Pumpor vid kanten av skärmen visar var de närmaste
  husen med godis finns.
- **Hinken** högst upp visar hur mycket godis man har. Strecken och ⭐ på
  hinken visar hur mycket som behövs för varje stjärna.
- **Klockan** uppe till höger visar hur dags det är. Den röda biten är
  tiden som är kvar till 20. Vissa hus stänger tidigt (Sture lägger sig
  kvart i sju) och pumpafamiljen öppnar först klockan 19.
- **Man kan tappa godis:**
  - 🍌 halkar man på ett bananskal ramlar godis ur hinken
  - 🐕 hundarna i flexikoppel springer fram och snor godis (spring ifrån dem!).
    Man ser godiset flyga ur hinken och in i munnen på hunden.
  - 🍂 en vindpust blåser iväg lite godis
  - 💀 spökhuset skrämmer en så att man tappar godis (men man får mer sedan)
- **Tappat godis** ligger kvar en stund, så man hinner plocka upp det igen.
- **Klockan 20** (eller om man går hem efter 19:30) går man hem. Där tar
  pappa **pappaskatt**. Den är olika varje kväll: procenten snurrar först
  och stannar sedan någonstans mellan 0 % (pappa somnade i soffan) och
  30 %. På resultatsidan flyger godiset från hinken till pappas skål, en
  stapel visar hur mycket var och en fick, och uträkningen står under
  (till exempel 🍬 57 − 👨 17 = 😋 40). Stjärnorna ⭐⭐⭐ och rekordet
  räknas på hela hinken, så det blir inte färre stjärnor för att pappa
  var hungrig.
- På gatorna går folk som säger saker: bananpappan (som tappar bananskal),
  hundägarna, tonåringen och barnen som tipsar om var det bästa godiset
  finns. Mamma och pappa skickar sms under kvällen.

Testa att ändra i `godis/game.js`:

- hur lång kvällen är (`speltid`, i sekunder) och hur fort barnet går
  (`fart`)
- pappaskatten (`pappaskatt`): vilka procent det kan bli, hur ofta (`vikt`)
  och vad pappa säger
- hur mycket godis som behövs för stjärnorna (`stjarnor`)
- husen (`hus`): vem som bor där, vad de säger, hur mycket godis de ger, när
  de öppnar och stänger och vad det står på lappen på dörren
- dräkterna (`drakter`) och vad folket på gatorna säger (`folk`)
- hur länge det man får syns vid dörren (`visaGodis`) och hur fort det
  flyger iväg (`flygTid`)
- hur många bananskal det finns (`bananskal`), hur länge tappat godis ligger
  kvar (`tappatKvar`) och hur busiga hundarna är (`hundKoppel`, `hundSer`,
  `hundJagar`, `hundVila`)
- sms:en (`sms`), vad man säger om de konstiga sakerna (`skrap`) och vad
  pappa säger (`pappa`)
- musiken: längst ner i `game.js` finns `MUSIK`

## Lägga till ett nytt spel

1. Kopiera en av spelmapparna, till exempel `stjarnor/`, och ge den ett nytt namn.
2. Ändra `<title>` i den nya mappens `index.html`.
3. Lägg till ett nytt kort i menyn i `index.html` i roten (kopiera ett av
   `<a class="kort ...">` och ändra länk, emoji och text, även den
   engelska i `data-en`).

## Köra spelet

### På datorn

Dubbelklicka på `index.html` i någon av spelmapparna, till exempel `stjarnor/index.html` eller `bord/index.html`.

Menyn länkar till mappar, och det fungerar bara när sidan ligger på en
webbserver. Vill du testa menyn på datorn, kör `python3 -m http.server 8000`
i projektmappen och öppna `http://localhost:8000`.

### På iPad eller telefon (lägg upp det på nätet gratis)

Det enklaste sättet är GitHub Pages:

1. Lägg in ändringarna på `main`-grenen.
2. Gå till repots **Settings → Pages** på GitHub.
3. Under *Build and deployment*, välj **Deploy from a branch**, sedan
   `main` och `/ (root)`, och tryck **Save**.
4. Efter någon minut ligger spelet på
   `https://svanburger.github.io/TestGame/`.

Varje gång ni pushar till `main` uppdateras spelet där automatiskt.

**Tips:** Öppna sidan i Safari på iPaden, tryck på dela-knappen och välj
**Lägg till på hemskärmen**. Då får spelet en egen ikon och startar i
helskärm som en riktig app.

### Testa på iPaden utan att lägga upp på nätet

Om datorn och iPaden är på samma wifi, kör detta i projektmappen på datorn:

```sh
python3 -m http.server 8000
```

Öppna sedan `http://<datorns-ip>:8000` i Safari på iPaden.

### Hörs inget ljud?

På iPad och iPhone hörs inget ljud om ljudlöst-läget är på. Ljudet
startar först när man tryckt på skärmen en gång (det kräver Safari).

## Idéer på vad spelet kan bli

Alla spelen är byggda på samma sätt: reglerna finns i `uppdatera()` och
det som syns på skärmen ritas i `rita()`. Några idéer på fler spel:

- **Hoppspel:** figuren hoppar över hinder när man trycker
- **Labyrint:** dra figuren genom en labyrint utan att nudda väggarna
- **Memory:** vänd kort och hitta par
- **Rita och gissa:** en ritapp där man ritar med fingret
- **Rymdspel:** skjut ner asteroider genom att trycka på dem
