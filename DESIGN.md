# Shock-pass design plan (check against brief)

## Palette (6)
- `#F4F1EA` form paper
- `#1B2A4A` ink navy (body text)
- `#C8102E` stamp red (reader figures + TRIPPED only)
- `#9A9488` faint form rules / muted labels
- `#FFFFFF` field fill
- `#E8E2D6` alternating row / rule wash

## Type
- Pre-printed form: Public Sans (400/600/700)
- Filled-in reader data: Courier Prime (400/700)
- Scale: 11px labels · 14px body · 16px lead · 20px section · 26px masthead · 32px stamp figures

## Hook wireframe (390px)
```
+--------------------------------------+
| TELEOPLEXY                           |
| Statement of projected status        |
| Issued: 24 September 2026            |
|--------------------------------------|
|                                      |
|  Year you were born                  |
|  ___________________________         |
|                                      |
|           [ Continue ]               |
|                                      |
+--------------------------------------+
```
After submit: navy form holds; stamp-red figures type into fields (only motion).

## Anti-generic checks
- No Matrix rain, no // chrome, no 01· eyebrows, no scare meter
- One red only for personal numbers + TRIPPED
- Deadpan voice; confidence marks carry doubt
- Receipts or cut

## Stack
Static site root: index.html, styles.css, app.js, data/*.js. No framework. No package.json.
