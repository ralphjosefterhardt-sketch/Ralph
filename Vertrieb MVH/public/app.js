'use strict';

// ── State ──────────────────────────────────────────────────────────────────
let allBesuche = [];
let allAnfragen = [];
let activeRecognition = null;
let activeRecBtn = null;

// ── Init ───────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Set today's date
  document.getElementById('b_datum').value = new Date().toISOString().split('T')[0];

  // Load saved user name
  const savedUser = localStorage.getItem('mvh_benutzer');
  if (savedUser) document.getElementById('globalBenutzer').value = savedUser;

  // Save user name on change
  document.getElementById('globalBenutzer').addEventListener('input', e => {
    localStorage.setItem('mvh_benutzer', e.target.value);
  });

  // Tab navigation
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
    });
  });

  loadBesuche();
  loadAnfragen();
});

// ── Toast ──────────────────────────────────────────────────────────────────
function showToast(msg, type = '') {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = 'toast show' + (type ? ' ' + type : '');
  setTimeout(() => t.classList.remove('show'), 3000);
}

// ── Speech Recognition ─────────────────────────────────────────────────────
const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;

function toggleSpeech(fieldId, btnId) {
  if (!SpeechRec) {
    showToast('Spracheingabe wird von diesem Browser nicht unterstützt. Bitte Chrome/Edge verwenden.', 'error');
    return;
  }
  const btn = document.getElementById(btnId);
  if (activeRecBtn === btn && activeRecognition) {
    activeRecognition.stop();
    return;
  }
  if (activeRecognition) activeRecognition.stop();

  const rec = new SpeechRec();
  rec.lang = 'de-DE';
  rec.continuous = true;
  rec.interimResults = true;

  const field = document.getElementById(fieldId);
  const existingText = field.value;

  rec.onstart = () => {
    activeRecognition = rec;
    activeRecBtn = btn;
    btn.classList.add('recording');
    btn.innerHTML = btn.classList.contains('mic-sm') ? '⏹' : '<span class="mic-icon">⏹</span> Aufnahme stoppen';
  };

  rec.onresult = (e) => {
    let interim = '';
    let final = '';
    for (let i = e.resultIndex; i < e.results.length; i++) {
      if (e.results[i].isFinal) final += e.results[i][0].transcript + ' ';
      else interim += e.results[i][0].transcript;
    }
    if (final) field.value = (existingText ? existingText + ' ' : '') + final.trim() + ' ';
    // Show interim in a lighter style via data attribute
    field.dataset.interim = interim;
  };

  rec.onerror = (e) => {
    showToast('Fehler bei Spracheingabe: ' + e.error, 'error');
    stopRec(btn);
  };

  rec.onend = () => stopRec(btn);
  rec.start();
}

function stopRec(btn) {
  if (btn) {
    btn.classList.remove('recording');
    if (btn.classList.contains('mic-sm')) {
      btn.innerHTML = '🎤';
    } else if (btn.id === 'mic_anfrage_gesamt') {
      btn.innerHTML = '<span class="mic-icon">🎤</span> Diktat starten';
    } else {
      btn.innerHTML = '<span class="mic-icon">🎤</span> Spracheingabe';
    }
  }
  activeRecognition = null;
  activeRecBtn = null;
}

// ── Anfrage Diktat (Gesamtdiktat mit Felderkennung) ─────────────────────────
function toggleSpeechAnfrage() {
  if (!SpeechRec) {
    showToast('Spracheingabe wird von diesem Browser nicht unterstützt.', 'error');
    return;
  }
  const btn = document.getElementById('mic_anfrage_gesamt');
  if (activeRecBtn === btn && activeRecognition) {
    activeRecognition.stop();
    parseDiktat(document.getElementById('diktat-preview').textContent);
    return;
  }
  if (activeRecognition) activeRecognition.stop();

  const rec = new SpeechRec();
  rec.lang = 'de-DE';
  rec.continuous = true;
  rec.interimResults = true;

  let fullText = '';

  rec.onstart = () => {
    activeRecognition = rec;
    activeRecBtn = btn;
    btn.classList.add('recording');
    btn.innerHTML = '<span class="mic-icon">⏹</span> Diktat stoppen & ausfüllen';
    const preview = document.getElementById('diktat-preview');
    preview.style.display = 'block';
    preview.textContent = 'Aufnahme läuft …';
  };

  rec.onresult = (e) => {
    let interim = '';
    for (let i = e.resultIndex; i < e.results.length; i++) {
      if (e.results[i].isFinal) fullText += e.results[i][0].transcript + ' ';
      else interim += e.results[i][0].transcript;
    }
    document.getElementById('diktat-preview').textContent = (fullText + interim).trim();
  };

  rec.onend = () => {
    stopRec(btn);
    if (fullText.trim()) parseDiktat(fullText.trim());
  };

  rec.onerror = () => stopRec(btn);
  rec.start();
}

