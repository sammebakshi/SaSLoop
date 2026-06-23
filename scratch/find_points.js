const fs = require('fs');
const path = require('path');

const content = fs.readFileSync('pos-app/src/App.jsx', 'utf8');

const targets = {
  // 1. Order note input
  order_note: 'id="kot-note-input"',
  
  // 2. Receipts action buttons (resync, reprint, etc.)
  resync_bills: 'Re-sync Bills',
  
  // 3. Receipts table headers/rows for amount masking
  receipt_table_header: '<th className="px-6 py-3.5 w-28 min-w-[100px] select-none text-right">Discount</th>',
  
  // 4. Receipts details subtotal/discount masking
  receipt_details_panel: 'onClick={() => handlePrint(activeReceipt)}',
  
  // 5. Config items management sync
  load_menu_from_backoffice: 'Sync Menu',
  
  // 6. Shift closures day/shift closing tabs
  close_day_shift: 'Close Day',
  
  // 7. Expense modal items
  expense_add_category: 'Add Category',
  
  // 8. Order Window buttons
  order_window_add_customer: 'Gift size={20} strokeWidth={2.5}', // wait, let's find customer add '+' button
  order_window_change_table: 'Change Table',
  order_window_waiter_notification: 'Bell',
  order_window_filter_table: 'table status filter',
  order_window_load_menu: 'menu refresh',
  order_window_table_reservation: 'Reservation',
  order_window_payment_list: 'payment history',
  order_window_live_support: 'support',
  order_window_search_table: 'search table',
  order_window_barcode: 'barcode',
  order_window_delete_search: 'delete search',
  order_window_sync: 'sync button',
  order_window_print_settle: 'Print & Settle',
  order_window_save_settle: 'Save & Settle',
  order_window_cash_drawer: 'cash drawer status',
  order_window_order_type: 'change order type',
  order_window_update_stock: 'update stock',
};

for (const [name, target] of Object.entries(targets)) {
  let idx = 0;
  console.log(`\n--- SEARCH FOR ${name} (query: "${target}") ---`);
  let found = false;
  while ((idx = content.indexOf(target, idx)) !== -1) {
    found = true;
    console.log(`Index: ${idx}`);
    console.log(JSON.stringify(content.substring(idx - 100, idx + 150)));
    idx += target.length + 10;
  }
  if (!found) {
    console.log('NOT FOUND');
  }
}
