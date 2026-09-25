// Kaksha / prastara test (www/index.html): each sign's prastara column sums to the app's Bhinnashtakavarga bindu
// count; kaksha boundaries and rulers (textbook example: a Moon at 17°51' is in Venus's kaksha).
// Usage: node pl7_kaksha_test.js
const vm = require('vm'), fs = require('fs');
const src = fs.readFileSync(__dirname + '/www/index.html', 'utf8');
const grabFn = n => { const i = src.indexOf('function ' + n + '('); return src.slice(i, src.indexOf('\n}', i) + 2); };
const grabConst = n => { const i = src.indexOf('const ' + n + ' ='); let d = 0, j = i; for (; j < src.length; j++) { const c = src[j];
  if ('[{('.includes(c)) d++; else if (']})'.includes(c)) d--; else if (c === ';' && d === 0) break; } return src.slice(i, j + 1); };
const ctx = {}; vm.createContext(ctx);
vm.runInContext(['function norm360(x){ return ((x % 360) + 360) % 360; }', grabConst('ASHTAK_GRAHAS'), grabConst('ASHTAK_CONTRIB'), grabConst('KAKSHA_LORDS'),
  grabFn('computeBhinnashtakavarga'), grabFn('prastaraAshtakavarga'), grabFn('kakshaOf'), 'this.G = ASHTAK_GRAHAS;'].join('\n'), ctx);
let fails = 0; const bad = m => { fails++; console.log('FAIL ' + m); };
for (let k = 0; k < 200; k++) {
  const pos = { _ascSidereal: (k * 71.3) % 360 };
  ctx.G.forEach((g, i) => { pos[g] = { sidereal: (k * 37.7 + i * 53.9) % 360 }; });
  ctx.G.forEach(g => { const bav = ctx.computeBhinnashtakavarga(g, pos), pr = ctx.prastaraAshtakavarga(g, pos);
    for (let s = 0; s < 12; s++) { const col = pr.reduce((a, r) => a + r[s], 0); if (col !== bav[s]) bad(`chart ${k} ${g} sign ${s}: prastara ${col} vs bav ${bav[s]}`); } });
}
const cases = [[17 + 51 / 60, 'Venus'], [0, 'Saturn'], [3.74, 'Saturn'], [3.75, 'Jupiter'], [29.99, 'Lagna'], [30 + 26.25, 'Lagna'], [359.99, 'Lagna']];
cases.forEach(([sid, lord]) => { const r = ctx.kakshaOf(sid); if (r.lord !== lord) bad(`kakshaOf(${sid}) = ${r.lord}, expected ${lord}`); });
console.log(fails ? `${fails} failure(s)` : 'PASS — prastara columns = BAV on 200 charts x 7 grahas; kaksha boundaries incl. 17°51\' -> Venus');
process.exit(fails ? 1 : 0);
