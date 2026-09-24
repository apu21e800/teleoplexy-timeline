/* Ledger rows (sourced). */
/* ---------- Ledger rows ---------- */
var LEDGER = [
  // Compressed deep history (sourced)
  { y: -3200, event: 'Writing systems appear in Mesopotamia.', conf: '●', confLabel: 'measured', src: 'Archaeological consensus; earliest cuneiform tablets', srcUrl: null, band: 'deep' },
  { y: 1602, event: 'Dutch East India Company (VOC) chartered; joint-stock capitalism scales.', conf: '●', confLabel: 'measured', src: 'VOC charter 1602', srcUrl: 'https://www.rijksmuseum.nl/en/collection/NG-1985-7-1', band: 'deep' },
  { y: 1450, event: 'Movable-type printing spreads in Europe (Gutenberg).', conf: '●', confLabel: 'measured', src: 'Gutenberg Bible c.1455', srcUrl: null, band: 'deep' },
  { y: 1901, event: 'Transatlantic radio signal (Marconi).', conf: '●', confLabel: 'measured', src: 'Marconi 12 Dec 1901', srcUrl: null, band: 'deep' },
  { y: 1945, event: 'Electronic stored-program computing era opens (ENIAC operational 1945–46).', conf: '●', confLabel: 'measured', src: 'ENIAC, University of Pennsylvania', srcUrl: 'https://www.seas.upenn.edu/about-seas/eniac/', band: 'deep' },
  { y: 1950, event: 'Theseus maze-solver: first recorded AI training run in Epoch data (40 FLOP).', conf: '●', confLabel: 'measured', src: 'Epoch · Theseus 1950-07-02', srcUrl: 'https://epoch.ai/data/ai-models', band: 'ml' },
  { y: 1957, event: 'Perceptron Mark I.', conf: '◐', confLabel: 'on trajectory', src: 'Epoch (Likely)', srcUrl: 'https://epoch.ai/data/ai-models', band: 'ml' },
  { y: 1987, event: 'NetTalk transcription network.', conf: '●', confLabel: 'measured', src: 'Epoch (Confident)', srcUrl: 'https://epoch.ai/data/ai-models', band: 'ml' },
  { y: 1989, event: 'Zip CNN (LeCun).', conf: '●', confLabel: 'measured', src: 'Epoch (Confident)', srcUrl: 'https://epoch.ai/data/ai-models', band: 'ml' },
  { y: 1994, event: 'Land presents Meltdown. Predictive Coding NN in Epoch.', conf: '●', confLabel: 'measured', src: 'CCRU / Epoch', srcUrl: 'https://epoch.ai/data/ai-models', band: 'ml' },
  { y: 1997, event: 'LSTM published.', conf: '●', confLabel: 'measured', src: 'Epoch (Confident)', srcUrl: 'https://epoch.ai/data/ai-models', band: 'ml' },
  { y: 2000, event: 'Neural language model milestone in Epoch.', conf: '●', confLabel: 'measured', src: 'Epoch (Confident)', srcUrl: 'https://epoch.ai/data/ai-models', band: 'ml' },
  { y: 2012, event: 'AlexNet wins ImageNet; deep learning breakout (compute still below later LM peaks in Epoch running-max).', conf: '●', confLabel: 'measured', src: 'Krizhevsky et al. 2012', srcUrl: 'https://papers.nips.cc/paper/2012/hash/c399862d3b9d6b76c8436e924a68c45b-Abstract.html', band: 'dense' },
  { y: 2015, event: 'AlphaGo Fan.', conf: '◐', confLabel: 'on trajectory', src: 'Epoch (Likely)', srcUrl: 'https://epoch.ai/data/ai-models', band: 'dense' },
  { y: 2016, event: 'GNMT.', conf: '◐', confLabel: 'on trajectory', src: 'Epoch (Likely)', srcUrl: 'https://epoch.ai/data/ai-models', band: 'dense' },
  { y: 2017, event: 'Transformer architecture published.', conf: '●', confLabel: 'measured', src: 'Vaswani et al. arXiv:1706.03762', srcUrl: 'https://arxiv.org/abs/1706.03762', band: 'dense' },
  { y: 2018, event: 'ResNeXt-101 32×48d sets Epoch running-max.', conf: '●', confLabel: 'measured', src: 'Epoch (Confident)', srcUrl: 'https://epoch.ai/data/ai-models', band: 'dense' },
  { y: 2019, event: 'AlphaStar.', conf: '●', confLabel: 'measured', src: 'Epoch (Confident)', srcUrl: 'https://epoch.ai/data/ai-models', band: 'dense' },
  { y: 2020, event: 'GPT-3 175B (davinci).', conf: '●', confLabel: 'measured', src: 'Epoch (Confident)', srcUrl: 'https://epoch.ai/data/ai-models', band: 'dense' },
  { y: 2021, event: 'FLAN 137B.', conf: '●', confLabel: 'measured', src: 'Epoch (Confident)', srcUrl: 'https://epoch.ai/data/ai-models', band: 'dense' },
  { y: 2022, event: 'Minerva (540B). ChatGPT public launch (Nov).', conf: '●', confLabel: 'measured', src: 'Epoch; OpenAI', srcUrl: 'https://epoch.ai/data/ai-models', band: 'dense' },
  { y: 2023, event: 'Gemini 1.0 Ultra (Epoch Speculative). World TFR 2.251.', conf: '○', confLabel: 'speculative', src: 'Epoch; UN WPP via OWID', srcUrl: 'https://epoch.ai/data/ai-models', band: 'dense' },
  { y: 2024, event: 'South Korea TFR 0.75 (KOSTAT). Amish population 400,910 (Jun).', conf: '●', confLabel: 'measured', src: 'KOSTAT 2024 birth stats; Young Center 2024', srcUrl: 'https://www.kostat.go.kr/board.es?mid=a10301010000&bid=204&act=view&list_no=438237', band: 'dense' },
  { y: 2025, event: 'Grok 4 (Epoch Speculative). METR: o3 ~110 min 50% horizon.', conf: '○', confLabel: 'speculative', src: 'Epoch; METR 2025-03-19', srcUrl: 'https://metr.org/blog/2025-03-19-measuring-ai-ability-to-complete-long-tasks/', band: 'dense' },
  { y: 2026, event: 'GPT-6 Astra 1.0001×10²⁷ FLOP (Epoch Likely, 3 Sep). You are here.', conf: '◐', confLabel: 'on trajectory', src: 'Epoch as of 2026-09-24', srcUrl: 'https://epoch.ai/data/ai-models', band: 'here', here: true },
  // Projection bands
  { y: 2027, event: 'Frontier training compute continues to rise if capital and chips hold.', conf: '◐', confLabel: 'on trajectory', trip: 'Tripwire: Epoch running-max stalls YoY.', band: 'proj' },
  { y: 2028, event: 'METR month-scale tasks enter the early window if ~7-month doubling holds.', conf: '◐', confLabel: 'on trajectory', trip: 'Tripwire: METR 50% horizon ≥ 1 work-week.', band: 'proj' },
  { y: 2031, event: 'METR month-long projects window closes if trend continues (late 2028–early 2031).', conf: '◐', confLabel: 'on trajectory', trip: 'Tripwire: METR horizon ≥ 1 month at 50%.', band: 'proj' },
  { y: 2036, event: 'Ten-year band. Cheap general robots begin to press Irreducible body work.', conf: '○', confLabel: 'speculative', trip: 'Tripwire: warehouse/household general robots at parity cost.', band: 'proj' },
  { y: 2046, event: 'Twenty-year band. Legal signature rules still human-gated unless statute changes.', conf: '○', confLabel: 'speculative', trip: 'Tripwire: major jurisdiction accepts autonomous legal acts.', band: 'proj' },
  { y: 2056, event: 'Thirty-year band. Cohort allocation streams have largely sorted.', conf: '○', confLabel: 'speculative', trip: 'Tripwire: Exit legality (money, local compute) still open.', band: 'proj' },
];

// Fix deep history order (1450 before 1602)
LEDGER.sort(function (a, b) { return a.y - b.y; });
