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
