import React from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import {Button, Text} from 'react-native-paper';
import {useForm, Controller} from 'react-hook-form';
import FormInput from '../../components/FormInput';
import ProgressBar from '../../components/ProgressBar';
import BRAND_COLORS  from '../../styles/colors';
import axios from 'axios';
<<<<<<< HEAD
import { API_URL } from '../../config';
=======
import {API_URL} from '../../config';
>>>>>>> 806250063ab972ba6b5cae55e95ff130e3958d6e
import { Alert } from 'react-native';

export default function MedicalInfoScreen({navigation}) {
  const {control, handleSubmit} = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/attendant/onboarding/health-info/${attendantId}`,
        {
          medicalConditions: data.medicalConditions,
          allergies: data.allergies,
          emergencyContact: {
            contactName: data.emergencyContactName,
            relationship: data.emergencyContactRelation,
            mobileNumber: data.emergencyContactMobile,
            alternativeNumber: data.emergencyContactAlternate
          }
        }
      );

      if (response.data.success) {
        navigation.navigate('BankingInfo');
      } else {
        Alert.alert('Error', response.data.message || 'Failed to save medical information');
      }
    } catch (error) {
      console.error('Error saving medical info:', error);
      Alert.alert('Error', 'Failed to save medical information');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <ProgressBar step={6} totalSteps={8} />
      <Text style={styles.headerText}>Medical Information</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Medical Conditions</Text>
        <Text style={styles.sectionSubtitle}>
          Please provide information about any medical conditions or allergies
        </Text>

        <Controller
          control={control}
          name="medicalConditions"
          render={({field: {onChange, value}}) => (
            <FormInput
              label="Medical Conditions"
              value={value}
              onChangeText={onChange}
              icon="stethoscope"
              placeholder="e.g., Asthma, Diabetes, None"
              multiline
            />
          )}
        />

        <Controller
          control={control}
          name="allergies"
          render={({field: {onChange, value}}) => (
            <FormInput
              label="Allergies"
              value={value}
              onChangeText={onChange}
              icon="alert-circle"
              placeholder="e.g., Penicillin, Peanuts, None"
              multiline
            />
          )}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Emergency Contact</Text>
        <Text style={styles.sectionSubtitle}>
          Person to contact in case of emergency
        </Text>

        <Controller
          control={control}
          name="emergencyContactName"
          render={({field: {onChange, value}}) => (
            <FormInput
              label="Contact Name"
              value={value}
              onChangeText={onChange}
              icon="user"
              placeholder="Full Name"
            />
          )}
        />

        <Controller
          control={control}
          name="emergencyContactRelation"
          render={({field: {onChange, value}}) => (
            <FormInput
              label="Relationship"
              value={value}
              onChangeText={onChange}
              icon="users"
              placeholder="e.g., Spouse, Parent, Sibling"
            />
          )}
        />

        <Controller
          control={control}
          name="emergencyContactMobile"
          render={({field: {onChange, value}}) => (
            <FormInput
              label="Mobile Number"
              value={value}
              onChangeText={onChange}
              icon="phone"
              keyboardType="phone-pad"
              placeholder="Emergency Contact Number"
            />
          )}
        />

        <Controller
          control={control}
          name="emergencyContactAlternate"
          render={({field: {onChange, value}}) => (
            <FormInput
              label="Alternate Number (Optional)"
              value={value}
              onChangeText={onChange}
              icon="phone"
              keyboardType="phone-pad"
              placeholder="Alternate Contact Number"
            />
          )}
        />
      </View>

      <Button
        mode="contained"
        onPress={handleSubmit(onSubmit)}
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
