# NewtzMedia Mockups Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build two browser-openable mockups of the NewtzMedia marketing site, Style 1 "Minimal" and Style 2 "Interactive", sharing one content file, one logic file, one behavior file and one post stylesheet.

**Architecture:** `content.js` holds every word and every sample post as one global object. `logic.js` holds pure functions (selectors and HTML-string renderers) that Node tests exercise without a browser. `behavior.js` wires the DOM: mounts, tabs, lightbox, hero cycler, reduced motion. `posts.css` owns everything inside a post; `minimal.css` and `interactive.css` own everything around it. Two HTML files carry the same mount points so content parity is structural.

**Tech Stack:** Plain HTML, CSS and JavaScript. Node 24 built-in test runner (`node --test`), no packages. Python 3.13 `http.server` for the preview. Google Fonts by `<link>`.

**Spec:** `docs/superpowers/specs/2026-09-24-newtzmedia-mockups-design.md` (the single authority; section numbers below refer to it).

## Global Constraints

- No framework, no build step, no package install, no `package.json`. Plain scripts, not ES modules (pages must work from a static server and `require()` must load them in Node).
- Every content string lives in `mockups/content.js`; HTML files hold structure and one static copy of tagline (a) for the no-JS case only.
- Style CSS never targets the inside of a post: no `.post__*`, `.art`, `.art__*` selectors in `minimal.css` or `interactive.css` (a test enforces this).
- Copy voice is first person singular. No testimonials, logos, stars, ratings or reviews anywhere, including inside sample posts (a test enforces the words).
- Placeholders stay exactly: email `hello@newtzmedia.example`, prices `$150` / `$300` / `$500`, month `Sept 2026`.
- Middle tier label is `Recommended`, never "Most popular".
- Source files are UTF-8, written with the Write or Edit tool, never through a Python script (this machine's default code page truncates non-ASCII writes). The literal middle dot in JavaScript strings and expected outputs below is intended; copy it as it is.
- Line endings LF (`.gitattributes` sets it). Commit named files only, never `git add -A`.
- Every commit message ends with `Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>`.
- Tests: `cd /c/Users/mythi/Claude/newtzmedia-site && node --test "tests/*.test.js"` from the Bash tool. All tests must pass before every commit.
- One task per subagent, about 150k tokens each; the main agent stops for Zack's review after each task (his standing rule).

## Verification protocol (browser)

The pages are verified rendered, never from source alone.

1. Start the server with the preview tool: `preview_start {name: "newtzmedia-mockups"}` (Task 1 adds this entry). Pages are at `http://localhost:8765/minimal.html` and `http://localhost:8765/interactive.html`.
2. Reload with `navigate` to the same URL after every file change.
3. Check `read_console_messages {onlyErrors: true}`: expected empty apart from Google Fonts being blocked, if offline.
4. Run the `javascript_tool` snippets given in each task and compare with the expected output verbatim.
5. Screenshots are allowed only for the design critique steps in Tasks 8 and 9 (frontend-design self-critique), at `scale: 0.5`. Never use a screenshot as a pass/fail check.
6. If the executing agent has no browser tools, run the Node tests, commit, and report "browser checks pending" so the main agent runs them before the task is accepted.
7. Before any layout check, confirm the pane has a real viewport: `javascript_tool` -> `innerWidth + 'x' + innerHeight`. A hidden pane can report a height of 0, and then screenshots time out, IntersectionObserver never fires and box measurements are meaningless. If that happens, tell Zack the pane is hidden and re-run the check once it reports a height, rather than "fixing" code that is not broken.
8. Expected values that mention 640px, a -12px lift or four columns assume a pane wider than 1100px. Below 900px the same CSS gives 600px, no lift and fewer columns by design.

## Deviations from the spec (Zack can veto any at task review)

1. A fourth shared file, `mockups/logic.js`, holds the pure functions so Node can test data and rendering. Spec section 8 is updated in Task 1.
2. Post chrome (the platform UI around the artwork) uses the system font stack, which is what a real phone shows, so the minimal page loads no fourth family. Gabarito 500 is added for artwork sublines. Spec 4.2, 5.2 and 6 touched in Task 1.
3. The card wrapper puts crop marks, chip and the open button inside `.card__post` (their positioning anchor); the metadata strip sits beside it.
4. Steps use an `<ol>` with CSS counters; no number span in the markup.
5. Style 1 keeps violet in exactly four places by making tier and contact buttons outlined pale buttons and step numbers pale.
6. Under 560px the interactive nav keeps only "Email me"; the minimal nav keeps all three links (they fit).
7. Under reduced motion the Pause/Play button is hidden (there is no cycling to control).
8. Hero pills use the same tablist semantics as the work section.
9. Style 2's contact paragraph uses cocoa, not muted: muted on lilac measures exactly 4.5:1.
10. "Story" and "1/3" labels use a solid `#1a1a1a` background so the white text passes contrast on light artwork.
11. The `<dialog>` element provides the lightbox focus trap and Escape handling natively.

## File map

```
newtzmedia-site/
  .gitattributes                      Task 1
  .claude/launch.json                 Task 1 (repo copy of the preview entry)
  README.md                           Task 1, Task 10
  docs/superpowers/specs/...design.md Task 1 (touch-ups listed above)
  mockups/content.js                  Task 1
  mockups/logic.js                    Task 2 (selectors), Task 3 (renderers)
  mockups/minimal.html                Task 4
  mockups/interactive.html            Task 4
  mockups/behavior.js                 Task 5 (core), Task 6 (lightbox, hero, reveals)
  mockups/posts.css                   Task 7
  mockups/minimal.css                 Task 8
  mockups/interactive.css             Task 9
  tests/content.test.js               Task 1
  tests/logic.test.js                 Task 2
  tests/render.test.js                Task 3
  tests/pages.test.js                 Task 4
C:/Users/mythi/Claude/.claude/launch.json   Task 1 (session-root entry, not in any repo)
```

---

### Task 1: Scaffolding and content.js

**Files:**
- Create: `.gitattributes`, `.claude/launch.json`, `mockups/content.js`, `tests/content.test.js`
- Modify: `C:/Users/mythi/Claude/.claude/launch.json` (add one entry), `docs/superpowers/specs/2026-09-24-newtzmedia-mockups-design.md` (sections 4.2, 5.2, 6, 8)

**Interfaces:**
- Produces: `globalThis.NEWTZ_CONTENT` with keys `brand`, `platforms`, `customers[]`, `pieces[]`, `motifs`, `steps[]`, `tiers[]`, `copy`, `taglines`. Exact shapes are in the code below; every later task reads them.

- [ ] **Step 1: Write `.gitattributes` and the repo launch config**

`.gitattributes`:
```
* text=auto eol=lf
```

`.claude/launch.json`:
```json
{
  "version": "0.0.1",
  "configurations": [
    {
      "name": "newtzmedia-mockups",
      "runtimeExecutable": "python",
      "runtimeArgs": ["-m", "http.server", "8765", "--bind", "127.0.0.1", "--directory", "mockups"],
      "cwd": "C:/Users/mythi/Claude/newtzmedia-site",
      "port": 8765
    }
  ]
}
```

- [ ] **Step 2: Add the same entry to the session-root launch config**

Use the Edit tool on `C:/Users/mythi/Claude/.claude/launch.json`. Insert this object as the first element of `"configurations"` (before the `math-practice-mobile` entry), followed by a comma:

```json
    {
      "name": "newtzmedia-mockups",
      "runtimeExecutable": "python",
      "runtimeArgs": ["-m", "http.server", "8765", "--bind", "127.0.0.1", "--directory", "C:/Users/mythi/Claude/newtzmedia-site/mockups"],
      "cwd": "C:/Users/mythi/Claude/newtzmedia-site",
      "port": 8765
    },
```

Verify: `python -c "import json;print([c['name'] for c in json.load(open('C:/Users/mythi/Claude/.claude/launch.json'))['configurations']])"` prints a list that starts with `newtzmedia-mockups`.

- [ ] **Step 3: Write the failing content test**

`tests/content.test.js`:
```js
// Guards the data every page renders from. Runs in Node with no DOM.
const { test } = require('node:test');
const assert = require('node:assert/strict');
require('../mockups/content.js');
const C = globalThis.NEWTZ_CONTENT;

test('four customers, each with at least two known platforms, a motif and a hex palette', () => {
  assert.equal(C.customers.length, 4);
  for (const c of C.customers) {
    assert.ok(c.platforms.length >= 2, c.id);
    for (const p of c.platforms) assert.ok(C.platforms[p], `${c.id}: unknown platform ${p}`);
    assert.ok(C.motifs[c.motif], `${c.id}: motif`);
    for (const k of ['bg', 'ink', 'accent']) assert.match(c.palette[k], /^#[0-9A-F]{6}$/i, `${c.id}: ${k}`);
    assert.ok(c.chip && c.handle.startsWith('@') && c.domain.endsWith('.example'), c.id);
  }
});

test('every piece belongs to a customer and only goes to platforms that customer has', () => {
  for (const p of C.pieces) {
    const c = C.customers.find((x) => x.id === p.customer);
    assert.ok(c, p.id);
    assert.ok(p.platforms.length >= 1, p.id);
    for (const pl of p.platforms) assert.ok(c.platforms.includes(pl), `${p.id} -> ${pl}`);
    assert.equal(p.hashtags.length, 3, p.id);
    assert.ok(['4x5', '1x1', '9x16', 'carousel'].includes(p.format), p.id);
    if (p.format === 'carousel') assert.equal(p.slides.length, 3, p.id);
    else assert.ok(p.headline && p.sub, p.id);
    assert.ok(p.caption, p.id);
  }
});

test('exactly one lead per customer, and it goes to every platform that customer has', () => {
  for (const c of C.customers) {
    const leads = C.pieces.filter((p) => p.customer === c.id && p.lead);
    assert.equal(leads.length, 1, c.id);
    assert.deepEqual([...leads[0].platforms].sort(), [...c.platforms].sort(), c.id);
  }
});

test('nine customer-platform combinations, each showing at least two pieces', () => {
  let combos = 0;
  for (const c of C.customers) {
    for (const pl of c.platforms) {
      combos += 1;
      const n = C.pieces.filter((p) => p.customer === c.id && p.platforms.includes(pl)).length;
      assert.ok(n >= 2, `${c.id}/${pl} shows ${n}`);
    }
  }
  assert.equal(combos, 9);
});

test('no fake social proof anywhere in the sample posts', () => {
  const banned = /\b(review|reviews|rated|rating|stars?|testimonial|customers love)\b/i;
  for (const p of C.pieces) {
    const slides = (p.slides || []).flatMap((s) => [s.headline, s.sub]);
    const text = [p.headline, p.sub, p.caption, ...slides].join(' ');
    assert.doesNotMatch(text, banned, p.id);
  }
});

test('three tiers, only the middle one recommended, labelled Recommended', () => {
  assert.equal(C.tiers.length, 3);
  assert.deepEqual(C.tiers.map((t) => t.recommended), [false, true, false]);
  assert.equal(C.copy.recommended, 'Recommended');
  assert.deepEqual(C.tiers.map((t) => t.price), ['$150', '$300', '$500']);
});

test('three steps in the spec order', () => {
  assert.deepEqual(C.steps.map((s) => s.title), ['We talk', 'I draft, you approve', 'They go out']);
});

test('three taglines per style; minimal ones contain their accent word; one interactive drops the price', () => {
  for (const style of ['minimal', 'interactive']) {
    assert.deepEqual(C.taglines[style].map((t) => t.key), ['a', 'b', 'c']);
  }
  for (const t of C.taglines.minimal) assert.ok(t.text.includes(t.accent), t.key);
  assert.equal(C.taglines.interactive.filter((t) => t.dropsPrice).length, 1);
  assert.ok(C.copy.subline.endsWith('From $150 a month.'));
  assert.ok(!C.copy.sublineNoPrice.includes('$'));
});

test('placeholders are exactly what the spec says', () => {
  assert.equal(C.brand.email, 'hello@newtzmedia.example');
  assert.equal(C.brand.month, 'Sept 2026');
  assert.equal(C.brand.name, 'NewtzMedia');
});
```

- [ ] **Step 4: Run it to make sure it fails**

Run: `cd /c/Users/mythi/Claude/newtzmedia-site && node --test "tests/*.test.js"`
Expected: FAIL, `Cannot find module '../mockups/content.js'`.

- [ ] **Step 5: Write `mockups/content.js`**

```js
// content.js - every word and every sample post in both mockups.
// Plain script (no modules) so the pages work from a static server and Node
// tests can load it with require(). One global: NEWTZ_CONTENT.
// Sample businesses are fictional except NFTek. No reviews, stars or logos.
globalThis.NEWTZ_CONTENT = {
  brand: {
    name: 'NewtzMedia',
    email: 'hello@newtzmedia.example', // placeholder until Zack has an address
    month: 'Sept 2026',                // shown in each card's metadata strip
  },

  // Platform order inside a customer's list is the order its pills appear in.
  platforms: {
    instagram: { id: 'instagram', label: 'Instagram' },
    facebook: { id: 'facebook', label: 'Facebook' },
    x: { id: 'x', label: 'X' },
    linkedin: { id: 'linkedin', label: 'LinkedIn' },
  },

  customers: [
    {
      id: 'nftek', name: 'NFTek', handle: '@nftek', domain: 'nftek.example',
      description: 'Cloud and AI automation consulting',
      platforms: ['linkedin', 'x'],
      campaign: 'Automate the boring part',
      palette: { bg: '#0F1B3D', ink: '#FFFFFF', accent: '#35E0FF' },
      chip: 'Tue 8:00am', motif: 'cloud',
    },
    {
      id: 'brewhaus', name: 'Brew Haus', handle: '@brewhaus', domain: 'brewhaus.example',
      description: 'Neighborhood coffee shop',
      platforms: ['instagram', 'facebook'],
      campaign: 'Fall menu',
      palette: { bg: '#F3E6D3', ink: '#3B2415', accent: '#D9702B' },
      chip: 'Mon 7:00am', motif: 'cup',
    },
    {
      id: 'ironworks', name: 'Ironworks Gym', handle: '@ironworksgym', domain: 'ironworksgym.example',
      description: 'Strength gym',
      platforms: ['instagram', 'facebook', 'x'],
      campaign: 'First month free',
      palette: { bg: '#111111', ink: '#FFFFFF', accent: '#E0202A' },
      chip: 'Wed 6:00am', motif: 'plate',
    },
    {
      id: 'aceauto', name: 'Ace Auto Repair', handle: '@aceautorepair', domain: 'aceautorepair.example',
      description: 'Independent auto shop',
      platforms: ['facebook', 'instagram'],
      campaign: 'Winter check',
      palette: { bg: '#2B4C6F', ink: '#FFFFFF', accent: '#F5C518' },
      chip: 'Thu 9:00am', motif: 'wrench',
    },
  ],

  // The first piece of each campaign is the lead: it goes to every platform the
  // customer has and it is what the interactive hero shows.
  pieces: [
    // NFTek
    {
      id: 'nftek-stat', customer: 'nftek', lead: true, format: '4x5',
      headline: '6 hours to 20 minutes.',
      sub: 'One automation. Every Monday, done before coffee.',
      caption: 'Most of a Monday used to go into one report. Now it builds itself. This is the kind of thing I set up for small teams.',
      hashtags: ['automation', 'smallbusiness', 'cloud'],
      platforms: ['linkedin', 'x'],
    },
    {
      id: 'nftek-carousel', customer: 'nftek', lead: false, format: 'carousel',
      slides: [
        { headline: 'The boring part', sub: 'Copying the same numbers into the same sheet every week.' },
        { headline: 'What we automated', sub: 'The report builds itself and lands in your inbox.' },
        { headline: 'What it took', sub: 'One afternoon. No new software to learn.' },
      ],
      caption: 'Three slides on what automating one weekly report actually looked like.',
      hashtags: ['automation', 'consulting', 'ai'],
      platforms: ['linkedin'],
    },
    {
      id: 'nftek-quote', customer: 'nftek', lead: false, format: '1x1',
      headline: 'If you do it every week, it should do itself.',
      sub: 'NFTek',
      caption: 'A rule I keep coming back to.',
      hashtags: ['automation', 'consulting', 'ai'],
      platforms: ['linkedin', 'x'],
    },
    // Brew Haus
    {
      id: 'brewhaus-fall', customer: 'brewhaus', lead: true, format: '4x5',
      headline: 'The fall menu is here.',
      sub: 'Maple latte, cinnamon cold brew, pumpkin scone.',
      caption: 'Maple latte, cinnamon cold brew and the pumpkin scone are back starting tomorrow. Come early, the scones go fast.',
      hashtags: ['fallmenu', 'coffeeshop', 'maplelatte'],
      platforms: ['instagram', 'facebook'],
    },
    {
      id: 'brewhaus-hours', customer: 'brewhaus', lead: false, format: '1x1',
      headline: 'New hours',
      sub: 'Mon to Fri 6am to 6pm. Sat and Sun 7am to 4pm.',
      caption: 'New hours starting Monday. Earlier on weekdays for the morning crowd.',
      hashtags: ['coffeeshop', 'openearly', 'localcoffee'],
      platforms: ['instagram', 'facebook'],
    },
    {
      id: 'brewhaus-story', customer: 'brewhaus', lead: false, format: '9x16',
      headline: "Today's special",
      sub: 'Maple cold brew, $4 all day.',
      caption: 'Maple cold brew, four dollars, all day today.',
      hashtags: ['coldbrew', 'todaysspecial', 'coffee'],
      platforms: ['instagram', 'facebook'],
    },
    // Ironworks Gym
    {
      id: 'ironworks-free', customer: 'ironworks', lead: true, format: '4x5',
      headline: 'First month free.',
      sub: 'No contract. Just show up.',
      caption: 'Your first month is free. No contract, no sign-up fee. Walk in, train, decide later.',
      hashtags: ['gym', 'firstmonthfree', 'strength'],
      platforms: ['instagram', 'facebook', 'x'],
    },
    {
      id: 'ironworks-schedule', customer: 'ironworks', lead: false, format: '1x1',
      headline: 'This week',
      sub: 'Mon Strength. Tue Spin. Wed Boxing. Thu Strength. Fri Open gym. Sat Bootcamp.',
      caption: "This week's classes. Open gym all day Friday.",
      hashtags: ['gym', 'classschedule', 'training'],
      platforms: ['instagram', 'facebook', 'x'],
    },
    {
      id: 'ironworks-story', customer: 'ironworks', lead: false, format: '9x16',
      headline: '6am club',
      sub: "Doors open 5:45. Coffee's on us.",
      caption: '6am club. Doors open at 5:45 and the coffee is on us.',
      hashtags: ['6amclub', 'gym', 'earlybird'],
      platforms: ['instagram', 'facebook'],
    },
    // Ace Auto Repair
    {
      id: 'aceauto-brakes', customer: 'aceauto', lead: true, format: '4x5',
      headline: 'Free brake inspection.',
      sub: 'All November. No appointment needed.',
      caption: 'Free brake inspection all November. Drive in, no appointment needed.',
      hashtags: ['brakes', 'autorepair', 'november'],
      platforms: ['facebook', 'instagram'],
    },
    {
      id: 'aceauto-hiring', customer: 'aceauto', lead: false, format: '1x1',
      headline: "We're hiring.",
      sub: 'One full-time technician. Apply in the shop or by email.',
      caption: "We're hiring one full-time technician. Apply in the shop or by email.",
      hashtags: ['hiring', 'mechanic', 'autorepair'],
      platforms: ['facebook', 'instagram'],
    },
    {
      id: 'aceauto-tip', customer: 'aceauto', lead: false, format: '4x5',
      headline: 'Cold morning?',
      sub: 'Check your tire pressure. It drops one PSI for every ten degrees.',
      caption: 'Cold morning? Tire pressure drops about one PSI for every ten degrees. Check it before the long drive.',
      hashtags: ['cartips', 'winter', 'autorepair'],
      platforms: ['facebook', 'instagram'],
    },
  ],

  // Flat geometric marks, one per customer. Decorative: aria-hidden in the art.
  motifs: {
    cloud: '<svg viewBox="0 0 48 48" aria-hidden="true" focusable="false"><path d="M14 34h20a8 8 0 0 0 1-15.9A11 11 0 0 0 14 20a7 7 0 0 0 0 14Z" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/><path d="M17 34v7M24 34v7M31 34v7" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg>',
    cup: '<svg viewBox="0 0 48 48" aria-hidden="true" focusable="false"><path d="M10 14h24v12a10 10 0 0 1-10 10h-4a10 10 0 0 1-10-10Z" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/><path d="M34 18h3a5 5 0 0 1 0 10h-3" fill="none" stroke="currentColor" stroke-width="3"/><path d="M8 42h30" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg>',
    plate: '<svg viewBox="0 0 48 48" aria-hidden="true" focusable="false"><path d="M6 24h36" stroke="currentColor" stroke-width="3" stroke-linecap="round"/><rect x="10" y="13" width="6" height="22" rx="1" fill="currentColor"/><rect x="32" y="13" width="6" height="22" rx="1" fill="currentColor"/><rect x="3" y="17" width="4" height="14" rx="1" fill="currentColor"/><rect x="41" y="17" width="4" height="14" rx="1" fill="currentColor"/></svg>',
    wrench: '<svg viewBox="0 0 48 48" aria-hidden="true" focusable="false"><path d="M40 13a10 10 0 0 1-13.2 12.4L13 39.2a3.5 3.5 0 0 1-5-5l13.8-13.8A10 10 0 0 1 35 7l-6 6 1.5 4.5L35 19Z" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/></svg>',
  },

  steps: [
    { title: 'We talk', body: 'A short call about your business and who you want walking in.' },
    { title: 'I draft, you approve', body: 'A month of posts at once. Change anything.' },
    { title: 'They go out', body: 'Scheduled and posted for you, with a recap each month.' },
  ],

  // Placeholder numbers, sized to test the layout. Not Zack's real prices.
  tiers: [
    { id: 'starter', name: 'Starter', price: '$150', posts: '8 posts a month', platforms: '1 platform', recommended: false },
    { id: 'standard', name: 'Standard', price: '$300', posts: '16 posts a month', platforms: '2 platforms', recommended: true },
    { id: 'full', name: 'Full', price: '$500', posts: '30 posts a month, plus stories', platforms: 'Every platform', recommended: false },
  ],

  copy: {
    subline: 'I make a month of social posts for local businesses. You approve them, I schedule them. From $150 a month.',
    sublineNoPrice: 'I make a month of social posts for local businesses. You approve them, I schedule them.',
    seeWork: 'See the work',
    pricing: 'Pricing',
    emailMe: 'Email me',
    contactLine: "Tell me about your business and I'll reply within a day.",
    footerNote: 'Sample work. Businesses shown are fictional except NFTek.',
    perMonth: '/month',
    recommended: 'Recommended',
    tierButton: 'Email me about {tier}',
    scheduled: 'Scheduled',
    learnMore: 'Learn more',
    story: 'Story',
    lightboxClose: 'Close',
    pause: 'Pause',
    play: 'Play',
  },

  taglines: {
    minimal: [
      { key: 'a', text: 'You run the shop. I run the feed.', accent: 'feed' },
      { key: 'b', text: 'Posts your customers actually stop for.', accent: 'stop' },
      { key: 'c', text: 'Your business, posted. Every week.', accent: 'posted' },
    ],
    interactive: [
      { key: 'a', text: 'Your business, posted every week.', dropsPrice: false },
      { key: 'b', text: 'Social media, handled. From $150 a month.', dropsPrice: true },
      { key: 'c', text: 'The posts get made. You get your evenings back.', dropsPrice: false },
    ],
  },
};
```

- [ ] **Step 6: Run the tests and make sure they pass**

Run: `cd /c/Users/mythi/Claude/newtzmedia-site && node --test "tests/*.test.js"`
Expected: `# pass 9`, `# fail 0`.

- [ ] **Step 7: Touch up the spec for deviations 1 and 2**

Use the Edit tool on the spec:

1. In section 4.2, replace the Google Fonts line with: `- Google Fonts link: Bricolage Grotesque 800, Instrument Sans 400 and 600, Gabarito 500 and 800 (the artwork uses Gabarito in both mockups, section 6).`
2. In section 5.2, replace the Google Fonts line with: `- Google Fonts link: Gabarito 500 and 800, Figtree 400 500 600.`
3. In section 6, replace the sentence `headline and supporting text in the post's own type (Gabarito for all posts,` ... `and the SVG motif.` with: `headline in Gabarito 800 and supporting text in Gabarito 500 (the artwork looks the same in both mockups), the platform chrome around it in the system font stack as a real phone would show it, and the SVG motif.`
4. In section 8, add `    logic.js           pure selectors and HTML-string renderers; Node-tested` after the `content.js` line, and add a `  tests/` block listing `content.test.js`, `logic.test.js`, `render.test.js`, `pages.test.js` after the mockups block.

- [ ] **Step 8: Commit**

```bash
cd /c/Users/mythi/Claude/newtzmedia-site && git add .gitattributes .claude/launch.json mockups/content.js tests/content.test.js docs/superpowers/specs/2026-09-24-newtzmedia-mockups-design.md && git commit -q -F - <<'EOF'
Add content data, its tests, and the preview config

Every word and sample post for both mockups lives in content.js. Node
tests guard the data rules (lead pieces, platform sets, no fake reviews).

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>
EOF
git log --oneline -1
```

---
### Task 2: logic.js selectors and taglines

**Files:**
- Create: `mockups/logic.js`, `tests/logic.test.js`

**Interfaces:**
- Consumes: `globalThis.NEWTZ_CONTENT` (Task 1).
- Produces: `globalThis.NEWTZ_LOGIC` with `escapeHtml(s)`, `customerById(id)`, `platformsFor(customerId)`, `piecesFor(customerId, platformId)`, `nextCustomerId(currentId)`, `chipFor(customerId)`, `displayRatio(piece, platformId)`, `frameClass(piece, platformId)`, `artText(piece)`, `taglineFor(style, key)`. Task 3 adds the renderers to the same object.

- [ ] **Step 1: Write the failing tests**

`tests/logic.test.js`:
```js
// Pure selectors over the content. No DOM.
const { test } = require('node:test');
const assert = require('node:assert/strict');
require('../mockups/content.js');
require('../mockups/logic.js');
const C = globalThis.NEWTZ_CONTENT;
const L = globalThis.NEWTZ_LOGIC;

test('platformsFor returns the customer order as a copy', () => {
  const p = L.platformsFor('ironworks');
  assert.deepEqual(p, ['instagram', 'facebook', 'x']);
  p.push('linkedin');
  assert.deepEqual(L.platformsFor('ironworks'), ['instagram', 'facebook', 'x']);
});

test('piecesFor filters by platform and puts the lead first', () => {
  const ps = L.piecesFor('ironworks', 'x');
  assert.equal(ps.length, 2);
  assert.equal(ps[0].id, 'ironworks-free');
  assert.ok(ps.every((p) => p.platforms.includes('x')));
  assert.equal(L.piecesFor('nftek', 'linkedin').length, 3);
});

test('piecesFor on a platform the customer lacks returns nothing', () => {
  assert.deepEqual(L.piecesFor('brewhaus', 'linkedin'), []);
});

test('nextCustomerId cycles in content order and wraps', () => {
  assert.equal(L.nextCustomerId('nftek'), 'brewhaus');
  assert.equal(L.nextCustomerId('ironworks'), 'aceauto');
  assert.equal(L.nextCustomerId('aceauto'), 'nftek');
});

test('chipFor joins the Scheduled word and the customer time with a middle dot', () => {
  assert.equal(L.chipFor('brewhaus'), 'Scheduled · Mon 7:00am');
});

test('displayRatio and frameClass: X is always 16:9, otherwise the native ratio', () => {
  const stat = C.pieces.find((p) => p.id === 'nftek-stat');
  const car = C.pieces.find((p) => p.id === 'nftek-carousel');
  const story = C.pieces.find((p) => p.id === 'brewhaus-story');
  assert.equal(L.displayRatio(stat, 'linkedin'), '4:5');
  assert.equal(L.displayRatio(stat, 'x'), '16:9');
  assert.equal(L.displayRatio(car, 'linkedin'), '1:1');
  assert.equal(L.displayRatio(story, 'instagram'), '9:16');
  assert.equal(L.frameClass(stat, 'x'), '16x9');
  assert.equal(L.frameClass(car, 'linkedin'), '1x1');
  assert.equal(L.frameClass(story, 'facebook'), '9x16');
});

test('artText uses the first slide for a carousel', () => {
  const car = C.pieces.find((p) => p.id === 'nftek-carousel');
  assert.deepEqual(L.artText(car), car.slides[0]);
  const stat = C.pieces.find((p) => p.id === 'nftek-stat');
  assert.deepEqual(L.artText(stat), { headline: stat.headline, sub: stat.sub });
});

test('taglineFor minimal wraps the accent word in <em> and keeps the full subline', () => {
  const t = L.taglineFor('minimal', 'a');
  assert.equal(t.headlineHtml, 'You run the shop. I run the <em>feed</em>.');
  assert.equal(t.subline, C.copy.subline);
  assert.equal(L.taglineFor('minimal', 'c').headlineHtml, 'Your business, <em>posted</em>. Every week.');
});

test('taglineFor interactive b drops the price from the subline; a and c keep it', () => {
  assert.equal(L.taglineFor('interactive', 'b').subline, C.copy.sublineNoPrice);
  assert.equal(L.taglineFor('interactive', 'a').subline, C.copy.subline);
  assert.equal(L.taglineFor('interactive', 'c').headlineHtml, 'The posts get made. You get your evenings back.');
});

test('escapeHtml escapes the five characters', () => {
  assert.equal(L.escapeHtml('<a href="x">&\'</a>'), '&lt;a href=&quot;x&quot;&gt;&amp;&#39;&lt;/a&gt;');
});

test('unknown ids throw', () => {
  assert.throws(() => L.customerById('nobody'), /Unknown customer/);
  assert.throws(() => L.taglineFor('minimal', 'z'), /Unknown tagline/);
});
```

- [ ] **Step 2: Run it to make sure it fails**

Run: `cd /c/Users/mythi/Claude/newtzmedia-site && node --test "tests/*.test.js"`
Expected: FAIL, `Cannot find module '../mockups/logic.js'`.

- [ ] **Step 3: Write `mockups/logic.js`**

```js
// logic.js - pure functions: selectors over NEWTZ_CONTENT and HTML-string
// renderers. No DOM access, so Node can test every function. One global:
// NEWTZ_LOGIC. Task 3 adds the render* functions to the returned object.
globalThis.NEWTZ_LOGIC = (function (C) {
  'use strict';

  const RATIO = { '4x5': '4:5', '1x1': '1:1', '9x16': '9:16', carousel: '1:1' };

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (ch) => (
      { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]
    ));
  }

  function customerById(id) {
    const c = C.customers.find((x) => x.id === id);
    if (!c) throw new Error('Unknown customer: ' + id);
    return c;
  }

  function platformsFor(customerId) {
    return customerById(customerId).platforms.slice();
  }

  // Pieces that go to this platform, lead first, otherwise content order.
  function piecesFor(customerId, platformId) {
    const all = C.pieces.filter((p) => p.customer === customerId && p.platforms.includes(platformId));
    return all.filter((p) => p.lead).concat(all.filter((p) => !p.lead));
  }

  function nextCustomerId(currentId) {
    const i = C.customers.findIndex((c) => c.id === currentId);
    return C.customers[(i + 1) % C.customers.length].id;
  }

  function chipFor(customerId) {
    return C.copy.scheduled + ' · ' + customerById(customerId).chip;
  }

  // X crops every image to 16:9; every other platform shows the native ratio.
  function displayRatio(piece, platformId) {
    return platformId === 'x' ? '16:9' : RATIO[piece.format];
  }

  function frameClass(piece, platformId) {
    if (platformId === 'x') return '16x9';
    return piece.format === 'carousel' ? '1x1' : piece.format;
  }

  function artText(piece) {
    return piece.format === 'carousel' ? piece.slides[0] : { headline: piece.headline, sub: piece.sub };
  }

  function taglineFor(style, key) {
    const list = C.taglines[style] || [];
    const t = list.find((x) => x.key === key);
    if (!t) throw new Error('Unknown tagline: ' + style + '/' + key);
    let headlineHtml = escapeHtml(t.text);
    if (t.accent) headlineHtml = headlineHtml.replace(t.accent, '<em>' + t.accent + '</em>');
    return { headlineHtml, subline: t.dropsPrice ? C.copy.sublineNoPrice : C.copy.subline };
  }

  return {
    escapeHtml, customerById, platformsFor, piecesFor, nextCustomerId, chipFor,
    displayRatio, frameClass, artText, taglineFor,
  };
})(globalThis.NEWTZ_CONTENT);
```

- [ ] **Step 4: Run the tests and make sure they pass**

Run: `cd /c/Users/mythi/Claude/newtzmedia-site && node --test "tests/*.test.js"`
Expected: `# pass 20`, `# fail 0`.

- [ ] **Step 5: Commit**

```bash
cd /c/Users/mythi/Claude/newtzmedia-site && git add mockups/logic.js tests/logic.test.js && git commit -q -F - <<'EOF'
Add logic.js selectors and tagline helper with tests

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>
EOF
git log --oneline -1
```

---

### Task 3: logic.js renderers

**Files:**
- Modify: `mockups/logic.js` (add renderers before the `return`, and add them to the returned object)
- Create: `tests/render.test.js`

**Interfaces:**
- Consumes: everything Task 2 produced.
- Produces, all returning HTML strings: `renderArt(customer, piece)`, `renderPost(customer, piece, platformId)`, `renderCard(customer, piece, platformId)`, `renderGallery(customerId, platformId)`, `renderCustomerTabs(activeId, opts)` where `opts` defaults to `{ prefix: 'ctab', controls: 'gallery' }`, `renderPlatformTabs(customerId, activeId)`, `renderHeroPost(customerId)`, `renderSteps()`, `renderTiers()`, `renderContact()`, `renderFooterNote()`.
- Markup contract used by Tasks 5 to 9 (class names are fixed):
  - post: `article.post.post--{platform}[data-format]` containing `header.post__head` (`.post__avatar`, `.post__name`, `.post__meta`), optional `p.post__text`, `div.post__frame.post__frame--{4x5|1x1|9x16|16x9}` (style attribute sets `--art-bg`, `--art-ink`, `--art-accent`) containing `div.art.art--{format}` (`.art__brand`, `.art__motif`, `.art__headline`, `.art__sub`) and optional `span.post__story`; then per platform `div.post__actions` with `span.post__icon`, `p.post__caption` with `.post__tags`, `div.post__linkcard` (`.post__domain`, `.post__linktitle`, `.post__btn`), `div.post__doc` with `span.post__pages`.
  - card: `article.card[data-piece][data-customer][data-platform]` > `div.card__post` (`span.card__marks`, the post, `span.card__chip`, `button.card__open[aria-label]`) + `p.card__meta`.
  - tabs: `button.tab[role=tab][id][aria-selected][aria-controls][tabindex][data-customer|data-platform]`.
  - hero: `div.hero-post` > `p.hero-post__label`, the post, `span.chip`.
  - steps: `li.step` > `h3` + `p`. Tiers: `article.tier(.tier--recommended)` > optional `span.tier__badge`, `h3`, `p.tier__price > span`, `ul`, `a.btn`.

- [ ] **Step 1: Write the failing tests**

`tests/render.test.js`:
```js
// Renderers return HTML strings; these tests check structure, order and escaping.
const { test } = require('node:test');
const assert = require('node:assert/strict');
require('../mockups/content.js');
require('../mockups/logic.js');
const C = globalThis.NEWTZ_CONTENT;
const L = globalThis.NEWTZ_LOGIC;
const piece = (id) => C.pieces.find((p) => p.id === id);
const count = (html, re) => (html.match(re) || []).length;

test('Instagram: template class, native 4:5 frame, caption and hashtags as text, actions row', () => {
  const html = L.renderPost(L.customerById('brewhaus'), piece('brewhaus-fall'), 'instagram');
  assert.match(html, /^<article class="post post--instagram" data-format="4x5">/);
  assert.ok(html.includes('post__frame post__frame--4x5'));
  assert.ok(html.includes('--art-bg:#F3E6D3;--art-ink:#3B2415;--art-accent:#D9702B'));
  assert.ok(html.includes(piece('brewhaus-fall').caption));
  assert.ok(html.includes('#fallmenu #coffeeshop #maplelatte'));
  assert.ok(html.includes('<strong>brewhaus</strong>'));
  assert.equal(count(html, /post__icon/g), 3);
  assert.ok(html.includes('The fall menu is here.'));
});

test('X: text first, 16:9 frame, no hashtags', () => {
  const html = L.renderPost(L.customerById('ironworks'), piece('ironworks-free'), 'x');
  assert.ok(html.indexOf('post__text') < html.indexOf('post__frame'));
  assert.ok(html.includes('post__frame--16x9'));
  assert.ok(html.includes('art art--4x5'));
  assert.ok(!html.includes('#gym'));
  assert.ok(html.includes('@ironworksgym'));
});

test('LinkedIn carousel: document with 1/3, first slide as the artwork', () => {
  const html = L.renderPost(L.customerById('nftek'), piece('nftek-carousel'), 'linkedin');
  assert.ok(html.includes('post__doc'));
  assert.ok(html.includes('<span class="post__pages">1/3</span>'));
  assert.ok(html.includes('The boring part'));
  assert.ok(!html.includes('What we automated'));
  assert.ok(html.includes('post__frame--1x1'));
  const single = L.renderPost(L.customerById('nftek'), piece('nftek-stat'), 'linkedin');
  assert.ok(single.includes('<span class="post__pages">1/1</span>'));
  assert.ok(single.includes('Cloud and AI automation consulting · 1d'));
});

test('Facebook: link card with the domain, headline and Learn more', () => {
  const html = L.renderPost(L.customerById('aceauto'), piece('aceauto-brakes'), 'facebook');
  assert.ok(html.includes('post__linkcard'));
  assert.ok(html.includes('aceauto.example') || html.includes('aceautorepair.example'));
  assert.ok(html.includes('<span class="post__linktitle">Free brake inspection.</span>'));
  assert.ok(html.includes('Learn more'));
});

test('a 9:16 piece gets the Story label and a 9x16 frame on Instagram and Facebook', () => {
  for (const pl of ['instagram', 'facebook']) {
    const html = L.renderPost(L.customerById('brewhaus'), piece('brewhaus-story'), pl);
    assert.ok(html.includes('post__frame--9x16'), pl);
    assert.ok(html.includes('<span class="post__story">Story</span>'), pl);
  }
});

test('the artwork carries the brand, the motif and both text lines', () => {
  const html = L.renderArt(L.customerById('ironworks'), piece('ironworks-free'));
  assert.ok(html.startsWith('<div class="art art--4x5">'));
  assert.ok(html.includes('<span class="art__brand">Ironworks Gym</span>'));
  assert.ok(html.includes(C.motifs.plate));
  assert.ok(html.includes('<p class="art__headline">First month free.</p>'));
  assert.ok(html.includes('<p class="art__sub">No contract. Just show up.</p>'));
});

test('renderCard wraps the post with marks, chip, open button inside card__post and a meta strip beside it', () => {
  const html = L.renderCard(L.customerById('brewhaus'), piece('brewhaus-fall'), 'instagram');
  assert.match(html, /^<article class="card" data-piece="brewhaus-fall" data-customer="brewhaus" data-platform="instagram">/);
  const order = ['card__post', 'card__marks', 'post post--instagram', 'card__chip', 'card__open', 'card__meta'];
  let last = -1;
  for (const s of order) { const i = html.indexOf(s); assert.ok(i > last, s); last = i; }
  assert.ok(html.includes('Brew Haus · Instagram · 4:5 · Sept 2026'));
  assert.ok(html.includes('Scheduled · Mon 7:00am'));
  assert.ok(html.includes('aria-label="View larger: Brew Haus, The fall menu is here."'));
  assert.ok(html.includes('type="button"'));
});

test('renderGallery renders one card per piece, lead first, 25 cards over the nine combinations', () => {
  const html = L.renderGallery('nftek', 'linkedin');
  assert.equal(count(html, /class="card"/g), 3);
  assert.ok(html.indexOf('nftek-stat') < html.indexOf('nftek-carousel'));
  let total = 0;
  for (const c of C.customers) for (const pl of c.platforms) total += count(L.renderGallery(c.id, pl), /class="card"/g);
  assert.equal(total, 25);
});

test('customer tabs: four tabs, one selected, roving tabindex, aria-controls, optional prefix', () => {
  const html = L.renderCustomerTabs('brewhaus');
  assert.equal(count(html, /role="tab"/g), 4);
  assert.equal(count(html, /aria-selected="true"/g), 1);
  assert.equal(count(html, /tabindex="-1"/g), 3);
  assert.ok(html.includes('<button class="tab" role="tab" id="ctab-brewhaus" aria-selected="true" aria-controls="gallery" tabindex="0" data-customer="brewhaus">Brew Haus</button>'));
  const hero = L.renderCustomerTabs('nftek', { prefix: 'htab', controls: 'hero-panel' });
  assert.ok(hero.includes('id="htab-nftek" aria-selected="true" aria-controls="hero-panel"'));
});

test('platform tabs follow the customer and mark the active one', () => {
  const html = L.renderPlatformTabs('ironworks', 'facebook');
  assert.equal(count(html, /role="tab"/g), 3);
  assert.ok(html.includes('id="ptab-facebook" aria-selected="true"'));
  assert.ok(html.includes('data-platform="x">X</button>'));
});

test('hero post shows the lead on the first platform with the label and chip', () => {
  const html = L.renderHeroPost('nftek');
  assert.ok(html.startsWith('<div class="hero-post"><p class="hero-post__label">NFTek · LinkedIn</p>'));
  assert.ok(html.includes('post--linkedin'));
  assert.ok(html.includes('6 hours to 20 minutes.'));
  assert.ok(html.endsWith('<span class="chip">Scheduled · Tue 8:00am</span></div>'));
});

test('steps render three li in order', () => {
  const html = L.renderSteps();
  assert.equal(count(html, /<li class="step">/g), 3);
  assert.ok(html.indexOf('We talk') < html.indexOf('I draft, you approve'));
  assert.ok(html.includes('<h3>They go out</h3><p>Scheduled and posted for you, with a recap each month.</p>'));
});

test('tiers: one recommended with a badge, every button mails the placeholder address', () => {
  const html = L.renderTiers();
  assert.equal(count(html, /<article class="tier">/g), 2);
  assert.equal(count(html, /<article class="tier tier--recommended">/g), 1);
  assert.equal(count(html, /<span class="tier__badge">Recommended<\/span>/g), 1);
  assert.equal(count(html, /href="mailto:hello@newtzmedia\.example\?subject=/g), 3);
  assert.ok(html.includes('Email me about Standard'));
  assert.ok(html.includes('<p class="tier__price"><span>$300</span>/month</p>'));
  assert.ok(html.includes('<li>16 posts a month</li><li>2 platforms</li>'));
});

test('contact and footer', () => {
  assert.equal(L.renderContact(), `<p>Tell me about your business and I&#39;ll reply within a day.</p><a class="btn" href="mailto:hello@newtzmedia.example">hello@newtzmedia.example</a>`);
  assert.equal(L.renderFooterNote(), 'Sample work. Businesses shown are fictional except NFTek.');
});

