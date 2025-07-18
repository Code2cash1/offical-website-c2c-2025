import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config/api';

interface ContactMessage {
  id: string;
  senderName: string;
  email: string;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'replied';
  priority: 'low' | 'medium' | 'high';
  date: string;
  notes?: string;
}

interface AdminMessagesProps {
  token: string;
}

const AdminMessages: React.FC<AdminMessagesProps> = ({ token }) => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [filteredMessages, setFilteredMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'unread' | 'read' | 'replied'>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'low' | 'medium' | 'high'>('all');
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingNotes, setEditingNotes] = useState<string | null>(null);
  const [notesText, setNotesText] = useState('');

  const itemsPerPage = 10;

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    filterMessages();
  }, [messages, searchTerm, statusFilter, priorityFilter]);

  const fetchMessages = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/contacts/messages`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      } else {
        setError('Failed to fetch messages');
      }
    } catch (error) {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filterMessages = () => {
    let filtered = messages;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(msg =>
        msg.senderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.subject.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(msg => msg.status === statusFilter);
    }

    // Priority filter
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(msg => msg.priority === priorityFilter);
    }

    setFilteredMessages(filtered);
    setCurrentPage(1);
  };

  const updateMessageStatus = async (messageId: string, newStatus: 'unread' | 'read' | 'replied') => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/contacts/messages/${messageId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setMessages(messages.map(msg =>
          msg.id === messageId ? { ...msg, status: newStatus } : msg
        ));
      } else {
        setError('Failed to update message status');
      }
    } catch (error) {
      setError('Connection error. Please try again.');
    }
  };

  const updateMessagePriority = async (messageId: string, newPriority: 'low' | 'medium' | 'high') => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/contacts/messages/${messageId}/priority`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priority: newPriority }),
      });

      if (response.ok) {
        setMessages(messages.map(msg =>
          msg.id === messageId ? { ...msg, priority: newPriority } : msg
        ));
      } else {
        setError('Failed to update message priority');
      }
    } catch (error) {
      setError('Connection error. Please try again.');
    }
  };

  const updateMessageNotes = async (messageId: string, notes: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/contacts/messages/${messageId}/notes`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notes }),
      });

      if (response.ok) {
        setMessages(messages.map(msg =>
          msg.id === messageId ? { ...msg, notes } : msg
        ));
        setEditingNotes(null);
      } else {
        setError('Failed to update message notes');
      }
    } catch (error) {
      setError('Connection error. Please try again.');
    }
  };

  const deleteMessage = async (messageId: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/contacts/messages/${messageId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setMessages(messages.filter(msg => msg.id !== messageId));
      } else {
        setError('Failed to delete message');
      }
    } catch (error) {
      setError('Connection error. Please try again.');
    }
  };

  const openMessageModal = (message: ContactMessage) => {
    setSelectedMessage(message);
    setShowModal(true);
    
    // Auto-mark as read when viewed
    if (message.status === 'unread') {
      updateMessageStatus(message.id, 'read');
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedMessage(null);
    setEditingNotes(null);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'unread': return 'bg-blue-100 text-blue-800';
      case 'read': return 'bg-gray-100 text-gray-800';
      case 'replied': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const startingIndex = (currentPage - 1) * itemsPerPage;
  const endingIndex = startingIndex + itemsPerPage;
  const currentMessages = filteredMessages.slice(startingIndex, endingIndex);
  const totalPages = Math.ceil(filteredMessages.length / itemsPerPage);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="p-10 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-4">Contact Messages</h2>
        
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* Filters and Search */}
        <div className="flex flex-wrap gap-4 mb-4">
          <div className="flex-1 min-w-64">
            <input
              type="text"
              placeholder="Search by name, email, or subject..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Status</option>
            <option value="unread">Unread</option>
            <option value="read">Read</option>
            <option value="replied">Replied</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>

      {/* Messages Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sender
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Subject
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Priority
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentMessages.map((message) => (
              <tr key={message.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{message.senderName}</div>
                    <div className="text-sm text-gray-500">{message.email}</div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{message.subject}</div>
                  <div className="text-sm text-gray-500 truncate max-w-xs">
                    {message.message.substring(0, 100)}...
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={message.status}
                    onChange={(e) => updateMessageStatus(message.id, e.target.value as any)}
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(message.status)}`}
                  >
                    <option value="unread">Unread</option>
                    <option value="read">Read</option>
                    <option value="replied">Replied</option>
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={message.priority}
                    onChange={(e) => updateMessagePriority(message.id, e.target.value as any)}
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(message.priority)}`}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(message.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => openMessageModal(message)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    View
                  </button>
                  <button
                    onClick={() => deleteMessage(message.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-6">
        <div className="text-sm text-gray-700">
          Showing {startingIndex + 1} to {Math.min(endingIndex, filteredMessages.length)} of {filteredMessages.length} results
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-3 py-1 text-sm text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {/* Modal for viewing full message */}
      {showModal && selectedMessage && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full m-4 max-h-full overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-medium text-gray-900">Message Details</h3>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">From</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedMessage.senderName}</p>
                  <p className="text-sm text-gray-500">{selectedMessage.email}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Subject</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedMessage.subject}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Message</label>
                  <p className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">{selectedMessage.message}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date</label>
                  <p className="mt-1 text-sm text-gray-900">{new Date(selectedMessage.date).toLocaleString()}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Notes</label>
                  {editingNotes === selectedMessage.id ? (
                    <div className="mt-1">
                      <textarea
                        value={notesText}
                        onChange={(e) => setNotesText(e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Add notes..."
                      />
                      <div className="mt-2 flex space-x-2">
                        <button
                          onClick={() => updateMessageNotes(selectedMessage.id, notesText)}
                          className="px-3 py-1 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingNotes(null)}
                          className="px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded-md hover:bg-gray-400"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-1">
                      <p className="text-sm text-gray-900">{selectedMessage.notes || 'No notes'}</p>
                      <button
                        onClick={() => {
                          setEditingNotes(selectedMessage.id);
                          setNotesText(selectedMessage.notes || '');
                        }}
                        className="mt-1 text-sm text-indigo-600 hover:text-indigo-900"
                      >
                        Edit Notes
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMessages;
