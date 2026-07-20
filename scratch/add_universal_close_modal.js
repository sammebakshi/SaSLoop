const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, '..', 'pos-app', 'src', 'App.jsx');
let content = fs.readFileSync(appPath, 'utf8');
const isCRLF = content.includes('\r\n');
let n = content.replace(/\r\n/g, '\n');

// 1. Helper function to render close modal
const helperFunc = `  const renderCloseConfirmModal = () => {
    if (!isCloseConfirmModalOpen) return null;

    const unsyncedOrdersCount = (recentOrders || []).filter(o => o && (o.synced === false || (o.id && String(o.id).startsWith('L-')))).length;
    const unsyncedItemsCount = typeof getUnsyncedItemsCount === 'function' ? getUnsyncedItemsCount() : 0;
    const totalUnsynced = unsyncedOrdersCount + unsyncedItemsCount;

    return (
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
         <div className={\`w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border flex flex-col transition-all \${isDark ? 'bg-[#0d1117] border-[#30363d] text-white' : 'bg-white border-slate-200 text-slate-800'}\`}>
            {/* UDM Title Bar */}
            <div className={\`h-11 border-b flex items-center justify-between pl-4 pr-0 shrink-0 relative select-none w-full \${isDark ? 'bg-[#0d1117] border-[#30363d] text-white' : 'bg-white border-slate-200 text-slate-800'}\`}>
               <div className="text-[13px] font-bold tracking-wide flex items-center gap-1.5 select-none">
                  <Power className="text-[#18ba60]" size={14} />
                  <span className={isDark ? 'text-white' : 'text-slate-900'}>SaSLoop</span>
                  <span className="text-[#18ba60]">Exit Application</span>
               </div>
               <div className="flex items-center h-full">
                  <button
                     type="button"
                     onClick={() => setIsCloseConfirmModalOpen(false)}
                     className={\`w-12 h-full flex items-center justify-center transition-colors \${
                        isDark ? 'hover:bg-rose-600 text-slate-400 hover:text-white' : 'hover:bg-rose-600 text-slate-700 hover:text-white'
                     }\`}
                     title="Close"
                  >
                     <X size={14} strokeWidth={2.5} />
                  </button>
               </div>
            </div>

            {/* Body */}
            <div className={\`p-6 space-y-4 text-center \${isDark ? 'bg-[#0d1117]' : 'bg-white'}\`}>
               {isExitSyncing ? (
                  <div className="flex flex-col items-center justify-center py-6 space-y-4">
                     <div className="w-10 h-10 rounded-full border-4 border-[#18ba60]/20 border-t-[#18ba60] animate-spin" />
                     <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Synchronizing data with server before exit...</p>
                  </div>
               ) : (
                  <>
                     <div className="space-y-4">
                        <div className={\`w-14 h-14 rounded-full flex items-center justify-center mx-auto \${
                           totalUnsynced > 0 ? 'bg-amber-500/10 text-amber-500' : 'bg-emerald-500/10 text-emerald-500'
                        }\`}>
                           {totalUnsynced > 0 ? <AlertCircle size={28} /> : <CheckCircle size={28} />}
                        </div>
                        <div className="space-y-1">
                           <h4 className="text-xs font-black uppercase tracking-wider">
                              {totalUnsynced > 0 ? 'Unsynced Data Detected' : 'All Data Synchronized'}
                           </h4>
                           <p className={\`text-[11px] leading-relaxed \${isDark ? 'text-gray-400' : 'text-slate-500'}\`}>
                              {totalUnsynced > 0
                                 ? \`You have \${totalUnsynced} unsynced transaction(s) or menu update(s). Please sync first before exiting to prevent data loss.\`
                                 : 'Are you sure you want to close SaSLoop POS?'}
                           </p>
                        </div>
                     </div>

                     {/* Footer Actions */}
                     <div className="flex gap-3 justify-center pt-2">
                        {totalUnsynced > 0 ? (
                           <>
                              <button
                                 type="button"
                                 onClick={async () => {
                                    setIsExitSyncing(true);
                                    try {
                                       if (unsyncedOrdersCount > 0 && typeof handleSyncBills === 'function') {
                                          await handleSyncBills();
                                       }
                                       if (unsyncedItemsCount > 0 && typeof syncItemMgmtChanges === 'function') {
                                          await syncItemMgmtChanges();
                                       }
                                       toast.success("Sync completed successfully!");
                                       if (window.require) {
                                          try {
                                             const { ipcRenderer } = window.require('electron');
                                             ipcRenderer.send('force-close-app');
                                          } catch (e) { window.close(); }
                                       } else { window.close(); }
                                    } catch (err) {
                                       toast.error("Sync failed: " + err.message);
                                    } finally {
                                       setIsExitSyncing(false);
                                    }
                                 }}
                                 className="px-5 py-2.5 bg-[#18ba60] hover:bg-[#15a855] text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-all shadow-md"
                              >
                                 Sync & Exit
                              </button>
                              <button
                                 type="button"
                                 onClick={() => {
                                    if (window.require) {
                                       try {
                                          const { ipcRenderer } = window.require('electron');
                                          ipcRenderer.send('force-close-app');
                                       } catch (e) { window.close(); }
                                    } else { window.close(); }
                                 }}
                                 className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-all shadow-md"
                              >
                                 Force Exit
                              </button>
                           </>
                        ) : (
                           <button
                              type="button"
                              onClick={() => {
                                 if (window.require) {
                                    try {
                                       const { ipcRenderer } = window.require('electron');
                                       ipcRenderer.send('force-close-app');
                                    } catch (e) { window.close(); }
                                 } else { window.close(); }
                              }}
                              className="px-6 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-all shadow-md"
                           >
                              Yes, Exit POS
                           </button>
                        )}
                        <button
                           type="button"
                           onClick={() => setIsCloseConfirmModalOpen(false)}
                           className={\`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border \${
                              isDark ? 'border-[#30363d] text-slate-300 hover:bg-[#1f2937]' : 'border-slate-200 text-slate-600 hover:bg-slate-100'
                           }\`}
                        >
                           Cancel
                        </button>
                     </div>
                  </>
               )}
            </div>
         </div>
      </div>
    );
  };\n\n`;

