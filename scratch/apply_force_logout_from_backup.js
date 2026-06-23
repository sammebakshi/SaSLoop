const fs = require('fs');

const appPath = 'c:/Users/Sajad/Desktop/SaSLoop/pos-app/src/App.jsx';
let content = fs.readFileSync(appPath, 'utf8');

// Normalize CRLF to LF
content = content.replace(/\r\n/g, '\n');

// 1. Replace handleLogoutFlow signature and check
const logoutTarget = `  const handleLogoutFlow = async (clearData) => {
    if (clearData) {
      // Check for active carts or busy tables first
      const hasActiveCarts = 
        (dineInCart && dineInCart.length > 0) ||
        (pickupCart && pickupCart.length > 0) ||
        (quickCart && quickCart.length > 0) ||
        (preOrderCart && preOrderCart.length > 0) ||
        Object.values(tableCarts || {}).some(c => Array.isArray(c) && c.length > 0);

      const hasBusyTables = Object.values(tableStatuses || {}).some(status => 
        status === 'SAVED' || status === 'BILL_SAVED' || status === 'PRINTED'
      );

      if (hasActiveCarts || hasBusyTables) {
        toast.error("Data can't be cleared: Tables are busy.");
        return;
      }`;

const logoutReplacement = `  const handleLogoutFlow = async (clearData, force = false) => {
    if (clearData) {
      // Check for active carts or busy tables first
      const hasActiveCarts = 
        (dineInCart && dineInCart.length > 0) ||
        (pickupCart && pickupCart.length > 0) ||
        (quickCart && quickCart.length > 0) ||
        (preOrderCart && preOrderCart.length > 0) ||
        Object.values(tableCarts || {}).some(c => Array.isArray(c) && c.length > 0);

      const hasBusyTables = Object.values(tableBills || {}).some(bill => {
        if (!Array.isArray(bill)) return false;
        return bill.some(item => !item.isCancelled);
      });

      if ((hasActiveCarts || hasBusyTables) && !force) {
        setLogoutModalStep('confirm_force_logout');
        return;
      }`;

if (!content.includes(logoutTarget)) {
  console.error("Could not find logoutTarget in App.jsx");
  process.exit(1);
}
content = content.replace(logoutTarget, logoutReplacement);
console.log("1. Replaced handleLogoutFlow code.");

// 2. Append logout modal UI
const modalUiCode = `
        {logoutModalStep === 'confirm_force_logout' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-[#0f172a]/95 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className={\`w-full max-w-md rounded-2xl overflow-hidden shadow-2xl border flex flex-col \${
                isDark ? 'bg-[#0d1117] border-[#30363d] text-white' : 'bg-white border-slate-200 text-slate-900'
              }\`}
            >
              {/* Header */}
              <div className="p-5 border-b border-red-500/20 bg-red-500/5 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-2">
                  <AlertCircle className="text-red-500" size={20} />
                  <h3 className="text-sm font-black uppercase italic tracking-tighter text-red-500">Force Logout Warning</h3>
                </div>
                <button
                  onClick={() => setLogoutModalStep(null)}
                  className={\`p-1.5 rounded-lg transition-all text-xs \${
                    isDark ? 'hover:bg-white/10 text-gray-400 hover:text-white' : 'hover:bg-slate-200 text-slate-500 hover:text-slate-900'
                  }\`}
                >
                  ✕
                </button>
              </div>

              {/* Body */}
              <div className={\`p-6 space-y-4 \${isDark ? 'bg-[#0d1117]' : 'bg-white'}\`}>
                <div className="space-y-3">
                  <p className={\`text-xs font-bold leading-relaxed \${isDark ? 'text-gray-300' : 'text-slate-700'}\`}>
                    Active carts or busy tables were detected.
                  </p>
                  <p className={\`text-xs \${isDark ? 'text-gray-400' : 'text-slate-600'}\`}>
                    Purging local database sales data will clear all local tables, customer databases, active carts, and pending transactions on this device.
                  </p>
                  <p className="text-xs font-black text-red-500 uppercase tracking-wider bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                    Warning: This action cannot be undone. Ensure you have synced all local shifts to the server!
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-3 justify-end pt-2">
                  <button
                    onClick={() => handleLogoutFlow(true, true)}
                    className="px-6 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-all"
                  >
                    Yes, Force Purge & Logout
                  </button>
                  <button
                    onClick={() => {
                      setLogoutModalStep(null);
                      setClearLocalDataChecked(false);
                    }}
                    className={\`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all \${
                      isDark ? 'bg-[#21262d] text-[#c9d1d9] hover:bg-[#30363d]' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }\`}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
`;

const settingsOpenTarget = '           {isSettingsModalOpen && (';
if (!content.includes(settingsOpenTarget)) {
  console.error("Could not find isSettingsModalOpen target in App.jsx");
  process.exit(1);
}
content = content.replace(settingsOpenTarget, modalUiCode + '\n' + settingsOpenTarget);
console.log("2. Injected logout modal UI.");

// Convert LF back to CRLF
content = content.replace(/\n/g, '\r\n');

fs.writeFileSync(appPath, content, 'utf8');
console.log("🎉 LOGOUT MODAL RESTORED SUCCESSFULLY!");
