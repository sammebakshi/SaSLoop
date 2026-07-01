const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../pos-app/src/App.jsx');
let content = fs.readFileSync(filePath, 'utf8').replace(/\r\n/g, '\n');

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

// 1. Helpers Definition
replaceExactlyOnce(
`  const checkKOTPermission = (perm) => {
    const access = getStaffPermissions()?.pos_access;
    if (!access) return true;
    return access.KOT?.[perm] !== false;
  };`,
`  const checkKOTPermission = (perm) => {
    const access = getStaffPermissions()?.pos_access;
    if (!access) return true;
    return access.KOT?.[perm] !== false;
  };

  const checkDashboardPermission = (card) => {
    const access = getStaffPermissions()?.pos_access?.Dashboard;
    if (!access) return true;
    const mapping = {
      todaysSale: 'todays_sale',
      totalSale: 'total_sale',
      thisMonthSale: 'this_month_sale',
      itemPieChart: 'item_pie_chart',
      barSalesChart: 'bar_sales_chart',
      lineSalesChart: 'line_sales_chart',
      paymentModesChart: 'payment_modes_chart',
      salesAnalysisByDays: 'sales_analysis_by_days',
      allSalesAnalysis: 'all_sales_analysis',
      ipAddress: 'ip_address'
    };
    const key = mapping[card] || card;
    return access[key] !== false;
  };

  const checkSplitBillPermission = (perm) => {
    const access = getStaffPermissions()?.pos_access;
    if (!access) return true;
    let splitAccess = access.SplitBill;
    if (orderType === 'DELIVERY') {
      splitAccess = access.Delivery?.SplitBill;
    } else if (orderType === 'PICKUP') {
      splitAccess = access.Pickup?.SplitBill;
    } else if (orderType === 'PRE_ORDER') {
      splitAccess = access.PreOrder?.SplitBill;
    }
    return splitAccess?.[perm] !== false;
  };

  const checkCustomerPermission = (perm) => {
    const access = getStaffPermissions()?.pos_access?.CustomerManagement;
    if (!access) return true;
    return access[perm] !== false;
  };

  const checkAccountPermission = (perm) => {
    const access = getStaffPermissions()?.pos_access?.Account;
    if (!access) return true;
    return access[perm] !== false;
  };

  const checkOnlineOrderPermission = (perm) => {
    const access = getStaffPermissions()?.pos_access?.OnlineOrder;
    if (!access) return true;
    return access[perm] !== false;
  };

  const checkReceiptsPermission = (perm) => {
    const access = getStaffPermissions()?.pos_access?.Receipts;
    if (!access) return true;
    return access[perm] !== false;
  };`,
  "1. Helpers Definition"
);

// 2. splitMode useEffect
replaceExactlyOnce(
`  useEffect(() => {
    localStorage.setItem('pos_terminal_settings', JSON.stringify(posSettings));
  }, [posSettings]);`,
`  useEffect(() => {
    localStorage.setItem('pos_terminal_settings', JSON.stringify(posSettings));
  }, [posSettings]);

  useEffect(() => {
    if (isSplitModalOpen) {
      const allowed = ['PORTION', 'PERCENT', 'ITEM'].filter(mode => {
        if (mode === 'PORTION') return checkSplitBillPermission('portion_wise');
        if (mode === 'PERCENT') return checkSplitBillPermission('percentage_wise');
        if (mode === 'ITEM') return checkSplitBillPermission('item_wise');
        return true;
      });
      if (allowed.length > 0 && !allowed.includes(splitMode)) {
        setSplitMode(allowed[0]);
      }
    }
  }, [isSplitModalOpen, splitMode]);`,
  "2. splitMode useEffect"
);

// 3. Dashboard cards wrapping (todaysSale, totalSale, thisMonthSale, ipAddress)
replaceExactlyOnce(
`                          {/* Row 1 (Fixed): Centered, no icons */}
                          <div className="grid grid-cols-4 gap-2.5 shrink-0">
                            {accessLevels.todaysSale && (
                              <div className={\`rounded-xl text-center border shadow-sm flex flex-col justify-center p-4 h-[120px] transition-colors \${isDark ? 'bg-[#161b22] border-[#30363d]' : 'bg-white border-slate-200'}\`}>
                                <div className={\`text-[10.5px] font-bold mb-1 transition-colors \${isDark ? 'text-gray-400' : 'text-slate-500'}\`}>Today's Sales</div>
                                <div className="text-base font-bold text-[#18ba60]">{config.currency} {stats.todaySales.toFixed(2)}</div>
                              </div>
                            )}
                            {accessLevels.totalSale && (
                              <div className={\`rounded-xl text-center border shadow-sm flex flex-col justify-center p-4 h-[120px] transition-colors \${isDark ? 'bg-[#161b22] border-[#30363d]' : 'bg-white border-slate-200'}\`}>
                                <div className={\`text-[10.5px] font-bold mb-1 transition-colors \${isDark ? 'text-gray-400' : 'text-slate-500'}\`}>Total Sales</div>
                                <div className="text-base font-bold text-[#18ba60]">{stats.totalSales > 0 ? \`\${config.currency} \${stats.totalSales.toFixed(2)}\` : ""}</div>
                              </div>
                            )}
                            {accessLevels.thisMonthSale && (
                              <div className={\`rounded-xl text-center border shadow-sm flex flex-col justify-center p-4 h-[120px] transition-colors \${isDark ? 'bg-[#161b22] border-[#30363d]' : 'bg-white border-slate-200'}\`}>
                                <div className={\`text-[10.5px] font-bold mb-1 transition-colors \${isDark ? 'text-gray-400' : 'text-slate-500'}\`}>This Month</div>
                                <div className="text-base font-bold text-[#18ba60]">{config.currency} {stats.monthSales.toFixed(2)}</div>
                              </div>
                            )}
                            {accessLevels.ipAddress && (
                              <div className={\`rounded-xl text-center border shadow-sm flex flex-col justify-center p-4 h-[120px] transition-colors \${isDark ? 'bg-[#161b22] border-[#30363d]' : 'bg-white border-slate-200'}\`}>
                                <div className={\`text-[10.5px] font-bold mb-1 transition-colors \${isDark ? 'text-gray-400' : 'text-slate-500'}\`}>IP Address</div>
                                <div className="text-base font-bold text-[#18ba60]">{stats.serverIp || '127.0.0.1'}</div>
                              </div>
                            )}
                          </div>`,
`                          {/* Row 1 (Fixed): Centered, no icons */}
                          <div className="grid grid-cols-4 gap-2.5 shrink-0">
                            {accessLevels.todaysSale && checkDashboardPermission('todaysSale') && (
                              <div className={\`rounded-xl text-center border shadow-sm flex flex-col justify-center p-4 h-[120px] transition-colors \${isDark ? 'bg-[#161b22] border-[#30363d]' : 'bg-white border-slate-200'}\`}>
                                <div className={\`text-[10.5px] font-bold mb-1 transition-colors \${isDark ? 'text-gray-400' : 'text-slate-500'}\`}>Today's Sales</div>
                                <div className="text-base font-bold text-[#18ba60]">{config.currency} {stats.todaySales.toFixed(2)}</div>
                              </div>
                            )}
                            {accessLevels.totalSale && checkDashboardPermission('totalSale') && (
                              <div className={\`rounded-xl text-center border shadow-sm flex flex-col justify-center p-4 h-[120px] transition-colors \${isDark ? 'bg-[#161b22] border-[#30363d]' : 'bg-white border-slate-200'}\`}>
                                <div className={\`text-[10.5px] font-bold mb-1 transition-colors \${isDark ? 'text-gray-400' : 'text-slate-500'}\`}>Total Sales</div>
                                <div className="text-base font-bold text-[#18ba60]">{stats.totalSales > 0 ? \`\${config.currency} \${stats.totalSales.toFixed(2)}\` : ""}</div>
                              </div>
                            )}
                            {accessLevels.thisMonthSale && checkDashboardPermission('thisMonthSale') && (
                              <div className={\`rounded-xl text-center border shadow-sm flex flex-col justify-center p-4 h-[120px] transition-colors \${isDark ? 'bg-[#161b22] border-[#30363d]' : 'bg-white border-slate-200'}\`}>
                                <div className={\`text-[10.5px] font-bold mb-1 transition-colors \${isDark ? 'text-gray-400' : 'text-slate-500'}\`}>This Month</div>
                                <div className="text-base font-bold text-[#18ba60]">{config.currency} {stats.monthSales.toFixed(2)}</div>
                              </div>
                            )}
                            {accessLevels.ipAddress && checkDashboardPermission('ipAddress') && (
                              <div className={\`rounded-xl text-center border shadow-sm flex flex-col justify-center p-4 h-[120px] transition-colors \${isDark ? 'bg-[#161b22] border-[#30363d]' : 'bg-white border-slate-200'}\`}>
                                <div className={\`text-[10.5px] font-bold mb-1 transition-colors \${isDark ? 'text-gray-400' : 'text-slate-500'}\`}>IP Address</div>
                                <div className="text-base font-bold text-[#18ba60]">{stats.serverIp || '127.0.0.1'}</div>
                              </div>
                            )}
                          </div>`,
  "3. Dashboard cards wrapping"
);

