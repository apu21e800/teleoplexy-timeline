/* init */
(function () {
  if (!R) return;
  /* ---------- Events ---------- */
  document.getElementById('birth-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const input = document.getElementById('birth-year');
    const by = Number(input.value);
    if (!by || by < 1900 || by > ISSUE_YEAR) {
      input.setCustomValidity('Enter a year between 1900 and ' + ISSUE_YEAR);
      input.reportValidity();
      return;
    }
    input.setCustomValidity('');
    state.birthYear = by;
    // in-memory only; optional session for scroll restore
    try { sessionStorage.setItem('teleoplexy_by', String(by)); } catch (err) { /* ignore */ }

    const copy = buildHookCopy(by);
    const result = document.getElementById('hook-result');
    result.hidden = false;
    const computeEl = document.getElementById('hook-compute');
    const fertEl = document.getElementById('hook-fertility');
    fertEl.textContent = '';
    typeText(computeEl, copy.computeLine, function () {
      typeText(fertEl, copy.fertLine, function () {
        revealAll();
        document.getElementById('ledger').scrollIntoView({ behavior: state.reducedMotion ? 'auto' : 'smooth', block: 'start' });
      });
    });
  });

  document.getElementById('child-apply').addEventListener('click', function () {
    const v = Number(document.getElementById('child-year').value);
    if (!v || v < 1900 || v > 2056) return;
    state.childYear = v;
    renderLedger();
  });

  document.querySelectorAll('.fate-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      document.getElementById('fate-denied').hidden = false;
      document.getElementById('stream-wrap').hidden = false;
      document.getElementById('doors').hidden = false;
      updatePlacement();
      document.getElementById('stream-wrap').scrollIntoView({ behavior: state.reducedMotion ? 'auto' : 'smooth' });
    });
  });

  document.getElementById('assumptions-toggle').addEventListener('click', function () {
    const box = document.getElementById('assumptions');
    const open = box.hidden;
    box.hidden = !open;
    this.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  ['q-capital', 'q-screen', 'q-body'].forEach(function (id) {
    document.getElementById(id).addEventListener('change', updatePlacement);
  });

  document.getElementById('good-life').addEventListener('change', function () {
    document.getElementById('good-life-stamp').hidden = !this.checked;
  });

  document.getElementById('inherit-more').addEventListener('click', function () {
    const d = document.getElementById('inherit-detail');
    d.hidden = !d.hidden;
  });

  document.getElementById('share-download').addEventListener('click', downloadShare);
  document.getElementById('share-web').addEventListener('click', webShare);

  // Restore session birth year quietly into field only
  try {
    const saved = sessionStorage.getItem('teleoplexy_by');
    if (saved) document.getElementById('birth-year').value = saved;
  } catch (err) { /* ignore */ }

  maybeShowCta();
})();
