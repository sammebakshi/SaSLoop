import React, { useState, useEffect } from "react";
import { Plus, ShoppingBag, Trash2, Search, RefreshCw, Filter, Edit3, Settings2 } from "lucide-react";
import API_BASE from "../config";

const OrderTypeManager = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const res = await fetch(`${API_BASE}/api/brand/order-types`, {
                headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
            });
            const d = await res.json();
            setData(Array.isArray(d) ? d : []);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchData(); }, []);

    return (
        <div className="space-y-4 animate-in fade-in duration-500">
            {/* Header Control Hub */}
            <div className="flex items-center justify-between bg-white dark:bg-[#1e2129] p-3 rounded-lg border border-slate-200 dark:border-white/5 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg">
                        <ShoppingBag className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                        <h2 className="pro-heading">Order Types</h2>
                        <p className="pro-subheading">Manage Dine-In, Takeaway, and Delivery modes</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={fetchData} className="h-10 w-10 flex items-center justify-center bg-white dark:bg-white/5 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg border border-slate-200 dark:border-white/5 transition-all shadow-sm"><RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /></button>
                    <button className="pro-btn-primary h-10 px-5">
                        <Plus className="w-4 h-4" /> Add Order Type
                    </button>
                    <div className="h-10 px-4 flex items-center bg-white dark:bg-white/5 text-emerald-600 dark:text-emerald-400 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] border border-slate-200 dark:border-white/5 shadow-sm">
                        {data.length} Nodes
                    </div>
                </div>
            </div>

            {/* Filter Hub */}
            <div className="bg-white dark:bg-[#1e2129] p-3 rounded-lg border border-slate-200 dark:border-white/5 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3 flex-1">
                    <Search className="w-4 h-4 text-slate-400" />
                    <input 
                        type="text" 
                        placeholder="SEARCH PROTOCOLS..." 
                        className="bg-transparent text-[11px] font-bold text-slate-600 dark:text-slate-300 placeholder:text-slate-300 outline-none w-full uppercase"
                    />
                </div>
            </div>

            <div className="bg-white dark:bg-[#1e2129] rounded-lg border border-slate-200 dark:border-white/5 overflow-hidden shadow-sm">
                <table className="pro-table">
                    <thead>
                        <tr>
                            <th className="text-center w-24">Action</th>
                            <th>Protocol Identity</th>
                            <th>Channel Type</th>
                            <th className="text-center">Status</th>
                        </tr>
                    </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                            {loading ? (
                                <tr><td colSpan="4" className="py-24 text-center text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] animate-pulse">Syncing Protocol Vaults...</td></tr>
                            ) : data.length === 0 ? (
                                <tr><td colSpan="4" className="py-24 text-center opacity-20"><ShoppingBag className="w-12 h-12 mx-auto mb-4" /><p className="text-[10px] font-bold uppercase tracking-widest">No Protocols Defined</p></td></tr>
                            ) : data.map(item => (
                                <tr key={item.id} className="group hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-all">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-1.5 bg-slate-100 dark:bg-white/5 hover:bg-indigo-600 hover:text-white rounded text-slate-400 transition-all border border-slate-200 dark:border-white/10 shadow-sm active:scale-90"><Settings2 className="w-3.5 h-3.5" /></button>
                                            <button className="p-1.5 bg-slate-100 dark:bg-white/5 hover:bg-indigo-600 hover:text-white rounded text-slate-400 transition-all border border-slate-200 dark:border-white/10 shadow-sm active:scale-90"><Edit3 className="w-3.5 h-3.5" /></button>
                                            <button className="p-1.5 bg-slate-100 dark:bg-white/5 hover:bg-rose-600 hover:text-white rounded text-slate-400 transition-all border border-slate-200 dark:border-white/10 shadow-sm active:scale-90"><Trash2 className="w-3.5 h-3.5" /></button>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-all">
                                                <ShoppingBag className="w-3.5 h-3.5" />
                                            </div>
                                            <div>
                                                <p className="text-[12px] font-bold text-slate-800 dark:text-white uppercase tracking-tight">{item.name}</p>
                                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">PROTO_{item.id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-2 py-0.5 rounded bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 text-[9px] font-bold uppercase border border-slate-200 dark:border-white/5">{item.type || 'Standard'}</span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-500 border border-emerald-200 dark:border-emerald-500/20">Active</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
        </div>
    );
};

export default OrderTypeManager;