// 4. Dashboard scrollable grid wrapping (allSalesAnalysis)
replaceExactlyOnce(
`                          {/* All Card Sets - Scrollable Grid with Green Scrollbar */}
                          <div className={\`flex-1 rounded-2xl border p-2.5 overflow-y-auto green-scrollbar transition-colors \${isDark ? 'bg-[#161b22] border-[#30363d]' : 'bg-white border-slate-200'}\`}>
                            <div className="grid grid-cols-4 gap-2.5">
                              {/* Set 1: Prime Sales Channels & Performance */}
                              <DashboardCard title="Offline Sales" val={\`\${config.currency} \${stats.offlineSales.toFixed(2)}\`} icon={<Monitor size={18} className="text-[#18ba60]"/>} isDark={isDark} />
                              <DashboardCard title="Online Sales" val={\`\${config.currency} \${stats.onlineSales.toFixed(2)}\`} icon={<Globe size={18} className="text-[#18ba60]"/>} isDark={isDark} />
                              <DashboardCard title="Dine In" val={\`\${config.currency} \${stats.dineInSales.toFixed(2)}\`} icon={<Coffee size={18} className="text-[#18ba60]"/>} isDark={isDark} />
                              <DashboardCard title="Quick Bill" val={\`\${config.currency} \${stats.quickSales.toFixed(2)}\`} icon={<Zap size={18} className="text-[#18ba60]"/>} isDark={isDark} />
                              <DashboardCard title="Takeaway" val={\`\${config.currency} \${stats.takeawaySales.toFixed(2)}\`} icon={<ShoppingBag size={18} className="text-[#18ba60]"/>} isDark={isDark} />
                              <DashboardCard title="Delivery" val={\`\${config.currency} \${stats.deliverySales.toFixed(2)}\`} icon={<Bike size={18} className="text-[#18ba60]"/>} isDark={isDark} />

                              {/* Set 2: Core Business Metrics */}
                              <DashboardCard title="Customers" val={\`\${Object.keys(customerDb || {}).length}\`} icon={<Users size={18} className="text-[#18ba60]"/>} isDark={isDark} />
                              <DashboardCard title="Outstanding Dues" val={\`\${config.currency} \${outstandingDues.toFixed(2)}\`} icon={<Clock size={18} className="text-[#18ba60]"/>} isDark={isDark} />
                              <DashboardCard title="Today's Credit Sales" val={\`\${config.currency} \${stats.todayCreditSales.toFixed(2)}\`} icon={<Coins size={18} className="text-[#18ba60]"/>} isDark={isDark} />
                              <DashboardCard title="Total Credit Sales" val={\`\${config.currency} \${stats.totalCreditSales.toFixed(2)}\`} icon={<Wallet size={18} className="text-[#18ba60]"/>} isDark={isDark} />
                              <DashboardCard title="Total Expenses" val={\`\${config.currency} \${(stats.totalExpenses || 0).toFixed(2)}\`} icon={<CreditCard size={18} className="text-[#18ba60]"/>} isDark={isDark} />
                              <DashboardCard title="Closing Balance" val={\`\${config.currency} \${stats.totalSales.toFixed(2)}\`} icon={<Wallet size={18} className="text-[#18ba60]"/>} isDark={isDark} />
                              <DashboardCard title="Total Discount" val={\`\${config.currency} \${stats.totalDiscount.toFixed(2)}\`} icon={<Tag size={18} className="text-[#18ba60]"/>} isDark={isDark} />
                              <DashboardCard title="Total Tax" val={\`\${config.currency} \${stats.totalTax.toFixed(2)}\`} icon={<Percent size={18} className="text-[#18ba60]"/>} isDark={isDark} />
                              <DashboardCard title="Average Sale / Person" val={\`\${config.currency} \${parseFloat(stats.avgSalePerPerson || 0).toFixed(2)}\`} icon={<Activity size={18} className="text-[#18ba60]"/>} isDark={isDark} />

                              {/* Set 3: Integrations & Complementary */}
                              <DashboardCard title="Free Bill" val={\`\${config.currency} \${stats.freeSales.toFixed(2)}\`} icon={<FileCheck size={18} className="text-[#18ba60]"/>} isDark={isDark} />

                              {/* Set 4: Cancellations & Audits */}
                              <DashboardCard title="Cancelled Bill" val={\`\${config.currency} \${stats.cancelledSales.toFixed(2)}\`} icon={<FileX size={18} className="text-[#18ba60]"/>} isDark={isDark} />
                              <DashboardCard title="Deleted Bill" val={\`\${config.currency} \${stats.deletedSales.toFixed(2)}\`} icon={<Trash2 size={18} className="text-[#18ba60]"/>} isDark={isDark} />
                              <DashboardCard title="Cancelled (Online)" val={\`\${config.currency} \${stats.cancelledOnlineSales.toFixed(2)}\`} icon={<FileX size={18} className="text-[#18ba60]"/>} isDark={isDark} />
                              <DashboardCard title="Cancelled (Digital)" val={\`\${config.currency} \${stats.cancelledDigitalSales.toFixed(2)}\`} icon={<FileX size={18} className="text-[#18ba60]"/>} isDark={isDark} />
                            </div>
                          </div>`,
`                          {/* All Card Sets - Scrollable Grid with Green Scrollbar */}
                          {accessLevels.allSalesAnalysis && checkDashboardPermission('allSalesAnalysis') && (
                            <div className={\`flex-1 rounded-2xl border p-2.5 overflow-y-auto green-scrollbar transition-colors \${isDark ? 'bg-[#161b22] border-[#30363d]' : 'bg-white border-slate-200'}\`}>
                              <div className="grid grid-cols-4 gap-2.5">
                                {/* Set 1: Prime Sales Channels & Performance */}
                                <DashboardCard title="Offline Sales" val={\`\${config.currency} \${stats.offlineSales.toFixed(2)}\`} icon={<Monitor size={18} className="text-[#18ba60]"/>} isDark={isDark} />
                                <DashboardCard title="Online Sales" val={\`\${config.currency} \${stats.onlineSales.toFixed(2)}\`} icon={<Globe size={18} className="text-[#18ba60]"/>} isDark={isDark} />
                                <DashboardCard title="Dine In" val={\`\${config.currency} \${stats.dineInSales.toFixed(2)}\`} icon={<Coffee size={18} className="text-[#18ba60]"/>} isDark={isDark} />
                                <DashboardCard title="Quick Bill" val={\`\${config.currency} \${stats.quickSales.toFixed(2)}\`} icon={<Zap size={18} className="text-[#18ba60]"/>} isDark={isDark} />
                                <DashboardCard title="Takeaway" val={\`\${config.currency} \${stats.takeawaySales.toFixed(2)}\`} icon={<ShoppingBag size={18} className="text-[#18ba60]"/>} isDark={isDark} />
                                <DashboardCard title="Delivery" val={\`\${config.currency} \${stats.deliverySales.toFixed(2)}\`} icon={<Bike size={18} className="text-[#18ba60]"/>} isDark={isDark} />

                                {/* Set 2: Core Business Metrics */}
                                <DashboardCard title="Customers" val={\`\${Object.keys(customerDb || {}).length}\`} icon={<Users size={18} className="text-[#18ba60]"/>} isDark={isDark} />
                                <DashboardCard title="Outstanding Dues" val={\`\${config.currency} \${outstandingDues.toFixed(2)}\`} icon={<Clock size={18} className="text-[#18ba60]"/>} isDark={isDark} />
                                <DashboardCard title="Today's Credit Sales" val={\`\${config.currency} \${stats.todayCreditSales.toFixed(2)}\`} icon={<Coins size={18} className="text-[#18ba60]"/>} isDark={isDark} />
                                <DashboardCard title="Total Credit Sales" val={\`\${config.currency} \${stats.totalCreditSales.toFixed(2)}\`} icon={<Wallet size={18} className="text-[#18ba60]"/>} isDark={isDark} />
                                <DashboardCard title="Total Expenses" val={\`\${config.currency} \${(stats.totalExpenses || 0).toFixed(2)}\`} icon={<CreditCard size={18} className="text-[#18ba60]"/>} isDark={isDark} />
                                <DashboardCard title="Closing Balance" val={\`\${config.currency} \${stats.totalSales.toFixed(2)}\`} icon={<Wallet size={18} className="text-[#18ba60]"/>} isDark={isDark} />
                                <DashboardCard title="Total Discount" val={\`\${config.currency} \${stats.totalDiscount.toFixed(2)}\`} icon={<Tag size={18} className="text-[#18ba60]"/>} isDark={isDark} />
                                <DashboardCard title="Total Tax" val={\`\${config.currency} \${stats.totalTax.toFixed(2)}\`} icon={<Percent size={18} className="text-[#18ba60]"/>} isDark={isDark} />
                                <DashboardCard title="Average Sale / Person" val={\`\${config.currency} \${parseFloat(stats.avgSalePerPerson || 0).toFixed(2)}\`} icon={<Activity size={18} className="text-[#18ba60]"/>} isDark={isDark} />

                                {/* Set 3: Integrations & Complementary */}
                                <DashboardCard title="Free Bill" val={\`\${config.currency} \${stats.freeSales.toFixed(2)}\`} icon={<FileCheck size={18} className="text-[#18ba60]"/>} isDark={isDark} />

                                {/* Set 4: Cancellations & Audits */}
                                <DashboardCard title="Cancelled Bill" val={\`\${config.currency} \${stats.cancelledSales.toFixed(2)}\`} icon={<FileX size={18} className="text-[#18ba60]"/>} isDark={isDark} />
                                <DashboardCard title="Deleted Bill" val={\`\${config.currency} \${stats.deletedSales.toFixed(2)}\`} icon={<Trash2 size={18} className="text-[#18ba60]"/>} isDark={isDark} />
                                <DashboardCard title="Cancelled (Online)" val={\`\${config.currency} \${stats.cancelledOnlineSales.toFixed(2)}\`} icon={<FileX size={18} className="text-[#18ba60]"/>} isDark={isDark} />
                                <DashboardCard title="Cancelled (Digital)" val={\`\${config.currency} \${stats.cancelledDigitalSales.toFixed(2)}\`} icon={<FileX size={18} className="text-[#18ba60]"/>} isDark={isDark} />
                              </div>
                            </div>
                          )}`,
  "4. Dashboard scrollable grid wrapping (allSalesAnalysis)"
);

