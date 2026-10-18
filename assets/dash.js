/* Teacher Insight dashboards — Reports and Video engagement (EM-210 sample data). */
(function () {
  var root = document.getElementById('dash');
  if (!root) return;
  var PAGE = root.getAttribute('data-page');

  /* ───────── helpers ───────── */
  function $(s, el) { return (el || document).querySelector(s); }
  function $$(s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function fmt(n) { return Math.round(n).toLocaleString('en-US'); }
  var IC = {
    act: '<svg class="i i-sm" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>',
    chk: '<svg class="i i-sm" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9.5"/><path d="m8 12.3 2.7 2.7L16 9.6"/></svg>',
    pct: '<svg class="i i-sm" viewBox="0 0 24 24"><path d="M19 5 5 19"/><circle cx="7" cy="7" r="2.5"/><circle cx="17" cy="17" r="2.5"/></svg>',
    rec: '<svg class="i i-sm" viewBox="0 0 24 24"><rect x="2.5" y="5" width="14" height="14" rx="2"/><path d="m16.5 10 5-3v10l-5-3"/></svg>',
    search: '<svg class="i i-sm" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
    down: '<svg class="i i-sm" viewBox="0 0 24 24"><path d="M12 4v12M6 10l6 6 6-6M4 20h16"/></svg>',
    chat: '<svg class="i i-sm" viewBox="0 0 24 24"><path d="M21 12a8 8 0 0 1-11.6 7.1L3 21l1.9-6.4A8 8 0 1 1 21 12z"/></svg>',
    x: '<svg class="i i-sm" viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></svg>',
    mail: '<svg class="i i-sm" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>',
    arrow: '<svg class="i i-sm" viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    play: '<svg class="i" viewBox="0 0 24 24"><path d="m8 5 11 7-11 7z" fill="currentColor"/></svg>',
    eye: '<svg class="i i-sm" viewBox="0 0 24 24"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>',
    users: '<svg class="i i-sm" viewBox="0 0 24 24"><circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 4.6a3.5 3.5 0 0 1 0 6.8M18 14.2a6.5 6.5 0 0 1 3.5 5.8"/></svg>',
    clock: '<svg class="i i-sm" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    flag: '<svg class="i i-sm" viewBox="0 0 24 24"><path d="M4 21V4M4 4h12l-2 4 2 4H4"/></svg>',
    link: '<svg class="i i-sm" viewBox="0 0 24 24"><path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"/></svg>'
  };
  // seeded random so every reload shows the same sample data
  var seed = 210;
  function rnd() { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }

  var tip = document.createElement('div'); tip.className = 'tip'; document.body.appendChild(tip);
  document.addEventListener('mousemove', function (e) {
    var t = e.target.closest && e.target.closest('[data-tip]');
    if (t) { tip.innerHTML = t.getAttribute('data-tip'); tip.classList.add('show'); tip.style.left = (e.clientX + 14) + 'px'; tip.style.top = (e.clientY - 34) + 'px'; }
    else if (!e.target.closest || !e.target.closest('.lc-hit')) tip.classList.remove('show');
  });
  var toastEl = document.createElement('div'); toastEl.className = 'toast'; document.body.appendChild(toastEl);
  var toastT;
  function toast(msg) { toastEl.innerHTML = msg; toastEl.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(function () { toastEl.classList.remove('show'); }, 2400); }
  var scrim = document.createElement('div'); scrim.className = 'scrim'; document.body.appendChild(scrim);
  var drawer = document.createElement('aside'); drawer.className = 'idrawer'; document.body.appendChild(drawer);
  function openDrawer(html) { drawer.innerHTML = '<a class="iconbtn x" data-close>' + IC.x + '</a>' + html; drawer.classList.add('show'); scrim.classList.add('show'); }
  function closeDrawer() { drawer.classList.remove('show'); scrim.classList.remove('show'); }
  scrim.addEventListener('click', closeDrawer);
  drawer.addEventListener('click', function (e) { if (e.target.closest('[data-close]')) closeDrawer(); var t = e.target.closest('[data-toast]'); if (t) toast(t.getAttribute('data-toast')); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeDrawer(); });

  function countUp(el) {
    if (/static/.test(location.search)) { $$('[data-count]', el).forEach(function (n) { var to = parseFloat(n.getAttribute('data-count')), dec = +(n.getAttribute('data-dec') || 0); n.textContent = (dec ? to.toFixed(dec) : fmt(to)) + (n.getAttribute('data-suf') || ''); }); return; }
    $$('[data-count]', el).forEach(function (n) {
      var to = parseFloat(n.getAttribute('data-count')), dec = +(n.getAttribute('data-dec') || 0), suf = n.getAttribute('data-suf') || '';
      var t0 = performance.now();
      (function step(t) {
        var k = Math.min(1, (t - t0) / 700), v = to * (1 - Math.pow(1 - k, 3));
        n.textContent = (dec ? v.toFixed(dec) : fmt(v)) + suf;
        if (k < 1) requestAnimationFrame(step);
      })(t0);
    });
  }

  var NAMES = ['Layla Haddad', 'Yousef Ali', 'Dana Saleh', 'Omar Masri', 'Nour Zahran', 'Sara Mansour', 'Khaled Tamimi', 'Rami Odeh', 'Hala Saad', 'Faris Khalil', 'Lina Qasem', 'Zaid Nasser',
    'Maya Haddad', 'Tariq Aziz', 'Jana Yasin', 'Ahmad Barakat', 'Rana Shami', 'Hamza Odat', 'Leen Abbadi', 'Basel Kurdi', 'Tala Nimri', 'Majd Hijazi', 'Salma Atiyeh', 'Kareem Zu\'bi',
    'Noor Khatib', 'Ali Momani', 'Dima Saleh', 'Fadi Haddadin', 'Yara Masri', 'Anas Hamdan', 'Rawan Qudah', 'Saif Obeidat', 'Mira Halaseh', 'Laith Shboul', 'Haya Dajani', 'Omar Rifai',
    'Ruba Tawil', 'Zaina Ayyoub', 'Mohammad Jaber', 'Lujain Fakhoury', 'Adam Batayneh', 'Sama Khoury', 'Bashar Rousan', 'Joud Malkawi', 'Ibrahim Kayed', 'Nadine Sweis', 'Qais Bdour', 'Aya Shehadeh'];
  var AVC = ['', 'alt', 'alt3', 'alt2'];
  function initials(n) { return n.split(' ').map(function (w) { return w[0]; }).join('').slice(0, 2); }
  function av(n, k) { return '<span class="avatar xs ' + AVC[k % 4] + '">' + initials(n) + '</span>'; }

  function head(title, sub, actions) {
    return '<div class="row between" style="margin-bottom:18px;flex-wrap:wrap;gap:12px"><div><h2 style="font-size:24px">' + title + '</h2>' + (sub ? '<div class="small muted" style="margin-top:2px">' + sub + '</div>' : '') + '</div><div class="row" style="gap:8px">' + actions + '</div></div>';
  }

  /* ════════════════════════ REPORTS ════════════════════════ */
  if (PAGE === 'reports') {
    var SECS = [['gen', 'Course information'], ['w1', 'Week 1 — Magnetic circuits'], ['w2', 'Week 2 — DC machines'], ['w3', 'Week 3 — DC motors'], ['w4', 'Week 4 — Transformers'], ['w5', 'Week 5 — Induction motors']];
    var A = [
      ['Announcements', 'Forum', 'gen', 'Not tracked'], ['Course syllabus and assessment weights', 'Page', 'gen', 41], ['Orientation — how this course works', 'URL', 'gen', 44],
      ['Orientation video', 'External tool', 'gen', 'Not tracked'], ['Formula sheet — Machines', 'File', 'gen', 39],
      ['Lecture 4 — Magnetic circuits I', 'Recording', 'w1', 46], ['Week 1 notes — B-H curves', 'Page', 'w1', 40], ['Quiz 1 — Magnetic circuits', 'Quiz', 'w1', 48], ['Slides — Week 1', 'File', 'w1', 37],
      ['Lecture 5 — Magnetic circuits II', 'Recording', 'w2', 38], ['Lecture 6 — DC generators', 'Recording', 'w2', 22], ['Quiz 2 — DC machines', 'Quiz', 'w2', 47], ['Lab report 1 — Equivalent circuit', 'Assignment', 'w2', 48], ['Slides — Week 2', 'File', 'w2', 33],
      ['Lecture 7 — DC motor characteristics', 'Recording', 'w3', 44], ['Quiz 3 — DC motors', 'Quiz', 'w3', 46], ['Lab report 2 — DC motors', 'Assignment', 'w3', 45], ['Slides — Week 3', 'File', 'w3', 29],
      ['Lecture 8 — Transformer theory', 'Recording', 'w4', 40], ['Lecture 9 — Transformers', 'Recording', 'w4', 31], ['Slides — Week 4', 'File', 'w4', 20], ['Quiz 4 — Transformer basics', 'Quiz', 'w4', 'Nobody to track yet'],
      ['Lab report 3 — Induction motors', 'Assignment', 'w4', 29], ['Forum — Week 4 questions', 'Forum', 'w4', 'Completion is off'], ['Lab 4 — Transformer testing', 'Lesson', 'w4', 'Not tracked'],
      ['Week 5 notes — Rotating fields', 'Page', 'w5', 6], ['Pre-lab 5 — Slip', 'Quiz', 'w5', 'Nobody to track yet']
    ].map(function (r, i) { return { i: i, n: r[0], t: r[1], s: r[2], c: r[3] }; });
    var REC = { 'Lecture 4 — Magnetic circuits I': [46, 91], 'Lecture 5 — Magnetic circuits II': [38, 66], 'Lecture 6 — DC generators': [22, 41], 'Lecture 7 — DC motor characteristics': [44, 88], 'Lecture 8 — Transformer theory': [40, 74], 'Lecture 9 — Transformers': [31, 58] };
    var TCOL = { Recording: '#E31E24', Quiz: '#6D5BD0', Assignment: '#D98A00', File: '#2C6BED', Page: '#1E9E62', Forum: '#0E7490', URL: '#8E1520', 'External tool': '#5B6475', Lesson: '#B5521B' };
    var ST = { scope: 'all', type: null, q: '', sort: null, dir: -1, sel: null };
    var secName = function (id) { for (var k = 0; k < SECS.length; k++) if (SECS[k][0] === id) return SECS[k][1]; return ''; };

    root.innerHTML = '<div class="dgrid"><aside class="panel rail2" id="rail"></aside><section class="stack" id="main"></section></div>';

    function inScope() {
      return A.filter(function (a) {
        if (ST.scope === 'all') return true;
        if (ST.scope.indexOf('act:') === 0) return a.i === +ST.scope.slice(4);
        return a.s === ST.scope;
      });
    }
    function scopeLabel() {
      if (ST.scope === 'all') return 'Whole course';
      if (ST.scope.indexOf('act:') === 0) return A[+ST.scope.slice(4)].n;
      return secName(ST.scope);
    }
    function renderRail() {
      var openSec = ST.scope.indexOf('act:') === 0 ? A[+ST.scope.slice(4)].s : ST.scope;
      var h = '<h6>SCOPE</h6><button class="whole ' + (ST.scope === 'all' ? 'on' : '') + '" data-scope="all">Whole course<span class="c">' + A.length + '</span></button>';
      SECS.forEach(function (s) {
        var n = A.filter(function (a) { return a.s === s[0]; });
        h += '<button class="' + (ST.scope === s[0] ? 'on' : '') + '" data-scope="' + s[0] + '">' + s[1] + '<span class="c">' + n.length + '</span></button>';
        if (openSec === s[0]) h += '<div class="acts">' + n.map(function (a) { return '<button class="' + (ST.scope === 'act:' + a.i ? 'on' : '') + '" data-scope="act:' + a.i + '">' + esc(a.n) + '</button>'; }).join('') + '</div>';
      });
      $('#rail').innerHTML = h;
    }
    function completion(list) {
      var m = list.filter(function (a) { return typeof a.c === 'number'; });
      var avg = m.length ? m.reduce(function (s, a) { return s + a.c / 48; }, 0) / m.length * 100 : 0;
      return { measured: m.length, avg: avg };
    }
    function cellFor(a) {
      if (typeof a.c !== 'number') return '<span class="tbadge">' + a.c + '</span>';
      var p = a.c / 48 * 100;
      return '<div class="cbar2"><div class="t"><i class="' + (p >= 80 ? 'ok' : p < 50 ? '' : 'warn') + '" style="width:' + p.toFixed(0) + '%"></i></div><b>' + a.c + ' of 48</b></div>';
    }
    function renderMain() {
      var list = inScope(), c = completion(list);
      var recs = list.filter(function (a) { return a.t === 'Recording'; });
      var acts = list.filter(function (a) { return (!ST.type || a.t === ST.type) && (!ST.q || a.n.toLowerCase().indexOf(ST.q) > -1); });
      if (ST.sort) acts.sort(function (x, y) {
        var a = x[ST.sort], b = y[ST.sort];
        if (ST.sort === 'c') { a = typeof a === 'number' ? a : -1; b = typeof b === 'number' ? b : -1; }
        return (a > b ? 1 : a < b ? -1 : 0) * ST.dir;
      });
      var h = head('Reports' + (ST.scope !== 'all' ? ' <span class="muted" style="font-weight:500">— ' + esc(scopeLabel()) + '</span>' : ''), 'Counting your groups only · Group A, B and C',
        '<a class="btn btn-ghost" href="13-what-students-ask.html">' + IC.chat + ' What students ask</a><a class="btn btn-primary" id="exp">' + IC.down + ' Export this scope</a>');
      h += '<div class="kpis">' +
        kpi(IC.act, '', 'Activities', '<span data-count="' + list.length + '">0</span>', 'In ' + esc(scopeLabel().toLowerCase())) +
        kpi(IC.chk, 'g', 'Completed', '<span data-count="' + c.measured + '">0</span><small> / ' + list.length + '</small>', 'No column is totalled') +
        kpi(IC.pct, 'o', 'Average completion', '<span data-count="' + c.avg.toFixed(1) + '" data-dec="1" data-suf="%">0</span>', 'Of the ' + c.measured + ' measured') +
        kpi(IC.rec, 'v', 'Recordings', '<span data-count="' + recs.length + '">0</span>', recs.length ? 'Watched in this scope' : 'None in this scope') + '</div>';
      // charts
      var wk = SECS.map(function (s) { var cc = completion(A.filter(function (a) { return a.s === s[0]; })); return [s, cc.avg]; });
      var bars = wk.map(function (w) { var on = ST.scope === w[0][0] || (ST.scope.indexOf('act:') === 0 && A[+ST.scope.slice(4)].s === w[0][0]); var col = w[1] >= 80 ? '#1E9E62' : w[1] >= 55 ? '#D98A00' : '#E31E24'; var dim = ST.scope !== 'all' && !on; return '<div class="b ' + (on ? 'on' : '') + '" data-scope="' + w[0][0] + '" data-tip="' + esc(w[0][1]) + ' · ' + w[1].toFixed(0) + '% average completion"><i style="height:' + Math.max(4, w[1]) + '%;background:' + col + ';opacity:' + (dim ? .3 : .9) + '"><em>' + w[1].toFixed(0) + '%</em></i><span>' + (w[0][0] === 'gen' ? 'Info' : w[0][1].split(' — ')[0]) + '</span></div>'; }).join('');
      var types = {}; list.forEach(function (a) { types[a.t] = (types[a.t] || 0) + 1; });
      var tk = Object.keys(types).sort(function (a, b) { return types[b] - types[a]; });
      var tot = list.length, off = 0, R = 58, C = 2 * Math.PI * R;
      var arcs = tk.map(function (t) {
        var len = types[t] / tot * C, s = '<circle data-type="' + t + '" data-tip="' + t + ' · ' + types[t] + '" cx="75" cy="75" r="' + R + '" fill="none" stroke="' + TCOL[t] + '" stroke-width="' + (ST.type === t ? 24 : 18) + '" stroke-dasharray="' + (len - 2) + ' ' + (C - len + 2) + '" stroke-dashoffset="' + (-off) + '" transform="rotate(-90 75 75)" opacity="' + (ST.type && ST.type !== t ? .3 : 1) + '"/>';
        off += len; return s;
      }).join('');
      var lg = tk.map(function (t) { return '<button data-type="' + t + '" class="' + (ST.type === t ? 'on' : '') + '"><i style="background:' + TCOL[t] + '"></i>' + t + '<b>' + types[t] + '</b></button>'; }).join('');
      h += '<div style="display:grid;grid-template-columns:1.5fr 1fr;gap:16px" class="chrow">' +
        '<div class="panel"><div class="panel-h"><h3>Completion by week</h3><span class="small muted">Click a week to focus it</span></div><div class="panel-b" style="padding-top:30px"><div class="wkbars">' + bars + '</div></div></div>' +
        '<div class="panel"><div class="panel-h"><h3>By type</h3>' + (ST.type ? '<a class="link" data-type="">Clear</a>' : '<span class="small muted">Click to filter</span>') + '</div><div class="panel-b"><div class="donut2"><svg viewBox="0 0 150 150">' + arcs + '<text x="75" y="72" text-anchor="middle" font-family="Poppins" font-weight="700" font-size="26" fill="#14161C">' + tot + '</text><text x="75" y="92" text-anchor="middle" font-size="11" fill="#6B7180">activities</text></svg><div class="lg2">' + lg + '</div></div></div></div></div>';
      // activities table
      var cols = [['n', 'Activity'], ['t', 'Type'], ['s', 'Section'], ['c', 'Completed']];
      var th = cols.map(function (c) { return '<th data-sort="' + c[0] + '" class="' + (ST.sort === c[0] ? 'sorted ' + (ST.dir > 0 ? 'asc' : '') : '') + '"' + (c[0] === 'c' ? ' style="width:300px"' : '') + '>' + c[1] + '</th>'; }).join('');
      var rows = acts.length ? acts.map(function (a) { return '<tr class="r ' + (ST.sel === a.i ? 'sel' : '') + '" data-act="' + a.i + '"><td class="an">' + esc(a.n) + '</td><td><span class="tbadge">' + a.t + '</span></td><td class="muted">' + secName(a.s) + '</td><td>' + cellFor(a) + '</td></tr>'; }).join('')
        : '<tr class="empty-row"><td colspan="4">Nothing in this scope matches.</td></tr>';
      h += '<div class="panel" style="overflow:hidden"><div class="panel-h" style="padding-bottom:14px"><h3>Activities <span class="badge">' + acts.length + '</span></h3><div class="tools"><label class="sbox">' + IC.search + '<input id="q" placeholder="Search activities" value="' + esc(ST.q) + '"></label>' + (ST.type ? '<span class="chip on">' + ST.type + ' <a data-type="" style="margin-left:4px">✕</a></span>' : '') + '</div></div><table class="dt"><tr>' + th + '</tr>' + rows + '</table></div>';
      // recordings
      if (ST.scope.indexOf('act:') === 0 && !recs.length) {
        h += '<div class="panel"><div class="panel-b small muted">Recordings are listed for a section or the whole course.</div></div>';
      } else {
        var rr = recs.map(function (a) { var r = REC[a.n]; return '<tr class="' + (r[1] < 70 ? 'low' : '') + '"><td><a class="an" href="15-recording-detail.html">' + esc(a.n) + '</a></td><td class="num">' + r[0] + '</td><td style="width:320px"><div class="cbar2"><div class="t"><i class="' + (r[1] < 70 ? 'warn' : 'ok') + '" style="width:' + r[1] + '%"></i><s style="left:70%"></s></div><b>' + r[1] + '%</b></div></td></tr>'; }).join('') || '<tr class="empty-row"><td colspan="3">No recordings in this scope.</td></tr>';
        h += '<div class="panel" style="overflow:hidden"><div class="panel-h" style="padding-bottom:14px"><h3>Recordings</h3><a class="link" href="14-video-engagement.html">Video engagement ' + IC.arrow + '</a></div><table class="dt"><tr><th class="ns">Recording</th><th class="ns num">Viewers</th><th class="ns">Watched</th></tr>' + rr + '</table></div>';
      }
      h += '<div id="more" class="stack"></div>';
      h += '<div class="small muted" style="padding:4px 2px">No column is totalled: completion is Moodle\'s to aggregate, and these cells are frequently not numbers.</div>';
      $('#main').innerHTML = h;
      renderMore(list);
      countUp($('#main'));
      var q = $('#q'); q.addEventListener('input', function () { ST.q = q.value.toLowerCase(); var pos = q.selectionStart; renderMain(); var nq = $('#q'); nq.focus(); nq.setSelectionRange(pos, pos); });
    }

    var SEGS = [['act', 'Active', 'Opened the course in the last 3 days', 31, 'var(--ok)'], ['slip', 'Slipping', 'Last seen 4 – 7 days ago', 10, 'var(--warn)'], ['in', 'Inactive', 'Not seen in 7+ days', 5, 'var(--red)'], ['never', 'Never opened', 'Enrolled, no visit yet', 2, '#5B6475']];
    var SUBS = [['Lab report 1 — Equivalent circuit', 'w2', 44, 4, 0, 0], ['Lab report 2 — DC motors', 'w3', 40, 5, 3, 0], ['Lab report 3 — Induction motors', 'w4', 27, 2, 0, 19]];
    var QZ = [['Quiz 1 — Magnetic circuits', 'w1', 48, 8.2, 10, 4, 94, 'Q4 · reluctance in series (52% correct)'], ['Quiz 2 — DC machines', 'w2', 47, 7.1, 10, 2.5, 81, 'Q7 · back-EMF sign (31% correct)'], ['Quiz 3 — DC motors', 'w3', 46, 7.7, 10, 3.5, 89, 'Q2 · speed–torque curve (47% correct)']];
    function renderMore(list) {
      var inSec = function (sec) { return ST.scope === 'all' || ST.scope === sec || (ST.scope.indexOf('act:') === 0 && A[+ST.scope.slice(4)].s === sec); };
      var seg = ST.seg || null, h = '';
      // engagement segments
      var segNames = { act: NAMES.slice(16, 47), slip: ['Dana Saleh', 'Omar Masri', 'Faris Khalil', 'Zaid Nasser', 'Tariq Aziz', 'Jana Yasin', 'Rana Shami', 'Basel Kurdi', 'Noor Khatib', 'Fadi Haddadin'], in: ['Khaled Tamimi', 'Sara Mansour', 'Anas Hamdan', 'Saif Obeidat', 'Qais Bdour'], never: ['Aya Shehadeh', 'Ibrahim Kayed'] };
      h += '<div class="panel"><div class="panel-h"><div><h3>Engagement</h3><div class="small muted">Who is keeping up — click a group to see names</div></div><span class="pill-wc">whole course</span></div><div class="panel-b"><div class="seg-cards">' +
        SEGS.map(function (g) { return '<button class="segc ' + (seg === g[0] ? 'on' : '') + '" data-seg="' + g[0] + '"><div class="t"><i style="background:' + g[4] + '"></i>' + g[1] + '</div><div class="v">' + g[3] + '</div><div class="d">' + g[2] + '</div></button>'; }).join('') + '</div>' +
        '<div class="stk" style="margin-top:14px">' + SEGS.map(function (g) { return '<i data-tip="' + g[1] + ' · ' + g[3] + '" style="width:' + (g[3] / 48 * 100) + '%;background:' + g[4] + '"></i>'; }).join('') + '</div>' +
        (seg ? '<div style="margin-top:16px"><div class="row between" style="margin-bottom:10px"><b style="color:var(--ink)">' + SEGS.filter(function (g) { return g[0] === seg; })[0][1] + ' · ' + segNames[seg].length + '</b>' + (seg !== 'act' ? '<a class="btn btn-sm btn-primary" data-toast="Message sent to ' + segNames[seg].length + ' students">' + IC.mail + ' Message all</a>' : '') + '</div><div class="row" style="gap:8px;flex-wrap:wrap">' + segNames[seg].map(function (n, k) { return '<a href="16-student-in-course.html" class="pchip" style="display:inline-flex;align-items:center;gap:7px;padding:3px 10px 3px 3px;border-radius:99px;border:1px solid var(--line);background:#fff;font-size:12.5px">' + av(n, k) + n + '</a>'; }).join('') + '</div></div>' : '') + '</div></div>';
      // weekly active + last access + forum
      var wa = [46, 45, 44, 43, 41, 41], fp = [12, 9, 15, 11, 18, 6], la = [['Today', 22], ['1–3 days', 9], ['4–7 days', 10], ['7+ days', 5], ['Never', 2]];
      h += '<div class="r3">' +
        '<div class="panel"><div class="panel-h"><h3>Weekly active students</h3><span class="small muted">of 48</span></div><div class="panel-b"><div class="colbars">' + wa.map(function (v, i) { return '<div data-tip="Week ' + (i + 1) + ' · ' + v + ' active"><b>' + v + '</b><i class="' + (i === 5 ? 'hl' : '') + '" style="height:' + ((v - 30) / 18 * 100) + '%"></i><span>W' + (i + 1) + '</span></div>'; }).join('') + '</div><div class="small muted" style="margin-top:8px">Down 5 since week 1 · week 6 so far</div></div></div>' +
        '<div class="panel"><div class="panel-h"><h3>Last access</h3><span class="small muted">students</span></div><div class="panel-b">' + la.map(function (l, i) { return '<div style="display:grid;grid-template-columns:70px 1fr 26px;gap:10px;align-items:center;font-size:12.5px;margin-bottom:9px"><span class="muted">' + l[0] + '</span><div class="cbar2"><div class="t"><i class="' + (i < 2 ? 'ok' : i === 2 ? 'warn' : '') + '" style="width:' + (l[1] / 22 * 100) + '%"></i></div></div><b style="color:var(--ink);text-align:right">' + l[1] + '</b></div>'; }).join('') + '</div></div>' +
        '<div class="panel"><div class="panel-h"><h3>Forum activity</h3><span class="small muted">posts per week</span></div><div class="panel-b"><div class="colbars">' + fp.map(function (v, i) { return '<div data-tip="Week ' + (i + 1) + ' · ' + v + ' posts"><b>' + v + '</b><i style="height:' + (v / 18 * 100) + '%;background:var(--info)"></i><span>W' + (i + 1) + '</span></div>'; }).join('') + '</div><div class="small muted" style="margin-top:8px">71 posts · 5 unanswered in Week 4</div></div></div></div>';
      // submissions + quizzes
      var subs = SUBS.filter(function (x) { return inSec(x[1]); }), qz = QZ.filter(function (x) { return inSec(x[1]); });
      h += '<div class="r2">';
      h += '<div class="panel"><div class="panel-h"><h3>Assignment submissions</h3><div class="mlegend" style="margin:0"><span><i style="background:var(--ok)"></i>On time</span><span><i style="background:var(--warn)"></i>Late</span><span><i style="background:var(--red)"></i>Missing</span><span><i style="background:#DADDE3"></i>Still open</span></div></div><div class="panel-b">' +
        (subs.length ? subs.map(function (x) { return '<div style="margin-bottom:16px"><div class="row between small" style="margin-bottom:6px"><b style="color:var(--ink)">' + x[0] + '</b><span class="muted">' + (x[2] + x[3]) + ' / 48 in</span></div><div class="stk">' + [[x[2], 'var(--ok)', 'On time'], [x[3], 'var(--warn)', 'Late'], [x[4], 'var(--red)', 'Missing'], [x[5], '#DADDE3', 'Still open']].filter(function (q) { return q[0]; }).map(function (q) { return '<i data-tip="' + q[2] + ' · ' + q[0] + '" style="width:' + (q[0] / 48 * 100) + '%;background:' + q[1] + '"></i>'; }).join('') + '</div></div>'; }).join('') : '<div class="small muted">No assignments in this scope.</div>') + '</div></div>';
      h += '<div class="panel" style="overflow:hidden"><div class="panel-h" style="padding-bottom:12px"><h3>Quiz results</h3><span class="small muted">out of 10</span></div>' +
        (qz.length ? '<table class="dt"><tr><th class="ns">Quiz</th><th class="ns num">Attempts</th><th class="ns">Average · range</th><th class="ns num">Pass</th></tr>' + qz.map(function (x) { return '<tr class="r" data-quiz="' + x[0] + '"><td><b style="color:var(--ink)">' + x[0] + '</b><div class="small muted">Hardest: ' + x[7] + '</div></td><td class="num">' + x[2] + '</td><td style="width:170px"><div style="position:relative;height:8px;background:#EEEFF2;border-radius:99px"><span style="position:absolute;left:' + x[5] * 10 + '%;width:' + (x[4] - x[5]) * 10 + '%;top:0;bottom:0;background:#DADDE3;border-radius:99px"></span><span data-tip="Average ' + x[3] + '" style="position:absolute;left:calc(' + x[3] * 10 + '% - 6px);top:-3px;width:14px;height:14px;border-radius:50%;background:var(--violet);border:2px solid #fff"></span></div><div class="row between small muted" style="margin-top:4px"><span>' + x[5] + '</span><b style="color:var(--violet)">' + x[3] + '</b><span>' + x[4] + '</span></div></td><td class="num"><span class="badge ' + (x[6] >= 85 ? 'ok' : 'warn') + '">' + x[6] + '%</span></td></tr>'; }).join('') + '</table>' : '<div class="panel-b small muted">No quizzes in this scope.</div>') + '</div>';
      h += '</div>';
      $('#more').innerHTML = h;
    }
    root.addEventListener('click', function (e) {
      var g = e.target.closest('[data-seg]'); if (g) { var v = g.getAttribute('data-seg'); ST.seg = ST.seg === v ? null : v; renderMore(inScope()); return; }
      var t = e.target.closest('#more [data-toast]'); if (t) toast(t.getAttribute('data-toast'));
    });
    function kpi(ic, c, l, n, s) { return '<div class="kpi2"><div class="l"><span class="ic ' + c + '">' + ic + '</span>' + l + '</div><div class="n">' + n + '</div><div class="s">' + s + '</div></div>'; }
    function showAct(i) {
      var a = A[i]; ST.sel = i; renderMain();
      var body;
      if (typeof a.c === 'number') {
        var miss = 48 - a.c, who = NAMES.slice().sort(function (x, y) { return (x.length * 7 + i) % 11 - (y.length * 7 + i) % 11; }).slice(0, miss);
        body = '<div class="cbar2" style="margin:6px 0 18px"><div class="t" style="height:12px"><i class="ok" style="width:' + (a.c / 48 * 100) + '%"></i></div><b style="font-size:15px">' + Math.round(a.c / 48 * 100) + '%</b></div>' +
          '<div class="row" style="gap:10px;margin-bottom:18px"><div class="kpi2" style="flex:1;padding:12px 14px"><div class="l">Completed</div><div class="n" style="font-size:22px;margin-top:4px">' + a.c + '</div></div><div class="kpi2" style="flex:1;padding:12px 14px"><div class="l">Not yet</div><div class="n" style="font-size:22px;margin-top:4px;color:var(--red)">' + miss + '</div></div></div>' +
          (miss ? '<div class="row between" style="margin-bottom:6px"><b style="color:var(--ink)">Not completed yet</b><span class="small muted">' + miss + ' students</span></div>' + who.slice(0, 12).map(function (n, k) { return '<div class="pp">' + av(n, k) + n + '</div>'; }).join('') + (miss > 12 ? '<div class="small muted" style="padding:8px 0">+' + (miss - 12) + ' more</div>' : '') +
            '<a class="btn btn-primary" style="width:100%;justify-content:center;margin-top:16px" data-toast="Message sent to ' + miss + ' students">' + IC.mail + ' Message these ' + miss + '</a>' : '<div class="small" style="color:var(--ok);font-weight:600">Everyone has completed this.</div>');
      } else {
        body = '<div class="tbadge" style="margin:6px 0 14px">' + a.c + '</div><p class="small muted">' + ({ 'Not tracked': 'Completion tracking is not set for this activity, so Moodle records no completion — this is not zero.', 'Completion is off': 'Completion is switched off for this activity in its settings.', 'Nobody to track yet': 'The activity is not open yet, so nobody can complete it.' })[a.c] + '</p><a class="btn btn-ghost" style="margin-top:14px" data-toast="Opens the activity settings in Moodle">Turn on completion</a>';
      }
      openDrawer('<div class="dh"><span class="tbadge" style="border-color:' + TCOL[a.t] + ';color:' + TCOL[a.t] + '">' + a.t + '</span><h3 style="margin-top:10px;font-size:18px;padding-right:40px">' + esc(a.n) + '</h3><div class="small muted">' + secName(a.s) + '</div></div><div class="db">' + body + '</div>');
    }
    root.addEventListener('click', function (e) {
      var s = e.target.closest('[data-scope]'); if (s) { ST.scope = s.getAttribute('data-scope'); ST.sel = null; renderRail(); renderMain(); return; }
      var t = e.target.closest('[data-type]'); if (t) { var v = t.getAttribute('data-type'); ST.type = (!v || ST.type === v) ? null : v; renderMain(); return; }
      var so = e.target.closest('th[data-sort]'); if (so) { var k = so.getAttribute('data-sort'); if (ST.sort === k) ST.dir = -ST.dir; else { ST.sort = k; ST.dir = k === 'c' ? -1 : 1; } renderMain(); return; }
      var r = e.target.closest('tr[data-act]'); if (r) { showAct(+r.getAttribute('data-act')); return; }
      if (e.target.closest('#exp')) {
        var csv = 'Activity,Type,Section,Completed\n' + inScope().map(function (a) { return '"' + a.n + '",' + a.t + ',"' + secName(a.s) + '",' + (typeof a.c === 'number' ? a.c + '/48' : a.c); }).join('\n');
        var link = document.createElement('a'); link.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' })); link.download = 'EM-210-report-' + scopeLabel().replace(/\W+/g, '-').toLowerCase() + '.csv'; link.click();
        toast('Exported ' + inScope().length + ' rows · ' + esc(scopeLabel()));
      }
    });
    renderRail(); renderMain();
  }

  /* ════════════════════════ VIDEO ENGAGEMENT ════════════════════════ */
  if (PAGE === 'video') {
    var RECS = [
      { id: 'L4', n: 'Lecture 4 — Magnetic circuits I', wk: 'Week 1', len: 2060, viewers: 46, views: 79, w: 91, fin: 38, cv: 'cv3', posted: 14, skip: null },
      { id: 'L5', n: 'Lecture 5 — Magnetic circuits II', wk: 'Week 2', len: 2345, viewers: 38, views: 52, w: 66, fin: 17, cv: 'cv6', posted: 19, skip: [11, 13] },
      { id: 'L6', n: 'Lecture 6 — DC generators', wk: 'Week 2', len: 2650, viewers: 22, views: 30, w: 41, fin: 6, cv: 'cv4', posted: 21, skip: [6, 12] },
      { id: 'L7', n: 'Lecture 7 — DC motor characteristics', wk: 'Week 3', len: 2280, viewers: 44, views: 70, w: 88, fin: 33, cv: 'cv2', posted: 28, skip: null },
      { id: 'L8', n: 'Lecture 8 — Transformer theory', wk: 'Week 4', len: 2190, viewers: 40, views: 61, w: 74, fin: 22, cv: 'cv7', posted: 35, skip: [17, 18] },
      { id: 'L9', n: 'Lecture 9 — Transformers', wk: 'Week 4', len: 2460, viewers: 31, views: 44, w: 58, fin: 9, cv: 'cv1', posted: 40, skip: [10, 13] }
    ];
    RECS.forEach(function (r) {
      r.ret = []; for (var k = 0; k < 24; k++) { var v = 100 - k * (100 - r.w) / 18 - (k ? 4 : 0); if (r.skip && k >= r.skip[0] && k <= r.skip[1]) v -= 22; r.ret.push(Math.max(6, Math.min(100, Math.round(v + rnd() * 4)))); }
      r.mins = Math.round(r.views * r.len / 60 * r.w / 100);
    });
    function mmss(s) { return Math.floor(s / 60) + ':' + ('0' + Math.round(s % 60)).slice(-2); }
    // 43 days: 1 Sep → 13 Oct
    var D0 = new Date(2026, 8, 1), ND = 43, DAYS = [];
    for (var d = 0; d < ND; d++) {
      var dt = new Date(D0.getTime() + d * 864e5), v = 1 + rnd() * 2;
      RECS.forEach(function (r) { if (d >= r.posted) v += 15 * Math.pow(0.55, d - r.posted) * (r.viewers / 40); });
      if (dt.getDay() === 0 || dt.getDay() === 2) v *= 1.25;
      DAYS.push({ d: dt, views: v });
    }
    var tv = DAYS.reduce(function (s, x) { return s + x.views; }, 0);
    DAYS.forEach(function (x) { x.views = Math.max(0, Math.round(x.views / tv * 336)); x.uniq = Math.round(x.views * (0.78 + rnd() * 0.1)); x.mins = Math.round(x.views * (26 + rnd() * 8)); x.fin = Math.round(x.views * (0.3 + rnd() * 0.12)); x.avg = Math.round(66 + rnd() * 18); });
    var REL = {}; RECS.forEach(function (r) { REL[r.posted] = r.id; });
    var VS = { metric: 'views', range: 30, bar: 70, sort: 'w', dir: 1, open: null, group: 'all', tracked: {} };
    var METRICS = [
      ['views', 'Views', function (L) { return fmt(sum(L, 'views')); }, function (x) { return x.views; }],
      ['uniq', 'Students reached', function (L) { return { 7: 31, 14: 38, 30: 43, 43: 45 }[VS.range] + '<small> / 48</small>'; }, function (x) { return x.uniq; }],
      ['mins', 'Watch time', function (L) { var m = sum(L, 'mins'); return Math.floor(m / 60) + 'h ' + (m % 60) + 'm'; }, function (x) { return x.mins; }],
      ['avg', 'Avg watched', function (L) { var v = 0, n = 0; L.forEach(function (x) { if (x.views) { v += x.avg * x.views; n += x.views; } }); return (n ? Math.round(v / n) : 0) + '%'; }, function (x) { return x.views ? x.avg : null; }],
      ['fin', 'Finished', function (L) { return fmt(sum(L, 'fin')); }, function (x) { return x.fin; }]
    ];
    function sum(L, k) { return L.reduce(function (s, x) { return s + x[k]; }, 0); }
    function win(off) { var n = VS.range; var end = ND - off * n; return DAYS.slice(Math.max(0, end - n), end); }
    function sub(m, L) {
      var v = sum(L, 'views') || 1;
      return '<span class="muted">' + ({ views: Math.round(v / L.length) + ' a day', uniq: 'watched at least one', mins: '≈ ' + (sum(L, 'mins') / 60 / 45).toFixed(1) + ' h per student', avg: 'Target 70%', fin: Math.round(sum(L, 'fin') / v * 100) + '% of views' })[m[0]] + '</span>';
    }
    function delta(m) {
      if (VS.range === 43) return '<span class="muted">This term</span>';
      var a = win(0), b = win(1); if (!b.length) return '<span class="muted">—</span>'; var scale = VS.range / b.length;
      var va = m[0] === 'avg' ? null : sum(a, m[0]), vb = m[0] === 'avg' ? null : sum(b, m[0]);
      if (m[0] === 'uniq') { va = { 7: 31, 14: 38, 30: 43 }[VS.range]; vb = { 7: 29, 14: 33, 30: 12 }[VS.range]; }
      if (va === null) return '<span class="muted">vs last ' + VS.range + ' days</span>';
      if (m[0] !== 'uniq') vb = vb * scale; var p = vb ? Math.round((va - vb) / vb * 100) : 0;
      return '<span style="color:' + (p >= 0 ? 'var(--ok)' : 'var(--red)') + ';font-weight:600">' + (p >= 0 ? '▲' : '▼') + ' ' + Math.abs(p) + '%</span> <span class="muted">vs previous</span>';
    }
    root.innerHTML = '<div id="vtop"></div><div id="vchart"></div><div id="vtable" style="margin-top:20px"></div><div id="vside" style="margin-top:20px"></div><div id="vheat" style="margin-top:20px"></div><div id="vnt" style="margin-top:20px"></div>';
    function renderTop() {
      var L = win(0);
      var h = head('Video engagement', '',
        '<div class="seg2" id="rng">' + [[7, '7 days'], [14, '14 days'], [30, '30 days'], [43, 'This term']].map(function (r) { return '<button data-r="' + r[0] + '" class="' + (VS.range === r[0] ? 'on' : '') + '">' + r[1] + '</button>'; }).join('') + '</div>');
      h += '<div class="panel" style="overflow:hidden"><div class="mtabs">' + METRICS.map(function (m) { return '<button data-m="' + m[0] + '" class="' + (VS.metric === m[0] ? 'on' : '') + '"><span class="l">' + m[1] + '</span><span class="v">' + m[2](L) + '</span><span class="d">' + sub(m, L) + '</span></button>'; }).join('') + '</div><div id="lc" style="padding:14px 20px 18px"></div></div>';
      $('#vtop').innerHTML = h;
      lineChart();
    }
    function lineChart() {
      var m = METRICS.filter(function (x) { return x[0] === VS.metric; })[0], L = win(0), vals = L.map(m[3]);
      var W = 1000, H = 250, pl = 44, pr = 12, pt = 16, pb = 30, max = Math.max.apply(null, vals.filter(function (v) { return v !== null; })) || 1;
      max = Math.ceil(max * 1.15 / 5) * 5;
      var x = function (i) { return pl + (L.length === 1 ? 0 : i * (W - pl - pr) / (L.length - 1)); }, y = function (v) { return pt + (1 - v / max) * (H - pt - pb); };
      var pts = vals.map(function (v, i) { return v === null ? null : [x(i), y(v)]; });
      var line = '', area = '', started = false;
      pts.forEach(function (p) { if (!p) return; line += (started ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1) + ' '; started = true; });
      var firstP = pts.filter(Boolean)[0], lastP = pts.filter(Boolean).slice(-1)[0];
      area = line + 'L' + lastP[0] + ' ' + (H - pb) + ' L' + firstP[0] + ' ' + (H - pb) + 'Z';
      var grid = [0, .25, .5, .75, 1].map(function (g) { var yy = pt + g * (H - pt - pb); return '<line x1="' + pl + '" x2="' + (W - pr) + '" y1="' + yy + '" y2="' + yy + '" stroke="#ECEDF0" stroke-dasharray="' + (g === 1 ? '' : '3 4') + '"/><text x="' + (pl - 8) + '" y="' + (yy + 4) + '" text-anchor="end" font-size="11" fill="#9AA0AC">' + fmt(max * (1 - g)) + (VS.metric === 'avg' ? '%' : '') + '</text>'; }).join('');
      var step = Math.ceil(L.length / 7), xl = '';
      L.forEach(function (dd, i) { if (i % step === 0 || i === L.length - 1) xl += '<text x="' + x(i) + '" y="' + (H - 8) + '" text-anchor="middle" font-size="11" fill="#9AA0AC">' + dd.d.getDate() + ' ' + dd.d.toLocaleString('en', { month: 'short' }) + '</text>'; });
      var off = ND - L.length, mk = '';
      L.forEach(function (dd, i) { var rid = REL[off + i]; if (rid) mk += '<line x1="' + x(i) + '" x2="' + x(i) + '" y1="' + pt + '" y2="' + (H - pb) + '" stroke="#E31E24" stroke-opacity=".25"/><rect x="' + (x(i) - 13) + '" y="' + (pt - 2) + '" width="26" height="16" rx="5" fill="#E31E24"/><text x="' + x(i) + '" y="' + (pt + 10) + '" text-anchor="middle" font-size="10" font-weight="700" fill="#fff">' + rid + '</text>'; });
      var dots = pts.map(function (p) { return p ? '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="' + (L.length <= 14 ? 3.5 : 0) + '" fill="#fff" stroke="#E31E24" stroke-width="2"/>' : ''; }).join('');
      $('#lc').innerHTML = '<svg viewBox="0 0 ' + W + ' ' + H + '" style="width:100%;height:auto;display:block"><defs><linearGradient id="ga" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E31E24" stop-opacity=".22"/><stop offset="1" stop-color="#E31E24" stop-opacity="0"/></linearGradient></defs>' + grid + xl + mk +
        '<path d="' + area + '" fill="url(#ga)"/><path d="' + line + '" fill="none" stroke="#E31E24" stroke-width="2.5" stroke-linejoin="round"/>' + dots +
        '<line id="cx" y1="' + pt + '" y2="' + (H - pb) + '" stroke="#14161C" stroke-opacity=".35" style="display:none"/><circle id="cd" r="5" fill="#E31E24" stroke="#fff" stroke-width="2" style="display:none"/><rect class="lc-hit" x="' + pl + '" y="0" width="' + (W - pl - pr) + '" height="' + H + '" fill="transparent"/></svg>' +
        '<div class="mlegend"><span><i style="background:#E31E24"></i>' + m[1] + '</span><span><i style="background:#E31E24;border-radius:3px"></i>Lecture posted</span></div>';
      var svg = $('#lc svg'), hit = $('.lc-hit', svg), cx = $('#cx', svg), cd = $('#cd', svg);
      hit.addEventListener('mousemove', function (e) {
        var b = svg.getBoundingClientRect(), sx = (e.clientX - b.left) / b.width * W, i = Math.round((sx - pl) / ((W - pl - pr) / Math.max(1, L.length - 1)));
        i = Math.max(0, Math.min(L.length - 1, i)); var p = pts[i];
        cx.setAttribute('x1', x(i)); cx.setAttribute('x2', x(i)); cx.style.display = '';
        if (p) { cd.setAttribute('cx', p[0]); cd.setAttribute('cy', p[1]); cd.style.display = ''; }
        var dd = L[i], rid = REL[off + i];
        tip.innerHTML = '<b>' + dd.d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }) + '</b><br>' + m[1] + ': ' + (vals[i] === null ? '—' : fmt(vals[i]) + (VS.metric === 'avg' ? '%' : VS.metric === 'mins' ? ' min' : '')) + (rid ? '<br><span style="color:#F7A8AA">' + rid + ' posted</span>' : '');
        tip.style.left = (e.clientX + 14) + 'px'; tip.style.top = (e.clientY - 60) + 'px'; tip.classList.add('show');
      });
      hit.addEventListener('mouseleave', function () { cx.style.display = 'none'; cd.style.display = 'none'; tip.classList.remove('show'); });
    }
    function retSvg(r, h) {
      var W = 600, H = h || 140, pts = r.ret.map(function (v, i) { return [i * W / 23, 8 + (1 - v / 100) * (H - 16)]; });
      var line = pts.map(function (p, i) { return (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1); }).join(' ');
      var sk = r.skip ? '<rect x="' + (r.skip[0] * W / 23) + '" y="0" width="' + ((r.skip[1] - r.skip[0]) * W / 23) + '" height="' + H + '" fill="#D98A00" fill-opacity=".13"/>' : '';
      return '<svg viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="none" style="width:100%;height:' + H + 'px;display:block">' + sk + '<line x1="0" x2="' + W + '" y1="' + (8 + (H - 16) / 2) + '" y2="' + (8 + (H - 16) / 2) + '" stroke="#ECEDF0" stroke-dasharray="3 4"/><path d="' + line + ' L' + W + ' ' + H + ' L0 ' + H + 'Z" fill="#14161C" fill-opacity=".07"/><path d="' + line + '" fill="none" stroke="#14161C" stroke-width="2" vector-effect="non-scaling-stroke"/></svg>';
    }
    function renderTable() {
      var list = RECS.slice().sort(function (a, b) { var x = a[VS.sort], y = b[VS.sort]; return (x > y ? 1 : x < y ? -1 : 0) * VS.dir; });
      var cols = [['n', 'Lecture'], ['views', 'Views'], ['viewers', 'Students'], ['w', 'Avg watched'], ['fin', 'Finished'], ['mins', 'Watch time']];
      var th = cols.map(function (c) { return '<th data-vs="' + c[0] + '" class="' + (VS.sort === c[0] ? 'sorted ' + (VS.dir > 0 ? 'asc' : '') : '') + (c[0] !== 'n' && c[0] !== 'w' ? ' num' : '') + '">' + c[1] + '</th>'; }).join('');
      var rows = list.map(function (r) {
        var low = r.w < VS.bar;
        var row = '<tr class="r ' + (low ? 'low' : '') + (VS.open === r.id ? ' sel' : '') + '" data-rec="' + r.id + '"><td><div class="row" style="gap:12px"><span class="vth ' + r.cv + '"><span class="pattern"></span>' + IC.play + '<em>' + mmss(r.len) + '</em></span><div><b style="color:var(--ink)">' + esc(r.n) + '</b><div class="small muted">' + r.wk + ' · posted ' + DAYS[r.posted].d.getDate() + ' ' + DAYS[r.posted].d.toLocaleString('en', { month: 'short' }) + '</div></div></div></td>' +
          '<td class="num">' + r.views + '</td><td class="num">' + r.viewers + ' <span class="muted">/ 48</span></td><td style="width:230px"><div class="cbar2"><div class="t"><i class="' + (low ? 'warn' : 'ok') + '" style="width:' + r.w + '%"></i><s style="left:' + VS.bar + '%"></s></div><b>' + r.w + '%</b></div></td><td class="num">' + r.fin + '</td><td class="num">' + Math.floor(r.mins / 60) + 'h ' + (r.mins % 60) + 'm</td></tr>';
        if (VS.open === r.id) {
          var skipTxt = r.skip ? mmss(r.skip[0] * r.len / 24) + ' – ' + mmss((r.skip[1] + 1) * r.len / 24) : 'Nothing skipped by most viewers';
          row += '<tr class="exp"><td colspan="6"><div class="in"><div><div class="row between small" style="margin-bottom:8px"><b style="color:var(--ink)">Retention</b><span class="muted">Skipped part in amber</span></div>' + retSvg(r) +
            '<div class="row between small muted mono" style="margin-top:4px"><span>0:00</span><span>' + mmss(r.len / 2) + '</span><span>' + mmss(r.len) + '</span></div></div>' +
            '<div class="stack" style="gap:10px"><div class="kpi2" style="padding:12px 14px"><div class="l">Skipped most</div><div style="font-weight:700;color:' + (r.skip ? '#9A6200' : 'var(--ok)') + ';margin-top:6px" class="mono">' + skipTxt + '</div></div>' +
            '<div class="kpi2" style="padding:12px 14px"><div class="l">Haven\'t watched</div><div class="n" style="font-size:22px;margin-top:6px">' + (48 - r.viewers) + '</div></div>' +
            '<a class="btn btn-primary" href="15-recording-detail.html" style="justify-content:center">Full details ' + IC.arrow + '</a><a class="btn btn-ghost" data-toast="Reminder sent to ' + (48 - r.viewers) + ' students" style="justify-content:center">' + IC.mail + ' Remind the rest</a></div></div></td></tr>';
        }
        return row;
      }).join('');
      var below = RECS.filter(function (r) { return r.w < VS.bar; }).length;
      $('#vtable').innerHTML = '<div class="panel" style="overflow:hidden"><div class="panel-h" style="padding-bottom:14px"><div><h3>Lectures</h3><div class="small muted"><b style="color:#9A6200">' + below + ' below target</b> · click one for details</div></div>' +
        '<div class="slider">Target <input type="range" min="40" max="95" step="5" value="' + VS.bar + '" id="bar"><b>' + VS.bar + '%</b></div></div><table class="dt"><tr>' + th + '</tr>' + rows + '</table></div>';
      $('#bar').addEventListener('input', function (e) { VS.bar = +e.target.value; renderTable(); $('#bar').focus(); });
    }
    function renderSide() {
      var dev = [['Desktop', 58, '#14161C'], ['Mobile', 34, '#E31E24'], ['Tablet', 8, '#D98A00']], off = 0, R = 50, C = 2 * Math.PI * R;
      var arcs = dev.map(function (d) { var len = d[1] / 100 * C, s = '<circle data-tip="' + d[0] + ' · ' + d[1] + '%" cx="65" cy="65" r="' + R + '" fill="none" stroke="' + d[2] + '" stroke-width="16" stroke-dasharray="' + (len - 2) + ' ' + (C - len + 2) + '" stroke-dashoffset="' + (-off) + '" transform="rotate(-90 65 65)"/>'; off += len; return s; }).join('');
      var src = [['Course page in Moodle', 64], ['HTU mobile app', 22], ['SARAH answer links', 9], ['Shared direct link', 5]];
      var spd = [['1×', 61], ['1.25×', 14], ['1.5×', 19], ['2×', 6]];
      var hrs = ['00', '03', '06', '09', '12', '15', '18', '21'], dn = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], base = [1, 0, 1, 4, 6, 7, 9, 10];
      var hm = '<table class="whm"><tr><th></th>' + hrs.map(function (h) { return '<th>' + h + '</th>'; }).join('') + '</tr>' + dn.map(function (d) {
        return '<tr><th>' + d + '</th>' + base.map(function (b, i) { var v = b * (d === 'Sun' || d === 'Tue' ? 1.5 : d === 'Wed' ? 1.15 : d === 'Fri' || d === 'Sat' ? .8 : 1) + rnd() * 2; return '<td data-tip="' + d + ' ' + hrs[i] + ':00 – ' + ('0' + ((+hrs[i] + 3) % 24)).slice(-2) + ':00 · ' + Math.round(v * 3) + ' views" style="background:rgba(227,30,36,' + (0.06 + Math.min(1, v / 15) * 0.9).toFixed(2) + ')"></td>'; }).join('') + '</tr>';
      }).join('') + '</table>';
      $('#vside').innerHTML = '<div class="vside">' +
        '<div class="panel"><div class="panel-h"><h3>Devices</h3></div><div class="panel-b"><div class="donut2"><svg viewBox="0 0 130 130" style="width:120px;height:120px">' + arcs + '</svg><div class="lg2">' + dev.map(function (d) { return '<button><i style="background:' + d[2] + '"></i>' + d[0] + '<b>' + d[1] + '%</b></button>'; }).join('') + '</div></div></div></div>' +
        '<div class="panel"><div class="panel-h"><h3>Where they watch</h3></div><div class="panel-b">' + src.map(function (s) { return '<div style="margin-bottom:11px"><div class="row between small" style="margin-bottom:5px"><span>' + s[0] + '</span><b style="color:var(--ink)">' + s[1] + '%</b></div><div class="cbar2"><div class="t"><i style="width:' + s[1] + '%"></i></div></div></div>'; }).join('') + '</div></div>' +
        '<div class="panel"><div class="panel-h"><h3>Playback speed</h3><span class="small muted">Captions 23%</span></div><div class="panel-b"><div class="spd">' + spd.map(function (s) { return '<div data-tip="' + s[0] + ' · ' + s[1] + '% of watch time"><i style="height:' + (s[1] / 61 * 100) + '%"></i><b>' + s[1] + '%</b><span>' + s[0] + '</span></div>'; }).join('') + '</div></div></div>' +
        '<div class="panel"><div class="panel-h"><h3>When students watch</h3><span class="small muted">Peak: Sun &amp; Tue evenings</span></div><div class="panel-b">' + hm + '</div></div></div>';
    }
    var STU = NAMES.slice(0, 48).map(function (n, k) {
      var g = 'ABC'[k % 3], v = RECS.map(function (r) { var p = rnd() < r.viewers / 48 ? Math.min(100, Math.round(r.w + (rnd() - .4) * 60)) : 0; return Math.max(0, p); });
      if (n === 'Layla Haddad') v = [100, 100, 45, 100, 88, 59]; if (n === 'Khaled Tamimi') v = [40, 22, 0, 18, 0, 0]; if (n === 'Yousef Ali') v = [100, 100, 92, 100, 100, 100];
      return { n: n, k: k, g: g, v: v, avg: Math.round(v.reduce(function (s, x) { return s + x; }, 0) / 6) };
    });
    function ring(v, label) {
      var C = 2 * Math.PI * 13, col = v >= 90 ? '#1E9E62' : v > 0 ? '#D98A00' : '#E4E6EB';
      return '<span class="ring2" data-tip="' + label + ' · ' + (v ? v + '% watched' : 'not watched') + '"><svg viewBox="0 0 34 34"><circle cx="17" cy="17" r="13" fill="none" stroke="#EEEFF2" stroke-width="4"/>' + (v ? '<circle cx="17" cy="17" r="13" fill="none" stroke="' + col + '" stroke-width="4" stroke-linecap="round" stroke-dasharray="' + (v / 100 * C).toFixed(1) + ' ' + C.toFixed(1) + '" transform="rotate(-90 17 17)"/>' : '') + '</svg>' + (v >= 90 ? '<em class="ok">✓</em>' : v ? '<em>' + v + '</em>' : '<em class="z">–</em>') + '</span>';
    }
    function renderHeat() {
      VS.hq = VS.hq || ''; VS.hsort = VS.hsort || 'low'; VS.hshow = VS.hshow || 8;
      var all = STU.filter(function (s) { return (VS.group === 'all' || s.g === VS.group) && (!VS.behind || s.avg < 50) && (!VS.hq || s.n.toLowerCase().indexOf(VS.hq) > -1); })
        .sort(function (a, b) { return VS.hsort === 'low' ? a.avg - b.avg : VS.hsort === 'high' ? b.avg - a.avg : a.n.localeCompare(b.n); });
      var L = all.slice(0, VS.hshow), nBehind = STU.filter(function (s) { return (VS.group === 'all' || s.g === VS.group) && s.avg < 50; }).length;
      var st = function (a) { return a >= 75 ? '<span class="badge ok">On track</span>' : a >= 50 ? '<span class="badge warn">Falling behind</span>' : a > 15 ? '<span class="badge red">Behind</span>' : '<span class="badge red" style="background:#FDE8E8">Barely started</span>'; };
      var h = '<div class="panel" style="overflow:hidden"><div class="panel-h" style="padding-bottom:14px"><div><h3>Who watched what</h3><div class="small muted">Hover a ring for the %</div></div>' +
        '<div class="tools"><label class="sbox">' + IC.search + '<input id="hq" placeholder="Find a student" value="' + esc(VS.hq) + '"></label>' +
        '<div class="seg2">' + [['all', 'All'], ['A', 'A'], ['B', 'B'], ['C', 'C']].map(function (g) { return '<button data-g2="' + g[0] + '" class="' + (VS.group === g[0] ? 'on' : '') + '">' + (g[0] === 'all' ? 'All groups' : 'Group ' + g[1]) + '</button>'; }).join('') + '</div>' +
        '<button class="chip' + (VS.behind ? ' on' : '') + '" data-behind style="cursor:pointer;border:1px solid var(--line)">Behind · ' + nBehind + '</button>' +
        '<div class="seg2">' + [['low', 'Least watched'], ['high', 'Most watched'], ['az', 'A–Z']].map(function (o) { return '<button data-hs="' + o[0] + '" class="' + (VS.hsort === o[0] ? 'on' : '') + '">' + o[1] + '</button>'; }).join('') + '</div></div></div>';
      h += '<table class="wtab"><tr><th>Student</th>' + RECS.map(function (r) { return '<th class="c" data-tip="' + esc(r.n) + '">' + r.id + '</th>'; }).join('') + '<th style="width:200px">Average</th><th>Status</th><th></th></tr>' +
        (L.length ? L.map(function (s) {
          return '<tr><td><a href="16-student-in-course.html" class="row" style="gap:10px">' + av(s.n, s.k).replace('avatar xs', 'avatar sm') + '<div><b style="color:var(--ink)">' + s.n + '</b><div class="small muted">Group ' + s.g + '</div></div></a></td>' +
            s.v.map(function (v, i) { return '<td class="c">' + ring(v, RECS[i].id) + '</td>'; }).join('') +
            '<td><div class="cbar2"><div class="t"><i class="' + (s.avg >= 75 ? 'ok' : s.avg >= 50 ? 'warn' : '') + '" style="width:' + s.avg + '%"></i></div><b style="min-width:40px">' + s.avg + '%</b></div></td><td>' + st(s.avg) + '</td>' +
            '<td style="text-align:right">' + (s.avg < 75 ? '<a class="iconbtn" style="width:32px;height:32px;display:inline-grid" data-toast="Reminder sent to ' + s.n.split(' ')[0] + '" data-tip="Send a reminder">' + IC.mail + '</a>' : '') + '</td></tr>';
        }).join('') : '<tr class="empty-row"><td colspan="10">No student matches.</td></tr>') + '</table>';
      h += '<div class="row between" style="padding:12px 20px;border-top:1px solid var(--line);background:#FCFCFD;flex-wrap:wrap;gap:10px"><div class="mlegend" style="margin:0"><span><i style="background:#1E9E62"></i>Finished</span><span><i style="background:#D98A00"></i>Partly watched</span><span><i style="background:#E4E6EB"></i>Not watched</span></div>' +
        '<span class="small muted">Showing ' + L.length + ' of ' + all.length + (all.length > L.length ? ' · <a class="link" data-hmore>Show all</a>' : VS.hshow > 8 ? ' · <a class="link" data-hless>Show less</a>' : '') + '</span></div></div>';
      $('#vheat').innerHTML = h;
      var q = $('#hq'); q.addEventListener('input', function () { VS.hq = q.value.toLowerCase(); var pos = q.selectionStart; renderHeat(); var n = $('#hq'); n.focus(); n.setSelectionRange(pos, pos); });
    }
    root.addEventListener('click', function (e) {
      if (e.target.closest('[data-behind]')) { VS.behind = !VS.behind; renderHeat(); return; }
      var hs = e.target.closest('[data-hs]'); if (hs) { VS.hsort = hs.getAttribute('data-hs'); renderHeat(); return; }
      if (e.target.closest('[data-hmore]')) { VS.hshow = 48; renderHeat(); return; }
      if (e.target.closest('[data-hless]')) { VS.hshow = 8; renderHeat(); return; }
    });
    function renderNT() {
      var nt = [['nt1', 'Lab safety briefing', 'Week 1 · url', '883412'], ['nt2', 'Guest talk — Siemens Energy', 'Week 5 · page', '883977']];
      $('#vnt').innerHTML = '<div class="panel"><div class="panel-h"><div><h3>Not tracked yet</h3><div class="small muted">Videos with no watch data</div></div><span class="row small" style="gap:8px;padding:6px 12px;border-radius:99px;background:var(--info-50)"><b style="color:var(--info)">SARAH</b> 6 indexed · 1 no captions</span></div><div class="panel-b">' +
        nt.map(function (r) { var on = VS.tracked[r[0]]; return '<div class="who2"><span class="tico fl" style="width:36px;height:36px;border-radius:10px;display:grid;place-items:center;background:var(--info-50);color:var(--info)">' + IC.link + '</span><div style="flex:1"><b>' + r[1] + '</b><div class="small muted">' + r[2] + '</div></div>' + (on ? '<span class="badge ok">✓ Tracked</span>' : '<a class="btn btn-sm btn-ghost" data-nt="' + r[0] + '">Convert to tracked</a>') + '</div>'; }).join('') + '</div></div>';
    }
    root.addEventListener('click', function (e) {
      var m = e.target.closest('[data-m]'); if (m) { VS.metric = m.getAttribute('data-m'); renderTop(); return; }
      var r = e.target.closest('[data-r]'); if (r) { VS.range = +r.getAttribute('data-r'); renderTop(); return; }
      var s = e.target.closest('th[data-vs]'); if (s) { var k = s.getAttribute('data-vs'); if (VS.sort === k) VS.dir = -VS.dir; else { VS.sort = k; VS.dir = k === 'n' ? 1 : -1; } renderTable(); return; }
      var t = e.target.closest('[data-toast]'); if (t) { toast(t.getAttribute('data-toast')); return; }
      var row = e.target.closest('tr[data-rec]'); if (row && !e.target.closest('a')) { var id = row.getAttribute('data-rec'); VS.open = VS.open === id ? null : id; renderTable(); return; }
      var g = e.target.closest('[data-g2]'); if (g) { VS.group = g.getAttribute('data-g2'); renderHeat(); return; }
      var n = e.target.closest('[data-nt]'); if (n) { VS.tracked[n.getAttribute('data-nt')] = 1; renderNT(); toast('Tracking turned on'); }
    });
    VS.open = 'L9';
    renderTop(); renderTable(); renderSide(); renderHeat(); renderNT();
  }
  /* ════════════════════════ COURSE COMPLETION ════════════════════════ */
  if (PAGE === 'completion') {
    var CR = [['Quiz 1', 48], ['Quiz 2', 47], ['Quiz 3', 46], ['Lab 1', 48], ['Lab 2', 45], ['Lab 3', 29], ['L7', 44], ['L8', 40], ['L9', 31], ['Grade ≥ 60', 39]];
    var S2 = NAMES.map(function (n, k) { return { n: n, k: k, g: 'ABC'[k % 3], d: n === 'Yousef Ali' ? 99 : n === 'Khaled Tamimi' ? -9 : n === 'Dana Saleh' ? -5 : rnd() * 3, done: [] }; });
    CR.forEach(function (c, ci) {
      var ranked = S2.map(function (s) { return [s, s.d + rnd() * 2.2]; }).sort(function (a, b) { return b[1] - a[1]; });
      ranked.forEach(function (r, i) { r[0].done[ci] = i < c[1]; });
    });
    S2.forEach(function (s) { s.cnt = s.done.filter(Boolean).length; s.p = s.cnt * 10; });
    var CS = { st: null, crit: null, group: 'all', q: '', sort: 'low', show: 12 };
    var stat = function (s) { return s.cnt === 10 ? 'done' : s.cnt >= 7 ? 'track' : s.cnt <= 4 ? 'behind' : 'mid'; };
    root.innerHTML = '<div id="ctop"></div><div id="ctab" style="margin-top:18px"></div>';
    function render() {
      var base = S2.filter(function (s) { return CS.group === 'all' || s.g === CS.group; });
      var cnt = { done: 0, track: 0, behind: 0 }; base.forEach(function (s) { var t = stat(s); if (cnt[t] !== undefined) cnt[t]++; if (t === 'done') cnt.track++; });
      var avg = Math.round(base.reduce(function (a, s) { return a + s.p; }, 0) / base.length);
      var list = base.filter(function (s) {
        if (CS.st === 'done' && s.cnt !== 10) return false;
        if (CS.st === 'track' && s.cnt < 7) return false;
        if (CS.st === 'behind' && s.cnt > 4) return false;
        if (CS.crit !== null && s.done[CS.crit]) return false;
        return !CS.q || s.n.toLowerCase().indexOf(CS.q) > -1;
      }).sort(function (a, b) { return CS.sort === 'low' ? a.cnt - b.cnt : CS.sort === 'high' ? b.cnt - a.cnt : a.n.localeCompare(b.n); });
      var card = function (key, l, v, sub, col) { return '<button class="segc ' + (CS.st === key ? 'on' : '') + '" data-st="' + key + '"><div class="t"><i style="background:' + col + '"></i>' + l + '</div><div class="v">' + v + '</div><div class="d">' + sub + '</div></button>'; };
      var h = head('Course completion', 'Students complete the course when <b style="color:var(--ink)">all 10</b> criteria are met · click anything to filter',
        '<a class="btn btn-ghost" data-toast="Downloaded completion report (CSV)">' + IC.down + ' Download</a><a class="btn btn-ghost" data-toast="Opens Moodle\'s completion settings">Completion settings</a>');
      h += '<div class="seg-cards">' + card('done', 'Completed the course', cnt.done + '<small style="font-size:15px;color:var(--muted)"> / ' + base.length + '</small>', 'All 10 criteria met', 'var(--ink)') +
        '<div class="segc" style="cursor:default"><div class="t"><i style="background:var(--warn)"></i>Average progress</div><div class="v">' + avg + '%</div><div class="d">Of the 10 criteria</div></div>' +
        card('track', 'On track', cnt.track, '7 or more criteria met', 'var(--ok)') + card('behind', 'Behind', cnt.behind, '4 or fewer met', 'var(--red)') + '</div>';
      h += '<div class="panel" style="margin-top:16px"><div class="panel-h"><div><h3>Criteria</h3><div class="small muted">Click one to see who hasn\'t met it</div></div>' + (CS.crit !== null ? '<a class="link" data-crit="-1">Clear</a>' : '') + '</div><div class="panel-b"><div class="crit">' +
        CR.map(function (c, i) { var done = base.filter(function (s) { return s.done[i]; }).length, miss = base.length - done; return '<button data-crit="' + i + '" class="' + (CS.crit === i ? 'on' : '') + '"><span class="row between"><b>' + c[0] + '</b><span>' + done + '/' + base.length + '</span></span><span class="t"><i style="width:' + (done / base.length * 100) + '%;background:' + (done / base.length >= .9 ? 'var(--ok)' : done / base.length >= .7 ? 'var(--warn)' : 'var(--red)') + '"></i></span><span class="m">' + (miss ? miss + ' missing' : 'Everyone') + '</span></button>'; }).join('') + '</div></div></div>';
      $('#ctop').innerHTML = h;
      var chips = [];
      if (CS.st) chips.push(['st', { done: 'Completed', track: 'On track', behind: 'Behind' }[CS.st]]);
      if (CS.crit !== null) chips.push(['crit', 'Missing ' + CR[CS.crit][0]]);
      if (CS.group !== 'all') chips.push(['group', 'Group ' + CS.group]);
      if (CS.q) chips.push(['q', '“' + esc(CS.q) + '”']);
      var shown = list.slice(0, CS.show);
      var t = '<div class="panel" style="overflow:hidden"><div class="panel-h" style="padding-bottom:12px"><div class="row" style="gap:10px"><h3>Students</h3><span class="badge">' + list.length + '</span></div><div class="tools"><label class="sbox">' + IC.search + '<input id="cq" placeholder="Find a student" value="' + esc(CS.q) + '"></label>' +
        '<div class="seg2">' + [['all', 'All groups'], ['A', 'Group A'], ['B', 'Group B'], ['C', 'Group C']].map(function (g) { return '<button data-cg="' + g[0] + '" class="' + (CS.group === g[0] ? 'on' : '') + '">' + g[1] + '</button>'; }).join('') + '</div>' +
        '<div class="seg2">' + [['low', 'Least done'], ['high', 'Most done'], ['az', 'A–Z']].map(function (o) { return '<button data-cs="' + o[0] + '" class="' + (CS.sort === o[0] ? 'on' : '') + '">' + o[1] + '</button>'; }).join('') + '</div></div></div>';
      if (chips.length) t += '<div class="row" style="gap:8px;padding:0 20px 12px;flex-wrap:wrap"><span class="small muted">Filtered by</span>' + chips.map(function (c) { return '<span class="fchip">' + c[1] + '<a data-clr="' + c[0] + '">✕</a></span>'; }).join('') + '<a class="link" data-clr="all" style="font-size:12.5px">Clear all</a>' + (list.length && (CS.st === 'behind' || CS.crit !== null) ? '<a class="btn btn-sm btn-primary" style="margin-left:auto" data-toast="Message sent to ' + list.length + ' students">' + IC.mail + ' Message these ' + list.length + '</a>' : '') + '</div>';
      t += '<div style="overflow-x:auto"><table class="wtab" style="min-width:1100px"><tr><th>Student</th>' + CR.map(function (c, i) { return '<th class="c' + (CS.crit === i ? ' hl' : '') + '">' + c[0] + '</th>'; }).join('') + '<th style="width:170px">Progress</th><th>Status</th></tr>' +
        (shown.length ? shown.map(function (s) {
          var stt = stat(s);
          return '<tr><td><a href="16-student-in-course.html" class="row" style="gap:10px">' + av(s.n, s.k).replace('avatar xs', 'avatar sm') + '<div><b style="color:var(--ink)">' + s.n + '</b><div class="small muted">Group ' + s.g + '</div></div></a></td>' +
            s.done.map(function (d, i) { return '<td class="c' + (CS.crit === i ? ' hl' : '') + '">' + (d ? '<span class="ck y">✓</span>' : '<span class="ck n"></span>') + '</td>'; }).join('') +
            '<td><div class="cbar2"><div class="t"><i class="' + (s.p >= 70 ? 'ok' : s.p >= 50 ? 'warn' : '') + '" style="width:' + s.p + '%"></i></div><b style="min-width:40px">' + s.p + '%</b></div></td><td>' +
            ({ done: '<span class="badge dark">Complete</span>', track: '<span class="badge ok">On track</span>', mid: '<span class="badge warn">In progress</span>', behind: '<span class="badge red">Behind</span>' })[stt] + '</td></tr>';
        }).join('') : '<tr class="empty-row"><td colspan="13">No student matches these filters.</td></tr>') + '</table></div>';
      t += '<div class="row between" style="padding:12px 20px;border-top:1px solid var(--line);background:#FCFCFD"><span class="small muted">Showing ' + shown.length + ' of ' + list.length + '</span>' + (list.length > shown.length ? '<a class="link" data-cmore>Show all</a>' : CS.show > 12 ? '<a class="link" data-cless>Show less</a>' : '') + '</div></div>';
      $('#ctab').innerHTML = t;
      var q = $('#cq'); q.addEventListener('input', function () { CS.q = q.value.toLowerCase(); var pos = q.selectionStart; render(); var n = $('#cq'); n.focus(); n.setSelectionRange(pos, pos); });
    }
    root.addEventListener('click', function (e) {
      var x;
      if ((x = e.target.closest('[data-st]'))) { var v = x.getAttribute('data-st'); CS.st = CS.st === v ? null : v; return render(); }
      if ((x = e.target.closest('[data-crit]'))) { var c = +x.getAttribute('data-crit'); CS.crit = (c < 0 || CS.crit === c) ? null : c; return render(); }
      if ((x = e.target.closest('[data-cg]'))) { CS.group = x.getAttribute('data-cg'); return render(); }
      if ((x = e.target.closest('[data-cs]'))) { CS.sort = x.getAttribute('data-cs'); return render(); }
      if ((x = e.target.closest('[data-clr]'))) { var k = x.getAttribute('data-clr'); if (k === 'all' || k === 'st') CS.st = null; if (k === 'all' || k === 'crit') CS.crit = null; if (k === 'all' || k === 'group') CS.group = 'all'; if (k === 'all' || k === 'q') CS.q = ''; return render(); }
      if (e.target.closest('[data-cmore]')) { CS.show = 48; return render(); }
      if (e.target.closest('[data-cless]')) { CS.show = 12; return render(); }
      if ((x = e.target.closest('[data-toast]'))) toast(x.getAttribute('data-toast'));
    });
    render();
  }
})();
