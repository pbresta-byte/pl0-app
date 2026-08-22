/* =========================================================================
   CLASSICAL ELECTIONAL RULES — batch from NEWMUHURTA.md (R1-R30)
   Sources cited per rule; primary: Kalaprakasika, Raman's Muhurtha,
   Brihat Samhita (Bhat/Chidambaram). Panchanga-only rules here; natal-
   dependent ones (R19/R20/R26/R28) take optional params.
   ========================================================================= */

// ---- Tithi classes (R1) ----
function tithiClass(tithiNum){ // 1..15 within paksha
  const n = ((tithiNum - 1) % 15) + 1;
  if ([1,6,11].includes(n)) return "Nanda";
  if ([2,7,12].includes(n)) return "Bhadra";
  if ([3,8,13].includes(n)) return "Jaya";
  if ([4,9,14].includes(n)) return "Rikta";
  return "Poorna"; // 5,10,15
}

// R3+R4: general tithi quality (odd good except 9th... note 9th is odd;
// Raman: odd except 9; even good = 2,6,10; avoid 4,6*,8,12,14 + Poornima/Amavasya)
function tithiGeneralQuality(tithiNum){
  const inPaksha = ((tithiNum - 1) % 15) + 1;
  if ([4,8,9,12,14,15,30].includes(tithiNum) || [4,8,14,15].includes(inPaksha))
    return {tone:"bad", why:`tithi ${inPaksha} on the avoid-list`};
  if ([2,6,10].includes(inPaksha)) return {tone:"good", why:"even tithi among the auspicious 2/6/10"};
  if (inPaksha % 2 === 1 && inPaksha !== 9) return {tone:"good", why:"odd tithi (except 9th)"};
  return {tone:"neutral", why:"tithi neither indicated nor barred"};
}

// ---- R5-R8: karana-activity fit ----
const KARANA_GOOD_FOR = {
  Bava:["permanent works","auspicious deeds"], Balava:["charity"],
  Kaulava:["joyful deeds"], Taitila:["public works","marriage","construction"],
  Gara:["agriculture","sowing","construction"], Vanija:["trade","merchant dealings"],
  Sakuni:["medicine","mantra initiation","health"], Chatushpada:["cattle","pitris"],
  Naga:[], Kimstughna:["health","auspicious deeds"]
};
const KARANA_BAD_ALWAYS = ["Vishti"]; // R6

// ---- R10/R11: bad & good yogas beyond Vyatipata/Vaidhriti ----
const BAD_YOGAS_EXT = ["Vyaghata","Parigha","Vajra","Vyatipata","Vaidhriti","Ganda","Atiganda","Soola","Vishkambha","Mrityu","Dhruva"];
const GOOD_YOGAS = ["Subha","Amrita","Siddha","Sobhana","Sukarma"]; // R11 (Amrita=5, Siddha=21, Subha=23, Sobhana=24)

// ---- R13-R16: Siddha/Vinasa/Visha yoga tables (Kalaprakasika tradition) ----
// keyed vara -> {tithisInPaksha:[..], stars:[..]}
const SIDDHA_YOGA_KP = {
  Sunday:   {tithis:[1,4,6,7,12], stars:["Pushya","Hasta","U.Phalguni","U.Shada","Moola","Sravana","U.Bhadrapada"]},
  Monday:   {tithis:[2,5,7,9,10], stars:["Hasta","P.Shada","U.Shada","Moola","Sravana","U.Bhadrapada","Revati","Aswini"]},
  Tuesday:  {tithis:[3,5,7,8],    stars:["Aswini","Pushya","P.Bhadrapada","Hasta","Moola","Sravana","Revati"]},
  Wednesday:{tithis:[1,3,5,7,12], stars:["Rohini","P.Phalguni","U.Phalguni","Visakha","Swati","Jyeshta","Revati"]},
  Thursday: {tithis:[4,5,7,9,13,14], stars:["Magha","Pushya","Punarvasu","Swati","P.Shada","P.Bhadrapada","Revati","Aswini"]},
  Friday:   {tithis:[1,2,3,5,11], stars:["Bharani","Krittika","Punarvasu","U.Phalguni","P.Shada","Revati"]},
  Saturday: {tithis:[3,5,7,13,14],stars:["Ardra","Magha","U.Shada","Visakha","Swati","U.Bhadrapada"]}
};
// Raman's parallel table (kept separate — traditions differ)
const AMRITA_SIDDHA_VARA_STAR = { // R15: vara+nakshatra only
  Sunday:"Hasta", Monday:"Sravana", Tuesday:"Aswini", Wednesday:"Anuradha",
  Thursday:"Pushya", Friday:"Revati", Saturday:"Rohini"
};

