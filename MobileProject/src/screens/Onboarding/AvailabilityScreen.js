import React, {useState} from 'react';
import {View, StyleSheet, ScrollView, Alert} from 'react-native';
import * as Paper from 'react-native-paper';
import FormInput from '../../components/FormInput';
import ProgressBar from '../../components/ProgressBar';
import BRAND_COLORS from '../../styles/colors';
import axios from 'axios';
import {API_URL} from '../../config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const shifts = ['Morning', 'Afternoon', 'Night'];
const days = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

export default function AvailabilityScreen({navigation}) {
  const [availability, setAvailability] = useState('Full Time');
  const [isWillingToTravel, setIsWillingToTravel] = useState(false);
  const [selectedShifts, setSelectedShifts] = useState([]);
  const [selectedDays, setSelectedDays] = useState([]);
  const [locationPreference, setLocationPreference] = useState('');

  const handleShiftSelect = shift => {
    if (selectedShifts.includes(shift)) {
      setSelectedShifts(prev => prev.filter(s => s !== shift));
    } else {
      setSelectedShifts(prev => [...prev, shift]);
    }
  };

  const handleDaySelect = day => {
    if (selectedDays.includes(day)) {
      setSelectedDays(prev => prev.filter(d => d !== day));
    } else {
      setSelectedDays(prev => [...prev, day]);
    }
  };

  const handleNext = async () => {
    try {
      // Validate required fields
      if (selectedDays.length === 0) {
        Alert.alert('Error', 'Please select at least one working day');
        return;
      }

      if (selectedShifts.length === 0) {
        Alert.alert('Error', 'Please select at least one shift preference');
        return;
      }

      if (!locationPreference) {
        Alert.alert('Error', 'Please enter your location preferences');
        return;
      }

      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        Alert.alert('Error', 'Authentication token not found');
        return;
      }

      const response = await axios.post(
        `${API_URL}/api/attendant/onboarding/work-preferences`,
        {
          workType: availability,
          preferredDays: selectedDays,
          shiftPreferences: selectedShifts,
          locationPreferences: locationPreference,
          willingToTravel: isWillingToTravel,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      if (response.data.success) {
        navigation.navigate('MedicalInfo');
      } else {
        Alert.alert(
          'Error',
          response.data.message || 'Failed to save preferences',
        );
      }
    } catch (error) {
      console.error('Error saving preferences:', error);
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to save availability preferences',
      );
    }
  };

  return (
    <ScrollView style={styles.container}>
      <ProgressBar step={5} totalSteps={8} />
      <Paper.Text style={styles.headerText}>Availability Preferences</Paper.Text>

      <View style={styles.section}>
        <Paper.Text style={styles.sectionTitle}>Work Type</Paper.Text>
        <View style={styles.chipContainer}>
          <Paper.Chip
            onPress={() => setAvailability('Full Time')}
            selected={availability === 'Full Time'}
            style={[
              styles.chip,
              availability === 'Full Time' && styles.selectedChip,
            ]}
            textStyle={[
              styles.chipText,
              availability === 'Full Time' && styles.selectedChipText,
            ]}>
            Full Time
          </Paper.Chip>
          <Paper.Chip
            onPress={() => setAvailability('Part Time')}
            selected={availability === 'Part Time'}
            style={[
              styles.chip,
              availability === 'Part Time' && styles.selectedChip,
            ]}
            textStyle={[
              styles.chipText,
              availability === 'Part Time' && styles.selectedChipText,
            ]}>
            Part Time
          </Paper.Chip>
        </View>
      </View>

      <View style={styles.section}>
        <Paper.Text style={styles.sectionTitle}>Preferred Days</Paper.Text>
        <Paper.Text style={styles.sectionSubtitle}>
          Select your available days
        </Paper.Text>
        <View style={styles.chipContainer}>
          {days.map(day => (
            <Paper.Chip
              key={day}
              onPress={() => handleDaySelect(day)}
              selected={selectedDays.includes(day)}
              style={[
                styles.chip,
                selectedDays.includes(day) && styles.selectedChip,
              ]}
              textStyle={[
                styles.chipText,
                selectedDays.includes(day) && styles.selectedChipText,
              ]}>
              {day}
            </Paper.Chip>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Paper.Text style={styles.sectionTitle}>Shift Preferences</Paper.Text>
        <Paper.Text style={styles.sectionSubtitle}>
          Select your preferred shifts
        </Paper.Text>
        <View style={styles.chipContainer}>
          {shifts.map(shift => (
            <Paper.Chip
              key={shift}
              onPress={() => handleShiftSelect(shift)}
              selected={selectedShifts.includes(shift)}
              style={[
                styles.chip,
                selectedShifts.includes(shift) && styles.selectedChip,
              ]}
              textStyle={[
                styles.chipText,
                selectedShifts.includes(shift) && styles.selectedChipText,
              ]}>
              {shift}
            </Paper.Chip>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Paper.Text style={styles.sectionTitle}>Location Preferences</Paper.Text>
        <Paper.Text style={styles.sectionSubtitle}>
          Specify your preferred work areas
        </Paper.Text>
        <FormInput
          label="Preferred Locations"
          value={locationPreference}
          onChangeText={setLocationPreference}
          icon="map-pin"
          placeholder="e.g., South Delhi, Noida"
        />
        <View style={styles.switchContainer}>
          <Paper.Text style={styles.switchLabel}>Willing to Travel?</Paper.Text>
          <Paper.Switch
            value={isWillingToTravel}
            onValueChange={setIsWillingToTravel}
            color={BRAND_COLORS.primary}
          />
        </View>
      </View>

      <Paper.Button
        mode="contained"
        onPress={handleNext}
        style={styles.button}
        contentStyle={styles.buttonContent}
        labelStyle={styles.buttonText}>
        Continue
      </Paper.Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  headerText: {
    fontSize: 28,
    fontFamily: 'Poppins-Bold',
    fontWeight: '900',
    color: BRAND_COLORS.textPrimary,
    marginBottom: 25,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 2,
  },
  section: {
    marginBottom: 25,
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    paddingTop: 25,
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
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    fontWeight: '900',
    color: BRAND_COLORS.secondary,
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: BRAND_COLORS.textSecondary,
    marginBottom: 20,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
  },
  chip: {
    backgroundColor: BRAND_COLORS.background,
  },
  selectedChip: {
    backgroundColor: `${BRAND_COLORS.primary}20`,
  },
  chipText: {
    color: BRAND_COLORS.textSecondary,
    fontFamily: 'Poppins-Regular',
  },
  selectedChipText: {
    color: BRAND_COLORS.primary,
    fontFamily: 'Poppins-Medium',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: BRAND_COLORS.border,
  },
  switchLabel: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: BRAND_COLORS.textPrimary,
  },
  button: {
    marginVertical: 25,
    backgroundColor: BRAND_COLORS.primary,
    borderRadius: 30,
    elevation: 8,
    shadowColor: BRAND_COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    marginHorizontal: 20,
  },
  buttonContent: {
    height: 56,
  },
  buttonText: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: 'white',
    letterSpacing: 1,
  },
});
