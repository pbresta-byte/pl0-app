// Block-by-block syntax check for PL0 www/index.html
const vm = require("vm"), fs = require("fs");
const src = fs.readFileSync("www/index.html", "utf8");
const scripts = [...src.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]);
let hasError = false;
scripts.forEach((sc, i) => {
  try { new vm.Script(sc); }
  catch (e) { console.log(`script ${i} SYNTAX FAIL: ${e.message.slice(0,150)}`); hasError = true; }
});
console.log(`checked ${scripts.length} blocks; ${hasError ? "ERRORS FOUND" : "all clean"}`);
process.exit(hasError ? 1 : 0);
