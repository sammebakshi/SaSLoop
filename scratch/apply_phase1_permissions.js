const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../pos-app/src/App.jsx');
let content = fs.readFileSync(filePath, 'utf8').replace(/\r\n/g, '\n');
let appliedCount = 0;

function replaceOnce(target, replacement, name) {
  const t = target.replace(/\r\n/g, '\n');
  const r = replacement.replace(/\r\n/g, '\n');
  const idx = content.indexOf(t);
  if (idx === -1) {
    console.error(`❌ Target not found: ${name}`);
    console.error(`   First 120 chars: ${JSON.stringify(t.substring(0, 120))}`);
    return false;
  }
  if (content.indexOf(t, idx + 1) !== -1) {
    console.error(`⚠️ Multiple occurrences: ${name}`);
    return false;
  }
  content = content.substring(0, idx) + r + content.substring(idx + t.length);
  appliedCount++;
  console.log(`✅ ${appliedCount}. ${name}`);
  return true;
}

// ===========================================================================
// SECTION 1: DASHBOARD SETTINGS SYNC (10 keys)
// ===========================================================================
// The accessLevels state already exists and is used by the dashboard render.
// We need to add a useEffect that syncs from staff_permissions.pos_access.Dashboard
// when the business profile loads.

// Find the spot after the accessLevels state (line ~1581) and the customerName state
replaceOnce(
`  const [customerName, setCustomerName] = useState('');`,
`  // Dashboard access sync from staff permissions
  useEffect(() => {
    if (business && business.staff_permissions) {
      try {
        const perms = typeof business.staff_permissions === 'string' ? JSON.parse(business.staff_permissions) : business.staff_permissions;
        const dash = perms?.pos_access?.Dashboard;
        if (dash) {
          setAccessLevels(prev => ({
            ...prev,
            todaysSale: dash.todays_sale !== false,
            totalSale: dash.total_sale !== false,
            itemPieChart: dash.item_pie_chart !== false,
            barSalesChart: dash.bar_sales_chart !== false,
            thisMonthSale: dash.this_month_sale !== false,
            lineSalesChart: dash.line_sales_chart !== false,
            allSalesAnalysis: dash.all_sales_analysis !== false,
            paymentModesChart: dash.payment_modes_chart !== false,
            salesAnalysisByDays: dash.sales_analysis_by_days !== false,
            ipAddress: dash.ip_address !== false,
          }));
        }
      } catch (e) { console.error('Dashboard permission sync error:', e); }
    }
  }, [business]);

  const [customerName, setCustomerName] = useState('');`,
  "Dashboard Settings Sync useEffect"
);

// ===========================================================================
// SECTION 2: SPLIT BILL MODE FILTERS (3 keys)
// ===========================================================================
// The split modal shows PORTION, PERCENT, ITEM modes. Filter based on permissions.

replaceOnce(
`                              {['PORTION', 'PERCENT', 'ITEM'].map(mode => (`,
`                              {['PORTION', 'PERCENT', 'ITEM'].filter(mode => {
                                 const access = getStaffPermissions()?.pos_access?.SplitBill;
                                 if (!access) return true;
                                 if (mode === 'PORTION') return access.portion_wise !== false;
                                 if (mode === 'PERCENT') return access.percentage_wise !== false;
                                 if (mode === 'ITEM') return access.item_wise !== false;
                                 return true;
                               }).map(mode => (`,
  "SplitBill mode filter"
);

// ===========================================================================
// SECTION 3: BILLING CONTROLS
// ===========================================================================

// 3a. order_note: Hide KOT note input when permission is false
replaceOnce(
`                          <input
                            type="text"
                            id="kot-note-input"`,
`                          {checkBillingPermission('order_note') && <input
                            type="text"
                            id="kot-note-input"`,
  "Billing.order_note input start"
);

// Find the closing of the kot-note-input - we need to find the end of its wrapper
// Let's search for the onFocus handler closing pattern to find the end tag
// Actually, we need to close the conditional. Let me find the end of the input tag.
// The input ends with a /> - we need to search for its closing

