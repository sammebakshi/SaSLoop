# SaSLoop Development Checkpoint

> **To resume work in a new conversation, tell the agent: `read checkpoint`**
> The agent should read this file at `c:\Users\Sajad\Desktop\SaSLoop\CHECKPOINT.md`

---

## Last Updated
- **Date**: 2026-07-20 12:38 IST
- **Conversation**: `c998d905-0df8-4875-9b1a-5e90cde5d163`

## Current State
- App is **built and deployed** to https://backend.sasloop.in
- PM2 processes: `server` + `start-tunnel` are online
- Version: `1.0.1`
- Auto-backup runs every 5 minutes via Windows Task Scheduler (`SaSLoop-AutoBackup`) to a local Shadow Git repository (`C:\Users\Sajad\Desktop\SaSLoop_Backups`) to keep the main project history clean.

## Recently Completed
- Standardized all 16 cashier-facing and sales front-office popup windows to the premium Universal Design Module / Unified Design Modal (UDM) standard:
  1. **Choose Payment Mode / Settle Bill Modal**
  2. **Pay Previous Balance Modal** (with custom customer info card inside body to prevent header congestion)
  3. **Old KOT Modal**
  4. **Change Table / Transfer Order Modal**
  5. **Transfer Items to Table Modal**
  6. **Select Waiter / Staff Modal**
  7. **Select Delivery Boy / Rider Modal**
  8. **Apply Coupon Discount Modal**
  9. **Additional Charges Modal**
  10. **Customer Profile & History Modal**
  11. **Apply Discount Modal**
  12. **Confirm Logout Modal**
  13. **Split Bill Modal** (with split option selector integrated into Title Bar)
  14. **Daily Expense Ledger Modal**
  15. **Modifier Selection Modal** (with visual banner and product customization details integrated into body)
  16. **Open Price Keypad Modal** (with target product info badge inside body)
- Standardized container corners to `rounded-3xl` with `transition-all`.
- Replaced custom headers with the unified `h-11` Title Bar featuring the brand prefix `SaSLoop`, standard Lucide icons, page titles, and the standard hover-responsive close button.
- Electron build repackaged successfully with updated windows desktop installer (`Master-POS-Setup-v1.0.1.exe`) and updated unpacked master binaries (`win-unpacked-master`).

## In Progress
- Nothing currently in progress

## Key Files
- POS Client: `pos-app/src/App.jsx` (~24,800 lines)
- Backend: `server.js`
- Deploy: `fast-deploy.ps1`
- Auto-backup: `auto-backup.ps1`

## Build & Deploy Commands
```powershell
cd c:\Users\Sajad\Desktop\SaSLoop\pos-app
node build-master.cjs
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
