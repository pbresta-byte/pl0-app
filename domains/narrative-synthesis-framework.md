# Narrative Synthesis Framework — Design Extension

> Document: `domains/narrative-synthesis-framework.md`
> Status: Design proposal only — no code changes to `www/index.html` in this job.
> Scope: Extend the app's existing template-sentence style (karaka + house/sign + dignity or verdict tail) into four areas that currently use a thinner generic template, a mechanical pill-row, or no single synthesized sentence at all.

---

## 0. The Existing Template Style — What We Are Matching

The app already has three functions that build a single narrative sentence from a graha's **karaka**, the **houses/signs involved**, and a **dignity or verdict tail**:

| Function | Location (www/index.html) | Pattern |
|---|---|---|
| `functionalLordshipReading(g, housesRuled, overallCls)` | ~line 10481 | `<graha>, natural significator of <karaka>, ruling the ground of <listed house significations>, <good/bad/neutral verdict tail>.` |
| `vargaPlanetReadingLine(def, g, vSignIdx, lagnaVIdx)` | ~line 10509 | `<graha> in <sign>, the <house> of <varga>, suggests its <theme> significations act through <house signification> — <dignity tail>. As natural significator of <karaka>, <graha> here colours <theme> with <sign>'s own character: <sign flavor>.` |
| `ashtakavargaTransitReading(graha, sign, bTierTag)` | ~line 10909 | `<graha>, natural significator of <karaka>, in <sign>, <good/bad/neutral transit tail>.` |

**Shared DNA:** each opens with the planet's identity/role, places it in a concrete chart context (house, sign, varga, or transit), and closes with a conditional tail whose branch is picked from real engine state — not random flavor text. The tail is the only part that changes per chart; the scaffolding is stable. That is the style we extend.

---

## 1. Vimśottari Daśā Page

