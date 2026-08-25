Three related changes to the Anatomy page, all in www/index.html. Read the live file first at each location named below — line numbers may have drifted slightly from what's quoted here.

## Part A — Upgrade the Deha Chakra body figure to match the Pañcha Pakshi figure's visual quality

`renderBodySilhouette(zoneFill)` (search for `function renderBodySilhouette`, ~line 5630) currently draws its 12 zodiac-sign zones (Aries=head ... Pisces=feet, one shape per sign, per its own doc comment) using plain `<rect>`/`<circle>`/`<ellipse>` primitives — the same "blocky" style `renderAnatomyFigure()` used to have before it was upgraded to smooth tapered-capsule shapes. This is the ONLY caller chain: `renderBodyGauge(deha)` (~line 5669) calls `renderBodySilhouette()`, and `renderBodyGauge()` is used only by the Deha Chakra panel. (Note: `renderBodySilhouette`'s doc comment claims it's "shared by both body-reading panels" — that's stale, it has exactly one caller today. Fix the comment while you're there, don't leave it misleading.)

Rewrite `renderBodySilhouette()` to use the same tapered-capsule / smooth-path drawing technique already in `renderAnatomyFigure()` (search for `function taperedLimb` inside `renderAnatomyFigure` — a variable-width ribbon path with rounded end caps) so the Deha Chakra figure reads as an actual body silhouette instead of stacked boxes, matching the polish of the Pañcha Pakshi figure. Keep everything else about the contract unchanged:
- Same function name and signature: `renderBodySilhouette(zoneFill)`.
- Same `zoneFill(sign)` callback contract — called once per of the 12 signs (Aries..Pisces), returning `{fill, stroke, sw}`.
- Same single front-facing view (this figure does NOT need a back view — it's a single Kālapuruṣa reading, not a front/back paired system like Pañcha Pakshi).
- Keep the same viewBox proportions (roughly `0 0 220 480`, tall single figure) — `renderBodyGauge`'s caller wraps it at `min-width:200px` so don't make it dramatically wider.
- Every one of the 12 signs must remain a distinct, clickable-looking region: Aries(head), Taurus(neck), Gemini(shoulders/arms), Cancer(chest), Leo(upper back/heart region drawn as chest-adjacent block), Virgo(abdomen), Libra(lower back), Scorpio(pelvis), Sagittarius(thighs), Capricorn(knees), Aquarius(calves), Pisces(feet) — same anatomical mapping as today, just smoother shapes.

## Part B — Frame the Deha Chakra figure like the Pañcha Pakshi "manuscript plate", and match the legend's chip style

The Deha Chakra panel (search for `Deha Chakra — Nectar &amp; Poison Point Gauge`, ~line 9446) currently renders its figure in a plain unframed `<div style="flex:none; min-width:200px;">` and its legend (`.chakra-legend`, CSS ~line 438) uses small rounded-square swatches (`.li`/`.sw`).

1. Wrap the figure in the same inset-double-rule "manuscript plate" frame used for Pañcha Pakshi's `.pp-plate-figure-box` (CSS ~line 469-508: `.pp-plate`, `.pp-plate::before`, `.pp-plate-figure-box`, `.pp-plate-figure-box::before`). DO NOT reuse the `pp-plate-*` class names directly (they're scoped to that panel) — add a parallel set prefixed `dc-plate-*` (e.g. `.dc-plate-figure-box` mirroring `.pp-plate-figure-box`'s exact CSS) so both panels share the same visual language without one panel's CSS accidentally affecting the other.
2. Change `.chakra-legend .li`/`.sw` from rounded-square swatches to small circular dot chips, matching `.pp-plate-legend`'s `.dot` style (8px circle, `border-radius:50%`) and its mono-uppercase micro-label typography — so the two panels' legends look like the same design system. Keep all 4 existing legend items, their exact colors, and their exact text unchanged — only the swatch SHAPE and label typography change, not the content or meaning (Deha Chakra's legend is about zodiac-sign zones, a different concept from Pañcha Pakshi's body-part-zone legend — don't merge them, just match their visual style).

## Part C — Add a real (not invented) strength/intensity tag to the Nectar and Poison zone readings

`computeDehaChakra()` (search for `function computeDehaChakra`, ~line 7529) already computes a qualitative intensity for the Nectar and Poison readings via if/else branches on `bright` (Śukla/Kṛṣṇa pakṣa) and `taraTone` — look at the `nectarNote`/`poisonNote` assignment block (~line 7550-7559). There are 4 real tiers already being chosen between for each:

- Nectar: "strongly active" (bright + good tārā) → "active" (bright only) → "gently active" (good tārā only) → "muted" (neither).
- Poison: "sharply heightened" (dark + bad tārā) → "heightened" (dark only) → "present but contained" (bad tārā only) → "quiet" (neither).

Add a parallel discrete tier value alongside each note — don't change the note text or the branching logic, just also capture which tier was chosen as data. Use tier names: `'strong' | 'active' | 'gentle' | 'quiet'` for nectar, and `'severe' | 'heightened' | 'watch' | 'quiet'` for poison (pick names that read sensibly as a short tag label — these are suggestions, use your judgment on the exact 4 words as long as they map 1:1 to the 4 existing branches and don't overstate what a quiet/muted reading means). Return these as `nectarTier`/`poisonTier` on the returned object (alongside the existing `nectar`/`poison` objects — either as a sibling field or nested inside `nectar`/`poison`, your call, just wire the caller to match).

In the Deha Chakra panel's render (~line 9456 and ~9461, the `<div class="k">Nectar zone</div><div class="v"><b>...</b></div>` and Poison equivalent), add a small tag next to the zone title using the app's EXISTING `.tag` classes (`.tag.good`, `.tag.bad`, `.tag.neutral` — CSS ~line 399-406, already used elsewhere e.g. the `dirTag` pattern in `renderPlanetTable`) rather than inventing new tag styling:
- Nectar tier 'strong' → `.tag.good`; 'active' → `.tag.good` (or neutral, your call by how strongly it reads); 'gentle' → `.tag.neutral`; 'quiet' → `.tag.neutral`.
- Poison tier 'severe' → `.tag.bad`; 'heightened' → `.tag.bad`; 'watch' → `.tag.neutral`; 'quiet' → `.tag.neutral`.
Route the tag's visible label text through `T(en, es)` like everything else on this page.

## Part D — Make reasoning/explanation text more readable on this page

The `.hint` class (CSS line 272: `font-size:10.5px; color:var(--slate); margin-top:4px;`) is used app-wide for many small captions, so do NOT change the base `.hint` rule — that would affect every page, not just this one. Instead, add a new modifier class, e.g. `.hint-emphasis` (bump to `font-size:12.5px` and `color:var(--ink-dim)` instead of `var(--slate)` — same family already used for `.kv .v`, so it stays consistent with the rest of the app's contrast language, just more visible than the default muted hint), and apply it ONLY to the blocks on THIS page that explain the live reasoning behind a birth-data-driven reading:
- The Deha Chakra "Method (this app's synthesis...)" block (~line 9473-9485).
- The Stellar Body "Read this as a second, independent body..." block (~line 9498-9509).
- The top intro hint on the Anatomy page ("How this app reads the body from the sky...", ~line 9442).
Do this by adding `hint-emphasis` alongside the existing `hint` class on those three specific elements' `class` attributes (`class="hint hint-emphasis"`), not by touching the shared `.hint` rule or any hint elsewhere in the file.

## Guardrails

- Touch ONLY: `renderBodySilhouette()`, its doc comment, `renderBodyGauge()` if needed for the tier wiring, `computeDehaChakra()`, the Deha Chakra panel's template inside `renderAnatomyPage()`, the Stellar Body panel's and top intro's `class` attributes, and the shared `<style>` block (new CSS additions only — don't edit any existing CSS rule except the doc-comment fix, and don't touch the `.hint` base rule).
- Do NOT touch `renderAnatomyFigure()`, the Pañcha Pakshi panel's markup/CSS, or anything else in this 12,000-line file. Both existing panels were already implemented and reviewed in prior sessions — this task extends the same visual language to Deha Chakra, it doesn't change Pañcha Pakshi.
- All new user-facing strings (tag labels, anything else) go through `T(en, es)` with real Spanish, matching this file's existing convention everywhere.
- Do NOT run `npm install`, `pytest`, Android/Gradle builds, or any other heavy command.
- Do NOT run `git add`, `git commit`, `git push`. Leave changes unstaged.
- After editing, run this syntax check from the repo root and confirm it prints `ALL N INLINE SCRIPTS PARSE OK`:
```
node -e "const fs=require('fs');const html=fs.readFileSync('www/index.html','utf8');const re=/<script(?![^>]*src)[^>]*>([\s\S]*?)<\/script>/g;let m,i=0,ok=true;while((m=re.exec(html))){i++;try{new Function(m[1]);}catch(e){ok=false;console.log('script #'+i+' ERROR: '+e.message);}}console.log(ok?'ALL '+i+' INLINE SCRIPTS PARSE OK':'FAIL');"
```
- When done, report: `git diff --stat` to prove only `www/index.html` changed, and a short summary of what changed in each of Parts A-D.
