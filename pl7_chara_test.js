// Chara dasha test (www/index.html: charaSignYears / charaMahadashas / charaAntardashas).
// Fixtures: the two worked charts in V.P. Goel, Predicting Through Jaimini Astrology, ch. 3 (K.N. Rao method),
// with positions as printed; plus hand-built cases for the Parashara-only rules. Usage: node pl7_chara_test.js
const vm = require('vm'), fs = require('fs');
const src = fs.readFileSync(__dirname + '/www/index.html', 'utf8');
const block = src.slice(src.indexOf('// BEGIN CHARA DASHA'), src.indexOf('// END CHARA DASHA'));
const ctx = { localStorage: { getItem: () => null, setItem() {} } }; vm.createContext(ctx);
vm.runInContext('function norm360(x){ return ((x % 360) + 360) % 360; }\n' + block.replace(/^const /gm, 'var '), ctx);
let fails = 0; const bad = m => { fails++; console.log('FAIL ' + m); };
const S = { Ar:0, Ta:1, Ge:2, Cn:3, Le:4, Vi:5, Li:6, Sc:7, Sg:8, Cp:9, Aq:10, Pi:11 }, N = Object.keys(S);
const mk = (asc, pl) => { const p = { _ascSidereal: S[asc[0]] * 30 + asc[1] }; for (const g in pl) p[g] = { sidereal: S[pl[g][0]] * 30 + pl[g][1] }; return p; };
const opt = m => ({ method: m, antar: 'next', rahuEx: 'taurus', mercEx: 'degree' });
const check = (name, pos, method, expectSeq, expectYears) => {
  const md = ctx.charaMahadashas(pos, 0, 365.25, opt(method), 1).slice(0, 12);
  const seq = md.map(r => N[r.sign]).join(' '), yrs = md.map(r => r.years).join(' ');
  if (seq !== expectSeq) bad(`${name} ${method} order ${seq} != ${expectSeq}`);
  if (yrs !== expectYears) bad(`${name} ${method} years ${yrs} != ${expectYears}`);
  return md;
};
// Rajesh Khanna, 29 Dec 1942: Lagna Gemini, 9th Aquarius -> backward. Goel: 6 7 7 9 6 8 6 3 2 9 8 11.
const rk = mk(['Ge', 6.1], { Sun:['Sg',14.07], Moon:['Le',29.02], Mars:['Sc',16.63], Mercury:['Sg',29.77], Jupiter:['Ge',28.82],
  Venus:['Sg',24.45], Saturn:['Ta',13.87], Rahu:['Le',3.0], Ketu:['Aq',3.0] });
check('Khanna', rk, 'rao', 'Ge Ta Ar Pi Aq Cp Sg Sc Li Vi Le Cn', '6 7 7 9 6 8 6 3 2 9 8 11');
check('Khanna', rk, 'parashara', 'Ge Ta Ar Pi Aq Cp Sg Sc Li Vi Le Cn', '6 7 7 9 6 8 6 3 2 9 8 11'); // no exalted/debilitated lords
// Indira Gandhi, 19 Nov 1917: Lagna Cancer, 9th Pisces -> backward. Goel: 6 5 7 4 10 2 6 5 9 2 10 9 (Scorpio: Mars has more degrees).
const ig = mk(['Cn', 27.37], { Sun:['Sc',4.12], Moon:['Cp',5.58], Mars:['Le',16.37], Mercury:['Sc',13.22], Jupiter:['Ta',15.0],
  Venus:['Sg',21.0], Saturn:['Cn',21.78], Rahu:['Sg',9.2], Ketu:['Ge',9.2] });
