import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  ActivityIndicator, 
  Alert,
  TouchableOpacity,
  SafeAreaView,
  ScrollView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Settings, Clock, Edit2, LogOut } from 'lucide-react-native';

// Brand Colors
const COLORS = {
  primary: '#FF6B35',    // Orange from logo
  secondary: '#4CAF50',  // Green from logo
  darkBlue: '#1E3A8A',  // Dark blue from logo
  accent: '#FF9F1C',     // Warm accent
  background: '#FFF9F5', // Warm light background
  cardBg: '#FFFFFF',
  error: '#FF3B30',
  text: {
    primary: '#333333',
    secondary: '#666666',
    light: '#FFFFFF'
  },
  border: '#E5E5E5'
};

export default function ProfileScreen({ navigation }) {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfileData = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Session Expired', 'Please login again to continue.');
        navigation.navigate('Login');
        return;
      }

      const response = await fetch('http://192.168.1.18:5000/api/attendant/profile', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
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

  const ActionButton = ({ icon: Icon, title, onPress, color = COLORS.primary }) => (
    <TouchableOpacity 
      style={[styles.actionButton, { borderColor: color }]} 
      onPress={onPress}
    >
      <Icon size={20} color={color} />
      <Text style={[styles.actionButtonText, { color }]}>{title}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (!profileData) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No profile data available.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.profileImageContainer}>
            <Image
              source={{ uri: 'https://via.placeholder.com/150' }}
              style={styles.profileImage}
            />
            <TouchableOpacity style={styles.editImageButton}>
              <Edit2 size={20} color={COLORS.text.light} />
            </TouchableOpacity>
          </View>

          <Text style={styles.profileName}>
            {profileData.firstName} {profileData.lastName}
          </Text>
          <Text style={styles.designation}>Healthcare Attendant</Text>
        </View>

        <View style={styles.infoSection}>
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Personal Information</Text>
            <View style={styles.infoItem}>
              <Text style={styles.infoTitle}>Mobile</Text>
              <Text style={styles.infoValue}>{profileData.mobileNumber}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoTitle}>Email</Text>
              <Text style={styles.infoValue}>{profileData.email}</Text>
            </View>
          </View>
        </View>

        <View style={styles.actionsContainer}>
          <ActionButton 
            icon={Edit2} 
            title="Edit Profile" 
            onPress={() => {}} 
          />
          <ActionButton 
            icon={Clock} 
            title="Work History" 
            onPress={() => {}}
            color={COLORS.secondary}
          />
          <ActionButton 
            icon={Settings} 
            title="Settings" 
            onPress={() => {}}
            color={COLORS.accent}
          />
          <ActionButton 
            icon={LogOut} 
            title="Logout" 
            onPress={async () => {
              await AsyncStorage.removeItem('token');
              navigation.navigate('Login');
            }}
            color={COLORS.error}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 16,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    backgroundColor: COLORS.cardBg,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: COLORS.primary,
  },
  editImageButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.primary,
    padding: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text.primary,
    marginBottom: 5,
  },
  designation: {
    fontSize: 16,
    color: COLORS.text.secondary,
    marginBottom: 10,
  },
  infoSection: {
    padding: 20,
  },
  infoCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  infoLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: 15,
  },
  infoItem: {
    marginBottom: 15,
  },
  infoTitle: {
    fontSize: 14,
    color: COLORS.text.secondary,
    marginBottom: 5,
  },
  infoValue: {
    fontSize: 16,
    color: COLORS.text.primary,
  },
  actionsContainer: {
    padding: 20,
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 12,
    backgroundColor: COLORS.cardBg,
    borderWidth: 1,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2.84,
    elevation: 2,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
});