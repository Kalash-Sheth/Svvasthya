import React, {useState} from 'react';
import {View, StyleSheet, ScrollView, TouchableOpacity, Alert} from 'react-native';
import * as Paper from 'react-native-paper';
import {useForm, Controller} from 'react-hook-form';
import FormInput from '../../components/FormInput';
import {launchImageLibrary} from 'react-native-image-picker';
import DocumentPicker from 'react-native-document-picker';
// import {FileText, Upload} from 'lucide-react-native';
import ProgressBar from '../../components/ProgressBar';
import BRAND_COLORS from '../../styles/colors';
import axios from 'axios';
import {API_URL} from '../../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';

const validationSchema = yup.object().shape({
  accountHolderName: yup.string().required('Account holder name is required'),
  bankName: yup.string().required('Bank name is required'),
  accountNumber: yup
    .string()
    .required('Account number is required')
    .min(9, 'Account number must be at least 9 digits')
    .max(18, 'Account number cannot exceed 18 digits'),
  ifscCode: yup
    .string()
    .required('IFSC code is required')
    .matches(/^[A-Z]{4}0[A-Z0-9]{6}$/, 'Please enter a valid IFSC code'),
  upiId: yup
    .string()
    .matches(/^[\w.-]+@[\w.-]+$/, 'Please enter a valid UPI ID')
    .nullable(),
});