test('every text field is escaped', () => {
  const c = Object.assign({}, L.customerById('brewhaus'), { name: 'A&B <Co>' });
  const html = L.renderPost(c, piece('brewhaus-fall'), 'instagram');
  assert.ok(html.includes('A&amp;B &lt;Co&gt;'));
  assert.ok(!html.includes('<Co>'));
});
```

- [ ] **Step 2: Run it to make sure it fails**

Run: `cd /c/Users/mythi/Claude/newtzmedia-site && node --test "tests/*.test.js"`
Expected: the new file FAILS with `L.renderPost is not a function` (and similar); the earlier 20 still pass.

- [ ] **Step 3: Add the renderers to `mockups/logic.js`**

Insert this block after `taglineFor` and before the `return`:

```js
  // ---- renderers -------------------------------------------------------

  const ICONS = {
    heart: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20s-7-4.6-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.4-7 10-7 10Z" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>',
    comment: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16v11H9l-5 4Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>',
    share: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 3 3 10l8 3 3 8Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>',
    repost: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 7h10l-3-3M17 17H7l3 3" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    like: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 11v9H3v-9Zm4 9h7a2 2 0 0 0 2-2l1-6a2 2 0 0 0-2-2h-5l1-5a2 2 0 0 0-3-1l-4 7v9Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>',
  };

  function paletteStyle(c) {
    return '--art-bg:' + c.palette.bg + ';--art-ink:' + c.palette.ink + ';--art-accent:' + c.palette.accent;
  }

  // The artwork: identical in both mockups and on every platform.
  function renderArt(customer, piece) {
    const t = artText(piece);
    return '<div class="art art--' + piece.format + '">' +
      '<span class="art__brand">' + escapeHtml(customer.name) + '</span>' +
      '<span class="art__motif">' + C.motifs[customer.motif] + '</span>' +
      '<p class="art__headline">' + escapeHtml(t.headline) + '</p>' +
      '<p class="art__sub">' + escapeHtml(t.sub) + '</p></div>';
  }

  // The box the artwork sits in, at the ratio this platform shows.
  function renderFrame(customer, piece, platformId) {
    const story = piece.format === '9x16' ? '<span class="post__story">' + escapeHtml(C.copy.story) + '</span>' : '';
    return '<div class="post__frame post__frame--' + frameClass(piece, platformId) + '" style="' + paletteStyle(customer) + '">' +
      renderArt(customer, piece) + story + '</div>';
  }

  function head(customer, meta) {
    return '<header class="post__head"><span class="post__avatar" style="--av:' + customer.palette.accent + '" aria-hidden="true"></span>' +
      '<span class="post__name">' + escapeHtml(customer.name) + '</span><span class="post__meta">' + escapeHtml(meta) + '</span></header>';
  }

  function actions(names) {
    return '<div class="post__actions" aria-hidden="true">' +
      names.map((n) => '<span class="post__icon">' + ICONS[n] + '</span>').join('') + '</div>';
  }

  function tags(piece) {
    return piece.hashtags.map((h) => '#' + escapeHtml(h)).join(' ');
  }

  const TEMPLATES = {
    instagram(c, p) {
      return head(c, c.handle) + renderFrame(c, p, 'instagram') + actions(['heart', 'comment', 'share']) +
        '<p class="post__caption"><strong>' + escapeHtml(c.handle.slice(1)) + '</strong> ' + escapeHtml(p.caption) +
        ' <span class="post__tags">' + tags(p) + '</span></p>';
    },
    facebook(c, p) {
      return head(c, '2h') + '<p class="post__text">' + escapeHtml(p.caption) + '</p>' + renderFrame(c, p, 'facebook') +
        '<div class="post__linkcard"><span class="post__domain">' + escapeHtml(c.domain) + '</span>' +
        '<span class="post__linktitle">' + escapeHtml(artText(p).headline) + '</span>' +
        '<span class="post__btn">' + escapeHtml(C.copy.learnMore) + '</span></div>';
    },
    x(c, p) {
      return head(c, c.handle) + '<p class="post__text">' + escapeHtml(p.caption) + '</p>' + renderFrame(c, p, 'x') +
        actions(['comment', 'repost', 'heart', 'share']);
    },
    linkedin(c, p) {
      const pages = p.format === 'carousel' ? '1/' + p.slides.length : '1/1';
      return head(c, c.description + ' · 1d') + '<p class="post__text">' + escapeHtml(p.caption) + '</p>' +
        '<div class="post__doc">' + renderFrame(c, p, 'linkedin') + '<span class="post__pages">' + pages + '</span></div>' +
        actions(['like', 'comment', 'repost', 'share']);
    },
  };

  function renderPost(customer, piece, platformId) {
    const tpl = TEMPLATES[platformId];
    if (!tpl) throw new Error('Unknown platform: ' + platformId);
    return '<article class="post post--' + platformId + '" data-format="' + piece.format + '">' + tpl(customer, piece) + '</article>';
  }

  // The wrapper each style dresses: crop marks and chip inside the post box,
  // the metadata strip beside it. Nothing here is inside .post.
  function renderCard(customer, piece, platformId) {
    const t = artText(piece);
    const label = customer.name + ' · ' + C.platforms[platformId].label + ' · ' + displayRatio(piece, platformId) + ' · ' + C.brand.month;
    return '<article class="card" data-piece="' + piece.id + '" data-customer="' + customer.id + '" data-platform="' + platformId + '">' +
      '<div class="card__post"><span class="card__marks" aria-hidden="true"></span>' +
      renderPost(customer, piece, platformId) +
      '<span class="card__chip" aria-hidden="true">' + escapeHtml(chipFor(customer.id)) + '</span>' +
      '<button class="card__open" type="button" aria-label="View larger: ' + escapeHtml(customer.name) + ', ' + escapeHtml(t.headline) + '"></button></div>' +
      '<p class="card__meta">' + escapeHtml(label) + '</p></article>';
  }

  function renderGallery(customerId, platformId) {
    const c = customerById(customerId);
    return piecesFor(customerId, platformId).map((p) => renderCard(c, p, platformId)).join('');
  }

  function tabButton(id, label, active, controls, data) {
    return '<button class="tab" role="tab" id="' + id + '" aria-selected="' + active + '" aria-controls="' + controls +
      '" tabindex="' + (active ? 0 : -1) + '" ' + data + '>' + escapeHtml(label) + '</button>';
  }

  function renderCustomerTabs(activeId, opts) {
    const o = Object.assign({ prefix: 'ctab', controls: 'gallery' }, opts || {});
    return C.customers.map((c) => tabButton(o.prefix + '-' + c.id, c.name, c.id === activeId, o.controls, 'data-customer="' + c.id + '"')).join('');
  }

  function renderPlatformTabs(customerId, activeId) {
    return platformsFor(customerId).map((p) => tabButton('ptab-' + p, C.platforms[p].label, p === activeId, 'gallery', 'data-platform="' + p + '"')).join('');
  }

  // Interactive hero: the lead piece on the customer's first platform.
  function renderHeroPost(customerId) {
    const c = customerById(customerId);
    const platform = c.platforms[0];
    const lead = piecesFor(customerId, platform)[0];
    return '<div class="hero-post"><p class="hero-post__label">' + escapeHtml(c.name) + ' · ' + escapeHtml(C.platforms[platform].label) + '</p>' +
      renderPost(c, lead, platform) + '<span class="chip">' + escapeHtml(chipFor(customerId)) + '</span></div>';
  }

  function renderSteps() {
    return C.steps.map((s) => '<li class="step"><h3>' + escapeHtml(s.title) + '</h3><p>' + escapeHtml(s.body) + '</p></li>').join('');
  }

  function renderTiers() {
    return C.tiers.map((t) => {
      const badge = t.recommended ? '<span class="tier__badge">' + escapeHtml(C.copy.recommended) + '</span>' : '';
      const btn = C.copy.tierButton.replace('{tier}', t.name);
      const href = 'mailto:' + C.brand.email + '?subject=' + encodeURIComponent(t.name + ' plan');
      return '<article class="tier' + (t.recommended ? ' tier--recommended' : '') + '">' + badge +
        '<h3>' + escapeHtml(t.name) + '</h3>' +
        '<p class="tier__price"><span>' + escapeHtml(t.price) + '</span>' + escapeHtml(C.copy.perMonth) + '</p>' +
        '<ul><li>' + escapeHtml(t.posts) + '</li><li>' + escapeHtml(t.platforms) + '</li></ul>' +
        '<a class="btn" href="' + href + '">' + escapeHtml(btn) + '</a></article>';
    }).join('');
  }

  function renderContact() {
    return '<p>' + escapeHtml(C.copy.contactLine) + '</p><a class="btn" href="mailto:' + C.brand.email + '">' + escapeHtml(C.brand.email) + '</a>';
  }

  function renderFooterNote() {
    return escapeHtml(C.copy.footerNote);
  }
