import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, Smartphone, Save, Shield, Check, X, AlertCircle, Search, 
  Settings, Zap, Utensils, Package, Truck, BarChart3, Globe, Sliders, 
  HelpCircle, ChevronDown, ChevronRight, RefreshCw
} from "lucide-react";
import API_BASE from "../config";

const INITIAL_DEFAULT_STATE = {
  Settings: {
    visible: true,
    printer_settings: true,
    app_settings: true
  },
  QuickBill: {
    visible: true,
    settle_bill: true
  },
  DineIn: {
    visible: true,
    create_order: true,
    settle_bill: true,
    cancel_kot: true,
    merge_table: true,
    change_table: true
  },
  Pickup: {
    visible: true,
    create_order: true,
    settle_bill: true,
    cancel_order: true,
    refund: true
  },
  Delivery: {
    visible: true,
    create_order: true,
    settle_bill: true,
    assign_rider: true,
    cancel_order: true
  },
  Reports: {
    visible: true,
    sales_report: true,
    payment_report: true,
    category_wise_report: true,
    item_wise_report: true,
    user_shift_report: true,
    todays_report: true,
    expense_report: true,
    due_payment_report: true,
    cancelled_items_report: true,
    sold_items_report: true,
    top_item_report: true,
    complementary_items_report: true,
    start_close_day_report: true,
    user_report: true,
    show_amount: true
  },
  OnlineOrder: {
    visible: true
  },
  OnlineOrdersSettings: {
    visible: true,
    store: true,
    category: true,
    items: true,
    options: true
  },
  Support: {
    visible: true
  }
};

const MODULES_CONFIG = [
  {
    key: "Settings",
    label: "Settings",
    icon: Settings,
    colorClass: "bg-blue-500/10 text-blue-500 dark:bg-blue-500/20 dark:text-blue-400",
    subPermissions: ["printer_settings", "app_settings"]
  },
  {
    key: "QuickBill",
    label: "Quick Bill",
    icon: Zap,
    colorClass: "bg-amber-500/10 text-amber-500 dark:bg-amber-500/20 dark:text-amber-400",
    subPermissions: ["settle_bill"]
  },
  {
    key: "DineIn",
    label: "Dine In",
    icon: Utensils,
    colorClass: "bg-emerald-500/10 text-emerald-500 dark:bg-emerald-500/20 dark:text-emerald-400",
    subPermissions: ["create_order", "settle_bill", "cancel_kot", "merge_table", "change_table"]
  },
  {
    key: "Pickup",
    label: "Pickup",
    icon: Package,
    colorClass: "bg-cyan-500/10 text-cyan-500 dark:bg-cyan-500/20 dark:text-cyan-400",
    subPermissions: ["create_order", "settle_bill", "cancel_order", "refund"]
  },
  {
    key: "Delivery",
    label: "Delivery",
    icon: Truck,
    colorClass: "bg-purple-500/10 text-purple-500 dark:bg-purple-500/20 dark:text-purple-400",
    subPermissions: ["create_order", "settle_bill", "assign_rider", "cancel_order"]
  },
  {
    key: "Reports",
    label: "Reports",
    icon: BarChart3,
    colorClass: "bg-orange-500/10 text-orange-500 dark:bg-orange-500/20 dark:text-orange-400",
    subPermissions: [
      "sales_report", "payment_report", "category_wise_report", "item_wise_report",
      "user_shift_report", "todays_report", "expense_report", "due_payment_report",
      "cancelled_items_report", "sold_items_report", "top_item_report",
      "complementary_items_report", "start_close_day_report", "user_report", "show_amount"
    ]
  },
  {
    key: "OnlineOrder",
    label: "Online Order",
    icon: Globe,
    colorClass: "bg-sky-500/10 text-sky-500 dark:bg-sky-500/20 dark:text-sky-400",
    subPermissions: [] // Just visible toggle
  },
  {
    key: "OnlineOrdersSettings",
    label: "Online Orders Settings",
    icon: Sliders,
    colorClass: "bg-indigo-500/10 text-indigo-500 dark:bg-indigo-500/20 dark:text-indigo-400",
    subPermissions: ["store", "category", "items", "options"]
  },
  {
    key: "Support",
    label: "Support",
    icon: HelpCircle,
    colorClass: "bg-pink-500/10 text-pink-500 dark:bg-pink-500/20 dark:text-pink-400",
    subPermissions: [] // Just visible toggle
  }
];

