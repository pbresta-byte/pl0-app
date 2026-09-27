/* PL7 yoga rules — Nabhasa, Mahapurusha, Chandra, Surya, bhava series, lordship Raja/Dhana,
 * Parivartana, conjunctions, Raja 266-310, Dhana 311-348, Vaiseshikamsa yogas.
 * Literal translation of tools/yoga_rules.py (research workspace copy); keep in lock-step. */
(function (E) {
'use strict';
const { mod, S, any, all, sum, union, inter, minus, range, setEq,
  LORD, EXALT, SEVEN, OWN, NAT_FRIENDS, MOD, KENDRA, TRIKONA, DUSTHANA, PANAPHARA, APOKLIMA, UPACHAYA, KT, DEEP, MOOLA,
  NODE_EX, VS, has_title, exalted, debil, own, debil_n, cora, ksign, BEN7, MAL7, benefic_aspect, rule, NOT_IMPL, PARAMS } = E.helpers;
const SEVEN_SET = new Set(SEVEN);

function all_in(c, houses) {
  const pool = SEVEN.concat(PARAMS.akriti_include_nodes ? ['Ra', 'Ke'] : []);
  return all(pool, p => houses.has(c.house[p]));
}
function consecutive_each_occupied(c, start, n = 7) {
  const hs = new Set(range(0, n).map(i => mod(start - 1 + i, 12) + 1));
  return all(SEVEN, p => hs.has(c.house[p])) && all(hs, h => c.in_house(h).length > 0);
}
const NINE_POOL = SEVEN.concat(['Ra', 'Ke']);

// Nabhasa: Ashraya 1-6
for (const [no, m] of [[1, 'chara'], [3, 'sthira'], [5, 'dual']])
  rule(no, 'nabhasa.ashraya', `all 7 grahas in ${m} signs`, c => all(SEVEN, p => MOD[m].has(c.sign[p])));
for (const [no, m] of [[2, 'chara'], [4, 'sthira'], [6, 'dual']])
  rule(no, 'nabhasa.ashraya_variant', `Lagna in a ${m} sign and >= several_planets_min grahas in ${m} signs`,
    c => MOD[m].has(c.asc) && sum(SEVEN, p => MOD[m].has(c.sign[p])) >= PARAMS.several_planets_min,
    { params: ['several_planets_min'], nabhasa_for_sankhya: false });
rule(7, 'nabhasa.dala', 'benefics in 3 kendras and no malefic in any kendra',
  c => sum(KENDRA, h => any(c.in_house(h, NINE_POOL), p => c.benefics().has(p))) >= 3
    && !any(KENDRA, h => any(c.in_house(h, NINE_POOL), p => c.malefics().has(p))));
rule(8, 'nabhasa.dala', 'malefics in 3 kendras and no benefic in any kendra',
  c => sum(KENDRA, h => any(c.in_house(h, NINE_POOL), p => c.malefics().has(p))) >= 3
    && !any(KENDRA, h => any(c.in_house(h, NINE_POOL), p => c.benefics().has(p))));
for (const [no, hs] of [[9, S(1, 4)], [10, S(4, 7)], [11, S(7, 10)], [12, S(10, 1)]])
  rule(no, 'nabhasa.akriti.gada', 'all 7 grahas within two adjacent kendras', c => all_in(c, hs));
rule(13, 'nabhasa.akriti', 'all 7 grahas in houses 1 and 7', c => all_in(c, S(1, 7)));
rule(14, 'nabhasa.akriti', 'all 7 grahas in houses 4 and 10 (vihaga_mode)',
  c => PARAMS.vihaga_mode === 'houses_4_and_10' ? all_in(c, S(4, 10)) : all_in(c, new Set(range(4, 11))), { params: ['vihaga_mode'] });
const vajraJoin = (a, b) => PARAMS.vajra_join === 'and' ? (a && b) : (a || b);
rule(15, 'nabhasa.akriti', 'benefics only in 1 & 7 [and|or] malefics only in 4 & 10 (vajra_join)',
  c => vajraJoin(all(BEN7(c), p => [1, 7].includes(c.house[p])), all(MAL7(c), p => [4, 10].includes(c.house[p]))), { params: ['vajra_join'] });
rule(16, 'nabhasa.akriti', 'benefics only in 4 & 10 [and|or] malefics only in 1 & 7',
  c => vajraJoin(all(BEN7(c), p => [4, 10].includes(c.house[p])), all(MAL7(c), p => [1, 7].includes(c.house[p]))), { params: ['vajra_join'] });
rule(17, 'nabhasa.akriti', 'all 7 grahas in kendras', c => all_in(c, KENDRA));
rule(18, 'nabhasa.akriti', 'all 7 grahas outside kendras', c => all_in(c, union(PANAPHARA, APOKLIMA)));
rule(19, 'nabhasa.akriti', 'all 7 grahas in panapharas', c => all_in(c, PANAPHARA));
rule(20, 'nabhasa.akriti', 'all 7 grahas in apoklimas', c => all_in(c, APOKLIMA));
rule(21, 'nabhasa.akriti', 'all 7 grahas in 1, 5, 9', c => all_in(c, TRIKONA));
for (const [no, hs] of [[22, S(2, 6, 10)], [23, S(3, 7, 11)], [24, S(4, 8, 12)]])
  rule(no, 'nabhasa.akriti.hala', `all 7 grahas in ${[...hs].join(', ')}`, c => all_in(c, hs));
for (const [no, st] of [[25, 1], [26, 4], [27, 7], [28, 10]])
  rule(no, 'nabhasa.akriti.yupa_set', `all 7 grahas within the 4 houses from ${st}`, c => all_in(c, new Set(range(0, 4).map(i => mod(st - 1 + i, 12) + 1))));
for (const [no, st] of [[29, 1], [30, 4], [31, 7], [32, 10]])
  rule(no, 'nabhasa.akriti.nauka_set', `7 grahas in 7 continuous houses from ${st}, each occupied`, c => consecutive_each_occupied(c, st));
for (const [no, st] of [[33, 2], [34, 5], [35, 8], [36, 11], [37, 3], [38, 6], [39, 9], [40, 12]])
  rule(no, 'nabhasa.akriti.ardha_chandra', `7 grahas in 7 continuous houses from ${st} (non-kendra start), each occupied`, c => consecutive_each_occupied(c, st));
rule(41, 'nabhasa.akriti', 'grahas occupy the six odd houses (each occupied)', c => all_in(c, S(1, 3, 5, 7, 9, 11)) && all([1, 3, 5, 7, 9, 11], h => c.in_house(h).length > 0));
rule(42, 'nabhasa.akriti', 'grahas occupy the six even houses (each occupied)', c => all_in(c, S(2, 4, 6, 8, 10, 12)) && all([2, 4, 6, 8, 10, 12], h => c.in_house(h).length > 0));
for (let i = 0; i < 7; i++) {
  const no = 43 + i, n = i + 1;
  rule(no, 'nabhasa.sankhya', `the 7 grahas occupy exactly ${n} sign(s); void if another Nabhasa yoga forms`,
    c => new Set(SEVEN.concat(PARAMS.sankhya_include_nodes ? ['Ra', 'Ke'] : []).map(p => c.sign[p])).size === n,
    { cancellation: 'sankhya_cancelled_by_other_nabhasa', params: ['sankhya_cancelled_by_other_nabhasa'] });
}
for (let i = 0; i < 12; i++) {
  const no = 187 + i, st = i + 1;
  rule(no, 'nabhasa_like.malika', `7 grahas in 7 consecutive houses starting with house ${st}, each occupied`, c => consecutive_each_occupied(c, st));
}

// Pancha Mahapurusha 50-64
for (const [base, p] of [[50, 'Ma'], [53, 'Me'], [56, 'Ju'], [59, 'Ve'], [62, 'Sa']]) {
  const core = c => KENDRA.has(c.house[p]) && c.dignity_own_or_exalt(p);
  rule(base, 'pancha_mahapurusha', `${p} in a kendra from Lagna in own or exaltation sign`, core);
  rule(base + 1, 'pancha_mahapurusha.modified', `as ${base}, and ${p} conjunct Sun or Moon`, c => core(c) && (c.conj(p, 'Su') || c.conj(p, 'Mo')));
  rule(base + 2, 'pancha_mahapurusha.modified', `as ${base}, and Sun and Moon both below strong_ratio`, c => core(c) && !c.strong('Su') && !c.strong('Mo'), { params: ['strong_ratio'] });
}

// Chandra yogas 65-123
rule(65, 'chandra.gaja_kesari', 'Jupiter in a kendra from the Moon (incl. conjunct)', c => KENDRA.has(c.from_ref('Ju', 'Mo')));
for (const [no, h] of [[66, 1], [67, 4], [68, 7], [69, 10]])
  rule(no, 'chandra.gaja_kesari', `Jupiter in house ${h} from the Moon`, c => c.from_ref('Ju', 'Mo') === h);
for (const [no, h] of [[70, 1], [71, 4], [72, 7], [73, 9], [74, 10]])
  rule(no, 'chandra.gaja_kesari', `Jupiter and Moon together in house ${h}`, c => c.house.Ju === h && c.house.Mo === h);
rule(75, 'chandra.adhi', 'benefics occupy 6, 7 and 8 from the Moon (each occupied by a benefic)',
  c => all([6, 7, 8], h => any(minus(c.benefics(), S('Mo')), p => c.from_ref(p, 'Mo') === h)));
const POOL = () => SEVEN.concat(PARAMS.nodes_count_as_planets_for_moon_sun_yogas ? ['Ra', 'Ke'] : []);
const notSuMo = p => p !== 'Su' && p !== 'Mo';
rule(76, 'chandra.sunapha', 'a graha other than the Sun in the 2nd from the Moon', c => any(POOL().filter(notSuMo), p => c.from_ref(p, 'Mo') === 2), { params: ['nodes_count_as_planets_for_moon_sun_yogas'] });
for (const [no, p] of [[77, 'Ma'], [78, 'Me'], [79, 'Ju'], [80, 'Ve'], [81, 'Sa']])
  rule(no, 'chandra.sunapha', `${p} in the 2nd from the Moon`, c => c.from_ref(p, 'Mo') === 2);
rule(82, 'chandra.anapha', 'a graha other than the Sun in the 12th from the Moon', c => any(POOL().filter(notSuMo), p => c.from_ref(p, 'Mo') === 12), { params: ['nodes_count_as_planets_for_moon_sun_yogas'] });
for (const [no, p] of [[83, 'Ma'], [84, 'Me'], [85, 'Ju'], [86, 'Ve'], [87, 'Sa']])
  rule(no, 'chandra.anapha', `${p} in the 12th from the Moon`, c => c.from_ref(p, 'Mo') === 12);
rule(88, 'chandra.durudhara', 'grahas other than the Sun in both the 2nd and 12th from the Moon',
  c => any(POOL().filter(notSuMo), p => c.from_ref(p, 'Mo') === 2) && any(POOL().filter(notSuMo), p => c.from_ref(p, 'Mo') === 12));
const PAIRS = [['Ma', 'Me'], ['Ma', 'Me'], ['Ma', 'Ju'], ['Ma', 'Ve'], ['Ma', 'Ve'], ['Ma', 'Sa'], ['Ma', 'Sa'], ['Me', 'Ju'], ['Me', 'Ve'], ['Me', 'Sa'], ['Ju', 'Ve'], ['Ju', 'Sa'], ['Ve', 'Sa']];
PAIRS.forEach(([a, b], i) => rule(89 + i, 'chandra.durudhara', `${a} and ${b} in the 2nd and 12th from the Moon (either way round)`,
  c => setEq(S(c.from_ref(a, 'Mo'), c.from_ref(b, 'Mo')), S(2, 12))));
const kem = c => !any(SEVEN.filter(notSuMo), p => [2, 12].includes(c.from_ref(p, 'Mo')));
rule(102, 'chandra.kemadruma', 'no graha except the Sun in the 2nd and 12th from the Moon', kem);
rule(103, 'chandra.kemadruma_cancellation', 'as 102, and grahas in a kendra from Lagna', c => kem(c) && any(SEVEN.filter(p => p !== 'Mo'), p => KENDRA.has(c.house[p])));
rule(104, 'chandra.kemadruma_cancellation', 'as 102, and grahas in a kendra from the Moon', c => kem(c) && any(SEVEN.filter(p => p !== 'Mo'), p => KENDRA.has(c.from_ref(p, 'Mo'))));
rule(106, 'chandra.kemadruma_cancellation', 'as 102, and Moon or Venus in a kendra aspected by Jupiter',
  c => kem(c) && any(['Mo', 'Ve'], q => KENDRA.has(c.house[q]) && c.aspects('Ju', c.sign[q])));
rule(108, 'chandra.kemadruma_cancellation', 'as 102, and Moon with a benefic or aspected by Jupiter',
  c => kem(c) && (any(minus(c.benefics(), S('Mo')), b => c.conj('Mo', b)) || c.aspects('Ju', c.sign.Mo)));
rule(110, 'chandra.kemadruma_cancellation', 'as 102, and Moon in Lagna conjunct a benefic', c => kem(c) && c.house.Mo === 1 && any(minus(c.benefics(), S('Mo')), b => c.conj('Mo', b)));
rule(111, 'chandra.kemadruma_cancellation', 'as 102, and Moon exalted in the 10th aspected by a benefic',
  c => kem(c) && c.house.Mo === 10 && c.sign.Mo === EXALT.Mo && any(minus(c.benefics(), S('Mo')), b => c.aspects(b, c.sign.Mo)));
const TEMP_FRIEND_HOUSES = S(2, 3, 4, 10, 11, 12);
const great_friend_of_moon = (c, lord) => lord !== 'Mo' && NAT_FRIENDS.Mo.has(lord) && TEMP_FRIEND_HOUSES.has(c.from_ref(lord, 'Mo'));
rule(105, 'chandra.kemadruma_cancellation', 'as 102, and every other graha (Su..Sa) aspects the Moon', c => kem(c) && all(SEVEN.filter(p => p !== 'Mo'), p => c.aspects(p, c.sign.Mo)));
rule(107, 'chandra.kemadruma_cancellation', 'as 102, and a strong Moon in a kendra, conjunct or aspected by a benefic',
  c => kem(c) && c.strong('Mo') && KENDRA.has(c.house.Mo) && any(minus(c.benefics(), S('Mo')), b => c.conj('Mo', b) || c.aspects(b, c.sign.Mo)), { params: ['strong_ratio'] });
rule(109, 'chandra.kemadruma_cancellation', "as 102, and the Moon's navamsha sign is its exaltation or a natural friend's sign, and Jupiter aspects the natal Moon",
  c => kem(c) && (c.d9('Mo') === EXALT.Mo || NAT_FRIENDS.Mo.has(LORD[c.d9('Mo')])) && c.aspects('Ju', c.sign.Mo));
rule(112, 'chandra.kemadruma_cancellation', 'as 102, and Mars and Jupiter in Libra, Sun in Virgo, Moon in Aries',
  c => kem(c) && c.sign.Ma === 6 && c.sign.Ju === 6 && c.sign.Su === 5 && c.sign.Mo === 0);
rule(118, 'chandra.dhanadhana', 'day birth: Moon in its own navamsha (Cancer) or that of a great friend (adhimitra), aspected by Jupiter',
  c => c.day_birth === true && (c.d9('Mo') === 3 || great_friend_of_moon(c, LORD[c.d9('Mo')])) && c.aspects('Ju', c.sign.Mo));
rule(119, 'chandra.dhanadhana', 'night birth: Moon in its own navamsha or that of a great friend, aspected by Venus',
  c => c.day_birth === false && (c.d9('Mo') === 3 || great_friend_of_moon(c, LORD[c.d9('Mo')])) && c.aspects('Ve', c.sign.Mo));
rule(123, 'chandra.shakata_cancellation', 'Jupiter, not in a kendra from Lagna, in the 12th from the Moon and aspecting house 6',
  c => !KENDRA.has(c.house.Ju) && c.from_ref('Ju', 'Mo') === 12 && c.aspects('Ju', mod(c.asc + 5, 12)));
rule(113, 'chandra.vasumat', 'Mercury, Venus and Jupiter all in upachayas from the Moon', c => all(['Me', 'Ve', 'Ju'], p => UPACHAYA.has(c.from_ref(p, 'Mo'))));
rule(114, 'chandra.vasumat', 'Moon, Mercury, Venus and Jupiter all in upachayas from Lagna', c => all(['Mo', 'Me', 'Ve', 'Ju'], p => UPACHAYA.has(c.house[p])));
for (const [no, s] of [[115, KENDRA], [116, PANAPHARA], [117, APOKLIMA]])
  rule(no, 'chandra.uttamadi', `Moon in house ${[...s].join(', ')} from the Sun`, c => s.has(c.from_ref('Mo', 'Su')));
for (const [no, h] of [[120, 6], [121, 8], [122, 12]])
  rule(no, 'chandra.shakata', `Jupiter, not in a kendra from Lagna, in house ${h} from the Moon`, c => !KENDRA.has(c.house.Ju) && c.from_ref('Ju', 'Mo') === h);

// Surya yogas 124-141, 869
const SPOOL = () => POOL().filter(notSuMo);
rule(124, 'surya.veshi', 'a graha other than the Moon in the 2nd from the Sun', c => any(SPOOL(), p => c.from_ref(p, 'Su') === 2));
rule(125, 'surya.veshi', 'a benefic (not Moon) in the 2nd from the Sun', c => any(SPOOL().filter(p => c.benefics().has(p)), p => c.from_ref(p, 'Su') === 2));
rule(126, 'surya.veshi', 'a malefic (not Moon) in the 2nd from the Sun', c => any(SPOOL().filter(p => c.malefics().has(p)), p => c.from_ref(p, 'Su') === 2));
for (const [no, p] of [[127, 'Ma'], [128, 'Me'], [129, 'Ju'], [130, 'Ve'], [131, 'Sa']])
  rule(no, 'surya.veshi', `${p} in the 2nd from the Sun`, c => c.from_ref(p, 'Su') === 2);
rule(132, 'surya.voshi', 'a graha other than the Moon in the 12th from the Sun', c => any(SPOOL(), p => c.from_ref(p, 'Su') === 12));
rule(133, 'surya.voshi', 'a benefic (not Moon) in the 12th from the Sun', c => any(SPOOL().filter(p => c.benefics().has(p)), p => c.from_ref(p, 'Su') === 12));
rule(134, 'surya.voshi', 'a malefic (not Moon) in the 12th from the Sun', c => any(SPOOL().filter(p => c.malefics().has(p)), p => c.from_ref(p, 'Su') === 12));
for (const [no, p] of [[135, 'Ma'], [136, 'Me'], [137, 'Ju'], [138, 'Ve'], [139, 'Sa'], [140, 'Sa']])
  rule(no, 'surya.voshi', `${p} in the 12th from the Sun`, c => c.from_ref(p, 'Su') === 12);
rule(141, 'surya.ubhayachari', 'grahas other than the Moon in both the 2nd and 12th from the Sun',
  c => any(SPOOL(), p => c.from_ref(p, 'Su') === 2) && any(SPOOL(), p => c.from_ref(p, 'Su') === 12));
rule(869, 'surya.ubhayachari', 'only malefics in the 2nd and 12th from the Sun (both occupied)',
  c => all(SPOOL().filter(p => [2, 12].includes(c.from_ref(p, 'Su'))), p => c.malefics().has(p))
    && any(SPOOL(), p => c.from_ref(p, 'Su') === 2) && any(SPOOL(), p => c.from_ref(p, 'Su') === 12));

// Bhava series 153-173
const auspicious_house = h => PARAMS.auspicious_house_for_bhava_series === 'not_dusthana' ? !DUSTHANA.has(h) : KT.has(h);
for (let h = 1; h <= 12; h++)
  rule(152 + h, 'bhava.benefic_series', `benefics occupy or aspect house ${h}; L${h} not combust, in an auspicious house, in own or exaltation sign`,
    c => any([...c.benefics()].filter(b => SEVEN_SET.has(b)), b => c.house[b] === h || c.aspects(b, mod(c.asc + h - 1, 12)))
      && !c.combust(c.lord_of(h)) && auspicious_house(c.house[c.lord_of(h)]) && c.dignity_own_or_exalt(c.lord_of(h)),
    { params: ['auspicious_house_for_bhava_series'] });
[1, 2, 3, 4, 5, 7, 9, 10, 11].forEach((h, i) =>
  rule(165 + i, 'bhava.dusthana_series', `L${h} in house 6, 8 or 12`, c => DUSTHANA.has(c.house[c.lord_of(h)])));

// Lordship relationships: Raja 257-265, Dhana 327-330
for (const [no, a, bs] of [[257, 1, [4, 5, 7, 9, 10]], [258, 4, [5, 9]], [259, 5, [7, 10]], [260, 7, [9]], [261, 9, [10]],
  [327, 1, [2, 5, 9, 11]], [328, 2, [5, 9, 11]], [329, 5, [9, 11]], [330, 9, [11]]])
  rule(no, no < 300 ? 'raja.lord_relationship' : 'dhana.lord_relationship', `L${a} related to L${bs.join('/L')} (relationship_types)`,
    c => any(bs, b => c.related(c.lord_of(a), c.lord_of(b))), { params: ['relationship_types', 'same_planet_counts_as_relationship'] });
rule(262, 'raja.lord_relationship', 'L5 and L9 conjunct or in mutual aspect',
  c => c.lord_of(5) !== c.lord_of(9) && (c.conj(c.lord_of(5), c.lord_of(9)) || c.mutual_aspect(c.lord_of(5), c.lord_of(9))));
rule(263, 'raja.lord_relationship', 'L4-L10 exchange, joined or aspected by L5 or L9',
  c => c.exchange(c.lord_of(4), c.lord_of(10)) && any([c.lord_of(5), c.lord_of(9)], x => any([c.lord_of(4), c.lord_of(10)], y => x !== y && (c.conj(x, y) || c.aspects(x, c.sign[y])))));
rule(264, 'raja.lord_relationship', 'L4 or L10 conjunct both L5 and L9',
  c => any([c.lord_of(4), c.lord_of(10)], x => c.conj(x, c.lord_of(5)) && c.conj(x, c.lord_of(9))));
rule(265, 'raja.lord_relationship', 'L5 with L1 or L9, placed in house 1, 4 or 10',
  c => [1, 4, 10].includes(c.house[c.lord_of(5)]) && any([1, 9], x => c.conj(c.lord_of(5), c.lord_of(x)) && c.lord_of(x) !== c.lord_of(5)));

// Parivartana 630-640
function exch(c, a, b) {
  const la = c.lord_of(a), lb = c.lord_of(b);
  if (la === lb) return false;
  if (PARAMS.parivartana_mode === 'exact_houses') return c.house[la] === b && c.house[lb] === a;
  return LORD[c.sign[la]] === lb && LORD[c.sign[lb]] === la;
}
for (const [no, a] of [[630, 1], [631, 2], [632, 4], [633, 5], [634, 7], [635, 9], [636, 10]]) {
  const others = [1, 2, 4, 5, 7, 9, 10, 11].filter(h => h > a);
  rule(no, 'parivartana.maha', `L${a} exchanges houses with L of ${others.join(',')}`, c => any(others, b => exch(c, a, b)));
}
for (const [no, a] of [[637, 6], [638, 8], [639, 12]])
  rule(no, 'parivartana.dainya', `L${a} exchanges houses with any other house lord`, c => any(range(1, 13).filter(b => b !== a), b => exch(c, a, b)));
rule(640, 'parivartana.khala', 'L3 exchanges houses with L of 1,2,4,5,7,9,10,11', c => any([1, 2, 4, 5, 7, 9, 10, 11], b => exch(c, 3, b)));

// Conjunctions 875-997 (planet sets from PL7's names; three PL7 duplicates flagged)
const CONJ = 'SuMo SuMa SuMe SuJu SuVe SuSa MoMa MoMe MoMe* MoJu MoVe MoSa MaMe MaJu MaVe MaSa MeJu MeVe MeSa JuVe JuSa VeSa '
  + 'SuMoMa SuMoMe SuMoJu SuMoVe SuMoSa SuMaMe SuMaJu SuMaVe SuMaSa SuMeJu SuMeVe SuMeSa SuJuVe SuJuSa SuVeSa MoMaMe MoMaJu MoMaVe MoMaVe* '
  + 'MoMaSa MoMeJu MoMeVe MoMeSa MoJuVe MoJuSa MoVeSa MaMeJu MaMeJu* MaMeVe MaMeSa MaJuVe MaJuSa MaVeSa MeJuVe MeJuSa MeVeSa JuVeSa '
  + 'SuMoMaMe SuMoMaJu SuMoMaVe SuMoMaSa SuMoMeJu SuMoMeVe SuMoMeSa SuMoJuVe SuMoJuSa SuMoVeSa SuMaMeJu SuMaMeVe SuMaMeSa SuMaJuVe '
  + 'SuMaJuSa SuMaVeSa SuMeJuVe SuMeJuSa SuMeVeSa SuJuVeSa MoMaMeJu MoMaMeVe MoMaMeSa MoMaJuVe MoMaJuSa MoMaVeSa MoMeJuVe MoMeJuSa '
  + 'MoMeVeSa MoJuVeSa MaMeJuVe MaMeJuSa MaMeVeSa MaJuVeSa MeJuVeSa SuMoMaMeJu SuMoMaMeVe SuMoMaMeSa SuMoMaJuVe SuMoMaJuSa SuMoMaVeSa '
  + 'SuMoMeJuVe SuMoMeJuSa SuMoMeVeSa SuMoJuVeSa SuMaMeJuVe SuMaMeJuSa SuMaMeVeSa SuMaJuVeSa SuMeJuVeSa MoMaMeJuVe MoMaMeJuSa '
  + 'MoMaMeVeSa MoMaJuVeSa MoMeJuVeSa MaMeJuVeSa SuMoMaMeJuVe SuMoMaMeJuSa SuMoMaMeVeSa SuMoMaJuVeSa SuMoMeJuVeSa SuMaMeJuVeSa '
  + 'MoMaMeJuVeSa SuMoMaMeJuVeSa';
CONJ.split(' ').forEach((tok, i) => {
  const dup = tok.endsWith('*'); const combo = tok.replace('*', '').match(/../g);
  rule(875 + i, `conjunction.${combo.length}_planets`, `${combo.join('+')} in the same sign`,
    c => (!dup || PARAMS.duplicate_entries_fire) && new Set(combo.map(p => c.sign[p])).size === 1,
    dup ? { unresolved: 'duplicate of an earlier PL7 entry' } : {});
});

// Raja 266-310 and Dhana 311-348
const R = rule;
R(266, 'raja', 'all benefics in kendras and all malefics (7 grahas) in 3, 6, 11', c => all(BEN7(c), b => KENDRA.has(c.house[b])) && all(MAL7(c), m => [3, 6, 11].includes(c.house[m])));
R(269, 'raja', 'Jupiter in own sign conjunct Venus in house 9, or conjunct L5', c => own(c, 'Ju') && ((c.conj('Ju', 'Ve') && c.house.Ju === 9) || (c.lord_of(5) !== 'Ju' && c.conj('Ju', c.lord_of(5)))));
R(270, 'raja', 'Venus conjunct or aspected by Moon or Jupiter (Venus in Lagna per param)', c => (c.house.Ve === 1 || !PARAMS.raja270_require_lagna) && (cora(c, 'Ve', 'Mo') || cora(c, 'Ve', 'Ju')), { params: ['raja270_require_lagna'] });
R(272, 'raja', 'L10 exalted or in own sign aspecting Lagna, and a benefic in a kendra', c => (exalted(c, c.lord_of(10)) || own(c, c.lord_of(10))) && c.aspects(c.lord_of(10), c.asc) && any(BEN7(c), b => KENDRA.has(c.house[b])));
for (const [no, n] of [[273, 'Ra'], [274, 'Ke']])
  R(no, 'raja.nodes', `${n} in a kendra or trikona conjunct a kendra or trikona lord`, c => KT.has(c.house[n]) && any(KT, h => c.conj(n, c.lord_of(h))));
for (const [no, h] of [[275, 6], [276, 8], [277, 12]])
  R(no, 'raja.viparita', `L${h} in house 6, 8 or 12`, c => DUSTHANA.has(c.house[c.lord_of(h)]));
R(278, 'raja', 'Mercury exalted in a kendra', c => exalted(c, 'Me') && KENDRA.has(c.house.Me));
R(279, 'raja', 'a benefic exalted in a kendra', c => any(BEN7(c), b => exalted(c, b) && KENDRA.has(c.house[b])));
R(280, 'raja.fixed_chart', 'Pisces Lagna and Jupiter in house 10', c => c.asc === 11 && c.house.Ju === 10);
R(281, 'raja.fixed_chart', 'Pisces Lagna, Moon Taurus, Sun Leo, Mercury Virgo, Venus Libra, Jupiter in 10', c => c.asc === 11 && c.sign.Mo === 1 && c.sign.Su === 4 && c.sign.Me === 5 && c.sign.Ve === 6 && c.house.Ju === 10);
R(282, 'raja.fixed_chart', 'Capricorn Lagna, Mars in Lagna, Moon in Cancer', c => c.asc === 9 && c.house.Ma === 1 && c.sign.Mo === 3);
R(283, 'raja.fixed_chart', 'Libra Lagna, Saturn in Lagna, Moon in Cancer', c => c.asc === 6 && c.house.Sa === 1 && c.sign.Mo === 3);
R(284, 'raja.fixed_chart', 'Libra Lagna; Sun, Saturn and Mercury each conjunct Mars or Moon', c => c.asc === 6 && all(['Su', 'Sa', 'Me'], p => c.conj(p, 'Ma') || c.conj(p, 'Mo')));
for (const no of [285, 286])
  R(no, 'raja.fixed_chart', 'Cancer Lagna; Mercury, Venus, Moon in 11; Jupiter in Lagna; Sun in 10', c => c.asc === 3 && all(['Me', 'Ve', 'Mo'], p => c.house[p] === 11) && c.house.Ju === 1 && c.house.Su === 10);
R(289, 'raja', 'Moon in Lagna, Jupiter in 4, Venus in 10, Saturn exalted or own', c => c.house.Mo === 1 && c.house.Ju === 4 && c.house.Ve === 10 && (exalted(c, 'Sa') || own(c, 'Sa')));
R(290, 'raja.neecha_bhanga_like', 'for a debilitated planet: the lord of its sign, or the planet exalted in that sign, in a kendra from Moon or Lagna',
  c => any(SEVEN.concat(PARAMS.nodes_have_debility ? ['Ra', 'Ke'] : []), d => {
    if (!debil_n(c, d)) return false;
    const exMap = Object.assign({}, EXALT, PARAMS.nodes_have_debility ? NODE_EX : {});
    const qs = new Set([LORD[c.sign[d]]]);
    Object.keys(exMap).forEach(x => { if (exMap[x] === c.sign[d] && x !== d) qs.add(x); });
    return any(qs, q => KENDRA.has(c.house[q]) || KENDRA.has(c.from_ref(q, 'Mo')));
  }));
R(291, 'raja', 'Moon in a kendra other than Lagna, aspected by Jupiter, and strong', c => [4, 7, 10].includes(c.house.Mo) && c.aspects('Ju', c.sign.Mo) && c.strong('Mo'), { params: ['strong_ratio'] });
R(292, 'raja', 'a planet debilitated in rashi but exalted in navamsha', c => any(SEVEN, p => debil(c, p) && c.d9(p) === EXALT[p]));
R(293, 'raja', 'Jupiter in Lagna aspected by L9 and Mercury in a kendra aspected by L11', c => c.house.Ju === 1 && cora(c, 'Ju', c.lord_of(9)) && KENDRA.has(c.house.Me) && cora(c, 'Me', c.lord_of(11)));
R(294, 'raja', 'Jupiter in Lagna aspected by L1 and Mercury in a kendra aspected by L9', c => c.house.Ju === 1 && cora(c, 'Ju', c.lord_of(1)) && KENDRA.has(c.house.Me) && cora(c, 'Me', c.lord_of(9)));
R(295, 'raja', 'Saturn exalted or in moolatrikona sign in a kendra or trikona, aspected by L10', c => (exalted(c, 'Sa') || c.sign.Sa === MOOLA.Sa) && KT.has(c.house.Sa) && cora(c, 'Sa', c.lord_of(10)));
R(296, 'raja', 'Moon with Mars in house 2 or 3, Rahu in 5', c => c.conj('Mo', 'Ma') && [2, 3].includes(c.house.Mo) && c.house.Ra === 5);
R(298, 'raja', 'Jupiter in 5 and in a kendra from Moon; Lagna fixed; L1 in 10', c => c.house.Ju === 5 && KENDRA.has(c.from_ref('Ju', 'Mo')) && MOD.sthira.has(c.asc) && c.house[c.lord_of(1)] === 10);
R(299, 'raja', "lord of the Moon's navamsha sign in a kendra or trikona from Lagna or from Mercury", c => { const q = LORD[c.d9('Mo')]; return KT.has(c.house[q]) || KT.has(c.from_ref(q, 'Me')); });
R(300, 'raja', 'lord of the navamsha of a debilitated planet in a kendra or trikona from a movable Lagna, L1 also in a movable sign',
  c => MOD.chara.has(c.asc) && MOD.chara.has(c.sign[c.lord_of(1)]) && any(SEVEN, d => debil(c, d) && KT.has(c.house[LORD[c.d9(d)]])));
R(301, 'raja', 'L1 conjunct a debilitated planet; Rahu and Saturn in 10, aspected by L9',
  c => any(SEVEN, d => debil(c, d) && c.conj(c.lord_of(1), d) && d !== c.lord_of(1)) && c.house.Ra === 10 && c.house.Sa === 10 && c.aspects(c.lord_of(9), c.sign.Sa));
function akhanda(c) {
  let lords = [11, 9, 2].map(h => c.lord_of(h));
  if (PARAMS.akhanda_kendra_lord_other_than_jupiter) lords = lords.filter(l => l !== 'Ju');
  return any(lords, l => KENDRA.has(c.from_ref(l, 'Mo'))) && any([2, 5, 11], h => c.lord_of(h) === 'Ju');
}
R(302, 'raja', 'one of L11, L9, L2 (other than Jupiter, per param) in a kendra from Moon, and Jupiter rules 2, 5 or 11', akhanda, { params: ['akhanda_kendra_lord_other_than_jupiter'] });
R(233, 'named.akhanda_samrajya', 'same condition as 302', akhanda, { params: ['akhanda_kendra_lord_other_than_jupiter'] });
R(304, 'raja.fixed_chart', 'Taurus Lagna with Moon in it; Saturn 10, Sun 4, Jupiter 7', c => c.asc === 1 && c.house.Mo === 1 && c.house.Sa === 10 && c.house.Su === 4 && c.house.Ju === 7);
R(305, 'raja', 'Sun and Moon both within deep_exaltation_orb_deg of their deep-exaltation degree', c => all(['Su', 'Mo'], p => Math.abs(mod(c.lon[p] - DEEP[p] + 180, 360) - 180) <= PARAMS.deep_exaltation_orb_deg), { params: ['deep_exaltation_orb_deg'] });
R(308, 'raja.jaimini', 'Moon and Venus together, or Moon aspected by Venus', c => c.conj('Mo', 'Ve') || c.aspects('Ve', c.sign.Mo));
R(309, 'raja.jaimini', 'Moon aspected by at least many_planets_min planets', c => sum(SEVEN.filter(p => p !== 'Mo'), p => c.aspects(p, c.sign.Mo)) >= PARAMS.many_planets_min, { params: ['many_planets_min'] });
R(310, 'raja.cancellation', 'Moon within deep_exaltation_orb_deg of its deep-debilitation degree', c => Math.abs(mod(c.lon.Mo - mod(DEEP.Mo + 180, 360) + 180, 360) - 180) <= PARAMS.deep_exaltation_orb_deg, { params: ['deep_exaltation_orb_deg'] });
R(311, 'dhana.fixed_chart', 'Gemini Lagna, Moon and Mars in 11, Saturn in 9', c => c.asc === 2 && c.house.Mo === 11 && c.house.Ma === 11 && c.house.Sa === 9);
for (const [no, p, o] of [[312, 'Ve', ['Ma']], [313, 'Me', ['Mo', 'Ma', 'Ju']], [314, 'Su', ['Sa', 'Mo', 'Ju']], [315, 'Sa', ['Su', 'Mo']], [316, 'Ju', ['Me']], [317, 'Ma', ['Ve']], [318, 'Mo', ['Sa']]])
  R(no, 'dhana', `${p} in own sign in 5, and ${o.join('/')} in 11`, c => own(c, p) && c.house[p] === 5 && all(o, x => c.house[x] === 11));
for (const [no, p, ab] of [[319, 'Su', ['Ma', 'Ju']], [320, 'Mo', ['Me', 'Ju']], [321, 'Ma', ['Me', 'Ve', 'Sa']], [322, 'Me', ['Sa', 'Ju']], [323, 'Ju', ['Me', 'Ma']], [324, 'Ve', ['Sa', 'Me']], [325, 'Sa', ['Ma', 'Ju']]])
  R(no, 'dhana', `${p} in own sign in Lagna, conjunct or aspected by ${ab.join('/')}`, c => own(c, p) && c.house[p] === 1 && all(ab, x => cora(c, p, x)));
R(326, 'dhana', 'L9 conjunct L5', c => c.lord_of(9) !== c.lord_of(5) && c.conj(c.lord_of(9), c.lord_of(5)));
R(331, 'dhana', 'L9 exalted and aspected by a benefic, and house 9 aspected by a benefic', c => exalted(c, c.lord_of(9)) && any(BEN7(c), b => c.aspects(b, c.sign[c.lord_of(9)])) && any(BEN7(c), b => c.aspects(b, ksign(9, c))));
R(333, 'dhana', 'L9 in a kendra or trikona aspecting Lagna or L1',
  c => KT.has(c.house[c.lord_of(9)]) && (c.aspects(c.lord_of(9), c.asc) || c.aspects(c.lord_of(9), c.sign[c.lord_of(1)])
    || (PARAMS.aspect_includes_conjunction_333 && c.lord_of(9) !== c.lord_of(1) && c.conj(c.lord_of(9), c.lord_of(1)))
    || (PARAMS.l9_in_lagna_counts_as_aspect_333 && c.house[c.lord_of(9)] === 1)), { params: ['aspect_includes_conjunction_333'] });
R(335, 'dhana', 'L9 in 4, L10 in a kendra, L12 aspected by Jupiter', c => c.house[c.lord_of(9)] === 4 && KENDRA.has(c.house[c.lord_of(10)]) && c.aspects('Ju', c.sign[c.lord_of(12)]));
R(336, 'dhana', 'Mercury exalted, aspected by L9, and L11 in a kendra', c => exalted(c, 'Me') && c.lord_of(9) !== 'Me' && c.aspects(c.lord_of(9), c.sign.Me) && KENDRA.has(c.house[c.lord_of(11)]));
R(337, 'dhana', 'L1 in 2, L2 in 11, L11 in Lagna', c => c.house[c.lord_of(1)] === 2 && c.house[c.lord_of(2)] === 11 && c.house[c.lord_of(11)] === 1);
R(339, 'dhana', 'L2 in a kendra or trikona from L1, or a natural-benefic L2 exalted or conjunct an exalted planet', c => {
  const l1 = c.lord_of(1), l2 = c.lord_of(2);
  return KT.has(mod(c.sign[l2] - c.sign[l1], 12) + 1) || (['Ju', 'Ve', 'Me', 'Mo'].includes(l2) && (exalted(c, l2) || any(SEVEN.filter(x => x !== l2), x => exalted(c, x) && c.conj(l2, x))));
});
R(342, 'dhana', 'L1 and L2 conjunct in 3 with a benefic aspect', c => c.lord_of(1) !== c.lord_of(2) && c.conj(c.lord_of(1), c.lord_of(2)) && c.house[c.lord_of(1)] === 3 && any(BEN7(c), b => c.aspects(b, ksign(3, c))));
R(346, 'dhana', 'strong L2 conjunct or aspected by a weaker L6, or by Mars',
  c => c.strong(c.lord_of(2)) && ((cora(c, c.lord_of(2), c.lord_of(6)) && c.sbOf(c.lord_of(6)) < c.sbOf(c.lord_of(2))) || cora(c, c.lord_of(2), 'Ma')), { params: ['strong_ratio'] });
R(347, 'dhana', 'strong L2 conjunct or aspected by L7 and Venus, L1 very strong', c => c.strong(c.lord_of(2)) && cora(c, c.lord_of(2), c.lord_of(7)) && cora(c, c.lord_of(2), 'Ve') && c.strong(c.lord_of(1)), { params: ['strong_ratio'] });
R(348, 'dhana', 'L1 and L2 exchange signs', c => c.exchange(c.lord_of(1), c.lord_of(2)));
Object.assign(NOT_IMPL, { 267: 'ambiguous wording ("in presence of a L1")', 268: 'ambiguous wording', 271: 'needs Karakamsha (Jaimini AK navamsha)', 287: 'needs planetary rays',
  288: 'needs "full Moon" threshold', 303: 'needs friendly = natural/compound choice', 306: 'needs Atmakaraka',
  307: 'needs Atmakaraka', 338: 'needs "strongest planet" definition', 340: 'ambiguous wording',
  341: 'needs navamsha-lord aspect', 343: 'truncated text', 344: 'needs Vaisheshikamsha', 345: 'truncated text' });

// Vaiseshikamsa-based yogas (522, 297, 332, 334, 528, 529)
function trikalagnana(c) {
  const d9 = c.d9('Ju');
  const own_nav = LORD[d9] === 'Ju';
  const mridv = PARAMS.mridvamsha_indices.includes(VS.d60_index_odd_order(c.lon.Ju));
  if (PARAMS.trikalagnana_reading === 'open' || PARAMS.trikalagnana_reading === 'pl7')
    return mridv || own_nav || (has_title(c, 'Ju', 'Gopura', true) && benefic_aspect(c, 'Ju'));
  const benefic_nav = ['Ju', 'Ve', 'Me', 'Mo'].includes(LORD[d9]);
  return (own_nav && mridv) || (has_title(c, 'Ju', 'Gopura', true) && benefic_nav && benefic_aspect(c, 'Ju'));
}
rule(522, 'learning.trikalagnana', 'open: Mridvamsha OR own navamsha OR (Gopura+ and benefic aspect); classical: own navamsha with Mridvamsha, OR Gopura+ in a benefic navamsha aspected by benefics',
  trikalagnana, { params: ['trikalagnana_reading', 'vaiseshikamsa_mode', 'title_match', 'mridvamsha_indices'] });
rule(297, 'raja.vaiseshikamsa', 'L10 in the 9th, attaining Uttamamsa, and exalted or in a friendly sign in the navamsha', c => {
  const l = c.lord_of(10);
  return c.house[l] === 9 && has_title(c, l, 'Uttama') && (VS.varga_sign(c.lon[l], 9) === EXALT[l] || NAT_FRIENDS[l].has(LORD[VS.varga_sign(c.lon[l], 9)]));
}, { params: ['vaiseshikamsa_mode', 'title_match'] });
rule(332, 'dhana.vaiseshikamsa', 'L9 in Paravatamsha aspected by Jupiter, and L1 aspected by Venus',
  c => has_title(c, c.lord_of(9), 'Paravata') && c.lord_of(9) !== 'Ju' && c.aspects('Ju', c.sign[c.lord_of(9)]) && c.lord_of(1) !== 'Ve' && c.aspects('Ve', c.sign[c.lord_of(1)]),
  { params: ['vaiseshikamsa_mode', 'title_match'] });
rule(334, 'dhana.vaiseshikamsa', 'L9 in Simhasanamsha aspected by L1 and L10',
  c => has_title(c, c.lord_of(9), 'Simhasana') && all([c.lord_of(1), c.lord_of(10)], l => l !== c.lord_of(9) && c.aspects(l, c.sign[c.lord_of(9)])),
  { params: ['vaiseshikamsa_mode', 'title_match'] });
for (const [no, extra] of [[528, false], [529, true]])
  rule(no, 'spiritual.vaiseshikamsa', 'L9 or L10 in Devalokamsha or Paravatamsha' + (extra ? ', aspected by benefics' : ''),
    c => any([9, 10], h => (has_title(c, c.lord_of(h), 'Devaloka') || has_title(c, c.lord_of(h), 'Paravata')) && (!extra || benefic_aspect(c, c.lord_of(h)))),
    { params: ['vaiseshikamsa_mode', 'title_match'] });
})(typeof window !== 'undefined' ? window.PL7Yoga : globalThis.PL7Yoga);
