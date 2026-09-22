// Conditional dasha engine test (www/index.html, CONDITIONAL DASHAS block) against the hand-worked examples and
// tables in docs/research/dasha/conditional-dashas-spec.md. Usage: node pl7_conditional_dasha_test.js
const vm = require('vm'), fs = require('fs');
const src = fs.readFileSync(__dirname + '/www/index.html', 'utf8');
const block = src.slice(src.indexOf('// BEGIN CONDITIONAL DASHAS'), src.indexOf('// END CONDITIONAL DASHAS'));
const grab = re => { const m = src.match(re); if (!m) throw new Error('missing ' + re); return m[0]; };
const ctx = {}; vm.createContext(ctx);
vm.runInContext([grab(/function norm360\(x\)\{[^\n]*\}/), grab(/const ABHIJIT_START = [^\n]*/), grab(/const ABHIJIT_END {3}= [^\n]*/),
  grab(/const SIGNS = \[[^\]]*\];/), 'var VIM_OPTS = { balance: "degree" }; var T = (en) => en; var ordinalSuffix = () => "";',
  block, 'this.api = { COND_DASHAS, COND_OPTS, nak28Of, condDashaOpening, condMahadashas, condSubPeriods };'].join('\n'), ctx);
const A = ctx.api, W = 40 / 3;
const mid = i27 => i27 * W + W / 2;          // middle of a 27-star nakshatra
const NAK = ['Ashwini','Bharani','Krittika','Rohini','Mrigashira','Ardra','Punarvasu','Pushya','Ashlesha','Magha','P.Phalguni','U.Phalguni','Hasta','Chitra','Swati','Vishakha','Anuradha','Jyeshtha','Mula','P.Ashadha','U.Ashadha','Shravana','Dhanishta','Shatabhisha','P.Bhadrapada','U.Bhadrapada','Revati'];
const at = n => mid(NAK.indexOf(n));
let fails = 0; const bad = m => { fails++; console.log('FAIL ' + m); };
const opening = (k, sid, o) => { const r = A.condDashaOpening(k, sid, NaN, o); return A.COND_DASHAS[k].lords[r.lordIdx]; };
const CASES = [  // [system, Moon longitude, expected opening lord, note]
  ['dwadashottari', 30 + 8 + 21/60, 'Sun', 'Krittika, count to Revati 25, rem 1'],
  ['shodashottari', at('Pushya'), 'Sun', 'Pushya = 1st'], ['shodashottari', at('Ashlesha'), 'Mars', '2nd'],
  ['shodashottari', at('Shravana'), 'Mercury', '15th, rem 7'], ['shodashottari', at('Revati'), 'Saturn', '20th, rem 4'],
  ['chaturashiti', at('Swati'), 'Sun', '1st'], ['chaturashiti', at('Shravana'), 'Sun', '8th, rem 1'], ['chaturashiti', at('Vishakha'), 'Moon', '2nd'],
  ['shatabdika', at('Revati'), 'Sun', '1st'], ['shatabdika', at('Krittika'), 'Mercury', '4th'],
  ['panchottari', at('Anuradha'), 'Sun', '1st'], ['panchottari', at('Krittika'), 'Jupiter', '14th, rem 0 -> last'],
  ['dwisaptati', at('Mula'), 'Sun', '1st'], ['dwisaptati', at('U.Bhadrapada'), 'Rahu', '8th, rem 0'],
  ['shattrimsha', at('Shravana'), 'Moon', '1st'], ['shattrimsha', at('Bharani'), 'Rahu', '8th'],
  ['shashtihayani', at('Ashwini'), 'Jupiter', 'group 1'], ['shashtihayani', 278, 'Saturn', 'Abhijit'], ['shashtihayani', at('Revati'), 'Rahu', 'last group'],
  ['ashtottari', at('Ardra'), 'Sun', 'from Ardra'], ['ashtottari', at('Krittika'), 'Venus', 'from Ardra: Krittika in Venus group'],
  ['ashtottari', 278, 'Saturn', 'Abhijit in Saturn group'], ['ashtottari', at('Bharani'), 'Rahu', 'Rahu group wraps'],
];
for (const [k, sid, want, note] of CASES) { const got = opening(k, sid); if (got !== want) bad(`${k} ${note}: ${got}, want ${want}`); }
if (opening('ashtottari', at('Krittika'), { krittikaStart: true }) !== 'Sun') bad('ashtottari Krittika start');
if (opening('ashtottari', at('Punarvasu'), { krittikaStart: true }) !== 'Moon') bad('ashtottari Krittika start, Punarvasu -> Moon');
// cycle totals
const TOT = { dwisaptati: 72, shattrimsha: 36, dwadashottari: 112, chaturashiti: 84, shatabdika: 100, shodashottari: 116, panchottari: 105, shashtihayani: 60, ashtottari: 108 };
for (const [k, t] of Object.entries(TOT)) { const s = A.COND_DASHAS[k].years.reduce((a, b) => a + b, 0); if (s !== t) bad(`${k} total ${s} != ${t}`); if (A.COND_DASHAS[k].groups && A.COND_DASHAS[k].groups.reduce((a, b) => a + b, 0) !== 28) bad(`${k} groups != 28`); }
// balance: Dwadashottari worked example — Moon 8°21' Taurus, 1°39' unexpired of Krittika -> 1.65/13.333 x 7 y remaining
{ const sid = 30 + 8 + 21 / 60, r = A.condDashaOpening('dwadashottari', sid, NaN); const remaining = 7 - r.spentYears, want = (1 + 39 / 60) / W * 7;
  if (Math.abs(remaining - want) > 1e-9) bad(`dwadashottari balance ${remaining} want ${want}`); }
// grouped balance: Moon mid-Bharani in Shashtihayani -> half Bharani share + Krittika share = 5 y left of Jupiter's 10
{ const r = A.condDashaOpening('shashtihayani', at('Bharani'), NaN); if (Math.abs((10 - r.spentYears) - 5) > 1e-9) bad(`shashtihayani grouped balance ${10 - r.spentYears}`); }
// Abhijit / shortened spans on the 28 wheel
const n28 = A.nak28Of(270); if (n28.idx !== 20 || Math.abs(n28.end - (276 + 40 / 60)) > 1e-9) bad('U.Shada shortened span');
if (A.nak28Of(281).idx !== 22) bad('Shravana after Abhijit');
// mahadasha chain continuity + sub-periods sum to parent
{ const md = A.condMahadashas('shodashottari', at('Ashlesha'), 2450000, 365.25, 120);
  for (let i = 1; i < md.length; i++) if (Math.abs(md[i].startJD - md[i - 1].endJD) > 1e-6) bad('mahadasha gap');
  const sub = A.condSubPeriods('shodashottari', md[1]); if (sub[0].lord !== md[1].lord || Math.abs(sub[sub.length - 1].endJD - md[1].endJD) > 1e-6) bad('sub-periods'); }
console.log(`${CASES.length + 2} opening cases, 9 cycle totals, 2 balance checks, 28-star spans, chain — ${fails ? 'FAIL (' + fails + ')' : 'PASS'}`);
process.exit(fails ? 1 : 0);
