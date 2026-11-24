# Professor Görans matteresa 🐱🎓 – specifikation

*Engelska: "Professor Gerald's Maths Trip". I Bordsplaceringen heter Göran
"Gerald" på engelska, så vi behåller det.*

Ett lugnt mattespel för barn som är 5–12 år. Man väljer sin ålder, följer
katten Göran på en karta och klarar en nivå i taget. Spelet har ingen
tidsgräns, och det blir inte lättare om man svarar fel. Alla som har samma
ålder får samma trappa av nivåer, så att resultaten går att jämföra.

> **Status:** Detta är bara en specifikation. Inget är byggt än.
> Det som är **vår egen tolkning** står som *Tolkning:* eller i kolumnen
> "Tolkning". Det som bygger på Skolverket har en källa (se avsnitt 2.1).

---

## 1. Flödet, skärm för skärm

### 1.1 Start och ålder
- Överst står spelets namn, och Professor Göran ligger och sover på en kudde.
  Han vaknar när man trycker någonstans ("Jag vilade bara ögonen. Det heter
  att tänka.").
- **Välj ålder:** åtta stora runda knappar med siffrorna **5 6 7 8 9 10 11 12**
  (och texten "år"). Det behövs ingen läsning, bara siffran.
- Den senast valda åldern är förvald och syns med en ring runt sig (den
  sparas på enheten).
- Om det finns en **sparad runda** (se 1.6) syns en knapp **▶ Fortsätt** med
  åldern och nivån, till exempel "7 år · nivå 4".
- Uppe till vänster finns 🏠 och ⏸, som i alla spel. I pausmenyn finns
  *Fortsätt*, *Börja om*, *🏆 Topplista* (för den valda åldern), 🔊/🔇 och
  *Menyn*.

### 1.2 Kartan
- En karta med **10 platser** som ligger längs en slingrig stig (se 5.4).
  Göran står på den plats man är på nu.
- Klarade platser har en ✔ och tre små stjärnor. Platserna längre fram är
  grå och har ett 🔒.
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
- Efter **nivå 10** kommer slutet (1.5b).

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

**b) Nivå 10 klar.** Göran hittar sin **guldbjällra** (se 5.4). En liten
filmscen visar hur han sätter fast den på flugan, och bjällran plingar.
Sedan räknas poängen ihop och topplistan visas, som ovan.

### 1.6 Avbryta och fortsätta senare
*Tolkning (öppen fråga 1):* En hel runda är 80–100 frågor, vilket är för
långt för en femåring på en gång. Därför sparas rundan på enheten
**mellan nivåerna**: ålder, nivå och poäng (`localStorage`,
`matte-runda`). Startskärmen visar då *▶ Fortsätt*. Nivån man håller på
med sparas inte halvvägs, utan man börjar den från noll stjärnor. Det
följer regeln att inget sparas mellan försöken.

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
- Varje ålder har **10 nivåer**. Nivå 10 är där bjällran hittas.
- Varje nivå har ett **recept**: en eller två frågetyper (se 3) och
  talområdet. Har en nivå två typer kommer de om vartannat, alltid i samma
  ordning (A B A B …). Då blir varje försök lika svårt.
- **Svar:** 🔘3 = tre svarsknappar, 🔘4 = fyra svarsknappar, ⌨ =
  sifferknappsats.
- **Talområdet** gäller både talen i frågan och svaret, om inget annat står.

### 2.3 Fem år (K-FK, BS)

| Nivå | Frågetyp(er) | Talområde | Svar | Källa |
|---|---|---|---|---|
| 1 | `rakna` (räkna saker, i tärningsmönster) | 1–5 | 🔘3 | K-FK, BS |
| 2 | `rakna` (utspridda saker) | 1–8 | 🔘3 | K-FK, BS |
| 3 | `flest` (vilken grupp har flest/minst?) | 1–8 | 🔘2–3 bilder | K-FK, BS |
| 4 | `siffraAntal` (vilken bild har lika många som siffran?) | 1–10 | 🔘3 bilder | K-FK |
| 5 | `talrad` (vilket tal saknas på stigen?) | 0–10 | 🔘3 | K-FK (ordning) |
| 6 | `monster` (bildmönster: vad kommer sedan?) | ABAB, AAB, ABC | 🔘3 bilder | K-FK (mönster) |
| 7 | `enTillEnMindre` (en fisk till / en fisk mindre) | 0–10 | 🔘3 | K-FK |
| 8 | `plusBild` | summa ≤ 5 | 🔘3 | K-FK, BS |
| 9 | `minusBild` (Göran äter upp några) | 0–5 | 🔘3 | K-FK, BS |
| 10 | `delHelhet` (hur många gömmer sig i lådan?) | helhet ≤ 6 | 🔘3 | K-FK ("del av helhet") |

