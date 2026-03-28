import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Building2, Eye, EyeOff, ArrowRight } from 'lucide-react';

function Shell({ children, title, sub }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, background: 'var(--char)', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)', width: 600, height: 600, background: 'radial-gradient(circle, rgba(22,163,74,0.05) 0%, transparent 65%)', pointerEvents: 'none', borderRadius: '50%' }} />
      <div style={{ width: '100%', maxWidth: 460, position: 'relative' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none', marginBottom: 28 }}>
            <div style={{ width: 38, height: 38, background: 'var(--green)', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Building2 size={19} color="#fff" />
            </div>
            <span style={{ fontFamily: 'DM Serif Display', fontSize: 18, color: 'var(--cream)' }}>Cannabis Real Estate Brokers</span>
          </Link>
          <h1 style={{ fontSize: 28, marginBottom: 8, color: 'var(--cream)' }}>{title}</h1>
          <p style={{ color: 'var(--text-3)', fontSize: 14 }}>{sub}</p>
        </div>
        <div className="card" style={{ padding: 32 }}>{children}</div>
      </div>
    </div>
  );
}

export function LoginPage() {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [show, setShow] = useState(false);
  const [err, setErr]   = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async e => {
    e.preventDefault(); setErr(''); setLoading(true);
    try { const u = login(form.email, form.password); navigate(u.role === 'admin' ? '/admin' : '/dashboard'); }
    catch (e) { setErr(e.message); }
    finally { setLoading(false); }
  };

  return (
    <Shell title="Welcome back" sub="Sign in to your account">
      <form onSubmit={submit}>
        <div className="form-group">
          <label>Email</label>
          <input type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
        </div>
        <div className="form-group">
          <label>Password</label>
          <div style={{ position: 'relative' }}>
            <input type={show ? 'text' : 'password'} placeholder="••••••••" value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })} required style={{ paddingRight: 44 }} />
            <button type="button" onClick={() => setShow(!show)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-3)', cursor: 'pointer' }}>
              {show ? <EyeOff size={15}/> : <Eye size={15}/>}
            </button>
          </div>
        </div>
        {err && <p className="error-msg" style={{ marginBottom: 12 }}>{err}</p>}
        <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: 13 }} disabled={loading}>
          {loading ? <span className="spinner"/> : <>Sign In <ArrowRight size={15}/></>}
        </button>
      </form>
      <div className="divider"/>
      <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-3)' }}>
        New here? <Link to="/register">Create an account</Link>
      </p>
      <div style={{ marginTop: 14, padding: 12, background: 'var(--char-3)', borderRadius: 6, fontSize: 12, color: 'var(--text-3)', textAlign: 'center' }}>
        Demo admin: <span style={{ color: 'var(--text-2)', fontFamily: 'Geist Mono' }}>admin@cannabisrebrokers.com</span> / <span style={{ color: 'var(--text-2)', fontFamily: 'Geist Mono' }}>Admin123!</span>
      </div>
    </Shell>
  );
}

