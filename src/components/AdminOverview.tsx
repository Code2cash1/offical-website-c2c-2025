import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config/api';

interface DashboardStats {
  careers: {
    total: number;
    pending: number;
    reviewed: number;
    shortlisted: number;
    hired: number;
    rejected: number;
  };
  jobs: {
    total: number;
    active: number;
    inactive: number;
  };
  meetings: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    completed: number;
  };
  contacts: {
    total: number;
    unread: number;
    read: number;
    replied: number;
    highPriority: number;
  };
}

interface RecentActivity {
  applications: Array<{
    _id: string;
    fullName: string;
    email: string;
    jobTitle: string;
    status: string;
    createdAt: string;
  }>;
  meetings: Array<{
    _id: string;
    name: string;
    email: string;
    company: string;
    status: string;
    preferredDate: string;
    createdAt: string;
  }>;
  messages: Array<{
    _id: string;
    name: string;
    email: string;
    subject: string;
    status: string;
    priority: string;
    createdAt: string;
  }>;
}

const AdminOverview: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE_URL}/api/admin/dashboard`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
        setRecentActivity(data.recentActivities);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
      case 'hired':
      case 'replied':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'reviewed':
      case 'read':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white">Dashboard Overview</h1>
          <p className="text-gray-400">Welcome to your admin dashboard</p>
        </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {/* Career Stats */}
        <div className="bg-gray-900 rounded-lg shadow-lg border border-gray-800 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Career Applications</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-400">Total:</span>
              <span className="font-semibold text-white">{stats?.careers.total || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Pending:</span>
              <span className="font-semibold text-yellow-400">{stats?.careers.pending || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Shortlisted:</span>
              <span className="font-semibold text-purple-400">{stats?.careers.shortlisted || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Hired:</span>
              <span className="font-semibold text-green-400">{stats?.careers.hired || 0}</span>
            </div>
          </div>
        </div>

        {/* Job Stats */}
        <div className="bg-gray-900 rounded-lg shadow-lg border border-gray-800 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Job Postings</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-400">Total:</span>
              <span className="font-semibold text-white">{stats?.jobs.total || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Active:</span>
              <span className="font-semibold text-green-400">{stats?.jobs.active || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Inactive:</span>
              <span className="font-semibold text-gray-400">{stats?.jobs.inactive || 0}</span>
            </div>
          </div>
        </div>

        {/* Meeting Stats */}
        <div className="bg-gray-900 rounded-lg shadow-lg border border-gray-800 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Meetings</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-400">Total:</span>
              <span className="font-semibold text-white">{stats?.meetings.total || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Pending:</span>
              <span className="font-semibold text-yellow-400">{stats?.meetings.pending || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Approved:</span>
              <span className="font-semibold text-green-400">{stats?.meetings.approved || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Completed:</span>
              <span className="font-semibold text-purple-400">{stats?.meetings.completed || 0}</span>
            </div>
          </div>
        </div>

        {/* Contact Stats */}
        <div className="bg-gray-900 rounded-lg shadow-lg border border-gray-800 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Messages</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-400">Total:</span>
              <span className="font-semibold text-white">{stats?.contacts.total || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Unread:</span>
              <span className="font-semibold text-red-400">{stats?.contacts.unread || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">High Priority:</span>
              <span className="font-semibold text-orange-400">{stats?.contacts.highPriority || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Replied:</span>
              <span className="font-semibold text-green-400">{stats?.contacts.replied || 0}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
        {/* Recent Applications */}
        <div className="bg-gray-900 rounded-lg shadow-lg border border-gray-800">
          <div className="p-6 border-b border-gray-700">
            <h3 className="text-lg font-semibold text-white">Recent Applications</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentActivity?.applications?.map((app) => (
                <div key={app._id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-white">{app.fullName}</p>
                    <p className="text-sm text-gray-400">{app.jobTitle}</p>
                    <p className="text-xs text-gray-500">{formatDate(app.createdAt)}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>
                    {app.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Meetings */}
        <div className="bg-gray-900 rounded-lg shadow-lg border border-gray-800">
          <div className="p-6 border-b border-gray-700">
            <h3 className="text-lg font-semibold text-white">Recent Meetings</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentActivity?.meetings?.map((meeting) => (
                <div key={meeting._id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-white">{meeting.name}</p>
                    <p className="text-sm text-gray-400">{meeting.company}</p>
                    <p className="text-xs text-gray-500">{formatDate(meeting.createdAt)}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(meeting.status)}`}>
                    {meeting.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Messages */}
        <div className="bg-gray-900 rounded-lg shadow-lg border border-gray-800">
          <div className="p-6 border-b border-gray-700">
            <h3 className="text-lg font-semibold text-white">Recent Messages</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentActivity?.messages?.map((message) => (
                <div key={message._id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-white">{message.name}</p>
                    <p className="text-sm text-gray-400">{message.subject}</p>
                    <p className="text-xs text-gray-500">{formatDate(message.createdAt)}</p>
                  </div>
                  <div className="flex flex-col items-end space-y-1">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(message.status)}`}>
                      {message.status}
                    </span>
                    {message.priority === 'high' && (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-900 text-red-300">
                        High Priority
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default AdminOverview;
