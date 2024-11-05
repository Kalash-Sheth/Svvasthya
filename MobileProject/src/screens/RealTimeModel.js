import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Alert, PermissionsAndroid, Platform } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';

// Function to update location in the background
const updateLocationInBackground = async (location) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    try {
      await axios.put('http://192.168.1.7:5000/api/realtime/updateLocation', {
        currentLocation: {
          latitude: location.latitude,
          longitude: location.longitude,
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
};

// Request location permission
const requestLocationPermission = async () => {
  try {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Access Permission',
          message: 'We need to access your location for real-time tracking',
          buttonPositive: 'OK',
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } else {
      const response = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
      return response === RESULTS.GRANTED;
    }
  } catch (err) {
    console.warn(err);
    return false;
  }
};

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

    // Cleanup function to stop tracking location on unmount
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

      const permissionGranted = await requestLocationPermission();
      if (!permissionGranted) {
        Alert.alert('Permission Denied', 'Location permission is required to proceed.');
        return;
      }

      // Get current location if setting available
      if (available) {
        Geolocation.getCurrentPosition(
          (position) => {
            const currentLocation = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            };
            setLocation(currentLocation);
            updateLocationInBackground(currentLocation);
          },
          (error) => {
            console.error(error);
            setError('Failed to get location: ' + error.message);
          },
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
      }

      const response = await axios.put(
        'http://192.168.1.7:5000/api/realtime/updateAvailability',
        {
          currentAvailability: available,
          currentLocation: available ? location : null,
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

  const startBackgroundLocationTracking = () => {
    Geolocation.watchPosition(
      (position) => {
        const currentLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        updateLocationInBackground(currentLocation);
      },
      (error) => {
        console.error(error);
        Alert.alert('Error', 'Failed to track location: ' + error.message);
      },
      { enableHighAccuracy: true, distanceFilter: 0, interval: 5000 }
    );
    console.log('Started background location tracking');
  };

  const stopBackgroundLocationTracking = () => {
    Geolocation.stopObserving();
    console.log('Stopped background location tracking');
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
