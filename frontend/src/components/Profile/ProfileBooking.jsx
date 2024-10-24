import React from "react";
import { Link } from "react-router-dom";

const ProfileBooking = () => {
  return (
    <div
      style={{
        background:
          "linear-gradient(78.83deg, rgba(239, 91, 42, 0.1) 0%, rgba(250, 174, 66, 0.1) 33%, rgba(139, 197, 65, 0.1) 66%, rgba(3, 147, 71, 0.1) 100%)",
        minHeight: "100vh",
      }}
    >
      <div className=" flex justify-center items-center min-h-screen">
        <div className="w-96 mx-auto p-6 h-auto bg-white border border-purple-700 rounded-lg shadow-sm">
          <div>
            <h2 className="text-2xl font-bold text-purple-800 mb-4">Profile</h2>
            <div className="mb-6">
              <Link
                to="/UserProfile"
                className="block border border-purple-700 rounded-md p-4 text-purple-800 hover:bg-purple-100 transition"
              >
                Account
              </Link>
            </div>
            <hr className="border-gray-400 mb-6" />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-purple-800 mb-4">Booking</h2>
            <div className="space-y-4">
              {/* Use Link to navigate to BookingHistory */}
              <Link
                to="/BookingHistory"
                className="block border border-purple-700 rounded-md p-4 text-purple-800 hover:bg-purple-100 transition"
              >
                Booking History
              </Link>

              <Link
                to="/UpcomingBooking"
                className="block border border-purple-700 rounded-md p-4 text-purple-800 hover:bg-purple-100 transition"
              >
                Upcoming Booking
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileBooking;
