# NewtzMedia site: design

Date: 2026-09-25. Status: approved by Zack in four sections (purpose and
content model, page structure and copy, visual system, files and launch)
after three question rounds. This file is the single authority for the
implementation plan. The mockups spec
(`2026-09-24-newtzmedia-mockups-design.md`) stays as history; where the
two differ, this file wins.

## 1. Purpose and scope

NewtzMedia is Zack Newtz's business: social media posts for local small
businesses, for a monthly fee. Clients come from cold calling. The site is
proof, sent after a call, usually opened on a phone. Its one job: make a
business owner who just got off the phone believe the posts are real and
his. Everything on the page serves that or is cut.

In scope: one page at `https://newtzmedia.com`, plain HTML, CSS and JS,
no framework, no build step, no packages, hosted on GitHub Pages from the
repo root, with a content file that later holds real client work and links
every real post to where it went up.

Out of scope, by decision: prices, a contact form, analytics, a dark mode
or toggle, platform embeds, a CMS, a lightbox, scroll reveals, the cycling
hero. Each has a later-upgrade note in section 12.

## 2. Decisions log (settled, do not reopen without Zack)

Round 1 (2026-09-25):
1. Palette: white or near-white ground, near-black text, one deep purple
   used only where it means something. Purple is the mark, not the mood.
2. Domain `newtzmedia.com`, bought at Internet.bs; GitHub Pages for now.
3. One content file in the repo; each real sample carries the live post
   URL or is labeled a concept. No CMS.
4. Proof = the site's own rendered card plus a link out to the live post.
   Screenshots allowed for image-heavy posts. No platform embeds.
5. Launch gallery = NFTek's real posts as they go live (from the week of
   2026-09-28) plus clearly labeled concepts. NFTek is presented as the
   accounts Zack runs for his family's company, never as a client or an
   employer.
6. Contact = phone and email as links. No form.
7. No prices at launch.
8. Light only, no toggle. Explicit exception to Zack's dark-mode rule.
9. Build from the mockup code: shared files copied and diverged, one new
   stylesheet, mockup controls, tagline switcher and cycling hero dropped,
   mockups folder kept.

Round 2:
10. One type family, Instrument Sans; Gabarito for the wordmark only.
11. Signature element: the proof line (stamp) under every card.
12. Two gallery sections, Posted and Concepts for other businesses.
13. Page order: header, intro, Posted, Concepts, How it works, About,
    Contact, footer.
14. The offer is stated without quantities at launch.
15. Repo root served by GitHub Pages; the repo is public.
16. Email `zack@newtzmedia.com` forwarded to Zack's Outlook.
17. No analytics at launch (GoatCounter with per-prospect links later).
18. Post images live in the repo under `images/`.
19. Mobile first; concept art stays CSS-drawn; accessibility, reduced
    motion and tests carry over from the mockups.

Round 3:
20. Tagline: "Your business, posted."
21. Hosting set up before the site: holding page, CNAME and `.nojekyll`
    are on `main` (3414df3), DNS and Pages are live, HTTPS pending.
22. Link-preview image made with Pillow in a scratchpad environment; only
    the PNG enters the repo. Same script draws the favicon PNGs.

Design sections:
23. Empty Posted section renders one honest line; the refusal lives in a
    launch-gate script, not the page (section 9).
24. Zack's full name, "Zack Newtz", appears in About.
25. A favicon: an SVG plus 32px and 180px PNGs of the mark.
26. The lightbox is cut.
27. The "you approve" step in How it works is confirmed as Zack's process.

## 3. Content model

`content.js` is a plain script defining one global, `NEWTZ_CONTENT`,
loadable by `require()` in Node tests and by a `<script>` tag. Shape:

