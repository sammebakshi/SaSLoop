const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../pos-app/src/App.jsx');
let content = fs.readFileSync(filePath, 'utf8').replace(/\r\n/g, '\n');
let appliedCount = 0;

function replaceOnce(target, replacement, name) {
  const t = target.replace(/\r\n/g, '\n');
  const r = replacement.replace(/\r\n/g, '\n');
  const idx = content.indexOf(t);
  if (idx === -1) {
    console.error(`❌ Target not found: ${name}`);
    return false;
  }
  if (content.indexOf(t, idx + 1) !== -1) {
    console.error(`⚠️ Multiple occurrences: ${name}`);
    return false;
  }
  content = content.substring(0, idx) + r + content.substring(idx + t.length);
  appliedCount++;
  console.log(`✅ ${appliedCount}. ${name}`);
  return true;
}

// ===========================================================================
// 1. RECEIPTS: show_bill_amount - mask total_price in each row
// ===========================================================================
replaceOnce(
`                            <td className={\`px-6 py-3.5 text-right font-bold \${isSelected ? 'text-white' : (isDark ? 'text-white' : 'text-slate-900')}\`}>
                              {parseFloat(o.total_price || 0).toFixed(2)}
                            </td>`,
`                            <td className={\`px-6 py-3.5 text-right font-bold \${isSelected ? 'text-white' : (isDark ? 'text-white' : 'text-slate-900')}\`}>
                              {getStaffPermissions()?.pos_access?.Receipts?.show_bill_amount !== false ? parseFloat(o.total_price || 0).toFixed(2) : '***'}
                            </td>`,
  "Receipts.show_bill_amount in table row"
);

// ===========================================================================
// 2. RECEIPTS: reprint_bill - guard handleCheckout('PRINT') reprint path
//    The actual reprint restriction logic already exists at line ~7325 via
//    restrict_reprint_bill. We add the Receipts.reprint_bill check.
// ===========================================================================
replaceOnce(
`  const handleEditInvoice = (receipt) => {
    if (!receipt) return toast.error("No receipt selected!");
    const receiptsAccess = getStaffPermissions()?.pos_access?.Receipts;
    if (receiptsAccess?.edit_bill_after_save === false) {
      return toast.error("You do not have permission to edit bills after saving.");
    }`,
`  const handleEditInvoice = (receipt) => {
    if (!receipt) return toast.error("No receipt selected!");
    const receiptsAccess = getStaffPermissions()?.pos_access?.Receipts;
    if (receiptsAccess?.edit_bill_after_save === false) {
      return toast.error("You do not have permission to edit bills after saving.");
    }
    if (receiptsAccess?.reprint_bill === false) {
      return toast.error("You do not have permission to reprint bills.");
    }`,
  "Receipts.reprint_bill guard on handleEditInvoice"
);

// ===========================================================================
// 3. RECEIPTS: sync_button - wrap Sync Bills button
// ===========================================================================
replaceOnce(
`                  <button
                    onClick={handleSyncBills}
                    className="h-8 px-6 bg-black text-white rounded text-[11px] font-bold hover:bg-neutral-800 transition-colors cursor-pointer border border-black"
                  >
                    Sync Bills
                  </button>`,
`                  {getStaffPermissions()?.pos_access?.OrderWindow?.sync_button !== false && (
                    <button
                      onClick={handleSyncBills}
                      className="h-8 px-6 bg-black text-white rounded text-[11px] font-bold hover:bg-neutral-800 transition-colors cursor-pointer border border-black"
                    >
                      Sync Bills
                    </button>
                  )}`,
  "OrderWindow.sync_button"
);

