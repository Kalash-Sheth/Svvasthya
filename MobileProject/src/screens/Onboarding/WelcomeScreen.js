import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ImageBackground,
} from 'react-native';
import {Button} from 'react-native-paper';

const BRAND_COLORS = {
  orange: '#FF7F50',
  green: '#4CAF50',
  blue: '#2196F3',
};

export default function WelcomeScreen({navigation}) {
  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require('../../../assets/svvasthya_logo_tran.png')}
        style={styles.backgroundImage}
        resizeMode="contain">
        <View style={styles.contentContainer}>
          <View style={styles.headerContainer}>
            <Text style={styles.title}>Welcome to</Text>
            <Text style={styles.brandName}>Svvasthya</Text>
            <Text style={styles.subtitle}>Attendant App</Text>
          </View>

          <View style={styles.bottomContainer}>
            <Text style={styles.description}>
              Let's get you started with onboarding and help you provide better
              care.
            </Text>
            <Button
              mode="contained"
              onPress={() => navigation.navigate('PersonalInfo')}
              style={styles.button}
              contentStyle={styles.buttonContent}
              labelStyle={styles.buttonText}>
              Get Started
            </Button>
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
  },
  contentContainer: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 20,
    justifyContent: 'space-between',
  },
  headerContainer: {
    marginTop: 60,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    color: BRAND_COLORS.blue,
    marginBottom: 10,
    fontFamily: 'Poppins-Light',
  },
  brandName: {
    fontSize: 40,
    fontFamily: 'Poppins-Bold',
    color: BRAND_COLORS.orange,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 24,
    color: BRAND_COLORS.green,
    fontFamily: 'Poppins-Medium',
  },
  bottomContainer: {
    marginBottom: 50,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#666',
    lineHeight: 24,
    fontFamily: 'Poppins-Regular',
  },
  button: {
    backgroundColor: BRAND_COLORS.orange,
    borderRadius: 25,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonContent: {
    height: 50,
  },
  buttonText: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: 'white',
  },
});
