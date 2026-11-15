// =====================================================================
//  BAKGRUNDSMUSIK – en lugn visa med speldosa, harpa, bas och ett mjukt ackord
//
//  Musiken spelas med Web Audio, alltså utan ljudfiler. Den går runt i
//  sexton takter: en vers (C, Am, F, G ...) och en refräng (F, G, Em, Am ...),
//  med ett mjukt eko på speldosan och harpan.
//
//  Så här använder ett spel musiken:
//    Musik.lasUpp(ljud)   vid varje tryck: startar ljudet (iPad och Xbox
//                         vill att man trycker först) och gör att det hörs
//                         även när iPaden står på ljudlöst
//    Musik.starta(ljud)   ljud = spelets AudioContext
//    Musik.paus(true)     tyst under pausen, Musik.paus(false) igen
//    Musik.tempo(118)     snabbare när det händer något (96 är vanligt)
//    Musik.vaxla()        på/av (sparas på enheten)
//    Musik.spelaIn(ljud, sekunder)  lägger ut all musik på en gång (för att
//                         spela in den till en ljudfil)
// =====================================================================

(function () {
  const INSTALLNINGAR = {
    volym: 0.9,       // hela musiken (talet och plingen ska höras över den)
    tempo: 96,        // slag per minut
    framfor: 0.3,     // så många sekunder i förväg tonerna läggs in
    eko: 0.3,         // hur mycket eko speldosan och harpan har
  };

  // Ackorden som tonnummer (60 = mellan-C): grundton, ters, kvint
  const C = [48, 52, 55], AM = [45, 48, 52], F = [41, 45, 48], G = [43, 47, 50], EM = [40, 43, 47];
  const TAKTER = [C, AM, F, G, C, AM, G, C, F, G, EM, AM, F, G, C, C];

  // Melodin (speldosan): [åttondel i takten, ton, längd i åttondelar]
  const MELODI = [
    // Vers
    [[0, 64, 2], [2, 67, 2], [4, 72, 2], [6, 67, 2]],
    [[0, 69, 2], [2, 72, 2], [4, 76, 3], [7, 74, 1]],
    [[0, 72, 4], [4, 69, 4]],
    [[0, 71, 2], [2, 74, 2], [4, 67, 4]],
    [[0, 76, 2], [2, 74, 2], [4, 72, 2], [6, 67, 2]],
    [[0, 69, 2], [2, 71, 2], [4, 72, 2], [6, 64, 2]],
    [[0, 74, 2], [2, 71, 2], [4, 67, 2], [6, 71, 2]],
    [[0, 72, 6]],
    // Refräng
    [[0, 69, 2], [2, 72, 2], [4, 77, 4]],
    [[0, 74, 2], [2, 71, 2], [4, 67, 4]],
    [[0, 71, 2], [2, 72, 2], [4, 74, 2], [6, 76, 2]],
    [[0, 72, 4], [4, 69, 4]],
    [[0, 77, 2], [2, 76, 2], [4, 74, 2], [6, 72, 2]],
    [[0, 71, 3], [3, 72, 1], [4, 74, 4]],
    [[0, 76, 2], [2, 74, 2], [4, 72, 2], [6, 67, 2]],
    [[0, 72, 6]],
  ];
  // Harpan plockar ackordets toner i den här ordningen (3 = grundtonen en oktav upp)
  const PLOCK = [0, 1, 2, 3, 2, 1, 2, 1];

  let ljud = null, graf = null;
  let nastaTid = 0, steg = 0, tempo = INSTALLNINGAR.tempo, pausad = false;
  let pa = true;
  try { pa = localStorage.getItem("musik") !== "av"; } catch (e) { /* då är musiken på */ }

  function hz(ton) {
    return 440 * Math.pow(2, (ton - 69) / 12);
  }

  // Utgången och ekot. Varje AudioContext får sina egna.
  function byggGraf(ctx) {
    const utgang = ctx.createGain();
    utgang.gain.value = INSTALLNINGAR.volym;
    utgang.connect(ctx.destination);
    // Ekot: en fördröjning som matas tillbaka, lite mörkare för varje varv
    const eko = ctx.createDelay(1);
    eko.delayTime.value = 60 / tempo * 0.75;
    const aterkoppling = ctx.createGain();
    aterkoppling.gain.value = 0.35;
    const mork = ctx.createBiquadFilter();
    mork.type = "lowpass";
    mork.frequency.value = 2200;
    const ekoIn = ctx.createGain();
    ekoIn.gain.value = INSTALLNINGAR.eko;
    ekoIn.connect(eko);
    eko.connect(mork);
    mork.connect(aterkoppling);
    aterkoppling.connect(eko);
    mork.connect(utgang);
    // Brus till shakern (ett kort ljud som låter som sand i en burk)
    const brus = ctx.createBuffer(1, ctx.sampleRate * 0.1, ctx.sampleRate);
    const data = brus.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    return { ctx: ctx, utgang: utgang, ekoIn: ekoIn, brus: brus };
  }

  // En ton som klingar ut: typ, när, hur länge, hur starkt, med eller utan eko
  function ton(g, typ, frekvens, start, langd, volym, attack, medEko) {
    const ctx = g.ctx;
    const osc = ctx.createOscillator(), styrka = ctx.createGain();
    osc.type = typ;
    osc.frequency.value = frekvens;
    styrka.gain.setValueAtTime(0.0001, start);
    styrka.gain.exponentialRampToValueAtTime(volym, start + attack);
    styrka.gain.exponentialRampToValueAtTime(0.0001, start + langd);
    osc.connect(styrka);
    styrka.connect(g.utgang);
    if (medEko) styrka.connect(g.ekoIn);
    osc.start(start);
    osc.stop(start + langd + 0.05);
  }

  function spelaSteg(g, nr, tid) {
    const atton = 60 / tempo / 2;
    const takt = Math.floor(nr / 8) % TAKTER.length, iTakt = nr % 8;
    const ackord = TAKTER[takt];
    // Mjukt ackord som håller hela takten
    if (iTakt === 0) {
      ackord.forEach((t) => ton(g, "triangle", hz(t + 12), tid, atton * 8.5, 0.018, 0.25, false));
    }
    // Harpa: plockar ackordet
    const plock = PLOCK[iTakt] === 3 ? ackord[0] + 12 : ackord[PLOCK[iTakt]];
    ton(g, "sine", hz(plock + 12), tid, atton * 3, 0.035, 0.005, true);
    // Bas på första och tredje slaget
    if (iTakt === 0 || iTakt === 4) ton(g, "sine", hz(ackord[0] - 12), tid, atton * 3.5, 0.13, 0.01, false);
    // Shaker på varannan åttondel
    if (iTakt % 2 === 1) {
      const kalla = g.ctx.createBufferSource(), filter = g.ctx.createBiquadFilter(), styrka = g.ctx.createGain();
      kalla.buffer = g.brus;
      filter.type = "highpass";
      filter.frequency.value = 7000;
      styrka.gain.value = 0.02;
      kalla.connect(filter).connect(styrka).connect(g.utgang);
      kalla.start(tid);
    }
    // Speldosan: grundton och en svag överton, som en liten klocka
    MELODI[takt].forEach(([start, nummer, langd]) => {
      if (start !== iTakt) return;
      const klang = Math.max(0.6, atton * langd * 1.4);
      ton(g, "sine", hz(nummer), tid, klang, 0.07, 0.005, true);
      ton(g, "sine", hz(nummer) * 4, tid, klang * 0.4, 0.012, 0.005, true);
    });
  }

  function schemalagg() {
    if (!ljud || !pa || pausad) return;
    if (nastaTid < ljud.currentTime) nastaTid = ljud.currentTime + 0.05;
    while (nastaTid < ljud.currentTime + INSTALLNINGAR.framfor) {
      spelaSteg(graf, steg, nastaTid);
      nastaTid += 60 / tempo / 2;
      steg++;
    }
  }

  // iPaden: ett tyst ljud som går runt gör att webbljudet hörs även när
  // iPaden står på ljudlöst (talet hörs alltid, men inte plingen och musiken)
  let tystSpelare = null;
  function tystLjudfil() {
    const n = 800, buf = new ArrayBuffer(44 + n), v = new DataView(buf);
    const skriv = (o, s) => { for (let i = 0; i < s.length; i++) v.setUint8(o + i, s.charCodeAt(i)); };
    skriv(0, "RIFF"); v.setUint32(4, 36 + n, true); skriv(8, "WAVE"); skriv(12, "fmt ");
    v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true);
    v.setUint32(24, 8000, true); v.setUint32(28, 8000, true); v.setUint16(32, 1, true); v.setUint16(34, 8, true);
    skriv(36, "data"); v.setUint32(40, n, true);
    for (let i = 0; i < n; i++) v.setUint8(44 + i, 128);
    return URL.createObjectURL(new Blob([buf], { type: "audio/wav" }));
  }
  const arIos = /iP(hone|ad|od)/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

  window.Musik = {
    lasUpp(ctx) {
      try {
        if (ctx && ctx.state !== "running") ctx.resume();
        // Nyare iPadOS: säg att det är musik, inte bara pling
        if (navigator.audioSession) navigator.audioSession.type = "playback";
        if (arIos && !tystSpelare) {
          tystSpelare = new Audio(tystLjudfil());
          tystSpelare.loop = true;
          tystSpelare.setAttribute("playsinline", "");
          const p = tystSpelare.play();
          if (p && p.catch) p.catch(() => { tystSpelare = null; });   // prova igen vid nästa tryck
        }
      } catch (e) {
        /* går inte – då hörs ljudet bara när iPaden inte står på ljudlöst */
      }
    },
    starta(ljudet) {
      if (!ljudet) return;
      if (!ljud) {
        ljud = ljudet;
        graf = byggGraf(ljud);
        setInterval(schemalagg, 100);
      }
      pausad = false;
    },
    paus(ja) {
      pausad = ja;
    },
    tempo(nytt) {
      tempo = nytt || INSTALLNINGAR.tempo;
    },
    vaxla() {
      pa = !pa;
      try { localStorage.setItem("musik", pa ? "pa" : "av"); } catch (e) { /* gäller tills sidan laddas om */ }
      return pa;
    },
    arPa() {
      return pa;
    },
    spelaIn(ctx, sekunder) {
      const g = byggGraf(ctx);
      const atton = 60 / INSTALLNINGAR.tempo / 2;
      for (let nr = 0, tid = 0.05; tid < sekunder; nr++, tid += atton) spelaSteg(g, nr, tid);
    },
  };
})();
