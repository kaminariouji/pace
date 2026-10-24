---
doc: prd
status: approved
---
# Pace — product requirements

## The problem in one paragraph

A countdown tells you how long you have. It does not tell you how fast you have to move. When income arrives in lumps, the useful question is not "how many days left" but "am I ahead of the line that gets me there". Nothing in a notes app answers that, and a spreadsheet answers it only if you build it first.

## What we are building

A single-page app that holds **one** bill and answers three questions in one screen: what is left, what each day has to carry, and whether today is ahead or behind.

## Look and Feel

- One card, centred, on a near-black warm ground (`#0c0c10`).
- One accent: amber `#e9b25f` for money, red `#e2705f` when behind, green `#6fc3a1` when ahead or done.
- Serif (Georgia) for every number; sans for every label. Labels are 11px, uppercase, wide-tracked.
- No shadows except one soft drop under the card. No gradients on text. No icons.
- The ring is the only ornament: 10px stroke, round caps, a thin dot for "where you should be".

## User stories

1. As someone with one bill, I enter the amount and the date once and never again.
2. As someone whose income is lumpy, I log a payment in two fields and see the sentence change immediately.
3. As someone who is behind, I want the size of the problem in days, not in dollars.
4. As someone returning after a week, I want the number to have moved without me doing anything.

## Requirements

| # | Requirement | How we know it works |
|---|---|---|
| R1 | Enter a bill: name, amount, due date | Setup form saves and the dashboard replaces it |
| R2 | Show what is left and what a day must carry | `perDay` = remaining ÷ days left, never ÷ 0 |
| R3 | Show where a straight line says you should be | `expectedByNow` is linear in elapsed time |
| R4 | Say ahead / on pace / behind, in days | `daysBehind` = shortfall ÷ daily pace |
| R5 | Log a payment | Entry appears at the top of the list, totals update |
| R6 | Persist across reloads | One object in `localStorage` under `pace.bill.v1` |
| R7 | Demo without typing | `?demo=1` seeds a bill and three payments |
| R8 | Work on a phone | Single column under 680px |

## Out of scope

Accounts, sync, multiple bills, notifications, editing or deleting entries, currencies other than USD, charts.

## Success

A stranger opens the link, reads one sentence, and can say what the app does without scrolling.
