import React, {useState} from 'react';
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
import {BRAND_COLORS} from '../styles/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';

const {width} = Dimensions.get('window');
const SIDEBAR_WIDTH = width * 0.75;

export default function HomeScreen({navigation, userName = 'Attendant'}) {
  const [menuVisible, setMenuVisible] = useState(false);
  const slideAnim = React.useRef(new Animated.Value(-SIDEBAR_WIDTH)).current;
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

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
          <TouchableOpacity
            onPress={() => toggleMenu(true)}
            style={styles.menuButton}>
            <Menu size={24} color={BRAND_COLORS.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* Quick Actions Menu */}
        {/* <View style={styles.menuGrid}>
          {menuItems.map(item => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuCard}
              onPress={() => navigation.navigate(item.id)}>
              <item.icon size={24} color={BRAND_COLORS.primary} />
              <Text style={styles.menuItemText}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View> */}

        {/* Upcoming Appointments Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upcoming Appointments</Text>
          {upcomingAppointments.map(appointment => (
            <View key={appointment.id} style={styles.appointmentCard}>
              <View style={styles.appointmentHeader}>
                <Text style={styles.patientName}>
                  {appointment.patientName}
                </Text>
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
          ))}
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
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 15,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  menuCard: {
    width: '48%',
    backgroundColor: BRAND_COLORS.background,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: BRAND_COLORS.border,
    minHeight: 100,
  },
  menuItemText: {
    marginLeft: 15,
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: BRAND_COLORS.textPrimary,
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
    alignItems: 'center',
    marginBottom: 16,
  },
  patientName: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: BRAND_COLORS.textPrimary,
  },
  serviceType: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: BRAND_COLORS.primary,
    backgroundColor: `${BRAND_COLORS.primary}10`,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  appointmentDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 2,
  },
  detailText: {
    marginLeft: 8,
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: BRAND_COLORS.textSecondary,
  },
  modalContainer: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: '#000',
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: SIDEBAR_WIDTH,
    height: '100%',
    backgroundColor: '#fff',
    paddingTop: 60,
    paddingHorizontal: 25,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sidebarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 30,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: BRAND_COLORS.border,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userTextContainer: {
    marginLeft: 12,
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
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: BRAND_COLORS.border,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 25,
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: BRAND_COLORS.border,
  },
  logoutText: {
    marginLeft: 15,
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: BRAND_COLORS.primary,
  },
});
