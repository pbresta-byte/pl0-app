// Narayana dasha test (www/index.html CHARA DASHA block: narayanaSequence / narayanaMahadashas / narayanaAntardashas /
// charaStrongerSign). Fixtures: the 12-row sequence table in Rath's Upadesa Sutras (Table 2.7, "10th" rule for dual
// signs) and the ready table in Goel ch.6 ("next sign" rule); Goel's Indira Gandhi and Putin worked examples.
// Usage: node pl7_narayana_test.js
const vm = require('vm'), fs = require('fs');
const src = fs.readFileSync(__dirname + '/www/index.html', 'utf8');
const block = src.slice(src.indexOf('// BEGIN CHARA DASHA'), src.indexOf('// END CHARA DASHA'));
const ctx = { localStorage: { getItem: () => null, setItem() {} } }; vm.createContext(ctx);
vm.runInContext('function norm360(x){ return ((x % 360) + 360) % 360; }\n' + block.replace(/^const /gm, 'var '), ctx);
let fails = 0; const bad = m => { fails++; console.log('FAIL ' + m); };
const S = { Ar:0, Ta:1, Ge:2, Cn:3, Le:4, Vi:5, Li:6, Sc:7, Sg:8, Cp:9, Aq:10, Pi:11 }, N = Object.keys(S);
const RATH = ['1 2 3 4 5 6 7 8 9 10 11 12', '2 9 4 11 6 1 8 3 10 5 12 7', '3 11 7 6 2 10 9 5 1 12 8 4', '4 3 2 1 12 11 10 9 8 7 6 5',
  '5 10 3 8 1 6 11 4 9 2 7 12', '6 10 2 3 7 11 12 4 8 9 1 5', '7 8 9 10 11 12 1 2 3 4 5 6', '8 3 10 5 12 7 2 9 4 11 6 1',
  '9 5 1 12 8 4 3 11 7 6 2 10', '10 9 8 7 6 5 4 3 2 1 12 11', '11 4 9 2 7 12 5 10 3 8 1 6', '12 4 8 9 1 5 6 10 2 3 7 11'];
RATH.forEach((row, i) => { const got = ctx.narayanaSequence(i, 'tenth').map(x => x + 1).join(' '); if (got !== row) bad(`Rath ${N[i]}: ${got} != ${row}`); });
const GOEL = { Ta:'Ta Sg Cn Aq Vi Ar Sc Ge Cp Le Pi Li', Ge:'Ge Aq Li Ta Cp Vi Ar Sg Le Pi Sc Cn', Cn:'Cn Ge Ta Ar Pi Aq Cp Sg Sc Li Vi Le',
  Le:'Le Cp Ge Sc Ar Vi Aq Cn Sg Ta Li Pi', Vi:'Vi Cp Ta Li Aq Ge Sc Pi Cn Sg Ar Le', Sc:'Sc Ge Cp Le Pi Li Ta Sg Cn Aq Vi Ar',
  Sg:'Sg Le Ar Sc Cn Pi Li Ge Aq Vi Ta Cp', Cp:'Cp Sg Sc Li Vi Le Cn Ge Ta Ar Pi Aq', Aq:'Aq Cn Sg Ta Li Pi Le Cp Ge Sc Ar Vi',
  Pi:'Pi Cn Sc Ar Le Sg Ta Vi Cp Ge Li Aq' };
for (const k in GOEL){ const got = ctx.narayanaSequence(S[k], 'next').map(x => N[x]).join(' '); if (got !== GOEL[k]) bad(`Goel ${k}: ${got} != ${GOEL[k]}`); }
// Gandhi (Goel starts from Capricorn, the 7th): years and order as printed, K.N. Rao years.
const mk = (asc, pl) => { const p = { _ascSidereal: S[asc[0]] * 30 + asc[1] }; for (const g in pl) p[g] = { sidereal: S[pl[g][0]] * 30 + pl[g][1] }; return p; };
const ig = mk(['Cn', 27.37], { Sun:['Sc',4.12], Moon:['Cp',5.58], Mars:['Le',16.37], Mercury:['Sc',13.22], Jupiter:['Ta',15.0],
  Venus:['Sg',21.0], Saturn:['Cn',21.78], Rahu:['Sg',9.2], Ketu:['Ge',9.2] });
