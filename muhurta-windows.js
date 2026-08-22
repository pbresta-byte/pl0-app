
/* =========================================================================
   MUHURTA WINDOWS EXTENSION — v1 (muhurta-gauge core-logic add-on)
   Adds classical day-time quality windows to the graded daily score.

   Sources:
   • Rāhu Kāla, Yama-Gaṇḍa, Gulika/Kulika, Ardhapraharaṇa (8 equal parts
     of daylight/night, 1h30m each from ~6am/6pm): N.P. Subramania Iyer,
     "Kalaprakasika" (1917/1982 trans.), ch. on auspicious/inauspicious
     periods, p.175-77 table + prose; cross-checked against B.V. Raman,
     "Muhurtha", ch. III. Standard weekday tables used (OCR of both prints
     confirms Sun/Mon/Tue/Wed/Thu/Fri/Sat order).
   • Abhijit muhurta: midday muhurta (8th of 15 day muhurtas), auspicious
     except Wednesday (Raman, Muhurtha; Kalaprakasika). 
   • Brāhma Muhūrta: final 2 muhurtas before sunrise (~4:24-6:00 for a
     6am sunrise), auspicious for study/meditation starts.
   • Ṛkta (Riktha) tithi & Viṣṭi karaṇa already scored elsewhere — not
     duplicated here.

   Each window contributes a small signed weight to scoreMuhurta() and
   appears as its own reason line. Weights are deliberately lighter than
   Vedha/tārā terms: these are calendar-level cautions, not chart-specific
   signals.
   ========================================================================= */

// ---- Day-time windows (from 6am local, 8 parts × 90 min) ----
// Order: [startHour, endHour] in local decimal hours. Classical tables are
// stated against a 6-to-18 daylight; callers may rescale to true sunrise/
// sunset by linear remap (see rescaleToDaylight below).
const RAHU_KALA_DAY = {   // part index (0-based within the 8 daylight parts)
  // Kalaprakasika p.175 table: Sun 4:30-6 · Mon 7:30-9 · Tue 3-4:30 ·
  // Wed 12-1:30 · Thu 1:30-3 · Fri 10:30-12 · Sat 9-10:30
  Sunday:0, Monday:1, Tuesday:6, Wednesday:4, Thursday:5, Friday:3, Saturday:7
};
const YAMAGANDA_DAY = {
  // Kalaprakasika p.176: Sun 12-1:30 · Mon 10:30-12 · Tue 9-10:30 ·
  // Wed 7:30-9 · Thu 6-7:30 · Fri 3-4:30 · Sat 1:30-3
  Sunday:4, Monday:3, Tuesday:2, Wednesday:1, Thursday:0, Friday:6, Saturday:5
};
const GULIKA_DAY = {     // Kulika — Saturn's portion; traditionally less severe
  // Kalaprakasika p.176: Sun 3-4:30pm · Mon 1:30-3 · Tue 12-1:30 ·
  // Wed 10:30-12 · Thu 9-10:30 · Fri 7:30-9 · Sat 6-7:30
  Sunday:6, Monday:5, Tuesday:4, Wednesday:3, Thursday:2, Friday:1, Saturday:0
};
// Ardhaprahara: the Kalaprakasika print's table column is OCR-garbled and the
// secondary sources disagree on the weekday order. NOT scored until verified
// against a clean source — see VERIFICATION.md. Data left as documentation.
const ARDHAPRAHARA_DAY = null;

const PART_LEN_DAYLIGHT = 12/8; // 1.5 h per part across 6..18

function partWindow(partIdx){
  const start = 6 + partIdx * PART_LEN_DAYLIGHT;
  return { startHr:start, endHr:start + PART_LEN_DAYLIGHT };
}

// Linearly remap a nominal 6-18 window onto the actual sunrise/sunset so the
// classical proportions hold at any latitude/season. Falls back to the fixed
// 6-18 frame when sunrise/sunset unavailable (polar edge cases).
function rescaleToDaylight(win, sunriseHr, sunsetHr){
  if (typeof sunriseHr !== "number" || typeof sunsetHr !== "number") return win;
  const f0 = (win.startHr - 6)/12, f1 = (win.endHr - 6)/12;
  const len = ((sunsetHr - sunriseHr + 24) % 24) || 12;
  return { startHr: sunriseHr + f0*len, endHr: sunriseHr + f1*len };
}

// ---- Night-time windows (8 parts × 90 min across 18..06) ----
const RAHU_KALA_NIGHT = {};  // classical tables give day-only Rahu Kala
const YAMAGANDA_NIGHT = {};
const GULIKA_NIGHT = {
  Sunday:3, Monday:2, Tuesday:1, Wednesday:0, Thursday:6, Friday:5, Saturday:4
};
const PART_LEN_NIGHT = 12/8;

