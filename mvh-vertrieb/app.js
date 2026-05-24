'use strict';

const KEY_BESUCHE  = 'mvh_besuche_v1';
const KEY_ANFRAGEN = 'mvh_anfragen_v1';

function load(key)        { try { return JSON.parse(localStorage.getItem(key)) || []; } catch { return []; } }
function save(key, data)  { localStorage.setItem(key, JSON.stringify(data)); }
function nextId(arr)      { return arr.length ? Math.max(...arr.map(x => x.id)) + 1 : 1; }

let besuche  = load(KEY_BESUCHE);
let anfragen = load(KEY_ANFRAGEN);

const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
let activeRec = null;
let activeBtn = null;

function toggleSpeech(fieldId, btnId) {
  if (!SR) { toast('Spracheingabe nur in Chrome/Edge verfügbar', 'err'); return; }
  const btn = document.getElementById(btnId);
  if (activeBtn === btn && activeRec) { activeRec.stop(); return; }
  if (activeRec) activeRec.stop();

  const rec = new SR();
  rec.lang = 'de-DE';
  rec.continuous = true;
  rec.interimResults = false;

  const field = document.getElementById(fieldId);
  let accumulated = field.value;

  rec.onstart = () => {
    activeRec = rec; activeBtn = btn;
    btn.classList.add('recording');
    btn.dataset.origText = btn.textContent;
    btn.textContent = btn.classList.contains('mic-sm') ? '⏹' : '⏹ Stoppen';
  };
  rec.onresult = e => {
    for (let i = e.resultIndex; i < e.results.length; i++) {
      if (e.results[i].isFinal) {
        accumulated += (accumulated ? ' ' : '') + e.results[i][0].transcript.trim();
      }
    }
    field.value = accumulated;
  };
  rec.onerror = () => stopSpeech(btn);
  rec.onend   = () => stopSpeech(btn);
  rec.start();
}

function stopSpeech(btn) {
  if (btn) {
    btn.classList.remove('recording');
    if (btn.dataset.origText) btn.textContent = btn.dataset.origText;
  }
  activeRec = null; activeBtn = null;
}

let diktatText = '';

function toggleDiktat() {
  if (!SR) { toast('Spracheingabe nur in Chrome/Edge verfügbar', 'err'); return; }
  const btn = document.getElementById('mic_diktat');
  if (activeBtn === btn && activeRec) {
    activeRec.stop();
    if (diktatText) parseDiktat(diktatText);
    return;
  }
  if (activeRec) activeRec.stop();
  diktatText = '';

  const rec = new SR();
  rec.lang = 'de-DE';
  rec.continuous = true;
  rec.interimResults = true;

  rec.onstart = () => {
    activeRec = rec; activeBtn = btn;
    btn.classList.add('recording');
    btn.textContent = '⏹ Diktat stoppen & ausfüllen';
    const p = document.getElementById('diktat-preview');
    p.textContent = 'Aufnahme läuft …';
  };
  rec.onresult = e => {
    let interim = '';
    for (let i = e.resultIndex; i < e.results.length; i++) {
      if (e.results[i].isFinal) diktatText += e.results[i][0].transcript + ' ';
      else interim += e.results[i][0].transcript;
    }
    document.getElementById('diktat-preview').textContent = (diktatText + interim).trim();
  };
  rec.onerror = () => stopSpeech(btn);
  rec.onend   = () => {
    stopSpeech(btn);
    btn.textContent = '🎤 Diktat starten';
    if (diktatText.trim()) parseDiktat(diktatText.trim());
  };
  rec.start();
}

