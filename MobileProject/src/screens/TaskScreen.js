import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../config';

export default function TaskScreen() {
  const [acceptedJobs, setAcceptedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Function to fetch accepted jobs from the backend
  const fetchAcceptedJobs = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Error', 'You are not logged in.');
        navigation.navigate('Login');
        return;
      }

      const response = await axios.get(
        `${API_URL}/api/attendant/acceptedAppointments`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setAcceptedJobs(response.data.acceptedAppointments);
    } catch (error) {
      console.error('Error fetching accepted jobs:', error);
      Alert.alert('Error', 'Could not fetch accepted jobs. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAcceptedJobs();
  }, []);

  const renderJobItem = ({ item }) => (
    <View style={styles.taskCard}>
      <Text style={styles.taskTitle}>{item.title || 'Accepted Appointment'}</Text>
      <Text>{item.duration} at {item.startTime}</Text>
      <Text>Status: {item.status}</Text>
    </View>
  );

  if (loading) {
    return <Text>Loading...</Text>; // Loading state
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={acceptedJobs}
        keyExtractor={item => item._id} 
        renderItem={renderJobItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  taskCard: {
    backgroundColor: '#f4f4f4',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
});
