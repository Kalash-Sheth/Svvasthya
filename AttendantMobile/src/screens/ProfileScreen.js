import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Image, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProfileScreen({ navigation }) {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch profile data using token
  const fetchProfileData = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        // Handle missing token (log user out, show error, etc.)
        Alert.alert('Error', 'You are not logged in.');
        navigation.navigate('Login');
        return;
      }

      // Call API to get user data based on token
      const response = await fetch('http://192.168.1.7:5000/api/attendant/profile', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`, // Pass token in Authorization header
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        // Set profile data
        setProfileData(data);
      } else {
        Alert.alert('Error', data.message || 'Failed to fetch profile');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#42a5f5" />
      </View>
    );
  }

  if (!profileData) {
    return (
      <View style={styles.container}>
        <Text>No profile data available.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.profileHeader}>
        <Image 
          source={{ uri: 'https://via.placeholder.com/100' }} 
          style={styles.profileImage} 
        />
        <Text style={styles.profileName}>
          {profileData.firstName} {profileData.lastName}
        </Text>
        <Text style={styles.profileDetails}>Mobile: {profileData.mobileNumber}</Text>
        <Text style={styles.profileDetails}>Email: {profileData.email}</Text>
      </View>

      <View style={styles.profileActions}>
        <Button title="Edit Profile" onPress={() => {}} />
        <Button title="Work History" onPress={() => {}} />
        <Button title="Settings" onPress={() => {}} />
        <Button title="Logout" color="red" onPress={() => {
          AsyncStorage.removeItem('token');
          navigation.navigate('Login');
        }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  profileDetails: {
    fontSize: 16,
    marginBottom: 2,
  },
  profileActions: {
    marginTop: 20,
  },
});
