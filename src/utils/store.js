const PK = 'creb_properties';
const TK = 'creb_transactions';

// ── Properties ────────────────────────────────────────────────────────────────
export const getProperties  = () => { try { return JSON.parse(localStorage.getItem(PK) || '[]'); } catch { return []; } };
export const getProperty    = id => getProperties().find(p => p.id === id);
export const saveProperties = p  => localStorage.setItem(PK, JSON.stringify(p));

export function createProperty(data) {
  const list = getProperties();
  const p = {
    id: `prop_${Date.now()}`,
    ...data,
    status: 'active',
    createdAt: new Date().toISOString(),
    views: 0,
    inquiries: 0,
    featured: false,
  };
  saveProperties([...list, p]);
  return p;
}

export function updateProperty(id, updates) {
  const list = getProperties();
  const i = list.findIndex(p => p.id === id);
  if (i === -1) return null;
  list[i] = { ...list[i], ...updates };
  saveProperties(list);
  return list[i];
}

// ── Transactions ────────────────────────────────────────────────────────────
export const getTransactions = () => { try { return JSON.parse(localStorage.getItem(TK) || '[]'); } catch { return []; } };

export function createTransaction(data) {
  const txns = getTransactions();
  const isLease    = data.dealType === 'lease' || data.dealType === 'sale_leaseback';
  const isPurchase = data.dealType === 'purchase' || data.dealType === 'sale_leaseback' || data.dealType === 'land';

  const steps = [
    { key: 'loi',       label: 'LOI Submitted',           done: true,  date: new Date().toISOString() },
    { key: 'nda',       label: 'NDA Executed',             done: false, date: null },
    { key: 'dd',        label: 'Due Diligence',            done: false, date: null },
    { key: 'zoning',    label: 'Zoning Confirmed',         done: false, date: null },
    { key: 'docs',      label: 'Contracts Signed',         done: false, date: null },
    ...(isPurchase ? [{ key: 'financing', label: 'Financing / Escrow', done: false, date: null }] : []),
    ...(isLease    ? [{ key: 'landlord',  label: 'Landlord Approval',  done: false, date: null }] : []),
    { key: 'license',   label: 'Cannabis License Verified', done: false, date: null },
    { key: 'close',     label: 'Closed / Keys Transferred', done: false, date: null },
  ];

  const t = {
    id: `txn_${Date.now()}`,
    ...data,
    status: 'active',
    createdAt: new Date().toISOString(),
    steps,
  };
  localStorage.setItem(TK, JSON.stringify([...txns, t]));
  return t;
}

export function updateTransaction(id, updates) {
  const txns = getTransactions();
  const i = txns.findIndex(t => t.id === id);
  if (i === -1) return null;
  txns[i] = { ...txns[i], ...updates };
  localStorage.setItem(TK, JSON.stringify(txns));
  return txns[i];
}

// ── Reference data ────────────────────────────────────────────────────────────
export const DEAL_TYPES = [
  { value: 'lease',          label: 'Commercial Lease',    desc: 'Tenant leases the property for cannabis operations.' },
  { value: 'purchase',       label: 'Purchase & Sale',     desc: 'Buyer purchases the property outright.' },
  { value: 'sale_leaseback', label: 'Sale-Leaseback',      desc: 'Owner sells and simultaneously leases back from the buyer.' },
  { value: 'land',           label: 'Land / Development',  desc: 'Raw or entitled land for cannabis facility development.' },
];

export const PROPERTY_TYPES = [
  'Retail Dispensary — Built Out',
  'Retail Dispensary — Shell',
  'Indoor Cultivation Facility',
  'Greenhouse / Mixed Light Cultivation',
  'Outdoor Cultivation Land',
  'Manufacturing / Extraction Lab',
  'Distribution / Warehouse',
  'Testing Laboratory',
  'Microbusiness Facility',
  'Mixed-Use Cannabis Campus',
  'Cannabis Office / Admin Space',
  'Entitled Development Land',
  'Industrial — Cannabis Permitted',
  'Other',
];

export const ZONING_TYPES = [
  'Cannabis Overlay District',
  'Industrial — Cannabis Permitted',
  'Light Industrial (I-1)',
  'Heavy Industrial (I-2)',
  'Commercial — Cannabis CUP',
  'Agricultural — Cannabis Permitted',
  'Mixed-Use Cannabis Zone',
  'Special Use Permit Required',
  'Verify Locally',
];

export const US_STATES = [
  'Alaska','Arizona','California','Colorado','Connecticut','Delaware',
  'Florida','Hawaii','Illinois','Maine','Maryland','Massachusetts',
  'Michigan','Minnesota','Missouri','Montana','Nevada','New Jersey',
  'New Mexico','New York','Ohio','Oklahoma','Oregon','Pennsylvania',
  'Rhode Island','Vermont','Virginia','Washington','Washington D.C.',
];

// State cannabis real estate zoning notes
export const STATE_ZONING_NOTES = {
  'California': 'DCC requires a physical premises address before issuing most license types. Local CUP or zoning approval typically required before state application. Buffer zones from schools (600ft) and youth centers vary by city.',
  'Colorado':   'MED requires premises approval as part of licensing. Most municipalities require a local license before state approval. Buffer zones typically 1,000ft from schools.',
  'Washington': 'LCB requires premises approval before license issuance. 1,000ft buffer from schools, playgrounds, and arcades. Local government approval required in most jurisdictions.',
  'Oregon':     'OLCC requires a completed premises application with floor plan. 1,000ft from schools in most cities. Some rural counties allow closer proximity.',
  'Michigan':   'MRA requires municipality to opt-in to cannabis. All new premises require local approval and MRA inspection before operations begin.',
  'Illinois':   'IDFPR requires premises to meet 1,500ft distance from schools. Municipalities can set stricter rules. Chicago has specific zoning overlay maps.',
  'Nevada':     'CCB requires premises approval as part of the licensing application. Clark County (Las Vegas) and other jurisdictions have specific cannabis zoning maps.',
  'Florida':    'MMTC premises must be approved by OMMU. Dispensaries require local government approval. Buffer zones vary by municipality (typically 500–1,000ft from schools).',
  'New York':   'OCM issues premises approvals. Host Community Agreements required with the municipality. NYC has specific borough-level zoning for cannabis retail.',
  'New Jersey': 'CRC requires local municipality to approve cannabis before state licensing. Municipalities can ban cannabis — verify local ordinances before proceeding.',
  'Massachusetts': 'CCC requires a Host Community Agreement (HCA) with the city/town before licensing. HCAs must be negotiated directly with the municipality.',
  'Arizona':    'ADHS requires premises to meet local zoning. Most cities require a separate local cannabis business license. Buffer zones typically 500–1,000ft from schools.',
};

export const fmt = n =>
  n != null
    ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(n)
    : '—';

export const fmtSqft = n =>
  n ? new Intl.NumberFormat('en-US').format(n) + ' sqft' : '—';
