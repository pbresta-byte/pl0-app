/* PL0 Options page: (1) the calculation options that apply everywhere, (2) alert (notification) settings and scheduling,
   (3) a directory of options that live on their own pages. Loaded after the main script; uses its globals (T, showPage,
   runAnalysis, NOW_SCAN, NAK27, LANG). Everything saves to localStorage on this device. No network use. */
(function(){
  'use strict';
  var CALC_KEY = 'pl0CalcOpts', ALERT_KEY = 'pl0AlertPrefs';
  var CALC_IDS = ['ayanamsaMode', 'showAbhijit', 'weighTara', 'weighPP', 'weighDignity', 'weighMuhurtaDosha'];
  var CALC_DEFAULTS = { ayanamsaMode: 'lahiri', showAbhijit: true, weighTara: true, weighPP: true, weighDignity: true, weighMuhurtaDosha: true };
  var GRAHAS = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];
  var GRAHA_ES = { Sun: 'Sol', Moon: 'Luna', Mars: 'Marte', Mercury: 'Mercurio', Jupiter: 'Júpiter', Venus: 'Venus', Saturn: 'Saturno', Rahu: 'Rāhu', Ketu: 'Ketu' };
  var HORA_LORDS = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];

  function tr(en, es){ return (typeof T === 'function') ? T(en, es) : en; }
  function el(id){ return document.getElementById(id); }
  function load(key, dflt){ try { var s = JSON.parse(localStorage.getItem(key) || 'null'); return s && typeof s === 'object' ? s : dflt; } catch (e) { return dflt; } }
  function save(key, v){ try { localStorage.setItem(key, JSON.stringify(v)); } catch (e) {} }

  /* ---------- (1) calculation options: persistence for the controls that moved here ---------- */
  function readCalc(){
    var o = {};
    CALC_IDS.forEach(function(id){ var c = el(id); if (!c) return; o[id] = (c.type === 'checkbox') ? c.checked : c.value; });
    return o;
  }
  function applyCalc(o){
    CALC_IDS.forEach(function(id){ var c = el(id); if (!c || !(id in o)) return; if (c.type === 'checkbox') c.checked = !!o[id]; else c.value = o[id]; });
  }
  function restoreCalc(){
    var saved = load(CALC_KEY, null); if (!saved) return false;
    var before = JSON.stringify(readCalc()); applyCalc(saved);
    return before !== JSON.stringify(readCalc());
  }
  function recompute(){ try { if (typeof runAnalysis === 'function') runAnalysis(); } catch (e) {} }
  function bindCalc(){
    CALC_IDS.forEach(function(id){
      var c = el(id); if (!c || c.dataset.optBound) return; c.dataset.optBound = '1';
      c.addEventListener('change', function(){ save(CALC_KEY, readCalc()); recompute(); });
    });
    var rb = el('optionsResetBtn');
    if (rb && !rb.dataset.optBound){ rb.dataset.optBound = '1'; rb.addEventListener('click', function(){ applyCalc(CALC_DEFAULTS); save(CALC_KEY, readCalc()); recompute(); }); }
  }

  /* ---------- (3) directory of options that stay on their own pages ---------- */
  var ELSEWHERE = [
    ['pageDasha', 'Daśā options (Vimśottari year length, balance at birth, seed, chart to read)', 'Opciones de daśā (largo del año, saldo al nacer, punto de partida, carta)'],
    ['pageAltDasha', 'Alternative daśā systems and their conditions', 'Sistemas de daśā alternativos y sus condiciones'],
    ['pageNatal', 'Yoga reading options, Shadbala thresholds and the standout viewer', 'Opciones de lectura de yoga, umbrales de Shadbala y el visor de destacados'],
    ['pageHouseNature', 'Varga rules (D30, D60, D2 conventions)', 'Reglas de varga (convenciones de D30, D60, D2)'],
    ['pageMuhurta', 'Score rules on At a Glance (dignity weighting, Latta, electional cap)', 'Reglas de puntuación en Ahora (peso de dignidad, Latta, tope electivo)']
  ];
  function renderElsewhere(){
    var box = el('optionsElsewhere'); if (!box) return;
    box.innerHTML = '<fieldset><legend>' + tr('Options that live with their pages', 'Opciones que viven en su página') + '</legend>' +
      '<div class="hint" style="margin-bottom:8px;">' + tr('These depend on the topic they belong to, so they stay there.', 'Dependen del tema al que pertenecen, por eso se quedan allí.') + '</div>' +
      ELSEWHERE.map(function(r){ return '<button type="button" class="tag neutral" style="cursor:pointer; display:block; text-align:left; margin:0 0 6px; white-space:normal;" data-go="' + r[0] + '">' + tr(r[1], r[2]) + ' &rarr;</button>'; }).join('') +
      '</fieldset>';
    box.querySelectorAll('[data-go]').forEach(function(b){ b.addEventListener('click', function(){ showPage(b.getAttribute('data-go')); }); });
  }

  /* ---------- (2) alerts ---------- */
  function defaultAlertPrefs(){
    if (window.PL0Alerts && PL0Alerts.defaultPrefs) return PL0Alerts.defaultPrefs();
    return { enabled: false, horizonDays: 3, hora: { mode: 'off', lords: ['Jupiter', 'Venus'] }, tithi: { on: true, only: 'special' },
      nakshatra: { on: false, only: 'all', list: [] }, transits: { on: false, grahas: ['Jupiter', 'Saturn', 'Rahu', 'Ketu'], stations: false },
      pp: { on: false }, peakLow: { on: true, peak: true, low: true }, quiet: { on: false, from: '22:00', to: '06:00' } };
  }
  function alertPrefs(){
    var d = defaultAlertPrefs(), s = load(ALERT_KEY, {});
    var out = {}; Object.keys(d).forEach(function(k){
      out[k] = (d[k] && typeof d[k] === 'object' && !Array.isArray(d[k])) ? Object.assign({}, d[k], s[k] || {}) : (k in s ? s[k] : d[k]);
    });
    return out;
  }
  function saveAlertPrefs(p){ save(ALERT_KEY, p); }

  function plugin(){ try { return window.Capacitor && Capacitor.Plugins && Capacitor.Plugins.LocalNotifications || null; } catch (e) { return null; } }
  function isNative(){ try { return !!(window.Capacitor && Capacitor.isNativePlatform && Capacitor.isNativePlatform()); } catch (e) { return false; } }

  function buildCtx(){
    var o = (typeof NOW_SCAN !== 'undefined' && NOW_SCAN && NOW_SCAN.opts) ? NOW_SCAN.opts : null;
    if (!o) return null;
    return { lat: o.lat, lon: o.lon, tz: o.tz, ayanamsaMode: o.ayanamsaMode, refP: o.refP, scoreOpts: o, lang: (typeof LANG !== 'undefined' ? LANG : 'en') };
  }
  function computeAlerts(){
    if (!(window.PL0Alerts && PL0Alerts.compute)) return { error: tr('The alert engine is not loaded in this build.', 'El motor de alertas no está cargado en esta versión.') };
    var ctx = buildCtx();
    if (!ctx){ recompute(); ctx = buildCtx(); }
    if (!ctx) return { error: tr('Add your birth data and place on At a Glance first, so alerts can be personal.', 'Primero agrega tus datos de nacimiento y lugar en Ahora, para que las alertas sean personales.') };
    var p = alertPrefs();
    try { return { alerts: PL0Alerts.compute({ startMs: Date.now(), days: p.horizonDays || 3, prefs: p, ctx: ctx }) }; }
    catch (e) { return { error: tr('Could not compute alerts: ', 'No se pudieron calcular las alertas: ') + e.message }; }
  }
  function hashId(s){ var h = 2166136261; for (var i = 0; i < s.length; i++){ h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return (h >>> 0) % 2147483000 + 1; }
  function fmtWhen(ms){
    var d = new Date(ms), days = tr('Sun,Mon,Tue,Wed,Thu,Fri,Sat', 'dom,lun,mar,mié,jue,vie,sáb').split(',');
    return days[d.getDay()] + ' ' + (d.getMonth() + 1) + '/' + d.getDate() + ' ' + ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2);
  }
  function setStatus(msg){ var s = el('alertStatus'); if (s) s.textContent = msg; }

  function scheduleAlerts(){
    var LN = plugin();
    if (!LN || !isNative()){ setStatus(tr('Scheduling works in the installed Android app. Here you can preview what would be scheduled.', 'La programación funciona en la app instalada de Android. Aquí puedes ver una vista previa.')); return Promise.resolve(false); }
    var p = alertPrefs(); if (!p.enabled){ return cancelAll().then(function(){ setStatus(tr('Alerts are off. Nothing is scheduled.', 'Las alertas están apagadas. No hay nada programado.')); return false; }); }
    var r = computeAlerts(); if (r.error){ setStatus(r.error); return Promise.resolve(false); }
    return LN.checkPermissions().then(function(perm){
      return perm.display === 'granted' ? perm : LN.requestPermissions();
    }).then(function(perm){
      if (perm.display !== 'granted'){ setStatus(tr('Notification permission was not granted. Turn it on in the phone settings to receive alerts.', 'No se concedió el permiso de notificaciones. Actívalo en los ajustes del teléfono para recibir alertas.')); return false; }
      return Promise.resolve(LN.createChannel ? LN.createChannel({ id: 'pl0-alerts', name: 'PL0 alerts', description: 'Timing alerts', importance: 4, visibility: 1, vibration: true }) : null)
        .catch(function(){}).then(function(){ return cancelAll(); }).then(function(){
          var now = Date.now(), list = r.alerts.filter(function(a){ return a.atMs > now + 5000; }).map(function(a){
            return { id: hashId(a.id), title: a.title, body: a.body, channelId: 'pl0-alerts', schedule: { at: new Date(a.atMs), allowWhileIdle: true } };
          });
          var horizonEnd = now + (p.horizonDays || 3) * 86400000;
          list.push({ id: hashId('refresh' + horizonEnd), title: tr('PL0: open the app to refresh your alerts', 'PL0: abre la app para renovar tus alertas'),
            body: tr('Your scheduled alerts are running out.', 'Tus alertas programadas se están acabando.'), channelId: 'pl0-alerts', schedule: { at: new Date(horizonEnd - 3600000), allowWhileIdle: true } });
          return LN.schedule({ notifications: list }).then(function(){
            setStatus(tr('Scheduled ', 'Programadas ') + list.length + tr(' alerts through ', ' alertas hasta ') + fmtWhen(horizonEnd) + '.');
            try { localStorage.setItem('pl0AlertsScheduledAt', String(now)); } catch (e) {}
            return true;
          });
        });
    }).catch(function(e){ setStatus(tr('Could not schedule: ', 'No se pudo programar: ') + (e && e.message || e)); return false; });
  }
  function cancelAll(){
    var LN = plugin(); if (!LN) return Promise.resolve();
    return LN.getPending().then(function(r){ return (r.notifications && r.notifications.length) ? LN.cancel({ notifications: r.notifications.map(function(n){ return { id: n.id }; }) }) : null; }).catch(function(){});
  }
  function preview(){
    var r = computeAlerts(), box = el('alertPreview'); if (!box) return;
    if (r.error){ box.innerHTML = '<div class="hint">' + r.error + '</div>'; return; }
    var a = r.alerts; if (!a.length){ box.innerHTML = '<div class="hint">' + tr('No alerts fall in the next days with these settings.', 'Ninguna alerta cae en los próximos días con estos ajustes.') + '</div>'; return; }
    box.innerHTML = '<div style="font-size:12px; color:var(--muted); margin:8px 0 4px;">' + a.length + tr(' alerts in the next ', ' alertas en los próximos ') + (alertPrefs().horizonDays || 3) + tr(' days', ' días') + '</div>' +
      a.slice(0, 14).map(function(x){ return '<div style="border-left:2px solid var(--line); padding:2px 0 2px 8px; margin:0 0 6px; font-size:12.5px;"><span style="color:var(--muted);">' + fmtWhen(x.atMs) + '</span> &nbsp;<b>' + x.title + '</b><br>' + x.body + '</div>'; }).join('') +
      (a.length > 14 ? '<div class="hint">' + tr('...and ', '...y ') + (a.length - 14) + tr(' more', ' más') + '</div>' : '');
  }
  function testNow(){
    var LN = plugin();
    if (LN && isNative()){
      LN.checkPermissions().then(function(p){ return p.display === 'granted' ? p : LN.requestPermissions(); }).then(function(p){
        if (p.display !== 'granted'){ setStatus(tr('Notification permission was not granted.', 'No se concedió el permiso de notificaciones.')); return; }
        return Promise.resolve(LN.createChannel ? LN.createChannel({ id: 'pl0-alerts', name: 'PL0 alerts', importance: 4, vibration: true }) : null).catch(function(){}).then(function(){
          return LN.schedule({ notifications: [{ id: hashId('test' + Date.now()), title: tr('PL0 test alert', 'Alerta de prueba PL0'), body: tr('Alerts are working on this phone.', 'Las alertas funcionan en este teléfono.'), channelId: 'pl0-alerts', schedule: { at: new Date(Date.now() + 4000), allowWhileIdle: true } }] });
        }).then(function(){ setStatus(tr('A test alert will appear in a few seconds.', 'Una alerta de prueba aparecerá en unos segundos.')); });
      }).catch(function(e){ setStatus(String(e && e.message || e)); });
    } else if (window.Notification){
      Notification.requestPermission().then(function(p){ if (p === 'granted'){ new Notification(tr('PL0 test alert', 'Alerta de prueba PL0')); setStatus(tr('Test alert shown (browser).', 'Alerta de prueba mostrada (navegador).')); } else setStatus(tr('Browser notifications were not allowed.', 'No se permitieron las notificaciones del navegador.')); });
    } else setStatus(tr('This browser cannot show notifications.', 'Este navegador no puede mostrar notificaciones.'));
  }

  function chk(id, label, on){ return '<label class="toggle"><input type="checkbox" id="' + id + '"' + (on ? ' checked' : '') + '> <span>' + label + '</span></label>'; }
  function sel(id, opts, cur){ return '<select id="' + id + '" style="width:auto; min-width:180px; margin:2px 0 8px;">' + opts.map(function(o){ return '<option value="' + o[0] + '"' + (o[0] === cur ? ' selected' : '') + '>' + o[1] + '</option>'; }).join('') + '</select>'; }
  function grahaChecks(prefix, list, chosen){ return '<div style="display:flex; flex-wrap:wrap; gap:4px 12px; margin:2px 0 8px;">' + list.map(function(g){ return '<label class="toggle" style="margin:0;"><input type="checkbox" data-' + prefix + '="' + g + '"' + (chosen.indexOf(g) > -1 ? ' checked' : '') + '> <span>' + tr(g, GRAHA_ES[g] || g) + '</span></label>'; }).join('') + '</div>'; }

  function renderAlerts(){
    var box = el('optionsAlerts'); if (!box) return;
    var p = alertPrefs(), natOn = isNative();
    var naks = (typeof NAK27 !== 'undefined' && NAK27.map) ? NAK27.map(function(x){ return x.n; }) : [];
    box.innerHTML = '<fieldset><legend>' + tr('Alerts', 'Alertas') + '</legend>' +
      '<div class="hint" style="margin-bottom:8px;">' + tr('Timing alerts that work without a connection. They are worked out on this phone from your birth data and place, and refreshed every time you open the app.', 'Alertas de tiempo que funcionan sin conexión. Se calculan en este teléfono con tus datos de nacimiento y lugar, y se renuevan cada vez que abres la app.') + '</div>' +
      chk('alEnabled', tr('Turn alerts on', 'Activar las alertas'), p.enabled) +
      '<div id="alBody" style="' + (p.enabled ? '' : 'opacity:.55;') + '">' +
      chk('alPP', tr('Pañcha Pakshi: when my life bird is at its best', 'Pañcha Pakshi: cuando mi ave de vida está en su mejor momento'), p.pp.on) +
      chk('alPeak', tr('The day\'s peak of the main score', 'El punto más alto del día de la puntuación principal'), p.peakLow.on && p.peakLow.peak) +
      chk('alLow', tr('The day\'s low of the main score', 'El punto más bajo del día de la puntuación principal'), p.peakLow.on && p.peakLow.low) +
      '<div style="margin-top:6px;">' + tr('Tithi changes', 'Cambios de tithi') + '<br>' + sel('alTithi', [['off', tr('Off', 'No')], ['special', tr('Only special ones (Pūrṇimā, Amāvasyā, Ekādaśī, Caturthī, Aṣṭamī)', 'Solo especiales (Pūrṇimā, Amāvasyā, Ekādaśī, Caturthī, Aṣṭamī)')], ['all', tr('Every change', 'Todos los cambios')]], p.tithi.on ? p.tithi.only : 'off') + '</div>' +
      '<div>' + tr('Nakshatra changes (Moon)', 'Cambios de nakshatra (Luna)') + '<br>' + sel('alNak', [['off', tr('Off', 'No')], ['all', tr('Every change', 'Todos los cambios')], ['selected', tr('Only chosen stars', 'Solo estrellas elegidas')]], p.nakshatra.on ? p.nakshatra.only : 'off') +
        '<details id="alNakList" style="margin:-2px 0 8px;"><summary>' + tr('Choose stars', 'Elegir estrellas') + '</summary><div style="display:flex; flex-wrap:wrap; gap:2px 12px;">' + naks.map(function(n){ return '<label class="toggle" style="margin:0;"><input type="checkbox" data-nak="' + n + '"' + (p.nakshatra.list.indexOf(n) > -1 ? ' checked' : '') + '> <span>' + n + '</span></label>'; }).join('') + '</div></details></div>' +
      '<div>' + tr('Hora changes', 'Cambios de hora') + '<br>' + sel('alHora', [['off', tr('Off', 'No')], ['lords', tr('Only these hora lords', 'Solo estos señores de hora')], ['all', tr('Every hora', 'Todas las horas')]], p.hora.mode) +
        '<div id="alHoraLords">' + grahaChecks('horalord', HORA_LORDS, p.hora.lords) + '</div></div>' +
      '<div>' + chk('alTransits', tr('Major transits (a graha changes sign)', 'Tránsitos mayores (un graha cambia de signo)'), p.transits.on) +
        '<div id="alTransitGrahas">' + grahaChecks('tgraha', GRAHAS, p.transits.grahas) + chk('alStations', tr('Also when a chosen graha turns retrograde or direct', 'También cuando un graha elegido se vuelve retrógrado o directo'), p.transits.stations) + '</div></div>' +
      chk('alQuiet', tr('Quiet hours (no alerts between)', 'Horas de silencio (sin alertas entre)'), p.quiet.on) +
      '<div id="alQuietRow" style="margin:0 0 8px;"><input type="time" id="alQFrom" value="' + p.quiet.from + '" style="width:auto;"> &nbsp;&ndash;&nbsp; <input type="time" id="alQTo" value="' + p.quiet.to + '" style="width:auto;"></div>' +
      '<div>' + tr('Schedule ahead', 'Programar por adelantado') + '<br>' + sel('alHorizon', [['2', tr('2 days', '2 días')], ['3', tr('3 days', '3 días')], ['5', tr('5 days', '5 días')], ['7', tr('7 days', '7 días')]], String(p.horizonDays || 3)) + '</div>' +
      '</div>' +
      '<div style="display:flex; gap:8px; flex-wrap:wrap; margin:6px 0;">' +
        '<button type="button" class="btn ghost" id="alPreviewBtn">' + tr('Preview the next alerts', 'Ver las próximas alertas') + '</button>' +
        '<button type="button" class="btn ghost" id="alTestBtn">' + tr('Send a test alert', 'Enviar una alerta de prueba') + '</button>' +
        '<button type="button" class="btn" id="alApplyBtn">' + (natOn ? tr('Schedule now', 'Programar ahora') : tr('Save', 'Guardar')) + '</button></div>' +
      '<div id="alertStatus" class="hint" style="min-height:1.4em;"></div><div id="alertPreview"></div></fieldset>';
    wireAlerts();
  }

  function readAlertsFromUi(){
    var p = alertPrefs(); function v(id){ var c = el(id); return c ? c.value : null; } function on(id){ var c = el(id); return !!(c && c.checked); }
    p.enabled = on('alEnabled'); p.pp.on = on('alPP');
    p.peakLow.on = on('alPeak') || on('alLow'); p.peakLow.peak = on('alPeak'); p.peakLow.low = on('alLow');
    p.tithi.on = v('alTithi') !== 'off'; p.tithi.only = v('alTithi') === 'all' ? 'all' : 'special';
    p.nakshatra.on = v('alNak') !== 'off'; p.nakshatra.only = v('alNak') === 'selected' ? 'selected' : 'all';
    p.nakshatra.list = [].slice.call(document.querySelectorAll('[data-nak]')).filter(function(c){ return c.checked; }).map(function(c){ return c.getAttribute('data-nak'); });
    p.hora.mode = v('alHora') || 'off'; p.hora.lords = [].slice.call(document.querySelectorAll('[data-horalord]')).filter(function(c){ return c.checked; }).map(function(c){ return c.getAttribute('data-horalord'); });
    p.transits.on = on('alTransits'); p.transits.stations = on('alStations');
    p.transits.grahas = [].slice.call(document.querySelectorAll('[data-tgraha]')).filter(function(c){ return c.checked; }).map(function(c){ return c.getAttribute('data-tgraha'); });
    p.quiet.on = on('alQuiet'); p.quiet.from = v('alQFrom') || '22:00'; p.quiet.to = v('alQTo') || '06:00';
    p.horizonDays = parseInt(v('alHorizon'), 10) || 3;
    return p;
  }
  function syncVisibility(){
    var p = readAlertsFromUi(), body = el('alBody'); if (body) body.style.opacity = p.enabled ? '' : '.55';
    var hl = el('alHoraLords'); if (hl) hl.style.display = p.hora.mode === 'lords' ? '' : 'none';
    var nl = el('alNakList'); if (nl) nl.style.display = p.nakshatra.on && p.nakshatra.only === 'selected' ? '' : 'none';
    var tg = el('alTransitGrahas'); if (tg) tg.style.display = p.transits.on ? '' : 'none';
    var qr = el('alQuietRow'); if (qr) qr.style.display = p.quiet.on ? '' : 'none';
  }
  function wireAlerts(){
    var box = el('optionsAlerts'); if (!box) return;
    box.addEventListener('change', function(){ saveAlertPrefs(readAlertsFromUi()); syncVisibility(); });
    el('alPreviewBtn').addEventListener('click', function(){ saveAlertPrefs(readAlertsFromUi()); preview(); });
    el('alTestBtn').addEventListener('click', testNow);
    el('alApplyBtn').addEventListener('click', function(){ saveAlertPrefs(readAlertsFromUi()); scheduleAlerts().then(function(ok){ if (!isNative()) preview(); }); });
    syncVisibility();
  }

  window.renderOptionsPage = function(){ bindCalc(); renderElsewhere(); renderAlerts(); };
  window.PL0Options = { alertPrefs: alertPrefs, scheduleAlerts: scheduleAlerts, cancelAll: cancelAll, computeAlerts: computeAlerts };

  // start-up: restore the saved calculation options, then re-run once if they differ from the defaults the page loaded with;
  // and refresh the schedule when the app is opened or brought back (throttled), if alerts are on.
  function start(){
    bindCalc();
    if (restoreCalc()) recompute();
    if (alertPrefs().enabled) setTimeout(function(){ scheduleAlerts(); }, 4000);
    document.addEventListener('visibilitychange', function(){
      if (document.visibilityState !== 'visible' || !alertPrefs().enabled) return;
      var last = 0; try { last = parseInt(localStorage.getItem('pl0AlertsScheduledAt') || '0', 10); } catch (e) {}
      if (Date.now() - last > 30 * 60000) scheduleAlerts();
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
