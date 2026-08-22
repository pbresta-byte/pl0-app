# BPL Case-Method Synthesis — Examples × Classical Texts (working draft v1)

Method: Barbara Pijan Lama's signature format = classical rule + etymology +
ruler-as-professor curriculum + public-figure exemplars with exact placement
markers. Below: first synthesized entries combining the jyotish-corpus texts
with her documented examples.

---

## Pushya (पुष्य) — "Nourishment" — 08

**Classical base** (BPHS via bpl-corpus): good for all auspicious purposes
except marriage. √puṣ = thrive, flourish; sidhya = accomplishment. Deity:
Bṛhaspati (Indrapurohita). Gana: Deva. Symbol: cow's udder.

**Ruler curriculum**: "Professor Sober Shani — curriculum of customary
orderliness and security rules." Shani-ruled trio (Pushya-Anuradha-
Uttarabhadrapada): blossoms after Shani matures at age 36.

**Pada map** (all within Karkata):
- Pada-1 Simha svamsha — glittering center-stage; politics/entertainment
- Pada-2 Uttaraphalguni svamsha — DOUBLE SURYA; regally entitled diva-style
- Pada-3 Kanya — logistical, ministering; Mithuna 10th-nav: media/writing
- Pada-4 Vrischika — transformative, hidden-power; Simha 10th-nav: ceremony

**Exemplars** (BPL corpus, Nakshatra_radical__08pushya.htm):
Winston Churchill [Uttaraphalguni svamsha] — glittering wartime center-stage,
matching the pada's Simha-svamsha radiance. Alexander Hamilton [Aryaman
svamsha, pada-3] — Mithuna-nav writing/publishing genius (Federalist Papers).
Elizabeth-2 [Pushya svamsha] — lifelong duty-in-hierarchy, textbook Shani
curriculum. Desmond Tutu [pada-3] — seva/ministering career.

---

## Pattern rules extracted for PL0 implementation

1. **Svamsha (nakshatra of navamsa lagna) is her primary identity marker** —
   every example is tagged by it. PL0's natal page could compute and display
   navamsa-nakshatra as the headline identifier.
2. **10th-navamsha career-domain lists** are standardized keyword clusters per
   sign — implementable as a lookup table in the app (12 signs × domain list).
3. **"Check graha X ++ Y" verification pointers** = a natural fit for the
   app's reasons-panel: after a verdict, list which other placements to check.
4. **Feminine/Masculine valence grouping** — she presents readings by valence;
   optional display mode.

## Source notes
- BPL corpus: `bpl-corpus/Nakshatra_radical__08pushya.htm` (59K chars studied)
- Classical cross-checks: BPHS (Pushya auspiciousness), BS ch. LII karana/
  tithi rules already implemented in classical-rules.js.
