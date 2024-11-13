/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef, useEffect } from 'react';
import { View, Image, Animated, Dimensions, StyleSheet } from 'react-native';

const { height, width } = Dimensions.get('window');
const LOGO_SIZE = Math.min(width * 0.6, 250); // Responsive logo size
const FINAL_POSITION = height * 0.5 - LOGO_SIZE * 1.1; // Reduced from 1.2 to 1.1

export default function LogoAnimation({ onAnimationComplete }) {
    const middleLogoOpacity = useRef(new Animated.Value(0)).current;
    const upperFlowerAnim = useRef(new Animated.Value(-height)).current;
    const lowerFlowerAnim = useRef(new Animated.Value(height)).current;

    useEffect(() => {
        // Fade in middle logo
        Animated.timing(middleLogoOpacity, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
        }).start(() => {
            // Animate flowers to join perfectly with the middle logo
            Animated.parallel([
                Animated.timing(upperFlowerAnim, {
                    toValue: FINAL_POSITION,
                    duration: 1500,
                    useNativeDriver: true,
                }),
                Animated.timing(lowerFlowerAnim, {
                    toValue: FINAL_POSITION + LOGO_SIZE * 0.85, 
                    duration: 1500,
                    useNativeDriver: true,
                }),
            ]).start(onAnimationComplete);
        });
    }, [onAnimationComplete]);

    return (
        <View style={styles.container}>
            <Animated.View
                style={[
                    styles.logoContainer,
                    {
                        opacity: middleLogoOpacity,
                        transform: [{ translateY: FINAL_POSITION + LOGO_SIZE * 0.425 }], // Adjusted from 0.475 to 0.425
                    },
                ]}>
                <Image
                    source={require('../../assets/svvasthya_logo_letter_tran.png')}
                    style={[ styles.logo, styles.middleLogo ]}
                />
            </Animated.View>

            <Animated.View
                style={[
                    styles.logoContainer,
                    { transform: [{ translateY: upperFlowerAnim }] },
                ]}>
                <Image
                    source={require('../../assets/svvasthya_logo_upper_tran.png')}
                    style={[ styles.logo, styles.flowerLogo ]}
                />
            </Animated.View>

            <Animated.View
                style={[
                    styles.logoContainer,
                    { transform: [{ translateY: lowerFlowerAnim }] },
                ]}>
                <Image
                    source={require('../../assets/svvasthya_logo_lower_tran.png')}
                    style={[ styles.logo, styles.flowerLogo ]}
                />
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        alignItems: 'center',
    },
    logoContainer: {
        position: 'absolute',
        width: LOGO_SIZE,
        height: LOGO_SIZE,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    },
    middleLogo: {
        zIndex: 2,
    },
    flowerLogo: {
        zIndex: 1,
    },
});
