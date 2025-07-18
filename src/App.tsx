import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import CustomCursor from './components/CustomCursor';
import Navigation from './components/Navigation';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';
import ProjectsPage from './pages/ProjectsPage';
import TechnologiesPage from './pages/TechnologiesPage';
import CareersPage from './pages/CareersPage';
import TeamPage from './pages/TeamPage';
import ContactPage from './pages/ContactPage';
import BookMeeting from './pages/Meet';
import Footer from './components/Footer';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';

function App() {
  const [adminToken, setAdminToken] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    setAdminToken(token);
  }, []);

  const handleAdminLogin = (token: string) => {
    setAdminToken(token);
  };

  const handleAdminLogout = () => {
    setAdminToken(null);
  };

  return (
    <Router>
      <Routes>
        {/* Admin Routes - with normal cursor */}
        <Route 
          path="/admin/login" 
          element={<AdminLogin onLogin={handleAdminLogin} />} 
        />
        <Route 
          path="/admin/*" 
          element={
            adminToken ? (
              <AdminDashboard onLogout={handleAdminLogout} />
            ) : (
              <AdminLogin onLogin={handleAdminLogin} />
            )
          } 
        />
        <Route 
          path="/admin" 
          element={
            adminToken ? (
              <AdminDashboard onLogout={handleAdminLogout} />
            ) : (
              <AdminLogin onLogin={handleAdminLogin} />
            )
          } 
        />
        
        {/* Public Routes - with custom cursor */}
        <Route path="/*" element={
          <div className="bg-black min-h-screen cursor-none">
            <CustomCursor />
            <Navigation />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/technologies" element={<TechnologiesPage />} />
              <Route path="/careers" element={<CareersPage />} />
              <Route path="/team" element={<TeamPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/meet" element={<BookMeeting />} />
            </Routes>
            <Footer/>
          </div>
        } />
      </Routes>
    </Router>
  );
}
export default App;