*Tolkning:* Plus och minus med symboler står inte som innehåll i
förskoleklassen. Därför visas `+` och `−` för 5 år alltid med bilder
under, och talen hålls inom 5.

### 2.4 Sex år

| Nivå | Frågetyp(er) | Talområde | Svar | Källa |
|---|---|---|---|---|
| 1 | `rakna` (i tioruta) | 1–10 | 🔘4 | K-FK, BS |
| 2 | `jamforTal` (vilket tal är störst?) | 0–20 | 🔘2–3 | K13-T |
| 3 | `talrad` | 0–20 | 🔘4 | K13-T |
| 4 | `plusBild` | summa ≤ 10 | 🔘4 | K13-T |
| 5 | `minusBild` | 0–10 | 🔘4 | K13-T |
| 6 | `tiokamrat` (vad blir tio tillsammans med 7?) | 10 | 🔘4 | K13-T |
| 7 | `dubbeltHalften` | dubbelt ≤ 10, hälften av jämna tal ≤ 10 | 🔘4 | K13-S |
| 8 | `talmonster` (hoppa 2 steg: 2, 4, 6, ?) | 0–20 | 🔘4 | K13-A |
| 9 | `plus` + `minus` utan tiotalsövergång | 0–20 | 🔘4 | K13-T |
| 10 | `saknadTerm` (3 + ? = 7) | 0–10 | 🔘4 | K13-A (likhetstecknet) |

### 2.5 Sju år (åk 1)

| Nivå | Frågetyp(er) | Talområde | Svar | Källa |
|---|---|---|---|---|
| 1 | `tiotalEntal` (buntar med 10 och lösa pinnar) | 10–99 | ⌨ | K13-T (positionssystemet) |
| 2 | `plus` + `minus` utan tiotalsövergång | 0–20 | ⌨ | K13-T |
| 3 | `plus` med tiotalsövergång (8 + 5) | 0–20 | ⌨ | K13-T |
| 4 | `minus` med tiotalsövergång (13 − 5) | 0–20 | ⌨ | K13-T |
| 5 | `jamforTal` + `talrad` | 0–100 | 🔘3 / ⌨ | K13-T |
| 6 | `saknadTerm` | 0–20 | ⌨ | K13-A |
| 7 | `talmonster` (+2, +5, +10, −1) | 0–100 | ⌨ | K13-A |
| 8 | `plus` tvåsiffrigt + ensiffrigt utan växling (34 + 5) | 0–100 | ⌨ | K13-T |
| 9 | `brakPizza` (halv, en fjärdedel) | ½, ¼ | 🔘3 bilder | K13-T (bråk, del av helhet) |
| 10 | `dubbeltHalften` + `minus` tvåsiffrigt − ensiffrigt utan växling | 0–100 | ⌨ | K13-S, K13-T |

### 2.6 Åtta år (åk 2)

| Nivå | Frågetyp(er) | Talområde | Svar | Källa |
|---|---|---|---|---|
| 1 | `plus` + `minus` med hela tiotal (40 + 30) | 0–100 | ⌨ | K13-T |
| 2 | `plus` tvåsiffrigt + tvåsiffrigt utan växling | 0–100 | ⌨ | K13-T |
| 3 | `plus` med växling (38 + 27) | 0–100 | ⌨ | K13-T |
| 4 | `minus` utan växling, sedan med växling | 0–100 | ⌨ | K13-T |
| 5 | `gangerGrupp` (2:ans, 5:ans och 10:ans tabell) | ≤ 50 | ⌨ | K13-T (de fyra räknesätten) |
| 6 | `delatDelning` (dela 12 fiskar lika på 3 katter) | ≤ 30 | ⌨ | K13-T |
| 7 | `brakPizza` (½, ⅓, ¼) + `brakAvAntal` (hälften av 8) | ≤ 20 | 🔘4 / ⌨ | K13-T |
| 8 | `tallinje` (var pekar pilen? streck vid varje tiotal) | 0–100 | ⌨ | K13-T |
| 9 | `talmonster` (+3, +4, −5, −10) | 0–200 | ⌨ | K13-A |
| 10 | `saknadTerm` (? + 15 = 40) | 0–100 | ⌨ | K13-A |

