import React, { useState, useEffect } from 'react';
import { LoginScreen } from './components/LoginScreen';
import { Dashboard } from './components/Dashboard';
import { ZoneDetail } from './components/ZoneDetail';
import { AlertScreen } from './components/AlertScreen';
import { ThemeProvider } from './context/ThemeContext';
import { Zone, FaultAlert } from './types';
import { getActiveFaultAlerts } from './utils/mockData';
import { subscribeToZoneDevices } from './utils/firebase';
import { loadAllZonesFromCSV } from './utils/csvLoader';

type View = 'login' | 'dashboard' | 'zone-detail';

function AppContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState<View>('login');
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);
  const [activeAlert, setActiveAlert] = useState<FaultAlert | null>(null);
  const [loginError, setLoginError] = useState('');
  const [zones, setZones] = useState<Zone[]>([]);
  const [faultLog, setFaultLog] = useState<FaultAlert[]>([]);
  // Track acknowledged alerts with a timestamp to suppress repeat popups for a period
  const [acknowledgedMap, setAcknowledgedMap] = useState<Record<string, number>>({});
  const ACK_TTL = 10 * 60 * 1000; // 10 minutes

  // Monitor for critical alerts
  useEffect(() => {
    if (!isAuthenticated) return;

    const checkForAlerts = () => {
      const currentZones = zones; // Use current zones state
      setZones(currentZones);
      const alerts = getActiveFaultAlerts(currentZones);

      // Remove expired entries from acknowledgedMap
      const now = Date.now();
      const cleaned: Record<string, number> = {};
      let changed = false;
      Object.entries(acknowledgedMap).forEach(([id, ts]) => {
        if (now - ts < ACK_TTL) cleaned[id] = ts;
        else changed = true;
      });
      if (changed) setAcknowledgedMap(cleaned);

      // Filter out alerts that were acknowledged recently (suppressed)
      const visibleAlerts = alerts.filter(a => {
        const ts = acknowledgedMap[a.id];
        return !ts || now - ts > ACK_TTL;
      });

      // Show full-screen alert for critical faults among visible alerts
      const criticalAlert = visibleAlerts.find(alert => alert.status === 'critical' && !alert.acknowledged);
      if (criticalAlert && !activeAlert) {
        setActiveAlert(criticalAlert);
      }
    };

    checkForAlerts();

    // Check less frequently to reduce popup frequency (every 15s)
    const interval = setInterval(checkForAlerts, 15000);
    return () => clearInterval(interval);
  }, [isAuthenticated, activeAlert, acknowledgedMap, zones]);

  // Load zones A, C, D, E from CSV and subscribe to zone B from Firebase
  useEffect(() => {
    if (!isAuthenticated) return;

    let unsub: (() => void) | null = null;

    // Load zones A, C, D, E from CSV
    loadAllZonesFromCSV().then(csvZones => {
      setZones(prevZones => {
        // Filter out previous zones A,C,D,E
        const filtered = prevZones.filter(z => z.id === 'B');
        return [...filtered, ...csvZones];
      });
    }).catch(err => {
      console.error('Failed to load zones from CSV:', err);
    });

    // Subscribe to zone B realtime updates and merge into zones state
    unsub = subscribeToZoneDevices('B', (devices) => {
      setZones((prevZones) => {
        // Ensure we have a base set of zones (generate if empty)
        const base = prevZones.length ? prevZones : [];
        return base.map((z) => {
          if (z.id !== 'B') return z;

          const criticalDevices = devices.filter(d => d.status === 'critical').length;
          const warningDevices = devices.filter(d => d.status === 'warning').length;
          const activeWarnings = criticalDevices + warningDevices;
          const zoneStatus = criticalDevices > 0 ? 'critical' : warningDevices > 0 ? 'warning' : 'normal';

          return {
            ...z,
            devices,
            activeWarnings,
            status: zoneStatus,
          };
        });
      });
    });

    return () => {
      if (unsub) {
        try { unsub(); } catch (e) { /* ignore */ }
      }
    };
  }, [isAuthenticated]);

  const handleLogin = (email: string, password: string) => {
    // Demo mode - accept any credentials
    if (email && password) {
      setIsAuthenticated(true);
      setCurrentView('dashboard');
      setLoginError('');
    } else {
      setLoginError('Please enter email and password');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentView('login');
    setSelectedZone(null);
    setActiveAlert(null);
  };

  const handleZoneClick = (zone: Zone) => {
    setSelectedZone(zone);
    setCurrentView('zone-detail');
  };

  const handleBackToDashboard = () => {
    setSelectedZone(null);
    setCurrentView('dashboard');
  };

  const handleAcknowledgeAlert = () => {
    if (activeAlert) {
      const acknowledged = { ...activeAlert, acknowledged: true };
      setActiveAlert(acknowledged);
      // Add to fault log so acknowledged/ignored alerts are recorded
      setFaultLog(prev => [acknowledged, ...prev]);
      // Suppress re-showing this alert for the ACK_TTL period
      setAcknowledgedMap(prev => ({ ...prev, [acknowledged.id]: Date.now() }));
    }
    // Clear alert after acknowledgment
    setTimeout(() => {
      setActiveAlert(null);
    }, 100);
  };

  // UX4G: Handle Fix Issue - Immediately close alert and mark as resolved
  const handleFixIssue = () => {
    if (activeAlert) {
      // Mark as resolved and acknowledged but DO NOT add to fault log
      setActiveAlert({ ...activeAlert, acknowledged: true });
    }
    // Immediately close the alert
    setActiveAlert(null);
  };

  // Show alert screen if there's an active critical alert
  if (activeAlert && !activeAlert.acknowledged) {
    return (
      <AlertScreen 
        alert={activeAlert} 
        onAcknowledge={handleAcknowledgeAlert} 
        onFixIssue={handleFixIssue}
        onViewZone={() => {
          const z = zones.find(z => z.id === activeAlert.zoneId);
          if (z) handleZoneClick(z);
        }}
      />
    );
  }

  // Main view routing
  if (!isAuthenticated) {
    return <LoginScreen onLogin={handleLogin} error={loginError} />;
  }

  if (currentView === 'zone-detail' && selectedZone) {
    return <ZoneDetail zone={selectedZone} onBack={handleBackToDashboard} />;
  }

  return (
    <Dashboard
      onZoneClick={handleZoneClick}
      onLogout={handleLogout}
      zones={zones}
      activeAlerts={getActiveFaultAlerts(zones)}
      faultLog={faultLog}
    />
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;