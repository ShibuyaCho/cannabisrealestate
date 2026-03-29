import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search, ArrowRight, CheckCircle, Building2, FileText,
  MapPin, Zap, Lock, ClipboardList, Users, DollarSign
} from 'lucide-react';
import { getProperties, fmt, fmtSqft } from '../utils/store';

const DEAL_LABELS = {
  lease: 'For Lease',
  purchase: 'For Sale',
  sale_leaseback: 'Sale-Leaseback',
  land: 'Land / Dev',
};

export default function HomePage() {
  const navigate  = useNavigate();
  const [q, setQ] = useState('');
  const [dealType, setDealType] = useState('');
  const featured  = getProperties().filter(p => p.status === 'active').slice(0, 3);

  const go = e => {
    e.preventDefault();
    const p = new URLSearchParams();
    if (q) p.set('q', q);
    if (dealType) p.set('dealType', dealType);
    navigate(`/properties?${p}`);
  };

  return (
    <div>

      {/* ── HERO ── */}
      <section style={{
        padding: '100px 0 80px',
        background: 'linear-gradient(170deg, var(--char-2) 0%, var(--char) 100%)',
        borderBottom: '1px solid var(--border)',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Subtle dot grid */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(var(--border) 1px, transparent 1px)', backgroundSize: '32px 32px', opacity: 0.5, pointerEvents: 'none' }} />
        {/* Green glow */}
        <div style={{ position: 'absolute', bottom: -200, right: -100, width: 700, height: 700, background: 'radial-gradient(circle, rgba(22,163,74,0.05) 0%, transparent 60%)', pointerEvents: 'none', borderRadius: '50%' }} />

        <div className="container" style={{ position: 'relative' }}>
          <div style={{ maxWidth: 720 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'var(--char-3)', border: '1px solid var(--border-lt)', borderRadius: 4, padding: '6px 14px', fontSize: 11, color: 'var(--green-lt)', fontWeight: 600, marginBottom: 28, fontFamily: 'Geist Mono', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
              <Building2 size={11}/> Cannabis Commercial Real Estate
            </div>

            <h1 style={{ fontSize: 'clamp(40px, 5.5vw, 68px)', lineHeight: 1.08, marginBottom: 24, color: 'var(--cream)', letterSpacing: '-0.5px' }}>
              Find, Lease, or Buy<br />
              <em style={{ color: 'var(--green-lt)', fontStyle: 'italic' }}>Cannabis-Ready</em> Property.
            </h1>

            <p style={{ fontSize: 17, color: 'var(--text-2)', maxWidth: 560, marginBottom: 44, lineHeight: 1.75, fontWeight: 300 }}>
              Commercial leases, purchases, sale-leasebacks, and entitled land — all with cannabis addenda, zoning confirmations, and deal contracts generated automatically.
            </p>

            {/* Search */}
            <form onSubmit={go} style={{ display: 'flex', gap: 10, maxWidth: 600, flexWrap: 'wrap' }}>
              <div style={{ flex: 2, position: 'relative', minWidth: 200 }}>
                <Search size={15} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)', pointerEvents: 'none' }}/>
                <input value={q} onChange={e => setQ(e.target.value)} placeholder="City, state, property type…"
                  style={{ paddingLeft: 40, background: 'rgba(27,36,32,0.9)', border: '1.5px solid var(--border-lt)' }}/>
              </div>
              <select value={dealType} onChange={e => setDealType(e.target.value)} style={{ flex: 1, minWidth: 150, background: 'rgba(27,36,32,0.9)', border: '1.5px solid var(--border-lt)' }}>
                <option value="">All Deal Types</option>
                <option value="lease">Commercial Lease</option>
                <option value="purchase">Purchase & Sale</option>
                <option value="sale_leaseback">Sale-Leaseback</option>
                <option value="land">Land / Development</option>
              </select>
              <button type="submit" className="btn btn-primary">Search <ArrowRight size={15}/></button>
            </form>

            <p style={{ fontSize: 13, color: 'var(--text-3)', marginTop: 20 }}>
              Free to browse · 2% platform fee at closing only
            </p>
          </div>
        </div>
      </section>

      {/* ── DEAL TYPES ── */}
      <section style={{ padding: '80px 0', background: 'var(--char)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: 36, marginBottom: 10, color: 'var(--cream)' }}>Every Cannabis Deal Structure</h2>
            <p style={{ fontSize: 15, color: 'var(--text-2)' }}>One platform. Four deal types. All with contracts.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
            {[
              { icon: '🏪', type: 'lease',          label: 'Commercial Lease',   desc: 'Retail dispensaries, grow facilities, labs. Full lease with cannabis addendum generated on offer.' },
              { icon: '🏗️', type: 'purchase',       label: 'Purchase & Sale',    desc: 'Buy cannabis-zoned properties outright. PSA with cannabis provisions and escrow terms.' },
              { icon: '🔄', type: 'sale_leaseback',  label: 'Sale-Leaseback',     desc: 'Sell your property and lease it back. Specialized agreement covers both the sale and leaseback terms.' },
              { icon: '🌱', type: 'land',            label: 'Land & Development', desc: 'Entitled land for cultivation, processing, or retail development. Development-ready purchase agreements.' },
            ].map(d => (
              <Link key={d.type} to={`/properties?dealType=${d.type}`} style={{ textDecoration: 'none' }}>
                <div className="card" style={{ cursor: 'pointer', transition: 'all 0.2s', height: '100%' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--green-dim)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'none'; }}>
                  <div style={{ fontSize: 28, marginBottom: 12 }}>{d.icon}</div>
                  <h3 style={{ fontSize: 16, marginBottom: 8, color: 'var(--cream)' }}>{d.label}</h3>
                  <p style={{ fontSize: 13, color: 'var(--text-3)', lineHeight: 1.65 }}>{d.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED ── */}
      {featured.length > 0 && (
        <section style={{ padding: '80px 0', background: 'var(--char-2)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
          <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 32, flexWrap: 'wrap', gap: 12 }}>
              <div>
                <h2 style={{ fontSize: 32, color: 'var(--cream)', marginBottom: 4 }}>Featured Properties</h2>
                <p style={{ fontSize: 13, color: 'var(--text-3)', fontFamily: 'Geist Mono' }}>Verified cannabis zoning · Contracts ready</p>
              </div>
              <Link to="/properties" className="btn btn-secondary btn-sm">All Properties <ArrowRight size={14}/></Link>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
              {featured.map(p => <PropertyCard key={p.id} property={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* ── FEATURES ── */}
      <section style={{ padding: '80px 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <h2 style={{ fontSize: 36, marginBottom: 10, color: 'var(--cream)' }}>Built for Cannabis Real Estate</h2>
            <p style={{ fontSize: 15, color: 'var(--text-2)', maxWidth: 500, margin: '0 auto' }}>The four things that make every cannabis property deal harder than it should be — solved.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
            {[
              {
                icon: <FileText size={26}/>, color: 'var(--green)', bg: 'var(--green-faint)',
                title: 'Auto-Generated Contracts',
                desc: 'Submit an offer and instantly receive an NDA, Letter of Intent, and either a Commercial Lease with Cannabis Addendum, PSA, or Sale-Leaseback Agreement — pre-filled with your terms.',
                items: ['Cannabis Use NDA', 'Letter of Intent', 'Commercial Lease + Cannabis Addendum', 'Purchase & Sale Agreement', 'Sale-Leaseback Agreement'],
              },
              {
                icon: <ClipboardList size={26}/>, color: 'var(--amber)', bg: 'var(--amber-dim)',
                title: 'Zoning & Compliance',
                desc: 'Every listing shows cannabis zoning status, CUP requirements, buffer zone notes, and state-specific licensing guidance — before you commit to due diligence.',
                items: ['Zoning status on every listing', 'State-specific licensing notes', 'CUP and local permit guidance', 'Buffer zone information'],
              },
              {
                icon: <Users size={26}/>, color: '#a78bfa', bg: 'rgba(167,139,250,0.1)',
                title: 'Broker & Owner Connect',
                desc: 'Every listing is posted by a verified broker or property owner. Communicate directly inside your transaction — no third-party referral fees.',
                items: ['Direct broker contact', 'In-transaction messaging', 'Verified listing owners', 'No referral splits'],
              },
              {
                icon: <Lock size={26}/>, color: 'var(--info)', bg: 'var(--info-bg)',
                title: 'Deal Tracking Pipeline',
                desc: 'From LOI to keys in hand — your transaction dashboard tracks every milestone: NDA, due diligence, zoning confirmation, contract signing, financing, and closing.',
                items: ['LOI to close pipeline', 'Zoning confirmation step', 'Financing / escrow tracking', 'Cannabis license verification step'],
              },
            ].map(f => (
              <div key={f.title} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 16, transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-lt)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'none'; }}>
                <div style={{ width: 50, height: 50, background: f.bg, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: f.color }}>
                  {f.icon}
                </div>
                <h3 style={{ fontSize: 18, color: 'var(--cream)' }}>{f.title}</h3>
                <p style={{ fontSize: 13.5, color: 'var(--text-2)', lineHeight: 1.75, flex: 1 }}>{f.desc}</p>
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: 12, display: 'flex', flexDirection: 'column', gap: 7 }}>
                  {f.items.map(item => (
                    <div key={item} style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 13, color: 'var(--text-2)' }}>
                      <CheckCircle size={13} style={{ color: f.color, flexShrink: 0 }}/>{item}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOR OWNERS / FOR TENANTS ── */}
      <section style={{ padding: '80px 0', background: 'var(--char-2)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <AudienceCards />
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: '80px 0', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: 580 }}>
          <h2 style={{ fontSize: 40, marginBottom: 16, color: 'var(--cream)' }}>Ready to Find Your Space?</h2>
          <p style={{ fontSize: 16, color: 'var(--text-2)', marginBottom: 36, lineHeight: 1.75 }}>
            Create a free account. Browse immediately. Platform fee is 2% — from the owner only, at closing.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn btn-primary btn-xl">Create Free Account <ArrowRight size={17}/></Link>
            <Link to="/how-it-works" className="btn btn-secondary btn-xl">How It Works</Link>
          </div>
        </div>
      </section>

    </div>
  );
}

// ── Audience Cards — grid on desktop, swipeable carousel on mobile ────────────
function AudienceCards() {
  const [active, setActive] = useState(0);

  const cards = [
    {
      badge: { bg: 'var(--green-faint)', border: 'rgba(22,163,74,0.25)', color: 'var(--green-lt)', icon: <Building2 size={11}/>, label: 'For Property Owners' },
      title: 'List Your Cannabis Property',
      desc: 'Reach qualified cannabis operators actively looking for space. Every offer arrives with a signed NDA and completed LOI — no chasing tenants or buyers for paperwork.',
      items: ['10-minute property listing form', 'All 4 deal types supported', 'Zoning and CUP details shown upfront', 'Every offer comes with signed NDA + LOI', '2% platform fee — paid only at close'],
      checkColor: 'var(--green-lt)',
      cta: { to: '/list', label: 'List a Property', cls: 'btn-primary' },
    },
    {
      badge: { bg: 'var(--amber-dim)', border: 'rgba(217,119,6,0.25)', color: 'var(--amber-lt)', icon: <Search size={11}/>, label: 'For Operators & Buyers' },
      title: 'Find Your Next Location',
      desc: 'Every listing shows zoning status, cannabis permitting notes, and deal structure before you waste time on due diligence. Submit an offer and get all contracts instantly.',
      items: ['Filter by deal type, state, property type', 'Zoning status and CUP requirements shown', 'Free NDA download before committing', 'All contracts generated on offer submit', 'Track from LOI to keys in hand'],
      checkColor: 'var(--amber-lt)',
      cta: { to: '/properties', label: 'Browse Properties', cls: 'btn-outline-green' },
    },
  ];

  return (
    <>
      {/* ── Desktop: side-by-side grid ── */}
      <div className="audience-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {cards.map(c => <AudienceCard key={c.title} card={c} />)}
      </div>

      {/* ── Mobile: carousel ── */}
      <div className="audience-carousel">
        {/* Dot tabs */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 20, justifyContent: 'center' }}>
          {cards.map((c, i) => (
            <button key={i} onClick={() => setActive(i)} style={{
              padding: '7px 20px', borderRadius: 20, fontSize: 12, fontWeight: 600,
              fontFamily: 'Geist Mono', textTransform: 'uppercase', letterSpacing: '0.4px',
              cursor: 'pointer', border: 'none', transition: 'all 0.2s',
              background: active === i ? (i === 0 ? 'var(--green)' : 'var(--amber)') : 'var(--char-3)',
              color: active === i ? '#fff' : 'var(--text-3)',
            }}>
              {i === 0 ? 'List' : 'Find'}
            </button>
          ))}
        </div>

        {/* Slide track */}
        <div style={{ overflow: 'hidden', borderRadius: 13 }}>
          <div style={{ display: 'flex', transition: 'transform 0.35s cubic-bezier(0.4,0,0.2,1)', transform: `translateX(-${active * 100}%)` }}>
            {cards.map(c => (
              <div key={c.title} style={{ minWidth: '100%' }}>
                <AudienceCard card={c} />
              </div>
            ))}
          </div>
        </div>

        {/* Swipe hint dots */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 16 }}>
          {cards.map((_, i) => (
            <div key={i} onClick={() => setActive(i)} style={{
              width: active === i ? 20 : 6, height: 6, borderRadius: 3,
              background: active === i ? 'var(--green)' : 'var(--border-lt)',
              cursor: 'pointer', transition: 'all 0.3s',
            }}/>
          ))}
        </div>
      </div>

      <style>{`
        .audience-carousel { display: none; }
        @media (max-width: 768px) {
          .audience-grid     { display: none !important; }
          .audience-carousel { display: block; }
        }
      `}</style>
    </>
  );
}

function AudienceCard({ card: c }) {
  return (
    <div className="card" style={{ padding: 32 }}>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: c.badge.bg, border: `1px solid ${c.badge.border}`, borderRadius: 5, padding: '5px 12px', fontSize: 11, color: c.badge.color, fontWeight: 600, fontFamily: 'Geist Mono', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 18 }}>
        {c.badge.icon} {c.badge.label}
      </div>
      <h3 style={{ fontSize: 22, marginBottom: 12, color: 'var(--cream)' }}>{c.title}</h3>
      <p style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.8, marginBottom: 20 }}>{c.desc}</p>
      {c.items.map(i => (
        <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 10, alignItems: 'flex-start' }}>
          <CheckCircle size={14} style={{ color: c.checkColor, marginTop: 2, flexShrink: 0 }} />
          <span style={{ fontSize: 13.5, color: 'var(--text-2)' }}>{i}</span>
        </div>
      ))}
      <Link to={c.cta.to} className={`btn ${c.cta.cls}`} style={{ marginTop: 22 }}>
        {c.cta.label} <ArrowRight size={15}/>
      </Link>
    </div>
  );
}


  const dealBadge = {
    lease:          { label: 'For Lease',      cls: 'badge-green' },
    purchase:       { label: 'For Sale',       cls: 'badge-amber' },
    sale_leaseback: { label: 'Sale-Leaseback', cls: 'badge-info'  },
    land:           { label: 'Land / Dev',     cls: 'badge-cream' },
  };
  const badge = dealBadge[p.dealType] || { label: p.dealType, cls: 'badge-gray' };

  return (
    <Link to={`/properties/${p.id}`} style={{ textDecoration: 'none' }}>
      <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column', cursor: 'pointer', transition: 'all 0.2s' }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--green-dim)'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = 'var(--shadow)'; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {p.featured && <span className="badge badge-amber">Featured</span>}
            <span className={`badge ${badge.cls}`}>{badge.label}</span>
            {p.cannabisZoned && <span className="badge badge-green">✓ Cannabis Zoned</span>}
          </div>
          <div style={{ textAlign: 'right' }}>
            {p.dealType === 'lease' || p.dealType === 'sale_leaseback'
              ? <><div style={{ fontFamily: 'DM Serif Display', fontSize: 20, color: 'var(--green-lt)', lineHeight: 1 }}>{fmt(p.monthlyRent)}<span style={{ fontSize: 12, color: 'var(--text-3)', fontFamily: 'Geist', fontWeight: 400 }}>/mo</span></div>{p.capRate && <div style={{ fontSize: 11, color: 'var(--amber-lt)', fontFamily: 'Geist Mono' }}>{p.capRate}% cap</div>}</>
              : <div style={{ fontFamily: 'DM Serif Display', fontSize: 20, color: 'var(--green-lt)', lineHeight: 1 }}>{fmt(p.askingPrice)}</div>
            }
          </div>
        </div>

        <h3 style={{ fontSize: 15, marginBottom: 8, lineHeight: 1.4, color: 'var(--cream)', flex: 1 }}>{p.title}</h3>

        <div style={{ display: 'flex', gap: 5, marginBottom: 10, flexWrap: 'wrap' }}>
          <span className="tag">{p.state}</span>
          <span className="tag">{p.city}</span>
          {p.sqft && <span className="tag">{p.sqft.toLocaleString()} sqft</span>}
        </div>

        <p style={{ fontSize: 13, color: 'var(--text-3)', lineHeight: 1.65, marginBottom: 14 }}>{p.description?.slice(0, 110)}…</p>

        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 10, display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-3)', fontFamily: 'Geist Mono' }}>
          <span>{p.brokerName}</span>
          <span>{p.views || 0} views</span>
        </div>
      </div>
    </Link>
  );
}
