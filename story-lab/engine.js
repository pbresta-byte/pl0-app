// Loads PL0's single-file engine (www/index.html) into a vm sandbox without touching it.
const vm = require("vm"), fs = require("fs"), path = require("path");
module.exports = function loadEngine() {
  const src = fs.readFileSync(path.join(__dirname, "../www/index.html"), "utf8");
  const scripts = [...src.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]);
  const el = () => ({ value:"", checked:false, innerHTML:"", style:{}, classList:{add(){},remove(){},toggle(){}}, addEventListener(){}, appendChild(){}, setAttribute(){}, querySelectorAll:()=>[], querySelector:()=>null });
  const ctx = { document:{ getElementById:el, addEventListener(){}, querySelectorAll:()=>[], querySelector:()=>null, createElement:el, body:el(), documentElement:el() },
    localStorage:{getItem:()=>null,setItem(){}}, navigator:{language:"en"}, console:{log(){},error(){},warn(){}}, Date, Math, JSON, setTimeout(){}, addEventListener(){}, matchMedia:()=>({matches:false,addEventListener(){}}) };
  ctx.window = ctx; ctx.globalThis = ctx; vm.createContext(ctx);
  for (const sc of scripts) { try { vm.runInContext(sc, ctx); } catch (e) {} }
  return ctx;
};
