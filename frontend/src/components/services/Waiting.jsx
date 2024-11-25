import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaCheckCircle, FaClock, FaPhoneAlt, FaUserNurse } from "react-icons/fa";

const Waiting = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { booking, redirectTo, redirectDelay } = location.state || {};

  useEffect(() => {
    if (redirectTo) {
      const timer = setTimeout(() => {
        navigate(redirectTo, { 
          state: { 
            attendant: booking?.assignedAttendant,
            bookingDetails: booking 
          } 
        });
      }, redirectDelay || 3000);

      return () => clearTimeout(timer);
    }
  }, [navigate, redirectTo, redirectDelay, booking]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white">
      <div className="flex-grow flex flex-col items-center justify-center px-4 py-12">
        <div className="max-w-4xl w-full">
          {/* Success Card */}
          <div className="bg-white rounded-xl shadow-xl p-8 mb-8 border-t-4 border-[#282261]">
            <div className="text-center">
              <div className="relative">
                <div className="animate-spin rounded-full h-24 w-24 border-b-2 border-[#282261] mx-auto mb-6"></div>
                <FaCheckCircle className="text-green-500 text-4xl absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
              </div>
              <h1 className="text-4xl font-bold text-[#282261] mb-4">
                Booking Confirmed!
              </h1>
              <div className="space-y-4">
                <div className="flex items-center justify-center space-x-2 text-xl text-gray-700">
                  <FaUserNurse className="text-[#282261]" />
                  <p>A Syvasthya attendant will be assigned to you soon</p>
                </div>
                <div className="flex items-center justify-center space-x-2 text-lg text-gray-600">
                  <FaClock className="text-[#282261]" />
                  <p>Expected assignment time: Within 2 hours</p>
                </div>
                <div className="flex items-center justify-center space-x-2 text-lg text-gray-600">
                  <FaPhoneAlt className="text-[#282261]" />
                  <p>Keep your phone nearby for our call</p>
                </div>
              </div>
            </div>
          </div>

          {/* Process Timeline */}
          <div className="bg-white rounded-xl shadow-xl p-8">
            <h2 className="text-2xl font-semibold text-[#282261] mb-6 text-center">
              Booking Process Timeline
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  step: 1,
                  title: "Booking Review",
                  description: "Our team reviews your requirements",
                  status: "In Progress",
                },
                {
                  step: 2,
                  title: "Attendant Assignment",
                  description: "Matching the best professional for your needs",
                  status: "Pending",
                },
                {
                  step: 3,
                  title: "Confirmation Call",
                  description: "Final confirmation with attendant details",
                  status: "Pending",
                },
              ].map((item) => (
                <div
                  key={item.step}
                  className="relative p-6 border rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="absolute top-0 left-0 -mt-3 -ml-3 bg-[#282261] text-white w-8 h-8 rounded-full flex items-center justify-center">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-[#282261] mt-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 mb-2">{item.description}</p>
                  <span
                    className={`text-sm ${
                      item.status === "In Progress"
                        ? "text-blue-500"
                        : "text-gray-400"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Waiting;
