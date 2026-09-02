# Archived: "Gold — Isolated Deep Dive" panel (Commodity Signals page)

Removed from `www/index.html` on 2026-09-02 at the user's request ("remove this section
completely; but archive this calculation/set up somewhere"). It lived in the Commodity
Signals page render function, immediately after the page-intro panel and immediately
before the "Oil — Isolated Deep Dive" panel (which was kept), wrapped in
`<div class="panel" style="border-color:var(--gold-dim);">`.

Restoring: paste the block below back into `www/index.html` right after the page-intro
`.panel` in the Commodity Signals render (search for `Oil — Isolated Deep Dive` — this
block goes immediately before it) and re-verify `live.rows`, `live.sunSign`,
`GOLD_WEEKDAY_RULE`, `live.goldAntara`, `GOLD_BOTANICAL_OMENS`, `goldSeason`, `goldBT`,
`seasonalityHtml()`, `backtestSectionHtml()`, `riskNoteHtml()`, and `gName()` still exist
with the same shapes — this app evolves fast and any of those could have moved or changed
since this archive was made.

## What it did

Gathered every gold-specific rule from the Bṛhat Saṁhitā chapters this page draws on into
one place (rather than the shared per-commodity table everything else uses), checked live
against the current chart where the source rule allows it:

1. **Which sign governs it right now** — Aries/Capricorn rulership rows, tagged with
   Venus flourish/perish-risk and any malefic flourish/scarce-and-dear hits.
2. **This month's storage rule** — active only when the Sun transits Leo (the rule also
   names gems, leather, armour, weapons, pearls, silver): store now, resell in exactly the
   5th month for profit; earlier/later brings loss. Paired with an empirical seasonality
   check (177 five-month windows, 182mo gold history) that found Nov/Sep/Dec actually the
   best months to have bought-and-held, with the source's own named month (Aug) reading
   only slightly above the any-month baseline (+3.53% vs +3.32%, 46.7% vs 62.1% win rate) —
   disclosed as a real caveat on the classical rule, not smoothed over.
3. **Today's weekday** — Sunday/Tuesday/Thursday favoured for gold-related work, with a
   disclosed caveat that Sunday's clause is further conditioned on the Sun's position
   relative to the Ascendant (Upachaya house or the rising sign itself), which this
   location-independent page deliberately does not check.
4. **Antara Chakra cross-reference** — live state of the 3 (of 32) Antara Chakra points
   that specifically name gold: Kośādhyakṣa (E), Southeast, Vivastra Strī (SE).
5. **Botanical omens** — reference-only list (`GOLD_BOTANICAL_OMENS`), explicitly not live
   since it needs a real-world observation (which of two specific trees is blossoming) the
   app has no way to make.

Then a backtest section (`backtestSectionHtml(goldBT, 'XAU/gold', 'oro (XAU)', 'gold',
'el oro')`) and the shared risk-disclaimer note (`riskNoteHtml()`).

## Full removed block (verbatim, both `en`/`es` `T(...)` sides intact)