### 2.7 Nio år (åk 3)

| Nivå | Frågetyp(er) | Talområde | Svar | Källa |
|---|---|---|---|---|
| 1 | `tiotalEntal` med hundratal (plattor, stavar, kuber) | 100–999 | ⌨ | K13-T |
| 2 | `plus` + `minus` med hela hundratal och tiotal (300 + 40, 520 − 200) | 0–1 000 | ⌨ | K13-T |
| 3 | `plus` + `minus` tvåsiffrigt med växling | 0–200 | ⌨ | K13-T, KR3 |
| 4 | `gangerGrupp` (tabellerna 2, 3, 4, 5, 10) | ≤ 50 | ⌨ | K13-T |
| 5 | `delatDelning` inom samma tabeller | ≤ 50 | ⌨ | K13-T |
| 6 | `brakAvAntal` (⅓ av 12 fiskar) | ≤ 30 | ⌨ | K13-T (del av antal) |
| 7 | `tallinje` | 0–1 000 | ⌨ | K13-T |
| 8 | `talmonster` (även ×2) | 0–200 | ⌨ | K13-A |
| 9 | `saknadFaktor` (4 · ? = 20) + `saknadTerm` | ≤ 100 | ⌨ | K13-A |
| 10 | `lastal` (ett steg, med bild) | ≤ 100 | ⌨ | K13-P |

*Tolkning:* Nivå 3 och 7 är satta efter "0–200", som är det tal som
syntes i Skolverkets material (Lgr11). Det ska stämmas av mot KR3.

### 2.8 Tio år (åk 4)

| Nivå | Frågetyp(er) | Talområde | Svar | Källa |
|---|---|---|---|---|
| 1 | `tiotalEntal` (tusental) + `tallinje` | 0–10 000 | ⌨ | K46-T |
| 2 | `gangerGrupp` (alla tabeller 1–10) | ≤ 100 | ⌨ | K46-T |
| 3 | `delatDelning` (alla tabeller, utan rest) | ≤ 100 | ⌨ | K46-T |
| 4 | `decimalTallinje` (tiondelar) | 0–2 | ⌨ med `,` | K46-T (decimalform) |
| 5 | `brakPizza` (jämför bråk med samma nämnare) + `brakTallinje` | nämnare 2–8 | 🔘4 | K46-T |
| 6 | `negativTermometer` | −10–10 | ⌨ med `−` | K46-T (negativa tal) |
| 7 | `ganger` tvåsiffrigt × ensiffrigt (23 · 3) | ≤ 300 | ⌨ | K46-T |
| 8 | `talmonster` (hitta regeln: 3, 7, 11, ?) | 0–200 | ⌨ | K46-A |
| 9 | `vag` (ekvation som våg: 3 · x + 2 = 14) | x ≤ 10 | ⌨ | K46-A |
| 10 | `lastal` (ett–två steg) | ≤ 500 | ⌨ | K46-P |

### 2.9 Elva år (åk 5)

| Nivå | Frågetyp(er) | Talområde | Svar | Källa |
|---|---|---|---|---|
| 1 | `jamforTal` med decimaltal (0,25 eller 0,3?) | hundradelar | 🔘2–4 | K46-T |
| 2 | `plus` + `minus` med decimaltal (1,5 + 2,3) | tiondelar, ≤ 20 | ⌨ med `,` | K46-T |
| 3 | `sammaTal` (½ = 0,5, ¼ = 0,25, ¾, 1⁄10) | – | 🔘4 | K46-T |
| 4 | `procentRutnat` (50 %, 25 %, 10 %, 75 %) | – | 🔘4 / ⌨ | K46-T (procent) |
| 5 | `negativTermometer` (−3 + 5, 2 − 6) | −20–20 | ⌨ med `−` | K46-T |
| 6 | `gangerTio` (× och / med 10 och 100) | decimaler | ⌨ | K46-T |
| 7 | `brakAvAntal` (¾ av 20) | ≤ 100 | ⌨ | K46-T |
| 8 | `vag` (två steg) | x ≤ 20 | ⌨ | K46-A |
| 9 | `proportion` (recept: 2 fiskar räcker till 3 katter …) | ≤ 100 | ⌨ | K46-S |
| 10 | `lastal` (två steg) | ≤ 1 000 | ⌨ | K46-P |

### 2.10 Tolv år (åk 6)

