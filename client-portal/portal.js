/* ============================================================
   FifthStar Client Portal — renderer (zero-server)
   Each portal page fetches ./data.json and renders three views:
   ① Review reply calendar  ② Website preview + change requests
   ③ Billing & renewal status.
   Design Language v1.0: all-dark shell, brand gold constant,
   per-merchant --accent (set via data.merchant.accent).
   ============================================================ */
(function () {
  "use strict";
  var root = document.documentElement;

  function star(n) {
    n = Math.max(0, Math.min(5, Math.round(n)));
    return "★★★★★".slice(0, n) + "☆☆☆☆☆".slice(0, 5 - n);
  }
  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  function money(n) { return "£" + Number(n).toLocaleString("en-GB"); }

  function render(d) {
    var m = d.merchant, sub = d.subscription, ins = d.insights;
    if (m.accent) root.style.setProperty("--accent", m.accent);

    // Hero
    document.getElementById("eyebrow").textContent =
      m.city + " · " + m.industry + (d.sample ? " · sample" : "");
    document.getElementById("m-name").textContent = m.name;
    document.getElementById("m-tag").textContent =
      "Your FifthStar dashboard — " + sub.tier + " plan." +
      (d.sample ? " This is a working sample built from a real showcase client." : "");

    var sampleFlag = d.sample
      ? '<span class="sample-flag">Working sample · not a real account</span>'
      : "";

    // Stat strip
    var stats = [
      { k: "Google rating", v: m.googleRating.toFixed(1) + " <small>" + star(m.googleRating) + "</small>" },
      { k: "Reviews replied (Jul)", v: ins.reviewsReplied + " <small>/" + ins.newReviews + " new</small>" },
      { k: "Reply rate", v: ins.replyRatePct + "%" },
      { k: "Avg reply time", v: ins.avgResponseDays + " <small>days</small>" }
    ].map(function (s) {
      return '<div class="glass-card"><div class="k">' + s.k + '</div><div class="v">' + s.v + '</div></div>';
    }).join("");

    // View ① — Review calendar
    var reviews = (d.reviewCalendar || []).map(function (r) {
      return '<div class="review-item tone-' + esc(r.tone) + '">' +
        '<div class="review-top">' +
          '<span class="review-author">' + esc(r.author) + '</span>' +
          '<span class="badge ' + esc(r.status) + '">' + esc(r.status) + '</span>' +
        '</div>' +
        '<div class="review-stars">' + star(r.rating) + ' <span class="review-date">' + esc(r.date) + '</span></div>' +
        '<p class="review-snippet">“' + esc(r.snippet) + '”</p>' +
      '</div>';
    }).join("");

    // View ② — Website
    var w = d.website;
    var chg = (w.pendingRequests || []).map(function (c) {
      return '<div class="chg-item"><span><span class="id">' + esc(c.id) + '</span> · ' + esc(c.type) +
        '</span><span class="badge ' + esc(c.status) + '">' + esc(c.status) + '</span></div>';
    }).join("");

    // View ③ — Billing
    var billPrice = sub.firstYearWelcome
      ? money(sub.welcomeMonthly) + '/mo <small style="color:var(--mute)">(welcome price until ' + esc(sub.welcomeUntil) + ')</small>'
      : money(sub.monthlyGbp) + '/mo';
    var billing =
      '<div class="bill-row"><span class="lbl">Plan</span><span class="val">' + esc(sub.tier) + '</span></div>' +
      '<div class="bill-row"><span class="lbl">Current price</span><span class="val">' + billPrice + '</span></div>' +
      '<div class="bill-row"><span class="lbl">Next billing</span><span class="val">' + esc(sub.nextBilling) + '</span></div>' +
      '<div class="bill-row"><span class="lbl">Payment method</span><span class="val">' + esc(sub.paymentMethod) + '</span></div>' +
      '<div class="bill-row"><span class="lbl">Status</span><span class="val" style="color:#7FD1A6">' + esc(sub.status) + '</span></div>' +
      '<div class="bill-cta"><a class="nav-cta" href="mailto:hello@thefifthstar.site?subject=Billing%20question%20—%20' + encodeURIComponent(m.name) + '">Questions about a bill?</a></div>';

    var html =
      '<div class="portal-head">' + sampleFlag + '</div>' +
      '<div class="stat-strip">' + stats + '</div>' +
      '<div class="view-grid">' +
        '<div class="view-col">' +
          '<section class="glass-card reveal">' +
            '<div class="sec-title"><h2>Review replies</h2><span class="hint">latest first</span></div>' +
            reviews +
          '</section>' +
          '<section class="glass-card reveal">' +
            '<div class="sec-title"><h2>Website</h2><a class="hint" href="' + esc(w.url) + '" target="_blank" rel="noopener">View live →</a></div>' +
            '<div class="bill-row"><span class="lbl">Status</span><span class="val" style="color:#7FD1A6">' + esc(w.status) + '</span></div>' +
            '<div class="bill-row"><span class="lbl">Pages</span><span class="val">' + esc(w.pages) + '</span></div>' +
            '<div class="bill-row"><span class="lbl">Last update</span><span class="val">' + esc(w.lastUpdate) + '</span></div>' +
            '<div style="margin-top:16px" class="sec-title"><h2 style="font-size:1.1rem">Change requests</h2></div>' +
            (chg || '<div class="portal-note">No pending requests.</div>') +
            '<div class="bill-cta"><a class="nav-cta" href="mailto:hello@thefifthstar.site?subject=Website%20change%20—%20' + encodeURIComponent(m.name) + '">Request a change</a></div>' +
          '</section>' +
        '</div>' +
        '<div class="view-col">' +
          '<section class="glass-card reveal">' +
            '<div class="sec-title"><h2>Billing &amp; renewal</h2></div>' +
            billing +
          '</section>' +
          '<section class="glass-card reveal">' +
            '<div class="sec-title"><h2>This month</h2><span class="hint">' + esc(ins.month) + '</span></div>' +
            '<div class="bill-row"><span class="lbl">New reviews</span><span class="val">' + ins.newReviews + '</span></div>' +
            '<div class="bill-row"><span class="lbl">Rating trend</span><span class="val" style="color:var(--accent)">' + esc(ins.ratingTrend) + '</span></div>' +
            '<div class="bill-row"><span class="lbl">Cancel anytime</span><span class="val" style="color:#7FD1A6">Yes</span></div>' +
          '</section>' +
        '</div>' +
      '</div>';

    document.getElementById("app").innerHTML = html;
  }

  function fail(msg) {
    document.getElementById("app").innerHTML =
      '<div class="portal-error">Could not load this portal: ' + esc(msg) +
      '. If you followed a link Ethan sent, it may have expired — just reply to any FifthStar email and we’ll sort it.</div>';
  }

  function loadData() {
    return fetch("./data.json", { cache: "no-store" })
      .then(function (r) { if (!r.ok) throw new Error("HTTP " + r.status); return r.json(); })
      .catch(function () {
        // file:// fallback: use inline JSON (GitHub Pages / http uses the fetched file)
        var el = document.getElementById("portal-data");
        if (el && el.textContent && el.textContent.trim()) {
          try { return JSON.parse(el.textContent); } catch (e) {}
        }
        throw new Error("no data source (open via http:// or deploy online)");
      });
  }
  loadData().then(render).catch(function (e) { fail(e && e.message ? e.message : "unknown error"); });
})();
