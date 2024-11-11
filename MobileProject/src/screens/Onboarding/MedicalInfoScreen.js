import React from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import ProgressBar from '../../components/ProgressBar';

export default function MedicalInfoScreen({ navigation }) {
  const { control, handleSubmit } = useForm();

  const onSubmit = (data) => {
    console.log(data);
    navigation.navigate('BankingInfo');
  };

  return (
    <View style={styles.container}>
      <ProgressBar progress={0.85} />

      <Controller
        control={control}
        name="emergencyContact"
        render={({ field: { onChange, value } }) => (
          <TextInput
            label="Emergency Contact"
            value={value}
            onChangeText={onChange}
            style={styles.input}
          />
        )}
      />

      <Controller
        control={control}
        name="medicalConditions"
        render={({ field: { onChange, value } }) => (
          <TextInput
            label="Medical Conditions (if any)"
            value={value}
            onChangeText={onChange}
            style={styles.input}
          />
        )}
      />

      <Button mode="contained" onPress={handleSubmit(onSubmit)}>
        Next
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    marginBottom: 15,
  },
});
