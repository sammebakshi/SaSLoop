const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../pos-app/src/App.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// Normalize line endings to \n for internal matching
content = content.replace(/\r\n/g, '\n');

// Utility to replace a specific match in the content
function replaceExact(find, replace, label) {
  if (content.includes(find)) {
    content = content.replace(find, replace);
    console.log(`[SUCCESS] Replaced ${label}`);
  } else {
    console.warn(`[FAILED] Exact match not found for ${label}`);
  }
}

// Utility to replace using a scoped regex to avoid matching hook definitions
function replaceRegex(pattern, replacement, label) {
  if (pattern.test(content)) {
    content = content.replace(pattern, (match) => {
      return typeof replacement === 'function' ? replacement(match) : replacement;
    });
    console.log(`[SUCCESS] Regex replaced ${label}`);
  } else {
    console.warn(`[FAILED] Regex pattern not found for ${label}`);
  }
}

// ----------------------------------------------------
// 1. TOP ACTION TOOLBAR (billingView !== 'tables')
// ----------------------------------------------------
const findTopToolbar = `                  {/* Action Toolbar - shown at TOP only when NOT in table view */}
                  {billingView !== 'tables' && (
                    <div className={\`h-10 border-b flex items-center px-2 gap-1.5 shrink-0 \${isDark ? 'border-[#30363d] bg-[#0d1117]' : 'border-slate-200 bg-white'}\`}>
                      <button 
                        onClick={() => setBillingView(prev => prev === 'tables' ? 'menu' : 'tables')} 
                        className={\`h-7 w-7 rounded flex items-center justify-center transition-colors shrink-0 \${
                          isDark ? 'bg-[#21262d] border border-[#30363d] text-[#8b949e] hover:text-white' : 'bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-900'
                        }\`}
                        title="View Table Layout"
                      >
                        <LayoutGrid size={14}/>
                      </button>
                      <div className="flex-1 flex justify-center gap-1.5">
                        {[
                          { label: 'Filter Tables', icon: <Filter size={12}/>, onClick: handleFilterTables, show: orderType === 'DINE_IN' && posSettings.separateView },
                          { label: 'Change Table', icon: <Monitor size={12}/>, onClick: handleChangeTable, show: orderType === 'DINE_IN' && posSettings.separateView },
                          { label: 'Refresh', icon: <RefreshCcw size={12} className={isLocallyRefreshing ? 'animate-spin' : ''} />, onClick: localRefresh, show: true },
                          { label: 'Load Menu', icon: <Package size={12} className={isSyncing ? 'animate-spin' : ''} />, onClick: handleSyncRefresh, show: true },
                          { label: 'Add Customer', icon: <UserPlus size={12}/>, onClick: () => setIsAddCustomerModalOpen(true), show: true }
                        ].filter(btn => btn.show).map(btn => (
                          <button key={btn.label} onClick={btn.onClick} className="h-7 px-3 bg-[#1c2833] hover:bg-[#2c3e50] text-white rounded text-[10px] font-bold flex items-center gap-1.5 transition-colors shrink-0">
                            {btn.icon} {btn.label}
                          </button>
                        ))}
                      </div>
                      <div className="ml-auto flex items-center gap-2">
                        <button className={\`h-7 w-7 rounded flex items-center justify-center transition-colors \${isDark ? 'bg-[#21262d] border border-[#30363d] text-[#8b949e] hover:text-white' : 'bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-900'}\`}><Bell size={14}/></button>
                        <button className={\`h-7 w-7 rounded flex items-center justify-center transition-colors \${isDark ? 'bg-[#21262d] border border-[#30363d] text-[#8b949e] hover:text-white' : 'bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-900'}\`}><Printer size={14}/></button>
                      </div>
                    </div>
                  )}`;

const replaceTopToolbar = `                  {/* Action Toolbar - shown at TOP only when NOT in table view */}
                  {billingView !== 'tables' && (
                    <div className={\`h-11 border-b flex items-center px-3 gap-2 shrink-0 \${isDark ? 'border-[#30363d] bg-[#0d1117]' : 'border-slate-200 bg-white'}\`}>
                      <button 
                        onClick={() => setBillingView(prev => prev === 'tables' ? 'menu' : 'tables')} 
                        className={\`h-8 w-8 flex items-center justify-center transition-colors shrink-0 \${
                          isDark ? 'text-[#8b949e] hover:text-white' : 'text-slate-600 hover:text-slate-900'
                        }\`}
                        title="View Table Layout"
                      >
                        <LayoutGrid size={20}/>
                      </button>
                      <div className="flex-1 flex justify-center gap-2">
                        {[
                          { label: 'Filter tables', onClick: handleFilterTables, show: orderType === 'DINE_IN' && posSettings.separateView },
                          { label: 'Change Table', onClick: handleChangeTable, show: orderType === 'DINE_IN' && posSettings.separateView },
                          { label: 'Add Customer', onClick: () => setIsAddCustomerModalOpen(true), show: true },
                          { label: 'Refresh', onClick: localRefresh, show: true },
                          { label: 'Load Menu', onClick: handleSyncRefresh, show: true }
                        ].filter(btn => btn.show).map(btn => (
                          <button key={btn.label} onClick={btn.onClick} className="h-8 px-4 bg-[#1c2438] hover:bg-[#25304e] text-white rounded-lg text-[11.5px] font-bold flex items-center justify-center transition-all shrink-0">
                            {btn.label}
                          </button>
                        ))}
                      </div>
                      <div className="ml-auto flex items-center gap-2">
                        <button className={\`h-8 w-8 flex items-center justify-center transition-colors \${isDark ? 'text-[#8b949e] hover:text-white' : 'text-slate-600 hover:text-slate-900'}\`} title="Payment Report"><CreditCard size={20}/></button>
                        <button className={\`h-8 w-8 flex items-center justify-center transition-colors \${isDark ? 'text-[#8b949e] hover:text-white' : 'text-slate-600 hover:text-slate-900'}\`} title="Alerts"><Bell size={20}/></button>
                        <div className="relative flex items-center justify-center">
                          <button className={\`h-8 w-8 flex items-center justify-center transition-colors \${isDark ? 'text-[#8b949e] hover:text-white' : 'text-slate-600 hover:text-slate-900'}\`} title="System Monitor"><Monitor size={20}/></button>
                          <span className="absolute -top-0.5 -left-1 bg-red-500 text-[6px] text-white px-1.5 py-0.5 rounded shadow-sm font-black tracking-wider leading-none scale-75 origin-top-left">
                            LIVE
                          </span>
                        </div>
                      </div>
                    </div>
                  )}`;

replaceExact(findTopToolbar, replaceTopToolbar, 'Top Toolbar');

// ----------------------------------------------------
// 2. BOTTOM ACTION BAR (billingView === 'tables')
// ----------------------------------------------------
const findBottomToolbar = `                          {/* Bottom Action Bar - four-square icon + buttons */}
                          <div className={\`h-10 border-t flex items-center px-2 gap-1.5 shrink-0 \${isDark ? 'border-[#30363d] bg-[#0d1117]' : 'border-slate-200 bg-white'}\`}>
                            <button onClick={() => setBillingView(prev => prev === 'tables' ? 'menu' : 'tables')} className={\`h-7 w-7 rounded flex items-center justify-center transition-colors \${isDark ? 'bg-[#21262d] border border-[#30363d] text-[#8b949e] hover:text-white' : 'bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-900'}\`}><LayoutGrid size={14}/></button>
                            <div className="flex-1 flex justify-center gap-1.5">
                              {[
                                { label: 'Filter tables', icon: <Filter size={12}/>, onClick: handleFilterTables },
                                { label: 'Change Table', icon: <Monitor size={12}/>, onClick: handleChangeTable },
                                { label: 'Refresh', icon: <RefreshCcw size={12} className={isLocallyRefreshing ? 'animate-spin' : ''} />, onClick: localRefresh },
                                { label: 'Load Menu', icon: <Package size={12} className={isSyncing ? 'animate-spin' : ''} />, onClick: handleSyncRefresh },
                                { label: 'Add Customer', icon: <UserPlus size={12}/>, onClick: () => setIsAddCustomerModalOpen(true) }
                              ].map(btn => (
                                <button key={btn.label} onClick={btn.onClick} className="h-7 px-3 bg-[#1c2833] hover:bg-[#2c3e50] text-white rounded text-[10px] font-bold flex items-center gap-1.5 transition-colors shrink-0">
                                  {btn.icon} {btn.label}
                                </button>
                              ))}
                            </div>
                            <div className="ml-auto flex items-center gap-2">
                              <button className={\`h-7 w-7 rounded flex items-center justify-center transition-colors \${isDark ? 'bg-[#21262d] border border-[#30363d] text-[#8b949e] hover:text-white' : 'bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-900'}\`}><Printer size={14}/></button>
                              <button className={\`h-7 w-7 rounded flex items-center justify-center transition-colors \${isDark ? 'bg-[#21262d] border border-[#30363d] text-[#8b949e] hover:text-white' : 'bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-900'}\`}><Bell size={14}/></button>
                            </div>
                          </div>`;