```js
globalThis.NEWTZ_CONTENT = {
  brand: {
    name: 'NewtzMedia',
    owner: 'Zack Newtz',
    tagline: 'Your business, posted.',
    intro: 'Social media posts for local small businesses, made and posted for a monthly fee.',
    introNote: 'Where it says posted below, the post is live on the platform and the stamp links to it.',
    url: 'https://newtzmedia.com',
  },
  platforms: {
    linkedin:  { id: 'linkedin',  label: 'LinkedIn',  hosts: ['linkedin.com'] },
    x:         { id: 'x',         label: 'X',         hosts: ['x.com', 'twitter.com'] },
    instagram: { id: 'instagram', label: 'Instagram', hosts: ['instagram.com'] },
    facebook:  { id: 'facebook',  label: 'Facebook',  hosts: ['facebook.com'] },
  },
  businesses: [
    {
      id: 'nftek', name: 'NFTek', kind: 'posted',
      handle: '@nfteks',                       // real handle, Zack supplies
      description: 'Cloud and AI automation consulting',
      platforms: ['linkedin', 'x'],            // pill order
      profiles: { linkedin: 'https://...', x: 'https://...' },  // real, Zack supplies
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
    // ironworks (concept), aceauto (concept) as in the mockups
  ],
  pieces: [
    // A posted piece: real text, a date, one URL per platform it went to.
    {
      id: 'nftek-2026-10-03', business: 'nftek', platforms: ['linkedin'],
      format: '1x1', headline: '', caption: '<the post text as published>',
      hashtags: [], date: '2026-10-03',
      urls: { linkedin: 'https://www.linkedin.com/posts/...' },
      image: 'nftek-2026-10-03.jpg',            // optional, file in images/
    },
    // A concept piece: the mockup shape, CSS art, no date, no urls.
    {
      id: 'brewhaus-fall-1', business: 'brewhaus', platforms: ['instagram', 'facebook'],
      format: '4x5', headline: 'Fall menu is up', caption: '...', hashtags: ['...'],
    },
  ],
  steps: [ { title, body } x3 ],                // section 4
  about: '...',                                  // section 4
  contact: { line: '...', phone: '', phoneDisplay: '', email: 'zack@newtzmedia.com' },
  footer: '...',
  copy: { /* every UI string, section 4 */ },
};
```

Rules, each enforced by a test in section 8:

- R1. `kind` is `'posted'` or `'concept'`. Every business has at least one
  piece.
- R2. A piece of a posted business has `date` in `YYYY-MM-DD` form and a
  `urls` map with one `https://` URL per platform in its `platforms`,
  whose host equals or ends with a dot plus one of that platform's
  `hosts`.
- R3. A piece of a concept business has no `urls`, no `date` and no
  `image`. A concept can never carry a link.
- R4. Every `image` names a file that exists under `images/`.
- R5. Every `platforms` entry on a piece is one of the business's
  platforms, and every platform id exists in `platforms`.
- R6. `brand.url` is `https://newtzmedia.com`, `contact.email` is
  `zack@newtzmedia.com`.
- R7. Real posted text is shown as published: escaped, never edited by
  the renderer, and excluded from the banned-words test (section 8).

Renamed from the mockups: `customers` becomes `businesses`, a piece's
`customer` becomes `business`, `customerById` becomes `businessById`.
The mockup fields `campaign`, `chip`, `month`, `tiers`, `taglines`,
`recommended` and `email` on brand are removed.

## 4. Page structure and copy (verbatim)

Order and words. Sentence case, first person, "and" never "&", no
exclamation marks, no outcome claims.

1. **Skip link**: "Skip to the work", target `#posted`.
2. **Header**: wordmark "NewtzMedia" (a link to `#top`), one link on the
   right: "Contact", target `#contact`. Same row on phones.
3. **Intro** (`<h1>`): "Your business, posted." Under it one sentence:
   "Social media posts for local small businesses, made and posted for a
   monthly fee." Then one smaller line: "Where it says posted below, the
   post is live on the platform and the stamp links to it."
4. **Posted** (`<h2>`, section id `posted`): heading "Posted". Subline:
   "Real posts, live where they went up. Tap one to see it there."
   Business tabs only when the posted businesses number two or more;
   platform pills per business; cards with the posted stamp. Empty state
   (no posted piece at all): the subline is replaced by "First posts go
   live soon." and nothing else renders in the section.
5. **Concepts for other businesses** (`<h2>`, section id `concepts`, on
   the band): heading exactly that. Subline: "Invented businesses, made to
   show the range. Nothing here was posted." Business tabs (Brew Haus,
   Ironworks Gym, Ace Auto Repair), platform pills, cards with the concept
   stamp.
6. **How it works** (`<h2>`): three steps, an ordered list, numbers shown
   because it is a sequence:
   1. "We talk" / "A short call about your business and who you want
      walking in."
   2. "I draft, you approve" / "You see every post before it goes up.
      Change anything."
   3. "They go out" / "Posted for you on a steady schedule, agreed on the
      call."
