import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, Alert, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UpcomingTasks = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    // Function to fetch assigned appointments
    const fetchAssignedAppointments = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            if (!token) {
                Alert.alert('Error', 'You are not logged in.');
                navigation.navigate('Login');
                return;
            }
            const response = await axios.get('http://192.168.1.18:5000/api/attendant/assignedAppointments', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            console.log(response.data.assignedAppointments);
            setAppointments(response.data.assignedAppointments);

        } catch (error) {
            console.error('Error fetching appointments:', error);
            Alert.alert('Error', 'Could not fetch appointments. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    // Function to accept an appointment
    const acceptAppointment = async (appointmentId) => {
        try {
            await axios.post('http://192.168.1.18:5000/api/attendant/acceptAppointment', { appointmentId });
            Alert.alert('Success', 'Appointment accepted successfully');
            fetchAssignedAppointments(); // Refresh appointments
        } catch (error) {
            console.error('Error accepting appointment:', error);
            Alert.alert('Error', 'Could not accept appointment. Please try again later.');
        }
    };

    // Function to reject an appointment
    const rejectAppointment = async (appointmentId) => {
        try {
            await axios.post('http://192.168.1.18:5000/api/attendant/rejectAppointment', { appointmentId });
            Alert.alert('Success', 'Appointment rejected successfully');
            fetchAssignedAppointments(); // Refresh appointments
        } catch (error) {
            console.error('Error rejecting appointment:', error);
            Alert.alert('Error', 'Could not reject appointment. Please try again later.');
        }
    };

    useEffect(() => {
        fetchAssignedAppointments();
    }, []);

    if (loading) {
        return <Text>Loading...</Text>; // Loading state
    }

    return (
        <View>
            <Text>Upcoming Appointments</Text>
            <FlatList
                data={appointments}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <View>
                        <Text>{item.duration} - {item.startTime} - {item.startTime}</Text>
                        <Text>Status: {item.status}</Text>
                        <Button title="Accept" onPress={() => acceptAppointment(item._id)} />
                        <Button title="Reject" onPress={() => rejectAppointment(item._id)} />
                    </View>
                )}
            />
        </View>
    );
};


export default UpcomingTasks;
