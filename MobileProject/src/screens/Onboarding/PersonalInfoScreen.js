import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import * as Paper from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { launchImageLibrary } from 'react-native-image-picker';
import FormInput from '../../components/FormInput';
import ProgressBar from '../../components/ProgressBar';
import BRAND_COLORS from '../../styles/colors';
import axios from 'axios';
import { API_URL } from '../../config';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import AsyncStorage from '@react-native-async-storage/async-storage';


const inputFields = [
  {
    section: 'Name',
    fields: [
      { name: 'firstName', label: 'First Name', icon: 'account' },
      { name: 'middleName', label: 'Middle Name', icon: 'account' },
      { name: 'lastName', label: 'Last Name', icon: 'account' },
    ],
  },
  {
    section: 'Basic Information',
    fields: [{ name: 'dob', label: 'Date of Birth', icon: 'calendar' }],
  },
  {
    section: 'Contact Information',
    fields: [
      {
        name: 'mobile',
        label: 'Mobile Number',
        icon: 'phone',
        keyboardType: 'phone-pad',
      },
      {
        name: 'email',
        label: 'Email Address',
        icon: 'email',
        keyboardType: 'email-address',
      },
    ],
  },
  {
    section: 'Permanent Address',
    fields: [
      { name: 'houseNumber', label: 'House Number', icon: 'home' },
      { name: 'street', label: 'Street', icon: 'road' },
      { name: 'city', label: 'City', icon: 'city' },
      { name: 'state', label: 'State', icon: 'map-marker' },
      {
        name: 'zipCode',
        label: 'ZIP Code',
        icon: 'post',
        keyboardType: 'numeric',
      },
    ],
  },
];

const validationSchema = yup.object().shape({
  firstName: yup
    .string()
    .required('First name is required')
    .min(2, 'First name must be at least 2 characters')
    .matches(/^[a-zA-Z\s]+$/, 'First name can only contain letters'),

  middleName: yup
    .string()
    .matches(/^[a-zA-Z\s]*$/, 'Middle name can only contain letters'),

  lastName: yup
    .string()
    .required('Last name is required')
    .min(2, 'Last name must be at least 2 characters')
    .matches(/^[a-zA-Z\s]+$/, 'Last name can only contain letters'),

  dob: yup
    .string()
    .required('Date of birth is required')
    .test('age', 'Must be at least 18 years old', value => {
      if (!value) return false;
      const dob = new Date(value);
      const today = new Date();
      const age = today.getFullYear() - dob.getFullYear();
      const monthDiff = today.getMonth() - dob.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
        age--;
      }
      return age >= 18;
    })
    .test('valid-date', 'Invalid date of birth', value => {
      if (!value) return false;
      const date = new Date(value);
      return date.toString() !== 'Invalid Date';
    }),

  mobile: yup
    .string()
    .required('Mobile number is required')
    .matches(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit mobile number'),

  email: yup
    .string()
    .required('Email is required')
    .email('Please enter a valid email address'),

  houseNumber: yup
    .string()
    .required('House number is required')
    .min(1, 'House number is required'),

  street: yup
    .string()
    .required('Street is required')
    .min(3, 'Street must be at least 3 characters'),

  city: yup
    .string()
    .required('City is required')
    .min(2, 'City must be at least 2 characters')
    .matches(/^[a-zA-Z\s]+$/, 'City can only contain letters'),

  state: yup
    .string()
    .required('State is required')
    .min(2, 'State must be at least 2 characters')
    .matches(/^[a-zA-Z\s]+$/, 'State can only contain letters'),

  zipCode: yup
    .string()
    .required('ZIP code is required')
    .matches(/^\d{6}$/, 'Please enter a valid 6-digit ZIP code'),
});

