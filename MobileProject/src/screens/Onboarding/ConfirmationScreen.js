import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';
import ProgressBar from '../../components/ProgressBar';

export default function ConfirmationScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <ProgressBar progress={1} />

      <Text style={styles.title}>Congratulations!</Text>
      <Text style={styles.subtitle}>
        Your onboarding is complete. You will be contacted shortly with further details.
      </Text>

      <Button mode="contained" onPress={() => navigation.navigate('Home')}>
        Go to Dashboard
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  animation: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
});
