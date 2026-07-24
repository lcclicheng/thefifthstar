/* ============================================================
   FifthStar hub page (integrated-offer.html) - page-specific scripts.
   Widget config + render (review demo) and the capture form mailto handler.
   Reveal + GSAP motion live in the shared assets/site.js.
   ============================================================ */

/* --- Review widget config --- */
        window.FIFTHSTAR_REVIEW_WIDGET = {
          title: "What our customers say",
          googleUrl: "https://www.google.com/maps",
          maxReviews: 4,
          showAttribution: true,
          reviews: [
            {author:"Sarah M.",rating:5,text:"Absolutely lovely Sunday roast — generous portions and the staff remembered our names. We’ll be back.",date:"2026-03-14",url:"https://www.google.com/maps"},
            {author:"James T.",rating:4,text:"Great coffee and a calm corner to work from. Only wish they opened an hour earlier on weekends.",date:"2026-02-02",url:"https://www.google.com/maps"},
            {author:"Priya K.",rating:5,text:"Took my mum for her birthday and they made her a wee card on the house. Lovely touch.",date:"2025-11-20",url:"https://www.google.com/maps"},
            {author:"Daniel O.",rating:4,text:"Solid brunch spot. Busy on Saturdays so book ahead, but worth it.",date:"2025-10-08",url:"https://www.google.com/maps"}
          ]
        };


/* --- Review widget render --- */
      (function(){
        var CFG = window.FIFTHSTAR_REVIEW_WIDGET || {};
        var EL = document.getElementById('fifthstar-reviews');
        if(!EL) return;
        EL.classList.add('fs-rw');
        if(CFG.accent) EL.style.setProperty('--fs-accent', CFG.accent);
        function stars(n){n=Math.max(0,Math.min(5,n|0));var s='';for(var i=1;i<=5;i++)s+=i<=n?'★':'<span class="fs-empty">★</span>';return s;}
        function rel(d){if(!d)return'';var dt=new Date(d),now=new Date();if(isNaN(dt))return'';var days=Math.floor((now-dt)/86400000);if(days<1)return'today';if(days<30)return days+' day'+(days>1?'s':'')+' ago';if(days<365){var m=Math.floor(days/30);return m+' month'+(m>1?'s':'')+' ago';}var y=Math.floor(days/365);return y+' year'+(y>1?'s':'')+' ago';}
        function esc(t){return String(t==null?'':t).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
        var reviews=(CFG.reviews||[]).slice(0,CFG.maxReviews||5);
        var avg=reviews.length?(reviews.reduce(function(a,r){return a+(r.rating||0);},0)/reviews.length).toFixed(1):'—';
        var html='';
        if(CFG.title)html+='<div class="fs-rw-head"><h3 class="fs-rw-title">'+esc(CFG.title)+'</h3>'+(CFG.googleUrl?'<span class="fs-rw-score"><a href="'+esc(CFG.googleUrl)+'" target="_blank" rel="noopener">'+avg+' ★ on Google</a></span>':'')+'</div>';
        html+='<div class="fs-rw-grid">';
        reviews.forEach(function(r){html+='<div class="fs-rw-card"><div class="fs-rw-stars" aria-label="'+(r.rating||0)+' out of 5">'+stars(r.rating)+'</div><p class="fs-rw-text">'+esc(r.text)+'</p><div class="fs-rw-meta"><span>'+esc(r.author||'Local customer')+'</span>'+(r.url?'<a href="'+esc(r.url)+'" target="_blank" rel="noopener">'+(rel(r.date)||'on Google')+'</a>':'<span>'+(rel(r.date)||'')+'</span>')+'</div></div>';});
        html+='</div>';
        if(CFG.showAttribution!==false)html+='<div class="fs-rw-foot">Reputation widget by <a href="https://thefifthstar.site" target="_blank" rel="noopener">FifthStar</a></div>';
        EL.innerHTML=html;
      })();


/* --- Capture form (3 free replies mailto) --- */
(function(){
  var form = document.getElementById('captureForm');
  if(!form) return;
  form.addEventListener('submit', function(e){
    e.preventDefault();
    var biz = (document.getElementById('capBiz').value || '').trim();
    var gbp = document.getElementById('capGbp').value.trim();
    var email = document.getElementById('capEmail').value.trim();
    if(!gbp || !email){
      if(!gbp) document.getElementById('capGbp').focus();
      else document.getElementById('capEmail').focus();
      return;
    }
    var subject = 'My 3 free review replies' + (biz ? ' — ' + biz : '');
    var body = 'Hi Ethan,\n\nPlease could you write me my 3 free Google review replies?\n\n'
      + 'Business: ' + (biz || '(not given)') + '\n'
      + 'Google Business Profile: ' + gbp + '\n'
      + 'My email: ' + email + '\n\n'
      + 'Thanks!';
    window.location.href = 'mailto:hello@thefifthstar.site?subject='
      + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
  });
})();

