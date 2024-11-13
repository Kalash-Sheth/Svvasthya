import React, {useState} from 'react';
import {View, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import {Button, Text} from 'react-native-paper';
import {useForm, Controller} from 'react-hook-form';
import FormInput from '../../components/FormInput';
import {launchImageLibrary} from 'react-native-image-picker';
import {FileText, Upload} from 'lucide-react-native';
import ProgressBar from '../../components/ProgressBar';
import { BRAND_COLORS } from '../../styles/colors';
import axios from 'axios';
import { API_URL } from '../../config/api';
import { Alert } from 'react-native';

export default function BankingInfoScreen({navigation}) {
  const {control, handleSubmit} = useForm();
  const [cancelledCheque, setCancelledCheque] = useState(null);

  const pickDocument = async () => {
    const result = await launchImageLibrary({
      mediaType: 'mixed',
      quality: 0.8,
      selectionLimit: 1,
    });
    if (!result.didCancel && result.assets?.[0]?.uri) {
      setCancelledCheque(result.assets[0]);
    }
  };

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/attendant/onboarding/banking-info/${attendantId}`,
        {
          accountHolderName: data.accountHolderName,
          bankName: data.bankName,
          accountNumber: data.accountNumber,
          ifscCode: data.ifscCode,
          upiId: data.upiId,
          cancelledChequePhoto: cancelledCheque?.uri
        }
      );

      if (response.data.success) {
        navigation.navigate('Agreements');
      } else {
        Alert.alert('Error', response.data.message || 'Failed to save banking information');
      }
    } catch (error) {
      console.error('Error saving banking info:', error);
      Alert.alert('Error', 'Failed to save banking information');
    }
  };

  const renderUploadButton = () => (
    <TouchableOpacity style={styles.uploadButton} onPress={pickDocument}>
      <View style={styles.uploadContent}>
        {cancelledCheque ? (
          <>
            <FileText
              size={24}
              color={BRAND_COLORS.primary}
              style={styles.uploadIcon}
            />
            <Text style={styles.uploadedText}>Document Uploaded</Text>
            <Text style={styles.changeText}>Tap to change</Text>
          </>
        ) : (
          <>
            <Upload
              size={24}
              color={BRAND_COLORS.textPrimary}
              style={styles.uploadIcon}
            />
            <Text style={styles.uploadText}>Upload Cancelled Cheque</Text>
            <Text style={styles.uploadSubText}>Tap to upload Image/PDF</Text>
          </>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <ProgressBar step={7} totalSteps={8} />
      <Text style={styles.headerText}>Banking Information</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Bank Account Details</Text>
        <Text style={styles.sectionSubtitle}>
          Please provide your bank account details for salary payments
        </Text>

        <Controller
          control={control}
          name="accountHolderName"
          render={({field: {onChange, value}}) => (
            <FormInput
              label="Account Holder Name"
              value={value}
              onChangeText={onChange}
              icon="user"
              placeholder="As per bank records"
            />
          )}
        />

        <Controller
          control={control}
          name="bankName"
          render={({field: {onChange, value}}) => (
            <FormInput
              label="Bank Name"
              value={value}
              onChangeText={onChange}
              icon="building"
              placeholder="e.g., State Bank of India"
            />
          )}
        />

        <Controller
          control={control}
          name="accountNumber"
          render={({field: {onChange, value}}) => (
            <FormInput
              label="Account Number"
              value={value}
              onChangeText={onChange}
              icon="credit-card"
              keyboardType="number-pad"
              placeholder="Enter your account number"
            />
          )}
        />

        <Controller
          control={control}
          name="ifscCode"
          render={({field: {onChange, value}}) => (
            <FormInput
              label="IFSC Code"
              value={value}
              onChangeText={onChange}
              icon="code"
              placeholder="e.g., SBIN0001234"
              autoCapitalize="characters"
            />
          )}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Additional Payment Details</Text>
        <Text style={styles.sectionSubtitle}>Optional information</Text>

        <Controller
          control={control}
          name="upiId"
          render={({field: {onChange, value}}) => (
            <FormInput
              label="UPI ID (Optional)"
              value={value}
              onChangeText={onChange}
              icon="smartphone"
              placeholder="e.g., mobile@upi"
            />
          )}
        />

        {renderUploadButton()}
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
  uploadButton: {
    backgroundColor: BRAND_COLORS.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BRAND_COLORS.border,
    borderStyle: 'dashed',
    padding: 15,
    marginTop: 10,
  },
  uploadContent: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
  },
  uploadIcon: {
    marginBottom: 8,
  },
  uploadText: {
    fontFamily: 'Poppins-Bold',
    fontWeight: '700',
    color: BRAND_COLORS.textPrimary,
    fontSize: 16,
    marginBottom: 4,
  },
  uploadSubText: {
    fontFamily: 'Poppins-Regular',
    color: BRAND_COLORS.textSecondary,
    fontSize: 13,
  },
  uploadedText: {
    fontFamily: 'Poppins-Bold',
    fontWeight: '700',
    color: BRAND_COLORS.secondary,
    fontSize: 16,
    marginBottom: 4,
  },
  changeText: {
    fontFamily: 'Poppins-Regular',
    color: BRAND_COLORS.primary,
    fontSize: 13,
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
