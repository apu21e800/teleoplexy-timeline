function formatFlop(n) {
  if (n == null || !isFinite(n)) return 'unrecorded';
  if (n < 1000) return Math.round(n) + ' calculations';
  const exp = Math.floor(Math.log10(n));
  const mant = n / Math.pow(10, exp);
  const m = mant >= 9.95 ? 1.0 : Math.round(mant * 10) / 10;
  const e = mant >= 9.95 ? exp + 1 : exp;
  const sup = '⁰¹²³⁴⁵⁶⁷⁸⁹';
  const expStr = String(e).split('').map(function (c) {
    return c === '-' ? '⁻' : sup[Number(c)];
  }).join('');
  return m.toFixed(1).replace(/\.0$/, '') + ' × 10' + expStr + ' calculations';
}

function formatMultiple(ratio) {
  if (!isFinite(ratio) || ratio <= 0) return 'an unrecorded multiple';
  if (ratio < 10) return (Math.round(ratio * 10) / 10).toLocaleString('en-US') + ' times';
  if (ratio < 1e6) return Math.round(ratio).toLocaleString('en-US') + ' times';
  const exp = Math.floor(Math.log10(ratio));
  const mant = ratio / Math.pow(10, exp);
  const m = Math.round(mant * 10) / 10;
  return m.toFixed(1).replace(/\.0$/, '') + ' × 10' + String(exp).split('').map(function (c) {
    const s = '⁰¹²³⁴⁵⁶⁷⁸⁹';
    return s[Number(c)];
  }).join('') + ' times';
}

function lookupYear(y) {
  const row = R.byYear[y];
  if (row) return row;
  // clamp to nearest available for fertility/flop running max
  if (y < R.firstYear) return { flop: null, model: null, fert: null };
  // walk back for running max
  for (let yy = y; yy >= R.firstYear; yy--) {
    if (R.byYear[yy] && R.byYear[yy].flop != null) return R.byYear[yy];
  }
  return { flop: null, model: null, fert: null };
}

function ageAt(year, birth) {
  if (birth == null) return '-';
  if (year < birth) return '-';
  return year - birth;
}

/* ---------- Typing animation ---------- */
function typeText(el, text, done) {
  el.textContent = '';
  if (state.reducedMotion) {
    el.textContent = text;
    if (done) done();
    return;
  }
  let i = 0;
  const step = Math.max(1, Math.floor(text.length / 80));
  function tick() {
    i = Math.min(text.length, i + step);
    el.textContent = text.slice(0, i);
    if (i < text.length) {
      requestAnimationFrame(tick);
    } else if (done) {
      done();
    }
  }
  requestAnimationFrame(tick);
}

/* ---------- Hook ---------- */
function buildHookCopy(by) {
  const todayFlop = R.todayFlop;
  const todayStr = formatFlop(todayFlop);
  let computeLine;
  if (by < R.firstYear) {
    computeLine =
      'In ' + by + ' no AI training run was yet recorded. The first on record is Theseus (1950), ' +
      formatFlop(40) + '. This year\'s largest used ' + todayStr + '. That gap sits inside one human lifetime. Yours.';
  } else {
    const row = lookupYear(by);
    const thenFlop = row.flop;
    const thenStr = formatFlop(thenFlop);
    const mult = thenFlop ? todayFlop / thenFlop : null;
    computeLine =
      'In ' + by + ' the largest AI system ever trained used ' + thenStr +
      '. This year\'s used ' + todayStr +
      '. That\'s ' + formatMultiple(mult) + ' more, inside one human lifetime. Yours.';
  }

  const fertRow = lookupYear(by);
  let fertLine;
  if (fertRow.fert != null) {
    fertLine =
      'World fertility in ' + by + ' was ' + fertRow.fert.toFixed(3) +
      ' children per woman. In ' + R.latestFertYear + ' it was ' +
      R.latestFert.toFixed(3) + ' (UN WPP via OWID).';
  } else if (by > R.latestFertYear) {
    fertLine =
      'World fertility latest published year is ' + R.latestFertYear +
      ' at ' + R.latestFert.toFixed(3) + ' children per woman (UN WPP via OWID). Your birth year has no published World TFR in this table yet.';
  } else {
    fertLine =
      'World fertility for ' + by + ' is not in the 1950–' + R.latestFertYear +
      ' UN WPP series used here. Latest: ' + R.latestFert.toFixed(3) + ' in ' + R.latestFertYear + '.';
  }
  return { computeLine: computeLine, fertLine: fertLine };
}
