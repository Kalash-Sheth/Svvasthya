import React from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';

export default function DocumentScreen({ navigation }) {
  const { control, handleSubmit } = useForm();

  const onSubmit = (data) => {
    console.log(data);
    navigation.navigate('Skills'); // Next screen
  };

  return (
    <View style={styles.container}>
      <Controller
        control={control}
        name="documentType"
        render={({ field: { onChange, value } }) => (
          <TextInput
            label="Document Type"
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
