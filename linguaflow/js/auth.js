/* ============================================================
   LinguaFlow - Auth JS
   ============================================================ */

'use strict';

document.addEventListener('DOMContentLoaded', () => {

  const tabs = document.querySelectorAll('.auth-tab');
  const panels = document.querySelectorAll('.auth-panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.getAttribute('data-tab');
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      const panel = document.getElementById(`panel-${target}`);
      if (panel) panel.classList.add('active');
    });
  });

  document.querySelectorAll('.lang-option').forEach(option => {
    option.addEventListener('click', () => {
      option.classList.toggle('selected');
      const input = option.querySelector('input[type=checkbox]');
      if (input) input.checked = !input.checked;
    });
  });

  document.querySelectorAll('.input-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const wrap = btn.closest('.input-icon-wrap');
      const input = wrap.querySelector('.form-input');
      const icon = btn.querySelector('i');
      if (!input) return;
      if (input.type === 'password') {
        input.type = 'text';
        icon.classList.replace('fa-eye', 'fa-eye-slash');
      } else {
        input.type = 'password';
        icon.classList.replace('fa-eye-slash', 'fa-eye');
      }
    });
  });

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  }

  function validatePassword(pw) {
    return pw.length >= 8;
  }

  function showFieldError(input, message) {
    input.classList.add('error');
    const err = input.closest('.form-group')?.querySelector('.form-error');
    if (err) { err.textContent = message; err.classList.add('visible'); }
  }

  function clearFieldError(input) {
    input.classList.remove('error');
    const err = input.closest('.form-group')?.querySelector('.form-error');
    if (err) err.classList.remove('visible');
  }

  function clearAllErrors(form) {
    form.querySelectorAll('.form-input').forEach(clearFieldError);
  }

  document.querySelectorAll('.form-input').forEach(input => {
    input.addEventListener('input', () => clearFieldError(input));
  });

  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      clearAllErrors(loginForm);
      const email = loginForm.querySelector('#login-email');
      const password = loginForm.querySelector('#login-password');
      let valid = true;
      if (!validateEmail(email.value)) { showFieldError(email, 'Bitte gib eine gültige E-Mail-Adresse ein.'); valid = false; }
      if (!validatePassword(password.value)) { showFieldError(password, 'Das Passwort muss mindestens 8 Zeichen lang sein.'); valid = false; }
      if (!valid) return;
      const submitBtn = loginForm.querySelector('[type=submit]');
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Anmelden...';
      setTimeout(() => {
        const registered = localStorage.getItem('lf_registered_user');
        let user;
        if (registered) {
          const reg = JSON.parse(registered);
          if (reg.email === email.value.trim()) user = reg;
        }
        if (!user) user = { name: 'Max Mustermann', email: email.value.trim(), languages: ['english'], joinDate: new Date().toISOString() };
        LF.Auth.setUser(user);
        LF.Toast.success(`Willkommen zurück, ${user.name}!`);
        setTimeout(() => { window.location.href = 'dashboard.html'; }, 800);
      }, 1000);
    });
  }

  const registerForm = document.getElementById('register-form');
  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      clearAllErrors(registerForm);
      const name = registerForm.querySelector('#reg-name');
      const email = registerForm.querySelector('#reg-email');
      const password = registerForm.querySelector('#reg-password');
      const confirm = registerForm.querySelector('#reg-confirm');
      let valid = true;
      if (!name.value.trim() || name.value.trim().length < 2) { showFieldError(name, 'Bitte gib deinen vollständigen Namen ein.'); valid = false; }
      if (!validateEmail(email.value)) { showFieldError(email, 'Bitte gib eine gültige E-Mail-Adresse ein.'); valid = false; }
      if (!validatePassword(password.value)) { showFieldError(password, 'Das Passwort muss mindestens 8 Zeichen lang sein.'); valid = false; }
      if (password.value !== confirm.value) { showFieldError(confirm, 'Die Passwörter stimmen nicht überein.'); valid = false; }
      const selectedLangs = [];
      registerForm.querySelectorAll('.lang-option.selected').forEach(opt => { selectedLangs.push(opt.getAttribute('data-lang')); });
      if (selectedLangs.length === 0) { LF.Toast.warning('Bitte wähle mindestens eine Sprache aus.'); valid = false; }
      if (!valid) return;
      const submitBtn = registerForm.querySelector('[type=submit]');
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Konto erstellen...';
      setTimeout(() => {
        const user = { name: name.value.trim(), email: email.value.trim(), languages: selectedLangs, joinDate: new Date().toISOString() };
        localStorage.setItem('lf_registered_user', JSON.stringify(user));
        LF.Auth.setUser(user);
        LF.Toast.success('Konto erfolgreich erstellt! Willkommen bei LinguaFlow!');
        setTimeout(() => { window.location.href = 'dashboard.html'; }, 1200);
      }, 1200);
    });
  }

  document.querySelectorAll('.social-login-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const provider = btn.getAttribute('data-provider');
      LF.Toast.info(`${provider}-Anmeldung wird simuliert...`);
      setTimeout(() => {
        const user = { name: provider === 'Google' ? 'Maria Schmidt' : 'Thomas Weber', email: `user@${provider.toLowerCase()}.com`, languages: ['english'], joinDate: new Date().toISOString() };
        LF.Auth.setUser(user);
        LF.Toast.success(`Mit ${provider} angemeldet!`);
        setTimeout(() => { window.location.href = 'dashboard.html'; }, 800);
      }, 1000);
    });
  });

  const forgotLink = document.querySelector('.forgot-link');
  if (forgotLink) {
    forgotLink.addEventListener('click', (e) => {
      e.preventDefault();
      LF.Toast.info('Eine Passwort-Reset-E-Mail wurde gesendet (Demo).');
    });
  }

  if (LF.Auth.isLoggedIn()) {
    const loginLink = document.querySelector('a[href="login.html"]');
    if (loginLink) { loginLink.textContent = 'Dashboard'; loginLink.href = 'dashboard.html'; }
  }

});
