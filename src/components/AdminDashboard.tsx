import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import AdminOverview from './AdminOverview';
import AdminCareers from './AdminCareers';
import AdminMeetings from './AdminMeetings';
import AdminMessages from './AdminMessages';
import AdminSettings from './AdminSettings';
import TestComponent from './TestComponent';
import AdminCareersSimple from './AdminCareersSimple';
import AdminMeetingsSimple from './AdminMeetingsSimple';
import AdminMessagesSimple from './AdminMessagesSimple';
import AdminSettingsSimple from './AdminSettingsSimple';
import AdminJobsSimple from './AdminJobsSimple';

interface AdminDashboardProps {
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [adminData, setAdminData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }

    fetchAdminData();
  }, [navigate]);

  const fetchAdminData = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:5000/api/auth/verify', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAdminData(data.admin);
      } else {
        handleLogout();
      }
    } catch (error) {
      handleLogout();
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    onLogout();
    navigate('/admin/login');
  };

  const getActiveClass = (path: string) => {
    return location.pathname === path
      ? 'bg-purple-600 text-white'
      : 'text-gray-300 hover:bg-gray-800 hover:text-white';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Navigation */}
      <nav className="bg-gray-900 shadow-lg border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center">
              {/* Mobile menu button */}
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="md:hidden text-white hover:bg-gray-800 p-2 rounded-md mr-2"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              
              <div className="flex-shrink-0 flex items-center">
                <img 
                  src="https://scontent.fpat11-1.fna.fbcdn.net/v/t1.15752-9/518174176_756406363443793_1119636635183663943_n.png?_nc_cat=111&ccb=1-7&_nc_sid=0024fc&_nc_ohc=iTNPM_1GJ4kQ7kNvwFNFMCl&_nc_oc=AdmM32Xz7ecT6J6A79CbfXPA_QW7hH_ns_hOvWtogtHNJ6l_QmjwpYKNx95TMIE87MnuFnZ7OBntC3GGA-1WUDEB&_nc_ad=z-m&_nc_cid=2034&_nc_zt=23&_nc_ht=scontent.fpat11-1.fna&oh=03_Q7cD2wFVemEvBRT4LcXz6QAT5Bpi7Q6T_Wi22lnuB93_l6cp4A&oe=68A0CFB3" 
                  alt="Code2Cash Logo" 
                  className="h-8 md:h-12 lg:h-15 w-auto brightness-0 invert" 
                />
                
              </div>
            </div>
            <div className="flex items-center space-x-2 md:space-x-4">
              <span className="text-white text-sm md:text-base hidden sm:block">Welcome, {adminData?.fullName || adminData?.username}</span>
              <button
                onClick={handleLogout}
                className="text-white hover:bg-gray-800 px-2 md:px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex relative">
        {/* Mobile sidebar backdrop */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
        
        {/* Sidebar */}
        <div className={`bg-gray-900 w-64 min-h-screen border-r border-gray-800 fixed md:relative z-50 md:z-0 transition-transform duration-300 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}>
          <nav className="mt-8">
            <div className="px-4 space-y-2">
              <Link
                to="/admin/dashboard"
                onClick={() => setIsSidebarOpen(false)}
                className={`group flex items-center px-4 py-2 text-sm font-medium rounded-md ${getActiveClass('/admin/dashboard')}`}
              >
                <svg className="mr-3 h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                </svg>
                Dashboard
              </Link>
              <Link
                to="/admin/jobs"
                onClick={() => setIsSidebarOpen(false)}
                className={`group flex items-center px-4 py-2 text-sm font-medium rounded-md ${getActiveClass('/admin/jobs')}`}
              >
                <svg className="mr-3 h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-6m-2-5h6m-6 0V9h6v6z" />
                </svg>
                Job Postings
              </Link>
              <Link
                to="/admin/careers"
                onClick={() => setIsSidebarOpen(false)}
                className={`group flex items-center px-4 py-2 text-sm font-medium rounded-md ${getActiveClass('/admin/careers')}`}
              >
                <svg className="mr-3 h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 01-2 2H10a2 2 0 01-2-2V6" />
                </svg>
                Career Applications
              </Link>
              <Link
                to="/admin/meetings"
                onClick={() => setIsSidebarOpen(false)}
                className={`group flex items-center px-4 py-2 text-sm font-medium rounded-md ${getActiveClass('/admin/meetings')}`}
              >
                <svg className="mr-3 h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0V5a2 2 0 012-2h4a2 2 0 012 2v2m-6 0h8m-9 4h10a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Meetings
              </Link>
              <Link
                to="/admin/messages"
                onClick={() => setIsSidebarOpen(false)}
                className={`group flex items-center px-4 py-2 text-sm font-medium rounded-md ${getActiveClass('/admin/messages')}`}
              >
                <svg className="mr-3 h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Messages
              </Link>
              <Link
                to="/admin/settings"
                onClick={() => setIsSidebarOpen(false)}
                className={`group flex items-center px-4 py-2 text-sm font-medium rounded-md ${getActiveClass('/admin/settings')}`}
              >
                <svg className="mr-3 h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Settings
              </Link>
            </div>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-h-screen bg-black md:ml-0">
          <Routes>
            <Route path="/" element={<AdminOverview />} />
            <Route path="dashboard" element={<AdminOverview />} />
            <Route path="jobs" element={<AdminJobsSimple />} />
            <Route path="careers" element={<AdminCareersSimple />} />
            <Route path="meetings" element={<AdminMeetingsSimple />} />
            <Route path="messages" element={<AdminMessagesSimple />} />
            <Route path="settings" element={<AdminSettingsSimple />} />
            <Route path="*" element={<AdminOverview />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
