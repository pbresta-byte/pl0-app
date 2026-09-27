// Sthira dasha / Brahma test (www/index.html CHARA DASHA block: brahmaGraha, sthiraMahadashas).
// Fixture: the 4 May 1969 example chart in Goel ch.1/5 (Virgo Lagna; Pisces the stronger of Lagna/7th; Mars the
// Atmakaraka). The placement rules pick the Sun (Aries); Goel's numeric strengths pick Venus (Pisces) and his short
// method Mars (Scorpio) - hence the by-hand option. Plus rule-level checks. Usage: node pl7_sthira_test.js
const vm = require('vm'), fs = require('fs');
const src = fs.readFileSync(__dirname + '/www/index.html', 'utf8');
const block = src.slice(src.indexOf('// BEGIN CHARA DASHA'), src.indexOf('// END CHARA DASHA'));
const ctx = { localStorage: { getItem: () => null, setItem() {} } }; vm.createContext(ctx);
vm.runInContext('function norm360(x){ return ((x % 360) + 360) % 360; }\n' + block.replace(/^const /gm, 'var '), ctx);
let fails = 0; const bad = m => { fails++; console.log('FAIL ' + m); };
const N = ['Ar','Ta','Ge','Cn','Le','Vi','Li','Sc','Sg','Cp','Aq','Pi'], S = {}; N.forEach((n, i) => S[n] = i);
const mk = (asc, pl) => { const p = { _ascSidereal: S[asc[0]] * 30 + asc[1] }; for (const k in pl) p[k] = { sidereal: S[pl[k][0]] * 30 + pl[k][1] }; return p; };
const opt = { method: 'parashara', antar: 'next', rahuEx: 'taurus', mercEx: 'degree' };
const g = mk(['Vi', 1.55], { Sun:['Ar',20.3], Moon:['Sc',20.25], Mars:['Sc',23.03], Mercury:['Ar',11.2], Jupiter:['Vi',3.22], Venus:['Pi',17.47], Saturn:['Ar',7.12], Rahu:['Pi',5.97], Ketu:['Vi',5.97] });
if (ctx.charaAtmakaraka(g) !== 'Mars') bad('AK should be Mars');
if (ctx.charaStrongerSign(S.Vi, S.Pi, g, opt).sign !== S.Pi) bad('Pisces should be the stronger of Lagna/7th (as in the example)');
const b = ctx.brahmaGraha(g, opt);
// From Pisces: 6th Leo (Sun, in Aries = 2nd from Pisces: invisible), 8th Libra (Venus, Pisces: even), 12th Aquarius
// (Saturn in Aries: invisible; Rahu in Pisces: even) -> none. From Virgo: Saturn (Aries, 8th, odd, visible) and Sun
// (Aries, 8th) qualify; Mars (Scorpio, even) and Rahu (Pisces, even) do not. Sun is further through Aries.
if (b.planet !== 'Sun' || b.step !== 1 || N[b.ref] !== 'Vi' || N[b.sign] !== 'Ar') bad(`Goel chart Brahma ${b.planet} step ${b.step} ref ${N[b.ref]}`);
const sd = ctx.sthiraMahadashas(g, 0, 365.25, opt, { brahma: 'rule', dir: 'parity' }, 96);
if (sd.list.slice(0, 4).map(r => N[r.sign] + r.years).join(' ') !== 'Ar7 Ta8 Ge9 Cn7') bad('Sthira from Aries ' + sd.list.slice(0, 4).map(r => N[r.sign] + r.years).join(' '));
const sv = ctx.sthiraMahadashas(g, 0, 365.25, opt, { brahma: 'Venus', dir: 'parity' }, 96);
if (sv.list.slice(0, 3).map(r => N[r.sign]).join(' ') !== 'Pi Aq Cp') bad('Venus/Pisces, even sign, should run backward');
const sf = ctx.sthiraMahadashas(g, 0, 365.25, opt, { brahma: 'Venus', dir: 'forward' }, 96);
if (sf.list.slice(0, 3).map(r => N[r.sign]).join(' ') !== 'Pi Ar Ta') bad('always-forward option');
// Replacement: Saturn as the only qualifier hands over to Mars.
// Cancer Lagna, crowded (stronger than Capricorn); lords of 6/8/12 = Jupiter, Saturn/Rahu, Mercury. Only Saturn sits in an
// odd sign in the visible half (Aquarius, the 8th), so the rules name Saturn, which hands the role to Mars.
const r2 = mk(['Cn', 10], { Sun:['Cn',1], Moon:['Cn',2], Mars:['Le',3], Mercury:['Cn',4], Jupiter:['Cn',5], Venus:['Ta',6], Saturn:['Aq',25], Rahu:['Ta',20], Ketu:['Sc',20] });
const b2 = ctx.brahmaGraha(r2, opt);
if (!(b2.original === 'Saturn' && b2.planet === 'Mars')) bad(`Saturn should hand over to Mars, got ${b2.original} -> ${b2.planet}`);
// Antardashas: 12 equal parts from the dasha sign in the dasha's direction.
const ad = ctx.sthiraAntardashas({ sign: S.Pi, startJD: 0, endJD: 9 * 365.25 }, -1).map(a => N[a.sign]).join(' ');
if (ad.split(' ')[0] !== 'Pi' || ad.split(' ')[1] !== 'Aq') bad('antardashas ' + ad);
console.log(fails ? `${fails} failure(s)` : 'PASS — example chart: AK, stronger side, Brahma by the rules (Sun), fallback step, sequence/years, direction options, Saturn->Mars, antardashas');
process.exit(fails ? 1 : 0);
