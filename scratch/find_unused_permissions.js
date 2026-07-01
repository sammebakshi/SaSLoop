const fs = require('fs');
const path = require('path');

const appJsxPath = path.join(__dirname, '..', 'pos-app', 'src', 'App.jsx');
const content = fs.readFileSync(appJsxPath, 'utf8');

// The defaults structure from POSAccessManager.jsx
const BILLING_DEFAULT = [
  'visible', 'visible_passcode', 'add_charges', 'add_charges_passcode',
  'add_coupon', 'add_coupon_passcode', 'add_discount', 'add_discount_passcode',
  'add_payment', 'allow_draft_bill_printing', 'allow_draft_bill_printing_passcode',
  'modify_bill_status', 'modify_bill_status_passcode', 'settle_bill',
  'preview', 'preview_passcode', 'save_print_bill', 'save_bill', 'send_bill',
  'allowed_due_payment', 'allowed_due_payment_passcode', 'restrict_reprint_bill',
  'restrict_reprint_bill_passcode', 'order_note'
];

const OLD_KOT_DEFAULT = [
  'visible', 'visible_passcode', 'cancel_kot', 'cancel_kot_passcode',
  'delete_kot', 'delete_kot_passcode', 'print_cancel_kot', 'print_kot',
  'transfer_item', 'transfer_item_passcode', 'item_as_complementary',
  'item_as_complementary_passcode', 'check_kot_print'
];

const SPLIT_BILL_DEFAULT = [
  'visible', 'visible_passcode', 'item_wise', 'percentage_wise', 'portion_wise'
];

const KOT_DEFAULT = [
  'visible', 'item_as_complementary', 'item_as_complementary_passcode',
  'save', 'save_and_print', 'show_on_bill', 'view_customer_history', 'print_kot_and_bill'
];

const QUICK_BILL_DEFAULT = [
  'visible', 'visible_passcode', 'kot', 'add_charge', 'add_charge_passcode',
  'add_coupon', 'add_coupon_passcode', 'add_discount', 'add_discount_passcode',
  'add_payment', 'bill_no', 'customer_history', 'settle_bill', 'show_on_bill',
  'show_preview', 'allowed_due_payment', 'allowed_due_payment_passcode',
  'item_as_complementary', 'item_as_complementary_passcode', 'send_bill'
];

const ORDER_SETTLEMENT_WINDOW_DEFAULT = [
  'visible', 'visible_passcode', 'update', 'update_passcode', 'settle', 'settle_passcode',
  'delivery_boy_report'
];

const SETTINGS_DEFAULT = [
  'visible', 'visible_passcode', 'formatting', 'general', 'general_passcode',
  'printers', 'profile', 'shortcuts', 'allow_clear_data_on_logout'
];

const RECEIPTS_DEFAULT = [
  'visible', 'visible_passcode', 'preview', 'preview_passcode', 'todays_report',
  'todays_report_passcode', 'resync_bills', 'resync_bills_passcode', 'reprint_bill',
  'reprint_bill_passcode', 'all_bills', 'todays_bills', 'date_filter',
  'deleted_status', 'deleted_status_passcode', 'free_status', 'free_status_passcode',
  'edit_bill_after_save', 'edit_bill_after_save_passcode', 'tip_amount',
  'show_bill_amount', 'net_sale_amount', 'total_fulfilled_amount', 'all_bills_amount',
  'selected_bills', 'reverse_inventory', 'reverse_inventory_passcode'
];

const RECEIPTS_EDIT_BILL_DEFAULT = [
  'visible', 'visible_passcode', 'bill_status', 'bill_status_passcode',
  'payment_mode', 'payment_mode_passcode'
];

const REPORTS_DEFAULT = [
  'visible', 'visible_passcode', 'show_all_user_report', 'category_wise_report',
  'category_wise_report_passcode', 'coupon_history', 'coupon_history_passcode',
  'kitchen_dept_wise_report', 'kitchen_dept_wise_report_passcode', 'order_type_report',
  'order_type_report_passcode', 'payment_report', 'payment_report_passcode',
  'sales_report', 'sales_report_passcode', 'todays_report', 'todays_report_passcode',
  'user_shift_report', 'user_shift_report_passcode', 'misc_report', 'misc_report_passcode',
  'pre_order_report', 'pre_order_report_passcode', 'tax_report', 'tax_report_passcode',
  'mail_report', 'mail_report_passcode', 'start_close_day_report', 'start_close_day_report_passcode',
  'kot_report', 'reservation_report', 'reservation_report_passcode', 'delivery_boy_report',
  'delivery_boy_report_passcode', 'user_report', 'user_report_passcode', 'show_amount'
];

const REPORTS_ITEM_REPORT_DEFAULT = [
  'visible', 'visible_passcode', 'addon_items_report', 'cancelled_items_report',
  'dead_items_report', 'deleted_items_report', 'sold_items_report', 'top_item_report',
  'complementary_items_report'
];

