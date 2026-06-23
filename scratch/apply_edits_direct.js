const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../pos-app/src/App.jsx');
let content = fs.readFileSync(filePath, 'utf8');
let isUtf16 = false;

if (content.includes('\u0000')) {
  content = fs.readFileSync(filePath, 'utf16le');
  isUtf16 = true;
}

// Normalize line endings to \n for matching
let normalized = content.replace(/\r\n/g, '\n');

// 1. Standardize and unify menu action bar right-side icons
const targetMenuIcons = `                      <div className="ml-auto flex items-center gap-2">
                        <button className={\`h-7 w-7 rounded flex items-center justify-center transition-colors \${isDark ? 'bg-[#21262d] border border-[#30363d] text-[#8b949e] hover:text-white' : 'bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-900'}\`}><Bell size={14}/></button>
                        <button className={\`h-7 w-7 rounded flex items-center justify-center transition-colors \${isDark ? 'bg-[#21262d] border border-[#30363d] text-[#8b949e] hover:text-white' : 'bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-900'}\`}><Printer size={14}/></button>
                      </div>`;

const replacementMenuIcons = `                      <div className="ml-auto flex items-center gap-2">
                        <button className={\`h-7 w-7 rounded flex items-center justify-center transition-colors \${isDark ? 'bg-transparent text-[#8b949e] hover:text-white' : 'bg-transparent text-slate-600 hover:text-slate-900'}\`} title="Payment Report"><CreditCard size={14}/></button>
                        <button className={\`h-7 w-7 rounded flex items-center justify-center transition-colors \${isDark ? 'bg-transparent text-[#8b949e] hover:text-white' : 'bg-transparent text-slate-600 hover:text-slate-900'}\`} title="Alerts"><Bell size={14}/></button>
                        <div className="relative">
                          <button className={\`h-7 w-7 rounded flex items-center justify-center transition-colors \${isDark ? 'bg-transparent text-[#8b949e] hover:text-white' : 'bg-transparent text-slate-600 hover:text-slate-900'}\`} title="System Monitor"><Monitor size={14}/></button>
                          <span className="absolute -top-0.5 -right-2 bg-red-500 text-[6px] text-white px-1 rounded font-black tracking-tighter uppercase leading-none scale-75 origin-top-right">
                            LIVE
                          </span>
                        </div>
                      </div>`;

if (normalized.includes(targetMenuIcons)) {
  normalized = normalized.replace(targetMenuIcons, replacementMenuIcons);
  console.log('SUCCESS: Replaced Menu Action Bar Icons');
} else {
  console.log('WARNING: targetMenuIcons not found');
}

// 2. Relocate table action bar from bottom to top
const targetTableTop = `                      {billingView === 'tables' ? (
                        <>
                          {/* Department Tabs - on top */}`;

const replacementTableTop = `                      {billingView === 'tables' ? (
                        <>
                          {/* Top Action Bar */}
                          <div className={\`h-10 border-b flex items-center px-2 gap-1.5 shrink-0 \${isDark ? 'border-[#30363d] bg-[#0d1117]' : 'border-slate-200 bg-white'}\`}>
                            <button 
                              onClick={() => setBillingView(prev => prev === 'tables' ? 'menu' : 'tables')} 
                              className={\`h-7 w-7 rounded flex items-center justify-center transition-colors shrink-0 \${
                                isDark ? 'bg-transparent text-[#8b949e] hover:text-white' : 'bg-transparent text-slate-600 hover:text-slate-900'
                              }\`}
                              title="View Menu"
                            >
                              <LayoutGrid size={14}/>
                            </button>
                            <div className="flex-1 flex justify-center gap-1.5">
                              {[
                                { label: 'Filter tables', icon: <Filter size={12}/>, onClick: handleFilterTables, show: orderType === 'DINE_IN' && posSettings.separateView },
                                { label: 'Change Table', icon: <Monitor size={12}/>, onClick: handleChangeTable, show: orderType === 'DINE_IN' && posSettings.separateView },
                                { label: 'Add Customer', icon: <UserPlus size={12}/>, onClick: () => setIsAddCustomerModalOpen(true), show: true },
                                { label: 'Refresh', icon: <RefreshCcw size={12} className={isLocallyRefreshing ? 'animate-spin' : ''} />, onClick: localRefresh, show: true },
                                { label: 'Load Menu', icon: <Package size={12} className={isSyncing ? 'animate-spin' : ''} />, onClick: handleSyncRefresh, show: true }
                              ].filter(btn => btn.show).map(btn => (
                                <button key={btn.label} onClick={btn.onClick} className="h-7 px-3 bg-[#1c2833] hover:bg-[#2c3e50] text-white rounded text-[10px] font-bold flex items-center gap-1.5 transition-colors shrink-0">
                                  {btn.icon} {btn.label}
                                </button>
                              ))}
                            </div>
                            <div className="ml-auto flex items-center gap-2">
                              <button className={\`h-7 w-7 rounded flex items-center justify-center transition-colors \${isDark ? 'bg-transparent text-[#8b949e] hover:text-white' : 'bg-transparent text-slate-600 hover:text-slate-900'}\`} title="Payment Report"><CreditCard size={14}/></button>
                              <button className={\`h-7 w-7 rounded flex items-center justify-center transition-colors \${isDark ? 'bg-transparent text-[#8b949e] hover:text-white' : 'bg-transparent text-slate-600 hover:text-slate-900'}\`} title="Alerts"><Bell size={14}/></button>
                              <div className="relative">
                                <button className={\`h-7 w-7 rounded flex items-center justify-center transition-colors \${isDark ? 'bg-transparent text-[#8b949e] hover:text-white' : 'bg-transparent text-slate-600 hover:text-slate-900'}\`} title="System Monitor"><Monitor size={14}/></button>
                                <span className="absolute -top-0.5 -right-2 bg-red-500 text-[6px] text-white px-1 rounded font-black tracking-tighter uppercase leading-none scale-75 origin-top-right">
                                  LIVE
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Department Tabs - on top */}`;

