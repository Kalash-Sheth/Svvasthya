import React, { useState } from 'react';
import logo from '../../assets/svvasthya_logo.svg';
import AppointmentRequests from './AppointmentRequests';
import OngoingJobs from './OngoingJobs';
import FinishedJobs from './FinishedJobs';
import Customers from './Customers';
import Attendants from './Attendants';
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [activeComponent, setActiveComponent] = useState("DashboardOverview");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin");
  };

  // Function to render the selected component
  const renderComponent = () => {
    switch (activeComponent) {
      case "Appointment Requests":
        return <AppointmentRequests />;
      case "Ongoing Jobs":
        return <OngoingJobs />;
      case "Finished Jobs":
        return <FinishedJobs />;
      case "Customers":
        return <Customers />;
      case "Attendants":
        return <Attendants />;
      default:
        return <div>Select a component</div>;
    }
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white flex-shrink-0">
        <div className="p-6">
          <img src={logo} alt="Svvasthya Logo" className="h-12 mx-auto mb-6" />
          <ul>
            <li className="mb-2">
              <button
                onClick={() => setActiveComponent("Appointment Requests")}
                className={`block w-full px-4 py-2 text-left rounded hover:bg-gray-700 ${
                  activeComponent === "Appointment Requests" ? "bg-gray-700" : ""
                }`}
              >
                Appointment Requests
              </button>
            </li>
            <li className="mb-2">
              <button
                onClick={() => setActiveComponent("Ongoing Jobs")}
                className={`block w-full px-4 py-2 text-left rounded hover:bg-gray-700 ${
                  activeComponent === "Ongoing Jobs" ? "bg-gray-700" : ""
                }`}
              >
                Ongoing Jobs
              </button>
            </li>
            <li className="mb-2">
              <button
                onClick={() => setActiveComponent("Finished Jobs")}
                className={`block w-full px-4 py-2 text-left rounded hover:bg-gray-700 ${
                  activeComponent === "Finished Jobs" ? "bg-gray-700" : ""
                }`}
              >
                Finished Jobs
              </button>
            </li>
            <li className="mb-2">
              <button
                onClick={() => setActiveComponent("Customers")}
                className={`block w-full px-4 py-2 text-left rounded hover:bg-gray-700 ${
                  activeComponent === "Customers" ? "bg-gray-700" : ""
                }`}
              >
                Customers
              </button>
            </li>
            <li className="mb-2">
              <button
                onClick={() => setActiveComponent("Attendants")}
                className={`block w-full px-4 py-2 text-left rounded hover:bg-gray-700 ${
                  activeComponent === "Attendants" ? "bg-gray-700" : ""
                }`}
              >
                Attendants
              </button>
            </li>
            <li className="mb-2">
              <button
                onClick={() => setActiveComponent("Reports")}
                className={`block w-full px-4 py-2 text-left rounded hover:bg-gray-700 ${
                  activeComponent === "Reports" ? "bg-gray-700" : ""
                }`}
              >
                Reports & Analytics
              </button>
            </li>
            <li className="mb-2">
              <button
                onClick={() => setActiveComponent("Settings")}
                className={`block w-full px-4 py-2 text-left rounded hover:bg-gray-700 ${
                  activeComponent === "Settings" ? "bg-gray-700" : ""
                }`}
              >
                Settings
              </button>
            </li>
          </ul>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-md p-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Admin Dashboard</h2>
          <div className="flex items-center">
            <span className="text-gray-700 mr-4">Welcome, Admin</span>
            <button
              onClick={handleLogout}
              className="text-red-500 hover:text-red-600"
            >
              Log out
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-grow p-6 bg-gray-100">
          {/* Render the active component */}
          {renderComponent()}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
