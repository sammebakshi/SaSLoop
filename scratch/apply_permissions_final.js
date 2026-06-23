const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../pos-app/src/App.jsx');
let content = fs.readFileSync(filePath, 'utf8').replace(/\r\n/g, '\n');

function replaceExactlyOnce(target, replacement, name) {
  const normalizedTarget = target.replace(/\r\n/g, '\n');
  const normalizedReplacement = replacement.replace(/\r\n/g, '\n');
  const index = content.indexOf(normalizedTarget);
  if (index === -1) {
    console.error(`--- Debug for ${name} ---`);
    console.error(`Target starts with: ${JSON.stringify(normalizedTarget.substring(0, 100))}`);
    throw new Error(`Target not found: ${name}`);
  }
  if (content.indexOf(normalizedTarget, index + 1) !== -1) {
    throw new Error(`Target found multiple times: ${name}`);
  }
  content = content.replace(normalizedTarget, normalizedReplacement);
  console.log(`✅ Successfully replaced: ${name}`);
}

// 1. Helpers Definition
replaceExactlyOnce(
`  const getStaffPermissions = () => {
    if (!business || !business.staff_permissions) return {};
    if (typeof business.staff_permissions === 'string') {
      try {
        return JSON.parse(business.staff_permissions);
      } catch (e) {
        return {};
      }
    }
    return business.staff_permissions;
  };`,
`  const getStaffPermissions = () => {
    if (!business || !business.staff_permissions) return {};
    if (typeof business.staff_permissions === 'string') {
      try {
        return JSON.parse(business.staff_permissions);
      } catch (e) {
        return {};
      }
    }
    return business.staff_permissions;
  };

  const checkBillingPermission = (perm) => {
    const access = getStaffPermissions()?.pos_access;
    if (!access) return true;
    if (orderType === 'QUICK') {
      const qk = perm === 'add_charges' ? 'add_charge' : perm;
      return access.QuickBill?.[qk] !== false;
    }
    let billingAccess = access.Billing;
    if (orderType === 'DELIVERY') {
      billingAccess = access.Delivery?.Billing;
    } else if (orderType === 'PICKUP') {
      billingAccess = access.Pickup?.Billing;
    } else if (orderType === 'PRE_ORDER') {
      billingAccess = access.PreOrder?.Billing;
    }
    return billingAccess?.[perm] !== false;
  };

  const checkOldKOTPermission = (perm) => {
    const access = getStaffPermissions()?.pos_access;
    if (!access) return true;
    let oldKotAccess = access.OldKOT;
    if (orderType === 'DELIVERY') {
      oldKotAccess = access.Delivery?.OldKOT;
    } else if (orderType === 'PICKUP') {
      oldKotAccess = access.Pickup?.OldKOT;
    } else if (orderType === 'PRE_ORDER') {
      oldKotAccess = access.PreOrder?.OldKOT;
    }
    return oldKotAccess?.[perm] !== false;
  };

  const checkKOTPermission = (perm) => {
    const access = getStaffPermissions()?.pos_access;
    if (!access) return true;
    return access.KOT?.[perm] !== false;
  };

  const getFilteredReportsList = () => {
    const access = getStaffPermissions()?.pos_access?.Reports;
    if (!access) return REPORTS_LIST;
    const mapping = {
      'Sales Report': access.sales_report,
      'DSR Report': access.sales_report,
      'Todays Report': access.todays_report,
      'Item Report': access.ItemReport?.visible,
      'Meal Time-Based Sales Report': access.misc_report,
      'Hourly Report': access.misc_report,
      'Waiter Incentive Report': access.user_report,
      'Payment Report': access.payment_report,
      'Expense Tracking Report': access.misc_report,
      'Order Type Report': access.order_type_report,
      'Category Report': access.category_wise_report,
      'Kitchen Department Report': access.kitchen_dept_wise_report,
      'Coupon History Report': access.coupon_history,
      'Due Payment Report': access.DuePaymentReport?.visible,
      'Start Close Day Report': access.start_close_day_report,
      'Shift Wise Report': access.user_shift_report,
      'Discount Report': access.misc_report,
      'Biller Wise Summary': access.user_report,
      'Delivery Report': access.delivery_boy_report,
      'Day Wise Summary Report': access.sales_report,
      'Bill Print Report': access.misc_report,
      'Applied Charges Report': access.misc_report,
      'Passcode User Report': access.user_report,
      'ZATCA Report': access.tax_report,
      'Logistic Report': access.delivery_boy_report,
      'Order Transition Report': access.misc_report,
    };
    return REPORTS_LIST.filter(item => mapping[item.name] !== false);
  };

  const getFilteredSettingsTabs = () => {
    const access = getStaffPermissions()?.pos_access?.Settings;
    const tabs = [
      { id: 'general', label: 'General', icon: <Settings size={12} />, show: access?.general !== false },
      { id: 'outlet', label: 'Outlet Settings', icon: <Store size={12} />, show: access?.profile !== false },
      { id: 'printer', label: 'Printers', icon: <Printer size={12} />, show: access?.printers !== false },
      { id: 'shortcuts', label: 'Shortcuts', icon: <Key size={12} />, show: access?.shortcuts !== false },
      { id: 'formatting', label: 'Formatting', icon: <Sliders size={12} />, show: access?.formatting !== false },
      { id: 'profile', label: 'Profile', icon: <User size={12} />, show: access?.profile !== false }
    ];
    return tabs.filter(t => t.show);
  };`,
  "1. Helpers Definition"
);

