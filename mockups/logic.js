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

  return {
    escapeHtml, customerById, platformsFor, piecesFor, nextCustomerId, chipFor,
    displayRatio, frameClass, artText, taglineFor,
    renderArt, renderPost, renderCard, renderGallery, renderCustomerTabs, renderPlatformTabs,
    renderHeroPost, renderSteps, renderTiers, renderContact, renderFooterNote,
  };
})(globalThis.NEWTZ_CONTENT);
