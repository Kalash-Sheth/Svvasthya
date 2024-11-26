import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import babyImage from "../assets/babycare.png";
import careImage from "../assets/caregiver.png";
import nurseImage from "../assets/nursing.png";
import textlogo from "../assets/svvasthya_letter_logo.svg";
import watermark from "../assets/watermark.svg";

// Reusable ServiceCard component
const ServiceCard = ({ image, title, gradientFrom, gradientTo, onClick }) => (
  <div className="service-card w-[380px] h-[270px] group relative overflow-visible bg-white shadow-lg rounded-3xl sm:w-[440px] sm:h-[310px]">
    <div className="absolute inset-0 bg-black opacity-0 transition-opacity duration-300"></div>
    <img
      src={image}
      alt={title}
      className="absolute bottom-0 w-full h-auto transition-transform duration-300 group-hover:scale-130 group-hover:translate-y-50 transform-origin-top"
    />
    <div
      className={`absolute bottom-0 left-0 right-0 w-full h-2/3 bg-gradient-to-t from-[${gradientFrom}] to-[${gradientTo}] opacity-1 rounded-3xl`}
    ></div>
    <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center text-white">
      <h2 className="font-bold text-7xl mb-4">{title}</h2>
      <button
        onClick={onClick}
        className="flex items-center justify-center w-36 h-12 text-2xl font-medium bg-orange-500 border-2 border-white rounded-full transition-all duration-300 transform group-hover:w-44"
      >
        <span className="mr-2">Book Now</span>
        <span className="transition-transform duration-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-1">
          →
        </span>
      </button>
    </div>
  </div>
);

function Hero() {
  const navigate = useNavigate();
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setStage(1), 1000),
      setTimeout(() => setStage(2), 2500),
      setTimeout(() => setStage(3), 3500),
    ];

    return () => timers.forEach(clearTimeout);
  }, []);

  const handleBookNow = () => {
    navigate("/services");
  };

  return (
    <div className="min-h-screen relative pb-20">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src={watermark}
          alt="Watermark"
          className="w-full h-full object-cover opacity-50"
        />
      </div>

      {/* Logo Animation */}
      <div
        className={`flex justify-center items-center pt-20 ${
          stage === 1 ? "block" : "hidden"
        }`}
      >
        <img
          src={textlogo}
          alt="Svvasthya logo"
          className="w-48 sm:w-64 md:w-80 lg:w-96 transition-all duration-300"
        />
      </div>

      {/* Main Hero Content */}
      <div
        className={`relative px-4 sm:px-6 lg:px-8 pt-10 ${
          stage > 1 ? "block" : "hidden"
        }`}
      >
        <div className="text-center max-w-4xl mx-auto">
          <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#262163] mb-4">
            स्वास्थ्य का सच्चा साथी:
          </p>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-6">
            Empowering Your Well-being at Home
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl font-normal mb-2">
            Bringing Compassionate
          </p>
          <p className="text-lg sm:text-xl md:text-2xl font-normal mb-6">
            Home Health care to your Doorstep
          </p>
          <button
            onClick={handleBookNow}
            className="emergency-btn px-6 py-3 bg-orange-600 text-white rounded-full text-base sm:text-lg md:text-xl hover:bg-orange-700 transition-transform transform hover:scale-105"
          >
            Emergency Call Now
          </button>
        </div>
      </div>

      {/* Service Cards */}
      <div
        className={`mt-20 px-4 ${stage > 2 ? "block" : "hidden"}`}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Nursing Card */}
          <div className="service-card w-full h-[270px] sm:h-[310px] group relative overflow-visible bg-white shadow-lg rounded-3xl">
            <img
              src={nurseImage}
              alt="Nursing"
              className="absolute bottom-0 w-full h-auto transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute bottom-0 left-0 right-0 w-full h-2/3 bg-gradient-to-t from-[#F6A226] to-[rgba(246, 162, 38, 1)] opacity-1 rounded-3xl"></div>
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center text-white">
              <h2 className="font-bold text-4xl sm:text-5xl lg:text-7xl mb-4">Nursing</h2>
              <button
                onClick={handleBookNow}
                className="flex items-center justify-center w-36 h-12 text-xl sm:text-2xl font-medium border-2 border-white rounded-full transition-all duration-300 group-hover:w-44"
              >
                <span className="mr-2">Book Now</span>
                <span className="transition-transform duration-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-1">→</span>
              </button>
            </div>
          </div>

          {/* Caregiver Card */}
          <div className="service-card w-full h-[270px] sm:h-[310px] group relative overflow-visible bg-white shadow-lg rounded-3xl">
            <img
              src={careImage}
              alt="Caregiver"
              className="absolute bottom-0 w-full h-auto transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute bottom-0 left-0 right-0 w-full h-2/3 bg-gradient-to-t from-[#F0592A] to-[rgba(340, 99, 52, 1)] opacity-1 rounded-3xl"></div>
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center text-white">
              <h2 className="font-bold text-4xl sm:text-5xl lg:text-7xl mb-4">Caregiver</h2>
              <button
                onClick={handleBookNow}
                className="flex items-center justify-center w-36 h-12 text-xl sm:text-2xl font-medium border-2 border-white rounded-full transition-all duration-300 group-hover:w-44"
              >
                <span className="mr-2">Book Now</span>
                <span className="transition-transform duration-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-1">→</span>
              </button>
            </div>
          </div>

          {/* Baby Care Card */}
          <div className="service-card w-full h-[270px] sm:h-[310px] group relative overflow-visible bg-white shadow-lg rounded-3xl">
            <img
              src={babyImage}
              alt="Baby Care"
              className="absolute bottom-0 w-full h-auto transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute bottom-0 left-0 right-0 w-full h-2/3 bg-gradient-to-t from-[#009247] to-[rgba(0, 146, 71, 1)] opacity-1 rounded-3xl"></div>
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center text-white">
              <h2 className="font-bold text-4xl sm:text-5xl lg:text-7xl mb-4">Baby Care</h2>
              <button
                onClick={handleBookNow}
                className="flex items-center justify-center w-36 h-12 text-xl sm:text-2xl font-medium border-2 border-white rounded-full transition-all duration-300 group-hover:w-44"
              >
                <span className="mr-2">Book Now</span>
                <span className="transition-transform duration-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-1">→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;