// 2. Tab auto-switch Effect
replaceExactlyOnce(
`  useEffect(() => {
    localStorage.setItem('pos_terminal_settings', JSON.stringify(posSettings));
  }, [posSettings]);`,
`  useEffect(() => {
    localStorage.setItem('pos_terminal_settings', JSON.stringify(posSettings));
  }, [posSettings]);

  useEffect(() => {
    if (isAuthenticated && business) {
      const access = getStaffPermissions()?.pos_access;
      if (access) {
        const tabCheck = {
          home: access.Dashboard?.visible !== false,
          billing: access.Billing?.visible !== false,
          live: access.OrderWindow?.live_order_tracking !== false,
          digital: access.OnlineOrder?.visible !== false,
          receipts: access.Receipts?.visible !== false,
          expenses: access.ExpenseManagement?.visible !== false,
          analytics: access.Reports?.visible !== false,
          config: access.OperationManagement?.visible !== false,
          settings: access.Settings?.visible !== false,
        };
        if (!tabCheck[activeTab]) {
          const firstAllowedTab = Object.keys(tabCheck).find(tab => tabCheck[tab]);
          if (firstAllowedTab) {
            setActiveTab(firstAllowedTab);
          }
        }
      }
    }
  }, [business, isAuthenticated, activeTab]);`,
  "2. Tab auto-switch Effect"
);

// 3. Sidebar navigation buttons wrapping
replaceExactlyOnce(
`          <SidebarIcon id="dashboardIcon" isDark={isDark} icon={<svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>} active={activeTab === 'home'} onClick={() => setActiveTab('home')} label="Dash" />`,
`          {getStaffPermissions()?.pos_access?.Dashboard?.visible !== false && (
            <SidebarIcon id="dashboardIcon" isDark={isDark} icon={<svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>} active={activeTab === 'home'} onClick={() => setActiveTab('home')} label="Dash" />
          )}`,
  "3a. Dashboard Sidebar Icon"
);

replaceExactlyOnce(
`          <SidebarIcon id="orderIcon" isDark={isDark} icon={<svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M11 9H9V2H7V9H5V2H3V9c0 2.21 1.79 4 4 4v9h2v-9c2.21 0 4-1.79 4-4V2h-2v7zM21 2h-2c-1.1 0-2 .9-2 2v9h2v9h2V2z"/></svg>} active={activeTab === 'billing'} onClick={() => { setActiveTab('billing'); setBillingView('tables'); }} label="Order" />`,
`          {getStaffPermissions()?.pos_access?.Billing?.visible !== false && (
            <SidebarIcon id="orderIcon" isDark={isDark} icon={<svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M11 9H9V2H7V9H5V2H3V9c0 2.21 1.79 4 4 4v9h2v-9c2.21 0 4-1.79 4-4V2h-2v7zM21 2h-2c-1.1 0-2 .9-2 2v9h2v9h2V2z"/></svg>} active={activeTab === 'billing'} onClick={() => { setActiveTab('billing'); setBillingView('tables'); }} label="Order" />
          )}`,
  "3b. Billing/Order Sidebar Icon"
);

replaceExactlyOnce(
`          <SidebarIcon id="liveTrackingIcon" isDark={isDark} icon={<Activity size={18} fill="none" stroke="currentColor" strokeWidth={3} />} active={activeTab === 'live'} onClick={() => setActiveTab('live')} label="Live" />`,
`          {getStaffPermissions()?.pos_access?.OrderWindow?.live_order_tracking !== false && (
            <SidebarIcon id="liveTrackingIcon" isDark={isDark} icon={<Activity size={18} fill="none" stroke="currentColor" strokeWidth={3} />} active={activeTab === 'live'} onClick={() => setActiveTab('live')} label="Live" />
          )}`,
  "3c. Live Tracking Sidebar Icon"
);

replaceExactlyOnce(
`          <SidebarIcon id="digitalOrdersIcon" isDark={isDark} icon={<svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7.06-3.6-7.55-7.55H7c.55 0 1 .45 1 1v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.34c2.93.95 5.17 3.53 5.76 6.69l-1.86.65z"/></svg>} active={activeTab === 'digital'} onClick={() => setActiveTab('digital')} label="Digital" />`,
`          {getStaffPermissions()?.pos_access?.OnlineOrder?.visible !== false && (
            <SidebarIcon id="digitalOrdersIcon" isDark={isDark} icon={<svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7.06-3.6-7.55-7.55H7c.55 0 1 .45 1 1v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.34c2.93.95 5.17 3.53 5.76 6.69l-1.86.65z"/></svg>} active={activeTab === 'digital'} onClick={() => setActiveTab('digital')} label="Digital" />
          )}`,
  "3d. Digital Orders Sidebar Icon"
);

