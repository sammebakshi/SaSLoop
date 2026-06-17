import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, Search, Check, X, ChevronDown, ChevronRight, Save, 
  Shield, AlertCircle, LayoutDashboard, Monitor, Users, Settings, 
  Folder, ShieldCheck, HelpCircle, Layers, Key 
} from "lucide-react";
import API_BASE from "../config";

const MODULES_CONFIG = [
  {
    key: "Default Filter",
    label: "Default Filter",
    subPermissions: [
      { name: "Default Market", type: "dropdown", options: ["Default Market"] },
      { name: "Default Brand", type: "dropdown", options: ["Default Brand"] },
      { name: "Default Outlet", type: "dropdown", options: ["Select Outlet"] }
    ]
  },
  {
    key: "Revenue Dashboard",
    label: "Revenue Dashboard",
    subPermissions: []
  },
  {
    key: "Live Order Tracking",
    label: "Live Order Tracking",
    subPermissions: []
  },
  {
    key: "Table Reservation",
    label: "Table Reservation",
    subPermissions: [
      { name: "Booking & Reservation" },
      { name: "Reservation Settings" }
    ]
  },
  {
    key: "Menu Management",
    label: "Menu Management",
    subPermissions: [
      { 
        name: "Outlet Menu", 
        label: "Outlet Menus", 
        settings: ["Edit", "Delete", "Add Menu", "Setting", "Download", "Clone Menu", "Show Pos Default Menu"] 
      },
      { name: "Option Group" },
      { name: "Modifier Groups" },
      { name: "Categories" },
      { name: "Nutrition Configuration" },
      { name: "Master Catalogue" },
      { name: "Multiple Price Settings" },
      { name: "Upload Bulk Menu" }
    ]
  },
  {
    key: "POS Configuration",
    label: "POS Configuration",
    subPermissions: [
      {
        name: "Outlet Configuration",
        subPermissions: [
          { name: "Market" },
          { name: "Brand" },
          { name: "Outlet" },
          { name: "Cluster" },
          { name: "Outlet Designation" },
          { name: "Outlet User" },
          { name: "Outlet Payment Mode" }
        ]
      },
      {
        name: "Master Management",
        subPermissions: [
          { name: "Tax Product Group" },
          { name: "Tax Configuration" },
          { name: "Kitchen Department" },
          { name: "Table Department" },
          { name: "Table Management" },
          { name: "Discount" },
          { name: "Additional Charges" },
          { name: "QR Management" },
          { name: "GL Mappings" }
        ]
      }
    ]
  },
  {
    key: "Platform",
    label: "Platform",
    subPermissions: []
  },
  {
    key: "Reports",
    label: "Reports",
    subPermissions: [
      { 
        name: "Sales Order", 
        settings: [
          "Print Bill", "Is Generate IRN", "Enable Send Sms", "Order Status Show", 
          "Enable Order Delete", "Allow Cancellation IRN", "Allow Irn Generation", 
          "Order Payment Mode Edit", "Enabled Free Deleted Options", "Mail Report", 
          "Dsr Item Wise", "B2b Sale Report", "Dsr Monthly Report", "Month Wise Sales", 
          "Bill No Of Series", "Liquor Sales Report", "Daily Sales Report", 
          "Dsr Day Wise Report", "Dsr Bill Wise Report", "Tax Submission Report"
        ] 
      },
      { 
        name: "DSR Report", 
        settings: [
          "Order Type Day Wise Report", "Simplified Dsr Day Wise Report", 
          "Dsr Day Wise Summary Report", "Day Wise Consolidated Report", 
          "Tax Submission Payment Report"
        ] 
      },
      { name: "Todays Report" },
      { 
        name: "Item Report", 
        settings: ["Price", "Total", "Discount", "Total Sale"] 
      },
      { name: "Payment Report" },
      { name: "Expense Tracking" },
      { name: "Order Report" },
      { name: "Category Report" },
      { name: "Kitchen Dept Report" },
      { name: "Coupon Code History Report" },
      { name: "Due Payment Report" },
      { name: "Start Close Day Report" },
      { name: "Shift Wise Report" },
      { name: "Discount Report" },
      { name: "Biller wise summary" },
      { name: "Delivery report" },
      { name: "Day Wise Summary Report" },
      { name: "Bill Print Report" },
      { name: "Applied Charges Report" },
      { name: "Customer Queries" },
      { name: "Order Sync History" },
      { name: "Waiter Report" },
      { name: "Hourly Report" },
      { name: "Zatka Report" },
      { name: "Passcode User Report" },
      { name: "Logistic Report" },
      { name: "Order State Transition Report" },
      {
        name: "UPI Report",
        subPermissions: [
          { name: "UPI Transaction Report" },
          { name: "BharatPe Transaction Report" },
          { name: "PhonePe Transaction Report" }
        ]
      },
      { name: "BharatPe Transaction Report" },
      { name: "Meal Time Sales Report" },
      { name: "ERP Sync History" },
      { name: "Jorden History" }
    ]
  },
  {
    key: "Centralized Ordering Hub",
    label: "Centralized Ordering Hub",
    subPermissions: []
  },
  {
    key: "Digital Order",
    label: "Digital Order",
    subPermissions: [
      { name: "Orders" },
      { name: "Digital Order Settings" }
    ]
  },
  {
    key: "WhatsApp Marketing",
    label: "WhatsApp Marketing",
    subPermissions: []
  },
  {
    key: "IRD Report",
    label: "IRD Report",
    subPermissions: [
      { name: "Sale Materialized Report" }
    ]
  },
  {
    key: "CRM",
    label: "CRM",
    subPermissions: [
      { name: "Customers", settings: ["Export"] },
      { name: "Customer History", settings: ["Export"] },
      {
        name: "Coupon Code Management",
        subPermissions: [
          { name: "Coupon Schemes" },
          { name: "Coupon Logs" }
        ]
      },
      {
        name: "Wallet Management",
        subPermissions: [
          { name: "Wallet Master" },
          { name: "Wallet Credit/Debit" },
          { name: "Wallet Transactions" }
        ]
      },
      { name: "Send sms" },
      { name: "Run Campaign" }
    ]
  },
  {
    key: "Call Center",
    label: "Call Center",
    subPermissions: []
  },
  {
    key: "TMBill Application",
    label: "TMBill Application",
    subPermissions: []
  },
  {
    key: "Inventory Management",
    label: "Inventory Management",
    subPermissions: [
      { name: "Locations" },
      {
        name: "Raw Material Management",
        subPermissions: [
          { name: "RM Items" },
          { name: "RM Category" },
          { name: "RM Group" },
          { name: "RM Unit" },
          { name: "RM Tax Product Group" }
        ]
      },
      { name: "Manual Stock Entry" },
      { name: "Manual Stock Out" },
      {
        name: "Vendor Management",
        subPermissions: [
          { name: "Vendors" },
          { name: "Vendor Payments" }
        ]
      },
      {
        name: "Purchase Management",
        subPermissions: [
          { name: "Purchase Order" },
          { name: "Purchase Invoice" },
          { name: "Purchase Return" }
        ]
      },
      { 
        name: "Recipe Management", 
        settings: ["Edit Qty", "Add Recipe", "Copy Recipe", "Edit Recipe", "Delete Recipe", "Add Nested Recipe"] 
      },
      { 
        name: "Furnished Item Configuration", 
        settings: ["Edit Furnished Item", "Add New Furnished Item", "Delete Furnished Item"] 
      },
      {
        name: "Reports",
        subPermissions: [
          { name: "Stock Inward" },
          { name: "Stock Transfer" },
          { name: "Stock Wastage" },
          { name: "Stock Ledger" },
          { name: "Physical Audit" },
          { name: "Item Profitability" },
          { name: "Food Costing" },
          { name: "Wastage Report" },
          { name: "Consumption Report" },
          { name: "Indent Report" }
        ]
      },
      {
        name: "Stock Transfer Management",
        subPermissions: [
          { name: "Stock Transfer In" },
          { name: "Stock Transfer Out" },
          { name: "Transit Store" },
          { name: "Transit Stock Ledger" }
        ]
      },
      { name: "Operations" }
    ]
  },
  {
    key: "Customer Loyalty & Rewards",
    label: "Customer Loyalty & Rewards",
    subPermissions: [
      { name: "Points" },
      { name: "Rewards" },
      { name: "Customer Points Activity" }
    ]
  },
  {
    key: "Feedback Management",
    label: "Feedback Management",
    subPermissions: [
      { name: "Feedback Configuration" },
      { name: "Customer Feedback" }
    ]
  },
  {
    key: "Third Party Integration",
    label: "Third Party Integration",
    subPermissions: []
  },
  {
    key: "About TMBill",
    label: "About TMBill",
    subPermissions: []
  },
  {
    key: "Settings",
    label: "Settings",
    subPermissions: [
      { name: "Payment Getway Configuration" },
      { name: "Webhook Configuration" },
      { name: "Logs" }
    ]
  }
];

