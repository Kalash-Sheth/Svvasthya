import React from 'react';
import { Text, StyleSheet } from 'react-native';

export default function SplashText({ text }) {
    return <Text style={styles.logoText}>{text}</Text>;
}

const styles = StyleSheet.create({
    logoText: {
        position: 'absolute',
        bottom: 130,
        fontSize: 20,
        color: '#1d376b',
        textAlign: 'center',
        fontWeight: 'bold',
        fontFamily: 'Helvetica, Arial, sans-serif',
    },
});
