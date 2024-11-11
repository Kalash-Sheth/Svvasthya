import BackgroundActions from 'react-native-background-actions';
import Geolocation from 'react-native-geolocation-service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const locationUpdateTask = async (taskDataArguments) => {
  const { delay } = taskDataArguments;
  
  await new Promise(async (resolve) => {
    // Function to get and update location
    const updateLocation = async () => {
      try {
        const isAvailable = await AsyncStorage.getItem('isAvailable');
        const token = await AsyncStorage.getItem('token');
        
        if (isAvailable === 'true' && token) {
          Geolocation.getCurrentPosition(
            async (position) => {
              const currentLocation = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
              };
              
              // Update location to backend
              try {
                await axios.put(
                  'http://192.168.0.107:5000/api/realtime/updateLocation',
                  {currentLocation},
                  {headers: {Authorization: `Bearer ${token}`}},
                );
                console.log('Background location updated successfully');
              } catch (error) {
                console.error('Failed to update location:', error);
              }
            },
            (error) => console.error('Location error:', error),
            { 
              enableHighAccuracy: true, 
              timeout: 15000, 
              maximumAge: 10000 
            }
          );
        }
      } catch (error) {
        console.error('Background task error:', error);
      }
    };

    // Keep running while the task is active
    while (BackgroundActions.isRunning()) {
      await updateLocation();
      await new Promise(resolve => setTimeout(resolve, delay));
    }
    resolve();
  });
};

const options = {
  taskName: 'LocationUpdate',
  taskTitle: 'Location Tracking',
  taskDesc: 'Tracking location in background',
  taskIcon: {
    name: 'ic_launcher',
    type: 'mipmap',
  },
  color: '#ff00ff',
  linkingURI: 'yourScheme://chat/jane',
  parameters: {
    delay: 60000, // Update every 1 minute
  },
};

class BackgroundLocationService {
  static async start() {
    try {
      // Check if the task is already running
      if (await BackgroundActions.isRunning()) {
        console.log('Background service is already running');
        return;
      }

      // Start the background task
      await BackgroundActions.start(locationUpdateTask, options);
      console.log('Background location service started');
    } catch (error) {
      console.error('Failed to start background service:', error);
      throw error;
    }
  }

  static async stop() {
    try {
      // Stop the background task
      await BackgroundActions.stop();
      console.log('Background location service stopped');
    } catch (error) {
      console.error('Failed to stop background service:', error);
      throw error;
    }
  }
}

export default BackgroundLocationService;