// service-report.js — Service Report Form with signature capture

var ServiceReport = {

  _canvasState: {
    customer: { drawing: false, hasSignature: false },
    technician: { drawing: false, hasSignature: false }
  },

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

        <fieldset class="form-section">
          <legend class="form-section-title">Feststellungen &amp; Maßnahmen</legend>
          <div class="form-group">
            <label for="beschreibung">Beschreibung der Arbeiten und Feststellungen</label>
            <textarea id="beschreibung" name="beschreibung" rows="5" placeholder="Detaillierte Beschreibung der durchgeführten Arbeiten, Feststellungen und getroffenen Maßnahmen..." required></textarea>
          </div>
        </fieldset>

        <fieldset class="form-section">
          <legend class="form-section-title">Ersatzteile</legend>
          <div id="ersatzteileList" class="ersatzteile-list"></div>
          <button type="button" class="btn btn-outline btn-sm" id="addErsatzteilBtn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Ersatzteil hinzufügen
          </button>
        </fieldset>

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

    Machines._renderShell(contentHtml);

    document.getElementById('backBtn').addEventListener('click', function() {
      Router.navigate('/machines/' + machineId);
    });

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

    ServiceReport._initCanvas('canvasCustomer', 'customer', 'sigStatusCustomer', 'clearCustomerBtn');
    ServiceReport._initCanvas('canvasTechnician', 'technician', 'sigStatusTechnician', 'clearTechnicianBtn');

    document.getElementById('serviceReportForm').addEventListener('submit', function(e) {
      e.preventDefault();
      ServiceReport._handleSubmit(machineId, machine);
    });
  },

  _initCanvas: function(canvasId, stateKey, statusId, clearBtnId) {
    var canvas = document.getElementById(canvasId);
    var ctx = canvas.getContext('2d');
    var state = ServiceReport._canvasState[stateKey];

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

    var form = document.getElementById('serviceReportForm');
    var datum = form.datum.value;
    var techniker = form.techniker.value;
    var auftragsnummer = form.auftragsnummer.value;
    var beschreibung = form.beschreibung.value;
    var naechsterService = form.naechsterService.value;
    var naechsterServiceBemerkungen = form.naechsterServiceBemerkungen.value;

    var arbeiten = [];
    form.querySelectorAll('input[name="arbeiten"]:checked').forEach(function(cb) {
      if (cb.value === 'Sonstiges' && form.sonstigesText && form.sonstigesText.value.trim()) {
        arbeiten.push('Sonstiges: ' + form.sonstigesText.value.trim());
      } else {
        arbeiten.push(cb.value);
      }
    });

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
      erstelltAm: new Date().toISOString()
    };

    try {
      var existing = JSON.parse(localStorage.getItem('serviceportal_reports') || '[]');
      existing.unshift(report);
      localStorage.setItem('serviceportal_reports', JSON.stringify(existing));
    } catch (e) {
      console.error('Fehler beim Speichern:', e);
    }

    showToast('Bericht wurde gespeichert', 'success');

    ServiceReport._canvasState = {
      customer: { drawing: false, hasSignature: false },
      technician: { drawing: false, hasSignature: false }
    };

    setTimeout(function() {
      Router.navigate('/machines/' + machineId);
    }, 800);
  }
};
