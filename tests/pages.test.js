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
