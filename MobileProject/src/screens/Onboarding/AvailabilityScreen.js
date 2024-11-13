import React, {useState} from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import {Button, Switch, Text, Chip} from 'react-native-paper';
import FormInput from '../../components/FormInput';
import ProgressBar from '../../components/ProgressBar';
import { BRAND_COLORS } from '../../styles/colors';
import axios from 'axios';
import { API_URL } from '../../config/api';
import { Alert } from 'react-native';

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
  const [availability, setAvailability] = useState('fulltime');
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
      const response = await axios.post(
        `${API_URL}/api/attendant/onboarding/work-preferences/${attendantId}`,
        {
          workType: availability,
          preferredDays: selectedDays,
          shiftPreferences: selectedShifts,
          locationPreferences: locationPreference
        }
      );

      if (response.data.success) {
        navigation.navigate('MedicalInfo');
      } else {
        Alert.alert('Error', response.data.message || 'Failed to save preferences');
      }
    } catch (error) {
      console.error('Error saving preferences:', error);
      Alert.alert('Error', 'Failed to save availability preferences');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <ProgressBar step={5} totalSteps={8} />
      <Text style={styles.headerText}>Availability Preferences</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Work Type</Text>
        <View style={styles.chipContainer}>
          <Chip
            onPress={() => setAvailability('fulltime')}
            style={[
              styles.chip,
              availability === 'fulltime' && styles.selectedChip,
            ]}
            textStyle={[
              styles.chipText,
              availability === 'fulltime' && styles.selectedChipText,
            ]}>
            Full Time
          </Chip>
          <Chip
            onPress={() => setAvailability('parttime')}
            style={[
              styles.chip,
              availability === 'parttime' && styles.selectedChip,
            ]}
            textStyle={[
              styles.chipText,
              availability === 'parttime' && styles.selectedChipText,
            ]}>
            Part Time
          </Chip>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferred Days</Text>
        <Text style={styles.sectionSubtitle}>Select your available days</Text>
        <View style={styles.chipContainer}>
          {days.map(day => (
            <Chip
              key={day}
              onPress={() => handleDaySelect(day)}
              style={[
                styles.chip,
                selectedDays.includes(day) && styles.selectedChip,
              ]}
              textStyle={[
                styles.chipText,
                selectedDays.includes(day) && styles.selectedChipText,
              ]}>
              {day}
            </Chip>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Shift Preferences</Text>
        <Text style={styles.sectionSubtitle}>Select your preferred shifts</Text>
        <View style={styles.chipContainer}>
          {shifts.map(shift => (
            <Chip
              key={shift}
              onPress={() => handleShiftSelect(shift)}
              style={[
                styles.chip,
                selectedShifts.includes(shift) && styles.selectedChip,
              ]}
              textStyle={[
                styles.chipText,
                selectedShifts.includes(shift) && styles.selectedChipText,
              ]}>
              {shift}
            </Chip>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Location Preferences</Text>
        <Text style={styles.sectionSubtitle}>
          Specify your preferred work areas
        </Text>
        <FormInput
          label="Preferred Locations"
          value={locationPreference}
          onChangeText={setLocationPreference}
          icon="map-pin"
          placeholder="e.g., South Delhi, Noida"
        />
        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>Willing to Travel?</Text>
          <Switch
            value={isWillingToTravel}
            onValueChange={setIsWillingToTravel}
            color={BRAND_COLORS.primary}
          />
        </View>
      </View>

      <Button
        mode="contained"
        onPress={handleNext}
        style={styles.button}
        contentStyle={styles.buttonContent}
        labelStyle={styles.buttonText}>
        Continue
      </Button>
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
