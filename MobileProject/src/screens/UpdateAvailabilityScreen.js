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
import BRAND_COLORS from '../styles/colors';
import {API_URL} from '../config';

const {width} = Dimensions.get('window');

const UpdateAvailabilityScreen = ({navigation}) => {
  const [startDate, setStartDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date(Date.now() + 3600000));
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [currentLocation, setCurrentLocation] = useState({
    latitude: 12.9716,
    longitude: 77.5946,
  });
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
          `${API_URL}/api/attendant/fetchavailability`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        setAvailability(response.data);
      } catch (error) {
        console.error('Error fetching availability:', error);
        Alert.alert('Error', 'An error occurred while fetching availability.');
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
      if (currentDate <= new Date()) {
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
      selectedTime.setSeconds(0);
      const currentTime = selectedTime || startTime;
      if (currentTime <= new Date()) {
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
      if (currentDate <= startDate) {
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
      selectedTime.setSeconds(0);

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
        (newStartTime >= existingStartTime && newStartTime < existingEndTime) ||
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
        `${API_URL}/api/attendant/updateavailability`,
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
              onPress={() => setShowStartDatePicker(true)}>
              <Text style={styles.timeCardValue}>
                {startDate.toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.pickerButton}
              onPress={() => setShowStartTimePicker(true)}>
              <Text style={styles.timeCardValue}>
                {startTime.toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true,
                })}
              </Text>
            </TouchableOpacity>
          </View>

          {/* End Date and Time Cards */}
          <View style={styles.timeCard}>
            <Text style={styles.timeCardLabel}>End Date & Time</Text>
            <TouchableOpacity
              style={styles.pickerButton}
              onPress={() => setShowEndDatePicker(true)}>
              <Text style={styles.timeCardValue}>
                {endDate.toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.pickerButton}
              onPress={() => setShowEndTimePicker(true)}>
              <Text style={styles.timeCardValue}>
                {endTime.toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true,
                })}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Date Time Pickers */}
        {showStartDatePicker && (
          <DateTimePicker
            value={startDate}
            mode="date"
            display="default"
            onChange={onChangeStartDate}
          />
        )}
        {showStartTimePicker && (
          <DateTimePicker
            value={startTime}
            mode="time"
            display="clock"
            IOSDisplay="inline"
            onChange={onChangeStartTime}
            is24Hour={false}
          />
        )}
        {showEndDatePicker && (
          <DateTimePicker
            value={endDate}
            mode="date"
            display="default"
            onChange={onChangeEndDate}
          />
        )}
        {showEndTimePicker && (
          <DateTimePicker
            value={endTime}
            mode="time"
            display="clock"
            IOSDisplay="inline"
            onChange={onChangeEndTime}
            is24Hour={false}
          />
        )}

        {/* Submit Button */}
        <TouchableOpacity
          style={styles.submitButton}
          onPress={submitAvailability}
          disabled={loading}>
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
            <ActivityIndicator
              size="large"
              color="#FF6B35"
              style={styles.loader}
            />
          ) : (
            <View style={styles.availabilityList}>
              {availability.map((slot, index) => (
                <View key={index} style={styles.availabilityCard}>
                  <View style={styles.availabilityCardHeader}>
                    <View style={styles.timeSection}>
                      <Text style={styles.timeSectionLabel}>
                        Start Date & Time
                      </Text>
                      <Text style={styles.timeSectionValue}>
                        {new Date(slot.startTime).toLocaleString()}
                      </Text>
                    </View>
                    <View style={styles.timeSection}>
                      <Text style={styles.timeSectionLabel}>
                        End Date & Time
                      </Text>
                      <Text style={styles.timeSectionValue}>
                        {new Date(slot.endTime).toLocaleString()}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.locationSection}>
                    <Text style={styles.locationText}>
                      Location: {slot.location.latitude.toFixed(4)},{' '}
                      {slot.location.longitude.toFixed(4)}
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
            Time slots must be at least 1 hour long and cannot overlap with
            existing availability.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: BRAND_COLORS.primary,
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerText: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: '900',
  },
  content: {
    padding: 16,
  },
  timeSelectionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    marginTop: 10,
  },
  timeCard: {
    width: width * 0.45,
    padding: 20,
    borderRadius: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    backgroundColor: '#FFFFFF',
    borderLeftWidth: 4,
    borderLeftColor: BRAND_COLORS.primary,
    minHeight: 160,
  },
  pickerButton: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginTop: 8,
    borderRadius: 8,
    backgroundColor: BRAND_COLORS.background,
  },
  timeCardLabel: {
    fontSize: 16,
    color: BRAND_COLORS.textSecondary,
    marginBottom: 12,
    fontFamily: 'Poppins-Medium',
  },
  timeCardValue: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: BRAND_COLORS.textPrimary,
    textAlign: 'center',
  },
  submitButton: {
    backgroundColor: BRAND_COLORS.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginVertical: 20,
    elevation: 2,
    shadowColor: BRAND_COLORS.primary,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
  },
  availabilitySection: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: BRAND_COLORS.secondary,
    marginBottom: 16,
    fontWeight: '900',
  },
  loader: {
    marginVertical: 20,
  },
  availabilityList: {
    gap: 12,
  },
  availabilityCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: BRAND_COLORS.border,
  },
  availabilityCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  timeSection: {
    flex: 1,
  },
  timeSectionLabel: {
    fontSize: 14,
    color: BRAND_COLORS.textSecondary,
    marginBottom: 6,
    fontFamily: 'Poppins-Regular',
  },
  timeSectionValue: {
    fontSize: 16,
    color: BRAND_COLORS.textPrimary,
    fontFamily: 'Poppins-Medium',
  },
  locationSection: {
    borderTopWidth: 1,
    borderTopColor: BRAND_COLORS.border,
    paddingTop: 15,
    marginTop: 5,
  },
  locationText: {
    fontSize: 14,
    color: BRAND_COLORS.textSecondary,
    fontFamily: 'Poppins-Regular',
  },
  alertCard: {
    backgroundColor: `${BRAND_COLORS.primary}10`,
    borderRadius: 15,
    padding: 20,
    marginTop: 25,
    borderLeftWidth: 4,
    borderLeftColor: BRAND_COLORS.primary,
  },
  alertText: {
    fontSize: 15,
    color: BRAND_COLORS.textPrimary,
    lineHeight: 22,
    fontFamily: 'Poppins-Regular',
  },
});

export default UpdateAvailabilityScreen; 