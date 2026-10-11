# Våra spel 🎮

Små spel som körs helt i webbläsaren. Inga servrar, inga databaser och
inget att installera. Startsidan är en meny där man väljer spel.

| Fil / mapp   | Vad det är                                                |
|--------------|-----------------------------------------------------------|
| `index.html` | Menyn man ser först.                                      |
| `spel.css`   | Gemensam stil för spelen (fyller skärmen, hus-knappen).   |
| `stjarnor/`  | Spelet "Fånga stjärnorna".                                |
| `parkour/`   | Spelet "Parkourkatten".                                   |

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

## Lägga till ett nytt spel

1. Kopiera en av spelmapparna, till exempel `stjarnor/`, och ge den ett nytt namn.
2. Ändra `<title>` i den nya mappens `index.html`.
3. Lägg till ett nytt kort i menyn i `index.html` i roten (kopiera ett av
   `<a class="kort ...">` och ändra länk, emoji och text).

## Köra spelet

### På datorn

Dubbelklicka på `stjarnor/index.html` eller `parkour/index.html`.

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

Båda spelen är byggda på samma sätt: reglerna finns i `uppdatera()` och
det som syns på skärmen ritas i `rita()`. Några idéer på fler spel:

- **Hoppspel:** figuren hoppar över hinder när man trycker
- **Labyrint:** dra figuren genom en labyrint utan att nudda väggarna
- **Memory:** vänd kort och hitta par
- **Rita och gissa:** en ritapp där man ritar med fingret
- **Rymdspel:** skjut ner asteroider genom att trycka på dem
