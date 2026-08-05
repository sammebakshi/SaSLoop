import React, { useState, useEffect } from "react";
import { 
  Plus, Package, Trash2, Search, RefreshCw, Filter, 
  Edit3, Box, Layers, Tag, AlertTriangle, Check, X,
  DollarSign, BarChart3, ShieldCheck
} from "lucide-react";
import API_BASE from "../config";

const RawMaterialItems = () => {
    const [data, setData] = useState([]);
    const [categories, setCategories] = useState([]);
    const [units, setUnits] = useState([]);
    const [locations, setLocations] = useState([]);
    const [vendors, setVendors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [showLowStockOnly, setShowLowStockOnly] = useState(false);
    
    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [form, setForm] = useState({
        item_name: "",
        sku_code: "",
        unit: "Kg",
        current_stock: 0,
        min_stock: 0,
        last_purchase_price: 0,
        unit_cost: 0,
        category: "General",
        category_id: "",
        location_id: "",
        vendor_id: "",
        hsn_code: "",
        gst_percent: 0,
        yield_percent: 100
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
            const [rawRes, catRes, unitRes, locRes, venRes] = await Promise.all([
                fetch(`${API_BASE}/api/inventory/raw${q}`, { headers: getAuthHeaders() }),
                fetch(`${API_BASE}/api/inventory/rm-categories${q}`, { headers: getAuthHeaders() }),
                fetch(`${API_BASE}/api/inventory/rm-units${q}`, { headers: getAuthHeaders() }),
                fetch(`${API_BASE}/api/inventory/locations${q}`, { headers: getAuthHeaders() }),
                fetch(`${API_BASE}/api/inventory/vendors${q}`, { headers: getAuthHeaders() })
            ]);

            const [rawData, catData, unitData, locData, venData] = await Promise.all([
                rawRes.json(), catRes.json(), unitRes.json(), locRes.json(), venRes.json()
            ]);

            setData(Array.isArray(rawData) ? rawData : []);
            setCategories(Array.isArray(catData) ? catData : []);
            setUnits(Array.isArray(unitData) ? unitData : []);
            setLocations(Array.isArray(locData) ? locData : []);
            setVendors(Array.isArray(venData) ? venData : []);
        } catch (e) {
            console.error("Failed to fetch inventory data:", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleOpenModal = (item = null) => {
        if (item) {
            setEditingItem(item);
            setForm({
                item_name: item.item_name || "",
                sku_code: item.sku_code || "",
                unit: item.unit || "Kg",
                current_stock: item.current_stock || 0,
                min_stock: item.min_stock || 0,
                last_purchase_price: item.last_purchase_price || 0,
                unit_cost: item.unit_cost || item.last_purchase_price || 0,
                category: item.category || "General",
                category_id: item.category_id || "",
                location_id: item.location_id || "",
                vendor_id: item.vendor_id || "",
                hsn_code: item.hsn_code || "",
                gst_percent: item.gst_percent || 0,
                yield_percent: item.yield_percent || 100
            });
        } else {
            setEditingItem(null);
            setForm({
                item_name: "",
                sku_code: "",
                unit: "Kg",
                current_stock: 0,
                min_stock: 0,
                last_purchase_price: 0,
                unit_cost: 0,
                category: "General",
                category_id: "",
                location_id: "",
                vendor_id: "",
                hsn_code: "",
                gst_percent: 0,
                yield_percent: 100
            });
        }
        setIsModalOpen(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        if (!form.item_name.trim()) return alert("Item Name is required");
        try {
            const q = getImpersonateParam();
            const body = { ...form };
            if (editingItem) body.id = editingItem.id;

            const res = await fetch(`${API_BASE}/api/inventory/raw${q}`, {
                method: "POST",
                headers: getAuthHeaders(),
                body: JSON.stringify(body)
            });

            if (res.ok) {
                setIsModalOpen(false);
                fetchData();
            } else {
                const err = await res.json();
                alert(`Error: ${err.error || "Failed to save material"}`);
            }
        } catch (e) {
            console.error("Failed to save material:", e);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this raw material item?")) return;
        try {
            const q = getImpersonateParam();
            const res = await fetch(`${API_BASE}/api/inventory/raw/${id}${q}`, {
                method: "DELETE",
                headers: getAuthHeaders()
            });

            if (res.ok) {
                fetchData();
            } else {
                alert("Failed to delete item");
            }
        } catch (e) {
            console.error("Delete error:", e);
        }
    };

    const filteredData = data.filter(item => {
        const matchesQuery = 
            (item.item_name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
            (item.sku_code || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
            (item.category || "").toLowerCase().includes(searchQuery.toLowerCase());

        const matchesCat = selectedCategory === "All" || item.category === selectedCategory || String(item.category_id) === String(selectedCategory);
        const matchesLowStock = !showLowStockOnly || (parseFloat(item.current_stock || 0) <= parseFloat(item.min_stock || 0));

        return matchesQuery && matchesCat && matchesLowStock;
    });

    const totalValuation = data.reduce((acc, i) => acc + (parseFloat(i.current_stock || 0) * parseFloat(i.unit_cost || i.last_purchase_price || 0)), 0);
    const lowStockCount = data.filter(i => parseFloat(i.current_stock || 0) <= parseFloat(i.min_stock || 0)).length;

    return (
        <div className="space-y-4 animate-pro-in pb-10">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-[#1e2129] p-4 rounded-xl border border-slate-100 dark:border-white/5 shadow-sm">
                <div>
                    <h2 className="text-[18px] font-black text-slate-900 dark:text-white uppercase tracking-tight">Raw Materials Directory</h2>
                    <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-0.5">Master catalog of raw ingredients, packaging, and unit specs</p>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={fetchData} className="px-3 py-2 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 text-slate-600 dark:text-slate-300 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-1.5">
                        <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-emerald-500' : ''}`} /> Refresh
                    </button>
                    <button onClick={() => handleOpenModal()} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[11px] font-black uppercase tracking-wider transition-all shadow-lg shadow-emerald-600/20 flex items-center gap-1.5">
                        <Plus className="w-4 h-4" /> Add Material
                    </button>
                </div>
            </div>

            {/* Metrics Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-white dark:bg-[#1e2129] p-4 rounded-xl border border-slate-100 dark:border-white/5 flex items-center justify-between">
                    <div>
                        <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Total Raw Materials</p>
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mt-1">{data.length} <span className="text-[11px] font-bold text-slate-400">Items</span></h3>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                        <Box className="w-5 h-5" />
                    </div>
                </div>

                <div className="bg-white dark:bg-[#1e2129] p-4 rounded-xl border border-slate-100 dark:border-white/5 flex items-center justify-between">
                    <div>
                        <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Stock Valuation</p>
                        <h3 className="text-2xl font-black text-emerald-600 dark:text-emerald-500 tracking-tight mt-1">₹{totalValuation.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</h3>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                        <DollarSign className="w-5 h-5" />
                    </div>
                </div>

                <div className="bg-white dark:bg-[#1e2129] p-4 rounded-xl border border-slate-100 dark:border-white/5 flex items-center justify-between">
                    <div>
                        <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Low Stock Alerts</p>
                        <h3 className={`text-2xl font-black tracking-tight mt-1 ${lowStockCount > 0 ? 'text-rose-500' : 'text-slate-900 dark:text-white'}`}>{lowStockCount} <span className="text-[11px] font-bold text-slate-400">Reorders</span></h3>
                    </div>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${lowStockCount > 0 ? 'bg-rose-500/10 text-rose-500' : 'bg-slate-100 dark:bg-white/5 text-slate-400'}`}>
                        <AlertTriangle className="w-5 h-5" />
                    </div>
                </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="bg-white dark:bg-[#1e2129] p-3 rounded-xl border border-slate-100 dark:border-white/5 flex flex-col md:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2 bg-slate-50 dark:bg-black/20 border border-slate-100 dark:border-white/5 rounded-lg px-3 py-2 w-full md:w-80">
                    <Search className="w-4 h-4 text-slate-400" />
                    <input 
                        type="text" 
                        value={searchQuery} 
                        onChange={(e) => setSearchQuery(e.target.value)} 
                        placeholder="Search by material name, SKU or category..." 
                        className="bg-transparent text-[11px] font-bold outline-none w-full text-slate-800 dark:text-white uppercase tracking-tight"
                    />
                    {searchQuery && <button onClick={() => setSearchQuery("")}><X className="w-3.5 h-3.5 text-slate-400" /></button>}
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto">
                    <select 
                        value={selectedCategory} 
                        onChange={(e) => setSelectedCategory(e.target.value)} 
                        className="bg-slate-50 dark:bg-black/20 border border-slate-100 dark:border-white/5 rounded-lg px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 outline-none cursor-pointer"
                    >
                        <option value="All">All Categories</option>
                        {categories.map(c => (
                            <option key={c.id} value={c.name}>{c.name}</option>
                        ))}
                    </select>

                    <button 
                        onClick={() => setShowLowStockOnly(!showLowStockOnly)} 
                        className={`px-3 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 border ${showLowStockOnly ? 'bg-rose-500/10 border-rose-500/30 text-rose-500' : 'bg-slate-50 dark:bg-black/20 border-slate-100 dark:border-white/5 text-slate-500'}`}
                    >
                        <AlertTriangle className="w-3.5 h-3.5" /> Low Stock Only
                    </button>
                </div>
            </div>

            {/* Main Table */}
            <div className="bg-white dark:bg-[#1e2129] rounded-xl border border-slate-100 dark:border-white/5 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-black/20 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                                <th className="p-3.5">Material Details</th>
                                <th className="p-3.5">Category</th>
                                <th className="p-3.5">Stock Reserve</th>
                                <th className="p-3.5">Unit Price / Cost</th>
                                <th className="p-3.5">Stock Value</th>
                                <th className="p-3.5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-white/5 text-[11px] font-bold text-slate-800 dark:text-slate-200">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="p-12 text-center text-slate-400 animate-pulse">
                                        Loading inventory raw materials...
                                    </td>
                                </tr>
                            ) : filteredData.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="p-12 text-center text-slate-400">
                                        No raw material items found. Click "Add Material" to create your first item.
                                    </td>
                                </tr>
                            ) : filteredData.map(item => {
                                const isLow = parseFloat(item.current_stock || 0) <= parseFloat(item.min_stock || 0);
                                const cost = parseFloat(item.unit_cost || item.last_purchase_price || 0);
                                const val = parseFloat(item.current_stock || 0) * cost;

                                return (
                                    <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors">
                                        <td className="p-3.5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0 border border-emerald-500/20">
                                                    <Box className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <p className="font-black text-slate-900 dark:text-white uppercase tracking-tight">{item.item_name}</p>
                                                    <div className="flex items-center gap-2 mt-0.5">
                                                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">SKU: {item.sku_code || `RM-${item.id}`}</span>
                                                        {item.hsn_code && <span className="text-[9px] font-bold text-slate-400">| HSN: {item.hsn_code}</span>}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-3.5">
                                            <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-[9px] font-black uppercase text-slate-600 dark:text-slate-400">
                                                {item.category_name || item.category || 'General'}
                                            </span>
                                        </td>
                                        <td className="p-3.5">
                                            <div className="flex items-center gap-2">
                                                <span className={`text-[13px] font-black tracking-tight ${isLow ? 'text-rose-500' : 'text-slate-900 dark:text-white'}`}>
                                                    {parseFloat(item.current_stock || 0).toLocaleString()} <span className="text-[10px] font-bold text-slate-400">{item.unit || 'Kg'}</span>
                                                </span>
                                                {isLow && (
                                                    <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-500 text-[9px] font-black uppercase tracking-wider flex items-center gap-1">
                                                        <AlertTriangle className="w-2.5 h-2.5" /> Reorder
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-[9px] text-slate-400 mt-0.5">Min Stock Threshold: {item.min_stock || 0} {item.unit}</p>
                                        </td>
                                        <td className="p-3.5">
                                            <p className="font-black text-slate-900 dark:text-white">₹{cost.toFixed(2)} <span className="text-[9px] font-bold text-slate-400">/ {item.unit}</span></p>
                                            {item.gst_percent > 0 && <p className="text-[9px] text-slate-400">GST: {item.gst_percent}%</p>}
                                        </td>
                                        <td className="p-3.5">
                                            <p className="font-black text-emerald-600 dark:text-emerald-500">₹{val.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</p>
                                        </td>
                                        <td className="p-3.5 text-right">
                                            <div className="flex items-center justify-end gap-1.5">
                                                <button onClick={() => handleOpenModal(item)} className="p-1.5 hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white transition-all">
                                                    <Edit3 className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => handleDelete(item.id)} className="p-1.5 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg text-rose-400 hover:text-rose-600 transition-all">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-[#1e2129] border border-slate-100 dark:border-white/10 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto custom-scrollbar p-6 shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-white/5">
                            <div>
                                <h3 className="text-[16px] font-black text-slate-900 dark:text-white uppercase tracking-tight">
                                    {editingItem ? "Edit Raw Material" : "Provision Raw Material"}
                                </h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Specify ingredient metrics, stock levels and unit pricing</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="p-1.5 hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg text-slate-400">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="space-y-4 mt-4 text-[11px] font-bold text-slate-700 dark:text-slate-300">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Material Name *</label>
                                    <input 
                                        type="text" 
                                        required
                                        value={form.item_name} 
                                        onChange={(e) => setForm({ ...form, item_name: e.target.value })} 
                                        placeholder="e.g. Whole Milk 1L, Amul Butter"
                                        className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2 outline-none text-slate-900 dark:text-white uppercase font-bold"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">SKU / Code</label>
                                    <input 
                                        type="text" 
                                        value={form.sku_code} 
                                        onChange={(e) => setForm({ ...form, sku_code: e.target.value })} 
                                        placeholder="e.g. RM-MILK-01"
                                        className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2 outline-none text-slate-900 dark:text-white uppercase font-bold"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Category</label>
                                    <select 
                                        value={form.category} 
                                        onChange={(e) => {
                                            const cat = categories.find(c => c.name === e.target.value);
                                            setForm({ ...form, category: e.target.value, category_id: cat ? cat.id : "" });
                                        }} 
                                        className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2 outline-none text-slate-900 dark:text-white uppercase font-bold cursor-pointer"
                                    >
                                        <option value="General">General</option>
                                        {categories.map(c => (
                                            <option key={c.id} value={c.name}>{c.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Measurement Unit</label>
                                    <select 
                                        value={form.unit} 
                                        onChange={(e) => setForm({ ...form, unit: e.target.value })} 
                                        className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2 outline-none text-slate-900 dark:text-white uppercase font-bold cursor-pointer"
                                    >
                                        {units.length > 0 ? units.map(u => (
                                            <option key={u.id} value={u.symbol || u.name}>{u.name} ({u.symbol || u.name})</option>
                                        )) : (
                                            <>
                                                <option value="Kg">Kilogram (Kg)</option>
                                                <option value="Gram">Gram (g)</option>
                                                <option value="Liter">Liter (L)</option>
                                                <option value="Ml">Milliliter (ml)</option>
                                                <option value="Pcs">Pieces (Pcs)</option>
                                                <option value="Packet">Packet (Pkt)</option>
                                            </>
                                        )}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Current Reserve Stock</label>
                                    <input 
                                        type="number" 
                                        step="0.001"
                                        value={form.current_stock} 
                                        onChange={(e) => setForm({ ...form, current_stock: parseFloat(e.target.value || 0) })} 
                                        className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2 outline-none text-slate-900 dark:text-white font-bold"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Min Reorder Threshold</label>
                                    <input 
                                        type="number" 
                                        step="0.001"
                                        value={form.min_stock} 
                                        onChange={(e) => setForm({ ...form, min_stock: parseFloat(e.target.value || 0) })} 
                                        className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2 outline-none text-slate-900 dark:text-white font-bold"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Unit Cost Price (₹)</label>
                                    <input 
                                        type="number" 
                                        step="0.01"
                                        value={form.unit_cost} 
                                        onChange={(e) => setForm({ ...form, unit_cost: parseFloat(e.target.value || 0), last_purchase_price: parseFloat(e.target.value || 0) })} 
                                        className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2 outline-none text-slate-900 dark:text-white font-bold"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">GST Tax %</label>
                                    <input 
                                        type="number" 
                                        step="0.01"
                                        value={form.gst_percent} 
                                        onChange={(e) => setForm({ ...form, gst_percent: parseFloat(e.target.value || 0) })} 
                                        className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2 outline-none text-slate-900 dark:text-white font-bold"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Storage Warehouse</label>
                                    <select 
                                        value={form.location_id} 
                                        onChange={(e) => setForm({ ...form, location_id: e.target.value })} 
                                        className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2 outline-none text-slate-900 dark:text-white uppercase font-bold cursor-pointer"
                                    >
                                        <option value="">Unassigned</option>
                                        {locations.map(l => (
                                            <option key={l.id} value={l.id}>{l.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Primary Vendor</label>
                                    <select 
                                        value={form.vendor_id} 
                                        onChange={(e) => setForm({ ...form, vendor_id: e.target.value })} 
                                        className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2 outline-none text-slate-900 dark:text-white uppercase font-bold cursor-pointer"
                                    >
                                        <option value="">Unassigned</option>
                                        {vendors.map(v => (
                                            <option key={v.id} value={v.id}>{v.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-slate-100 dark:border-white/5 flex gap-3">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2.5 bg-slate-100 dark:bg-white/5 text-slate-500 rounded-xl text-[10px] font-bold uppercase tracking-widest">
                                    Cancel
                                </button>
                                <button type="submit" className="flex-[2] py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-600/20">
                                    {editingItem ? "Save Changes" : "Create Raw Material"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RawMaterialItems;