```

Then replace the `return { ... }` with:

```js
  return {
    escapeHtml, customerById, platformsFor, piecesFor, nextCustomerId, chipFor,
    displayRatio, frameClass, artText, taglineFor,
    renderArt, renderPost, renderCard, renderGallery, renderCustomerTabs, renderPlatformTabs,
    renderHeroPost, renderSteps, renderTiers, renderContact, renderFooterNote,
  };
```

- [ ] **Step 4: Run the tests and make sure they pass**

Run: `cd /c/Users/mythi/Claude/newtzmedia-site && node --test "tests/*.test.js"`
Expected: `# pass 35`, `# fail 0`.

- [ ] **Step 5: Commit**

```bash
cd /c/Users/mythi/Claude/newtzmedia-site && git add mockups/logic.js tests/render.test.js && git commit -q -F - <<'EOF'
Add HTML renderers for posts, cards, tabs, hero, steps and tiers

Four platform templates wrap one artwork block. Node tests pin the
markup contract the stylesheets and behavior depend on.

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>
EOF
git log --oneline -1
```

---
### Task 4: The two HTML pages

**Files:**
- Create: `mockups/minimal.html`, `mockups/interactive.html`, `tests/pages.test.js`

**Interfaces:**
- Consumes: nothing at runtime yet (scripts and stylesheets are referenced but arrive in later tasks).
- Produces the DOM hooks Tasks 5 and 6 read: `html[data-style]`, `[data-mount="headline|subline|steps|tiers|contact|footer"]`, `[data-customer-tabs]`, `[data-platform-tabs]`, `#gallery`, `[data-lightbox]`, `[data-lightbox-body]`, `[data-close]`, `[data-tagline]`, and on the interactive page only `[data-hero]`, `[data-hero-frame]#hero-panel`, `[data-hero-pills]`, `[data-hero-toggle]`, `[data-reveal]`.

