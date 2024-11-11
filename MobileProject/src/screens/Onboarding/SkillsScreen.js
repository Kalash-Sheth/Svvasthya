import React from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Chip } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import ProgressBar from '../../components/ProgressBar';

export default function SkillsScreen({ navigation }) {
  const { control, handleSubmit } = useForm();

  const onSubmit = (data) => {
    console.log(data);
    navigation.navigate('Availability');
  };

  return (
    <View style={styles.container}>
      <ProgressBar progress={0.5} />
      
      <Controller
        control={control}
        name="skills"
        render={({ field: { onChange, value } }) => (
          <TextInput
            label="Skills (comma separated)"
            value={value}
            onChangeText={onChange}
            style={styles.input}
          />
        )}
      />

      <View style={styles.chipContainer}>
        <Chip onPress={() => console.log('Selected: CPR')}>CPR</Chip>
        <Chip onPress={() => console.log('Selected: First Aid')}>First Aid</Chip>
        {/* Add more pre-defined chips */}
      </View>

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
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
});