// Simple keyword-based field extraction from dictated text
function parseDiktat(text) {
  if (!text) return;
  showToast('Diktat wird in Felder übernommen …');

  // Extract by keyword patterns (German speech)
  const get = (patterns) => {
    for (const p of patterns) {
      const re = new RegExp(p + '[:\\s]+([^,\\.]+)', 'i');
      const m = text.match(re);
      if (m) return m[1].trim();
    }
    return '';
  };

  const customer = get(['Kunde', 'Kundenname', 'Firma', 'Unternehmen', 'von der Firma', 'von']);
  const contact  = get(['Ansprechpartner', 'Kontakt', 'Herr', 'Frau']);
  const timeline = get(['Zeitschiene', 'Termin', 'Liefertermin', 'bis', 'ab', 'Lieferung']);
  const material = get(['Material', 'Werkstoff', 'aus', 'bestehend aus']);
  const qty      = get(['Menge', 'Stückzahl', 'Anzahl', 'Stück']);
  const yearqty  = get(['Jahresmenge', 'pro Jahr', 'jährlich', 'Jahresbedarf']);
  const quality  = get(['Qualität', 'Norm', 'Güte', 'nach Norm']);
  const spec     = get(['Spezifikation', 'Ausführung', 'Oberfläche', 'Behandlung']);
  const dims     = get(['Maße', 'Abmessungen', 'Dimension', 'Größe', 'Durchmesser']);

  if (customer) setIfEmpty('a_kundenname', customer);
  if (contact)  setIfEmpty('a_ansprechpartner', contact);
  if (timeline) setIfEmpty('a_zeitschiene', timeline);
  if (material) setIfEmpty('a_material', material);
  if (qty)      setIfEmpty('a_menge', qty);
  if (yearqty)  setIfEmpty('a_jahresmenge', yearqty);
  if (quality)  setIfEmpty('a_qualitaet', quality);
  if (spec)     setIfEmpty('a_spezifikation', spec);
  if (dims)     setIfEmpty('a_masse', dims);

  // Put full text into notes if nothing else was recognised
  const filled = [customer, contact, timeline, material, qty, yearqty, quality, spec, dims].filter(Boolean);
  if (filled.length === 0) {
    document.getElementById('a_notizen').value = text;
    showToast('Text in Notizen übernommen. Felder bitte manuell ausfüllen.');
  } else {
    showToast('Felder aus Diktat befüllt (' + filled.length + ' Erkennungen)', 'success');
  }
}

function setIfEmpty(id, val) {
  const el = document.getElementById(id);
  if (el && !el.value) el.value = val;
}

// ── Besuchsberichte ────────────────────────────────────────────────────────
async function saveBesuch() {
  const data = {
    kundennr: v('b_kundennr'),
    kundenname: v('b_kundenname'),
    ansprechpartner: v('b_ansprechpartner'),
    datum: v('b_datum'),
    art: v('b_art'),
    betreff: v('b_betreff'),
    bericht: v('b_bericht'),
    ergebnis: v('b_ergebnis'),
    naechste_schritte: v('b_naechste_schritte'),
    benutzer: v('globalBenutzer')
  };
  if (!data.kundenname) { showToast('Bitte Kundenname eingeben', 'error'); return; }
  if (!data.datum) { showToast('Bitte Datum eingeben', 'error'); return; }

  try {
    const res = await fetch('/api/besuche', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(data) });
    if (!res.ok) throw new Error(await res.text());
    showToast('Besuchsbericht gespeichert', 'success');
    resetBesuch();
    loadBesuche();
  } catch (e) {
    showToast('Fehler: ' + e.message, 'error');
  }
}