- [ ] **Step 1: Write the failing pages test**

`tests/pages.test.js`:
```js
// Structural parity between the two pages, and the boundary rule for style CSS.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const read = (f) => fs.readFileSync(path.join(__dirname, '..', 'mockups', f), 'utf8');
const count = (s, re) => (s.match(re) || []).length;

const SHARED = [
  'lang="en"', 'name="viewport"', '<title>NewtzMedia</title>',
  'data-mount="headline"', 'data-mount="subline"', 'data-mount="steps"', 'data-mount="tiers"',
  'data-mount="contact"', 'data-mount="footer"',
  'data-customer-tabs', 'data-platform-tabs', 'id="gallery"', 'role="tabpanel"',
  'data-lightbox', 'data-lightbox-body', 'data-close',
  'data-tagline="a"', 'data-tagline="b"', 'data-tagline="c"',
  '<noscript>', 'hello@newtzmedia.example',
  'id="work"', 'id="how"', 'id="pricing"', 'id="contact"',
  'href="posts.css"', 'src="content.js"', 'src="logic.js"', 'src="behavior.js"',
  'class="skip"', 'fonts.googleapis.com',
];

test('both pages carry the same hooks, one h1, and the scripts in order', () => {
  for (const f of ['minimal.html', 'interactive.html']) {
    const html = read(f);
    for (const m of SHARED) assert.ok(html.includes(m), `${f} lacks ${m}`);
    assert.equal(count(html, /<h1/g), 1, f);
    assert.ok(html.indexOf('content.js') < html.indexOf('logic.js') && html.indexOf('logic.js') < html.indexOf('behavior.js'), f);
    assert.ok(html.indexOf('posts.css') < html.indexOf(f.replace('.html', '.css')), `${f}: posts.css before the style sheet`);
  }
});

test('each page declares its style and loads only its own stylesheet', () => {
  const m = read('minimal.html');
  const i = read('interactive.html');
  assert.ok(m.includes('data-style="minimal"') && m.includes('href="minimal.css"') && !m.includes('interactive.css'));
  assert.ok(i.includes('data-style="interactive"') && i.includes('href="interactive.css"') && !i.includes('minimal.css'));
  assert.ok(m.includes('Bricolage+Grotesque') && m.includes('Instrument+Sans') && m.includes('Gabarito'));
  assert.ok(i.includes('Gabarito') && i.includes('Figtree') && !i.includes('Bricolage'));
});

test('only the interactive page has the hero demo and reveals', () => {
  const m = read('minimal.html');
  const i = read('interactive.html');
  for (const hook of ['data-hero', 'data-hero-frame', 'data-hero-pills', 'data-hero-toggle', 'id="hero-panel"']) {
    assert.ok(i.includes(hook), hook);
    assert.ok(!m.includes(hook), `minimal has ${hook}`);
  }
  assert.equal(count(i, /data-reveal/g), 4);
  assert.equal(count(m, /data-reveal/g), 0);
});

test('static tagline (a) is in each page for the no-JS case', () => {
  assert.ok(read('minimal.html').includes('You run the shop. I run the <em>feed</em>.'));
  assert.ok(read('interactive.html').includes('Your business, posted every week.'));
});

test('no style file targets the inside of a post', () => {
  for (const f of ['minimal.css', 'interactive.css']) {
    if (!fs.existsSync(path.join(__dirname, '..', 'mockups', f))) continue; // arrives in Tasks 8 and 9
    assert.doesNotMatch(read(f), /\.post__|\.art\b|\.art__/, f);
  }
});
```

- [ ] **Step 2: Run it to make sure it fails**

Run: `cd /c/Users/mythi/Claude/newtzmedia-site && node --test "tests/*.test.js"`
Expected: pages tests FAIL with `ENOENT ... minimal.html`.

- [ ] **Step 3: Write `mockups/minimal.html`**

```html
<!doctype html>
<html lang="en" data-style="minimal">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>NewtzMedia</title>
<meta name="description" content="Social media posts for local businesses, for a monthly fee.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@800&family=Gabarito:wght@500;800&family=Instrument+Sans:wght@400;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="posts.css">
<link rel="stylesheet" href="minimal.css">
</head>
<body>
<a class="skip" href="#work">Skip to the work</a>

<header class="site-head">
  <a class="wordmark" href="#top">NewtzMedia</a>
  <nav aria-label="Site">
    <a href="#work">Work</a>
    <a href="#pricing">Pricing</a>
    <a href="#contact">Email</a>
  </nav>
</header>

<main id="top">
  <section class="hero" aria-labelledby="headline">
    <h1 id="headline" data-mount="headline">You run the shop. I run the <em>feed</em>.</h1>
    <p class="subline" data-mount="subline">I make a month of social posts for local businesses. You approve them, I schedule them. From $150 a month.</p>
    <a class="btn" href="#work">See the work</a>
  </section>

  <section class="work" id="work" aria-labelledby="work-h">
    <h2 id="work-h">Work</h2>
    <div class="tabs tabs--customer" role="tablist" aria-label="Customer" data-customer-tabs></div>
    <div class="tabs tabs--platform" role="tablist" aria-label="Platform" data-platform-tabs></div>
    <div class="gallery" id="gallery" role="tabpanel"></div>
    <noscript><p>The sample posts need JavaScript to display. Email hello@newtzmedia.example and I will send them directly.</p></noscript>
  </section>

  <section class="how" id="how" aria-labelledby="how-h">
    <h2 id="how-h">How it works</h2>
    <ol class="steps" data-mount="steps"></ol>
  </section>

  <section class="pricing" id="pricing" aria-labelledby="pricing-h">
    <h2 id="pricing-h">Pricing</h2>
    <div class="tiers" data-mount="tiers"></div>
  </section>

  <section class="contact" id="contact" aria-labelledby="contact-h">
    <h2 id="contact-h">Send me a message</h2>
    <div data-mount="contact"></div>
  </section>
</main>

<footer class="site-foot">
  <span class="wordmark">NewtzMedia</span>
  <p data-mount="footer"></p>
</footer>

<dialog class="lightbox" data-lightbox aria-label="Post, larger">
  <button class="lightbox__close" type="button" data-close>Close</button>
  <div class="lightbox__body" data-lightbox-body></div>
</dialog>

<aside class="mock-controls" aria-label="Mockup controls">
  <span>Mockup controls: tagline</span>
  <button type="button" data-tagline="a" aria-pressed="true">a</button>
  <button type="button" data-tagline="b" aria-pressed="false">b</button>
  <button type="button" data-tagline="c" aria-pressed="false">c</button>
</aside>

<script src="content.js"></script>
<script src="logic.js"></script>
<script src="behavior.js"></script>
</body>
</html>
```

- [ ] **Step 4: Write `mockups/interactive.html`**

```html
<!doctype html>
<html lang="en" data-style="interactive">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>NewtzMedia</title>
<meta name="description" content="Social media posts for local businesses, for a monthly fee.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Gabarito:wght@500;800&family=Figtree:wght@400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="posts.css">
<link rel="stylesheet" href="interactive.css">
</head>
<body>
<a class="skip" href="#work">Skip to the work</a>

<header class="band" id="top">
  <div class="site-head">
    <a class="wordmark" href="#top">NewtzMedia</a>
    <nav aria-label="Site">
      <a href="#work">Work</a>
      <a href="#pricing">Pricing</a>
      <a class="btn" href="#contact">Email me</a>
    </nav>
  </div>

  <section class="hero" aria-labelledby="headline">
    <h1 id="headline" data-mount="headline">Your business, posted every week.</h1>
    <p class="subline" data-mount="subline">I make a month of social posts for local businesses. You approve them, I schedule them. From $150 a month.</p>
    <div class="hero__actions">
      <a class="btn" href="#work">See the work</a>
      <a class="btn btn--ghost" href="#pricing">Pricing</a>
    </div>

    <div class="hero__demo" data-hero>
      <div class="frame-card">
        <div class="phone">
          <div class="phone__screen" id="hero-panel" role="tabpanel" data-hero-frame></div>
        </div>
      </div>
      <div class="hero__pills" role="tablist" aria-label="Example customer" data-hero-pills></div>
      <button class="hero__toggle" type="button" data-hero-toggle>Pause</button>
    </div>
  </section>
</header>

<main>
  <section class="work" id="work" aria-labelledby="work-h" data-reveal>
    <h2 id="work-h">Work</h2>
    <div class="tabs tabs--customer" role="tablist" aria-label="Customer" data-customer-tabs></div>
    <div class="tabs tabs--platform" role="tablist" aria-label="Platform" data-platform-tabs></div>
    <div class="gallery" id="gallery" role="tabpanel"></div>
    <noscript><p>The sample posts need JavaScript to display. Email hello@newtzmedia.example and I will send them directly.</p></noscript>
  </section>

  <section class="how" id="how" aria-labelledby="how-h" data-reveal>
    <h2 id="how-h">How it works</h2>
    <ol class="steps" data-mount="steps"></ol>
  </section>

  <section class="pricing" id="pricing" aria-labelledby="pricing-h" data-reveal>
    <h2 id="pricing-h">Pricing</h2>
    <div class="tiers" data-mount="tiers"></div>
  </section>

  <section class="contact" id="contact" aria-labelledby="contact-h" data-reveal>
    <h2 id="contact-h">Send me a message</h2>
    <div data-mount="contact"></div>
  </section>
</main>

<footer class="site-foot">
  <span class="wordmark">NewtzMedia</span>
  <p data-mount="footer"></p>
</footer>

<dialog class="lightbox" data-lightbox aria-label="Post, larger">
  <button class="lightbox__close" type="button" data-close>Close</button>
  <div class="lightbox__body" data-lightbox-body></div>
</dialog>

<aside class="mock-controls" aria-label="Mockup controls">
  <span>Mockup controls: tagline</span>
  <button type="button" data-tagline="a" aria-pressed="true">a</button>
  <button type="button" data-tagline="b" aria-pressed="false">b</button>
  <button type="button" data-tagline="c" aria-pressed="false">c</button>
</aside>

<script src="content.js"></script>
<script src="logic.js"></script>
<script src="behavior.js"></script>
</body>
</html>
```

- [ ] **Step 5: Run the tests and make sure they pass**

Run: `cd /c/Users/mythi/Claude/newtzmedia-site && node --test "tests/*.test.js"`
Expected: `# pass 40`, `# fail 0`.

- [ ] **Step 6: Commit**

```bash
cd /c/Users/mythi/Claude/newtzmedia-site && git add mockups/minimal.html mockups/interactive.html tests/pages.test.js && git commit -q -F - <<'EOF'
Add the two page skeletons with shared mount points

Same sections, hooks and scripts in both; only the interactive page has
the hero demo and scroll reveals. A test keeps the two in step.

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>
EOF
git log --oneline -1
```

---

### Task 5: behavior.js core (mounts, tagline, tabs, gallery, keyboard)

**Files:**
- Create: `mockups/behavior.js`

**Interfaces:**
- Consumes: `NEWTZ_CONTENT`, `NEWTZ_LOGIC` (Tasks 1 to 3), the DOM hooks (Task 4).
- Produces: `globalThis.NEWTZ_APP = { state, selectCustomer(id), selectPlatform(id), setTagline(key), tablistKeys(list, onPick), motionOk() }` for Task 6 and for browser verification. Adds the class `reduced-motion` to `<html>` when the OS asks for it. Adds `is-swapping` to `#gallery` for the CSS-driven crossfade; reads the swap duration from the CSS custom property `--swap-ms` on `:root` (default 250).

- [ ] **Step 1: Write `mockups/behavior.js`**

