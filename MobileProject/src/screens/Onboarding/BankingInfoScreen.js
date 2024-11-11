import React from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import ProgressBar from '../../components/ProgressBar';

export default function BankingInfoScreen({ navigation }) {
  const { control, handleSubmit } = useForm();

  const onSubmit = (data) => {
    console.log(data);
    navigation.navigate('Agreements');
  };

  return (
    <View style={styles.container}>
      <ProgressBar progress={0.95} />

      <Controller
        control={control}
        name="accountHolderName"
        render={({ field: { onChange, value } }) => (
          <TextInput
            label="Account Holder Name"
            value={value}
            onChangeText={onChange}
            style={styles.input}
          />
        )}
      />

      <Controller
        control={control}
        name="bankName"
        render={({ field: { onChange, value } }) => (
          <TextInput
            label="Bank Name"
            value={value}
            onChangeText={onChange}
            style={styles.input}
          />
        )}
      />

      <Controller
        control={control}
        name="accountNumber"
        render={({ field: { onChange, value } }) => (
          <TextInput
            label="Account Number"
            value={value}
            onChangeText={onChange}
            keyboardType="number-pad"
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
