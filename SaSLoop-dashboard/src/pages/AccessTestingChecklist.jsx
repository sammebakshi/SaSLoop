import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, CheckCircle, XCircle, Play, HelpCircle, 
  Search, Download, RotateCcw, ShieldAlert, Check, X,
  Monitor, Smartphone, BookOpen, AlertCircle
} from "lucide-react";
import * as XLSX from "xlsx";

// Detailed permissions datasets for POS and MPOS
const POS_PERMISSIONS = [
  // Billing
  { category: "Billing", key: "visible", title: "Is Visible", desc: "Can access Billing module" },
  { category: "Billing", key: "visible_passcode", title: "Is Visible (Passcode Required)", desc: "Require passcode to access Billing" },
  { category: "Billing", key: "add_charges", title: "Add Charges", desc: "Allow adding manual surcharges or service charges" },
  { category: "Billing", key: "add_charges_passcode", title: "Add Charges (Passcode Required)", desc: "Require passcode to add surcharges" },
  { category: "Billing", key: "add_coupon", title: "Add Coupon", desc: "Allow applying promotional discount coupons" },
  { category: "Billing", key: "add_coupon_passcode", title: "Add Coupon (Passcode Required)", desc: "Require passcode to apply coupons" },
  { category: "Billing", key: "add_discount", title: "Add Discount", desc: "Allow applying manual bill discounts" },
  { category: "Billing", key: "add_discount_passcode", title: "Add Discount (Passcode Required)", desc: "Require passcode to apply discounts" },
  { category: "Billing", key: "add_payment", title: "Add Payment", desc: "Allow record and edit bill payment methods" },
  { category: "Billing", key: "allow_draft_bill_printing", title: "Allow Draft Bill Printing", desc: "Permit printing temporary check slips before settlement" },
  { category: "Billing", key: "allow_draft_bill_printing_passcode", title: "Allow Draft Bill Printing (Passcode Required)", desc: "Require passcode to print draft bills" },
  { category: "Billing", key: "modify_bill_status", title: "Modify Bill Status", desc: "Allow voiding or altering bills after print" },
  { category: "Billing", key: "modify_bill_status_passcode", title: "Modify Bill Status (Passcode Required)", desc: "Require passcode to alter bill status" },
  { category: "Billing", key: "settle_bill", title: "Settle Bill", desc: "Commit sales transactions and print final invoice" },
  { category: "Billing", key: "preview", title: "Preview Bill", desc: "Show review popup before printing invoice" },
  { category: "Billing", key: "preview_passcode", title: "Preview Bill (Passcode Required)", desc: "Require passcode to preview invoices" },
  { category: "Billing", key: "save_print_bill", title: "Save & Print Bill", desc: "Commit bill to DB and immediately output receipt" },
  { category: "Billing", key: "save_bill", title: "Save Bill", desc: "Commit bill to database without receipt printout" },
  { category: "Billing", key: "send_bill", title: "Send Bill", desc: "Transmit invoice details to client via WhatsApp/SMS" },
  { category: "Billing", key: "allowed_due_payment", title: "Allowed Due Payment", desc: "Permit recording credit/due account sales" },
  { category: "Billing", key: "allowed_due_payment_passcode", title: "Allowed Due Payment (Passcode Required)", desc: "Require passcode for due billing" },
  { category: "Billing", key: "restrict_reprint_bill", title: "Restrict Reprint Bill", desc: "Block re-printing bills without audit approval" },
  { category: "Billing", key: "restrict_reprint_bill_passcode", title: "Restrict Reprint Bill (Passcode Required)", desc: "Require passcode to reprint bills" },
  { category: "Billing", key: "order_note", title: "Order Note", desc: "Allow placing custom chef or packing notes on orders" },

  // KOT
  { category: "KOT", key: "visible", title: "Is Visible", desc: "Access Kitchen Order Tickets panel" },
  { category: "KOT", key: "visible_passcode", title: "Is Visible (Passcode Required)", desc: "Require passcode to view KOTs" },
  { category: "KOT", key: "cancel_kot", title: "Cancel KOT", desc: "Allow cancelling active cooking instructions" },
  { category: "KOT", key: "cancel_kot_passcode", title: "Cancel KOT (Passcode Required)", desc: "Require passcode to cancel KOT" },
  { category: "KOT", key: "delete_kot", title: "Delete KOT", desc: "Permanently erase KOT record logs" },
  { category: "KOT", key: "delete_kot_passcode", title: "Delete KOT (Passcode Required)", desc: "Require passcode to delete KOTs" },
  { category: "KOT", key: "print_cancel_kot", title: "Print Cancel KOT", desc: "Output KOT void slips to the kitchen station" },
  { category: "KOT", key: "print_kot", title: "Print KOT", desc: "Print active order slips to respective kitchens" },
  { category: "KOT", key: "transfer_item", title: "Transfer Item", desc: "Move items from one table/KOT to another" },
  { category: "KOT", key: "transfer_item_passcode", title: "Transfer Item (Passcode Required)", desc: "Require passcode to transfer items" },
  { category: "KOT", key: "item_as_complementary", title: "Item as Complementary", desc: "Mark item as free/FOC" },
  { category: "KOT", key: "item_as_complementary_passcode", title: "Item as Complementary (Passcode Required)", desc: "Require passcode for FOC items" },
  { category: "KOT", key: "check_kot_print", title: "Check KOT Print", desc: "Confirm KOT output status" },

  // Split Bill
  { category: "Split Bill", key: "visible", title: "Is Visible", desc: "Allow split bill feature access" },
  { category: "Split Bill", key: "visible_passcode", title: "Is Visible (Passcode Required)", desc: "Require passcode to split bills" },
  { category: "Split Bill", key: "item_wise", title: "Item Wise Split", desc: "Split transaction by selecting individual items" },
  { category: "Split Bill", key: "percentage_wise", title: "Percentage Wise Split", desc: "Split transaction by percentage divisions" },
  { category: "Split Bill", key: "portion_wise", title: "Portion Wise Split", desc: "Split individual item portions among guests" },

  // Settings
  { category: "Settings", key: "visible", title: "Is Visible", desc: "Access local terminal settings configuration panel" },
  { category: "Settings", key: "visible_passcode", title: "Is Visible (Passcode Required)", desc: "Require passcode to enter Settings" },
  { category: "Settings", key: "formatting", title: "Formatting Config", desc: "Edit receipt margins, logos, headers, and footers" },
  { category: "Settings", key: "general", title: "General Configuration", desc: "Modify system defaults, timers, and alerts" },
  { category: "Settings", key: "general_passcode", title: "General Configuration (Passcode Required)", desc: "Require passcode for General Settings" },
  { category: "Settings", key: "printers", title: "Printers Mappings", desc: "Bind kitchen/receipt printers to POS terminal channels" },
  { category: "Settings", key: "profile", title: "Profile Info", desc: "View current logged-in personnel profile stats" },
  { category: "Settings", key: "shortcuts", title: "Keyboard Shortcuts", desc: "Map billing hotkeys on external keyboards" },

  // Receipts
  { category: "Receipts", key: "visible", title: "Is Visible", desc: "Access the historic bills registry log" },
  { category: "Receipts", key: "visible_passcode", title: "Is Visible (Passcode Required)", desc: "Require passcode to open receipts" },
  { category: "Receipts", key: "preview", title: "Preview Past Bills", desc: "Load and examine settled invoices in detail" },
  { category: "Receipts", key: "preview_passcode", title: "Preview Past Bills (Passcode Required)", desc: "Require passcode to preview past bills" },
  { category: "Receipts", key: "todays_report", title: "Todays Report Summary", desc: "Display sales totals for the active calendar date" },
  { category: "Receipts", key: "todays_report_passcode", title: "Todays Report Summary (Passcode Required)", desc: "Require passcode to load summary" },
  { category: "Receipts", key: "resync_bills", title: "Resync Cloud Bills", desc: "Force sync bills between offline memory and cloud" },
  { category: "Receipts", key: "resync_bills_passcode", title: "Resync Cloud Bills (Passcode Required)", desc: "Require passcode to trigger sync" },
  { category: "Receipts", key: "reprint_bill", title: "Reprint Settled Bills", desc: "Print duplicate invoice copies of settled transactions" },
  { category: "Receipts", key: "reprint_bill_passcode", title: "Reprint Settled Bills (Passcode Required)", desc: "Require passcode to reprint bills" },
  { category: "Receipts", key: "all_bills", title: "View All Bills", desc: "See entire billing database log files" },
  { category: "Receipts", key: "todays_bills", title: "View Todays Bills", desc: "Limit view only to invoices created today" },
  { category: "Receipts", key: "date_filter", title: "Apply Date Filters", desc: "Filter historic bills by arbitrary start/end dates" },
  { category: "Receipts", key: "deleted_status", title: "View Deleted Bills log", desc: "Access logs of deleted/voided sales receipts" },
  { category: "Receipts", key: "deleted_status_passcode", title: "View Deleted Bills (Passcode Required)", desc: "Require passcode to view deleted logs" },
  { category: "Receipts", key: "free_status", title: "View Free/FOC Invoices", desc: "Access logs of complementary invoices" },
  { category: "Receipts", key: "free_status_passcode", title: "View Free/FOC Invoices (Passcode Required)", desc: "Require passcode to view FOC logs" },
  { category: "Receipts", key: "edit_bill_after_save", title: "Edit Bill After Save", desc: "Recall, add items, or change settlement of closed bills" },
  { category: "Receipts", key: "edit_bill_after_save_passcode", title: "Edit Bill After Save (Passcode Required)", desc: "Require passcode to edit saved bills" },
  { category: "Receipts", key: "tip_amount", title: "Edit Tip Amount", desc: "Modify tips recorded on card/settled payments" },
  { category: "Receipts", key: "show_bill_amount", title: "Show Bill Amount", desc: "Display total bill values on rows" },
  { category: "Receipts", key: "net_sale_amount", title: "Net Sale Amount Total", desc: "Calculate and display total net sales figures" },
  { category: "Receipts", key: "total_fulfilled_amount", title: "Total Fulfilled Amount", desc: "Show summary of completed order values" },
  { category: "Receipts", key: "all_bills_amount", title: "All Bills Amount", desc: "Show cumulative value of all historic invoices" },
  { category: "Receipts", key: "selected_bills", title: "Selected Bills Action", desc: "Perform bulk print/sync on selected list" },
  { category: "Receipts", key: "reverse_inventory", title: "Reverse Inventory Status", desc: "Automatically return items to stock for void bills" },
  { category: "Receipts", key: "reverse_inventory_passcode", title: "Reverse Inventory (Passcode Required)", desc: "Require passcode to reverse stock" },
  { category: "Receipts", key: "EditBill_visible", title: "Edit Bill (Submenu) Is Visible", desc: "Access Edit Bill submenu controls" },
  { category: "Receipts", key: "EditBill_visible_passcode", title: "Edit Bill Submenu (Passcode Required)", desc: "Require passcode for Edit Bill menu" },
  { category: "Receipts", key: "EditBill_bill_status", title: "Edit Bill Status", desc: "Alter bill processing status (Hold/Pending)" },
  { category: "Receipts", key: "EditBill_bill_status_passcode", title: "Edit Bill Status (Passcode Required)", desc: "Require passcode to alter status" },
  { category: "Receipts", key: "EditBill_payment_mode", title: "Edit Payment Mode", desc: "Change payment mode of a settled invoice (e.g. Cash -> UPI)" },
  { category: "Receipts", key: "EditBill_payment_mode_passcode", title: "Edit Payment Mode (Passcode Required)", desc: "Require passcode to edit payment modes" },

  // Reports
  { category: "Reports", key: "visible", title: "Is Visible", desc: "Access reports dashboard tab" },
  { category: "Reports", key: "visible_passcode", title: "Is Visible (Passcode Required)", desc: "Require passcode to view reports" },
  { category: "Reports", key: "show_all_user_report", title: "Show All User Report", desc: "Access performance reports of all cashiers" },
  { category: "Reports", key: "category_wise_report", title: "Category Wise Sales Report", desc: "Access sales reports sorted by menu group" },
  { category: "Reports", key: "category_wise_report_passcode", title: "Category Wise Report (Passcode Required)", desc: "Require passcode to open category reports" },
  { category: "Reports", key: "coupon_history", title: "Coupon History Logs", desc: "Review usage history and value of promotions" },
  { category: "Reports", key: "coupon_history_passcode", title: "Coupon History Logs (Passcode Required)", desc: "Require passcode to open coupon history" },
  { category: "Reports", key: "kitchen_dept_wise_report", title: "Kitchen Department Wise Report", desc: "Access report categorized by kitchen stations" },
  { category: "Reports", key: "kitchen_dept_wise_report_passcode", title: "Kitchen Dept Wise Report (Passcode Required)", desc: "Require passcode to view kitchen reports" },
  { category: "Reports", key: "order_type_report", title: "Order Type Sales Report", desc: "Access sales reports grouped by Dine-In, Delivery, Takeaway" },
  { category: "Reports", key: "order_type_report_passcode", title: "Order Type Report (Passcode Required)", desc: "Require passcode to view order type reports" },
  { category: "Reports", key: "payment_report", title: "Payment Mode Report", desc: "Access cashier cash vs digital ledger reconciliation reports" },
  { category: "Reports", key: "payment_report_passcode", title: "Payment Mode Report (Passcode Required)", desc: "Require passcode for payment reports" },
  { category: "Reports", key: "sales_report", title: "Sales Revenue Report", desc: "Access full turnover analytics logs" },
  { category: "Reports", key: "sales_report_passcode", title: "Sales Revenue Report (Passcode Required)", desc: "Require passcode for sales report" },
  { category: "Reports", key: "todays_report", title: "Todays Shift Report", desc: "Access detailed live day-report register" },
  { category: "Reports", key: "todays_report_passcode", title: "Todays Shift Report (Passcode Required)", desc: "Require passcode for shift report" },
  { category: "Reports", key: "user_shift_report", title: "User Shift Close Report", desc: "Access drawer-opening and shift closing audits" },
  { category: "Reports", key: "user_shift_report_passcode", title: "User Shift Close Report (Passcode Required)", desc: "Require passcode to close shifts" },
  { category: "Reports", key: "misc_report", title: "Misc Operations Report", desc: "Access reports of miscellaneous charges and collections" },
  { category: "Reports", key: "misc_report_passcode", title: "Misc Operations Report (Passcode Required)", desc: "Require passcode for misc reports" },
  { category: "Reports", key: "pre_order_report", title: "Pre Order Bookings Report", desc: "Access advance orders log sheets" },
  { category: "Reports", key: "pre_order_report_passcode", title: "Pre Order Bookings (Passcode Required)", desc: "Require passcode for pre-order reports" },
  { category: "Reports", key: "tax_report", title: "Tax Deductions Report", desc: "Access tax ledger details" },
  { category: "Reports", key: "tax_report_passcode", title: "Tax Deductions (Passcode Required)", desc: "Require passcode for tax reports" },
  { category: "Reports", key: "mail_report", title: "E-Mail Reports", desc: "Allow scheduling automated end-of-day reports to inbox" },
  { category: "Reports", key: "mail_report_passcode", title: "E-Mail Reports (Passcode Required)", desc: "Require passcode for email reports" },
  { category: "Reports", key: "start_close_day_report", title: "Start/Close Day Logs", desc: "Audit register on daily opening and closure events" },
  { category: "Reports", key: "start_close_day_report_passcode", title: "Start/Close Day Logs (Passcode Required)", desc: "Require passcode for day controls" },
  { category: "Reports", key: "kot_report", title: "KOT Analytics Report", desc: "Access cooking delay and cancellation stats" },
  { category: "Reports", key: "reservation_report", title: "Table Reservations Report", desc: "Access table booking registers" },
  { category: "Reports", key: "reservation_report_passcode", title: "Table Reservations (Passcode Required)", desc: "Require passcode to view reservations" },
  { category: "Reports", key: "delivery_boy_report", title: "Riders Delivery Performance Report", desc: "Access logistics and order trip audits" },
  { category: "Reports", key: "delivery_boy_report_passcode", title: "Riders Report (Passcode Required)", desc: "Require passcode to view rider stats" },
  { category: "Reports", key: "user_report", title: "User Performance Audits", desc: "Audit operator details and keystrokes" },
  { category: "Reports", key: "user_report_passcode", title: "User Audits (Passcode Required)", desc: "Require passcode for audit logs" },
  { category: "Reports", key: "show_amount", title: "Show Amount figures", desc: "Permit cashier layout screens to display money values" },
  { category: "Reports", key: "ItemReport_visible", title: "Item Report Is Visible", desc: "Access local item performance report submenu" },
  { category: "Reports", key: "ItemReport_visible_passcode", title: "Item Report (Passcode Required)", desc: "Require passcode for item reports" },
  { category: "Reports", key: "ItemReport_addon_items_report", title: "Item Report - Addon Items", desc: "Access reports of modifier options and addons sold" },
  { category: "Reports", key: "ItemReport_cancelled_items_report", title: "Item Report - Cancelled Items", desc: "Access list of items voided from active KOTs" },
  { category: "Reports", key: "ItemReport_dead_items_report", title: "Item Report - Dead Stocks", desc: "Access logs of item wastage and expired products" },
  { category: "Reports", key: "ItemReport_deleted_items_report", title: "Item Report - Deleted Items", desc: "Access list of items permanently deleted from tickets" },
  { category: "Reports", key: "ItemReport_sold_items_report", title: "Item Report - Sold Items History", desc: "Access full sold menu item registers" },
  { category: "Reports", key: "ItemReport_top_item_report", title: "Item Report - Top Selling Menu", desc: "Access report of best-selling products" },
  { category: "Reports", key: "ItemReport_complementary_items_report", title: "Item Report - Free/FOC Items", desc: "Access report of complementary items served" },
  { category: "Reports", key: "DuePaymentReport_visible", title: "Due Payment Report Is Visible", desc: "Access local credit due collection reports" },
  { category: "Reports", key: "DuePaymentReport_visible_passcode", title: "Due Payment Report (Passcode Required)", desc: "Require passcode for due reports" },
  { category: "Reports", key: "DuePaymentReport_due_orders", title: "Due Payment - Open Credit Invoices", desc: "Access list of unpaid guest account bills" },
  { category: "Reports", key: "DuePaymentReport_order_history_report", title: "Due Payment - Collection History", desc: "Access payment collections audits" },

  // Switch Outlet
  { category: "Switch Outlet", key: "visible", title: "Is Visible", desc: "Allow swapping register to another brand outlet" },
  { category: "Switch Outlet", key: "visible_passcode", title: "Is Visible (Passcode Required)", desc: "Require passcode to switch outlets" },

  // Custom Links
  { category: "Custom Links", key: "visible", title: "Is Visible", desc: "Render third-party helper link buttons" },
  { category: "Custom Links", key: "visible_passcode", title: "Is Visible (Passcode Required)", desc: "Require passcode to view custom links" },

  // Online Order
  { category: "Online Order", key: "visible", title: "Is Visible", desc: "Access online digital delivery platform integrations" },
  { category: "Online Order", key: "visible_passcode", title: "Is Visible (Passcode Required)", desc: "Require passcode to access online orders menu" },
  { category: "Online Order", key: "print_bill", title: "Print Online Bill Copy", desc: "Print customer receipt automatically for digital orders" },
  { category: "Online Order", key: "kot_print", title: "Print Online KOT Copy", desc: "Print KOT automatically for digital orders" },
  { category: "Online Order", key: "StoreSettings_visible", title: "Store Settings Is Visible", desc: "Access digital outlet catalogs configuration" },
  { category: "Online Order", key: "StoreSettings_visible_passcode", title: "Store Settings (Passcode Required)", desc: "Require passcode to edit store parameters" },
  { category: "Online Order", key: "StoreSettings_store", title: "Store settings toggle link", desc: "Access timing and toggle parameters of store" },
  { category: "Online Order", key: "StoreSettings_store_passcode", title: "Store toggle (Passcode Required)", desc: "Require passcode for store parameters" },
  { category: "Online Order", key: "StoreSettings_category", title: "Category settings link", desc: "Access catalog section toggles (food/beverages)" },
  { category: "Online Order", key: "StoreSettings_category_passcode", title: "Category settings (Passcode Required)", desc: "Require passcode for category layout" },
  { category: "Online Order", key: "StoreSettings_items", title: "Items toggle settings link", desc: "Toggle item out-of-stock instantly" },
  { category: "Online Order", key: "StoreSettings_items_passcode", title: "Items settings (Passcode Required)", desc: "Require passcode to toggle items" },
  { category: "Online Order", key: "StoreSettings_options", title: "Options settings link", desc: "Toggle custom modifier options out-of-stock" },
  { category: "Online Order", key: "StoreSettings_options_passcode", title: "Options settings (Passcode Required)", desc: "Require passcode to toggle options" }
];

