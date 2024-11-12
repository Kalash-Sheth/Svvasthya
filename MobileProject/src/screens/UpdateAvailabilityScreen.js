/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
    Dimensions,
    Button,
    Platform,
    Alert
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import Geolocation from 'react-native-geolocation-service';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';

const { width } = Dimensions.get('window');

const UpdateAvailabilityScreen = ({ navigation }) => {
    const [startDate, setStartDate] = useState(new Date());
    const [startTime, setStartTime] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [endTime, setEndTime] = useState(new Date(Date.now() + 3600000));
    const [showStartDatePicker, setShowStartDatePicker] = useState(false);
    const [showStartTimePicker, setShowStartTimePicker] = useState(false);
    const [showEndDatePicker, setShowEndDatePicker] = useState(false);
    const [showEndTimePicker, setShowEndTimePicker] = useState(false);
    const [currentLocation, setCurrentLocation] = useState({ latitude: 12.9716, longitude: 77.5946 });
    const [loading, setLoading] = useState(false);
    const [availability, setAvailability] = useState([]);
    const [fetchingAvailability, setFetchingAvailability] = useState(true);


    const requestLocationPermission = async () => {
        if (Platform.OS === 'android') {
            const result = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
            return result === RESULTS.GRANTED;
        } else if (Platform.OS === 'ios') {
            const result = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
            return result === RESULTS.GRANTED;
        }
        return false;
    };

    // Combine date and time into a single Date object
    const combineDateTime = (date, time) => {
        const combined = new Date(date);
        combined.setHours(time.getHours());
        combined.setMinutes(time.getMinutes());
        return combined;
    };

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

          const response = await axios.get(
            'http://192.168.0.107:5000/api/attendant/fetchavailability',
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );

          setAvailability(response.data);
        } catch (error) {
          console.error('Error fetching availability:', error);
          Alert.alert(
            'Error',
            'An error occurred while fetching availability.',
          );
        } finally {
          setFetchingAvailability(false);
        }
      };

      fetchAvailability();
    }, []);

    const onChangeStartDate = (event, selectedDate) => {
      if (Platform.OS === 'android') {
        setShowStartDatePicker(false);
      }
      if (selectedDate) {
        const currentDate = selectedDate || startDate;
        if (currentDate < new Date()) {
          Alert.alert('Error', 'Start date cannot be in the past.');
          return;
        }
        setStartDate(currentDate);
      }
    };

    const onChangeStartTime = (event, selectedTime) => {
      if (Platform.OS === 'android') {
        setShowStartTimePicker(false);
      }
      if (selectedTime) {
        selectedTime.setMinutes(0, 0, 0);
        const currentTime = selectedTime || startTime;
        if (currentTime < new Date()) {
          Alert.alert('Error', 'Start Time cannot be in the past.');
          return;
        }
        setStartTime(selectedTime);
      }
    };

    const onChangeEndDate = (event, selectedDate) => {
      if (Platform.OS === 'android') {
        setShowEndDatePicker(false);
      }
      if (selectedDate) {
        const currentDate = selectedDate || endDate;
        if (currentDate < startDate) {
          Alert.alert('Error', 'End Date must be after the Start Date.');
          return;
        }
        setEndDate(currentDate);
      }
    };

    const onChangeEndTime = (event, selectedTime) => {
      if (Platform.OS === 'android') {
        setShowEndTimePicker(false);
      }
      if (selectedTime) {
        selectedTime.setMinutes(0, 0, 0);

        const currentTime = selectedTime || endTime;
        if (currentTime <= startTime) {
          Alert.alert('Error', 'End Time must be after the Start Time.');
          return;
        }
        setEndTime(selectedTime);
      }
    };

    const checkForOverlappingSlots = (newStartTime, newEndTime) => {
      return availability.some(slot => {
        const existingStartTime = new Date(slot.startTime).getTime();
        const existingEndTime = new Date(slot.endTime).getTime();

        return (
          (newStartTime >= existingStartTime &&
            newStartTime < existingEndTime) ||
          (newEndTime > existingStartTime && newEndTime <= existingEndTime) ||
          (newStartTime <= existingStartTime && newEndTime >= existingEndTime)
        );
      });
    };

    const submitAvailability = async () => {
      setLoading(true);
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          Alert.alert('Error', 'You are not logged in.');
          navigation.navigate('Login');
          return;
        }

        const finalStartTime = combineDateTime(startDate, startTime);
        const finalEndTime = combineDateTime(endDate, endTime);

        if (finalStartTime >= finalEndTime) {
          Alert.alert('Error', 'End time must be after the start time.');
          setLoading(false);
          return;
        }

        if (
          checkForOverlappingSlots(
            finalStartTime.getTime(),
            finalEndTime.getTime(),
          )
        ) {
          Alert.alert(
            'Error',
            'New availability overlaps with an existing slot.',
          );
          setLoading(false);
          return;
        }

        const hasLocationPermission = await requestLocationPermission();
        if (!hasLocationPermission) {
          Alert.alert('Error', 'Location permission denied.');
          setLoading(false);
          return;
        }

        Geolocation.getCurrentPosition(
          position => {
            setCurrentLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
          },
          error => {
            console.error(error);
            Alert.alert(
              'Error',
              'Unable to fetch current location. Using default location.',
            );
          },
          {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
        );

        await axios.post(
          'http://192.168.0.107:5000/api/attendant/updateavailability',
          {
            startTime: finalStartTime.toISOString(),
            endTime: finalEndTime.toISOString(),
            location: currentLocation,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        Alert.alert('Success', 'Availability updated successfully.');
      } catch (error) {
        console.error('Error updating availability:', error);
        Alert.alert('Error', 'An error occurred while updating availability.');
      } finally {
        setLoading(false);
      }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Update Availability</Text>
            </View>

            <View style={styles.content}>
                <View style={styles.timeSelectionContainer}>
                    {/* Start Date and Time Cards */}
                    <View style={styles.timeCard}>
                        <Text style={styles.timeCardLabel}>Start Date & Time</Text>
                        <TouchableOpacity
                            style={styles.pickerButton}
                            onPress={() => setShowStartDatePicker(true)}
                        >
                            <Text style={styles.timeCardValue}>
                                {startDate.toLocaleDateString()}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.pickerButton}
                            onPress={() => setShowStartTimePicker(true)}
                        >
                            <Text style={styles.timeCardValue}>
                                {startTime.toLocaleTimeString()}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* End Date and Time Cards */}
                    <View style={styles.timeCard}>
                        <Text style={styles.timeCardLabel}>End Date & Time</Text>
                        <TouchableOpacity
                            style={styles.pickerButton}
                            onPress={() => setShowEndDatePicker(true)}
                        >
                            <Text style={styles.timeCardValue}>
                                {endDate.toLocaleDateString()}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.pickerButton}
                            onPress={() => setShowEndTimePicker(true)}
                        >
                            <Text style={styles.timeCardValue}>
                                {endTime.toLocaleTimeString()}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Date Time Pickers */}
                {showStartDatePicker && (
                    <DateTimePicker
                        value={startDate}
                        mode="date"
                        is24Hour={true}
                        display="default"
                        onChange={onChangeStartDate}
                    />
                )}
                {showStartTimePicker && (
                    <DateTimePicker
                        value={startTime}
                        mode="time"
                        is24Hour={true}
                        display="default"
                        onChange={onChangeStartTime}
                    />
                )}
                {showEndDatePicker && (
                    <DateTimePicker
                        value={endDate}
                        mode="date"
                        is24Hour={true}
                        display="default"
                        onChange={onChangeEndDate}
                    />
                )}
                {showEndTimePicker && (
                    <DateTimePicker
                        value={endTime}
                        mode="time"
                        is24Hour={true}
                        display="default"
                        onChange={onChangeEndTime}
                    />
                )}

                {/* Submit Button */}
                <TouchableOpacity
                    style={styles.submitButton}
                    onPress={submitAvailability}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#FFFFFF" />
                    ) : (
                        <Text style={styles.submitButtonText}>Submit Availability</Text>
                    )}
                </TouchableOpacity>

                {/* Current Availability Section */}
                <View style={styles.availabilitySection}>
                    <Text style={styles.sectionTitle}>Current Availability</Text>

                    {fetchingAvailability ? (
                        <ActivityIndicator size="large" color="#FF6B35" style={styles.loader} />
                    ) : (
                        <View style={styles.availabilityList}>
                            {availability.map((slot, index) => (
                                <View key={index} style={styles.availabilityCard}>
                                    <View style={styles.availabilityCardHeader}>
                                        <View style={styles.timeSection}>
                                            <Text style={styles.timeSectionLabel}>Start Date & Time</Text>
                                            <Text style={styles.timeSectionValue}>
                                                {new Date(slot.startTime).toLocaleString()}
                                            </Text>
                                        </View>
                                        <View style={styles.timeSection}>
                                            <Text style={styles.timeSectionLabel}>End Date & Time</Text>
                                            <Text style={styles.timeSectionValue}>
                                                {new Date(slot.endTime).toLocaleString()}
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={styles.locationSection}>
                                        <Text style={styles.locationText}>
                                            Location: {slot.location.latitude.toFixed(4)}, {slot.location.longitude.toFixed(4)}
                                        </Text>
                                    </View>
                                </View>
                            ))}
                        </View>
                    )}
                </View>

                {/* Info Alert */}
                <View style={styles.alertCard}>
                    <Text style={styles.alertText}>
                        Time slots must be at least 1 hour long and cannot overlap with existing availability.
                    </Text>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF5EC',
    },
    header: {
        backgroundColor: '#FF6B35',
        padding: 20,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
        textAlign: 'center',
    },
    content: {
        padding: 16,
    },
    timeSelectionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    timeCard: {
        width: width * 0.44,
        padding: 15,
        borderRadius: 12,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        backgroundColor: '#FFFFFF',
        borderLeftWidth: 4,
        borderLeftColor: '#FF6B35',
    },
    pickerButton: {
        paddingVertical: 8,
        marginTop: 4,
        borderRadius: 6,
        backgroundColor: '#F5F5F5',
    },
    timeCardLabel: {
        fontSize: 14,
        color: '#666666',
        marginBottom: 8,
    },
    timeCardValue: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333333',
        textAlign: 'center',
    },
    submitButton: {
        backgroundColor: '#FF6B35',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginVertical: 20,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    submitButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    availabilitySection: {
        marginTop: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#333333',
        marginBottom: 16,
    },
    loader: {
        marginVertical: 20,
    },
    availabilityList: {
        gap: 12,
    },
    availabilityCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    availabilityCardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    timeSection: {
        flex: 1,
    },
    timeSectionLabel: {
        fontSize: 12,
        color: '#666666',
        marginBottom: 4,
    },
    timeSectionValue: {
        fontSize: 14,
        color: '#333333',
        fontWeight: '500',
    },
    locationSection: {
        borderTopWidth: 1,
        borderTopColor: '#EEEEEE',
        paddingTop: 12,
    },
    locationText: {
        fontSize: 12,
        color: '#666666',
    },
    alertCard: {
        backgroundColor: '#FFF3E0',
        borderRadius: 12,
        padding: 16,
        marginTop: 20,
        borderLeftWidth: 4,
        borderLeftColor: '#FF6B35',
    },
    alertText: {
        fontSize: 14,
        color: '#666666',
        lineHeight: 20,
    },
});

export default UpdateAvailabilityScreen; 