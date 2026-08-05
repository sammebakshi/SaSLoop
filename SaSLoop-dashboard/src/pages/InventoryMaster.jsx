import React, { useState, useEffect } from "react";
import { 
  Package, Box, Search, RefreshCw, AlertTriangle, 
  DollarSign, Plus, History, ArrowDownRight, ArrowUpRight,
  TrendingDown, ShieldCheck, Check, Layers, Settings, X, Save,
  Monitor, Globe, MessageSquare
} from "lucide-react";
import { Link } from "react-router-dom";
import API_BASE from "../config";

const InventoryMaster = () => {
    const [summary, setSummary] = useState({ total_items: 0, low_stock_count: 0, total_valuation: 0, log_count: 0 });
    const [rawMaterials, setRawMaterials] = useState([]);
    const [inventoryLogs, setInventoryLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("RAW"); // RAW, LOGS
    const [searchQuery, setSearchQuery] = useState("");

    // Settings Modal State
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [savingSettings, setSavingSettings] = useState(false);
    const [inventorySettings, setInventorySettings] = useState({
        track_inventory: true,
        track_inventory_pos: true,
        track_inventory_online: true,
        track_inventory_whatsapp: true
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
            const [sumRes, rawRes, logRes, setRes] = await Promise.all([
                fetch(`${API_BASE}/api/inventory/summary${q}`, { headers: getAuthHeaders() }),
                fetch(`${API_BASE}/api/inventory/raw${q}`, { headers: getAuthHeaders() }),
                fetch(`${API_BASE}/api/inventory/logs${q}`, { headers: getAuthHeaders() }),
                fetch(`${API_BASE}/api/inventory/settings${q}`, { headers: getAuthHeaders() })
            ]);

            const [sumData, rawData, logData, setData] = await Promise.all([
                sumRes.json(), rawRes.json(), logRes.json(), setRes.json()
            ]);

            setSummary(sumData || { total_items: 0, low_stock_count: 0, total_valuation: 0, log_count: 0 });
            setRawMaterials(Array.isArray(rawData) ? rawData : []);
            setInventoryLogs(Array.isArray(logData) ? logData : []);
            if (setData && setData.track_inventory !== undefined) {
                setInventorySettings(setData);
            }
        } catch (e) {
            console.error("Failed to load inventory overview:", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSaveSettings = async (e) => {
        e.preventDefault();
        setSavingSettings(true);
        try {
            const q = getImpersonateParam();
            const res = await fetch(`${API_BASE}/api/inventory/settings${q}`, {
                method: "POST",
                headers: getAuthHeaders(),
                body: JSON.stringify(inventorySettings)
            });

            if (res.ok) {
                const updated = await res.json();
                setInventorySettings(updated);
                setIsSettingsOpen(false);
                alert("Inventory tracking rules saved successfully!");
            } else {
                alert("Failed to save settings");
            }
        } catch (e) {
            console.error("Save settings error:", e);
            alert("Error saving settings.");
        } finally {
            setSavingSettings(false);
        }
    };

    const filteredRaw = rawMaterials.filter(r => 
        (r.item_name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (r.category || "").toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredLogs = inventoryLogs.filter(l => 
        (l.item_name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (l.type || "").toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-4 animate-pro-in pb-10">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-[#1e2129] p-4 rounded-xl border border-slate-100 dark:border-white/5 shadow-sm">
                <div>
                    <h2 className="text-[18px] font-black text-slate-900 dark:text-white uppercase tracking-tight">Live Inventory Stock Vault</h2>
                    <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-0.5">Control center for stock reserves, valuation, alerts and stock movements</p>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={() => setIsSettingsOpen(true)} className="px-3 py-2 bg-indigo-50 dark:bg-indigo-500/10 hover:bg-indigo-100 text-indigo-600 dark:text-indigo-400 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 border border-indigo-200 dark:border-indigo-500/20">
                        <Settings className="w-3.5 h-3.5" /> Channel Rules
                    </button>
                    <button onClick={fetchData} className="px-3 py-2 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 text-slate-600 dark:text-slate-300 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                        <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-emerald-500' : ''}`} /> Refresh
                    </button>
                    <Link to="/inventory/manual-stock-entry" className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[10px] font-black uppercase tracking-wider shadow-lg shadow-emerald-600/20 flex items-center gap-1.5">
                        <Plus className="w-3.5 h-3.5" /> Stock In Entry
                    </Link>
                    <Link to="/inventory/manual-stock-out" className="px-3.5 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-[10px] font-black uppercase tracking-wider shadow-lg shadow-rose-600/20 flex items-center gap-1.5">
                        <TrendingDown className="w-3.5 h-3.5" /> Wastage Entry
                    </Link>
                </div>
            </div>

            {/* Overview Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div className="bg-white dark:bg-[#1e2129] p-4 rounded-xl border border-slate-100 dark:border-white/5 flex items-center justify-between">
                    <div>
                        <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Total Raw Materials</p>
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mt-1">{summary.total_items}</h3>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                        <Box className="w-5 h-5" />
                    </div>
                </div>

                <div className="bg-white dark:bg-[#1e2129] p-4 rounded-xl border border-slate-100 dark:border-white/5 flex items-center justify-between">
                    <div>
                        <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Net Stock Valuation</p>
                        <h3 className="text-2xl font-black text-emerald-600 dark:text-emerald-500 tracking-tight mt-1">₹{summary.total_valuation.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</h3>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                        <DollarSign className="w-5 h-5" />
                    </div>
                </div>

                <div className="bg-white dark:bg-[#1e2129] p-4 rounded-xl border border-slate-100 dark:border-white/5 flex items-center justify-between">
                    <div>
                        <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Low Stock Alerts</p>
                        <h3 className={`text-2xl font-black tracking-tight mt-1 ${summary.low_stock_count > 0 ? 'text-rose-500' : 'text-slate-900 dark:text-white'}`}>{summary.low_stock_count}</h3>
                    </div>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${summary.low_stock_count > 0 ? 'bg-rose-500/10 text-rose-500' : 'bg-slate-100 text-slate-400'}`}>
                        <AlertTriangle className="w-5 h-5" />
                    </div>
                </div>

                <div className="bg-white dark:bg-[#1e2129] p-4 rounded-xl border border-slate-100 dark:border-white/5 flex items-center justify-between">
                    <div>
                        <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Stock Movement Logs</p>
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mt-1">{summary.log_count}</h3>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-400 flex items-center justify-center">
                        <History className="w-5 h-5" />
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-2 bg-white dark:bg-[#1e2129] p-1.5 rounded-xl border border-slate-100 dark:border-white/5">
                <button 
                    onClick={() => setActiveTab("RAW")} 
                    className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${activeTab === "RAW" ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-white/5'}`}
                >
                    <Box className="w-4 h-4" /> Live Stock Reserve ({rawMaterials.length})
                </button>
                <button 
                    onClick={() => setActiveTab("LOGS")} 
                    className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${activeTab === "LOGS" ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-white/5'}`}
                >
                    <History className="w-4 h-4" /> Stock Movement Logs ({inventoryLogs.length})
                </button>
            </div>

            {/* Search */}
            <div className="bg-white dark:bg-[#1e2129] p-3 rounded-xl border border-slate-100 dark:border-white/5 flex items-center gap-3">
                <div className="flex items-center gap-2 bg-slate-50 dark:bg-black/20 border border-slate-100 dark:border-white/5 rounded-lg px-3 py-2 flex-1">
                    <Search className="w-4 h-4 text-slate-400" />
                    <input 
                        type="text" 
                        value={searchQuery} 
                        onChange={(e) => setSearchQuery(e.target.value)} 
                        placeholder={activeTab === "RAW" ? "Search stock vault materials..." : "Search stock movement logs..."} 
                        className="bg-transparent text-[11px] font-bold outline-none w-full text-slate-800 dark:text-white uppercase tracking-tight"
                    />
                </div>
            </div>

            {/* Content Table */}
            <div className="bg-white dark:bg-[#1e2129] rounded-xl border border-slate-100 dark:border-white/5 overflow-hidden shadow-sm">
                {activeTab === "RAW" ? (
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-black/20 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                                <th className="p-3.5">Material</th>
                                <th className="p-3.5">Category</th>
                                <th className="p-3.5">Current Stock</th>
                                <th className="p-3.5">Min Stock</th>
                                <th className="p-3.5">Unit Price</th>
                                <th className="p-3.5">Stock Valuation</th>
                                <th className="p-3.5">Health</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-white/5 text-[11px] font-bold text-slate-800 dark:text-slate-200">
                            {loading ? (
                                <tr><td colSpan="7" className="p-12 text-center text-slate-400 animate-pulse">Loading stock vault...</td></tr>
                            ) : filteredRaw.length === 0 ? (
                                <tr><td colSpan="7" className="p-12 text-center text-slate-400">No inventory materials found.</td></tr>
                            ) : filteredRaw.map(item => {
                                const isLow = parseFloat(item.current_stock || 0) <= parseFloat(item.min_stock || 0);
                                const cost = parseFloat(item.unit_cost || item.last_purchase_price || 0);
                                const val = parseFloat(item.current_stock || 0) * cost;

                                return (
                                    <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors">
                                        <td className="p-3.5 font-black text-slate-900 dark:text-white uppercase tracking-tight">{item.item_name}</td>
                                        <td className="p-3.5 text-slate-500">{item.category_name || item.category || 'General'}</td>
                                        <td className="p-3.5 font-black">
                                            {parseFloat(item.current_stock || 0).toLocaleString()} <span className="text-[10px] font-bold text-slate-400">{item.unit || 'Kg'}</span>
                                        </td>
                                        <td className="p-3.5 text-slate-400">{item.min_stock || 0} {item.unit}</td>
                                        <td className="p-3.5">₹{cost.toFixed(2)}</td>
                                        <td className="p-3.5 font-black text-emerald-600 dark:text-emerald-500">₹{val.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</td>
                                        <td className="p-3.5">
                                            <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${isLow ? 'bg-rose-500/10 text-rose-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                                                {isLow ? 'Low Stock' : 'Healthy'}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                ) : (
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-black/20 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                                <th className="p-3.5">Date & Time</th>
                                <th className="p-3.5">Material</th>
                                <th className="p-3.5">Movement Type</th>
                                <th className="p-3.5">Quantity</th>
                                <th className="p-3.5">Total Cost</th>
                                <th className="p-3.5">Vendor / Ref</th>
                                <th className="p-3.5">Notes</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-white/5 text-[11px] font-bold text-slate-800 dark:text-slate-200">
                            {loading ? (
                                <tr><td colSpan="7" className="p-12 text-center text-slate-400 animate-pulse">Loading stock movement logs...</td></tr>
                            ) : filteredLogs.length === 0 ? (
                                <tr><td colSpan="7" className="p-12 text-center text-slate-400">No stock movement logs recorded yet.</td></tr>
                            ) : filteredLogs.map(log => {
                                const isIn = log.type === 'STOCK_IN';

                                return (
                                    <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors">
                                        <td className="p-3.5 text-slate-400 font-mono text-[10px]">
                                            {new Date(log.created_at).toLocaleString()}
                                        </td>
                                        <td className="p-3.5 font-black text-slate-900 dark:text-white uppercase">{log.item_name || `RM-${log.raw_item_id}`}</td>
                                        <td className="p-3.5">
                                            <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider flex items-center gap-1 w-fit ${isIn ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                                                {isIn ? <ArrowDownRight className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3" />}
                                                {log.type}
                                            </span>
                                        </td>
                                        <td className="p-3.5 font-black">
                                            {isIn ? '+' : '-'}{parseFloat(log.quantity || 0).toLocaleString()} {log.unit || 'Kg'}
                                        </td>
                                        <td className="p-3.5">₹{parseFloat(log.total_cost || 0).toFixed(2)}</td>
                                        <td className="p-3.5 text-slate-500">{log.vendor_name || log.reference_no || 'N/A'}</td>
                                        <td className="p-3.5 text-slate-400 italic">{log.note || 'Internal movement'}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Settings Modal */}
            {isSettingsOpen && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-[#1e2129] border border-slate-100 dark:border-white/10 rounded-2xl w-full max-w-lg p-6 shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-white/5">
                            <h3 className="text-[15px] font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-2">
                                <Settings className="w-5 h-5 text-indigo-500" /> Channel Inventory Tracking Rules
                            </h3>
                            <button onClick={() => setIsSettingsOpen(false)} className="p-1.5 hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg text-slate-400">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSaveSettings} className="space-y-4 mt-4 text-[11px] font-bold text-slate-700 dark:text-slate-300">
                            {/* Master Toggle */}
                            <div className="p-3.5 bg-slate-50 dark:bg-black/30 rounded-xl border border-slate-200 dark:border-white/5 flex items-center justify-between">
                                <div>
                                    <h4 className="font-black text-slate-900 dark:text-white uppercase text-[12px]">Master Inventory Tracking</h4>
                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Enable or disable stock tracking across the entire business</p>
                                </div>
                                <input 
                                    type="checkbox"
                                    checked={inventorySettings.track_inventory}
                                    onChange={(e) => setInventorySettings({ ...inventorySettings, track_inventory: e.target.checked })}
                                    className="w-5 h-5 accent-emerald-600 rounded cursor-pointer"
                                />
                            </div>

                            <div className="space-y-3 pt-2">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sales Channel Stock Depletion Settings</p>

                                {/* POS Channel */}
                                <div className="p-3.5 bg-white dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/5 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                                            <Monitor className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <h5 className="font-black text-slate-900 dark:text-white uppercase text-[11px]">POS Terminal Sales</h5>
                                            <p className="text-[9px] text-slate-400 font-bold">Deplete raw material stock when completing POS bills & orders</p>
                                        </div>
                                    </div>
                                    <input 
                                        type="checkbox"
                                        checked={inventorySettings.track_inventory_pos}
                                        onChange={(e) => setInventorySettings({ ...inventorySettings, track_inventory_pos: e.target.checked })}
                                        className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
                                    />
                                </div>

                                {/* Online Menu Channel */}
                                <div className="p-3.5 bg-white dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/5 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                                            <Globe className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <h5 className="font-black text-slate-900 dark:text-white uppercase text-[11px]">Online Menu & QR Orders</h5>
                                            <p className="text-[9px] text-slate-400 font-bold">Deplete stock when customers order via Web Store / Digital QR Menu</p>
                                        </div>
                                    </div>
                                    <input 
                                        type="checkbox"
                                        checked={inventorySettings.track_inventory_online}
                                        onChange={(e) => setInventorySettings({ ...inventorySettings, track_inventory_online: e.target.checked })}
                                        className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
                                    />
                                </div>

                                {/* WhatsApp Channel */}
                                <div className="p-3.5 bg-white dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/5 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                                            <MessageSquare className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <h5 className="font-black text-slate-900 dark:text-white uppercase text-[11px]">WhatsApp Bot Ordering</h5>
                                            <p className="text-[9px] text-slate-400 font-bold">Deplete stock when orders are confirmed via WhatsApp Chat Bot</p>
                                        </div>
                                    </div>
                                    <input 
                                        type="checkbox"
                                        checked={inventorySettings.track_inventory_whatsapp}
                                        onChange={(e) => setInventorySettings({ ...inventorySettings, track_inventory_whatsapp: e.target.checked })}
                                        className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
                                    />
                                </div>
                            </div>

                            <div className="pt-4 border-t border-slate-100 dark:border-white/5 flex gap-3">
                                <button type="button" onClick={() => setIsSettingsOpen(false)} className="flex-1 py-2.5 bg-slate-100 dark:bg-white/5 text-slate-500 rounded-xl text-[10px] font-bold uppercase tracking-widest">
                                    Cancel
                                </button>
                                <button type="submit" disabled={savingSettings} className="flex-[2] py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2">
                                    <Save className="w-4 h-4" /> {savingSettings ? "Saving..." : "Save Channel Rules"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InventoryMaster;
