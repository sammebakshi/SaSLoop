import React, { useState, useEffect, useMemo } from "react";
import { 
  Calendar, Clock, User, Phone, 
  CheckCircle2, AlertCircle, RefreshCw, 
  Plus, Search, Filter, History, Trash2, MapPin, FileText, Check
} from "lucide-react";
import API_BASE from "../config";

const Reservations = () => {
    const [preOrders, setPreOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [actionLoading, setActionLoading] = useState(false);
    const [toastMsg, setToastMsg] = useState(null);

    const showToast = (type, text) => {
        setToastMsg({ type, text });
        setTimeout(() => setToastMsg(null), 4000);
    };

    const fetchPreOrders = async () => {
        setLoading(true);
        try {
            const impersonateId = sessionStorage.getItem("impersonate_id");
            const targetParam = impersonateId ? `?target_user_id=${impersonateId}` : "";
            const headers = { "Authorization": `Bearer ${localStorage.getItem("token")}` };

            const res = await fetch(`${API_BASE}/api/pre-orders${targetParam}`, { headers });
            if (res.ok) {
                const data = await res.json();
                setPreOrders(Array.isArray(data) ? data : []);
            } else {
                showToast("error", "Failed to fetch pre-orders from server");
            }
        } catch (e) {
            console.error("Error fetching pre-orders:", e);
            showToast("error", "Network error synchronizing pre-orders");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPreOrders();
    }, []);

    // Update pre-order status (e.g. SCHEDULED -> COMPLETED)
    const handleUpdateStatus = async (id, newStatus) => {
        setActionLoading(true);
        try {
            const impersonateId = sessionStorage.getItem("impersonate_id");
            const targetParam = impersonateId ? `?target_user_id=${impersonateId}` : "";
            const headers = { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}` 
            };

            const res = await fetch(`${API_BASE}/api/pre-orders/${id}/status`, {
                method: 'PUT',
                headers,
                body: JSON.stringify({ status: newStatus })
            });

            if (res.ok) {
                showToast("success", `Pre-order status updated to ${newStatus}`);
                fetchPreOrders();
            } else {
                showToast("error", "Failed to update status");
            }
        } catch (e) {
            console.error(e);
            showToast("error", "Network error updating pre-order");
        } finally {
            setActionLoading(false);
        }
    };

    // Delete pre-order
    const handleDeletePreOrder = async (id) => {
        if (!window.confirm("Are you sure you want to delete this pre-order?")) return;
        setActionLoading(true);
        try {
            const headers = { "Authorization": `Bearer ${localStorage.getItem("token")}` };
            const res = await fetch(`${API_BASE}/api/pre-orders/${id}`, {
                method: 'DELETE',
                headers
            });

            if (res.ok) {
                showToast("success", "Pre-order deleted successfully");
                fetchPreOrders();
            } else {
                showToast("error", "Failed to delete pre-order");
            }
        } catch (e) {
            console.error(e);
            showToast("error", "Network error deleting pre-order");
        } finally {
            setActionLoading(false);
        }
    };

    // Filter and search pre-orders
    const filteredPreOrders = useMemo(() => {
        return preOrders.filter(po => {
            // Status filter
            if (statusFilter !== "ALL" && po.status !== statusFilter) return false;

            // Search query
            const query = searchQuery.trim().toLowerCase();
            if (!query) return true;

            return (
                (po.customer_name || "").toLowerCase().includes(query) ||
                (po.customer_number || "").includes(query) ||
                (po.customer_address || "").toLowerCase().includes(query) ||
                (po.table_number || "").toLowerCase().includes(query) ||
                (po.notes || "").toLowerCase().includes(query)
            );
        });
    }, [preOrders, statusFilter, searchQuery]);

    // Categorized pre-orders
    const pendingPreOrders = useMemo(() => {
        return filteredPreOrders.filter(po => po.status === "SCHEDULED");
    }, [filteredPreOrders]);

    const completedPreOrders = useMemo(() => {
        return filteredPreOrders.filter(po => po.status === "COMPLETED" || po.status === "DELIVERED");
    }, [filteredPreOrders]);

    return (
        <div className="space-y-6 animate-pro-in font-sans text-slate-800 dark:text-slate-100">
            {/* Status Toast */}
            {toastMsg && (
                <div className={`fixed top-6 right-6 z-[1000] px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 border text-xs font-bold uppercase tracking-wider animate-in slide-in-from-top duration-300 ${
                    toastMsg.type === "success" 
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/50" 
                        : "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-900/50"
                }`}>
                    {toastMsg.type === "success" ? <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> : <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />}
                    {toastMsg.text}
                </div>
            )}

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between bg-white dark:bg-[#161b22] p-4 rounded-2xl border border-slate-200 dark:border-[#30363d] shadow-sm gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-emerald-55 dark:bg-emerald-500/10 rounded-xl text-emerald-600 dark:text-emerald-400">
                        <Calendar className="w-6 h-6" />
                    </div>
                    <div className="space-y-0.5">
                        <h2 className="text-lg font-black uppercase italic tracking-tighter text-slate-900 dark:text-white">Pre-Orders & Reservations</h2>
                        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-0.5">Backoffice Management of scheduled bookings and advance payments</p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                    {/* Search bar */}
                    <div className="relative min-w-[200px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                        <input 
                            type="text" 
                            placeholder="SEARCH NAME, PHONE, NOTES..." 
                            className="bg-slate-50 dark:bg-[#0d1117] border border-slate-200 dark:border-[#30363d] rounded-xl pl-9 pr-4 py-2 text-[10px] font-black uppercase outline-none focus:border-emerald-600 dark:focus:border-emerald-600 transition-all text-slate-800 dark:text-white placeholder-slate-400 tracking-wider w-full"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {/* Filter tabs */}
                    <div className="flex bg-slate-100 dark:bg-[#0d1117] p-1 rounded-xl border border-slate-200 dark:border-[#30363d]">
                        {[
                            { id: 'ALL', label: 'All' },
                            { id: 'SCHEDULED', label: 'Scheduled' },
                            { id: 'COMPLETED', label: 'Completed' }
                        ].map(tab => (
                            <button 
                                key={tab.id} 
                                onClick={() => setStatusFilter(tab.id)}
                                className={`px-4 py-1.5 text-[9px] font-black rounded-lg uppercase tracking-wider transition-all ${
                                    statusFilter === tab.id 
                                        ? 'bg-white dark:bg-[#161b22] shadow-sm text-slate-900 dark:text-white' 
                                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <button 
                        onClick={fetchPreOrders} 
                        className="p-2.5 bg-slate-50 dark:bg-[#161b22] hover:bg-slate-100 dark:hover:bg-[#21262d] border border-slate-200 dark:border-[#30363d] text-slate-650 dark:text-slate-350 rounded-xl transition-all"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                </div>
            </div>

            {/* Main viewports */}
            {loading ? (
                <div className="py-24 text-center text-[10px] font-black text-slate-450 uppercase tracking-[0.2em] animate-pulse">
                    Synchronizing Pre-Orders...
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Pending/Scheduled Card */}
                    <div className="bg-white dark:bg-[#161b22] border border-slate-200 dark:border-[#30363d] rounded-2xl p-5 shadow-sm flex flex-col min-h-[400px]">
                        <div className="p-3 border-b border-slate-100 dark:border-[#30363d] flex items-center justify-between mb-4">
                            <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 text-amber-500" /> Scheduled Orders
                            </h3>
                            <span className="text-[9px] font-black px-2 py-0.5 rounded bg-amber-500/10 text-amber-600">{pendingPreOrders.length} ACTIVE</span>
                        </div>

                        {pendingPreOrders.length === 0 ? (
                            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center opacity-40">
                                <Clock className="w-8 h-8 text-slate-300 mb-3" />
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No scheduled pre-orders</p>
                            </div>
                        ) : (
                            <div className="space-y-3 overflow-y-auto max-h-[600px] pr-1">
                                {pendingPreOrders.map(po => (
                                    <PreOrderCard 
                                        key={po.id} 
                                        po={po} 
                                        onUpdateStatus={handleUpdateStatus} 
                                        onDelete={handleDeletePreOrder}
                                        actionLoading={actionLoading}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Completed/Fulfilled Card */}
                    <div className="bg-white dark:bg-[#161b22] border border-slate-200 dark:border-[#30363d] rounded-2xl p-5 shadow-sm flex flex-col min-h-[400px]">
                        <div className="p-3 border-b border-slate-100 dark:border-[#30363d] flex items-center justify-between mb-4">
                            <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Completed Orders
                            </h3>
                            <span className="text-[9px] font-black px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600">{completedPreOrders.length} FULFILLED</span>
                        </div>

                        {completedPreOrders.length === 0 ? (
                            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center opacity-40">
                                <CheckCircle2 className="w-8 h-8 text-slate-300 mb-3" />
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No completed pre-orders</p>
                            </div>
                        ) : (
                            <div className="space-y-3 overflow-y-auto max-h-[600px] pr-1">
                                {completedPreOrders.map(po => (
                                    <PreOrderCard 
                                        key={po.id} 
                                        po={po} 
                                        onUpdateStatus={handleUpdateStatus} 
                                        onDelete={handleDeletePreOrder}
                                        actionLoading={actionLoading}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

const PreOrderCard = ({ po, onUpdateStatus, onDelete, actionLoading }) => {
    const itemsList = React.useMemo(() => {
        try {
            return Array.isArray(po.items) ? po.items : JSON.parse(po.items || "[]");
        } catch (e) {
            return [];
        }
    }, [po.items]);

    const formattedDate = React.useMemo(() => {
        if (!po.scheduled_date) return "N/A";
        const dateStr = po.scheduled_date.split('T')[0];
        return new Date(dateStr + 'T00:00').toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    }, [po.scheduled_date]);

    return (
        <div className="p-4 rounded-xl border border-slate-150 dark:border-[#30363d] bg-slate-50/50 dark:bg-black/10 hover:border-slate-300 dark:hover:border-slate-700 transition-all space-y-3 text-[10px] font-bold">
            {/* Header info */}
            <div className="flex justify-between items-start gap-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <span className="text-[12px] font-black text-slate-900 dark:text-white uppercase tracking-tight">{po.customer_name}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider ${
                            po.order_type === 'DINE_IN' ? 'bg-emerald-500/10 text-emerald-600' :
                            po.order_type === 'DELIVERY' ? 'bg-blue-500/10 text-blue-600' : 'bg-amber-500/10 text-amber-600'
                        }`}>
                            {po.order_type}
                        </span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
                        {po.customer_number && (
                            <span className="flex items-center gap-1">
                                <Phone size={11} className="text-slate-400" /> {po.customer_number}
                            </span>
                        )}
                        {po.table_number && (
                            <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-[8.5px]">
                                Table {po.table_number}
                            </span>
                        )}
                    </div>
                </div>
                <div className="text-right">
                    <span className="text-[13px] font-black text-slate-900 dark:text-white">Rs {parseFloat(po.total_price || 0).toFixed(2)}</span>
                    <div className="text-[8px] uppercase tracking-wider text-slate-400 mt-1">Total value</div>
                </div>
            </div>

            {/* Address */}
            {po.customer_address && (
                <div className="flex items-start gap-1.5 p-2 rounded bg-slate-100/50 dark:bg-white/5 text-slate-500 dark:text-slate-450 leading-relaxed font-medium">
                    <MapPin size={12} className="shrink-0 mt-0.5 text-slate-400" />
                    <span>{po.customer_address}</span>
                </div>
            )}

            {/* Scheduled Date/Time Banner */}
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-emerald-500/5 border border-emerald-500/10 text-emerald-650 dark:text-emerald-400">
                <div className="flex items-center gap-2">
                    <Calendar size={13} />
                    <span className="uppercase tracking-wider">{formattedDate}</span>
                </div>
                <div className="flex items-center gap-2 font-black">
                    <Clock size={13} />
                    <span>{po.scheduled_time}</span>
                </div>
            </div>

            {/* Item counts / items */}
            <div className="space-y-1.5 border-t border-b border-slate-150 dark:border-[#30363d] py-2">
                <div className="text-[8.5px] font-black uppercase text-slate-400 tracking-wider mb-1">Items list ({itemsList.length})</div>
                <div className="space-y-1">
                    {itemsList.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center text-slate-600 dark:text-slate-350">
                            <span className="font-semibold">{item.product_name || item.name} <span className="text-slate-400 font-bold">x{item.quantity || item.qty || 1}</span></span>
                            <span>Rs {((parseFloat(item.price) || 0) * parseInt(item.quantity || item.qty || 1)).toFixed(2)}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Notes */}
            {po.notes && (
                <div className="flex items-start gap-1.5 p-2 rounded bg-amber-500/5 border border-amber-500/10 text-amber-600 dark:text-amber-400 leading-relaxed font-semibold">
                    <FileText size={12} className="shrink-0 mt-0.5 text-amber-500" />
                    <span>Notes: {po.notes}</span>
                </div>
            )}

            {/* Totals & Payments */}
            <div className="grid grid-cols-3 gap-2 text-center text-[9px] uppercase tracking-wider py-1 font-black">
                <div className="p-2 rounded bg-slate-100 dark:bg-white/5">
                    <div className="text-slate-400 mb-0.5">Total Price</div>
                    <div className="text-slate-800 dark:text-slate-200">Rs {parseFloat(po.total_price).toFixed(1)}</div>
                </div>
                <div className="p-2 rounded bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 border border-emerald-500/10">
                    <div className="text-emerald-500/60 mb-0.5">Advance Paid</div>
                    <div className="font-black">Rs {parseFloat(po.advance_paid || 0).toFixed(1)}</div>
                </div>
                <div className="p-2 rounded bg-amber-500/5 text-amber-600 dark:text-amber-400 border border-amber-500/10">
                    <div className="text-amber-500/60 mb-0.5">Balance Due</div>
                    <div className="font-black">Rs {parseFloat(po.balance_due || 0).toFixed(1)}</div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 justify-end pt-1">
                {po.status === 'SCHEDULED' ? (
                    <button 
                        onClick={() => onUpdateStatus(po.id, 'COMPLETED')}
                        disabled={actionLoading}
                        className="h-7 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg flex items-center gap-1 transition-all"
                    >
                        <Check size={11} /> Fulfill
                    </button>
                ) : (
                    <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/50 rounded-lg text-[8px] font-black uppercase tracking-wider">
                        FULFILLED
                    </span>
                )}
                <button 
                    onClick={() => onDelete(po.id)}
                    disabled={actionLoading}
                    className="w-7 h-7 bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white border border-rose-500/20 rounded-lg flex items-center justify-center transition-all"
                    title="Delete pre-order"
                >
                    <Trash2 size={12} />
                </button>
            </div>
        </div>
    );
};

export default Reservations;
