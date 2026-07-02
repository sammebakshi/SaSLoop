const fs = require('fs');
const path = require('path');

const appJsxPath = path.join(__dirname, '..', 'pos-app', 'src', 'App.jsx');
const content = fs.readFileSync(appJsxPath, 'utf8');

// The defaults structure from POSAccessManager.jsx
const INITIAL_DEFAULT_STATE = {
  Dashboard: ['visible', 'visible_passcode', 'todays_sale', 'average_order', 'total_tax', 'active_table_count', 'total_sales_count', 'payment_mode_sales', 'average_billing_time', 'weekly_heatmap'],
  MasterManagement: ['visible', 'visible_passcode', 'user_management', 'ip_address'],
  'MasterManagement.AccountOld': ['visible', 'close_day', 'close_shift'],
  'MasterManagement.AddExpense': ['visible', 'add_category', 'sub_category', 'add_expense'],
  'MasterManagement.CustomerManagement': ['visible', 'visible_passcode', 'add', 'edit', 'export', 'import'],
  'MasterManagement.WalletManagement': ['visible', 'add_credit', 'create_wallet', 'view_transactions'],
  OrderWindow: [
    'visible', 'visible_passcode', 'add_customer', 'change_table', 'table_reservation',
    'waiter_notification', 'filter_table', 'load_menu', 'modify_bill_after_save',
    'modify_bill_after_save_passcode', 'refresh_button', 'payment_list', 'live_support',
    'search_table', 'search_by_code', 'search_by_name', 'delete_search', 'sync_button',
    'enable_print_settle', 'enable_save_settle', 'cash_drawer', 'payment_notification',
    'change_order_type', 'update_stock', 'change_item_price', 'change_item_price_passcode',
    'item_categories', 'table_departments'
  ],
  Billing: [
    'visible', 'visible_passcode', 'add_charges', 'add_charges_passcode',
    'add_coupon', 'add_coupon_passcode', 'add_discount', 'add_discount_passcode',
    'add_payment', 'allow_draft_bill_printing', 'allow_draft_bill_printing_passcode',
    'modify_bill_status', 'modify_bill_status_passcode', 'settle_bill',
    'preview', 'preview_passcode', 'save_print_bill', 'save_bill', 'send_bill',
    'allowed_due_payment', 'allowed_due_payment_passcode', 'restrict_reprint_bill',
    'restrict_reprint_bill_passcode', 'order_note'
  ],
  OldKOT: [
    'visible', 'visible_passcode', 'cancel_kot', 'cancel_kot_passcode',
    'delete_kot', 'delete_kot_passcode', 'print_cancel_kot', 'print_kot',
    'transfer_item', 'transfer_item_passcode', 'item_as_complementary',
    'item_as_complementary_passcode', 'check_kot_print'
  ],
  SplitBill: [
    'visible', 'visible_passcode', 'item_wise', 'percentage_wise', 'portion_wise'
  ],
  KOT: [
    'visible', 'item_as_complementary', 'item_as_complementary_passcode',
    'save', 'save_and_print', 'show_on_bill', 'view_customer_history', 'print_kot_and_bill'
  ],
  Delivery: ['select_delivery_boy'],
  'Delivery.Billing': [
    'visible', 'visible_passcode', 'add_charges', 'add_charges_passcode',
    'add_coupon', 'add_coupon_passcode', 'add_discount', 'add_discount_passcode',
    'add_payment', 'allow_draft_bill_printing', 'allow_draft_bill_printing_passcode',
    'modify_bill_status', 'modify_bill_status_passcode', 'settle_bill',
    'preview', 'preview_passcode', 'save_print_bill', 'save_bill', 'send_bill',
    'allowed_due_payment', 'allowed_due_payment_passcode', 'restrict_reprint_bill',
    'restrict_reprint_bill_passcode'
  ],
  'Delivery.OldKOT': [
    'visible', 'visible_passcode', 'cancel_kot', 'cancel_kot_passcode',
    'delete_kot', 'delete_kot_passcode', 'print_cancel_kot', 'print_kot',
    'transfer_item', 'transfer_item_passcode', 'item_as_complementary',
    'item_as_complementary_passcode', 'check_kot_print'
  ],
  'Delivery.SplitBill': [
    'visible', 'visible_passcode', 'item_wise', 'percentage_wise', 'portion_wise'
  ],
  'Pickup.Billing': [
    'visible', 'visible_passcode', 'add_charges', 'add_charges_passcode',
    'add_coupon', 'add_coupon_passcode', 'add_discount', 'add_discount_passcode',
    'add_payment', 'allow_draft_bill_printing', 'allow_draft_bill_printing_passcode',
    'modify_bill_status', 'modify_bill_status_passcode', 'settle_bill',
    'preview', 'preview_passcode', 'save_print_bill', 'save_bill', 'send_bill',
    'allowed_due_payment', 'allowed_due_payment_passcode', 'restrict_reprint_bill',
    'restrict_reprint_bill_passcode'
  ],
  'Pickup.OldKOT': [
    'visible', 'visible_passcode', 'cancel_kot', 'cancel_kot_passcode',
    'delete_kot', 'delete_kot_passcode', 'print_cancel_kot', 'print_kot',
    'transfer_item', 'transfer_item_passcode', 'item_as_complementary',
    'item_as_complementary_passcode', 'check_kot_print'
  ],
  'Pickup.SplitBill': [
    'visible', 'visible_passcode', 'item_wise', 'percentage_wise', 'portion_wise'
  ],
  'PreOrder.Billing': [
    'visible', 'visible_passcode', 'add_charges', 'add_charges_passcode',
    'add_coupon', 'add_coupon_passcode', 'add_discount', 'add_discount_passcode',
    'add_payment', 'allow_draft_bill_printing', 'allow_draft_bill_printing_passcode',
    'modify_bill_status', 'modify_bill_status_passcode', 'settle_bill',
    'preview', 'preview_passcode', 'save_print_bill', 'save_bill', 'send_bill',
    'allowed_due_payment', 'allowed_due_payment_passcode', 'restrict_reprint_bill',
    'restrict_reprint_bill_passcode'
  ],
  'PreOrder.OldKOT': [
    'visible', 'visible_passcode', 'cancel_kot', 'cancel_kot_passcode',
    'delete_kot', 'delete_kot_passcode', 'print_cancel_kot', 'print_kot',
    'transfer_item', 'transfer_item_passcode', 'item_as_complementary',
    'item_as_complementary_passcode', 'check_kot_print'
  ],
  'PreOrder.SplitBill': [
    'visible', 'visible_passcode', 'item_wise', 'percentage_wise', 'portion_wise'
  ],
  QuickBill: [
    'visible', 'visible_passcode', 'kot', 'add_charge', 'add_charge_passcode',
    'add_coupon', 'add_coupon_passcode', 'add_discount', 'add_discount_passcode',
    'add_payment', 'bill_no', 'customer_history', 'settle_bill', 'show_on_bill',
    'show_preview', 'allowed_due_payment', 'allowed_due_payment_passcode',
    'item_as_complementary', 'item_as_complementary_passcode', 'send_bill'
  ],
  OrderSettlementWindow: [
    'visible', 'visible_passcode', 'update', 'update_passcode', 'settle', 'settle_passcode',
    'delivery_boy_report'
  ],
  Settings: [
    'visible', 'visible_passcode', 'formatting', 'general', 'general_passcode',
    'printers', 'profile', 'shortcuts', 'allow_clear_data_on_logout'
  ],
  Receipts: [
    'visible', 'visible_passcode', 'preview', 'preview_passcode', 'todays_report',
    'todays_report_passcode', 'resync_bills', 'resync_bills_passcode', 'reprint_bill',
    'reprint_bill_passcode', 'deleted_status', 'deleted_status_passcode',
    'free_status', 'free_status_passcode', 'edit_bill_after_save', 'edit_bill_after_save_passcode',
    'selected_bills', 'reverse_inventory', 'reverse_inventory_passcode'
  ],
  'Receipts.EditBill': [
    'visible', 'visible_passcode', 'bill_status', 'bill_status_passcode',
    'payment_mode', 'payment_mode_passcode'
  ],
  Reports: [
    'visible', 'visible_passcode', 'show_all_user_report', 'category_wise_report_passcode',
    'coupon_history_passcode', 'kitchen_dept_wise_report_passcode', 'order_type_report_passcode',
    'payment_report_passcode', 'sales_report_passcode', 'todays_report_passcode',
    'user_shift_report_passcode', 'misc_report_passcode', 'pre_order_report',
    'pre_order_report_passcode', 'tax_report_passcode', 'mail_report',
    'mail_report_passcode', 'start_close_day_report_passcode', 'kot_report',
    'reservation_report', 'reservation_report_passcode', 'delivery_boy_report_passcode',
    'user_report_passcode', 'show_amount'
  ],
  'Reports.ItemReport': [
    'visible', 'visible_passcode', 'addon_items_report', 'cancelled_items_report',
    'dead_items_report', 'deleted_items_report', 'sold_items_report', 'top_item_report',
    'complementary_items_report'
  ],
  'Reports.DuePaymentReport': [
    'visible', 'visible_passcode', 'due_orders', 'order_history_report'
  ],
  SwitchOutlet: ['visible', 'visible_passcode'],
  CustomLinks: ['visible', 'visible_passcode'],
  OnlineOrder: ['visible_passcode'],
  'OnlineOrder.StoreSettings': [
    'visible_passcode', 'store', 'store_passcode', 'category', 'category_passcode',
    'items', 'items_passcode', 'options', 'options_passcode'
  ]
};

const unmapped = [];
const mapped = [];

for (const section in INITIAL_DEFAULT_STATE) {
  const keys = INITIAL_DEFAULT_STATE[section];
  for (const key of keys) {
    let isUsed = false;

    // Check if the permission key exists as a word boundary in App.jsx
    let searchKey = key;
    if (key.endsWith('_passcode')) {
      searchKey = key.replace('_passcode', '');
    }

    const regex = new RegExp(`\\b${searchKey}\\b`, 'i');
    if (regex.test(content)) {
      isUsed = true;
    }

    // Special cases:
    if (section.startsWith('Delivery.') || section.startsWith('Pickup.') || section.startsWith('PreOrder.')) {
      const baseSection = section.split('.')[1];
      const baseRegex = new RegExp(`\\b${baseSection}\\b`, 'i');
      if (baseRegex.test(content) && regex.test(content)) {
        isUsed = true;
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

console.log("\n--- UNMAPPED PERMISSIONS (" + unmapped.length + ") ---");
unmapped.forEach(item => {
  console.log(`${item.section} -> ${item.key}`);
});
