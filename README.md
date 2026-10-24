# Pace

One bill. One date. A number for each day.

**[Open the live demo](https://kaminariouji.github.io/pace/?demo=1)** · **[Watch the 62-second demo](https://kaminariouji.github.io/pace/pace-demo.mp4)**

Most money apps count the days down. Pace tells you what **today** has to carry, and whether you are ahead or behind at this hour.

## Run it

```bash
node serve.mjs          # http://127.0.0.1:8123
```

Open `http://127.0.0.1:8123/?demo=1` to see it with a filled-in bill and three logged payments.
No build step, no dependencies.

## Test it

```bash
node --test pace.test.mjs
```

Seven tests cover the only maths that matters: what is left, what a day has to carry, where you should be by now, and how far behind that puts you.

## How it works

- `pace.mjs` — five pure functions, no DOM. `logged`, `perDay`, `expectedByNow`, `drift`, `status`, `daysBehind`.
- `app.js` — renders the ring and the sentence, keeps one bill in `localStorage`.
- `styles.css` — one card, one accent, no framework.

The ring has two marks: the **arc** is money logged, the **dot** is where you should be by now if you had moved at a constant speed. The gap between them is the whole product.

## Built for

Devpost **Build With AI: Basics** (October 2026), using the [Devpost Learn Skill Pack](https://github.com/challengepost/learn-ai-basics). Planning docs live in `devpost/`.

## Licence

MIT
