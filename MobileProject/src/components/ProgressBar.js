import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Text} from 'react-native-paper';

const BRAND_COLORS = {
  orange: '#FF7F50',
  green: '#4CAF50',
  blue: '#2196F3',
};

export default function ProgressBar({step, totalSteps}) {
  const progress = (step / totalSteps) * 100;

  return (
    <View style={styles.container}>
      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, {width: `${progress}%`}]} />
      </View>
      <Text style={styles.stepText}>
        Step {step} of {totalSteps}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  progressContainer: {
    height: 4,
    backgroundColor: '#E2E8F0',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: BRAND_COLORS.orange,
    borderRadius: 2,
  },
  stepText: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 6,
    fontFamily: 'Poppins-Regular',
    textAlign: 'right',
  },
});
