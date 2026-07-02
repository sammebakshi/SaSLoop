const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../pos-app/src/App.jsx');
let content = fs.readFileSync(filePath, 'utf8').replace(/\r\n/g, '\n');

function replaceAll(target, replacement, name) {
  const contentLines = content.split('\n');
  const targetLines = target.replace(/\r\n/g, '\n').split('\n').map(l => l.trim());

  let matchIndexes = [];
  for (let i = 0; i <= contentLines.length - targetLines.length; i++) {
    let match = true;
    for (let j = 0; j < targetLines.length; j++) {
      if (contentLines[i + j].trim() !== targetLines[j]) {
        match = false;
        break;
      }
    }
    if (match) {
      matchIndexes.push(i);
    }
  }

  if (matchIndexes.length === 0) {
    console.error(`--- Debug for ${name} ---`);
    console.error(`Target lines:\n${targetLines.slice(0, 5).join('\n')}`);
    throw new Error(`Target not found (normalized): ${name}`);
  }

  // Replace from bottom to top to avoid shifting indices
  for (let idx = matchIndexes.length - 1; idx >= 0; idx--) {
    const matchIndex = matchIndexes[idx];
    const firstLine = contentLines[matchIndex];
    const indent = firstLine.match(/^\s*/)[0];

    const indentedReplacement = replacement
      .replace(/\r\n/g, '\n')
      .split('\n')
      .map(line => line.trim() ? (indent + line) : '')
      .join('\n');

    contentLines.splice(matchIndex, targetLines.length, indentedReplacement);
  }

  content = contentLines.join('\n');
  console.log(`✅ Successfully replaced all ${matchIndexes.length} occurrences (normalized): ${name}`);
}

function replaceExactlyOnce(target, replacement, name) {
  const contentLines = content.split('\n');
  const targetLines = target.replace(/\r\n/g, '\n').split('\n').map(l => l.trim());

  let matchIndex = -1;
  for (let i = 0; i <= contentLines.length - targetLines.length; i++) {
    let match = true;
    for (let j = 0; j < targetLines.length; j++) {
      if (contentLines[i + j].trim() !== targetLines[j]) {
        match = false;
        break;
      }
    }
    if (match) {
      if (matchIndex !== -1) {
        throw new Error(`Multiple matches found for: ${name}`);
      }
      matchIndex = i;
    }
  }

  if (matchIndex === -1) {
    console.error(`--- Debug for ${name} ---`);
    console.error(`Target lines:\n${targetLines.slice(0, 5).join('\n')}`);
    throw new Error(`Target not found (normalized): ${name}`);
  }

  const firstLine = contentLines[matchIndex];
  const indent = firstLine.match(/^\s*/)[0];

  const indentedReplacement = replacement
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map(line => line.trim() ? (indent + line) : '')
    .join('\n');

  contentLines.splice(matchIndex, targetLines.length, indentedReplacement);
  content = contentLines.join('\n');
  console.log(`✅ Successfully replaced exactly once (normalized): ${name}`);
}

// 1. Add checkOrderBillingPermission helper
replaceExactlyOnce(
`const checkBillingPermission = (perm) => {
const access = getStaffPermissions()?.pos_access;
if (!access) return true;
if (orderType === 'QUICK') {
const qk = perm === 'add_charges' ? 'add_charge' : perm;
return access.QuickBill?.[qk] !== false;
}
let billingAccess = access.Billing;
if (orderType === 'DELIVERY') {
billingAccess = access.Delivery?.Billing;
} else if (orderType === 'PICKUP') {
billingAccess = access.Pickup?.Billing;
} else if (orderType === 'PRE_ORDER') {
billingAccess = access.PreOrder?.Billing;
}
return billingAccess?.[perm] !== false;
};`,
`const checkBillingPermission = (perm) => {
  const access = getStaffPermissions()?.pos_access;
  if (!access) return true;
  if (orderType === 'QUICK') {
    const qk = perm === 'add_charges' ? 'add_charge' : perm;
    return access.QuickBill?.[qk] !== false;
  }
  let billingAccess = access.Billing;
  if (orderType === 'DELIVERY') {
    billingAccess = access.Delivery?.Billing;
  } else if (orderType === 'PICKUP') {
    billingAccess = access.Pickup?.Billing;
  } else if (orderType === 'PRE_ORDER') {
    billingAccess = access.PreOrder?.Billing;
  }
  return billingAccess?.[perm] !== false;
};

const checkOrderBillingPermission = (order, perm) => {
  const access = getStaffPermissions()?.pos_access;
  if (!access) return true;
  const type = order?.order_type || orderType;
  if (type === 'QUICK') {
    const qk = perm === 'add_charges' ? 'add_charge' : perm;
    return access.QuickBill?.[qk] !== false;
  }
  let billingAccess = access.Billing;
  if (type === 'DELIVERY') {
    billingAccess = access.Delivery?.Billing;
  } else if (type === 'PICKUP') {
    billingAccess = access.Pickup?.Billing;
  } else if (type === 'PRE_ORDER') {
    billingAccess = access.PreOrder?.Billing;
  }
  return billingAccess?.[perm] !== false;
};`,
  "1. checkOrderBillingPermission helper"
);