7. **About** (`<h2>`): "I'm Zack Newtz. I run the social media accounts
   for NFTek, my family's cloud and AI automation company. NewtzMedia grew
   out of that: the same work, for local businesses that have nobody to do
   it."
8. **Contact** (`<h2>`, section id `contact`): "Tell me about your
   business and I'll reply within a day." Then the phone number as a
   `tel:` link showing the number, and `zack@newtzmedia.com` as a
   `mailto:` link showing the address. Both visible as plain text.
9. **Footer**: "Concept samples are invented businesses shown to
   demonstrate the work. Nothing labeled concept was posted. Posted work
   links to the live post." Then "NewtzMedia, 2026".

Stamps:
- Posted: `Posted to {Platform label} · {d Mon yyyy} · See it live` plus
  an outward arrow (U+2197, `aria-hidden`). The whole line is one `<a>`
  with `href` = the piece's URL for the platform shown, `target="_blank"`,
  `rel="noopener noreferrer"`, and visually hidden text " (opens in a new
  tab)". Date format: day without leading zero, three-letter English month
  from a fixed table, four-digit year. No `Intl`.
- Concept: `Concept · not posted`, plain text, same slot and height.

Page head: `<title>NewtzMedia: social media posts for local businesses</title>`;
`meta description` = "Social media posts for local small businesses, made
and posted for a monthly fee. See real posts, live on the platform.";
`og:title`, `og:description` (same two strings), `og:image` =
`https://newtzmedia.com/og.png`, `og:url` = `https://newtzmedia.com/`,
`twitter:card` = `summary_large_image`; `theme-color` `#4B2A9E`;
`<link rel="icon" href="favicon.svg" type="image/svg+xml">`,
`<link rel="icon" href="favicon-32.png" sizes="32x32">`,
`<link rel="apple-touch-icon" href="apple-touch-icon.png">`;
`lang="en"`, the viewport meta; no `robots noindex` (the holding page's
noindex goes with it). `translate="no"` on the wordmark.

## 5. Visual system

Tokens, the only colors on the page:

| Token | Value | Use |
|---|---|---|
| `--paper` | `#FFFFFF` | page background |
| `--band` | `#F7F6FA` | the Concepts section background, nothing else |
| `--line` | `#E4E1EC` | card borders, section rules |
| `--muted` | `#5B5670` | secondary text, the concept stamp |
| `--ink` | `#17151C` | main text |
| `--purple` | `#4B2A9E` | links, posted stamp, active tabs, the mark, focus rings |
| `--purple-deep` | `#3A1F7E` | hover and pressed states |

Contrast floors: every text pairing at or above 4.5:1 (muted on paper is
about 7:1, purple on paper about 9.6:1, white on purple about 9.6:1);
non-text focus ring at or above 3:1.

Type: Instrument Sans 400, 600, 700 from Google Fonts by `<link>`, with
`preconnect`; fallback `system-ui, sans-serif`. Body `1.0625rem` at line
height 1.6. `h1` `clamp(2rem, 1.2rem + 3vw, 3rem)`, weight 700, letter
spacing `-0.02em`, `text-wrap: balance`. `h2` `1.5rem`, 700. Stamps and
sublines `0.8125rem`, 600. Wordmark: Gabarito 800, `1.25rem`, the face
`posts.css` already loads.

The mark: a purple (`#4B2A9E`) rounded square, radius 20% of its side,
with a white N drawn as three strokes of equal width (two uprights and one
diagonal), each stroke width 14% of the side, inset 22% from each edge,
square stroke ends. Same geometry in `favicon.svg`, in the two PNGs and on
`og.png`.

Stamp: one line, `0.8125rem`, 600, `min-height: 2.5rem`, aligned to the
card's bottom edge so every card has the same slot. Posted: purple text,
underline on hover and focus, arrow at the end. Concept: muted text, not
a link. No motion.

Cards: the mockup post markup (`posts.css`) unchanged inside; a white card
with `1px solid var(--line)` and `border-radius: 12px`, no shadow. Grid:
one column under 640px, two from 640px, three from 1024px; gap `1.5rem`;
page width `72rem` with `16px` side gutters on phones.

