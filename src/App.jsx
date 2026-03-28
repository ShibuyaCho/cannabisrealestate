import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/Home';
import { PropertiesPage, PropertyDetailPage } from './pages/Properties';
import { LoginPage, RegisterPage } from './pages/Auth';
import { DashboardPage, ListPropertyPage, TransactionsPage, ProfilePage, HowItWorksPage, AdminPage } from './pages/Dashboard';

function Guard({ children, adminOnly }) {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ padding: 60, textAlign: 'center' }}><div className="spinner"/></div>;
  if (!user) return <Navigate to="/login"/>;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/dashboard"/>;
  return children;
}

function AppRoutes() {
  return (
    <div className="page-wrap">
      <Navbar/>
      <div className="page-content">
        <Routes>
          <Route path="/"               element={<HomePage/>}/>
          <Route path="/properties"     element={<PropertiesPage/>}/>
          <Route path="/properties/:id" element={<PropertyDetailPage/>}/>
          <Route path="/how-it-works"   element={<HowItWorksPage/>}/>
          <Route path="/login"          element={<LoginPage/>}/>
          <Route path="/register"       element={<RegisterPage/>}/>
          <Route path="/dashboard"      element={<Guard><DashboardPage/></Guard>}/>
          <Route path="/list"           element={<Guard><ListPropertyPage/></Guard>}/>
          <Route path="/transactions"   element={<Guard><TransactionsPage/></Guard>}/>
          <Route path="/profile"        element={<Guard><ProfilePage/></Guard>}/>
          <Route path="/admin"          element={<Guard adminOnly><AdminPage/></Guard>}/>
          <Route path="*"              element={<Navigate to="/"/>}/>
        </Routes>
      </div>
      <Footer/>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes/>
      </AuthProvider>
    </BrowserRouter>
  );
}