replaceExactlyOnce(
`          <SidebarIcon id="receiptIcon" isDark={isDark} icon={<svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>} active={activeTab === 'receipts'} onClick={() => setActiveTab('receipts')} label="Receipt" />`,
`          {getStaffPermissions()?.pos_access?.Receipts?.visible !== false && (
            <SidebarIcon id="receiptIcon" isDark={isDark} icon={<svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>} active={activeTab === 'receipts'} onClick={() => setActiveTab('receipts')} label="Receipt" />
          )}`,
  "3e. Receipts Sidebar Icon"
);

replaceExactlyOnce(
`          <SidebarIcon id="expensesIcon" isDark={isDark} icon={<svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M5 20h14v-2H5V5H3v15c0 1.1.9 2 2 2zM7 9h10v2H7V9zm0 4h10v2H7v-2z"/></svg>} active={activeTab === 'expenses'} onClick={() => { setActiveTab('expenses'); setIsExpenseModalOpen(true); }} label="Expense" />`,
`          {getStaffPermissions()?.pos_access?.ExpenseManagement?.visible !== false && (
            <SidebarIcon id="expensesIcon" isDark={isDark} icon={<svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M5 20h14v-2H5V5H3v15c0 1.1.9 2 2 2zM7 9h10v2H7V9zm0 4h10v2H7v-2z"/></svg>} active={activeTab === 'expenses'} onClick={() => { setActiveTab('expenses'); setIsExpenseModalOpen(true); }} label="Expense" />
          )}`,
  "3f. Expenses Sidebar Icon"
);

replaceExactlyOnce(
`          <SidebarIcon id="allreportsIcon" isDark={isDark} icon={<svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M4 6h2v2H4zm4 0h12v2H8zm-4 5h2v2H4zm4 0h12v2H8zm-4 5h2v2H4zm4 0h12v2H8z"/></svg>} active={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')} label="Reports" />`,
`          {getStaffPermissions()?.pos_access?.Reports?.visible !== false && (
            <SidebarIcon id="allreportsIcon" isDark={isDark} icon={<svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M4 6h2v2H4zm4 0h12v2H8zm-4 5h2v2H4zm4 0h12v2H8zm-4 5h2v2H4zm4 0h12v2H8z"/></svg>} active={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')} label="Reports" />
          )}`,
  "3g. Reports Sidebar Icon"
);

replaceExactlyOnce(
`          <SidebarIcon id="newConfigButton" isDark={isDark} icon={
            <div className="relative w-7 h-7 text-current">
              <Settings size={18} className="absolute top-0 left-0" fill="none" stroke="currentColor" strokeWidth={3}/>
              <Settings size={14} className="absolute bottom-0 right-0" fill="none" stroke="currentColor" strokeWidth={3}/>
            </div>
          } active={activeTab === 'config'} onClick={() => setActiveTab('config')} label="Config" />`,
`          {getStaffPermissions()?.pos_access?.OperationManagement?.visible !== false && (
            <SidebarIcon id="newConfigButton" isDark={isDark} icon={
              <div className="relative w-7 h-7 text-current">
                <Settings size={18} className="absolute top-0 left-0" fill="none" stroke="currentColor" strokeWidth={3}/>
                <Settings size={14} className="absolute bottom-0 right-0" fill="none" stroke="currentColor" strokeWidth={3}/>
              </div>
            } active={activeTab === 'config'} onClick={() => setActiveTab('config')} label="Config" />
          )}`,
  "3h. Config Sidebar Icon"
);

replaceExactlyOnce(
`          <SidebarIcon id="settingsButton" isDark={isDark} icon={<Sliders size={18} fill="none" stroke="currentColor" strokeWidth={3} />} active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} label="Old Config" />`,
`          {getStaffPermissions()?.pos_access?.Settings?.visible !== false && (
            <SidebarIcon id="settingsButton" isDark={isDark} icon={<Sliders size={18} fill="none" stroke="currentColor" strokeWidth={3} />} active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} label="Old Config" />
          )}`,
  "3i. Old Config Sidebar Icon"
);

replaceExactlyOnce(
`           <SidebarIcon id="sidebarSettingsIcon" isDark={isDark} icon={<Settings size={18} className="text-current" />} active={isSettingsModalOpen} onClick={() => setIsSettingsModalOpen(true)} label="Settings" />`,
`           {getStaffPermissions()?.pos_access?.Settings?.visible !== false && (
             <SidebarIcon id="sidebarSettingsIcon" isDark={isDark} icon={<Settings size={18} className="text-current" />} active={isSettingsModalOpen} onClick={() => {
                setIsSettingsModalOpen(true);
                const allowedTabs = getFilteredSettingsTabs();
                if (allowedTabs.length > 0) {
                   setSettingsActiveTab(allowedTabs[0].id);
                }
             }} label="Settings" />
           )}`,
  "3j. Settings Bottom Sidebar Icon"
);