function parseDiktat(text) {
  const get = (...kw) => {
    for (const k of kw) {
      const m = text.match(new RegExp(k + '[:\\s]+([^,.]+)', 'i'));
      if (m) return m[1].trim();
    }
    return '';
  };
  const fields = {
    a_kundenname:      get('Kunde', 'Kundenname', 'Firma', 'Unternehmen'),
    a_ansprechpartner: get('Ansprechpartner', 'Kontakt'),
    a_zeitschiene:     get('Zeitschiene', 'Liefertermin', 'bis', 'Termin'),
    a_material:        get('Material', 'Werkstoff'),
    a_menge:           get('Menge', 'Stückzahl', 'Anzahl'),
    a_jahresmenge:     get('Jahresmenge', 'jährlich', 'pro Jahr', 'Jahresbedarf'),
    a_qualitaet:       get('Qualität', 'Norm', 'Güte'),
    a_spezifikation:   get('Spezifikation', 'Ausführung', 'Oberfläche'),
    a_masse:           get('Maße', 'Abmessungen', 'Dimension', 'Größe'),
  };
  let hits = 0;
  for (const [id, val] of Object.entries(fields)) {
    if (val) { const el = document.getElementById(id); if (el && !el.value) { el.value = val; hits++; } }
  }
  if (!hits) {
    document.getElementById('a_notizen').value = text;
    toast('Text in Notizen übernommen – Felder bitte manuell ausfüllen');
  } else {
    toast(`${hits} Felder aus Diktat befüllt`, 'ok');
  }
}

function toast(msg, type = '') {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.className = 'toast show' + (type ? ' ' + type : '');
  clearTimeout(el._t);
  el._t = setTimeout(() => el.classList.remove('show'), 3200);
}

document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
  });
});

const userEl = document.getElementById('globalBenutzer');
userEl.value = localStorage.getItem('mvh_user') || '';
userEl.addEventListener('input', () => localStorage.setItem('mvh_user', userEl.value.trim()));
const getUser = () => userEl.value.trim();

document.getElementById('b_datum').value = todayISO();

function saveBesuch() {
  const k = v('b_kundenname'); const d = v('b_datum');
  if (!k) { toast('Bitte Kundenname eingeben', 'err'); return; }
  if (!d) { toast('Bitte Datum eingeben', 'err'); return; }
  const rec = {
    id: nextId(besuche),
    kundennr: v('b_kundennr'), kundenname: k, ansprechpartner: v('b_ansprechpartner'),
    datum: d, art: v('b_art') || 'Besuch', betreff: v('b_betreff'),
    bericht: v('b_bericht'), ergebnis: v('b_ergebnis'), naechste: v('b_naechste'),
    benutzer: getUser(), erstellt: new Date().toISOString()
  };
  besuche.unshift(rec);
  save(KEY_BESUCHE, besuche);
  toast('Besuchsbericht gespeichert', 'ok');
  resetBesuch();
  renderBesuche();
}

function resetBesuch() {
  ['b_kundennr','b_kundenname','b_ansprechpartner','b_betreff','b_bericht','b_ergebnis','b_naechste'].forEach(clear);
  document.getElementById('b_datum').value = todayISO();
  document.getElementById('b_art').value = 'Besuch';
}

function renderBesuche() {
  const q = v('searchBesuche').toLowerCase();
  const list = q
    ? besuche.filter(b => [b.kundenname, b.betreff, b.ansprechpartner, b.kundennr].some(x => (x||'').toLowerCase().includes(q)))
    : besuche;

  document.getElementById('besuche-count').textContent = besuche.length || '';
  const cont = document.getElementById('besuche-list');

  if (!list.length) {
    cont.innerHTML = `<div class="empty">${q ? 'Keine Berichte gefunden.' : 'Noch keine Berichte gespeichert.'}</div>`;
    return;
  }
  cont.innerHTML = '<div class="list-wrap">' + list.map(b => `
    <div class="item is-besuch" onclick="detailBesuch(${b.id})">
      <div class="item-body">
        <div class="item-title">${x(b.kundenname)}${b.kundennr ? ` <span style="color:var(--muted);font-weight:400">(${x(b.kundennr)})</span>` : ''}</div>
        <div class="item-meta">
          <span>📅 ${b.datum}</span>
          <span class="badge b-blue">${x(b.art)}</span>
          ${b.betreff         ? `<span>📌 ${x(b.betreff)}</span>` : ''}
          ${b.ansprechpartner ? `<span>👤 ${x(b.ansprechpartner)}</span>` : ''}
          ${b.benutzer        ? `<span>🧑 ${x(b.benutzer)}</span>` : ''}
        </div>
      </div>
      <div class="item-actions" onclick="event.stopPropagation()">
        <button class="btn btn-ghost btn-sm" onclick="dlXML(${b.id})">⬇ XML</button>
        <button class="btn btn-danger btn-sm" onclick="delBesuch(${b.id})">✕</button>
      </div>
    </div>`).join('') + '</div>';
}

