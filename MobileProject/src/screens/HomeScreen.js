import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Animated,
  Dimensions,
  Modal,
  TouchableWithoutFeedback,
  Alert,
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
import * as Paper from 'react-native-paper';
import BRAND_COLORS from '../styles/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_URL} from '../config';
import axios from 'axios';
import AppointmentCard from '../components/AppointmentCard';

const {width} = Dimensions.get('window');
const SIDEBAR_WIDTH = width * 0.75;

export default function HomeScreen({navigation, userName = 'Attendant'}) {
  const [menuVisible, setMenuVisible] = useState(false);
  const slideAnim = React.useRef(new Animated.Value(-SIDEBAR_WIDTH)).current;
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const [appointments, setAppointments] = useState({upcoming: [], ongoing: []});

  const toggleMenu = show => {
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

  const fetchAppointments = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        console.error('No auth token found');
        return;
      }

      const response = await axios.get(
        `${API_URL}/api/attendant/appointments/active`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const {upcomingAppointments = [], ongoingAppointments = []} =
        response.data;
      console.log(upcomingAppointments, ongoingAppointments);
      setAppointments({
        upcoming: upcomingAppointments,
        ongoing: ongoingAppointments,
      });
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchAppointments();
    });

    return unsubscribe;
  }, [navigation]);

  const handleStart = async appointmentId => {
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.post(
        `${API_URL}/api/attendant/appointments/start`,
        {appointmentId},
        {
          headers: {Authorization: `Bearer ${token}`},
        },
      );

      fetchAppointments(); // Refresh the appointments list
      Alert.alert('Success', 'Appointment started successfully');
    } catch (error) {
      console.error('Error starting appointment:', error);
      Alert.alert('Error', 'Failed to start appointment');
    }
  };

  const handleFinish = async appointmentId => {
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.post(
        `${API_URL}/api/attendant/appointments/finish`,
        {appointmentId},
        {
          headers: {Authorization: `Bearer ${token}`},
        },
      );

      fetchAppointments(); // Refresh the appointments list
      Alert.alert('Success', 'Appointment marked as finished');
    } catch (error) {
      console.error('Error finishing appointment:', error);
      Alert.alert('Error', 'Failed to finish appointment');
    }
  };

  const renderSidebar = () => (
    <Modal
      transparent
      visible={menuVisible}
      onRequestClose={() => toggleMenu(false)}
      animationType="none">
      <View style={styles.modalContainer}>
        <TouchableWithoutFeedback onPress={() => toggleMenu(false)}>
          <Animated.View style={[styles.modalOverlay, {opacity: fadeAnim}]} />
        </TouchableWithoutFeedback>

        <Animated.View
          style={[
            styles.sidebar,
            {
              transform: [{translateX: slideAnim}],
            },
          ]}>
          <View style={styles.sidebarHeader}>
            <View style={styles.userInfo}>
              <UserCircle size={50} color={BRAND_COLORS.primary} />
              <View style={styles.userTextContainer}>
                <Paper.Text style={styles.userName}>{userName}</Paper.Text>
                <Paper.Text style={styles.userRole}>
                  Healthcare Attendant
                </Paper.Text>
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
                  <Paper.Text style={styles.menuItemText}>
                    {item.title}
                  </Paper.Text>
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
            <Paper.Text style={styles.logoutText}>Logout</Paper.Text>
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
            <Paper.Text style={styles.welcomeText}>Welcome back,</Paper.Text>
            <Paper.Text style={styles.nameText}>{userName}</Paper.Text>
          </View>
          <TouchableOpacity onPress={() => toggleMenu(true)} style={styles.menuButton}>
            <Menu size={24} color={BRAND_COLORS.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* Appointments Section */}
        <View style={styles.section}>
          <Paper.Text style={styles.sectionTitle}>Upcoming Appointments</Paper.Text>
          {appointments.upcoming.length === 0 ? (
            <View style={styles.emptyStateContainer}>
              <Paper.Text style={styles.emptyStateText}>
                No upcoming appointments
              </Paper.Text>
              <Paper.Text style={styles.emptyStateSubText}>
                Your upcoming appointments will appear here
              </Paper.Text>
            </View>
          ) : (
            appointments.upcoming.map(appointment => (
              <AppointmentCard
                key={appointment._id}
                appointment={appointment}
                type="upcoming"
                onStart={handleStart}
              />
            ))
          )}

          <Paper.Text style={styles.sectionTitle}>Ongoing Appointments</Paper.Text>
          {appointments.ongoing.length === 0 ? (
            <View style={styles.emptyStateContainer}>
              <Paper.Text style={styles.emptyStateText}>
                No ongoing appointments
              </Paper.Text>
              <Paper.Text style={styles.emptyStateSubText}>
                Your active appointments will appear here
              </Paper.Text>
            </View>
          ) : (
            appointments.ongoing.map(appointment => (
              <AppointmentCard
                key={appointment._id}
                appointment={appointment}
                type="ongoing"
                onFinish={handleFinish}
              />
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
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  serviceType: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: BRAND_COLORS.textPrimary,
    marginBottom: 4,
  },
  appointmentId: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: BRAND_COLORS.textSecondary,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
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
    flex: 1,
  },
  durationContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: BRAND_COLORS.border,
  },
  durationText: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: BRAND_COLORS.textPrimary,
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
  // Sidebar styles
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'black',
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: SIDEBAR_WIDTH,
    height: '100%',
    backgroundColor: '#fff',
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
    fontFamily: 'Poppins-Bold',
    color: BRAND_COLORS.textPrimary,
  },
  userRole: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: BRAND_COLORS.textSecondary,
  },
  closeButton: {
    padding: 8,
  },
  menuItems: {
    flex: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: BRAND_COLORS.border,
  },
  menuItemText: {
    marginLeft: 16,
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: BRAND_COLORS.textPrimary,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: BRAND_COLORS.border,
  },
  logoutText: {
    marginLeft: 16,
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: BRAND_COLORS.textPrimary,
  },
  finishButton: {
    marginTop: 16,
    backgroundColor: BRAND_COLORS.success,
  },
  buttonLabel: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: '#fff',
  },
});