const replaceBottomToolbar = `                          {/* Bottom Action Bar - four-square icon + buttons */}
                          <div className={\`h-11 border-t flex items-center px-3 gap-2 shrink-0 \${isDark ? 'border-[#30363d] bg-[#0d1117]' : 'border-slate-200 bg-white'}\`}>
                            <button 
                              onClick={() => setBillingView(prev => prev === 'tables' ? 'menu' : 'tables')} 
                              className={\`h-8 w-8 flex items-center justify-center transition-colors shrink-0 \${
                                isDark ? 'text-[#8b949e] hover:text-white' : 'text-slate-600 hover:text-slate-900'
                              }\`}
                              title="View Menu"
                            >
                              <LayoutGrid size={20}/>
                            </button>
                            <div className="flex-1 flex justify-center gap-2">
                              {[
                                { label: 'Filter tables', onClick: handleFilterTables, show: true },
                                { label: 'Change Table', onClick: handleChangeTable, show: true },
                                { label: 'Add Customer', onClick: () => setIsAddCustomerModalOpen(true), show: true },
                                { label: 'Refresh', onClick: localRefresh, show: true },
                                { label: 'Load Menu', onClick: handleSyncRefresh, show: true }
                              ].filter(btn => btn.show).map(btn => (
                                <button key={btn.label} onClick={btn.onClick} className="h-8 px-4 bg-[#1c2438] hover:bg-[#25304e] text-white rounded-lg text-[11.5px] font-bold flex items-center justify-center transition-all shrink-0">
                                  {btn.label}
                                </button>
                              ))}
                            </div>
                            <div className="ml-auto flex items-center gap-2">
                              <button className={\`h-8 w-8 flex items-center justify-center transition-colors \${isDark ? 'text-[#8b949e] hover:text-white' : 'text-slate-600 hover:text-slate-900'}\`} title="Payment Report"><CreditCard size={20}/></button>
                              <button className={\`h-8 w-8 flex items-center justify-center transition-colors \${isDark ? 'text-[#8b949e] hover:text-white' : 'text-slate-600 hover:text-slate-900'}\`} title="Alerts"><Bell size={20}/></button>
                              <div className="relative flex items-center justify-center">
                                <button className={\`h-8 w-8 flex items-center justify-center transition-colors \${isDark ? 'text-[#8b949e] hover:text-white' : 'text-slate-600 hover:text-slate-900'}\`} title="System Monitor"><Monitor size={20}/></button>
                                <span className="absolute -top-0.5 -left-1 bg-red-500 text-[6px] text-white px-1.5 py-0.5 rounded shadow-sm font-black tracking-wider leading-none scale-75 origin-top-left">
                                  LIVE
                                </span>
                              </div>
                            </div>
                          </div>`;

replaceExact(findBottomToolbar, replaceBottomToolbar, 'Bottom Toolbar');

// ----------------------------------------------------
// 3. ADD CUSTOMER MODAL INPUT BORDERS
// ----------------------------------------------------
const findAddCustomerInputs = `                  <div className={\`p-8 space-y-4 \${isDark ? 'bg-[#0d1117]' : 'bg-white'}\`}>
                     <div className="space-y-1">
                        <label className={\`text-[9px] font-bold uppercase tracking-wider \${isDark ? 'text-[#8b949e]' : 'text-slate-500'}\`}>Customer Name</label>
                        <input
                           type="text"
                           value={newCustomerForm.name}
                           onChange={(e) => setNewCustomerForm(prev => ({ ...prev, name: e.target.value }))}
                           placeholder="e.g. John Doe"
                           className={\`w-full px-4 py-3 rounded-xl text-xs focus:outline-none focus:border-[#18ba60] \${isDark ? 'bg-[#161b22] border-[#30363d] text-white placeholder-[#8b949e]' : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400'}\`}
                        />
                     </div>

                     <div className="space-y-1">
                        <label className={\`text-[9px] font-bold uppercase tracking-wider \${isDark ? 'text-[#8b949e]' : 'text-slate-500'}\`}>Phone Number *</label>
                        <div className="flex gap-2">
                           <select
                              value={newCustomerCountryCode}
                              onChange={(e) => setNewCustomerCountryCode(e.target.value)}
                              className={\`px-3 py-3 rounded-xl text-xs focus:outline-none focus:border-[#18ba60] max-w-[90px] \${isDark ? 'bg-[#161b22] border-[#30363d] text-white' : 'bg-white border-slate-200 text-slate-900'}\`}
                           >
                              {COUNTRY_CODES.map(c => (
                                 <option key={c.code} value={c.dialCode} className={isDark ? 'bg-gray-900 text-white' : 'bg-white text-slate-800'}>
                                    {c.flag} {c.dialCode}
                                 </option>
                              ))}
                           </select>
                           <input
                              type="text"
                              value={newCustomerForm.phone}
                              onChange={(e) => setNewCustomerForm(prev => ({ ...prev, phone: e.target.value }))}
                              placeholder="e.g. 9876543210"
                              className={\`w-full px-4 py-3 rounded-xl text-xs focus:outline-none focus:border-[#18ba60] \${isDark ? 'bg-[#161b22] border-[#30363d] text-white placeholder-[#8b949e]' : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400'}\`}
                           />
                        </div>
                     </div>

                     <div className="space-y-1">
                        <label className={\`text-[9px] font-bold uppercase tracking-wider \${isDark ? 'text-[#8b949e]' : 'text-slate-500'}\`}>Address</label>
                        <input
                           type="text"
                           value={newCustomerForm.address}
                           onChange={(e) => setNewCustomerForm(prev => ({ ...prev, address: e.target.value }))}
                           placeholder="e.g. 123 Street Name"
                           className={\`w-full px-4 py-3 rounded-xl text-xs focus:outline-none focus:border-[#18ba60] \${isDark ? 'bg-[#161b22] border-[#30363d] text-white placeholder-[#8b949e]' : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400'}\`}
                        />
                     </div>

                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                           <label className={\`text-[9px] font-bold uppercase tracking-wider \${isDark ? 'text-[#8b949e]' : 'text-slate-500'}\`}>Initial Balance</label>
                           <input
                              type="number"
                              value={newCustomerForm.balance}
                              onChange={(e) => setNewCustomerForm(prev => ({ ...prev, balance: e.target.value }))}
                              placeholder="0"
                              className={\`w-full px-4 py-3 rounded-xl text-xs focus:outline-none focus:border-[#18ba60] \${isDark ? 'bg-[#161b22] border-[#30363d] text-white placeholder-[#8b949e]' : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400'}\`}
                           />
                        </div>

                        <div className="space-y-1">
                           <label className={\`text-[9px] font-bold uppercase tracking-wider \${isDark ? 'text-[#8b949e]' : 'text-slate-500'}\`}>Initial Points</label>
                           <input
                              type="number"
                              value={newCustomerForm.points}
                              onChange={(e) => setNewCustomerForm(prev => ({ ...prev, points: e.target.value }))}
                              placeholder="0"
                              className={\`w-full px-4 py-3 rounded-xl text-xs focus:outline-none focus:border-[#18ba60] \${isDark ? 'bg-[#161b22] border-[#30363d] text-white placeholder-[#8b949e]' : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400'}\`}
                           />
                        </div>
                     </div>
                  </div>`;

const replaceAddCustomerInputs = `                  <div className={\`p-8 space-y-4 \${isDark ? 'bg-[#0d1117]' : 'bg-white'}\`}>
                     <div className="space-y-1">
                        <label className={\`text-[9px] font-bold uppercase tracking-wider \${isDark ? 'text-[#8b949e]' : 'text-slate-500'}\`}>Customer Name</label>
                        <input
                           type="text"
                           value={newCustomerForm.name}
                           onChange={(e) => setNewCustomerForm(prev => ({ ...prev, name: e.target.value }))}
                           placeholder="e.g. John Doe"
                           className={\`w-full px-4 py-3 rounded-xl text-xs focus:outline-none focus:border-[#18ba60] border \${isDark ? 'bg-[#161b22] border-[#30363d] text-white placeholder-[#8b949e]' : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400'}\`}
                        />
                     </div>

                     <div className="space-y-1">
                        <label className={\`text-[9px] font-bold uppercase tracking-wider \${isDark ? 'text-[#8b949e]' : 'text-slate-500'}\`}>Phone Number *</label>
                        <div className="flex gap-2">
                           <select
                              value={newCustomerCountryCode}
                              onChange={(e) => setNewCustomerCountryCode(e.target.value)}
                              className={\`px-3 py-3 rounded-xl text-xs focus:outline-none focus:border-[#18ba60] max-w-[90px] border \${isDark ? 'bg-[#161b22] border-[#30363d] text-white' : 'bg-white border-slate-200 text-slate-900'}\`}
                           >
                              {COUNTRY_CODES.map(c => (
                                 <option key={c.code} value={c.dialCode} className={isDark ? 'bg-gray-900 text-white' : 'bg-white text-slate-800'}>
                                    {c.flag} {c.dialCode}
                                 </option>
                              ))}
                           </select>
                           <input
                              type="text"
                              value={newCustomerForm.phone}
                              onChange={(e) => setNewCustomerForm(prev => ({ ...prev, phone: e.target.value }))}
                              placeholder="e.g. 9876543210"
                              className={\`w-full px-4 py-3 rounded-xl text-xs focus:outline-none focus:border-[#18ba60] border \${isDark ? 'bg-[#161b22] border-[#30363d] text-white placeholder-[#8b949e]' : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400'}\`}
                           />
                        </div>
                     </div>

                     <div className="space-y-1">
                        <label className={\`text-[9px] font-bold uppercase tracking-wider \${isDark ? 'text-[#8b949e]' : 'text-slate-500'}\`}>Address</label>
                        <input
                           type="text"
                           value={newCustomerForm.address}
                           onChange={(e) => setNewCustomerForm(prev => ({ ...prev, address: e.target.value }))}
                           placeholder="e.g. 123 Street Name"
                           className={\`w-full px-4 py-3 rounded-xl text-xs focus:outline-none focus:border-[#18ba60] border \${isDark ? 'bg-[#161b22] border-[#30363d] text-white placeholder-[#8b949e]' : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400'}\`}
                        />
                     </div>

                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                           <label className={\`text-[9px] font-bold uppercase tracking-wider \${isDark ? 'text-[#8b949e]' : 'text-slate-500'}\`}>Initial Balance</label>
                           <input
                              type="number"
                              value={newCustomerForm.balance}
                              onChange={(e) => setNewCustomerForm(prev => ({ ...prev, balance: e.target.value }))}
                              placeholder="0"
                              className={\`w-full px-4 py-3 rounded-xl text-xs focus:outline-none focus:border-[#18ba60] border \${isDark ? 'bg-[#161b22] border-[#30363d] text-white placeholder-[#8b949e]' : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400'}\`}
                           />
                        </div>

                        <div className="space-y-1">
                           <label className={\`text-[9px] font-bold uppercase tracking-wider \${isDark ? 'text-[#8b949e]' : 'text-slate-500'}\`}>Initial Points</label>
                           <input
                              type="number"
                              value={newCustomerForm.points}
                              onChange={(e) => setNewCustomerForm(prev => ({ ...prev, points: e.target.value }))}
                              placeholder="0"
                              className={\`w-full px-4 py-3 rounded-xl text-xs focus:outline-none focus:border-[#18ba60] border \${isDark ? 'bg-[#161b22] border-[#30363d] text-white placeholder-[#8b949e]' : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400'}\`}
                           />
                        </div>
                     </div>
                  </div>`;

