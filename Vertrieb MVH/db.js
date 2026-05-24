const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'mvh_vertrieb.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS besuche (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    kundennr TEXT,
    kundenname TEXT NOT NULL,
    ansprechpartner TEXT,
    datum TEXT NOT NULL,
    art TEXT DEFAULT 'Besuch',
    betreff TEXT,
    bericht TEXT,
    ergebnis TEXT,
    naechste_schritte TEXT,
    benutzer TEXT,
    erstellt_am TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS anfragen (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    kundennr TEXT,
    kundenname TEXT NOT NULL,
    ansprechpartner TEXT,
    zeitschiene TEXT,
    material TEXT,
    menge TEXT,
    jahresmenge TEXT,
    qualitaet TEXT,
    spezifikation TEXT,
    masse TEXT,
    notizen TEXT,
    benutzer TEXT,
    status TEXT DEFAULT 'Offen',
    erstellt_am TEXT DEFAULT (datetime('now'))
  );
`);

module.exports = db;
