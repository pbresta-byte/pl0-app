// Vimshottari starting-star test (www/index.html: vimSeedChoice / vimshottariMahadashas).
// Checks: Moon seed = the pre-change behaviour; Lagna / Kshema / Utpanna / Adhana start lords and balances;
// the automatic "strongest" rule on hand-built charts. Usage: node pl7_dasha_seed_test.js
const vm = require('vm'), fs = require('fs'), { execSync } = require('child_process');
const src = fs.readFileSync(__dirname + '/www/index.html', 'utf8');
function grabFn(code, name) { const i = code.indexOf('function ' + name + '('); if (i < 0) throw new Error('missing ' + name); return code.slice(i, code.indexOf('\n}', i) + 2); }
function grabConst(code, name) { const i = code.indexOf('const ' + name + ' ='); if (i < 0) throw new Error('missing ' + name); let d = 0, j = i;
  for (; j < code.length; j++) { const c = code[j]; if ('[{('.includes(c)) d++; else if (']})'.includes(c)) d--; else if (c === ';' && d === 0) break; } return code.slice(i, j + 1); }
const common = ['NAK27', 'SIGNS', 'GRAHA_LIST', 'PARASHARI_SPECIAL_ASPECTS', 'VIMSHOTTARI_ORDER', 'VIMSHOTTARI_YEARS', 'VIMSHOTTARI_TOTAL_YEARS', 'VIMSHOTTARI_YEAR_DAYS'];
function build(code, extra) {
  const ctx = {}; vm.createContext(ctx);
  const parts = ['function norm360(x){ return ((x % 360) + 360) % 360; }', 'var T = en => en;'];
  common.forEach(c => { try { parts.push(grabConst(code, c)); } catch (e) { if (c !== 'VIMSHOTTARI_YEAR_DAYS') throw e; } });
  ['nakshatraFromSidereal', 'aspectsSignWholeSign', 'vimshottariSequenceFrom', 'vimshottariMahadashas'].forEach(f => parts.push(grabFn(code, f)));
  parts.push(extra, 'function vimshottariYearDays(){ return 365.25; } function moonAtLongitudeJD(){ return NaN; }', 'this.NAK27 = NAK27; this.VIMSHOTTARI_YEARS = VIMSHOTTARI_YEARS;');
  vm.runInContext(parts.join('\n'), ctx);
  return ctx;
}
// new code (with seeds) and the committed pre-change code (Moon only)
const now = build(src, grabConst(src, 'VIM_SEEDS') + '\n' + 'var VIM_OPTS = { balance: "degree", seed: "moon" };\n'
  + grabConst(src, 'VIM_SEED_SHIFT') + '\n' + grabConst(src, 'NAK_SPAN_DEG') + '\n' + grabFn(src, 'vimSeedStrength') + '\n' + grabFn(src, 'vimSeedChoice'));
const old = build(execSync('git show 333fe9f:www/index.html', { cwd: __dirname, maxBuffer: 1 << 26 }).toString(), 'var VIM_OPTS = { balance: "degree" };');
let fails = 0; const bad = m => { fails++; console.log('FAIL ' + m); };
const W = 40 / 3, JD = 2451545;
const pos = (moon, asc, others = {}) => { const p = { _ascSidereal: asc, Moon: { sidereal: moon } };
  ['Sun', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'].forEach((g, i) => { p[g] = { sidereal: others[g] !== undefined ? others[g] : (i * 37 + 5) % 360 }; }); return p; };
const lordAt = (ctx, sid) => ctx.NAK27.find(s => s.n === ctx.nakshatraFromSidereal(((sid % 360) + 360) % 360, false).name).lord;

// 1. Moon seed == committed behaviour on 40 random charts
for (let k = 0; k < 40; k++) {
  const p = pos((k * 47.3 + 11) % 360, (k * 83.1 + 7) % 360);
  const a = now.vimshottariMahadashas(p, JD), b = old.vimshottariMahadashas(p, JD);
  if (a.length !== b.length || a.some((x, i) => x.lord !== b[i].lord || Math.abs(x.endJD - b[i].endJD) > 1e-9)) bad('moon seed differs from committed code, chart ' + k);
}
// 2. Lagna seed: first lord = Lagna star's lord, balance by the Lagna's degree in its star
now.VIM_OPTS.seed = 'lagna';
for (const asc of [3.2, 100.0, 199.99, 355.5]) {
  const p = pos(45, asc), md = now.vimshottariMahadashas(p, JD), lord = lordAt(now, asc);
  if (md[0].lord !== lord) bad(`lagna seed ${asc}: ${md[0].lord} != ${lord}`);
  const frac = (asc % W) / W, expect = now.VIMSHOTTARI_YEARS[lord] * 365.25 * (1 - frac);
  if (Math.abs((md[0].endJD - md[0].startJD) - expect) > 1e-6) bad(`lagna seed ${asc}: balance`);
}
// 3. Kshema/Utpanna/Adhana: lords of the 4th/5th/8th star from the Moon's; same elapsed share as the Moon
for (const [seed, shift] of [['kshema', 3], ['utpanna', 4], ['adhana', 7]]) {
  now.VIM_OPTS.seed = seed;
  for (const moon of [0.5, 125.3, 290.97, 359.9]) {
    const md = now.vimshottariMahadashas(pos(moon, 10), JD), lord = lordAt(now, moon + shift * W);
    if (md[0].lord !== lord) bad(`${seed} ${moon}: ${md[0].lord} != ${lord}`);
    const frac = (moon % W) / W, expect = now.VIMSHOTTARI_YEARS[lord] * 365.25 * (1 - frac);
    if (Math.abs((md[0].endJD - md[0].startJD) - expect) > 1e-6) bad(`${seed} ${moon}: balance`);
  }
}
// 4. Strongest: more planets in kendras to the star's sign wins; tie -> Jupiter/Mercury/lord support; tie -> Moon
now.VIM_OPTS.seed = 'strongest';
const place = (sign, deg = 15) => sign * 30 + deg;
// Moon in Aries, Lagna in Cancer, Utpanna 5th star from the Moon. Put 5 planets in Cancer's kendras -> Lagna wins.
let p = pos(place(0, 2), place(3, 10), { Sun: place(3), Mars: place(6), Mercury: place(9), Jupiter: place(0), Venus: place(3), Saturn: place(1), Rahu: place(1), Ketu: place(7) });
let c = now.vimSeedChoice(p); if (c.key !== 'lagna') bad(`strongest: expected lagna, got ${c.key} ${JSON.stringify(c.candidates.map(x => [x.key, x.inKendra, x.helpers]))}`);
// Genuine tie: Moon and Lagna in Ashwini (Aries), Utpanna (Mrigashira) in Taurus; one planet in kendras to each sign
// (the Moon itself for Aries, Venus for Taurus); no Jupiter/Mercury/star-lord support for any -> the Moon wins.
p = pos(place(0, 2), place(0, 5), { Sun: place(5), Mars: place(11), Mercury: place(2), Jupiter: place(2), Venus: place(1), Saturn: place(8), Rahu: place(2), Ketu: place(2) });
c = now.vimSeedChoice(p); if (c.key !== 'moon') bad(`strongest tie: expected moon, got ${c.key} ${JSON.stringify(c.candidates.map(x => [x.key, x.inKendra, x.helpers]))}`);
console.log(fails ? `${fails} failure(s)` : 'PASS — moon seed unchanged on 40 charts; lagna, kshema/utpanna/adhana lords and balances; strongest rule');
process.exit(fails ? 1 : 0);
