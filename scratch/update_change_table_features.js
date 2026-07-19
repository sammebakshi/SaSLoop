const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'pos-app', 'src', 'App.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Update handleChangeTable definition with merge logic
const oldHandleChangeTablePattern = /const handleChangeTable = async \(\) => \{[\s\S]*?toast\.success\(\`Transferred order to \${targetTable\.table_name}\`\);\s*\};/g;

const newHandleChangeTable = `const handleChangeTable = async () => {
    if (getStaffPermissions()?.pos_access?.OrderWindow?.change_table_passcode === true) {
      const pin = prompt("Enter Manager PIN to authorize table transfer:");
      if (pin === null) return;
      if (!verifyManagerPin(pin)) {
        toast.error("Invalid Manager PIN/Passcode!");
        return;
      }
    }
    if (!selectedTable) {
      toast.error("Please select an active table to transfer!");
      return;
    }

    // Open modal and wait for target table selection
    const targetTable = await new Promise((resolve) => {
      changeTableResolveRef.current = resolve;
      setIsChangeTableModalOpen(true);
    });

    if (!targetTable) return;

    if (targetTable.id === selectedTable.id) {
      toast.error("Cannot transfer to the same table!");
      return;
    }

    const oldCart = tableCarts[selectedTable.id] || [];
    const oldBill = tableBills[selectedTable.id] || [];
    const oldStatus = tableStatuses[selectedTable.id] || 'AVAILABLE';
    const oldBillNo = tableBillNumbers[selectedTable.id];
    const oldTime = tableActiveTimestamps[selectedTable.id];

    // Transfer additional details
    const oldWaiter = tableWaiters?.[selectedTable.id];
    const oldDiscount = tableDiscounts?.[selectedTable.id];
    const oldAddCharges = tableAdditionalCharges?.[selectedTable.id];
    const oldCustomer = tableCustomers?.[selectedTable.id];

    // Merge carts and bills
    const targetTableExistingCart = tableCarts[targetTable.id] || [];
    const targetTableExistingBill = tableBills[targetTable.id] || [];

    const mergedCart = mergeBillItems([...targetTableExistingCart, ...oldCart]);
    const mergedBill = mergeBillItems([...targetTableExistingBill, ...oldBill]);

    // Merge metadata
    const mergedBillNo = tableBillNumbers[targetTable.id] || oldBillNo;
    const mergedTime = tableActiveTimestamps[targetTable.id] || oldTime;

    // Resolve merged status
    let mergedStatus = 'AVAILABLE';
    const sourceStatus = tableStatuses[selectedTable.id] || 'AVAILABLE';
    const targetStatus = tableStatuses[targetTable.id] || 'AVAILABLE';
    if (sourceStatus === 'BILL_SAVED' || targetStatus === 'BILL_SAVED') {
      mergedStatus = 'BILL_SAVED';
    } else if (sourceStatus === 'PRINTED' || targetStatus === 'PRINTED') {
      mergedStatus = 'PRINTED';
    } else if (sourceStatus === 'DRAFT_PRINTED' || targetStatus === 'DRAFT_PRINTED') {
      mergedStatus = 'DRAFT_PRINTED';
    } else if (sourceStatus === 'ORDERING' || targetStatus === 'ORDERING') {
      mergedStatus = 'ORDERING';
    } else if (sourceStatus === 'ITEMS_IN_KOT' || targetStatus === 'ITEMS_IN_KOT') {
      mergedStatus = 'ITEMS_IN_KOT';
    } else if (mergedCart.length > 0 || mergedBill.length > 0) {
      mergedStatus = 'ORDERING';
    }

    // Set states
    setTableCarts(prev => {
      const updated = { ...prev };
      updated[targetTable.id] = mergedCart;
      delete updated[selectedTable.id];
      return updated;
    });

    setTableBills(prev => {
      const updated = { ...prev };
      updated[targetTable.id] = mergedBill;
      delete updated[selectedTable.id];
      return updated;
    });

    setTableStatuses(prev => {
      const updated = { ...prev };
      updated[targetTable.id] = mergedStatus;
      updated[selectedTable.id] = 'AVAILABLE';
      return updated;
    });

    setTableBillNumbers(prev => {
      const updated = { ...prev };
      if (mergedBillNo) {
        updated[targetTable.id] = mergedBillNo;
      }
      delete updated[selectedTable.id];
      return updated;
    });

    setTableActiveTimestamps(prev => {
      const updated = { ...prev };
      if (mergedTime) {
        updated[targetTable.id] = mergedTime;
      }
      delete updated[selectedTable.id];
      return updated;
    });

    if (setTableWaiters && oldWaiter) {
      setTableWaiters(prev => {
        const updated = { ...prev };
        updated[targetTable.id] = oldWaiter || prev[targetTable.id];
        delete updated[selectedTable.id];
        return updated;
      });
    }

    if (setTableDiscounts && oldDiscount) {
      setTableDiscounts(prev => {
        const updated = { ...prev };
        updated[targetTable.id] = oldDiscount || prev[targetTable.id];
        delete updated[selectedTable.id];
        return updated;
      });
    }

    if (setTableAdditionalCharges && oldAddCharges) {
      setTableAdditionalCharges(prev => {
        const updated = { ...prev };
        updated[targetTable.id] = oldAddCharges || prev[targetTable.id];
        delete updated[selectedTable.id];
        return updated;
      });
    }

    if (setTableCustomers && oldCustomer) {
      setTableCustomers(prev => {
        const updated = { ...prev };
        updated[targetTable.id] = oldCustomer || prev[targetTable.id];
        delete updated[selectedTable.id];
        return updated;
      });
    }

    setSelectedTable(targetTable);
    setCart(mergedCart); // Make sure the active checkout panel updates to the merged cart!

    try {
      if (posService.updateTableStatus) {
        await posService.updateTableStatus(targetTable.table_name, mergedStatus);
        await posService.updateTableStatus(selectedTable.table_name, 'AVAILABLE');
      }
    } catch (e) {
      console.error("Error updating table statuses in DB:", e);
    }

    toast.success(\`Merged and transferred order to \${targetTable.table_name}\`);
  };`;

if (oldHandleChangeTablePattern.test(content)) {
  content = content.replace(oldHandleChangeTablePattern, newHandleChangeTable);
  console.log("handleChangeTable updated successfully with merge logic!");
} else {
  console.error("handleChangeTable pattern not found!");
}

// 2. Update isChangeTableModalOpen JSX design to be vertical
const oldModalPattern = /\{isChangeTableModalOpen && \([\s\S]*?Cancel\s*<\/button>[\s\S]*?<\/div>[\s\S]*?<\/div>[\s\S]*?<\/div>[\s\S]*?\)\}/;

const newModalStr = `{isChangeTableModalOpen && (
           <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] p-4 backdrop-blur-sm">
              <div className={\`border rounded-[2rem] w-full max-w-md flex flex-col shadow-2xl overflow-hidden \${
                 isDark ? 'bg-[#0d1117] border-[#30363d]' : 'bg-white border-slate-200'
              }\`}>
                 {/* Header */}
                 <div className={\`p-6 border-b flex justify-between items-center \${isDark ? 'bg-[#161b22] border-[#30363d]' : 'bg-slate-50 border-slate-200'}\`}>
                     <h3 className={\`text-lg font-black uppercase italic tracking-tighter flex items-center gap-2 \${isDark ? 'text-white' : 'text-slate-900'}\`}>
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        Change Table / Transfer Order
                     </h3>
                     <button 
                        onClick={() => {
                           if (changeTableResolveRef.current) changeTableResolveRef.current(null);
                           setIsChangeTableModalOpen(false);
                        }} 
                        className={\`p-2 rounded-xl transition-all text-sm cursor-pointer \${
                           isDark ? 'text-[#8b949e] hover:bg-white/10 hover:text-white' : 'text-slate-400 hover:bg-slate-100 hover:text-slate-800'
                        }\`}
                     >
                        ✕
                     </button>
                  </div>
                 {/* Body */}
                 <div className="p-5 max-h-[50vh] overflow-y-auto no-scrollbar space-y-3">
                    <p className={\`text-[11px] font-black uppercase tracking-widest \${isDark ? 'text-[#8b949e]' : 'text-slate-500'}\`}>
                       Select target table to transfer <span className="text-[#18ba60]">{selectedTable?.table_name}</span> to:
                    </p>
                    
                    {/* Vertical list of tables */}
                    <div className="flex flex-col gap-2">
                       {tables
                         .filter(t => t.id !== selectedTable?.id)
                         .map(table => {
                            const isOccupied = (tableBills[table.id] || []).filter(item => !item.isCancelled).length > 0 || (tableCarts[table.id] || []).length > 0;
                            return (
                               <button
                                  key={table.id}
                                  onClick={() => {
                                     if (changeTableResolveRef.current) changeTableResolveRef.current(table);
                                     setIsChangeTableModalOpen(false);
                                  }}
                                  className={\`w-full p-4 rounded-xl border flex items-center justify-between transition-all duration-200 active:scale-[0.99] group cursor-pointer \${
                                     isOccupied
                                       ? (isDark ? 'bg-amber-500/5 border-amber-500/30 text-amber-400 hover:bg-amber-500/10' : 'bg-amber-50 border-amber-200 text-amber-600 hover:bg-amber-100')
                                       : (isDark ? 'bg-[#161b22] border-[#30363d] text-[#c9d1d9] hover:bg-[#21262d] hover:border-emerald-500/50 hover:text-white' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-emerald-500/50 hover:text-slate-900')
                                  }\`}
                               >
                                  <div className="flex items-center gap-3">
                                     <div className={\`w-2 h-2 rounded-full \${isOccupied ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}\`}></div>
                                     <span className="text-xs font-black uppercase tracking-tight">{table.table_name}</span>
                                  </div>
                                  <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded tracking-wide bg-black/10">
                                     {isOccupied ? 'Occupied (Will Merge)' : 'Vacant'}
                                  </span>
                               </button>
                            );
                         })}
                    </div>
                 </div>
                 {/* Footer */}
                 <div className={\`p-4 flex justify-end \${isDark ? 'bg-[#161b22] border-t border-[#30363d]' : 'bg-slate-50 border-t border-slate-200'}\`}>
                    <button
                       onClick={() => {
                          if (changeTableResolveRef.current) changeTableResolveRef.current(null);
                          setIsChangeTableModalOpen(false);
                       }}
                       className={\`px-4 py-2 rounded-lg text-xs font-bold transition-all active:scale-95 cursor-pointer \${
                          isDark ? 'bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9]' : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                       }\`}
                    >
                       Cancel
                    </button>
                 </div>
              </div>
           </div>
        )}`;

if (oldModalPattern.test(content)) {
  content = content.replace(oldModalPattern, newModalStr);
  console.log("Modal JSX updated to vertical list successfully!");
} else {
  console.error("Modal JSX pattern not found!");
}

fs.writeFileSync(filePath, content, 'utf8');
console.log("App.jsx file updated successfully!");
