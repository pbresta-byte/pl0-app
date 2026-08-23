# ASTROSHANKAR Channel Synthesis — Siddha-Tradition Techniques
*Mined from 354 YouTube transcripts (5.5M chars) of youtube.com/@ASTROSHANKAR
(ASTROFOXX — "Astro Secrets of Siddars"), Tamil/English Jyotish teacher.*
*Extraction: rule-pattern regex across all transcripts → dedup → domain clustering.
Each entry cites the video ID. Cross-check status vs classical corpus marked per entry
where verified; entries not yet checked are marked UNCHECKED.*

---

## Nakshatra Techniques (36 rules)

Sample of extracted rules (full pool in `_shankar_raw_rules.json`):

- **[15-eKDBcFrI]** If a person is born in Swati ascendant or Swati moon, natives
  with major planets (e.g., Sun) in Swati will be helpful/guiding to them — a
  nakshatra-affinity guidance rule. *UNCHECKED vs Brhat Naksatra.*
- **[15-eKDBcFrI]** Exaltation results are discussed relative to the yogi/avayogi
  nakshatra calculation — positive/negative nakshatra classification modulates
  whether the native should "increase yogi energy". *SIDDHA-SOURCE (yogi/avayogi
  energy-work framing is distinctively Tamil-Siddha).*
- Ethiradai (antagonizing) nakshatra pairs — dedicated video ox4asj_kPnU;
  pairs function as mutual vedha-like antagonists for timing work.
  *Cross-check pending against SBC vedha table in 02-sbc-data.js.*

## Graha Secrets (112 rules)

Largest cluster — includes the "Subtle Secrets" series:
- Retrogression series (PZXVfrHc5E8, J99RxJ33DuA, CmemK5PIsP0, rxpXdoypXWU):
  retrograde planets give results of the previous house / delayed-but-certain
  results; retrograde ascendant lord special cases.
- Dig Bala Rahasyam (EiRE43UEsRA): directional strengths used as multipliers,
  consistent with classical dig bala but with Siddha-specific application notes.
- Exaltation secrets (GFCkPFT9clU): exalted planet gives results of the house
  it *aspects* more strongly than the house it occupies — *UNCHECKED vs BPHS*.
- Moon in 12th (5gXSOz1w_io), Moon karma (3veEqJZev8g), Amavasya yoga
  (JXkec4rKOQ4), Chandrashtama secrets (huRILBXTsOM).
- Secrets of Saturn series (dYpi7SXi-GI): Saturn as karaka of sorrow but also
  of longevity and service; remedies orientation.

## Nadi Methods (23 rules)

- Princely life chart analyses (2uE-KxVcQ4I et al.): nadi-style reading via
  planetary sequences rather than house-by-house; career predictions from
  Jupiter–Saturn dasha interplay.
- Consistent with the corpus's nadi texts (Gopal Krishnan, Dinesh Mathur)
  in method; specific chart readings are teacher-specific examples.

## Muhurta/Panchanga (15 rules)

- Bhava Karanam (IIoIQRI_7ys): karana-level muhurta selection — aligns with
  Brihat Samhita ch.LII karana activities already implemented in PL0's
  classical-rules.js.
- Panchangam aroga nivritti (health-recovery timing) — appears repeatedly in
  nakshatra videos as a panchang application. *UNCHECKED vs Kalaprakasika.*

## Prediction Systems (179 rules)

The largest bucket — general prediction techniques including:
- Lagna-only prediction ("Predict everything just with lagna" dOrLL4r011c):
  whole reading from rising sign alone — a Siddha shortcut method.
- Dhan Vashikaran series (wealth-attraction remedial systems) — 100K-char
  transcripts; combines mantra + gemstone + timing prescriptions.
  *SIDDHA-SOURCE — no direct classical parallel in corpus.*
- Bruhat Ketu transit (BRUHAT series): transit-of-Ketu through houses gives
  distinct results from Rahu transits even though both are nodes.

## Remedies/Prasna (8 rules)

- Tamboola prasnam (28 prassanam secret of siddars, 172K chars — the single
  longest transcript): betel-leaf horary, a Tamil Siddha prashna variant
  where the offering itself encodes the answer. *SIDDHA-SOURCE.*
- Prasna secret of siddars series pairs with the corpus's Prashna Hora texts.

---

## Cross-Verification Notes

Verified alignments so far:
1. **Karana-based muhurta** — Shankar's bhava-karana usage matches Brihat
   Samhita ch.LII (already implemented in PL0 classical-rules.js R-tables). AGREE.
2. **Chandrashtama caution** — matches Raman's Muhurtha ch.V neutralization
   logic already in parasara-activity.js. AGREE.
3. **Dig bala** — direction-strength concept identical to classical; his
   multipliers are pedagogy variants. PARTIAL (same base rule, different weights).

Distinctly Siddha-tradition items flagged SIDDHA-SOURCE (no classical parallel):
yogi/avayogi energy work, tamboola prasnam, dhan vashikaran sequences,
lagna-only shortcut readings. These are valuable as *this lineage's*
techniques — cite as "ASTROSHANKAR (Siddha tradition)" rather than forcing
classical attribution.

---
*Raw rule pool: `_shankar_raw_rules.json` (373 rules, 48 videos with dense
rule content). Remaining ~306 videos contributed context/examples rather than
discrete rules under this extraction pattern; a deeper semantic pass could
raise yield.*
