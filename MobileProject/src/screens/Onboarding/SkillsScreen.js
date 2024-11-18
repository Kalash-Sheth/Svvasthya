import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import * as Paper from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import FormInput from '../../components/FormInput';
import { launchImageLibrary } from 'react-native-image-picker';
import { FileText, Upload } from 'lucide-react-native';
import ProgressBar from '../../components/ProgressBar';
import BRAND_COLORS from '../../styles/colors';
import axios from 'axios';
import { API_URL } from '../../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DocumentPicker from 'react-native-document-picker';

const predefinedSkills = [
  'Patient Care',
  'Wound Management',
  'Medication Administration',
  'Vital Signs Monitoring',
  'Emergency Response',
  'Basic Life Support',
  'CPR Certified',
  'First Aid',
  'Elderly Care',
  'Pediatric Care',
  'Post-Operative Care',
  'Physical Therapy',
  'Rehabilitation',
  'Medical Equipment',
  'Record Keeping',
];

const languages = [
  'English',
  'Hindi',
  'Gujarati',
];

export default function SkillsScreen({ navigation }) {
  const { control, handleSubmit } = useForm();
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [customSkills, setCustomSkills] = useState('');

  const handleSkillSelect = skill => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(prev => prev.filter(s => s !== skill));
    } else {
      setSelectedSkills(prev => [...prev, skill]);
    }
  };

  const handleLanguageSelect = language => {
    if (selectedLanguages.includes(language)) {
      setSelectedLanguages(prev => prev.filter(l => l !== language));
    } else {
      setSelectedLanguages(prev => [...prev, language]);
    }
  };

  const pickCertificate = async () => {
    try {
      Alert.alert(
        'Choose Upload Type',
        'Select how you want to upload your certificate',
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
      console.error('Error picking certificate:', error);
      Alert.alert('Error', 'Failed to pick certificate');
    }
  };

  const pickImage = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        quality: 0.8,
      });

      if (!result.didCancel && result.assets?.[0]) {
        const newCertificate = {
          uri: result.assets[0].uri,
          type: 'image/jpeg',
          name: result.assets[0].fileName || 'certificate.jpg',
        };
        setCertificates(prev => [...prev, newCertificate]);
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

      const newCertificate = {
        uri: result[0].uri,
        type: result[0].type,
        name: result[0].name,
      };
      setCertificates(prev => [...prev, newCertificate]);
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
      if (selectedSkills.length === 0 && !customSkills) {
        Alert.alert('Error', 'Please select at least one skill');
        return;
      }

      if (selectedLanguages.length === 0) {
        Alert.alert('Error', 'Please select at least one language');
        return;
      }

      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Error', 'Authentication token not found');
        return;
      }

      // Create FormData for file uploads
      const formData = new FormData();

      // Add skills and languages
      formData.append('selectedSkills', JSON.stringify(selectedSkills));
      formData.append('customSkills', customSkills || '');
      formData.append('selectedLanguages', JSON.stringify(selectedLanguages));

      // Add certificates with their details
      certificates.forEach((cert, index) => {
        formData.append(`certificate[${index}]`, {
          uri: cert.uri,
          type: cert.type || 'application/pdf',
          name: cert.name || `certificate-${index}.${cert.type.includes('pdf') ? 'pdf' : 'jpg'}`
        });
      });

      // Add certificate details separately
      const certificateDetails = certificates.map((cert, index) => ({
        name: data[`certificates[${index}].name`] || cert.name || 'Untitled Certificate',
        authority: data[`certificates[${index}].authority`] || 'Unknown Authority'
      }));
      
      formData.append('certificateDetails', JSON.stringify(certificateDetails));

      console.log('Sending data:', {
        selectedSkills,
        customSkills,
        selectedLanguages,
        certificates: certificates.map(c => ({
          type: c.type,
          name: c.name
        }))
      });

      const response = await axios.post(
        `${API_URL}/api/attendant/onboarding/skills`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      if (response.data.success) {
        navigation.navigate('Availability');
      } else {
        Alert.alert(
          'Error',
          response.data.message || 'Failed to save skills information',
        );
      }
    } catch (error) {
      console.error('Error saving skills:', error);
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to save skills information',
      );
    }
  };

  const renderUploadButton = (title, onPress) => (
    <TouchableOpacity style={styles.uploadButton} onPress={onPress}>
      <View style={styles.uploadContent}>
        <Upload size={24} color={BRAND_COLORS.blue} style={styles.uploadIcon} />
        <Paper.Text style={styles.uploadText}>{title}</Paper.Text>
        <Paper.Text style={styles.uploadSubText}>Tap to upload</Paper.Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <ProgressBar step={4} totalSteps={8} />
      <Paper.Text style={styles.headerText}>Professional Skills</Paper.Text>

      <View style={styles.section}>
        <Paper.Text style={styles.sectionTitle}>Skills</Paper.Text>
        <Paper.Text style={styles.sectionSubtitle}>
          Select all relevant skills or add custom ones
        </Paper.Text>

        <Controller
          control={control}
          name="customSkills"
          render={({ field: { onChange, value } }) => (
            <FormInput
              label="Add Custom Skills"
              value={value}
              onChangeText={onChange}
              icon="star"
              placeholder="Type and separate with commas"
            />
          )}
        />

        <View style={styles.chipContainer}>
          {predefinedSkills.map(skill => (
            <Paper.Chip
              key={skill}
              // selected={selectedSkills.includes(skill)}
              onPress={() => handleSkillSelect(skill)}
              style={[
                styles.chip,
                selectedSkills.includes(skill) && styles.selectedChip,
              ]}
              textStyle={[
                styles.chipText,
                selectedSkills.includes(skill) && styles.selectedChipText,
              ]}>
              {skill}
            </Paper.Chip>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Paper.Text style={styles.sectionTitle}>Certifications</Paper.Text>
        <Paper.Text style={styles.sectionSubtitle}>
          Add your professional certificates
        </Paper.Text>

        {certificates.map((cert, index) => (
          <View key={index} style={styles.certificateContainer}>
            <FileText 
              size={24} 
              color={cert.type.includes('pdf') ? BRAND_COLORS.primary : BRAND_COLORS.green} 
            />
            <Paper.Text style={styles.certificateType}>
              {cert.type.includes('pdf') ? 'PDF Document' : 'Image'}
            </Paper.Text>
            <Paper.Text style={styles.certificateName}>{cert.name}</Paper.Text>
            <Controller
              control={control}
              name={`certificates[${index}].name`}
              defaultValue={cert.name}
              render={({field: {onChange, value}}) => (
                <FormInput
                  label="Certificate Name"
                  value={value}
                  onChangeText={onChange}
                  placeholder="e.g., BLS Certification"
                />
              )}
            />
            <Controller
              control={control}
              name={`certificates[${index}].authority`}
              defaultValue={cert.authority}
              render={({field: {onChange, value}}) => (
                <FormInput
                  label="Issuing Authority"
                  value={value}
                  onChangeText={onChange}
                  placeholder="e.g., Red Cross"
                />
              )}
            />
            <Paper.Button 
              onPress={() => {
                setCertificates(prev => prev.filter((_, i) => i !== index));
              }} 
              mode="text" 
              compact
            >
              Remove
            </Paper.Button>
          </View>
        ))}
        {renderUploadButton('Add More Certificates', pickCertificate)}
      </View>

      <View style={styles.section}>
        <Paper.Text style={styles.sectionTitle}>Languages</Paper.Text>
        <Paper.Text style={styles.sectionSubtitle}>
          Select languages you can communicate in
        </Paper.Text>

        <View style={styles.chipContainer}>
          {languages.map(language => (
            <Paper.Chip
              key={language}
              // selected={selectedLanguages.includes(language)}
              onPress={() => handleLanguageSelect(language)}
              style={[
                styles.chip,
                selectedLanguages.includes(language) && styles.selectedChip,
              ]}
              textStyle={[
                styles.chipText,
                selectedLanguages.includes(language) && styles.selectedChipText,
              ]}>
              {language}
            </Paper.Chip>
          ))}
        </View>
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
    textShadowOffset: { width: 1, height: 1 },
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
    fontWeight: '900',
    fontFamily: 'Poppins-Bold',
    color: BRAND_COLORS.textPrimary,
    marginBottom: 16,
  },
  sectionSubtitle: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: BRAND_COLORS.textSecondary,
    marginBottom: 20,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 15,
  },
  chip: {
    backgroundColor: BRAND_COLORS.background,
    marginBottom: 8,
  },
  selectedChip: {
    backgroundColor: BRAND_COLORS.background,
  },
  chipText: {
    fontWeight: '600',
    fontFamily: 'Poppins-Medium',
    color: BRAND_COLORS.textSecondary,
  },
  selectedChipText: {
    fontWeight: '700',
    fontFamily: 'Poppins-Bold',
    color: BRAND_COLORS.primary,
  },
  certificateContainer: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: BRAND_COLORS.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BRAND_COLORS.border,
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
    fontFamily: 'Poppins-Medium',
    color: BRAND_COLORS.textPrimary,
    fontSize: 16,
    marginBottom: 4,
  },
  uploadSubText: {
    fontFamily: 'Poppins-Regular',
    color: BRAND_COLORS.textSecondary,
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