function resetBesuch() {
  ['b_kundennr','b_kundenname','b_ansprechpartner','b_betreff','b_bericht','b_ergebnis','b_naechste_schritte'].forEach(id => {
    document.getElementById(id).value = '';
  });
  document.getElementById('b_datum').value = new Date().toISOString().split('T')[0];
  document.getElementById('b_art').value = 'Besuch';
}

async function loadBesuche() {
  try {
    const res = await fetch('/api/besuche');
    allBesuche = await res.json();
    renderBesuche(allBesuche);
  } catch(e) { console.error(e); }
}

function filterBesuche() {
  const q = document.getElementById('searchBesuche').value.toLowerCase();
  if (!q) { renderBesuche(allBesuche); return; }
  renderBesuche(allBesuche.filter(b =>
    (b.kundenname||'').toLowerCase().includes(q) ||
    (b.betreff||'').toLowerCase().includes(q) ||
    (b.ansprechpartner||'').toLowerCase().includes(q) ||
    (b.kundennr||'').toLowerCase().includes(q)
  ));
}

function renderBesuche(list) {
  const cont = document.getElementById('besuche-list');
  if (!list.length) {
    cont.innerHTML = '<div class="empty-state">Keine Berichte gefunden.</div>';
    return;
  }
  cont.innerHTML = list.map(b => `
    <div class="list-item besuch" onclick="showBesuchDetail(${b.id})">
      <div class="item-main">
        <div class="item-title">${esc(b.kundenname)}${b.kundennr ? ' <span style="color:var(--text-muted);font-weight:400">('+esc(b.kundennr)+')</span>' : ''}</div>
        <div class="item-meta">
          <span>📅 ${b.datum}</span>
          <span class="badge badge-blue">${esc(b.art)}</span>
          ${b.betreff ? '<span>📌 '+esc(b.betreff)+'</span>' : ''}
          ${b.ansprechpartner ? '<span>👤 '+esc(b.ansprechpartner)+'</span>' : ''}
          ${b.benutzer ? '<span>🧑‍💼 '+esc(b.benutzer)+'</span>' : ''}
        </div>
      </div>
      <div class="item-actions" onclick="event.stopPropagation()">
        <button class="btn btn-outline btn-sm" onclick="downloadXML(${b.id})">⬇ XML</button>
        <button class="btn btn-sm" style="background:#fee2e2;color:#991b1b;border:none" onclick="deleteBesuch(${b.id})">✕</button>
      </div>
    </div>
  `).join('');
}

async function deleteBesuch(id) {
  if (!confirm('Bericht wirklich löschen?')) return;
  await fetch('/api/besuche/' + id, { method: 'DELETE' });
  showToast('Bericht gelöscht');
  loadBesuche();
}

function downloadXML(id) {
  window.location.href = '/api/besuche/' + id + '/xml';
}

function exportAlleXML() {
  if (!allBesuche.length) { showToast('Keine Berichte vorhanden', 'error'); return; }
  window.location.href = '/api/besuche/export/xml';
}

function showBesuchDetail(id) {
  const b = allBesuche.find(x => x.id === id);
  if (!b) return;
  document.getElementById('modal-content').innerHTML = `
    <h2 style="margin-bottom:.5rem">${esc(b.kundenname)}</h2>
    <div class="detail-grid">
      <div class="detail-field"><label>Kundennr.</label><div class="value">${esc(b.kundennr) || '–'}</div></div>
      <div class="detail-field"><label>Datum</label><div class="value">${esc(b.datum)}</div></div>
      <div class="detail-field"><label>Ansprechpartner</label><div class="value">${esc(b.ansprechpartner) || '–'}</div></div>
      <div class="detail-field"><label>Besuchsart</label><div class="value">${esc(b.art)}</div></div>
      <div class="detail-field wide"><label>Betreff</label><div class="value">${esc(b.betreff) || '–'}</div></div>
      <div class="detail-field wide"><label>Besuchsbericht</label><div class="value multiline">${esc(b.bericht) || '–'}</div></div>
      <div class="detail-field wide"><label>Ergebnis / Vereinbarungen</label><div class="value multiline">${esc(b.ergebnis) || '–'}</div></div>
      <div class="detail-field wide"><label>Nächste Schritte</label><div class="value multiline">${esc(b.naechste_schritte) || '–'}</div></div>
      <div class="detail-field"><label>Benutzer</label><div class="value">${esc(b.benutzer) || '–'}</div></div>
      <div class="detail-field"><label>Erstellt am</label><div class="value">${esc(b.erstellt_am)}</div></div>
    </div>
  `;
  document.getElementById('modal-actions').innerHTML = `
    <button class="btn btn-secondary" onclick="document.getElementById('modal').classList.remove('open')">Schließen</button>
    <button class="btn btn-outline" onclick="downloadXML(${b.id})">⬇ BMD XML herunterladen</button>
  `;
  document.getElementById('modal').classList.add('open');
}

