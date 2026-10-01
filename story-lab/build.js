#!/usr/bin/env node
/* story-lab/build.js — compute facts with PL0's own engine, apply lens rules, emit readings.json.
   Usage: node build.js [YYYY-MM-DD as-of date, default today]  (no changes to www/) */
const fs = require("fs"), path = require("path"), vm = require("vm");
const loadEngine = require("./engine.js"), dispo = require("./dispositors.js"), imp = require("./importance.js");
const J = f => JSON.parse(fs.readFileSync(path.join(__dirname, f), "utf8"));
const { charts } = J("charts.json"), LJ = J("lenses.json"), { lenses } = LJ, { rules } = J("rules.json"), C = J("content.json");
const argv = process.argv.slice(2), pi = argv.indexOf("--profiles");
const profilesFile = pi >= 0 ? argv.splice(pi, 2)[1] : null;
const oi = argv.indexOf("--out"); if (oi >= 0) argv.splice(oi, 2);
const asOf = (argv[0] || new Date().toISOString().slice(0,10)).split("-").map(Number);
/* --profiles <file>: JSON copied from the app's saved people (localStorage key "muhurtaProfiles":
   [{label,bDate,bTime,bTZ,bLat,bLon,bName}]). Any chart with birth:null whose name matches a label gets filled. */
if (profilesFile) {
  const list = JSON.parse(fs.readFileSync(profilesFile, "utf8")), arr = Array.isArray(list) ? list : JSON.parse(list);
  for (const c of charts) { if (c.birth) continue;
    const p = arr.find(x => (x.label||"").trim().toLowerCase() === c.name.toLowerCase() || (x.bName||"").trim().toLowerCase() === c.name.toLowerCase());
    if (p) c.birth = { date:p.bDate, time:p.bTime, tz:+p.bTZ, lat:+p.bLat, lon:+p.bLon, place:p.label || p.bName || "" }; }
}
const G7 = ["Sun","Moon","Mars","Mercury","Jupiter","Venus","Saturn"];
const SIGNS = ["Aries","Taurus","Gemini","Cancer","Leo","Virgo","Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"];
const KENDRA = [1,4,7,10], DUSTHANA = [6,8,12];
const ctx = loadEngine();

