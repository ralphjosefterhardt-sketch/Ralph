// Mock data für ServicePortal
// Maschinen von Matco und Minipack

const MACHINES = [
  {
    id: 1,
    name: 'Matco Schrumpftunnel ST-600',
    type: 'Schrumpfanlage',
    serialNumber: 'MAT-ST600-2021-0047',
    customer: {
      name: 'Lebensmittel Gruber GmbH',
      address: 'Gewerbepark 14, 84030 Ergolding',
    },
    installationDate: '2021-04-12',
    warrantyUntil: '2026-04-12',
    lastService: '2025-10-08',
    status: 'ok',
    image: null,
  },
  {
    id: 2,
    name: 'Matco Banderoliermaschine BM-300',
    type: 'Banderoliermaschine',
    serialNumber: 'MAT-BM300-2020-0023',
    customer: {
      name: 'Druckerei Steinbach KG',
      address: 'Industriestraße 5, 90765 Fürth',
    },
    installationDate: '2020-09-01',
    warrantyUntil: '2025-09-01',
    lastService: '2025-05-20',
    status: 'wartung',
    image: null,
  },
  {
    id: 3,
    name: 'Matco Traysealer TS-450',
    type: 'Traysealer',
    serialNumber: 'MAT-TS450-2023-0091',
    customer: {
      name: 'Feinkost Alpenblick AG',
      address: 'Brunnstraße 3, 83022 Rosenheim',
    },
    installationDate: '2023-02-20',
    warrantyUntil: '2028-02-20',
    lastService: '2026-01-15',
    status: 'ok',
    image: null,
  },
  {
    id: 4,
    name: 'Minipack FM76 Infinity',
    type: 'Schrumpfmaschine',
    serialNumber: 'MNP-FM76-2019-0158',
    customer: {
      name: 'Logistik & Versand Huber OHG',
      address: 'Lagerring 22, 85716 Unterschleißheim',
    },
    installationDate: '2019-11-05',
    warrantyUntil: '2024-11-05',
    lastService: '2025-03-30',
    status: 'stoerung',
    image: null,
  },
  {
    id: 5,
    name: 'Minipack MVS 45X',
    type: 'Vakuumiermaschine',
    serialNumber: 'MNP-MVS45-2022-0334',
    customer: {
      name: 'Metzgerei Brandl GmbH & Co. KG',
      address: 'Marktplatz 8, 93413 Cham',
    },
    installationDate: '2022-06-14',
    warrantyUntil: '2027-06-14',
    lastService: '2025-11-04',
    status: 'ok',
    image: null,
  },
  {
    id: 6,
    name: 'Minipack Torre MV31',
    type: 'Schrumpfmaschine',
    serialNumber: 'MNP-MV31-2024-0012',
    customer: {
      name: 'Pharma Verpackung Reiter GmbH',
      address: 'Innovationsstraße 17, 82008 Unterhaching',
    },
    installationDate: '2024-03-10',
    warrantyUntil: '2029-03-10',
    lastService: '2025-09-22',
    status: 'wartung',
    image: null,
  },
];

