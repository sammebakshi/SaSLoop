const fs = require('fs');
const path = require('path');

const appJsxPath = path.join(__dirname, '../pos-app/src/App.jsx');
const content = fs.readFileSync(appJsxPath, 'utf8');

const keysByCategory = {
  Billing: [
    'visible', 'add_charges', 'add_coupon', 'add_discount', 'add_payment',
    'allow_draft_bill_printing', 'modify_bill_status', 'settle_bill', 'preview',
    'save_print_bill', 'save_bill', 'send_bill', 'allowed_due_payment',
    'restrict_reprint_bill', 'order_note'
  ],
  OldKOT: [
    'visible', 'cancel_kot', 'delete_kot', 'print_cancel_kot', 'print_kot',
    'transfer_item', 'item_as_complementary', 'check_kot_print'
  ],
  SplitBill: [
    'visible', 'item_wise', 'percentage_wise', 'portion_wise'
  ],
  KOT: [
    'visible', 'item_as_complementary', 'save', 'save_and_print',
    'show_on_bill', 'view_customer_history', 'print_kot_and_bill'
  ],
  QuickBill: [
    'visible', 'kot', 'add_charge', 'add_coupon', 'add_discount', 'add_payment',
    'bill_no', 'customer_history', 'settle_bill', 'show_on_bill', 'show_preview',
    'allowed_due_payment', 'item_as_complementary', 'send_bill'
  ],
  OrderSettlementWindow: [
    'visible', 'update', 'settle', 'delivery_boy_report'
  ],
  Settings: [
    'visible', 'formatting', 'general', 'printers', 'profile', 'shortcuts',
    'allow_clear_data_on_logout'
  ],
  Receipts: [
    'visible', 'preview', 'todays_report', 'resync_bills', 'reprint_bill',
    'all_bills', 'todays_bills', 'date_filter', 'deleted_status', 'free_status',
    'edit_bill_after_save', 'tip_amount', 'show_bill_amount', 'net_sale_amount',
    'total_fulfilled_amount', 'all_bills_amount', 'selected_bills', 'reverse_inventory'
  ],
  Reports: [
    'visible', 'show_all_user_report', 'category_wise_report', 'coupon_history',
    'kitchen_dept_wise_report', 'order_type_report', 'payment_report', 'sales_report',
    'todays_report', 'user_shift_report', 'misc_report', 'pre_order_report',
    'tax_report', 'mail_report', 'start_close_day_report', 'kot_report',
    'reservation_report', 'delivery_boy_report', 'user_report', 'show_amount'
  ],
  Dashboard: [
    'visible', 'todays_sale', 'total_sale', 'item_pie_chart', 'bar_sales_chart',
    'this_month_sale', 'line_sales_chart', 'all_sales_analysis', 'payment_modes_chart',
    'sales_analysis_by_days', 'ip_address'
  ],
  ItemsManagement: [
    'visible', 'category_enabled_disabled', 'item_enabled_disabled', 'add_item',
    'edit_item', 'load_menu_from_backoffice'
  ],
  Account: [
    'visible', 'close_day', 'close_shift', 'cash_drawer_closing_control'
  ],
  ExpenseManagement: [
    'visible', 'add_category', 'sub_category', 'add_expense', 'cash_drawer'
  ],
  CustomerManagement: [
    'visible', 'add', 'edit', 'export', 'import'
  ],
  OrderWindow: [
    'visible', 'add_customer', 'change_table', 'waiter_notification', 'filter_table',
    'load_menu', 'modify_bill_after_save', 'table_reservation', 'refresh_button',
    'payment_list', 'live_order_tracking', 'live_support', 'search_table',
    'search_by_code', 'search_by_name', 'delete_search', 'sync_button',
    'enable_print_settle', 'enable_save_settle', 'cash_drawer', 'payment_notification',
    'change_order_type', 'update_stock', 'change_item_price'
  ]
};

const unmapped = [];
const mapped = [];

for (const [category, keys] of Object.entries(keysByCategory)) {
  for (const key of keys) {
    // We check if the key is inside App.jsx in any form of access e.g. key, or access.Category.key etc.
    const regex = new RegExp(`\\b${key}\\b`);
    const isPresent = regex.test(content);
    if (!isPresent) {
      unmapped.push({ category, key });
    } else {
      mapped.push({ category, key });
    }
  }
}

console.log('--- 🔎 UNMAPPED KEYS IN APP.JSX ---');
if (unmapped.length === 0) {
  console.log('None! All keys are mapped!');
} else {
  unmapped.forEach(item => {
    console.log(`[${item.category}] -> ${item.key}`);
  });
  console.log(`Total Unmapped Keys: ${unmapped.length}`);
}
