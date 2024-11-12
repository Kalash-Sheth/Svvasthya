/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect} from 'react';
import {View, StyleSheet, Animated} from 'react-native';
import {Text, Button} from 'react-native-paper';
import {Check} from 'lucide-react-native';
import {BRAND_COLORS} from '../../styles/colors';

export default function ConfirmationScreen({navigation}) {
  const scaleValue = new Animated.Value(0);
  const fadeValue = new Animated.Value(0);

  useEffect(() => {
    Animated.sequence([
      Animated.spring(scaleValue, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(fadeValue, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Animated.View
          style={[
            styles.iconContainer,
            {
              transform: [{scale: scaleValue}],
            },
          ]}>
          <Check size={50} color="white" strokeWidth={3} />
        </Animated.View>

        <Animated.View
          style={[
            styles.textContainer,
            {
              opacity: fadeValue,
              transform: [
                {
                  translateY: fadeValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0],
                  }),
                },
              ],
            },
          ]}>
          <Text style={styles.title}>Registration Complete!</Text>
          <Text style={styles.subtitle}>
            Thank you for joining Svvasthya. Our team will review your
            application and contact you shortly.
          </Text>
          <Text style={styles.info}>
            Meanwhile, you can explore the app and familiarize yourself with our
            services.
          </Text>
        </Animated.View>

        <Button
          mode="contained"
          onPress={() => navigation.navigate('Home')}
          style={styles.button}
          contentStyle={styles.buttonContent}
          labelStyle={styles.buttonText}>
          Go to Dashboard
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: BRAND_COLORS.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    shadowColor: BRAND_COLORS.secondary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Poppins-Bold',
    fontWeight: '900',
    color: BRAND_COLORS.textPrimary,
    marginBottom: 15,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: BRAND_COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 15,
    lineHeight: 24,
  },
  info: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: BRAND_COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  button: {
    marginTop: 20,
    backgroundColor: BRAND_COLORS.primary,
    borderRadius: 30,
    elevation: 8,
    shadowColor: BRAND_COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    width: '80%',
  },
  buttonContent: {
    height: 56,
  },
  buttonText: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: 'white',
    letterSpacing: 1,
  },
});