```js
// behavior.js - DOM wiring for both mockups. Everything it inserts comes from
// NEWTZ_LOGIC; this file only reads the page, swaps HTML and listens to events.
// Task 6 appends the lightbox, the hero cycler and the scroll reveals.
(function () {
  'use strict';
  const C = globalThis.NEWTZ_CONTENT;
  const L = globalThis.NEWTZ_LOGIC;
  const root = document.documentElement;
  const STYLE = root.dataset.style; // 'minimal' | 'interactive'
  const $ = (sel, el) => (el || document).querySelector(sel);

  // ---- reduced motion: one class on <html>. CSS keys on it, JS checks it.
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  const applyMotion = () => root.classList.toggle('reduced-motion', mq.matches);
  applyMotion();
  mq.addEventListener('change', applyMotion);
  const motionOk = () => !root.classList.contains('reduced-motion');
  const swapMs = () => {
    if (!motionOk()) return 0;
    const v = parseInt(getComputedStyle(root).getPropertyValue('--swap-ms'), 10);
    return Number.isFinite(v) ? v : 250;
  };

  // ---- static sections
  const mount = (name, html) => {
    const el = $('[data-mount="' + name + '"]');
    if (el) el.innerHTML = html;
  };
  mount('steps', L.renderSteps());
  mount('tiers', L.renderTiers());
  mount('contact', L.renderContact());
  mount('footer', L.renderFooterNote());

  // ---- tagline (mockup controls strip)
  function setTagline(key) {
    const t = L.taglineFor(STYLE, key);
    mount('headline', t.headlineHtml);
    const sub = $('[data-mount="subline"]');
    if (sub) sub.textContent = t.subline;
    document.querySelectorAll('[data-tagline]').forEach((b) => {
      b.setAttribute('aria-pressed', String(b.dataset.tagline === key));
    });
  }
  document.querySelectorAll('[data-tagline]').forEach((b) => {
    b.addEventListener('click', () => setTagline(b.dataset.tagline));
  });
  setTagline('a');

  // ---- work section: customer tabs, platform tabs, gallery
  const state = { customer: C.customers[0].id, platform: C.customers[0].platforms[0] };
  const ctabs = $('[data-customer-tabs]');
  const ptabs = $('[data-platform-tabs]');
  const gallery = $('#gallery');

  function renderWork(animate) {
    ctabs.innerHTML = L.renderCustomerTabs(state.customer);
    ptabs.innerHTML = L.renderPlatformTabs(state.customer, state.platform);
    gallery.setAttribute('aria-labelledby', 'ctab-' + state.customer + ' ptab-' + state.platform);
    const html = L.renderGallery(state.customer, state.platform);
    const ms = animate ? swapMs() : 0;
    if (ms === 0) { gallery.innerHTML = html; return; }
    gallery.classList.add('is-swapping');
    setTimeout(() => {
      gallery.innerHTML = html;
      gallery.classList.remove('is-swapping');
    }, ms);
  }
  function selectCustomer(id) {
    state.customer = id;
    state.platform = L.platformsFor(id)[0]; // spec 6: platform resets on customer change
    renderWork(true);
  }
  function selectPlatform(id) {
    state.platform = id;
    renderWork(true);
  }
  ctabs.addEventListener('click', (e) => {
    const b = e.target.closest('[data-customer]');
    if (b) selectCustomer(b.dataset.customer);
  });
  ptabs.addEventListener('click', (e) => {
    const b = e.target.closest('[data-platform]');
    if (b) selectPlatform(b.dataset.platform);
  });

  // Arrow keys move between tabs and activate the focused one. The tabs are
  // re-rendered on activation, so focus is restored by id afterwards.
  function tablistKeys(list, onPick) {
    list.addEventListener('keydown', (e) => {
      const tabs = Array.from(list.querySelectorAll('[role="tab"]'));
      const i = tabs.indexOf(document.activeElement);
      if (i < 0) return;
      const next = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1 }[e.key];
      if (next === undefined) return;
      e.preventDefault();
      const target = tabs[(next + tabs.length) % tabs.length];
      onPick(target);
      const fresh = document.getElementById(target.id);
      if (fresh) fresh.focus();
    });
  }
  tablistKeys(ctabs, (b) => selectCustomer(b.dataset.customer));
  tablistKeys(ptabs, (b) => selectPlatform(b.dataset.platform));
  renderWork(false);

  globalThis.NEWTZ_APP = { state, selectCustomer, selectPlatform, setTagline, tablistKeys, motionOk };
})();
```

- [ ] **Step 2: Run the Node tests (no regression) and start the preview**

Run: `cd /c/Users/mythi/Claude/newtzmedia-site && node --test "tests/*.test.js"`
Expected: `# pass 40`, `# fail 0`.

Then `preview_start {name: "newtzmedia-mockups"}` and `navigate` to `http://localhost:8765/minimal.html`. Stylesheets 404 at this point; that is expected. `read_console_messages {onlyErrors: true}`: only 404s for `posts.css` and `minimal.css` are acceptable.

- [ ] **Step 3: Verify the gallery for all nine combinations (javascript_tool)**

```js
const A = NEWTZ_APP, C = NEWTZ_CONTENT; const out = [];
for (const c of C.customers) for (const p of c.platforms) {
  A.selectCustomer(c.id); A.selectPlatform(p);
  await new Promise((r) => setTimeout(r, 450));
  out.push(c.id + '/' + p + ': ' + document.querySelectorAll('#gallery .card').length + ' cards, ' +
    document.querySelector('[data-customer-tabs] [aria-selected="true"]').textContent + '/' +
    document.querySelector('[data-platform-tabs] [aria-selected="true"]').textContent +
    ', labelledby=' + document.getElementById('gallery').getAttribute('aria-labelledby'));
}
out.join('\n');
```
Expected, exactly:
```
nftek/linkedin: 3 cards, NFTek/LinkedIn, labelledby=ctab-nftek ptab-linkedin
nftek/x: 2 cards, NFTek/X, labelledby=ctab-nftek ptab-x
brewhaus/instagram: 3 cards, Brew Haus/Instagram, labelledby=ctab-brewhaus ptab-instagram
brewhaus/facebook: 3 cards, Brew Haus/Facebook, labelledby=ctab-brewhaus ptab-facebook
ironworks/instagram: 3 cards, Ironworks Gym/Instagram, labelledby=ctab-ironworks ptab-instagram
ironworks/facebook: 3 cards, Ironworks Gym/Facebook, labelledby=ctab-ironworks ptab-facebook
ironworks/x: 2 cards, Ironworks Gym/X, labelledby=ctab-ironworks ptab-x
aceauto/facebook: 3 cards, Ace Auto Repair/Facebook, labelledby=ctab-aceauto ptab-facebook
aceauto/instagram: 3 cards, Ace Auto Repair/Instagram, labelledby=ctab-aceauto ptab-instagram
```

- [ ] **Step 4: Verify customer change resets the platform, and mounts filled**

```js
NEWTZ_APP.selectCustomer('ironworks'); NEWTZ_APP.selectPlatform('x');
await new Promise((r) => setTimeout(r, 450));
NEWTZ_APP.selectCustomer('brewhaus');
await new Promise((r) => setTimeout(r, 450));
[NEWTZ_APP.state.platform,
 document.querySelectorAll('[data-mount="steps"] .step').length,
 document.querySelectorAll('[data-mount="tiers"] .tier').length,
 document.querySelector('[data-mount="contact"] a').getAttribute('href'),
 document.querySelector('[data-mount="footer"]').textContent].join(' | ');
```
Expected: `instagram | 3 | 3 | mailto:hello@newtzmedia.example | Sample work. Businesses shown are fictional except NFTek.`

- [ ] **Step 5: Verify keyboard movement and the tagline switch**

```js
const tab = document.querySelector('[data-customer-tabs] [aria-selected="true"]'); tab.focus();
tab.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
await new Promise((r) => setTimeout(r, 50));
const a = document.activeElement;
const r1 = a.id + ' ' + a.getAttribute('aria-selected') + ' ' + a.tabIndex;
a.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));
await new Promise((r) => setTimeout(r, 50));
const r2 = document.activeElement.id;
document.querySelector('[data-tagline="c"]').click();
const r3 = document.getElementById('headline').innerHTML + ' // ' + document.querySelector('[data-tagline="c"]').getAttribute('aria-pressed');
[r1, r2, r3].join('\n');
```
Expected (starting from Brew Haus after Step 4):
```
ctab-ironworks true 0
ctab-aceauto
Your business, <em>posted</em>. Every week. // true
```

- [ ] **Step 6: Verify reduced motion makes swaps instant**

```js
document.documentElement.classList.add('reduced-motion');
NEWTZ_APP.selectCustomer('nftek');
const instant = document.querySelectorAll('#gallery .card').length === 3 && !document.getElementById('gallery').classList.contains('is-swapping');
document.documentElement.classList.remove('reduced-motion');
instant;
```
Expected: `true`.

- [ ] **Step 7: Repeat Steps 3 and 4 on `http://localhost:8765/interactive.html`**

Same expected output. The hero mount stays empty until Task 6; no console errors other than the two stylesheet 404s.

- [ ] **Step 8: Commit**

```bash
cd /c/Users/mythi/Claude/newtzmedia-site && git add mockups/behavior.js && git commit -q -F - <<'EOF'
Wire mounts, tagline switch, tabs, gallery and keyboard movement

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>
EOF
git log --oneline -1
```

---
### Task 6: behavior.js lightbox, hero cycler, scroll reveals

**Files:**
- Modify: `mockups/behavior.js` (insert before the `globalThis.NEWTZ_APP = ...` line, then extend that line)

**Interfaces:**
- Consumes: Task 5's `state`, `swapMs`, `motionOk`, `tablistKeys`, `$`, `C`, `L`.
- Produces on `NEWTZ_APP`: `heroRunning()`, `heroCurrent()`, `heroShow(id, animate)` (interactive page only). Adds `is-leaving` to `[data-hero-frame]` during a swap and `is-in` to each `[data-reveal]` once visible. The lightbox is the native `<dialog>`; its body receives a full `renderCard` with the inner `.card__open` removed.

- [ ] **Step 1: Insert the lightbox block**

Insert directly above `globalThis.NEWTZ_APP = { state, ...`:

```js
  // ---- lightbox: the native <dialog> gives the focus trap and Escape for free
  const dialog = $('[data-lightbox]');
  const dialogBody = $('[data-lightbox-body]');
  let opener = null;
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.card__open');
    if (!btn || !dialog || dialog.open) return;
    const card = btn.closest('.card');
    const customer = L.customerById(card.dataset.customer);
    const piece = C.pieces.find((p) => p.id === card.dataset.piece);
    dialogBody.innerHTML = L.renderCard(customer, piece, card.dataset.platform);
    const inner = dialogBody.querySelector('.card__open');
    if (inner) inner.remove(); // no second open button inside the lightbox
    opener = btn;
    dialog.showModal();
  });
  if (dialog) {
    dialog.addEventListener('click', (e) => { if (e.target === dialog) dialog.close(); }); // backdrop click
    $('[data-close]', dialog).addEventListener('click', () => dialog.close());
    dialog.addEventListener('close', () => {
      if (opener && document.contains(opener)) opener.focus();
      opener = null;
    });
  }

  // ---- hero cycler (interactive only; the minimal page has no [data-hero])
  const hero = $('[data-hero]');
  let heroApi = {};
  if (hero) {
    const frame = $('[data-hero-frame]', hero);
    const pills = $('[data-hero-pills]', hero);
    const toggle = $('[data-hero-toggle]', hero);
    const PERIOD = 4000;          // spec 5.5: next customer every 4 seconds
    let current = C.customers[0].id;
    let timer = null;             // interval handle while cycling
    let stopped = false;          // true after a pill click or Pause: never restarts on its own
    let hovering = false;         // pointer or focus inside the hero pauses it

    function show(id, animate) {
      current = id;
      pills.innerHTML = L.renderCustomerTabs(id, { prefix: 'htab', controls: 'hero-panel' });
      const html = L.renderHeroPost(id);
      const ms = animate ? Math.min(swapMs(), 150) : 0; // 150ms fade out, then the CSS slide-in runs
      if (ms === 0) { frame.innerHTML = html; return; }
      frame.classList.add('is-leaving');
      setTimeout(() => {
        frame.innerHTML = html;
        frame.classList.remove('is-leaving');
      }, ms);
    }
    const running = () => timer !== null;
    function syncToggle() { toggle.textContent = running() ? C.copy.pause : C.copy.play; }
    function start(force) {
      if (running() || stopped || (!force && hovering) || !motionOk()) { syncToggle(); return; }
      timer = setInterval(() => show(L.nextCustomerId(current), true), PERIOD);
      syncToggle();
    }
    function stop() {
      if (running()) { clearInterval(timer); timer = null; }
      syncToggle();
    }
    const pick = (b) => { stopped = true; stop(); show(b.dataset.customer, true); };
    pills.addEventListener('click', (e) => { const b = e.target.closest('[data-customer]'); if (b) pick(b); });
    tablistKeys(pills, pick);
    toggle.addEventListener('click', () => {
      if (running()) { stopped = true; stop(); } else { stopped = false; start(true); }
    });
    hero.addEventListener('mouseenter', () => { hovering = true; stop(); });
    hero.addEventListener('mouseleave', () => { hovering = false; start(false); });
    hero.addEventListener('focusin', () => { hovering = true; stop(); });
    hero.addEventListener('focusout', (e) => {
      if (!hero.contains(e.relatedTarget)) { hovering = false; start(false); }
    });
    mq.addEventListener('change', () => { if (!motionOk()) stop(); });

    show(current, false);
    start(false);
    heroApi = { heroRunning: running, heroCurrent: () => current, heroShow: show };
  }

  // ---- scroll reveals (interactive only; the minimal page has no [data-reveal])
  const reveals = document.querySelectorAll('[data-reveal]');
  if (reveals.length) {
    if (!motionOk() || !('IntersectionObserver' in window)) {
      reveals.forEach((el) => el.classList.add('is-in'));
    } else {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
        });
      }, { threshold: 0.12 });
      reveals.forEach((el) => io.observe(el));
    }
  }
```

Then change the last line to:

```js
  globalThis.NEWTZ_APP = Object.assign({ state, selectCustomer, selectPlatform, setTagline, tablistKeys, motionOk }, heroApi);
```

- [ ] **Step 2: Node tests, then reload `http://localhost:8765/minimal.html`**

Run: `cd /c/Users/mythi/Claude/newtzmedia-site && node --test "tests/*.test.js"` -> `# pass 40`.
`navigate` to the minimal page. Console: only the two stylesheet 404s.

- [ ] **Step 3: Verify the lightbox opens, traps focus, closes, returns focus**

```js
const d = document.querySelector('[data-lightbox]');
const btn = document.querySelector('#gallery .card__open'); btn.click();
await new Promise((r) => setTimeout(r, 50));
const r1 = 'open=' + d.open + ' focusInside=' + d.contains(document.activeElement) +
  ' hasCard=' + !!d.querySelector('.card') + ' innerOpenButtons=' + d.querySelectorAll('.card__open').length +
  ' meta=' + d.querySelector('.card__meta').textContent;
d.querySelector('[data-close]').click();
await new Promise((r) => setTimeout(r, 50));
r1 + '\nclosed=' + !d.open + ' focusBack=' + (document.activeElement === btn);
```
Expected:
```
open=true focusInside=true hasCard=true innerOpenButtons=0 meta=NFTek · LinkedIn · 4:5 · Sept 2026
closed=true focusBack=true
```

Then open it again with the same `btn.click()` snippet's first two lines, press Escape with the `computer` tool (`{action: "key", text: "Escape"}`), and check `document.querySelector('[data-lightbox]').open` -> `false`.

- [ ] **Step 4: Verify the hero cycler on `http://localhost:8765/interactive.html`**

`navigate` to the interactive page, then:

```js
const A = NEWTZ_APP;
const first = A.heroCurrent();
const r1 = 'running=' + A.heroRunning() + ' first=' + first + ' toggle=' + document.querySelector('[data-hero-toggle]').textContent +
  ' pills=' + document.querySelectorAll('[data-hero-pills] [role="tab"]').length +
  ' post=' + !!document.querySelector('[data-hero-frame] .post--linkedin') + ' chip=' + document.querySelector('[data-hero-frame] .chip').textContent;
await new Promise((r) => setTimeout(r, 4300));
const r2 = 'after4s=' + A.heroCurrent() + ' selectedPill=' + document.querySelector('[data-hero-pills] [aria-selected="true"]').textContent;
document.querySelector('[data-hero-pills] [data-customer="aceauto"]').click();
await new Promise((r) => setTimeout(r, 250));
const r3 = 'afterClick=' + A.heroCurrent() + ' running=' + A.heroRunning() + ' toggle=' + document.querySelector('[data-hero-toggle]').textContent;
await new Promise((r) => setTimeout(r, 4300));
const r4 = 'stillStopped=' + (A.heroCurrent() === 'aceauto' && !A.heroRunning());
document.querySelector('[data-hero-toggle]').click();
const r5 = 'afterPlay running=' + A.heroRunning() + ' toggle=' + document.querySelector('[data-hero-toggle]').textContent;
[r1, r2, r3, r4, r5].join('\n');
```
Expected:
```
running=true first=nftek toggle=Pause pills=4 post=true chip=Scheduled · Tue 8:00am
after4s=brewhaus selectedPill=Brew Haus
afterClick=aceauto running=false toggle=Play
stillStopped=true
afterPlay running=true toggle=Pause
```
Note: the `javascript_tool` call itself does not move the pointer, so `hovering` stays false during this check.

- [ ] **Step 5: Verify reduced motion stops the cycler and reveals everything**

```js
document.documentElement.classList.add('reduced-motion');
document.querySelector('[data-hero-toggle]').click(); // Pause
document.querySelector('[data-hero-toggle]').click(); // Play attempt: must not start
const r = 'running=' + NEWTZ_APP.heroRunning() + ' reveals=' + document.querySelectorAll('[data-reveal].is-in').length + '/' + document.querySelectorAll('[data-reveal]').length;
document.documentElement.classList.remove('reduced-motion');
r;
```
Expected: `running=false reveals=4/4` (the reveals may already be 4/4 if the page was scrolled; the point is `running=false`).

- [ ] **Step 6: Verify reveals fire on scroll after a fresh load**

