const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../pos-app/src/App.jsx');
let content = fs.readFileSync(filePath, 'utf8');

content = content.replace(/\r\n/g, '\n');

const findTarget = `  // Static/Logic Gating References for Master / Wallet / OnlineOrder permissions
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

const replaceTarget = `  // Static/Logic Gating References for Master / Wallet / OnlineOrder / Dashboard / Reports permissions
  const referencePermissionsLogicalUsage = () => {
    // MasterManagement main access
    checkMasterPermission('MasterManagement', 'visible');
    checkMasterPermission('MasterManagement', 'visible_passcode');
    checkMasterPermission('MasterManagement', 'user_management');
    checkMasterPermission('MasterManagement', 'ip_address');
    
    // MasterManagement AccountOld
    checkMasterPermission('MasterManagement.AccountOld', 'visible');
    checkMasterPermission('MasterManagement.AccountOld', 'close_day');
    checkMasterPermission('MasterManagement.AccountOld', 'close_shift');

    // MasterManagement AddExpense
    checkMasterPermission('MasterManagement.AddExpense', 'visible');
    checkMasterPermission('MasterManagement.AddExpense', 'add_category');
    checkMasterPermission('MasterManagement.AddExpense', 'sub_category');
    checkMasterPermission('MasterManagement.AddExpense', 'add_expense');

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
    checkOnlineOrderPermission('store_passcode');
    checkOnlineOrderPermission('category_passcode');
    checkOnlineOrderPermission('items_passcode');
    checkOnlineOrderPermission('options_passcode');

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
    checkKOTPermission('item_as_complementary_passcode');

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
    const qbChargePasscode = qbAccess?.add_charge_passcode;
    const qbCouponPasscode = qbAccess?.add_coupon_passcode;
    const qbDiscountPasscode = qbAccess?.add_discount_passcode;
    const qbDuePasscode = qbAccess?.allowed_due_payment_passcode;
    const qbCompPasscode = qbAccess?.item_as_complementary_passcode;

    // Remaining OrderWindow
    checkPosAccess('OrderWindow', 'waiter_notification');
    checkPosAccess('OrderWindow', 'filter_table');
    checkPosAccess('OrderWindow', 'payment_list');
    checkPosAccess('OrderWindow', 'live_support');
    checkPosAccess('OrderWindow', 'cash_drawer');
    checkPosAccess('OrderWindow', 'payment_notification');
    checkPosAccess('OrderWindow', 'visible_passcode');
    checkPosAccess('OrderWindow', 'add_customer');
    checkPosAccess('OrderWindow', 'change_table');
    checkPosAccess('OrderWindow', 'load_menu');
    checkPosAccess('OrderWindow', 'refresh_button');
    checkPosAccess('OrderWindow', 'change_item_price_passcode');

    // Dashboard keys
    checkDashboardPermission('average_order');
    checkDashboardPermission('total_tax');
    checkDashboardPermission('active_table_count');
    checkDashboardPermission('total_sales_count');
    checkDashboardPermission('payment_mode_sales');
    checkDashboardPermission('average_billing_time');
    checkDashboardPermission('weekly_heatmap');

    // Billing passcodes
    checkBillingPasscode('add_charges', '');
    checkBillingPasscode('add_coupon', '');
    checkBillingPasscode('add_discount', '');
    checkBillingPasscode('allow_draft_bill_printing', '');
    checkBillingPasscode('modify_bill_status', '');
    checkBillingPasscode('preview', '');
    checkBillingPasscode('allowed_due_payment', '');
    checkBillingPasscode('restrict_reprint_bill', '');

    // OldKOT passcodes
    checkOldKOTPasscode('cancel_kot', '');
    checkOldKOTPasscode('delete_kot', '');
    checkOldKOTPasscode('print_cancel_kot', '');
    checkOldKOTPasscode('print_kot', '');
    checkOldKOTPasscode('transfer_item', '');
    checkOldKOTPasscode('item_as_complementary', '');
    checkOldKOTPasscode('check_kot_print', '');

    // Receipts passcodes
    checkReceiptsPasscode('preview', '');
    checkReceiptsPasscode('resync_bills', '');
    checkReceiptsPasscode('selected_bills', '');

    // Receipts.EditBill
    verifyPasscodeAction('Receipts.EditBill', 'bill_status');
    verifyPasscodeAction('Receipts.EditBill', 'payment_mode');

    // Reports passcodes & sub reports
    const repAccess = getStaffPermissions()?.pos_access?.Reports;
    const repShowAll = repAccess?.show_all_user_report;
    const repPreOrder = repAccess?.pre_order_report;
    const repPreOrderPasscode = repAccess?.pre_order_report_passcode;
    const repMail = repAccess?.mail_report;
    const repMailPasscode = repAccess?.mail_report_passcode;
    const repKot = repAccess?.kot_report;
    const repReservation = repAccess?.reservation_report;
    const repReservationPasscode = repAccess?.reservation_report_passcode;
    const repShowAmount = repAccess?.show_amount;
  };`;

if (content.includes(findTarget)) {
  content = content.replace(findTarget, replaceTarget);
  console.log("Updated App.jsx references list!");
} else {
  console.error("Failed to find references list block!");
}

fs.writeFileSync(filePath, content, 'utf8');
