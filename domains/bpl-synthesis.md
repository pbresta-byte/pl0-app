# BP Lama Corpus Synthesis — Svamsha Exemplar Index & Rule Pool
*Mined from 990 pages (43.6M chars) of barbarapijan.com — the largest
single-author Jyotishavidya reference in English.*

## Extraction Summary
- **18,184 items** extracted across 863 files:
  - **18,129 svamsha-tagged exemplar entries** (`[Role] Name [svamsha-marker]`)
  - 4 BPL COMMENTARY method blocks
  - 51 "Check graha X ++ Y" verification pointers
- **13,078 natives indexed by svamsha nakshatra** in `_bpl_svamsha_index.json`

## Svamsha Exemplar Distribution (top)
| Nakshatra | Exemplars |
|---|---|
| U.Phalguni | 6,395 |
| P.Phalguni | 4,757 |
| Punarvasu | 423 |
| Magha | 393 |
| Bharani | 352 |
| Pushya | 329 |
| Chitra | 184 |
| Hasta | 107 |

(The Phalguni dominance reflects her marker-matching; other nakshatras use
variant spellings to be normalized in a later pass.)

## Her Method (from COMMENTARY blocks)
1. Etymology → 2. Ruler teaching-style → 3. Pada nuance →
4. 10th-navamsha career domains → 5. Case validation via exemplars.
Every nativity is tagged with its svamsha ("the Soul's Portion" — the
nakshatra of the navamsha lagna), treated as astral-attunement identity.

Dasha epistemology: *"Vimshottari Dasha calendar = where the rubber meets the
road... Factual events should match with the timelords and the bhava they
control, or else there is something wrong with the birth data."*

## Application to PL0
- The svamsha index can power an exemplar lookup: given a user's navamsha
  lagna nakshatra, show matching public figures as pattern illustrations.
- Her "Check graha X ++ Y" pointers map naturally to PL0's reason-line system.
- Curriculum-language verdict framing already implemented in app footer.

*Raw pool: `_bpl_raw_pool.json` · Index: `_bpl_svamsha_index.json`*
