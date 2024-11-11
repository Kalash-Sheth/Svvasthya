import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, ToggleButton, Switch, Text } from 'react-native-paper';
import ProgressBar from '../../components/ProgressBar';

export default function AvailabilityScreen({ navigation }) {
  const [availability, setAvailability] = React.useState('fulltime');
  const [isWillingToTravel, setIsWillingToTravel] = React.useState(false);

  const handleNext = () => {
    console.log({ availability, isWillingToTravel });
    navigation.navigate('MedicalInfo');
  };

  return (
    <View style={styles.container}>
      <ProgressBar progress={0.7} />

      <Text>Choose Availability</Text>
      <ToggleButton.Row onValueChange={setAvailability} value={availability}>
        <ToggleButton icon="clock" value="fulltime" />
        <ToggleButton icon="clock-outline" value="parttime" />
      </ToggleButton.Row>

      <View style={styles.switchContainer}>
        <Text>Willing to Travel?</Text>
        <Switch
          value={isWillingToTravel}
          onValueChange={setIsWillingToTravel}
        />
      </View>

      <Button mode="contained" onPress={handleNext}>
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
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    alignItems: 'center',
  },
});
