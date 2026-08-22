
/* =========================================================================
   ACTIVITY SCORING + PARASARA-HORA MUHURTA LAYERS (muhurta-gauge add-on)
   Sources:
   • Nakshatra classes (dhruva/mridu/laghu/ugra/chala/ghora/mishra):
     B.V. Raman, "Muhurtha", ch. IV citing BRHAT SAMHITA of Varahamihira;
     matches the classical BS adhyaya on nakshatra characteristics.
   • Pushya exception (universal benefic except marriage): same chapter.
   • Nakshatra Panchaka (last pada of Dhanishta .. Revati) avoidances:
     same chapter.
   • Chandrashtama (Moon transiting 8th from reference Moon-sign):
     Parasara-hora principle; neutralization rules per Raman, "Muhurtha"
     ch. V (waxing Moon in benefic sign/navamsa, or Tarabala present).
   • Ashtakoota / Kuja dosha / Chintamani checks: ported from pl0-app-1.30
     (see VERIFICATION.md for their source cross-checks).
   ========================================================================= */

// ---- Nakshatra activity classes (Raman, Muhurtha ch. IV / Brhat Samhita) ----
const NAK_CLASS = {
  // Dhruva (fixed) — coronations, foundations, sowing, permanent works
  Rohini:"fixed","U.Phalguni":"fixed","U.Shada":"fixed","U.Bhadrapada":"fixed",
  // Mrdu (soft) — apparel, arts, music, union, ceremonies
  Chitra:"soft",Anuradha:"soft",Mrigasira:"soft",Revati:"soft",
  // Laghu/Kshipra (light) — ornamentation, sports, medicine, industry, travel
  Aswini:"light",Pushya:"light",Hasta:"light",Abhijit:"light",
  // Ugra (sharp/dreadful) — incantations, separation; hostile acts
  Moola:"sharp",Jyeshta:"sharp",Ardra:"sharp",Ashlesha:"sharp",
  // Chara (movable) — vehicles, gardening, processions
  Sravana:"movable",Dhanishta:"movable",Satabisha:"movable",Punarvasu:"movable",Swati:"movable",
  // Adhomukha/Ugra (dreadful) — only nefarious works
  "P.Bhadrapada":"dreadful","P.Shada":"dreadful",Bharani:"dreadful",Magha:"dreadful",
  // Mishra (mixed) — ordinary day-to-day works
  Krittika:"mixed",Visakha:"mixed"
};

const ACTIVITY_CLASSES = {
  marriage:        {good:["soft"],            bad:["sharp","dreadful"], note:"soft stars best; Pushya barred"},
  travel:          {good:["light","movable"], bad:["dreadful"],         note:"light & movable stars"},
  business_start:  {good:["light","mixed"],   bad:["sharp","dreadful"], note:"light/mixed stars"},
  construction:    {good:["fixed"],           bad:["dreadful"],         note:"fixed stars ground the work"},
  agriculture:     {good:["fixed","movable"], bad:[],                   note:"sowing: fixed; planting-out: movable"},
  medicine:        {good:["light"],           bad:[],                   note:"administering medicine: light stars"},
  ceremony:        {good:["soft","fixed"],    bad:["sharp","dreadful"], note:"auspicious ceremonies: soft stars"},
  vehicle:         {good:["movable"],         bad:[],                   note:"acquiring vehicles: movable stars"},
  art_music:       {good:["soft"],            bad:[],                   note:"dance/music/fine arts: soft stars"},
  daily_routine:   {good:["mixed","light"],   bad:[],                   note:"ordinary works: mixed stars"}
};

/**
 * Grade an instant for a chosen ACTIVITY key using today's Moon-star class.
 * Returns {verdict:'good'|'ok'|'bad', className, reason}.
 */
function gradeActivity(activityKey, nakName){
  const cls = NAK_CLASS[nakName];
  const act = ACTIVITY_CLASSES[activityKey];
  if (!act || !cls) return null;
  // Pushya: universal benefic EXCEPT marriage (Raman, Muhurtha ch. IV)
  if (nakName === "Pushya" && activityKey !== "marriage")
    return {verdict:"good", className:cls,
      reason:"Pushya neutralizes almost all doshas (except for marriage)"};
  if (nakName === "Pushya" && activityKey === "marriage")
    return {verdict:"bad", className:cls, reason:"Pushya, though universally benefic, is held inauspicious for marriage"};
  if (act.good.includes(cls))
    return {verdict:"good", className:cls, reason:`${cls} star suits this activity (${act.note})`};
  if (act.bad.includes(cls))
    return {verdict:"bad", className:cls, reason:`${cls} star contraindicates this activity (${act.note})`};
  return {verdict:"ok", className:cls, reason:`${cls} star — neither indicated nor barred (${act.note})`};
}

// ---- Chandrashtama with Parasara/Raman neutralization ----
function chandrashtamaCheck(pos, refMoonSign, panch){
  if (!refMoonSign) return null;
  const refIdx = SIGNS.indexOf(refMoonSign);
  const moonSign = SIGNS[Math.floor(norm360(pos.Moon.sidereal)/30)];
  const eighthFromRef = SIGNS[(refIdx+8)%12];
  if (moonSign !== eighthFromRef) return {active:false};
  // Neutralizations (Raman, Muhurtha ch.V): waxing Moon + benefic sign, or Tarabala
  const waxing = panch.paksha === "Shukla";
  return {active:true, waxing, note: waxing
    ? "Chandrashtama — but the Moon is waxing, which blunts the sting (Raman ch.V)"
    : "Chandrashtama — Moon in the 8th from the reference Moon's sign; avoid major undertakings"};
}

// ---- Nakshatra Panchaka avoidance (Raman ch.IV; last quarter Dhanishta..Revati) ----
const PANCHAKA_STARS = ["Dhanishta","Satabisha","P.Bhadrapada","U.Bhadrapada","Revati"];
const PANCHAKA_AVOID = {
  travel:"journey towards the south", construction:"house repairing or renovation",
  fuel:"collecting fuel or cattle fodder", furniture:"acquiring cots and beds"
};
function panchakaCheck(nak28Name){
  return PANCHAKA_STARS.includes(nak28Name);
}
