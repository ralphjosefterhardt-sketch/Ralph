/* ============================================================
   LinguaFlow - Main Application JS
   ============================================================ */

'use strict';

// ============================================================
// Auth State Management
// ============================================================

const Auth = {
  isLoggedIn() {
    return !!localStorage.getItem('lf_user');
  },

  getUser() {
    const raw = localStorage.getItem('lf_user');
    if (!raw) return null;
    try { return JSON.parse(raw); } catch { return null; }
  },

  setUser(user) {
    localStorage.setItem('lf_user', JSON.stringify(user));
  },

  logout() {
    localStorage.removeItem('lf_user');
    window.location.href = 'login.html';
  }
};

// ============================================================
// Toast Notification System
// ============================================================

const Toast = {
  container: null,

  init() {
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.className = 'toast-container';
      document.body.appendChild(this.container);
    }
  },

  show(message, type = 'success', duration = 4000) {
    this.init();

    const icons = {
      success: 'fa-check-circle',
      error: 'fa-times-circle',
      warning: 'fa-exclamation-triangle',
      info: 'fa-info-circle'
    };

    const toast = document.createElement('div');
    toast.className = `toast ${type !== 'success' ? type : ''}`;
    toast.innerHTML = `
      <i class="fas ${icons[type] || icons.success}"></i>
      <span class="toast-msg">${message}</span>
      <button class="toast-close" aria-label="Schließen"><i class="fas fa-times"></i></button>
    `;

    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => this.remove(toast));

    this.container.appendChild(toast);

    if (duration > 0) {
      setTimeout(() => this.remove(toast), duration);
    }

    return toast;
  },

  remove(toast) {
    if (!toast || toast.classList.contains('removing')) return;
    toast.classList.add('removing');
    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 300);
  },

  success(msg, duration) { return this.show(msg, 'success', duration); },
  error(msg, duration) { return this.show(msg, 'error', duration); },
  warning(msg, duration) { return this.show(msg, 'warning', duration); },
  info(msg, duration) { return this.show(msg, 'info', duration); }
};

// ============================================================
// Mobile Navigation Toggle
// ============================================================

function initMobileNav() {
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  if (!hamburger || !mobileMenu) return;

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('open');
  });

  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mobileMenu.classList.remove('open');
    });
  });

  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
      hamburger.classList.remove('active');
      mobileMenu.classList.remove('open');
    }
  });
}

// ============================================================
// Navbar Scroll Effect
// ============================================================

function initNavbarScroll() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  const update = () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', update, { passive: true });
  update();
}

// ============================================================
// Smooth Scroll for Anchor Links
// ============================================================

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

// ============================================================
// Intersection Observer – Scroll Animations
// ============================================================

function initScrollAnimations() {
  const elements = document.querySelectorAll('.animate-on-scroll');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

  elements.forEach(el => observer.observe(el));
}

// ============================================================
// Sidebar Navigation (Dashboard pages)
// ============================================================

function initSidebar() {
  const sidebar = document.querySelector('.sidebar');
  if (!sidebar) return;

  const overlay = document.createElement('div');
  overlay.className = 'sidebar-overlay';
  document.body.appendChild(overlay);

  const toggleBtn = document.querySelector('.sidebar-toggle');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      sidebar.classList.toggle('open');
      overlay.classList.toggle('visible');
    });
  }

  overlay.addEventListener('click', () => {
    sidebar.classList.remove('open');
    overlay.classList.remove('visible');
  });

  const currentPage = window.location.pathname.split('/').pop();
  sidebar.querySelectorAll('.sidebar-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (href && currentPage.startsWith(href.replace('.html', '')))) {
      link.classList.add('active');
    }
  });

  document.querySelectorAll('[data-action="logout"]').forEach(btn => {
    btn.addEventListener('click', () => Auth.logout());
  });
}

// ============================================================
// Active Nav Link Highlighting (Landing page)
// ============================================================

function initActiveNavLinks() {
  const navLinks = document.querySelectorAll('.nav-links a');
  if (!navLinks.length) return;

  const sections = document.querySelectorAll('section[id]');
  if (!sections.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => observer.observe(s));
}

// ============================================================
// Progress Bar Animations
// ============================================================

function initProgressBars() {
  const bars = document.querySelectorAll('.progress-fill[data-width]');
  if (!bars.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const width = bar.getAttribute('data-width');
        setTimeout(() => { bar.style.width = width; }, 150);
        observer.unobserve(bar);
      }
    });
  }, { threshold: 0.1 });

  bars.forEach(bar => observer.observe(bar));
}

// ============================================================
// Simple Hash Router
// ============================================================

const Router = {
  routes: {},

  register(hash, fn) {
    this.routes[hash] = fn;
  },

  navigate(hash) {
    window.location.hash = hash;
  },

  init() {
    const handle = () => {
      const hash = window.location.hash || '#/';
      const fn = this.routes[hash];
      if (fn) fn();
    };

    window.addEventListener('hashchange', handle);
    handle();
  }
};

// ============================================================
// Utility Functions
// ============================================================

const Utils = {
  formatDate(date) {
    return new Intl.DateTimeFormat('de-DE', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    }).format(date);
  },

  formatTime(date) {
    return new Intl.DateTimeFormat('de-DE', {
      hour: '2-digit', minute: '2-digit'
    }).format(date);
  },

  formatCurrency(amount) {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency', currency: 'EUR'
    }).format(amount);
  },

  debounce(fn, delay) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  },

  formatCountdown(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    if (days > 0) return `${days}T ${hours}Std`;
    if (hours > 0) return `${hours}:${String(mins).padStart(2,'0')} Std`;
    return `${String(mins).padStart(2,'0')}:${String(secs).padStart(2,'0')}`;
  }
};

// ============================================================
// Initialize on DOM Ready
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  if (window.LF && window.LF.I18n) window.LF.I18n.init();
  initMobileNav();
  initNavbarScroll();
  initSmoothScroll();
  initScrollAnimations();
  initSidebar();
  initActiveNavLinks();
  initProgressBars();

  const userNameEls = document.querySelectorAll('[data-user-name]');
  const user = Auth.getUser();
  if (user && userNameEls.length) {
    userNameEls.forEach(el => {
      el.textContent = user.name || 'Schüler';
    });
  }

  const greetingEl = document.querySelector('[data-greeting]');
  if (greetingEl) {
    const hour = new Date().getHours();
    let greeting = 'Guten Morgen';
    if (hour >= 12 && hour < 18) greeting = 'Guten Tag';
    else if (hour >= 18) greeting = 'Guten Abend';
    greetingEl.textContent = `${greeting}, ${user ? user.name : 'Schüler'}!`;
  }
});

window.LF = { Auth, Toast, Router, Utils };
