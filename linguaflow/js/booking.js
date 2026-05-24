/* ============================================================
   LinguaFlow - Booking System JS
   ============================================================ */

'use strict';

document.addEventListener('DOMContentLoaded', () => {

  const state = {
    currentStep: 1,
    totalSteps: 4,
    selectedLanguage: null,
    selectedLessonType: null,
    selectedDate: null,
    selectedTime: null,
    couponCode: null,
    discount: 0,
    basePrice: 49,
    calendarYear: new Date().getFullYear(),
    calendarMonth: new Date().getMonth()
  };

  const availableDays = [3, 5, 7, 10, 12, 14, 17, 19, 21, 24, 26, 28];

  const timeSlots = {
    morning: ['09:00', '09:45', '10:30', '11:15'],
    afternoon: ['13:00', '14:00', '15:00', '16:00', '17:00'],
    evening: ['18:00', '18:45', '19:30', '20:15']
  };

  const bookedSlots = ['09:45', '14:00', '19:30'];

  const lessonPrices = { einzelstunde: 49, konversation: 39, pruefung: 59, business: 69 };

  const couponCodes = { 'FIRST10': 10, 'STUDENT20': 20, 'RALPH15': 15 };

  function goToStep(step) {
    if (step < 1 || step > state.totalSteps) return;
    if (step > state.currentStep) { if (!validateStep(state.currentStep)) return; }
    state.currentStep = step;
    updateStepUI();
  }

  function validateStep(step) {
    switch (step) {
      case 1: if (!state.selectedLanguage) { LF.Toast.warning('Bitte wähle eine Sprache aus.'); return false; } return true;
      case 2: if (!state.selectedLessonType) { LF.Toast.warning('Bitte wähle einen Kurstyp aus.'); return false; } return true;
      case 3:
        if (!state.selectedDate) { LF.Toast.warning('Bitte wähle einen Termin aus.'); return false; }
        if (!state.selectedTime) { LF.Toast.warning('Bitte wähle eine Uhrzeit aus.'); return false; }
        return true;
      default: return true;
    }
  }

  function updateStepUI() {
    document.querySelectorAll('.step').forEach((step, index) => {
      const stepNum = index + 1;
      step.classList.remove('active', 'done');
      if (stepNum === state.currentStep) step.classList.add('active');
      else if (stepNum < state.currentStep) step.classList.add('done');
    });
    document.querySelectorAll('.step-line').forEach((line, index) => {
      line.classList.toggle('done', index + 1 < state.currentStep);
    });
    document.querySelectorAll('.booking-step').forEach((panel, index) => {
      panel.classList.toggle('active', index + 1 === state.currentStep);
    });
    document.querySelectorAll('.step.done .step-num').forEach(el => {
      el.innerHTML = '<i class="fas fa-check" style="font-size:0.8rem"></i>';
    });
    document.querySelectorAll('.step:not(.done) .step-num').forEach((el) => {
      const step = el.closest('.step');
      const allSteps = [...document.querySelectorAll('.step')];
      el.textContent = allSteps.indexOf(step) + 1;
    });
    if (state.currentStep === 4) renderSummary();
  }

  document.querySelectorAll('.lang-select-card').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.lang-select-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      state.selectedLanguage = card.getAttribute('data-lang');
    });
  });

  document.querySelectorAll('.lesson-type-card').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.lesson-type-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      state.selectedLessonType = card.getAttribute('data-type');
      state.basePrice = lessonPrices[state.selectedLessonType] || 49;
    });
  });

  function renderCalendar(year, month) {
    const calendarDays = document.querySelector('.calendar-days');
    const calendarTitle = document.querySelector('.calendar-title');
    if (!calendarDays || !calendarTitle) return;
    const monthNames = ['Januar','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember'];
    calendarTitle.textContent = `${monthNames[month]} ${year}`;
    const today = new Date();
    const firstDay = new Date(year, month, 1);
    let startOffset = firstDay.getDay() - 1;
    if (startOffset < 0) startOffset = 6;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    calendarDays.innerHTML = '';
    for (let i = 0; i < startOffset; i++) {
      const empty = document.createElement('div');
      empty.className = 'calendar-day empty';
      calendarDays.appendChild(empty);
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const dayEl = document.createElement('div');
      dayEl.className = 'calendar-day';
      dayEl.textContent = d;
      const cellDate = new Date(year, month, d);
      const isPast = cellDate < new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const isToday = d === today.getDate() && month === today.getMonth() && year === today.getFullYear();
      const isAvailable = availableDays.includes(d) && !isPast;
      if (isPast) dayEl.classList.add('past');
      else if (isToday) dayEl.classList.add('today');
      if (isAvailable) { dayEl.classList.add('available'); dayEl.addEventListener('click', () => selectDate(year, month, d, dayEl)); }
      if (state.selectedDate) {
        const sd = state.selectedDate;
        if (sd.d === d && sd.m === month && sd.y === year) dayEl.classList.add('selected');
      }
      calendarDays.appendChild(dayEl);
    }
  }

  function selectDate(year, month, day, el) {
    document.querySelectorAll('.calendar-day').forEach(d => d.classList.remove('selected'));
    el.classList.add('selected');
    state.selectedDate = { y: year, m: month, d: day };
    state.selectedTime = null;
    renderTimeSlots();
  }

  function renderTimeSlots() {
    const container = document.querySelector('.timeslot-grid');
    if (!container) return;
    container.innerHTML = '';
    const allSlots = [...timeSlots.morning, ...timeSlots.afternoon, ...timeSlots.evening];
    allSlots.forEach(time => {
      const el = document.createElement('div');
      el.className = 'timeslot available';
      el.textContent = time;
      if (bookedSlots.includes(time)) {
        el.classList.remove('available');
        el.classList.add('booked');
      } else {
        el.addEventListener('click', () => {
          document.querySelectorAll('.timeslot').forEach(t => t.classList.remove('selected'));
          el.classList.add('selected');
          state.selectedTime = time;
        });
      }
      container.appendChild(el);
    });
  }

  const prevBtn = document.querySelector('.calendar-nav.prev');
  const nextBtn = document.querySelector('.calendar-nav.next');
  if (prevBtn) { prevBtn.addEventListener('click', () => { state.calendarMonth--; if (state.calendarMonth < 0) { state.calendarMonth = 11; state.calendarYear--; } renderCalendar(state.calendarYear, state.calendarMonth); }); }
  if (nextBtn) { nextBtn.addEventListener('click', () => { state.calendarMonth++; if (state.calendarMonth > 11) { state.calendarMonth = 0; state.calendarYear++; } renderCalendar(state.calendarYear, state.calendarMonth); }); }

  renderCalendar(state.calendarYear, state.calendarMonth);
  renderTimeSlots();

  function renderSummary() {
    const langNames = { english: 'Englisch', french: 'Französisch' };
    const typeNames = { einzelstunde: 'Einzelstunde', konversation: 'Konversationsstunde', pruefung: 'Prüfungsvorbereitung', business: 'Business-Englisch' };
    const summaryFields = {
      'summary-lang': langNames[state.selectedLanguage] || state.selectedLanguage,
      'summary-type': typeNames[state.selectedLessonType] || state.selectedLessonType,
      'summary-date': state.selectedDate ? `${state.selectedDate.d}.${state.selectedDate.m + 1}.${state.selectedDate.y}` : '-',
      'summary-time': state.selectedTime || '-',
      'summary-base': `€ ${state.basePrice.toFixed(2)}`,
      'summary-total': `€ ${calculateTotal().toFixed(2)}`
    };
    Object.entries(summaryFields).forEach(([id, value]) => { const el = document.getElementById(id); if (el) el.textContent = value; });
    const discountRow = document.getElementById('discount-row');
    if (discountRow) {
      discountRow.style.display = state.discount > 0 ? 'flex' : 'none';
      const discountEl = document.getElementById('summary-discount');
      if (discountEl) discountEl.textContent = `- € ${getDiscountAmount().toFixed(2)}`;
    }
  }

  function calculateTotal() { return state.basePrice * (1 - state.discount / 100); }
  function getDiscountAmount() { return state.basePrice * (state.discount / 100); }

  const couponInput = document.getElementById('coupon-input');
  const couponBtn = document.getElementById('coupon-btn');
  if (couponBtn) {
    couponBtn.addEventListener('click', () => {
      if (!couponInput) return;
      const code = couponInput.value.trim().toUpperCase();
      if (!code) { LF.Toast.warning('Bitte gib einen Gutscheincode ein.'); return; }
      if (couponCodes[code]) {
        state.discount = couponCodes[code]; state.couponCode = code;
        LF.Toast.success(`Gutschein angewendet: ${state.discount}% Rabatt!`);
        renderSummary(); couponBtn.textContent = 'Angewendet ✓'; couponBtn.disabled = true; couponInput.disabled = true;
      } else {
        LF.Toast.error('Ungültiger Gutscheincode. Versuche: FIRST10, STUDENT20');
        couponInput.classList.add('error'); setTimeout(() => couponInput.classList.remove('error'), 2000);
      }
    });
  }

  document.querySelectorAll('[data-step-next]').forEach(btn => { btn.addEventListener('click', () => { goToStep(state.currentStep + 1); }); });
  document.querySelectorAll('[data-step-prev]').forEach(btn => { btn.addEventListener('click', () => { state.currentStep--; updateStepUI(); }); });

  const bookBtn = document.getElementById('confirm-booking-btn');
  if (bookBtn) {
    bookBtn.addEventListener('click', () => {
      bookBtn.disabled = true;
      bookBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Wird gebucht...';
      setTimeout(() => {
        const booking = { language: state.selectedLanguage, type: state.selectedLessonType, date: state.selectedDate, time: state.selectedTime, price: calculateTotal(), coupon: state.couponCode, id: `BK${Date.now().toString(36).toUpperCase()}`, booked: new Date().toISOString() };
        const existing = JSON.parse(localStorage.getItem('lf_bookings') || '[]');
        existing.push(booking);
        localStorage.setItem('lf_bookings', JSON.stringify(existing));
        LF.Toast.success('Stunde erfolgreich gebucht! Eine Bestätigung wurde gesendet.');
        setTimeout(() => { window.location.href = 'dashboard.html'; }, 1800);
      }, 1500);
    });
  }

  updateStepUI();
});
