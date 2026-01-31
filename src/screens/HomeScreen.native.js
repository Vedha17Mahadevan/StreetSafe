// src/screens/HomeScreen.native.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import MapView, { Marker, Circle } from 'react-native-maps';
import * as Location from 'expo-location';
import { ref, onValue } from 'firebase/database';
import { signInAnonymously } from 'firebase/auth';
import { db, auth } from '../config/firebase';

// Import our custom components and data
import WarningBanner from '../components/WarningBanner';
import { DANGER_ZONE } from '../data/mockData';

const HomeScreen = () => {
    // State to store user location
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [loading, setLoading] = useState(true);
    const [distanceToDanger, setDistanceToDanger] = useState(null);

    // Real-time data state
    const [poleData, setPoleData] = useState({
        status: 'CONNECTING',
        current: 0,
        time: 0
    });

    // Effect hook for Location, Auth, and Data
    useEffect(() => {
        let unsubscribe = () => { };

        (async () => {
            // 1. Authenticate (Anonymous) to satisfy DB Rules
            try {
                await signInAnonymously(auth);
                console.log("✅ Signed in anonymously");
            } catch (e) {
                console.error("❌ Auth failed:", e);
                setErrorMsg("Authentication Failed: " + e.message);
                setLoading(false);
                return; // Stop if auth fails
            }

            // 2. Request Location Permission
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
            } else {
                try {
                    const location = await Location.getCurrentPositionAsync({});
                    setLocation(location);
                    if (location) {
                        setDistanceToDanger(150);
                    }
                } catch (e) {
                    console.warn('Error fetching location', e);
                }
            }

            // 3. Setup Firebase Realtime Listener (after Auth)
            const starCountRef = ref(db, 'poles/pole_01/live');
            unsubscribe = onValue(starCountRef, (snapshot) => {
                const data = snapshot.val();
                console.log("Firebase Data Update:", data);
                if (data) {
                    setPoleData(data);
                } else {
                    console.log("No data at path.");
                    setPoleData(prev => ({ ...prev, status: 'NO_DATA' }));
                }
                setLoading(false);
            }, (error) => {
                console.error("Firebase Read Error:", error);
                // Don't override main error if it's just a fleeting permissions issue during auth
                if (error.code !== 'permission_denied') {
                    setErrorMsg("DB Error: " + error.message);
                }
            });

            // Initial loading done handled inside listener or fallback
            // But if listener takes time, we can setLoading false earlier if needed.
            // Here we wait for first data or auth failure.
        })();

        // Cleanup listener on unmount
        return () => unsubscribe();
    }, []);

    // Helper to determine what text to show in banner
    const getBannerContent = () => {
        if (errorMsg) return { level: 'medium', text: errorMsg };
        if (!location) return { level: 'safe', text: 'Locating...' };

        if (poleData.status === 'CONNECTING') {
            return { level: 'medium', text: 'Connecting to Live Monitor...' };
        }

        if (poleData.status === 'NO_DATA') {
            return { level: 'medium', text: 'Connected. Waiting for Hardware Data...' };
        }

        if (poleData.status === 'BROKEN') {
            return {
                level: 'high',
                text: `⚠️ Electrical Hazard Detected! Value: ${poleData.current}`
            };
        }

        return {
            level: 'safe',
            text: `✅ Area Secured. Monitor: ${poleData.current}`
        };
    };

    const banner = getBannerContent();

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text style={{ marginTop: 10 }}>Authenticating & Connecting...</Text>
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

            {/* 2. Map Area */}
            <View style={styles.mapContainer}>
                <MapView
                    style={styles.map}
                    initialRegion={{
                        latitude: location ? location.coords.latitude : DANGER_ZONE.latitude,
                        longitude: location ? location.coords.longitude : DANGER_ZONE.longitude,
                        latitudeDelta: 0.0122,
                        longitudeDelta: 0.0061,
                    }}
                    showsUserLocation={true}
                >
                    {/* Marker for Danger Zone */}
                    <Marker
                        coordinate={{ latitude: DANGER_ZONE.latitude, longitude: DANGER_ZONE.longitude }}
                        title="Pole #01"
                        description={`Status: ${poleData.status} | Current: ${poleData.current}`}
                        pinColor={poleData.status === 'BROKEN' ? 'red' : (poleData.status === 'CONNECTING' ? 'orange' : 'green')}
                    />

                    {/* Circle indicating danger area - Show only if BROKEN */}
                    {poleData.status === 'BROKEN' && (
                        <Circle
                            center={{ latitude: DANGER_ZONE.latitude, longitude: DANGER_ZONE.longitude }}
                            radius={DANGER_ZONE.radius}
                            fillColor="rgba(255, 59, 48, 0.3)" // Semi-transparent red
                            strokeColor="rgba(255, 59, 48, 0.8)"
                        />
                    )}
                </MapView>
            </View>

            {/* 3. Details Panel */}
            <View style={styles.detailsContainer}>
                <Text style={styles.detailsHeader}>Live Monitor Details</Text>
                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Monitor ID:</Text>
                    <Text style={styles.detailValue}>pole_01</Text>
                </View>
                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Status:</Text>
                    <Text style={[
                        styles.detailValue,
                        { color: poleData.status === 'BROKEN' ? 'red' : (poleData.status === 'CONNECTING' ? 'orange' : 'green'), fontWeight: 'bold' }
                    ]}>
                        {poleData.status}
                    </Text>
                </View>
                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Sensor Value:</Text>
                    <Text style={styles.detailValue}>
                        {poleData.current}
                    </Text>
                </View>
                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Uptime:</Text>
                    <Text style={[styles.detailValue, { fontSize: 12, color: '#999' }]}>
                        {poleData.time ? `${Math.floor(poleData.time / 1000)}s` : 'Waiting...'}
                    </Text>
                </View>
                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Est. Distance:</Text>
                    <Text style={styles.detailValue}>
                        {distanceToDanger ? `${distanceToDanger.toFixed(0)} m` : 'Calculating...'}
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
