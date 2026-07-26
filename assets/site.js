/* ============================================================
   FifthStar — shared reveal/motion system
   Loaded at end of <body> on every page (hub, category, client).
   Motion is OFF by design (2026-07-26): content is shown directly via CSS
   (.reveal{opacity:1}); this script only marks .reveal elements and renders
   [data-count] proof stats at their final value. No entrance/scroll animation,
   no GSAP usage. The inline head script's `gsap-hero` class is stripped so the
   hero is never left hidden.
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

  // --- Hero soft-glow (pointer-follow) disabled: motion off by design (2026-07-26) ---

  // --- GSAP additive motion: disabled by design (2026-07-26) ---
  // No hero entrance, no SplitText headline reveal, no scroll triggers.
  // Content is shown directly via CSS; this keeps GSAP scripts inert.
  bail(); return;
})();
