# Verification Report — Calculation Tables vs. Classical Corpus

Date: 2026-08-22
App code: `pl0-unpacked/` · Corpus: `jyotish-corpus/`
Corpus texts available: Brhat Naksatra (S. Rath), Vimsottari & Udu Dasas (S. Rath, 3 copies), Crux of Vedic Astrology (S. Rath), Brihat Jataka (2 eds.), Brihat Samhita (2 eds.), Jataka Parijata vol.2, Stree Jataka (3 eds.), Narayana Dasa, Vedic Remedies, Biorhythms of Natal Moon.

---

## 1. Tara (Navatara) cycle — `TARA_CYCLE`, `taraForOffset()` (02-sbc-data.js:518), `computeTara()` (09-ui-wiring.js:378)

**Status: VERIFIED** (sequence and benefic/malefic counts)

- **Sequence.** App: Janma, Sampath, Vipath, Kshemya, Pratyari, Sadhaka, Naidhana, Mitra, Parama Mitra.
  > Brhat Naksatra, ch. "Navatara Chakra" (p.61): "The nine stars are called (1) Janma, (2) Sampat, (3) Vipata, (4) Ksema, (5) Pratyari, (6) Sadhaka, (7) Vadha, (8) Mitra and (9) Atimitra."
  Name variants are benign: the book itself states Vadha "is also called Naidhana tara" (p.61); "Parama Mitra" is the standard equivalent of "Atimitra" ("superlative level of 'mitra'"). Counting logic `((offset-1) % 9)` matches the 1-based navatara scheme; Abhijit exclusion is the app's own source instruction (Agarwal), outside this corpus.
- **Benefic/malefic.** App tones: good = 2,4,6,8,9; bad = 3,5,7; caution = 1.
  > Brhat Naksatra, p.68: "Remedial measures are necessary when one is under the … unfavorable transit of Janma (1), Vipat (3), Pratyari (5) or Vadha (7) naksatra. In the first cycle of the navtara chakra, the Vipat (3), Pratyari (5) and Vadha tara (7) are considered very inauspicious."
  This exactly matches the app's bad set {3,5,7} and the "caution" (not fully evil) tone for Janma; Sampat ("wealth… good fortune"), Ksema ("at ease, comfortable"), Sadhaka ("efficiency… accomplishments"), Mitra/Atimitra ("friend") match the good tones.

## 2. Latta dosha rules — `LATTA_RULES` (02-sbc-data.js:534)

**Status: NOT-COVERED-IN-CORPUS**

The corpus contains no text on Latta dosha. Case-insensitive searches for "latta", "Lāṭa", "Lata" (dosha sense) across all 16 corpus files return nothing (only the singer "Lata Mangeskar" in Crux and unrelated "Bhallata" in Brihat Samhita). The app cites M.K. Agarwal, *Mystics of Sarvato Bhadra Chakra*, ch. XI/XVIII-2 — that book is **not in this corpus**, so the steps (Sun 12 fwd, Moon 22 back, Mars 3 fwd, Mercury 7 back, Jupiter 6 fwd, Venus 5 back, Saturn 8 fwd, Rahu/Ketu 9 back) could not be independently checked. Note: the classical Latta tradition (e.g. from works outside this corpus) uses the same step counts, which is consistent, but no in-corpus citation can be given.

## 3. Ashtakoota (guna milan) tables — `08-chintamani-bs-ashtakoota-rules.js`

**Status: NOT-COVERED-IN-CORPUS**

No corpus text covers Ashtakoota/koota matching. Searches for "koota", "guna milan", "varna/vashya", "mahendra", "yoni porutham" return zero hits in all 16 files, including Crux of Vedic Astrology (checked specifically as the likely candidate — it does not treat marriage matching).

Per-koota status against the corpus:

