import numpy as np
import pandas as pd
import os

def generate_zone_data(rows=1000, seed=42):
    np.random.seed(seed)
    currents = np.random.normal(loc=8, scale=3, size=rows).clip(0.1, 60)
    peak = currents * (1.05 + np.random.rand(rows) * 0.4)
    minimum = currents * (0.75 - np.random.rand(rows) * 0.2)
    average = (currents + peak + minimum) / 3
    fluct = np.random.rand(rows) * 10

    # Simple heuristic risk label for mock data
    risk = ((currents > 22) | (fluct > 7)).astype(int)

    df = pd.DataFrame({
        'current': np.round(currents, 2),
        'averageCurrent': np.round(average, 2),
        'peakCurrent': np.round(peak, 2),
        'minCurrent': np.round(minimum, 2),
        'fluctuationRate': np.round(fluct, 2),
        'risk': risk,
    })
    return df

def main():
    out_dir = os.path.join(os.path.dirname(__file__), '..')
    df = generate_zone_data(800)
    pathA = os.path.join(out_dir, 'zoneA_data.csv')
    df.to_csv(pathA, index=False)
    print('Wrote', pathA)

    # Copy for C, D, E
    for z in ['C', 'D', 'E']:
        path = os.path.join(out_dir, f'zone{z}_data.csv')
        df.sample(frac=1).reset_index(drop=True).to_csv(path, index=False)
        print('Wrote', path)

if __name__ == '__main__':
    main()