/* ---------- 1. FACTS (engine does the astronomy; nothing here is AI-judged) ---------- */
function computeFacts(b) {
  const [Y,M,D] = b.date.split("-").map(Number), [hh,mm] = b.time.split(":").map(Number);
  ctx.__in = { Y,M,D,hh,mm,tz:b.tz,lat:b.lat,lon:b.lon, aY:asOf[0], aM:asOf[1], aD:asOf[2] };
  const raw = JSON.parse(vm.runInContext(`(function(){ const i=__in;
    const jd=julianDay(i.Y,i.M,i.D,i.hh,i.mm,0,i.tz), pos=computePositions(jd,i.lat,i.lon,"lahiri");
    const asc=pos._ascSidereal, ascIdx=Math.floor(asc/30);
    const gs=["Sun","Moon","Mars","Mercury","Jupiter","Venus","Saturn","Rahu","Ketu"], out={};
    gs.forEach(g=>{ const s=pos[g].sidereal; out[g]={sid:s, speed:pos[g].speed, dig:dignityTier(g,s), nav:Math.floor(navamsaSidereal(s)/30)};
      if(["Sun","Moon","Mars","Mercury","Jupiter","Venus","Saturn"].includes(g)) out[g].appNB=nichaBhangaCheck(g,s,pos,ascIdx); });
    const nak=nakshatraFromSidereal(pos.Moon.sidereal,false);
    const navAsc=Math.floor(navamsaSidereal(asc)/30);
    const mds=vimshottariMahadashas(pos,jd).map(p=>({lord:p.lord,s:jdToLocalString(p.startJD,i.tz),e:jdToLocalString(p.endJD,i.tz)}));
    const nowJD=julianDay(i.aY,i.aM,i.aD,12,0,0,i.tz);
    const chain=vimshottariChainAt(pos,jd,nowJD,2).map(p=>({lord:p.lord,s:jdToLocalString(p.startJD,i.tz),e:jdToLocalString(p.endJD,i.tz)}));
    return JSON.stringify({asc,navAsc,out,nak,mds,chain,signLord:SIGN_LORD,ayanamsa:pos._ayanamsa});
  })()`, ctx));
  const lagIdx = Math.floor(raw.asc/30);
  const F = { lagna:{ signIdx:lagIdx, sign:SIGNS[lagIdx], deg:+(raw.asc-lagIdx*30).toFixed(2), navIdx:raw.navAsc }, g:{}, houses:{}, ayanamsa:+raw.ayanamsa.toFixed(3), nak:raw.nak, dasha:{ all:raw.mds, now:raw.chain } };
  const houseOf = si => ((si - lagIdx + 12) % 12) + 1;
  F.houseOf = houseOf; F.lordOfSign = s => raw.signLord[s];
  for (const g of Object.keys(raw.out)) {
    const o = raw.out[g], si = Math.floor(o.sid/30), deg = o.sid - si*30;
    F.g[g] = { name:g, signIdx:si, sign:SIGNS[si], deg:+deg.toFixed(2), sid:+o.sid.toFixed(3), house:houseOf(si), dig:o.dig, retro:o.speed<0,
      navIdx:o.nav, vargottama:o.nav===si, appNB:o.appNB||null, lordOf:[], aspHouses:[] };
  }
  for (let h=1; h<=12; h++) { const si=(lagIdx+h-1)%12, lord=raw.signLord[SIGNS[si]];
    F.houses[h] = { n:h, signIdx:si, sign:SIGNS[si], lord, occupants:Object.keys(F.g).filter(g=>F.g[g].house===h) };
    F.g[lord].lordOf.push(h); }
  const asp = { Mars:[4,7,8], Jupiter:[5,7,9], Saturn:[3,7,10] };   // Parāśarī graha-dṛṣṭi, whole-sign; nodes left out (tradition-dependent)
  for (const g of G7) F.g[g].aspHouses = (asp[g]||[7]).map(n => ((F.g[g].house+n-2)%12)+1);
  for (const g of G7) F.g[g].aspGrahas = Object.keys(F.g).filter(x=>x!==g && F.g[x].house && F.g[g].aspHouses.includes(F.g[x].house));
  const orb = { Moon:12, Mars:17, Mercury:14, Jupiter:11, Venus:10, Saturn:15 };
  for (const g of Object.keys(orb)) { let d=Math.abs(F.g[g].sid-F.g.Sun.sid); if(d>180)d=360-d; F.g[g].sunSep=+d.toFixed(2); F.g[g].combust=d<orb[g]&&!F.g[g].retro||d<orb[g]-2&&F.g[g].retro; }
  const rank = G7.slice().sort((a,b)=>F.g[b].deg-F.g[a].deg), roles=["AK","AmK","BK","MK","PK","GK","DK"];
  F.karaka = {}; roles.forEach((r,i)=>F.karaka[r]=rank[i]);
  return F;
}

/* ---------- 2. RULE ENGINE ---------- */
const fmt = (t, v) => (t||"").replace(/\{(\w+)\}/g, (_,k) => v[k]===undefined ? `{${k}?}` : v[k]);
const gN = g => C.grahaName[g], sN = si => C.signName[si], H = n => C.house[n];
const lower = s => (s||"").toLowerCase();
const listN = a => a.map(gN).join(", ");

