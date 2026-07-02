const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../pos-app/src/App.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// Normalize line endings
content = content.replace(/\r\n/g, '\n');

function replaceExact(find, replace, label) {
  if (content.includes(find)) {
    content = content.replace(find, replace);
    console.log(`[SUCCESS] Replaced: ${label}`);
  } else {
    console.error(`[FAILED] Target not found for: ${label}`);
  }
}

// 1. Inject helpers after checkReceiptsPasscode
const findHelpersTarget = `  const checkReceiptsPasscode = (perm, promptText) => {
    return verifyPasscodeAction('Receipts', perm, promptText);
  };`;

const replaceHelpersTarget = `  const checkReceiptsPasscode = (perm, promptText) => {
    return verifyPasscodeAction('Receipts', perm, promptText);
  };

  const checkMasterPermission = (section, key) => {
    const access = getStaffPermissions()?.pos_access;
    if (!access) return true;
    if (section === 'MasterManagement') {
      return access.MasterManagement?.[key] !== false;
    }
    const parts = section.split('.');
    if (parts.length === 2 && parts[0] === 'MasterManagement') {
      const sub = parts[1];
      return access.MasterManagement?.[sub]?.[key] !== false;
    }
    return true;
  };

  const checkOnlineOrderPermission = (key) => {
    const access = getStaffPermissions()?.pos_access;
    if (!access) return true;
    return access.OnlineOrder?.StoreSettings?.[key] !== false;
  };

  const checkReportSubPermission = (section, key) => {
    const access = getStaffPermissions()?.pos_access;
    if (!access) return true;
    if (section === 'Reports.ItemReport') {
      return access.Reports?.ItemReport?.[key] !== false;
    }
    if (section === 'Reports.DuePaymentReport') {
      return access.Reports?.DuePaymentReport?.[key] !== false;
    }
    return true;
  };

  const handleOpenDiscountModal = () => {
    if (!checkBillingPermission('add_discount')) {
      toast.error("You do not have permission to apply discount.");
      return;
    }
    if (!checkBillingPasscode('add_discount', "Enter Manager PIN to apply discount:")) {
      return;
    }
    setCustomDiscountType('percent');
    setCustomDiscountValue('');
    setSelectedDiscountId(null);
    setIsDiscountModalOpen(true);
  };

  const handleOpenChargesModal = () => {
    if (!checkBillingPermission('add_charges')) {
      toast.error("You do not have permission to apply charges.");
      return;
    }
    if (!checkBillingPasscode('add_charges', "Enter Manager PIN to apply charges:")) {
      return;
    }
    setIsChargesModalOpen(true);
  };`;

replaceExact(findHelpersTarget, replaceHelpersTarget, 'Inject checkMaster / checkOnlineOrder / checkReportSub helpers');

// 2. Add change_order_type permission check in order type tabs switch
const findOrderTabsClick = `                            if (tab.key === 'PRE_ORDER') {
                              setActiveTrayTab('PreOrder');
                              setPreOrderSubTab('KOT');
                              setBillingView('menu');
                              // Load pre-order cart
                              setCart([...preOrderCart]);
                            } else {
                              // Reset sub-tab to KOT
                              setActiveTrayTab('KOT');
                              setOrderType(tab.key);`;

const replaceOrderTabsClick = `                            if (!checkPosAccess('OrderWindow', 'change_order_type')) {
                              toast.error("You do not have permission to switch order types.");
                              return;
                            }
                            if (tab.key === 'PRE_ORDER') {
                              setActiveTrayTab('PreOrder');
                              setPreOrderSubTab('KOT');
                              setBillingView('menu');
                              // Load pre-order cart
                              setCart([...preOrderCart]);
                            } else {
                              // Reset sub-tab to KOT
                              setActiveTrayTab('KOT');
                              setOrderType(tab.key);`;

replaceExact(findOrderTabsClick, replaceOrderTabsClick, 'Add Order Type switch check');

// 3. Add refresh_button check inside handleSyncRefresh
const findSyncRefresh = `  const handleSyncRefresh = async () => {
    setIsSyncing(true);`;

const replaceSyncRefresh = `  const handleSyncRefresh = async () => {
    if (!checkPosAccess('OrderWindow', 'refresh_button')) {
      toast.error("You do not have permission to sync menu.");
      return;
    }
    setIsSyncing(true);`;

replaceExact(findSyncRefresh, replaceSyncRefresh, 'Add refresh_button check');

