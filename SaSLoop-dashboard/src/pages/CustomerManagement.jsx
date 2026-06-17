import React, { useState, useEffect, useMemo } from "react";
import { 
  Users, Search, RefreshCw, Plus, 
  Trash2, Edit3, Award, Wallet, 
  Coins, History, X, AlertCircle, 
  CheckCircle2, ArrowLeft, Calendar, 
  UserCheck, MapPin, Building2, Percent, 
  ShoppingBag, Info, ShieldAlert
} from "lucide-react";
import API_BASE from "../config";

const CustomerManagement = () => {
    // List & Loading state
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [currencySymbol, setCurrencySymbol] = useState("₹");
    const [activeView, setActiveView] = useState("dashboard"); // "dashboard", "manage_customers", "manage_balances", "manage_points"

    // Toast message state
    const [message, setMessage] = useState(null);

    // Selected customer for modal actions
    const [selectedCustomer, setSelectedCustomer] = useState(null);

    // History Modal state
    const [historyData, setHistoryData] = useState({ orders: [], transactions: [] });
    const [historyLoading, setHistoryLoading] = useState(false);
    const [historyActiveTab, setHistoryActiveTab] = useState("ledger"); // ledger or orders

    // Modals Visibility
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isAdjustPointsModalOpen, setIsAdjustPointsModalOpen] = useState(false);
    const [isAdjustBalanceModalOpen, setIsAdjustBalanceModalOpen] = useState(false);
    const [isPayDueModalOpen, setIsPayDueModalOpen] = useState(false);
    const [isHistoryDrawerOpen, setIsHistoryDrawerOpen] = useState(false);

    // Form inputs state
    // Add Form
    const [addName, setAddName] = useState("");
    const [addPhone, setAddPhone] = useState("");
    const [addAddress, setAddAddress] = useState("");
    const [addPoints, setAddPoints] = useState("");
    const [addBalance, setAddBalance] = useState("");

    // Edit Form
    const [editName, setEditName] = useState("");
    const [editAddress, setEditAddress] = useState("");

    // Adjust Points Form
    const [pointsAmount, setPointsAmount] = useState("");
    const [pointsType, setPointsType] = useState("ADD"); // ADD or DEDUCT
    const [pointsReason, setPointsReason] = useState("");

    // Adjust Balance Form
    const [balanceAmount, setBalanceAmount] = useState("");
    const [balanceType, setBalanceType] = useState("ADD"); // ADD or DEDUCT (topup vs deduction)
    const [balanceReason, setBalanceReason] = useState("");

    // Pay Due Form
    const [dueAmount, setDueAmount] = useState("");
    const [duePaymentMethod, setDuePaymentMethod] = useState("CASH");
    const [dueReason, setDueReason] = useState("");

    // Helper for Toast notification
    const showToast = (type, text) => {
        setMessage({ type, text });
        setTimeout(() => setMessage(null), 4000);
    };

    // Load active impersonation details and currency
    const fetchBusinessContext = async () => {
        try {
            const impersonateId = sessionStorage.getItem("impersonate_id");
            const targetParam = impersonateId ? `?target_user_id=${impersonateId}` : "";
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_BASE}/api/business/status${targetParam}`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                if (data.hasBusiness && data.business) {
                    const biz = data.business;
                    const code = biz.currency_code || biz.currency || "INR";
                    setCurrencySymbol(code === "USD" ? "$" : (code === "SAR" ? "SR" : (code === "AED" ? "AED" : "₹")));
                }
            }
        } catch (e) {
            console.error("Failed to load business currency context:", e);
        }
    };

    // Fetch customers manifest
    const fetchCustomers = async (isSilent = false) => {
        if (!isSilent) setLoading(true);
        try {
            const impersonateId = sessionStorage.getItem("impersonate_id");
            const targetParam = impersonateId ? `?target_user_id=${impersonateId}` : "";
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_BASE}/api/crm/customers${targetParam}`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setCustomers(Array.isArray(data) ? data : []);
            } else {
                if (!isSilent) showToast("error", "Failed to retrieve customer vault data.");
            }
        } catch (err) {
            console.error("CRM fetch error:", err);
            if (!isSilent) showToast("error", "Network error reading customers records.");
        } finally {
            if (!isSilent) setLoading(false);
        }
    };

    useEffect(() => {
        fetchBusinessContext();
        fetchCustomers();

        // Silent background polling for new customers/ordering (every 10 seconds)
        const pollInterval = setInterval(() => {
            fetchCustomers(true);
        }, 10000);

        return () => clearInterval(pollInterval);
    }, []);

    // Filter customers
    const filteredCustomers = useMemo(() => {
        return customers.filter(c => {
            const query = searchTerm.toLowerCase();
            return (
                (c.name || "").toLowerCase().includes(query) ||
                (c.phone || "").includes(query) ||
                (c.address || "").toLowerCase().includes(query)
            );
        });
    }, [customers, searchTerm]);

    // Aggregate statistics
    const stats = useMemo(() => {
        const total = customers.length;
        const totalPoints = customers.reduce((acc, curr) => acc + parseInt(curr.points || 0), 0);
        
        // Negative balance = Dues (outstanding money they owe). Positive = Prepayment Credit
        const totalDues = customers.reduce((acc, curr) => {
            const bal = parseFloat(curr.balance || 0);
            return bal < 0 ? acc + Math.abs(bal) : acc;
        }, 0);

        const totalSpent = customers.reduce((acc, curr) => acc + parseFloat(curr.total_spent || 0), 0);
        const avgSpent = total > 0 ? (totalSpent / total).toFixed(2) : "0.00";

        return { total, totalPoints, totalDues, avgSpent };
    }, [customers]);

    // Handle adding new guest profile
    const handleAddCustomer = async (e) => {
        if (e) e.preventDefault();
        if (!addName.trim() || !addPhone.trim()) {
            showToast("error", "Name and Customer Number are mandatory.");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            const payload = {
                name: addName.trim(),
                number: addPhone.trim(),
                address: addAddress.trim(),
                points: addPoints ? parseInt(addPoints) : 0,
                balance: addBalance ? parseFloat(addBalance) : 0.00
            };

            const impersonateId = sessionStorage.getItem("impersonate_id");
            const targetParam = impersonateId ? `?target_user_id=${impersonateId}` : "";
            const res = await fetch(`${API_BASE}/api/crm/customers${targetParam}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                showToast("success", "Guest registered and loyalty account synced!");
                // Reset form
                setAddName("");
                setAddPhone("");
                setAddAddress("");
                setAddPoints("");
                setAddBalance("");
                setIsAddModalOpen(false);
                fetchCustomers();
            } else {
                const err = await res.json();
                showToast("error", err.error || "Failed to create customer profile.");
            }
        } catch (e) {
            showToast("error", "Network error registering guest profile.");
        }
    };

    // Handle editing customer info
    const handleEditCustomer = async (e) => {
        if (e) e.preventDefault();
        if (!editName.trim()) {
            showToast("error", "Guest name is required.");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            const payload = {
                name: editName.trim(),
                number: selectedCustomer.phone, // key identifier
                address: editAddress.trim(),
            };

            const impersonateId = sessionStorage.getItem("impersonate_id");
            const targetParam = impersonateId ? `?target_user_id=${impersonateId}` : "";
            const res = await fetch(`${API_BASE}/api/crm/customers${targetParam}`, {
                method: "POST", // endpoint operates as upsert
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                showToast("success", "Customer details synced successfully.");
                setIsEditModalOpen(false);
                fetchCustomers();
            } else {
                const err = await res.json();
                showToast("error", err.error || "Failed to edit details.");
            }
        } catch (e) {
            showToast("error", "Network error updating details.");
        }
    };

    // Handle clean wiping customer
    const handleDeleteCustomer = async () => {
        try {
            const token = localStorage.getItem("token");
            const impersonateId = sessionStorage.getItem("impersonate_id");
            const targetParam = impersonateId ? `?target_user_id=${impersonateId}` : "";
            const res = await fetch(`${API_BASE}/api/crm/customer/${encodeURIComponent(selectedCustomer.phone)}${targetParam}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (res.ok) {
                showToast("success", `Customer ${selectedCustomer.name} deleted and wiped from database.`);
                setIsDeleteModalOpen(false);
                fetchCustomers();
            } else {
                const err = await res.json().catch(() => ({}));
                showToast("error", `Failed to delete: ${res.status} - ${err.error || 'Server Error'}`);
            }
        } catch (e) {
            showToast("error", "Network error deleting customer record.");
        }
    };

    // Handle adjusting points
    const handleAdjustPoints = async (e) => {
        if (e) e.preventDefault();
        const pts = parseInt(pointsAmount);
        if (isNaN(pts) || pts <= 0) {
            showToast("error", "Please enter a valid points amount.");
            return;
        }
        if (!pointsReason.trim()) {
            showToast("error", "Reason log is mandatory for loyalty compliance.");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            const val = pointsType === "ADD" ? pts : -pts;
            
            // Safety check for deduction
            if (pointsType === "DEDUCT" && Math.abs(val) > (selectedCustomer.points || 0)) {
                showToast("error", "Cannot deduct more points than the customer currently has.");
                return;
            }

            const impersonateId = sessionStorage.getItem("impersonate_id");
            const targetParam = impersonateId ? `?target_user_id=${impersonateId}` : "";
            const res = await fetch(`${API_BASE}/api/crm/customers/adjust${targetParam}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    phone: selectedCustomer.phone,
                    type: "POINTS_ADJUSTMENT",
                    points: val,
                    reason: pointsReason.trim()
                })
            });

            if (res.ok) {
                showToast("success", "Loyalty points updated!");
                setPointsAmount("");
                setPointsReason("");
                setIsAdjustPointsModalOpen(false);
                fetchCustomers();
            } else {
                const err = await res.json();
                showToast("error", err.error || "Failed to adjust points.");
            }
        } catch (e) {
            showToast("error", "Network error adjusting points.");
        }
    };

    // Handle adjusting wallet balance
    const handleAdjustBalance = async (e) => {
        if (e) e.preventDefault();
        const amt = parseFloat(balanceAmount);
        if (isNaN(amt) || amt <= 0) {
            showToast("error", "Please enter a valid currency amount.");
            return;
        }
        if (!balanceReason.trim()) {
            showToast("error", "Reason log is mandatory for financial adjustments.");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            const val = balanceType === "ADD" ? amt : -amt;

            const impersonateId = sessionStorage.getItem("impersonate_id");
            const targetParam = impersonateId ? `?target_user_id=${impersonateId}` : "";
            const res = await fetch(`${API_BASE}/api/crm/customers/adjust${targetParam}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    phone: selectedCustomer.phone,
                    type: "BALANCE_ADJUSTMENT",
                    amount: val,
                    reason: balanceReason.trim()
                })
            });

            if (res.ok) {
                showToast("success", "Customer balance updated successfully.");
                setBalanceAmount("");
                setBalanceReason("");
                setIsAdjustBalanceModalOpen(false);
                fetchCustomers();
            } else {
                const err = await res.json();
                showToast("error", err.error || "Failed to adjust balance.");
            }
        } catch (e) {
            showToast("error", "Network error adjusting balance.");
        }
    };

    // Handle recording dues payment (due repayment / wallet prepayment)
    const handlePayDue = async (e) => {
        if (e) e.preventDefault();
        const amt = parseFloat(dueAmount);
        if (isNaN(amt) || amt <= 0) {
            showToast("error", "Please enter a valid payment amount.");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            const reasonLog = dueReason.trim() || `Back Office Dues Payment of ${currencySymbol}${amt.toFixed(2)} via ${duePaymentMethod}`;

            const impersonateId = sessionStorage.getItem("impersonate_id");
            const targetParam = impersonateId ? `?target_user_id=${impersonateId}` : "";
            const res = await fetch(`${API_BASE}/api/crm/customers/pay-due${targetParam}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    phone: selectedCustomer.phone,
                    amount: amt,
                    paymentMethod: duePaymentMethod,
                    reason: reasonLog
                })
            });

            if (res.ok) {
                showToast("success", "Prepayment recorded! Dues adjusted.");
                setDueAmount("");
                setDueReason("");
                setDuePaymentMethod("CASH");
                setIsPayDueModalOpen(false);
                fetchCustomers();
            } else {
                const err = await res.json();
                showToast("error", err.error || "Failed to record payment.");
            }
        } catch (e) {
            showToast("error", "Network error processing dues payment.");
        }
    };

    // Load ledger and order history details
    const loadCustomerHistory = async (phone) => {
        setHistoryLoading(true);
        try {
            const token = localStorage.getItem("token");
            const impersonateId = sessionStorage.getItem("impersonate_id");
            const targetParam = impersonateId ? `?target_user_id=${impersonateId}` : "";
            const res = await fetch(`${API_BASE}/api/crm/customers/${encodeURIComponent(phone)}/history${targetParam}`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setHistoryData(data || { orders: [], transactions: [] });
            } else {
                showToast("error", "Failed to retrieve history logs.");
            }
        } catch (e) {
            console.error(e);
            showToast("error", "Network error loading ledger.");
        } finally {
            setHistoryLoading(false);
        }
    };

    return (
        <div className="p-6 space-y-6 animate-in fade-in duration-500 font-sans text-slate-800 dark:text-slate-100">
            {/* Status Toast Notification */}
            {message && (
                <div className={`fixed top-6 right-6 z-[1000] px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 border text-xs font-bold uppercase tracking-wider animate-in slide-in-from-top duration-300 ${
                    message.type === "success" 
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/50" 
                        : "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-900/50"
                }`}>
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    {message.text}
                </div>
            )}

            {/* Dashboard Cards Menu */}
            {activeView === "dashboard" ? (
                <div className="space-y-6 animate-in fade-in duration-300">
                    {/* Header Title Section */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-200 dark:border-white/5 pb-4 gap-4">
                        <div>
                            <h1 className="text-[20px] font-black text-slate-800 dark:text-white uppercase tracking-tight flex items-center gap-2">
                                <Users className="w-6 h-6 text-emerald-500" /> Customer Management
                            </h1>
                            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">
                                Navigate options to add customers, manage information, update prepayment balances, or adjust loyalty points.
                            </p>
                        </div>
                    </div>

                    {/* POS-like Grey Panel container holding the white cards */}
                    <div className="bg-slate-100 dark:bg-black/20 border border-slate-200 dark:border-white/5 p-6 rounded-2xl">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {/* Card 1: Adding Customers */}
                            <div 
                                onClick={() => setIsAddModalOpen(true)}
                                className="bg-white dark:bg-[#1e2129] border border-slate-200 dark:border-white/5 p-8 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer flex flex-col items-center justify-center space-y-4 text-center min-h-[160px]"
                            >
                                <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-white/5 flex items-center justify-center text-slate-700 dark:text-white">
                                    <UserCheck className="w-6 h-6" />
                                </div>
                                <span className="font-bold text-sm text-slate-800 dark:text-white tracking-tight">Adding Customers</span>
                            </div>

                            {/* Card 2: Managing Customers */}
                            <div 
                                onClick={() => setActiveView("manage_customers")}
                                className="bg-white dark:bg-[#1e2129] border border-slate-200 dark:border-white/5 p-8 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer flex flex-col items-center justify-center space-y-4 text-center min-h-[160px]"
                            >
                                <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-white/5 flex items-center justify-center text-slate-700 dark:text-white">
                                    <Users className="w-6 h-6" />
                                </div>
                                <span className="font-bold text-sm text-slate-800 dark:text-white tracking-tight">Managing Customers</span>
                            </div>

                            {/* Card 3: Managing Customer Balances */}
                            <div 
                                onClick={() => setActiveView("manage_balances")}
                                className="bg-white dark:bg-[#1e2129] border border-slate-200 dark:border-white/5 p-8 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer flex flex-col items-center justify-center space-y-4 text-center min-h-[160px]"
                            >
                                <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-white/5 flex items-center justify-center text-slate-700 dark:text-white">
                                    <Wallet className="w-6 h-6" />
                                </div>
                                <span className="font-bold text-sm text-slate-800 dark:text-white tracking-tight">Managing Customer Balances</span>
                            </div>

                            {/* Card 4: Managing Loyalty Points */}
                            <div 
                                onClick={() => setActiveView("manage_points")}
                                className="bg-white dark:bg-[#1e2129] border border-slate-200 dark:border-white/5 p-8 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer flex flex-col items-center justify-center space-y-4 text-center min-h-[160px]"
                            >
                                <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-white/5 flex items-center justify-center text-slate-700 dark:text-white">
                                    <Award className="w-6 h-6" />
                                </div>
                                <span className="font-bold text-sm text-slate-800 dark:text-white tracking-tight">Managing Loyalty Points</span>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                /* Subviews with back navigation */
                <div className="space-y-6 animate-in fade-in duration-300">
                    {/* View Header with back button */}
                    <div className="flex items-center gap-4 border-b border-slate-200 dark:border-white/5 pb-4">
                        <button 
                            onClick={() => {
                                setActiveView("dashboard");
                                setSearchTerm("");
                            }}
                            className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 rounded-lg text-slate-700 dark:text-white transition-all flex items-center gap-1 text-[10px] font-black uppercase tracking-wider"
                        >
                            <ArrowLeft className="w-4 h-4" /> Back
                        </button>
                        <div>
                            <h1 className="text-[18px] font-black text-slate-800 dark:text-white uppercase tracking-tight">
                                {activeView === "manage_customers" && "Managing Customers"}
                                {activeView === "manage_balances" && "Managing Customer Balances"}
                                {activeView === "manage_points" && "Managing Loyalty Points"}
                            </h1>
                            <p className="text-[9.5px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-0.5">
                                {activeView === "manage_customers" && "View customer listing, edit profile information, delete records, or inspect history ledger."}
                                {activeView === "manage_balances" && "Inspect outstanding customer balances and dues, or adjust credit/dues manually."}
                                {activeView === "manage_points" && "Inspect and adjust customer loyalty points for rewards program compliance."}
                            </p>
                        </div>
                    </div>

                    {/* Filter and search control bar */}
                    <div className="bg-white dark:bg-[#1e2129] p-4 border border-slate-200 dark:border-white/5 rounded-2xl shadow-sm flex items-center gap-4 relative overflow-hidden group">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input 
                                type="text" 
                                placeholder="SEARCH BY NAME OR PHONE..." 
                                className="w-full h-11 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-xl pl-10 pr-4 text-[10px] font-black uppercase outline-none focus:border-emerald-600 dark:focus:border-emerald-600 transition-all text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 tracking-wider" 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <button 
                            onClick={fetchCustomers}
                            className="p-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-slate-500 dark:text-slate-400 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 transition-all"
                            title="Reload Table Data"
                        >
                            <RefreshCw className={`w-4.5 h-4.5 ${loading ? "animate-spin" : ""}`} />
                        </button>
                    </div>

                    {/* Table views */}
                    <div className="bg-white dark:bg-[#1e2129] rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm overflow-hidden flex flex-col min-h-[400px]">
                        <div className="flex-1 overflow-x-auto">
                            {activeView === "manage_customers" && (
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50 dark:bg-black/10 border-b border-slate-200 dark:border-white/5 text-[9px] font-black text-slate-400 uppercase tracking-wider">
                                            <th className="px-6 py-4">Customer</th>
                                            <th className="px-6 py-4">Phone</th>
                                            <th className="px-6 py-4">Address</th>
                                            <th className="px-6 py-4 text-center">Orders</th>
                                            <th className="px-6 py-4 text-center">Total Spent</th>
                                            <th className="px-6 py-4 text-center">Balance</th>
                                            <th className="px-6 py-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-white/5 text-xs">
                                        {loading ? (
                                            <tr>
                                                <td colSpan="7" className="py-24 text-center text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] animate-pulse">
                                                    Accessing Customer Identity Vaults...
                                                </td>
                                            </tr>
                                        ) : filteredCustomers.length === 0 ? (
                                            <tr>
                                                <td colSpan="7" className="py-24 text-center text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                                    No customer profiles found
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredCustomers.map((cust) => {
                                                const balance = parseFloat(cust.balance || 0);
                                                return (
                                                    <tr key={cust.phone} className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors">
                                                        <td className="px-6 py-4 font-bold text-slate-800 dark:text-white uppercase text-[12px]">{cust.name || "Guest"}</td>
                                                        <td className="px-6 py-4 font-bold text-slate-600 dark:text-slate-350">{cust.phone}</td>
                                                        <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{cust.address || "Saved from WhatsApp Chatbot"}</td>
                                                        <td className="px-6 py-4 text-center font-bold">{cust.orders || 0}</td>
                                                        <td className="px-6 py-4 text-center font-bold text-emerald-600 dark:text-emerald-400">{currencySymbol}{parseFloat(cust.total_spent || 0).toFixed(0)}</td>
                                                        <td className={`px-6 py-4 text-center font-bold ${balance < 0 ? "text-rose-500" : "text-emerald-500"}`}>
                                                            {currencySymbol}{balance.toFixed(2)}
                                                        </td>
                                                        <td className="px-6 py-4 text-right">
                                                            <div className="flex items-center justify-end gap-1.5">
                                                                <button 
                                                                    type="button"
                                                                    onClick={() => {
                                                                        setSelectedCustomer(cust);
                                                                        setHistoryActiveTab("ledger");
                                                                        setIsHistoryDrawerOpen(true);
                                                                        loadCustomerHistory(cust.phone);
                                                                    }}
                                                                    className="px-3 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 rounded font-black text-[9px] uppercase tracking-wider"
                                                                >
                                                                    History
                                                                </button>
                                                                <button 
                                                                    type="button"
                                                                    onClick={() => {
                                                                        setSelectedCustomer(cust);
                                                                        setEditName(cust.name || "");
                                                                        setEditAddress(cust.address || "");
                                                                        setIsEditModalOpen(true);
                                                                    }}
                                                                    className="px-3 py-1.5 bg-slate-500/10 hover:bg-slate-500/20 text-slate-500 rounded font-black text-[9px] uppercase tracking-wider"
                                                                >
                                                                    Edit
                                                                </button>
                                                                <button 
                                                                    type="button"
                                                                    onClick={() => {
                                                                        setSelectedCustomer(cust);
                                                                        setIsDeleteModalOpen(true);
                                                                    }}
                                                                    className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 rounded font-black text-[9px] uppercase tracking-wider"
                                                                >
                                                                    Delete
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        )}
                                    </tbody>
                                </table>
                            )}

                            {activeView === "manage_balances" && (
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50 dark:bg-black/10 border-b border-slate-200 dark:border-white/5 text-[9px] font-black text-slate-400 uppercase tracking-wider">
                                            <th className="px-6 py-4">Customer</th>
                                            <th className="px-6 py-4">Phone</th>
                                            <th className="px-6 py-4 text-center">Current Balance</th>
                                            <th className="px-6 py-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-white/5 text-xs">
                                        {loading ? (
                                            <tr>
                                                <td colSpan="4" className="py-24 text-center text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] animate-pulse">
                                                    Accessing Customer Identity Vaults...
                                                </td>
                                            </tr>
                                        ) : filteredCustomers.length === 0 ? (
                                            <tr>
                                                <td colSpan="4" className="py-24 text-center text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                                    No customer profiles found
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredCustomers.map((cust) => {
                                                const balance = parseFloat(cust.balance || 0);
                                                return (
                                                    <tr key={cust.phone} className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors">
                                                        <td className="px-6 py-4 font-bold text-slate-800 dark:text-white uppercase text-[12px]">{cust.name || "Guest"}</td>
                                                        <td className="px-6 py-4 font-bold text-slate-600 dark:text-slate-350">{cust.phone}</td>
                                                        <td className={`px-6 py-4 text-center font-black ${balance < 0 ? "text-rose-500" : "text-emerald-500"}`}>
                                                            {currencySymbol}{balance.toFixed(2)}
                                                        </td>
                                                        <td className="px-6 py-4 text-right">
                                                            <div className="flex items-center justify-end gap-1.5">
                                                                <button 
                                                                    type="button"
                                                                    onClick={() => {
                                                                        setSelectedCustomer(cust);
                                                                        setHistoryActiveTab("ledger");
                                                                        setIsHistoryDrawerOpen(true);
                                                                        loadCustomerHistory(cust.phone);
                                                                    }}
                                                                    className="px-3 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 rounded font-black text-[9px] uppercase tracking-wider transition-all"
                                                                >
                                                                    History
                                                                </button>
                                                                <button 
                                                                    type="button"
                                                                    onClick={() => {
                                                                        setSelectedCustomer(cust);
                                                                        setBalanceAmount("");
                                                                        setBalanceReason("");
                                                                        setBalanceType("ADD");
                                                                        setIsAdjustBalanceModalOpen(true);
                                                                    }}
                                                                    className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-black text-[9px] uppercase tracking-wider transition-all"
                                                                >
                                                                    Adjust
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        )}
                                    </tbody>
                                </table>
                            )}

                            {activeView === "manage_points" && (
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50 dark:bg-black/10 border-b border-slate-200 dark:border-white/5 text-[9px] font-black text-slate-400 uppercase tracking-wider">
                                            <th className="px-6 py-4">Customer</th>
                                            <th className="px-6 py-4">Phone</th>
                                            <th className="px-6 py-4 text-center">Loyalty Points</th>
                                            <th className="px-6 py-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-white/5 text-xs">
                                        {loading ? (
                                            <tr>
                                                <td colSpan="4" className="py-24 text-center text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] animate-pulse">
                                                    Accessing Customer Identity Vaults...
                                                </td>
                                            </tr>
                                        ) : filteredCustomers.length === 0 ? (
                                            <tr>
                                                <td colSpan="4" className="py-24 text-center text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                                    No customer profiles found
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredCustomers.map((cust) => {
                                                return (
                                                    <tr key={cust.phone} className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors">
                                                        <td className="px-6 py-4 font-bold text-slate-800 dark:text-white uppercase text-[12px]">{cust.name || "Guest"}</td>
                                                        <td className="px-6 py-4 font-bold text-slate-600 dark:text-slate-350">{cust.phone}</td>
                                                        <td className="px-6 py-4 text-center font-black text-amber-500">{cust.points || 0} Pts</td>
                                                        <td className="px-6 py-4 text-right">
                                                            <div className="flex items-center justify-end gap-1.5">
                                                                <button 
                                                                    type="button"
                                                                    onClick={() => {
                                                                        setSelectedCustomer(cust);
                                                                        setHistoryActiveTab("ledger");
                                                                        setIsHistoryDrawerOpen(true);
                                                                        loadCustomerHistory(cust.phone);
                                                                    }}
                                                                    className="px-3 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 rounded font-black text-[9px] uppercase tracking-wider transition-all"
                                                                >
                                                                    History
                                                                </button>
                                                                <button 
                                                                    type="button"
                                                                    onClick={() => {
                                                                        setSelectedCustomer(cust);
                                                                        setPointsAmount("");
                                                                        setPointsReason("");
                                                                        setPointsType("ADD");
                                                                        setIsAdjustPointsModalOpen(true);
                                                                    }}
                                                                    className="px-4 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded font-black text-[9px] uppercase tracking-wider transition-all"
                                                                >
                                                                    Adjust
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        )}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {isAddModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsAddModalOpen(false)} />
                    <div className="relative w-full max-w-lg bg-white dark:bg-[#1e2129] border border-slate-200 dark:border-white/5 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-250">
                        {/* Modal Header */}
                        <div className="px-6 py-4 bg-slate-50 dark:bg-black/20 border-b border-slate-200 dark:border-white/5 flex items-center justify-between">
                            <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-2">
                                <Users className="w-4 h-4 text-emerald-500" /> Register Guest Account
                            </h3>
                            <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        {/* Modal Body */}
                        <form onSubmit={handleAddCustomer} className="p-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Guest Name *</label>
                                    <input 
                                        type="text" 
                                        value={addName}
                                        onChange={e => setAddName(e.target.value)}
                                        className="w-full h-10 px-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-lg text-xs font-bold outline-none focus:border-emerald-600 text-slate-850 dark:text-white" 
                                        placeholder="e.g. John Doe"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Customer Number (Phone) *</label>
                                    <input 
                                        type="text" 
                                        value={addPhone}
                                        onChange={e => setAddPhone(e.target.value)}
                                        className="w-full h-10 px-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-lg text-xs font-bold outline-none focus:border-emerald-600 text-slate-850 dark:text-white" 
                                        placeholder="e.g. 919876543210"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Guest Address</label>
                                <textarea 
                                    value={addAddress}
                                    onChange={e => setAddAddress(e.target.value)}
                                    className="w-full px-3 py-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-lg text-xs font-bold outline-none focus:border-emerald-600 text-slate-850 dark:text-white resize-none" 
                                    placeholder="e.g. 123 Main St, Apartment 4B"
                                    rows="2"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-100 dark:border-white/5 pt-4">
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Initial Points</label>
                                    <input 
                                        type="number" 
                                        value={addPoints}
                                        onChange={e => setAddPoints(e.target.value)}
                                        className="w-full h-10 px-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-lg text-xs font-bold outline-none focus:border-emerald-600 text-slate-850 dark:text-white" 
                                        placeholder="0"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Initial Prepayment Balance ({currencySymbol})</label>
                                    <input 
                                        type="number" 
                                        step="0.01"
                                        value={addBalance}
                                        onChange={e => setAddBalance(e.target.value)}
                                        className="w-full h-10 px-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-lg text-xs font-bold outline-none focus:border-emerald-600 text-slate-850 dark:text-white" 
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>

                            <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 dark:border-white/5">
                                <button 
                                    type="button" 
                                    onClick={() => setIsAddModalOpen(false)}
                                    className="px-4 py-2.5 border border-slate-200 dark:border-white/5 text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-white/5 rounded-lg transition-all"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-705 text-white rounded-lg text-[10px] font-black uppercase tracking-widest transition-all shadow-md shadow-emerald-600/10"
                                >
                                    Confirm Account
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ======================================================== */}
            {/* 📝 EDIT DETAILS MODAL */}
            {/* ======================================================== */}
            {isEditModalOpen && selectedCustomer && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsEditModalOpen(false)} />
                    <div className="relative w-full max-w-md bg-white dark:bg-[#1e2129] border border-slate-200 dark:border-white/5 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-250">
                        <div className="px-6 py-4 bg-slate-50 dark:bg-black/20 border-b border-slate-200 dark:border-white/5 flex items-center justify-between">
                            <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-2">
                                <Edit3 className="w-4 h-4 text-blue-500" /> Edit Guest Profile: {selectedCustomer.phone}
                            </h3>
                            <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleEditCustomer} className="p-6 space-y-4">
                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Guest Name *</label>
                                <input 
                                    type="text" 
                                    value={editName}
                                    onChange={e => setEditName(e.target.value)}
                                    className="w-full h-10 px-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-lg text-xs font-bold outline-none focus:border-emerald-600 text-slate-850 dark:text-white" 
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Address Details</label>
                                <textarea 
                                    value={editAddress}
                                    onChange={e => setEditAddress(e.target.value)}
                                    className="w-full px-3 py-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-lg text-xs font-bold outline-none focus:border-emerald-600 text-slate-850 dark:text-white resize-none" 
                                    rows="3"
                                />
                            </div>
                            <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 dark:border-white/5">
                                <button 
                                    type="button" 
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="px-4 py-2.5 border border-slate-200 dark:border-white/5 text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-white/5 rounded-lg transition-all"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[10px] font-black uppercase tracking-widest transition-all shadow-md shadow-blue-600/10"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ======================================================== */}
            {/* ⚠️ DELETE CONFIRMATION MODAL */}
            {/* ======================================================== */}
            {isDeleteModalOpen && selectedCustomer && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsDeleteModalOpen(false)} />
                    <div className="relative w-full max-w-sm bg-white dark:bg-[#1e2129] border border-slate-200 dark:border-white/5 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-250">
                        <div className="p-6 text-center space-y-4">
                            <div className="w-14 h-14 bg-rose-500/10 rounded-2xl flex items-center justify-center text-rose-500 mx-auto">
                                <ShieldAlert className="w-8 h-8" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider">Wipe Customer Record?</h3>
                                <p className="text-[10px] font-bold text-slate-400 leading-normal">
                                    Are you sure you want to permanently delete <strong>{selectedCustomer.name || selectedCustomer.phone}</strong>? All points, prepayments, wallet transactions, and message logs will be cleanly deleted. This action cannot be undone.
                                </p>
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button 
                                    onClick={() => setIsDeleteModalOpen(false)}
                                    className="flex-1 py-2.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg transition-all"
                                >
                                    Abort
                                </button>
                                <button 
                                    onClick={handleDeleteCustomer}
                                    className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-500 text-white text-[10px] font-black uppercase tracking-widest rounded-lg transition-all shadow-md shadow-rose-600/15"
                                >
                                    Confirm Wipe
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ======================================================== */}
            {/* 🏆 ADJUST POINTS MODAL */}
            {/* ======================================================== */}
            {isAdjustPointsModalOpen && selectedCustomer && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsAdjustPointsModalOpen(false)} />
                    <div className="relative w-full max-w-md bg-white dark:bg-[#1e2129] border border-slate-200 dark:border-white/5 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-250">
                        <div className="px-6 py-4 bg-slate-50 dark:bg-black/20 border-b border-slate-200 dark:border-white/5 flex items-center justify-between">
                            <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-2">
                                <Award className="w-4 h-4 text-amber-500" /> Adjust Points: {selectedCustomer.name}
                            </h3>
                            <button onClick={() => setIsAdjustPointsModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleAdjustPoints} className="p-6 space-y-4">
                            <div className="bg-amber-500/5 border border-amber-500/10 p-3 rounded-xl flex items-center justify-between">
                                <span className="text-[10px] font-black uppercase text-amber-600">Current Balance</span>
                                <span className="text-sm font-black text-amber-500">{selectedCustomer.points || 0} PTS</span>
                            </div>

                            {/* Toggle adjustments */}
                            <div className="flex gap-2 p-1 bg-slate-50 dark:bg-black/20 rounded-lg border border-slate-200/50 dark:border-white/5">
                                <button 
                                    type="button"
                                    onClick={() => setPointsType("ADD")}
                                    className={`flex-1 py-2 text-[10px] font-black uppercase rounded-md transition-all ${pointsType === "ADD" ? "bg-emerald-600 text-white" : "text-slate-400 hover:text-slate-600 dark:hover:text-white"}`}
                                >
                                    Grant points (+)
                                </button>
                                <button 
                                    type="button"
                                    onClick={() => setPointsType("DEDUCT")}
                                    className={`flex-1 py-2 text-[10px] font-black uppercase rounded-md transition-all ${pointsType === "DEDUCT" ? "bg-rose-600 text-white" : "text-slate-400 hover:text-slate-600 dark:hover:text-white"}`}
                                >
                                    Deduct points (-)
                                </button>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Points Amount</label>
                                <input 
                                    type="number" 
                                    value={pointsAmount}
                                    onChange={e => setPointsAmount(e.target.value)}
                                    className="w-full h-10 px-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-lg text-xs font-bold outline-none focus:border-emerald-600 text-slate-850 dark:text-white" 
                                    placeholder="0"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Compliance Reason *</label>
                                <textarea 
                                    value={pointsReason}
                                    onChange={e => setPointsReason(e.target.value)}
                                    className="w-full px-3 py-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-lg text-xs font-bold outline-none focus:border-emerald-600 text-slate-850 dark:text-white resize-none" 
                                    placeholder="e.g. Campaign adjustment / guest satisfaction compensation"
                                    rows="2"
                                    required
                                />
                            </div>

                            <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 dark:border-white/5">
                                <button 
                                    type="button" 
                                    onClick={() => setIsAdjustPointsModalOpen(false)}
                                    className="px-4 py-2.5 border border-slate-200 dark:border-white/5 text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-white/5 rounded-lg transition-all"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-[10px] font-black uppercase tracking-widest transition-all shadow-md shadow-amber-500/10"
                                >
                                    Confirm Adjustment
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ======================================================== */}
            {/* 💳 ADJUST BALANCE MODAL */}
            {/* ======================================================== */}
            {isAdjustBalanceModalOpen && selectedCustomer && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsAdjustBalanceModalOpen(false)} />
                    <div className="relative w-full max-w-md bg-white dark:bg-[#1e2129] border border-slate-200 dark:border-white/5 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-250">
                        <div className="px-6 py-4 bg-slate-50 dark:bg-black/20 border-b border-slate-200 dark:border-white/5 flex items-center justify-between">
                            <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-2">
                                <Wallet className="w-4 h-4 text-emerald-500" /> Adjust Wallet: {selectedCustomer.name}
                            </h3>
                            <button onClick={() => setIsAdjustBalanceModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleAdjustBalance} className="p-6 space-y-4">
                            <div className="bg-slate-50 dark:bg-black/20 border border-slate-200/50 dark:border-white/5 p-3 rounded-xl flex items-center justify-between text-xs">
                                <span className="font-bold text-slate-400 uppercase tracking-widest">Active Balance</span>
                                <span className={`font-black ${parseFloat(selectedCustomer.balance || 0) < 0 ? "text-rose-500" : "text-emerald-500"}`}>
                                    {parseFloat(selectedCustomer.balance || 0) < 0 ? `Dues: -${currencySymbol}${Math.abs(selectedCustomer.balance).toFixed(2)}` : `Credit: ${currencySymbol}${parseFloat(selectedCustomer.balance || 0).toFixed(2)}`}
                                </span>
                            </div>

                            {/* Toggle additions */}
                            <div className="flex gap-2 p-1 bg-slate-50 dark:bg-black/20 rounded-lg border border-slate-200/50 dark:border-white/5">
                                <button 
                                    type="button"
                                    onClick={() => setBalanceType("ADD")}
                                    className={`flex-1 py-2 text-[10px] font-black uppercase rounded-md transition-all ${balanceType === "ADD" ? "bg-emerald-600 text-white" : "text-slate-400 hover:text-slate-600 dark:hover:text-white"}`}
                                >
                                    Add Funds (+)
                                </button>
                                <button 
                                    type="button"
                                    onClick={() => setBalanceType("DEDUCT")}
                                    className={`flex-1 py-2 text-[10px] font-black uppercase rounded-md transition-all ${balanceType === "DEDUCT" ? "bg-rose-600 text-white" : "text-slate-400 hover:text-slate-600 dark:hover:text-white"}`}
                                >
                                    Deduct Funds (-)
                                </button>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Adjustment Amount ({currencySymbol})</label>
                                <input 
                                    type="number" 
                                    step="0.01"
                                    value={balanceAmount}
                                    onChange={e => setBalanceAmount(e.target.value)}
                                    className="w-full h-10 px-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-lg text-xs font-bold outline-none focus:border-emerald-600 text-slate-850 dark:text-white" 
                                    placeholder="0.00"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Financial Reason *</label>
                                <textarea 
                                    value={balanceReason}
                                    onChange={e => setBalanceReason(e.target.value)}
                                    className="w-full px-3 py-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-lg text-xs font-bold outline-none focus:border-emerald-600 text-slate-850 dark:text-white resize-none" 
                                    placeholder="e.g. Wallet top-up / manual chargeback adjustment"
                                    rows="2"
                                    required
                                />
                            </div>

                            <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 dark:border-white/5">
                                <button 
                                    type="button" 
                                    onClick={() => setIsAdjustBalanceModalOpen(false)}
                                    className="px-4 py-2.5 border border-slate-200 dark:border-white/5 text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-white/5 rounded-lg transition-all"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-black uppercase tracking-widest transition-all shadow-md shadow-emerald-600/10"
                                >
                                    Confirm Adjustment
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ======================================================== */}
            {/* 🪙 PAY OUTSTANDING DUES MODAL */}
            {/* ======================================================== */}
            {isPayDueModalOpen && selectedCustomer && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsPayDueModalOpen(false)} />
                    <div className="relative w-full max-w-md bg-white dark:bg-[#1e2129] border border-slate-200 dark:border-white/5 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-250">
                        <div className="px-6 py-4 bg-slate-50 dark:bg-black/20 border-b border-slate-200 dark:border-white/5 flex items-center justify-between">
                            <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-2">
                                <Coins className="w-4 h-4 text-emerald-500" /> Record Dues Payment: {selectedCustomer.name}
                            </h3>
                            <button onClick={() => setIsPayDueModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handlePayDue} className="p-6 space-y-4">
                            <div className="bg-rose-500/5 border border-rose-500/15 p-3 rounded-xl flex items-center justify-between">
                                <span className="text-[10px] font-black uppercase text-rose-600">Total Outstanding Dues</span>
                                <span className="text-sm font-black text-rose-500">{currencySymbol}{Math.abs(parseFloat(selectedCustomer.balance || 0)).toFixed(2)}</span>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Payment Amount ({currencySymbol})</label>
                                <input 
                                    type="number" 
                                    step="0.01"
                                    value={dueAmount}
                                    onChange={e => setDueAmount(e.target.value)}
                                    className="w-full h-10 px-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-lg text-xs font-bold outline-none focus:border-emerald-600 text-slate-850 dark:text-white" 
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Payment Mode</label>
                                <select 
                                    value={duePaymentMethod}
                                    onChange={e => setDuePaymentMethod(e.target.value)}
                                    className="w-full h-10 px-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-lg text-xs font-bold outline-none focus:border-emerald-600 text-slate-850 dark:text-white"
                                >
                                    <option value="CASH">Cash Payment</option>
                                    <option value="CARD">Debit/Credit Card</option>
                                    <option value="UPI">UPI Transfer</option>
                                    <option value="NETBANKING">Netbanking</option>
                                    <option value="OTHER">Other Method</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Optional Notes / Reference</label>
                                <input 
                                    type="text" 
                                    value={dueReason}
                                    onChange={e => setDueReason(e.target.value)}
                                    className="w-full h-10 px-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-lg text-xs font-bold outline-none focus:border-emerald-600 text-slate-850 dark:text-white" 
                                    placeholder="e.g. Transaction ID / cash received details"
                                />
                            </div>

                            <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 dark:border-white/5">
                                <button 
                                    type="button" 
                                    onClick={() => setIsPayDueModalOpen(false)}
                                    className="px-4 py-2.5 border border-slate-200 dark:border-white/5 text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-white/5 rounded-lg transition-all"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-705 text-white rounded-lg text-[10px] font-black uppercase tracking-widest transition-all shadow-md shadow-emerald-600/10"
                                >
                                    Record Payment
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ======================================================== */}
            {/* 📜 LEDGER & ORDER HISTORY DRAWER */}
            {/* ======================================================== */}
            {isHistoryDrawerOpen && selectedCustomer && (
                <div className="fixed inset-0 z-[100] flex justify-end">
                    <div className="absolute inset-0 bg-black/45 backdrop-blur-sm" onClick={() => setIsHistoryDrawerOpen(false)} />
                    <div className="relative w-full max-w-4xl bg-white dark:bg-[#1e2129] border-l border-slate-200 dark:border-white/5 shadow-2xl h-full flex flex-col animate-in slide-in-from-right duration-300">
                        {/* Drawer Header */}
                        <div className="px-6 py-4 bg-slate-50 dark:bg-black/25 border-b border-slate-200 dark:border-white/5 flex items-center justify-between shrink-0">
                            <div>
                                <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-2">
                                    <History className="w-5 h-5 text-indigo-500" /> Guest Ledger & Orders Timeline
                                </h3>
                                <p className="text-[9.5px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-0.5">
                                    Customer: {selectedCustomer.name} ({selectedCustomer.phone})
                                </p>
                            </div>
                            <button onClick={() => setIsHistoryDrawerOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Tabs Selector */}
                        <div className="flex border-b border-slate-100 dark:border-white/5 px-6 shrink-0 bg-slate-50/50 dark:bg-black/10">
                            <button 
                                onClick={() => setHistoryActiveTab("ledger")}
                                className={`py-3 px-4 text-[10.5px] font-black uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 ${historyActiveTab === "ledger" ? "border-emerald-600 text-emerald-600" : "border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-white"}`}
                            >
                                <Wallet className="w-4 h-4" /> Financial & Points Ledger
                            </button>
                            <button 
                                onClick={() => setHistoryActiveTab("orders")}
                                className={`py-3 px-4 text-[10.5px] font-black uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 ${historyActiveTab === "orders" ? "border-indigo-600 text-indigo-600" : "border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-white"}`}
                            >
                                <ShoppingBag className="w-4 h-4" /> Order Transactions ({historyData.orders?.length || 0})
                            </button>
                        </div>

                        {/* History Tables Viewport */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                            {historyLoading ? (
                                <div className="h-full flex items-center justify-center">
                                    <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.25em] animate-pulse">Decrypting Transactions Ledger...</p>
                                </div>
                            ) : historyActiveTab === "ledger" ? (
                                /* LEDGER VIEW */
                                <div className="space-y-4">
                                    <div className="border border-slate-200 dark:border-white/5 rounded-xl overflow-hidden shadow-sm bg-white dark:bg-transparent">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="bg-slate-50 dark:bg-black/10 border-b border-slate-200 dark:border-white/5 text-[9px] font-black text-slate-400 uppercase tracking-wider">
                                                    <th className="p-4">Date</th>
                                                    <th className="p-4">Event Type</th>
                                                    <th className="p-4 text-center">Wallet Change</th>
                                                    <th className="p-4 text-center">Points Change</th>
                                                    <th className="p-4">Audit Note</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100 dark:divide-white/5 text-xs text-slate-700 dark:text-slate-350">
                                                {(!historyData.transactions || historyData.transactions.length === 0) ? (
                                                    <tr>
                                                        <td colSpan="5" className="p-8 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">No wallet ledger transactions logged</td>
                                                    </tr>
                                                ) : (
                                                    historyData.transactions.map((t) => {
                                                        const amt = parseFloat(t.amount || 0);
                                                        const pts = parseInt(t.points || 0);
                                                        return (
                                                            <tr key={t.id} className="hover:bg-slate-50/40 dark:hover:bg-white/5">
                                                                <td className="p-4 whitespace-nowrap text-[10.5px] font-bold">
                                                                    {new Date(t.created_at).toLocaleString()}
                                                                </td>
                                                                <td className="p-4 whitespace-nowrap">
                                                                    <span className="px-2 py-0.5 border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/5 rounded text-[8.5px] font-black uppercase text-slate-500">
                                                                        {t.type?.replace("_", " ")}
                                                                    </span>
                                                                </td>
                                                                <td className={`p-4 text-center font-bold text-[11px] ${amt > 0 ? "text-emerald-500" : (amt < 0 ? "text-rose-500" : "")}`}>
                                                                    {amt > 0 ? `+${currencySymbol}${amt.toFixed(2)}` : (amt < 0 ? `-${currencySymbol}${Math.abs(amt).toFixed(2)}` : "-")}
                                                                </td>
                                                                <td className={`p-4 text-center font-bold text-[11px] ${pts > 0 ? "text-emerald-500" : (pts < 0 ? "text-rose-500" : "")}`}>
                                                                    {pts > 0 ? `+${pts} PTS` : (pts < 0 ? `-${Math.abs(pts)} PTS` : "-")}
                                                                </td>
                                                                <td className="p-4 font-medium text-slate-500 dark:text-slate-400">
                                                                    {t.reason || "-"}
                                                                </td>
                                                            </tr>
                                                        );
                                                    })
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            ) : (
                                /* ORDERS VIEW */
                                <div className="space-y-4">
                                    {(!historyData.orders || historyData.orders.length === 0) ? (
                                        <div className="border border-dashed border-slate-200 dark:border-slate-800 p-12 text-center rounded-xl opacity-50">
                                            <ShoppingBag className="w-10 h-10 mx-auto text-slate-400 mb-2" />
                                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">No orders logged under this number</p>
                                        </div>
                                    ) : (
                                        historyData.orders.map((order) => {
                                            let itemsList = [];
                                            try {
                                                itemsList = typeof order.items === "string" ? JSON.parse(order.items) : (Array.isArray(order.items) ? order.items : []);
                                            } catch (e) {
                                                console.error("Failed to parse items for order " + order.id, e);
                                            }

                                            return (
                                                <div 
                                                    key={order.id} 
                                                    className="border border-slate-200 dark:border-white/5 rounded-xl p-5 space-y-3 bg-white dark:bg-[#1a1c23] shadow-sm hover:border-indigo-500/30 transition-all duration-300"
                                                >
                                                    {/* Row header */}
                                                    <div className="flex items-center justify-between text-xs border-b border-slate-100 dark:border-white/5 pb-3">
                                                        <div className="flex items-center gap-3">
                                                            <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-500 rounded text-[9px] font-black uppercase">
                                                                {order.bill_no || `REF_${order.id}`}
                                                            </span>
                                                            <span className="text-slate-400 font-bold">{new Date(order.created_at).toLocaleString()}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <span className={`px-2 py-0.5 rounded text-[8.5px] font-black uppercase border ${order.status === "COMPLETED" ? "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-950/20 dark:border-emerald-900/40" : "bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-950/20 dark:border-amber-900/40"}`}>
                                                                {order.status}
                                                            </span>
                                                            <span className={`px-2 py-0.5 rounded text-[8.5px] font-black uppercase border ${order.payment_status === "PAID" ? "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-950/20 dark:border-emerald-900/40" : "bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-950/20 dark:border-rose-900/40"}`}>
                                                                {order.payment_status}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Items summary */}
                                                    <div className="space-y-1.5 pl-1.5 py-1">
                                                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Order Manifest Items</p>
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-bold text-slate-600 dark:text-slate-300">
                                                            {itemsList.map((item, idx) => (
                                                                <div key={idx} className="flex justify-between border-b border-slate-50 dark:border-white/5 py-1 pr-4">
                                                                    <span className="uppercase">{item.name || item.item_name}</span>
                                                                    <span className="text-emerald-500 font-black">x{item.qty || item.quantity}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    {/* Pricing breakdown */}
                                                    <div className="flex flex-wrap items-center justify-between text-xs pt-2 border-t border-slate-100 dark:border-white/5 text-slate-500 dark:text-slate-400 font-bold">
                                                        <div>
                                                            <span>Payment Mode: </span>
                                                            <span className="uppercase text-slate-700 dark:text-slate-300 font-black pl-1">{order.payment_method || "CASH"}</span>
                                                        </div>
                                                        <div className="flex items-center gap-4 text-xs">
                                                            {parseFloat(order.discount_amount || 0) > 0 && (
                                                                <span>Discount: <strong className="text-rose-500">-{currencySymbol}{parseFloat(order.discount_amount).toFixed(2)}</strong></span>
                                                            )}
                                                            <span>Total Bill: <strong className="text-emerald-600 dark:text-emerald-400 text-sm font-black pl-1">{currencySymbol}{parseFloat(order.total_price || 0).toFixed(2)}</strong></span>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomerManagement;
