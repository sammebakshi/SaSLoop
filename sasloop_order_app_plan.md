# SaSLoop Orders App — Master Blueprint & Implementation Plan

> **DOCUMENT NAME**: `sasloop_order_app_plan.md`  
> **LOCATION**: `c:\Users\Sajad\Desktop\SaSLoop\sasloop_order_app_plan.md`  
> **APP TARGET FOLDER**: `c:\Users\Sajad\Desktop\SaSLoop\SaSLoop-Orders-app`  
> **APP DISPLAY NAME**: `SaSLoop Orders`  
> **PRIMARY BACKEND API**: `https://backend.sasloop.in`  

---

## 📌 Executive Summary & Handoff Directive for AI Agents

This document is the **single source of truth** for building the **SaSLoop Orders** mobile application. If an AI session ends or quota exhausts at any point, **any future agent can read this file and resume execution immediately without asking redundant questions.**

---

## 🎯 Primary Goal & Requirements

Build a high-performance, mobile-first web & Android companion application named **SaSLoop Orders** inside `c:\Users\Sajad\Desktop\SaSLoop\SaSLoop-Orders-app`.

### Key Capabilities:
1. **Backoffice Login**: Restaurant owners and staff log in using their existing Backoffice `username` and `password`.
2. **Real-Time Sound Alert Engine**: Plays a loud, repeating audio chime whenever a new order (WhatsApp, Online Menu, QR) or table reservation arrives.
3. **Live Orders Dashboard**: View, filter, and change statuses of live orders with 1 tap (Accept, Prepare, Dispatch, Complete, Cancel).
4. **Live Table Reservations Dashboard**: View pending bookings with seating areas, date & time, guest count, and 1-tap Accept/Decline actions (which trigger automated WhatsApp updates to customers).
5. **Outlet Switcher & Settings**: Allows switching between multiple outlets and toggling sound alerts.

---

## 🛠️ Complete Project Folder Architecture

```
SaSLoop-Orders-app/
├── public/
│   ├── index.html
│   ├── manifest.json
│   └── alert_chime.mp3
├── src/
│   ├── assets/
│   │   ├── logo.png
│   │   └── notification_bell.svg
│   ├── services/
│   │   ├── api.js                # Axios HTTP client pointing to https://backend.sasloop.in
│   │   ├── audioService.js       # WebAudio Web Synth + MP3 audio alert player
│   │   └── notificationService.js# Push & In-app notifications
│   ├── components/
│   │   ├── Navbar.jsx            # Mobile header with outlet selector & sound status indicator
│   │   ├── BottomNav.jsx         # Mobile bottom tab bar (Orders, Reservations, Settings)
│   │   ├── OrderCard.jsx         # Individual order card with status badges & 1-tap actions
│   │   ├── ReservationCard.jsx   # Individual reservation card with seating area & Accept/Decline
│   │   ├── SoundAlertBanner.jsx  # Floating banner when unacknowledged new items arrive
│   │   └── CancelOrderModal.jsx  # Rejection reason modal for cancelling orders
│   ├── pages/
│   │   ├── Login.jsx             # Backoffice credential login screen
│   │   ├── Orders.jsx            # Live orders feed view with status filters
│   │   ├── Reservations.jsx      # Live table reservations feed view
│   │   └── Settings.jsx          # Sound test, outlet switcher, profile & logout
│   ├── App.jsx                   # Main Router, Authentication & Polling State Controller
│   ├── index.css                 # Vanilla CSS & Tailwind utility design system
│   └── main.jsx                  # React DOM entry point
├── package.json
└── vite.config.js
```

---

## 📡 Backend API Integration Specs (`https://backend.sasloop.in`)

| Feature | Endpoint | Method | Headers / Auth | Description |
|---|---|---|---|---|
| **Login** | `/api/auth/login` | `POST` | `Content-Type: application/json` | Authenticates username & password. Returns JWT token & user object. |
| **Get Outlets** | `/api/brand/outlets` | `GET` | `Authorization: Bearer <token>` | Returns list of outlets owned by the user. |
| **Get Orders** | `/api/orders` | `GET` | `Authorization: Bearer <token>` | Returns live orders for the logged in business. |
| **Update Order Status** | `/api/orders/:id/status` | `PUT` | `Authorization: Bearer <token>` | Updates status (`PROCESSING`, `DISPATCHED`, `COMPLETED`, `CANCELLED`) and sends WhatsApp update to customer. |
| **Get Reservations** | `/api/reservations` | `GET` | `Authorization: Bearer <token>` | Returns table reservations list for the outlet. |
| **Update Reservation Status** | `/api/reservations/:id/status` | `PUT` | `Authorization: Bearer <token>` | Updates status (`CONFIRMED`, `REJECTED`, `CANCELLED`) and sends WhatsApp update to customer. |

---

## 📋 Step-by-Step Execution Plan for Agents

### Phase 1: Environment Initialization
1. Initialize Vite + React project inside `c:\Users\Sajad\Desktop\SaSLoop\SaSLoop-Orders-app`.
2. Install dependencies: `lucide-react`, `axios`, `framer-motion`, `clsx`, `tailwind-merge`.
3. Configure `vite.config.js` and `index.html` with app title **"SaSLoop Orders"**.

### Phase 2: Audio & API Service Layer
1. Build `src/services/api.js` to handle JWT authentication and API requests.
2. Build `src/services/audioService.js` using WebAudio API + HTML5 Audio fallback so sound alerts work on mobile browsers and WebView.

### Phase 3: UI Design System & Component Library
1. Create sleek dark/light mobile design tokens in `index.css`.
2. Build `Navbar.jsx` & `BottomNav.jsx` with mobile tab switching.
3. Build `OrderCard.jsx` displaying customer details, item list, totals, address, and 1-tap action buttons.
4. Build `ReservationCard.jsx` displaying guest count, date/time, seating area, and Accept/Decline buttons.

### Phase 4: Core Page Implementation
1. Build `Login.jsx` with Backoffice credential authentication.
2. Build `Orders.jsx` with real-time polling (every 3 seconds) and sound alert trigger on new order IDs.
3. Build `Reservations.jsx` with real-time polling and sound alert trigger on new reservation IDs.
4. Build `Settings.jsx` with sound test button, outlet switcher, and logout.

### Phase 5: Verification & Build
1. Test local dev server (`npm run dev`).
2. Test production build (`npm run build`).
3. Verify that new orders & table reservations play sound alerts and update statuses cleanly.

---

## 📝 Resumption Instructions for Next Agent

If the current session ends:
1. Read this file `c:\Users\Sajad\Desktop\SaSLoop\sasloop_order_app_plan.md`.
2. Check if `c:\Users\Sajad\Desktop\SaSLoop\SaSLoop-Orders-app` exists.
3. Resume from the next incomplete phase in the Step-by-Step Execution Plan above!
