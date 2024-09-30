import React, { useState } from "react";

function Dashboard() {
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState({
    hours: "12",
    minutes: "00",
    period: "AM",
  });
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState({
    hours: "12",
    minutes: "00",
    period: "AM",
  });
  const [isEndSelected, setIsEndSelected] = useState(false);

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
  };

  const handleStartTimeChange = (e) => {
    const { name, value } = e.target;
    setStartTime((prevTime) => ({ ...prevTime, [name]: value }));
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
  };

  const handleEndTimeChange = (e) => {
    const { name, value } = e.target;
    setEndTime((prevTime) => ({ ...prevTime, [name]: value }));
  };

  const handleSubmit = () => {
    setIsEndSelected(true);
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-4">
      <h2 className="text-2xl font-bold text-center mb-4">Time Availability</h2>

      {/* Starting Date */}
      <div className="mb-4">
        <label className="block text-lg font-medium mb-1">
          Select Start Date:{" "}
        </label>
        <input
          type="date"
          value={startDate}
          onChange={handleStartDateChange}
          className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-indigo-200"
        />
      </div>

      {/* Starting Time */}
      <div className="mb-4">
        <label className="block text-lg font-medium mb-1">
          Select Start Time:{" "}
        </label>
        <div className="flex space-x-2">
          <select
            name="hours"
            value={startTime.hours}
            onChange={handleStartTimeChange}
            className="w-1/3 px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-indigo-200"
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
            onChange={handleStartTimeChange}
            className="w-1/3 px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-indigo-200"
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
            onChange={handleStartTimeChange}
            className="w-1/3 px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-indigo-200"
          >
            <option value="AM">AM</option>
            <option value="PM">PM</option>
          </select>
        </div>
      </div>

      {/* Ending Date */}
      <div className="mb-4">
        <label className="block text-lg font-medium mb-1">
          Select End Date:{" "}
        </label>
        <input
          type="date"
          value={endDate}
          onChange={handleEndDateChange}
          className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-indigo-200"
        />
      </div>

      {/* Ending Time */}
      <div className="mb-4">
        <label className="block text-lg font-medium mb-1">
          Select End Time:{" "}
        </label>
        <div className="flex space-x-2">
          <select
            name="hours"
            value={endTime.hours}
            onChange={handleEndTimeChange}
            className="w-1/3 px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-indigo-200"
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
            onChange={handleEndTimeChange}
            className="w-1/3 px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-indigo-200"
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
            onChange={handleEndTimeChange}
            className="w-1/3 px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-indigo-200"
          >
            <option value="AM">AM</option>
            <option value="PM">PM</option>
          </select>
        </div>
      </div>

      <button
        onClick={handleSubmit}
        className="w-full bg-indigo-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-indigo-600 focus:outline-none focus:ring focus:ring-indigo-300"
      >
        Show Selection
      </button>

      {/* Display User Selection */}
      {isEndSelected && (
        <div className="mt-6 p-4 bg-gray-100 rounded-lg">
          <h3 className="text-xl font-semibold mb-2">Your Selection:</h3>
          <p>
            Start Date: {startDate} at {startTime.hours}:{startTime.minutes}{" "}
            {startTime.period}
          </p>
          <p>
            End Date: {endDate} at {endTime.hours}:{endTime.minutes}{" "}
            {endTime.period}
          </p>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
