import {createStackNavigator} from '@react-navigation/stack';
import WelcomeScreen from '../screens/Onboarding/WelcomeScreen';
import PersonalInfoScreen from '../screens/Onboarding/PersonalInfoScreen';
import DocumentScreen from '../screens/Onboarding/DocumentScreen';
import ProfessionalInfoScreen from '../screens/Onboarding/ProfessionalInfoScreen';
import SkillsScreen from '../screens/Onboarding/SkillsScreen';

const Stack = createStackNavigator();

export default function OnboardingStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="PersonalInfo" component={PersonalInfoScreen} />
      <Stack.Screen name="Document" component={DocumentScreen} />
      <Stack.Screen name="ProfessionalInfo" component={ProfessionalInfoScreen} />
      <Stack.Screen name="Skills" component={SkillsScreen} />
    </Stack.Navigator>
  );
} 