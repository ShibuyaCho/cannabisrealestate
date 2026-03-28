import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Plus, Building2, FileText, TrendingUp, Eye, CheckCircle,
  ArrowRight, Download, X, Save, Key, Clock, Shield
} from 'lucide-react';
import {
  getProperties, getTransactions, createProperty, updateProperty,
  DEAL_TYPES, PROPERTY_TYPES, ZONING_TYPES, US_STATES, STATE_ZONING_NOTES,
  fmt, fmtSqft
} from '../utils/store';
import { dlDoc, genNDA, genLOI, genLease, genPSA, genSaleLeaseback } from '../utils/documents';

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
export function DashboardPage() {
  const { user } = useAuth();
  const myProps = getProperties().filter(p => p.ownerId === user?.id);
  const txns    = getTransactions().filter(t => t.userId === user?.id || t.ownerId === user?.id);

  return (
    <div style={{ padding: '36px 0' }}>
      <div className="container">
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 30, color: 'var(--cream)', marginBottom: 4 }}>Dashboard</h1>
          <p style={{ color: 'var(--text-3)', fontSize: 13 }}>Welcome back, {user?.firstName}</p>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(155px, 1fr))', gap: 14, marginBottom: 28 }}>
          {[
            { l: 'My Listings', v: myProps.length, icon: <Building2 size={16}/> },
            { l: 'Active Deals', v: txns.filter(t => t.status !== 'closed').length, icon: <TrendingUp size={16}/> },
            { l: 'Closed', v: txns.filter(t => t.status === 'closed').length, icon: <CheckCircle size={16}/> },
            { l: 'Total Views', v: myProps.reduce((s,p) => s+(p.views||0), 0), icon: <Eye size={16}/> },
          ].map(s => (
            <div key={s.l} className="card" style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <div style={{ color: 'var(--green-lt)' }}>{s.icon}</div>
              <div>
                <div style={{ fontFamily: 'DM Serif Display', fontSize: 26, color: 'var(--cream)', lineHeight: 1 }}>{s.v}</div>
                <div style={{ fontSize: 11, color: 'var(--text-3)', fontFamily: 'Geist Mono', textTransform: 'uppercase', letterSpacing: '0.4px' }}>{s.l}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 28 }}>
          {[
            { to: '/list', icon: <Plus size={18}/>, t: 'List a Property', sub: 'Add a cannabis-compliant property', color: 'var(--green-faint)', ic: 'var(--green-lt)' },
            { to: '/properties', icon: <Eye size={18}/>, t: 'Browse Properties', sub: 'Find space for your cannabis operation', color: 'var(--amber-dim)', ic: 'var(--amber-lt)' },
          ].map(a => (
            <Link key={a.to} to={a.to} className="card" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 14, padding: 18, transition: 'all 0.2s', cursor: 'pointer' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-lt)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}>
              <div style={{ width: 42, height: 42, background: a.color, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: a.ic, flexShrink: 0 }}>{a.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, marginBottom: 2, color: 'var(--cream)', fontSize: 14 }}>{a.t}</div>
                <div style={{ fontSize: 12, color: 'var(--text-3)' }}>{a.sub}</div>
              </div>
              <ArrowRight size={14} style={{ color: 'var(--text-3)' }}/>
            </Link>
          ))}
        </div>

        {/* My Listings */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <h2 style={{ fontSize: 20, color: 'var(--cream)' }}>My Listings</h2>
            <Link to="/list" className="btn btn-primary btn-sm"><Plus size={13}/> New Listing</Link>
          </div>
          {myProps.length === 0 ? (
            <div className="empty-state" style={{ padding: 40 }}>
              <div className="empty-state-icon"><Building2 size={38}/></div>
              <h3>No listings yet</h3>
              <p>List a cannabis-compliant property to reach qualified operators</p>
              <Link to="/list" className="btn btn-primary btn-sm" style={{ marginTop: 4 }}><Plus size={13}/> Create Listing</Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {myProps.map(p => (
                <div key={p.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 16, flexWrap: 'wrap', gap: 10 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, marginBottom: 3, color: 'var(--cream)', fontSize: 14 }}>{p.title}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-3)', fontFamily: 'Geist Mono' }}>{p.city}, {p.state} · {fmtSqft(p.sqft)} · {p.views||0} views</div>
                  </div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <span className={`badge ${p.status==='active'?'badge-green':p.status==='pending'?'badge-amber':'badge-gray'}`}>{p.status}</span>
                    <span style={{ fontFamily: 'DM Serif Display', color: 'var(--green-lt)', fontSize: 16 }}>
                      {p.dealType === 'lease' || p.dealType === 'sale_leaseback' ? fmt(p.monthlyRent)+'/mo' : fmt(p.askingPrice)}
                    </span>
                    <Link to={`/properties/${p.id}`} className="btn btn-secondary btn-sm">View</Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Transactions */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <h2 style={{ fontSize: 20, color: 'var(--cream)' }}>Recent Transactions</h2>
            <Link to="/transactions" className="btn btn-secondary btn-sm">View All</Link>
          </div>
          {txns.length === 0 ? (
            <div className="empty-state" style={{ padding: 32 }}>
              <div className="empty-state-icon"><FileText size={36}/></div>
              <h3>No transactions yet</h3>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {txns.slice(0,4).map(t => <TxnRow key={t.id} txn={t}/>)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function TxnRow({ txn }) {
  const done = txn.steps?.filter(s => s.done).length || 0;
  const pct  = Math.round((done / (txn.steps?.length || 8)) * 100);
  return (
    <div className="card" style={{ padding: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, flexWrap: 'wrap', gap: 6 }}>
        <div>
          <div style={{ fontWeight: 600, fontSize: 13.5, color: 'var(--cream)', marginBottom: 2 }}>{txn.property?.title || 'Transaction'}</div>
          <div style={{ fontSize: 11, color: 'var(--text-3)', fontFamily: 'Geist Mono' }}>{txn.id}</div>
        </div>
        <span className="badge badge-green">{pct}% complete</span>
      </div>
      <div style={{ height: 3, background: 'var(--char-3)', borderRadius: 2, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: 'var(--green)', borderRadius: 2, transition: 'width 0.5s' }}/>
      </div>
    </div>
  );
}

// ─── LIST PROPERTY ────────────────────────────────────────────────────────────
export function ListPropertyPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    title: '', propertyType: '', dealType: 'lease',
    address: '', city: '', state: '', county: '', zip: '',
    sqft: '', yearBuilt: '', zoning: '', cannabisZoned: false,
    existingLicense: false, existingLicenseType: '',
    askingPrice: '', monthlyRent: '', leaseTermYears: '5',
    capRate: '', noi: '', description: '', features: [],
  });
  const [loading, setLoading] = useState(false);
  const s = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const FEATS = ['Built-Out Cannabis Space','Drive-Through Window','Vault / Safe Room','Security Infrastructure','3-Phase Power','Commercial HVAC','Loading Dock','ADA Compliant','High Foot Traffic','Corner Location','Freestanding Building','Greenhouse Included','Outdoor Canopy Area','Lab / Clean Room'];

  const submit = () => {
    setLoading(true);
    setTimeout(() => {
      createProperty({
        ...form,
        ownerId: user.id,
        brokerName: user.businessName || `${user.firstName} ${user.lastName}`,
        brokerLicense: user.brokerLicense || '',
        brokerEmail: user.email,
        askingPrice: Number(form.askingPrice) || null,
        monthlyRent: Number(form.monthlyRent) || null,
        sqft: Number(form.sqft) || null,
        leaseTermYears: Number(form.leaseTermYears) || null,
        capRate: Number(form.capRate) || null,
        noi: Number(form.noi) || null,
      });
      setLoading(false);
      navigate('/dashboard');
    }, 800);
  };

  const isLease  = form.dealType === 'lease';
  const isPurch  = form.dealType === 'purchase';
  const isSLB    = form.dealType === 'sale_leaseback';
  const isLand   = form.dealType === 'land';
  const zoningNote = form.state ? STATE_ZONING_NOTES[form.state] : null;

  return (
    <div style={{ padding: '36px 0' }}>
      <div className="container" style={{ maxWidth: 720 }}>
        <h1 style={{ fontSize: 30, color: 'var(--cream)', marginBottom: 6 }}>List a Property</h1>
        <p style={{ color: 'var(--text-3)', fontSize: 13, marginBottom: 28 }}>Step {step} of 3</p>

        <div style={{ display: 'flex', gap: 8, marginBottom: 30 }}>
          {['Property Info', 'Deal & Financials', 'Description'].map((l, i) => (
            <div key={l} style={{ flex: 1 }}>
              <div style={{ height: 3, borderRadius: 2, background: step > i || step === i+1 ? 'var(--green)' : 'var(--border)', marginBottom: 5, transition: 'background 0.3s' }}/>
              <div style={{ fontSize: 11, color: step===i+1?'var(--green-lt)':'var(--text-3)', fontFamily: 'Geist Mono', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.4px' }}>{l}</div>
            </div>
          ))}
        </div>

        {step === 1 && (
          <div className="card">
            <h3 style={{ fontSize: 18, marginBottom: 20, color: 'var(--cream)' }}>Property Information</h3>
            <div className="form-group"><label>Listing Title *</label><input value={form.title} onChange={e => s('title', e.target.value)} placeholder="e.g. Turnkey Dispensary Space — Capitol Hill, Seattle WA"/></div>
            <div className="form-row">
              <div className="form-group"><label>Property Type *</label><select value={form.propertyType} onChange={e => s('propertyType', e.target.value)}><option value="">Select…</option>{PROPERTY_TYPES.map(t=><option key={t} value={t}>{t}</option>)}</select></div>
              <div className="form-group"><label>Deal Type *</label>
                <select value={form.dealType} onChange={e => s('dealType', e.target.value)}>
                  {DEAL_TYPES.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
                </select>
              </div>
            </div>

            {/* Deal type description */}
            {form.dealType && (
              <div style={{ marginBottom: 16, padding: '10px 14px', background: 'var(--char-3)', borderRadius: 7, border: '1px solid var(--border)', fontSize: 13, color: 'var(--text-3)', lineHeight: 1.6 }}>
                {DEAL_TYPES.find(d => d.value === form.dealType)?.desc}
              </div>
            )}

            <div className="form-group"><label>Street Address *</label><input value={form.address} onChange={e => s('address', e.target.value)} placeholder="123 Industrial Blvd"/></div>
            <div className="form-row">
              <div className="form-group"><label>City *</label><input value={form.city} onChange={e => s('city', e.target.value)} placeholder="City"/></div>
              <div className="form-group"><label>State *</label><select value={form.state} onChange={e => s('state', e.target.value)}><option value="">Select…</option>{US_STATES.map(st=><option key={st} value={st}>{st}</option>)}</select></div>
            </div>
            <div className="form-row">
              <div className="form-group"><label>County</label><input value={form.county} onChange={e => s('county', e.target.value)} placeholder="County Name"/></div>
              <div className="form-group"><label>ZIP Code</label><input value={form.zip} onChange={e => s('zip', e.target.value)} placeholder="00000"/></div>
            </div>
            <div className="form-row">
              <div className="form-group"><label>Square Footage</label><input type="number" value={form.sqft} onChange={e => s('sqft', e.target.value)} placeholder="5000"/></div>
              <div className="form-group"><label>Year Built</label><input type="number" value={form.yearBuilt} onChange={e => s('yearBuilt', e.target.value)} placeholder="2020"/></div>
            </div>
            <div className="form-group"><label>Zoning Classification</label><select value={form.zoning} onChange={e => s('zoning', e.target.value)}><option value="">Select or type below…</option>{ZONING_TYPES.map(z=><option key={z} value={z}>{z}</option>)}</select></div>

            <div style={{ display: 'flex', gap: 20, marginBottom: 12 }}>
              <label style={{ display: 'flex', gap: 8, alignItems: 'center', cursor: 'pointer', fontSize: 13.5, color: 'var(--text-2)' }}>
                <input type="checkbox" checked={form.cannabisZoned} onChange={e => s('cannabisZoned', e.target.checked)} style={{ width: 15, height: 15 }}/>
                Cannabis use confirmed / zoned
              </label>
              <label style={{ display: 'flex', gap: 8, alignItems: 'center', cursor: 'pointer', fontSize: 13.5, color: 'var(--text-2)' }}>
                <input type="checkbox" checked={form.existingLicense} onChange={e => s('existingLicense', e.target.checked)} style={{ width: 15, height: 15 }}/>
                Existing cannabis license
              </label>
            </div>
            {form.existingLicense && <div className="form-group"><label>License Type</label><input value={form.existingLicenseType} onChange={e => s('existingLicenseType', e.target.value)} placeholder="e.g. Adult-Use Retail, Cultivation Tier 3…"/></div>}

            {/* State zoning note */}
            {zoningNote && (
              <div style={{ padding: '12px 16px', background: 'rgba(22,163,74,0.06)', borderLeft: '3px solid var(--green)', borderRadius: '0 6px 6px 0', marginBottom: 4 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--green-lt)', fontFamily: 'Geist Mono', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 5 }}>{form.state} Cannabis Zoning Notes</div>
                <p style={{ fontSize: 12.5, color: 'var(--text-2)', lineHeight: 1.65, margin: 0 }}>{zoningNote}</p>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
              <button onClick={() => setStep(2)} className="btn btn-primary" disabled={!form.title || !form.propertyType || !form.state || !form.city}>Next <ArrowRight size={14}/></button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="card">
            <h3 style={{ fontSize: 18, marginBottom: 20, color: 'var(--cream)' }}>Deal Structure & Financials</h3>

            {(isLease || isSLB) && (
              <div className="form-row">
                <div className="form-group"><label>Monthly Rent ($) *</label><input type="number" value={form.monthlyRent} onChange={e => s('monthlyRent', e.target.value)} placeholder="8500"/></div>
                <div className="form-group"><label>Lease Term (years)</label><select value={form.leaseTermYears} onChange={e => s('leaseTermYears', e.target.value)}>{[1,2,3,5,7,10].map(n=><option key={n} value={n}>{n} year{n>1?'s':''}</option>)}</select></div>
              </div>
            )}
            {(isPurch || isSLB || isLand) && (
              <div className="form-group"><label>Asking / Sale Price ($) *</label><input type="number" value={form.askingPrice} onChange={e => s('askingPrice', e.target.value)} placeholder="2500000"/></div>
            )}
            {(isPurch || isSLB) && (
              <div className="form-row">
                <div className="form-group"><label>Cap Rate (%)</label><input type="number" step="0.1" value={form.capRate} onChange={e => s('capRate', e.target.value)} placeholder="6.5"/></div>
                <div className="form-group"><label>Annual NOI ($)</label><input type="number" value={form.noi} onChange={e => s('noi', e.target.value)} placeholder="162500"/></div>
              </div>
            )}

            <div style={{ padding: 12, background: 'var(--char-3)', borderRadius: 7, fontSize: 12, color: 'var(--text-3)', marginBottom: 8 }}>
              Platform closing fee: 2% of {isLease ? 'first year rent' : 'sale price'} — collected from owner at close.
            </div>

            <div style={{ display: 'flex', gap: 10, justifyContent: 'space-between', marginTop: 16 }}>
              <button onClick={() => setStep(1)} className="btn btn-secondary">Back</button>
              <button onClick={() => setStep(3)} className="btn btn-primary" disabled={!(form.monthlyRent || form.askingPrice)}>Next <ArrowRight size={14}/></button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="card">
            <h3 style={{ fontSize: 18, marginBottom: 20, color: 'var(--cream)' }}>Description & Features</h3>
            <div className="form-group">
              <label>Property Description *</label>
              <textarea rows={6} value={form.description} onChange={e => s('description', e.target.value)} placeholder="Describe the property — buildout, infrastructure, zoning history, cannabis suitability, nearby operators, and why it's a strong cannabis real estate opportunity…"/>
              <span className="help-text">{form.description.length} chars</span>
            </div>
            <div className="form-group">
              <label>Key Features</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {FEATS.map(feat => (
                  <button key={feat} type="button" onClick={() => s('features', form.features.includes(feat) ? form.features.filter(x=>x!==feat) : [...form.features,feat])} style={{
                    padding: '5px 12px', borderRadius: 20, fontSize: 12, cursor: 'pointer',
                    background: form.features.includes(feat) ? 'var(--green-faint)' : 'var(--char-3)',
                    border: `1.5px solid ${form.features.includes(feat)?'var(--green-dim)':'var(--border)'}`,
                    color: form.features.includes(feat)?'var(--green-lt)':'var(--text-3)',
                    transition: 'all 0.15s'
                  }}>{feat}</button>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'space-between' }}>
              <button onClick={() => setStep(2)} className="btn btn-secondary">Back</button>
              <button onClick={submit} className="btn btn-primary" disabled={loading || !form.description}>
                {loading ? <><span className="spinner"/> Publishing…</> : <>Publish Listing <ArrowRight size={14}/></>}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── TRANSACTIONS ─────────────────────────────────────────────────────────────
export function TransactionsPage() {
  const { user } = useAuth();
  const [txns, setTxns] = useState([]);
  useEffect(() => {
    setTxns(getTransactions().filter(t => t.userId === user?.id || t.ownerId === user?.id));
  }, [user]);

  const download = (type, txn) => {
    const u = { firstName: user?.firstName, lastName: user?.lastName, email: user?.email, businessName: user?.businessName };
    const p = { ...txn.property, id: txn.propertyId, brokerName: txn.property?.brokerName || 'Broker', brokerLicense: '', brokerEmail: '', dealType: txn.dealType, existingLicense: false };
    const od = txn.offerData || {};
    if (type==='nda')  dlDoc(genNDA({ user: u, property: p }), `NDA_${txn.id}.txt`);
    if (type==='loi')  dlDoc(genLOI({ user: u, property: p, offerData: od }), `LOI_${txn.id}.txt`);
    if (type==='lease') dlDoc(genLease({ user: u, property: p, offerData: od }), `Lease_${txn.id}.txt`);
    if (type==='psa')   dlDoc(genPSA({ user: u, property: p, offerData: od }), `PSA_${txn.id}.txt`);
    if (type==='slb')   dlDoc(genSaleLeaseback({ user: u, property: p, offerData: od }), `SLB_${txn.id}.txt`);
  };

  return (
    <div style={{ padding: '36px 0' }}>
      <div className="container">
        <h1 style={{ fontSize: 30, color: 'var(--cream)', marginBottom: 6 }}>Transactions</h1>
        <p style={{ color: 'var(--text-3)', fontSize: 13, marginBottom: 28 }}>Track every deal from LOI to keys in hand</p>

        {txns.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon"><FileText size={44}/></div>
            <h3>No transactions yet</h3>
            <p>Submit an offer on a property to begin a transaction</p>
            <Link to="/properties" className="btn btn-primary btn-sm" style={{ marginTop: 4 }}>Browse Properties</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {txns.map(txn => {
              const done = txn.steps?.filter(s=>s.done).length || 0;
              const pct  = Math.round((done / (txn.steps?.length||8)) * 100);
              const isLease = txn.dealType === 'lease';
              const isSLB   = txn.dealType === 'sale_leaseback';
              return (
                <div key={txn.id} className="card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 16, color: 'var(--cream)', marginBottom: 3 }}>{txn.property?.title || 'Property Transaction'}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-3)', fontFamily: 'Geist Mono' }}>{txn.id} · {new Date(txn.createdAt).toLocaleDateString()}</div>
                    </div>
                    <span className="badge badge-green">{pct}% complete</span>
                  </div>

                  {/* Pipeline */}
                  <div style={{ display: 'flex', overflowX: 'auto', paddingBottom: 8, marginBottom: 16, gap: 0 }}>
                    {txn.steps?.map((step, i) => (
                      <div key={step.key} style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 90 }}>
                          <div style={{ width: 26, height: 26, borderRadius: '50%', background: step.done?'var(--green-lt)':'var(--char-3)', border: `2px solid ${step.done?'var(--green)':'var(--border)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 5 }}>
                            {step.done ? <CheckCircle size={13} color="var(--char)"/> : <Clock size={11} color="var(--text-3)"/>}
                          </div>
                          <div style={{ fontSize: 10, textAlign: 'center', color: step.done?'var(--text-2)':'var(--text-3)', lineHeight: 1.3, maxWidth: 80 }}>{step.label}</div>
                        </div>
                        {i < txn.steps.length-1 && <div style={{ width: 16, height: 2, background: step.done?'var(--green)':'var(--border)', flexShrink: 0 }}/>}
                      </div>
                    ))}
                  </div>

                  {/* Doc downloads */}
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                    <span style={{ fontSize: 11, color: 'var(--text-3)', fontFamily: 'Geist Mono', textTransform: 'uppercase', letterSpacing: '0.4px' }}>Documents:</span>
                    <button onClick={() => download('nda', txn)} className="btn btn-secondary btn-sm"><Download size={12}/> NDA</button>
                    <button onClick={() => download('loi', txn)} className="btn btn-secondary btn-sm"><Download size={12}/> LOI</button>
                    {isLease && <button onClick={() => download('lease', txn)} className="btn btn-secondary btn-sm"><Download size={12}/> Lease + Addendum</button>}
                    {isSLB && <><button onClick={() => download('psa', txn)} className="btn btn-secondary btn-sm"><Download size={12}/> PSA</button><button onClick={() => download('slb', txn)} className="btn btn-secondary btn-sm"><Download size={12}/> Sale-Leaseback</button></>}
                    {!isLease && !isSLB && <button onClick={() => download('psa', txn)} className="btn btn-secondary btn-sm"><Download size={12}/> PSA</button>}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── PROFILE ──────────────────────────────────────────────────────────────────
export function ProfilePage() {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('profile');
  const [form, setForm] = useState({ firstName: user?.firstName||'', lastName: user?.lastName||'', phone: user?.phone||'', businessName: user?.businessName||'', brokerLicense: user?.brokerLicense||'', state: user?.state||'', bio: user?.bio||'' });
  const [pw, setPw]     = useState({ cur:'', next:'', conf:'' });
  const [saved, setSaved] = useState(false);
  const [pwErr, setPwErr] = useState('');

  const saveProfile = () => { updateUser(form); setSaved(true); setTimeout(()=>setSaved(false),2500); };
  const changePw = () => {
    if (pw.cur !== user.password) return setPwErr('Current password is incorrect.');
    if (pw.next.length < 8) return setPwErr('Min. 8 characters.');
    if (pw.next !== pw.conf) return setPwErr('Passwords do not match.');
    updateUser({ password: pw.next }); setPw({cur:'',next:'',conf:''}); setPwErr('');
    setSaved(true); setTimeout(()=>setSaved(false),2500);
  };

  return (
    <div style={{ padding: '36px 0' }}>
      <div className="container" style={{ maxWidth: 700 }}>
        <h1 style={{ fontSize: 30, color: 'var(--cream)', marginBottom: 6 }}>Profile & Settings</h1>
        <p style={{ color: 'var(--text-3)', fontSize: 13, marginBottom: 28 }}>Manage your account</p>
        <div style={{ display: 'flex', gap: 3, marginBottom: 26, borderBottom: '1px solid var(--border)' }}>
          {[{k:'profile',l:'Profile'},{k:'security',l:'Security'}].map(t=>(
            <button key={t.k} onClick={()=>setTab(t.k)} style={{ padding:'9px 16px', background:'transparent', border:'none', cursor:'pointer', color: tab===t.k?'var(--green-lt)':'var(--text-3)', borderBottom:`2px solid ${tab===t.k?'var(--green)':'transparent'}`, fontFamily:'Geist', fontWeight:600, fontSize:13, marginBottom:-1, transition:'all 0.15s' }}>{t.l}</button>
          ))}
        </div>
        {saved && <div style={{ display:'flex', alignItems:'center', gap:8, padding:'10px 16px', background:'rgba(22,163,74,0.1)', border:'1px solid rgba(22,163,74,0.25)', borderRadius:7, marginBottom:18, fontSize:13, color:'var(--green-lt)' }}><CheckCircle size={14}/> Saved</div>}

        {tab==='profile' && (
          <div className="card">
            <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:22 }}>
              <div style={{ width:56, height:56, background:'var(--green)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'DM Serif Display', fontSize:22, color:'#fff' }}>{user?.firstName?.[0]}{user?.lastName?.[0]}</div>
              <div><div style={{ fontWeight:600, fontSize:16, color:'var(--cream)' }}>{user?.firstName} {user?.lastName}</div><div style={{ fontSize:12, color:'var(--text-3)' }}>{user?.email}</div></div>
            </div>
            <div className="divider"/>
            <div className="form-row"><div className="form-group"><label>First Name</label><input value={form.firstName} onChange={e=>setForm(f=>({...f,firstName:e.target.value}))}/></div><div className="form-group"><label>Last Name</label><input value={form.lastName} onChange={e=>setForm(f=>({...f,lastName:e.target.value}))}/></div></div>
            <div className="form-group"><label>Business / Company</label><input value={form.businessName} onChange={e=>setForm(f=>({...f,businessName:e.target.value}))} placeholder="Your company or LLC"/></div>
            <div className="form-group"><label>RE Broker License #</label><input value={form.brokerLicense} onChange={e=>setForm(f=>({...f,brokerLicense:e.target.value}))} placeholder="State license number"/></div>
            <div className="form-row"><div className="form-group"><label>Phone</label><input value={form.phone} onChange={e=>setForm(f=>({...f,phone:e.target.value}))}/></div><div className="form-group"><label>Primary State</label><select value={form.state} onChange={e=>setForm(f=>({...f,state:e.target.value}))}><option value="">Select…</option>{US_STATES.map(st=><option key={st} value={st}>{st}</option>)}</select></div></div>
            <div className="form-group"><label>Bio</label><textarea rows={3} value={form.bio} onChange={e=>setForm(f=>({...f,bio:e.target.value}))} placeholder="Brief professional background"/></div>
            <button onClick={saveProfile} className="btn btn-primary"><Save size={14}/> Save Changes</button>
          </div>
        )}
        {tab==='security' && (
          <div className="card">
            <h3 style={{ fontSize:16, marginBottom:18, color:'var(--cream)' }}>Change Password</h3>
            <div className="form-group"><label>Current Password</label><input type="password" value={pw.cur} onChange={e=>setPw(p=>({...p,cur:e.target.value}))} placeholder="••••••••"/></div>
            <div className="form-group"><label>New Password</label><input type="password" value={pw.next} onChange={e=>setPw(p=>({...p,next:e.target.value}))} placeholder="Min. 8 characters"/></div>
            <div className="form-group"><label>Confirm New Password</label><input type="password" value={pw.conf} onChange={e=>setPw(p=>({...p,conf:e.target.value}))} placeholder="••••••••"/></div>
            {pwErr && <p className="error-msg" style={{ marginBottom:12 }}>{pwErr}</p>}
            <button onClick={changePw} className="btn btn-primary"><Key size={14}/> Update Password</button>
            <div className="divider"/>
            <button onClick={()=>{logout();navigate('/');}} className="btn btn-danger btn-sm">Sign Out</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── HOW IT WORKS ─────────────────────────────────────────────────────────────
export function HowItWorksPage() {
  return (
    <div style={{ padding: '64px 0' }}>
      <div className="container" style={{ maxWidth: 900 }}>
        <div style={{ textAlign:'center', marginBottom:56 }}>
          <h1 style={{ fontSize:44, color:'var(--cream)', marginBottom:14 }}>How It Works</h1>
          <p style={{ fontSize:17, color:'var(--text-2)', maxWidth:540, margin:'0 auto', lineHeight:1.75 }}>
            From listing to closing — with every cannabis-specific contract handled automatically.
          </p>
        </div>

        {/* For Owners */}
        <div style={{ marginBottom:52 }}>
          <h2 style={{ fontSize:26, marginBottom:26, paddingBottom:12, borderBottom:'1px solid var(--border)', color:'var(--cream)' }}>
            For <span style={{ color:'var(--green-lt)' }}>Property Owners & Brokers</span>
          </h2>
          {[
            {n:1,t:'Create Your Account',d:'Free to join. Add your RE broker license if you have one. Takes under 2 minutes.'},
            {n:2,t:'List Your Property',d:'Complete the 3-step form: property details, deal structure (lease, purchase, sale-leaseback, or land), and description. All 4 deal types supported.'},
            {n:3,t:'Go Live Immediately',d:'Your listing is live as soon as you publish. Every listing shows zoning status, deal type, cannabis permitting notes, and your contact details.'},
            {n:4,t:'Receive Offers with Contracts',d:'Every offer arrives with a signed NDA and completed LOI. No chasing tenants or buyers for paperwork — it all comes with the offer.'},
            {n:5,t:'Close & Collect',d:'Track the deal through due diligence, zoning confirmation, contract signing, and closing. 2% platform fee deducted at funding.'},
          ].map(step=>(
            <div key={step.n} style={{ display:'flex', gap:18, alignItems:'flex-start', marginBottom:20 }}>
              <div style={{ width:36, height:36, borderRadius:'50%', background:'var(--green-faint)', border:'1.5px solid rgba(22,163,74,0.3)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'DM Serif Display', color:'var(--green-lt)', flexShrink:0, fontSize:16 }}>{step.n}</div>
              <div><h3 style={{ fontSize:15, marginBottom:5, color:'var(--cream)' }}>{step.t}</h3><p style={{ fontSize:13.5, color:'var(--text-2)', lineHeight:1.75 }}>{step.d}</p></div>
            </div>
          ))}
        </div>

        {/* For Operators */}
        <div style={{ marginBottom:52 }}>
          <h2 style={{ fontSize:26, marginBottom:26, paddingBottom:12, borderBottom:'1px solid var(--border)', color:'var(--cream)' }}>
            For <span style={{ color:'var(--amber-lt)' }}>Operators & Buyers</span>
          </h2>
          {[
            {n:1,t:'Create Your Account',d:'Free to join. No RE license required to browse or submit offers.'},
            {n:2,t:'Browse & Filter',d:'Filter by deal type, state, property type, size, price, and cannabis zoning status.'},
            {n:3,t:'Check Zoning Before Committing',d:'Every listing shows the state\'s cannabis zoning requirements and licensing notes upfront. No surprises in due diligence.'},
            {n:4,t:'Download NDA & Submit Offer',d:'Download a free pre-filled NDA to start due diligence. Submit an offer and receive all contracts instantly: NDA, LOI, and either a Commercial Lease + Cannabis Addendum, PSA, or Sale-Leaseback Agreement.'},
            {n:5,t:'Track to Close',d:'Your transaction pipeline walks you through: NDA, due diligence, zoning confirmation, contracts, financing/escrow, cannabis license verification, and closing.'},
          ].map(step=>(
            <div key={step.n} style={{ display:'flex', gap:18, alignItems:'flex-start', marginBottom:20 }}>
              <div style={{ width:36, height:36, borderRadius:'50%', background:'var(--amber-dim)', border:'1.5px solid rgba(217,119,6,0.3)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'DM Serif Display', color:'var(--amber-lt)', flexShrink:0, fontSize:16 }}>{step.n}</div>
              <div><h3 style={{ fontSize:15, marginBottom:5, color:'var(--cream)' }}>{step.t}</h3><p style={{ fontSize:13.5, color:'var(--text-2)', lineHeight:1.75 }}>{step.d}</p></div>
            </div>
          ))}
        </div>

        {/* Contracts */}
        <div className="card card-green" style={{ marginBottom:44 }}>
          <h2 style={{ fontSize:22, marginBottom:18, color:'var(--cream)' }}>5 Contracts. Auto-Generated.</h2>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(220px,1fr))', gap:12 }}>
            {[
              {t:'Cannabis Property NDA',d:'Governs confidential property and financial disclosure'},
              {t:'Letter of Intent',d:'Non-binding offer with key lease or purchase terms'},
              {t:'Commercial Lease + Cannabis Addendum',d:'Full lease with odor, security, licensing, federal law clauses'},
              {t:'Purchase & Sale Agreement',d:'Binding PSA with cannabis zoning and escrow terms'},
              {t:'Sale-Leaseback Agreement',d:'Covers both the sale and the simultaneous leaseback'},
            ].map(doc=>(
              <div key={doc.t} style={{ padding:'14px 16px', background:'var(--char-3)', borderRadius:8, border:'1px solid var(--border)' }}>
                <FileText size={14} style={{ color:'var(--green-lt)', marginBottom:8 }}/>
                <div style={{ fontSize:13.5, fontWeight:600, marginBottom:4, color:'var(--cream)' }}>{doc.t}</div>
                <div style={{ fontSize:12, color:'var(--text-3)', lineHeight:1.6 }}>{doc.d}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ textAlign:'center', padding:'32px', background:'var(--char-2)', borderRadius:12, border:'1px solid var(--border)' }}>
          <h3 style={{ fontSize:24, marginBottom:10, color:'var(--cream)' }}>2% Closing Fee. Nothing Until You Close.</h3>
          <p style={{ color:'var(--text-2)', maxWidth:460, margin:'0 auto 20px', lineHeight:1.75 }}>Free to list, free to browse, free to submit offers. 2% from the owner at closing only.</p>
          <Link to="/register" className="btn btn-primary btn-lg">Get Started Free <ArrowRight size={16}/></Link>
        </div>
      </div>
    </div>
  );
}

// ─── ADMIN ────────────────────────────────────────────────────────────────────
export function AdminPage() {
  const { user } = useAuth();
  const [tab, setTab] = useState('overview');

  if (!user || user.role !== 'admin') return (
    <div style={{ padding:60, textAlign:'center' }}>
      <Shield size={48} style={{ color:'var(--danger-lt)', marginBottom:16 }}/>
      <h2 style={{ color:'var(--cream)' }}>Admin Access Required</h2>
    </div>
  );

  const properties = getProperties();
  const txns = getTransactions();
  const totalFees = txns.reduce((s,t) => {
    const val = t.dealType === 'lease' ? (t.offerData?.monthlyRent||0)*12 : (t.offerData?.offerPrice||0);
    return s + val * 0.02;
  }, 0);
  const reload = () => window.location.reload();

  const tabs = [
    {k:'overview',l:'Overview'},{k:'listings',l:`Listings (${properties.length})`},
    {k:'transactions',l:`Transactions (${txns.length})`},
  ];

  return (
    <div style={{ padding:'36px 0' }}>
      <div className="container">
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:28 }}>
          <div><h1 style={{ fontSize:28, color:'var(--cream)', marginBottom:4 }}>Admin Panel</h1><div style={{ fontSize:13, color:'var(--text-3)' }}>Cannabis Real Estate Brokers Platform</div></div>
          <span className="badge badge-green"><Shield size={11}/> Admin</span>
        </div>

        <div style={{ display:'flex', gap:3, marginBottom:28, borderBottom:'1px solid var(--border)' }}>
          {tabs.map(t=><button key={t.k} onClick={()=>setTab(t.k)} style={{ padding:'9px 16px', background:'transparent', border:'none', cursor:'pointer', color:tab===t.k?'var(--green-lt)':'var(--text-3)', borderBottom:`2px solid ${tab===t.k?'var(--green)':'transparent'}`, fontFamily:'Geist', fontWeight:600, fontSize:13, marginBottom:-1, transition:'all 0.15s' }}>{t.l}</button>)}
        </div>

        {tab==='overview' && (
          <div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(200px,1fr))', gap:16, marginBottom:28 }}>
              {[
                {l:'Active Listings', v:properties.filter(p=>p.status==='active').length, sub:'on marketplace', c:'var(--green-lt)'},
                {l:'Transactions', v:txns.length, sub:'all time', c:'var(--amber-lt)'},
                {l:'Platform Fees (2%)', v:fmt(totalFees), sub:'from closed deals', c:'var(--green-lt)'},
                {l:'Total Listing Value', v:fmt(properties.reduce((s,p)=>s+(p.askingPrice||p.monthlyRent*12||0),0)), sub:'combined ask/annual', c:'var(--text-2)'},
              ].map(s=>(
                <div key={s.l} className="card">
                  <div style={{ fontFamily:'DM Serif Display', fontSize:28, color:s.c, marginBottom:4 }}>{s.v}</div>
                  <div style={{ fontSize:13, fontWeight:600, color:'var(--cream)', marginBottom:2 }}>{s.l}</div>
                  <div style={{ fontSize:11, color:'var(--text-3)' }}>{s.sub}</div>
                </div>
              ))}
            </div>
            <div className="card">
              <h3 style={{ fontSize:16, marginBottom:14, color:'var(--cream)' }}>Listings by State</h3>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(145px,1fr))', gap:10 }}>
                {Object.entries(properties.reduce((a,p)=>{a[p.state]=(a[p.state]||0)+1;return a;},{})).sort(([,a],[,b])=>b-a).map(([state,count])=>(
                  <div key={state} style={{ display:'flex', justifyContent:'space-between', padding:'8px 12px', background:'var(--char-3)', borderRadius:6 }}>
                    <span style={{ fontSize:13, color:'var(--text-2)' }}>{state}</span>
                    <span style={{ fontFamily:'DM Serif Display', color:'var(--green-lt)', fontSize:16 }}>{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab==='listings' && (
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            {properties.length===0 ? <div className="empty-state"><h3>No listings yet</h3></div> : properties.map(p=>(
              <div key={p.id} className="card" style={{ padding:16 }}>
                <div style={{ display:'flex', justifyContent:'space-between', flexWrap:'wrap', gap:10 }}>
                  <div style={{ flex:1 }}>
                    <div style={{ display:'flex', gap:6, marginBottom:6, flexWrap:'wrap' }}>
                      <span className={`badge ${p.status==='active'?'badge-green':p.status==='pending'?'badge-amber':'badge-gray'}`}>{p.status}</span>
                      {p.cannabisZoned && <span className="badge badge-green">✓ Zoned</span>}
                    </div>
                    <div style={{ fontWeight:600, color:'var(--cream)', marginBottom:3 }}>{p.title}</div>
                    <div style={{ fontSize:11, color:'var(--text-3)', fontFamily:'Geist Mono' }}>{p.city}, {p.state} · {fmtSqft(p.sqft)} · {p.views||0} views</div>
                  </div>
                  <div style={{ display:'flex', gap:8, alignItems:'center', flexWrap:'wrap' }}>
                    <span style={{ fontFamily:'DM Serif Display', color:'var(--green-lt)', fontSize:17 }}>
                      {p.dealType==='lease'||p.dealType==='sale_leaseback' ? fmt(p.monthlyRent)+'/mo' : fmt(p.askingPrice)}
                    </span>
                    {p.status==='active' && <button onClick={()=>{updateProperty(p.id,{status:'suspended'});reload();}} className="btn btn-danger btn-sm">Suspend</button>}
                    {p.status==='suspended' && <button onClick={()=>{updateProperty(p.id,{status:'active'});reload();}} className="btn btn-primary btn-sm">Restore</button>}
                    {!p.featured && p.status==='active' && <button onClick={()=>{updateProperty(p.id,{featured:true});reload();}} className="btn btn-secondary btn-sm">★ Feature</button>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab==='transactions' && (
          txns.length===0 ? <div className="empty-state"><div className="empty-state-icon"><FileText size={42}/></div><h3>No transactions yet</h3></div>
          : <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            {txns.map(t=>{
              const val = t.dealType==='lease'?(t.offerData?.monthlyRent||0)*12:(t.offerData?.offerPrice||0);
              return (
                <div key={t.id} className="card" style={{ padding:16 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', flexWrap:'wrap', gap:8 }}>
                    <div><div style={{ fontWeight:600, color:'var(--cream)', marginBottom:3 }}>{t.property?.title||'Transaction'}</div><div style={{ fontSize:11, color:'var(--text-3)', fontFamily:'Geist Mono' }}>{t.id} · {new Date(t.createdAt).toLocaleDateString()}</div></div>
                    <div><div style={{ fontFamily:'DM Serif Display', color:'var(--green-lt)', fontSize:18 }}>{fmt(val)}</div><div style={{ fontSize:11, color:'var(--amber-lt)' }}>Fee: {fmt(val*0.02)}</div></div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
