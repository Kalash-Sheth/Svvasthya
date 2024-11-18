import React, { useState, useEffect } from "react";
import axios from "axios";

const FinishedJobs = () => {
  const [finishedJobs, setFinishedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFinishedJobs = async () => {
      try {
        console.log("Fetching finished jobs..."); // Debug log
        const response = await axios.get(
          "http://localhost:5000/api/admin/appointments/finished",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
              "Content-Type": "application/json",
            },
          }
        );
        console.log("Response:", response.data); // Debug log
        setFinishedJobs(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching finished jobs:", err); // Debug log
        setError(err.response?.data?.message || "Failed to fetch finished jobs");
        setLoading(false);
      }
    };

    fetchFinishedJobs();
  }, []);

  if (loading) return <div className="text-center py-4">Loading...</div>;
  if (error)
    return <div className="text-red-500 text-center py-4">{error}</div>;
  if (finishedJobs.length === 0)
    return <div className="text-center py-4">No finished jobs found</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-6">Finished Jobs</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {finishedJobs.map((job) => (
          <div key={job._id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold">{job.mainService}</h3>
                <p className="text-sm text-gray-600">{job.subService}</p>
              </div>
              <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                Finished
              </span>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-semibold">Customer:</span>{" "}
                {job.requestByCustomer?.name || "N/A"}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-semibold">Attendant:</span>{" "}
                {job.assignedAttendant
                  ? `${job.assignedAttendant.firstName || ""} ${
                      job.assignedAttendant.lastName || ""
                    }`
                  : "N/A"}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Duration:</span>{" "}
                {job.duration || "N/A"} hours
              </p>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Start Time:</span>
                <br />
                {job.startTime
                  ? new Date(job.startTime).toLocaleString()
                  : "N/A"}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-semibold">End Time:</span>
                <br />
                {job.endTime ? new Date(job.endTime).toLocaleString() : "N/A"}
              </p>
            </div>

            <div className="text-sm text-gray-600">
              <p className="font-semibold mb-1">Address:</p>
              <p>{job.address?.fullAddress || "N/A"}</p>
              <p>{job.address?.houseNumber || "N/A"}</p>
              <p>{job.address?.landmark || "N/A"}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FinishedJobs; 