/* Stream chart weights (ILLUSTRATIVE). */
var STREAM_YEARS = [2026, 2031, 2036, 2041, 2046, 2051, 2056];
// upgrade, decline, zoo, exit (stack to ~1); extinction is shadow on top (not in stack)
var STREAM = {
  upgrade:   [0.08, 0.10, 0.12, 0.14, 0.15, 0.16, 0.17],
  decline:   [0.55, 0.52, 0.48, 0.44, 0.40, 0.37, 0.34],
  zoo:       [0.25, 0.26, 0.27, 0.28, 0.29, 0.30, 0.30],
  exit:      [0.12, 0.12, 0.13, 0.14, 0.16, 0.17, 0.19],
  extinction:[0.02, 0.03, 0.04, 0.05, 0.06, 0.07, 0.08],
};
var STREAM_COLORS = {
  upgrade: '#1B2A4A',
  decline: '#9A9488',
  zoo: '#E8E2D6',
  exit: '#4A6741',
  extinction: 'rgba(200,16,46,0.25)',
};


