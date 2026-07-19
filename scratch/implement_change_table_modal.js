const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'pos-app', 'src', 'App.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Declare state variables
const oldStateStr = "  const [customerName, setCustomerName] = useState('');";
const newStateStr = `  const [isChangeTableModalOpen, setIsChangeTableModalOpen] = useState(false);
  const changeTableResolveRef = useRef(null);
  const [customerName, setCustomerName] = useState('');`;

if (content.includes(oldStateStr)) {
  content = content.replace(oldStateStr, newStateStr);
  console.log("State variables declared!");
} else {
  console.error("State string not found!");
}

// 2. Rewrite handleChangeTable
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

    // Transfer states
    setTableCarts(prev => {
      const updated = { ...prev };
      updated[targetTable.id] = oldCart;
      delete updated[selectedTable.id];
      return updated;
    });

    setTableBills(prev => {
      const updated = { ...prev };
      updated[targetTable.id] = oldBill;
      delete updated[selectedTable.id];
      return updated;
    });

    setTableStatuses(prev => {
      const updated = { ...prev };
      updated[targetTable.id] = oldStatus;
      updated[selectedTable.id] = 'AVAILABLE';
      return updated;
    });

    setTableBillNumbers(prev => {
      const updated = { ...prev };
      if (oldBillNo) {
        updated[targetTable.id] = oldBillNo;
        delete updated[selectedTable.id];
      }
      return updated;
    });

    setTableActiveTimestamps(prev => {
      const updated = { ...prev };
      if (oldTime) {
        updated[targetTable.id] = oldTime;
        delete updated[selectedTable.id];
      }
      return updated;
    });

    if (setTableWaiters && oldWaiter) {
      setTableWaiters(prev => {
        const updated = { ...prev };
        updated[targetTable.id] = oldWaiter;
        delete updated[selectedTable.id];
        return updated;
      });
    }

    if (setTableDiscounts && oldDiscount) {
      setTableDiscounts(prev => {
        const updated = { ...prev };
        updated[targetTable.id] = oldDiscount;
        delete updated[selectedTable.id];
        return updated;
      });
    }

    if (setTableAdditionalCharges && oldAddCharges) {
      setTableAdditionalCharges(prev => {
        const updated = { ...prev };
        updated[targetTable.id] = oldAddCharges;
        delete updated[selectedTable.id];
        return updated;
      });
    }

    if (setTableCustomers && oldCustomer) {
      setTableCustomers(prev => {
        const updated = { ...prev };
        updated[targetTable.id] = oldCustomer;
        delete updated[selectedTable.id];
        return updated;
      });
    }

    setSelectedTable(targetTable);
    setCart(oldCart);

    try {
      if (posService.updateTableStatus) {
        await posService.updateTableStatus(targetTable.table_name, oldStatus);
        await posService.updateTableStatus(selectedTable.table_name, 'AVAILABLE');
      }
    } catch (e) {
      console.error("Error updating table statuses in DB:", e);
    }

    toast.success(\`Transferred order to \${targetTable.table_name}\`);
  };`;

if (oldHandleChangeTablePattern.test(content)) {
  content = content.replace(oldHandleChangeTablePattern, newHandleChangeTable);
  console.log("handleChangeTable function replaced!");
} else {
  console.error("handleChangeTable pattern not found!");
}

// 3. Render the modal inside JSX
// We will search for "{isTransferModalOpen && (" and prepend our new modal right before it!
const oldModalStr = `{isTransferModalOpen && (`;
const newModalStr = `{isChangeTableModalOpen && (
           <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] p-4 backdrop-blur-sm">
              <div className={\`border rounded-[2rem] w-full max-w-lg flex flex-col shadow-2xl overflow-hidden \${
                 isDark ? 'bg-[#0d1117] border-[#30363d]' : 'bg-white border-slate-200'
              }\`}>
                 {/* Header */}
                 <div className={\`p-6 border-b flex justify-between items-center \${isDark ? 'bg-[#161b22] border-[#30363d]' : 'bg-slate-50 border-slate-200'}\`}>
                     <h3 className={\`text-xl font-black uppercase italic tracking-tighter flex items-center gap-2 \${isDark ? 'text-white' : 'text-slate-900'}\`}>
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        Change Table / Transfer Order
                     </h3>
                     <button 
                        onClick={() => {
                           if (changeTableResolveRef.current) changeTableResolveRef.current(null);
                           setIsChangeTableModalOpen(false);
                        }} 
                        className={\`p-2 rounded-xl transition-all text-sm \${
                           isDark ? 'text-[#8b949e] hover:bg-white/10 hover:text-white' : 'text-slate-400 hover:bg-slate-100 hover:text-slate-800'
                        }\`}
                     >
                        ✕
                     </button>
                  </div>
                 {/* Body */}
                 <div className="p-5 max-h-[60vh] overflow-y-auto no-scrollbar space-y-4">
                    <p className={\`text-[11px] font-black uppercase tracking-widest \${isDark ? 'text-[#8b949e]' : 'text-slate-500'}\`}>
                       Select target table to transfer <span className="text-[#18ba60]">{selectedTable?.table_name}</span> to:
                    </p>
                    
                    {/* Tables grid */}
                    <div className="grid grid-cols-3 gap-3">
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
                                  className={\`p-4 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all duration-200 active:scale-95 group cursor-pointer \${
                                     isOccupied
                                       ? (isDark ? 'bg-amber-500/5 border-amber-500/30 text-amber-400 hover:bg-amber-500/10' : 'bg-amber-50 border-amber-200 text-amber-600 hover:bg-amber-100')
                                       : (isDark ? 'bg-[#161b22] border-[#30363d] text-[#c9d1d9] hover:bg-[#21262d] hover:border-emerald-500/50 hover:text-white' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-emerald-500/50 hover:text-slate-900')
                                  }\`}
                               >
                                  <span className="text-xs font-black uppercase">{table.table_name}</span>
                                  <span className="text-[8px] font-semibold opacity-75 uppercase">
                                     {isOccupied ? 'Occupied' : 'Vacant'}
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
        )}

        {isTransferModalOpen && (`;

if (content.includes(oldModalStr)) {
  content = content.replace(oldModalStr, newModalStr);
  console.log("Modal rendered inside JSX!");
} else {
  console.error("Modal target string not found!");
}

fs.writeFileSync(filePath, content, 'utf8');
console.log("Finished applying Change Table modal!");
