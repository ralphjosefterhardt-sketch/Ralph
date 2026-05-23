// Mock data for ServicePortal
// Machines, customers, and service history

const MACHINES = [
  {
    id: 1,
    name: 'CNC-Fräsmaschine Alpha',
    type: 'CNC-Fräse',
    serialNumber: 'CNC-2019-00142',
    customer: {
      name: 'Metallbau Huber GmbH',
      address: 'Industriestraße 12, 85049 Ingolstadt',
    },
    installationDate: '2019-03-15',
    warrantyUntil: '2024-03-15',
    lastService: '2025-11-20',
    status: 'ok',
    image: null,
  },
  {
    id: 2,
    name: 'Schweißanlage Pro 3000',
    type: 'Schweißanlage',
    serialNumber: 'SW-2021-00891',
    customer: {
      name: 'Fahrzeugbau Steinmann AG',
      address: 'Hauptstraße 77, 70173 Stuttgart',
    },
    installationDate: '2021-07-01',
    warrantyUntil: '2026-07-01',
    lastService: '2025-08-14',
    status: 'wartung',
    image: null,
  },
  {
    id: 3,
    name: 'Roboterarm RA-500',
    type: 'Roboterarm',
    serialNumber: 'RA-2020-00357',
    customer: {
      name: 'Automationslösungen Koch KG',
      address: 'Technologiepark 3, 80993 München',
    },
    installationDate: '2020-11-10',
    warrantyUntil: '2025-11-10',
    lastService: '2026-01-08',
    status: 'ok',
    image: null,
  },
  {
    id: 4,
    name: 'Hydraulikpresse HP-200',
    type: 'Presse',
    serialNumber: 'HP-2018-00215',
    customer: {
      name: 'Stanzwerk Bauer OHG',
      address: 'Gewerbegebiet Nord 5, 90459 Nürnberg',
    },
    installationDate: '2018-06-20',
    warrantyUntil: '2023-06-20',
    lastService: '2025-04-30',
    status: 'stoerung',
    image: null,
  },
  {
    id: 5,
    name: 'Förderband FB-X1',
    type: 'Förderband',
    serialNumber: 'FB-2022-01044',
    customer: {
      name: 'Logistikzentrum Riedl GmbH',
      address: 'Lagerstraße 22, 04347 Leipzig',
    },
    installationDate: '2022-02-28',
    warrantyUntil: '2027-02-28',
    lastService: '2026-03-01',
    status: 'ok',
    image: null,
  },
  {
    id: 6,
    name: 'Kompressor KP-750',
    type: 'Kompressor',
    serialNumber: 'KP-2023-00788',
    customer: {
      name: 'Karosseriebau Wenzel GmbH & Co. KG',
      address: 'Ringstraße 8, 76131 Karlsruhe',
    },
    installationDate: '2023-09-05',
    warrantyUntil: '2028-09-05',
    lastService: '2025-12-10',
    status: 'wartung',
    image: null,
  },
];

