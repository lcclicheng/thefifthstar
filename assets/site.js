/* ============================================================
   FifthStar — shared motion + reveal system
   Loaded at end of <body> on every page (hub, category, client).
   - Reveal-on-scroll (IntersectionObserver) — works with or without GSAP.
   - If self-hosted GSAP + ScrollTrigger + SplitText are present, adds a
     hero entrance, headline word/char reveal, and soft watermark parallax.
   - Honours prefers-reduced-motion. Never leaves content hidden if
     anything fails: the inline head script sets `gsap-hero` (which hides
     hero elements pre-paint); we strip it on any non-animated exit.
   ============================================================ */
(function () {
  var root = document.documentElement;
  function bail() { root.classList.remove('gsap-hero'); } // reveal hero no matter what
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduce) { bail(); }

  // --- Reveal-on-scroll (always) ---
  (function () {
    var els = document.querySelectorAll('.reveal');
    if (reduce || !('IntersectionObserver' in window)) {
      els.forEach(function (e) { e.classList.add('in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    els.forEach(function (e) { io.observe(e); });
  })();

  // --- GSAP additive motion (optional) ---
  if (reduce || !window.gsap || !window.ScrollTrigger) { bail(); return; }
  try {
    gsap.registerPlugin(ScrollTrigger, SplitText);
    var EASE = "power3.out";
    // Hero entrance — explicit fromTo so the pre-paint (CSS) hidden state always resolves to visible
    var tl = gsap.timeline({ defaults: { ease: EASE, duration: 0.9 }, onComplete: bail });
    tl.fromTo(".hero .eyebrow", { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1 })
      .fromTo(".hero h1", { y: 40, autoAlpha: 0 }, { y: 0, autoAlpha: 1 }, "-=0.5")
      .fromTo(".hero .lead", { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1 }, "-=0.6")
      .fromTo(".hero .cta-row", { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1 }, "-=0.6")
      .fromTo(".hero .trust-top", { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1 }, "-=0.7")
      .fromTo(".hero .badges", { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1 }, "-=0.7");
    // SplitText on section headlines (h2 carries no .reveal, so no property clash with parent fade)
    SplitText.create("section h2, .biz-hero h1, .final h2", {
      type: "words,chars", mask: "chars", autoSplit: true,
      onSplit: function (self) {
        return gsap.from(self.chars, {
          yPercent: 110, opacity: 0, duration: 0.6, ease: EASE, stagger: 0.012,
          scrollTrigger: { trigger: self.element, start: "top 90%" }
        });
      }
    });
    // Decorative: gentle parallax drift on the signature watermarks (additive only, no FOUC)
    gsap.utils.toArray(".sig-watermark").forEach(function (wm) {
      var trig = wm.closest("section, header, .final") || wm;
      gsap.to(wm, { yPercent: -18, opacity: 0.09, ease: "none",
        scrollTrigger: { trigger: trig, start: "top bottom", end: "bottom top", scrub: true } });
    });
    // Refresh after layout settles AND after web fonts load (fixes SplitText reflow jump on h2)
    window.addEventListener("load", function () { ScrollTrigger.refresh(); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { ScrollTrigger.refresh(); });
  } catch (e) {
    gsap.set("*", { clearProps: "all" }); // any failure -> strip inline styles back to CSS
    bail();                                // and reveal the hero no matter what
  }
})();
