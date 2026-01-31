// src/components/WarningBanner.js
import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';

// Functional component to display a warning banner
// Props:
// - riskLevel: 'high' | 'medium' | 'low' -> Determines color and message
// - message: string -> The custom warning text
const WarningBanner = ({ riskLevel, message }) => {

    // Helper function to get background color based on risk
    const getBackgroundColor = () => {
        switch (riskLevel) {
            case 'high':
                return '#FF3B30'; // Red
            case 'medium':
                return '#FFCC00'; // Yellow
            case 'safe':
                return '#34C759'; // Green
            default:
                return '#8E8E93'; // Gray
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: getBackgroundColor() }]}>
            <Text style={styles.text}>
                {riskLevel === 'high' ? '⚠️ ' : ''}
                {message}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 15,
        borderRadius: 8,
        marginHorizontal: 20,
        marginTop: 10,
        marginBottom: 10,
        alignItems: 'center',
        justifyContent: 'center',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 4,
            },
            android: {
                elevation: 4,
            },
            web: {
                boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)', // Standard CSS shadow for web
            },
        }),
    },
    text: {
        color: '#FFFFFF', // White text for better contrast
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default WarningBanner;
