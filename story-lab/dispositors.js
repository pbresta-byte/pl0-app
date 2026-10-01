/* Dispositor theory: every graha is "ruled" by the lord of the sign it sits in; following that link repeatedly ends in a
   SINK: either a graha in its own sign (a final dispositor) or a closed loop (two grahas in each other's signs = parivartana,
   or a longer ring). Each sink is a governing circuit of the chart; everything that flows into it answers to it.
   Pure function over chart facts {lordOfSign(sign), g:{Graha:{sign,house,dig,lordOf}}, lagna:{sign}, houses}. */
const G9 = ["Sun","Moon","Mars","Mercury","Jupiter","Venus","Saturn","Rahu","Ketu"];
const KENDRA = [1,4,7,10], TRIKONA = [5,9];

function analyze(F) {
  const next = {};  // graha -> its dispositor
  for (const g of G9) next[g] = F.lordOfSign(F.g[g].sign);
  next.Lagna = F.lordOfSign(F.lagna.sign);
  const chainOf = start => { const chain=[start]; let cur=next[start]; while (!chain.includes(cur) && chain.length<12){ chain.push(cur); cur=next[cur]; } 
    return { chain, loopsTo: chain.includes(cur) ? cur : null, end: cur }; };
  // sinks
  const sinks = [];   // {kind:'own'|'exchange'|'ring', members:[...]}
  const sinkOfGraha = {};
  const keyOf = m => m.slice().sort().join("+");
  for (const s of [...G9, "Lagna"]) {
    const { chain, end } = chainOf(s);
    // members of the terminal: walk from `end` until it repeats
    let members = [end], cur = next[end]; while (cur !== end && !members.includes(cur)) { members.push(cur); cur = next[cur]; }
    const key = keyOf(members);
    let sink = sinks.find(x => x.key === key);
    if (!sink) { sink = { key, members, kind: members.length===1 ? "own" : members.length===2 ? "exchange" : "ring", fed:[] }; sinks.push(sink); }
    sink.fed.push(s); sinkOfGraha[s] = key;
  }
  sinks.forEach(s => { s.fed = [...new Set(s.fed)]; s.size = s.fed.filter(x=>!s.members.includes(x)).length; });
  sinks.sort((a,b) => b.fed.length - a.fed.length);
  // exchanges classified by the houses each member lords
  const exchanges = sinks.filter(s => s.kind === "exchange").map(s => {
    const [a,b] = s.members, ha = F.g[a].lordOf, hb = F.g[b].lordOf;
    // the exchange is between the signs where each sits: classify by the houses of THOSE two signs' lordships
    const houses = [F.g[a].house, F.g[b].house];                   // where each sits = the sign the other owns
    const lorded = { [a]: ha, [b]: hb };
    const all = [...ha, ...hb];
    const cls = all.some(h => [6,8,12].includes(h)) ? "dainya" : all.includes(3) ? "khala" : "maha";
    return { a, b, houses, lorded, cls };
  });
  return { next, chains: Object.fromEntries([...G9,"Lagna"].map(g => [g, chainOf(g)])), sinks, exchanges, sinkOfGraha };
}
module.exports = { analyze };
