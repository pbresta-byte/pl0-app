#!/usr/bin/env node
/* Daily Jyotish briefing for Cristian — runs PL0 engine, prints JSON for the cron prompt. */
const vm = require("vm"), fs = require("fs");

const YEAR = parseInt(process.argv[2]), MONTH = parseInt(process.argv[3]), DAY = parseInt(process.argv[4]);
let src = fs.readFileSync("C:/Users/drrag/OneDrive/Desktop/pl0-app/www/index.html", "utf8");
const scripts = [...src.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]);
const ctx = {
  document: { getElementById: () => ({value:"",checked:false,innerHTML:""}), addEventListener:()=>{}, querySelectorAll:()=>[] },
  localStorage: {getItem:()=>null,setItem:()=>{}}, navigator:{language:"en"}, console, Date, Math, JSON
};
ctx.window = ctx; ctx.globalThis = ctx;
vm.createContext(ctx);
for (const sc of scripts) { try { vm.runInContext(sc, ctx); } catch(e) {} }

const out = vm.runInContext(`
  const refP = {star:"Dhanishta", pada:2, sign:"Capricorn", lifeBird: birdOfStar("Dhanishta", "bright")};
  const opts = {lat:25.7617, lon:-80.1918, tz:-4, ayanamsaMode:"lahiri", refP,
    weighTara:true, weighPP:true, weighDignity:true, weighMuhurtaDosha:true};
  const r = scoreForInstant(${YEAR}, ${MONTH}, ${DAY}, 9, 0, opts);
  const panch = r.panch;
  const pos = computePositions(julianDay(${YEAR}, ${MONTH}, ${DAY}, 12, 0, 0, -4), 25.7617, -80.1918);
  const moonSign = SIGNS[Math.floor(pos.Moon.sidereal/30)];
  const chIdx = SIGNS.indexOf("Capricorn");
  const isChandrashtama = moonSign === SIGNS[(chIdx+8)%12];
  const windows = muhurtaWindows(${YEAR}, ${MONTH}, ${DAY}, 9, 0, 25.7617, -80.1918, -4);
  JSON.stringify({
    date: "${YEAR}-${MONTH}-${DAY}",
    score: +r.score.toFixed(2), tier: r.tier.name, tierLabel: r.tier.label,
    tithi: panch.tithiName, paksha: panch.paksha,
    nak: panch.nak.name, yoga: panch.yogaName, karana: panch.karana.name,
    moonSign, isChandrashtama,
    maleficHits: r.vedha ? r.vedha.maleficHits.length : 0,
    beneficHits: r.vedha ? r.vedha.beneficHits.length : 0,
    tara: (r.tara||{}).name || "n/a", taraTone: (r.tara||{}).tone || "",
    pp: ((r.pp||{}).mainState||"?") + " / " + ((r.pp||{}).abstractState||"?"),
    windows: windows.map(w => w.name + (w.tone==="good" ? " (+)" : " (-)")),
    reasons: r.reasons.slice(0,6).map(x => x.text)
  });
`, ctx);
console.log(out);