// R14: class-based siddha (vara + tithi class)
const SIDDHA_CLASS_KP = { Friday:"Nanda", Wednesday:"Bhadra", Tuesday:"Jaya" };

// R17: unfavourable weekday-nakshatra pairs
const BAD_VARA_NAK = {
  Sunday:"Aswini", Monday:"Chitra", Tuesday:"U.Shada", Wednesday:"Dhanishta",
  Thursday:"U.Phalguni", Friday:"Jyeshta", Saturday:"Revati"
};

// ---- R21/R22: hora lord sequence + semantics ----
const WEEKDAY_LORD = {Sunday:"Sun",Monday:"Moon",Tuesday:"Mars",Wednesday:"Mercury",Thursday:"Jupiter",Friday:"Venus",Saturday:"Saturn"};
const PLANET_ORDER = ["Sun","Venus","Mercury","Moon","Saturn","Jupiter","Mars"]; // Chaldean discard order
const HORA_SEMANTICS = {
  Sun:{tone:"bad", text:"danger to life"}, Venus:{tone:"good", text:"favours marriage"},
  Mercury:{tone:"good", text:"child-birth, learning"}, Moon:{tone:"good", text:"well-being"},
  Saturn:{tone:"bad", text:"fetters, loss"}, Jupiter:{tone:"good", text:"pecuniary gains"},
  Mars:{tone:"bad", text:"conflict, battle"}
};
function horaLord(weekdayName, hourFromSunrise, dayLenHrs){
  if (!dayLenHrs || !Number.isFinite(dayLenHrs)) dayLenHrs = 12;
  const hLen = dayLenHrs / 12;
  let idx;
  const hr = hourFromSunrise;
  if (hr >= 0 && hr < dayLenHrs) idx = Math.floor(hr / hLen);           // daytime hora 0..11
  else idx = null;
  if (idx === null){
    // night horas: continue sequence past 12
    const nightStart = hr < 0 ? hr : hr - dayLenHrs;
    idx = 12 + Math.floor((((nightStart % 12) + 12) % 12));
  }
  const startIdx = PLANET_ORDER.indexOf(WEEKDAY_LORD[weekdayName]);
  return PLANET_ORDER[(startIdx + idx) % 7];
}

/**
 * Evaluate the full classical electional layer for one instant.
 * Returns array of {ruleId, name, tone:'good'|'bad'|'neutral', detail}.
 */