`navigate` to the interactive page again, then:
```js
const before = document.querySelectorAll('[data-reveal].is-in').length;
window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' }); // the page has smooth scrolling on; instant keeps the wait short
await new Promise((r) => setTimeout(r, 800));
'innerH=' + innerHeight + ' ' + before + ' -> ' + document.querySelectorAll('[data-reveal].is-in').length;
```
Expected: `innerH=<a real height, not 0>` and ends in `-> 4`. With a height of 0 the pane is hidden and the result is meaningless (protocol item 7).

- [ ] **Step 7: Commit**

```bash
cd /c/Users/mythi/Claude/newtzmedia-site && git add mockups/behavior.js && git commit -q -F - <<'EOF'
Add lightbox, hero cycler with pause, and scroll reveals

Native dialog for the lightbox. The hero cycles every 4s, pauses on
hover or focus, and stays stopped after a manual pick or Pause.

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>
EOF
git log --oneline -1
```

---

### Task 7: posts.css (artwork and the four platform templates)

**Files:**
- Create: `mockups/posts.css`

**Interfaces:**
- Consumes: the post markup contract from Task 3.
- Produces: styling for every `.post*` and `.art*` class. Also the shared `.mock-controls` strip, since it is mockup-only chrome and must look the same on both pages. Style files never touch these classes.

- [ ] **Step 1: Write `mockups/posts.css`**

```css
/* posts.css - everything INSIDE a post: the platform chrome and the artwork.
   Identical in both mockups. minimal.css and interactive.css never target
   these classes (tests/pages.test.js enforces it). */

/* ---- platform chrome: a real phone shows this in the system font ---- */
.post {
  --post-bg: #ffffff;
  --post-ink: #151515;
  --post-muted: #6b6b6b;
  --post-line: #e6e6e6;
  font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  font-size: 13px;
  line-height: 1.4;
  color: var(--post-ink);
  background: var(--post-bg);
  border-radius: 12px;
  overflow: hidden;
  text-align: left;
}
.post__head { display: flex; align-items: center; gap: 8px; padding: 10px 12px; }
.post__avatar { width: 28px; height: 28px; border-radius: 50%; background: var(--av, #999); flex: none; }
.post__name { font-weight: 600; white-space: nowrap; }
.post__meta { color: var(--post-muted); font-size: 12px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.post__text, .post__caption { margin: 0; padding: 0 12px 10px; }
.post__caption strong { font-weight: 600; }
.post__tags { color: #3a5fa8; }
.post__actions { display: flex; gap: 14px; padding: 8px 12px 2px; color: var(--post-ink); }
.post__icon { width: 20px; height: 20px; display: inline-block; }
.post__icon svg { width: 100%; height: 100%; display: block; }
.post--x .post__actions, .post--linkedin .post__actions {
  color: var(--post-muted); justify-content: space-between; padding: 8px 12px 10px;
}
.post__linkcard { display: grid; gap: 2px; padding: 10px 12px; background: #f0f2f5; border-top: 1px solid var(--post-line); }
.post__domain { font-size: 11px; letter-spacing: .04em; text-transform: uppercase; color: var(--post-muted); }
.post__linktitle { font-weight: 600; }
.post__btn { justify-self: start; margin-top: 6px; padding: 5px 10px; border-radius: 6px; background: #e4e6eb; font-weight: 600; font-size: 12px; }
.post__doc { position: relative; }
.post__pages, .post__story {
  position: absolute; padding: 2px 8px; border-radius: 999px;
  background: #1a1a1a; color: #fff; font-size: 11px; font-weight: 600; letter-spacing: .04em;
}
.post__pages { top: 8px; right: 8px; }
.post__story { top: 10px; left: 10px; text-transform: uppercase; }

/* ---- frames: the box the artwork sits in, at the ratio the platform shows ---- */
.post__frame {
  position: relative; overflow: hidden;
  display: grid; place-items: center;
  background: var(--art-bg);
}
.post__frame--4x5 { aspect-ratio: 4 / 5; }
.post__frame--1x1 { aspect-ratio: 1; }
.post__frame--9x16 { aspect-ratio: 9 / 16; }
.post__frame--16x9 { aspect-ratio: 16 / 9; }
.post--x .post__frame { margin: 0 12px 4px; border-radius: 12px; border: 1px solid var(--post-line); }

/* ---- artwork: the same in both mockups and on every platform ---- */
.art {
  position: relative; width: 100%; height: 100%; box-sizing: border-box; padding: 9%;
  display: flex; flex-direction: column; justify-content: center; gap: .45em;
  background: var(--art-bg); color: var(--art-ink);
  font-family: "Gabarito", system-ui, sans-serif;
  container-type: inline-size;
}
/* X shows 16:9: keep the native ratio and let the same color fill the sides */
.post__frame--16x9 .art { width: auto; height: 100%; aspect-ratio: 4 / 5; }
.post__frame--16x9 .art--1x1 { aspect-ratio: 1; }
.art__brand {
  position: absolute; top: 7%; right: 8%;
  font-size: clamp(9px, 3.6cqw, 13px); font-weight: 800; letter-spacing: .08em; text-transform: uppercase;
  color: var(--art-ink); opacity: .85;
}
.art__motif { width: 22%; max-width: 72px; color: var(--art-accent); }
.art__motif svg { display: block; width: 100%; height: auto; }
.art__headline { margin: 0; font-weight: 800; font-size: clamp(16px, 11cqw, 44px); line-height: 1; letter-spacing: -.02em; text-wrap: balance; }
.art__sub { margin: 0; font-weight: 500; font-size: clamp(10px, 4.6cqw, 16px); line-height: 1.3; opacity: .9; }
.art--9x16 .art__headline { font-size: clamp(16px, 12cqw, 40px); }

/* ---- mockup controls strip: not part of either design ---- */
.mock-controls {
  position: fixed; right: 1rem; bottom: 1rem; z-index: 20;
  display: flex; gap: .4rem; align-items: center; padding: .4rem .6rem;
  border-radius: 8px; background: #fff; color: #111;
  font: 600 .75rem/1 system-ui, sans-serif; box-shadow: 0 4px 16px rgba(0, 0, 0, .4);
}
.mock-controls button {
  font: inherit; min-width: 28px; height: 28px; border: 1px solid #bbb; border-radius: 6px;
  background: #f3f3f3; color: #111; cursor: pointer;
}
.mock-controls button[aria-pressed="true"] { background: #111; color: #fff; border-color: #111; }
```

- [ ] **Step 2: Node tests, then reload `http://localhost:8765/minimal.html`**

Run: `cd /c/Users/mythi/Claude/newtzmedia-site && node --test "tests/*.test.js"` -> `# pass 40`.
`navigate` to the minimal page. Console: only the `minimal.css` 404 now.

- [ ] **Step 3: Verify frames, fonts and the X pillarbox (javascript_tool)**

```js
await document.fonts.ready;
const A = NEWTZ_APP; A.selectCustomer('ironworks'); A.selectPlatform('x');
await new Promise((r) => setTimeout(r, 450));
const fr = document.querySelector('#gallery .post__frame--16x9'); const art = fr.querySelector('.art');
const fb = fr.getBoundingClientRect(), ab = art.getBoundingClientRect();
const r1 = 'x frame ratio=' + (fb.width / fb.height).toFixed(2) + ' art ratio=' + (ab.width / ab.height).toFixed(2) + ' art inside=' + (ab.width < fb.width && Math.abs(ab.height - fr.clientHeight) < 2); // clientHeight: the X frame has a 1px border
A.selectPlatform('instagram'); await new Promise((r) => setTimeout(r, 450));
const s = document.querySelector('#gallery .post__frame--9x16').getBoundingClientRect();
const r2 = 'story ratio=' + (s.width / s.height).toFixed(3) + ' label=' + document.querySelector('#gallery .post__story').textContent;
const fonts = [...document.fonts].filter((f) => f.status === 'loaded').map((f) => f.family).filter((v, i, a) => a.indexOf(v) === i).sort().join(', ');
const hl = getComputedStyle(document.querySelector('#gallery .art__headline'));
[r1, r2, 'fonts=' + fonts, 'headline font=' + hl.fontFamily.split(',')[0] + ' weight=' + hl.fontWeight].join('\n');
```
Expected:
```
x frame ratio=1.78 art ratio=0.80 art inside=true
story ratio=0.563 label=Story
fonts=Bricolage Grotesque, Gabarito, Instrument Sans
headline font="Gabarito" weight=800
```
(If offline, the fonts line is empty and the headline falls back to system-ui; note it and continue.)

- [ ] **Step 4: Verify contrast inside posts**

```js
const lum = (hex) => { const [r, g, b] = hex.match(/\w\w/g).map((h) => parseInt(h, 16) / 255).map((v) => v <= .03928 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4); return .2126 * r + .7152 * g + .0722 * b; };
const ratio = (a, b) => { const [l1, l2] = [lum(a), lum(b)].sort((x, y) => y - x); return ((l1 + .05) / (l2 + .05)).toFixed(2); };
[['#151515', '#ffffff', 'post ink'], ['#6b6b6b', '#ffffff', 'post muted'], ['#3a5fa8', '#ffffff', 'tags'], ['#6b6b6b', '#f0f2f5', 'domain on linkcard'],
 ['#ffffff', '#1a1a1a', 'story label'], ['#3B2415', '#F3E6D3', 'Brew Haus art'], ['#FFFFFF', '#0F1B3D', 'NFTek art'], ['#FFFFFF', '#111111', 'Ironworks art'], ['#FFFFFF', '#2B4C6F', 'Ace art']]
 .map(([f, b, n]) => n + ': ' + ratio(f, b)).join('\n');
```
Expected: every line at or above `4.50`.

- [ ] **Step 5: Look at it (design critique, not pass/fail)**

`computer {action: "screenshot", scale: 0.5}` on the gallery. Check with your eyes: the headline fits inside each artwork without overflow, the motif sits above the headline, the brand label sits top right, the X post shows the same-colored bands either side of the artwork. If a headline overflows at 4 columns, reduce `11cqw` to `10cqw` in `.art__headline` and re-check. Record what you changed in the task report.

- [ ] **Step 6: Commit**

```bash
cd /c/Users/mythi/Claude/newtzmedia-site && git add mockups/posts.css && git commit -q -F - <<'EOF'
Style the artwork and the four platform templates

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>
EOF
git log --oneline -1
```

---
### Task 8: minimal.css (Style 1)

**Files:**
- Create: `mockups/minimal.css`

**Interfaces:**
- Consumes: the card, tab, step, tier, lightbox and page markup from Tasks 3 and 4; the `is-swapping` and `reduced-motion` classes from Task 5.
- Produces: `--swap-ms: 250` on `:root` (Task 5 reads it). Violet appears in exactly four places: the `<em>` in the headline, the hero `.btn`, the selected tab's underline, and the crop marks.

- [ ] **Step 1: Write `mockups/minimal.css`**

```css
/* minimal.css - Style 1. Tokens, type, layout, the proof-sheet signature.
   Styles the page and the card wrapper only. Nothing inside .post. */
:root {
  --ink: #0B0A0F;
  --raised: #15121C;
  --pale: #EDE9F3;
  --muted: #8A8399;
  --line: #262130;
  --violet: #A583FF;
  --display: "Bricolage Grotesque", system-ui, sans-serif;
  --body: "Instrument Sans", system-ui, sans-serif;
  --swap-ms: 250;
  --step-0: clamp(1rem, 0.95rem + 0.3vw, 1.125rem);
  --gap-section: clamp(5rem, 12vw, 9rem);
  --wrap: 1180px;
  --pad: clamp(1rem, 4vw, 2rem);
}
* { box-sizing: border-box; }
html { scroll-behavior: smooth; }
html.reduced-motion { scroll-behavior: auto; }
body {
  margin: 0; background: var(--ink); color: var(--pale);
  font-family: var(--body); font-size: var(--step-0); line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}
a { color: inherit; }
h1, h2, h3 { font-family: var(--display); font-weight: 800; letter-spacing: -.03em; margin: 0; text-wrap: balance; }
p { margin: 0; }
:focus-visible { outline: 2px solid var(--violet); outline-offset: 2px; }
.skip { position: absolute; left: 1rem; top: -3rem; padding: .5rem .75rem; background: var(--pale); color: var(--ink); border-radius: 4px; z-index: 10; }
.skip:focus { top: 1rem; }

/* header: tiny, like the reference */
.site-head { display: flex; justify-content: space-between; align-items: center; max-width: var(--wrap); margin: 0 auto; padding: 1.5rem var(--pad); }
.wordmark { font-family: var(--display); font-weight: 800; font-size: 1.25rem; letter-spacing: -.02em; text-decoration: none; }
.site-head nav { display: flex; gap: 1.75rem; }
.site-head nav a { text-decoration: none; font-weight: 600; font-size: .95rem; color: var(--muted); padding: .5rem 0; }
.site-head nav a:hover { color: var(--pale); }

main { max-width: var(--wrap); margin: 0 auto; padding: 0 var(--pad); }
section { padding-top: var(--gap-section); }
section + section { border-top: 1px solid var(--line); margin-top: var(--gap-section); }
h2 { font-size: 1rem; color: var(--muted); letter-spacing: 0; margin-bottom: 2rem; }

/* hero: one huge centered headline, one violet word, one button */
.hero { text-align: center; padding-top: clamp(4rem, 12vw, 9rem); padding-bottom: clamp(2rem, 6vw, 4rem); }
.hero h1 { font-size: clamp(2.8rem, 9vw, 8.5rem); line-height: .95; max-width: 12ch; margin: 0 auto; }
.hero h1 em { font-style: normal; color: var(--violet); }
.subline { max-width: 44ch; margin: 2rem auto 0; font-size: clamp(1.05rem, 1rem + .5vw, 1.35rem); color: var(--muted); }
.btn { display: inline-block; padding: .85rem 1.5rem; border-radius: 999px; background: var(--violet); color: var(--ink); font-weight: 600; text-decoration: none; border: 1px solid var(--violet); }
.hero .btn { margin-top: 2.5rem; }

/* work: plain text tabs, one violet underline */
.tabs { display: flex; gap: 1.5rem; overflow-x: auto; scrollbar-width: none; padding: 2px 2px 0; }
.tabs::-webkit-scrollbar { display: none; }
.tabs--platform { margin-top: .5rem; margin-bottom: 3rem; }
.tab {
  appearance: none; background: none; border: 0; border-bottom: 2px solid transparent;
  color: var(--muted); font: inherit; font-weight: 600; padding: .6rem 0; min-height: 44px;
  cursor: pointer; white-space: nowrap;
}
.tabs--platform .tab { font-weight: 400; font-size: .95rem; }
.tab:hover { color: var(--pale); }
.tab[aria-selected="true"] { color: var(--pale); border-bottom-color: var(--violet); }

/* the proof sheet */
.gallery { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 3rem 2.5rem; align-items: start; transition: opacity 250ms ease; }
.gallery.is-swapping { opacity: 0; }
html.reduced-motion .gallery { transition: none; }
.card { position: relative; }
.card__post { position: relative; }
.card__chip { display: none; }
.card__meta { margin-top: .9rem; font-size: .8rem; color: var(--muted); letter-spacing: .01em; }
.card__open { position: absolute; inset: 0; background: none; border: 0; border-radius: 12px; cursor: zoom-in; }
.card__open:focus-visible { outline-offset: 4px; }
/* signature: violet crop marks 9px outside each corner of the post */
.card__marks {
  position: absolute; inset: -9px; pointer-events: none;
  --m: var(--violet); --l: 14px;
  opacity: .55; transition: opacity 200ms ease;
  background:
    linear-gradient(var(--m), var(--m)) 0 0 / var(--l) 1px no-repeat,
    linear-gradient(var(--m), var(--m)) 0 0 / 1px var(--l) no-repeat,
    linear-gradient(var(--m), var(--m)) 100% 0 / var(--l) 1px no-repeat,
    linear-gradient(var(--m), var(--m)) 100% 0 / 1px var(--l) no-repeat,
    linear-gradient(var(--m), var(--m)) 0 100% / var(--l) 1px no-repeat,
    linear-gradient(var(--m), var(--m)) 0 100% / 1px var(--l) no-repeat,
    linear-gradient(var(--m), var(--m)) 100% 100% / var(--l) 1px no-repeat,
    linear-gradient(var(--m), var(--m)) 100% 100% / 1px var(--l) no-repeat;
}
.card:hover .card__marks, .card:focus-within .card__marks { opacity: 1; }
html.reduced-motion .card__marks { transition: none; }

/* how it works: a real sequence, so the numbers are counters */
.steps { list-style: none; margin: 0; padding: 0; counter-reset: step; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 2.5rem; }
.step { counter-increment: step; }
.step::before { content: counter(step); display: block; font-family: var(--display); font-weight: 800; font-size: 2.5rem; line-height: 1; color: var(--pale); margin-bottom: .75rem; }
.step h3 { font-size: 1.25rem; margin-bottom: .4rem; }
.step p { color: var(--muted); }

/* pricing: raised cards, the recommended one outlined in pale */
.tiers { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1.5rem; }
.tier { position: relative; background: var(--raised); border: 1px solid var(--line); border-radius: 16px; padding: 2rem 1.75rem; display: flex; flex-direction: column; gap: 1rem; }
.tier--recommended { border-color: var(--pale); }
.tier__badge { position: absolute; top: -.8rem; left: 1.75rem; padding: .2rem .7rem; border-radius: 999px; background: var(--pale); color: var(--ink); font-size: .75rem; font-weight: 600; letter-spacing: .02em; }
.tier h3 { font-size: 1.4rem; }
.tier__price { font-family: var(--display); font-weight: 800; color: var(--muted); }
.tier__price span { font-size: 2.5rem; color: var(--pale); letter-spacing: -.03em; margin-right: .2rem; }
.tier ul { margin: 0; padding: 0; list-style: none; color: var(--muted); display: grid; gap: .35rem; }
.tier .btn, .contact .btn { background: none; border-color: var(--line); color: var(--pale); margin-top: auto; text-align: center; }
.tier .btn:hover, .contact .btn:hover { border-color: var(--pale); }

/* contact and footer */
.contact { text-align: center; padding-bottom: var(--gap-section); }
.contact h2 { color: var(--pale); font-size: clamp(1.8rem, 4vw, 3rem); }
.contact p { color: var(--muted); max-width: 40ch; margin: 0 auto 2rem; }
.site-foot { border-top: 1px solid var(--line); max-width: var(--wrap); margin: 0 auto; padding: 2rem var(--pad) 3rem; display: flex; justify-content: space-between; gap: 1rem; flex-wrap: wrap; color: var(--muted); font-size: .9rem; }

/* lightbox */
.lightbox { border: 0; padding: 0; background: transparent; max-width: min(92vw, 520px); width: 100%; }
.lightbox::backdrop { background: rgba(11, 10, 15, .9); }
.lightbox__close { display: block; margin: 0 0 .75rem auto; appearance: none; background: none; border: 1px solid var(--line); color: var(--pale); font: inherit; font-weight: 600; padding: .5rem 1rem; border-radius: 999px; cursor: pointer; min-height: 44px; }
.lightbox__close:hover { border-color: var(--pale); }
.lightbox .card__marks { display: none; }
.lightbox .card__meta { color: var(--pale); }

/* responsive */
@media (max-width: 1100px) { .gallery { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (max-width: 900px) { .steps, .tiers { grid-template-columns: 1fr; } }
@media (max-width: 560px) {
  .gallery { grid-template-columns: 1fr; }
  .site-head nav { gap: 1rem; }
  .tabs { gap: 1.1rem; }
}
```

