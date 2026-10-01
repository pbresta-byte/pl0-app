/* Importance: which grahas carry the chart, and which are minor. Transparent additive score; every point has a stated reason. */
const KENDRA = [1,4,7,10], TRIKONA = [5,9];
function rank(F, disp, now) {
  const rows = [];
  const mdLord = now[0].lord, adLord = now[1].lord;
  const lagnaLord = F.lordOfSign(F.lagna.sign);
  for (const g of ["Sun","Moon","Mars","Mercury","Jupiter","Venus","Saturn","Rahu","Ketu"]) {
    const x = F.g[g], why = []; let s = 0; const add = (n, t) => { s += n; why.push(`+${n} ${t}`); };
    const sink = disp.sinks.find(k => k.members.includes(g));
    if (sink) { const fed = sink.fed.filter(m => m !== g && !sink.members.includes(m)).length + (sink.members.length-1);
      add(sink.kind==="own" ? 3 : 4, sink.kind==="own" ? "final dispositor (sits in its own sign)" : sink.kind==="exchange" ? `in a mutual exchange with ${sink.members.find(m=>m!==g)}` : "in the governing ring");
      if (fed) add(fed, `${fed} graha${fed>1?"s":""}/Lagna answer${fed>1?"":"s"} to this circuit`); }
    else { const to = disp.chains[g].chain.find(c => disp.sinks.some(k => k.members.includes(c))); if (to) why.push(`passes its results to ${to}`); }
    const fedDirect = Object.entries(disp.next).filter(([k,v]) => v===g && k!==g).length;
    if (fedDirect) add(fedDirect*0.5, `${fedDirect} direct dependant${fedDirect>1?"s":""}`);
    if (g===lagnaLord) add(3, "Lagna lord"); if (g==="Moon") add(3, "the Moon (mind, felt life)");
    if (g===mdLord) add(3, "runs the current Mahādaśā"); if (g===adLord) add(1.5, "runs the current Antardaśā");
    if (g===F.karaka.AK) add(1, "Ātmakāraka"); if (g===F.karaka.DK) add(0.5, "Dārākāraka");
    if (["Exalted","Own"].includes(x.dig) || x.vargottama) add(1, x.vargottama ? "vargottama" : x.dig.toLowerCase()); else if (x.dig==="Debilitated") add(1, "debilitated (a notable weakness)");
    if (x.combust) add(0.5, "combust");
    const hs = x.lordOf; if (hs.some(h=>KENDRA.includes(h)) && hs.some(h=>TRIKONA.includes(h))) add(2, "lords a kendra and a trikona");
    rows.push({ g, score:+s.toFixed(1), why, house:x.house, sign:x.sign, dig:x.dig, lordOf:x.lordOf });
  }
  rows.sort((a,b) => b.score - a.score);
  return rows;
}
module.exports = { rank };