### Current state
`renderDashaPage()` (line 11120) already has **two** layers:
- `dashaLordReading` (line 1016) — functional-benefic/malefic verdict from the app's own house-lordship engine.
- `dashaFunnelNote` (line 1039) — funnel principle (a nested sub-period's promise manifests only as far as the coarser period above it allows), per-row from real tags.
- `mahadashaClassicalReading` (line 11106) — Shanker Adawal's *Encyclopedia of Vedic Astrology: Dasa Systems* ch. 2 general/strong/weak paragraphs, gated by the lord's natal dignity.

### What is missing
A **single synthesized sentence** that braids these three layers into one reading — the functional, the funnel, and the classical — the way `vargaPlanetReadingLine` braids varga context + dignity + sign flavor. Right now the three layers are three separate UI blocks.

### Proposed synthesis sentence structure
```
<Lord>, natural significator of <karaka>, <functional-verdict> from this Lagna
(ruling <house list>), <funnel-relation-to-parent>. Classically, during
<Lord>'s Mahādaśā, <Adawal strong/weak/general clause>; <dignity-gated
qualifier>.
```

### Classical theory points that deepen this beyond Adawal

1. **Sub-period (Antardaśā) effects keyed to house position *from the Mahādaśā lord**, not from Lagna.** Adawal's own source (flagged in `domains/mahadasha-effects-adawal.md` lines 72–73) has a second, unextracted pass giving generalizable Antardaśā rules: e.g. "sub-period of a planet located in the 12th from the main period lord brings..." for all 9×9 combinations. This is the classical basis for the funnel note — it makes the funnel not just an app-internal principle but a documented textual one. *Citation:* Adawal, *Encyclopedia of Vedic Astrology: Dasa Systems*, ch. 2, txt-line ~11800–16200+ (flagged in `mahadasha-effects-adawal.md` L72–73, **not yet extracted** — real extraction pass needed).

2. **Saravali ch. 42–44 — sub-period effects and antidotes.** Kalyanavarman's *Saravali* gives explicit sub-period readings and, crucially, **antidotes for evil dasas**: "If at the time of commencement of a Dasa, even one planet occupies the divisions of a benefic, or of an intimate friend and is aspected by a benefic, the evils due to come out of the said Dasa will disappear" (ch. 44, sl. 1–3). This lets the reading flag when a difficult classical Mahādaśā has a textual remedy condition present in the actual chart — a source-grounded mitigation clause the app can't derive from its own engine. *Citation:* Kalyana Varma, *Saravali*, ch. 42 "Effects of Sub-Periods", ch. 43 "Evil Effects of Dasas", ch. 44 "Antidotes for Evils of Dasas"; translation by R. Santhanam, AFA #V2514-034. Verified in corpus file `Jyotish_2014_Dr S.P. Bhagat_Saravali.txt` L5849–5863.

3. **Jātaka Parijāta ch. 18 — VimśottariDaśā general effects.** Vaidyanatha Dikshita's chapter on Vimśottari includes the rule that the **first dasa** (the one running at birth) produces effects conditioned by the Moon's navāṁśa position and the birth-star's pada, a layer independent of dignity-based branching. This gives a birth-specific clause that cannot be inferred from the lord's sign dignity alone. *Citation:* Vaidyanatha Dikshita, *Jātaka Parijāta*, ch. 18 "Vimshottari Dasha and other types of Dasha"; trans. V. Subramanya Sastri; corpus `Jyotish_1450_Jataka parijata vol.1.txt` ch. 18.

4. **Phaladeepika XXIV — Aṣṭakavarga Daśā crossover.** Phaladeepika notes that the Aṣṭakavarga Daśā (a separate timing system) modifies the Vimśottari reading: when a planet's Aṣṭakavarga Daśā coincides with its Vimśottari period, the results are amplified in the signification of the house where that planet has the most bindus. *Citation:* Mantreshwara, *Phaladeepika*, ch. XXIV sl. 27–33; referenced in Sripati Paddhati's ten modes of prediction (Sripati, *Sripatipaddhati*, "the ninth is the Aṣhtakavarga Dasa referred to in Jatakaparijata X-46-50 and Phaladeepika XXIV-27-33", corpus `Jyotish_1070_Sripatipaddhati_1937 edition.txt` L4449–4450).

### Implementation shape (proposed, not coded)
```
dashaSynthesisSentence(lord, birthPos, lordships, isWaxingMoon, level, parentLord):
  classical = mahadashaClassicalReading(lord, birthPos)
  funnel    = dashaFunnelNote(...)
  func      = dashaLordReading(...)
  // optional: saravaliAntidoteClause if a chart condition matches ch. 44
  en: "<Lord> (natural significator of <karaka>) <func.label> from this Lagna,
        ruling <houses>. <funnel>. Classically, <classical.general>;
        <classical.branch? With <lord> <dignityTier> here, <classical.branch>: —>.
        <?antidote: Saravali ch.44 notes a mitigating condition —
         <antidota-detail>.>"
```
Bilingual via the same `{en, es}` object pattern the existing three functions already use. The tail branches on `classical.branchTag` and on whether the Saravali ch. 44 remedy condition is present in `birthPos`.

---

## 2. House Lordship Readings (D1 & Vargas)

### Current state
`d1LordshipReadingsHtml` (line 10535) reads `LORD_CARRIES[H]` + `PLACE_DELIVERS[Y]` and concatenates: *"<H> house significations flow toward <Y> significations."* A small set of iconic placements (`CURATED_LORD_PLACEMENT`, line 10735) gets a classical one-liner. The rest are the generic template.

`renderHouseNaturePage` (line 10753) adds sign nature, lord profile, placement type (Kendra/Trikona/Dusthana/Upachaya), and whole-sign Graha Dṛṣṭi — all as separate UI blocks, no single synthesized sentence.

### What is missing
A narrative that connects **sign dispositor** → **house lord's placement** → **what that delivers**, plus a **curated classical sentence** for more combinations than the current 9 iconic ones.

### Classical theory points

1. **Garga Hora — per house-lord-in-house effect sentences.** Garga Hora gives explicit per-combination sentences for each house lord placed in each house (e.g. "Moon, Mercury, Venus in the 4th Bhava: will be endowed with great lordship, will be famous because of his great wife, be kind and interested in good people"). This is a classical source with 12×N combinations — a much richer curated set than the app's current 9. *Citation:* *Garga Hora*, trans. R. Santhanam; corpus files `Jyotish_12 houses_Garga hora_Santhanam.txt` and `Jyotish_12 houses_Garga hora_ sutras only2.txt`.

2. **Jātaka Parijāta ch. 11–15 — per-pair-house results.** Vaidyanatha Dikshita's chapters on house-wise results (I–II, III–IV, V–VI, VII–VIII–IX, X–XI–XII) give specific phala for the lord of house X in house Y, especially for the houses his volume treats as a pair. This provides sentences for malefic lords in malefic houses, the 8th lord in the 10th, etc. — combinations that are currently generic. *Citation:* *Jātaka Parijāta*, ch. 11–15.

3. **Phaladeepika IX — Kendrādhipati Doṣa and its exceptions.** Phaladeepika specifies that a natural benefic ruling a Kendra (4th, 7th, 10th) becomes functionally malefic there unless exalted or in its own sign — the **Kendrādhipati Doṣa** the app's own `functionalVerdict` already encodes. The *narrative* layer would add Phaladeepika's own phrasing for this condition and its noted exception for Jupiter (some texts exempt Jupiter from Kendrādhipati Doṣa entirely — a textual variant the sentence can flag). *Citation:* *Phaladeepika*, ch. IX; referenced in Sripati Paddhati and throughout secondary literature in the corpus.

4. **BPHS ch. 16 — Lagna-lord connection.** Parasara notes that the Lagna lord's placement colours the whole chart: in the 1st = strong self; in the 9th = dharmic authority; in the 12th = foreign residence and spiritual release. *Citation:* *Bṛhat Parāśara Hora Śāstra*, ch. 16; the app already cites BPHS ch. 16 sl. 6 for kaka-vandhya in Garga Hora, confirming this source is in active use in the corpus.

5. **Saravali ch. 15 sl. 13 — specific planetary-combination effects.** Referenced in `Jyotish_2009_K.K.Pathak_Classical Predictive Techniques_Vol.1.txt` L4616. A curated-combination sentence for Mars-Mercury ("makes one skilled in manufacture of medicine") is the kind of classical point that could be wired into the house-lord placement sentence when those two happen to be involved (e.g. Mars ruling the 3rd and Mercury the 6th, placed together).

### Implementation shape
Extend `CURATED_LORD_PLACEMENT` with a larger table sourced from Garga Hora and Jātaka Parijāta ch. 11–15, then build one sentence:
```
<Lord> (natural significator of <karaka>) placed in the <Y> from Lagna
<curated or generic: "carries <H> house matters into the field of <Y>">.
<?curated-classical-sentence.> <?Phaladeepika Kendrādhipati Doṣa clause
if applicable.>
```
Each entry is a `{en, es}` pair, editable independently.

---

## 3. Ashtakavarga Transit Readings

### Current state
`ashtakavargaTransitReading(graha, sign, bTierTag)` (line 10909) is the thinnest of the three existing templates: `<graha>, natural significator of <karaka>, in <sign>, <good/bad/neutral tail>`. The tail is one of three canned clauses — no dignity, no contribution-source, no per-graha specificity.

### What is missing
A sentence that incorporates **what the graha contributes** (its own bindu count in that sign), **who else contributed** (the other reference points that placed a bindu there), and the **per-graha classical effect** for that specific bindu count.

### Classical theory points

1. **Prāśn Mārga (B.V. Raman) ch. on Aṣṭakavarga — per-graha, per-bindu-count effect tables.** This is the single richest source for deepening this area. It gives explicit effects for each graha at each bindu count 8→0: e.g. Sun at 8 bindus = "wealth and prosperity from royal favour"; 7 = "wonderful welfare, happiness and pomp"; ... 1 = "severe sickness"; 0 = "sorrow, extreme panic and death." Mars, Mercury, Jupiter, Venus, Saturn each get their own table. *Citation:* B.V. Raman, *Prāśn Mārga*, vol. 2, ch. on Aṣṭakavarga; stanzas 15–22 (Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn transit effects at 8/7/6/5/4/3/2/1/0 bindus). Verified in corpus `Jyotish_1999_B.V. Raman_PRASNA MARGA_vol.2.txt` L6557–6601.

2. **Prāśn Mārga stanza 22 — the kakshya rule.** "When planets transit signs with no bindus they produce only evil. When they transit signs with 8 bindus, the results will be brilliant. Every sign has 8 kakshyas or orbits. When a planet transits in its own ashtakavarga a kakshya devoid of bindus, evil can only happen. Only when he transits the kakshya owned by the lord who has contributed a bindu (aksha lord), good will happen." This gives the narrative a second axis: **which reference point contributed the bindu** (the "aksha lord"), not just the raw count. The sentence can note whether the transiting graha's own bindu is among those landed. *Citation:* *Prāśn Mārga* stanza 22, `Jyotish_1999_B.V. Raman_PRASNA MARGA_vol.2.txt` L6597–6601.

3. **Jātaka Parijāta ch. 10 — Aṣṭakavarga Daśā and transit combination rules.** Vaidyanatha Dikshita gives rules for when two grahas transit signs that are both high-bindu in each other's Bhinnāṣṭakavarga, and when the birth chart's 7th-house Aṣṭakavarga score moderates the transit reading for marriage questions. *Citation:* *Jātaka Parijāta*, ch. 10; referenced in Sripati Paddhati L4449–4450.

4. **Saravali ch. 53–54 — Aṣṭakavarga effects.** Kalyanavarman's two Aṣṭakavarga chapters give general principles for reading the system: high counts at the Lagna, the role of the trine signs (1/5/9) as the "saving" signs in transit, and the rule that a graha transiting a sign with above-average Sarvāṣṭakavarga (28+) benefits whatever house it rules *even if* its own Bhinnāṣṭakavarga count there is mediocre — a principle the current app's UI already hints at ("Sarvāṣṭakavarga works at the level of the SIGN itself") but which the per-graha sentence does not yet use. *Citation:* *Saravali*, ch. 53 "Ashtakavarga", ch. 54 "Effects of Ashtakavarma"; Bhagat edition L7003–7078.

### Implementation shape
```
ashtakavargaTransitReadingV2(graha, sign, bTierTag, binduCount, sarvaCount, akshaLords):
  tail = PRASNA_MARGA_TABLE[graha][binduCount]  // per-graha, per-count
  akshaClause = (akshaLords.includes(graha)) ? "its own bindu among those landed"
    : "bindu(s) from <akshaLords>"
  en: "<Graha>, natural significator of <karaka>, in <sign>
       (<binduCount> Bhinnāṣṭakavarga bindus, <sarvaCount> Sarvāṣṭakavarga):
       <tail>. <?akshaClause>.>"
```
A `PRASNA_MARGA_TABLE` constant maps `{graha: {8: "...", 7: "...", ..., 0: "..."}}` from Raman's stanzas 15–22. This replaces the current three-branch tail with 63 (7 grahas × 9 tiers) classical clauses — still templated, but now grounded in a primary text instead of three generic paragraphs.

---

## 4. Sarvato Bhadra Chakra (SBC) Muhūrta Results

### Current state
`renderHoraryPage()` (line 16455) shows: a decline/safe banner, a mechanical pill-row of vedha hits, the SBC perimeter ring, an affliction-readings kv-block (Star/Consonant/Sign/Sign-quality), and a hint line about the unmodelled Dhuajadi Chakra. There is **no single synthesized sentence** that braids these into a narrative.

### What is missing
One sentence that states the SBC verdict in plain language — what the star affliction, the consonant affliction, and the rāśi quality together mean for answering the question.

### Classical theory points

1. **Bṛhat Nakṣatra (Sanjay Rath) — the primary SBC text.** This is the source the app's SBC engine is built on ("Mystics of SBC ch. II/IX" throughout the code comments). It gives: the 28-star perimeter with Abhijit, the per-star Front/Right/Left vedha directions, the malefic/benefic graha classification, the four lokas (E/S/W/N), and — crucially — the **decline rule**: "when the Praśna Star or Consonant is under malefic Vedha, the astrologer should decline to answer." The sentence should mirror the book's own stated priority: star first, consonant second, rāśi third, sign quality last. *Citation:* Sanjay Rath, *Bṛhat Nakṣatra* (the "Mystics of the Stars" reference throughout PL0); corpus `Jyotish_Brhat Naksatra_S.rath banned.txt`.

2. **Kalaprakāśikā ch. XIV — marriage and general election rules.** For activity-specific muhūrta, Kalaprakāśikā gives per-activity classical clauses that the SBC result can optionally layer with: e.g. the marriage chapter's condition on the rising sign and the Moon's star; the "Adverse Yogas to be avoided" list (ch. XIV) that names specific star-pair vedhas as disqualifying. When the SBC is read for a marriage question, the sentence can cite the relevant Kalaprakāśikā clause. *Citation:* Kalaprakāśikā of N.P. Subramania Iyer, ch. XIV "Celebration of Marriage"; ch. XVII "Pumsavanam"; corpus `Jyotish_1982_Kalaprakasika.txt`.

3. **Kalaprakāśikā ch. XV — general undertakings.** The "On Attainment of the Object" chapter gives a general-election clause: a moment's lagna should be free of malefic vedha and the Moon's star should be a "soft" or "light" class (per Nakṣatra classification) for most undertakings — a sentence tail for the "general" activity that the SBC result alone doesn't cover. *Citation:* Kalaprakāśikā ch. XV; Raman, *Muhurtha* ch. IV on nakshatra classes (fixed/soft/light/sharp/movable/dreadful) — the same classification used for the app's activity-class layer.

4. **Saravali ch. 31–33 — Vedha-specific results.** Kalyanavarman's chapters on nakshatra classes give results for specific stars when afflicted vs free: e.g. a "dreadful" star (like Mūla or Ārdrā) under vedha vs a "fixed" star (like Rohiṇi or Puṣya) under vedha produce different severities. This gives the SBC sentence a way to qualify the decline/affliction: not just "afflicted" but "<star-class> star under <graha> vedha → <Saravali clause>." *Citation:* *Saravali*, ch. 31–33.

5. **Hora Śāstra compilations (Prthuyāsa's Horā Sara, Śambhu Hora Prakāša) — the Pindārya/Ārya/Sūrya Vedha classification.** These sources classify the *type* of vedha (paternal/maternal/solar) differently from Rath's F/R/L scheme. The sentence can note when the afflicting graha is a natural malefic (Saturn/Mars/Sun/Rahu) vs a temporarily-malefic benefic — a distinction the app's `dignityWeight()` already computes for the score, but which the SBC page's *narrative* doesn't yet surface.

### Implementation shape
```
sbcSynthesisSentence(r):  // r = computeHoraryResult output
  decline  = r.decline
  starCls  = NAK_CLASS[r.star]     // fixed/soft/light/sharp/movable/dreadful
  conGrade = r.consonantMalefic.length  // 0/1/2+
  signMix  = r.signBenefic vs r.signMalefic
  en: "<Decline-or-safe headline>. <Star> (<starCls>) is
       <star-affliction-clause>; <Consonant> is <consonant-clause>.
       The Rāśi <r.sign> is <sign-mixed/benefic-only/malefic-only/clause>;
       <sign-quality clause>."
```
The star-clause branches on `r.starMalefic.length` and cites the Rath malefic/benefic classification; the consonant-clause is a tier-0/1/2 scale already present (`PRASNA_AFFLICTION_READING`); the sign-clause branches on `signBenefic vs signMalefic` presence; the sign-quality clause is `PRASNA_QUALITY_READING[r.quality]`. For marriage, a Kalaprakāśikā ch. XIV tail is optionally appended.

---

## 5. Cross-cutting Principles

1. **Every sentence is a `{en, es}` object**, matching the pattern the three existing template functions use. No hardcoded English-only strings.
2. **The tail branches on real engine state** — the only variable parts are (a) the dignity/verdict tier from the app's own computation, (b) a classical branch (strong/weak/general), (c) an optional remedy/mitigation clause from Saravali ch. 44 / Kalaprakāśikā / Phaladeepika. No random flavor text.
3. **Citations are inline in the source tables** (`PRASNA_MARGA_TABLE`, expanded `CURATED_LORD_PLACEMENT`, new `SARAVALI_ANTIDOTE_CLAUSES`, `KALAPRA_ACTIVITY_TAILS`) — same discipline as `mahadasha-effects-adawal.md`'s per-graha txt-line references and `domains/muhurta.md`'s per-rule citations.
4. **No conflation of systems.** Adawal's Mahādaśā paragraphs are a *complement* to `dashaLordReading`'s functional reading, not a replacement — the braid presents both, labelled. Raman's per-bindu effects are a *complement* to the tier tag, not a replacement. Kalaprakāśikā's muhūrta rules are a *complement* to the SBC vedha score, never folded into it. This matches the existing app-wide convention ("SBC and Pañcha Pakshi are two independent source systems the book never combines into one number" — code comment at line 3219).
5. **New domain files are the home for expanded tables**, not inline HTML: the larger curated-lord-placement table, the Prāśn Mārga per-graha/per-bindu table, and the Saravali antidote conditions each go in their own `domains/*.md` with txt-line citations, mirroring `mahadasha-effects-adawal.md`. The HTML only imports the final `{en, es}` strings.

---

## 6. Scope of Work (proposed, not started)

| Area | New table/constant | Primary source | Effort |
|---|---|---|---|
| Vimśottari Daśā | `dashaSynthesisSentence()` + Saravali ch. 44 antidote condition check | Saravali ch. 42–44; Jātaka Parijāta ch. 18; Phaladeepika XXIV (crossover); Adawal txt-line ~11800+ extraction (flagged, not done) | Medium — Adawal sub-period extraction is the real work |
| House Lordship | Expanded `CURATED_LORD_PLACEMENT` (from 9 to ~40 entries) | Garga Hora per-combination sentences; Jātaka Parijāta ch. 11–15; Phaladeepika IX | Medium — copy-edit sentences from two sources |
| Ashtakavarga Transit | `PRASNA_MARGA_TABLE` (7×9), aksha-lord clause | Prāśn Mārga stanzas 15–22 (Raman); Jātaka Parijāta ch. 10 | Medium — 63 short clauses to transcribe and translate |
| SBC Muhūrta | `sbcSynthesisSentence()` | Bṛhat Nakṣatra (Rath); Kalaprakāśikā ch. XIV–XV; Saravali ch. 31–33 | Low–Medium — mostly re-pr(existing blocks into one sentence |

Total estimated new domain-document content: 4–6 pages of source-grounded tables, plus the four new/expanded JS functions.

---

## 7. What This Job Does and Does Not Do

**Does:** proposes the design, identifies the specific classical theory points per area, names the primary source for each, and specifies the sentence structure and the table/constant that backs it.

**Does not:** edit `www/index.html`, write any JavaScript, or ingest any new corpus files. All four sentence structures are specified here as markdown with pseudo-code, ready for a follow-up job that ingests the primary sources into domain tables and wires the functions into the renderers.