replaceExact(findAddCustomerInputs, replaceAddCustomerInputs, 'Add Customer Input Borders');

// ----------------------------------------------------
// 4. CHECKOUT LOYALTY SYNC (handleCheckout)
// ----------------------------------------------------
const findCheckoutTop = `    const fullPhone = customerPhone ? (customerPhone.startsWith('+') ? customerPhone : customerCountryCode + customerPhone) : '';
    const newOrder = {
      id: orderId,
      source: navigator.onLine ? 'POS_WINDOWS' : 'POS_WINDOWS_OFFLINE',
      customer_name: customerName || "POS Guest",
      customer_phone: fullPhone,
      customer_number: fullPhone,
      address: customerAddress || "",
      waiter_id: selectedWaiter ? selectedWaiter.id : null,
      waiter_name: selectedWaiter ? selectedWaiter.name : null,
      items: activeCart.map(i => ({
        id: i.id,
        name: i.priceLabel ? \`\${i.product_name} (\${i.priceLabel})\` : i.product_name,
        qty: i.quantity,
        price: i.price,
        modifiers: i.modifiers || [],
        kot_category: i.kot_category || "Main Kitchen",
        isComplementary: isFreeCheckout ? true : (i.isComplementary || false),
        isCancelled: i.isCancelled || false,
        cancelReason: i.cancelReason || ""
      })),
      subtotal,
      discount: discountAmt,
      tax_cgst: cgst,
      tax_sgst: sgst,
      delivery_charge: extraFixed,
      charge_details: appliedAdditionalCharges.map(c => ({ name: c.name, type: c.type, value: parseFloat(c.value || 0), amount: c.type === 'percent' || c.type === 'PERCENT' ? (subtotal - discountAmt) * (parseFloat(c.value || 0) / 100) : parseFloat(c.value || 0) })),
      service_charge: serviceCharge,
      total_price: finalTotalPrice,
      payment_method: isDue ? 'DUE' : method,
      reference_no: referenceNo,
      order_reference: orderId,
      tip_amount: isFreeCheckout ? 0 : (parseFloat(tip) || 0),
      status: type === 'SAVE' ? 'PENDING' : 'COMPLETED',
      table_id: (orderType === 'DINE_IN' && selectedTable && !selectedTable.is_temporary) ? selectedTable.id : null,
      order_type: (selectedTable && selectedTable.is_temporary)
        ? (selectedTable.original_order_type === 'PICKUP' ? selectedTable.original_sub_order_type : selectedTable.original_order_type)
        : (orderType === 'PICKUP' ? subOrderType : orderType),
      created_at: editingOrder ? (editingOrder.created_at || new Date().toISOString()) : new Date().toISOString(),
      bill_no: bNo,
      synced: false,
      pre_order_id: editingPreOrder ? editingPreOrder.id : null,
      pre_order_advance: editingPreOrder ? advancePaid : 0,
      pre_order_balance: editingPreOrder ? remainingBalance : 0,
      pre_order_scheduled_date: editingPreOrder ? editingPreOrder.scheduled_date : null,
      pre_order_scheduled_time: editingPreOrder ? editingPreOrder.scheduled_time : null,
      coupon_code: appliedCoupon ? (appliedCoupon.coupon_code || appliedCoupon.code) : null,
      coupon_discount: couponDiscountAmt,
      points_redeemed: redeemedPoints || 0,
      points_discount: (redeemedPoints || 0) * getPointsValueRate(),
      points_earned: 0,`;

const replaceCheckoutTop = `    const fullPhone = customerPhone ? (customerPhone.startsWith('+') ? customerPhone : customerCountryCode + customerPhone) : '';

    let pointsEarned = 0;
    if (fullPhone) {
      if (getLoyaltySetting('loyalty_enabled', true)) {
        const isDineIn = orderType === 'DINE_IN';
        const isPickup = orderType === 'PICKUP' && subOrderType !== 'DELIVERY';
        const isDelivery = orderType === 'DELIVERY' || (orderType === 'PICKUP' && subOrderType === 'DELIVERY');
        
        let eligible = true;
        if (isDineIn && getLoyaltySetting('loyalty_points_dinein', true) === false) eligible = false;
        if (isPickup && getLoyaltySetting('loyalty_points_pickup', true) === false) eligible = false;
        if (isDelivery && getLoyaltySetting('loyalty_points_delivery', true) === false) eligible = false;
        
        if (eligible) {
          const threshold = parseFloat(getLoyaltySetting('loyalty_bill_amount_threshold', 1000));
          const pointsAwarded = parseFloat(getLoyaltySetting('loyalty_points_earned', 100));
          const ratio = pointsAwarded / threshold;
          pointsEarned = total >= threshold ? Math.floor(total * ratio) : 0;
        }
      } else {
        pointsEarned = 0;
      }
    }

    const newOrder = {
      id: orderId,
      source: navigator.onLine ? 'POS_WINDOWS' : 'POS_WINDOWS_OFFLINE',
      customer_name: customerName || "POS Guest",
      customer_phone: fullPhone,
      customer_number: fullPhone,
      address: customerAddress || "",
      waiter_id: selectedWaiter ? selectedWaiter.id : null,
      waiter_name: selectedWaiter ? selectedWaiter.name : null,
      items: activeCart.map(i => ({
        id: i.id,
        name: i.priceLabel ? \`\${i.product_name} (\${i.priceLabel})\` : i.product_name,
        qty: i.quantity,
        price: i.price,
        modifiers: i.modifiers || [],
        kot_category: i.kot_category || "Main Kitchen",
        isComplementary: isFreeCheckout ? true : (i.isComplementary || false),
        isCancelled: i.isCancelled || false,
        cancelReason: i.cancelReason || ""
      })),
      subtotal,
      discount: discountAmt,
      tax_cgst: cgst,
      tax_sgst: sgst,
      delivery_charge: extraFixed,
      charge_details: appliedAdditionalCharges.map(c => ({ name: c.name, type: c.type, value: parseFloat(c.value || 0), amount: c.type === 'percent' || c.type === 'PERCENT' ? (subtotal - discountAmt) * (parseFloat(c.value || 0) / 100) : parseFloat(c.value || 0) })),
      service_charge: serviceCharge,
      total_price: finalTotalPrice,
      payment_method: isDue ? 'DUE' : method,
      reference_no: referenceNo,
      order_reference: orderId,
      tip_amount: isFreeCheckout ? 0 : (parseFloat(tip) || 0),
      status: type === 'SETTLE' ? 'COMPLETED' : 'PENDING',
      table_id: (orderType === 'DINE_IN' && selectedTable && !selectedTable.is_temporary) ? selectedTable.id : null,
      order_type: (selectedTable && selectedTable.is_temporary)
        ? (selectedTable.original_order_type === 'PICKUP' ? selectedTable.original_sub_order_type : selectedTable.original_order_type)
        : (orderType === 'PICKUP' ? subOrderType : orderType),
      created_at: editingOrder ? (editingOrder.created_at || new Date().toISOString()) : new Date().toISOString(),
      bill_no: bNo,
      synced: false,
      pre_order_id: editingPreOrder ? editingPreOrder.id : null,
      pre_order_advance: editingPreOrder ? advancePaid : 0,
      pre_order_balance: editingPreOrder ? remainingBalance : 0,
      pre_order_scheduled_date: editingPreOrder ? editingPreOrder.scheduled_date : null,
      pre_order_scheduled_time: editingPreOrder ? editingPreOrder.scheduled_time : null,
      coupon_code: appliedCoupon ? (appliedCoupon.coupon_code || appliedCoupon.code) : null,
      coupon_discount: couponDiscountAmt,
      points_redeemed: redeemedPoints || 0,
      points_discount: (redeemedPoints || 0) * getPointsValueRate(),
      points_earned: pointsEarned,`;

replaceExact(findCheckoutTop, replaceCheckoutTop, 'Checkout Top Logic');

