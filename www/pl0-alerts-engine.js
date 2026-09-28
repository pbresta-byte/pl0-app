/* =========================================================================
   PL0 ALERT ENGINE  (www/pl0-alerts-engine.js)
   -------------------------------------------------------------------------
   Pure, deterministic: given user preferences and the app's context, returns
   the local notifications to schedule over the next few days. Scheduling
   itself (Capacitor LocalNotifications) is done elsewhere.

     window.PL0Alerts.compute({startMs, days, prefs, ctx}) -> Alert[]
     window.PL0Alerts.defaultPrefs() -> prefs
     window.PL0Alerts.kinds -> ['hora','tithi','nakshatra','ingress','station','pp','peak','low']

   Alert = {id, atMs, kind, title, body}. id = kind:minuteEpoch:subject, so
   computing again for an overlapping window yields the same ids.

   READ-ONLY use of the app's globals (index.html must be loaded first):
   computePositions, computePanchanga, sunriseSunsetLocal, scoreForInstant,
   computePanchapakshiDay, WEEKDAYS, NAK27, SIGNS, TITHI_NAMES, PLANET_ORDER,
   WEEKDAY_LORD. Nothing here modifies or wraps any existing function/global;
   the only new global is window.PL0Alerts.

   Time model: ctx.tz is the fixed hours offset the app passes to julianDay().
   Local civil time = UTC + tz. All scan grids are anchored to the absolute
   epoch (not to startMs) so bisection brackets, and therefore alert times and
   ids, do not change when compute() is re-run with a later startMs.
   ========================================================================= */
