const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, 'App.jsx'); // wait, the script is in scratch, so ../pos-app/src/App.jsx
const resolvedPath = path.resolve(__dirname, '../pos-app/src/App.jsx');
let content = fs.readFileSync(resolvedPath, 'utf8');

// Normalize line endings
content = content.replace(/\r\n/g, '\n');

const target = `<form onSubmit={handleCloseShiftSubmit} className="p-6 space-y-4">
                        >
                           Confirm & Close {closeShiftType === 'shift' ? 'Shift' : 'Day'}
                        </button>
                     </form>`;

const replacement = `<form onSubmit={handleCloseShiftSubmit} className="p-6 space-y-4">
                        {(() => {
                           const windowAccess = closeShiftType === 'shift'
                             ? getStaffPermissions()?.pos_access?.Account?.CloseShiftWindow
                             : getStaffPermissions()?.pos_access?.Account?.CloseDayWindow;

                           const showSales = windowAccess?.hide_settled_amount !== true;
                           const showTxCount = windowAccess?.hide_transaction_count !== true;
                           const showVariance = windowAccess?.hide_variance_amount !== true;
                           
                           const txCount = recentOrders.filter(o => o.status === 'SETTLED' || o.status === 'COMPLETED').length;
                           const expectedCash = (shift.openingBalance || 0) + (shift.sales || 0) - (shift.expenses || 0);
                           const actualCash = parseFloat(closingCashAmount || 0);
                           const variance = actualCash - expectedCash;

                           return (
                              <div className="space-y-4">
                                 <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0d1117] border border-slate-100 dark:border-gray-800 text-xs font-bold space-y-2">
                                    {showSales && (
                                       <>
                                          <div className="flex justify-between">
                                             <span className="text-slate-400">Total Shift Sales</span>
                                             <span>{config.currency}{shift.sales.toFixed(2)}</span>
                                          </div>
                                          <div className="flex justify-between">
                                             <span className="text-slate-400">Shift Expenses</span>
                                             <span>{config.currency}{shift.expenses.toFixed(2)}</span>
                                          </div>
                                       </>
                                    )}
                                    <div className="flex justify-between border-t border-dashed pt-2 border-slate-200 dark:border-gray-850">
                                       <span className="text-slate-400">Opening Balance</span>
                                       <span>{config.currency}{shift.openingBalance.toFixed(2)}</span>
                                    </div>
                                    {showTxCount && (
                                       <div className="flex justify-between border-t border-dashed pt-2 border-slate-200 dark:border-gray-850">
                                          <span className="text-slate-400">Transaction Count</span>
                                          <span>{txCount}</span>
                                       </div>
                                    )}
                                 </div>

                                 {getStaffPermissions()?.pos_access?.Account?.cash_drawer_closing_control !== false && (
                                    <div className="space-y-3">
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

                                       {showVariance && closingCashAmount !== '' && (
                                          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0d1117] border border-slate-100 dark:border-gray-800 text-xs font-bold space-y-2">
                                             <div className="flex justify-between">
                                                <span className="text-slate-400">Expected Cash</span>
                                                <span>{config.currency}{expectedCash.toFixed(2)}</span>
                                             </div>
                                             <div className="flex justify-between border-t border-dashed pt-2 border-slate-200 dark:border-gray-850">
                                                <span className="text-slate-400">Variance</span>
                                                <span className={variance < 0 ? 'text-red-500' : 'text-emerald-500'}>
                                                   {variance < 0 ? '-' : '+'}{config.currency}{Math.abs(variance).toFixed(2)}
                                                </span>
                                             </div>
                                          </div>
                                       )}
                                    </div>
                                 )}

                                 {/* Payment Transaction Summary breakdown for Close Day */}
                                 {closeShiftType === 'day' && getStaffPermissions()?.pos_access?.Account?.CloseDayWindow?.show_payment_transaction_summary !== false && (
                                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0d1117] border border-slate-100 dark:border-gray-800 text-xs font-bold space-y-2">
                                       <h4 className="text-[9px] font-black uppercase text-slate-500 border-b border-dashed pb-1.5 border-slate-200 dark:border-gray-850">Payment breakdown</h4>
                                       {(() => {
                                          const breakdown = recentOrders
                                             .filter(o => o.status === 'SETTLED' || o.status === 'COMPLETED')
                                             .reduce((acc, order) => {
                                                const method = order.payment_method || 'CASH';
                                                acc[method] = (acc[method] || 0) + (parseFloat(order.total_price || 0));
                                                return acc;
                                             }, {});
                                          
                                          const keys = Object.keys(breakdown);
                                          if (keys.length === 0) {
                                             return <p className="text-[10px] text-slate-400 italic">No sales recorded today.</p>;
                                          }
                                          return keys.map(method => (
                                             <div key={method} className="flex justify-between">
                                                <span className="text-slate-400 uppercase">{method}</span>
                                                <span>{config.currency}{breakdown[method].toFixed(2)}</span>
                                             </div>
                                          ));
                                       })()}
                                    </div>
                                 )}
                              </div>
                           );
                        })()}

                        <button
                           type="submit"
                           className="w-full py-4 bg-rose-600 hover:bg-rose-500 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-rose-500/20 active:scale-95 transition-all mt-4"
                        >
                           Confirm & Close {closeShiftType === 'shift' ? 'Shift' : 'Day'}
                        </button>
                     </form>`;

const cleanTarget = target.replace(/\r\n/g, '\n').trim();
const cleanReplacement = replacement.replace(/\r\n/g, '\n').trim();

// Let's find index by normalized content
const lines = content.split('\n');
let foundIdx = -1;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('<form onSubmit={handleCloseShiftSubmit}') && lines[i].includes('className="p-6 space-y-4"')) {
    if (lines[i+1].includes('>') && lines[i+2].includes('Confirm & Close') && lines[i+3].includes('</button>') && lines[i+4].includes('</form>')) {
      foundIdx = i;
      break;
    }
  }
}

if (foundIdx !== -1) {
  lines.splice(foundIdx, 5, cleanReplacement);
  fs.writeFileSync(resolvedPath, lines.join('\n'), 'utf8');
  console.log("✅ Close Shift Modal form details updated successfully!");
} else {
  console.error("❌ Target form not found!");
}
