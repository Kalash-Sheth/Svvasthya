import React from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import {Button, Text} from 'react-native-paper';
import {useForm, Controller} from 'react-hook-form';
import FormInput from '../../components/FormInput';
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

export default function MedicalInfoScreen({navigation}) {
  const {control, handleSubmit} = useForm();

  const onSubmit = data => {
    console.log(data);
    navigation.navigate('BankingInfo');
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
