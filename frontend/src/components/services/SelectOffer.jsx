import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import { useBookingContext } from "./BookingContext";

function SelectOffer() {
  const [selectedTimeRange, setSelectedTimeRange] = useState(null);
  const navigate = useNavigate();
  const { setBookingData } = useBookingContext();

  const timeRanges = [
    { label: "For 1 hrs", value: "1hrs", price: 500 },
    { label: "For 4 hrs", value: "4hrs", price: 1000 },
    { label: "For 12 hrs", value: "12hrs", price: 2000 },
    { label: "For 24 hrs", value: "24hrs", price: 3000 },
    { label: "For 7 Days ", value: "7days", price: 9000 },
    { label: "For 15 Days", value: "15days", price: 18000 },
  ];

  const handleNext = () => {
    // Set the duration and price in the booking context before navigating
    const selectedRange = timeRanges.find(
      (range) => range.value === selectedTimeRange
    );
    if (selectedRange) {
      let durationInHours = 0;

      // Convert duration to hours
      if (selectedRange.value.includes("days")) {
        const days = parseInt(selectedRange.value); // Extract the number of days
        durationInHours = days * 24; // Convert days to hours
      } else {
        durationInHours = parseInt(selectedRange.value); // Store as hours
      }

      // Set the booking data with the duration as a number
      setBookingData((prev) => ({
        ...prev,
        duration: durationInHours, // Store as a number (in hours)
        price: selectedRange.price,
      }));
    }
    navigate("/ContactDetails");
  };

  return (
    <>
      {/* <Header /> */}
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#ef5b2a1a] to-[#03a3491a]">
        <div className="container mx-auto flex flex-col justify-center h-full px-4">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#282261] mb-4">
            Select Duration and Offer
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {timeRanges.map((range) => (
              <div
                key={range.value}
                className={`flex justify-between items-center px-4 py-3 rounded-3xl text-lg md:text-xl cursor-pointer ${
                  selectedTimeRange === range.value
                    ? "bg-[#3F2A56] text-white"
                    : "bg-[#F6FBF9] text-[#3F2A56]"
                }`}
                onClick={() => setSelectedTimeRange(range.value)}
              >
                <div className="flex items-center">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-2 ${
                      selectedTimeRange === range.value
                        ? "border-white bg-white"
                        : "border-[#3F2A56]"
                    }`}
                  >
                    {selectedTimeRange === range.value && (
                      <div className="w-2.5 h-2.5 rounded-full bg-[#3F2A56]"></div>
                    )}
                  </div>
                  <span className="text-2xl font-semibold">{range.label}</span>
                </div>
                <span className="text-xl md:text-2xl font-bold tracking-wider">
                  {range.price}
                </span>
              </div>
            ))}
          </div>

          <button
            className="mt-4 px-6 py-3 rounded-full bg-[#3F2A56] text-white font-semibold text-lg"
            onClick={handleNext}
            disabled={!selectedTimeRange} // Disable if no time range is selected
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
}

export default SelectOffer;
