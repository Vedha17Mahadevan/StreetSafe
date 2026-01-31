import os
import requests
import pandas as pd
from dotenv import load_dotenv

load_dotenv()

DB_URL = os.environ.get('FIREBASE_DATABASE_URL')
AUTH = os.environ.get('FIREBASE_AUTH')  # optional

def fetch_zone_b():
    if not DB_URL:
        raise RuntimeError('FIREBASE_DATABASE_URL not set in environment')

    url = DB_URL.rstrip('/') + '/zones/B/devices.json'
    if AUTH:
        url += f'?auth={AUTH}'

    print('Fetching', url)
    resp = requests.get(url, timeout=10)
    resp.raise_for_status()
    data = resp.json() or {}

    rows = []
    for dev_id, d in data.items():
        rows.append({
            'deviceId': dev_id,
            'current': float(d.get('current', 0)),
            'averageCurrent': float(d.get('averageCurrent', 0)),
            'peakCurrent': float(d.get('peakCurrent', 0)),
            'minCurrent': float(d.get('minCurrent', 0)),
            'fluctuationRate': float(d.get('fluctuationRate', 0)),
            'timestamp': int(d.get('timestamp', 0)) or None,
        })

    if not rows:
        print('No devices found for Zone B')

    df = pd.DataFrame(rows)

    # Simple heuristic label so training can proceed (adjust thresholds as needed)
    if 'current' in df:
        df['risk'] = ((df['current'] > 25) | (df['fluctuationRate'] > 7)).astype(int)
    else:
        df['risk'] = 0

    out_path = os.path.join(os.path.dirname(__file__), '..', 'zoneB_data.csv')
    df.to_csv(out_path, index=False)
    print('Wrote', out_path)

if __name__ == '__main__':
    fetch_zone_b()