// 4. handleOpenCouponModal validation
replaceExactlyOnce(
`  const handleOpenCouponModal = async () => {
    setIsCouponModalOpen(true);`,
`  const handleOpenCouponModal = async () => {
    if (!checkBillingPermission('add_coupon')) {
      toast.error("You do not have permission to add a coupon.");
      return;
    }
    setIsCouponModalOpen(true);`,
  "4. handleOpenCouponModal validation"
);

// 5. Discount and Charges Buttons
replaceExactlyOnce(
`                        <button
                          onClick={() => setIsDiscountModalOpen(true)}
                          className="hover:text-slate-100 transition-colors"
                        >
                          <Tag size={20} strokeWidth={2.5} />
                        </button>
                        <button
                          onClick={() => setIsChargesModalOpen(true)}
                          className="hover:text-slate-100 transition-colors"
                        >
                          <Coins size={20} strokeWidth={2.5} />
                        </button>`,
`                        {checkBillingPermission('add_discount') && (
                          <button
                            onClick={handleOpenDiscountModal}
                            className="hover:text-slate-100 transition-colors"
                          >
                            <Tag size={20} strokeWidth={2.5} />
                          </button>
                        )}
                        {checkBillingPermission('add_charges') && (
                          <button
                            onClick={handleOpenChargesModal}
                            className="hover:text-slate-100 transition-colors"
                          >
                            <Coins size={20} strokeWidth={2.5} />
                          </button>
                        )}`,
  "5. Discount and Charges Buttons"
);

// 6. Credit checkout validation in handleCheckout
replaceExactlyOnce(
`    // Block credit checkout if no customer is selected
    const isCreditCheckout = method.toLowerCase() === 'credit' || (method.toLowerCase() === 'split' && parseFloat(splitCreditAmount) > 0);
    const tempFullPhone = customerPhone ? (customerPhone.startsWith('+') ? customerPhone : customerCountryCode + customerPhone) : '';
    if (isCreditCheckout && !tempFullPhone) {
      return toast.error("Customer must be selected for Credit payment!");
    }`,
`    // Block credit checkout if no customer is selected
    const isCreditCheckout = method.toLowerCase() === 'credit' || (method.toLowerCase() === 'split' && parseFloat(splitCreditAmount) > 0);
    if (isCreditCheckout && !checkBillingPermission('allowed_due_payment')) {
      return toast.error("You do not have permission for Credit payment!");
    }
    const tempFullPhone = customerPhone ? (customerPhone.startsWith('+') ? customerPhone : customerCountryCode + customerPhone) : '';
    if (isCreditCheckout && !tempFullPhone) {
      return toast.error("Customer must be selected for Credit payment!");
    }`,
  "6. Credit checkout validation"
);

// 7. Credit payment option list filter
replaceExactlyOnce(
`            if (!activeOptions.some(opt => opt.name.toLowerCase() === 'credit')) {
              activeOptions.push({
                name: 'Credit',
                displayName: 'Credit',
                logo: <Coins className="w-4 h-4 text-amber-500" />
              });
            }`,
`            if (checkBillingPermission('allowed_due_payment')) {
              if (!activeOptions.some(opt => opt.name.toLowerCase() === 'credit')) {
                activeOptions.push({
                  name: 'Credit',
                  displayName: 'Credit',
                  logo: <Coins className="w-4 h-4 text-amber-500" />
                });
              }
            }`,
  "7. Credit payment option filter"
);

// 8. Split Credit input container
replaceExactlyOnce(
`                                       <div className="space-y-1">
                                          <label className="text-[8px] font-black uppercase text-amber-500">To Credit</label>
                                          <input
                                             type="number"
                                             value={splitCreditAmount}
                                             onChange={e => handleSplitCreditChange(e.target.value)}
                                             placeholder="Credit Amount"
                                             className={\`w-full p-2.5 rounded-xl border outline-none text-[11px] font-bold \${isDark ? 'bg-black/30 border-white/10 text-amber-500' : 'bg-white border-slate-200 text-amber-600'}\`}
                                          />
                                       </div>`,
`                                       {checkBillingPermission('allowed_due_payment') && (
                                          <div className="space-y-1">
                                             <label className="text-[8px] font-black uppercase text-amber-500">To Credit</label>
                                             <input
                                                type="number"
                                                value={splitCreditAmount}
                                                onChange={e => handleSplitCreditChange(e.target.value)}
                                                placeholder="Credit Amount"
                                                className={\`w-full p-2.5 rounded-xl border outline-none text-[11px] font-bold \${isDark ? 'bg-black/30 border-white/10 text-amber-500' : 'bg-white border-slate-200 text-amber-600'}\`}
                                             />
                                          </div>
                                       )}`,
  "8. Split Credit input container"
);

