You are working on www/index.html — a single-file Jyotish app (~860KB). Study existing patterns first: pages are <div id="pageX" class="page"> with hamburger buttons data-page="pageX"; renderXxxPage() functions populate them; computePanchanga(pos) returns {tithiNum, paksha, tithiName, nak, nak28, yogaName, karana, ascSign}; tithiRaw = norm360(moonSid-sunSid)/12 is computed inside it; computePositions returns per-graha {tropical, sidereal?, speed} (speed in deg/day).

Implement these 4 features:

=== FEATURE A: Tithi/Nakshatra/Yoga end-times (day-to-day timings) ===
Modify computePanchanga to also return: tithiRawFrac (the raw 0..30 value), nakRawFrac (moonSid/(360/27) raw 0..27), yogaRawFrac.
Add a new function panchangaEndTimes(jd, pos):
- relativeSpeed = pos.Moon.speed - pos.Sun.speed (deg/day, typically ~12-15)
- tithiEndOffsetDays = ((Math.ceil(tithiRawFrac) - tithiRawFrac) * 12) / relativeSpeed
- nakEndOffsetDays = ((Math.ceil(nakRawFrac) - nakRawFrac) * (360/27)) / pos.Moon.speed
- yogaEndOffsetDays = ((Math.ceil(yogaRawFrac) - yogaRawFrac) * (40/3)) / relativeSpeed
Return ISO local datetime strings for each end by adding offset*24*3600*1000 ms to the moment's Date, formatted "HH:MM" plus "(in Xh Ym)" remaining string.
On the main Muhurta page (pageMuhurta) result panel — find where the panchanga row is displayed (tithi/paksha/nakshatra/yoga/karana summary) and append a small timings table below it: rows for Tithi ends / Nakshatra ends / Yoga ends / Karana ends (karana ends at half-tithi boundary: ((Math.ceil(tithiRawFrac*2)-tithiRawFrac*2)*6)/relativeSpeed), columns: element | ends at | remaining. Style consistent with existing .kv tables.

=== FEATURE B: Anatomy front/back body views ===
Replace the single renderPPBodySVG function with a new renderAnatomyFigure(cfg) that draws BOTH a front view (left) and back view (right) side by side in one SVG viewBox="0 0 480 500". Front view x-center=120, back view x-center=360. Each figure mirrors the current silhouette geometry but the BACK view adds: Upper Back, Spine (vertical line), Shoulder Blades (two small rects), Lower Back/Lumbar, Glutes, Calves; front keeps Chest/Torso/Thigh/Shin/Finger segments labeled Thumb/Index/Middle/Ring/Little on both left and right hands (front hands) AND back-hands labeled Back-Thumb etc.
Zone mapping (zone key -> both views): head(front+back circles), neck, chest, torso, upperarms, lowerarms, fingers (5 segments each hand), thighs, shins, feet(top front + sole back), upperback, spine, shoulderblades, lumbar, glutes, calves.
cfg = {nectarZones:[], poisonZones:[], activeBird, birdColor}: nectar zones get fill rgba(72,201,140,0.4) + teal dot marker; poison zones get rgba(146,43,33,0.35) + dark-brown dot; the active bird's body part zone gets golden fill + red circle label below: "<ZONE> — ACTIVE".
Update all callers of renderPPBodySVG to call renderAnatomyFigure instead, passing nectarZones=[bodyPartToZone(ppData.nectarPoint)], poisonZones=[bodyPartToZone(ppData.poisonPoint||'Lower Back')], activeBird.

=== FEATURE C: Varga dropdown readings (Parashara's Light style) ===
In renderVargaPage(), after the varga table, add an interpretation panel: for the SELECTED varga and EACH planet in it, show a reading block:
- planet name + its divisional sign (+Sanskrit name via SIGN_SANSKRIT)
- dignity in that division (use the same own/exalt/debil logic as elsewhere; if a helper exists reuse it, else inline the standard dignities)
- a one-paragraph classical-flavored interpretation template per house placement of that planet IN THE DIVISION, e.g. for D9: "X in the 7th of Navamsha suggests ... spouse-related strength", for D10: "... career implications", varying the theme sentence by varga purpose (D2 wealth, D3 siblings, D4 property, D7 progeny, D9 spouse/dharma, D10 career, D12 parents, D16 vehicles, D20 spirituality, D24 education, D27 strengths, D30 misfortunes, D40 maternal, D45 paternal, D60 karma).
- For D1 additionally show lordship-based readings: for each house H, "Lord of H (<lord>) sits in house Y" + one sentence combining H's significations with Y's significations.
Keep interpretations concise (1-2 sentences each) and clearly template-generated (this is a synthesis app, not scripture): prefix each with a small note like "template reading".

=== FEATURE D: Navamsha calculation verification hook ===
In renderVargaPage's D9 section, add a self-check line comparing computed D9 sign for Moon against the expected formula: d9signIdx = floor(fire/earth/air/water start + floor(degInSign/(30/9))) % 12 — if mismatch show a warning. This is just a sanity display, not a fix.

Do NOT change scoring, SBC, PP bird logic, or other pages. After implementing run your vm regression: all script blocks parse, renderVargaPage/renderAnatomyFigure/panchangaEndTimes load as functions, scoreForInstant still works.