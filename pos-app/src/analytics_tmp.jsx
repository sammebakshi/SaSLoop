            {activeTab === 'analytics' && (
              <motion.div key="analytics" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full p-4 overflow-y-auto no-scrollbar bg-[#0d1117]">
                
                <div className="flex gap-4">
                  {/* Left Column (Main Stats + Charts) */}
                  <div className="flex-[0.75] flex flex-col gap-4">
                    
                    {/* Top Row Cards */}
                    <div className="grid grid-cols-4 gap-4">
                      <div className="bg-white rounded p-4 text-center border border-slate-200 shadow-sm flex flex-col justify-center relative overflow-hidden">
                        <div className="text-[10px] font-bold text-slate-500 mb-1">Today's Sales</div>
                        <div className="text-xl font-bold text-[#18ba60]">{config.currency} 3840.00 <span className="text-sm font-normal">(10)</span></div>
                      </div>
                      <div className="bg-white rounded p-4 text-center border border-slate-200 shadow-sm flex flex-col justify-center">
                        <div className="text-[10px] font-bold text-slate-500 mb-1">Total Sales</div>
                        <div className="text-xl font-bold text-[#18ba60]">***</div>
                      </div>
                      <div className="bg-white rounded p-4 text-center border border-slate-200 shadow-sm flex flex-col justify-center">
                        <div className="text-[10px] font-bold text-slate-500 mb-1">This Month</div>
                        <div className="text-xl font-bold text-[#18ba60]">{config.currency} 17090.00 <span className="text-sm font-normal">(35)</span></div>
                      </div>
                      <div className="bg-white rounded p-4 text-center border border-slate-200 shadow-sm flex flex-col justify-center">
                        <div className="text-[10px] font-bold text-slate-500 mb-1">IP Address</div>
                        <div className="text-xl font-bold text-[#18ba60]">192.168.29.43</div>
                      </div>
                    </div>

                    {/* Middle Row Cards */}
                    <div className="grid grid-cols-4 gap-4">
                      {[
                        { title: 'Offline Sales', val: '25963.00(49)', icon: <Globe size={24} className="text-[#18ba60]"/> },
                        { title: 'Online Sales', val: '0.00(0)', icon: <Globe size={24} className="text-[#18ba60]"/> },
                        { title: 'Digital Sales', val: '1920.00(4)', icon: <Globe size={24} className="text-[#18ba60]"/> },
                        { title: 'Total Tax', val: '0.00', icon: <Percent size={24} className="text-[#18ba60]"/> },
                        { title: 'Total Discount', val: '5.00', icon: <Tag size={24} className="text-[#18ba60]"/> },
                        { title: 'Dine in', val: '6027.00 (14)', icon: <Utensils size={24} className="text-[#18ba60]"/> },
                        { title: 'Quick Bill', val: '15756.00 (29)', icon: <Zap size={24} className="text-[#18ba60]"/> },
                        { title: 'PickUp', val: '4180.00 (6)', icon: <ShoppingBag size={24} className="text-[#18ba60]"/> }
                      ].map(c => (
                        <div key={c.title} className="bg-white rounded p-4 border border-slate-200 shadow-sm flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full border-2 border-[#18ba60] flex items-center justify-center shrink-0">
                            {c.icon}
                          </div>
                          <div>
                            <div className="text-[10px] font-bold text-slate-500">{c.title}</div>
                            <div className="text-sm font-bold text-[#18ba60]">{config.currency} {c.val}</div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Bottom Charts Row */}
                    <div className="flex gap-4 h-64">
                      {/* Pie Chart Area */}
                      <div className="flex-[0.35] bg-white rounded p-4 border border-slate-200 shadow-sm flex flex-col">
                        <div className="flex gap-2 mb-4">
                          <input type="text" placeholder="Lim" className="w-10 h-7 border rounded text-[9px] px-1" />
                          <input type="text" placeholder="06 Apr - 06 May" className="flex-1 h-7 border rounded text-[9px] px-2" />
                          <button className="h-7 px-3 bg-[#161b22] text-white text-[9px] font-bold rounded">Fetch</button>
                        </div>
                        <div className="flex flex-wrap gap-2 text-[8px] font-bold text-slate-600 mb-4">
                          <div className="flex items-center gap-1"><div className="w-3 h-3 bg-blue-500"></div>Veg Biryani</div>
                          <div className="flex items-center gap-1"><div className="w-3 h-3 bg-slate-400"></div>Batata Vada</div>
                          <div className="flex items-center gap-1"><div className="w-3 h-3 bg-orange-500"></div>Jalebi</div>
                          <div className="flex items-center gap-1"><div className="w-3 h-3 bg-purple-500"></div>Filter Coffee</div>
                          <div className="flex items-center gap-1"><div className="w-3 h-3 bg-amber-800"></div>Indian taco</div>
                        </div>
                        <div className="flex-1 flex items-center justify-center relative">
                           {/* Simple static pie chart using conic-gradient */}
                           <div className="w-40 h-40 rounded-full" style={{ background: 'conic-gradient(#3b82f6 0% 30%, #64748b 30% 50%, #f97316 50% 65%, #a855f7 65% 85%, #92400e 85% 100%)' }}></div>
                           <div className="absolute inset-0 m-auto w-20 h-20 bg-white rounded-full"></div>
                        </div>
                      </div>

                      {/* Line Chart Area */}
                      <div className="flex-[0.65] bg-white rounded p-4 border border-slate-200 shadow-sm flex flex-col">
                        <div className="flex gap-2 mb-4">
                          <select className="h-7 border rounded text-[9px] px-2 bg-slate-50"><option>Daily</option></select>
                          <input type="text" placeholder="06 Apr - 06 May" className="w-32 h-7 border rounded text-[9px] px-2" />
                          <button className="h-7 px-3 bg-[#161b22] text-white text-[9px] font-bold rounded">Fetch</button>
                          <div className="ml-auto flex items-center gap-1 text-[9px] font-bold"><div className="w-4 h-2 bg-orange-500"></div>Sales</div>
                        </div>
                        <div className="flex-1 border-l border-b border-slate-200 relative flex items-end px-2">
                           {/* Static line chart visualization */}
                           <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full overflow-visible p-2">
                             <polyline fill="none" stroke="#f97316" strokeWidth="2" points="0,80 20,85 40,50 60,55 80,60 100,10" />
                             <circle cx="0" cy="80" r="2" fill="#f97316"/>
                             <circle cx="20" cy="85" r="2" fill="#f97316"/>
                             <circle cx="40" cy="50" r="2" fill="#f97316"/>
                             <circle cx="60" cy="55" r="2" fill="#f97316"/>
                             <circle cx="80" cy="60" r="2" fill="#f97316"/>
                             <circle cx="100" cy="10" r="2" fill="#f97316"/>
                           </svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column (Bar Charts & Payment Breakdown) */}
                  <div className="flex-[0.25] flex flex-col gap-4">
                    {/* Orange Header Box */}
                    <div className="bg-[#f97316] rounded p-4 text-white shadow-sm flex flex-col justify-between" style={{ height: '100px' }}>
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] font-bold">Sales Analysis</span>
                        <span className="text-[9px]">This weeks data</span>
                      </div>
                      <div className="flex justify-between items-end h-8 gap-1">
                        <div className="w-4 bg-white/40 h-3 rounded-t-sm"></div>
                        <div className="w-4 bg-white/40 h-5 rounded-t-sm"></div>
                        <div className="w-4 bg-white h-7 rounded-t-sm"></div>
                        <div className="w-4 bg-white/40 h-4 rounded-t-sm"></div>
                        <div className="w-4 bg-white/40 h-6 rounded-t-sm"></div>
                        <div className="w-4 bg-white/40 h-8 rounded-t-sm"></div>
                        <div className="w-4 bg-white/30 h-8 rounded-t-sm"></div>
                      </div>
                      <div className="flex justify-between text-[7px] font-bold mt-1 opacity-80">
                        <span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span>
                      </div>
                    </div>

                    {/* Payment Breakdown Bars */}
                    <div className="bg-[#6366f1] rounded p-4 text-white shadow-sm flex-1 flex flex-col gap-4">
                      {[
                        { label: 'AmazonPay', val: 380, pct: 15 },
                        { label: 'ApplePay', val: 480, pct: 20 },
                        { label: 'Card', val: 325, pct: 12 },
                        { label: 'Cash', val: 2655, pct: 85 }
                      ].map(p => (
                        <div key={p.label} className="space-y-1">
                          <div className="flex justify-between text-[10px] font-bold">
                            <span>{p.label}</span>
                            <span>{config.currency} {p.val.toFixed(2)}</span>
                          </div>
                          <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                            <div className="h-full bg-white rounded-full" style={{ width: `${p.pct}%` }}></div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Green Bar Chart Area */}
                    <div className="bg-white rounded p-4 border border-slate-200 shadow-sm" style={{ height: '240px' }}>
                      <div className="flex items-center gap-1 text-[9px] font-bold text-slate-600 justify-end mb-4"><div className="w-4 h-2 bg-[#18ba60]"></div>Sales</div>
                      <div className="h-32 border-b border-slate-200 flex items-end justify-between px-2 pb-1 gap-2">
                         <div className="w-8 bg-[#18ba60] h-6 rounded-t-sm"></div>
                         <div className="w-8 bg-[#18ba60] h-12 rounded-t-sm"></div>
                         <div className="w-8 bg-[#18ba60] h-20 rounded-t-sm"></div>
                         <div className="w-8 bg-[#18ba60] h-16 rounded-t-sm"></div>
                         <div className="w-8 bg-[#18ba60] h-32 rounded-t-sm"></div>
                      </div>
                      <div className="flex justify-between text-[7px] font-bold text-slate-400 mt-2">
                        <span>01 May</span><span>02 May</span><span>03 May</span><span>04 May</span><span>05 May</span>
                      </div>
                      <div className="mt-4 flex items-center justify-between text-[8px] font-bold text-slate-500 bg-slate-50 p-1 rounded">
                        <span>Filter: 06 Apr 2024 - 06 May 2024</span>
                        <RefreshCcw size={10} className="text-[#18ba60]"/>
                      </div>
                    </div>

                  </div>
                </div>
              </motion.div>
            )}
