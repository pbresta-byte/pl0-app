// Varga engine test: the app's VARGA CORE (www/index.html) vs an independent reference
// written from the PL7 varga formula table (research: pl7.table.varga_formulas_verified,
// which reproduced all 16 x 9 visible cells of PL7's "Signs in all vargas" for the test chart).
// Usage: node pl7_varga_test.js
const vm = require('vm'), fs = require('fs');
const src = fs.readFileSync(__dirname + '/www/index.html', 'utf8');
const core = src.slice(src.indexOf('// ==== BEGIN VARGA CORE ===='), src.indexOf('// ==== END VARGA CORE ===='));
if (!core) { console.log('VARGA CORE markers not found'); process.exit(2); }
const pick = re => { const m = src.match(re); if (!m) throw new Error('missing ' + re); return m[0]; };
const ctx = {};
vm.createContext(ctx);
vm.runInContext([
  pick(/const SIGNS = \[[^\]]*\];/),
  pick(/function norm360\(x\)\{[^\n]*\}/),
  'var LANG = "en";',
  pick(/const VARGA_OPTS = [^\n]*/) ,
  core,
  'this.VARGA_DEFS = VARGA_DEFS; this.vargaSignForKey = vargaSignForKey; this.VARGA_OPTS = VARGA_OPTS;',
].join('\n'), ctx);

// ---- reference, straight from the PL7 table wording ----
const odd = s => s % 2 === 0, mod = s => s % 3, el = s => s % 4;
const part = (d, n) => Math.min(n - 1, Math.floor(d / (30 / n)));
const from = (start, d, n) => (start + part(d, n)) % 12;
const T30_ODD = [[5, 0], [5, 10], [8, 8], [7, 2], [5, 6]];     // Ar Aq Sg Ge Li
const T30_EVEN = [[5, 1], [7, 5], [8, 11], [5, 9], [5, 7]];    // Ta Vi Pi Cp Sc
const REF = {
  D1: (s) => s,
  D2: (s, d) => (odd(s) ? (d < 15 ? 4 : 3) : (d < 15 ? 3 : 4)),
  D3: (s, d) => (s + 4 * part(d, 3)) % 12,
  D4: (s, d) => (s + 3 * part(d, 4)) % 12,
  D7: (s, d) => from(odd(s) ? s : s + 6, d, 7),
  D9: (s, d) => (s * 9 + part(d, 9)) % 12,                        // continuous from Aries
  D10: (s, d) => from(odd(s) ? s : s + 8, d, 10),
  D12: (s, d) => from(s, d, 12),
  D16: (s, d) => from([0, 4, 8][mod(s)], d, 16),
  D20: (s, d) => from([0, 8, 4][mod(s)], d, 20),
  D24: (s, d) => from(odd(s) ? 4 : 3, d, 24),
  D27: (s, d) => from([0, 3, 6, 9][el(s)], d, 27),
  D30: (s, d) => { let a = 0; for (const [w, g] of (odd(s) ? T30_ODD : T30_EVEN)) { a += w; if (d < a) return g; } return 7; },
  D40: (s, d) => from(odd(s) ? 0 : 6, d, 40),
  D45: (s, d) => from([0, 4, 8][mod(s)], d, 45),
  D60: (s, d) => (s + Math.floor(2 * d)) % 12,                    // counted from the occupied sign
};
const ref = (k, L) => { const s = Math.floor(L / 30); return REF[k](s, L - 30 * s); };
const app = (k, L) => ctx.vargaSignForKey(k, L);

// ---- test points ----
const pts = [];
let seed = 20260921; const rnd = () => ((seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648);
for (let i = 0; i < 20000; i++) pts.push(rnd() * 360);
for (const n of [2, 3, 4, 7, 9, 10, 12, 16, 20, 24, 27, 40, 45, 60])
  for (let s = 0; s < 12; s++) for (let p = 0; p < n; p++) { const b = s * 30 + p * 30 / n; pts.push(b + 1e-7, b + 30 / n - 1e-7); }
for (let s = 0; s < 12; s++) for (const b of [5, 10, 12, 18, 20, 25]) pts.push(s * 30 + b - 1e-7, s * 30 + b + 1e-7);

const S3 = i => ['Ari', 'Tau', 'Gem', 'Can', 'Leo', 'Vir', 'Lib', 'Sco', 'Sag', 'Cap', 'Aqu', 'Pis'][i];
let fails = 0; const report = [];
function run(label, opts) {
  Object.keys(ctx.VARGA_OPTS).forEach(k => delete ctx.VARGA_OPTS[k]); Object.assign(ctx.VARGA_OPTS, opts);
  for (const k of Object.keys(REF)) {
    let bad = 0, ex = null;
    for (const L of pts) { const a = app(k, L), r = ref(k, L); if (a !== r) { bad++; ex = ex || [L, a, r]; } }
    if (bad) report.push(`${label} ${k}: ${bad}/${pts.length} differ, e.g. ${ex[0].toFixed(4)}deg app ${S3(ex[1])} vs PL7 ${S3(ex[2])}`);
    if (bad && !(label.startsWith('default') && KNOWN_DEFAULT_DIFFS.includes(k))) fails++;
  }
}
// D30 even signs: the app's default is the owner-specified Cancer-based sequence; the PL7/classical
// one is offered as an option. Under the PL7 preset every varga must match PL7 exactly.
const KNOWN_DEFAULT_DIFFS = ['D30'];
run('default', {});
run('pl7-preset', { d30Even: 'classical', d60Count: 'occupied' });

// D60 alternative (count from Aries) must be the literal alternative, not something else.
ctx.VARGA_OPTS.d60Count = 'aries';
let d60a = 0; for (const L of pts) { const s = Math.floor(L / 30); if (app('D60', L) !== Math.floor(2 * (L - 30 * s)) % 12) d60a++; }
if (d60a) { fails++; report.push(`D60 'aries' option: ${d60a} points wrong`); }
delete ctx.VARGA_OPTS.d60Count;

// ---- fixtures from the PL7 test chart (Cristian, 1990-09-30 Miami) ----
const FX = { Su: 163.851503014899, Mo: 297.552753879638, Ma: 47.94563142948, Me: 148.28658236027, Ju: 104.552270237618,
  Ve: 155.578325164177, Sa: 265.029666333896, Ra: 281.705528912309, Ke: 101.705528912309, Asc: 319.537516008015 };
const D9_PL7 = { Su: 'Tau', Mo: 'Vir', Ma: 'Gem', Me: 'Sag', Ju: 'Sco', Ve: 'Aqu', Sa: 'Sco', Ra: 'Ari', Ke: 'Lib', Asc: 'Pis' };
for (const [b, want] of Object.entries(D9_PL7)) { const got = S3(app('D9', FX[b])); if (got !== want) { fails++; report.push(`fixture D9 ${b}: app ${got}, PL7 ${want}`); } }
const table = Object.keys(REF).map(k => k.padEnd(4) + Object.keys(FX).map(b => S3(app(k, FX[b]))).join(' ')).join('\n');

console.log(`points ${pts.length} x ${Object.keys(REF).length} vargas`);
console.log('test chart (' + Object.keys(FX).join(' ') + '):\n' + table);
console.log(report.length ? report.join('\n') : 'every varga identical to the PL7 formulas');
console.log(fails ? `FAIL (${fails})` : 'PASS');
process.exit(fails ? 1 : 0);
