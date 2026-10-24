## Inspiration

Every bill tracker counts down. None of them tell you how fast you have to move. When income arrives in lumps, "9 days left" is not actionable, but "you are 2.2 days behind" is. That sentence is the whole product.

## What it does

You give Pace one bill, one amount, one date. It draws a ring with two marks: the **arc** is money you have logged, the **dot** is where a straight line from your start date to your due date says you should be right now. Under it, one sentence: what each day has to carry, and whether you are ahead or behind, stated in days rather than dollars. When a payment lands you type the amount, press Log, and the arc moves while the dot stays put.

## How we built it

We started from the Devpost Learn Skill Pack: scope first, then PRD, then spec, then build. The maths lives in five pure functions in `pace.mjs` with the clock always passed in as a parameter, so the seven tests in `pace.test.mjs` run without a browser. The UI is one HTML file, one stylesheet and one module, with no framework and no build step. The demo video is a real screen capture, recorded by driving headless Chrome over the DevTools Protocol and assembling the frames with ffmpeg.

## Challenges we ran into

The ring's "where you should be" marker was wrong by exactly ninety degrees for two attempts. A CSS rotation on the whole SVG, plus a rotated line element, plus a transformed coordinate space, composed into an offset that was hard to reason about. We gave up on composing rotations and placed the dot with trigonometry instead, computing x and y from an angle. That removed the class of bug rather than the instance. A second one: `[hidden]` did nothing because `display: grid` on the same elements outranked the browser's default stylesheet.

## What we learned

The planning step is what made the build small. Writing down that "behind, in days" was the kernel meant we could cut charts, accounts, currency selection and entry editing without hesitating. The other lesson was about proof: a screenshot of a dashboard proves nothing about whether logging works, so the demo had to be a real recording of a real click.

## What's next

Multiple bills, income that is expected rather than received, and a weekly view that shows which week is carrying too much.
