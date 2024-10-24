import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BACKGROUND_LOCATION_TASK = 'background-location-task';

// Define the background task
TaskManager.defineTask(BACKGROUND_LOCATION_TASK, async ({ data, error }) => {
  if (error) {
    console.error('Background task error:', error);
    return;
  }

  if (data) {
    const { locations } = data;
    const location = locations[0];

    // Send location to the backend
    const token = await AsyncStorage.getItem('token');
    if (token) {
      try {

        await axios.put('http://192.168.1.4:5000/api/realtime/updateLocation', {
          currentLocation: {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          },
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('Location updated to backend successfully');
      } catch (err) {
        console.error('Failed to update location:', err);
      }
    }
  }
});

export default function RealTimeModel() {
  const [isAvailable, setIsAvailable] = useState(false);
  const [location, setLocation] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadAvailability = async () => {
      const availability = await AsyncStorage.getItem('isAvailable');
      if (availability) {
        setIsAvailable(JSON.parse(availability));
      }
    };

    loadAvailability();

    // Cleanup function to stop background location tracking on unmount
    return () => {
      stopBackgroundLocationTracking();
    };
  }, []);

  const updateAvailability = async (available) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Error', 'You are not logged in.');
        return;
      }

      // Get current location if setting available
      if (available) {
        const currentLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        setLocation(currentLocation);
      }


      const response = await axios.put(
        'http://192.168.1.4:5000/api/realtime/updateAvailability',
        {
          currentAvailability: available,
          currentLocation: available ? {
            latitude: location?.coords.latitude,
            longitude: location?.coords.longitude,
          } : null,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        console.log('Availability updated successfully');
        setIsAvailable(available);
        await AsyncStorage.setItem('isAvailable', JSON.stringify(available));

        // Start or stop background location tracking based on availability
        if (available) {
          startBackgroundLocationTracking();
        } else {
          stopBackgroundLocationTracking();
        }
      }
    } catch (err) {
      console.error('Failed to update availability:', err);
      setError('Failed to update availability: ' + (err.response?.data?.message || err.message));
    }
  };

  const startBackgroundLocationTracking = async () => {
    try {
      const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
      if (foregroundStatus !== 'granted') {
        Alert.alert('Permission Denied', 'Foreground location permission is required to use this feature.');
        return;
      }

      const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
      if (backgroundStatus !== 'granted') {
        Alert.alert('Permission Denied', 'Background location permission is required to use this feature.');
        return;
      }

      await Location.startLocationUpdatesAsync(BACKGROUND_LOCATION_TASK, {
        accuracy: Location.Accuracy.Balanced,
        timeInterval: 5000,
        distanceInterval: 0,
        foregroundService: {
          notificationTitle: 'Background Location',
          notificationBody: 'Tracking your location in the background',
        },
      });

      console.log('Started background location tracking');
    } catch (error) {
      console.error('Error starting background tracking:', error);
      Alert.alert('Error', 'Failed to start background location tracking: ' + error.message);
    }
  };

  const stopBackgroundLocationTracking = async () => {
    try {
      const isTaskRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_LOCATION_TASK);
      if (isTaskRegistered) {
        await Location.stopLocationUpdatesAsync(BACKGROUND_LOCATION_TASK);
        console.log('Stopped background location tracking');
      } else {
        console.log('No background location task to stop');
      }
    } catch (error) {
      console.error('Error stopping background tracking:', error);
      Alert.alert('Error', 'Failed to stop background location tracking: ' + error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Real Time Model</Text>
      <Button title="Set Available" onPress={() => updateAvailability(true)} />
      <Button title="Set Not Available" onPress={() => updateAvailability(false)} />
      {error && <Text style={styles.error}>{error}</Text>}
      {isAvailable ? (
        <Text style={styles.successMessage}>You are now available for real-time service!</Text>
      ) : (
        <Text style={styles.error}>You are not available for real-time service.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
  },
  error: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
  },
  successMessage: {
    fontSize: 18,
    color: 'green',
    textAlign: 'center',
  },
});