// 9. handleCheckout lifecycle guards
replaceExactlyOnce(
`  const handleCheckout = async (type = 'SETTLE', method = 'CASH', referenceNo = '', tip = 0, isDue = false) => {
    if (isCheckingOut) {
      console.warn("Checkout already in progress, ignoring double click.");
      return;
    }`,
`  const handleCheckout = async (type = 'SETTLE', method = 'CASH', referenceNo = '', tip = 0, isDue = false) => {
    if (type === 'PRINT' && !checkBillingPermission('allow_draft_bill_printing')) {
      return toast.error("You do not have permission to print a draft bill.");
    }
    if (type === 'SETTLE' && !checkBillingPermission('settle_bill')) {
      return toast.error("You do not have permission to settle the bill.");
    }
    if (type === 'SAVE' && !checkBillingPermission('save_bill')) {
      return toast.error("You do not have permission to save the bill.");
    }
    if (type === 'SAVE_PRINT' && !checkBillingPermission('save_print_bill')) {
      return toast.error("You do not have permission to save and print the bill.");
    }
    if (isCheckingOut) {
      console.warn("Checkout already in progress, ignoring double click.");
      return;
    }`,
  "9. handleCheckout lifecycle guards"
);

// 10. Checkout action buttons
replaceExactlyOnce(
`                    <div className={\`flex flex-col gap-1.5 p-1.5 shrink-0 transition-colors border-t \${isDark ? 'bg-[#0d1117] border-gray-800' : 'bg-white border-slate-200'}\`}>
                      {/* Row 1: Save Bill | Print & Save | Payment */}
                      <div className="flex gap-1.5">
                        {!posSettings.disableSaveBill && (
                          <button
                            disabled={isCheckingOut}
                            onClick={() => handleCheckout('SAVE')}
                            className={\`flex-1 py-2.5 rounded text-[10px] font-bold transition-all border \${isCheckingOut ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'} \${isDark ? 'bg-gray-900 hover:bg-gray-800 border-gray-700 text-white' : 'bg-[#1a2530] hover:bg-[#2c3e50] border-slate-800 text-white'}\`}
                          >
                            Save Bill
                          </button>
                        )}
                        <button
                          disabled={isCheckingOut}
                          onClick={() => handleCheckout('PRINT')}
                          className={\`flex-1 py-2.5 rounded text-[10px] font-bold transition-all border \${isCheckingOut ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'} \${isDark ? 'bg-gray-900 hover:bg-gray-800 border-gray-700 text-white' : 'bg-[#1a2530] hover:bg-[#2c3e50] border-slate-800 text-white'}\`}
                        >
                          Print & Save
                        </button>
                        <button
                          disabled={isCheckingOut}
                          onClick={() => {
                            if (!isSettleEnabled) { toast.warning('Please save or print the bill first'); return; }
                            setCustomerPaidAmount(''); setIsPaymentModalOpen(true);
                          }}
                          className={\`flex-1 py-2.5 rounded text-[10px] font-bold transition-all border \${isCheckingOut ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'} \${isDark ? 'bg-gray-900 hover:bg-gray-800 border-gray-700 text-white' : 'bg-[#1a2530] hover:bg-[#2c3e50] border-slate-800 text-white'}\`}
                        >
                          Payment
                        </button>
                      </div>
                      {/* Row 2: Settle Bill */}
                      <button
                        disabled={isCheckingOut}
                        onClick={() => {
                          if (!isSettleEnabled) { toast.warning('Please save or print the bill first'); return; }
                          handleCheckout('SETTLE');
                        }}
                        className={\`w-full py-2.5 rounded text-[10px] font-bold transition-all border \${isCheckingOut ? 'opacity-50 cursor-not-allowed active:scale-100' : 'active:scale-95'} \${isDark ? 'bg-gray-900 hover:bg-gray-800 border-gray-700 text-white' : 'bg-[#1a2530] hover:bg-[#2c3e50] border-slate-800 text-white'}\`}
                      >
                        {isCheckingOut ? 'Settling...' : 'Settle Bill'}
                      </button>
                    </div>`,
`                    <div className={\`flex flex-col gap-1.5 p-1.5 shrink-0 transition-colors border-t \${isDark ? 'bg-[#0d1117] border-gray-800' : 'bg-white border-slate-200'}\`}>
                      {/* Row 1: Save Bill | Print & Save | Payment */}
                      <div className="flex gap-1.5">
                        {!posSettings.disableSaveBill && checkBillingPermission('save_bill') && (
                          <button
                            disabled={isCheckingOut}
                            onClick={() => handleCheckout('SAVE')}
                            className={\`flex-1 py-2.5 rounded text-[10px] font-bold transition-all border \${isCheckingOut ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'} \${isDark ? 'bg-gray-900 hover:bg-gray-800 border-gray-700 text-white' : 'bg-[#1a2530] hover:bg-[#2c3e50] border-slate-800 text-white'}\`}
                          >
                            Save Bill
                          </button>
                        )}
                        {checkBillingPermission('allow_draft_bill_printing') && (
                          <button
                            disabled={isCheckingOut}
                            onClick={() => handleCheckout('PRINT')}
                            className={\`flex-1 py-2.5 rounded text-[10px] font-bold transition-all border \${isCheckingOut ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'} \${isDark ? 'bg-gray-900 hover:bg-gray-800 border-gray-700 text-white' : 'bg-[#1a2530] hover:bg-[#2c3e50] border-slate-800 text-white'}\`}
                          >
                            Print & Save
                          </button>
                        )}
                        {checkBillingPermission('add_payment') && (
                          <button
                            disabled={isCheckingOut}
                            onClick={() => {
                              if (!isSettleEnabled) { toast.warning('Please save or print the bill first'); return; }
                              setCustomerPaidAmount(''); setIsPaymentModalOpen(true);
                            }}
                            className={\`flex-1 py-2.5 rounded text-[10px] font-bold transition-all border \${isCheckingOut ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'} \${isDark ? 'bg-gray-900 hover:bg-gray-800 border-gray-700 text-white' : 'bg-[#1a2530] hover:bg-[#2c3e50] border-slate-800 text-white'}\`}
                          >
                            Payment
                          </button>
                        )}
                      </div>
                      {/* Row 2: Settle Bill */}
                      {checkBillingPermission('settle_bill') && (
                        <button
                          disabled={isCheckingOut}
                          onClick={() => {
                            if (!isSettleEnabled) { toast.warning('Please save or print the bill first'); return; }
                            handleCheckout('SETTLE');
                          }}
                          className={\`w-full py-2.5 rounded text-[10px] font-bold transition-all border \${isCheckingOut ? 'opacity-50 cursor-not-allowed active:scale-100' : 'active:scale-95'} \${isDark ? 'bg-gray-900 hover:bg-gray-800 border-gray-700 text-white' : 'bg-[#1a2530] hover:bg-[#2c3e50] border-slate-800 text-white'}\`}
                        >
                          {isCheckingOut ? 'Settling...' : 'Settle Bill'}
                        </button>
                      )}
                    </div>`,
  "10. Checkout action buttons"
);