export default function PersonalInfoScreen({ navigation }) {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });
  const [profileImage, setProfileImage] = useState(null);
  const [gender, setGender] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otp, setOtp] = useState('');
  const [isVerified, setIsVerified] = useState(false);

  const mobileNumber = watch('mobile');

  const pickImage = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.8,
    });
    if (!result.didCancel && result.assets?.[0]?.uri) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const sendOtp = async () => {
    if (!mobileNumber || mobileNumber.length < 10) {
      Alert.alert('Error', 'Please enter a valid mobile number');
      return;
    }

    try {
      console.log('Sending OTP to:', `+91${mobileNumber}`);
      const response = await axios.post(`${API_URL}/api/attendant/send-otp`, {
        mobileNumber: `+91${mobileNumber}`,
      });

      console.log('Response:', response.data);

      if (response.data.message === 'OTP sent successfully') {
        setShowOtpInput(true);
        Alert.alert('Success', 'OTP sent successfully');
      } else {
        Alert.alert('Error', 'Failed to send OTP');
      }
    } catch (error) {
      console.error('Error details:', error.response?.data || error.message);
      Alert.alert(
        'Error',
        error.response?.data?.message ||
        'Failed to send OTP. Please try again.',
      );
    }
  };

  const verifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      Alert.alert('Error', 'Please enter a valid 6-digit OTP');
      return;
    }

    try {
      console.log('Verifying OTP:', otp, 'for number:', `+91${mobileNumber}`);
      const response = await axios.post(`${API_URL}/api/attendant/verify-otp`, {
        mobileNumber: `+91${mobileNumber}`,
        otp: otp,
      });

      console.log('Verify Response:', response.data);

      if (response.data.success) {
        setIsVerified(true);
        Alert.alert('Success', 'Mobile number verified successfully');

        // Store the token in AsyncStorage
        const {token} = response.data;
        console.log(token);
        await AsyncStorage.setItem('token', token);

        console.log('Token stored successfully');
      } else {
        Alert.alert('Error', 'Invalid OTP. Please try again.');
      }
    } catch (error) {
      console.error(
        'Verification Error details:',
        error.response?.data || error.message,
      );
      Alert.alert(
        'Error',
        error.response?.data?.message ||
          'Failed to verify OTP. Please try again.',
      );
    }
  };

  const onSubmit = async data => {
    try {
      if (!profileImage || !gender || !isVerified) {
        Alert.alert('Error', 'Please complete all required fields');
        return;
      }

      const token = await AsyncStorage.getItem('token');

      // Create FormData object
      const formData = new FormData();

      // Append the profile photo
      formData.append('profilePhoto', {
        uri: profileImage,
        type: 'image/jpeg',
        name: 'profile-photo.jpg',
      });

      // Append other form data
      formData.append('firstName', data.firstName);
      formData.append('middleName', data.middleName || '');
      formData.append('lastName', data.lastName);
      formData.append('dob', formattedDob); // Send formatted date string
      formData.append('gender', gender);
      formData.append('email', data.email);
      formData.append(
        'permanentAddress',
        JSON.stringify({
          houseNumber: data.houseNumber,
          street: data.street,
          city: data.city,
          state: data.state,
          zipCode: data.zipCode,
        }),
      );

      console.log('Sending data:', {
        dob: formattedDob,
        // ... log other fields for debugging
      });

      const response = await axios.post(
        `${API_URL}/api/attendant/onboarding/personal-info`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      if (response.data.success) {
        navigation.navigate('Document');
      } else {
        Alert.alert(
          'Error',
          response.data.message || 'Failed to save information',
        );
      }
    } catch (error) {
      console.error('Error saving personal info:', error);
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to save personal information',
      );
    }
  };

  const renderSection = (section, fields) => (
    <View key={section} style={styles.section}>
      <Paper.Text style={styles.sectionTitle}>{section}</Paper.Text>
      {fields.map(field => (
        <Controller
          key={field.name}
          control={control}
          name={field.name}
          render={({ field: { onChange, value } }) => (
            <View>
              {field.name === 'mobile' ? (
                <View>
                  <View style={styles.inputContainer}>
                    <FormInput
                      label={field.label}
                      value={value}
                      onChangeText={onChange}
                      icon={field.icon}
                      keyboardType={field.keyboardType}
                      error={errors[field.name]?.message}
                    />
                    {isVerified && (
                      <View style={styles.verifiedBadge}>
                        <Paper.Text style={styles.verifiedText}>✓</Paper.Text>
                      </View>
                    )}
                  </View>
                  {errors[field.name] && (
                    <Paper.Text style={styles.errorText}>
                      {errors[field.name].message}
                    </Paper.Text>
                  )}
                  {!isVerified && (
                    <View style={styles.otpContainer}>
                      <Paper.Button
                        mode="contained"
                        onPress={sendOtp}
                        style={styles.otpButton}>
                        Send OTP
                      </Paper.Button>
                      {showOtpInput && (
                        <View style={styles.otpInputContainer}>
                          <Paper.TextInput
                            label="Enter OTP"
                            value={otp}
                            onChangeText={setOtp}
                            keyboardType="numeric"
                            maxLength={6}
                            style={styles.otpInput}
                          />
                          <Paper.Button
                            mode="contained"
                            onPress={verifyOtp}
                            style={styles.verifyButton}>
                            Submit
                          </Paper.Button>
                        </View>
                      )}
                    </View>
                  )}
                </View>
              ) : (
                <View>
                  {field.name === 'dob' && (
                    <View>
                      <FormInput
                        label={field.label}
                        value={value}
                        onChangeText={text => {
                          // Basic date validation
                          const date = new Date(text);
                          if (!isNaN(date.getTime())) {
                            onChange(text);
                          }
                        }}
                        icon={field.icon}
                        placeholder="YYYY-MM-DD"
                        keyboardType="numeric"
                        error={errors[field.name]?.message}
                      />
                      {errors[field.name] && (
                        <Paper.Text style={styles.errorText}>
                          {errors[field.name].message}
                        </Paper.Text>
                      )}
                    </View>
                  )}
                  {field.name !== 'dob' && (
                    <FormInput
                      label={field.label}
                      value={value}
                      onChangeText={onChange}
                      icon={field.icon}
                      keyboardType={field.keyboardType}
                      error={errors[field.name]?.message}
                    />
                  )}
                  {errors[field.name] && (
                    <Paper.Text style={styles.errorText}>
                      {errors[field.name].message}
                    </Paper.Text>
                  )}
                </View>
              )}
            </View>
          )}
        />
      ))}
      {section === 'Basic Information' && (
        <>
          <Paper.Text style={styles.labelText}>Gender</Paper.Text>
          <Paper.RadioButton.Group
            onValueChange={value => setGender(value)}
            value={gender}>
            <View style={styles.radioGroup}>
              <Paper.RadioButton.Item
                label="Male"
                value="Male"
                labelStyle={styles.radioLabel}
                color={BRAND_COLORS.orange}
              />
              <Paper.RadioButton.Item
                label="Female"
                value="Female"
                labelStyle={styles.radioLabel}
                color={BRAND_COLORS.orange}
              />
              <Paper.RadioButton.Item
                label="Other"
                value="Other"
                labelStyle={styles.radioLabel}
                color={BRAND_COLORS.orange}
              />
            </View>
          </Paper.RadioButton.Group>
        </>
      )}
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <ProgressBar step={1} totalSteps={8} />
      <Paper.Text style={styles.headerText}>Personal Information</Paper.Text>

      <View style={styles.photoSection}>
        <TouchableOpacity onPress={pickImage} style={styles.photoContainer}>
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.profileImage} />
          ) : (
            <>
              <Paper.Text style={styles.uploadText}>Upload Photo</Paper.Text>
              <Paper.Text style={styles.uploadSubText}>Tap to choose</Paper.Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {inputFields.map(({ section, fields }) => renderSection(section, fields))}

      <Paper.Button
        mode="contained"
        onPress={handleSubmit(onSubmit)}
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
    backgroundColor: '#fff',
  },
  scrollContent: {
    padding: 20,
  },
  headerText: {
    fontSize: 28,
    fontFamily: 'Poppins-Bold',
    color: BRAND_COLORS.textPrimary,
    marginBottom: 10,
    textAlign: 'center',
    fontWeight: '900',
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    fontFamily: 'Poppins-Bold',
    color: BRAND_COLORS.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins-Medium',
    color: BRAND_COLORS.textSecondary,
    marginBottom: 24,
    textAlign: 'center',
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
    fontFamily: 'Poppins-Bold',
    fontWeight: '700',
    color: 'white',
    letterSpacing: 1,
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
    borderColor: '#F1F5F9',
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-Medium',
    color: BRAND_COLORS.secondary,
    marginBottom: 15,
    paddingBottom: 8,
    borderBottomWidth: 2,
    borderBottomColor: BRAND_COLORS.border,
  },
  labelText: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: BRAND_COLORS.textSecondary,
    marginBottom: 15,
    marginTop: 1,
  },
  radioGroup: {
    backgroundColor: BRAND_COLORS.background,
    borderRadius: 12,
    overflow: 'hidden',
    marginHorizontal: -10,
    borderWidth: 1,
    borderColor: BRAND_COLORS.border,
  },
  radioLabel: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: BRAND_COLORS.textSecondary,
  },
  photoSection: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 10,
  },
  photoContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: BRAND_COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: BRAND_COLORS.primary,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 8,
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  uploadText: {
    fontFamily: 'Poppins-Medium',
    color: BRAND_COLORS.primary,
    fontSize: 16,
    marginBottom: 4,
  },
  uploadSubText: {
    fontFamily: 'Poppins-Regular',
    color: BRAND_COLORS.textSecondary,
    fontSize: 13,
  },
  inputContainer: {
    position: 'relative',
    // flexDirection: 'row',
    // alignItems: 'center',
  },
  verifiedBadge: {
    position: 'absolute',
    right: 16,
    top: '50%',
    transform: [{ translateY: -20 }],
    backgroundColor: BRAND_COLORS.secondary,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  verifiedText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  otpButton: {
    alignSelf: 'center',
    backgroundColor: BRAND_COLORS.primary,
    borderRadius: 20,
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  otpInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 8,
  },
  otpInput: {
    flex: 1,
    backgroundColor: BRAND_COLORS.background,
  },
  verifyButton: {
    backgroundColor: BRAND_COLORS.primary,
  },
  errorText: {
    color: BRAND_COLORS.error,
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    marginTop: 4,
    marginLeft: 8,
  },
});