- [ ] **Step 2: Node tests (the boundary test now covers this file), then reload**

Run: `cd /c/Users/mythi/Claude/newtzmedia-site && node --test "tests/*.test.js"` -> `# pass 40`.
`navigate` to `http://localhost:8765/minimal.html`. Console: no errors.

- [ ] **Step 3: Verify tokens, type and the four violet places**

Run this on a fresh load, before any tab click: a re-render replaces the tab and card elements, and a stale element reports empty computed styles.

```js
await document.fonts.ready;
const cs = (el) => getComputedStyle(el);
const h1 = document.querySelector('h1'), em = document.querySelector('h1 em'), body = document.body;
const sel = document.querySelector('[data-customer-tabs] [aria-selected="true"]');
const unsel = document.querySelector('[data-customer-tabs] [aria-selected="false"]');
const marks = document.querySelector('.card__marks');
[
  'bg=' + cs(body).backgroundColor + ' ink=' + cs(body).color,
  'h1 font=' + cs(h1).fontFamily.split(',')[0] + ' weight=' + cs(h1).fontWeight + ' size=' + cs(h1).fontSize,
  'em color=' + cs(em).color,
  'hero btn bg=' + cs(document.querySelector('.hero .btn')).backgroundColor,
  'selected underline=' + cs(sel).borderBottomColor + ' unselected=' + cs(unsel).borderBottomColor,
  'marks bg has violet=' + cs(marks).backgroundImage.includes('rgb(165, 131, 255)') + ' inset=' + cs(marks).top,
  'tier btn bg=' + cs(document.querySelector('.tier .btn')).backgroundColor + ' step num color=' + cs(document.querySelector('.step'), '::before').color,
  'swap-ms=' + cs(document.documentElement).getPropertyValue('--swap-ms').trim(),
].join('\n');
```
Expected:
```
bg=rgb(11, 10, 15) ink=rgb(237, 233, 243)
h1 font="Bricolage Grotesque" weight=800 size=<about 136px at a 1200px-wide pane>
em color=rgb(165, 131, 255)
hero btn bg=rgb(165, 131, 255)
selected underline=rgb(165, 131, 255) unselected=rgba(0, 0, 0, 0)
marks bg has violet=true inset=-9px
tier btn bg=rgba(0, 0, 0, 0) step num color=rgb(237, 233, 243)
swap-ms=250
```

- [ ] **Step 4: Verify contrast for every pair in spec 4.1**

```js
const lum = (hex) => { const [r, g, b] = hex.match(/\w\w/g).map((h) => parseInt(h, 16) / 255).map((v) => v <= .03928 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4); return .2126 * r + .7152 * g + .0722 * b; };
const ratio = (a, b) => { const [l1, l2] = [lum(a), lum(b)].sort((x, y) => y - x); return ((l1 + .05) / (l2 + .05)).toFixed(2); };
[['#EDE9F3', '#0B0A0F', 'pale on ink'], ['#8A8399', '#0B0A0F', 'muted on ink'], ['#A583FF', '#0B0A0F', 'violet on ink'], ['#0B0A0F', '#A583FF', 'ink on violet button'],
 ['#8A8399', '#15121C', 'muted on raised'], ['#EDE9F3', '#15121C', 'pale on raised'], ['#0B0A0F', '#EDE9F3', 'ink on pale badge']]
 .map(([f, b, n]) => n + ': ' + ratio(f, b)).join('\n');
```
Expected: every line at or above `4.50` (violet on ink is about 6.9, muted on ink about 5.4).

- [ ] **Step 5: Verify the phone width**

`resize_window {preset: "mobile"}`, `navigate` to the minimal page again, then:
```js
await new Promise((r) => setTimeout(r, 300));
const de = document.documentElement;
const tabs = document.querySelector('[data-customer-tabs]');
'scrollWidth=' + de.scrollWidth + ' innerWidth=' + innerWidth + ' horizontalScroll=' + (de.scrollWidth > innerWidth) +
' columns=' + getComputedStyle(document.getElementById('gallery')).gridTemplateColumns.split(' ').length +
' tabsScroll=' + (tabs.scrollWidth > tabs.clientWidth) + ' tabHeight=' + document.querySelector('.tab').getBoundingClientRect().height.toFixed(0) +
' h1px=' + getComputedStyle(document.querySelector('h1')).fontSize;
```
Expected: `horizontalScroll=false`, `columns=1`, `tabHeight=44` or more, `h1px=44.8px` (the clamp floor). `tabsScroll` may be true or false; both are fine.
Then `resize_window {preset: "desktop"}`.

- [ ] **Step 6: Keyboard walk**

With the desktop size restored and the page reloaded, press Tab with the `computer` tool eleven times (`{action: "key", text: "Tab", repeat: 11}`), then:
```js
const a = document.activeElement;
a.tagName + ' ' + (a.className || a.id) + ' outline=' + getComputedStyle(a).outlineColor + ' ' + getComputedStyle(a).outlineStyle;
```
Expected: the element is a `BUTTON` with class `tab` or `card__open` (the exact one depends on the pane), and the outline is `rgb(165, 131, 255) solid`. The point is a visible violet ring on whatever has focus.

- [ ] **Step 7: Design critique (screenshots allowed here)**

`computer {action: "screenshot", scale: 0.5}` at the top, then scroll to the gallery and again. Judge against the spec: a headline that fills most of the width with one violet word, nothing else competing, the posts sitting on black with crop marks, generous gaps, a quiet metadata strip. Apply Chanel's rule: remove one thing if anything feels added. Typical adjustments allowed without asking: `gap` values, `max-width` of the subline, the `.55` mark opacity. Record every change in the task report.

- [ ] **Step 8: Commit**

```bash
cd /c/Users/mythi/Claude/newtzmedia-site && git add mockups/minimal.css && git commit -q -F - <<'EOF'
Add Style 1, the minimal proof sheet

Black ground, Bricolage Grotesque headline with one violet word, text
tabs, violet crop marks around each post, no motion beyond a crossfade.

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>
EOF
git log --oneline -1
```

---
### Task 9: interactive.css (Style 2)

**Files:**
- Create: `mockups/interactive.css`

**Interfaces:**
- Consumes: the markup from Tasks 3 and 4; the `is-swapping`, `is-leaving`, `is-in` and `reduced-motion` classes from Tasks 5 and 6.
- Produces: `--swap-ms: 350` on `:root`. The `.chip` and `.card__chip` signature, the `.band` hero, the phone frame, pill tabs, lift-on-hover cards, reveals, lightbox.

- [ ] **Step 1: Write `mockups/interactive.css`**

```css
/* interactive.css - Style 2. Tokens, the purple band, the phone demo, pills,
   the schedule chip signature, motion. Nothing inside .post. */
:root {
  --linen: #F4EEE6;
  --white: #FFFFFF;
  --cocoa: #2B2430;
  --muted: #6F6779;
  --line: #E4DCD2;
  --grape: #6D3BD6;
  --aubergine: #2E1650;
  --violet-2: #5A31B5;
  --lilac: #EDE6FA;
  --display: "Gabarito", system-ui, sans-serif;
  --body: "Figtree", system-ui, sans-serif;
  --swap-ms: 350;
  --ease: cubic-bezier(.2, .7, .2, 1);
  --step-0: clamp(1rem, 0.95rem + 0.3vw, 1.125rem);
  --wrap: 1180px;
  --pad: clamp(1rem, 4vw, 2rem);
  --shadow: 0 10px 30px rgba(43, 36, 48, .10), 0 2px 6px rgba(43, 36, 48, .06);
  --shadow-lift: 0 18px 40px rgba(43, 36, 48, .16), 0 4px 10px rgba(43, 36, 48, .08);
}
* { box-sizing: border-box; }
html { scroll-behavior: smooth; }
html.reduced-motion { scroll-behavior: auto; }
body { margin: 0; background: var(--linen); color: var(--cocoa); font-family: var(--body); font-size: var(--step-0); line-height: 1.6; -webkit-font-smoothing: antialiased; }
a { color: var(--grape); }
h1, h2, h3 { font-family: var(--display); font-weight: 800; margin: 0; letter-spacing: -.01em; text-wrap: balance; }
p { margin: 0; }
:focus-visible { outline: 2px solid var(--grape); outline-offset: 2px; }
.band :focus-visible { outline-color: #fff; }
.skip { position: absolute; left: 1rem; top: -3rem; padding: .5rem .75rem; background: var(--white); color: var(--cocoa); border-radius: 4px; z-index: 10; }
.skip:focus { top: 1rem; }

/* the purple band: header plus hero, like the reference */
.band { background: linear-gradient(180deg, var(--aubergine) 0%, var(--violet-2) 100%); color: #fff; }
.site-head { display: flex; justify-content: space-between; align-items: center; max-width: var(--wrap); margin: 0 auto; padding: 1.25rem var(--pad); }
.wordmark { font-family: var(--display); font-weight: 800; font-size: 1.35rem; color: inherit; text-decoration: none; }
.site-head nav { display: flex; gap: 1.5rem; align-items: center; }
.site-head nav a { color: inherit; text-decoration: none; font-weight: 600; font-size: .95rem; padding: .5rem 0; }
.btn { display: inline-block; padding: .85rem 1.5rem; border-radius: 999px; background: var(--grape); color: #fff; font-weight: 600; text-decoration: none; border: 2px solid var(--grape); transition: transform 150ms ease, box-shadow 150ms ease; }
.btn:hover { transform: translateY(-1px); box-shadow: var(--shadow); }
.btn--ghost { background: transparent; color: #fff; border-color: rgba(255, 255, 255, .7); }
.site-head nav .btn { padding: .55rem 1.1rem; font-size: .9rem; background: #fff; color: var(--aubergine); border-color: #fff; }

.hero { max-width: var(--wrap); margin: 0 auto; padding: clamp(2.5rem, 7vw, 5rem) var(--pad) clamp(3rem, 7vw, 5rem); text-align: center; }
.hero h1 { font-size: clamp(2.4rem, 6vw, 4.5rem); line-height: 1.05; max-width: 18ch; margin: 0 auto; }
.subline { max-width: 52ch; margin: 1.25rem auto 0; font-size: clamp(1.05rem, 1rem + .4vw, 1.25rem); color: rgba(255, 255, 255, .88); }
.hero__actions { display: flex; gap: .75rem; justify-content: center; flex-wrap: wrap; margin-top: 2rem; }

/* hero demo: a white framed card holding a phone-shaped feed */
.hero__demo { margin: 3rem auto 0; max-width: 760px; }
.frame-card { background: var(--white); border-radius: 20px; box-shadow: 0 24px 60px rgba(20, 8, 40, .35); padding: clamp(1rem, 3vw, 2rem); display: grid; place-items: center; }
.phone { width: min(100%, 340px); border: 10px solid #1a1523; border-radius: 32px; background: #fafafa; overflow: hidden; }
.phone__screen { position: relative; height: 640px; overflow: hidden; padding: 12px; color: var(--cocoa); transition: opacity 150ms ease; }
.phone__screen.is-leaving { opacity: 0; }
.hero-post { display: grid; gap: 10px; animation: slide-in 350ms var(--ease) backwards; }
.hero-post__label { font-size: .8rem; font-weight: 600; color: var(--muted); text-align: left; }
.hero-post .post { box-shadow: 0 2px 10px rgba(0, 0, 0, .08); }
/* signature: the schedule chip pops in after the post lands */
.chip { justify-self: end; padding: .35rem .75rem; border-radius: 999px; background: var(--grape); color: #fff; font-size: .8rem; font-weight: 600; box-shadow: 0 6px 16px rgba(109, 59, 214, .35); animation: pop-in 300ms var(--ease) 200ms backwards; }
@keyframes slide-in { from { opacity: 0; transform: translateX(24px); } to { opacity: 1; transform: none; } }
@keyframes pop-in { from { opacity: 0; transform: scale(.8); } to { opacity: 1; transform: none; } }
.hero__pills { display: flex; gap: .5rem; justify-content: center; flex-wrap: wrap; margin-top: 1.5rem; }
.hero__toggle { margin-top: .75rem; appearance: none; background: transparent; border: 1px solid rgba(255, 255, 255, .6); color: #fff; font: inherit; font-size: .85rem; font-weight: 600; padding: .45rem 1rem; border-radius: 999px; cursor: pointer; min-height: 44px; }
.hero__toggle:hover { background: rgba(255, 255, 255, .12); }
html.reduced-motion .hero__toggle { display: none; }
html.reduced-motion .hero-post, html.reduced-motion .chip { animation: none; }
html.reduced-motion .phone__screen { transition: none; }

/* pills and tabs */
.tab { appearance: none; font: inherit; font-weight: 600; font-size: .95rem; padding: .55rem 1.1rem; min-height: 44px; border-radius: 999px; border: 1px solid var(--line); background: var(--white); color: var(--cocoa); cursor: pointer; white-space: nowrap; transition: background 150ms ease, color 150ms ease, border-color 150ms ease; }
.tab:hover { background: var(--lilac); }
.tab[aria-selected="true"] { background: var(--grape); color: #fff; border-color: var(--grape); }
.hero__pills .tab { border-color: rgba(255, 255, 255, .35); background: rgba(255, 255, 255, .12); color: #fff; }
.hero__pills .tab:hover { background: rgba(255, 255, 255, .22); }
.hero__pills .tab[aria-selected="true"] { background: #fff; color: var(--aubergine); border-color: #fff; }

main { max-width: var(--wrap); margin: 0 auto; padding: 0 var(--pad); }
section { padding-top: clamp(4rem, 9vw, 7rem); }
h2 { font-size: clamp(1.8rem, 3.5vw, 2.6rem); margin-bottom: 1.5rem; }

/* work: customer tabs as underlined text, platform tabs as pills, white cards */
.tabs { display: flex; gap: .5rem; overflow-x: auto; scrollbar-width: none; padding: 2px; }
.tabs::-webkit-scrollbar { display: none; }
.tabs--customer { gap: 1.5rem; }
.tabs--customer .tab { border: 0; border-bottom: 2px solid transparent; border-radius: 0; background: none; padding: .6rem .25rem; font-size: 1.05rem; color: var(--muted); }
.tabs--customer .tab:hover { color: var(--cocoa); background: none; }
.tabs--customer .tab[aria-selected="true"] { color: var(--grape); border-bottom-color: var(--grape); background: none; }
.tabs--platform { margin-top: .75rem; margin-bottom: 2rem; }
.tabs--platform .tab { font-size: .85rem; padding: .4rem .9rem; min-height: 40px; }

.gallery { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 1.5rem; align-items: start; }
.card { position: relative; }
.card__post { position: relative; border-radius: 16px; border: 1px solid var(--line); background: var(--white); box-shadow: var(--shadow); transition: transform 200ms ease, box-shadow 200ms ease, opacity 350ms ease; animation: card-in 350ms var(--ease) backwards; }
.card__post .post { border-radius: 15px; }
.card:hover .card__post, .card:focus-within .card__post { transform: translateY(-4px); box-shadow: var(--shadow-lift); }
@keyframes card-in { from { opacity: 0; transform: translateX(24px); } to { opacity: 1; transform: none; } }
.gallery.is-swapping .card__post { opacity: 0; transform: translateX(-24px); }
.card__marks { display: none; }
.card__chip { position: absolute; left: 50%; bottom: -.8rem; transform: translate(-50%, 6px); opacity: 0; padding: .3rem .7rem; border-radius: 999px; background: var(--grape); color: #fff; font-size: .75rem; font-weight: 600; white-space: nowrap; box-shadow: 0 6px 16px rgba(109, 59, 214, .35); transition: opacity 200ms ease, transform 200ms ease; pointer-events: none; }
.card:hover .card__chip, .card:focus-within .card__chip { opacity: 1; transform: translate(-50%, 0); }
.card__meta { margin-top: 1.1rem; font-size: .8rem; color: var(--muted); }
.card__open { position: absolute; inset: 0; background: none; border: 0; border-radius: 16px; cursor: zoom-in; }
html.reduced-motion .card__post { animation: none; transition: none; }
html.reduced-motion .card:hover .card__post { transform: none; }
html.reduced-motion .card__chip { transition: none; }

/* scroll reveals */
[data-reveal] { opacity: 0; transform: translateY(16px); transition: opacity 500ms ease, transform 500ms ease; }
[data-reveal].is-in { opacity: 1; transform: none; }
html.reduced-motion [data-reveal] { opacity: 1; transform: none; transition: none; }

/* how it works */
.steps { list-style: none; margin: 0; padding: 0; counter-reset: step; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1.5rem; }
.step { counter-increment: step; background: var(--white); border: 1px solid var(--line); border-radius: 16px; padding: 1.75rem; }
.step::before { content: counter(step); display: block; font-family: var(--display); font-weight: 800; font-size: 2.75rem; line-height: 1; color: var(--grape); margin-bottom: 1rem; }
.step h3 { font-size: 1.3rem; margin-bottom: .4rem; }
.step p { color: var(--muted); }

/* pricing */
.tiers { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1.5rem; align-items: end; }
.tier { position: relative; background: var(--white); border: 1px solid var(--line); border-radius: 20px; padding: 2rem 1.75rem; display: flex; flex-direction: column; gap: 1rem; box-shadow: var(--shadow); }
.tier--recommended { border-color: var(--grape); transform: translateY(-12px); box-shadow: var(--shadow-lift); }
.tier__badge { position: absolute; top: -.85rem; left: 1.75rem; padding: .25rem .75rem; border-radius: 999px; background: var(--grape); color: #fff; font-size: .75rem; font-weight: 600; }
.tier h3 { font-size: 1.5rem; }
.tier__price { font-family: var(--display); font-weight: 800; color: var(--muted); }
.tier__price span { font-size: 2.75rem; color: var(--cocoa); margin-right: .15rem; }
.tier ul { list-style: none; margin: 0; padding: 0; color: var(--muted); display: grid; gap: .35rem; }
.tier .btn { margin-top: auto; text-align: center; }
.tier:not(.tier--recommended) .btn { background: transparent; color: var(--grape); }

/* contact and footer */
.contact { margin-top: clamp(4rem, 9vw, 7rem); padding: clamp(3rem, 7vw, 5rem) var(--pad); background: var(--lilac); border-radius: 24px; text-align: center; }
.contact p { color: var(--cocoa); max-width: 40ch; margin: 0 auto 1.5rem; }
.site-foot { max-width: var(--wrap); margin: 0 auto; padding: 2.5rem var(--pad) 3rem; display: flex; justify-content: space-between; gap: 1rem; flex-wrap: wrap; color: var(--muted); font-size: .9rem; }
.site-foot .wordmark { color: var(--cocoa); font-size: 1.1rem; }

/* lightbox */
.lightbox { border: 0; padding: 0; background: transparent; max-width: min(92vw, 520px); width: 100%; }
.lightbox::backdrop { background: rgba(46, 22, 80, .75); backdrop-filter: blur(4px); }
.lightbox[open] { animation: lb-in 250ms var(--ease) backwards; }
@keyframes lb-in { from { opacity: 0; transform: scale(.96); } to { opacity: 1; transform: none; } }
html.reduced-motion .lightbox[open] { animation: none; }
.lightbox__close { display: block; margin: 0 0 .75rem auto; appearance: none; background: #fff; border: 0; color: var(--cocoa); font: inherit; font-weight: 600; padding: .5rem 1rem; border-radius: 999px; cursor: pointer; min-height: 44px; }
.lightbox .card__post { animation: none; }
.lightbox .card__chip { opacity: 1; transform: translate(-50%, 0); }
.lightbox .card__meta { color: #fff; }

/* responsive */
@media (max-width: 1100px) { .gallery { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (max-width: 900px) {
  .steps, .tiers { grid-template-columns: 1fr; align-items: stretch; }
  .tier--recommended { transform: none; }
  .phone__screen { height: 600px; }
}
@media (max-width: 560px) {
  .gallery { grid-template-columns: 1fr; }
  .site-head nav { gap: .75rem; }
  .site-head nav a:not(.btn) { display: none; }
  .tabs--customer { gap: 1rem; }
}
```