// 5. Dashboard other charts
replaceExactlyOnce(
`                        {/* Box 1: Sales Analysis (Solid Orange card) */}
                        {accessLevels.salesAnalysisByDays && (`,
`                        {/* Box 1: Sales Analysis (Solid Orange card) */}
                        {accessLevels.salesAnalysisByDays && checkDashboardPermission('salesAnalysisByDays') && (`,
  "5a. salesAnalysisByDays"
);

replaceExactlyOnce(
`                        {/* Box 2: Payment Breakdown (Solid Indigo/Blue card) */}
                        {accessLevels.paymentModesChart && (`,
`                        {/* Box 2: Payment Breakdown (Solid Indigo/Blue card) */}
                        {accessLevels.paymentModesChart && checkDashboardPermission('paymentModesChart') && (`,
  "5b. paymentModesChart"
);

replaceExactlyOnce(
`                        {/* Donut Chart (Col 3) */}
                        {accessLevels.itemPieChart && (`,
`                        {/* Donut Chart (Col 3) */}
                        {accessLevels.itemPieChart && checkDashboardPermission('itemPieChart') && (`,
  "5c. itemPieChart"
);

replaceExactlyOnce(
`                        {/* Line Chart (Col 3) */}
                        {accessLevels.lineSalesChart && (`,
`                        {/* Line Chart (Col 3) */}
                        {accessLevels.lineSalesChart && checkDashboardPermission('lineSalesChart') && (`,
  "5d. lineSalesChart"
);

replaceExactlyOnce(
`                        {/* Bar Chart (Col 3) */}
                        {accessLevels.barSalesChart && (`,
`                        {/* Bar Chart (Col 3) */}
                        {accessLevels.barSalesChart && checkDashboardPermission('barSalesChart') && (`,
  "5e. barSalesChart"
);

// 6. Order Type Tabs
replaceExactlyOnce(
`                  {/* Mode Tabs: Dine In | PickUp/Delivery | Quick Bill | Preorder */}
                  <div className={\`flex shrink-0 border-b p-1 gap-1 transition-colors \${isDark ? 'border-[#30363d] bg-[#0d1117]' : 'border-slate-200 bg-white'}\`}>
                    {[
                      { key: 'DINE_IN', label: 'Dine In', disabled: !!posSettings.disableTabs?.dinein },
                      { key: 'PICKUP', label: 'PickUp/Delivery', disabled: !!posSettings.disableTabs?.pickup },
                      { key: 'QUICK', label: 'Quick Bill', disabled: !!posSettings.disableTabs?.quickbill },
                      { key: 'PRE_ORDER', label: 'Pre Order', disabled: !!posSettings.disableTabs?.preorder }
                    ].filter(tab => !tab.disabled).map(tab => {`,
`                  {/* Mode Tabs: Dine In | PickUp/Delivery | Quick Bill | Preorder */}
                  <div className={\`flex shrink-0 border-b p-1 gap-1 transition-colors \${isDark ? 'border-[#30363d] bg-[#0d1117]' : 'border-slate-200 bg-white'}\`}>
                    {[
                      { key: 'DINE_IN', label: 'Dine In', disabled: !!posSettings.disableTabs?.dinein || getStaffPermissions()?.pos_access?.Billing?.visible === false },
                      { key: 'PICKUP', label: 'PickUp/Delivery', disabled: !!posSettings.disableTabs?.pickup || (getStaffPermissions()?.pos_access?.Delivery?.new_order === false && getStaffPermissions()?.pos_access?.Pickup?.new_order === false) },
                      { key: 'QUICK', label: 'Quick Bill', disabled: !!posSettings.disableTabs?.quickbill || getStaffPermissions()?.pos_access?.QuickBill?.visible === false },
                      { key: 'PRE_ORDER', label: 'Pre Order', disabled: !!posSettings.disableTabs?.preorder || getStaffPermissions()?.pos_access?.PreOrder?.new_order === false }
                    ].filter(tab => !tab.disabled).map(tab => {`,
  "6. Order Type Tabs"
);

// 7. Pre-order New Order Button
replaceExactlyOnce(
`                      <div className="flex items-center pr-1">
                        {/* New Order Button */}
                        <button
                          onClick={handleNewOrder}
                          className="bg-[#1a2530] hover:bg-[#2c3e50] text-white px-2.5 py-1 rounded text-[10px] font-semibold transition-all"
                        >
                          New Order
                        </button>
                      </div>`,
`                      <div className="flex items-center pr-1">
                        {/* New Order Button */}
                        {getStaffPermissions()?.pos_access?.PreOrder?.new_order !== false && (
                          <button
                            onClick={handleNewOrder}
                            className="bg-[#1a2530] hover:bg-[#2c3e50] text-white px-2.5 py-1 rounded text-[10px] font-semibold transition-all"
                          >
                            New Order
                          </button>
                        )}
                      </div>`,
  "7. Pre-order New Order Button"
);

// 8. Pickup/Delivery New Order Button
replaceExactlyOnce(
`                          {/* New Order Button */}
                          <button
                            onClick={handleNewOrder}
                            className="bg-[#1a2530] hover:bg-[#2c3e50] text-white px-2.5 py-1 rounded text-[10px] font-semibold transition-all"
                          >
                            New Order
                          </button>
                        </div>
                      )}`,
`                          {/* New Order Button */}
                          {((subOrderType === 'DELIVERY' && getStaffPermissions()?.pos_access?.Delivery?.new_order !== false) ||
                            (subOrderType === 'PICKUP' && getStaffPermissions()?.pos_access?.Pickup?.new_order !== false)) && (
                            <button
                              onClick={handleNewOrder}
                              className="bg-[#1a2530] hover:bg-[#2c3e50] text-white px-2.5 py-1 rounded text-[10px] font-semibold transition-all"
                            >
                              New Order
                            </button>
                          )}
                        </div>
                      )}`,
  "8. Pickup/Delivery New Order Button"
);