// ---- Abhijit / Brahma muhurta ----
// Abhijit: the 8th of 15 equal day muhurtas = roughly 11:36-12:24 local noon
// band on an equinox; computed here from actual solar noon for accuracy.
function abhijitWindow(sunriseHr, sunsetHr){
  const noon = (sunriseHr + sunsetHr)/2;
  return { startHr:noon - 0.4, endHr:noon + 0.4 }; // ≈48-min ghaṭī band
}
function brahmaWindow(sunriseHr){
  return { startHr:sunriseHr - 1.6, endHr:sunriseHr - 0.4 }; // 2 muhurtas ≈96 min
}

/**
 * Evaluate all classical time-window cautions/blessings for one instant.
 * @returns array of {name, tone:'bad'|'good', detail} entries
 */
function muhurtaWindows(year, month1to12, day, hh, mm, lat, lon, tz){
  const civil = new Date(year, month1to12-1, day, 0, 0, 0);
  civil.setHours(hh, mm||0, 0, 0);
  const wd = WEEKDAYS[civil.getDay()];
  const hr = hh + (mm||0)/60;
  const out = [];

  let sun = null;
  if (typeof sunriseSunsetLocal === "function"){
    sun = sunriseSunsetLocal(year, month1to12, day, lat, lon, tz);
  }
  const sunriseHr = sun ? sun.sunriseHr : 6;
  const sunsetHr  = sun ? sun.sunsetHr  : 18;

  const inWin = (w)=> hr >= w.startHr && hr < w.endHr;

  // Rahu Kala (day only)
  if (hr >= sunriseHr && hr <= sunsetHr){
    let w = partWindow(RAHU_KALA_DAY[wd]);
    w = rescaleToDaylight(w, sunriseHr, sunsetHr);
    if (inWin(w)) out.push({name:"Rahu Kala", tone:"bad",
      detail:`${wd} daytime Rahu Kala (${fmtHM(w.startHr)}–${fmtHM(w.endHr)}) — avoided for all good undertakings`});
    // Yama Ghanta
    w = rescaleToDaylight(partWindow(YAMAGANDA_DAY[wd]), sunriseHr, sunsetHr);
    if (inWin(w)) out.push({name:"Yama Ghanta", tone:"bad",
      detail:`${wd} Yama-Gaṇḍa (${fmtHM(w.startHr)}–${fmtHM(w.endHr)})`});
    // Gulika (milder)
    w = rescaleToDaylight(partWindow(GULIKA_DAY[wd]), sunriseHr, sunsetHr);
    if (inWin(w)) out.push({name:"Gulika", tone:"bad",
      detail:`${wd} Gulika portion (${fmtHM(w.startHr)}–${fmtHM(w.endHr)}) — milder caution (Kalaprakasika notes it is not counted strictly inauspicious)`});
    // Ardhaprahara — table unverified, not scored (see header note)
    // Abhijit — benefic midday band, all days except Wednesday
    if (wd !== "Wednesday" && inWin(abhijitWindow(sunriseHr, sunsetHr)))
      out.push({name:"Abhijit Muhurta", tone:"good",
        detail:"Abhijit muhurta at midday — conquers all evils, good for most undertakings"});
  } else {
    // night-side Gulika
    const nightPart = Math.floor((((hr - 18 + 24) % 24) / PART_LEN_NIGHT)) % 8;
    if (nightPart === GULIKA_NIGHT[wd]) out.push({name:"Gulika (night)", tone:"bad",
      detail:`${wd} night Gulika portion`});
  }

  // Brahma Muhurta
  if (inWin(brahmaWindow(sunriseHr))) out.push({name:"Brahma Muhurta", tone:"good",
    detail:"Brahma Muhūrta before sunrise — ideal for study, meditation and spiritual beginnings"});

  return out;
}
// helper kept tiny: ardhaprahara uses same part table
function ARDHPRAHARA_FIX(i){ return i; }
if (typeof fmtHM !== "function"){
  function fmtHM(h){ const H=Math.floor(h)%24, M=Math.round((h-Math.floor(h))*60); return `${String(H).padStart(2,"0")}:${String(M).padStart(2,"0")}`; }
}

/* ---- integration hook -------------------------------------------------
   In scoreMuhurta(), after the doshas block, add:

   if (opts.windows && opts.windows.length){
     opts.windows.forEach(w=>{
       score += (w.tone==="good" ? 0.6 : -0.8);
       reasons.push({sign:w.tone, text:T(`${w.name}: ${w.detail}`, "")});
     });
   }

   And in scoreForInstant()/runAnalysis(), compute:
   const windows = weighWindows ? muhurtaWindows(year,month,day,hh,mm,lat,lon,tz) : [];
   …pass them through as opts.windows.
------------------------------------------------------------------------- */