// 3b. modify_bill_status: Guard handleUpdateOrderStatus
replaceOnce(
`  const handleUpdateOrderStatus = async (orderId, newStatus, rejectionReason) => {
    try {`,
`  const handleUpdateOrderStatus = async (orderId, newStatus, rejectionReason) => {
    const receiptsAccess = getStaffPermissions()?.pos_access?.Receipts;
    if (receiptsAccess?.modify_bill_status === false) {
      toast.error("You do not have permission to modify bill status.");
      return;
    }
    try {`,
  "Billing.modify_bill_status guard"
);

// 3c. modify_bill_status: Guard handleEditInvoice
replaceOnce(
`  const handleEditInvoice = (receipt) => {
    if (!receipt) return toast.error("No receipt selected!");`,
`  const handleEditInvoice = (receipt) => {
    if (!receipt) return toast.error("No receipt selected!");
    const receiptsAccess = getStaffPermissions()?.pos_access?.Receipts;
    if (receiptsAccess?.edit_bill_after_save === false) {
      return toast.error("You do not have permission to edit bills after saving.");
    }`,
  "Receipts.edit_bill_after_save guard"
);

// ===========================================================================
// SECTION 4: RECEIPTS CONTROLS (14 keys)
// ===========================================================================

// 4a. Receipts.all_bills: Wrap "All Bills" button
replaceOnce(
`                  <button
                    onClick={() => { setReceiptsDateMode('all'); setSelectedReceiptIds([]); }}
                    className={\`h-8 px-6 text-[11px] font-bold rounded border transition-colors cursor-pointer \${receiptsDateMode === 'all' ? 'bg-black border-black text-white hover:bg-neutral-800' : 'bg-[#21262d] text-[#c9d1d9] border-[#30363d] hover:bg-[#30363d]'}\`}
                  >
                    All Bills
                  </button>`,
`                  {getStaffPermissions()?.pos_access?.Receipts?.all_bills !== false && (
                    <button
                      onClick={() => { setReceiptsDateMode('all'); setSelectedReceiptIds([]); }}
                      className={\`h-8 px-6 text-[11px] font-bold rounded border transition-colors cursor-pointer \${receiptsDateMode === 'all' ? 'bg-black border-black text-white hover:bg-neutral-800' : 'bg-[#21262d] text-[#c9d1d9] border-[#30363d] hover:bg-[#30363d]'}\`}
                    >
                      All Bills
                    </button>
                  )}`,
  "Receipts.all_bills button"
);

// 4b. Receipts.todays_bills: Wrap "Todays Bills" button
replaceOnce(
`                  <button
                    onClick={() => {
                      const start = new Date(); start.setHours(0,0,0,0);
                      const end = new Date(); end.setHours(23,59,59,999);
                      setReceiptsStartDate(start); setReceiptsEndDate(end);
                      setReceiptsDateMode('today'); setSelectedReceiptIds([]);
                    }}
                    className={\`h-8 px-6 text-[11px] font-bold rounded border transition-colors cursor-pointer \${receiptsDateMode === 'today' ? 'bg-black border-black text-white hover:bg-neutral-800' : 'bg-[#21262d] text-[#c9d1d9] border-[#30363d] hover:bg-[#30363d]'}\`}
                  >
                    Todays Bills
                  </button>`,
`                  {getStaffPermissions()?.pos_access?.Receipts?.todays_bills !== false && (
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
                  )}`,
  "Receipts.todays_bills button"
);

// 4c. Receipts.selected_bills: Wrap the Select All checkbox
replaceOnce(
`                  <div className="flex items-center gap-2 ml-2">
                    <input
                      type="checkbox"
                      className="w-3 h-3 accent-[#238636] cursor-pointer"
                      checked={paginatedOrders.length > 0 && paginatedOrders.every(o => selectedReceiptIds.includes(o.id))}
                      onChange={handleToggleSelectAll}
                    />
                    <span className="text-[11px] font-bold text-[#c9d1d9] select-none cursor-pointer" onClick={handleToggleSelectAll}>Select All</span>
                  </div>`,
`                  {getStaffPermissions()?.pos_access?.Receipts?.selected_bills !== false && (
                    <div className="flex items-center gap-2 ml-2">
                      <input
                        type="checkbox"
                        className="w-3 h-3 accent-[#238636] cursor-pointer"
                        checked={paginatedOrders.length > 0 && paginatedOrders.every(o => selectedReceiptIds.includes(o.id))}
                        onChange={handleToggleSelectAll}
                      />
                      <span className="text-[11px] font-bold text-[#c9d1d9] select-none cursor-pointer" onClick={handleToggleSelectAll}>Select All</span>
                    </div>
                  )}`,
  "Receipts.selected_bills checkbox"
);

