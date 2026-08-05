import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from "recharts";
import API_BASE from "../config";
import { 
  TrendingUp, Users, ShoppingCart, IndianRupee, 
  ArrowUpRight, ArrowDownRight, Activity, 
  RefreshCw, Smartphone, Monitor, Loader2, Zap,
  Calendar, Plus, BarChart3, CreditCard, ChevronDown,
  Clock, Package, Home, Globe, Building2, Gift,
  Award, HelpCircle, AlertTriangle, FileText, ChevronUp, Percent,
  BellRing, Check, Mic, MicOff, Brain, Sparkles, X
} from "lucide-react";

const BurgerIcon = () => (
    <svg className="w-6 h-6 text-amber-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 12c0-3.5 3-6 10-6s10 2.5 10 6" />
        <path d="M5 16h14a2 2 0 0 1 2 2v1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-1a2 2 0 0 1 2-2Z" />
        <path d="M2 12h20" />
        <path d="M5 14h14" />
    </svg>
);

const CoinsIcon = () => (
    <svg className="w-5 h-5 text-slate-500 dark:text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="8" cy="8" r="6" />
        <circle cx="18" cy="18" r="4" />
        <path d="M12 6h2a2 2 0 0 1 2 2v2" />
        <path d="M12 18h-2a2 2 0 0 1-2-2v-2" />
    </svg>
);

const MarginIcon = () => (
    <svg className="w-5 h-5 text-slate-500 dark:text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
);

const WastageIcon = () => (
    <svg className="w-5 h-5 text-slate-500 dark:text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        <line x1="10" y1="11" x2="10" y2="17" />
        <line x1="14" y1="11" x2="14" y2="17" />
    </svg>
);

const ProfitPercentIcon = () => (
    <svg className="w-5 h-5 text-slate-500 dark:text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v20" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
);

const FileIcon = () => (
    <svg className="w-5 h-5 text-slate-500 dark:text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
        <polyline points="14 2 14 8 20 8" />
    </svg>
);

const PrinterIcon = () => (
    <svg className="w-5 h-5 text-slate-500 dark:text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="6 9 6 2 18 2 18 9" />
        <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
        <rect x="6" y="14" width="12" height="8" />
    </svg>
);

const EmptyPieChart = () => (
    <svg className="w-24 h-24 text-slate-300 dark:text-slate-700" viewBox="0 0 36 36">
        <circle cx="18" cy="18" r="15.915" fill="none" stroke="currentColor" strokeWidth="4.5" strokeDasharray="100 0" strokeDashoffset="0" />
        <line x1="18" y1="2" x2="18" y2="18" stroke="white" strokeWidth="0.8" className="dark:stroke-[#1e2129]" />
        <line x1="18" y1="18" x2="31" y2="25" stroke="white" strokeWidth="0.8" className="dark:stroke-[#1e2129]" />
        <line x1="18" y1="18" x2="5" y2="22" stroke="white" strokeWidth="0.8" className="dark:stroke-[#1e2129]" />
    </svg>
);

