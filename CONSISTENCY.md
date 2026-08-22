# Day-to-day 'graded' logic — consistency check + muhurta extension
Scope: `muhurta-gauge-1.1/www/index.html` (the current app; `ansel/` folder itself contains only book PDFs — 1,431 files, all .pdf/.docx, no code).

## Consistency verification (scripted, Aug 2026 month, Delhi, ref star Rohini)

| check | result |
|---|---|
| Determinism (same input → same score) | ✅ PASS |
| Tier thresholds ordered & non-overlapping (Varjya < Ashubha < Sama < Madhyama < Uttama) | ✅ PASS |
| 155-sample sweep, zero non-finite scores / engine errors | ✅ PASS |
| Score continuity: no unexplained jumps >4 pts between half-hour samples except at legitimate boundaries | ✅ PASS — the 4 observed jumps all land exactly on Pañcha Pakshi sub-period edges (PP day starts 6:00; abstract sub-periods of 12–48 min). PP tables verified internally: day abstracts sum to 144 min = one 2h24m yāma; night likewise. |
| Vedha count scoring formula matches scoreMuhurta weights (b×1.4 − m×1.6) | ✅ PASS |
| PP Table No.5 outer-product structure | ✅ already cross-validated in source comments |

### Version inconsistency found (not a bug in one file)
`muhurta-gauge-1.1` anchors the Pañcha Pakshi day and all time windows at a **fixed 6am** ("sunrise"), while `pl0-app-1.30` has the real `sunriseSunsetLocal()` (Meeus hour-angle method, validated vs almanacs) wired into its PP engine. The gauge is the leaner/older engine here. Recommendation: port `03-astro-engine.js`'s `sunriseSunsetLocal` + the 1.30 `ppStateForInstant(…, dayLenHrs)` signature into the gauge.

## New: classical muhurta windows added to core logic
New module `muhurta-windows.js`, injected into the gauge's engine and scored by `scoreMuhurta()` (+0.6 benefic / −0.8 malefic per window — deliberately lighter than Vedha/tārā terms):

| window | tone | source |
|---|---|---|
| Rāhu Kāla (day, per weekday) | bad | Kalaprakasika p.175 table (Sun 4:30–6 … Sat 9–10:30); cross-checked B.V. Raman, Muhurtha ch. III |
| Yama-Ghaṇṭa (day, per weekday) | bad | Kalaprakasika p.176 table |
| Gulika (day + night portions) | mild bad | Kalaprakasika p.176 — text notes Gulika "is not considered inauspicious", so weighted mildest |
| Abhijit muhūrta (midday ±24 min of true solar noon; not Wednesday) | good | Raman, Muhurtha |
| Brāhma Muhūrta (~96 min before sunrise) | good | standard, Kalaprakasika/Raman |

Windows are rescaled from the nominal 6–18 daylight onto **true sunrise/sunset** when the ephemeris provides it (linear remap keeping classical proportions).

**Deliberately NOT scored:** Ardhaprahara — the Kalaprakasika print's table column is OCR-garbled and secondary sources disagree on weekday order; baking an unverified table would repeat the exact failure mode the app's own comments warn about (ch. XV vedha-of-signs). Left as documented stub pending a clean source.

### Post-integration regression
determinism ✅ · 155-sample sweep 0 errors ✅ · Wed-noon sample shows Rahu Kala reason line firing alongside existing tārā/karaṇa/yoga reasons ✅ · tier mapping unchanged ✅

### Verified against classical clock times
Wed 12:30 → Rahu Kala ✓ · Mon 8:00 → Rahu Kala ✓ · Sun 6:00–7:20 → Rahu Kala (rescaled to real sunrise) ✓ · Thu solar noon → Abhijit ✓ · pre-dawn → Brāhma Muhūrta ✓


## Porting session (Ashtakoota + Chintamani + Parasara-hora layers)

Ported from pl0-app-1.30 into the gauge (source-verified tables per VERIFICATION.md):
- **Ashtakoota** (8-koota guna milan: varna/vashya/tara/yoni/graha-maitri/gana/bhakoota/nadi) — `computeAshtakoota()`
- **Kuja dosha** (4-house and 6-house variants) — `computeKujaDosha()` (natal-chart tool; available to UI)
- **Chintamani checks**: nakshatra temperament, chara yoga, gochara vedha, tara tapering, Bhadra, Panchaka, muhurta day slots (Kulika/Kalabela/Yamaghanta/Kantaka), Gandanta, Pushkara Bhaga, Rikta tithi, marriage/travel/dik-shoola/relocation/Kumbha chakra/housewarming/yajna guidelines — `chintamaniGeneralChecks()` etc.

New Parasara-hora / classic layers folded into the daily graded score:
- **Activity-nakshatra fit** (`gradeActivity`): 27 stars mapped to fixed/soft/light/sharp/movable/dreadful/mixed classes per Brhat Samhita via Raman's Muhurtha ch. IV; 10 activity profiles (marriage, travel, business start, construction, agriculture, medicine, ceremony, vehicle, art/music, daily routine); Pushya universal-benefic-except-marriage exception implemented.
- **Chandrashtama** with Raman ch. V neutralization (waxing Moon blunts the sting: −0.4 waxing vs −1.2 otherwise).
- **Nakshatra Panchaka** avoidance (last pada Dhanishta..Revati): south journeys, house repair, fuel/fodder, beds (−0.6).

Regression after integration: determinism ✓ · 186-sample sweep zero errors ✓ · activity reasons fire ✓ · synthetic Chandrashtama trigger verified ✓ · Ashtakoota sample (Aswini–Rohini = 13.5/36) ✓.
