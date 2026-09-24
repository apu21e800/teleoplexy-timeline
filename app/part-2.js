function renderLedger() {
  const tbody = document.getElementById('ledger-body');
  const childCol = document.querySelectorAll('.child-col');
  const showChild = state.childYear != null;
  childCol.forEach(function (el) { el.hidden = !showChild; });

  tbody.innerHTML = '';
  LEDGER.forEach(function (row) {
    const tr = document.createElement('tr');
    if (row.here) tr.classList.add('here');
    if (row.band === 'dense' || row.band === 'here') tr.classList.add('dense');
    if (row.band === 'proj') tr.classList.add('proj');

    const yLabel = row.y < 0 ? Math.abs(row.y) + ' BCE' : String(row.y);
    const age = row.y < 0 ? '-' : ageAt(row.y, state.birthYear);
    const childAge = showChild ? (row.y < 0 ? '-' : ageAt(row.y, state.childYear)) : null;

    let srcCell;
    if (row.srcUrl) {
      srcCell = '<a href="' + row.srcUrl + '" rel="noopener" target="_blank">' + escapeHtml(row.src) + '</a>';
    } else if (row.trip) {
      srcCell = '<span class="tripwire">' + escapeHtml(row.trip) + '</span>';
    } else {
      srcCell = escapeHtml(row.src || '');
    }

    tr.innerHTML =
      '<td>' + escapeHtml(yLabel) + '</td>' +
      '<td>' + escapeHtml(row.event) + '</td>' +
      '<td class="age-col">' + escapeHtml(String(age)) + '</td>' +
      (showChild ? '<td class="age-col child-col">' + escapeHtml(String(childAge)) + '</td>' : '') +
      '<td><span class="conf" aria-label="' + row.confLabel + '">' + row.conf + '</span></td>' +
      '<td>' + srcCell + '</td>';
    tbody.appendChild(tr);
  });
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/* ---------- Instrument ---------- */
function updateInstrument() {
  const flopEl = document.getElementById('inst-flop');
  const fertEl = document.getElementById('inst-fert');
  flopEl.textContent = formatFlop(R.todayFlop).replace(' calculations', '');
  fertEl.textContent = R.latestFert.toFixed(3) + ' (' + R.latestFertYear + ')';
  fertEl.classList.add('proj'); // latest is lagged
}

/* ---------- Stream chart (illustrative) ---------- */
// Shares over years - illustrative only
function drawStream() {
  const svg = document.getElementById('stream-chart');
  const W = 720, H = 280;
  const pad = { t: 24, r: 16, b: 36, l: 40 };
  const iw = W - pad.l - pad.r;
  const ih = H - pad.t - pad.b;
  const keys = ['upgrade', 'decline', 'zoo', 'exit'];
  const n = STREAM_YEARS.length;

  function x(i) { return pad.l + (i / (n - 1)) * iw; }
  function y(v) { return pad.t + (1 - v) * ih; }

  // Build stacked paths
  let html = '';
  // grid
  STREAM_YEARS.forEach(function (yr, i) {
    html += '<text x="' + x(i) + '" y="' + (H - 10) + '" text-anchor="middle" font-size="11" fill="#9A9488" font-family="Public Sans,sans-serif">' + yr + '</text>';
  });

  // extinction shadow (top band, not stacked into 100%)
  let extPath = 'M';
  STREAM.extinction.forEach(function (v, i) {
    extPath += (i ? ' L' : '') + x(i) + ' ' + y(1);
  });
  for (let i = n - 1; i >= 0; i--) {
    extPath += ' L' + x(i) + ' ' + y(1 - STREAM.extinction[i]);
  }
  extPath += ' Z';
  html += '<path d="' + extPath + '" fill="' + STREAM_COLORS.extinction + '" />';
  html += '<text x="' + (pad.l + 4) + '" y="' + (pad.t + 12) + '" font-size="10" fill="#C8102E" font-family="Public Sans,sans-serif">Extinction shadow (illustrative)</text>';

  // stacked areas bottom-up
  const stack = STREAM_YEARS.map(function () { return 0; });
  keys.forEach(function (key) {
    const top = [];
    const bot = stack.slice();
    STREAM[key].forEach(function (v, i) {
      stack[i] += v;
      top.push(stack[i]);
    });
    let d = 'M';
    top.forEach(function (v, i) { d += (i ? ' L' : '') + x(i) + ' ' + y(v); });
    for (let i = n - 1; i >= 0; i--) {
      d += ' L' + x(i) + ' ' + y(bot[i]);
    }
    d += ' Z';
    html += '<path d="' + d + '" fill="' + STREAM_COLORS[key] + '" fill-opacity="' + (key === 'zoo' ? '0.9' : '0.85') + '" stroke="#F4F1EA" stroke-width="0.5" />';
  });

  // legend
  const legend = [
    { k: 'upgrade', l: 'Upgrade / merger' },
    { k: 'decline', l: 'Managed decline' },
    { k: 'zoo', l: 'Zoo / stewardship' },
    { k: 'exit', l: 'Exit' },
  ];
  legend.forEach(function (item, i) {
    const lx = pad.l + i * 160;
    html += '<rect x="' + lx + '" y="4" width="10" height="10" fill="' + STREAM_COLORS[item.k] + '" />';
    html += '<text x="' + (lx + 14) + '" y="13" font-size="10" fill="#1B2A4A" font-family="Public Sans,sans-serif">' + item.l + '</text>';
  });

  // reader dot
  if (state.stream) {
    const si = keys.indexOf(state.stream);
    const mid = Math.floor(n / 2);
    let base = 0;
    for (let k = 0; k < si; k++) base += STREAM[keys[k]][mid];
    const midY = y(base + STREAM[state.stream][mid] / 2);
    html += '<circle cx="' + x(mid) + '" cy="' + midY + '" r="6" fill="#C8102E" stroke="#F4F1EA" stroke-width="2" />';
    html += '<text x="' + (x(mid) + 10) + '" y="' + (midY + 4) + '" font-size="11" fill="#C8102E" font-family="Courier Prime,monospace">You</text>';
  }

  svg.innerHTML = html;
}

function classifyStream() {
  const a = state.answers;
  // Ownership path
  if (a.capital) {
    state.stream = 'upgrade';
    return {
      stream: 'upgrade',
      move: 'Losing equity exposure would slide you toward Clientage or Exit.',
    };
  }
  if (a.body && !a.screen) {
    state.stream = 'zoo';
    return {
      stream: 'zoo',
      move: 'Automating your presence work would move you toward Operator risk or decline entertainment.',
    };
  }
  if (a.screen) {
    state.stream = 'decline';
    return {
      stream: 'decline',
      move: 'Taking Operator equity before agents run month-scale work moves you toward upgrade. Exit remains open.',
    };
  }
  state.stream = 'exit';
  return {
    stream: 'exit',
    move: 'Acquiring screen exposure without capital moves you toward decline. Capital moves you toward upgrade.',
  };
}

function updatePlacement() {
  state.answers.capital = document.getElementById('q-capital').checked;
  state.answers.screen = document.getElementById('q-screen').checked;
  state.answers.body = document.getElementById('q-body').checked;
  const r = classifyStream();
  const labels = {
    upgrade: 'Upgrade / merger',
    decline: 'Managed decline and entertainment',
    zoo: 'Zoo / stewardship',
    exit: 'Exit',
  };
  document.getElementById('reader-dot-note').textContent =
    'Your illustrative placement: ' + labels[r.stream] + '.';
  document.getElementById('placement-line').textContent = r.move;
  drawStream();
  updateDoors();
  drawShareCard();
}

/* ---------- Doors ---------- */
function operatorCloseYear() {
  // METR: o3 ~110 min as of ~2025; doubling ~7 months; month (~20 work days * 8h = 9600 min)
  // From 110 min to 9600 min: log2(9600/110) * 7 months ≈ 6.45 * 7 ≈ 45 months ≈ late 2028–early 2029 from Mar 2025
  // Brief says late 2028–early 2031. Use 2030 midpoint.
  return 2030;
}

function doorsData() {
  const opClose = operatorCloseYear();
  const ageAtClose = function (y) {
    return state.birthYear != null ? (y - state.birthYear) : '-';
  };
  const open = openDoors();
  return [
    {
      id: 'ownership',
      title: 'Ownership',
      elig: 'Equity in compute, energy, land, or labs.',
      cost: 'Price rises with scarcity. Never closes.',
      window: 'Open indefinitely. Your age is not a clock.',
      conf: '●',
      confLabel: 'measured',
      lit: open.ownership,
    },
    {
      id: 'operator',
      title: 'Operator',
      elig: 'Direct machine labor convertible to ownership before agents run ~1 month of human work.',
      cost: 'Skill and access depreciating on the METR clock.',
      window: 'Closes around ' + opClose + ' if trend holds (your age ' + ageAtClose(opClose) + ').',
      conf: '◐',
      confLabel: 'on trajectory',
      lit: open.operator,
    },
    {
      id: 'irreducible',
      title: 'Irreducible',
      elig: 'Body until cheap general robots; signature until law changes; trust lasts longest.',
      cost: 'Body ◐; signature ○; trust ○.',
      window: 'Body window: ~2036 band. Signature: open until statute. Trust: longest.',
      conf: '◐',
      confLabel: 'on trajectory',
      lit: open.irreducible,
    },
    {
      id: 'clientage',
      title: 'Clientage',
      elig: 'Useful to whoever allocates. No special eligibility.',
      cost: 'Most reliable. Least free.',
      window: 'Open while allocators need clients.',
      conf: '◐',
      confLabel: 'on trajectory',
      lit: open.clientage,
    },
    {
      id: 'exit',
      title: 'Exit',
      elig: 'Own stack: money, compute, food, energy, land, community rules. Refuse tranquilizer. No special eligibility.',
      cost: 'Full self-provision. Cite Hirschman, Exit, Voice, and Loyalty (1970).',
      window: 'Open while private money and local compute remain legal. Tripwires: programmable money as default; local model restrictions.',
      conf: '◐',
      confLabel: 'on trajectory',
      lit: open.exit,
    },
  ];
}