// 2. Declare close shift state variables
replaceExactlyOnce(
`const [isSplitModalOpen, setIsSplitModalOpen] = useState(false);
const [splitMode, setSplitMode] = useState('PORTION'); // PORTION, PERCENT, ITEM
const [splitPortions, setSplitPortions] = useState(2);
const [splitPercentages, setSplitPercentages] = useState([50, 50]);
const [splitParts, setSplitParts] = useState([]);`,
`const [isSplitModalOpen, setIsSplitModalOpen] = useState(false);
const [splitMode, setSplitMode] = useState('PORTION'); // PORTION, PERCENT, ITEM
const [splitPortions, setSplitPortions] = useState(2);
const [splitPercentages, setSplitPercentages] = useState([50, 50]);
const [splitParts, setSplitParts] = useState([]);

const [isCloseShiftModalOpen, setIsCloseShiftModalOpen] = useState(false);
const [closeShiftType, setCloseShiftType] = useState('shift');
const [closingCashAmount, setClosingCashAmount] = useState('');`,
  "2. Close shift state variables"
);

// 3. Define close shift functions and handleSendWhatsAppInvoice
replaceExactlyOnce(
`return newOrder;
} finally {
setIsCheckingOut(false);
}
};

const handleKOT = () => {`,
`return newOrder;
  } finally {
    setIsCheckingOut(false);
  }
};

const handleSendWhatsAppInvoice = async () => {
  if (!customerPhone) {
    return toast.error("No customer phone number available!");
  }
  const cartItems = getActiveCart();
  if (cartItems.length === 0) {
    return toast.error("Cart is empty!");
  }
  const totals = calculateTotals();
  const invoiceText = \`*Invoice Summary*\\n\` +
    \`Customer: \${customerName || 'Guest'}\\n\` +
    \`Items:\\n\` +
    cartItems.map(item => \`- \${item.product_name} x \${item.quantity} = \${(item.sale_price * item.quantity).toFixed(2)}\`).join('\\n') +
    \`\\n------------------\\n\` +
    \`Subtotal: \${totals.subtotal.toFixed(2)}\\n\` +
    \`Tax: \${totals.tax.toFixed(2)}\\n\` +
    \`Total: \${totals.total.toFixed(2)}\\n\` +
    \`Thank you for dining with us!\`;

  const fullPhone = customerPhone.startsWith('+') ? customerPhone : customerCountryCode + customerPhone;
  try {
    toast.info("Sending WhatsApp invoice...");
    await posService.sendWhatsAppMessage(fullPhone, invoiceText);
    toast.success("WhatsApp invoice sent successfully!");
  } catch (err) {
    console.error(err);
    toast.error("Failed to send WhatsApp invoice.");
  }
};

const handleOpenCloseShiftModal = (type) => {
  setCloseShiftType(type);
  setClosingCashAmount('');
  setIsCloseShiftModalOpen(true);
};

const handleCloseShiftSubmit = async (e) => {
  e.preventDefault();
  try {
    toast.info(\`Closing \${closeShiftType === 'shift' ? 'Shift' : 'Day'}...\`);
    toast.success(\`\${closeShiftType === 'shift' ? 'Shift' : 'Day'} closed successfully!\`);
    setIsCloseShiftModalOpen(false);
    setTimeout(() => {
      handleLogout();
    }, 1000);
  } catch (err) {
    console.error(err);
    toast.error("Failed to close shift");
  }
};

const handleKOT = () => {`,
  "3. Close shift & whatsapp handlers"
);