// Insert helper before if (showInitialSplash)
const splashTarget = '  if (showInitialSplash) {';
if (!n.includes(splashTarget)) {
  console.error("❌ Could not find splash target");
  process.exit(1);
}

n = n.replace(splashTarget, helperFunc + splashTarget);

// Add {renderCloseConfirmModal()} to splash return
const splashReturnTarget = '        <InitialSplashScreen />\n      </div>';
n = n.replace(splashReturnTarget, '        <InitialSplashScreen />\n        {renderCloseConfirmModal()}\n      </div>');

// Add {renderCloseConfirmModal()} to !isAuthenticated return before line 11131 `</div>`
const loginReturnTarget = '            </AnimatePresence>\n         </div>\n      );';
n = n.replace(loginReturnTarget, '            </AnimatePresence>\n         {renderCloseConfirmModal()}\n         </div>\n      );');

// Replace the old inline modal block with {renderCloseConfirmModal()} in main return
const oldModalStart = '         {/* Close Application Confirmation Modal */}';
const oldModalEnd = '         )}\n\n        {logoutModalStep === \'confirm\' && (';

const idxStart = n.indexOf(oldModalStart);
const idxEnd = n.indexOf(oldModalEnd);

if (idxStart !== -1 && idxEnd !== -1) {
  const replaceSegment = n.substring(idxStart, idxEnd + '         )}'.length);
  n = n.replace(replaceSegment, '         {renderCloseConfirmModal()}');
  console.log("✓ Replaced inline modal block with {renderCloseConfirmModal()}");
} else {
  console.error("❌ Could not find inline modal block indices", idxStart, idxEnd);
  process.exit(1);
}

if (isCRLF) n = n.replace(/\n/g, '\r\n');
fs.writeFileSync(appPath, n, 'utf8');
console.log("🎉 Successfully updated App.jsx so close confirmation works on Login Screen!");