function nbCheck(F, g) {
  const x=F.g[g], moonSi=F.g.Moon.signIdx, lagSi=F.lagna.signIdx, why=[];
  const kendraFromEither = si => KENDRA.includes(((si-lagSi+12)%12)+1) || KENDRA.includes(((si-moonSi+12)%12)+1);
  const disp = F.lordOfSign(x.sign);
  if (kendraFromEither(F.g[disp].signIdx)) why.push(`${gN(disp)}, lord of its debilitation sign ${sN(x.signIdx)}, stands in a kendra from Lagna or Chandra`);
  const exSign = ({Sun:"Aries",Moon:"Taurus",Mars:"Capricorn",Mercury:"Virgo",Jupiter:"Cancer",Venus:"Pisces",Saturn:"Libra"})[g];
  const exLord = F.lordOfSign(exSign);
  if (exLord!==disp && kendraFromEither(F.g[exLord].signIdx)) why.push(`${gN(exLord)}, lord of ${gN(g)}'s exaltation sign, stands in a kendra from Lagna or Chandra`);
  const exHere = ({Aries:"Sun",Taurus:"Moon",Capricorn:"Mars",Virgo:"Mercury",Cancer:"Jupiter",Pisces:"Venus",Libra:"Saturn"})[x.sign];
  if (exHere && exHere!==disp && kendraFromEither(F.g[exHere].signIdx)) why.push(`${gN(exHere)}, exalted in this very sign, stands in a kendra from Lagna or Chandra`);
  if (exHere && F.g[exHere].signIdx===x.signIdx && exHere!==g) why.push(`${gN(exHere)}, exalted in this sign, is conjunct`);
  return why;
}

