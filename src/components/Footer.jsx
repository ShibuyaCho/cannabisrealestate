import { Link } from 'react-router-dom';
import { Building2 } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{ background: 'var(--char-2)', borderTop: '1px solid var(--border)', padding: '48px 0 28px', marginTop: 'auto' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 36, marginBottom: 40 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 14 }}>
              <div style={{ width: 30, height: 30, background: 'var(--green)', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Building2 size={15} color="#fff" />
              </div>
              <span style={{ fontFamily: 'DM Serif Display', fontSize: 15, color: 'var(--cream)' }}>Cannabis Real Estate Brokers</span>
            </div>
            <p style={{ fontSize: 13, color: 'var(--text-3)', lineHeight: 1.7, maxWidth: 220 }}>
              The commercial property marketplace for cannabis operators. Every deal comes with the contracts.
            </p>
          </div>
          {[
            { h: 'Marketplace', links: [{ to: '/properties', l: 'Browse Properties' }, { to: '/list', l: 'List a Property' }, { to: '/how-it-works', l: 'How It Works' }] },
            { h: 'Account', links: [{ to: '/register', l: 'Create Account' }, { to: '/login', l: 'Sign In' }, { to: '/dashboard', l: 'Dashboard' }, { to: '/transactions', l: 'Transactions' }] },
            { h: 'Company', links: [{ to: '#', l: 'Terms of Service' }, { to: '#', l: 'Privacy Policy' }, { to: '#', l: 'Contact' }] },
          ].map(col => (
            <div key={col.h}>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 14, fontFamily: 'Geist Mono' }}>{col.h}</div>
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
        <div className="glow-line" style={{ marginBottom: 20 }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
          <div style={{ fontSize: 12, color: 'var(--text-3)' }}>© {new Date().getFullYear()} Cannabis Real Estate Brokers. All rights reserved.</div>
          <div style={{ fontSize: 11, color: 'var(--text-3)', maxWidth: 480, textAlign: 'right', lineHeight: 1.6 }}>
            Not a licensed real estate brokerage. Not legal advice. All transactions require licensed professionals. Cannabis operations subject to state and local law.
          </div>
        </div>
      </div>
    </footer>
  );
}
