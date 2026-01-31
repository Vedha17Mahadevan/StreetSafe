import React from 'react';
import { AlertCircle, Clock, MapPin } from 'lucide-react';
import { FaultAlert } from '../types';

interface FaultLogProps {
  alerts: FaultAlert[];
  onViewZone?: (zoneId: string) => void;
}

export function FaultLog({ alerts, onViewZone }: FaultLogProps) {
  if (alerts.length === 0) {
    return (
      <div className="p-4 rounded text-center" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
        <p className="text-sm font-medium" style={{ color: 'var(--accent-success)' }}>
          ✓ All systems normal
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3 max-h-[600px] overflow-y-auto">
      {alerts.map((alert) => {
        const isCritical = alert.status === 'critical';
        const bgColor = isCritical ? 'var(--surface-critical)' : 'var(--surface-warning)';
        const textColor = isCritical ? 'var(--accent-critical)' : 'var(--accent-warning)';
        const borderColor = isCritical ? 'var(--accent-critical)' : 'var(--accent-warning)';

        return (
          <div key={alert.id} className="rounded p-3" style={{ background: 'var(--bg-secondary)', border: `1px solid ${borderColor}` }}>
            <div className="flex items-start gap-2 mb-2">
              <AlertCircle size={16} style={{ color: textColor, flexShrink: 0, marginTop: '2px' }} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium" style={{ color: textColor }}>
                  {isCritical ? 'CRITICAL' : 'WARNING'}
                </p>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  {alert.deviceId}
                </p>
              </div>
              <p className="text-sm font-bold" style={{ color: textColor }}>
                {alert.current}A
              </p>
            </div>

            <div className="space-y-1 mb-3 text-xs" style={{ color: 'var(--text-secondary)' }}>
              <div className="flex items-center gap-2">
                <MapPin size={12} />
                <span>{alert.zoneName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={12} />
                <span>
                  {new Date(alert.timestamp).toLocaleTimeString('en-IN', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            </div>

            <button
              onClick={() => onViewZone && onViewZone(alert.zoneId)}
              className="w-full py-1.5 rounded text-xs font-large text-white transition-all hover:opacity-85"
              style={{ background: textColor }}
            >
              View Details
            </button>
          </div>
        );
      })}
    </div>
  );
}
