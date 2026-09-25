/* Browser build of the Dashakoota engine (logic unchanged from the standalone
 * dashakoota_engine.js drafted 2026-09-09). Exposes window.Dashakoota; also
 * loadable in Node (module.exports) for tests. Engine notes are developer-facing
 * (they quote the source); the app renders its own neutral, bilingual text. */
(function (root) {
'use strict';
/* PL0 Dashakoota (Kalaprakashika 10-koota) compatibility engine — separate from,
   and NOT a replacement for, compat_engine.js's 8-koota Ashtakoota engine. These
   are two distinct classical matching systems (see internal-os note
   knowledge/raw/jyotish/dasha-koota-10-system-screenshot-2026-09-08.md for how
   they were confirmed distinct). This file implements ONLY the rules that could
   be sourced from the actual text: Jyotish_1982_Kalaprakasika.txt (lines
   4090-4509) in the user's jyotish-corpus. Where that source is ambiguous
   (OCR damage) or silent (no numeric point-weight table — only a qualitative
   pass/fail rule per koota), this file says so in comments rather than
   inventing numbers. The classical text's own scoring rule is used as-is:
   "the horoscopes must agree in respect of at least five" of the ten.

   Usage: const dk = require('./dashakoota_engine');
          const ek = require('./compat_engine');
          const posA = ek.computePositionsFull(...); const posB = ek.computePositionsFull(...);
          const result = dk.computeDasakoota(ek, posA, posB);
*/

// --- Reused tables (same underlying classification as compat_engine.js; not
// Dashakoota-specific, so not re-verified here — see that file's own sourcing) ---
// Gana and Yoni assignments are pulled from the required compat_engine at call time.

function nakDist(NAK27, brideStar, groomStar){
  const bIdx = NAK27.findIndex(s=>s.n===brideStar), gIdx = NAK27.findIndex(s=>s.n===groomStar);
  return ((gIdx - bIdx + 27) % 27) + 1; // 1..27, inclusive count bride->groom
}
function signForward(SIGNS, fromSign, toSign){
  return ((SIGNS.indexOf(toSign) - SIGNS.indexOf(fromSign) + 12) % 12) + 1; // 1..12
}

// 1. Dhinam (Kalaprakashika lines 4101-4189; Pariyaya cycle explained at
// Ch.33, lines 8334-8374, explicitly cross-referenced from the Dhinam section:
// "For explanation of Pariyaya, see Chapter 33"). Core numeric rule: count
// bride's nakshatra to groom's (inclusive), reduce mod 9 -> Janma(1)/
// Sampath(2)/Vipath(3)/Kshema(4)/Prathyara(5)/Sidhika(6)/Vadham(7)/
// Maithra(8)/Parama-Maithra(9). Text states 2/4/6/8 as explicitly good and
// 3/5/7 as explicitly bad; 9th ("intimate friendship") is treated here as
// favorable and 1st (same star, "Janma") as neutral -- both are this file's
// synthesis of the surrounding prose, not a verbatim numbered rule, and are
// flagged as such.
//
// Refinements added 2026-09-09, all textually grounded:
//   - Pariyaya cycles. raw 1-9 = 1st Pariyaya (full-strength, as above).
//     raw 10-18 = 2nd Pariyaya: same class names repeat, but the "bad"
//     classes are attenuated to a single groom-nakshatra QUARTER (pada) each
//     -- raw 12 (Vipath) bad only in groom's pada 1, raw 14 (Prathyara) only
//     pada 4, raw 16 (Vadham) only pada 3; the other 3 padas of each are
//     favorable. raw 19-27 = 3rd Pariyaya: the would-be-bad classes (Vipath/
//     Prathyara/Vadham at raw 21/23/25) are overridden from unfavorable to
//     neutral -- text says they "have no adverse qualities," not that they
//     become auspicious, so neutral (not favorable) is used.
//   - 27th-position exclusion (a separate rule, stated right after the
//     Pariyaya table, not part of it): groom's nakshatra should not be the
//     27th from the bride's. Effect is diminished (neutral) if bride/groom
//     share a Moon-sign; stands (unfavorable) if signs differ. Overrides the
//     mod-9 class-9 "favorable" default at raw=27.
//   - 22nd-position "Vadha-Vainasika" exclusion (Ch.33, cites Sage Kasyapa):
//     bad regardless of direction -- source says "counting from the
//     Janma-Nakshathra of EITHER" -- so both bride->groom and groom->bride
//     raw counts are checked. Overrides the class-4 "favorable" default.
//   - Named-pair overrides: 6 pairs stated as always an unsuitable match, and
//     4 pairs stated as a "happy match" exception specifically to the raw=7
//     ("Vadham") bad rule -- the source's own footnote confirms each of the
//     4 pairs sits at a fixed 7-count distance, so this override can never
//     fire outside a cls=7 case; it doesn't need to be conditioned on that
//     explicitly. Both lists are checked order-free (bride/groom either way),
//     same convention as VEDHAI_PAIRS below -- the good-pair footnote's own
//     stated direction for the Chitra/Pushya entry doesn't match the footnote's
//     other two entries (Pushya is the 7th FROM Chitra fails the arithmetic;
//     Chitra is in fact the 7th from Pushya), which reads as scan/OCR
//     corruption in that one footnote clause rather than a real asymmetry --
//     resolved by not asserting a direction at all, rather than guessing.
//   - Intensity nuances Ch.33 mentions (e.g. the 2nd Pariyaya's "good" classes
//     being "half strength") are NOT encoded -- they don't change a
//     favorable/neutral/unfavorable call in this qualitative pass/fail system,
//     only would-be point-weight, which this engine doesn't track (see file
//     header: the source gives no numeric point table for any koota).
// NOT implemented: Ch.33's separate "88th Nakshatra-Padha" rule -- general
// Muhurta-election lore, never cross-referenced by the Dhinam/marriage
// section itself, so folding it in here would be scope creep beyond what the
// source ties to marriage matching.
const DHINAM_BAD_PAIRS = [
  ['Krittika','Ashlesha'], ['Ashlesha','Swati'], ['Chitra','P.Shada'],
  ['Anuradha','Dhanishta'], ['Dhanishta','Bharani'], ['Satabisha','Krittika']
];
const DHINAM_GOOD_PAIRS = [
  ['Ardra','U.Phalguni'], ['P.Phalguni','Anuradha'], ['Chitra','Pushya'], ['Punarvasu','Hasta']
];
function dashaDhinam(NAK27, brideStar, groomStar, groomPada, brideSign, groomSign){
  const raw = nakDist(NAK27, brideStar, groomStar);
  const reverseRaw = nakDist(NAK27, groomStar, brideStar);
  const cls = ((raw - 1) % 9) + 1;
  const NAMES = {1:'Janma',2:'Sampath',3:'Vipath',4:'Kshema',5:'Prathyara',6:'Sidhika',7:'Vadham',8:'Maithra',9:'Parama-Maithra'};
  const badPairHit = DHINAM_BAD_PAIRS.some(([x,y]) => (x===brideStar&&y===groomStar)||(x===groomStar&&y===brideStar));
  const goodPairHit = DHINAM_GOOD_PAIRS.some(([x,y]) => (x===brideStar&&y===groomStar)||(x===groomStar&&y===brideStar));
  let verdict, note;

  if (badPairHit) {
    verdict = 'unfavorable'; note = `named unlucky pair (overrides class ${cls} default)`;
  } else if (goodPairHit) {
    verdict = 'favorable'; note = `named lucky pair, stated exception to the 7th-position rule (overrides class ${cls} default)`;
  } else if (raw === 27) {
    const sameSign = brideSign != null && groomSign != null && brideSign === groomSign;
    verdict = sameSign ? 'neutral' : 'unfavorable';
    note = `27th position (overrides class 9 default) -- ${sameSign ? 'same Moon-sign, effect diminished' : 'different signs, effect stands'}`;
  } else if (raw === 22 || reverseRaw === 22) {
    verdict = 'unfavorable';
    note = `Vadha-Vainasika, 22nd position either direction (overrides class ${cls} default), Ch.33/Sage Kasyapa`;
  } else if (raw >= 19 && raw <= 27) {
    if ([3,5,7].includes(cls)) { verdict = 'neutral'; note = `${NAMES[cls]} (class ${cls}, raw ${raw}), 3rd Pariyaya -- overridden from unfavorable to neutral, "no adverse qualities" per Ch.33`; }
    else if (cls === 1) { verdict = 'neutral'; note = `Janma (class 1, raw ${raw}), 3rd Pariyaya`; }
    else { verdict = 'favorable'; note = `${NAMES[cls]} (class ${cls}, raw ${raw}), 3rd Pariyaya`; }
  } else if (raw >= 10 && raw <= 18 && [3,5,7].includes(cls)) {
    const badPada = { 3:1, 5:4, 7:3 }[cls];
    if (groomPada == null) {
      verdict = 'neutral'; note = `${NAMES[cls]} (class ${cls}, raw ${raw}), 2nd Pariyaya -- bad only in groom's pada ${badPada}, but no pada supplied to resolve; reported neutral`;
    } else {
      const isBad = groomPada === badPada;
      verdict = isBad ? 'unfavorable' : 'favorable';
      note = `${NAMES[cls]} (class ${cls}, raw ${raw}), 2nd Pariyaya -- bad only in groom's pada ${badPada} (groom is pada ${groomPada}); other padas favorable per Ch.33`;
    }
  } else {
    if ([2,4,6,8,9].includes(cls)) verdict = 'favorable';
    else if ([3,5,7].includes(cls)) verdict = 'unfavorable';
    else verdict = 'neutral'; // class 1, Janma
    note = `${NAMES[cls]} (class ${cls} of 9, raw count ${raw})`;
  }
  return { label:'Dhinam', verdict, note };
}

// 2. Ganam (lines 4267-4291) -- same Deva/Manushya/Rakshasa classification as
// Ashtakoota's Gana koota; reuses compat_engine's ASHTAKOOTA_GANA table.
function dashaGanam(NAK27, GANA, brideStar, groomStar){
  const b = GANA[brideStar], g = GANA[groomStar];
  let verdict, note = `${b} / ${g}`;
  if (b === g) verdict = 'favorable';
  else if ((b==='Deva'&&g==='Manushya')||(b==='Manushya'&&g==='Deva')) verdict = 'neutral';
  else if ((b==='Deva'&&g==='Rakshasa')||(b==='Rakshasa'&&g==='Deva')) verdict = 'unfavorable';
  else { // Manushya/Rakshasa combination -- "fatal" per text, with a diminishing exception
    const dist = nakDist(NAK27, brideStar, groomStar);
    if (dist > 14) { verdict = 'neutral'; note += ' (bride>14th from groom: adverse effect diminished per text)'; }
    else verdict = 'unfavorable';
  }
  return { label:'Ganam', verdict, note };
}

// 3. Mahendhram (lines 4292-4295): groom's nakshatra should be the 4th, 7th,
// 10th, 13th, 16th, 19th, 22nd or 25th from the bride's (inclusive count).
function dashaMahendhram(NAK27, brideStar, groomStar){
  const dist = nakDist(NAK27, brideStar, groomStar);
  const good = [4,7,10,13,16,19,22,25].includes(dist);
  return { label:'Mahendhram', verdict: good?'favorable':'unfavorable', note:`count ${dist}` };
}

// 4. Sthree-Dheergham (lines 4296-4301): groom's nakshatra should be beyond the
// 13th from the bride's. Text notes an alternate, looser opinion ("beyond the
// 7th suffices") -- the >13 rule is used as the scored verdict; the alternate
// threshold is only reported in the note, not scored, to avoid silently
// picking whichever threshold is more flattering.
function dashaStreeDheergham(NAK27, brideStar, groomStar){
  const dist = nakDist(NAK27, brideStar, groomStar);
  const good = dist > 13;
  return { label:'Sthree-Dheergham', verdict: good?'favorable':'unfavorable',
    note:`count ${dist} (>13 rule; alt. opinion in source only requires >7 -- ${dist>7 ? 'would pass' : 'would also fail'} that looser threshold)` };
}

// 5. Yoni (lines 4303-4336) -- same animal-yoni table as Ashtakoota, but this
// text gives its own explicit list of mutually-hostile pairs rather than
// Ashtakoota's enmity matrix; that list is used here for fidelity to this
// specific system.
const DASHA_YONI_HOSTILE = [
  ['Monkey','Sheep'], ['Deer','Elephant'], ['Horse','Buffalo'], ['Cow','Tiger'],
  ['Rat','Cat'], ['Serpent','Rat'], ['Serpent','Mongoose'], ['Dog','Deer']
];
function dashaYoni(YONI, brideStar, groomStar){
  const b = YONI[brideStar], g = YONI[groomStar];
  const hostile = DASHA_YONI_HOSTILE.some(([x,y]) => (x===b&&y===g)||(x===g&&y===b));
  const verdict = b===g ? 'favorable' : hostile ? 'unfavorable' : 'neutral';
  return { label:'Yoni', verdict, note:`${b} / ${g}` };
}

// 6. Rasi (lines 4337-4382) -- directional Moon-sign distance rules. Uses
// distGfromB = groom's sign counted forward from bride's (1=same sign, 2=next,
// ... 12=previous). Every branch below is transcribed from the source's own
// case-by-case prose (2nd/3rd/4th/5th/6th/opposite, each with its stated
// "converse"), not a symmetric dosha-set like Ashtakoota's Bhakoota.
const RASI_6TH_EXCEPTION_PAIRS = [
  ['Aries','Virgo'], ['Sagittarius','Taurus'], ['Libra','Pisces'],
  ['Aquarius','Cancer'], ['Leo','Capricorn'], ['Gemini','Scorpio']
];
function dashaRasi(SIGNS, brideSign, groomSign){
  const d = signForward(SIGNS, brideSign, groomSign); // groom's position from bride, 1..12
  const groomSignIdx1based = SIGNS.indexOf(groomSign) + 1;
  switch(d){
    case 1: return { label:'Rasi', verdict:'neutral', note:'same sign -- not addressed by this passage' };
    case 2: {
      const evenSign = groomSignIdx1based % 2 === 0;
      return { label:'Rasi', verdict: evenSign?'favorable':'unfavorable',
        note:`groom 2nd from bride ("fatal") -- exception: groom's sign is ${evenSign?'even (exception applies -> good)':'odd (no exception)'}` };
    }
    case 3: return { label:'Rasi', verdict:'unfavorable', note:'groom 3rd from bride ("misery")' };
    case 4: return { label:'Rasi', verdict:'unfavorable', note:'groom 4th from bride ("poverty")' };
    case 5: return { label:'Rasi', verdict:'unfavorable', note:'groom 5th from bride ("widowhood")' };
    case 6: {
      const exception = RASI_6TH_EXCEPTION_PAIRS.some(([x,y]) => (x===brideSign&&y===groomSign)||(x===groomSign&&y===brideSign));
      return { label:'Rasi', verdict: exception?'favorable':'unfavorable',
        note:`groom 6th from bride ("loss of sons") -- ${exception?'listed exception pair -> felicitous':'no exception pair'}` };
    }
    case 7: return { label:'Rasi', verdict:'favorable', note:'diametrically opposite -- "long and happy life"' };
    case 8: return { label:'Rasi', verdict:'favorable', note:'converse of 6th -- favours birth of sons' };
    case 9: return { label:'Rasi', verdict:'favorable', note:'converse of 5th -- immunity from widowhood (Sumangali)' };
    case 10: return { label:'Rasi', verdict:'favorable', note:'converse of 4th -- they will grow rich' };
    case 11: return { label:'Rasi', verdict:'favorable', note:'converse of 3rd -- happy life' };
    case 12: return { label:'Rasi', verdict:'favorable', note:'converse of 2nd -- prolongs life' };
  }
}

// 7. Rasyadhipathi (lines 4383-4405) -- sign-lord friendship, using each lord's
// OWN stated friend-list (these are asymmetric in the source itself, e.g.
// Jupiter calls Saturn a friend but Saturn calls Jupiter an enemy -- a real
// classical asymmetry, not a transcription error). Saturn's own friend-list is
// never positively stated in the source (only "Jupiter is his enemy"), so
// Saturn->X defaults to 'unspecified' rather than an invented friend/enemy call.
const RASYADHIPATHI_FRIENDS = {
  Mars: ['Mercury','Venus'],
  Venus: ['Mars','Mercury','Jupiter','Saturn'],
  Mercury: ['Moon','Mars','Jupiter','Venus','Saturn'],
  Moon: ['Mercury','Jupiter'],
  Sun: ['Jupiter'],
  Jupiter: ['Sun','Moon','Mercury','Venus','Saturn'],
  Saturn: [] // only "Jupiter is his enemy" is stated; no positive friend-list in source
};
const RASYADHIPATHI_ENEMIES = { Saturn: ['Jupiter'] };
function friendDirection(lord, other){
  if (lord === other) return 'same';
  if ((RASYADHIPATHI_ENEMIES[lord]||[]).includes(other)) return 'enemy';
  if ((RASYADHIPATHI_FRIENDS[lord]||[]).includes(other)) return 'friend';
  return 'unspecified';
}
function dashaRasyadhipathi(SIGN_LORD, brideSign, groomSign){
  const lb = SIGN_LORD[brideSign], lg = SIGN_LORD[groomSign];
  const fwd = friendDirection(lb, lg), back = friendDirection(lg, lb);
  let verdict;
  if (fwd === 'same') verdict = 'favorable';
  else if (fwd === 'friend' && back === 'friend') verdict = 'favorable';
  else if (fwd === 'enemy' || back === 'enemy') verdict = 'unfavorable';
  else if (fwd === 'friend' || back === 'friend') verdict = 'neutral'; // one-directional friendship only
  else verdict = 'neutral'; // both unspecified (mainly involves Saturn)
  return { label:'Rasyadhipathi', verdict, note:`${lb} / ${lg} (${fwd} / ${back})` };
}

// 8. Vasyam (lines 4406-4429) -- directional sign-concordance table, transcribed
// verbatim from the source's own list (itself asymmetric -- e.g. Aries lists
// Leo/Scorpio as concordant, but Leo's own entry lists only Libra).
const VASYAM_CONCORDANT_TO = {
  Aries: ['Leo','Scorpio'], Taurus: ['Cancer','Leo'], Gemini: ['Virgo'],
  Cancer: ['Scorpio','Sagittarius'], Leo: ['Libra'], Virgo: ['Gemini','Pisces'],
  Libra: ['Capricorn'], Scorpio: ['Virgo','Cancer'], Sagittarius: ['Pisces'],
  Capricorn: ['Aquarius','Aries'], Aquarius: ['Aries'], Pisces: ['Capricorn']
};
function dashaVasyam(brideSign, groomSign){
  const hit = (VASYAM_CONCORDANT_TO[brideSign]||[]).includes(groomSign) ||
              (VASYAM_CONCORDANT_TO[groomSign]||[]).includes(brideSign);
  return { label:'Vasyam', verdict: hit?'favorable':'unfavorable', note:`${brideSign} / ${groomSign}` };
}

// 9. Rajju (lines 4430-4453) -- five nakshatra groups; same group = bad (each
// group has its own named ill-effect).
const RAJJU_GROUPS = {
  Padha: ['Aswini','Ashlesha','Magha','Jyeshta','Moola','Revati'],
  Ooroo: ['Bharani','Pushya','P.Phalguni','Anuradha','P.Shada','U.Bhadrapada'],
  Nabhi: ['Krittika','Punarvasu','U.Phalguni','Visakha','U.Shada','P.Bhadrapada'],
  Kantha: ['Rohini','Ardra','Hasta','Swati','Sravana','Satabisha'], // source: "Kama Rajju"; effects sentence names it "Kanta Rajju" (death of the woman) -- treated as the same group, name normalized to Kantha
  Siro: ['Mrigasira','Chitra','Dhanishta'] // source lists "Sravishta" = Dhanishta (mapped to compat_engine's NAK27 spelling)
};
const RAJJU_EFFECT = { Padha:'travel abroad', Ooroo:'loss of property', Nabhi:'loss of offspring', Kantha:'death of the woman (per source wording)', Siro:'death of the man (per source wording)' };
function rajjuGroupOf(star){
  for (const g of Object.keys(RAJJU_GROUPS)) if (RAJJU_GROUPS[g].includes(star)) return g;
  return null;
}
function dashaRajju(brideStar, groomStar, exceptionApplies){
  const bg = rajjuGroupOf(brideStar), gg = rajjuGroupOf(groomStar);
  const same = bg === gg;
  const verdict = same ? (exceptionApplies ? 'neutral' : 'unfavorable') : 'favorable';
  return { label:'Rajju', verdict, note: same ? `both ${bg} Rajju -- ${RAJJU_EFFECT[bg]}${exceptionApplies?' (waived by exception clause)':''}` : `${bg} / ${gg}` };
}

// 10. Vedhai (lines 4455-4480) -- 13 clearly-transcribed mutually-repellent
// nakshatra pairs. The source's final item ("Hastha and Sathabis-Mrigasirsha,
// Chithra and Sravishta") is OCR-damaged and its exact grouping is ambiguous --
// it is encoded here as written (Hasta/Satabisha as one pair) but the trailing
// Mrigasira/Chitra/Dhanishta fragment is DELIBERATELY OMITTED rather than
// guessed at; verify against a clean copy of Kalaprakashika before relying on
// full Vedhai coverage.
const VEDHAI_PAIRS = [
  ['Aswini','Jyeshta'], ['Bharani','Anuradha'], ['Krittika','Visakha'], ['Rohini','Swati'],
  ['Ardra','Sravana'], ['Punarvasu','U.Shada'], ['Pushya','P.Shada'], ['Ashlesha','Moola'],
  ['Magha','Revati'], ['P.Phalguni','U.Bhadrapada'], ['U.Phalguni','P.Bhadrapada'], ['Hasta','Satabisha']
  // NOTE: an additional pair/triple involving Mrigasira, Chitra, Dhanishta is in the
  // source but too OCR-garbled to transcribe safely -- see comment above.
];
function dashaVedhai(brideStar, groomStar, exceptionApplies){
  const hit = VEDHAI_PAIRS.some(([x,y]) => (x===brideStar&&y===groomStar)||(x===groomStar&&y===brideStar));
  const verdict = hit ? (exceptionApplies ? 'neutral' : 'unfavorable') : 'favorable';
  return { label:'Vedhai', verdict, note: hit ? `mutually repellent pair${exceptionApplies?' (waived by exception clause)':''}` : `${brideStar} / ${groomStar}` };
}

// Exception clause (lines 4474-4485): Rajju/Vedhai/Ganam/Rasi doshas are waived
// if (1) same rasi-lord, (2) those lords are mutually friendly, AND (3) the
// two rasis are diametrically opposite. NOTE: under standard 7-planet sign
// rulership no two opposite signs ever share a lord (Aries/Libra = Mars/Venus,
// Gemini/Sagittarius = Mercury/Jupiter, etc.) -- so conditions (1) and (3) as
// literally stated can never both be true. This function implements the
// clause exactly as written; it will therefore never fire. Flagged here
// rather than silently "corrected," since the source itself may intend
// something looser (e.g. friendly lords OR opposite signs) that isn't
// recoverable from the text as transcribed.
function dashaExceptionApplies(SIGNS, SIGN_LORD, brideSign, groomSign){
  const sameLord = SIGN_LORD[brideSign] === SIGN_LORD[groomSign];
  const opposite = signForward(SIGNS, brideSign, groomSign) === 7;
  const lordsFriendly = friendDirection(SIGN_LORD[brideSign], SIGN_LORD[groomSign]) === 'friend'
    && friendDirection(SIGN_LORD[groomSign], SIGN_LORD[brideSign]) === 'friend';
  return sameLord && opposite && lordsFriendly; // structurally unreachable, see note above
}

function computeDasakoota(engine, posA, posB){
  const { NAK27, SIGNS, SIGN_LORD, ASHTAKOOTA_GANA, ASHTAKOOTA_YONI, nakshatraFromSidereal, norm360 } = engine;
  const brideNak = nakshatraFromSidereal(posA.Moon.sidereal, false);
  const groomNak = nakshatraFromSidereal(posB.Moon.sidereal, false);
  const brideStar = brideNak.name;
  const groomStar = groomNak.name;
  const groomPada = groomNak.pada;
  const brideSign = SIGNS[Math.floor(norm360(posA.Moon.sidereal)/30)];
  const groomSign = SIGNS[Math.floor(norm360(posB.Moon.sidereal)/30)];
  const exceptionApplies = dashaExceptionApplies(SIGNS, SIGN_LORD, brideSign, groomSign);

  const kootas = [
    dashaDhinam(NAK27, brideStar, groomStar, groomPada, brideSign, groomSign),
    dashaGanam(NAK27, ASHTAKOOTA_GANA, brideStar, groomStar),
    dashaMahendhram(NAK27, brideStar, groomStar),
    dashaStreeDheergham(NAK27, brideStar, groomStar),
    dashaYoni(ASHTAKOOTA_YONI, brideStar, groomStar),
    dashaRasi(SIGNS, brideSign, groomSign),
    dashaRasyadhipathi(SIGN_LORD, brideSign, groomSign),
    dashaVasyam(brideSign, groomSign),
    dashaRajju(brideStar, groomStar, exceptionApplies),
    dashaVedhai(brideStar, groomStar, exceptionApplies)
  ];
  const favorableCount = kootas.filter(k => k.verdict === 'favorable').length;
  const neutralCount = kootas.filter(k => k.verdict === 'neutral').length;
  const unfavorableCount = kootas.filter(k => k.verdict === 'unfavorable').length;
  // Classical threshold, stated verbatim in the source (line 4502-4504):
  // "the horoscopes of the man and the woman must agree in respect of at least five."
  const passes = favorableCount >= 5;

  return { kootas, favorableCount, neutralCount, unfavorableCount, passes, threshold:5, totalKootas:10, brideStar, groomStar, brideSign, groomSign };
}


const api = { nakDist, signForward, dashaDhinam, dashaGanam, dashaMahendhram, dashaStreeDheergham, dashaYoni,
  dashaRasi, dashaRasyadhipathi, dashaVasyam, dashaRajju, dashaVedhai, dashaExceptionApplies, computeDasakoota,
  rajjuGroupOf, RAJJU_GROUPS };
root.Dashakoota = api;
if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
