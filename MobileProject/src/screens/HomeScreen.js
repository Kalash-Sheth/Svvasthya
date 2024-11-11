import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  FlatList,
} from 'react-native';
import { UserCircle, Calendar, Clock, DollarSign, Menu } from 'lucide-react-native';

const COLORS = {
  primary: '#FF6B35',
  secondary: '#4CAF50',
  accent: '#FF9F1C',
  background: '#FFF9F5',
  cardBg: '#FFFFFF',
  text: {
    primary: '#333333',
    secondary: '#666666',
    light: '#FFFFFF',
  },
};

export default function HomeScreen({ navigation, userName = 'Attendant' }) {
  const [menuVisible, setMenuVisible] = useState(false); // State to toggle menu visibility

  const menuItems = [
    { id: 'availability', title: 'Update Availability', screen: 'UpdateAvailability' },
    { id: 'realtime', title: 'Real-Time Model', screen: 'RealTimeModel' },
    { id: 'tasks', title: 'Upcoming Tasks', screen: 'UpcomingTasks' },
    { id: 'earnings', title: 'Total Earnings', screen: 'Earnings' },
    { id: 'profile', title: 'Profile', screen: 'Profile' },
  ];

  const upcomingAppointments = [
    {
      id: '1',
      patientName: 'John Doe',
      service: 'Nursing',
      date: '2024-11-12',
      time: '10:00 AM',
      address: '123 Main Street, Cityville',
    },
    {
      id: '2',
      patientName: 'Jane Smith',
      service: 'Physiotherapy',
      date: '2024-11-13',
      time: '2:00 PM',
      address: '456 Park Avenue, Townsville',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => setMenuVisible((prev) => !prev)} // Toggle menu visibility
            style={styles.menuButton}
          >
            <Menu size={24} color={COLORS.text.primary} />
          </TouchableOpacity>
          <Text style={styles.welcomeText}>Welcome,</Text>
          <Text style={styles.nameText}>{userName}!</Text>
        </View>

        {/* Conditional rendering of menu */}
        {menuVisible && (
          <View style={styles.menu}>
            {menuItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.menuItem}
                onPress={() => {
                  setMenuVisible(false); // Close menu after navigation
                  navigation.navigate(item.screen);
                }}
              >
                <Text style={styles.menuText}>{item.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Upcoming Appointments Section */}
        <Text style={styles.sectionTitle}>Upcoming Appointments</Text>
        <FlatList
          data={upcomingAppointments}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>{item.patientName}</Text>
              <Text style={styles.cardDescription}>{item.service}</Text>
              <Text style={styles.cardDetail}>Date: {item.date}</Text>
              <Text style={styles.cardDetail}>Time: {item.time}</Text>
              <Text style={styles.cardDetail}>Address: {item.address}</Text>
            </View>
          )}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  menuButton: {
    padding: 10,
  },
  welcomeText: {
    fontSize: 18,
    color: COLORS.text.secondary,
  },
  nameText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text.primary,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text.primary,
    paddingHorizontal: 20,
    marginVertical: 10,
  },
  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 15,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  cardDescription: {
    fontSize: 14,
    color: COLORS.text.secondary,
  },
  cardDetail: {
    fontSize: 14,
    color: COLORS.text.primary,
    marginTop: 4,
  },
  menu: {
    position: 'absolute',
    top: 60,
    left: 0,
    backgroundColor: COLORS.cardBg,
    borderRadius: 12,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 10, // Ensure the menu is on top
  },
  menuItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.text.secondary + '20',
  },
  menuText: {
    fontSize: 16,
    color: COLORS.text.primary,
  },
});