const SERVICE_HISTORY = {
  1: [
    {
      id: 101,
      date: '2025-10-08',
      technician: 'Max Mustermann',
      type: 'Wartung',
      description: 'Jahreswartung Schrumpftunnel: Heizelemente geprüft, Förderband gereinigt und nachgespannt, Temperaturregler kalibriert.',
    },
    {
      id: 102,
      date: '2025-04-14',
      technician: 'Klaus Weber',
      type: 'Inspektion',
      description: 'Halbjahreskontrolle: Sicherheitsabschaltung getestet, Schrumpffolienlauf kontrolliert, Lager geschmiert.',
    },
    {
      id: 103,
      date: '2024-10-02',
      technician: 'Max Mustermann',
      type: 'Ersatzteilwechsel',
      description: 'Heizstab Zone 2 defekt – Ersatzteil eingebaut, Einlauftemperatur neu eingestellt.',
    },
    {
      id: 104,
      date: '2024-04-09',
      technician: 'Klaus Weber',
      type: 'Wartung',
      description: 'Förderkettenspannung geprüft, Gebäsemotor gereinigt, Steuerung auf aktuellem Softwarestand.',
    },
  ],
  2: [
    {
      id: 201,
      date: '2025-05-20',
      technician: 'Klaus Weber',
      type: 'Inspektion',
      description: 'Banderolierkopf auf Verschleiß geprüft, Andruckrollen justiert, Klebesystem gereinigt.',
    },
    {
      id: 202,
      date: '2024-11-18',
      technician: 'Max Mustermann',
      type: 'Wartung',
      description: 'Jahreswartung: Messer gewechselt, Antriebsriemen kontrolliert, Pneumatikzylinder gefettet.',
    },
    {
      id: 203,
      date: '2024-05-06',
      technician: 'Klaus Weber',
      type: 'Reparatur',
      description: 'Schneidmesserhalter gebrochen, Ersatzteil eingebaut, Schnittqualität wieder einwandfrei.',
    },
  ],
  3: [
    {
      id: 301,
      date: '2026-01-15',
      technician: 'Max Mustermann',
      type: 'Wartung',
      description: 'Siegelwerkzeug gereinigt und auf Beschädigungen geprüft, Folienvorschub justiert, Druckluftfilter gewechselt.',
    },
    {
      id: 302,
      date: '2025-07-22',
      technician: 'Klaus Weber',
      type: 'Inspektion',
      description: 'Halbjahreskontrolle: Siegeltemperatur geprüft, Hubzylinder kontrolliert, Schutzgitter getestet.',
    },
    {
      id: 303,
      date: '2025-01-30',
      technician: 'Max Mustermann',
      type: 'Softwareupdate',
      description: 'Steuerung auf Firmware 3.1.4 aktualisiert, neue Rezepturen für Schalenschließung eingespielt.',
    },
  ],
  4: [
    {
      id: 401,
      date: '2025-03-30',
      technician: 'Klaus Weber',
      type: 'Reparatur',
      description: 'Schweißbalken defekt – Teflonband und Heizdraht erneuert. Maschine nach Reparatur wieder in Betrieb genommen.',
    },
    {
      id: 402,
      date: '2024-09-11',
      technician: 'Max Mustermann',
      type: 'Wartung',
      description: 'Jahreswartung FM76: Schweißbalken gereinigt, Folienführung justiert, Sicherheitsschalter geprüft.',
    },
    {
      id: 403,
      date: '2024-03-05',
      technician: 'Klaus Weber',
      type: 'Inspektion',
      description: 'Folienvorrat und Transportband kontrolliert, Schweißtemperatur gemessen, Protokoll erstellt.',
    },
    {
      id: 404,
      date: '2023-09-19',
      technician: 'Max Mustermann',
      type: 'Ersatzteilwechsel',
      description: 'Antriebsriemen Folienabwicklung gerissen, Ersatzriemen montiert, Spannung eingestellt.',
    },
  ],
  5: [
    {
      id: 501,
      date: '2025-11-04',
      technician: 'Max Mustermann',
      type: 'Wartung',
      description: 'Jahreswartung MVS 45X: Vakuumpumpenöl gewechselt, Dichtungsrahmen geprüft, Schweißstab kontrolliert.',
    },
    {
      id: 502,
      date: '2025-05-13',
      technician: 'Klaus Weber',
      type: 'Inspektion',
      description: 'Vakuumdruckmessung, Sichtprüfung Schweißnaht, Deckelfolie und Dichtlippe auf Verschleiß kontrolliert.',
    },
    {
      id: 503,
      date: '2024-11-20',
      technician: 'Max Mustermann',
      type: 'Ersatzteilwechsel',
      description: 'Dichtungsrahmen (Oberteil) porös, Austausch durchgeführt. Vakuumtest nach Einbau bestanden.',
    },
  ],
  6: [
    {
      id: 601,
      date: '2025-09-22',
      technician: 'Klaus Weber',
      type: 'Inspektion',
      description: 'Erstinspektion nach Ablauf der Eingewöhnungsphase: Folienführung, Schweißbalken und Temperaturregelung geprüft.',
    },
    {
      id: 602,
      date: '2025-03-10',
      technician: 'Max Mustermann',
      type: 'Einweisung',
      description: 'Inbetriebnahme und Einweisung der Bedienmannschaft in Betrieb, Folieneinlauf und tägliche Reinigung.',
    },
  ],
};

// Maschinentyp-Farben
const TYPE_COLORS = {
  'Schrumpfanlage':       { bg: '#dbeafe', color: '#1e40af' },
  'Banderoliermaschine':  { bg: '#fce7f3', color: '#9d174d' },
  'Traysealer':           { bg: '#d1fae5', color: '#065f46' },
  'Schrumpfmaschine':     { bg: '#ede9fe', color: '#5b21b6' },
  'Vakuumiermaschine':    { bg: '#fef3c7', color: '#92400e' },
};

// Statusanzeige
const STATUS_CONFIG = {
  ok:       { color: '#16a34a', label: 'OK' },
  wartung:  { color: '#ca8a04', label: 'Wartung fällig' },
  stoerung: { color: '#dc2626', label: 'Störung' },
};

function getMachineById(id) {
  return MACHINES.find(m => m.id === parseInt(id, 10)) || null;
}

function getServiceHistory(machineId) {
  return SERVICE_HISTORY[parseInt(machineId, 10)] || [];
}
