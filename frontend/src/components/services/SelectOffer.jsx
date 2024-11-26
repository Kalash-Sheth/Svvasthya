import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBookingContext } from "./BookingContext";
import { FaClock, FaMoneyBillWave } from "react-icons/fa";

const OfferCard = ({ timeRange, isSelected, onClick }) => (
  <div
    onClick={onClick}
    className={`flex justify-between items-center p-3 sm:p-4 md:p-6 rounded-2xl cursor-pointer transform transition-all duration-300 hover:scale-105 ${
      isSelected
        ? "bg-[#282261] text-white shadow-lg"
        : "bg-white text-[#282261] hover:shadow-md"
    }`}
  >
    <div className="flex items-center gap-2 sm:gap-4">
      <div
        className={`w-4 h-4 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center ${
          isSelected ? "border-white" : "border-[#282261]"
        }`}
      >
        {isSelected && (
          <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-white"></div>
        )}
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <FaClock
            className={`text-base sm:text-lg ${
              isSelected ? "text-white" : "text-orange-500"
            }`}
          />
          <span className="text-lg sm:text-xl md:text-2xl font-bold">
            {timeRange.label}
          </span>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <FaMoneyBillWave
            className={`text-base sm:text-lg ${
              isSelected ? "text-white" : "text-green-500"
            }`}
          />
          <span className="text-base sm:text-lg md:text-xl font-semibold">
            ₹{timeRange.price.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  </div>
);

function SelectOffer() {
  const [selectedTimeRange, setSelectedTimeRange] = useState(null);
  const navigate = useNavigate();
  const { setBookingData } = useBookingContext();

  const timeRanges = [
    { label: "1 Hour", value: "1hrs", price: 500 },
    { label: "4 Hours", value: "4hrs", price: 1000 },
    { label: "12 Hours", value: "12hrs", price: 2000 },
    { label: "24 Hours", value: "24hrs", price: 3000 },
    { label: "7 Days", value: "7days", price: 9000 },
    { label: "15 Days", value: "15days", price: 18000 },
  ];

  const handleNext = () => {
    if (!selectedTimeRange) {
      alert("Please select a duration");
      return;
    }

    const selectedRange = timeRanges.find(
      (range) => range.value === selectedTimeRange
    );
    if (selectedRange) {
      const durationInHours = selectedRange.value.includes("days")
        ? parseInt(selectedRange.value) * 24
        : parseInt(selectedRange.value);

      setBookingData((prev) => ({
        ...prev,
        duration: durationInHours,
        price: selectedRange.price,
      }));
      navigate("/ContactDetails");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 py-4 sm:py-6 md:py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-[#282261] mb-2">
              Select Duration and Offer
            </h2>
            <p className="text-sm sm:text-base text-gray-600">
              Choose the duration that best suits your needs
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8">
            {timeRanges.map((range) => (
              <OfferCard
                key={range.value}
                timeRange={range}
                isSelected={selectedTimeRange === range.value}
                onClick={() => setSelectedTimeRange(range.value)}
              />
            ))}
          </div>

          <div className="flex justify-center mt-4 sm:mt-6">
            <button
              onClick={handleNext}
              disabled={!selectedTimeRange}
              className={`w-full sm:w-auto px-6 sm:px-8 py-2 sm:py-3 rounded-full text-base sm:text-lg md:text-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                selectedTimeRange
                  ? "bg-[#282261] text-white hover:bg-opacity-90"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              Continue to Contact Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SelectOffer;