const PERMISSION_LABELS = {
  // Settings
  printer_settings: { title: "Printer Settings", desc: "Allow setting up local printers and receipt templates" },
  app_settings: { title: "App Settings", desc: "Allow editing local storage, theme, and terminal configurations" },

  // Quick Bill
  settle_bill: { title: "Settle Bill", desc: "Allow settling and collecting payments directly on Quick Bill" },

  // Dine In
  create_order: { title: "Create Order", desc: "Allow opening new dine-in tables and adding items" },
  settle_bill: { title: "Settle Bill", desc: "Allow invoicing, applying discounts, and settling dine-in bills" },
  cancel_kot: { title: "Cancel KOT", desc: "Allow cancelling active kitchen order tickets (requires passcode if configured)" },
  merge_table: { title: "Merge Table", desc: "Allow grouping multiple tables under a single order bill" },
  change_table: { title: "Change Table", desc: "Allow swapping table assignments for active guest orders" },

  // Pickup
  create_order: { title: "Create Order", desc: "Allow recording new takeaway/pickup customer orders" },
  settle_bill: { title: "Settle Bill", desc: "Allow completing billing and settling payment for pickup orders" },
  cancel_order: { title: "Cancel Order", desc: "Allow cancelling active takeaway orders" },
  refund: { title: "Refund", desc: "Allow issuing cash or wallet refunds for cancelled pickup bills" },

  // Delivery
  create_order: { title: "Create Order", desc: "Allow booking new home delivery orders" },
  settle_bill: { title: "Settle Bill", desc: "Allow processing cash-on-delivery or online delivery settlement" },
  assign_rider: { title: "Assign Rider", desc: "Allow dispatching delivery boys and tracking status" },
  cancel_order: { title: "Cancel Order", desc: "Allow cancelling delivery bookings before dispatch" },

  // Reports
  sales_report: { title: "Sales Report", desc: "Access to overall sales analytics and total turnover summaries" },
  payment_report: { title: "Payment Report", desc: "Access to payment modes breakdowns (Cash, Card, UPI, etc.)" },
  category_wise_report: { title: "Category Wise Report", desc: "Access to sales categorized by item department/group" },
  item_wise_report: { title: "Item Wise Report", desc: "Access to quantity and value of individual items sold" },
  user_shift_report: { title: "User Shift Report", desc: "Access to cashier/operator shift closing summaries" },
  todays_report: { title: "Todays Report", desc: "Access to real-time sales overview for the current calendar day" },
  expense_report: { title: "Expense Report", desc: "Access to recorded local business expenses list" },
  due_payment_report: { title: "Due Payment Report", desc: "Access to credit sales and pending customer dues logs" },
  cancelled_items_report: { title: "Cancelled Items Report", desc: "Access to logs of items cancelled from active KOTs" },
  sold_items_report: { title: "Sold Items Report", desc: "Access to complete sold item history and counts" },
  top_item_report: { title: "Top Item Report", desc: "Access to high-demand best selling items list" },
  complementary_items_report: { title: "Complementary Items Report", desc: "Access to log of items served for free/FOC" },
  start_close_day_report: { title: "Start Close Day Report", desc: "Access to logs of daily store openings and closures" },
  user_report: { title: "User Report", desc: "Access to operator audit trails and performance indicators" },
  show_amount: { title: "Show Amount", desc: "Permit displaying currency figures on analytics screens" },

  // Online Orders Settings
  store: { title: "Store Settings", desc: "Manage online store parameters and timing schedules" },
  category: { title: "Category Settings", desc: "Manage online catalog category visibility and ordering" },
  items: { title: "Item Settings", desc: "Enable/disable menu items for digital catalog platforms" },
  options: { title: "Option Settings", desc: "Configure modifier options and addons for online portals" }
};

const IosToggle = ({ checked, onChange }) => {
  return (
    <label className="relative inline-flex items-center cursor-pointer select-none">
      <input 
        type="checkbox" 
        checked={checked || false}
        onChange={onChange}
        className="sr-only peer" 
      />
      <div className="relative w-10 h-5 bg-slate-200 dark:bg-slate-700 rounded-full peer peer-checked:bg-emerald-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5 transition-colors duration-200"></div>
    </label>
  );
};

