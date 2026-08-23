/* =========================================================================
   CLASSICAL COLOR SYSTEM — Jyotishavidya color attributions
   Sources:
   - Graha colors: BPHS ch.2 (dhyana verses 6-13, Girish Chand ed.):
     Surya red-lotus; Chandra white; Mangal red; Budha yellow;
     Guru yellow; Shukra fair/white; Shani Indraneela (sapphire);
     Rahu blue; Ketu smoky.
   - Cross-check: BPHS ch.3 v.16-17 complexions (Surya blood-red,
     Budha green-grass hue — iconographic vs body hue, both retained).
   - PP bird colors: Pulippani & Rao 1993 p.53: Vulture white,
     Owl golden-hue, Crow red, Cock green; Peacock blue (traditional).
   - Rashi colors: derived from tattva + lord's color per classical
     convention (fire signs warm-red family, earth browns/greens,
     air cyans/pales, water blues/deep tones) with lord-color accents.
   ========================================================================= */

const GRAHA_COLORS = {
  Surya:   { hex:"#C0392B", name:"blood-red / lotus-red", sanskrit:"रक्त rakta",
             source:"BPHS ch.2 v.6 (red like lotus); ch.3 v.16 blood-red" },
  Chandra: { hex:"#ECF0F1", name:"white", sanskrit:"शुक्ल वर्ण śukla-varṇa",
             source:"BPHS ch.2 v.7 white robes & ornaments" },
  Mangal:  { hex:"#E74C3C", name:"red", sanskrit:"रक्त rakta",
             source:"BPHS ch.2 v.8 red necklace & robes" },
  Budha:   { hex:"#F1C40F", name:"yellow / green-grass hue", sanskrit:"पीत peeta",
             source:"BPHS ch.2 v.9 yellow garland; ch.3 v.17 green-grass hue" },
  Guru:    { hex:"#D4AC0D", name:"tawny / yellow", sanskrit:"गौर gaura",
             source:"BPHS ch.2 v.10 yellow complexion" },
  Shukra:  { hex:"#F9E79F", name:"fair / variegated-white", sanskrit:"विचित्र vichitra",
             source:"BPHS ch.2 v.10 fair complexion; ch.3 v.17 variegated" },
  Shani:   { hex:"#154360", name:"Indraneela (sapphire-dark-blue)", sanskrit:"नील neela",
             source:"BPHS ch.2 v.11 lustre like Indraneela sapphire" },
  Rahu:    { hex:"#21618C", name:"blue", sanskrit:"नील neela",
             source:"BPHS ch.2 v.12 blue-coloured" },
  Ketu:    { hex:"#7B7D7D", name:"smoky", sanskrit:"धूम्र dhūmra",
             source:"BPHS ch.2 v.13 smoky colour" }
};

const PP_BIRD_COLORS = {
  Vulture: { hex:"#E8E6E3", name:"white", sanskrit:"श्वेत śveta",
             source:"Pulippani & Rao 1993 p.53" },
  Owl:     { hex:"#D4AC0D", name:"golden hue", sanskrit:"स्वर्ण varṇa",
             source:"Pulippani & Rao 1993 p.53" },
  Crow:    { hex:"#C0392B", name:"red", sanskrit:"रक्त rakta",
             source:"Pulippani & Rao 1993 p.53" },
  Cock:    { hex:"#1E8449", name:"green", sanskrit:"हरित harita",
             source:"Pulippani & Rao 1993 p.53" },
  Peacock: { hex:"#115E8A", name:"peacock-blue", sanskrit:"नील neela",
             source:"traditional (bird's plumage)" }
};

// Rashi palette: tattva-family base + lord accent. Classical convention keeps
// fire-signs in warm red/orange range, earth in greens/browns, air in cyan/pale,
// water in deep blues. Lord's graha color is the accent border.
const RASHI_COLORS = {
  Aries:       { fill:"#C0392B", accent:"#E74C3C", tattva:"Agni (fire)",  lord:"Mangal" },
  Taurus:      { fill:"#1E8449", accent:"#F9E79F", tattva:"Prithvi (earth)",lord:"Shukra" },
  Gemini:      { fill:"#5DADE2", accent:"#F1C40F", tattva:"Vayu (air)",   lord:"Budha" },
  Cancer:      { fill:"#21618C", accent:"#ECF0F1", tattva:"Jala (water)",lord:"Chandra" },
  Leo:         { fill:"#D35400", accent:"#C0392B", tattva:"Agni (fire)",  lord:"Surya" },
  Virgo:       { fill:"#27AE60", accent:"#F1C40F", tattva:"Prithvi (earth)",lord:"Budha" },
  Libra:       { fill:"#85C1E9", accent:"#F9E79F", tattva:"Vayu (air)",   lord:"Shukra" },
  Scorpio:     { fill:"#922B21", accent:"#21618C", tattva:"Jala (water)", lord:"Mangal" },
  Sagittarius: { fill:"#CA6F1E", accent:"#D4AC0D", tattva:"Agni (fire)",  lord:"Guru" },
  Capricorn:   { fill:"#6E2C00", accent:"#154360", tattva:"Prithvi (earth)",lord:"Shani" },
  Aquarius:    { fill:"#34495E", accent:"#154360", tattva:"Vayu (air)",   lord:"Shani" },
  Pisces:      { fill:"#1A5276", accent:"#D4AC0D", tattva:"Jala (water)", lord:"Guru" }
};

/**
 * Get the CSS style for a planet cell based on its graha color.
 */
function grahaCellStyle(grahaName, active) {
  const c = GRAHA_COLORS[grahaName];
  if (!c) return "";
  return active
    ? `background:${c.hex};color:#111;font-weight:bold;border:2px solid ${c.hex};`
    : `border-left:3px solid ${c.hex};`;
}

/**
 * Color a rashi label chip.
 */
function rashiChipStyle(signName) {
  const c = RASHI_COLORS[signName];
  if (!c) return "";
  return `background:${c.fill};color:#fff;padding:1px 6px;border-radius:3px;border-left:3px solid ${c.accent};display:inline-block;font-size:11px;`;
}

/**
 * PP bird badge with its classical color.
 */
function ppBirdBadge(birdName) {
  const c = PP_BIRD_COLORS[birdName];
  if (!c) return birdName;
  return `<span style="background:${c.hex};color:${
    ["Vulture","Owl","Peacock"].includes(birdName) ? "#111" : "#fff"
  };padding:2px 8px;border-radius:10px;font-size:12px;display:inline-block;">${birdName}</span>`;
}
