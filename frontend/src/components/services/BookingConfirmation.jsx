import axios from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../Footer";
import { useBookingContext } from "./BookingContext";
import {
  FaClock,
  FaMapMarkerAlt,
  FaCalendar,
  FaMoneyBillWave,
} from "react-icons/fa";

const BookingConfirmation = () => {
  const { bookingData } = useBookingContext();
  const navigate = useNavigate();

  const handleConfirm = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/appointment/appointments",
        {
          mobileNumber: "+919910470485",
          mainService: bookingData.mainService,
          subService: bookingData.subService,
          duration: bookingData.duration,
          startTime: bookingData.startTime,
          endTime: bookingData.endTime,
          address: bookingData.address,
          location: bookingData.location,
        },
        {
          withCredentials: true,
        }
      );

      console.log("Appointment created:", response.data);

      navigate("/waiting");
    } catch (error) {
      console.error("Error:", error);
      if (error.response?.status === 401) {
        alert("Please login to make a booking");
      } else {
        const errorMessage =
          error.response?.data?.message ||
          "There was an error creating your appointment. Please try again.";
        alert(errorMessage);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 pt-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-[#282261]">
              Booking Confirmation
            </h2>
            <p className="text-gray-600 mt-2">
              Please review your booking details
            </p>
          </div>

          {/* Service Details Card */}
          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            <h3 className="text-xl font-semibold text-[#282261] mb-4">
              Service Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <div className="p-3 bg-purple-100 rounded-full text-purple-600">
                  <FaMoneyBillWave className="text-xl" />
                </div>
                <div>
                  <p className="text-gray-600">Selected Service</p>
                  <p className="font-semibold text-lg">
                    {bookingData.mainService} - {bookingData.subService}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-3 bg-orange-100 rounded-full text-orange-600">
                  <FaClock className="text-xl" />
                </div>
                <div>
                  <p className="text-gray-600">Duration</p>
                  <p className="font-semibold text-lg">
                    {bookingData.duration} hours
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Appointment Details Card */}
          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            <h3 className="text-xl font-semibold text-[#282261] mb-4">
              Appointment Details
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-3 bg-blue-100 rounded-full text-blue-600">
                  <FaCalendar className="text-xl" />
                </div>
                <div>
                  <p className="text-gray-600">Date & Time</p>
                  <p className="font-semibold text-lg">
                    {new Date(bookingData.startTime).toLocaleDateString()} |{" "}
                    {new Date(bookingData.startTime).toLocaleTimeString()} -{" "}
                    {new Date(bookingData.endTime).toLocaleTimeString()}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-3 bg-green-100 rounded-full text-green-600">
                  <FaMapMarkerAlt className="text-xl" />
                </div>
                <div>
                  <p className="text-gray-600">Location</p>
                  <p className="font-semibold text-lg">
                    {bookingData.address.name},{" "}
                    {bookingData.address.houseNumber}
                  </p>
                  <p className="text-gray-600">
                    {bookingData.address.landmark},{" "}
                    {bookingData.address.fullAddress}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Price Summary Card */}
          <div className="bg-gray-50 rounded-xl p-6 mb-8">
            <h3 className="text-xl font-semibold text-[#282261] mb-4">
              Price Summary
            </h3>
            <div className="flex justify-between items-center">
              <p className="text-gray-600">Total Amount</p>
              <p className="text-2xl font-bold text-[#282261]">
                ₹{bookingData.price}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate(-1)}
              className="px-8 py-3 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition-colors"
            >
              Go Back
            </button>
            <button
              onClick={handleConfirm}
              className="px-8 py-3 bg-[#282261] text-white rounded-full hover:bg-opacity-90 transition-colors"
            >
              Confirm Booking
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BookingConfirmation;
