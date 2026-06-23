const fs = require('fs');
const path = require('path');

const scriptPath = path.join(__dirname, 'apply_remaining_permissions.js');
let scriptContent = fs.readFileSync(scriptPath, 'utf8');

// 1. Fix target 12 (Dine-in KOT buttons indentation)
// Target 12 had 28 spaces on lines starting with // Print KOT
// We will replace 28 spaces with 26 spaces for those lines.
const oldTarget12 = `                           // Print KOT
                           handlePrintKOT(cart, selectedTable.table_name, bNo, 'NEW', selectedTable?.original_order_type || 'DINE_IN', tableCustomers[selectedTable.id]);
                           // Set status to SAVED (Red)
                           setTableStatuses(prev => ({ ...prev, [selectedTable.id]: 'SAVED' }));

                           setCart([]);
                           setTableCarts(prev => ({ ...prev, [selectedTable.id]: [] }));
                           toast.success("KOT Printed & Saved!");
                           setActiveTrayTab('Billing');`;

const newTarget12 = `                          // Print KOT
                          handlePrintKOT(cart, selectedTable.table_name, bNo, 'NEW', selectedTable?.original_order_type || 'DINE_IN', tableCustomers[selectedTable.id]);
                          // Set status to SAVED (Red)
                          setTableStatuses(prev => ({ ...prev, [selectedTable.id]: 'SAVED' }));

                          setCart([]);
                          setTableCarts(prev => ({ ...prev, [selectedTable.id]: [] }));
                          toast.success("KOT Printed & Saved!");
                          setActiveTrayTab('Billing');`;

scriptContent = scriptContent.replace(oldTarget12, newTarget12);

// 2. Fix target 17 (Old KOT Modal buttons in footer): reduce indentation of target by 1 space on every line
const oldTarget17 = `                  <div className="p-4 bg-[#161b22] border-t border-[#30363d] rounded-b-2xl flex flex-wrap gap-2 justify-between items-center">
                     <div className="flex flex-wrap gap-2">
                        <button onClick={handleOldKOTComplementary} className="bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] px-3 py-1.5 rounded-lg text-xs font-bold transition-all active:scale-95">
                           Complementary
                        </button>
                        <button onClick={handleOldKOTPrint} className="bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] px-3 py-1.5 rounded-lg text-xs font-bold transition-all active:scale-95">
                           Print
                        </button>
                        <button onClick={handleOldKOTDelete} className="bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] px-3 py-1.5 rounded-lg text-xs font-bold transition-all active:scale-95">
                           Delete KOT
                        </button>
                        <button onClick={handleOldKOTCancel} className="bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] px-3 py-1.5 rounded-lg text-xs font-bold transition-all active:scale-95">
                           Cancel KOT
                        </button>
                        <button onClick={handleOpenTransferModal} className="bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] px-3 py-1.5 rounded-lg text-xs font-bold transition-all active:scale-95">
                           Transfer Item
                        </button>
                     </div>`;

const newTarget17 = `                 <div className="p-4 bg-[#161b22] border-t border-[#30363d] rounded-b-2xl flex flex-wrap gap-2 justify-between items-center">
                    <div className="flex flex-wrap gap-2">
                       <button onClick={handleOldKOTComplementary} className="bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] px-3 py-1.5 rounded-lg text-xs font-bold transition-all active:scale-95">
                          Complementary
                       </button>
                       <button onClick={handleOldKOTPrint} className="bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] px-3 py-1.5 rounded-lg text-xs font-bold transition-all active:scale-95">
                          Print
                       </button>
                       <button onClick={handleOldKOTDelete} className="bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] px-3 py-1.5 rounded-lg text-xs font-bold transition-all active:scale-95">
                          Delete KOT
                       </button>
                       <button onClick={handleOldKOTCancel} className="bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] px-3 py-1.5 rounded-lg text-xs font-bold transition-all active:scale-95">
                          Cancel KOT
                       </button>
                       <button onClick={handleOpenTransferModal} className="bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] px-3 py-1.5 rounded-lg text-xs font-bold transition-all active:scale-95">
                          Transfer Item
                       </button>
                    </div>`;

scriptContent = scriptContent.replace(oldTarget17, newTarget17);

// 3. Fix target 19 (Operations Management: Save Item)
const oldTarget19 = `  const handleSaveItemMgmt = async (e) => {
    if (!itemMgmtForm.product_name.trim()) {`;