const binders = {
  bind_moon(F, v, r) { const m=F.g.Moon; Object.assign(v,{ signN:sN(m.signIdx), moonStar:(C.moonSign[m.sign]||{star:[]}).star.join(" * "),
    moonStarJoin:(C.moonSign[m.sign]||{star:[]}).star.join(", "), nakName:F.nak.name, pada:F.nak.pada, navN:sN(m.navIdx) });
    const lord = require("./nakLords.json")[F.nak.name]; v.profLine = C.professor[lord]||""; v.profShort=(C.professor[lord]||"").split(" — ")[0];
    const gist=(C.nakshatra[F.nak.name]||{}).gist; v.nakGist = gist ? ` It reads as ${gist}.` : "";
    r.push(`Moon · ${m.sign} ${m.deg}° · ${F.nak.name} pāda ${F.nak.pada} · bhava ${m.house}`); r.push(`navāṁśa Moon · ${SIGNS[m.navIdx]}`); return true; },
  bind_moon_dispositor(F, v, r) { const m=F.g.Moon, d=F.lordOfSign(m.sign), dg=F.g[d];
    Object.assign(v,{ signN:sN(m.signIdx), dN:gN(d), dp:dg.house, dpName:H(dg.house).name, dSignN:sN(dg.signIdx), dDigLower:lower(dg.dig), pg:d,
      dAspects: dg.aspGrahas.length ? dg.aspGrahas.map(gN).join(", ")+` (and bhava ${dg.aspHouses.join(", ")})` : `bhava ${dg.aspHouses.join(", ")}` });
    r.push(`Moon in ${m.sign} → dispositor ${d}`); r.push(`${d} · ${dg.sign} ${dg.deg}° · bhava ${dg.house} · ${dg.dig}`); r.push(`${d} aspects bhava ${dg.aspHouses.join(", ")}`); return true; },
  bind_moon_10th(F, v, r) { const m=F.g.Moon, si=(m.signIdx+9)%12, lord=F.lordOfSign(SIGNS[si]), lg=F.g[lord];
    Object.assign(v,{ t10N:sN(si), t10Line:C.tenthFromMoonLine[SIGNS[si]], t10LordN:gN(lord), t10SignN:sN(lg.signIdx), t10Dig:lower(lg.dig), pg:lord,
      t10Tone: lg.dig==="Exalted"||lg.dig==="Own" ? "well supported" : lg.dig==="Debilitated" ? "built under strain, and learned the hard way" : "ordinary in strength: results track effort",
      t10NB: lg.dig==="Debilitated" && nbCheck(F,lord).length ? ` (Cancellation conditions exist for ${gN(lord)}; see Partnership.)` : "" });
    r.push(`10th from Moon (${m.sign}) = ${SIGNS[si]}, lord ${lord}`); r.push(`${lord} · ${lg.sign} ${lg.deg}° · ${lg.dig}`); return true; },
  moon_house_in(F, v, r, c) { const ok=c.houses.includes(F.g.Moon.house); if(ok){ v.vyayaTheme=H(F.g.Moon.house).theme; r.push(`Moon in bhava ${F.g.Moon.house}`);} return ok; },
  bind_karaka(F, v, r, c) { const g=F.karaka[c.role], x=F.g[g];
    Object.assign(v,{ kN:gN(g), kDeg:x.deg, kSignN:sN(x.signIdx), kNavN:sN(x.navIdx), kHouse:x.house, kHouseName:H(x.house).name, kHouseTheme:H(x.house).theme, kDig:lower(x.dig), pg:g,
      kVarg: x.vargottama ? " It is vargottama, so the practice is the same inside and out." : "", kVargClause: x.vargottama ? " [vargottama]" : "",
      kDigLine: x.dig==="Debilitated" ? "Debilitated by sign: the partner-lessons are learned through effort, not given." : x.dig==="Exalted"||x.dig==="Own" ? "Strong by sign: partner-themes have a firm footing." : `${x.dig} by sign.` });
    r.push(`${c.role} = ${g} (${x.deg}° ${x.sign}) · bhava ${x.house} · ${x.dig}`); r.push(`navāṁśa ${g} · ${SIGNS[x.navIdx]}`); return true; },
  moon_node_conj(F, v, r) { const m=F.g.Moon; const n=["Rahu","Ketu"].find(x=>F.g[x].signIdx===m.signIdx); if(!n) return false;
    let sep=Math.abs(m.sid-F.g[n].sid); if(sep>180)sep=360-sep; const d=F.lordOfSign(m.sign);
    Object.assign(v,{ gN:gN(n), signN:sN(m.signIdx), sep:sep.toFixed(1), dN:gN(d), nodeFeel: n==="Rahu" ? "hunger, restlessness and an appetite for the unconventional" : "detachment, a sense of having done this before, and a pull toward the essential" });
    r.push(`Moon + ${n} in ${m.sign} (${sep.toFixed(1)}° apart)`); return true; },
  node_house(F, v, r) { v.nodeVerb = v.g==="Rahu" ? "appetite, experiment and over-reach gather" : "release, refinement and quiet mastery gather"; r.push(`${v.g} · ${F.g[v.g].sign} ${F.g[v.g].deg}° · bhava ${F.g[v.g].house}`); return true; },
  cluster_in_house(F, v, r) { r.push(`bhava ${v.p} occupants: ${v.occ}`); return true; },
  aspects_house(F, v, r, c) { const x=F.g[v.g]; if(!x.aspHouses.includes(c.house)) return false; r.push(`${v.g} (bhava ${x.house}) aspects bhava ${c.house}`); return true; },
  dasha_lord(F, v, r, c) { const p=F.dasha.now[c.level-1], dg=F.g[p.lord]; if(!dg) return false;
    const ok = (c.dignityIn && c.dignityIn.includes(dg.dig)) || (c.houseIn && c.houseIn.includes(dg.house));
    if (!ok) return false;
    Object.assign(v,{ lvl:c.level===1?"Mahādaśā":"Antardaśā", dN:gN(p.lord), dSignN:sN(dg.signIdx), dDigLower:lower(dg.dig), dp:dg.house, dpName:H(dg.house).name, dpTheme:H(dg.house).theme,
      dLine:C.dashaLordLine[p.lord], dLordOf: dg.lordOf.length? dg.lordOf.map(h=>`bhava-${h}`).join(" & ") : "no house (a node)", pg:p.lord });
    r.push(`Mahādaśā ${p.lord} · ${fmtD(p.s)} → ${fmtD(p.e)}`); r.push(`${p.lord} · ${dg.sign} ${dg.deg}° · bhava ${dg.house} · ${dg.dig}`); return true; }
};
const fmtD = d => `${d.year}-${String(d.month).padStart(2,"0")}-${String(d.day).padStart(2,"0")}`;

