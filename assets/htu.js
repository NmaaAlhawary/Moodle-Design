// HTU eLearning prototype — small interactions shared by every page.
(function () {
  // Segmented controls, tabs and chip rows: clicking one marks it active.
  document.querySelectorAll('.seg, .tabs, .sectionbar nav').forEach(function (group) {
    group.addEventListener('click', function (e) {
      var a = e.target.closest('a');
      if (!a || a.getAttribute('href')) return;
      e.preventDefault();
      group.querySelectorAll('a').forEach(function (x) { x.classList.remove('on'); });
      a.classList.add('on');
    });
  });
  document.querySelectorAll('.chip').forEach(function (chip) {
    chip.addEventListener('click', function () {
      chip.parentElement.querySelectorAll('.chip').forEach(function (x) { x.classList.remove('on'); });
      chip.classList.add('on');
    });
  });
  document.querySelectorAll('.switch').forEach(function (s) {
    s.setAttribute('role', 'switch');
    s.addEventListener('click', function () { s.classList.toggle('on'); });
  });
  document.querySelectorAll('.check i').forEach(function (c) {
    c.parentElement.addEventListener('click', function () { c.classList.toggle('on'); });
  });

  // Drawers: [data-open=id] opens #id, [data-close] closes.
  document.addEventListener('click', function (e) {
    var open = e.target.closest('[data-open]');
    if (open) {
      e.preventDefault();
      var d = document.getElementById(open.getAttribute('data-open'));
      if (d) { d.classList.add('show'); d.setAttribute('aria-hidden', 'false'); }
    }
    if (e.target.closest('[data-close]')) {
      var dr = e.target.closest('.drawer');
      if (dr) { dr.classList.remove('show'); dr.setAttribute('aria-hidden', 'true'); }
    }
    if (e.target.closest('[data-toggle-nav]')) document.body.classList.toggle('nav-open');
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') document.querySelectorAll('.drawer.show').forEach(function (d) { d.classList.remove('show'); });
  });

  // Dead links in a prototype should not jump to the top.
  document.querySelectorAll('a:not([href])').forEach(function (a) { a.setAttribute('tabindex', '0'); });
  document.querySelectorAll('a[href="#"]').forEach(function (a) { a.addEventListener('click', function (e) { e.preventDefault(); }); });

  // Gentle entrance for cards.
  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { threshold: 0.08 });
    document.querySelectorAll('.card, .kpi, .ccard, .tile, .banner').forEach(function (el) { el.classList.add('reveal'); io.observe(el); });
  }


  // Demo: the user chip in the header opens a small menu to switch role or sign out.
  document.querySelectorAll('.me').forEach(function (me) {
    var profile = me.getAttribute('href');
    var menu = document.createElement('div');
    menu.className = 'me-menu';
    menu.innerHTML = (profile ? '<a href="' + profile + '">My profile</a>' : '') +
      '<a href="01-login.html">Switch role <small>demo</small></a><a href="01-login.html" class="out">Log out</a>';
    me.style.position = 'relative';
    me.parentElement.style.position = 'relative';
    me.insertAdjacentElement('afterend', menu);
    me.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); menu.classList.toggle('show'); });
    document.addEventListener('click', function (e) { if (!menu.contains(e.target)) menu.classList.remove('show'); });
  });

  // SARAH — floating assistant button, bottom-right on every app page.
  (function () {
    var page = location.pathname.split('/').pop();
    if (/^(00-design-system|19-mobile)/.test(page)) return;
    var ar = !!document.querySelector('[dir="rtl"]');
    var spark = '<svg class="sarah-face" viewBox="0 0 32 32" fill="none"><path d="M16 4.5c-6.9 0-12 4.6-12 10.6 0 3.3 1.6 6.2 4.2 8.1l-.9 4.1c-.1.5.4.9.9.6l4.6-2.6c1 .2 2.1.4 3.2.4 6.9 0 12-4.6 12-10.6S22.9 4.5 16 4.5z" fill="#fff"/><g class="eyes" fill="#E8343F"><ellipse cx="11.6" cy="14" rx="1.7" ry="2.1"/><ellipse cx="20.4" cy="14" rx="1.7" ry="2.1"/></g><path d="M12.2 18.6c1 1.1 2.3 1.7 3.8 1.7s2.8-.6 3.8-1.7" stroke="#E8343F" stroke-width="1.8" stroke-linecap="round"/></svg>';
    var closeIco = '<svg class="sarah-close" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>';
    var t = ar
      ? { ask: 'اسأل سارة', title: 'سارة', sub: 'مساعدتك في HTU · متصلة', hi: 'مرحباً! أنا سارة. كيف أساعدك اليوم؟', q: ['ما المطلوب مني هذا الأسبوع؟', 'لخّص آخر محاضرة', 'كيف أنضم إلى نادٍ؟'], ph: 'اكتب سؤالك…' }
      : { ask: 'Ask SARAH', title: 'SARAH', sub: 'Your HTU assistant · online', hi: 'Hi! I’m SARAH. What can I help you with today?', q: ['What’s due this week?', 'Summarise my last lecture', 'How do I join a club?'], ph: 'Ask anything…' };

    var fab = document.createElement('button');
    fab.className = 'sarah-fab';
    fab.setAttribute('aria-label', t.ask);
    fab.innerHTML = '<span class="sarah-ring"></span>' + spark + closeIco + '<span class="tip">' + t.ask + '</span>';

    var panel = document.createElement('div');
    panel.className = 'sarah-panel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', t.title);
    if (ar) panel.setAttribute('dir', 'rtl');
    panel.innerHTML =
      '<header><span class="av">' + spark + '</span><div><b>' + t.title + '</b><span><i></i>' + t.sub + '</span></div><button class="x" aria-label="Close">×</button></header>' +
      '<div class="msgs"><div class="msg">' + t.hi + '</div><div class="sugg">' + t.q.map(function (q) { return '<button>' + q + '</button>'; }).join('') + '</div></div>' +
      '<form><input placeholder="' + t.ph + '"><button aria-label="Send"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></button></form>';

    document.body.appendChild(panel);
    document.body.appendChild(fab);

    var msgs = panel.querySelector('.msgs');
    function toggle(open) {
      var on = open === undefined ? !panel.classList.contains('show') : open;
      panel.classList.toggle('show', on);
      fab.classList.toggle('open', on);
      if (on) setTimeout(function () { panel.querySelector('input').focus(); }, 200);
    }
    function say(text) {
      if (!text) return;
      var me = document.createElement('div'); me.className = 'msg me'; me.textContent = text; msgs.appendChild(me);
      var typing = document.createElement('div'); typing.className = 'msg typing'; typing.innerHTML = '<i></i><i></i><i></i>'; msgs.appendChild(typing);
      msgs.scrollTop = msgs.scrollHeight;
      setTimeout(function () {
        typing.className = 'msg';
        typing.textContent = ar ? 'هذه نسخة تجريبية من التصميم — في التطبيق الحقيقي سأجيبك من مقرراتك وسجلك.' : 'This is a design preview — in the live app I’ll answer from your courses and records.';
        msgs.scrollTop = msgs.scrollHeight;
      }, 900);
    }
    fab.addEventListener('click', function () { toggle(); });
    panel.querySelector('.x').addEventListener('click', function () { toggle(false); });
    panel.querySelector('.sugg').addEventListener('click', function (e) { var b = e.target.closest('button'); if (b) say(b.textContent); });
    panel.querySelector('form').addEventListener('submit', function (e) {
      e.preventDefault(); var i = panel.querySelector('input'); say(i.value.trim()); i.value = '';
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') toggle(false); });
    if (location.hash === '#sarah') toggle(true);
    // Any other "Ask SARAH" trigger on the page opens the same panel.
    document.querySelectorAll('a, button, span').forEach(function (el) {
      if (el.closest('.sarah-panel, .sarah-fab') || el.children.length > 3) return;
      if (/Ask SARAH|SARAH ·|اسأل سارة/.test(el.textContent)) {
        el.style.cursor = 'pointer';
        el.addEventListener('click', function (e) { e.preventDefault(); toggle(true); });
      }
    });
  })();
})();