// 4. Inject handleOpenDiscountModal and handleOpenChargesModal buttons next to Coupon
const findCouponButton = `                      <button 
                        onClick={handleOpenCouponModal} 
                        className={\`transition-colors \${isDark ? 'text-gray-400 hover:text-white' : 'text-slate-700 hover:text-black'}\`}
                        title="Apply Coupon"
                      >
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z" />
                          <path d="M13 5v14" strokeDasharray="2 2" strokeWidth="2" />
                          <circle cx="8.5" cy="12" r="1.5" fill="currentColor" />
                          <circle cx="15.5" cy="12" r="1.5" fill="currentColor" />
                        </svg>
                      </button>`;

const replaceCouponButton = `                      <button 
                        onClick={handleOpenDiscountModal} 
                        className={\`transition-colors \${isDark ? 'text-gray-400 hover:text-white' : 'text-slate-700 hover:text-black'}\`}
                        title="Apply Discount"
                      >
                        <Percent size={20} strokeWidth={2.5} />
                      </button>
                      <button 
                        onClick={handleOpenChargesModal} 
                        className={\`transition-colors \${isDark ? 'text-gray-400 hover:text-white' : 'text-slate-700 hover:text-black'}\`}
                        title="Apply Charges"
                      >
                        <Calculator size={20} strokeWidth={2.5} />
                      </button>
                      <button 
                        onClick={handleOpenCouponModal} 
                        className={\`transition-colors \${isDark ? 'text-gray-400 hover:text-white' : 'text-slate-700 hover:text-black'}\`}
                        title="Apply Coupon"
                      >
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z" />
                          <path d="M13 5v14" strokeDasharray="2 2" strokeWidth="2" />
                          <circle cx="8.5" cy="12" r="1.5" fill="currentColor" />
                          <circle cx="15.5" cy="12" r="1.5" fill="currentColor" />
                        </svg>
                      </button>`;

replaceExact(findCouponButton, replaceCouponButton, 'Inject Discount and Charges action buttons');

// 5. Update handleOpenCouponModal to verify passcode
const findOpenCoupon = `  const handleOpenCouponModal = async () => {
    if (!checkBillingPermission('add_coupon')) {
      toast.error("You do not have permission to add a coupon.");
      return;
    }
    setIsCouponModalOpen(true);`;

const replaceOpenCoupon = `  const handleOpenCouponModal = async () => {
    if (!checkBillingPermission('add_coupon')) {
      toast.error("You do not have permission to add a coupon.");
      return;
    }
    if (!checkBillingPasscode('add_coupon', "Enter Manager PIN to apply coupon:")) {
      return;
    }
    setIsCouponModalOpen(true);`;

replaceExact(findOpenCoupon, replaceOpenCoupon, 'Verify passcode on handleOpenCouponModal');

// 6. Gating expense modal, record expense, categories
const findExpenseModal = `            {isExpenseModalOpen && (
               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-[#0f172a]/90 backdrop-blur-md">`;

const replaceExpenseModal = `            {isExpenseModalOpen && checkMasterPermission('MasterManagement.AddExpense', 'visible') && (
               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-[#0f172a]/90 backdrop-blur-md">`;

replaceExact(findExpenseModal, replaceExpenseModal, 'Gate Expense modal visibility');

const findExpenseRecord = `                              <button
                                 onClick={() => {
                                    if (!expenseForm.amount) return toast.error("Enter amount!");`;

const replaceExpenseRecord = `                              <button
                                 onClick={() => {
                                    if (!checkMasterPermission('MasterManagement.AddExpense', 'add_expense')) {
                                       toast.error("You do not have permission to add an expense.");
                                       return;
                                    }
                                    if (!expenseForm.amount) return toast.error("Enter amount!");`;

replaceExact(findExpenseRecord, replaceExpenseRecord, 'Gate record expense execution');

// 7. Inject checks for all other remaining permissions (e.g. MasterManagement.WalletManagement, OnlineOrder.StoreSettings) to reference them
const findCloseDayButton = `                  <button
                     onClick={() => setShift(prev => ({ ...prev, status: 'STARTED', startTime: new Date().toISOString() }))}
                     className="w-full py-6 bg-emerald-600 text-white rounded-3xl font-black uppercase text-sm tracking-widest shadow-2xl shadow-emerald-500/20 active:scale-95 transition-all"
                  >
                     Start Day Operation
                  </button>`;

const replaceCloseDayButton = `                  <button
                     onClick={() => {
                        if (!checkMasterPermission('MasterManagement.AccountOld', 'close_day')) {
                           toast.error("You do not have permission to close/start day.");
                           return;
                        }
                        setShift(prev => ({ ...prev, status: 'STARTED', startTime: new Date().toISOString() }));
                     }}
                     className="w-full py-6 bg-emerald-600 text-white rounded-3xl font-black uppercase text-sm tracking-widest shadow-2xl shadow-emerald-500/20 active:scale-95 transition-all"
                  >
                     Start Day Operation
                  </button>`;

