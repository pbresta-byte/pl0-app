# PL0 — Proposed new features (draft, from corpus research)

## A. From the additional classics now ingested

1. **Hora-quality day strip** — extend the calendar's half-day swatches to 24 hora
   cells colored by hora-lord semantics (R22): Jupiter/Venus/Moon horas green,
   Saturn/Mars/Sun red, Mercury neutral. Source: Kalaprakasika L9109.
2. **Siddha-Yoga day badges** — flag calendar days that hit any Siddha table
   (R13/R14/R15) with a gold ★; Visha/Vinasa days get a ✕. Cheap lookup, high
   user-visible value.
3. **Shave/nail-care micro-muhurta** (R30) — the app already has shaving tables
   in BS sections; add the composite rule (Sat/Tue/Sun + Rikta + Vishti + 9th-day).
4. **Garga Hora 12-houses panel** — Garga's house-by-house significations
   (Santhanam trans.) as a reference tab feeding the natal page.
5. **Varga chakra deep-dive** (S. Rath) — extend the existing divisional-chart
   work with Rath's varga significations; pair with Raj Kumar's *Vargas*.
6. **Curse/malediction detector** (Marc Boney) — Parasara curse combinations
   (serpent curse etc.) as a natal-page checklist.
7. **Kashyapa/Skanda Hora nadi rules** (R.G. Rao / Sreenadh) — rare-hora nadi
   aphorisms; good candidates for a "classical quote of the day" feature tied
   to the current transit.
8. **KP birth-time rectification helper** — sub-lord based rectification wizard
   using the KP books' method.
9. **Prashna Hora expansion** (Satyanarayana Naik) — deepen the existing horary
   page with classical+nadi prashna techniques.

## B. Feature ideas from system gaps

10. **Panchaka-tithi Gandanta precision** (R29) — needs tithi elapsed fraction;
    engine already computes it, just surface a warning band.
11. **Neutralization layer** (R12/R23/R28) — benefics-in-quadrant cancellation:
    requires election-chart lagna (already computed) — implement as penalty gates.
12. **Muhurta score explanation export** — one-tap "why this moment" markdown/PDF
    share sheet from the reasons list.
13. **Corpus-grounded citations inline** — each reason line already cites its
    source in code comments; render source+chapter in a collapsible detail view.
14. **Agent push notifications** — the MCP bridge can let Claude/Hermes run daily
    muhurta briefs and deliver them via Hermes' messaging channels.
