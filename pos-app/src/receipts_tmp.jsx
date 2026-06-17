            {activeTab === 'receipts' && (
              <motion.div key="receipts" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col overflow-hidden bg-[#0d1117]">
                
                {/* Top Action Bar */}
                <div className="h-14 border-b border-[#30363d] flex items-center gap-3 px-4 shrink-0 bg-[#0d1117]">
                  <button className="h-8 px-6 bg-[#21262d] text-[#c9d1d9] rounded text-[11px] font-bold border border-[#30363d] hover:bg-[#30363d]">All Bills</button>
                  <button className="h-8 px-6 bg-[#21262d] text-white rounded text-[11px] font-bold border border-[#30363d] hover:bg-[#30363d]">Todays Bills</button>
                  
                  <div className="flex items-center gap-2 ml-2">
                    <input type="checkbox" className="w-3 h-3 accent-[#238636]" />
                    <span className="text-[11px] font-bold text-[#c9d1d9]">Select All</span>
                  </div>

                  <input type="text" placeholder="Search" className="h-8 w-48 ml-2 bg-[#0d1117] border border-[#30363d] rounded px-3 text-[11px] text-[#c9d1d9] outline-none focus:border-[#238636]" />
                  <input type="text" placeholder="30 Apr 2024 - 30 Apr 2024" className="h-8 w-64 bg-[#0d1117] border border-[#30363d] rounded px-3 text-[11px] text-[#c9d1d9] outline-none focus:border-[#238636]" />
                  
                  <button className="h-8 px-6 bg-[#21262d] text-white rounded text-[11px] font-bold border border-[#30363d] hover:bg-[#30363d] ml-auto">Fetch</button>
                  <button className="h-8 px-6 bg-[#21262d] text-white rounded text-[11px] font-bold border border-[#30363d] hover:bg-[#30363d]">Sync Bills</button>
                  <button className="h-8 px-6 bg-red-600 hover:bg-red-700 text-white rounded text-[11px] font-bold">Re-sync Bills</button>
                </div>

                {/* Main Table */}
                <div className="flex-1 overflow-y-auto bg-[#0d1117]">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-[#161b22] border-b border-[#30363d] sticky top-0 z-10 text-[10px] font-bold text-[#8b949e]">
                      <tr>
                        <th className="p-3 w-12 text-center">Select</th>
                        <th className="p-3 w-16">Sr No</th>
                        <th className="p-3 w-20">Bill No</th>
                        <th className="p-3">Table</th>
                        <th className="p-3">Type</th>
                        <th className="p-3">Status</th>
                        <th className="p-3">Customer</th>
                        <th className="p-3">D.Boy</th>
                        <th className="p-3 text-right">Payment</th>
                      </tr>
                    </thead>
                    <tbody className="text-[11px] text-[#c9d1d9]">
                      {[
                        { sr: 11, bill: 7, table: 'birla', type: 'Takeaway', status: 'Fulfilled', customer: 'birla', payment: 'Paytm' },
                        { sr: 12, bill: 6, table: 'tata', type: 'Takeaway', status: 'Fulfilled', customer: 'tata', payment: 'Card' },
                        { sr: 13, bill: 5, table: 'Quick Bill', type: 'Quick Bill', status: 'Fulfilled', customer: '', payment: 'UberEats' },
                        { sr: 14, bill: 4, table: 'Quick Bill', type: 'Quick Bill', status: 'Fulfilled', customer: '', payment: 'Paytm' },
                        { sr: 15, bill: 3, table: 'Quick Bill', type: 'Quick Bill', status: 'Fulfilled', customer: '', payment: 'GooglePay' },
                        { sr: 16, bill: 2, table: 'Table2', type: 'Dine-In', status: 'Fulfilled', customer: '', payment: 'Cash' },
                        { sr: 17, bill: 1, table: 'Table1', type: 'Dine-In', status: 'Fulfilled', customer: '', payment: 'Cash' }
                      ].map((o, idx) => (
                        <tr key={idx} className="border-b border-[#30363d] hover:bg-[#161b22] transition-colors cursor-pointer">
                          <td className="p-3 text-center"><input type="checkbox" className="accent-[#238636]"/></td>
                          <td className="p-3 font-medium">{o.sr}</td>
                          <td className="p-3 font-medium">{o.bill}</td>
                          <td className="p-3 font-medium">{o.table}</td>
                          <td className="p-3"><span className={`px-2 py-1 rounded-full text-[9px] font-bold ${o.type==='Takeaway'?'bg-[#2ea043]/20 text-[#2ea043]':o.type==='Dine-In'?'bg-[#8957e5]/20 text-[#8957e5]':'bg-[#8b949e]/20 text-[#8b949e]'}`}>{o.type}</span></td>
                          <td className="p-3"><span className="px-2 py-1 rounded-full text-[9px] font-bold bg-[#18ba60]/10 text-[#18ba60]">{o.status}</span></td>
                          <td className="p-3">{o.customer}</td>
                          <td className="p-3"></td>
                          <td className="p-3 text-right font-medium">{o.payment}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Summary Strip */}
                <div className="h-10 border-t border-b border-[#30363d] flex items-center justify-between px-4 shrink-0 bg-[#161b22] text-[11px] font-bold text-[#c9d1d9]">
                  <div className="flex items-center gap-2">
                    <div className="w-48 h-2 bg-[#238636] rounded-full overflow-hidden" />
                    <span>Shown Bills Amount (7) : {config.currency} 2868.00</span>
                  </div>
                  <span>Net Sale Amount : {config.currency} 9343.00</span>
                  <span>Total fulfilled amount {config.currency} 9343.00</span>
                </div>

                {/* Pagination Strip */}
                <div className="h-10 flex items-center justify-end px-4 shrink-0 bg-[#0d1117] text-[11px] gap-2 text-[#8b949e] border-b border-[#30363d]">
                  <button className="hover:text-white">Previous</button>
                  <button className="w-6 h-6 flex items-center justify-center rounded hover:bg-[#21262d]">1</button>
                  <button className="w-6 h-6 flex items-center justify-center rounded bg-[#1c4934] text-white">2</button>
                  <button className="hover:text-white">Next</button>
                </div>

                {/* Bottom Detail Panel */}
                <div className="flex h-56 shrink-0 bg-[#0d1117]">
                  {/* Item Details Table */}
                  <div className="flex-[0.6] border-r border-[#30363d] overflow-y-auto no-scrollbar p-2">
                    <table className="w-full text-left">
                      <thead className="border-b border-[#30363d] text-[10px] font-bold text-[#8b949e]">
                        <tr>
                          <th className="p-2">Item Name</th>
                          <th className="p-2 text-center">QTY</th>
                          <th className="p-2 text-right">Price</th>
                          <th className="p-2 text-right">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="text-[11px] text-[#c9d1d9]">
                        {[
                          { name: 'American sub', qty: 2, price: 210, amt: 420 },
                          { name: 'Chicken Burger', qty: 1, price: 250, amt: 250 },
                          { name: 'Steak burger', qty: 1, price: 150, amt: 150 },
                          { name: 'Kimchi burger', qty: 1, price: 200, amt: 200 },
                        ].map((i, idx) => (
                          <tr key={idx} className="border-b border-[#30363d]/50">
                            <td className="p-2">{i.name}</td>
                            <td className="p-2 text-center">{i.qty}</td>
                            <td className="p-2 text-right">{i.price}</td>
                            <td className="p-2 text-right">{i.amt}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Actions & Grand Total */}
                  <div className="flex-[0.4] p-4 flex flex-col justify-end gap-3">
                    <div className="flex items-center gap-2 mb-2">
                      <input type="checkbox" className="accent-[#238636]" />
                      <span className="text-[11px] text-[#8b949e]">Show old bill first</span>
                      
                      <div className="ml-auto flex gap-2">
                        <button className="px-4 py-2 bg-[#21262d] text-white rounded text-[10px] font-bold hover:bg-[#30363d] border border-[#30363d]">Clear Selection</button>
                        <button className="px-4 py-2 bg-[#21262d] text-white rounded text-[10px] font-bold hover:bg-[#30363d] border border-[#30363d]">Today's Report</button>
                        <button className="px-4 py-2 bg-[#21262d] text-white rounded text-[10px] font-bold hover:bg-[#30363d] border border-[#30363d]">Reduce inventory</button>
                      </div>
                    </div>
                    
                    <div className="bg-[#1c4934] h-12 flex items-center justify-between px-4 text-white rounded shadow-lg">
                      <span className="font-bold text-[14px]">Grand Total: 210.00</span>
                      <button className="h-8 w-8 bg-white/20 hover:bg-white/30 rounded flex items-center justify-center transition-colors">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                      </button>
                    </div>
                  </div>
                </div>

              </motion.div>
            )}
