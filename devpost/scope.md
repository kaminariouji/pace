---
doc: scope
status: approved
---
# Pace

One line: give it a bill and a date, and it tells you what each day has to carry and whether you are ahead or behind right now.

## The Unique Kernel

Every bill tracker counts **down**. Pace counts **pace**. It compares what you have logged against where a straight line from start to due date says you should be, and it says the gap in days, not in dollars. "Behind by 2.2 days" is a sentence you can act on; "$460 left" is a sentence you can ignore.

## Who It's For

Someone with one bill they cannot miss and income that arrives in lumps — a freelancer waiting on two invoices, a person between contracts. Today they keep the number in their head, or in a notes app, and they find out they are short on the day it is due.

## The Core Loop

They open it, see the ring and one sentence. When money lands, they type the amount and press Log. The arc moves, the sentence rewrites itself, and the dot that marks "where you should be" stays put. They close it. They come back when the next payment lands, because the sentence changed.

## Inspiration & Identity

- The restraint of a single-card app: one accent colour, one number that matters.
- Ledger typography — a serif for money, small caps for labels.
- Mood: calm, slightly stern. Not a cheerleader, not a scold.
- References: https://teenage.engineering (product pages), https://stripe.com/payments (one idea per screen), https://www.are.na (quiet grids).

## Why This Matters to the Learner

There is a bill due on the first, and the countdown was not telling them how fast to run.

## What "Working" Looks Like

Enter a bill of $1,000 due in 8 days. The app says $57.50 a day and "Behind by 2.2 days". Log $120 and the arc moves, the sentence rewrites, and the daily number drops. The "oh" beat is the dot: it does not move when you log money — only the arc does.

## The POC Boundary

In: one bill, one due date, logging payments, the ring, the sentence, localStorage persistence, the demo seed.

## Later

Multiple bills. Income forecasting. Reminders. Sharing.

## Explicitly Cut

- **Accounts and sync** — the proof is about one person and one number; a login would hide the first screen behind a form.
- **Charts** — a second visual language would compete with the ring.
- **Currency selection** — USD only, because the demo must be readable in one glance.
- **Editing entries** — logging is append-only; undo is a later problem.
