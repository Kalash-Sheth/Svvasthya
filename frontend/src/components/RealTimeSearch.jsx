import React, { useState } from "react";
import { GrLocationPin } from "react-icons/gr";
import { IoPerson } from "react-icons/io5";
import {
  IoMedicalOutline,
  IoHomeOutline,
  IoFitnessOutline,
  IoHeartOutline,
} from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

const services = [
  {
    name: "Wound Care",
    icon: <IoMedicalOutline className="text-orange-500 text-xl" />,
  },
  {
    name: "Caregiving",
    icon: <IoHomeOutline className="text-green-500 text-xl" />,
  },
  {
    name: "Physiotherapy",
    icon: <IoFitnessOutline className="text-blue-500 text-xl" />,
  },
  {
    name: "Companionship",
    icon: <IoHeartOutline className="text-red-500 text-xl" />,
  },
];

const RealTimeSearch = () => {
  const [location, setLocation] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLocationClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation(`${latitude},${longitude}`);
        },
        (error) => {
          console.error("Error fetching location:", error);
          alert("Unable to fetch location. Please enable location services.");
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  const handleServiceSelect = (serviceName) => {
    setSelectedService(serviceName);
    setIsDropdownOpen(false);
  };

  const handleSearch = async () => {
    if (!location || !selectedService) {
      alert("Please select a location and service.");
      return;
    }

    setLoading(true);
    try {
      const token = Cookies.get("token");
      const response = await axios.post(
        "http://localhost:5000/api/realtime/search",
        { location, selectedService },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      navigate("/AttendatDetails", {
        state: { attendant: response.data.attendant },
      });
    } catch (error) {
      console.error("Error searching attendants:", error);
      alert("Error fetching attendants. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-center w-[95%] p-5 bg-orange-600 text-white rounded-2xl relative mx-auto left-0 right-0 pt-10 sm:mt-10 md:mt-15 lg:mt-20 max-sm:mb-60">
      <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-white font-black -mt-10 leading-tight">
        MEET SPECIALIST
      </h1>
      <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-normal mt-4 mb-5 px-4">
        Discover comprehensive health care support services conveniently
        <br className="hidden sm:block" />
        tailored to meet all your needs in one place.
      </p>

      <div className="absolute flex flex-col sm:flex-row justify-center rounded-3xl items-center bg-white w-[90%] sm:w-[85%] left-[5%] sm:left-[7.5%] mt-24 sm:mt-20 md:mt-16 lg:mt-12 transform -translate-y-1/2 p-3 shadow-md">
        {/* Location Input */}
        <div className="flex items-center w-full sm:w-[40%] mb-4 sm:mb-0 px-2">
          <span className="text-gray-500 text-base sm:text-lg md:text-xl mr-2">
            <GrLocationPin />
          </span>
          <input
            type="text"
            placeholder="Click to get your Location"
            value={location}
            onClick={handleLocationClick}
            readOnly
            className="border-none p-2 text-sm sm:text-base md:text-lg rounded-lg outline-none w-full text-black"
          />
        </div>

        <div className="border-l border-gray-300 h-8 mx-2 sm:hidden"></div>

        {/* Custom Dropdown */}
        <div className="relative w-full sm:w-[40%] px-2">
          <div
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center justify-between p-2 rounded-lg cursor-pointer bg-white"
          >
            <div className="flex items-center gap-2">
              <IoPerson className="text-gray-500 text-xl" />
              <span className="text-gray-700">
                {selectedService || "Select your Service"}
              </span>
            </div>
            <svg
              className={`w-4 h-4 text-gray-500 transition-transform ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>

          {isDropdownOpen && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
              {services.map((service, index) => (
                <div
                  key={index}
                  onClick={() => handleServiceSelect(service.name)}
                  className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  {service.icon}
                  <span className="text-gray-700">{service.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Search Button */}
        <button
          onClick={handleSearch}
          className="bg-[#282261] text-white border-none p-2 w-full sm:w-52 rounded-full cursor-pointer ml-0 sm:ml-4 text-base sm:text-lg md:text-xl lg:text-2xl font-medium hover:bg-opacity-90 transition-all mt-4 sm:mt-0 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Searching...</span>
            </>
          ) : (
            "Search"
          )}
        </button>
      </div>
    </div>
  );
};

export default RealTimeSearch;
