import React, { useState, useEffect } from 'react';
import { View, Button, Text, Alert, ActivityIndicator, ScrollView } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Location from 'expo-location'; // Optional: to fetch current location

const UpdateAvailabilityScreen = ({ navigation }) => {
    const [startTime, setStartTime] = useState(new Date());
    const [endTime, setEndTime] = useState(new Date());
    const [showStartPicker, setShowStartPicker] = useState(false);
    const [showEndPicker, setShowEndPicker] = useState(false);
    const [loading, setLoading] = useState(false); // Loading state for submitting availability
    const [availability, setAvailability] = useState([]); // Array to hold availability data
    const [fetchingAvailability, setFetchingAvailability] = useState(true); // Loading state for fetching availability

    // Fetch availability when the component mounts
    useEffect(() => {
        const fetchAvailability = async () => {
            setFetchingAvailability(true);
            try {
                const token = await AsyncStorage.getItem('token');
                if (!token) {
                    Alert.alert('Error', 'You are not logged in.');
                    navigation.navigate('Login');
                    return;
                }

                const response = await axios.get('http://192.168.1.7:5000/api/attendant/fetchavailability', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setAvailability(response.data); // Set the fetched availability data
            } catch (error) {
                console.error('Error fetching availability:', error);
                Alert.alert('Error', 'An error occurred while fetching availability.');
            } finally {
                setFetchingAvailability(false); // Stop fetching
            }
        };

        fetchAvailability(); // Call the function
    }, []); // Empty dependency array means it runs once on component mount

    const onChangeStart = (event, selectedDate) => {
        setShowStartPicker(false);
        const currentDate = selectedDate || startTime;
        currentDate.setMinutes(0, 0, 0); // Set to the nearest hour, no minutes/seconds
        if (currentDate < new Date()) {
            Alert.alert('Error', 'Start time cannot be in the past.');
            return;
        }
        setStartTime(currentDate);
    };

    const onChangeEnd = (event, selectedDate) => {
        setShowEndPicker(false);
        const currentDate = selectedDate || endTime;
        currentDate.setMinutes(0, 0, 0); // Set to the nearest hour, no minutes/seconds
        if (currentDate < startTime) {
            Alert.alert('Error', 'End time must be after the start time.');
            return;
        }
        setEndTime(currentDate);
    };

    const checkForOverlappingSlots = (newStartTime, newEndTime) => {
        return availability.some(slot => {
            const existingStartTime = new Date(slot.startTime).getTime();
            const existingEndTime = new Date(slot.endTime).getTime();

            return (
                (newStartTime >= existingStartTime && newStartTime < existingEndTime) || // New start time overlaps with existing slot
                (newEndTime > existingStartTime && newEndTime <= existingEndTime) || // New end time overlaps with existing slot
                (newStartTime <= existingStartTime && newEndTime >= existingEndTime) // New slot fully overlaps with existing slot
            );
        });
    };

    const submitAvailability = async () => {
        setLoading(true); // Start loading
        try {
            const token = await AsyncStorage.getItem('token');
            if (!token) {
                Alert.alert('Error', 'You are not logged in.');
                navigation.navigate('Login');
                return;
            }

            // Check if the new availability overlaps with any existing slots
            const newStartTime = startTime.getTime();
            const newEndTime = endTime.getTime();

            if (checkForOverlappingSlots(newStartTime, newEndTime)) {
                Alert.alert('Error', 'New availability overlaps with an existing slot.');
                setLoading(false); // Stop loading
                return;
            }

            // Optional: Fetch the current location dynamically
            let location = { latitude: 12.9716, longitude: 77.5946 }; // Default location
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status === 'granted') {
                const currentLocation = await Location.getCurrentPositionAsync({});
                location = {
                    latitude: currentLocation.coords.latitude,
                    longitude: currentLocation.coords.longitude
                };
            }

            // Make the API call to update availability
            await axios.post(
                'http://192.168.1.7:5000/api/attendant/updateavailability',
                {
                    startTime: startTime,
                    endTime: endTime,
                    location: location
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            Alert.alert('Success', 'Availability updated successfully.');
        } catch (error) {
            console.error('Error updating availability:', error);
            Alert.alert('Error', 'An error occurred while updating availability.');
        } finally {
            setLoading(false); // Stop loading
        }
    };

    // Helper function to render availability as cards
    const renderAvailabilityCards = () => {
        return availability.map((slot, index) => (
            <View key={index} style={{ marginBottom: 10, padding: 10, borderColor: '#ddd', borderWidth: 1 }}>
                <Text>Start Time: {new Date(slot.startTime).toLocaleString()}</Text>
                <Text>End Time: {new Date(slot.endTime).toLocaleString()}</Text>
                <Text>Location: Latitude {slot.location.latitude}, Longitude {slot.location.longitude}</Text>
            </View>
        ));
    };

    return (
        <ScrollView style={{ padding: 20 }}>
            <Text>Select Start Date & Time:</Text>
            <Button title="Show Start DateTime Picker" onPress={() => setShowStartPicker(true)} />
            {showStartPicker && (
                <DateTimePicker
                    value={startTime}
                    mode="datetime"
                    is24Hour={true}
                    display="default"
                    onChange={onChangeStart}
                />
            )}

            <Text>Select End Date & Time:</Text>
            <Button title="Show End DateTime Picker" onPress={() => setShowEndPicker(true)} />
            {showEndPicker && (
                <DateTimePicker
                    value={endTime}
                    mode="datetime"
                    is24Hour={true}
                    display="default"
                    onChange={onChangeEnd}
                />
            )}

            <Button title="Submit Availability" onPress={submitAvailability} />

            {loading && <ActivityIndicator size="large" color="#0000ff" />}

            <Text style={{ marginTop: 20 }}>Your Availability:</Text>

            {fetchingAvailability ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                renderAvailabilityCards()
            )}
        </ScrollView>
    );
};

export default UpdateAvailabilityScreen;
