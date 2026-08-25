Restyle the Pañcha Pakshi Body Map panel in `renderAnatomyPage()` (www/index.html) into a "manuscript plate" layout — figure as centerpiece framed by an inset double-rule border, its data folded into two narrow marginalia columns flanking it, plus a small color-key legend below the figure. This is a LAYOUT/STYLING change only — no new data, no new copy invented, no behavior change.

## Exact scope

Only touch:
1. The `ppBodyHTML` template literal inside `renderAnatomyPage()` — currently at approximately www/index.html:9371-9391 (search for `Pañcha Pakshi Body Map` to find it exactly; line numbers may have drifted).
2. The shared `<style>` block near the top of the file — add new CSS rules there, do not modify any existing rule.

Do NOT touch:
- `renderAnatomyFigure()` — the SVG figure itself is already correct, leave it alone.
- The Deha Chakra panel / `renderBodyGauge()` / `.chakra-wrap` / `.chakra-legend` — that is a completely separate visualization (rashi-based Nectar/Poison/Vitality zones, not body-part zones) with its own legend already. Do not restyle it, do not merge it with the Pañcha Pakshi panel, do not reuse its class names.
- Any other page, panel, or function in this 12,000-line file.

## Current code (for reference — re-read the live file first, this may have drifted slightly)

```js
ppBodyHTML = `<div class="panel"><div class="hd"><h2>${T('Pañcha Pakshi Body Map','Mapa Corporal Pañcha Pakshi')}</h2>
  <span class="note">${ppBirdBadge(ppBird)} · ${panch.paksha==='Shukla'?'Bright Half':'Dark Half'}</span></div>
  <div class="bd" style="display:flex;gap:20px;flex-wrap:wrap;">
    <div style="flex:0;min-width:340px;"><div class="pp-body-svg" style="border:3px solid ${(PP_BIRD_COLORS[ppBird]||{}).hex||'var(--gold)'};border-radius:8px;padding:4px;background:rgba(0,0,0,0.05);">${renderAnatomyFigure({nectarZones:[ncZone], poisonZones:[bodyPartToZone(ppData.poisonPoint||'Lower Back')], activeBird:ppBird, activeBirdZone:hlZone, birdColor:(PP_BIRD_COLORS[ppBird]||{}).hex})}</div></div>
    <div style="flex:1;min-width:200px;">
      <table style="width:100%;font-size:13px;border-collapse:collapse;">
        <tr><td style="padding:6px;color:var(--jade);font-weight:bold;">Nectar:</td><td>${ppData.nectarPoint}</td></tr>
        <tr><td style="padding:6px;color:var(--vermilion);font-weight:bold;">${ppBird} active:</td><td>${ppData.birdPoint}</td></tr>
        <tr><td style="padding:6px;color:var(--muted);">Tithi:</td><td>${panch.paksha} ${panch.tithiName}</td></tr>
      </table>
      <label style="margin-top:10px;font-size:11px;color:var(--muted);">Focus area:</label>
      <label style="margin-top:10px;font-size:11px;color:var(--muted);">Bird view (default: your birth bird):</label>
      <select id="ppBirdSel" onchange="updatePPBodyHighlight(this.value)" style="width:100%;max-width:260px;margin-top:4px;">
        ${['Vulture','Owl','Crow','Cock','Peacock'].map(b=>{
          const cur = getPPBodyPart(b, panch.tithiNum, panch.paksha);
          const sel = b===ppBird ? ' selected' : '';
          return `<option value="${b}"${sel}>${b} — ${cur.birdPoint}</option>`;
        }).join('')}
      </select>
    </div>
  </div></div>`;
```

Note the dangling `<label>Focus area:</label>` has no matching control — it's dead markup. Since you're rewriting this block anyway, drop it; don't preserve dead code.

## New structure to build (same data, new layout)

Three-column composition inside the panel's `.bd`:
- **Left column** (~170px, narrow marginalia): the three data rows — Nectar / `<ppBird>` active / Tithi — as a compact key–value list (small uppercase mono micro-label above, serif value below), replacing the plain `<table>`. Same values as today: `ppData.nectarPoint`, `ppData.birdPoint`, `` `${panch.paksha} ${panch.tithiName}` ``.
- **Center column** (flexible, figure the focal point): `renderAnatomyFigure(...)` — same call/args as today, unchanged — inside a frame with an inset double-rule border effect (an outer 1px border plus an `::before`-style inset border a few px in, both using existing line-color tokens — see CSS below), noticeably larger/more prominent than the current 340px box.
- **Right column** (~200px): the `ppBirdSel` dropdown, id and `onchange="updatePPBodyHighlight(this.value)"` handler UNCHANGED (other code depends on this exact id/handler — do not rename or restructure it), under a small uppercase label reading "Bird view".