// 9. Mandatory customer details check in handleCheckout
replaceExactlyOnce(
`    const activeCart = getActiveCart();
    if (activeCart.length === 0) return toast.warning("Cart is empty!");

    // Block credit checkout if no customer is selected`,
`    const activeCart = getActiveCart();
    if (activeCart.length === 0) return toast.warning("Cart is empty!");

    const isDelivery = orderType === 'DELIVERY' || (orderType === 'PICKUP' && subOrderType === 'DELIVERY');
    const isPickup = orderType === 'PICKUP' && subOrderType === 'PICKUP';
    
    if (isDelivery && getStaffPermissions()?.pos_access?.Delivery?.customer_details_mandatory === true) {
      if (!customerName || !customerPhone) {
        return toast.error("Customer name and phone number are mandatory for delivery orders!");
      }
    }
    if (isPickup && getStaffPermissions()?.pos_access?.Pickup?.customer_details_mandatory === true) {
      if (!customerName || !customerPhone) {
        return toast.error("Customer name and phone number are mandatory for pickup orders!");
      }
    }

    // Block credit checkout if no customer is selected`,
  "9. Mandatory customer details check in handleCheckout"
);

// 10. Mandatory customer details check in handleSaveTemporaryKOT
replaceExactlyOnce(
`    if (cart.length === 0) {
      toast.error("KOT is empty!");
      return;
    }

    const isExistingTemp = selectedTable && selectedTable.is_temporary;`,
`    if (cart.length === 0) {
      toast.error("KOT is empty!");
      return;
    }

    const isDeliveryKOT = orderType === 'DELIVERY' || (orderType === 'PICKUP' && subOrderType === 'DELIVERY');
    const isPickupKOT = orderType === 'PICKUP' && subOrderType === 'PICKUP';

    if (isDeliveryKOT && getStaffPermissions()?.pos_access?.Delivery?.customer_details_mandatory === true) {
      if (!customerName || !customerPhone) {
        toast.error("Customer name and phone number are mandatory for delivery orders!");
        return;
      }
    }
    if (isPickupKOT && getStaffPermissions()?.pos_access?.Pickup?.customer_details_mandatory === true) {
      if (!customerName || !customerPhone) {
        toast.error("Customer name and phone number are mandatory for pickup orders!");
        return;
      }
    }

    const isExistingTemp = selectedTable && selectedTable.is_temporary;`,
  "10. Mandatory customer details check in handleSaveTemporaryKOT"
);

// 11. Quick Bill Checkboxes
replaceExactlyOnce(
`                  {/* Quick Bill Row Checkboxes */}
                  {orderType === 'QUICK' && (
                    <div className={\`flex shrink-0 items-center gap-3 border-b px-3 py-2 text-[11px] font-bold transition-colors \${isDark ? 'border-[#30363d] bg-[#0d1117] text-gray-300' : 'border-slate-200 bg-white text-slate-700'}\`}>
                      <label className="flex items-center gap-1 cursor-pointer">
                        <input type="checkbox" className="accent-[#388e67]" />
                        <span>KOT</span>
                      </label>
                      <label className="flex items-center gap-1 cursor-pointer">
                        <input type="checkbox" className="accent-[#388e67]" />
                        <span>Bill No</span>
                      </label>
                      <label className="flex items-center gap-1 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={ebillEnabled}
                          onChange={e => setEbillEnabled(e.target.checked)}
                          className="accent-[#388e67]"
                        />
                        <span>eBill</span>
                      </label>
                      <span className="ml-auto text-[12px] font-extrabold text-slate-800 dark:text-gray-100">No:{nextBillNo}</span>
                    </div>
                  )}`,
`                  {/* Quick Bill Row Checkboxes */}
                  {orderType === 'QUICK' && (
                    <div className={\`flex shrink-0 items-center gap-3 border-b px-3 py-2 text-[11px] font-bold transition-colors \${isDark ? 'border-[#30363d] bg-[#0d1117] text-gray-300' : 'border-slate-200 bg-white text-slate-700'}\`}>
                      {getStaffPermissions()?.pos_access?.QuickBill?.kot !== false && (
                        <label className="flex items-center gap-1 cursor-pointer">
                          <input type="checkbox" className="accent-[#388e67]" />
                          <span>KOT</span>
                        </label>
                      )}
                      {getStaffPermissions()?.pos_access?.QuickBill?.bill_no !== false && (
                        <label className="flex items-center gap-1 cursor-pointer">
                          <input type="checkbox" className="accent-[#388e67]" />
                          <span>Bill No</span>
                        </label>
                      )}
                      <label className="flex items-center gap-1 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={ebillEnabled}
                          onChange={e => setEbillEnabled(e.target.checked)}
                          className="accent-[#388e67]"
                        />
                        <span>eBill</span>
                      </label>
                      {getStaffPermissions()?.pos_access?.QuickBill?.bill_no !== false && (
                        <span className="ml-auto text-[12px] font-extrabold text-slate-800 dark:text-gray-100">No:{nextBillNo}</span>
                      )}
                    </div>
                  )}`,
  "11. Quick Bill Checkboxes"
);

// 12. Split Bill switcher
replaceExactlyOnce(
`<div className={\`flex items-center rounded-xl p-1 \${isDark ? 'bg-[#0d1117] border border-[#30363d]' : 'bg-slate-100 border border-slate-200'}\`}>
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
</div>`,
`<div className={\`flex items-center rounded-xl p-1 \${isDark ? 'bg-[#0d1117] border border-[#30363d]' : 'bg-slate-100 border border-slate-200'}\`}>
   {['PORTION', 'PERCENT', 'ITEM'].filter(mode => {
      if (mode === 'PORTION') return checkSplitBillPermission('portion_wise');
      if (mode === 'PERCENT') return checkSplitBillPermission('percentage_wise');
      if (mode === 'ITEM') return checkSplitBillPermission('item_wise');
      return true;
   }).map(mode => (
      <button
         key={mode}
         type="button"
         onClick={() => setSplitMode(mode)}
         className={\`px-4 py-1.5 rounded-lg text-xs font-black uppercase italic transition-all \${splitMode === mode ? 'bg-[#10ac84] text-white shadow-sm' : (isDark ? 'text-gray-400 hover:text-white' : 'text-slate-600 hover:text-slate-900')}\`}
      >
         {mode}
      </button>
   ))}
</div>`,
  "12. Split Bill switcher"
);