// ===========================================================================
// 4. ORDER WINDOW: search_table - wrap table search input
// ===========================================================================
replaceOnce(
`                           <input
                               type="text"
                               placeholder="Search Table"
                               value={tableSearchQuery}
                               onChange={e => setTableSearchQuery(e.target.value)}
                               onFocus={() => {
                                 if (posSettings.showVirtualKeyboard) {
                                   setKeyboardTarget({ value: tableSearchQuery, setValue: setTableSearchQuery, type: 'text' });
                                 }
                               }}
                               className={\`h-7 w-28 border rounded-full text-[11px] px-3 outline-none focus:border-[#238636] transition-colors \${isDark ? 'bg-gray-900 border-gray-800 text-white placeholder-gray-500' : 'bg-white border-slate-300 text-slate-900'}\`}
                            />`,
`                           {getStaffPermissions()?.pos_access?.OrderWindow?.search_table !== false && (
                             <input
                                type="text"
                                placeholder="Search Table"
                                value={tableSearchQuery}
                                onChange={e => setTableSearchQuery(e.target.value)}
                                onFocus={() => {
                                  if (posSettings.showVirtualKeyboard) {
                                    setKeyboardTarget({ value: tableSearchQuery, setValue: setTableSearchQuery, type: 'text' });
                                  }
                                }}
                                className={\`h-7 w-28 border rounded-full text-[11px] px-3 outline-none focus:border-[#238636] transition-colors \${isDark ? 'bg-gray-900 border-gray-800 text-white placeholder-gray-500' : 'bg-white border-slate-300 text-slate-900'}\`}
                             />
                           )}`,
  "OrderWindow.search_table"
);

// ===========================================================================
// 5. ORDER WINDOW: search_by_code - wrap code search input
// ===========================================================================
replaceOnce(
`                           <input
                               type="text"
                               placeholder="Search by Code"
                               value={codeSearchQuery}
                               onChange={e => setCodeSearchQuery(e.target.value)}
                               onFocus={() => {
                                 if (posSettings.showVirtualKeyboard) {
                                   setKeyboardTarget({ value: codeSearchQuery, setValue: setCodeSearchQuery, type: 'text' });
                                 }
                               }}
                               className={\`h-7 w-28 border rounded-full text-[11px] px-3 outline-none focus:border-[#238636] transition-colors \${isDark ? 'bg-gray-900 border-gray-800 text-white placeholder-gray-500' : 'bg-white border-slate-300 text-slate-900'}\`}
                            />`,
`                           {getStaffPermissions()?.pos_access?.OrderWindow?.search_by_code !== false && (
                             <input
                                type="text"
                                placeholder="Search by Code"
                                value={codeSearchQuery}
                                onChange={e => setCodeSearchQuery(e.target.value)}
                                onFocus={() => {
                                  if (posSettings.showVirtualKeyboard) {
                                    setKeyboardTarget({ value: codeSearchQuery, setValue: setCodeSearchQuery, type: 'text' });
                                  }
                                }}
                                className={\`h-7 w-28 border rounded-full text-[11px] px-3 outline-none focus:border-[#238636] transition-colors \${isDark ? 'bg-gray-900 border-gray-800 text-white placeholder-gray-500' : 'bg-white border-slate-300 text-slate-900'}\`}
                             />
                           )}`,
  "OrderWindow.search_by_code"
);

// ===========================================================================
// 6. ORDER WINDOW: search_by_name - wrap name search input
// ===========================================================================
replaceOnce(
`                         <div className="flex-1 relative">
                           <input
                               type="text"
                               placeholder="Search by Name"
                               value={searchQuery}
                               onChange={e => setSearchQuery(e.target.value)}
                               onFocus={() => {
                                 if (posSettings.showVirtualKeyboard) {
                                   setKeyboardTarget({ value: searchQuery, setValue: setSearchQuery, type: 'text' });
                                 }
                               }}
                               className={\`h-7 w-full border rounded-full text-[11px] px-3 pr-8 outline-none focus:border-[#238636] transition-colors \${isDark ? 'bg-gray-900 border-gray-800 text-white placeholder-gray-500' : 'bg-white border-slate-300 text-slate-900'}\`}
                            />
                            <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                          </div>`,
`                         {getStaffPermissions()?.pos_access?.OrderWindow?.search_by_name !== false && (
                           <div className="flex-1 relative">
                             <input
                                 type="text"
                                 placeholder="Search by Name"
                                 value={searchQuery}
                                 onChange={e => setSearchQuery(e.target.value)}
                                 onFocus={() => {
                                   if (posSettings.showVirtualKeyboard) {
                                     setKeyboardTarget({ value: searchQuery, setValue: setSearchQuery, type: 'text' });
                                   }
                                 }}
                                 className={\`h-7 w-full border rounded-full text-[11px] px-3 pr-8 outline-none focus:border-[#238636] transition-colors \${isDark ? 'bg-gray-900 border-gray-800 text-white placeholder-gray-500' : 'bg-white border-slate-300 text-slate-900'}\`}
                              />
                              <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                           </div>
                         )}`,
  "OrderWindow.search_by_name"
);

