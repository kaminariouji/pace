// pace.mjs — the whole idea in five pure functions.
// A bill is {name, amount, dueISO, startISO, entries:[{id, amount, at, note}]}

export const DAY = 86400000;

export function logged(bill) {
  return bill.entries.reduce((sum, e) => sum + Number(e.amount || 0), 0);
}

export function daysLeft(bill, now = Date.now()) {
  const left = (new Date(bill.dueISO).getTime() - now) / DAY;
  return Math.max(0, left);
}

// What you must put away each day to still make it, counting today.
export function perDay(bill, now = Date.now()) {
  const remaining = Math.max(0, bill.amount - logged(bill));
  const d = Math.max(1, Math.ceil(daysLeft(bill, now)));
  return remaining / d;
}

// Where you should be by now if you were moving at a constant speed.
export function expectedByNow(bill, now = Date.now()) {
  const start = new Date(bill.startISO || bill.dueISO).getTime();
  const due = new Date(bill.dueISO).getTime();
  if (due <= start) return bill.amount;
  const p = Math.min(1, Math.max(0, (now - start) / (due - start)));
  return bill.amount * p;
}

// Positive = ahead of pace. Negative = behind, in money.
export function drift(bill, now = Date.now()) {
  return logged(bill) - expectedByNow(bill, now);
}

export function status(bill, now = Date.now()) {
  const d = drift(bill, now);
  const tolerance = bill.amount * 0.02;
  if (logged(bill) >= bill.amount) return { key: 'done', drift: d };
  if (d < -tolerance) return { key: 'behind', drift: d };
  if (d > tolerance) return { key: 'ahead', drift: d };
  return { key: 'onpace', drift: d };
}

export function daysBehind(bill, now = Date.now()) {
  const p = perDay(bill, now);
  const d = drift(bill, now);
  if (d >= 0 || p <= 0) return 0;
  return Math.abs(d) / p;
}
