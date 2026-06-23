const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, '../pos-app/src/App.jsx');
const content = fs.readFileSync(file, 'utf8');

const keys = [
  // Billing
  'order_note', 'send_bill', 'modify_bill_status',
  // OldKOT
  'print_cancel_kot', 'print_kot', 'check_kot_print',
  // KOT / QuickBill
  'show_on_bill', 'view_customer_history', 'print_kot_and_bill', 'customer_history', 'show_preview',
  // Receipts
  'resync_bills', 'reprint_bill', 'all_bills', 'todays_bills', 'date_filter', 'deleted_status', 'free_status', 'edit_bill_after_save', 'show_bill_amount', 'all_bills_amount', 'net_sale_amount', 'total_fulfilled_amount', 'selected_bills', 'reverse_inventory',
  // Reports
  'show_all_user_report', 'pre_order_report', 'kot_report', 'reservation_report', 'mail_report', 'show_amount',
  // Config/Expense/Account
  'load_menu_from_backoffice', 'close_day', 'close_shift', 'cash_drawer_closing_control', 'add_category', 'sub_category', 'add_expense', 'cash_drawer',
  // OrderWindow
  'add_customer', 'change_table', 'waiter_notification', 'filter_table', 'load_menu', 'modify_bill_after_save', 'table_reservation', 'refresh_button', 'payment_list', 'live_support', 'search_table', 'search_by_code', 'search_by_name', 'delete_search', 'sync_button', 'enable_print_settle', 'enable_save_settle', 'payment_notification', 'change_order_type', 'update_stock'
];

console.log('--- SCANNING PERMISSION KEYS IN App.jsx ---');
const missing = [];
const found = [];
for (const key of keys) {
  const count = (content.match(new RegExp(key, 'gi')) || []).length;
  if (count > 0) {
    found.push(`${key}: ${count} matches`);
  } else {
    missing.push(key);
  }
}

console.log('\nFound keys:');
console.log(found.join('\n'));

console.log('\nMissing keys:');
console.log(missing.join(', '));