const newTarget19 = `  const handleSaveItemMgmt = async (e) => {
    e.preventDefault();
    if (!itemMgmtForm.product_name.trim()) {`;

scriptContent = scriptContent.replace(oldTarget19, newTarget19);

// And replacement for 19:
const oldReplacement19 = `  const handleSaveItemMgmt = async (e) => {
    if (itemMgmtForm.id === null) {
      if (getStaffPermissions()?.pos_access?.OperationManagement?.ItemsManagement?.add_item === false) {
        toast.error("You do not have permission to add an item.");
        e.preventDefault();
        return;
      }
    } else {
      if (getStaffPermissions()?.pos_access?.OperationManagement?.ItemsManagement?.edit_item === false) {
        toast.error("You do not have permission to edit an item.");
        e.preventDefault();
        return;
      }
    }
    if (!itemMgmtForm.product_name.trim()) {`;

const newReplacement19 = `  const handleSaveItemMgmt = async (e) => {
    if (itemMgmtForm.id === null) {
      if (getStaffPermissions()?.pos_access?.OperationManagement?.ItemsManagement?.add_item === false) {
        toast.error("You do not have permission to add an item.");
        e.preventDefault();
        return;
      }
    } else {
      if (getStaffPermissions()?.pos_access?.OperationManagement?.ItemsManagement?.edit_item === false) {
        toast.error("You do not have permission to edit an item.");
        e.preventDefault();
        return;
      }
    }
    e.preventDefault();
    if (!itemMgmtForm.product_name.trim()) {`;

scriptContent = scriptContent.replace(oldReplacement19, newReplacement19);

// 4. Fix target 20 (Operations Management: Delete Item)
const oldTarget20 = `  const handleDeleteItemMgmt = async (itemId, itemType, itemName) => {
    if (!window.confirm(\`Are you sure you want to delete \${itemType === '1' ? 'option ' : ''}item "\${itemName}"?\`)) return;`;

const newTarget20 = `  const handleDeleteItemMgmt = async (itemId, itemType, itemName) => {
    if (!window.confirm(\`Are you sure you want to delete "\${itemName}"?\`)) return;`;

scriptContent = scriptContent.replace(oldTarget20, newTarget20);

// And replacement for 20:
const oldReplacement20 = `  const handleDeleteItemMgmt = async (itemId, itemType, itemName) => {
    if (getStaffPermissions()?.pos_access?.OperationManagement?.ItemsManagement?.edit_item === false) {
      toast.error("You do not have permission to delete items.");
      return;
    }
    if (!window.confirm(\`Are you sure you want to delete \${itemType === '1' ? 'option ' : ''}item "\${itemName}"?\`)) return;`;

const newReplacement20 = `  const handleDeleteItemMgmt = async (itemId, itemType, itemName) => {
    if (getStaffPermissions()?.pos_access?.OperationManagement?.ItemsManagement?.edit_item === false) {
      toast.error("You do not have permission to delete items.");
      return;
    }
    if (!window.confirm(\`Are you sure you want to delete "\${itemName}"?\`)) return;`;

scriptContent = scriptContent.replace(oldReplacement20, newReplacement20);

// 5. Fix target 21 (Operations Management: Toggle Item Availability)
const oldTarget21 = `  const handleToggleItemMgmtAvailability = async (item) => {
    const updatedStatus = !item.availability;`;

const newTarget21 = `  const handleToggleItemMgmtAvailability = async (item) => {
    const nextAvailability = !item.availability;`;

scriptContent = scriptContent.replace(oldTarget21, newTarget21);

// And replacement for 21:
const oldReplacement21 = `  const handleToggleItemMgmtAvailability = async (item) => {
    if (getStaffPermissions()?.pos_access?.OperationManagement?.ItemsManagement?.item_enabled_disabled === false) {
      toast.error("You do not have permission to enable/disable items.");
      return;
    }
    const updatedStatus = !item.availability;`;

const newReplacement21 = `  const handleToggleItemMgmtAvailability = async (item) => {
    if (getStaffPermissions()?.pos_access?.OperationManagement?.ItemsManagement?.item_enabled_disabled === false) {
      toast.error("You do not have permission to enable/disable items.");
      return;
    }
    const nextAvailability = !item.availability;`;

scriptContent = scriptContent.replace(oldReplacement21, newReplacement21);

