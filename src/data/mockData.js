// src/data/mockData.js

// Mock data for the safety alert system
// This simulates data that might come from a backend server

// Define a danger zone (e.g., a fallen power line location)
export const DANGER_ZONE = {
  latitude: 37.78825, // Mock latitude (near default Expo map location)
  longitude: -122.4324, // Mock longitude
  radius: 100, // Danger radius in meters
};

// Define the alert details associated with this danger zone
export const CURRENT_ALERT = {
  id: '1',
  type: 'Electrical Hazard',
  description: 'Fallen Power Line Detected',
  riskLevel: 'high', // Options: 'high', 'medium', 'low'
  timestamp: new Date().toISOString(),
};