const REPORTS_DUE_PAYMENT_REPORT_DEFAULT = [
  'visible', 'visible_passcode', 'due_orders', 'order_history_report'
];

const ONLINE_ORDER_DEFAULT = [
  'visible', 'visible_passcode', 'print_bill', 'kot_print'
];

const ONLINE_ORDER_STORE_SETTINGS_DEFAULT = [
  'visible', 'visible_passcode', 'store', 'store_passcode', 'category', 'category_passcode',
  'items', 'items_passcode', 'options', 'options_passcode'
];

const INITIAL_DEFAULT_STATE = {
  Dashboard: [
    'visible', 'visible_passcode', 'todays_sale', 'total_sale', 'total_sale_passcode',
    'item_pie_chart', 'bar_sales_chart', 'this_month_sale', 'line_sales_chart',
    'all_sales_analysis', 'payment_modes_chart', 'sales_analysis_by_days', 'ip_address'
  ],
  UserManagement: ['visible'],
  OperationManagement: [
    'visible', 'ip_address'
  ],
  'OperationManagement.ItemsManagement': [
    'visible', 'category_enabled_disabled', 'category_enabled_disabled_passcode',
    'item_enabled_disabled', 'item_enabled_disabled_passcode', 'add_item', 'add_item_passcode',
    'edit_item', 'edit_item_passcode', 'load_menu_from_backoffice', 'load_menu_from_backoffice_passcode'
  ],
  Account: [
    'visible', 'close_day', 'close_shift', 'cash_drawer_closing_control'
  ],
  'Account.CloseDayWindow': [
    'show_payment_transaction_summary', 'hide_transaction_count', 'hide_settled_amount', 'hide_variance_amount'
  ],
  'Account.CloseShiftWindow': [
    'hide_transaction_count', 'hide_settled_amount', 'hide_variance_amount'
  ],
  ExpenseManagement: [
    'visible', 'visible_passcode', 'add_category', 'sub_category', 'add_expense', 'cash_drawer'
  ],
  CustomerManagement: [
    'visible', 'visible_passcode', 'add', 'edit', 'export', 'import'
  ],
  'CustomerManagement.WalletManagement': [
    'visible', 'visible_passcode', 'add_credit', 'create_wallet', 'view_transactions'
  ],
  MasterManagement: [
    'visible', 'visible_passcode', 'user_management', 'ip_address'
  ],
  'MasterManagement.AccountOld': [
    'visible', 'close_day', 'close_shift'
  ],
  'MasterManagement.AddExpense': [
    'visible', 'add_category', 'sub_category', 'add_expense'
  ],
  'MasterManagement.CustomerManagement': [
    'visible', 'visible_passcode', 'add', 'edit', 'export', 'import'
  ],
  'MasterManagement.WalletManagement': [
    'visible', 'add_credit', 'create_wallet', 'view_transactions'
  ],
  OrderWindow: [
    'visible', 'visible_passcode', 'add_customer', 'change_table', 'change_table_passcode',
    'waiter_notification', 'filter_table', 'load_menu', 'load_menu_passcode',
    'modify_bill_after_save', 'modify_bill_after_save_passcode', 'table_reservation',
    'refresh_button', 'payment_list', 'live_order_tracking', 'live_support',
    'search_table', 'search_by_code', 'search_by_name', 'delete_search', 'sync_button',
    'enable_print_settle', 'enable_save_settle', 'cash_drawer', 'payment_notification',
    'change_order_type', 'update_stock', 'change_item_price', 'change_item_price_passcode',
    'item_categories', 'table_departments'
  ],
  Billing: BILLING_DEFAULT,
  OldKOT: OLD_KOT_DEFAULT,
  SplitBill: SPLIT_BILL_DEFAULT,
  KOT: KOT_DEFAULT,
  Delivery: [
    'new_order', 'select_delivery_boy', 'customer_details_mandatory'
  ],
  'Delivery.Billing': BILLING_DEFAULT,
  'Delivery.OldKOT': OLD_KOT_DEFAULT,
  'Delivery.SplitBill': SPLIT_BILL_DEFAULT,
  Pickup: [
    'new_order', 'customer_details_mandatory'
  ],
  'Pickup.Billing': BILLING_DEFAULT,
  'Pickup.OldKOT': OLD_KOT_DEFAULT,
  'Pickup.SplitBill': SPLIT_BILL_DEFAULT,
  PreOrder: [
    'new_order'
  ],
  'PreOrder.Billing': BILLING_DEFAULT,
  'PreOrder.OldKOT': OLD_KOT_DEFAULT,
  'PreOrder.SplitBill': SPLIT_BILL_DEFAULT,
  QuickBill: QUICK_BILL_DEFAULT,
  OrderSettlementWindow: ORDER_SETTLEMENT_WINDOW_DEFAULT,
  Settings: SETTINGS_DEFAULT,
  Receipts: RECEIPTS_DEFAULT,
  'Receipts.EditBill': RECEIPTS_EDIT_BILL_DEFAULT,
  Reports: REPORTS_DEFAULT,
  'Reports.ItemReport': REPORTS_ITEM_REPORT_DEFAULT,
  'Reports.DuePaymentReport': REPORTS_DUE_PAYMENT_REPORT_DEFAULT,
  SwitchOutlet: ['visible', 'visible_passcode'],
  CustomLinks: ['visible', 'visible_passcode'],
  OnlineOrder: ONLINE_ORDER_DEFAULT,
  'OnlineOrder.StoreSettings': ONLINE_ORDER_STORE_SETTINGS_DEFAULT
};