- [ ] **Step 2: Node tests, then reload `http://localhost:8765/interactive.html`**

Run: `cd /c/Users/mythi/Claude/newtzmedia-site && node --test "tests/*.test.js"` -> `# pass 40`.
`navigate` to the interactive page. Console: no errors.

- [ ] **Step 3: Verify tokens, the band, the phone and the chip**

```js
await document.fonts.ready;
const cs = (el, p) => getComputedStyle(el, p);
const chip = document.querySelector('[data-hero-frame] .chip');
const cardChip = document.querySelector('#gallery .card__chip');
[
  'body bg=' + cs(document.body).backgroundColor + ' ink=' + cs(document.body).color,
  'band gradient=' + cs(document.querySelector('.band')).backgroundImage.startsWith('linear-gradient'),
  'h1 font=' + cs(document.querySelector('h1')).fontFamily.split(',')[0] + ' weight=' + cs(document.querySelector('h1')).fontWeight + ' color=' + cs(document.querySelector('h1')).color,
  'body font=' + cs(document.body).fontFamily.split(',')[0],
  'phone height=' + document.querySelector('.phone__screen').getBoundingClientRect().height + ' overflow=' + cs(document.querySelector('.phone__screen')).overflow,
  'chip bg=' + cs(chip).backgroundColor + ' text=' + chip.textContent,
  'card chip hidden until hover=' + (cs(cardChip).opacity === '0'),
  'selected pill bg=' + cs(document.querySelector('[data-platform-tabs] [aria-selected="true"]')).backgroundColor,
  'customer tab underline=' + cs(document.querySelector('[data-customer-tabs] [aria-selected="true"]')).borderBottomColor,
  'recommended lift=' + cs(document.querySelector('.tier--recommended')).transform,
  'swap-ms=' + cs(document.documentElement).getPropertyValue('--swap-ms').trim(),
].join('\n');
```
Expected:
```
body bg=rgb(244, 238, 230) ink=rgb(43, 36, 48)
band gradient=true
h1 font="Gabarito" weight=800 color=rgb(255, 255, 255)
body font="Figtree"
phone height=640 overflow=hidden
chip bg=rgb(109, 59, 214) text=Scheduled · Tue 8:00am
card chip hidden until hover=true
selected pill bg=rgb(109, 59, 214)
customer tab underline=rgb(109, 59, 214)
recommended lift=matrix(1, 0, 0, 1, 0, -12)
swap-ms=350
```

- [ ] **Step 4: Verify the chip and lift on hover (computer hover + JS)**

Use `find {query: "View larger"}` to get the first card's open button ref, then `computer {action: "hover", ref: "<that ref>"}`, then:
```js
const card = document.querySelector('#gallery .card');
const t = getComputedStyle(card.querySelector('.card__post')).transform;
'chip opacity=' + getComputedStyle(card.querySelector('.card__chip')).opacity + ' lifted=' + (t !== 'none');
```
Expected: `chip opacity=1 lifted=true`.

- [ ] **Step 5: Verify contrast for every pair in spec 5.1**

```js
const lum = (hex) => { const [r, g, b] = hex.match(/\w\w/g).map((h) => parseInt(h, 16) / 255).map((v) => v <= .03928 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4); return .2126 * r + .7152 * g + .0722 * b; };
const ratio = (a, b) => { const [l1, l2] = [lum(a), lum(b)].sort((x, y) => y - x); return ((l1 + .05) / (l2 + .05)).toFixed(2); };
[['#2B2430', '#F4EEE6', 'cocoa on linen'], ['#6F6779', '#F4EEE6', 'muted on linen'], ['#6F6779', '#FFFFFF', 'muted on white'], ['#6D3BD6', '#F4EEE6', 'grape on linen'],
 ['#6D3BD6', '#FFFFFF', 'grape on white'], ['#FFFFFF', '#6D3BD6', 'white on grape'], ['#FFFFFF', '#2E1650', 'white on aubergine'], ['#FFFFFF', '#5A31B5', 'white on violet-2'],
 ['#2E1650', '#FFFFFF', 'aubergine on white pill'], ['#2B2430', '#EDE6FA', 'cocoa on lilac']]
 .map(([f, b, n]) => n + ': ' + ratio(f, b)).join('\n');
```
Expected: every line at or above `4.50` (muted on linen is the tightest, about 4.7).

- [ ] **Step 6: Verify the phone width**

`resize_window {preset: "mobile"}`, `navigate` again, then:
```js
await new Promise((r) => setTimeout(r, 300));
const de = document.documentElement;
'horizontalScroll=' + (de.scrollWidth > innerWidth) +
' columns=' + getComputedStyle(document.getElementById('gallery')).gridTemplateColumns.split(' ').length +
' navLinksVisible=' + [...document.querySelectorAll('.site-head nav a')].filter((a) => getComputedStyle(a).display !== 'none').map((a) => a.textContent).join(',') +
' phoneWidth=' + document.querySelector('.phone').getBoundingClientRect().width.toFixed(0) +
' pillHeight=' + document.querySelector('.hero__pills .tab').getBoundingClientRect().height.toFixed(0);
```
Expected: `horizontalScroll=false columns=1 navLinksVisible=Email me phoneWidth=<at most 343> pillHeight=44` (or taller).
Then `resize_window {preset: "desktop"}`.

- [ ] **Step 7: Design critique (screenshots allowed here)**

`computer {action: "screenshot", scale: 0.5}` at the top and at the gallery. Judge against the spec: the band, one white framed phone with a post and a grape chip, four pills below it, a warm linen body with white cards that lift, the Standard tier raised with its badge. Watch the hero cycle once (wait 4 seconds, screenshot again). If the chip collides with the post's bottom edge, raise `gap` in `.hero-post`. Record every change in the task report.

- [ ] **Step 8: Commit**

```bash
cd /c/Users/mythi/Claude/newtzmedia-site && git add mockups/interactive.css && git commit -q -F - <<'EOF'
Add Style 2, the interactive Slack-shaped page

Purple band with a phone-shaped demo that cycles customers and pops a
schedule chip; linen body, pill tabs, lifting white cards, reveals.

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>
EOF
git log --oneline -1
```

---

### Task 10: Web Interface Guidelines review, fixes, final pass

**Files:**
- Modify: any of the seven `mockups/*` files as the review requires; `README.md`.

**Interfaces:**
- Consumes: everything. Produces: the reviewed, verified mockups and a README that says how to open them.

- [ ] **Step 1: Fetch the guidelines and review the seven files**

Load `WebFetch` through `ToolSearch` (`select:WebFetch`), then fetch `https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md` with the prompt "Return the full rule list and the output format verbatim." Read all seven files under `mockups/` and apply every rule. Write the findings in the guidelines' own `file:line` format into the task report. Known exemptions to note, not fix: the `.mock-controls` buttons are 28px because they are not part of the design; Google Fonts is an approved external dependency; the hero cycles on its own by spec, with a visible pause control.

- [ ] **Step 2: Fix every finding that is not exempt**

Edit the files. Keep the boundary rule (no `.post__`, `.art` selectors in style CSS) and every test green:
Run: `cd /c/Users/mythi/Claude/newtzmedia-site && node --test "tests/*.test.js"` -> `# pass 40`.

- [ ] **Step 3: Spec section 9 pass on both pages**

For each of `minimal.html` and `interactive.html`, `navigate` and confirm, in this order, recording each result:
1. `read_console_messages {onlyErrors: true}` -> none.
2. Task 5 Step 3 snippet -> the nine expected lines.
3. Task 6 Step 3 snippet -> lightbox opens, traps, closes, returns focus; Escape closes it.
4. Task 5 Step 6 snippet -> `true` (reduced motion instant). On the interactive page also Task 6 Step 5 -> `running=false`.
5. `resize_window {preset: "mobile"}`, reload, the page's Task 8 or 9 phone snippet -> no horizontal scroll, one column. Then `resize_window {preset: "desktop"}`.
6. The page's contrast snippet -> all at or above 4.50.

- [ ] **Step 4: Update the README**

Replace `README.md` with:
```markdown
# NewtzMedia website

Marketing site for NewtzMedia: social media posts for local small businesses,
for a monthly fee.

## Current stage: two design-direction mockups

- `mockups/minimal.html`: Style 1, black and violet, Kickpush shape.
- `mockups/interactive.html`: Style 2, grape on linen, Slack shape.

Open either file in a browser, or serve the folder:

    python -m http.server 8765 --directory mockups

then visit http://localhost:8765/minimal.html. Google Fonts load from the
network; without it the pages fall back to system fonts.

The bottom-right "Mockup controls" strip switches between three tagline
options. It is not part of the design.

Tests: `node --test "tests/*.test.js"` (Node 24, no packages).

Spec: `docs/superpowers/specs/2026-09-24-newtzmedia-mockups-design.md`.
Plan: `docs/superpowers/plans/2026-09-24-newtzmedia-mockups.md`.

Sample work in the mockups is fictional except NFTek. Prices and the email
address are placeholders.
```

- [ ] **Step 5: Commit**

```bash
cd /c/Users/mythi/Claude/newtzmedia-site && git add README.md mockups/ && git commit -q -F - <<'EOF'
Apply Web Interface Guidelines review fixes and document how to view

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>
EOF
git log --oneline -1 && git status --short
```
Expected: `git status --short` prints nothing.

- [ ] **Step 6: Report to the main agent**

List: every guideline finding and what was done with it, every deviation from this plan, the final test count, and the two URLs. The main agent then sends both HTML files to Zack with lettered options.

---

## Plan self-review (done at writing time)

**Spec coverage:** section 3 content -> Tasks 1, 3; 3.2 templates -> Tasks 3, 7; 3.3 to 3.6 -> Tasks 1, 3, 5; 4.1 to 4.5 -> Task 8; 5.1 to 5.5 -> Tasks 6, 9; 6 behavior -> Tasks 5, 6; 7 accessibility and responsive -> Tasks 7 to 9 verification steps, Task 10; 8 files -> file map plus deviation 1; 9 verification -> Task 10 Step 3; 10 and 11 -> nothing to build.

**Placeholder scan:** no TBD or TODO; every code step carries its code; the two design-critique steps name the exact properties an implementer may adjust.

**Executed check (2026-09-24, before handoff):** every code block in this plan was extracted into a scratch tree and run. Result: 40 of 40 Node tests pass; both pages were served and driven in the built-in browser: the nine gallery combinations, the tab keyboard movement, the tagline switch, the lightbox (open, focus trap, close button, Escape), the hero cycler (4s cycle, pill click stops it, Play restarts it, reduced motion hides the toggle), the scroll reveals, the X pillarbox, the Story frame, the crop marks, both phone widths with no horizontal scroll. The expected outputs above are copied from those runs.

**Type consistency:** `renderCustomerTabs(activeId, opts)` with `{prefix, controls}` in Tasks 3 and 6; `NEWTZ_APP` keys `state, selectCustomer, selectPlatform, setTagline, tablistKeys, motionOk, heroRunning, heroCurrent, heroShow` in Tasks 5 and 6 and every verification snippet; class names `card__post, card__marks, card__chip, card__meta, card__open, hero-post, chip, is-swapping, is-leaving, is-in, reduced-motion` identical across Tasks 3, 5, 6, 8, 9; `--swap-ms` read in Task 5, set in Tasks 8 and 9.
