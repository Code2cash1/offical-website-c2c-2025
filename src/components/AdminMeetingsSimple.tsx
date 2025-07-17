import React, { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";

const AdminMeetingsSimple: React.FC = () => {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMeetings();
  }, []);

  const fetchMeetings = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(
        "http://localhost:5000/api/meetings/requests",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setMeetings(data.meetings || []);
      } else {
        setError("Failed to fetch meetings");
      }
    } catch (error) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(
        `http://localhost:5000/api/meetings/request/${id}/status`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: "approved" }),
        }
      );

      if (response.ok) {
        fetchMeetings(); // Refresh the list
      }
    } catch (error) {
      console.error("Error approving meeting:", error);
    }
  };

  const handleReject = async (id: string) => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(
        `http://localhost:5000/api/meetings/request/${id}/status`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: "rejected" }),
        }
      );

      if (response.ok) {
        fetchMeetings(); // Refresh the list
      }
    } catch (error) {
      console.error("Error rejecting meeting:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (
      window.confirm("Are you sure you want to delete this meeting request?")
    ) {
      try {
        const token = localStorage.getItem("adminToken");
        const response = await fetch(
          `http://localhost:5000/api/meetings/request/${id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          fetchMeetings(); // Refresh the list
        }
      } catch (error) {
        console.error("Error deleting meeting:", error);
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
            Meeting Requests
          </h1>
          <p className="text-gray-400">Manage client meeting requests</p>
        </div>

        <div className="bg-gray-900 rounded-lg shadow-lg border border-gray-800">
          <div className="px-6 py-4 border-b border-gray-700">
            <h2 className="text-lg font-semibold text-white">
              Meeting Requests ({meetings.length})
            </h2>
          </div>
          <div className="p-6">
            {meetings.length === 0 ? (
              <p className="text-gray-400">No meeting requests found.</p>
            ) : (
              <div className="space-y-4">
                {meetings.map((meeting: any) => (
                  <div
                    key={meeting._id}
                    className="border border-gray-700 p-4 rounded-md bg-gray-800"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-white">
                          {meeting.name}
                        </h3>
                        <p className="text-sm text-gray-300">{meeting.email}</p>
                        <p className="text-sm text-gray-300">
                          {meeting.company}
                        </p>
                        <p className="text-sm text-gray-300">
                          Preferred:{" "}
                          {new Date(meeting.preferredDate).toLocaleDateString()}{" "}
                          at {meeting.preferredTime}
                        </p>
                        <p className="text-sm text-gray-400 mt-2">
                          {meeting.message}
                        </p>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            meeting.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : meeting.status === "approved"
                              ? "bg-green-100 text-green-800"
                              : meeting.status === "rejected"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {meeting.status}
                        </span>
                        <div className="flex flex-col sm:flex-row gap-2">
                          {meeting.status === "pending" && (
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleApprove(meeting._id)}
                                className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 transition-colors"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleReject(meeting._id)}
                                className="px-3 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700 transition-colors"
                              >
                                Reject
                              </button>
                            </div>
                          )}
                          <button
                            onClick={() => handleDelete(meeting._id)}
                            className="px-3 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600 transition-colors flex items-center gap-1"
                          >
                            <Trash2 className="h-3 w-3" />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminMeetingsSimple;
