# NewtzMedia Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the real NewtzMedia page for newtzmedia.com, a light one-page site whose main content is real posts linked to where they went live plus clearly labeled concepts, and launch it in place of the holding page once the launch gate passes.

**Architecture:** `content.js` holds every word and every piece as one global (`NEWTZ_CONTENT`). `logic.js` holds pure selectors and HTML-string renderers (`NEWTZ_LOGIC`, built by the factory `NEWTZ_LOGIC_FOR`) that Node tests exercise without a browser. `behavior.js` wires only the two galleries (business tabs, platform pills, the swap, keyboard). `posts.css` owns the inside of a post and is copied from the mockups; `site.css` owns everything around it. `index.html` carries How it works, About, Contact and the footer as static copies of what the renderers produce, so the page reads with JavaScript off, and a test keeps them equal.

**Tech Stack:** Plain HTML, CSS and JavaScript, no framework, no build step, no packages. Node 24 built-in test runner (`node --test`). Python 3.13 `http.server` for the preview. Pillow 12 in a scratchpad virtual environment for the three PNGs only. Google Fonts by `<link>`. GitHub Pages serving the repo root of `main` at newtzmedia.com.

**Spec:** `docs/superpowers/specs/2026-09-25-newtzmedia-site-design.md` (the single authority; section numbers below refer to it).

**Branch:** `site`, cut from `main` at b6b650d in Task 1. `main` and the live holding page stay untouched until Task 8 merges. Every task commits on `site`.

**Provenance:** every file in this plan was written and verified on 2026-09-25 in a scratch copy of the repo before the plan was assembled: 68 of 68 tests pass, the launch gate refuses with the five expected lines, the three PNGs are byte-identical across runs, and all eight browser checks of spec section 10 pass. The expected outputs below are those observed values. Copy the code exactly; do not improve it.

## Global Constraints