| Nivå | Frågetyp(er) | Talområde | Svar | Källa |
|---|---|---|---|---|
| 1 | `jamforTal` med decimaltal (tusendelar) + `decimalTallinje` | 0–10 | 🔘4 / ⌨ | K46-T |
| 2 | `ganger` decimaltal × heltal (0,5 · 6; 1,2 · 3) | ≤ 50 | ⌨ | K46-T |
| 3 | `procentAvAntal` (25 % av 80) | ≤ 1 000 | ⌨ | K46-T, K46-S |
| 4 | `sammaTal` (bråk, decimal, procent: ¾ = 0,75 = 75 %) | – | 🔘4 | K46-T |
| 5 | `negativTermometer` (−4 − 3) | −50–50 | ⌨ | K46-T |
| 6 | `medelvarde` (staplar med fiskar) + `typvardeMedian` | ≤ 20 | ⌨ | K46-SS |
| 7 | `chans` (påse med fiskar: vilken är troligast? hur många av?) | – | 🔘3 / ⌨ | K46-SS |
| 8 | `vag` (x på båda sidor, enkla tal) | x ≤ 20 | ⌨ | K46-A |
| 9 | `proportion` (dubbla receptet, pris per styck utan pengar: "fiskpinnar per katt") | ≤ 200 | ⌨ | K46-S |
| 10 | `lastal` (två–tre steg, blandat) | ≤ 1 000 | ⌨ | K46-P |

*Tolkning:* Geometri, mätning, klockan och pengar är medvetet utelämnade
(klockan och pengar blir egna spel). Därför täcker trappan inte hela
kursplanen, bara taluppfattning, algebra, samband och lite statistik.

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
  försöket på nivån där rundan tog slut.
- Fel drar inte av något. Misslyckade försök som man har gjort om ger
  inga poäng. Det finns ingen tidsbonus.
- Poängen är oberoende av ålder. Eftersom varje ålder har sin egen
  topplista jämför man ändå bara med jämnåriga.

**Räkneexempel:**

| Vad som hände | Uträkning | Poäng |
|---|---|---|
| Klarade nivå 1–6 och fick 5 rätt i sista försöket på nivå 7 | 50 · 6 · 7 + 5 · 70 = 2 100 + 350 | **2 450** |
| Klarade nivå 1–3, misslyckades två gånger på nivå 4, och fick 2 rätt i sista försöket | 50 · 3 · 4 + 2 · 40 = 600 + 80 | **680** |
| Klarade alla 10 nivåer | 50 · 10 · 11 | **5 500** (högst möjliga) |
| Fick 3 rätt på nivå 1 och skrev sedan in sig | 3 · 10 | **30** |

### 4.2 Topplista per ålder
- En topplista **per ålder**, alltså 8 listor. Varje rad visar
  **namn · nivå · poäng**, till exempel `Elsa · nivå 7 · 2 450 poäng`.
- *Nivå* är **den nivå man kom till**, alltså den man spelade när rundan
  tog slut (11 betyder "klarade alla" och visas som 🔔 i stället för en
  siffra). Se öppen fråga 3.
- Listan sorteras på poäng. Eftersom poängen alltid ökar med nivån hamnar
  de som har kommit längre överst.

### 4.3 Ändringar i `topplista.js` och `supabase.sql`

1. **Nya rader i `SPELEN`**, en per ålder. Supabase godkänner bara spel-id
   med **bokstäver a–z** (`check (spel ~ '^[a-z]{2,20}$')` i
   `supabase.sql`), så siffror fungerar inte i id:t:

   ```js
   { id: "mattefem",  ikon: "🐱", namn: t("Görans matteresa – 5 år", "Gerald's Maths Trip – age 5"), niva: true },
   { id: "mattesex",  ... "6 år" ... },
   // mattesju, matteatta, mattenio, mattetio, matteelva, mattetolv
   ```

   `niva: true` betyder att raden ska visa nivån.

2. **`nyttResultat(spelId, poang, val)`** tar emot `val.niva` och skickar
   det vidare till `fragaNamn` och `laggTill`, så att raden blir
   `{ namn, poang, tid, niva }`.

3. **`ritaLista`**: om `spel.niva` och `rad.niva` finns läggs ett
   `<span class="tl-niva">` till mellan namn och poäng: `nivå 7` (`level 7`),
   eller `🔔` när rundan är klar.

