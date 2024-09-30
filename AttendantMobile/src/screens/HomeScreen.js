import React from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome, Attendant!</Text>

     {/* TouchableOpacity for the Update Availability card */}
     <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('UpdateAvailability')}>
        <Text style={styles.cardTitle}>Update Availability</Text>
        <Text>Set your Availability</Text>
      </TouchableOpacity>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Upcoming Tasks</Text>
        <Text>No upcoming tasks.</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Total Earnings</Text>
        <Text>$0.00</Text>
      </View>
      <Button title="View Profile" onPress={() => navigation.navigate('Profile')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#f4f4f4',
    padding: 20,
    marginBottom: 20,
    borderRadius: 10,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    marginBottom: 10,
  },
});
