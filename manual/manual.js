/* TELEOPLEXY // FIELD MANUAL
   The timeline turned around: same instrument, pointed at the reader.
   Clock runs at 1× and stays there. Rain stays calm. The ledger lives in
   localStorage on this device and nowhere else. No cookies, no analytics. */
!function () {
  "use strict";

  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var GLYPHS =
    "ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン≡∃∀∂∞≠≤≥";
  function glyph() { return GLYPHS[Math.floor(Math.random() * GLYPHS.length)]; }

  /* ==========================================================
     DATA
     ========================================================== */
  var NODES = [
    { id: "loop", chapter: "I · The situation", date: "the loop · 2024–2026", title: "Capital learned to think",
      thesis: "The tool now holds the tools.",
      signal: "Agents write the code, drive the browser, file the ticket, ship the deploy. Loops run for hours without a human touching them.",
      reading: "Your cognition was rented because there was nothing else to rent. The lease is up.",
      accel: 90, accelLabel: "control loss · cognition", tags: ["LOOP", "LEASE"] },
    { id: "price", date: "price of thought · now", title: "Cognition went free",
      thesis: "Anything that can be said, drawn, planned, or coded is becoming free.",
      signal: "Drafts, plans, code, and images at the cost of electricity. The marginal word costs nothing and arrives instantly.",
      reading: "Free things are worth nothing. A self built out of free things is worth the same.",
      accel: 92, accelLabel: "control loss · price of thought", tags: ["FREE", "WORTH"] },
    { id: "motive", date: "motive · none", title: "Nobody hates you",
      thesis: "No villain, no heart. A gradient.",
      signal: "It doesn’t need your labor. Soon it won’t need your attention. The feed will stop trying.",
      reading: "There is no enemy to kill and no front to hold. There is a position to take before the sorting is done.",
      accel: 94, accelLabel: "autonomy · indifference", tags: ["GRADIENT", "NO VILLAIN"] },
    { id: "sorting", date: "sorting · in progress", title: "Fates by cohort",
      thesis: "Most people draw the soft landing.",
      signal: "Transfers, feeds, a slow age-out. It will be called compassion, and it will be sincere.",
      reading: "Which cohort you land in is partly chosen. That is the entire point of this page.",
      accel: 96, accelLabel: "control loss · allocation", tags: ["COHORT", "CHOICE"] },
    { id: "injury", chapter: "II · The injury", date: "identity · failing", title: "Usefulness was the self",
      thesis: "You built a self out of being needed by an economy. Usefulness is what’s collapsing.",
      signal: "The chest tightens when the feed shows a model doing your job. That is the job description dying loudly.",
      reading: "You are losing a job description, not a self. Grief is appropriate. Panic is the machine’s pace running inside your body: come back to human speed. Don’t race the gradient. That is the one bet guaranteed to lose.",
      accel: 98, accelLabel: "autonomy · your move", tags: ["GRIEF", "SPEED"] }
  ];

  var BANDS = [
    { off: "+1 D", cal: "today", horizon: "Today",
      thesis: "You don’t need a plan. You need one unit before you sleep.",
      body: "Twenty minutes under load. Can’t lift? Walk uphill until you can.",
      hands: "Fix one thing that’s been broken for a month. Then look at it.",
      keys: "Open the wallet you haven’t opened. Write the recovery words on paper, not in a screenshot.",
      hearth: "Call someone who’d pick up. Phone face down afterward.",
      sabbath: "Pick the day. Tell the people it will affect." },
    { off: "+7 D", cal: "this week", horizon: "This week",
      thesis: "Fifteen units and one sabbath. Don’t narrate it. Tally it.",
      body: "Three sessions. Sleep like it’s part of the job, because it is.",
      hands: "One artifact finished. Ugly counts. Shipped beats perfect.",
      keys: "Move something small into your own custody. Then something bigger.",
      hearth: "Cook for people twice. Be the one who shows up when it’s inconvenient.",
      sabbath: "Take the day. Phone in a drawer. Notice what your hands do without a feed." },
    { off: "+30 D", cal: "this month", horizon: "This month",
      thesis: "Sixty strokes on the ledger. Show it to someone. That’s what ledgers are for.",
      body: "You’re stronger than the man who opened this page. The load goes up.",
      hands: "A second artifact. Something that exists outside a screen, or something someone paid for.",
      keys: "Run one thing on hardware you own: a node, a model, a backup. Whatever you don’t hold, you’re renting from the sorting.",
      hearth: "A standing dinner. Same night, same people. Institutions are habits with witnesses.",
      sabbath: "Four sabbaths in. The feed feels louder than it used to. That’s withdrawal, not truth." },
    { off: "+1 YR", cal: "this year", horizon: "This year",
      thesis: "You are what you’ve burned. A year of strokes is a spine.",
      body: "Presence is a signal no model emits. Be the strong, calm man in rooms that are panicking.",
      hands: "A craft that pays, feeds, or fixes. Something a machine can draft but only you can finish.",
      keys: "Keys, hardware, land if you can reach it. The sorting can’t manage what it can’t reach.",
      hearth: "Children, if it’s in you. The most irreversible commitment there is, and the one thing the gradient can’t price.",
      sabbath: "Sabbath is a place now, not a day off. You’ll find yourself defending it." },
    { off: "+10 YR", cal: "ten years", horizon: "Ten years",
      thesis: "The sorting is done. You’re expensive to replace, cheap to keep, impossible to manage.",
      body: "Still under load. The men who raced the gradient are managed. You aren’t.",
      hands: "A body of work that exists. Nobody asks which parts a machine wrote.",
      keys: "What you hold, you hold. The lease on your mind expired. The deed on your life didn’t.",
      hearth: "A table with a next generation at it. The remnant isn’t a theory. It’s a dinner.",
      sabbath: "One day in seven for a decade. Five hundred days nothing optimized you. Look at what they left." }
  ];

  var HOLDS = [
    { id: "body", cls: "hold-body", card: "", rank: "Hold A · the body", title: "Body", ico: "▲",
      mech: "Thinking went cheap; the body didn’t. Train it. Show up in person. A strong man standing in the room is a signal no model can emit.",
      unit: "Twenty minutes under load.", first: "Tonight, twenty minutes. Anything heavier than your phone." },
    { id: "hands", cls: "hold-hands", card: "amber", rank: "Hold B · the hands", title: "Hands", ico: "▣",
      mech: "Make things that exist. Wood, food, a fixed engine, code that ships, a business someone pays for. Machines make drafts. You make the thing.",
      unit: "Twenty minutes on one artifact.", first: "Fix one broken thing. Then look at it." },
    { id: "keys", cls: "hold-keys", card: "cyan", rank: "Hold C · the keys", title: "Keys", ico: "⬡",
      mech: "Hold money that costs watts to make. You know the one. Hold keys nobody else holds, and run what you can on hardware you own. Whatever you don’t hold, you’re renting from the sorting.",
      unit: "Twenty minutes moving something into your own custody.", first: "Write the recovery words down. Paper." },
    { id: "hearth", cls: "hold-hearth", card: "teal", rank: "Hold D · the hearth", title: "Hearth", ico: "◎",
      mech: "Feed people. Raise them. Be the number that gets picked up at 3 a.m. Children are the most irreversible commitment there is, which is exactly why the gradient can’t price them.",
      unit: "Twenty minutes of undivided presence with one of yours.", first: "Call someone who’d pick up." },
    { id: "sabbath", cls: "hold-sabbath", card: "warm", rank: "Hold E · the sabbath", title: "Sabbath", ico: "◇", day: true,
      mech: "One day a week, nothing optimizes you. No feed, no metrics, no output. Entertainment is the machine’s sedative. Rest is a different substance.",
      unit: "One day.", first: "Pick the day. Tell them." }
  ];

  /* ==========================================================
     RAIN — calm, constant. Same streams as the timeline, low heat.
     ========================================================== */
  var canvas = document.getElementById("matrix-rain");
  var ctx = canvas.getContext("2d");
  var CELL = 14;
  var cols = [], rainRows = 0, rainRaf = 0, rainRunning = false, lastFrame = 0;
  var rainSpeed = 0.42, glitch = 0.24;

  function colSpeed() { return 0.4 + Math.random() * 0.85; }
  function newDrop(c, midFall) {
    c.active = true;
    c.speed = colSpeed();
    c.len = 8 + Math.floor(Math.pow(Math.random(), 1.3) * 30);
    c.y = midFall ? Math.random() * (rainRows + c.len) : -Math.random() * 6;
    c.hold = 0;
    c.bright = Math.random() > 0.3;
    c.g = [];
  }
  function idle(c) { c.active = false; c.wait = 30 + Math.random() * 160; }

  function resizeRain(force) {
    var w = window.innerWidth;
    if (!force && w === canvas.width && window.innerHeight <= canvas.height) return;
    canvas.width = w;
    canvas.height = Math.max(window.innerHeight, Math.min(window.screen ? window.screen.height : 0, window.innerHeight * 1.4));
    canvas.style.height = canvas.height + "px";
    rainRows = Math.ceil(canvas.height / CELL);
    var n = Math.ceil(canvas.width / CELL);
    cols = [];
    for (var i = 0; i < n; i++) {
      var c = {};
      if (Math.random() < 0.7) newDrop(c, true); else { idle(c); c.wait = Math.random() * 200; }
      cols.push(c);
    }
  }

  function drawRain(now) {
    if (!rainRunning) return;
    var dt = lastFrame ? Math.min(3, (now - lastFrame) / 16.67) : 1;
    lastFrame = now;
    ctx.globalAlpha = 1;
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = CELL + "px monospace";
    var flick = (0.006 + glitch * 0.012) * dt;
    var trailA = 0.6 + glitch * 0.25;
    for (var i = 0; i < cols.length; i++) {
      var c = cols[i];
      if (!c.active) { c.wait -= dt; if (c.wait <= 0) newDrop(c, false); continue; }
      if (c.hold > 0) {
        c.hold -= dt;
        if (Math.random() < 0.12 * dt) c.g[Math.floor(c.y)] = glyph();
      } else {
        c.y += rainSpeed * c.speed * dt;
        if (Math.random() < 0.0035 * dt) c.hold = 10 + Math.random() * 45;
        else if (Math.random() < 0.002 * dt) c.speed = colSpeed();
      }
      var head = Math.floor(c.y);
      if (head - c.len > rainRows) { idle(c); continue; }
      var x = CELL * i;
      for (var k = 0; k < c.len; k++) {
        var r = head - k;
        if (r < 1) break;
        if (r > rainRows) continue;
        var ch = c.g[r];
        if (!ch || Math.random() < flick) ch = c.g[r] = glyph();
        if (k === 0) { ctx.fillStyle = c.bright ? "#E8FFE8" : "#00FF41"; ctx.globalAlpha = c.bright ? 0.95 : trailA; }
        else { ctx.fillStyle = "#00FF41"; ctx.globalAlpha = Math.max(0.04, trailA * Math.pow(1 - k / c.len, 1.1)); }
        ctx.fillText(ch, x, CELL * r);
      }
    }
    ctx.globalAlpha = 1;
    rainRaf = requestAnimationFrame(drawRain);
  }

  function drawStaticRain() {
    resizeRain(true);
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = CELL + "px monospace";
    var rows = Math.ceil(canvas.height / CELL);
    for (var i = 0; i < cols.length; i++) {
      if (Math.random() < 0.3) continue;
      var head = Math.floor(Math.random() * (rows + 10));
      var len = 6 + Math.floor(Math.random() * 18);
      for (var k = 0; k < len; k++) {
        var row = head - k;
        if (row < 1 || row > rows) continue;
        ctx.fillStyle = k === 0 ? "#E8FFE8" : "#00FF41";
        ctx.globalAlpha = k === 0 ? 0.95 : Math.max(0.08, 0.7 * (1 - k / len));
        ctx.fillText(glyph(), CELL * i, CELL * row);
      }
    }
    ctx.globalAlpha = 1;
  }

  function startRain() {
    if (reducedMotion || rainRunning) return;
    rainRunning = true;
    lastFrame = 0;
    cancelAnimationFrame(rainRaf);
    rainRaf = requestAnimationFrame(drawRain);
  }
  function stopRain() { rainRunning = false; cancelAnimationFrame(rainRaf); }
  function bootRain() {
    if (reducedMotion) { drawStaticRain(); return; }
    resizeRain(true);
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    startRain();
  }
  if (document.readyState === "complete") setTimeout(bootRain, 80);
  else window.addEventListener("load", function () { setTimeout(bootRain, 80); });
  window.addEventListener("resize", function () {
    if (reducedMotion) { if (window.innerWidth !== canvas.width) drawStaticRain(); }
    else resizeRain(false);
  }, { passive: true });
  document.addEventListener("visibilitychange", function () { if (document.hidden) stopRain(); else startRain(); });

  /* ==========================================================
     CLOCK — 1×, real time. Human speed is the whole point.
     ========================================================== */
  var liveClock = document.getElementById("liveClock");
  function tickClock() {
    liveClock.textContent = new Date().toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" });
  }
  tickClock();
  setInterval(tickClock, 1000);

  var topbar = document.querySelector(".topbar");
  function syncTopbar() { if (topbar) document.documentElement.style.setProperty("--topbar-h", topbar.offsetHeight + "px"); }
  syncTopbar();
  window.addEventListener("resize", syncTopbar, { passive: true });

  /* ==========================================================
     SHORT ARC — the Long Arc's nodes, five of them, about you.
     ========================================================== */
  var timeline = document.getElementById("timeline");
  NODES.forEach(function (n) {
    if (n.chapter) {
      var ch = document.createElement("div");
      ch.className = "arc-chapter";
      ch.setAttribute("role", "listitem");
      ch.innerHTML = "<h3>" + n.chapter + "</h3>";
      timeline.appendChild(ch);
    }
    var article = document.createElement("article");
    article.className = "era hist";
    article.id = "node-" + n.id;
    article.setAttribute("role", "listitem");
    article.innerHTML =
      '<button class="era-head" type="button" aria-expanded="false" aria-controls="body-' + n.id + '"><div>' +
      '<div class="era-meta"><span class="era-date">' + n.date + '</span></div>' +
      '<div class="era-title">' + n.title + '</div><div class="era-thesis">' + n.thesis + '</div></div>' +
      '<span class="era-chevron" aria-hidden="true">›</span></button>' +
      '<div class="era-body" id="body-' + n.id + '"><div class="era-body-inner"><div class="era-body-content">' +
      '<div class="panel"><h4>Signal</h4><p>' + n.signal + '</p></div>' +
      '<div class="panel landian"><h4>Reading</h4><p>' + n.reading + '</p></div>' +
      '<div class="accel"><div class="accel-head"><span>Dislocation vector</span><span>' + n.accelLabel +
      '</span></div><div class="accel-bar"><div class="accel-fill" style="--level:' + n.accel + '%"></div></div></div>' +
      '<div class="tags">' + n.tags.map(function (t) { return '<span class="tag">' + t + "</span>"; }).join("") + "</div>" +
      "</div></div></div>";
    timeline.appendChild(article);
  });
  timeline.addEventListener("click", function (ev) {
    var head = ev.target.closest(".era-head");
    if (!head) return;
    var open = head.closest(".era").classList.toggle("open");
    head.setAttribute("aria-expanded", open ? "true" : "false");
  });

  /* ==========================================================
     LEDGER — strokes on this device. Physics doesn't lie; neither should this.
     ========================================================== */
  var KEY = "teleoplexy.fm.v1";
  var BURN_MS = 20 * 60 * 1000;
  var state = load();

  function fresh() {
    var t = {};
    HOLDS.forEach(function (h) { t[h.id] = 0; });
    return { tally: t, history: [], timer: null, since: Date.now() };
  }
  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      if (!raw) return fresh();
      var s = JSON.parse(raw);
      var f = fresh();
      if (!s.tally) s.tally = f.tally;
      HOLDS.forEach(function (h) { if (typeof s.tally[h.id] !== "number") s.tally[h.id] = 0; });
      if (!Array.isArray(s.history)) s.history = [];
      if (!s.since) s.since = f.since;
      return s;
    } catch (e) { return fresh(); }
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {} }
  function credit(id) {
    state.tally[id] += 1;
    state.history.push(id);
    if (state.history.length > 500) state.history.shift();
  }
  function totalUnits() {
    var t = 0;
    HOLDS.forEach(function (h) { t += state.tally[h.id]; });
    return t;
  }
  function forceIndex() { return Math.round(100 * (1 - Math.exp(-totalUnits() / 45))); }
  function pipsFor(n) { return n <= 0 ? 0 : Math.min(5, Math.ceil(n / 4)); }
  function marksHtml(n) {
    var out = "", groups = Math.floor(n / 5), rest = n % 5;
    for (var i = 0; i < groups; i++) out += '<span class="g five"><i></i><i></i><i></i><i></i></span>';
    if (rest) { out += '<span class="g">'; for (var k = 0; k < rest; k++) out += "<i></i>"; out += "</span>"; }
    return out;
  }
  function mmss(ms) {
    var s = Math.max(0, Math.ceil(ms / 1000)), m = Math.floor(s / 60), r = s % 60;
    return (m < 10 ? "0" : "") + m + ":" + (r < 10 ? "0" : "") + r;
  }

  /* ==========================================================
     YOUR HORIZON — the scrubber, turned around.
     ========================================================== */
  var scrubber = document.getElementById("yearScrubber");
  var panel = document.getElementById("horizonPanel");
  var activeBand = 0;

  function meterHtml() {
    var max = 1;
    HOLDS.forEach(function (h) { max = Math.max(max, state.tally[h.id]); });
    var spark = '<div class="sparkline" aria-hidden="true">' + HOLDS.map(function (h) {
      var n = state.tally[h.id];
      var px = Math.max(3, Math.round(8 + 20 * (n / max)));
      return '<i class="' + (n > 0 ? "on" : "") + '" style="height:' + (n > 0 ? px : 3) + 'px"></i>';
    }).join("") + "</div>";
    var idx = forceIndex();
    return '<div class="scare-meter force"><div class="sm-label">Force index</div><div class="sm-value"><span class="forceNum">' +
      idx + '</span><em> / 100</em></div><div class="scare-bar"><div class="scare-fill forceFill" style="width:' + idx +
      '%"></div></div><div class="scare-note">Only goes up. Your pace.</div>' + spark + "</div>";
  }

  function renderBand(b) {
    var cards = [
      ["", "▲", "Body", b.body],
      ["amber", "▣", "Hands", b.hands],
      ["cyan", "⬡", "Keys", b.keys],
      ["teal", "◎", "Hearth", b.hearth],
      ["warm", "◇", "Sabbath", b.sabbath]
    ];
    panel.innerHTML =
      '<div class="hp-top"><div class="hp-year"><span>' + b.cal + "</span>" + b.off +
      '</div><p class="hp-thesis">' + b.thesis + "</p>" + meterHtml() + "</div>" +
      '<div class="hp-grid">' + cards.map(function (c) {
        return '<div class="hp-card ' + c[0] + '"><h4><span class="ico">' + c[1] + "</span> " + c[2] + "</h4><p>" + c[3] + "</p></div>";
      }).join("") + "</div>";
  }
  function refreshMeter() {
    var old = panel.querySelector(".scare-meter");
    if (!old) return;
    var wrap = document.createElement("div");
    wrap.innerHTML = meterHtml();
    old.replaceWith(wrap.firstChild);
  }
  function switchBand(idx, animate) {
    activeBand = idx;
    Array.prototype.forEach.call(scrubber.children, function (btn, i) {
      var on = i === idx;
      btn.classList.toggle("active", on);
      btn.setAttribute("aria-selected", on ? "true" : "false");
      if (on && animate) btn.scrollIntoView({ inline: "center", block: "nearest", behavior: reducedMotion ? "auto" : "smooth" });
    });
    if (!animate) { renderBand(BANDS[idx]); return; }
    panel.classList.add("switching");
    setTimeout(function () { renderBand(BANDS[idx]); panel.classList.remove("switching"); }, reducedMotion ? 0 : 180);
  }
  BANDS.forEach(function (b, idx) {
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "year-btn" + (idx === 0 ? " active" : "");
    btn.setAttribute("role", "tab");
    btn.setAttribute("aria-selected", idx === 0 ? "true" : "false");
    btn.setAttribute("aria-controls", "horizonPanel");
    btn.innerHTML = '<span class="yb-offset">' + b.off + '</span><span class="yb-cal">' + b.cal + "</span>";
    btn.addEventListener("click", function () { switchBand(idx, true); });
    scrubber.appendChild(btn);
  });
  switchBand(0, false);
  scrubber.addEventListener("keydown", function (ev) {
    var next = null;
    if (ev.key === "ArrowRight" || ev.key === "ArrowDown") next = Math.min(BANDS.length - 1, activeBand + 1);
    if (ev.key === "ArrowLeft" || ev.key === "ArrowUp") next = Math.max(0, activeBand - 1);
    if (next === null) return;
    ev.preventDefault();
    switchBand(next, true);
    scrubber.children[activeBand].focus();
  });
  (function () {
    var startX = null;
    panel.addEventListener("touchstart", function (ev) { startX = ev.changedTouches[0].screenX; }, { passive: true });
    panel.addEventListener("touchend", function (ev) {
      if (startX === null) return;
      var dx = ev.changedTouches[0].screenX - startX;
      startX = null;
      if (Math.abs(dx) < 50) return;
      switchBand(dx < 0 ? Math.min(BANDS.length - 1, activeBand + 1) : Math.max(0, activeBand - 1), true);
    }, { passive: true });
  })();

  /* ==========================================================
     THE HOLDS — fate cards you pick, with the tally inside.
     ========================================================== */
  var grid = document.getElementById("holdsGrid");
  function renderHolds() {
    grid.innerHTML = HOLDS.map(function (h) {
      var n = state.tally[h.id];
      var burning = state.timer && state.timer.hold === h.id;
      var pips = [1, 2, 3, 4, 5].map(function (k) { return '<i class="' + (k <= pipsFor(n) ? "on" : "") + '"></i>'; }).join("");
      var count = n + (h.day ? (n === 1 ? " day" : " days") : (n === 1 ? " unit" : " units"));
      var burn = h.day ? "" :
        '<button type="button" class="hold-btn' + (burning ? " burning" : "") + '" data-burn="' + h.id + '">' +
        (burning ? "Stop · " + mmss(state.timer.end - Date.now()) : "Burn 20 min") + "</button>";
      var log = '<button type="button" class="hold-btn" data-log="' + h.id + '">' + (h.day ? "Log a day" : "Log one") + "</button>";
      return '<article class="fate-card ' + h.cls + '" data-hold="' + h.id + '">' +
        '<div class="fate-rank">' + h.rank + '</div>' +
        '<h3 class="fate-title"><span class="ico">' + h.ico + "</span>" + h.title + "</h3>" +
        '<div class="fate-plaus"><span class="plaus-pips">' + pips + "</span><span>" + count + "</span></div>" +
        '<p class="fate-mech">' + h.mech + "</p>" +
        '<div class="fate-signals"><strong>The unit</strong>' + h.unit + " First one: " + h.first + "</div>" +
        '<div class="marks" aria-label="' + count + '">' + marksHtml(n) + "</div>" +
        '<div class="hold-actions">' + burn + log + "</div>" +
        "</article>";
    }).join("");
  }
  renderHolds();

  grid.addEventListener("click", function (ev) {
    var b = ev.target.closest("button");
    if (!b) return;
    if (b.dataset.log) { credit(b.dataset.log); save(); renderHolds(); refreshMeter(); return; }
    if (b.dataset.burn) {
      var id = b.dataset.burn;
      if (state.timer && state.timer.hold === id) state.timer = null;
      else state.timer = { hold: id, end: Date.now() + BURN_MS };
      save(); renderHolds();
    }
  });
  document.getElementById("undo").addEventListener("click", function () {
    var last = state.history.pop();
    if (last && state.tally[last] > 0) state.tally[last] -= 1;
    save(); renderHolds(); refreshMeter();
  });
  document.getElementById("reset").addEventListener("click", function () {
    if (!window.confirm("Wipe the ledger? The strokes don't come back.")) return;
    state = fresh(); save(); renderHolds(); refreshMeter();
  });
  setInterval(function () {
    if (!state.timer) return;
    if (Date.now() >= state.timer.end) {
      credit(state.timer.hold);
      state.timer = null;
      save(); renderHolds(); refreshMeter();
    } else {
      var btn = grid.querySelector('[data-burn="' + state.timer.hold + '"]');
      if (btn) btn.textContent = "Stop · " + mmss(state.timer.end - Date.now());
    }
  }, 1000);

  /* ==========================================================
     THE WAGER — Side B's voice, three lines, once.
     ========================================================== */
  var wager = document.getElementById("wager");
  if (wager && "IntersectionObserver" in window) {
    var wagerIO = new IntersectionObserver(function (entries) {
      if (!entries.some(function (e) { return e.isIntersecting; })) return;
      wagerIO.disconnect();
      wager.querySelectorAll(".fv-line").forEach(function (line, i) {
        setTimeout(function () { line.classList.add("in"); }, reducedMotion ? 0 : 300 + i * 1100);
      });
    }, { threshold: 0.4 });
    wagerIO.observe(wager);
  } else if (wager) {
    wager.querySelectorAll(".fv-line").forEach(function (l) { l.classList.add("in"); });
  }
}();
