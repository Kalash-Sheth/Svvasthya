/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Settings, Clock, Edit2, LogOut, Phone, Mail} from 'lucide-react-native';
import {BRAND_COLORS} from '../styles/colors';

export default function ProfileScreen({navigation}) {
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

      const response = await fetch(
        'http://192.168.0.107:5000/api/attendant/profile',
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );

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

  const ActionButton = ({
    icon: Icon,
    title,
    onPress,
    color = BRAND_COLORS.primary,
  }) => {
    const [isPressed, setIsPressed] = useState(false);

    return (
      <TouchableOpacity
        style={[styles.actionButton, isPressed && styles.actionButtonPressed]}
        onPress={onPress}
        onPressIn={() => setIsPressed(true)}
        onPressOut={() => setIsPressed(false)}
        activeOpacity={0.7}>
        <View style={[styles.iconContainer, {backgroundColor: `${color}10`}]}>
          <Icon size={22} color={color} />
        </View>
        <View style={styles.buttonTextContainer}>
          <Text style={[styles.actionButtonText, {color}]}>{title}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={BRAND_COLORS.primary} />
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
              source={{uri: 'https://via.placeholder.com/150'}}
              style={styles.profileImage}
            />
            <TouchableOpacity style={styles.editImageButton}>
              <Edit2 size={20} color={BRAND_COLORS.textPrimary} />
            </TouchableOpacity>
          </View>

          <Text style={styles.profileName}>
            {profileData.firstName} {profileData.lastName}
          </Text>
          <Text style={styles.designation}>Healthcare Attendant</Text>
        </View>

        <View style={styles.infoSection}>
          <View style={styles.infoCard}>
            <Text style={styles.sectionTitle}>Personal Information</Text>
            <View style={styles.infoItem}>
              <View style={styles.infoRow}>
                <Phone size={20} color={BRAND_COLORS.textSecondary} />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Mobile</Text>
                  <Text style={styles.infoValue}>
                    {profileData.mobileNumber}
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.infoItem}>
              <View style={styles.infoRow}>
                <Mail size={20} color={BRAND_COLORS.textSecondary} />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Email</Text>
                  <Text style={styles.infoValue}>{profileData.email}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.actionsContainer}>
          <ActionButton
            icon={Edit2}
            title="Edit Profile"
            onPress={() => {}}
            color={BRAND_COLORS.primary}
          />
          <ActionButton
            icon={Clock}
            title="Work History"
            onPress={() => {}}
            color={BRAND_COLORS.secondary}
          />
          <ActionButton
            icon={Settings}
            title="Settings"
            onPress={() => {}}
            color={BRAND_COLORS.textPrimary}
          />
          <ActionButton
            icon={LogOut}
            title="Logout"
            onPress={async () => {
              await AsyncStorage.removeItem('token');
              navigation.navigate('Login');
            }}
            color={BRAND_COLORS.primary}
          />
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  errorText: {
    color: BRAND_COLORS.primary,
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: BRAND_COLORS.border,
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
    borderColor: BRAND_COLORS.primary,
  },
  editImageButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: BRAND_COLORS.background,
    padding: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: BRAND_COLORS.border,
  },
  profileName: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: BRAND_COLORS.textPrimary,
    marginBottom: 5,
    fontWeight: '900',
  },
  designation: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: BRAND_COLORS.textSecondary,
    marginBottom: 10,
  },
  infoSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: BRAND_COLORS.secondary,
    marginBottom: 20,
    fontWeight: '900',
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: BRAND_COLORS.border,
  },
  infoItem: {
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoContent: {
    marginLeft: 12,
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: BRAND_COLORS.textSecondary,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: BRAND_COLORS.textPrimary,
  },
  actionsContainer: {
    padding: 20,
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: BRAND_COLORS.border,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  actionButtonPressed: {
    transform: [{scale: 0.98}],
    backgroundColor: BRAND_COLORS.background,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  actionButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
  },
  arrowContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowIcon: {
    fontSize: 24,
    fontWeight: '600',
    opacity: 0.5,
  },
});
