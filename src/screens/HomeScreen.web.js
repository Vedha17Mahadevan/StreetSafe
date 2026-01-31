// src/screens/HomeScreen.web.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';

// Import our custom components and data
import WarningBanner from '../components/WarningBanner';
import { DANGER_ZONE, CURRENT_ALERT } from '../data/mockData';

const HomeScreen = () => {
    // State to store user location
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [loading, setLoading] = useState(true);
    const [distanceToDanger, setDistanceToDanger] = useState(null);

    // Effect hook to request permissions and get location on mount
    useEffect(() => {
        (async () => {
            // 1. Request permission
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                setLoading(false);
                return;
            }

            // 2. Get current location
            try {
                let location = await Location.getCurrentPositionAsync({});
                setLocation(location);
                if (location) {
                    setDistanceToDanger(150);
                }
            } catch (error) {
                console.warn("Location error:", error);
            }

            setLoading(false);
        })();
    }, []);

    // Helper to determine what text to show in banner
    const getBannerContent = () => {
        if (errorMsg) return { level: 'medium', text: errorMsg };
        if (!location) return { level: 'safe', text: 'Locating...' };

        return {
            level: CURRENT_ALERT.riskLevel,
            text: `⚠️ ${CURRENT_ALERT.type} Nearby. Please Stay Away.`
        };
    };

    const banner = getBannerContent();

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text style={{ marginTop: 10 }}>Acquiring User Location...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* 1. Header / Banner Area */}
            <View style={styles.header}>
                <Text style={styles.title}>Public Safety Alert</Text>
                <WarningBanner riskLevel={banner.level} message={banner.text} />
            </View>

            {/* 2. Map Area - WEB PLACEHOLDER */}
            <View style={styles.mapContainer}>
                <View style={[styles.map, styles.webMapPlaceholder]}>
                    <Text style={styles.webPlaceholderText}>
                        Map view is not supported on Web in this demo.
                        {"\n"}Please use iOS Simulator or Android Emulator.
                    </Text>
                </View>
            </View>

            {/* 3. Details Panel */}
            <View style={styles.detailsContainer}>
                <Text style={styles.detailsHeader}>Alert Details</Text>
                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Hazard:</Text>
                    <Text style={styles.detailValue}>{CURRENT_ALERT.description}</Text>
                </View>
                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Risk Level:</Text>
                    <Text style={[styles.detailValue, { color: 'red', fontWeight: 'bold' }]}>
                        {CURRENT_ALERT.riskLevel.toUpperCase()}
                    </Text>
                </View>
                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Est. Distance:</Text>
                    <Text style={styles.detailValue}>
                        ~150 meters {/* Mock value as requested */}
                    </Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F2F2F7',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        paddingTop: 50, // For status bar
        paddingBottom: 10,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    title: {
        fontSize: 22,
        fontWeight: '800',
        textAlign: 'center',
        marginBottom: 5,
    },
    mapContainer: {
        flex: 1,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    map: {
        width: Dimensions.get('window').width,
        height: '100%',
    },
    webMapPlaceholder: {
        backgroundColor: '#eee',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    webPlaceholderText: {
        textAlign: 'center',
        fontSize: 16,
        color: '#666',
        lineHeight: 24,
    },
    detailsContainer: {
        padding: 20,
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        marginTop: -20, // Overlap map slightly
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
    },
    detailsHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#333',
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
        borderBottomWidth: 0.5,
        borderBottomColor: '#eee',
        paddingBottom: 5,
    },
    detailLabel: {
        fontSize: 16,
        color: '#666',
    },
    detailValue: {
        fontSize: 16,
        fontWeight: '500',
        color: '#000',
    },
});

export default HomeScreen;
