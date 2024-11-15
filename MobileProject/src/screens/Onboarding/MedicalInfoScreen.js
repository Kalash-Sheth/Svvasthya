import React from 'react';
import {View, StyleSheet, ScrollView, Alert} from 'react-native';
import * as Paper from 'react-native-paper';
import {useForm, Controller} from 'react-hook-form';
import FormInput from '../../components/FormInput';
import ProgressBar from '../../components/ProgressBar';
import BRAND_COLORS from '../../styles/colors';
import axios from 'axios';
import {API_URL} from '../../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';

const validationSchema = yup.object().shape({
  medicalConditions: yup.string(),
  allergies: yup.string(),
  emergencyContactName: yup
    .string()
    .required('Emergency contact name is required')
    .min(2, 'Name must be at least 2 characters'),
  emergencyContactRelation: yup
    .string()
    .required('Relationship is required')
    .min(2, 'Relationship must be at least 2 characters'),
  emergencyContactMobile: yup
    .string()
    .required('Mobile number is required')
    .matches(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit mobile number'),
  emergencyContactAlternate: yup
    .string()
    .matches(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit mobile number')
    .nullable(),
});

export default function MedicalInfoScreen({navigation}) {
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async data => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        Alert.alert('Error', 'Authentication token not found');
        return;
      }

      const response = await axios.post(
        `${API_URL}/api/attendant/onboarding/health-info`,
        {
          medicalConditions: data.medicalConditions || 'None',
          allergies: data.allergies || 'None',
          emergencyContact: {
            contactName: data.emergencyContactName,
            relationship: data.emergencyContactRelation,
            mobileNumber: data.emergencyContactMobile,
            alternativeNumber: data.emergencyContactAlternate || '',
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      if (response.data.success) {
        navigation.navigate('BankingInfo');
      } else {
        Alert.alert(
          'Error',
          response.data.message || 'Failed to save medical information',
        );
      }
    } catch (error) {
      console.error('Error saving medical info:', error);
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to save medical information',
      );
    }
  };

  return (
    <ScrollView style={styles.container}>
      <ProgressBar step={6} totalSteps={8} />
      <Paper.Text style={styles.headerText}>Medical Information</Paper.Text>

      <View style={styles.section}>
        <Paper.Text style={styles.sectionTitle}>Medical Conditions</Paper.Text>
        <Paper.Text style={styles.sectionSubtitle}>
          Please provide information about any medical conditions or allergies
        </Paper.Text>

        <Controller
          control={control}
          name="medicalConditions"
          render={({field: {onChange, value}}) => (
            <View>
              <FormInput
                label="Medical Conditions"
                value={value}
                onChangeText={onChange}
                icon="stethoscope"
                placeholder="e.g., Asthma, Diabetes, None"
                multiline
                error={errors.medicalConditions?.message}
              />
              {errors.medicalConditions && (
                <Paper.Text style={styles.errorText}>
                  {errors.medicalConditions.message}
                </Paper.Text>
              )}
            </View>
          )}
        />

        <Controller
          control={control}
          name="allergies"
          render={({field: {onChange, value}}) => (
            <View>
              <FormInput
                label="Allergies"
                value={value}
                onChangeText={onChange}
                icon="alert-circle"
                placeholder="e.g., Penicillin, Peanuts, None"
                multiline
                error={errors.allergies?.message}
              />
              {errors.allergies && (
                <Paper.Text style={styles.errorText}>
                  {errors.allergies.message}
                </Paper.Text>
              )}
            </View>
          )}
        />
      </View>

      <View style={styles.section}>
        <Paper.Text style={styles.sectionTitle}>Emergency Contact</Paper.Text>
        <Paper.Text style={styles.sectionSubtitle}>
          Person to contact in case of emergency
        </Paper.Text>

        <Controller
          control={control}
          name="emergencyContactName"
          render={({field: {onChange, value}}) => (
            <View>
              <FormInput
                label="Contact Name"
                value={value}
                onChangeText={onChange}
                icon="user"
                placeholder="Full Name"
                error={errors.emergencyContactName?.message}
              />
              {errors.emergencyContactName && (
                <Paper.Text style={styles.errorText}>
                  {errors.emergencyContactName.message}
                </Paper.Text>
              )}
            </View>
          )}
        />

        <Controller
          control={control}
          name="emergencyContactRelation"
          render={({field: {onChange, value}}) => (
            <View>
              <FormInput
                label="Relationship"
                value={value}
                onChangeText={onChange}
                icon="users"
                placeholder="e.g., Spouse, Parent, Sibling"
                error={errors.emergencyContactRelation?.message}
              />
              {errors.emergencyContactRelation && (
                <Paper.Text style={styles.errorText}>
                  {errors.emergencyContactRelation.message}
                </Paper.Text>
              )}
            </View>
          )}
        />

        <Controller
          control={control}
          name="emergencyContactMobile"
          render={({field: {onChange, value}}) => (
            <View>
              <FormInput
                label="Mobile Number"
                value={value}
                onChangeText={onChange}
                icon="phone"
                keyboardType="phone-pad"
                placeholder="Emergency Contact Number"
                error={errors.emergencyContactMobile?.message}
              />
              {errors.emergencyContactMobile && (
                <Paper.Text style={styles.errorText}>
                  {errors.emergencyContactMobile.message}
                </Paper.Text>
              )}
            </View>
          )}
        />

        <Controller
          control={control}
          name="emergencyContactAlternate"
          render={({field: {onChange, value}}) => (
            <View>
              <FormInput
                label="Alternate Number (Optional)"
                value={value}
                onChangeText={onChange}
                icon="phone"
                keyboardType="phone-pad"
                placeholder="Alternate Contact Number"
                error={errors.emergencyContactAlternate?.message}
              />
              {errors.emergencyContactAlternate && (
                <Paper.Text style={styles.errorText}>
                  {errors.emergencyContactAlternate.message}
                </Paper.Text>
              )}
            </View>
          )}
        />
      </View>

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
  errorText: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: BRAND_COLORS.error,
    marginTop: 4,
    marginLeft: 8,
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
