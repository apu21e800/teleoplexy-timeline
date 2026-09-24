function revealAll() {
  ['ledger', 'allocation', 'counterparty', 'conditions', 'close', 'methods', 'instrument'].forEach(function (id) {
    const el = document.getElementById(id);
    if (el) el.hidden = false;
  });
  renderLedger();
  updateInstrument();
  renderConditions();
  renderClose();
  updateDoors();
  drawStream();
  drawShareCard();
  maybeShowCta();
}

function maybeShowCta() {
  const slot = document.getElementById('follow-slot');
  const cta = document.getElementById('cta-follow');
  const link = document.getElementById('cta-link');
  if (SUBSTACK_URL && SUBSTACK_URL !== 'SUBSTACK_URL') {
    link.href = SUBSTACK_URL;
    cta.hidden = false;
    if (slot) {
      slot.innerHTML = '<a href="' + SUBSTACK_URL + '">Follow the series</a>';
    }
  } else {
    cta.hidden = true;
  }
}
