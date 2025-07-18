import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Eye, ToggleLeft, ToggleRight } from "lucide-react";
import { API_BASE_URL } from '../config/api';

const AdminJobsSimple: React.FC = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    type: "Full-time",
    location: "",
    description: "",
    requirements: [""],
    salary: "",
    experience: "",
    isActive: true,
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`${API_BASE_URL}/api/jobs`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setJobs(data.jobs || []);
      } else {
        setError("Failed to fetch jobs");
      }
    } catch (error) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleRequirementChange = (index: number, value: string) => {
    const newRequirements = [...formData.requirements];
    newRequirements[index] = value;
    setFormData((prev) => ({
      ...prev,
      requirements: newRequirements,
    }));
  };

  const addRequirement = () => {
    setFormData((prev) => ({
      ...prev,
      requirements: [...prev.requirements, ""],
    }));
  };

  const removeRequirement = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("adminToken");
      const url = isEditing
        ? `${API_BASE_URL}/api/jobs/${selectedJob._id}`
        : `${API_BASE_URL}/api/jobs`;

      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          requirements: formData.requirements.filter(
            (req) => req.trim() !== ""
          ),
        }),
      });

      if (response.ok) {
        setIsModalOpen(false);
        resetForm();
        fetchJobs();
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to save job");
      }
    } catch (error) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      type: "Full-time",
      location: "",
      description: "",
      requirements: [""],
      salary: "",
      experience: "",
      isActive: true,
    });
    setSelectedJob(null);
    setIsEditing(false);
  };

  const handleEdit = (job: any) => {
    setSelectedJob(job);
    setFormData({
      title: job.title,
      type: job.type,
      location: job.location,
      description: job.description,
      requirements: job.requirements.length > 0 ? job.requirements : [""],
      salary: job.salary || "",
      experience: job.experience || "",
      isActive: job.isActive,
    });
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this job posting?")) {
      try {
        const token = localStorage.getItem("adminToken");
        const response = await fetch(`${API_BASE_URL}/api/jobs/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          fetchJobs();
        }
      } catch (error) {
        console.error("Error deleting job:", error);
      }
    }
  };

  const toggleJobStatus = async (id: string, currentStatus: boolean) => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`${API_BASE_URL}/api/jobs/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      if (response.ok) {
        fetchJobs();
      }
    } catch (error) {
      console.error("Error updating job status:", error);
    }
  };

  const openCreateModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-white">
              Job Postings
            </h1>
            <p className="text-gray-400">
              Manage job positions and requirements
            </p>
          </div>
          <button
            onClick={openCreateModal}
            className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 flex items-center transition-colors w-full sm:w-auto justify-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Job
          </button>
        </div>

        <div className="bg-gray-900 rounded-lg shadow-lg border border-gray-800">
          <div className="px-6 py-4 border-b border-gray-700">
            <h2 className="text-lg font-semibold text-white">
              Job Listings ({jobs.length})
            </h2>
          </div>
          <div className="p-6">
            {jobs.length === 0 ? (
              <p className="text-gray-400">No job postings found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead className="bg-gray-800">
                    <tr>
                      <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Job Title
                      </th>
                      <th className="hidden sm:table-cell px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="hidden md:table-cell px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Location
                      </th>
                      <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="hidden lg:table-cell px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Created
                      </th>
                      <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-gray-900 divide-y divide-gray-700">
                    {jobs.map((job: any) => (
                      <tr key={job._id} className="hover:bg-gray-800">
                        <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-white">
                            {job.title}
                          </div>
                          <div className="text-sm text-gray-400">
                            {job.experience}
                          </div>
                        </td>
                        <td className="hidden sm:table-cell px-3 md:px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              job.type === "Full-time"
                                ? "bg-green-100 text-green-800"
                                : job.type === "Part-time"
                                ? "bg-blue-100 text-blue-800"
                                : job.type === "Contract"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-purple-100 text-purple-800"
                            }`}
                          >
                            {job.type}
                          </span>
                        </td>
                        <td className="hidden md:table-cell px-3 md:px-6 py-4 whitespace-nowrap text-sm text-white">
                          {job.location}
                        </td>
                        <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() =>
                              toggleJobStatus(job._id, job.isActive)
                            }
                            className={`inline-flex items-center ${
                              job.isActive ? "text-green-600" : "text-gray-400"
                            }`}
                          >
                            {job.isActive ? (
                              <ToggleRight className="h-5 w-5" />
                            ) : (
                              <ToggleLeft className="h-5 w-5" />
                            )}
                            <span className="ml-2 text-sm">
                              {job.isActive ? "Active" : "Inactive"}
                            </span>
                          </button>
                        </td>
                        <td className="hidden lg:table-cell px-3 md:px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                          <div className="hidden lg:block">
                            {new Date(job.createdAt).toLocaleDateString()}
                          </div>
                          <div className="lg:hidden">
                            {new Date(job.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                              }
                            )}
                          </div>
                        </td>
                        <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                            <button
                              onClick={() => handleEdit(job)}
                              className="text-purple-400 hover:text-purple-300 inline-flex items-center justify-center text-xs sm:text-sm"
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              <span className="hidden sm:inline">Edit</span>
                            </button>
                            <button
                              onClick={() => handleDelete(job._id)}
                              className="text-red-400 hover:text-red-300 inline-flex items-center justify-center text-xs sm:text-sm"
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
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

      {/* Job Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-lg p-4 md:p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg md:text-xl font-bold text-white">
                {isEditing ? "Edit Job" : "Create New Job"}
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

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white">
                    Job Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full border border-gray-600 rounded-md px-3 py-2 bg-gray-800 text-white placeholder-gray-400 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white">
                      Job Type
                    </label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-600 rounded-md px-3 py-2 bg-gray-800 text-white focus:ring-purple-500 focus:border-purple-500"
                    >
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contract">Contract</option>
                      <option value="Internship">Internship</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white">
                      Location
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      required
                      className="mt-1 block w-full border border-gray-600 rounded-md px-3 py-2 bg-gray-800 text-white placeholder-gray-400 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white">
                    Experience Level
                  </label>
                  <input
                    type="text"
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    placeholder="e.g., 1-3 years, Entry Level"
                    className="mt-1 block w-full border border-gray-600 rounded-md px-3 py-2 bg-gray-800 text-white placeholder-gray-400 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white">
                    Salary Range (Optional)
                  </label>
                  <input
                    type="text"
                    name="salary"
                    value={formData.salary}
                    onChange={handleInputChange}
                    placeholder="e.g., ₹50,000 - ₹70,000"
                    className="mt-1 block w-full border border-gray-600 rounded-md px-3 py-2 bg-gray-800 text-white placeholder-gray-400 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white">
                  Job Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  required
                  className="mt-1 block w-full border border-gray-600 rounded-md px-3 py-2 bg-gray-800 text-white placeholder-gray-400 focus:ring-purple-500 focus:border-purple-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Requirements
                </label>
                {formData.requirements.map((req, index) => (
                  <div
                    key={index}
                    className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mb-2"
                  >
                    <input
                      type="text"
                      value={req}
                      onChange={(e) =>
                        handleRequirementChange(index, e.target.value)
                      }
                      placeholder="e.g., 2+ years experience in React"
                      className="flex-1 border border-gray-600 rounded-md px-3 py-2 bg-gray-800 text-white placeholder-gray-400 focus:ring-purple-500 focus:border-purple-500"
                    />
                    {formData.requirements.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeRequirement(index)}
                        className="text-red-400 hover:text-red-300 p-2"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addRequirement}
                  className="text-purple-400 hover:text-purple-300 text-sm"
                >
                  + Add Requirement
                </button>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-600 rounded bg-gray-800"
                />
                <label className="ml-2 block text-sm text-white">
                  Active (visible to job seekers)
                </label>
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-600 rounded-md text-gray-300 hover:bg-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                >
                  {isEditing ? "Update Job" : "Create Job"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminJobsSimple;
