import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Button, Checkbox, Text } from 'react-native-paper';
import ProgressBar from '../../components/ProgressBar';

export default function AgreementScreen({ navigation }) {
  const [isAgreed, setIsAgreed] = useState(false);

  const handleNext = () => {
    if (isAgreed) {
      navigation.navigate('Confirmation');
    } else {
      alert('You must agree to the terms and conditions to proceed.');
    }
  };

  return (
    <View style={styles.container}>
      <ProgressBar progress={0.98} />

      <ScrollView style={styles.scrollContainer}>
        <Text style={styles.heading}>Terms and Conditions</Text>
        <Text style={styles.text}>
          {/* Add a summary or import T&C text */}
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi.
        </Text>

        <Text style={styles.heading}>Privacy Policy</Text>
        <Text style={styles.text}>
          {/* Add a summary or import Privacy Policy */}
          Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta.
        </Text>
      </ScrollView>

      <View style={styles.checkboxContainer}>
        <Checkbox
          status={isAgreed ? 'checked' : 'unchecked'}
          onPress={() => setIsAgreed(!isAgreed)}
        />
        <Text>I agree to the Terms and Privacy Policy</Text>
      </View>

      <Button mode="contained" onPress={handleNext}>
        Submit
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  scrollContainer: {
    flex: 1,
    marginBottom: 15,
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  text: {
    fontSize: 14,
    marginVertical: 5,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
});
