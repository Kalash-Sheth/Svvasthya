import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  PermissionsAndroid,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BackgroundLocationService from '../components/BackgroundLocationService';
import {BRAND_COLORS} from '../styles/colors';
import {MapPin, Power} from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { API_URL } from '../config';

export default function RealTimeModel() {
  const [isAvailable, setIsAvailable] = useState(false);
  const [location, setLocation] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
          },
        );

        if (Platform.Version >= 29) {
          const backgroundGranted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
            {
              title: 'Background Location Access Required',
              message:
                'This app needs to access your location in the background',
              buttonPositive: 'OK',
            },
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

  const updateAvailability = async available => {
    setLoading(true);
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

        Geolocation.getCurrentPosition(
          async position => {
            const currentLocation = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            };
            setLocation(currentLocation);

            try {
              const response = await axios.put(
                `${API_URL}/api/realtime/updateAvailability`,
                {
                  currentAvailability: true,
                  currentLocation,
                },
                {
                  headers: {Authorization: `Bearer ${token}`},
                },
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
          error => {
            console.error('Location error:', error);
            setError('Failed to get location: ' + error.message);
          },
          {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
        );
      } else {
        try {
          const response = await axios.put(
            `${API_URL}/api/realtime/updateAvailability`,
            {
              currentAvailability: false,
              currentLocation: null,
            },
            {
              headers: {Authorization: `Bearer ${token}`},
            },
          );

          if (response.data.success) {
            setIsAvailable(false);
            await AsyncStorage.setItem('isAvailable', 'false');
            await BackgroundLocationService.stop();
            console.log(
              'Unavailable status set and background service stopped',
            );
          }
        } catch (error) {
          console.error('Failed to update availability:', error);
          setError('Failed to update availability: ' + error.message);
        }
      }
    } catch (err) {
      console.error('Error in updateAvailability:', err);
      setError('Error updating availability: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={[
        `${BRAND_COLORS.primary}15`,
        `${BRAND_COLORS.secondary}15`,
        `${BRAND_COLORS.primary}15`,
        `${BRAND_COLORS.secondary}15`,
      ]}
      start={{x: 0.2, y: 0.2}}
      end={{x: 1, y: 1}}
      style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.headerText}>Real-Time Availability</Text>
        <View style={styles.card}>
          <Text style={styles.statusText}>
            Current Status:{' '}
            <Text
              style={[
                styles.statusValue,
                {
                  color: isAvailable
                    ? BRAND_COLORS.secondary
                    : BRAND_COLORS.primary,
                },
              ]}>
              {isAvailable ? 'Available' : 'Unavailable'}
            </Text>
          </Text>
          {location && (
            <View style={styles.locationContainer}>
              <MapPin size={20} color={BRAND_COLORS.textSecondary} />
              <Text style={styles.locationText}>
                Lat: {location.latitude.toFixed(4)}, Long:{' '}
                {location.longitude.toFixed(4)}
              </Text>
            </View>
          )}
          <TouchableOpacity
            style={[
              styles.button,
              {
                backgroundColor: isAvailable
                  ? BRAND_COLORS.primary
                  : BRAND_COLORS.secondary,
              },
            ]}
            onPress={() => updateAvailability(!isAvailable)}
            disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Power size={20} color="#FFFFFF" />
                <Text style={styles.buttonText}>
                  {isAvailable ? 'Stop Availability' : 'Set Available'}
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
        {error && <Text style={styles.error}>{error}</Text>}
        {isAvailable ? (
          <Text style={styles.successMessage}>
            You are now available for real-time service!
          </Text>
        ) : (
          <Text style={styles.message}>
            You are not available for real-time service.
          </Text>
        )}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center', // Center content vertically
  },
  headerText: {
    fontSize: 28,
    fontFamily: 'Poppins-Bold',
    fontWeight: '900',
    color: BRAND_COLORS.textPrimary,
    marginBottom: 25,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 2,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statusText: {
    fontSize: 18,
    fontFamily: 'Poppins-Medium',
    color: BRAND_COLORS.textPrimary,
    marginBottom: 10,
  },
  statusValue: {
    fontFamily: 'Poppins-Bold',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  locationText: {
    marginLeft: 10,
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: BRAND_COLORS.textSecondary,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    marginLeft: 10,
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
  },
  error: {
    fontSize: 16,
    color: BRAND_COLORS.primary,
    textAlign: 'center',
    marginTop: 10,
    fontFamily: 'Poppins-Regular',
  },
  successMessage: {
    fontSize: 16,
    color: BRAND_COLORS.secondary,
    textAlign: 'center',
    marginTop: 10,
    fontFamily: 'Poppins-Medium',
  },
  message: {
    fontSize: 16,
    color: BRAND_COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 10,
    fontFamily: 'Poppins-Regular',
  },
});