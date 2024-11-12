import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Button, Text, RadioButton } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useForm, Controller } from 'react-hook-form';
import { launchImageLibrary } from 'react-native-image-picker';
import FormInput from '../../components/FormInput';
import ProgressBar from '../../components/ProgressBar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const BRAND_COLORS = {
  orange: '#FF7F50',
  green: '#4CAF50',
  blue: '#2196F3',
  lightBlue: '#E3F2FD',
  lightOrange: '#FFF3E0',
  lightGreen: '#E8F5E9',
  gray: '#666666',
  lightGray: '#F5F5F5',
};

const inputFields = [
  {
    section: 'Contact Information',
    fields: [
      {
        name: 'mobileNumber',
        label: 'Mobile Number',
        icon: 'phone',
        keyboardType: 'phone-pad',
      },
    ],
  },
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
    fields: [{ name: 'dob', label: 'Date of Birth', icon: 'calendar' },
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

export default function PersonalInfoScreen({ navigation }) {
  const { control, handleSubmit, setValue, getValues } = useForm();
  const [profileImage, setProfileImage] = useState(null);
  const [gender, setGender] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otp, setOtp] = useState('');
  const [formData, setFormData] = useState({});


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
    try {
      await axios.post('http://192.168.1.15:5000/api/attendant/send-otp', { mobileNumber: formData.mobileNumber });
      setOtpSent(true);
      alert('OTP sent successfully!');
    } catch (error) {
      console.error('Error sending OTP:', error);
      alert('Failed to send OTP.');
    }
  };

  const verifyOtp = async () => {
    try {
      const response = await axios.post(
        'http://192.168.1.15:5000/api/attendant/verify-otp',
        { mobileNumber: formData.mobileNumber, otp },
        { withCredentials: true }
      );
      if (response.data.success) {
        alert('Mobile verified successfully!');
        const authToken = response.data.token;

        // Store the authToken in AsyncStorage
        await AsyncStorage.setItem('authToken', authToken);
        setOtpVerified(true);
      } else {
        alert('Invalid OTP');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      alert('Failed to verify OTP.');
    }
  };

  const onSubmit = async (data) => {
    // if (!otpVerified) {
    //   alert('Please verify your mobile number first.');
    //   return;
    // }

    // try {
    //   // Prepare submission data
    //   const { mobileNumber, ...filteredData } = data;
    //   const submissionData = {
    //     ...filteredData,
    //     profileImage,
    //   };

    //   // Get the token (assuming it's stored in local storage or secure storage)
    //   const token = await AsyncStorage.getItem('authToken'); // Or use SecureStore for sensitive storage

    //   // Store data to backend
    //   const response = await axios.post(
    //     'http://192.168.1.15:5000/api/attendant/onboarding',
    //     submissionData,
    //     {
    //       headers: {
    //         Authorization: `Bearer ${token}`, // Send token in Authorization header
    //       },
    //       withCredentials: true,
    //     }
    //   );

      // if (response.data.success) {
      //   alert('Personal Information saved successfully!');
        navigation.navigate('Document'); // Navigate to next screen
      // } else {
      //   alert('Failed to save personal information. Please try again.');
      // }
    // } catch (error) {
    //   console.error('Error submitting personal information:', error);
    //   alert('Error saving personal information. Please try again.');
    // }
  };

  const handleFieldChange = (field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
    setValue(field, value); // This will update the react-hook-form value
  };

  const renderSection = (section, fields) => (
    <View key={section} style={styles.section}>
      <Text style={styles.sectionTitle}>{section}</Text>
      {fields.map((field) => (
        <Controller
          key={field.name}
          control={control}
          name={field.name}
          render={({ field: { onChange, value } }) => (
            <FormInput
              label={field.label}
              value={formData[field.name] || value} // bind formData state
              onChangeText={(text) => {
                handleFieldChange(field.name, text); // Update formData state
                onChange(text); // Update react-hook-form value
              }}
              icon={field.icon}
              keyboardType={field.keyboardType}
            />
          )}
        />
      ))}
      {section === 'Contact Information' && (
        <>
          {otpSent && !otpVerified && (
            <>
              <FormInput
                label="Enter OTP"
                value={otp}
                onChangeText={setOtp}
                keyboardType="numeric"
              />
              <Button
                mode="outlined"
                onPress={verifyOtp}
                style={styles.buttonSmall}
              >
                Verify OTP
              </Button>
            </>
          )}
          {!otpVerified ? (
            <Button
              mode="outlined"
              onPress={sendOtp}
              style={styles.buttonSmall}
            >
              Send OTP
            </Button>
          ) : (
            <Icon
              icon="check-decagram"
              color={BRAND_COLORS.green}
              size={30}
            />
          )}
        </>
      )}
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <ProgressBar step={1} totalSteps={8} />
      <Text style={styles.headerText}>Personal Information</Text>

      <View style={styles.photoSection}>
        <TouchableOpacity onPress={pickImage} style={styles.photoContainer}>
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.profileImage} />
          ) : (
            <>
              <Text style={styles.uploadText}>Upload Photo</Text>
              <Text style={styles.uploadSubText}>Tap to choose</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {inputFields.map(({ section, fields }) =>
        renderSection(section, fields)
      )}

      <Button
        mode="contained"
        onPress={handleSubmit(onSubmit)}
        style={styles.button}
        contentStyle={styles.buttonContent}
        labelStyle={styles.buttonText}
      >
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
    fontFamily: 'Poppins-SemiBold',
    color: BRAND_COLORS.blue,
    marginBottom: 25,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
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
    borderColor: '#F1F5F9',
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-Medium',
    color: BRAND_COLORS.green,
    marginBottom: 15,
    paddingBottom: 8,
    borderBottomWidth: 2,
    borderBottomColor: BRAND_COLORS.lightGreen,
  },
  labelText: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: BRAND_COLORS.gray,
    marginBottom: 15,
    marginTop: 1,
  },
  radioGroup: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    overflow: 'hidden',
    marginHorizontal: -10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  radioLabel: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: '#334155',
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
    backgroundColor: BRAND_COLORS.lightBlue,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: BRAND_COLORS.orange,
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
    color: BRAND_COLORS.blue,
    fontSize: 16,
    marginBottom: 4,
  },
  uploadSubText: {
    fontFamily: 'Poppins-Regular',
    color: BRAND_COLORS.gray,
    fontSize: 13,
  },
  button: {
    marginVertical: 25,
    backgroundColor: BRAND_COLORS.orange,
    borderRadius: 30,
    elevation: 8,
    shadowColor: BRAND_COLORS.orange,
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