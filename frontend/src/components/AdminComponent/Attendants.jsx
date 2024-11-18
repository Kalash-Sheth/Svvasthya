import React, { useState, useEffect } from "react";
import axios from "axios";

const Attendants = () => {
  const [attendants, setAttendants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAttendants = async () => {
      try {
        console.log("Fetching attendants..."); // Debug log
        const response = await axios.get(
          "http://localhost:5000/api/admin/attendants",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
              "Content-Type": "application/json",
            },
          }
        );
        console.log("Response:", response.data); // Debug log
        setAttendants(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching attendants:", err);
        setError(err.response?.data?.message || "Failed to fetch attendants");
        setLoading(false);
      }
    };

    fetchAttendants();
  }, []);

  if (loading) return <div className="text-center py-4">Loading...</div>;
  if (error) return <div className="text-red-500 text-center py-4">{error}</div>;
  if (attendants.length === 0)
    return <div className="text-center py-4">No attendants found</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-6">Attendants</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {attendants.map((attendant) => (
          <div key={attendant._id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold">
                  {attendant.personalInfo?.firstName}{" "}
                  {attendant.personalInfo?.lastName}
                </h3>
                <p className="text-sm text-gray-600">
                  {attendant.personalInfo?.email}
                </p>
              </div>
              <div className="flex flex-col items-end">
                <span
                  className={`px-3 py-1 rounded-full text-sm mb-2 ${
                    attendant.CurrentAvailability
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {attendant.CurrentAvailability ? "Available" : "Busy"}
                </span>
                <span className="text-sm text-gray-600">
                  Rating: {attendant.rating || "N/A"}⭐
                </span>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                <span className="font-semibold">Mobile:</span>{" "}
                {attendant.mobileNumber || "N/A"}
              </p>
              <p className="text-sm text-gray-600 mb-2">
                <span className="font-semibold">Role:</span>{" "}
                {attendant.role || "N/A"}
              </p>
              <p className="text-sm text-gray-600 mb-2">
                <span className="font-semibold">Experience:</span>{" "}
                {attendant.professionalInfo?.yearsOfExperience || "N/A"} years
              </p>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Assigned Appointments:</span>{" "}
                {attendant.assignedAppointments?.length || 0}
              </p>
            </div>

            {attendant.skillsInfo && (
              <div className="mb-4">
                <p className="text-sm text-gray-600 font-semibold mb-1">
                  Skills & Languages:
                </p>
                <div className="flex flex-wrap gap-1">
                  {attendant.skillsInfo.skills?.map((skill, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 rounded-full text-xs"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {attendant.skillsInfo.languagesKnown?.map((lang, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-50 rounded-full text-xs"
                    >
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {attendant.workPreferences && (
              <div className="text-sm text-gray-600">
                <p className="font-semibold mb-1">Work Preferences:</p>
                <p>Type: {attendant.workPreferences.workType || "N/A"}</p>
                <p>
                  Location: {attendant.workPreferences.locationPreferences || "N/A"}
                </p>
              </div>
            )}

            {attendant.CurrentLocation && (
              <div className="mt-4 text-sm text-gray-600">
                <p className="font-semibold mb-1">Current Location:</p>
                <p>
                  Lat: {attendant.CurrentLocation.latitude}, Long:{" "}
                  {attendant.CurrentLocation.longitude}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Attendants; 