import React from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, RadioButton } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';

export default function PersonalInfoScreen({ navigation }) {
  const { control, handleSubmit } = useForm();

  const onSubmit = (data) => {
    console.log(data);
    navigation.navigate('Document');
  };

  return (
    <View style={styles.container}>
      <Controller
        control={control}
        name="fullName"
        render={({ field: { onChange, value } }) => (
          <TextInput
            label="Full Name"
            value={value}
            onChangeText={onChange}
            style={styles.input}
          />
        )}
      />
      <Controller
        control={control}
        name="dob"
        render={({ field: { onChange, value } }) => (
          <TextInput
            label="Date of Birth"
            value={value}
            onChangeText={onChange}
            style={styles.input}
          />
        )}
      />
      <RadioButton.Group>
        <RadioButton.Item label="Male" value="male" />
        <RadioButton.Item label="Female" value="female" />
        <RadioButton.Item label="Other" value="other" />
      </RadioButton.Group>
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