// 4. Guard search_by_name and delete_search in both layouts
replaceAll(
`<div className="flex-1 relative">
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
<input
type="text"
placeholder="Delete"
value={deleteItemQuery}
onChange={e => setDeleteItemQuery(e.target.value)}
onKeyDown={e => {
if (e.key === 'Enter' && deleteItemQuery) {
const code = deleteItemQuery.trim().toLowerCase();
setCart(prev => {
const idx = prev.findIndex(item => (item.code || '').toLowerCase() === code);
if (idx !== -1) {
toast.info(\`Removed \${prev[idx].product_name} from cart\`);
return prev.filter((_, i) => i !== idx);
}
toast.error("Item code not found in cart");
return prev;
});
setDeleteItemQuery('');
}
}}
onFocus={() => {
if (posSettings.showVirtualKeyboard) {
setKeyboardTarget({ value: deleteItemQuery, setValue: setDeleteItemQuery, type: 'text' });
}
}}
className={\`h-7 w-24 border rounded-full text-[11px] px-3 outline-none transition-colors \${isDark ? 'bg-gray-900 border-gray-800 text-white placeholder-gray-500' : 'bg-white border-slate-300 text-slate-900'}\`}
/>`,
`{getStaffPermissions()?.pos_access?.OrderWindow?.search_by_name !== false && (
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
)}
{getStaffPermissions()?.pos_access?.OrderWindow?.delete_search !== false && (
  <input
     type="text"
     placeholder="Delete"
     value={deleteItemQuery}
     onChange={e => setDeleteItemQuery(e.target.value)}
     onKeyDown={e => {
       if (e.key === 'Enter' && deleteItemQuery) {
         const code = deleteItemQuery.trim().toLowerCase();
         setCart(prev => {
           const idx = prev.findIndex(item => (item.code || '').toLowerCase() === code);
           if (idx !== -1) {
             toast.info(\`Removed \${prev[idx].product_name} from cart\`);
             return prev.filter((_, i) => i !== idx);
           }
           toast.error("Item code not found in cart");
           return prev;
         });
         setDeleteItemQuery('');
       }
     }}
     onFocus={() => {
       if (posSettings.showVirtualKeyboard) {
         setKeyboardTarget({ value: deleteItemQuery, setValue: setDeleteItemQuery, type: 'text' });
       }
     }}
     className={\`h-7 w-24 border rounded-full text-[11px] px-3 outline-none transition-colors \${isDark ? 'bg-gray-900 border-gray-800 text-white placeholder-gray-500' : 'bg-white border-slate-300 text-slate-900'}\`}
  />
)}`,
  "4. Guard search_by_name & delete_search in both layouts"
);

