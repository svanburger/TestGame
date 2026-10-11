# Bajskorv Studios 💩🎮

Små spel som körs helt i webbläsaren. Inga servrar, inga databaser och
inget att installera. Startsidan är en meny där man väljer spel.

| Fil / mapp   | Vad det är                                                |
|--------------|-----------------------------------------------------------|
| `index.html` | Menyn man ser först, med Bajskorv Studios-loggan.         |
| `spel.css`   | Gemensam stil för spelen (fyller skärmen, hus-knappen).   |
| `stjarnor/`  | Spelet "Fånga stjärnorna".                                |
| `parkour/`   | Spelet "Parkourkatten".                                   |
| `pappa/`     | Spelet "Låt pappa vila".                                  |
| `hund/`      | Spelet "Hundpromenaden".                                  |

Varje spel är en egen mapp med en `index.html` och en `game.js`. Det mesta
man vill ändra finns i `INSTALLNINGAR` högst upp i `game.js`. Spara filen
och ladda om sidan, så syns ändringen.

Spelen fungerar på iPad, telefon och dator. Uppe till vänster finns två
knappar: 🏠 tar en tillbaka till menyn och ⏸ pausar. I pausmenyn kan man
fortsätta, börja om eller gå till menyn. På datorn pausar man med P eller
Esc. Spelen pausar också av sig själva om man byter app.

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
- **Trassel:** Jagar hunden en ekorre runt ett träd trasslar kopplet sig.
  Gå runt trädet åt det håll som pilen visar för att få loss det.
- Promenaden går genom **🏘️ Kvarteret** (lyktstolpar med lappar, katter på
  staketen och en sur gubbe med en perfekt gräsmatta som hunden gärna vill
  bajsa på) och sedan **🌳 Parken** (dammen med ankor, ekorrar, korvkiosken,
  hundrastgården och en pappa på en parkbänk) hela vägen hem.
- På vägen möter man folk som säger saker, och ibland får man en
  🏆 utmärkelse. När man kommer fram får man ⭐⭐⭐ för en glad hund och en
  ren trottoar.

Testa att ändra i `hund/game.js`:

- vad folk säger (`pratbubblor`), lapparna på lyktstolparna (`lappar`) och
  betygen när man kommer hem (`betyg`)
- hur ofta hunden bajsar (`bajsTakt`) och hur ofta det blir regnbågsbajs
  (`regnbage`)
- hur många påsar man har (`pasarStart`, `pasarMax`)
- hur långt kopplet är (`koppel`) och hur fort barnet och hunden går
  (`fart`, `hundFart`, `jaktFart`)
- hur fort hunden får tråkigt eller blir vild (`humor`)
- vilka godsaker som finns och hur mycket poäng de ger (`godsaker`)
- vilka hundar och katter man möter (`andraHundar`, `katter`)
- hur långa promenaderna är (`banor`)
- promenadvisslan: längst ner i `game.js` finns `MUSIK`

## Lägga till ett nytt spel

1. Kopiera en av spelmapparna, till exempel `stjarnor/`, och ge den ett nytt namn.
2. Ändra `<title>` i den nya mappens `index.html`.
3. Lägg till ett nytt kort i menyn i `index.html` i roten (kopiera ett av
   `<a class="kort ...">` och ändra länk, emoji och text).

## Köra spelet

### På datorn

Dubbelklicka på `stjarnor/index.html`, `parkour/index.html`, `pappa/index.html` eller `hund/index.html`.

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