Tabs: business tabs are plain text buttons with a `2px` purple underline
when active. Platform pills: `min-height: 44px`, purple fill with white
text when active, `1px` line border otherwise. Both rows keep the
mockups' `padding: 5px; margin: -5px; scroll-padding: 5px` so focus rings
never clip, and `overflow-x: auto` with hidden scrollbars.

Motion: the mockups' `--swap-ms` tab swap (250ms fade) and 150ms color
transitions on hover and focus. Under `prefers-reduced-motion: reduce`
both are instant (`html.reduced-motion` class as in the mockups). Nothing
else moves.

Layout: sections separated by a `1px` line and `3rem` on phones, `4rem`
from 640px. No sticky header. Focus ring `2px solid var(--purple)`,
`outline-offset: 2px`, everywhere. Tap targets at or above 44px:
wordmark, Contact link, tabs, pills, stamp links, contact links.
`-webkit-tap-highlight-color: rgba(75, 42, 158, .2)`. `color-scheme:
light`.

Cut: lightbox, scroll reveals, cycling hero, hero pause control, tagline
switcher, mock controls, crop marks, tiers.

## 6. Behavior

`behavior.js` from the mockups, reduced: state `{ posted: { business,
platform }, concepts: { business, platform } }`, one gallery instance per
section; `selectBusiness(section, id)`, `selectPlatform(section, id)`,
`tablistKeys` (Arrow, Home, End, with `scrollIntoView` after a move, as
in the mockups), `motionOk`. No hero API, no lightbox, no `setTagline`.
Public global `NEWTZ_APP` with `{ state, selectBusiness, selectPlatform,
tablistKeys, motionOk }`. `html.js` is added at load so any JS-dependent
style keys off it. The galleries are rendered by `logic.js` at load;
there is no server, so the static HTML carries, inside each gallery, the
line "Turn on JavaScript to browse the posts." from `copy.noJs`, which
the first render replaces. With JS off the page still shows the header,
intro, the static sections, the footer and that line in each gallery.

`logic.js` from the mockups with the renames of section 3 and: `piecesFor(
businessId, platformId)`, `businessesOfKind(kind)`, `stampFor(business,
piece, platformId)`, `formatStampDate(iso)`, `renderGallery(section,
state)`, `renderBusinessTabs`, `renderPlatformTabs`, `renderSteps`,
`renderContact`, `renderFooter`. The renderers never alter posted text
beyond HTML escaping. A posted piece with an empty `headline` renders no
headline element; a posted piece with an `image` renders that image
(`<img>` with the piece's `caption` first line as `alt`, capped at 120
characters) in place of the CSS art; a posted piece without one renders
the text-only form of that platform's template.

External links: only the posted stamps and the NFTek profile links leave
the site. Every external link has `rel="noopener noreferrer"`.

## 7. Files and hosting

Repo root, served by GitHub Pages from `main`:

```
index.html            the site (replaces the holding page at launch)
site.css              the one stylesheet (tokens, layout, tabs, stamps)
posts.css             copied from mockups/, post internals only
content.js            section 3
logic.js              section 6
behavior.js           section 6
images/               real post images, web-sized (max 1600px wide, JPEG or PNG)
favicon.svg  favicon-32.png  apple-touch-icon.png  og.png
tools/make_assets.py  draws the mark, the two PNGs and og.png (Pillow)
CNAME  .nojekyll      already on main
README.md             updated: how to serve, test, add a post, regenerate assets
mockups/              untouched history, its tests still run
tests/                section 8
docs/superpowers/     specs and plans
```

Boundary rule, carried from the mockups: `site.css` never targets `.post`,
`.post__*`, `.art` or `.art__*`; those belong to `posts.css`.

Dev preview: `python -m http.server 8765` from the repo root, launch entry
`newtzmedia-site` in the session `launch.json`. Google Fonts by `<link>`
is the only external dependency of the page.

