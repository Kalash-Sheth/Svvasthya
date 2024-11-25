import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import booking1 from "../../assets/booking_img.png";
import BackButton from "../BackButton";
import axios from "axios";
import { FaClock, FaMapMarkerAlt, FaCalendar, FaUser } from "react-icons/fa";

const UpcomingBooking = () => {
  const navigate = useNavigate();
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUpcomingBookings();
  }, []);

  const fetchUpcomingBookings = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/customer/appointments/upcoming",
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        setUpcomingBookings(response.data.appointments);
      }
    } catch (error) {
      console.error("Error fetching upcoming bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookingClick = (booking) => {
    navigate('/waiting', { 
      state: { 
        booking,
        redirectTo: '/assigned-attendant',
        redirectDelay: 5000 // 5 seconds
      } 
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-800"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 py-8">
      <div className="max-w-5xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-purple-800">
                Upcoming Bookings
              </h2>
              <p className="text-gray-600 mt-1">
                Your scheduled appointments and services
              </p>
            </div>
            <BackButton />
          </div>

          {upcomingBookings.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">
                <FaCalendar className="mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No Upcoming Bookings
              </h3>
              <p className="text-gray-500">
                You don't have any upcoming appointments scheduled.
              </p>
              <Link
                to="/services"
                className="inline-block mt-4 px-6 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors"
              >
                Book a Service
              </Link>
            </div>
          ) : (
            <div className="grid gap-6">
              {upcomingBookings.map((booking) => (
                <div
                  key={booking._id}
                  onClick={() => handleBookingClick(booking)}
                  className="bg-white rounded-xl border border-purple-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden cursor-pointer"
                >
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/3 relative">
                      <img
                        src={booking1}
                        alt={booking.mainService}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm">
                        {booking.status}
                      </div>
                    </div>
                    <div className="p-6 md:w-2/3">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-purple-800 mb-2">
                            {booking.mainService}
                          </h3>
                          <p className="text-purple-600 font-medium">
                            {booking.subService}
                          </p>
                        </div>
                        <Link
                          to={`/BookingDetails/${booking._id}`}
                          className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
                        >
                          View Details
                        </Link>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center text-gray-600">
                          <FaClock className="text-purple-500 mr-2" />
                          <span>
                            {new Date(booking.startTime).toLocaleTimeString()} -{" "}
                            {new Date(booking.endTime).toLocaleTimeString()}
                          </span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <FaCalendar className="text-purple-500 mr-2" />
                          <span>
                            {new Date(booking.startTime).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-start text-gray-600 mb-4">
                        <FaMapMarkerAlt className="text-purple-500 mr-2 mt-1" />
                        <span>{booking.address.fullAddress}</span>
                      </div>

                      {booking.assignedAttendant && (
                        <div className="flex items-center text-gray-600">
                          <FaUser className="text-purple-500 mr-2" />
                          <span>
                            Attendant:{" "}
                            <span className="font-medium">
                              {booking.assignedAttendant.firstName}{" "}
                              {booking.assignedAttendant.lastName}
                            </span>
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UpcomingBooking;