4. **Supabase:** en ny kolumn och funktionerna med nivån.

   ```sql
   alter table public.topplista add column if not exists niva smallint
     check (niva is null or niva between 1 and 99);
   -- spara_resultat får en sjätte parameter p_niva smallint default null.
   -- Ta bort den gamla funktionen först (drop function), annars finns två
   -- versioner och anropen blir tvetydiga.
   -- hamta_topplista returnerar också niva.
   ```

   `anropa("spara_resultat", …)` i `skicka()` skickar med `p_niva` när den
   finns, och raderna från `hamta_topplista` behåller `niva`.
   **Andreas behöver köra den nya SQL:en i Supabase** (SQL Editor → Run),
   precis som i README. Tills dess fungerar listorna, men nivån visas bara
   på enheten där resultatet sparades.

5. **Menyns 🏆 Topplista** visar då 8 nya rader. *Förslag:* en enda rad
   "Görans matteresa" som öppnar en liten rad med åldersknappar
   (5–12). Det kräver en `grupp: "matte"` i `SPELEN` och några rader i
   `visa()`. Se öppen fråga 4.

Detta påverkar inte de andra spelen. Rader utan `niva` ser ut som förut.

---

## 5. Professor Göran

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
- **Ritas med kod** (cirklar och former på canvas), inte med emoji, så att
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

## 6. Ljud
Ljudet skapas med Web Audio i koden, som i de andra spelen. Det finns inga
ljudfiler och inget tal. Det kan stängas av i pausmenyn (sparas på
enheten).

| När | Ljud |
|---|---|
| Rätt svar | Ett kort, ljust *pling* (sinus, ungefär 880 Hz, 0,15 s). |
| Rätt i rad | Plinget blir **en ton högre för varje rätt i rad** (stegvis i en durskala, upp till åtta steg). Det börjar om vid fel. |
| Nivå klar | En kort fanfar: fyra stigande toner och en lång ackordton (cirka 1,5 s). |
| Fel svar | Ett mjukt, dovt *bonk* (låg sinus, 220 → 180 Hz, mjuk start). Inget surr och inget "fel"-ljud. |
| Fisken simmar bort | Ett litet *blubb*. |
| Knapptryck | Ett tyst *klick*, så att man märker att det tog. |
| Bjällran hittas | Tre klara bjällerklangar (höga sinustoner med lång avklingning). |
| Göran snarkar | En väldigt tyst, långsam brus-"snarkning" när han sover på startskärmen. |

Ljudet börjar först efter första trycket (Safari kräver det).
Bakgrundsmusik finns inte, eftersom barnen ska kunna koncentrera sig. Se
öppen fråga 6.

---

## 7. Teknik

### 7.1 Filer
```
matte/
  SPEC.md      ← den här filen
  index.html   ← som i de andra spelen: spel.css, sprak.js, topplista.js, game.js
  game.js      ← allt spelet
  test.js      ← testskript för frågorna (körs med node, se 8)
```

`game.js` byggs som de andra spelen, med `uppdatera()` och `rita()` på
canvas och `INSTALLNINGAR` högst upp:

```js
const INSTALLNINGAR = {
  stjarnorForAttKlara: 8,
  fiskar: 3,
  poangPerRatt: 10,   // gånger nivån
  bonusPerNiva: 20,   // gånger nivån
  visaRattSvarTid: 0, // 0 = barnet trycker ▶ själv
  hjalpEfterFel: true,
  sovEfter: 20,       // sekunder innan Göran somnar
};
const NIVAER = {      // recepten i avsnitt 2
  5: [
    { typer: ["rakna"], fran: 1, till: 5, svar: "knappar", knappar: 3, layout: "tarning" },
    // …
  ],
  // 6 … 12
};
const FRAGETYPER = {  // en funktion per typ som skapar en fråga
  rakna: { skapa(recept, slump) { … return { visa, svar, alternativ, felbild }; } },
  // …
};
const PLATSER = [ … ];   // kartan, avsnitt 5.4
const REPLIKER = { … };  // avsnitt 5.3
```

- `skapa()` får en **slumpgenerator** som argument (inte `Math.random`
  direkt). Då kan testskriptet och `?fro=123` ge samma frågor varje gång.
- Allt som syns finns på **svenska och engelska** med `t("sv", "en")`.
- Siffror skrivs med `toLocaleString` (decimalkomma på svenska).
- **Tillgänglighet:** stora tryckytor, hög kontrast och siffror som är
  minst 48 px. Rätt och fel visas med mer än färg (✔, fisken simmar bort).

### 7.2 Utanför mappen
- **`index.html` (menyn):** ett nytt kort `<a class="kort kort-matte"
  href="matte/">` med 🐱🎓, "Görans matteresa" och
  `data-en="Gerald's Maths Trip"`.
