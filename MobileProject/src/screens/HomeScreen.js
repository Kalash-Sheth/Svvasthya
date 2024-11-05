import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { UserCircle, Calendar, Clock, DollarSign } from 'lucide-react-native';

// Brand color palette based on Sdasthya logo
const COLORS = {
  primary: '#FF6B35',    // Orange from logo
  secondary: '#4CAF50',  // Green from logo
  accent: '#FF9F1C',     // Warm accent
  background: '#FFF9F5', // Warm light background
  cardBg: '#FFFFFF',
  text: {
    primary: '#333333',
    secondary: '#666666',
    light: '#FFFFFF'
  }
};

export default function HomeScreen({ navigation, userName = 'Attendant' }) {
  const menuItems = [
    {
      id: 'availability',
      title: 'Update Availability',
      description: 'Set your working hours',
      icon: Calendar,
      screen: 'UpdateAvailability',
      iconColor: COLORS.primary
    },
    {
      id: 'realtime',
      title: 'Real Time Model',
      description: 'View current activities',
      icon: Clock,
      screen: 'RealTimeModel',
      iconColor: COLORS.secondary
    },
    {
      id: 'tasks',
      title: 'Upcoming Tasks',
      description: 'No upcoming tasks',
      icon: Clock,
      screen: 'UpcomingTasks',
      iconColor: COLORS.accent
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.welcomeText}>Welcome,</Text>
          <Text style={styles.nameText}>{userName}!</Text>
        </View>

        {/* Menu Cards */}
        {menuItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.card}
            onPress={() => navigation.navigate(item.screen)}
            activeOpacity={0.7}
          >
            <View style={styles.cardContent}>
              <View style={[styles.iconContainer, { backgroundColor: `${item.iconColor}15` }]}>
                <item.icon size={24} color={item.iconColor} />
              </View>
              <View style={styles.cardTextContainer}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardDescription}>{item.description}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}

        {/* Earnings Card */}
        <View style={[styles.card, styles.earningsCard]}>
          <View style={styles.cardContent}>
            <View style={[styles.iconContainer, { backgroundColor: `${COLORS.secondary}15` }]}>
              <DollarSign size={24} color={COLORS.secondary} />
            </View>
            <View style={styles.cardTextContainer}>
              <Text style={styles.cardTitle}>Total Earnings</Text>
              <Text style={[styles.earningsAmount, { color: COLORS.secondary }]}>$0.00</Text>
            </View>
          </View>
        </View>

        {/* Profile Button */}
        <TouchableOpacity
          style={[styles.profileButton, { backgroundColor: COLORS.primary }]}
          onPress={() => navigation.navigate('Profile')}
          activeOpacity={0.7}
        >
          <UserCircle size={24} color={COLORS.text.light} />
          <Text style={styles.profileButtonText}>View Profile</Text>
        </TouchableOpacity>
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
    padding: 20,
    paddingBottom: 10,
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
  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 15,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardTextContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    color: COLORS.text.secondary,
  },
  earningsCard: {
    backgroundColor: COLORS.cardBg,
  },
  earningsAmount: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  profileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 20,
    marginVertical: 20,
  },
  profileButtonText: {
    color: COLORS.text.light,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});