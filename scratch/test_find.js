const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../pos-app/src/App.jsx');
const content = fs.readFileSync(filePath, 'utf8').replace(/\r\n/g, '\n');

const target = `                  ) : activeTrayTab === 'KOT' ? (
                    <div className={\`flex gap-1.5 p-1.5 shrink-0 transition-colors border-t \${isDark ? 'bg-[#0d1117] border-gray-800' : 'bg-white border-slate-200'}\`}>
                      {!posSettings.disableSaveKOT && (
                        <button
                          onClick={() => {
                            if (orderType === 'PICKUP') {
                              handleSaveTemporaryKOT(false);
                              return;
                            }
                            if (!selectedTable) { toast.error("Select a table!"); return; }
                            if (cart.length === 0) { toast.error("KOT is empty!"); return; }
                            let bNo = tableBillNumbers[selectedTable.id];
                            if (!bNo) {
                              bNo = nextBillNo;
                              setTableBillNumbers(prev => ({...prev, [selectedTable.id]: bNo}));
                              setNextBillNo(prev => prev + 1);
                            }
                            const cartWithKotNo = cart.map(i => ({ ...i, kotNo: bNo }));
                            const isTableVacant = !tableStatuses[selectedTable.id] || tableStatuses[selectedTable.id] === 'AVAILABLE';
                            setTableBills(prev => ({ ...prev, [selectedTable.id]: mergeBillItems([...(isTableVacant ? [] : (prev[selectedTable.id] || [])), ...cartWithKotNo]) }));
                            setTableActiveTimestamps(prev => prev[selectedTable.id] ? prev : ({ ...prev, [selectedTable.id]: Date.now() }));
                            setTableStatuses(prev => ({ ...prev, [selectedTable.id]: 'SAVED' }));
                            setCart([]);
                            setTableCarts(prev => ({ ...prev, [selectedTable.id]: [] }));
                            toast.success("Saved to Billing!");
                            setActiveTrayTab('Billing');
                          }}
                          className={\`flex-1 py-2.5 rounded text-[11px] font-bold transition-all border active:scale-95 \${isDark ? 'bg-gray-900 border-gray-700 text-white' : 'bg-[#1a2530] border-slate-800 text-white'}\`}
                        >
                          Save
                        </button>
                      )}
                      <button
                        onClick={() => {
                          if (orderType === 'PICKUP') {
                            handleSaveTemporaryKOT(true);
                            return;
                          }
                          if (!selectedTable) { toast.error("Select a table!"); return; }
                          if (cart.length === 0) { toast.error("KOT is empty!"); return; }

                          let bNo = tableBillNumbers[selectedTable.id];
                          if (!bNo) {
                            bNo = nextBillNo;
                            setTableBillNumbers(prev => ({...prev, [selectedTable.id]: bNo}));
                            setNextBillNo(prev => prev + 1);
                          }

                          const cartWithKotNo = cart.map(i => ({ ...i, kotNo: bNo }));
                          const isTableVacant = !tableStatuses[selectedTable.id] || tableStatuses[selectedTable.id] === 'AVAILABLE';
                          setTableBills(prev => ({ ...prev, [selectedTable.id]: mergeBillItems([...(isTableVacant ? [] : (prev[selectedTable.id] || [])), ...cartWithKotNo]) }));
                          setTableActiveTimestamps(prev => prev[selectedTable.id] ? prev : ({ ...prev, [selectedTable.id]: Date.now() }));

                          // Print KOT
                          handlePrintKOT(cart, selectedTable.table_name, bNo);
                          // Set status to SAVED (Red)
                          setTableStatuses(prev => ({ ...prev, [selectedTable.id]: 'SAVED' }));

                          setCart([]);
                          setTableCarts(prev => ({ ...prev, [selectedTable.id]: [] }));
                          toast.success("KOT Printed & Saved!");
                          setActiveTrayTab('Billing');
                         }}
                         className={\`flex-1 py-2.5 rounded text-[11px] font-bold transition-all active:scale-95 border \${isDark ? 'bg-gray-900 hover:bg-gray-800 border-gray-700 text-white' : 'bg-[#1a2530] hover:bg-[#2c3e50] border-slate-800 text-white'}\`}
                       >
                         Print & Save
                       </button>
                     </div>`.replace(/\r\n/g, '\n');

const fileLines = content.split('\n');
const targetLines = target.split('\n');

const startIdx = 11567; // 0-based is 11566 in file Lines because 11567 was line number
const fileSlice = fileLines.slice(startIdx, startIdx + targetLines.length);

console.log(`Comparing ${targetLines.length} lines:`);
for (let i = 0; i < targetLines.length; i++) {
    const f = fileSlice[i] || '';
    const t = targetLines[i] || '';
    if (f !== t) {
        console.log(`Line ${startIdx + i + 1} MISMATCH:`);
        console.log(`FILE:   "${f}"`);
        console.log(`TARGET: "${t}"`);
    } else {
        console.log(`Line ${startIdx + i + 1} MATCH`);
    }
}