Below the three columns, centered: a small horizontal legend row with three dot+label chips:
- teal dot (`#48C98C`) — label "Nectar point"
- dark-brown dot (`#5C3A21`) — label "Poison point"
- gold dot (`#D4AF37`) — label "Active zone"

Call this legend something that won't be confused with the Deha Chakra panel's own Nectar/Poison legend above it on the same page (that one is about zodiac-sign zones; this one is about body-part zones) — e.g. a small caption above the dots reading "Body zone key" (translate via `T()` same as everything else on this page).

**Bilingual requirement — this app is fully English/Spanish via a `T('English text','Spanish text')` helper used throughout the file.** Every new piece of user-facing text you introduce (column micro-labels, the "Bird view" label, the legend caption, the three legend chip labels) MUST go through `T(...)` with a real Spanish translation, exactly like every other string in this function already does. Do not ship English-only strings.

## New CSS to add (once, in the shared `<style>` block — pick sensible existing conventions to sit near, e.g. after the `.pp-body-svg` rule if one exists, or near `.panel`/`.chakra-wrap`)

Use the app's real design tokens (`var(--line)`, `var(--line-soft)`, `var(--slate)`, `var(--mono)`, `var(--serif)`, `var(--radius-sm)`, `var(--ink)`, `var(--ink-dim)`) — do not hardcode hex colors for anything that already has a token, EXCEPT the three legend dot colors themselves (`#48C98C`, `#5C3A21`, `#D4AF37`), which are literal zone-marker colors matching `renderAnatomyFigure`'s own marker colors and are not tokenized elsewhere in the app.

Introduce new class names prefixed `pp-plate-*` (e.g. `.pp-plate`, `.pp-plate-cols`, `.pp-plate-marginalia`, `.pp-plate-figure`, `.pp-plate-legend`) so nothing collides with existing classes. Roughly:

- `.pp-plate`: `position:relative; padding:22px;` (this replaces the plain `.bd` padding for this panel only — apply it as an extra class alongside `bd`, e.g. `<div class="bd pp-plate">`).
- `.pp-plate::before`: `content:""; position:absolute; inset:8px; border:1px solid var(--line-soft); border-radius:6px; pointer-events:none;` — the inset double-rule frame.
- `.pp-plate-cols`: `display:flex; gap:20px; align-items:center; position:relative; z-index:1; flex-wrap:wrap;`
- `.pp-plate-marginalia`: `flex:0 0 170px; font-size:11.5px;` with a `.m-label` child style: `font-family:var(--mono); font-size:9px; letter-spacing:0.08em; text-transform:uppercase; color:var(--slate); margin-bottom:2px;` and enough spacing between the three rows (`margin-bottom:12px` per row, last one `0`).
- `.pp-plate-figure`: `flex:1; min-width:260px; display:flex; justify-content:center;`
- `.pp-plate-legend`: `display:flex; justify-content:center; gap:18px; margin-top:16px; position:relative; z-index:1; flex-wrap:wrap; font-family:var(--mono); font-size:9.5px; letter-spacing:0.06em; text-transform:uppercase; color:var(--slate);` with a small `.dot` child: `width:8px;height:8px;border-radius:50%;display:inline-block;margin-right:5px;vertical-align:middle;`

On narrow viewports this should still degrade reasonably (it already sits inside `flex-wrap:wrap` at the panel level and the app has a `@media (max-width:760px)` breakpoint elsewhere for reference) — the marginalia columns can wrap below the figure on small screens rather than needing a bespoke breakpoint; don't over-engineer this.

## Verification (do this yourself before reporting done)

1. Run this syntax check from the repo root and confirm it prints `ALL N INLINE SCRIPTS PARSE OK`:
```
node -e "const fs=require('fs');const html=fs.readFileSync('www/index.html','utf8');const re=/<script(?![^>]*src)[^>]*>([\s\S]*?)<\/script>/g;let m,i=0,ok=true;while((m=re.exec(html))){i++;try{new Function(m[1]);}catch(e){ok=false;console.log('script #'+i+' ERROR: '+e.message);}}console.log(ok?'ALL '+i+' INLINE SCRIPTS PARSE OK':'FAIL');"
```
2. Do NOT run `npm install`, `pytest`, Android/Gradle builds, or any other heavy command — not needed for a static HTML change.
3. Do NOT run `git add`, `git commit`, `git push`, or any git write operation. Leave changes unstaged. Do not touch any file other than `www/index.html`.
4. When done, print `git diff --stat` to prove only `www/index.html` changed, and a short summary of what you changed.
