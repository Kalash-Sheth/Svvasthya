import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // or SecureStore for more security

export default function UpdateAvailabilityScreen() {
  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        // Get token from AsyncStorage (or SecureStore)
        const token = await AsyncStorage.getItem('token'); // Assuming token is stored in AsyncStorage

        if (!token) {
          setError('Authorization token missing');
          setLoading(false);
          return;
        }

        // Make API request to fetch availability
        const response = await fetch('http://192.168.1.7:5000/api/attendant/fetchavailability', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`, // Pass token in Authorization header
              },
            });

        setAvailability(response.data); // Assuming response contains the availability array
      } catch (err) {
        console.error(err);
        setError('Failed to fetch availability');
      } finally {
        setLoading(false);
      }
    };

    fetchAvailability();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Update Availability</Text>
      <FlatList
        data={availability}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.slot}>
            <Text>Start Time: {new Date(item.startTime).toLocaleString()}</Text>
            <Text>End Time: {new Date(item.endTime).toLocaleString()}</Text>
            <Text>Booked: {item.isBooked ? 'Yes' : 'No'}</Text>
          </View>
        )}
      />
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
  slot: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  error: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
  },
});
