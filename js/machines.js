// Machines module
// Machine list view and machine detail view

const Machines = {
  _renderShell(contentHtml) {
    const user = Auth.getUser();
    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="app-shell">
        <header class="navbar">
          <div class="navbar-brand">
            <svg width="32" height="32" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <rect width="48" height="48" rx="10" fill="#1a56db"/>
              <path d="M14 34V22l10-8 10 8v12H28v-7h-8v7H14z" fill="white"/>
              <circle cx="24" cy="17" r="3" fill="#93c5fd"/>
            </svg>
            <span class="navbar-title">ServicePortal</span>
          </div>
          <div class="navbar-user">
            <span class="user-info">
              <span class="user-name">${escapeHtml(user ? user.fullName : '')}</span>
              <span class="user-role">${escapeHtml(user ? user.role : '')}</span>
            </span>
            <button class="btn btn-outline btn-sm" id="logoutBtn">Abmelden</button>
          </div>
        </header>
        <div class="app-body">
          <aside class="sidebar" id="sidebar">
            <nav class="sidebar-nav">
              <a href="#/machines" class="sidebar-link ${location.hash.startsWith('#/machines') ? 'active' : ''}" data-nav="machines">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>
                Maschinen
              </a>
              <a href="#" class="sidebar-link" data-nav="reports" id="navReports">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10,9 9,9 8,9"/></svg>
                Neue Berichte
              </a>
              <a href="#" class="sidebar-link" data-nav="archive" id="navArchive">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polyline points="21,8 21,21 3,21 3,8"/><rect x="1" y="3" width="22" height="5"/><line x1="10" y1="12" x2="14" y2="12"/></svg>
                Archiv
              </a>
            </nav>
          </aside>
          <main class="main-content" id="mainContent">
            ${contentHtml}
          </main>
        </div>
      </div>
      <div id="toastContainer" class="toast-container" aria-live="polite"></div>
    `;

    document.getElementById('logoutBtn').addEventListener('click', function() {
      Auth.logout();
      Router.navigate('/login');
    });

    document.getElementById('navReports').addEventListener('click', function(e) {
      e.preventDefault();
      showToast('In Entwicklung', 'info');
    });

    document.getElementById('navArchive').addEventListener('click', function(e) {
      e.preventDefault();
      showToast('In Entwicklung', 'info');
    });
  },

  renderList() {
    const cardsHtml = MACHINES.map(machine => {
      const typeStyle = TYPE_COLORS[machine.type] || { bg: '#f3f4f6', color: '#374151' };
      const statusCfg = STATUS_CONFIG[machine.status] || STATUS_CONFIG.ok;
      const lastServiceFormatted = formatDate(machine.lastService);

      return `
        <div class="machine-card" data-machine-id="${machine.id}">
          <div class="machine-card-header">
            <div class="machine-name">${escapeHtml(machine.name)}</div>
            <div class="status-indicator" title="${escapeHtml(statusCfg.label)}" style="background:${statusCfg.color}"></div>
          </div>
          <div class="machine-customer">${escapeHtml(machine.customer.name)}</div>
          <div class="machine-meta">
            <span class="type-badge" style="background:${typeStyle.bg};color:${typeStyle.color}">${escapeHtml(machine.type)}</span>
          </div>
          <div class="machine-details-row">
            <div class="machine-detail-item">
              <span class="detail-label">Seriennummer</span>
              <span class="detail-value">${escapeHtml(machine.serialNumber)}</span>
            </div>
            <div class="machine-detail-item">
              <span class="detail-label">Letzter Service</span>
              <span class="detail-value">${lastServiceFormatted}</span>
            </div>
          </div>
          <div class="machine-status-row">
            <span class="status-dot" style="background:${statusCfg.color}"></span>
            <span class="status-label">${escapeHtml(statusCfg.label)}</span>
          </div>
          <div class="machine-card-footer">
            <button class="btn btn-primary btn-sm detail-btn" data-id="${machine.id}">Details</button>
          </div>
        </div>
      `;
    }).join('');

    const contentHtml = `
      <div class="page-header">
        <h2 class="page-title">Maschinenübersicht</h2>
        <span class="machine-count">${MACHINES.length} Maschinen</span>
      </div>
      <div class="machine-grid">
        ${cardsHtml}
      </div>
    `;

    this._renderShell(contentHtml);

    document.querySelectorAll('.detail-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        const id = this.getAttribute('data-id');
        Router.navigate('/machines/' + id);
      });
    });

    document.querySelectorAll('.machine-card').forEach(function(card) {
      card.addEventListener('click', function(e) {
        if (e.target.closest('.detail-btn')) return;
        const id = this.getAttribute('data-machine-id');
        Router.navigate('/machines/' + id);
      });
    });
  },

  renderDetail(machineId) {
    const machine = getMachineById(machineId);
    if (!machine) {
      Router.navigate('/machines');
      return;
    }

    const history = getServiceHistory(machineId);
    const typeStyle = TYPE_COLORS[machine.type] || { bg: '#f3f4f6', color: '#374151' };
    const statusCfg = STATUS_CONFIG[machine.status] || STATUS_CONFIG.ok;

    const historyHtml = history.length === 0
      ? '<p class="empty-history">Keine Serviceeinträge vorhanden.</p>'
      : history.map(function(entry) {
          return `
            <div class="timeline-item">
              <div class="timeline-dot"></div>
              <div class="timeline-content">
                <div class="timeline-header">
                  <span class="timeline-date">${formatDate(entry.date)}</span>
                  <span class="timeline-type">${escapeHtml(entry.type)}</span>
                </div>
                <div class="timeline-tech">Techniker: ${escapeHtml(entry.technician)}</div>
                <div class="timeline-desc">${escapeHtml(entry.description)}</div>
              </div>
            </div>
          `;
        }).join('');

    const savedReports = getSavedReports().filter(r => r.machineId === parseInt(machineId, 10));
    const savedReportsHtml = savedReports.length > 0
      ? savedReports.map(function(r) {
          return `
            <div class="timeline-item saved-report">
              <div class="timeline-dot saved"></div>
              <div class="timeline-content">
                <div class="timeline-header">
                  <span class="timeline-date">${formatDate(r.datum)}</span>
                  <span class="timeline-type">Bericht (lokal)</span>
                </div>
                <div class="timeline-tech">Techniker: ${escapeHtml(r.techniker)}</div>
                <div class="timeline-desc">${escapeHtml(r.beschreibung ? r.beschreibung.substring(0, 100) + (r.beschreibung.length > 100 ? '…' : '') : '')}</div>
              </div>
            </div>
          `;
        }).join('')
      : '';

    const contentHtml = `
      <div class="detail-header">
        <button class="btn-back" id="backBtn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><polyline points="15,18 9,12 15,6"/></svg>
          Zurück
        </button>
      </div>

      <div class="detail-layout">
        <div class="detail-left">
          <div class="detail-card">
            <div class="detail-machine-header">
              <div>
                <h2 class="detail-machine-name">${escapeHtml(machine.name)}</h2>
                <span class="type-badge large" style="background:${typeStyle.bg};color:${typeStyle.color}">${escapeHtml(machine.type)}</span>
              </div>
              <div class="detail-status">
                <span class="status-dot large" style="background:${statusCfg.color}"></span>
                <span class="status-label">${escapeHtml(statusCfg.label)}</span>
              </div>
            </div>

            <div class="detail-info-section">
              <h3 class="detail-section-title">Maschinendaten</h3>
              <dl class="info-grid">
                <dt>Seriennummer</dt>
                <dd>${escapeHtml(machine.serialNumber)}</dd>
                <dt>Typ</dt>
                <dd>${escapeHtml(machine.type)}</dd>
                <dt>Installationsdatum</dt>
                <dd>${formatDate(machine.installationDate)}</dd>
                <dt>Garantie bis</dt>
                <dd>${formatDate(machine.warrantyUntil)}</dd>
                <dt>Letzter Service</dt>
                <dd>${formatDate(machine.lastService)}</dd>
              </dl>
            </div>

            <div class="detail-info-section">
              <h3 class="detail-section-title">Kundendaten</h3>
              <dl class="info-grid">
                <dt>Kunde</dt>
                <dd>${escapeHtml(machine.customer.name)}</dd>
                <dt>Adresse</dt>
                <dd>${escapeHtml(machine.customer.address)}</dd>
              </dl>
            </div>

            <div class="detail-action">
              <button class="btn btn-success btn-full" id="newReportBtn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                Neuer Servicebericht
              </button>
            </div>
          </div>
        </div>

        <div class="detail-right">
          <div class="detail-card">
            <h3 class="detail-section-title">Servicehistorie</h3>
            <div class="timeline">
              ${savedReportsHtml}
              ${historyHtml}
            </div>
          </div>
        </div>
      </div>
    `;

    this._renderShell(contentHtml);

    document.getElementById('backBtn').addEventListener('click', function() {
      Router.navigate('/machines');
    });

    document.getElementById('newReportBtn').addEventListener('click', function() {
      Router.navigate('/machines/' + machineId + '/report');
    });
  },
};

function getSavedReports() {
  try {
    return JSON.parse(localStorage.getItem('serviceportal_reports') || '[]');
  } catch (e) {
    return [];
  }
}
