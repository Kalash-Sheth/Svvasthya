import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import Header from "../Header";

function CustomDatePicker() {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentWeekIndex, setCurrentWeekIndex] = useState(0); // Track the current week index
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [showContactDetails, setShowContactDetails] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState("");

  const [addressForm, setAddressForm] = useState({
    flatNumber: "",
    landmark: "",
    name: "",
  });

  const handleAddressFormChange = (e) => {
    const { name, value } = e.target;
    setAddressForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const [addressAdded, setAddressAdded] = useState(false);

  // Function to handle address save
  const handleSaveAddress = (e) => {
    e.preventDefault();
    if (!addressForm.flatNumber || !addressForm.landmark || !addressForm.name) {
      alert("Please fill out all fields.");
      return;
    }
    const formattedAddress = `${addressForm.flatNumber}, ${addressForm.landmark}, ${addressForm.name}`;
    setSelectedAddress(formattedAddress);
    setShowAddressModal(false);
    setAddressAdded(true);
    // Clear form fields after saving
    setAddressForm({ flatNumber: "", landmark: "", name: "" });

    console.log("Address saved, modal should be hidden.");
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

  const timeRanges = [
    { label: "For 4 hrs", value: "4hrs", price: 1000 },
    { label: "For 12 hrs", value: "12hrs", price: 2000 },
    { label: "For 24 hrs", value: "24hrs", price: 900 },
    { label: "For 7 Days", value: "7days", price: 800 },
  ];
  const timeSlots = [
    "7:00 AM",
    "7:30 AM",
    "8:00 AM",
    "8:30 AM",
    "9:00 AM",
    "9:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "12:00 PM",
    "12:30 PM",
    "1:00 PM",
    "1:30 PM",
    "2:00 PM",
    "2:30 PM",
    "3:00 PM",
    "3:30 PM",
    "4:00 PM",
    "4:30 PM",
    "5:00 PM",
    "5:30 PM",
    "6:00 PM",
    "6:30 PM",
    "7:00 PM",
    "7:30 PM",
    "8:00 PM",
    "8:30 PM",
    "9:00 PM",
  ];

  const timeRangeRef = useRef(null);
  const timeSlotRef = useRef(null);
  const contactDetailsRef = useRef(null);
  const showAddressModalRef = useRef(null);

  useEffect(() => {
    if (selectedDate && timeRangeRef.current) {
      timeRangeRef.current.scrollIntoView({ behavior: "smooth" });
    } else if (selectedTimeRange && timeSlotRef.current) {
      timeSlotRef.current.scrollIntoView({ behavior: "smooth" });
    } else if (selectedTimeSlot && contactDetailsRef.current) {
      contactDetailsRef.current.scrollIntoView({ behavior: "smooth" });
    } else if (showContactDetails && showAddressModalRef.current) {
      showAddressModalRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedDate, selectedTimeRange, selectedTimeSlot, showContactDetails]);

  //
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
                className={`group p-2 sm:p-3 rounded-lg font-extrabold text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-green-600 ${
                  day
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
              <div ref={timeRangeRef}>
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#282261] mb-4">
                  Select Time Range
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
                        <span className="text-2xl font-semibold">
                          {range.label}
                        </span>
                      </div>
                      <span className="text-xl md:text-2xl font-bold tracking-wider">
                        {range.price}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {selectedTimeRange && (
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

                {/* Ending Time */}
                <div className="mb-4 text-2xl font-bold text-[#282261;]">
                  <label className="block text-lg font-medium mb-1">
                    End Time:
                  </label>
                  <div className="flex space-x-2">
                    <select
                      name="hours"
                      value={endTime.hours}
                      onChange={(e) => handleTimeChange(e, "end")}
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
                      value={endTime.minutes}
                      onChange={(e) => handleTimeChange(e, "end")}
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
                      value={endTime.period}
                      onChange={(e) => handleTimeChange(e, "end")}
                      className="w-1/3 px-3 py-2 border rounded-lg shadow-sm focus:outline-none"
                    >
                      <option value="AM">AM</option>
                      <option value="PM">PM</option>
                    </select>
                  </div>
                </div>
                <button
                  // onClick={handleSubmit}
                  onClick={() => setShowContactDetails(true)}
                  className="w-full bg-[#EF5A2A] text-white font-semibold py-2 px-4 rounded-lg shadow-md focus:outline-none"
                >
                  Next
                </button>
              </div>
            </>
          )}

          {/* {selectedTimeSlot && !showContactDetails && (
            <div className={contactDetailsRef}>
              <div className="mt-8 flex justify-center">
                <button
                  className="w-full bg-[#EF5A2A] text-white py-3 rounded-3xl font-semibold"
                  onClick={() => setShowContactDetails(true)}
                >
                  Next
                </button>
              </div>
            </div>
          )} */}

          {showContactDetails && (
            <>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#282261] mt-8 mb-4">
                Enter Contact Details
              </h2>
              <div
                className="bg-[#F7F7FB] border-dashed border-2 border-[#2F2156] rounded-lg p-6 cursor-pointer"
                onClick={() => setShowAddressModal(true)}
              >
                <p className="text-[#2F2156] text-center font-semibold">
                  Tap to Select an Address
                </p>
              </div>
            </>
          )}

          {showAddressModal && (
            <div className="fixed inset-0 flex items-center justify-center min-h-screen bg-gray-100 bg-opacity-50">
              <div className="flex flex-col md:flex-row bg-white shadow-lg rounded-lg overflow-hidden w-full max-w-6xl mx-4">
                {/* Left side: Map */}
                <div className="w-full md:w-2/3 relative">
                  <iframe
                    title="Google Map"
                    className="w-full h-64 md:h-full"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d235013.7484252821!2d72.41492625670197!3d23.020474103675674!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e848aba5bd449%3A0x4fcedd11614f6516!2sAhmedabad%2C%20Gujarat!5e0!3m2!1sen!2sin!4v1724419997434!5m2!1sen!2sin"
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>

                {/* Right side: Form */}
                <div className="w-full md:w-1/3 p-4 md:p-6">
                  <button className="bg-orange-500 text-white py-2 px-6 rounded-3xl mb-4 font-bold">
                    Change
                  </button>
                  <h2 className="text-xl md:text-2xl font-semibold mb-2">
                    ABC Society
                  </h2>
                  <p className="text-gray-500 mb-4">
                    ABC Society, XYZ Road, Area, City, Gujarat 123456
                  </p>
                  <hr className="mb-4" />
                  <form onSubmit={(e) => handleSaveAddress(e)}>
                    <input
                      type="text"
                      name="flatNumber"
                      placeholder="House/Flat Number"
                      value={addressForm.flatNumber}
                      onChange={handleAddressFormChange}
                      className="w-full bg-gray-100 p-2 md:p-3 rounded-3xl mb-4"
                    />
                    <input
                      type="text"
                      placeholder="Landmark"
                      name="landmark"
                      value={addressForm.landmark}
                      onChange={handleAddressFormChange}
                      className="w-full bg-gray-100 p-2 md:p-3 rounded-3xl mb-4"
                    />
                    <input
                      type="text"
                      placeholder="Name"
                      name="name"
                      value={addressForm.name}
                      onChange={handleAddressFormChange}
                      className="w-full bg-gray-100 p-2 md:p-3 rounded-3xl mb-4"
                    />
                    <button
                      type="submit"
                      className="w-full bg-orange-500 text-white py-2 md:py-3 rounded-3xl mt-4"
                    >
                      Save
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {showContactDetails && selectedAddress && !showAddressModal && (
            <>
              <div className="mt-4 ">
                <label className="text-xl md:text-2xl font-semibold text-[#282261] mb-2">
                  Address:
                </label>
                <input
                  type="text"
                  value={selectedAddress}
                  readOnly
                  className="w-full bg-gray-100 p-2 md:p-3 rounded-3xl mt-2"
                />
              </div>
            </>
          )}
          {addressAdded && !showAddressModal && (
            <div className="mt-8 flex justify-center">
              <Link
                to="/BookingConfirmation" // Replace with the path of the page you want to navigate to
                className="w-full"
              >
                <button
                  className="w-full bg-[#EF5A2A] text-white py-3 rounded-3xl font-semibold"
                  onClick={() => setShowContactDetails(true)}
                >
                  Next
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default CustomDatePicker;
