// Functional-nature preset test: the app's FUNC_NATURE_TABLE (www/index.html) vs PL7's default table as read
// from its Options dialog for all 12 ascendants (research: pl7.table.functional_nature_default), plus the Moon
// lit-fraction helper. Usage: node pl7_functional_test.js [tables-and-deities.ndjson]
const fs = require('fs'), vm = require('vm');
const src = fs.readFileSync(__dirname + '/www/index.html', 'utf8');
const grab = re => { const m = src.match(re); if (!m) throw new Error('missing ' + re); return m[0]; };
const ctx = {}; vm.createContext(ctx);
vm.runInContext([grab(/const FUNC_NATURE_TABLE = \[[^\]]*\];/), grab(/function norm360\(x\)\{[^\n]*\}/),
  grab(/function moonLitFraction\(birthPos\)\{[^\n]*\}/), 'this.t = FUNC_NATURE_TABLE; this.lit = moonLitFraction;'].join('\n'), ctx);
const nd = process.argv[2] || 'E:/ClaudeWorkSpaceAnthropic/pl0-app/docs/research/pl7-features/tables-and-deities.ndjson';
const row = fs.readFileSync(nd, 'utf8').split('\n').filter(Boolean).map(JSON.parse).find(r => r.table_id === 'pl7.table.functional_nature_default');
let fails = 0;
row.rows.forEach((r, i) => { const want = r.slice(1).join(''); if (ctx.t[i] !== want) { fails++; console.log(`${r[0]}: app ${ctx.t[i]} vs PL7 ${want}`); } });
const lit = e => ctx.lit({ Sun: { sidereal: 10 }, Moon: { sidereal: 10 + e } });
if (Math.abs(lit(0)) > 1e-9 || Math.abs(lit(180) - 1) > 1e-9 || Math.abs(lit(90) - 0.5) > 1e-9 || Math.abs(lit(270) - 0.5) > 1e-9) { fails++; console.log('moonLitFraction wrong'); }
console.log(`12 ascendants x 9 grahas vs PL7; lit fraction checks — ${fails ? 'FAIL (' + fails + ')' : 'PASS'}`);
process.exit(fails ? 1 : 0);
