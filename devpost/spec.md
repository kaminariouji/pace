---
doc: spec
status: approved
---
# Pace — build spec

## Files

| File | Role |
|---|---|
| `index.html` | The two states: setup and dashboard. No framework, no build. |
| `styles.css` | All styling. Custom properties for the palette. One media query at 680px. |
| `pace.mjs` | Pure functions. No DOM, no storage, no clock of its own — `now` is always a parameter. |
| `app.js` | State, rendering, events. Imports `pace.mjs` as an ES module. |
| `pace.test.mjs` | Seven `node:test` cases over `pace.mjs`. |
| `serve.mjs` | 40-line static server so ES modules load over http instead of file://. |

## Data

```js
{
  name: "Rent",
  amount: 1000,
  dueISO: "2026-11-01T23:59:59.000Z",
  startISO: "2026-10-16T00:00:00.000Z",
  entries: [{ id, amount, at, note }]
}
```

One key: `pace.bill.v1`. Nothing leaves the browser.

## Maths

- `logged` — sum of entry amounts.
- `daysLeft` — `(due − now) / DAY`, floored at 0.
- `perDay` — `remaining ÷ max(1, ceil(daysLeft))`. The `max` is why it never divides by zero on the due date.
- `expectedByNow` — `amount × clamp((now − start) / (due − start), 0, 1)`.
- `drift` — `logged − expectedByNow`. Positive is ahead.
- `status` — `done` if fully logged; otherwise `behind` / `ahead` outside a 2% tolerance band, `onpace` inside it.
- `daysBehind` — `|drift| ÷ perDay`, 0 when not behind.

## The ring

- Viewbox `0 0 260 260`, radius 112, circumference 703.7 → `stroke-dasharray: 704`.
- The arc circle carries `transform="rotate(-90 130 130)"` so it starts at twelve o'clock.
- The arc's `stroke-dashoffset` is `704 × (1 − logged/amount)`, animated over 600ms.
- The dot is placed by trigonometry, not by a rotated line: `x = 130 + 112·cos(θ)`, `y = 130 + 112·sin(θ)`, `θ = −90° + 360°·expected/amount`. Placing it by coordinate removed a 90° error that a nested CSS rotation kept reintroducing.

## Look and Feel

Carried from the PRD: one card, one accent, serif numbers, uppercase micro-labels, a single ring as the only ornament. The palette lives in `:root` so the "behind" state can swap the accent without touching layout.

## States

1. **Setup** — headline, one paragraph, three fields, one button.
2. **Dashboard** — ring, daily number, verdict sentence, three meta figures, log row, entry list.
3. **Empty entries** — the list collapses to nothing; the verdict reads from the seeded bill.

## Accessibility

- The ring is an `<svg role="img">` with a `<title>` describing both marks.
- Every input has a visible label or an `aria-label`.
- Colour is never the only signal: the verdict sentence always states the direction in words.

## Test plan

`node --test pace.test.mjs` — seven cases: summing, the daily split, the due-date divide, linear expectation, drift sign, the four statuses, and the day conversion. All seven pass before any UI work is called done.
