import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Building2, ChevronDown, LayoutDashboard, User, FileText, LogOut, Menu, X } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [drop, setDrop]         = useState(false);
  const [mobileOpen, setMobile] = useState(false);

  const active   = p => pathname === p || pathname.startsWith(p + '/');
  const doLogout = () => { logout(); navigate('/'); setDrop(false); setMobile(false); };
  const closeAll = () => { setDrop(false); setMobile(false); };

  useEffect(() => { setMobile(false); setDrop(false); }, [pathname]);

  const NAV_LINKS = [
    { path: '/properties',   label: 'Browse Properties' },
    { path: '/list',         label: 'List a Property'   },
    { path: '/how-it-works', label: 'How It Works'      },
  ];

  const USER_LINKS = [
    { icon: <LayoutDashboard size={15}/>, label: user?.role === 'admin' ? 'Admin Panel' : 'Dashboard', to: user?.role === 'admin' ? '/admin' : '/dashboard' },
    { icon: <FileText size={15}/>,        label: 'Transactions', to: '/transactions' },
    { icon: <User size={15}/>,            label: 'Profile',      to: '/profile'      },
  ];

  return (
    <>
      <nav style={{ background: 'rgba(14,18,16,0.97)', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, zIndex: 100, backdropFilter: 'blur(16px)' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', height: 60, gap: 12 }}>

          {/* Logo */}
          <Link to="/" onClick={closeAll} style={{ display: 'flex', alignItems: 'center', gap: 9, textDecoration: 'none', flexShrink: 0 }}>
            <div style={{ width: 32, height: 32, background: 'var(--green)', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Building2 size={16} color="#fff" />
            </div>
            <div>
              <div style={{ fontFamily: 'DM Serif Display', fontSize: 15, color: 'var(--cream)', lineHeight: 1.15 }}>
                <span className="nav-full">Cannabis Real Estate Brokers</span>
                <span className="nav-short">CREB</span>
              </div>
              <div className="nav-full" style={{ fontSize: 10, color: 'var(--text-3)', letterSpacing: '1px', textTransform: 'uppercase', fontFamily: 'Geist Mono' }}>Commercial Property Marketplace</div>
            </div>
          </Link>

          {/* Desktop links */}
          <div className="nav-links" style={{ display: 'flex', gap: 2, flex: 1 }}>
            {NAV_LINKS.map(({ path, label }) => (
              <Link key={path} to={path} style={{ padding: '6px 11px', borderRadius: 6, fontSize: 13, fontWeight: 500, color: active(path) ? 'var(--green-lt)' : 'var(--text-2)', background: active(path) ? 'var(--green-faint)' : 'transparent', textDecoration: 'none', transition: 'all 0.15s', whiteSpace: 'nowrap' }}>{label}</Link>
            ))}
          </div>

          <div style={{ flex: 1 }} className="mob-spacer" />

          {/* Desktop auth */}
          <div className="nav-auth">
            {user ? (
              <div style={{ position: 'relative' }}>
                <button onClick={() => setDrop(!drop)} style={{ display: 'flex', alignItems: 'center', gap: 7, background: 'var(--char-3)', border: '1px solid var(--border-lt)', borderRadius: 8, padding: '6px 11px', cursor: 'pointer' }}>
                  <div style={{ width: 26, height: 26, background: 'var(--green)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'DM Serif Display', fontSize: 12, color: '#fff', flexShrink: 0 }}>
                    {user.firstName?.[0]}{user.lastName?.[0]}
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>{user.firstName}</span>
                  <ChevronDown size={12} color="var(--text-3)" />
                </button>
                {drop && <>
                  <div style={{ position: 'fixed', inset: 0, zIndex: 149 }} onClick={() => setDrop(false)} />
                  <div style={{ position: 'absolute', top: '110%', right: 0, zIndex: 200, background: 'var(--char-2)', border: '1px solid var(--border-lt)', borderRadius: 10, width: 210, boxShadow: 'var(--shadow-lg)', overflow: 'hidden' }}>
                    <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)' }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--cream)' }}>{user.firstName} {user.lastName}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-3)', fontFamily: 'Geist Mono' }}>{user.email}</div>
                    </div>
                    {USER_LINKS.map(item => (
                      <Link key={item.to} to={item.to} onClick={closeAll} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', color: 'var(--text-2)', fontSize: 13, textDecoration: 'none' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--char-3)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                        <span style={{ color: 'var(--text-3)' }}>{item.icon}</span>{item.label}
                      </Link>
                    ))}
                    <div style={{ borderTop: '1px solid var(--border)' }}>
                      <button onClick={doLogout} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', color: 'var(--danger-lt)', fontSize: 13, background: 'transparent', border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left' }}
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
                <Link to="/register" className="btn btn-primary btn-sm">Join</Link>
              </div>
            )}
          </div>

          {/* Hamburger */}
          <button className="hamburger" onClick={() => setMobile(!mobileOpen)} style={{ background: 'transparent', border: 'none', color: 'var(--text-2)', cursor: 'pointer', padding: 6, display: 'flex', alignItems: 'center' }}>
            {mobileOpen ? <X size={22}/> : <Menu size={22}/>}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      {mobileOpen && (
        <>
          <div style={{ position: 'fixed', inset: 0, zIndex: 98, background: 'rgba(0,0,0,0.5)' }} onClick={() => setMobile(false)} />
          <div style={{ position: 'fixed', top: 60, left: 0, right: 0, zIndex: 99, background: 'var(--char-2)', borderBottom: '1px solid var(--border)', boxShadow: 'var(--shadow-lg)', paddingBottom: 16 }}>
            {NAV_LINKS.map(({ path, label }) => (
              <Link key={path} to={path} onClick={closeAll} style={{ display: 'block', padding: '14px 24px', fontSize: 15, fontWeight: 500, color: active(path) ? 'var(--green-lt)' : 'var(--text-2)', background: active(path) ? 'var(--green-faint)' : 'transparent', textDecoration: 'none', borderLeft: active(path) ? '3px solid var(--green)' : '3px solid transparent' }}>{label}</Link>
            ))}
            <div style={{ height: 1, background: 'var(--border)', margin: '8px 0' }} />
            {user ? (
              <>
                <div style={{ padding: '10px 24px 6px', fontSize: 11, color: 'var(--text-3)', fontFamily: 'Geist Mono', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{user.firstName} {user.lastName}</div>
                {USER_LINKS.map(item => (
                  <Link key={item.to} to={item.to} onClick={closeAll} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 24px', color: 'var(--text-2)', fontSize: 14, textDecoration: 'none' }}>
                    <span style={{ color: 'var(--text-3)' }}>{item.icon}</span>{item.label}
                  </Link>
                ))}
                <div style={{ height: 1, background: 'var(--border)', margin: '8px 0' }} />
                <button onClick={doLogout} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 24px', color: 'var(--danger-lt)', fontSize: 14, background: 'transparent', border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left' }}>
                  <LogOut size={15}/> Sign Out
                </button>
              </>
            ) : (
              <div style={{ display: 'flex', gap: 10, padding: '12px 24px' }}>
                <Link to="/login" onClick={closeAll} className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>Sign In</Link>
                <Link to="/register" onClick={closeAll} className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>Create Account</Link>
              </div>
            )}
          </div>
        </>
      )}

      <style>{`
        .nav-short  { display: none; }
        .hamburger  { display: none; }
        .mob-spacer { display: none; }
        @media (max-width: 768px) {
          .nav-links  { display: none !important; }
          .nav-auth   { display: none !important; }
          .hamburger  { display: flex !important; }
          .mob-spacer { display: block !important; }
          .nav-full   { display: none; }
          .nav-short  { display: inline; }
        }
      `}</style>
    </>
  );
}