const findCheckoutBottom = `    if (fullPhone) {
      // Auto-save/update customer in the server database
      try {
        await posService.saveCustomer({
          name: customerName || "POS Guest",
          number: fullPhone,
          address: customerAddress || ""
        });
      } catch (err) {
        console.error("Failed to sync customer details during checkout:", err);
      }

      let pointsEarned = 0;
      if (getLoyaltySetting('loyalty_enabled', true)) {
        const isDineIn = orderType === 'DINE_IN';
        const isPickup = orderType === 'PICKUP' && subOrderType !== 'DELIVERY';
        const isDelivery = orderType === 'DELIVERY' || (orderType === 'PICKUP' && subOrderType === 'DELIVERY');
        
        let eligible = true;
        if (isDineIn && getLoyaltySetting('loyalty_points_dinein', true) === false) eligible = false;
        if (isPickup && getLoyaltySetting('loyalty_points_pickup', true) === false) eligible = false;
        if (isDelivery && getLoyaltySetting('loyalty_points_delivery', true) === false) eligible = false;
        
        if (eligible) {
          const threshold = parseFloat(getLoyaltySetting('loyalty_bill_amount_threshold', 1000));
          const pointsAwarded = parseFloat(getLoyaltySetting('loyalty_points_earned', 100));
          const ratio = pointsAwarded / threshold;
          pointsEarned = total >= threshold ? Math.floor(total * ratio) : 0;
        }
      } else {
        // Loyalty disabled — no points earned
        pointsEarned = 0;
      }

      setCustomerDb(prev => {
        const existing = prev[fullPhone] || { name: customerName, phone: fullPhone, address: customerAddress || "", points: 0, orders: 0, totalSpent: 0, balance: 0 };
        const balanceChange = ((method || 'CASH').toLowerCase() === 'credit') ? -finalTotalPrice :
                              (((method || 'CASH').toLowerCase() === 'split') ? -(parseFloat(splitCreditAmount) || 0) :
                              (((method || 'CASH').toLowerCase() === 'cash' && saveChangeToBalance) ? ((parseFloat(customerPaidAmount) || 0) - finalTotalPrice) : 0));
        const updatedCust = {
          ...existing,
          name: customerName || existing.name,
          address: customerAddress || existing.address || '',
          points: existing.points + pointsEarned - redeemedPoints,
          orders: existing.orders + 1,
          totalSpent: existing.totalSpent + total,
          balance: (existing.balance || 0) + balanceChange
        };
        const nextDb = { ...prev, [fullPhone]: updatedCust };
        localStorage.setItem('pos_customer_db', JSON.stringify(nextDb));
        return nextDb;
      });
      if (historyCustomerPhone === fullPhone) {
        refreshCustomerHistory(fullPhone);
      }
    }`;

const replaceCheckoutBottom = `    if (fullPhone) {
      // Auto-save/update customer in the server database
      try {
        await posService.saveCustomer({
          name: customerName || "POS Guest",
          number: fullPhone,
          address: customerAddress || ""
        });
      } catch (err) {
        console.error("Failed to sync customer details during checkout:", err);
      }

      setCustomerDb(prev => {
        const existing = prev[fullPhone] || { name: customerName, phone: fullPhone, address: customerAddress || "", points: 0, orders: 0, totalSpent: 0, balance: 0 };
        const balanceChange = ((method || 'CASH').toLowerCase() === 'credit') ? -finalTotalPrice :
                              (((method || 'CASH').toLowerCase() === 'split') ? -(parseFloat(splitCreditAmount) || 0) :
                              (((method || 'CASH').toLowerCase() === 'cash' && saveChangeToBalance) ? ((parseFloat(customerPaidAmount) || 0) - finalTotalPrice) : 0));
        const updatedCust = type === 'SETTLE' ? {
          ...existing,
          name: customerName || existing.name,
          address: customerAddress || existing.address || '',
          points: existing.points + pointsEarned - redeemedPoints,
          orders: existing.orders + 1,
          totalSpent: existing.totalSpent + total,
          balance: (existing.balance || 0) + balanceChange
        } : {
          ...existing,
          name: customerName || existing.name,
          address: customerAddress || existing.address || ''
        };
        const nextDb = { ...prev, [fullPhone]: updatedCust };
        localStorage.setItem('pos_customer_db', JSON.stringify(nextDb));
        return nextDb;
      });
      if (historyCustomerPhone === fullPhone) {
        refreshCustomerHistory(fullPhone);
      }
    }`;

replaceExact(findCheckoutBottom, replaceCheckoutBottom, 'Checkout Bottom Logic');

// ----------------------------------------------------
// 5. MODAL STANDARDIZATIONS (rounded-[2rem] & headers)
// Safe boundary matching prefixed with \\{modalFlagOpen\\s*&&\\s*\\(
// ----------------------------------------------------

