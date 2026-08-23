/* =========================================================================
   PANCHA PAKSHI BODY-MAP — tithi→bird→body part overlay
   Source: Pulippani & Rao, "Biorhythms of Natal Moon" (1993),
   the Nectar Points table + per-bird body-part columns.
   Cross-checked against user-provided reference tables.
   ========================================================================= */

// Main nectar/poison points per tithi (1-15, same for both pakshas)
const NECTAR_POINTS = {
  1:"Feet", 2:"Back foot / Sole", 3:"Ankle", 4:"Knee cap, Hip",
  5:"Thigh, Navel", 6:"Back, hip, Lower Abdomen", 7:"Hip, Lower back",
  8:"Navel, Stomach", 9:"Stomach, Chest", 10:"Hands",
  11:"Palm, Back palm", 12:"Hand fingers", 13:"Neck",
  14:"Head", 15:"Neck"
};

// Per-bird body parts by tithi (bright half; dark half reverses order)
const PP_BIRD_BODY = {
  bright: {
    Vulture: {1:"Sole", 2:"Upper back foot", 3:"Ankle", 4:"Hip", 5:"Navel",
      6:"Lower abdomen, Private part", 7:"Hip, Lower back", 8:"Navel, Stomach",
      9:"Stomach, Chest", 10:"Hands", 11:"Palm, Back palm", 12:"Hand fingers",
      13:"Neck", 14:"Head", 15:"Neck"},
    Owl: {1:"Ankle", 2:"Leg, Hind muscle", 3:"Leg, Hind muscle", 4:"Back",
      5:"Stomach", 6:"Upper stomach", 7:"Upper back", 8:"Chest",
      9:"Shoulder", 10:"Neck", 11:"Forearm", 12:"Thumb",
      13:"Mouth", 14:"Back", 15:"Mouth"},
    Crow: {1:"Feet", 2:"Back foot", 3:"Knee cap", 4:"Hip",
      5:"Thigh", 6:"Private part", 7:"Lower back", 8:"Stomach",
      9:"Body front", 10:"Body front", 11:"Elbow", 12:"Middle finger",
      13:"Eyes", 14:"Hands", 15:"Ears, Eyes, Nose"},
    Cock: {1:"Sole", 2:"Leg", 3:"Ankle", 4:"Knee cap, Hip",
      5:"Navel", 6:"Lower abdomen", 7:"Hip", 8:"Navel",
      9:"Body back", 10:"Body back", 11:"Upper arm", 12:"Ring finger",
      13:"Forehead", 14:"Navel", 15:"Forehead"},
    Peacock: {1:"Ankle", 2:"Hind muscle", 3:"Leg", 4:"Back",
      5:"Stomach", 6:"Upper stomach", 7:"Chest", 8:"Chest",
      9:"Feet", 10:"Thighs", 11:"Shoulders", 12:"Little finger",
      13:"Hair", 14:"Legs", 15:"Hair"}
  },
  dark: {
    Vulture: {1:"Neck", 2:"Head", 3:"Neck", 4:"Head",
      5:"Neck", 6:"Ears, Eyes, Nose", 7:"Hands", 8:"Middle finger",
      9:"Body front", 10:"Chest", 11:"Palm", 12:"Hand fingers",
      13:"Neck", 14:"Head", 15:"Neck"},
    Owl: {1:"Forehead", 2:"Mouth", 3:"Back", 4:"Thumb",
      5:"Forearm", 6:"Neck", 7:"Shoulder", 8:"Chest",
      9:"Shoulder", 10:"Neck", 11:"Forearm", 12:"Thumb",
      13:"Mouth", 14:"Back", 15:"Mouth"},
    Crow: {1:"Eyes", 2:"Hands", 3:"Elbow", 4:"Middle finger",
      5:"Body front", 6:"Body front", 7:"Elbow", 8:"Middle finger",
      9:"Body front", 10:"Chest", 11:"Palm", 12:"Fingers",
      13:"Neck", 14:"Head", 15:"Neck"},
    Cock: {1:"Forehead", 2:"Navel", 3:"Forehead", 4:"Ring finger",
      5:"Upper arm", 6:"Body back", 7:"Upper arm", 8:"Ring finger",
      9:"Body back", 10:"Chest", 11:"Upper arm", 12:"Ring finger",
      13:"Forehead", 14:"Navel", 15:"Forehead"},
    Peacock: {1:"Hair", 2:"Legs", 3:"Hair", 4:"Little finger",
      5:"Shoulders", 6:"Feet", 7:"Thighs", 8:"Little finger",
      9:"Feet", 10:"Thighs", 11:"Shoulders", 12:"Little finger",
      13:"Hair", 14:"Legs", 15:"Hair"}
  }
};

