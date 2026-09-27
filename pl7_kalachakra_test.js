// Kalachakra test (www/index.html CHARA DASHA block: kcdPada / kcdMahadashas / kcdAntardashas).
// Fixtures from BPHS ch.46 (Santhanam): every pada's Deha/Jeeva pair, the nine-sign runs that the translation prints
// cleanly, the pada totals 100/85/83/86, group membership; plus balance and continuation checks.
// Usage: node pl7_kalachakra_test.js
const vm = require('vm'), fs = require('fs');
const src = fs.readFileSync(__dirname + '/www/index.html', 'utf8');
const block = src.slice(src.indexOf('// BEGIN CHARA DASHA'), src.indexOf('// END CHARA DASHA'));
const ctx = { localStorage: { getItem: () => null, setItem() {} } }; vm.createContext(ctx);
vm.runInContext('function norm360(x){ return ((x % 360) + 360) % 360; }\n' + block.replace(/^const /gm, 'var '), ctx);
let fails = 0; const bad = m => { fails++; console.log('FAIL ' + m); };
const N = ['Ar','Ta','Ge','Cn','Le','Vi','Li','Sc','Sg','Cp','Aq','Pi'];
const pada = (nak, p) => ctx.kcdPada(nak * 4 + p - 1);
const DJ = { 0:['Ar Sg','Cp Ge','Ta Ge','Cn Pi'], 1:['Sc Pi','Aq Vi','Li Vi','Cn Sg'], 3:['Cn Sg','Li Vi','Aq Vi','Sc Pi'], 4:['Cn Pi','Ta Ge','Cp Ge','Ar Sg'] };
for (const nak in DJ) DJ[nak].forEach((dj, i) => { const q = pada(+nak, i + 1), got = N[q.deha] + ' ' + N[q.jeeva]; if (got !== dj) bad(`nak ${nak} pada ${i + 1} deha/jeeva ${got} != ${dj}`); });
const RUN = [[0,3,'Ta Ar Pi Aq Cp Sg Ar Ta Ge'], [0,4,'Cn Le Vi Li Sc Sg Cp Aq Pi'], [1,1,'Sc Li Vi Cn Le Ge Ta Ar Pi'], [1,2,'Aq Cp Sg Ar Ta Ge Cn Le Vi'],
  [1,3,'Li Sc Sg Cp Aq Pi Sc Li Vi'], [1,4,'Cn Le Ge Ta Ar Pi Aq Cp Sg'], [3,3,'Vi Le Cn Ge Ta Ar Sg Cp Aq'], [3,4,'Pi Ar Ta Ge Le Cn Vi Li Sc'],
  [4,1,'Pi Aq Cp Sg Sc Li Vi Le Cn'], [4,3,'Ge Le Cn Vi Li Sc Pi Aq Cp'], [4,4,'Sg Sc Li Vi Le Cn Ge Ta Ar']];
RUN.forEach(([n, p, want]) => { const got = pada(n, p).signs.map(s => N[s]).join(' '); if (got !== want) bad(`nak ${n} pada ${p}: ${got} != ${want}`); });
for (let k = 0; k < 108; k++){ const q = ctx.kcdPada(k), want = (q.savya ? [100, 85, 83, 86] : [86, 83, 85, 100])[k % 4]; if (q.total !== want) bad(`pada ${k} total ${q.total} != ${want}`); }
// Group membership: same runs as the group's first star.
[[6,0],[2,0],[26,0],[7,1],[25,1],[9,3],[21,3],[5,4],[23,4]].forEach(([n, g]) => { for (let p = 1; p <= 4; p++) if (pada(n, p).signs.join() !== pada(g, p).signs.join()) bad(`star ${n} pada ${p} should match star ${g}`); });
// Balance: Moon halfway through Ashwini pada 1 (100 y) -> 50 y elapsed: Ar 7, Ta 16, Ge 9 (32) passed, Cancer runs 21 - 18 = 3 y.
const mds = ctx.kcdMahadashas(40 / 24, 0, 365.25, { cont: 'next' }, 200);
if (N[mds[0].sign] !== 'Cn' || Math.abs(mds[0].years - 3) > 1e-9) bad(`balance: ${N[mds[0].sign]} ${mds[0].years}`);
if (N[mds[6].sign] !== 'Cp' || mds[6].pada.padaIdx !== 1) bad('continuation should enter pada 2 (Capricorn first)');
const same = ctx.kcdMahadashas(40 / 24, 0, 365.25, { cont: 'same' }, 200);
if (N[same[6].sign] !== 'Ar' || same[6].pada.padaIdx !== 0) bad('repeat mode should restart the birth pada');
// Antardashas: Cancer MD in Ashwini pada 1 (21 y) -> Cn Le Vi Li Sc Sg Ar Ta Ge, Cancer = 21*21/100 y; partial first MD drops passed parts.
const full = { sign: 3, pada: ctx.kcdPada(0), years: 21, fullYears: 21, startJD: 0, endJD: 21 * 365.25 };
const ad = ctx.kcdAntardashas(full);
if (ad.map(a => N[a.sign]).join(' ') !== 'Cn Le Vi Li Sc Sg Ar Ta Ge') bad('antardasha order ' + ad.map(a => N[a.sign]).join(' '));
if (Math.abs(ad[0].endJD - 21 * 21 / 100 * 365.25) > 1e-6) bad('antardasha length');
if (Math.abs(ad[8].endJD - 21 * 365.25) > 1e-6) bad('antardashas should fill the MD');
console.log(fails ? `${fails} failure(s)` : 'PASS — 16 Deha/Jeeva pairs, 11 printed runs, 108 pada totals, group membership, balance, continuation, antardashas');
process.exit(fails ? 1 : 0);
