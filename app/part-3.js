function openDoors() {
  const a = state.answers;
  return {
    ownership: !!a.capital,
    operator: !!a.screen && !a.capital,
    irreducible: !!a.body,
    clientage: true,
    exit: true,
  };
}

function updateDoors() {
  const list = document.getElementById('doors-list');
  list.innerHTML = '';
  doorsData().forEach(function (d) {
    const el = document.createElement('article');
    el.className = 'door' + (d.lit ? ' open' : '');
    el.innerHTML =
      '<h4>' + escapeHtml(d.title) +
      ' <span class="conf" aria-label="' + d.confLabel + '">' + d.conf + '</span>' +
      (d.lit ? ' · open today' : '') + '</h4>' +
      '<p class="elig">' + escapeHtml(d.elig) + '</p>' +
      '<p class="meta">Cost: ' + escapeHtml(d.cost) + '</p>' +
      '<p class="meta">Window: ' + escapeHtml(d.window) + '</p>';
    list.appendChild(el);
  });
}

/* ---------- Conditions ---------- */
function renderConditions() {
  const list = document.getElementById('conditions-list');
  list.innerHTML = '';
  let met = 0;
  CONDITIONS.forEach(function (c) {
    if (c.tripped) met++;
    const el = document.createElement('article');
    el.className = 'cond' + (c.tripped ? ' tripped' : '');
    const srcHtml = c.srcUrl
      ? '<a href="' + c.srcUrl + '" rel="noopener" target="_blank">' + escapeHtml(c.src) + '</a>'
      : escapeHtml(c.src || '');
    el.innerHTML =
      '<div class="cond-cat">' + escapeHtml(c.cat) + '</div>' +
      '<div class="cond-stamp">' + (c.tripped ? 'TRIPPED' : 'OPEN') + '</div>' +
      '<div class="cond-body"><strong>' + escapeHtml(c.title) + '</strong>' +
      escapeHtml(c.detail) +
      (c.asOf ? ' As of ' + escapeHtml(c.asOf) + '.' : '') +
      '<div class="src">' + srcHtml + '</div></div>';
    list.appendChild(el);
  });
  state.conditionsMet = met;
  state.conditionsTotal = CONDITIONS.length;
  document.getElementById('cond-headline').textContent =
    met + ' of ' + CONDITIONS.length + ' conditions met.';
}

/* ---------- Close / Land age ---------- */
function renderClose() {
  const by = state.birthYear;
  const landYear = 1994; // Meltdown presented
  let line;
  if (by > landYear) {
    line = 'He wrote it ' + (by - landYear) + ' years before you were born.';
  } else if (by === landYear) {
    line = 'You were 0. He wrote it the year you were born.';
  } else {
    line = 'You were ' + (landYear - by) + '.';
  }
  document.getElementById('land-age').textContent = line;
}

/* ---------- Share card ---------- */
function drawShareCard() {
  const canvas = document.getElementById('share-canvas');
  if (!canvas || state.birthYear == null) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width;
  const H = canvas.height;

  ctx.fillStyle = '#F4F1EA';
  ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = '#1B2A4A';
  ctx.lineWidth = 2;
  ctx.strokeRect(16, 16, W - 32, H - 32);

  ctx.fillStyle = '#1B2A4A';
  ctx.font = '700 22px "Public Sans", sans-serif';
  ctx.fillText('TELEOPLEXY', 40, 56);
  ctx.font = '600 16px "Public Sans", sans-serif';
  ctx.fillText('Statement of projected status', 40, 80);
  ctx.font = '11px "Public Sans", sans-serif';
  ctx.fillStyle = '#9A9488';
  ctx.fillText('OFFICIAL NOTICE  ·  Issued 24 September 2026', 40, 104);

  ctx.strokeStyle = '#9A9488';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(40, 118);
  ctx.lineTo(W - 40, 118);
  ctx.stroke();

  const by = state.birthYear;
  const row = lookupYear(by);
  let mult = '-';
  if (by < R.firstYear) {
    mult = 'pre-record → ' + formatFlop(R.todayFlop);
  } else if (row.flop) {
    mult = formatMultiple(R.todayFlop / row.flop);
  }

  const streamLabel = state.stream
    ? ({ upgrade: 'Upgrade / merger', decline: 'Managed decline', zoo: 'Zoo / stewardship', exit: 'Exit', extinction: 'Extinction tail' })[state.stream]
    : 'Unplaced';

  ctx.fillStyle = '#C8102E';
  ctx.font = '700 28px "Courier Prime", monospace';
  ctx.fillText('Birth year  ' + by, 40, 160);
  ctx.font = '400 18px "Courier Prime", monospace';
  ctx.fillText('Compute multiple  ' + mult, 40, 200);
  ctx.fillText('Stream  ' + streamLabel, 40, 236);
  ctx.fillText(state.conditionsMet + ' of ' + state.conditionsTotal + ' conditions met.', 40, 272);

  ctx.fillStyle = '#9A9488';
  ctx.font = '11px "Public Sans", sans-serif';
  ctx.fillText('Not investment advice.  Built by 21e8.studio', 40, H - 40);
}

function downloadShare() {
  const canvas = document.getElementById('share-canvas');
  const a = document.createElement('a');
  a.download = 'teleoplexy-notice-' + state.birthYear + '.png';
  a.href = canvas.toDataURL('image/png');
  a.click();
}

async function webShare() {
  const canvas = document.getElementById('share-canvas');
  try {
    const blob = await new Promise(function (res) { canvas.toBlob(res, 'image/png'); });
    const file = new File([blob], 'teleoplexy-notice.png', { type: 'image/png' });
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({
        files: [file],
        title: 'Teleoplexy notice',
        text: 'Statement of projected status. Birth year ' + state.birthYear + '.',
      });
    } else if (navigator.share) {
      await navigator.share({
        title: 'Teleoplexy notice',
        text: 'Birth year ' + state.birthYear + '. ' + state.conditionsMet + ' of ' + state.conditionsTotal + ' conditions met.',
        url: location.href,
      });
    } else {
      downloadShare();
    }
  } catch (e) {
    if (e && e.name !== 'AbortError') downloadShare();
  }
}

/* ---------- Reveal flow ---------- */