const MPOS_PERMISSIONS = [
  // Settings
  { category: "Settings", key: "visible", title: "Is Visible", desc: "Can access settings menu" },
  { category: "Settings", key: "printer_settings", title: "Printer Settings", desc: "Access local Bluetooth/Wi-Fi printer mapping parameters" },
  { category: "Settings", key: "app_settings", title: "App Settings", desc: "Access local terminal configurations and theme settings" },

  // Quick Bill
  { category: "Quick Bill", key: "visible", title: "Is Visible", desc: "Can access Quick Bill module" },
  { category: "Quick Bill", key: "settle_bill", title: "Settle Bill", desc: "Allow checkout and cash collection inside Quick Bill" },

  // Dine In
  { category: "Dine In", key: "visible", title: "Is Visible", desc: "Can access Dine In table layouts" },
  { category: "Dine In", key: "create_order", title: "Create Dine In Order", desc: "Allow opening new dine-in table checks and printing KOT" },
  { category: "Dine In", key: "settle_bill", title: "Settle Dine In Bill", desc: "Permit discount inputs and payments checkout for tables" },
  { category: "Dine In", key: "cancel_kot", title: "Cancel KOT", desc: "Allow voiding active cooking orders" },
  { category: "Dine In", key: "merge_table", title: "Merge Table", desc: "Allow combining multiple table tickets under one bill" },
  { category: "Dine In", key: "change_table", title: "Change Table", desc: "Allow swapping table assignments for active guest checks" },

  // Pickup
  { category: "Pickup", key: "visible", title: "Is Visible", desc: "Can access takeaway Pickup module" },
  { category: "Pickup", key: "create_order", title: "Create Takeaway Order", desc: "Allow recording and printing takeaway checks" },
  { category: "Pickup", key: "settle_bill", title: "Settle Takeaway Bill", desc: "Process payments checkout for takeaway tickets" },
  { category: "Pickup", key: "cancel_order", title: "Cancel Takeaway Order", desc: "Allow cancelling active takeaway orders" },
  { category: "Pickup", key: "refund", title: "Process Refund", desc: "Allow refunding payments for cancelled takeaways" },

  // Delivery
  { category: "Delivery", key: "visible", title: "Is Visible", desc: "Can access Delivery management module" },
  { category: "Delivery", key: "create_order", title: "Create Delivery Order", desc: "Allow recording home delivery orders" },
  { category: "Delivery", key: "settle_bill", title: "Settle Delivery Bill", desc: "Reconcile delivery cash-on-delivery settlements" },
  { category: "Delivery", key: "assign_rider", title: "Assign Rider", desc: "Dispatch order to delivery boys list" },
  { category: "Delivery", key: "cancel_order", title: "Cancel Delivery Order", desc: "Allow cancelling booked delivery slots" },

  // Reports
  { category: "Reports", key: "visible", title: "Is Visible", desc: "Can access mobile reports dashboard" },
  { category: "Reports", key: "sales_report", title: "Sales Report Summary", desc: "Access turn-over stats" },
  { category: "Reports", key: "payment_report", title: "Payment Modes Summary", desc: "Access reconciliation metrics" },
  { category: "Reports", key: "category_wise_report", title: "Category Sales Report", desc: "Access category groups sales" },
  { category: "Reports", key: "item_wise_report", title: "Item Sales Report", desc: "Access item quantity sales list" },
  { category: "Reports", key: "user_shift_report", title: "User Shift Closing Audits", desc: "Access cashier drawer summary logs" },
  { category: "Reports", key: "todays_report", title: "Todays Report Summary", desc: "Access live sales totals for the day" },
  { category: "Reports", key: "expense_report", title: "Expense Tracking Report", desc: "Access expense logs" },
  { category: "Reports", key: "due_payment_report", title: "Due Payments Report", desc: "Access customer credit records" },
  { category: "Reports", key: "cancelled_items_report", title: "Cancelled Items Report", desc: "Access item cancellations list" },
  { category: "Reports", key: "sold_items_report", title: "Sold Items Count Report", desc: "Access total sold items log" },
  { category: "Reports", key: "top_item_report", title: "Top Selling Item Report", desc: "Access best-selling items ranking" },
  { category: "Reports", key: "complementary_items_report", title: "Complementary Items Report", desc: "Access FOC serving logs" },
  { category: "Reports", key: "start_close_day_report", title: "Start Close Day Summary", desc: "Access store audits" },
  { category: "Reports", key: "user_report", title: "Operator Activity Report", desc: "Access operator audit trails" },
  { category: "Reports", key: "show_amount", title: "Show Amount", desc: "Show amount text in mobile analytics screens" },

  // Online Order
  { category: "Online Order", key: "visible", title: "Is Visible", desc: "Access online digital integration switch" },

  // Online Orders Settings
  { category: "Online Orders Settings", key: "visible", title: "Is Visible", desc: "Can access online settings panel" },
  { category: "Online Orders Settings", key: "store", title: "Store settings toggle", desc: "Access timing and configurations of store" },
  { category: "Online Orders Settings", key: "category", title: "Category configuration toggle", desc: "Toggle online category layout" },
  { category: "Online Orders Settings", key: "items", title: "Items out-of-stock toggle", desc: "Toggle item active status for digital orders" },
  { category: "Online Orders Settings", key: "options", title: "Options out-of-stock toggle", desc: "Toggle addon parameters for digital orders" },

  // Support
  { category: "Support", key: "visible", title: "Is Visible", desc: "Access mobile support dashboard panel" }
];

