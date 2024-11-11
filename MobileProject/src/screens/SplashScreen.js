import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LogoAnimation from '../components/LogoAnimation';
import SplashText from '../components/SplashText';

export default function SplashScreen({ navigation }) {
    const [showText, setShowText] = useState(false);

    const handleAnimationComplete = () => {
        setShowText(true);
        setTimeout(async () => {
            const token = await AsyncStorage.getItem('token');
            navigation.replace(token ? 'Main' : 'Login');
        }, 9000);
    };

    return (
        <LinearGradient
            colors={[
                'rgba(269, 91, 42, 0.171)',
                'rgba(250, 184, 166, 0.171)',
                'rgba(139, 297, 65, 0.171)',
                'rgba(13, 187, 71, 0.171)',
            ]}
            start={{ x: 0.2, y: 0.2 }}
            end={{ x: 1, y: 1 }}
            style={styles.container}
        >
            <LogoAnimation onAnimationComplete={handleAnimationComplete} />
            {showText && <SplashText text="Welcome to Svvasthya Saathi, where your care makes a Difference" />}
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
