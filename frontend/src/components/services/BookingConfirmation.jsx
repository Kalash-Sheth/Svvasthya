import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../Footer";
import { useBookingContext } from "./BookingContext";
import {
  FaClock,
  FaMapMarkerAlt,
  FaCalendar,
  FaMoneyBillWave,
  FaUpload,
} from "react-icons/fa";
import axios from "axios";

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const BookingConfirmation = () => {
  const { bookingData } = useBookingContext();
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  const handleConfirm = async () => {
    try {
      // Upload file if exists
      let fileUrl = null;
      if (file) {
        try {
          const formData = new FormData();
          formData.append("healthRecord", file); 

          const uploadResponse = await axios.post(
            "http://localhost:5000/api/attendant/upload-healthrecord",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );

          if (uploadResponse.data.success) {
            fileUrl = uploadResponse.data.data.fileUrl; 
          } else {
            console.error(uploadResponse.data.message);
          }
        } catch (error) {
          console.error("Error uploading file:", error.response?.data || error.message);
        }
      }

      const response = await axios.post(
        "http://localhost:5000/api/appointment/appointments",
        {
          mobileNumber: "+919510822738",
          mainService: bookingData.mainService,
          subService: bookingData.subService,
          duration: bookingData.duration,
          startTime: bookingData.startTime,
          endTime: bookingData.endTime,
          address: bookingData.address,
          location: bookingData.location,
          healthRecord: fileUrl,
        },
        {
          withCredentials: true,
        }
      );

      // Check if appointment was created successfully
      if (appointmentResponse.data && appointmentResponse.data.appointment) {
        const appointmentId = appointmentResponse.data.appointment._id;

        // Load Razorpay script
        const isLoaded = await loadRazorpayScript();
        if (!isLoaded) {
          alert("Razorpay SDK failed to load. Please try again.");
          return;
        }

        // Create payment order
        const orderResponse = await axios.post(
          "http://localhost:5000/api/payment/order",
          {
            amount: bookingData.price || 500,
            currency: "INR",
            appointmentId,
          },
          {
            withCredentials: true,
          }
        );

        if (!orderResponse.data.success) {
          throw new Error(orderResponse.data.message || "Failed to create payment order");
        }

        const { orderId, amount, currency, keyId } = orderResponse.data.data;

        // Configure Razorpay options
        const options = {
          key: keyId,
          amount,
          currency,
          name: "Svvasthya",
          description: `Payment for ${bookingData.mainService} - ${bookingData.subService}`,
          order_id: orderId,
          prefill: {
            name: `${bookingData.firstName} ${bookingData.lastName}`,
            contact: bookingData.mobileNumber,
          },
          handler: async function (response) {
            try {
              // Verify payment
              const verifyResponse = await axios.post(
                "http://localhost:5000/api/payment/verify",
                {
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  appointmentId,
                },
                {
                  withCredentials: true,
                }
              );

              if (verifyResponse.data.success) {
                navigate("/waiting", {
                  state: {
                    appointmentId,
                    redirectTo: "/assigned-attendant",
                    redirectDelay: 5000,
                  },
                });
              } else {
                throw new Error("Payment verification failed");
              }
            } catch (error) {
              console.error("Payment verification error:", error);
              alert(error.response?.data?.message || "Payment verification failed. Please contact support.");
            }
          },
          modal: {
            ondismiss: function () {
              alert("Payment cancelled. Please try again.");
            },
          },
          theme: {
            color: "#282261",
          },
        };

        // Initialize Razorpay
        const razorpay = new window.Razorpay(options);
        razorpay.open();
      } else {
        throw new Error("Invalid appointment response");
      }
    } catch (error) {
      console.error("Error:", error);
      if (error.response?.status === 401) {
        alert("Please login to make a booking");
      } else {
        const errorMessage = error.response?.data?.message || 
                            error.message || 
                            "There was an error creating your appointment. Please try again.";
        alert(errorMessage);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 pt-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 mx-4 sm:mx-6 lg:mx-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#282261]">
              Booking Confirmation
            </h2>
            <p className="text-gray-600 mt-2 text-sm sm:text-base">
              Please review your booking details
            </p>
          </div>

          {/* Service Details Card */}
          <div className="bg-gray-50 rounded-xl p-4 sm:p-6 mb-6">
            <h3 className="text-lg sm:text-xl font-semibold text-[#282261] mb-4">
              Service Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="flex items-start gap-3">
                <div className="p-2 sm:p-3 bg-purple-100 rounded-full text-purple-600">
                  <FaMoneyBillWave className="text-lg sm:text-xl" />
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Selected Service</p>
                  <p className="font-semibold text-base sm:text-lg">
                    {bookingData.mainService} - {bookingData.subService}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 sm:p-3 bg-orange-100 rounded-full text-orange-600">
                  <FaClock className="text-lg sm:text-xl" />
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Duration</p>
                  <p className="font-semibold text-base sm:text-lg">
                    {bookingData.duration} hours
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Appointment Details Card */}
          <div className="bg-gray-50 rounded-xl p-4 sm:p-6 mb-6">
            <h3 className="text-lg sm:text-xl font-semibold text-[#282261] mb-4">
              Appointment Details
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 sm:p-3 bg-blue-100 rounded-full text-blue-600">
                  <FaCalendar className="text-lg sm:text-xl" />
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Date & Time</p>
                  <p className="font-semibold text-base sm:text-lg">
                    {new Date(bookingData.startTime).toLocaleDateString()} |{" "}
                    {new Date(bookingData.startTime).toLocaleTimeString()} -{" "}
                    {new Date(bookingData.endTime).toLocaleTimeString()}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 sm:p-3 bg-green-100 rounded-full text-green-600">
                  <FaMapMarkerAlt className="text-lg sm:text-xl" />
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Location</p>
                  <p className="font-semibold text-base sm:text-lg">
                    {bookingData.address.name},{" "}
                    {bookingData.address.houseNumber}
                  </p>
                  <p className="text-gray-600 text-sm sm:text-base">
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

          {/* Upload Prescription */}
          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            <h3 className="text-xl font-semibold text-[#282261] mb-4">
              Upload Prescription or Health Record
            </h3>
            <div className="flex items-center gap-4">
              <label
                htmlFor="healthRecord"
                className="flex items-center gap-2 bg-purple-100 text-purple-600 py-2 px-4 rounded-full cursor-pointer"
              >
                <FaUpload />
                <span>Choose File</span>
              </label>
              <input
                id="healthRecord"
                type="file"
                className="hidden"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={(e) => setFile(e.target.files[0])}
              />
              {file && (
                <p className="text-gray-600">{file.name}</p>
              )}
            </div>
          </div>


          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-2 sm:px-8 sm:py-3 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition-colors text-sm sm:text-base"
            >
              Go Back
            </button>
            <button
              onClick={handleConfirm}
              className="px-6 py-2 sm:px-8 sm:py-3 bg-[#282261] text-white rounded-full hover:bg-opacity-90 transition-colors text-sm sm:text-base"
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