export default function BankingInfoScreen({navigation}) {
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    resolver: yupResolver(validationSchema),
  });
  const [cancelledCheque, setCancelledCheque] = useState(null);

  const pickDocument = async () => {
    try {
      Alert.alert(
        'Choose Upload Type',
        'Select how you want to upload your cancelled cheque',
        [
          {
            text: 'Take Photo',
            onPress: () => pickImage(),
          },
          {
            text: 'Choose PDF',
            onPress: () => pickPDF(),
          },
          {
            text: 'Cancel',
            style: 'cancel',
          },
        ],
      );
    } catch (error) {
      console.error('Error picking document:', error);
      Alert.alert('Error', 'Failed to pick document');
    }
  };

  const pickImage = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        quality: 0.8,
      });

      if (!result.didCancel && result.assets?.[0]) {
        setCancelledCheque({
          uri: result.assets[0].uri,
          type: 'image/jpeg',
          name: result.assets[0].fileName || 'cancelled-cheque.jpg',
        });
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const pickPDF = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf],
      });

      setCancelledCheque({
        uri: result[0].uri,
        type: result[0].type,
        name: result[0].name,
      });
    } catch (error) {
      if (DocumentPicker.isCancel(error)) {
        return;
      }
      console.error('Error picking PDF:', error);
      Alert.alert('Error', 'Failed to pick PDF');
    }
  };

  const onSubmit = async data => {
    try {
      if (!cancelledCheque) {
        Alert.alert('Error', 'Please upload cancelled cheque');
        return;
      }

      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        Alert.alert('Error', 'Authentication token not found');
        return;
      }

      const formData = new FormData();
      formData.append('accountHolderName', data.accountHolderName);
      formData.append('bankName', data.bankName);
      formData.append('accountNumber', data.accountNumber);
      formData.append('ifscCode', data.ifscCode);
      formData.append('upiId', data.upiId || '');

      formData.append('cancelledCheque', {
        uri: cancelledCheque.uri,
        type: cancelledCheque.type,
        name: cancelledCheque.name,
      });

      const response = await axios.post(
        `${API_URL}/api/attendant/onboarding/banking-info`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      if (response.data.success) {
        navigation.navigate('Agreements');
      } else {
        Alert.alert(
          'Error',
          response.data.message || 'Failed to save banking information',
        );
      }
    } catch (error) {
      console.error('Error saving banking info:', error);
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to save banking information',
      );
    }
  };

  const renderUploadButton = () => (
    <TouchableOpacity style={styles.uploadButton} onPress={pickDocument}>
      <View style={styles.uploadContent}>
        {cancelledCheque ? (
          <>
            {/* <FileText
              size={24}
              color={BRAND_COLORS.primary}
              style={styles.uploadIcon}
            /> */}
            <Paper.Text style={styles.uploadedText}>Document Uploaded</Paper.Text>
            <Paper.Text style={styles.changeText}>Tap to change</Paper.Text>
          </>
        ) : (
          <>
            {/* <Upload
              size={24}
              color={BRAND_COLORS.textPrimary}
              style={styles.uploadIcon}
            /> */}
            <Paper.Text style={styles.uploadText}>Upload Cancelled Cheque</Paper.Text>
            <Paper.Text style={styles.uploadSubText}>Tap to upload Image/PDF</Paper.Text>
          </>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <ProgressBar step={7} totalSteps={8} />
      <Paper.Text style={styles.headerText}>Banking Information</Paper.Text>

      <View style={styles.section}>
        <Paper.Text style={styles.sectionTitle}>Bank Account Details</Paper.Text>
        <Paper.Text style={styles.sectionSubtitle}>
          Please provide your bank account details for salary payments
        </Paper.Text>

        <Controller
          control={control}
          name="accountHolderName"
          render={({field: {onChange, value}}) => (
            <View>
              <FormInput
                label="Account Holder Name"
                value={value}
                onChangeText={onChange}
                icon="user"
                placeholder="As per bank records"
                error={errors.accountHolderName?.message}
              />
              {errors.accountHolderName && (
                <Paper.Text style={styles.errorText}>
                  {errors.accountHolderName.message}
                </Paper.Text>
              )}
            </View>
          )}
        />

        <Controller
          control={control}
          name="bankName"
          render={({field: {onChange, value}}) => (
            <View>
              <FormInput
                label="Bank Name"
                value={value}
                onChangeText={onChange}
                icon="building"
                placeholder="e.g., State Bank of India"
                error={errors.bankName?.message}
              />
              {errors.bankName && (
                <Paper.Text style={styles.errorText}>
                  {errors.bankName.message}
                </Paper.Text>
              )}
            </View>
          )}
        />

        <Controller
          control={control}
          name="accountNumber"
          render={({field: {onChange, value}}) => (
            <View>
              <FormInput
                label="Account Number"
                value={value}
                onChangeText={onChange}
                icon="credit-card"
                keyboardType="number-pad"
                placeholder="Enter your account number"
                error={errors.accountNumber?.message}
              />
              {errors.accountNumber && (
                <Paper.Text style={styles.errorText}>
                  {errors.accountNumber.message}
                </Paper.Text>
              )}
            </View>
          )}
        />

        <Controller
          control={control}
          name="ifscCode"
          render={({field: {onChange, value}}) => (
            <View>
              <FormInput
                label="IFSC Code"
                value={value}
                onChangeText={onChange}
                icon="code"
                placeholder="e.g., SBIN0001234"
                autoCapitalize="characters"
                error={errors.ifscCode?.message}
              />
              {errors.ifscCode && (
                <Paper.Text style={styles.errorText}>
                  {errors.ifscCode.message}
                </Paper.Text>
              )}
            </View>
          )}
        />
      </View>

      <View style={styles.section}>
        <Paper.Text style={styles.sectionTitle}>Additional Payment Details</Paper.Text>
        <Paper.Text style={styles.sectionSubtitle}>Optional information</Paper.Text>

        <Controller
          control={control}
          name="upiId"
          render={({field: {onChange, value}}) => (
            <View>
              <FormInput
                label="UPI ID (Optional)"
                value={value}
                onChangeText={onChange}
                icon="smartphone"
                placeholder="e.g., mobile@upi"
                error={errors.upiId?.message}
              />
              {errors.upiId && (
                <Paper.Text style={styles.errorText}>
                  {errors.upiId.message}
                </Paper.Text>
              )}
            </View>
          )}
        />

        {renderUploadButton()}
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
  errorText: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: BRAND_COLORS.error,
    marginTop: 4,
    marginLeft: 8,
  },
});