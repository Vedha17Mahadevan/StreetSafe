import argparse
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
import joblib
import os

parser = argparse.ArgumentParser()
parser.add_argument('--zone', choices=['A','B','C','D','E'], default='A')
args = parser.parse_args()

ZONE = args.zone
DATA_FILE = os.path.join(os.path.dirname(__file__), '..', f'zone{ZONE}_data.csv')

if not os.path.exists(DATA_FILE):
    raise SystemExit(f"Data file not found: {DATA_FILE}. Run generate_mock_data.py or fetch_zone_b.py for Zone B.")

df = pd.read_csv(DATA_FILE)
print(f"\n--- Running Analysis for Zone {ZONE} ---")
print("Data Loaded. Total rows:", len(df))

if 'risk' not in df.columns:
    raise SystemExit('Data must include a "risk" column')

X = df.drop('risk', axis=1).select_dtypes(include=[float, int])
y = df['risk']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

accuracy = model.score(X_test, y_test)
print('Model Accuracy:', round(accuracy*100,2), '%')

model_path = os.path.join(os.path.dirname(__file__), '..', f'zone{ZONE}_model.pkl')
joblib.dump(model, model_path)
print(f'Model Saved as {model_path}')

# Predict using latest data
if ZONE == 'B':
    latest_data = X.tail(10).mean().to_frame().T
else:
    latest_data = X.iloc[-1:]

probs = model.predict_proba(latest_data)[0]
if len(probs) == 1:
    risk_percent = 0.0
else:
    # assume class 1 is risk
    risk_percent = round(probs[1]*100,2)

if ZONE == 'A':
    if risk_percent < 15:
        status = 'SAFE (Low Risk)'
    elif risk_percent < 40:
        status = 'SAFE (Monitor)'
    elif risk_percent < 70:
        status = 'WARNING'
    else:
        status = 'CRITICAL'
elif ZONE == 'B':
    if risk_percent < 50:
        status = 'WARNING (Low)'
    elif risk_percent < 70:
        status = 'WARNING (High)'
    else:
        status = 'CRITICAL'
else:
    # Use A's thresholds for other zones
    if risk_percent < 15:
        status = 'SAFE (Low Risk)'
    elif risk_percent < 40:
        status = 'SAFE (Monitor)'
    elif risk_percent < 70:
        status = 'WARNING'
    else:
        status = 'CRITICAL'

print('\n--- Latest Area Status ---')
print('Zone:', ZONE)
print('Risk:', risk_percent, '%')
print('Status:', status)
