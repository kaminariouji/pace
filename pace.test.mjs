import { test } from 'node:test';
import assert from 'node:assert/strict';
import { logged, perDay, expectedByNow, drift, status, daysBehind, DAY } from './pace.mjs';

const T0 = Date.parse('2026-10-01T00:00:00Z');
const DUE = Date.parse('2026-11-01T00:00:00Z');
const base = { name: 'Rent', amount: 1000, dueISO: new Date(DUE).toISOString(), startISO: new Date(T0).toISOString(), entries: [] };

test('logged adds every entry', () => {
  assert.equal(logged({ ...base, entries: [{ amount: 120 }, { amount: '80' }] }), 200);
});

test('perDay splits what is left across the days that are left', () => {
  const mid = Date.parse('2026-10-22T00:00:00Z'); // 10 days left
  assert.equal(Math.round(perDay(base, mid)), 100);
});

test('perDay never divides by zero on the due date', () => {
  assert.equal(perDay(base, DUE + DAY), 1000);
});

test('expectedByNow is linear in time', () => {
  const mid = Date.parse('2026-10-16T12:00:00Z'); // 50% of the window
  assert.equal(Math.round(expectedByNow(base, mid)), 500);
});

test('drift is money logged minus money expected', () => {
  const mid = Date.parse('2026-10-16T12:00:00Z');
  const b = { ...base, entries: [{ amount: 300 }] };
  assert.equal(Math.round(drift(b, mid)), -200);
});

test('status says behind, on pace, ahead and done', () => {
  const mid = Date.parse('2026-10-16T12:00:00Z');
  assert.equal(status({ ...base, entries: [{ amount: 300 }] }, mid).key, 'behind');
  assert.equal(status({ ...base, entries: [{ amount: 500 }] }, mid).key, 'onpace');
  assert.equal(status({ ...base, entries: [{ amount: 700 }] }, mid).key, 'ahead');
  assert.equal(status({ ...base, entries: [{ amount: 1000 }] }, mid).key, 'done');
});

test('daysBehind turns a shortfall into days at the required pace', () => {
  const mid = Date.parse('2026-10-22T00:00:00Z'); // 100/day left
  const b = { ...base, entries: [{ amount: 700 }] }; // expected ~700, so roughly on pace
  assert.ok(daysBehind(b, mid) < 0.5);
  const behind = { ...base, entries: [{ amount: 400 }] };
  assert.ok(daysBehind(behind, mid) > 2.5);
});
