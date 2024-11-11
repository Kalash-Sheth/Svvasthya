import React, {useState} from 'react';
import {View, ScrollView, StyleSheet} from 'react-native';
import {Button, Checkbox, Text} from 'react-native-paper';
import {FileText, Shield, Search} from 'lucide-react-native';
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

export default function AgreementScreen({navigation}) {
  const [agreements, setAgreements] = useState({
    terms: false,
    privacy: false,
    background: false,
  });

  const handleNext = () => {
    if (Object.values(agreements).every(value => value)) {
      navigation.navigate('Confirmation');
    } else {
      alert('Please accept all agreements to proceed.');
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
              color={BRAND_COLORS.orange}
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
        <FileText size={24} color={BRAND_COLORS.blue} />,
      )}

      {renderAgreementSection(
        'Privacy Policy',
        'How we handle your personal information',
        'privacy',
        <Shield size={24} color={BRAND_COLORS.green} />,
      )}

      {renderAgreementSection(
        'Background Check Authorization',
        'Consent for verification process',
        'background',
        <Search size={24} color={BRAND_COLORS.orange} />,
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
    fontFamily: 'Poppins-Medium',
    color: '#1E293B',
    marginBottom: 2,
  },
  sectionSubtitle: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: BRAND_COLORS.gray,
  },
  agreementContent: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 15,
  },
  agreementText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#475569',
    lineHeight: 20,
    marginBottom: 15,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 15,
  },
  checkboxWrapper: {
    marginLeft: -10,
    marginRight: -4,
  },
  checkboxLabel: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#334155',
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
