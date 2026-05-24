// archive.js — Archiv gespeicherter Serviceberichte

var Archive = {

  _searchTerm: '',

  render: function() {
    var reports = getSavedReports();
    // Neueste zuerst
    reports = reports.slice().sort(function(a, b) {
      return new Date(b.erstelltAm || b.datum) - new Date(a.erstelltAm || a.datum);
    });

    var contentHtml = Archive._buildHtml(reports);
    Machines._renderShell(contentHtml);
    Archive._bindEvents(reports);
  },

  _buildHtml: function(reports) {
    var listHtml;
    if (reports.length === 0) {
      listHtml = '<p class="archive-empty">Noch keine Berichte gespeichert.</p>';
    } else {
      listHtml = '<div class="archive-list" id="archiveList">' +
        reports.map(function(r, idx) {
          return Archive._buildCardHtml(r, idx);
        }).join('') +
        '</div>';
    }

    return `
      <div class="page-header">
        <h2 class="page-title">Archiv</h2>
        <span class="machine-count">${reports.length} Bericht${reports.length !== 1 ? 'e' : ''}</span>
      </div>
      <div class="search-wrapper">
        <input type="search" id="archiveSearch" class="search-input"
          placeholder="Nach Maschinenname, Kunde oder Datum suchen..."
          aria-label="Berichte suchen" />
      </div>
      ${listHtml}
    `;
  },

  _buildCardHtml: function(r, idx) {
    var arbeitenTags = (r.arbeiten && r.arbeiten.length > 0)
      ? r.arbeiten.map(function(a) {
          return '<span class="archive-tag">' + escapeHtml(a) + '</span>';
        }).join('')
      : '<span class="archive-tag" style="background:#f3f4f6;color:#6b7280;">Keine Angabe</span>';

    var searchText = [r.machineName || '', r.customerName || '', formatDate(r.datum), r.datum].join(' ').toLowerCase();

    return `
      <div class="archive-card" data-report-id="${r.id}" data-archive-search="${escapeHtml(searchText)}">
        <div class="archive-card-header" data-toggle-idx="${idx}">
          <div class="archive-card-left">
            <div class="archive-machine-name">${escapeHtml(r.machineName || '–')}</div>
            <div class="archive-meta">
              ${escapeHtml(r.customerName || '–')} &bull; ${formatDate(r.datum)} &bull; ${escapeHtml(r.techniker || '–')}
            </div>
            <div class="archive-tags">${arbeitenTags}</div>
          </div>
          <div class="archive-card-actions">
            <button class="btn btn-success btn-sm archive-print-btn" data-report-id="${r.id}" title="Drucken">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polyline points="6,9 6,2 18,2 18,9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
              Drucken
            </button>
            <button class="btn btn-danger btn-sm archive-delete-btn" data-report-id="${r.id}" title="Löschen">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polyline points="3,6 5,6 21,6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
              L&ouml;schen
            </button>
          </div>
        </div>
        <div class="archive-card-detail" id="archiveDetail_${r.id}">
          ${Archive._buildDetailHtml(r)}
        </div>
      </div>
    `;
  },

  _buildDetailHtml: function(r) {
    var beschreibung = r.beschreibung
      ? '<div class="archive-detail-text"><strong>Beschreibung:</strong><br>' + escapeHtml(r.beschreibung) + '</div>'
      : '';

    var ersatzteile = '';
    if (r.ersatzteile && r.ersatzteile.length > 0) {
      ersatzteile = '<div class="archive-ersatzteile"><strong>Ersatzteile:</strong> ' +
        r.ersatzteile.map(function(e) {
          return escapeHtml(e.bezeichnung) + ' &times;' + escapeHtml(String(e.menge)) +
            (e.artikelnummer ? ' (' + escapeHtml(e.artikelnummer) + ')' : '');
        }).join(', ') + '</div>';
    }

    var naechsterService = r.naechsterService
      ? '<div class="archive-detail-text" style="font-size:0.82rem;color:#6b7280;">N&auml;chster Service: ' + formatDate(r.naechsterService) + '</div>'
      : '';

    var fotos = '';
    if (r.fotos && r.fotos.length > 0) {
      fotos = '<div style="margin-top:8px;"><strong style="font-size:0.82rem;">Fotos (' + r.fotos.length + '):</strong>' +
        '<div class="print-photo-grid" style="margin-top:6px;">' +
        r.fotos.map(function(f, i) {
          return '<img src="' + f + '" alt="Foto ' + (i + 1) + '" style="width:100%;aspect-ratio:1;object-fit:cover;border-radius:6px;border:1px solid #e5e7eb;">';
        }).join('') + '</div></div>';
    }

    var sigHtml = '';
    if (r.unterschriftKunde || r.unterschriftTechniker) {
      sigHtml = '<div class="archive-sig-row">' +
        (r.unterschriftKunde ? '<div class="archive-sig-box"><div class="archive-sig-label">Unterschrift Kunde</div><img src="' + r.unterschriftKunde + '" alt="Unterschrift Kunde" /></div>' : '<div></div>') +
        (r.unterschriftTechniker ? '<div class="archive-sig-box"><div class="archive-sig-label">Unterschrift Techniker</div><img src="' + r.unterschriftTechniker + '" alt="Unterschrift Techniker" /></div>' : '<div></div>') +
        '</div>';
    }

    return beschreibung + ersatzteile + naechsterService + fotos + sigHtml;
  },

  _bindEvents: function(reports) {
    // Search
    var searchInput = document.getElementById('archiveSearch');
    if (searchInput) {
      searchInput.addEventListener('input', function() {
        var term = this.value.trim().toLowerCase();
        var cards = document.querySelectorAll('.archive-card');
        cards.forEach(function(card) {
          var searchText = card.getAttribute('data-archive-search') || '';
          card.style.display = (!term || searchText.indexOf(term) !== -1) ? '' : 'none';
        });
      });
    }

    // Toggle detail
    document.querySelectorAll('.archive-card-header').forEach(function(header) {
      header.addEventListener('click', function(e) {
        if (e.target.closest('.archive-print-btn') || e.target.closest('.archive-delete-btn')) return;
        var card = header.closest('.archive-card');
        var reportId = card.getAttribute('data-report-id');
        var detail = document.getElementById('archiveDetail_' + reportId);
        if (detail) {
          detail.classList.toggle('open');
        }
      });
    });

    // Print buttons
    document.querySelectorAll('.archive-print-btn').forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        var reportId = parseInt(this.getAttribute('data-report-id'), 10);
        var allReports = getSavedReports();
        var report = null;
        for (var i = 0; i < allReports.length; i++) {
          if (allReports[i].id === reportId) { report = allReports[i]; break; }
        }
        if (report) {
          ServiceReport.showPrintView(report);
        }
      });
    });

    // Delete buttons
    document.querySelectorAll('.archive-delete-btn').forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        var reportId = parseInt(this.getAttribute('data-report-id'), 10);
        if (!confirm('Bericht wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.')) return;
        try {
          var existing = JSON.parse(localStorage.getItem('serviceportal_reports') || '[]');
          existing = existing.filter(function(r) { return r.id !== reportId; });
          localStorage.setItem('serviceportal_reports', JSON.stringify(existing));
        } catch (ex) {
          console.error('Fehler beim Löschen:', ex);
        }
        showToast('Bericht gelöscht.', 'info');
        Archive.render();
      });
    });
  }
};
