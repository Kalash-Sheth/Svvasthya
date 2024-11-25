import React from 'react';
import { useNavigate } from "react-router-dom";
import {
  FaUserNurse,
  FaStar,
  FaPhone,
  FaIdCard,
  FaClock,
  FaLanguage,
  FaCheckCircle,
} from "react-icons/fa";
import { MdVerified } from "react-icons/md";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import attendantIconImg from "../assets/Map_Attend_icon.png";
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const attendantIcon = L.icon({
  iconUrl: attendantIconImg,
  iconSize: [50, 50],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

const AttendantDetails = () => {
  const navigate = useNavigate();

  // Dummy data
  const attendant = {
    firstName: "Sarah",
    lastName: "Johnson",
    role: "Senior Care Specialist",
    rating: 4.8,
    totalReviews: 127,
    experience: "5+ years",
    mobileNumber: "+91 98765 43210",
    email: "sarah.j@syvasthya.com",
    id: "SYV2024001",
    verificationStatus: "Verified",
    qualifications: [
      "Registered Nurse (RN)",
      "Geriatric Care Certified",
      "First Aid Certified",
      "CPR Certified",
    ],
    languages: ["English", "Hindi", "Marathi"],
    availability: "Available",
    CurrentLocation: {
      latitude: 19.076, // Mumbai coordinates
      longitude: 72.8777,
    },
    profileImage: "https://randomuser.me/api/portraits/women/45.jpg",
    services: [
      "Elder Care",
      "Post-Surgery Care",
      "Medication Management",
      "Vital Monitoring",
    ],
  };

  const attendantPosition = [
    attendant.CurrentLocation.latitude,
    attendant.CurrentLocation.longitude,
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
          <div className="bg-[#282261] p-6 text-white">
            <h1 className="text-3xl font-bold">
              Your Assigned Healthcare Professional
            </h1>
          </div>

          {/* Profile Section */}
          <div className="p-6">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Profile Image */}
              <div className="md:w-1/3">
                <div className="relative">
                  <img
                    src={attendant.profileImage}
                    alt={`${attendant.firstName} ${attendant.lastName}`}
                    className="w-full h-64 object-cover rounded-lg shadow-md"
                  />
                  <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2">
                    <span className="w-2 h-2 bg-white rounded-full"></span>
                    {attendant.availability}
                  </div>
                </div>
              </div>

              {/* Profile Info */}
              <div className="md:w-2/3">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-[#282261]">
                      {`${attendant.firstName} ${attendant.lastName}`}
                    </h2>
                    <p className="text-gray-600">{attendant.role}</p>
                  </div>
                  <div className="flex items-center gap-2 bg-green-50 px-3 py-1 rounded-full">
                    <MdVerified className="text-green-500" />
                    <span className="text-green-700 text-sm">
                      {attendant.verificationStatus}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    <FaStar className="text-yellow-400" />
                    <span>
                      {attendant.rating} ({attendant.totalReviews} reviews)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaClock className="text-blue-500" />
                    <span>{attendant.experience} experience</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaPhone className="text-green-500" />
                    <span>{attendant.mobileNumber}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaIdCard className="text-purple-500" />
                    <span>ID: {attendant.id}</span>
                  </div>
                </div>

                {/* Qualifications */}
                <div className="mb-4">
                  <h3 className="font-semibold mb-2">Qualifications</h3>
                  <div className="flex flex-wrap gap-2">
                    {attendant.qualifications.map((qual, index) => (
                      <span
                        key={index}
                        className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm"
                      >
                        <FaCheckCircle className="inline mr-1" />
                        {qual}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Languages */}
                <div>
                  <h3 className="font-semibold mb-2">Languages</h3>
                  <div className="flex gap-2">
                    {attendant.languages.map((lang, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 px-3 py-1 rounded-full text-sm"
                      >
                        <FaLanguage className="inline mr-1" />
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h3 className="text-xl font-semibold mb-4">Current Location</h3>
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
                  {attendant.firstName} {attendant.lastName}'s Current Location
                </Popup>
              </Marker>
            </MapContainer>
          </div>
        </div>

        {/* Services Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h3 className="text-xl font-semibold mb-4">Services Offered</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {attendant.services.map((service, index) => (
              <div
                key={index}
                className="bg-gray-50 p-4 rounded-lg text-center"
              >
                <FaUserNurse className="text-[#282261] text-2xl mx-auto mb-2" />
                <span className="text-gray-700">{service}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          <button
            onClick={() => navigate("/")}
            className="bg-[#282261] text-white px-8 py-3 rounded-full hover:bg-opacity-90 transition-all"
          >
            Back to Home
          </button>
          <button
            onClick={() =>
              (window.location.href = `tel:${attendant.mobileNumber}`)
            }
            className="bg-green-500 text-white px-8 py-3 rounded-full hover:bg-opacity-90 transition-all"
          >
            Call Attendant
          </button>
        </div>
      </div>
    </div>
  );
};

export default AttendantDetails;
