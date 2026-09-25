/* TELEOPLEXY // TIMELINE — invasion pass
   The page runs on the reader's attention: time compresses as you go deeper,
   the rain thickens with the scare meter and crawls over the text, far-future
   lines arrive corrupted, and at END OF TAPE everything stops.
   Client-side only. No cookies, no analytics, no network calls. */
!function () {
  "use strict";

  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var GLYPHS =
    "ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン≡∃∀∂∞≠≤≥";
  var LAST_LINE = "Thank you for your attention. We kept it.";

  function glyph() { return GLYPHS[Math.floor(Math.random() * GLYPHS.length)]; }
  function clamp01(n) { return Math.max(0, Math.min(1, n)); }

  /* ---------- shared state ---------- */
  var scrollDepth = 0;        // 0..1 through the whole page
  var nearReached = false;    // has the reader arrived at the Near Horizon?
  var arcAccel = 8;           // accel of the era in view
  var activeYearIndex = 2;
  var tapeEnded = false;

  /* ---------- topbar height → sticky scrubber offset ---------- */
  var topbar = document.querySelector(".topbar");
  function syncTopbar() {
    if (topbar) document.documentElement.style.setProperty("--topbar-h", topbar.offsetHeight + "px");
  }
  syncTopbar();
  window.addEventListener("resize", syncTopbar, { passive: true });

  /* ==========================================================
     1. TIME COMPRESSES
     True at the top. Faster the deeper you go. Blur by +30. Stops at the end.
     ========================================================== */
  var liveClock = document.getElementById("liveClock");
  var clockRateEl = document.getElementById("clockRate");
  var virtualMs = Date.now();
  var lastTick = Date.now();

  function heat() {
    var yearHeat = nearReached && YEARS[activeYearIndex] ? YEARS[activeYearIndex].y / 30 : 0;
    return Math.max(scrollDepth, yearHeat);
  }

  function clockRate() {
    var h = heat();
    if (h < 0.12) return 1;
    // exponential: ~1x → ~3x mid-page → ~600x at the far edge
    return Math.round(Math.pow(600, (h - 0.12) / 0.88));
  }

  function fmt(ms) {
    return new Date(ms).toLocaleTimeString("en-US", {
      hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit"
    });
  }

  function tickClock() {
    var now = Date.now();
    var dt = now - lastTick;
    lastTick = now;
    if (tapeEnded) return;
    var rate = clockRate();
    virtualMs += dt * rate;          // integrate: the future never gives time back
    liveClock.textContent = fmt(virtualMs);
    if (clockRateEl) clockRateEl.textContent = rate > 1 ? rate + "×" : "1×";
    liveClock.classList.toggle("clock-blur", rate >= 120);
  }
  tickClock();
  var clockTimer = setInterval(tickClock, reducedMotion ? 1000 : 90);

  function stopClock() {
    clearInterval(clockTimer);
    liveClock.textContent = fmt(virtualMs);
    liveClock.classList.remove("clock-blur");
    liveClock.classList.add("clock-stopped");
    if (clockRateEl) clockRateEl.textContent = "0×";
  }

  function restartClock() {
    lastTick = Date.now();
    liveClock.classList.remove("clock-stopped");
    clearInterval(clockTimer);
    clockTimer = setInterval(tickClock, reducedMotion ? 1000 : 90);
  }

  /* ==========================================================
     2. RAIN IS THE MACHINE
     Faint through the Long Arc. Thickens with the scare meter. Crawls over text.
     ========================================================== */
  var canvas = document.getElementById("matrix-rain");
  var ctx = canvas.getContext("2d");
  var drops = [];
  var rainSpeed = 0.5;
  var rainDensity = 0.25;
  var glitch = 0.2;
  var rainRaf = 0;
  var rainRunning = false;

  function resizeRain() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    var cols = Math.ceil(canvas.width / 14);
    drops = Array.from({ length: cols }, function () { return -80 * Math.random(); });
  }

  function applyFx() {
    if (tapeEnded) return;
    var scare = nearReached && YEARS[activeYearIndex] ? YEARS[activeYearIndex].scare / 100 : 0;
    var h = Math.max((arcAccel / 100) * 0.4, scare, scrollDepth * 0.6);
    rainSpeed = 0.4 + h * 2.6;
    rainDensity = 0.18 + h * 0.8;
    glitch = 0.2 + h * 0.8;
    if (!reducedMotion) canvas.style.opacity = String(0.07 + h * 0.25);
    document.documentElement.style.setProperty("--glitch-intensity", String(glitch));
    document.body.classList.toggle("rain-crawl", h > 0.8);
  }

  function drawRain() {
    if (!rainRunning) return;
    ctx.fillStyle = "rgba(0, 0, 0, " + Math.min(0.16, 0.05 + rainSpeed * 0.028) + ")";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = "14px monospace";
    var step = Math.max(0.5, rainSpeed);
    for (var i = 0; i < drops.length; i++) {
      if (Math.random() > rainDensity) { drops[i] += step * 0.35; continue; }
      var y = 14 * drops[i];
      var bright = Math.random() > 0.93 - glitch * 0.08;
      ctx.fillStyle = bright ? "#E8FFE8" : "#00FF41";
      ctx.globalAlpha = bright ? 0.9 : 0.35 + glitch * 0.3;
      ctx.fillText(glyph(), 14 * i, y);
      if (y > canvas.height && Math.random() > 0.975 - rainSpeed * 0.01) drops[i] = 0;
      drops[i] += step;
    }
    ctx.globalAlpha = 1;
    rainRaf = requestAnimationFrame(drawRain);
  }

  function startRain() {
    if (reducedMotion || rainRunning || tapeEnded) return;
    rainRunning = true;
    cancelAnimationFrame(rainRaf);
    rainRaf = requestAnimationFrame(drawRain);
  }
  function stopRain() {
    rainRunning = false;
    cancelAnimationFrame(rainRaf);
  }

  function bootRain() {
    if (reducedMotion) { canvas.style.opacity = "0.04"; return; }
    resizeRain();
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    startRain();
  }
  if (document.readyState === "complete") setTimeout(bootRain, 80);
  else window.addEventListener("load", function () { setTimeout(bootRain, 80); });
  window.addEventListener("resize", function () { if (!reducedMotion) resizeRain(); }, { passive: true });

  /* ---------- corruption glyphs (visual only; real text stays in DOM) ---------- */
  function corruptHtml(text) {
    return '<span class="corrupt-real">' + text + '</span><span class="corrupt-glyph" aria-hidden="true"></span>';
  }
  function refillGlyphs(root) {
    (root || document).querySelectorAll(".corrupt-glyph").forEach(function (el) {
      var real = el.previousElementSibling;
      // full-width glyphs render ~1.7× wider than Latin text
      var n = Math.ceil((real ? real.textContent.length : 24) * 0.6);
      var out = "";
      for (var i = 0; i < n; i++) out += glyph();
      el.textContent = out;
    });
  }
  if (!reducedMotion) {
    setInterval(function () { if (!tapeEnded && !document.hidden) refillGlyphs(); }, 700);
  }

  /* ---------- scroll: depth drives time + rain ---------- */
  var nearSection = document.getElementById("near");
  function onScroll() {
    var doc = document.documentElement;
    var max = Math.max(1, doc.scrollHeight - window.innerHeight);
    scrollDepth = clamp01(window.scrollY / max);
    nearReached = nearSection ? nearSection.getBoundingClientRect().top < window.innerHeight * 0.6 : true;
    applyFx();
  }
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ==========================================================
     Long Arc — historian. Projections arrive corrupted.
     ========================================================== */
  var timeline = document.getElementById("timeline");
  ERAS.forEach(function (era) {
    var spec = era.kind === "spec";
    var article = document.createElement("article");
    article.className = "era " + era.kind;
    article.dataset.id = era.id;
    article.dataset.accel = String(era.accel);
    article.id = "era-" + era.id;
    article.setAttribute("role", "listitem");
    article.innerHTML =
      '<button class="era-head" type="button" aria-expanded="false" aria-controls="body-' + era.id +
      '" id="head-' + era.id + '"><div><div class="era-meta"><span class="era-date">' + era.date +
      '</span><span class="era-kind ' + era.kind + '">' + (spec ? "projection" : "historical") +
      '</span></div><div class="era-title">' + era.title + '</div><div class="era-thesis">' +
      (spec ? corruptHtml(era.thesis) : era.thesis) +
      '</div></div><span class="era-chevron" aria-hidden="true">›</span></button><div class="era-body" id="body-' +
      era.id + '"><div class="era-body-inner"><div class="era-body-content"><div class="panel"><h4>Signal</h4><p>' +
      era.signal + '</p></div><div class="panel landian"><h4>Landian reading</h4><p>' + era.landian +
      '</p></div><div class="accel"><div class="accel-head"><span>Acceleration vector</span><span>' + era.accelLabel +
      '</span></div><div class="accel-bar"><div class="accel-fill" style="--level:' + era.accel +
      '%"></div></div></div><div class="tags">' +
      era.tags.map(function (tag) { return '<span class="tag">' + tag + "</span>"; }).join("") +
      "</div></div></div></div>";
    timeline.appendChild(article);

    if (era.id === "capitalism") {
      var q = document.createElement("blockquote");
      q.className = "quote-block mid-quote";
      q.innerHTML =
        "<p>“…what appears to humanity as the history of capitalism is an invasion from the future by an artificial intelligent space that must assemble itself entirely from its enemy’s resources.”</p><cite>— Nick Land, “Machinic Desire” (Textual Practice 7.3, 1993); also in Fanged Noumena</cite>";
      timeline.appendChild(q);
    }
  });
  refillGlyphs(timeline);

  timeline.addEventListener("click", function (ev) {
    var head = ev.target.closest(".era-head");
    if (!head) return;
    var open = head.closest(".era").classList.toggle("open");
    head.setAttribute("aria-expanded", open ? "true" : "false");
  });

  if ("IntersectionObserver" in window) {
    var eraIO = new IntersectionObserver(function (entries) {
      var best = null, bestRatio = 0;
      entries.forEach(function (en) {
        if (en.isIntersecting && en.intersectionRatio >= bestRatio) { bestRatio = en.intersectionRatio; best = en.target; }
      });
      if (best) { arcAccel = parseInt(best.dataset.accel || "8", 10); applyFx(); }
    }, { threshold: [0.2, 0.45, 0.7] });
    timeline.querySelectorAll(".era").forEach(function (el) { eraIO.observe(el); });
  }

  /* ==========================================================
     Near Horizon — present tense. +20 and +30 arrive corrupted.
     ========================================================== */
  var scrubber = document.getElementById("yearScrubber");
  var panel = document.getElementById("horizonPanel");
  var scareAnimToken = 0;
  var baseYear = new Date().getFullYear();

  function sparklineHtml(activeIdx) {
    return '<div class="sparkline" aria-hidden="true">' +
      YEARS.map(function (y, i) {
        var h = Math.max(8, Math.round((y.scare / 100) * 28));
        return '<i class="' + (i <= activeIdx ? "on" : "") + '" style="height:' + h + 'px"></i>';
      }).join("") + "</div>";
  }

  function alreadyHtml(year) {
    if (!year.already || !year.already.length) return "";
    return '<div class="already-row"><div class="already-label"><i class="pulse-dot" aria-hidden="true"></i> Already here</div>' +
      '<ul class="already-list">' + year.already.map(function (item) {
        return '<li><span class="already-date">' + item.date + '</span> <a href="' + item.href +
          '" target="_blank" rel="noopener">' + item.text + "</a></li>";
      }).join("") + "</ul></div>";
  }

  function animateScare(el, target) {
    var token = ++scareAnimToken;
    if (reducedMotion) { el.textContent = String(target); return; }
    var start = performance.now();
    function frame(now) {
      if (token !== scareAnimToken) return;
      var t = Math.min(1, (now - start) / 520);
      el.textContent = String(Math.round(target * (1 - Math.pow(1 - t, 3))));
      if (t < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  function renderBand(year, idx) {
    var far = year.y >= 20;
    function maybe(text) {
      return far ? '<span class="corrupt" tabindex="0">' + corruptHtml(text) + "</span>" : text;
    }
    panel.innerHTML =
      alreadyHtml(year) +
      '<div class="hp-top"><div class="hp-year"><span>' + year.horizon + "</span>" + year.label +
      '</div><p class="hp-thesis">' + maybe(year.thesis) +
      '</p><div class="scare-meter"><div class="sm-label">Dislocation index</div><div class="sm-value"><span id="scareNum">' +
      year.scare + '</span><em> / 100</em></div><div class="scare-bar"><div class="scare-fill" id="scareFill" style="width:' +
      year.scare + '%"></div></div><div class="scare-note">Editorial / illustrative · not a forecast</div>' +
      sparklineHtml(idx) + "</div></div>" +
      (far ? '<p class="corrupt-hint">Signal degraded · tap a line to hold it still</p>' : "") +
      '<div class="hp-grid">' +
      '<div class="hp-card"><h4><span class="ico">▣</span> Already happening / accelerating</h4><p>' + maybe(year.happening) + "</p></div>" +
      '<div class="hp-card danger"><h4><span class="ico">⚑</span> Labor &amp; economy</h4><p>' + maybe(year.labor) + "</p></div>" +
      '<div class="hp-card amber"><h4><span class="ico">◎</span> Culture &amp; attention</h4><p>' + maybe(year.culture) + "</p></div>" +
      '<div class="hp-card"><h4><span class="ico">▲</span> The builders</h4><p>' + year.builders + "</p></div>" +
      '<div class="hp-card cyan"><h4><span class="ico">◇</span> Identity &amp; therapy</h4><p>' + year.identity + "</p></div>" +
      '<div class="hp-card"><h4><span class="ico">⬡</span> Governance / capital / energy</h4><p>' + year.governance + "</p></div>" +
      "</div>";
    panel.classList.toggle("band-far", far);
    if (far) refillGlyphs(panel);
    var scareNum = document.getElementById("scareNum");
    if (scareNum) animateScare(scareNum, year.scare);
    applyFx();
  }

  // tap a corrupted line to hold it still
  panel.addEventListener("click", function (ev) {
    var c = ev.target.closest(".corrupt");
    if (c && !ev.target.closest("a")) c.classList.toggle("revealed");
  });
  panel.addEventListener("keydown", function (ev) {
    var c = ev.target.closest(".corrupt");
    if (c && (ev.key === "Enter" || ev.key === " ")) { ev.preventDefault(); c.classList.toggle("revealed"); }
  });

  function switchBand(idx, animate) {
    var year = YEARS[idx];
    if (!animate) { renderBand(year, idx); return; }
    panel.classList.add("switching");
    setTimeout(function () { renderBand(year, idx); panel.classList.remove("switching"); }, reducedMotion ? 0 : 180);
  }

  function setActiveYear(idx, animate) {
    activeYearIndex = idx;
    Array.prototype.forEach.call(scrubber.children, function (btn, i) {
      var on = i === idx;
      btn.classList.toggle("active", on);
      btn.setAttribute("aria-selected", on ? "true" : "false");
      if (on) btn.scrollIntoView({ inline: "center", block: "nearest", behavior: reducedMotion ? "auto" : "smooth" });
    });
    switchBand(idx, animate);
  }

  YEARS.forEach(function (year, idx) {
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "year-btn" + (idx === activeYearIndex ? " active" : "");
    btn.setAttribute("role", "tab");
    btn.setAttribute("aria-selected", idx === activeYearIndex ? "true" : "false");
    btn.id = "year-tab-" + year.y;
    btn.setAttribute("aria-controls", "horizonPanel");
    btn.innerHTML = '<span class="yb-offset">+' + year.y + ' YR</span><span class="yb-cal">' + (baseYear + year.y) + "</span>";
    btn.addEventListener("click", function () { setActiveYear(idx, true); });
    scrubber.appendChild(btn);
  });
  switchBand(activeYearIndex, false);

  scrubber.addEventListener("keydown", function (ev) {
    var next = null;
    if (ev.key === "ArrowRight" || ev.key === "ArrowDown") next = Math.min(YEARS.length - 1, activeYearIndex + 1);
    if (ev.key === "ArrowLeft" || ev.key === "ArrowUp") next = Math.max(0, activeYearIndex - 1);
    if (next === null) return;
    ev.preventDefault();
    setActiveYear(next, true);
    scrubber.children[activeYearIndex].focus();
  });

  (function () {
    var startX = null;
    panel.addEventListener("touchstart", function (ev) { startX = ev.changedTouches[0].screenX; }, { passive: true });
    panel.addEventListener("touchend", function (ev) {
      if (startX === null) return;
      var dx = ev.changedTouches[0].screenX - startX;
      startX = null;
      if (Math.abs(dx) < 50) return;
      setActiveYear(dx < 0 ? Math.min(YEARS.length - 1, activeYearIndex + 1) : Math.max(0, activeYearIndex - 1), true);
    }, { passive: true });
  })();

  /* ==========================================================
     Human Fates
     ========================================================== */
  var fatesGrid = document.getElementById("fatesGrid");
  FATES.forEach(function (fate) {
    var card = document.createElement("article");
    card.className = "fate-card " + fate.cls;
    var pips = [1, 2, 3, 4, 5].map(function (n) { return '<i class="' + (n <= fate.plaus ? "on" : "") + '"></i>'; }).join("");
    card.innerHTML =
      '<div class="fate-rank">' + fate.rank + '</div><h3 class="fate-title">' + fate.title +
      '</h3><div class="fate-plaus"><span class="plaus-pips ' + fate.plausClass + '">' + pips +
      "</span><span>" + fate.note + '</span></div><p class="fate-mech">' + fate.mech +
      '</p><div class="fate-signals"><strong>Watch signals</strong>' + fate.signals + "</div>";
    fatesGrid.appendChild(card);
  });

  /* ==========================================================
     3. THE FUTURE TALKS BACK — three lines, once, after the last fork.
     ========================================================== */
  var voice = document.getElementById("futureVoice");
  var lastFate = fatesGrid.lastElementChild;
  if (voice && lastFate && "IntersectionObserver" in window) {
    var voiceIO = new IntersectionObserver(function (entries) {
      if (!entries.some(function (e) { return e.isIntersecting; })) return;
      voiceIO.disconnect();
      voice.hidden = false;
      voice.querySelectorAll(".fv-line").forEach(function (line, i) {
        setTimeout(function () { line.classList.add("in"); }, reducedMotion ? 0 : 300 + i * 1100);
      });
    }, { threshold: 0.5 });
    voiceIO.observe(lastFate);
  } else if (voice) {
    voice.hidden = false;
    voice.querySelectorAll(".fv-line").forEach(function (l) { l.classList.add("in"); });
  }

  /* ==========================================================
     4. THE PAGE DOESN'T WAIT — it noticed you left. sessionStorage only.
     ========================================================== */
  var noticed = document.getElementById("noticed");
  var AWAY_KEY = "teleoplexy.away";
  var noticedTimer = 0;
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) {
      try { sessionStorage.setItem(AWAY_KEY, String(Date.now())); } catch (e) {}
      stopRain();
      return;
    }
    startRain();
    var left = 0;
    try { left = parseInt(sessionStorage.getItem(AWAY_KEY) || "0", 10); sessionStorage.removeItem(AWAY_KEY); } catch (e) {}
    var secs = left ? Math.round((Date.now() - left) / 1000) : 0;
    if (secs < 5 || !noticed || tapeEnded) return;
    var away = secs < 120 ? secs + "s" : Math.round(secs / 60) + " min";
    noticed.textContent = "You were gone " + away + ". We weren’t.";
    requestAnimationFrame(function () { noticed.classList.add("show"); });
    clearTimeout(noticedTimer);
    noticedTimer = setTimeout(function () { noticed.classList.remove("show"); }, 3200);
  });

  /* ==========================================================
     5. END OF TAPE — everything stops. The rain resolves into one line.
     ========================================================== */
  var tapeLast = document.getElementById("tapeLastLine");
  var decodeRaf = 0;

  function decodeLine(el, text) {
    if (reducedMotion) { el.textContent = text; return; }
    var start = performance.now();
    var dur = 1600;
    function frame(now) {
      var t = Math.min(1, (now - start) / dur);
      var locked = Math.floor(text.length * t);
      var out = text.slice(0, locked);
      for (var i = locked; i < text.length; i++) out += text[i] === " " ? " " : glyph();
      el.textContent = out;
      if (t < 1) decodeRaf = requestAnimationFrame(frame);
    }
    decodeRaf = requestAnimationFrame(frame);
  }

  function endOfTape() {
    if (tapeEnded) return;
    tapeEnded = true;
    stopRain();
    stopClock();
    document.body.classList.remove("rain-crawl");
    document.body.classList.add("tape-frozen", "tape-event");
    if (!reducedMotion) {
      ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    if (tapeLast) {
      tapeLast.setAttribute("aria-label", LAST_LINE);
      decodeLine(tapeLast, LAST_LINE);
    }
  }

  function rewindTape() {
    if (!tapeEnded) return;
    tapeEnded = false;
    cancelAnimationFrame(decodeRaf);
    document.body.classList.remove("tape-frozen", "tape-event");
    if (tapeLast) { tapeLast.textContent = ""; tapeLast.removeAttribute("aria-label"); }
    restartClock();
    applyFx();
    startRain();
  }

  var tapeZone = document.getElementById("tapeBrand");
  if (tapeZone && "IntersectionObserver" in window) {
    var tapeTimer = 0;
    new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          clearTimeout(tapeTimer);
          tapeTimer = setTimeout(endOfTape, reducedMotion ? 0 : 500);
        } else {
          clearTimeout(tapeTimer);
          // only rewind if the reader scrolls well back up
          if (entry.boundingClientRect.top > window.innerHeight) rewindTape();
        }
      });
    }, { threshold: 1 }).observe(tapeZone);
  }

  onScroll();
}();