const MPOSAccessManager = ({ userId: propUserId, onClose }) => {
    const { userId: paramUserId } = useParams();
    const userId = propUserId || paramUserId;
    const navigate = useNavigate();
    
    const [user, setUser] = useState(null);
    const [mposAccess, setMposAccess] = useState(INITIAL_DEFAULT_STATE);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [expandedKeys, setExpandedKeys] = useState([]);
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        const fetchMPOSAccessData = async () => {
            try {
                setLoading(true);
                const res = await fetch(`${API_BASE}/api/brand/users/${userId}/mpos-access`, {
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("token")}`
                    }
                });
                if (!res.ok) {
                    throw new Error("Failed to load MPOS access settings");
                }
                const data = await res.json();
                setUser(data.user);
                
                if (data.mpos_access && typeof data.mpos_access === "object") {
                  const merged = JSON.parse(JSON.stringify(INITIAL_DEFAULT_STATE));
                  Object.keys(data.mpos_access).forEach(key => {
                    if (data.mpos_access[key] && typeof data.mpos_access[key] === "object") {
                      if (!merged[key]) merged[key] = {};
                      Object.keys(data.mpos_access[key]).forEach(subKey => {
                        merged[key][subKey] = data.mpos_access[key][subKey];
                      });
                    } else {
                      // Handle legacy format or straight boolean maps
                      if (key.startsWith("can_")) {
                         // Map legacy flags to make sense in the new system
                         if (key === "can_order") {
                           merged.DineIn.visible = data.mpos_access[key];
                           merged.Pickup.visible = data.mpos_access[key];
                           merged.Delivery.visible = data.mpos_access[key];
                         } else if (key === "can_view_sales") {
                           merged.Reports.visible = data.mpos_access[key];
                         } else if (key === "can_apply_discount") {
                           merged.DineIn.settle_bill = data.mpos_access[key];
                           merged.Pickup.settle_bill = data.mpos_access[key];
                           merged.Delivery.settle_bill = data.mpos_access[key];
                         }
                      } else {
                         merged[key] = data.mpos_access[key];
                      }
                    }
                  });
                  setMposAccess(merged);
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

        fetchMPOSAccessData();
    }, [userId]);

    // Handle toggle for visible (parent card level)
    const handleToggleVisible = (key) => {
        setMposAccess(prev => {
            const next = JSON.parse(JSON.stringify(prev));
            const newVisible = !next[key].visible;
            next[key].visible = newVisible;
            
            // Auto toggle all sub-permissions in synchronization
            Object.keys(next[key]).forEach(subKey => {
                if (subKey !== 'visible') {
                    next[key][subKey] = newVisible;
                }
            });
            return next;
        });
    };

    // Handle toggle for sub-permission
    const handleToggleSubPermission = (moduleKey, subKey) => {
        setMposAccess(prev => {
            const next = JSON.parse(JSON.stringify(prev));
            const newChecked = !next[moduleKey][subKey];
            next[moduleKey][subKey] = newChecked;
            
            // If any sub-permission becomes active, ensure parent is visible
            if (newChecked) {
                next[moduleKey].visible = true;
            } else {
                // If all sub-permissions become inactive, turn off parent visible
                const otherSubsActive = Object.keys(next[moduleKey])
                    .filter(k => k !== 'visible' && k !== subKey)
                    .some(k => next[moduleKey][k]);
                if (!otherSubsActive) {
                    next[moduleKey].visible = false;
                }
            }
            return next;
        });
    };

    // Expand/Collapse accordion key
    const toggleExpand = (key) => {
        setExpandedKeys(prev => 
            prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
        );
    };

    // Enable all modules and sub-permissions
    const handleEnableAll = () => {
        setMposAccess(prev => {
            const next = JSON.parse(JSON.stringify(prev));
            Object.keys(next).forEach(moduleKey => {
                Object.keys(next[moduleKey]).forEach(subKey => {
                    next[moduleKey][subKey] = true;
                });
            });
            return next;
        });
    };

    // Disable all modules and sub-permissions
    const handleDisableAll = () => {
        setMposAccess(prev => {
            const next = JSON.parse(JSON.stringify(prev));
            Object.keys(next).forEach(moduleKey => {
                Object.keys(next[moduleKey]).forEach(subKey => {
                    next[moduleKey][subKey] = false;
                });
            });
            return next;
        });
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            const res = await fetch(`${API_BASE}/api/brand/users/${userId}/mpos-access`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({ mpos_access: mposAccess })
            });

            if (res.ok) {
                setNotification({
                    type: "success",
                    message: "SaSLoop App Access Level saved successfully!"
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

    // Filtering logic based on search
    const filteredModules = MODULES_CONFIG.filter(m => {
        if (!searchTerm) return true;
        const matchModule = m.label.toLowerCase().includes(searchTerm.toLowerCase());
        const matchSub = m.subPermissions.some(subKey => {
            const meta = PERMISSION_LABELS[subKey];
            return meta && (
                meta.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                meta.desc.toLowerCase().includes(searchTerm.toLowerCase())
            );
        });
        return matchModule || matchSub;
    });

    // Auto-expand modules that have matching search terms
    useEffect(() => {
        if (searchTerm) {
            const keysToExpand = [];
            MODULES_CONFIG.forEach(m => {
                const matchSub = m.subPermissions.some(subKey => {
                    const meta = PERMISSION_LABELS[subKey];
                    return meta && (
                        meta.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        meta.desc.toLowerCase().includes(searchTerm.toLowerCase())
                    );
                });
                if (matchSub) {
                    keysToExpand.push(m.key);
                }
            });
            setExpandedKeys(keysToExpand);
        } else {
            setExpandedKeys([]);
        }
    }, [searchTerm]);

    return (
        <div className="h-full flex flex-col space-y-6 animate-in fade-in duration-500 max-w-7xl mx-auto p-4 sm:p-6 text-slate-700 dark:text-slate-200 overflow-hidden">
            {/* Header compact */}
            <div className="flex items-center justify-between bg-white dark:bg-[#1e2129] p-4 rounded-xl border border-slate-200 dark:border-white/5 shadow-sm shrink-0">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg text-emerald-600 dark:text-emerald-400">
                        <Smartphone className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-800 dark:text-white tracking-tight">Update App Access Levels</h2>
                        <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                            Manage module permissions and access levels {user?.name ? `for ${user.name}` : ""}
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
                    {/* Search and Bulk Controls Bar */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#1e2129] p-4 rounded-xl border border-slate-200 dark:border-white/5 shadow-sm shrink-0">
                        <div className="relative flex-1 max-w-md">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                <Search className="w-4 h-4" />
                            </span>
                            <input 
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search module or permission..."
                                className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-[#12151e] border border-slate-200 dark:border-white/5 text-slate-900 dark:text-slate-100 rounded-lg text-[12px] font-medium outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/10 transition-all placeholder:text-slate-400"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mr-2">Bulk actions:</span>
                            <button 
                                onClick={handleEnableAll}
                                className="h-8 px-4 border border-emerald-500/30 dark:border-emerald-500/10 text-emerald-600 dark:text-emerald-400 bg-emerald-500/[0.02] hover:bg-emerald-500 hover:text-white dark:hover:bg-emerald-500/20 transition-all text-[11px] font-bold uppercase tracking-wider rounded flex items-center gap-1.5"
                            >
                                <Check className="w-3.5 h-3.5" /> Enable All
                            </button>
                            <button 
                                onClick={handleDisableAll}
                                className="h-8 px-4 border border-rose-500/30 dark:border-rose-500/10 text-rose-600 dark:text-rose-400 bg-rose-500/[0.02] hover:bg-rose-500 hover:text-white dark:hover:bg-rose-500/20 transition-all text-[11px] font-bold uppercase tracking-wider rounded flex items-center gap-1.5"
                            >
                                <X className="w-3.5 h-3.5" /> Disable All
                            </button>
                        </div>
                    </div>

                    {/* Collapsible Modules List */}
                    <div className="flex-1 min-h-0 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
                        {filteredModules.map((m) => {
                            const hasSub = m.subPermissions.length > 0;
                            const isExpanded = expandedKeys.includes(m.key);
                            const moduleState = mposAccess[m.key] || { visible: false };
                            const IconComponent = m.icon;

                            return (
                                <div 
                                    key={m.key} 
                                    className="bg-white dark:bg-[#1e2129] rounded-xl border border-slate-200 dark:border-white/5 shadow-sm overflow-hidden transition-all duration-300"
                                >
                                    {/* Module header row */}
                                    <div 
                                        onClick={() => hasSub && toggleExpand(m.key)}
                                        className={`p-4 flex items-center justify-between gap-4 ${hasSub ? 'cursor-pointer select-none hover:bg-slate-50 dark:hover:bg-white/[0.02]' : ''}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-lg ${m.colorClass}`}>
                                                <IconComponent className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h3 className="text-[13px] font-bold text-slate-800 dark:text-white uppercase tracking-tight">
                                                    {m.label}
                                                </h3>
                                                {hasSub && (
                                                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">
                                                        {m.key === "Settings" ? m.subPermissions.length : m.subPermissions.length + 1} permissions
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div 
                                            className="flex items-center gap-4"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <div className="flex items-center gap-2 select-none">
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Is Visible</span>
                                                <IosToggle 
                                                    checked={moduleState.visible} 
                                                    onChange={() => handleToggleVisible(m.key)} 
                                                />
                                            </div>
                                            {hasSub && (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        toggleExpand(m.key);
                                                    }}
                                                    className="p-1 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white transition-all active:scale-95 border border-transparent hover:border-slate-200 dark:hover:border-white/10"
                                                >
                                                    {isExpanded ? (
                                                        <ChevronDown className="w-4 h-4 animate-in fade-in duration-300" />
                                                    ) : (
                                                        <ChevronRight className="w-4 h-4 animate-in fade-in duration-300" />
                                                    )}
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {/* Collapsible Sub-permissions grid */}
                                    {hasSub && isExpanded && (
                                        <div className="px-5 pb-5 pt-3 border-t border-slate-100 dark:border-white/5 bg-slate-50/[0.3] dark:bg-black/[0.05] animate-in slide-in-from-top duration-300">
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                {m.subPermissions.map((subKey) => {
                                                    const subMeta = PERMISSION_LABELS[subKey] || { title: subKey, desc: "" };
                                                    const isSubChecked = moduleState[subKey] || false;
                                                    
                                                    // Highlight matched permissions in search mode
                                                    const isMatched = searchTerm && (
                                                        subMeta.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                                        subMeta.desc.toLowerCase().includes(searchTerm.toLowerCase())
                                                    );

                                                    return (
                                                        <label 
                                                            key={subKey} 
                                                            className={`flex items-center justify-between p-3.5 rounded-lg border transition-all cursor-pointer select-none group ${
                                                                isSubChecked 
                                                                    ? "border-emerald-500/20 bg-emerald-500/[0.01]" 
                                                                    : "border-slate-150 dark:border-white/5 bg-white dark:bg-[#1a1d25] hover:border-slate-300 dark:hover:border-white/15"
                                                            } ${isMatched ? "ring-2 ring-emerald-500/30" : ""}`}
                                                        >
                                                            <div className="flex flex-col space-y-1 pr-3">
                                                                <span className="text-[11px] font-bold text-slate-700 dark:text-slate-200 uppercase tracking-tight group-hover:text-slate-800 dark:group-hover:text-white transition-colors">
                                                                    {subMeta.title}
                                                                </span>
                                                                <span className="text-[9px] font-medium text-slate-400 dark:text-slate-500 leading-snug">
                                                                    {subMeta.desc}
                                                                </span>
                                                            </div>
                                                            <IosToggle 
                                                                checked={isSubChecked} 
                                                                onChange={() => handleToggleSubPermission(m.key, subKey)} 
                                                            />
                                                        </label>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                        {filteredModules.length === 0 && (
                            <div className="bg-white dark:bg-[#1e2129] border border-slate-200 dark:border-white/5 rounded-xl py-24 text-center shadow-sm">
                                <div className="max-w-xs mx-auto space-y-3 opacity-30">
                                    <Smartphone className="w-12 h-12 mx-auto text-slate-400" />
                                    <h4 className="text-[12px] font-bold uppercase tracking-widest text-slate-600 dark:text-slate-300">No matching configurations</h4>
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Try adjusting your search criteria</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Bottom Action Footer Bar */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#1e2129] p-4 rounded-xl border border-slate-200 dark:border-white/5 shadow-sm shrink-0">
                        <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500">
                            <AlertCircle className="w-4 h-4 text-emerald-600" />
                            <span className="text-[10px] font-bold uppercase tracking-wider">Changes will apply immediately after saving.</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <button 
                                type="button"
                                onClick={onClose || (() => navigate("/outlet-users"))}
                                className="h-9 px-5 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 rounded font-bold text-[11px] uppercase tracking-widest transition-all flex items-center gap-2 shadow-sm"
                            >
                                <ArrowLeft className="w-3.5 h-3.5" /> Back
                            </button>
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

export default MPOSAccessManager;
