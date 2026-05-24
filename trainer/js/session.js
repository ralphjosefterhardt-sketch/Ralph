/* ============================================================
   LinguaFlow - Session JS
   ============================================================ */

'use strict';

document.addEventListener('DOMContentLoaded', () => {

  // ============================================================
  // Session Timer
  // ============================================================

  let sessionSeconds = 0;
  const timerEl = document.getElementById('session-timer');

  function formatTime(s) {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    if (h > 0) return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;
    return `${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;
  }

  const timerInterval = setInterval(() => {
    sessionSeconds++;
    if (timerEl) timerEl.textContent = formatTime(sessionSeconds);
  }, 1000);

  // ============================================================
  // Control Buttons
  // ============================================================

  // Microphone toggle
  const micBtn = document.getElementById('btn-mic');
  if (micBtn) {
    let muted = false;
    micBtn.addEventListener('click', () => {
      muted = !muted;
      micBtn.classList.toggle('muted', muted);
      micBtn.querySelector('i').className = muted ? 'fas fa-microphone-slash' : 'fas fa-microphone';
      micBtn.querySelector('span').textContent = muted ? 'Stummgeschaltet' : 'Mikrofon';
      LF.Toast.info(muted ? 'Mikrofon stummgeschaltet' : 'Mikrofon aktiviert', 2000);
    });
  }

  // Camera toggle
  const camBtn = document.getElementById('btn-cam');
  if (camBtn) {
    let camOff = false;
    camBtn.addEventListener('click', () => {
      camOff = !camOff;
      camBtn.classList.toggle('cam-off', camOff);
      camBtn.querySelector('i').className = camOff ? 'fas fa-video-slash' : 'fas fa-video';
      camBtn.querySelector('span').textContent = camOff ? 'Kamera aus' : 'Kamera';
      LF.Toast.info(camOff ? 'Kamera ausgeschaltet' : 'Kamera eingeschaltet', 2000);
    });
  }

  // Screen share
  const shareBtn = document.getElementById('btn-share');
  if (shareBtn) {
    let sharing = false;
    shareBtn.addEventListener('click', () => {
      sharing = !sharing;
      shareBtn.classList.toggle('active', sharing);
      shareBtn.querySelector('i').className = sharing ? 'fas fa-stop-circle' : 'fas fa-desktop';
      shareBtn.querySelector('span').textContent = sharing ? 'Teilen stopp.' : 'Bildschirm teilen';
      LF.Toast.info(sharing ? 'Bildschirmfreigabe aktiv (Demo)' : 'Bildschirmfreigabe beendet', 2000);
    });
  }

  // Hand raise
  const handBtn = document.getElementById('btn-hand');
  if (handBtn) {
    let raised = false;
    handBtn.addEventListener('click', () => {
      raised = !raised;
      handBtn.classList.toggle('active', raised);
      handBtn.querySelector('span').textContent = raised ? 'Hand unten' : 'Hand heben';
      LF.Toast.info(raised ? 'Hand gehoben – Ralph wurde benachrichtigt' : 'Hand gesenkt', 2000);
    });
  }

  // ============================================================
  // End Session
  // ============================================================

  const endBtn = document.getElementById('btn-end');
  if (endBtn) {
    endBtn.addEventListener('click', () => {
      if (confirm('Möchtest du die Sitzung wirklich beenden?')) {
        clearInterval(timerInterval);
        LF.Toast.success('Sitzung beendet. Weiterleitung zur Analyse...', 2000);
        setTimeout(() => {
          window.location.href = 'analysis.html';
        }, 2000);
      }
    });
  }

  // ============================================================
  // Right Panel Tabs
  // ============================================================

  const rightTabs = document.querySelectorAll('.right-tab');
  const rightPanels = document.querySelectorAll('.right-panel-content');

  rightTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.getAttribute('data-panel');
      rightTabs.forEach(t => t.classList.remove('active'));
      rightPanels.forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      const panel = document.getElementById(`panel-${target}`);
      if (panel) panel.classList.add('active');
    });
  });

  // ============================================================
  // Chat Panel Toggle & Send
  // ============================================================

  const chatBtn = document.getElementById('btn-chat');
  const sessionRight = document.querySelector('.session-right');

  if (chatBtn && sessionRight) {
    chatBtn.addEventListener('click', () => {
      sessionRight.classList.toggle('collapsed');
      chatBtn.classList.toggle('active', !sessionRight.classList.contains('collapsed'));
    });
  }

  // Chat send
  const chatInput = document.querySelector('.chat-input');
  const chatSend = document.querySelector('.chat-send');
  const chatMessages = document.querySelector('.chat-messages');

  function sendChatMessage() {
    if (!chatInput || !chatMessages) return;
    const text = chatInput.value.trim();
    if (!text) return;

    const user = LF.Auth.getUser();
    const senderName = user ? user.name : 'Du';

    const msgEl = document.createElement('div');
    msgEl.className = 'chat-msg own';
    msgEl.innerHTML = `
      <div class="chat-sender">${senderName}</div>
      <div class="chat-bubble">${escapeHtml(text)}</div>
    `;
    chatMessages.appendChild(msgEl);
    chatInput.value = '';
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // Mock trainer response after delay
    setTimeout(() => {
      const responses = [
        'Sehr gut! Achte auf die Aussprache des "th"-Lauts.',
        'Genau richtig! Kannst du den Satz wiederholen?',
        'Prima! Jetzt versuchen wir das mit einem anderen Beispiel.',
        'Gut gemacht! Ein kleiner Hinweis: "present perfect" vs. "simple past".',
        'Wunderbar! Deine Aussprache wird immer besser.'
      ];
      const reply = responses[Math.floor(Math.random() * responses.length)];

      const trainerMsg = document.createElement('div');
      trainerMsg.className = 'chat-msg';
      trainerMsg.innerHTML = `
        <div class="chat-sender">Ralph Terhardt</div>
        <div class="chat-bubble">${reply}</div>
      `;
      chatMessages.appendChild(trainerMsg);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 1500 + Math.random() * 1000);
  }

  if (chatSend) chatSend.addEventListener('click', sendChatMessage);
  if (chatInput) {
    chatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendChatMessage();
      }
    });
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  // ============================================================
  // Notes Panel – Auto-save to localStorage
  // ============================================================

  const notesTextarea = document.querySelector('.notes-textarea');
  if (notesTextarea) {
    // Load saved notes
    const savedNotes = localStorage.getItem('lf_session_notes');
    if (savedNotes) notesTextarea.value = savedNotes;

    const saveNotes = LF.Utils.debounce(() => {
      localStorage.setItem('lf_session_notes', notesTextarea.value);
    }, 500);

    notesTextarea.addEventListener('input', saveNotes);
  }

  // ============================================================
  // Left Panel (Materials) Toggle
  // ============================================================

  const leftToggle = document.querySelector('.left-panel-toggle');
  const sessionLeft = document.querySelector('.session-left');

  if (leftToggle && sessionLeft) {
    leftToggle.addEventListener('click', () => {
      sessionLeft.classList.toggle('collapsed');
      leftToggle.querySelector('i').className = sessionLeft.classList.contains('collapsed')
        ? 'fas fa-chevron-right'
        : 'fas fa-chevron-left';
    });
  }

  // Material items click
  document.querySelectorAll('.material-item').forEach(item => {
    item.addEventListener('click', () => {
      document.querySelectorAll('.material-item').forEach(m => m.classList.remove('active'));
      item.classList.add('active');
      LF.Toast.info(`Öffne: ${item.querySelector('span').textContent}`, 2000);
    });
  });

  // ============================================================
  // Mock Pronunciation Analysis (shows after 10 seconds)
  // ============================================================

  const analysisPanel = document.getElementById('panel-analysis');
  const scoreEl = document.querySelector('.score-num');

  setTimeout(() => {
    // Animate score
    if (scoreEl) {
      let current = 0;
      const target = 78;
      const interval = setInterval(() => {
        current += 2;
        scoreEl.textContent = Math.min(current, target);
        if (current >= target) clearInterval(interval);
      }, 30);
    }

    // Show feedback toast
    LF.Toast.success('Aussprache-Analyse aktualisiert!', 3000);

    // Update word feedback
    const wordFeedback = document.querySelector('.word-feedback');
    if (wordFeedback) {
      wordFeedback.innerHTML = `
        "<span class="word-good">Hello</span>,
        <span class="word-good">my</span>
        <span class="word-ok">name</span>
        <span class="word-good">is</span>
        <span class="word-bad" title="Tipp: 'So-fee'"">Sophie</span>.
        <span class="word-good">I</span>
        <span class="word-good">would</span>
        <span class="word-ok">like</span>
        <span class="word-good">to</span>
        <span class="word-bad" title="Tipp: 'Im-prove'">improve</span>
        <span class="word-good">my</span>
        <span class="word-ok">English</span>."
      `;
    }
  }, 10000);

  // ============================================================
  // Initial chat messages (mock conversation)
  // ============================================================

  function initChat() {
    if (!chatMessages) return;

    const initialMessages = [
      { sender: 'Ralph Terhardt', text: 'Hallo Sophie! Schön, dass du da bist. Wie geht es dir heute?', own: false },
      { sender: 'Du', text: 'Gut, danke! Ich bin bereit für die Stunde.', own: true },
      { sender: 'Ralph Terhardt', text: 'Perfekt! Starten wir mit einer kurzen Aufwärmübung zur Aussprache.', own: false }
    ];

    initialMessages.forEach(msg => {
      const el = document.createElement('div');
      el.className = `chat-msg ${msg.own ? 'own' : ''}`;
      el.innerHTML = `
        <div class="chat-sender">${msg.sender}</div>
        <div class="chat-bubble">${msg.text}</div>
      `;
      chatMessages.appendChild(el);
    });

    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  initChat();

});