- **`sw.js`:** lägg till `"matte"` i listan på rad 32
  (`["stjarnor", …, "bajsbyn", "matte"]`), så att spelet fungerar
  offline. Spelet behöver inga andra filer.
- **`topplista.js` och `supabase.sql`:** se 4.3.
- **`README.md`:** en rad i tabellen och ett avsnitt "Görans matteresa 🐱🎓"
  med vad man kan ändra i `game.js`.

### 7.3 Det som sparas på enheten
| Nyckel | Vad |
|---|---|
| `matte-alder` | senast valda ålder |
| `matte-runda` | `{ alder, niva, poang }` för en påbörjad runda (raderas när rundan är slut) |
| `matte-ljud` | på/av |

---

## 8. Så testar man

1. **Testskriptet** `node matte/test.js` skapar 2 000 frågor för varje
   ålder och nivå och kontrollerar att:
   - det rätta svaret stämmer (räknas om på ett annat sätt)
   - felalternativen är olika, inte samma som det rätta, inom talområdet
     och inte negativa när de inte får vara det
   - talen i frågan ligger inom receptet
   - det inte blir några decimalfel (till exempel `0,30000000004`)
   - det finns minst 10 olika frågor per nivå (så att det inte blir
     upprepning)
   - en nivå med två typer växlar A B A B.
2. **Testlänkar** (bara för oss):
   - `matte/?alder=9&niva=7` startar direkt på en nivå
   - `matte/?fro=42` ger samma frågor varje gång
   - `matte/?test` visar det rätta svaret i ett hörn.
   Resultat från testlänkar skickas inte till topplistan.
3. **Spela igenom för hand** (`python3 -m http.server 8000`, öppna
   `http://localhost:8000/matte/`):
   - Klara en nivå: 8 stjärnor ger en fanfar, kartan och rätt poäng.
   - Svara fel 3 gånger: knapparna *Försök igen* och *Skriv in mig*
     visas. Försök igen börjar från noll stjärnor och rundans poäng är
     oförändrad.
   - Svara fel en gång: rätt svar visas med en bild, och nästa fråga av
     samma sort har en hjälpbild.
   - Antalet fel syns ingenstans.
   - Topplistan: rätt ålder, och raden visar "nivå".
   - Byt språk: alla texter är översatta.
   - Prova med 🏠 mitt i en nivå och *▶ Fortsätt*.
4. **iPad och telefon:** stående och liggande, knapparna går lätt att
   träffa, och ljudet hörs efter första trycket.
5. **Utan internet:** öppna en gång med internet, slå på flygläge och ladda
   om. Spelet ska fungera, och resultaten skickas när internet är tillbaka.
6. **Barntest:** ett barn på 5 år och ett på 9 år spelar utan hjälp.
   Förstår de vad de ska göra utan att läsa?

---

## 9. Öppna frågor till Andreas

1. **Fortsätta senare:** ska rundan sparas mellan nivåerna (förslaget i
   1.6), eller ska en runda alltid spelas på en gång?
2. **10 nivåer per ålder:** är det lagom, eller blir det för långt för de
   minsta? Ett alternativ är 6 nivåer för 5–6 år.
3. **"Nivå" på topplistan:** den nivå man kom till (förslaget), eller den
   högsta nivån man klarade?
4. **Menyns topplista:** 8 rader (en per ålder), eller en rad
   "Görans matteresa" med åldersknappar (förslaget)?
5. **Supabase:** är det okej att lägga till kolumnen `niva` och köra ny
   SQL (4.3)? Annars kan nivån bara visas på den egna enheten.
6. **Musik:** ingen bakgrundsmusik (förslaget), eller en väldigt lugn
   melodi som går att stänga av?
7. **Skolverket:** vill du att jag läser kursplanen direkt på skolverket.se
   och stämmer av avsnitt 2? Då behöver `www.skolverket.se` tillåtas i
   miljöns nätverksinställningar.
8. **Spelets namn:** "Görans matteresa" / "Gerald's Maths Trip", eller
   något annat?
9. **Ålder eller nivå:** ska man få välja en annan ålder än sin egen
   (till exempel en sjuåring som vill spela "6 år")? Förslaget är ja,
   eftersom det är listan för den åldern man hamnar på.
10. **Lästal:** är det okej med lästal redan på nivå 10 för 9 år, eller
    bara för 10–12 år?
