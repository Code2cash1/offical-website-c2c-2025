import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config/api';

interface AdminProfile {
  id: string;
  username: string;
  email: string;
  createdAt: string;
  lastLogin: string;
}

interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface SystemSettings {
  maintenanceMode: boolean;
  maxFileSize: number;
  allowRegistration: boolean;
  emailNotifications: boolean;
  backupFrequency: string;
}

interface ExportData {
  careers: boolean;
  meetings: boolean;
  contacts: boolean;
  format: 'csv' | 'json' | 'xlsx';
}

interface CleanupOptions {
  oldApplications: boolean;
  oldMeetings: boolean;
  oldMessages: boolean;
  daysBefore: number;
}

const AdminSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'password' | 'system' | 'export' | 'cleanup'>('profile');
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  
  // Password change state
  const [passwordData, setPasswordData] = useState<PasswordChangeData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({});
  
  // Password reset state
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  
  // System settings state
  const [systemSettings, setSystemSettings] = useState<SystemSettings>({
    maintenanceMode: false,
    maxFileSize: 5,
    allowRegistration: true,
    emailNotifications: true,
    backupFrequency: 'daily'
  });
  
  // Export state
  const [exportData, setExportData] = useState<ExportData>({
    careers: true,
    meetings: true,
    contacts: true,
    format: 'csv'
  });
  const [exportLoading, setExportLoading] = useState(false);
  
  // Cleanup state
  const [cleanupOptions, setCleanupOptions] = useState<CleanupOptions>({
    oldApplications: false,
    oldMeetings: false,
    oldMessages: false,
    daysBefore: 30
  });
  const [cleanupLoading, setCleanupLoading] = useState(false);

  useEffect(() => {
    fetchProfile();
    fetchSystemSettings();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE_URL}/api/admin/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setProfile(data.profile);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchSystemSettings = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE_URL}/api/admin/system-settings`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSystemSettings(data.settings);
      }
    } catch (error) {
      console.error('Error fetching system settings:', error);
    }
  };

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const validatePassword = (data: PasswordChangeData): Record<string, string> => {
    const errors: Record<string, string> = {};
    
    if (!data.currentPassword) {
      errors.currentPassword = 'Current password is required';
    }
    
    if (!data.newPassword) {
      errors.newPassword = 'New password is required';
    } else if (data.newPassword.length < 8) {
      errors.newPassword = 'Password must be at least 8 characters long';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(data.newPassword)) {
      errors.newPassword = 'Password must contain uppercase, lowercase, and number';
    }
    
    if (!data.confirmPassword) {
      errors.confirmPassword = 'Confirm password is required';
    } else if (data.newPassword !== data.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    return errors;
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const errors = validatePassword(passwordData);
    setPasswordErrors(errors);
    
    if (Object.keys(errors).length > 0) {
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE_URL}/api/auth/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        }),
      });

      const data = await response.json();

      if (response.ok) {
        showNotification('success', 'Password changed successfully');
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        showNotification('error', data.message || 'Failed to change password');
      }
    } catch (error) {
      showNotification('error', 'Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetLoading(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/admin-reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: resetEmail }),
      });

      const data = await response.json();

      if (response.ok) {
        showNotification('success', 'Password reset email sent successfully');
        setResetEmail('');
      } else {
        showNotification('error', data.message || 'Failed to send reset email');
      }
    } catch (error) {
      showNotification('error', 'Connection error. Please try again.');
    } finally {
      setResetLoading(false);
    }
  };

  const handleSystemSettingsUpdate = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE_URL}/api/admin/system-settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(systemSettings),
      });

      const data = await response.json();

      if (response.ok) {
        showNotification('success', 'System settings updated successfully');
      } else {
        showNotification('error', data.message || 'Failed to update settings');
      }
    } catch (error) {
      showNotification('error', 'Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    setExportLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE_URL}/api/admin/export`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(exportData),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `admin-export-${new Date().toISOString().split('T')[0]}.${exportData.format}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        showNotification('success', 'Data exported successfully');
      } else {
        const data = await response.json();
        showNotification('error', data.message || 'Failed to export data');
      }
    } catch (error) {
      showNotification('error', 'Connection error. Please try again.');
    } finally {
      setExportLoading(false);
    }
  };

  const handleCleanup = async () => {
    if (!cleanupOptions.oldApplications && !cleanupOptions.oldMeetings && !cleanupOptions.oldMessages) {
      showNotification('error', 'Please select at least one cleanup option');
      return;
    }

    setCleanupLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE_URL}/api/admin/cleanup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(cleanupOptions),
      });

      const data = await response.json();

      if (response.ok) {
        showNotification('success', `Cleanup completed: ${data.deletedCount} records removed`);
      } else {
        showNotification('error', data.message || 'Failed to cleanup data');
      }
    } catch (error) {
      showNotification('error', 'Connection error. Please try again.');
    } finally {
      setCleanupLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Information</h3>
              {profile ? (
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Username</label>
                      <p className="mt-1 text-sm text-gray-900">{profile.username}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <p className="mt-1 text-sm text-gray-900">{profile.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Account Created</label>
                      <p className="mt-1 text-sm text-gray-900">{formatDate(profile.createdAt)}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Last Login</label>
                      <p className="mt-1 text-sm text-gray-900">{formatDate(profile.lastLogin)}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
              )}
            </div>
          </div>
        );

      case 'password':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h3>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div>
                  <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                    Current Password
                  </label>
                  <input
                    type="password"
                    id="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                  {passwordErrors.currentPassword && (
                    <p className="mt-1 text-sm text-red-600">{passwordErrors.currentPassword}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                    New Password
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                  {passwordErrors.newPassword && (
                    <p className="mt-1 text-sm text-red-600">{passwordErrors.newPassword}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                  {passwordErrors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">{passwordErrors.confirmPassword}</p>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {loading ? 'Updating...' : 'Update Password'}
                </button>
              </form>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Password Reset</h3>
              <p className="text-sm text-gray-600 mb-4">
                Send a password reset email to your account email address.
              </p>
              <form onSubmit={handlePasswordReset} className="space-y-4">
                <div>
                  <label htmlFor="resetEmail" className="block text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="resetEmail"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Enter your email address"
                  />
                </div>
                <button
                  type="submit"
                  disabled={resetLoading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
                >
                  {resetLoading ? 'Sending...' : 'Send Reset Email'}
                </button>
              </form>
            </div>
          </div>
        );

      case 'system':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">System Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Maintenance Mode</label>
                    <p className="text-sm text-gray-500">Disable public access to the website</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSystemSettings({ ...systemSettings, maintenanceMode: !systemSettings.maintenanceMode })}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                      systemSettings.maintenanceMode ? 'bg-indigo-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition duration-200 ease-in-out ${
                        systemSettings.maintenanceMode ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Max File Size (MB)</label>
                  <input
                    type="number"
                    value={systemSettings.maxFileSize}
                    onChange={(e) => setSystemSettings({ ...systemSettings, maxFileSize: parseInt(e.target.value) })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Allow Registration</label>
                    <p className="text-sm text-gray-500">Allow new user registrations</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSystemSettings({ ...systemSettings, allowRegistration: !systemSettings.allowRegistration })}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                      systemSettings.allowRegistration ? 'bg-indigo-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition duration-200 ease-in-out ${
                        systemSettings.allowRegistration ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email Notifications</label>
                    <p className="text-sm text-gray-500">Send email notifications for new submissions</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSystemSettings({ ...systemSettings, emailNotifications: !systemSettings.emailNotifications })}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                      systemSettings.emailNotifications ? 'bg-indigo-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition duration-200 ease-in-out ${
                        systemSettings.emailNotifications ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Backup Frequency</label>
                  <select
                    value={systemSettings.backupFrequency}
                    onChange={(e) => setSystemSettings({ ...systemSettings, backupFrequency: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>

                <button
                  type="button"
                  onClick={handleSystemSettingsUpdate}
                  disabled={loading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {loading ? 'Updating...' : 'Update Settings'}
                </button>
              </div>
            </div>
          </div>
        );

      case 'export':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Data</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Data to Export</label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={exportData.careers}
                        onChange={(e) => setExportData({ ...exportData, careers: e.target.checked })}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">Career Applications</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={exportData.meetings}
                        onChange={(e) => setExportData({ ...exportData, meetings: e.target.checked })}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">Meeting Requests</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={exportData.contacts}
                        onChange={(e) => setExportData({ ...exportData, contacts: e.target.checked })}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">Contact Messages</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Export Format</label>
                  <select
                    value={exportData.format}
                    onChange={(e) => setExportData({ ...exportData, format: e.target.value as 'csv' | 'json' | 'xlsx' })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="csv">CSV</option>
                    <option value="json">JSON</option>
                    <option value="xlsx">Excel (XLSX)</option>
                  </select>
                </div>

                <button
                  type="button"
                  onClick={handleExport}
                  disabled={exportLoading || (!exportData.careers && !exportData.meetings && !exportData.contacts)}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                >
                  {exportLoading ? 'Exporting...' : 'Export Data'}
                </button>
              </div>
            </div>
          </div>
        );

      case 'cleanup':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Database Cleanup</h3>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-800">
                      <strong>Warning:</strong> This action will permanently delete old data. Make sure to backup your data before proceeding.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Data to Clean</label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={cleanupOptions.oldApplications}
                        onChange={(e) => setCleanupOptions({ ...cleanupOptions, oldApplications: e.target.checked })}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">Old Career Applications</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={cleanupOptions.oldMeetings}
                        onChange={(e) => setCleanupOptions({ ...cleanupOptions, oldMeetings: e.target.checked })}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">Old Meeting Requests</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={cleanupOptions.oldMessages}
                        onChange={(e) => setCleanupOptions({ ...cleanupOptions, oldMessages: e.target.checked })}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">Old Contact Messages</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Delete data older than (days)</label>
                  <input
                    type="number"
                    value={cleanupOptions.daysBefore}
                    onChange={(e) => setCleanupOptions({ ...cleanupOptions, daysBefore: parseInt(e.target.value) })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    min="1"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleCleanup}
                  disabled={cleanupLoading || (!cleanupOptions.oldApplications && !cleanupOptions.oldMeetings && !cleanupOptions.oldMessages)}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                >
                  {cleanupLoading ? 'Cleaning...' : 'Clean Database'}
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Settings</h1>
        <p className="text-gray-600">Manage your account settings and system configuration</p>
      </div>

      {/* Notification */}
      {notification && (
        <div className={`rounded-md p-4 ${notification.type === 'success' ? 'bg-green-50' : 'bg-red-50'}`}>
          <div className="flex">
            <div className="flex-shrink-0">
              {notification.type === 'success' ? (
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <div className="ml-3">
              <p className={`text-sm font-medium ${notification.type === 'success' ? 'text-green-800' : 'text-red-800'}`}>
                {notification.message}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { key: 'profile', label: 'Profile' },
            { key: 'password', label: 'Password' },
            { key: 'system', label: 'System' },
            { key: 'export', label: 'Export' },
            { key: 'cleanup', label: 'Cleanup' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.key
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg shadow p-6">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default AdminSettings;
