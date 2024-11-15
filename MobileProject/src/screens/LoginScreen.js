import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Image,
} from 'react-native';
import {TextInput, Button} from 'react-native-paper';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_URL} from '../config';
import BRAND_COLORS from '../styles/colors';

export default function LoginScreen({navigation}) {
  const [mobileNumber, setMobileNumber] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otp, setOtp] = useState('');

  const handleSendOtp = async () => {
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

  const handleVerifyOtp = async () => {
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
        // Store the token in AsyncStorage
        const {token} = response.data;
        console.log(token);
        await AsyncStorage.setItem('authToken', token);

        console.log('Token stored successfully');
        navigation.navigate('Welcome');
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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require('../../assets/svvasthya_logo_tran.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.title}>Welcome Back!</Text>
        <Text style={styles.subtitle}>Login to continue</Text>

        <View style={styles.inputContainer}>
          <TextInput
            label="Mobile Number"
            value={mobileNumber}
            onChangeText={setMobileNumber}
            mode="outlined"
            keyboardType="phone-pad"
            left={<TextInput.Affix text="+91" />}
            style={styles.input}
            outlineColor={BRAND_COLORS.border}
            activeOutlineColor={BRAND_COLORS.primary}
            theme={{
              colors: {
                placeholder: BRAND_COLORS.textSecondary,
                text: BRAND_COLORS.textPrimary,
                primary: BRAND_COLORS.primary,
                background: '#fff',
              },
            }}
          />

          {showOtpInput && (
            <TextInput
              label="Enter OTP"
              value={otp}
              onChangeText={setOtp}
              mode="outlined"
              keyboardType="number-pad"
              maxLength={6}
              style={[styles.input, styles.otpInput]}
              outlineColor={BRAND_COLORS.border}
              activeOutlineColor={BRAND_COLORS.primary}
              theme={{
                colors: {
                  placeholder: BRAND_COLORS.textSecondary,
                  text: BRAND_COLORS.textPrimary,
                  primary: BRAND_COLORS.primary,
                  background: '#fff',
                },
              }}
            />
          )}
        </View>

        <Button
          mode="contained"
          onPress={showOtpInput ? handleVerifyOtp : handleSendOtp}
          style={styles.button}
          contentStyle={styles.buttonContent}
          labelStyle={styles.buttonText}>
          {showOtpInput ? 'Verify OTP' : 'Send OTP'}
        </Button>

        {showOtpInput && (
          <TouchableOpacity
            onPress={handleSendOtp}
            style={styles.resendContainer}>
            <Text style={styles.resendText}>Didn't receive OTP? </Text>
            <Text style={styles.resendLink}>Resend</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 40,
  },
  logo: {
    width: 200,
    height: 200,
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Poppins-Bold',
    color: BRAND_COLORS.textPrimary,
    marginBottom: 8,
    fontWeight: '900',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: BRAND_COLORS.textSecondary,
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 24,
  },
  input: {
    backgroundColor: '#fff',
    marginBottom: 16,
  },
  otpInput: {
    marginTop: 8,
  },
  button: {
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
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  resendText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: BRAND_COLORS.textSecondary,
  },
  resendLink: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: BRAND_COLORS.primary,
  },
});