function expand(rule, F) {
  if (!rule.for) return [ {} ];
  if (rule.for.house) return rule.for.house.map(h => { const lord=F.houses[h].lord, p=F.g[lord].house;
      return { h, hName:H(h).name, hTheme:H(h).theme, lord, lordN:gN(lord), p, pName:H(p).name, pTheme:H(p).theme, signN:sN(F.g[lord].signIdx), pg:lord }; });
  if (rule.for.graha) return rule.for.graha.map(g => ({ g, gN:gN(g), p:F.g[g].house, pName:H(F.g[g].house).name, pTheme:H(F.g[g].house).theme, signN:sN(F.g[g].signIdx), pg:g }));
  if (rule.for.cluster) return Object.values(F.houses).filter(x=>x.occupants.length>=rule.for.cluster).map(x=>({ p:x.n, pName:H(x.n).name, pTheme:H(x.n).theme, occ:x.occupants.map(gN).join(", ") }));
  if (rule.for.pair === "kendra-trikona") { const out=[];
    for (const ha of [4,7,10]) for (const hb of [5,9]) { const a=F.houses[ha].lord, b=F.houses[hb].lord;
      if (a!==b && F.g[a].signIdx===F.g[b].signIdx) out.push({ a, b, aN:gN(a), bN:gN(b), ha, hb, signN:sN(F.g[a].signIdx), p:F.g[a].house, pName:H(F.g[a].house).name, pTheme:H(F.g[a].house).theme }); }
    return out; }
  return [];
}
const conds = {
  lord_in(F,v,r,c){ const ok=c.houses.includes(v.p); if(ok){ r.push(`${v.lord} lords bhava ${v.h} (${F.houses[v.h].sign})`); r.push(`${v.lord} · ${F.g[v.lord].sign} ${F.g[v.lord].deg}° · bhava ${v.p}`);
      const others=F.g[v.lord].lordOf.filter(x=>x!==v.h && !DUSTHANA.includes(x)); v.vipName={6:"Harṣa",8:"Sarala",12:"Vimala"}[v.h]||""; v.mixNote = others.length ? ` The same graha also lords bhava-${others.join(" & ")}, which dilutes the effect.` : ""; if(others.length) r.push(`${v.lord} also lords bhava ${others.join(", ")} (mixed lordship)`);} return ok; },
  dignity_is(F,v,r,c){ const x=F.g[v.g]; const ok=c.tiers.includes(x.dig); if(ok){ v.dig=x.dig; v.digLower=lower(x.dig); r.push(`${v.g} · ${x.sign} ${x.deg}° · ${x.dig} · bhava ${x.house}`);} return ok; },
  nb_any(F,v,r){ const why=nbCheck(F,v.g); if(!why.length) return false; v.nbWhy=why.join("; "); why.forEach(w=>r.push(w));
      const app=F.g[v.g].appNB; r.push(`(engine's own two-condition check: ${app&&app.cancelled?"cancelled":"not cancelled"})`); return true; },
  combust_is(F,v,r){ const x=F.g[v.g]; if(!x.combust) return false; v.sunSep=x.sunSep; r.push(`${v.g} ${x.sunSep}° from Sun`); return true; },
  vargottama_is(F,v,r){ const x=F.g[v.g]; if(!x.vargottama) return false; r.push(`${v.g} · ${x.sign} in rāśi and navāṁśa`); return true; },
  pair_same_sign(F,v,r){ r.push(`${v.a} (lord of bhava ${v.ha}) + ${v.b} (lord of bhava ${v.hb}) in ${SIGNS[F.g[v.a].signIdx]}`); return true; }
};
const pol = (how, F, v) => { const x=F.g[v.pg]; if(!x) return 0;
  if (how==="dignity") return ["Exalted","Own"].includes(x.dig)?1 : x.dig==="Debilitated"?-1 : 0;
  if (how==="dignityOrVargottama") return (x.vargottama||["Exalted","Own"].includes(x.dig))?1 : x.dig==="Debilitated"?-1 : 0; return 0; };