// 13. Customer management buttons
replaceExactlyOnce(
`                  {/* Grey Container Band */}
                  <div className={\`p-4 rounded-sm border \${isDark ? 'bg-[#161b22] border-[#30363d]' : 'bg-[#eaebed] border-[#dcdee2]'} flex items-center gap-4 flex-wrap\`}>
                     {/* Adding Customers */}
                     <button
                        onClick={() => {
                           setNewCustomerForm({ name: '', phone: '', address: '', points: 0, balance: 0 });
                           setIsAddCustomerModalOpen(true);
                        }}
                        className={\`w-28 h-28 rounded-md border flex flex-col items-center justify-center gap-2 transition-all hover:scale-[1.02] shadow-sm \${isDark ? 'bg-[#0d1117] border-[#30363d] hover:border-[#18ba60]' : 'bg-white border-[#d2d4d8] hover:border-[#10ac84] hover:shadow-md'}\`}
                     >
                        <UserPlus size={28} className={isDark ? 'text-[#18ba60]' : 'text-slate-950'} />
                        <span className={\`text-[10px] font-bold text-center leading-tight \${isDark ? 'text-[#c9d1d9]' : 'text-slate-800'}\`}>
                           Adding<br />Customers
                        </span>
                     </button>

                     {/* Managing Customers */}
                     <button
                        onClick={() => {
                           setCustomerSearchQuery('');
                           setEditingCustomerPhone(null);
                           setConfigSubView('manage-customers');
                        }}
                        className={\`w-28 h-28 rounded-md border flex flex-col items-center justify-center gap-2 transition-all hover:scale-[1.02] shadow-sm \${isDark ? 'bg-[#0d1117] border-[#30363d] hover:border-[#18ba60]' : 'bg-white border-[#d2d4d8] hover:border-[#10ac84] hover:shadow-md'}\`}
                     >
                        <Users size={28} className={isDark ? 'text-[#18ba60]' : 'text-slate-950'} />
                        <span className={\`text-[10px] font-bold text-center leading-tight \${isDark ? 'text-[#c9d1d9]' : 'text-slate-800'}\`}>
                           Managing<br />Customers
                        </span>
                     </button>

                     {/* Managing Customer Balances */}
                     <button
                        onClick={() => {
                           setCustomerSearchQuery('');
                           setEditingCustomerPhone(null);
                           setAdjustmentAmount('');
                           setConfigSubView('manage-balances');
                        }}
                        className={\`w-28 h-28 rounded-md border flex flex-col items-center justify-center gap-2 transition-all hover:scale-[1.02] shadow-sm \${isDark ? 'bg-[#0d1117] border-[#30363d] hover:border-[#18ba60]' : 'bg-white border-[#d2d4d8] hover:border-[#10ac84] hover:shadow-md'}\`}
                     >
                        <Wallet size={28} className={isDark ? 'text-[#18ba60]' : 'text-slate-950'} />
                        <span className={\`text-[10px] font-bold text-center leading-tight \${isDark ? 'text-[#c9d1d9]' : 'text-slate-800'}\`}>
                           Managing<br />Customer Balances
                        </span>
                     </button>

                     {/* Managing Loyalty Points of Customers */}
                     <button
                        onClick={() => {
                           setCustomerSearchQuery('');
                           setEditingCustomerPhone(null);
                           setAdjustmentAmount('');
                           setConfigSubView('manage-points');
                        }}
                        className={\`w-28 h-28 rounded-md border flex flex-col items-center justify-center gap-2 transition-all hover:scale-[1.02] shadow-sm \${isDark ? 'bg-[#0d1117] border-[#30363d] hover:border-[#18ba60]' : 'bg-white border-[#d2d4d8] hover:border-[#10ac84] hover:shadow-md'}\`}
                     >
                        <Award size={28} className={isDark ? 'text-[#18ba60]' : 'text-slate-950'} />
                        <span className={\`text-[10px] font-bold text-center leading-tight \${isDark ? 'text-[#c9d1d9]' : 'text-slate-800'}\`}>
                           Managing<br />Loyalty Points
                        </span>
                     </button>
                  </div>`,
`                  {/* Grey Container Band */}
                  <div className={\`p-4 rounded-sm border \${isDark ? 'bg-[#161b22] border-[#30363d]' : 'bg-[#eaebed] border-[#dcdee2]'} flex items-center gap-4 flex-wrap\`}>
                     {/* Adding Customers */}
                     {getStaffPermissions()?.pos_access?.CustomerManagement?.add !== false && (
                        <button
                           onClick={() => {
                              setNewCustomerForm({ name: '', phone: '', address: '', points: 0, balance: 0 });
                              setIsAddCustomerModalOpen(true);
                           }}
                           className={\`w-28 h-28 rounded-md border flex flex-col items-center justify-center gap-2 transition-all hover:scale-[1.02] shadow-sm \${isDark ? 'bg-[#0d1117] border-[#30363d] hover:border-[#18ba60]' : 'bg-white border-[#d2d4d8] hover:border-[#10ac84] hover:shadow-md'}\`}
                        >
                           <UserPlus size={28} className={isDark ? 'text-[#18ba60]' : 'text-slate-950'} />
                           <span className={\`text-[10px] font-bold text-center leading-tight \${isDark ? 'text-[#c9d1d9]' : 'text-slate-800'}\`}>
                              Adding<br />Customers
                           </span>
                        </button>
                     )}

                     {/* Managing Customers */}
                     {getStaffPermissions()?.pos_access?.CustomerManagement?.edit !== false && (
                        <button
                           onClick={() => {
                              setCustomerSearchQuery('');
                              setEditingCustomerPhone(null);
                              setConfigSubView('manage-customers');
                           }}
                           className={\`w-28 h-28 rounded-md border flex flex-col items-center justify-center gap-2 transition-all hover:scale-[1.02] shadow-sm \${isDark ? 'bg-[#0d1117] border-[#30363d] hover:border-[#18ba60]' : 'bg-white border-[#d2d4d8] hover:border-[#10ac84] hover:shadow-md'}\`}
                        >
                           <Users size={28} className={isDark ? 'text-[#18ba60]' : 'text-slate-950'} />
                           <span className={\`text-[10px] font-bold text-center leading-tight \${isDark ? 'text-[#c9d1d9]' : 'text-slate-800'}\`}>
                              Managing<br />Customers
                           </span>
                        </button>
                     )}

                     {/* Managing Customer Balances */}
                     {getStaffPermissions()?.pos_access?.CustomerManagement?.WalletManagement?.visible !== false && (
                        <button
                           onClick={() => {
                              setCustomerSearchQuery('');
                              setEditingCustomerPhone(null);
                              setAdjustmentAmount('');
                              setConfigSubView('manage-balances');
                           }}
                           className={\`w-28 h-28 rounded-md border flex flex-col items-center justify-center gap-2 transition-all hover:scale-[1.02] shadow-sm \${isDark ? 'bg-[#0d1117] border-[#30363d] hover:border-[#18ba60]' : 'bg-white border-[#d2d4d8] hover:border-[#10ac84] hover:shadow-md'}\`}
                        >
                           <Wallet size={28} className={isDark ? 'text-[#18ba60]' : 'text-slate-950'} />
                           <span className={\`text-[10px] font-bold text-center leading-tight \${isDark ? 'text-[#c9d1d9]' : 'text-slate-800'}\`}>
                              Managing<br />Customer Balances
                           </span>
                        </button>
                     )}

                     {/* Managing Loyalty Points of Customers */}
                     {getStaffPermissions()?.pos_access?.CustomerManagement?.WalletManagement?.visible !== false && (
                        <button
                           onClick={() => {
                              setCustomerSearchQuery('');
                              setEditingCustomerPhone(null);
                              setAdjustmentAmount('');
                              setConfigSubView('manage-points');
                           }}
                           className={\`w-28 h-28 rounded-md border flex flex-col items-center justify-center gap-2 transition-all hover:scale-[1.02] shadow-sm \${isDark ? 'bg-[#0d1117] border-[#30363d] hover:border-[#18ba60]' : 'bg-white border-[#d2d4d8] hover:border-[#10ac84] hover:shadow-md'}\`}
                        >
                           <Award size={28} className={isDark ? 'text-[#18ba60]' : 'text-slate-950'} />
                           <span className={\`text-[10px] font-bold text-center leading-tight \${isDark ? 'text-[#c9d1d9]' : 'text-slate-800'}\`}>
                              Managing<br />Loyalty Points
                           </span>
                        </button>
                     )}
                  </div>`,
  "13. Customer management buttons"
);

// 14. Excel and PDF exports
replaceExactlyOnce(
`                              <div className="flex items-center gap-2">
                                 <button
                                    onClick={exportToExcel}
                                    className="flex items-center gap-2 h-8 px-3 text-[10px] font-black uppercase rounded-lg bg-[#18ba60] hover:bg-[#15a353] text-white shadow-sm transition-colors cursor-pointer"
                                 >
                                    <Download size={12} /> Excel (.xlsx)
                                 </button>
                                 <button
                                    onClick={exportToPDF}
                                    className="flex items-center gap-2 h-8 px-3 text-[10px] font-black uppercase rounded-lg bg-red-600 hover:bg-red-700 text-white shadow-sm transition-colors cursor-pointer"
                                 >
                                    <FileText size={12} /> PDF Statement
                                 </button>
                              </div>`,
`                              <div className="flex items-center gap-2">
                                 {getStaffPermissions()?.pos_access?.CustomerManagement?.export !== false && (
                                    <button
                                       onClick={exportToExcel}
                                       className="flex items-center gap-2 h-8 px-3 text-[10px] font-black uppercase rounded-lg bg-[#18ba60] hover:bg-[#15a353] text-white shadow-sm transition-colors cursor-pointer"
                                    >
                                       <Download size={12} /> Excel (.xlsx)
                                    </button>
                                 )}
                                 {getStaffPermissions()?.pos_access?.CustomerManagement?.export !== false && (
                                    <button
                                       onClick={exportToPDF}
                                       className="flex items-center gap-2 h-8 px-3 text-[10px] font-black uppercase rounded-lg bg-red-600 hover:bg-red-700 text-white shadow-sm transition-colors cursor-pointer"
                                    >
                                       <FileText size={12} /> PDF Statement
                                    </button>
                                 )}
                              </div>`,
  "14. Excel and PDF exports"
);

