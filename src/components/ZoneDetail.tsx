import React, { useState, useEffect } from 'react';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { Zone, DeviceReading, HistoricalData } from '../types';
import { DeviceCard } from './DeviceCard';
import { CurrentChart } from './CurrentChart';
import { ThemeToggle } from './ThemeToggle';
import {
  generateHistoricalData,
  generatePredictions,
  calculateConfidence,
  generateMockDevice,
} from '../utils/mockData';

interface ZoneDetailProps {
  zone: Zone;
  onBack: () => void;
}

export function ZoneDetail({ zone: initialZone, onBack }: ZoneDetailProps) {
  const [zone, setZone] = useState(initialZone);
  const [selectedDevice, setSelectedDevice] = useState<DeviceReading | null>(null);
  const [historicalData, setHistoricalData] = useState<HistoricalData[]>([]);
  const [predictions, setPredictions] = useState<HistoricalData[]>([]);
  const [confidence, setConfidence] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [timeRange, setTimeRange] = useState<'1h' | '24h' | '7d'>('24h');

  useEffect(() => {
    const interval = setInterval(() => {
      const updatedDevices = zone.devices.map(device =>
        generateMockDevice(device.deviceId, device.zoneId)
      );
      
      const criticalDevices = updatedDevices.filter(d => d.status === 'critical').length;
      const warningDevices = updatedDevices.filter(d => d.status === 'warning').length;
      const activeWarnings = criticalDevices + warningDevices;

      const zoneStatus = 
        criticalDevices > 0 ? 'critical' as const : 
        warningDevices > 0 ? 'warning' as const : 'normal' as const;

      setZone({
        ...zone,
        devices: updatedDevices,
        activeWarnings,
        status: zoneStatus,
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [zone]);

  useEffect(() => {
    if (selectedDevice) {
      const hours = timeRange === '1h' ? 1 : timeRange === '24h' ? 24 : 168;
      const historical = generateHistoricalData(selectedDevice.deviceId, hours);
      const predicted = generatePredictions(historical);
      const conf = calculateConfidence(historical);

      setHistoricalData(historical);
      setPredictions(predicted);
      setConfidence(conf);
    }
  }, [selectedDevice, timeRange]);

  const criticalDevices = zone.devices.filter(d => d.status === 'critical');
  const warningDevices = zone.devices.filter(d => d.status === 'warning');
  const normalDevices = zone.devices.filter(d => d.status === 'normal');

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'critical': return 'var(--accent-critical)';
      case 'warning': return 'var(--accent-warning)';
      default: return 'var(--accent-success)';
    }
  };

  return (
    <div style={{ background: 'var(--bg-primary)' }} className="min-h-screen">
      {/* Header */}
      <div style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 rounded hover:opacity-75"
              style={{ background: 'var(--surface-normal)', color: 'var(--accent-primary)' }}
              title="Back"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                {zone.name}
              </h1>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                {zone.devices.length} devices • {zone.activeWarnings} warning{zone.activeWarnings !== 1 ? 's' : ''}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <div className="px-3 py-1 rounded text-sm font-bold" style={{ background: getStatusColor(zone.status) + '20', color: getStatusColor(zone.status), border: `1px solid ${getStatusColor(zone.status)}` }}>
              {zone.status.toUpperCase()}
            </div>
          </div>
        </div>
      </div>

      {/* Alert Banner */}
      {zone.activeWarnings > 0 && (
        <div style={{ background: getStatusColor(zone.status) + '10', borderBottom: `1px solid ${getStatusColor(zone.status)}` }}>
          <div className="max-w-7xl mx-auto px-6 py-3 flex items-start gap-2">
            <AlertCircle size={16} style={{ color: getStatusColor(zone.status), marginTop: '2px', flexShrink: 0 }} />
            <div>
              <p className="text-sm font-medium mb-1" style={{ color: getStatusColor(zone.status) }}>
                {zone.status === 'critical' ? 'Critical' : 'Warning'} - {zone.activeWarnings} device{zone.activeWarnings !== 1 ? 's' : ''} affected
              </p>
              <div className="flex flex-wrap gap-2">
                {criticalDevices.map(d => (
                  <span key={d.deviceId} className="text-xs px-2 py-0.5 rounded" style={{ background: 'var(--surface-critical)', color: 'var(--accent-critical)' }}>
                    {d.deviceId}: {d.current}A
                  </span>
                ))}
                {warningDevices.map(d => (
                  <span key={d.deviceId} className="text-xs px-2 py-0.5 rounded" style={{ background: 'var(--surface-warning)', color: 'var(--accent-warning)' }}>
                    {d.deviceId}: {d.current}A
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chart Section */}
      {selectedDevice && (
        <div style={{ borderBottom: '1px solid var(--border-color)' }}>
          <div className="max-w-7xl mx-auto px-6 py-6">
            <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
              {selectedDevice.deviceId} - Analytics
            </h2>
            <div className="flex gap-2 mb-4">
              {(['1h', '24h', '7d'] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className="px-3 py-1.5 rounded text-xs font-semibold transition-all"
                  style={{
                    background: timeRange === range ? 'var(--accent-primary)' : 'var(--bg-secondary)',
                    color: timeRange === range ? 'white' : 'var(--text-primary)',
                    border: `1px solid ${timeRange === range ? 'var(--accent-primary)' : 'var(--border-color)'}`,
                  }}
                >
                  {range}
                </button>
              ))}
            </div>
            <CurrentChart
              data={historicalData}
              predictions={predictions}
              deviceId={selectedDevice.deviceId}
              confidence={confidence}
            />
          </div>
        </div>
      )}

      {/* Devices Section */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Devices</h2>
          <div className="flex gap-6 text-sm mb-4">
            <span style={{ color: 'var(--text-secondary)' }}>
              <span style={{ color: 'var(--accent-success)' }}>●</span> {normalDevices.length}
            </span>
            <span style={{ color: 'var(--text-secondary)' }}>
              <span style={{ color: 'var(--accent-warning)' }}>●</span> {warningDevices.length}
            </span>
            <span style={{ color: 'var(--text-secondary)' }}>
              <span style={{ color: 'var(--accent-critical)' }}>●</span> {criticalDevices.length}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {criticalDevices.map((device) => (
            <DeviceCard
              key={device.deviceId}
              device={device}
              onClick={() => setSelectedDevice(device)}
            />
          ))}
          {warningDevices.map((device) => (
            <DeviceCard
              key={device.deviceId}
              device={device}
              onClick={() => setSelectedDevice(device)}
            />
          ))}
          {normalDevices.map((device) => (
            <DeviceCard
              key={device.deviceId}
              device={device}
              onClick={() => setSelectedDevice(device)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}