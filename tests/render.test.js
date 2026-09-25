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
  assert.equal(L.renderContact(), `<p>Tell me about your business and I’ll reply within a day.</p><a class="btn" href="mailto:hello@newtzmedia.example">hello@newtzmedia.example</a>`);
  assert.equal(L.renderFooterNote(), 'Sample work. Businesses shown are fictional except NFTek.');
});

test('every text field is escaped', () => {
  const c = Object.assign({}, L.customerById('brewhaus'), { name: 'A&B <Co>' });
  const html = L.renderPost(c, piece('brewhaus-fall'), 'instagram');
  assert.ok(html.includes('A&amp;B &lt;Co&gt;'));
  assert.ok(!html.includes('<Co>'));
});
