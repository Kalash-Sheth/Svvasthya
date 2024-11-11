import React, { useRef, useEffect } from 'react';
import { View, Image, Animated, Dimensions, StyleSheet } from 'react-native';

const { height } = Dimensions.get('window');

export default function LogoAnimation({ onAnimationComplete }) {
    const middleLogoOpacity = useRef(new Animated.Value(0)).current;
    const upperFlowerAnim = useRef(new Animated.Value(-height / 2)).current;
    const lowerFlowerAnim = useRef(new Animated.Value(height / 2)).current;

    useEffect(() => {
        // Fade in middle logo
        Animated.timing(middleLogoOpacity, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
        }).start(() => {
            // Animate flowers
            Animated.parallel([
                Animated.timing(upperFlowerAnim, {
                    toValue: 135,
                    duration: 1500,
                    useNativeDriver: true,
                }),
                Animated.timing(lowerFlowerAnim, {
                    toValue: -135,
                    duration: 1500,
                    useNativeDriver: true,
                }),
            ]).start(onAnimationComplete);
        });
    }, [onAnimationComplete]);

    return (
        <>
            <Animated.View style={[styles.logoContainer, { opacity: middleLogoOpacity }]}>
                <Image
                    source={require('../../assets/svvasthya_logo_letter_tran.png')}
                    style={styles.middleLogo}
                />
            </Animated.View>

            <Animated.View
                style={[styles.upperFlower, { transform: [{ translateY: upperFlowerAnim }] }]}
            >
                <Image
                    source={require('../../assets/svvasthya_logo_upper_tran.png')}
                    style={styles.flowerLogo}
                />
            </Animated.View>

            <Animated.View
                style={[styles.lowerFlower, { transform: [{ translateY: lowerFlowerAnim }] }]}
            >
                <Image
                    source={require('../../assets/svvasthya_logo_lower_tran.png')}
                    style={styles.flowerLogo}
                />
            </Animated.View>
        </>
    );
}

const styles = StyleSheet.create({
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
});
