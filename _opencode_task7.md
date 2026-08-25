# Task 7 — App re-design: verse/citation sweep, BPL content insertion, release v1.42

## Context

This is the continuation of the app re-design Pedro requested. Claude Code has
already made direct code changes (committed to the working tree, NOT yet
staged/committed — see "Code changes already made" below) and a multi-agent
content pipeline (research → BPL-voice drafting via a creative model →
adversarial review board → synthesis) already produced and vetted the new
copy below. Your job is: (1) the large citation/verse-locator sweep across
`www/index.html`, (2) insert the vetted copy at the right places, (3) verify,
(4) commit/push/release.

Follow this project's `.claude/skills/remove-source/SKILL.md` — it has just
been updated with a new learned rule (read it before starting): bare
chapter/verse/page locators (`Ch. XLI śl.2`, `ch. 4 p.102-105`, `v.9`, the
word "verse" itself) are in scope for stripping even with **no named
author/book title** attached, not just the previously-targeted named sources
(BPHS, Pulippani & Rao, Satya Jatakam, M.S. Mehta).

## Code changes already made (do NOT redo — verify present, then build on them)

In `www/index.html`:
1. **Theme system**: a third "Soft" theme was added. `THEME_CYCLE = ["bright","soft","dark"]`, a new `:root[data-theme="soft"]` CSS block, `applyTheme`/`initTheme` rewritten to cycle 3 states, button now labeled Light/Soft/Night. Search for `THEME_CYCLE` to find it.
2. **South Indian chart style**: `renderChartSouthIndian()` (fixed 4x4 grid, signs in fixed cells, Ascendant marked with a gold ring + `1·` house label wherever it falls) added alongside the existing `renderChart()` (North Indian diamond). A dispatcher `renderChartAuto()` picks based on global `CHART_STYLE` ('north'|'south'), toggled by a new `#chartStyleToggle` button, persisted to localStorage as `muhurtaChartStyle`. All three chart call sites (D1/Navamsa current panel, Varga page) now call `renderChartAuto()`.
3. **Varga plain houses**: `renderChart()`/`renderChartSouthIndian()` both accept `opts.plainHouses` — when true, house polygons skip the rashi-color tint (revert to the pre-jyotish-colors.js default look). The Varga page call site passes `{plainHouses:true}`; the D1/Navamsa panel does not (keeps rashi tint there).
4. Both syntax-checked with `node synchk_inline.js` (all 10 inline scripts clean) and manually verified in a browser (theme cycle, South Indian house-number math cross-checked against the North Indian chart's own numbers, Varga plain-house revert confirmed visually).

In `.claude/skills/remove-source/SKILL.md`: added the "Learned 2026-08-25" paragraph about bare chapter/verse/page locators (already described above).

**None of this is staged/committed yet** — it's sitting in the working tree alongside whatever you add in this task. Stage and commit it together with your own changes as one coherent commit (see Step 5).

## Step 1 — Size the verse/citation sweep

Re-grep broadly (not just the previously-targeted named-source list):
```
grep -noE "[Cc]h\. ?[IVXLC0-9]+[^<]{0,60}" www/index.html
grep -noE "ch\. ?[0-9]+ ?p\.[0-9-]+" www/index.html
grep -noE "śl\.[0-9,-]+|shloka|sloka" www/index.html
grep -noE "v\.[0-9]+" www/index.html
grep -inoE "\bverse\b" www/index.html
```
Earlier reconnaissance found roughly 50+ locations across the T() rendered strings — chapter/śloka locators for what looks like a muhūrta/commodity-price classical text (chapters up to LVII, "Price of Commodities", "Effects of planets moving") distinct from BPHS/Pulippani&Rao/Satya Jatakam/M.S. Mehta already handled in task6. Treat this as its own named-source group even if you can't identify the exact book title — the rule from the skill applies regardless of whether a title is attached.

## Step 2 — Do the sweep, following the skill's guardrails exactly

For every hit in **user-facing T() strings, template-literal HTML, `<summary>`/`<b>` labels** (i.e. what a user actually sees) — NOT code comments (`//`, `/* */`) and NOT the `source:"..."` dev-facing data fields in `jyotish-colors.js`'s inline copy inside `index.html` (leave those, same as task6's scope decision):

Read the surrounding sentence and rewrite so it reads naturally with the locator gone. Three real before/after examples from this file to calibrate on:

**Example A — pure citation clause, drop the whole parenthetical:**
- Before: `"tinajas de aceite de cuero" (cap. XLI śl.2, el mismo verso que nombra el oro para este signo) — the container...`
- After: `"tinajas de aceite de cuero" — the container...` (drop the "(cap. XLI śl.2...)" parenthetical entirely; the sentence reads fine without it)

**Example B — locator embedded mid-sentence naming where a claim comes from:**
- Before: `Ch. XXIX śl.7 names the "castor oil-tree" (Hasti Karpuraka)...`
- After: `The castor oil-tree (Hastikarpūraka)...` (drop the "Ch. XXIX śl.7 names" framing; keep the substantive content)