/**
 * Get the current bird's affected body part for a given tithi.
 * @param {string} lifeBird - Vulture/Owl/Crow/Cock/Peacock
 * @param {number} tithiNum - 1-30 absolute (or 1-15 within paksha)
 * @param {string} paksha - "Shukla" or "Krishna"
 * @returns {object} {nectarPoint, birdPoint, half}
 */
function getPPBodyPart(lifeBird, tithiNum, paksha) {
  const inPaksha = ((tithiNum - 1) % 15) + 1;
  const half = paksha === "Shukla" ? "bright" : "dark";
  const nectar = NECTAR_POINTS[inPaksha] || "unknown";
  const table = PP_BIRD_BODY[half] || PP_BIRD_BODY.bright;
  const birdTable = table[lifeBird] || {};
  const birdPart = birdTable[inPaksha] || "unknown";
  return { nectarPoint: nectar, birdPoint: birdPart, half, tithiInPaksha: inPaksha };
}

/**
 * Render an improved body silhouette SVG with PP bird-body highlight.
 * The silhouette is a stylised standing figure divided into zones.
 * @param {object} cfg - {highlightZone, nectarZone, birdName, birdPart}
 */
function renderPPBodySVG(cfg) {
  // Zones mapped to y-coordinates on the 220×480 canvas
  // head=0-60 | neck/throat=60-90 | shoulders/chest=90-150 | arms=90-230
  // stomach/navel=150-200 | hips/pelvis=200-250 | thighs=250-320 |
  // knees=320-360 | legs/calves=360-420 | feet=420-480

  const hl = cfg.highlightZone || "";
  const nc = cfg.nectarZone || "";

  function zoneStyle(zone) {
    if (zone === hl) return 'fill="rgba(255,100,50,0.35)" stroke="#e05a2b" stroke-width="3"';
    if (zone === nc) return 'fill="rgba(80,220,120,0.25)" stroke="#28a745" stroke-width="2"';
    return 'fill="var(--panel-2)" stroke="var(--chart-line)" stroke-width="1.5"';
  }

  let svg = `<svg viewBox="0 0 220 500" width="100%" style="max-width:280px;display:block;margin:0 auto;">`;
  svg += `<defs><filter id="glow"><feGaussianBlur stdDeviation="3" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>`;

  // Head
  svg += `<circle cx="110" cy="35" r="26" ${zoneStyle(cfg.highlightZone==="head"||cfg.nectarZone==="head")} />`;
  svg += `<text x="110" y="40" text-anchor="middle" font-size="9" fill="var(--muted)">HEAD</text>`;

  // Neck/Throat
  svg += `<rect x="98" y="58" width="24" height="18" rx="3" ${zoneStyle(cfg.highlightZone==="neck")}/>`;

  // Torso outline
  svg += `<path d="M70,80 L150,80 L155,160 L145,240 L75,240 L65,160 Z" ${zoneStyle("")} fill-opacity="0.3"/>`;

  // Shoulders
  svg += `<rect x="62" y="78" width="96" height="20" rx="5" ${zoneStyle(cfg.highlightZone==="shoulders")}/>`;

  // Chest
  svg += `<rect x="72" y="100" width="76" height="45" rx="4" ${zoneStyle(cfg.highlightZone==="chest")}/>`;
  svg += `<text x="110" y="126" text-anchor="middle" font-size="8.5" fill="var(--muted)">CHEST</text>`;

  // Arms (left & right)
  svg += `<rect x="38" y="95" width="22" height="90" rx="8" ${zoneStyle(cfg.highlightZone==="arms")}/>
          <rect x="160" y="95" width="22" height="90" rx="8" ${zoneStyle(cfg.highlightZone==="arms")}/>`;
  // Hands
  svg += `<circle cx="49" cy="195" r="12" ${zoneStyle(cfg.highlightZone==="hands")}/>
          <circle cx="171" cy="195" r="12" ${zoneStyle(cfg.highlightZone==="hands")}/>`;

  // Stomach/Navel
  svg += `<rect x="75" y="148" width="70" height="42" rx="4" ${zoneStyle(cfg.highlightZone==="stomach")}/>
          <circle cx="110" cy="180" r="5" ${zoneStyle(cfg.highlightZone==="navel")}/>`;

  // Hips/Pelvis
  svg += `<path d="M75,190 L145,190 L150,245 L70,245 Z" ${zoneStyle(cfg.highlightZone==="hips")}/>`;

  // Thighs
  svg += `<rect x="74" y="248" width="32" height="80" rx="8" ${zoneStyle(cfg.highlightZone==="thighs")}/>
          <rect x="114" y="248" width="32" height="80" rx="8" ${zoneStyle(cfg.highlightZone==="thighs")}/>`;
  svg += `<text x="90" y="290" text-anchor="middle" font-size="7.5" fill="var(--muted)">THIGH</text>
          <text x="130" y="290" text-anchor="middle" font-size="7.5" fill="var(--muted)">THIGH</text>`;

  // Knees
  svg += `<circle cx="90" cy="338" r="10" ${zoneStyle(cfg.highlightZone==="knees")}/>
          <circle cx="130" cy="338" r="10" ${zoneStyle(cfg.highlightZone==="knees")}/>`;

  // Legs/Calves
  svg += `<rect x="78" y="350" width="24" height="85" rx="6" ${zoneStyle(cfg.highlightZone==="legs")}/>
          <rect x="118" y="350" width="24" height="85" rx="6" ${zoneStyle(cfg.highlightZone==="legs")}/>`;

  // Feet
  svg += `<ellipse cx="88" cy="450" rx="16" ry="8" ${zoneStyle(cfg.highlightZone==="feet")}/>
          <ellipse cx="132" cy="450" rx="16" ry="8" ${zoneStyle(cfg.highlightZone==="feet")}/>`;
  svg += `<text x="88" y="472" text-anchor="middle" font-size="7" fill="var(--muted)">FEET</text>
          <text x="132" y="472" text-anchor="middle" font-size="7" fill="var(--muted)">FEET</text>`;

  // Highlight ring if bird part is active
  if (hl) {
    svg += `<circle cx="110" cy="250" r="140" fill="none" stroke="var(--gold)" stroke-width="1" stroke-dasharray="4,6" opacity="0.3"/>
            <text x="110" y="495" text-anchor="middle" font-size="9" fill="var(--vermilion)" font-weight="bold">◉ ${hl.toUpperCase()} — ACTIVE</text>`;
  }

  svg += `</svg>`;
  return svg;
}

/**
 * Map a textual body-part description to a zone key for highlighting.
 */
function bodyPartToZone(partText) {
  if (!partText) return "";
  const p = partText.toLowerCase();
  if (/head|forehead|hair|face|eye|nose|ear/.test(p)) return "head";
  if (/neck|throat|mouth/.test(p)) return "neck";
  if (/shoulder/.test(p)) return "shoulders";
  if (/chest|breast|rib/.test(p)) return "chest";
  if (/arm|forearm|elbow|upper arm/.test(p)) return "arms";
  if (/hand|palm|finger|thumb/.test(p)) return "hands";
  if (/stomach|navel|abdomen/.test(p)) return "stomach";
  if (/hip|pelvis|private|seat/.test(p)) return "hips";
  if (/thigh|hind muscle/.test(p)) return "thighs";
  if (/knee/.test(p)) return "knees";
  if (/leg|calf|shin|hind/.test(p)) return "legs";
  if (/foot|feet|sole|ankle/.test(p)) return "feet";
  if (/back/.test(p)) return "chest"; // upper back maps to chest area visually
  return "";
}
