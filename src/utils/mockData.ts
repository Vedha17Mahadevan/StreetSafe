import { DeviceReading, Zone, FaultAlert, DeviceStatus } from '../types';

// Generate mock device data
export function generateMockDevice(
  deviceId: string,
  zoneId: string,
  statusOverride?: DeviceStatus
): DeviceReading {
  const baseCurrents = {
    normal: { base: 8, variance: 2 },
    warning: { base: 18, variance: 3 },
    critical: { base: 35, variance: 5 },
  };

  const status = statusOverride || 
    (Math.random() > 0.95 ? 'warning' : Math.random() > 0.98 ? 'critical' : 'normal') as DeviceStatus;

  const { base, variance } = baseCurrents[status];
  const current = base + (Math.random() * variance * 2 - variance);
  const peakCurrent = current * (1.1 + Math.random() * 0.2);
  const minCurrent = current * (0.8 - Math.random() * 0.1);
  const averageCurrent = (current + peakCurrent + minCurrent) / 3;
  const fluctuationRate = Math.random() * 5;

  return {
    deviceId,
    zoneId,
    timestamp: Date.now(),
    current: parseFloat(current.toFixed(2)),
    averageCurrent: parseFloat(averageCurrent.toFixed(2)),
    peakCurrent: parseFloat(peakCurrent.toFixed(2)),
    minCurrent: parseFloat(minCurrent.toFixed(2)),
    fluctuationRate: parseFloat(fluctuationRate.toFixed(2)),
    status,
  };
}

// Generate mock zones
export function generateMockZones(): Zone[] {
  const zoneIds = ['A', 'B', 'C', 'D', 'E'];
  
  return zoneIds.map((id) => {
    const deviceCount = 4 + Math.floor(Math.random() * 4); // 4-7 devices per zone
    const devices: DeviceReading[] = [];
    
    for (let i = 1; i <= deviceCount; i++) {
      devices.push(generateMockDevice(`${id}-${i.toString().padStart(3, '0')}`, id));
    }

    const criticalDevices = devices.filter(d => d.status === 'critical').length;
    const warningDevices = devices.filter(d => d.status === 'warning').length;
    const activeWarnings = criticalDevices + warningDevices;

    const zoneStatus: DeviceStatus = 
      criticalDevices > 0 ? 'critical' : 
      warningDevices > 0 ? 'warning' : 'normal';

    return {
      id,
      name: `Zone ${id}`,
      devices,
      activeWarnings,
      status: zoneStatus,
    };
  });
}

// Generate historical data for charts
export function generateHistoricalData(
  deviceId: string,
  hours: number = 24
): Array<{ timestamp: number; current: number; predicted?: boolean }> {
  const data = [];
  const now = Date.now();
  const interval = (hours * 60 * 60 * 1000) / 50; // 50 data points
  
  let baseCurrent = 8 + Math.random() * 4;
  const trend = (Math.random() - 0.5) * 0.05;
  
  for (let i = 0; i < 50; i++) {
    baseCurrent += trend + (Math.random() - 0.5) * 2;
    baseCurrent = Math.max(5, Math.min(25, baseCurrent)); // Keep in range
    
    data.push({
      timestamp: now - (50 - i) * interval,
      current: parseFloat(baseCurrent.toFixed(2)),
    });
  }
  
  return data;
}

// Simple linear regression for predictions
export function generatePredictions(
  historicalData: Array<{ timestamp: number; current: number }>
): Array<{ timestamp: number; current: number; predicted: boolean }> {
  if (historicalData.length < 10) return [];

  // Use last 20 points for regression
  const recentData = historicalData.slice(-20);
  
  // Calculate linear regression
  const n = recentData.length;
  let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
  
  recentData.forEach((point, index) => {
    sumX += index;
    sumY += point.current;
    sumXY += index * point.current;
    sumX2 += index * index;
  });
  
  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;
  
  // Generate predictions for next 10 time steps
  const predictions = [];
  const lastTimestamp = historicalData[historicalData.length - 1].timestamp;
  const interval = historicalData[1].timestamp - historicalData[0].timestamp;
  
  for (let i = 1; i <= 10; i++) {
    const predictedCurrent = slope * (n + i - 1) + intercept;
    predictions.push({
      timestamp: lastTimestamp + i * interval,
      current: parseFloat(Math.max(0, predictedCurrent).toFixed(2)),
      predicted: true,
    });
  }
  
  return predictions;
}

// Calculate prediction confidence
export function calculateConfidence(
  historicalData: Array<{ timestamp: number; current: number }>
): 'Low' | 'Medium' | 'High' {
  if (historicalData.length < 20) return 'Low';
  
  const recentData = historicalData.slice(-20);
  const currents = recentData.map(d => d.current);
  const mean = currents.reduce((a, b) => a + b, 0) / currents.length;
  const variance = currents.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / currents.length;
  const stdDev = Math.sqrt(variance);
  const coefficientOfVariation = (stdDev / mean) * 100;
  
  if (coefficientOfVariation < 10) return 'High';
  if (coefficientOfVariation < 25) return 'Medium';
  return 'Low';
}

// Get active fault alerts
export function getActiveFaultAlerts(zones: Zone[]): FaultAlert[] {
  const alerts: FaultAlert[] = [];
  
  zones.forEach(zone => {
    zone.devices.forEach(device => {
      if (device.status === 'critical' || device.status === 'warning') {
        alerts.push({
          id: `${device.deviceId}-${device.timestamp}`,
          deviceId: device.deviceId,
          zoneId: zone.id,
          zoneName: zone.name,
          current: device.current,
          timestamp: device.timestamp,
          status: device.status,
          acknowledged: false,
        });
      }
    });
  });
  
  return alerts.sort((a, b) => b.timestamp - a.timestamp);
}