`tools/make_assets.py` runs with Pillow installed in a scratchpad
virtual environment, never in the repo; it writes the four asset files
deterministically from the geometry in section 5 and the tokens. It uses
no font file: the N is geometry, and the wordmark on `og.png` is drawn
with a system font at 96px (the preview image is not the site's type).

## 8. Tests

Node's built-in runner, no packages, the existing command:
`node --test "tests/*.test.js"`. The mockup tests remain and keep passing.
New files, prefixed `site-`:

- `site-content.test.js`: R1 to R7 from section 3; every UI string in
  `copy` present and non-empty; the four platform hosts lists; no
  `.example` domain on a posted business; the banned-words scan
  (`review|reviews|rated|rating|stars?|testimonial|customers love|results|
  guaranteed|grow|engagement`) over `brand`, `steps`, `about`,
  `contact`, `footer`, `copy` and every concept piece, and explicitly not
  over posted pieces.
- `site-logic.test.js`: `businessesOfKind` split; `piecesFor` order;
  `formatStampDate('2026-10-03') === '3 Oct 2026'`; `stampFor` for a
  posted piece yields an `<a>` with the right `href`, `target`, `rel` and
  the hidden new-tab text, and for a concept piece yields no `<a>`;
  `renderGallery` with zero posted pieces yields the empty line and no
  cards; business tabs render only from two businesses; `renderSteps`
  numbers 1 to 3; `renderContact` has `tel:` and `mailto:` links whose
  visible text equals `phoneDisplay` and the email.
- `site-page.test.js`: `index.html` head (title, description, the og and
  twitter tags with the absolute image URL, theme color, the three icon
  links, `lang`, viewport, no `noindex`); no `mock-controls`, no
  `data-hero`, no `lightbox`; `site.css` boundary rule; every asset file
  referenced from `index.html` exists; `CNAME` reads `newtzmedia.com`.
- `launch-gate.js` (not a test file, section 9).

## 9. Launch gate and launch

`node tests/launch-gate.js` exits non-zero, printing each failure, unless:
at least one posted piece exists; `contact.phone` matches `^\+1\d{10}$`
and `contact.phoneDisplay` is non-empty; `contact.email` is
`zack@newtzmedia.com`; every posted business has a `profiles` entry for
each of its platforms; `index.html` has no `noindex`. It runs as the last
plan task, on the branch, before the merge.

Launch = merge the branch to `main` and push. Then verify from the
machine, not by eye: `https://newtzmedia.com/` returns 200 from
`GitHub.com` with the new title; `www` redirects 301 to the bare name;
`og.png`, `favicon.svg`, `favicon-32.png` and `apple-touch-icon.png`
return 200 with the right content types; the HTML contains the og tags.
Zack's side before launch: tick Enforce HTTPS in the Pages settings once
GitHub issues the certificate; email forwarding at Internet.bs working
(he sends himself a test mail).

## 10. Browser verification

Run on the served page through the hidden-pane method (resize to 1280x900,
one 0.1-scale screenshot as the frame trigger, pass/fail read from JS
text), then at the 375px mobile preset:

1. No console errors.
2. Both galleries render the first business and platform; switching a
   business and a platform re-renders and updates `aria-selected`.
3. Keyboard: Arrow, Home and End move the tab focus and the focused tab
   is inside the scroll row's visible box.
4. Every posted stamp is an `<a>` with `target="_blank"` and the
   `noopener noreferrer` rel; no concept card contains an `<a>`.
5. At 375px: `document.documentElement.scrollWidth <= innerWidth`, one
   card column, every named target at or above 44px tall.
6. Contrast: computed foreground and background of body text, muted
   text, stamps, active pills and links, each at or above 4.5.
7. With `prefers-reduced-motion` emulated, `--swap-ms` reads 0 and the
   `reduced-motion` class is on `html`.
8. The no-JS line is present in each gallery of the static `index.html`
   (a Node page test) and absent from the live DOM after load (browser).

## 11. Owed content and placeholders

Zack supplies, none of it blocking the build: the phone number and how it
should display; NFTek's real handle and profile URLs per platform; the
first real post's URL, date, text and image when it goes up (from the week
of 2026-09-28). Until then `contact.phone` is empty and NFTek has no
pieces, which is exactly what the launch gate refuses.

## 12. Later, not now

- Prices: a plans section once Zack sets them ("Plans start at $X a
  month" first).
- Analytics: GoatCounter with a per-prospect query string.
- A real mailbox at the domain so replies come from it.
- Quantities in How it works once the offer is fixed.
- The optional GitHub domain-verification TXT record.
- More posted businesses: the content model already supports them and the
  business tabs appear on their own.