// 1. isAccessLevelModalOpen
replaceRegex(
  /\{isAccessLevelModalOpen\s*&&\s*\([\s\S]*?<div className="p-8 bg-\[\#161b22\] text-white flex justify-between items-center shrink-0 border-b border-\[\#30363d\]">([\s\S]*?)Update Desktop Access Level([\s\S]*?)setIsAccessLevelModalOpen\(false\)[\s\S]*?<\/div>/,
  (match) => {
    return match.replace(
      /<div className="p-8 bg-\[\#161b22\] text-white flex justify-between items-center shrink-0 border-b border-\[\#30363d\]">[\s\S]*?setIsAccessLevelModalOpen\(false\)[\s\S]*?<\/div>/,
      `<div className={\`p-6 border-b flex justify-between items-center shrink-0 \${isDark ? 'bg-[#161b22] border-[#30363d] text-white' : 'bg-slate-50 border-slate-200 text-slate-800'}\`}>
                       <div>
                          <h3 className={\`text-xl font-black uppercase italic tracking-tighter flex items-center gap-2 \${isDark ? 'text-white' : 'text-slate-900'}\`}><Lock className="text-[#10ac84]" size={22}/> Update Desktop Access Level</h3>
                          <p className={\`text-[10px] font-bold uppercase tracking-wider mt-1 \${isDark ? 'text-[#8b949e]' : 'text-slate-500'}\`}>Configure visibility for dashboard and reports</p>
                       </div>
                       <button onClick={() => setIsAccessLevelModalOpen(false)} className={\`p-2 hover:bg-white/10 rounded-xl transition-all text-sm \${isDark ? 'text-[#8b949e] hover:text-white' : 'text-slate-400 hover:text-slate-800'}\`}>✕</button>
                    </div>`
    );
  },
  'isAccessLevelModalOpen header'
);
replaceRegex(
  /\{isAccessLevelModalOpen\s*&&\s*\([\s\S]*?className="w-full max-w-4xl bg-\[\#0d1117\] rounded-\[2\.5rem\]/,
  (match) => match.replace('rounded-[2.5rem]', 'rounded-[2rem]'),
  'isAccessLevelModalOpen container'
);

// 2. isSettingsModalOpen
replaceRegex(
  /\{isSettingsModalOpen\s*&&\s*\([\s\S]*?<div className=\{\`p-5 flex justify-between items-center shrink-0 border-b \\\$\{isDark \? 'bg-\[\#161b22\] border-\[\#30363d\] text-white' : 'bg-\[\#f8f9fa\] border-slate-200 text-slate-800'\}\`\}>([\s\S]*?)Terminal Settings([\s\S]*?)setIsSettingsModalOpen\(false\)[\s\S]*?<\/div>/,
  (match) => {
    return match.replace(
      /<div className=\{\`p-5 flex justify-between items-center shrink-0 border-b [\s\S]*?\}\`\}>[\s\S]*?setIsSettingsModalOpen\(false\)[\s\S]*?<\/div>/,
      `<div className={\`p-6 flex justify-between items-center shrink-0 border-b \${isDark ? 'bg-[#161b22] border-[#30363d] text-white' : 'bg-slate-50 border-slate-200 text-slate-800'}\`}>
                        <div>
                           <h3 className={\`text-xl font-black uppercase italic tracking-tighter flex items-center gap-2 \${isDark ? 'text-white' : 'text-slate-900'}\`}><Settings className="text-[#10ac84]" size={22}/> Terminal Settings</h3>
                           <p className={\`text-[10px] font-bold uppercase tracking-wider mt-1 \${isDark ? 'text-[#8b949e]' : 'text-slate-500'}\`}>Configure terminal preferences and printer layouts</p>
                        </div>
                        <button onClick={() => setIsSettingsModalOpen(false)} className={\`p-2 hover:bg-white/10 rounded-xl transition-all text-sm \${isDark ? 'text-[#8b949e] hover:text-white' : 'text-slate-400 hover:text-slate-850'}\`}>✕</button>
                     </div>`
    );
  },
  'isSettingsModalOpen header'
);
replaceRegex(
  /\{isSettingsModalOpen\s*&&\s*\([\s\S]*?className=\{\`w-\[820px\] max-w-\[95vw\] max-h-\[90vh\] rounded-2xl/,
  (match) => match.replace('rounded-2xl', 'rounded-[2rem]'),
  'isSettingsModalOpen container'
);

// 3. isPayDueModalOpen
replaceRegex(
  /\{isPayDueModalOpen\s*&&\s*\([\s\S]*?<div className=\{\`p-5 border-b flex justify-between items-center \\\$\{isDark \? 'border-\[\#30363d\] bg-\[\#161b22\]' : 'border-slate-200 bg-slate-50'\}\`\}>([\s\S]*?)Pay Previous Balance([\s\S]*?)setIsPayDueModalOpen\(false\)[\s\S]*?<\/div>/,
  (match) => {
    return match.replace(
      /<div className=\{\`p-5 border-b flex justify-between items-center [\s\S]*?\}\`\}>[\s\S]*?setIsPayDueModalOpen\(false\)[\s\S]*?<\/div>/,
      `<div className={\`p-6 border-b flex justify-between items-center \${isDark ? 'border-[#30363d] bg-[#161b22]' : 'border-slate-200 bg-slate-50'}\`}>
                        <div>
                           <h3 className="text-xl font-black uppercase italic tracking-tighter flex items-center gap-2">
                              <Wallet size={18} className="text-emerald-500" /> Pay Previous Balance
                           </h3>
                           <p className={\`text-[10px] font-bold uppercase tracking-wider mt-1 \${isDark ? 'text-[#8b949e]' : 'text-slate-500'}\`}>{trayCustomer?.name || 'Customer'} • {trayFullPhone}</p>
                        </div>
                        <button onClick={() => setIsPayDueModalOpen(false)} className={\`p-2 hover:bg-white/10 rounded-xl transition-all text-sm \${isDark ? 'text-[#8b949e] hover:text-white' : 'text-slate-400 hover:text-slate-800'}\`}>✕</button>
                     </div>`
    );
  },
  'isPayDueModalOpen header'
);
replaceRegex(
  /\{isPayDueModalOpen\s*&&\s*\([\s\S]*?className=\{\`w-full max-w-md rounded-2xl/,
  (match) => match.replace('rounded-2xl', 'rounded-[2rem]'),
  'isPayDueModalOpen container'
);

// 4. isTableManagementModalOpen
replaceRegex(
  /\{isTableManagementModalOpen\s*&&\s*\([\s\S]*?<div className="p-8 bg-\[\#161b22\] text-white flex justify-between items-center shrink-0 border-b border-\[\#30363d\]">([\s\S]*?)Table Management([\s\S]*?)setIsTableManagementModalOpen\(false\)[\s\S]*?<\/div>/,
  (match) => {
    return match.replace(
      /<div className="p-8 bg-\[\#161b22\] text-white flex justify-between items-center shrink-0 border-b border-\[\#30363d\]">[\s\S]*?setIsTableManagementModalOpen\(false\)[\s\S]*?<\/div>/,
      `<div className={\`p-6 border-b flex justify-between items-center shrink-0 \${isDark ? 'bg-[#161b22] border-[#30363d] text-white' : 'bg-slate-50 border-slate-200 text-slate-800'}\`}>
                        <div>
                           <h3 className={\`text-xl font-black uppercase italic tracking-tighter flex items-center gap-2 \${isDark ? 'text-white' : 'text-slate-900'}\`}><LayoutGrid className="text-[#10ac84]" size={22}/> Table Management</h3>
                           <p className={\`text-[10px] font-bold uppercase tracking-wider mt-1 \${isDark ? 'text-[#8b949e]' : 'text-slate-500'}\`}>Manage tables, departments, and QR codes</p>
                        </div>
                        <div className="flex items-center gap-3">
                           <span className="px-3 py-1.5 bg-[#10ac84]/20 text-[#10ac84] rounded-lg text-[10px] font-black uppercase">Call Waiter Functionality</span>
                           <button onClick={() => setIsTableManagementModalOpen(false)} className={\`p-2 hover:bg-white/10 rounded-xl transition-all text-sm \${isDark ? 'text-[#8b949e] hover:text-white' : 'text-slate-400 hover:text-slate-800'}\`}>✕</button>
                        </div>
                     </div>`
    );
  },
  'isTableManagementModalOpen header'
);
replaceRegex(
  /\{isTableManagementModalOpen\s*&&\s*\([\s\S]*?className="w-full max-w-6xl bg-\[\#0d1117\] rounded-\[2\.5rem\]/,
  (match) => match.replace('rounded-[2.5rem]', 'rounded-[2rem]'),
  'isTableManagementModalOpen container'
);

// 5. isUserManagementModalOpen
replaceRegex(
  /\{isUserManagementModalOpen\s*&&\s*\([\s\S]*?<div className="p-8 bg-\[\#161b22\] text-white flex justify-between items-center shrink-0 border-b border-\[\#30363d\]">([\s\S]*?)User Management([\s\S]*?)setIsUserManagementModalOpen\(false\)[\s\S]*?<\/div>/,
  (match) => {
    return match.replace(
      /<div className="p-8 bg-\[\#161b22\] text-white flex justify-between items-center shrink-0 border-b border-\[\#30363d\]">[\s\S]*?setIsUserManagementModalOpen\(false\)[\s\S]*?<\/div>/,
      `<div className={\`p-6 border-b flex justify-between items-center shrink-0 \${isDark ? 'bg-[#161b22] border-[#30363d] text-white' : 'bg-slate-50 border-slate-200 text-slate-800'}\`}>
                        <div>
                           <h3 className={\`text-xl font-black uppercase italic tracking-tighter flex items-center gap-2 \${isDark ? 'text-white' : 'text-slate-900'}\`}><Users className="text-[#10ac84]" size={22}/> User Management</h3>
                           <p className={\`text-[10px] font-bold uppercase tracking-wider mt-1 \${isDark ? 'text-[#8b949e]' : 'text-slate-500'}\`}>Manage staff, roles, and access levels</p>
                        </div>
                        <button onClick={() => setIsUserManagementModalOpen(false)} className={\`p-2 hover:bg-white/10 rounded-xl transition-all text-sm \${isDark ? 'text-[#8b949e] hover:text-white' : 'text-slate-400 hover:text-slate-800'}\`}>✕</button>
                     </div>`
    );
  },
  'isUserManagementModalOpen header'
);
replaceRegex(
  /\{isUserManagementModalOpen\s*&&\s*\([\s\S]*?className="w-full max-w-6xl bg-\[\#0d1117\] rounded-\[2\.5rem\]/,
  (match) => match.replace('rounded-[2.5rem]', 'rounded-[2rem]'),
  'isUserManagementModalOpen container'
);

// 6. isCaptainAppModalOpen
replaceRegex(
  /\{isCaptainAppModalOpen\s*&&\s*\([\s\S]*?<div className="p-6 bg-\[\#161b22\] text-white flex justify-between items-center shrink-0 border-b border-\[\#30363d\] mt-6">([\s\S]*?)Captain App([\s\S]*?)setIsCaptainAppModalOpen\(false\)[\s\S]*?<\/div>/,
  (match) => {
    return match.replace(
      /<div className="p-6 bg-\[\#161b22\] text-white flex justify-between items-center shrink-0 border-b border-\[\#30363d\] mt-6">[\s\S]*?setIsCaptainAppModalOpen\(false\)[\s\S]*?<\/div>/,
      `<div className={\`p-6 border-b flex justify-between items-center shrink-0 mt-6 \${isDark ? 'bg-[#161b22] border-[#30363d] text-white' : 'bg-slate-50 border-slate-200 text-slate-800'}\`}>
                        <div>
                           <h3 className={\`text-xl font-black uppercase italic tracking-tighter flex items-center gap-2 \${isDark ? 'text-white' : 'text-slate-900'}\`}><Monitor className="text-[#10ac84]" size={22}/> Captain App</h3>
                        </div>
                        <button onClick={() => setIsCaptainAppModalOpen(false)} className={\`p-2 hover:bg-white/10 rounded-xl transition-all text-sm \${isDark ? 'text-[#8b949e] hover:text-white' : 'text-slate-400 hover:text-slate-850'}\`}>✕</button>
                     </div>`
    );
  },
  'isCaptainAppModalOpen header'
);
replaceRegex(
  /\{isCaptainAppModalOpen\s*&&\s*\([\s\S]*?className="w-full max-w-6xl bg-\[\#0d1117\] rounded-\[2\.5rem\]/,
  (match) => match.replace('rounded-[2.5rem]', 'rounded-[2rem]'),
  'isCaptainAppModalOpen container'
);

// 7. isFeedbackModalOpen
replaceRegex(
  /\{isFeedbackModalOpen\s*&&\s*\([\s\S]*?<div className="p-8 bg-\[\#161b22\] text-white flex justify-between items-center shrink-0 border-b border-\[\#30363d\]">([\s\S]*?)Feedback Management([\s\S]*?)setIsFeedbackModalOpen\(false\)[\s\S]*?<\/div>/,
  (match) => {
    return match.replace(
      /<div className="p-8 bg-\[\#161b22\] text-white flex justify-between items-center shrink-0 border-b border-\[\#30363d\]">[\s\S]*?setIsFeedbackModalOpen\(false\)[\s\S]*?<\/div>/,
      `<div className={\`p-6 border-b flex justify-between items-center shrink-0 \${isDark ? 'bg-[#161b22] border-[#30363d] text-white' : 'bg-slate-50 border-slate-200 text-slate-800'}\`}>
                        <div>
                           <h3 className={\`text-xl font-black uppercase italic tracking-tighter flex items-center gap-2 \${isDark ? 'text-white' : 'text-slate-905'}\`}><MessageSquare className="text-[#10ac84]" size={22}/> Feedback Management</h3>
                           <p className={\`text-[10px] font-bold uppercase tracking-wider mt-1 \${isDark ? 'text-[#8b949e]' : 'text-slate-500'}\`}>Customer experience form</p>
                        </div>
                        <button onClick={() => setIsFeedbackModalOpen(false)} className={\`p-2 hover:bg-white/10 rounded-xl transition-all text-sm \${isDark ? 'text-[#8b949e] hover:text-white' : 'text-slate-400 hover:text-slate-800'}\`}>✕</button>
                     </div>`
    );
  },
  'isFeedbackModalOpen header'
);
replaceRegex(
  /\{isFeedbackModalOpen\s*&&\s*\([\s\S]*?className="w-full max-w-6xl bg-\[\#0d1117\] rounded-\[2\.5rem\]/,
  (match) => match.replace('rounded-[2.5rem]', 'rounded-[2rem]'),
  'isFeedbackModalOpen container'
);

// 8. isInventoryModalOpen
replaceRegex(
  /\{isInventoryModalOpen\s*&&\s*\([\s\S]*?<div className="p-8 bg-\[\#161b22\] text-white flex justify-between items-center shrink-0 border-b border-\[\#30363d\]">([\s\S]*?)Inventory Management([\s\S]*?)setIsInventoryModalOpen\(false\)[\s\S]*?<\/div>/,
  (match) => {
    return match.replace(
      /<div className="p-8 bg-\[\#161b22\] text-white flex justify-between items-center shrink-0 border-b border-\[\#30363d\]">[\s\S]*?setIsInventoryModalOpen\(false\)[\s\S]*?<\/div>/,
      `<div className={\`p-6 border-b flex justify-between items-center shrink-0 \${isDark ? 'bg-[#161b22] border-[#30363d] text-white' : 'bg-slate-50 border-slate-200 text-slate-800'}\`}>
                        <div>
                           <h3 className={\`text-xl font-black uppercase italic tracking-tighter flex items-center gap-2 \${isDark ? 'text-white' : 'text-slate-900'}\`}><Package className="text-[#10ac84]" size={22}/> Inventory Management</h3>
                           <p className={\`text-[10px] font-bold uppercase tracking-wider mt-1 \${isDark ? 'text-[#8b949e]' : 'text-slate-500'}\`}>Manage stock on hand and purchased items</p>
                        </div>
                        <div className="flex items-center gap-3">
                           <span className="px-3 py-1.5 bg-red-600/20 text-red-500 rounded-lg text-[10px] font-black uppercase">Expired Stock</span>
                           <span className="px-3 py-1.5 bg-yellow-600/20 text-yellow-500 rounded-lg text-[10px] font-black uppercase">Low Stock</span>
                           <span className="px-3 py-1.5 bg-purple-600/20 text-purple-500 rounded-lg text-[10px] font-black uppercase">Expire In 3 Days</span>
                           <button onClick={() => setIsInventoryModalOpen(false)} className={\`p-2 hover:bg-white/10 rounded-xl transition-all text-sm \${isDark ? 'text-[#8b949e] hover:text-white' : 'text-slate-400 hover:text-slate-800'}\`}>✕</button>
                        </div>
                     </div>\`}`
    );
  },
  'isInventoryModalOpen header'
);
replaceRegex(
  /\{isInventoryModalOpen\s*&&\s*\([\s\S]*?className="w-full max-w-6xl bg-\[\#0d1117\] rounded-\[2\.5rem\]/,
  (match) => match.replace('rounded-[2.5rem]', 'rounded-[2rem]'),
  'isInventoryModalOpen container'
);

// 9. isReservationModalOpen
replaceRegex(
  /\{isReservationModalOpen\s*&&\s*\([\s\S]*?<div className="p-8 bg-\[\#161b22\] text-white flex justify-between items-center shrink-0 border-b border-\[\#30363d\]">([\s\S]*?)Table Reservations([\s\S]*?)setIsReservationModalOpen\(false\)[\s\S]*?<\/div>/,
  (match) => {
    return match.replace(
      /<div className="p-8 bg-\[\#161b22\] text-white flex justify-between items-center shrink-0 border-b border-\[\#30363d\]">[\s\S]*?setIsReservationModalOpen\(false\)[\s\S]*?<\/div>/,
      `<div className={\`p-6 border-b flex justify-between items-center shrink-0 \${isDark ? 'bg-[#161b22] border-[#30363d] text-white' : 'bg-slate-50 border-slate-200 text-slate-800'}\`}>
                        <div>
                           <h3 className={\`text-xl font-black uppercase italic tracking-tighter flex items-center gap-2 \${isDark ? 'text-white' : 'text-slate-900'}\`}><Calendar className="text-[#10ac84]" size={22}/> Table Reservations</h3>
                           <p className={\`text-[10px] font-bold uppercase tracking-wider mt-1 \${isDark ? 'text-[#8b949e]' : 'text-slate-500'}\`}>Manage table bookings and guests</p>
                        </div>
                        <button onClick={() => setIsReservationModalOpen(false)} className={\`p-2 hover:bg-white/10 rounded-xl transition-all text-sm \${isDark ? 'text-[#8b949e] hover:text-white' : 'text-slate-400 hover:text-slate-800'}\`}>✕</button>
                     </div>`
    );
  },
  'isReservationModalOpen header'
);
replaceRegex(
  /\{isReservationModalOpen\s*&&\s*\([\s\S]*?className="w-full max-w-6xl bg-\[\#0d1117\] rounded-\[2\.5rem\]/,
  (match) => match.replace('rounded-[2.5rem]', 'rounded-[2rem]'),
  'isReservationModalOpen container'
);

// 10. isOldKOTModalOpen
replaceRegex(
  /\{isOldKOTModalOpen\s*&&\s*\([\s\S]*?<div className="p-4 border-b border-\[\#30363d\] flex justify-between items-center bg-\[\#161b22\] rounded-t-2xl">([\s\S]*?)Old KOT([\s\S]*?)setIsOldKOTModalOpen\(false\)[\s\S]*?<\/div>/,
  (match) => {
    return match.replace(
      /<div className="p-4 border-b border-\[\#30363d\] flex justify-between items-center bg-\[\#161b22\] rounded-t-2xl">[\s\S]*?setIsOldKOTModalOpen\(false\)[\s\S]*?<\/div>/,
      `<div className={\`p-6 border-b flex justify-between items-center \${isDark ? 'bg-[#161b22] border-[#30363d]' : 'bg-slate-50 border-slate-200'}\`}>
                     <h3 className={\`text-xl font-black uppercase italic tracking-tighter \${isDark ? 'text-white' : 'text-slate-900'}\`}>Old KOT</h3>
                     <button
                        onClick={() => {
                           setIsOldKOTModalOpen(false);
                           setSelectedOldKOTItems({});
                           setOldKOTItemReasons({});
                           setSelectAllOldKOT(false);
                        }}
                        className={\`p-2 hover:bg-white/10 rounded-xl transition-all text-sm \${isDark ? 'text-[#8b949e] hover:text-white' : 'text-slate-400 hover:text-slate-800'}\`}
                     >
                        ✕
                     </button>
                  </div>`
    );
  },
  'isOldKOTModalOpen header'
);
replaceRegex(
  /\{isOldKOTModalOpen\s*&&\s*\([\s\S]*?className=\{\`w-full max-w-4xl rounded-2xl/,
  (match) => match.replace('rounded-2xl', 'rounded-[2rem]'),
  'isOldKOTModalOpen container'
);

// 11. isTransferModalOpen
replaceRegex(
  /\{isTransferModalOpen\s*&&\s*\([\s\S]*?<div className="p-4 border-b border-\[\#30363d\] flex justify-between items-center bg-\[\#161b22\]">([\s\S]*?)Transfer Items to Table([\s\S]*?)setIsTransferModalOpen\(false\)[\s\S]*?<\/div>/,
  (match) => {
    return match.replace(
      /<div className="p-4 border-b border-\[\#30363d\] flex justify-between items-center bg-\[\#161b22\]">[\s\S]*?setIsTransferModalOpen\(false\)[\s\S]*?<\/div>/,
      `<div className={\`p-6 border-b flex justify-between items-center \${isDark ? 'bg-[#161b22] border-[#30363d]' : 'bg-slate-50 border-slate-200'}\`}>
                     <h3 className={\`text-xl font-black uppercase italic tracking-tighter flex items-center gap-2 \${isDark ? 'text-white' : 'text-slate-900'}\`}>
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        Transfer Items to Table
                     </h3>
                     <button onClick={() => setIsTransferModalOpen(false)} className={\`p-2 hover:bg-white/10 rounded-xl transition-all text-sm \${isDark ? 'text-[#8b949e] hover:text-white' : 'text-slate-400 hover:text-slate-800'}\`}>✕</button>
                  </div>`
    );
  },
  'isTransferModalOpen header'
);
replaceRegex(
  /\{isTransferModalOpen\s*&&\s*\([\s\S]*?className=\{\`w-full max-w-md rounded-2xl/,
  (match) => match.replace('rounded-2xl', 'rounded-[2rem]'),
  'isTransferModalOpen container'
);

// 12. isExpenseModalOpen
replaceRegex(
  /\{isExpenseModalOpen\s*&&\s*\([\s\S]*?<div className="p-8 bg-\[\#1e293b\] text-white flex justify-between items-center shrink-0">([\s\S]*?)Daily Expense Ledger([\s\S]*?)setIsExpenseModalOpen\(false\)[\s\S]*?<\/div>/,
  (match) => {
    return match.replace(
      /<div className="p-8 bg-\[\#1e293b\] text-white flex justify-between items-center shrink-0">[\s\S]*?setIsExpenseModalOpen\(false\)[\s\S]*?<\/div>/,
      `<div className={\`p-6 border-b flex justify-between items-center shrink-0 \${isDark ? 'bg-[#161b22] border-[#30363d]' : 'bg-slate-50 border-slate-200'}\`}>
                        <div>
                           <h3 className={\`text-xl font-black uppercase italic tracking-tighter flex items-center gap-2 \${isDark ? 'text-white' : 'text-slate-900'}\`}><TrendingUp className="text-rose-400"/> Daily Expense Ledger</h3>
                           <p className={\`text-[10px] font-bold uppercase tracking-wider mt-1 \${isDark ? 'text-[#8b949e]' : 'text-slate-500'}\`}>Track and manage your operational outflows</p>
                        </div>
                        <button onClick={() => setIsExpenseModalOpen(false)} className={\`p-2 hover:bg-white/10 rounded-xl transition-all text-sm \${isDark ? 'text-[#8b949e] hover:text-white' : 'text-slate-400 hover:text-slate-800'}\`}>✕</button>
                     </div>`
    );
  },
  'isExpenseModalOpen header'
);
replaceRegex(
  /\{isExpenseModalOpen\s*&&\s*\([\s\S]*?className=\{\`w-full max-w-4xl rounded-2xl/,
  (match) => match.replace('rounded-2xl', 'rounded-[2rem]'),
  'isExpenseModalOpen container'
);

// 13. isOpenPriceModalOpen
replaceRegex(
  /\{isOpenPriceModalOpen\s*&&\s*\([\s\S]*?className=\{\`w-full max-w-sm rounded-3xl/,
  (match) => match.replace('rounded-3xl', 'rounded-[2rem]'),
  'isOpenPriceModalOpen container'
);
replaceRegex(
  /\{isOpenPriceModalOpen\s*&&\s*\([\s\S]*?<div className=\{\`p-5 flex justify-between items-center border-b \\\$\{[\s\S]*?\}\`\}>([\s\S]*?)setIsOpenPriceModalOpen\(false\)[\s\S]*?<\/div>/,
  (match) => {
    return match.replace(
      /<div className=\{\`p-5 flex justify-between items-center border-b [\s\S]*?\}\`\}>[\s\S]*?setIsOpenPriceModalOpen\(false\)[\s\S]*?<\/div>/,
      `<div className={\`p-6 flex justify-between items-center border-b \${
                        isDark ? 'bg-[#161b22] border-[#30363d]' : 'bg-slate-50 border-slate-200'
                     }\`}>
                        <div className="flex items-center gap-2.5">
                           <div className={\`w-8 h-8 rounded-lg flex items-center justify-center bg-emerald-500/10 text-emerald-500\`}>
                              <Calculator size={16} />
                           </div>
                           <div>
                              <h3 className={\`text-xl font-black uppercase italic tracking-tighter leading-none \${isDark ? 'text-white' : 'text-slate-900'}\`}>
                                 {openPriceItem.product_name}
                              </h3>
                              <p className={\`text-[10px] font-bold uppercase tracking-wider mt-1.5 \${isDark ? 'text-[#8b949e]' : 'text-slate-500'}\`}>
                                 Enter Custom Item Price
                              </p>
                           </div>
                        </div>
                        <button
                           onClick={() => {
                              setIsOpenPriceModalOpen(false);
                              setOpenPriceItem(null);
                              setOpenPriceValue('');
                           }}
                           className={\`p-2 hover:bg-white/10 rounded-xl transition-all text-sm \${
                              isDark ? 'text-[#8b949e] hover:text-white' : 'text-slate-400 hover:text-slate-800'
                           }\`}
                        >
                           ✕
                        </button>
                     </div>`
    );
  },
  'isOpenPriceModalOpen header'
);

// 14. isCouponModalOpen
replaceRegex(
  /\{isCouponModalOpen\s*&&\s*\([\s\S]*?<div className=\{\`p-5 border-b flex justify-between items-center \\\$\{[\s\S]*?\}\`\}>([\s\S]*?)setIsCouponModalOpen\(false\)[\s\S]*?<\/div>/,
  (match) => {
    return match.replace(
      /<div className=\{\`p-5 border-b flex justify-between items-center [\s\S]*?\}\`\}>[\s\S]*?setIsCouponModalOpen\(false\)[\s\S]*?<\/div>/,
      `<div className={\`p-6 border-b flex justify-between items-center \${
                      isDark ? 'bg-[#161b22] border-[#30363d]' : 'bg-slate-50 border-slate-200'
                   }\`}>
                      <div className="flex items-center gap-2">
                         <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500">
                            <path d="M21 5H3a2 2 0 0 0-2 2v3a2 2 0 0 1 0 4v3a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2v-3a2 2 0 0 1 0-4V7a2 2 0 0 0-2-2Z"/>
                            <path d="M8 6v12" strokeDasharray="2 2"/>
                            <circle cx="12.5" cy="10.5" r="1.2" fill="currentColor"/>
                            <path d="M11.5 14.5 16.5 9.5"/>
                            <circle cx="15.5" cy="13.5" r="1.2" fill="currentColor"/>
                         </svg>
                         <h3 className={\`text-xl font-black uppercase italic tracking-tighter flex items-center gap-2 \${isDark ? 'text-white' : 'text-slate-900'}\`}>
                            Apply Coupon Discount
                         </h3>
                      </div>
                      <button
                         onClick={() => setIsCouponModalOpen(false)}
                         className={\`p-2 hover:bg-white/10 rounded-xl transition-all text-sm \${isDark ? 'text-[#8b949e] hover:text-white' : 'text-slate-400 hover:text-slate-800'}\`}
                      >
                         ✕
                      </button>
                   </div>`
    );
  },
  'isCouponModalOpen header'
);
replaceRegex(
  /\{isCouponModalOpen\s*&&\s*\([\s\S]*?className=\{\`w-full max-w-sm rounded-3xl/,
  (match) => match.replace('rounded-3xl', 'rounded-[2rem]'),
  'isCouponModalOpen container'
);

// 15. isSplitModalOpen
replaceRegex(
  /\{isSplitModalOpen\s*&&\s*\([\s\S]*?<div className="p-8 bg-\[\#1e293b\] text-white flex justify-between items-center shrink-0">([\s\S]*?)Split Bill Settlement([\s\S]*?)setIsSplitModalOpen\(false\)[\s\S]*?<\/div>/,
  (match) => {
    return match.replace(
      /<div className="p-8 bg-\[\#1e293b\] text-white flex justify-between items-center shrink-0">[\s\S]*?setIsSplitModalOpen\(false\)[\s\S]*?<\/div>/,
      `<div className={\`p-6 border-b flex justify-between items-center shrink-0 \${isDark ? 'bg-[#161b22] border-[#30363d]' : 'bg-slate-50 border-slate-205'}\`}>
                        <div className="flex items-center gap-6">
                           <div>
                              <h3 className={\`text-xl font-black uppercase italic tracking-tighter flex items-center gap-2 \${isDark ? 'text-white' : 'text-slate-900'}\`}><ArrowRight className="text-emerald-500"/> Split Bill Settlement</h3>
                              <p className={\`text-[10px] font-bold uppercase tracking-wider mt-1 \${isDark ? 'text-[#8b949e]' : 'text-slate-500'}\`}>Divide the check for individual payments</p>
                           </div>
                           <div className={\`flex items-center rounded-xl p-1 \${isDark ? 'bg-[#0d1117] border border-[#30363d]' : 'bg-slate-100 border border-slate-200'}\`}>
                              {['PORTION', 'PERCENT', 'ITEM'].map(mode => (
                                 <button
                                    key={mode}
                                    type="button"
                                    onClick={() => setSplitMode(mode)}
                                    className={\`px-4 py-1.5 rounded-lg text-xs font-black uppercase italic transition-all \${splitMode === mode ? 'bg-[#10ac84] text-white shadow-sm' : (isDark ? 'text-gray-400 hover:text-white' : 'text-slate-600 hover:text-slate-900')}\`}
                                 >
                                    {mode}
                                 </button>
                              ))}
                           </div>
                        </div>
                        <button onClick={() => setIsSplitModalOpen(false)} className={\`p-2 hover:bg-white/10 rounded-xl transition-all text-sm \${isDark ? 'text-[#8b949e] hover:text-white' : 'text-slate-400 hover:text-slate-800'}\`}>✕</button>
                     </div>`
    );
  },
  'isSplitModalOpen header'
);
replaceRegex(
  /\{isSplitModalOpen\s*&&\s*\([\s\S]*?className=\{\`w-full max-w-4xl rounded-3xl/,
  (match) => match.replace('rounded-3xl', 'rounded-[2rem]'),
  'isSplitModalOpen container'
);

// 16. isRejectionModalOpen
replaceRegex(
  /\{isRejectionModalOpen\s*&&\s*\([\s\S]*?<div className="p-5 flex justify-between items-center shrink-0 border-b bg-\[\#161b22\] border-\[\#30363d\] text-white">([\s\S]*?)setIsRejectionModalOpen\(false\)[\s\S]*?<\/div>/,
  (match) => {
    return match.replace(
      /<div className="p-5 flex justify-between items-center shrink-0 border-b bg-\[\#161b22\] border-\[\#30363d\] text-white">[\s\S]*?setIsRejectionModalOpen\(false\)[\s\S]*?<\/div>/,
      `<div className={\`p-6 border-b flex justify-between items-center shrink-0 \${isDark ? 'bg-[#161b22] border-[#30363d] text-white' : 'bg-slate-50 border-slate-200 text-slate-800'}\`}>
                 <div>
                   <h3 className="text-xl font-black uppercase italic tracking-tighter flex items-center gap-2 text-red-500">
                     {isManagingPresets ? "Manage Rejection Presets" : "Cancel / Reject Order"}
                   </h3>
                   <p className={\`text-[10px] font-bold uppercase tracking-wider mt-1 \${isDark ? 'text-[#8b949e]' : 'text-slate-500'}\`}>
                     {isManagingPresets ? "Add or remove preset rejection reasons" : "Specify a reason to notify the customer"}
                   </p>
                 </div>
                 <button
                   onClick={() => setIsRejectionModalOpen(false)}
                   className={\`p-2 hover:bg-white/10 rounded-xl transition-all text-sm \${isDark ? 'text-[#8b949e] hover:text-white' : 'text-slate-400 hover:text-slate-800'}\`}
                 >
                   ✕
                 </button>
               </div>`
    );
  },
  'isRejectionModalOpen header'
);
replaceRegex(
  /\{isRejectionModalOpen\s*&&\s*\([\s\S]*?className=\{\`w-full max-w-md rounded-2xl/,
  (match) => match.replace('rounded-2xl', 'rounded-[2rem]'),
  'isRejectionModalOpen container'
);

// 17. isAddCustomerModalOpen container
replaceRegex(
  /\{isAddCustomerModalOpen\s*&&\s*\([\s\S]*?className=\{\`w-full max-w-lg rounded-\[2\.5rem\]/,
  (match) => match.replace('rounded-[2.5rem]', 'rounded-[2rem]'),
  'isAddCustomerModalOpen container'
);

// 18. isAddCustomerModalOpen header
replaceRegex(
  /\{isAddCustomerModalOpen\s*&&\s*\([\s\S]*?<div className=\{\`p-8 flex justify-between items-center shrink-0 border-b \\\$\{isDark \? 'bg-\\\#161b22 border-\\\#30363d text-white' : 'bg-\\\#f8f9fa border-slate-200 text-slate-800'\}\`\}>([\s\S]*?)Adding Customers([\s\S]*?)setIsAddCustomerModalOpen\(false\)[\s\S]*?<\/div>/,
  (match) => {
    return match.replace(
      /<div className=\{\`p-8 flex justify-between items-center shrink-0 border-b [\s\S]*?\}\`\}>[\s\S]*?setIsAddCustomerModalOpen\(false\)[\s\S]*?<\/div>/,
      `<div className={\`p-6 border-b flex justify-between items-center shrink-0 \${isDark ? 'bg-[#161b22] border-[#30363d] text-white' : 'bg-slate-50 border-slate-200 text-slate-800'}\`}>
                     <div>
                        <h3 className={\`text-xl font-black uppercase italic tracking-tighter flex items-center gap-2 \${isDark ? 'text-white' : 'text-slate-900'}\`}><UserPlus className="text-[#10ac84]" size={22}/> Adding Customers</h3>
                        <p className={\`text-[10px] font-bold uppercase tracking-wider mt-1 \${isDark ? 'text-[#8b949e]' : 'text-slate-500'}\`}>Create a new customer profile</p>
                     </div>
                     <button onClick={() => setIsAddCustomerModalOpen(false)} className={\`p-2 hover:bg-white/10 rounded-xl transition-all text-sm \${isDark ? 'text-[#8b949e] hover:text-white' : 'text-slate-400 hover:text-slate-800'}\`}>✕</button>
                  </div>`
    );
  },
  'isAddCustomerModalOpen header'
);

// 19. isWaiterModalOpen container and header
replaceRegex(
  /\{isWaiterModalOpen\s*&&\s*\([\s\S]*?className=\{\`border rounded-2xl/,
  (match) => match.replace('rounded-2xl', 'rounded-[2rem]'),
  'isWaiterModalOpen container'
);
replaceRegex(
  /\{isWaiterModalOpen\s*&&\s*\([\s\S]*?<div className=\{\`p-4 border-b flex justify-between items-center rounded-t-2xl \\\$\{[\s\S]*?\}\`\}>([\s\S]*?)Select Waiter \/ Staff([\s\S]*?)setIsWaiterModalOpen\(false\)[\s\S]*?<\/div>/,
  (match) => {
    return match.replace(
      /<div className=\{\`p-4 border-b flex justify-between items-center rounded-t-2xl [\s\S]*?\}\`\}>[\s\S]*?setIsWaiterModalOpen\(false\)[\s\S]*?<\/div>/,
      `<div className={\`p-6 border-b flex justify-between items-center \${
                     isDark ? 'bg-[#161b22] border-[#30363d]' : 'bg-slate-50 border-slate-200'
                  }\`}>
                     <div className="flex items-center gap-2">
                        <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2.5" fill="none" className="text-emerald-500">
                           <path d="M3 20h18" strokeLinecap="round" />
                           <path d="M19 16a7 7 0 0 0-14 0z" fill="currentColor" />
                           <path d="M12 5v4M10 5h4" strokeLinecap="round" />
                        </svg>
                        <h3 className={\`text-xl font-black uppercase italic tracking-tighter \${isDark ? 'text-white' : 'text-slate-900'}\`}>Select Waiter / Staff</h3>
                     </div>
                     <button
                        onClick={() => setIsWaiterModalOpen(false)}
                        className={\`p-2 hover:bg-white/10 rounded-xl transition-all text-sm \${isDark ? 'text-[#8b949e] hover:text-white' : 'text-slate-400 hover:text-slate-800'}\`}
                     >
                        ✕
                     </button>
                  </div>`
    );
  },
  'isWaiterModalOpen header'
);

// 20. isRiderModalOpen container and header
replaceRegex(
  /\{isRiderModalOpen\s*&&\s*\([\s\S]*?className=\{\`border rounded-2xl/,
  (match) => match.replace('rounded-2xl', 'rounded-[2rem]'),
  'isRiderModalOpen container'
);
replaceRegex(
  /\{isRiderModalOpen\s*&&\s*\([\s\S]*?<div className=\{\`p-4 border-b flex justify-between items-center rounded-t-2xl \\\$\{[\s\S]*?\}\`\}>([\s\S]*?)Select Delivery Boy \/ Rider([\s\S]*?)setIsRiderModalOpen\(false\)[\s\S]*?<\/div>/,
  (match) => {
    return match.replace(
      /<div className=\{\`p-4 border-b flex justify-between items-center rounded-t-2xl [\s\S]*?\}\`\}>[\s\S]*?setIsRiderModalOpen\(false\)[\s\S]*?<\/div>/,
      `<div className={\`p-6 border-b flex justify-between items-center \${
                     isDark ? 'bg-[#161b22] border-[#30363d]' : 'bg-slate-50 border-slate-200'
                  }\`}>
                     <div className="flex items-center gap-2">
                        <Bike className="text-emerald-500" size={18} />
                        <h3 className={\`text-xl font-black uppercase italic tracking-tighter \${isDark ? 'text-white' : 'text-slate-900'}\`}>Select Delivery Boy / Rider</h3>
                     </div>
                     <button
                        onClick={() => setIsRiderModalOpen(false)}
                        className={\`p-2 hover:bg-white/10 rounded-xl transition-all text-sm \${isDark ? 'text-[#8b949e] hover:text-white' : 'text-slate-400 hover:text-slate-800'}\`}
                     >
                        ✕
                     </button>
                  </div>`
    );
  },
  'isRiderModalOpen header'
);

// 21. isDiscountModalOpen container and header
replaceRegex(
  /\{isDiscountModalOpen\s*&&\s*\([\s\S]*?className=\{\`w-full max-w-md rounded-3xl/,
  (match) => match.replace('rounded-3xl', 'rounded-[2rem]'),
  'isDiscountModalOpen container'
);
replaceRegex(
  /\{isDiscountModalOpen\s*&&\s*\([\s\S]*?<div className=\{\`p-5 flex justify-between items-center border-b \\\$\{[\s\S]*?isDark \? \'bg-\\\#0d1117\\\/50 border-\\\#30363d\' : \'bg-slate-50 border-slate-100\'\}\`\}>([\s\S]*?)Apply Discount([\s\S]*?)setIsDiscountModalOpen\(false\)[\s\S]*?<\/div>/,
  (match) => {
    return match.replace(
      /<div className=\{\`p-5 flex justify-between items-center border-b [\s\S]*?\}\`\}>[\s\S]*?setIsDiscountModalOpen\(false\)[\s\S]*?<\/div>/,
      `<div className={\`p-6 flex justify-between items-center border-b \${
                        isDark ? 'bg-[#161b22] border-[#30363d]' : 'bg-slate-50 border-slate-200'
                     }\`}>
                        <div className="flex items-center gap-2.5">
                           <div className={\`w-8 h-8 rounded-lg flex items-center justify-center bg-emerald-500/10 text-emerald-500\`}>
                              <Tag size={16} />
                           </div>
                           <div>
                              <h3 className={\`text-xl font-black uppercase italic tracking-tighter leading-none \${isDark ? 'text-white' : 'text-slate-900'}\`}>
                                 Apply Discount
                              </h3>
                              <p className={\`text-[10px] font-bold uppercase tracking-wider mt-1.5 \${isDark ? 'text-[#8b949e]' : 'text-slate-500'}\`}>
                                 Select pre-configured or enter custom discount
                              </p>
                           </div>
                        </div>
                        <button
                           onClick={() => setIsDiscountModalOpen(false)}
                           className={\`p-2 hover:bg-white/10 rounded-xl transition-all text-sm \${
                              isDark ? 'text-[#8b949e] hover:text-white' : 'text-slate-400 hover:text-slate-800'
                           }\`}
                        >
                           ✕
                        </button>
                     </div>`
    );
  },
  'isDiscountModalOpen header'
);

// 22. isChargesModalOpen container and header
replaceRegex(
  /\{isChargesModalOpen\s*&&\s*\([\s\S]*?className=\{\`w-full max-w-md rounded-3xl/,
  (match) => match.replace('rounded-3xl', 'rounded-[2rem]'),
  'isChargesModalOpen container'
);
replaceRegex(
  /\{isChargesModalOpen\s*&&\s*\([\s\S]*?<div className=\{\`p-5 flex justify-between items-center border-b \\\$\{[\s\S]*?isDark \? \'bg-\\\#0d1117\\\/50 border-\\\#30363d\' : \'bg-slate-50 border-slate-100\'\}\`\}>([\s\S]*?)Additional Charges([\s\S]*?)setIsChargesModalOpen\(false\)[\s\S]*?<\/div>/,
  (match) => {
    return match.replace(
      /<div className=\{\`p-5 flex justify-between items-center border-b [\s\S]*?\}\`\}>[\s\S]*?setIsChargesModalOpen\(false\)[\s\S]*?<\/div>/,
      `<div className={\`p-6 flex justify-between items-center border-b \${
                        isDark ? 'bg-[#161b22] border-[#30363d]' : 'bg-slate-50 border-slate-200'
                     }\`}>
                        <div className="flex items-center gap-2.5">
                           <div className={\`w-8 h-8 rounded-lg flex items-center justify-center bg-emerald-500/10 text-emerald-500\`}>
                              <Coins size={16} />
                           </div>
                           <div>
                              <h3 className={\`text-xl font-black uppercase italic tracking-tighter leading-none \${isDark ? 'text-white' : 'text-slate-900'}\`}>
                                 Additional Charges
                              </h3>
                              <p className={\`text-[10px] font-bold uppercase tracking-wider mt-1.5 \${isDark ? 'text-[#8b949e]' : 'text-slate-500'}\`}>
                                 Apply database charges or add custom fees
                              </p>
                           </div>
                        </div>
                        <button
                           onClick={() => setIsChargesModalOpen(false)}
                           className={\`p-2 hover:bg-white/10 rounded-xl transition-all text-sm \${
                              isDark ? 'text-[#8b949e] hover:text-white' : 'text-slate-400 hover:text-slate-800'
                           }\`}
                        >
                           ✕
                        </button>
                     </div>`
    );
  },
  'isChargesModalOpen header'
);

// 23. isPaymentModalOpen container
replaceRegex(
  /\{isPaymentModalOpen\s*&&\s*\([\s\S]*?className=\{\`rounded-3xl border/,
  (match) => match.replace('rounded-3xl', 'rounded-[2rem]'),
  'isPaymentModalOpen container'
);

// Restore CRLF line endings
content = content.replace(/\n/g, '\r\n');

// Write back to App.jsx
fs.writeFileSync(filePath, content, 'utf8');
console.log('All changes applied successfully!');
