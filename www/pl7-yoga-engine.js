/* PL7 yoga rule engine — JS twin of the Python research engine
 * (workspace copy: pl0-app/docs/research/pl7-features/tools/yoga_rules.py,
 * arishta_rules.py, misc_rules.py, vaiseshikamsa.py).
 *
 * Every rule is a predicate over a Chart built from sidereal longitudes, the
 * Lagna degree, Shadbala ratios and day/night birth. Ambiguous classical
 * wording is exposed as PARAMS, never hidden. Keep this file in lock-step
 * with the Python engine: tools/diff_test (see the research log) runs both
 * on the same random charts and requires identical results per rule.
 *
 * House convention: whole-sign houses from the Lagna sign.
 * Planet keys: Su Mo Ma Me Ju Ve Sa Ra Ke. Signs are 0..11 (Aries = 0).
 */
(function (root) {
'use strict';

// ------------------------------------------------------------------ parameters (defaults = best PL7 fit / owner choice)
const PARAMS_DEFAULT = {
  several_planets_min: 2, strong_ratio: 1.0, moon_benefic_if_waxing: true, mercury_benefic_unless_with_malefic: true,
  nodes_count_as_planets_for_moon_sun_yogas: false, relationship_types: ['conjunction', 'mutual_aspect'],
  same_planet_counts_as_relationship: false, same_planet_counts_as_mutual_kendra: true, vihaga_mode: 'houses_4_and_10',
  vajra_join: 'and', auspicious_house_for_bhava_series: 'not_dusthana',
  combust_orb: { Mo: 12, Ma: 17, Me: 14, Ju: 11, ve: 10, Ve: 10, Sa: 15 },
  sankhya_cancelled_by_other_nabhasa: false, akriti_include_nodes: true, sankhya_include_nodes: false,
  duplicate_entries_fire: false, aspect_includes_conjunction_333: true, raja270_require_lagna: false,
  nodes_have_debility: true, l9_in_lagna_counts_as_aspect_333: true, parivartana_mode: 'planet_signs',
  node_aspects: 'full', conjunction_exact_set: false, deep_exaltation_orb_deg: 1.0, many_planets_min: 3,
  akhanda_kendra_lord_other_than_jupiter: true, vaiseshikamsa_mode: 'bphs', vaiseshikamsa_set: 'dasa',
  title_match: 'exact', trikalagnana_reading: 'open', mridvamsha_indices: [19],
  very_strong_ratio: 1.5, moon_mercury_same_kendra: true, rule586_join: 'or', arishta_relation: 'conj_or_any_aspect',
  arishta541_skip_if_l1_owns_dusthana: true, malefics_plural_min: 2, friendship: 'compound', rule602_mode: 'lords_conjunct',
  maraka_planet: 'occupant_of_2_or_7', rule691_distinct: true, rule653_branches: 'both', longevity_686_mode: 'classical_kendra',
  karmajiva_aspect_includes_conj: true, karaka_scheme: 8
};
const PARAMS = JSON.parse(JSON.stringify(PARAMS_DEFAULT));

// ------------------------------------------------------------------ small Python-like helpers
const mod = (a, n) => ((a % n) + n) % n;
const S = (...xs) => new Set(xs);
const any = (xs, f) => { for (const x of xs) if (f(x)) return true; return false; };
const all = (xs, f) => { for (const x of xs) if (!f(x)) return false; return true; };
const sum = (xs, f) => { let n = 0; for (const x of xs) if (f(x)) n++; return n; };
const union = (...sets) => { const o = new Set(); sets.forEach(s => s.forEach(x => o.add(x))); return o; };
const inter = (a, b) => new Set([...a].filter(x => b.has(x)));
const minus = (a, b) => new Set([...a].filter(x => !b.has(x)));
const range = (a, b) => { const o = []; for (let i = a; i < b; i++) o.push(i); return o; };
const setEq = (a, b) => a.size === b.size && [...a].every(x => b.has(x));

// ------------------------------------------------------------------ tables
const LORD = ['Ma', 'Ve', 'Me', 'Mo', 'Su', 'Me', 'Ve', 'Ma', 'Ju', 'Sa', 'Sa', 'Ju'];
const EXALT = { Su: 0, Mo: 1, Ma: 9, Me: 5, Ju: 3, Ve: 11, Sa: 6 };
const DEBIL = {}; Object.keys(EXALT).forEach(k => { DEBIL[k] = (EXALT[k] + 6) % 12; });
const SEVEN = ['Su', 'Mo', 'Ma', 'Me', 'Ju', 'Ve', 'Sa'];
const NINE = SEVEN.concat(['Ra', 'Ke']);
const OWN = {}; SEVEN.forEach(p => { OWN[p] = new Set(range(0, 12).filter(i => LORD[i] === p)); });
const NAT_FRIENDS = { Su: S('Mo', 'Ma', 'Ju'), Mo: S('Su', 'Me'), Ma: S('Su', 'Mo', 'Ju'), Me: S('Su', 'Ve'),
  Ju: S('Su', 'Mo', 'Ma'), Ve: S('Me', 'Sa'), Sa: S('Me', 'Ve') };
const NAT_ENEMIES = { Su: S('Ve', 'Sa'), Mo: S(), Ma: S('Me'), Me: S('Mo'), Ju: S('Me', 'Ve'), Ve: S('Su', 'Mo'), Sa: S('Su', 'Mo', 'Ma') };
const NAT_MALEFIC = S('Su', 'Ma', 'Sa', 'Ra', 'Ke');
const MOD = { chara: S(0, 3, 6, 9), sthira: S(1, 4, 7, 10), dual: S(2, 5, 8, 11) };
const KENDRA = S(1, 4, 7, 10), TRIKONA = S(1, 5, 9), DUSTHANA = S(6, 8, 12);
const PANAPHARA = S(2, 5, 8, 11), APOKLIMA = S(3, 6, 9, 12), UPACHAYA = S(3, 6, 10, 11);
const KT = union(KENDRA, TRIKONA);
const DEEP = { Su: 10, Mo: 33, Ma: 298, Me: 165, Ju: 95, Ve: 357, Sa: 200 };
const MOOLA = { Su: 4, Mo: 1, Ma: 0, Me: 5, Ju: 8, Ve: 6, Sa: 10 };
const NODE_EX = { Ra: 1, Ke: 7 };  // Rahu exalted Taurus, Ketu exalted Scorpio
const SPECIAL_ASPECTS = { Ma: S(4, 8), Ju: S(5, 9), Sa: S(3, 10), Ra: S(5, 9), Ke: S(5, 9) };

// ------------------------------------------------------------------ chart
class Chart {
  constructor(lon, asc, sbRatio, dayBirth) {
    this.lon = lon; this.lon_asc = asc; this.asc = Math.floor(asc / 30); this.sb = sbRatio || {};
    this.sign = {}; this.house = {};
    Object.keys(lon).forEach(p => { this.sign[p] = Math.floor(lon[p] / 30); this.house[p] = mod(this.sign[p] - this.asc, 12) + 1; });
    this.waxing = mod(lon.Mo - lon.Su, 360) < 180;
    this.day_birth = dayBirth === undefined ? null : dayBirth;
    this._ben = null;
  }
  lord_of(h) { return LORD[mod(this.asc + h - 1, 12)]; }
  in_house(h, pool = SEVEN) { return pool.filter(p => this.house[p] === h); }
  from_ref(p, ref) { return mod(this.sign[p] - this.sign[ref], 12) + 1; }
  benefics() {
    if (this._ben) return this._ben;
    const b = S('Ju', 'Ve');
    if (!PARAMS.moon_benefic_if_waxing || this.waxing) b.add('Mo');
    if (!PARAMS.mercury_benefic_unless_with_malefic || !['Su', 'Ma', 'Sa', 'Ra', 'Ke'].some(m => this.sign[m] === this.sign.Me)) b.add('Me');
    return (this._ben = b);
  }
  malefics() { return minus(new Set(NINE), this.benefics()); }
  aspects(p, targetSign) {
    const d = mod(targetSign - this.sign[p], 12) + 1;
    if ((p === 'Ra' || p === 'Ke') && (PARAMS.node_aspects || 'full') !== 'full') return PARAMS.node_aspects === 'seventh_only' && d === 7;
    return d === 7 || (SPECIAL_ASPECTS[p] ? SPECIAL_ASPECTS[p].has(d) : false);
  }
  conj(a, b) { return this.sign[a] === this.sign[b]; }
  mutual_aspect(a, b) { return this.aspects(a, this.sign[b]) && this.aspects(b, this.sign[a]); }
  related(a, b) {
    if (a === b) return PARAMS.same_planet_counts_as_relationship;
    const t = PARAMS.relationship_types;
    return (t.includes('conjunction') && this.conj(a, b)) || (t.includes('mutual_aspect') && this.mutual_aspect(a, b))
      || (t.includes('exchange') && LORD[this.sign[a]] === b && LORD[this.sign[b]] === a);
  }
  exchange(a, b) { return a !== b && LORD[this.sign[a]] === b && LORD[this.sign[b]] === a; }
  kendra_from(a, b) {
    if (a === b) return PARAMS.same_planet_counts_as_mutual_kendra;
    return [0, 3, 6, 9].includes(mod(this.sign[a] - this.sign[b], 12));
  }
  sbOf(p) { return this.sb[p] === undefined ? 0 : this.sb[p]; }
  strong(p) { return this.sbOf(p) >= PARAMS.strong_ratio; }
  dignity_own_or_exalt(p) { return OWN[p].has(this.sign[p]) || this.sign[p] === EXALT[p]; }
  combust(p) {
    if (p === 'Su' || !(p in PARAMS.combust_orb)) return false;
    const d = Math.abs(mod(this.lon[p] - this.lon.Su + 180, 360) - 180);
    return d <= PARAMS.combust_orb[p];
  }
  d9(p) { return mod(Math.floor(this.lon[p] * 9 / 30), 12); }
}

// ------------------------------------------------------------------ vaiseshikamsa (varga-dignity titles)
const VS = (() => {
  const parts = (lon, n) => [Math.floor(lon / 30), Math.floor((lon % 30) * n / 30)];
  function varga_sign(lon, d) {
    const [s, p] = parts(lon, d); const odd = s % 2 === 0; const m3 = s % 3;
    switch (d) {
      case 1: return s;
      case 2: return odd ? (p === 0 ? 4 : 3) : (p === 0 ? 3 : 4);
      case 3: return (s + 4 * p) % 12;
      case 4: return (s + 3 * p) % 12;
      case 7: return odd ? (s + p) % 12 : (s + 6 + p) % 12;
      case 9: return mod(Math.floor(lon * 9 / 30), 12);
      case 10: return odd ? (s + p) % 12 : (s + 8 + p) % 12;
      case 12: return (s + p) % 12;
      case 16: return ([0, 4, 8][m3] + p) % 12;
      case 20: return ([0, 8, 4][m3] + p) % 12;
      case 24: return ((odd ? 4 : 3) + p) % 12;
      case 27: return ([0, 3, 6, 9][s % 4] + p) % 12;
      case 30: {
        const deg = lon % 30;
        const table = odd ? [[5, 0], [10, 10], [18, 8], [25, 2], [30, 6]] : [[5, 1], [12, 5], [20, 11], [25, 9], [30, 7]];
        for (const [lim, sg] of table) if (deg < lim) return sg;
        return table[table.length - 1][1];
      }
      case 40: return ((odd ? 0 : 6) + p) % 12;
      case 45: return ([0, 4, 8][m3] + p) % 12;
      case 60: return (s + p) % 12;
    }
    throw new Error('varga ' + d);
  }
  const SETS = { shad: [1, 2, 3, 9, 12, 30], sapta: [1, 2, 3, 7, 9, 12, 30], dasa: [1, 2, 3, 7, 9, 10, 12, 16, 30, 60],
    shodasa: [1, 2, 3, 4, 7, 9, 10, 12, 16, 20, 24, 27, 30, 40, 45, 60] };
  function arudha_lagna(ascSign, signOf) {
    const lord = LORD[ascSign]; const n = mod(signOf[lord] - ascSign, 12);
    let al = (signOf[lord] + n) % 12;
    if ([0, 6].includes(mod(al - ascSign, 12))) al = (al + 9) % 12;
    return al;
  }
  function good_sign(p, sg, modeKey, alGood) {
    if (sg === EXALT[p] || LORD[sg] === p) return true;
    if (modeKey === 'friend_own_exalt') return NAT_FRIENDS[p].has(LORD[sg]);
    if (modeKey === 'bphs') return sg === MOOLA[p] || alGood.has(sg);
    throw new Error(modeKey);
  }
  function count(p, lon, setKey, modeKey, ascSign, signOf) {
    let alGood = new Set();
    if (modeKey === 'bphs') {
      const al = arudha_lagna(ascSign, signOf);
      const kl = new Set([0, 3, 6, 9].map(k => LORD[(al + k) % 12]));
      alGood = new Set(range(0, 12).filter(i => kl.has(LORD[i])));
    }
    return sum(SETS[setKey], d => good_sign(p, varga_sign(lon[p], d), modeKey, alGood));
  }
  function d60_index_odd_order(lon) {
    const s = Math.floor(lon / 30); const k = Math.floor((lon % 30) * 2) + 1;
    return s % 2 === 0 ? k : 61 - k;
  }
  return { varga_sign, arudha_lagna, count, d60_index_odd_order, SETS };
})();

const TITLE_N = { Parijata: 2, Uttama: 3, Gopura: 4, Simhasana: 5, Paravata: 6, Devaloka: 7 };
const vcount = (c, p) => VS.count(p, c.lon, PARAMS.vaiseshikamsa_set, PARAMS.vaiseshikamsa_mode, c.asc, c.sign);
function has_title(c, p, title, orHigher) {
  const n = vcount(c, p), k = TITLE_N[title];
  return (orHigher || PARAMS.title_match === 'at_least') ? n >= k : n === k;
}

// ------------------------------------------------------------------ shared predicates (yoga_rules.py)
const exalted = (c, p) => p in EXALT && c.sign[p] === EXALT[p];
const debil = (c, p) => p in DEBIL && c.sign[p] === DEBIL[p];
const own = (c, p) => p in OWN && OWN[p].has(c.sign[p]);
const debil_n = (c, p) => (p in DEBIL && c.sign[p] === DEBIL[p]) || (p in NODE_EX && c.sign[p] === (NODE_EX[p] + 6) % 12);
const cora = (c, a, b) => a !== b && (c.conj(a, b) || c.aspects(b, c.sign[a]));   // a conjunct or aspected by b
const ksign = (h, c) => mod(c.asc + h - 1, 12);
const BEN7 = c => inter(c.benefics(), new Set(SEVEN));
const MAL7 = c => inter(c.malefics(), new Set(SEVEN));
const benefic_aspect = (c, p) => any(BEN7(c), b => b !== p && c.aspects(b, c.sign[p]));

// ------------------------------------------------------------------ shared predicates (arishta_rules.py)
const MAL = c => c.malefics();
const BEN = c => BEN7(c);
const L = (c, h) => c.lord_of(h);
const weak = (c, p) => !c.strong(p);
const afflicted = (c, p) => any(MAL(c), m => m !== p && (c.conj(m, p) || c.aspects(m, c.sign[p])));
const house_afflicted = (c, h) => { const s = ksign(h, c); return any(MAL(c), m => c.sign[m] === s || c.aspects(m, s)); };
const mal_in = (c, h, excl = []) => any(MAL(c), m => !excl.includes(m) && c.house[m] === h);
const relatedA = (c, a, b) => a !== b && (c.conj(a, b) || c.mutual_aspect(a, b));
const assoc = (c, a, b) => a !== b && (c.conj(a, b) || c.aspects(a, c.sign[b]) || c.aspects(b, c.sign[a]));
const rel_arishta = (c, a, b) => PARAMS.arishta_relation === 'conj_or_mutual_aspect' ? relatedA(c, a, b) : assoc(c, a, b);
function friendly_sign(c, p) {
  const l = LORD[c.sign[p]];
  if (l === p) return true;
  const nat = NAT_FRIENDS[p].has(l) ? 1 : (NAT_ENEMIES[p].has(l) ? -1 : 0);
  if (PARAMS.friendship === 'natural') return nat > 0;
  const tmp = [2, 3, 4, 10, 11, 12].includes(mod(c.sign[l] - c.sign[p], 12) + 1) ? 1 : -1;
  return nat + tmp > 0;
}
const n_mal_aspects = (c, s) => sum(MAL(c), m => c.aspects(m, s));
const maraka_influence = (c, p) => any([2, 7], h => assoc(c, p, L(c, h)));
const mal_nav = (c, p) => NAT_MALEFIC.has(LORD[c.d9(p)]);
const ben_nav = (c, p) => S('Ju', 'Ve', 'Me', 'Mo').has(LORD[c.d9(p)]);
const mo_me_kendra = c => PARAMS.moon_mercury_same_kendra
  ? (c.conj('Mo', 'Me') && KENDRA.has(c.house.Mo))
  : (KENDRA.has(c.house.Mo) && KENDRA.has(c.house.Me));
const hemmed = (c, s) => any(MAL(c), m => c.sign[m] === (s + 1) % 12) && any(MAL(c), m => c.sign[m] === mod(s - 1, 12));
function arudha(c, h) {
  const s = ksign(h, c), lord = LORD[s]; const n = mod(c.sign[lord] - s, 12);
  const a = (c.sign[lord] + n) % 12;
  return [0, 6].includes(mod(a - s, 12)) ? (a + 9) % 12 : a;
}
function atmakaraka(c) {  // Python max(): first of the maximal elements
  let best = SEVEN[0];
  SEVEN.forEach(p => { if (c.lon[p] % 30 > c.lon[best] % 30) best = p; });
  return best;
}
const together = (c, ps, houses) => { const s = c.sign[ps[0]]; return ps.every(p => c.sign[p] === s) && (!houses || houses.has(c.house[ps[0]])); };
const asp_by_any = (c, p, pool) => any(pool, q => q !== p && c.aspects(q, c.sign[p]));
const aspectors = (c, p) => new Set(NINE.filter(q => q !== p && c.aspects(q, c.sign[p])));
function pair_mod(c, aSign, bSign, same, mixed) {
  const ma = Object.keys(MOD).find(k => MOD[k].has(aSign)), mb = Object.keys(MOD).find(k => MOD[k].has(bSign));
  return (ma === mb && mb === same) || setEq(new Set([ma, mb]), new Set(mixed));
}

// ------------------------------------------------------------------ shared predicates (misc_rules.py)
const NB = S('Ju', 'Ve', 'Me', 'Mo');
const NM = S('Su', 'Ma', 'Sa', 'Ra', 'Ke');
const WATERY = S(3, 7, 11);
const WATERY_SIGNS_WIDE = S(3, 7, 9, 10, 11);
const DRY_SIGNS = minus(new Set(range(0, 12)), WATERY_SIGNS_WIDE);
const DRY_PLANETS = S('Su', 'Ma'), WATERY_PLANETS = S('Mo', 'Ve');
const H = (c, p) => c.house[p];
const nav_lord = (c, p) => LORD[c.d9(p)];
const occupants = (c, h) => NINE.filter(p => c.house[p] === h);
const ben_in = (c, h) => any(BEN(c), b => c.house[b] === h);
const nb_in = (c, h) => any(NB, b => c.house[b] === h);
const nm_in = (c, h) => any(NM, m => c.house[m] === h);
const kendra_between = (c, a, b) => [0, 3, 6, 9].includes(mod(c.sign[a] - c.sign[b], 12));
const sign_from = (c, refSign, n) => mod(refSign + n - 1, 12);
const deep_ex = (c, p, orb) => Math.abs(mod(c.lon[p] - DEEP[p] + 180, 360) - 180) <= (orb !== undefined ? orb : PARAMS.deep_exaltation_orb_deg);
const title = (c, p, t) => has_title(c, p, t);
const ref_sign = (c, r) => r === 'L' ? c.asc : c.sign[r];
const cor = cora;
const nav_asc = c => mod(Math.floor(c.lon_asc * 9 / 30), 12);
const very_strong = (c, p) => c.sbOf(p) >= PARAMS.very_strong_ratio;
const own_or_ex = (c, p) => own(c, p) || exalted(c, p);
const deb_planets = c => SEVEN.filter(p => debil(c, p));
function karakas(c) {
  const pool = SEVEN.concat(PARAMS.karaka_scheme === 8 ? ['Ra'] : []);
  const key = p => p === 'Ra' ? (30 - c.lon[p] % 30) : c.lon[p] % 30;
  return pool.slice().sort((a, b) => key(b) - key(a));
}
const AMK = c => karakas(c)[1];

// ------------------------------------------------------------------ registry
const RULES = [];
const NOT_IMPL = {};
function rule(no, family, condition, fn, meta) { RULES.push(Object.assign({ yoga_no: no, family, condition, fn }, meta || {})); }

const H_ = { mod, S, any, all, sum, union, inter, minus, range, setEq,
  LORD, EXALT, DEBIL, SEVEN, NINE, OWN, NAT_FRIENDS, NAT_ENEMIES, NAT_MALEFIC, MOD, KENDRA, TRIKONA, DUSTHANA,
  PANAPHARA, APOKLIMA, UPACHAYA, KT, DEEP, MOOLA, NODE_EX, VS, TITLE_N, has_title, vcount,
  exalted, debil, own, debil_n, cora, ksign, BEN7, MAL7, benefic_aspect,
  MAL, BEN, L, weak, afflicted, house_afflicted, mal_in, relatedA, assoc, rel_arishta, friendly_sign, n_mal_aspects,
  maraka_influence, mal_nav, ben_nav, mo_me_kendra, hemmed, arudha, atmakaraka, together, asp_by_any, aspectors, pair_mod,
  NB, NM, WATERY, WATERY_SIGNS_WIDE, DRY_SIGNS, DRY_PLANETS, WATERY_PLANETS, H, nav_lord, occupants, ben_in, nb_in, nm_in,
  kendra_between, sign_from, deep_ex, title, ref_sign, cor, nav_asc, very_strong, own_or_ex, deb_planets, karakas, AMK,
  rule, NOT_IMPL, PARAMS };

const DUPLICATE_ENTRIES = S(90, 93, 95, 140, 494, 495, 501, 502, 503, 828, 830);
function evaluate(c) {
  const hits = new Set();
  for (const r of RULES) { if (r.fn(c)) hits.add(r.yoga_no); }
  if (!PARAMS.duplicate_entries_fire) DUPLICATE_ENTRIES.forEach(n => hits.delete(n));
  if (PARAMS.sankhya_cancelled_by_other_nabhasa) {
    const other = RULES.some(r => r.family.startsWith('nabhasa.') && !r.family.startsWith('nabhasa.sankhya')
      && r.nabhasa_for_sankhya !== false && hits.has(r.yoga_no));
    if (other) range(43, 50).forEach(n => hits.delete(n));
  }
  return hits;
}

const api = { PARAMS, PARAMS_DEFAULT, Chart, RULES, NOT_IMPL, DUPLICATE_ENTRIES, evaluate, helpers: H_,
  resetParams() { Object.keys(PARAMS).forEach(k => delete PARAMS[k]); Object.assign(PARAMS, JSON.parse(JSON.stringify(PARAMS_DEFAULT))); } };
root.PL7Yoga = api;
if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
