# story-lab: rules, lenses, and the chart's story

Sketch of how a chart becomes a short, traceable story. Nothing in `www/` is touched; the app's own engine is loaded read-only (`engine.js`).

```
charts.json ──► build.js ──► out/readings.json ──► render.js ──► out/reading.html
 (people)       │  1 FACTS    engine: positions, houses, dignity, navāṁśa, karakas, daśā
                │  2 RULES    rules.json, each tagged with a lens, applied to the facts
                │  3 JUDGE    per chapter: score each lens, then compare lenses
                └  4 CHECK    corpus tags (domains/_bpl_raw_pool.json) tested against the chart
```

## The four objects

| Object | File | What it is |
|---|---|---|
| **Lens** | `lenses.json` | A way of reading with its own question: `bhava` (house lords, yogas, dignity, daśā), `moon` (Moon rāśi, nakṣatra-pāda, dispositor, 10th-from-Moon), `jaimini` (Ātmakāraka, Amātyakāraka, Dārākāraka). |
| **Rule** | `rules.json` | `when` conditions over facts → `polarity` (+1 supportive, 0 descriptive, −1 strained), `weight` 1–3, a `topic` (chapter), a `beat` sentence, a bracketed `clause`, optional `check` pointers and `caveat`. `for` expands a rule over houses, grahas or yoga pairs. |
| **Finding** | in `readings.json` | A rule that fired on one chart, with `receipts`: the exact chart facts that made it fire. |
| **Chapter** | `content.json` | A topic of the life story (protagonist, home ground, creative mind, working engine, crucible, partnership, gains, clock). Holds findings, a verdict per lens, and an `agreement` label. |

## Agreement, not averaging

Per chapter each lens gets `score = Σ polarity × weight`. Then:

- `convergent`: two or more lenses took a side and it is the same side
- `divergent`: lenses took opposite sides; both are shown
- `single-lens`: one lens spoke; a lead, not a conclusion
- `descriptive`: portrait only

A lens that scores zero but has both ▲ and ▼ findings is flagged `balanced` (it pulls both ways).

## Softeners

A lord in a trouble house weighs less if it is exalted or own by sign, or if its debility has cancellation conditions (`softenLord`). A kendra-trikona yoga seated in a dusthana is partial (`softenSeat`). This keeps the reading from sounding like a verdict.

## Adding a person

Fill `birth` in `charts.json` (date, local time, UTC offset, lat, lon, place), then:

```
node story-lab/build.js [as-of YYYY-MM-DD]
node story-lab/render.js
```

## Known limits of this sketch

- Only Cristian's birth data exists in the repo. Maria and Celia are placeholders.
- Rahu/Ketu graha-dṛṣṭi is not computed (traditions differ).
- Nīcha-bhaṅga reports four conditions. The app's own `nichaBhangaCheck` uses two; the extra ones are named in each finding's receipts.
- Moon-sign and nakṣatra wording exists for all 12 signs but only Dhaniṣṭha has a nakṣatra gist; other stars fall back to the ruler's curriculum line.
- Reading text is written in a case-method format for this app. The corpus pool holds example tags, not prose.
