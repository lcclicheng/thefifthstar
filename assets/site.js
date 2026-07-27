/* ============================================================
   FifthStar — shared reveal/motion system
   Loaded at end of <body> on every page (hub, category, client).
   Motion is OFF by design (2026-07-26): content is shown directly via CSS
   (.reveal{opacity:1}); this script only marks .reveal elements, renders
   [data-count] proof stats at their final value, and adds a lightweight
   hero ambient-glow pointer-follow. No entrance/scroll animation, no GSAP.
   The inline head script's `gsap-hero` class is stripped so the hero is
   never left hidden.
   ============================================================ */
(function () {
  var root = document.documentElement;
  function bail() { root.classList.remove('gsap-hero'); } // reveal hero no matter what
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduce) { bail(); }

  // --- Reveal: direct display (motion off by design, 2026-07-26) ---
  // Content is visible by default via CSS (.reveal{opacity:1}); we just mark
  // everything revealed so any straggler styling is a no-op. No fade, no
  // scroll-triggered transition, no IntersectionObserver jank on scroll.
  (function () {
    var els = document.querySelectorAll('.reveal');
    els.forEach(function (e) { e.classList.add('in'); });
  })();

  // --- Count-up numbers (Proof stats) — shown at final value immediately ---
  (function () {
    var nums = document.querySelectorAll('[data-count]');
    if (!nums.length) return;
    nums.forEach(function (n) {
      var d = parseInt(n.getAttribute('data-decimals') || '0', 10);
      n.textContent = parseFloat(n.getAttribute('data-count')).toFixed(d) + (n.getAttribute('data-suffix') || '');
    });
  })();

  // --- Hero ambient glow: pointer-follow (lightweight, no scroll/entrance motion) ---
  (function () {
    if (reduce) return;
    var hero = document.querySelector('.hero');
    var glow = document.querySelector('.hero-glow');
    if (!hero || !glow) return;
    var lastX = 50, lastY = 26, ticking = false;
    function update() {
      glow.style.setProperty('--mx', lastX + '%');
      glow.style.setProperty('--my', lastY + '%');
      ticking = false;
    }
    hero.addEventListener('mousemove', function (e) {
      var r = hero.getBoundingClientRect();
      lastX = (e.clientX - r.left) / r.width * 100;
      lastY = (e.clientY - r.top) / r.height * 100;
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    });
    hero.addEventListener('mouseleave', function () {
      lastX = 50; lastY = 26;
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    });
  })();

  // --- Responsive nav: mobile hamburger toggle (open/close + close on link tap) ---
  (function () {
    var toggles = document.querySelectorAll('.nav-toggle');
    toggles.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var nav = btn.closest('.nav');
        if (!nav) return;
        var open = nav.classList.toggle('open');
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
        btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      });
    });
    document.querySelectorAll('.nav-menu a').forEach(function (a) {
      a.addEventListener('click', function () {
        var nav = a.closest('.nav');
        if (nav) { nav.classList.remove('open'); var t = nav.querySelector('.nav-toggle'); if (t) t.setAttribute('aria-expanded', 'false'); }
      });
    });
  })();

  // --- Privacy-friendly analytics: Plausible (no cookies, no personal identifiers).
  //   Currently DISABLED. To enable: sign up at https://plausible.io, add the
  //   domain "thefifthstar.site" to your account, then set ANALYTICS: true below.
  (function () {
    var CONFIG = { ANALYTICS: false, ANALYTICS_DOMAIN: 'thefifthstar.site' };
    if (!CONFIG.ANALYTICS || !CONFIG.ANALYTICS_DOMAIN) return;
    if (document.querySelector('script[data-domain="' + CONFIG.ANALYTICS_DOMAIN + '"]')) return;
    var s = document.createElement('script');
    s.defer = true;
    s.setAttribute('data-domain', CONFIG.ANALYTICS_DOMAIN);
    s.src = 'https://plausible.io/js/script.js';
    document.head.appendChild(s);
  })();

  // --- Social links: centralised config, filled site-wide (avoids per-page edits).
  //   Platforms left blank keep their graceful fallthrough to the contact page.
  (function () {
    var SOCIALS = {
      facebook: 'https://www.facebook.com/thefifthstarbuilds/',
      instagram: 'https://www.instagram.com/thefifthstarbuilds/',
      whatsapp: 'https://wa.me/8619056142535',
      linkedin: ''    // provide URL when available
    };
    var labels = { facebook: 'Facebook', instagram: 'Instagram', whatsapp: 'WhatsApp', linkedin: 'LinkedIn' };
    document.querySelectorAll('.foot-social a').forEach(function (a) {
      var t = a.getAttribute('title') || '';
      var key = null;
      for (var k in labels) { if (t.indexOf(labels[k]) !== -1) { key = k; break; } }
      if (!key) return;
      var url = SOCIALS[key];
      if (!url) return; // no real link yet → keep fallthrough to contact page
      a.setAttribute('href', url);
      a.setAttribute('title', 'FifthStar on ' + labels[key]);
      a.setAttribute('target', '_blank');
      a.setAttribute('rel', 'noopener noreferrer');
    });
  })();

  // --- GSAP additive motion: disabled by design (2026-07-26) ---
  // No hero entrance, no SplitText headline reveal, no scroll triggers.
  // Content is shown directly via CSS; GSAP vendor scripts have been removed.
  bail(); return;
})();
