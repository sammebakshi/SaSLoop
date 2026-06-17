import React, { useState, useEffect } from "react";
import { Plus, LayoutGrid, Trash2, Search, RefreshCw, Filter, Edit3, Image as ImageIcon, XCircle } from "lucide-react";
import API_BASE from "../config";

const CategoryManager = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [formData, setFormData] = useState({ name: '', sort_order: 1000, is_active: true });

    const getOutletId = () => {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const freshId = sessionStorage.getItem("impersonate_id");
        if (user.role === 'user' && (!freshId || freshId === 'global')) {
            return user.id;
        }
        return freshId;
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const freshId = getOutletId();
            const res = await fetch(`${API_BASE}/api/brand/categories${freshId ? `?outlet_id=${freshId}` : ''}`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const d = await res.json();
            setData(Array.isArray(d) ? d : []);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Permanently delete this category? This may affect items assigned to it.")) return;
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_BASE}/api/brand/categories/${id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) fetchData();
            else alert("Delete failed. Category might be in use.");
        } catch (e) { console.error(e); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            const method = editingCategory ? "PUT" : "POST";
            const url = editingCategory 
                ? `${API_BASE}/api/brand/categories/${editingCategory.id}`
                : `${API_BASE}/api/brand/categories`;

            const res = await fetch(url, {
                method,
                headers: { 
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    ...formData,
                    outlet_id: getOutletId()
                })
            });

            if (res.ok) {
                setIsModalOpen(false);
                fetchData();
            }
        } catch (e) { console.error(e); }
    };

    const openEdit = (cat) => {
        setEditingCategory(cat);
        setFormData({ name: cat.name, sort_order: cat.sort_order, is_active: cat.is_active });
        setIsModalOpen(true);
    };

    useEffect(() => { fetchData(); }, []);

    return (
        <div className="space-y-4 animate-in fade-in duration-500">
            {/* Header Control Hub */}
            <div className="flex items-center justify-between bg-white dark:bg-[#1e2129] p-3 rounded-lg border border-slate-200 dark:border-white/5 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg">
                        <LayoutGrid className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                        <h2 className="pro-heading">Categories</h2>
                        <p className="pro-subheading">Manage menu categories and product groups</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={fetchData} className="h-10 w-10 flex items-center justify-center bg-white dark:bg-white/5 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg border border-slate-200 dark:border-white/5 transition-all shadow-sm"><RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /></button>
                    <button onClick={() => { setEditingCategory(null); setFormData({name:'', sort_order:1000, is_active:true}); setIsModalOpen(true); }} className="pro-btn-primary h-10 px-5">
                        <Plus className="w-4 h-4" /> Add Category
                    </button>
                    <div className="h-10 px-4 flex items-center bg-white dark:bg-white/5 text-emerald-600 dark:text-emerald-400 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] border border-slate-200 dark:border-white/5 shadow-sm">
                        {data.length} Nodes
                    </div>
                </div>
            </div>

            {/* Industrial Category Matrix */}
            <div className="bg-white dark:bg-[#1e2129] rounded-lg border border-slate-200 dark:border-white/5 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="pro-table">
                        <thead>
                            <tr>
                                <th className="text-center w-24">Action</th>
                                <th className="text-center w-16">Sr. No.</th>
                                <th className="text-center w-20">Image</th>
                                <th>Category Name</th>
                                <th>Parent</th>
                                <th className="text-center w-32">Sorting</th>
                                <th className="text-center w-32">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <tr key={i} className="animate-pulse"><td colSpan="7" className="px-4 py-4"><div className="h-10 bg-slate-100 dark:bg-white/5 rounded" /></td></tr>
                                ))
                            ) : data.length === 0 ? (
                                <tr><td colSpan="7" className="py-32 text-center opacity-20"><LayoutGrid className="w-12 h-12 mx-auto mb-4" /><p className="text-[12px] font-bold uppercase">No Categories Registered</p></td></tr>
                            ) : data.map((cat, idx) => (
                                <tr key={cat.id} className="group hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-all">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => openEdit(cat)} className="p-1.5 bg-slate-100 dark:bg-white/5 hover:bg-indigo-600 hover:text-white rounded text-slate-400 transition-all border border-slate-200 dark:border-white/10 shadow-sm active:scale-90"><Edit3 className="w-3.5 h-3.5" /></button>
                                            <button onClick={() => handleDelete(cat.id)} className="p-1.5 bg-slate-100 dark:bg-white/5 hover:bg-rose-600 hover:text-white rounded text-slate-400 transition-all border border-slate-200 dark:border-white/10 shadow-sm active:scale-90"><Trash2 className="w-3.5 h-3.5" /></button>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center font-bold text-slate-400 text-[11px]">{idx + 1}</td>
                                    <td className="px-6 py-4">
                                        <div className="w-9 h-9 rounded bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-300 overflow-hidden mx-auto shadow-inner">
                                            {cat.image_url ? <img src={cat.image_url} alt="" className="w-full h-full object-cover" /> : <ImageIcon className="w-4 h-4" />}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-bold text-slate-800 dark:text-white uppercase tracking-tight text-[12px]">{cat.name}</td>
                                    <td className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">N/A</td>
                                    <td className="px-6 py-4 text-center font-bold text-slate-600 dark:text-slate-400 text-[11px]">{cat.sort_order || 1000}</td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest ${
                                            cat.is_active 
                                            ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-500 border border-emerald-200 dark:border-emerald-500/20' 
                                            : 'bg-slate-50 text-slate-400 border border-slate-200'
                                        }`}>
                                            {cat.is_active ? 'Active' : 'Offline'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal architecture (Centered) */}
            {/* Modal architecture */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <form onSubmit={handleSubmit} className="bg-white dark:bg-[#1e2129] w-full max-w-md rounded-xl border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden">
                        <div className="p-4 bg-slate-50 dark:bg-black/20 border-b border-slate-200 dark:border-white/5 flex items-center justify-between">
                            <h3 className="text-[12px] font-bold text-slate-800 dark:text-white uppercase tracking-widest flex items-center gap-2">
                                <LayoutGrid className="w-4 h-4 text-emerald-600" />
                                {editingCategory ? 'Update' : 'Register'} Category
                            </h3>
                            <button type="button" onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-all"><XCircle className="w-5 h-5" /></button>
                        </div>
                        
                        <div className="p-6 space-y-5">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Category Name</label>
                                <input 
                                    required type="text" 
                                    className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2.5 text-slate-900 dark:text-white outline-none focus:border-emerald-500 transition-all font-bold text-[12px] uppercase"
                                    placeholder="E.G. MAIN COURSE, STARTERS"
                                    value={formData.name} 
                                    onChange={e => setFormData({...formData, name: e.target.value.toUpperCase()})} 
                                />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sort Order</label>
                                    <input 
                                        type="number" 
                                        className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2.5 text-slate-900 dark:text-white outline-none focus:border-emerald-500 transition-all font-bold text-[12px]"
                                        value={formData.sort_order} 
                                        onChange={e => setFormData({...formData, sort_order: e.target.value})} 
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Status</label>
                                    <div className="h-[46px] flex items-center justify-between px-4 bg-slate-50 dark:bg-black/20 rounded-lg border border-slate-200 dark:border-white/10">
                                        <span className="text-[9px] font-bold text-slate-400 uppercase">{formData.is_active ? 'Active' : 'Offline'}</span>
                                        <label className="flex items-center cursor-pointer">
                                            <input 
                                                type="checkbox" 
                                                className="hidden"
                                                checked={formData.is_active} 
                                                onChange={e => setFormData({...formData, is_active: e.target.checked})} 
                                            />
                                            <div className={`w-9 h-5 rounded-full relative transition-all ${formData.is_active ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-white/10'}`}>
                                                <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${formData.is_active ? 'right-1' : 'left-1'}`} />
                                            </div>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="p-4 bg-slate-50 dark:bg-black/20 border-t border-slate-200 dark:border-white/5 flex gap-3">
                            <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2 text-[11px] font-bold text-slate-400 hover:text-slate-600 dark:hover:text-white uppercase tracking-widest transition-all">Cancel</button>
                            <button type="submit" className="flex-[2] py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[11px] font-bold uppercase tracking-widest transition-all shadow-lg shadow-emerald-600/20">
                                {editingCategory ? 'Update Hierarchy' : 'Register Category'}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default CategoryManager;
