import React, {useState} from 'react';
import {View, ScrollView, StyleSheet, Alert} from 'react-native';
import {Button, Checkbox, Text} from 'react-native-paper';
import {FileText, Shield, Search} from 'lucide-react-native';
import ProgressBar from '../../components/ProgressBar';
import BRAND_COLORS  from '../../styles/colors';
import axios from 'axios';
import { API_URL } from '../../config/api';
import { ATTENDANT_ID } from '../../config/attendant';

export default function AgreementScreen({navigation}) {
  const [agreements, setAgreements] = useState({
    terms: false,
    privacy: false,
    background: false,
  });

  const handleNext = async () => {
    if (!Object.values(agreements).every(value => value)) {
      Alert.alert('Error', 'Please accept all agreements to proceed.');
      return;
    }

    try {
      const response = await axios.post(
        `${API_URL}/api/attendant/onboarding/agreements/${ATTENDANT_ID}`,
        {
          termsAndConditions: agreements.terms,
          privacyPolicy: agreements.privacy,
          backgroundCheckAuthorization: agreements.background
        }
      );

      if (response.data.success) {
        navigation.navigate('Confirmation');
      } else {
        Alert.alert('Error', response.data.message || 'Failed to save agreements');
      }
    } catch (error) {
      console.error('Error saving agreements:', error);
      Alert.alert('Error', 'Failed to save agreements');
    }
  };

  const toggleAgreement = type => {
    setAgreements(prev => ({...prev, [type]: !prev[type]}));
  };

  const renderAgreementSection = (title, subtitle, type, icon) => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        {icon}
        <View style={styles.sectionTitleContainer}>
          <Text style={styles.sectionTitle}>{title}</Text>
          <Text style={styles.sectionSubtitle}>{subtitle}</Text>
        </View>
      </View>

      <View style={styles.agreementContent}>
        <Text style={styles.agreementText}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris.
        </Text>

        <View style={styles.checkboxContainer}>
          <View style={styles.checkboxWrapper}>
            <Checkbox.Android
              status={agreements[type] ? 'checked' : 'unchecked'}
              onPress={() => toggleAgreement(type)}
              color={BRAND_COLORS.primary}
              uncheckedColor="#94A3B8"
            />
          </View>
          <Text style={styles.checkboxLabel}>I agree to the {title}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <ProgressBar step={8} totalSteps={8} />
      <Text style={styles.headerText}>Agreements & Consent</Text>

      {renderAgreementSection(
        'Terms and Conditions',
        'Please read and accept our terms of service',
        'terms',
        <FileText size={24} color={BRAND_COLORS.textPrimary} />,
      )}

      {renderAgreementSection(
        'Privacy Policy',
        'How we handle your personal information',
        'privacy',
        <Shield size={24} color={BRAND_COLORS.secondary} />,
      )}

      {renderAgreementSection(
        'Background Check Authorization',
        'Consent for verification process',
        'background',
        <Search size={24} color={BRAND_COLORS.primary} />,
      )}

      <Button
        mode="contained"
        onPress={handleNext}
        style={styles.button}
        contentStyle={styles.buttonContent}
        labelStyle={styles.buttonText}
        disabled={!Object.values(agreements).every(value => value)}>
        Complete Registration
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
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitleContainer: {
    marginLeft: 12,
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    fontWeight: '700',
    color: BRAND_COLORS.secondary,
    marginBottom: 2,
  },
  sectionSubtitle: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: BRAND_COLORS.textSecondary,
  },
  agreementContent: {
    backgroundColor: BRAND_COLORS.background,
    borderRadius: 12,
    padding: 15,
  },
  agreementText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: BRAND_COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: 15,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: BRAND_COLORS.border,
    paddingTop: 15,
  },
  checkboxWrapper: {
    marginLeft: -10,
    marginRight: -4,
  },
  checkboxLabel: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: BRAND_COLORS.textPrimary,
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
