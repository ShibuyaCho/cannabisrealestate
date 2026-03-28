import { useState, useMemo } from 'react';
import { useParams, Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Search, SlidersHorizontal, X, ChevronLeft, MapPin,
  FileText, Shield, CheckCircle, Clock, Download, Eye,
  MessageSquare, DollarSign, Maximize2, Calendar
} from 'lucide-react';
import { getProperties, getProperty, updateProperty, createTransaction, DEAL_TYPES, PROPERTY_TYPES, ZONING_TYPES, US_STATES, STATE_ZONING_NOTES, fmt, fmtSqft } from '../utils/store';
import { dlDoc, genNDA, genLOI, genLease, genPSA, genSaleLeaseback } from '../utils/documents';
import { PropertyCard } from './Home';

// ── BROWSE ────────────────────────────────────────────────────────────────────
export function PropertiesPage() {
  const [sp] = useSearchParams();
  const [q, setQ] = useState(sp.get('q') || '');
  const [f, setF] = useState({
    state: sp.get('state') || '',
    dealType: sp.get('dealType') || '',
    propertyType: '',
    minPrice: '', maxPrice: '',
    cannabisZoned: false,
    sortBy: 'newest',
  });
  const [showF, setShowF] = useState(false);

  const results = useMemo(() => {
    let list = getProperties().filter(p => p.status === 'active');
    if (q) {
      const lq = q.toLowerCase();
      list = list.filter(p =>
        p.title?.toLowerCase().includes(lq) ||
        p.city?.toLowerCase().includes(lq) ||
        p.state?.toLowerCase().includes(lq) ||
        p.propertyType?.toLowerCase().includes(lq) ||
        p.description?.toLowerCase().includes(lq)
      );
    }
    if (f.state)        list = list.filter(p => p.state === f.state);
    if (f.dealType)     list = list.filter(p => p.dealType === f.dealType);
    if (f.propertyType) list = list.filter(p => p.propertyType === f.propertyType);
    if (f.cannabisZoned) list = list.filter(p => p.cannabisZoned);
    if (f.minPrice) list = list.filter(p => (p.askingPrice || p.monthlyRent * 12) >= Number(f.minPrice));
    if (f.maxPrice) list = list.filter(p => (p.askingPrice || p.monthlyRent * 12) <= Number(f.maxPrice));
    if (f.sortBy === 'newest')     list.sort((a,b) => new Date(b.createdAt)-new Date(a.createdAt));
    if (f.sortBy === 'price_asc')  list.sort((a,b) => (a.askingPrice||a.monthlyRent*12)-(b.askingPrice||b.monthlyRent*12));
    if (f.sortBy === 'price_desc') list.sort((a,b) => (b.askingPrice||b.monthlyRent*12)-(a.askingPrice||a.monthlyRent*12));
    if (f.sortBy === 'sqft')       list.sort((a,b) => (b.sqft||0)-(a.sqft||0));
    return list;
  }, [q, f]);

  const set = (k,v) => setF(p => ({ ...p, [k]: v }));
  const clear = () => setF({ state:'', dealType:'', propertyType:'', minPrice:'', maxPrice:'', cannabisZoned:false, sortBy:'newest' });
  const activeCount = Object.entries(f).filter(([k,v]) => v && k !== 'sortBy').length;

  return (
    <div style={{ padding: '36px 0' }}>
      <div className="container">
        <div style={{ marginBottom: 26 }}>
          <h1 style={{ fontSize: 32, color: 'var(--cream)', marginBottom: 6 }}>Cannabis Properties</h1>
          <p style={{ fontSize: 13, color: 'var(--text-3)', fontFamily: 'Geist Mono' }}>{results.length} propert{results.length !== 1 ? 'ies' : 'y'} available</p>
        </div>

        <div style={{ display: 'flex', gap: 10, marginBottom: 18, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, position: 'relative', minWidth: 220 }}>
            <Search size={15} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)', pointerEvents: 'none' }}/>
            <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search properties…" style={{ paddingLeft: 40 }}/>
          </div>
          <select value={f.state} onChange={e => set('state', e.target.value)} style={{ minWidth: 150 }}>
            <option value="">All States</option>
            {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select value={f.dealType} onChange={e => set('dealType', e.target.value)} style={{ minWidth: 160 }}>
            <option value="">All Deal Types</option>
            {DEAL_TYPES.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
          </select>
          <select value={f.sortBy} onChange={e => set('sortBy', e.target.value)} style={{ minWidth: 150 }}>
            <option value="newest">Newest First</option>
            <option value="price_asc">Price: Low → High</option>
            <option value="price_desc">Price: High → Low</option>
            <option value="sqft">Largest First</option>
          </select>
          <button className={`btn ${showF ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setShowF(!showF)}>
            <SlidersHorizontal size={14}/> Filters
            {activeCount > 0 && <span style={{ background: 'var(--char)', borderRadius: '50%', width: 17, height: 17, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10 }}>{activeCount}</span>}
          </button>
        </div>

        {showF && (
          <div className="card" style={{ marginBottom: 18, padding: 18 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: 14 }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Property Type</label>
                <select value={f.propertyType} onChange={e => set('propertyType', e.target.value)}>
                  <option value="">All Types</option>
                  {PROPERTY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Min Price / Rent/yr</label>
                <input type="number" placeholder="$0" value={f.minPrice} onChange={e => set('minPrice', e.target.value)}/>
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Max Price / Rent/yr</label>
                <input type="number" placeholder="No limit" value={f.maxPrice} onChange={e => set('maxPrice', e.target.value)}/>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 16, marginTop: 14, alignItems: 'center' }}>
              <label style={{ display: 'flex', gap: 8, alignItems: 'center', cursor: 'pointer', fontSize: 13, color: 'var(--text-2)' }}>
                <input type="checkbox" checked={f.cannabisZoned} onChange={e => set('cannabisZoned', e.target.checked)} style={{ width: 15, height: 15 }}/>
                Cannabis-zoned only
              </label>
              {activeCount > 0 && <button onClick={clear} className="btn btn-ghost btn-sm"><X size={13}/> Clear All</button>}
            </div>
          </div>
        )}

        {results.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon"><Search size={44}/></div>
            <h3>No properties found</h3>
            <p>Try adjusting your search or filters</p>
            {activeCount > 0 && <button onClick={clear} className="btn btn-secondary btn-sm">Clear Filters</button>}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
            {results.map(p => <PropertyCard key={p.id} property={p}/>)}
          </div>
        )}
      </div>
    </div>
  );
}

// ── PROPERTY DETAIL ───────────────────────────────────────────────────────────
export function PropertyDetailPage() {
  const { id }   = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const property = getProperty(id);

  const [showOffer, setShowOffer] = useState(false);
  const [offerData, setOfferData] = useState({ offerPrice: '', monthlyRent: '', leaseYears: '5', message: '' });
  const [generating, setGenerating] = useState(false);
  const [done, setDone] = useState(false);

  if (!property) return (
    <div style={{ padding: 60, textAlign: 'center' }}>
      <h2 style={{ color: 'var(--cream)' }}>Property Not Found</h2>
      <Link to="/properties" className="btn btn-secondary" style={{ marginTop: 16 }}>Back to Properties</Link>
    </div>
  );

  useState(() => { updateProperty(id, { views: (property.views || 0) + 1 }); }, []);

  const isMine   = user?.id === property.ownerId;
  const isLease  = property.dealType === 'lease';
  const isPurch  = property.dealType === 'purchase';
  const isSLB    = property.dealType === 'sale_leaseback';
  const isLand   = property.dealType === 'land';
  const dealLabel = { lease: 'For Lease', purchase: 'For Sale', sale_leaseback: 'Sale-Leaseback', land: 'Land / Dev' };
  const dealBadge = { lease: 'badge-green', purchase: 'badge-amber', sale_leaseback: 'badge-info', land: 'badge-cream' };

  const downloadNDA = () => {
    if (!user) return navigate('/login');
    dlDoc(genNDA({ user, property }), `NDA_${property.id}.txt`);
  };

  const submitOffer = () => {
    setGenerating(true);
    setTimeout(() => {
      const fullOfferData = { ...offerData, dealType: property.dealType, offerPrice: Number(offerData.offerPrice) || property.askingPrice, monthlyRent: Number(offerData.monthlyRent) || property.monthlyRent, leaseYears: Number(offerData.leaseYears) };
      createTransaction({ propertyId: property.id, userId: user.id, ownerId: property.ownerId, dealType: property.dealType, offerData: fullOfferData, property: { title: property.title, address: property.address, city: property.city, state: property.state, brokerName: property.brokerName } });
      updateProperty(property.id, { inquiries: (property.inquiries || 0) + 1 });

      dlDoc(genNDA({ user, property }), `NDA_${property.id}.txt`);
      setTimeout(() => dlDoc(genLOI({ user, property, offerData: fullOfferData }), `LOI_${property.id}.txt`), 300);
      setTimeout(() => {
        if (isLease)     dlDoc(genLease({ user, property, offerData: fullOfferData }), `Lease_${property.id}.txt`);
        else if (isSLB)  { dlDoc(genPSA({ user, property, offerData: fullOfferData }), `PSA_${property.id}.txt`); setTimeout(() => dlDoc(genSaleLeaseback({ user, property, offerData: fullOfferData }), `SLB_${property.id}.txt`), 300); }
        else             dlDoc(genPSA({ user, property, offerData: fullOfferData }), `PSA_${property.id}.txt`);
      }, 600);

      setGenerating(false);
      setDone(true);
      setTimeout(() => { setShowOffer(false); navigate('/transactions'); }, 3200);
    }, 1600);
  };

  const zoningNote = STATE_ZONING_NOTES[property.state];
  const docList = isLease ? ['Cannabis Use NDA', 'Letter of Intent', 'Commercial Lease + Cannabis Addendum']
    : isSLB ? ['Cannabis Use NDA', 'Letter of Intent', 'Purchase & Sale Agreement', 'Sale-Leaseback Agreement']
    : ['Cannabis Use NDA', 'Letter of Intent', 'Purchase & Sale Agreement'];

  return (
    <div style={{ padding: '32px 0' }}>
      <div className="container">
        <Link to="/properties" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--text-3)', fontSize: 13, marginBottom: 28, textDecoration: 'none' }}>
          <ChevronLeft size={14}/> Back to Properties
        </Link>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 28, alignItems: 'start' }}>

          {/* MAIN */}
          <div>
            <div className="card" style={{ marginBottom: 18 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10, marginBottom: 16 }}>
                <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
                  {property.featured && <span className="badge badge-amber">Featured</span>}
                  <span className={`badge ${dealBadge[property.dealType] || 'badge-gray'}`}>{dealLabel[property.dealType] || property.dealType}</span>
                  {property.cannabisZoned && <span className="badge badge-green">✓ Cannabis Zoned</span>}
                  {property.existingLicense && <span className="badge badge-green">License in Place</span>}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-3)', display: 'flex', gap: 14, fontFamily: 'Geist Mono' }}>
                  <span><Eye size={12} style={{ marginRight: 3 }}/>{property.views || 0} views</span>
                  <span><MessageSquare size={12} style={{ marginRight: 3 }}/>{property.inquiries || 0} inquiries</span>
                </div>
              </div>
              <h1 style={{ fontSize: 26, color: 'var(--cream)', marginBottom: 14, lineHeight: 1.25 }}>{property.title}</h1>
              <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', fontSize: 13.5, color: 'var(--text-2)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><MapPin size={14}/>{property.address ? `${property.address}, ` : ''}{property.city}, {property.state}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><Maximize2 size={14}/>{fmtSqft(property.sqft)}</span>
                {property.yearBuilt && <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><Calendar size={14}/>Built {property.yearBuilt}</span>}
              </div>
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 12, marginBottom: 18 }}>
              {[
                { l: isLease || isSLB ? 'Monthly Rent' : 'Asking Price', v: isLease || isSLB ? fmt(property.monthlyRent) + '/mo' : fmt(property.askingPrice), hi: true },
                ...(isPurch || isSLB || isLand ? [{ l: isPurch || isLand ? 'Price' : 'Sale Price', v: fmt(property.askingPrice) }] : []),
                ...(property.capRate ? [{ l: 'Cap Rate', v: property.capRate + '%' }] : []),
                { l: 'Size', v: fmtSqft(property.sqft) },
                { l: 'Zoning', v: property.zoning || '—' },
                ...(isLease || isSLB ? [{ l: 'Lease Term', v: property.leaseTermYears ? property.leaseTermYears + ' years' : '—' }] : []),
              ].map(s => (
                <div key={s.l} style={{ background: 'var(--char-3)', border: '1px solid var(--border)', borderRadius: 8, padding: '12px 14px' }}>
                  <div style={{ fontSize: 16, fontFamily: 'DM Serif Display', color: s.hi ? 'var(--green-lt)' : 'var(--cream)', lineHeight: 1, marginBottom: 4 }}>{s.v}</div>
                  <div style={{ fontSize: 10, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.4px', fontFamily: 'Geist Mono', fontWeight: 600 }}>{s.l}</div>
                </div>
              ))}
            </div>

            {/* Description */}
            <div className="card" style={{ marginBottom: 18 }}>
              <h3 style={{ fontSize: 17, marginBottom: 14, color: 'var(--cream)' }}>About This Property</h3>
              <p style={{ color: 'var(--text-2)', lineHeight: 1.85, fontSize: 14 }}>{property.description}</p>
            </div>

            {/* Features */}
            {property.features?.length > 0 && (
              <div className="card" style={{ marginBottom: 18 }}>
                <h3 style={{ fontSize: 17, marginBottom: 14, color: 'var(--cream)' }}>Property Features</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: 10 }}>
                  {property.features.map(feat => (
                    <div key={feat} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <CheckCircle size={13} style={{ color: 'var(--green-lt)', flexShrink: 0 }}/>
                      <span style={{ fontSize: 13, color: 'var(--text-2)' }}>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Zoning */}
            <div className="card" style={{ marginBottom: 18 }}>
              <h3 style={{ fontSize: 17, marginBottom: 14, color: 'var(--cream)' }}>Zoning & Cannabis Status</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: zoningNote ? 16 : 0 }}>
                {[
                  { l: 'Zoning', v: property.zoning || '—' },
                  { l: 'Cannabis Permitted', v: property.cannabisZoned ? '✓ Yes — confirmed' : 'Verify locally' },
                  { l: 'Existing License', v: property.existingLicense ? `✓ ${property.existingLicenseType || 'Yes'}` : 'None' },
                  { l: 'County', v: property.county || '—' },
                ].map(item => (
                  <div key={item.l}>
                    <div style={{ fontSize: 10, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.5px', fontFamily: 'Geist Mono', fontWeight: 600, marginBottom: 3 }}>{item.l}</div>
                    <div style={{ fontSize: 13.5, color: property.cannabisZoned && item.l === 'Cannabis Permitted' ? 'var(--green-lt)' : 'var(--text-2)' }}>{item.v}</div>
                  </div>
                ))}
              </div>
              {zoningNote && (
                <div style={{ padding: '12px 16px', background: 'rgba(22,163,74,0.06)', borderLeft: '3px solid var(--green)', borderRadius: '0 6px 6px 0' }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--green-lt)', fontFamily: 'Geist Mono', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 5 }}>
                    {property.state} Cannabis Zoning Notes
                  </div>
                  <p style={{ fontSize: 12.5, color: 'var(--text-2)', lineHeight: 1.65, margin: 0 }}>{zoningNote}</p>
                </div>
              )}
            </div>

            {/* Docs */}
            <div className="card">
              <h3 style={{ fontSize: 17, marginBottom: 6, color: 'var(--cream)' }}>Documents Generated on Offer</h3>
              <p style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 16 }}>All contracts download automatically when you submit an offer.</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 10, marginBottom: 14 }}>
                {docList.map(d => (
                  <div key={d} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', background: 'var(--char-3)', borderRadius: 7, border: '1px solid var(--border)' }}>
                    <FileText size={13} style={{ color: 'var(--green-lt)', flexShrink: 0 }}/>
                    <span style={{ fontSize: 12.5, color: 'var(--text-2)' }}>{d}</span>
                  </div>
                ))}
              </div>
              <button onClick={downloadNDA} className="btn btn-secondary btn-sm"><Download size={13}/> Preview NDA (Free)</button>
            </div>
          </div>

          {/* SIDEBAR */}
          <div style={{ position: 'sticky', top: 76 }}>
            <div className="card" style={{ marginBottom: 14 }}>
              <div style={{ fontFamily: 'DM Serif Display', fontSize: 28, color: 'var(--green-lt)', lineHeight: 1, marginBottom: 3 }}>
                {isLease || isSLB ? <>{fmt(property.monthlyRent)}<span style={{ fontSize: 14, color: 'var(--text-3)', fontFamily: 'Geist', fontWeight: 400 }}>/mo</span></> : fmt(property.askingPrice)}
              </div>
              {(isPurch || isSLB || isLand) && property.askingPrice && isLease && <div style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 4 }}>Purchase price: {fmt(property.askingPrice)}</div>}
              {property.capRate && <div style={{ fontSize: 12, color: 'var(--amber-lt)', fontFamily: 'Geist Mono', marginBottom: 4 }}>{property.capRate}% cap rate</div>}
              <div style={{ fontSize: 11, color: 'var(--text-3)', marginBottom: 20, fontFamily: 'Geist Mono' }}>{fmtSqft(property.sqft)}</div>

              {isMine ? (
                <div style={{ padding: 12, background: 'var(--char-3)', borderRadius: 7, fontSize: 13, color: 'var(--text-2)', textAlign: 'center', marginBottom: 12 }}>This is your listing</div>
              ) : (
                <>
                  <button onClick={() => { if (!user) navigate('/login'); else setShowOffer(true); }}
                    className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginBottom: 9, padding: 13 }}>
                    <FileText size={15}/> Submit Offer + Get Contracts
                  </button>
                  <button onClick={downloadNDA} className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center', marginBottom: 9 }}>
                    <Download size={13}/> Download NDA First
                  </button>
                </>
              )}

              <div className="divider"/>
              {[
                { icon: <Shield size={13}/>, t: 'Broker-verified listing' },
                { icon: <FileText size={13}/>, t: `${docList.length} contracts generated instantly` },
                { icon: <CheckCircle size={13}/>, t: property.cannabisZoned ? 'Cannabis zoning confirmed' : 'Verify zoning in due diligence' },
                { icon: <DollarSign size={13}/>, t: '2% platform fee — from owner at close' },
              ].map(i => (
                <div key={i.t} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', fontSize: 12, color: 'var(--text-3)', marginBottom: 9 }}>
                  <span style={{ color: 'var(--green-lt)', marginTop: 1 }}>{i.icon}</span>{i.t}
                </div>
              ))}
            </div>

            <div className="card" style={{ padding: 16 }}>
              <div style={{ fontSize: 11, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.5px', fontFamily: 'Geist Mono', fontWeight: 600, marginBottom: 6 }}>Listed by</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--cream)', marginBottom: 3 }}>{property.brokerName || 'Verified Broker'}</div>
              {property.brokerLicense && <div style={{ fontSize: 12, color: 'var(--text-3)', fontFamily: 'Geist Mono' }}>Lic: {property.brokerLicense}</div>}
            </div>
          </div>
        </div>
      </div>

      {/* OFFER MODAL */}
      {showOffer && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowOffer(false)}>
          <div className="modal modal-lg">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ fontSize: 22, color: 'var(--cream)' }}>Submit Offer + Generate Contracts</h2>
              <button onClick={() => setShowOffer(false)} className="btn btn-ghost"><X size={18}/></button>
            </div>

            {done ? (
              <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                <CheckCircle size={56} style={{ color: 'var(--green-lt)', margin: '0 auto 18px' }}/>
                <h3 style={{ fontSize: 22, marginBottom: 10, color: 'var(--cream)' }}>Offer Submitted!</h3>
                <p style={{ color: 'var(--text-2)', marginBottom: 10 }}>Documents downloaded:</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 20, fontSize: 13, color: 'var(--text-3)' }}>
                  {docList.map(d => <div key={d}>✓ {d}</div>)}
                </div>
                <p style={{ color: 'var(--text-3)', fontSize: 13 }}>Redirecting to your transaction dashboard…</p>
              </div>
            ) : (
              <>
                <div style={{ background: 'var(--green-faint)', border: '1px solid rgba(22,163,74,0.2)', borderRadius: 8, padding: 14, marginBottom: 22, fontSize: 13, color: 'var(--text-2)' }}>
                  On submit: <strong style={{ color: 'var(--green-lt)' }}>{docList.join(', ')}</strong> will download automatically, pre-filled with your offer terms.
                </div>

                {(isLease || isSLB) && (
                  <div className="form-row">
                    <div className="form-group">
                      <label>Monthly Rent Offer</label>
                      <input type="number" placeholder={property.monthlyRent} value={offerData.monthlyRent} onChange={e => setOfferData({ ...offerData, monthlyRent: e.target.value })}/>
                      <span className="help-text">Asking: {fmt(property.monthlyRent)}/mo</span>
                    </div>
                    <div className="form-group">
                      <label>Lease Term (years)</label>
                      <select value={offerData.leaseYears} onChange={e => setOfferData({ ...offerData, leaseYears: e.target.value })}>
                        {[1,2,3,5,7,10].map(n => <option key={n} value={n}>{n} year{n > 1 ? 's' : ''}</option>)}
                      </select>
                    </div>
                  </div>
                )}

                {(isPurch || isSLB || isLand) && (
                  <div className="form-group">
                    <label>Purchase Price Offer</label>
                    <input type="number" placeholder={property.askingPrice} value={offerData.offerPrice} onChange={e => setOfferData({ ...offerData, offerPrice: e.target.value })} style={{ fontSize: 20, fontFamily: 'DM Serif Display' }}/>
                    <span className="help-text">Asking: {fmt(property.askingPrice)}</span>
                  </div>
                )}

                <div className="form-group">
                  <label>Message to Broker / Owner (optional)</label>
                  <textarea rows={3} value={offerData.message} onChange={e => setOfferData({ ...offerData, message: e.target.value })}
                    placeholder="Introduce yourself, your cannabis license status, intended use, and any questions…"/>
                </div>

                <div style={{ background: 'var(--char-3)', borderRadius: 7, padding: 12, fontSize: 12, color: 'var(--text-3)', marginBottom: 20 }}>
                  Platform fee (2%): <strong style={{ color: 'var(--text-2)' }}>
                    {fmt(((isLease || isSLB) ? (Number(offerData.monthlyRent) || property.monthlyRent) * 12 : (Number(offerData.offerPrice) || property.askingPrice)) * 0.02)}
                  </strong> — paid by owner/landlord at closing
                </div>

                <div style={{ display: 'flex', gap: 10 }}>
                  <button onClick={() => setShowOffer(false)} className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>Cancel</button>
                  <button onClick={submitOffer} className="btn btn-primary" style={{ flex: 2, justifyContent: 'center' }} disabled={generating}>
                    {generating ? <><span className="spinner"/> Generating…</> : <><FileText size={15}/> Submit + Download Contracts</>}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
