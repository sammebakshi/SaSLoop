import React, { useState, useEffect } from "react";
import { Sliders, Plus, Trash2, RefreshCw, Layers, MenuSquare, Tag, DollarSign } from "lucide-react";
import API_BASE from "../config";

const MultiplePricing = () => {
    const [menus, setMenus] = useState([]);
    const [categories, setCategories] = useState([]);
    const [allItems, setAllItems] = useState([]);
    const [pricingRules, setPricingRules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // Selected values
    const [selectedMenuId, setSelectedMenuId] = useState("");
    const [selectedCategoryId, setSelectedCategoryId] = useState("");
    const [selectedItemId, setSelectedItemId] = useState("");
    const [selectedOrderType, setSelectedOrderType] = useState("DINE_IN");
    const [priceInput, setPriceInput] = useState("");

    const getOutletId = () => {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const freshId = sessionStorage.getItem("impersonate_id");
        if (user.role === 'user' && (!freshId || freshId === 'global')) {
            return user.id;
        }
        return freshId;
    };

    const currentOutletId = getOutletId();

    const fetchAllData = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const freshId = getOutletId();
            const isValidId = freshId && !isNaN(freshId) && freshId !== "global";
            const query = isValidId ? `?outlet_id=${freshId}` : "";

            // 1. Fetch Menus
            const menusRes = await fetch(`${API_BASE}/api/brand/outlet-menus${query}`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const menusData = await menusRes.json();
            setMenus(Array.isArray(menusData) ? menusData : []);

            // 2. Fetch Categories
            const catRes = await fetch(`${API_BASE}/api/brand/categories${query}`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const catData = await catRes.json();
            setCategories(Array.isArray(catData) ? catData : []);

            // 3. Fetch Items
            const itemsRes = await fetch(`${API_BASE}/api/brand/outlet-all-items${query}`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const itemsData = await itemsRes.json();
            setAllItems(Array.isArray(itemsData) ? itemsData : []);

            // 4. Fetch Pricing Rules
            const rulesRes = await fetch(`${API_BASE}/api/brand/multiple-pricing`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const rulesData = await rulesRes.json();
            setPricingRules(Array.isArray(rulesData) ? rulesData : []);

        } catch (e) {
            console.error("Failed to load multiple pricing setup data", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllData();
    }, [currentOutletId]);

    // Filter items based on selected Menu and Category
    const filteredItems = allItems.filter(item => {
        const matchesMenu = !selectedMenuId || String(item.menu_id) === String(selectedMenuId);
        const matchesCategory = !selectedCategoryId || String(item.category_id) === String(selectedCategoryId);
        return matchesMenu && matchesCategory && item.item_id !== null; // Must have valid business item reference
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedItemId) {
            alert("Please select an item first!");
            return;
        }
        if (!priceInput || isNaN(priceInput) || parseFloat(priceInput) < 0) {
            alert("Please enter a valid price!");
            return;
        }

        setSubmitting(true);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_BASE}/api/brand/multiple-pricing`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    item_id: parseInt(selectedItemId),
                    order_type: selectedOrderType,
                    price: parseFloat(priceInput)
                })
            });

            if (res.ok) {
                setPriceInput("");
                // Refresh list
                const rulesRes = await fetch(`${API_BASE}/api/brand/multiple-pricing`, {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                const rulesData = await rulesRes.json();
                setPricingRules(Array.isArray(rulesData) ? rulesData : []);
            } else {
                const errData = await res.json();
                alert(`Error: ${errData.error || 'Failed to save price rule'}`);
            }
        } catch (err) {
            console.error(err);
            alert("Failed to submit price rule.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this pricing override?")) return;
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_BASE}/api/brand/multiple-pricing/${id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) {
                setPricingRules(prev => prev.filter(r => r.id !== id));
            }
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className="space-y-4 animate-in fade-in duration-500">
            {/* Header Hub */}
            <div className="flex items-center justify-between bg-white dark:bg-[#1e2129] p-4 rounded-lg border border-slate-200 dark:border-white/5 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg">
                        <Sliders className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                        <h2 className="pro-heading">Multiple Pricing Manager</h2>
                        <p className="pro-subheading">Set custom prices for Dine In, Takeaway, and Delivery order types</p>
                    </div>
                </div>
                <div>
                    <button onClick={fetchAllData} className="h-10 w-10 flex items-center justify-center bg-white dark:bg-white/5 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg border border-slate-200 dark:border-white/5 transition-all shadow-sm">
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Form configuration panel */}
                <div className="bg-white dark:bg-[#1e2129] p-6 rounded-xl border border-slate-200 dark:border-white/5 shadow-sm h-fit">
                    <h3 className="text-[13px] font-black uppercase text-slate-800 dark:text-white mb-4 tracking-wider flex items-center gap-2 border-b border-slate-100 dark:border-white/5 pb-2">
                        <Plus className="w-4 h-4 text-emerald-600" /> Configure Price Rule
                    </h3>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Menu dropdown */}
                        <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">Select Menu</label>
                            <select
                                className="pro-select w-full bg-slate-50 dark:bg-white/5 text-[11px] font-bold outline-none"
                                value={selectedMenuId}
                                onChange={e => {
                                    setSelectedMenuId(e.target.value);
                                    setSelectedItemId("");
                                }}
                            >
                                <option value="">All Menus</option>
                                {menus.map(m => (
                                    <option key={m.id} value={m.id}>{m.menu_name.toUpperCase()}</option>
                                ))}
                            </select>
                        </div>

                        {/* Category dropdown */}
                        <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">Select Category</label>
                            <select
                                className="pro-select w-full bg-slate-50 dark:bg-white/5 text-[11px] font-bold outline-none"
                                value={selectedCategoryId}
                                onChange={e => {
                                    setSelectedCategoryId(e.target.value);
                                    setSelectedItemId("");
                                }}
                            >
                                <option value="">All Categories</option>
                                {categories.map(c => (
                                    <option key={c.id} value={c.id}>{c.name.toUpperCase()}</option>
                                ))}
                            </select>
                        </div>

                        {/* Item dropdown */}
                        <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">Select Item</label>
                            <select
                                className="pro-select w-full bg-slate-50 dark:bg-white/5 text-[11px] font-bold outline-none"
                                value={selectedItemId}
                                onChange={e => setSelectedItemId(e.target.value)}
                                required
                            >
                                <option value="">Select Item</option>
                                {filteredItems.map(item => (
                                    <option key={item.id} value={item.item_id}>{item.product_name.toUpperCase()}</option>
                                ))}
                            </select>
                        </div>

                        {/* Order Type dropdown */}
                        <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">Select Order Type</label>
                            <select
                                className="pro-select w-full bg-slate-50 dark:bg-white/5 text-[11px] font-bold outline-none"
                                value={selectedOrderType}
                                onChange={e => setSelectedOrderType(e.target.value)}
                                required
                            >
                                <option value="DINE_IN">DINE IN</option>
                                <option value="TAKEAWAY">TAKEAWAY (QUICK/PICKUP)</option>
                                <option value="DELIVERY">DELIVERY</option>
                            </select>
                        </div>

                        {/* Price Input */}
                        <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">Custom Price (Rs)</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-black text-[11px]">Rs</span>
                                <input
                                    type="number"
                                    step="0.01"
                                    placeholder="Enter custom price..."
                                    className="w-full pl-8 pr-3 h-10 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-lg text-[12px] font-bold outline-none focus:ring-2 ring-emerald-500/10 text-slate-800 dark:text-white"
                                    value={priceInput}
                                    onChange={e => setPriceInput(e.target.value)}
                                    required
                                    min="0"
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={submitting}
                            className="pro-btn-primary w-full h-10 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[11px] uppercase tracking-wider shadow-lg shadow-emerald-600/10 active:scale-95 transition-all"
                        >
                            {submitting ? "Saving..." : "Save Pricing Rule"}
                        </button>
                    </form>
                </div>

                {/* Pricing Rules Vault table */}
                <div className="lg:col-span-2 bg-white dark:bg-[#1e2129] rounded-xl border border-slate-200 dark:border-white/5 shadow-sm overflow-hidden flex flex-col">
                    <h3 className="p-4 text-[13px] font-black uppercase text-slate-800 dark:text-white border-b border-slate-100 dark:border-white/5 tracking-wider flex items-center justify-between">
                        <span className="flex items-center gap-2"><Tag className="w-4 h-4 text-emerald-600" /> Active Price Mappings</span>
                        <span className="px-2.5 py-0.5 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded text-[9px] font-black uppercase text-emerald-600 dark:text-emerald-400">{pricingRules.length} Rules</span>
                    </h3>

                    <div className="flex-1 overflow-x-auto">
                        <table className="pro-table">
                            <thead>
                                <tr>
                                    <th className="w-16 text-center">Action</th>
                                    <th>Item Code</th>
                                    <th>Item Identity</th>
                                    <th>Category Context</th>
                                    <th>Order Type</th>
                                    <th className="text-right">Price Override</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                                {loading ? (
                                    <tr>
                                        <td colSpan="6" className="py-24 text-center text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 animate-pulse">Syncing Pricing Records...</td>
                                    </tr>
                                ) : pricingRules.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="py-24 text-center opacity-25">
                                            <Sliders className="w-12 h-12 mx-auto mb-4 text-slate-400" />
                                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">No Custom Pricings Defined</p>
                                        </td>
                                    </tr>
                                ) : pricingRules.map(rule => (
                                    <tr key={rule.id} className="group hover:bg-slate-50 dark:hover:bg-white/[0.01] transition-all">
                                        <td className="px-6 py-3 text-center">
                                            <button
                                                onClick={() => handleDelete(rule.id)}
                                                className="p-1.5 bg-rose-50 hover:bg-rose-600 text-rose-500 hover:text-white rounded transition-all border border-rose-100 dark:border-rose-950 shadow-sm active:scale-90"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </td>
                                        <td className="px-6 py-3 font-mono text-[10px] text-slate-400">
                                            {rule.code || "N/A"}
                                        </td>
                                        <td className="px-6 py-3">
                                            <p className="text-[11px] font-black text-slate-800 dark:text-white uppercase tracking-tight">{rule.product_name}</p>
                                        </td>
                                        <td className="px-6 py-3">
                                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-100 dark:bg-white/5 text-[9px] font-black uppercase text-slate-400 border border-slate-200 dark:border-white/5">
                                                <Layers className="w-3 h-3 text-slate-400" /> {rule.category_name || "Uncategorized"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-3">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider border ${
                                                rule.order_type === 'DINE_IN' 
                                                    ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/20'
                                                    : rule.order_type === 'DELIVERY'
                                                        ? 'bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-500/20'
                                                        : 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-500/20'
                                            }`}>
                                                {rule.order_type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-3 text-right font-black text-[12px] text-slate-900 dark:text-white">
                                            Rs {parseFloat(rule.price).toFixed(2)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MultiplePricing;
