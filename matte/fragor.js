// =====================================================================
//  FRÅGORNA I KATTEN GÖRANS MATTERESA
//
//  Här finns nivåtrappan för varje ålder (NIVAER) och en funktion per
//  frågetyp (TYPER) som slumpar en fråga. Allt som visas på skärmen ritas
//  i game.js, utifrån det som står i frågan:
//
//    text       frågan med symboler, t.ex. "3 + 2 = ?"
//    bild       en bild under frågan (prickar, tallinje, pizza ...)
//    svar       det rätta svaret (ett tal, ett bråk som "1/4" eller en emoji)
//    knappar    svarsknapparna (för de minsta), annars sifferknappsats
//    felbild    bilden som visar rätt svar när man har svarat fel
//    hjalp      bilden som visas vid nästa fråga av samma sort efter ett fel
//
//  Filen fungerar både i webbläsaren och i node (matte/test.js).
//  Se matte/SPEC.md för vilken del av Skolverkets kursplan varje nivå
//  bygger på.
// =====================================================================

(function (rot) {
  const sv = () => typeof rot.SPRAK === "undefined" || rot.SPRAK === "sv";
  const tt = (s, e) => (sv() ? s : e);

  // ---------- Slump som går att upprepa (samma frö ger samma frågor) ----------

  function skapaSlump(fro) {
    let a = (fro >>> 0) || 1;
    const slump = () => {
      a = (a + 0x6d2b79f5) >>> 0;
      let x = a;
      x = Math.imul(x ^ (x >>> 15), x | 1);
      x ^= x + Math.imul(x ^ (x >>> 7), x | 61);
      return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
    };
    slump.heltal = (min, max) => min + Math.floor(slump() * (max - min + 1));
    slump.valj = (lista) => lista[Math.floor(slump() * lista.length)];
    slump.blanda = (lista) => {
      const l = [...lista];
      for (let i = l.length - 1; i > 0; i--) {
        const j = Math.floor(slump() * (i + 1));
        [l[i], l[j]] = [l[j], l[i]];
      }
      return l;
    };
    return slump;
  }

  // ---------- Tal ----------

  // Rundar bort flyttalsfel: 0.1 + 0.2 blir 0.3
  const runda = (x) => Math.round(x * 1e6) / 1e6;

  // Ett tal som text: decimalkomma på svenska, minustecken (−) i stället för bindestreck
  function tal(x) {
    if (typeof x === "string") return x;
    const s = String(runda(x)).replace("-", "−");
    return sv() ? s.replace(".", ",") : s;
  }

  // Läser det barnet har skrivit: "0,5", "0.50" och "−3" går bra
  function lasSvar(text) {
    const s = String(text).trim().replace(",", ".").replace("−", "-");
    if (!/^-?\d+(\.\d+)?$/.test(s)) return NaN;
    return Number(s);
  }

  function arRatt(fraga, givet) {
    if (typeof fraga.svar === "number") return runda(lasSvar(givet)) === runda(fraga.svar);
    return String(givet) === String(fraga.svar);
  }

  function siffrorOmvanda(n) {
    if (n < 10 || n % 1 !== 0) return null;
    const v = Number(String(n).split("").reverse().join(""));
    return v === n ? null : v;
  }

  // Felaktiga svarsalternativ: först typiska fel, sedan ±1, ±2, ±10 och sist slump.
  // Alla är olika, inte samma som det rätta och inom talområdet.
  function felSvar(slump, ratt, typiska, antal, min, max, narhet = 99) {
    const ut = [];
    const ok = (v) =>
      typeof v === "number" && isFinite(v) && v >= min && v <= max &&
      runda(v) !== runda(ratt) && !ut.some((u) => runda(u) === runda(v)) &&
      Math.abs(v - ratt) <= narhet;
    for (const v of typiska) if (ut.length < antal && ok(v)) ut.push(runda(v));
    for (const d of slump.blanda([1, -1, 2, -2]).concat([3, -3, 10, -10])) if (ut.length < antal && ok(ratt + d)) ut.push(runda(ratt + d));
    for (let f = 0; ut.length < antal && f < 200; f++) {
      const v = slump.heltal(Math.max(min, ratt - narhet), Math.min(max, ratt + narhet));
      if (ok(v)) ut.push(v);
    }
    return ut;
  }

  // Svarsknappar med det rätta svaret på en slumpad plats
  function knappar(slump, ratt, fel) {
    return slump.blanda([ratt, ...fel]).map((v) => ({ varde: v, text: tal(v) }));
  }

  // ---------- Saker att räkna ----------

  const SAKER = ["🐟", "🧶", "🐭", "🍤", "🍓", "🧀", "🐦", "🍪", "🍰", "🥕"];
  const MONSTERSAKER = ["🍎", "🍌", "🐟", "🧶", "⭐", "🌸", "🧀", "🔵"];

  // ---------- Frågetyperna ----------
  //  Varje typ får receptet för nivån (p) och slumpen. Den returnerar en fråga.

  const TYPER = {
    // Räkna saker på en bild
    rakna(p, s) {
      const n = s.heltal(p.fran, p.till);
      const sak = s.valj(SAKER);
      const layout = p.layout || "spritt";
      return {
        nyckel: "r" + n,
        text: "?",
        bild: layout === "tioruta" ? { typ: "tioruta", fyllda: n, sak } : { typ: "saker", grupper: [{ antal: n, sak }], layout },
        svar: n,
        knappar: knappar(s, n, felSvar(s, n, [], (p.knappar || 3) - 1, 1, p.till + 2, 3)),
        felbild: { typ: "saker", grupper: [{ antal: n, sak }], layout: "rad", numrera: true },
        hjalp: { typ: "saker", grupper: [{ antal: n, sak }], layout: "rad" },
      };
    },

    // Vilken grupp har flest?
    flest(p, s) {
      const antal = p.grupper || 2;
      let tal = [];
      while (tal.length < antal) {
        const n = s.heltal(p.fran, p.till);
        if (!tal.includes(n)) tal.push(n);
      }
      // Bara "flest": "färst" är ett ovanligt ord och "minst" är fel om antal
      const flest = true;
      const ratt = Math.max(...tal);
      const sak = s.valj(SAKER);
      return {
        nyckel: "f" + tal.join("-") + flest,
        text: "",
        // En skylt i stället för text: en liten hög och en stor hög, och handen pekar på den stora
        skylt: { typ: "flestSkylt", sak },
        mest: flest,
        bild: null,
        svar: ratt,
        knappar: tal.map((n) => ({ varde: n, bild: { typ: "saker", grupper: [{ antal: n, sak }], layout: "spritt", liten: true } })),
        felbild: { typ: "jamforRader", rader: tal.map((n) => ({ antal: n, sak, markera: n === ratt })) },
      };
    },

    // Vilken bild har lika många som siffran?
    siffraAntal(p, s) {
      const n = s.heltal(p.fran, p.till);
      const sak = s.valj(SAKER);
      const fel = felSvar(s, n, [], 2, 1, p.till + 2, 2);
      return {
        nyckel: "sa" + n,
        text: String(n),
        stor: true,
        bild: null,
        svar: n,
        knappar: s.blanda([n, ...fel]).map((v) => ({ varde: v, bild: { typ: "saker", grupper: [{ antal: v, sak }], layout: "tarning", liten: true } })),
        felbild: { typ: "saker", grupper: [{ antal: n, sak }], layout: "rad", numrera: true },
      };
    },

    // Vilket tal saknas på stigen?
    talrad(p, s) {
      const langd = p.langd || 5;
      const steg = p.steg || 1;
      const start = s.heltal(p.fran, p.till - (langd - 1) * steg);
      const hal = s.heltal(1, langd - 1);
      const rad = Array.from({ length: langd }, (_, i) => start + i * steg);
      const ratt = rad[hal];
      const fel = [ratt + steg, ratt - steg, siffrorOmvanda(ratt), rad[hal - 1]];
      return {
        nyckel: "tr" + start + "-" + hal,
        text: "",
        bild: { typ: "rad", rutor: rad.map((v, i) => (i === hal ? "?" : tal(v))), stenar: true },
        svar: ratt,
        knappar: p.knappsats ? null : knappar(s, ratt, felSvar(s, ratt, fel, (p.knappar || 3) - 1, 0, p.till + steg, 3 * steg)),
        felbild: { typ: "rad", rutor: rad.map(tal), markera: hal, pilar: rad.slice(1).map(() => "+" + steg) },
        hjalp: { typ: "tallinje", fran: rad[0], till: rad[langd - 1], steg, etiketter: "alla" },
      };
    },

    // Bildmönster: vad kommer sedan?
    monster(p, s) {
      const sorter = s.valj(["AB", "AAB", "ABB", "ABC"]);
      const saker = s.blanda(MONSTERSAKER).slice(0, 3);
      const ord = sorter.split("").map((c) => saker[c.charCodeAt(0) - 65]);
      const visas = sorter.length === 2 ? 5 : sorter.length === 3 ? 6 : 6;
      const rad = Array.from({ length: visas + 1 }, (_, i) => ord[i % ord.length]);
      const ratt = rad[visas];
      const alternativ = [...new Set([...ord, saker[2]])].slice(0, 3);
      return {
        nyckel: "m" + sorter + saker.join(""),
        text: "",
        bild: { typ: "rad", rutor: [...rad.slice(0, visas), "?"], emoji: true },
        svar: ratt,
        knappar: s.blanda(alternativ).map((v) => ({ varde: v, text: v })),
        felbild: { typ: "rad", rutor: rad, emoji: true, markera: visas, grupp: ord.length },
      };
    },

    // Plus med saker under talen
    plusBild(p, s) {
      const a = s.heltal(p.minA || 1, p.max - 1);
      const b = p.ett ? 1 : s.heltal(1, p.max - a);
      const sak = s.valj(SAKER);
      const ratt = a + b;
      return {
        nyckel: "pb" + a + "+" + b,
        text: `${a} + ${b} = ?`,
        bild: { typ: "saker", grupper: [{ antal: a, sak }, { antal: b, sak }], layout: "grupper", tecken: "+" },
        svar: ratt,
        knappar: knappar(s, ratt, felSvar(s, ratt, [ratt + 1, ratt - 1], (p.knappar || 3) - 1, 0, p.max + 2, 3)),
        felbild: { typ: "saker", grupper: [{ antal: a, sak }, { antal: b, sak, farg: true }], layout: "rad", numrera: true },
        hjalp: { typ: "saker", grupper: [{ antal: a, sak }, { antal: b, sak, farg: true }], layout: "rad" },
      };
    },

    // Minus: Göran äter upp några
    minusBild(p, s) {
      const a = s.heltal(2, p.max);
      const b = p.ett ? 1 : s.heltal(1, a - 1);
      const sak = s.valj(["🐟", "🍤", "🧀", "🍰"]);
      const ratt = a - b;
      return {
        nyckel: "mb" + a + "-" + b,
        text: `${a} − ${b} = ?`,
        bild: { typ: "saker", grupper: [{ antal: a - b, sak }, { antal: b, sak, overstruken: true }], layout: "rad" },
        svar: ratt,
        knappar: knappar(s, ratt, felSvar(s, ratt, [a + b, ratt + 1, ratt - 1], (p.knappar || 3) - 1, 0, p.max + 2, 3)),
        felbild: { typ: "saker", grupper: [{ antal: a - b, sak }, { antal: b, sak, overstruken: true }], layout: "rad", numrera: true },
      };
    },

    // Del av helhet: hur många gömmer sig i lådan?
    delHelhet(p, s) {
      const hel = s.heltal(3, p.max);
      const synliga = s.heltal(1, hel - 1);
      const ratt = hel - synliga;
      return {
        nyckel: "dh" + hel + "-" + synliga,
        text: `${synliga} + ? = ${hel}`,
        bild: { typ: "saker", grupper: [{ antal: synliga, sak: "🐭" }, { lada: true }], layout: "grupper", tecken: "+" },
        svar: ratt,
        knappar: knappar(s, ratt, felSvar(s, ratt, [hel, synliga, ratt + 1], (p.knappar || 3) - 1, 0, p.max, 3)),
        felbild: { typ: "saker", grupper: [{ antal: synliga, sak: "🐭" }, { antal: ratt, sak: "🐭", farg: true }], layout: "rad", numrera: true },
      };
    },

    // Tiokamrater: 7 + ? = 10
    tiokamrat(p, s) {
      const n = s.heltal(1, 9);
      const ratt = 10 - n;
      return {
        nyckel: "tk" + n,
        text: `${n} + ? = 10`,
        bild: { typ: "tioruta", fyllda: n, sak: "🐟" },
        svar: ratt,
        knappar: knappar(s, ratt, felSvar(s, ratt, [n, ratt + 1, ratt - 1], (p.knappar || 4) - 1, 0, 10, 3)),
        felbild: { typ: "tioruta", fyllda: n, tomma: true, sak: "🐟" },
      };
    },

    // Dubbelt och hälften
    dubbeltHalften(p, s) {
      const sak = s.valj(["🐟", "🍤", "🧀", "🍓"]);
      if (s() < 0.5) {
        const n = s.heltal(1, Math.floor(p.max / 2));
        const ratt = 2 * n;
        return {
          nyckel: "dd" + n,
          text: `${n} + ${n} = ?`,
          bild: { typ: "saker", grupper: [{ antal: n, sak }, { antal: n, sak }], layout: "spegel" },
          svar: ratt,
          knappar: p.knappsats ? null : knappar(s, ratt, felSvar(s, ratt, [ratt + 1, n, ratt - 2], 3, 0, p.max + 2, 4)),
          felbild: { typ: "saker", grupper: [{ antal: n, sak }, { antal: n, sak, farg: true }], layout: "spegel", numrera: true },
        };
      }
      const ratt = s.heltal(1, Math.floor(p.max / 2));
      const hel = 2 * ratt;
      return {
        nyckel: "dh" + hel,
        text: `½ ${tt("av", "of")} ${hel} = ?`,
        bild: { typ: "saker", grupper: [{ antal: hel, sak }], layout: "rad" },
        svar: ratt,
        knappar: p.knappsats ? null : knappar(s, ratt, felSvar(s, ratt, [hel, ratt + 1, ratt - 1], 3, 0, p.max, 4)),
        felbild: { typ: "saker", grupper: [{ antal: ratt, sak }, { antal: ratt, sak, farg: true }], layout: "spegel", numrera: true },
      };
    },

    // Vilket tal är störst (eller minst)?
    jamforTal(p, s) {
      const antal = p.antal || 2;
      const d = p.decimaler || 0;
      let lista = [];
      for (let f = 0; lista.length < antal && f < 500; f++) {
        let v;
        if (d) {
          // Blanda tal med olika många decimaler, t.ex. 0,3 och 0,25
          const dd = s.heltal(1, d);
          v = runda(s.heltal(Math.round(p.fran * 10 ** dd), Math.round(p.till * 10 ** dd)) / 10 ** dd);
        } else v = s.heltal(p.fran, p.till);
        if (v === 0) continue; // 0 är för lätt att välja bort (eller välja)
        if (!lista.some((x) => runda(x) === v)) lista.push(v);
      }
      const storst = s.valj([true, false]);
      const ratt = storst ? Math.max(...lista) : Math.min(...lista);
      const fran = Math.floor(Math.min(...lista)), till = Math.ceil(Math.max(...lista));
      return {
        nyckel: "jt" + lista.join("|") + storst,
        text: storst ? tt("Tryck på det största talet", "Tap the largest number") : tt("Tryck på det minsta talet", "Tap the smallest number"),
        mest: storst,
        bild: null,
        svar: ratt,
        knappar: lista.map((v) => ({ varde: v, text: tal(v) })),
        felbild: { typ: "tallinje", fran, till: till === fran ? fran + 1 : till, prickar: lista, markera: ratt },
      };
    },

    // Plus med symboler
    plus(p, s) {
      const d = p.decimaler || 0, k = 10 ** d, m = p.multipel || 1;
      for (let f = 0; f < 2000; f++) {
        const a = s.heltal(Math.ceil(p.aMin * k / m), Math.floor(p.aMax * k / m)) * m;
        const b = s.heltal(Math.ceil(p.bMin * k / m), Math.floor(p.bMax * k / m)) * m;
        if ((a + b) / k > p.max) continue;
        const vaxling = (a % 10) + (b % 10) >= 10 || (m >= 10 && (a % 100) + (b % 100) >= 100 && p.vaxling === false);
        if (p.vaxling === true && (a % 10) + (b % 10) < 10) continue;
        if (p.vaxling === false && vaxling) continue;
        return raknefraga(s, p, a / k, b / k, "+");
      }
      throw new Error("plus: hittar ingen fråga");
    },

    // Minus med symboler
    minus(p, s) {
      const d = p.decimaler || 0, k = 10 ** d, m = p.multipel || 1;
      for (let f = 0; f < 2000; f++) {
        const a = s.heltal(Math.ceil(p.aMin * k / m), Math.floor(p.aMax * k / m)) * m;
        const b = s.heltal(Math.ceil(p.bMin * k / m), Math.floor(p.bMax * k / m)) * m;
        if (b >= a) continue;
        const vaxling = a % 10 < b % 10;
        if (p.vaxling === true && !vaxling) continue;
        if (p.vaxling === false && (vaxling || (m >= 10 && a % 100 < b % 100))) continue;
        return raknefraga(s, p, a / k, b / k, "−");
      }
      throw new Error("minus: hittar ingen fråga");
    },

    // 3 + ? = 7
    saknadTerm(p, s) {
      const c = s.heltal(p.min || 2, p.max);
      const a = s.heltal(1, c - 1);
      const ratt = c - a;
      const forst = s() < 0.3;
      return {
        nyckel: "st" + a + "=" + c + forst,
        text: forst ? `? + ${a} = ${c}` : `${a} + ? = ${c}`,
        bild: null,
        svar: ratt,
        knappar: p.knappsats ? null : knappar(s, ratt, felSvar(s, ratt, [c, a + c, ratt + 1], 3, 0, p.max, 5)),
        felbild: { typ: "tallinje", fran: Math.max(0, a - (c > 30 ? 10 : 2)), till: c + (c > 30 ? 10 : 2), steg: c > 30 ? 10 : 1, hopp: [a, c], hoppText: "+" + tal(ratt) },
        hjalp: { typ: "tallinje", fran: Math.max(0, a - (c > 30 ? 10 : 2)), till: c + (c > 30 ? 10 : 2), steg: c > 30 ? 10 : 1, prickar: [a, c] },
      };
    },

    // 4 · ? = 20
    saknadFaktor(p, s) {
      const a = s.valj(p.tabeller);
      const ratt = s.heltal(1, 10);
      const c = a * ratt;
      return {
        nyckel: "sf" + a + "-" + ratt,
        text: `? · ${a} = ${c}`,
        bild: null,
        svar: ratt,
        knappar: null,
        felbild: { typ: "grupper", antal: ratt, per: a, numrera: true },
      };
    },

    // Buntar med tio pinnar och lösa pinnar (och plattor med hundra)
    tiotalEntal(p, s) {
      const n = s.heltal(p.fran, p.till);
      const delar = { tusental: Math.floor(n / 1000), hundratal: Math.floor(n / 100) % 10, tiotal: Math.floor(n / 10) % 10, ental: n % 10 };
      return {
        nyckel: "te" + n,
        text: "?",
        bild: { typ: "buntar", ...delar },
        svar: n,
        knappar: null,
        felbild: { typ: "buntar", ...delar, visaTal: true },
      };
    },

    // Talmönster: 2, 4, 6, 8, ?
    talmonster(p, s) {
      for (let f = 0; f < 500; f++) {
        const regel = s.valj(p.steg);
        const langd = 4;
        let start;
        const rad = [];
        if (regel === "x2") {
          start = s.heltal(1, 6);
          for (let i = 0; i <= langd; i++) rad.push(start * 2 ** i);
        } else {
          start = s.heltal(p.fran, p.till);
          for (let i = 0; i <= langd; i++) rad.push(start + i * regel);
        }
        if (rad.some((v) => v < 0 || v > p.max)) continue;
        const ratt = rad[langd];
        const steg = regel === "x2" ? null : regel;
        return {
          nyckel: "tm" + rad.join(","),
          text: "",
          bild: { typ: "rad", rutor: [...rad.slice(0, langd).map(tal), "?"] },
          svar: ratt,
          knappar: p.knappsats === false ? knappar(s, ratt, felSvar(s, ratt, [rad[langd - 1] + 1, ratt + 1], 3, 0, p.max + 10, 10)) : null,
          felbild: { typ: "rad", rutor: rad.map(tal), markera: langd, pilar: rad.slice(1).map(() => (regel === "x2" ? "·2" : (regel > 0 ? "+" : "−") + Math.abs(regel))) },
          hjalp: { typ: "rad", rutor: [...rad.slice(0, langd).map(tal), "?"], pilar: rad.slice(1, langd).map(() => "?") },
        };
      }
      throw new Error("talmonster: hittar ingen fråga");
    },

    // Var pekar pilen på tallinjen?
    tallinje(p, s) {
      const d = p.decimaler || 0;
      const streck = p.streck; // avståndet mellan två streck
      const etikett = p.etikett || streck * 5; // vilka streck som har en siffra
      // Med fonster visas bara en bit av talområdet, som börjar på ett tal med siffra
      let fran = p.fran, till = p.till;
      if (p.fonster) {
        const forsta = Math.ceil(p.fran / etikett), sista = Math.floor((p.till - p.fonster) / etikett);
        fran = runda(s.heltal(forsta, sista) * etikett);
        till = runda(fran + p.fonster);
      }
      const antalStreck = Math.round((till - fran) / streck);
      const i = s.heltal(1, antalStreck - 1);
      const ratt = runda(fran + i * streck);
      const harEtikett = (v) => Math.abs(runda(v / etikett) - Math.round(v / etikett)) < 1e-9;
      if (harEtikett(ratt) && antalStreck > 2) return TYPER.tallinje(p, s); // pilen ska peka på ett streck utan siffra
      const hoppFran = runda(Math.floor(runda(ratt / etikett)) * etikett);
      return {
        nyckel: "tl" + ratt,
        text: "▼ = ?",
        bild: { typ: "tallinje", fran, till, steg: streck, etikett, pil: ratt },
        svar: ratt,
        knappar: null,
        decimal: d > 0,
        felbild: { typ: "tallinje", fran, till, steg: streck, etikett, pil: ratt, visaPil: true, hoppFran },
        hjalp: { typ: "tallinje", fran, till, steg: streck, etikett, pil: ratt, hoppFran, raknaHopp: true },
      };
    },

    // Gånger som grupper: 3 · 4 = ?
    gangerGrupp(p, s) {
      const a = s.valj(p.tabeller);
      const b = s.heltal(2, p.maxFaktor || 10);
      const ratt = a * b;
      return {
        nyckel: "gg" + b + "x" + a,
        text: `${b} · ${a} = ?`,
        bild: ratt <= 40 ? { typ: "grupper", antal: b, per: a } : null,
        svar: ratt,
        knappar: null,
        felbild: { typ: "grupper", antal: b, per: a, numrera: true },
        hjalp: { typ: "grupper", antal: b, per: a },
      };
    },

    // Delat som rättvis delning: 12 / 3 = ?
    delatDelning(p, s) {
      const katter = s.valj(p.tabeller);
      const ratt = s.heltal(1, p.maxSvar || 10);
      const hel = katter * ratt;
      return {
        nyckel: "dd" + hel + "/" + katter,
        text: `${hel} / ${katter} = ?`,
        bild: hel <= 20 ? { typ: "dela", fiskar: hel, katter } : null,
        svar: ratt,
        knappar: null,
        felbild: { typ: "dela", fiskar: hel, katter, utdelat: ratt },
        hjalp: hel <= 20 ? null : { typ: "dela", fiskar: hel, katter },
      };
    },

    // Bråk som pizzabitar
    brakPizza(p, s) {
      const n = s.valj(p.namnare);
      const k = p.taljare === 1 ? 1 : s.heltal(1, n - 1);
      const ratt = `${k}/${n}`;
      if (p.lage === "brak") {
        // Pizzan visas, man väljer bråket
        const fel = [`${n - k}/${n}`, `${n}/${k}`, `${k}/${n + 1}`, `${k + 1}/${n}`].filter((b, i, l) => b !== ratt && l.indexOf(b) === i && !/\/0$/.test(b));
        return {
          nyckel: "bp" + ratt,
          text: "? ",
          bild: { typ: "pizza", delar: n, markerade: k },
          svar: ratt,
          knappar: s.blanda([ratt, ...s.blanda(fel).slice(0, 3)]).map((v) => ({ varde: v, brak: v })),
          felbild: { typ: "pizza", delar: n, markerade: k, numrera: true, brak: ratt },
        };
      }
      // Bråket visas, man väljer pizzan
      const alt = [[k, n]];
      const kandidater = s.blanda([[n - k, n], [k, n + 1], [k + 1, n], [k, Math.max(2, n - 1)], [1, n === 2 ? 3 : 2], [1, 4], [3, 4]]);
      for (const [a, b] of kandidater) if (alt.length < 3 && a > 0 && a < b && !alt.some(([x, y]) => x * b === a * y)) alt.push([a, b]);
      return {
        nyckel: "bp" + ratt,
        text: "",
        brakText: ratt,
        bild: null,
        svar: ratt,
        knappar: s.blanda(alt).map(([a, b]) => ({ varde: `${a}/${b}`, bild: { typ: "pizza", delar: b, markerade: a, liten: true } })),
        felbild: { typ: "pizza", delar: n, markerade: k, numrera: true, brak: ratt },
      };
    },

    // Bråk av ett antal: ⅓ av 12 = ?
    brakAvAntal(p, s) {
      const n = s.valj(p.namnare);
      const k = p.taljare === 1 ? 1 : s.heltal(1, n - 1);
      const per = s.heltal(2, Math.floor(p.max / n));
      const hel = n * per;
      const ratt = k * per;
      return {
        nyckel: "ba" + k + "/" + n + "-" + hel,
        text: "",
        brakText: `${k}/${n}`,
        textEfter: ` ${tt("av", "of")} ${hel} = ?`,
        bild: hel <= 24 ? { typ: "brakGrupper", delar: n, per, markerade: 0 } : null,
        svar: ratt,
        knappar: null,
        felbild: { typ: "brakGrupper", delar: n, per, markerade: k },
      };
    },

    // Gånger med större tal: 23 · 3 = ?  eller  1,2 · 3 = ?
    ganger(p, s) {
      const d = p.decimaler || 0, k = 10 ** d;
      for (let f = 0; f < 500; f++) {
        const a = s.heltal(p.aMin * k, p.aMax * k);
        if (a % 10 === 0) continue; // ska ha en decimal, eller ental att dela upp
        const b = s.heltal(p.bMin, p.bMax);
        const ratt = runda((a * b) / k);
        if (ratt > p.max) continue;
        const av = a / k;
        const hela = Math.floor(av / 10) * 10 || Math.floor(av);
        const rest = runda(av - hela);
        return {
          nyckel: "ga" + a + "x" + b,
          text: `${tal(av)} · ${b} = ?`,
          bild: null,
          svar: ratt,
          knappar: null,
          decimal: d > 0,
          felbild: {
            typ: "rader",
            rader: rest > 0 && hela > 0
              ? [`${tal(av)} · ${b}`, `= ${tal(hela)} · ${b} + ${tal(rest)} · ${b}`, `= ${tal(hela * b)} + ${tal(runda(rest * b))}`, `= ${tal(ratt)}`]
              : [`${tal(av)} · ${b} = ${tal(ratt)}`],
          },
        };
      }
      throw new Error("ganger: hittar ingen fråga");
    },

    // Bråk och decimaltal på tallinjen (0 till 1)
    brakTallinje(p, s) {
      const n = s.valj(p.namnare);
      const k = s.heltal(1, n - 1);
      const ratt = `${k}/${n}`;
      const fel = [`${k + 1}/${n}`, `${k}/${n + 1}`, `${n - k}/${n}`, `${Math.max(1, k - 1)}/${n}`].filter((b, i, l) => b !== ratt && l.indexOf(b) === i);
      return {
        nyckel: "bt" + ratt,
        text: "▼ = ?",
        bild: { typ: "tallinje", fran: 0, till: 1, delar: n, pil: k / n },
        svar: ratt,
        knappar: s.blanda([ratt, ...fel.slice(0, 3)]).map((v) => ({ varde: v, brak: v })),
        felbild: { typ: "tallinje", fran: 0, till: 1, delar: n, pil: k / n, brakEtiketter: true, visaPil: true },
      };
    },

    // Negativa tal: −3 + 5 = ?
    negativ(p, s) {
      for (let f = 0; f < 1000; f++) {
        const a = s.heltal(p.min, p.max);
        const b = s.heltal(1, p.maxSteg);
        const op = s.valj(p.satt || ["+", "−"]);
        const ratt = op === "+" ? a + b : a - b;
        if (ratt < p.min || ratt > p.max) continue;
        if (p.krav === "korsa" && Math.sign(a) === Math.sign(ratt) && a !== 0 && ratt !== 0) continue; // ska gå över noll
        if (a >= 0 && ratt >= 0) continue; // något av talen ska vara negativt
        const fran = Math.min(a, ratt) - 2, till = Math.max(a, ratt) + 2;
        return {
          nyckel: "ng" + a + op + b,
          text: `${tal(a)} ${op} ${b} = ?`,
          bild: null,
          svar: ratt,
          knappar: null,
          negativ: true,
          felbild: { typ: "tallinje", fran, till, steg: 1, etikett: till - fran > 16 ? 5 : 1, hopp: [a, ratt], hoppText: op + b, termometer: true },
          hjalp: { typ: "tallinje", fran, till, steg: 1, etikett: till - fran > 16 ? 5 : 1, prickar: [a], termometer: true },
        };
      }
      throw new Error("negativ: hittar ingen fråga");
    },

    // Bråk, decimaltal och procent som betyder samma sak
    sammaTal(p, s) {
      const LISTA = [
        ["1/2", 0.5, 50], ["1/4", 0.25, 25], ["3/4", 0.75, 75], ["1/10", 0.1, 10],
        ["1/5", 0.2, 20], ["2/5", 0.4, 40], ["3/10", 0.3, 30], ["7/10", 0.7, 70], ["1/100", 0.01, 1],
      ];
      const [b, d, pr] = s.valj(LISTA);
      const fran = s.valj(p.fran || ["brak", "decimal", "procent"]);
      const till = s.valj(["brak", "decimal", "procent"].filter((x) => x !== fran));
      const visa = (typ, v) => (typ === "brak" ? { brak: v[0] } : typ === "decimal" ? { text: tal(v[1]) } : { text: v[2] + " %" });
      const vard = [b, d, pr];
      const ratt = till === "brak" ? b : till === "decimal" ? tal(d) : pr + " %";
      // Typiska fel: siffrorna rakt av (3/4 → 0,34), fel tiopotens
      const [t1, t2] = b.split("/").map(Number);
      let fel;
      if (till === "decimal") fel = [tal(runda(t1 + t2 / 100)), tal(runda(d * 10)), tal(runda(d / 10)), tal(runda(1 - d))];
      else if (till === "procent") fel = [t1 + "" + t2 + " %", Math.round(d * 10) + " %", t2 + " %", Math.round(100 - pr) + " %"];
      else fel = [`${t2}/${t1}`, `${t1}/${t2 + 1}`, `${pr}/10`, `${Math.max(1, t2 - t1)}/${t2}`];
      fel = [...new Set(fel)].filter((x) => x !== ratt && !/^0\/|\/0$/.test(x) && !/^0(\s|$)/.test(x));
      const alternativ = s.blanda([ratt, ...s.blanda(fel).slice(0, 3)]);
      return {
        nyckel: "sm" + b + fran + till,
        text: "= ?",
        fore: visa(fran, vard),
        bild: null,
        svar: ratt,
        knappar: alternativ.map((v) => (till === "brak" ? { varde: v, brak: v } : { varde: v, text: v })),
        felbild: { typ: "rutnat", fyllda: pr, under: [b, tal(d), pr + " %"] },
      };
    },

    // Rutnät med 100 rutor: hur många procent är fyllda?
    procentRutnat(p, s) {
      const pr = s.valj(p.procent);
      const fel = [pr + 10, pr - 10, 100 - pr, Math.round(100 / pr)];
      return {
        nyckel: "pr" + pr,
        text: "? %",
        bild: { typ: "rutnat", fyllda: pr },
        svar: pr,
        knappar: s.blanda([pr, ...felSvar(s, pr, fel, 3, 5, 95)]).map((v) => ({ varde: v, text: v + " %" })),
        felbild: { typ: "rutnat", fyllda: pr, raknaRader: true },
      };
    },

    // 25 % av 80 = ?
    procentAvAntal(p, s) {
      for (let f = 0; f < 500; f++) {
        const pr = s.valj(p.procent);
        const hel = s.heltal(1, p.max / 10) * 10;
        const ratt = (pr * hel) / 100;
        if (ratt % 1 !== 0 || ratt === 0) continue;
        const delar = { 50: 2, 25: 4, 75: 4, 10: 10, 20: 5, 5: 20 }[pr];
        const markerade = { 50: 1, 25: 1, 75: 3, 10: 1, 20: 1, 5: 1 }[pr];
        return {
          nyckel: "pa" + pr + "-" + hel,
          text: `${pr} % ${tt("av", "of")} ${hel} = ?`,
          bild: { typ: "stapel", delar, markerade, hel },
          svar: ratt,
          knappar: null,
          felbild: { typ: "stapel", delar, markerade, hel, visaVarden: true },
        };
      }
      throw new Error("procentAvAntal: hittar ingen fråga");
    },

    // · och / med 10 och 100
    gangerTio(p, s) {
      const d = s.heltal(1, 2);
      let a;
      do a = runda(s.heltal(11, 999) / 10 ** d);
      while (a % 1 === 0);
      const m = s.valj([10, 100]);
      const ganger = s() < 0.6;
      const ratt = runda(ganger ? a * m : a / m);
      return {
        nyckel: "gt" + a + ganger + m,
        text: `${tal(a)} ${ganger ? "·" : "/"} ${m} = ?`,
        bild: null,
        svar: ratt,
        knappar: null,
        decimal: true,
        felbild: { typ: "rader", rader: [ganger ? tt(`Siffrorna flyttar ${m === 10 ? "ett steg" : "två steg"} åt vänster.`, `The digits move ${m === 10 ? "one place" : "two places"} to the left.`) : tt(`Siffrorna flyttar ${m === 10 ? "ett steg" : "två steg"} åt höger.`, `The digits move ${m === 10 ? "one place" : "two places"} to the right.`)] },
      };
    },

    // Ekvationer som en våg: 3 · x + 2 = 14
    vag(p, s) {
      const x = s.heltal(1, p.maxX);
      if (p.form === "bada") {
        // 5x + 2 = 3x + 10
        const c = s.heltal(1, 4), a = c + s.heltal(1, 3), b = s.heltal(0, 9);
        const dd = (a - c) * x + b;
        return {
          nyckel: "vb" + a + "-" + b + "-" + c + "-" + x,
          text: ekv(`${a}x + ${b} = ${c}x + ${dd}`),
          rad2: "x = ?",
          bild: { typ: "vag", vanster: { lador: a, fiskar: b }, hoger: { lador: c, fiskar: dd } },
          svar: x,
          knappar: null,
          felbild: { typ: "rader", rader: [ekv(`${a - c}x + ${b} = ${dd}`), ekv(`${a - c}x = ${dd - b}`), `x = ${x}`] },
        };
      }
      const a = s.heltal(p.form === "ett" ? 1 : 2, p.maxA || 5);
      const b = s.heltal(p.form === "ett" ? 1 : 0, 10);
      const c = a * x + b;
      const ax = a === 1 ? "x" : p.punkt ? `${a} · x` : `${a}x`;
      const text = (b ? `${ax} + ${b} = ${c}` : `${ax} = ${c}`);
      return {
        nyckel: "v" + a + "-" + b + "-" + x,
        text,
        rad2: "x = ?",
        bild: { typ: "vag", vanster: { lador: a, fiskar: b }, hoger: { lador: 0, fiskar: c } },
        svar: x,
        knappar: null,
        felbild: { typ: "rader", rader: b ? [`${ax} = ${c} − ${b} = ${c - b}`, a === 1 ? `x = ${x}` : `x = ${c - b} / ${a} = ${x}`] : [`x = ${c} / ${a} = ${x}`] },
      };
    },

    // Proportionalitet: ett recept med fiskar och katter
    proportion(p, s) {
      for (let f = 0; f < 500; f++) {
        const fisk = s.heltal(2, 6), katt = s.heltal(1, 4);
        if (fisk === katt) continue;
        const ggr = s.heltal(2, p.maxGgr || 5);
        const ratt = fisk * ggr;
        if (ratt > p.max) continue;
        return {
          nyckel: "pp" + fisk + "-" + katt + "-" + ggr,
          text: "",
          bild: { typ: "recept", rader: [[fisk, katt], ["?", katt * ggr]] },
          svar: ratt,
          knappar: null,
          felbild: { typ: "recept", rader: Array.from({ length: ggr }, (_, i) => [fisk * (i + 1), katt * (i + 1)]), markera: ggr - 1 },
        };
      }
      throw new Error("proportion: hittar ingen fråga");
    },

    // Medelvärde: staplar med fiskar
    medelvarde(p, s) {
      for (let f = 0; f < 500; f++) {
        const antal = s.heltal(3, 5);
        const varden = Array.from({ length: antal }, () => s.heltal(1, p.max));
        const summa = varden.reduce((a, b) => a + b, 0);
        if (summa % antal) continue;
        const ratt = summa / antal;
        if (varden.every((v) => v === ratt)) continue;
        return {
          nyckel: "mv" + varden.join(","),
          text: tt("medelvärde = ?", "mean = ?"),
          bild: { typ: "staplar", varden },
          svar: ratt,
          knappar: null,
          felbild: { typ: "rader", rader: [`(${varden.join(" + ")}) / ${antal}`, `= ${summa} / ${antal}`, `= ${ratt}`], staplar: { varden, linje: ratt } },
        };
      }
      throw new Error("medelvarde: hittar ingen fråga");
    },

    // Typvärde och median
    typvardeMedian(p, s) {
      for (let f = 0; f < 500; f++) {
        const median = s() < 0.5;
        const antal = median ? s.valj([5, 7]) : s.heltal(5, 7);
        const varden = Array.from({ length: antal }, () => s.heltal(1, p.max));
        const sorterade = [...varden].sort((a, b) => a - b);
        let ratt;
        if (median) ratt = sorterade[(antal - 1) / 2];
        else {
          const rakna = {};
          varden.forEach((v) => (rakna[v] = (rakna[v] || 0) + 1));
          const max = Math.max(...Object.values(rakna));
          const topp = Object.keys(rakna).filter((k) => rakna[k] === max);
          if (topp.length !== 1 || max < 2) continue;
          ratt = Number(topp[0]);
        }
        return {
          nyckel: "tv" + median + varden.join(","),
          text: median ? tt("median = ?", "median = ?") : tt("typvärde = ?", "mode = ?"),
          bild: { typ: "rad", rutor: varden.map(tal) },
          svar: ratt,
          knappar: null,
          felbild: median
            ? { typ: "rad", rutor: sorterade.map(tal), markera: (antal - 1) / 2 }
            : { typ: "rad", rutor: sorterade.map(tal), markeraVarde: tal(ratt) },
        };
      }
      throw new Error("typvardeMedian: hittar ingen fråga");
    },

    // Chans: hur stor är chansen att få en fisk ur påsen?
    chans(p, s) {
      const fisk = s.heltal(1, 7), ben = s.heltal(1, 7);
      const alla = fisk + ben;
      const ratt = `${fisk}/${alla}`;
      const fel = [`${ben}/${alla}`, `${fisk}/${ben}`, `${ben}/${fisk}`, `1/${alla}`].filter((b, i, l) => b !== ratt && l.indexOf(b) === i);
      return {
        nyckel: "ch" + fisk + "-" + ben,
        text: tt("chans för 🐟 = ?", "chance of 🐟 = ?"),
        bild: { typ: "saker", grupper: s.blanda([...Array(fisk).fill("🐟"), ...Array(ben).fill("🦴")]).map((sak) => ({ antal: 1, sak })), layout: "pase" },
        svar: ratt,
        knappar: s.blanda([ratt, ...fel.slice(0, 3)]).map((v) => ({ varde: v, brak: v })),
        felbild: { typ: "saker", grupper: [{ antal: fisk, sak: "🐟", farg: true }, { antal: ben, sak: "🦴" }], layout: "rad", under: `${fisk} ${tt("av", "of")} ${alla} = ${ratt}` },
      };
    },

    // Korta lästal med Göran (bara för de äldsta)
    lastal(p, s) {
      const mall = s.valj(LASTAL.filter((m) => m.steg <= p.steg));
      const q = mall.skapa(s);
      return { nyckel: "lt" + q.text, lastal: true, bild: q.bild || null, knappar: null, ...q };
    },
  };

  // Snyggar till en ekvation: 1x blir x och + 0 försvinner
  const ekv = (e) => e.replace(/(^|[^\d])1x/g, "$1x").replace(/ \+ 0(?=[ =]|$)/g, "");

  // Plus- och minusfrågor ser likadana ut
  function raknefraga(s, p, a, b, op) {
    const ratt = runda(op === "+" ? a + b : a - b);
    const d = p.decimaler || 0;
    const typiska = op === "+" ? [ratt - 10, ratt + 10, ratt + 1, ratt - 1] : [ratt + 10, ratt - 10, a + b, ratt + 1];
    const liten = Math.max(a, b, ratt) <= 20 && !d;
    const fran = Math.min(a, ratt), till = Math.max(a, ratt);
    return {
      nyckel: "pm" + a + op + b,
      text: `${tal(a)} ${op} ${tal(b)} = ?`,
      bild: null,
      svar: ratt,
      knappar: p.knappar ? knappar(s, ratt, felSvar(s, ratt, typiska, p.knappar - 1, 0, p.max + 10, 10)) : null,
      decimal: d > 0,
      felbild: liten
        ? { typ: "tallinje", fran: Math.max(0, fran - 2), till: till + 2, steg: 1, etikett: 1, hopp: [a, ratt], enHoppPerSteg: true }
        : { typ: "tallinje", fran: avrunda(fran, a, b, d, "ned"), till: avrunda(till, a, b, d, "upp"), hopp: [a, ratt], hoppText: op + tal(b), utanStreck: true },
      hjalp: liten ? { typ: "tallinje", fran: Math.max(0, fran - 2), till: till + 2, steg: 1, etikett: 1, prickar: [a] } : null,
    };
  }
  function avrunda(x, a, b, d, hall) {
    const st = d ? 1 : Math.max(a, b) >= 100 ? 100 : 10;
    return hall === "ned" ? Math.floor(x / st) * st : Math.ceil(x / st) * st + (Math.ceil(x / st) * st === x ? st : 0);
  }

  // ---------- Lästal ----------
  //  Korta, med Göran och mat. Ska gå att läsa högt för en sjuåring.

  const LASTAL = [
    {
      steg: 1,
      skapa(s) {
        const per = s.heltal(2, 6), dagar = s.valj([3, 4, 5, 7]);
        return {
          text: tt(`Göran äter ${per} fiskpinnar varje dag. Hur många äter han på ${dagar} dagar?`, `Gerald eats ${per} fish fingers every day. How many does he eat in ${dagar} days?`),
          bild: { typ: "emoji", text: "🐱 🍽️ " + "🐟".repeat(Math.min(per, 6)) },
          svar: per * dagar,
          felbild: { typ: "rader", rader: [`${dagar} · ${per} = ${per * dagar}`] },
        };
      },
    },
    {
      steg: 1,
      skapa(s) {
        const har = s.heltal(30, 90), at = s.heltal(5, har - 10);
        return {
          text: tt(`Göran har ${har} kattgodisar. Han äter upp ${at}. Hur många är kvar?`, `Gerald has ${har} cat treats. He eats ${at}. How many are left?`),
          bild: { typ: "emoji", text: "🐱 🍬🍬🍬" },
          svar: har - at,
          felbild: { typ: "rader", rader: [`${har} − ${at} = ${har - at}`] },
        };
      },
    },
    {
      steg: 1,
      skapa(s) {
        const vanner = s.valj([2, 3, 4, 5]), per = s.heltal(3, 9);
        const alla = (vanner + 1) * per;
        return {
          text: tt(`Göran och ${vanner} vänner delar lika på ${alla} räkor. Hur många räkor får var och en?`, `Gerald and ${vanner} friends share ${alla} prawns equally. How many prawns does each cat get?`),
          bild: { typ: "emoji", text: "🍤 🐱" + " 🐈".repeat(vanner) },
          svar: per,
          felbild: { typ: "rader", rader: [tt(`${vanner} vänner + Göran = ${vanner + 1} katter`, `${vanner} friends + Gerald = ${vanner + 1} cats`), `${alla} / ${vanner + 1} = ${per}`] },
        };
      },
    },
    {
      steg: 2,
      skapa(s) {
        const podd = s.valj([40, 45, 50, 60]), sov = s.valj([10, 15, 20, 25]);
        return {
          text: tt(`En podd om algebra är ${podd} minuter. Göran somnar efter ${sov} minuter. Hur många minuter missar han?`, `A podcast about algebra is ${podd} minutes long. Gerald falls asleep after ${sov} minutes. How many minutes does he miss?`),
          bild: { typ: "emoji", text: "🎧 🐱 💤" },
          svar: podd - sov,
          felbild: { typ: "rader", rader: [`${podd} − ${sov} = ${podd - sov}`] },
        };
      },
    },
    {
      steg: 2,
      skapa(s) {
        const lurar = s.heltal(2, 4), per = s.valj([3, 4, 5, 6]), at = s.heltal(1, 5);
        const ratt = lurar * per - at;
        return {
          text: tt(`Göran tar ${lurar} tupplurar om dagen. Varje tupplur drömmer han om ${per} laxar. ${at} av laxarna äter han upp i drömmen. Hur många laxar är kvar?`, `Gerald takes ${lurar} naps a day. In each nap he dreams of ${per} salmon. He eats ${at} of them in his dreams. How many salmon are left?`),
          bild: { typ: "emoji", text: "😴 " + "🐟".repeat(Math.min(per, 6)) },
          svar: ratt,
          felbild: { typ: "rader", rader: [`${lurar} · ${per} = ${lurar * per}`, `${lurar * per} − ${at} = ${ratt}`] },
        };
      },
    },
    {
      steg: 3,
      skapa(s) {
        const pris = s.valj([2, 3, 4, 5]), katter = s.heltal(3, 6), per = s.valj([2, 3]), rabatt = s.valj([2, 4, 5]);
        const ratt = katter * per * pris - rabatt;
        return {
          text: tt(`Göran bjuder ${katter} katter på kalas. Varje katt får ${per} fiskbullar. En fiskbulle kostar ${pris} fiskben. Göran har en rabatt på ${rabatt} fiskben. Hur många fiskben kostar det?`, `Gerald invites ${katter} cats to a party. Each cat gets ${per} fish balls. One fish ball costs ${pris} fish bones. Gerald has a discount of ${rabatt} fish bones. How many fish bones does it cost?`),
          bild: { typ: "emoji", text: "🎉 " + "🐈".repeat(katter) },
          svar: ratt,
          felbild: { typ: "rader", rader: [`${katter} · ${per} = ${katter * per}`, `${katter * per} · ${pris} = ${katter * per * pris}`, `${katter * per * pris} − ${rabatt} = ${ratt}`] },
        };
      },
    },
    {
      steg: 3,
      skapa(s) {
        const glas = s.valj([4, 5, 6, 8]), dl = s.valj([1.5, 2, 2.5]), drack = s.heltal(1, glas - 1);
        const ratt = runda((glas - drack) * dl);
        return {
          text: tt(`Göran ställer fram ${glas} glas med ${tal(dl)} dl mjölk i varje. Han dricker ur ${drack} av dem. Hur många dl mjölk är kvar?`, `Gerald puts out ${glas} glasses with ${tal(dl)} dl of milk in each. He drinks ${drack} of them. How many dl of milk are left?`),
          bild: { typ: "emoji", text: "🥛".repeat(glas) },
          svar: ratt,
          decimal: true,
          felbild: { typ: "rader", rader: [`${glas} − ${drack} = ${glas - drack}`, `${glas - drack} · ${tal(dl)} = ${tal(ratt)}`] },
        };
      },
    },
  ];

  // ---------- Nivåtrappan ----------
  //  En lista per ålder. Varje nivå har en eller två frågetyper ("typer"),
  //  som kommer om vartannat. Övriga fält är receptet: talområdet och
  //  hur man svarar. knappar: 3 = tre svarsknappar.
  //  Källorna i Skolverket står i matte/SPEC.md, avsnitt 2.

  const NIVAER = {
    5: [
      { typer: ["rakna"], fran: 1, till: 5, layout: "tarning", knappar: 3 },
      { typer: ["rakna", "flest"], fran: 1, till: 8, layout: "spritt", knappar: 3, grupper: 2 },
      { typer: ["siffraAntal"], fran: 1, till: 10 },
      { typer: ["talrad", "monster"], fran: 0, till: 10, knappar: 3 },
      { typer: ["plusBild"], max: 5, knappar: 3 },
      { typer: ["minusBild", "delHelhet"], max: 5, knappar: 3 },
      // Nivå 7–10 är en mjuk bro till 6 år
      { typer: ["rakna"], fran: 4, till: 10, layout: "tioruta", knappar: 3 },
      { typer: ["plusBild", "jamforTal"], max: 10, fran: 1, till: 10, antal: 2, knappar: 3 },
      { typer: ["talrad", "minusBild"], fran: 0, till: 20, max: 10, knappar: 3 },
      { typer: ["plusBild", "minusBild", "tiokamrat"], max: 10, knappar: 3 },
    ],
    6: [
      { typer: ["rakna"], fran: 1, till: 10, layout: "tioruta", knappar: 4 },
      { typer: ["jamforTal"], fran: 1, till: 20, antal: 3 },
      { typer: ["talrad"], fran: 0, till: 20, knappar: 4 },
      { typer: ["plusBild"], max: 10, knappar: 4 },
      { typer: ["minusBild", "tiokamrat"], max: 10, knappar: 4 },
      { typer: ["dubbeltHalften", "talmonster"], max: 20, fran: 0, till: 10, steg: [2], knappsats: false },
      { typer: ["saknadTerm"], max: 10 },
      // Nivå 8–10 är en bro till 7 år
      { typer: ["plus", "minus"], aMin: 1, aMax: 10, bMin: 1, bMax: 9, max: 10 },
      { typer: ["tiotalEntal"], fran: 11, till: 20 },
      { typer: ["plus", "minus"], aMin: 10, aMax: 19, bMin: 1, bMax: 9, max: 20, vaxling: false },
    ],
    7: [
      { typer: ["tiotalEntal"], fran: 11, till: 99 },
      { typer: ["plus", "minus"], aMin: 1, aMax: 19, bMin: 1, bMax: 9, max: 20, vaxling: false },
      { typer: ["plus", "minus"], aMin: 2, aMax: 18, bMin: 2, bMax: 9, max: 20, vaxling: true },
      { typer: ["jamforTal", "talrad"], fran: 1, till: 100, antal: 3, knappsats: true },
      { typer: ["saknadTerm"], max: 20, knappsats: true },
      { typer: ["talmonster"], fran: 0, till: 50, steg: [2, 5, 10, -1], max: 100 },
      { typer: ["plus", "minus"], aMin: 11, aMax: 99, bMin: 1, bMax: 9, max: 99, vaxling: false },
      { typer: ["brakPizza", "dubbeltHalften"], namnare: [2, 4], taljare: 1, max: 20, knappsats: true },
      // Nivå 9–10 är en bro till 8 år
      { typer: ["plus", "minus"], aMin: 10, aMax: 90, bMin: 10, bMax: 90, max: 100, multipel: 10 },
      { typer: ["gangerGrupp"], tabeller: [2, 10] },
    ],
    8: [
      { typer: ["plus", "minus"], aMin: 10, aMax: 90, bMin: 10, bMax: 90, max: 100, multipel: 10 },
      { typer: ["plus"], aMin: 11, aMax: 88, bMin: 11, bMax: 88, max: 99, vaxling: false },
      { typer: ["plus"], aMin: 11, aMax: 89, bMin: 11, bMax: 89, max: 100, vaxling: true },
      { typer: ["minus"], aMin: 20, aMax: 99, bMin: 11, bMax: 89, max: 100 },
      { typer: ["gangerGrupp"], tabeller: [2, 5, 10] },
      { typer: ["delatDelning"], tabeller: [2, 5, 10] },
      { typer: ["brakPizza", "brakAvAntal"], namnare: [2, 3, 4], taljare: 1, max: 20 },
      { typer: ["tallinje"], fran: 0, till: 100, streck: 2, etikett: 10, fonster: 30 },
      { typer: ["saknadTerm", "talmonster"], min: 20, max: 100, fran: 0, till: 60, steg: [3, 4, -5, -10] },
      // Nivå 10 är en bro till 9 år
      { typer: ["tiotalEntal", "plus", "minus"], fran: 101, till: 500, aMin: 20, aMax: 150, bMin: 12, bMax: 89, max: 200, vaxling: true },
    ],
    9: [
      { typer: ["tiotalEntal"], fran: 101, till: 999 },
      { typer: ["plus", "minus"], aMin: 100, aMax: 900, bMin: 10, bMax: 500, max: 1000, multipel: 10 },
      { typer: ["plus", "minus"], aMin: 12, aMax: 150, bMin: 12, bMax: 89, max: 200, vaxling: true },
      { typer: ["gangerGrupp"], tabeller: [2, 3, 4, 5, 10] },
      { typer: ["delatDelning"], tabeller: [2, 3, 4, 5, 10] },
      { typer: ["brakAvAntal"], namnare: [2, 3, 4, 5], max: 30 },
      { typer: ["tallinje"], fran: 0, till: 1000, streck: 20, etikett: 100, fonster: 300 },
      { typer: ["talmonster"], fran: 0, till: 100, steg: [3, 4, 5, 25, -10, "x2"], max: 200 },
      { typer: ["saknadFaktor", "saknadTerm"], tabeller: [2, 3, 4, 5, 10], min: 50, max: 200 },
      { typer: ["plus", "gangerGrupp"], aMin: 100, aMax: 600, bMin: 12, bMax: 399, max: 1000, vaxling: true, tabeller: [3, 4, 6] },
    ],
    10: [
      { typer: ["tiotalEntal", "tallinje"], fran: 1001, till: 9999, streck: 200, etikett: 1000, fonster: 3000 },
      { typer: ["gangerGrupp"], tabeller: [3, 4, 6, 7, 8, 9] },
      { typer: ["delatDelning"], tabeller: [3, 4, 6, 7, 8, 9] },
      { typer: ["tallinje"], fran: 0, till: 2, streck: 0.1, etikett: 0.5, decimaler: 1, fonster: 1.5 },
      { typer: ["brakPizza", "brakTallinje"], namnare: [3, 4, 5, 6, 8], lage: "brak" },
      { typer: ["negativ"], min: -10, max: 10, maxSteg: 8, krav: "korsa" },
      { typer: ["ganger"], aMin: 12, aMax: 49, bMin: 2, bMax: 6, max: 300 },
      { typer: ["talmonster"], fran: 1, till: 30, steg: [3, 4, 6, 7, 9, 11, -4, -6, "x2"], max: 200 },
      { typer: ["vag"], maxX: 10, maxA: 5, punkt: true },
      { typer: ["lastal"], steg: 1 },
    ],
    11: [
      { typer: ["jamforTal"], fran: 0.01, till: 0.99, decimaler: 2, antal: 3 },
      { typer: ["plus", "minus"], aMin: 0.1, aMax: 15, bMin: 0.1, bMax: 9.9, max: 20, decimaler: 1 },
      { typer: ["sammaTal"], fran: ["brak", "decimal"] },
      { typer: ["procentRutnat"], procent: [10, 20, 25, 30, 40, 50, 60, 70, 75, 80, 90] },
      { typer: ["negativ"], min: -20, max: 20, maxSteg: 12 },
      { typer: ["gangerTio"] },
      { typer: ["brakAvAntal"], namnare: [3, 4, 5, 10], max: 100 },
      { typer: ["vag"], maxX: 20, maxA: 9, punkt: true },
      { typer: ["proportion"], max: 100, maxGgr: 6 },
      { typer: ["lastal"], steg: 2 },
    ],
    12: [
      { typer: ["jamforTal", "tallinje"], fran: 0, till: 1, decimaler: 3, antal: 4, streck: 0.05, etikett: 0.25, fonster: 0.75 },
      { typer: ["ganger"], aMin: 0.1, aMax: 9.9, bMin: 2, bMax: 9, max: 100, decimaler: 1 },
      { typer: ["procentAvAntal"], procent: [5, 10, 20, 25, 50, 75], max: 1000 },
      { typer: ["sammaTal"] },
      { typer: ["negativ"], min: -50, max: 50, maxSteg: 30 },
      { typer: ["medelvarde", "typvardeMedian"], max: 20 },
      { typer: ["chans"] },
      { typer: ["vag"], maxX: 12, form: "bada" },
      { typer: ["proportion"], max: 200, maxGgr: 9 },
      { typer: ["lastal"], steg: 3 },
    ],
  };

  // ---------- En nivå: frågorna kommer i en fast ordning av typer ----------
  //  Skapar fråga nr i (0, 1, 2 ...) i ett försök. Samma fråga kommer inte två gånger.
  function nyFraga(alder, niva, nr, slump, sedda) {
    const recept = NIVAER[alder][niva - 1];
    const typ = recept.typer[nr % recept.typer.length];
    for (let f = 0; f < 60; f++) {
      const fraga = TYPER[typ](recept, slump);
      if (sedda && sedda.has(fraga.nyckel) && f < 59) continue;
      if (sedda) sedda.add(fraga.nyckel);
      fraga.typ = typ;
      if (!fraga.knappar && fraga.text === undefined) fraga.text = "";
      return fraga;
    }
  }

  const API = { NIVAER, TYPER, skapaSlump, nyFraga, arRatt, lasSvar, tal, runda };
  if (typeof module !== "undefined" && module.exports) module.exports = API;
  else rot.Fragor = API;
})(typeof window !== "undefined" ? window : globalThis);
