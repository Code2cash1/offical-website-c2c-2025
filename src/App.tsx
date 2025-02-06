import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import BookMeeting from './pages/meet';



function App() {
  return (
    <Router>
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
      </div>
    </Router>
  );
}
export default App;