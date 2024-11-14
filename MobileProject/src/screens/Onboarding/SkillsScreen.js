import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { TextInput, Button, Chip, Text } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import FormInput from '../../components/FormInput';
import { launchImageLibrary } from 'react-native-image-picker';
import { FileText, Upload } from 'lucide-react-native';
import ProgressBar from '../../components/ProgressBar';
import  BRAND_COLORS  from '../../styles/colors';

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
  const { control, handleSubmit, setValue } = useForm();
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [certificates, setCertificates] = useState([]);

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
    const result = await launchImageLibrary({
      mediaType: 'mixed',
      quality: 0.8,
      selectionLimit: 5, // Allow multiple files
    });

    if (!result.didCancel && result.assets) {
      const newCertificates = result.assets.map(asset => ({
        uri: asset.uri,
        name: '',
        authority: '',
      }));
      setCertificates(prev => [...prev, ...newCertificates]);
    }
  };

  const removeCertificate = index => {
    setCertificates(prev => prev.filter((_, i) => i !== index));
  };


  const onSubmit = data => {
    console.log({
      ...data,
      selectedSkills,
      selectedLanguages,
      certificates,
    });
    navigation.navigate('Availability');
  };

  const renderUploadButton = (title, onPress) => (
    <TouchableOpacity style={styles.uploadButton} onPress={onPress}>
      <View style={styles.uploadContent}>
        <Upload size={24} color={BRAND_COLORS.blue} style={styles.uploadIcon} />
        <Text style={styles.uploadText}>{title}</Text>
        <Text style={styles.uploadSubText}>Tap to upload</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <ProgressBar step={4} totalSteps={8} />
      <Text style={styles.headerText}>Professional Skills</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Skills</Text>
        <Text style={styles.sectionSubtitle}>
          Select all relevant skills or add custom ones
        </Text>

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
            <Chip
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
            </Chip>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Certifications</Text>
        <Text style={styles.sectionSubtitle}>Add your professional certificates</Text>

        {certificates.map((cert, index) => (
          <View key={index} style={styles.certificateContainer}>
            <FileText size={24} color={BRAND_COLORS.green} />
            <Controller
              control={control}
              name={`certificates[${index}].name`}
              defaultValue={cert.name}
              render={({ field: { onChange, value } }) => (
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
              render={({ field: { onChange, value } }) => (
                <FormInput
                  label="Issuing Authority"
                  value={value}
                  onChangeText={onChange}
                  placeholder="e.g., Red Cross"
                />
              )}
            />
            <Button onPress={() => removeCertificate(index)} mode="text" compact>
              Remove
            </Button>
          </View>
        ))}
        {renderUploadButton('Add More Certificates', pickCertificate)}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Languages</Text>
        <Text style={styles.sectionSubtitle}>
          Select languages you can communicate in
        </Text>

        <View style={styles.chipContainer}>
          {languages.map(language => (
            <Chip
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
            </Chip>
          ))}
        </View>
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