const SERVICE_HISTORY = {
  1: [
    {
      id: 101,
      date: '2025-11-20',
      technician: 'Max Mustermann',
      type: 'Wartung',
      description: 'Jahreswartung durchgeführt, Schmierung aller Achsen, Filter gewechselt.',
    },
    {
      id: 102,
      date: '2025-04-10',
      technician: 'Klaus Weber',
      type: 'Inspektion',
      description: 'Sichtprüfung und Funktionstest aller Sicherheitseinrichtungen.',
    },
    {
      id: 103,
      date: '2024-11-15',
      technician: 'Max Mustermann',
      type: 'Reparatur',
      description: 'Spindelantrieb X-Achse getauscht, Kalibrierung durchgeführt.',
    },
    {
      id: 104,
      date: '2024-03-22',
      technician: 'Klaus Weber',
      type: 'Softwareupdate',
      description: 'Steuerungssoftware auf Version 4.2.1 aktualisiert.',
    },
  ],
  2: [
    {
      id: 201,
      date: '2025-08-14',
      technician: 'Klaus Weber',
      type: 'Inspektion',
      description: 'Halbjahreskontrolle, Brennerdüsen gereinigt, Kühlwasser geprüft.',
    },
    {
      id: 202,
      date: '2025-02-05',
      technician: 'Max Mustermann',
      type: 'Wartung',
      description: 'Wartungsintervall: Drahtvorschub justiert, Schweißparameter überprüft.',
    },
    {
      id: 203,
      date: '2024-08-19',
      technician: 'Klaus Weber',
      type: 'Ersatzteilwechsel',
      description: 'Verschleißteile Brenner getauscht: Kontaktrohr, Gasdüse, Stromdüse.',
    },
  ],
  3: [
    {
      id: 301,
      date: '2026-01-08',
      technician: 'Max Mustermann',
      type: 'Wartung',
      description: 'Getriebeöl gewechselt, Encoderkalibrierung, Bremsentest aller Achsen.',
    },
    {
      id: 302,
      date: '2025-07-14',
      technician: 'Max Mustermann',
      type: 'Softwareupdate',
      description: 'Robotersteuerung auf Firmware 6.1.3 aktualisiert, Teach-In neu eingelernt.',
    },
    {
      id: 303,
      date: '2025-01-20',
      technician: 'Klaus Weber',
      type: 'Inspektion',
      description: 'Sicherheitscheck Arbeitsraumüberwachung, Notaus-Funktion geprüft.',
    },
  ],
  4: [
    {
      id: 401,
      date: '2025-04-30',
      technician: 'Klaus Weber',
      type: 'Reparatur',
      description: 'Hydraulikdichtungen am Hauptzylinder erneuert, Leckage beseitigt.',
    },
    {
      id: 402,
      date: '2024-10-11',
      technician: 'Max Mustermann',
      type: 'Wartung',
      description: 'Hydrauliköl gewechselt, Filter getauscht, Druckventile eingestellt.',
    },
    {
      id: 403,
      date: '2024-04-18',
      technician: 'Klaus Weber',
      type: 'Inspektion',
      description: 'Jahresinspektion gemäß UVV, Überdruckventil geprüft, Protokoll erstellt.',
    },
    {
      id: 404,
      date: '2023-10-05',
      technician: 'Max Mustermann',
      type: 'Reparatur',
      description: 'Steuerplatine Drucküberwachung defekt, Ersatzteil eingebaut.',
    },
  ],
  5: [
    {
      id: 501,
      date: '2026-03-01',
      technician: 'Max Mustermann',
      type: 'Wartung',
      description: 'Antriebsriemen geprüft und nachgespannt, Laufrollen geschmiert.',
    },
    {
      id: 502,
      date: '2025-09-10',
      technician: 'Klaus Weber',
      type: 'Inspektion',
      description: 'Halbjahreskontrolle: Sensorik, Notstop, Bandausrichtung geprüft.',
    },
    {
      id: 503,
      date: '2025-03-15',
      technician: 'Max Mustermann',
      type: 'Ersatzteilwechsel',
      description: 'Umlenkrolle linksseitig getauscht, Ausrichtung neu eingestellt.',
    },
  ],
  6: [
    {
      id: 601,
      date: '2025-12-10',
      technician: 'Klaus Weber',
      type: 'Wartung',
      description: 'Luftfilter getauscht, Ölstand geprüft, Kondenswasserventil gereinigt.',
    },
    {
      id: 602,
      date: '2025-06-22',
      technician: 'Max Mustermann',
      type: 'Inspektion',
      description: 'Druckregler und Sicherheitsventile auf korrekte Funktion geprüft.',
    },
    {
      id: 603,
      date: '2024-12-15',
      technician: 'Klaus Weber',
      type: 'Einweisung',
      description: 'Einweisung neuer Mitarbeiter in Betrieb und Wartung des Kompressors.',
    },
  ],
};

// Type badge colors mapping
const TYPE_COLORS = {
  'CNC-Fräse':    { bg: '#dbeafe', color: '#1e40af' },
  'Schweißanlage':{ bg: '#fce7f3', color: '#9d174d' },
  'Roboterarm':   { bg: '#ede9fe', color: '#5b21b6' },
  'Presse':       { bg: '#fef3c7', color: '#92400e' },
  'Förderband':   { bg: '#d1fae5', color: '#065f46' },
  'Kompressor':   { bg: '#ffedd5', color: '#c2410c' },
};

// Status config
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
