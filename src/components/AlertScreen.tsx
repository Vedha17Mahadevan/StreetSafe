import React from 'react';
import { AlertTriangle, Zap, MapPin, Clock, CheckCircle, Wrench } from 'lucide-react';
import { FaultAlert } from '../types';

interface AlertScreenProps {
  alert: FaultAlert;
  onAcknowledge: () => void;
  onFixIssue: () => void;
}

export function AlertScreen({ alert, onAcknowledge, onFixIssue }: AlertScreenProps) {
  const [pulse, setPulse] = React.useState(true);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setPulse(prev => !prev);
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  const isCritical = alert.status === 'critical';

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
      style={{
        background: 'rgba(0, 0, 0, 0.95)',
      }}
    >
      <div className="max-w-5xl w-full">
        {/* Large Alert Icon with Pulse */}
        <div className="text-center mb-8">
          <div className={`inline-block ${pulse ? 'scale-110' : 'scale-100'} transition-transform duration-300`}>
            <AlertTriangle 
              size={140} 
              className="drop-shadow-[0_0_20px_rgba(255,0,0,0.5)]" 
              strokeWidth={3}
              style={{ color: '#ff0000' }}
            />
          </div>
        </div>

        {/* Main Alert Box */}
        <div 
          className="border-4 p-8 md:p-12 shadow-2xl"
          style={{
            borderColor: '#ff0000',
            background: '#000000',
          }}
        >
          {/* Clear, Large Heading */}
          <h1 className="text-5xl md:text-6xl font-bold text-center mb-4" style={{ color: '#ff0000' }}>
            ELECTRICAL FAULT DETECTED
          </h1>
          
          <div className="h-1 mb-8" style={{ background: '#ff0000' }}></div>

          {/* Icon + Text Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div 
              className="border-2 p-6"
              style={{
                background: '#1a1a1a',
                borderColor: '#ff0000',
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <MapPin size={32} style={{ color: '#ff0000' }} />
                <h3 className="text-xl font-bold" style={{ color: '#ffffff' }}>
                  LOCATION
                </h3>
              </div>
              <p className="text-2xl font-bold mb-2" style={{ color: '#ffffff' }}>
                {alert.zoneName}
              </p>
              <p className="text-lg" style={{ color: '#cccccc' }}>
                Device: {alert.deviceId}
              </p>
            </div>

            <div 
              className="border-2 p-6"
              style={{
                background: '#1a1a1a',
                borderColor: '#ff0000',
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <Zap size={32} style={{ color: '#ff0000' }} />
                <h3 className="text-xl font-bold" style={{ color: '#ffffff' }}>
                  CURRENT READING
                </h3>
              </div>
              <p className="text-3xl font-bold mb-2" style={{ color: '#ffffff' }}>
                {alert.current} A
              </p>
              <p 
                className="text-lg font-bold uppercase"
                style={{ color: '#ff0000' }}
              >
                {alert.status === 'critical' ? 'CRITICAL OVERLOAD' : 'WARNING LEVEL'}
              </p>
            </div>

            <div 
              className="border-2 p-6"
              style={{
                background: '#1a1a1a',
                borderColor: '#ff0000',
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <Clock size={32} style={{ color: '#ff0000' }} />
                <h3 className="text-xl font-bold" style={{ color: '#ffffff' }}>
                  TIME DETECTED
                </h3>
              </div>
              <p className="text-lg" style={{ color: '#ffffff' }}>
                {new Date(alert.timestamp).toLocaleString('en-IN', {
                  dateStyle: 'medium',
                  timeStyle: 'medium',
                })}
              </p>
            </div>

            <div 
              className="border-2 p-6"
              style={{
                background: '#1a1a1a',
                borderColor: '#ff0000',
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle size={32} style={{ color: '#ff0000' }} />
                <h3 className="text-xl font-bold" style={{ color: '#ffffff' }}>
                  SEVERITY
                </h3>
              </div>
              <p 
                className="text-2xl font-bold uppercase"
                style={{ color: '#ff0000' }}
              >
                {alert.status}
              </p>
            </div>
          </div>

          {/* Safety Instructions */}
          <div 
            className="border-2 p-6 mb-8"
            style={{
              background: '#330000',
              borderColor: '#ff0000',
            }}
          >
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: '#ffffff' }}>
              <Wrench size={24} style={{ color: '#ff0000' }} />
              IMMEDIATE ACTIONS REQUIRED:
            </h3>
            <ul className="space-y-3 text-lg" style={{ color: '#cccccc' }}>
              <li className="flex items-start gap-3">
                <span className="text-xl text-red-500">-</span>
                <span>Dispatch field team to {alert.zoneName}</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-xl text-red-500">-</span>
                <span>Isolate affected circuit if current exceeds 30A</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-xl text-red-500">-</span>
                <span>Check for cable damage or illegal connections</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-xl text-red-500">-</span>
                <span>Contact local substation for load balancing</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-xl text-red-500">-</span>
                <span>Document incident in maintenance log</span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Fix Issue Button - Primary Action */}
            <button
              onClick={onFixIssue}
              className="p-6 md:p-8 text-xl md:text-2xl font-bold border-4 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-2xl flex items-center justify-center gap-4"
              style={{
                background: '#00ff00',
                color: '#000000',
                borderColor: '#00ff00',
              }}
            >
              <CheckCircle size={32} style={{ color: '#000000' }} />
              <span>FIX ISSUE & CLOSE</span>
            </button>

            {/* Acknowledge Button - Secondary Action */}
            <button
              onClick={onAcknowledge}
              className="p-6 md:p-8 text-xl md:text-2xl font-bold border-4 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-4"
              style={{
                background: '#000000',
                color: '#ffffff',
                borderColor: '#ff0000',
              }}
            >
              <AlertTriangle size={32} style={{ color: '#ff0000' }} />
              <span>ACKNOWLEDGE ONLY</span>
            </button>
          </div>

          {/* Helper Text */}
          <p className="text-center mt-6 text-sm" style={{ color: '#cccccc' }}>
            "Fix Issue" will mark this fault as resolved and it will not be added to the fault log. "Acknowledge" will keep an entry in the fault log for later review.
          </p>
        </div>

        {/* Blinking Footer Alert */}
        <div className="text-center mt-8">
          <p 
            className={`text-2xl font-bold ${pulse ? 'opacity-100' : 'opacity-50'} transition-opacity`}
            style={{ color: '#ff0000' }}
          >
            CRITICAL INFRASTRUCTURE ALERT
          </p>
        </div>
      </div>
    </div>
  );
}