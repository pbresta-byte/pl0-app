// Vimshottari test: the app's dasha functions (www/index.html) vs PL7's dates for its test chart
// (Cristian, 1990-09-30 17:54:20, UTC-4, Miami), all five levels. PL7's own Moon longitude is used so the
// check isolates the dasha method from the ephemeris. Usage: node pl7_vimshottari_test.js
const vm = require('vm'), fs = require('fs');
const src = fs.readFileSync(__dirname + '/www/index.html', 'utf8');
function block(startRe){  // a function or const declaration, by brace/bracket matching from its first opener
  const m = src.match(startRe); if (!m) throw new Error('missing ' + startRe);
  let i = m.index + m[0].length - 1; const open = src[i], close = open === '{' ? '}' : ']'; let depth = 0;
  for (; i < src.length; i++){ if (src[i] === open) depth++; else if (src[i] === close && --depth === 0) break; }
  return src.slice(m.index, i + 1) + ';';
}
const opts = src.slice(src.indexOf('// BEGIN VIMSHOTTARI OPTS'), src.indexOf('// END VIMSHOTTARI OPTS'));
const ctx = {}; vm.createContext(ctx);
vm.runInContext([
  block(/function norm360\(x\)\{/), 'var DEG = Math.PI/180;', block(/function sinD\(d\)\{/), block(/function cosD\(d\)\{/), block(/const NAK27 = \[/), 'var ABHIJIT_START = 276+40/60, ABHIJIT_END = 280+53/60+20/3600;',
  block(/function nakshatraFromSidereal\(long, use28\)\{/), block(/function julianDay\(y,m,d,hh,mm,ss, utcOffsetHours\)\{/),
  block(/function centuriesJ2000\(jd\)\{/), block(/function lahiriAyanamsa\(T\)\{/), block(/function moonLongitude\(T\)\{/),
  block(/const VIMSHOTTARI_ORDER = \[/), block(/const VIMSHOTTARI_YEARS = \{/), 'const VIMSHOTTARI_TOTAL_YEARS = 120; const VIMSHOTTARI_YEAR_DAYS = 365.25;',
  opts, block(/const VIM_SEED_SHIFT = \{/), 'const NAK_SPAN_DEG = 40/3;', block(/function vimSeedChoice\(birthPos\)\{/), block(/function vimshottariSequenceFrom\(startLord\)\{/), block(/function vimshottariSubPeriods\(parentLord, startJD, lengthDays\)\{/),
  block(/function vimshottariMahadashas\(birthPos, birthJD\)\{/),
  'this.api = { VIM_OPTS, julianDay, vimshottariMahadashas, vimshottariSubPeriods, moonSiderealAt, moonAtLongitudeJD };',
].join('\n'), ctx);
const A = ctx.api;

const AB = { Ke: 'Ketu', Ve: 'Venus', Su: 'Sun', Mo: 'Moon', Ma: 'Mars', Ra: 'Rahu', Ju: 'Jupiter', Sa: 'Saturn', Me: 'Mercury' };
const FX = JSON.parse(fs.readFileSync(process.argv[2] || 'E:/ClaudeWorkSpaceAnthropic/pl0-app/docs/research/pl7-features/live-ui-fixtures.json', 'utf8'));
const birthJD = A.julianDay(1990, 9, 30, 17, 54, 20, -4);
const birthPos = { Moon: { sidereal: FX.exported_longitudes_deg.Mo } };
const localDate = jd => { const d = new Date((jd - 2440587.5) * 86400000 - 4 * 3600000); return d.toISOString().slice(0, 10); };
const dayDiff = (a, b) => Math.round((Date.parse(a) - Date.parse(b)) / 86400000);

let fails = 0, worst = 0; const lines = [];
function check(label, periods, expected){
  const got = {}; periods.forEach(p => { got[p.lord] = localDate(p.startJD); });
  const diffs = Object.entries(expected).map(([ab, date]) => { const d = dayDiff(got[AB[ab]], date); worst = Math.max(worst, Math.abs(d)); if (Math.abs(d) > 1) fails++; return `${ab}${d ? (d > 0 ? '+' : '') + d : ''}`; });
  lines.push(`${label.padEnd(11)} ${diffs.join(' ')}`);
}
const find = (list, ab) => list.find(p => p.lord === AB[ab]);
const md = A.vimshottariMahadashas(birthPos, birthJD);
// the first mahadasha starts before birth: rebuild its full span for comparison
const first = md[0]; const firstFull = { lord: first.lord, startJD: first.endJD - 7 * 365.25, endJD: first.endJD };
check('mahadasha', [firstFull].concat(md.slice(1)), FX.vimshottari_mahadasha_starts);
const sub = p => A.vimshottariSubPeriods(p.lord, p.startJD, p.endJD - p.startJD);
const ju = find(md, 'Ju'); const ad = sub(ju); check('Ju antar', ad, FX.vimshottari_ju_antar_starts);
const ma = find(ad, 'Ma'); const pd = sub(ma); check('Ju-Ma prat', pd, FX.vimshottari_ju_ma_pratyantar_starts);
const me = find(pd, 'Me'); const sd = sub(me); check('..-Me suk', sd, FX.vimshottari_ju_ma_me_sukshma_starts);
const mo = find(sd, 'Mo'); const pr = sub(mo); check('..-Mo prana', pr, FX.vimshottari_ju_ma_me_mo_prana_starts);

// options behave: 360-day year shortens the Jupiter mahadasha to 16*360 days; time balance stays close to degree balance
A.VIM_OPTS.yearDays = '360';
const ju360 = find(A.vimshottariMahadashas(birthPos, birthJD), 'Ju');
if (Math.abs((ju360.endJD - ju360.startJD) - 16 * 360) > 1e-6) { fails++; lines.push('360-day option: wrong Jupiter length'); }
A.VIM_OPTS.yearDays = '365.25'; A.VIM_OPTS.balance = 'time';
const appMoon = A.moonSiderealAt(birthJD);
const mdT = A.vimshottariMahadashas({ Moon: { sidereal: appMoon } }, birthJD);
A.VIM_OPTS.balance = 'degree';
const mdD = A.vimshottariMahadashas({ Moon: { sidereal: appMoon } }, birthJD);
const shift = (mdT[1].startJD - mdD[1].startJD);
lines.push(`balance by time vs by degree (app Moon ${appMoon.toFixed(4)}): next mahadasha shifts ${shift.toFixed(1)} days`);
if (!(Math.abs(shift) < 7 * 365.25 * 0.2)) { fails++; lines.push('time balance implausible'); }
const entry = A.moonAtLongitudeJD(290, birthJD - 0.5);
if (Math.abs(A.moonSiderealAt(entry) - 290) > 1e-4) { fails++; lines.push('moonAtLongitudeJD did not converge'); }

console.log('day differences vs PL7 (app - PL7):\n' + lines.join('\n'));
console.log(`worst ${worst} day(s); ` + (fails ? `FAIL (${fails})` : 'PASS'));
process.exit(fails ? 1 : 0);
