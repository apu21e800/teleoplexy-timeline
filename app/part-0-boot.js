/* Teleoplexy - Statement of projected status. Client-side only. */
var SUBSTACK_URL = 'SUBSTACK_URL';
var ISSUE_YEAR = 2026;
var R = window.TELEOPLEXY_RECEIPTS;
var state = {
  birthYear: null,
  childYear: null,
  stream: null,
  answers: { capital: false, screen: false, body: false },
  conditionsMet: 0,
  conditionsTotal: 0,
  reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches
};
if (!R) {
  console.error('receipts missing');
}
