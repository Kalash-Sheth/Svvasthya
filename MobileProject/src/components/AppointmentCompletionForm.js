import React, {useState} from 'react';
import {View, StyleSheet, ScrollView, Modal, SafeAreaView} from 'react-native';
import {TextInput, Button, Text, Switch, IconButton} from 'react-native-paper';
import {X} from 'lucide-react-native';
import BRAND_COLORS from '../styles/colors';

const AppointmentCompletionForm = ({visible, onClose, onSubmit}) => {
  const [formData, setFormData] = useState({
    serviceProvided: '',
    diseaseConditionTreated: '',
    symptomsObserved: '',
    vitalSigns: '',
    medicationsAdministered: '',
    attendantsObservations: '',
    customerFeedback: '',
    followUpRequired: false,
    incidentReport: '',
    actionsTaken: '',
  });

  const handleSubmit = () => {
    console.log('Form Data:', formData);
    onSubmit(formData);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Complete Appointment</Text>
            <Text style={styles.headerSubtitle}>Fill in appointment details</Text>
          </View>
          <IconButton
            icon={() => <X size={24} color={BRAND_COLORS.textSecondary} />}
            onPress={onClose}
            style={styles.closeButton}
          />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}>
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Basic Information</Text>
            <TextInput
              label="Service Provided *"
              value={formData.serviceProvided}
              onChangeText={text =>
                setFormData({...formData, serviceProvided: text})
              }
              style={styles.input}
              mode="outlined"
              outlineColor={BRAND_COLORS.border}
              activeOutlineColor={BRAND_COLORS.primary}
            />

            <TextInput
              label="Disease/Condition Treated *"
              value={formData.diseaseConditionTreated}
              onChangeText={text =>
                setFormData({...formData, diseaseConditionTreated: text})
              }
              style={styles.input}
              mode="outlined"
              outlineColor={BRAND_COLORS.border}
              activeOutlineColor={BRAND_COLORS.primary}
            />
          </View>

          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Medical Details</Text>
            <TextInput
              label="Symptoms Observed *"
              value={formData.symptomsObserved}
              onChangeText={text =>
                setFormData({...formData, symptomsObserved: text})
              }
              style={styles.input}
              mode="outlined"
              multiline
              numberOfLines={3}
              outlineColor={BRAND_COLORS.border}
              activeOutlineColor={BRAND_COLORS.primary}
            />

            <TextInput
              label="Vital Signs *"
              value={formData.vitalSigns}
              onChangeText={text =>
                setFormData({...formData, vitalSigns: text})
              }
              style={styles.input}
              mode="outlined"
              outlineColor={BRAND_COLORS.border}
              activeOutlineColor={BRAND_COLORS.primary}
            />

            <TextInput
              label="Medications Administered"
              value={formData.medicationsAdministered}
              onChangeText={text =>
                setFormData({...formData, medicationsAdministered: text})
              }
              style={styles.input}
              mode="outlined"
              multiline
              numberOfLines={3}
              outlineColor={BRAND_COLORS.border}
              activeOutlineColor={BRAND_COLORS.primary}
            />
          </View>

          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Observations & Feedback</Text>
            <TextInput
              label="Attendant's Observations"
              value={formData.attendantsObservations}
              onChangeText={text =>
                setFormData({...formData, attendantsObservations: text})
              }
              style={styles.input}
              mode="outlined"
              multiline
              numberOfLines={3}
              outlineColor={BRAND_COLORS.border}
              activeOutlineColor={BRAND_COLORS.primary}
            />

            <TextInput
              label="Customer Feedback"
              value={formData.customerFeedback}
              onChangeText={text =>
                setFormData({...formData, customerFeedback: text})
              }
              style={styles.input}
              mode="outlined"
              multiline
              numberOfLines={3}
              outlineColor={BRAND_COLORS.border}
              activeOutlineColor={BRAND_COLORS.primary}
            />

            <View style={styles.switchContainer}>
              <View>
                <Text style={styles.switchLabel}>Follow-up Required *</Text>
                <Text style={styles.switchSubLabel}>
                  Toggle if patient needs follow-up
                </Text>
              </View>
              <Switch
                value={formData.followUpRequired}
                onValueChange={value =>
                  setFormData({...formData, followUpRequired: value})
                }
                color={BRAND_COLORS.primary}
              />
            </View>
          </View>

          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Additional Information</Text>
            <TextInput
              label="Incident Report"
              value={formData.incidentReport}
              onChangeText={text =>
                setFormData({...formData, incidentReport: text})
              }
              style={styles.input}
              mode="outlined"
              multiline
              numberOfLines={3}
              outlineColor={BRAND_COLORS.border}
              activeOutlineColor={BRAND_COLORS.primary}
            />

            <TextInput
              label="Actions Taken"
              value={formData.actionsTaken}
              onChangeText={text =>
                setFormData({...formData, actionsTaken: text})
              }
              style={styles.input}
              mode="outlined"
              multiline
              numberOfLines={3}
              outlineColor={BRAND_COLORS.border}
              activeOutlineColor={BRAND_COLORS.primary}
            />
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Button
            mode="outlined"
            onPress={onClose}
            style={[styles.button, styles.cancelButton]}
            labelStyle={styles.cancelButtonText}
            icon="close">
            Cancel
          </Button>
          <Button
            mode="contained"
            onPress={handleSubmit}
            style={[styles.button, styles.submitButton]}
            labelStyle={styles.submitButtonText}
            icon="check">
            Submit Report
          </Button>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: BRAND_COLORS.border,
    backgroundColor: '#fff',
    elevation: 2,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: 'Poppins-Bold',
    color: BRAND_COLORS.textPrimary,
    fontWeight: '900',
  },
  headerSubtitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: BRAND_COLORS.textSecondary,
    marginTop: 4,
  },
  closeButton: {
    margin: 0,
  },
  scrollContent: {
    padding: 20,
  },
  formSection: {
    marginBottom: 24,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 22,
    fontFamily: 'Poppins-Bold',
    color: BRAND_COLORS.textPrimary,
    marginBottom: 8,
    fontWeight: '800',
  },
  sectionSubtitle: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: BRAND_COLORS.textSecondary,
    marginBottom: 20,
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: BRAND_COLORS.background,
    padding: 16,
    borderRadius: 8,
    marginTop: 8,
  },
  switchLabel: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: BRAND_COLORS.textPrimary,
    fontWeight: '600',
  },
  switchSubLabel: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: BRAND_COLORS.textSecondary,
    marginTop: 4,
  },
  footer: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: BRAND_COLORS.border,
    elevation: 4,
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
    borderRadius: 8,
    paddingVertical: 8,
  },
  cancelButton: {
    borderColor: BRAND_COLORS.error,
  },
  submitButton: {
    backgroundColor: BRAND_COLORS.primary,
  },
  cancelButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: BRAND_COLORS.error,
  },
  submitButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#fff',
  },
});

export default AppointmentCompletionForm;