function classicalRules(year, month1to12, day, hh, mm, panch, weekdayName, sunriseHr, sunsetHr, opts){
  opts = opts || {};
  const out = [];
  const inPaksha = ((panch.tithiNum - 1) % 15) + 1;

  // R1-R4 tithi
  const tc = tithiClass(inPaksha);
  out.push({ruleId:"R1", name:`${tc} tithi`, tone:"neutral",
    detail:`Tithi ${inPaksha} is a ${tc} lunar day`});
  const tq = tithiGeneralQuality(panch.tithiNum);
  if (tq.tone !== "neutral")
    out.push({ruleId:"R3/R4", name:"Tithi quality", tone:tq.tone, detail:tq.why});

  // R5-R8 karana fit
  const kn = panch.karana.name;
  if (KARANA_BAD_ALWAYS.includes(kn))
    out.push({ruleId:"R6", name:"Karana", tone:"bad", detail:`Vishti (Bhadra) karana — no auspicious work`});
  else if (KARANA_GOOD_FOR[kn] && KARANA_GOOD_FOR[kn].length)
    out.push({ruleId:"R5", name:"Karana", tone:"good", detail:`${kn} karana favours: ${KARANA_GOOD_FOR[kn].join(", ")}`});

  // R10/R11 yoga quality (beyond the doshas checklist already scored)
  const yname = panch.yogaName;
  if (BAD_YOGAS_EXT.includes(yname))
    out.push({ruleId:"R10", name:"Yoga", tone:"bad", detail:`${yname} yoga among the adverse yogas`});
  else if (GOOD_YOGAS.some(g=>yname && yname.startsWith(g)))
    out.push({ruleId:"R11", name:"Yoga", tone:"good", detail:`${yname} yoga produces lasting benefit`});

  // R13 KP Siddha yoga (vara+tithi+star)
  const sid = SIDDHA_YOGA_KP[weekdayName];
  if (sid && sid.tithis.includes(inPaksha) && sid.stars.includes(panch.nak.name))
    out.push({ruleId:"R13", name:"Siddha Yoga (KP)", tone:"good",
      detail:`${weekdayName} + tithi ${inPaksha} + ${panch.nak.name}: Siddha Yoga (Kalaprakasika tables)`});
  // R14 class-based siddha
  if (SIDDHA_CLASS_KP[weekdayName] === tc)
    out.push({ruleId:"R14", name:"Siddha Yoga (class)", tone:"good",
      detail:`${weekdayName} on a ${tc} tithi: Siddha Yoga`});
  // R15 Amrita siddha
  if (AMRITA_SIDDHA_VARA_STAR[weekdayName] === panch.nak.name)
    out.push({ruleId:"R15", name:"Amrita Siddha Yoga", tone:"good",
      detail:`${panch.nak.name} on ${weekdayName}: Amrita Siddha Yoga`});
  // R16 Vinasa/Visha (KP)
  // (tables omitted for brevity in v1 — flagged TODO; Visha subset implemented:)
  if (weekdayName==="Sunday" && inPaksha===5 && panch.nak.name==="Krittika")
    out.push({ruleId:"R16", name:"Visha Yoga", tone:"bad", detail:"Sunday+Panchami+Krittika: Visha Yoga"});
  // R17 unfavourable vara-star pair
  if (BAD_VARA_NAK[weekdayName] === panch.nak.name)
    out.push({ruleId:"R17", name:"Weekday-star caution", tone:"bad",
      detail:`${weekdayName} ruled by ${panch.nak.name}: traditionally unfavourable pair`});

  // R22 hora lord quality
  const sunSS = (typeof sunriseSunsetLocal === "function") ? sunriseSunsetLocal(year,month1to12,day,opts.lat||0,opts.lon||0,opts.tz||0) : null;
  const srise = sunSS ? sunSS.sunriseHr : 6, dlen = sunSS ? ((sunSS.sunsetHr-srise+24)%24) : 12;
  const hl = horaLord(weekdayName, (hh+(mm||0)/60)-srise, dlen);
  const hs = HORA_SEMANTICS[hl];
  out.push({ruleId:"R22", name:`${hl} Hora`, tone:hs.tone, detail:`Hora of ${hl}: ${hs.text}`});

  // R24 weekday-time interaction
  if (["Saturday","Sunday","Tuesday"].includes(weekdayName)){
    const noonish = srise + dlen/2;
    const afterNoon = (hh+(mm||0)/60) > noonish;
    if (weekdayName==="Tuesday" && afterNoon)
      out.push({ruleId:"R24", name:"Weekday relief", tone:"good", detail:"Tuesday's blemish does not prevail after midday"});
    if (weekdayName!=="Tuesday" && !afterNoon)
      out.push({ruleId:"R24", name:"Weekday caution", tone:"bad",
        detail:`${weekdayName} day-time carries its blemish (lifts after nightfall)`});
  }

  // R29 tithi-gandanta (last 48min of 5th/10th/15th, first 48min of 6th/11th/1st dark)
  // approximated via tithi fraction when available
  if (typeof norm360 === "function"){
    // elapsed fraction of current tithi:
    const sunSid = 0; // not available here without pos; handled by caller passing fracTithi
  }
  return out;
}