// 15. User Management & Reservations Buttons
replaceExactlyOnce(
`                     <button
                        onClick={() => setIsUserManagementModalOpen(true)}
                        className="p-6 rounded-xl bg-[#161b22] border border-[#30363d] text-left hover:border-[#10ac84] transition-all group"
                     >
                        <div className="w-10 h-10 bg-[#10ac84]/10 rounded-lg flex items-center justify-center text-[#10ac84] mb-4 group-hover:bg-[#10ac84] group-hover:text-white transition-all">
                           <Users size={20}/>
                        </div>
                        <h4 className="text-xs font-black uppercase italic text-[#c9d1d9]">User Management</h4>
                        <p className="text-[9px] font-bold text-[#8b949e] mt-1">Manage staff, roles, and KDS access.</p>
                     </button>
                     <button
                        onClick={() => setIsCaptainAppModalOpen(true)}
                        className="p-6 rounded-xl bg-[#161b22] border border-[#30363d] text-left hover:border-[#10ac84] transition-all group"
                     >
                        <div className="w-10 h-10 bg-[#10ac84]/10 rounded-lg flex items-center justify-center text-[#10ac84] mb-4 group-hover:bg-[#10ac84] group-hover:text-white transition-all">
                           <Monitor size={20}/>
                        </div>
                        <h4 className="text-xs font-black uppercase italic text-[#c9d1d9]">Captain App</h4>
                        <p className="text-[9px] font-bold text-[#8b949e] mt-1">View Captain (Waiter) app mockup.</p>
                     </button>
                     <button
                        onClick={() => setIsFeedbackModalOpen(true)}
                        className="p-6 rounded-xl bg-[#161b22] border border-[#30363d] text-left hover:border-[#10ac84] transition-all group"
                     >
                        <div className="w-10 h-10 bg-[#10ac84]/10 rounded-lg flex items-center justify-center text-[#10ac84] mb-4 group-hover:bg-[#10ac84] group-hover:text-white transition-all">
                           <MessageSquare size={20}/>
                        </div>
                        <h4 className="text-xs font-black uppercase italic text-[#c9d1d9]">Feedback Management</h4>
                        <p className="text-[9px] font-bold text-[#8b949e] mt-1">View customer feedback form.</p>
                     </button>
                     <button
                        onClick={() => setIsInventoryModalOpen(true)}
                        className="p-6 rounded-xl bg-[#161b22] border border-[#30363d] text-left hover:border-[#10ac84] transition-all group"
                     >
                        <div className="w-10 h-10 bg-[#10ac84]/10 rounded-lg flex items-center justify-center text-[#10ac84] mb-4 group-hover:bg-[#10ac84] group-hover:text-white transition-all">
                           <Package size={20}/>
                        </div>
                        <h4 className="text-xs font-black uppercase italic text-[#c9d1d9]">Inventory Management</h4>
                        <p className="text-[9px] font-bold text-[#8b949e] mt-1">Manage stock on hand and vendors.</p>
                     </button>
                     <button
                        onClick={() => setIsReservationModalOpen(true)}
                        className="p-6 rounded-xl bg-[#161b22] border border-[#30363d] text-left hover:border-[#10ac84] transition-all group"
                     >
                        <div className="w-10 h-10 bg-[#10ac84]/10 rounded-lg flex items-center justify-center text-[#10ac84] mb-4 group-hover:bg-[#10ac84] group-hover:text-white transition-all">
                           <Calendar size={20}/>
                        </div>
                        <h4 className="text-xs font-black uppercase italic text-[#c9d1d9]">Table Reservations</h4>
                        <p className="text-[9px] font-bold text-[#8b949e] mt-1">Manage table bookings and guests.</p>
                     </button>`,
`                     {getStaffPermissions()?.pos_access?.UserManagement?.visible !== false && (
                        <button
                           onClick={() => setIsUserManagementModalOpen(true)}
                           className="p-6 rounded-xl bg-[#161b22] border border-[#30363d] text-left hover:border-[#10ac84] transition-all group"
                        >
                           <div className="w-10 h-10 bg-[#10ac84]/10 rounded-lg flex items-center justify-center text-[#10ac84] mb-4 group-hover:bg-[#10ac84] group-hover:text-white transition-all">
                              <Users size={20}/>
                           </div>
                           <h4 className="text-xs font-black uppercase italic text-[#c9d1d9]">User Management</h4>
                           <p className="text-[9px] font-bold text-[#8b949e] mt-1">Manage staff, roles, and KDS access.</p>
                        </button>
                     )}
                     <button
                        onClick={() => setIsCaptainAppModalOpen(true)}
                        className="p-6 rounded-xl bg-[#161b22] border border-[#30363d] text-left hover:border-[#10ac84] transition-all group"
                     >
                        <div className="w-10 h-10 bg-[#10ac84]/10 rounded-lg flex items-center justify-center text-[#10ac84] mb-4 group-hover:bg-[#10ac84] group-hover:text-white transition-all">
                           <Monitor size={20}/>
                        </div>
                        <h4 className="text-xs font-black uppercase italic text-[#c9d1d9]">Captain App</h4>
                        <p className="text-[9px] font-bold text-[#8b949e] mt-1">View Captain (Waiter) app mockup.</p>
                     </button>
                     <button
                        onClick={() => setIsFeedbackModalOpen(true)}
                        className="p-6 rounded-xl bg-[#161b22] border border-[#30363d] text-left hover:border-[#10ac84] transition-all group"
                     >
                        <div className="w-10 h-10 bg-[#10ac84]/10 rounded-lg flex items-center justify-center text-[#10ac84] mb-4 group-hover:bg-[#10ac84] group-hover:text-white transition-all">
                           <MessageSquare size={20}/>
                        </div>
                        <h4 className="text-xs font-black uppercase italic text-[#c9d1d9]">Feedback Management</h4>
                        <p className="text-[9px] font-bold text-[#8b949e] mt-1">View customer feedback form.</p>
                     </button>
                     <button
                        onClick={() => setIsInventoryModalOpen(true)}
                        className="p-6 rounded-xl bg-[#161b22] border border-[#30363d] text-left hover:border-[#10ac84] transition-all group"
                     >
                        <div className="w-10 h-10 bg-[#10ac84]/10 rounded-lg flex items-center justify-center text-[#10ac84] mb-4 group-hover:bg-[#10ac84] group-hover:text-white transition-all">
                           <Package size={20}/>
                        </div>
                        <h4 className="text-xs font-black uppercase italic text-[#c9d1d9]">Inventory Management</h4>
                        <p className="text-[9px] font-bold text-[#8b949e] mt-1">Manage stock on hand and vendors.</p>
                     </button>
                     {getStaffPermissions()?.pos_access?.OrderWindow?.table_reservation !== false && (
                        <button
                           onClick={() => setIsReservationModalOpen(true)}
                           className="p-6 rounded-xl bg-[#161b22] border border-[#30363d] text-left hover:border-[#10ac84] transition-all group"
                        >
                           <div className="w-10 h-10 bg-[#10ac84]/10 rounded-lg flex items-center justify-center text-[#10ac84] mb-4 group-hover:bg-[#10ac84] group-hover:text-white transition-all">
                              <Calendar size={20}/>
                           </div>
                           <h4 className="text-xs font-black uppercase italic text-[#c9d1d9]">Table Reservations</h4>
                           <p className="text-[9px] font-bold text-[#8b949e] mt-1">Manage table bookings and guests.</p>
                        </button>
                     )}`,
  "15. User Management & Reservations Buttons"
);