(function (root) {
  'use strict';

  var MIN = 60000, HOUR = 3600000, DAY = 86400000;
  var CAP = 180;
  var KINDS = ['hora', 'tithi', 'nakshatra', 'ingress', 'station', 'pp', 'peak', 'low'];
  var GRAHAS = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];
  var HORA_GRAHAS = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
  // Chaldean hora succession starting from the Sun (same order as the app's PLANET_ORDER).
  var HORA_SEQ_FALLBACK = ['Sun', 'Venus', 'Mercury', 'Moon', 'Saturn', 'Jupiter', 'Mars'];
  var DAY_LORD_FALLBACK = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn']; // by getDay()
  var WEEKDAYS_FALLBACK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  var GRAHA_ES = { Sun: 'Sol', Moon: 'Luna', Mars: 'Marte', Mercury: 'Mercurio', Jupiter: 'Júpiter',
    Venus: 'Venus', Saturn: 'Saturno', Rahu: 'Rahu', Ketu: 'Ketu' };
  var SIGNS_EN = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio',
    'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
  var SIGNS_ES = ['Aries', 'Tauro', 'Géminis', 'Cáncer', 'Leo', 'Virgo', 'Libra', 'Escorpio',
    'Sagitario', 'Capricornio', 'Acuario', 'Piscis'];
  var BIRD_ES = { Vulture: 'Buitre', Owl: 'Búho', Crow: 'Cuervo', Cock: 'Gallo', Peacock: 'Pavo real' };
  var TITHI_FALLBACK = ['Pratipada', 'Dvitiya', 'Tritiya', 'Chaturthi', 'Panchami', 'Shashti', 'Saptami',
    'Astami', 'Navami', 'Dasami', 'Ekadasi', 'Dvadasi', 'Trayodasi', 'Chaturdasi', 'Poornima/Amavasya'];

  /* ---------- access to the app's globals (read-only) ---------- */
  // Classic-script top-level const/let are visible by bare name (not as window
  // props), so each one is referenced directly behind a typeof guard (no eval,
  // so a strict Content-Security-Policy cannot break it).
  function g(name) {
    switch (name) {
      case 'computePositions': return typeof computePositions === 'function' ? computePositions : undefined;
      case 'computePanchanga': return typeof computePanchanga === 'function' ? computePanchanga : undefined;
      case 'sunriseSunsetLocal': return typeof sunriseSunsetLocal === 'function' ? sunriseSunsetLocal : undefined;
      case 'scoreForInstant': return typeof scoreForInstant === 'function' ? scoreForInstant : undefined;
      case 'computePanchapakshiDay': return typeof computePanchapakshiDay === 'function' ? computePanchapakshiDay : undefined;
      case 'WEEKDAYS': return typeof WEEKDAYS !== 'undefined' ? WEEKDAYS : undefined;
      case 'NAK27': return typeof NAK27 !== 'undefined' ? NAK27 : undefined;
      case 'TITHI_NAMES': return typeof TITHI_NAMES !== 'undefined' ? TITHI_NAMES : undefined;
      case 'PLANET_ORDER': return typeof PLANET_ORDER !== 'undefined' ? PLANET_ORDER : undefined;
      case 'WEEKDAY_LORD': return typeof WEEKDAY_LORD !== 'undefined' ? WEEKDAY_LORD : undefined;
      default: return undefined;
    }
  }
  function need(name) {
    var v = g(name);
    if (typeof v === 'undefined') throw new Error('PL0Alerts: app global "' + name + '" is not loaded');
    return v;
  }

  /* ---------- small helpers ---------- */
  function clamp(x, a, b) { return Math.max(a, Math.min(b, x)); }
  function pad2(n) { return (n < 10 ? '0' : '') + n; }
  function msToJd(ms) { return ms / DAY + 2440587.5; }
  function localParts(ms, tz) {
    var d = new Date(ms + tz * HOUR);
    return { y: d.getUTCFullYear(), mo: d.getUTCMonth() + 1, da: d.getUTCDate(),
      hh: d.getUTCHours(), mm: d.getUTCMinutes(), wd: d.getUTCDay() };
  }
  // epoch ms of local civil y-mo-da at decimal hour h
  function localToMs(y, mo, da, h, tz) { return Date.UTC(y, mo - 1, da) + (h - tz) * HOUR; }
  function hhmm(ms, tz) { var p = localParts(ms, tz); return pad2(p.hh) + ':' + pad2(p.mm); }
  function minuteOfDay(ms, tz) { var p = localParts(ms, tz); return p.hh * 60 + p.mm; }
  function roundMin(ms) { return Math.round(ms / MIN) * MIN; }
  function parseHM(s, dflt) {
    var m = /^(\d{1,2}):(\d{2})$/.exec(String(s || ''));
    if (!m) return dflt;
    return (Number(m[1]) % 24) * 60 + Number(m[2]) % 60;
  }
  function L(lang, en, es) { return lang === 'es' ? es : en; }
  function grahaName(gname, lang) { return lang === 'es' ? (GRAHA_ES[gname] || gname) : gname; }
  function signName(idx, lang) { return (lang === 'es' ? SIGNS_ES : SIGNS_EN)[((idx % 12) + 12) % 12]; }
  function mod(a, n) { return ((a % n) + n) % n; }

  /* ---------- positions (memoised per compute call) ---------- */
  function makePosFn(ctx) {
    var computePositions = need('computePositions');
    var cache = new Map();
    return function (ms) {
      var hit = cache.get(ms);
      if (hit) return hit;
      var p = computePositions(msToJd(ms), ctx.lat, ctx.lon, ctx.ayanamsaMode);
      if (cache.size > 5000) cache.clear();
      cache.set(ms, p);
      return p;
    };
  }

  /* Generic scan + bisection. valueAt(ms) returns a discrete value (number or
     string). The grid is anchored to the epoch in `stepMs` units; each change
     between consecutive grid points is bisected until the bracket is <= tolMs.
     Returns [{ms (first instant of the new value, rounded to the minute), from, to}]. */
  function findChanges(valueAt, fromMs, toMs, stepMs, tolMs) {
    var out = [];
    var t0 = Math.floor(fromMs / stepMs) * stepMs;
    var prevT = t0, prevV = valueAt(t0);
    for (var t = t0 + stepMs; t <= toMs + stepMs; t += stepMs) {
      var v = valueAt(t);
      if (v !== prevV) {
        var a = prevT, b = t;
        while (b - a > tolMs) {
          var m = Math.floor((a + b) / 2);
          if (valueAt(m) === prevV) a = m; else b = m;
        }
        out.push({ ms: roundMin(b), from: prevV, to: valueAt(b) });
      }
      prevT = t; prevV = v;
    }
    return out;
  }

  /* ---------- Vedic day (sunrise to next sunrise) ---------- */
  function sunTimes(y, mo, da, ctx) {
    var sr = need('sunriseSunsetLocal')(y, mo, da, ctx.lat, ctx.lon, ctx.tz);
    if (!sr) return { rise: localToMs(y, mo, da, 6, ctx.tz), set: localToMs(y, mo, da, 18, ctx.tz), fallback: true };
    var rise = localToMs(y, mo, da, sr.sunriseHr, ctx.tz);
    var set = localToMs(y, mo, da, sr.sunsetHr, ctx.tz);
    if (set <= rise) set += DAY;
    return { rise: rise, set: set, fallback: false };
  }
  // Vedic days whose span overlaps [fromMs, toMs]
  function vedicDays(fromMs, toMs, ctx) {
    var out = [];
    var p = localParts(fromMs - DAY, ctx.tz);
    var base = Date.UTC(p.y, p.mo - 1, p.da);
    for (var k = 0; k < 12; k++) {
      var d = new Date(base + k * DAY), dn = new Date(base + (k + 1) * DAY);
      var a = sunTimes(d.getUTCFullYear(), d.getUTCMonth() + 1, d.getUTCDate(), ctx);
      var b = sunTimes(dn.getUTCFullYear(), dn.getUTCMonth() + 1, dn.getUTCDate(), ctx);
      if (b.rise <= fromMs) continue;
      if (a.rise > toMs) break;
      out.push({ y: d.getUTCFullYear(), mo: d.getUTCMonth() + 1, da: d.getUTCDate(), wd: d.getUTCDay(),
        rise: a.rise, set: a.set, nextRise: b.rise });
    }
    return out;
  }

  /* ================= HORA =================
     Day: sunrise->sunset split in 12 equal horas; night: sunset->next sunrise
     split in 12. Lord of the 1st day hora = weekday lord of the sunrise date,
     then the Chaldean succession (the app's PLANET_ORDER). NOTE: the app's
     horaLord() is not called here — see the report: it indexes the array
     WEEKDAY_LORD with a weekday NAME (always undefined) and uses fixed 1-hour
     night horas, so its output is off by one lord. The same sequence is
     rebuilt here from the app's own PLANET_ORDER / WEEKDAY_LORD constants. */
  function horaAlerts(prefs, ctx, fromMs, toMs, lang) {
    var mode = prefs.hora && prefs.hora.mode;
    if (mode !== 'lords' && mode !== 'all') return [];
    var wanted = mode === 'all' ? null : (prefs.hora.lords || []);
    if (wanted && !wanted.length) return [];
    var seq = Array.isArray(g('PLANET_ORDER')) && g('PLANET_ORDER').length === 7 ? g('PLANET_ORDER') : HORA_SEQ_FALLBACK;
    var dayLord = Array.isArray(g('WEEKDAY_LORD')) && g('WEEKDAY_LORD').length === 7 ? g('WEEKDAY_LORD') : DAY_LORD_FALLBACK;
    var out = [];
    vedicDays(fromMs, toMs, ctx).forEach(function (vd) {
      var start = seq.indexOf(dayLord[vd.wd]);
      var dLen = (vd.set - vd.rise) / 12, nLen = (vd.nextRise - vd.set) / 12;
      for (var k = 0; k < 24; k++) {
        var s = k < 12 ? vd.rise + k * dLen : vd.set + (k - 12) * nLen;
        var e = k < 12 ? s + dLen : s + nLen;
        var lord = seq[(start + k) % 7];
        if (wanted && wanted.indexOf(lord) < 0) continue;
        var at = roundMin(s);
        out.push({ id: 'hora:' + at / MIN + ':' + lord, atMs: at, kind: 'hora',
          title: L(lang, grahaName(lord, lang) + ' hora', 'Hora de ' + grahaName(lord, lang)),
          body: L(lang, 'Hora of ' + lord + ' until ' + hhmm(e, ctx.tz) + '.',
            'Hora de ' + grahaName(lord, lang) + ' hasta las ' + hhmm(e, ctx.tz) + '.') });
      }
    });
    return out;
  }

  /* ================= TITHI / NAKSHATRA =================
     Moon-Sun elongation and Moon longitude from computePositions(); scanned
     every 20 min and bisected to under 1 minute. */
  var SPECIAL_TITHI = { 4: 1, 8: 1, 11: 1, 15: 1, 19: 1, 23: 1, 26: 1, 30: 1 }; // Chaturthi, Ashtami, Ekadashi, Purnima (both pakshas) / Amavasya
  function tithiLabel(num, lang) {
    var names = g('TITHI_NAMES') || TITHI_FALLBACK;
    var shukla = num <= 15, idx = shukla ? num - 1 : num - 16;
    var name = idx === 14 ? (shukla ? 'Poornima' : 'Amavasya') : names[idx];
    var paksha = shukla ? L(lang, 'waxing', 'creciente') : L(lang, 'waning', 'menguante');
    return { name: name, paksha: paksha, full: idx === 14 ? name : name + ' (' + paksha + ')' };
  }
  function tithiAlerts(prefs, ctx, fromMs, toMs, lang, pos) {
    var t = prefs.tithi || {};
    if (!t.on) return [];
    var computePanchanga = need('computePanchanga');
    var val = function (ms) { return Math.floor(computePanchanga(pos(ms)).tithiRawFrac) % 30; };
    var out = [];
    findChanges(val, fromMs, toMs, 20 * MIN, 30000).forEach(function (c) {
      var num = c.to + 1; // 1..30
      if (t.only === 'special' && !SPECIAL_TITHI[num]) return;
      var lb = tithiLabel(num, lang);
      out.push({ id: 'tithi:' + c.ms / MIN + ':' + num, atMs: c.ms, kind: 'tithi',
        title: L(lang, 'Tithi: ', 'Tithi: ') + lb.name,
        body: L(lang, 'The lunar day ' + lb.full + ' begins now.', 'Comienza el día lunar ' + lb.full + '.') });
    });
    return out;
  }
  function nakshatraAlerts(prefs, ctx, fromMs, toMs, lang, pos) {
    var n = prefs.nakshatra || {};
    if (!n.on) return [];
    var NAK27 = need('NAK27');
    var list = n.only === 'selected' ? (n.list || []) : null;
    if (list && !list.length) return [];
    var val = function (ms) { return Math.floor(pos(ms).Moon.sidereal / (360 / 27)) % 27; };
    var out = [];
    findChanges(val, fromMs, toMs, 20 * MIN, 30000).forEach(function (c) {
      var name = NAK27[c.to].n;
      if (list && list.indexOf(name) < 0) return;
      out.push({ id: 'nakshatra:' + c.ms / MIN + ':' + name, atMs: c.ms, kind: 'nakshatra',
        title: L(lang, 'Moon enters ', 'La Luna entra en ') + name,
        body: L(lang, 'The Moon moves into the nakshatra ' + name + '.', 'La Luna pasa al nakshatra ' + name + '.') });
    });
    return out;
  }

  /* ================= TRANSITS =================
     Sidereal sign ingress of the chosen grahas and, when stations is on, the
     retrograde/direct station (sign change of pos[g].speed, the app's
     +-12 h central-difference speed). Scanned every 6 h, bisected to <= 2 min. */
  function transitAlerts(prefs, ctx, fromMs, toMs, lang, pos) {
    var tr = prefs.transits || {};
    if (!tr.on) return [];
    var grahas = (tr.grahas || []).filter(function (x) { return GRAHAS.indexOf(x) >= 0; });
    var out = [];
    grahas.forEach(function (gr) {
      var sign = function (ms) { return Math.floor(pos(ms)[gr].sidereal / 30) % 12; };
      findChanges(sign, fromMs, toMs, 6 * HOUR, 2 * MIN).forEach(function (c) {
        var retro = pos(c.ms)[gr].speed < 0;
        out.push({ id: 'ingress:' + c.ms / MIN + ':' + gr + '-' + c.to, atMs: c.ms, kind: 'ingress',
          title: L(lang, grahaName(gr, lang) + ' enters ' + signName(c.to, lang),
            grahaName(gr, lang) + ' entra en ' + signName(c.to, lang)),
          body: L(lang, gr + ' moves from ' + signName(c.from, lang) + ' into ' + signName(c.to, lang) + (retro ? ' (retrograde).' : '.'),
            grahaName(gr, lang) + ' pasa de ' + signName(c.from, lang) + ' a ' + signName(c.to, lang) + (retro ? ' (retrógrado).' : '.')) });
      });
      // Sun and Moon never station; the nodes use a constant mean speed in the app.
      if (tr.stations && ['Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'].indexOf(gr) >= 0) {
        var dir = function (ms) { return pos(ms)[gr].speed < 0 ? 'R' : 'D'; };
        findChanges(dir, fromMs, toMs, 6 * HOUR, 2 * MIN).forEach(function (c) {
          var r = c.to === 'R';
          var sg = signName(Math.floor(pos(c.ms)[gr].sidereal / 30), lang);
          out.push({ id: 'station:' + c.ms / MIN + ':' + gr + '-' + c.to, atMs: c.ms, kind: 'station',
            title: r ? L(lang, grahaName(gr, lang) + ' turns retrograde', grahaName(gr, lang) + ' se vuelve retrógrado')
              : L(lang, grahaName(gr, lang) + ' turns direct', grahaName(gr, lang) + ' retoma el movimiento directo'),
            body: r ? L(lang, gr + ' stations retrograde in ' + sg + '.', grahaName(gr, lang) + ' se detiene y retrograda en ' + sg + '.')
              : L(lang, gr + ' stations direct in ' + sg + '.', grahaName(gr, lang) + ' se detiene y avanza en ' + sg + '.') });
        });
      }
    });
    return out;
  }

  /* ================= PAÑCHA PAKSHI 'PERFECT TIME' =================
     Definition used: the reference person's life bird (refP.lifeBird) is in
     its RULING main activity AND the RULING sub-activity at the same time
     ("Ruling within Ruling"). This is rank 1 of the app's own favourability
     order (PP_HORARY_TIERS: Ruling-in-Ruling > Eating-in-Ruling >
     Ruling-in-Eating > Eating-in-Eating), and Ruling carries the top activity
     factor (PP_ACT_FACTOR 1.0) in the strength table, so it is the single
     strongest state the bird can hold. A second kind is also alerted (owner decision, 2026-09-26):
     Eating within Ruling, but ONLY when the bird that performs the Eating sub-activity in that Yama is a
     FRIEND of the life bird (the source grades Ruling/Eating sub-activities good with a friendly bird and only
     medium with an enemy). The bird doing a sub-activity is the bird whose own main activity in that Yama is
     that state. Friend/enemy table: the source lists five rows for the bright half; its Cock row names Owl as
     both friend and enemy, which contradicts the Owl row and the other three rows, so Cock's friends are read
     as Crow and Peacock (the five friendships then form one closed ring of five, Vulture-Owl-Crow-Cock-Peacock).
     The source gives one relation table; it is used for both halves. Other combinations are NOT alerted.
     Day structure comes straight from computePanchapakshiDay(): the Vedic day
     runs sunrise->sunset (5 yamas) and sunset->next sunrise (5 yamas) with the
     weekday of the sunrise date; the paksha (bright/dark) is taken at the
     start of each yama, so a tithi change mid-day switches the table at the
     next yama boundary. */
  var PP_FRIENDS = { Vulture: ['Peacock', 'Owl'], Owl: ['Vulture', 'Crow'], Crow: ['Cock', 'Owl'], Cock: ['Crow', 'Peacock'], Peacock: ['Vulture', 'Cock'] };
  var PP_BIRDS_FALLBACK = ['Vulture', 'Owl', 'Crow', 'Cock', 'Peacock'];
  function ppAlerts(prefs, ctx, fromMs, toMs, lang, pos) {
    if (!(prefs.pp && prefs.pp.on)) return [];
    var refP = ctx.refP || {};
    var bird = refP.lifeBird;
    if (!bird || !refP.star) return [];
    var computePanchapakshiDay = need('computePanchapakshiDay');
    var computePanchanga = need('computePanchanga');
    var weekdays = g('WEEKDAYS') || WEEKDAYS_FALLBACK;
    var out = [];
    vedicDays(fromMs, toMs, ctx).forEach(function (vd) {
      var dayLen = (vd.set - vd.rise) / HOUR, nightLen = (vd.nextRise - vd.set) / HOUR;
      var wdName = weekdays[vd.wd];
      var tables = {};
      var table = function (half) {
        return tables[half] || (tables[half] = computePanchapakshiDay(wdName, half, dayLen, nightLen, bird));
      };
      for (var slot = 0; slot < 10; slot++) {
        var yStartHr = table('bright').periods[slot].startHr;
        var yStartMs = vd.rise + yStartHr * HOUR;
        var half = computePanchanga(pos(roundMin(yStartMs))).paksha === 'Shukla' ? 'bright' : 'dark';
        var subs = table(half).subPeriods.slice(slot * 5, slot * 5 + 5);
        subs.forEach(function (sp) {
          var st = sp.byBird[bird];
          if (!st || st.mainState !== 'Ruling') return;
          var friendBird = null;
          if (st.abstractState === 'Eating') {
            var per = table(half).periods[slot], birds = g('PP_BIRDS') || PP_BIRDS_FALLBACK;
            var doer = birds.filter(function (b) { return per.byBird[b] && per.byBird[b].state === 'Eating'; })[0];
            if (!doer || (PP_FRIENDS[bird] || []).indexOf(doer) < 0) return;      // enemy (or unknown) bird: only medium, not alerted
            friendBird = doer;
          } else if (st.abstractState !== 'Ruling') return;
          var s = roundMin(vd.rise + sp.startHr * HOUR), e = vd.rise + sp.endHr * HOUR;
          var birdEs = BIRD_ES[bird] || bird;
          if (friendBird) {
            var fEs = BIRD_ES[friendBird] || friendBird;
            out.push({ id: 'pp:' + s / MIN + ':' + bird + ':e', atMs: s, kind: 'pp',
              title: L(lang, 'Very good time for your bird', 'Muy buen momento para tu ave'),
              body: L(lang, bird + ': Eating within Ruling, with a friendly bird (' + friendBird + '), until ' + hhmm(e, ctx.tz) + '.',
                birdEs + ': Comiendo dentro de Reinando, con un ave amiga (' + fEs + '), hasta las ' + hhmm(e, ctx.tz) + '.') });
            return;
          }
          out.push({ id: 'pp:' + s / MIN + ':' + bird, atMs: s, kind: 'pp',
            title: L(lang, 'Perfect time for your bird', 'Momento perfecto para tu ave'),
            body: L(lang, bird + ': Ruling within Ruling until ' + hhmm(e, ctx.tz) + '. The best moment to act.',
              birdEs + ': Reinando dentro de Reinando hasta las ' + hhmm(e, ctx.tz) + '. El mejor momento para actuar.') });
        });
      }
    });
    return out;
  }

  /* ================= DAY PEAK / LOW OF THE HERO SCORE =================
     For each local civil day: scoreForInstant() every 30 min from 06:00 to
     22:00 local (33 samples). The best (highest) and worst (lowest) half-hour
     slot are reported only when max-min >= 0.5 and the two slots are at
     least 2 h apart. Ties go to the earliest slot. */
  function peakLowAlerts(prefs, ctx, fromMs, toMs, lang) {
    var pl = prefs.peakLow || {};
    if (!pl.on || (!pl.peak && !pl.low)) return [];
    var scoreForInstant = need('scoreForInstant');
    var opts = Object.assign({ lat: ctx.lat, lon: ctx.lon, tz: ctx.tz, ayanamsaMode: ctx.ayanamsaMode, refP: ctx.refP },
      ctx.scoreOpts || {});
    if (!opts.refP) return [];
    var out = [];
    var p0 = localParts(fromMs, ctx.tz);
    var base = Date.UTC(p0.y, p0.mo - 1, p0.da);
    for (var k = 0; k < 9; k++) {
      var d = new Date(base + k * DAY);
      var y = d.getUTCFullYear(), mo = d.getUTCMonth() + 1, da = d.getUTCDate();
      var first = localToMs(y, mo, da, 6, ctx.tz), last = localToMs(y, mo, da, 22, ctx.tz);
      if (first > toMs) break;
      if (last < fromMs) continue;
      var best = null, worst = null;
      for (var i = 0; i <= 32; i++) {
        var hh = 6 + Math.floor(i / 2), mm = (i % 2) * 30;
        var sc = scoreForInstant(y, mo, da, hh, mm, opts).score;
        if (!isFinite(sc)) continue;
        var at = localToMs(y, mo, da, hh + mm / 60, ctx.tz);
        if (!best || sc > best.sc) best = { sc: sc, at: at };
        if (!worst || sc < worst.sc) worst = { sc: sc, at: at };
      }
      if (!best || best.sc - worst.sc < 0.5 || Math.abs(best.at - worst.at) < 2 * HOUR) continue;
      var dayKey = y + pad2(mo) + pad2(da);
      var fmt = function (s) { var r = Math.round(s * 10) / 10 || 0; return (r > 0 ? '+' : '') + r.toFixed(1); };
      if (pl.peak) out.push({ id: 'peak:' + best.at / MIN + ':' + dayKey, atMs: best.at, kind: 'peak',
        title: L(lang, "Today's best half hour", 'La mejor media hora de hoy'),
        body: L(lang, 'Score peaks at ' + fmt(best.sc) + ' from ' + hhmm(best.at, ctx.tz) + ' to ' + hhmm(best.at + 30 * MIN, ctx.tz) + '.',
          'La puntuación llega a ' + fmt(best.sc) + ' de ' + hhmm(best.at, ctx.tz) + ' a ' + hhmm(best.at + 30 * MIN, ctx.tz) + '.') });
      if (pl.low) out.push({ id: 'low:' + worst.at / MIN + ':' + dayKey, atMs: worst.at, kind: 'low',
        title: L(lang, "Today's weakest half hour", 'La media hora más débil de hoy'),
        body: L(lang, 'Score drops to ' + fmt(worst.sc) + ' from ' + hhmm(worst.at, ctx.tz) + ' to ' + hhmm(worst.at + 30 * MIN, ctx.tz) + '. Avoid starting things.',
          'La puntuación baja a ' + fmt(worst.sc) + ' de ' + hhmm(worst.at, ctx.tz) + ' a ' + hhmm(worst.at + 30 * MIN, ctx.tz) + '. Evita empezar cosas.') });
    }
    return out;
  }

  /* ================= QUIET HOURS ================= */
  function inQuiet(ms, quiet, tz) {
    if (!quiet || !quiet.on) return false;
    var a = parseHM(quiet.from, 22 * 60), b = parseHM(quiet.to, 6 * 60);
    if (a === b) return false;
    var m = minuteOfDay(ms, tz);
    return a < b ? (m >= a && m < b) : (m >= a || m < b);
  }

  /* ================= PUBLIC API ================= */
  function defaultPrefs() {
    return {
      enabled: false,
      horizonDays: 3,
      hora: { mode: 'off', lords: [] },
      tithi: { on: true, only: 'special' },
      nakshatra: { on: false, only: 'all', list: [] },
      transits: { on: false, grahas: ['Sun', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'], stations: false },
      pp: { on: false },
      peakLow: { on: true, peak: true, low: true },
      quiet: { on: false, from: '22:00', to: '06:00' }
    };
  }

  function compute(params) {
    params = params || {};
    var prefs = params.prefs || defaultPrefs();
    var ctx = params.ctx || {};
    if (prefs.enabled === false) return [];
    if (!isFinite(ctx.lat) || !isFinite(ctx.lon) || !isFinite(ctx.tz)) throw new Error('PL0Alerts: ctx.lat/lon/tz required');
    var startMs = Number(params.startMs);
    if (!isFinite(startMs)) throw new Error('PL0Alerts: startMs required');
    var days = clamp(Math.round(Number(params.days != null ? params.days : (prefs.horizonDays != null ? prefs.horizonDays : 3))) || 3, 1, 7);
    var endMs = startMs + days * DAY;
    var lang = ctx.lang === 'es' ? 'es' : 'en';
    var pos = makePosFn(ctx);

    var all = [].concat(
      horaAlerts(prefs, ctx, startMs, endMs, lang),
      tithiAlerts(prefs, ctx, startMs, endMs, lang, pos),
      nakshatraAlerts(prefs, ctx, startMs, endMs, lang, pos),
      transitAlerts(prefs, ctx, startMs, endMs, lang, pos),
      ppAlerts(prefs, ctx, startMs, endMs, lang, pos),
      peakLowAlerts(prefs, ctx, startMs, endMs, lang)
    );
    var seen = {};
    var list = all.filter(function (a) {
      if (a.atMs < startMs || a.atMs >= endMs) return false;
      if (inQuiet(a.atMs, prefs.quiet, ctx.tz)) return false;
      if (seen[a.id]) return false;
      seen[a.id] = 1;
      return true;
    });
    list.sort(function (a, b) { return a.atMs - b.atMs || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0); });
    return list.slice(0, CAP);
  }

  var api = { compute: compute, defaultPrefs: defaultPrefs, kinds: KINDS.slice(),
    _internal: { findChanges: findChanges, vedicDays: vedicDays, inQuiet: inQuiet, SPECIAL_TITHI: SPECIAL_TITHI } };
  root.PL0Alerts = api;
})(typeof window !== 'undefined' ? window : this);
