/* PL7 yoga rules — named yogas 142-256, Karmajiva 349-381, bhava yogas 382-540, 742-874, 998-1001.
 * Literal translation of tools/misc_rules.py (research workspace copy); keep in lock-step.
 * Health, family, relationship and death themes carry safety_flags: traditional material only. */
(function (E) {
'use strict';
const { mod, S, any, all, sum, union, minus, setEq,
  LORD, EXALT, DEBIL, SEVEN, NINE, NAT_FRIENDS, NAT_ENEMIES, MOD, KENDRA, TRIKONA, DUSTHANA, KT, MOOLA, VS,
  exalted, debil, own, ksign, MAL, BEN, L, weak, afflicted, house_afflicted, mal_in, assoc, relatedA, mal_nav, ben_nav,
  hemmed, together, asp_by_any, aspectors, friendly_sign, NB, NM, WATERY, DRY_SIGNS, DRY_PLANETS, WATERY_PLANETS,
  H, nav_lord, occupants, ben_in, nb_in, nm_in, kendra_between, sign_from, deep_ex, title, ref_sign, cor, nav_asc,
  very_strong, own_or_ex, deb_planets, karakas, AMK, rule, NOT_IMPL, PARAMS } = E.helpers;
const related = relatedA;
const SEVEN_SET = new Set(SEVEN);
const MAL7 = c => new Set([...MAL(c)].filter(p => SEVEN_SET.has(p)));
const R = (no, fam, cond, fn, flags, extra) => rule(no, fam, cond, fn, Object.assign(flags && flags.length ? { safety_flags: flags } : {}, extra || {}));
const F = { health: ['health'], fin: ['financial'], fam: ['fertility_family'], sex: ['sexuality'], death: ['death_longevity'], legal: ['legal_incarceration'] };
const midNavLord = (c, h) => LORD[mod(Math.floor(((ksign(h, c) * 30 + 15) * 9) / 30), 12)];

// 142-152, 174-186
R(142, 'named', 'a natural benefic in 10 from Lagna', c => nb_in(c, 10));
R(143, 'named', 'a natural benefic in 10 from the Moon', c => any([...NB].filter(b => b !== 'Mo'), b => c.from_ref(b, 'Mo') === 10));
R(144, 'named', 'natural benefics in 2 and 12', c => nb_in(c, 2) && nb_in(c, 12));
R(145, 'named', 'natural malefics in 2 and 12', c => nm_in(c, 2) && nm_in(c, 12));
R(146, 'named', 'benefics in 6, 7 and 8 from Lagna, free of malefic aspect or association', c => all([6, 7, 8], h => ben_in(c, h)) && !any([...BEN(c)].filter(b => [6, 7, 8].includes(c.house[b])), b => afflicted(c, b)));
R(147, 'named', 'benefics in kendras, 6 and 8 empty or holding only benefics', c => any(BEN(c), b => KENDRA.has(c.house[b])) && all([6, 8], h => all(occupants(c, h), p => BEN(c).has(p))));
R(148, 'named', 'L1 and L12 in mutual kendras, aspected by benefics', c => kendra_between(c, L(c, 1), L(c, 12)) && asp_by_any(c, L(c, 1), BEN(c)) && asp_by_any(c, L(c, 12), BEN(c)));
R(149, 'named', 'L4 and L9 in mutual kendras, L1 strong', c => kendra_between(c, L(c, 4), L(c, 9)) && c.strong(L(c, 1)));
R(150, 'named', 'L4 exalted or in own sign, conjunct or aspected by L10', c => own_or_ex(c, L(c, 4)) && cor(c, L(c, 4), L(c, 10)));
R(151, 'named', 'exalted L1 in a kendra aspected by Jupiter', c => exalted(c, L(c, 1)) && KENDRA.has(H(c, L(c, 1))) && L(c, 1) !== 'Ju' && c.aspects('Ju', c.sign[L(c, 1)]));
R(152, 'named', 'two benefics conjunct in 1, 7, 9 or 10', c => any([1, 7, 9, 10], h => sum(BEN(c), b => c.house[b] === h) >= 2 && !mal_in(c, h)));
R(174, 'named', 'L5 and L6 in mutual kendras, L1 strong', c => kendra_between(c, L(c, 5), L(c, 6)) && c.strong(L(c, 1)));
R(175, 'named', 'L1 and L10 in movable signs, L9 strong', c => MOD.chara.has(c.sign[L(c, 1)]) && MOD.chara.has(c.sign[L(c, 10)]) && c.strong(L(c, 9)));
R(176, 'named', 'L9 strong and all planets in 1, 2, 7, 12 only', c => c.strong(L(c, 9)) && all(SEVEN, p => [1, 2, 7, 12].includes(H(c, p))));
R(177, 'named', 'L9 strong; L1, Jupiter and Venus in kendras', c => c.strong(L(c, 9)) && all([L(c, 1), 'Ju', 'Ve'], p => KENDRA.has(H(c, p))));
R(178, 'named', 'L9 strong; L1 in a kendra from Jupiter and from Venus', c => c.strong(L(c, 9)) && kendra_between(c, L(c, 1), 'Ju') && kendra_between(c, L(c, 1), 'Ve'));
R(179, 'named', 'L9 in 2, L2 in 9, L1 in a kendra or trikona', c => H(c, L(c, 9)) === 2 && H(c, L(c, 2)) === 9 && KT.has(H(c, L(c, 1))));
R(180, 'named', 'very strong L1; L9 in a kendra in own, moolatrikona or exaltation sign', c => very_strong(c, L(c, 1)) && KENDRA.has(H(c, L(c, 9))) && (own_or_ex(c, L(c, 9)) || c.sign[L(c, 9)] === MOOLA[L(c, 9)]));
R(181, 'named', 'day birth; Lagna, Moon and Sun in odd signs', c => c.day_birth === true && all([c.asc, c.sign.Mo, c.sign.Su], s => s % 2 === 0));
R(182, 'named', 'night birth; Lagna, Moon and Sun in even signs', c => c.day_birth === false && all([c.asc, c.sign.Mo, c.sign.Su], s => s % 2 === 1));
R(183, 'daridra', 'Saturn and Moon together in 9, L1 debilitated', c => together(c, ['Sa', 'Mo'], S(9)) && debil(c, L(c, 1)), F.fin);
R(184, 'daridra', 'L10 with L3, and L10 weak, debilitated or combust', c => L(c, 10) !== L(c, 3) && c.conj(L(c, 10), L(c, 3)) && (weak(c, L(c, 10)) || debil(c, L(c, 10)) || c.combust(L(c, 10))), F.fin);
R(185, 'named', 'L10 in 1, 4, 7 or 10 conjunct a benefic', c => KENDRA.has(H(c, L(c, 10))) && any(BEN(c), b => b !== L(c, 10) && c.conj(b, L(c, 10))));
R(186, 'named', 'Moon conjunct Mars or in mutual aspect', c => c.conj('Mo', 'Ma') || c.mutual_aspect('Mo', 'Ma'));

// 199-256 named yogas
R(199, 'named', 'all 7 grahas in the four kendras, or all in movable signs', c => (all(SEVEN, p => KENDRA.has(H(c, p))) && all(KENDRA, h => c.in_house(h).length > 0))
  || (all(SEVEN, p => MOD.chara.has(c.sign[p])) && new Set(SEVEN.map(p => c.sign[p])).size === 4));
R(200, 'named', 'Mercury, Jupiter, Venus in kendras, trikonas or 2; Jupiter strong in own, friendly or exaltation sign', c => all(['Me', 'Ju', 'Ve'], p => KT.has(H(c, p)) || H(c, p) === 2) && c.strong('Ju') && (own_or_ex(c, 'Ju') || friendly_sign(c, 'Ju')));
R(201, 'named', 'Moon in 11, Sun in Cancer', c => H(c, 'Mo') === 11 && c.sign.Su === 3);
const EXL = d => LORD[EXALT[d]];
R(202, 'nicha_bhanga', 'lord of the debilitation sign of a debilitated planet in a kendra from Lagna or Moon', c => any(deb_planets(c).filter(d => LORD[c.sign[d]] !== d), d => KENDRA.has(H(c, LORD[c.sign[d]])) || KENDRA.has(c.from_ref(LORD[c.sign[d]], 'Mo'))));
R(203, 'nicha_bhanga', 'lord of the exaltation sign of a debilitated planet in a kendra from Lagna', c => any(deb_planets(c).filter(d => EXL(d) !== d), d => KENDRA.has(H(c, EXL(d)))));
R(204, 'nicha_bhanga', 'lord of the exaltation sign of a debilitated planet in a kendra from the Moon (not the Moon itself)', c => any(deb_planets(c), d => EXL(d) !== d && EXL(d) !== 'Mo' && KENDRA.has(c.from_ref(EXL(d), 'Mo'))));
R(205, 'nicha_bhanga', 'debilitated planet associated with (conjunct or aspected by) its dispositor', c => any(deb_planets(c), d => cor(c, d, LORD[c.sign[d]])));
R(206, 'nicha_bhanga', 'debilitated planet associated with its exaltation-sign lord', c => any(deb_planets(c), d => cor(c, d, EXL(d))));
R(207, 'nicha_bhanga', 'debilitated planet exchanges signs with its dispositor', c => any(deb_planets(c), d => c.exchange(d, LORD[c.sign[d]])));
R(208, 'nicha_bhanga', 'two debilitated planets aspect each other', c => { const ds = deb_planets(c); return any(ds, a => any(ds, b => a < b && c.mutual_aspect(a, b))); });
R(209, 'nicha_bhanga', 'debilitated planet conjunct an exalted planet', c => any(deb_planets(c), d => any(SEVEN, x => x !== d && exalted(c, x) && c.conj(d, x))));
R(210, 'named', 'strong L1; the other grahas in own or exaltation signs in kendras or trikonas', c => c.strong(L(c, 1)) && all(SEVEN.filter(p => p !== L(c, 1)), p => own_or_ex(c, p) && KT.has(H(c, p))));
R(211, 'named', 'exalted L7 in 10; L9 and L10 conjunct', c => exalted(c, L(c, 7)) && H(c, L(c, 7)) === 10 && L(c, 9) !== L(c, 10) && c.conj(L(c, 9), L(c, 10)));
R(212, 'named', 'L10 in 5; strong Mercury or Sun in own sign in a kendra', c => H(c, L(c, 10)) === 5 && any(['Me', 'Su'], p => c.strong(p) && own(c, p) && KENDRA.has(H(c, p))));
R(213, 'named', 'Jupiter and Mercury in 5 or 9 from the Moon, Mars in 11', c => all(['Ju', 'Me'], p => [5, 9].includes(c.from_ref(p, 'Mo'))) && H(c, 'Ma') === 11);
const onlyMalOcc = (c, h) => occupants(c, h).length > 0 && all(occupants(c, h), p => MAL(c).has(p));
R(214, 'named', 'benefics in 1 and 9, benefics and malefics in 5, only malefics in 4 and 8', c => ben_in(c, 1) && ben_in(c, 9) && ben_in(c, 5) && mal_in(c, 5) && all([4, 8], h => onlyMalOcc(c, h)));
R(215, 'named', 'malefics in 1 and 9, both kinds in 5, only malefics in 4 and 8', c => mal_in(c, 1) && mal_in(c, 9) && ben_in(c, 5) && mal_in(c, 5) && all([4, 8], h => onlyMalOcc(c, h)));
R(217, 'named', 'benefics in own, friendly or exaltation signs placed in 1, 3 and 11', c => all([1, 3, 11], h => any(BEN(c), b => c.house[b] === h && (own_or_ex(c, b) || friendly_sign(c, b)))));
R(218, 'named', 'Venus in a kendra in a fixed sign, Moon in 5 or 9 under benefic influence, Saturn in 10', c => KENDRA.has(H(c, 'Ve')) && MOD.sthira.has(c.sign.Ve) && [5, 9].includes(H(c, 'Mo')) && any([...BEN(c)].filter(b => b !== 'Mo'), b => cor(c, 'Mo', b)) && H(c, 'Sa') === 10);
R(219, 'named', 'Jupiter in Lagna, Moon in 7, Sun 8th from the Moon', c => H(c, 'Ju') === 1 && H(c, 'Mo') === 7 && c.from_ref('Su', 'Mo') === 8);
R(220, 'named', 'Jupiter in 2 or 5, conjunct or aspected by Mercury and Venus', c => [2, 5].includes(H(c, 'Ju')) && cor(c, 'Ju', 'Me') && cor(c, 'Ju', 'Ve'));
R(221, 'named', 'Jupiter in 2 or 5 in a sign of Mercury or Venus', c => [2, 5].includes(H(c, 'Ju')) && ['Me', 'Ve'].includes(LORD[c.sign.Ju]));
for (const [no, ref, hs] of [[222, 2, [2, 8, 12]], [223, 7, [4, 8, 9]], [225, 1, [2, 10, 11]]])
  R(no, 'named.hari_hara_brahma', `benefics in ${hs.join(', ')} from L${ref}`, c => all(hs, h => any(BEN(c), b => c.from_ref(b, L(c, ref)) === h)));
R(224, 'named.hari_hara_brahma', 'Jupiter, Moon, Mercury in 4, 9, 8 from L7', c => c.from_ref('Ju', L(c, 7)) === 4 && c.from_ref('Mo', L(c, 7)) === 9 && c.from_ref('Me', L(c, 7)) === 8);
R(226, 'named.hari_hara_brahma', 'Sun, Venus, Mars in 2, 10, 11 from L1', c => c.from_ref('Su', L(c, 1)) === 2 && c.from_ref('Ve', L(c, 1)) === 10 && c.from_ref('Ma', L(c, 1)) === 11);
R(229, 'named', 'Mercury 2nd from Sun, Moon 11th from Mercury, Jupiter in trine from Moon', c => c.from_ref('Me', 'Su') === 2 && c.from_ref('Mo', 'Me') === 11 && [5, 9].includes(c.from_ref('Ju', 'Mo')));
R(230, 'named', 'Mars 3rd from Moon, Saturn 7th from Mars, Venus 7th from Saturn, Jupiter 7th from Venus', c => c.from_ref('Ma', 'Mo') === 3 && c.from_ref('Sa', 'Ma') === 7 && c.from_ref('Ve', 'Sa') === 7 && c.from_ref('Ju', 'Ve') === 7);
R(231, 'named', 'Mars 3rd from Moon, Saturn 12th from Mars, Venus 7th from Saturn, Jupiter 7th from Venus', c => c.from_ref('Ma', 'Mo') === 3 && c.from_ref('Sa', 'Ma') === 12 && c.from_ref('Ve', 'Sa') === 7 && c.from_ref('Ju', 'Ve') === 7);
R(232, 'named', 'L5 and L11 exchange, Moon in 5', c => c.exchange(L(c, 5), L(c, 11)) && H(c, 'Mo') === 5);
R(234, 'named', 'Jupiter in trine from Venus, Moon 5th from Jupiter, Sun in a kendra from Moon', c => [5, 9].includes(c.from_ref('Ju', 'Ve')) && c.from_ref('Mo', 'Ju') === 5 && KENDRA.has(c.from_ref('Su', 'Mo')));
R(235, 'named', 'Jupiter in Lagna, Moon in a kendra from Jupiter, Rahu 2nd from Moon, Sun and Mars in 3', c => H(c, 'Ju') === 1 && KENDRA.has(c.from_ref('Mo', 'Ju')) && c.from_ref('Ra', 'Mo') === 2 && H(c, 'Su') === 3 && H(c, 'Ma') === 3);
for (const [no, hs] of [[236, [2, 6, 8, 12]], [238, [1, 5, 7, 9]], [239, [7, 10, 11]]])
  R(no, 'named', `all 7 grahas in houses ${hs.join(', ')}`, c => all(SEVEN, p => hs.includes(H(c, p))));
R(237, 'named', 'all malefics in 8 and all benefics in Lagna', c => all(MAL7(c), m => H(c, m) === 8) && all(BEN(c), b => H(c, b) === 1));
R(240, 'named', 'all malefics in kendras', c => all(MAL7(c), m => KENDRA.has(H(c, m))));
R(241, 'named', 'all benefics in kendras', c => all(BEN(c), b => KENDRA.has(H(c, b))));
R(242, 'named', 'Moon conjunct Rahu, aspected by Jupiter which is with malefics', c => c.conj('Mo', 'Ra') && c.aspects('Ju', c.sign.Mo) && any(MAL(c), m => m !== 'Ju' && c.conj('Ju', m)));
R(243, 'named', 'Jupiter, Venus, Mercury and Moon in Lagna or other kendras', c => all(['Ju', 'Ve', 'Me', 'Mo'], p => KENDRA.has(H(c, p))));
R(244, 'named', 'a malefic in Lagna (wording truncated)', c => mal_in(c, 1));
R(246, 'named', 'L1 with Rahu, Saturn or Ketu', c => any(['Ra', 'Sa', 'Ke'], x => x !== L(c, 1) && c.conj(L(c, 1), x)));
R(247, 'named', "lord of L10's navamsha sign joins L1 in 10", c => nav_lord(c, L(c, 10)) !== L(c, 1) && H(c, nav_lord(c, L(c, 10))) === 10 && H(c, L(c, 1)) === 10);
R(248, 'named', 'L1 and L7 exchange, one of them with Venus', c => c.exchange(L(c, 1), L(c, 7)) && any([L(c, 1), L(c, 7)], x => x !== 'Ve' && c.conj(x, 'Ve')));
R(249, 'named', 'Venus at deep exaltation in 7, aspecting or aspected by L7', c => H(c, 'Ve') === 7 && deep_ex(c, 'Ve') && L(c, 7) !== 'Ve' && (c.aspects(L(c, 7), c.sign.Ve) || c.aspects('Ve', c.sign[L(c, 7)])));
for (const [no, h] of [[250, 2], [251, 5], [252, 11]])
  R(no, 'named', `lord of L${h}'s navamsha sign exalted and joined with (or being) L9`, c => { const n = nav_lord(c, L(c, h)); return exalted(c, n) && (n === L(c, 9) || c.conj(n, L(c, 9))); });
R(253, 'named', 'L1 exalted and L4, L10 exchange', c => exalted(c, L(c, 1)) && c.exchange(L(c, 4), L(c, 10)));
R(254, 'named', 'Venus, Jupiter and Saturn in kendras, Saturn exalted, movable Lagna', c => all(['Ve', 'Ju', 'Sa'], p => KENDRA.has(H(c, p))) && exalted(c, 'Sa') && MOD.chara.has(c.asc));
R(255, 'named', 'Pisces Lagna, Saturn in Aquarius, Mars in 11', c => c.asc === 11 && c.sign.Sa === 10 && H(c, 'Ma') === 11);

// Karmajiva 349-381
const KJ = { Su: [349, [350, 'L Mo'], [351, 'Mo L'], null], Mo: [352, [353, 'Su L'], [354, 'Su L'], [355, 'L Su']],
  Ma: [356, [357, 'L Mo Su'], [358, 'L Mo Su'], [359, 'L Mo Su']], Me: [360, [361, 'L Mo'], [362, 'L Mo Su'], [363, 'L Mo Su']],
  Ju: [364, [365, 'L Mo Su'], [366, 'L Mo Su'], [367, 'L Mo Su']], Ve: [368, [369, 'L Mo'], [370, 'L Mo Su'], [371, 'L Mo Su']],
  Sa: [372, [373, 'L Mo Su'], [374, 'L Mo Su'], [375, 'L Mo Su']] };
for (const p of Object.keys(KJ)) {
  const [nno, [ino, irefs], [rno, rrefs], asp] = KJ[p];
  R(nno, 'karmajiva', `lord of L10's navamsha sign is ${p}`, c => nav_lord(c, L(c, 10)) === p);
  const irs = irefs.split(' '), rrs = rrefs.split(' ');
  R(ino, 'karmajiva', `${p} in 10 from ${irs.join(' or ')}`, c => any(irs, r => r !== p && c.sign[p] === sign_from(c, ref_sign(c, r), 10)));
  R(rno, 'karmajiva', `${p} rules 10 from ${rrs.join(' or ')}`, c => any(rrs, r => LORD[sign_from(c, ref_sign(c, r), 10)] === p));
  if (asp) {
    const ars = asp[1].split(' ');
    R(asp[0], 'karmajiva', `${p} aspects or conjoins the lord of 10 from ${ars.join(' or ')}`,
      c => any(ars, r => { const l = LORD[sign_from(c, ref_sign(c, r), 10)]; return l !== p && (c.aspects(p, c.sign[l]) || (PARAMS.karmajiva_aspect_includes_conj && c.conj(p, l))); }));
  }
}
for (const [no, m] of [[376, 'chara'], [377, 'sthira'], [378, 'dual']])
  R(no, 'karmajiva', `L10 in a ${m} sign in rashi and navamsha`, c => MOD[m].has(c.sign[L(c, 10)]) && MOD[m].has(c.d9(L(c, 10))));
R(379, 'karmajiva', '10th from the Moon holds a very strong Mercury free of malefic aspect', c => c.from_ref('Me', 'Mo') === 10 && very_strong(c, 'Me') && !asp_by_any(c, 'Me', MAL(c)));
R(380, 'karmajiva', '10th from the Moon holds Mercury in own sign free of malefic aspect', c => c.from_ref('Me', 'Mo') === 10 && own(c, 'Me') && !asp_by_any(c, 'Me', MAL(c)));
R(381, 'karmajiva', '10th from Lagna holds a very strong Mercury free of malefic aspect', c => H(c, 'Me') === 10 && very_strong(c, 'Me') && !asp_by_any(c, 'Me', MAL(c)));

// 382-397 named
R(382, 'named', 'L9 from 11 in 11 with Moon, aspected by L11', c => { const l = LORD[sign_from(c, ksign(11, c), 9)]; return H(c, l) === 11 && c.conj(l, 'Mo') && L(c, 11) !== l && c.aspects(L(c, 11), c.sign[l]); });
R(383, 'named', 'fixed Lagna; L1-L11 exchange and L2-L10 exchange', c => MOD.sthira.has(c.asc) && c.exchange(L(c, 1), L(c, 11)) && c.exchange(L(c, 2), L(c, 10)));
R(384, 'named', 'Jupiter 9th from L9, a benefic 9th from Jupiter, Saturn in 10', c => c.from_ref('Ju', L(c, 9)) === 9 && any([...BEN(c)].filter(b => b !== 'Ju'), b => c.from_ref(b, 'Ju') === 9) && H(c, 'Sa') === 10);
R(385, 'named', 'navamsha lords of L6 and L9 both conjunct the Sun', c => all([nav_lord(c, L(c, 6)), nav_lord(c, L(c, 9))], n => n !== 'Su' && c.conj(n, 'Su')));
R(387, 'named', 'L6 debilitated, L10 at deep exaltation', c => debil(c, L(c, 6)) && deep_ex(c, L(c, 10)));
R(388, 'named', 'L11 at deep exaltation conjunct Venus in a kendra from L1', c => deep_ex(c, L(c, 11)) && L(c, 11) !== 'Ve' && c.conj(L(c, 11), 'Ve') && kendra_between(c, L(c, 11), L(c, 1)));
R(389, 'named', 'L10 in 3, 7 or 11; L1 with Jupiter; Sun deeply exalted; Moon in 9', c => [3, 7, 11].includes(H(c, L(c, 10))) && assoc(c, L(c, 1), 'Ju') && deep_ex(c, 'Su') && H(c, 'Mo') === 9);
R(390, 'named', 'L5 in 9, L9 in 10, L10 in 5', c => H(c, L(c, 5)) === 9 && H(c, L(c, 9)) === 10 && H(c, L(c, 10)) === 5);
R(391, 'named', "L9's navamsha lord joins L10 and L9 in 2", c => all([nav_lord(c, L(c, 9)), L(c, 10), L(c, 9)], x => H(c, x) === 2));
R(392, 'named', 'Jupiter in a kendra from L9, Venus in a kendra from L11, Mercury in a kendra from L1 or L10', c => kendra_between(c, 'Ju', L(c, 9)) && kendra_between(c, 'Ve', L(c, 11)) && (kendra_between(c, 'Me', L(c, 1)) || kendra_between(c, 'Me', L(c, 10))));
R(393, 'named', 'Sun in 10, L10 conjunct Saturn in 3', c => H(c, 'Su') === 10 && H(c, L(c, 10)) === 3 && H(c, 'Sa') === 3);
R(394, 'named', "lord of the Moon's navamsha exalted; day birth, waxing Moon", c => exalted(c, nav_lord(c, 'Mo')) && c.day_birth === true && c.waxing);
R(395, 'named', 'strong Jupiter in moolatrikona with L2, L1 exalted', c => c.strong('Ju') && c.sign.Ju === MOOLA.Ju && (L(c, 2) === 'Ju' || c.conj('Ju', L(c, 2))) && exalted(c, L(c, 1)));
R(397, 'named', 'Sun, Moon and Mars in mutual trines', c => { const t = ['Su', 'Mo', 'Ma']; return all(t, a => all(t, b => [1, 5, 9].includes(c.from_ref(a, b)))) && new Set(t.map(p => c.sign[p])).size === 3; });

// Bhava yogas 398-540
const conjMal = (c, x) => any(MAL(c), m => m !== x && c.conj(m, x));
const conjBen = (c, x) => any(BEN(c), b => b !== x && c.conj(b, x));
const isOrConj = (c, x, y) => x === y || c.conj(x, y);
R(398, 'bhava.1', 'L1, Jupiter or Venus in a kendra', c => any([L(c, 1), 'Ju', 'Ve'], p => KENDRA.has(H(c, p))));
R(399, 'bhava.1', 'L1 in a movable sign aspected by a benefic', c => MOD.chara.has(c.sign[L(c, 1)]) && asp_by_any(c, L(c, 1), BEN(c)));
R(400, 'bhava.1', 'L1 conjunct a malefic or in 8', c => conjMal(c, L(c, 1)) || H(c, L(c, 1)) === 8, F.health);
R(401, 'bhava.1', 'L1 in Lagna conjunct L6, L8 or L12', c => H(c, L(c, 1)) === 1 && any(DUSTHANA, h => L(c, h) !== L(c, 1) && c.conj(L(c, 1), L(c, h))), F.health);
R(402, 'bhava.1', 'weak L1 in a kendra or trikona', c => weak(c, L(c, 1)) && KT.has(H(c, L(c, 1))), F.health);
R(403, 'bhava.1', 'L1 in a dry (fiery) sign or a sign ruled by a dry planet', c => DRY_SIGNS.has(c.sign[L(c, 1)]) || DRY_PLANETS.has(LORD[c.sign[L(c, 1)]]));
R(404, 'bhava.1', 'lord of navamsha Lagna a dry planet and malefics in Lagna', c => DRY_PLANETS.has(LORD[nav_asc(c)]) && mal_in(c, 1));
R(405, 'bhava.1', "L1 and L1's navamsha lord in watery signs", c => WATERY.has(c.sign[L(c, 1)]) && WATERY.has(c.sign[nav_lord(c, L(c, 1))]));
R(406, 'bhava.1', 'Jupiter in Lagna, or aspecting Lagna from a watery sign', c => H(c, 'Ju') === 1 || (WATERY.has(c.sign.Ju) && c.aspects('Ju', c.asc)));
R(407, 'bhava.1', 'watery Lagna with benefics, or L1 a watery planet', c => (WATERY.has(c.asc) && ben_in(c, 1)) || WATERY_PLANETS.has(L(c, 1)));
R(408, 'bhava.1', 'L1 or the dispositor of L1 in a movable sign', c => MOD.chara.has(c.sign[L(c, 1)]) || MOD.chara.has(c.sign[LORD[c.sign[L(c, 1)]]]));
R(410, 'bhava.2', 'L2 in a sign of Saturn or Mars, malefics in kendras and trikonas', c => ['Sa', 'Ma'].includes(LORD[c.sign[L(c, 2)]]) && any(MAL(c), m => KENDRA.has(H(c, m))) && any(MAL(c), m => TRIKONA.has(H(c, m))));
R(411, 'bhava.2', 'L2 in 10 with malefics, or L2 conjunct the Sun (Mandi branches not evaluated)', c => (H(c, L(c, 2)) === 10 && conjMal(c, L(c, 2))) || (L(c, 2) !== 'Su' && c.conj(L(c, 2), 'Su')));
R(412, 'bhava.2', 'L2 in 8 with Jupiter', c => H(c, L(c, 2)) === 8 && isOrConj(c, L(c, 2), 'Ju'), F.health);
R(414, 'bhava.2', 'Mercury and Moon in 2, or L1 and L2 conjunct the Sun in 2', c => together(c, ['Me', 'Mo'], S(2)) || (H(c, 'Su') === 2 && all([L(c, 1), L(c, 2)], x => x === 'Su' || c.conj(x, 'Su'))), F.health);
R(415, 'bhava.2', 'Mars in 2, Moon in 6, Saturn in 12, Sun in 8', c => H(c, 'Ma') === 2 && H(c, 'Mo') === 6 && H(c, 'Sa') === 12 && H(c, 'Su') === 8, F.health);
R(416, 'bhava.2', 'L2 in a kendra aspected by benefics, or benefics in 2', c => (KENDRA.has(H(c, L(c, 2))) && asp_by_any(c, L(c, 2), BEN(c))) || ben_in(c, 2));
R(417, 'bhava.2', 'L2 in a kendra in own, friendly or exaltation sign, and a kendra lord in Gopuramsha', c => KENDRA.has(H(c, L(c, 2))) && (own_or_ex(c, L(c, 2)) || friendly_sign(c, L(c, 2))) && any(KENDRA, h => title(c, L(c, h), 'Gopura')));
R(418, 'bhava.2', 'malefics in 2, and L2 debilitated or with a malefic', c => mal_in(c, 2) && (debil(c, L(c, 2)) || conjMal(c, L(c, 2))));
R(419, 'bhava.2', 'L2 a malefic, conjunct malefics or in an unfriendly/debilitation navamsha', c => MAL(c).has(L(c, 2)) && (conjMal(c, L(c, 2)) || NAT_ENEMIES[L(c, 2)].has(nav_lord(c, L(c, 2))) || c.d9(L(c, 2)) === DEBIL[L(c, 2)]));
R(423, 'bhava.2', 'Saturn is L2 or conjunct L2, or house 2 / L2 aspected by a debilitated Saturn', c => L(c, 2) === 'Sa' || c.conj('Sa', L(c, 2)) || (debil(c, 'Sa') && (c.aspects('Sa', ksign(2, c)) || c.aspects('Sa', c.sign[L(c, 2)]))));
R(426, 'bhava.2', 'a malefic in 2 in a malefic navamsha, house 2 without benefic or benefic aspect', c => any(MAL7(c), m => H(c, m) === 2 && mal_nav(c, m)) && !ben_in(c, 2) && !any(BEN(c), b => c.aspects(b, ksign(2, c))));
R(427, 'bhava.2', 'house 2 holds or is aspected by malefics, and L2 in a malefic navamsha aspected by a malefic', c => house_afflicted(c, 2) && mal_nav(c, L(c, 2)) && asp_by_any(c, L(c, 2), MAL(c)));
R(428, 'bhava.3', 'L3, Mars or house 3 conjunct or aspected by benefics', c => any([L(c, 3), 'Ma'], x => any(BEN(c), b => cor(c, x, b))) || ben_in(c, 3) || any(BEN(c), b => c.aspects(b, ksign(3, c))));
for (const [no, hs] of [[429, [8]], [430, [3]], [431, [4, 7]]])
  R(no, 'bhava.3', `Mars and L3 in ${hs.join(', ')} aspected by malefics`, c => hs.includes(H(c, 'Ma')) && hs.includes(H(c, L(c, 3))) && asp_by_any(c, 'Ma', MAL(c)), F.fam);
R(432, 'bhava.3', 'Mars and L3 in 6, 8 or 12, afflicted by malefics', c => DUSTHANA.has(H(c, 'Ma')) && DUSTHANA.has(H(c, L(c, 3))) && afflicted(c, 'Ma') && afflicted(c, L(c, 3)), F.fam);
R(433, 'bhava.3', "L3's navamsha dispositor debilitated in 8", c => { const n = nav_lord(c, L(c, 3)); return debil(c, n) && H(c, n) === 8; }, F.fam);
R(434, 'bhava.3', 'Mercury in 3, L3 with Moon, weak Mars with Saturn', c => H(c, 'Me') === 3 && isOrConj(c, L(c, 3), 'Mo') && weak(c, 'Ma') && c.conj('Ma', 'Sa'));
R(435, 'bhava.3', 'L3 in a kendra, exalted Mars with Jupiter in a trikona from L3', c => KENDRA.has(H(c, L(c, 3))) && exalted(c, 'Ma') && c.conj('Ma', 'Ju') && [5, 9].includes(c.from_ref('Ma', L(c, 3))));
R(436, 'bhava.3', 'L12 with Mars and Moon and Jupiter in 3, no aspect from Venus', c => all([L(c, 12), 'Ma', 'Mo', 'Ju'], x => H(c, x) === 3) && !c.aspects('Ve', ksign(3, c)));
R(437, 'bhava.3', 'L3 in a benefic navamsha conjunct or aspected by benefics, Mars in a benefic sign', c => ben_nav(c, L(c, 3)) && any(BEN(c), b => cor(c, L(c, 3), b)) && NB.has(LORD[c.sign.Ma]));
R(438, 'bhava.3', 'L3 exalted in 8 with malefics in movable signs', c => exalted(c, L(c, 3)) && H(c, L(c, 3)) === 8 && MOD.chara.has(c.sign[L(c, 3)]) && conjMal(c, L(c, 3)));
R(440, 'bhava.3', 'house 3 a benefic sign aspected by benefics, L3 in a benefic navamsha', c => NB.has(LORD[ksign(3, c)]) && any(BEN(c), b => c.aspects(b, ksign(3, c))) && ben_nav(c, L(c, 3)));
R(441, 'bhava.4', 'L4 in a kendra or trikona with benefics', c => KT.has(H(c, L(c, 4))) && conjBen(c, L(c, 4)));
R(442, 'bhava.4', 'L4 and L10 together with Saturn and Mars', c => all([L(c, 10), 'Sa', 'Ma'], x => x === L(c, 4) || c.conj(x, L(c, 4))));
R(443, 'bhava.4', 'L1 and L7 in 1 or 4 with benefic aspect', c => all([L(c, 1), L(c, 7)], x => [1, 4].includes(H(c, x)) && asp_by_any(c, x, BEN(c))));
R(444, 'bhava.4', 'L9 in a kendra, L4 in own, moolatrikona or exaltation sign', c => KENDRA.has(H(c, L(c, 9))) && (own_or_ex(c, L(c, 4)) || c.sign[L(c, 4)] === MOOLA[L(c, 4)]));
R(445, 'bhava.4', 'L4 in 12 with malefic aspect', c => H(c, L(c, 4)) === 12 && asp_by_any(c, L(c, 4), MAL(c)));
R(446, 'bhava.4', "lord of L4's navamsha in 12", c => H(c, nav_lord(c, L(c, 4))) === 12);
R(447, 'bhava.4', 'L4 a benefic aspected by a benefic, Mercury in Lagna', c => BEN(c).has(L(c, 4)) && asp_by_any(c, L(c, 4), BEN(c)) && H(c, 'Me') === 1);
R(448, 'bhava.4', 'house 4 or L4 associated with or aspected by Jupiter', c => H(c, 'Ju') === 4 || c.aspects('Ju', ksign(4, c)) || assoc(c, L(c, 4), 'Ju'));
R(449, 'bhava.4', 'L4 connected to malefics, or in an enemy or debilitation sign', c => any(MAL(c), m => assoc(c, L(c, 4), m)) || debil(c, L(c, 4)) || NAT_ENEMIES[L(c, 4)].has(LORD[c.sign[L(c, 4)]]), F.fam);
R(450, 'bhava.4', 'benefic in 4, L4 exalted, Moon strong', c => ben_in(c, 4) && exalted(c, L(c, 4)) && c.strong('Mo'), F.fam);
R(451, 'bhava.4', "lord of L4's navamsha strong and in a kendra from Lagna or Moon", c => { const n = nav_lord(c, L(c, 4)); return c.strong(n) && (KENDRA.has(H(c, n)) || KENDRA.has(c.from_ref(n, 'Mo'))); }, F.fam);
R(452, 'bhava.4', 'Moon hemmed between malefics, or conjunct or aspected by malefics', c => hemmed(c, c.sign.Mo) || afflicted(c, 'Mo'), ['death_longevity', 'fertility_family']);
R(453, 'bhava.4', 'Moon or Venus in a kendra afflicted by a malefic, and a malefic in 4', c => any(['Mo', 'Ve'], x => KENDRA.has(H(c, x)) && afflicted(c, x)) && mal_in(c, 4), F.fam);
R(454, 'bhava.4', 'L7 and Venus conjunct in 4, afflicted by malefics', c => H(c, 'Ve') === 4 && isOrConj(c, L(c, 7), 'Ve') && afflicted(c, 'Ve'), F.sex);
R(458, 'bhava.4', 'L4 afflicted or hemmed by malefics, and a malefic in 4', c => (afflicted(c, L(c, 4)) || hemmed(c, c.sign[L(c, 4)])) && mal_in(c, 4));
R(459, 'bhava.4', 'house 4 holds Saturn, Mars, Rahu and a malefic L10, with malefic aspect', c => all(['Sa', 'Ma', 'Ra', L(c, 10)], x => H(c, x) === 4) && MAL(c).has(L(c, 10)) && any(MAL(c), m => c.aspects(m, ksign(4, c))));
R(461, 'bhava.4', 'house 4 holds a benefic, or a planet in own, friendly or exaltation sign', c => ben_in(c, 4) || any(SEVEN, p => H(c, p) === 4 && (own_or_ex(c, p) || friendly_sign(c, p))));
R(462, 'bhava.4', 'L1 in 4 conjunct or aspected by a benefic, or in Paravata/Uttama amsha', c => H(c, L(c, 1)) === 4 && (any(BEN(c), b => cor(c, L(c, 1), b)) || title(c, L(c, 1), 'Paravata') || title(c, L(c, 1), 'Uttama')));
R(463, 'bhava.4', 'Gemini Lagna, Mercury afflicted by a malefic', c => c.asc === 2 && afflicted(c, 'Me'), F.fam);
R(464, 'bhava.4', 'Lagna and 4 share a ruler, or L1 and L4 are friends, or aspected by benefics', c => L(c, 1) === L(c, 4) || ((NAT_FRIENDS[L(c, 1)] || new Set()).has(L(c, 4)) && asp_by_any(c, L(c, 1), BEN(c))));
R(465, 'bhava.4', 'L1 in 4, 9 or 11', c => [4, 9, 11].includes(H(c, L(c, 1))));
R(466, 'bhava.4', 'L4 exalted and its exaltation-sign lord in a kendra or trikona', c => exalted(c, L(c, 4)) && KT.has(H(c, LORD[c.sign[L(c, 4)]])));
R(467, 'bhava.5', 'Jupiter, L1, L5 and L7 all weak', c => all(new Set(['Ju', L(c, 1), L(c, 5), L(c, 7)]), p => weak(c, p)), F.fam);
R(468, 'bhava.5', 'Rahu in 5 aspected by Mars, or Mars rules a 5th that holds Rahu', c => H(c, 'Ra') === 5 && (c.aspects('Ma', ksign(5, c)) || L(c, 5) === 'Ma'), F.fam);
R(469, 'bhava.5', 'L5 with Rahu, Saturn in 5 conjunct or aspected by the Moon', c => c.conj(L(c, 5), 'Ra') && H(c, 'Sa') === 5 && cor(c, 'Sa', 'Mo'), F.fam);
R(470, 'bhava.5', 'Jupiter with Mars, Rahu in Lagna, L5 in 6, 8 or 12', c => c.conj('Ju', 'Ma') && H(c, 'Ra') === 1 && DUSTHANA.has(H(c, L(c, 5))), F.fam);
R(471, 'bhava.5', 'Mars rules 5, which holds Rahu conjunct or aspected by Mercury', c => L(c, 5) === 'Ma' && H(c, 'Ra') === 5 && cor(c, 'Ra', 'Me'), F.fam);
R(472, 'bhava.5', 'debilitated Sun in 5, or Sun in 5 hemmed by malefics', c => H(c, 'Su') === 5 && (debil(c, 'Su') || hemmed(c, c.sign.Su)), F.fam);
R(473, 'bhava.5', 'L8 and L5 exchange, Moon and L4 together in 6', c => c.exchange(L(c, 8), L(c, 5)) && H(c, 'Mo') === 6 && H(c, L(c, 4)) === 6, F.fam);
R(474, 'bhava.5', 'L1 and L5 in 8, L3 in 5 with Rahu and Mars', c => H(c, L(c, 1)) === 8 && H(c, L(c, 5)) === 8 && all([L(c, 3), 'Ra', 'Ma'], x => H(c, x) === 5), F.fam);
R(475, 'bhava.5', 'Sun and Saturn in 5, weak Moon in 7, Rahu in Lagna, Jupiter in 12', c => H(c, 'Su') === 5 && H(c, 'Sa') === 5 && H(c, 'Mo') === 7 && weak(c, 'Mo') && H(c, 'Ra') === 1 && H(c, 'Ju') === 12, F.fam);
R(476, 'bhava.5', 'Rahu in 5, not in a Saturn navamsha', c => H(c, 'Ra') === 5 && nav_lord(c, 'Ra') !== 'Sa', F.fam);
R(477, 'bhava.5', 'house 5 holds or is aspected by a benefic', c => ben_in(c, 5) || any(BEN(c), b => c.aspects(b, ksign(5, c))), F.fam);
R(478, 'bhava.5', 'Jupiter aspects Lagna, Sun or Moon', c => c.aspects('Ju', c.asc) || c.aspects('Ju', c.sign.Su) || c.aspects('Ju', c.sign.Mo), F.fam);
R(479, 'bhava.5', 'Mercury rules 5 and is in 5, aspected by Saturn, not by Jupiter, Mars or Sun', c => L(c, 5) === 'Me' && H(c, 'Me') === 5 && c.aspects('Sa', ksign(5, c)) && !any(['Ju', 'Ma', 'Su'], x => c.aspects(x, ksign(5, c))), F.fam);
R(480, 'bhava.5', 'Mercury rules 5 and is in 5, which is aspected by Saturn', c => L(c, 5) === 'Me' && H(c, 'Me') === 5 && c.aspects('Sa', ksign(5, c)), F.fam);
R(481, 'bhava.5', 'Mercury rules 5, aspected by Saturn and not by Jupiter, Mars or Sun', c => L(c, 5) === 'Me' && c.aspects('Sa', ksign(5, c)) && !any(['Ju', 'Ma', 'Su'], x => c.aspects(x, ksign(5, c))), F.fam);
for (const [no, lord] of [[482, 'Sa'], [483, 'Me']])
  R(no, 'bhava.5', `${lord} is L5, in 5, aspected by the Moon`, c => L(c, 5) === lord && H(c, lord) === 5 && c.aspects('Mo', ksign(5, c)), F.fam);
R(484, 'bhava.5', 'Mars and Saturn in 5, L1 in a Mercury sign conjunct or aspected by Mercury', c => H(c, 'Ma') === 5 && H(c, 'Sa') === 5 && LORD[c.sign[L(c, 1)]] === 'Me' && (L(c, 1) === 'Me' || cor(c, L(c, 1), 'Me')), F.fam);
R(485, 'bhava.5', 'L7 in 11, L5 with a benefic, Mars and Saturn in 5', c => H(c, L(c, 7)) === 11 && conjBen(c, L(c, 5)) && H(c, 'Ma') === 5 && H(c, 'Sa') === 5, F.fam);
R(486, 'bhava.5', 'house 5 in Gemini, Virgo, Capricorn or Aquarius, occupied or aspected by Saturn (Mandi not evaluated)', c => [2, 5, 9, 10].includes(ksign(5, c)) && (H(c, 'Sa') === 5 || c.aspects('Sa', ksign(5, c))), F.fam);
R(487, 'bhava.5', 'weak L5, unconnected with L1 and L7', c => weak(c, L(c, 5)) && !any([1, 7], h => assoc(c, L(c, 5), L(c, h))), F.fam);
R(488, 'bhava.5', 'house 10 and L10 with or aspected by Saturn', c => L(c, 10) !== 'Sa' && (H(c, 'Sa') === 10 || c.aspects('Sa', ksign(10, c))) && cor(c, L(c, 10), 'Sa'), F.fam);
const onlySatAspectsMoon = c => setEq(aspectors(c, 'Mo'), S('Sa'));
for (const [no, cond, fn] of [[491, 'Moon in 5 aspected only by Saturn, 5th-house navamsha of Mars (cusp read as mid-sign)', c => H(c, 'Mo') === 5 && onlySatAspectsMoon(c) && midNavLord(c, 5) === 'Ma'],
  [492, 'Moon in 5 aspected only by Saturn, Moon in a Mars navamsha', c => H(c, 'Mo') === 5 && onlySatAspectsMoon(c) && nav_lord(c, 'Mo') === 'Ma']]) {
  R(no, 'bhava.5', cond, fn, F.fam);
  R(no + 3, 'bhava.5', cond + ' (duplicate entry)', fn, F.fam);
}
for (const no of [498, 501]) R(no, 'bhava.5', 'Moon in 7 with the Sun or aspected by the Sun', c => H(c, 'Mo') === 7 && cor(c, 'Mo', 'Su'), F.fam);
for (const no of [499, 502]) R(no, 'bhava.5', 'Moon in 5 with the Sun or aspected by the Sun', c => H(c, 'Mo') === 5 && cor(c, 'Mo', 'Su'), F.fam);
for (const no of [500, 503]) R(no, 'bhava.5', 'house 5 is Cancer and the Sun is in or aspects 5', c => ksign(5, c) === 3 && (H(c, 'Su') === 5 || c.aspects('Su', 3)), F.fam);
R(505, 'bhava.5', 'house 5 (mid-sign) in a Venus navamsha, aspected by Venus', c => midNavLord(c, 5) === 'Ve' && c.aspects('Ve', ksign(5, c)), F.fam);
R(506, 'bhava.5', 'house 5 (mid-sign) in a Moon navamsha, aspected by the Moon', c => midNavLord(c, 5) === 'Mo' && c.aspects('Mo', ksign(5, c)), F.fam);
R(507, 'bhava.5', 'Jupiter exalted in 5', c => exalted(c, 'Ju') && H(c, 'Ju') === 5, F.fam);
R(508, 'bhava.5', 'Saturn in Cancer in 5', c => c.sign.Sa === 3 && H(c, 'Sa') === 5, F.fam);
R(509, 'bhava.5', 'Sun in 5 in Scorpio, Leo or Virgo; Saturn in 8, Mars in Lagna', c => H(c, 'Su') === 5 && [7, 4, 5].includes(c.sign.Su) && H(c, 'Sa') === 8 && H(c, 'Ma') === 1, F.fam);
R(510, 'bhava.5', 'house 5 in Scorpio, Leo or Virgo; Saturn in 1, Jupiter in 8, Mars in 12', c => [7, 4, 5].includes(ksign(5, c)) && H(c, 'Sa') === 1 && H(c, 'Ju') === 8 && H(c, 'Ma') === 12, F.fam);
R(511, 'bhava.5', 'house 5 a malefic sign with strong malefics, no benefic aspect', c => NM.has(LORD[ksign(5, c)]) && any(MAL7(c), m => H(c, m) === 5 && c.strong(m)) && !any(BEN(c), b => c.aspects(b, ksign(5, c))), F.fam);
R(512, 'bhava.5', 'L5 in 6, 8 or 12, no full or waxing Moon in 5', c => DUSTHANA.has(H(c, L(c, 5))) && !(H(c, 'Mo') === 5 && c.waxing), F.fam);
R(513, 'bhava.5', 'L5 in a kendra or trikona', c => KT.has(H(c, L(c, 5))), F.fam);
R(515, 'bhava.5', 'Jupiter in 5, L5 conjunct Venus', c => H(c, 'Ju') === 5 && isOrConj(c, L(c, 5), 'Ve'), F.fam);
R(516, 'bhava.5', 'Jupiter in 9, Venus in 5 with L1', c => H(c, 'Ju') === 9 && H(c, 'Ve') === 5 && isOrConj(c, L(c, 1), 'Ve'), F.fam);
R(517, 'bhava.5', 'Rahu in 5, L5 with a malefic, Jupiter debilitated', c => H(c, 'Ra') === 5 && conjMal(c, L(c, 5)) && debil(c, 'Ju'), F.fam);
R(518, 'bhava.5', 'malefics in 5 from Jupiter and in 5 from Lagna', c => any(MAL(c), m => c.from_ref(m, 'Ju') === 5) && mal_in(c, 5), F.fam);
R(519, 'bhava.5', 'L5 a benefic, aspected by a benefic or in a benefic sign', c => BEN(c).has(L(c, 5)) && (asp_by_any(c, L(c, 5), BEN(c)) || NB.has(LORD[c.sign[L(c, 5)]])));
R(520, 'bhava.5', 'lord of the navamsha of a benefic L5 aspected by benefics', c => BEN(c).has(L(c, 5)) && asp_by_any(c, nav_lord(c, L(c, 5)), BEN(c)));
R(521, 'bhava.5', 'L1 afflicted, Saturn in 5 aspecting L1', c => afflicted(c, L(c, 1)) && H(c, 'Sa') === 5 && c.aspects('Sa', c.sign[L(c, 1)]));
R(523, 'bhava.5', 'Jupiter and Venus in 5, or Mercury in 5, or a benefic sign 5 with a benefic', c => (H(c, 'Ju') === 5 && H(c, 'Ve') === 5) || H(c, 'Me') === 5 || (NB.has(LORD[ksign(5, c)]) && ben_in(c, 5)), F.fam);
R(524, 'bhava.7', 'L10 in 10 with L2 and L7', c => H(c, L(c, 10)) === 10 && all([L(c, 2), L(c, 7)], x => x === L(c, 10) || c.conj(x, L(c, 10))), F.sex);
R(525, 'bhava.7', 'strong L5 and L7 conjunct with L6, aspected by benefics', c => c.strong(L(c, 5)) && c.strong(L(c, 7)) && c.conj(L(c, 5), L(c, 7)) && c.conj(L(c, 5), L(c, 6)) && asp_by_any(c, L(c, 5), BEN(c)), F.sex);
R(526, 'bhava.9', 'L10 in 9, strong or with benefics', c => H(c, L(c, 10)) === 9 && (c.strong(L(c, 10)) || conjBen(c, L(c, 10))));
R(527, 'bhava.9', "lord of L10's navamsha strong, and L9 and L10 linked", c => c.strong(nav_lord(c, L(c, 10))) && (related(c, L(c, 9), L(c, 10)) || c.exchange(L(c, 9), L(c, 10))));
R(530, 'bhava.7', 'L1 and L7 conjunct or in mutual aspect', c => related(c, L(c, 1), L(c, 7)), F.sex);
R(531, 'bhava.7', 'L7 or Venus conjunct or aspected by Jupiter or Mercury', c => any([L(c, 7), 'Ve'], x => any(['Ju', 'Me'], y => cor(c, x, y))));
R(532, 'bhava.7', 'L7 in 4 with Venus', c => H(c, L(c, 7)) === 4 && isOrConj(c, L(c, 7), 'Ve'), F.sex);
R(533, 'bhava.7', 'L1 debilitated in rashi or navamsha', c => debil(c, L(c, 1)) || c.d9(L(c, 1)) === DEBIL[L(c, 1)], F.sex);
R(534, 'bhava.9', 'a strong benefic in 1, 3 or 5 aspecting 9', c => any(BEN(c), b => [1, 3, 5].includes(H(c, b)) && c.strong(b) && c.aspects(b, ksign(9, c))));
for (const [no, x] of [[535, 'Su'], [536, 'Mo']])
  R(no, 'bhava.9', `${x} in 6, 8 or 12; L8 in 9, L12 in Lagna, L6 in 5`, c => DUSTHANA.has(H(c, x)) && H(c, L(c, 8)) === 9 && H(c, L(c, 12)) === 1 && H(c, L(c, 6)) === 5, ['death_longevity', 'fertility_family']);
R(539, 'bhava.9', 'L9 exalted with benefic aspect, a benefic in 9', c => exalted(c, L(c, 9)) && asp_by_any(c, L(c, 9), BEN(c)) && ben_in(c, 9));
R(540, 'bhava.10', 'house 10 holds the Sun and Saturn, aspected by malefics', c => H(c, 'Su') === 10 && H(c, 'Sa') === 10 && any(MAL(c), m => m !== 'Su' && m !== 'Sa' && c.aspects(m, ksign(10, c))));

// 745-874, 998-1001
const drekLagnaLord = c => LORD[VS.varga_sign(c.lon_asc, 3)];
R(745, 'named.fixed_chart', 'Moon Aries, Saturn Aquarius, Venus Capricorn, Sun Sagittarius', c => c.sign.Mo === 0 && c.sign.Sa === 10 && c.sign.Ve === 9 && c.sign.Su === 8);
R(746, 'daridra', 'all kendras occupied by benefics, a malefic in 2', c => all(KENDRA, h => ben_in(c, h)) && mal_in(c, 2), F.fin);
R(747, 'raja', 'Jupiter in Lagna or 5 with Moon in 10', c => [1, 5].includes(H(c, 'Ju')) && H(c, 'Mo') === 10);
R(748, 'named', 'a benefic in 8 aspected by another benefic', c => any(BEN(c), b => H(c, b) === 8 && asp_by_any(c, b, minus(BEN(c), S(b)))));
R(749, 'named', 'Sun, Moon and Saturn together in a kendra, 9 or 12; other planets weak', c => together(c, ['Su', 'Mo', 'Sa'], union(KENDRA, S(9, 12))) && all(['Ma', 'Me', 'Ju', 'Ve'], p => weak(c, p)));
R(750, 'kemadruma', 'L9 in 12, weak L12 in 2, malefic in 3', c => H(c, L(c, 9)) === 12 && H(c, L(c, 12)) === 2 && weak(c, L(c, 12)) && mal_in(c, 3), F.fin);
R(751, 'kemadruma', 'Jupiter, Saturn and Moon in a kendra', c => all(['Ju', 'Sa', 'Mo'], p => KENDRA.has(H(c, p))), F.fin);
R(752, 'kemadruma', 'Mars and Saturn in 12, 8 or 5', c => [12, 8, 5].includes(H(c, 'Ma')) && [12, 8, 5].includes(H(c, 'Sa')), F.fin);
R(753, 'kemadruma', 'Mars and Saturn together in 12, 8 or 5', c => together(c, ['Ma', 'Sa'], S(12, 8, 5)), F.fin);
R(754, 'unmada', 'Saturn in Lagna and Mars in 5, 9 or 7', c => H(c, 'Sa') === 1 && [5, 9, 7].includes(H(c, 'Ma')), F.health);
R(755, 'unmada', 'Moon with Saturn in 12', c => together(c, ['Mo', 'Sa'], S(12)), F.health);
R(757, 'unmada', 'Lagna in a Saturn or Mars drekkana, Sun with Moon in 1, 5 or 9, Jupiter in a kendra or 3', c => ['Sa', 'Ma'].includes(drekLagnaLord(c)) && together(c, ['Su', 'Mo'], S(1, 5, 9)) && (KENDRA.has(H(c, 'Ju')) || H(c, 'Ju') === 3), F.health);
R(756, 'unmada', 'day birth; Lagna in a Saturn or Mars drekkana, Sun with Moon in 1 or 9, Jupiter in a kendra', c => c.day_birth === true && ['Sa', 'Ma'].includes(drekLagnaLord(c)) && together(c, ['Su', 'Mo'], S(1, 9)) && KENDRA.has(H(c, 'Ju')), F.health);
R(758, 'unmada', 'Jupiter in Lagna, Saturn and Mars in 7', c => H(c, 'Ju') === 1 && H(c, 'Sa') === 7 && H(c, 'Ma') === 7, F.health);
R(759, 'mleccha', 'Saturn in Lagna and Sun in 7', c => H(c, 'Sa') === 1 && H(c, 'Su') === 7);
R(760, 'mleccha', 'Saturn in Lagna and Mars in 3', c => H(c, 'Sa') === 1 && H(c, 'Ma') === 3);
R(761, 'mleccha', 'Sun and Saturn conjunct in the same drekkana, navamsha or trimshamsha', c => c.conj('Su', 'Sa') && any([3, 9, 30], d => VS.varga_sign(c.lon.Su, d) === VS.varga_sign(c.lon.Sa, d)));
R(762, 'health', 'Sun and Moon in Leo Lagna aspected by Saturn and Mars', c => c.asc === 4 && together(c, ['Su', 'Mo'], S(1)) && c.aspects('Sa', 4) && c.aspects('Ma', 4), F.health);
R(763, 'health', 'Sun and Moon in Leo Lagna aspected by benefics and malefics', c => c.asc === 4 && together(c, ['Su', 'Mo'], S(1)) && any(BEN(c), b => c.aspects(b, 4)) && any(MAL(c), m => c.aspects(m, 4)), F.health);
R(764, 'health', 'Moon in 12', c => H(c, 'Mo') === 12, F.health);
R(765, 'health', 'Sun in 12', c => H(c, 'Su') === 12, F.health);
for (const [no, k] of [[766, 0], [767, 1], [768, 2]])
  R(no, 'health', `Venus in 2 with a malefic, in drekkana ${k + 1} of its sign`, c => H(c, 'Ve') === 2 && conjMal(c, 'Ve') && Math.floor((c.lon.Ve % 30) / 10) === k, F.health);
R(769, 'health', 'Venus or Mars in 2 or 12', c => [2, 12].includes(H(c, 'Ve')) || [2, 12].includes(H(c, 'Ma')), F.health);
R(770, 'health', 'Venus or Mars in 2 or 12, with the Moon', c => any(['Ve', 'Ma'], x => [2, 12].includes(H(c, x)) && c.conj(x, 'Mo')), F.health);
R(771, 'health', 'Sun 2, Mars 6, Saturn 8, Moon 12', c => H(c, 'Su') === 2 && H(c, 'Ma') === 6 && H(c, 'Sa') === 8 && H(c, 'Mo') === 12, F.health);
const lonelyMalIn = (c, h) => any(MAL(c), m => H(c, m) === h && !asp_by_any(c, m, BEN(c)) && !any(BEN(c), b => c.conj(b, m)));
R(772, 'health', 'malefics in 3, 9, 5 and 11 without benefic company or aspect', c => all([3, 5, 9, 11], h => lonelyMalIn(c, h)), F.health);
R(773, 'health', 'malefics in 3 and 11 without benefic company or aspect', c => all([3, 11], h => lonelyMalIn(c, h)), F.health);
R(774, 'health', 'malefics in 7 without benefic aspect', c => any(MAL(c), m => H(c, m) === 7) && !any(BEN(c), b => c.aspects(b, ksign(7, c))), F.health);
R(775, 'health', 'Sun conjunct Mercury in 6, 8 or 12', c => together(c, ['Su', 'Me'], DUSTHANA), F.health);
R(776, 'health', 'Sun in 6, 8 or 12 with Venus or L1', c => DUSTHANA.has(H(c, 'Su')) && any(['Ve', L(c, 1)], x => x !== 'Su' && c.conj('Su', x)), F.health);
R(777, 'health', 'house 12 a malefic sign aspected by a malefic', c => NM.has(LORD[ksign(12, c)]) && any(MAL(c), m => c.aspects(m, ksign(12, c))), F.health);
R(778, 'health', 'Sagittarius Lagna with a malefic', c => c.asc === 8 && mal_in(c, 1), F.health);
R(779, 'health', 'Lagna Leo, Sagittarius, Scorpio, Virgo or Cancer; Moon in Lagna aspected by Mars', c => [4, 8, 7, 5, 3].includes(c.asc) && H(c, 'Mo') === 1 && c.aspects('Ma', c.sign.Mo), F.health);
R(780, 'health', 'Moon and Mars conjunct, aspecting L1', c => c.conj('Mo', 'Ma') && !['Mo', 'Ma'].includes(L(c, 1)) && c.aspects('Mo', c.sign[L(c, 1)]), F.health);
R(781, 'health', 'Mars in 5, 9 or 7', c => [5, 9, 7].includes(H(c, 'Ma')), F.health);
R(782, 'health', 'Sun in Lagna, waning Moon and Saturn in 12', c => H(c, 'Su') === 1 && !c.waxing && together(c, ['Mo', 'Sa'], S(12)), F.health);
R(783, 'bandhana', 'malefics in 12, 5, 9 and 2', c => all([12, 5, 9, 2], h => mal_in(c, h)), F.legal);
R(784, 'bandhana', 'malefics in 12, 5, 9 and 2 with Sagittarius, Aries or Taurus Lagna', c => [8, 0, 1].includes(c.asc) && all([12, 5, 9, 2], h => mal_in(c, h)), F.legal);
for (const [no, signs] of [[785, [2, 6, 10]], [786, [3, 4, 11]], [787, [7]]])
  R(no, 'bandhana', `malefics in Lagna when Lagna is sign ${signs.join('/')}`, c => signs.includes(c.asc) && mal_in(c, 1), F.legal);
R(788, 'bandhana', 'Saturn in Lagna, Moon in 10 aspected by Venus', c => H(c, 'Sa') === 1 && H(c, 'Mo') === 10 && c.aspects('Ve', c.sign.Mo), F.legal);
for (const [no, ps] of [[789, ['Su']], [790, ['Sa']], [791, ['Ma']], [792, ['Su', 'Sa']], [793, ['Ma', 'Sa']], [794, ['Su', 'Ma']], [795, ['Su', 'Sa', 'Ma']]])
  R(no, 'mritaka', `${ps.join('/')} in 10 without benefic aspect`, c => all(ps, p => H(c, p) === 10) && !any(BEN(c), b => c.aspects(b, ksign(10, c))), F.death);
R(796, 'health', 'Sun, Moon and Mars in 1 or 8 with malefic aspect', c => together(c, ['Su', 'Mo', 'Ma'], S(1, 8)) && asp_by_any(c, 'Su', MAL(c)), F.health);
R(797, 'health', 'Moon and Mercury in a kendra aspected by a malefic', c => KENDRA.has(H(c, 'Mo')) && KENDRA.has(H(c, 'Me')) && (asp_by_any(c, 'Mo', MAL(c)) || asp_by_any(c, 'Me', MAL(c))), F.health);
R(798, 'health', 'malefics in 5 and 8', c => mal_in(c, 5) && mal_in(c, 8), F.health);
R(799, 'health', 'Saturn and Mars in 6 or 8, Jupiter not in Lagna or a trikona', c => [6, 8].includes(H(c, 'Sa')) && [6, 8].includes(H(c, 'Ma')) && !TRIKONA.has(H(c, 'Ju')), F.health);
R(800, 'bhava.5', 'Moon, Venus and a malefic in 10, 4 and 7 respectively', c => H(c, 'Mo') === 10 && H(c, 'Ve') === 4 && mal_in(c, 7), F.fam);
R(801, 'named', 'Venus in 12 in a Saturn navamsha', c => H(c, 'Ve') === 12 && nav_lord(c, 'Ve') === 'Sa');
R(802, 'named', 'Sun and Moon debilitated, or both opposite Saturn', c => (debil(c, 'Su') && debil(c, 'Mo')) || (c.from_ref('Sa', 'Su') === 7 || c.from_ref('Sa', 'Mo') === 7));
R(804, 'health.eyes', 'L6 in Lagna aspected by Saturn', c => H(c, L(c, 6)) === 1 && L(c, 6) !== 'Sa' && c.aspects('Sa', c.asc), F.health);
R(805, 'health.eyes', 'Moon in Lagna with Jupiter, Venus, Mars or Mercury', c => H(c, 'Mo') === 1 && any(['Ju', 'Ve', 'Ma', 'Me'], x => c.conj('Mo', x)), F.health);
R(806, 'health.eyes', 'Sun and Moon conjunct in 3 or a kendra', c => together(c, ['Su', 'Mo'], union(KENDRA, S(3))), F.health);
R(807, 'health.eyes', 'Mars in a malefic sign, or in a kendra aspected by another malefic', c => NM.has(LORD[c.sign.Ma]) || (KENDRA.has(H(c, 'Ma')) && asp_by_any(c, 'Ma', minus(MAL(c), S('Ma')))), F.health);
R(808, 'health.eyes', 'benefics only in 6, 8 and 12, Sun in 10', c => all(BEN(c), b => DUSTHANA.has(H(c, b))) && H(c, 'Su') === 10, F.health);
R(810, 'health.eyes', 'Sun and Moon together in 6 or 12', c => together(c, ['Su', 'Mo'], S(6, 12)), F.health);
R(811, 'health.ears', 'Venus as L6 in Lagna aspected by the Moon and a malefic', c => L(c, 6) === 'Ve' && H(c, 'Ve') === 1 && c.aspects('Mo', c.sign.Ve) && asp_by_any(c, 'Ve', MAL(c)), F.health);
R(812, 'health.ears', "Mercury rules 6 and is in 4, aspected by Saturn's 3rd or 10th aspect", c => L(c, 6) === 'Me' && H(c, 'Me') === 4 && [3, 10].includes(c.from_ref('Me', 'Sa')), F.health);
R(813, 'health.ears', "Mercury in 6 aspected by Saturn's 3rd or 10th aspect", c => H(c, 'Me') === 6 && [3, 10].includes(c.from_ref('Me', 'Sa')), F.health);
R(814, 'health.ears', 'Mercury in 6, Venus in 10', c => H(c, 'Me') === 6 && H(c, 'Ve') === 10, F.health);
R(815, 'health.speech', 'Mercury in Cancer, Scorpio or Pisces; Sun in 4 aspected by the Moon; L6 with malefic aspect', c => WATERY.has(c.sign.Me) && H(c, 'Su') === 4 && c.aspects('Mo', c.sign.Su) && asp_by_any(c, L(c, 6), MAL(c)), F.health);
R(816, 'health.speech', 'Moon in the waxing half in Lagna with Mars', c => c.waxing && H(c, 'Mo') === 1 && c.conj('Mo', 'Ma'), F.health);
R(817, 'health.speech', 'Mercury is L6', c => L(c, 6) === 'Me', F.health);
R(818, 'health.speech', 'Mercury in Capricorn or Aquarius aspected by Saturn', c => [9, 10].includes(c.sign.Me) && c.aspects('Sa', c.sign.Me), F.health);
R(820, 'named', 'no planet in a movable sign', c => !any(SEVEN, p => MOD.chara.has(c.sign[p])));
R(821, 'named', 'Venus in a dual sign in its own navamsha', c => MOD.dual.has(c.sign.Ve) && nav_lord(c, 'Ve') === 'Ve', F.sex);
R(823, 'named', 'Mars and Moon in the same navamsha', c => c.d9('Ma') === c.d9('Mo'));
R(824, 'named', 'L1 with Mars and Moon in 6', c => all([L(c, 1), 'Ma', 'Mo'], x => H(c, x) === 6));
R(825, 'named', 'Sun and Moon in the same navamsha', c => c.d9('Su') === c.d9('Mo'));
R(826, 'health', 'Moon in a watery sign with a malefic, aspected by Saturn', c => WATERY.has(c.sign.Mo) && conjMal(c, 'Mo') && c.aspects('Sa', c.sign.Mo), F.health);
for (const no of [827, 828])
  R(no, 'health', 'Saturn and Venus in 8 or 10 without benefic aspect', c => [8, 10].includes(H(c, 'Sa')) && [8, 10].includes(H(c, 'Ve')) && !asp_by_any(c, 'Sa', minus(BEN(c), S('Ve'))) && !asp_by_any(c, 'Ve', BEN(c)), F.sex);
for (const no of [829, 830])
  R(no, 'health', 'Saturn debilitated in 6 or 12', c => debil(c, 'Sa') && [6, 12].includes(H(c, 'Sa')), F.sex);
R(833, 'health', 'malefic L8 in 7 without benefic aspect', c => MAL(c).has(L(c, 8)) && H(c, L(c, 8)) === 7 && !asp_by_any(c, L(c, 8), BEN(c)), F.health);
R(834, 'health', 'day birth, Saturn in 7 in Scorpio, Mars in 9', c => c.day_birth === true && H(c, 'Sa') === 7 && c.sign.Sa === 7 && H(c, 'Ma') === 9, F.health);
R(835, 'health', 'Saturn and Mars in 12 with L1', c => all(['Sa', 'Ma', L(c, 1)], x => H(c, x) === 12), F.health);
R(836, 'health', 'Mars in 4 in Scorpio without Jupiter aspect', c => H(c, 'Ma') === 4 && c.sign.Ma === 7 && !c.aspects('Ju', 7), F.health);
R(837, 'health', 'Saturn in Lagna and Mars in 7', c => H(c, 'Sa') === 1 && H(c, 'Ma') === 7, F.health);
R(838, 'health', 'Mars in Scorpio Lagna without aspect of Venus or Jupiter', c => c.asc === 7 && H(c, 'Ma') === 1 && !c.aspects('Ve', 7) && !c.aspects('Ju', 7), F.health);
R(839, 'health', 'Saturn in a Mars navamsha with Ketu in 4', c => nav_lord(c, 'Sa') === 'Ma' && together(c, ['Sa', 'Ke'], S(4)), F.health);
R(840, 'health', 'Saturn with Ketu in 7, 12 or 6', c => together(c, ['Sa', 'Ke'], S(7, 12, 6)), F.health);
R(842, 'health', 'Moon, Mars and Venus in Scorpio in an Aquarius navamsha', c => all(['Mo', 'Ma', 'Ve'], p => c.sign[p] === 7) && c.d9('Mo') === 10, F.health);
R(845, 'named', 'benefics and malefics in kendras, L1 without Moon aspect', c => any(BEN(c), b => KENDRA.has(H(c, b))) && any(MAL(c), m => KENDRA.has(H(c, m))) && !(L(c, 1) !== 'Mo' && c.aspects('Mo', c.sign[L(c, 1)])));
R(846, 'named', 'benefics only in Sagittarius navamsha', c => any(BEN(c), b => c.d9(b) === 8));
R(847, 'learning', 'Mars in 2 with the Moon aspected by Mercury, or Mercury in a kendra', c => H(c, 'Ma') === 2 && c.conj('Ma', 'Mo') && (c.aspects('Me', c.sign.Ma) || KENDRA.has(H(c, 'Me'))));
R(848, 'learning', 'Mercury L2 exalted, Jupiter in Lagna, Saturn in 8', c => L(c, 2) === 'Me' && exalted(c, 'Me') && H(c, 'Ju') === 1 && H(c, 'Sa') === 8);
R(849, 'learning', 'Jupiter in a kendra or trikona and Venus exalted', c => KT.has(H(c, 'Ju')) && exalted(c, 'Ve'));
R(850, 'learning', 'L2 and Mercury exalted', c => exalted(c, L(c, 2)) && exalted(c, 'Me'));
R(851, 'learning', 'Sun and Mercury together in 2 aspected by Saturn', c => together(c, ['Su', 'Me'], S(2)) && c.aspects('Sa', ksign(2, c)));
R(852, 'learning', 'Sun and Mercury together in a kendra, trikona or 11', c => together(c, ['Su', 'Me'], union(KT, S(11))));
R(853, 'learning', 'Jupiter exalted or in own sign in 2', c => own_or_ex(c, 'Ju') && H(c, 'Ju') === 2);
R(854, 'learning', 'Saturn, Mercury and Sun in 5', c => all(['Sa', 'Me', 'Su'], p => H(c, p) === 5));
R(855, 'learning', 'Mercury in a kendra, strong L2, Venus exalted in 2', c => KENDRA.has(H(c, 'Me')) && c.strong(L(c, 2)) && exalted(c, 'Ve') && H(c, 'Ve') === 2);
R(856, 'learning', 'L2 the Sun or Mars aspected by Jupiter and Venus, Mercury in Paravatamsha', c => ['Su', 'Ma'].includes(L(c, 2)) && all(['Ju', 'Ve'], x => c.aspects(x, c.sign[L(c, 2)])) && title(c, 'Me', 'Paravata'));
R(857, 'learning', 'Sun and Mercury together in 2', c => together(c, ['Su', 'Me'], S(2)));
R(860, 'learning', 'Rahu in 5', c => H(c, 'Ra') === 5);
R(861, 'learning', 'L2 Jupiter or Venus aspected by Sun and Mars, in moolatrikona or exaltation', c => ['Ju', 'Ve'].includes(L(c, 2)) && all(['Su', 'Ma'], x => c.aspects(x, c.sign[L(c, 2)])) && (c.sign[L(c, 2)] === MOOLA[L(c, 2)] || exalted(c, L(c, 2))));
R(862, 'learning', 'Sun and Mars together in 2', c => together(c, ['Su', 'Ma'], S(2)));
R(864, 'learning', 'Jupiter as a strong L2 aspected by Sun and Venus', c => L(c, 2) === 'Ju' && c.strong('Ju') && all(['Su', 'Ve'], x => c.aspects(x, c.sign.Ju)));
R(865, 'learning', 'exalted Mercury as L2, Saturn in Gopuramsha, Jupiter in Simhasanamsha', c => L(c, 2) === 'Me' && exalted(c, 'Me') && title(c, 'Sa', 'Gopura') && title(c, 'Ju', 'Simhasana'));
R(866, 'learning', 'Jupiter in a kendra or trikona aspecting Mercury, Saturn in Paravatamsha', c => KT.has(H(c, 'Ju')) && c.aspects('Ju', c.sign.Me) && title(c, 'Sa', 'Paravata'));
R(867, 'learning', 'Venus in a kendra in Uttamamsha, Moon in Devalokamsha', c => KENDRA.has(H(c, 'Ve')) && title(c, 'Ve', 'Uttama') && title(c, 'Mo', 'Devaloka'));
R(870, 'named.fixed_chart', 'Sun Aquarius, Saturn Aries, Moon Scorpio, Venus Virgo', c => c.sign.Su === 10 && c.sign.Sa === 0 && c.sign.Mo === 7 && c.sign.Ve === 5);
R(871, 'named.fixed_chart', 'Venus and Saturn Aries, Sun Taurus, Moon Pisces, Mars Cancer', c => c.sign.Ve === 0 && c.sign.Sa === 0 && c.sign.Su === 1 && c.sign.Mo === 11 && c.sign.Ma === 3);
R(872, 'jaimini', 'L10 conjunct or aspected by the Amatyakaraka or its dispositor', c => any(new Set([AMK(c), LORD[c.sign[AMK(c)]]]), x => cor(c, L(c, 10), x)));
R(873, 'jaimini', 'L11 aspects 11; house 10 neither occupied nor aspected by malefics', c => c.aspects(L(c, 11), ksign(11, c)) && !house_afflicted(c, 10));
R(874, 'jaimini', 'Atmakaraka and Amatyakaraka conjunct', c => c.conj(karakas(c)[0], AMK(c)));
R(998, 'named', 'Mars in Lagna, Jupiter and Venus in 7', c => H(c, 'Ma') === 1 && H(c, 'Ju') === 7 && H(c, 'Ve') === 7);
R(999, 'named', 'Mars in Lagna with Moon and Venus', c => together(c, ['Ma', 'Mo', 'Ve'], S(1)));
R(1000, 'named', 'Venus in Lagna and Rahu in 8', c => H(c, 'Ve') === 1 && H(c, 'Ra') === 8);
R(1001, 'named', 'Rahu in 7, Jupiter in Lagna, Venus with malefics in 8', c => H(c, 'Ra') === 7 && H(c, 'Ju') === 1 && H(c, 'Ve') === 8 && conjMal(c, 'Ve'));
R(716, 'longevity.yogarishta', 'Mercury closely conjunct the Sun, aspected by benefics', c => c.combust('Me') && asp_by_any(c, 'Me', minus(BEN(c), S('Me'))), F.death);
R(717, 'longevity.yogarishta', "Sun as the Moon's dispositor in 8 with Saturn, aspected by Venus", c => LORD[c.sign.Mo] === 'Su' && together(c, ['Su', 'Sa'], S(8)) && c.aspects('Ve', c.sign.Su), F.death);

Object.assign(NOT_IMPL, {
  216: 'truncated text', 227: 'truncated text', 228: 'truncated text', 245: 'needs Gulika', 256: 'needs Putrakaraka/Karakamsha; truncated',
  386: 'truncated text', 396: 'needs "full Moon" threshold', 409: 'truncated text', 413: 'needs neechamsha + strength thresholds',
  422: 'vague ("unfavorable navamsha")', 424: 'needs Mandi', 425: 'needs Mandi', 439: 'needs cruel shashtiamsha', 455: "needs native's sex",
  456: "needs native's sex", 457: "needs native's sex", 460: 'needs Mandi', 489: 'needs saptamsha of house cusp',
  490: 'needs saptamsha of house cusp', 493: 'duplicate of 491 with "amsha" unspecified', 496: 'duplicate of 491 with "amsha" unspecified',
  497: "needs Saturn's vargas of house 5", 504: 'needs division of house 5', 514: '"favorably placed" undefined',
  537: 'truncated text', 538: 'needs Sun navamsha + strength', 742: 'needs weekday', 743: 'needs weekday', 744: 'needs weekday',
  803: 'needs retrograde motion', 809: 'needs retrograde motion', 819: 'truncated text', 822: 'needs hora of Venus', 831: 'needs retrograde motion',
  832: 'needs retrograde motion', 420: 'truncated text (a sign condition is cut off)', 421: 'truncated text (a sign condition is cut off)', 841: 'truncated text',
  843: 'needs "short ascension" definition + Saturn aspect orb', 844: 'same as 843',
  858: '"well placed" undefined', 859: '"well placed" undefined', 863: '"well placed" undefined', 868: '"favorably placed" undefined' });
})(typeof window !== 'undefined' ? window.PL7Yoga : globalThis.PL7Yoga);
