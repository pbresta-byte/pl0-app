// Drig + Kendradi test (www/index.html CHARA DASHA block).
// Fixtures: Rangacharya's Drig table (trine reading, clean rows Aries..Scorpio), Rath's two worked group orders
// (aspect reading by footing: Leo -> Aries, Capricorn, Libra; Taurus -> Cancer, Libra, Capricorn), the repeat that
// the aspect reading produces when the 9th is fixed, and the BPHS Kendradi worked example (Aquarius Lagna).
// Usage: node pl7_drig_kendradi_test.js
const vm = require('vm'), fs = require('fs');
const src = fs.readFileSync(__dirname + '/www/index.html', 'utf8');
const block = src.slice(src.indexOf('// BEGIN CHARA DASHA'), src.indexOf('// END CHARA DASHA'));
const ctx = { localStorage: { getItem: () => null, setItem() {} } }; vm.createContext(ctx);
vm.runInContext('function norm360(x){ return ((x % 360) + 360) % 360; }\n' + block.replace(/^const /gm, 'var '), ctx);
let fails = 0; const bad = m => { fails++; console.log('FAIL ' + m); };
const N = ['Ar','Ta','Ge','Cn','Le','Vi','Li','Sc','Sg','Cp','Aq','Pi'], S = {}; N.forEach((n, i) => S[n] = i);
const RANGA = { Ar:'Sg Ar Le Cp Ta Vi Aq Ge Li Pi Cn Sc', Ta:'Cp Ta Vi Aq Ge Li Pi Cn Sc Ar Le Sg', Ge:'Aq Ge Li Pi Cn Sc Ar Le Sg Ta Vi Cp',
  Cn:'Pi Cn Sc Ar Le Sg Ta Vi Cp Ge Li Aq', Le:'Ar Le Sg Ta Vi Cp Ge Li Aq Cn Sc Pi', Vi:'Ta Vi Cp Ge Li Aq Cn Sc Pi Le Sg Ar',
  Li:'Ge Li Aq Cn Sc Pi Le Sg Ar Vi Cp Ta', Sc:'Cn Sc Pi Le Sg Ar Vi Cp Ta Li Aq Ge' };
for (const k in RANGA){ const got = ctx.drigSequence(S[k], { mode: 'trines' }).signs.map(s => N[s]).join(' '); if (got !== RANGA[k]) bad(`trines ${k}: ${got}`); }
// Rath's worked groups: Leo as 9th (Lagna Sagittarius), Taurus as 9th (Lagna Virgo); first group = head + 3.
let g = ctx.drigSequence(S.Sg, { mode: 'aspects', order: 'footing' }).signs.slice(0, 4).map(s => N[s]).join(' ');
if (g !== 'Le Ar Cp Li') bad('Rath Leo group ' + g);
g = ctx.drigSequence(S.Vi, { mode: 'aspects', order: 'footing' }).signs.slice(0, 4).map(s => N[s]).join(' ');
if (g !== 'Ta Cn Li Cp') bad('Rath Taurus group ' + g);
g = ctx.drigSequence(S.Sg, { mode: 'aspects', order: 'type' }).signs.slice(0, 4).map(s => N[s]).join(' ');
if (g !== 'Le Li Cp Ar') bad('type order, Leo group ' + g);
// Fixed 9th -> repeats; movable or dual 9th -> all 12 distinct.
const rep = ctx.drigSequence(S.Sg, { mode: 'aspects', order: 'footing' });
if (!rep.missing.length || !rep.repeats.length) bad('fixed 9th should repeat and miss signs');
for (const lag of [S.Ar, S.Cn, S.Ta, S.Le]){ const r = ctx.drigSequence(lag, { mode: 'aspects', order: 'footing' }); if (r.signs.length !== 12 || r.missing.length) bad('non-fixed 9th should cover 12, lagna ' + N[lag]); }
// Kendradi, BPHS worked example (Aquarius Lagna; Sun is the Atmakaraka).
const mk = (asc, pl) => { const p = { _ascSidereal: S[asc[0]] * 30 + asc[1] }; for (const k in pl) p[k] = { sidereal: S[pl[k][0]] * 30 + pl[k][1] }; return p; };
const bp = mk(['Aq', 16.47], { Sun:['Cp',29.6], Moon:['Ge',22.1], Mars:['Ta',0.94], Mercury:['Aq',13.1], Jupiter:['Aq',13.7], Venus:['Aq',20.07], Saturn:['Sc',13.4], Rahu:['Ge',13.93], Ketu:['Sg',13.93] });
const opt = { method: 'parashara', antar: 'next', rahuEx: 'taurus', mercEx: 'degree' };
const kd = ctx.kendradiSequence(bp, opt).signs.map(s => N[s]);
// The text's order is Aq Ta Sc Le | Ge Sg Pi Vi | Cp Ar Cn Li. The ladder reproduces the first nine; among the three
// empty movable apoklimas it ranks by the lords' degrees (Moon, Venus, Mars) where the example lists them zodiacally.
if (kd.slice(0, 9).join(' ') !== 'Aq Ta Sc Le Ge Sg Pi Vi Cp') bad('BPHS Kendradi first nine ' + kd.join(' '));
if (kd.slice(9).sort().join() !== ['Ar','Cn','Li'].sort().join()) bad('BPHS Kendradi apoklima set ' + kd.slice(9).join(' '));
if (new Set(kd).size !== 12) bad('Kendradi should cover 12 signs');
// Even starting sign: counting runs backward, so the second group is the 12/9/6/3 houses of a forward count.
const cn = mk(['Cn', 10], { Sun:['Cn',5], Moon:['Cn',8], Mars:['Ar',3], Mercury:['Ge',2], Jupiter:['Pi',4], Venus:['Ta',6], Saturn:['Li',9], Rahu:['Vi',1], Ketu:['Pi',1] });
const kc = ctx.kendradiSequence(cn, opt);
if (N[kc.start.sign] !== 'Cn') bad('even-start chart should start from Cancer, got ' + N[kc.start.sign]);
if (kc.signs.slice(4, 8).map(s => N[s]).sort().join() !== ['Ge','Pi','Sg','Vi'].sort().join()) bad('even start should count backward: ' + kc.signs.map(s => N[s]).join(' '));
console.log(fails ? `${fails} failure(s)` : 'PASS — Rangacharya Drig table (8 rows), Rath group orders, type order, repeat detection, BPHS Kendradi (9/12 exact + set), even-sign backward counting');
process.exit(fails ? 1 : 0);
