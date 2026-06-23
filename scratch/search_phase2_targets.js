const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, '../pos-app/src/App.jsx');
const lines = fs.readFileSync(file, 'utf8').split('\n');

const keys = [
  'order_note',
  'modify_bill_status',
  'view_customer_history',
  'customer_history',
  'resync_bills',
  'reprint_bill',
  'all_bills',
  'todays_bills',
  'date_filter',
  'deleted_status',
  'free_status',
  'edit_bill_after_save',
  'show_bill_amount',
  'all_bills_amount',
  'net_sale_amount',
  'total_fulfilled_amount',
  'selected_bills',
  'show_all_user_report',
  'pre_order_report',
  'kot_report',
  'reservation_report',
  'show_amount',
  'close_day',
  'add_customer',
  'change_table',
  'filter_table',
  'load_menu',
  'refresh_button',
  'search_table',
  'search_by_code',
  'sync_button',
  'change_order_type'
];

for (const key of keys) {
  console.log(`\n=== Matches for "${key}" ===`);
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes(key)) {
      console.log(`Line ${i + 1}: ${lines[i].trim()}`);
    }
  }
}
