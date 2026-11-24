# Katten Görans matteresa 🐱🎓 – specifikation

*Engelska: "Gerald the Cat's Maths Trip". I Bordsplaceringen heter Göran
"Gerald" på engelska, så vi behåller det.*

Ett lugnt mattespel för barn som är 5–12 år. Man väljer sin ålder, följer
katten Göran på en karta och klarar en nivå i taget. Spelet har ingen
tidsgräns, och det blir inte lättare om man svarar fel. Alla som har samma
ålder får samma trappa av nivåer, så att resultaten går att jämföra.

> **Status:** Spelet är byggt efter den här specifikationen (`index.html`,
> `game.js`, `fragor.js`, `matte.css`). Andreas svar på de öppna frågorna
> står i avsnitt 9.
> Det som är **vår egen tolkning** står som *Tolkning:* eller i kolumnen
> "Tolkning". Det som bygger på Skolverket har en källa (se avsnitt 2.1).

---

## 1. Flödet, skärm för skärm

### 1.1 Start och ålder
- Överst står spelets namn, och Göran ligger och sover på en kudde.
  Han vaknar när man trycker någonstans ("Jag vilade bara ögonen. Det heter
  att tänka.").
- **Välj ålder:** åtta stora runda knappar med siffrorna **5 6 7 8 9 10 11 12**
  (och texten "år"). Det behövs ingen läsning, bara siffran.
- Den senast valda åldern är förvald och syns med en ring runt sig (den
  sparas på enheten).
- Bredvid **▶ Börja** finns 🏆, som visar topplistan för den valda åldern.
- Man får välja en annan ålder än sin egen. En runda spelas alltid på en
  gång och sparas inte till senare.
- Uppe till vänster finns 🏠 och ⏸, som i alla spel. I pausmenyn finns
  *Fortsätt*, *Börja om*, *🏆 Topplista* (för den valda åldern), ♪ Musik
  på/av, 🔊 Ljud på/av och *Till menyn*.

### 1.2 Kartan
- En karta med en plats per nivå (6–10 platser) längs en slingrig stig
  (se 5.4). Göran står på den plats man är på nu.
- Klarade platser har en ✅. Platserna längre fram är grå och har ett 🔒.
- Uppe till höger syns **poängen** för rundan.
- Göran säger en replik om platsen ("Här luktar det fisk. Det är ett gott
  tecken.").
- Trycker man på den lysande platsen (eller på **▶**) börjar nivån.
- Mellan två platser går Göran längs stigen. Det tar cirka 2 sekunder och går
  att hoppa över genom att trycka.

### 1.3 En nivå
Högst upp på skärmen finns:
- **8 tomma stjärnor ☆☆☆☆☆☆☆☆**, som fylls ⭐ en i taget.
- **3 fiskar 🐟🐟🐟**, Görans liv.
- *Antalet fel visas aldrig.* Det syns bara som fiskar som försvinner.

I mitten visas frågan med **symboler och bilder**, till exempel `3 + 2 = ?`
med prickar under (se avsnitt 3). Längst ner är **svarsytan**: stora
svarsknappar eller en sifferknappsats (se 3.1).

Görans hörna (nere till vänster eller höger) visar Göran i en liten bild
med en pratbubbla. Bubblan innehåller högst en kort mening.

**Första gången en ny frågetyp kommer** i rundan visar Göran hur man gör.
Han pekar med tassen, en animation visar lösningen på ett exempel, och
sedan kommer en riktig fråga. Exemplet räknas inte. Det visas en gång per
runda och frågetyp. Med knappen *Visa igen* (Görans glasögon 👓) går
exemplet att se igen när man vill.

**Rätt svar:**
- Stjärnan flyger upp i raden, det låter *pling* (se 6) och Göran säger en
  kort replik.
- Efter ungefär en sekund kommer nästa fråga. Man behöver inte trycka.

**Fel svar:**
- Det låter mjukt och snällt. En fisk simmar bort från raden (Göran tittar
  sorgset efter den).
- **Rätt svar visas med en bild** (felbilden för frågetypen, se 3.3) och
  Göran säger till exempel "Mjaa… nästan. Titta här."
- Barnet trycker **▶** när det har tittat klart. Det finns ingen tidsgräns.
- **Hjälp vid nästa fråga av samma sort:** nästa fråga av samma typ visar
  hjälpbilden direkt (prickar, tallinje eller grupper). Talen och
  svårigheten är desamma, bara bilden är tillagd. Svarar man rätt på den
  frågan försvinner hjälpen igen.

**Regler:**
- Man behöver **8 rätt** för att klara nivån. Man har **3 fiskar**.
- Det är aldrig fler än 10 frågor (8 rätt + 2 fel = 10; vid ett tredje fel
  tar fiskarna slut).
- Man kan inte hoppa över en fråga.

### 1.4 Klarad nivå
- När man har 8 stjärnor spelas en fanfar, konfetti (fiskben och stjärnor)
  regnar och Göran gör en dramatisk bugning.
- Ruta: "Nivå 4 klar!" med en bild, bonusen (till exempel `+80`) och rundans
  poäng, som räknas upp.
- Göran säger något stolt ("Jag sa ju att du var ett geni. Jag sa det inte
  högt, men jag tänkte det.").
- **▶** tar en till kartan, där Göran går till nästa plats.
- Efter **sista nivån** (6–10 beroende på ålder) kommer slutet (1.5b).

### 1.5 Slut och topplistan
**a) Tredje fisken är borta.** Göran säger något tröstande ("Även jag missar
ibland. En gång missade jag en hel lax. Den låg på bordet."). Det finns två
stora knappar:
- **🔄 Försök igen:** samma nivå börjar om från **noll stjärnor och tre
  fiskar**. Inget sparas från försöket, och de rätt svaren i det försöket
  ger inga poäng. Rundans poäng från klarade nivåer finns kvar. Man kan
  försöka hur många gånger man vill.
- **🏆 Skriv in mig:** rundan är slut. Poängen räknas (se 4) och
  `Topplista.nyttResultat(...)` anropas. Om man kommer med får man skriva
  sitt namn som i de andra spelen. Därefter visas topplistan för den
  åldern, och man kommer tillbaka till startskärmen.

**b) Sista nivån klar.** Göran hittar sin **guldbjällra** (se 5.4). En liten
filmscen visar hur han sätter fast den på flugan, och bjällran plingar.
Sedan räknas poängen ihop och topplistan visas, som ovan.

---

## 2. Nivåtrappan per ålder

### 2.1 Källor

| Id | Källa | Vad vi använder |
|----|-------|-----------------|
| **K-FK** | Lgr22, del 3 Förskoleklassen, centralt innehåll *Matematiska resonemang och uttrycksformer*. [Lgr22 (pdf)](https://www.skolverket.se/download/18.2cd92ed197a1b2bbcd5e08f/1752153467251/pdf13296.pdf) | "Naturliga tal och deras egenskaper och hur de kan användas för att ange antal och ordning. Del av helhet och del av antal." och "…utforska och beskriva rum, läge, form, riktning, **mönster**, tid och förändring." |
| **K13-T** | Kursplan i matematik (Lgr22), centralt innehåll **åk 1–3, Taluppfattning och tals användning**. [Matematik – GRGRMAT01](https://www.skolverket.se/undervisning/grundskolan/kursplaner-for-grundskolan/subjects/GRGRMAT01) | Naturliga tal och deras egenskaper, positionssystemet, enkla tal i bråkform (del av helhet och del av antal), de fyra räknesätten, huvudräkning och skriftliga metoder. |
| **K13-A** | Samma, **åk 1–3, Algebra** | Matematiska likheter och likhetstecknets betydelse. Enkla **talmönster** och geometriska mönster. |
| **K13-S** | Samma, **åk 1–3, Samband och förändring** | Proportionella samband, till exempel **dubbelt och hälften**. |
| **K13-P** | Samma, **åk 1–3, Problemlösning** | Strategier för problemlösning i enkla vardagssituationer (våra korta lästal). |
| **K46-T** | Kursplan i matematik (Lgr22), centralt innehåll **åk 4–6, Taluppfattning och tals användning**. Samma sida som ovan. | Rationella tal **inklusive negativa tal**, positionssystemet för hela tal och tal i **decimalform**, tal i **procentform** och deras samband med bråk- och decimalform, bråk och decimaltal i vardagen. Räknemetoder med naturliga tal och tal i bråk- och decimalform. |
| **K46-A** | Samma, **åk 4–6, Algebra** | Obekanta tal och hur de kan betecknas med en symbol. Enkla algebraiska uttryck och ekvationer. Mönster i talföljder. |
| **K46-S** | Samma, **åk 4–6, Samband och förändring** | Proportionalitet och hur proportionella samband uttrycks i bråk-, decimal- och procentform. |
| **K46-SS** | Samma, **åk 4–6, Sannolikhet och statistik** | Sannolikhet, chans och risk. Tabeller och diagram, lägesmåtten medelvärde, typvärde och median. |
| **K46-P** | Samma, **åk 4–6, Problemlösning** | Strategier för problemlösning i vardagssituationer (lästal). |
| **KR3** | Lgr22, *Kriterier för bedömning av godtagbara kunskaper i slutet av årskurs 3* (matematik) | Används som "taket" för 9 år. |
| **BS** | Skolverkets bedömningsstöd: *Hitta matematiken* (kartläggning i förskoleklass) och *Bedömningsstöd i taluppfattning* för åk 1–3 | Idéer till frågetyper för de minsta: subitisering (se antal utan att räkna), talraden, del av helhet och jämföra. |

> ⚠️ **Viktigt om källorna:** Den här miljön fick inte öppna
> `www.skolverket.se`, eftersom nätverksinställningarna spärrar sidan.
> Formuleringarna ovan kommer från **Skolverkets texter som de visas i
> sökresultat** från skolverket.se (Lgr22 och kursplanssidan GRGRMAT01).
> De är inte lästa direkt på sidan. Innan vi bygger bör någon öppna
> kursplanen och **kontrollera ordalydelsen**, särskilt:
> - talområdet i **KR3** (åk 3). Sökningen visade bara den äldre
>   Lgr11-formuleringen "heltalsområdet 0–200", inte den nuvarande texten.
> - att K46-SS faktiskt nämner medelvärde, typvärde och median, och
>   sannolikhet. Det bygger på mitt minne av Lgr22.
> - innehållet i bedömningsstöden (**BS**), som jag inte har kunnat läsa.
>   Där har jag bara använt namnen och den allmänna inriktningen.
>
> Kursplanen anger **inte** vad som ska läras ett visst år inom ett
> stadium. Uppdelningen per ålder nedan är därför **helt vår egen
> tolkning**, gjord så att trappan går jämnt uppåt och att 9 år ungefär
> når åk 3-nivå och 12 år åk 6-nivå.

**Ålder och stadium (tolkning):** 5 år = förskoleklass-ish (K-FK, BS).
6 år = förskoleklass/början av åk 1. 7–9 år = åk 1–3. 10–12 år = åk 4–6.
Ett barn som är 6 år i oktober går ofta i förskoleklass, så trappan för
6 år börjar lätt.

### 2.2 Så läser man tabellerna
- **Antal nivåer:** yngre barn har färre nivåer (Andreas beslut): 5 år har
  6, 6 år 7, 7 år 8, 8 år 9 och 9–12 år 10. Bjällran hittas på sista
  nivån.
- Varje nivå har ett **recept**: en eller två frågetyper (se 3) och
  talområdet. Har en nivå två typer kommer de om vartannat, alltid i samma
  ordning (A B A B …), så att varje försök blir lika svårt.
- **Svar:** 🔘3 = tre svarsknappar, 🔘4 = fyra svarsknappar, ⌨ =
  sifferknappsats.
- Exakt samma recept står i `NIVAER` i `fragor.js`. Ändrar man där ska
  tabellerna här ändras också.

### 2.3 Fem år, 6 nivåer (K-FK, BS)

| Nivå | Frågetyp(er) | Talområde | Svar | Källa |
|---|---|---|---|---|
| 1 | `rakna` (räkna saker i tärningsmönster) | 1–5 | 🔘3 | K-FK, BS |
| 2 | `rakna` (utspridda saker) + `flest` | 1–8 | 🔘3 / 🔘2 bilder | K-FK, BS |
| 3 | `siffraAntal` (vilken bild har lika många som siffran?) | 1–10 | 🔘3 bilder | K-FK |
| 4 | `talrad` (vilket tal saknas på stigen?) + `monster` (bildmönster) | 0–10 | 🔘3 | K-FK (ordning, mönster) |
| 5 | `plusBild` | summa ≤ 5 | 🔘3 | K-FK, BS |
| 6 | `minusBild` (Göran äter upp några) + `delHelhet` (hur många är i lådan?) | ≤ 5 | 🔘3 | K-FK ("del av helhet") |

*Tolkning:* Plus och minus med symboler står inte som innehåll i
förskoleklassen. Därför visas `+` och `−` för 5 år alltid med bilder
under, och talen hålls inom 5.

### 2.4 Sex år, 7 nivåer

| Nivå | Frågetyp(er) | Talområde | Svar | Källa |
|---|---|---|---|---|
| 1 | `rakna` (i tioruta) | 1–10 | 🔘4 | K-FK, BS |
| 2 | `jamforTal` (vilket tal är störst/minst?) | 0–20 | 🔘3 | K13-T |
| 3 | `talrad` | 0–20 | 🔘4 | K13-T |
| 4 | `plusBild` | summa ≤ 10 | 🔘4 | K13-T |
| 5 | `minusBild` + `tiokamrat` (7 + ? = 10) | ≤ 10 | 🔘4 | K13-T |
| 6 | `dubbeltHalften` + `talmonster` (hoppa 2 steg) | ≤ 20 | 🔘4 | K13-S, K13-A |
| 7 | `saknadTerm` (3 + ? = 7) | ≤ 10 | 🔘4 | K13-A (likhetstecknet) |

### 2.5 Sju år (åk 1), 8 nivåer

| Nivå | Frågetyp(er) | Talområde | Svar | Källa |
|---|---|---|---|---|
| 1 | `tiotalEntal` (buntar med 10 och lösa pinnar) | 11–99 | ⌨ | K13-T (positionssystemet) |
| 2 | `plus` + `minus` utan tiotalsövergång | 0–20 | ⌨ | K13-T |
| 3 | `plus` + `minus` med tiotalsövergång (8 + 5, 13 − 5) | 0–20 | ⌨ | K13-T |
| 4 | `jamforTal` + `talrad` | 0–100 | 🔘3 / ⌨ | K13-T |
| 5 | `saknadTerm` | ≤ 20 | ⌨ | K13-A |
| 6 | `talmonster` (+2, +5, +10, −1) | ≤ 100 | ⌨ | K13-A |
| 7 | `plus` + `minus` tvåsiffrigt och ensiffrigt utan växling (34 + 5) | ≤ 99 | ⌨ | K13-T |
| 8 | `brakPizza` (½, ¼) + `dubbeltHalften` | ≤ 20 | 🔘 bilder / ⌨ | K13-T (bråk), K13-S |

### 2.6 Åtta år (åk 2), 9 nivåer

| Nivå | Frågetyp(er) | Talområde | Svar | Källa |
|---|---|---|---|---|
| 1 | `plus` + `minus` med hela tiotal (40 + 30) | ≤ 100 | ⌨ | K13-T |
| 2 | `plus` tvåsiffrigt utan växling | ≤ 99 | ⌨ | K13-T |
| 3 | `plus` tvåsiffrigt med växling (38 + 27) | ≤ 100 | ⌨ | K13-T |
| 4 | `minus` tvåsiffrigt, med och utan växling | ≤ 100 | ⌨ | K13-T |
| 5 | `gangerGrupp` (2:ans, 5:ans och 10:ans tabell) | ≤ 100 | ⌨ | K13-T |
| 6 | `delatDelning` (dela fiskar lika på katter) | ≤ 100 | ⌨ | K13-T |
| 7 | `brakPizza` (½, ⅓, ¼) + `brakAvAntal` (⅓ av 12) | ≤ 20 | 🔘 bilder / ⌨ | K13-T (del av helhet och del av antal) |
| 8 | `tallinje` (var pekar pilen?) | 0–100 | ⌨ | K13-T |
| 9 | `saknadTerm` + `talmonster` (+3, +4, −5, −10) | ≤ 100 | ⌨ | K13-A |

Inga lästal för 8 år (Andreas beslut).

### 2.7 Nio år (åk 3), 10 nivåer

| Nivå | Frågetyp(er) | Talområde | Svar | Källa |
|---|---|---|---|---|
| 1 | `tiotalEntal` med hundratal (plattor, stavar, kuber) | 101–999 | ⌨ | K13-T |
| 2 | `plus` + `minus` med hela tiotal och hundratal (520 − 200) | ≤ 1 000 | ⌨ | K13-T |
| 3 | `plus` + `minus` med växling | ≤ 200 | ⌨ | K13-T, KR3 |
| 4 | `gangerGrupp` (tabellerna 2, 3, 4, 5, 10) | ≤ 100 | ⌨ | K13-T |
| 5 | `delatDelning` inom samma tabeller | ≤ 100 | ⌨ | K13-T |
| 6 | `brakAvAntal` (⅔ av 12) | ≤ 30 | ⌨ | K13-T (del av antal) |
| 7 | `tallinje` | 0–1 000 | ⌨ | K13-T |
| 8 | `talmonster` (även ·2) | ≤ 200 | ⌨ | K13-A |
| 9 | `saknadFaktor` (4 · ? = 20) + `saknadTerm` | ≤ 200 | ⌨ | K13-A |
| 10 | `plus` med växling + `gangerGrupp` (3, 4, 6) blandat | ≤ 1 000 | ⌨ | K13-T |

*Tolkning:* Nivå 3 är satt efter "0–200", som är talet i Skolverkets
material för åk 3 (Lgr11). Det ska stämmas av mot KR3.

### 2.8 Tio år (åk 4), 10 nivåer

| Nivå | Frågetyp(er) | Talområde | Svar | Källa |
|---|---|---|---|---|
| 1 | `tiotalEntal` (tusental) + `tallinje` | ≤ 10 000 | ⌨ | K46-T |
| 2 | `gangerGrupp` (tabellerna 3, 4, 6, 7, 8, 9) | ≤ 90 | ⌨ | K46-T |
| 3 | `delatDelning` (samma tabeller, utan rest) | ≤ 90 | ⌨ | K46-T |
| 4 | `tallinje` med tiondelar | 0–2 | ⌨ med `,` | K46-T (decimalform) |
| 5 | `brakPizza` (pizzan visas, välj bråket) + `brakTallinje` | nämnare 3–8 | 🔘4 | K46-T |
| 6 | `negativ` (över noll på en termometer) | −10–10 | ⌨ med `−` | K46-T (negativa tal) |
| 7 | `ganger` tvåsiffrigt · ensiffrigt (23 · 3) | ≤ 300 | ⌨ | K46-T |
| 8 | `talmonster` (hitta regeln: 3, 7, 11, ?) | ≤ 200 | ⌨ | K46-A |
| 9 | `vag` (3x + 2 = 14) | x ≤ 10 | ⌨ | K46-A |
| 10 | `lastal` (ett steg) | ≤ 100 | ⌨ | K46-P |

### 2.9 Elva år (åk 5), 10 nivåer

| Nivå | Frågetyp(er) | Talområde | Svar | Källa |
|---|---|---|---|---|
| 1 | `jamforTal` med decimaltal (0,3 eller 0,25?) | hundradelar | 🔘3 | K46-T |
| 2 | `plus` + `minus` med decimaltal (1,5 + 2,3) | tiondelar, ≤ 20 | ⌨ med `,` | K46-T |
| 3 | `sammaTal` (½ = 0,5 = 50 %) | – | 🔘4 | K46-T |
| 4 | `procentRutnat` (50 %, 25 %, 10 % …) | – | 🔘4 | K46-T (procent) |
| 5 | `negativ` (−3 + 5, 2 − 6) | −20–20 | ⌨ med `−` | K46-T |
| 6 | `gangerTio` (· och / med 10 och 100) | decimaltal | ⌨ | K46-T |
| 7 | `brakAvAntal` (¾ av 20) | ≤ 100 | ⌨ | K46-T |
| 8 | `vag` | x ≤ 20 | ⌨ | K46-A |
| 9 | `proportion` (recept: fiskar till katter) | ≤ 100 | ⌨ | K46-S |
| 10 | `lastal` (ett eller två steg) | ≤ 100 | ⌨ | K46-P |

### 2.10 Tolv år (åk 6), 10 nivåer

| Nivå | Frågetyp(er) | Talområde | Svar | Källa |
|---|---|---|---|---|
| 1 | `jamforTal` med decimaltal (tusendelar) + `tallinje` | 0–1 | 🔘4 / ⌨ | K46-T |
| 2 | `ganger` decimaltal · heltal (0,5 · 6) | ≤ 100 | ⌨ | K46-T |
| 3 | `procentAvAntal` (25 % av 80) | ≤ 1 000 | ⌨ | K46-T, K46-S |
| 4 | `sammaTal` (bråk, decimal, procent) | – | 🔘4 | K46-T |
| 5 | `negativ` | −50–50 | ⌨ | K46-T |
| 6 | `medelvarde` + `typvardeMedian` | ≤ 20 | ⌨ | K46-SS |
| 7 | `chans` (hur stor är chansen att få en fisk ur påsen?) | – | 🔘4 | K46-SS |
| 8 | `vag` (x på båda sidor: 5x + 2 = 3x + 10) | x ≤ 12 | ⌨ | K46-A |
| 9 | `proportion` | ≤ 200 | ⌨ | K46-S |
| 10 | `lastal` (ett till tre steg) | ≤ 200 | ⌨ | K46-P |

*Tolkning:* Geometri, mätning, klockan och pengar är medvetet utelämnade
(klockan och pengar blir egna spel). Trappan täcker därför inte hela
kursplanen, bara taluppfattning, algebra, samband och lite statistik.

### 2.11 Lästal: vår bedömning

Andreas bad oss kolla vad Skolverket säger och göra en egen bedömning.

- **Vad kursplanen säger** (K13-P och K46-P, enligt sökresultaten från
  skolverket.se, inte lästa direkt): problemlösning ska utgå från
  *vardagliga situationer*. Kursplanen kräver inte att problemen är
  skrivna som text. De kan lika gärna visas med bilder.
- **Vår bedömning:** många 9-åringar läser fortfarande långsamt, och spelet
  ska fungera för barn som inte läser så bra. Därför:
  - **5–9 år:** inga lästal. Vardagsproblemen visas med bilder i stället
    (dela fiskar på katter, Göran äter upp några).
  - **10 år:** lästal med ett steg, högst två korta meningar, bara på sista
    nivån.
  - **11–12 år:** lästal med två eller tre steg på sista nivån.
- Alla lästal handlar om Göran och mat och går att läsa högt för en
  sjuåring.

---

## 3. Frågetyperna

### 3.1 Svarssätt
- **Svarsknappar (🔘):** 2–4 stora knappar (minst 80 × 80 px, med luft
  emellan) som innehåller en siffra eller en liten bild. Rätt knapp
  hamnar på en slumpad plats.
- **Sifferknappsats (⌨):** `1 2 3 / 4 5 6 / 7 8 9 / ⌫ 0 ✔`. Vid behov
  finns också `,` (decimaltal) och `−` (negativa tal). Bara de knappar
  som behövs i frågan syns. Svaret växer fram i rutan `?`. Man skickar
  med ✔ (eller Enter). Tangentbordet på datorn fungerar också.
- Ett **tomt svar** kan inte skickas. Svar med för många siffror (fler än
  svaret plus en) går inte att skriva.
- `0,50` räknas lika som `0,5`. Både `,` och `.` fungerar på datorn.

### 3.2 Slump och fel svarsalternativ (gäller alla typer)
- Talen dras jämnt fördelade inom receptets talområde. **Samma fråga får
  inte komma två gånger i samma försök.**
- **Decimaltal räknas internt som heltal** (tiondelar, hundradelar) för att
  slippa avrundningsfel, och skrivs med decimalkomma på svenska och punkt
  på engelska.
- **Fel svarsalternativ** väljs i den här ordningen tills det finns
  tillräckligt många:
  1. typiska fel för frågetypen (se nedan)
  2. rätt svar ± 1
  3. rätt svar ± 2, ± 10
  4. slumpade tal i talområdet
  
  Felalternativen måste vara **olika varandra**, **inte samma som det
  rätta**, ligga **inom talområdet** och inte vara negativa när typen inte
  har negativa tal. För de minsta (🔘3) ska de skilja sig från det rätta
  med högst 3, så att det inte går att gissa på storleken.

### 3.3 Typerna

Spalten **Felbild** visar vad som visas när man har svarat fel. Hjälpbilden
vid nästa fråga av samma sort är samma bild, fast utan svaret.

| Typ | Så ser frågan ut | Slump | Typiska fel (felalternativ) | Felbild |
|---|---|---|---|---|
| `rakna` | 3–10 saker (🐟🧶🐭) i tärningsmönster, tioruta eller utspridda. Text: `? ` | antal i området; saken slumpas | ±1, ±2 | Sakerna räknas en i taget med en siffra som ploppar upp. |
| `flest` | 2–3 tallrikar med saker. Göran håller upp en skylt med en symbol: 🔝 (flest) eller 🔻 (minst). Man trycker på tallriken. | grupperna skiljer sig med minst 1 | de andra grupperna | Grupperna ställs upp i rader bredvid varandra, så att man ser vilken som är längst. |
| `siffraAntal` | En stor siffra. Svar: bilder med olika många saker | siffran; bilderna = siffran ± 1–2 | ±1, ±2 | Bilden med rätt antal räknas. |
| `talrad` | Stenar på en stig med tal, en sten har `?` | var hålet är, startvärde | ±1, ±2, siffrorna omvända (14 → 41) | Grodor hoppar sten för sten fram till hålet. |
| `monster` | 🍎🍌🍎🍌🍎 ? | mönstertyp ABAB, AAB, ABC; sakerna | de andra sakerna i mönstret | Mönstret ritas igen, med ram runt varje upprepning. |
| `enTillEnMindre` | 5 fiskar och en till som simmar in (eller ut) | n | n, n ± 2 | Fiskarna räknas med fisken som kom eller gick. |
| `plusBild` | `3 + 2 = ?` med 3 och 2 prickar/saker under | a, b inom summan | a + b ± 1, a, b | Prickarna flyttas ihop och räknas. |
| `minusBild` | `5 − 2 = ?`, 5 fiskar där Göran äter 2 (de stryks) | a, b ≤ a | a − b ± 1, a + b, b | Fiskbenen visas, och de som är kvar räknas. |
| `delHelhet` | 6 möss, 2 syns och resten är i en låda (🎁 + 6) | helhet, synliga | helhet, synliga, ±1 | Lådan öppnas och mössen räknas. |
| `tiokamrat` | Tioruta med 7 fyllda: `7 + ? = 10` | 0–10 | 3 ± 1, 7 | De tomma rutorna fylls med en annan färg. |
| `dubbeltHalften` | Två speglar: 4 fiskar → `?` (dubbelt) eller en tårta delad i två (hälften) | tal ≤ området | n + 1, n, n · 2 ± 2 | Fiskarna kopieras (eller delas i två högar) och räknas. |
| `jamforTal` | Två (tre) tal. Göran håller upp 🔝 eller 🔻 | talen skiljer sig; för decimaltal ofta "färre siffror men större" (0,3 vs 0,25) | – (svar = ett av talen) | Talen placeras på en tallinje. |
| `plus` / `minus` | `38 + 27 = ?` | enligt receptet (med eller utan växling) | glömt växlingen (55), ±10, ±1, fel räknesätt | Talen visas som buntar och pinnar som läggs ihop/tas bort; för stora tal en tallinje med hopp. |
| `saknadTerm` / `saknadFaktor` | `3 + ? = 7`, `4 · ? = 20` | svar och känt tal | summan (7), skillnaden fel räknesätt (10), ±1 | En våg i jämvikt med prickar; de som saknas lyser upp. |
| `tiotalEntal` | Buntar med 10 pinnar och lösa pinnar (eller plattor/stavar/kuber) | varje position | siffrorna omvända, ±10, ±1 | Buntarna räknas i tiotal ("10, 20, 30 …") och sedan pinnarna. |
| `talmonster` | `2, 4, 6, 8, ?` | start, steg (+, −, ×2), längd 4–5 | sista + 1, sista + fel steg, steget självt | Pilar med `+2` mellan talen. |
| `tallinje` / `decimalTallinje` / `brakTallinje` | En tallinje med streck och en pil som pekar | var pilen pekar (alltid på ett streck) | grannstrecken, fel skala (×10) | Hopp längs linjen, streck för streck från närmaste märkta tal. |
| `gangerGrupp` / `ganger` | `3 · 4 = ?` med 3 skålar med 4 fiskar (för större tal en rad rutor) | faktorer enligt tabellerna | a + b, a · (b ± 1), ±1 | Skålarna räknas som hopp: 4, 8, 12. |
| `delatDelning` | `12 / 3 = ?` med 12 fiskar och 3 katter | täljare = svar · nämnare | 12 − 3, 3, svar ± 1 | Fiskarna delas ut en i taget till katterna. |
| `brakPizza` | En pizza delad i bitar med några bitar markerade. Svar: bilder (eller bråk) | nämnare, täljare | samma bild med fel antal bitar; uppochnervänt bråk | Bitarna räknas: "1 av 4 bitar". |
| `brakAvAntal` | `⅓ av 12 = ?` med 12 fiskar | antalet delbart med nämnaren | 12 / 3 · 1 ± 1, 12 − 3, 12 · 3 | Fiskarna delas i 3 lika högar, och en hög lyser. |
| `negativTermometer` | En termometer (eller tallinje) med `−3 + 5 = ?` | start, ändring | rätt svar med fel tecken, ±1, a + b utan tecken | Termometern stiger eller sjunker steg för steg, och strecket för 0 syns tydligt. |
| `sammaTal` | `¾` – vilken är samma? 🔘 `0,75` `0,34` `7,5 %` `75 %` | bråk från en fast lista | siffrorna rakt av (0,34), ×10-fel | Ett rutnät med 100 rutor där 75 är fyllda, med alla tre skrivsätt under. |
| `procentRutnat` | Rutnät med 100 rutor där en del är fylld: `? %` | 10, 20, 25, 50, 75 … | ±10, bråket som tal (25 → 4) | Rutorna räknas i rader om tio. |
| `procentAvAntal` | `25 % av 80 = ?` med en stapel i fyra delar | procentsatsen (5, 10, 20, 25, 50, 75 %), antalet så att svaret blir heltal | 80 − 25, 25, ±10 % | Stapeln delas upp i 4 (eller 10) bitar. |
| `gangerTio` | `3,4 · 10 = ?` | tal med 1–2 decimaler | 3,40, 30,4, ×100 | En positionstabell där siffrorna glider ett steg. |
| `vag` | En våg: 3 lådor och 2 fiskar på ena sidan, 14 fiskar på den andra. Under: `3 · x + 2 = 14` | x, koefficient, konstant | 14 − 2 (glömt dela), 14 / 3, x ± 1 | Lika mycket tas bort från båda sidor tills en låda står ensam. |
| `proportion` | En "receptlapp" med bilder: 🐟🐟 → 🐱🐱🐱; ? → 🐱 × 9 | heltalsförhållanden | addera i stället för multiplicera (9 − 3 + 2), ±1 | Tabell med två rader som fylls på steg för steg. |
| `medelvarde` / `typvardeMedian` | Staplar med fiskar för 5 katter | värden så att medelvärdet blir heltal | summan, största, mittersta stapeln (median i stället för medel) | Fiskarna flyttas från höga staplar till låga tills alla är lika. |
| `chans` | En påse med 6 🐟 och 2 🦴. "Vad är troligast?" som symboler 🎯; eller `? av 8` | antal av varje | det mindre antalet, totalen | Sakerna ställs upp i rader och de som räknas lyser. |
| `lastal` | En till två korta meningar med en bild (högst 15 ord), till exempel "Göran äter 3 fiskar varje dag. Hur många på 7 dagar?" | mallar med tal enligt receptet | som `ganger`, `plus` osv. | Bilden ritas som grupper/tallinje plus uträkningen. |

**Mallar för lästal:** Lästalen skrivs som mallar på båda språken, med
Göran och mat i centrum ("fiskpinnar", "tårtbitar", "kuddar"). De ska
gå att läsa högt för en sjuåring. Ord som är svåra att läsa används inte.
Exempel:
- "Göran har 24 fiskpinnar. Han delar lika med 3 vänner och sig själv.
  Hur många får var och en?"
- "En podd om algebra är 45 minuter. Göran somnar efter 20. Hur många
  minuter missar han?" (Detta är tid, men inte klockan, så det får vara
  med.)

---

## 4. Poäng och topplista

### 4.1 Poäng
- Varje **rätt svar** ger **10 · nivå** poäng.
- Varje **klarad nivå** ger en **bonus** på **20 · nivå** poäng.
- En klarad nivå ger alltså `8 · 10n + 20n = 100n`. Efter k klarade
  nivåer har man **`50 · k · (k + 1)`** poäng.
- **Rundans poäng** = poängen för klarade nivåer + de rätt svaren i sista
  försöket på nästa nivå (där rundan tog slut).
- Fel drar inte av något. Misslyckade försök som man har gjort om ger
  inga poäng. Det finns ingen tidsbonus.
- Poängen är oberoende av ålder. Eftersom varje ålder har sin egen
  topplista jämför man ändå bara med jämnåriga.

**Räkneexempel:**

| Vad som hände | Uträkning | Poäng | Nivå på listan |
|---|---|---|---|
| Klarade nivå 1–6 och fick 3 rätt i sista försöket på nivå 7 | 50 · 6 · 7 + 3 · 70 = 2 100 + 210 | **2 310** | 6 |
| Klarade nivå 1–3, misslyckades två gånger på nivå 4, och fick 2 rätt i sista försöket | 50 · 3 · 4 + 2 · 40 = 600 + 80 | **680** | 3 |
| 9 år: klarade alla 10 nivåer | 50 · 10 · 11 | **5 500** (högst möjliga) | 10 |
| 5 år: klarade alla 6 nivåer | 50 · 6 · 7 | **2 100** (högst för 5 år) | 6 |
| Fick 3 rätt på nivå 1 och skrev sedan in sig | 3 · 10 | **30** | 0 |

### 4.2 Topplista per ålder
- En topplista **per ålder**, alltså 8 listor. Varje rad visar
  **namn · nivå · poäng**, till exempel `Elsa · nivå 6 · 2 310 poäng`.
- *Nivå* är **den högsta nivån man klarade** (Andreas beslut). Har man
  inte klarat någon nivå står det "nivå 0".
- Listan sorteras på poäng. Eftersom poängen alltid ökar med nivån hamnar
  de som har kommit längre överst.
- Resultat från testlänkar (se 8) kommer inte med.

### 4.3 Ändringar i `topplista.js` och `supabase.sql`

1. **Nya rader i `SPELEN`**, en per ålder. Supabase godkänner bara spel-id
   med **bokstäver a–z** (`check (spel ~ '^[a-z]{2,20}$')`), så siffror
   fungerar inte i id:t: `mattefem`, `mattesex`, `mattesju`, `matteatta`,
   `mattenio`, `mattetio`, `matteelva`, `mattetolv`. Raderna har
   `grupp: "matte"`, `etikett: "7"` (åldern) och `niva: true`.
2. **`nyttResultat(spelId, poang, { niva })`** skickar nivån vidare till
   `fragaNamn` och `laggTill`, så att raden blir `{ namn, poang, tid, niva }`.
3. **`ritaLista`** visar `nivå 6` (`level 6`) mellan namn och poäng när
   spelet har `niva: true`.
4. **Menyns 🏆 Topplista** (beslut: överskådligt, inte kladdigt): de åtta
   listorna har **en enda flik** (🐱). Under rubriken finns en rad med små
   åldersknappar (5–12), och man trycker på den ålder man vill se. Samma
   rad syns när topplistan öppnas från spelet.
5. **Supabase** (`supabase.sql`): en ny kolumn `niva`. Funktionen
   `spara_resultat` får en sjätte parameter `p_niva` (som kan utelämnas),
   och `hamta_topplista` returnerar också `niva`. De gamla versionerna av
   funktionerna tas bort först, så att det bara finns en av varje.
   - **Innan Andreas har kört den nya SQL:en** sparas matteresultaten ändå:
     om Supabase inte känner igen `p_niva` skickar `topplista.js` samma
     resultat igen utan nivån. Nivån syns då bara på enheten där
     resultatet sparades.
   - Gamla resultat och de andra spelen påverkas inte (deras `niva` är tom).

---

## 5. Katten Göran

### 5.1 Så beskrivs han i Bordsplaceringen (`bord/game.js`)
- "Katten Göran" / "Gerald the cat", ansikte 🐱, sak 🎀, tröjfärg
  `#f5cba7`.
- **Brudens (kusin Linneas) katt.** "Har fluga i dag." Han ska sitta
  bredvid bruden.
- Linnea om honom: "Göran äter bara lax. Och ibland en tårtbit.",
  "Göran har en egen stol hemma. Och en egen soffa.", "Göran är min tärna.
  Han har varit med från början.", "Göran vill titta på fåglarna."
- Göran själv säger bara "Mjau." och "(Göran spinner. Han tycker om
  bröllop.)"
- README: "kusinens katt Göran som är med överallt" är ett av de vuxna
  skämten om fåniga vanor.

**Hur det stämmer med vår Göran:** flugan, att han älskar mat (lax och
tårta) och att han är van vid att bli behandlad som en person stämmer
precis. Det nya är att han **pratar**. Förklaring i spelet: "På bröllopet
sa jag bara mjau. Det var inte min dag." Han bär samma 🎀-fluga och har
samma pälsfärg (`#f5cba7`, ljust orange).

### 5.2 Profil
- **Utseende:** rund och lite för välfödd, runda glasögon han inte behöver
  ("De får mig att se klok ut."), en liten fluga och en
  **guldbjällra som saknas** (det finns ett tomt band på halsen).
- **Personlighet:** dramatisk, älskar mat och somnar gärna mitt i allt. Han
  låtsas veta allt men blir genuint stolt över barnet. Han räknar allt i
  mat ("lika mycket som tre fiskpinnar").
- **Tre animationer räcker:** vaken (vickar på svansen), stolt (bugar,
  glasögonen glittrar), sover (Zzz, efter 20 sekunder utan tryck. Han
  vaknar direkt när man trycker. Det finns ingen tidsgräns, det är bara
  för att det är roligt).
- **Ritas med kod** (former i SVG), inte med emoji, så att
  glasögonen och flugan syns.

### 5.3 Repliker
Alla repliker finns på båda språken, `t("…", "…")`, i `REPLIKER` i
`game.js`. De ska vara korta, eftersom de små inte läser dem själva. Det
är främst de vuxna som läser dem högt. Göran upprepar inte samma replik
två gånger i rad.

**Rätt svar:** "Kattenkelt!" · "Purrfekt!" · "Mjau-gnifikt!" · "Precis
som jag tänkte. Ungefär." · "Det där var värt en fiskpinne." ·
"Jag skulle ha sagt samma sak. Efter en tupplur."

**Flera rätt i rad (3, 5, 8):** "Nu går det undan! Lugnt, jag är med." ·
"Fem i rad! Det är lika mycket som fem fiskpinnar. Jag har räknat." ·
"Jag sa ju att du var ett geni. Jag sa det inte högt, men jag tänkte det."

**Fel svar (alltid snällt, aldrig "fel"):** "Mjaa… nästan. Titta här." ·
"Bra försök! Så här gör man." · "Det där var svårt. Jag fick tänka länge
själv. Jag somnade." · "Vi tittar tillsammans."

**Nya frågetypen (visar hur man gör):** "Jag har lyssnat på en podd om
det här." · "Det här kan jag. Jag har läst baksidan av en bok om det." ·
"Följ min tass."

**Tredje fisken borta:** "Även jag missar ibland. En gång missade jag en hel
lax. Den låg på bordet." · "Vi tar en paus och försöker igen. Jag tar en
tupplur under tiden."

**Klarad nivå:** "Purrfekt! Bjällran är inte här, men du är fantastisk." ·
"Jag är så stolt att flugan sitter snett."

**Vuxenhumor (fåniga vanor, inget annat):** "Jag har lyssnat på en podd om
algebra. Halva. Jag somnade." · "Jag mediterar. Det ser ut som att jag
sover, men det är mycket svårare." · "Jag har en egen stol. Och en egen
soffa. Och en egen bänk i trädgården. Jag delar inte." · "Enligt mina
beräkningar är det dags för mellanmål." · "Jag har bokat in en tupplur
klockan två. Och tre. Och fyra." · "Jag har köpt ett gym-kort. Jag har inte
varit där, men jag tänker på det." · "Jag är tärna. Det är en hedersuppgift."

### 5.4 Kartan: på jakt efter guldbjällran
Göran har tappat sin guldbjällra ("Den var en gåva. Från mig. Till mig.").
Varje nivå är en ny plats där han letar. Platserna är **samma för alla
åldrar**. Bara frågorna skiljer sig.

| Nivå | Plats | Göran säger |
|---|---|---|
| 1 | 🍽️ Matskålen i köket | "Jag börjar där jag oftast är." |
| 2 | 🧊 Kylskåpet | "Bjällran kan ha gömt sig bakom laxen. Jag måste kontrollera laxen. Noga." |
| 3 | 🛋️ Hans egen soffa | "Under kuddarna hittar man allt. Utom bjällror, visar det sig." |
| 4 | 🪟 Fönsterbrädan | "Fåglarna kanske har sett något. De vägrar svara." |
| 5 | 🌷 Trädgården | "Det luktar gräs. Jag är inte en utekatt, men jag gör ett undantag." |
| 6 | 🐟 Fisktorget | "Jag letar bara efter bjällran. Att det luktar fisk är en slump." |
| 7 | ⚓ Hamnen | "Båtarna har mycket fisk. Det har inget med saken att göra." |
| 8 | 📚 Biblioteket | "Här är det tyst. Perfekt för att tänka. Med ögonen stängda." |
| 9 | 💒 Bröllopsfesten (från Bordsplaceringen) | "Här var jag tärna. Kanske tappade jag den i tårtan. Jag måste kontrollera tårtan. Noga." |
| 10 | 🪑 Hans egen stol hemma | Bjällran låg **i stolen hela tiden**, under honom: "Jag har inte tappat den. Jag har ruvat på den. Det var meningen." |

Kartan ritas med kod: en stig, 10 runda platsmärken och en emoji eller
enkel bild per plats. Varje plats ger nivåns bakgrund (mjuka färger, inget
som stör talen).

---

## 6. Ljud och musik
Ljuden skapas med Web Audio i koden, som i de andra spelen. Det finns inga
ljudfiler och inget tal.

| När | Ljud |
|---|---|
| Rätt svar | Ett kort, ljust *pling* (sinus, ungefär 880 Hz). |
| Rätt i rad | Plinget blir **en ton högre för varje rätt i rad** (i en durskala). Det börjar om vid fel. |
| Nivå klar | En kort fanfar: fyra stigande toner och ett ackord. |
| Fel svar | Ett mjukt, dovt *bonk* (låg sinus som sjunker lite). Inget surr. |
| Fisken simmar bort | Ett litet *blubb*. |
| Knapptryck | Ett tyst *klick*. |
| Bjällran hittas | Tre klara bjällerklangar. |

**Musik** (Andreas beslut): den gemensamma lugna melodin i `musik.js`
spelas i bakgrunden, lite långsammare än i de andra spelen (tempo 84).
I pausmenyn kan man stänga av musiken (*♪ Musik*) och ljuden (*🔊 Ljud*)
var för sig. Ljudet startar först efter första trycket (Safari kräver det).

---

## 7. Teknik

### 7.1 Filer
```
matte/
  SPEC.md      ← den här filen
  index.html   ← laddar spel.css, matte.css, sprak.js, offline.js,
                 topplista.js, musik.js, fragor.js och game.js
  matte.css    ← utseendet
  fragor.js    ← nivåtrappan (NIVAER) och frågetyperna (TYPER)
  game.js      ← skärmarna, Göran, ljuden, kartan och poängen
  test.js      ← testar frågorna (körs med node, se 8)
  skisser/     ← skisserna som Andreas godkände
```

- **Allt ritas med HTML och SVG**, inte på canvas som de andra spelen.
  Det är lättare att göra stora tydliga knappar, bråk och tallinjer så.
  Hela spelet ligger i en scen som är 1024 × 768 (liggande) eller
  768 × 1024 (stående) och skalas så att den fyller skärmen.
- **Göran** ritas som SVG, efter skisserna: ljust orange (`#f5cba7`), runda
  glasögon, röd fluga och ett guldband på halsen utan bjällra. På sista
  skärmen sitter bjällran på bandet.
- **`fragor.js`** fungerar både i webbläsaren och i node. Varje frågetyp
  får receptet för nivån och en slumpgenerator med frö, så att testerna och
  `?fro=42` ger samma frågor varje gång. Decimaltal rundas med
  `Fragor.runda`, så att det inte blir avrundningsfel som 0,30000000004.
- Det man vill ändra finns högst upp i `game.js`: `INSTALLNINGAR` (antal
  stjärnor och fiskar, poängen, musikens tempo), `PLATSER` och `REPLIKER`.
- Allt som syns finns på **svenska och engelska** med `t("sv", "en")`.

### 7.2 Utanför mappen
- **`index.html` (menyn):** ett nytt kort, "Katten Görans matteresa".
- **`sw.js`:** `"matte"` finns i listan med spel, och `matte/fragor.js`
  och `matte/matte.css` finns i `FILER`, så att spelet fungerar offline.
- **`topplista.js` och `supabase.sql`:** se 4.3.
- **`README.md`:** en rad i tabellen och ett avsnitt om spelet.

### 7.3 Det som sparas på enheten
| Nyckel | Vad |
|---|---|
| `matte-alder` | senast valda ålder |
| `matte-ljud` | ljuden på/av |
| `musik` | musiken på/av (gemensam för alla spel med `musik.js`) |

Rundan sparas inte (Andreas beslut). Går man till menyn mitt i en runda
börjar man om nästa gång.

---

## 8. Så testar man

1. **Testskriptet:** `node matte/test.js` skapar 1 500 frågor för varje
   ålder och nivå och kontrollerar att:
   - varje ålder har rätt antal nivåer (6, 7, 8, 9, 10, 10, 10, 10)
   - det rätta svaret finns bland knapparna och att knapparna är olika
     (även bråk som betyder samma sak, som 1/2 och 2/4)
   - svaret stämmer när det räknas om från frågan (`38 + 27 = ?`)
   - det inte blir negativa svar där det inte ska vara negativa tal, och
     att svaren håller sig inom talområdet
   - det inte blir avrundningsfel
   - det finns minst 10 olika frågor per nivå
   - typerna på en nivå kommer i rätt ordning (A B A B)
   - `0,5`, `0.5` och `−3` läses rätt.
2. **Testlänkar** (resultaten kommer inte med på topplistan):
   - `matte/?alder=9&niva=7` startar direkt på en nivå
   - `matte/?fro=42` ger samma frågor varje gång
   - `matte/?test` visar det rätta svaret i ett hörn.
3. **Spela igenom för hand** (`python3 -m http.server 8000`, öppna
   `http://localhost:8000/matte/`):
   - Klara en nivå: 8 stjärnor ger en fanfar, kartan och rätt poäng.
   - Svara fel 3 gånger: knapparna *Försök igen* och *Skriv in mig* visas.
     Försök igen börjar från noll stjärnor, och rundans poäng är
     oförändrad.
   - Svara fel en gång: rätt svar visas med en bild, och nästa fråga av
     samma sort har en hjälpbild.
   - Antalet fel syns ingenstans.
   - Topplistan: rätt ålder, och raden visar nivån.
   - Byt språk: alla texter är översatta.
4. **iPad och telefon:** stående och liggande, knapparna går lätt att
   träffa, och ljudet hörs efter första trycket.
5. **Utan internet:** öppna en gång med internet, slå på flygläge och ladda
   om. Spelet ska fungera, och resultaten skickas när internet är tillbaka.
6. **Barntest:** ett barn på 5 år och ett på 9 år spelar utan hjälp.
   Förstår de vad de ska göra utan att läsa?

---

## 9. Andreas svar på de öppna frågorna

| Fråga | Beslut |
|---|---|
| 1. Fortsätta senare? | Nej. En runda spelas alltid på en gång. |
| 2. Antal nivåer | Färre för de yngsta: 6, 7, 8, 9 och sedan 10 från 9 år. |
| 3. Nivån på topplistan | Den högsta nivån man klarade. Poängen är de klarade nivåerna plus de rätt svaren på nästa nivå. |
| 4. Menyns topplista | Vårt val: en flik med åldersknappar (se 4.3). |
| 5. Supabase | Ny SQL är okej. Andreas kör den själv. |
| 6. Musik | Ja, en lugn melodi som går att stänga av. |
| 7. Skolverket | Läs kursplanen och stäm av avsnitt 2. **Inte gjort:** sidan gick inte att öppna från den här miljön, så källorna i 2.1 bygger fortfarande på sökresultat. |
| 8. Namn | "Katten Görans matteresa". |
| 9. Annan ålder | Ja, man får välja en annan ålder än sin egen. |
| 10. Lästal | Kolla Skolverket och gör en egen bedömning, definitivt inte för 8-åringar. Se 2.11. |
