// app.js — Pace. One bill, one date, one number for each day.
import { logged, perDay, expectedByNow, drift, status, daysBehind, daysLeft } from './pace.mjs';

const KEY = 'pace.bill.v1';
const $ = (id) => document.getElementById(id);

const setup = $('setup');
const dash = $('dash');
const setupForm = $('setupForm');
const logForm = $('logForm');
const editBtn = $('editBtn');

function seedDemo() {
  const day = 86400000;
  return {
    name: 'Rent',
    amount: 1000,
    dueISO: new Date(Date.now() + 8 * day).toISOString(),
    startISO: new Date(Date.now() - 16 * day).toISOString(),
    entries: [
      { id: 'd1', amount: 180, at: new Date(Date.now() - 12 * day).toISOString(), note: 'bounty paid' },
      { id: 'd2', amount: 240, at: new Date(Date.now() - 6 * day).toISOString(), note: 'client invoice' },
      { id: 'd3', amount: 120, at: new Date(Date.now() - 1 * day).toISOString(), note: 'sale' },
    ],
  };
}

let bill = load();
if (!bill && new URLSearchParams(location.search).has('demo')) {
  bill = seedDemo();
  localStorage.setItem(KEY, JSON.stringify(bill));
}

function load() {
  try { return JSON.parse(localStorage.getItem(KEY) || 'null'); } catch { return null; }
}
function save(b) {
  bill = b;
  localStorage.setItem(KEY, JSON.stringify(b));
}

const money = (n, cents = false) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency', currency: 'USD',
    minimumFractionDigits: cents ? 2 : 0,
    maximumFractionDigits: cents ? 2 : 0,
  }).format(n);

function render() {
  if (!bill) {
    setup.hidden = false;
    dash.hidden = true;
    editBtn.hidden = true;
    const d = new Date(Date.now() + 14 * 86400000);
    setupForm.due.value = d.toISOString().slice(0, 10);
    return;
  }
  setup.hidden = true;
  dash.hidden = false;
  editBtn.hidden = false;

  const now = Date.now();
  const got = logged(bill);
  const left = Math.max(0, bill.amount - got);
  const pace = perDay(bill, now);
  const st = status(bill, now);
  const behind = daysBehind(bill, now);
  const days = Math.ceil(daysLeft(bill, now));
  const expected = expectedByNow(bill, now);

  $('left').textContent = money(left);
  $('leftSub').textContent = 'of ' + money(bill.amount);
  $('perDay').textContent = money(pace, true);
  $('days').textContent = String(days);
  $('logged').textContent = money(got);
  $('due').textContent = new Date(bill.dueISO).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  const frac = bill.amount > 0 ? Math.min(1, got / bill.amount) : 0;
  const arc = $('arc');
  arc.style.strokeDashoffset = String(704 * (1 - frac));
  arc.style.stroke = st.key === 'behind' ? 'var(--behind)' : st.key === 'done' ? 'var(--ahead)' : 'var(--amber)';

  const expFrac = bill.amount > 0 ? Math.min(1, expected / bill.amount) : 0;
  // place the tick by trigonometry: 0 at the top, clockwise, so it reads against the arc
  const a = (-90 + 360 * expFrac) * (Math.PI / 180);
  const tick = $('tick');
  tick.setAttribute('cx', String(130 + 112 * Math.cos(a)));
  tick.setAttribute('cy', String(130 + 112 * Math.sin(a)));

  const v = $('verdict');
  v.className = 'verdict ' + st.key;
  if (st.key === 'done') {
    v.textContent = 'Covered. ' + money(got - bill.amount) + ' over the bill, with ' + days + ' days to spare.';
  } else if (st.key === 'behind') {
    v.textContent = 'Behind by ' + behind.toFixed(1) + ' days. Today should have carried ' + money(expected) + '; it has carried ' + money(got) + '.';
  } else if (st.key === 'ahead') {
    v.textContent = 'Ahead by ' + money(drift(bill, now)) + '. Keep the day in view: ' + money(pace, true) + ' a day still gets there.';
  } else {
    v.textContent = 'On pace. ' + money(pace, true) + ' a day, and today is carrying its share.';
  }

  const list = $('entries');
  list.innerHTML = '';
  [...bill.entries].reverse().forEach((e) => {
    const li = document.createElement('li');
    const when = new Date(e.at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    li.innerHTML = '<span class="note"></span><span class="amt"></span>';
    li.querySelector('.note').textContent = when + (e.note ? ' · ' + e.note : '');
    li.querySelector('.amt').textContent = money(Number(e.amount), true);
    list.appendChild(li);
  });
}

setupForm.addEventListener('submit', (ev) => {
  ev.preventDefault();
  const f = new FormData(setupForm);
  const amount = Number(f.get('amount'));
  const dueISO = new Date(f.get('due') + 'T23:59:59').toISOString();
  save({
    name: String(f.get('name') || 'Bill'),
    amount,
    dueISO,
    startISO: new Date().toISOString(),
    entries: bill && bill.entries ? bill.entries : [],
  });
  render();
});

logForm.addEventListener('submit', (ev) => {
  ev.preventDefault();
  const f = new FormData(logForm);
  const amount = Number(f.get('amount'));
  if (!amount || amount <= 0) return;
  bill.entries.push({ id: crypto.randomUUID(), amount, at: new Date().toISOString(), note: String(f.get('note') || '').trim() });
  save(bill);
  logForm.reset();
  render();
});

editBtn.addEventListener('click', () => {
  setup.hidden = false;
  dash.hidden = true;
  if (bill) {
    setupForm.name.value = bill.name;
    setupForm.amount.value = String(bill.amount);
    setupForm.due.value = new Date(bill.dueISO).toISOString().slice(0, 10);
  }
});

render();
