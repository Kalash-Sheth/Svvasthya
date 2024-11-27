import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBookingContext } from "./BookingContext";
import {
  FaCalendarAlt,
  FaClock,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

const TimeSlot = ({ time, isSelected, onClick }) => (
  <button
    onClick={onClick}
    className={`
      w-full p-3 rounded-lg text-sm sm:text-base font-medium transition-all duration-300
      ${
        isSelected
          ? "bg-[#282261] text-white shadow-lg transform scale-105"
          : "bg-white text-gray-700 hover:bg-gray-50"
      }
    `}
  >
    {time}
  </button>
);

const DateButton = ({
  date,
  dayName,
  isSelected,
  onClick,
  isToday,
  isCurrentMonth,
  disabled,
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`
      flex flex-col items-center p-2 sm:p-3 rounded-lg transition-all duration-300
      ${
        isSelected
          ? "bg-[#282261] text-white transform scale-105"
          : disabled
          ? "opacity-50 cursor-not-allowed"
          : !isCurrentMonth
          ? "text-gray-400"
          : "hover:bg-gray-50"
      }
    `}
  >
    <span className="text-xs font-medium">{dayName}</span>
    <span
      className={`text-lg sm:text-xl font-bold ${
        isToday ? "text-orange-500" : ""
      }`}
    >
      {date}
    </span>
  </button>
);

function CustomDatePicker() {
  const navigate = useNavigate();
  const { bookingData, setBookingData } = useBookingContext();
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());

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

  // Generate time slots from 6 AM to 10 PM
  const timeSlots = Array.from({ length: 17 }, (_, i) => {
    const hour = i + 6;
    const period = hour >= 12 ? "PM" : "AM";
    const displayHour = hour > 12 ? hour - 12 : hour;
    return `${displayHour}:00 ${period}`;
  });

  // Generate calendar grid for current month
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    const today = new Date();
    const calendar = [];
    let day = 1;

    for (let i = 0; i < 6; i++) {
      const week = [];
      for (let j = 0; j < 7; j++) {
        if (i === 0 && j < startingDay) {
          // Previous month days
          const prevMonthLastDay = new Date(year, month, 0).getDate();
          const prevMonthDay = prevMonthLastDay - (startingDay - j - 1);
          week.push({
            date: prevMonthDay,
            isCurrentMonth: false,
            fullDate: new Date(year, month - 1, prevMonthDay),
          });
        } else if (day > daysInMonth) {
          // Next month days
          const nextMonthDay = day - daysInMonth;
          week.push({
            date: nextMonthDay,
            isCurrentMonth: false,
            fullDate: new Date(year, month + 1, nextMonthDay),
          });
          day++;
        } else {
          // Current month days
          const currentDay = new Date(year, month, day);
          week.push({
            date: day,
            isCurrentMonth: true,
            isToday: currentDay.toDateString() === today.toDateString(),
            fullDate: currentDay,
            disabled: currentDay < today,
          });
          day++;
        }
      }
      calendar.push(week);
      if (day > daysInMonth && i !== 0) break;
    }
    return calendar;
  };

  const handlePrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
    );
  };

  const handleDateSelect = (date) => {
    if (!date.disabled) {
      setSelectedDate(date.fullDate);
    }
  };

  const handleNext = () => {
    if (!selectedDate || !selectedTime) {
      alert("Please select both date and time");
      return;
    }

    const [hours, minutes, period] = selectedTime
      .match(/(\d+):(\d+) (AM|PM)/)
      .slice(1);
    let hour = parseInt(hours);
    if (period === "PM" && hour !== 12) hour += 12;
    if (period === "AM" && hour === 12) hour = 0;

    const startTime = new Date(selectedDate);
    startTime.setHours(hour, 0, 0, 0);

    const endTime = new Date(startTime);
    endTime.setHours(
      startTime.getHours() + (parseInt(bookingData?.duration) || 1)
    );

    setBookingData((prev) => ({
      ...prev,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
    }));

    navigate("/AddressContact");
  };

  const calendar = generateCalendarDays();
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div
      className="min-h-screen py-8 px-4 sm:px-6 lg:px-8"
      style={{
        background: `linear-gradient(
        78.83deg,
        rgba(239, 91, 42, 0.151),
        rgba(250, 174, 66, 0.151) 33%,
        rgba(139, 197, 65, 0.151) 66%,
        rgba(3, 147, 71, 0.151)
      )`,
      }}
    >
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#282261]">
              Select Date & Time
            </h2>
            <div className="flex items-center gap-4">
              <button
                onClick={handlePrevMonth}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <FaChevronLeft className="text-[#282261]" />
              </button>
              <span className="text-lg font-medium">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </span>
              <button
                onClick={handleNextMonth}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <FaChevronRight className="text-[#282261]" />
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="mb-8">
            {/* Days of week header */}
            <div className="grid grid-cols-7 mb-2">
              {daysOfWeek.map((day) => (
                <div
                  key={day}
                  className="text-center text-sm font-medium text-gray-500"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="border rounded-lg overflow-hidden">
              {calendar.map((week, i) => (
                <div key={i} className="grid grid-cols-7">
                  {week.map((day, j) => (
                    <DateButton
                      key={`${i}-${j}`}
                      date={day.date}
                      dayName=""
                      isSelected={
                        selectedDate?.toDateString() ===
                        day.fullDate.toDateString()
                      }
                      isToday={day.isToday}
                      isCurrentMonth={day.isCurrentMonth}
                      disabled={day.disabled}
                      onClick={() => handleDateSelect(day)}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Time Slots */}
          {selectedDate && (
            <div>
              <h3 className="text-xl font-semibold text-[#282261] mb-4">
                Select Time
              </h3>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                {timeSlots.map((time, index) => (
                  <TimeSlot
                    key={index}
                    time={time}
                    isSelected={selectedTime === time}
                    onClick={() => setSelectedTime(time)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Action Button */}
          <button
            onClick={handleNext}
            disabled={!selectedDate || !selectedTime}
            className={`w-full mt-8 py-3 px-4 rounded-lg font-medium transition-all transform hover:scale-105
              ${
                selectedDate && selectedTime
                  ? "bg-[#282261] text-white hover:bg-opacity-90"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }
            `}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}

export default CustomDatePicker;
