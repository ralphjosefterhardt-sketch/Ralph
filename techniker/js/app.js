// app.js — Router + App initialization for ServicePortal

// ─── Utility helpers ───────────────────────────────────────────────

function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatDate(dateStr) {
  if (!dateStr) return '–';
  try {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
  } catch (e) {
    return dateStr;
  }
}

function todayISO() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return yyyy + '-' + mm + '-' + dd;
}

// ─── Toast notifications ──────────────────────────────────────────────────

function showToast(message, type) {
  type = type || 'info';
  var container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    container.setAttribute('aria-live', 'polite');
    document.body.appendChild(container);
  }

  var toast = document.createElement('div');
  toast.className = 'toast toast-' + type;
  toast.textContent = message;
  container.appendChild(toast);

  requestAnimationFrame(function() {
    toast.classList.add('toast-visible');
  });

  setTimeout(function() {
    toast.classList.remove('toast-visible');
    toast.classList.add('toast-hiding');
    setTimeout(function() {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 300);
  }, 3000);
}

// ─── Hash-based Router ──────────────────────────────────────────────────────────

var Router = {
  routes: [],

  add: function(pattern, handler) {
    this.routes.push({ pattern: pattern, handler: handler });
  },

  navigate: function(path) {
    window.location.hash = '#' + path;
  },

  resolve: function() {
    var hash = window.location.hash || '#/login';
    var path = hash.replace(/^#/, '');

    if (path !== '/login' && !Auth.isAuthenticated()) {
      this.navigate('/login');
      return;
    }
    if (path === '/login' && Auth.isAuthenticated()) {
      this.navigate('/machines');
      return;
    }

    for (var i = 0; i < this.routes.length; i++) {
      var route = this.routes[i];
      var match = path.match(route.pattern);
      if (match) {
        route.handler.apply(null, match.slice(1));
        return;
      }
    }

    if (Auth.isAuthenticated()) {
      this.navigate('/machines');
    } else {
      this.navigate('/login');
    }
  },

  init: function() {
    var self = this;
    window.addEventListener('hashchange', function() {
      self.resolve();
    });
    self.resolve();
  }
};

// ─── Route definitions ──────────────────────────────────────────────────────────

Router.add(/^\/login$/, function() {
  Auth.renderLoginPage();
});

Router.add(/^\/machines$/, function() {
  Machines.renderList();
});

Router.add(/^\/machines\/(\d+)$/, function(machineId) {
  Machines.renderDetail(machineId);
});

Router.add(/^\/machines\/(\d+)\/report$/, function(machineId) {
  ServiceReport.render(machineId);
});

Router.add(/^\/archive$/, function() {
  Archive.render();
});

// ─── Bootstrap ────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', function() {
  initData().then(function() {
    Router.init();
  });
});
