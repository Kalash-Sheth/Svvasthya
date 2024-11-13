import React from 'react';
import { View, Text, TextInput, Image, ScrollView, Alert } from 'react-native';
import styled from 'styled-components/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../config';

// Styled components
const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background-color: #f7f9fc;
`;

const Header = styled.Text`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #333;
`;

const Input = styled.TextInput`
  width: 100%;
  padding: 15px;
  border-radius: 10px;
  border: 1px solid #ddd;
  margin-bottom: 15px;
`;

const ButtonStyled = styled.TouchableOpacity`
  background-color: #007bff;
  padding: 15px;
  border-radius: 10px;
  align-items: center;
  width: 100%;
`;

const ButtonText = styled.Text`
  color: white;
  font-size: 18px;
  font-weight: bold;
`;

// Onboarding Component
const Onboarding = () => {
    const [screen, setScreen] = React.useState('OnboardingScreen1');
    const [mobileNumber, setMobileNumber] = React.useState('');
    const [otp, setOtp] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const[bio,setBio] = React.useState('');

    const sendOtp = async () => {
      try {
        await axios.post(`${API_URL}/api/attendant/send-otp`, {
          mobileNumber,
        });
        Alert.alert('OTP Sent', 'Please check your phone for the OTP.');
        setScreen('OtpVerificationScreen');
      } catch (error) {
        Alert.alert('Error', 'Failed to send OTP. Please try again.');
      }
    };

    const verifyOtp = async () => {
      try {
        const response = await axios.post(
          `${API_URL}/api/attendant/verify-otp`,
          {mobileNumber, otp},
        );
        if (response.data.success) {
          Alert.alert('Success', 'OTP Verified.');
          setScreen('AccountSetupScreen');
        } else {
          Alert.alert('Error', 'Invalid OTP.');
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to verify OTP. Please try again.');
      }
    };

    const completeOnboarding = async () => {
      try {
        await axios.post(
          `${API_URL}/api/attendant/complete-onboarding`,
          {mobileNumber, email, password},
        );
        Alert.alert('Success', 'Onboarding Complete.');
        setScreen('ProfileCompletionScreen');
      } catch (error) {
        Alert.alert('Error', 'Failed to complete onboarding.');
      }
    };

    const renderScreen = () => {
        switch (screen) {
            case 'OnboardingScreen1':
                return (
                    <Container>
                        <Header>Welcome to Svvasthya</Header>
                        <Image source={require('../../assets/Svvasthya_logo.png')} style={{ width: 200, height: 200 }} />
                        <ButtonStyled onPress={() => setScreen('MobileNumberScreen')}>
                            <ButtonText>Get Started</ButtonText>
                        </ButtonStyled>
                    </Container>
                );

            case 'MobileNumberScreen':
                return (
                    <Container>
                        <Header>Enter Mobile Number</Header>
                        <Input placeholder="Mobile Number" keyboardType="phone-pad" value={mobileNumber} onChangeText={setMobileNumber} />
                        <ButtonStyled onPress={sendOtp}>
                            <ButtonText>Send OTP</ButtonText>
                        </ButtonStyled>
                    </Container>
                );

            case 'OtpVerificationScreen':
                return (
                    <Container>
                        <Header>Verify OTP</Header>
                        <Input placeholder="Enter OTP" keyboardType="numeric" value={otp} onChangeText={setOtp} />
                        <ButtonStyled onPress={verifyOtp}>
                            <ButtonText>Verify OTP</ButtonText>
                        </ButtonStyled>
                    </Container>
                );

            case 'AccountSetupScreen':
                return (
                    <Container>
                        <Header>Set Up Account</Header>
                        <Input placeholder="Email" value={email} onChangeText={setEmail} />
                        <Input placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
                        <ButtonStyled onPress={completeOnboarding}>
                            <ButtonText>Continue</ButtonText>
                        </ButtonStyled>
                    </Container>
                );


            case 'ProfileCompletionScreen':
                return (
                    <Container>
                        <Header>Complete Your Profile</Header>
                        <Input placeholder="Bio/Experience" value={bio} onChangeText={setBio} />
                        <ButtonStyled onPress={() => setScreen('ServiceAgreementScreen')}>
                            <ButtonText>Save & Continue</ButtonText>
                        </ButtonStyled>
                    </Container>
                );

            case 'ServiceAgreementScreen':
                return (
                    <Container>
                        <Header>Service Agreement</Header>
                        <Text>Please read and accept the terms and conditions.</Text>
                        <ButtonStyled onPress={() => setScreen('LocationPermissionsScreen')}>
                            <ButtonText>Agree and Continue</ButtonText>
                        </ButtonStyled>
                    </Container>
                );

            case 'LocationPermissionsScreen':
                return (
                    <Container>
                        <Header>Location Permissions</Header>
                        <Text>Enable location permissions for service assignments.</Text>
                        <ButtonStyled onPress={() => setScreen('AppFeaturesScreen')}>
                            <ButtonText>Enable Location</ButtonText>
                        </ButtonStyled>
                    </Container>
                );

            case 'AppFeaturesScreen':
                return (
                    <Container>
                        <Header>App Features Overview</Header>
                        <ScrollView>
                            <Text>1. Booking Management</Text>
                            <Text>2. Availability Updates</Text>
                            <Text>3. Profile Management</Text>
                            <Text>4. Notifications for New Assignments</Text>
                        </ScrollView>
                        <ButtonStyled onPress={() => setScreen('FinalSetupScreen')}>
                            <ButtonText>Finish Tutorial</ButtonText>
                        </ButtonStyled>
                    </Container>
                );

            case 'FinalSetupScreen':
                return (
                    <Container>
                        <Header>Congratulations!</Header>
                        <Text>You have completed the onboarding process.</Text>
                        <ButtonStyled onPress={() => alert('Start Using the App')}>
                            <ButtonText>Start Using the App</ButtonText>
                        </ButtonStyled>
                    </Container>
                );

            default:
                return null;
        }
    };

    return <>{renderScreen()}</>;
};

export default Onboarding;
