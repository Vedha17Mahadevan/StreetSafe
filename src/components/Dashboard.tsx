import React, { useState, useEffect } from 'react';
import { Download, RefreshCw, LogOut } from 'lucide-react';
import { Zone, FaultAlert } from '../types';
import { ZoneCard } from './ZoneCard';
import { FaultLog } from './FaultLog';
import { ThemeToggle } from './ThemeToggle';

interface DashboardProps {
  onZoneClick: (zone: Zone) => void;
  onLogout: () => void;
  zones: Zone[];
  activeAlerts: FaultAlert[];
  faultLog: FaultAlert[];
}

export function Dashboard({ onZoneClick, onLogout, zones, activeAlerts, faultLog }: DashboardProps) {
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Update lastUpdate whenever zones change (driven by App)
  useEffect(() => {
    setLastUpdate(new Date());
  }, [zones]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Expect App to refresh data; here we just update UI state briefly
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const handleExport = () => {
    const csvRows = [
      ['Timestamp', 'Zone', 'Device ID', 'Current (A)', 'Peak (A)', 'Average (A)', 'Min (A)', 'Fluctuation %', 'Status'],
      ...zones.flatMap(zone =>
        zone.devices.map(device => [
          new Date(device.timestamp).toLocaleString('en-IN'),
          zone.name,
          device.deviceId,
          device.current,
          device.peakCurrent,
          device.averageCurrent,
          device.minCurrent,
          device.fluctuationRate,
          device.status.toUpperCase(),
        ])
      ),
    ];
    const csvContent = csvRows.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `grid_monitoring_${Date.now()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const totalDevices = zones.reduce((sum, zone) => sum + zone.devices.length, 0);
  const totalWarnings = activeAlerts.length;
  const criticalAlerts = activeAlerts.filter(a => a.status === 'critical').length;

  return (
    <div style={{ background: 'var(--bg-primary)' }} className="min-h-screen">
      {/* Header */}
      <div style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Grid Monitor
          </h1>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button
              onClick={handleRefresh}
              className="p-2 rounded hover:opacity-75"
              style={{ background: 'var(--surface-normal)', color: 'var(--accent-primary)' }}
              disabled={isRefreshing}
              title="Refresh"
            >
              <RefreshCw size={18} className={isRefreshing ? 'animate-spin' : ''} />
            </button>
            <button
              onClick={handleExport}
              className="p-2 rounded hover:opacity-75"
              style={{ background: 'var(--surface-normal)', color: 'var(--accent-primary)' }}
              title="Export CSV"
            >
              <Download size={18} />
            </button>
            <button
              onClick={onLogout}
              className="p-2 rounded hover:opacity-75"
              style={{ background: 'var(--surface-critical)', color: 'var(--accent-critical)' }}
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <p className="text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Total Devices</p>
              <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{totalDevices}</p>
            </div>
            <div>
              <p className="text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Zones Online</p>
              <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{zones.length}</p>
            </div>
            <div>
              <p className="text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Warnings</p>
              <p className="text-2xl font-bold" style={{ color: totalWarnings > 0 ? 'var(--accent-warning)' : 'var(--text-primary)' }}>
                {totalWarnings}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Critical</p>
              <p className="text-2xl font-bold" style={{ color: criticalAlerts > 0 ? 'var(--accent-critical)' : 'var(--text-primary)' }}>
                {criticalAlerts}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Zones</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {zones.map((zone) => (
                <ZoneCard key={zone.id} zone={zone} onClick={() => onZoneClick(zone)} />
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Alerts</h2>
            <FaultLog
              alerts={faultLog}
              onViewZone={(zoneId: string) => {
                const z = zones.find((zone) => zone.id === zoneId);
                if (z) onZoneClick(z);
              }}
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)', marginTop: '3rem' }}>
        <div className="max-w-7xl mx-auto px-6 py-3 text-center text-xs" style={{ color: 'var(--text-secondary)' }}>
          Updated: {lastUpdate.toLocaleString('en-IN')}
        </div>
      </div>
    </div>
  );
}