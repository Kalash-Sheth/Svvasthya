import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { IoPerson } from 'react-icons/io5';
import { FaPhoneAlt } from 'react-icons/fa';
import { GrMapLocation } from 'react-icons/gr';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import attendantIconImg from '../assets/Map_Attend_icon.png'
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Custom icon for attendants (replace 'attendantIcon.png' with your image)
const attendantIcon = L.icon({
  iconUrl: attendantIconImg ,  // Replace with the correct image path or URL
  iconSize: [50, 50], // Size of the icon
  iconAnchor: [20, 40], // Anchor point of the icon
  popupAnchor: [0, -40], // Popup anchor point relative to the icon
});

const AttendantDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { attendant } = location.state || {}; // Get the attendant data from the state

  // Handle back navigation
  const handleBack = () => {
    navigate(-1); // Navigate back to the previous page
  };

  if (!attendant || !attendant.CurrentLocation) {
    return <div>No attendant data available.</div>;
  }

  const attendantPosition = [attendant.CurrentLocation.latitude, attendant.CurrentLocation.longitude];

  return (
    <div className="flex flex-col items-center p-5 bg-white rounded-lg shadow-md w-[90%] mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-4">Attendant Details</h1>
      <div className="flex items-center mb-4">
        <IoPerson className="text-4xl text-blue-600 mr-2" />
        <h2 className="text-2xl font-semibold">{`${attendant.firstName} ${attendant.lastName}`}</h2>
      </div>
      <div className="flex items-center mb-4">
        <FaPhoneAlt className="text-2xl text-green-600 mr-2" />
        <p className="text-lg">{attendant.mobileNumber}</p>
      </div>
      <div className="flex items-center mb-4">
        <GrMapLocation className="text-2xl text-orange-600 mr-2" />
        <p className="text-lg">Service: {attendant.role}</p>
      </div>
      <div className="flex items-center mb-4">
        <p className="text-lg">Availability: {attendant.CurrentAvailability ? 'Available' : 'Not Available'}</p>
      </div>

      {/* Leaflet Map to show the attendant's location */}
      <div className="w-full h-80 mb-4">
        <MapContainer center={attendantPosition} zoom={13} className="h-full w-full">
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

      <button
        className="bg-blue-600 text-white py-2 px-4 rounded-lg mt-4"
        onClick={handleBack}
      >
        Go Back
      </button>
    </div>
  );
};

export default AttendantDetails;
