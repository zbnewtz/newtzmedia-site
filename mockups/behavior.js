// behavior.js - DOM wiring for both mockups. Everything it inserts comes from
// NEWTZ_LOGIC; this file only reads the page, swaps HTML and listens to events.
// Task 6 appends the lightbox, the hero cycler and the scroll reveals.
(function () {
  'use strict';
  const C = globalThis.NEWTZ_CONTENT;
  const L = globalThis.NEWTZ_LOGIC;
  const root = document.documentElement;
  root.classList.add('js'); // the reveal styles key off this so the page is never empty without scripts
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

  // ---- lightbox: the native <dialog> gives the focus trap and Escape for free
  const dialog = $('[data-lightbox]');
  const dialogBody = $('[data-lightbox-body]');
  let opener = null;
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.card__open');
    if (!btn || !dialog || dialog.open) return;
    const card = btn.closest('.card');
    const customer = L.customerById(card.dataset.customer);
    const piece = C.pieces.find((p) => p.id === card.dataset.piece);
    dialogBody.innerHTML = L.renderCard(customer, piece, card.dataset.platform);
    const inner = dialogBody.querySelector('.card__open');
    if (inner) inner.remove(); // no second open button inside the lightbox
    opener = btn;
    dialog.showModal();
  });
  if (dialog) {
    dialog.addEventListener('click', (e) => { if (e.target === dialog) dialog.close(); }); // backdrop click
    $('[data-close]', dialog).addEventListener('click', () => dialog.close());
    dialog.addEventListener('close', () => {
      if (opener && document.contains(opener)) opener.focus();
      opener = null;
    });
  }

  // ---- hero cycler (interactive only; the minimal page has no [data-hero])
  const hero = $('[data-hero]');
  let heroApi = {};
  if (hero) {
    const frame = $('[data-hero-frame]', hero);
    const pills = $('[data-hero-pills]', hero);
    const toggle = $('[data-hero-toggle]', hero);
    const PERIOD = 4000;          // spec 5.5: next customer every 4 seconds
    let current = C.customers[0].id;
    let timer = null;             // interval handle while cycling
    let stopped = false;          // true after a pill click, a hero-card click, or Pause: the intent (and the toggle label) never restarts on its own once true
    let hovering = false;         // pointer or focus inside the hero pauses it

    function show(id, animate) {
      current = id;
      pills.innerHTML = L.renderCustomerTabs(id, { prefix: 'htab', controls: 'hero-panel' });
      const html = L.renderHeroPost(id);
      const ms = animate ? Math.min(swapMs(), 150) : 0; // 150ms fade out, then the CSS slide-in runs
      if (ms === 0) { frame.innerHTML = html; return; }
      frame.classList.add('is-leaving');
      setTimeout(() => {
        frame.innerHTML = html;
        frame.classList.remove('is-leaving');
      }, ms);
    }
    const running = () => timer !== null;
    function syncToggle() { toggle.textContent = stopped ? C.copy.play : C.copy.pause; } // label reflects intent (stopped), not the live running() state, so a hover/focus pause never flips it
    function start(force) {
      if (running() || stopped || (!force && hovering) || !motionOk()) { syncToggle(); return; }
      timer = setInterval(() => show(L.nextCustomerId(current), true), PERIOD);
      syncToggle();
    }
    function stop() {
      if (running()) { clearInterval(timer); timer = null; }
      syncToggle();
    }
    const pick = (b) => { stopped = true; stop(); show(b.dataset.customer, true); };
    pills.addEventListener('click', (e) => { const b = e.target.closest('[data-customer]'); if (b) pick(b); });
    tablistKeys(pills, pick);
    toggle.addEventListener('click', () => {
      stopped = !stopped;
      if (stopped) stop(); else start(true);
    });
    hero.addEventListener('click', (e) => {
      if (e.target.closest('[data-hero-toggle]')) return; // spec 5.5: a click anywhere else in the hero card is a manual stop that never restarts on its own
      stopped = true;
      stop();
    });
    hero.addEventListener('mouseenter', () => { hovering = true; stop(); });
    hero.addEventListener('mouseleave', () => { hovering = false; start(false); });
    hero.addEventListener('focusin', () => { hovering = true; stop(); });
    hero.addEventListener('focusout', (e) => {
      if (!hero.contains(e.relatedTarget)) { hovering = false; start(false); }
    });
    mq.addEventListener('change', () => { if (!motionOk()) stop(); });

    show(current, false);
    start(false);
    heroApi = { heroRunning: running, heroCurrent: () => current, heroShow: show };
  }

  // ---- scroll reveals (interactive only; the minimal page has no [data-reveal])
  const reveals = document.querySelectorAll('[data-reveal]');
  if (reveals.length) {
    if (!motionOk() || !('IntersectionObserver' in window)) {
      reveals.forEach((el) => el.classList.add('is-in'));
    } else {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
        });
      }, { threshold: 0.12 });
      reveals.forEach((el) => io.observe(el));
    }
  }

  globalThis.NEWTZ_APP = Object.assign({ state, selectCustomer, selectPlatform, setTagline, tablistKeys, motionOk }, heroApi);
})();