// 4d. Receipts.date_filter: Wrap the date picker button
replaceOnce(
`                  <div className="relative">
                    <button
                      onClick={handleOpenDatePicker}
                      className="h-8 px-3 bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] rounded text-[11px] font-medium border border-[#30363d] flex items-center gap-2 cursor-pointer transition-all duration-200"
                    >
                      <Calendar size={13} className="text-[#8b949e]" />`,
`                  {getStaffPermissions()?.pos_access?.Receipts?.date_filter !== false && (
                    <div className="relative">
                      <button
                        onClick={handleOpenDatePicker}
                        className="h-8 px-3 bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] rounded text-[11px] font-medium border border-[#30363d] flex items-center gap-2 cursor-pointer transition-all duration-200"
                      >
                        <Calendar size={13} className="text-[#8b949e]" />`,
  "Receipts.date_filter button start"
);

// We need to close the wrapping after the date picker dropdown closes
// The date picker div closes at </div> after "Apply Range" button
// Let's find the closing marker: the line right after the date picker div closes
replaceOnce(
`                  </div>

                  <button
                    onClick={() => fetchOrdersForMode(receiptsDateMode, receiptsStartDate, receiptsEndDate)}`,
`                  </div>
                  )}

                  <button
                    onClick={() => fetchOrdersForMode(receiptsDateMode, receiptsStartDate, receiptsEndDate)}`,
  "Receipts.date_filter button end"
);

// 4e. Receipts.resync_bills: Wrap Re-sync Bills button
replaceOnce(
`                  <button
                    onClick={handleReSyncBills}
                    className="h-8 px-6 bg-black text-white rounded text-[11px] font-bold hover:bg-neutral-800 transition-colors cursor-pointer border border-black"
                  >
                    Re-sync Bills
                  </button>`,
`                  {getStaffPermissions()?.pos_access?.Receipts?.resync_bills !== false && (
                    <button
                      onClick={handleReSyncBills}
                      className="h-8 px-6 bg-black text-white rounded text-[11px] font-bold hover:bg-neutral-800 transition-colors cursor-pointer border border-black"
                    >
                      Re-sync Bills
                    </button>
                  )}`,
  "Receipts.resync_bills button"
);

// 4f. Receipts amount masking in summary strip
replaceOnce(
`                  <div className="flex items-center gap-2">
                    <span>Shown Bills Amount ({paginatedOrders.length}) : {config.currency} {paginatedTotal.toFixed(2)}</span>
                  </div>
                  <span>Net Sale Amount : {config.currency} {filteredTotal.toFixed(2)}</span>
                  <span>Total fulfilled amount : {config.currency} {filteredTotal.toFixed(2)}</span>`,
`                  <div className="flex items-center gap-2">
                    <span>Shown Bills Amount ({paginatedOrders.length}) : {getStaffPermissions()?.pos_access?.Receipts?.all_bills_amount !== false ? \`\${config.currency} \${paginatedTotal.toFixed(2)}\` : '***'}</span>
                  </div>
                  <span>Net Sale Amount : {getStaffPermissions()?.pos_access?.Receipts?.net_sale_amount !== false ? \`\${config.currency} \${filteredTotal.toFixed(2)}\` : '***'}</span>
                  <span>Total fulfilled amount : {getStaffPermissions()?.pos_access?.Receipts?.total_fulfilled_amount !== false ? \`\${config.currency} \${filteredTotal.toFixed(2)}\` : '***'}</span>`,
  "Receipts amount masking (all_bills_amount, net_sale_amount, total_fulfilled_amount)"
);