function delBesuch(id) {
  if (!confirm('Bericht löschen?')) return;
  besuche = besuche.filter(b => b.id !== id);
  save(KEY_BESUCHE, besuche);
  toast('Bericht gelöscht');
  renderBesuche();
}

function detailBesuch(id) {
  const b = besuche.find(b => b.id === id);
  if (!b) return;
  document.getElementById('modal-body').innerHTML = `
    <h2 style="margin-bottom:.5rem">${x(b.kundenname)}</h2>
    <div class="dg">
      <div class="df"><label>Kundennr.</label><div class="val">${x(b.kundennr)||'–'}</div></div>
      <div class="df"><label>Datum</label><div class="val">${b.datum}</div></div>
      <div class="df"><label>Ansprechpartner</label><div class="val">${x(b.ansprechpartner)||'–'}</div></div>
      <div class="df"><label>Besuchsart</label><div class="val">${x(b.art)}</div></div>
      <div class="df full"><label>Betreff</label><div class="val">${x(b.betreff)||'–'}</div></div>
      <div class="df full"><label>Besuchsbericht</label><div class="val pre">${x(b.bericht)||'–'}</div></div>
      <div class="df full"><label>Ergebnis / Vereinbarungen</label><div class="val pre">${x(b.ergebnis)||'–'}</div></div>
      <div class="df full"><label>Nächste Schritte</label><div class="val pre">${x(b.naechste)||'–'}</div></div>
      <div class="df"><label>Benutzer</label><div class="val">${x(b.benutzer)||'–'}</div></div>
      <div class="df"><label>Erstellt</label><div class="val">${b.erstellt?.substring(0,16).replace('T',' ')||'–'}</div></div>
    </div>`;
  document.getElementById('modal-foot').innerHTML = `
    <button class="btn btn-ghost" onclick="closeModalDirect()">Schließen</button>
    <button class="btn btn-ghost" onclick="dlXML(${b.id})">⬇ BMD XML herunterladen</button>`;
  document.getElementById('modal').classList.add('open');
}

function dlXML(id) {
  const b = besuche.find(b => b.id === id);
  if (!b) return;
  dlBlob(buildXML([b]), `BMD_Aktivitaet_${id}.xml`, 'application/xml');
}

function exportAlleXML() {
  if (!besuche.length) { toast('Keine Berichte vorhanden', 'err'); return; }
  dlBlob(buildXML(besuche), 'BMD_Aktivitaeten_Alle.xml', 'application/xml');
}

