import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import { 
  LayoutDashboard, Users, ShoppingCart, 
  Settings, ChevronDown, LogOut, Menu, X, 
  Bell, Search, Building2, Smartphone, Monitor, MessageSquare, Megaphone,
  Zap, Shield, Activity, Package, Globe, UserCircle,
  Command, Box, Mail, Filter, RefreshCw, BarChart3, Database,
  Briefcase, Key, ChevronRight, HelpCircle, AlertCircle,
  CreditCard, Shuffle, Layers, Percent, BookOpen, Map, Calendar,
  FileText, Grid, Heart, Truck, ClipboardList, Tag, Sliders, List, MenuSquare, Upload,
  Clock, Hourglass, User, UserCheck, Utensils, LayoutGrid, Printer, History, Headphones, Wallet, Receipt, Award, QrCode
} from "lucide-react";
import API_BASE from "../config";

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [desktopSidebarCollapsed, setDesktopSidebarCollapsed] = useState(false);
  const [outlets, setOutlets] = useState([]);
  
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  
  // Default to user's own ID if they are an outlet user (role === 'user') and no impersonation is set or is set to 'global'
  const defaultOutletId = (user.role === 'user' && (!sessionStorage.getItem("impersonate_id") || sessionStorage.getItem("impersonate_id") === 'global')) 
    ? user.id 
    : (sessionStorage.getItem("impersonate_id") || 'global');
    
  const [currentOutletId, setCurrentOutletId] = useState(defaultOutletId);
  const [permissions, setPermissions] = useState(null);
  
  const [openGroup, setOpenGroup] = useState(null);
  const [openSubGroup, setOpenSubGroup] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState(null);

  useEffect(() => {
    const fetchOutletsAndProfile = async () => {
        try {
            const res = await fetch(`${API_BASE}/api/auth/my-outlets`, {
                headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
            });
            const data = await res.json();
            if (res.ok) setOutlets(data);

            const profileRes = await fetch(`${API_BASE}/api/auth/profile`, {
                headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
            });
            if (profileRes.ok) {
                const profileData = await profileRes.json();
                setPermissions(profileData.staff_permissions || {});
                localStorage.setItem("user", JSON.stringify({ ...user, ...profileData }));
            }
        } catch (e) { console.error(e); }
    };
    fetchOutletsAndProfile();
  }, []);

  const handleContextSwitch = (id) => {
    if (!id || id === "global") {
        sessionStorage.removeItem("impersonate_id");
        setCurrentOutletId("global");
    } else {
        sessionStorage.setItem("impersonate_id", id);
        setCurrentOutletId(id);
    }
    window.location.reload();
  };

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = "/login";
  };

  const getNavItems = () => {
    const role = user.role || "";
    
    if (role === "master_admin") {
      return [
        { name: "Master Dashboard", icon: LayoutDashboard, path: "/master-dashboard" },
        { name: "Manage Users", icon: Users, path: "/manage-users" },
        { name: "System Health", icon: Activity, path: "/system-health" },
        { name: "Audit Logs", icon: Shield, path: "/audit-logs" },
        { name: "WhatsApp Engine", icon: Mail, path: "/whatsapp-connect" },
        { name: "Command Center", icon: Command, path: "/command-center" },
      ];
    }

    const baseItems = [
      { name: "Revenue Dashboard", icon: LayoutDashboard, path: "/dashboard", badge: "New" },
      { name: "Live Order Tracking", icon: Activity, path: "/orders" },
      { 
        name: "POS Configuration", 
        icon: Smartphone, 
        isDropdown: true,
        subItems: [
          { name: "Outlet Configuration", icon: Sliders, isHeader: true, subItems: [
            { name: "Outlet Designation", icon: Briefcase, path: "/designations" },
            { name: "Outlet User", icon: UserCircle, path: "/staff" },
            { name: "Outlet Payment Mode", icon: CreditCard, path: "/outlet-payments" },
            { name: "Order Type Mapping", icon: Shuffle, path: "/order-types" },
            { name: "Pre-Order Settings", icon: Calendar, path: "/pre-order-settings" },
          ]},
          { name: "Master Configuration", icon: Box, isHeader: true, subItems: [
            { name: "Tax Product Group", icon: Layers, path: "/tax-product-group" },
            { name: "Tax Configuration", icon: Percent, path: "/tax-config" },
            { name: "Kitchen Department", icon: Grid, path: "/kitchen-department" },
            { name: "Table Department", icon: Layers, path: "/table-department" },
            { name: "Table Management", icon: Smartphone, path: "/table-management" },
            { name: "Discount", icon: Tag, path: "/discount-manager" },
            { name: "Additional Charges", icon: CreditCard, path: "/additional-charges" },
            { name: "QR Management", icon: QrCode, path: "/business-data/qr" }
          ] },
          { name: "Tax & Finance", icon: Percent, isHeader: true, subItems: [
            { name: "GL Mappings", icon: BookOpen, path: "/gl-mappings" },
          ]},
          { name: "Floor & Seating", icon: Map, isHeader: true, subItems: [
            { name: "Floor Plan", icon: Map, path: "/floor-plan" },
            { name: "Reservations", icon: Calendar, path: "/reservations" },
          ]}
          ]
      },
      { 
          name: "Menu Management", 
          icon: Package, 
          isDropdown: true,
          subItems: [
            { name: "Outlet Menu", icon: MenuSquare, path: "/outlet-menus" },
            { name: "Unified Master Menu", icon: BookOpen, path: "/master-menu" },
            { name: "Multiple Pricing", icon: Sliders, path: "/multiple-pricing" },
            { name: "Option Group", icon: List, path: "/option-groups" },
            { name: "Modifier Groups", icon: Layers, path: "/modifier-groups" },
            { name: "Item Notes", icon: FileText, path: "/item-notes" },
            { name: "Categories", icon: Grid, path: "/categories" },
            { name: "Nutrition Configuration", icon: Heart, path: "/nutrition" },
            { name: "Upload Menu In Bulk", icon: Upload, path: "/outlet-menus/bulk-upload" }
          ]
      },
      { 
          name: "Online Order", 
          icon: ShoppingCart, 
          isDropdown: true,
          subItems: [
            { name: "Orders", icon: ShoppingCart, path: "/online-orders" },
            { name: "Digital Order Settings", icon: Settings, path: "/digital-order-settings" },
            { name: "Delivery Platforms", icon: Truck, path: "/delivery-platforms" },
          ]
      },
      { 
          name: "Reports", 
          icon: BarChart3, 
          isDropdown: true,
          subItems: [
            { name: "Sales Report", icon: BarChart3, path: "/analytics/sales-report" },
            { name: "DSR Report", icon: FileText, path: "/analytics/dsr-report" },
            { name: "Z-Report", icon: Calendar, path: "/analytics/todays-report" },
            { name: "Item Report", icon: Package, path: "/analytics/item-report" },
            { name: "Meal Time-Based Sales Report", icon: Clock, path: "/analytics/meal-time-sales" },
            { name: "Hourly Report", icon: Hourglass, path: "/analytics/hourly-report" },
            { name: "Waiter Incentive Report", icon: User, path: "/analytics/waiter-incentive" },
            { name: "Payment Report", icon: CreditCard, path: "/analytics/payment-report" },
            { name: "Expense Tracking Report", icon: Wallet, path: "/analytics/expense-report" },
            { name: "Order Type Report", icon: Receipt, path: "/analytics/order-type" },
            { name: "Category Report", icon: LayoutGrid, path: "/analytics/category-report" },
            { name: "Kitchen Department Report", icon: Utensils, path: "/analytics/kitchen-dept" },
            { name: "Coupon History Report", icon: Tag, path: "/analytics/coupon-history" },
            { name: "Due Payment Report", icon: AlertCircle, path: "/analytics/due-payment" },
            { name: "Start Close Day Report", icon: LogOut, path: "/analytics/start-close-day" },
            { name: "Shift Wise Report", icon: Users, path: "/analytics/shift-wise" },
            { name: "Discount Report", icon: Percent, path: "/analytics/discount-report" },
            { name: "Biller Wise Summary", icon: FileText, path: "/analytics/biller-wise" },
            { name: "Delivery Report", icon: Truck, path: "/analytics/delivery-report" },
            { name: "Day Wise Summary Report", icon: Calendar, path: "/analytics/day-wise" },
            { name: "Customer Queries", icon: Headphones, path: "/analytics/customer-queries" },
            { name: "Bill Print Report", icon: Printer, path: "/analytics/bill-print" },
            { name: "Applied Charges Report", icon: Receipt, path: "/analytics/applied-charges" },
            { name: "Passcode User Report", icon: UserCheck, path: "/analytics/passcode-user" },
            { name: "Order Sync History", icon: RefreshCw, path: "/analytics/order-sync" },
            { name: "ZATCA Report", icon: FileText, path: "/analytics/zatca-report" },
            { name: "Logistic Report", icon: Truck, path: "/analytics/logistic-report" },
            { name: "Order Transition Report", icon: RefreshCw, path: "/analytics/order-transition" },
            { name: "ERP Sync History", icon: Database, path: "/analytics/erp-sync" },
            { name: "Jordan History", icon: History, path: "/analytics/jordan-history" },
            { name: "UPI Report", icon: CreditCard, path: "/analytics/upi-report" }
          ]
      },
      {
          name: "CRM",
          icon: Users,
          isDropdown: true,
          subItems: [
            { name: "Customer Management", icon: Users, path: "/customer-management" }
          ]
      },
      {
          name: "Whatsapp Marketing",
          icon: Mail,
          isDropdown: true,
          subItems: [
            { name: "Dashboard", icon: LayoutDashboard, path: "/whatsapp-marketing/dashboard" },
            { name: "Templates", icon: FileText, path: "/whatsapp-marketing/templates" },
            { name: "Campaigns", icon: Megaphone, path: "/whatsapp-marketing/campaigns" },
            { name: "Messages", icon: MessageSquare, path: "/whatsapp-marketing/messages" },
            { name: "Organizations", icon: Building2, path: "/whatsapp-marketing/organizations" },
            { name: "Chat-Flow", icon: Shuffle, path: "/whatsapp-marketing/chat-flow" },
            { name: "CRM", icon: Users, path: "/whatsapp-marketing/crm" },
            { name: "Analytics", icon: BarChart3, path: "/whatsapp-marketing/analytics" }
          ]
      },
      { 
          name: "Command Center", 
          icon: Command, 
          isDropdown: true,
          subItems: [
            { name: "Operational Rules", icon: FileText, path: "/business-data/rules" },
            { name: "AI Knowledge Base", icon: Database, path: "/business-data/knowledge" },
            { name: "Geofencing Ops", icon: Globe, path: "/geofencing" }
          ]
      },
      { 
          name: "Supply Chain", 
          icon: Database, 
          isDropdown: true,
          subItems: [
            { name: "Vendors List", icon: Truck, path: "/inventory/vendors" },
            { name: "Inventory Ops", icon: Box, path: "/business-data/inventory" },
            { name: "Stock Entry", icon: ClipboardList, path: "/inventory/manual-stock-entry" }
          ]
      },
      { 
          name: "Digital Channels", 
          icon: Globe, 
          isDropdown: true,
          subItems: [
            { name: "Online Orders", icon: ShoppingCart, path: "/online-orders" },
            { name: "Mobile App Config", icon: Smartphone, path: "/mobile-app" },
            { name: "Delivery Platforms", icon: Truck, path: "/delivery-platforms" }
          ]
      },
      { 
          name: "Growth & CRM", 
          icon: Users, 
          isDropdown: true,
          badge: "New",
          subItems: [
            { name: "Discount Engine", icon: Tag, path: "/discount-manager" },
            { name: "CRM Dashboard", icon: Users, path: "/crm" },
            { name: "Reports Center", icon: BarChart3, path: "/reports" }
          ]
      },
      { 
          name: "WhatsApp Engine", 
          icon: Mail, 
          isDropdown: true,
          badge: "New",
          subItems: [
            { name: "WhatsApp Connect", icon: Mail, path: "/whatsapp-connect" },
            { name: "Broadcast Hub", icon: Zap, path: "/broadcast" },
            { name: "Bot Config", icon: Settings, path: "/bot-config" }
          ]
      },
      { 
          name: "Settings", 
          icon: Settings, 
          isDropdown: true,
          subItems: [
            { name: "Profile", icon: UserCircle, path: "/profile" },
            { name: "Loyalty Settings", icon: Award, path: "/loyalty-settings" },
            { name: "Notification Settings", icon: Bell, path: "/notification-settings" },
            { name: "Business Setup", icon: Building2, path: "/setup-business" },
            { name: "Business Identity", icon: Briefcase, path: "/business-identity" },
            { name: "Integrations", icon: Globe, path: "/integrations" },
          ]
      },
    ];

    if ((role === "brand_owner" || role.startsWith("admin")) && currentOutletId === "global") {
        baseItems.splice(2, 0, { name: "Admin Management", icon: Shield, path: "/admin-dashboard" });
    }

    const filterNavItems = (items) => {
      if (role === "master_admin" || role === "brand_owner" || role?.startsWith("admin")) {
        return items;
      }
      
      const storeModules = permissions?.store_modules;
      if (!storeModules || Object.keys(storeModules).length === 0) {
        return items;
      }

      return items.map(item => {
        let moduleKey = item.name;
        if (moduleKey === "Online Order") moduleKey = "Digital Order";
        if (moduleKey === "Supply Chain") moduleKey = "Inventory Management";
        
        const modulePerm = storeModules[moduleKey];
        if (modulePerm) {
          if (modulePerm.visible === false) return null;
          
          if (item.isDropdown && item.subItems) {
            const filteredSubItems = item.subItems.map(sub => {
              if (sub.isHeader) {
                if (sub.subItems) {
                  const filteredSS = sub.subItems.filter(ss => {
                    return modulePerm.subPermissions?.[ss.name] !== false;
                  });
                  if (filteredSS.length === 0) return null;
                  return { ...sub, subItems: filteredSS };
                }
                return sub;
              } else {
                return modulePerm.subPermissions?.[sub.name] !== false ? sub : null;
              }
            }).filter(Boolean);
            
            if (filteredSubItems.length === 0) return null;
            return { ...item, subItems: filteredSubItems };
          }
        }
        return item;
      }).filter(Boolean);
    };

    let items = baseItems;
    if (currentOutletId === "global") {
        items = items.filter(i => i.name !== "Revenue Dashboard");
    }
    return filterNavItems(items);
  };

  const navItems = getNavItems();

    const [isSidebarHovered, setIsSidebarHovered] = useState(false);
    const isExpanded = !desktopSidebarCollapsed || isSidebarHovered;
    const currentOutlet = outlets.find(o => o.id === currentOutletId) || (currentOutletId === "global" ? { outlet_name: "Global Overview" } : null);

    return (

        <div className="flex h-screen bg-slate-50 dark:bg-[#14161b] transition-colors duration-500 overflow-hidden font-sans">
            {/* Sidebar Architecture — Fixed Footprint to prevent screen shift */}
            <div className={`${desktopSidebarCollapsed ? 'w-20' : 'w-72'} transition-all duration-300 ease-in-out`} />

            <aside 
                onMouseEnter={() => desktopSidebarCollapsed && setIsSidebarHovered(true)}
                onMouseLeave={() => setIsSidebarHovered(false)}
                className={`
                    ${(desktopSidebarCollapsed && !isSidebarHovered) ? 'w-20' : 'w-72'} 
                    flex flex-col bg-white dark:bg-[#1e2129] border-r border-slate-100 dark:border-white/5 
                    transition-all duration-300 ease-in-out fixed inset-y-0 left-0 z-30 
                    shadow-2xl shadow-slate-200/50 dark:shadow-none
                `}
            >
                <div className="p-4 flex items-center justify-between border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-black/20">
                    {isExpanded ? (
                        <div className="flex items-center gap-3 animate-in fade-in duration-300 overflow-hidden">
                            <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center text-white border border-emerald-500 shrink-0 shadow-lg shadow-emerald-600/20">
                                {currentOutlet?.logo ? <img src={currentOutlet.logo} className="w-full h-full rounded-xl object-cover" /> : <img src="/logo.png" className="w-full h-full rounded-xl object-contain p-1" />}
                            </div>
                            <div className="flex flex-col min-w-0">
                                <span className="text-[14px] font-black text-slate-900 dark:text-white leading-tight uppercase tracking-tight truncate">SaSLoop POS</span>
                                <span className="text-[9px] font-black text-emerald-600 dark:text-emerald-500 uppercase tracking-widest mt-1">Operational Node</span>
                            </div>
                        </div>
                    ) : (
                        <div className="w-full flex justify-center">
                            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white border border-emerald-500 shadow-lg">
                                {currentOutlet?.logo ? <img src={currentOutlet.logo} className="w-8 h-8 rounded-lg object-cover" /> : <img src="/logo.png" className="w-8 h-8 rounded-lg object-contain p-0.5" />}
                            </div>
                        </div>
                    )}
                    {isExpanded && (
                        <button onClick={() => {
                            setDesktopSidebarCollapsed(!desktopSidebarCollapsed);
                            setIsSidebarHovered(false);
                        }} className="p-1.5 hover:bg-slate-200 dark:hover:bg-white/10 rounded-md transition-all text-slate-400 shrink-0">
                            <Menu className="w-4 h-4" />
                        </button>
                    )}
                </div>

                <nav className="flex-1 overflow-y-auto custom-scrollbar p-1 space-y-0.5 overflow-x-hidden">
                    {navItems.map((item) => {
                        const isGlobalAccessible = 
                            item.path === "/dashboard" || 
                            item.path === "/admin-dashboard" || 
                            item.path === "/master-dashboard" || 
                            item.path === "/manage-users" ||
                            item.name === "Whatsapp Marketing";
                        
                        // If user is an outlet (role === 'user'), don't hide items even if context is 'global'
                        if (currentOutletId === "global" && !isGlobalAccessible && user.role !== 'user') return null;

                        return (
                            <div key={item.name} className="space-y-0">
                                {item.isDropdown ? (
                                <>
                                    <button 
                                        onClick={() => setOpenGroup(openGroup === item.name ? null : item.name)} 
                                        className={`w-full flex items-center ${isExpanded ? 'px-3' : 'justify-center'} py-2 text-[11px] font-black rounded transition-all group ${openGroup === item.name ? 'text-slate-900 dark:text-white bg-slate-50 dark:bg-white/5' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5'}`}
                                    >
                                        <item.icon className={`h-5 w-5 ${isExpanded ? 'mr-3' : ''} shrink-0 transition-colors ${openGroup === item.name ? 'text-emerald-500' : 'text-slate-400 dark:text-slate-500 group-hover:text-emerald-500'}`} />
                                        {isExpanded && <span className="flex-1 text-left truncate uppercase tracking-tight">{item.name}</span>}
                                        {item.badge && isExpanded && <span className="mr-2 px-2 py-0.5 bg-emerald-600 text-white text-[9px] font-black rounded">{item.badge}</span>}
                                        {isExpanded && <ChevronDown className={`w-4 h-4 transition-all opacity-40 ${openGroup === item.name ? 'rotate-180 opacity-100' : ''}`} />}
                                    </button>
                                    {openGroup === item.name && isExpanded && (
                                    <div className="pl-11 py-1 space-y-0.5 animate-in slide-in-from-top-1 duration-200">
                                        {item.subItems.map(sub => (
                                        <div key={sub.name} className="space-y-0.5">
                                            {sub.isHeader ? (
                                            <>
                                                <button 
                                                 onClick={() => setOpenSubGroup(openSubGroup === sub.name ? null : sub.name)}
                                                 className="w-full flex items-center justify-between py-1.5 mt-1 first:mt-0 group/sub"
                                                 >
                                                 <div className="flex items-center gap-3">
                                                     {sub.icon && <sub.icon className={`w-4 h-4 transition-colors ${openSubGroup === sub.name ? 'text-emerald-500' : 'text-slate-400 dark:text-slate-500'}`} />}
                                                     <span className="text-[10px] font-black transition-colors text-slate-400 dark:text-slate-500 group-hover/sub:text-slate-600 dark:group-hover/sub:text-slate-300 truncate uppercase tracking-tight">{sub.name}</span>
                                                 </div>
                                                 {sub.subItems && <ChevronDown className={`w-3.5 h-3.5 transition-all opacity-40 ${openSubGroup === sub.name ? 'rotate-180 opacity-100 text-emerald-500' : ''}`} />}
                                                 </button>
                                                 {sub.subItems && openSubGroup === sub.name && (
                                                 <div className="pl-4 border-l-2 border-slate-100 dark:border-white/5 space-y-0.5 ml-1.5 animate-in slide-in-from-top-1 duration-200">
                                                     {sub.subItems.map(ss => (
                                                      <Link 
                                                          key={ss.name} 
                                                          to={ss.path} 
                                                          onClick={() => { 
                                                              if (desktopSidebarCollapsed) setIsSidebarHovered(false);
                                                              if (window.innerWidth < 1024) setDesktopSidebarCollapsed(true);
                                                          }}
                                                          className={`flex items-center gap-3 py-2 px-3 rounded text-[10px] font-black transition-all ${location.pathname === ss.path ? 'bg-emerald-600/10 text-emerald-500' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5'}`}
                                                      >
                                                          {ss.icon && <ss.icon className={`w-4 h-4 shrink-0 transition-colors ${location.pathname === ss.path ? 'text-emerald-500' : 'text-slate-400 dark:text-slate-500'}`} />}
                                                          <span className="truncate uppercase tracking-tight">{ss.name}</span>
                                                      </Link>
                                                     ))}
                                                 </div>
                                                 )}
                                            </>
                                            ) : (
                                              <Link 
                                                  key={sub.name} 
                                                  to={sub.path} 
                                                  onClick={() => { 
                                                      if (desktopSidebarCollapsed) setIsSidebarHovered(false);
                                                      if (window.innerWidth < 1024) setDesktopSidebarCollapsed(true);
                                                  }}
                                                  className={`flex items-center gap-3 py-2 text-[10px] font-black transition-colors hover:text-slate-900 dark:hover:text-white ${location.pathname === sub.path ? 'text-emerald-500' : 'text-slate-400 dark:text-slate-500'}`}
                                              >
                                                  {sub.icon && <sub.icon className={`w-4 h-4 shrink-0 transition-colors ${location.pathname === sub.path ? 'text-emerald-500' : 'text-slate-400 dark:text-slate-500'}`} />}
                                                  <span className="truncate uppercase tracking-tight">{sub.name}</span>
                                              </Link>
                                            )}
                                        </div>
                                        ))}
                                    </div>
                                    )}
                                </>
                                ) : (
                                <Link 
                                    to={item.path} 
                                    onClick={() => { 
                                        if (desktopSidebarCollapsed) setIsSidebarHovered(false);
                                        if (window.innerWidth < 1024) setDesktopSidebarCollapsed(true);
                                    }}
                                    className={`flex items-center ${isExpanded ? 'px-3' : 'justify-center'} py-2.5 text-[11px] font-black rounded transition-all group ${location.pathname === item.path ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5'}`}
                                >
                                    <item.icon className={`h-5 w-5 shrink-0 transition-colors ${location.pathname === item.path ? 'text-white' : 'text-slate-400 dark:text-slate-500 group-hover:text-emerald-500'} ${isExpanded ? 'mr-3' : ''}`} />
                                    {isExpanded && <span className="flex-1 truncate uppercase tracking-tight">{item.name}</span>}
                                    {item.badge && isExpanded && <span className={`px-2 py-0.5 text-[9px] font-black rounded ${location.pathname === item.path ? 'bg-white/20 text-white' : 'bg-emerald-600 text-white'}`}>{item.badge}</span>}
                                </Link>
                                )}
                            </div>
                        );
                    })}

                    {currentOutletId === "global" && isExpanded && (
                        <div className="py-10 px-4 text-center space-y-6 opacity-40 group-hover:opacity-100 transition-opacity border-t border-slate-100 dark:border-white/5 mt-4">
                            <div className="w-16 h-16 bg-slate-100 dark:bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-2 border border-slate-200 dark:border-white/10">
                                <Shield className="w-8 h-8 text-slate-400" />
                            </div>
                            <div className="space-y-2">
                                <p className="text-[12px] font-black text-slate-800 dark:text-white uppercase tracking-widest leading-tight">Select Outlet<br/>to Activate Tools</p>
                                <p className="text-[9px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-tighter italic">Operational Context Locked</p>
                            </div>
                        </div>
                    )}
                </nav>

                <div className="p-3 border-t border-slate-100 dark:border-white/5 bg-white dark:bg-[#1e2129] space-y-2">
                    {/* Switch layout button for mobile screens */}
                    <button
                        onClick={() => {
                            localStorage.setItem("preferred_layout_mode", "mobile");
                            window.dispatchEvent(new CustomEvent("switchLayoutMode", { detail: "mobile" }));
                        }}
                        className="lg:hidden w-full flex items-center justify-center gap-2 py-2 bg-slate-50 hover:bg-slate-100 dark:bg-black/20 dark:hover:bg-white/5 rounded-lg border border-slate-100 dark:border-white/5 text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider transition-all active:scale-[0.98]"
                    >
                        <Smartphone className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
                        {isExpanded && <span>Mobile View</span>}
                    </button>

                    <div className={`p-3 rounded-xl bg-slate-50 dark:bg-black/20 border border-slate-100 dark:border-white/5 ${(!isExpanded) ? 'flex justify-center p-2' : ''}`}>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white font-black text-[14px] shrink-0">
                                {user.name?.[0] || 'A'}
                            </div>
                            {isExpanded && (
                                <div className="flex flex-col min-w-0">
                                    <span className="text-[12px] font-black text-slate-900 dark:text-white truncate uppercase tracking-tighter">{user.name || 'Administrator'}</span>
                                    <span className="text-[9px] font-black text-emerald-600 dark:text-emerald-500 uppercase tracking-widest">{user.role?.replace('_', ' ') || 'Brand Owner'}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </aside>


        {/* Main Content Engineering */}
        <main className="flex-1 flex flex-col min-w-0 relative">
            {/* Header / Top Bar */}
            <header className="h-20 bg-white/80 dark:bg-[#1e2129]/80 backdrop-blur-md border-b border-slate-100 dark:border-white/5 flex items-center px-6 sticky top-0 z-20">
                {/* Left Section: Mobile Menu & Global Context */}
                <div className="flex-1 flex items-center gap-2 md:gap-4">
                    <button 
                        onClick={() => setDesktopSidebarCollapsed(!desktopSidebarCollapsed)} 
                        className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg text-slate-400"
                        title="Toggle Sidebar"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                    
                    <div className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-slate-50 dark:bg-black/20 rounded-full border border-slate-100 dark:border-white/5 transition-all hover:border-emerald-500/30">
                        <span className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">Context</span>
                        <select 
                            className="bg-transparent border-none outline-none text-[10px] md:text-[11px] font-black text-slate-800 dark:text-white uppercase tracking-tighter cursor-pointer pr-2"
                            value={currentOutletId}
                            onChange={(e) => handleContextSwitch(e.target.value)}
                        >
                            <option value="global" className="dark:bg-[#1e2129]">Global Overview</option>
                            {outlets.map(o => (
                                <option key={o.id} value={o.id} className="dark:bg-[#1e2129]">{o.business_name || o.name || o.brand_name || o.username}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Center Section: Core Platform Branding */}
                <div className="hidden md:flex flex-1 justify-center items-center pointer-events-none">
                    <div className="flex items-center gap-4 group pointer-events-auto cursor-default">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-white/5 group-hover:rotate-12 transition-all duration-500 shrink-0">
                            <img src="/logo.png" className="w-9 h-9 object-contain" alt="Logo" />
                        </div>
                        <div className="flex flex-col">
                            <h1 className="text-[22px] font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none">SaSLoop ERP | AI</h1>
                            <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.4em] mt-1">Platform Orchestrator</p>
                        </div>
                    </div>
                </div>

                {/* Right Section: System Actions */}
                <div className="flex-1 flex justify-end items-center gap-4">
                    <div className="hidden lg:flex items-center gap-3 px-4 py-2 bg-emerald-500/5 rounded-full border border-emerald-500/10">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                        <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Connected Cluster</span>
                    </div>
                    
                    <div className="w-px h-8 bg-slate-100 dark:bg-white/5 hidden sm:block mx-2" />
                    
                    <button 
                        onClick={() => setConfirmDialog({
                            message: "Initiate system logout sequence?",
                            onConfirm: handleLogout
                        })}
                        className="h-10 px-6 bg-rose-600 hover:bg-rose-500 text-white rounded-full text-[11px] font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-rose-600/20 flex items-center gap-2"
                    >
                        <LogOut className="w-4 h-4" />
                        <span className="hidden sm:inline">Sign Out</span>
                    </button>
                </div>
            </header>

            {/* Page Content Viewport */}
            <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col justify-between">
                <div className="pt-0 px-6 pb-6 flex-1">
                    <Outlet />
                </div>
                <footer className="py-4 px-6 border-t border-slate-100 dark:border-white/5 bg-white dark:bg-[#1e2129] flex flex-col sm:flex-row items-center justify-between text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider gap-2">
                    <span>Copyright © 2016-2027 Powered by SaSLoop POS. All Rights Reserved.</span>
                    <span className="flex items-center gap-1">Need Support? Contact us at <a href="mailto:support@sasloop.com" className="text-emerald-600 hover:text-emerald-500 dark:text-emerald-500 dark:hover:text-emerald-400 font-black normal-case font-sans">support@sasloop.com</a></span>
                </footer>
            </div>
        </main>

        {/* System Confirmation Dialog */}
        {confirmDialog && createPortal(
            <div className="pro-modal-overlay">
                <div className="pro-modal-content w-full p-4 text-center">
                    <div className="w-16 h-16 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <AlertCircle className="w-8 h-8 text-rose-500" />
                    </div>
                    <h4 className="text-[14px] font-bold text-slate-800 dark:text-white uppercase tracking-tight mb-8 leading-tight">{confirmDialog.message}</h4>
                    <div className="flex gap-4">
                        <button onClick={() => setConfirmDialog(null)} className="flex-1 py-3 bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-slate-200 dark:hover:bg-white/10 transition-all">Abort</button>
                        <button onClick={confirmDialog.onConfirm} className="flex-[2] py-3 bg-rose-600 text-white rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-rose-500 transition-all shadow-xl shadow-rose-600/20">Confirm</button>
                    </div>
                </div>
            </div>
        , document.body)}

    </div>
  );
};

export default Layout;
