import React, { useState, useEffect } from "react";
import {
  Eye,
  Download,
  User,
  Phone,
  Mail,
  FileText,
  Calendar,
} from "lucide-react";

const AdminCareersSimple: React.FC = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusUpdate, setStatusUpdate] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(
        "http://localhost:5000/api/careers/applications",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setApplications(data.applications || []);
      } else {
        setError("Failed to fetch applications");
      }
    } catch (error) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  const handleViewApplication = (application: any) => {
    setSelectedApplication(application);
    setStatusUpdate(application.status);
    setNotes(application.notes || "");
    setIsModalOpen(true);
  };

  const handleUpdateStatus = async () => {
    if (!selectedApplication) return;

    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(
        `http://localhost:5000/api/careers/application/${selectedApplication._id}/status`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: statusUpdate, notes }),
        }
      );

      if (response.ok) {
        setIsModalOpen(false);
        fetchApplications(); // Refresh the list
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleDownloadResume = (resumeUrl: string, applicantName: string) => {
    const link = document.createElement("a");
    link.href = `http://localhost:5000/${resumeUrl}`;
    link.download = `${applicantName}_resume.pdf`;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDeleteApplication = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this application?")) {
      try {
        const token = localStorage.getItem("adminToken");
        const response = await fetch(
          `http://localhost:5000/api/careers/application/${id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          fetchApplications(); // Refresh the list
        }
      } catch (error) {
        console.error("Error deleting application:", error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white">
            Career Applications
          </h1>
          <p className="text-gray-400">Manage job applications</p>
        </div>

        <div className="bg-gray-900 rounded-lg shadow-lg border border-gray-800">
          <div className="px-6 py-4 border-b border-gray-700">
            <h2 className="text-lg font-semibold text-white">
              Applications ({applications.length})
            </h2>
          </div>
          <div className="p-6">
            {applications.length === 0 ? (
              <p className="text-gray-400">No applications found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead className="bg-gray-800">
                    <tr>
                      <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Applicant
                      </th>
                      <th className="hidden sm:table-cell px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Position
                      </th>
                      <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="hidden lg:table-cell px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Applied Date
                      </th>
                      <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-gray-900 divide-y divide-gray-700">
                    {applications.map((app: any) => (
                      <tr key={app._id} className="hover:bg-gray-800">
                        <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10">
                              <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-purple-100 flex items-center justify-center">
                                <User className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
                              </div>
                            </div>
                            <div className="ml-2 sm:ml-4">
                              <div className="text-sm font-medium text-white">
                                {app.name}
                              </div>
                              <div className="text-xs sm:text-sm text-gray-400 flex items-center">
                                <Mail className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                                <span className="truncate max-w-[120px] sm:max-w-none">
                                  {app.email}
                                </span>
                              </div>
                              <div className="text-xs sm:text-sm text-gray-400 flex items-center">
                                <Phone className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                                {app.phone}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="hidden sm:table-cell px-3 md:px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-white">
                            {app.position}
                          </div>
                          <div className="text-sm text-gray-400">
                            {app.experience}
                          </div>
                        </td>
                        <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              app.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : app.status === "reviewed"
                                ? "bg-blue-100 text-blue-800"
                                : app.status === "shortlisted"
                                ? "bg-purple-100 text-purple-800"
                                : app.status === "hired"
                                ? "bg-green-100 text-green-800"
                                : app.status === "rejected"
                                ? "bg-red-100 text-red-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {app.status}
                          </span>
                        </td>
                        <td className="hidden lg:table-cell px-3 md:px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {new Date(app.createdAt).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                            <button
                              onClick={() => handleViewApplication(app)}
                              className="text-purple-400 hover:text-purple-300 inline-flex items-center justify-center text-xs sm:text-sm"
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              <span className="hidden sm:inline">View</span>
                            </button>
                            <button
                              onClick={() =>
                                handleDownloadResume(app.resumeUrl, app.name)
                              }
                              className="text-green-400 hover:text-green-300 inline-flex items-center justify-center text-xs sm:text-sm"
                            >
                              <Download className="h-4 w-4 mr-1" />
                              <span className="hidden sm:inline">Resume</span>
                            </button>
                            <button
                              onClick={() => handleDeleteApplication(app._id)}
                              className="text-red-400 hover:text-red-300 inline-flex items-center justify-center text-xs sm:text-sm"
                            >
                              <span className="hidden sm:inline">Delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Application Details Modal */}
      {isModalOpen && selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-lg p-4 md:p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg md:text-xl font-bold text-white">
                Application Details
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-200"
              >
                <span className="sr-only">Close</span>
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Application Info */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white">
                    Name
                  </label>
                  <p className="text-sm text-gray-300">
                    {selectedApplication.name}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-white">
                    Email
                  </label>
                  <p className="text-sm text-gray-300">
                    {selectedApplication.email}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-white">
                    Phone
                  </label>
                  <p className="text-sm text-gray-300">
                    {selectedApplication.phone}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-white">
                    Position
                  </label>
                  <p className="text-sm text-gray-300">
                    {selectedApplication.position}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-white">
                    Experience
                  </label>
                  <p className="text-sm text-gray-300">
                    {selectedApplication.experience}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-white">
                    Applied Date
                  </label>
                  <p className="text-sm text-gray-300">
                    {new Date(
                      selectedApplication.createdAt
                    ).toLocaleDateString()}
                  </p>
                </div>

                {/* Status Update */}
                <div>
                  <label className="block text-sm font-medium text-white">
                    Status
                  </label>
                  <select
                    value={statusUpdate}
                    onChange={(e) => setStatusUpdate(e.target.value)}
                    className="mt-1 block w-full border border-gray-600 rounded-md px-3 py-2 bg-gray-800 text-white focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="reviewed">Reviewed</option>
                    <option value="shortlisted">Shortlisted</option>
                    <option value="hired">Hired</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-white">
                    Notes
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    className="mt-1 block w-full border border-gray-600 rounded-md px-3 py-2 bg-gray-800 text-white placeholder-gray-400 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Add notes about this application..."
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={handleUpdateStatus}
                    className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors"
                  >
                    Update Status
                  </button>
                  <button
                    onClick={() =>
                      handleDownloadResume(
                        selectedApplication.resumeUrl,
                        selectedApplication.name
                      )
                    }
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center justify-center transition-colors"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Resume
                  </button>
                </div>
              </div>

              {/* PDF Viewer */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-white">
                  Resume Preview
                </label>
                <div className="border border-gray-600 rounded-md p-2 bg-gray-800">
                  <iframe
                    src={`http://localhost:5000/${selectedApplication.resumeUrl}`}
                    width="100%"
                    height="800px"
                    className="border-0 rounded-md"
                    title="Resume Preview"
                  />
                </div>
                <div className="flex justify-center">
                  <a
                    href={`http://localhost:5000/${selectedApplication.resumeUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-400 hover:text-purple-300 flex items-center transition-colors"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Open in new tab
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCareersSimple;
