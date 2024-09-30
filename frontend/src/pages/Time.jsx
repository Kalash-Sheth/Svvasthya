import React, { useState } from "react";

const Time = () => {
  const [startTime, setStartTime] = useState({
    hours: "12",
    minutes: "00",
    period: "AM",
  });
  const [endTime, setEndTime] = useState({
    hours: "12",
    minutes: "00",
    period: "PM",
  });
  const [timeRanges, setTimeRanges] = useState([{ start: "", end: "" }]);

  const handleTimeChange = (e, type, rangeIndex = null) => {
    const { name, value } = e.target;
    if (rangeIndex !== null) {
      const newRanges = [...timeRanges];
      newRanges[rangeIndex][type] = value;
      setTimeRanges(newRanges);
    } else if (type === "start") {
      setStartTime((prev) => ({ ...prev, [name]: value }));
    } else {
      setEndTime((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAddRange = () => {
    setTimeRanges((prev) => [...prev, { start: "", end: "" }]);
  };

  const handleRemoveRange = (index) => {
    setTimeRanges((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    // Add logic to validate ranges
    // Ensure total hours do not exceed the selected limit (e.g., 12 hours)
    console.log("Selected Time Ranges: ", timeRanges);
  };

  return (
    <div className="timeRangeRef">
      <h2 className="text-2xl font-bold text-left mb-4">Select Time</h2>

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
                <option key={hour} value={hour.toString().padStart(2, "0")}>
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
        <label className="block text-lg font-medium mb-1">End Time:</label>
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
                <option key={hour} value={hour.toString().padStart(2, "0")}>
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

      {/* Time Ranges */}
      <h3 className="text-lg font-medium mb-2">Customize Time Ranges:</h3>
      {timeRanges.map((range, index) => (
        <div key={index} className="flex space-x-2 mb-4">
          <input
            type="text"
            placeholder="Start Time (e.g., 04:00 AM)"
            value={range.start}
            onChange={(e) => handleTimeChange(e, "start", index)}
            className="w-1/2 px-3 py-2 border rounded-lg shadow-sm focus:outline-none"
          />
          <input
            type="text"
            placeholder="End Time (e.g., 08:00 AM)"
            value={range.end}
            onChange={(e) => handleTimeChange(e, "end", index)}
            className="w-1/2 px-3 py-2 border rounded-lg shadow-sm focus:outline-none"
          />
          <button
            onClick={() => handleRemoveRange(index)}
            className="text-red-500 font-bold"
          >
            Remove
          </button>
        </div>
      ))}
      <button
        onClick={handleAddRange}
        className="mb-4 bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md focus:outline-none"
      >
        Add Another Range
      </button>

      <button
        onClick={handleSubmit}
        className="w-full bg-[#EF5A2A] text-white font-semibold py-2 px-4 rounded-lg shadow-md focus:outline-none"
      >
        Next
      </button>
    </div>
  );
};

export default Time;
