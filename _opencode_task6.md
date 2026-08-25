Read `.claude/skills/remove-source/SKILL.md` first — it defines the general policy this task follows (scope, what counts as a citation, what to keep, how to edit). This task applies that skill concretely.

## Scope for this run

BOTH of these are in scope (the project owner confirmed both):

1. **`www/index.html`** — the live app. Only touch RENDERED user-facing text: inside `T(en, es)` calls, template-literal HTML strings, `<summary>`, `<b>`, `<footer>` content — anything a user actually sees. Do NOT touch JS code comments (lines starting `//` or inside `/* */`) that mention a classical source as internal documentation of a formula's basis (e.g. `// Classical bhava significations (BPHS ch. XI's short list)`) — those are dev-facing only and stay exactly as they are.
2. **Research/reference files**: `domains/numerology-colour-signals.md`, `domains/siddhanta-history.md`, `jyotish-colors.js`, `pp-body-map.js` (the latter two are draft files not loaded by `www/index.html` — confirm that by checking there is no `<script src="jyotish-colors.js">` or `<script src="pp-body-map.js">` anywhere in `www/index.html` before editing them, so you're not accidentally editing something live).

## Source names/authors to strip (grep case-insensitively for these across the in-scope files)

- `BPHS` (Bṛhat Parāśara Horā Śāstra) — appears ~44 times in www/index.html; most are in code comments (leave those), a real subset are in rendered `T(...)` strings and `<b>Source.</b>` rows (fix those).
- `Pulippani` / `Pulippani & Rao` / `K.N. Rao` — Pañcha Pakshi source, appears in both www/index.html and the reference files.
- `Satya Jatakam`
- `M.S. Mehta` (Ashtakavarga source, `<i>Ashtakvarga: Concept and Application</i>`)
- `Santhanam` (Garga Hora reference)
- Any other named published book, author, or "Source." labeled citation row you find while doing this sweep that fits the same pattern — the list above is what a keyword grep already found, not necessarily exhaustive.

## Keep, unchanged

- The technique/reading description itself.
- Real caveats/usage guidance even if they were sitting in the same block as a citation — e.g. this exact real example from www/index.html's Ashtakavarga footer (search for `Ashtakvarga: Concept and Application` to find it):

  BEFORE:
  ```
  <b>${T('Source.','Fuente.')}</b> ${T('M.S. Mehta (guide/editor K.N. Rao), <i>Ashtakvarga: Concept and Application</i> — ch. II–III (Bhinnāṣṭakavarga construction), ch. VI–VII (interpretation, transit scale), ch. XIV (Sarvāṣṭakavarga). The 56 contributor rules (7 grahas × 8 sources) are transcribed directly and cross-checked against the book's own printed per-planet totals (48/49/39/54/56/52/39) and its stated 337-bindu Sarvāṣṭakavarga constant — both match exactly.', '...(Spanish equivalent)...')}
  ```
  AFTER (remove the whole `<b>Source.</b>` row and its citation sentence — the "56 contributor rules..." sentence IS still citation-flavored provenance-of-numbers content, not a user-facing technique explanation, so this entire row is fair to drop; but if you find a similar row elsewhere where the non-citation sentence is genuinely a caveat a user needs (e.g. "Educational study only — divisional reading multiplies judgment error faster than any other technique when birth time is uncertain"), KEEP that sentence and only remove the naming/edition/chapter clause before it, restitched into a clean standalone sentence).

  A second real example a few lines below the one above (search `Shodhya Piṇḍa`) says `"Not implemented: the source's Shodhya Piṇḍa reduction..."` — this paragraph never names the book, it just says "the source." Leave paragraphs like this as-is; don't go hunting for the word "source" as a generic English word, only strip where a SPECIFIC named text/author is being cited. If removing a preceding named-citation row would leave "the source" reading orphaned/confusing without any book ever named nearby, reword just that phrase minimally (e.g. "the source's Shodhya Piṇḍa reduction" → "the classical method's Shodhya Piṇḍa reduction") — don't delete the whole paragraph, it's real methodological content.

- Example/use-case placeholder names (e.g. "e.g. Rohan, Meera…" in a form hint).
- Non-source names: deity names (Sun/Āditya, etc.), planet/graha names, sign/nakshatra names, any Sanskrit technical terminology — these are the app's actual subject matter, never touch them.

## Editing discipline

For every hit: read the full sentence/row, don't regex-delete just the matched substring. A pure-citation `<b>Source.</b>` row (nothing but book/author/edition/chapter info) → delete the whole row. A row mixing citation with real technique caveat → remove only the naming clause, keep and re-stitch the caveat into clean prose. Never leave a dangling "—", "(", "see ", or orphaned connective. Both `en` and `es` sides of every `T(en, es)` call must be edited consistently (don't fix English and leave the Spanish citation in place, or vice versa).

## Verification (do this yourself before reporting done)

1. Re-grep for each source name above (case-insensitive) across `www/index.html` and confirm remaining hits are ONLY inside `//` or `/* */` code comments (paste the grep output in your report so it can be checked).
2. Re-grep the four research/reference files and confirm zero hits remain there.
3. Run this syntax check from the repo root and confirm it prints `ALL N INLINE SCRIPTS PARSE OK`:
```
node -e "const fs=require('fs');const html=fs.readFileSync('www/index.html','utf8');const re=/<script(?![^>]*src)[^>]*>([\s\S]*?)<\/script>/g;let m,i=0,ok=true;while((m=re.exec(html))){i++;try{new Function(m[1]);}catch(e){ok=false;console.log('script #'+i+' ERROR: '+e.message);}}console.log(ok?'ALL '+i+' INLINE SCRIPTS PARSE OK':'FAIL');"
```
4. Do NOT run `npm install`, `pytest`, Android/Gradle builds, or any other heavy command.
5. Do NOT run `git add`, `git commit`, `git push`. Leave changes unstaged.
6. When done, report `git diff --stat` and a representative sample (5-6 actual before/after hunks, not just a count) so the edits can be spot-checked for grammar/content quality, not just presence/absence of the citation string.
