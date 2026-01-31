export type DeviceStatus = 'normal' | 'warning' | 'critical';

export interface DeviceReading {
  deviceId: string;
  zoneId: string;
  timestamp: number;
  current: number;
  averageCurrent: number;
  peakCurrent: number;
  minCurrent: number;
  fluctuationRate: number;
  status: DeviceStatus;
}

export interface Zone {
  id: string;
  name: string;
  devices: DeviceReading[];
  activeWarnings: number;
  status: DeviceStatus;
}

export interface FaultAlert {
  id: string;
  deviceId: string;
  zoneId: string;
  zoneName: string;
  current: number;
  timestamp: number;
  status: DeviceStatus;
  acknowledged: boolean;
}

export interface HistoricalData {
  timestamp: number;
  current: number;
  predicted?: boolean;
}
