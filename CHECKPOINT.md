# SaSLoop Development Checkpoint

> **To resume work in a new conversation, tell the agent: `read checkpoint`**
> The agent should read this file at `c:\Users\Sajad\Desktop\SaSLoop\CHECKPOINT.md`

---

## Last Updated
- **Date**: 2026-06-17 22:25 IST
- **Conversation**: `832fe37e-cc6a-4502-a268-fc8186b73341`
- **Git Commit**: `83e6cc5` (pushed to GitHub)

## Current State
- App is **built and deployed** to https://backend.sasloop.in
- PM2 processes: `server` + `start-tunnel` are online
- Version: `1.0.1`
- Auto-backup runs every 5 minutes via Windows Task Scheduler (`SaSLoop-AutoBackup`) to a local Shadow Git repository (`C:\Users\Sajad\Desktop\SaSLoop_Backups`) to keep the main project history clean.

## Recently Completed
- Designed full pictured slideshow with zoom/crossfade transitions on the login page (using 5 high-fidelity mockups: Billing, KDS, Floor Plans, Receipts, and Reports)
- Increased login page custom titlebar height to h-11 and made window control buttons span the full height with larger icons
- Added dashboard support hotline numbers absolutely centered on the login page titlebar
- Replaced login title text with a styled "SaSLoop POS" brand title
- Removed legacy animated background lines and FeatureShowcase layout from login page
- Electron build repackaged successfully with updated windows desktop installer (sasloop-pos-v1.0.1 Setup 1.0.1.exe)

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