// 16. Receipts Date Filters
replaceExactlyOnce(
`                {/* Top Action Bar */}
                <div className="h-14 border-b border-[#30363d] flex items-center gap-3 px-4 shrink-0 bg-[#0d1117]">
                  <button
                    onClick={() => { setReceiptsDateMode('all'); setSelectedReceiptIds([]); }}
                    className={\`h-8 px-6 text-[11px] font-bold rounded border transition-colors cursor-pointer \${receiptsDateMode === 'all' ? 'bg-black border-black text-white hover:bg-neutral-800' : 'bg-[#21262d] text-[#c9d1d9] border-[#30363d] hover:bg-[#30363d]'}\`}
                  >
                    All Bills
                  </button>
                  <button
                    onClick={() => {
                      const start = new Date(); start.setHours(0,0,0,0);
                      const end = new Date(); end.setHours(23,59,59,999);
                      setReceiptsStartDate(start); setReceiptsEndDate(end);
                      setReceiptsDateMode('today'); setSelectedReceiptIds([]);
                    }}
                    className={\`h-8 px-6 text-[11px] font-bold rounded border transition-colors cursor-pointer \${receiptsDateMode === 'today' ? 'bg-black border-black text-white hover:bg-neutral-800' : 'bg-[#21262d] text-[#c9d1d9] border-[#30363d] hover:bg-[#30363d]'}\`}
                  >
                    Todays Bills
                  </button>

                  <div className="flex items-center gap-2 ml-2">
                    <input
                      type="checkbox"
                      className="w-3 h-3 accent-[#238636] cursor-pointer"
                      checked={paginatedOrders.length > 0 && paginatedOrders.every(o => selectedReceiptIds.includes(o.id))}
                      onChange={handleToggleSelectAll}
                    />
                    <span className="text-[11px] font-bold text-[#c9d1d9] select-none cursor-pointer" onClick={handleToggleSelectAll}>Select All</span>
                  </div>

                  <input
                    type="text"
                    placeholder="Search"
                    value={receiptSearchQuery}
                    onChange={(e) => setReceiptSearchQuery(e.target.value)}
                    className="h-8 w-48 ml-2 bg-[#0d1117] border border-[#30363d] rounded px-3 text-[11px] text-[#c9d1d9] outline-none focus:border-[#238636]"
                  />

                  <div className="relative">
                    <button
                      onClick={handleOpenDatePicker}
                      className="h-8 px-3 bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] rounded text-[11px] font-medium border border-[#30363d] flex items-center gap-2 cursor-pointer transition-all duration-200"
                    >
                      <Calendar size={13} className="text-[#8b949e]" />
                      <span>{\`\${formatReceiptDate(receiptsStartDate)} - \${formatReceiptDate(receiptsEndDate)}\`}</span>
                      <ChevronDown size={11} className="text-[#8b949e]" />
                    </button>`,
`                {/* Top Action Bar */}
                <div className="h-14 border-b border-[#30363d] flex items-center gap-3 px-4 shrink-0 bg-[#0d1117]">
                  {checkReceiptsPermission('all_bills') !== false && (
                    <button
                      onClick={() => { setReceiptsDateMode('all'); setSelectedReceiptIds([]); }}
                      className={\`h-8 px-6 text-[11px] font-bold rounded border transition-colors cursor-pointer \${receiptsDateMode === 'all' ? 'bg-black border-black text-white hover:bg-neutral-800' : 'bg-[#21262d] text-[#c9d1d9] border-[#30363d] hover:bg-[#30363d]'}\`}
                    >
                      All Bills
                    </button>
                  )}
                  {checkReceiptsPermission('todays_bills') !== false && (
                    <button
                      onClick={() => {
                        const start = new Date(); start.setHours(0,0,0,0);
                        const end = new Date(); end.setHours(23,59,59,999);
                        setReceiptsStartDate(start); setReceiptsEndDate(end);
                        setReceiptsDateMode('today'); setSelectedReceiptIds([]);
                      }}
                      className={\`h-8 px-6 text-[11px] font-bold rounded border transition-colors cursor-pointer \${receiptsDateMode === 'today' ? 'bg-black border-black text-white hover:bg-neutral-850' : 'bg-[#21262d] text-[#c9d1d9] border-[#30363d] hover:bg-[#30363d]'}\`}
                    >
                      Todays Bills
                    </button>
                  )}

                  <div className="flex items-center gap-2 ml-2">
                    <input
                      type="checkbox"
                      className="w-3 h-3 accent-[#238636] cursor-pointer"
                      checked={paginatedOrders.length > 0 && paginatedOrders.every(o => selectedReceiptIds.includes(o.id))}
                      onChange={handleToggleSelectAll}
                    />
                    <span className="text-[11px] font-bold text-[#c9d1d9] select-none cursor-pointer" onClick={handleToggleSelectAll}>Select All</span>
                  </div>

                  <input
                    type="text"
                    placeholder="Search"
                    value={receiptSearchQuery}
                    onChange={(e) => setReceiptSearchQuery(e.target.value)}
                    className="h-8 w-48 ml-2 bg-[#0d1117] border border-[#30363d] rounded px-3 text-[11px] text-[#c9d1d9] outline-none focus:border-[#238636]"
                  />

                  {checkReceiptsPermission('date_filter') !== false && (
                    <div className="relative">
                      <button
                        onClick={handleOpenDatePicker}
                        className="h-8 px-3 bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] rounded text-[11px] font-medium border border-[#30363d] flex items-center gap-2 cursor-pointer transition-all duration-200"
                      >
                        <Calendar size={13} className="text-[#8b949e]" />
                        <span>{\`\${formatReceiptDate(receiptsStartDate)} - \${formatReceiptDate(receiptsEndDate)}\`}</span>
                        <ChevronDown size={11} className="text-[#8b949e]" />
                      </button>`,
  "16a. Receipts Date Filters start"
);

// 16b. Receipts Date Filters end
replaceExactlyOnce(
`                          <div className="flex justify-end gap-2 mt-2">
                            <button
                              onClick={() => setIsDatePickerOpen(false)}
                              className="px-3 py-1.5 bg-black border border-black text-white rounded text-[11px] font-bold hover:bg-neutral-800"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => { handleApplyDateRange(); setSelectedReceiptIds([]); }}
                              className="px-3 py-1.5 bg-black border border-black hover:bg-neutral-800 text-white rounded text-[11px] font-bold"
                            >
                              Apply Range
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>`,
`                          <div className="flex justify-end gap-2 mt-2">
                            <button
                              onClick={() => setIsDatePickerOpen(false)}
                              className="px-3 py-1.5 bg-black border border-black text-white rounded text-[11px] font-bold hover:bg-neutral-800"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => { handleApplyDateRange(); setSelectedReceiptIds([]); }}
                              className="px-3 py-1.5 bg-black border border-black hover:bg-neutral-800 text-white rounded text-[11px] font-bold"
                            >
                              Apply Range
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  )}`,
  "16b. Receipts Date Filters end"
);

// 17. Receipts Table Column Headers
replaceExactlyOnce(
`                        <th className="px-6 py-3.5 w-28 min-w-[110px] select-none text-left">Waiter</th>
                        <th className="px-6 py-3.5 w-28 min-w-[110px] select-none text-left">Cashier</th>
                        <th className="px-6 py-3.5 w-28 min-w-[100px] select-none text-right">Subtotal</th>
                        <th className="px-6 py-3.5 w-28 min-w-[100px] select-none text-right">Discount</th>
                        <th className="px-6 py-3.5 w-24 min-w-[90px] select-none text-right">CGST</th>
                        <th className="px-6 py-3.5 w-24 min-w-[90px] select-none text-right">SGST</th>
                        <th className="px-6 py-3.5 w-32 min-w-[120px] select-none text-right">Service Chg</th>
                        <th className="px-6 py-3.5 w-32 min-w-[120px] select-none text-right">Delivery Chg</th>
                        <th className="px-6 py-3.5 w-24 min-w-[90px] select-none text-right">Tips</th>
                        <th
                          onClick={() => handleSort('value')}
                          className="px-6 py-3.5 w-28 min-w-[110px] cursor-pointer select-none hover:bg-slate-200 dark:hover:bg-[#21262d] transition-colors text-right"
                        >
                          <div className="flex items-center justify-end gap-1">
                            <span>Net Amount</span>
                            {receiptsSortField === 'value' && (
                              <span className="text-[#18ba60] text-[8px]">{receiptsSortDirection === 'asc' ? '▲' : '▼'}</span>
                            )}
                          </div>
                        </th>`,
`                        <th className="px-6 py-3.5 w-28 min-w-[110px] select-none text-left">Waiter</th>
                        <th className="px-6 py-3.5 w-28 min-w-[110px] select-none text-left">Cashier</th>
                        {checkReceiptsPermission('show_bill_amount') !== false && (
                          <th className="px-6 py-3.5 w-28 min-w-[100px] select-none text-right">Subtotal</th>
                        )}
                        <th className="px-6 py-3.5 w-28 min-w-[100px] select-none text-right">Discount</th>
                        <th className="px-6 py-3.5 w-24 min-w-[90px] select-none text-right">CGST</th>
                        <th className="px-6 py-3.5 w-24 min-w-[90px] select-none text-right">SGST</th>
                        <th className="px-6 py-3.5 w-32 min-w-[120px] select-none text-right">Service Chg</th>
                        <th className="px-6 py-3.5 w-32 min-w-[120px] select-none text-right">Delivery Chg</th>
                        {checkReceiptsPermission('tip_amount') !== false && (
                          <th className="px-6 py-3.5 w-24 min-w-[90px] select-none text-right">Tips</th>
                        )}
                        {checkReceiptsPermission('net_sale_amount') !== false && (
                          <th
                            onClick={() => handleSort('value')}
                            className="px-6 py-3.5 w-28 min-w-[110px] cursor-pointer select-none hover:bg-slate-200 dark:hover:bg-[#21262d] transition-colors text-right"
                          >
                            <div className="flex items-center justify-end gap-1">
                              <span>Net Amount</span>
                              {receiptsSortField === 'value' && (
                                <span className="text-[#18ba60] text-[8px]">{receiptsSortDirection === 'asc' ? '▲' : '▼'}</span>
                              )}
                            </div>
                          </th>
                        )}`,
  "17. Receipts Table Column Headers"
);

