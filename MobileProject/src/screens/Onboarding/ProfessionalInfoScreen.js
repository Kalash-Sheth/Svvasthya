import React from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import {Button, Text} from 'react-native-paper';
import {useForm, Controller} from 'react-hook-form';
import FormInput from '../../components/FormInput';
import {Briefcase, Star, Clock, Building} from 'lucide-react-native';
import ProgressBar from '../../components/ProgressBar';

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

// Add these icons to FormInput.js iconMap
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
  const {control, handleSubmit} = useForm();

  const onSubmit = data => {
    console.log(data);
    navigation.navigate('Skills');
  };

  const renderEmployerSection = (index) => (
    <View key={index} style={styles.employerSection}>
      <Text style={styles.employerTitle}>Previous Employer {index + 1}</Text>
      {employerFields.map(field => (
        <Controller
          key={`employer${index}-${field.name}`}
          control={control}
          name={`employers[${index}].${field.name}`}
          render={({field: {onChange, value}}) => (
            <FormInput
              label={field.label}
              value={value}
              onChangeText={onChange}
              icon={field.icon}
              keyboardType={field.keyboardType}
              placeholder={field.placeholder}
            />
          )}
        />
      ))}
    </View>
  );

  return (
      <ScrollView style={styles.container}>
          <ProgressBar step={3} totalSteps={8} />
      <Text style={styles.headerText}>Professional Information</Text>

      {professionalFields.map(({section, fields}) => (
        <View key={section} style={styles.section}>
          <Text style={styles.sectionTitle}>{section}</Text>
          {fields.map(field => (
            <Controller
              key={field.name}
              control={control}
              name={field.name}
              render={({field: {onChange, value}}) => (
                <FormInput
                  label={field.label}
                  value={value}
                  onChangeText={onChange}
                  icon={field.icon}
                  keyboardType={field.keyboardType}
                  placeholder={field.placeholder}
                />
              )}
            />
          ))}
        </View>
      ))}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Previous Employment</Text>
        <Text style={styles.sectionSubtitle}>
          Add your previous work experience and references
        </Text>
        {[0, 1].map(index => renderEmployerSection(index))}
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
    fontFamily: 'Poppins-SemiBold',
    color: BRAND_COLORS.blue,
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
    borderColor: '#F1F5F9',
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-Medium',
    color: BRAND_COLORS.green,
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: BRAND_COLORS.gray,
    marginBottom: 20,
  },
  employerSection: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  employerTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: BRAND_COLORS.blue,
    marginBottom: 15,
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