const Dashboard = () => {
    // Basic stats state
    const [stats, setStats] = useState({
        totalRevenue: 0,
        netSales: 0,
        offlineSales: 0,
        onlineSales: 0,
        totalOrders: 0,
        totalCustomers: 0
    });
    
    const [loading, setLoading] = useState(true);
    const [outlets, setOutlets] = useState([]);
    const [fleetLoading, setFleetLoading] = useState(false);
    const [expenses, setExpenses] = useState([]);
    const [staffList, setStaffList] = useState([]);

    const [whatsappStatus, setWhatsappStatus] = useState({ loading: true, connected: false, status: "CHECKING" });
    const [isTestModalOpen, setIsTestModalOpen] = useState(false);
    const [testPhone, setTestPhone] = useState("");
    const [testLoading, setTestLoading] = useState(false);
    const [testResult, setTestResult] = useState(null);

    // Date range selector states
    const [dateRange, setDateRange] = useState("today");
    const [customStartDate, setCustomStartDate] = useState("");
    const [customEndDate, setCustomEndDate] = useState("");
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
    const [orders, setOrders] = useState([]); // Filtered active orders
    const [allOrdersRaw, setAllOrdersRaw] = useState([]); // Un-filtered orders including cancelled

    // Restored states from original dashboard
    const [waiterRequests, setWaiterRequests] = useState([]);
    const [newOrderAlert, setNewOrderAlert] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [voiceIntel, setVoiceIntel] = useState(null);
    const [audioEnabled, setAudioEnabled] = useState(() => localStorage.getItem("globalSound") === "true");
    const [credits, setCredits] = useState(0);
    const [suggestions, setSuggestions] = useState([]);

    // Accordion toggle states
    const [isDayWiseOpen, setIsDayWiseOpen] = useState(true);
    const [isMealTimeOpen, setIsMealTimeOpen] = useState(true);
    const [isOrderTypeOpen, setIsOrderTypeOpen] = useState(true);
    const [isOrderLifecycleOpen, setIsOrderLifecycleOpen] = useState(true);
    const [isDiscountsOpen, setIsDiscountsOpen] = useState(true);
    const [isTaxSummaryOpen, setIsTaxSummaryOpen] = useState(true);
    const [isItemsOpen, setIsItemsOpen] = useState(true);
    const [isExpensesOpen, setIsExpensesOpen] = useState(true);
    const [isCrmOpen, setIsCrmOpen] = useState(true);
    const [isProfitLossOpen, setIsProfitLossOpen] = useState(true);
    const [isCategoryOpen, setIsCategoryOpen] = useState(true);
    const [isLeakageOpen, setIsLeakageOpen] = useState(true);
    const [isStaffOpen, setIsStaffOpen] = useState(true);

    const [itemsViewTab, setItemsViewTab] = useState('top'); // 'top' or 'low'

    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const isOutletView = !!sessionStorage.getItem("impersonate_id") || user.role === 'user';

    const isOnlineOrder = (o) => {
        const source = String(o.source || '').toUpperCase();
        if (source === 'POS_TERMINAL') return false;
        if (source === 'WHATSAPP' || source === 'ONLINE') return true;
        const type = String(o.order_type || '').toUpperCase();
        if (type.includes('ONLINE')) return true;
        return false;
    };

    const getStartOfDay = (d) => {
        const date = new Date(d);
        date.setHours(0, 0, 0, 0);
        return date;
    };

    const getEndOfDay = (d) => {
        const date = new Date(d);
        date.setHours(23, 59, 59, 999);
        return date;
    };

    const formatSQLDateTime = (date) => {
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        const hh = String(date.getHours()).padStart(2, '0');
        const min = String(date.getMinutes()).padStart(2, '0');
        const ss = String(date.getSeconds()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;
    };

    const formatDateForDisplay = (date) => {
        if (!date) return "";
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const dd = String(date.getDate()).padStart(2, '0');
        const mmm = months[date.getMonth()];
        const yyyy = date.getFullYear();
        return `${dd} ${mmm} ${yyyy}`;
    };

    const getActiveOutletName = () => {
        const impId = sessionStorage.getItem("impersonate_id");
        if (impId) {
            const match = outlets.find(o => String(o.id) === String(impId));
            if (match) {
                return match.business_name || match.brand_name || match.name || match.username;
            }
        }
        return user.business_name || user.brand_name || user.name || user.username || "Shahe Tehzeeb Restaurant";
    };

    const getOutletBrandString = () => {
        const impId = sessionStorage.getItem("impersonate_id");
        if (impId) {
            const match = outlets.find(o => String(o.id) === String(impId));
            if (match) {
                const outletName = match.name || match.business_name || match.username || user.business_name || user.brand_name || "Shahe Tehzeeb Restaurant";
                const brandName = match.brand_name || user.brand_name || user.business_name || "";
                return brandName && brandName !== outletName ? `${outletName} - ${brandName}` : `${outletName} - ${outletName}`;
            }
        }
        const outletName = user.business_name || user.brand_name || user.name || user.username || "Shahe Tehzeeb Restaurant";
        const brandName = user.brand_name || "";
        return brandName && brandName !== outletName ? `${outletName} - ${brandName}` : `${outletName} - ${outletName}`;
    };

    const getRangeDates = (range, customStart, customEnd) => {
        const now = new Date();
        let start = new Date();
        let end = new Date();

        switch (range) {
            case "today":
                start = getStartOfDay(now);
                end = getEndOfDay(now);
                break;
            case "yesterday":
                const yesterday = new Date();
                yesterday.setDate(now.getDate() - 1);
                start = getStartOfDay(yesterday);
                end = getEndOfDay(yesterday);
                break;
            case "7days":
                const past7 = new Date();
                past7.setDate(now.getDate() - 6);
                start = getStartOfDay(past7);
                end = getEndOfDay(now);
                break;
            case "30days":
                const past30 = new Date();
                past30.setDate(now.getDate() - 29);
                start = getStartOfDay(past30);
                end = getEndOfDay(now);
                break;
            case "thisMonth":
                start = new Date(now.getFullYear(), now.getMonth(), 1);
                start = getStartOfDay(start);
                end = getEndOfDay(now);
                break;
            case "allTime":
                return { start: null, end: null, startStr: "", endStr: "" };
            case "custom":
                if (!customStart) return { start: null, end: null, startStr: "", endStr: "" };
                const cStart = new Date(customStart);
                const cEnd = customEnd ? new Date(customEnd) : new Date(customStart);
                start = getStartOfDay(cStart);
                end = getEndOfDay(cEnd);
                break;
            default:
                start = getStartOfDay(now);
                end = getEndOfDay(now);
        }

        return {
            start,
            end,
            startStr: formatSQLDateTime(start),
            endStr: formatSQLDateTime(end)
        };
    };

    const getDateRangeLabel = () => {
        const { start, end } = getRangeDates(dateRange, customStartDate, customEndDate);
        if (dateRange === "allTime" || !start) {
            return "All Time";
        }
        return `${formatDateForDisplay(start)} 12:00:00 AM - ${formatDateForDisplay(end)} 11:59:59 PM`;
    };

    const getTodayString = () => {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    };

    const showHourWise = dateRange === 'today' || 
        (dateRange === 'custom' && customStartDate === getTodayString() && (!customEndDate || customEndDate === getTodayString()));

    const getPaymentStats = () => {
        const methods = {};
        orders.forEach(o => {
            const method = String(o.payment_method || 'CASH').toUpperCase();
            methods[method] = (methods[method] || 0) + (parseFloat(o.total_price) || 0);
        });
        
        return Object.entries(methods).map(([name, amount]) => {
            const matchCount = orders.filter(o => String(o.payment_method || 'CASH').toUpperCase() === name).length;
            return {
                name,
                amount,
                count: matchCount,
                percentage: stats.totalRevenue > 0 ? (amount / stats.totalRevenue) * 100 : 0
            };
        }).sort((a, b) => b.amount - a.amount);
    };

    const getDayWiseData = () => {
        const days = {};
        orders.forEach(o => {
            if (!o.created_at) return;
            const dateStr = new Date(o.created_at).toISOString().split('T')[0];
            days[dateStr] = (days[dateStr] || 0) + (parseFloat(o.total_price) || 0);
        });
        return Object.entries(days).map(([date, amount]) => ({
            date,
            amount
        })).sort((a, b) => a.date.localeCompare(b.date));
    };

    const getHourWiseData = () => {
        const hours = {};
        for (let i = 0; i < 24; i++) {
            const label = i === 0 ? "12 AM" : i < 12 ? `${i} AM` : i === 12 ? "12 PM" : `${i - 12} PM`;
            hours[label] = 0;
        }
        orders.forEach(o => {
            if (!o.created_at) return;
            const hr = new Date(o.created_at).getHours();
            const label = hr === 0 ? "12 AM" : hr < 12 ? `${hr} AM` : hr === 12 ? "12 PM" : `${hr - 12} PM`;
            hours[label] = (hours[label] || 0) + (parseFloat(o.total_price) || 0);
        });
        return Object.entries(hours).map(([hour, amount]) => ({
            hour,
            amount
        }));
    };

    const getMealTimeData = () => {
        const mealTimes = {
            midnight: { label: "Midnight Sales (12:00 AM - 05:59 AM)", amount: 0, count: 0, color: "bg-cyan-500" },
            breakfast: { label: "Breakfast (06:00 AM - 10:59 AM)", amount: 0, count: 0, color: "bg-green-500" },
            lunch: { label: "Lunch (11:00 AM - 03:59 PM)", amount: 0, count: 0, color: "bg-amber-500" },
            snacks: { label: "Snacks (04:00 PM - 06:59 PM)", amount: 0, count: 0, color: "bg-rose-500" },
            dinner: { label: "Dinner (07:00 PM - 11:59 PM)", amount: 0, count: 0, color: "bg-purple-500" }
        };
        orders.forEach(o => {
            if (!o.created_at) return;
            const hr = new Date(o.created_at).getHours();
            const val = parseFloat(o.total_price) || 0;
            if (hr >= 0 && hr < 6) {
                mealTimes.midnight.amount += val;
                mealTimes.midnight.count++;
            } else if (hr >= 6 && hr < 11) {
                mealTimes.breakfast.amount += val;
                mealTimes.breakfast.count++;
            } else if (hr >= 11 && hr < 16) {
                mealTimes.lunch.amount += val;
                mealTimes.lunch.count++;
            } else if (hr >= 16 && hr < 19) {
                mealTimes.snacks.amount += val;
                mealTimes.snacks.count++;
            } else {
                mealTimes.dinner.amount += val;
                mealTimes.dinner.count++;
            }
        });
        return Object.values(mealTimes);
    };

    const getOrderTypeStats = () => {
        const types = {
            dineIn: { label: "Dine In", amount: 0, count: 0, icon: Clock },
            pickup: { label: "Pickup", amount: 0, count: 0, icon: Package },
            delivery: { label: "Delivery", amount: 0, count: 0, icon: Home },
            quickBill: { label: "Quick Bill", amount: 0, count: 0, icon: Zap }
        };
        orders.forEach(o => {
            const type = String(o.order_type || '').toUpperCase();
            const val = parseFloat(o.total_price) || 0;
            if (type.includes('DINE')) {
                types.dineIn.amount += val;
                types.dineIn.count++;
            } else if (type.includes('PICKUP') || type.includes('TAKEAWAY')) {
                types.pickup.amount += val;
                types.pickup.count++;
            } else if (type.includes('DELIVERY') || String(o.source || '').toUpperCase() === 'WHATSAPP') {
                types.delivery.amount += val;
                types.delivery.count++;
            } else {
                types.quickBill.amount += val;
                types.quickBill.count++;
            }
        });
        const total = Object.values(types).reduce((sum, t) => sum + t.amount, 0) || 1;
        return Object.values(types).map(t => ({
            ...t,
            percentage: (t.amount / total) * 100
        }));
    };

    const getOrderLifecycle = () => {
        const lifecycle = {
            fulfilled: { label: "Fulfilled Orders", amount: 0, count: 0 },
            placed: { label: "Placed (Unaccepted) Orders", amount: 0, count: 0 },
            acknowledged: { label: "Acknowledged Orders", amount: 0, count: 0 },
            cancelled: { label: "Cancel Orders", amount: 0, count: 0 }
        };
        
        allOrdersRaw.forEach(o => {
            const val = parseFloat(o.total_price) || 0;
            const status = String(o.status || '').toUpperCase();
            
            if (status === 'CANCELLED' || status === 'DELETED') {
                lifecycle.cancelled.amount += val;
                lifecycle.cancelled.count++;
            } else if (status === 'COMPLETED' || status === 'PAID' || status === 'SETTLED') {
                lifecycle.fulfilled.amount += val;
                lifecycle.fulfilled.count++;
            } else if (status === 'PLACED' || status === 'PENDING') {
                lifecycle.placed.amount += val;
                lifecycle.placed.count++;
            } else {
                lifecycle.acknowledged.amount += val;
                lifecycle.acknowledged.count++;
            }
        });
        return lifecycle;
    };

    const getDiscountsSummary = () => {
        let total = 0;
        let offline = 0;
        let online = 0;
        
        orders.forEach(o => {
            const disc = parseFloat(o.discount_amount) || 0;
            total += disc;
            if (isOnlineOrder(o)) {
                online += disc;
            } else {
                offline += disc;
            }
        });
        return { total, offline, online };
    };

    const getTaxSummary = () => {
        let total = 0;
        let offline = 0;
        let online = 0;
        
        orders.forEach(o => {
            const tax = (parseFloat(o.tax_cgst) || 0) + (parseFloat(o.tax_sgst) || 0);
            total += tax;
            if (isOnlineOrder(o)) {
                online += tax;
            } else {
                offline += tax;
            }
        });
        return { total, offline, online };
    };

    const getItemSales = (isLowSelling = false) => {
        const itemMap = {};
        orders.forEach(o => {
            let itemsList = [];
            try {
                itemsList = typeof o.items === 'string' ? JSON.parse(o.items) : o.items;
                if (!Array.isArray(itemsList)) itemsList = [];
            } catch (e) { itemsList = []; }
            
            itemsList.forEach(item => {
                const name = item.name || 'Unnamed Item';
                const qty = parseInt(item.qty || item.quantity) || 1;
                const price = parseFloat(item.price) || 0;
                if (!itemMap[name]) {
                    itemMap[name] = { name, qty: 0, revenue: 0 };
                }
                itemMap[name].qty += qty;
                itemMap[name].revenue += price * qty;
            });
        });
        
        return Object.values(itemMap)
            .sort((a, b) => isLowSelling ? a.qty - b.qty : b.qty - a.qty)
            .slice(0, 5);
    };

    const getCategorySales = () => {
        const categoryMap = {};
        orders.forEach(o => {
            let itemsList = [];
            try {
                itemsList = typeof o.items === 'string' ? JSON.parse(o.items) : o.items;
                if (!Array.isArray(itemsList)) itemsList = [];
            } catch (e) { itemsList = []; }
            
            itemsList.forEach(item => {
                const cat = item.category_name || item.category || 'General';
                const qty = parseInt(item.qty || item.quantity) || 1;
                const price = parseFloat(item.price) || 0;
                categoryMap[cat] = (categoryMap[cat] || 0) + (price * qty);
            });
        });
        return Object.entries(categoryMap).map(([name, amount]) => ({ name, amount })).sort((a, b) => b.amount - a.amount);
    };

    const getStaffSales = () => {
        const staffMap = {};
        orders.forEach(o => {
            const waiter = o.waiter_name || o.created_by_name || 'Cashier admin';
            const val = parseFloat(o.total_price) || 0;
            staffMap[waiter] = (staffMap[waiter] || 0) + val;
        });
        return Object.entries(staffMap).map(([name, amount]) => {
            const staffUser = staffList.find(s => s.name?.toUpperCase() === name.toUpperCase() || s.username?.toUpperCase() === name.toUpperCase());
            return {
                name,
                designation: staffUser?.designation_name || 'POS Billing',
                amount,
                outlet: getActiveOutletName()
            };
        }).sort((a, b) => b.amount - a.amount);
    };

    const getLastOrderSyncTime = () => {
        if (!orders || orders.length === 0) return "Never";
        const sorted = [...orders].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        return new Date(sorted[0].created_at).toLocaleString('en-IN', {
            day: '2-digit', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit', hour12: true
        });
    };

    const fetchData = async (showSpinner = false) => {
        try {
            if (showSpinner) setLoading(true);
            const impersonateId = sessionStorage.getItem("impersonate_id");
            let url = `${API_BASE}/api/orders`;
            
            const params = new URLSearchParams();
            if (impersonateId) {
                params.append("target_user_id", impersonateId);
            }
            
            const { startStr, endStr } = getRangeDates(dateRange, customStartDate, customEndDate);
            if (startStr) params.append("startDate", startStr);
            if (endStr) params.append("endDate", endStr);
            
            const queryString = params.toString() ? `?${params.toString()}` : "";
            
            const res = await fetch(`${url}${queryString}`, {
                headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
            });
            if (res.status === 401 || res.status === 403) {
                console.warn("Unauthorized/Expired session detected. Clearing storage...");
                localStorage.clear();
                sessionStorage.clear();
                window.location.href = "/login";
                return;
            }
            const data = await res.json();
            
            if (Array.isArray(data)) {
                setAllOrdersRaw(data);
                const activeOrders = data.filter(o => o.status !== 'CANCELLED' && o.status !== 'DELETED');
                
                // Sound trigger for new orders
                setOrders(prev => {
                    if (prev.length > 0 && activeOrders.length > prev.length) {
                        playNotification('order');
                    }
                    return activeOrders;
                });
                
                const revenue = activeOrders.reduce((acc, curr) => acc + (parseFloat(curr.total_price) || 0), 0);
                const online = activeOrders.filter(o => isOnlineOrder(o)).reduce((acc, curr) => acc + (parseFloat(curr.total_price) || 0), 0);
                const totalDisc = activeOrders.reduce((acc, curr) => acc + (parseFloat(curr.discount_amount) || 0), 0);
                
                setStats({
                    totalRevenue: revenue,
                    netSales: revenue - totalDisc,
                    offlineSales: revenue - online,
                    onlineSales: online,
                    totalOrders: activeOrders.length,
                    totalCustomers: new Set(activeOrders.map(o => o.customer_phone || o.customer_number)).size
                });
            }

            // Fetch credits
            const adminUser = JSON.parse(localStorage.getItem("user") || "{}");
            setCredits(impersonateId ? 0 : (adminUser.broadcast_credits || 0));

            // Fetch AI Suggestions
            try {
                const targetParam = impersonateId ? `?target_user_id=${impersonateId}` : "";
                const suggestRes = await fetch(`${API_BASE}/api/analytics/suggestions${targetParam}`, {
                    headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
                });
                if (suggestRes.ok) {
                    const suggestData = await suggestRes.json();
                    if (suggestData.suggestions) setSuggestions(suggestData.suggestions);
                }
            } catch (e) {
                console.warn("Failed to fetch suggestions:", e);
            }

            // Fetch Expenses
            try {
                const expRes = await fetch(`${API_BASE}/api/business/expenses${queryString}`, {
                    headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
                });
                if (expRes.ok) {
                    const expData = await expRes.json();
                    setExpenses(expData || []);
                }
            } catch (e) {
                console.warn("Failed to fetch expenses:", e);
            }

            // Fetch Staff List
            try {
                const staffRes = await fetch(`${API_BASE}/api/brand/users`, {
                    headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
                });
                if (staffRes.ok) {
                    const staffData = await staffRes.json();
                    setStaffList(staffData || []);
                }
            } catch (e) {
                console.warn("Failed to fetch staff:", e);
            }

        } catch (err) {
            console.error("Dashboard Fetch Error:", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchWaiterRequests = async () => {
        try {
            const token = localStorage.getItem("token");
            const impersonateId = sessionStorage.getItem("impersonate_id");
            const targetParam = impersonateId ? `?target_user_id=${impersonateId}` : "";
            const waiterRes = await fetch(`${API_BASE}/api/business/waiter-requests${targetParam}`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (waiterRes.ok) {
                const waiterData = await waiterRes.json();
                const waitersList = Array.isArray(waiterData) ? waiterData : [];
                setWaiterRequests(prev => {
                    if (prev.length > 0 && waitersList.length > prev.length) playNotification('waiter');
                    return waitersList;
                });
            }
        } catch (err) {
            console.error("Waiter requests fetch error:", err);
        }
    };

    const resolveWaiter = async (requestId) => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_BASE}/api/business/waiter-requests/resolve`, {
                method: "PUT",
                headers: { 
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ id: requestId })
            });
            if (res.ok) {
                setWaiterRequests(prev => prev.filter(r => r.id !== requestId));
            }
        } catch (err) {
            console.error("Resolve error:", err);
        }
    };

    const playNotification = (type) => {
        if (!audioEnabled) return;
        if (type === 'order') {
            setNewOrderAlert(true);
            setTimeout(() => setNewOrderAlert(false), 8000);
        }
        try {
            const urls = {
                order: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3',
                waiter: 'https://assets.mixkit.co/active_storage/sfx/2570/2570-preview.mp3',
                message: 'https://assets.mixkit.co/active_storage/sfx/2358/2358-preview.mp3'
            };
            const audio = new Audio(urls[type] || urls.order);
            audio.play().catch(e => console.warn("Audio blocked by browser. User must click 'Enable Sound' first."));
        } catch (e) { console.error("Audio playback error:", e); }
    };

    const unlockAudio = () => {
        const newVal = !audioEnabled;
        setAudioEnabled(newVal);
        localStorage.setItem("globalSound", newVal ? "true" : "false");
        window.dispatchEvent(new Event('storage'));
        
        if (newVal) {
            const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3');
            audio.volume = 0.1;
            audio.play().then(() => {
                alert("🔔 Sound Notifications Enabled Successfully!");
            }).catch(e => alert("Please allow audio permissions in your browser settings."));
        }
    };

    const handleVoiceCommand = () => {
        if (window.webkitSpeechRecognition || window.SpeechRecognition) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            const recognition = new SpeechRecognition();
            recognition.onstart = () => setIsListening(true);
            recognition.onend = () => setIsListening(false);
            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript.toLowerCase();
                processCommand(transcript);
            };
            recognition.start();
        } else {
            alert("Speech recognition is not supported in this browser. Try Chrome.");
        }
    };

    const processCommand = (cmd) => {
        if (cmd.includes("revenue")) {
            setVoiceIntel(`Today's revenue is Rs ${stats.totalRevenue.toLocaleString()}.`);
        } else if (cmd.includes("orders")) {
            setVoiceIntel(`There are ${stats.totalOrders} active orders.`);
        } else if (cmd.includes("waiter")) {
            setVoiceIntel(`There are ${waiterRequests.length} waiter calls.`);
        } else {
            setVoiceIntel("I didn't quite catch that. Try asking about revenue or orders.");
        }
        setTimeout(() => setVoiceIntel(null), 6000);
    };

    useEffect(() => {
        fetchData(true);
        if (isOutletView) {
            fetchWaiterRequests();
            const itv = setInterval(() => {
                fetchData(false);
                fetchWaiterRequests();
            }, 5000);
            return () => clearInterval(itv);
        }
    }, [dateRange, customStartDate, customEndDate]);

    useEffect(() => {
        const fetchFleet = async () => {
            const role = user?.role;
            if (role !== 'brand_owner' && role !== 'master_admin' && !role?.startsWith('admin') && role !== 'user') return;
            try {
                setFleetLoading(true);
                const res = await fetch(`${API_BASE}/api/auth/my-outlets`, {
                    headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
                });
                const data = await res.json();
                if (res.ok) setOutlets(data);
            } catch (err) { console.error(err); }
            finally { setFleetLoading(false); }
        };

        const fetchWhatsappStatus = async () => {
            try {
                const impersonateId = sessionStorage.getItem("impersonate_id");
                const targetParam = impersonateId ? `?target_user_id=${impersonateId}` : "";
                const res = await fetch(`${API_BASE}/api/whatsapp/status${targetParam}`, {
                    headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setWhatsappStatus({
                        loading: false,
                        connected: data.connected,
                        status: data.status,
                        error: data.error,
                        verifiedName: data.verified_name,
                        displayPhone: data.display_phone_number
                    });
                } else {
                    setWhatsappStatus({ loading: false, connected: false, status: "ERROR" });
                }
            } catch (err) {
                console.error("WhatsApp Status Fetch Error:", err);
                setWhatsappStatus({ loading: false, connected: false, status: "ERROR" });
            }
        };

        fetchFleet();
        if (isOutletView) {
            fetchWhatsappStatus();
        }
    }, []);

    if (loading) return (
        <div className="h-[80vh] w-full flex flex-col items-center justify-center bg-slate-55 dark:bg-[#15171e]">
            <Loader2 className="w-8 h-8 text-emerald-500 animate-spin mb-4" />
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.3em]">Calibrating Revenue Intelligence...</p>
        </div>
    );

    const handleManageOutlet = (id) => {
        sessionStorage.setItem("impersonate_id", id);
        window.location.href = "/dashboard";
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-10">
            {/* Header Area */}
            <div className="flex items-center justify-between bg-white dark:bg-[#1e2129] border-b border-slate-200 dark:border-white/5 px-6 py-3 -mx-6 sticky top-0 z-10 shadow-sm">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-slate-100 dark:bg-white/5 rounded-md">
                        <svg className="w-3.5 h-3.5 text-slate-700 dark:text-slate-350" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                        </svg>
                    </div>
                    <h2 className="text-[13px] font-black text-slate-800 dark:text-white uppercase tracking-tight">
                        {!sessionStorage.getItem("impersonate_id") && user.role !== 'user' ? "Enterprise Overview" : "Revenue Dashboard"}
                    </h2>
                </div>
                
                {(sessionStorage.getItem("impersonate_id") || user.role === 'user') && (
                    <div className="hidden md:block text-[10.5px] font-semibold text-slate-500 dark:text-slate-400">
                        {getOutletBrandString()}
                    </div>
                )}
                
                <div className="flex items-center gap-3">
                    {isOutletView && (
                        <div className="flex items-center mr-2">
                            {whatsappStatus.loading ? (
                                <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-md px-3 py-2 text-[10px] font-bold text-slate-400 uppercase">
                                    <Loader2 className="w-3 h-3 animate-spin text-slate-400" />
                                    <span>WA: Checking...</span>
                                </div>
                            ) : whatsappStatus.connected ? (
                                <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-md px-3 py-1.5">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                    </span>
                                    <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                                        WA: CONNECTED ({(whatsappStatus.verifiedName || '').toUpperCase()})
                                    </span>
                                </div>
                            ) : whatsappStatus.status === "NOT_CONFIGURED" ? (
                                <div className="flex items-center gap-2 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-md px-3 py-1.5">
                                    <span className="h-2 w-2 rounded-full bg-slate-400"></span>
                                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                        WA: Unconfigured
                                    </span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 bg-rose-500/10 border border-rose-500/20 rounded-md px-3 py-1.5" title={whatsappStatus.error}>
                                    <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse"></span>
                                    <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
                                        WA: Error
                                    </span>
                                </div>
                            )}
                        </div>
                    )}
                    
                    <div className="relative flex items-center gap-1.5">
                        <button 
                            onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
                            className="text-[10.5px] font-black text-slate-605 dark:text-slate-300 uppercase bg-slate-55 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-md px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-white/10 transition-all cursor-pointer focus:outline-none"
                        >
                            {getDateRangeLabel()}
                        </button>
                        
                        {isDatePickerOpen && (
                            <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-[#1e2129] border border-slate-200 dark:border-white/10 rounded-xl shadow-2xl p-4 z-50 text-slate-800 dark:text-white space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-white/5 pb-2">
                                    Select Temporal Range
                                </div>
                                <div className="flex flex-col gap-1">
                                    {[
                                        { val: "today", label: "Today" },
                                        { val: "yesterday", label: "Yesterday" },
                                        { val: "7days", label: "Last 7 Days" },
                                        { val: "30days", label: "Last 30 Days" },
                                        { val: "thisMonth", label: "This Month" },
                                        { val: "allTime", label: "All Time" },
                                        { val: "custom", label: "Custom Range..." }
                                    ].map(opt => (
                                        <button
                                            key={opt.val}
                                            onClick={() => {
                                                setDateRange(opt.val);
                                                if (opt.val !== "custom") {
                                                    setIsDatePickerOpen(false);
                                                }
                                            }}
                                            className={`text-left px-3 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-wider transition-colors ${
                                                dateRange === opt.val 
                                                    ? "bg-emerald-600 text-white" 
                                                    : "hover:bg-slate-100 dark:hover:bg-white/5 text-slate-600 dark:text-slate-400"
                                            }`}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                                
                                {dateRange === "custom" && (
                                    <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-white/5">
                                        <div className="space-y-1">
                                            <label className="text-[9px] font-bold text-slate-400 uppercase">Start Date</label>
                                            <input 
                                                type="date" 
                                                value={customStartDate}
                                                onChange={(e) => setCustomStartDate(e.target.value)}
                                                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded px-2 py-1 text-[11px] outline-none text-slate-700 dark:text-white"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[9px] font-bold text-slate-400 uppercase">End Date</label>
                                            <input 
                                                type="date" 
                                                value={customEndDate}
                                                onChange={(e) => setCustomEndDate(e.target.value)}
                                                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded px-2 py-1 text-[11px] outline-none text-slate-700 dark:text-white"
                                            />
                                        </div>
                                        <button 
                                            onClick={() => setIsDatePickerOpen(false)}
                                            disabled={!customStartDate}
                                            className="w-full py-1.5 bg-slate-900 dark:bg-emerald-600 text-white rounded text-[10px] font-black uppercase tracking-wider disabled:opacity-50"
                                        >
                                            Apply Custom Range
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6">
                {/* Brand Owner Fleet Directory - Primary View in Global Mode */}
                {(!sessionStorage.getItem("impersonate_id") && user.role !== 'user') ? (
                    <div className="lg:col-span-12 space-y-6 animate-in slide-in-from-bottom-4 duration-700">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-slate-200 dark:border-white/5 pb-4">
                            <div>
                                <h3 className="pro-heading">Enterprise Fleet Directory</h3>
                                <p className="pro-subheading">Global Command Hub / Orchestrated Nodes</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="px-3 py-1 bg-emerald-500/10 text-emerald-600 rounded-full text-[10px] font-black uppercase border border-emerald-500/20">{outlets.length} Active Nodes</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {outlets.map(o => (
                                <div key={o.id} className="bg-white dark:bg-[#1e2129] border border-slate-200 dark:border-white/5 rounded-2xl p-6 group hover:border-emerald-500/30 transition-all shadow-sm hover:shadow-xl hover:shadow-emerald-500/5 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-4">
                                        <div className={`w-2 h-2 rounded-full ${o.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                                    </div>

                                    <div className="flex flex-col h-full">
                                        <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                            <Building2 className="w-6 h-6 text-slate-400 group-hover:text-emerald-500 transition-colors" />
                                        </div>
                                        
                                        <div className="space-y-1 mb-8">
                                            <h4 className="text-[16px] font-black text-slate-800 dark:text-white uppercase tracking-tight truncate">{o.business_name || o.brand_name || o.username || 'Unnamed Node'}</h4>
                                            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest flex items-center gap-2">
                                                <Zap className="w-3 h-3" /> {o.business_type?.replace(/_/g, ' ')}
                                            </p>
                                        </div>

                                        <div className="mt-auto pt-6 border-t border-slate-100 dark:border-white/5">
                                            <button 
                                                onClick={() => handleManageOutlet(o.id)}
                                                className="w-full py-3 bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-500 text-white rounded-xl text-[11px] font-black uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-2"
                                            >
                                                Launch Dashboard <ArrowUpRight className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {fleetLoading && (
                                <div className="col-span-full py-20 flex flex-col items-center">
                                    <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mb-4" />
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Synchronizing Fleet Manifest...</p>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="lg:col-span-12 space-y-6">


                        {/* 3. SALES & PAYMENT STATISTICS */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                            {/* Left: Sales Statistics */}
                            <div className="lg:col-span-7 bg-white dark:bg-[#1e2129] border border-slate-200 dark:border-white/5 rounded-xl shadow-sm overflow-hidden flex flex-col justify-between">
                                <div className="px-5 py-3.5 flex items-center justify-between border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/2">
                                    <span className="text-[#3b82f6] font-black text-[13px] uppercase tracking-wider">Sales Statistics</span>
                                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold">
                                        Last Order Sync: {getLastOrderSyncTime()}
                                    </span>
                                </div>
                                <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 bg-white dark:bg-[#1e2129]">
                                    {[
                                        { label: 'Total Sales', val: `Rs ${stats.totalRevenue.toLocaleString('en-IN')}`, count: stats.totalOrders, icon: IndianRupee, color: 'blue' },
                                        { label: 'Net Sales', val: `Rs ${stats.netSales.toLocaleString('en-IN')}`, count: stats.totalOrders, icon: TrendingUp, color: 'emerald' },
                                        { label: 'Offline Sales', val: `Rs ${stats.offlineSales.toLocaleString('en-IN')}`, count: orders.filter(o => !isOnlineOrder(o)).length, icon: Home, color: 'indigo' },
                                        { label: 'Online Sales', val: `Rs ${stats.onlineSales.toLocaleString('en-IN')}`, count: orders.filter(o => isOnlineOrder(o)).length, icon: ShoppingCart, color: 'amber' },
                                    ].map((card, idx) => {
                                        const Icon = card.icon;
                                        const colorClasses = {
                                            blue: "bg-blue-50 dark:bg-blue-950/20 text-blue-500",
                                            emerald: "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500",
                                            indigo: "bg-indigo-50 dark:bg-indigo-950/20 text-indigo-500",
                                            amber: "bg-amber-50 dark:bg-amber-950/20 text-amber-500",
                                        };
                                        return (
                                            <div key={idx} className="flex items-center gap-4 bg-slate-50 dark:bg-white/2 border border-slate-150 dark:border-white/5 rounded-xl p-4 shadow-sm">
                                                <div className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 ${colorClasses[card.color]}`}>
                                                    <Icon className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{card.label}</p>
                                                    <h3 className="text-[16px] font-black text-slate-800 dark:text-white mt-0.5">
                                                        {card.val} <span className="text-[11px] font-bold text-slate-400">({card.count})</span>
                                                    </h3>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Right: Payment Statistics */}
                            <div className="lg:col-span-5 bg-white dark:bg-[#1e2129] border border-slate-200 dark:border-white/5 rounded-xl shadow-sm overflow-hidden flex flex-col">
                                <div className="px-5 py-3.5 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/2">
                                    <span className="text-[#3b82f6] font-black text-[13px] uppercase tracking-wider">
                                        Payment Statistics ({stats.totalRevenue.toFixed(2)})
                                    </span>
                                </div>
                                <div className="p-5 flex-1 overflow-y-auto no-scrollbar space-y-4 bg-white dark:bg-[#1e2129]">
                                    {getPaymentStats().length === 0 ? (
                                        <div className="h-full flex items-center justify-center text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                            No Data Found
                                        </div>
                                    ) : (
                                        getPaymentStats().map((pm, idx) => (
                                            <div key={idx} className="space-y-1">
                                                <div className="flex justify-between text-[11.5px] font-bold text-slate-700 dark:text-slate-350">
                                                    <span>{pm.name} ({pm.count})</span>
                                                    <span>Rs {pm.amount.toFixed(2)} ({pm.percentage.toFixed(2)}%)</span>
                                                </div>
                                                <div className="w-full bg-slate-100 dark:bg-white/5 h-2.5 rounded-full overflow-hidden">
                                                    <div 
                                                        className="bg-emerald-500 h-full rounded-full" 
                                                        style={{ width: `${pm.percentage}%` }}
                                                    />
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* 4. DAY-WISE / HOUR-WISE REVENUE ANALYSIS */}
                        <div className="bg-white dark:bg-[#1e2129] border border-slate-200 dark:border-white/5 rounded-xl shadow-sm overflow-hidden">
                            <div className="px-5 py-3 flex items-center justify-between border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/2">
                                <span className="text-[#3b82f6] font-black text-[13px] uppercase tracking-wider">
                                    {showHourWise ? 'Hour-Wise Revenue Analysis' : 'Day-Wise Revenue Analysis'}
                                </span>
                                <button 
                                    onClick={() => setIsDayWiseOpen(!isDayWiseOpen)} 
                                    className="p-1 hover:bg-slate-100 dark:hover:bg-white/5 rounded transition-all"
                                >
                                    <span className="font-black text-base text-slate-800 dark:text-slate-200">
                                        {isDayWiseOpen ? "-" : "+"}
                                    </span>
                                </button>
                            </div>
                            {isDayWiseOpen && (
                                <div className="p-5 bg-white dark:bg-[#1e2129]">
                                    {((showHourWise ? getHourWiseData() : getDayWiseData()).length === 0) ? (
                                        <div className="py-20 flex flex-col items-center justify-center text-slate-350 dark:text-slate-650">
                                            <BarChart3 className="w-10 h-10 mb-2 text-slate-300 dark:text-slate-700" />
                                            <p className="text-[11px] font-black uppercase tracking-widest">No Sales Found</p>
                                        </div>
                                    ) : (
                                        <div className="h-[280px] w-full">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <BarChart data={showHourWise ? getHourWiseData() : getDayWiseData()}>
                                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:stroke-white/5" />
                                                    <XAxis 
                                                        dataKey={showHourWise ? 'hour' : 'date'} 
                                                        axisLine={false} 
                                                        tickLine={false} 
                                                        tick={{ fontSize: 9, fontWeight: 700, fill: '#64748b' }} 
                                                        dy={8}
                                                    />
                                                    <YAxis 
                                                        axisLine={false} 
                                                        tickLine={false} 
                                                        tick={{ fontSize: 9, fontWeight: 700, fill: '#64748b' }} 
                                                    />
                                                    <Tooltip 
                                                        cursor={{ fill: 'rgba(0, 0, 0, 0.02)' }}
                                                        contentStyle={{
                                                            background: '#0f172a',
                                                            border: 'none',
                                                            borderRadius: '8px',
                                                            color: '#fff',
                                                            fontSize: '11px',
                                                            fontWeight: 'bold'
                                                        }}
                                                    />
                                                    <Bar dataKey="amount" fill="#854d0e" radius={[4, 4, 0, 0]}>
                                                        {(showHourWise ? getHourWiseData() : getDayWiseData()).map((entry, index) => (
                                                            <Cell key={`cell-${index}`} fill={index % 2 === 0 ? "#854d0e" : "#5b21b6"} />
                                                        ))}
                                                    </Bar>
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* 5. MEAL TIME-BASED REVENUE ANALYSIS */}
                        <div className="bg-white dark:bg-[#1e2129] border border-slate-200 dark:border-white/5 rounded-xl shadow-sm overflow-hidden">
                            <div className="px-5 py-3 flex items-center justify-between border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/2">
                                <span className="text-[#3b82f6] font-black text-[13px] uppercase tracking-wider">Meal Time-Based Revenue Analysis</span>
                                <button 
                                    onClick={() => setIsMealTimeOpen(!isMealTimeOpen)} 
                                    className="p-1 hover:bg-slate-100 dark:hover:bg-white/5 rounded transition-all"
                                >
                                    <span className="font-black text-base text-slate-800 dark:text-slate-200">
                                        {isMealTimeOpen ? "-" : "+"}
                                    </span>
                                </button>
                            </div>
                            {isMealTimeOpen && (
                                <div className="p-5 bg-white dark:bg-[#1e2129]">
                                    <div className="h-[280px] w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={getMealTimeData()}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:stroke-white/5" />
                                                <XAxis 
                                                    dataKey="label" 
                                                    axisLine={false} 
                                                    tickLine={false} 
                                                    tickFormatter={(value) => value.split(" (")[0]}
                                                    tick={{ fontSize: 9, fontWeight: 700, fill: '#64748b' }} 
                                                    dy={8}
                                                />
                                                <YAxis 
                                                    axisLine={false} 
                                                    tickLine={false} 
                                                    tick={{ fontSize: 9, fontWeight: 700, fill: '#64748b' }} 
                                                />
                                                <Tooltip 
                                                    cursor={{ fill: 'rgba(0, 0, 0, 0.02)' }}
                                                    contentStyle={{
                                                        background: '#0f172a',
                                                        border: 'none',
                                                        borderRadius: '8px',
                                                        color: '#fff',
                                                        fontSize: '11px',
                                                        fontWeight: 'bold'
                                                    }}
                                                />
                                                <Bar dataKey="amount" fill="#f97316" radius={[4, 4, 0, 0]}>
                                                    {getMealTimeData().map((entry, index) => {
                                                        const colors = {
                                                            midnight: "#06b6d4",
                                                            breakfast: "#22c55e",
                                                            lunch: "#f97316",
                                                            snacks: "#f43f5e",
                                                            dinner: "#a855f7"
                                                        };
                                                        const keys = ["midnight", "breakfast", "lunch", "snacks", "dinner"];
                                                        return <Cell key={`cell-${index}`} fill={colors[keys[index]] || "#f97316"} />;
                                                    })}
                                                </Bar>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* 6. ORDER TYPE STATISTICS & ORDER LIFECYCLE */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                            {/* Left: Order Type Statistics */}
                            <div className="lg:col-span-6 bg-white dark:bg-[#1e2129] border border-slate-200 dark:border-white/5 rounded-xl shadow-sm overflow-hidden">
                                <div className="px-5 py-3 flex items-center justify-between border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/2">
                                    <span className="text-[#3b82f6] font-black text-[13px] uppercase tracking-wider">Order Type Statistics</span>
                                    <button 
                                        onClick={() => setIsOrderTypeOpen(!isOrderTypeOpen)} 
                                        className="p-1 hover:bg-slate-100 dark:hover:bg-white/5 rounded transition-all"
                                    >
                                        <span className="font-black text-base text-slate-800 dark:text-slate-200">
                                            {isOrderTypeOpen ? "-" : "+"}
                                        </span>
                                    </button>
                                </div>
                                {isOrderTypeOpen && (
                                    <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4 bg-white dark:bg-[#1e2129]">
                                        {getOrderTypeStats().map((type, idx) => {
                                            const Icon = type.icon;
                                            return (
                                                <div key={idx} className="flex items-center gap-4 bg-slate-50 dark:bg-white/2 border border-slate-150 dark:border-white/5 rounded-xl p-4 shadow-sm">
                                                    <div className="w-10 h-10 bg-slate-100 dark:bg-white/5 rounded-xl flex items-center justify-center shrink-0">
                                                        <Icon className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{type.label}</p>
                                                        <h3 className="text-[14px] font-black text-slate-800 dark:text-white mt-0.5">
                                                            Rs {Math.round(type.amount).toLocaleString('en-IN')}{" "}
                                                            <span className="text-[11px] font-bold text-slate-400">({type.count}) ({type.percentage.toFixed(2)}%)</span>
                                                        </h3>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            {/* Right: Order Lifecycle */}
                            <div className="lg:col-span-6 bg-white dark:bg-[#1e2129] border border-slate-200 dark:border-white/5 rounded-xl shadow-sm overflow-hidden">
                                <div className="px-5 py-3 flex items-center justify-between border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/2">
                                    <span className="text-[#3b82f6] font-black text-[13px] uppercase tracking-wider">Order Lifecycle</span>
                                    <button 
                                        onClick={() => setIsOrderLifecycleOpen(!isOrderLifecycleOpen)} 
                                        className="p-1 hover:bg-slate-100 dark:hover:bg-white/5 rounded transition-all"
                                    >
                                        <span className="font-black text-base text-slate-800 dark:text-slate-200">
                                            {isOrderLifecycleOpen ? "-" : "+"}
                                        </span>
                                    </button>
                                </div>
                                {isOrderLifecycleOpen && (
                                    <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4 bg-white dark:bg-[#1e2129]">
                                        {(() => {
                                            const lifecycle = getOrderLifecycle();
                                            return [
                                                { label: "Fulfilled Orders", val: `Rs ${Math.round(lifecycle.fulfilled.amount).toLocaleString('en-IN')}`, count: lifecycle.fulfilled.count },
                                                { label: "Placed (Unaccepted) Orders", val: `Rs ${Math.round(lifecycle.placed.amount).toLocaleString('en-IN')}`, count: lifecycle.placed.count },
                                                { label: "Acknowledged Orders", val: `Rs ${Math.round(lifecycle.acknowledged.amount).toLocaleString('en-IN')}`, count: lifecycle.acknowledged.count },
                                                { label: "Cancel Orders", val: `Rs ${Math.round(lifecycle.cancelled.amount).toLocaleString('en-IN')}`, count: lifecycle.cancelled.count },
                                                { label: "Table Turn Around Time", val: "94.39 (Minutes)", count: null }
                                            ].map((card, idx) => (
                                                <div key={idx} className="flex flex-col bg-slate-50 dark:bg-white/2 border border-slate-150 dark:border-white/5 rounded-xl p-4 shadow-sm">
                                                    <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{card.label}</p>
                                                    <h3 className="text-[14px] font-black text-slate-800 dark:text-white mt-1">
                                                        {card.val}{" "}
                                                        {card.count !== null && (
                                                            <span className="text-[11px] font-bold text-slate-400">({card.count})</span>
                                                        )}
                                                    </h3>
                                                </div>
                                            ));
                                        })()}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* 7. DISCOUNTS & TAX SUMMARY */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                            {/* Left: Discounts */}
                            <div className="lg:col-span-6 bg-white dark:bg-[#1e2129] border border-slate-200 dark:border-white/5 rounded-xl shadow-sm overflow-hidden">
                                <div className="px-5 py-3 flex items-center justify-between border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/2">
                                    <span className="text-[#3b82f6] font-black text-[13px] uppercase tracking-wider">Discounts</span>
                                    <button 
                                        onClick={() => setIsDiscountsOpen(!isDiscountsOpen)} 
                                        className="p-1 hover:bg-slate-100 dark:hover:bg-white/5 rounded transition-all"
                                    >
                                        <span className="font-black text-base text-slate-800 dark:text-slate-200">
                                            {isDiscountsOpen ? "-" : "+"}
                                        </span>
                                    </button>
                                </div>
                                {isDiscountsOpen && (
                                    <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-4 bg-white dark:bg-[#1e2129]">
                                        {(() => {
                                            const disc = getDiscountsSummary();
                                            const totalCount = orders.filter(o => parseFloat(o.discount_amount) > 0).length;
                                            const offlineCount = orders.filter(o => parseFloat(o.discount_amount) > 0 && !isOnlineOrder(o)).length;
                                            const onlineCount = orders.filter(o => parseFloat(o.discount_amount) > 0 && isOnlineOrder(o)).length;
                                            return [
                                                { label: "Total Discounts", val: disc.total, count: totalCount },
                                                { label: "Offline Orders Discounts", val: disc.offline, count: offlineCount },
                                                { label: "Online Orders Discounts", val: disc.online, count: onlineCount }
                                            ].map((card, idx) => (
                                                <div key={idx} className="flex flex-col bg-slate-50 dark:bg-white/2 border border-slate-150 dark:border-white/5 rounded-xl p-4 shadow-sm">
                                                    <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{card.label}</p>
                                                    <h3 className="text-[13px] font-black text-slate-800 dark:text-white mt-1">
                                                        Rs {Math.round(card.val)}{" "}
                                                        <span className="text-[10px] font-bold text-slate-400">({card.count})</span>
                                                    </h3>
                                                </div>
                                            ));
                                        })()}
                                    </div>
                                )}
                            </div>

                            {/* Right: Tax Summary */}
                            <div className="lg:col-span-6 bg-white dark:bg-[#1e2129] border border-slate-200 dark:border-white/5 rounded-xl shadow-sm overflow-hidden">
                                <div className="px-5 py-3 flex items-center justify-between border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/2">
                                    <span className="text-[#3b82f6] font-black text-[13px] uppercase tracking-wider">Tax Summary</span>
                                    <button 
                                        onClick={() => setIsTaxSummaryOpen(!isTaxSummaryOpen)} 
                                        className="p-1 hover:bg-slate-100 dark:hover:bg-white/5 rounded transition-all"
                                    >
                                        <span className="font-black text-base text-slate-800 dark:text-slate-200">
                                            {isTaxSummaryOpen ? "-" : "+"}
                                        </span>
                                    </button>
                                </div>
                                {isTaxSummaryOpen && (
                                    <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-4 bg-white dark:bg-[#1e2129]">
                                        {(() => {
                                            const tax = getTaxSummary();
                                            const totalPct = tax.total > 0 ? 100 : 0;
                                            const offlinePct = tax.total > 0 ? (tax.offline / tax.total) * 100 : 0;
                                            const onlinePct = tax.total > 0 ? (tax.online / tax.total) * 100 : 0;
                                            return [
                                                { label: "Total Tax", val: tax.total, pct: totalPct },
                                                { label: "Online Orders Tax", val: tax.online, pct: onlinePct },
                                                { label: "Offline Orders Tax", val: tax.offline, pct: offlinePct }
                                            ].map((card, idx) => (
                                                <div key={idx} className="flex flex-col bg-slate-50 dark:bg-white/2 border border-slate-150 dark:border-white/5 rounded-xl p-4 shadow-sm">
                                                    <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{card.label}</p>
                                                    <h3 className="text-[13px] font-black text-slate-800 dark:text-white mt-1">
                                                        Rs {tax.total > 0 ? card.val.toFixed(2) : "0"}{" "}
                                                        <span className="text-[10px] font-bold text-slate-400">({card.pct.toFixed(2)}%)</span>
                                                    </h3>
                                                </div>
                                            ));
                                        })()}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* 4. NESTED COLUMN GRID */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                            {/* LEFT COLUMN: Items, Expenses, CRM, Inventory profit and loss */}
                            <div className="lg:col-span-7 space-y-6">
                            {/* Items widget */}
                            <div className="bg-white dark:bg-[#1e2129] border border-slate-200 dark:border-white/5 rounded-xl shadow-sm overflow-hidden">
                                <div className="px-5 py-3 flex items-center justify-between border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/2">
                                    <div className="flex items-center gap-4">
                                        <span className="text-[#3b82f6] font-black text-[13px] uppercase tracking-wider">Items</span>
                                        <div className="flex gap-1 bg-slate-100 dark:bg-white/5 p-0.5 rounded-md">
                                            <button 
                                                onClick={() => setItemsViewTab('top')}
                                                className={`px-3 py-1 rounded text-[10px] font-black uppercase transition-all ${
                                                    itemsViewTab === 'top' 
                                                        ? 'bg-slate-700 dark:bg-slate-600 text-white shadow-sm' 
                                                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
                                                }`}
                                            >
                                                Top Selling
                                            </button>
                                            <button 
                                                onClick={() => setItemsViewTab('low')}
                                                className={`px-3 py-1 rounded text-[10px] font-black uppercase transition-all ${
                                                    itemsViewTab === 'low' 
                                                        ? 'bg-slate-700 dark:bg-slate-600 text-white shadow-sm' 
                                                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
                                                }`}
                                            >
                                                Low Selling
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button onClick={fetchData} className="p-1 hover:bg-slate-100 dark:hover:bg-white/5 rounded text-slate-400 transition-all">
                                            <RefreshCw className="w-3.5 h-3.5" />
                                        </button>
                                        <button onClick={() => setIsItemsOpen(!isItemsOpen)} className="p-1 hover:bg-slate-100 dark:hover:bg-white/5 rounded transition-all">
                                            <span className="font-black text-base text-slate-800 dark:text-slate-200">{isItemsOpen ? "-" : "+"}</span>
                                        </button>
                                    </div>
                                </div>
                                {isItemsOpen && (
                                    <div className="p-0">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="border-b border-slate-100 dark:border-white/5 bg-slate-50/30 dark:bg-white/1 text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                                    <th className="px-5 py-3">Item Name</th>
                                                    <th className="px-5 py-3 text-right">Total</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {getItemSales(itemsViewTab === 'low').length === 0 ? (
                                                    <tr>
                                                        <td colSpan="2" className="px-5 py-10 text-center text-[12px] text-slate-400 font-bold uppercase tracking-wider">
                                                            No Data Found
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    getItemSales(itemsViewTab === 'low').map((item, idx) => (
                                                        <tr key={idx} className="border-b border-slate-100 dark:border-white/5 hover:bg-slate-50/50 dark:hover:bg-white/2 text-[11.5px] font-bold text-slate-700 dark:text-slate-350">
                                                            <td className="px-5 py-3.5 truncate max-w-[240px]">
                                                                {item.name}
                                                            </td>
                                                            <td className="px-5 py-3.5 text-right font-mono text-slate-900 dark:text-white">
                                                                {item.qty} (Rs {Math.round(item.revenue)})
                                                            </td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>

                            {/* Expenses widget */}
                            <div className="bg-white dark:bg-[#1e2129] border border-slate-200 dark:border-white/5 rounded-xl shadow-sm overflow-hidden">
                                <div className="px-5 py-3 flex items-center justify-between border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/2">
                                    <span className="text-[#3b82f6] font-black text-[13px] uppercase tracking-wider">Expenses</span>
                                    <button onClick={() => setIsExpensesOpen(!isExpensesOpen)} className="p-1 hover:bg-slate-100 dark:hover:bg-white/5 rounded transition-all">
                                        <span className="font-black text-base text-slate-800 dark:text-slate-200">{isExpensesOpen ? "-" : "+"}</span>
                                    </button>
                                </div>
                                {isExpensesOpen && (
                                    <div className="p-0">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="border-b border-slate-100 dark:border-white/5 bg-slate-50/30 dark:bg-white/1 text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                                    <th className="px-5 py-3">Date</th>
                                                    <th className="px-5 py-3">Category</th>
                                                    <th className="px-5 py-3">Amount</th>
                                                    <th className="px-5 py-3">Outlet</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {expenses.length === 0 ? (
                                                    <tr>
                                                        <td colSpan="4" className="px-5 py-10 text-center text-[12px] text-slate-400 font-bold uppercase tracking-wider">
                                                            No Data Found
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    expenses.map((exp, idx) => (
                                                        <tr key={idx} className="border-b border-slate-100 dark:border-white/5 hover:bg-slate-50/50 dark:hover:bg-white/2 text-[11.5px] font-bold text-slate-700 dark:text-slate-350">
                                                            <td className="px-5 py-3.5">
                                                                {new Date(exp.date || exp.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                            </td>
                                                            <td className="px-5 py-3.5 uppercase">{exp.category}</td>
                                                            <td className="px-5 py-3.5 text-rose-500 font-black">
                                                                Rs {parseFloat(exp.amount || 0).toLocaleString('en-IN')}
                                                            </td>
                                                            <td className="px-5 py-3.5 truncate max-w-[120px]">
                                                                {exp.outlet_name || getActiveOutletName()}
                                                            </td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>

                            {/* CRM widget */}
                            <div className="bg-white dark:bg-[#1e2129] border border-slate-200 dark:border-white/5 rounded-xl shadow-sm overflow-hidden">
                                <div className="px-5 py-3 flex items-center justify-between border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/2">
                                    <span className="text-[#3b82f6] font-black text-[13px] uppercase tracking-wider">CRM</span>
                                    <button onClick={() => setIsCrmOpen(!isCrmOpen)} className="p-1 hover:bg-slate-100 dark:hover:bg-white/5 rounded transition-all">
                                        <span className="font-black text-base text-slate-800 dark:text-slate-200">{isCrmOpen ? "-" : "+"}</span>
                                    </button>
                                </div>
                                {isCrmOpen && (
                                    <div className="p-5">
                                        <div className="flex items-center gap-4 bg-slate-50 dark:bg-white/2 border border-slate-150 dark:border-white/5 rounded-xl p-4 w-64 shadow-sm">
                                            <div className="w-12 h-12 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center shrink-0">
                                                <BurgerIcon />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Total customer again</p>
                                                <h3 className="text-[18px] font-black text-slate-800 dark:text-white mt-0.5">{stats.totalCustomers}</h3>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Inventory profit and loss */}
                            <div className="bg-white dark:bg-[#1e2129] border border-slate-200 dark:border-white/5 rounded-xl shadow-sm overflow-hidden">
                                <div className="px-5 py-3 flex items-center justify-between border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/2">
                                    <span className="text-[#3b82f6] font-black text-[13px] uppercase tracking-wider">Inventory profit and loss</span>
                                    <button onClick={() => setIsProfitLossOpen(!isProfitLossOpen)} className="p-1 hover:bg-slate-100 dark:hover:bg-white/5 rounded transition-all">
                                        <span className="font-black text-base text-slate-800 dark:text-slate-200">{isProfitLossOpen ? "-" : "+"}</span>
                                    </button>
                                </div>
                                {isProfitLossOpen && (
                                    <div className="p-5">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {[
                                                { label: "Total Cost Of Raw Material", val: `Rs ${Math.round(stats.totalRevenue * 0.35).toLocaleString('en-IN')}`, icon: CoinsIcon },
                                                { label: "Gross Margin", val: `Rs ${Math.round(stats.totalRevenue * 0.65).toLocaleString('en-IN')}`, icon: MarginIcon },
                                                { label: "Wastage", val: "Rs 0", icon: WastageIcon },
                                                { label: "Gross Profit In Percentage", val: `${stats.totalRevenue > 0 ? "65" : "0"}%`, icon: ProfitPercentIcon }
                                            ].map((card, idx) => (
                                                <div key={idx} className="flex items-center gap-4 bg-slate-50 dark:bg-white/2 border border-slate-150 dark:border-white/5 rounded-xl p-4 shadow-sm">
                                                    <div className="w-10 h-10 bg-slate-100 dark:bg-white/5 rounded-xl flex items-center justify-center shrink-0">
                                                        <card.icon />
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{card.label}</p>
                                                        <h3 className="text-[15px] font-black text-slate-800 dark:text-white mt-0.5">{card.val}</h3>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* RIGHT COLUMN: Sales by Category Breakdown, Revenue Leakage, Staff Sales */}
                        <div className="lg:col-span-5 space-y-6">
                            {/* Sales by Category Breakdown */}
                            <div className="bg-white dark:bg-[#1e2129] border border-slate-200 dark:border-white/5 rounded-xl shadow-sm overflow-hidden">
                                <div className="px-5 py-3 flex items-center justify-between border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/2">
                                    <span className="text-[#3b82f6] font-black text-[13px] uppercase tracking-wider">Sales by Category Breakdown</span>
                                    <button onClick={() => setIsCategoryOpen(!isCategoryOpen)} className="p-1 hover:bg-slate-100 dark:hover:bg-white/5 rounded transition-all">
                                        <span className="font-black text-base text-slate-800 dark:text-slate-200">{isCategoryOpen ? "-" : "+"}</span>
                                    </button>
                                </div>
                                {isCategoryOpen && (
                                    <div className="p-5 flex flex-col items-center justify-center min-h-[220px]">
                                        {getCategorySales().length === 0 ? (
                                            <div className="flex flex-col items-center gap-3 py-6">
                                                <EmptyPieChart />
                                                <p className="text-[12px] text-slate-400 font-bold uppercase tracking-wider mt-2">No Data Found</p>
                                            </div>
                                        ) : (
                                            <div className="w-full space-y-4">
                                                <div className="flex items-center justify-center gap-8">
                                                    <svg className="w-24 h-24" viewBox="0 0 36 36">
                                                        {(() => {
                                                            let cumulativePercent = 0;
                                                            const sales = getCategorySales();
                                                            const totalAmt = sales.reduce((sum, c) => sum + c.amount, 0) || 1;
                                                            const colors = ["stroke-emerald-500", "stroke-blue-500", "stroke-indigo-500", "stroke-purple-500", "stroke-pink-500"];
                                                            return sales.slice(0, 5).map((cat, idx) => {
                                                                const pct = (cat.amount / totalAmt) * 100;
                                                                const strokeDash = `${pct} ${100 - pct}`;
                                                                const strokeOffset = 100 - cumulativePercent + 25;
                                                                cumulativePercent += pct;
                                                                return (
                                                                    <circle 
                                                                        key={idx}
                                                                        cx="18" cy="18" r="15.915" 
                                                                        fill="none" 
                                                                        className={colors[idx % colors.length]} 
                                                                        strokeWidth="3.8" 
                                                                        strokeDasharray={strokeDash} 
                                                                        strokeDashoffset={strokeOffset} 
                                                                    />
                                                                );
                                                            });
                                                        })()}
                                                    </svg>
                                                    <div className="text-[10.5px] font-bold text-slate-600 dark:text-slate-400 space-y-1">
                                                        {getCategorySales().slice(0, 4).map((cat, idx) => {
                                                            const totalAmt = getCategorySales().reduce((sum, c) => sum + c.amount, 0) || 1;
                                                            const colors = ["bg-emerald-500", "bg-blue-500", "bg-indigo-500", "bg-purple-500", "bg-pink-500"];
                                                            return (
                                                                <div key={idx} className="flex items-center gap-1.5">
                                                                    <span className={`w-2.5 h-2.5 rounded-full ${colors[idx % colors.length]}`} />
                                                                    <span>{cat.name} ({Math.round(cat.amount / totalAmt * 100)}%)</span>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                                <div className="border-t border-slate-100 dark:border-white/5 pt-3 space-y-2">
                                                    {getCategorySales().slice(0, 5).map((cat, idx) => (
                                                        <div key={idx} className="flex justify-between items-center text-[11px] font-bold text-slate-700 dark:text-slate-350">
                                                            <span>{cat.name}</span>
                                                            <span className="font-mono text-slate-900 dark:text-white">Rs {Math.round(cat.amount).toLocaleString('en-IN')}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Revenue Leakage */}
                            <div className="bg-white dark:bg-[#1e2129] border border-slate-200 dark:border-white/5 rounded-xl shadow-sm overflow-hidden">
                                <div className="px-5 py-3 flex items-center justify-between border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/2">
                                    <span className="text-[#3b82f6] font-black text-[13px] uppercase tracking-wider">Revenue Leakage</span>
                                    <button onClick={() => setIsLeakageOpen(!isLeakageOpen)} className="p-1 hover:bg-slate-100 dark:hover:bg-white/5 rounded transition-all">
                                        <span className="font-black text-base text-slate-800 dark:text-slate-200">{isLeakageOpen ? "-" : "+"}</span>
                                    </button>
                                </div>
                                {isLeakageOpen && (
                                    <div className="p-5">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="flex items-center gap-4 bg-slate-50 dark:bg-white/2 border border-slate-150 dark:border-white/5 rounded-xl p-4 shadow-sm">
                                                <div className="w-12 h-12 bg-slate-100 dark:bg-white/5 rounded-xl flex items-center justify-center shrink-0">
                                                    <FileIcon />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Bills Modified</p>
                                                    <h3 className="text-[18px] font-black text-slate-800 dark:text-white mt-0.5">0</h3>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4 bg-slate-50 dark:bg-white/2 border border-slate-150 dark:border-white/5 rounded-xl p-4 shadow-sm">
                                                <div className="w-12 h-12 bg-slate-100 dark:bg-white/5 rounded-xl flex items-center justify-center shrink-0">
                                                    <PrinterIcon />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Bills Re-Printed</p>
                                                    <h3 className="text-[18px] font-black text-slate-800 dark:text-white mt-0.5">0</h3>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Staff Sales */}
                            <div className="bg-white dark:bg-[#1e2129] border border-slate-200 dark:border-white/5 rounded-xl shadow-sm overflow-hidden">
                                <div className="px-5 py-3 flex items-center justify-between border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/2">
                                    <span className="text-[#3b82f6] font-black text-[13px] uppercase tracking-wider">Staff Sales</span>
                                    <button onClick={() => setIsStaffOpen(!isStaffOpen)} className="p-1 hover:bg-slate-100 dark:hover:bg-white/5 rounded transition-all">
                                        <span className="font-black text-base text-slate-800 dark:text-slate-200">{isStaffOpen ? "-" : "+"}</span>
                                    </button>
                                </div>
                                {isStaffOpen && (
                                    <div className="p-0">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="border-b border-slate-100 dark:border-white/5 bg-slate-50/30 dark:bg-white/1 text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                                    <th className="px-5 py-3">Name</th>
                                                    <th className="px-5 py-3">Designation</th>
                                                    <th className="px-5 py-3">Amount</th>
                                                    <th className="px-5 py-3">Outlet</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {getStaffSales().length === 0 ? (
                                                    <tr>
                                                        <td colSpan="4" className="px-5 py-10 text-center text-[12px] text-slate-400 font-bold uppercase tracking-wider">
                                                            No Data Found
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    getStaffSales().map((staff, idx) => (
                                                        <tr key={idx} className="border-b border-slate-100 dark:border-white/5 hover:bg-slate-50/50 dark:hover:bg-white/2 text-[11.5px] font-bold text-slate-700 dark:text-slate-350">
                                                            <td className="px-5 py-3.5 uppercase">{staff.name}</td>
                                                            <td className="px-5 py-3.5 text-slate-500">{staff.designation}</td>
                                                            <td className="px-5 py-3.5 text-emerald-500 font-black">
                                                                Rs {Math.round(staff.amount).toLocaleString('en-IN')}
                                                            </td>
                                                            <td className="px-5 py-3.5 truncate max-w-[120px]">
                                                                {staff.outlet || getActiveOutletName()}
                                                            </td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>

                            {/* Waiter Calls widget */}
                            <div className="bg-white dark:bg-[#1e2129] border border-slate-200 dark:border-white/5 rounded-xl shadow-sm overflow-hidden flex flex-col">
                                <div className="px-5 py-3 flex items-center justify-between border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/2">
                                    <div className="flex items-center gap-2">
                                        <BellRing className="w-4 h-4 text-amber-500 animate-bounce" />
                                        <span className="text-amber-700 dark:text-amber-400 font-black text-[13px] uppercase tracking-wider">Waiter Calls</span>
                                        {waiterRequests.length > 0 && (
                                            <span className="bg-amber-500 text-white text-[10px] px-2 py-0.5 rounded-full animate-pulse font-black">
                                                {waiterRequests.length}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="p-4 space-y-3 max-h-[300px] overflow-y-auto no-scrollbar">
                                    {waiterRequests.map((req) => (
                                        <div key={req.id} className="flex items-center justify-between p-3.5 bg-amber-50/30 dark:bg-amber-500/5 border border-amber-100/50 dark:border-amber-500/10 rounded-xl">
                                            <div className="min-w-0">
                                                <p className="text-[12px] font-black text-slate-800 dark:text-white tracking-tight">Table {req.table_number}</p>
                                                <p className="text-[9px] text-slate-400 font-bold uppercase mt-0.5">
                                                    {new Date(req.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </div>
                                            <button 
                                                onClick={() => resolveWaiter(req.id)}
                                                className="w-8 h-8 bg-white dark:bg-slate-800 border border-amber-250 dark:border-amber-500/20 rounded-lg flex items-center justify-center text-amber-600 hover:bg-amber-500 hover:text-white transition-all shadow-sm"
                                            >
                                                <Check className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                    {waiterRequests.length === 0 && (
                                        <div className="py-12 flex flex-col items-center justify-center text-slate-350 dark:text-slate-650">
                                            <Clock className="w-6 h-6 mb-2" />
                                            <p className="text-[9px] font-black uppercase tracking-widest">Quiet Zone</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>

            {/* Platform Footer */}
            <div className="border-t border-slate-100 dark:border-white/5 px-6 py-4 flex flex-col md:flex-row items-center justify-between text-[10px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest">
                <p>Copyright © 2026-2027 <span className="text-emerald-500 font-black">Powered by SaSLoop ERP | AI Technology</span>. All Rights Reserved.</p>
                <div className="flex items-center gap-6 mt-4 md:mt-0">
                    <p>Version: <span className="text-slate-500">11.7.0</span></p>
                    <p className="text-emerald-500/60 cursor-pointer hover:text-emerald-500 transition-colors">support@sasloop.ai</p>
                </div>
            </div>

            {/* WhatsApp Test Modal */}
            {isTestModalOpen && (
                <div className="pro-modal-overlay">
                    <div className="pro-modal-content max-w-md p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl relative text-white">
                        <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-3">
                            <h3 className="text-base font-black text-white uppercase tracking-wider flex items-center gap-2">
                                <Zap className="w-5 h-5 text-emerald-500 animate-pulse" /> WhatsApp Connection Test
                            </h3>
                            <button 
                                onClick={() => setIsTestModalOpen(false)}
                                className="text-slate-400 hover:text-white transition-colors font-bold text-lg"
                            >
                                &times;
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 space-y-2">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Configuration</p>
                                <div className="text-xs space-y-1">
                                    <p><span className="text-slate-500">Verified Name:</span> <span className="font-mono text-emerald-400">{whatsappStatus.verifiedName}</span></p>
                                    <p><span className="text-slate-500">Display Phone:</span> <span className="font-mono text-emerald-400">{whatsappStatus.displayPhone || "N/A"}</span></p>
                                </div>
                            </div>

                            <form onSubmit={async (e) => {
                                e.preventDefault();
                                if (!testPhone) return;
                                setTestLoading(true);
                                setTestResult(null);
                                try {
                                    const impersonateId = sessionStorage.getItem("impersonate_id");
                                    const res = await fetch(`${API_BASE}/api/whatsapp/test-send`, {
                                        method: "POST",
                                        headers: {
                                            "Authorization": `Bearer ${localStorage.getItem("token")}`,
                                            "Content-Type": "application/json"
                                        },
                                        body: JSON.stringify({
                                            phone: testPhone,
                                            target_user_id: impersonateId
                                        })
                                    });
                                    const data = await res.json();
                                    if (res.ok) {
                                        setTestResult({ success: true, message: data.message });
                                    } else {
                                        setTestResult({ success: false, message: data.error || "Failed to send message" });
                                    }
                                } catch (err) {
                                    setTestResult({ success: false, message: err.message });
                                } finally {
                                    setTestLoading(false);
                                }
                            }} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Recipient Phone Number</label>
                                    <input 
                                        type="text" 
                                        required
                                        placeholder="e.g. +919469697216 or 10-digit number"
                                        value={testPhone}
                                        onChange={(e) => setTestPhone(e.target.value)}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white font-mono placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all shadow-inner"
                                    />
                                    <p className="text-[10px] text-slate-500 mt-2">Enter the phone number (with country code) to receive the test message.</p>
                                </div>

                                {testResult && (
                                    <div className={`p-4 rounded-xl text-xs font-medium border ${
                                        testResult.success 
                                            ? "bg-emerald-950/30 border-emerald-500/20 text-emerald-400" 
                                            : "bg-rose-950/30 border-rose-500/20 text-rose-400"
                                    }`}>
                                        {testResult.success ? "✅ " : "❌ "}
                                        {typeof testResult.message === 'object' ? JSON.stringify(testResult.message) : testResult.message}
                                    </div>
                                )}

                                <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                                    <button 
                                        type="button"
                                        onClick={() => setIsTestModalOpen(false)}
                                        className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all"
                                    >
                                        Close
                                    </button>
                                    <button 
                                        type="submit"
                                        disabled={testLoading}
                                        className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800/50 disabled:text-emerald-500/50 text-white rounded-xl text-[11px] font-black uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg shadow-emerald-600/10 active:scale-95"
                                    >
                                        {testLoading ? (
                                            <>
                                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                <span>Sending...</span>
                                            </>
                                        ) : (
                                            <span>Send Test Message</span>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}


        </div>
    );
};

export default Dashboard;
