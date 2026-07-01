const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, '..', 'pos-app', 'src', 'App.jsx');
const content = fs.readFileSync(appPath, 'utf8');
const lines = content.split('\n');

const searchTerms = [
  'salesAnalysisByDays',
  'paymentModesChart',
  'itemPieChart',
  'lineSalesChart',
  'barSalesChart',
  'setIsUserManagementModalOpen',
  'Split Bill',
  'SplitBill',
  'print_cancel_kot',
  'cancel_kot',
  'print_kot',
  'item_as_complementary',
  'show_on_bill',
  'print_kot_and_bill',
  'modify_bill_status',
  'restrict_reprint_bill',
  'order_note',
  'send_bill',
  'select_delivery_boy',
  'customer_details_mandatory',
  'new_order',
  'close_day',
  'close_shift',
  'cash_drawer_closing_control',
  'add_category',
  'sub_category',
  'add_expense',
  'WalletManagement',
  'load_menu_from_backoffice',
  'delivery_boy_report',
  'resync_bills',
  'reprint_bill',
  'edit_bill_after_save',
  'StoreSettings',
  'SwitchOutlet',
  'CustomLinks'
];

searchTerms.forEach(term => {
  console.log(`\n=== Matches for "${term}": ===`);
  lines.forEach((line, idx) => {
    if (line.includes(term)) {
      console.log(`${idx + 1}: ${line.trim()}`);
    }
  });
});
