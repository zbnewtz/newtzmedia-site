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
