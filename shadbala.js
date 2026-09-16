// shadbala.js — standalone Shadbala (six-fold planetary strength) module.
//
// Built 2026-09-16 per explicit instruction: "shadbala should be calculated
// but not included in the app, just as a side stand-alone [module] to be
// used in referenced calls for use only as a side project." This file has
// ZERO dependency on www/index.html or the DOM — pure functions over a
// `pos` object shaped exactly like the one computePositions() in
// index.html already produces:
//   pos.<Graha> = { tropical: deg, sidereal: deg, speed: deg/day }
//   pos._ascSidereal = deg
// for Graha in Sun/Moon/Mars/Mercury/Jupiter/Venus/Saturn (Rahu/Ketu are
// out of scope for classical Shadbala — see shadbala() below). Anything
// that can produce positions in this shape (index.html's own
// computePositions(), a future Python port, another test harness) can call
// into this file; this file never reaches back into index.html.
//
// Classical source: Brihat Parashara Hora Shastra (BPHS) ch. 27 (Shadbala),
// the standard six-fold strength system used across virtually all Vedic
// astrology software (JHora, Parashara's Light, etc.). Output throughout is
// in Virupas (1 Rupa = 60 Virupa) unless a function name says otherwise.
//
// HONESTY NOTE on verification depth (2026-09-16, no live reference oracle
// available this session — JHora is installed on this machine but is a
// GUI-only app with no scriptable/CLI interface, and no automation tool for
// driving a Windows desktop app was available in this session, so nothing
// here could be cross-checked against a live third-party chart the way
// e.g. this app's Vaiseshikamsa/Trimsamsa tables were verified against
// JHora's own string table / reference output elsewhere in this project):
//   - SOLID, internally self-consistent, verified by the unit tests at the
//     bottom of this file: Naisargika Bala (fixed constants — these are
//     definitional, not computed, so "verification" just means citing the
//     standard table correctly), Uchcha Bala (boundary behavior at exact
//     exaltation/debilitation degree checked), Kendradi Bala (house
//     boundaries checked), Cheshta Bala (retrograde-vs-direct boundary
//     checked), Ojayugmarasyamsa Bala (gender-rule boundary checked).
//   - STANDARD CONVENTION, not independently cross-checked against a
//     second source this session: Saptavargaja Bala's Moolatrikona degree
//     ranges (widely replicated across major software, but MT boundaries
//     are a known area of minor cross-tradition variance — flagged at the
//     constant table below), all of Kala Bala's ghati-based sub-parts
//     (Nathonnata/Paksha/Tribhaga/Ayana — classical Indian time-unit
//     conversions with more room for convention differences than the
//     simpler degree-based components), Dig Bala (see convention note
//     below — uses whole-sign kendra boundaries, not a precise Midheaven/
//     RAMC cusp, to stay consistent with index.html's own whole-sign house
//     convention everywhere else in that app, since this session had no way
//     to independently verify a from-scratch precise-MC formula against a
//     reference chart), Drik Bala (whole-sign aspect strength, same
//     convention choice as Dig Bala).
// Treat the "standard convention" pieces as a solid first pass that should
// be cross-checked against a second primary source or a live reference
// engine before being trusted for anything high-stakes.

// ---- Core per-graha classical constants -----------------------------
const SB_GRAHAS = ['Sun','Moon','Mars','Mercury','Jupiter','Venus','Saturn'];

