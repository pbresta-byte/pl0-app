---
name: remove-source
description: Strip named source-book/author citations (e.g. "BPHS ch.24 v.9", "Pulippani & Rao 1993", "Satya Jatakam", "M.S. Mehta (guide/editor K.N. Rao)") from user-facing app content, keeping the technique/reading description and any real caveats intact. Use when the user says "remove source material mentions," "strip citations," or names a specific source (e.g. "just like X was also mentioned") they spotted in the live app or in the project's research/knowledge files.
---

# Remove Source

This project's convention: readings and techniques stay, book/author attribution to a specific published or classical source text does not — unless the user explicitly widens or narrows that split for a given request.

## Scope, by default

Ask (or infer from the user's own wording, e.g. "just the live app" vs. "research files too") which of these apply — don't assume both without a signal:

1. **Live, user-facing app content** — text inside `T(en, es)` calls, template-literal HTML, `<summary>`/`<b>` labels, anything a user actually sees when running the app. This is almost always in scope when the user says "remove source mentions" about something they saw *in the app*.
2. **Research/reference files** — `domains/*.md` corpus notes, standalone draft `.js` files not wired into `www/index.html` via a `<script src>`. Only in scope if the user says so explicitly — these are the project owner's own curated research corpus, not shipped content, and stripping citations there loses real provenance they may still want for their own reference.

**Never touch, unless the user says otherwise:** JS code comments (`// ...`) explaining classical basis for a formula — these are dev-facing documentation, not something an app user ever sees, and removing them doesn't serve "remove source *mentions*" in any user-visible sense.

## What "citation" means here

Strip: the name of a published or classical text, its author(s)/editor(s), edition/year, and chapter/verse locators when they're naming *where a claim comes from* (e.g. "(BPHS ch.24 v.9)", "M.S. Mehta (guide/editor K.N. Rao), *Ashtakvarga: Concept and Application* — ch. II–III", "Source. Pulippani & Rao 1993 p.53").

**Learned 2026-08-25: chapter/verse/page locators are in scope even when no named author accompanies them.** A bare `Ch. XLI śl.2`, `ch. 4 p.102-105`, `v.9`, or the word "verse" itself pointing at a classical text still names *where a claim comes from* — strip it the same way, whether or not a specific author/book title sits next to it in that sentence. This app has shipped large sweeps that only targeted specific named sources (BPHS, Pulippani & Rao, Satya Jatakam, M.S. Mehta) and left dozens of bare chapter/śloka/page locators from other classical texts untouched — re-grep broadly (`ch\.`, `śl\.`, `\bv\.[0-9]`, `\bverse\b`, `shloka`, `sloka`) rather than only the named-source list the user happened to mention, unless they explicitly scope the request to those names.

Keep:
- The technique/reading description itself — what the reading says, not who said it first.
- Real caveats and usage guidance that happen to sit in the same block as a citation (e.g. "Educational study only — divisional reading multiplies judgment error faster than any other technique when birth time is uncertain" is substantive content, not citation — keep it even if it was in the same `<b>Source.</b>` row as a citation you're removing).
- Example/use-case names (e.g. "e.g. Rohan, Meera…" placeholder text in a form).
- Non-source people's names — deities, planets/grahas, and any other name that isn't standing in for "this is where the claim comes from."
- Classical *terminology* (Sanskrit technical terms, sign/nakshatra/graha names) — that's the app's actual subject matter, not a citation.

## How to do the edit

For each hit, don't blindly delete the matched substring — read the surrounding sentence and rewrite it so it reads naturally with the citation gone. A `<b>Source.</b>` row that is *purely* citation (name, author, edition — nothing else) can be removed as a whole row; a row that mixes citation with real caveat content needs the citation clause removed and the caveat kept, restitched into a clean sentence. Never leave a dangling connective, parenthesis, or "see —" with nothing after it.

## Execution

This is usually a large sweep (dozens of hits across a big single-file app) — appropriate to hand to Hermes → OpenCode rather than editing every hit by hand:
1. Grep the actual source names/authors involved (ask the user which ones, or use what they named) across the in-scope files first, to size the sweep and separate rendered-string hits from code-comment hits.
2. Write a task spec (matching this project's `_opencode_taskN.md` convention) that: lists the exact source names in scope, gives 2-3 real before/after examples pulled from the actual grep output (a pure-citation row vs. a mixed citation+caveat row), states the guardrails above explicitly, and requires the syntax-check command this project already uses.
3. After the run: re-grep the same source names to confirm they're gone from in-scope files (and still present, untouched, in out-of-scope ones like code comments if those were excluded); read a representative sample of the actual diff hunks — not just the stat — to catch mangled grammar or lost caveats; run the syntax check.
4. Commit, push, and — if this project's Android APK release convention applies — cut a new tagged release with the built APK attached (see the most recent `vX.Y` release for the pattern: title, body summarizing what changed, `app-debug.apk` from the matching workflow run).
