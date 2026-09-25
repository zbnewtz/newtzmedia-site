# NewtzMedia website mockups - design spec

Date: 2026-09-24
Status: approved by Zack in conversation (brainstorming + grilling rounds), awaiting his review of this written version.

## 1. Purpose

NewtzMedia is Zack's own business: he creates social media posts for local small
businesses for a monthly fee. This project produces TWO mockups of the marketing
website, in two visual styles, so Zack can pick a direction. It does not produce
the real site.

The page's one job: proof, not a funnel. Zack pitches a business in person or by
DM, then sends the link. The visitor should see real-looking work, understand the
service in three steps, see a price, and find an email address.

Audience: owners of local small businesses (restaurants, gyms, shops, salons,
auto shops) with no marketing person. They open the link on a phone as often as
on a desktop.

Copy voice: first person singular. Zack is one person and the page says so.

## 2. Decisions log (settled, do not reopen without Zack)

- Business name and wordmark: `NewtzMedia`, one word. No subline needed.
- Repo: `C:\Users\mythi\Claude\newtzmedia-site`, git, branch `main`.
- Mockups are plain HTML, CSS and JavaScript. No framework, no build step, no
  package install. Google Fonts loaded by `<link>` (approved external dependency).
- Same five sections in both styles, same content, so the comparison is style
  against style: hero, work, how it works, pricing, contact.
- Both styles switch customer and platform in the work section.
- Platform tabs vary by customer (a consultancy is on LinkedIn, a coffee shop is
  not).
- Style 1 "Minimal": type-led, black ground, purple as a thin accent. Reference
  shape: kickpush.co (one flat ground, one huge centered headline, tiny nav).
- Style 2 "Interactive": Slack.com shape. Purple hero band with a white framed
  demo card and pill tabs that swap it; warm light neutral body; smooth motion.
  NOT drawn illustration, no doodles, no cartoons.
- Style 2's neutral is LIGHT (exception to Zack's dark-by-default rule, granted
  for this project because the audience is the customer and two dark sites would
  not show the difference between directions).
- Auto-cycle only in the Style 2 hero, with a visible pause button; the work
  gallery is manual in both styles.
- Lightbox on a single post in both styles.
- Pricing: three tiers, placeholder numbers, middle tier labelled "Recommended"
  (never "Most popular": there are no customers yet).
- No testimonials, no client logos, no star ratings, no fake reviews anywhere,
  including inside the sample posts.
- Sample work is fictional except NFTek. The footer says so.
- Review gate: the web-design-guidelines skill runs on the built files before
  Zack sees the mockups.
- Desktop first for the review, but both mockups must work on a phone.

## 3. Shared content (identical in both mockups)

All content lives in `mockups/content.js` as one data object so both HTML files
render the same words and the same posts.

### 3.1 Customers and campaigns

Each customer has: name, one-line description, a list of platforms, a campaign
name, a post palette, and three campaign pieces. Each piece lists the platforms
it goes to; a piece only appears under a platform tab it goes to, which is
itself a true statement about the service ("not every post fits every platform").

The first piece of every campaign is the LEAD piece: it goes to every one of that
customer's platforms and is the one the Style 2 hero shows.