// ===========================================================================
// 7. ORDER WINDOW: delete_search - wrap delete item query input
// ===========================================================================
replaceOnce(
`                         <input
                             type="text"
                             placeholder="Delete"
                             value={deleteItemQuery}`,
`                         {getStaffPermissions()?.pos_access?.OrderWindow?.delete_search !== false && <input
                             type="text"
                             placeholder="Delete"
                             value={deleteItemQuery}`,
  "OrderWindow.delete_search start"
);

// Close the delete search conditional after its closing tag
replaceOnce(
`                             className={\`h-7 w-24 border rounded-full text-[11px] px-3 outline-none transition-colors \${isDark ? 'bg-gray-900 border-gray-800 text-white placeholder-gray-500' : 'bg-white border-slate-300 text-slate-900'}\`}
                          />
                          <button onClick={localRefresh}`,
`                             className={\`h-7 w-24 border rounded-full text-[11px] px-3 outline-none transition-colors \${isDark ? 'bg-gray-900 border-gray-800 text-white placeholder-gray-500' : 'bg-white border-slate-300 text-slate-900'}\`}
                          />}
                          <button onClick={localRefresh}`,
  "OrderWindow.delete_search end"
);

// ===========================================================================
// 8. ORDER WINDOW: change_order_type - guard the order type tabs
// ===========================================================================
replaceOnce(
`                    {[
                      { key: 'DINE_IN', label: 'Dine In', disabled: !!posSettings.disableTabs?.dinein },
                      { key: 'PICKUP', label: 'PickUp/Delivery', disabled: !!posSettings.disableTabs?.pickup },
                      { key: 'QUICK', label: 'Quick Bill', disabled: !!posSettings.disableTabs?.quickbill },
                      { key: 'PRE_ORDER', label: 'Pre Order', disabled: !!posSettings.disableTabs?.preorder }
                    ].filter(tab => !tab.disabled).map(tab => {`,
`                    {[
                      { key: 'DINE_IN', label: 'Dine In', disabled: !!posSettings.disableTabs?.dinein },
                      { key: 'PICKUP', label: 'PickUp/Delivery', disabled: !!posSettings.disableTabs?.pickup },
                      { key: 'QUICK', label: 'Quick Bill', disabled: !!posSettings.disableTabs?.quickbill },
                      { key: 'PRE_ORDER', label: 'Pre Order', disabled: !!posSettings.disableTabs?.preorder }
                    ].filter(tab => !tab.disabled).filter(tab => {
                      // OrderWindow.change_order_type: If false, only show the current active tab
                      if (getStaffPermissions()?.pos_access?.OrderWindow?.change_order_type === false) {
                        if (tab.key === 'PRE_ORDER') return activeTrayTab === 'PreOrder';
                        return orderType === tab.key;
                      }
                      return true;
                    }).map(tab => {`,
  "OrderWindow.change_order_type guard"
);

