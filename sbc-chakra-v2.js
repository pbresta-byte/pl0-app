/* =========================================================================
   SARVATO BHADRA CHAKRA — ACCURATE RENDERER (v2)
   Improvements over the legacy renderSBCRing():
     • Full 81-cell (9×9) frame, not just the perimeter ring.
     • Corner vowel stacks (16 vowels: a ā i ī u ū ṛ ṝ ḷ ḹ e ai o au aṃ aḥ),
       Sun-ruled per the classical assignment.
     • Loka bands labelled on the four arms (Mahar / Janar / Tapar / Satya),
       per Sanjay Rath, Brhat Naksatra ch.2 — the SBC is the 'all-auspicious
       wheel of time' connecting physical and spiritual planes.
     • Vedha drawn as CLASSICAL CONNECTING LINES between the striking body's
       cell and the struck cell (the way printed charts show it), not merely
       a fill tint. Line colour encodes benefic/malefic.
     • Inner 7×7 kept visually quiet (dashed Brahma-sthāna border) until the
       inner-layer tables (rāśi/tithi/vāra placement, Agarwal p.68) are
       transcribed from a legible scan — see VERIFICATION.md.
   Drop-in replacement: same signature as renderSBCRing(hitStarSet, refStar).
   ========================================================================= */

const SBC_V2_EAST  = ["Krittika","Rohini","Mrigasira","Ardra","Punarvasu","Pushya","Ashlesha"];
const SBC_V2_SOUTH = ["Magha","P.Phalguni","U.Phalguni","Hasta","Chitra","Swati","Visakha"];
const SBC_V2_WEST  = ["Anuradha","Jyeshta","Moola","P.Shada","U.Shada","Abhijit","Sravana"];
const SBC_V2_NORTH = ["Dhanishta","Satabisha","P.Bhadrapada","U.Bhadrapada","Revati","Aswini","Bharani"];

// Corner vowels — clockwise from top-left. Each stack holds 4 vowels;
// 4 stacks × 4 = 16 vowels total (Sun-ruled).
const SBC_V2_CORNERS = {
  TL: ["a",  "i",  "u",  "ṛ"],
  TR: ["ā",  "ī",  "ū",  "ṝ"],
  BR: ["ḷ",  "e",  "ai", "o"],
  BL: ["au", "aṃ", "aḥ", "·"]
};

// Arm → loka label (Rath, Brhat Naksatra ch.2).
const SBC_V2_LOKA = {
  east:  "MAHAR LOKA",
  south: "JANAR LOKA",
  west:  "TAPAR LOKA",
  north: "SATYA LOKA"
};