- No framework, build step, package install or `package.json`. Plain scripts, not ES modules: the page loads them with `<script>` tags and the tests with `require()`.
- Every content string lives in `content.js`. `index.html` holds structure, the head, and the static copies that `tests/site-page.test.js` checks against the renderers.
- Copy is spec section 4 verbatim: sentence case, first person, "and" never "&", no exclamation marks, no outcome claims. Banned words anywhere outside a posted piece: `review|reviews|rated|rating|stars?|testimonial|customers love|results|guaranteed|grow|engagement` (a test enforces it).
- Posted pieces show the text exactly as published, HTML-escaped, never edited, and are excluded from the banned-word scan.
- Colors: only the seven tokens of spec section 5: `--paper #FFFFFF`, `--band #F7F6FA`, `--line #E4E1EC`, `--muted #5B5670`, `--ink #17151C`, `--purple #4B2A9E`, `--purple-deep #3A1F7E`. Light only, no toggle (spec decision 8, an explicit exception to Zack's dark-mode rule).
- Type: Instrument Sans 400, 600, 700 and Gabarito 500, 800 from Google Fonts by `<link>` with `preconnect`; fallback `system-ui, sans-serif`.
- Boundary rule: `site.css` never targets `.post`, `.post__*`, `.art` or `.art__*` (a test enforces it). Those selectors live in `posts.css` only.
- Every link that leaves the site carries `target="_blank" rel="noopener noreferrer"` and the visually hidden text "(opens in a new tab)". A concept card never contains a link.
- Every text pairing at or above 4.5:1. Every named tap target at or above 44px tall at 375px.
- Reduced motion: the `reduced-motion` class on `html` sets `--swap-ms` to 0 and the swap animation is skipped.
- NFTek is presented as the accounts Zack runs for his family's company, never as a client or an employer. No prices, no form, no analytics.
- Tests: `cd /c/Users/mythi/Claude/newtzmedia-site && node --test "tests/*.test.js"` from the Bash tool. Node 24. The 40 mockup tests keep passing. All tests pass before every commit.
- Files are UTF-8 with LF endings (`.gitattributes` enforces LF). The literal `’`, `·` and `↗` characters in the code below are intended; copy them as they are.
- Commit named files only, never `git add -A`. The repo is public: no secrets, no credentials, no private data in any file, ever. Every commit message ends with `Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>`; after each commit run `git log -1 --format=%B | grep -c "^Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>$"` and expect `1`.
- Pillow lives only in a scratchpad virtual environment (spec decision 22, approved by Zack). Nothing is installed in the repo or globally.
- One task per subagent, about 150k tokens each. The main agent stops for Zack's review after Tasks 2, 5 and 7. Task 8 starts only with his content in hand. Ledger, briefs, reports and review packages live in the session scratchpad, never in the repo.

## Working on this PC

- A Bash command over about 8 KB fails with a quoting error. Any file over about 6 KB (`content.js`, `logic.js`, `site.css`, `index.html`, the three `tests/site-*.test.js` files) is written with the Write tool. Smaller files can go through a quoted heredoc (`cat > FILE <<'EOF'`). Either way, check the result with `wc -c FILE` and, for JavaScript, `node --check FILE`.
- Both the Write tool and heredocs write LF and UTF-8 here (checked 2026-09-25). Never write a source file through a Python script: this machine's default code page truncates non-ASCII writes.
- Inside a heredoc this PC's Bash tool turns a doubled backslash (`\\`) into a single one; every other character survives (probed 2026-09-25: `\n`, `\$`, `\"`, `\'`, `\t`, `\/`, `\d`, `$HOME` and backticks all arrive intact). None of the files this plan writes by heredoc contains a doubled backslash, and each heredoc step's `wc -c` check would catch the change. A new file that does contain one goes through the Write tool.
- Commit messages go through `git commit -q -F - <<'EOF'` so the trailer line is exact.
- `$SCRATCH` below is the session scratchpad directory (the "Scratchpad directory" line of the environment). In the session that wrote this plan it is `C:/Users/mythi/AppData/Local/Temp/claude/C--Users-mythi-Claude/4e49d466-0433-4be7-ba7f-d9a4cf70b1ac/scratchpad`, and it already holds `venv-assets` with Pillow 12.3.0.

## Verification protocol (browser)

For Task 5, and again for any later task that changes `index.html`, `site.css`, `posts.css` or `behavior.js`.

1. Start the server with the preview tool: `preview_start {name: "newtzmedia-site"}`. Task 4 adds that entry to the repo's `.claude/launch.json`; the session copy at `C:/Users/mythi/Claude/.claude/launch.json` already has an equivalent one. The page is `http://localhost:8765/`.
2. The pane is usually hidden and reports a 0x0 viewport with no animation frames. Force one: `resize_window {width: 1280, height: 900}`, then one `computer {action: "screenshot", scale: 0.1}`. That screenshot may fail once with "did not finish rendering in time"; retry it once, then continue either way (the resize alone gives real layout). Confirm with `javascript_tool`: `document.visibilityState + ' ' + innerWidth + 'x' + innerHeight` -> `visible 1280x900`.
3. `read_console_messages {onlyErrors: true}` -> `No console logs.` A blocked Google Fonts request while offline is the only acceptable entry.
4. Run the `javascript_tool` snippets given in the task and compare with the expected values. Pass or fail is the returned text. A screenshot is never evidence.
5. `resize_window {preset: "mobile"}` for the 375px checks, then `resize_window {preset: "desktop"}` at the end. Stop the server with `preview_stop` when done.
6. Reload (`navigate` to the same URL) after a file change, and never between checks C and G of Task 5: check C injects a fixture posted piece that checks D and G measure.
7. If the executing agent has no browser tools, run the Node tests, commit, and report "browser checks pending" so the main agent runs them before the task is accepted.

## Deviations from the spec (Zack can veto any at task review)

- **D1** Rule R1 relaxed: a posted business may have zero pieces only while nothing at all is posted. Spec section 11 says NFTek has no pieces before launch, and R1 as written would fail every test run until then.
- **D2** `platformsFor(business)` lists only the platforms that have at least one piece, so a pill never opens an empty grid.
- **D3** How it works, About, Contact and the footer are static HTML in `index.html` (marked `data-static`), not mounted by `behavior.js`. `tests/site-page.test.js` keeps them equal to `renderSteps()`, `escapeHtml(about)`, `renderContact()` and `renderFooter()`, whitespace between tags aside. This is how the no-JS page shows them.
- **D4** On a posted card the business name in the post header links to its profile on that platform (new tab, `rel="noopener noreferrer"`, hidden "(opens in a new tab)") when `profiles[platform]` is set. Spec section 6 mentions the NFTek profile links leaving the site without placing them.
- **D5** `.stamp` has `min-height: 2.75rem` (44px), not the spec's 2.5rem (40px): the spec's own 44px tap-target list includes stamp links. Measured 44.0px at 375px.
- **D6** `logic.js` exposes `NEWTZ_LOGIC_FOR(content)` beside `NEWTZ_LOGIC`, so tests can use a fixture with posted pieces before the first real post exists.
- **D7** `apple-touch-icon.png` has square corners (solid purple). iOS masks its own icons, and transparent corners show as black.
- **D8** `posts.css` is the mockup file with the mockup-controls block removed and three rules added (`.post__image`, `a.post__name`, its hover). All three are post internals, inside the boundary.
- **D9** Browser check 7 (reduced motion) runs through the `html.reduced-motion` class, because the pane cannot emulate `prefers-reduced-motion`. The media-query listener that adds the class is the mockup code, unchanged.
- **D10** A posted card's header shows the stamp date where the mockups showed "2h" or "1d"; concept cards keep the mock values. Instagram and X headers show the handle.
- **D11** On X every frame is 16:9 (carried over from the mockups' X template), so a posted X image is cropped to that with `object-fit: cover`. The live post is one tap away on the stamp.

## File map

| File | Task |
|---|---|
| `content.js`, `tests/site-content.test.js` | 1 |
| `logic.js`, `tests/site-logic.test.js` | 2 |
| `favicon.svg`, `tools/make_assets.py`, `favicon-32.png`, `apple-touch-icon.png`, `og.png` | 3 |
| `tests/site-page.test.js`, `posts.css`, `site.css`, `index.html` (replaces the holding page), `.claude/launch.json` | 4 |
| `behavior.js` | 5 |
| `tests/launch-gate.js`, `README.md` (rewritten) | 6 |
| any of `index.html`, `site.css`, `posts.css`, `behavior.js` as the review finds | 7 |
| `content.js`, `index.html`, `images/` | 8 |

---

### Task 1: Branch, content.js and its rules

**Files:**
- Create: `content.js`
- Create: `tests/site-content.test.js`

**Interfaces:**
- Consumes: nothing.
- Produces: `globalThis.NEWTZ_CONTENT` with the keys `brand`, `platforms` (each with a `hosts` list), `businesses` (`kind` is `'posted'` or `'concept'`; a posted business has `profiles`), `pieces` (a posted piece has `date`, `urls` and optionally `image`), `motifs`, `steps`, `about`, `contact` (`line`, `phone`, `phoneDisplay`, `email`), `footer`, `copy` (20 UI strings). Tasks 2, 4, 6 and 8 read it. The comments in the file document each shape.

- [ ] **Step 1: Cut the branch from a clean main**

```bash
cd /c/Users/mythi/Claude/newtzmedia-site && git status --short && git log -1 --format=%h && git checkout -b site
```

Expected: no status lines, `b6b650d`, then `Switched to a new branch 'site'`. If the hash differs, stop and report: main moved since this plan was written.

- [ ] **Step 2: Write the failing test**

Write tool, `tests/site-content.test.js` (7,733 bytes):

```js
// Guards content.js: rules R1 to R7 of the spec (section 3), the verbatim copy
// of section 4, and the banned-words scan. Runs in Node with no DOM.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
require('../content.js');
const C = globalThis.NEWTZ_CONTENT;
const ROOT = path.join(__dirname, '..');
const byId = (id) => C.businesses.find((b) => b.id === id);
const piecesOf = (b) => C.pieces.filter((p) => p.business === b.id);
const anyPosted = () => C.pieces.some((p) => byId(p.business).kind === 'posted');
// The host of url is one of hosts, or a subdomain of one.
const onHosts = (url, hosts) => {
  const h = new URL(url).hostname;
  return hosts.some((d) => h === d || h.endsWith('.' + d));
};

test('R1: kind is posted or concept; every concept business has a piece; a posted business is empty only while nothing is posted', () => {
  assert.ok(C.businesses.length >= 1);
  for (const b of C.businesses) {
    assert.ok(['posted', 'concept'].includes(b.kind), b.id);
    if (b.kind === 'concept' || anyPosted()) assert.ok(piecesOf(b).length >= 1, `${b.id} has no piece`);
  }
});

test('R2: a posted piece has a YYYY-MM-DD date and one https link per platform, on that platform hosts', () => {
  // The check itself, proven on fixtures so it is never vacuous:
  assert.ok(onHosts('https://www.linkedin.com/posts/x', ['linkedin.com']));
  assert.ok(onHosts('https://twitter.com/a/status/1', ['x.com', 'twitter.com']));
  assert.ok(!onHosts('https://linkedin.com.evil.example/x', ['linkedin.com']));
  assert.ok(!onHosts('https://notlinkedin.com/x', ['linkedin.com']));
  for (const p of C.pieces) {
    if (byId(p.business).kind !== 'posted') continue;
    assert.match(p.date || '', /^\d{4}-\d{2}-\d{2}$/, `${p.id}: date`);
    assert.ok(p.urls && typeof p.urls === 'object', `${p.id}: urls`);
    for (const pl of p.platforms) {
      const url = p.urls[pl] || '';
      assert.match(url, /^https:\/\//, `${p.id}: ${pl} url`);
      assert.ok(onHosts(url, C.platforms[pl].hosts), `${p.id}: ${url} is not on ${C.platforms[pl].hosts.join(' or ')}`);
    }
  }
});

test('R3: a concept piece carries no urls, date or image', () => {
  let n = 0;
  for (const p of C.pieces) {
    if (byId(p.business).kind !== 'concept') continue;
    n += 1;
    for (const k of ['urls', 'date', 'image']) assert.equal(p[k], undefined, `${p.id}.${k}`);
  }
  assert.ok(n >= 9, 'at least the nine concept pieces');
});

test('R4: every image names a file under images/', () => {
  for (const p of C.pieces) {
    if (!p.image) continue;
    assert.match(p.image, /^[\w.-]+\.(jpe?g|png)$/i, p.id);
    assert.ok(fs.existsSync(path.join(ROOT, 'images', p.image)), `${p.id}: images/${p.image} is missing`);
  }
});

test('R5: piece platforms belong to the business, every platform id exists, and the hosts are the spec ones', () => {
  for (const b of C.businesses) for (const pl of b.platforms) assert.ok(C.platforms[pl], `${b.id}: unknown platform ${pl}`);
  for (const p of C.pieces) {
    const b = byId(p.business);
    assert.ok(b, `${p.id}: unknown business ${p.business}`);
    assert.ok(p.platforms.length >= 1, p.id);
    for (const pl of p.platforms) assert.ok(b.platforms.includes(pl), `${p.id} -> ${pl}`);
    assert.ok(['4x5', '1x1', '9x16', 'carousel'].includes(p.format), p.id);
    assert.equal(typeof p.caption, 'string', p.id);
    assert.ok(Array.isArray(p.hashtags), p.id);
  }
  for (const [id, pl] of Object.entries(C.platforms)) {
    assert.equal(pl.id, id);
    assert.ok(pl.label, id);
  }
  assert.deepEqual(C.platforms.linkedin.hosts, ['linkedin.com']);
  assert.deepEqual(C.platforms.x.hosts, ['x.com', 'twitter.com']);
  assert.deepEqual(C.platforms.instagram.hosts, ['instagram.com']);
  assert.deepEqual(C.platforms.facebook.hosts, ['facebook.com']);
});

test('R6: brand url and contact email are the real ones', () => {
  assert.equal(C.brand.url, 'https://newtzmedia.com');
  assert.equal(C.contact.email, 'zack@newtzmedia.com');
  assert.equal(C.brand.name, 'NewtzMedia');
  assert.equal(C.brand.owner, 'Zack Newtz');
});

test('businesses: hex palette, motif, handle; concepts carry a .example domain, posted ones never', () => {
  assert.deepEqual(C.businesses.map((b) => b.id), ['nftek', 'brewhaus', 'ironworks', 'aceauto']);
  for (const b of C.businesses) {
    for (const k of ['bg', 'ink', 'accent']) assert.match(b.palette[k], /^#[0-9A-F]{6}$/i, `${b.id}: ${k}`);
    assert.ok(C.motifs[b.motif], `${b.id}: motif`);
    assert.ok(b.handle.startsWith('@') && b.platforms.length >= 1, b.id);
    if (b.kind === 'concept') assert.ok(b.domain.endsWith('.example'), b.id);
    else {
      assert.equal(b.domain, undefined, `${b.id}: a posted business has no .example domain`);
      assert.equal(typeof b.profiles, 'object', `${b.id}: profiles`);
    }
  }
});

test('the copy is the spec, verbatim', () => {
  assert.equal(C.brand.tagline, 'Your business, posted.');
  assert.equal(C.brand.intro, 'Social media posts for local small businesses, made and posted for a monthly fee.');
  assert.equal(C.brand.introNote, 'Where it says posted below, the post is live on the platform and the stamp links to it.');
  assert.deepEqual(C.steps, [
    { title: 'We talk', body: 'A short call about your business and who you want walking in.' },
    { title: 'I draft, you approve', body: 'You see every post before it goes up. Change anything.' },
    { title: 'They go out', body: 'Posted for you on a steady schedule, agreed on the call.' },
  ]);
  assert.equal(C.about, 'I’m Zack Newtz. I run the social media accounts for NFTek, my family’s cloud and AI automation company. NewtzMedia grew out of that: the same work, for local businesses that have nobody to do it.');
  assert.equal(C.contact.line, 'Tell me about your business and I’ll reply within a day.');
  assert.equal(C.footer, 'Concept samples are invented businesses shown to demonstrate the work. Nothing labeled concept was posted. Posted work links to the live post.');
  assert.deepEqual(C.copy, {
    skip: 'Skip to the work',
    contactLink: 'Contact',
    postedTitle: 'Posted',
    postedSub: 'Real posts, live where they went up. Tap one to see it there.',
    postedEmpty: 'First posts go live soon.',
    conceptsTitle: 'Concepts for other businesses',
    conceptsSub: 'Invented businesses, made to show the range. Nothing here was posted.',
    howTitle: 'How it works',
    aboutTitle: 'About',
    contactTitle: 'Contact',
    businessTabs: 'Business',
    platformTabs: 'Platform',
    postedTo: 'Posted to',
    seeLive: 'See it live',
    newTab: '(opens in a new tab)',
    conceptStamp: 'Concept · not posted',
    noJs: 'Turn on JavaScript to browse the posts.',
    story: 'Story',
    learnMore: 'Learn more',
    footerLine: 'NewtzMedia, 2026',
  });
  for (const [k, v] of Object.entries(C.copy)) assert.ok(typeof v === 'string' && v.trim(), k);
});

test('R7 and the banned words: the scan covers brand, steps, about, contact, footer, copy, businesses and concept pieces, never posted pieces', () => {
  const banned = /\b(review|reviews|rated|rating|stars?|testimonial|customers love|results|guaranteed|grow|engagement)\b/i;
  const concept = C.pieces.filter((p) => byId(p.business).kind === 'concept');
  const scanned = JSON.stringify({ brand: C.brand, steps: C.steps, about: C.about, contact: C.contact, footer: C.footer, copy: C.copy, businesses: C.businesses, concept });
  assert.doesNotMatch(scanned, banned);
  assert.doesNotMatch(scanned, /!| & /, 'no exclamation marks, "and" never "&"');
  assert.match('customers love it', banned, 'the scan would catch it'); // the regex is live, not vacuous
});
```

- [ ] **Step 3: Run it to see it fail**

```bash
cd /c/Users/mythi/Claude/newtzmedia-site && node --test tests/site-content.test.js 2>&1 | grep -E "Cannot find module|^ℹ (pass|fail)"
```

Expected:

```
Error: Cannot find module '../content.js'
ℹ pass 0
ℹ fail 1
```

- [ ] **Step 4: Write content.js**

Write tool, `content.js` (10,382 bytes):

```js
// content.js - every word and every sample post on the site. Plain script, no
// modules, so the page loads it with a <script> tag and the Node tests load it
// with require(). One global: NEWTZ_CONTENT.
//
// Two kinds of business. 'concept' businesses are invented: their pieces were
// never posted and can never carry a link. 'posted' businesses are real accounts
// Zack runs: each of their pieces links to the live post. Rules R1 to R7 in the
// spec (section 3) are enforced by tests/site-content.test.js.
globalThis.NEWTZ_CONTENT = {
  brand: {
    name: 'NewtzMedia',
    owner: 'Zack Newtz',
    tagline: 'Your business, posted.',
    intro: 'Social media posts for local small businesses, made and posted for a monthly fee.',
    introNote: 'Where it says posted below, the post is live on the platform and the stamp links to it.',
    url: 'https://newtzmedia.com',
  },

  // hosts: a posted piece's link for this platform must live on one of these
  // hosts or a subdomain of one (rule R2).
  platforms: {
    linkedin: { id: 'linkedin', label: 'LinkedIn', hosts: ['linkedin.com'] },
    x: { id: 'x', label: 'X', hosts: ['x.com', 'twitter.com'] },
    instagram: { id: 'instagram', label: 'Instagram', hosts: ['instagram.com'] },
    facebook: { id: 'facebook', label: 'Facebook', hosts: ['facebook.com'] },
  },

  // Platform order inside a business's list is the order its pills appear in.
  businesses: [
    {
      id: 'nftek', name: 'NFTek', kind: 'posted',
      handle: '@nfteks',                // Zack supplies the real handle
      description: 'Cloud and AI automation consulting',
      platforms: ['linkedin', 'x'],
      profiles: {},                     // Zack supplies one https URL per platform; the launch gate refuses a missing one
      palette: { bg: '#0F1B3D', ink: '#FFFFFF', accent: '#35E0FF' },
      motif: 'cloud',
    },
    {
      id: 'brewhaus', name: 'Brew Haus', kind: 'concept',
      handle: '@brewhaus', domain: 'brewhaus.example',
      description: 'Neighborhood coffee shop',
      platforms: ['instagram', 'facebook'],
      palette: { bg: '#F3E6D3', ink: '#3B2415', accent: '#D9702B' },
      motif: 'cup',
    },
    {
      id: 'ironworks', name: 'Ironworks Gym', kind: 'concept',
      handle: '@ironworksgym', domain: 'ironworksgym.example',
      description: 'Strength gym',
      platforms: ['instagram', 'facebook', 'x'],
      palette: { bg: '#111111', ink: '#FFFFFF', accent: '#E0202A' },
      motif: 'plate',
    },
    {
      id: 'aceauto', name: 'Ace Auto Repair', kind: 'concept',
      handle: '@aceautorepair', domain: 'aceautorepair.example',
      description: 'Independent auto shop',
      platforms: ['facebook', 'instagram'],
      palette: { bg: '#2B4C6F', ink: '#FFFFFF', accent: '#F5C518' },
      motif: 'wrench',
    },
  ],

  // Pieces render in this order. A piece shows on every platform it lists.
  pieces: [
    // NFTek has no pieces until the first real post goes live (from the week
    // of 2026-09-28); the launch gate refuses to launch without one. A posted
    // piece looks like this (headline may be empty, hashtags may be empty,
    // image is optional and names a file under images/):
    // {
    //   id: 'nftek-2026-10-03', business: 'nftek', platforms: ['linkedin'],
    //   format: '1x1', headline: '', caption: 'The post text, exactly as published.',
    //   hashtags: [], date: '2026-10-03',
    //   urls: { linkedin: 'https://www.linkedin.com/posts/...' },
    //   image: 'nftek-2026-10-03.jpg',
    // },

    // Brew Haus (concept)
    {
      id: 'brewhaus-fall', business: 'brewhaus', platforms: ['instagram', 'facebook'], format: '4x5',
      headline: 'The fall menu is here.',
      sub: 'Maple latte, cinnamon cold brew, pumpkin scone.',
      caption: 'Maple latte, cinnamon cold brew and the pumpkin scone are back starting tomorrow. Come early, the scones go fast.',
      hashtags: ['fallmenu', 'coffeeshop', 'maplelatte'],
    },
    {
      id: 'brewhaus-hours', business: 'brewhaus', platforms: ['instagram', 'facebook'], format: '1x1',
      headline: 'New hours',
      sub: 'Mon to Fri 6am to 6pm. Sat and Sun 7am to 4pm.',
      caption: 'New hours starting Monday. Earlier on weekdays for the morning crowd.',
      hashtags: ['coffeeshop', 'openearly', 'localcoffee'],
    },
    {
      id: 'brewhaus-story', business: 'brewhaus', platforms: ['instagram', 'facebook'], format: '9x16',
      headline: 'Today’s special',
      sub: 'Maple cold brew, $4 all day.',
      caption: 'Maple cold brew, four dollars, all day today.',
      hashtags: ['coldbrew', 'todaysspecial', 'coffee'],
    },
    // Ironworks Gym (concept)
    {
      id: 'ironworks-free', business: 'ironworks', platforms: ['instagram', 'facebook', 'x'], format: '4x5',
      headline: 'First month free.',
      sub: 'No contract. Just show up.',
      caption: 'Your first month is free. No contract, no sign-up fee. Walk in, train, decide later.',
      hashtags: ['gym', 'firstmonthfree', 'strength'],
    },
    {
      id: 'ironworks-schedule', business: 'ironworks', platforms: ['instagram', 'facebook', 'x'], format: '1x1',
      headline: 'This week',
      sub: 'Mon Strength. Tue Spin. Wed Boxing. Thu Strength. Fri Open gym. Sat Bootcamp.',
      caption: 'This week’s classes. Open gym all day Friday.',
      hashtags: ['gym', 'classschedule', 'training'],
    },
    {
      id: 'ironworks-story', business: 'ironworks', platforms: ['instagram', 'facebook'], format: '9x16',
      headline: '6am club',
      sub: 'Doors open 5:45. Coffee’s on us.',
      caption: '6am club. Doors open at 5:45 and the coffee is on us.',
      hashtags: ['6amclub', 'gym', 'earlybird'],
    },
    // Ace Auto Repair (concept)
    {
      id: 'aceauto-brakes', business: 'aceauto', platforms: ['facebook', 'instagram'], format: '4x5',
      headline: 'Free brake inspection.',
      sub: 'All November. No appointment needed.',
      caption: 'Free brake inspection all November. Drive in, no appointment needed.',
      hashtags: ['brakes', 'autorepair', 'november'],
    },
    {
      id: 'aceauto-hiring', business: 'aceauto', platforms: ['facebook', 'instagram'], format: '1x1',
      headline: 'We’re hiring.',
      sub: 'One full-time technician. Apply in the shop or by email.',
      caption: 'We’re hiring one full-time technician. Apply in the shop or by email.',
      hashtags: ['hiring', 'mechanic', 'autorepair'],
    },
    {
      id: 'aceauto-tip', business: 'aceauto', platforms: ['facebook', 'instagram'], format: '4x5',
      headline: 'Cold morning?',
      sub: 'Check your tire pressure. It drops one PSI for every ten degrees.',
      caption: 'Cold morning? Tire pressure drops about one PSI for every ten degrees. Check it before the long drive.',
      hashtags: ['cartips', 'winter', 'autorepair'],
    },
  ],

  // Flat geometric marks for the CSS-drawn concept art. Decorative: aria-hidden.
  motifs: {
    cloud: '<svg viewBox="0 0 48 48" aria-hidden="true" focusable="false"><path d="M14 34h20a8 8 0 0 0 1-15.9A11 11 0 0 0 14 20a7 7 0 0 0 0 14Z" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/><path d="M17 34v7M24 34v7M31 34v7" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg>',
    cup: '<svg viewBox="0 0 48 48" aria-hidden="true" focusable="false"><path d="M10 14h24v12a10 10 0 0 1-10 10h-4a10 10 0 0 1-10-10Z" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/><path d="M34 18h3a5 5 0 0 1 0 10h-3" fill="none" stroke="currentColor" stroke-width="3"/><path d="M8 42h30" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg>',
    plate: '<svg viewBox="0 0 48 48" aria-hidden="true" focusable="false"><path d="M6 24h36" stroke="currentColor" stroke-width="3" stroke-linecap="round"/><rect x="10" y="13" width="6" height="22" rx="1" fill="currentColor"/><rect x="32" y="13" width="6" height="22" rx="1" fill="currentColor"/><rect x="3" y="17" width="4" height="14" rx="1" fill="currentColor"/><rect x="41" y="17" width="4" height="14" rx="1" fill="currentColor"/></svg>',
    wrench: '<svg viewBox="0 0 48 48" aria-hidden="true" focusable="false"><path d="M40 13a10 10 0 0 1-13.2 12.4L13 39.2a3.5 3.5 0 0 1-5-5l13.8-13.8A10 10 0 0 1 35 7l-6 6 1.5 4.5L35 19Z" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/></svg>',
  },

  // How it works. A real sequence, so the page numbers the steps.
  steps: [
    { title: 'We talk', body: 'A short call about your business and who you want walking in.' },
    { title: 'I draft, you approve', body: 'You see every post before it goes up. Change anything.' },
    { title: 'They go out', body: 'Posted for you on a steady schedule, agreed on the call.' },
  ],

  about: 'I’m Zack Newtz. I run the social media accounts for NFTek, my family’s cloud and AI automation company. NewtzMedia grew out of that: the same work, for local businesses that have nobody to do it.',

  // phone: +1 and ten digits, phoneDisplay: how it reads on the page. Both
  // empty until Zack supplies them; the launch gate refuses empty values.
  contact: {
    line: 'Tell me about your business and I’ll reply within a day.',
    phone: '',
    phoneDisplay: '',
    email: 'zack@newtzmedia.com',
  },

  footer: 'Concept samples are invented businesses shown to demonstrate the work. Nothing labeled concept was posted. Posted work links to the live post.',

  // Every UI string. index.html carries the static ones verbatim
  // (tests/site-page.test.js checks) and logic.js renders the rest.
  copy: {
    skip: 'Skip to the work',
    contactLink: 'Contact',
    postedTitle: 'Posted',
    postedSub: 'Real posts, live where they went up. Tap one to see it there.',
    postedEmpty: 'First posts go live soon.',
    conceptsTitle: 'Concepts for other businesses',
    conceptsSub: 'Invented businesses, made to show the range. Nothing here was posted.',
    howTitle: 'How it works',
    aboutTitle: 'About',
    contactTitle: 'Contact',
    businessTabs: 'Business',
    platformTabs: 'Platform',
    postedTo: 'Posted to',
    seeLive: 'See it live',
    newTab: '(opens in a new tab)',
    conceptStamp: 'Concept · not posted',
    noJs: 'Turn on JavaScript to browse the posts.',
    story: 'Story',
    learnMore: 'Learn more',
    footerLine: 'NewtzMedia, 2026',
  },
};
```

- [ ] **Step 5: Run the new tests, then the whole suite**

```bash
cd /c/Users/mythi/Claude/newtzmedia-site && node --check content.js && node --test tests/site-content.test.js 2>&1 | grep -E "^ℹ (tests|pass|fail)" && node --test "tests/*.test.js" 2>&1 | grep -E "^ℹ (tests|pass|fail)"
```

Expected:

```
ℹ tests 9
ℹ pass 9
ℹ fail 0
ℹ tests 49
ℹ pass 49
ℹ fail 0
```

- [ ] **Step 6: Commit**

```bash
cd /c/Users/mythi/Claude/newtzmedia-site && git add content.js tests/site-content.test.js && git commit -q -F - <<'EOF'
Add the site content and its rules

Every word and every piece of the real site in one global, NEWTZ_CONTENT:
the spec's copy verbatim, NFTek as the posted business with no pieces yet,
three concept businesses with nine pieces. The tests enforce rules R1 to
R7, the platform hosts, the verbatim copy and the banned words.

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>
EOF
git log -1 --format=%B | grep -c "^Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>$"
```

Expected: `1`.

---

### Task 2: logic.js: selectors, stamps and renderers

**Files:**
- Create: `logic.js`
- Create: `tests/site-logic.test.js`

**Interfaces:**
- Consumes: `globalThis.NEWTZ_CONTENT` (Task 1).
- Produces: `globalThis.NEWTZ_LOGIC_FOR(content)`, a factory returning the object below, and `globalThis.NEWTZ_LOGIC = NEWTZ_LOGIC_FOR(NEWTZ_CONTENT)`:
  - `escapeHtml(s)`: escapes `& < > " '`.
  - `businessById(id)` (throws `Unknown business`), `businessesOfKind(kind)` in content order.
  - `piecesFor(businessId, platformId)` in content order; `platformsFor(businessId)`: only the platforms with at least one piece, in the business's order.
  - `hasPieces(kind)`; `isEmpty(section)` for `'posted'` or `'concepts'` (throws `Unknown section`).
  - `formatStampDate(iso)`: `'2026-10-03'` -> `'3 Oct 2026'`, no `Intl` (throws `Bad date`).
  - `stampFor(business, piece, platformId)`: the posted stamp `<a class="stamp stamp--posted" ...>` or the concept `<p class="stamp stamp--concept">`.
  - `frameClass(piece, platformId)`, `artText(...)`, `altFor(piece)` (first caption line, at most 120 characters), `renderArt(...)`, `renderFrame(...)`.
  - `renderPost(business, piece, platformId)` -> `<article class="post post--PLATFORM" data-format="...">` (throws `Unknown platform`).
  - `renderCard(business, piece, platformId)` -> `<article class="card" data-piece="..." data-business="..." data-platform="...">`.
  - `renderGallery(section, {business, platform})`: the cards, or `<p class="gallery__empty">First posts go live soon.</p>` when the section is empty.
  - `renderBusinessTabs(section, activeId)`: `''` with fewer than two businesses; tab ids `SECTION-btab-ID`, `aria-controls="SECTION-gallery"`.
  - `renderPlatformTabs(section, businessId, activeId)`: `''` with no pieces; tab ids `SECTION-ptab-PLATFORM`.
  - `renderSteps()`, `renderContact()`, `renderFooter()`: the static blocks Task 4 pastes into `index.html`.

- [ ] **Step 1: Write the failing test**

Write tool, `tests/site-logic.test.js` (9,924 bytes):

```js
// Selectors, stamps and renderers. No DOM. Fixtures come from NEWTZ_LOGIC_FOR
// so the posted side is tested before NFTek's first real post exists.
const { test } = require('node:test');
const assert = require('node:assert/strict');
require('../content.js');
require('../logic.js');
const C = globalThis.NEWTZ_CONTENT;
const L = globalThis.NEWTZ_LOGIC;
const count = (html, re) => (html.match(re) || []).length;
const piece = (id) => C.pieces.find((p) => p.id === id);

// The real content plus two NFTek pieces (one text-only, one with an image),
// profile links and a phone number.
function fixture() {
  const F = JSON.parse(JSON.stringify(C));
  F.businesses[0].profiles = { linkedin: 'https://www.linkedin.com/company/nfteks', x: 'https://x.com/nfteks' };
  F.pieces.unshift(
    {
      id: 'nftek-2026-10-03', business: 'nftek', platforms: ['linkedin', 'x'], format: '1x1', headline: '',
      caption: 'One report used to take a Monday. <b>Now</b> it builds itself.\nSecond line.', hashtags: [],
      date: '2026-10-03', urls: { linkedin: 'https://www.linkedin.com/posts/nfteks_1', x: 'https://x.com/nfteks/status/1' },
    },
    {
      id: 'nftek-2026-10-10', business: 'nftek', platforms: ['linkedin'], format: '4x5', headline: '',
      caption: 'A'.repeat(150), hashtags: ['automation'],
      date: '2026-10-10', urls: { linkedin: 'https://www.linkedin.com/posts/nfteks_2' }, image: 'nftek-2026-10-10.jpg',
    },
  );
  F.contact.phone = '+15555550123';
  F.contact.phoneDisplay = '(555) 555-0123';
  return { F, FL: globalThis.NEWTZ_LOGIC_FOR(F) };
}

test('businessesOfKind splits posted from concept in content order', () => {
  assert.deepEqual(L.businessesOfKind('posted').map((b) => b.id), ['nftek']);
  assert.deepEqual(L.businessesOfKind('concept').map((b) => b.id), ['brewhaus', 'ironworks', 'aceauto']);
  assert.throws(() => L.businessById('nobody'), /Unknown business/);
});

test('piecesFor keeps content order; platformsFor drops a platform with no piece', () => {
  assert.deepEqual(L.piecesFor('ironworks', 'x').map((p) => p.id), ['ironworks-free', 'ironworks-schedule']);
  assert.deepEqual(L.piecesFor('brewhaus', 'linkedin'), []);
  assert.deepEqual(L.platformsFor('ironworks'), ['instagram', 'facebook', 'x']);
  assert.deepEqual(L.platformsFor('nftek'), [], 'no posted piece yet');
  const { FL } = fixture();
  assert.deepEqual(FL.platformsFor('nftek'), ['linkedin', 'x']);
  assert.deepEqual(FL.piecesFor('nftek', 'x').map((p) => p.id), ['nftek-2026-10-03']);
});

test('formatStampDate: day without a leading zero, three-letter month, four-digit year, no Intl', () => {
  assert.equal(L.formatStampDate('2026-10-03'), '3 Oct 2026');
  assert.equal(L.formatStampDate('2027-01-15'), '15 Jan 2027');
  assert.equal(L.formatStampDate('2026-12-31'), '31 Dec 2026');
  assert.throws(() => L.formatStampDate('Oct 3, 2026'), /Bad date/);
});

test('stampFor: a posted piece is one link to the live post in a new tab; a concept piece is plain text', () => {
  const { F, FL } = fixture();
  const nftek = F.businesses[0];
  assert.equal(FL.stampFor(nftek, F.pieces[0], 'linkedin'),
    '<a class="stamp stamp--posted" href="https://www.linkedin.com/posts/nfteks_1" target="_blank" rel="noopener noreferrer">' +
    'Posted to LinkedIn · 3 Oct 2026 · See it live<span class="visually-hidden"> (opens in a new tab)</span><span aria-hidden="true"> ↗</span></a>');
  assert.ok(FL.stampFor(nftek, F.pieces[0], 'x').includes('href="https://x.com/nfteks/status/1"'));
  assert.equal(L.stampFor(L.businessById('brewhaus'), piece('brewhaus-fall'), 'instagram'), '<p class="stamp stamp--concept">Concept · not posted</p>');
});

test('renderGallery: zero posted pieces gives the empty line and no card; concepts render cards without a single link', () => {
  assert.equal(L.isEmpty('posted'), true);
  assert.equal(L.isEmpty('concepts'), false);
  assert.equal(L.renderGallery('posted', { business: 'nftek', platform: null }), '<p class="gallery__empty">First posts go live soon.</p>');
  const g = L.renderGallery('concepts', { business: 'brewhaus', platform: 'instagram' });
  assert.equal(count(g, /<article class="card"/g), 3);
  assert.equal(count(g, /stamp--concept/g), 3);
  assert.equal(count(g, /<a /g), 0, 'a concept card never contains a link');
  assert.ok(g.includes('data-piece="brewhaus-fall" data-business="brewhaus" data-platform="instagram"'));
  assert.throws(() => L.renderGallery('work', {}), /Unknown section/);
});

test('a posted piece: text shown as published (escaped, never edited), no headline, no CSS art, a stamp, the profile link, an image when it has one', () => {
  const { F, FL } = fixture();
  const nftek = F.businesses[0];
  const g = FL.renderGallery('posted', { business: 'nftek', platform: 'linkedin' });
  assert.equal(count(g, /<article class="card"/g), 2);
  assert.equal(count(g, /stamp--posted/g), 2);
  assert.ok(g.includes('One report used to take a Monday. &lt;b&gt;Now&lt;/b&gt; it builds itself.\nSecond line.'));
  assert.ok(!g.includes('art__headline') && !g.includes('class="art '));
  const text = FL.renderPost(nftek, F.pieces[0], 'linkedin');
  assert.ok(!text.includes('post__frame'), 'no image, no frame');
  assert.ok(text.includes('<span class="post__meta">Cloud and AI automation consulting · 3 Oct 2026</span>'), 'the header shows the real date');
  assert.ok(FL.renderPost(nftek, F.pieces[0], 'x').includes('<span class="post__meta">@nfteks</span>'));
  assert.ok(text.includes('<a class="post__name" href="https://www.linkedin.com/company/nfteks" target="_blank" rel="noopener noreferrer">NFTek<span class="visually-hidden"> (opens in a new tab)</span></a>'));
  assert.ok(FL.renderPost(nftek, F.pieces[0], 'x').includes('href="https://x.com/nfteks"'));
  const img = FL.renderPost(nftek, F.pieces[1], 'linkedin');
  assert.ok(img.includes('<div class="post__doc"><div class="post__frame post__frame--4x5"><img class="post__image" src="images/nftek-2026-10-10.jpg" alt="' + 'A'.repeat(120) + '" loading="lazy"></div><span class="post__pages">1/1</span></div>'));
  assert.equal(FL.altFor({ caption: 'first line\nsecond line' }), 'first line');
  assert.ok(!FL.renderPost(nftek, F.pieces[0], 'x').includes('post__tags'), 'no hashtags, no tags span');
});

test('concept posts keep the mockup templates: Instagram caption and tags, Facebook link card, X 16:9 frame, story badge', () => {
  const brew = L.businessById('brewhaus');
  const ig = L.renderPost(brew, piece('brewhaus-fall'), 'instagram');
  assert.match(ig, /^<article class="post post--instagram" data-format="4x5">/);
  assert.ok(ig.includes('post__frame post__frame--4x5') && ig.includes('--art-bg:#F3E6D3;--art-ink:#3B2415;--art-accent:#D9702B'));
  assert.ok(ig.includes('<strong>brewhaus</strong>') && ig.includes('<span class="post__tags">#fallmenu #coffeeshop #maplelatte</span>'));
  assert.ok(ig.includes('<span class="post__name">Brew Haus</span>') && ig.includes('The fall menu is here.'));
  assert.equal(count(ig, /post__icon/g), 3);
  const fb = L.renderPost(brew, piece('brewhaus-fall'), 'facebook');
  assert.ok(fb.includes('post__linkcard') && fb.includes('brewhaus.example') && fb.includes('Learn more'));
  const x = L.renderPost(L.businessById('ironworks'), piece('ironworks-free'), 'x');
  assert.ok(x.includes('post__frame--16x9') && x.includes('art art--4x5') && !x.includes('#gym'));
  const story = L.renderPost(brew, piece('brewhaus-story'), 'instagram');
  assert.ok(story.includes('post__frame--9x16') && story.includes('<span class="post__story">Story</span>'));
  assert.throws(() => L.renderPost(brew, piece('brewhaus-fall'), 'tiktok'), /Unknown platform/);
});

test('business tabs render only from two businesses; every tab id is scoped to its section', () => {
  assert.equal(L.renderBusinessTabs('posted', 'nftek'), '');
  const t = L.renderBusinessTabs('concepts', 'ironworks');
  assert.equal(count(t, /role="tab"/g), 3);
  assert.ok(t.includes('id="concepts-btab-brewhaus"') && t.includes('aria-controls="concepts-gallery"'));
  assert.ok(t.includes('id="concepts-btab-ironworks" aria-selected="true"'));
  assert.equal(count(t, /aria-selected="true"/g), 1);
  assert.equal(count(t, /tabindex="0"/g), 1);
  assert.equal(count(t, /tabindex="-1"/g), 2);
  const p = L.renderPlatformTabs('concepts', 'ironworks', 'x');
  assert.deepEqual(p.match(/id="[^"]+"/g), ['id="concepts-ptab-instagram"', 'id="concepts-ptab-facebook"', 'id="concepts-ptab-x"']);
  assert.ok(p.includes('id="concepts-ptab-x" aria-selected="true"') && p.includes('>Instagram</button>'));
  assert.equal(L.renderPlatformTabs('posted', 'nftek', null), '', 'no pieces, no pills');
});

test('renderSteps: three steps in order', () => {
  const s = L.renderSteps();
  assert.equal(count(s, /<li class="step">/g), 3);
  assert.deepEqual(s.match(/<h3>[^<]+<\/h3>/g), ['<h3>We talk</h3>', '<h3>I draft, you approve</h3>', '<h3>They go out</h3>']);
});

test('renderContact: the email as a mailto link showing the address; the phone as a tel link showing phoneDisplay once set', () => {
  const real = L.renderContact();
  assert.ok(real.startsWith('<p class="contact__line">Tell me about your business and I’ll reply within a day.</p>'));
  assert.ok(real.includes('<a class="contact__link" href="mailto:zack@newtzmedia.com">zack@newtzmedia.com</a>'));
  assert.ok(!real.includes('tel:'), 'no phone yet, no tel link');
  const { FL } = fixture();
  assert.ok(FL.renderContact().includes('<a class="contact__link" href="tel:+15555550123">(555) 555-0123</a><a class="contact__link" href="mailto:'));
});

test('renderFooter carries the concept note and the year line', () => {
  assert.equal(L.renderFooter(), '<p class="foot__note">' + C.footer + '</p><p class="foot__line">NewtzMedia, 2026</p>');
});

test('escapeHtml escapes the five characters', () => {
  assert.equal(L.escapeHtml('<a href="x">&\'</a>'), '&lt;a href=&quot;x&quot;&gt;&amp;&#39;&lt;/a&gt;');
});
```

- [ ] **Step 2: Run it to see it fail**

```bash
cd /c/Users/mythi/Claude/newtzmedia-site && node --test tests/site-logic.test.js 2>&1 | grep -E "Cannot find module|^ℹ (pass|fail)"
```

Expected:

```
Error: Cannot find module '../logic.js'
ℹ pass 0
ℹ fail 1
```

- [ ] **Step 3: Write logic.js**

Write tool, `logic.js` (12,495 bytes):

```js
// logic.js - pure functions over the content: selectors and HTML-string
// renderers. No DOM access, so Node tests every function.
// Two globals: NEWTZ_LOGIC_FOR(content) builds the function set for any content
// object (the tests use it with fixtures), NEWTZ_LOGIC is that set for
// NEWTZ_CONTENT. behavior.js only ever calls NEWTZ_LOGIC.
globalThis.NEWTZ_LOGIC_FOR = function (C) {
  'use strict';

  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const KIND = { posted: 'posted', concepts: 'concept' }; // gallery section id -> business kind

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (ch) => (
      { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]
    ));
  }

  // ---- selectors ---------------------------------------------------------

  function businessById(id) {
    const b = C.businesses.find((x) => x.id === id);
    if (!b) throw new Error('Unknown business: ' + id);
    return b;
  }

  function businessesOfKind(kind) {
    return C.businesses.filter((b) => b.kind === kind);
  }

  function kindOf(section) {
    const k = KIND[section];
    if (!k) throw new Error('Unknown section: ' + section);
    return k;
  }

  // Pieces of this business that went to this platform, in content order.
  function piecesFor(businessId, platformId) {
    return C.pieces.filter((p) => p.business === businessId && p.platforms.includes(platformId));
  }

  // The business's platforms that have at least one piece, in the business's
  // own order: a pill never opens on an empty grid.
  function platformsFor(businessId) {
    return businessById(businessId).platforms.filter((pl) => piecesFor(businessId, pl).length > 0);
  }

  function hasPieces(kind) {
    return C.pieces.some((p) => businessById(p.business).kind === kind);
  }

  // True only for the Posted section while no real post exists (spec 4.4).
  function isEmpty(section) {
    return !hasPieces(kindOf(section));
  }

  // ---- stamps ------------------------------------------------------------

  // '2026-10-03' -> '3 Oct 2026'. A fixed table, no Intl, so every browser and
  // Node print the same text.
  function formatStampDate(iso) {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
    if (!m) throw new Error('Bad date: ' + iso);
    return Number(m[3]) + ' ' + MONTHS[Number(m[2]) - 1] + ' ' + Number(m[1]);
  }

  // The proof line under every card. Posted: one link to the live post, in a
  // new tab. Concept: plain text, never a link.
  function stampFor(business, piece, platformId) {
    if (business.kind !== 'posted') {
      return '<p class="stamp stamp--concept">' + escapeHtml(C.copy.conceptStamp) + '</p>';
    }
    const label = C.copy.postedTo + ' ' + C.platforms[platformId].label + ' · ' + formatStampDate(piece.date) + ' · ' + C.copy.seeLive;
    return '<a class="stamp stamp--posted" href="' + escapeHtml(piece.urls[platformId]) + '" target="_blank" rel="noopener noreferrer">' +
      escapeHtml(label) + '<span class="visually-hidden"> ' + escapeHtml(C.copy.newTab) + '</span><span aria-hidden="true"> ↗</span></a>';
  }

  // ---- the post: platform chrome around the visual (styled by posts.css) --

  const ICONS = {
    heart: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20s-7-4.6-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.4-7 10-7 10Z" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>',
    comment: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16v11H9l-5 4Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>',
    share: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 3 3 10l8 3 3 8Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>',
    repost: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 7h10l-3-3M17 17H7l3 3" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    like: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 11v9H3v-9Zm4 9h7a2 2 0 0 0 2-2l1-6a2 2 0 0 0-2-2h-5l1-5a2 2 0 0 0-3-1l-4 7v9Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>',
  };

  // X shows 16:9; every other platform shows the native ratio.
  function frameClass(piece, platformId) {
    if (platformId === 'x') return '16x9';
    return piece.format === 'carousel' ? '1x1' : piece.format;
  }

  function artText(piece) {
    return piece.format === 'carousel' ? piece.slides[0] : { headline: piece.headline, sub: piece.sub };
  }

  // Alt text for a real post image: the caption's first line, at most 120 characters.
  function altFor(piece) {
    return String(piece.caption).split('\n')[0].slice(0, 120);
  }

  function paletteStyle(b) {
    return '--art-bg:' + b.palette.bg + ';--art-ink:' + b.palette.ink + ';--art-accent:' + b.palette.accent;
  }

  // CSS-drawn artwork for concept pieces.
  function renderArt(business, piece) {
    const t = artText(piece);
    return '<div class="art art--' + piece.format + '">' +
      '<span class="art__brand">' + escapeHtml(business.name) + '</span>' +
      '<span class="art__motif">' + C.motifs[business.motif] + '</span>' +
      '<p class="art__headline">' + escapeHtml(t.headline) + '</p>' +
      '<p class="art__sub">' + escapeHtml(t.sub) + '</p></div>';
  }

  // The box the visual sits in, at the ratio this platform shows. A piece with
  // an image shows the image; otherwise the CSS art.
  function renderFrame(business, piece, platformId) {
    const cls = 'post__frame post__frame--' + frameClass(piece, platformId);
    if (piece.image) {
      return '<div class="' + cls + '"><img class="post__image" src="images/' + escapeHtml(piece.image) +
        '" alt="' + escapeHtml(altFor(piece)) + '" loading="lazy"></div>';
    }
    const story = piece.format === '9x16' ? '<span class="post__story">' + escapeHtml(C.copy.story) + '</span>' : '';
    return '<div class="' + cls + '" style="' + paletteStyle(business) + '">' + renderArt(business, piece) + story + '</div>';
  }

  // A posted piece without an image has no visual at all: the text-only form.
  function visualFor(business, piece, platformId) {
    if (business.kind === 'posted' && !piece.image) return '';
    return renderFrame(business, piece, platformId);
  }

  // The post header. A posted business's name links to its profile on this
  // platform when one is set (the only external link besides the stamp).
  function head(b, meta, platformId) {
    const url = b.kind === 'posted' && b.profiles ? b.profiles[platformId] : '';
    const name = url
      ? '<a class="post__name" href="' + escapeHtml(url) + '" target="_blank" rel="noopener noreferrer">' + escapeHtml(b.name) +
        '<span class="visually-hidden"> ' + escapeHtml(C.copy.newTab) + '</span></a>'
      : '<span class="post__name">' + escapeHtml(b.name) + '</span>';
    return '<header class="post__head"><span class="post__avatar" style="--av:' + b.palette.accent + '" aria-hidden="true"></span>' +
      name + '<span class="post__meta">' + escapeHtml(meta) + '</span></header>';
  }

  function actions(names) {
    return '<div class="post__actions" aria-hidden="true">' +
      names.map((n) => '<span class="post__icon">' + ICONS[n] + '</span>').join('') + '</div>';
  }

  function text(piece) {
    return '<p class="post__text">' + escapeHtml(piece.caption) + '</p>';
  }

  function tagsSpan(piece) {
    if (!piece.hashtags.length) return '';
    return ' <span class="post__tags">' + piece.hashtags.map((h) => '#' + escapeHtml(h)).join(' ') + '</span>';
  }

  const TEMPLATES = {
    instagram(b, p) {
      return head(b, b.handle, 'instagram') + visualFor(b, p, 'instagram') + actions(['heart', 'comment', 'share']) +
        '<p class="post__caption"><strong>' + escapeHtml(b.handle.slice(1)) + '</strong> ' + escapeHtml(p.caption) + tagsSpan(p) + '</p>';
    },
    facebook(b, p) {
      const linkcard = b.kind === 'concept'
        ? '<div class="post__linkcard"><span class="post__domain">' + escapeHtml(b.domain) + '</span>' +
          '<span class="post__linktitle">' + escapeHtml(artText(p).headline) + '</span>' +
          '<span class="post__btn">' + escapeHtml(C.copy.learnMore) + '</span></div>'
        : '';
      return head(b, metaTime(b, p), 'facebook') + text(p) + visualFor(b, p, 'facebook') + linkcard;
    },
    x(b, p) {
      return head(b, b.handle, 'x') + text(p) + visualFor(b, p, 'x') + actions(['comment', 'repost', 'heart', 'share']);
    },
    linkedin(b, p) {
      const visual = visualFor(b, p, 'linkedin');
      const pages = p.format === 'carousel' ? '1/' + p.slides.length : '1/1';
      const doc = visual ? '<div class="post__doc">' + visual + '<span class="post__pages">' + pages + '</span></div>' : '';
      return head(b, b.description + ' · ' + metaTime(b, p), 'linkedin') + text(p) + doc + actions(['like', 'comment', 'repost', 'share']);
    },
  };

  // The time in a post header: the real date on a posted card, a mock age on a concept.
  function metaTime(b, p) {
    return b.kind === 'posted' ? formatStampDate(p.date) : (p.platforms.includes('facebook') && !p.platforms.includes('linkedin') ? '2h' : '1d');
  }

  function renderPost(business, piece, platformId) {
    const tpl = TEMPLATES[platformId];
    if (!tpl) throw new Error('Unknown platform: ' + platformId);
    return '<article class="post post--' + platformId + '" data-format="' + piece.format + '">' + tpl(business, piece) + '</article>';
  }

  // ---- cards, galleries, tabs (styled by site.css) -----------------------

  function renderCard(business, piece, platformId) {
    return '<article class="card" data-piece="' + piece.id + '" data-business="' + business.id + '" data-platform="' + platformId + '">' +
      '<div class="card__post">' + renderPost(business, piece, platformId) + '</div>' +
      stampFor(business, piece, platformId) + '</article>';
  }

  // state: { business, platform } for this section.
  function renderGallery(section, state) {
    if (isEmpty(section)) return '<p class="gallery__empty">' + escapeHtml(C.copy.postedEmpty) + '</p>';
    const b = businessById(state.business);
    return piecesFor(b.id, state.platform).map((p) => renderCard(b, p, state.platform)).join('');
  }

  function tabButton(id, label, active, controls, data) {
    return '<button class="tab" role="tab" id="' + id + '" aria-selected="' + active + '" aria-controls="' + controls +
      '" tabindex="' + (active ? 0 : -1) + '" ' + data + '>' + escapeHtml(label) + '</button>';
  }

  // Business tabs appear only from two businesses of the section's kind.
  function renderBusinessTabs(section, activeId) {
    const list = businessesOfKind(kindOf(section));
    if (list.length < 2) return '';
    return list.map((b) => tabButton(section + '-btab-' + b.id, b.name, b.id === activeId, section + '-gallery', 'data-business="' + b.id + '"')).join('');
  }

  function renderPlatformTabs(section, businessId, activeId) {
    return platformsFor(businessId).map((p) => tabButton(section + '-ptab-' + p, C.platforms[p].label, p === activeId, section + '-gallery', 'data-platform="' + p + '"')).join('');
  }

  // ---- static sections (index.html carries the same markup for the no-JS case)

  function renderSteps() {
    return C.steps.map((s) => '<li class="step"><h3>' + escapeHtml(s.title) + '</h3><p>' + escapeHtml(s.body) + '</p></li>').join('');
  }

  function renderContact() {
    const phone = C.contact.phone
      ? '<a class="contact__link" href="tel:' + escapeHtml(C.contact.phone) + '">' + escapeHtml(C.contact.phoneDisplay) + '</a>'
      : '';
    return '<p class="contact__line">' + escapeHtml(C.contact.line) + '</p><p class="contact__links">' + phone +
      '<a class="contact__link" href="mailto:' + escapeHtml(C.contact.email) + '">' + escapeHtml(C.contact.email) + '</a></p>';
  }

  function renderFooter() {
    return '<p class="foot__note">' + escapeHtml(C.footer) + '</p><p class="foot__line">' + escapeHtml(C.copy.footerLine) + '</p>';
  }

  return {
    escapeHtml, businessById, businessesOfKind, piecesFor, platformsFor, hasPieces, isEmpty,
    formatStampDate, stampFor, frameClass, artText, altFor,
    renderArt, renderFrame, renderPost, renderCard, renderGallery, renderBusinessTabs, renderPlatformTabs,
    renderSteps, renderContact, renderFooter,
  };
};
globalThis.NEWTZ_LOGIC = globalThis.NEWTZ_LOGIC_FOR(globalThis.NEWTZ_CONTENT);
```

- [ ] **Step 4: Run the new tests, then the whole suite**

```bash
cd /c/Users/mythi/Claude/newtzmedia-site && node --check logic.js && node --test tests/site-logic.test.js 2>&1 | grep -E "^ℹ (tests|pass|fail)" && node --test "tests/*.test.js" 2>&1 | grep -E "^ℹ (tests|pass|fail)"
```

Expected:

```
ℹ tests 12
ℹ pass 12
ℹ fail 0
ℹ tests 61
ℹ pass 61
ℹ fail 0
```

- [ ] **Step 5: Commit**

```bash
cd /c/Users/mythi/Claude/newtzmedia-site && git add logic.js tests/site-logic.test.js && git commit -q -F - <<'EOF'
Add the selectors, stamps and renderers

Pure functions over NEWTZ_CONTENT, no DOM: the posted stamp as one link to
the live post, the concept stamp as plain text, the empty line for a Posted
section with nothing in it, tabs and pills scoped by section, and the
static blocks the page carries. NEWTZ_LOGIC_FOR lets the tests use a
fixture with posted pieces before NFTek's first real post exists.

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>
EOF
git log -1 --format=%B | grep -c "^Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>$"
```

Expected: `1`.

**Stop here for Zack's review** (his standing rule): report the two commits, the test counts and deviations D1, D2, D4, D6, D10 and D11, which are now in code.

---

### Task 3: The mark: favicon.svg and the three PNGs

**Files:**
- Create: `favicon.svg`
- Create: `tools/make_assets.py`
- Create: `favicon-32.png`, `apple-touch-icon.png`, `og.png` (generated by the script)

**Interfaces:**
- Consumes: nothing.
- Produces: the four asset files that Task 4's `index.html` links and `tests/site-page.test.js` checks: PNG sizes 32x32, 180x180 and 1200x630, and the SVG geometry strings `<rect width="100" height="100" rx="20" fill="#4B2A9E"/>`, two uprights `<rect x="22|64" y="22" width="14" height="56" fill="#FFFFFF"/>` and the diagonal `<polygon points="22,22 39.05,22 78,78 60.95,78" fill="#FFFFFF"/>`.

- [ ] **Step 1: Write favicon.svg**

```bash
cd /c/Users/mythi/Claude/newtzmedia-site && cat > favicon.svg <<'EOF'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="20" fill="#4B2A9E"/><rect x="22" y="22" width="14" height="56" fill="#FFFFFF"/><rect x="64" y="22" width="14" height="56" fill="#FFFFFF"/><polygon points="22,22 39.05,22 78,78 60.95,78" fill="#FFFFFF"/></svg>
EOF
wc -c favicon.svg
```

Expected: `306 favicon.svg`.

- [ ] **Step 2: Make sure Pillow is available in the scratchpad venv**

Zack approved Pillow in a scratchpad virtual environment only (spec decision 22). The venv already exists in the session that wrote this plan; the command below creates it only when it is missing.

```bash
SCRATCH="C:/Users/mythi/AppData/Local/Temp/claude/C--Users-mythi-Claude/4e49d466-0433-4be7-ba7f-d9a4cf70b1ac/scratchpad"
PY="$SCRATCH/venv-assets/Scripts/python.exe"
[ -x "$PY" ] || (python -m venv "$SCRATCH/venv-assets" && "$PY" -m pip install --quiet pillow)
"$PY" -c "import PIL; print('Pillow', PIL.__version__)"
```

Expected: `Pillow 12.3.0` (a newer 12.x is fine). If the session scratchpad is a different directory, use that path for `SCRATCH`.

- [ ] **Step 3: Write the script**

```bash
cd /c/Users/mythi/Claude/newtzmedia-site && mkdir -p tools && cat > tools/make_assets.py <<'EOF'
"""make_assets.py - draws the NewtzMedia mark as favicon-32.png,
apple-touch-icon.png and og.png at the repo root.

Run from the repo root with a Python that has Pillow, installed in a scratchpad
virtual environment and never in the repo:

    <venv>/Scripts/python.exe tools/make_assets.py

Geometry (spec section 5): a purple rounded square, corner radius 20% of the
side, and a white N of three strokes of equal width (14% of the side), inset
22% from each edge, with square ends. favicon.svg carries the same numbers by
hand: uprights at x=22 and x=64, the diagonal's horizontal width 17.05 so its
perpendicular width is 14. No font file: the N is geometry, and the wordmark
on og.png uses a system font (the preview image is not the site's type).
"""
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

PURPLE = (75, 42, 158)      # --purple
INK = (23, 21, 28)          # --ink
MUTED = (91, 86, 112)       # --muted
WHITE = (255, 255, 255)
ROOT = Path(__file__).resolve().parent.parent
SS = 4                      # draw at 4x and shrink for smooth edges


def draw_mark(side, rounded=True):
    """The mark at `side` pixels. rounded=False fills the corners (iOS masks
    its own icons, and a transparent corner would show as black there)."""
    big = side * SS
    img = Image.new("RGBA", (big, big), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    if rounded:
        d.rounded_rectangle((0, 0, big - 1, big - 1), radius=round(big * 0.20), fill=PURPLE)
    else:
        d.rectangle((0, 0, big - 1, big - 1), fill=PURPLE)
    u = big / 100.0
    d.rectangle((22 * u, 22 * u, 36 * u, 78 * u), fill=WHITE)
    d.rectangle((64 * u, 22 * u, 78 * u, 78 * u), fill=WHITE)
    d.polygon([(22 * u, 22 * u), (39.05 * u, 22 * u), (78 * u, 78 * u), (60.95 * u, 78 * u)], fill=WHITE)
    return img.resize((side, side), Image.LANCZOS)


def font(size):
    """A bold system font; Pillow's built-in face if none of these exist."""
    for name in ("segoeuib.ttf", "arialbd.ttf", "DejaVuSans-Bold.ttf"):
        try:
            return ImageFont.truetype(name, size)
        except OSError:
            pass
    return ImageFont.load_default(size)


def draw_og():
    """1200x630 link preview: the mark, the wordmark at 96px, the tagline, the domain."""
    img = Image.new("RGB", (1200, 630), WHITE)
    mark = draw_mark(200)
    img.paste(mark, (100, 215), mark)
    d = ImageDraw.Draw(img)
    d.text((340, 200), "NewtzMedia", font=font(96), fill=INK)
    d.text((340, 340), "Your business, posted.", font=font(48), fill=PURPLE)
    d.text((340, 420), "newtzmedia.com", font=font(32), fill=MUTED)
    return img


def main():
    outputs = {
        "favicon-32.png": draw_mark(32),
        "apple-touch-icon.png": draw_mark(180, rounded=False),
        "og.png": draw_og(),
    }
    for name, img in outputs.items():
        img.save(ROOT / name, optimize=True)
        print(name, img.size, (ROOT / name).stat().st_size, "bytes")


if __name__ == "__main__":
    main()
EOF
wc -c tools/make_assets.py
```

Expected: `2989 tools/make_assets.py`.

- [ ] **Step 4: Run it from the repo root**

```bash
cd /c/Users/mythi/Claude/newtzmedia-site && "$PY" tools/make_assets.py
```

Expected (byte counts may differ by a few on another Pillow build; the sizes must not):

```
favicon-32.png (32, 32) 1177 bytes
apple-touch-icon.png (180, 180) 2912 bytes
og.png (1200, 630) 29999 bytes
```

- [ ] **Step 5: Verify the PNG headers and the tools folder**

```bash
cd /c/Users/mythi/Claude/newtzmedia-site && node -e "const fs=require('fs');for(const f of ['favicon-32.png','apple-touch-icon.png','og.png']){const b=fs.readFileSync(f);console.log(f,b.toString('latin1',1,4),b.readUInt32BE(16)+'x'+b.readUInt32BE(20))}" && ls tools
```

Expected: `favicon-32.png PNG 32x32`, `apple-touch-icon.png PNG 180x180`, `og.png PNG 1200x630`, and `ls tools` prints only `make_assets.py`. If a `__pycache__` folder appears, leave it out of the commit.

- [ ] **Step 6: Look at og.png once**

Read tool on `og.png`. It is a static image file, not a live app, so this is allowed. Expected: the purple rounded square with the white N on the left, "NewtzMedia" in near-black to its right, "Your business, posted." in purple under it, "newtzmedia.com" in grey under that, all on white, nothing clipped. If the wordmark or tagline is clipped or overlaps, stop and report; do not change the geometry.

- [ ] **Step 7: Commit**

```bash
cd /c/Users/mythi/Claude/newtzmedia-site && git add favicon.svg tools/make_assets.py favicon-32.png apple-touch-icon.png og.png && git commit -q -F - <<'EOF'
Add the mark: favicon.svg, the two PNG icons and og.png

The N is geometry (two uprights and a diagonal on a purple rounded
square). favicon.svg is written by hand; tools/make_assets.py draws the
same mark at 32px and 180px and the 1200x630 link-preview image with
Pillow from a scratchpad venv. Only the PNGs enter the repo.

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>
EOF
git log -1 --format=%B | grep -c "^Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>$"
```

Expected: `1`.

---

### Task 4: The page: tests, posts.css, site.css, index.html, preview entry

**Files:**
- Create: `tests/site-page.test.js`
- Create: `posts.css` (derived from `mockups/posts.css`)
- Create: `site.css`
- Replace: `index.html` (the holding page, on this branch only)
- Modify: `.claude/launch.json`

**Interfaces:**
- Consumes: `NEWTZ_CONTENT` (Task 1) and the renderers `renderSteps()`, `escapeHtml(about)`, `renderContact()`, `renderFooter()` (Task 2), whose output the static blocks copy.
- Produces: the DOM hooks Task 5's `behavior.js` queries: sections `#posted` and `#concepts`, and inside each `[data-subline]`, `[data-business-tabs]`, `[data-platform-tabs]` (both `hidden` until rendered) and `[data-gallery]` with ids `posted-gallery` and `concepts-gallery`; the classes `.tabs`, `.tab`, `.gallery`, `.is-swapping`, `.card`, `.stamp`, `.gallery__empty`, `.gallery__nojs`; the tokens on `:root`, including `--swap-ms: 250` and `html.reduced-motion { --swap-ms: 0 }`.

- [ ] **Step 1: Write the failing test**

Write tool, `tests/site-page.test.js` (7,601 bytes):

```js
// index.html and the files it references: head tags, hooks, static parity with
// the renderers, the boundary rule for site.css, and the asset files.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
require('../content.js');
require('../logic.js');
const C = globalThis.NEWTZ_CONTENT;
const L = globalThis.NEWTZ_LOGIC;
const ROOT = path.join(__dirname, '..');
const read = (f) => fs.readFileSync(path.join(ROOT, f), 'utf8');
const html = read('index.html');
const count = (s, re) => (s.match(re) || []).length;
const norm = (s) => s.replace(/>\s+</g, '><').trim();
// Width and height from a PNG's IHDR chunk (bytes 16-23).
const pngSize = (f) => {
  const b = fs.readFileSync(path.join(ROOT, f));
  assert.equal(b.toString('latin1', 1, 4), 'PNG', f);
  return [b.readUInt32BE(16), b.readUInt32BE(20)];
};

test('head: title, description, og and twitter tags, theme color, icons, fonts, lang, viewport, no noindex', () => {
  for (const s of [
    '<html lang="en">', '<meta charset="utf-8">', '<meta name="viewport" content="width=device-width, initial-scale=1">',
    '<title>NewtzMedia: social media posts for local businesses</title>',
    '<meta name="description" content="Social media posts for local small businesses, made and posted for a monthly fee. See real posts, live on the platform.">',
    '<meta property="og:title" content="NewtzMedia: social media posts for local businesses">',
    '<meta property="og:description" content="Social media posts for local small businesses, made and posted for a monthly fee. See real posts, live on the platform.">',
    '<meta property="og:image" content="https://newtzmedia.com/og.png">',
    '<meta property="og:url" content="https://newtzmedia.com/">',
    '<meta name="twitter:card" content="summary_large_image">',
    '<meta name="theme-color" content="#4B2A9E">',
    '<link rel="icon" href="favicon.svg" type="image/svg+xml">',
    '<link rel="icon" href="favicon-32.png" sizes="32x32" type="image/png">',
    '<link rel="apple-touch-icon" href="apple-touch-icon.png">',
    '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>',
    'family=Instrument+Sans:wght@400;600;700', 'family=Gabarito:wght@500;800',
  ]) assert.ok(html.includes(s), s);
  assert.doesNotMatch(html, /noindex/i);
});

test('no mockup leftovers', () => {
  for (const s of ['mock-controls', 'data-hero', 'lightbox', 'data-tagline', 'data-reveal', 'newtzmedia.example', 'minimal.css', 'interactive.css', 'Bricolage']) {
    assert.ok(!html.includes(s), s);
  }
});

test('site.css never targets the inside of a post; posts.css lost the mockup controls and gained the image rules', () => {
  assert.doesNotMatch(read('site.css'), /\.post\b|\.post__|\.art\b|\.art__/);
  const posts = read('posts.css');
  assert.ok(!posts.includes('mock-controls'));
  assert.ok(posts.includes('.post__image') && posts.includes('a.post__name'));
  assert.ok(html.indexOf('href="posts.css"') < html.indexOf('href="site.css"'), 'posts.css before site.css');
});

test('every file index.html references exists, the PNGs have the spec sizes, the SVG has the mark geometry, scripts load in order', () => {
  for (const f of ['posts.css', 'site.css', 'content.js', 'logic.js', 'behavior.js', 'favicon.svg', 'favicon-32.png', 'apple-touch-icon.png', 'og.png']) {
    assert.ok(html.includes(f), `index.html references ${f}`);
    assert.ok(fs.existsSync(path.join(ROOT, f)), `${f} exists`);
  }
  assert.deepEqual(pngSize('favicon-32.png'), [32, 32]);
  assert.deepEqual(pngSize('apple-touch-icon.png'), [180, 180]);
  assert.deepEqual(pngSize('og.png'), [1200, 630]);
  const svg = read('favicon.svg');
  assert.ok(svg.includes('<rect width="100" height="100" rx="20" fill="#4B2A9E"/>'), 'rounded square, radius 20%');
  assert.equal(count(svg, /<rect x="(22|64)" y="22" width="14" height="56" fill="#FFFFFF"\/>/g), 2, 'two uprights');
  assert.ok(svg.includes('<polygon points="22,22 39.05,22 78,78 60.95,78" fill="#FFFFFF"/>'), 'the diagonal');
  assert.ok(html.indexOf('src="content.js"') < html.indexOf('src="logic.js"') && html.indexOf('src="logic.js"') < html.indexOf('src="behavior.js"'));
});

test('CNAME reads newtzmedia.com and .nojekyll exists', () => {
  assert.equal(read('CNAME').trim(), 'newtzmedia.com');
  assert.ok(fs.existsSync(path.join(ROOT, '.nojekyll')));
});

test('the static sections equal the renderers, so the no-JS page never drifts from content.js', () => {
  const block = (re) => {
    const m = re.exec(html);
    assert.ok(m, String(re));
    return norm(m[1]);
  };
  assert.equal(block(/<ol class="steps" data-static="steps">([\s\S]*?)<\/ol>/), norm(L.renderSteps()));
  assert.equal(block(/<p data-static="about">([\s\S]*?)<\/p>/), L.escapeHtml(C.about));
  assert.equal(block(/<div data-static="contact">([\s\S]*?)<\/div>/), norm(L.renderContact()));
  assert.equal(block(/<div class="wrap" data-static="footer">([\s\S]*?)<\/div>/), norm(L.renderFooter()));
});

test('page structure: skip link, header, one h1, both galleries with their hooks and the no-JS line, sections in order, no banned words', () => {
  assert.ok(html.includes('<a class="skip" href="#posted">Skip to the work</a>'));
  assert.ok(html.includes('<a class="wordmark" href="#top" translate="no">NewtzMedia</a>'));
  assert.ok(html.includes('<a class="site-head__contact" href="#contact">Contact</a>'));
  assert.ok(html.includes('<main id="top">'));
  assert.equal(count(html, /<h1/g), 1);
  assert.ok(html.includes('<h1 id="intro-h">Your business, posted.</h1>'));
  assert.ok(html.includes('<p class="intro__line">' + C.brand.intro + '</p>') && html.includes('<p class="intro__note">' + C.brand.introNote + '</p>'));
  for (const s of ['posted', 'concepts']) {
    const sec = new RegExp('<section class="gallery-section[^"]*" id="' + s + '" aria-labelledby="' + s + '-h">([\\s\\S]*?)<\\/section>').exec(html);
    assert.ok(sec, s);
    for (const hook of ['data-subline', 'data-business-tabs hidden', 'data-platform-tabs hidden', 'data-gallery', 'id="' + s + '-gallery"',
      'role="tablist" aria-label="Business"', 'role="tablist" aria-label="Platform"', 'role="tabpanel"']) {
      assert.ok(sec[1].includes(hook), `${s}: ${hook}`);
    }
    assert.equal(count(sec[1], /<p class="gallery__nojs">Turn on JavaScript to browse the posts\.<\/p>/g), 1, s);
  }
  assert.ok(html.includes('<h2 id="posted-h">Posted</h2>') && html.includes('<p class="subline" data-subline>' + C.copy.postedSub + '</p>'));
  assert.ok(html.includes('<section class="gallery-section gallery-section--band" id="concepts"'), 'the Concepts section sits on the band');
  assert.ok(html.includes('<h2 id="concepts-h">Concepts for other businesses</h2>') && html.includes('<p class="subline" data-subline>' + C.copy.conceptsSub + '</p>'));
  assert.ok(html.includes('<h2 id="how-h">How it works</h2>') && html.includes('<h2 id="about-h">About</h2>') && html.includes('<h2 id="contact-h">Contact</h2>'));
  const order = ['id="posted"', 'id="concepts"', 'id="how"', 'id="about"', 'id="contact"', 'class="site-foot"'].map((s) => html.indexOf(s));
  assert.ok(order.every((v, i) => v > 0 && (i === 0 || v > order[i - 1])), order.join(','));
  assert.doesNotMatch(html, /\b(review|reviews|rated|rating|stars?|testimonial|customers love|results|guaranteed|grow|engagement)\b/i);
  const body = html.replace(/<head>[\s\S]*<\/head>/, '').replace(/<!doctype[^>]*>/i, '').replace(/<!--[\s\S]*?-->/g, '');
  assert.doesNotMatch(body, /!|&amp;| & /, 'no exclamation marks, "and" never "&"');
});
```

- [ ] **Step 2: Run it to see it fail**

```bash
cd /c/Users/mythi/Claude/newtzmedia-site && node --test tests/site-page.test.js 2>&1 | grep -E "^ℹ (tests|pass|fail)"
```

Expected (the holding page has neither the head tags nor the hooks; `site.css` and `posts.css` do not exist yet):

```
ℹ tests 7
ℹ pass 2
ℹ fail 5
```

- [ ] **Step 3: Derive posts.css from the mockup copy**

Everything from the mockup-controls comment to the end of the file goes; three rules for real posts are appended (D8).

```bash
cd /c/Users/mythi/Claude/newtzmedia-site && sed '/^\/\* ---- mockup controls strip/,$d' mockups/posts.css > posts.css && printf '%s\n' '/* ---- real posts: a photo in the frame, and the business name linking to its profile ---- */' '.post__image { display: block; width: 100%; height: 100%; object-fit: cover; }' 'a.post__name { color: inherit; text-decoration: none; }' 'a.post__name:hover, a.post__name:focus-visible { text-decoration: underline; }' >> posts.css && wc -c posts.css; grep -c "mock-controls" posts.css
```

Expected: `4300 posts.css` then `0`.

- [ ] **Step 4: Write site.css**

Write tool, `site.css` (7,032 bytes). Its comment header must not contain the literal text `.post__` (the boundary test scans the whole file).

```css
/* site.css - the one stylesheet for newtzmedia.com: tokens, layout, tabs,
   cards and stamps. It never targets the post or art classes; those belong to
   posts.css (tests/site-page.test.js enforces it). Light only. */

:root {
  --paper: #FFFFFF;
  --band: #F7F6FA;
  --line: #E4E1EC;
  --muted: #5B5670;
  --ink: #17151C;
  --purple: #4B2A9E;
  --purple-deep: #3A1F7E;
  --swap-ms: 250;          /* gallery fade on a tab change; behavior.js reads it */
  --wrap: 72rem;
  --pad: 16px;
  color-scheme: light;
}
html.reduced-motion { --swap-ms: 0; }

*, *::before, *::after { box-sizing: border-box; }
html { -webkit-text-size-adjust: 100%; }
body {
  margin: 0;
  background: var(--paper);
  color: var(--ink);
  font-family: "Instrument Sans", system-ui, sans-serif;
  font-size: 1.0625rem;
  line-height: 1.6;
}
h1, h2, h3, p { margin: 0; }
h1, h2, h3 { line-height: 1.15; }
h1 { font-size: clamp(2rem, 1.2rem + 3vw, 3rem); font-weight: 700; letter-spacing: -0.02em; text-wrap: balance; }
h2 { font-size: 1.5rem; font-weight: 700; }
h3 { font-size: 1.0625rem; font-weight: 700; }
a { color: var(--purple); }
a:hover { color: var(--purple-deep); }
a, button {
  touch-action: manipulation;
  -webkit-tap-highlight-color: rgba(75, 42, 158, .2);
  transition: color 150ms ease, background-color 150ms ease, border-color 150ms ease;
}
html.reduced-motion a, html.reduced-motion button { transition: none; }
:focus-visible { outline: 2px solid var(--purple); outline-offset: 2px; }
.visually-hidden {
  position: absolute; width: 1px; height: 1px; margin: -1px; padding: 0; border: 0;
  overflow: hidden; clip: rect(0 0 0 0); clip-path: inset(50%); white-space: nowrap;
}

/* ---- skip link and header ---- */
.skip {
  position: absolute; left: 1rem; top: -4rem; z-index: 10;
  display: inline-flex; align-items: center; min-height: 44px; padding: .5rem .75rem;
  background: var(--purple); color: #fff; border-radius: 6px; text-decoration: none; font-weight: 600;
}
.skip:focus { top: 1rem; }
.site-head {
  display: flex; justify-content: space-between; align-items: center; gap: 1rem;
  max-width: var(--wrap); margin: 0 auto; padding: .75rem var(--pad);
}
.wordmark {
  font-family: "Gabarito", "Instrument Sans", system-ui, sans-serif;
  font-weight: 800; font-size: 1.25rem; letter-spacing: -0.02em;
  color: var(--ink); text-decoration: none;
  display: inline-flex; align-items: center; min-height: 44px;
}
.wordmark:hover { color: var(--purple); }
.site-head__contact {
  display: inline-flex; align-items: center; min-height: 44px; padding: 0 .25rem;
  font-weight: 600; text-decoration: none;
}
.site-head__contact:hover { text-decoration: underline; }

/* ---- sections: full-width bands, content held at --wrap ---- */
main > section, .site-foot { padding: 3rem var(--pad); border-top: 1px solid var(--line); }
.wrap { max-width: var(--wrap); margin: 0 auto; }
.intro { border-top: 0; padding-top: 1.5rem; }
.intro__line { margin-top: 1rem; font-size: 1.125rem; max-width: 40rem; }
.intro__note { margin-top: .75rem; color: var(--muted); font-size: .8125rem; font-weight: 600; max-width: 40rem; }
.subline { margin-top: .5rem; color: var(--muted); font-size: .8125rem; font-weight: 600; }
.gallery-section--band { background: var(--band); }
@media (min-width: 640px) {
  main > section, .site-foot { padding-top: 4rem; padding-bottom: 4rem; }
  .intro { padding-top: 2.5rem; }
}

/* ---- tab rows: 5px padding and -5px margin so focus rings never clip in the scroll box ---- */
.tabs { display: flex; gap: 1.5rem; overflow-x: auto; scrollbar-width: none; padding: 5px; margin: -5px; scroll-padding: 5px; }
.tabs::-webkit-scrollbar { display: none; }
.tabs[hidden] { display: none; }
.tabs--business { margin-top: calc(1.25rem - 5px); }
.tabs--platform { gap: .5rem; margin-top: calc(1rem - 5px); margin-bottom: calc(1.5rem - 5px); }
.tab {
  appearance: none; background: none; border: 0; border-bottom: 2px solid transparent;
  color: var(--muted); font: inherit; font-weight: 600; padding: .5rem 0; min-height: 44px;
  cursor: pointer; white-space: nowrap;
}
.tab:hover { color: var(--ink); }
.tab[aria-selected="true"] { color: var(--ink); border-bottom-color: var(--purple); }
/* platform pills */
.tabs--platform .tab {
  border: 1px solid var(--line); border-radius: 999px; padding: .4rem .9rem;
  font-size: .9375rem; color: var(--ink);
}
.tabs--platform .tab:hover { border-color: var(--purple); color: var(--purple); }
.tabs--platform .tab[aria-selected="true"] { background: var(--purple); border-color: var(--purple); color: #fff; }
.tabs--platform .tab[aria-selected="true"]:hover { background: var(--purple-deep); border-color: var(--purple-deep); color: #fff; }

/* ---- gallery grid: 1, 2, 3 columns ---- */
.gallery {
  display: grid; grid-template-columns: minmax(0, 1fr); gap: 1.5rem; align-items: start;
  transition: opacity calc(var(--swap-ms) * 1ms) ease;
}
.gallery.is-swapping { opacity: 0; }
html.reduced-motion .gallery { transition: none; }
.gallery__empty, .gallery__nojs { color: var(--muted); font-size: .8125rem; font-weight: 600; }
@media (min-width: 640px) { .gallery { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (min-width: 1024px) { .gallery { grid-template-columns: repeat(3, minmax(0, 1fr)); } }

/* ---- cards and the stamp (the signature) ---- */
.card {
  display: flex; flex-direction: column;
  background: var(--paper); border: 1px solid var(--line); border-radius: 12px; overflow: hidden;
}
.stamp {
  display: flex; align-items: center; gap: .35rem;
  min-height: 2.75rem; margin-top: auto; padding: .5rem .75rem;
  border-top: 1px solid var(--line);
  font-size: .8125rem; font-weight: 600; line-height: 1.3;
}
.stamp--posted { color: var(--purple); text-decoration: none; }
.stamp--posted:hover, .stamp--posted:focus-visible { color: var(--purple-deep); text-decoration: underline; }
.stamp--concept { color: var(--muted); }

/* ---- how it works: a real sequence, so the numbers are counters ---- */
.steps { list-style: none; margin: 1.5rem 0 0; padding: 0; counter-reset: step; display: grid; gap: 1.5rem; }
.step { position: relative; padding-left: 2.5rem; }
.step::before {
  counter-increment: step; content: counter(step);
  position: absolute; left: 0; top: 0; width: 1.75rem; height: 1.75rem; border-radius: 50%;
  background: var(--purple); color: #fff; font-weight: 700; font-size: .875rem;
  display: grid; place-items: center;
}
.step p { margin-top: .25rem; color: var(--muted); }
@media (min-width: 640px) { .steps { grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 2rem; } }

/* ---- about, contact, footer ---- */
.about p { margin-top: 1rem; max-width: 40rem; }
.contact__line { margin-top: 1rem; max-width: 40rem; }
.contact__links { display: flex; flex-wrap: wrap; gap: .5rem 1.5rem; margin-top: .5rem; }
.contact__link { display: inline-flex; align-items: center; min-height: 44px; font-weight: 600; }
.site-foot { color: var(--muted); font-size: .875rem; }
.foot__note { max-width: 40rem; }
.foot__line { margin-top: 1rem; }
```

- [ ] **Step 5: Write index.html, replacing the holding page**

Write tool, `index.html` (5,479 bytes). The static blocks are the renderer output of Task 2, pasted; the parity test checks them.

```html
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>NewtzMedia: social media posts for local businesses</title>
<meta name="description" content="Social media posts for local small businesses, made and posted for a monthly fee. See real posts, live on the platform.">
<meta property="og:type" content="website">
<meta property="og:title" content="NewtzMedia: social media posts for local businesses">
<meta property="og:description" content="Social media posts for local small businesses, made and posted for a monthly fee. See real posts, live on the platform.">
<meta property="og:image" content="https://newtzmedia.com/og.png">
<meta property="og:url" content="https://newtzmedia.com/">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#4B2A9E">
<link rel="icon" href="favicon.svg" type="image/svg+xml">
<link rel="icon" href="favicon-32.png" sizes="32x32" type="image/png">
<link rel="apple-touch-icon" href="apple-touch-icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Gabarito:wght@500;800&family=Instrument+Sans:wght@400;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="posts.css">
<link rel="stylesheet" href="site.css">
</head>
<body>
<a class="skip" href="#posted">Skip to the work</a>

<header class="site-head">
  <a class="wordmark" href="#top" translate="no">NewtzMedia</a>
  <a class="site-head__contact" href="#contact">Contact</a>
</header>

<main id="top">
  <section class="intro" aria-labelledby="intro-h">
    <div class="wrap">
      <h1 id="intro-h">Your business, posted.</h1>
      <p class="intro__line">Social media posts for local small businesses, made and posted for a monthly fee.</p>
      <p class="intro__note">Where it says posted below, the post is live on the platform and the stamp links to it.</p>
    </div>
  </section>

  <!-- The two galleries are rendered by behavior.js from content.js. Without
       JavaScript each shows the one line below. -->
  <section class="gallery-section" id="posted" aria-labelledby="posted-h">
    <div class="wrap">
      <h2 id="posted-h">Posted</h2>
      <p class="subline" data-subline>Real posts, live where they went up. Tap one to see it there.</p>
      <div class="tabs tabs--business" role="tablist" aria-label="Business" data-business-tabs hidden></div>
      <div class="tabs tabs--platform" role="tablist" aria-label="Platform" data-platform-tabs hidden></div>
      <div class="gallery" id="posted-gallery" role="tabpanel" data-gallery>
        <p class="gallery__nojs">Turn on JavaScript to browse the posts.</p>
      </div>
    </div>
  </section>

  <section class="gallery-section gallery-section--band" id="concepts" aria-labelledby="concepts-h">
    <div class="wrap">
      <h2 id="concepts-h">Concepts for other businesses</h2>
      <p class="subline" data-subline>Invented businesses, made to show the range. Nothing here was posted.</p>
      <div class="tabs tabs--business" role="tablist" aria-label="Business" data-business-tabs hidden></div>
      <div class="tabs tabs--platform" role="tablist" aria-label="Platform" data-platform-tabs hidden></div>
      <div class="gallery" id="concepts-gallery" role="tabpanel" data-gallery>
        <p class="gallery__nojs">Turn on JavaScript to browse the posts.</p>
      </div>
    </div>
  </section>

  <!-- The static sections below equal the logic.js renderers word for word;
       tests/site-page.test.js fails when they drift from content.js. -->
  <section class="how" id="how" aria-labelledby="how-h">
    <div class="wrap">
      <h2 id="how-h">How it works</h2>
      <ol class="steps" data-static="steps">
        <li class="step"><h3>We talk</h3><p>A short call about your business and who you want walking in.</p></li>
        <li class="step"><h3>I draft, you approve</h3><p>You see every post before it goes up. Change anything.</p></li>
        <li class="step"><h3>They go out</h3><p>Posted for you on a steady schedule, agreed on the call.</p></li>
      </ol>
    </div>
  </section>

  <section class="about" id="about" aria-labelledby="about-h">
    <div class="wrap">
      <h2 id="about-h">About</h2>
      <p data-static="about">I’m Zack Newtz. I run the social media accounts for NFTek, my family’s cloud and AI automation company. NewtzMedia grew out of that: the same work, for local businesses that have nobody to do it.</p>
    </div>
  </section>

  <section class="contact" id="contact" aria-labelledby="contact-h">
    <div class="wrap">
      <h2 id="contact-h">Contact</h2>
      <div data-static="contact">
        <p class="contact__line">Tell me about your business and I’ll reply within a day.</p>
        <p class="contact__links"><a class="contact__link" href="mailto:zack@newtzmedia.com">zack@newtzmedia.com</a></p>
      </div>
    </div>
  </section>
</main>

<footer class="site-foot">
  <div class="wrap" data-static="footer">
    <p class="foot__note">Concept samples are invented businesses shown to demonstrate the work. Nothing labeled concept was posted. Posted work links to the live post.</p>
    <p class="foot__line">NewtzMedia, 2026</p>
  </div>
</footer>

<script src="content.js"></script>
<script src="logic.js"></script>
<script src="behavior.js"></script>
</body>
</html>
```

- [ ] **Step 6: Run the page tests, then the whole suite**

```bash
cd /c/Users/mythi/Claude/newtzmedia-site && node --test tests/site-page.test.js 2>&1 | grep -E "^ℹ (tests|pass|fail)" && node --test "tests/*.test.js" 2>&1 | grep -E "^ℹ (tests|pass|fail)"
```

Expected:

```
ℹ tests 7
ℹ pass 7
ℹ fail 0
ℹ tests 68
ℹ pass 68
ℹ fail 0
```

- [ ] **Step 7: Add the preview entry to the repo's launch.json**

The Claude app reads `.claude/launch.json` from its project root. The repo copy gets the entry here; the session copy at `C:/Users/mythi/Claude/.claude/launch.json` already has one with the same name and port. The snippet adds the entry only when it is missing (JSON.stringify re-indents the existing mockups entry; that is fine).

```bash
cd /c/Users/mythi/Claude/newtzmedia-site && node -e "
const fs = require('fs'); const f = '.claude/launch.json';
const j = JSON.parse(fs.readFileSync(f, 'utf8'));
if (!j.configurations.some((c) => c.name === 'newtzmedia-site')) {
  j.configurations.unshift({ name: 'newtzmedia-site', runtimeExecutable: 'python',
    runtimeArgs: ['-m', 'http.server', '8765', '--bind', '127.0.0.1', '--directory', 'C:/Users/mythi/Claude/newtzmedia-site'],
    cwd: 'C:/Users/mythi/Claude/newtzmedia-site', port: 8765 });
  fs.writeFileSync(f, JSON.stringify(j, null, 2) + '\n');
}
console.log(j.configurations.map((c) => c.name).join(' '));" && node -e "JSON.parse(require('fs').readFileSync('.claude/launch.json','utf8')); console.log('valid json')"
```

Expected: `newtzmedia-site newtzmedia-mockups` then `valid json`.

- [ ] **Step 8: Commit**

```bash
cd /c/Users/mythi/Claude/newtzmedia-site && git add tests/site-page.test.js posts.css site.css index.html .claude/launch.json && git commit -q -F - <<'EOF'
Add the page, its stylesheets and the page tests

index.html replaces the holding page on this branch: the spec head, the
skip link, header, intro, the two gallery sections with their hooks and
the no-JS line, and static copies of How it works, About, Contact and the
footer that a test keeps equal to the renderers. posts.css is the mockup
file minus the controls strip plus the real-post rules; site.css is new
and never targets a post class. The preview entry newtzmedia-site serves
the repo root on 8765.

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>
EOF
git log -1 --format=%B | grep -c "^Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>$"
```

Expected: `1`.

---

### Task 5: behavior.js and the eight browser checks

**Files:**
- Create: `behavior.js`

**Interfaces:**
- Consumes: `NEWTZ_CONTENT`, and from `NEWTZ_LOGIC`: `isEmpty`, `businessesOfKind`, `platformsFor`, `renderBusinessTabs`, `renderPlatformTabs`, `renderGallery`; the DOM hooks of Task 4.
- Produces: `globalThis.NEWTZ_APP = { state, selectBusiness(section, businessId), selectPlatform(section, platformId), tablistKeys(list, onPick), motionOk() }`, where `state` is `{ posted: {business, platform}, concepts: {business, platform} }` and `section` is `'posted'` or `'concepts'`. The checks below call these. Also the `js` class on `html` and the `reduced-motion` class when the media query matches.

`behavior.js` is DOM code, so it has no Node test; the eight checks of spec section 10 are its tests, run on the served page. Follow the Verification protocol above.

- [ ] **Step 1: Write behavior.js**

```bash
cd /c/Users/mythi/Claude/newtzmedia-site && cat > behavior.js <<'EOF'
// behavior.js - DOM wiring for the two galleries. Everything it inserts comes
// from NEWTZ_LOGIC; this file only reads the page, swaps HTML and listens to
// events. The static sections (steps, about, contact, footer) are already in
// index.html and are not touched here.
(function () {
  'use strict';
  const L = globalThis.NEWTZ_LOGIC;
  const root = document.documentElement;
  root.classList.add('js'); // any JS-dependent style keys off this

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

  // ---- one state per gallery section: 'posted' shows kind 'posted',
  // 'concepts' shows kind 'concept'. The first business and its first platform
  // with pieces start selected.
  function initial(kind) {
    const b = L.businessesOfKind(kind)[0];
    if (!b) return { business: null, platform: null };
    return { business: b.id, platform: L.platformsFor(b.id)[0] || null };
  }
  const state = { posted: initial('posted'), concepts: initial('concept') };

  function parts(section) {
    const el = document.getElementById(section);
    return {
      subline: el.querySelector('[data-subline]'),
      btabs: el.querySelector('[data-business-tabs]'),
      ptabs: el.querySelector('[data-platform-tabs]'),
      gallery: el.querySelector('[data-gallery]'),
    };
  }

  function render(section, animate) {
    const s = state[section];
    const p = parts(section);
    if (L.isEmpty(section)) {
      // spec 4.4: the subline gives way to the one honest line; nothing else renders
      p.subline.hidden = true;
      p.btabs.innerHTML = '';
      p.ptabs.innerHTML = '';
      p.btabs.hidden = true;
      p.ptabs.hidden = true;
      p.gallery.innerHTML = L.renderGallery(section, s);
      return;
    }
    p.subline.hidden = false;
    const btabs = L.renderBusinessTabs(section, s.business);
    p.btabs.innerHTML = btabs;
    p.btabs.hidden = btabs === ''; // fewer than two businesses: no business row
    p.ptabs.innerHTML = L.renderPlatformTabs(section, s.business, s.platform);
    p.ptabs.hidden = false;
    p.gallery.setAttribute('aria-labelledby',
      (btabs ? section + '-btab-' + s.business + ' ' : '') + section + '-ptab-' + s.platform);
    const html = L.renderGallery(section, s);
    const ms = animate ? swapMs() : 0;
    if (ms === 0) { p.gallery.innerHTML = html; return; }
    p.gallery.classList.add('is-swapping');
    setTimeout(() => {
      p.gallery.innerHTML = html;
      p.gallery.classList.remove('is-swapping');
    }, ms);
  }

  function selectBusiness(section, id) {
    state[section].business = id;
    state[section].platform = L.platformsFor(id)[0] || null; // the platform resets with the business
    render(section, true);
  }
  function selectPlatform(section, id) {
    state[section].platform = id;
    render(section, true);
  }

  // Arrow keys move between tabs and activate the focused one. The tabs are
  // re-rendered on activation, so focus is restored by id afterwards and the
  // fresh tab is scrolled into the row's visible box.
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
      if (fresh) {
        fresh.focus();
        fresh.scrollIntoView({ block: 'nearest', inline: 'nearest' });
      }
    });
  }

  ['posted', 'concepts'].forEach((section) => {
    const p = parts(section);
    p.btabs.addEventListener('click', (e) => {
      const b = e.target.closest('[data-business]');
      if (b) selectBusiness(section, b.dataset.business);
    });
    p.ptabs.addEventListener('click', (e) => {
      const b = e.target.closest('[data-platform]');
      if (b) selectPlatform(section, b.dataset.platform);
    });
    tablistKeys(p.btabs, (b) => selectBusiness(section, b.dataset.business));
    tablistKeys(p.ptabs, (b) => selectPlatform(section, b.dataset.platform));
    render(section, false);
  });

  globalThis.NEWTZ_APP = { state, selectBusiness, selectPlatform, tablistKeys, motionOk };
})();
EOF
wc -c behavior.js && node --check behavior.js && node --test "tests/*.test.js" 2>&1 | grep -E "^ℹ (pass|fail)"
```

Expected: `4869 behavior.js`, no syntax error, `ℹ pass 68` and `ℹ fail 0`.

- [ ] **Step 2: Serve the page and force a frame**

`preview_start {name: "newtzmedia-site"}`, then protocol steps 2 and 3. Expected: `visible 1280x900` and `No console logs.` (check 1 and the setup of check 8).

- [ ] **Step 3: Check A, load state (checks 2 and 8)**

```js
(() => { const r = {}; r.vis = document.visibilityState + ' ' + innerWidth + 'x' + innerHeight; r.js = document.documentElement.classList.contains('js'); r.nojsLines = document.querySelectorAll('.gallery__nojs').length; r.postedText = document.querySelector('#posted-gallery').textContent.trim(); r.postedSubHidden = document.querySelector('#posted [data-subline]').hidden; r.postedRowsHidden = [document.querySelector('#posted [data-business-tabs]').hidden, document.querySelector('#posted [data-platform-tabs]').hidden]; const cg = document.querySelector('#concepts-gallery'); r.conceptCards = cg.querySelectorAll('.card').length; r.conceptLinks = cg.querySelectorAll('a').length; r.conceptStamps = [...new Set([...cg.querySelectorAll('.stamp')].map(s => s.textContent))]; r.btabs = [...document.querySelectorAll('#concepts [data-business-tabs] [role=tab]')].map(t => t.id + ':' + t.getAttribute('aria-selected')); r.ptabs = [...document.querySelectorAll('#concepts [data-platform-tabs] [role=tab]')].map(t => t.id + ':' + t.getAttribute('aria-selected')); r.labelledby = cg.getAttribute('aria-labelledby'); r.state = JSON.stringify(NEWTZ_APP.state); r.swapMs = getComputedStyle(document.documentElement).getPropertyValue('--swap-ms').trim(); r.fonts = [getComputedStyle(document.body).fontFamily, getComputedStyle(document.querySelector('.wordmark')).fontFamily]; r.h1 = getComputedStyle(document.querySelector('h1')).fontSize; r.cols = getComputedStyle(cg).gridTemplateColumns.split(' ').length; return r; })()
```

Expected: `vis` "visible 1280x900"; `js` true; `nojsLines` 0; `postedText` "First posts go live soon."; `postedSubHidden` true; `postedRowsHidden` [true, true]; `conceptCards` 3; `conceptLinks` 0; `conceptStamps` ["Concept · not posted"]; `btabs` ["concepts-btab-brewhaus:true", "concepts-btab-ironworks:false", "concepts-btab-aceauto:false"]; `ptabs` ["concepts-ptab-instagram:true", "concepts-ptab-facebook:false"]; `labelledby` "concepts-btab-brewhaus concepts-ptab-instagram"; `state` posted {business "nftek", platform null}, concepts {business "brewhaus", platform "instagram"}; `swapMs` "250"; `fonts` start with "Instrument Sans" and "Gabarito"; `h1` "48px"; `cols` 3.

- [ ] **Step 4: Check B, switching (check 2)**

```js
(async () => { NEWTZ_APP.selectBusiness('concepts', 'ironworks'); await new Promise(r => setTimeout(r, 400)); const a = { state: JSON.stringify(NEWTZ_APP.state.concepts), cards: document.querySelectorAll('#concepts-gallery .card').length, sel: [...document.querySelectorAll('#concepts [role=tab][aria-selected="true"]')].map(t => t.id), pills: [...document.querySelectorAll('#concepts [data-platform-tabs] [role=tab]')].map(t => t.id) }; NEWTZ_APP.selectPlatform('concepts', 'x'); await new Promise(r => setTimeout(r, 400)); const b = { state: JSON.stringify(NEWTZ_APP.state.concepts), cards: document.querySelectorAll('#concepts-gallery .card').length, frames: [...new Set([...document.querySelectorAll('#concepts-gallery .post__frame')].map(f => f.className))], sel: [...document.querySelectorAll('#concepts [role=tab][aria-selected="true"]')].map(t => t.id), labelledby: document.querySelector('#concepts-gallery').getAttribute('aria-labelledby'), swapping: document.querySelector('#concepts-gallery').classList.contains('is-swapping') }; return { afterBusiness: a, afterPlatform: b }; })()
```

Expected: `afterBusiness` cards 3, pills ["concepts-ptab-instagram", "concepts-ptab-facebook", "concepts-ptab-x"], sel ["concepts-btab-ironworks", "concepts-ptab-instagram"]; `afterPlatform` cards 2, frames ["post__frame post__frame--16x9"], sel ["concepts-btab-ironworks", "concepts-ptab-x"], labelledby "concepts-btab-ironworks concepts-ptab-x", swapping false.

- [ ] **Step 5: Check C, a posted piece injected as a fixture (check 4)**

The real posted piece arrives in Task 8; this fixture exercises the posted path now. Do not reload before check G: G measures this stamp.

```js
(async () => { const C = NEWTZ_CONTENT; C.businesses[0].profiles = { linkedin: 'https://www.linkedin.com/company/nfteks', x: 'https://x.com/nfteks' }; C.pieces.unshift({ id: 'fx-1', business: 'nftek', platforms: ['linkedin', 'x'], format: '1x1', headline: '', caption: 'Fixture post text, as published.', hashtags: [], date: '2026-10-03', urls: { linkedin: 'https://www.linkedin.com/posts/nfteks_1', x: 'https://x.com/nfteks/status/1' } }); NEWTZ_APP.selectBusiness('posted', 'nftek'); await new Promise(r => setTimeout(r, 400)); const g = document.querySelector('#posted-gallery'); const a = g.querySelector('a.stamp'); const p = g.querySelector('a.post__name'); return { subHidden: document.querySelector('#posted [data-subline]').hidden, btabsHidden: document.querySelector('#posted [data-business-tabs]').hidden, ptabsHidden: document.querySelector('#posted [data-platform-tabs]').hidden, cards: g.querySelectorAll('.card').length, stamp: a && [a.textContent, a.target, a.rel, a.href, a.getBoundingClientRect().height.toFixed(1)], profile: p && [p.href, p.target, p.rel], pills: [...document.querySelectorAll('#posted [data-platform-tabs] [role=tab]')].map(t => t.id + ':' + t.getAttribute('aria-selected')), state: JSON.stringify(NEWTZ_APP.state.posted), art: g.querySelectorAll('.art, .post__frame').length, emptyLine: g.querySelectorAll('.gallery__empty').length, meta: g.querySelector('.post__meta').textContent }; })()
```

Expected: `subHidden` false; `btabsHidden` true; `ptabsHidden` false; `cards` 1; `stamp` ["Posted to LinkedIn · 3 Oct 2026 · See it live (opens in a new tab) ↗", "_blank", "noopener noreferrer", "https://www.linkedin.com/posts/nfteks_1", "44.0"]; `profile` ["https://www.linkedin.com/company/nfteks", "_blank", "noopener noreferrer"]; `pills` ["posted-ptab-linkedin:true", "posted-ptab-x:false"]; `state` {business "nftek", platform "linkedin"}; `art` 0; `emptyLine` 0; `meta` "Cloud and AI automation consulting · 3 Oct 2026".

- [ ] **Step 6: Check D, contrast (check 6)**

```js
(() => { const lum = (c) => { const m = c.match(/\d+(\.\d+)?/g).map(Number); const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(m[0]) + 0.7152 * f(m[1]) + 0.0722 * f(m[2]); }; const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return +((x + 0.05) / (y + 0.05)).toFixed(2); }; const bg = (el) => { let e = el; while (e) { const c = getComputedStyle(e).backgroundColor; if (c && c !== 'rgba(0, 0, 0, 0)' && c !== 'transparent') return c; e = e.parentElement; } return 'rgb(255, 255, 255)'; }; const pick = (sel) => { const el = document.querySelector(sel); return el ? ratio(getComputedStyle(el).color, bg(el)) : 'missing'; }; return { body: pick('.intro__line'), muted: pick('.intro__note'), sublineOnBand: pick('#concepts .subline'), conceptStampOnBand: pick('#concepts .stamp--concept'), postedStamp: pick('.stamp--posted'), activePill: pick('.tabs--platform .tab[aria-selected="true"]'), inactivePill: pick('.tabs--platform .tab[aria-selected="false"]'), businessTab: pick('.tabs--business .tab[aria-selected="false"]'), activeBusinessTab: pick('.tabs--business .tab[aria-selected="true"]'), contactLink: pick('.contact__link'), headContact: pick('.site-head__contact'), stepBody: pick('.step p'), whiteOnPurple: ratio('rgb(255, 255, 255)', 'rgb(75, 42, 158)'), purpleOnBand: ratio('rgb(75, 42, 158)', 'rgb(247, 246, 250)'), foot: pick('.foot__note') }; })()
```

Expected, every value at or above 4.5 and none "missing": body 18.1, muted 6.98, sublineOnBand 6.48, conceptStampOnBand 6.98, postedStamp 9.89, activePill 9.89, inactivePill 18.1, businessTab 6.48, activeBusinessTab 16.82, contactLink 9.89, headContact 9.89, stepBody 6.98, whiteOnPurple 9.89, purpleOnBand 9.19, foot 6.98.

- [ ] **Step 7: Check E, reduced motion through the class (check 7, D9)**

```js
(() => { const root = document.documentElement; root.classList.add('reduced-motion'); const r = { swapMs: getComputedStyle(root).getPropertyValue('--swap-ms').trim(), motionOk: NEWTZ_APP.motionOk(), galleryTransition: getComputedStyle(document.querySelector('#concepts-gallery')).transitionDuration, tabTransition: getComputedStyle(document.querySelector('.tab')).transitionDuration }; root.classList.remove('reduced-motion'); r.afterRemove = [getComputedStyle(root).getPropertyValue('--swap-ms').trim(), getComputedStyle(document.querySelector('#concepts-gallery')).transitionDuration, getComputedStyle(document.querySelector('.tab')).transitionDuration]; r.mediaMatches = matchMedia('(prefers-reduced-motion: reduce)').matches; return r; })()
```

Expected: `swapMs` "0"; `motionOk` false; `galleryTransition` "0s"; `tabTransition` "0s"; `afterRemove` ["250", "0.25s", "0.15s, 0.15s, 0.15s"]; `mediaMatches` false.

- [ ] **Step 8: Check F, keyboard (check 3)**

Four sub-steps, each a `javascript_tool` call, with the key presses through `computer {action: "key", text: "..."}` between them.

1. Focus a pill:

```js
(async () => { NEWTZ_APP.selectBusiness('concepts', 'ironworks'); await new Promise(r => setTimeout(r, 400)); document.getElementById('concepts-ptab-instagram').focus(); return document.activeElement.id; })()
```

Expected: "concepts-ptab-instagram".

2. `computer {action: "key", text: "End"}`, then:

```js
(async () => { await new Promise(r => setTimeout(r, 400)); const el = document.activeElement; const row = el.closest('.tabs'); const rr = row.getBoundingClientRect(), er = el.getBoundingClientRect(); return { active: el.id, selected: el.getAttribute('aria-selected'), inRow: er.left >= rr.left - 0.5 && er.right <= rr.right + 0.5, state: JSON.stringify(NEWTZ_APP.state.concepts), cards: document.querySelectorAll('#concepts-gallery .card').length }; })()
```

Expected: `active` "concepts-ptab-x", `selected` "true", `inRow` true, `state` {business "ironworks", platform "x"}, `cards` 2.

3. `computer {action: "key", text: "Home"}`, then the same snippet. Expected: `active` "concepts-ptab-instagram", `selected` "true", `inRow` true, `state` {ironworks, instagram}, `cards` 3.

4. `computer {action: "key", text: "ArrowRight"}`, then the same snippet. Expected: `active` "concepts-ptab-facebook", `selected` "true", `inRow` true, `state` {ironworks, facebook}, `cards` 3.

- [ ] **Step 9: Check G, 375px (check 5)**

`resize_window {preset: "mobile"}`, then:

```js
(() => { const named = { wordmark: '.wordmark', headContact: '.site-head__contact', businessTab: '.tabs--business .tab', pill: '.tabs--platform .tab', postedStamp: '.stamp--posted', contactLink: '.contact__link', skip: '.skip' }; const heights = {}; for (const [k, s] of Object.entries(named)) { const els = [...document.querySelectorAll(s)]; heights[k] = els.length ? +Math.min(...els.map(e => e.getBoundingClientRect().height)).toFixed(1) : 'none'; } const rows = [...document.querySelectorAll('.tabs:not([hidden])')].map(r => ({ id: r.closest('section').id + ' ' + r.className.split(' ')[1], scrollW: r.scrollWidth, clientW: r.clientWidth })); return { w: innerWidth, scrollW: document.documentElement.scrollWidth, cols: getComputedStyle(document.querySelector('#concepts-gallery')).gridTemplateColumns.split(' ').length, h1: getComputedStyle(document.querySelector('h1')).fontSize, heights, rows, sectionPad: getComputedStyle(document.querySelector('#posted')).paddingTop }; })()
```

Expected: `w` 375; `scrollW` 375 (never above `w`); `cols` 1; `h1` "32px"; `heights` every value a number at or above 44 and none "none" (observed: wordmark 44, headContact 44, businessTab 45.2, pill 44, postedStamp 44, contactLink 44, skip 44); `rows`: the concepts business row may scroll (observed scrollW 390 over clientW 353), the pill rows fit; `sectionPad` "48px".

- [ ] **Step 10: Console again, then reset**

`read_console_messages {onlyErrors: true}` -> `No console logs.` Then `resize_window {preset: "desktop"}` and `preview_stop`.

- [ ] **Step 11: Commit**

```bash
cd /c/Users/mythi/Claude/newtzmedia-site && git add behavior.js && git commit -q -F - <<'EOF'
Add the gallery behavior

behavior.js wires the two galleries and nothing else: state per section,
business tabs and platform pills rendered by logic.js, a fade swap that
respects reduced motion, and Arrow, Home and End on each tab row. The
eight browser checks of spec section 10 pass on the served page.

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>
EOF
git log -1 --format=%B | grep -c "^Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>$"
```

Expected: `1`.

**Stop here for Zack's review**: the site is complete apart from the gate and the README. Report the check results as returned text and deviations D3, D5, D7, D8 and D9, now in code. He can open `http://localhost:8765/` himself with the preview entry.

---

### Task 6: The launch gate and the README

**Files:**
- Create: `tests/launch-gate.js`
- Replace: `README.md`

**Interfaces:**
- Consumes: `NEWTZ_CONTENT` (Task 1), `index.html` (Task 4).
- Produces: `node tests/launch-gate.js`, exit 0 with `LAUNCH GATE: ready (N posted piece(s))` or exit 1 listing every failure. Task 8 runs it before the merge. It is not a `*.test.js` file, so the test glob leaves it alone.

- [ ] **Step 1: Write the gate**

```bash
cd /c/Users/mythi/Claude/newtzmedia-site && cat > tests/launch-gate.js <<'EOF'
// launch-gate.js - the refusal that keeps a half-ready site off newtzmedia.com.
// Not a test file: run `node tests/launch-gate.js` from the repo root on the
// branch before merging. Exit 0 means ready; otherwise every failure is listed.
const fs = require('node:fs');
const path = require('node:path');
require('../content.js');
const C = globalThis.NEWTZ_CONTENT;
const ROOT = path.join(__dirname, '..');
const byId = (id) => C.businesses.find((b) => b.id === id);
const fails = [];

if (!C.pieces.some((p) => byId(p.business).kind === 'posted')) {
  fails.push('no posted piece: NFTek needs at least one real post with a date and its live URL');
}
if (!/^\+1\d{10}$/.test(C.contact.phone)) {
  fails.push('contact.phone must be +1 and ten digits, got ' + JSON.stringify(C.contact.phone));
}
if (!C.contact.phoneDisplay) fails.push('contact.phoneDisplay is empty');
if (C.contact.email !== 'zack@newtzmedia.com') fails.push('contact.email is ' + JSON.stringify(C.contact.email));
for (const b of C.businesses.filter((x) => x.kind === 'posted')) {
  for (const pl of b.platforms) {
    if (!/^https:\/\//.test((b.profiles || {})[pl] || '')) fails.push(b.id + ': no https profile URL for ' + pl);
  }
}
if (/noindex/i.test(fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8'))) fails.push('index.html still carries a noindex directive');

if (fails.length) {
  console.error('LAUNCH GATE: not ready');
  for (const f of fails) console.error(' - ' + f);
  process.exit(1);
}
console.log('LAUNCH GATE: ready (' + C.pieces.filter((p) => byId(p.business).kind === 'posted').length + ' posted piece(s))');
EOF
wc -c tests/launch-gate.js && node --check tests/launch-gate.js
```

Expected: `1605 tests/launch-gate.js`, no syntax error.

- [ ] **Step 2: Run it and see it refuse**

```bash
cd /c/Users/mythi/Claude/newtzmedia-site && node tests/launch-gate.js; echo "exit $?"
```

Expected, exactly (this is correct until Task 8 supplies the content):

```
LAUNCH GATE: not ready
 - no posted piece: NFTek needs at least one real post with a date and its live URL
 - contact.phone must be +1 and ten digits, got ""
 - contact.phoneDisplay is empty
 - nftek: no https profile URL for linkedin
 - nftek: no https profile URL for x
exit 1
```

- [ ] **Step 3: Rewrite the README**

```bash
cd /c/Users/mythi/Claude/newtzmedia-site && cat > README.md <<'EOF'
# NewtzMedia website

The site at https://newtzmedia.com: social media posts for local small
businesses, made and posted for a monthly fee. Plain HTML, CSS and JavaScript,
no framework, no build step, no packages. GitHub Pages serves the repo root of
`main`; `CNAME` and `.nojekyll` are part of that.

## Files

- `index.html`: the one page. The How it works, About, Contact and footer
  sections are static copies of what `logic.js` renders (a test keeps them
  equal), so the page reads with JavaScript off.
- `content.js`: every word and every sample post. The only file that changes
  when a post goes live.
- `logic.js`: selectors and HTML renderers, no DOM. `behavior.js`: the two
  galleries' tabs and swaps.
- `site.css`: tokens, layout, tabs, cards, stamps. `posts.css`: the inside of
  a post only. `site.css` never targets a post class.
- `favicon.svg`, `favicon-32.png`, `apple-touch-icon.png`, `og.png`: the mark.
- `images/`: real post images, web-sized (at most 1600px wide, JPEG or PNG).
- `mockups/`: the two design-direction mockups the site was built from. History; their tests still run.
- `tests/`: Node tests (`site-*.test.js` for the site, the rest for the mockups) and the launch gate.
- `docs/superpowers/`: specs and plans.

## Serve and test

    python -m http.server 8765

then open http://localhost:8765/. Google Fonts load from the network; without it
the page falls back to system fonts.

    node --test "tests/*.test.js"

Node 24, no packages.

## Add a real post

1. Put the image, if any, in `images/` (at most 1600px wide).
2. Add a piece to `pieces` in `content.js` under the posted business, in the
   shape shown in the comment there: `date` as `YYYY-MM-DD`, one `https://`
   URL per platform in `urls`, the text exactly as published in `caption`.
3. Run the tests. They refuse a missing image, a wrong date, a URL off the
   platform's host, and a concept piece with a link.
4. Commit `content.js` and the image, push `main`. GitHub Pages redeploys.

## Launch gate

    node tests/launch-gate.js

Exit 0 means the content is complete enough to publish: at least one posted
piece, the phone number and its display form, the email, a profile URL for
every platform of every posted business, no `noindex`.

## Regenerate the mark's PNGs

Pillow lives in a scratchpad virtual environment, never in the repo:

    <venv>/Scripts/python.exe tools/make_assets.py

`favicon.svg` is written by hand with the same geometry.
EOF
wc -c README.md && node --test "tests/*.test.js" 2>&1 | grep -E "^ℹ (tests|pass|fail)"
```

Expected: `2457 README.md`, then `ℹ tests 68`, `ℹ pass 68`, `ℹ fail 0` (the gate is not picked up by the glob).

- [ ] **Step 4: Commit**

```bash
cd /c/Users/mythi/Claude/newtzmedia-site && git add tests/launch-gate.js README.md && git commit -q -F - <<'EOF'
Add the launch gate and rewrite the README for the real site

node tests/launch-gate.js refuses (exit 1, every failure listed) until at
least one posted piece exists, the phone and its display form are set, the
email is the real one, every posted business has a profile URL per
platform and index.html carries no noindex. The README says how to serve,
test, add a real post, run the gate and regenerate the mark.

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>
EOF
git log -1 --format=%B | grep -c "^Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>$"
```

Expected: `1`.

---

### Task 7: Web Interface Guidelines review

**Files:**
- Modify: any of `index.html`, `site.css`, `posts.css`, `behavior.js`, as the review finds. Not `content.js`: the copy is spec section 4 verbatim, so a copy finding is reported to Zack, not applied.

**Interfaces:**
- Consumes: everything built so far. Produces: the reviewed site, still passing every test and every browser check.

The mockups went through this same review on 2026-09-25 (their plan's Task 10), and the site reuses their post templates, so expect few findings.

- [ ] **Step 1: Fetch the guidelines**

WebFetch (load it through ToolSearch if it is deferred): `https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md`. Keep the rule list in context for the review.

- [ ] **Step 2: Review the four files**

Read `index.html`, `site.css`, `posts.css` and `behavior.js` (`cat` from the repo root) and check every rule from the fetched guidelines against them. Record each finding as `file:line: rule: what is wrong` in the task report. Skip a finding when the spec or a Global Constraint mandates the current behavior (say which one in the report), and skip anything inside the CSS-drawn concept art (`.art*` in `posts.css`), which is decorative and `aria-hidden`.

- [ ] **Step 3: Fix the real findings**

For each finding not skipped, make the smallest change that resolves it, keeping the tokens, the copy and the boundary rule. Then:

```bash
cd /c/Users/mythi/Claude/newtzmedia-site && node --test "tests/*.test.js" 2>&1 | grep -E "^ℹ (pass|fail)"
```

Expected: `ℹ pass 68`, `ℹ fail 0`. If `behavior.js` changed, rerun all of Task 5's checks A to G through the Verification protocol. If only `index.html`, `site.css` or `posts.css` changed, rerun checks A, D and G at least. Expected values are unchanged unless a fix was meant to change one; say so in the report.

- [ ] **Step 4: Commit, or report no changes**

If anything changed:

```bash
cd /c/Users/mythi/Claude/newtzmedia-site && git add index.html site.css posts.css behavior.js && git commit -q -F - <<'EOF'
Apply the Web Interface Guidelines review

One line per finding applied goes here, as file: what changed and why.

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>
EOF
git log -1 --format=%B | grep -c "^Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>$"
```

Expected: `1`. Replace the middle paragraph with the actual list before committing. Add only the files that changed. If nothing changed, commit nothing and report the findings list (possibly empty) with the rules that were checked.

**Stop here for Zack's review.** The code is complete at this point. Run the subagent-driven-development final whole-branch review now, before Task 8, because Task 8 waits on content Zack does not have yet (spec section 11) and may be days away.

---

### Task 8: Launch

**Files:**
- Modify: `content.js` (profiles, handle, phone, the first posted piece)
- Modify: `index.html` (the static contact block)
- Create: `images/nftek-YYYY-MM-DD.jpg` (or `.png`), the first post's image if it has one

**Inputs from Zack, all required before this task starts** (spec section 11):
1. The phone number as `+1` and ten digits, and how it should read on the page (for example `(555) 555-0123`).
2. NFTek's real handle if it is not `@nfteks`, and the profile URL for LinkedIn (on `linkedin.com`) and for X (on `x.com` or `twitter.com`).
3. The first real post: which platforms it went up on, the date, the text exactly as published, the live URL per platform (on that platform's host), and the image file if it has one.

The launch gate names anything missing. His side, not blocking the code: Enforce HTTPS in the Pages settings once GitHub issues the certificate, and a test mail to `zack@newtzmedia.com` to confirm the forwarding.

- [ ] **Step 1: Confirm the starting state**

```bash
cd /c/Users/mythi/Claude/newtzmedia-site && git status --short -b && node --test "tests/*.test.js" 2>&1 | grep -E "^ℹ (pass|fail)" && node tests/launch-gate.js; echo "exit $?"
```

Expected: `## site`, clean, `ℹ pass 68`, `ℹ fail 0`, the five gate lines and `exit 1`.

- [ ] **Step 2: Put the image in place, if there is one**

Copy Zack's file to `images/nftek-YYYY-MM-DD.jpg` (the post's date; `.png` if it is a PNG), then check it is web-sized with the venv's Pillow:

```bash
cd /c/Users/mythi/Claude/newtzmedia-site && SCRATCH="C:/Users/mythi/AppData/Local/Temp/claude/C--Users-mythi-Claude/4e49d466-0433-4be7-ba7f-d9a4cf70b1ac/scratchpad" && "$SCRATCH/venv-assets/Scripts/python.exe" -c "from PIL import Image; import sys; im = Image.open(sys.argv[1]); print(im.format, im.size)" images/nftek-YYYY-MM-DD.jpg && wc -c images/nftek-YYYY-MM-DD.jpg
```

Expected: the format, a width at or below 1600, a size well under 400,000 bytes. If the width is above 1600, shrink it in place:

```bash
"$SCRATCH/venv-assets/Scripts/python.exe" -c "from PIL import Image; import sys; im = Image.open(sys.argv[1]); im.thumbnail((1600, 1600)); im.save(sys.argv[1], quality=85, optimize=True); print(im.size)" images/nftek-YYYY-MM-DD.jpg
```

Choose the piece's `format` from the image's shape: `'1x1'` square, `'4x5'` portrait, `'16x9'` landscape, `'9x16'` a story. On X the frame is always 16:9 (D11). A post without an image uses `'1x1'` and renders text only.

- [ ] **Step 3: Edit content.js with the Edit tool**

Four edits, each on a line the file already has:

1. `handle: '@nfteks',` -> the real handle, if it differs.
2. `profiles: {},` -> `profiles: { linkedin: 'https://www.linkedin.com/company/...', x: 'https://x.com/...' },` with the two URLs from Zack (every platform in NFTek's `platforms` list needs one).
3. `phone: '',` -> `phone: '+1XXXXXXXXXX',` and `phoneDisplay: '',` -> `phoneDisplay: '(XXX) XXX-XXXX',` with the real values.
4. Insert the first piece as the first entry of `pieces`, right after the comment block that shows the shape (the comment ends with `//   },` and `// },`), keeping the comment in place for the next post:

```js
    {
      id: 'nftek-YYYY-MM-DD', business: 'nftek', platforms: ['linkedin'],
      format: '1x1', headline: '',
      caption: 'The post text, exactly as published.\nA second paragraph, after a line break in the post.',
      hashtags: [],
      date: 'YYYY-MM-DD',
      urls: { linkedin: 'https://www.linkedin.com/posts/...' },
      image: 'nftek-YYYY-MM-DD.jpg',
    },
```

Use the real date, text, platforms and URLs; list `x` in `platforms` and `urls` too when the post went up there; leave out the `image` line when there is no image. Hashtags that were part of the post text stay in `caption`; `hashtags` is for a separate tag line and can stay empty. Then:

```bash
cd /c/Users/mythi/Claude/newtzmedia-site && node --check content.js && node --test tests/site-content.test.js 2>&1 | grep -E "^ℹ (pass|fail)"
```

Expected: `ℹ pass 9`, `ℹ fail 0`. A failure names the rule broken (R2: a URL off the platform's host or a bad date; R4: the image file is missing).

- [ ] **Step 4: Regenerate the static contact block**

Print what the renderer produces now:

```bash
cd /c/Users/mythi/Claude/newtzmedia-site && node -e "require('./content.js'); require('./logic.js'); console.log(NEWTZ_LOGIC.renderContact())"
```

Expected: `<p class="contact__line">Tell me about your business and I’ll reply within a day.</p><p class="contact__links"><a class="contact__link" href="tel:+1XXXXXXXXXX">(XXX) XXX-XXXX</a><a class="contact__link" href="mailto:zack@newtzmedia.com">zack@newtzmedia.com</a></p>` with the real values. In `index.html`, with the Edit tool, replace the existing line

```html
        <p class="contact__links"><a class="contact__link" href="mailto:zack@newtzmedia.com">zack@newtzmedia.com</a></p>
```

with the `<p class="contact__links">...</p>` part of that output. The parity test in `tests/site-page.test.js` refuses anything else.

- [ ] **Step 5: Run everything, then the gate**

```bash
cd /c/Users/mythi/Claude/newtzmedia-site && node --test "tests/*.test.js" 2>&1 | grep -E "^ℹ (tests|pass|fail)" && node tests/launch-gate.js; echo "exit $?"
```

Expected: `ℹ tests 68`, `ℹ pass 68`, `ℹ fail 0`, then `LAUNCH GATE: ready (1 posted piece(s))` and `exit 0`.

- [ ] **Step 6: See the real card on the served page**

Verification protocol steps 1 to 3, then:

```js
(async () => { await new Promise(r => setTimeout(r, 1500)); const g = document.querySelector('#posted-gallery'); const a = g.querySelector('a.stamp'); const img = g.querySelector('img.post__image'); return { cards: g.querySelectorAll('.card').length, subHidden: document.querySelector('#posted [data-subline]').hidden, stamp: a && [a.textContent, a.target, a.rel, a.href], img: img ? [img.complete, img.naturalWidth, img.getAttribute('loading')] : 'no image', pills: [...document.querySelectorAll('#posted [data-platform-tabs] [role=tab]')].map(t => t.id), tel: document.querySelector('.contact__link[href^="tel:"]').textContent, nojs: document.querySelectorAll('.gallery__nojs').length }; })()
```

Expected: `cards` 1; `subHidden` false; `stamp` ["Posted to LinkedIn · D Mon YYYY · See it live (opens in a new tab) ↗", "_blank", "noopener noreferrer", the live URL]; `img` [true, a width above 0, "lazy"] or "no image"; `pills` one id per platform the post lists; `tel` the display form; `nojs` 0. Then `resize_window {preset: "mobile"}` and run Task 5's check G: expected as there, `postedStamp` 44. Then `resize_window {preset: "desktop"}`, `preview_stop`.

- [ ] **Step 7: Commit on the branch**

```bash
cd /c/Users/mythi/Claude/newtzmedia-site && git add content.js index.html && { [ -d images ] && git add images/; } ; git status --short && git commit -q -F - <<'EOF'
Add the first real post and the contact details

NFTek's first live post with its date and link, the profile URLs, and the
phone number with its display form. The static contact block matches the
renderer again. The launch gate passes.

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>
EOF
git log -1 --format=%B | grep -c "^Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>$"
```

Expected: the status shows only `content.js`, `index.html` and the image, then `1`.

- [ ] **Step 8: Merge to main and push (the launch)**

Use superpowers:finishing-a-development-branch: the suite is green, the base is `main`, present the menu. Zack's standing choice is to merge locally and push; on his yes:

```bash
cd /c/Users/mythi/Claude/newtzmedia-site && git fetch origin && git status -sb | head -1 && git checkout main && git status -sb | head -1 && git merge --ff-only site && node --test "tests/*.test.js" 2>&1 | grep -E "^ℹ (pass|fail)" && node tests/launch-gate.js && git push origin main && git branch -d site && git log -1 --format=%h
```

Expected: `## site`, `## main...origin/main` with no ahead/behind, a fast-forward merge, `ℹ pass 68`, `ℹ fail 0`, `LAUNCH GATE: ready (1 posted piece(s))`, the push output, `Deleted branch site`, the new hash. If `main` is behind `origin/main`, stop and report: someone pushed to main; do not merge until Zack says how.

- [ ] **Step 9: Verify the live site from the machine, not by eye**

GitHub Pages takes one to two minutes to redeploy. Retry the first command until the title count is 1. Use `http://` in place of `https://` if the certificate is not issued yet.

```bash
curl -s https://newtzmedia.com/ | grep -c "<title>NewtzMedia: social media posts for local businesses</title>"; curl -sI https://newtzmedia.com/ | grep -iE "^(HTTP|server)"; curl -s https://newtzmedia.com/ | grep -c 'property="og:'; for f in og.png favicon.svg favicon-32.png apple-touch-icon.png; do printf '%s: ' "$f"; curl -sI "https://newtzmedia.com/$f" | grep -iE "^(HTTP|content-type)" | tr -d '\r' | tr '\n' ' '; echo; done; curl -sI https://www.newtzmedia.com/ | grep -iE "^(HTTP|location)"
```

Expected: `1`; `HTTP/2 200` (or `HTTP/1.1 200`) and `server: GitHub.com`; `4` og tags; each asset `200` with `content-type: image/png` (`image/svg+xml` for the SVG); `www` answers `301` with `location: https://newtzmedia.com/` (if `www` does not resolve, that is a DNS record for Zack at Internet.bs, not a site defect; report it).

- [ ] **Step 10: Report**

Tell Zack: the site is live at newtzmedia.com with the first post, the commit hash on `main`, the curl results, and his two remaining items (Enforce HTTPS once the certificate exists; the forwarding test mail).

---

## Plan self-review (done at writing time, 2026-09-25)

**Spec coverage.** Section 1 (purpose): the whole plan. Section 2 (decisions): Global Constraints and the deviations list. Section 3 (content model, R1 to R7): Task 1. Section 4 (page structure and copy): Task 1 (the copy) and Task 4 (the structure). Section 5 (visual system): Task 4 (`site.css`, the head) and Task 3 (the mark). Section 6 (behavior): Tasks 2 and 5. Section 7 (files and hosting): Tasks 3, 4, 6 and 8, plus the preview entry in Task 4. Section 8 (tests): Tasks 1, 2 and 4. Section 9 (launch gate and launch): Tasks 6 and 8. Section 10 (browser verification): Task 5, repeated as needed in Tasks 7 and 8. Section 11 (owed content): Task 8's inputs. Section 12 (later): out of scope, nothing here builds it.

**Placeholder scan.** No "TBD", "TODO", "implement later" or "similar to Task N". Task 7's commit message and Task 8's `YYYY-MM-DD`, `XXXXXXXXXX` and `...` stand for values that exist only when Zack supplies them; each is named in the task's Inputs list.

**Name consistency.** Every function named in the Interfaces blocks exists under that name in the embedded `logic.js` and `behavior.js`; every DOM hook named in Task 4's Interfaces appears in the embedded `index.html` and is queried by the embedded `behavior.js`; the test counts (9, 12, 7; suite 49, 61, 68) and the gate's five lines are the observed outputs of the embedded files.
