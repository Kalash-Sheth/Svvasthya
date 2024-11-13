import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import {Button, Text, RadioButton} from 'react-native-paper';
import {useForm, Controller} from 'react-hook-form';
import {launchImageLibrary} from 'react-native-image-picker';
import FormInput from '../../components/FormInput';
import ProgressBar from '../../components/ProgressBar';
import {BRAND_COLORS} from '../../styles/colors';

const inputFields = [
  {
    section: 'Name',
    fields: [
      {name: 'firstName', label: 'First Name', icon: 'account'},
      {name: 'middleName', label: 'Middle Name', icon: 'account'},
      {name: 'lastName', label: 'Last Name', icon: 'account'},
    ],
  },
  {
    section: 'Basic Information',
    fields: [{name: 'dob', label: 'Date of Birth', icon: 'calendar'}],
  },
  {
    section: 'Contact Information',
    fields: [
      {
        name: 'mobile',
        label: 'Mobile Number',
        icon: 'phone',
        keyboardType: 'phone-pad',
      },
      {
        name: 'email',
        label: 'Email Address',
        icon: 'email',
        keyboardType: 'email-address',
      },
    ],
  },
  {
    section: 'Permanent Address',
    fields: [
      {name: 'houseNumber', label: 'House Number', icon: 'home'},
      {name: 'street', label: 'Street', icon: 'road'},
      {name: 'city', label: 'City', icon: 'city'},
      {name: 'state', label: 'State', icon: 'map-marker'},
      {
        name: 'zipCode',
        label: 'ZIP Code',
        icon: 'post',
        keyboardType: 'numeric',
      },
    ],
  },
];

export default function PersonalInfoScreen({navigation}) {
  const {control, handleSubmit} = useForm();
  const [profileImage, setProfileImage] = useState(null);
  const [gender, setGender] = useState('');

  const pickImage = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.8,
    });
    if (!result.didCancel && result.assets?.[0]?.uri) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const onSubmit = data => {
    console.log({...data, profileImage, gender});
    navigation.navigate('Document');
  };

  const renderSection = (section, fields) => (
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
            />
          )}
        />
      ))}
      {section === 'Basic Information' && (
        <>
          <Text style={styles.labelText}>Gender</Text>
          <RadioButton.Group
            onValueChange={value => setGender(value)}
            value={gender}>
            <View style={styles.radioGroup}>
              <RadioButton.Item
                label="Male"
                value="male"
                labelStyle={styles.radioLabel}
                color={BRAND_COLORS.orange}
              />
              <RadioButton.Item
                label="Female"
                value="female"
                labelStyle={styles.radioLabel}
                color={BRAND_COLORS.orange}
              />
              <RadioButton.Item
                label="Other"
                value="other"
                labelStyle={styles.radioLabel}
                color={BRAND_COLORS.orange}
              />
            </View>
          </RadioButton.Group>
        </>
      )}
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <ProgressBar step={1} totalSteps={8} />
      <Text style={styles.headerText}>Personal Information</Text>

      <View style={styles.photoSection}>
        <TouchableOpacity onPress={pickImage} style={styles.photoContainer}>
          {profileImage ? (
            <Image source={{uri: profileImage}} style={styles.profileImage} />
          ) : (
            <>
              <Text style={styles.uploadText}>Upload Photo</Text>
              <Text style={styles.uploadSubText}>Tap to choose</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {inputFields.map(({section, fields}) => renderSection(section, fields))}

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
    backgroundColor: '#fff',
  },
  scrollContent: {
    padding: 20,
  },
  headerText: {
    fontSize: 28,
    fontFamily: 'Poppins-Bold',
    color: BRAND_COLORS.textPrimary,
    marginBottom: 10,
    textAlign: 'center',
    fontWeight: '900',
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    fontFamily: 'Poppins-Bold',
    color: BRAND_COLORS.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins-Medium',
    color: BRAND_COLORS.textSecondary,
    marginBottom: 24,
    textAlign: 'center',
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
    fontFamily: 'Poppins-Bold',
    fontWeight: '700',
    color: 'white',
    letterSpacing: 1,
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
    color: BRAND_COLORS.secondary,
    marginBottom: 15,
    paddingBottom: 8,
    borderBottomWidth: 2,
    borderBottomColor: BRAND_COLORS.border,
  },
  labelText: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: BRAND_COLORS.textSecondary,
    marginBottom: 15,
    marginTop: 1,
  },
  radioGroup: {
    backgroundColor: BRAND_COLORS.background,
    borderRadius: 12,
    overflow: 'hidden',
    marginHorizontal: -10,
    borderWidth: 1,
    borderColor: BRAND_COLORS.border,
  },
  radioLabel: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: BRAND_COLORS.textSecondary,
  },
  photoSection: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 10,
  },
  photoContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: BRAND_COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: BRAND_COLORS.primary,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 8,
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  uploadText: {
    fontFamily: 'Poppins-Medium',
    color: BRAND_COLORS.primary,
    fontSize: 16,
    marginBottom: 4,
  },
  uploadSubText: {
    fontFamily: 'Poppins-Regular',
    color: BRAND_COLORS.textSecondary,
    fontSize: 13,
  },
});