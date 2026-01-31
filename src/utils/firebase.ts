import { initializeApp, getApps } from 'firebase/app';
import { getDatabase, ref, onValue } from 'firebase/database';
import { DeviceReading } from '../types';

const env = (import.meta as any).env || {};

const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: env.VITE_FIREBASE_DATABASE_URL,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID,
};

function initDatabase() {
  if (!getApps().length) {
    initializeApp(firebaseConfig as any);
  }
  return getDatabase();
}

// Subscribe to a zone path in the realtime database. Expects data under `zones/{zoneId}/devices`.
export function subscribeToZoneDevices(
  zoneId: string,
  callback: (devices: DeviceReading[]) => void
): () => void {
  const db = initDatabase();
  const zoneRef = ref(db, `zones/${zoneId}/devices`);

  const unsub = onValue(zoneRef, (snapshot) => {
    const val = snapshot.val() || {};
    // Map children to DeviceReading-like objects. Caller should ensure DB shape matches.
    const devices: DeviceReading[] = Object.keys(val).map((key) => {
      const d = val[key] as any;
      return {
        deviceId: key,
        zoneId,
        timestamp: d.timestamp || Date.now(),
        current: parseFloat(String(d.current || 0)),
        averageCurrent: parseFloat(String(d.averageCurrent || 0)),
        peakCurrent: parseFloat(String(d.peakCurrent || 0)),
        minCurrent: parseFloat(String(d.minCurrent || 0)),
        fluctuationRate: parseFloat(String(d.fluctuationRate || 0)),
        status: (d.status || 'normal') as any,
      };
    });

    callback(devices);
  });

  return () => unsub();
}

export default null;
