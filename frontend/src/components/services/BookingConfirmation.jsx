import React from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/svvasthya_logo.svg";

const BookingConfirmation = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-white to-gray-100 px-4">
      <div className="w-full max-w-4xl bg-white px-6 py-10 md:px-16 md:py-14 lg:px-24 lg:py-16 rounded-3xl border border-gray-300">
        <div className="flex justify-center mb-6">
          <img
            src={logo}
            alt="Sdaasthya"
            className="h-20 w-36 md:h-24 md:w-40"
          />{" "}
          {/* Adjusted sizes for responsiveness */}
        </div>
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#282261] text-center mb-4">
          Thank You for Booking
          <br /> with us!!
        </h1>
        <p className="text-center text-lg md:text-xl lg:text-2xl mb-8 text-[#282261]">
          Hi <span className="font-bold">Manish Patel</span>, Just a friendly
          reminder that your appointment with{" "}
          <span className="font-bold">Dr. Sunil Patil</span> is tomorrow at
          7:30PM. We look forward to seeing you!
        </p>
        <div className="flex justify-center space-x-4 mb-4">
          <Link to="/" className="w-full">
            <button className="border-2 w-full max-w-2xl border-orange-500 text-orange-500 font-semibold py-2 px-6 rounded-full hover:bg-orange-100 transition duration-200">
              Doctor Profile
            </button>
          </Link>
        </div>
        <div className="flex justify-center space-x-4">
          <Link to="/" className="w-full">
            <button className="bg-orange-500 w-full max-w-2xl text-white font-semibold py-2 px-6 rounded-full hover:bg-orange-600 transition duration-200">
              Home
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;
