import React from "react";
import BackButton from "../BackButton";

const BookingDetails = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-r from-blue-50 to-green-50">
      <div className="max-w-2xl w-full bg-white p-8 rounded-xl shadow-lg border border-gray-300">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-extrabold text-indigo-900">
            Booking Details
          </h2>
          <BackButton className="ml-4" />
        </div>

        <div className="space-y-6 text-left">
          {/* Treatment */}
          <div className="grid grid-cols-2 gap-4 pb-4 border-b border-gray-200">
            <span className="font-semibold text-gray-700">Treatment:</span>
            <span className="font-bold text-indigo-900">TPN INFUSION</span>
          </div>

          {/* Description */}
          <div className="grid grid-cols-2 gap-4">
            <span className="font-semibold text-gray-700">Description:</span>
            <span className="text-gray-600">
              Discover comprehensive health care support services conveniently
              tailored to meet all your needs in one place.
            </span>
          </div>

          {/* Doctor */}
          <div className="grid grid-cols-2 gap-4">
            <span className="font-semibold text-gray-700">Doctor:</span>
            <span>
              <span className="font-bold text-indigo-900">Sunil Patel</span>
              <span className="text-gray-500 ml-2">(M.B.B.S)</span>
            </span>
          </div>

          {/* Contact */}
          <div className="grid grid-cols-2 gap-4">
            <span className="font-semibold text-gray-700">Contact:</span>
            <span className="text-gray-600">+91 9898989898</span>
          </div>

          {/* Address */}
          <div className="grid grid-cols-2 gap-4">
            <span className="font-semibold text-gray-700">Address:</span>
            <span className="text-gray-600">
              123, ABC Society, GHI Road, Area, City, State - Pincode
            </span>
          </div>

          {/* Booking Date */}
          <div className="grid grid-cols-2 gap-4">
            <span className="font-semibold text-gray-700">Booking Dt.:</span>
            <span className="text-gray-600">20 March, 2024</span>
          </div>

          {/* Start Date */}
          <div className="grid grid-cols-2 gap-4">
            <span className="font-semibold text-gray-700">Start Dt.:</span>
            <span className="text-gray-600">20 April, 2024</span>
          </div>

          {/* Time Period */}
          <div className="grid grid-cols-2 gap-4">
            <span className="font-semibold text-gray-700">Time Period:</span>
            <span className="text-gray-600">30 Days</span>
          </div>

          {/* Amount */}
          <div className="grid grid-cols-2 gap-4">
            <span className="font-semibold text-gray-700">Amount:</span>
            <span className="text-gray-600">Rs. 50000/-</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetails;
