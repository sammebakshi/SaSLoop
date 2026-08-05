import React, { useState, useEffect } from "react";
import { 
  Plus, Search, X, Trash2, Edit3, RefreshCw, 
  Filter, Grid, Check, Layers
} from "lucide-react";
import API_BASE from "../config";

const RMCategory = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [isActive, setIsActive] = useState(true);

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
            const res = await fetch(`${API_BASE}/api/inventory/rm-categories${q}`, {
                headers: getAuthHeaders()
            });
            const d = await res.json();
            setData(Array.isArray(d) ? d : []);
        } catch (e) {
            console.error("Fetch categories error:", e);
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
            setName(item.name || "");
            setDescription(item.description || "");
            setIsActive(item.is_active !== false);
        } else {
            setEditingItem(null);
            setName("");
            setDescription("");
            setIsActive(true);
        }
        setShowModal(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        if (!name.trim()) return alert("Category Name is required");

        try {
            const q = getImpersonateParam();
            const body = { name, description, is_active: isActive };
            if (editingItem) body.id = editingItem.id;

            const res = await fetch(`${API_BASE}/api/inventory/rm-categories${q}`, {
                method: "POST",
                headers: getAuthHeaders(),
                body: JSON.stringify(body)
            });

            if (res.ok) {
                setShowModal(false);
                fetchData();
            } else {
                const err = await res.json();
                alert(`Error: ${err.error || "Failed to save category"}`);
            }
        } catch (e) {
            console.error("Save category error:", e);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this raw material category?")) return;
        try {
            const q = getImpersonateParam();
            const res = await fetch(`${API_BASE}/api/inventory/rm-categories/${id}${q}`, {
                method: "DELETE",
                headers: getAuthHeaders()
            });
            if (res.ok) {
                fetchData();
            }
        } catch (e) {
            console.error("Delete error:", e);
        }
    };

    const filtered = data.filter(c => (c.name || "").toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <div className="space-y-4 animate-pro-in pb-10">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-[#1e2129] p-4 rounded-xl border border-slate-100 dark:border-white/5 shadow-sm">
                <div>
                    <h2 className="text-[18px] font-black text-slate-900 dark:text-white uppercase tracking-tight">Raw Material Categories</h2>
                    <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-0.5">Organize raw ingredients, spices, dairy & packaging classifications</p>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={fetchData} className="px-3 py-2 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 text-slate-600 dark:text-slate-300 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-1.5">
                        <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-emerald-500' : ''}`} /> Refresh
                    </button>
                    <button onClick={() => handleOpenModal()} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[11px] font-black uppercase tracking-wider transition-all shadow-lg shadow-emerald-600/20 flex items-center gap-1.5">
                        <Plus className="w-4 h-4" /> Add Category
                    </button>
                </div>
            </div>

            {/* Search Bar */}
            <div className="bg-white dark:bg-[#1e2129] p-3 rounded-xl border border-slate-100 dark:border-white/5 flex items-center gap-3">
                <div className="flex items-center gap-2 bg-slate-50 dark:bg-black/20 border border-slate-100 dark:border-white/5 rounded-lg px-3 py-2 flex-1">
                    <Search className="w-4 h-4 text-slate-400" />
                    <input 
                        type="text" 
                        value={searchQuery} 
                        onChange={(e) => setSearchQuery(e.target.value)} 
                        placeholder="Search raw material categories..." 
                        className="bg-transparent text-[11px] font-bold outline-none w-full text-slate-800 dark:text-white uppercase tracking-tight"
                    />
                </div>
            </div>

            {/* Grid/Table */}
            <div className="bg-white dark:bg-[#1e2129] rounded-xl border border-slate-100 dark:border-white/5 overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-black/20 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                            <th className="p-3.5">Category Name</th>
                            <th className="p-3.5">Description</th>
                            <th className="p-3.5">Assigned Items</th>
                            <th className="p-3.5">Status</th>
                            <th className="p-3.5 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-white/5 text-[11px] font-bold text-slate-800 dark:text-slate-200">
                        {loading ? (
                            <tr><td colSpan="5" className="p-12 text-center text-slate-400 animate-pulse">Loading categories...</td></tr>
                        ) : filtered.length === 0 ? (
                            <tr><td colSpan="5" className="p-12 text-center text-slate-400">No categories found. Create a category to organize raw materials.</td></tr>
                        ) : filtered.map(cat => (
                            <tr key={cat.id} className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors">
                                <td className="p-3.5">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                                            <Grid className="w-4 h-4" />
                                        </div>
                                        <span className="font-black text-slate-900 dark:text-white uppercase tracking-tight">{cat.name}</span>
                                    </div>
                                </td>
                                <td className="p-3.5 text-slate-500">{cat.description || "N/A"}</td>
                                <td className="p-3.5">
                                    <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-white/5 text-[10px] font-black text-slate-600 dark:text-slate-400">
                                        {cat.item_count || 0} Items
                                    </span>
                                </td>
                                <td className="p-3.5">
                                    <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${cat.is_active !== false ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-100 text-slate-400'}`}>
                                        {cat.is_active !== false ? 'Active' : 'Disabled'}
                                    </span>
                                </td>
                                <td className="p-3.5 text-right">
                                    <div className="flex items-center justify-end gap-1.5">
                                        <button onClick={() => handleOpenModal(cat)} className="p-1.5 hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white">
                                            <Edit3 className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => handleDelete(cat.id)} className="p-1.5 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg text-rose-400 hover:text-rose-600">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-[#1e2129] border border-slate-100 dark:border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-white/5">
                            <h3 className="text-[15px] font-black text-slate-900 dark:text-white uppercase tracking-tight">
                                {editingItem ? "Edit Category" : "New Raw Material Category"}
                            </h3>
                            <button onClick={() => setShowModal(false)} className="p-1.5 hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg text-slate-400">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="space-y-4 mt-4 text-[11px] font-bold text-slate-700 dark:text-slate-300">
                            <div>
                                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Category Name *</label>
                                <input 
                                    type="text" 
                                    required
                                    value={name} 
                                    onChange={(e) => setName(e.target.value)} 
                                    placeholder="e.g. Dairy Products, Fresh Poultry, Spices"
                                    className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2 outline-none text-slate-900 dark:text-white uppercase font-bold"
                                />
                            </div>

                            <div>
                                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Description</label>
                                <textarea 
                                    value={description} 
                                    onChange={(e) => setDescription(e.target.value)} 
                                    placeholder="Optional category summary..."
                                    rows="2"
                                    className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2 outline-none text-slate-900 dark:text-white font-bold"
                                />
                            </div>

                            <div className="flex items-center gap-2 pt-1">
                                <input 
                                    type="checkbox" 
                                    id="catActive" 
                                    checked={isActive} 
                                    onChange={(e) => setIsActive(e.target.checked)} 
                                    className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
                                />
                                <label htmlFor="catActive" className="cursor-pointer text-[11px] font-bold text-slate-700 dark:text-slate-300">Active Category</label>
                            </div>

                            <div className="pt-4 border-t border-slate-100 dark:border-white/5 flex gap-3">
                                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2.5 bg-slate-100 dark:bg-white/5 text-slate-500 rounded-xl text-[10px] font-bold uppercase tracking-widest">
                                    Cancel
                                </button>
                                <button type="submit" className="flex-[2] py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-600/20">
                                    {editingItem ? "Save Changes" : "Create Category"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RMCategory;
