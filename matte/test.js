// Testar frågorna i fragor.js. Kör så här i projektmappen:
//
//   node matte/test.js
//
// Skapar många frågor för varje ålder och nivå och kontrollerar att det
// rätta svaret finns bland knapparna, att knapparna är olika, att det inte
// blir flyttalsfel och att det finns tillräckligt många olika frågor.

const F = require("./fragor.js");

const ANTAL = 1500;
let fel = 0;
const problem = (text) => {
  fel++;
  if (fel <= 40) console.log("  ✗ " + text);
};

const flyttalsfel = (x) => typeof x === "number" && /\d{7,}/.test(String(x).split(".")[1] || "");
const forvantadeNivaer = { 5: 10, 6: 10, 7: 10, 8: 10, 9: 10, 10: 10, 11: 10, 12: 10 };

for (const alder of Object.keys(F.NIVAER).map(Number)) {
  const nivaer = F.NIVAER[alder];
  if (nivaer.length !== forvantadeNivaer[alder]) problem(`${alder} år har ${nivaer.length} nivåer, väntade ${forvantadeNivaer[alder]}`);
  nivaer.forEach((recept, i) => {
    const niva = i + 1;
    const slump = F.skapaSlump(alder * 1000 + niva);
    const olika = new Set();
    for (let n = 0; n < ANTAL; n++) {
      const sedda = new Set();
      let q;
      try {
        q = F.nyFraga(alder, niva, n, slump, sedda);
      } catch (e) {
        problem(`${alder} år nivå ${niva}: ${e.message}`);
        break;
      }
      const var_ = `${alder} år nivå ${niva} (${q.typ})`;
      olika.add(q.nyckel);
      // Typerna kommer om vartannat i fast ordning
      if (q.typ !== recept.typer[n % recept.typer.length]) problem(`${var_}: fel ordning på typerna`);
      if (q.svar === undefined || q.svar === null || (typeof q.svar === "number" && !isFinite(q.svar))) problem(`${var_}: saknar svar`);
      if (flyttalsfel(q.svar)) problem(`${var_}: flyttalsfel i svaret ${q.svar}`);
      if (!q.felbild) problem(`${var_}: saknar felbild`);
      if (q.knappar) {
        const varden = q.knappar.map((k) => String(k.varde));
        if (!varden.includes(String(q.svar))) problem(`${var_}: rätt svar ${q.svar} finns inte bland ${varden}`);
        if (new Set(varden).size !== varden.length) problem(`${var_}: knappar som är lika ${varden}`);
        if (varden.length < 2) problem(`${var_}: för få knappar ${varden}`);
        if (q.knappar.some((k) => typeof k.varde === "number" && k.varde < 0)) problem(`${var_}: negativ knapp ${varden}`);
        if (q.typ === "sammaTal" || q.typ === "brakPizza" || q.typ === "chans" || q.typ === "brakTallinje") {
          // Bråk: inga knappar som är samma tal (2/4 och 1/2)
          const v = q.knappar.map((k) => (typeof k.varde === "string" && k.varde.includes("/") ? eval(k.varde) : k.varde));
          if (new Set(v.map(String)).size !== v.length) problem(`${var_}: två knappar betyder samma sak ${varden}`);
        }
      } else if (typeof q.svar !== "number") problem(`${var_}: knappsats men svaret är inte ett tal (${q.svar})`);
      // Talområdet för negativa tal och för de minsta
      if (typeof q.svar === "number" && q.svar < 0 && !q.negativ) problem(`${var_}: negativt svar ${q.svar}`);
      if (recept.till !== undefined && ["rakna", "talrad", "siffraAntal"].includes(q.typ) && q.svar > recept.till) problem(`${var_}: ${q.svar} är större än ${recept.till}`);
      if (recept.max !== undefined && ["plusBild", "minusBild", "plus", "minus", "saknadTerm"].includes(q.typ) && q.svar > recept.max) problem(`${var_}: ${q.svar} är större än ${recept.max}`);
      // Rätt svar räknas om
      const m = /^(−?[\d,.]+) ([+−·/]) ([\d,.]+) = \?$/.exec(q.text || "");
      if (m) {
        const a = F.lasSvar(m[1]), b = F.lasSvar(m[3]);
        const facit = { "+": a + b, "−": a - b, "·": a * b, "/": a / b }[m[2]];
        if (F.runda(facit) !== F.runda(q.svar)) problem(`${var_}: ${q.text} ska vara ${facit}, inte ${q.svar}`);
      }
      if (!F.arRatt(q, typeof q.svar === "number" ? F.tal(q.svar) : q.svar)) problem(`${var_}: arRatt godkänner inte rätt svar ${q.svar}`);
    }
    if (olika.size < 10 && !(alder === 5 && (niva === 1 || niva === 7))) problem(`${alder} år nivå ${niva}: bara ${olika.size} olika frågor`);
  });
}

// Svaren läses som barnet skriver dem
const q = { svar: 0.5 };
for (const s of ["0,5", "0.5", "0,50", ".5"]) if (F.arRatt(q, s) !== (s !== ".5")) problem(`"${s}" lästes fel`);
if (!F.arRatt({ svar: -3 }, "−3") || !F.arRatt({ svar: -3 }, "-3")) problem("minustecken lästes fel");

console.log(fel ? `\n${fel} fel` : "Alla frågor är okej ✔");
process.exit(fel ? 1 : 0);