// 11. handleSaveTemporaryKOT definition guard
replaceExactlyOnce(
`  const handleSaveTemporaryKOT = (isPrint = false, isNewOrder = false) => {
    if (cart.length === 0) {`,
`  const handleSaveTemporaryKOT = (isPrint = false, isNewOrder = false) => {
    if (isPrint) {
      if (!checkKOTPermission('save_and_print')) {
        toast.error("You do not have permission to Save and Print KOT.");
        return;
      }
    } else {
      if (!checkKOTPermission('save')) {
        toast.error("You do not have permission to Save KOT.");
        return;
      }
    }
    if (cart.length === 0) {`,
  "11. handleSaveTemporaryKOT guard"
);

// 12. Dine-In KOT tray "Save" and "Print & Save" buttons (and click guards)
replaceExactlyOnce(
`                  ) : activeTrayTab === 'KOT' ? (
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
                    </div>`,
`                  ) : activeTrayTab === 'KOT' ? (
                    <div className={\`flex gap-1.5 p-1.5 shrink-0 transition-colors border-t \${isDark ? 'bg-[#0d1117] border-gray-800' : 'bg-white border-slate-200'}\`}>
                      {!posSettings.disableSaveKOT && checkKOTPermission('save') && (
                        <button
                          onClick={() => {
                            if (!checkKOTPermission('save')) {
                              toast.error("You do not have permission to Save KOT.");
                              return;
                            }
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
                      {checkKOTPermission('save_and_print') && (
                        <button
                          onClick={() => {
                            if (!checkKOTPermission('save_and_print')) {
                              toast.error("You do not have permission to Save and Print KOT.");
                              return;
                            }
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
                      )}
                    </div>`,
  "12. Dine-In KOT buttons"
);

// 13. handleOldKOTComplementary guard
replaceExactlyOnce(
`  const handleOldKOTComplementary = () => {
    const selectedIndices = Object.keys(selectedOldKOTItems).filter(idx => selectedOldKOTItems[idx]);`,
`  const handleOldKOTComplementary = () => {
    if (!checkOldKOTPermission('item_as_complementary')) {
      toast.error("You do not have permission for complementary items.");
      return;
    }
    const selectedIndices = Object.keys(selectedOldKOTItems).filter(idx => selectedOldKOTItems[idx]);`,
  "13. handleOldKOTComplementary guard"
);

// 14. handleOldKOTDelete guard
replaceExactlyOnce(
`  const handleOldKOTDelete = () => {
    const selectedIndices = Object.keys(selectedOldKOTItems).filter(idx => selectedOldKOTItems[idx]);`,
`  const handleOldKOTDelete = () => {
    if (!checkOldKOTPermission('delete_kot')) {
      toast.error("You do not have permission to delete KOT items.");
      return;
    }
    const selectedIndices = Object.keys(selectedOldKOTItems).filter(idx => selectedOldKOTItems[idx]);`,
  "14. handleOldKOTDelete guard"
);