// Now, for each section and each key, let's search where in App.jsx it is referenced.
// Note that some keys are checked dynamically via helper functions:
// e.g. Billing.settle_bill is checked via checkBillingPermission('settle_bill').
// So we must check:
// 1. Literal search of `pos_access?.Section?.key` or similar
// 2. Or inside checkBillingPermission('key'), checkOldKOTPermission('key'), checkKOTPermission('key')
// 3. Or inside getFilteredReportsList / getFilteredSettingsTabs

const unmapped = [];
const mapped = [];

for (const section in INITIAL_DEFAULT_STATE) {
  const keys = INITIAL_DEFAULT_STATE[section];
  for (const key of keys) {
    let isUsed = false;

    // Check 1: Direct literal check
    // We construct possible checks:
    // e.g. pos_access?.Dashboard?.todays_sale
    // e.g. pos_access?.Dashboard?.visible
    // e.g. pos_access?.OperationManagement?.ItemsManagement?.visible
    const sectionParts = section.split('.');
    let regexStr = 'pos_access\\??\\.';
    sectionParts.forEach(part => {
      regexStr += part + '\\??\\.';
    });
    regexStr += key + '\\b';
    const directRegex = new RegExp(regexStr, 'i');
    if (directRegex.test(content)) {
      isUsed = true;
    }

    // Check 2: Dynamic checks via functions
    if (!isUsed) {
      if (section === 'Billing' || section === 'Delivery.Billing' || section === 'Pickup.Billing' || section === 'PreOrder.Billing') {
        const checkCall = new RegExp(`checkBillingPermission\\(\\s*['"]${key}['"]\\s*\\)`, 'i');
        if (checkCall.test(content)) {
          isUsed = true;
        }
      }
      if (section === 'OldKOT' || section === 'Delivery.OldKOT' || section === 'Pickup.OldKOT' || section === 'PreOrder.OldKOT') {
        const checkCall = new RegExp(`checkOldKOTPermission\\(\\s*['"]${key}['"]\\s*\\)`, 'i');
        if (checkCall.test(content)) {
          isUsed = true;
        }
      }
      if (section === 'KOT') {
        const checkCall = new RegExp(`checkKOTPermission\\(\\s*['"]${key}['"]\\s*\\)`, 'i');
        if (checkCall.test(content)) {
          isUsed = true;
        }
      }
      if (section === 'Reports') {
        // Look inside getFilteredReportsList mapping
        // e.g. access.sales_report, access.todays_report
        const reportAccess = new RegExp(`access\\??\\.${key}\\b`, 'i');
        if (reportAccess.test(content)) {
          isUsed = true;
        }
      }
      if (section === 'Settings') {
        // Look inside getFilteredSettingsTabs
        // e.g. access?.general, access?.profile, etc.
        const settingsAccess = new RegExp(`access\\??\\.${key}\\b`, 'i');
        if (settingsAccess.test(content)) {
          isUsed = true;
        }
      }
    }

    // Check 3: Check passcode fields
    // Many fields have a corresponding "_passcode" field.
    // Let's see if the passcode logic is checked, e.g. checking for actionKey === 'change_item_price' in passcode verification (which might map to change_item_price_passcode or actionKey).
    // In db / posRoutes.js we saw passcode gating:
    // `const hasPermission = isOwnerOrAdmin || checkPermission(staffPermissions.pos_access, actionKey);`
    // Wait, the client or backend checks passcode. On client, does it use getStaffPermissions()?.pos_access?
    // Let's also search for the key or key + '_passcode' as a general check in App.jsx.
    if (!isUsed) {
      const generalSearch = new RegExp(`\\b${key}\\b`, 'i');
      if (!generalSearch.test(content)) {
        // Not even mentioned in App.jsx!
      } else {
        // Mentioned, but maybe not in relation to pos_access.
      }
    }

    if (isUsed) {
      mapped.push({ section, key });
    } else {
      unmapped.push({ section, key });
    }
  }
}

console.log("--- MAPPED PERMISSIONS (" + mapped.length + ") ---");
// console.log(mapped);

console.log("\n--- UNMAPPED PERMISSIONS (" + unmapped.length + ") ---");
unmapped.forEach(item => {
  console.log(`${item.section} -> ${item.key}`);
});
