# Teleoplexy. Statement of projected status.

Institutional static form. Issued **24 September 2026**.

## Stack

Static only: `index.html`, `styles.css`, `app.js`, `data/receipts.js`. No package.json. No build step.

## Design

See `DESIGN.md`. Paper form palette. Public Sans + Courier Prime. Stamp red only for reader figures and TRIPPED.

## Data

- Epoch AI notable models (running-max training FLOP) via `data/receipts.js` (as of 2026-09-24).
- UN WPP 2024 World fertility via OWID (1950–2023).
- METR time horizons (2025-03-19).

## Local

```bash
python3 -m http.server 8080
```

Open `http://localhost:8080`.

## Branch

`shock-pass` rewrite. Old Matrix files (`data.js`, `years.js`, `styles-near.css`) are unused by this build; leave in history until explicitly removed.

## Colophon

Built by [21e8.studio](https://www.21e8.studio). Not investment advice.