const topicOf = (t, v, F) => t.startsWith("house:") ? C.houseTopic[v[t.slice(6)==="$h"?"h":"p"]||v.p] : t.startsWith("graha:") ? C.grahaTopic[v.g] : t;

function softener(F, g) { const x=F.g[g];
  if (["Exalted","Own"].includes(x.dig)) return `${gN(g)} is ${lower(x.dig)} by sign`;
  if (x.dig==="Debilitated" && nbCheck(F,g).length) return `${gN(g)}'s debility has cancellation conditions`; return ""; }
function applyRules(F) {
  const findings = [];
  for (const rule of rules) for (const v of expand(rule, F)) {
    const receipts=[]; let ok=true;
    for (const c of rule.when) { const fn = binders[c.op] || conds[c.op]; if(!fn) throw new Error("unknown op "+c.op); if(!fn(F,v,receipts,c)) { ok=false; break; } }
    if (!ok) continue;
    let weight = rule.weight; v.softNote=""; v.seatNote="";
    if (rule.softenLord) { const sf=softener(F,v.lord); if(sf){ weight=Math.max(1,weight-1); v.softNote=` Softened: ${sf}.`; receipts.push(`softener: ${sf}`);} }
    if (rule.softenSeat && DUSTHANA.includes(v.p)) { weight=Math.max(1,weight-1); v.seatNote=` Its seat is a dusthana, so the yoga is partial: fruit comes late and through effort.`; receipts.push(`seat bhava ${v.p} is a dusthana`); }
    const p = rule.polarityBy ? pol(rule.polarityBy,F,v) : rule.polarity;
    findings.push({ id:rule.id, lens:rule.lens, topic:topicOf(rule.topic,v,F), polarity:p, weight, beat:fmt(rule.beat,v), clause:fmt(rule.clause,v),
      check:(rule.check||[]).map(t=>fmt(t,v)), caveat:rule.caveat||null, receipts });
  }
  return findings;
}

/* ---------- 3. JUDGEMENTS: per chapter, per lens, then compare ---------- */
function judge(F, findings) {
  const chapters = C.chapters.map(ch => {
    const fs_ = findings.filter(f=>f.topic===ch.id).sort((a,b)=>b.weight-a.weight);
    const byLens = {};
    for (const l of lenses) { const mine=fs_.filter(f=>f.lens===l.id), score=mine.reduce((s,f)=>s+f.polarity*f.weight,0);
      const hasPos=mine.some(f=>f.polarity>0), hasNeg=mine.some(f=>f.polarity<0), tension=hasPos&&hasNeg;
      byLens[l.id] = { n:mine.length, score, tension, verdict: !mine.length ? "silent" : score>0 ? "supportive" : score<0 ? "strained" : tension ? "balanced" : "descriptive" }; }
    const signs = Object.values(byLens).map(x=>x.verdict).filter(v=>v==="supportive"||v==="strained");
    const agreement = !signs.length ? "descriptive" : signs.length===1 ? "single-lens" : new Set(signs).size===1 ? "convergent" : "divergent";
    return { ...ch, findings:fs_, byLens, agreement };
  });
  const prologue = chapters.filter(c=>c.findings.length).map(c=>({ id:c.id, title:c.title, line:(c.findings.find(f=>f.polarity!==0)||c.findings[0]).beat, agreement:c.agreement }));
  return { chapters, prologue };
}