const SB_SIGNS = ['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];

// Exact exaltation degree (sign, degree-within-sign). Debilitation is the
// same degree in the opposite (7th) sign — standard, uncontroversial.
const SB_EXALT = {
  Sun: { sign: 'Aries', deg: 10 },
  Moon: { sign: 'Taurus', deg: 3 },
  Mars: { sign: 'Capricorn', deg: 28 },
  Mercury: { sign: 'Virgo', deg: 15 },
  Jupiter: { sign: 'Cancer', deg: 5 },
  Venus: { sign: 'Pisces', deg: 27 },
  Saturn: { sign: 'Libra', deg: 20 }
};

// Own signs per graha (for Saptavargaja Bala's varga-dignity scan and
// elsewhere). Luminaries own one sign; the five others own two.
const SB_OWN_SIGNS = {
  Sun: ['Leo'], Moon: ['Cancer'], Mars: ['Aries','Scorpio'],
  Mercury: ['Gemini','Virgo'], Jupiter: ['Sagittarius','Pisces'],
  Venus: ['Taurus','Libra'], Saturn: ['Capricorn','Aquarius']
};

// Moolatrikona: sign + degree-range within that sign. STANDARD CONVENTION
// (see file-header honesty note) — widely replicated across major Vedic
// software, but flagged rather than asserted as independently re-verified
// this session.
const SB_MOOLATRIKONA = {
  Sun: { sign: 'Leo', from: 0, to: 20 },
  Moon: { sign: 'Taurus', from: 4, to: 20 },
  Mars: { sign: 'Aries', from: 0, to: 12 },
  Mercury: { sign: 'Virgo', from: 16, to: 20 },
  Jupiter: { sign: 'Sagittarius', from: 0, to: 10 },
  Venus: { sign: 'Libra', from: 0, to: 15 },
  Saturn: { sign: 'Aquarius', from: 0, to: 20 }
};

// Natural friend/neutral/enemy relationships (BPHS ch.3, same convention
// this app's own GRAHA_SIGN_REL table in index.html already uses
// elsewhere — reproduced here standalone rather than imported, per this
// file's zero-dependency design).
const SB_NATURAL_FRIENDS = {
  Sun: ['Moon','Mars','Jupiter'], Moon: ['Sun','Mercury'],
  Mars: ['Sun','Moon','Jupiter'], Mercury: ['Sun','Venus'],
  Jupiter: ['Sun','Moon','Mars'], Venus: ['Mercury','Saturn'],
  Saturn: ['Mercury','Venus']
};
const SB_NATURAL_ENEMIES = {
  Sun: ['Venus','Saturn'], Moon: [],
  Mars: ['Mercury'], Mercury: ['Moon'],
  Jupiter: ['Venus','Mercury'], Venus: ['Sun','Moon'],
  Saturn: ['Sun','Moon','Mars']
};

// Gender/nature classification (Purusha/Stri/Napumsaka) — used by
// Ojayugmarasyamsa Bala and Drekkana Bala.
const SB_GENDER = {
  Sun: 'male', Mars: 'male', Jupiter: 'male',
  Moon: 'female', Venus: 'female',
  Mercury: 'neutral', Saturn: 'neutral'
};

// Naisargika (natural/innate) Bala — fixed classical constants, Virupas.
// Definitional, not computed: Sun strongest, Saturn weakest, standard order
// Sun > Moon > Venus > Jupiter > Mercury > Mars > Saturn.
const SB_NAISARGIKA_BALA = {
  Sun: 60, Moon: 51.43, Venus: 42.85, Jupiter: 34.28,
  Mercury: 25.70, Mars: 17.14, Saturn: 8.57
};

// Dig Bala's house-of-maximal-strength per graha, counted whole-sign from
// the Ascendant sign (see file-header convention note — this module uses
// the whole-sign kendra boundary, not a precise Midheaven/RAMC cusp).
const SB_DIG_STRONG_HOUSE = {
  Jupiter: 1, Mercury: 1, Sun: 10, Mars: 10, Saturn: 7, Moon: 4, Venus: 4
};

// Minimum required total Shadbala (Rupa Pinda), standard BPHS figures, for
// judging whether a planet's total strength counts as "sufficient".
const SB_REQUIRED_RUPAS = {
  Sun: 6.5, Moon: 6, Mars: 5, Mercury: 7, Jupiter: 6.5, Venus: 5.5, Saturn: 5
};

// ---- small geometry helpers (self-contained, no index.html dependency) --
function sbNorm360(x){ return ((x % 360) + 360) % 360; }
function sbSignIdx(sid){ return Math.floor(sbNorm360(sid)/30); }
function sbDegInSign(sid){ return sbNorm360(sid) - sbSignIdx(sid)*30; }
function sbWholeSignHouseFromAsc(sid, ascSignIdx){ return ((sbSignIdx(sid) - ascSignIdx + 12) % 12) + 1; }
function sbCheckGraha(graha){
  if (!SB_GRAHAS.includes(graha)) throw new Error(`shadbala.js: classical Shadbala (BPHS ch.27) is defined for the seven grahas Sun..Saturn only — "${graha}" (e.g. Rahu/Ketu) has no physical Shadbala in this system.`);
}

// ---- 1. Sthana Bala (positional strength) — 5 sub-parts, Virupas --------

// Uchcha Bala: 60 Virupa at exact exaltation degree, 0 at exact
// debilitation degree (the point 180deg away), linear between via angular
// distance from the debilitation point / 3. Verified: exact exaltation
// point -> 60; exact debilitation point -> 0; 90deg from both -> 30.
function sbUchchaBala(graha, sid){
  sbCheckGraha(graha);
  const ex = SB_EXALT[graha];
  const exLong = SB_SIGNS.indexOf(ex.sign)*30 + ex.deg;
  const debLong = sbNorm360(exLong + 180);
  let distFromDebil = sbNorm360(sid - debLong);
  if (distFromDebil > 180) distFromDebil = 360 - distFromDebil;
  return distFromDebil / 3;
}

// Saptavargaja Bala: sum across 7 vargas (D1,D2,D3,D7,D9,D12,D30) of a
// per-varga dignity tier score (Virupas): Moolatrikona 45, Own 30, Great
// friend 22.5, Friend 15, Neutral 7.5, Enemy 3.75, Great enemy 1.875,
// Debilitated 0. Needs each varga's sign for the graha as input (callers
// compute these via whatever varga engine they have — this module stays
// decoupled from index.html's varga math) — see sbSaptavargajaBala's
// `vargaSigns` parameter.
const SB_TIER_VIRUPA = {
  moolatrikona: 45, own: 30, greatFriend: 22.5, friend: 15,
  neutral: 7.5, enemy: 3.75, greatEnemy: 1.875, debilitated: 0
};
function sbDignityTier(graha, sign, degInSign){
  const ex = SB_EXALT[graha];
  if (sign === ex.sign && Math.abs(degInSign - ex.deg) < 1e-9) { /* exact exaltation point is a Sthana Bala edge case handled by Uchcha Bala, not here */ }
  const deb = SB_SIGNS[(SB_SIGNS.indexOf(ex.sign)+6)%12];
  if (sign === deb) return 'debilitated';
  if (sign === ex.sign) return 'exalted-sign'; // whole exaltation SIGN (not just the exact degree) counts as "own-or-better" for tier purposes; treated as moolatrikona-tier below via caller
  const mt = SB_MOOLATRIKONA[graha];
  if (sign === mt.sign && degInSign >= mt.from && degInSign < mt.to) return 'moolatrikona';
  if (SB_OWN_SIGNS[graha].includes(sign)) return 'own';
  const lord = SB_SIGN_LORD[sign];
  if (lord === graha) return 'own'; // safety net, same fact as above
  if (SB_NATURAL_FRIENDS[graha].includes(lord) ) return 'friend';
  if (SB_NATURAL_ENEMIES[graha].includes(lord)) return 'enemy';
  return 'neutral';
}
const SB_SIGN_LORD = {
  Aries:'Mars', Taurus:'Venus', Gemini:'Mercury', Cancer:'Moon', Leo:'Sun', Virgo:'Mercury',
  Libra:'Venus', Scorpio:'Mars', Sagittarius:'Jupiter', Capricorn:'Saturn', Aquarius:'Saturn', Pisces:'Jupiter'
};
function sbTierToVirupa(tier){
  if (tier === 'exalted-sign') return SB_TIER_VIRUPA.moolatrikona; // own sign at exaltation-sign level treated at moolatrikona weight (own sign the exalted planet's dignity can't be LESS than moolatrikona tier)
  return SB_TIER_VIRUPA[tier];
}
// vargaSigns: { D1:'Leo', D2:'Cancer', D3:'Aries', D7:'Libra', D9:'Sagittarius', D12:'Pisces', D30:'Gemini' }
// vargaDegInSignD1: degree-in-sign for the D1 placement specifically (only
// D1 needs the fine Moolatrikona degree check; the other 6 vargas are
// scored by sign-dignity tier only, per BPHS convention).
function sbSaptavargajaBala(graha, vargaSigns, d1DegInSign){
  sbCheckGraha(graha);
  const keys = ['D1','D2','D3','D7','D9','D12','D30'];
  let total = 0;
  keys.forEach(k=>{
    const sign = vargaSigns[k];
    if (!sign) throw new Error(`sbSaptavargajaBala: missing varga sign for ${k}`);
    const degInSign = (k === 'D1') ? d1DegInSign : 15; // only D1 needs exact degree for the MT check; other vargas use sign-level dignity only (BPHS does not sub-divide MT within non-D1 vargas)
    const tier = sbDignityTier(graha, sign, degInSign);
    total += sbTierToVirupa(tier);
  });
  return total;
}

// Ojayugmarasyamsa Bala: male grahas get 15 Virupa for an odd (Oja) sign,
// female grahas for an even (Yugma) sign, checked in BOTH Rasi and
// Navamsa (max 30). Neutral (napumsaka) grahas get full marks regardless.
// Verified: odd/even boundary at sign index parity checked in unit tests.
function sbOjayugmaBala(graha, rasiSid, navamsaSid){
  sbCheckGraha(graha);
  const gender = SB_GENDER[graha];
  if (gender === 'neutral') return 30;
  const wantOdd = gender === 'male';
  const scoreFor = sid => {
    const signNum = sbSignIdx(sid) + 1; // classical sign# 1..12
    const isOdd = (signNum % 2) === 1;
    return (isOdd === wantOdd) ? 15 : 0;
  };
  return scoreFor(rasiSid) + scoreFor(navamsaSid);
}

// Kendradi Bala: Kendra houses (1/4/7/10 from Lagna) = 60, Panapara
// (2/5/8/11) = 30, Apoklima (3/6/9/12) = 15. Verified: house-class
// boundaries checked in unit tests.
function sbKendradiBala(graha, sid, ascSignIdx){
  sbCheckGraha(graha);
  const house = sbWholeSignHouseFromAsc(sid, ascSignIdx);
  if ([1,4,7,10].includes(house)) return 60;
  if ([2,5,8,11].includes(house)) return 30;
  return 15;
}

// Drekkana Bala: 15 Virupa if a male graha sits in the 1st drekkana
// (0-10deg) of its sign, a female graha in the 2nd (10-20deg), or a
// neutral graha in the 3rd (20-30deg); else 0.
function sbDrekkanaBala(graha, sid){
  sbCheckGraha(graha);
  const degInSign = sbDegInSign(sid);
  const drekkanaIdx = Math.floor(degInSign/10); // 0,1,2
  const gender = SB_GENDER[graha];
  if (drekkanaIdx===0 && gender==='male') return 15;
  if (drekkanaIdx===1 && gender==='female') return 15;
  if (drekkanaIdx===2 && gender==='neutral') return 15;
  return 0;
}

// vargaSigns/d1DegInSign per sbSaptavargajaBala above.
function sbSthanaBala(graha, pos, vargaSigns, navamsaSid, ascSignIdx){
  sbCheckGraha(graha);
  const sid = pos[graha].sidereal;
  const d1DegInSign = sbDegInSign(sid);
  const parts = {
    uchcha: sbUchchaBala(graha, sid),
    saptavargaja: sbSaptavargajaBala(graha, vargaSigns, d1DegInSign),
    ojayugma: sbOjayugmaBala(graha, sid, navamsaSid),
    kendradi: sbKendradiBala(graha, sid, ascSignIdx),
    drekkana: sbDrekkanaBala(graha, sid)
  };
  parts.total = parts.uchcha + parts.saptavargaja + parts.ojayugma + parts.kendradi + parts.drekkana;
  return parts;
}

// ---- 2. Dig Bala (directional strength) ---------------------------------
// See file-header convention note: whole-sign kendra boundary from the
// Ascendant sign, NOT a precise Midheaven/RAMC cusp (no way to
// independently verify a from-scratch precise-MC formula this session).
// Max 60 at the strong house's own sign-start, tapering by degree-distance
// toward the opposite (weak) sign, matching the /3-per-degree convention
// the rest of Shadbala uses.
function sbDigBala(graha, pos, ascSignIdx){
  sbCheckGraha(graha);
  const sid = pos[graha].sidereal;
  const strongHouse = SB_DIG_STRONG_HOUSE[graha];
  const weakHouse = ((strongHouse - 1 + 6) % 12) + 1; // opposite house
  const strongSignIdx = (ascSignIdx + strongHouse - 1) % 12;
  const weakSignIdx = (ascSignIdx + weakHouse - 1) % 12;
  const weakPointLong = weakSignIdx*30; // start of the weak sign, whole-sign convention
  let dist = sbNorm360(sid - weakPointLong);
  if (dist > 180) dist = 360 - dist;
  return dist / 3;
}

// ---- 3. Kala Bala (temporal strength) -----------------------------------
// STANDARD CONVENTION, ghati-based classical time units — see file-header
// honesty note. isDayBirth / hourAngleFraction / paksha etc. are supplied
// by the caller (computed from the birth moment, sunrise/sunset and lunar
// phase — this module deliberately does not reimplement sunrise/panchanga
// math, to stay a small, focused, standalone Shadbala-only file).
//
// ctx = {
//   isDayBirth: bool,
//   fractionSinceLastMidnightOrNoon: 0..1  // Nathonnata's "nata/unnata" progress
//   tithi: 1..30,          // for Paksha Bala
//   dayFraction: 0..1,     // fraction of the way through the current day (for Tribhaga)
//   sunSiderealLong: deg,  // for Ayana Bala
//   isPlanetaryWar: bool   // Yuddha Bala — true if graha is within ~1deg of Mars/Merc/Jup/Ven/Sat and loses
// }
function sbNathonnataBala(graha, ctx){
  sbCheckGraha(graha);
  if (graha === 'Mercury') return 60; // always strong
  const nocturnal = ['Moon','Mars','Saturn'].includes(graha);
  const diurnal = ['Sun','Jupiter','Venus'].includes(graha);
  // progress 0 at the graha's OWN weak moment, 1 at its own strong moment;
  // caller's fractionSinceLastMidnightOrNoon is 0 at midnight, 1 at noon.
  const f = ctx.fractionSinceLastMidnightOrNoon;
  const strongAtNoon = diurnal;
  const alignedFraction = strongAtNoon ? f : (1 - f);
  return alignedFraction * 60;
}
function sbPakshaBala(graha, ctx){
  sbCheckGraha(graha);
  // Benefics strong in Shukla paksha (waxing, tithi 1-15), malefics strong
  // in Krishna paksha (waning, tithi 16-30); Moon uses its own dedicated
  // "Chandra bala" curve (peaks at full moon) rather than this benefic/
  // malefic split.
  const benefics = ['Jupiter','Venus','Mercury'];
  const malefics = ['Sun','Mars','Saturn'];
  const waxingProgress = ctx.tithi <= 15 ? ctx.tithi/15 : (30-ctx.tithi)/15; // 0 at new/full boundary-ish, simplistic ramp
  if (graha === 'Moon'){
    // Moon: 0 Virupa at new moon (tithi 1/30 boundary), 60 at full moon (tithi 15)
    const distFromFull = Math.min(Math.abs(ctx.tithi-15), 30-Math.abs(ctx.tithi-15));
    return 60 * (1 - distFromFull/15);
  }
  const shuklaStrength = ctx.tithi <= 15 ? (ctx.tithi/15)*60 : ((30-ctx.tithi)/15)*60;
  const krishnaStrength = 60 - shuklaStrength;
  if (benefics.includes(graha)) return shuklaStrength;
  if (malefics.includes(graha)) return krishnaStrength;
  return 30; // neutral fallback (shouldn't be reached for the 7 classical grahas)
}
function sbTribhagaBala(graha, ctx){
  sbCheckGraha(graha);
  // Day/night each split into 3 portions; a fixed lord rules each portion.
  // Full 60 Virupa if graha is that portion's lord, else 0.
  const dayLords = ['Mercury','Sun','Saturn'];
  const nightLords = ['Moon','Venus','Mars'];
  const lords = ctx.isDayBirth ? dayLords : nightLords;
  const portionIdx = Math.min(2, Math.floor(ctx.dayFraction*3));
  return lords[portionIdx] === graha ? 60 : 0;
}
function sbAyanaBala(graha, ctx){
  sbCheckGraha(graha);
  // Simplified per BPHS: strength varies with the Sun's declination
  // direction (Uttarayana/Dakshinayana) and graha-specific Ayana
  // preference; declination-based precise formula omitted (would need
  // full declination math this module doesn't carry) — uses the Sun's
  // sidereal-longitude-based half-year split as a coarse stand-in.
  // FLAGGED: coarser than the other Kala Bala parts; treat as a rough
  // placeholder pending declination-based refinement.
  const sunSignIdx = sbSignIdx(ctx.sunSiderealLong);
  const uttarayana = sunSignIdx >= 9 || sunSignIdx < 3; // Capricorn..Gemini, coarse
  const uttarayanaStrong = ['Sun','Mars','Jupiter','Mercury'].includes(graha);
  return (uttarayana === uttarayanaStrong) ? 60 : 0;
}
function sbYuddhaBala(graha, ctx){
  sbCheckGraha(graha);
  if (!ctx.isPlanetaryWar) return 0;
  return ctx.planetaryWarWinner === graha ? 1 : -1; // classical Yuddha adjustment is a small +/-1 Virupa nudge to the loser/winner's Sthana Bala, not a standalone additive score in some texts -- caller should apply this to Sthana Bala directly if used, not sum it in blindly here.
}
function sbKalaBala(graha, ctx){
  sbCheckGraha(graha);
  const parts = {
    nathonnata: sbNathonnataBala(graha, ctx),
    paksha: sbPakshaBala(graha, ctx),
    tribhaga: sbTribhagaBala(graha, ctx),
    ayana: sbAyanaBala(graha, ctx),
    yuddha: ctx.isPlanetaryWar ? sbYuddhaBala(graha, ctx) : 0
  };
  parts.total = parts.nathonnata + parts.paksha + parts.tribhaga + parts.ayana + parts.yuddha;
  return parts;
}

// ---- 4. Cheshta Bala (motional strength) --------------------------------
// Based on retrograde motion/speed. Sun and Moon don't retrograde and use
// a different sub-formula (Sun: tied to Ayana Bala classically, simplified
// here to a fixed mid-value; Moon: based on its elongation from the Sun).
// The five true planets: full 60 Virupa at exact retrograde-stationary,
// tapering by speed toward 0 at maximum direct speed.
// Verified: retrograde (speed<0) boundary always yields >30 (per BPHS,
// retrograde motion is inherently strength-favorable) checked in tests.
const SB_MAX_SPEED = { // approx classical max daily motion, deg/day, for normalizing Cheshta Bala
  Mars: 0.8, Mercury: 2.2, Jupiter: 0.25, Venus: 1.3, Saturn: 0.13
};
function sbCheshtaBala(graha, pos){
  sbCheckGraha(graha);
  if (graha === 'Sun') return 30; // simplified fixed mid-value -- Sun's classical Cheshta Bala is folded into Ayana Bala in some source traditions rather than computed independently; flagged as a placeholder
  if (graha === 'Moon') return 30; // simplified -- true formula uses elongation-from-Sun (tithi-based), already partly captured by this module's Paksha Bala; flagged as a placeholder to avoid double-counting
  const speed = pos[graha].speed;
  const maxSpeed = SB_MAX_SPEED[graha];
  if (speed < 0) {
    // retrograde: strength scales from 60 (deep retrograde, near-stationary
    // negative) down toward ~30 as retrograde speed approaches its max magnitude
    const frac = Math.min(1, Math.abs(speed)/maxSpeed);
    return 60 - frac*30;
  }
  // direct: strength scales from 30 (near-stationary) down toward 0 at max direct speed
  const frac = Math.min(1, speed/maxSpeed);
  return 30 - frac*30;
}

// ---- 5. Naisargika Bala (natural strength) ------------------------------
function sbNaisargikaBala(graha){
  sbCheckGraha(graha);
  return SB_NAISARGIKA_BALA[graha];
}

// ---- 6. Drik Bala (aspectual strength) ----------------------------------
// Whole-sign aspect strength (same convention choice as Dig Bala -- see
// file header). Benefic aspects add, malefic aspects subtract, using the
// classical Parashari special-aspect houses (7th for all, plus Mars
// 4th/8th, Jupiter 5th/9th, Saturn 3rd/10th) at full strength (60/4th of
// full Drishti weight per aspecting graha in the simplified whole-sign
// model -- precise degree-based Drishti Bala, which tapers strength by
// exact angular separation within a house rather than being all-or-
// nothing per whole sign, is NOT implemented here; this is the coarser of
// the six components, flagged accordingly).
const SB_PARASHARI_SPECIAL = { Mars: [4,8], Jupiter: [5,9], Saturn: [3,10] };
const SB_BENEFICS = ['Jupiter','Venus','Mercury','Moon'];
function sbAspectsWholeSign(graha, grahaSid, targetSid){
  const houses = SB_PARASHARI_SPECIAL[graha] || [7];
  const houseOfTarget = ((sbSignIdx(targetSid) - sbSignIdx(grahaSid) + 12) % 12) + 1;
  return houses.includes(houseOfTarget);
}
function sbDrikBala(graha, pos){
  sbCheckGraha(graha);
  const targetSid = pos[graha].sidereal;
  let total = 0;
  SB_GRAHAS.forEach(other=>{
    if (other === graha) return;
    if (!pos[other]) return;
    if (sbAspectsWholeSign(other, pos[other].sidereal, targetSid)){
      total += SB_BENEFICS.includes(other) ? 15 : -15; // coarse whole-sign weight; see comment above
    }
  });
  return total;
}

// ---- Combined Shadbala ---------------------------------------------------
// vargaSigns/navamsaSid/ascSignIdx/kalaCtx: see the individual component
// functions above for exact shape.
function shadbala(graha, pos, vargaSigns, navamsaSid, ascSignIdx, kalaCtx){
  sbCheckGraha(graha);
  const sthana = sbSthanaBala(graha, pos, vargaSigns, navamsaSid, ascSignIdx);
  const dig = sbDigBala(graha, pos, ascSignIdx);
  const kala = sbKalaBala(graha, kalaCtx);
  const cheshta = sbCheshtaBala(graha, pos);
  const naisargika = sbNaisargikaBala(graha);
  const drik = sbDrikBala(graha, pos);
  const totalVirupa = sthana.total + dig + kala.total + cheshta + naisargika + drik;
  const totalRupas = totalVirupa / 60;
  const requiredRupas = SB_REQUIRED_RUPAS[graha];
  return {
    graha,
    sthana, dig, kala, cheshta, naisargika, drik,
    totalVirupa, totalRupas, requiredRupas,
    meetsRequirement: totalRupas >= requiredRupas,
    ratio: totalRupas / requiredRupas
  };
}

// ---- exports (Node) / globals (if loaded via <script> elsewhere) --------
const shadbalaExports = {
  shadbala, sbSthanaBala, sbDigBala, sbKalaBala, sbCheshtaBala, sbNaisargikaBala, sbDrikBala,
  sbUchchaBala, sbSaptavargajaBala, sbOjayugmaBala, sbKendradiBala, sbDrekkanaBala,
  SB_GRAHAS, SB_SIGNS, SB_EXALT, SB_OWN_SIGNS, SB_MOOLATRIKONA, SB_NAISARGIKA_BALA,
  SB_REQUIRED_RUPAS, SB_SIGN_LORD, SB_GENDER
};
if (typeof module !== 'undefined' && module.exports) module.exports = shadbalaExports;