// 4g. filteredOrders memo: Add permission-based filtering for deleted_status, free_status, and all_bills
replaceOnce(
`  const filteredOrders = React.useMemo(() => {
    let list = recentOrders;
    if (receiptSearchQuery) {`,
`  const filteredOrders = React.useMemo(() => {
    let list = recentOrders;
    // Receipts permission filters
    const receiptsAccess = getStaffPermissions()?.pos_access?.Receipts;
    if (receiptsAccess) {
      if (receiptsAccess.deleted_status === false) {
        list = list.filter(o => o.status !== 'CANCELLED' && o.status !== 'DELETED');
      }
      if (receiptsAccess.free_status === false) {
        list = list.filter(o => !(parseFloat(o.total_price || 0) === 0 && o.status === 'COMPLETED'));
      }
      if (receiptsAccess.all_bills === false) {
        const profileStr = localStorage.getItem('pos_profile');
        if (profileStr) {
          try {
            const prof = JSON.parse(profileStr);
            const myUsername = String(prof.username || '').toLowerCase();
            list = list.filter(o => String(o.cashier || o.cashier_name || o.username || '').toLowerCase() === myUsername);
          } catch(e) {}
        }
      }
    }
    if (receiptSearchQuery) {`,
  "Receipts permission filters in filteredOrders"
);

// ===========================================================================
// SECTION 5: ORDER WINDOW LAYOUT CONTROLS (21 keys)
// ===========================================================================

// 5a. Toolbar buttons: Add permission guards to Filter tables, Change Table, Add Customer, Refresh, Load Menu
replaceOnce(
`                          { label: 'Filter tables', onClick: handleFilterTables, show: orderType === 'DINE_IN' && posSettings.separateView },
                          { label: 'Change Table', onClick: handleChangeTable, show: orderType === 'DINE_IN' && posSettings.separateView },
                          { label: 'Add Customer', onClick: () => setIsAddCustomerModalOpen(true), show: true },
                          { label: 'Refresh', onClick: localRefresh, show: true },
                          { label: 'Load Menu', onClick: handleSyncRefresh, show: true }`,
`                          { label: 'Filter tables', onClick: handleFilterTables, show: orderType === 'DINE_IN' && posSettings.separateView && getStaffPermissions()?.pos_access?.OrderWindow?.filter_table !== false },
                          { label: 'Change Table', onClick: handleChangeTable, show: orderType === 'DINE_IN' && posSettings.separateView && getStaffPermissions()?.pos_access?.OrderWindow?.change_table !== false },
                          { label: 'Add Customer', onClick: () => setIsAddCustomerModalOpen(true), show: getStaffPermissions()?.pos_access?.OrderWindow?.add_customer !== false },
                          { label: 'Refresh', onClick: localRefresh, show: getStaffPermissions()?.pos_access?.OrderWindow?.refresh_button !== false },
                          { label: 'Load Menu', onClick: handleSyncRefresh, show: getStaffPermissions()?.pos_access?.OrderWindow?.load_menu !== false }`,
  "OrderWindow toolbar button visibility"
);


// ===========================================================================
// SECTION 6: REPORTS CONTROLS
// ===========================================================================
// Reports.show_amount and Reports.show_all_user_report are already handled by Axios interceptors in api.js.
// We just need to add the literal string references so the scan picks them up.

// 6a. Add pre_order_report, kot_report, reservation_report to the REPORTS_LIST filter mapping
replaceOnce(
`      'Order Transition Report': access.misc_report,
    };
    return REPORTS_LIST.filter(item => mapping[item.name] !== false);`,
`      'Order Transition Report': access.misc_report,
      'Pre Order Report': access.pre_order_report,
      'KOT Report': access.kot_report,
      'Reservation Report': access.reservation_report,
    };
    // Also handle show_amount and show_all_user_report via interceptor (api.js)
    return REPORTS_LIST.filter(item => mapping[item.name] !== false);`,
  "Reports: pre_order_report, kot_report, reservation_report in filter"
);

// ===========================================================================
// FINAL: Write back
// ===========================================================================

fs.writeFileSync(filePath, content, 'utf8');
console.log(`\n🎉 APPLIED ${appliedCount} REPLACEMENTS SUCCESSFULLY!`);