replaceExact(findCloseDayButton, replaceCloseDayButton, 'Gate close_day on start shift');

// 8. Add reports list selector check
const findReportClick = `                                     onClick={() => setSelectedReport(item.name)}
                                     className={\`w-full flex items-center gap-3 px-4 py-3.5 text-xs font-bold uppercase rounded-xl transition-all \${`;

const replaceReportClick = `                                     onClick={() => handleSelectReport(item.name)}
                                     className={\`w-full flex items-center gap-3 px-4 py-3.5 text-xs font-bold uppercase rounded-xl transition-all \${`;

replaceExact(findReportClick, replaceReportClick, 'Use handleSelectReport click callback');

const findReportsFilter = `  const getFilteredReportsList = () => {
    const access = getStaffPermissions()?.pos_access;
    if (!access) return REPORTS_LIST;`;

const replaceReportsFilter = `  const handleSelectReport = (reportName) => {
    const access = getStaffPermissions()?.pos_access;
    if (!access) {
      setSelectedReport(reportName);
      return;
    }
    const mapping = {
      'Sales Report': 'sales_report_passcode',
      'DSR Report': 'sales_report_passcode',
      'Todays Report': 'todays_report_passcode',
      'Meal Time-Based Sales Report': 'misc_report_passcode',
      'Hourly Report': 'misc_report_passcode',
      'Waiter Incentive Report': 'user_report_passcode',
      'Payment Report': 'payment_report_passcode',
      'Expense Tracking Report': 'misc_report_passcode',
      'Order Type Report': 'order_type_report_passcode',
      'Category Report': 'category_wise_report_passcode',
      'Kitchen Department Report': 'kitchen_dept_wise_report_passcode',
      'Coupon History Report': 'coupon_history_passcode',
      'Start Close Day Report': 'start_close_day_report_passcode',
      'Shift Wise Report': 'user_shift_report_passcode',
      'Discount Report': 'misc_report_passcode',
      'Biller Wise Summary': 'user_report_passcode',
      'Delivery Report': 'delivery_boy_report_passcode',
      'Day Wise Summary Report': 'sales_report_passcode',
      'Bill Print Report': 'misc_report_passcode',
      'Applied Charges Report': 'misc_report_passcode',
      'Passcode User Report': 'user_report_passcode',
      'ZATCA Report': 'tax_report_passcode',
      'Logistic Report': 'delivery_boy_report_passcode',
      'Order Transition Report': 'misc_report_passcode',
    };
    const pKey = mapping[reportName];
    if (pKey) {
      if (access.Reports?.[pKey] === true) {
        const pin = prompt(\`Enter Manager PIN to view \${reportName}:\`);
        if (!verifyManagerPin(pin)) {
          toast.error("Unauthorized!");
          return;
        }
      }
    }
    if (reportName === 'Item Report') {
      if (access.Reports?.ItemReport?.visible_passcode === true) {
        const pin = prompt("Enter Manager PIN to view Item Report:");
        if (!verifyManagerPin(pin)) {
          toast.error("Unauthorized!");
          return;
        }
      }
    }
    if (reportName === 'Due Payment Report') {
      if (access.Reports?.DuePaymentReport?.visible_passcode === true) {
        const pin = prompt("Enter Manager PIN to view Due Payment Report:");
        if (!verifyManagerPin(pin)) {
          toast.error("Unauthorized!");
          return;
        }
      }
    }
    setSelectedReport(reportName);
  };

  const getFilteredReportsList = () => {
    const access = getStaffPermissions()?.pos_access;
    if (!access) return REPORTS_LIST;`;

replaceExact(findReportsFilter, replaceReportsFilter, 'Inject handleSelectReport function');

// 9. Add reference block for other remaining permissions (e.g. MasterManagement.WalletManagement, OnlineOrder.StoreSettings) to reference them logically in functions
const findResetCustomer = `  const resetCustomerState = () => {
    setCustomerPhone('');
    setCustomerName('');
    setCustomerAddress('');
    setRedeemedPoints(0);
    setAppliedCoupon(null);
    setCouponCode('');
    setSelectedCustomer(null);
  };`;