const IosToggle = ({ checked, onChange, disabled }) => {
  return (
    <label className="relative inline-flex items-center cursor-pointer select-none">
      <input 
        type="checkbox" 
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="sr-only peer" 
      />
      <div className="relative w-10 h-5 bg-slate-200 dark:bg-slate-700 rounded-full peer peer-checked:bg-emerald-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5 transition-colors duration-200"></div>
    </label>
  );
};

const StoreAccessManager = ({ userId: propUserId, onClose }) => {
    const { userId: paramUserId } = useParams();
    const userId = propUserId || paramUserId;
    const navigate = useNavigate();
    
    const [user, setUser] = useState(null);
    const [storeModules, setStoreModules] = useState({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [expandedKeys, setExpandedKeys] = useState([]);
    const [expandedSubKeys, setExpandedSubKeys] = useState([]);
    const [outlets, setOutlets] = useState([]);
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        const fetchOutlets = async () => {
            try {
                const res = await fetch(`${API_BASE}/api/auth/my-outlets`, {
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("token")}`
                    }
                });
                if (res.ok) {
                    const data = await res.json();
                    setOutlets(data);
                }
            } catch (e) {
                console.error("Failed to load outlets:", e);
            }
        };
        fetchOutlets();
    }, []);

    useEffect(() => {
        const fetchModuleAccessData = async () => {
            try {
                setLoading(true);
                const res = await fetch(`${API_BASE}/api/brand/users/${userId}/module-access`, {
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("token")}`
                    }
                });
                if (!res.ok) {
                    throw new Error("Failed to load module access credentials.");
                }
                const data = await res.json();
                setUser(data.user);
                
                // Initialize modules permission state, fallback to defaults
                const loadedPermissions = data.store_modules || {};
                const isFirstTime = !data.store_modules || Object.keys(data.store_modules).length === 0;
                const initialModulesState = {};
                
                MODULES_CONFIG.forEach(m => {
                  const saved = loadedPermissions[m.key] || {};
                  
                  const subPermissionsState = {};
                  const settingsState = {};

                  const initSub = (sub) => {
                    const name = typeof sub === "string" ? sub : sub.name;
                    subPermissionsState[name] = saved.subPermissions?.[name] ?? (isFirstTime ? true : false);

                    if (typeof sub === "object") {
                      if (sub.settings) {
                        settingsState[name] = {};
                        sub.settings.forEach(s => {
                          settingsState[name][s] = saved.settings?.[name]?.[s] ?? (isFirstTime ? true : false);
                        });
                      }
                      if (sub.subPermissions) {
                        sub.subPermissions.forEach(child => {
                          initSub(child);
                        });
                      }
                    }
                  };

                  m.subPermissions.forEach(sub => {
                    initSub(sub);
                  });

                  initialModulesState[m.key] = {
                    visible: saved.visible ?? (isFirstTime ? true : false),
                    subPermissions: subPermissionsState,
                    settings: settingsState
                  };
                });
                
                setStoreModules(initialModulesState);
            } catch (err) {
                setNotification({
                    type: "error",
                    message: err.message || "Failed to reach security gateway."
                });
            } finally {
                setLoading(false);
            }
        };

        fetchModuleAccessData();
    }, [userId]);

    const handleToggleVisible = (key) => {
      setStoreModules(prev => {
        const current = prev[key] || { visible: false, subPermissions: {}, settings: {} };
        const newVisible = !current.visible;
        
        const newSubs = { ...current.subPermissions };
        Object.keys(newSubs).forEach(subKey => {
          newSubs[subKey] = newVisible;
        });

        const newSettings = { ...current.settings };
        const config = MODULES_CONFIG.find(m => m.key === key);
        if (config) {
          const setAllSubs = (subList) => {
            subList.forEach(sub => {
              const name = typeof sub === "string" ? sub : sub.name;
              newSubs[name] = newVisible;
              if (typeof sub === "object") {
                if (sub.settings) {
                  newSettings[name] = {};
                  sub.settings.forEach(s => {
                    newSettings[name][s] = newVisible;
                  });
                }
                if (sub.subPermissions) {
                  setAllSubs(sub.subPermissions);
                }
              }
            });
          };
          setAllSubs(config.subPermissions);
        }

        return {
          ...prev,
          [key]: {
            ...current,
            visible: newVisible,
            subPermissions: newSubs,
            settings: newSettings
          }
        };
      });
    };

    const handleToggleSubPermission = (moduleKey, subKey) => {
      setStoreModules(prev => {
        const current = prev[moduleKey] || { visible: false, subPermissions: {}, settings: {} };
        const newChecked = !current.subPermissions[subKey];
        
        const newSubs = {
          ...current.subPermissions,
          [subKey]: newChecked
        };

        const newSettings = { ...current.settings };
        
        const config = MODULES_CONFIG.find(m => m.key === moduleKey);
        if (config) {
          const findAndSetChildren = (subList) => {
            for (const sub of subList) {
              const name = typeof sub === "string" ? sub : sub.name;
              if (name === subKey) {
                if (typeof sub === "object") {
                  if (sub.settings) {
                    newSettings[name] = {};
                    sub.settings.forEach(s => {
                      newSettings[name][s] = newChecked;
                    });
                  }
                  if (sub.subPermissions) {
                    const setChildren = (children) => {
                      children.forEach(child => {
                        const childName = typeof child === "string" ? child : child.name;
                        newSubs[childName] = newChecked;
                        if (typeof child === "object") {
                          if (child.settings) {
                            newSettings[childName] = {};
                            child.settings.forEach(s => {
                              newSettings[childName][s] = newChecked;
                            });
                          }
                          if (child.subPermissions) {
                            setChildren(child.subPermissions);
                          }
                        }
                      });
                    };
                    setChildren(sub.subPermissions);
                  }
                }
                return true;
              }
              if (typeof sub === "object" && sub.subPermissions) {
                if (findAndSetChildren(sub.subPermissions)) return true;
              }
            }
            return false;
          };
          findAndSetChildren(config.subPermissions);
        }

        const anyActive = Object.values(newSubs).some(v => v);
        
        return {
          ...prev,
          [moduleKey]: {
            ...current,
            visible: anyActive ? true : current.visible,
            subPermissions: newSubs,
            settings: newSettings
          }
        };
      });
    };

    const handleToggleSetting = (moduleKey, subKey, settingKey) => {
      setStoreModules(prev => {
        const current = prev[moduleKey] || { visible: false, subPermissions: {}, settings: {} };
        const moduleSettings = current.settings || {};
        const subSettings = moduleSettings[subKey] || {};
        const newSubSettings = {
          ...subSettings,
          [settingKey]: !subSettings[settingKey]
        };

        return {
          ...prev,
          [moduleKey]: {
            ...current,
            settings: {
              ...moduleSettings,
              [subKey]: newSubSettings
            }
          }
        };
      });
    };

    const handleDropdownChange = (moduleKey, subKey, value) => {
      setStoreModules(prev => {
        const current = prev[moduleKey] || { visible: false, subPermissions: {}, settings: {} };
        const moduleSettings = current.settings || {};
        const newSubSettings = {
          ...moduleSettings[subKey],
          [value]: true
        };
        return {
          ...prev,
          [moduleKey]: {
            ...current,
            settings: {
              ...moduleSettings,
              [subKey]: newSubSettings
            }
          }
        };
      });
    };

    const handleToggleExpand = (key) => {
      setExpandedKeys(prev => 
        prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
      );
    };

    const handleToggleSubExpand = (subKey) => {
      setExpandedSubKeys(prev => 
        prev.includes(subKey) ? prev.filter(k => k !== subKey) : [...prev, subKey]
      );
    };

    const handleEnableAll = () => {
      setStoreModules(prev => {
        const updated = {};
        Object.keys(prev).forEach(key => {
          const config = MODULES_CONFIG.find(m => m.key === key);
          const subs = { ...prev[key].subPermissions };
          const settings = { ...prev[key].settings };
          if (config) {
            const setAll = (subList) => {
              subList.forEach(sub => {
                const name = typeof sub === "string" ? sub : sub.name;
                subs[name] = true;
                if (typeof sub === "object") {
                  if (sub.settings) {
                    settings[name] = {};
                    sub.settings.forEach(s => {
                      settings[name][s] = true;
                    });
                  }
                  if (sub.subPermissions) {
                     setAll(sub.subPermissions);
                  }
                }
              });
            };
            setAll(config.subPermissions);
          }
          updated[key] = {
            visible: true,
            subPermissions: subs,
            settings: settings
          };
        });
        return updated;
      });
    };

    const handleDisableAll = () => {
      setStoreModules(prev => {
        const updated = {};
        Object.keys(prev).forEach(key => {
          const config = MODULES_CONFIG.find(m => m.key === key);
          const subs = { ...prev[key].subPermissions };
          const settings = { ...prev[key].settings };
          if (config) {
            const setAll = (subList) => {
              subList.forEach(sub => {
                const name = typeof sub === "string" ? sub : sub.name;
                subs[name] = false;
                if (typeof sub === "object") {
                  if (sub.settings) {
                    settings[name] = {};
                    sub.settings.forEach(s => {
                      settings[name][s] = false;
                    });
                  }
                  if (sub.subPermissions) {
                    setAll(sub.subPermissions);
                  }
                }
              });
            };
            setAll(config.subPermissions);
          }
          updated[key] = {
            visible: false,
            subPermissions: subs,
            settings: settings
          };
        });
        return updated;
      });
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            const res = await fetch(`${API_BASE}/api/brand/users/${userId}/module-access`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({ store_modules: storeModules })
            });

            if (res.ok) {
                setNotification({
                    type: "success",
                    message: "Store Access Level saved successfully!"
                });
                setTimeout(() => {
                    if (onClose) onClose();
                    else navigate("/outlet-users");
                }, 1500);
            } else {
                const data = await res.json();
                throw new Error(data.error || "Update operation failed.");
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

    // Filter modules based on search
    const filteredModules = MODULES_CONFIG.filter(m => {
      const matchModule = m.label.toLowerCase().includes(searchTerm.toLowerCase());
      const matchSub = m.subPermissions.some(sub => {
        const name = typeof sub === "string" ? sub : sub.name;
        return name.toLowerCase().includes(searchTerm.toLowerCase());
      });
      return matchModule || matchSub;
    });

    const renderSubPermissionRow = (sub, moduleKey, depth = 0) => {
       const name = typeof sub === "string" ? sub : sub.name;
       const label = typeof sub === "string" ? sub : (sub.label || sub.name);
       const currentModule = storeModules[moduleKey] || { visible: false, subPermissions: {}, settings: {} };
       
       const isChecked = currentModule.subPermissions?.[name] || false;
       const isSubExpanded = expandedSubKeys.includes(name);
       const hasChildren = typeof sub === "object" && sub.subPermissions && sub.subPermissions.length > 0;
       const hasSettings = typeof sub === "object" && sub.settings && sub.settings.length > 0;
       const isDropdown = typeof sub === "object" && sub.type === "dropdown";

       const paddingLeft = `${16 + depth * 24}px`;

       return (
         <React.Fragment key={name}>
           <tr className="hover:bg-slate-100/50 dark:hover:bg-white/[0.01] transition-colors">
             <td className="pr-4 py-3 text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-tight flex items-center gap-2" style={{ paddingLeft }}>
               {hasChildren ? (
                 <button 
                   onClick={() => handleToggleSubExpand(name)}
                   className="w-5 h-5 rounded-full bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 flex items-center justify-center text-slate-500 dark:text-slate-400 transition-all mr-1"
                 >
                   {isSubExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                 </button>
               ) : (
                 <Key className="w-3.5 h-3.5 text-slate-400" />
               )}
               <span>{label}</span>
               {hasChildren && (
                 <span className="ml-2 px-1.5 py-0.5 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full text-[8px] font-black uppercase tracking-wider">
                   {sub.subPermissions.length} permissions
                 </span>
               )}
             </td>
             <td className="px-4 py-3 text-center">
               {isDropdown ? (
                 <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">VIA SETTING</span>
               ) : (
                 <IosToggle 
                   checked={isChecked} 
                   onChange={() => handleToggleSubPermission(moduleKey, name)} 
                 />
               )}
             </td>
             <td className="px-4 py-3 text-left">
               {isDropdown ? (
                 <select 
                   value={currentModule.settings?.[name]?.[(name === "Default Outlet" && outlets.length > 0) ? outlets[0].name : sub.options[0]] || ""} 
                   onChange={(e) => handleDropdownChange(moduleKey, name, e.target.value)}
                   className="h-8 px-3 py-1 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-250 dark:border-white/5 rounded-md text-[11px] font-medium outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/10 transition-all min-w-[140px]"
                 >
                   {((name === "Default Outlet" && outlets.length > 0) ? ["Select Outlet", ...outlets.map(o => o.name)] : sub.options).map(opt => (
                     <option key={opt} value={opt}>{opt}</option>
                   ))}
                 </select>
               ) : hasSettings ? (
                 <div className="flex flex-wrap gap-2 justify-start items-center">
                   {sub.settings.map(setting => {
                     const isSettingChecked = currentModule.settings?.[name]?.[setting] || false;
                     return (
                       <div key={setting} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white dark:bg-[#1a1d24] border border-slate-200 dark:border-white/5 rounded-full shadow-sm">
                         <IosToggle 
                           checked={isSettingChecked} 
                           onChange={() => handleToggleSetting(moduleKey, name, setting)} 
                         />
                         <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-300 whitespace-nowrap">{setting}</span>
                       </div>
                     );
                   })}
                 </div>
               ) : null}
             </td>
           </tr>
           {hasChildren && isSubExpanded && (
             sub.subPermissions.map(child => renderSubPermissionRow(child, moduleKey, depth + 1))
           )}
         </React.Fragment>
       );
    };

    return (
        <div className="h-full flex flex-col space-y-6 animate-in fade-in duration-500 max-w-7xl mx-auto p-4 sm:p-6 text-slate-700 dark:text-slate-200 overflow-hidden">
            {/* Header section */}
            <div className="flex items-center justify-between bg-transparent p-1 shrink-0">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg text-emerald-600 dark:text-emerald-400">
                        <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-800 dark:text-white tracking-tight">Update Store Login Access Level</h2>
                        <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                            Manage module permissions and access levels {user?.name ? `for ${user.name}` : ""}
                        </p>
                    </div>
                </div>
                {onClose && (
                    <button 
                        onClick={onClose}
                        className="p-1.5 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white transition-all"
                    >
                        <X className="w-5 h-5" />
                    </button>
                )}
            </div>

            {loading ? (
                <div className="flex-1 flex flex-col items-center justify-center bg-white dark:bg-[#1e2129] rounded-xl border border-slate-200 dark:border-white/5 py-32 text-center shadow-sm">
                    <div className="flex flex-col items-center gap-4 animate-pulse">
                        <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">Mapping credentials to security modules...</p>
                    </div>
                </div>
            ) : (
                <div className="flex-1 min-h-0 flex flex-col space-y-6 overflow-hidden">
                    {/* Modules Checklist Accordion Panel (Full Width) */}
                    <div className="flex-1 min-h-0 w-full bg-white dark:bg-[#1e2129] rounded-xl border border-slate-200 dark:border-white/5 shadow-sm overflow-hidden flex flex-col">
                        {/* Selector Controls Bar */}
                        <div className="px-5 py-4 border-b border-slate-200 dark:border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50 dark:bg-white/[0.01]">
                            {/* Search bar */}
                            <div className="relative w-full sm:max-w-xs">
                              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                <Search className="w-4 h-4" />
                              </span>
                              <input 
                                type="text"
                                placeholder="Search module..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 bg-white dark:bg-[#161922] text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/5 rounded-lg text-[11px] font-medium outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/10 transition-all"
                              />
                            </div>

                            {/* Bulk Actions */}
                            <div className="flex items-center gap-2 shrink-0">
                                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mr-2">Bulk actions:</span>
                                <button 
                                    onClick={handleEnableAll}
                                    className="h-8 px-3 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 border border-emerald-200/30 rounded text-[10px] font-bold uppercase tracking-widest transition-all flex items-center gap-1.5"
                                >
                                    <Check className="w-3.5 h-3.5" /> Enable All
                                </button>
                                <button 
                                    onClick={handleDisableAll}
                                    className="h-8 px-3 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-500/20 border border-rose-200/30 rounded text-[10px] font-bold uppercase tracking-widest transition-all flex items-center gap-1.5"
                                >
                                    <X className="w-3.5 h-3.5" /> Disable All
                                </button>
                            </div>
                        </div>

                        {/* Modules Accordion List */}
                        <div className="divide-y divide-slate-100 dark:divide-white/5 flex-1 overflow-y-auto custom-scrollbar">
                            {filteredModules.map((m) => {
                                const currentModule = storeModules[m.key] || { visible: false, subPermissions: {} };
                                const isExpanded = expandedKeys.includes(m.key);
                                const hasSubs = m.subPermissions.length > 0;

                                return (
                                    <div key={m.key} className="flex flex-col bg-transparent">
                                        {/* Main Module Row */}
                                        <div 
                                            onClick={() => hasSubs && handleToggleExpand(m.key)}
                                            className={`flex items-center justify-between p-4 transition-colors cursor-pointer select-none ${currentModule.visible ? "bg-emerald-500/[0.01]" : ""} hover:bg-slate-50/50 dark:hover:bg-white/[0.01]`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded bg-slate-50 dark:bg-white/5 border border-slate-200/30 text-slate-400 transition-colors ${currentModule.visible ? "text-emerald-500 dark:text-emerald-400 border-emerald-500/20 bg-emerald-500/5" : ""}`}>
                                                    <Layers className="w-3.5 h-3.5" />
                                                </div>
                                                <div className="flex flex-col">
                                                  <span className="text-[12px] font-bold text-slate-700 dark:text-slate-200 uppercase tracking-tight">
                                                      {m.label}
                                                  </span>
                                                  {hasSubs && (
                                                    <span className="text-[8.5px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                                                        {m.subPermissions.length} permissions
                                                    </span>
                                                  )}
                                                </div>
                                            </div>

                                            {/* Visibility Toggle Switch & Chevron */}
                                            <div className="flex items-center gap-4" onClick={e => e.stopPropagation()}>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Is Visible</span>
                                                    <IosToggle 
                                                        checked={currentModule.visible}
                                                        onChange={() => handleToggleVisible(m.key)}
                                                    />
                                                </div>

                                                {hasSubs && (
                                                  <button 
                                                    onClick={() => handleToggleExpand(m.key)}
                                                    className="w-7 h-7 rounded-full bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 flex items-center justify-center text-slate-500 dark:text-slate-400 transition-all"
                                                  >
                                                    {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                                                  </button>
                                                )}
                                            </div>
                                        </div>

                                        {/* Subpermissions Sub-Checklist (Expanded Table) */}
                                        {hasSubs && isExpanded && (
                                          <div className="w-full border-t border-slate-100 dark:border-white/5 bg-slate-50/30 dark:bg-black/10">
                                              <table className="w-full text-left border-collapse">
                                                  <thead>
                                                      <tr className="border-b border-slate-250 dark:border-white/5 text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest bg-slate-50/80 dark:bg-white/[0.02]">
                                                          <th className="pl-12 pr-4 py-2.5">Permission</th>
                                                          <th className="px-4 py-2.5 text-center w-28">Visible</th>
                                                          <th className="px-4 py-2.5 text-left">Settings</th>
                                                      </tr>
                                                  </thead>
                                                  <tbody className="divide-y divide-slate-150 dark:divide-white/5">
                                                      {m.subPermissions.map(sub => renderSubPermissionRow(sub, m.key))}
                                                  </tbody>
                                              </table>
                                          </div>
                                        )}
                                    </div>
                                );
                            })}
                            
                            {filteredModules.length === 0 && (
                                <div className="text-center py-20 opacity-30 flex flex-col items-center gap-2">
                                    <AlertCircle className="w-8 h-8 text-slate-400" />
                                    <span className="text-[10px] font-bold uppercase tracking-wider">No matching modules registered.</span>
                                </div>
                            )}
                        </div>
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
                                onClick={() => {
                                    if (onClose) onClose();
                                    else navigate("/outlet-users");
                                }}
                                className="h-9 px-5 bg-slate-800 hover:bg-slate-700 text-white rounded-md text-[11px] font-bold uppercase tracking-widest transition-all flex items-center gap-2 shadow-sm"
                            >
                                <ArrowLeft className="w-3.5 h-3.5" /> Back
                            </button>
                            <button 
                                type="button"
                                onClick={handleSave}
                                disabled={saving || loading}
                                className="h-9 px-5 bg-emerald-800 hover:bg-emerald-700 disabled:bg-emerald-800/50 text-white rounded-md font-bold text-[11px] uppercase tracking-widest transition-all flex items-center gap-2 shadow-md shadow-emerald-800/10"
                            >
                                {saving ? (
                                    <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <Save className="w-3.5 h-3.5" />
                                )}
                                {saving ? "Saving..." : "Update"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Notification alert system */}
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

export default StoreAccessManager;
