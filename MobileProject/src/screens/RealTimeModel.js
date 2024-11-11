import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Alert, PermissionsAndroid, Platform } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BackgroundLocationService from '../components/BackgroundLocationService';

export default function RealTimeModel() {
  const [isAvailable, setIsAvailable] = useState(false);
  const [location, setLocation] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadAvailability = async () => {
      try {
        const availability = await AsyncStorage.getItem('isAvailable');
        if (availability === 'true') {
          setIsAvailable(true);
          const permissionGranted = await requestLocationPermission();
          if (permissionGranted) {
            await BackgroundLocationService.start();
          }
        }
      } catch (error) {
        console.error('Error loading availability:', error);
      }
    };

    loadAvailability();
  }, []);

  const requestLocationPermission = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Access Required',
            message: 'This app needs to access your location in the background',
            buttonPositive: 'OK',
          }
        );

        // For Android 10 and above, we need to request background location separately
        if (Platform.Version >= 29) {
          const backgroundGranted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
            {
              title: 'Background Location Access Required',
              message: 'This app needs to access your location in the background',
              buttonPositive: 'OK',
            }
          );
          return (
            granted === PermissionsAndroid.RESULTS.GRANTED &&
            backgroundGranted === PermissionsAndroid.RESULTS.GRANTED
          );
        }
        
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
      return true; // For iOS, handle permissions differently if needed
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  const updateAvailability = async (available) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Error', 'You are not logged in.');
        return;
      }

      if (available) {
        const permissionGranted = await requestLocationPermission();
        if (!permissionGranted) {
          Alert.alert('Permission Denied', 'Location permission is required.');
          return;
        }

        // Get current location
        Geolocation.getCurrentPosition(
          async (position) => {
            const currentLocation = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            };
            setLocation(currentLocation);

            try {
              // Update availability status with location
              const response = await axios.put(
                'http://192.168.0.107:5000/api/realtime/updateAvailability',
                {
                  currentAvailability: true,
                  currentLocation,
                },
                {
                  headers: { Authorization: `Bearer ${token}` },
                }
              );

              if (response.data.success) {
                setIsAvailable(true);
                await AsyncStorage.setItem('isAvailable', 'true');
                await BackgroundLocationService.start();
                console.log('Available status and background service started');
              }
            } catch (error) {
              console.error('Failed to update availability:', error);
              setError('Failed to update availability: ' + error.message);
            }
          },
          (error) => {
            console.error('Location error:', error);
            setError('Failed to get location: ' + error.message);
          },
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
      } else {
        // Set unavailable
        try {
          const response = await axios.put(
            'http://192.168.0.107:5000/api/realtime/updateAvailability',
            {
              currentAvailability: false,
              currentLocation: null,
            },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          if (response.data.success) {
            setIsAvailable(false);
            await AsyncStorage.setItem('isAvailable', 'false');
            await BackgroundLocationService.stop();
            console.log('Unavailable status set and background service stopped');
          }
        } catch (error) {
          console.error('Failed to update availability:', error);
          setError('Failed to update availability: ' + error.message);
        }
      }
    } catch (err) {
      console.error('Error in updateAvailability:', err);
      setError('Error updating availability: ' + err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Real Time Model</Text>
      <Button 
        title={isAvailable ? "Stop Availability" : "Set Available"} 
        onPress={() => updateAvailability(!isAvailable)} 
      />
      {error && <Text style={styles.error}>{error}</Text>}
      {isAvailable ? (
        <Text style={styles.successMessage}>You are now available for real-time service!</Text>
      ) : (
        <Text style={styles.message}>You are not available for real-time service.</Text>
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
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
  },
  successMessage: {
    fontSize: 16,
    color: 'green',
    textAlign: 'center',
    marginTop: 10,
  },
  message: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
  },
});