check('Gandhi', ig, 'rao', 'Cn Ge Ta Ar Pi Aq Cp Sg Sc Li Vi Le', '6 5 7 4 10 2 6 5 9 2 10 9');
// Parashara co-lord rule: Mars (Leo, fixed) and Ketu (Gemini, dual) alone -> dual sign wins -> Scorpio to Gemini = 8 - 1 = 7.
const pg = check('Gandhi', ig, 'parashara', 'Cn Ge Ta Ar Pi Aq Cp Sg Sc Li Vi Le', '6 5 7 4 10 2 6 5 7 2 10 9');
if (pg[8].why !== 'signNature' || pg[8].lord !== 'Ketu') bad('Gandhi parashara Scorpio should pick Ketu by sign nature');
// Antardashas: Goel's Leo MD (Gandhi) starts from Virgo, forward, 12 equal parts; Aquarius MD (Khanna) starts from Pisces.
const leo = ctx.charaMahadashas(ig, 0, 365.25, opt('rao'), 1).find(r => r.sign === 4);
const ad = ctx.charaAntardashas(leo, opt('rao')).map(a => N[a.sign]).join(' ');
if (ad !== 'Vi Li Sc Sg Cp Aq Pi Ar Ta Ge Cn Le') bad('Leo antardashas ' + ad);
if (Math.abs(ctx.charaAntardashas(leo, opt('rao'))[0].endJD - leo.startJD - 9 * 365.25 / 12) > 1e-9) bad('antardasha length');
const aq = ctx.charaMahadashas(rk, 0, 365.25, opt('rao'), 1).find(r => r.sign === 10);
if (N[ctx.charaAntardashas(aq, opt('rao'))[0].sign] !== 'Pi') bad('Aquarius antardasha start');
const self = ctx.charaAntardashas(leo, { ...opt('rao'), antar: 'self' }).map(a => N[a.sign]).join(' ');
if (self !== 'Le Vi Li Sc Sg Cp Aq Pi Ar Ta Ge Cn') bad('self-start antardashas ' + self);
// Parashara +/-1 and exaltation options (hand cases).
const base = { Sun:['Ar',20], Moon:['Cn',5], Mars:['Li',10], Mercury:['Vi',20], Jupiter:['Cp',3], Venus:['Sg',1], Saturn:['Ta',8], Rahu:['Ge',10], Ketu:['Sg',10] };
const h = mk(['Ar', 1], base), yr = (sign, o) => ctx.charaSignYears(S[sign], h, { ...opt('parashara'), ...o }).years;
const want = (label, got, exp) => { if (got !== exp) bad(`${label}: ${got} != ${exp}`); };
want('Leo (backward to Sun in Aries 5-1, exalted +1)', yr('Le', {}), 5);
want('Sagittarius (forward to Jupiter in Capricorn 2-1, debilitated -1)', yr('Sg', {}), 0);
want('Virgo, Mercury at 20° Virgo, exaltation by degree', yr('Vi', {}), 12);
want('Virgo, Mercury at 20° Virgo, exalted anywhere in Virgo', yr('Vi', { mercEx: 'sign' }), 13);
want('Aquarius, Rahu exalted in Gemini (co-lord with exalted planet, 9-1 +1)', yr('Aq', { rahuEx: 'gemini' }), 9);
want('Aquarius, Rahu exalted in Taurus (dual sign wins, 9-1)', yr('Aq', {}), 8);
want('Rao ignores exaltation (Leo)', ctx.charaSignYears(S.Le, h, opt('rao')).years, 4);
const hm = ctx.charaMahadashas(h, 0, 365.25, opt('parashara'), 200);
if (hm.some(r => r.sign === S.Sg)) bad('zero-year Sagittarius should be skipped');
if (!hm.some(r => r.cycle === 2) || hm.filter(r => r.cycle === 2).map(r => r.years).join() !== hm.filter(r => r.cycle === 1).map(r => r.years).join()) bad('second cycle should repeat the same years');
console.log(fails ? `${fails} failure(s)` : 'PASS — Goel worked charts (Khanna, Gandhi) order + years both methods; antardashas; Parashara ±1, co-lord rules, exaltation options; cycle repeat');
process.exit(fails ? 1 : 0);
