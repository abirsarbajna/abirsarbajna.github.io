(function () {
  /* Enable scroll-reveal hiding only now that JS is confirmed running.
     CSS hides [data-reveal] sections only when <html> has .reveal-on, so if
     this script ever fails to load, all content stays fully visible. */
  document.documentElement.classList.add('reveal-on');

  /* Mobile navigation toggle */
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* Protected email links.
     The full address is never present in the page source. Markup carries the
     username and domain as separate base64 attributes; the address is assembled
     only when the visitor clicks. Naive scrapers cannot harvest it from the HTML.
       <a class="js-email" data-eu="<base64 user>" data-ed="<base64 domain>" href="#">Label</a>

     Technique: set the real mailto: href on pointerdown (fires before click),
     so the browser sees a genuine href on the element when the click lands.
     This keeps navigation inside the original user gesture and is never blocked
     by Chrome / Safari popup / navigation policies. */
  document.querySelectorAll('.js-email').forEach(function (el) {
    el.setAttribute('title', 'Opens your email client');
    function setMailto() {
      try {
        var u = atob(el.getAttribute('data-eu') || '');
        var d = atob(el.getAttribute('data-ed') || '');
        if (u && d) { el.href = 'mailto:' + u + '@' + d; }
      } catch (err) { /* ignore malformed attributes */ }
    }
    el.addEventListener('pointerdown', setMailto);
    el.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { setMailto(); }
    });
  });

  /* Scroll reveal (respects reduced-motion via CSS + guard here) */
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var items = document.querySelectorAll('[data-reveal]');
  if (reduce || !('IntersectionObserver' in window)) {
    items.forEach(function (el) { el.classList.add('in'); });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  items.forEach(function (el) { io.observe(el); });
})();
