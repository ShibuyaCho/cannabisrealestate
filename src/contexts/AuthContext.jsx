import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);
const UK = 'creb_users';
const SK = 'creb_session';

const getUsers   = () => { try { return JSON.parse(localStorage.getItem(UK) || '[]'); } catch { return []; } };
const saveUsers  = u  => localStorage.setItem(UK, JSON.stringify(u));
const getSession = () => { try { return JSON.parse(localStorage.getItem(SK) || 'null'); } catch { return null; } };

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const s = getSession();
    if (s) { const u = getUsers().find(u => u.id === s.userId); if (u) setUser(u); }
    setLoading(false);
  }, []);

  useEffect(() => {
    const users = getUsers();
    if (!users.find(u => u.email === 'admin@cannabisrebrokers.com')) {
      saveUsers([...users, {
        id: 'admin_001',
        email: 'admin@cannabisrebrokers.com',
        password: 'Admin123!',
        firstName: 'Platform', lastName: 'Admin',
        role: 'admin', accountType: 'admin',
        createdAt: new Date().toISOString(),
        verified: true, brokerLicense: 'ADMIN',
      }]);
    }
  }, []);

  const register = (data) => {
    const users = getUsers();
    if (users.find(u => u.email === data.email)) throw new Error('Email already registered');
    const u = {
      id: `u_${Date.now()}`,
      ...data,
      role: 'user',
      createdAt: new Date().toISOString(),
      verified: false,
    };
    saveUsers([...users, u]);
    localStorage.setItem(SK, JSON.stringify({ userId: u.id }));
    setUser(u);
    return u;
  };

  const login = (email, password) => {
    const u = getUsers().find(u => u.email === email && u.password === password);
    if (!u) throw new Error('Invalid email or password');
    localStorage.setItem(SK, JSON.stringify({ userId: u.id }));
    setUser(u);
    return u;
  };

  const logout = () => { localStorage.removeItem(SK); setUser(null); };

  const updateUser = (updates) => {
    const users = getUsers();
    const i = users.findIndex(u => u.id === user.id);
    if (i === -1) return;
    const updated = { ...users[i], ...updates };
    users[i] = updated;
    saveUsers(users);
    setUser(updated);
  };

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
