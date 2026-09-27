/* Venus/malefic commodity-clause fix (source: PR #4, closed — landed here instead).
   NOT applied to www/index.html -- its commodityBacktestScore/venusOnlyBacktestScore/
   maleficOnlyBacktestScore are untouched and still have the bug described below.

   Bug: those three scoreFns summed the Venus/malefic clause across EVERY sign in a
   commodity's classical assignment list unconditionally (e.g. Gold = Aries +
   Capricorn, summed every single day regardless of where any graha actually is).
   For Gold specifically this was a structural defect: Aries and Capricorn are 9
   signs apart, and VENUS_PERISH_HOUSES is a 2-wide window ([6,7]) -- 9 mod 12 can
   never land two positions back inside a 2-wide window of itself, so both signs'
   Venus clauses could never both read "perish" the same day. The summed score
   could only ever be 0 or +2, NEVER negative (confirmed: 0 exceptions across 4,999
   real days backtested). Gold's live Venus signal could never call a bearish day.

   Fix: only evaluate the ONE target sign the Sun is currently transiting (the
   app's own existing activation convention elsewhere -- the storage rule only
   fires when the Sun transits Leo) instead of blending every assigned sign every
   day. If the Sun isn't in any of the commodity's target signs, there's no live
   signal for that day (0, neutral) -- mirrors the storage rule's own 1-month-in-12
   cadence rather than being a bug.

   Requires the same globals as www/index.html's originals: computePositions,
   norm360, SIGNS, houseOffsetFromSign, VENUS_PERISH_HOUSES, MALEFIC_GRAHAS,
   MALEFIC_FLOURISH_HOUSES. Drop-in replacements for the three functions of the
   same name there, if this ever gets activated for real. */

function activeTargetSignIdx(pos, signs){
  const sunSignIdx = Math.floor(norm360(pos.Sun.sidereal)/30);
  const sunSignName = SIGNS[sunSignIdx];
  return signs.includes(sunSignName) ? SIGNS.indexOf(sunSignName) : -1;
}

function commodityBacktestScore_FIXED(jd, signs){
  const pos = computePositions(jd, 0, 0, 'lahiri');
  const idx = activeTargetSignIdx(pos, signs);
  if (idx === -1) return 0;
  const signIdxOf = g => Math.floor(norm360(pos[g].sidereal)/30);
  const venusSignIdx = signIdxOf('Venus');
  const maleficPos = MALEFIC_GRAHAS.map(g=>({g, signIdx:signIdxOf(g)}));
  let total = VENUS_PERISH_HOUSES.includes(houseOffsetFromSign(idx, venusSignIdx)) ? -1 : 1;
  maleficPos.forEach(m=>{ total += MALEFIC_FLOURISH_HOUSES.includes(houseOffsetFromSign(idx, m.signIdx)) ? 1 : -1; });
  return total;
}

function venusOnlyBacktestScore_FIXED(jd, signs){
  const pos = computePositions(jd, 0, 0, 'lahiri');
  const idx = activeTargetSignIdx(pos, signs);
  if (idx === -1) return 0;
  const venusSignIdx = Math.floor(norm360(pos.Venus.sidereal)/30);
  return VENUS_PERISH_HOUSES.includes(houseOffsetFromSign(idx, venusSignIdx)) ? -1 : 1;
}

function maleficOnlyBacktestScore_FIXED(jd, signs){
  const pos = computePositions(jd, 0, 0, 'lahiri');
  const idx = activeTargetSignIdx(pos, signs);
  if (idx === -1) return 0;
  const signIdxOf = g => Math.floor(norm360(pos[g].sidereal)/30);
  const maleficPos = MALEFIC_GRAHAS.map(g=>({g, signIdx:signIdxOf(g)}));
  let total = 0;
  maleficPos.forEach(m=>{ total += MALEFIC_FLOURISH_HOUSES.includes(houseOffsetFromSign(idx, m.signIdx)) ? 1 : -1; });
  return total;
}

module.exports = { activeTargetSignIdx, commodityBacktestScore_FIXED, venusOnlyBacktestScore_FIXED, maleficOnlyBacktestScore_FIXED };