const rao = { method: 'rao', antar: 'next', rahuEx: 'taurus', mercEx: 'degree' };
const md = ctx.narayanaMahadashas(ig, 0, 365.25, rao, { start: 'seventh', dual: 'tenth', antar: 'lord' }, 1).slice(0, 12);
const seq = md.map(r => N[r.sign]).join(' '), yrs = md.map(r => r.years).join(' ');
if (seq !== 'Cp Sg Sc Li Vi Le Cn Ge Ta Ar Pi Aq') bad('Gandhi Narayana order ' + seq);
if (yrs !== '6 5 9 2 10 9 6 5 7 4 10 2') bad('Gandhi Narayana years ' + yrs);
// Ordinal strength: Saturn (Atmakaraka, 21°47') sits in Cancer, so the rule-based start is the Lagna, unlike Goel's numeric score.
const st = ctx.narayanaStart(ig, rao, { start: 'stronger' });
if (st.sign !== S.Cn || st.rule !== 'ak') bad(`Gandhi stronger start ${N[st.sign]} by ${st.rule}`);
// Antardashas (Goel, Putin): Capricorn MD with Saturn in Virgo -> Virgo, Libra ... Leo (forward, Virgo's 9th is Taurus).
const fakeMd = { sign: S.Cp, target: S.Vi, startJD: 0, endJD: 4 * 365.25 };
const ad = ctx.narayanaAntardashas(fakeMd, ig, rao, { antar: 'lord' }).map(a => N[a.sign]).join(' ');
if (ad !== 'Vi Li Sc Sg Cp Aq Pi Ar Ta Ge Cn Le') bad('Putin Capricorn antardashas ' + ad);
// Ladder unit checks on hand charts.
const h = mk(['Ar', 1], { Sun:['Ar',5], Moon:['Li',3], Mars:['Li',4], Mercury:['Ta',2], Jupiter:['Cn',6], Venus:['Pi',7], Saturn:['Li',29], Rahu:['Ge',1], Ketu:['Sg',1] });
let r = ctx.charaStrongerSign(S.Ar, S.Li, h, rao); if (r.sign !== S.Li || r.rule !== 'ak') bad(`AK rule ${N[r.sign]} ${r.rule}`); // Saturn 29° = AK in Libra
const h2 = mk(['Ar', 1], { Sun:['Ar',5], Moon:['Li',3], Mars:['Li',4], Mercury:['Ta',2], Jupiter:['Cn',6], Venus:['Pi',7], Saturn:['Cp',29], Rahu:['Ge',1], Ketu:['Sg',1] });
r = ctx.charaStrongerSign(S.Ar, S.Li, h2, rao); if (r.sign !== S.Li || r.rule !== 'planets') bad(`planets rule ${N[r.sign]} ${r.rule}`);
r = ctx.charaStrongerSign(S.Cn, S.Pi, h2, rao); if (r.sign !== S.Pi || r.rule !== 'nature') bad(`both exalted -> sign type ${N[r.sign]} ${r.rule}`);
r = ctx.charaStrongerSign(S.Cn, S.Ta, h2, rao); if (r.sign !== S.Cn || r.rule !== 'exalted') bad(`exalted rule ${N[r.sign]} ${r.rule}`);
console.log(fails ? `${fails} failure(s)` : 'PASS — Rath Table 2.7 (12 rows), Goel ready table (10 rows), Gandhi order+years, AK start rule, Putin antardashas, ladder');
process.exit(fails ? 1 : 0);
