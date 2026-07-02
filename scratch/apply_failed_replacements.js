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

// 1. Gate Expense modal visibility
const findExpenseModal = `        {/* EXPENSE LEDGER MODAL */}
        <AnimatePresence>
           {isExpenseModalOpen && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-[#0f172a]/90 backdrop-blur-md">`;

const replaceExpenseModal = `        {/* EXPENSE LEDGER MODAL */}
        <AnimatePresence>
           {isExpenseModalOpen && checkMasterPermission('MasterManagement.AddExpense', 'visible') && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-[#0f172a]/90 backdrop-blur-md">`;

replaceExact(findExpenseModal, replaceExpenseModal, 'Gate Expense modal visibility');

// 2. Gate record expense execution
const findExpenseRecord = `                             <button
                                 onClick={() => {
                                    if (!expenseForm.amount) return toast.error("Enter amount!");`;

const replaceExpenseRecord = `                             <button
                                 onClick={() => {
                                    if (!checkMasterPermission('MasterManagement.AddExpense', 'add_expense')) {
                                       toast.error("You do not have permission to add an expense.");
                                       return;
                                    }
                                    if (!expenseForm.amount) return toast.error("Enter amount!");`;

replaceExact(findExpenseRecord, replaceExpenseRecord, 'Gate record expense execution');

// 3. Gate close_day on start shift
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

// 4. Use handleSelectReport click callback
const findReportClick = `                                  <button
                                     key={item.name}
                                     onClick={() => setSelectedReport(item.name)}
                                     className={\`w-full flex items-center gap-3 px-4 py-3.5 text-xs font-bold uppercase rounded-xl transition-all \${`;

const replaceReportClick = `                                  <button
                                     key={item.name}
                                     onClick={() => handleSelectReport(item.name)}
                                     className={\`w-full flex items-center gap-3 px-4 py-3.5 text-xs font-bold uppercase rounded-xl transition-all \${`;

replaceExact(findReportClick, replaceReportClick, 'Use handleSelectReport click callback');

// 5. Inject handleSelectReport function
const findReportsFilter = `  const getFilteredReportsList = () => {
    const access = getStaffPermissions()?.pos_access?.Reports;
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
    const access = getStaffPermissions()?.pos_access?.Reports;
    if (!access) return REPORTS_LIST;`;

replaceExact(findReportsFilter, replaceReportsFilter, 'Inject handleSelectReport function');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Done!');
