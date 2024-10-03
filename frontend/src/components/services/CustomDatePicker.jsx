import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import Header from "../Header";
import { useBookingContext } from './BookingContext';

function CustomDatePicker() {
  const { setBookingData, bookingData } = useBookingContext();
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentWeekIndex, setCurrentWeekIndex] = useState(0); // Track the current week index
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDateTime, setSelectedDateTime] = useState('');

  const navigate = useNavigate();

  const [startTime, setStartTime] = useState({
    hours: "12",
    minutes: "00",
    period: "AM",
  });

  const [endTime, setEndTime] = useState({
    hours: "12",
    minutes: "00",
    period: "AM",
  });

  const [isEndSelected, setIsEndSelected] = useState(false);
  const [endTimeString, setEndTimeString] = useState('');

  useEffect(() => {
    if (selectedDate) {
      const startDateTime = new Date(currentYear, currentMonth, selectedDate,
        parseInt(startTime.hours) + (startTime.period === "PM" ? 12 : 0),
        parseInt(startTime.minutes)
      );

      // Format the start time to the desired string format
      const startTimeFormatted = startDateTime.toISOString().replace('Z', '+00:00');
      setSelectedDateTime(startTimeFormatted);

      // Calculate the end time based on the duration from bookingData
      const duration = bookingData.duration || 0; // Default to 0 if no duration
      const endDateTime = new Date(startDateTime);
      endDateTime.setHours(endDateTime.getHours() + duration);

      // Format the end time to the desired string format
      const endTimeFormatted = endDateTime.toISOString().replace('Z', '+00:00');
      setEndTimeString(endTimeFormatted);

      // Update endTime state
      const endHours = endDateTime.getHours();
      const endMinutes = endDateTime.getMinutes();

      setEndTime({
        hours: endHours % 12 === 0 ? "12" : (endHours % 12).toString().padStart(2, '0'),
        minutes: endMinutes.toString().padStart(2, '0'),
        period: endHours >= 12 ? "PM" : "AM"
      });
    }
  }, [selectedDate, startTime, currentMonth, currentYear, bookingData.duration]);

  const handleNext = () => {
    // Update booking data with selected date and time
    setBookingData((prevData) => ({
      ...prevData,
      startTime: selectedDateTime, // Set formatted start time
      endTime: endTimeString, // Set formatted end time
    }));
    navigate("/AddressContact");
  };


  // Days of the week
  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // Function to get the number of days in a month
  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Function to get the first day of the month (0 - Sunday, 1 - Monday, ...)
  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay();
  };

  // Function to generate the weeks for the current month
  const generateWeeksForMonth = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);

    const weeks = [];
    let currentWeek = [];
    let dayCounter = 1 - firstDay; // Start before the first day if it doesn't start on Monday

    while (dayCounter <= daysInMonth) {
      for (let i = 0; i < 7; i++) {
        if (dayCounter > 0 && dayCounter <= daysInMonth) {
          currentWeek.push(dayCounter);
        } else {
          currentWeek.push(null);
        }
        dayCounter++;
      }
      weeks.push(currentWeek);
      currentWeek = [];
    }

    return weeks;
  };

  // Get weeks for the current month
  const weeks = generateWeeksForMonth();
  const dates = weeks[currentWeekIndex] || [];

  // Function to handle changing to the previous week
  const handlePreviousWeek = () => {
    if (currentWeekIndex === 0) {
      // Go to the last week of the previous month
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
      setCurrentWeekIndex(generateWeeksForMonth().length - 1); // Set to the last week of the new month
    } else {
      setCurrentWeekIndex(currentWeekIndex - 1);
    }
  };

  // Function to handle changing to the next week
  const handleNextWeek = () => {
    if (currentWeekIndex === weeks.length - 1) {
      // Go to the first week of the next month
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
      setCurrentWeekIndex(0); // Set to the first week of the new month
    } else {
      setCurrentWeekIndex(currentWeekIndex + 1);
    }
  };

  // Format month and year for display
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const displayMonthYear = `${monthNames[currentMonth]} ${currentYear}`;

  const timeRangeRef = useRef(null);

  useEffect(() => {
    if (selectedDate && timeRangeRef.current) {
      timeRangeRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedDate]);





  const handleTimeChange = (e, type) => {
    const { name, value } = e.target;
    if (type === "start") {
      setStartTime((prevTime) => ({ ...prevTime, [name]: value }));
    } else {
      setEndTime((prevTime) => ({ ...prevTime, [name]: value }));
    }
  };

  const handleSubmit = () => {
    setIsEndSelected(true);
  };

  //

  return (
    <>
      <Header />
      <div className="container mx-auto flex justify-center h-full px-4">
        {/* Original Date Picker Design */}
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 mt-8 sm:mt-16 w-full max-w-full lg:max-w-[1020px]">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-[#282261] mb-4">
            Select Date
          </h2>
          <div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-6 space-y-4 sm:space-y-0">
            <select
              className="border border-green-500 text-white bg-green-600 text-base sm:text-lg md:text-xl font-bold rounded-lg px-3 py-2"
              value={displayMonthYear}
              readOnly
            >
              <option>{displayMonthYear}</option>
            </select>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <button
                className="border rounded-md p-2 md:p-3 border-green-500 text-green-600"
                onClick={handlePreviousWeek}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5 sm:w-6 sm:h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 19.5L8.25 12l7.5-7.5"
                  />
                </svg>
              </button>
              <button
                className="border rounded-md p-2 md:p-3 border-green-500 text-green-600"
                onClick={handleNextWeek}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5 sm:w-6 sm:h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 4.5l7.5 7.5-7.5 7.5"
                  />
                </svg>
              </button>
            </div>
          </div>
          {/* Calendar Navigation */}
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-2 text-center text-gray-600 text-sm">
            {dates.map((day, index) => (
              <button
                key={index}
                className={`group p-2 sm:p-3 rounded-lg font-extrabold text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-green-600 ${day
                  ? selectedDate === day
                    ? "bg-green-600 text-white"
                    : "border border-green-500 hover:bg-green-600"
                  : "border border-transparent"
                  }`}
                onClick={() => setSelectedDate(day)}
                disabled={!day}
                style={{
                  minWidth: "60px",
                  minHeight: "60px",
                  display: "flex",
                  flexDirection: "column", // Add this line to stack day and date
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {/* Display day of the week */}
                <span className="text-green-600 text-base sm:text-lg md:text-xl font-medium group-hover:text-white">
                  {daysOfWeek[index % 7]}{" "}
                  {/* Assuming `dates` starts on Sunday and `daysOfWeek` is ordered */}
                </span>
                {/* Display date */}
                <span className="text-green-600 group-hover:text-white">
                  {day}
                </span>
              </button>
            ))}
          </div>

          {selectedDate && (
            <>
              <div className={timeRangeRef}>
                <h2 className="text-2xl font-bold text-left mb-4">
                  Select Time
                </h2>

                {/* Starting Time */}
                <div className="mb-4">
                  <label className="block text-lg font-medium mb-1 text-[#282261;]">
                    Start Time:
                  </label>
                  <div className="flex space-x-2 text-2xl font-bold text-[#282261;]">
                    <select
                      name="hours"
                      value={startTime.hours}
                      onChange={(e) => handleTimeChange(e, "start")}
                      className="w-1/3 px-3 py-2 border rounded-lg shadow-sm focus:outline-none"
                    >
                      {Array.from({ length: 12 }, (_, i) => {
                        const hour = i + 1;
                        return (
                          <option
                            key={hour}
                            value={hour.toString().padStart(2, "0")}
                          >
                            {hour}
                          </option>
                        );
                      })}
                    </select>
                    <select
                      name="minutes"
                      value={startTime.minutes}
                      onChange={(e) => handleTimeChange(e, "start")}
                      className="w-1/3 px-3 py-2 border rounded-lg shadow-sm focus:outline-none"
                    >
                      {["00", "15", "30", "45"].map((minute) => (
                        <option key={minute} value={minute}>
                          {minute}
                        </option>
                      ))}
                    </select>
                    <select
                      name="period"
                      value={startTime.period}
                      onChange={(e) => handleTimeChange(e, "start")}
                      className="w-1/3 px-3 py-2 border rounded-lg shadow-sm focus:outline-none"
                    >
                      <option value="AM">AM</option>
                      <option value="PM">PM</option>
                    </select>
                  </div>
                </div>


                <button
                  // onClick={handleSubmit}
                  onClick={handleNext}
                  className="w-full bg-[#EF5A2A] text-white font-semibold py-2 px-4 rounded-lg shadow-md focus:outline-none"
                >
                  Next
                </button>
              </div>
            </>
          )}


        </div>
      </div>
    </>
  );
}

export default CustomDatePicker;