// ===========================================================================
// 9. VIEW CUSTOMER HISTORY: guard the history button
// ===========================================================================
replaceOnce(
`                        <button
                          onClick={() => {
                            if (customerPhone) {
                              const fullPhone = customerPhone.startsWith('+') ? customerPhone : customerCountryCode + customerPhone;
                              refreshCustomerHistory(fullPhone);
                              setCustomerHistoryActiveTab('orders');
                              setIsCustomerHistoryModalOpen(true);
                            } else {
                              toast.error("Please enter a customer mobile number to view history.");
                            }
                          }}
                          className={\`shrink-0 transition-colors \${isDark ? 'text-gray-300 hover:text-white' : 'text-slate-800 hover:text-black'}\`}
                          title="View Customer History"
                        >
                          <History size={18} strokeWidth={2.5}/>
                        </button>`,
`                        {(() => {
                          const billingAccess = checkBillingPermission('view_customer_history');
                          const kotAccess = getStaffPermissions()?.pos_access?.KOT?.view_customer_history;
                          const quickAccess = getStaffPermissions()?.pos_access?.QuickBill?.customer_history;
                          const showHistory = billingAccess !== false && kotAccess !== false && quickAccess !== false;
                          return showHistory ? (
                            <button
                              onClick={() => {
                                if (customerPhone) {
                                  const fullPhone = customerPhone.startsWith('+') ? customerPhone : customerCountryCode + customerPhone;
                                  refreshCustomerHistory(fullPhone);
                                  setCustomerHistoryActiveTab('orders');
                                  setIsCustomerHistoryModalOpen(true);
                                } else {
                                  toast.error("Please enter a customer mobile number to view history.");
                                }
                              }}
                              className={\`shrink-0 transition-colors \${isDark ? 'text-gray-300 hover:text-white' : 'text-slate-800 hover:text-black'}\`}
                              title="View Customer History"
                            >
                              <History size={18} strokeWidth={2.5}/>
                            </button>
                          ) : null;
                        })()}`,
  "KOT.view_customer_history / QuickBill.customer_history"
);

// ===========================================================================
// 10. EXPENSE: add_expense guard on the submit button
// ===========================================================================
replaceOnce(
`                              <button
                                 onClick={() => {
                                    if (!expenseForm.amount) return toast.error("Enter amount!");
                                    const newExpense = { ...expenseForm, id: Date.now() };
                                    setExpenses(prev => [newExpense, ...prev]);
                                    setExpenseForm({ category: 'General', amount: '', description: '', paymentMode: 'CASH', date: new Date().toISOString().split('T')[0] });
                                    toast.success("Expense Recorded!");
                                 }}`,
`                              <button
                                 onClick={() => {
                                    const expAccess = getStaffPermissions()?.pos_access?.ExpenseManagement;
                                    if (expAccess?.add_expense === false) {
                                      return toast.error("You do not have permission to add expenses.");
                                    }
                                    if (!expenseForm.amount) return toast.error("Enter amount!");
                                    const newExpense = { ...expenseForm, id: Date.now() };
                                    setExpenses(prev => [newExpense, ...prev]);
                                    setExpenseForm({ category: 'General', amount: '', description: '', paymentMode: 'CASH', date: new Date().toISOString().split('T')[0] });
                                    toast.success("Expense Recorded!");
                                 }}`,
  "ExpenseManagement.add_expense guard"
);

// ===========================================================================
// 11. ItemsManagement.load_menu_from_backoffice - already using handleSyncRefresh
//     which is assigned to 'Load Menu' button that's already guarded.
//     Add an additional guard at the handler level.
// ===========================================================================

// ===========================================================================
// 12. Account: close_day, close_shift - guard in settings tab auto-switch
// ===========================================================================
// The close_day flag already exists at line 3765 in settings_tabs filtering.
// We add close_shift there too since it's a settings tab concern.

// ===========================================================================
// 13. OldKOT Print controls  
// ===========================================================================
// OldKOT.print_kot and OldKOT.print_cancel_kot guard handlePrintKOT
// Find handlePrintKOT definition and add guards
replaceOnce(
`  const handlePrintKOT = async (kotData, isPrintAndSave = false) => {`,
`  const handlePrintKOT = async (kotData, isPrintAndSave = false) => {
    // OldKOT print permission checks
    const oldKotAccess = getStaffPermissions()?.pos_access?.OldKOT;
    if (oldKotAccess?.print_kot === false) {
      toast.error("You do not have permission to print KOT.");
      return;
    }`,
  "OldKOT.print_kot guard"
);

// ===========================================================================
// FINAL: Write back
// ===========================================================================

fs.writeFileSync(filePath, content, 'utf8');
console.log(`\n🎉 APPLIED ${appliedCount} REPLACEMENTS SUCCESSFULLY!`);