| Koota | Max pts (app) | Status |
|---|---|---|
| Varna | 1 | NOT-COVERED-IN-CORPUS (matches standard tradition) |
| Vashya | 2 | NOT-COVERED-IN-CORPUS (app uses the source's own 5-category variant, flagged in comments) |
| Tara | 3 | NOT-COVERED-IN-CORPUS; the mod-9 bad set {3,5,7} used in `ashtakootaTara` **is** corroborated by Brhat Naksatra p.68 (see item 1) |
| Yoni | 4 | NOT-COVERED-IN-CORPUS (app itself flags the 14×14 grid as illegible in its scan and uses a coarsened same-yoni/enemy/flat-2 version — known synthesis, not re-reported as an error) |
| Graha Maitri | 5 | NOT-COVERED-IN-CORPUS |
| Gana | 6 | NOT-COVERED-IN-CORPUS (app comment: "standard classical grouping — not among the pages supplied clean"; the Deva/Manushya/Rakshasa star assignments do match the widely standard list) |
| Bhakoota | 7 | NOT-COVERED-IN-CORPUS (dosha at rāśi distances 2/5/6/8/9/12 = the standard rule) |
| Nadi | 8 | NOT-COVERED-IN-CORPUS (Adi/Madhya/Antya cycling every 3 stars from Aswini = the standard assignment) |

Total 36 (1+2+3+4+5+6+7+8) is the canonical guna-milan maximum. The app's own comments already flag which parts are synthesis vs. transcription; those are noted here for completeness only.

## 4. Vimshottari dasha years & order — `VIMSHOTTARI_YEARS` (04-panchanga-sbc-engine.js:314)

**Status: VERIFIED**

App: Ketu 7, Venus 20, Sun 6, Moon 10, Mars 7, Rahu 18, Jupiter 16, Saturn 19, Mercury 17 (total 120).

> Jyotish_Vimsottari_…_retyped 2nd version_ban.txt, §5.4.1 (p.82): "The periods for the planets (in their order) have been spelt out by Parasara as Sun – 6 years, Moon – 10 years, Mars – 7 years, Rahu – 18 years, Jupiter – 16 years, Saturn – 19 years, Mercury – 17 years, Ketu – 7 years and Venus – 20 years."

All nine values and the nakshatra-lord order match exactly.

> Order: same text, §5.2: "The Navagraha … in the order of Ketu, Venus, Sun, Moon, Mars, Rahu, Jupiter, Saturn and Mercury are the lords of the nine constellation as reckoned from Aswini" — the app's cycle order (Aswini=Ketu → Venus → Sun → …) is correct.

⚠️ OCR caveat: the first (non-retyped) scan of the same book reads "Saturn – **59** years" (line 4408) — a scan artifact contradicted by the retyped edition and by the 120-year total (§5.1: "Vimsottari Dasa has a total cycle duration of 120 years"). The app's 19 is correct.

## 5. Nakshatra lords — `NAK27[].lord` (02-sbc-data.js:11)

**Status: VERIFIED**

App assigns Aswini→Ketu, Bharani→Venus, Krittika→Sun, Rohini→Moon, Mrigasira→Mars, Ardra→Rahu, Punarvasu→Jupiter, Pushya→Saturn, Ashlesha→Mercury, repeating ×3.

> Jyotish_Vimsottari_…_S. Rath.txt, §5.2 (line 4289): "Ketu, Venus, Sun, Moon, Mars, Rahu, Jupiter, Saturn and Mercury are the lords of the nine constellation as reckoned from Aswini. This order of planets also determines the lordship for the other two complimentary sets of nine constellation."

Spot-checks in Brhat Naksatra: "Ketu the Lord of Asvini" (line 15641); "the Sun, lord of Krittika" (line 14013); "Krittika … ruled by the Sun" (line 3950). All 27 app assignments follow the verified order and match.

## 6. Vedha pairs — `VEDHA_TABLE` (02-sbc-data.js:900)

**Status: VERIFIED (internal consistency)** — programmatically checked with a parser over all 28 rows:

- **28 rows present**, covering all 28 SBC stars (27 + Abhijit); no star missing, no target referencing an unknown star.
- **Mutuality:** every Front pair is mutual (A.front = B and B.front = A); every Right/Left pair is mutual-and-swapped (A.right = B ⟺ B.left = A). **Zero asymmetries found** across all 28 × 3 directions.
- The code comment's own claim ("Front-Vedha pairs are mutual by construction… Right/Left are mutual-and-swapped") is confirmed by the check. The noted "Kartika"→"Krittika" typo correction is consistent with the symmetry.
- The classical source for this table (Agarwal's SBC book) is not in this corpus, so the pair assignments themselves could not be checked against an independent text — only internal consistency, which passes fully.

---

## Summary

| # | Item | Status |
|---|---|---|
| 1 | Tara cycle & benefic/malefic counts | **VERIFIED** (Brhat Naksatra p.61, 68) |
| 2 | Latta dosha rules | **NOT-COVERED-IN-CORPUS** (source book not in corpus) |
| 3 | Ashtakoota tables | **NOT-COVERED-IN-CORPUS** (tara bad-set {3,5,7} corroborated via item 1; totals = standard 36) |
| 4 | Vimshottari years & order | **VERIFIED** (Vimsottari & Udu Dasas §5.2/§5.4, retyped ed. p.82; OCR "59" in one scan noted) |
| 5 | Nakshatra lords | **VERIFIED** (Vimsottari §5.2 + Brhat Naksatra spot-checks) |
| 6 | Vedha pairs | **VERIFIED internal consistency**: 28/28 stars, fully mutual, no asymmetries; source text not in corpus |

No discrepancies against the corpus were found. Items 2, 3 and the external source of item 6 require the missing source texts (Agarwal's SBC book; a koota-matching text such as Muhurta/Marriage-matching literature) to be fully verified.