// 18. Receipts Table Cells
replaceExactlyOnce(
`                            <td className="px-6 py-3.5 text-right">
                              {(() => {
                                const sub = parseFloat(o.subtotal || 0) > 0
                                  ? parseFloat(o.subtotal)
                                  : (Array.isArray(o.items) ? o.items : (typeof o.items === 'string' ? JSON.parse(o.items || '[]') : [])).reduce((sum, item) =>
                                      sum + (parseFloat(item.price || 0) + (item.modifiers || []).reduce((ma, m) => ma + parseFloat(m.price || 0), 0)) * parseFloat(item.qty || item.quantity || 1), 0);
                                return sub.toFixed(2);
                              })()}
                            </td>
                            <td className={\`px-6 py-3.5 text-right \${isSelected ? 'text-amber-300' : 'text-amber-500'}\`}>
                              {parseFloat(o.discountAmt || 0).toFixed(2)}
                            </td>
                            <td className={\`px-6 py-3.5 text-right \${isSelected ? 'text-white/80' : 'text-[#8b949e]'}\`}>
                              {parseFloat(o.tax_cgst || 0).toFixed(2)}
                            </td>
                            <td className={\`px-6 py-3.5 text-right \${isSelected ? 'text-white/80' : 'text-[#8b949e]'}\`}>
                              {parseFloat(o.tax_sgst || 0).toFixed(2)}
                            </td>
                            <td className="px-6 py-3.5 text-right">{parseFloat(o.service_charge || 0).toFixed(2)}</td>
                            <td className="px-6 py-3.5 text-right">{parseFloat(o.delivery_charge || o.delivery_charges || 0).toFixed(2)}</td>
                            <td className="px-6 py-3.5 text-right">{parseFloat(o.tips || 0).toFixed(2)}</td>
                            <td className={\`px-6 py-3.5 text-right font-bold \${isSelected ? 'text-white' : (isDark ? 'text-white' : 'text-slate-900')}\`}>
                              {parseFloat(o.total_price || 0).toFixed(2)}
                            </td>`,
`                            {checkReceiptsPermission('show_bill_amount') !== false && (
                              <td className="px-6 py-3.5 text-right">
                                {(() => {
                                  const sub = parseFloat(o.subtotal || 0) > 0
                                    ? parseFloat(o.subtotal)
                                    : (Array.isArray(o.items) ? o.items : (typeof o.items === 'string' ? JSON.parse(o.items || '[]') : [])).reduce((sum, item) =>
                                        sum + (parseFloat(item.price || 0) + (item.modifiers || []).reduce((ma, m) => ma + parseFloat(m.price || 0), 0)) * parseFloat(item.qty || item.quantity || 1), 0);
                                  return sub.toFixed(2);
                                })()}
                              </td>
                            )}
                            <td className={\`px-6 py-3.5 text-right \${isSelected ? 'text-amber-300' : 'text-amber-500'}\`}>
                              {parseFloat(o.discountAmt || 0).toFixed(2)}
                            </td>
                            <td className={\`px-6 py-3.5 text-right \${isSelected ? 'text-white/80' : 'text-[#8b949e]'}\`}>
                              {parseFloat(o.tax_cgst || 0).toFixed(2)}
                            </td>
                            <td className={\`px-6 py-3.5 text-right \${isSelected ? 'text-white/80' : 'text-[#8b949e]'}\`}>
                              {parseFloat(o.tax_sgst || 0).toFixed(2)}
                            </td>
                            <td className="px-6 py-3.5 text-right">{parseFloat(o.service_charge || 0).toFixed(2)}</td>
                            <td className="px-6 py-3.5 text-right">{parseFloat(o.delivery_charge || o.delivery_charges || 0).toFixed(2)}</td>
                            {checkReceiptsPermission('tip_amount') !== false && (
                              <td className="px-6 py-3.5 text-right">{parseFloat(o.tips || 0).toFixed(2)}</td>
                            )}
                            {checkReceiptsPermission('net_sale_amount') !== false && (
                              <td className={\`px-6 py-3.5 text-right font-bold \${isSelected ? 'text-white' : (isDark ? 'text-white' : 'text-slate-900')}\`}>
                                {parseFloat(o.total_price || 0).toFixed(2)}
                              </td>
                            )}`,
  "18. Receipts Table Cells"
);

// 19. Receipts Summary Strip Gating
replaceExactlyOnce(
`                {/* Summary Strip */}
                <div className="h-10 border-t border-b border-[#30363d] flex items-center justify-between px-4 shrink-0 bg-[#161b22] text-[11px] font-bold text-[#c9d1d9]">
                  <div className="flex items-center gap-2">
                    <span>Shown Bills Amount ({paginatedOrders.length}) : {config.currency} {paginatedTotal.toFixed(2)}</span>
                  </div>
                  <span>Net Sale Amount : {config.currency} {filteredTotal.toFixed(2)}</span>
                  <span>Total fulfilled amount : {config.currency} {filteredTotal.toFixed(2)}</span>
                </div>`,
`                {/* Summary Strip */}
                <div className="h-10 border-t border-b border-[#30363d] flex items-center justify-between px-4 shrink-0 bg-[#161b22] text-[11px] font-bold text-[#c9d1d9]">
                  <div className="flex items-center gap-2">
                    {checkReceiptsPermission('all_bills_amount') !== false && (
                      <span>Shown Bills Amount ({paginatedOrders.length}) : {config.currency} {paginatedTotal.toFixed(2)}</span>
                    )}
                  </div>
                  {checkReceiptsPermission('net_sale_amount') !== false && (
                    <span>Net Sale Amount : {config.currency} {filteredTotal.toFixed(2)}</span>
                  )}
                  {checkReceiptsPermission('total_fulfilled_amount') !== false && (
                    <span>Total fulfilled amount : {config.currency} {filteredTotal.toFixed(2)}</span>
                  )}
                </div>`,
  "19. Receipts Summary Strip Gating"
);

// 20a. Store Settings
replaceExactlyOnce(
`                  {/* Left Filters Sidebar */}
                  <div className="w-60 bg-[#161b22] border-r border-[#30363d] flex flex-col p-4 shrink-0 overflow-y-auto no-scrollbar">
                    <button className="w-full py-2.5 mb-6 bg-[#0c1015] border border-[#30363d] text-white text-[10px] font-black uppercase italic rounded-lg tracking-wider hover:border-[#10ac84] hover:text-[#10ac84] transition-all">
                      Store Settings
                    </button>`,
`                  {/* Left Filters Sidebar */}
                  <div className="w-60 bg-[#161b22] border-r border-[#30363d] flex flex-col p-4 shrink-0 overflow-y-auto no-scrollbar">
                    {getStaffPermissions()?.pos_access?.OnlineOrder?.StoreSettings?.visible !== false && (
                      <button className="w-full py-2.5 mb-6 bg-[#0c1015] border border-[#30363d] text-white text-[10px] font-black uppercase italic rounded-lg tracking-wider hover:border-[#10ac84] hover:text-[#10ac84] transition-all">
                        Store Settings
                      </button>
                    )}`,
  "20a. Store Settings"
);

// 20b. Online Orders print buttons
replaceExactlyOnce(
`                              <button
                                onClick={() => handlePrintKOT(orderItems, order.table_number || 'Digital', order.bill_no)}
                                className="flex-1 py-2 bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] border border-[#30363d] rounded-lg text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer"
                              >
                                Print KOT
                              </button>
                              <button
                                onClick={() => handlePrint(order)}
                                className="flex-1 py-2 bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] border border-[#30363d] rounded-lg text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer"
                              >
                                Print Bill
                              </button>`,
`                              {getStaffPermissions()?.pos_access?.OnlineOrder?.kot_print !== false && (
                                <button
                                  onClick={() => handlePrintKOT(orderItems, order.table_number || 'Digital', order.bill_no)}
                                  className="flex-1 py-2 bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] border border-[#30363d] rounded-lg text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer"
                                >
                                  Print KOT
                                </button>
                              )}
                              {getStaffPermissions()?.pos_access?.OnlineOrder?.print_bill !== false && (
                                <button
                                  onClick={() => handlePrint(order)}
                                  className="flex-1 py-2 bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] border border-[#30363d] rounded-lg text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer"
                                >
                                  Print Bill
                                </button>
                              )}`,
  "20b. Online Orders print buttons"
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('🎉 All modifications applied successfully!');
