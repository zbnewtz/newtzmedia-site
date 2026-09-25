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
