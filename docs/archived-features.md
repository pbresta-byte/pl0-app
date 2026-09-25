# Archived features

Pages and panels taken out of the app's menu or layout while PL0 refocuses on auspicious timing. Nothing here is deleted: the code stays in `www/index.html`, so each item can be revamped and brought back. Each entry says what it is, where it lives, and how to restore it.

| Item | Archived | What it is | Where the code is | To restore |
|---|---|---|---|---|
| **Tarot** page | 2026-09-23 | Pañcha-tarot "Western × Jyotish shadow read" | `<div id="pageTarot">` and its render function; menu button commented out in the hamburger list | Uncomment the `pageTarot` button in the menu list |
| **World Era** page | 2026-09-22 | Saptarṣi Nakṣatra (natal), Saptarṣi world-era daśā with history table, star reading and birth-star card | `renderNakshatraPage()`, `<div id="pageNakshatra">`; menu button commented out | Uncomment the `pageNakshatra` button. The Jupiter (Bṛhaspati) cycles box moved to the Daśā page (`renderJupiterCyclesPanel()`) |
| **House Lord Results** panel (General page) | 2026-09-22 | House picker showing the sign, its lord, the lord's house, dignity and kendra/trikona status | `houseLordPanel` is still built in `renderNatalPage()`, just no longer placed in the page | Add `${houseLordPanel}` back into the General page template |
| **Classical Mahādaśā effects** box (Daśā page) | 2026-09-22 | Fixed general and dignity-branch effect texts for the running Mahādaśā lord | `mahadashaClassicalReading()` and its data remain; the rendering block was removed | Superseded by the zoomable Daśā reading; re-render from `mahadashaClassicalReading(lord, birthPos)` if wanted |
| **Transit check** table (Ashtakavarga page) | 2026-09-22 | Per-planet bindu table with a boilerplate reading line per planet | Replaced by `renderTransitPanel()`; `ashtakavargaTransitReading()` remains | Superseded; the per-planet reading text is still available from that function |

## Planned moves (not archived, kept in the app)

When the menu is regrouped into Timing / Life periods / Chart study / Other (see the scope review draft), these move rather than disappear:

- **Anatomy** page → Chart study.
- **Relocation** panel (General) → Chart study ▸ Tools.
- **Seven sign daśās** → already collapsed into one "Sign daśās" block on the Daśā page (2026-09-23).