/* ---------- 4. corpus cross-check: do the BPL example tags for this Moon pāda match the chart? ---------- */
function corpusTags(F) {
  try { const pool=J("../domains/_bpl_raw_pool.json"), num=String(require("./nakLords.json")._order.indexOf(F.nak.name)+1).padStart(2,"0");
    const key=Object.keys(pool).find(k=>k.includes(`Nakshatra_Chandra__${num}`)); if(!key) return [];
    const navN=SIGNS[F.g.Moon.navIdx], padaRe=new RegExp(`[-–]\\s?${F.nak.pada}\\s?\\]`);
    return pool[key].filter(t=>padaRe.test(t)).map(t=>t.replace(/^\[[^|]*\|EXAMPLE\]\s*/,"").replace(/\s+/g," "))
      .map(t=>({ tag:t, matches: /navamsha Chandra-(\w+)/i.test(t) ? new RegExp("Chandra-"+C.signName[F.g.Moon.navIdx].replace(/[^\w]/g,"."),"i").test(t.replace(/ā/g,"a")) || t.includes(navN.slice(0,4)) || /Kanya/.test(t)&&navN==="Virgo" : /yuti-(\w+)/.test(t) ? F.g.Moon.signIdx===F.g[({Shani:"Saturn",Shukra:"Venus",Kuja:"Mars",Budha:"Mercury",Guru:"Jupiter",Rahu:"Rahu",Ketu:"Ketu",Surya:"Sun"})[(t.match(/yuti-(\w+)/)||[])[1]]||"Sun"].signIdx : null })); } catch(e){ return []; } }

/* ---------- run ---------- */
const results = [];
for (const c of charts) {
  if (!c.birth) { results.push({ id:c.id, name:c.name, status:"awaiting-birth-data", birth:null }); continue; }
  const F = computeFacts(c.birth); F.disp = dispo.analyze(F); F.rank = imp.rank(F, F.disp, F.dasha.now); const findings = applyRules(F), J2 = judge(F, findings);
  const tags = corpusTags(F);
  const facts = { lagna:F.lagna, ayanamsa:F.ayanamsa, moonNak:F.nak, dasha:F.dasha, karaka:F.karaka, importance:F.rank, dispositors:{ next:F.disp.next, sinks:F.disp.sinks, exchanges:F.disp.exchanges },
    grahas:Object.fromEntries(Object.entries(F.g).map(([k,x])=>[k,{ sign:x.sign, deg:x.deg, house:x.house, dig:x.dig, retro:x.retro, vargottama:x.vargottama, combust:!!x.combust, navSign:SIGNS[x.navIdx], lordOf:x.lordOf, aspHouses:x.aspHouses, aspGrahas:x.aspGrahas||[] }])),
    houses:Object.fromEntries(Object.entries(F.houses).map(([k,x])=>[k,{ sign:x.sign, lord:x.lord, occupants:x.occupants }])) };
  results.push({ id:c.id, name:c.name, status:"computed", birth:c.birth, asOf:asOf.join("-"), facts, chapters:J2.chapters, prologue:J2.prologue, corpusTags:tags,
    stats:{ findings:findings.length, byLens:Object.fromEntries(lenses.map(l=>[l.id, findings.filter(f=>f.lens===l.id).length])) } });
}
const OUT = (()=>{ const i=process.argv.indexOf("--out"); return i>=0 ? path.resolve(process.argv[i+1]) : path.join(__dirname,"out"); })(); fs.mkdirSync(OUT,{recursive:true});
fs.writeFileSync(path.join(OUT,"readings.json"), JSON.stringify({ lenses, agreement:LJ.agreement, content:{ chapters:C.chapters, grahaGlyph:C.grahaGlyph, signGlyph:C.signGlyph, signName:C.signName, grahaName:C.grahaName, house:C.house }, charts:results }, null, 1));
console.log(results.map(r=>`${r.name}: ${r.status}${r.stats?` · ${r.stats.findings} findings ${JSON.stringify(r.stats.byLens)}`:""}`).join("\n"));