// 15. handleOldKOTCancel guard
replaceExactlyOnce(
`  const handleOldKOTCancel = () => {
    const selectedIndices = Object.keys(selectedOldKOTItems).filter(idx => selectedOldKOTItems[idx]);`,
`  const handleOldKOTCancel = () => {
    if (!checkOldKOTPermission('cancel_kot')) {
      toast.error("You do not have permission to cancel KOT items.");
      return;
    }
    const selectedIndices = Object.keys(selectedOldKOTItems).filter(idx => selectedOldKOTItems[idx]);`,
  "15. handleOldKOTCancel guard"
);

// 16. handleOpenTransferModal guard
replaceExactlyOnce(
`  const handleOpenTransferModal = () => {
    const selectedIndices = Object.keys(selectedOldKOTItems).filter(idx => selectedOldKOTItems[idx]);`,
`  const handleOpenTransferModal = () => {
    if (!checkOldKOTPermission('transfer_item')) {
      toast.error("You do not have permission to transfer items.");
      return;
    }
    const selectedIndices = Object.keys(selectedOldKOTItems).filter(idx => selectedOldKOTItems[idx]);`,
  "16. handleOpenTransferModal guard"
);

// 17. Old KOT Modal buttons in footer
replaceExactlyOnce(
`                 <div className="p-4 bg-[#161b22] border-t border-[#30363d] rounded-b-2xl flex flex-wrap gap-2 justify-between items-center">
                    <div className="flex flex-wrap gap-2">
                       <button onClick={handleOldKOTComplementary} className="bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] px-3 py-1.5 rounded-lg text-xs font-bold transition-all active:scale-95">
                          Complementary
                       </button>
                       <button onClick={handleOldKOTPrint} className="bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] px-3 py-1.5 rounded-lg text-xs font-bold transition-all active:scale-95">
                          Print
                       </button>
                       <button onClick={handleOldKOTDelete} className="bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] px-3 py-1.5 rounded-lg text-xs font-bold transition-all active:scale-95">
                          Delete KOT
                       </button>
                       <button onClick={handleOldKOTCancel} className="bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] px-3 py-1.5 rounded-lg text-xs font-bold transition-all active:scale-95">
                          Cancel KOT
                       </button>
                       <button onClick={handleOpenTransferModal} className="bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] px-3 py-1.5 rounded-lg text-xs font-bold transition-all active:scale-95">
                          Transfer Item
                       </button>
                    </div>`,
`                 <div className="p-4 bg-[#161b22] border-t border-[#30363d] rounded-b-2xl flex flex-wrap gap-2 justify-between items-center">
                    <div className="flex flex-wrap gap-2">
                       {checkOldKOTPermission('item_as_complementary') && (
                          <button onClick={handleOldKOTComplementary} className="bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] px-3 py-1.5 rounded-lg text-xs font-bold transition-all active:scale-95">
                             Complementary
                          </button>
                       )}
                       <button onClick={handleOldKOTPrint} className="bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] px-3 py-1.5 rounded-lg text-xs font-bold transition-all active:scale-95">
                          Print
                       </button>
                       {checkOldKOTPermission('delete_kot') && (
                          <button onClick={handleOldKOTDelete} className="bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] px-3 py-1.5 rounded-lg text-xs font-bold transition-all active:scale-95">
                             Delete KOT
                          </button>
                       )}
                       {checkOldKOTPermission('cancel_kot') && (
                          <button onClick={handleOldKOTCancel} className="bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] px-3 py-1.5 rounded-lg text-xs font-bold transition-all active:scale-95">
                             Cancel KOT
                          </button>
                       )}
                       {checkOldKOTPermission('transfer_item') && (
                          <button onClick={handleOpenTransferModal} className="bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] px-3 py-1.5 rounded-lg text-xs font-bold transition-all active:scale-95">
                             Transfer Item
                          </button>
                       )}
                    </div>`,
  "17. Old KOT Modal buttons in footer"
);

// 18. Catalog open pricing
replaceExactlyOnce(
`      const isZeroPrice = parseFloat(item.price || 0) === 0;
      const isOpenPrice = item.is_open_price === true;

      if (isZeroPrice || isOpenPrice) {
        setOpenPriceItem(item);
        setOpenPriceValue('');
        setIsOpenPriceModalOpen(true);
        return;
      }`,
`      const isZeroPrice = parseFloat(item.price || 0) === 0;
      const isOpenPrice = item.is_open_price === true;

      if (isZeroPrice || isOpenPrice) {
        if (getStaffPermissions()?.pos_access?.OrderWindow?.change_item_price === false) {
          toast.error("You do not have permission to change item price.");
          return;
        }
        setOpenPriceItem(item);
        setOpenPriceValue('');
        setIsOpenPriceModalOpen(true);
        return;
      }`,
  "18. Catalog open pricing"
);

