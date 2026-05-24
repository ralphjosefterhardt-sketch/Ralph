const express = require('express');
const path = require('path');
const XLSX = require('xlsx');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ─── Besuchsberichte ───────────────────────────────────────────────────────

app.post('/api/besuche', (req, res) => {
  const { kundennr, kundenname, ansprechpartner, datum, art, betreff, bericht, ergebnis, naechste_schritte, benutzer } = req.body;
  if (!kundenname || !datum) return res.status(400).json({ error: 'Kundenname und Datum sind Pflichtfelder' });
  const stmt = db.prepare(`
    INSERT INTO besuche (kundennr, kundenname, ansprechpartner, datum, art, betreff, bericht, ergebnis, naechste_schritte, benutzer)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const result = stmt.run(kundennr || '', kundenname, ansprechpartner || '', datum, art || 'Besuch', betreff || '', bericht || '', ergebnis || '', naechste_schritte || '', benutzer || '');
  res.json({ id: result.lastInsertRowid, success: true });
});

app.get('/api/besuche', (req, res) => {
  const rows = db.prepare('SELECT * FROM besuche ORDER BY datum DESC, erstellt_am DESC').all();
  res.json(rows);
});

app.delete('/api/besuche/:id', (req, res) => {
  db.prepare('DELETE FROM besuche WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

app.get('/api/besuche/:id/xml', (req, res) => {
  const besuch = db.prepare('SELECT * FROM besuche WHERE id = ?').get(req.params.id);
  if (!besuch) return res.status(404).json({ error: 'Nicht gefunden' });
  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="BMD_Aktivitaet_${besuch.id}.xml"`);
  res.send(buildBMDXML([besuch]));
});

app.get('/api/besuche/export/xml', (req, res) => {
  const rows = db.prepare('SELECT * FROM besuche ORDER BY datum DESC').all();
  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="BMD_Aktivitaeten_Alle.xml"');
  res.send(buildBMDXML(rows));
});

// ─── Anfragen ──────────────────────────────────────────────────────────────

app.post('/api/anfragen', (req, res) => {
  const { kundennr, kundenname, ansprechpartner, zeitschiene, material, menge, jahresmenge, qualitaet, spezifikation, masse, notizen, benutzer } = req.body;
  if (!kundenname) return res.status(400).json({ error: 'Kundenname ist Pflichtfeld' });
  const stmt = db.prepare(`
    INSERT INTO anfragen (kundennr, kundenname, ansprechpartner, zeitschiene, material, menge, jahresmenge, qualitaet, spezifikation, masse, notizen, benutzer)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const result = stmt.run(kundennr || '', kundenname, ansprechpartner || '', zeitschiene || '', material || '', menge || '', jahresmenge || '', qualitaet || '', spezifikation || '', masse || '', notizen || '', benutzer || '');
  res.json({ id: result.lastInsertRowid, success: true });
});

app.get('/api/anfragen', (req, res) => {
  const rows = db.prepare('SELECT * FROM anfragen ORDER BY erstellt_am DESC').all();
  res.json(rows);
});

app.patch('/api/anfragen/:id/status', (req, res) => {
  const { status } = req.body;
  db.prepare('UPDATE anfragen SET status = ? WHERE id = ?').run(status, req.params.id);
  res.json({ success: true });
});

app.delete('/api/anfragen/:id', (req, res) => {
  db.prepare('DELETE FROM anfragen WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

app.get('/api/anfragen/export/excel', (req, res) => {
  const rows = db.prepare('SELECT * FROM anfragen ORDER BY erstellt_am DESC').all();
  const data = rows.map(r => ({
    'ID': r.id,
    'Datum': r.erstellt_am ? r.erstellt_am.substring(0, 10) : '',
    'Kundennr.': r.kundennr,
    'Kunde': r.kundenname,
    'Ansprechpartner': r.ansprechpartner,
    'Zeitschiene': r.zeitschiene,
    'Material': r.material,
    'Menge': r.menge,
    'Jahresmenge': r.jahresmenge,
    'Qualität': r.qualitaet,
    'Spezifikation': r.spezifikation,
    'Maße': r.masse,
    'Notizen': r.notizen,
    'Benutzer': r.benutzer,
    'Status': r.status
  }));
  const ws = XLSX.utils.json_to_sheet(data);
  ws['!cols'] = [
    {wch:6},{wch:12},{wch:10},{wch:25},{wch:20},{wch:15},{wch:20},{wch:10},
    {wch:12},{wch:15},{wch:25},{wch:15},{wch:30},{wch:15},{wch:10}
  ];
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Anfragen');
  const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', 'attachment; filename="MVH_Anfragen.xlsx"');
  res.send(buf);
});

app.get('/api/anfragen/export/csv', (req, res) => {
  const rows = db.prepare('SELECT * FROM anfragen ORDER BY erstellt_am DESC').all();
  const header = 'ID;Datum;Kundennr;Kunde;Ansprechpartner;Zeitschiene;Material;Menge;Jahresmenge;Qualität;Spezifikation;Maße;Notizen;Benutzer;Status\n';
  const lines = rows.map(r => [
    r.id, r.erstellt_am?.substring(0,10), r.kundennr, r.kundenname, r.ansprechpartner,
    r.zeitschiene, r.material, r.menge, r.jahresmenge, r.qualitaet,
    r.spezifikation, r.masse, r.notizen, r.benutzer, r.status
  ].map(v => `"${(v||'').toString().replace(/"/g,'""')}"`).join(';')).join('\n');
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="MVH_Anfragen.csv"');
  res.send('﻿' + header + lines);
});

// ─── BMD XML Builder ───────────────────────────────────────────────────────

function esc(str) {
  return (str || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function buildBMDXML(besuche) {
  const records = besuche.map(b => `
    <Datensatz>
      <Feld Name="KAKT_KDNR">${esc(b.kundennr)}</Feld>
      <Feld Name="KAKT_KDNAME">${esc(b.kundenname)}</Feld>
      <Feld Name="KAKT_DATUM">${esc(b.datum)}</Feld>
      <Feld Name="KAKT_ART">${esc(b.art)}</Feld>
      <Feld Name="KAKT_BETREFF">${esc(b.betreff)}</Feld>
      <Feld Name="KAKT_TEXT">${esc(b.bericht)}</Feld>
      <Feld Name="KAKT_ERGEBNIS">${esc(b.ergebnis)}</Feld>
      <Feld Name="KAKT_NAECHSTE_SCHRITTE">${esc(b.naechste_schritte)}</Feld>
      <Feld Name="KAKT_ANSPRECHPARTNER">${esc(b.ansprechpartner)}</Feld>
      <Feld Name="KAKT_BENUTZER">${esc(b.benutzer)}</Feld>
      <Feld Name="KAKT_ERSTELLTAM">${esc(b.erstellt_am)}</Feld>
    </Datensatz>`).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<BMDXML Version="1.0" Erstellt="${new Date().toISOString()}">
  <Tabelle Name="KAKTIVITAET">${records}
  </Tabelle>
</BMDXML>`;
}

app.listen(PORT, () => {
  console.log(`MVH Vertrieb Tool läuft auf http://localhost:${PORT}`);
});