```html
    <div class="panel" style="border-color:var(--gold-dim);">
      <div class="hd"><h2>${T('Gold — Isolated Deep Dive','Oro — Análisis aislado')}</h2><span class="note">${T('every gold-specific rule on this page, gathered in one place','cada regla específica sobre el oro de esta página, reunida en un solo lugar')}</span></div>
      <div class="bd">
        <div class="hint" style="margin-bottom:12px;">${T('Gold is named more than any other single commodity across these chapters of Bṛhat Saṁhitā. Below is every place it\'s specifically called out — not just the sign-rulership line it shares with everything else — pulled together and, where the rule allows it, checked live.','El oro se menciona más que cualquier otra materia prima en estos capítulos del Bṛhat Saṁhitā. Abajo está cada lugar donde se le nombra específicamente — no solo la línea de gobierno de signo que comparte con todo lo demás — reunido y, donde la regla lo permite, comprobado en vivo.')}</div>

        ${(()=>{
          const ariesRow = live.rows.find(r=>r.sign==='Aries');
          const capRow = live.rows.find(r=>r.sign==='Capricorn');
          const signTag = r => {
            const vTag = `<span class="tag ${r.venusVerdict==='flourish'?'good':'bad'}">${gName('Venus')}: ${r.venusVerdict==='flourish' ? T('flourish','abundancia') : T('perish-risk','riesgo de escasez')}</span>`;
            const mTags = [
              r.maleficsFlourish.length ? `<span class="tag good">${r.maleficsFlourish.map(gName).join('/')} → ${T('flourish','abundancia')}</span>` : '',
              r.maleficsScarce.length ? `<span class="tag bad">${r.maleficsScarce.map(gName).join('/')} → ${T('scarce &amp; dear','escaso y caro')}</span>` : ''
            ].filter(Boolean).join(' ');
            return `${vTag} ${mTags}`;
          };
          return `
        <h3 style="margin:0 0 6px; font-size:12px; letter-spacing:0.03em; color:var(--gold); text-transform:uppercase;">${T('1 · Which sign governs it, right now','1 · Qué signo lo gobierna, ahora mismo')}</h3>
        <div class="kv" style="margin-bottom:4px;"><div class="k">Aries</div><div class="v">${signTag(ariesRow)}</div></div>
        <div class="kv" style="margin-bottom:10px;"><div class="k">Capricorn</div><div class="v">${signTag(capRow)}</div></div>

        <h3 style="margin:14px 0 6px; font-size:12px; letter-spacing:0.03em; color:var(--gold); text-transform:uppercase;">${T('2 · This month\'s storage rule','2 · La regla de almacenamiento de este mes')}</h3>
        ${live.sunSign==='Leo' ? `
          <div class="kv"><div class="k">${T('Sun in','Sol en')}</div><div class="v"><span class="tag good">Leo — ${T('rule active','regla activa')}</span></div></div>
          <div class="hint" style="margin-top:6px;">${T('Gold is named specifically only when the Sun transits Leo (alongside gems, leather, armour, weapons, pearls and silver): store now, resell in exactly the 5th month for much profit — earlier or later brings loss. Still conditioned on a portent this app can\'t detect (see the trading-guidance panel below).','El oro se nombra específicamente solo cuando el Sol transita Leo (junto a gemas, cuero, armadura, armas, perlas y plata): almacena ahora, revende exactamente en el 5.º mes para obtener mucha ganancia — antes o después trae pérdida. Sigue condicionado a un presagio que esta app no puede detectar (ver el panel de guía comercial abajo).')}</div>
        ` : `
          <div class="kv"><div class="k">${T('Sun in','Sol en')}</div><div class="v"><span class="tag neutral">${T(live.sunSign,live.sunSign)} — ${T('not active','no activa')}</span></div></div>
          <div class="hint" style="margin-top:6px;">${T('This rule only names gold when the Sun is in Leo. Not the case right now.','Esta regla solo nombra el oro cuando el Sol está en Leo. No es el caso ahora mismo.')}</div>
        `}
        ${seasonalityHtml(goldSeason, 8, 5, 'gold, 182mo history', 'oro, historial de 182 meses')}`;
        })()}

        <h3 style="margin:16px 0 6px; font-size:12px; letter-spacing:0.03em; color:var(--gold); text-transform:uppercase;">${T('3 · Today\'s weekday','3 · El día de la semana de hoy')}</h3>
        ${(()=>{
          const rule = GOLD_WEEKDAY_RULE[live.weekday];
          const dayEs = {Sunday:'domingo',Monday:'lunes',Tuesday:'martes',Wednesday:'miércoles',Thursday:'jueves',Friday:'viernes',Saturday:'sábado'}[live.weekday];
          return rule ? `
          <div class="kv"><div class="k">${T('Today is','Hoy es')}</div><div class="v"><span class="tag good">${T(live.weekday,dayEs)} — ${T('favoured for gold','favorable para el oro')}</span></div></div>
          <div class="hint" style="margin-top:6px;">${T(rule.en,rule.es)}</div>
        ` : `
          <div class="kv"><div class="k">${T('Today is','Hoy es')}</div><div class="v"><span class="tag neutral">${T(live.weekday,dayEs)} — ${T('not one of the named days','no es uno de los días nombrados')}</span></div></div>
          <div class="hint" style="margin-top:6px;">${T('Sunday, Tuesday and Thursday are named for gold-related work. Today is not one of those.','Domingo, martes y jueves están nombrados para el trabajo relacionado con el oro. Hoy no es uno de esos días.')}</div>
        `;
        })()}
        <div class="hint" style="margin-top:6px; font-style:italic;">${T('Sunday\'s clause is further conditioned on the Sun\'s position relative to the Ascendant (an Upachaya house, or the rising sign itself) — this page is deliberately location-independent, like the Pañcha Pakshi panel, so that extra check isn\'t made here.','La cláusula del domingo está además condicionada a la posición del Sol respecto al Ascendente (una casa Upachaya, o el propio signo ascendente) — esta página es deliberadamente independiente de la ubicación, como el panel de Pañcha Pakshi, así que esa comprobación adicional no se hace aquí.')}</div>

        <h3 style="margin:16px 0 6px; font-size:12px; letter-spacing:0.03em; color:var(--gold); text-transform:uppercase;">${T('4 · Antara Chakra cross-reference','4 · Referencia cruzada del Antara Chakra')}</h3>
        ${(()=>{
          const stateTag = (state, goodTxt, goodTxtEs, badTxt, badTxtEs) => {
            if (state==='Santa') return goodTxt ? `<span class="tag good">Śānta — ${T(goodTxt,goodTxtEs)}</span>` : `<span class="tag neutral">Śānta — ${T('no gold reading on this side of this point','sin lectura de oro en este lado de este punto')}</span>`;
            return badTxt ? `<span class="tag bad">${state} — ${T(badTxt,badTxtEs)}</span>` : `<span class="tag neutral">${state} — ${T('no gold reading on this side of this point','sin lectura de oro en este lado de este punto')}</span>`;
          };
          return `
        <div class="kv" style="margin-bottom:4px;"><div class="k">Kośādhyakṣa (E)</div><div class="v">${stateTag(live.goldAntara.kosadhyaksha, 'gain of gold and of a desired object','ganancia de oro y de un objeto deseado', 'injury to gold and suffering to goldsmiths','daño al oro y sufrimiento para los orfebres')}</div></div>
        <div class="kv" style="margin-bottom:4px;"><div class="k">${T('Southeast','Sureste')}</div><div class="v">${stateTag(live.goldAntara.southeast, 'gain of gold and metals','ganancia de oro y metales', null, null)}</div></div>
        <div class="kv"><div class="k">Vivastra Strī (SE)</div><div class="v">${stateTag(live.goldAntara.vivastraStri, null, null, 'death of dealers in gold and of sculptors','muerte de comerciantes de oro y de escultores')}</div></div>
        <div class="hint" style="margin-top:8px;">${T('These are three of the 32 Antara Chakra points, live right now, cross-referenced here because they\'re the only ones that specifically name gold. See the Antara Chakra page for the full wheel.','Estos son tres de los 32 puntos del Antara Chakra, en vivo ahora mismo, referenciados aquí porque son los únicos que nombran específicamente el oro. Ver la página del Antara Chakra para la rueda completa.')}</div>`;
        })()}

        <h3 style="margin:16px 0 6px; font-size:12px; letter-spacing:0.03em; color:var(--gold); text-transform:uppercase;">${T('5 · Botanical omens (reference only, not live)','5 · Presagios botánicos (solo referencia, no en vivo)')}</h3>
        <ul style="margin:4px 0 0; padding-left:20px; font-size:12.5px; color:var(--ink-dim);">
          ${GOLD_BOTANICAL_OMENS.map(o=>`<li style="margin-bottom:4px;">${T(o.en,o.es)}</li>`).join('')}
        </ul>
        <div class="hint" style="margin-top:6px;">${T('These need a real-world botanical observation (which of two specific trees is currently blossoming) that this app has no way to make — shown for completeness, not as a signal.','Estos necesitan una observación botánica real (cuál de dos árboles específicos está floreciendo actualmente) que esta app no puede hacer — se muestran por completitud, no como señal.')}</div>

        ${backtestSectionHtml(goldBT, 'XAU/gold', 'oro (XAU)', 'gold', 'el oro')}
        ${riskNoteHtml()}
      </div>
    </div>
```

Note: `GOLD_WEEKDAY_RULE` and `GOLD_BOTANICAL_OMENS` (the data constants this block reads)
were **not** removed from the JS — only this rendering block was. If they turn out to be
unused elsewhere after this removal, that's a separate, later cleanup, not done here.
