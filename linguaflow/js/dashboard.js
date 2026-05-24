/* ============================================================
   LinguaFlow - Dashboard JS
   ============================================================ */

'use strict';

document.addEventListener('DOMContentLoaded', () => {

  const mockStudent = {
    name: 'Sophie Braun',
    email: 'sophie.braun@email.de',
    level: 'B2',
    streakDays: 14,
    totalHours: 24,
    vocabularyLearned: 342,
    progress: { vocabulary: 72, grammar: 65, pronunciation: 58 },
    nextLesson: { date: getNextLessonDate(), time: '17:00', type: 'Konversation', language: 'Englisch', trainer: 'Ralph Terhardt' }
  };

  function getNextLessonDate() { const d = new Date(); d.setDate(d.getDate() + 2); return d; }
  function getFollowingLessonDate() { const d = new Date(); d.setDate(d.getDate() + 5); return d; }

  const mockLessons = [
    { date: getNextLessonDate(), time: '17:00', type: 'Konversationsstunde', language: 'Englisch', trainer: 'Ralph Terhardt', id: 'ls001' },
    { date: getFollowingLessonDate(), time: '09:30', type: 'Grammatik-Vertiefung', language: 'Französisch', trainer: 'Ralph Terhardt', id: 'ls002' }
  ];

  const mockHomework = [
    { id: 'hw1', text: 'Present Perfect – Übungen Seite 45-47', subject: 'Englisch – Grammatik', due: 'Morgen', done: false },
    { id: 'hw2', text: '10 neue Vokabeln aus "Business English" lernen', subject: 'Englisch – Vokabular', due: 'In 3 Tagen', done: false },
    { id: 'hw3', text: 'Kurztext über deinen Alltag auf Französisch schreiben (150 Wörter)', subject: 'Französisch – Schreiben', due: 'In 4 Tagen', done: true },
    { id: 'hw4', text: 'Audio-Übung: Phonetik Kapitel 3 dreimal anhören', subject: 'Englisch – Aussprache', due: 'Diese Woche', done: false }
  ];

  const storedUser = LF.Auth.getUser();
  if (storedUser) {
    mockStudent.name = storedUser.name || mockStudent.name;
    mockStudent.email = storedUser.email || mockStudent.email;
  }

  document.querySelectorAll('.user-name').forEach(el => { el.textContent = mockStudent.name; });
  document.querySelectorAll('.user-initial').forEach(el => {
    el.textContent = mockStudent.name.split(' ').map(n => n[0]).join('').toUpperCase();
  });

  function renderStats() {
    const nextEl = document.getElementById('stat-next');
    if (nextEl) {
      const diff = mockLessons[0].date - new Date();
      nextEl.textContent = LF.Utils.formatCountdown(diff);
    }
  }
  renderStats();

  function renderLessons() {
    const container = document.getElementById('lessons-container');
    if (!container) return;
    const weekdays = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
    const months = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'];
    container.innerHTML = mockLessons.map(lesson => {
      const d = lesson.date;
      const dayStr = `${weekdays[d.getDay()]}, ${d.getDate()}. ${months[d.getMonth()]}`;
      return `
        <div class="lesson-item">
          <div class="lesson-time-block"><strong>${lesson.time}</strong><span>${dayStr}</span></div>
          <div class="lesson-info"><h4>${lesson.type}</h4><p>${lesson.trainer}</p></div>
          <span class="lesson-lang">${lesson.language}</span>
          <a href="session.html" class="btn btn-primary btn-sm"><i class="fas fa-video"></i> Beitreten</a>
        </div>
      `;
    }).join('');
  }
  renderLessons();

  function renderProgress() {
    const entries = [
      { id: 'prog-vocab', value: mockStudent.progress.vocabulary },
      { id: 'prog-grammar', value: mockStudent.progress.grammar },
      { id: 'prog-pronunciation', value: mockStudent.progress.pronunciation }
    ];
    entries.forEach(({ id, value }) => {
      const bar = document.getElementById(id);
      if (!bar) return;
      bar.setAttribute('data-width', `${value}%`);
      bar.style.width = '0%';
    });
    setTimeout(() => {
      entries.forEach(({ id, value }) => {
        const bar = document.getElementById(id);
        if (bar) bar.style.width = `${value}%`;
      });
    }, 400);
  }
  renderProgress();

  function renderHomework() {
    const container = document.getElementById('homework-container');
    if (!container) return;
    const storedDone = JSON.parse(localStorage.getItem('lf_homework_done') || '[]');
    mockHomework.forEach(hw => { if (storedDone.includes(hw.id)) hw.done = true; });
    container.innerHTML = mockHomework.map(hw => `
      <div class="homework-item ${hw.done ? 'done' : ''}" id="hw-item-${hw.id}">
        <input type="checkbox" id="${hw.id}" ${hw.done ? 'checked' : ''}>
        <div style="flex:1">
          <label for="${hw.id}">${hw.text}</label>
          <span class="hw-meta">${hw.subject} · Fällig: ${hw.due}</span>
        </div>
      </div>
    `).join('');

    container.querySelectorAll('input[type=checkbox]').forEach(cb => {
      cb.addEventListener('change', () => {
        const hwId = cb.id;
        const item = document.getElementById(`hw-item-${hwId}`);
        if (cb.checked) {
          item.classList.add('done');
          const done = JSON.parse(localStorage.getItem('lf_homework_done') || '[]');
          if (!done.includes(hwId)) done.push(hwId);
          localStorage.setItem('lf_homework_done', JSON.stringify(done));
          LF.Toast.success('Aufgabe als erledigt markiert! 🎉', 2000);
        } else {
          item.classList.remove('done');
          const done = JSON.parse(localStorage.getItem('lf_homework_done') || '[]').filter(id => id !== hwId);
          localStorage.setItem('lf_homework_done', JSON.stringify(done));
        }
      });
    });
  }
  renderHomework();

  function startCountdown() {
    const timerEl = document.getElementById('next-lesson-timer');
    if (!timerEl) return;
    function update() {
      const diff = mockLessons[0].date - new Date();
      if (diff <= 0) { timerEl.textContent = 'Jetzt!'; return; }
      timerEl.textContent = LF.Utils.formatCountdown(diff);
    }
    update();
    setInterval(update, 1000);
  }
  startCountdown();

  function animateNumber(el, target, duration = 800) {
    if (!el) return;
    const step = (timestamp) => {
      if (!step.startTime) step.startTime = timestamp;
      const elapsed = timestamp - step.startTime;
      const progress = Math.min(elapsed / duration, 1);
      el.textContent = Math.round(target * progress).toLocaleString('de');
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }
  setTimeout(() => {
    animateNumber(document.getElementById('stat-streak-num'), mockStudent.streakDays, 1000);
    animateNumber(document.getElementById('stat-hours-num'), mockStudent.totalHours, 1200);
    animateNumber(document.getElementById('stat-vocab-num'), mockStudent.vocabularyLearned, 1500);
  }, 300);

  const notifBtn = document.querySelector('.notif-btn');
  if (notifBtn) {
    notifBtn.addEventListener('click', () => {
      LF.Toast.info('Du hast 2 neue Benachrichtigungen.');
      const dot = notifBtn.querySelector('.notif-dot');
      if (dot) dot.style.display = 'none';
    });
  }
});