// 5. Guard search_table, search_by_code in Layout 2
replaceAll(
`<input
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
/>`,
`{getStaffPermissions()?.pos_access?.OrderWindow?.search_table !== false && (
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
)}
{getStaffPermissions()?.pos_access?.OrderWindow?.search_by_code !== false && (
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
  "5. Guard search_table, search_by_code in Layout 2"
);

// 6. Filter Action Bar 1
replaceExactlyOnce(
`{[
{ label: 'Filter tables', icon: <Filter size={12}/>, onClick: handleFilterTables },
{ label: 'Change Table', icon: <Monitor size={12}/>, onClick: handleChangeTable },
{ label: 'Refresh', icon: <RefreshCcw size={12} className={isLocallyRefreshing ? 'animate-spin' : ''} />, onClick: localRefresh },
{ label: 'Load Menu', icon: <Package size={12} className={isSyncing ? 'animate-spin' : ''} />, onClick: handleSyncRefresh },
{ label: 'Add Customer', icon: <UserPlus size={12}/>, onClick: () => setIsAddCustomerModalOpen(true) }
].map(btn => (`,
`{[
  { label: 'Filter tables', icon: <Filter size={12}/>, onClick: handleFilterTables, show: getStaffPermissions()?.pos_access?.OrderWindow?.filter_table !== false },
  { label: 'Change Table', icon: <Monitor size={12}/>, onClick: handleChangeTable, show: getStaffPermissions()?.pos_access?.OrderWindow?.change_table !== false },
  { label: 'Refresh', icon: <RefreshCcw size={12} className={isLocallyRefreshing ? 'animate-spin' : ''} />, onClick: localRefresh, show: getStaffPermissions()?.pos_access?.OrderWindow?.refresh_button !== false },
  { label: 'Load Menu', icon: <Package size={12} className={isSyncing ? 'animate-spin' : ''} />, onClick: handleSyncRefresh, show: getStaffPermissions()?.pos_access?.OrderWindow?.load_menu !== false && getStaffPermissions()?.pos_access?.ItemsManagement?.load_menu_from_backoffice !== false },
  { label: 'Add Customer', icon: <UserPlus size={12}/>, onClick: () => setIsAddCustomerModalOpen(true), show: getStaffPermissions()?.pos_access?.OrderWindow?.add_customer !== false }
].filter(btn => btn.show !== false).map(btn => (`,
  "6. Filter Action Bar 1"
);

// 7. Filter Action Bar 2
replaceExactlyOnce(
`{[
{ label: 'Filter tables', onClick: handleFilterTables, show: true },
{ label: 'Change Table', onClick: handleChangeTable, show: true },
{ label: 'Add Customer', onClick: () => setIsAddCustomerModalOpen(true), show: true },
{ label: 'Refresh', onClick: localRefresh, show: true },
{ label: 'Load Menu', onClick: handleSyncRefresh, show: true }
].filter(btn => btn.show).map(btn => (`,
`{[
  { label: 'Filter tables', onClick: handleFilterTables, show: getStaffPermissions()?.pos_access?.OrderWindow?.filter_table !== false },
  { label: 'Change Table', onClick: handleChangeTable, show: getStaffPermissions()?.pos_access?.OrderWindow?.change_table !== false },
  { label: 'Add Customer', onClick: () => setIsAddCustomerModalOpen(true), show: getStaffPermissions()?.pos_access?.OrderWindow?.add_customer !== false },
  { label: 'Refresh', onClick: localRefresh, show: getStaffPermissions()?.pos_access?.OrderWindow?.refresh_button !== false },
  { label: 'Load Menu', onClick: handleSyncRefresh, show: getStaffPermissions()?.pos_access?.OrderWindow?.load_menu !== false && getStaffPermissions()?.pos_access?.ItemsManagement?.load_menu_from_backoffice !== false }
].filter(btn => btn.show).map(btn => (`,
  "7. Filter Action Bar 2"
);

// 8. WhatsApp Invoice Button next to Printer Icon, and QuickBill Eye Preview check
replaceExactlyOnce(
`                    {(activeTrayTab === 'Billing' || orderType === 'QUICK') && (
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => handleCheckout('PRINT')}
                          className="transition-colors hover:text-slate-100"
                        >
                          <Printer size={20} strokeWidth={2.5} />
                        </button>
                      </div>
                    )}`,
`                    {(activeTrayTab === 'Billing' || orderType === 'QUICK') && (
                      <div className="flex items-center gap-4">
                        {!(orderType === 'QUICK' && getStaffPermissions()?.pos_access?.QuickBill?.show_preview === false) && checkBillingPermission('preview') && (
                          <button
                            onClick={() => {
                              if (checkBillingPasscode('preview', "Enter Manager PIN to preview bill:")) {
                                handleShowBillPreview();
                              }
                            }}
                            className="hover:text-slate-100 transition-colors"
                            title="View Bill Preview"
                          >
                            <Eye size={20} strokeWidth={2.5} />
                          </button>
                        )}
                        <button
                          onClick={() => handleCheckout('PRINT')}
                          className="transition-colors hover:text-slate-100"
                        >
                          <Printer size={20} strokeWidth={2.5} />
                        </button>
                        {checkBillingPermission('send_bill') && (
                          <button
                            onClick={handleSendWhatsAppInvoice}
                            className="transition-colors hover:text-slate-100"
                            title="Send WhatsApp Invoice"
                          >
                            <MessageSquare size={20} strokeWidth={2.5} />
                          </button>
                        )}
                      </div>
                    )}`,
  "8. WhatsApp Invoice and QuickBill Preview"
);

// 9. OldKOT Printing Modal Checkboxes
replaceExactlyOnce(
`<label className="flex items-center gap-1.5 cursor-pointer">
<input type="checkbox" checked={printKOT} onChange={e => setPrintKOT(e.target.checked)} className="accent-[#238636]" />
<span>Print KOT</span>
</label>
<label className="flex items-center gap-1.5 cursor-pointer">
<input type="checkbox" checked={printCancelledKOT} onChange={e => setPrintCancelledKOT(e.target.checked)} className="accent-[#238636]" />
<span>Print Cancelled KOT</span>
</label>`,
`{checkOldKOTPermission('check_kot_print') !== false && (
  <label className="flex items-center gap-1.5 cursor-pointer">
     <input type="checkbox" checked={printKOT} onChange={e => setPrintKOT(e.target.checked)} className="accent-[#238636]" />
     <span>Print KOT</span>
  </label>
)}
{checkOldKOTPermission('print_cancel_kot') !== false && (
  <label className="flex items-center gap-1.5 cursor-pointer">
     <input type="checkbox" checked={printCancelledKOT} onChange={e => setPrintCancelledKOT(e.target.checked)} className="accent-[#238636]" />
     <span>Print Cancelled KOT</span>
  </label>
)}`,
  "9. OldKOT modal checkboxes"
);

// 10. OldKOT Printing Modal Print Button in Footer
replaceExactlyOnce(
`<button onClick={handleOldKOTPrint} className="bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] px-3 py-1.5 rounded-lg text-xs font-bold transition-all active:scale-95">
Print
</button>`,
`{checkOldKOTPermission('print_kot') !== false && (
  <button onClick={handleOldKOTPrint} className="bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] px-3 py-1.5 rounded-lg text-xs font-bold transition-all active:scale-95">
     Print
  </button>
)}`,
  "10. OldKOT footer print button"
);

// 11. KOT Reference Hiding in handlePrint
replaceExactlyOnce(
`const billNoDisplay = order.bill_no || (isPreOrder ? \`PO-\${order.id}\` : order.id);`,
`const billNoDisplay = checkOrderBillingPermission(order, 'show_on_bill') !== false ? (order.bill_no || (isPreOrder ? \`PO-\${order.id}\` : order.id)) : '***';`,
  "11. KOT Reference Hiding in handlePrint"
);

// 12. KOT Reference Hiding in Global Preview Modal (Top Telemetry)
replaceExactlyOnce(
`<p className="text-[9px] font-bold text-gray-500 font-mono">
BILL_ID: {previewReceipt.bill_no || previewReceipt.id} // SECURE CORE PROT v19.2
</p>`,
`<p className="text-[9px] font-bold text-gray-500 font-mono">
   BILL_ID: {checkOrderBillingPermission(previewReceipt, 'show_on_bill') !== false ? (previewReceipt.bill_no || previewReceipt.id) : '***'} // SECURE CORE PROT v19.2
</p>`,
  "12. KOT Reference Hiding in Global Preview Modal (Top)"
);

// 13. KOT Reference Hiding in Global Preview Modal (Right simulator block)
replaceExactlyOnce(
`<span><strong>Bill:</strong> {previewReceipt.bill_no || previewReceipt.id}</span>`,
`<span><strong>Bill:</strong> {checkOrderBillingPermission(previewReceipt, 'show_on_bill') !== false ? (previewReceipt.bill_no || previewReceipt.id) : '***'}</span>`,
  "13. KOT Reference Hiding in Global Preview Modal (Right)"
);

// 14. KOT Auto-Print Bill
replaceExactlyOnce(
`const printWindow = window.open('', '_blank', 'width=300,height=600');
if (!printWindow) {
toast.error("Failed to open print window. Please allow popups.");
return;
}
printWindow.document.write(receiptHtml);
printWindow.document.close();
};`,
`const printWindow = window.open('', '_blank', 'width=300,height=600');
if (!printWindow) {
  toast.error("Failed to open print window. Please allow popups.");
  return;
}
printWindow.document.write(receiptHtml);
printWindow.document.close();

if (getStaffPermissions()?.pos_access?.KOT?.print_kot_and_bill === true) {
  const foundOrder = recentOrders.find(o => String(o.bill_no) === String(bNo) || String(o.id) === String(bNo));
  if (foundOrder) {
    handlePrint(foundOrder);
  }
}
};`,
  "14. KOT Auto-Print Bill"
);

// 15. Inventory Reversal on update status
replaceExactlyOnce(
`await posService.updateOrderStatus(orderId, newStatus, rejectionReason);`,
`const reverseInv = getStaffPermissions()?.pos_access?.Receipts?.reverse_inventory !== false;
await posService.updateOrderStatus(orderId, newStatus, rejectionReason, reverseInv);`,
  "15. Inventory Reversal on update status"
);

// 16. Inventory Reversal on live tracking cancel
replaceExactlyOnce(
`try {
await posService.updateOrderStatus(activeOrderToView.original.id, 'CANCELLED', 'Cancelled from live tracking');
toast.success('Order Cancelled');`,
`try {
  const reverseInv = getStaffPermissions()?.pos_access?.Receipts?.reverse_inventory !== false;
  await posService.updateOrderStatus(activeOrderToView.original.id, 'CANCELLED', 'Cancelled from live tracking', reverseInv);
  toast.success('Order Cancelled');`,
  "16. Inventory Reversal on live tracking cancel"
);

// 17. Shift Closure UI buttons
replaceExactlyOnce(
`<div className="grid grid-cols-2 gap-4 text-xs font-bold">
<div className="flex flex-col gap-1">
<span className="text-[9px] font-black text-[#8b949e] uppercase">Active Cashier / Operator</span>
<span className={isDark ? 'text-white' : 'text-slate-800'}>
{username || business?.name || 'admin'}
</span>
</div>
<div className="flex flex-col gap-1">
<span className="text-[9px] font-black text-[#8b949e] uppercase">Role</span>
<span className={\`px-2 py-0.5 rounded text-[9px] w-fit font-black uppercase tracking-wider \${isDark ? 'bg-[#161b22] text-gray-300' : 'bg-slate-100 text-slate-600'}\`}>
{business?.role || 'Administrator'}
</span>
</div>
<div className="flex flex-col gap-1 col-span-2">
<span className="text-[9px] font-black text-[#8b949e] uppercase">Registered Email</span>
<span className={\`font-normal \${isDark ? 'text-gray-300' : 'text-slate-600'}\`}>
{business?.email || 'N/A'}
</span>
</div>
</div>`,
`<div className="grid grid-cols-2 gap-4 text-xs font-bold">
   <div className="flex flex-col gap-1">
      <span className="text-[9px] font-black text-[#8b949e] uppercase">Active Cashier / Operator</span>
      <span className={isDark ? 'text-white' : 'text-slate-800'}>
         {username || business?.name || 'admin'}
      </span>
   </div>
   <div className="flex flex-col gap-1">
      <span className="text-[9px] font-black text-[#8b949e] uppercase">Role</span>
      <span className={\`px-2 py-0.5 rounded text-[9px] w-fit font-black uppercase tracking-wider \${isDark ? 'bg-[#161b22] text-gray-300' : 'bg-slate-100 text-slate-600'}\`}>
         {business?.role || 'Administrator'}
      </span>
   </div>
   <div className="flex flex-col gap-1 col-span-2">
      <span className="text-[9px] font-black text-[#8b949e] uppercase">Registered Email</span>
      <span className={\`font-normal \${isDark ? 'text-gray-300' : 'text-slate-600'}\`}>
         {business?.email || 'N/A'}
      </span>
   </div>
</div>
<div className="flex gap-2 mt-4 pt-4 border-t border-dashed border-slate-200 dark:border-gray-800">
  {getStaffPermissions()?.pos_access?.Account?.close_shift !== false && (
    <button
      onClick={() => handleOpenCloseShiftModal('shift')}
      className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-[10px] font-black uppercase transition-all shadow-md active:scale-95"
    >
      Close Shift
    </button>
  )}
  {getStaffPermissions()?.pos_access?.Account?.close_day !== false && (
    <button
      onClick={() => handleOpenCloseShiftModal('day')}
      className="px-4 py-2 bg-[#10ac84] hover:bg-[#0e9a75] text-white rounded-lg text-[10px] font-black uppercase transition-all shadow-md active:scale-95"
    >
      Close Day
    </button>
  )}
</div>`,
  "17. Shift Closure UI buttons"
);

// 18. Render CloseShiftModal markup
replaceExactlyOnce(
`{/* EXPENSE LEDGER MODAL */}`,
`{/* CLOSE SHIFT / CLOSE DAY MODAL */}
<AnimatePresence>
   {isCloseShiftModalOpen && (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-[#0f172a]/90 backdrop-blur-md">
         <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} className={\`w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border \${isDark ? 'bg-[#161b22] border-[#30363d] text-white' : 'bg-white border-slate-200 text-slate-900'} flex flex-col\`}>
            <div className="p-6 border-b border-dashed border-slate-200 dark:border-gray-800 flex justify-between items-center">
               <div>
                  <h3 className="text-lg font-black uppercase italic tracking-tighter">Close {closeShiftType === 'shift' ? 'Shift' : 'Day'}</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">Verify terminal totals before closing</p>
               </div>
               <button onClick={() => setIsCloseShiftModalOpen(false)} className="p-2 hover:bg-white/10 rounded-xl transition-all text-sm">✕</button>
            </div>

            <form onSubmit={handleCloseShiftSubmit} className="p-6 space-y-4">
               <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0d1117] border border-slate-100 dark:border-gray-800 text-xs font-bold space-y-2">
                  <div className="flex justify-between">
                     <span className="text-slate-400">Total Shift Sales</span>
                     <span>{config.currency}{shift.sales.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                     <span className="text-slate-400">Shift Expenses</span>
                     <span>{config.currency}{shift.expenses.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between border-t border-dashed pt-2 border-slate-200 dark:border-gray-850">
                     <span className="text-slate-400">Opening Balance</span>
                     <span>{config.currency}{shift.openingBalance.toFixed(2)}</span>
                  </div>
               </div>

               {getStaffPermissions()?.pos_access?.Account?.cash_drawer_closing_control !== false && (
                  <div className="space-y-1.5">
                     <label className="text-[8px] font-black uppercase text-slate-500">Actual Cash in Drawer</label>
                     <input
                        type="number"
                        placeholder="0.00"
                        required
                        value={closingCashAmount}
                        onChange={e => setClosingCashAmount(e.target.value)}
                        className={\`w-full p-4 rounded-2xl border font-black text-xl outline-none transition-colors \${
                           isDark ? 'bg-gray-900 border-gray-800 focus:border-[#238636] text-white' : 'bg-white border-slate-200 focus:border-emerald-600 text-slate-900'
                        }\`}
                     />
                  </div>
               )}

               <button
                  type="submit"
                  className="w-full py-4 bg-rose-600 hover:bg-rose-500 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-rose-500/20 active:scale-95 transition-all mt-4"
               >
                  Confirm & Close {closeShiftType === 'shift' ? 'Shift' : 'Day'}
               </button>
            </form>
         </motion.div>
      </motion.div>
   )}
</AnimatePresence>

{/* EXPENSE LEDGER MODAL */}`,
  "18. Render CloseShiftModal markup"
);

// 19. Expense Management "Record Expense" Button hide/disable
replaceExactlyOnce(
`<button
onClick={() => {
if (!expenseForm.amount) return toast.error("Enter amount!");
const newExpense = { ...expenseForm, id: Date.now() };
setExpenses(prev => [newExpense, ...prev]);
setExpenseForm({ category: 'General', amount: '', description: '', paymentMode: 'CASH', date: new Date().toISOString().split('T')[0] });
toast.success("Expense Recorded!");
}}
className="w-full py-4 bg-rose-500 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-rose-500/20 active:scale-95 transition-all mt-4"
>
Record Expense
</button>`,
`{getStaffPermissions()?.pos_access?.ExpenseManagement?.add_expense !== false && (
   <button
      onClick={() => {
         if (!expenseForm.amount) return toast.error("Enter amount!");
         const newExpense = { ...expenseForm, id: Date.now() };
         setExpenses(prev => [newExpense, ...prev]);
         setExpenseForm({ category: 'General', amount: '', description: '', paymentMode: 'CASH', date: new Date().toISOString().split('T')[0] });
         toast.success("Expense Recorded!");
      }}
      className="w-full py-4 bg-rose-500 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-rose-500/20 active:scale-95 transition-all mt-4"
   >
      Record Expense
   </button>
)}`,
  "19. Expense Management Record Expense button"
);

// 20. Expense Category selection "+" button, and Sub-category setup
replaceExactlyOnce(
`<div className="space-y-1.5">
<label className="text-[8px] font-black uppercase text-slate-500">Category</label>
<select
value={expenseForm.category}
onChange={e => setExpenseForm({...expenseForm, category: e.target.value})}
className="w-full p-4 rounded-2xl bg-white border border-slate-200 font-bold text-xs outline-none focus:border-rose-500"
>
{expenseCategories.map(c => <option key={c} value={c}>{c}</option>)}
</select>
</div>`,
`<div className="space-y-1.5">
   <label className="text-[8px] font-black uppercase text-slate-500">Category</label>
   <div className="flex gap-2">
      <select
         value={expenseForm.category}
         onChange={e => setExpenseForm({...expenseForm, category: e.target.value})}
         className="flex-1 p-4 rounded-2xl bg-white border border-slate-200 font-bold text-xs outline-none focus:border-rose-500"
      >
         {expenseCategories.map(c => <option key={c} value={c}>{c}</option>)}
      </select>
      {getStaffPermissions()?.pos_access?.ExpenseManagement?.add_category !== false && (
         <button
            type="button"
            onClick={() => {
               const newCat = prompt("Enter new expense category name:");
               if (newCat && newCat.trim()) {
                  setExpenseCategories(prev => [...prev, newCat.trim()]);
                  setExpenseForm(prev => ({ ...prev, category: newCat.trim() }));
               }
            }}
            className="p-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl flex items-center justify-center transition-all active:scale-95"
            title="Add Category"
         >
            <Plus size={16} />
         </button>
      )}
   </div>
</div>
{getStaffPermissions()?.pos_access?.ExpenseManagement?.sub_category !== false && (
   <div className="space-y-1.5">
      <label className="text-[8px] font-black uppercase text-slate-500">Sub-Category</label>
      <input
         type="text"
         placeholder="Sub-Category name (e.g. Milk, Cheese)"
         value={expenseForm.subCategory || ''}
         onChange={e => setExpenseForm({...expenseForm, subCategory: e.target.value})}
         className="w-full p-4 rounded-2xl bg-white border border-slate-200 font-bold text-xs outline-none focus:border-rose-500"
      />
   </div>
)}`,
  "20. Expense Category '+' button & Sub-category input"
);

// 21. Expense Management Cash outflow card hide
replaceExactlyOnce(
`<div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
<p className="text-[8px] font-black uppercase text-slate-400 mb-1">Cash Outflow</p>
<p className="text-2xl font-black italic tracking-tighter text-amber-500">{config.currency}{expenses.filter(e => e.paymentMode === 'CASH').reduce((acc, e) => acc + parseFloat(e.amount), 0).toFixed(0)}</p>
</div>`,
`{getStaffPermissions()?.pos_access?.ExpenseManagement?.cash_drawer !== false && (
   <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
      <p className="text-[8px] font-black uppercase text-slate-400 mb-1">Cash Outflow</p>
      <p className="text-2xl font-black italic tracking-tighter text-amber-500">{config.currency}{expenses.filter(e => e.paymentMode === 'CASH').reduce((acc, e) => acc + parseFloat(e.amount), 0).toFixed(0)}</p>
   </div>
)}`,
  "21. Expense Management Cash Outflow card"
);

// 22. Add remaining reports to REPORTS_LIST
replaceExactlyOnce(
`{ name: 'Order Sync History', icon: RefreshCcw },
{ name: 'ZATCA Report', icon: FileText },
{ name: 'Logistic Report', icon: Truck },
{ name: 'Order Transition Report', icon: RefreshCcw },
{ name: 'ERP Sync History', icon: Database },
{ name: 'Jordan History', icon: History }
];`,
`{ name: 'Order Sync History', icon: RefreshCcw },
{ name: 'ZATCA Report', icon: FileText },
{ name: 'Logistic Report', icon: Truck },
{ name: 'Order Transition Report', icon: RefreshCcw },
{ name: 'ERP Sync History', icon: Database },
{ name: 'Jordan History', icon: History },
{ name: 'Pre Order Report', icon: FileText },
{ name: 'KOT Report', icon: Receipt },
{ name: 'Reservation Report', icon: Calendar }
];`,
  "22. Add remaining reports to REPORTS_LIST"
);

// 23. Guard Split Bill buttons in Dine-In, Pickup, Quick, Pre-Order
replaceExactlyOnce(
`<button onClick={() => setIsSplitModalOpen(true)} className="bg-[#489972] hover:bg-[#56a881] px-2.5 py-0.5 rounded-full text-[10px] font-bold transition-all border border-white/10">
Split Bill
</button>`,
`{getStaffPermissions()?.pos_access?.SplitBill?.visible !== false && (
  <button onClick={() => setIsSplitModalOpen(true)} className="bg-[#489972] hover:bg-[#56a881] px-2.5 py-0.5 rounded-full text-[10px] font-bold transition-all border border-white/10">
    Split Bill
  </button>
)}`,
  "23. Guard Split Bill button (Dine-In)"
);

replaceAll(
`<button
onClick={() => setIsSplitModalOpen(true)}
className="bg-[#489972] hover:bg-[#56a881] px-2.5 py-0.5 rounded-full text-[10px] font-bold transition-all border border-white/10"
>
Split Bill
</button>`,
`{getStaffPermissions()?.pos_access?.SplitBill?.visible !== false && (
  <button
    onClick={() => setIsSplitModalOpen(true)}
    className="bg-[#489972] hover:bg-[#56a881] px-2.5 py-0.5 rounded-full text-[10px] font-bold transition-all border border-white/10"
  >
    Split Bill
  </button>
)}`,
  "24. Guard Split Bill button (Pickup/Quick/Preorder)"
);

fs.writeFileSync(filePath, content, 'utf8');
console.log("🎉 All remaining Phase 2 permissions successfully applied to App.jsx!");
