import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import 'react-native-vector-icons/MaterialCommunityIcons';
import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import SplashScreen from './src/screens/SplashScreen';
import ProfileScreen from './src/screens/ProfileScreen';
// import SettingsScreen from './src/screens/SettingsScreen';
import UpcomingTasks from './src/screens/UpcomingTasks';
import TaskScreen from './src/screens/TaskScreen';
import RealTimeModel from './src/screens/RealTimeModel';
import Onboarding from './src/components/Onboarding';
import WelcomeScreen from './src/screens/Onboarding/WelcomeScreen';
import PersonalInfoScreen from './src/screens/Onboarding/PersonalInfoScreen';
import DocumentScreen from './src/screens/Onboarding/DocumentScreen';
import EarningsScreen from './src/screens/EarningsScreen';
import SkillsScreen from './src/screens/Onboarding/SkillsScreen';
import AvailabilityScreen from './src/screens/Onboarding/AvailabilityScreen';
import MedicalInfoScreen from './src/screens/Onboarding/MedicalInfoScreen';
import BankingInfoScreen from './src/screens/Onboarding/BankingInfoScreen';
import AgreementScreen from './src/screens/Onboarding/AgreementScreen';
import ConfirmationScreen from './src/screens/Onboarding/ConfirmationScreen';
import UpdateAvailabilityScreen from './src/screens/UpdateAvailabilityScreen';
import { Icon } from 'react-native-elements';
import ProfessionalInfoScreen from './src/screens/Onboarding/ProfessionalInfoScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Tasks"
        component={TaskScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Earnings"
        component={EarningsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="settings" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="person" color={color} size={size} />
          ),
        }}
      />

    </Tab.Navigator>
  );
};

const App = () => {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Splash">
          <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Onboarding" component={Onboarding} />
          <Stack.Screen name="UpcomingTasks" component={UpcomingTasks} />
          <Stack.Screen name="Tasks" component={TaskScreen} />
          <Stack.Screen name="Earnings" component={EarningsScreen} />
          <Stack.Screen name="RealTimeModel" component={RealTimeModel} />
          <Stack.Screen name="UpdateAvailability" component={UpdateAvailabilityScreen} />
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="PersonalInfo" component={PersonalInfoScreen} />
          <Stack.Screen name="Document" component={DocumentScreen} />
          <Stack.Screen name="ProfessionalInfo" component={ProfessionalInfoScreen} />
          <Stack.Screen name="Skills" component={SkillsScreen} />
          <Stack.Screen name="Availability" component={AvailabilityScreen} />
          <Stack.Screen name="MedicalInfo" component={MedicalInfoScreen} />
          <Stack.Screen name="BankingInfo" component={BankingInfoScreen} />
          <Stack.Screen name="Agreements" component={AgreementScreen} />
          <Stack.Screen name="Confirmation" component={ConfirmationScreen} />
          <Stack.Screen name="Main" component={TabNavigator} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;