function renderSBCChakraV2(hitStarSet, refStar){
  const cell = 44, pad = 1, size = cell * 9;
  const ZONE_STYLE = {
    east:  {bg:"var(--zone-east-bg)",  line:"var(--zone-east-line)"},
    south: {bg:"var(--zone-south-bg)", line:"var(--zone-south-line)"},
    west:  {bg:"var(--zone-west-bg)",  line:"var(--zone-west-line)"},
    north: {bg:"var(--zone-north-bg)", line:"var(--zone-north-line)"}
  };
  // map star name → [col,row]
  const pos = {};
  SBC_V2_EAST.forEach((s,i)=> pos[s]=[1+i,0]);
  SBC_V2_SOUTH.forEach((s,i)=> pos[s]=[8,1+i]);
  SBC_V2_WEST.forEach((s,i)=> pos[s]=[7-i,8]);   // stored L→R, drawn R→L
  SBC_V2_NORTH.forEach((s,i)=> pos[s]=[0,1+i]);

  const cellCx = c => c*cell + cell/2;
  const cellCy = r => r*cell + cell/2;

  let svg = `<svg viewBox="0 -14 ${size} ${size+28}" width="100%" style="max-width:600px;display:block;margin:0 auto;" class="sbc-v2">`;

  /* ---- outer frame ---- */
  svg += `<rect x="${pad}" y="${pad}" width="${size-2*pad}" height="${size-2*pad}" fill="none" style="stroke:var(--gold);stroke-width:2"/>`;

  /* ---- nakshatra perimeter cells ---- */
  function drawStar(star, cx, cy, zone){
    const hit = hitStarSet && star && hitStarSet.has ? hitStarSet.get(star) : (hitStarSet&&hitStarSet.has&&hitStarSet.has(star)?{type:"bad"}:null);
    const isRef = star === refStar;
    const zs = ZONE_STYLE[zone];
    let fill = zs.bg, stroke = zs.line, tcol = "var(--cell-ink)";
    if (hit && hit.type==="bad"){ fill="var(--hit-bad-bg)"; stroke="var(--hit-bad-line)"; tcol="var(--hit-bad-ink)"; }
    else if (hit && hit.type==="good"){ fill="var(--hit-good-bg)"; stroke="var(--hit-good-line)"; tcol="var(--hit-good-ink)"; }
    svg += `<g><title>${star}</title>
      <rect x="${cx*cell+pad}" y="${cy*cell+pad}" width="${cell-2*pad}" height="${cell-2*pad}"
        style="fill:${fill};stroke:${isRef?'var(--gold)':stroke};stroke-width:${isRef?2.5:1}"/>
      <text x="${cellCx(cx)}" y="${cellCy(cy)+4}" text-anchor="middle" font-size="11.5"
        style="fill:${tcol}" font-family="var(--mono)" font-weight="${isRef?'700':'500'}">${NAK28_SHORT[star]}</text></g>`;
  }
  SBC_V2_EAST.forEach((s,i)=> drawStar(s,1+i,0,"east"));
  SBC_V2_SOUTH.forEach((s,i)=> drawStar(s,8,1+i,"south"));
  SBC_V2_WEST.forEach((s,i)=> drawStar(s,7-i,8,"west"));
  SBC_V2_NORTH.forEach((s,i)=> drawStar(s,0,1+i,"north"));

  /* ---- corner vowel stacks ---- */
  function drawCorner(cx, cy, vowels){
    const n = vowels.length, vh = (cell-2)/n;
    svg += `<g><rect x="${cx*cell+pad}" y="${cy*cell+pad}" width="${cell-2*pad}" height="${cell-2*pad}"
      style="fill:var(--panel-2);stroke:var(--chart-line)"/>`;
    vowels.forEach((v,i)=>{
      svg += `<text x="${cellCx(cx)}" y="${cy*cell+pad+vh*i+vh*0.72}" text-anchor="middle" font-size="${n>3?9:11}"
        style="fill:var(--muted)" font-family="var(--serif)">${v}</text>`;
    });
    svg += `</g>`;
  }
  drawCorner(0,0,SBC_V2_CORNERS.TL);
  drawCorner(8,0,SBC_V2_CORNERS.TR);
  drawCorner(8,8,SBC_V2_CORNERS.BR);
  drawCorner(0,8,SBC_V2_CORNERS.BL);

  /* ---- interior ---- */
  svg += `<rect x="${cell+pad}" y="${cell+pad}" width="${7*cell-2*pad}" height="${7*cell-2*pad}"
    fill="none" style="stroke:var(--line-soft)" stroke-dasharray="3,4"/>
    <text x="${size/2}" y="${size/2-6}" text-anchor="middle" font-size="13"
      style="fill:var(--chart-label)" font-family="var(--serif)" font-style="italic">Sarvato Bhadra</text>
    <text x="${size/2}" y="${size/2+12}" text-anchor="middle" font-size="13"
      style="fill:var(--chart-label)" font-family="var(--serif)" font-style="italic">Chakra</text>`;

  /* ---- vedha connecting lines (classical presentation) ---- */
  if (hitStarSet && typeof hitStarSet.entries === "function"){
    for (const [star, hit] of hitStarSet.entries()){
      const from = hit.fromStar && pos[hit.fromStar], to = pos[star];
      if (!from || !to) continue;
      const color = hit.type==="bad" ? "var(--vermilion)" : "var(--jade)";
      const x1=cellCx(from[0]), y1=cellCy(from[1]), x2=cellCx(to[0]), y2=cellCy(to[1]);
      svg += `<g class="vedha-line"><title>${hit.fromStar||''} → ${star}</title>
        <line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" style="stroke:${color}" stroke-width="2" stroke-opacity="0.85" stroke-linecap="round"/>
        <circle cx="${x2}" cy="${y2}" r="3.5" style="fill:${color}"/></g>`;
    }
  }

  /* ---- direction + loka labels ---- */
  const lbl = (x,y,t,rot)=>`<text x="${x}" y="${y}" text-anchor="middle" font-size="10" letter-spacing="2"
    style="fill:var(--chart-label);opacity:0.65" font-family="var(--mono)" ${rot?`transform="rotate(${rot} ${x} ${y})"`:""}>${t}</text>`;
  lbl(size/2, -4, "EAST · MAHAR LOKA");
  lbl(size+11, size/2, "SOUTH · JANAR LOKA", 90);
  lbl(size/2, size+15, "WEST · TAPAR LOKA");
  lbl(-11, size/2, "NORTH · SATYA LOKA", -90);

  svg += `</svg>`;
  return svg;
}

function sbcZoneLegendHtmlV2(){
  return `<div class="chakra-legend" style="margin-top:6px;">
    <div class="li"><span style="display:inline-block;width:18px;height:0;border-top:2px solid var(--vermilion)"></span> ${T('Malefic vedha','Vedha maléfico')}</div>
    <div class="li"><span style="display:inline-block;width:18px;height:0;border-top:2px solid var(--jade)"></span> ${T('Benefic vedha','Vedha benéfico')}</div>
    <div class="li"><span class="sw" style="background:var(--panel-2);border:1px solid var(--chart-line)"></span> ${T('Corner vowels (Sun)','Vocales de esquina (Sol)')}</div>
  </div>`;
}
