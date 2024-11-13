import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, Platform, StyleSheet, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import FormInput from '../../components/FormInput';
import { BRAND_COLORS } from '../../styles/colors';
import { Calendar } from 'lucide-react-native';

const PersonalInfoScreen = ({ navigation }) => {
  const [profileImage, setProfileImage] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dob, setDob] = useState(new Date());
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [houseNumber, setHouseNumber] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [gender, setGender] = useState('');

  const [showDatePicker, setShowDatePicker] = useState(false);

  const onChangeDob = (event, selectedDate) => {
    const currentDate = selectedDate || dob;
    setShowDatePicker(Platform.OS === 'ios');
    
    // Calculate age
    const today = new Date();
    const age = today.getFullYear() - currentDate.getFullYear();
    const m = today.getMonth() - currentDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < currentDate.getDate())) {
      age--;
    }

    // Validate age (must be 18 or older)
    if (age < 18) {
      Alert.alert('Invalid Date', 'You must be at least 18 years old.');
      return;
    }

    setDob(currentDate);
  };

  const renderDateInput = () => (
    <View style={styles.dateInputContainer}>
      <Text style={styles.label}>Date of Birth</Text>
      <TouchableOpacity
        style={styles.datePickerButton}
        onPress={() => setShowDatePicker(true)}>
        <View style={styles.datePickerContent}>
          <Calendar size={20} color={BRAND_COLORS.textSecondary} />
          <Text style={styles.dateText}>
            {dob.toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </Text>
        </View>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={dob}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onChangeDob}
          maximumDate={new Date(Date.now() - 18 * 365 * 24 * 60 * 60 * 1000)} // 18 years ago
          minimumDate={new Date(1900, 0, 1)}
        />
      )}
    </View>
  );

  const onSubmit = data => {
    // Check for required fields
    const requiredFields = [];

    if (!profileImage) {
      requiredFields.push('Profile Photo');
    }
    if (!data.firstName) {
      requiredFields.push('First Name');
    }
    if (!data.lastName) {
      requiredFields.push('Last Name');
    }
    if (!data.dob) {
      requiredFields.push('Date of Birth');
    }
    if (!data.mobile) {
      requiredFields.push('Mobile Number');
    }
    if (!data.email) {
      requiredFields.push('Email');
    }
    if (!data.houseNumber) {
      requiredFields.push('House Number');
    }
    if (!data.street) {
      requiredFields.push('Street');
    }
    if (!data.city) {
      requiredFields.push('City');
    }
    if (!data.state) {
      requiredFields.push('State');
    }
    if (!data.zipCode) {
      requiredFields.push('ZIP Code');
    }
    if (!gender) {
      requiredFields.push('Gender');
    }

    if (requiredFields.length > 0) {
      Alert.alert(
        'Required Fields',
        `Please fill in the following fields to continue:\n\n${requiredFields.join('\n')}`,
        [
          {
            text: 'OK',
            style: 'default',
          },
        ],
      );
      return;
    }

    // If all required fields are filled, proceed with form submission
    console.log({...data, profileImage, gender});
    navigation.navigate('Document');
  };

  return (
    <View>
      {/* Add your form elements here */}
      {renderDateInput()}
    </View>
  );
};

const styles = StyleSheet.create({
  dateInputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: BRAND_COLORS.textPrimary,
    marginBottom: 8,
  },
  datePickerButton: {
    borderWidth: 1,
    borderColor: BRAND_COLORS.border,
    borderRadius: 8,
    padding: 12,
    backgroundColor: BRAND_COLORS.background,
  },
  datePickerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    marginLeft: 8,
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: BRAND_COLORS.textPrimary,
  },
});

export default PersonalInfoScreen; 