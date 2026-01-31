import Papa from 'papaparse';
import { DeviceReading, Zone } from '../types';

// Load CSV file for given zone and parse into Zone object
export async function loadZoneFromCSV(zoneId: string): Promise<Zone> {
  const response = await fetch(`/zone${zoneId}_data.csv`);
  if (!response.ok) {
    throw new Error(`Failed to fetch CSV for zone ${zoneId}`);
  }
  const csvText = await response.text();

  return new Promise((resolve, reject) => {
    Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const devices: DeviceReading[] = results.data.map((row: any) => ({
          deviceId: row.deviceId,
          zoneId: zoneId,
          timestamp: Number(row.timestamp),
          current: Number(row.current),
          averageCurrent: Number(row.averageCurrent),
          peakCurrent: Number(row.peakCurrent),
          minCurrent: Number(row.minCurrent),
          fluctuationRate: Number(row.fluctuationRate),
          status: row.status.toLowerCase(),
        }));

        const criticalDevices = devices.filter(d => d.status === 'critical').length;
        const warningDevices = devices.filter(d => d.status === 'warning').length;
        const activeWarnings = criticalDevices + warningDevices;
        const zoneStatus = criticalDevices > 0 ? 'critical' : warningDevices > 0 ? 'warning' : 'normal';

        resolve({
          id: zoneId,
          name: `Zone ${zoneId}`,
          devices,
          activeWarnings,
          status: zoneStatus,
        });
      },
      error: (err) => reject(err),
    });
  });
}

// Load all zones except B from CSV
export async function loadAllZonesFromCSV(): Promise<Zone[]> {
  const zoneIds = ['A', 'C', 'D', 'E'];
  const promises = zoneIds.map(id => loadZoneFromCSV(id));
  return Promise.all(promises);
}
