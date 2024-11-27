import React from "react";
import { Link } from "react-router-dom";
import { FaUser, FaHistory, FaCalendarAlt } from "react-icons/fa";
import BackButton from "../BackButton";

const ProfileBooking = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-purple-800">
                Profile & Bookings
              </h2>
              <p className="text-gray-600 mt-1">
                Manage your profile and view your bookings
              </p>
            </div>
            <BackButton />
          </div>

          {/* Profile Section */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-purple-800 mb-4">
              Profile
            </h3>
            <Link
              to="/UserProfile"
              className="block bg-white border-2 border-purple-100 rounded-xl p-6 hover:shadow-md transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 rounded-full text-purple-600 group-hover:bg-purple-200 transition-colors">
                  <FaUser className="text-2xl" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-800">
                    Account Settings
                  </h4>
                  <p className="text-gray-600">
                    View and update your personal information
                  </p>
                </div>
              </div>
            </Link>
          </div>

          {/* Bookings Section */}
          <div>
            <h3 className="text-xl font-semibold text-purple-800 mb-4">
              Bookings
            </h3>
            <div className="space-y-4">
              <Link
                to="/BookingHistory"
                className="block bg-white border-2 border-purple-100 rounded-xl p-6 hover:shadow-md transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-100 rounded-full text-purple-600 group-hover:bg-purple-200 transition-colors">
                    <FaHistory className="text-2xl" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800">
                      Booking History
                    </h4>
                    <p className="text-gray-600">
                      View your past appointments and services
                    </p>
                  </div>
                </div>
              </Link>

              <Link
                to="/UpcomingBooking"
                className="block bg-white border-2 border-purple-100 rounded-xl p-6 hover:shadow-md transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-100 rounded-full text-purple-600 group-hover:bg-purple-200 transition-colors">
                    <FaCalendarAlt className="text-2xl" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800">
                      Upcoming Bookings
                    </h4>
                    <p className="text-gray-600">
                      View and manage your scheduled appointments
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8 text-center">
            <Link
              to="/services"
              className="inline-block px-6 py-3 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors"
            >
              Book New Service
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileBooking;
