import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Shield, Check, X, RefreshCw, AlertCircle, Monitor, User, Lock } from "lucide-react";
import API_BASE from "../config";

const BILLING_DEFAULT = {
  visible: true,
  visible_passcode: false,
  add_charges: true,
  add_charges_passcode: false,
  add_coupon: true,
  add_coupon_passcode: false,
  add_discount: true,
  add_discount_passcode: false,
  add_payment: true,
  allow_draft_bill_printing: true,
  allow_draft_bill_printing_passcode: false,
  modify_bill_status: true,
  modify_bill_status_passcode: false,
  settle_bill: true,
  preview: true,
  preview_passcode: false,
  save_print_bill: true,
  save_bill: true,
  send_bill: true,
  allowed_due_payment: true,
  allowed_due_payment_passcode: false,
  restrict_reprint_bill: true,
  restrict_reprint_bill_passcode: false,
  order_note: true
};

const OLD_KOT_DEFAULT = {
  visible: true,
  visible_passcode: false,
  cancel_kot: true,
  cancel_kot_passcode: false,
  delete_kot: true,
  delete_kot_passcode: false,
  print_cancel_kot: true,
  print_kot: true,
  transfer_item: true,
  transfer_item_passcode: false,
  item_as_complementary: true,
  item_as_complementary_passcode: false,
  check_kot_print: true
};

const SPLIT_BILL_DEFAULT = {
  visible: true,
  visible_passcode: false,
  item_wise: true,
  percentage_wise: true,
  portion_wise: true
};

const KOT_DEFAULT = {
  visible: true,
  item_as_complementary: true,
  item_as_complementary_passcode: false,
  save: true,
  save_and_print: true,
  show_on_bill: true,
  view_customer_history: true,
  print_kot_and_bill: true
};

const QUICK_BILL_DEFAULT = {
  visible: true,
  visible_passcode: false,
  kot: true,
  add_charge: true,
  add_charge_passcode: false,
  add_coupon: true,
  add_coupon_passcode: false,
  add_discount: true,
  add_discount_passcode: false,
  add_payment: true,
  bill_no: true,
  customer_history: true,
  settle_bill: true,
  show_on_bill: true,
  show_preview: true,
  allowed_due_payment: true,
  allowed_due_payment_passcode: false,
  item_as_complementary: true,
  item_as_complementary_passcode: false,
  send_bill: true
};

const ORDER_SETTLEMENT_WINDOW_DEFAULT = {
  visible: true,
  visible_passcode: false,
  update: true,
  update_passcode: false,
  settle: true,
  settle_passcode: false,
  delivery_boy_report: true,
  Action: {
    visible: true,
    update: true,
    settle: true
  }
};

const SETTINGS_DEFAULT = {
  visible: true,
  visible_passcode: false,
  formatting: true,
  general: true,
  general_passcode: false,
  printers: true,
  profile: true,
  shortcuts: true,
  allow_clear_data_on_logout: false
};

const RECEIPTS_DEFAULT = {
  visible: true,
  visible_passcode: false,
  preview: true,
  preview_passcode: false,
  todays_report: true,
  todays_report_passcode: false,
  resync_bills: true,
  resync_bills_passcode: false,
  reprint_bill: true,
  reprint_bill_passcode: false,
  all_bills: true,
  todays_bills: true,
  date_filter: true,
  deleted_status: true,
  deleted_status_passcode: false,
  free_status: true,
  free_status_passcode: false,
  edit_bill_after_save: true,
  edit_bill_after_save_passcode: false,
  tip_amount: true,
  show_bill_amount: true,
  net_sale_amount: true,
  total_fulfilled_amount: true,
  all_bills_amount: true,
  selected_bills: true,
  reverse_inventory: true,
  reverse_inventory_passcode: false,
  EditBill: {
    visible: true,
    visible_passcode: false,
    bill_status: true,
    bill_status_passcode: false,
    payment_mode: true,
    payment_mode_passcode: false
  }
};

const REPORTS_DEFAULT = {
  visible: true,
  visible_passcode: false,
  show_all_user_report: true,
  category_wise_report: true,
  category_wise_report_passcode: false,
  coupon_history: true,
  coupon_history_passcode: false,
  kitchen_dept_wise_report: true,
  kitchen_dept_wise_report_passcode: false,
  order_type_report: true,
  order_type_report_passcode: false,
  payment_report: true,
  payment_report_passcode: false,
  sales_report: true,
  sales_report_passcode: false,
  todays_report: true,
  todays_report_passcode: false,
  user_shift_report: true,
  user_shift_report_passcode: false,
  misc_report: true,
  misc_report_passcode: false,
  pre_order_report: true,
  pre_order_report_passcode: false,
  tax_report: true,
  tax_report_passcode: false,
  mail_report: true,
  mail_report_passcode: false,
  start_close_day_report: true,
  start_close_day_report_passcode: false,
  kot_report: true,
  reservation_report: true,
  reservation_report_passcode: false,
  delivery_boy_report: true,
  delivery_boy_report_passcode: false,
  user_report: true,
  user_report_passcode: false,
  show_amount: true,
  ItemReport: {
    visible: true,
    visible_passcode: false,
    addon_items_report: true,
    cancelled_items_report: true,
    dead_items_report: true,
    deleted_items_report: true,
    sold_items_report: true,
    top_item_report: true,
    complementary_items_report: true
  },
  DuePaymentReport: {
    visible: true,
    visible_passcode: false,
    due_orders: true,
    order_history_report: true
  }
};

const SWITCH_OUTLET_DEFAULT = {
  visible: true,
  visible_passcode: false
};

const CUSTOM_LINKS_DEFAULT = {
  visible: true,
  visible_passcode: false
};

const ONLINE_ORDER_DEFAULT = {
  visible: true,
  visible_passcode: false,
  print_bill: true,
  kot_print: true,
  StoreSettings: {
    visible: true,
    visible_passcode: false,
    store: true,
    store_passcode: false,
    category: true,
    category_passcode: false,
    items: true,
    items_passcode: false,
    options: true,
    options_passcode: false
  }
};

const INITIAL_DEFAULT_STATE = {
  Dashboard: {
    visible: true,
    visible_passcode: false,
    todays_sale: true,
    total_sale: true,
    total_sale_passcode: false,
    item_pie_chart: true,
    bar_sales_chart: true,
    this_month_sale: true,
    line_sales_chart: true,
    all_sales_analysis: true,
    payment_modes_chart: true,
    sales_analysis_by_days: true,
    ip_address: true
  },
  UserManagement: {
    visible: true
  },
  OperationManagement: {
    visible: true,
    ip_address: true,
    ItemsManagement: {
      visible: true,
      category_enabled_disabled: true,
      category_enabled_disabled_passcode: false,
      item_enabled_disabled: true,
      item_enabled_disabled_passcode: false,
      add_item: true,
      add_item_passcode: false,
      edit_item: true,
      edit_item_passcode: false,
      load_menu_from_backoffice: true,
      load_menu_from_backoffice_passcode: false
    }
  },
  Account: {
    visible: true,
    close_day: true,
    close_shift: true,
    cash_drawer_closing_control: true,
    CloseDayWindow: {
      show_payment_transaction_summary: true,
      hide_transaction_count: true,
      hide_settled_amount: true,
      hide_variance_amount: true
    },
    CloseShiftWindow: {
      hide_transaction_count: true,
      hide_settled_amount: true,
      hide_variance_amount: true
    }
  },
  ExpenseManagement: {
    visible: true,
    visible_passcode: false,
    add_category: true,
    sub_category: true,
    add_expense: true,
    cash_drawer: true
  },
  CustomerManagement: {
    visible: true,
    visible_passcode: false,
    add: true,
    edit: true,
    export: true,
    import: true,
    WalletManagement: {
      visible: true,
      visible_passcode: false,
      add_credit: true,
      create_wallet: true,
      view_transactions: true
    }
  },
  MasterManagement: {
    visible: true,
    visible_passcode: false,
    user_management: true,
    ip_address: true,
    AccountOld: {
      visible: true,
      close_day: true,
      close_shift: true
    },
    AddExpense: {
      visible: true,
      add_category: true,
      sub_category: true,
      add_expense: true
    },
    CustomerManagement: {
      visible: true,
      visible_passcode: false,
      add: true,
      edit: true,
      export: true,
      import: true
    },
    WalletManagement: {
      visible: true,
      add_credit: true,
      create_wallet: true,
      view_transactions: true
    }
  },
  OrderWindow: {
    visible: true,
    visible_passcode: false,
    add_customer: true,
    change_table: true,
    change_table_passcode: false,
    waiter_notification: true,
    filter_table: true,
    load_menu: true,
    load_menu_passcode: false,
    modify_bill_after_save: true,
    modify_bill_after_save_passcode: false,
    table_reservation: true,
    refresh_button: true,
    payment_list: true,
    live_order_tracking: true,
    live_support: true,
    search_table: true,
    search_by_code: true,
    search_by_name: true,
    delete_search: true,
    sync_button: true,
    enable_print_settle: true,
    enable_save_settle: true,
    cash_drawer: true,
    payment_notification: true,
    change_order_type: true,
    update_stock: true,
    change_item_price: true,
    change_item_price_passcode: false,
    item_categories: [],
    table_departments: []
  },
  Billing: { ...BILLING_DEFAULT },
  OldKOT: { ...OLD_KOT_DEFAULT },
  SplitBill: { ...SPLIT_BILL_DEFAULT },
  KOT: { ...KOT_DEFAULT },
  Delivery: {
    new_order: true,
    select_delivery_boy: true,
    customer_details_mandatory: false,
    Billing: { ...BILLING_DEFAULT },
    OldKOT: { ...OLD_KOT_DEFAULT },
    SplitBill: { ...SPLIT_BILL_DEFAULT }
  },
  Pickup: {
    new_order: true,
    customer_details_mandatory: false,
    Billing: { ...BILLING_DEFAULT },
    OldKOT: { ...OLD_KOT_DEFAULT },
    SplitBill: { ...SPLIT_BILL_DEFAULT }
  },
  PreOrder: {
    new_order: true,
    customer_details_mandatory: false,
    Billing: { ...BILLING_DEFAULT },
    OldKOT: { ...OLD_KOT_DEFAULT },
    SplitBill: { ...SPLIT_BILL_DEFAULT }
  },
  QuickBill: { ...QUICK_BILL_DEFAULT },
  OrderSettlementWindow: { ...ORDER_SETTLEMENT_WINDOW_DEFAULT },
  Settings: { ...SETTINGS_DEFAULT },
  Receipts: { ...RECEIPTS_DEFAULT },
  Reports: { ...REPORTS_DEFAULT },
  SwitchOutlet: { ...SWITCH_OUTLET_DEFAULT },
  CustomLinks: { ...CUSTOM_LINKS_DEFAULT },
  OnlineOrder: { ...ONLINE_ORDER_DEFAULT }
};

