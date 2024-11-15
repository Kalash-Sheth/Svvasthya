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
  title: yup.string().required('Professional title is required'),
  specialization: yup.string().required('Specialization is required'),
  experience: yup
    .number()
    .required('Years of experience is required')
    .min(0, 'Experience cannot be negative')
    .max(50, 'Please enter valid years of experience'),
  employerName: yup.string().required('Employer name is required'),
  duration: yup.string().required('Duration is required'),
  referenceContact: yup
    .string()
    .matches(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit mobile number')
    .required('Reference contact is required'),
});

const professionalFields = [
  {
    section: 'Professional Details',
    fields: [
      {
        name: 'title',
        label: 'Professional Title',
        icon: 'briefcase',
        placeholder: 'e.g., Nurse, Caregiver, Companion',
      },
      {
        name: 'specialization',
        label: 'Specialization',
        icon: 'star',
        placeholder: 'e.g., Pediatric Care, Geriatric Care',
      },
      {
        name: 'experience',
        label: 'Years of Experience',
        icon: 'clock',
        keyboardType: 'numeric',
      },
    ],
  },
];

const employerFields = [
  {
    name: 'employerName',
    label: 'Employer Name',
    icon: 'building',
  },
  {
    name: 'duration',
    label: 'Duration',
    icon: 'clock',
    placeholder: 'e.g., 2 years 3 months',
  },
  {
    name: 'referenceContact',
    label: 'Reference Contact',
    icon: 'phone',
    keyboardType: 'phone-pad',
  },
];

export default function ProfessionalInfoScreen({navigation}) {
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
        `${API_URL}/api/attendant/onboarding/professional-info`,
        {
          title: data.title,
          specialization: data.specialization,
          yearsOfExperience: data.experience,
          previousEmployment: {
            employerName: data.employerName,
            duration: data.duration,
            referenceContact: data.referenceContact,
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
        navigation.navigate('Skills');
      } else {
        Alert.alert(
          'Error',
          response.data.message || 'Failed to save professional information',
        );
      }
    } catch (error) {
      console.error('Error saving professional info:', error);
      Alert.alert(
        'Error',
        error.response?.data?.message ||
          'Failed to save professional information',
      );
    }
  };

  const renderEmployerSection = index => (
    <View key={index} style={styles.employerSection}>
      <Paper.Text style={styles.employerTitle}>
        Previous Employer {index + 1}
      </Paper.Text>
      {employerFields.map(field => (
        <Controller
          key={field.name}
          control={control}
          name={field.name}
          render={({field: {onChange, value}}) => (
            <View>
              <FormInput
                label={field.label}
                value={value}
                onChangeText={onChange}
                icon={field.icon}
                keyboardType={field.keyboardType}
                placeholder={field.placeholder}
                error={errors[field.name]?.message}
              />
              {errors[field.name] && (
                <Paper.Text style={styles.errorText}>
                  {errors[field.name].message}
                </Paper.Text>
              )}
            </View>
          )}
        />
      ))}
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <ProgressBar step={3} totalSteps={8} />
      <Paper.Text style={styles.headerText}>Professional Information</Paper.Text>

      {professionalFields.map(({section, fields}) => (
        <View key={section} style={styles.section}>
          <Paper.Text style={styles.sectionTitle}>{section}</Paper.Text>
          {fields.map(field => (
            <Controller
              key={field.name}
              control={control}
              name={field.name}
              render={({field: {onChange, value}}) => (
                <View>
                  <FormInput
                    label={field.label}
                    value={value}
                    onChangeText={onChange}
                    icon={field.icon}
                    keyboardType={field.keyboardType}
                    placeholder={field.placeholder}
                    error={errors[field.name]?.message}
                  />
                  {errors[field.name] && (
                    <Paper.Text style={styles.errorText}>
                      {errors[field.name].message}
                    </Paper.Text>
                  )}
                </View>
              )}
            />
          ))}
        </View>
      ))}

      <View style={styles.section}>
        <Paper.Text style={styles.sectionTitle}>Previous Employment</Paper.Text>
        <Paper.Text style={styles.sectionSubtitle}>
          Add your previous work experience and references
        </Paper.Text>
        {[0].map(index => renderEmployerSection(index))}
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
  employerSection: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: BRAND_COLORS.border,
  },
  employerTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    fontWeight: '700',
    color: BRAND_COLORS.textPrimary,
    marginBottom: 15,
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
  errorText: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: 'red',
    marginTop: 5,
  },
}); 