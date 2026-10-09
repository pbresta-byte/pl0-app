/* PL7 yoga rules — Arishta 541-605, Daridra 606-626, speech 627-629, Balarishta / Arishta-Bhanga 641-657,
 * longevity 658-741. Literal translation of tools/arishta_rules.py (research workspace copy); keep in lock-step.
 * SAFETY: traditional material only — not a medical, life-span, legal or financial prediction. */
(function (E) {
'use strict';
const { mod, S, any, all, union, setEq,
  LORD, DEBIL, SEVEN, NINE, NAT_ENEMIES, NAT_MALEFIC, KENDRA, TRIKONA, DUSTHANA, PANAPHARA, APOKLIMA, KT, DEEP, VS,
  has_title, exalted, debil, own, ksign, MAL, BEN, L, weak, afflicted, house_afflicted, mal_in, assoc, rel_arishta,
  friendly_sign, n_mal_aspects, maraka_influence, mal_nav, ben_nav, mo_me_kendra, hemmed, arudha, atmakaraka, together,
  asp_by_any, aspectors, pair_mod, rule, NOT_IMPL, PARAMS } = E.helpers;
const SHIRSHODAYA = S(2, 4, 5, 6, 7, 10);
const R = (no, fam, cond, fn, flags, extra) => rule(no, fam, cond, fn, Object.assign({ safety_flags: flags === undefined ? ['death_longevity'] : flags }, extra || {}));
const DH = ['death_longevity', 'health'], FIN = ['financial'];
const conjMal = (c, x) => any(MAL(c), m => m !== x && c.conj(m, x));

// Arishta 541-605
for (const [no, a, bs] of [[541, 1, [6, 8, 12]], [542, 6, [8, 12]], [543, 8, [12]]])
  R(no, 'arishta', `L${a} conjunct or in mutual aspect with ` + bs.map(b => 'L' + b).join(' or '),
    c => !(a === 1 && PARAMS.arishta541_skip_if_l1_owns_dusthana && new Set([...DUSTHANA].map(h => L(c, h))).has(L(c, 1))) && any(bs, b => rel_arishta(c, L(c, a), L(c, b))),
    undefined, { params: ['arishta_relation', 'arishta541_skip_if_l1_owns_dusthana'] });
R(545, 'arishta', 'L6 a malefic (chart-wise), placed in house 1, 8 or 10', c => c.malefics().has(L(c, 6)) && [1, 8, 10].includes(c.house[L(c, 6)]), DH);
R(546, 'arishta', 'Mercury in Lagna associated with L6 or L8', c => c.house.Me === 1 && any([6, 8], h => assoc(c, 'Me', L(c, h))), DH);
R(548, 'arishta', 'L7 in house 6 conjunct Venus', c => c.house[L(c, 7)] === 6 && c.conj(L(c, 7), 'Ve'), ['death_longevity', 'sexuality']);
R(549, 'arishta', 'L1 conjunct Mars and Mercury in house 4 or 12', c => [4, 12].includes(c.house[L(c, 1)]) && all(['Ma', 'Me'], p => p === L(c, 1) || c.conj(p, L(c, 1))), DH);
R(550, 'arishta', 'Jupiter in house 6 associated with Saturn and Moon', c => c.house.Ju === 6 && assoc(c, 'Ju', 'Sa') && assoc(c, 'Ju', 'Mo'), DH);
R(552, 'arishta', 'L1 in a kendra or trikona conjunct L6 and conjunct Saturn, Rahu or Ketu', c => L(c, 1) !== L(c, 6) && KT.has(c.house[L(c, 1)]) && c.conj(L(c, 1), L(c, 6)) && any(['Sa', 'Ra', 'Ke'].filter(x => x !== L(c, 1)), x => c.conj(L(c, 1), x)), ['death_longevity', 'legal_incarceration']);
R(553, 'arishta', 'Saturn and Jupiter in houses 9 and 5 (one each)', c => setEq(S(c.house.Sa, c.house.Ju), S(5, 9)), ['death_longevity', 'violence']);
R(555, 'arishta', 'Moon aspected by L1 and in 6/8/12 with Saturn or Rahu (Mandi branch not evaluated)', c => L(c, 1) !== 'Mo' && c.aspects(L(c, 1), c.sign.Mo) && DUSTHANA.has(c.house.Mo) && any(['Sa', 'Ra'], x => c.conj('Mo', x)));
R(558, 'arishta', 'Moon in 6, Saturn in 8, a malefic in 12, L1 in a malefic-owned navamsha', c => c.house.Mo === 6 && c.house.Sa === 8 && mal_in(c, 12) && mal_nav(c, L(c, 1)), DH);
R(559, 'arishta', 'Sun in 6 conjunct a malefic and aspected by another malefic', c => c.house.Su === 6 && any(MAL(c), m => m !== 'Su' && c.conj(m, 'Su') && any(MAL(c), n => n !== 'Su' && n !== m && c.aspects(n, c.sign.Su))), DH);
R(560, 'arishta', 'strong Sun and strong Mars in house 4', c => c.house.Su === 4 && c.house.Ma === 4 && c.strong('Su') && c.strong('Ma'), DH, { params: ['strong_ratio'] });
R(561, 'arishta', 'Venus and Sun together in 5, 7 or 9, aspected by malefics (evil-division branch not evaluated)', c => together(c, ['Ve', 'Su'], S(5, 7, 9)) && n_mal_aspects(c, c.sign.Ve) >= PARAMS.malefics_plural_min);
R(562, 'arishta', 'waning Moon in 5 and malefics in 1, 7 and 12', c => !c.waxing && c.house.Mo === 5 && all([1, 7, 12], h => mal_in(c, h)), ['death_longevity', 'fertility_family']);
R(563, 'arishta', 'Moon, Venus, Saturn and Mars together in 7', c => together(c, ['Mo', 'Ve', 'Sa', 'Ma'], S(7)), ['death_longevity', 'sexuality']);
R(564, 'arishta', 'Moon in 10, Venus in 7, a malefic in 4', c => c.house.Mo === 10 && c.house.Ve === 7 && mal_in(c, 4), ['death_longevity', 'fertility_family']);
R(565, 'arishta', 'malefics in 1, 5, 8 and 12', c => all([1, 5, 8, 12], h => mal_in(c, h)), ['death_longevity', 'fertility_family']);
R(566, 'arishta', 'Mercury and Venus in 7, Jupiter in 5, malefics in 4', c => c.house.Me === 7 && c.house.Ve === 7 && c.house.Ju === 5 && mal_in(c, 4), ['death_longevity', 'fertility_family']);
R(567, 'arishta', 'Moon in 5 and malefics in 1, 8 and 12', c => c.house.Mo === 5 && all([1, 8, 12], h => mal_in(c, h)), ['death_longevity', 'fertility_family']);
R(568, 'arishta', 'Moon in Cancer or Scorpio navamsha, joined there (navamsha chart) by a malefic', c => [3, 7].includes(c.d9('Mo')) && any(MAL(c), m => m !== 'Mo' && c.d9(m) === c.d9('Mo')), DH);
R(569, 'arishta', 'Moon in 10, Mars in 7, Saturn 2nd from the Sun', c => c.house.Mo === 10 && c.house.Ma === 7 && c.from_ref('Sa', 'Su') === 2);
R(570, 'arishta', 'Mars in 2, Saturn in 12, Moon in Lagna, Sun in 7', c => c.house.Ma === 2 && c.house.Sa === 12 && c.house.Mo === 1 && c.house.Su === 7);
for (const [no, x] of [[571, 'Mo'], [572, 'Su'], [588, 'Mo']])
  R(no, 'arishta', `Rahu conjunct ${x} in Lagna and a malefic in a trikona (5 or 9)`, c => c.house.Ra === 1 && c.house[x] === 1 && any(MAL(c), m => [5, 9].includes(c.house[m])));
R(573, 'arishta', 'L2, Sun, Venus and L1 together in 6, 8 or 12', c => together(c, [...new Set([L(c, 2), 'Su', 'Ve', L(c, 1)])], DUSTHANA), DH);
for (const [no, a, ha, b, hb] of [[574, 'Ju', 1, 'Sa', [7]], [575, 'Ju', 1, 'Ma', [7]], [576, 'Sa', 1, 'Ma', [5, 7, 9]]])
  R(no, 'arishta.mental', `${a} in ${ha} and ${b} in ${hb.join(', ')}`, c => c.house[a] === ha && hb.includes(c.house[b]), DH);
R(577, 'arishta.mental', 'Saturn in Lagna, Sun in 12, Moon or Mars in a trikona', c => c.house.Sa === 1 && c.house.Su === 12 && (TRIKONA.has(c.house.Mo) || TRIKONA.has(c.house.Ma)), DH);
R(578, 'arishta.mental', 'Saturn in 12 conjunct a weak or waning Moon', c => c.house.Sa === 12 && c.conj('Sa', 'Mo') && (weak(c, 'Mo') || !c.waxing), DH);
R(579, 'arishta.mental', 'Moon and Mercury in a kendra, conjunct or aspected by any other planet', c => mo_me_kendra(c) && any(NINE, q => q !== 'Mo' && q !== 'Me' && (c.conj(q, 'Mo') || c.aspects(q, c.sign.Mo))), DH, { params: ['moon_mercury_same_kendra'] });
R(580, 'arishta.mental', 'waning Moon in a malefic navamsha in a kendra, Mercury with malefics', c => !c.waxing && mal_nav(c, 'Mo') && KENDRA.has(c.house.Mo) && any(MAL(c), m => m !== 'Me' && c.conj('Me', m)), DH);
R(581, 'arishta.mental', 'Moon associated with a weak Saturn in 8', c => c.house.Sa === 8 && weak(c, 'Sa') && assoc(c, 'Mo', 'Sa'), DH);
R(582, 'arishta.mental', 'Moon conjunct Mars, Rahu or Saturn in 6, 8 or 12', c => DUSTHANA.has(c.house.Mo) && any(['Ma', 'Ra', 'Sa'], x => c.conj('Mo', x)), DH);
R(583, 'arishta.mental', 'weak waning Moon in 8 conjunct Rahu, aspected by malefics', c => c.house.Mo === 8 && weak(c, 'Mo') && !c.waxing && c.conj('Mo', 'Ra') && asp_by_any(c, 'Mo', MAL(c)), DH);
R(584, 'arishta.mental', 'Moon and Mercury in a kendra, both conjunct or aspected by malefics', c => mo_me_kendra(c) && afflicted(c, 'Mo') && afflicted(c, 'Me'), DH, { params: ['moon_mercury_same_kendra'] });
R(585, 'arishta.mental', 'Moon and Mercury in a kendra, neither in a benefic navamsha', c => mo_me_kendra(c) && !ben_nav(c, 'Mo') && !ben_nav(c, 'Me'), DH, { params: ['moon_mercury_same_kendra'] });
R(586, 'arishta.mental', 'L6 afflicted, OR house 6 occupied/aspected by malefics, OR Mercury and Moon afflicted (join per param)', c => {
  const a = afflicted(c, L(c, 6)), b = house_afflicted(c, 6), d = afflicted(c, 'Me') && afflicted(c, 'Mo');
  return PARAMS.rule586_join === 'or' ? (a || b || d) : (a && b && d);
}, DH, { params: ['rule586_join'] });
R(587, 'arishta.mental', 'Moon in 12 with Rahu, a benefic in 8', c => c.house.Mo === 12 && c.conj('Mo', 'Ra') && any(BEN(c), b => c.house[b] === 8), DH);
R(589, 'arishta.mental', 'weak Mercury conjunct a malefic in 3, 6, 8 or 12', c => weak(c, 'Me') && [3, 6, 8, 12].includes(c.house.Me) && conjMal(c, 'Me'), DH);
R(590, 'arishta.mental', 'Sun in Lagna, Mars and Saturn in 7', c => c.house.Su === 1 && c.house.Ma === 7 && c.house.Sa === 7, DH);
R(591, 'arishta.mental', 'Moon with Mars and Saturn in 8', c => together(c, ['Mo', 'Ma', 'Sa'], S(8)), DH);
for (const [no, h] of [[592, 8], [593, 1]])
  R(no, 'arishta.mental', `Sun, Moon and Mars in ${h}, aspected by a malefic`, c => together(c, ['Su', 'Mo', 'Ma'], S(h)) && asp_by_any(c, 'Su', MAL(c)), DH);
R(594, 'arishta.mental', 'Moon and Mercury in a kendra aspected by a malefic, malefics in 8', c => mo_me_kendra(c) && asp_by_any(c, 'Mo', MAL(c)) && mal_in(c, 8), DH, { params: ['moon_mercury_same_kendra'] });
R(595, 'arishta.mental', 'Mars and Saturn together in 6 or 8, Jupiter in Lagna or a trikona', c => together(c, ['Ma', 'Sa'], S(6, 8)) && TRIKONA.has(c.house.Ju), DH);
R(596, 'arishta.mental', 'Moon with Rahu or Saturn, and Mercury weak or afflicted', c => (c.conj('Mo', 'Ra') || c.conj('Mo', 'Sa')) && (weak(c, 'Me') || afflicted(c, 'Me')), DH);
R(597, 'arishta.mental', 'Moon and Mercury in a kendra, no other planet conjunct, not aspected by kendra lords', c => mo_me_kendra(c)
  && !any(NINE, q => q !== 'Mo' && q !== 'Me' && (c.conj(q, 'Mo') || c.conj(q, 'Me')))
  && !any([...KENDRA].filter(h => !['Mo', 'Me'].includes(L(c, h))), h => c.aspects(L(c, h), c.sign.Mo)), DH);
R(598, 'arishta.mental', 'Venus and Moon together in a kendra, malefics in 8 and 5', c => together(c, ['Ve', 'Mo'], KENDRA) && mal_in(c, 8) && mal_in(c, 5), DH);
R(600, 'arishta', 'Lagna Sagittarius, Taurus or a malefic-owned sign, aspected by malefics', c => ([8, 1].includes(c.asc) || NAT_MALEFIC.has(LORD[c.asc])) && n_mal_aspects(c, c.asc) >= PARAMS.malefics_plural_min, undefined, { params: ['malefics_plural_min'] });
R(601, 'arishta', 'Moon conjunct Saturn', c => c.conj('Mo', 'Sa'));
R(602, 'arishta', 'Arudha Lagna and Upapada together, read as their lords conjunct (param)', c => { const a = arudha(c, 1), u = arudha(c, 12); return a === u || (PARAMS.rule602_mode === 'lords_conjunct' && c.conj(LORD[a], LORD[u])); }, ['death_longevity', 'relationships'], { params: ['rule602_mode'] });
R(603, 'raja.bhanga', 'Leo Lagna, Saturn exalted but in its debilitation navamsha or aspected by a benefic', c => c.asc === 4 && exalted(c, 'Sa') && (c.d9('Sa') === DEBIL.Sa || asp_by_any(c, 'Sa', BEN(c))), []);
R(604, 'raja.bhanga', 'Sun in house 10 at the 10th degree of Libra, aspected by malefics', c => c.house.Su === 10 && c.sign.Su === 6 && c.lon.Su % 30 >= 9 && c.lon.Su % 30 < 10 && asp_by_any(c, 'Su', MAL(c)), []);
R(605, 'arishta', 'a malefic without benefic aspect in a kendra and Jupiter in 8', c => c.house.Ju === 8 && any(MAL(c), m => KENDRA.has(c.house[m]) && !asp_by_any(c, m, BEN(c))));

// Daridra 606-626 and speech 627-629
for (const [no, h] of [[606, 12], [607, 6]])
  R(no, 'daridra', `L1 and L${h} exchange signs, and a maraka lord (L2/L7) influences either`, c => c.exchange(L(c, 1), L(c, h)) && (maraka_influence(c, L(c, 1)) || maraka_influence(c, L(c, h))), FIN);
R(608, 'daridra', 'Lagna or Moon afflicted by Ketu, and L1 in 8 afflicted by a maraka lord', c => (c.house.Ke === 1 || c.aspects('Ke', c.asc) || c.conj('Ke', 'Mo') || c.aspects('Ke', c.sign.Mo)) && c.house[L(c, 1)] === 8 && maraka_influence(c, L(c, 1)), FIN);
R(609, 'daridra', 'L1 with a malefic in a dusthana, and L2 debilitated or in 6', c => DUSTHANA.has(c.house[L(c, 1)]) && conjMal(c, L(c, 1)) && (debil(c, L(c, 2)) || c.house[L(c, 2)] === 6), FIN);
R(610, 'daridra', 'L1 conjunct a dusthana lord or Saturn, unaspected by benefics', c => any(new Set([L(c, 6), L(c, 8), L(c, 12), 'Sa']), x => x !== L(c, 1) && c.conj(L(c, 1), x)) && !asp_by_any(c, L(c, 1), BEN(c)), FIN);
R(611, 'daridra', 'L5 in 6 and L9 in 12, under maraka influence', c => c.house[L(c, 5)] === 6 && c.house[L(c, 9)] === 12 && (maraka_influence(c, L(c, 5)) || maraka_influence(c, L(c, 9))), FIN);
R(612, 'daridra', 'malefics other than L9 and L10 in Lagna, under maraka influence', c => any(MAL(c), m => c.house[m] === 1 && m !== L(c, 9) && m !== L(c, 10) && maraka_influence(c, m)), FIN);
R(613, 'daridra', 'the lord of the sign occupied by a dusthana lord is itself in a dusthana and afflicted', c => any(DUSTHANA, h => { const d = LORD[c.sign[L(c, h)]]; return DUSTHANA.has(c.house[d]) && afflicted(c, d); }), FIN);
R(614, 'daridra', "the Moon's navamsha lord associated with a maraka lord or placed in 2 or 7", c => {
  const n = LORD[c.d9('Mo')];
  return [2, 7].includes(c.house[n]) || (PARAMS.maraka_planet === 'occupant_of_2_or_7'
    ? any(SEVEN, q => q !== n && [2, 7].includes(c.house[q]) && (c.conj(q, n) || c.aspects(q, c.sign[n])))
    : maraka_influence(c, n));
}, FIN);
R(615, 'daridra', "L1's navamsha lord or the navamsha-Lagna lord in a dusthana, associated with a maraka lord", c => any(new Set([LORD[c.d9(L(c, 1))], LORD[mod(Math.floor(c.lon_asc * 9 / 30), 12)]]), n => DUSTHANA.has(c.house[n]) && maraka_influence(c, n)), FIN);
R(616, 'daridra', 'a benefic in a dusthana and a malefic in a kendra or trikona', c => any(BEN(c), b => DUSTHANA.has(c.house[b])) && any(MAL(c), m => KT.has(c.house[m])), FIN);
R(618, 'daridra', '8th or 12th from the Atmakaraka or from Lagna aspected by L1 and by the Atmakaraka navamsha lord', c => {
  const ak = atmakaraka(c);
  return any([(c.sign[ak] + 7) % 12, (c.sign[ak] + 11) % 12], s => c.aspects(LORD[c.d9(ak)], s)) && any([ksign(8, c), ksign(12, c)], s => c.aspects(L(c, 1), s));
}, FIN);
R(619, 'daridra', '12th from the Atmakaraka aspected by its navamsha lord, or 12th from Lagna aspected by L1', c => { const ak = atmakaraka(c); return c.aspects(LORD[c.d9(ak)], (c.sign[ak] + 11) % 12) || c.aspects(L(c, 1), ksign(12, c)); }, FIN);
R(620, 'daridra', 'Mars and Saturn in 2, not aspected by Mercury', c => c.house.Ma === 2 && c.house.Sa === 2 && !c.aspects('Me', ksign(2, c)), FIN);
R(621, 'daridra', 'Sun in 2 aspected by Saturn, or Saturn in 2 aspected by Sun', c => (c.house.Su === 2 && c.aspects('Sa', c.sign.Su)) || (c.house.Sa === 2 && c.aspects('Su', c.sign.Sa)), FIN);
R(622, 'daridra', 'navamsha chain in reverse order', c => all([['Sa', 'Ve'], ['Ve', 'Ju'], ['Ju', 'Me'], ['Me', 'Ma'], ['Ma', 'Mo'], ['Mo', 'Su']], ([a, b]) => mod(c.d9(b) - c.d9(a), 12) === 1), FIN);
R(623, 'daridra', 'all 7 grahas debilitated or in natural-enemy signs in the navamsha', c => all(SEVEN, p => c.d9(p) === DEBIL[p] || NAT_ENEMIES[p].has(LORD[c.d9(p)])), FIN);
R(624, 'daridra', 'Moon in Lagna afflicted by Ketu', c => c.house.Mo === 1 && (c.conj('Mo', 'Ke') || c.aspects('Ke', c.sign.Mo)), FIN);
R(625, 'daridra', "Sun and Moon in one sign, each in the other's navamsha sign", c => c.conj('Su', 'Mo') && c.d9('Su') === 3 && c.d9('Mo') === 4, FIN);
R(626, 'daridra', 'L11 in 6, 8 or 12', c => DUSTHANA.has(c.house[L(c, 11)]), FIN);
R(627, 'speech', 'L2 conjunct a benefic in a kendra or trikona, or L2 exalted and conjunct Jupiter', c => (KT.has(c.house[L(c, 2)]) && any(BEN(c), b => b !== L(c, 2) && c.conj(b, L(c, 2)))) || (exalted(c, L(c, 2)) && L(c, 2) !== 'Ju' && c.conj(L(c, 2), 'Ju')), []);
R(628, 'speech', 'Mercury in a kendra at deep exaltation, in Paravatamsha, and Jupiter or Venus in Simhasanamsha', c => has_title(c, 'Me', 'Paravata') && KENDRA.has(c.house.Me) && Math.abs(mod(c.lon.Me - DEEP.Me + 180, 360) - 180) <= PARAMS.deep_exaltation_orb_deg && any(['Ju', 'Ve'], p => has_title(c, p, 'Simhasana')), []);
R(629, 'speech', 'Venus, Moon and Mercury together in a kendra, Rahu in Lagna', c => together(c, ['Ve', 'Mo', 'Me'], KENDRA) && c.house.Ra === 1, []);

// Balarishta 641-649, Arishta-Bhanga 650-657
R(641, 'balarishta', 'Moon in 6, 8 or 12 aspected by a malefic', c => DUSTHANA.has(c.house.Mo) && asp_by_any(c, 'Mo', MAL(c)));
R(643, 'balarishta', 'Moon and all malefics in kendras', c => KENDRA.has(c.house.Mo) && all(MAL(c), m => KENDRA.has(c.house[m])));
R(644, 'balarishta', 'weak Moon in Lagna, malefics in kendras and in 8', c => c.house.Mo === 1 && weak(c, 'Mo') && any(MAL(c), m => KENDRA.has(c.house[m])) && mal_in(c, 8));
R(645, 'balarishta', 'Moon in Lagna and malefics in 7', c => c.house.Mo === 1 && mal_in(c, 7));
R(646, 'balarishta', 'Moon 1, Saturn 12, Sun 9, Mars 8, Jupiter weak', c => c.house.Mo === 1 && c.house.Sa === 12 && c.house.Su === 9 && c.house.Ma === 8 && weak(c, 'Ju'));
R(647, 'balarishta', 'Cancer or Scorpio Lagna, all benefics in houses 4-10, all malefics in houses 10-4', c => [3, 7].includes(c.asc) && all(BEN(c), b => c.house[b] >= 4 && c.house[b] <= 10) && all(MAL(c), m => c.house[m] >= 10 || c.house[m] <= 4));
R(648, 'balarishta', 'Lagna and Moon both without benefic aspect and hemmed between malefics', c => !any(BEN(c), b => c.aspects(b, c.asc)) && !asp_by_any(c, 'Mo', BEN(c)) && hemmed(c, c.asc) && hemmed(c, c.sign.Mo));
R(649, 'balarishta', 'Mars, Saturn and Sun together in 6 or 8', c => together(c, ['Ma', 'Sa', 'Su'], S(6, 8)));
R(650, 'arishta_bhanga', 'strong Jupiter in Lagna', c => c.house.Ju === 1 && c.strong('Ju'), undefined, { params: ['strong_ratio'] });
R(651, 'arishta_bhanga', 'a strong Mercury, Jupiter or Venus in a kendra', c => any(['Me', 'Ju', 'Ve'], p => KENDRA.has(c.house[p]) && c.strong(p)), undefined, { params: ['strong_ratio'] });
R(652, 'arishta_bhanga', 'very strong L1 in a kendra, aspected by a benefic, unaspected by malefics', c => c.sbOf(L(c, 1)) >= PARAMS.very_strong_ratio && KENDRA.has(c.house[L(c, 1)]) && asp_by_any(c, L(c, 1), BEN(c)) && !asp_by_any(c, L(c, 1), MAL(c)), undefined, { params: ['very_strong_ratio'] });
R(653, 'arishta_bhanga', 'day birth in the waning fortnight, or night birth in the waxing fortnight', c => c.day_birth !== null && c.day_birth !== undefined && ((c.day_birth && !c.waxing) || (PARAMS.rule653_branches === 'both' && !c.day_birth && c.waxing)), undefined, { params: ['rule653_branches'] });
R(654, 'arishta_bhanga', 'Rahu in 3, 6 or 11', c => [3, 6, 11].includes(c.house.Ra));
R(655, 'arishta_bhanga', 'Rahu in Lagna in Aries, Taurus or Cancer', c => c.house.Ra === 1 && [0, 1, 3].includes(c.asc));
R(656, 'arishta_bhanga', 'all 7 grahas in head-rising (shirshodaya) signs', c => all(SEVEN, p => SHIRSHODAYA.has(c.sign[p])));
R(657, 'arishta_bhanga', 'Moon in a drekkana ruled by Mercury or Jupiter', c => ['Me', 'Ju'].includes(LORD[VS.varga_sign(c.lon.Mo, 3)]));

// Longevity: three-pair method
for (const [base, same, mixed, name] of [[658, 'sthira', ['chara', 'dual'], 'Alpayu'], [674, 'dual', ['chara', 'sthira'], 'Madhyayu'], [683, 'chara', ['dual', 'sthira'], 'Purnayu']]) {
  const fam = 'longevity.' + name.toLowerCase();
  R(base, fam, `${name}: L1 and L8 both in ${same} signs, or one ${mixed[0]} and the other ${mixed[1]}`, c => pair_mod(c, c.sign[L(c, 1)], c.sign[L(c, 8)], same, mixed));
  R(base + 1, fam, `${name}: Lagna and Moon both in ${same} signs, or one ${mixed[0]} and the other ${mixed[1]}`, c => pair_mod(c, c.asc, c.sign.Mo, same, mixed));
  NOT_IMPL[base + 2] = 'needs Hora Lagna (sunrise-based); Lagna/Hora-Lagna pair of the three-pair method';
}
const allIn = (c, ps, hs) => all(ps, p => hs.has(c.house[p]));
R(661, 'longevity.alpayu', 'L1 and all benefics in apoklima houses, or L8 and all malefics in apoklima houses', c => (APOKLIMA.has(c.house[L(c, 1)]) && allIn(c, BEN(c), APOKLIMA)) || (APOKLIMA.has(c.house[L(c, 8)]) && allIn(c, MAL(c), APOKLIMA)));
R(662, 'longevity.alpayu', 'weak L1 and L8 in a kendra', c => weak(c, L(c, 1)) && KENDRA.has(c.house[L(c, 8)]));
R(663, 'longevity.alpayu', 'weak L1, debilitated L8, afflicted house 8', c => weak(c, L(c, 1)) && debil(c, L(c, 8)) && house_afflicted(c, 8));
R(664, 'longevity.alpayu', 'house 5, house 8 and L8 all afflicted', c => house_afflicted(c, 5) && house_afflicted(c, 8) && afflicted(c, L(c, 8)));
R(665, 'longevity.alpayu', 'Jupiter in 8 in Aries or Scorpio, aspected by Moon, Mars and Saturn', c => c.house.Ju === 8 && [0, 7].includes(c.sign.Ju) && all(['Mo', 'Ma', 'Sa'], p => c.aspects(p, c.sign.Ju)));
R(666, 'longevity.alpayu', 'Jupiter and Venus in Lagna, a malefic in 5', c => c.house.Ju === 1 && c.house.Ve === 1 && mal_in(c, 5));
R(667, 'longevity.alpayu', 'weak Moon and weak L1 in apoklima houses, aspected by malefics', c => all(new Set(['Mo', L(c, 1)]), p => weak(c, p) && APOKLIMA.has(c.house[p]) && asp_by_any(c, p, MAL(c))));
R(668, 'longevity.alpayu', 'Sun in Lagna hemmed between malefics', c => c.house.Su === 1 && hemmed(c, c.asc));
R(669, 'longevity.alpayu', 'no benefic in a kendra and a benefic in 8', c => !any(BEN(c), b => KENDRA.has(c.house[b])) && any(BEN(c), b => c.house[b] === 8));
R(670, 'longevity.alpayu', 'Moon in 12 and a malefic in 6', c => c.house.Mo === 12 && mal_in(c, 6));
for (const [no, a] of [[671, 3], [672, 8]]) {
  const other = a === 3 ? 'Ma' : 'Sa';
  R(no, 'longevity.alpayu', `L${a} and ${other} combust or afflicted by malefics`, c => all(new Set([L(c, a), other]), p => c.combust(p) || afflicted(c, p)));
}
R(673, 'longevity.alpayu', 'L8 conjunct Ketu in Lagna', c => c.house.Ke === 1 && c.conj(L(c, 8), 'Ke'));
R(677, 'longevity.madhyayu', 'L1 and all benefics in panaphara houses, or L8 and all malefics in panaphara houses', c => (PANAPHARA.has(c.house[L(c, 1)]) && allIn(c, BEN(c), PANAPHARA)) || (PANAPHARA.has(c.house[L(c, 8)]) && allIn(c, MAL(c), PANAPHARA)));
R(678, 'longevity.madhyayu', 'strong Mercury in a kendra and an empty house 8 aspected by benefics', c => c.strong('Me') && KENDRA.has(c.house.Me) && !any(NINE, p => c.house[p] === 8) && any(BEN(c), b => c.aspects(b, ksign(8, c))));
R(679, 'longevity.madhyayu', 'Moon in own sign or in Lagna, a benefic in 7', c => (own(c, 'Mo') || c.house.Mo === 1) && any(BEN(c), b => c.house[b] === 7));
R(680, 'longevity.madhyayu', 'all malefics in houses 2, 3, 4, 5, 8 and 11', c => allIn(c, MAL(c), S(2, 3, 4, 5, 8, 11)));
R(681, 'longevity.madhyayu', 'weak L1, Jupiter in a kendra or trikona, malefics in 6, 8, 12', c => weak(c, L(c, 1)) && KT.has(c.house.Ju) && any(MAL(c), m => DUSTHANA.has(c.house[m])));
R(682, 'longevity.madhyayu', 'Jupiter with a weak L1 in a kendra or trikona', c => L(c, 1) !== 'Ju' && weak(c, L(c, 1)) && c.conj('Ju', L(c, 1)) && KT.has(c.house.Ju));
R(686, 'longevity.purnayu', 'L1 and all benefics in kendras, or L8 and all malefics in kendras (classical); PL7 text repeats 677 (panaphara)', c => {
  const Hs = PARAMS.longevity_686_mode === 'classical_kendra' ? KENDRA : PANAPHARA;
  return (Hs.has(c.house[L(c, 1)]) && allIn(c, BEN(c), Hs)) || (Hs.has(c.house[L(c, 8)]) && allIn(c, MAL(c), Hs));
}, undefined, { params: ['longevity_686_mode'] });
R(687, 'longevity.purnayu', 'L8 exalted in a kendra or trikona, associated with benefics', c => exalted(c, L(c, 8)) && KT.has(c.house[L(c, 8)]) && any(BEN(c), b => assoc(c, L(c, 8), b)));
R(688, 'longevity.purnayu', 'L1 in Lagna and L8 in 8', c => c.house[L(c, 1)] === 1 && c.house[L(c, 8)] === 8);
R(689, 'longevity.purnayu', 'L1, L5 and L8 strong, each in own sign, own navamsha or a friendly sign', c => all(new Set([L(c, 1), L(c, 5), L(c, 8)]), p => c.strong(p) && (own(c, p) || LORD[c.d9(p)] === p || friendly_sign(c, p))), undefined, { params: ['strong_ratio'] });
R(690, 'longevity.purnayu', 'L6 or L12 in 6, 12, 8 or Lagna', c => any([6, 12], h => [1, 6, 8, 12].includes(c.house[L(c, h)])));
R(691, 'longevity.purnayu', 'L1, L8, L10 and Saturn in kendras, trikonas or 11', c => { const s = new Set([L(c, 1), L(c, 8), L(c, 10), 'Sa']); return (!PARAMS.rule691_distinct || s.size === 4) && all(s, p => KT.has(c.house[p]) || c.house[p] === 11); });
R(692, 'longevity.purnayu', 'L1 exalted, Moon in 11, Jupiter in 8', c => exalted(c, L(c, 1)) && c.house.Mo === 11 && c.house.Ju === 8);
R(693, 'longevity.purnayu', 'Saturn in 8', c => c.house.Sa === 8);
R(694, 'longevity.mahadirghayu', 'Sun, Jupiter and Mars in 9, vargottama, in Capricorn or Aquarius; strong Moon in Lagna', c => all(['Su', 'Ju', 'Ma'], p => c.house[p] === 9 && c.d9(p) === c.sign[p] && [9, 10].includes(c.sign[p])) && c.house.Mo === 1 && c.strong('Mo'));
R(695, 'longevity.mahadirghayu', 'Saturn and Jupiter in 9 or 10 in the same navamsha, aspected by benefics, Sun in Lagna', c => [9, 10].includes(c.house.Sa) && [9, 10].includes(c.house.Ju) && c.d9('Sa') === c.d9('Ju') && asp_by_any(c, 'Sa', BEN(c)) && c.house.Su === 1);
R(696, 'longevity.mahadirghayu', 'Cancer Lagna with Jupiter and Moon, Venus and Mercury in kendras, the rest in 11, 6, 3', c => c.asc === 3 && c.house.Ju === 1 && c.house.Mo === 1 && KENDRA.has(c.house.Ve) && KENDRA.has(c.house.Me) && all(['Su', 'Ma', 'Sa'], p => [3, 6, 11].includes(c.house[p])));
R(697, 'longevity.mahadirghayu', 'no malefic in a trikona, no benefic in a kendra, a malefic in 8', c => !any(MAL(c), m => TRIKONA.has(c.house[m])) && !any(BEN(c), b => KENDRA.has(c.house[b])) && mal_in(c, 8));
R(699, 'longevity.mahadirghayu', 'Jupiter and Venus in Pisces, or Moon in Taurus in Taurus navamsha, or Mars in Simhasanamsha', c => (c.sign.Ju === 11 && c.sign.Ve === 11) || (c.sign.Mo === 1 && c.d9('Mo') === 1) || has_title(c, 'Ma', 'Simhasana'), undefined, { params: ['vaiseshikamsa_mode', 'title_match'] });
R(700, 'longevity.mahadirghayu', 'Saturn in Devalokamsha, Mars in Paravatamsha, Jupiter in Lagna in Simhasanamsha', c => has_title(c, 'Sa', 'Devaloka') && has_title(c, 'Ma', 'Paravata') && c.house.Ju === 1 && has_title(c, 'Ju', 'Simhasana'), undefined, { params: ['vaiseshikamsa_mode', 'title_match'] });
R(701, 'longevity.mahadirghayu', 'Cancer Lagna, Jupiter in Gopuramsha in a kendra, Venus in Paravatamsha in a trikona', c => c.asc === 3 && has_title(c, 'Ju', 'Gopura') && KENDRA.has(c.house.Ju) && has_title(c, 'Ve', 'Paravata') && TRIKONA.has(c.house.Ve), undefined, { params: ['vaiseshikamsa_mode', 'title_match'] });
R(702, 'longevity.mahadirghayu', 'Sagittarius Lagna with Jupiter, Aries navamsha rising, Venus in 7, Moon in Virgo', c => c.asc === 8 && c.house.Ju === 1 && mod(Math.floor(c.lon_asc * 9 / 30), 12) === 0 && c.house.Ve === 7 && c.sign.Mo === 5);
R(703, 'longevity.munisvara', 'L9 in 9 aspected by the Moon, the Moon in a Mars-ruled navamsha', c => c.house[L(c, 9)] === 9 && L(c, 9) !== 'Mo' && c.aspects('Mo', c.sign[L(c, 9)]) && LORD[c.d9('Mo')] === 'Ma');
Object.assign(NOT_IMPL, { 698: 'truncated text', 704: 'needs retrograde motion (speeds not in fixture)', 642: 'needs retrograde motion (speeds not in fixture)',
  544: 'needs Mandi', 551: 'needs Mandi', 547: 'ambiguous wording', 554: 'needs good/bad shashtiamsha classification wired in',
  556: 'needs "evil divisions"', 557: 'needs "evil divisions"', 599: '"unfavourably placed" undefined', 617: 'vague wording' });

// Yogarishta 705-741
R(705, 'longevity.yogarishta', 'Jupiter in a Mars sign in 8, aspected by Sun, Moon, Mars and Saturn, not by Venus', c => [0, 7].includes(c.sign.Ju) && c.house.Ju === 8 && all(['Su', 'Mo', 'Ma', 'Sa'], p => c.aspects(p, c.sign.Ju)) && !c.aspects('Ve', c.sign.Ju));
R(706, 'longevity.yogarishta', 'Cancer is the 6th or 8th house, Mercury there aspected by the Moon', c => (ksign(6, c) === 3 || ksign(8, c) === 3) && c.sign.Me === 3 && c.aspects('Mo', 3));
R(707, 'longevity.yogarishta', 'Su-Mo-Ma-Ju, or Ma-Ju-Sa-Mo, or Su-Sa-Ma-Mo together in one sign', c => any([['Su', 'Mo', 'Ma', 'Ju'], ['Ma', 'Ju', 'Sa', 'Mo'], ['Su', 'Sa', 'Ma', 'Mo']], g => together(c, g)));
R(708, 'longevity.yogarishta', 'Saturn aspected by the Moon in a Cancer navamsha, and L1 aspected by the Moon', c => c.d9('Sa') === 3 && c.aspects('Mo', c.sign.Sa) && L(c, 1) !== 'Mo' && c.aspects('Mo', c.sign[L(c, 1)]));
R(709, 'longevity.yogarishta', 'Sun, Saturn, Mars in Lagna; 7th ruled by Venus holds a waning Moon; Jupiter not aspecting the Moon', c => all(['Su', 'Sa', 'Ma'], p => c.house[p] === 1) && LORD[ksign(7, c)] === 'Ve' && c.house.Mo === 7 && !c.waxing && !c.aspects('Ju', c.sign.Mo));
R(710, 'longevity.yogarishta', 'Sun, Moon and Mars in 5', c => together(c, ['Su', 'Mo', 'Ma'], S(5)));
R(711, 'longevity.yogarishta', 'Sun, Moon and Mars in 5 within 5 degrees of each other', c => { const d = ['Su', 'Mo', 'Ma'].map(p => c.lon[p] % 30); return together(c, ['Su', 'Mo', 'Ma'], S(5)) && Math.max(...d) - Math.min(...d) <= 5; });
R(712, 'longevity.yogarishta', 'Sun, Moon and Mars in 5, the Moon waning and combust', c => together(c, ['Su', 'Mo', 'Ma'], S(5)) && !c.waxing && c.combust('Mo'));
R(713, 'longevity.yogarishta', 'L1 a natural malefic in the 12th from the Moon, aspected by another malefic', c => NAT_MALEFIC.has(L(c, 1)) && c.from_ref(L(c, 1), 'Mo') === 12 && any(MAL(c), m => m !== L(c, 1) && c.aspects(m, c.sign[L(c, 1)])));
for (const [base, nav, asp] of [[714, 9, 'Me'], [718, 7, 'Su'], [720, 6, 'Ju'], [722, 5, 'Me'], [724, 4, 'Ra'], [726, 3, 'Ke']])
  for (const [no, needL1] of [[base, true], [base + 1, false]])
    R(no, 'longevity.yogarishta', (needL1 ? 'Saturn is L1 and ' : 'Saturn ') + `in navamsha sign ${nav}, aspected exclusively by ${asp}`,
      c => (!needL1 || L(c, 1) === 'Sa') && c.d9('Sa') === nav && setEq(aspectors(c, 'Sa'), S(asp)));
for (const [no, needL1] of [[728, true], [729, false]])
  R(no, 'longevity.yogarishta', (needL1 ? 'Saturn is L1 and ' : 'Saturn ') + 'in a Gemini navamsha, aspected by L1', c => (!needL1 || L(c, 1) === 'Sa') && c.d9('Sa') === 2 && L(c, 1) !== 'Sa' && c.aspects(L(c, 1), c.sign.Sa));
R(730, 'longevity.yogarishta', 'L1 and L8 natural malefics and exchanging signs', c => NAT_MALEFIC.has(L(c, 1)) && NAT_MALEFIC.has(L(c, 8)) && c.exchange(L(c, 1), L(c, 8)));
R(731, 'longevity.yogarishta', 'L1 and L8 malefics, Jupiter not in 12 or 6', c => c.malefics().has(L(c, 1)) && c.malefics().has(L(c, 8)) && ![6, 12].includes(c.house.Ju));
for (const [no, n] of [[732, 'Ra'], [733, 'Ke']])
  R(no, 'longevity.yogarishta', `L1 exalted without benefic aspect, Saturn in a Jupiter navamsha conjunct ${n}`, c => exalted(c, L(c, 1)) && !asp_by_any(c, L(c, 1), BEN(c)) && LORD[c.d9('Sa')] === 'Ju' && c.conj('Sa', n));
R(734, 'longevity.yogarishta', 'malefics in kendras unaspected by Moon, Venus or Jupiter, Moon in 6 or 8', c => [6, 8].includes(c.house.Mo) && any(MAL(c), m => KENDRA.has(c.house[m])) && all([...MAL(c)].filter(m => KENDRA.has(c.house[m])), m => !any(['Mo', 'Ve', 'Ju'], b => c.aspects(b, c.sign[m]))));
R(735, 'longevity.yogarishta', 'Sun and Jupiter in Scorpio in Lagna, L8 in a kendra', c => c.asc === 7 && c.house.Su === 1 && c.house.Ju === 1 && KENDRA.has(c.house[L(c, 8)]));
R(736, 'longevity.yogarishta', 'Saturn in Lagna, debilitated or in a natural-enemy sign, benefics in apoklima houses', c => c.house.Sa === 1 && (debil(c, 'Sa') || NAT_ENEMIES.Sa.has(LORD[c.sign.Sa])) && allIn(c, BEN(c), APOKLIMA));
R(737, 'longevity.yogarishta', "malefic L8 aspected by Jupiter and a malefic, lord of the Moon's sign in 8", c => NAT_MALEFIC.has(L(c, 8)) && c.aspects('Ju', c.sign[L(c, 8)]) && any(MAL(c), m => m !== L(c, 8) && c.aspects(m, c.sign[L(c, 8)])) && c.house[LORD[c.sign.Mo]] === 8);
R(738, 'longevity.yogarishta', "malefic L8 aspected by a malefic, Jupiter in 8 with the lord of the Moon's rashi or navamsha sign", c => NAT_MALEFIC.has(L(c, 8)) && any(MAL(c), m => m !== L(c, 8) && c.aspects(m, c.sign[L(c, 8)])) && c.house.Ju === 8 && any(new Set([LORD[c.sign.Mo], LORD[c.d9('Mo')]]), x => x !== 'Ju' && c.conj('Ju', x)));
R(739, 'longevity.yogarishta', 'Sun in 8 conjunct Moon and Saturn', c => together(c, ['Su', 'Mo', 'Sa'], S(8)));
R(740, 'longevity.yogarishta', 'L8 in a kendra and L1 weak', c => KENDRA.has(c.house[L(c, 8)]) && weak(c, L(c, 1)));
R(741, 'longevity.yogarishta', 'waning Moon; L8 in a kendra or a malefic in 8; weak L1 and a malefic in Lagna', c => !c.waxing && (KENDRA.has(c.house[L(c, 8)]) || mal_in(c, 8)) && weak(c, L(c, 1)) && mal_in(c, 1));
})(typeof window !== 'undefined' ? window.PL7Yoga : globalThis.PL7Yoga);