if (normalized.includes(targetTableTop)) {
  normalized = normalized.replace(targetTableTop, replacementTableTop);
  console.log('SUCCESS: Relocated table Action Bar to top');
} else {
  console.log('WARNING: targetTableTop not found');
}

// 3. Remove bottom action bar
const targetTableBottom = `                          {/* Bottom Action Bar - four-square icon + buttons */}
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

if (normalized.includes(targetTableBottom)) {
  normalized = normalized.replace(targetTableBottom, '');
  console.log('SUCCESS: Removed bottom Action Bar');
} else {
  console.log('WARNING: targetTableBottom not found');
}

// 4. Add border to newCustomerCountryCode select
const targetSelect = `                            <select
                               value={newCustomerCountryCode}
                               onChange={(e) => setNewCustomerCountryCode(e.target.value)}
                               className={\`px-3 py-3 rounded-xl text-xs focus:outline-none focus:border-[#18ba60] max-w-[90px] \${isDark ? 'bg-[#161b22] border-[#30363d] text-white' : 'bg-white border-slate-200 text-slate-900'}\`}
                            >`;

const replacementSelect = `                            <select
                               value={newCustomerCountryCode}
                               onChange={(e) => setNewCustomerCountryCode(e.target.value)}
                               className={\`px-3 py-3 rounded-xl text-xs focus:outline-none focus:border-[#18ba60] max-w-[90px] border \${isDark ? 'bg-[#161b22] border-[#30363d] text-white' : 'bg-white border-slate-200 text-slate-900'}\`}
                            >`;

if (normalized.includes(targetSelect)) {
  normalized = normalized.replace(targetSelect, replacementSelect);
  console.log('SUCCESS: Added border class to country code select');
} else {
  console.log('WARNING: targetSelect not found');
}

// 5. Fix pointsEarned block scoping inside handleCheckout
const targetScope = `    if (editingPreOrder && !isFreeCheckout) {
      advancePaid = parseFloat(editingPreOrder.advance_paid) || 0;
      remainingBalance = Math.max(0, grandTotal - advancePaid);
      finalTotalPrice = posSettings.countAdvanceInSales ? remainingBalance : grandTotal;
    let pointsEarned = 0;
    if (type === 'SETTLE' && getLoyaltySetting('loyalty_enabled', true)) {
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
    }
    }`;

const replacementScope = `    if (editingPreOrder && !isFreeCheckout) {
      advancePaid = parseFloat(editingPreOrder.advance_paid) || 0;
      remainingBalance = Math.max(0, grandTotal - advancePaid);
      finalTotalPrice = posSettings.countAdvanceInSales ? remainingBalance : grandTotal;
    }

    let pointsEarned = 0;
    if (type === 'SETTLE' && getLoyaltySetting('loyalty_enabled', true)) {
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
    }`;

if (normalized.includes(targetScope)) {
  normalized = normalized.replace(targetScope, replacementScope);
  console.log('SUCCESS: Fixed pointsEarned scoping/nesting');
} else {
  console.log('WARNING: targetScope not found');
}

// 6. Update points_earned payload value to pointsEarned
const targetPayload = `      points_redeemed: redeemedPoints || 0,
      points_discount: (redeemedPoints || 0) * getPointsValueRate(),
      points_earned: 0,`;

const replacementPayload = `      points_redeemed: redeemedPoints || 0,
      points_discount: (redeemedPoints || 0) * getPointsValueRate(),
      points_earned: pointsEarned,`;

if (normalized.includes(targetPayload)) {
  normalized = normalized.replace(targetPayload, replacementPayload);
  console.log('SUCCESS: Updated payload points_earned to pointsEarned');
} else {
  console.log('WARNING: targetPayload not found');
}

// Convert back to CRLF
let finalContent = normalized.replace(/\n/g, '\r\n');

if (isUtf16) {
  fs.writeFileSync(filePath, finalContent, 'utf16le');
} else {
  fs.writeFileSync(filePath, finalContent, 'utf8');
}
console.log('App.jsx written successfully!');
