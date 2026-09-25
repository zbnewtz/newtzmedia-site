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
