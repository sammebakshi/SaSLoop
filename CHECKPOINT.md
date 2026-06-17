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
- Auto-backup runs every 5 minutes via Windows Task Scheduler (`SaSLoop-AutoBackup`)

## Recently Completed
- KOT duplicate item merging (`mergeBillItems` helper across all 5 save paths)
- Sub-tabs hidden in Quick Bill mode
- Toolbar cleanup (Gift → points history, Coupon SVG, Tables button)
- Version migration (19.02 → 1.0.1)
- Receipt: version/greeting swap + loyalty points section
- Fixed `handleOpenCouponModal` crash
- Git backup configured and pushed to GitHub

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