function closeModal(e) {
  if (e.target.id === 'modal') document.getElementById('modal').classList.remove('open');
}

// ── Anfragen ───────────────────────────────────────────────────────────────
async function saveAnfrage() {
  const data = {
    kundennr: v('a_kundennr'),
    kundenname: v('a_kundenname'),
    ansprechpartner: v('a_ansprechpartner'),
    zeitschiene: v('a_zeitschiene'),
    material: v('a_material'),
    menge: v('a_menge'),
    jahresmenge: v('a_jahresmenge'),
    qualitaet: v('a_qualitaet'),
    spezifikation: v('a_spezifikation'),
    masse: v('a_masse'),
    notizen: v('a_notizen'),
    benutzer: v('globalBenutzer')
  };
  if (!data.kundenname) { showToast('Bitte Kundenname eingeben', 'error'); return; }

  try {
    const res = await fetch('/api/anfragen', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(data) });
    if (!res.ok) throw new Error(await res.text());
    showToast('Anfrage gespeichert', 'success');
    resetAnfrage();
    loadAnfragen();
  } catch(e) {
    showToast('Fehler: ' + e.message, 'error');
  }
}

function resetAnfrage() {
  ['a_kundennr','a_kundenname','a_ansprechpartner','a_zeitschiene','a_material',
   'a_menge','a_jahresmenge','a_qualitaet','a_spezifikation','a_masse','a_notizen'].forEach(id => {
    document.getElementById(id).value = '';
  });
  const preview = document.getElementById('diktat-preview');
  preview.style.display = 'none';
  preview.textContent = '';
}

async function loadAnfragen() {
  try {
    const res = await fetch('/api/anfragen');
    allAnfragen = await res.json();
    renderAnfragen(allAnfragen);
  } catch(e) { console.error(e); }
}

function filterAnfragen() {
  const q = document.getElementById('searchAnfragen').value.toLowerCase();
  const s = document.getElementById('filterStatus').value;
  let list = allAnfragen;
  if (q) list = list.filter(a =>
    (a.kundenname||'').toLowerCase().includes(q) ||
    (a.material||'').toLowerCase().includes(q) ||
    (a.ansprechpartner||'').toLowerCase().includes(q) ||
    (a.kundennr||'').toLowerCase().includes(q)
  );
  if (s) list = list.filter(a => a.status === s);
  renderAnfragen(list);
}

function renderAnfragen(list) {
  const cont = document.getElementById('anfragen-list');
  if (!list.length) {
    cont.innerHTML = '<div class="empty-state">Keine Anfragen gefunden.</div>';
    return;
  }
  cont.innerHTML = list.map(a => `
    <div class="list-item anfrage ${a.status === 'Erledigt' ? 'status-erledigt' : ''}" onclick="showAnfrageDetail(${a.id})">
      <div class="item-main">
        <div class="item-title">${esc(a.kundenname)}${a.kundennr ? ' <span style="color:var(--text-muted);font-weight:400">('+esc(a.kundennr)+')</span>' : ''}</div>
        <div class="item-meta">
          <span>📅 ${a.erstellt_am ? a.erstellt_am.substring(0,10) : ''}</span>
          ${a.material ? '<span>🧱 '+esc(a.material)+'</span>' : ''}
          ${a.menge ? '<span>📦 '+esc(a.menge)+'</span>' : ''}
          ${a.zeitschiene ? '<span>⏱ '+esc(a.zeitschiene)+'</span>' : ''}
          ${a.ansprechpartner ? '<span>👤 '+esc(a.ansprechpartner)+'</span>' : ''}
          ${a.benutzer ? '<span>🧑‍💼 '+esc(a.benutzer)+'</span>' : ''}
        </div>
      </div>
      <div class="item-actions" onclick="event.stopPropagation()">
        <select class="status-select" onchange="updateStatus(${a.id}, this.value)">
          ${['Offen','In Bearbeitung','Angebot erstellt','Erledigt'].map(s =>
            `<option value="${s}" ${a.status===s?'selected':''}>${s}</option>`
          ).join('')}
        </select>
        <button class="btn btn-sm" style="background:#fee2e2;color:#991b1b;border:none" onclick="deleteAnfrage(${a.id})">✕</button>
      </div>
    </div>
  `).join('');
}

