/* Stream chart weights (ILLUSTRATIVE). */
var STREAM_YEARS = [2026, 2031, 2036, 2041, 2046, 2051, 2056];

var STREAM = {
  ownership: [0.04, 0.05, 0.06, 0.07, 0.08, 0.09, 0.10],
  operator:  [0.12, 0.14, 0.13, 0.11, 0.09, 0.07, 0.06],
  clientage: [0.35, 0.38, 0.40, 0.42, 0.43, 0.44, 0.45],
  irreducible: [0.40, 0.34, 0.30, 0.27, 0.25, 0.24, 0.23],
  exit: [0.06, 0.06, 0.07, 0.08, 0.09, 0.10, 0.10],
  extinction: [0.03, 0.03, 0.04, 0.05, 0.06, 0.06, 0.06]
};

var STREAM_COLORS = {
  ownership: '#1B2A4A',
  operator: '#3D4F6F',
  clientage: '#6B7280',
  irreducible: '#9A9488',
  exit: '#5C6B4A',
  extinction: '#C8102E'
};
