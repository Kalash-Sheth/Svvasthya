import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import {Button, Text} from 'react-native-paper';
import {useForm, Controller} from 'react-hook-form';
import {launchImageLibrary} from 'react-native-image-picker';
import FormInput from '../../components/FormInput';
import {FileText, Upload} from 'lucide-react-native';
import ProgressBar from '../../components/ProgressBar';
import { BRAND_COLORS } from '../../styles/colors';

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
    const result = await launchImageLibrary({
      mediaType: 'mixed',
      quality: 0.8,
      selectionLimit: 1,
    });
    if (!result.didCancel && result.assets?.[0]?.uri) {
      setDocuments(prev => ({...prev, [type]: result.assets[0]}));
    }
  };

  const onSubmit = data => {
    console.log({...data, documents});
    navigation.navigate('ProfessionalInfo');
  };

  const renderUploadButton = (type, title) => (
    <TouchableOpacity
      style={styles.uploadButton}
      onPress={() => pickDocument(type)}>
      <View style={styles.uploadContent}>
        {documents[type] ? (
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
            <Text style={styles.uploadText}>{title}</Text>
            <Text style={styles.uploadSubText}>Tap to upload</Text>
          </>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <ProgressBar step={2} totalSteps={8} />
      <Text style={styles.headerText}>Document Verification</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Government ID Proof</Text>
        <Text style={styles.sectionSubtitle}>
          Please provide all three documents to proceed
        </Text>

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
        <Text style={styles.sectionTitle}>Passport Size Photo</Text>
        <Text style={styles.sectionSubtitle}>
          Upload a recent passport size photograph
        </Text>
        {renderUploadButton('photo', 'Upload Passport Photo')}
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
});
