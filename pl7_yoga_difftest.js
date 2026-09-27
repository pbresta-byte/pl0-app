// Differential test: JS yoga engine (www/pl7-yoga-*.js) vs the Python research engine.
// Usage: node pl7_yoga_difftest.js <fixture.json>
// The fixture comes from the research workspace: tools/diff_dump.py (random + PL7 test charts, Python results).
const fs = require('fs');
const E = require('./www/pl7-yoga-engine.js');
for (const f of fs.readdirSync(__dirname + '/www').filter(f => /^pl7-yoga-rules-.*\.js$/.test(f)).sort()) require('./www/' + f);
const xi = process.argv.indexOf('--extra'); if (xi > 0) require(require('path').resolve(process.argv[xi + 1]));  // try a rule file before adding it to www/

const fx = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
Object.assign(E.PARAMS, fx.params);
const jsRules = new Set(E.RULES.map(r => r.yoga_no));
const pyRules = new Set(fx.rules);
const missing = [...pyRules].filter(n => !jsRules.has(n)).sort((a, b) => a - b);
const extraRules = [...jsRules].filter(n => !pyRules.has(n)).sort((a, b) => a - b);
const bad = {};  // yoga_no -> [chartIndex, 'py'|'js']
fx.charts.forEach((ch, i) => {
  const c = new E.Chart(ch.lon, ch.asc, ch.sb, ch.day_birth);
  const js = E.evaluate(c), py = new Set(ch.hits);
  for (const n of py) if (jsRules.has(n) && !js.has(n)) (bad[n] = bad[n] || []).push([i, 'py-only']);
  for (const n of js) if (!py.has(n)) (bad[n] = bad[n] || []).push([i, 'js-only']);
});
console.log(`charts ${fx.charts.length}; rules py ${pyRules.size}, js ${jsRules.size}; not yet ported ${missing.length}; js-only rule ids ${extraRules.join(',') || 'none'}`);
const keys = Object.keys(bad).map(Number).sort((a, b) => a - b);
console.log(keys.length ? `MISMATCHED RULES (${keys.length}): ` + keys.map(k => `${k}[${bad[k].length}, e.g. chart ${bad[k][0][0]} ${bad[k][0][1]}]`).join(' ') : 'all ported rules agree on every chart');
if (process.argv.includes('--missing')) console.log('not yet ported:', missing.join(','));
process.exit(keys.length ? 1 : 0);