| Customer | Description | Platforms | Campaign | Post palette |
|---|---|---|---|---|
| NFTek | cloud and AI automation consulting, one consultant (Zack's father) | LinkedIn, X | Automate the boring part | navy #0F1B3D, cyan #35E0FF, white |
| Brew Haus | neighborhood coffee shop | Instagram, Facebook | Fall menu | cream #F3E6D3, espresso #3B2415, burnt orange #D9702B |
| Ironworks Gym | strength gym | Instagram, Facebook, X | First month free | black #111111, red #E0202A, white |
| Ace Auto Repair | independent auto shop | Facebook, Instagram | Winter check | steel blue #2B4C6F, safety yellow #F5C518, white |

Pieces (format, headline text, supporting text, platforms):

NFTek
1. LEAD, 4:5 stat card. "6 hours to 20 minutes." / "One automation. Every Monday, done before coffee." LinkedIn, X.
2. Carousel, 3 slides 1:1. Slide 1 "The boring part" / "Copying the same numbers into the same sheet every week." Slide 2 "What we automated" / "The report builds itself and lands in your inbox." Slide 3 "What it took" / "One afternoon. No new software to learn." LinkedIn only.
3. 1:1 quote card. "If you do it every week, it should do itself." / "NFTek" LinkedIn, X.

Brew Haus
1. LEAD, 4:5. "The fall menu is here." / "Maple latte, cinnamon cold brew, pumpkin scone." Instagram, Facebook.
2. 1:1. "New hours" / "Mon to Fri 6am to 6pm. Sat and Sun 7am to 4pm." Instagram, Facebook.
3. 9:16 story. "Today's special" / "Maple cold brew, $4 all day." Instagram, Facebook.

Ironworks Gym
1. LEAD, 4:5. "First month free." / "No contract. Just show up." Instagram, Facebook, X.
2. 1:1 schedule. "This week" / "Mon Strength. Tue Spin. Wed Boxing. Thu Strength. Fri Open gym. Sat Bootcamp." Instagram, Facebook, X.
3. 9:16 story. "6am club" / "Doors open 5:45. Coffee's on us." Instagram, Facebook.

Ace Auto Repair
1. LEAD, 4:5. "Free brake inspection." / "All November. No appointment needed." Facebook, Instagram.
2. 1:1. "We're hiring." / "One full-time technician. Apply in the shop or by email." Facebook, Instagram.
3. 4:5 tip. "Cold morning?" / "Check your tire pressure. It drops one PSI for every ten degrees." Facebook, Instagram.

Each piece has a simple SVG motif drawn from the customer's world: NFTek a
cloud-and-circuit mark, Brew Haus a cup, Ironworks a plate on a bar, Ace a
wrench. Motifs are flat geometric shapes, not illustrations.

Captions are written per piece (one or two sentences plus, on Instagram, three
hashtags). Every caption is real text in the DOM so screen readers read the post.

### 3.2 Platform templates (in `mockups/posts.css`)

The same artwork is rendered inside four templates. This is the "one idea,
every platform" demo.

- Instagram: header row (avatar circle, handle), artwork at native ratio (4:5,
  1:1; a 9:16 piece is shown as a tall story frame labelled "Story"), caption
  with hashtags, a quiet action row (heart, comment, share as line icons).
- Facebook: header row (avatar, page name, "2h"), text above the artwork,
  artwork at native ratio, a link-card strip beneath with a domain line, a
  title and a "Learn more" button.
- X: header row (avatar, name, @handle), text FIRST, artwork cropped to 16:9,
  small action row.
- LinkedIn: header row (avatar, name, one-line title, "1d"), text first, two to
  three lines, artwork shown as a document with a page indicator ("1/3" for the
  carousel, "1/1" otherwise), a reactions row.

Fictional handles: @nftek, @brewhaus, @ironworksgym, @aceautorepair. Fictional
domain lines on Facebook cards use the pattern `brewhaus.example`.

### 3.3 Steps ("How it works")

A real sequence, so the numbers carry information.

1. We talk. A short call about your business and who you want walking in.
2. I draft, you approve. A month of posts at once. Change anything.
3. They go out. Scheduled and posted for you, with a recap each month.

### 3.4 Pricing (placeholder numbers, sized to test the layout)

| Tier | Posts a month | Platforms | Price | Label |
|---|---|---|---|---|
| Starter | 8 | 1 | $150 | |
| Standard | 16 | 2 | $300 | Recommended |
| Full | 30, plus stories | every platform | $500 | |

Each card: tier name, price with "/month", the two facts above as a short list,
one button "Email me about {tier}". Zack has not set real prices; the spec marks
these as placeholders and the mockup does not.

### 3.5 Contact, nav, footer

- Nav: wordmark left; "Work", "Pricing", "Email" right. Style 2 renders "Email
  me" as a filled button.
- Contact section: heading "Send me a message", one line "Tell me about your
  business and I'll reply within a day.", a mailto link to the placeholder
  `hello@newtzmedia.example`. Placeholder swaps in one line when Zack has an
  address.
- Footer: "NewtzMedia" and the honesty note "Sample work. Businesses shown are
  fictional except NFTek."

### 3.6 Taglines (three per style, switchable in the mockup)

Zack has not chosen. Each mockup carries a small fixed "Mockup controls" strip
(bottom right, visually outside the design, labelled as such) with buttons
a / b / c that swap the hero headline. The strip is not part of the design and
is removed for the real site.

Style 1 options: (a) "You run the shop. I run the feed." (b) "Posts your
customers actually stop for." (c) "Your business, posted. Every week."
In each, one word is set in Violet: "feed", "stop", "posted".

Style 2 options: (a) "Your business, posted every week." (b) "Social media,
handled. From $150 a month." (c) "The posts get made. You get your evenings
back."

Subline under the headline, both styles: "I make a month of social posts for
local businesses. You approve them, I schedule them. From $150 a month."
When Style 2 tagline (b) is selected, the subline drops its last sentence so
the price is not stated twice.

## 4. Style 1 - Minimal (`mockups/minimal.html`, `mockups/minimal.css`)

### 4.1 Palette

| Token | Hex | Role |
|---|---|---|
| --ink | #0B0A0F | page ground; a black with a hint of violet, never pure #000 |
| --raised | #15121C | pricing cards, lightbox surface |
| --pale | #EDE9F3 | text |
| --muted | #8A8399 | captions, metadata strip |
| --line | #262130 | hairline rules |
| --violet | #A583FF | the accent; 6.9:1 on --ink so it is legal as text |

Violet appears in exactly four places: one word in the headline, the one
button, the active tab underline, and the crop marks. Nowhere else.

### 4.2 Type

- Display: Bricolage Grotesque, weight 800, letter-spacing -0.03em, line-height
  0.95. Headline size `clamp(2.8rem, 9vw, 8.5rem)`. Section labels use the
  display face at small size, sentence case. No monospace eyebrows, no all-caps
  tracking labels.
- Body and UI: Instrument Sans, 400 and 600. Body `clamp(1rem, 0.95rem + 0.3vw, 1.125rem)`, line-height 1.6, max 62ch.
- Google Fonts link: Bricolage Grotesque 800, Instrument Sans 400 and 600, Gabarito 500 and 800 (the artwork uses Gabarito in both mockups, section 6).

### 4.3 Layout

Centered, like the reference. Generous vertical space: sections separated by
`clamp(5rem, 12vw, 9rem)` and one hairline.

```
NewtzMedia                                 Work   Pricing   Email

            You run the shop.
            I run the [feed].              <- "feed" in --violet

      I make a month of social posts for local businesses.
      You approve them, I schedule them. From $150 a month.
                    [ See the work ]

______________________________________________________________
Work        NFTek   Brew Haus   Ironworks Gym   Ace Auto      <- customer text tabs
            Instagram   Facebook                               <- platform text tabs (vary)

   +--------+   +--------+   +-----+   +--------+
   |  4:5   |   |  1:1   |   | 9:16|   |  4:5   |             <- posts, wide gaps
   +--------+   +--------+   +-----+   +--------+
   Brew Haus . Instagram . 4:5 . Sept 2026                    <- metadata strip
______________________________________________________________
How it works    1 We talk    2 I draft, you approve    3 They go out
______________________________________________________________
Pricing         Starter      Standard  Recommended     Full
______________________________________________________________
Send me a message    hello@newtzmedia.example
NewtzMedia . Sample work. Businesses shown are fictional except NFTek.
```

Work grid: 4 columns on desktop, gap 3rem; 2 columns under 1100px; 1 column
under 560px. Posts render inside the platform template but the template chrome
is quiet in this style (thin, --line borders, no shadows).

### 4.4 Signature: the proof sheet

Each post sits directly on --ink with thin --violet crop marks at its four
corners (1px lines, 14px long, 8px outside the post's corner) and a metadata
strip beneath in --muted: `{customer} . {platform} . {ratio} . {month}`. The
ratio is real information. The page a visitor receives after a pitch looks like
a print proof, which is what it is. The accepted risk: it can read like a
photographer's site; the copy and the post content keep it grounded.

### 4.5 Motion

Two things move: the tab switch crossfades in 250ms, and crop marks brighten on
hover and focus. Nothing else. No scroll reveals, no auto-cycle, no hero
animation.

## 5. Style 2 - Interactive (`mockups/interactive.html`, `mockups/interactive.css`)

### 5.1 Palette

| Token | Hex | Role |
|---|---|---|
| --linen | #F4EEE6 | page ground; warm, not the yellow cream default |
| --white | #FFFFFF | framed demo card, post cards, pricing cards |
| --cocoa | #2B2430 | text; warm near-black with a purple hint |
| --muted | #6F6779 | secondary text |
| --line | #E4DCD2 | borders |
| --grape | #6D3BD6 | buttons, active pills, links, focus; 5.6:1 on --linen |
| --aubergine | #2E1650 | hero band top; band is a gradient from --aubergine to #5A31B5 |
| --lilac | #EDE6FA | pill hover, contact band tint |

No second accent color. The posts bring the other colors.

### 5.2 Type

- Display: Gabarito, weight 800. Hero headline `clamp(2.4rem, 6vw, 4.5rem)`,
  line-height 1.05, in --white on the band. Section headings in --cocoa.
- Body and UI: Figtree, 400, 500, 600. Same body scale as Style 1.
- No serif anywhere.
- Google Fonts link: Gabarito 500 and 800, Figtree 400 500 600.

### 5.3 Layout

```
[NewtzMedia]                              Work   Pricing   [Email me]
+================ --aubergine to violet gradient band ================+
|          Your business, posted every week.                          |
|     I make the posts, you approve them, they go out on schedule.    |
|              [See the work]      [Pricing]                          |
|                                                                     |
|        +------------- white framed card -----------------+          |
|        |  phone feed mock: Brew Haus . Instagram          |          |
|        |  [ LEAD post lands here ]  [Scheduled . Mon 7am] |  <- chip |
|        +--------------------------------------------------+          |
|        (NFTek) (Brew Haus) (Ironworks Gym) (Ace Auto)   [pause]     |  <- auto-cycle
+=====================================================================+
Work
  NFTek | Brew Haus | Ironworks Gym | Ace Auto           <- customer tabs
  (Instagram) (Facebook)                                 <- platform pills, vary
  [white card] [white card] [white card] [white card]    <- click opens lightbox
How it works    three white cards, numbered 1 2 3
Pricing         three cards, Standard lifted with a --grape "Recommended" badge
Contact         --lilac band, one line, [Email me]
```

- Hero card: white, radius 20px, soft shadow, holds a phone-shaped feed frame
  showing the selected customer's LEAD piece in that customer's first platform's
  template. Under the card: one pill per customer, plus a pause/play button.
- Work grid: white cards, radius 16px, 1px --line border, gap 1.5rem; 4 / 2 / 1
  columns at the same breakpoints as Style 1.
- Steps: three white cards in a row, each with its number set large in --grape.
- Pricing: three cards, the Standard card raised 12px with the badge.
- Contact: --lilac band spanning the page.

### 5.4 Signature: the schedule chip

When a customer pill is selected, the LEAD post slides into the phone feed, then
a small chip pops in reading `Scheduled . {day} {time}`:

| Customer | Chip |
|---|---|
| NFTek | Scheduled . Tue 8:00am |
| Brew Haus | Scheduled . Mon 7:00am |
| Ironworks Gym | Scheduled . Wed 6:00am |
| Ace Auto Repair | Scheduled . Thu 9:00am |

Scheduling is the actual service, so the one animated detail says the one thing
that matters: the owner does not post it themselves. In the work gallery the
chip appears on hover and focus. Accepted risk: it can look like a
scheduling-tool product page; the copy says "I post it for you" and there is no
sign-up.

### 5.5 Motion

- Hero auto-cycle: next customer every 4 seconds. Stops on hover, focus or
  click anywhere in the hero card or pills. Pause/play button, visible, with a
  text label. Never restarts on its own after a manual click.
- Pill switch: outgoing content fades out, incoming slides 24px and fades in,
  350ms ease-out. Chip pops in 200ms after the post lands.
- Sections fade up 16px once when scrolled into view.
- Post cards lift 4px with a stronger shadow on hover and focus.
- Lightbox fades in and scales from 96%.
- `prefers-reduced-motion: reduce` disables all of the above: instant swaps, no
  auto-cycle, no reveals, no lift.

## 6. Shared behavior (`mockups/behavior.js`)

One script, loaded by both HTML files, no dependencies.

- Renders the work gallery from `content.js` for the selected customer and
  platform. Customer tabs and platform pills are real `<button>` elements inside
  `role="tablist"` containers with `aria-selected`, `aria-controls`, and
  left/right arrow-key movement.
- Switching customer resets the platform to that customer's first platform.
- Lightbox: opens on click or Enter on a post card, shows the post larger with
  its caption and metadata, traps focus, closes on Escape, the close button,
  or a click outside. Returns focus to the card that opened it.
- Style 2 only: hero cycler with pause/play; the same script exposes it and the
  Style 1 page simply has no hero mount point.
- Mockup controls strip: tagline a / b / c buttons (see 3.6).
- Every gallery card is rendered as a wrapper (metadata strip, schedule chip,
  crop-mark hooks) around the post itself. The wrapper belongs to the style
  CSS: Style 1 shows the crop marks and metadata strip and hides the chip;
  Style 2 shows the chip on hover and focus and hides the crop marks. The post
  inside the wrapper is identical in both.
- Motion checks `matchMedia('(prefers-reduced-motion: reduce)')` once and
  toggles a class on `<html>`; CSS does the rest.
- Each style file styles the same class names; `posts.css` owns everything inside
  a post card (the artwork, the four templates). Style CSS owns everything around
  it. The two must not fight: no style rule targets the inside of a post.

Post artwork is built from the piece data: background from the customer palette,
headline in Gabarito 800 and supporting text in Gabarito 500 (the artwork looks
the same in both mockups), the platform chrome around it in the system font
stack as a real phone would show it, and the SVG motif. Crops for 16:9 (X) and
the story frame are CSS `aspect-ratio` plus positioning of the artwork block
inside an overflow-hidden frame.

## 7. Accessibility and responsive floor

- Contrast AA on every text-on-ground pair listed above; verified by computing
  the ratio before shipping.
- Visible focus rings in each style's purple, 2px, offset 2px, on every
  interactive element.
- All post text is real text in the DOM. Motifs are decorative SVG with
  `aria-hidden="true"`.
- Headings in order: one h1 (the tagline), h2 per section.
- Breakpoints: 4 columns above 1100px, 2 columns 560 to 1100px, 1 column below
  560px. Hero card stacks under the headline below 900px. Pill rows scroll
  horizontally on narrow screens with no visible scrollbar and no clipped focus
  ring. No horizontal page scroll at 375px. Tap targets at least 44px tall.
- The gallery is rendered by script; a `<noscript>` line points at the email
  address so the page is never empty.

## 8. Files

```
newtzmedia-site/
  README.md
  docs/superpowers/specs/2026-09-24-newtzmedia-mockups-design.md   (this file)
  mockups/
    content.js         customers, pieces, captions, steps, tiers, copy, taglines
    logic.js           pure selectors and HTML-string renderers; Node-tested
    behavior.js        tabs, pills, gallery render, lightbox, hero cycler,
                       reduced motion, mockup controls
    posts.css          post artwork and the four platform templates
    minimal.html       Style 1 page
    minimal.css        Style 1 tokens, layout, proof-sheet signature
    interactive.html   Style 2 page
    interactive.css    Style 2 tokens, layout, hero band, chip signature
  tests/
    content.test.js
    logic.test.js
    render.test.js
    pages.test.js
```

The real site will later take the repo root; the mockups stay in `mockups/`.

## 9. Verification before Zack sees it

1. Open each HTML file from disk in a browser: no console errors, fonts load,
   gallery renders for every customer and platform combination (9 combinations).
2. Keyboard only: reach every tab, pill, post, lightbox and the mockup controls;
   Escape closes the lightbox; focus returns.
3. Reduced motion on: no auto-cycle, instant swaps.
4. 375px wide: no horizontal scroll, pills scroll, hero stacks.
5. Contrast ratios computed for every pair in sections 4.1 and 5.1.
6. Run the web-design-guidelines review on all seven mockup files; fix findings.
7. Send both HTML files to Zack and ask for a decision with lettered options.

## 10. Out of scope

The real site, hosting, a domain, a real email address, real posts, a CMS,
analytics, a contact form, payment, YouTube, TikTok, drawn illustration,
a dark-mode toggle for Style 2, and any choice of purple beyond the two above
(Zack can ask for a color round after seeing them).

## 11. Honesty notes for launch (not for the mockup)

Before this page goes live, the fictional customers must be replaced by real
spec work or clearly labelled sample work, prices must be real, and the email
must be real. The mockups are for choosing a direction only.
