import React from 'react';
import { Zap } from 'lucide-react';
import { DeviceReading } from '../types';

interface DeviceCardProps {
  device: DeviceReading;
  onClick?: () => void;
}

export function DeviceCard({ device, onClick }: DeviceCardProps) {
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'critical': return 'var(--accent-critical)';
      case 'warning': return 'var(--accent-warning)';
      default: return 'var(--accent-success)';
    }
  };

  return (
    <button
      onClick={onClick}
      className="rounded p-4 w-full text-left transition-all hover:shadow-md"
      style={{ 
        background: 'var(--bg-secondary)',
        border: `1px solid ${getStatusColor(device.status)}`,
      }}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <Zap size={16} style={{ color: getStatusColor(device.status) }} />
          <h4 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
            {device.deviceId}
          </h4>
        </div>
        <span className="text-xs font-medium px-2 py-1 rounded" style={{ background: getStatusColor(device.status) + '20', color: getStatusColor(device.status) }}>
          {device.status.charAt(0).toUpperCase() + device.status.slice(1)}
        </span>
      </div>

      <p className="text-xs mb-2" style={{ color: 'var(--text-secondary)' }}>Current</p>
      <p className="text-2xl font-bold mb-3" style={{ color: getStatusColor(device.status) }}>
        {device.current} A
      </p>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div>
          <p style={{ color: 'var(--text-secondary)' }}>Peak</p>
          <p style={{ color: 'var(--text-primary)' }}>{device.peakCurrent}A</p>
        </div>
        <div>
          <p style={{ color: 'var(--text-secondary)' }}>Avg</p>
          <p style={{ color: 'var(--text-primary)' }}>{device.averageCurrent}A</p>
        </div>
        <div>
          <p style={{ color: 'var(--text-secondary)' }}>Min</p>
          <p style={{ color: 'var(--text-primary)' }}>{device.minCurrent}A</p>
        </div>
        <div>
          <p style={{ color: 'var(--text-secondary)' }}>Flux</p>
          <p style={{ color: 'var(--text-primary)' }}>{device.fluctuationRate}%</p>
        </div>
      </div>
    </button>
  );
}
