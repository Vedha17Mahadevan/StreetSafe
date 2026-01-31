import React from 'react';
import { MapPin } from 'lucide-react';
import { Zone } from '../types';

interface ZoneCardProps {
  zone: Zone;
  onClick: () => void;
}

export function ZoneCard({ zone, onClick }: ZoneCardProps) {
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'critical': return 'var(--accent-critical)';
      case 'warning': return 'var(--accent-warning)';
      default: return 'var(--accent-success)';
    }
  };

  const normalCount = zone.devices.filter(d => d.status === 'normal').length;
  const warningCount = zone.devices.filter(d => d.status === 'warning').length;
  const criticalCount = zone.devices.filter(d => d.status === 'critical').length;

  return (
    <button
      onClick={onClick}
      className="w-full rounded-lg p-6 text-left hover:shadow-lg transition-all active:scale-95"
      style={{ 
        background: 'var(--bg-secondary)',
        border: `1px solid ${getStatusColor(zone.status)}`,
        minHeight: 140,
      }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <MapPin size={22} style={{ color: getStatusColor(zone.status) }} />
          <h3 className="font-bold text-xl" style={{ color: 'var(--text-primary)' }}>
            {zone.name}
          </h3>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-3">
        <div>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Devices</p>
          <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{zone.devices.length}</p>
        </div>
        <div>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Warnings</p>
          <p className="text-2xl font-bold" style={{ color: zone.activeWarnings > 0 ? getStatusColor(zone.status) : 'var(--text-primary)' }}>
            {zone.activeWarnings}
          </p>
        </div>
        <div>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Status</p>
          <p className="text-2xl font-bold" style={{ color: getStatusColor(zone.status) }}>
            {zone.status.charAt(0).toUpperCase() + zone.status.slice(1)}
          </p>
        </div>
      </div>

      <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
        {normalCount} Normal • {warningCount} Warning • {criticalCount} Critical
      </div>
    </button>
  );
}
