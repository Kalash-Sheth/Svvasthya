import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import * as Paper from 'react-native-paper';
import {useForm, Controller} from 'react-hook-form';
import {launchImageLibrary} from 'react-native-image-picker';
import DocumentPicker from 'react-native-document-picker';
import FormInput from '../../components/FormInput';
import ProgressBar from '../../components/ProgressBar';
import BRAND_COLORS from '../../styles/colors';
import axios from 'axios';
import {API_URL} from '../../config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const documents = [
  {
    title: 'Government ID Proof',
    fields: [
      {
        name: 'aadharNumber',
        label: 'Aadhaar Number',
        icon: 'card-account-details',
        keyboardType: 'numeric',
      },
      {
        name: 'panNumber',
        label: 'PAN Number',
        icon: 'card-account-details',
      },
      {
        name: 'drivingLicense',
        label: 'Driving License Number',
        icon: 'card-account-details',
      },
    ],
  },
];

export default function DocumentScreen({navigation}) {
  const {control, handleSubmit} = useForm();
  const [documents, setDocuments] = useState({
    aadhar: null,
    pan: null,
    license: null,
    photo: null,
  });

  const pickDocument = async type => {
    try {
      Alert.alert(
        'Choose Upload Type',
        'Select how you want to upload your document',
        [
          {
            text: 'Take Photo',
            onPress: () => pickImage(type),
          },
          {
            text: 'Choose PDF',
            onPress: () => pickPDF(type),
          },
          {
            text: 'Cancel',
            style: 'cancel',
          },
        ],
      );
    } catch (err) {
      console.error('Error picking document:', err);
      Alert.alert('Error', 'Failed to pick document');
    }
  };

  const pickImage = async type => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        quality: 0.8,
      });

      if (!result.didCancel && result.assets?.[0]) {
        setDocuments(prev => ({
          ...prev,
          [type]: {
            uri: result.assets[0].uri,
            type: 'image/jpeg',
            name: result.assets[0].fileName || `${type}.jpg`,
          },
        }));
      }
    } catch (err) {
      console.error('Error picking image:', err);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const pickPDF = async type => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf],
      });

      setDocuments(prev => ({
        ...prev,
        [type]: {
          uri: result[0].uri,
          type: result[0].type,
          name: result[0].name,
        },
      }));
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        return;
      }
      console.error('Error picking PDF:', err);
      Alert.alert('Error', 'Failed to pick PDF');
    }
  };

  const onSubmit = async data => {
    try {
      // Validate required documents
      if (!documents.aadhar || !documents.pan || !documents.license) {
        Alert.alert('Error', 'Please upload all required documents');
        return;
      }

      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Error', 'Authentication token not found');
        return;
      }

      // Create FormData object
      const formData = new FormData();

      // Helper function to append document with correct type
      const appendDocument = (fieldName, document) => {
        if (document) {
          formData.append(fieldName, {
            uri: document.uri,
            type: document.type,
            name:
              document.name ||
              `${fieldName}.${document.type.includes('pdf') ? 'pdf' : 'jpg'}`,
          });
        }
      };

      // Append documents with proper type checking
      appendDocument('aadhaarPhoto', documents.aadhar);
      appendDocument('panPhoto', documents.pan);
      appendDocument('drivingLicensePhoto', documents.license);
      appendDocument('passportPhoto', documents.photo);

      // Append document numbers
      formData.append('aadhaarNumber', data.aadharNumber);
      formData.append('panNumber', data.panNumber);
      formData.append('drivingLicenseNumber', data.drivingLicense);

      console.log('Sending documents:', {
        aadhaar: documents.aadhar?.type,
        pan: documents.pan?.type,
        license: documents.license?.type,
        photo: documents.photo?.type,
      });

      const response = await axios.post(
        `${API_URL}/api/attendant/onboarding/document-info`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      if (response.data.success) {
        navigation.navigate('ProfessionalInfo');
      } else {
        Alert.alert(
          'Error',
          response.data.message || 'Failed to save documents',
        );
      }
    } catch (error) {
      console.error('Error saving documents:', error);
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to save document information',
      );
    }
  };

  const renderUploadButton = (type, title) => (
    <TouchableOpacity
      style={styles.uploadButton}
      onPress={() => pickDocument(type)}>
      <View style={styles.uploadContent}>
        {documents[type] ? (
          <>
            <Paper.Text style={styles.uploadedText}>
              {documents[type].type.includes('pdf') ? 'PDF' : 'Image'} Uploaded
            </Paper.Text>
            <Paper.Text style={styles.uploadedSubText}>
              {documents[type].name}
            </Paper.Text>
            <Paper.Text style={styles.changeText}>Tap to change</Paper.Text>
          </>
        ) : (
          <>
            <Paper.Text style={styles.uploadText}>{title}</Paper.Text>
            <Paper.Text style={styles.uploadSubText}>
              Tap to upload Image/PDF
            </Paper.Text>
          </>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <ProgressBar step={2} totalSteps={8} />
      <Paper.Text style={styles.headerText}>Document Verification</Paper.Text>

      <View style={styles.section}>
        <Paper.Text style={styles.sectionTitle}>Government ID Proof</Paper.Text>
        <Paper.Text style={styles.sectionSubtitle}>
          Please provide all three documents to proceed
        </Paper.Text>

        <Controller
          control={control}
          name="aadharNumber"
          render={({field: {onChange, value}}) => (
            <FormInput
              label="Aadhaar Number"
              value={value}
              onChangeText={onChange}
              icon="card-account-details"
              keyboardType="numeric"
            />
          )}
        />
        {renderUploadButton('aadhar', 'Upload Aadhaar Card')}

        <Controller
          control={control}
          name="panNumber"
          render={({field: {onChange, value}}) => (
            <FormInput
              label="PAN Number"
              value={value}
              onChangeText={onChange}
              icon="card-account-details"
            />
          )}
        />
        {renderUploadButton('pan', 'Upload PAN Card')}

        <Controller
          control={control}
          name="drivingLicense"
          render={({field: {onChange, value}}) => (
            <FormInput
              label="Driving License Number"
              value={value}
              onChangeText={onChange}
              icon="card-account-details"
            />
          )}
        />
        {renderUploadButton('license', 'Upload Driving License')}
      </View>

      <View style={styles.section}>
        <Paper.Text style={styles.sectionTitle}>Passport Size Photo</Paper.Text>
        <Paper.Text style={styles.sectionSubtitle}>
          Upload a recent passport size photograph
        </Paper.Text>
        {renderUploadButton('photo', 'Upload Passport Photo')}
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
    marginBottom: 20,
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
  uploadedSubText: {
    fontFamily: 'Poppins-Regular',
    color: BRAND_COLORS.textSecondary,
    fontSize: 12,
    marginBottom: 4,
    textAlign: 'center',
  },
});