// service-report.js — Service Report Form with signature capture

var ServiceReport = {

  // Canvas drawing state
  _canvasState: {
    customer: { drawing: false, hasSignature: false },
    technician: { drawing: false, hasSignature: false }
  },

  // Feature 4: Photos array
  _photos: [],

  render: function(machineId) {
    var machine = getMachineById(machineId);
    if (!machine) {
      Router.navigate('/machines');
      return;
    }

    var user = Auth.getUser();
    var today = todayISO();
    var machineName = machine.name;

    var contentHtml = `
      <div class="detail-header">
        <button class="btn-back" id="backBtn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><polyline points="15,18 9,12 15,6"/></svg>
          Zurück
        </button>
      </div>

      <div class="report-header">
        <h2 class="page-title">Servicebericht – ${escapeHtml(machineName)}</h2>
        <p class="report-subtitle">${escapeHtml(machine.customer.name)} · ${escapeHtml(machine.serialNumber)}</p>
      </div>

      <form id="serviceReportForm" class="report-form" novalidate>

        <!-- Section 1: Auftragsdaten -->
        <fieldset class="form-section">
          <legend class="form-section-title">Auftragsdaten</legend>
          <div class="form-row">
            <div class="form-group">
              <label for="reportDate">Datum</label>
              <input type="date" id="reportDate" name="datum" value="${escapeHtml(today)}" required />
            </div>
            <div class="form-group">
              <label for="reportTechnician">Techniker</label>
              <input type="text" id="reportTechnician" name="techniker" value="${escapeHtml(user ? user.fullName : '')}" readonly class="input-readonly" />
            </div>
          </div>
          <div class="form-group">
            <label for="reportOrderNumber">Auftragsnummer</label>
            <input type="text" id="reportOrderNumber" name="auftragsnummer" placeholder="z.B. AUF-2026-001234" />
          </div>
        </fieldset>

        <!-- Section 2: Durchgeführte Arbeiten -->
        <fieldset class="form-section">
          <legend class="form-section-title">Durchgeführte Arbeiten</legend>
          <div class="checkbox-group">
            <label class="checkbox-label">
              <input type="checkbox" name="arbeiten" value="Inspektion / Wartung" />
              <span>Inspektion / Wartung</span>
            </label>
            <label class="checkbox-label">
              <input type="checkbox" name="arbeiten" value="Reparatur" />
              <span>Reparatur</span>
            </label>
            <label class="checkbox-label">
              <input type="checkbox" name="arbeiten" value="Ersatzteilwechsel" />
              <span>Ersatzteilwechsel</span>
            </label>
            <label class="checkbox-label">
              <input type="checkbox" name="arbeiten" value="Softwareupdate" />
              <span>Softwareupdate</span>
            </label>
            <label class="checkbox-label">
              <input type="checkbox" name="arbeiten" value="Einweisung" />
              <span>Einweisung</span>
            </label>
            <label class="checkbox-label" id="sonstigesLabel">
              <input type="checkbox" name="arbeiten" value="Sonstiges" id="cbSonstiges" />
              <span>Sonstiges</span>
            </label>
          </div>
          <div id="sonstigesField" class="form-group sonstiges-hidden">
            <label for="sonstigesText">Beschreibung (Sonstiges)</label>
            <input type="text" id="sonstigesText" name="sonstigesText" placeholder="Bitte beschreiben..." />
          </div>
        </fieldset>

        <!-- Section 3: Feststellungen & Maßnahmen -->
        <fieldset class="form-section">
          <legend class="form-section-title">Feststellungen &amp; Maßnahmen</legend>
          <div class="form-group">
            <label for="beschreibung">Beschreibung der Arbeiten und Feststellungen</label>
            <textarea id="beschreibung" name="beschreibung" rows="5" placeholder="Detaillierte Beschreibung der durchgeführten Arbeiten, Feststellungen und getroffenen Maßnahmen..." required></textarea>
          </div>
        </fieldset>

        <!-- Section 4: Ersatzteile -->
        <fieldset class="form-section">
          <legend class="form-section-title">Ersatzteile</legend>
          <div id="ersatzteileList" class="ersatzteile-list"></div>
          <button type="button" class="btn btn-outline btn-sm" id="addErsatzteilBtn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Ersatzteil hinzufügen
          </button>
        </fieldset>

        <!-- Section 4b: Fotodokumentation -->
        <fieldset class="form-section">
          <legend class="form-section-title">Fotodokumentation</legend>
          <p class="signature-declaration">Optional: Fotos von Schäden, Reparaturen oder Einstellungen.</p>
          <label class="photo-upload-btn" for="photoInput">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
            Foto aufnehmen / auswählen
            <input type="file" accept="image/*" capture="environment" multiple id="photoInput" style="display:none" />
          </label>
          <div id="photoPreviewGrid" class="photo-preview-grid"></div>
        </fieldset>

        <!-- Section 5: Nächster Service -->
        <fieldset class="form-section">
          <legend class="form-section-title">Nächster Service</legend>
          <div class="form-row">
            <div class="form-group">
              <label for="nextServiceDate">Datum nächster Service</label>
              <input type="date" id="nextServiceDate" name="naechsterService" />
            </div>
          </div>
          <div class="form-group">
            <label for="nextServiceNotes">Bemerkungen</label>
            <textarea id="nextServiceNotes" name="naechsterServiceBemerkungen" rows="3" placeholder="Hinweise zum nächsten Service..."></textarea>
          </div>
        </fieldset>

        <!-- Section 6: Unterschrift Kunde -->
        <fieldset class="form-section">
          <legend class="form-section-title">Unterschrift Kunde</legend>
          <p class="signature-declaration">Ich bestätige die ordnungsgemäße Durchführung der oben genannten Arbeiten.</p>
          <div class="canvas-wrapper">
            <canvas id="canvasCustomer" class="signature-canvas" width="800" height="200" aria-label="Unterschriftfeld Kunde"></canvas>
          </div>
          <div class="canvas-controls">
            <button type="button" class="btn btn-outline btn-sm" id="clearCustomerBtn">Löschen</button>
            <span class="sig-status" id="sigStatusCustomer"></span>
          </div>
        </fieldset>

        <!-- Section 7: Unterschrift Techniker -->
        <fieldset class="form-section">
          <legend class="form-section-title">Unterschrift Techniker</legend>
          <p class="signature-declaration">Ich bestätige die fachgerechte Durchführung der aufgeführten Arbeiten.</p>
          <div class="canvas-wrapper">
            <canvas id="canvasTechnician" class="signature-canvas" width="800" height="200" aria-label="Unterschriftfeld Techniker"></canvas>
          </div>
          <div class="canvas-controls">
            <button type="button" class="btn btn-outline btn-sm" id="clearTechnicianBtn">Löschen</button>
            <span class="sig-status" id="sigStatusTechnician"></span>
          </div>
        </fieldset>

        <div class="form-submit-row">
          <button type="submit" class="btn btn-success btn-full" id="submitReportBtn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polyline points="20,6 9,17 4,12"/></svg>
            Bericht abschließen &amp; speichern
          </button>
        </div>

      </form>
    `;

    // Use Machines shell
    Machines._renderShell(contentHtml);

    // Wire up back button
    document.getElementById('backBtn').addEventListener('click', function() {
      Router.navigate('/machines/' + machineId);
    });

    // Sonstiges checkbox toggle
    var cbSonstiges = document.getElementById('cbSonstiges');
    var sonstigesField = document.getElementById('sonstigesField');
    cbSonstiges.addEventListener('change', function() {
      if (this.checked) {
        sonstigesField.classList.remove('sonstiges-hidden');
        sonstigesField.classList.add('sonstiges-visible');
      } else {
        sonstigesField.classList.add('sonstiges-hidden');
        sonstigesField.classList.remove('sonstiges-visible');
      }
    });

    // Ersatzteile dynamic rows
    var ersatzteileList = document.getElementById('ersatzteileList');
    var ersatzteilCounter = 0;

    document.getElementById('addErsatzteilBtn').addEventListener('click', function() {
      ersatzteilCounter++;
      var row = document.createElement('div');
      row.className = 'ersatzteil-row';
      row.setAttribute('data-row', ersatzteilCounter);
      row.innerHTML = `
        <div class="ersatzteil-fields">
          <div class="form-group">
            <label>Bezeichnung</label>
            <input type="text" name="ersatzteil_bezeichnung[]" placeholder="Teilebezeichnung" />
          </div>
          <div class="form-group form-group-narrow">
            <label>Menge</label>
            <input type="number" name="ersatzteil_menge[]" min="1" value="1" placeholder="1" />
          </div>
          <div class="form-group">
            <label>Artikelnummer</label>
            <input type="text" name="ersatzteil_artikelnummer[]" placeholder="Art.-Nr." />
          </div>
          <button type="button" class="btn btn-danger btn-sm remove-ersatzteil-btn" aria-label="Ersatzteil entfernen">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
      `;
      ersatzteileList.appendChild(row);

      row.querySelector('.remove-ersatzteil-btn').addEventListener('click', function() {
        ersatzteileList.removeChild(row);
      });
    });

    // Signature canvases
    ServiceReport._initCanvas('canvasCustomer', 'customer', 'sigStatusCustomer', 'clearCustomerBtn');
    ServiceReport._initCanvas('canvasTechnician', 'technician', 'sigStatusTechnician', 'clearTechnicianBtn');

    // Feature 4: Photo upload
    ServiceReport._photos = [];
    var photoInput = document.getElementById('photoInput');
    photoInput.addEventListener('change', function() {
      var files = Array.prototype.slice.call(this.files);
      files.forEach(function(file) {
        var reader = new FileReader();
        reader.onload = function(evt) {
          ServiceReport._photos.push(evt.target.result);
          ServiceReport._renderPhotoPreview();
        };
        reader.readAsDataURL(file);
      });
      // Reset input so same file can be re-added
      photoInput.value = '';
    });

    // Form submit
    document.getElementById('serviceReportForm').addEventListener('submit', function(e) {
      e.preventDefault();
      ServiceReport._handleSubmit(machineId, machine);
    });
  },

  _initCanvas: function(canvasId, stateKey, statusId, clearBtnId) {
    var canvas = document.getElementById(canvasId);
    var ctx = canvas.getContext('2d');
    var state = ServiceReport._canvasState[stateKey];

    // Set canvas dimensions to match display size
    function resizeCanvas() {
      var rect = canvas.getBoundingClientRect();
      var dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      ctx.strokeStyle = '#1a1a2e';
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
    }

    resizeCanvas();

    function getPos(e) {
      var rect = canvas.getBoundingClientRect();
      var clientX = e.clientX !== undefined ? e.clientX : (e.touches ? e.touches[0].clientX : 0);
      var clientY = e.clientY !== undefined ? e.clientY : (e.touches ? e.touches[0].clientY : 0);
      return {
        x: clientX - rect.left,
        y: clientY - rect.top
      };
    }

    function onPointerDown(e) {
      e.preventDefault();
      canvas.setPointerCapture(e.pointerId);
      state.drawing = true;
      var pos = getPos(e);
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
    }

    function onPointerMove(e) {
      e.preventDefault();
      if (!state.drawing) return;
      var pos = getPos(e);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    }

    function onPointerUp(e) {
      e.preventDefault();
      if (!state.drawing) return;
      state.drawing = false;
      state.hasSignature = true;
      var statusEl = document.getElementById(statusId);
      if (statusEl) {
        statusEl.textContent = 'Unterschrift vorhanden ✓';
        statusEl.className = 'sig-status sig-ok';
      }
    }

    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerup', onPointerUp);
    canvas.addEventListener('pointercancel', onPointerUp);

    // Clear button
    document.getElementById(clearBtnId).addEventListener('click', function() {
      var rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);
      state.hasSignature = false;
      state.drawing = false;
      var statusEl = document.getElementById(statusId);
      if (statusEl) {
        statusEl.textContent = '';
        statusEl.className = 'sig-status';
      }
    });
  },

  _renderPhotoPreview: function() {
    var grid = document.getElementById('photoPreviewGrid');
    if (!grid) return;
    grid.innerHTML = '';
    ServiceReport._photos.forEach(function(dataUrl, idx) {
      var item = document.createElement('div');
      item.className = 'photo-preview-item';
      item.innerHTML = '<img src="' + dataUrl + '" alt="Foto ' + (idx + 1) + '" />' +
        '<button type="button" class="remove-photo-btn" aria-label="Foto entfernen" data-index="' + idx + '">&times;</button>';
      grid.appendChild(item);
      item.querySelector('.remove-photo-btn').addEventListener('click', function() {
        ServiceReport._photos.splice(parseInt(this.getAttribute('data-index'), 10), 1);
        ServiceReport._renderPhotoPreview();
      });
    });
  },

  _handleSubmit: function(machineId, machine) {
    var customerState = ServiceReport._canvasState.customer;
    var technicianState = ServiceReport._canvasState.technician;

    if (!customerState.hasSignature) {
      showToast('Bitte Unterschrift des Kunden einholen.', 'error');
      document.getElementById('canvasCustomer').scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    if (!technicianState.hasSignature) {
      showToast('Bitte Unterschrift des Technikers leisten.', 'error');
      document.getElementById('canvasTechnician').scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    // Collect form data
    var form = document.getElementById('serviceReportForm');
    var datum = form.datum.value;
    var techniker = form.techniker.value;
    var auftragsnummer = form.auftragsnummer.value;
    var beschreibung = form.beschreibung.value;
    var naechsterService = form.naechsterService.value;
    var naechsterServiceBemerkungen = form.naechsterServiceBemerkungen.value;

    // Checkboxes
    var arbeiten = [];
    form.querySelectorAll('input[name="arbeiten"]:checked').forEach(function(cb) {
      if (cb.value === 'Sonstiges' && form.sonstigesText && form.sonstigesText.value.trim()) {
        arbeiten.push('Sonstiges: ' + form.sonstigesText.value.trim());
      } else {
        arbeiten.push(cb.value);
      }
    });

    // Ersatzteile
    var ersatzteile = [];
    var rows = document.querySelectorAll('.ersatzteil-row');
    rows.forEach(function(row) {
      var bez = row.querySelector('input[name="ersatzteil_bezeichnung[]"]');
      var menge = row.querySelector('input[name="ersatzteil_menge[]"]');
      var artNr = row.querySelector('input[name="ersatzteil_artikelnummer[]"]');
      if (bez && bez.value.trim()) {
        ersatzteile.push({
          bezeichnung: bez.value.trim(),
          menge: menge ? parseInt(menge.value, 10) || 1 : 1,
          artikelnummer: artNr ? artNr.value.trim() : ''
        });
      }
    });

    // Capture signatures as data URLs
    var canvasCustomer = document.getElementById('canvasCustomer');
    var canvasTechnician = document.getElementById('canvasTechnician');

    var report = {
      id: Date.now(),
      machineId: parseInt(machineId, 10),
      machineName: machine.name,
      serialNumber: machine.serialNumber,
      customerName: machine.customer.name,
      datum: datum,
      techniker: techniker,
      auftragsnummer: auftragsnummer,
      arbeiten: arbeiten,
      beschreibung: beschreibung,
      ersatzteile: ersatzteile,
      naechsterService: naechsterService,
      naechsterServiceBemerkungen: naechsterServiceBemerkungen,
      unterschriftKunde: canvasCustomer.toDataURL(),
      unterschriftTechniker: canvasTechnician.toDataURL(),
      fotos: ServiceReport._photos.slice(),
      erstelltAm: new Date().toISOString()
    };

    // Save to localStorage
    try {
      var existing = JSON.parse(localStorage.getItem('serviceportal_reports') || '[]');
      existing.unshift(report);
      localStorage.setItem('serviceportal_reports', JSON.stringify(existing));
    } catch (e) {
      console.error('Fehler beim Speichern:', e);
    }

    // Reset canvas state
    ServiceReport._canvasState = {
      customer: { drawing: false, hasSignature: false },
      technician: { drawing: false, hasSignature: false }
    };

    // Show save-success dialog (Feature 1)
    ServiceReport._showSaveDialog(report, machineId);
  },

  _showSaveDialog: function(report, machineId) {
    var overlay = document.createElement('div');
    overlay.className = 'save-dialog-overlay';
    overlay.innerHTML = `
      <div class="save-dialog">
        <div class="save-dialog-icon">&#10003;</div>
        <div class="save-dialog-title">Bericht gespeichert</div>
        <p class="save-dialog-text">Der Servicebericht wurde erfolgreich lokal gespeichert.</p>
        <div class="save-dialog-actions">
          <button class="btn btn-success btn-full" id="dialogPrintBtn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polyline points="6,9 6,2 18,2 18,9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
            Als PDF speichern
          </button>
          <button class="btn btn-outline btn-full" id="dialogBackBtn">
            Zur&uuml;ck zur Maschine
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);

    document.getElementById('dialogPrintBtn').addEventListener('click', function() {
      document.body.removeChild(overlay);
      ServiceReport.showPrintView(report);
    });

    document.getElementById('dialogBackBtn').addEventListener('click', function() {
      document.body.removeChild(overlay);
      Router.navigate('/machines/' + machineId);
    });
  },

  showPrintView: function(report) {
    var machine = getMachineById(report.machineId);
    var typeStyle = machine ? (TYPE_COLORS[machine.type] || { bg: '#f3f4f6', color: '#374151' }) : { bg: '#f3f4f6', color: '#374151' };

    var arbeitenHtml = (report.arbeiten && report.arbeiten.length > 0)
      ? '<ul class="print-arbeiten-list">' + report.arbeiten.map(function(a) {
          return '<li class="print-arbeiten-tag">' + escapeHtml(a) + '</li>';
        }).join('') + '</ul>'
      : '<span style="color:#9ca3af;font-style:italic;">Keine Arbeiten ausgewählt</span>';

    var ersatzteileHtml = (report.ersatzteile && report.ersatzteile.length > 0)
      ? '<table style="width:100%;border-collapse:collapse;font-size:0.83rem;">' +
        '<thead><tr style="border-bottom:1px solid #e5e7eb;">' +
          '<th style="text-align:left;padding:4px 8px;color:#6b7280;font-weight:600;">Bezeichnung</th>' +
          '<th style="text-align:left;padding:4px 8px;color:#6b7280;font-weight:600;">Menge</th>' +
          '<th style="text-align:left;padding:4px 8px;color:#6b7280;font-weight:600;">Art.-Nr.</th>' +
        '</tr></thead>' +
        '<tbody>' + report.ersatzteile.map(function(e) {
          return '<tr style="border-bottom:1px solid #f3f4f6;">' +
            '<td style="padding:4px 8px;">' + escapeHtml(e.bezeichnung) + '</td>' +
            '<td style="padding:4px 8px;">' + escapeHtml(String(e.menge)) + '</td>' +
            '<td style="padding:4px 8px;">' + escapeHtml(e.artikelnummer || '–') + '</td>' +
          '</tr>';
        }).join('') + '</tbody></table>'
      : '<span style="color:#9ca3af;font-style:italic;">Keine Ersatzteile</span>';

    var fotosHtml = (report.fotos && report.fotos.length > 0)
      ? '<div class="print-photo-grid">' + report.fotos.map(function(f, i) {
          return '<img src="' + f + '" alt="Foto ' + (i + 1) + '">';
        }).join('') + '</div>'
      : '<span style="color:#9ca3af;font-style:italic;">Keine Fotos</span>';

    var contentHtml = `
      <div class="print-actions">
        <button class="btn btn-success" id="doPrintBtn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polyline points="6,9 6,2 18,2 18,9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
          Drucken / Als PDF speichern
        </button>
        <button class="btn btn-outline" id="printBackBtn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><polyline points="15,18 9,12 15,6"/></svg>
          Zur&uuml;ck
        </button>
      </div>

      <div class="print-report">
        <div class="print-report-header">
          <div>
            <div class="print-report-title">Servicebericht</div>
            <div class="print-report-meta">
              ${escapeHtml(report.machineName || '')} &bull; ${escapeHtml(report.serialNumber || '')}
            </div>
            <div class="print-report-meta">${escapeHtml(report.customerName || '')}</div>
          </div>
          <div style="text-align:right;">
            <div style="font-size:0.82rem;color:#6b7280;">Datum</div>
            <div style="font-weight:700;">${formatDate(report.datum)}</div>
            ${report.auftragsnummer ? '<div style="font-size:0.8rem;color:#6b7280;margin-top:4px;">Auftr.-Nr.: ' + escapeHtml(report.auftragsnummer) + '</div>' : ''}
          </div>
        </div>

        <div class="print-section">
          <div class="print-section-title">Auftragsdaten</div>
          <dl class="print-grid">
            <dt>Techniker</dt><dd>${escapeHtml(report.techniker)}</dd>
            <dt>Datum</dt><dd>${formatDate(report.datum)}</dd>
            ${report.auftragsnummer ? '<dt>Auftragsnummer</dt><dd>' + escapeHtml(report.auftragsnummer) + '</dd>' : ''}
          </dl>
        </div>

        <div class="print-section">
          <div class="print-section-title">Maschinendaten</div>
          <dl class="print-grid">
            <dt>Maschine</dt><dd>${escapeHtml(report.machineName || '')}</dd>
            <dt>Seriennummer</dt><dd>${escapeHtml(report.serialNumber || '')}</dd>
            <dt>Kunde</dt><dd>${escapeHtml(report.customerName || '')}</dd>
            ${machine ? '<dt>Adresse</dt><dd>' + escapeHtml(machine.customer.address) + '</dd>' : ''}
          </dl>
        </div>

        <div class="print-section">
          <div class="print-section-title">Durchgef&uuml;hrte Arbeiten</div>
          ${arbeitenHtml}
        </div>

        <div class="print-section">
          <div class="print-section-title">Feststellungen &amp; Ma&szlig;nahmen</div>
          <p style="font-size:0.88rem;color:#1f2937;line-height:1.6;white-space:pre-wrap;">${escapeHtml(report.beschreibung || '')}</p>
        </div>

        <div class="print-section">
          <div class="print-section-title">Ersatzteile</div>
          ${ersatzteileHtml}
        </div>

        ${(report.naechsterService || report.naechsterServiceBemerkungen) ? `
        <div class="print-section">
          <div class="print-section-title">N&auml;chster Service</div>
          <dl class="print-grid">
            ${report.naechsterService ? '<dt>Datum</dt><dd>' + formatDate(report.naechsterService) + '</dd>' : ''}
            ${report.naechsterServiceBemerkungen ? '<dt>Bemerkungen</dt><dd>' + escapeHtml(report.naechsterServiceBemerkungen) + '</dd>' : ''}
          </dl>
        </div>` : ''}

        <div class="print-section">
          <div class="print-section-title">Fotodokumentation</div>
          ${fotosHtml}
        </div>

        <div class="print-section">
          <div class="print-section-title">Unterschriften</div>
          <div class="print-sig-row">
            <div class="print-sig-box">
              <div class="print-sig-label">Unterschrift Kunde</div>
              <img src="${report.unterschriftKunde || ''}" alt="Unterschrift Kunde" />
            </div>
            <div class="print-sig-box">
              <div class="print-sig-label">Unterschrift Techniker</div>
              <img src="${report.unterschriftTechniker || ''}" alt="Unterschrift Techniker" />
            </div>
          </div>
        </div>
      </div>
    `;

    Machines._renderShell(contentHtml);

    document.getElementById('doPrintBtn').addEventListener('click', function() {
      window.print();
    });

    document.getElementById('printBackBtn').addEventListener('click', function() {
      history.back();
    });
  }
};
