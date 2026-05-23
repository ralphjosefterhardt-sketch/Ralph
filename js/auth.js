// Authentication module
// Handles login, logout, and session management

const SESSION_KEY = 'serviceportal_user';

const MOCK_USERS = [
  {
    username: 'techniker',
    password: 'demo123',
    fullName: 'Max Mustermann',
    role: 'Techniker',
  },
];

const Auth = {
  /**
   * Attempt login with given credentials.
   * Returns { success: true, user } or { success: false, error: '...' }
   */
  login(username, password) {
    const user = MOCK_USERS.find(
      u => u.username === username && u.password === password
    );
    if (user) {
      const sessionData = {
        username: user.username,
        fullName: user.fullName,
        role: user.role,
        loginTime: new Date().toISOString(),
      };
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
      return { success: true, user: sessionData };
    }
    return { success: false, error: 'Ungültiger Benutzername oder Passwort.' };
  },

  /**
   * Get the current logged-in user from sessionStorage.
   * Returns user object or null.
   */
  getUser() {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch (e) {
      return null;
    }
  },

  /**
   * Check if a user is currently authenticated.
   */
  isAuthenticated() {
    return this.getUser() !== null;
  },

  /**
   * Log out the current user.
   */
  logout() {
    sessionStorage.removeItem(SESSION_KEY);
  },

  /**
   * Render the login page into the #app div.
   */
  renderLoginPage() {
    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="login-bg">
        <div class="login-card">
          <div class="login-logo">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <rect width="48" height="48" rx="10" fill="#1a56db"/>
              <path d="M14 34V22l10-8 10 8v12H28v-7h-8v7H14z" fill="white"/>
              <circle cx="24" cy="17" r="3" fill="#93c5fd"/>
              <rect x="10" y="34" width="28" height="2.5" rx="1.25" fill="white" opacity="0.5"/>
            </svg>
            <span class="login-logo-text">ServicePortal</span>
          </div>
          <h1 class="login-title">Techniker-Anmeldung</h1>
          <form id="loginForm" class="login-form" novalidate>
            <div class="form-group">
              <label for="username">Benutzername</label>
              <input
                type="text"
                id="username"
                name="username"
                autocomplete="username"
                placeholder="Benutzername eingeben"
                required
              />
            </div>
            <div class="form-group">
              <label for="password">Passwort</label>
              <input
                type="password"
                id="password"
                name="password"
                autocomplete="current-password"
                placeholder="Passwort eingeben"
                required
              />
            </div>
            <div id="loginError" class="login-error" role="alert" aria-live="polite"></div>
            <button type="submit" class="btn btn-primary btn-full" id="loginBtn">
              Anmelden
            </button>
          </form>
          <p class="login-hint">Demo: techniker / demo123</p>
        </div>
      </div>
    `;

    const form = document.getElementById('loginForm');
    const errorEl = document.getElementById('loginError');
    const btn = document.getElementById('loginBtn');

    form.addEventListener('submit', function(e) {
      e.preventDefault();
      errorEl.textContent = '';
      errorEl.classList.remove('visible');

      const username = document.getElementById('username').value.trim();
      const password = document.getElementById('password').value;

      if (!username || !password) {
        errorEl.textContent = 'Bitte Benutzername und Passwort eingeben.';
        errorEl.classList.add('visible');
        return;
      }

      btn.disabled = true;
      btn.textContent = 'Anmelden...';

      // Simulate slight delay for realism
      setTimeout(function() {
        const result = Auth.login(username, password);
        if (result.success) {
          Router.navigate('/machines');
        } else {
          errorEl.textContent = result.error;
          errorEl.classList.add('visible');
          btn.disabled = false;
          btn.textContent = 'Anmelden';
          document.getElementById('password').value = '';
          document.getElementById('password').focus();
        }
      }, 400);
    });
  },
};
