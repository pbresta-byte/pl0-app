// Runs the app's own renderNatalPage() headlessly for one birth and returns the yogas it reports as present.
// The app decides which yogas apply (multi-chart, degree and dignity gated); nothing here re-judges them.
const vm = require("vm"), fs = require("fs"), path = require("path");
module.exports = function harvest(b) {
  const src = fs.readFileSync(path.join(__dirname, "../www/index.html"), "utf8");
  const scripts = [...src.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]);
  const els = {}; const mk = id => els[id] || (els[id] = { id, value:"", checked:false, innerHTML:"", textContent:"", style:{}, dataset:{}, classList:{add(){},remove(){},toggle(){},contains:()=>false}, addEventListener(){}, appendChild(){}, setAttribute(){}, querySelectorAll:()=>[], querySelector:()=>null, options:[] });
  const doc = { getElementById:mk, addEventListener(){}, querySelectorAll:()=>[], querySelector:()=>null, createElement:()=>mk("_x"+Math.random()), body:mk("body"), documentElement:mk("html") };
  const ctx = { document:doc, localStorage:{getItem:()=>null,setItem(){}}, navigator:{language:"en"}, console:{log(){},error(){},warn(){}}, Date, Math, JSON, setTimeout(){}, addEventListener(){}, matchMedia:()=>({matches:false,addEventListener(){}}) };
  ctx.window = ctx; ctx.globalThis = ctx; vm.createContext(ctx);
  for (const sc of scripts) { try { vm.runInContext(sc, ctx); } catch (e) {} }
  const [Y,M,D] = b.date.split("-"); 
  Object.assign(mk("bDate"), { value:b.date }); mk("bTime").value=b.time; mk("bTZ").value=String(b.tz); mk("bLat").value=String(b.lat); mk("bLon").value=String(b.lon); mk("bName").value=""; mk("ayanamsaMode").value="lahiri";
  mk("natalPageContent");
  try { vm.runInContext("LANG='en'", ctx); } catch (e) {}
  vm.runInContext("renderNatalPage()", ctx);
  const html = els.natalPageContent.innerHTML;
  const out = [];
  const re = /<div class="li" style="margin-bottom:9px;">\s*<span class="tag (good|bad|neutral)"[^>]*>([^<]*)<\/span>[\s\S]*?<div style="margin-top:4px[^>]*>([\s\S]*?)<\/div>\s*<div style="margin-top:5px[^>]*>([\s\S]*?)<\/div>/g;
  let m; while ((m = re.exec(html))) out.push({ tone:m[1]==="good"?"auspicious":m[1]==="bad"?"caution":"mixed", name:m[2].trim(), gloss:m[3].replace(/<[^>]+>/g,"").trim(), reason:m[4].replace(/<[^>]+>/g,"").trim() });
  return { yogas:out, htmlLen:html.length };
};
