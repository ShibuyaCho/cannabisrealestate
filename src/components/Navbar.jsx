import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Building2, ChevronDown, LayoutDashboard, User, FileText, LogOut, Shield } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [drop, setDrop] = useState(false);

  const active = p => pathname === p || pathname.startsWith(p + '/');
  const doLogout = () => { logout(); navigate('/'); setDrop(false); };

  return (
    <nav style={{
      background: 'rgba(14,18,16,0.96)',
      borderBottom: '1px solid var(--border)',
      position: 'sticky', top: 0, zIndex: 100,
      backdropFilter: 'blur(16px)',
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', height: 64, gap: 32 }}>

        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', flexShrink: 0 }}>
          <div style={{ width: 34, height: 34, background: 'var(--green)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Building2 size={17} color="#fff" />
          </div>
          <div>
            <div style={{ fontFamily: 'DM Serif Display', fontWeight: 400, fontSize: 16, color: 'var(--cream)', letterSpacing: '0.1px', lineHeight: 1.1 }}>Cannabis Real Estate Brokers</div>
            <div style={{ fontSize: 10, color: 'var(--text-3)', letterSpacing: '1px', textTransform: 'uppercase', fontFamily: 'Geist Mono' }}>Commercial Property Marketplace</div>
          </div>
        </Link>

        {/* Links */}
        <div style={{ display: 'flex', gap: 2, flex: 1 }}>
          {[
            { path: '/properties', label: 'Browse Properties' },
            { path: '/list', label: 'List a Property' },
            { path: '/how-it-works', label: 'How It Works' },
          ].map(({ path, label }) => (
            <Link key={path} to={path} style={{
              padding: '6px 13px', borderRadius: 6, fontSize: 13.5, fontWeight: 500,
              color: active(path) ? 'var(--green-lt)' : 'var(--text-2)',
              background: active(path) ? 'var(--green-faint)' : 'transparent',
              textDecoration: 'none', transition: 'all 0.15s',
            }}>{label}</Link>
          ))}
        </div>

        {/* Auth */}
        {user ? (
          <div style={{ position: 'relative' }}>
            <button onClick={() => setDrop(!drop)} style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: 'var(--char-3)', border: '1px solid var(--border-lt)',
              borderRadius: 8, padding: '7px 12px', cursor: 'pointer',
            }}>
              <div style={{ width: 28, height: 28, background: 'var(--green)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'DM Serif Display', fontWeight: 400, fontSize: 13, color: '#fff' }}>
                {user.firstName?.[0]}{user.lastName?.[0]}
              </div>
              <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>{user.firstName}</span>
              <ChevronDown size={13} color="var(--text-3)" />
            </button>

            {drop && <>
              <div style={{ position: 'fixed', inset: 0, zIndex: 149 }} onClick={() => setDrop(false)} />
              <div style={{ position: 'absolute', top: '110%', right: 0, zIndex: 200, background: 'var(--char-2)', border: '1px solid var(--border-lt)', borderRadius: 10, width: 210, boxShadow: 'var(--shadow-lg)', overflow: 'hidden' }}>
                <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--cream)' }}>{user.firstName} {user.lastName}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-3)', fontFamily: 'Geist Mono' }}>{user.email}</div>
                </div>
                {[
                  { icon: <LayoutDashboard size={14}/>, label: user.role === 'admin' ? 'Admin Panel' : 'Dashboard', to: user.role === 'admin' ? '/admin' : '/dashboard' },
                  { icon: <FileText size={14}/>, label: 'Transactions', to: '/transactions' },
                  { icon: <User size={14}/>, label: 'Profile', to: '/profile' },
                ].map(item => (
                  <Link key={item.to} to={item.to} onClick={() => setDrop(false)}
                    style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', color: 'var(--text-2)', fontSize: 13, textDecoration: 'none' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--char-3)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <span style={{ color: 'var(--text-3)' }}>{item.icon}</span>{item.label}
                  </Link>
                ))}
                <div style={{ borderTop: '1px solid var(--border)' }}>
                  <button onClick={doLogout}
                    style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', color: 'var(--danger-lt)', fontSize: 13, background: 'transparent', border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--char-3)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <LogOut size={14}/> Sign Out
                  </button>
                </div>
              </div>
            </>}
          </div>
        ) : (
          <div style={{ display: 'flex', gap: 8 }}>
            <Link to="/login" className="btn btn-ghost btn-sm">Sign In</Link>
            <Link to="/register" className="btn btn-primary btn-sm">Create Account</Link>
          </div>
        )}
      </div>
    </nav>
  );
}
