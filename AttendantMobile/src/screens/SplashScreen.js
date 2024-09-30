import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    Animated,
    Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { height } = Dimensions.get('window');

export default function SplashScreen({ navigation }) {
    const [showText, setShowText] = useState(false);

    // Animations
    const middleLogoOpacity = useRef(new Animated.Value(0)).current;
    const upperFlowerAnim = useRef(new Animated.Value(-height / 2)).current;
    const lowerFlowerAnim = useRef(new Animated.Value(height / 2)).current;

    useEffect(() => {
        // Step 1: Fade-in the middle logo
        Animated.timing(middleLogoOpacity, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
        }).start(() => {
            // Step 2: Animate the upper and lower logos once middle logo is shown
            Animated.parallel([
                Animated.timing(upperFlowerAnim, {
                    toValue: 235,
                    duration: 1500,
                    useNativeDriver: true,
                }),
                Animated.timing(lowerFlowerAnim, {
                    toValue: -235,
                    duration: 1500,
                    useNativeDriver: true,
                }),
            ]).start(() => {
                // Step 3: Show the welcome text after the logo animations are done
                setShowText(true);

                // Step 4: Check login status after 3 seconds (once splash screen finishes)
                setTimeout(async () => {
                    const token = await AsyncStorage.getItem('token');
                    if (token) {
                        // User is logged in, navigate to Main screen
                        navigation.replace('Main');
                    } else {
                        // User is not logged in, navigate to Login screen
                        navigation.replace('Login');
                    }
                }, 3000);
            });
        });
    }, []);

    return (
        <LinearGradient
            colors={[
                'rgba(269, 91, 42, 0.171)',
                'rgba(250, 184, 166, 0.171) 33%',
                'rgba(139, 297, 65, 0.171) 66%',
                'rgba(13, 187, 71, 0.171)',
            ]}
            start={{ x: 0.2, y: 0.2 }}
            end={{ x: 1, y: 1 }}
            style={styles.container}
        >
            {/* Middle Logo (Fades In) */}
            <Animated.View style={[styles.logoContainer, { opacity: middleLogoOpacity }]}>
                <Image
                    source={require('../../assets/svvasthya_logo_letter_tran.png')}
                    style={styles.middleLogo}
                />
            </Animated.View>

            {/* Upper Flower Animation */}
            <Animated.View
                style={[styles.upperFlower, { transform: [{ translateY: upperFlowerAnim }] }]}
            >
                <Image
                    source={require('../../assets/svvasthya_logo_upper_tran.png')}
                    style={styles.flowerLogo}
                />
            </Animated.View>

            {/* Lower Flower Animation */}
            <Animated.View
                style={[styles.lowerFlower, { transform: [{ translateY: lowerFlowerAnim }] }]}
            >
                <Image
                    source={require('../../assets/svvasthya_logo_lower_tran.png')}
                    style={styles.flowerLogo}
                />
            </Animated.View>

            {/* Text after animation */}
            {showText && (
                <Text style={styles.logoText}>Welcome to Svvasthya Saathi, where your care makes a Difference</Text>
            )}
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoContainer: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
    },
    middleLogo: {
        width: 250,
        height: 250,
        resizeMode: 'contain',
    },
    flowerLogo: {
        width: 250,
        height: 250,
        resizeMode: 'contain',
    },
    upperFlower: {
        position: 'absolute',
        top: 0,
    },
    lowerFlower: {
        position: 'absolute',
        bottom: 0,
    },
    logoText: {
        position: 'absolute',
        bottom: 200,
        fontSize: 20,
        color: '#1d376b',
        textAlign: 'center',
        fontWeight: 'bold',
       fontFamily: 'Helvetica, Arial, sans-serif'
    },
});
