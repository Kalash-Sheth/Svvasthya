import React, { useState } from 'react';
import logo from '../../assets/svvasthya_logo.svg'; // Replace with actual logo path
// import DashboardOverview from './DashboardOverview';
import AppointmentRequests from './AppointmentRequests';
// import ManageAttendants from './ManageAttendants';
// import Customers from './Customers';
// import Reports from './Reports';
// import Settings from './Settings';

const AdminDashboard = () => {
    const [activeComponent, setActiveComponent] = useState('DashboardOverview'); // State to track which component is active

    // Function to render the selected component
    const renderComponent = () => {
        switch (activeComponent) {
            // case 'DashboardOverview':
            //     return <DashboardOverview />;
            case 'Appointment Requests':
                return <AppointmentRequests />;
            // case 'ManageAttendants':
            //     return <ManageAttendants />;
            // case 'Customers':
            //     return <Customers />;
            // case 'Reports':
            //     return <Reports />;
            // case 'Settings':
            //     return <Settings />;
            // default:
            //     return <DashboardOverview />;
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
                                onClick={() => setActiveComponent('Appointment Requests')}
                                className={`block w-full px-4 py-2 text-left rounded hover:bg-gray-700 ${
                                    activeComponent === 'DashboardOverview' ? 'bg-gray-700' : ''
                                }`}
                            >
                              Appointment Requests
                            </button>
                        </li>
                        <li className="mb-2">
                            <button
                                onClick={() => setActiveComponent('Bookings')}
                                className={`block w-full px-4 py-2 text-left rounded hover:bg-gray-700 ${
                                    activeComponent === 'Bookings' ? 'bg-gray-700' : ''
                                }`}
                            >
                                Bookings
                            </button>
                        </li>
                        <li className="mb-2">
                            <button
                                onClick={() => setActiveComponent('ManageAttendants')}
                                className={`block w-full px-4 py-2 text-left rounded hover:bg-gray-700 ${
                                    activeComponent === 'ManageAttendants' ? 'bg-gray-700' : ''
                                }`}
                            >
                                Manage Attendants
                            </button>
                        </li>
                        <li className="mb-2">
                            <button
                                onClick={() => setActiveComponent('Customers')}
                                className={`block w-full px-4 py-2 text-left rounded hover:bg-gray-700 ${
                                    activeComponent === 'Customers' ? 'bg-gray-700' : ''
                                }`}
                            >
                                Customers
                            </button>
                        </li>
                        <li className="mb-2">
                            <button
                                onClick={() => setActiveComponent('Reports')}
                                className={`block w-full px-4 py-2 text-left rounded hover:bg-gray-700 ${
                                    activeComponent === 'Reports' ? 'bg-gray-700' : ''
                                }`}
                            >
                                Reports & Analytics
                            </button>
                        </li>
                        <li className="mb-2">
                            <button
                                onClick={() => setActiveComponent('Settings')}
                                className={`block w-full px-4 py-2 text-left rounded hover:bg-gray-700 ${
                                    activeComponent === 'Settings' ? 'bg-gray-700' : ''
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
                        <button className="text-red-500 hover:text-red-600">Log out</button>
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
