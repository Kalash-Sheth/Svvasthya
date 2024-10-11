import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AppointmentRequests = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [availableAttendants, setAvailableAttendants] = useState([]);
    const [selectedAppointment, setSelectedAppointment] = useState(null);

    // Fetch all appointment requests
    const fetchAppointments = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/admin/appointments');
            setAppointments(response.data);
        } catch (error) {
            setError('Failed to fetch appointment requests. Please try again later.');
            console.error('Error fetching appointments:', error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch available attendants based on appointment time
    const fetchAvailableAttendants = async (appointment) => {
        try {
            setSelectedAppointment(appointment); // Set selected appointment
            const response = await axios.post(`http://localhost:5000/api/admin/available`, {
                startTime: appointment.startTime,
                endTime: appointment.endTime,
                role: appointment.subService, // Add role/subService
                appointmentLocation: appointment.location // Add appointment location
            });
            setAvailableAttendants(response.data.availableAttendants);
        } catch (error) {
            setError('Failed to fetch available attendants. Please try again later.');
            console.error('Error fetching attendants:', error);
        }
    };

    // Assign selected attendant to the appointment
    const assignAttendant = async (attendantId) => {
        if (!selectedAppointment) return;
        try {
            await axios.post(`http://localhost:5000/api/admin/${selectedAppointment._id}/assign`, {
                attendantId
            });
            // Refresh appointments and clear state after assignment
            fetchAppointments();
            setAvailableAttendants([]);
            setSelectedAppointment(null);
            alert('Attendant assigned successfully!');
        } catch (error) {
            setError('Failed to assign attendant. Please try again later.');
            console.error('Error assigning attendant:', error);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    if (loading) return <div>Loading appointments...</div>;
    if (error) return <div>{error}</div>;

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
                        <th className="border-b p-4 text-left">Action</th>
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
                            <td className="border-b p-4">
                                <button
                                    onClick={() => fetchAvailableAttendants(appointment)}
                                    className="bg-blue-500 text-white px-4 py-2 rounded"
                                >
                                    Assign
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {availableAttendants.length > 0 && (
                <div className="mt-4">
                    <h3 className="text-lg font-semibold mb-2">Available Attendants</h3>
                    <ul>
                        {availableAttendants.map((attendant) => (
                            <li key={attendant.attendant._id} className="mb-2">
                                {attendant.attendant.firstName} {attendant.attendant.lastName} (Distance: {attendant.distance})
                                <button
                                    onClick={() => assignAttendant(attendant.attendant._id)}
                                    className="bg-green-500 text-white ml-4 px-3 py-1 rounded"
                                >
                                    Assign to Appointment
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default AppointmentRequests;