function buildXML(list) {
  const esc = s => (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  const records = list.map(b => `
    <Datensatz>
      <Feld Name="KAKT_KDNR">${esc(b.kundennr)}</Feld>
      <Feld Name="KAKT_KDNAME">${esc(b.kundenname)}</Feld>
      <Feld Name="KAKT_DATUM">${esc(b.datum)}</Feld>
      <Feld Name="KAKT_ART">${esc(b.art)}</Feld>
      <Feld Name="KAKT_BETREFF">${esc(b.betreff)}</Feld>
      <Feld Name="KAKT_TEXT">${esc(b.bericht)}</Feld>
      <Feld Name="KAKT_ERGEBNIS">${esc(b.ergebnis)}</Feld>
      <Feld Name="KAKT_NAECHSTE_SCHRITTE">${esc(b.naechste)}</Feld>
      <Feld Name="KAKT_ANSPRECHPARTNER">${esc(b.ansprechpartner)}</Feld>
      <Feld Name="KAKT_BENUTZER">${esc(b.benutzer)}</Feld>
      <Feld Name="KAKT_ERSTELLTAM">${esc(b.erstellt)}</Feld>
    </Datensatz>`).join('');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<BMDXML Version="1.0" Erstellt="${new Date().toISOString()}">\n  <Tabelle Name="KAKTIVITAET">${records}\n  </Tabelle>\n</BMDXML>`;
}

function saveAnfrage() {
  const k = v('a_kundenname');
  if (!k) { toast('Bitte Kundenname eingeben', 'err'); return; }
  const rec = {
    id: nextId(anfragen),
    kundennr: v('a_kundennr'), kundenname: k, ansprechpartner: v('a_ansprechpartner'),
    zeitschiene: v('a_zeitschiene'), material: v('a_material'), menge: v('a_menge'),
    jahresmenge: v('a_jahresmenge'), qualitaet: v('a_qualitaet'),
    spezifikation: v('a_spezifikation'), masse: v('a_masse'),
    notizen: v('a_notizen'), benutzer: getUser(),
    status: 'Offen', erstellt: new Date().toISOString()
  };
  anfragen.unshift(rec);
  save(KEY_ANFRAGEN, anfragen);
  toast('Anfrage gespeichert', 'ok');
  resetAnfrage();
  renderAnfragen();
}

function resetAnfrage() {
  ['a_kundennr','a_kundenname','a_ansprechpartner','a_zeitschiene','a_material',
   'a_menge','a_jahresmenge','a_qualitaet','a_spezifikation','a_masse','a_notizen'].forEach(clear);
  document.getElementById('diktat-preview').textContent = '';
}

function renderAnfragen() {
  const q  = v('searchAnfragen').toLowerCase();
  const st = document.getElementById('filterStatus').value;
  let list = anfragen;
  if (q)  list = list.filter(a => [a.kundenname,a.material,a.ansprechpartner,a.kundennr].some(f=>(f||'').toLowerCase().includes(q)));
  if (st) list = list.filter(a => a.status === st);

  document.getElementById('anfragen-count').textContent = anfragen.length || '';
  const cont = document.getElementById('anfragen-list');

  if (!list.length) {
    cont.innerHTML = `<div class="empty">${q||st ? 'Keine Anfragen gefunden.' : 'Noch keine Anfragen gespeichert.'}</div>`;
    return;
  }

  const statusBadge = s => ({
    'Offen':           'b-blue',
    'In Bearbeitung':  'b-yellow',
    'Angebot erstellt':'b-orange',
    'Erledigt':        'b-green'
  }[s] || 'b-gray');

  cont.innerHTML = '<div class="list-wrap">' + list.map(a => `
    <div class="item is-anfrage${a.status==='Erledigt'?' done':''}" onclick="detailAnfrage(${a.id})">
      <div class="item-body">
        <div class="item-title">${x(a.kundenname)}${a.kundennr?` <span style="color:var(--muted);font-weight:400">(${x(a.kundennr)})</span>`:''}</div>
        <div class="item-meta">
          <span>📅 ${a.erstellt?.substring(0,10)||''}</span>
          ${a.material     ? `<span>🧱 ${x(a.material)}</span>`    : ''}
          ${a.menge        ? `<span>📦 ${x(a.menge)}</span>`       : ''}
          ${a.zeitschiene  ? `<span>⏱ ${x(a.zeitschiene)}</span>` : ''}
          ${a.ansprechpartner?`<span>👤 ${x(a.ansprechpartner)}</span>`:''}
          <span class="badge ${statusBadge(a.status)}">${a.status}</span>
        </div>
      </div>
      <div class="item-actions" onclick="event.stopPropagation()">
        <select class="status-sel" onchange="setStatus(${a.id},this.value)">
          ${['Offen','In Bearbeitung','Angebot erstellt','Erledigt'].map(s=>`<option${a.status===s?' selected':''}>${s}</option>`).join('')}
        </select>
        <button class="btn btn-danger btn-sm" onclick="delAnfrage(${a.id})">✕</button>
      </div>
    </div>`).join('') + '</div>';
}

function setStatus(id, status) {
  const a = anfragen.find(a => a.id === id);
  if (a) { a.status = status; save(KEY_ANFRAGEN, anfragen); renderAnfragen(); toast('Status aktualisiert'); }
}

function delAnfrage(id) {
  if (!confirm('Anfrage löschen?')) return;
  anfragen = anfragen.filter(a => a.id !== id);
  save(KEY_ANFRAGEN, anfragen);
  toast('Anfrage gelöscht');
  renderAnfragen();
}

function detailAnfrage(id) {
  const a = anfragen.find(a => a.id === id);
  if (!a) return;
  document.getElementById('modal-body').innerHTML = `
    <h2 style="margin-bottom:.5rem">Anfrage: ${x(a.kundenname)}</h2>
    <div class="dg">
      <div class="df"><label>Kundennr.</label><div class="val">${x(a.kundennr)||'–'}</div></div>
      <div class="df"><label>Datum</label><div class="val">${a.erstellt?.substring(0,10)||'–'}</div></div>
      <div class="df"><label>Ansprechpartner</label><div class="val">${x(a.ansprechpartner)||'–'}</div></div>
      <div class="df"><label>Zeitschiene</label><div class="val">${x(a.zeitschiene)||'–'}</div></div>
      <div class="df"><label>Material</label><div class="val">${x(a.material)||'–'}</div></div>
      <div class="df"><label>Menge</label><div class="val">${x(a.menge)||'–'}</div></div>
      <div class="df"><label>Jahresmenge</label><div class="val">${x(a.jahresmenge)||'–'}</div></div>
      <div class="df"><label>Qualität / Norm</label><div class="val">${x(a.qualitaet)||'–'}</div></div>
      <div class="df"><label>Spezifikation</label><div class="val">${x(a.spezifikation)||'–'}</div></div>
      <div class="df"><label>Maße</label><div class="val">${x(a.masse)||'–'}</div></div>
      <div class="df full"><label>Notizen</label><div class="val pre">${x(a.notizen)||'–'}</div></div>
      <div class="df"><label>Benutzer</label><div class="val">${x(a.benutzer)||'–'}</div></div>
      <div class="df"><label>Status</label><div class="val">${x(a.status)}</div></div>
    </div>`;
  document.getElementById('modal-foot').innerHTML = `
    <button class="btn btn-ghost" onclick="closeModalDirect()">Schließen</button>
    <button class="btn btn-ghost" onclick="exportExcel()">⬇ Excel exportieren</button>`;
  document.getElementById('modal').classList.add('open');
}

function exportExcel() {
  if (!anfragen.length) { toast('Keine Anfragen vorhanden', 'err'); return; }
  const rows = anfragen.map(a => ({
    'ID': a.id,
    'Datum': a.erstellt?.substring(0,10) || '',
    'Kundennr.': a.kundennr,
    'Kunde': a.kundenname,
    'Ansprechpartner': a.ansprechpartner,
    'Zeitschiene': a.zeitschiene,
    'Material': a.material,
    'Menge': a.menge,
    'Jahresmenge': a.jahresmenge,
    'Qualität': a.qualitaet,
    'Spezifikation': a.spezifikation,
    'Maße': a.masse,
    'Notizen': a.notizen,
    'Benutzer': a.benutzer,
    'Status': a.status
  }));
  const ws = XLSX.utils.json_to_sheet(rows);
  ws['!cols'] = [5,12,10,25,20,15,20,10,14,15,20,14,30,15,12].map(w => ({wch:w}));
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Anfragen');
  XLSX.writeFile(wb, `MVH_Anfragen_${todayISO()}.xlsx`);
}

function exportCSV() {
  if (!anfragen.length) { toast('Keine Anfragen vorhanden', 'err'); return; }
  const header = 'ID;Datum;Kundennr;Kunde;Ansprechpartner;Zeitschiene;Material;Menge;Jahresmenge;Qualität;Spezifikation;Maße;Notizen;Benutzer;Status';
  const rows = anfragen.map(a => [
    a.id, a.erstellt?.substring(0,10)||'', a.kundennr, a.kundenname, a.ansprechpartner,
    a.zeitschiene, a.material, a.menge, a.jahresmenge, a.qualitaet,
    a.spezifikation, a.masse, a.notizen, a.benutzer, a.status
  ].map(f => `"${(f||'').toString().replace(/"/g,'""')}"`).join(';'));
  dlBlob('﻿' + header + '\n' + rows.join('\n'), `MVH_Anfragen_${todayISO()}.csv`, 'text/csv;charset=utf-8');
}

function closeModal(e)  { if (e.target.id === 'modal') closeModalDirect(); }
function closeModalDirect() { document.getElementById('modal').classList.remove('open'); }

function v(id)     { return (document.getElementById(id)?.value || '').trim(); }
function clear(id) { const el = document.getElementById(id); if (el) el.value = ''; }
function x(s)      { return (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
function todayISO(){ return new Date().toISOString().split('T')[0]; }

function dlBlob(content, filename, type) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([content], {type}));
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}

renderBesuche();
renderAnfragen();