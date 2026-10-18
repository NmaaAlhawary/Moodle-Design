/* Course bar: preview another group's members, and the ⌘K "Jump to anything" launcher. */
(function () {
  var bar = document.querySelector('.cbar');
  if (!bar) return;
  var GROUPS = {
    teach: [['Course', '58-teacher-course.html'], ['Activities', '53-course-activities.html'], ['Competencies', '59-course-competencies.html']],
    people: [['Participants', '54-course-participants.html'], ['Groups', '60-course-groups.html']],
    marks: [['Gradebook', '55-course-grades.html'], ['Gradebook setup', '61-gradebook-setup.html'], ['Grade history', '62-grade-history.html']],
    insight: [['Logs', '63-course-logs.html'], ['Participation', '64-course-participation.html'], ['Activity report', '65-course-activity-report.html', 1], ['Course completion', '66-course-completion.html', 1], ['Reports', '12-course-reports.html'], ['Video engagement', '14-video-engagement.html', 1]],
    build: [['Settings', '#', 0, 1], ['Question banks', '31-quiz-studio.html'], ['Badges', '57-course-badges.html'], ['Backup', '#', 0, 1], ['Restore', '#', 0, 1], ['Import', '32-csv-import.html']]
  };
  var NAMES = { teach: 'Teach', people: 'People', marks: 'Marks', insight: 'Insight', build: 'Build' };
  var sub = bar.querySelector('.cbar-chips') || bar.querySelector('.cbar-sub .wrap');
  var home = bar.getAttribute('data-group');
  var current = bar.getAttribute('data-member');
  var whole = bar.getAttribute('data-whole') === '1';

  function chips(g) {
    sub.innerHTML = GROUPS[g].map(function (m) {
      if (m[3]) return '<span class="mchip lock" title="You do not hold the permission for this">🔒 ' + m[0] + '</span>';
      var on = g === home && m[0] === current ? ' on' : '';
      var wc = m[2] && !whole ? ' <span class="wc">whole course</span>' : '';
      return '<a class="mchip' + on + '" href="' + m[1] + '">' + m[0] + wc + '</a>';
    }).join('');
  }
  bar.querySelectorAll('.gtabs a').forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      bar.querySelectorAll('.gtabs a').forEach(function (b) { b.classList.remove('on', 'here'); });
      a.classList.add('on');
      if (a.dataset.g !== home) bar.querySelector('[data-g="' + home + '"]').classList.add('here');
      chips(a.dataset.g);
    });
  });
  chips(home);

  // ⌘K launcher
  var extra = (bar.getAttribute('data-acts') || 'Lecture 9 — Transformers|Week 4;Lecture 8 — Transformer theory|Week 4;Quiz 3 — DC motors|Week 3;Lab report 2|Week 3;Quiz 4 — Transformers|Week 4').split(';');
  var items = [];
  Object.keys(GROUPS).forEach(function (g) { GROUPS[g].forEach(function (m) { if (!m[3]) items.push([m[0], NAMES[g], m[1]]); }); });
  extra.forEach(function (x) { var p = x.split('|'); items.push([p[0], p[1], '04-course-page.html']); });
  var L = document.createElement('div');
  L.className = 'launch';
  L.innerHTML = '<div class="box" role="dialog" aria-label="Jump to anything"><input placeholder="Type a destination — every result names its group"><ul></ul><div class="keys"><span><span class="kbd">↑↓</span> move</span><span><span class="kbd">↵</span> open</span><span><span class="kbd">esc</span> close</span></div></div>';
  document.body.appendChild(L);
  var inp = L.querySelector('input'), ul = L.querySelector('ul'), sel = 0, shown = [];
  function render() {
    var q = inp.value.toLowerCase();
    shown = items.filter(function (i) { return (i[0] + ' ' + i[1]).toLowerCase().indexOf(q) > -1; });
    sel = Math.min(sel, Math.max(shown.length - 1, 0));
    ul.innerHTML = shown.length ? shown.map(function (i, k) { return '<li class="' + (k === sel ? 'sel' : '') + '" data-k="' + k + '">' + i[0] + '<span>' + i[1] + '</span></li>'; }).join('') : '<div class="empty">Nothing in this course matches</div>';
  }
  function open() { L.classList.add('show'); inp.value = ''; sel = 0; render(); setTimeout(function () { inp.focus(); }, 10); }
  function close() { L.classList.remove('show'); }
  function go() { if (shown[sel] && shown[sel][2] !== '#') location.href = shown[sel][2]; else close(); }
  bar.querySelector('.jump').addEventListener('click', open);
  L.addEventListener('click', function (e) { if (e.target === L) close(); var li = e.target.closest('li'); if (li) { sel = +li.dataset.k; go(); } });
  inp.addEventListener('input', function () { sel = 0; render(); });
  document.addEventListener('keydown', function (e) {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); open(); return; }
    if (!L.classList.contains('show')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowDown') { sel = Math.min(sel + 1, shown.length - 1); render(); e.preventDefault(); }
    if (e.key === 'ArrowUp') { sel = Math.max(sel - 1, 0); render(); e.preventDefault(); }
    if (e.key === 'Enter') go();
  });
})();
