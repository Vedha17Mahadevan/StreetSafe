# StreetSafe – IoT Powered Smart Electrical Safety System

> 🚨 Real-time overhead cable fault detection using IoT + ML + Cloud + Web and Mobile App
> HackIET 2026 | Track: AI + IoT
> Team: Rule Zero

---

## 🧠 The Problem

Electrical accidents due to damaged overhead cables, overloaded lines, and delayed fault detection cause Public safety hazards, Live wire accidents, Response delays, Economic losses and Poor visibility for authorities Current monitoring systems rely heavily on Manual inspection, Public complaints and Post-incident detection. There is **no affordable, integrated, real-time IoT-based early warning system** for public electrical infrastructure.

---

## 💡 Our Solution – StreetSafe

StreetSafe is a **Wi-Fi enabled smart circuit breaker warning system** that:

* Detects abnormal current and cable faults in real time
* Sends instant alerts to authorities and nearby residents
* Activates on-device LED & buzzer warnings
* Uses regression-based ML to predict potential failures
* Provides live monitoring dashboards via web & mobile app

It bridges hardware monitoring with intelligent cloud-based analytics.

---

## 🏗 System Architecture

```
Sensors → ESP32 → Firebase Realtime Database → Python Backend → Web & Mobile App
```

### 🔹 Hardware Layer

* Microcontroller: ESP32 
* Sensor: Current sensors
* Actuators: LED + buzzer alert system 

### 🔹 Cloud Layer

* Firebase Realtime Database
* Real-time logging
* Historical data storage

### 🔹 Intelligence Layer

* Regression-based anomaly detection
* Risk prediction from historical current patterns

### 🔹 Application Layer

* React Native mobile app
* Web dashboard for authorities
* Zone-based monitoring interface

---

## 🔥 Key Features

* ⚡ Real-Time Cable Fault Detection
* 🚨 Instant Alert & Notification System
* 📍 Zone-Based Monitoring
* 📊 Live Graphs & Historical Logs
* 🤖 ML-Based Risk Prediction
* 🔔 Visual + Audio Hardware Alerts
* 📱 Mobile + Web Dashboard

---

## 🛠 Tech Stack

### Frontend

* React Native
* TypeScript
* Firebase Sync
* ExpoGo (deployment/testing)

### Backend

* Python (event-driven fault logic)

### Database

* Firebase Realtime Database

### Hardware

* ESP32
* Current sensors
* Circuit breaker mechanism

---

## 🔄 Workflow

1. Sensor collects current data
2. ESP32 processes readings
3. Data sent to Firebase in real time
4. Fault detection logic triggers instantly
5. LED & buzzer activated locally
6. Alerts sent to app/dashboard
7. ML model analyzes historical trends

---

## 📈 Future Enhancements

* GSM/Cellular backup for no Wi-Fi zones
* Solar-powered hardware units
* SMS alerts & emergency auto-calls
* Government integration APIs
* Advanced ML models
* Smart city infrastructure integration

---

## 👥 Team – Rule Zero

| Name | Role | GitHub | LinkedIn |
|------|------|--------|----------|
| Chris Thomas Abraham | UI/UX Developer, IoT Engineer | [@ChrisToms14](https://github.com/ChrisToms14) | [Chris Thomas Abraham](https://www.linkedin.com/in/ChrisThomasAbraham) |
| Sradhya Renish | App Developer, Cloud Engineer | [@sradhya9](https://github.com/sradhya9) | [Sradhya Renish](https://www.linkedin.com/in/sradhya-renish-74181621b/) |
| Vasundhara S R | Web Developer, Backend Engineer | [@Vasundhara-331](https://github.com/Vasundhara-331) | [Vasundhara S R](https://www.linkedin.com/in/vasundhara-s-r/) |
| Vedha Mahadevan | AI Developer, Hardware Engineer | [@Vedha17Mahadevan](https://github.com/Vedha17Mahadevan) | [Vedha Mahadevan](http://www.linkedin.com/in/vedha-mahadevan) |

---

## 🚀 How to Run

### Hardware Setup

* Flash ESP32 with provided firmware
* Connect current sensor
* Configure Wi-Fi credentials

### Backend

```bash
pip install -r requirements.txt
python app.py
```

### Mobile App

```bash
npm install
expo start
```

Ensure Firebase configuration is added before running.

---

## 🏆 Hackathon Details

* Event: HackIET 2026
* Track: AI + IoT
* Institution: MBCET
* Date: January 31, 2026

---

# Why This Project Stands Out

Unlike traditional monitoring systems, StreetSafe combines:

* IoT hardware
* Real-time cloud sync
* Event-driven backend
* Mobile & web interface
* Predictive ML layer

All delivered as a functional MVP within a hackathon timeframe.

