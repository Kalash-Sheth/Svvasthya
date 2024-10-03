import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AppointmentRequests = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch all appointments from the backend
    const fetchAppointments = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/admin/appointments'); // Adjust the URL if needed
            setAppointments(response.data);
        } catch (error) {
            setError('Failed to fetch appointment requests. Please try again later.');
            console.error('Error fetching appointments:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAppointments(); // Call the function to fetch appointments when the component mounts
    }, []);

    if (loading) {
        return <div>Loading appointments...</div>; // Show loading message while fetching data
    }

    if (error) {
        return <div>{error}</div>; // Show error message if fetching fails
    }

    return (
        <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Appointment Requests</h2>
            <table className="min-w-full bg-white border border-gray-200">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border-b p-4 text-left">Main Service</th>
                        <th className="border-b p-4 text-left">Sub Service</th>
                        <th className="border-b p-4 text-left">Start Time</th>
                        <th className="border-b p-4 text-left">End Time</th>
                        <th className="border-b p-4 text-left">Address</th>
                    </tr>
                </thead>
                <tbody>
                    {appointments.map((appointment) => (
                        <tr key={appointment._id}>
                            <td className="border-b p-4">{appointment.mainService}</td>
                            <td className="border-b p-4">{appointment.subService}</td>
                            <td className="border-b p-4">{new Date(appointment.startTime).toLocaleString()}</td>
                            <td className="border-b p-4">{new Date(appointment.endTime).toLocaleString()}</td>
                            <td className="border-b p-4">{appointment.address.fullAddress}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AppointmentRequests;