// 19. Operations Management: Save Item
replaceExactlyOnce(
`  const handleSaveItemMgmt = async (e) => {
    e.preventDefault();
    if (!itemMgmtForm.product_name.trim()) {`,
`  const handleSaveItemMgmt = async (e) => {
    if (itemMgmtForm.id === null) {
      if (getStaffPermissions()?.pos_access?.OperationManagement?.ItemsManagement?.add_item === false) {
        toast.error("You do not have permission to add an item.");
        e.preventDefault();
        return;
      }
    } else {
      if (getStaffPermissions()?.pos_access?.OperationManagement?.ItemsManagement?.edit_item === false) {
        toast.error("You do not have permission to edit an item.");
        e.preventDefault();
        return;
      }
    }
    e.preventDefault();
    if (!itemMgmtForm.product_name.trim()) {`,
  "19. Operations Management: Save Item"
);

// 20. Operations Management: Delete Item
replaceExactlyOnce(
`  const handleDeleteItemMgmt = async (itemId, itemType, itemName) => {
    if (!window.confirm(\`Are you sure you want to delete "\${itemName}"?\`)) return;`,
`  const handleDeleteItemMgmt = async (itemId, itemType, itemName) => {
    if (getStaffPermissions()?.pos_access?.OperationManagement?.ItemsManagement?.edit_item === false) {
      toast.error("You do not have permission to delete items.");
      return;
    }
    if (!window.confirm(\`Are you sure you want to delete "\${itemName}"?\`)) return;`,
  "20. Operations Management: Delete Item"
);

// 21. Operations Management: Toggle Item Availability
replaceExactlyOnce(
`  const handleToggleItemMgmtAvailability = async (item) => {
    const nextAvailability = !item.availability;`,
`  const handleToggleItemMgmtAvailability = async (item) => {
    if (getStaffPermissions()?.pos_access?.OperationManagement?.ItemsManagement?.item_enabled_disabled === false) {
      toast.error("You do not have permission to enable/disable items.");
      return;
    }
    const nextAvailability = !item.availability;`,
  "21. Operations Management: Toggle Item Availability"
);

// 22. Operations Management: Toggle Category Active
replaceExactlyOnce(
`  const handleToggleCategoryActive = async (category) => {
    const nextActive = !category.is_active;`,
`  const handleToggleCategoryActive = async (category) => {
    if (getStaffPermissions()?.pos_access?.OperationManagement?.ItemsManagement?.category_enabled_disabled === false) {
      toast.error("You do not have permission to enable/disable categories.");
      return;
    }
    const nextActive = !category.is_active;`,
  "22. Operations Management: Toggle Category Active"
);

// 23. Reports mapping filter
replaceExactlyOnce(
`                     {/* Scrollable List of Reports */}
                     <div className="flex-1 overflow-y-auto pr-1 no-scrollbar" style={{ scrollbarColor: '#51983c #ffffff', scrollbarWidth: 'thin' }}>
                        <div className="px-3 pb-4 space-y-1">
                           {REPORTS_LIST.map(item => {`,
`                     {/* Scrollable List of Reports */}
                     <div className="flex-1 overflow-y-auto pr-1 no-scrollbar" style={{ scrollbarColor: '#51983c #ffffff', scrollbarWidth: 'thin' }}>
                        <div className="px-3 pb-4 space-y-1">
                           {getFilteredReportsList().map(item => {`,
  "23. Reports mapping filter"
);

// 24. Settings Tabs mapping filter
replaceExactlyOnce(
`                    {/* Tab Headers */}
                    <div className={\`flex border-b shrink-0 \${isDark ? 'border-[#30363d] bg-[#161b22]' : 'bg-slate-50 border-slate-200'} overflow-x-auto no-scrollbar\`}>
                       {[
                          { id: 'general', label: 'General', icon: <Settings size={12} /> },
                          { id: 'outlet', label: 'Outlet Settings', icon: <Store size={12} /> },
                          { id: 'printer', label: 'Printers', icon: <Printer size={12} /> },
                          { id: 'shortcuts', label: 'Shortcuts', icon: <Key size={12} /> },
                          { id: 'formatting', label: 'Formatting', icon: <Sliders size={12} /> },
                          { id: 'profile', label: 'Profile', icon: <User size={12} /> }
                       ].map((tab) => (`,
`                    {/* Tab Headers */}
                    <div className={\`flex border-b shrink-0 \${isDark ? 'border-[#30363d] bg-[#161b22]' : 'bg-slate-50 border-slate-200'} overflow-x-auto no-scrollbar\`}>
                       {getFilteredSettingsTabs().map((tab) => (`,
  "24. Settings Tabs mapping filter"
);

fs.writeFileSync(filePath, content, 'utf8');
console.log("🎉 ALL 24 REPLACEMENTS APPLIED SUCCESSFULLY TO APP.JSX!");
