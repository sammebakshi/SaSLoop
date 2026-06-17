# SaSLoop: Universal POS & Rider Ecosystem 🚀

SaSLoop is a high-performance, multi-tenant business automation platform designed to replace browser-based POS systems with native Windows and Android applications.

## 🏗️ Ecosystem Architecture

The system is split into three core modules:

1.  **Central Dashboard (Backend)**: The "Brain" (Node.js/Postgres) that manages multi-tenant businesses, global catalogs, and syncs data to the cloud.
2.  **Universal POS Terminal (Windows/Android)**: A native software suite (React + Electron + Capacitor) that detects a business's "DNA" (Retail, Restaurant, Service) at login and dynamically rebuilds its UI to fit.
3.  **Rider Delivery App (Android)**: A lightweight partner app (React + Capacitor) with real-time GPS tracking, navigation, and item-verification checklists.

---

## 🛠️ Key Technical Features

### 🌍 Universal Business Logic (DNA Detection)
Instead of building separate apps for different industries, SaSLoop uses a **Feature-Gate System**. At login, the app fetches the business profile and unlocks:
- **Restaurant Mode**: Tables, floor plans, and dine-in management.
- **Retail Mode**: Barcode scanning, inventory tracking, and quick-checkout.
- **Service Mode**: Appointment booking and staff scheduling.

### 🔌 Hardware Integration (Native)
By moving to **Electron (Windows)** and **Capacitor (Android)**, SaSLoop can directly communicate with:
- USB/Bluetooth Thermal Printers.
- Cash Drawers.
- Physical Barcode Scanners.

### 🛰️ Rider Logistics
- **Real-time Tracking**: Broadcasts GPS coordinates to the SaSLoop cloud every few seconds.
- **Checklist Logic**: Riders must verify order items before marking "Picked Up."
- **One-Click Navigation**: Direct integration with Google Maps.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- Android Studio (for APK builds)
- Postgres (for local development)

### 1. Start the Backend
```bash
cd backend
npm install
npm run dev
```

### 2. Run the Windows POS (Dev Mode)
```bash
cd pos-app
npm install
npm run electron:dev
```

### 3. Build the Apps (.exe / .apk)
- **Windows Setup**: `cd pos-app && npm run electron:build`
- **Android APK**: `cd pos-app/android && ./gradlew assembleDebug`
- **Rider APK**: `cd rider-app/android && ./gradlew assembleDebug`

---

## ☁️ Cloud Deployment
To update the production server (`sasloop.in`):
```bash
cd ~/SaSLoop && git pull origin main && npm install && pm2 restart all
```

---

## 📬 Contact & Support
Developed for SaSLoop Production. All rights reserved.