const AccessTestingChecklist = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("pos"); // "pos" or "mpos"
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // "all", "tested", "working", "failing", "untested"
  
  // Checklist State structure: { [id]: { status: 'untested'|'working'|'failing', notes: '' } }
  const [checklist, setChecklist] = useState(() => {
    const saved = localStorage.getItem("sasloop_qa_checklist");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse QA checklist state", e);
      }
    }
    return {};
  });

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem("sasloop_qa_checklist", JSON.stringify(checklist));
  }, [checklist]);

  // Handler to set status for a specific permission item
  const handleSetStatus = (id, status) => {
    setChecklist(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        status
      }
    }));
  };

  // Handler to set note/feedback for a specific permission item
  const handleSetNote = (id, notes) => {
    setChecklist(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        notes
      }
    }));
  };

  // Mark all items in the current active tab as working
  const handleMarkAllActiveAsWorking = () => {
    const items = activeTab === "pos" ? POS_PERMISSIONS : MPOS_PERMISSIONS;
    setChecklist(prev => {
      const next = { ...prev };
      items.forEach(item => {
        const id = `${activeTab}_${item.category}_${item.key}`;
        next[id] = {
          ...next[id],
          status: "working"
        };
      });
      return next;
    });
  };

  // Reset all progress
  const handleResetChecklist = () => {
    if (window.confirm("Are you sure you want to reset all checklist logs back to untested? This will wipe your saved notes.")) {
      setChecklist({});
    }
  };

  // Export checklist database to Excel sheet
  const handleExportExcel = () => {
    const rows = [];
    
    // Process POS permissions
    POS_PERMISSIONS.forEach(item => {
      const id = `pos_${item.category}_${item.key}`;
      const state = checklist[id] || { status: "untested", notes: "" };
      let statusLabel = "Not Tested";
      if (state.status === "working") statusLabel = "Working";
      if (state.status === "failing") statusLabel = "Not Working / Failing";

      rows.push({
        Platform: "SaSLoop Main (POS Desktop)",
        Category: item.category,
        PermissionKey: item.key,
        PermissionTitle: item.title,
        Description: item.desc,
        QAStatus: statusLabel,
        QANotes: state.notes || ""
      });
    });

    // Process MPOS permissions
    MPOS_PERMISSIONS.forEach(item => {
      const id = `mpos_${item.category}_${item.key}`;
      const state = checklist[id] || { status: "untested", notes: "" };
      let statusLabel = "Not Tested";
      if (state.status === "working") statusLabel = "Working";
      if (state.status === "failing") statusLabel = "Not Working / Failing";

      rows.push({
        Platform: "SaSLoop App (MPOS Mobile)",
        Category: item.category,
        PermissionKey: item.key,
        PermissionTitle: item.title,
        Description: item.desc,
        QAStatus: statusLabel,
        QANotes: state.notes || ""
      });
    });

    const worksheet = XLSX.utils.json_to_sheet(rows);
    
    // Style column widths dynamically
    worksheet["!cols"] = [
      { wch: 30 }, // Platform
      { wch: 20 }, // Category
      { wch: 30 }, // PermissionKey
      { wch: 35 }, // PermissionTitle
      { wch: 55 }, // Description
      { wch: 15 }, // QAStatus
      { wch: 60 }  // QANotes
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Access Level QA Report");
    XLSX.writeFile(workbook, "SaSLoop_Access_Checklist_QA_Report.xlsx");
  };

  // Get current active items
  const activeDataset = activeTab === "pos" ? POS_PERMISSIONS : MPOS_PERMISSIONS;

  // Filter current active dataset
  const filteredDataset = activeDataset.filter(item => {
    const id = `${activeTab}_${item.category}_${item.key}`;
    const state = checklist[id] || { status: "untested" };
    
    // Search filter
    const matchSearch = 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.key.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!matchSearch) return false;

    // Status filter
    if (statusFilter === "all") return true;
    if (statusFilter === "working") return state.status === "working";
    if (statusFilter === "failing") return state.status === "failing";
    if (statusFilter === "untested") return !state.status || state.status === "untested";
    if (statusFilter === "tested") return state.status === "working" || state.status === "failing";
    
    return true;
  });

  // Calculate statistics across POS + MPOS
  const totalPosCount = POS_PERMISSIONS.length;
  const totalMposCount = MPOS_PERMISSIONS.length;
  const grandTotal = totalPosCount + totalMposCount;

  let posWorking = 0, posFailed = 0, posUntested = 0;
  POS_PERMISSIONS.forEach(item => {
    const id = `pos_${item.category}_${item.key}`;
    const status = checklist[id]?.status || "untested";
    if (status === "working") posWorking++;
    else if (status === "failing") posFailed++;
    else posUntested++;
  });

  let mposWorking = 0, mposFailed = 0, mposUntested = 0;
  MPOS_PERMISSIONS.forEach(item => {
    const id = `mpos_${item.category}_${item.key}`;
    const status = checklist[id]?.status || "untested";
    if (status === "working") mposWorking++;
    else if (status === "failing") mposFailed++;
    else mposUntested++;
  });

  const totalWorking = posWorking + mposWorking;
  const totalFailed = posFailed + mposFailed;
  const totalTested = totalWorking + totalFailed;
  const totalUntested = grandTotal - totalTested;

  const testedPercent = Math.round((totalTested / grandTotal) * 100) || 0;
  const workingPercent = Math.round((totalWorking / grandTotal) * 100) || 0;
  const failingPercent = Math.round((totalFailed / grandTotal) * 100) || 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-7xl mx-auto p-4 sm:p-6 text-slate-700 dark:text-slate-200">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between bg-white dark:bg-[#1e2129] p-5 rounded-xl border border-slate-200 dark:border-white/5 shadow-sm gap-4">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate("/outlet-users")}
            className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 rounded-lg text-slate-500 dark:text-slate-400 transition-all active:scale-95"
            title="Return to Outlet Users"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-white tracking-tight uppercase">Access Level QA Checklist</h2>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider mt-0.5">
              Verify permissions layout & security compliance and download validation reports
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={handleResetChecklist}
            className="h-9 px-4 border border-rose-500/30 dark:border-rose-500/10 text-rose-600 dark:text-rose-400 bg-rose-500/[0.02] hover:bg-rose-600 hover:text-white dark:hover:bg-rose-500/20 transition-all text-[10px] font-bold uppercase tracking-wider rounded flex items-center gap-1.5 shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset Progress
          </button>
          <button 
            onClick={handleExportExcel}
            className="h-9 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-bold text-[10px] uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-md shadow-emerald-600/10"
          >
            <Download className="w-3.5 h-3.5" /> Export Report
          </button>
        </div>
      </div>

      {/* Progress Dashboard Panel */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Tested Card */}
        <div className="bg-white dark:bg-[#1e2129] p-4 rounded-xl border border-slate-200 dark:border-white/5 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-500/10 text-blue-500 rounded-lg">
            <BookOpen className="w-6 h-6" />
          </div>
          <div className="flex-1 space-y-1">
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Total Tested</p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-800 dark:text-white">{totalTested}</span>
              <span className="text-[11px] font-bold text-slate-400">/ {grandTotal} items</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-white/5 rounded-full h-1.5">
              <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${testedPercent}%` }} />
            </div>
          </div>
        </div>

        {/* Working Card */}
        <div className="bg-white dark:bg-[#1e2129] p-4 rounded-xl border border-slate-200 dark:border-white/5 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-lg">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div className="flex-1 space-y-1">
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Working (Passed)</p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-emerald-500">{totalWorking}</span>
              <span className="text-[11px] font-bold text-slate-400">{workingPercent}% compliance</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-white/5 rounded-full h-1.5">
              <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${workingPercent}%` }} />
            </div>
          </div>
        </div>

        {/* Failing Card */}
        <div className="bg-white dark:bg-[#1e2129] p-4 rounded-xl border border-slate-200 dark:border-white/5 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-rose-500/10 text-rose-500 rounded-lg">
            <XCircle className="w-6 h-6" />
          </div>
          <div className="flex-1 space-y-1">
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Not Working (Failing)</p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-rose-500">{totalFailed}</span>
              <span className="text-[11px] font-bold text-slate-400">{failingPercent}% failed</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-white/5 rounded-full h-1.5">
              <div className="bg-rose-500 h-1.5 rounded-full" style={{ width: `${failingPercent}%` }} />
            </div>
          </div>
        </div>

        {/* Untested Card */}
        <div className="bg-white dark:bg-[#1e2129] p-4 rounded-xl border border-slate-200 dark:border-white/5 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-500/10 text-amber-500 rounded-lg">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div className="flex-1 space-y-1">
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Remaining Untested</p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-amber-500">{totalUntested}</span>
              <span className="text-[11px] font-bold text-slate-400">{100 - testedPercent}% left</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-white/5 rounded-full h-1.5">
              <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: `${100 - testedPercent}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Main Panel Search and Platform Toggles */}
      <div className="bg-white dark:bg-[#1e2129] rounded-xl border border-slate-200 dark:border-white/5 shadow-sm overflow-hidden">
        {/* Tabs row */}
        <div className="flex border-b border-slate-100 dark:border-white/5 bg-slate-50/[0.3] dark:bg-black/[0.05]">
          <button 
            onClick={() => { setActiveTab("pos"); setStatusFilter("all"); }}
            className={`flex-1 py-4 flex items-center justify-center gap-2 text-[12px] font-bold uppercase tracking-widest border-b-2 transition-all ${
              activeTab === "pos" 
                ? "border-emerald-500 text-slate-900 dark:text-white bg-white dark:bg-[#1e2129]" 
                : "border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            }`}
          >
            <Monitor className="w-4 h-4" /> SaSLoop Main (POS Desktop)
            <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-black leading-none ${activeTab === "pos" ? "bg-emerald-500/10 text-emerald-500" : "bg-slate-200 text-slate-500 dark:bg-white/5"}`}>
              {totalPosCount}
            </span>
          </button>
          <button 
            onClick={() => { setActiveTab("mpos"); setStatusFilter("all"); }}
            className={`flex-1 py-4 flex items-center justify-center gap-2 text-[12px] font-bold uppercase tracking-widest border-b-2 transition-all ${
              activeTab === "mpos" 
                ? "border-emerald-500 text-slate-900 dark:text-white bg-white dark:bg-[#1e2129]" 
                : "border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            }`}
          >
            <Smartphone className="w-4 h-4" /> SaSLoop App (MPOS Mobile)
            <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-black leading-none ${activeTab === "mpos" ? "bg-emerald-500/10 text-emerald-500" : "bg-slate-200 text-slate-500 dark:bg-white/5"}`}>
              {totalMposCount}
            </span>
          </button>
        </div>

        {/* Filter bar */}
        <div className="p-4 border-b border-slate-100 dark:border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </span>
            <input 
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by permission title, description, or category..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-[#12151e] border border-slate-200 dark:border-white/5 text-slate-900 dark:text-slate-100 rounded-lg text-[12px] font-medium outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/10 transition-all placeholder:text-slate-450"
            />
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            <button 
              onClick={() => setStatusFilter("all")}
              className={`h-7 px-3 text-[10px] font-bold uppercase tracking-wider rounded transition-all ${statusFilter === "all" ? "bg-slate-800 dark:bg-white/10 text-white" : "bg-slate-100 dark:bg-white/5 text-slate-500 hover:bg-slate-200"}`}
            >
              All
            </button>
            <button 
              onClick={() => setStatusFilter("untested")}
              className={`h-7 px-3 text-[10px] font-bold uppercase tracking-wider rounded transition-all ${statusFilter === "untested" ? "bg-amber-500/10 text-amber-500 border border-amber-500/25" : "bg-slate-100 dark:bg-white/5 text-slate-500 hover:bg-slate-200"}`}
            >
              Untested ({activeTab === "pos" ? posUntested : mposUntested})
            </button>
            <button 
              onClick={() => setStatusFilter("working")}
              className={`h-7 px-3 text-[10px] font-bold uppercase tracking-wider rounded transition-all ${statusFilter === "working" ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/25" : "bg-slate-100 dark:bg-white/5 text-slate-500 hover:bg-slate-200"}`}
            >
              Working ({activeTab === "pos" ? posWorking : mposWorking})
            </button>
            <button 
              onClick={() => setStatusFilter("failing")}
              className={`h-7 px-3 text-[10px] font-bold uppercase tracking-wider rounded transition-all ${statusFilter === "failing" ? "bg-rose-500/10 text-rose-500 border border-rose-500/25" : "bg-slate-100 dark:bg-white/5 text-slate-500 hover:bg-slate-200"}`}
            >
              Failing ({activeTab === "pos" ? posFailed : mposFailed})
            </button>
            
            <div className="w-[1px] h-6 bg-slate-200 dark:bg-white/10 mx-1 hidden sm:block" />
            
            <button 
              onClick={handleMarkAllActiveAsWorking}
              className="h-7 px-3 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/[0.02] hover:bg-emerald-500 hover:text-white transition-all text-[10px] font-bold uppercase tracking-wider rounded flex items-center gap-1"
            >
              <Check className="w-3 h-3" /> Mark All Working
            </button>
          </div>
        </div>

        {/* Permissions Table List */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-white/5 bg-slate-50/[0.3] dark:bg-black/[0.02] text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <th className="px-6 py-3.5 w-32">Category</th>
                <th className="px-6 py-3.5 w-64">Permission</th>
                <th className="px-6 py-3.5">Key & Description</th>
                <th className="px-6 py-3.5 w-60">Test Status</th>
                <th className="px-6 py-3.5 w-[320px]">Bug Details / Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {filteredDataset.map((item) => {
                const id = `${activeTab}_${item.category}_${item.key}`;
                const state = checklist[id] || { status: "untested", notes: "" };
                
                return (
                  <tr key={id} className="hover:bg-slate-50 dark:hover:bg-white/[0.01] transition-colors">
                    {/* Category Column */}
                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-white/5 text-[9px] font-black uppercase tracking-wider text-slate-500">
                        {item.category}
                      </span>
                    </td>
                    
                    {/* Title Column */}
                    <td className="px-6 py-4">
                      <p className="text-[12px] font-bold text-slate-800 dark:text-white uppercase tracking-tight leading-tight">
                        {item.title}
                      </p>
                    </td>

                    {/* Key/Description Column */}
                    <td className="px-6 py-4 space-y-0.5">
                      <p className="text-[10px] font-mono text-slate-400 dark:text-slate-500 font-medium">
                        key: {item.key}
                      </p>
                      <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
                        {item.desc}
                      </p>
                    </td>

                    {/* Status Toggle Radio Button Group */}
                    <td className="px-6 py-4">
                      <div className="flex items-center bg-slate-100 dark:bg-[#12151e] p-0.5 rounded border border-slate-200/50 dark:border-white/5 w-fit">
                        <button
                          onClick={() => handleSetStatus(id, "untested")}
                          className={`h-7 px-2.5 rounded text-[9px] font-black uppercase tracking-wider transition-all ${
                            state.status === "untested" || !state.status
                              ? "bg-white dark:bg-white/10 text-slate-700 dark:text-white shadow-sm font-black"
                              : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                          }`}
                        >
                          Untested
                        </button>
                        <button
                          onClick={() => handleSetStatus(id, "working")}
                          className={`h-7 px-2.5 rounded text-[9px] font-black uppercase tracking-wider transition-all flex items-center gap-1 ${
                            state.status === "working"
                              ? "bg-emerald-500 text-white shadow-sm font-black"
                              : "text-slate-400 hover:text-emerald-500"
                          }`}
                        >
                          <Check className="w-3 h-3" /> Pass
                        </button>
                        <button
                          onClick={() => handleSetStatus(id, "failing")}
                          className={`h-7 px-2.5 rounded text-[9px] font-black uppercase tracking-wider transition-all flex items-center gap-1 ${
                            state.status === "failing"
                              ? "bg-rose-500 text-white shadow-sm font-black"
                              : "text-slate-400 hover:text-rose-500"
                          }`}
                        >
                          <X className="w-3 h-3" /> Fail
                        </button>
                      </div>
                    </td>

                    {/* Comments Notes Column */}
                    <td className="px-6 py-4">
                      <textarea
                        value={state.notes || ""}
                        onChange={(e) => handleSetNote(id, e.target.value)}
                        placeholder="Log bug descriptions or settings glitches here..."
                        className="w-full px-2 py-1.5 bg-slate-50 dark:bg-[#12151e] border border-slate-200 dark:border-white/5 text-slate-900 dark:text-slate-100 rounded text-[11px] font-medium outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/10 placeholder:text-slate-400 h-10 resize-none"
                      />
                    </td>
                  </tr>
                );
              })}

              {filteredDataset.length === 0 && (
                <tr>
                  <td colSpan="5" className="py-24 text-center">
                    <div className="max-w-xs mx-auto space-y-3 opacity-30">
                      <ShieldAlert className="w-12 h-12 mx-auto text-slate-400" />
                      <h4 className="text-[12px] font-bold uppercase tracking-widest text-slate-600 dark:text-slate-300">No matching items found</h4>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Try adjusting your filters or search query</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AccessTestingChecklist;
