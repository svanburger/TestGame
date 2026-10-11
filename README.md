# Vårt spel 🎮

Ett litet spel som körs helt i webbläsaren. Inga servrar, inga databaser och
inget att installera: bara tre filer.

| Fil          | Vad den gör                                         |
|--------------|-----------------------------------------------------|
| `index.html` | Sidan som öppnas. Laddar in de andra två filerna.   |
| `style.css`  | Gör att spelet fyller skärmen och inte scrollar.    |
| `game.js`    | Själva spelet. **Här ändrar man det mesta.**        |

Spelet fungerar på iPad, telefon och dator. Med fingret styr man figuren,
på datorn med musen eller piltangenterna.

## Startspelet: "Fånga stjärnorna"

Det som finns nu är ett startspel att leka med tills ni vet vad ni vill göra:
fånga ⭐ 🍓 🍪, undvik 💣. Man har tre liv och rekordet sparas på enheten.

Allt ritas med emojis, så man behöver inga bildfiler. Ljuden skapas direkt i
webbläsaren, så det behövs inga ljudfiler heller.

### Saker barnen kan ändra direkt

Längst upp i `game.js` finns `INSTALLNINGAR`. Testa att:

- byta `spelare: "🐱"` mot `"🐶"`, `"🦄"` eller `"🚀"`
- lägga till fler saker i `braSaker`, till exempel `"🍕"` eller `"💎"`
- byta `"💣"` mot `"👻"` eller `"🦈"`
- göra spelet lättare eller svårare med `chansForDalig`, `liv` och `falltidStart`
- byta färgerna på himlen (`himmelUppe`, `himmelNere`)

Spara filen och ladda om sidan, så syns ändringen.

## Köra spelet

### På datorn

Dubbelklicka på `index.html`. Det räcker.

### På iPad eller telefon (lägg upp det på nätet gratis)

Det enklaste sättet är GitHub Pages:

1. Lägg in ändringarna på `main`-grenen.
2. Gå till repots **Settings → Pages** på GitHub.
3. Under *Build and deployment*, välj **Deploy from a branch**, sedan
   `main` och `/ (root)`, och tryck **Save**.
4. Efter någon minut ligger spelet på
   `https://svanburger.github.io/TestGame/`.

Varje gång ni pushar till `main` uppdateras spelet där automatiskt.

> Om repot är privat kan GitHub Pages kräva ett betalkonto. Annars kan man
> göra repot publikt, eller dra in mappen på [Netlify Drop](https://app.netlify.com/drop).

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

Ramen räcker för många sorters spel. Byt bara ut reglerna i `uppdatera()`
och det som ritas i `rita()`:

- **Hoppspel:** figuren hoppar över hinder när man trycker
- **Labyrint:** dra figuren genom en labyrint utan att nudda väggarna
- **Memory:** vänd kort och hitta par
- **Rita och gissa:** en ritapp där man ritar med fingret
- **Rymdspel:** skjut ner asteroider genom att trycka på dem