// 6. Fix target 22 (Operations Management: Toggle Category Active)
const oldTarget22 = `  const handleToggleCategoryActive = async (category) => {
    const updatedStatus = !category.active;`;

const newTarget22 = `  const handleToggleCategoryActive = async (category) => {
    const nextActive = !category.is_active;`;

scriptContent = scriptContent.replace(oldTarget22, newTarget22);

// And replacement for 22:
const oldReplacement22 = `  const handleToggleCategoryActive = async (category) => {
    if (getStaffPermissions()?.pos_access?.OperationManagement?.ItemsManagement?.category_enabled_disabled === false) {
      toast.error("You do not have permission to enable/disable categories.");
      return;
    }
    const updatedStatus = !category.active;`;

const newReplacement22 = `  const handleToggleCategoryActive = async (category) => {
    if (getStaffPermissions()?.pos_access?.OperationManagement?.ItemsManagement?.category_enabled_disabled === false) {
      toast.error("You do not have permission to enable/disable categories.");
      return;
    }
    const nextActive = !category.is_active;`;

scriptContent = scriptContent.replace(oldReplacement22, newReplacement22);

// 7. Fix target 23 (Reports mapping filter)
const oldTarget23 = `                      {/* Scrollable List of Reports */}
                      <div className="flex-1 overflow-y-auto pr-1 no-scrollbar" style={{ scrollbarColor: '#51983c #ffffff', scrollbarWidth: 'thin' }}>
                         <div className="px-3 pb-4 space-y-1">
                            {REPORTS_LIST.map(item => {`;

const newTarget23 = `                     {/* Scrollable List of Reports */}
                     <div className="flex-1 overflow-y-auto pr-1 no-scrollbar" style={{ scrollbarColor: '#51983c #ffffff', scrollbarWidth: 'thin' }}>
                        <div className="px-3 pb-4 space-y-1">
                           {REPORTS_LIST.map(item => {`;

scriptContent = scriptContent.replace(oldTarget23, newTarget23);

// And replacement for 23:
const oldReplacement23 = `                      {/* Scrollable List of Reports */}
                      <div className="flex-1 overflow-y-auto pr-1 no-scrollbar" style={{ scrollbarColor: '#51983c #ffffff', scrollbarWidth: 'thin' }}>
                         <div className="px-3 pb-4 space-y-1">
                            {getFilteredReportsList().map(item => {`;

const newReplacement23 = `                     {/* Scrollable List of Reports */}
                     <div className="flex-1 overflow-y-auto pr-1 no-scrollbar" style={{ scrollbarColor: '#51983c #ffffff', scrollbarWidth: 'thin' }}>
                        <div className="px-3 pb-4 space-y-1">
                           {getFilteredReportsList().map(item => {`;

scriptContent = scriptContent.replace(oldReplacement23, newReplacement23);

// 8. Fix target 24 (Settings Tabs mapping filter)
const oldTarget24 = `                     {/* Tab Headers */}
                     <div className={\`flex border-b shrink-0 \\\${isDark ? 'border-[#30363d] bg-[#161b22]' : 'bg-slate-50 border-slate-200'} overflow-x-auto no-scrollbar\`}>
                        {[`;

const newTarget24 = `                    {/* Tab Headers */}
                    <div className={\`flex border-b shrink-0 \\\${isDark ? 'border-[#30363d] bg-[#161b22]' : 'bg-slate-50 border-slate-200'} overflow-x-auto no-scrollbar\`}>
                       {[`;

scriptContent = scriptContent.replace(oldTarget24, newTarget24);

// And replacement for 24:
const oldReplacement24 = `                     {/* Tab Headers */}
                     <div className={\`flex border-b shrink-0 \\\${isDark ? 'border-[#30363d] bg-[#161b22]' : 'bg-slate-50 border-slate-200'} overflow-x-auto no-scrollbar\`}>
                        {getFilteredSettingsTabs().map((tab) => (`;

const newReplacement24 = `                    {/* Tab Headers */}
                    <div className={\`flex border-b shrink-0 \\\${isDark ? 'border-[#30363d] bg-[#161b22]' : 'bg-slate-50 border-slate-200'} overflow-x-auto no-scrollbar\`}>
                       {getFilteredSettingsTabs().map((tab) => (`;

scriptContent = scriptContent.replace(oldReplacement24, newReplacement24);

fs.writeFileSync(scriptPath, scriptContent, 'utf8');
console.log("scratch/apply_remaining_permissions.js successfully patched!");
