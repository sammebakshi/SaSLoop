import React, { useState, useEffect } from "react";
import { 
  PackageMinus, Search, RefreshCw, Plus, 
  Trash2, X, AlertTriangle, TrendingDown, DollarSign
} from "lucide-react";
import API_BASE from "../config";

const ManualStockOut = () => {
    const [rawMaterials, setRawMaterials] = useState([]);
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const [form, setForm] = useState({
        raw_item_id: "",
        quantity: 1,
        unit: "Kg",
        reason: "Wastage", // Wastage, Damage, Expired, Internal Consumption
        note: ""
    });

    const getAuthHeaders = () => {
        return {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        };
    };

    const getImpersonateParam = () => {
        const impId = sessionStorage.getItem("impersonate_id");
        return impId && impId !== "global" ? `?target_user_id=${impId}` : "";
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            const q = getImpersonateParam();
            const [rawRes, logRes] = await Promise.all([
                fetch(`${API_BASE}/api/inventory/raw${q}`, { headers: getAuthHeaders() }),
                fetch(`${API_BASE}/api/inventory/logs${q}`, { headers: getAuthHeaders() })
            ]);

            const [rawData, logData] = await Promise.all([
                rawRes.json(), logRes.json()
            ]);

            const rawArr = Array.isArray(rawData) ? rawData : [];
            setRawMaterials(rawArr);
            
            const logArr = Array.isArray(logData) ? logData : [];
            setLogs(logArr.filter(l => l.type !== 'STOCK_IN'));

            if (rawArr.length > 0 && !form.raw_item_id) {
                setForm(prev => ({ 
                    ...prev, 
                    raw_item_id: rawArr[0].id, 
                    unit: rawArr[0].unit || 'Kg' 
                }));
            }
        } catch (e) {
            console.error("Fetch stock out data error:", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleRawItemChange = (itemId) => {
        const rawObj = rawMaterials.find(r => String(r.id) === String(itemId));
        if (rawObj) {
            setForm(prev => ({
                ...prev,
                raw_item_id: rawObj.id,
                unit: rawObj.unit || 'Kg'
            }));
        }
    };

    const handleSaveStockOut = async (e) => {
        e.preventDefault();
        if (!form.raw_item_id) return alert("Please select a Raw Material item.");
        if (parseFloat(form.quantity || 0) <= 0) return alert("Quantity must be greater than zero.");

        setSubmitting(true);
        try {
            const q = getImpersonateParam();
            const res = await fetch(`${API_BASE}/api/inventory/stock-out${q}`, {
                method: "POST",
                headers: getAuthHeaders(),
                body: JSON.stringify(form)
            });

            if (res.ok) {
                setIsModalOpen(false);
                setForm({
                    raw_item_id: rawMaterials[0]?.id || "",
                    quantity: 1,
                    unit: rawMaterials[0]?.unit || "Kg",
                    reason: "Wastage",
                    note: ""
                });
                fetchData();
            } else {
                const err = await res.json();
                alert(`Error: ${err.error || "Failed to log stock deduction"}`);
            }
        } catch (e) {
            console.error("Save stock out error:", e);
            alert("Error submitting stock deduction.");
        } finally {
            setSubmitting(false);
        }
    };

    const filteredLogs = logs.filter(l => 
        (l.item_name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (l.type || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (l.note || "").toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalWastageCost = logs.reduce((sum, l) => sum + parseFloat(l.total_cost || 0), 0);

    return (
        <div className="space-y-4 animate-pro-in pb-10">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-[#1e2129] p-4 rounded-xl border border-slate-100 dark:border-white/5 shadow-sm">
                <div>
                    <h2 className="text-[18px] font-black text-slate-900 dark:text-white uppercase tracking-tight">Stock Out & Wastage Entry</h2>
                    <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-0.5">Record ingredient wastage, damage, spoilage and internal kitchen consumption</p>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={fetchData} className="px-3 py-2 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 text-slate-600 dark:text-slate-300 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                        <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-emerald-500' : ''}`} /> Refresh
                    </button>
                    <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-lg shadow-rose-600/20">
                        <TrendingDown className="w-4 h-4" /> Execute Stock Out
                    </button>
                </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-white dark:bg-[#1e2129] p-4 rounded-xl border border-slate-100 dark:border-white/5 flex items-center justify-between">
                    <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Total Disposal Events</p>
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">{logs.length} <span className="text-[11px] font-bold text-slate-400 font-normal">Records</span></h3>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
                        <PackageMinus className="w-5 h-5" />
                    </div>
                </div>

                <div className="bg-white dark:bg-[#1e2129] p-4 rounded-xl border border-slate-100 dark:border-white/5 flex items-center justify-between">
                    <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Total Wastage Cost Impact</p>
                        <h3 className="text-2xl font-black text-rose-600 dark:text-rose-500 mt-1">₹{totalWastageCost.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</h3>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
                        <DollarSign className="w-5 h-5" />
                    </div>
                </div>
            </div>

            {/* Search */}
            <div className="bg-white dark:bg-[#1e2129] p-3 rounded-xl border border-slate-100 dark:border-white/5 flex items-center gap-3">
                <div className="flex items-center gap-2 bg-slate-50 dark:bg-black/20 border border-slate-100 dark:border-white/5 rounded-lg px-3 py-2 flex-1">
                    <Search className="w-4 h-4 text-slate-400" />
                    <input 
                        type="text" 
                        value={searchQuery} 
                        onChange={(e) => setSearchQuery(e.target.value)} 
                        placeholder="Search stock reduction records by item or reason..." 
                        className="bg-transparent text-[11px] font-bold outline-none w-full text-slate-800 dark:text-white uppercase tracking-tight"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-[#1e2129] rounded-xl border border-slate-100 dark:border-white/5 overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-black/20 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                            <th className="p-3.5">Date & Time</th>
                            <th className="p-3.5">Raw Material</th>
                            <th className="p-3.5">Disposal Reason</th>
                            <th className="p-3.5">Quantity Deducted</th>
                            <th className="p-3.5">Cost Impact</th>
                            <th className="p-3.5">Notes</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-white/5 text-[11px] font-bold text-slate-800 dark:text-slate-200">
                        {loading ? (
                            <tr><td colSpan="6" className="p-12 text-center text-slate-400 animate-pulse">Loading disposal history...</td></tr>
                        ) : filteredLogs.length === 0 ? (
                            <tr><td colSpan="6" className="p-12 text-center text-slate-400">No stock reduction entries recorded yet.</td></tr>
                        ) : filteredLogs.map(log => (
                            <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors">
                                <td className="p-3.5 text-slate-400 font-mono text-[10px]">
                                    {new Date(log.created_at).toLocaleString()}
                                </td>
                                <td className="p-3.5 font-black text-slate-900 dark:text-white uppercase">{log.item_name || `RM-${log.raw_item_id}`}</td>
                                <td className="p-3.5">
                                    <span className="px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-500 text-[9px] font-black uppercase tracking-wider">
                                        {log.type}
                                    </span>
                                </td>
                                <td className="p-3.5 font-black text-rose-500">
                                    -{parseFloat(log.quantity || 0).toLocaleString()} {log.unit || 'Kg'}
                                </td>
                                <td className="p-3.5 font-black text-slate-900 dark:text-white">₹{parseFloat(log.total_cost || 0).toFixed(2)}</td>
                                <td className="p-3.5 text-slate-400 italic">{log.note || 'Internal disposal'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-[#1e2129] border border-slate-100 dark:border-white/10 rounded-2xl w-full max-w-lg p-6 shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-white/5">
                            <h3 className="text-[15px] font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5 text-rose-500" /> Execute Stock Out / Wastage
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="p-1.5 hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg text-slate-400">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSaveStockOut} className="space-y-4 mt-4 text-[11px] font-bold text-slate-700 dark:text-slate-300">
                            <div>
                                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Select Raw Material *</label>
                                <select 
                                    value={form.raw_item_id} 
                                    onChange={(e) => handleRawItemChange(e.target.value)} 
                                    className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2 outline-none text-slate-900 dark:text-white uppercase font-bold cursor-pointer"
                                >
                                    {rawMaterials.map(rm => (
                                        <option key={rm.id} value={rm.id}>{rm.item_name} (Current Stock: {rm.current_stock || 0} {rm.unit})</option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Deduction Quantity *</label>
                                    <input 
                                        type="number" 
                                        step="0.001"
                                        required
                                        value={form.quantity} 
                                        onChange={(e) => setForm({ ...form, quantity: parseFloat(e.target.value || 0) })} 
                                        className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2 outline-none text-slate-900 dark:text-white font-bold"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Disposal Reason *</label>
                                    <select 
                                        value={form.reason} 
                                        onChange={(e) => setForm({ ...form, reason: e.target.value })} 
                                        className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2 outline-none text-slate-900 dark:text-white uppercase font-bold cursor-pointer"
                                    >
                                        <option value="Wastage">Spoilage / Wastage</option>
                                        <option value="Damage">Damaged in Transit / Kitchen</option>
                                        <option value="Expired">Expired Ingredient</option>
                                        <option value="Internal Consumption">Internal Staff Consumption</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Note / Remark</label>
                                <input 
                                    type="text" 
                                    value={form.note} 
                                    onChange={(e) => setForm({ ...form, note: e.target.value })} 
                                    placeholder="e.g. Milk turned sour, Box dropped"
                                    className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2 outline-none text-slate-900 dark:text-white font-bold"
                                />
                            </div>

                            <div className="pt-4 border-t border-slate-100 dark:border-white/5 flex gap-3">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2.5 bg-slate-100 dark:bg-white/5 text-slate-500 rounded-xl text-[10px] font-bold uppercase tracking-widest">
                                    Cancel
                                </button>
                                <button type="submit" disabled={submitting} className="flex-[2] py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-rose-600/20">
                                    {submitting ? "Submitting..." : "Confirm Stock Deduction"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManualStockOut;