async function updateStatus(id, status) {
  await fetch('/api/anfragen/' + id + '/status', {
    method: 'PATCH',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ status })
  });
  const item = allAnfragen.find(a => a.id === id);
  if (item) item.status = status;
  showToast('Status aktualisiert');
}

async function deleteAnfrage(id) {
  if (!confirm('Anfrage wirklich löschen?')) return;
  await fetch('/api/anfragen/' + id, { method: 'DELETE' });
  showToast('Anfrage gelöscht');
  loadAnfragen();
}

function exportAnfragenExcel() {
  if (!allAnfragen.length) { showToast('Keine Anfragen vorhanden', 'error'); return; }
  window.location.href = '/api/anfragen/export/excel';
}

function exportAnfragenCSV() {
  if (!allAnfragen.length) { showToast('Keine Anfragen vorhanden', 'error'); return; }
  window.location.href = '/api/anfragen/export/csv';
}

function showAnfrageDetail(id) {
  const a = allAnfragen.find(x => x.id === id);
  if (!a) return;
  document.getElementById('modal-content').innerHTML = `
    <h2 style="margin-bottom:.5rem">Anfrage: ${esc(a.kundenname)}</h2>
    <div class="detail-grid">
      <div class="detail-field"><label>Kundennr.</label><div class="value">${esc(a.kundennr) || '–'}</div></div>
      <div class="detail-field"><label>Datum</label><div class="value">${a.erstellt_am ? a.erstellt_am.substring(0,10) : '–'}</div></div>
      <div class="detail-field"><label>Ansprechpartner</label><div class="value">${esc(a.ansprechpartner) || '–'}</div></div>
      <div class="detail-field"><label>Zeitschiene</label><div class="value">${esc(a.zeitschiene) || '–'}</div></div>
      <div class="detail-field"><label>Material</label><div class="value">${esc(a.material) || '–'}</div></div>
      <div class="detail-field"><label>Menge</label><div class="value">${esc(a.menge) || '–'}</div></div>
      <div class="detail-field"><label>Jahresmenge</label><div class="value">${esc(a.jahresmenge) || '–'}</div></div>
      <div class="detail-field"><label>Qualität / Norm</label><div class="value">${esc(a.qualitaet) || '–'}</div></div>
      <div class="detail-field"><label>Spezifikation</label><div class="value">${esc(a.spezifikation) || '–'}</div></div>
      <div class="detail-field"><label>Maße</label><div class="value">${esc(a.masse) || '–'}</div></div>
      <div class="detail-field wide"><label>Notizen</label><div class="value multiline">${esc(a.notizen) || '–'}</div></div>
      <div class="detail-field"><label>Benutzer</label><div class="value">${esc(a.benutzer) || '–'}</div></div>
      <div class="detail-field"><label>Status</label><div class="value">${esc(a.status)}</div></div>
    </div>
  `;
  document.getElementById('modal-actions').innerHTML = `
    <button class="btn btn-secondary" onclick="document.getElementById('modal').classList.remove('open')">Schließen</button>
    <button class="btn btn-outline" onclick="exportAnfragenExcel()">⬇ Excel exportieren</button>
  `;
  document.getElementById('modal').classList.add('open');
}

// ── Helpers ────────────────────────────────────────────────────────────────
function v(id) { return (document.getElementById(id)?.value || '').trim(); }

function esc(str) {
  return (str || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}
