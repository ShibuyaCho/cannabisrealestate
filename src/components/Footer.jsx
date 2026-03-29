import { Link } from 'react-router-dom';
import { Building2 } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{ background: 'var(--char-2)', borderTop: '1px solid var(--border)', padding: '48px 0 28px', marginTop: 'auto' }}>
      <div className="container">

        {/* ── Desktop grid / Mobile stack ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 32, marginBottom: 40 }}>

          {/* Brand */}
          <div style={{ gridColumn: 'span 1' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 12 }}>
              <div style={{ width: 30, height: 30, background: 'var(--green)', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Building2 size={15} color="#fff" />
              </div>
              <span style={{ fontFamily: 'DM Serif Display', fontSize: 15, color: 'var(--cream)', lineHeight: 1.2 }}>Cannabis Real Estate Brokers</span>
            </div>
            <p style={{ fontSize: 13, color: 'var(--text-3)', lineHeight: 1.7 }}>
              The commercial property marketplace for cannabis operators. Every deal comes with the contracts.
            </p>
          </div>

          {/* Link columns */}
          {[
            { h: 'Marketplace', links: [{ to: '/properties', l: 'Browse Properties' }, { to: '/list', l: 'List a Property' }, { to: '/how-it-works', l: 'How It Works' }] },
            { h: 'Account', links: [{ to: '/register', l: 'Create Account' }, { to: '/login', l: 'Sign In' }, { to: '/dashboard', l: 'Dashboard' }, { to: '/transactions', l: 'Transactions' }] },
            { h: 'Company', links: [{ to: '#', l: 'Terms of Service' }, { to: '#', l: 'Privacy Policy' }, { to: '#', l: 'Contact' }] },
          ].map(col => (
            <div key={col.h}>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 12, fontFamily: 'Geist Mono' }}>{col.h}</div>
              {col.links.map(l => (
                <div key={l.l} style={{ marginBottom: 9 }}>
                  <Link to={l.to} style={{ fontSize: 13, color: 'var(--text-3)', textDecoration: 'none', transition: 'color 0.15s' }}
                    onMouseEnter={e => e.target.style.color = 'var(--green-lt)'}
                    onMouseLeave={e => e.target.style.color = 'var(--text-3)'}>{l.l}</Link>
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="glow-line" style={{ marginBottom: 18 }} />

        {/* Bottom bar — stacks on mobile */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ fontSize: 12, color: 'var(--text-3)' }}>
            © {new Date().getFullYear()} Cannabis Real Estate Brokers. All rights reserved.
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-3)', lineHeight: 1.6 }}>
            Not a licensed real estate brokerage. Not legal advice. All transactions require licensed professionals. Cannabis operations subject to state and local law.
          </div>
        </div>

      </div>

      <style>{`
        @media (max-width: 768px) {
          footer .container > div:first-child {
            grid-template-columns: 1fr 1fr !important;
            gap: 24px !important;
          }
        }
        @media (max-width: 480px) {
          footer .container > div:first-child {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </footer>
  );
}
