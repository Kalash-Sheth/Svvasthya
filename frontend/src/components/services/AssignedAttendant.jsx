import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaStar, FaPhone, FaMapMarkerAlt, FaClock } from "react-icons/fa";
import { MdEmail, MdVerified } from "react-icons/md";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import attendantIconImg from "../../assets/Map_Attend_icon.png";
import Footer from "../Footer";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const attendantIcon = L.icon({
  iconUrl: attendantIconImg,
  iconSize: [50, 50],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

const AssignedAttendant = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { attendant } = location.state || {};

  const attendantPosition = [
    attendant?.CurrentLocation?.latitude || 19.076,
    attendant?.CurrentLocation?.longitude || 72.8777,
  ];

  const handleCall = () => {
    if (attendant?.mobileNumber) {
      window.location.href = `tel:${attendant.mobileNumber}`;
    }
  };

  const handleEmail = () => {
    if (attendant?.email) {
      window.location.href = `mailto:${attendant.email}`;
    }
  };

  return (
    <div
      className="min-h-screen"
      style={{
        background: `linear-gradient(
        78.83deg,
        rgba(239, 91, 42, 0.151),
        rgba(250, 174, 66, 0.151) 33%,
        rgba(139, 197, 65, 0.151) 66%,
        rgba(3, 147, 71, 0.151)
      )`,
      }}
    >
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Left Section */}
            <div className="md:w-2/3 p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-[#282261]">
                    {attendant
                      ? `${attendant.firstName} ${attendant.lastName}`
                      : "Attendant Name Not Available"}
                  </h1>
                  <p className="text-gray-600 text-lg">
                    {attendant?.role || "Role Not Specified"}
                  </p>
                </div>
                <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-full">
                  <MdVerified className="text-green-500 text-xl" />
                  <span className="text-green-700">
                    {attendant?.verificationStatus || "Verification Pending"}
                  </span>
                </div>
              </div>

              {/* Experience and Rating */}
              <div className="flex items-center gap-6 mb-6">
                <div className="flex items-center gap-2">
                  <FaClock className="text-orange-500 text-xl" />
                  <span className="text-xl font-bold text-orange-500">
                    {attendant?.experience || "Experience Not Available"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <FaStar className="text-yellow-400 text-xl" />
                  <span className="text-lg">
                    {attendant
                      ? `${attendant.rating} (${attendant.totalReviews} reviews)`
                      : "No Reviews Yet"}
                  </span>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3">
                  <FaPhone className="text-green-500 text-xl" />
                  <span className="text-lg">
                    {attendant?.mobileNumber || "Contact Number Not Available"}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <MdEmail className="text-blue-500 text-xl" />
                  <span className="text-lg">
                    {attendant?.email || "Email Not Available"}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <FaMapMarkerAlt className="text-red-500 text-xl" />
                  <span className="text-lg">
                    {attendant?.address || "Address Not Available"}
                  </span>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={handleCall}
                  className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 transition-colors ${
                    attendant?.mobileNumber
                      ? "bg-green-500 text-white hover:bg-green-600"
                      : "bg-gray-200 text-gray-500 cursor-not-allowed"
                  }`}
                  disabled={!attendant?.mobileNumber}
                >
                  <FaPhone />{" "}
                  {attendant?.mobileNumber ? "Call Now" : "No Contact Number"}
                </button>
                <button
                  type="button"
                  onClick={handleEmail}
                  className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 transition-colors ${
                    attendant?.email
                      ? "bg-blue-500 text-white hover:bg-blue-600"
                      : "bg-gray-200 text-gray-500 cursor-not-allowed"
                  }`}
                  disabled={!attendant?.email}
                >
                  <MdEmail />{" "}
                  {attendant?.email ? "Send Email" : "No Email Available"}
                </button>
              </div>
            </div>

            {/* Right Section */}
            <div className="md:w-1/3 bg-gradient-to-br from-orange-400 to-orange-500 p-8 flex items-center justify-center">
              <div className="relative w-full">
                <img
                  src={
                    attendant?.profileImage ||
                    "https://via.placeholder.com/400?text=Profile+Image+Not+Available"
                  }
                  alt={
                    attendant
                      ? `${attendant.firstName} ${attendant.lastName}`
                      : "Attendant Profile Image Not Available"
                  }
                  className="w-full h-[400px] object-cover rounded-xl shadow-lg"
                />
                <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm">
                  {attendant?.availability ? (
                    <>
                      {attendant.availability.startTime &&
                      attendant.availability.endTime
                        ? `Available ${new Date(
                            attendant.availability.startTime
                          ).toLocaleTimeString()} - 
                         ${new Date(
                           attendant.availability.endTime
                         ).toLocaleTimeString()}`
                        : "Timing Not Available"}
                    </>
                  ) : (
                    "Availability Unknown"
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="max-w-6xl mx-auto mt-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Track Location</h3>
            <div className="h-[400px] rounded-lg overflow-hidden">
              <MapContainer
                center={attendantPosition}
                zoom={13}
                className="h-full w-full"
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker position={attendantPosition} icon={attendantIcon}>
                  <Popup>
                    {attendant
                      ? `${attendant.firstName} ${attendant.lastName}'s Location`
                      : "Attendant Location Not Available"}
                  </Popup>
                </Marker>
              </MapContainer>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="max-w-6xl mx-auto text-center mt-8">
          <button
            onClick={() => navigate("/")}
            className="bg-[#282261] text-white px-8 py-3 rounded-full hover:bg-opacity-90 transition-all"
          >
            Back to Home
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AssignedAttendant;