const SwitchField = ({ 
  label, 
  checked, 
  onChange, 
  hasPasscode = false, 
  passcodeChecked = false, 
  onPasscodeChange = null 
}) => {
  const [showPopover, setShowPopover] = useState(false);
  
  return (
    <div className="flex flex-col space-y-1.5 p-3 rounded-lg border border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.01] relative">
      <div className="flex items-center justify-between select-none">
        <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tight leading-snug">
          {label}
        </span>
        {hasPasscode && (
          <div className="relative inline-block">
            <button
              type="button"
              onClick={() => setShowPopover(!showPopover)}
              className="flex items-center text-emerald-800 dark:text-emerald-400 hover:text-emerald-600 transition-all active:scale-95 ml-1"
              title="Manage Passcode Lock"
            >
              <User className="w-3.5 h-3.5" />
              <Lock className="w-2.5 h-2.5 -ml-0.5 mt-1.5" />
            </button>
            
            {showPopover && (
              <>
                <div 
                  className="fixed inset-0 z-40 cursor-default" 
                  onClick={() => setShowPopover(false)} 
                />
                
                <div className="absolute z-50 bottom-full right-0 mb-2 bg-white dark:bg-[#1a1d26] border border-slate-200 dark:border-white/10 rounded-lg shadow-xl p-3 w-36 text-left animate-in fade-in zoom-in-95 duration-150">
                  <div className="space-y-2">
                    <div className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                      Enable Passcode
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-700 dark:text-slate-200">
                        Passcode
                      </span>
                      <label className="relative inline-flex items-center cursor-pointer select-none">
                        <input 
                          type="checkbox" 
                          checked={passcodeChecked || false}
                          onChange={(e) => {
                            if (onPasscodeChange) onPasscodeChange(e.target.checked);
                          }}
                          className="sr-only peer" 
                        />
                        <div className="relative w-8 h-4 bg-slate-200 dark:bg-slate-700 rounded-full peer peer-checked:bg-emerald-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:after:translate-x-4 transition-colors duration-200"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
      
      <label className="relative inline-flex items-center cursor-pointer select-none">
        <input 
          type="checkbox" 
          checked={checked || false}
          onChange={onChange}
          className="sr-only peer" 
        />
        <div className="relative w-10 h-5 bg-slate-200 dark:bg-slate-700 rounded-full peer peer-checked:bg-emerald-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5 transition-colors duration-200"></div>
      </label>
    </div>
  );
};

const SectionHeader = ({ title }) => (
  <div className="px-5 py-3.5 bg-slate-50/50 dark:bg-white/[0.01] border-b border-slate-200 dark:border-white/5 flex items-center justify-between">
    <h3 className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">{title}</h3>
  </div>
);

const SubSectionHeader = ({ title }) => (
  <div className="px-3 py-2 bg-slate-100/30 dark:bg-black/10 border border-slate-150 dark:border-white/5 rounded-lg mb-2">
    <h4 className="text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">{title}</h4>
  </div>
);

const BillingSectionGrid = ({ pathPrefix, data = {}, onToggle }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      <SwitchField label="Is Visible" checked={data.visible} onChange={() => onToggle([...pathPrefix, 'visible'])} hasPasscode={true} passcodeChecked={data.visible_passcode} onPasscodeChange={() => onToggle([...pathPrefix, 'visible_passcode'])} />
      <SwitchField label="Add Charges" checked={data.add_charges} onChange={() => onToggle([...pathPrefix, 'add_charges'])} hasPasscode={true} passcodeChecked={data.add_charges_passcode} onPasscodeChange={() => onToggle([...pathPrefix, 'add_charges_passcode'])} />
      <SwitchField label="Add Coupon" checked={data.add_coupon} onChange={() => onToggle([...pathPrefix, 'add_coupon'])} hasPasscode={true} passcodeChecked={data.add_coupon_passcode} onPasscodeChange={() => onToggle([...pathPrefix, 'add_coupon_passcode'])} />
      <SwitchField label="Add Discount" checked={data.add_discount} onChange={() => onToggle([...pathPrefix, 'add_discount'])} hasPasscode={true} passcodeChecked={data.add_discount_passcode} onPasscodeChange={() => onToggle([...pathPrefix, 'add_discount_passcode'])} />
      <SwitchField label="Add Payment" checked={data.add_payment} onChange={() => onToggle([...pathPrefix, 'add_payment'])} />
      <SwitchField label="Allow Draft Bill Printing" checked={data.allow_draft_bill_printing} onChange={() => onToggle([...pathPrefix, 'allow_draft_bill_printing'])} hasPasscode={true} passcodeChecked={data.allow_draft_bill_printing_passcode} onPasscodeChange={() => onToggle([...pathPrefix, 'allow_draft_bill_printing_passcode'])} />
      <SwitchField label="Modify Bill Status" checked={data.modify_bill_status} onChange={() => onToggle([...pathPrefix, 'modify_bill_status'])} hasPasscode={true} passcodeChecked={data.modify_bill_status_passcode} onPasscodeChange={() => onToggle([...pathPrefix, 'modify_bill_status_passcode'])} />
      <SwitchField label="Settle Bill" checked={data.settle_bill} onChange={() => onToggle([...pathPrefix, 'settle_bill'])} />
      <SwitchField label="Preview" checked={data.preview} onChange={() => onToggle([...pathPrefix, 'preview'])} hasPasscode={true} passcodeChecked={data.preview_passcode} onPasscodeChange={() => onToggle([...pathPrefix, 'preview_passcode'])} />
      <SwitchField label="Save & Print Bill" checked={data.save_print_bill} onChange={() => onToggle([...pathPrefix, 'save_print_bill'])} />
      <SwitchField label="Save Bill" checked={data.save_bill} onChange={() => onToggle([...pathPrefix, 'save_bill'])} />
      <SwitchField label="Send Bill" checked={data.send_bill} onChange={() => onToggle([...pathPrefix, 'send_bill'])} />
      <SwitchField label="Allowed Due Payment" checked={data.allowed_due_payment} onChange={() => onToggle([...pathPrefix, 'allowed_due_payment'])} hasPasscode={true} passcodeChecked={data.allowed_due_payment_passcode} onPasscodeChange={() => onToggle([...pathPrefix, 'allowed_due_payment_passcode'])} />
      {pathPrefix[0] === 'Billing' ? (
        <SwitchField label="Restrict Reprint Bill" checked={data.restrict_reprint_bill} onChange={() => onToggle([...pathPrefix, 'restrict_reprint_bill'])} hasPasscode={true} passcodeChecked={data.restrict_reprint_bill_passcode} onPasscodeChange={() => onToggle([...pathPrefix, 'restrict_reprint_bill_passcode'])} />
      ) : (
        <SwitchField label="Order Note" checked={data.order_note} onChange={() => onToggle([...pathPrefix, 'order_note'])} />
      )}
    </div>
  );
};

const OldKotSectionGrid = ({ pathPrefix, data = {}, onToggle }) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <SwitchField label="Is Visible" checked={data.visible} onChange={() => onToggle([...pathPrefix, 'visible'])} hasPasscode={true} passcodeChecked={data.visible_passcode} onPasscodeChange={() => onToggle([...pathPrefix, 'visible_passcode'])} />
      <SwitchField label="Cancel KOT" checked={data.cancel_kot} onChange={() => onToggle([...pathPrefix, 'cancel_kot'])} hasPasscode={true} passcodeChecked={data.cancel_kot_passcode} onPasscodeChange={() => onToggle([...pathPrefix, 'cancel_kot_passcode'])} />
      <SwitchField label="Delete KOT" checked={data.delete_kot} onChange={() => onToggle([...pathPrefix, 'delete_kot'])} hasPasscode={true} passcodeChecked={data.delete_kot_passcode} onPasscodeChange={() => onToggle([...pathPrefix, 'delete_kot_passcode'])} />
      <SwitchField label="Print Cancel KOT" checked={data.print_cancel_kot} onChange={() => onToggle([...pathPrefix, 'print_cancel_kot'])} />
      <SwitchField label="Print KOT" checked={data.print_kot} onChange={() => onToggle([...pathPrefix, 'print_kot'])} />
      <SwitchField label="Transfer Item" checked={data.transfer_item} onChange={() => onToggle([...pathPrefix, 'transfer_item'])} hasPasscode={true} passcodeChecked={data.transfer_item_passcode} onPasscodeChange={() => onToggle([...pathPrefix, 'transfer_item_passcode'])} />
      <SwitchField label="Item As Complementary" checked={data.item_as_complementary} onChange={() => onToggle([...pathPrefix, 'item_as_complementary'])} hasPasscode={true} passcodeChecked={data.item_as_complementary_passcode} onPasscodeChange={() => onToggle([...pathPrefix, 'item_as_complementary_passcode'])} />
      <SwitchField label="Check KOT Print" checked={data.check_kot_print} onChange={() => onToggle([...pathPrefix, 'check_kot_print'])} />
    </div>
  );
};

const SplitBillSectionGrid = ({ pathPrefix, data = {}, onToggle }) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <SwitchField label="Is Visible" checked={data.visible} onChange={() => onToggle([...pathPrefix, 'visible'])} hasPasscode={true} passcodeChecked={data.visible_passcode} onPasscodeChange={() => onToggle([...pathPrefix, 'visible_passcode'])} />
      <SwitchField label="Item Wise" checked={data.item_wise} onChange={() => onToggle([...pathPrefix, 'item_wise'])} />
      <SwitchField label="Percentage Wise" checked={data.percentage_wise} onChange={() => onToggle([...pathPrefix, 'percentage_wise'])} />
      <SwitchField label="Portion Wise" checked={data.portion_wise} onChange={() => onToggle([...pathPrefix, 'portion_wise'])} />
    </div>
  );
};

