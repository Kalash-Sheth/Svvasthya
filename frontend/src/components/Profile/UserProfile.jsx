import React from "react";
import BackButton from "../BackButton";

const UserProfile = () => {
  return (
    <div className="flex justify-center items-center bg-gradient-to-r from-blue-50 to-green-50">
      <div className="mt-10 max-w-2xl w-full bg-white p-8 rounded-xl shadow-lg border border-gray-300">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-extrabold text-indigo-900">Profile</h2>
          <BackButton className="ml-4" />
        </div>

        {/* Profile Picture */}
        <div className="flex justify-center items-center mb-6">
          <div className="relative">
            <img
              className="w-24 h-24 rounded-full object-cover"
              src="https://via.placeholder.com/150"
              alt="Profile"
            />
            <button className="absolute bottom-0 right-0 bg-indigo-600 text-white p-1 rounded-full hover:bg-indigo-700 transition-all">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.232 5.232l3.536 3.536m-2.036-4.536a2.25 2.25 0 113.182 3.182L10.5 18.75H6.75v-3.75L16.732 4.732z"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <input
            type="text"
            placeholder="First Name"
            className="col-span-1 p-3 bg-gray-100 rounded-3xl outline-none text-gray-600"
          />
          <input
            type="text"
            placeholder="Last Name"
            className="col-span-1 p-3 bg-gray-100 rounded-3xl outline-none text-gray-600"
          />
          <input
            type="text"
            placeholder="Mobile Number"
            className="col-span-1 p-3 bg-gray-100 rounded-3xl outline-none text-gray-600"
          />
          <input
            type="email"
            placeholder="Email"
            className="col-span-1 p-3 bg-gray-100 rounded-3xl outline-none text-gray-600"
          />
          <input
            type="text"
            placeholder="Address"
            className="col-span-2 p-3 bg-gray-100 rounded-3xl outline-none text-gray-600"
          />
        </div>

        {/* Map Placeholder */}
        <div className="mb-6">
          <div className="w-full h-64 bg-gray-200 rounded-lg overflow-hidden">
            <img
              className="object-cover w-full h-full"
              src="https://via.placeholder.com/800x400"
              alt="Map Placeholder"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <button className="bg-orange-500 text-white w-full py-3 rounded-3xl font-semibold hover:bg-orange-600 transition-all">
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
