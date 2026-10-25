// =====================================================================
//  BAKGRUNDSMUSIK – en liten visa med gitarr, bas och dragspel
//
//  Musiken spelas med Web Audio, alltså utan ljudfiler. Den går runt i
//  åtta takter (C, Am, F, G, C, Am, G, C) och börjar om.
//
//  Så här använder ett spel musiken (efter ett tryck, annars är iPaden tyst):
//    Musik.starta(ljud)   ljud = spelets AudioContext
//    Musik.paus(true)     tyst under pausen, Musik.paus(false) igen
//    Musik.tempo(118)     snabbare när det händer något (100 är vanligt)
//    Musik.vaxla()        på/av (sparas på enheten)
// =====================================================================

(function () {
  const INSTALLNINGAR = {
    volym: 0.5,       // hela musiken (talet ska höras över den)
    tempo: 100,       // slag per minut
    framfor: 0.3,     // så många sekunder i förväg tonerna läggs in
  };

  // Ackorden som tonnummer (60 = mellan-C): grundton, ters, kvint
  const C = [48, 52, 55], AM = [45, 48, 52], F = [41, 45, 48], G = [43, 47, 50];
  const TAKTER = [C, AM, F, G, C, AM, G, C];

  // Melodin (dragspelet): [åttondel i takten, ton, längd i åttondelar]
  const MELODI = [
    [[0, 64, 2], [2, 67, 2], [4, 72, 2], [6, 67, 2]],
    [[0, 69, 2], [2, 72, 2], [4, 76, 3], [7, 74, 1]],
    [[0, 72, 4], [4, 69, 4]],
    [[0, 71, 2], [2, 74, 2], [4, 67, 4]],
    [[0, 76, 2], [2, 74, 2], [4, 72, 2], [6, 67, 2]],
    [[0, 69, 2], [2, 71, 2], [4, 72, 2], [6, 64, 2]],
    [[0, 74, 2], [2, 71, 2], [4, 67, 2], [6, 71, 2]],
    [[0, 72, 6]],
  ];
  // Gitarren plockar ackordets toner i den här ordningen
  const PLOCK = [0, 1, 2, 1, 0, 1, 2, 1];

  let ljud = null, utgang = null, klocka = null;
  let nastaTid = 0, steg = 0, tempo = INSTALLNINGAR.tempo, pausad = false;
  let pa = true;
  try { pa = localStorage.getItem("musik") !== "av"; } catch (e) { /* då är musiken på */ }

  function hz(ton) {
    return 440 * Math.pow(2, (ton - 69) / 12);
  }

  // En ton: typ av ljud, när, hur länge, hur starkt
  function ton(typ, nummer, start, langd, volym, mjuk) {
    const osc = ljud.createOscillator(), styrka = ljud.createGain();
    osc.type = typ;
    osc.frequency.value = hz(nummer);
    styrka.gain.setValueAtTime(0.0001, start);
    styrka.gain.exponentialRampToValueAtTime(volym, start + (mjuk ? 0.05 : 0.005));
    if (mjuk) styrka.gain.setValueAtTime(volym, start + langd - 0.08);
    styrka.gain.exponentialRampToValueAtTime(0.0001, start + langd);
    if (mjuk) {
      // Dragspelet: lite mjukare med ett filter
      const filter = ljud.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 1500;
      osc.connect(filter).connect(styrka);
    } else {
      osc.connect(styrka);
    }
    styrka.connect(utgang);
    osc.start(start);
    osc.stop(start + langd + 0.05);
  }

  function spelaSteg(nr, tid) {
    const atton = 60 / tempo / 2;
    const takt = Math.floor(nr / 8) % TAKTER.length, iTakt = nr % 8;
    const ackord = TAKTER[takt];
    // Gitarr (plockad) och bas på första och tredje slaget
    ton("triangle", ackord[PLOCK[iTakt]] + 12, tid, atton * 3, 0.06, false);
    if (iTakt === 0 || iTakt === 4) ton("sine", ackord[0] - 12, tid, atton * 3.5, 0.12, false);
    // Dragspel: två toner som är nästan lika, då låter det som ett dragspel
    MELODI[takt].forEach(([start, nummer, langd]) => {
      if (start !== iTakt) return;
      ton("sawtooth", nummer, tid, atton * langd, 0.025, true);
      ton("sawtooth", nummer + 0.08, tid, atton * langd, 0.025, true);
    });
  }

  function schemalagg() {
    if (!ljud || !pa || pausad) return;
    if (nastaTid < ljud.currentTime) nastaTid = ljud.currentTime + 0.05;
    while (nastaTid < ljud.currentTime + INSTALLNINGAR.framfor) {
      spelaSteg(steg, nastaTid);
      nastaTid += 60 / tempo / 2;
      steg++;
    }
  }

  window.Musik = {
    starta(ljudet) {
      if (!ljudet) return;
      if (!ljud) {
        ljud = ljudet;
        utgang = ljud.createGain();
        utgang.gain.value = INSTALLNINGAR.volym;
        utgang.connect(ljud.destination);
        klocka = setInterval(schemalagg, 100);
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
  };
})();