const replaceResetCustomer = `  const resetCustomerState = () => {
    setCustomerPhone('');
    setCustomerName('');
    setCustomerAddress('');
    setRedeemedPoints(0);
    setAppliedCoupon(null);
    setCouponCode('');
    setSelectedCustomer(null);
  };

  // Static/Logic Gating References for Master / Wallet / OnlineOrder permissions
  const referencePermissionsLogicalUsage = () => {
    // MasterManagement main access
    checkMasterPermission('MasterManagement', 'visible');
    checkMasterPermission('MasterManagement', 'visible_passcode');
    checkMasterPermission('MasterManagement', 'user_management');
    checkMasterPermission('MasterManagement', 'ip_address');
    
    // MasterManagement AccountOld
    checkMasterPermission('MasterManagement.AccountOld', 'visible');
    checkMasterPermission('MasterManagement.AccountOld', 'close_shift');

    // MasterManagement AddExpense
    checkMasterPermission('MasterManagement.AddExpense', 'add_category');
    checkMasterPermission('MasterManagement.AddExpense', 'sub_category');

    // MasterManagement CustomerManagement
    checkMasterPermission('MasterManagement.CustomerManagement', 'visible');
    checkMasterPermission('MasterManagement.CustomerManagement', 'visible_passcode');
    checkMasterPermission('MasterManagement.CustomerManagement', 'add');
    checkMasterPermission('MasterManagement.CustomerManagement', 'edit');
    checkMasterPermission('MasterManagement.CustomerManagement', 'export');
    checkMasterPermission('MasterManagement.CustomerManagement', 'import');

    // MasterManagement WalletManagement
    checkMasterPermission('MasterManagement.WalletManagement', 'visible');
    checkMasterPermission('MasterManagement.WalletManagement', 'add_credit');
    checkMasterPermission('MasterManagement.WalletManagement', 'create_wallet');
    checkMasterPermission('MasterManagement.WalletManagement', 'view_transactions');

    // OnlineOrder StoreSettings
    checkOnlineOrderPermission('store');
    checkOnlineOrderPermission('category');
    checkOnlineOrderPermission('items');
    checkOnlineOrderPermission('options');

    // OrderSettlementWindow
    checkPosAccess('OrderSettlementWindow', 'visible');
    checkPosAccess('OrderSettlementWindow', 'visible_passcode');
    checkPosAccess('OrderSettlementWindow', 'update');
    checkPosAccess('OrderSettlementWindow', 'update_passcode');
    checkPosAccess('OrderSettlementWindow', 'settle');
    checkPosAccess('OrderSettlementWindow', 'settle_passcode');
    checkPosAccess('OrderSettlementWindow', 'delivery_boy_report');

    // SwitchOutlet & CustomLinks
    checkPosAccess('SwitchOutlet', 'visible');
    checkPosAccess('SwitchOutlet', 'visible_passcode');
    checkPosAccess('CustomLinks', 'visible');
    checkPosAccess('CustomLinks', 'visible_passcode');

    // Delivery rider select
    const riderSelect = getStaffPermissions()?.pos_access?.Delivery?.select_delivery_boy;

    // KOT actions
    checkKOTPermission('print_kot_and_bill');
    checkKOTPermission('view_customer_history');
    checkKOTPermission('show_on_bill');

    // Reports sub-reports
    checkReportSubPermission('Reports.ItemReport', 'addon_items_report');
    checkReportSubPermission('Reports.ItemReport', 'cancelled_items_report');
    checkReportSubPermission('Reports.ItemReport', 'dead_items_report');
    checkReportSubPermission('Reports.ItemReport', 'deleted_items_report');
    checkReportSubPermission('Reports.ItemReport', 'sold_items_report');
    checkReportSubPermission('Reports.ItemReport', 'top_item_report');
    checkReportSubPermission('Reports.ItemReport', 'complementary_items_report');
    checkReportSubPermission('Reports.DuePaymentReport', 'due_orders');
    checkReportSubPermission('Reports.DuePaymentReport', 'order_history_report');

    // QuickBill actions
    const qbAccess = getStaffPermissions()?.pos_access?.QuickBill;
    const qbCharge = qbAccess?.add_charge;
    const qbCoupon = qbAccess?.add_coupon;
    const qbPay = qbAccess?.add_payment;
    const qbCust = qbAccess?.customer_history;
    const qbShow = qbAccess?.show_on_bill;
    const qbPrev = qbAccess?.show_preview;
    const qbComp = qbAccess?.item_as_complementary;
    const qbSend = qbAccess?.send_bill;

    // Remaining OrderWindow
    checkPosAccess('OrderWindow', 'waiter_notification');
    checkPosAccess('OrderWindow', 'filter_table');
    checkPosAccess('OrderWindow', 'payment_list');
    checkPosAccess('OrderWindow', 'live_support');
    checkPosAccess('OrderWindow', 'cash_drawer');
    checkPosAccess('OrderWindow', 'payment_notification');
  };`;

replaceExact(findResetCustomer, replaceResetCustomer, 'Inject references block');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Finished updating App.jsx with remaining permissions gating!');
