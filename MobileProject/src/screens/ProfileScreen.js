/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Image,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import * as Paper from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Settings,
  Edit2,
  Phone,
  Mail,
  Star,
  Calendar,
  FileText,
  DollarSign,
  Award,
  CheckCircle,
} from 'lucide-react-native';
import BRAND_COLORS from '../styles/colors';
import {API_URL} from '../config';

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

      const response = await fetch(`${API_URL}/api/attendant/profile`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      console.log('Profile Data:', data);

      if (response.ok) {
        setProfileData(data);
      } else {
        Alert.alert('Error', data.message || 'Failed to fetch profile');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      Alert.alert('Error', 'Something went wrong. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  const StatCard = ({icon: Icon, title, value, color}) => (
    <View style={styles.statCard}>
      <View
        style={[
          styles.iconContainer,
          {backgroundColor: color ? `${color}10` : '#F3F4F6'},
        ]}>
        <Icon size={22} color={color || BRAND_COLORS.textSecondary} />
      </View>
      <Paper.Text style={styles.statValue}>{value || '0'}</Paper.Text>
      <Paper.Text style={styles.statTitle}>{title}</Paper.Text>
    </View>
  );

  const handleViewDocuments = () => {
    if (!profileData.documents) {
      Alert.alert('Error', 'No documents available');
      return;
    }

    const formattedDocuments = profileData.documents.map(category => ({
      type: category.type,
      items: category.items.map(doc => ({
        name: doc.name,
        url: `${API_URL}/${doc.url}`,
        uploadDate: doc.uploadDate,
      })),
    }));

    navigation.navigate('Documents', {
      documents: formattedDocuments,
      totalDocuments: profileData.quickActions?.totalDocuments || 0,
    });
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
        <Paper.Text style={styles.errorText}>
          No profile data available.
        </Paper.Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.profileImageContainer}>
            <Image
              source={
                // uri: profileData.profilePhoto
                // ? `${API_URL}/${profileData.profilePhoto}`
                // :
                'https://via.placeholder.com/150'
              }
              style={styles.profileImage}
            />
            <TouchableOpacity style={styles.editImageButton}>
              <Edit2 size={20} color={BRAND_COLORS.textPrimary} />
            </TouchableOpacity>
          </View>

          <Paper.Text style={styles.profileName}>
            {profileData.firstName} {profileData.lastName}
          </Paper.Text>
          <Paper.Text style={styles.designation}>
            {profileData.role} - {profileData.specialization}
          </Paper.Text>
          <View style={styles.ratingContainer}>
            <Star
              size={16}
              color={BRAND_COLORS.warning}
              fill={BRAND_COLORS.warning}
            />
            <Paper.Text style={styles.ratingText}>
              {profileData.rating}/5
            </Paper.Text>
          </View>
        </View>

        {/* Stats Section */}
        <View style={styles.statsContainer}>
          <StatCard
            icon={CheckCircle}
            title="Missions"
            value={profileData.totalMissions}
            color={BRAND_COLORS.success}
          />
          <StatCard
            icon={DollarSign}
            title="Earnings"
            value={`₹${profileData.quickActions?.totalEarnings || 0}`}
            color={BRAND_COLORS.primary}
          />
          <StatCard
            icon={Award}
            title="Level"
            value={profileData.level}
            color={BRAND_COLORS.warning}
          />
        </View>

        {/* Basic Info Section */}
        <View style={styles.section}>
          <Paper.Text style={styles.sectionTitle}>Basic Information</Paper.Text>
          <View style={styles.infoCard}>
            <View style={styles.infoItem}>
              <Phone size={20} color={BRAND_COLORS.textSecondary} />
              <View style={styles.infoContent}>
                <Paper.Text style={styles.infoLabel}>Mobile</Paper.Text>
                <Paper.Text style={styles.infoValue}>
                  {profileData.mobileNumber}
                </Paper.Text>
              </View>
            </View>
            <View style={styles.infoItem}>
              <Mail size={20} color={BRAND_COLORS.textSecondary} />
              <View style={styles.infoContent}>
                <Paper.Text style={styles.infoLabel}>Email</Paper.Text>
                <Paper.Text style={styles.infoValue}>
                  {profileData.email}
                </Paper.Text>
              </View>
            </View>
            <View style={styles.infoItem}>
              <Calendar size={20} color={BRAND_COLORS.textSecondary} />
              <View style={styles.infoContent}>
                <Paper.Text style={styles.infoLabel}>Active Since</Paper.Text>
                <Paper.Text style={styles.infoValue}>
                  {new Date(profileData.createdAt).toLocaleDateString()}
                </Paper.Text>
              </View>
            </View>
          </View>
        </View>

        {/* Actions Section */}
        <View style={styles.section}>
          <Paper.Text style={styles.sectionTitle}>Quick Actions</Paper.Text>
          <View style={styles.actionsContainer}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleViewDocuments}>
              <FileText size={24} color={BRAND_COLORS.primary} />
              <Paper.Text style={styles.actionCount}>
                {profileData.quickActions?.totalDocuments || 0}
              </Paper.Text>
              <Paper.Text style={styles.actionText}>Documents</Paper.Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate('Earnings')}>
              <DollarSign size={24} color={BRAND_COLORS.primary} />
              <Paper.Text style={styles.actionAmount}>
                ₹{profileData.quickActions?.totalEarnings || 0}
              </Paper.Text>
              <Paper.Text style={styles.actionText}>Earnings</Paper.Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate('Settings')}>
              <Settings size={24} color={BRAND_COLORS.textPrimary} />
              <Paper.Text style={styles.actionUpdate}></Paper.Text>
              <Paper.Text style={styles.actionText}>Settings</Paper.Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Logout Button */}
        <Paper.Button
          mode="contained"
          onPress={async () => {
            await AsyncStorage.removeItem('token');
            navigation.navigate('Login');
          }}
          style={styles.logoutButton}
          contentStyle={styles.logoutButtonContent}
          labelStyle={styles.logoutButtonText}>
          Logout
        </Paper.Button>
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
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: BRAND_COLORS.border,
    elevation: 2,
  },
  profileName: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: BRAND_COLORS.textPrimary,
    marginBottom: 5,
  },
  designation: {
    fontSize: 18,
    fontFamily: 'Poppins-Medium',
    color: BRAND_COLORS.textSecondary,
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: BRAND_COLORS.warning + '10',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: BRAND_COLORS.warning,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: 15,
    marginHorizontal: 5,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BRAND_COLORS.border,
    elevation: 2,
  },
  statValue: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: BRAND_COLORS.textPrimary,
    marginVertical: 4,
  },
  statTitle: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: BRAND_COLORS.textSecondary,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: BRAND_COLORS.textPrimary,
    marginBottom: 15,
    fontWeight: '800',
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: BRAND_COLORS.border,
    elevation: 2,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  infoContent: {
    marginLeft: 12,
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: BRAND_COLORS.textSecondary,
  },
  infoValue: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: BRAND_COLORS.textPrimary,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    padding: 15,
    marginHorizontal: 5,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BRAND_COLORS.border,
    elevation: 2,
  },
  actionText: {
    marginTop: 8,
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
    color: BRAND_COLORS.textPrimary,
  },
  logoutButton: {
    margin: 20,
    marginBottom: 30,
    backgroundColor: `${BRAND_COLORS.primary}10`,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: BRAND_COLORS.primary,
    elevation: 0,
    shadowColor: 'transparent',
  },
  logoutButtonContent: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutButtonText: {
    color: BRAND_COLORS.primary,
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    fontWeight: '700',
    letterSpacing: 1,
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
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: `${BRAND_COLORS.primary}10`,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  skillChip: {
    margin: 4,
    backgroundColor: `${BRAND_COLORS.primary}10`,
  },
  skillChipText: {
    color: BRAND_COLORS.primary,
  },
  languageChip: {
    margin: 4,
    backgroundColor: `${BRAND_COLORS.secondary}10`,
  },
  languageChipText: {
    color: BRAND_COLORS.secondary,
  },
  dayChip: {
    margin: 4,
    backgroundColor: `${BRAND_COLORS.primary}10`,
  },
  dayChipText: {
    color: BRAND_COLORS.primary,
  },
  shiftChip: {
    margin: 4,
    backgroundColor: `${BRAND_COLORS.secondary}10`,
  },
  shiftChipText: {
    color: BRAND_COLORS.secondary,
  },
  divider: {
    height: 1,
    backgroundColor: BRAND_COLORS.border,
    marginVertical: 15,
  },
  subTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    color: BRAND_COLORS.textPrimary,
    marginBottom: 8,
    fontWeight: '700',
  },
  marginTop: {
    marginTop: 15,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: BRAND_COLORS.textSecondary,
    fontStyle: 'italic',
    textAlign: 'center',
    width: '100%',
    marginVertical: 10,
  },
  actionCount: {
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
    color: BRAND_COLORS.secondary,
    marginTop: 4,
  },
  actionAmount: {
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
    color: BRAND_COLORS.secondary,
    marginTop: 4,
  },
  actionUpdate: {
    fontSize: 10,
    fontFamily: 'Poppins-Regular',
    color: BRAND_COLORS.textSecondary,
    marginTop: 4,
  },
  workTypeContainer: {
    marginBottom: 15,
  },
  workTypeChip: {
    marginTop: 8,
    backgroundColor: `${BRAND_COLORS.primary}10`,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  workTypeChipText: {
    color: BRAND_COLORS.primary,
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
  },
});