export function RegisterPage() {
  const { register } = useAuth();
  const navigate     = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', password: '', confirm: '',
    phone: '', businessName: '', brokerLicense: '', accountType: 'tenant', state: '', agreeTerms: false,
  });
  const [err, setErr]         = useState('');
  const [loading, setLoading] = useState(false);
  const [show, setShow]       = useState(false);
  const s = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const next = e => {
    e.preventDefault();
    if (!form.firstName || !form.lastName || !form.email) return setErr('Please fill all required fields.');
    if (form.password.length < 8) return setErr('Password must be at least 8 characters.');
    if (form.password !== form.confirm) return setErr('Passwords do not match.');
    setErr(''); setStep(2);
  };

  const submit = async e => {
    e.preventDefault();
    if (!form.agreeTerms) return setErr('Please agree to the Terms of Service.');
    setLoading(true); setErr('');
    try { register(form); navigate('/dashboard'); }
    catch (e) { setErr(e.message); }
    finally { setLoading(false); }
  };

  return (
    <Shell title="Create your account" sub="Join the cannabis property marketplace">
      <div style={{ display: 'flex', gap: 8, marginBottom: 26 }}>
        {['Your Info', 'Account Type'].map((l, i) => (
          <div key={l} style={{ flex: 1 }}>
            <div style={{ height: 3, borderRadius: 2, background: step > i || step === i + 1 ? 'var(--green)' : 'var(--border)', marginBottom: 5, transition: 'background 0.3s' }}/>
            <div style={{ fontSize: 11, color: step === i + 1 ? 'var(--green-lt)' : 'var(--text-3)', fontWeight: 600, fontFamily: 'Geist Mono', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{l}</div>
          </div>
        ))}
      </div>

      {step === 1 && (
        <form onSubmit={next}>
          <div className="form-row">
            <div className="form-group"><label>First Name *</label><input value={form.firstName} onChange={e => s('firstName', e.target.value)} placeholder="Jane" required /></div>
            <div className="form-group"><label>Last Name *</label><input value={form.lastName} onChange={e => s('lastName', e.target.value)} placeholder="Smith" required /></div>
          </div>
          <div className="form-group"><label>Email *</label><input type="email" value={form.email} onChange={e => s('email', e.target.value)} placeholder="jane@example.com" required /></div>
          <div className="form-group">
            <label>Password *</label>
            <div style={{ position: 'relative' }}>
              <input type={show ? 'text' : 'password'} value={form.password} onChange={e => s('password', e.target.value)} placeholder="Min. 8 characters" style={{ paddingRight: 44 }} required />
              <button type="button" onClick={() => setShow(!show)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-3)', cursor: 'pointer' }}>
                {show ? <EyeOff size={15}/> : <Eye size={15}/>}
              </button>
            </div>
          </div>
          <div className="form-group"><label>Confirm Password *</label><input type="password" value={form.confirm} onChange={e => s('confirm', e.target.value)} placeholder="••••••••" required /></div>
          {err && <p className="error-msg" style={{ marginBottom: 12 }}>{err}</p>}
          <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>Continue <ArrowRight size={15}/></button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={submit}>
          <div className="form-group"><label>Phone</label><input type="tel" value={form.phone} onChange={e => s('phone', e.target.value)} placeholder="(555) 000-0000" /></div>
          <div className="form-group"><label>Business / Company Name</label><input value={form.businessName} onChange={e => s('businessName', e.target.value)} placeholder="Your company or LLC" /></div>
          <div className="form-group"><label>RE Broker License # (if applicable)</label><input value={form.brokerLicense} onChange={e => s('brokerLicense', e.target.value)} placeholder="State RE license number" /></div>
          <div className="form-group">
            <label>I am primarily a…</label>
            <select value={form.accountType} onChange={e => s('accountType', e.target.value)}>
              <option value="tenant">Tenant / Operator — looking to lease cannabis space</option>
              <option value="buyer">Buyer — looking to purchase cannabis property</option>
              <option value="owner">Property Owner — looking to list cannabis-compliant property</option>
              <option value="broker">RE Broker / Agent</option>
              <option value="developer">Developer / Investor</option>
            </select>
          </div>
          <div className="form-group">
            <label>Primary State</label>
            <select value={form.state} onChange={e => s('state', e.target.value)}>
              <option value="">Select state…</option>
              {['California','Colorado','Washington','Oregon','Nevada','Michigan','Illinois','Florida','New York','New Jersey','Arizona','Massachusetts','Ohio','Pennsylvania','Minnesota','Missouri','Montana','Maryland','Connecticut','New Mexico','Vermont','Virginia','Delaware','Rhode Island','Alaska','Hawaii','Maine','Washington D.C.'].map(st => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>
          <div className="form-group" style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 10 }}>
            <input type="checkbox" id="terms" checked={form.agreeTerms} onChange={e => s('agreeTerms', e.target.checked)} style={{ width: 15, height: 15, marginTop: 3, flexShrink: 0 }} />
            <label htmlFor="terms" style={{ fontSize: 13, color: 'var(--text-3)', cursor: 'pointer', fontFamily: 'Geist', fontWeight: 400 }}>
              I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>. I understand cannabis real estate transactions are subject to state and local law.
            </label>
          </div>
          {err && <p className="error-msg" style={{ marginBottom: 12 }}>{err}</p>}
          <div style={{ display: 'flex', gap: 10 }}>
            <button type="button" onClick={() => { setStep(1); setErr(''); }} className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>Back</button>
            <button type="submit" className="btn btn-primary" style={{ flex: 2, justifyContent: 'center' }} disabled={loading}>
              {loading ? <span className="spinner"/> : <>Create Account <ArrowRight size={15}/></>}
            </button>
          </div>
        </form>
      )}
      <div className="divider"/>
      <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-3)' }}>
        Already have an account? <Link to="/login">Sign in</Link>
      </p>
    </Shell>
  );
}
