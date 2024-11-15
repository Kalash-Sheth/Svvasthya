import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Animated,
  Dimensions,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import {
  UserCircle,
  Calendar,
  Clock,
  DollarSign,
  Menu,
  MapPin,
  Activity,
  LogOut,
  X,
} from 'lucide-react-native';
import BRAND_COLORS from '../styles/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../config';
import axios from 'axios';

const { width } = Dimensions.get('window');
const SIDEBAR_WIDTH = width * 0.75;

export default function HomeScreen({ navigation, userName = 'Attendant' }) {
  const [menuVisible, setMenuVisible] = useState(false);
  const slideAnim = React.useRef(new Animated.Value(-SIDEBAR_WIDTH)).current;
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const [appointments, setAppointments] = useState({ upcoming: [], ongoing: [] });

  const toggleMenu = (show) => {
    if (show) {
      slideAnim.setValue(-SIDEBAR_WIDTH);
      fadeAnim.setValue(0);
    }

    setMenuVisible(show);
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: show ? 0 : -SIDEBAR_WIDTH,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: show ? 0.5 : 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (!show) {
        setMenuVisible(false);
      }
    });
  };

  const menuItems = [
    {
      id: 'UpdateAvailability',
      title: 'Update Availability',
      icon: Calendar,
      screen: 'UpdateAvailability',
    },
    {
      id: 'RealTimeModel',
      title: 'Real-Time Model',
      icon: Activity,
      screen: 'RealTimeModel',
    },
    {
      id: 'UpcomingTasks',
      title: 'Upcoming Tasks',
      icon: Clock,
      screen: 'UpcomingTasks',
    },
    {
      id: 'Earnings',
      title: 'Total Earnings',
      icon: DollarSign,
      screen: 'Earnings',
    },
    {
      id: 'Profile',
      title: 'Profile',
      icon: UserCircle,
      screen: 'Profile',
    },
  ];

  // Fetch assigned appointments for the logged-in attendant
  const fetchAppointments = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/attendant/assignedAppointments`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data);
      const { upcomingAppointments = [], ongoingAppointments = [] } = response.data;

      setAppointments({
        upcoming: upcomingAppointments,
        ongoing: ongoingAppointments,
      });
    } catch (error) {
      console.error('Error fetching appointments', error);
    }
  };

  // Call fetchAppointments on component mount
  useEffect(() => {
    fetchAppointments();
  }, []);

  const renderSidebar = () => (
    <Modal
      transparent
      visible={menuVisible}
      onRequestClose={() => toggleMenu(false)}
      animationType="none">
      <View style={styles.modalContainer}>
        <TouchableWithoutFeedback onPress={() => toggleMenu(false)}>
          <Animated.View style={[styles.modalOverlay, { opacity: fadeAnim }]} />
        </TouchableWithoutFeedback>

        <Animated.View
          style={[
            styles.sidebar,
            {
              transform: [{ translateX: slideAnim }],
            },
          ]}>
          <View style={styles.sidebarHeader}>
            <View style={styles.userInfo}>
              <UserCircle size={50} color={BRAND_COLORS.primary} />
              <View style={styles.userTextContainer}>
                <Text style={styles.userName}>{userName}</Text>
                <Text style={styles.userRole}>Healthcare Attendant</Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => toggleMenu(false)}
              style={styles.closeButton}>
              <X size={24} color={BRAND_COLORS.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.menuItems}>
            {menuItems.map(item => {
              const Icon = item.icon;
              return (
                <TouchableOpacity
                  key={item.id}
                  style={styles.menuItem}
                  onPress={() => {
                    toggleMenu(false);
                    navigation.navigate(item.screen);
                  }}>
                  <Icon size={24} color={BRAND_COLORS.textPrimary} />
                  <Text style={styles.menuItemText}>{item.title}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <TouchableOpacity
            style={styles.logoutButton}
            onPress={async () => {
              await AsyncStorage.removeItem('token');
              navigation.navigate('Login');
              toggleMenu(false);
            }}>
            <LogOut size={24} color={BRAND_COLORS.primary} />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      {renderSidebar()}
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeText}>Welcome back,</Text>
            <Text style={styles.nameText}>{userName}</Text>
          </View>
          <TouchableOpacity onPress={() => toggleMenu(true)} style={styles.menuButton}>
            <Menu size={24} color={BRAND_COLORS.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* Upcoming and Ongoing Appointments Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upcoming Appointments</Text>
          {appointments.upcoming.length < 1 ? (
            <Text style={styles.noAppointmentsText}>No upcoming appointments</Text>
          ) : (
            appointments.upcoming.map((appointment) => (
              <View key={appointment.id} style={styles.appointmentCard}>
                <View style={styles.appointmentHeader}>
                  <Text style={styles.patientName}>{appointment.patientName}</Text>
                  <Text style={styles.serviceType}>{appointment.service}</Text>
                </View>

                <View style={styles.appointmentDetail}>
                  <Calendar size={16} color={BRAND_COLORS.textSecondary} />
                  <Text style={styles.detailText}>{appointment.date}</Text>
                </View>

                <View style={styles.appointmentDetail}>
                  <Clock size={16} color={BRAND_COLORS.textSecondary} />
                  <Text style={styles.detailText}>{appointment.time}</Text>
                </View>

                <View style={styles.appointmentDetail}>
                  <MapPin size={16} color={BRAND_COLORS.textSecondary} />
                  <Text style={styles.detailText}>{appointment.address}</Text>
                </View>
              </View>
            ))
          )}

          <Text style={styles.sectionTitle}>Ongoing Appointments</Text>
          {appointments.ongoing.length < 1 ? (
            <Text style={styles.noAppointmentsText}>No ongoing appointments</Text>
          ) : (
            appointments.ongoing.map((appointment) => (
              <View key={appointment.id} style={styles.appointmentCard}>
                <View style={styles.appointmentHeader}>
                  <Text style={styles.patientName}>{appointment.patientName}</Text>
                  <Text style={styles.serviceType}>{appointment.service}</Text>
                </View>

                <View style={styles.appointmentDetail}>
                  <Calendar size={16} color={BRAND_COLORS.textSecondary} />
                  <Text style={styles.detailText}>{appointment.date}</Text>
                </View>

                <View style={styles.appointmentDetail}>
                  <Clock size={16} color={BRAND_COLORS.textSecondary} />
                  <Text style={styles.detailText}>{appointment.time}</Text>
                </View>

                <View style={styles.appointmentDetail}>
                  <MapPin size={16} color={BRAND_COLORS.textSecondary} />
                  <Text style={styles.detailText}>{appointment.address}</Text>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 40,
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 16,
    color: BRAND_COLORS.textSecondary,
    fontFamily: 'Poppins-Regular',
  },
  nameText: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: BRAND_COLORS.textPrimary,
    fontWeight: '900',
  },
  menuButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: BRAND_COLORS.background,
  },
  section: {
    padding: 20,
    paddingTop: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: BRAND_COLORS.textPrimary,
    marginBottom: 20,
    fontWeight: '900',
  },
  appointmentCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: BRAND_COLORS.border,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  patientName: {
    fontSize: 18,
    color: BRAND_COLORS.textPrimary,
    fontWeight: '600',
  },
  serviceType: {
    fontSize: 16,
    color: BRAND_COLORS.textSecondary,
    fontWeight: '500',
  },
  appointmentDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  detailText: {
    marginLeft: 10,
    fontSize: 14,
    color: BRAND_COLORS.textSecondary,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  menuItemText: {
    marginLeft: 16,
    fontSize: 16,
    color: BRAND_COLORS.textPrimary,
    fontFamily: 'Poppins-Regular',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: BRAND_COLORS.border,
    marginTop: 'auto',
  },
  logoutText: {
    fontSize: 16,
    color: BRAND_COLORS.textPrimary,
    marginLeft: 12,
  },
  sidebar: {
    width: SIDEBAR_WIDTH,
    height: '100%',
    backgroundColor: '#fff',
    position: 'absolute',
    top: 0,
    left: 0,
    borderRightWidth: 1,
    borderRightColor: BRAND_COLORS.border,
  },
  sidebarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: BRAND_COLORS.border,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userTextContainer: {
    marginLeft: 10,
  },
  userName: {
    fontSize: 18,
    color: BRAND_COLORS.textPrimary,
    fontWeight: '700',
  },
  userRole: {
    fontSize: 14,
    color: BRAND_COLORS.textSecondary,
  },
  closeButton: {
    padding: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalOverlay: {
    flex: 1,
  },
});
