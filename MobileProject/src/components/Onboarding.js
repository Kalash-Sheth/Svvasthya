import React from 'react';
import { View, Text, TextInput, Image, ScrollView } from 'react-native';
import styled from 'styled-components/native';

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
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [bio, setBio] = React.useState('');

    const renderScreen = () => {
        switch (screen) {
            case 'OnboardingScreen1':
                return (
                    <Container>
                        <Header>Welcome to Svvasthya</Header>
                        <Image source={require('../../assets/Svvasthya_logo.png')} style={{ width: 200, height: 200 }} />
                        <ButtonStyled onPress={() => setScreen('AccountSetupScreen')}>
                            <ButtonText>Get Started</ButtonText>
                        </ButtonStyled>
                    </Container>
                );

            case 'AccountSetupScreen':
                return (
                    <Container>
                        <Header>Account Setup</Header>
                        <Input placeholder="Email" value={email} onChangeText={setEmail} />
                        <Input placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
                        <ButtonStyled onPress={() => setScreen('ProfileCompletionScreen')}>
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
