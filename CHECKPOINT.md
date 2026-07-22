# SaSLoop Development Checkpoint

> **To resume work in a new conversation, tell the agent: `read checkpoint`**
> The agent should read this file at `c:\Users\Sajad\Desktop\SaSLoop\CHECKPOINT.md`

---

## Last Updated
- **Date**: 2026-07-21 23:55 IST
- **Conversation**: `1bb9e4d7-4176-4906-bfc9-9b827ff84195`

## Current State
- App is **built and deployed** to https://backend.sasloop.in
- PM2 processes: `server` + `start-tunnel` are online
- POS Desktop Version: `1.0.2` (`sasloop-master-pos-v1.0.2 Setup 1.0.2.exe`)
- Auto-backup runs every 5 minutes via Windows Task Scheduler (`SaSLoop-AutoBackup`) to a local Shadow Git repository (`C:\Users\Sajad\Desktop\SaSLoop_Backups`).

## Recently Completed
- **WhatsApp Sidebar Navigation**: Fixed bug where clicking WhatsApp icon forced `activeTab` back to `'home'` (Dashboard). Added `whatsapp` to `tabCheck` inside [App.jsx](file:///c:/Users/Sajad/Desktop/SaSLoop/pos-app/src/App.jsx) `useEffect`, added permission / passcode handling to `handleTabClick`, and wrapped sidebar icon with permission checks. Verified build cleanly compiled.
- **Unified Master Menu (POS + Digital + Custom)**: Replaced SQL parameter binding with `"m.id = $" + params.length` in `routes/brandRoutes.js` and `pos-app/server/routes/brandRoutes.js`. Verified selecting any registered menu (`pos menu`, `DIGI MENU`, `S MENU`, or custom menus) loads all items instantly.
- **WhatsApp Sidebar & Audio**: Fixed sidebar WhatsApp icon click handler to properly use `handleTabClick('whatsapp', ...)`. Added unread message bubble badge counter (`waUnreadCount`) over the sidebar icon and connected `playNewMessageSound()` from `./utils/soundHelper`.
- **Bill Settlement (Online vs Offline)**: Fixed PostgreSQL 500 error `invalid input syntax for type date: ""` in `routes/orderRoutes.js` by converting empty date strings `""` to `null`. Allowed order settlements to sync live instantly with **`Payment Settled & Synced Live!`**.
- **Builds & Deployments**: Built and deployed backend/dashboard changes live to https://backend.sasloop.in (`fast-deploy.ps1`). Built latest Electron POS desktop executable installer (`pos-app/release-v2/sasloop-master-pos-v1.0.2 Setup 1.0.2.exe`, 118.1 MB).

## In Progress
- Nothing currently in progress

## Key Files
- POS Client: `pos-app/src/App.jsx` (~19,400 lines)
- Backend: `server.js`
- Deploy: `fast-deploy.ps1`
- Auto-backup: `auto-backup.ps1`

## Build & Deploy Commands
```powershell
cd c:\Users\Sajad\Desktop\SaSLoop\pos-app
npm run electron:build
cd ..
powershell -ExecutionPolicy Bypass -File .\fast-deploy.ps1
```

## Git Backup Commands
```powershell
cd c:\Users\Sajad\Desktop\SaSLoop
git add -A
git commit -m "checkpoint: describe what changed"
git push origin main
```

## Important Notes
- `.gitignore` blocks: *.tar.gz, *.exe, *.key, *.pem
- Support phone: +918494089744
- GitHub repo: https://github.com/sammebakshi/SaSLoop
