// Unit checks for shadbala.js, anchored to numbers stated in the Shadbala texts.
// Usage: node pl7_shadbala_test.js
const m = require('./shadbala.js');
let fail = 0;
const ok = (name, cond, extra) => { if (!cond) { fail++; console.log('FAIL', name, extra === undefined ? '' : extra); } else console.log('ok  ', name); };
const near = (a, b, t = 1e-6) => Math.abs(a - b) <= t;

// Drik Bala aspect table anchors (textbook: 30->0, 60->15, 90->45, 120->30, 150->0, 180->60, 300->0)
[[29,0],[30,0],[60,15],[90,45],[120,30],[150,0],[180,60],[240,30],[300,0],[330,0]].forEach(([d,e]) => ok('aspect ' + d, near(m.sbAspectValue(d), e), m.sbAspectValue(d)));

// required minimums: the two published sets total 41.5 and 40 Rupas
const tot = () => Object.values(m.SB_REQUIRED_RUPAS).reduce((a,b) => a+b, 0);
m.sbSetRequiredSet('pl7'); ok('required set pl7 total 41.5', near(tot(), 41.5));
m.sbSetRequiredSet('jayasekhar'); ok('required set jayasekhar total 40 (=2400 Virupas)', near(tot(), 40));
m.sbSetRequiredSet('pl7');

// Mooltrikona ranges (BPHS 3.51-54) and exaltation points (Shadbala text, zodiacal longitude)
ok('MT Moon Taurus 3-30', m.SB_MOOLATRIKONA.Moon.from === 3 && m.SB_MOOLATRIKONA.Moon.to === 30);
ok('MT Mercury Virgo 15-20', m.SB_MOOLATRIKONA.Mercury.from === 15 && m.SB_MOOLATRIKONA.Mercury.to === 20);
const SIGNS = m.SB_SIGNS; const exalt = { Sun: 10, Moon: 33, Mars: 298, Mercury: 165, Jupiter: 95, Venus: 357, Saturn: 200 };
Object.keys(exalt).forEach(g => ok('exaltation point ' + g, SIGNS.indexOf(m.SB_EXALT[g].sign) * 30 + m.SB_EXALT[g].deg === exalt[g]));

// Vara / Hora
ok('vara 45 to weekday lord', m.sbVaraBala('Sun', { weekdayLord: 'Sun' }) === 45 && m.sbVaraBala('Moon', { weekdayLord: 'Sun' }) === 0);
ok('hora 60 to hora lord', m.sbHoraBala('Moon', { horaLord: 'Moon' }) === 60);

// Ayana: at the summer solstice (tropical 90) declination is +23.45 north: the Sun's value is the
// maximum 60, doubled to 120; the Moon and Saturn take the plus sign for south, so they get 0.
ok('declination at solstice ~23.45', near(m.sbDeclination(90), 23 + 27/60, 0.02), m.sbDeclination(90));
const kc = { isDayBirth: true, fractionSinceLastMidnightOrNoon: 0.5, elongation: 90, dayFraction: 0.5, sunSiderealLong: 66,
  tropicalLong: { Sun: 90, Moon: 90, Mars: 90, Mercury: 90, Jupiter: 90, Venus: 90, Saturn: 90 }, weekdayLord: 'Sun', horaLord: 'Sun', mercuryBenefic: true };
ok('Ayana Sun at solstice = 120', near(m.sbKalaBala('Sun', kc).ayana, 120, 0.05), m.sbKalaBala('Sun', kc).ayana);
ok('Ayana Moon at solstice = 0', near(m.sbKalaBala('Moon', kc).ayana, 0, 0.05), m.sbKalaBala('Moon', kc).ayana);
ok('Ayana Mars at solstice = 60', near(m.sbKalaBala('Mars', kc).ayana, 60, 0.05), m.sbKalaBala('Mars', kc).ayana);
// Paksha: elongation 90 -> benefics 30, malefics 30, Moon doubled 60; elongation 180 -> benefic 60
ok('Paksha benefic 30 at 90', near(m.sbKalaBala('Jupiter', kc).paksha, 30));
ok('Paksha Moon doubled 60 at 90', near(m.sbKalaBala('Moon', kc).paksha, 60));
ok('Paksha malefic at full moon = 0', near(m.sbKalaBala('Saturn', Object.assign({}, kc, { elongation: 180 })).paksha, 0));

// End-to-end sanity on a synthetic chart: values finite and ratio consistent with totals
const pos = { _ascSidereal: 100, Sun:{sidereal:200,tropical:224,speed:0.98}, Moon:{sidereal:40,tropical:64,speed:13},
  Mars:{sidereal:300,tropical:324,speed:0.5}, Mercury:{sidereal:190,tropical:214,speed:1.2}, Jupiter:{sidereal:120,tropical:144,speed:0.1},
  Venus:{sidereal:230,tropical:254,speed:1.1}, Saturn:{sidereal:280,tropical:304,speed:-0.05} };
const trop = {}; m.SB_GRAHAS.forEach(g => trop[g] = pos[g].tropical);
const ctx = { isDayBirth: true, fractionSinceLastMidnightOrNoon: 0.6, elongation: 200, dayFraction: 0.4, sunSiderealLong: 200, tropicalLong: trop,
  meanLong: { Mars: 10, Jupiter: 20, Saturn: 30, Mercury: 224, Venus: 224 }, sheeghrochcha: { Mars: 224, Jupiter: 224, Saturn: 224, Mercury: 150, Venus: 160 },
  weekdayLord: 'Mars', horaLord: 'Sun', mcSidereal: 10, isPlanetaryWar: false };
const V = { D1:'Leo', D2:'Leo', D3:'Leo', D7:'Leo', D9:'Leo', D12:'Leo', D30:'Leo' };
m.SB_GRAHAS.forEach(g => {
  const r = m.shadbala(g, pos, V, 200, 3, ctx);
  ok('shadbala finite ' + g, [r.sthana.total, r.dig, r.kala.total, r.cheshta, r.naisargika, r.drik, r.totalVirupa, r.ratio].every(Number.isFinite));
  ok('ratio = rupas/required ' + g, near(r.ratio, r.totalRupas / r.requiredRupas));
  ok('dig within 0..60 ' + g, r.dig >= 0 && r.dig <= 60, r.dig);
  ok('cheshta within 0..120 ' + g, r.cheshta >= 0 && r.cheshta <= 120, r.cheshta);
});
console.log(fail ? fail + ' FAILED' : 'ALL PASSED');
process.exit(fail ? 1 : 0);
