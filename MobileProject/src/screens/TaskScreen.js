import React, {useEffect, useState} from 'react';
import {View, StyleSheet, ScrollView, Alert} from 'react-native';
import * as Paper from 'react-native-paper';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_URL} from '../config';
import AppointmentCard from '../components/AppointmentCard';
import BRAND_COLORS from '../styles/colors';
import { useFocusEffect } from '@react-navigation/native';

export default function TaskScreen({navigation}) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAppointments = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Error', 'You are not logged in.');
        navigation.navigate('Login');
        return;
      }

      const response = await axios.get(
        `${API_URL}/api/attendant/appointments/assigned`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setAppointments(response.data.assignedAppointments || []);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      Alert.alert(
        'Error',
        'Could not fetch appointments. Please try again later.',
      );
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchAppointments();
    }, []),
  );

  const handleAccept = async appointmentId => {
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.post(
        `${API_URL}/api/attendant/appointments/accept`,
        {appointmentId},
        {
          headers: {Authorization: `Bearer ${token}`},
        },
      );

      // Refresh both screens
      fetchAppointments();
      // Navigate to Home tab and trigger a refresh
      navigation.navigate('Home', {refresh: Date.now()});

      Alert.alert('Success', 'Appointment accepted successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to accept appointment');
    }
  };

  const handleReject = async appointmentId => {
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.post(
        `${API_URL}/api/attendant/appointments/reject`,
        {appointmentId},
        {
          headers: {Authorization: `Bearer ${token}`},
        },
      );
      fetchAppointments();
      Alert.alert('Success', 'Appointment rejected successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to reject appointment');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Paper.ActivityIndicator animating={true} color={BRAND_COLORS.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Paper.Text style={styles.sectionTitle}>Assigned Appointments</Paper.Text>
      {appointments.length === 0 ? (
        <View style={styles.emptyStateContainer}>
          <Paper.Text style={styles.emptyStateText}>
            No new appointment requests
          </Paper.Text>
          <Paper.Text style={styles.emptyStateSubText}>
            New appointments matching your skills will appear here
          </Paper.Text>
        </View>
      ) : (
        appointments.map(appointment => (
          <AppointmentCard
            key={appointment._id}
            appointment={appointment}
            type="assigned"
            onAccept={handleAccept}
            onReject={handleReject}
          />
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: BRAND_COLORS.textPrimary,
    marginBottom: 20,
    marginTop: 10,
  },
  emptyStateContainer: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: BRAND_COLORS.background,
    borderRadius: 12,
    marginBottom: 20,
  },
  emptyStateText: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: BRAND_COLORS.textPrimary,
    marginBottom: 4,
  },
  emptyStateSubText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: BRAND_COLORS.textSecondary,
    textAlign: 'center',
  },
});
