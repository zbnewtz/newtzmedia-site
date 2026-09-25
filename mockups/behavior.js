// behavior.js - DOM wiring for both mockups. Everything it inserts comes from
// NEWTZ_LOGIC; this file only reads the page, swaps HTML and listens to events.
// Task 6 appends the lightbox, the hero cycler and the scroll reveals.
(function () {
  'use strict';
  const C = globalThis.NEWTZ_CONTENT;
  const L = globalThis.NEWTZ_LOGIC;
  const root = document.documentElement;
  const STYLE = root.dataset.style; // 'minimal' | 'interactive'
  const $ = (sel, el) => (el || document).querySelector(sel);

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

  // ---- static sections
  const mount = (name, html) => {
    const el = $('[data-mount="' + name + '"]');
    if (el) el.innerHTML = html;
  };
  mount('steps', L.renderSteps());
  mount('tiers', L.renderTiers());
  mount('contact', L.renderContact());
  mount('footer', L.renderFooterNote());

  // ---- tagline (mockup controls strip)
  function setTagline(key) {
    const t = L.taglineFor(STYLE, key);
    mount('headline', t.headlineHtml);
    const sub = $('[data-mount="subline"]');
    if (sub) sub.textContent = t.subline;
    document.querySelectorAll('[data-tagline]').forEach((b) => {
      b.setAttribute('aria-pressed', String(b.dataset.tagline === key));
    });
  }
  document.querySelectorAll('[data-tagline]').forEach((b) => {
    b.addEventListener('click', () => setTagline(b.dataset.tagline));
  });
  setTagline('a');

  // ---- work section: customer tabs, platform tabs, gallery
  const state = { customer: C.customers[0].id, platform: C.customers[0].platforms[0] };
  const ctabs = $('[data-customer-tabs]');
  const ptabs = $('[data-platform-tabs]');
  const gallery = $('#gallery');

  function renderWork(animate) {
    ctabs.innerHTML = L.renderCustomerTabs(state.customer);
    ptabs.innerHTML = L.renderPlatformTabs(state.customer, state.platform);
    gallery.setAttribute('aria-labelledby', 'ctab-' + state.customer + ' ptab-' + state.platform);
    const html = L.renderGallery(state.customer, state.platform);
    const ms = animate ? swapMs() : 0;
    if (ms === 0) { gallery.innerHTML = html; return; }
    gallery.classList.add('is-swapping');
    setTimeout(() => {
      gallery.innerHTML = html;
      gallery.classList.remove('is-swapping');
    }, ms);
  }
  function selectCustomer(id) {
    state.customer = id;
    state.platform = L.platformsFor(id)[0]; // spec 6: platform resets on customer change
    renderWork(true);
  }
  function selectPlatform(id) {
    state.platform = id;
    renderWork(true);
  }
  ctabs.addEventListener('click', (e) => {
    const b = e.target.closest('[data-customer]');
    if (b) selectCustomer(b.dataset.customer);
  });
  ptabs.addEventListener('click', (e) => {
    const b = e.target.closest('[data-platform]');
    if (b) selectPlatform(b.dataset.platform);
  });

  // Arrow keys move between tabs and activate the focused one. The tabs are
  // re-rendered on activation, so focus is restored by id afterwards.
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
      if (fresh) fresh.focus();
    });
  }
  tablistKeys(ctabs, (b) => selectCustomer(b.dataset.customer));
  tablistKeys(ptabs, (b) => selectPlatform(b.dataset.platform));
  renderWork(false);

  globalThis.NEWTZ_APP = { state, selectCustomer, selectPlatform, setTagline, tablistKeys, motionOk };
})();