const POSAccessManager = ({ userId: propUserId, onClose }) => {
    const { userId: paramUserId } = useParams();
    const userId = propUserId || paramUserId;
    const navigate = useNavigate();
    
    const [user, setUser] = useState(null);
    const [posAccess, setPosAccess] = useState(INITIAL_DEFAULT_STATE);
    const [categories, setCategories] = useState([]);
    const [tableDepartments, setTableDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        const fetchMeta = async () => {
            try {
                const catRes = await fetch(`${API_BASE}/api/brand/categories`, {
                    headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
                });
                if (catRes.ok) {
                    const data = await catRes.json();
                    setCategories(Array.isArray(data) ? data : []);
                }
                
                const tdRes = await fetch(`${API_BASE}/api/brand/table-departments`, {
                    headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
                });
                if (tdRes.ok) {
                    const data = await tdRes.json();
                    setTableDepartments(Array.isArray(data) ? data : []);
                }
            } catch (e) {
                console.error("Failed to load metadata categories/departments:", e);
            }
        };
        fetchMeta();
    }, []);

    useEffect(() => {
        const fetchPOSAccessData = async () => {
            try {
                setLoading(true);
                const res = await fetch(`${API_BASE}/api/brand/users/${userId}/pos-access`, {
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("token")}`
                    }
                });
                if (!res.ok) {
                    throw new Error("Failed to load POS access settings");
                }
                const data = await res.json();
                setUser(data.user);
                
                if (data.pos_access && typeof data.pos_access === "object") {
                  const merged = JSON.parse(JSON.stringify(INITIAL_DEFAULT_STATE));
                  Object.keys(data.pos_access).forEach(key => {
                    if (data.pos_access[key] && typeof data.pos_access[key] === "object") {
                      if (!merged[key]) merged[key] = {};
                      Object.keys(data.pos_access[key]).forEach(subKey => {
                        if (data.pos_access[key][subKey] && typeof data.pos_access[key][subKey] === "object") {
                          if (!merged[key][subKey]) merged[key][subKey] = {};
                          merged[key][subKey] = { ...merged[key][subKey], ...data.pos_access[key][subKey] };
                        } else {
                          merged[key][subKey] = data.pos_access[key][subKey];
                        }
                      });
                    } else {
                      merged[key] = data.pos_access[key];
                    }
                  });
                  setPosAccess(merged);
                }
            } catch (err) {
                setNotification({
                    type: "error",
                    message: err.message || "Failed to retrieve security configuration."
                });
            } finally {
                setLoading(false);
            }
        };

        fetchPOSAccessData();
    }, [userId]);

    const handleToggle = (path) => {
      setPosAccess(prev => {
        const next = JSON.parse(JSON.stringify(prev));
        let current = next;
        for (let i = 0; i < path.length - 1; i++) {
          if (!current[path[i]]) current[path[i]] = {};
          current = current[path[i]];
        }
        const lastKey = path[path.length - 1];
        current[lastKey] = !current[lastKey];
        return next;
      });
    };

    const handleReset = () => {
      setPosAccess(INITIAL_DEFAULT_STATE);
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            const res = await fetch(`${API_BASE}/api/brand/users/${userId}/pos-access`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({ pos_access: posAccess })
            });

            if (res.ok) {
                setNotification({
                    type: "success",
                    message: "SaSLoop Main Access Level saved successfully!"
                });
                setTimeout(() => {
                    if (onClose) onClose();
                    else navigate("/outlet-users");
                }, 1500);
            } else {
                const data = await res.json();
                throw new Error(data.error || "Failed to commit security levels.");
            }
        } catch (err) {
            setNotification({
                type: "error",
                message: err.message
            });
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="h-full flex flex-col space-y-6 animate-in fade-in duration-500 max-w-7xl mx-auto p-4 sm:p-6 text-slate-700 dark:text-slate-200 overflow-hidden">
            {/* Header compact */}
            <div className="flex items-center justify-between bg-white dark:bg-[#1e2129] p-4 rounded-xl border border-slate-200 dark:border-white/5 shadow-sm shrink-0">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg text-emerald-600 dark:text-emerald-400">
                        <Monitor className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-800 dark:text-white tracking-tight">Update Desktop Access Level</h2>
                        <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                            Configure operational privileges for SaSLoop Main desktop billing systems {user?.name ? `for ${user.name}` : ""}
                        </p>
                    </div>
                </div>
                <button 
                    onClick={onClose || (() => navigate("/outlet-users"))}
                    className="p-1.5 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white transition-all"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            {loading ? (
                <div className="flex-1 flex flex-col items-center justify-center bg-white dark:bg-[#1e2129] rounded-xl border border-slate-200 dark:border-white/5 py-32 text-center shadow-sm">
                    <div className="flex flex-col items-center gap-4 animate-pulse">
                        <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">Querying security credentials...</p>
                    </div>
                </div>
            ) : (
                <div className="flex-1 min-h-0 flex flex-col space-y-6 overflow-hidden">
                    {/* Permissions List Panel (Full Width) */}
                    <div className="flex-1 min-h-0 w-full overflow-y-auto pr-2 space-y-6 custom-scrollbar">
                      
                      {/* 1. Dashboard Section */}
                      <div className="bg-white dark:bg-[#1e2129] rounded-xl border border-slate-200 dark:border-white/5 shadow-sm overflow-hidden">
                        <SectionHeader title="Dashboard" />
                        <div className="p-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                          <SwitchField label="Is Visible" checked={posAccess.Dashboard?.visible} onChange={() => handleToggle(['Dashboard', 'visible'])} hasPasscode={true} passcodeChecked={posAccess.Dashboard?.visible_passcode} onPasscodeChange={() => handleToggle(['Dashboard', 'visible_passcode'])} />
                          <SwitchField label="Todays Sale" checked={posAccess.Dashboard?.todays_sale} onChange={() => handleToggle(['Dashboard', 'todays_sale'])} />
                          <SwitchField label="Total Sale" checked={posAccess.Dashboard?.total_sale} onChange={() => handleToggle(['Dashboard', 'total_sale'])} hasPasscode={true} passcodeChecked={posAccess.Dashboard?.total_sale_passcode} onPasscodeChange={() => handleToggle(['Dashboard', 'total_sale_passcode'])} />
                          <SwitchField label="Item Pie Chart" checked={posAccess.Dashboard?.item_pie_chart} onChange={() => handleToggle(['Dashboard', 'item_pie_chart'])} />
                          <SwitchField label="Bar Sales Chart" checked={posAccess.Dashboard?.bar_sales_chart} onChange={() => handleToggle(['Dashboard', 'bar_sales_chart'])} />
                          <SwitchField label="This Month Sale" checked={posAccess.Dashboard?.this_month_sale} onChange={() => handleToggle(['Dashboard', 'this_month_sale'])} />
                          <SwitchField label="Line Sales Chart" checked={posAccess.Dashboard?.line_sales_chart} onChange={() => handleToggle(['Dashboard', 'line_sales_chart'])} />
                          <SwitchField label="All Sales Analysis" checked={posAccess.Dashboard?.all_sales_analysis} onChange={() => handleToggle(['Dashboard', 'all_sales_analysis'])} />
                          <SwitchField label="Payment Modes Chart" checked={posAccess.Dashboard?.payment_modes_chart} onChange={() => handleToggle(['Dashboard', 'payment_modes_chart'])} />
                          <SwitchField label="Sales Analysis By Days" checked={posAccess.Dashboard?.sales_analysis_by_days} onChange={() => handleToggle(['Dashboard', 'sales_analysis_by_days'])} />
                          <SwitchField label="IP Address" checked={posAccess.Dashboard?.ip_address} onChange={() => handleToggle(['Dashboard', 'ip_address'])} />
                        </div>
                      </div>

                      {/* 2. User Management Section */}
                      <div className="bg-white dark:bg-[#1e2129] rounded-xl border border-slate-200 dark:border-white/5 shadow-sm overflow-hidden">
                        <SectionHeader title="User Management" />
                        <div className="p-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                          <SwitchField label="Is Visible" checked={posAccess.UserManagement?.visible} onChange={() => handleToggle(['UserManagement', 'visible'])} />
                        </div>
                      </div>

                      {/* 3. Operation Management Section */}
                      <div className="bg-white dark:bg-[#1e2129] rounded-xl border border-slate-200 dark:border-white/5 shadow-sm overflow-hidden">
                        <SectionHeader title="Operation Management" />
                        <div className="p-5 space-y-4">
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            <SwitchField label="Is Visible" checked={posAccess.OperationManagement?.visible} onChange={() => handleToggle(['OperationManagement', 'visible'])} />
                            <SwitchField label="IP Address" checked={posAccess.OperationManagement?.ip_address} onChange={() => handleToggle(['OperationManagement', 'ip_address'])} />
                          </div>
                          
                           {/* Nested Items Management */}
                          <div className="p-4 rounded-xl border border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-black/10">
                            <SubSectionHeader title="Items Management" />
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                              <SwitchField label="Is Visible" checked={posAccess.OperationManagement?.ItemsManagement?.visible} onChange={() => handleToggle(['OperationManagement', 'ItemsManagement', 'visible'])} />
                              <SwitchField label="Category Enabled / Disabled" checked={posAccess.OperationManagement?.ItemsManagement?.category_enabled_disabled} onChange={() => handleToggle(['OperationManagement', 'ItemsManagement', 'category_enabled_disabled'])} hasPasscode={true} passcodeChecked={posAccess.OperationManagement?.ItemsManagement?.category_enabled_disabled_passcode} onPasscodeChange={() => handleToggle(['OperationManagement', 'ItemsManagement', 'category_enabled_disabled_passcode'])} />
                              <SwitchField label="Item Enabled / Disabled" checked={posAccess.OperationManagement?.ItemsManagement?.item_enabled_disabled} onChange={() => handleToggle(['OperationManagement', 'ItemsManagement', 'item_enabled_disabled'])} hasPasscode={true} passcodeChecked={posAccess.OperationManagement?.ItemsManagement?.item_enabled_disabled_passcode} onPasscodeChange={() => handleToggle(['OperationManagement', 'ItemsManagement', 'item_enabled_disabled_passcode'])} />
                              <SwitchField label="Add Item" checked={posAccess.OperationManagement?.ItemsManagement?.add_item} onChange={() => handleToggle(['OperationManagement', 'ItemsManagement', 'add_item'])} hasPasscode={true} passcodeChecked={posAccess.OperationManagement?.ItemsManagement?.add_item_passcode} onPasscodeChange={() => handleToggle(['OperationManagement', 'ItemsManagement', 'add_item_passcode'])} />
                              <SwitchField label="Edit Item" checked={posAccess.OperationManagement?.ItemsManagement?.edit_item} onChange={() => handleToggle(['OperationManagement', 'ItemsManagement', 'edit_item'])} hasPasscode={true} passcodeChecked={posAccess.OperationManagement?.ItemsManagement?.edit_item_passcode} onPasscodeChange={() => handleToggle(['OperationManagement', 'ItemsManagement', 'edit_item_passcode'])} />
                              <SwitchField label="Load Menu from Backoffice" checked={posAccess.OperationManagement?.ItemsManagement?.load_menu_from_backoffice} onChange={() => handleToggle(['OperationManagement', 'ItemsManagement', 'load_menu_from_backoffice'])} hasPasscode={true} passcodeChecked={posAccess.OperationManagement?.ItemsManagement?.load_menu_from_backoffice_passcode} onPasscodeChange={() => handleToggle(['OperationManagement', 'ItemsManagement', 'load_menu_from_backoffice_passcode'])} />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* 4. Account Section */}
                      <div className="bg-white dark:bg-[#1e2129] rounded-xl border border-slate-200 dark:border-white/5 shadow-sm overflow-hidden">
                        <SectionHeader title="Account" />
                        <div className="p-5 space-y-4">
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            <SwitchField label="Is Visible" checked={posAccess.Account?.visible} onChange={() => handleToggle(['Account', 'visible'])} />
                            <SwitchField label="Close Day" checked={posAccess.Account?.close_day} onChange={() => handleToggle(['Account', 'close_day'])} />
                            <SwitchField label="Close Shift" checked={posAccess.Account?.close_shift} onChange={() => handleToggle(['Account', 'close_shift'])} />
                            <SwitchField label="Cash Drawer Closing Control" checked={posAccess.Account?.cash_drawer_closing_control} onChange={() => handleToggle(['Account', 'cash_drawer_closing_control'])} />
                          </div>

                          {/* Nested Close Day Window */}
                          <div className="p-4 rounded-xl border border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-black/10">
                            <SubSectionHeader title="Close Day Window" />
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                              <SwitchField label="Show Payment Transaction Summary in the Close Day Window" checked={posAccess.Account?.CloseDayWindow?.show_payment_transaction_summary} onChange={() => handleToggle(['Account', 'CloseDayWindow', 'show_payment_transaction_summary'])} />
                              <SwitchField label="Hide Transaction Count in the Payment Transaction Summary" checked={posAccess.Account?.CloseDayWindow?.hide_transaction_count} onChange={() => handleToggle(['Account', 'CloseDayWindow', 'hide_transaction_count'])} />
                              <SwitchField label="Hide Settled Amount in the Payment Transaction Summary" checked={posAccess.Account?.CloseDayWindow?.hide_settled_amount} onChange={() => handleToggle(['Account', 'CloseDayWindow', 'hide_settled_amount'])} />
                              <SwitchField label="Hide Variance Amount in the Payment Transaction Summary" checked={posAccess.Account?.CloseDayWindow?.hide_variance_amount} onChange={() => handleToggle(['Account', 'CloseDayWindow', 'hide_variance_amount'])} />
                            </div>
                          </div>

                          {/* Nested Close Shift Window */}
                          <div className="p-4 rounded-xl border border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-black/10">
                            <SubSectionHeader title="Close Shift Window" />
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <SwitchField label="Hide Transaction Count in the Payment Transaction Summary" checked={posAccess.Account?.CloseShiftWindow?.hide_transaction_count} onChange={() => handleToggle(['Account', 'CloseShiftWindow', 'hide_transaction_count'])} />
                              <SwitchField label="Hide Settled Amount in the Payment Transaction Summary" checked={posAccess.Account?.CloseShiftWindow?.hide_settled_amount} onChange={() => handleToggle(['Account', 'CloseShiftWindow', 'hide_settled_amount'])} />
                              <SwitchField label="Hide Variance Amount in the Payment Transaction Summary" checked={posAccess.Account?.CloseShiftWindow?.hide_variance_amount} onChange={() => handleToggle(['Account', 'CloseShiftWindow', 'hide_variance_amount'])} />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* 5. Expense Management Section */}
                      <div className="bg-white dark:bg-[#1e2129] rounded-xl border border-slate-200 dark:border-white/5 shadow-sm overflow-hidden">
                        <SectionHeader title="Expense Management" />
                        <div className="p-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                          <SwitchField label="Is Visible" checked={posAccess.ExpenseManagement?.visible} onChange={() => handleToggle(['ExpenseManagement', 'visible'])} hasPasscode={true} passcodeChecked={posAccess.ExpenseManagement?.visible_passcode} onPasscodeChange={() => handleToggle(['ExpenseManagement', 'visible_passcode'])} />
                          <SwitchField label="Add Category" checked={posAccess.ExpenseManagement?.add_category} onChange={() => handleToggle(['ExpenseManagement', 'add_category'])} />
                          <SwitchField label="Sub Category" checked={posAccess.ExpenseManagement?.sub_category} onChange={() => handleToggle(['ExpenseManagement', 'sub_category'])} />
                          <SwitchField label="Add Expense" checked={posAccess.ExpenseManagement?.add_expense} onChange={() => handleToggle(['ExpenseManagement', 'add_expense'])} />
                          <SwitchField label="Cash Drawer" checked={posAccess.ExpenseManagement?.cash_drawer} onChange={() => handleToggle(['ExpenseManagement', 'cash_drawer'])} />
                        </div>
                      </div>

                      {/* 6. Customer Management Section */}
                      <div className="bg-white dark:bg-[#1e2129] rounded-xl border border-slate-200 dark:border-white/5 shadow-sm overflow-hidden">
                        <SectionHeader title="Customer Management" />
                        <div className="p-5 space-y-4">
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            <SwitchField label="Is Visible" checked={posAccess.CustomerManagement?.visible} onChange={() => handleToggle(['CustomerManagement', 'visible'])} hasPasscode={true} passcodeChecked={posAccess.CustomerManagement?.visible_passcode} onPasscodeChange={() => handleToggle(['CustomerManagement', 'visible_passcode'])} />
                            <SwitchField label="Add" checked={posAccess.CustomerManagement?.add} onChange={() => handleToggle(['CustomerManagement', 'add'])} />
                            <SwitchField label="Edit" checked={posAccess.CustomerManagement?.edit} onChange={() => handleToggle(['CustomerManagement', 'edit'])} />
                            <SwitchField label="Export" checked={posAccess.CustomerManagement?.export} onChange={() => handleToggle(['CustomerManagement', 'export'])} />
                            <SwitchField label="Import" checked={posAccess.CustomerManagement?.import} onChange={() => handleToggle(['CustomerManagement', 'import'])} />
                          </div>

                          {/* Nested Wallet Management */}
                          <div className="p-4 rounded-xl border border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-black/10">
                            <SubSectionHeader title="Wallet Management" />
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                              <SwitchField label="Is Visible" checked={posAccess.CustomerManagement?.WalletManagement?.visible} onChange={() => handleToggle(['CustomerManagement', 'WalletManagement', 'visible'])} hasPasscode={true} passcodeChecked={posAccess.CustomerManagement?.WalletManagement?.visible_passcode} onPasscodeChange={() => handleToggle(['CustomerManagement', 'WalletManagement', 'visible_passcode'])} />
                              <SwitchField label="Add Credit" checked={posAccess.CustomerManagement?.WalletManagement?.add_credit} onChange={() => handleToggle(['CustomerManagement', 'WalletManagement', 'add_credit'])} />
                              <SwitchField label="Create Wallet" checked={posAccess.CustomerManagement?.WalletManagement?.create_wallet} onChange={() => handleToggle(['CustomerManagement', 'WalletManagement', 'create_wallet'])} />
                              <SwitchField label="View Transactions" checked={posAccess.CustomerManagement?.WalletManagement?.view_transactions} onChange={() => handleToggle(['CustomerManagement', 'WalletManagement', 'view_transactions'])} />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* 7. Master Management Section */}
                      <div className="bg-white dark:bg-[#1e2129] rounded-xl border border-slate-200 dark:border-white/5 shadow-sm overflow-hidden">
                        <SectionHeader title="Master Management" />
                        <div className="p-5 space-y-4">
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            <SwitchField label="Is Visible" checked={posAccess.MasterManagement?.visible} onChange={() => handleToggle(['MasterManagement', 'visible'])} hasPasscode={true} passcodeChecked={posAccess.MasterManagement?.visible_passcode} onPasscodeChange={() => handleToggle(['MasterManagement', 'visible_passcode'])} />
                            <SwitchField label="User Management" checked={posAccess.MasterManagement?.user_management} onChange={() => handleToggle(['MasterManagement', 'user_management'])} />
                            <SwitchField label="IP Address" checked={posAccess.MasterManagement?.ip_address} onChange={() => handleToggle(['MasterManagement', 'ip_address'])} />
                          </div>

                          {/* Sub subgroups in Master Management */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            
                            <div className="p-4 rounded-xl border border-slate-150 dark:border-white/5 bg-slate-50/50 dark:bg-black/10">
                              <SubSectionHeader title="Account Old" />
                              <div className="grid grid-cols-3 gap-2">
                                <SwitchField label="Is Visible" checked={posAccess.MasterManagement?.AccountOld?.visible} onChange={() => handleToggle(['MasterManagement', 'AccountOld', 'visible'])} />
                                <SwitchField label="Close Day" checked={posAccess.MasterManagement?.AccountOld?.close_day} onChange={() => handleToggle(['MasterManagement', 'AccountOld', 'close_day'])} />
                                <SwitchField label="Close Shift" checked={posAccess.MasterManagement?.AccountOld?.close_shift} onChange={() => handleToggle(['MasterManagement', 'AccountOld', 'close_shift'])} />
                              </div>
                            </div>

                            <div className="p-4 rounded-xl border border-slate-150 dark:border-white/5 bg-slate-50/50 dark:bg-black/10">
                              <SubSectionHeader title="Add Expense" />
                              <div className="grid grid-cols-2 gap-2">
                                <SwitchField label="Is Visible" checked={posAccess.MasterManagement?.AddExpense?.visible} onChange={() => handleToggle(['MasterManagement', 'AddExpense', 'visible'])} />
                                <SwitchField label="Add Category" checked={posAccess.MasterManagement?.AddExpense?.add_category} onChange={() => handleToggle(['MasterManagement', 'AddExpense', 'add_category'])} />
                                <SwitchField label="Sub Category" checked={posAccess.MasterManagement?.AddExpense?.sub_category} onChange={() => handleToggle(['MasterManagement', 'AddExpense', 'sub_category'])} />
                                <SwitchField label="Add Expense" checked={posAccess.MasterManagement?.AddExpense?.add_expense} onChange={() => handleToggle(['MasterManagement', 'AddExpense', 'add_expense'])} />
                              </div>
                            </div>

                            <div className="p-4 rounded-xl border border-slate-150 dark:border-white/5 bg-slate-50/50 dark:bg-black/10">
                              <SubSectionHeader title="Customer Management" />
                              <div className="grid grid-cols-2 gap-2">
                                <SwitchField label="Is Visible" checked={posAccess.MasterManagement?.CustomerManagement?.visible} onChange={() => handleToggle(['MasterManagement', 'CustomerManagement', 'visible'])} hasPasscode={true} passcodeChecked={posAccess.MasterManagement?.CustomerManagement?.visible_passcode} onPasscodeChange={() => handleToggle(['MasterManagement', 'CustomerManagement', 'visible_passcode'])} />
                                <SwitchField label="Add" checked={posAccess.MasterManagement?.CustomerManagement?.add} onChange={() => handleToggle(['MasterManagement', 'CustomerManagement', 'add'])} />
                                <SwitchField label="Edit" checked={posAccess.MasterManagement?.CustomerManagement?.edit} onChange={() => handleToggle(['MasterManagement', 'CustomerManagement', 'edit'])} />
                                <SwitchField label="Export" checked={posAccess.MasterManagement?.CustomerManagement?.export} onChange={() => handleToggle(['MasterManagement', 'CustomerManagement', 'export'])} />
                                <SwitchField label="Import" checked={posAccess.MasterManagement?.CustomerManagement?.import} onChange={() => handleToggle(['MasterManagement', 'CustomerManagement', 'import'])} />
                              </div>
                            </div>

                            <div className="p-4 rounded-xl border border-slate-150 dark:border-white/5 bg-slate-50/50 dark:bg-black/10">
                              <SubSectionHeader title="Wallet Management" />
                              <div className="grid grid-cols-2 gap-2">
                                <SwitchField label="Is Visible" checked={posAccess.MasterManagement?.WalletManagement?.visible} onChange={() => handleToggle(['MasterManagement', 'WalletManagement', 'visible'])} />
                                <SwitchField label="Add Credit" checked={posAccess.MasterManagement?.WalletManagement?.add_credit} onChange={() => handleToggle(['MasterManagement', 'WalletManagement', 'add_credit'])} />
                                <SwitchField label="Create Wallet" checked={posAccess.MasterManagement?.WalletManagement?.create_wallet} onChange={() => handleToggle(['MasterManagement', 'WalletManagement', 'create_wallet'])} />
                                <SwitchField label="View Transactions" checked={posAccess.MasterManagement?.WalletManagement?.view_transactions} onChange={() => handleToggle(['MasterManagement', 'WalletManagement', 'view_transactions'])} />
                              </div>
                            </div>

                          </div>
                        </div>
                      </div>

                      {/* 8. Order Window Section */}
                      <div className="bg-white dark:bg-[#1e2129] rounded-xl border border-slate-200 dark:border-white/5 shadow-sm overflow-hidden">
                        <SectionHeader title="Order Window" />
                        <div className="p-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                          <SwitchField label="Is Visible" checked={posAccess.OrderWindow?.visible} onChange={() => handleToggle(['OrderWindow', 'visible'])} hasPasscode={true} passcodeChecked={posAccess.OrderWindow?.visible_passcode} onPasscodeChange={() => handleToggle(['OrderWindow', 'visible_passcode'])} />
                          <SwitchField label="Add Customer" checked={posAccess.OrderWindow?.add_customer} onChange={() => handleToggle(['OrderWindow', 'add_customer'])} />
                          <SwitchField label="Change Table" checked={posAccess.OrderWindow?.change_table} onChange={() => handleToggle(['OrderWindow', 'change_table'])} hasPasscode={true} passcodeChecked={posAccess.OrderWindow?.change_table_passcode} onPasscodeChange={() => handleToggle(['OrderWindow', 'change_table_passcode'])} />
                          <SwitchField label="Waiter Notification" checked={posAccess.OrderWindow?.waiter_notification} onChange={() => handleToggle(['OrderWindow', 'waiter_notification'])} />
                          <SwitchField label="Filter Table" checked={posAccess.OrderWindow?.filter_table} onChange={() => handleToggle(['OrderWindow', 'filter_table'])} />
                          <SwitchField label="Load Menu" checked={posAccess.OrderWindow?.load_menu} onChange={() => handleToggle(['OrderWindow', 'load_menu'])} hasPasscode={true} passcodeChecked={posAccess.OrderWindow?.load_menu_passcode} onPasscodeChange={() => handleToggle(['OrderWindow', 'load_menu_passcode'])} />
                          <SwitchField label="Modify Bill After Save" checked={posAccess.OrderWindow?.modify_bill_after_save} onChange={() => handleToggle(['OrderWindow', 'modify_bill_after_save'])} hasPasscode={true} passcodeChecked={posAccess.OrderWindow?.modify_bill_after_save_passcode} onPasscodeChange={() => handleToggle(['OrderWindow', 'modify_bill_after_save_passcode'])} />
                          <SwitchField label="Table Reservation" checked={posAccess.OrderWindow?.table_reservation} onChange={() => handleToggle(['OrderWindow', 'table_reservation'])} />
                          <SwitchField label="Refresh Button" checked={posAccess.OrderWindow?.refresh_button} onChange={() => handleToggle(['OrderWindow', 'refresh_button'])} />
                          <SwitchField label="Payment List" checked={posAccess.OrderWindow?.payment_list} onChange={() => handleToggle(['OrderWindow', 'payment_list'])} />
                          <SwitchField label="Live Order Tracking" checked={posAccess.OrderWindow?.live_order_tracking} onChange={() => handleToggle(['OrderWindow', 'live_order_tracking'])} />
                          <SwitchField label="Live Support" checked={posAccess.OrderWindow?.live_support} onChange={() => handleToggle(['OrderWindow', 'live_support'])} />
                          <SwitchField label="Search Table" checked={posAccess.OrderWindow?.search_table} onChange={() => handleToggle(['OrderWindow', 'search_table'])} />
                          <SwitchField label="Search By Code" checked={posAccess.OrderWindow?.search_by_code} onChange={() => handleToggle(['OrderWindow', 'search_by_code'])} />
                          <SwitchField label="Search By Name" checked={posAccess.OrderWindow?.search_by_name} onChange={() => handleToggle(['OrderWindow', 'search_by_name'])} />
                          <SwitchField label="Delete Search" checked={posAccess.OrderWindow?.delete_search} onChange={() => handleToggle(['OrderWindow', 'delete_search'])} />
                          <SwitchField label="Sync Button" checked={posAccess.OrderWindow?.sync_button} onChange={() => handleToggle(['OrderWindow', 'sync_button'])} />
                          <SwitchField label="Enable Print & Settle Bills" checked={posAccess.OrderWindow?.enable_print_settle} onChange={() => handleToggle(['OrderWindow', 'enable_print_settle'])} />
                          <SwitchField label="Enable Save & Settle Bills" checked={posAccess.OrderWindow?.enable_save_settle} onChange={() => handleToggle(['OrderWindow', 'enable_save_settle'])} />
                          <SwitchField label="Cash Drawer" checked={posAccess.OrderWindow?.cash_drawer} onChange={() => handleToggle(['OrderWindow', 'cash_drawer'])} />
                          <SwitchField label="Payment Notification" checked={posAccess.OrderWindow?.payment_notification} onChange={() => handleToggle(['OrderWindow', 'payment_notification'])} />
                          <SwitchField label="Change Order Type" checked={posAccess.OrderWindow?.change_order_type} onChange={() => handleToggle(['OrderWindow', 'change_order_type'])} />
                          <SwitchField label="Update Stock" checked={posAccess.OrderWindow?.update_stock} onChange={() => handleToggle(['OrderWindow', 'update_stock'])} />
                          <SwitchField label="Change Item Price" checked={posAccess.OrderWindow?.change_item_price} onChange={() => handleToggle(['OrderWindow', 'change_item_price'])} hasPasscode={true} passcodeChecked={posAccess.OrderWindow?.change_item_price_passcode} onPasscodeChange={() => handleToggle(['OrderWindow', 'change_item_price_passcode'])} />
                        </div>

                        {/* Multiselect Select Box for Categories and Table Departments */}
                        <div className="p-5 border-t border-slate-200 dark:border-white/5 grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50/20 dark:bg-white/[0.01]">
                          <div className="space-y-2">
                            <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Item Categories</label>
                            <select
                              multiple
                              value={Array.isArray(posAccess.OrderWindow?.item_categories) ? posAccess.OrderWindow.item_categories : (posAccess.OrderWindow?.item_categories === true ? categories.map(c => c.name) : [])}
                              onChange={(e) => {
                                const values = Array.from(e.target.selectedOptions, option => option.value);
                                setPosAccess(prev => ({
                                  ...prev,
                                  OrderWindow: {
                                    ...prev.OrderWindow,
                                    item_categories: values
                                  }
                                }));
                              }}
                              className="w-full h-32 bg-white dark:bg-[#1a1d26] text-slate-900 dark:text-slate-100 border border-slate-350 dark:border-slate-700/60 rounded-md p-2 text-[12px] focus:outline-none focus:ring-1 focus:ring-emerald-500"
                            >
                              <option disabled className="text-slate-400 font-bold uppercase py-1 text-[10px]">Select Item Categories</option>
                              {categories.map(c => (
                                <option key={c.id} value={c.name}>{c.name}</option>
                              ))}
                            </select>
                          </div>

                          <div className="space-y-2">
                            <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Table Departments</label>
                            <select
                              multiple
                              value={Array.isArray(posAccess.OrderWindow?.table_departments) ? posAccess.OrderWindow.table_departments : (posAccess.OrderWindow?.table_departments === true ? tableDepartments.map(td => td.name) : [])}
                              onChange={(e) => {
                                const values = Array.from(e.target.selectedOptions, option => option.value);
                                setPosAccess(prev => ({
                                  ...prev,
                                  OrderWindow: {
                                    ...prev.OrderWindow,
                                    table_departments: values
                                  }
                                }));
                              }}
                              className="w-full h-32 bg-white dark:bg-[#1a1d26] text-slate-900 dark:text-slate-100 border border-slate-350 dark:border-slate-700/60 rounded-md p-2 text-[12px] focus:outline-none focus:ring-1 focus:ring-emerald-500"
                            >
                              <option disabled className="text-slate-400 font-bold uppercase py-1 text-[10px]">Select Table Department</option>
                              {tableDepartments.map(td => (
                                <option key={td.id} value={td.name}>{td.name}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* 9. Billing Section */}
                      <div className="bg-white dark:bg-[#1e2129] rounded-xl border border-slate-200 dark:border-white/5 shadow-sm overflow-hidden">
                        <SectionHeader title="Billing" />
                        <div className="p-5">
                          <BillingSectionGrid pathPrefix={['Billing']} data={posAccess.Billing} onToggle={handleToggle} />
                        </div>
                      </div>

                      {/* 10. Old KOT & Split Bill Side-by-Side */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white dark:bg-[#1e2129] rounded-xl border border-slate-200 dark:border-white/5 shadow-sm overflow-hidden">
                          <SectionHeader title="Old KOT" />
                          <div className="p-5">
                            <OldKotSectionGrid pathPrefix={['OldKOT']} data={posAccess.OldKOT} onToggle={handleToggle} />
                          </div>
                        </div>

                        <div className="bg-white dark:bg-[#1e2129] rounded-xl border border-slate-200 dark:border-white/5 shadow-sm overflow-hidden">
                          <SectionHeader title="Split Bill" />
                          <div className="p-5">
                            <SplitBillSectionGrid pathPrefix={['SplitBill']} data={posAccess.SplitBill} onToggle={handleToggle} />
                          </div>
                        </div>
                      </div>

                      {/* 11. KOT Section */}
                      <div className="bg-white dark:bg-[#1e2129] rounded-xl border border-slate-200 dark:border-white/5 shadow-sm overflow-hidden">
                        <SectionHeader title="KOT" />
                        <div className="p-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                          <SwitchField label="Is Visible" checked={posAccess.KOT?.visible} onChange={() => handleToggle(['KOT', 'visible'])} />
                          <SwitchField label="Item As Complementary" checked={posAccess.KOT?.item_as_complementary} onChange={() => handleToggle(['KOT', 'item_as_complementary'])} hasPasscode={true} passcodeChecked={posAccess.KOT?.item_as_complementary_passcode} onPasscodeChange={() => handleToggle(['KOT', 'item_as_complementary_passcode'])} />
                          <SwitchField label="Save" checked={posAccess.KOT?.save} onChange={() => handleToggle(['KOT', 'save'])} />
                          <SwitchField label="Save And Print" checked={posAccess.KOT?.save_and_print} onChange={() => handleToggle(['KOT', 'save_and_print'])} />
                          <SwitchField label="Show On Bill" checked={posAccess.KOT?.show_on_bill} onChange={() => handleToggle(['KOT', 'show_on_bill'])} />
                          <SwitchField label="View Customer History" checked={posAccess.KOT?.view_customer_history} onChange={() => handleToggle(['KOT', 'view_customer_history'])} />
                          <SwitchField label="Print KOT and Bill" checked={posAccess.KOT?.print_kot_and_bill} onChange={() => handleToggle(['KOT', 'print_kot_and_bill'])} />
                        </div>
                      </div>

                      {/* 12. Delivery Section */}
                      <div className="bg-white dark:bg-[#1e2129] rounded-xl border border-slate-200 dark:border-white/5 shadow-sm overflow-hidden">
                        <SectionHeader title="Delivery" />
                        <div className="p-5 space-y-6">
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            <SwitchField label="New Order" checked={posAccess.Delivery?.new_order} onChange={() => handleToggle(['Delivery', 'new_order'])} />
                            <SwitchField label="Select Delivery Boy" checked={posAccess.Delivery?.select_delivery_boy} onChange={() => handleToggle(['Delivery', 'select_delivery_boy'])} />
                            <SwitchField label="Customer Details Mandatory" checked={posAccess.Delivery?.customer_details_mandatory} onChange={() => handleToggle(['Delivery', 'customer_details_mandatory'])} />
                          </div>
                          
                          <div className="p-4 rounded-xl border border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-black/10">
                            <SubSectionHeader title="Billing" />
                            <BillingSectionGrid pathPrefix={['Delivery', 'Billing']} data={posAccess.Delivery?.Billing} onToggle={handleToggle} />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 rounded-xl border border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-black/10">
                              <SubSectionHeader title="Old KOT" />
                              <OldKotSectionGrid pathPrefix={['Delivery', 'OldKOT']} data={posAccess.Delivery?.OldKOT} onToggle={handleToggle} />
                            </div>
                            <div className="p-4 rounded-xl border border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-black/10">
                              <SubSectionHeader title="Split Bill" />
                              <SplitBillSectionGrid pathPrefix={['Delivery', 'SplitBill']} data={posAccess.Delivery?.SplitBill} onToggle={handleToggle} />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* 13. Pickup Section */}
                      <div className="bg-white dark:bg-[#1e2129] rounded-xl border border-slate-200 dark:border-white/5 shadow-sm overflow-hidden">
                        <SectionHeader title="Pickup" />
                        <div className="p-5 space-y-6">
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            <SwitchField label="New Order" checked={posAccess.Pickup?.new_order} onChange={() => handleToggle(['Pickup', 'new_order'])} />
                            <SwitchField label="Customer Details Mandatory" checked={posAccess.Pickup?.customer_details_mandatory} onChange={() => handleToggle(['Pickup', 'customer_details_mandatory'])} />
                          </div>
                          
                          <div className="p-4 rounded-xl border border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-black/10">
                            <SubSectionHeader title="Billing" />
                            <BillingSectionGrid pathPrefix={['Pickup', 'Billing']} data={posAccess.Pickup?.Billing} onToggle={handleToggle} />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 rounded-xl border border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-black/10">
                              <SubSectionHeader title="Old KOT" />
                              <OldKotSectionGrid pathPrefix={['Pickup', 'OldKOT']} data={posAccess.Pickup?.OldKOT} onToggle={handleToggle} />
                            </div>
                            <div className="p-4 rounded-xl border border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-black/10">
                              <SubSectionHeader title="Split Bill" />
                              <SplitBillSectionGrid pathPrefix={['Pickup', 'SplitBill']} data={posAccess.Pickup?.SplitBill} onToggle={handleToggle} />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* 13b. Prebooking Section */}
                      <div className="bg-white dark:bg-[#1e2129] rounded-xl border border-slate-200 dark:border-white/5 shadow-sm overflow-hidden">
                        <SectionHeader title="Prebooking" />
                        <div className="p-5 space-y-6">
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            <SwitchField label="New Order" checked={posAccess.PreOrder?.new_order} onChange={() => handleToggle(['PreOrder', 'new_order'])} />
                            <SwitchField label="Customer Details Mandatory" checked={posAccess.PreOrder?.customer_details_mandatory} onChange={() => handleToggle(['PreOrder', 'customer_details_mandatory'])} />
                          </div>
                          
                          <div className="p-4 rounded-xl border border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-black/10">
                            <SubSectionHeader title="Billing" />
                            <BillingSectionGrid pathPrefix={['PreOrder', 'Billing']} data={posAccess.PreOrder?.Billing} onToggle={handleToggle} />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 rounded-xl border border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-black/10">
                              <SubSectionHeader title="Old KOT" />
                              <OldKotSectionGrid pathPrefix={['PreOrder', 'OldKOT']} data={posAccess.PreOrder?.OldKOT} onToggle={handleToggle} />
                            </div>
                            <div className="p-4 rounded-xl border border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-black/10">
                              <SubSectionHeader title="Split Bill" />
                              <SplitBillSectionGrid pathPrefix={['PreOrder', 'SplitBill']} data={posAccess.PreOrder?.SplitBill} onToggle={handleToggle} />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* 14. Quick Bill Section */}
                      <div className="bg-white dark:bg-[#1e2129] rounded-xl border border-slate-200 dark:border-white/5 shadow-sm overflow-hidden">
                        <SectionHeader title="Quick Bill" />
                        <div className="p-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                          <SwitchField label="Is Visible" checked={posAccess.QuickBill?.visible} onChange={() => handleToggle(['QuickBill', 'visible'])} hasPasscode={true} passcodeChecked={posAccess.QuickBill?.visible_passcode} onPasscodeChange={() => handleToggle(['QuickBill', 'visible_passcode'])} />
                          <SwitchField label="KOT" checked={posAccess.QuickBill?.kot} onChange={() => handleToggle(['QuickBill', 'kot'])} />
                          <SwitchField label="Add Charge" checked={posAccess.QuickBill?.add_charge} onChange={() => handleToggle(['QuickBill', 'add_charge'])} hasPasscode={true} passcodeChecked={posAccess.QuickBill?.add_charge_passcode} onPasscodeChange={() => handleToggle(['QuickBill', 'add_charge_passcode'])} />
                          <SwitchField label="Add Coupon" checked={posAccess.QuickBill?.add_coupon} onChange={() => handleToggle(['QuickBill', 'add_coupon'])} hasPasscode={true} passcodeChecked={posAccess.QuickBill?.add_coupon_passcode} onPasscodeChange={() => handleToggle(['QuickBill', 'add_coupon_passcode'])} />
                          <SwitchField label="Add Discount" checked={posAccess.QuickBill?.add_discount} onChange={() => handleToggle(['QuickBill', 'add_discount'])} hasPasscode={true} passcodeChecked={posAccess.QuickBill?.add_discount_passcode} onPasscodeChange={() => handleToggle(['QuickBill', 'add_discount_passcode'])} />
                          <SwitchField label="Add Payment" checked={posAccess.QuickBill?.add_payment} onChange={() => handleToggle(['QuickBill', 'add_payment'])} />
                          <SwitchField label="Bill No" checked={posAccess.QuickBill?.bill_no} onChange={() => handleToggle(['QuickBill', 'bill_no'])} />
                          <SwitchField label="Customer History" checked={posAccess.QuickBill?.customer_history} onChange={() => handleToggle(['QuickBill', 'customer_history'])} />
                          <SwitchField label="Settle Bill" checked={posAccess.QuickBill?.settle_bill} onChange={() => handleToggle(['QuickBill', 'settle_bill'])} />
                          <SwitchField label="Show On Bill" checked={posAccess.QuickBill?.show_on_bill} onChange={() => handleToggle(['QuickBill', 'show_on_bill'])} />
                          <SwitchField label="Show Preview" checked={posAccess.QuickBill?.show_preview} onChange={() => handleToggle(['QuickBill', 'show_preview'])} />
                          <SwitchField label="Allowed Due Payment" checked={posAccess.QuickBill?.allowed_due_payment} onChange={() => handleToggle(['QuickBill', 'allowed_due_payment'])} hasPasscode={true} passcodeChecked={posAccess.QuickBill?.allowed_due_payment_passcode} onPasscodeChange={() => handleToggle(['QuickBill', 'allowed_due_payment_passcode'])} />
                          <SwitchField label="Item As Complementary" checked={posAccess.QuickBill?.item_as_complementary} onChange={() => handleToggle(['QuickBill', 'item_as_complementary'])} hasPasscode={true} passcodeChecked={posAccess.QuickBill?.item_as_complementary_passcode} onPasscodeChange={() => handleToggle(['QuickBill', 'item_as_complementary_passcode'])} />
                          <SwitchField label="Send Bill" checked={posAccess.QuickBill?.send_bill} onChange={() => handleToggle(['QuickBill', 'send_bill'])} />
                        </div>
                      </div>

                      {/* 15. Order Settlement Window Section */}
                      <div className="bg-white dark:bg-[#1e2129] rounded-xl border border-slate-200 dark:border-white/5 shadow-sm overflow-hidden">
                        <SectionHeader title="Order Settlement Window" />
                        <div className="p-5 space-y-6">
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            <SwitchField label="Is Visible" checked={posAccess.OrderSettlementWindow?.visible} onChange={() => handleToggle(['OrderSettlementWindow', 'visible'])} hasPasscode={true} passcodeChecked={posAccess.OrderSettlementWindow?.visible_passcode} onPasscodeChange={() => handleToggle(['OrderSettlementWindow', 'visible_passcode'])} />
                            <SwitchField label="Update" checked={posAccess.OrderSettlementWindow?.update} onChange={() => handleToggle(['OrderSettlementWindow', 'update'])} hasPasscode={true} passcodeChecked={posAccess.OrderSettlementWindow?.update_passcode} onPasscodeChange={() => handleToggle(['OrderSettlementWindow', 'update_passcode'])} />
                            <SwitchField label="Settle" checked={posAccess.OrderSettlementWindow?.settle} onChange={() => handleToggle(['OrderSettlementWindow', 'settle'])} hasPasscode={true} passcodeChecked={posAccess.OrderSettlementWindow?.settle_passcode} onPasscodeChange={() => handleToggle(['OrderSettlementWindow', 'settle_passcode'])} />
                            <SwitchField label="Delivery Boy Report" checked={posAccess.OrderSettlementWindow?.delivery_boy_report} onChange={() => handleToggle(['OrderSettlementWindow', 'delivery_boy_report'])} />
                          </div>

                          <div className="p-4 rounded-xl border border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-black/10">
                            <SubSectionHeader title="Action" />
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                              <SwitchField label="Is Visible" checked={posAccess.OrderSettlementWindow?.Action?.visible} onChange={() => handleToggle(['OrderSettlementWindow', 'Action', 'visible'])} />
                              <SwitchField label="Update" checked={posAccess.OrderSettlementWindow?.Action?.update} onChange={() => handleToggle(['OrderSettlementWindow', 'Action', 'update'])} />
                              <SwitchField label="Settle" checked={posAccess.OrderSettlementWindow?.Action?.settle} onChange={() => handleToggle(['OrderSettlementWindow', 'Action', 'settle'])} />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* 16. Settings Section */}
                      <div className="bg-white dark:bg-[#1e2129] rounded-xl border border-slate-200 dark:border-white/5 shadow-sm overflow-hidden">
                        <SectionHeader title="Settings" />
                        <div className="p-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                          <SwitchField label="Is Visible" checked={posAccess.Settings?.visible} onChange={() => handleToggle(['Settings', 'visible'])} hasPasscode={true} passcodeChecked={posAccess.Settings?.visible_passcode} onPasscodeChange={() => handleToggle(['Settings', 'visible_passcode'])} />
                          <SwitchField label="Formatting" checked={posAccess.Settings?.formatting} onChange={() => handleToggle(['Settings', 'formatting'])} />
                          <SwitchField label="General" checked={posAccess.Settings?.general} onChange={() => handleToggle(['Settings', 'general'])} hasPasscode={true} passcodeChecked={posAccess.Settings?.general_passcode} onPasscodeChange={() => handleToggle(['Settings', 'general_passcode'])} />
                          <SwitchField label="Printers" checked={posAccess.Settings?.printers} onChange={() => handleToggle(['Settings', 'printers'])} />
                          <SwitchField label="Profile" checked={posAccess.Settings?.profile} onChange={() => handleToggle(['Settings', 'profile'])} />
                          <SwitchField label="Shortcuts" checked={posAccess.Settings?.shortcuts} onChange={() => handleToggle(['Settings', 'shortcuts'])} />
                          <SwitchField label="Allow Clear POS Data on Logout" checked={posAccess.Settings?.allow_clear_data_on_logout} onChange={() => handleToggle(['Settings', 'allow_clear_data_on_logout'])} />
                        </div>
                      </div>

                      {/* 17. Receipts Section */}
                      <div className="bg-white dark:bg-[#1e2129] rounded-xl border border-slate-200 dark:border-white/5 shadow-sm overflow-hidden">
                        <SectionHeader title="Receipts" />
                        <div className="p-5 space-y-6">
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            <SwitchField label="Is Visible" checked={posAccess.Receipts?.visible} onChange={() => handleToggle(['Receipts', 'visible'])} hasPasscode={true} passcodeChecked={posAccess.Receipts?.visible_passcode} onPasscodeChange={() => handleToggle(['Receipts', 'visible_passcode'])} />
                            <SwitchField label="Preview" checked={posAccess.Receipts?.preview} onChange={() => handleToggle(['Receipts', 'preview'])} hasPasscode={true} passcodeChecked={posAccess.Receipts?.preview_passcode} onPasscodeChange={() => handleToggle(['Receipts', 'preview_passcode'])} />
                            <SwitchField label="Todays Report" checked={posAccess.Receipts?.todays_report} onChange={() => handleToggle(['Receipts', 'todays_report'])} hasPasscode={true} passcodeChecked={posAccess.Receipts?.todays_report_passcode} onPasscodeChange={() => handleToggle(['Receipts', 'todays_report_passcode'])} />
                            <SwitchField label="Re-Sync Bills" checked={posAccess.Receipts?.resync_bills} onChange={() => handleToggle(['Receipts', 'resync_bills'])} hasPasscode={true} passcodeChecked={posAccess.Receipts?.resync_bills_passcode} onPasscodeChange={() => handleToggle(['Receipts', 'resync_bills_passcode'])} />
                            <SwitchField label="Reprint Bill" checked={posAccess.Receipts?.reprint_bill} onChange={() => handleToggle(['Receipts', 'reprint_bill'])} hasPasscode={true} passcodeChecked={posAccess.Receipts?.reprint_bill_passcode} onPasscodeChange={() => handleToggle(['Receipts', 'reprint_bill_passcode'])} />
                            <SwitchField label="All Bills" checked={posAccess.Receipts?.all_bills} onChange={() => handleToggle(['Receipts', 'all_bills'])} />
                            <SwitchField label="Todays Bills" checked={posAccess.Receipts?.todays_bills} onChange={() => handleToggle(['Receipts', 'todays_bills'])} />
                            <SwitchField label="Date Filter" checked={posAccess.Receipts?.date_filter} onChange={() => handleToggle(['Receipts', 'date_filter'])} />
                            <SwitchField label="Deleted Status" checked={posAccess.Receipts?.deleted_status} onChange={() => handleToggle(['Receipts', 'deleted_status'])} hasPasscode={true} passcodeChecked={posAccess.Receipts?.deleted_status_passcode} onPasscodeChange={() => handleToggle(['Receipts', 'deleted_status_passcode'])} />
                            <SwitchField label="Free Status" checked={posAccess.Receipts?.free_status} onChange={() => handleToggle(['Receipts', 'free_status'])} hasPasscode={true} passcodeChecked={posAccess.Receipts?.free_status_passcode} onPasscodeChange={() => handleToggle(['Receipts', 'free_status_passcode'])} />
                            <SwitchField label="Edit Bill After Save" checked={posAccess.Receipts?.edit_bill_after_save} onChange={() => handleToggle(['Receipts', 'edit_bill_after_save'])} hasPasscode={true} passcodeChecked={posAccess.Receipts?.edit_bill_after_save_passcode} onPasscodeChange={() => handleToggle(['Receipts', 'edit_bill_after_save_passcode'])} />
                            <SwitchField label="Tip Amount" checked={posAccess.Receipts?.tip_amount} onChange={() => handleToggle(['Receipts', 'tip_amount'])} />
                            <SwitchField label="Show Bill Amount" checked={posAccess.Receipts?.show_bill_amount} onChange={() => handleToggle(['Receipts', 'show_bill_amount'])} />
                            <SwitchField label="Net Sale Amount" checked={posAccess.Receipts?.net_sale_amount} onChange={() => handleToggle(['Receipts', 'net_sale_amount'])} />
                            <SwitchField label="Total Fulfilled Amount" checked={posAccess.Receipts?.total_fulfilled_amount} onChange={() => handleToggle(['Receipts', 'total_fulfilled_amount'])} />
                            <SwitchField label="All Bills Amount" checked={posAccess.Receipts?.all_bills_amount} onChange={() => handleToggle(['Receipts', 'all_bills_amount'])} />
                            <SwitchField label="Selected Bills" checked={posAccess.Receipts?.selected_bills} onChange={() => handleToggle(['Receipts', 'selected_bills'])} />
                            <SwitchField label="Reverse Inventory" checked={posAccess.Receipts?.reverse_inventory} onChange={() => handleToggle(['Receipts', 'reverse_inventory'])} hasPasscode={true} passcodeChecked={posAccess.Receipts?.reverse_inventory_passcode} onPasscodeChange={() => handleToggle(['Receipts', 'reverse_inventory_passcode'])} />
                          </div>

                          <div className="p-4 rounded-xl border border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-black/10">
                            <SubSectionHeader title="Edit Bill" />
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                              <SwitchField label="Is Visible" checked={posAccess.Receipts?.EditBill?.visible} onChange={() => handleToggle(['Receipts', 'EditBill', 'visible'])} hasPasscode={true} passcodeChecked={posAccess.Receipts?.EditBill?.visible_passcode} onPasscodeChange={() => handleToggle(['Receipts', 'EditBill', 'visible_passcode'])} />
                              <SwitchField label="Bill Status" checked={posAccess.Receipts?.EditBill?.bill_status} onChange={() => handleToggle(['Receipts', 'EditBill', 'bill_status'])} hasPasscode={true} passcodeChecked={posAccess.Receipts?.EditBill?.bill_status_passcode} onPasscodeChange={() => handleToggle(['Receipts', 'EditBill', 'bill_status_passcode'])} />
                              <SwitchField label="Payment Mode" checked={posAccess.Receipts?.EditBill?.payment_mode} onChange={() => handleToggle(['Receipts', 'EditBill', 'payment_mode'])} hasPasscode={true} passcodeChecked={posAccess.Receipts?.EditBill?.payment_mode_passcode} onPasscodeChange={() => handleToggle(['Receipts', 'EditBill', 'payment_mode_passcode'])} />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* 18. Reports Section */}
                      <div className="bg-white dark:bg-[#1e2129] rounded-xl border border-slate-200 dark:border-white/5 shadow-sm overflow-hidden">
                        <SectionHeader title="Reports" />
                        <div className="p-5 space-y-6">
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            <SwitchField label="Is Visible" checked={posAccess.Reports?.visible} onChange={() => handleToggle(['Reports', 'visible'])} hasPasscode={true} passcodeChecked={posAccess.Reports?.visible_passcode} onPasscodeChange={() => handleToggle(['Reports', 'visible_passcode'])} />
                            <SwitchField label="Show All User Report" checked={posAccess.Reports?.show_all_user_report} onChange={() => handleToggle(['Reports', 'show_all_user_report'])} />
                            <SwitchField label="Category Wise Report" checked={posAccess.Reports?.category_wise_report} onChange={() => handleToggle(['Reports', 'category_wise_report'])} hasPasscode={true} passcodeChecked={posAccess.Reports?.category_wise_report_passcode} onPasscodeChange={() => handleToggle(['Reports', 'category_wise_report_passcode'])} />
                            <SwitchField label="Coupon History" checked={posAccess.Reports?.coupon_history} onChange={() => handleToggle(['Reports', 'coupon_history'])} hasPasscode={true} passcodeChecked={posAccess.Reports?.coupon_history_passcode} onPasscodeChange={() => handleToggle(['Reports', 'coupon_history_passcode'])} />
                            <SwitchField label="Kitchen Dept Wise Report" checked={posAccess.Reports?.kitchen_dept_wise_report} onChange={() => handleToggle(['Reports', 'kitchen_dept_wise_report'])} hasPasscode={true} passcodeChecked={posAccess.Reports?.kitchen_dept_wise_report_passcode} onPasscodeChange={() => handleToggle(['Reports', 'kitchen_dept_wise_report_passcode'])} />
                            <SwitchField label="Order Type Report" checked={posAccess.Reports?.order_type_report} onChange={() => handleToggle(['Reports', 'order_type_report'])} hasPasscode={true} passcodeChecked={posAccess.Reports?.order_type_report_passcode} onPasscodeChange={() => handleToggle(['Reports', 'order_type_report_passcode'])} />
                            <SwitchField label="Payment Report" checked={posAccess.Reports?.payment_report} onChange={() => handleToggle(['Reports', 'payment_report'])} hasPasscode={true} passcodeChecked={posAccess.Reports?.payment_report_passcode} onPasscodeChange={() => handleToggle(['Reports', 'payment_report_passcode'])} />
                            <SwitchField label="Sales Report" checked={posAccess.Reports?.sales_report} onChange={() => handleToggle(['Reports', 'sales_report'])} hasPasscode={true} passcodeChecked={posAccess.Reports?.sales_report_passcode} onPasscodeChange={() => handleToggle(['Reports', 'sales_report_passcode'])} />
                            <SwitchField label="Todays Report" checked={posAccess.Reports?.todays_report} onChange={() => handleToggle(['Reports', 'todays_report'])} hasPasscode={true} passcodeChecked={posAccess.Reports?.todays_report_passcode} onPasscodeChange={() => handleToggle(['Reports', 'todays_report_passcode'])} />
                            <SwitchField label="User Shift Report" checked={posAccess.Reports?.user_shift_report} onChange={() => handleToggle(['Reports', 'user_shift_report'])} hasPasscode={true} passcodeChecked={posAccess.Reports?.user_shift_report_passcode} onPasscodeChange={() => handleToggle(['Reports', 'user_shift_report_passcode'])} />
                            <SwitchField label="Misc Report" checked={posAccess.Reports?.misc_report} onChange={() => handleToggle(['Reports', 'misc_report'])} hasPasscode={true} passcodeChecked={posAccess.Reports?.misc_report_passcode} onPasscodeChange={() => handleToggle(['Reports', 'misc_report_passcode'])} />
                            <SwitchField label="Pre Order Report" checked={posAccess.Reports?.pre_order_report} onChange={() => handleToggle(['Reports', 'pre_order_report'])} hasPasscode={true} passcodeChecked={posAccess.Reports?.pre_order_report_passcode} onPasscodeChange={() => handleToggle(['Reports', 'pre_order_report_passcode'])} />
                            <SwitchField label="Tax Report" checked={posAccess.Reports?.tax_report} onChange={() => handleToggle(['Reports', 'tax_report'])} hasPasscode={true} passcodeChecked={posAccess.Reports?.tax_report_passcode} onPasscodeChange={() => handleToggle(['Reports', 'tax_report_passcode'])} />
                            <SwitchField label="Mall Report" checked={posAccess.Reports?.mail_report} onChange={() => handleToggle(['Reports', 'mail_report'])} hasPasscode={true} passcodeChecked={posAccess.Reports?.mail_report_passcode} onPasscodeChange={() => handleToggle(['Reports', 'mail_report_passcode'])} />
                            <SwitchField label="Start Close Day Report" checked={posAccess.Reports?.start_close_day_report} onChange={() => handleToggle(['Reports', 'start_close_day_report'])} hasPasscode={true} passcodeChecked={posAccess.Reports?.start_close_day_report_passcode} onPasscodeChange={() => handleToggle(['Reports', 'start_close_day_report_passcode'])} />
                            <SwitchField label="KOT Report" checked={posAccess.Reports?.kot_report} onChange={() => handleToggle(['Reports', 'kot_report'])} />
                            <SwitchField label="Reservation Report" checked={posAccess.Reports?.reservation_report} onChange={() => handleToggle(['Reports', 'reservation_report'])} hasPasscode={true} passcodeChecked={posAccess.Reports?.reservation_report_passcode} onPasscodeChange={() => handleToggle(['Reports', 'reservation_report_passcode'])} />
                            <SwitchField label="Delivery Boy Report" checked={posAccess.Reports?.delivery_boy_report} onChange={() => handleToggle(['Reports', 'delivery_boy_report'])} hasPasscode={true} passcodeChecked={posAccess.Reports?.delivery_boy_report_passcode} onPasscodeChange={() => handleToggle(['Reports', 'delivery_boy_report_passcode'])} />
                            <SwitchField label="User Report" checked={posAccess.Reports?.user_report} onChange={() => handleToggle(['Reports', 'user_report'])} hasPasscode={true} passcodeChecked={posAccess.Reports?.user_report_passcode} onPasscodeChange={() => handleToggle(['Reports', 'user_report_passcode'])} />
                            <SwitchField label="Show Amount" checked={posAccess.Reports?.show_amount} onChange={() => handleToggle(['Reports', 'show_amount'])} />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Item Report Sub-section */}
                            <div className="p-4 rounded-xl border border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-black/10">
                              <SubSectionHeader title="Item Report" />
                              <div className="grid grid-cols-2 gap-4">
                                <SwitchField label="Is Visible" checked={posAccess.Reports?.ItemReport?.visible} onChange={() => handleToggle(['Reports', 'ItemReport', 'visible'])} hasPasscode={true} passcodeChecked={posAccess.Reports?.ItemReport?.visible_passcode} onPasscodeChange={() => handleToggle(['Reports', 'ItemReport', 'visible_passcode'])} />
                                <SwitchField label="Addon Items Report" checked={posAccess.Reports?.ItemReport?.addon_items_report} onChange={() => handleToggle(['Reports', 'ItemReport', 'addon_items_report'])} />
                                <SwitchField label="Cancelled Items Report" checked={posAccess.Reports?.ItemReport?.cancelled_items_report} onChange={() => handleToggle(['Reports', 'ItemReport', 'cancelled_items_report'])} />
                                <SwitchField label="Dead Items Report" checked={posAccess.Reports?.ItemReport?.dead_items_report} onChange={() => handleToggle(['Reports', 'ItemReport', 'dead_items_report'])} />
                                <SwitchField label="Deleted Items Report" checked={posAccess.Reports?.ItemReport?.deleted_items_report} onChange={() => handleToggle(['Reports', 'ItemReport', 'deleted_items_report'])} />
                                <SwitchField label="Sold Items Report" checked={posAccess.Reports?.ItemReport?.sold_items_report} onChange={() => handleToggle(['Reports', 'ItemReport', 'sold_items_report'])} />
                                <SwitchField label="Top Item Report" checked={posAccess.Reports?.ItemReport?.top_item_report} onChange={() => handleToggle(['Reports', 'ItemReport', 'top_item_report'])} />
                                <SwitchField label="Complementary Items Report" checked={posAccess.Reports?.ItemReport?.complementary_items_report} onChange={() => handleToggle(['Reports', 'ItemReport', 'complementary_items_report'])} />
                              </div>
                            </div>

                            {/* Due Payment Report Sub-section */}
                            <div className="p-4 rounded-xl border border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-black/10">
                              <SubSectionHeader title="Due Payment Report" />
                              <div className="grid grid-cols-2 gap-4">
                                <SwitchField label="Is Visible" checked={posAccess.Reports?.DuePaymentReport?.visible} onChange={() => handleToggle(['Reports', 'DuePaymentReport', 'visible'])} hasPasscode={true} passcodeChecked={posAccess.Reports?.DuePaymentReport?.visible_passcode} onPasscodeChange={() => handleToggle(['Reports', 'DuePaymentReport', 'visible_passcode'])} />
                                <SwitchField label="Due Orders" checked={posAccess.Reports?.DuePaymentReport?.due_orders} onChange={() => handleToggle(['Reports', 'DuePaymentReport', 'due_orders'])} />
                                <SwitchField label="Order History Report" checked={posAccess.Reports?.DuePaymentReport?.order_history_report} onChange={() => handleToggle(['Reports', 'DuePaymentReport', 'order_history_report'])} />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* 19. Switch Outlet Section */}
                      <div className="bg-white dark:bg-[#1e2129] rounded-xl border border-slate-200 dark:border-white/5 shadow-sm overflow-hidden">
                        <SectionHeader title="Switch Outlet" />
                        <div className="p-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                          <SwitchField label="Is Visible" checked={posAccess.SwitchOutlet?.visible} onChange={() => handleToggle(['SwitchOutlet', 'visible'])} hasPasscode={true} passcodeChecked={posAccess.SwitchOutlet?.visible_passcode} onPasscodeChange={() => handleToggle(['SwitchOutlet', 'visible_passcode'])} />
                        </div>
                      </div>

                      {/* 20. Custom Links Section */}
                      <div className="bg-white dark:bg-[#1e2129] rounded-xl border border-slate-200 dark:border-white/5 shadow-sm overflow-hidden">
                        <SectionHeader title="Custom Links" />
                        <div className="p-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                          <SwitchField label="Is Visible" checked={posAccess.CustomLinks?.visible} onChange={() => handleToggle(['CustomLinks', 'visible'])} hasPasscode={true} passcodeChecked={posAccess.CustomLinks?.visible_passcode} onPasscodeChange={() => handleToggle(['CustomLinks', 'visible_passcode'])} />
                        </div>
                      </div>

                      {/* 21. Online Order Section */}
                      <div className="bg-white dark:bg-[#1e2129] rounded-xl border border-slate-200 dark:border-white/5 shadow-sm overflow-hidden">
                        <SectionHeader title="Online Order" />
                        <div className="p-5 space-y-6">
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            <SwitchField label="Is Visible" checked={posAccess.OnlineOrder?.visible} onChange={() => handleToggle(['OnlineOrder', 'visible'])} hasPasscode={true} passcodeChecked={posAccess.OnlineOrder?.visible_passcode} onPasscodeChange={() => handleToggle(['OnlineOrder', 'visible_passcode'])} />
                            <SwitchField label="Print Bill" checked={posAccess.OnlineOrder?.print_bill} onChange={() => handleToggle(['OnlineOrder', 'print_bill'])} />
                            <SwitchField label="KOT Print" checked={posAccess.OnlineOrder?.kot_print} onChange={() => handleToggle(['OnlineOrder', 'kot_print'])} />
                          </div>

                          {/* Store Settings Sub-section */}
                          <div className="p-4 rounded-xl border border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-black/10">
                            <SubSectionHeader title="Store Settings" />
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                              <SwitchField label="Is Visible" checked={posAccess.OnlineOrder?.StoreSettings?.visible} onChange={() => handleToggle(['OnlineOrder', 'StoreSettings', 'visible'])} hasPasscode={true} passcodeChecked={posAccess.OnlineOrder?.StoreSettings?.visible_passcode} onPasscodeChange={() => handleToggle(['OnlineOrder', 'StoreSettings', 'visible_passcode'])} />
                              <SwitchField label="Store" checked={posAccess.OnlineOrder?.StoreSettings?.store} onChange={() => handleToggle(['OnlineOrder', 'StoreSettings', 'store'])} hasPasscode={true} passcodeChecked={posAccess.OnlineOrder?.StoreSettings?.store_passcode} onPasscodeChange={() => handleToggle(['OnlineOrder', 'StoreSettings', 'store_passcode'])} />
                              <SwitchField label="Category" checked={posAccess.OnlineOrder?.StoreSettings?.category} onChange={() => handleToggle(['OnlineOrder', 'StoreSettings', 'category'])} hasPasscode={true} passcodeChecked={posAccess.OnlineOrder?.StoreSettings?.category_passcode} onPasscodeChange={() => handleToggle(['OnlineOrder', 'StoreSettings', 'category_passcode'])} />
                              <SwitchField label="Items" checked={posAccess.OnlineOrder?.StoreSettings?.items} onChange={() => handleToggle(['OnlineOrder', 'StoreSettings', 'items'])} hasPasscode={true} passcodeChecked={posAccess.OnlineOrder?.StoreSettings?.items_passcode} onPasscodeChange={() => handleToggle(['OnlineOrder', 'StoreSettings', 'items_passcode'])} />
                              <SwitchField label="Options" checked={posAccess.OnlineOrder?.StoreSettings?.options} onChange={() => handleToggle(['OnlineOrder', 'StoreSettings', 'options'])} hasPasscode={true} passcodeChecked={posAccess.OnlineOrder?.StoreSettings?.options_passcode} onPasscodeChange={() => handleToggle(['OnlineOrder', 'StoreSettings', 'options_passcode'])} />
                            </div>
                          </div>
                        </div>
                      </div>

                    </div>

                    {/* Bottom Action Footer Bar */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#1e2129] p-4 rounded-xl border border-slate-200 dark:border-white/5 shadow-sm shrink-0">
                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-tight">
                            <span>Copyright © 2026-2027 Powered by TMBill Technology LLC. All Rights Reserved. Need Support? Contact us at support@tmbill.com</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <button 
                                type="button"
                                onClick={handleSave}
                                disabled={saving || loading}
                                className="h-9 px-5 bg-emerald-800 hover:bg-emerald-700 disabled:bg-emerald-800/50 text-white rounded font-bold text-[11px] uppercase tracking-widest transition-all flex items-center gap-2 shadow-sm"
                            >
                                {saving ? (
                                    <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <Check className="w-3.5 h-3.5" />
                                )}
                                {saving ? "Saving..." : "Update"}
                            </button>
                            <button 
                                type="button"
                                onClick={handleReset}
                                className="h-9 px-5 bg-rose-600 hover:bg-rose-500 text-white rounded font-bold text-[11px] uppercase tracking-widest transition-all flex items-center gap-2 shadow-sm"
                            >
                                <RefreshCw className="w-3.5 h-3.5" /> Reset
                            </button>
                            <button 
                                type="button"
                                onClick={() => {
                                    if (onClose) onClose();
                                    else navigate("/outlet-users");
                                }}
                                className="h-9 px-5 bg-orange-600 hover:bg-orange-500 text-white rounded font-bold text-[11px] uppercase tracking-widest transition-all flex items-center gap-2 shadow-sm"
                            >
                                <X className="w-3.5 h-3.5" /> Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Success/Error Dialog */}
            {notification && (
                <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white dark:bg-[#1e2129] w-full max-w-xs rounded-xl border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden p-8 text-center animate-in zoom-in duration-300">
                        {notification.type === "success" ? (
                            <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner ring-8 ring-emerald-500/5">
                                <Check className="w-10 h-10" />
                            </div>
                        ) : (
                            <div className="w-16 h-16 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner ring-8 ring-rose-500/5">
                                <X className="w-10 h-10" />
                            </div>
                        )}
                        <h4 className="text-[18px] font-black text-slate-800 dark:text-white uppercase tracking-tight mb-2">
                            {notification.type === "success" ? "Success!" : "Error"}
                        </h4>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.15em] mb-4">
                            {notification.message}
                        </p>
                        {notification.type !== "success" && (
                            <button 
                                onClick={() => setNotification(null)}
                                className="w-full py-2 bg-slate-900 dark:bg-white/10 hover:bg-slate-800 text-white rounded text-[10px] font-bold uppercase tracking-widest transition-all"
                            >
                                Close
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default POSAccessManager;