**Example C — the word "verse" used as a hedge/caveat, not a locator — replace, don't delete the caveat itself:**
- Before: `Debilitated, but by widely-taught (not verse-verified) Nīcha-Bhaṅga criteria this cancels:`
- After: `Debilitated, but by widely-taught (not independently verified) Nīcha-Bhaṅga criteria this cancels:` (the caveat that this isn't confirmed is real content — keep it, just reword away from "verse")

Never leave a dangling connective, parenthesis, or "see —" with nothing after it. Re-grep the same patterns after your pass to confirm the sweep is complete on in-scope files; spot-check ~10 of the actual diff hunks (not just the stat) for mangled grammar or lost caveats.

## Step 3 — Insert the vetted BPL-voice content

### 3a. Yoga Combinations vignettes

Home: `renderRemediesPage()` (renders into `#remediesPageContent`, the "Remedies & Combinations" nav page). Add a new panel titled `${T('Yoga Combinations — Case Studies','Combinaciones de Yoga — Casos de Estudio')}` positioned after the existing `mahaHtml` block (the live Mahapurusha-yoga check) and before `pathakHtml`, inside the first `<div class="panel">` (the "Yoga & Gemstone Guidance" one) — or as its own following panel, whichever reads cleaner given the existing panel's length. This page already covers live-computed Mahapurusha yoga presence for the user's own chart; these vignettes are the complementary *reference/teaching* material (real historical examples), matching BPL's "map metaphor" pattern of a reference page alongside a live check.

Render as English-only prose blocks for now (this content wasn't drafted bilingually — if you want Spanish too, that's a follow-up, not blocking for this release). Use `<div class="hint">` or similar existing prose-block styling, one per vignette, with the yoga name as a bold sub-heading. Preserve the Markdown-bold (`**...**`) as HTML `<b>` and the Devanagari/IAST inline exactly as given — do not strip any of it (it's the app's own educational subject matter, not a citation).

**IMPORTANT — one fix required before insertion**: the vetted copy below still names Narendra Modi (a sitting head of government as of this writing) as the flagship example for Gajakesari Yoga. The review board flagged this as a political-sensitivity risk for a shipped app with a global audience and explicitly left the call to a human. Pedro/Claude Code's call: drop the Modi example. Replace the Gajakesari Yoga paragraph with this version instead (already written, no further editing needed — insert as-is):

> **Gajakesari Yoga (गज-केसरी — "elephant-lion")**
>
> When Bṛhaspati, our teacher-planet Jupiter, lands in a kendra — kendra (केन्द्र) simply means a pivot-point, houses 1, 4, 7, or 10 counted from the Moon — the tradition names this Gajakesari Yoga, one of the great markers of a dignified, far-seeing mind. I think of it as the elephant's steady strength married to the lion's visibility: breadth of judgment that others notice. Vedic astrology writers reach for this yoga often when a chart shows unusual public credibility paired with sound judgment — it is one of the most frequently cited combinations in the whole tradition, precisely because Jupiter near a kendra from the Moon is common enough to recognize in many well-regarded charts, your own included. Study it as a pattern to notice rather than a name to chase — the yoga describes a capacity for large-scale thinking; what you build with it stays entirely your own work.

The other five vignettes (Sasa/Obama, Neechabhanga/Obama, Hamsa/Kalam, Budhaditya/Bachchan, Chandra-Mangal/Gates) and the closing blessing line ship as-drafted — full text is in `_opencode_task7_content.md` (written alongside this file) to keep this spec readable. Read that file for the complete, final copy.

### 3b. UI microcopy (3 short pieces, also in `_opencode_task7_content.md`)

1. Theme toggle "Soft" tooltip — add as a `title="..."` attribute on `#themeToggle` (or as a one-time hint shown near it) using the vetted one-liner.
2. South Indian chart orientation blurb — add near the `#chartStyleToggle` button or as a `<div class="hint">` shown once above the D1 chart when South Indian style is active, using the vetted 2-3 sentence text.
3. Varga plain-houses design-change note — add as a `<div class="hint">` near the existing Varga page hint text (the one starting "Chart shows the..."), using the vetted one-liner.

All three must render through `T(en, es)` — the vetted copy is English-only; write a reasonable Spanish counterpart yourself in her same voice (short, warm, first-person) rather than leaving Spanish visitors without it, since this project ships bilingual throughout.

## Step 4 — Verify

1. `node synchk_inline.js` — all 10 inline scripts must still parse clean.
2. Re-run the grep patterns from Step 1 — should return zero hits in user-facing T() strings (comments/dev-data fields may still legitimately have them, same as task6's scope).
3. Grep the new content for the words `verse`, `śloka`, `shloka`, `sloka`, and any `ch\.`/`v\.[0-9]`/`p\.[0-9]` pattern — must be zero (the vetted copy was already checked clean, but re-verify after your own insertion/formatting work, since manual insertion is where mistakes creep in).
4. Spot-check in a browser if convenient (not required): Remedies & Combinations page shows the new Yoga Combinations panel; theme toggle still cycles 3 states; chart-style toggle still switches North/South on D1, Navamsa, and Varga.

## Step 5 — Commit, push, release

Stage everything together (the code changes from earlier in this session + your sweep + your content insertion) as one commit. Suggested message: `Redesign: soft theme, South Indian chart style, plain Varga houses, yoga-combination case studies, broadened citation sweep`. Push to main, monitor `android-apk.yml` CI, download the resulting APK, mirror to `Downloads\pl0-apk\app-debug.apk` (this project's established convention — see the most recent release for the pattern), and cut the next tag (v1.42, following v1.41's convention: tag + GitHub release with the APK attached, release notes summarizing what shipped).

Report back: final release version/tag, APK location + sha256, and a summary of what shipped (mirroring the format used for the v1.41 report).
