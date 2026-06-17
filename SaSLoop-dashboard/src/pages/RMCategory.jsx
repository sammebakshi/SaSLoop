import React, { useState, useEffect } from "react";
import { 
  Plus, Search, X, Trash2, Edit3, RefreshCw, 
  Filter, Database, Layers
} from "lucide-react";
import API_BASE from "../config";

const RMCategory = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/api/inventory/rm-categories`, {
                headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
            });
            if (!res.ok) {
                setData([
                    { id: 1, name: "Dairy Products", status: "Active" },
                    { id: 2, name: "Fresh Poultry", status: "Active" },
                    { id: 3, name: "Dry Spices", status: "Active" }
                ]);
            } else {
                setData(await res.json());
            }
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchData(); }, []);

    return (
        <div className="space-y-4 animate-pro-in">
            {/* Page Header Artifact */}
            <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                    <h2 className="pro-heading">Classification Matrix</h2>
                    <p className="pro-subheading">Raw material hierarchies and procurement logic</p>
                </div>
                <div className="flex items-center gap-2">
                    <button className="pro-btn-secondary h-8"><RefreshCw className="w-3 h-3" /> Refresh</button>
                    <button onClick={() => setShowModal(true)} className="pro-btn-primary h-8"><Plus className="w-3.5 h-3.5" /> Provision Category</button>
                </div>
            </div>

            {/* Utility Bar Node */}
            <div className="pro-card p-3 flex items-center justify-between bg-white/50 backdrop-blur-sm">
                <div className="flex items-center gap-2.5 flex-1">
                    <Search className="w-3.5 h-3.5 text-slate-400" />
                    <input type="text" placeholder="Search categories..." className="bg-transparent text-[12px] font-medium outline-none w-full" />
                </div>
                <div className="flex items-center gap-2">
                    <button className="p-1.5 hover:bg-slate-100 rounded text-slate-400"><Filter className="w-3.5 h-3.5" /></button>
                </div>
            </div>

            {/* Database Manifest Node */}
            <div className="pro-card overflow-hidden">
                <table className="pro-table">
                    <thead>
                        <tr>
                            <th>Category Identity</th>
                            <th>Operational Status</th>
                            <th className="text-right">Action Protocol</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="3" className="py-20 text-center pro-subheading animate-pulse">Scanning Classification Vaults...</td></tr>
                        ) : data.map((cat, idx) => (
                            <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                                <td className="font-semibold text-slate-900">{cat.name}</td>
                                <td>
                                    <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-bold uppercase tracking-wider border border-emerald-100">
                                        {cat.status}
                                    </span>
                                </td>
                                <td className="flex items-center justify-end gap-2">
                                    <button className="p-2 bg-slate-50 text-slate-400 rounded-lg hover:bg-slate-900 hover:text-white transition-all shadow-sm"><Edit3 className="w-3.5 h-3.5" /></button>
                                    <button className="p-2 bg-rose-50 text-rose-400 rounded-lg hover:bg-rose-500 hover:text-white transition-all shadow-sm"><Trash2 className="w-3.5 h-3.5" /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Creation Modal Artifact */}
            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/20 backdrop-blur-sm animate-pro-in">
                    <div className="bg-white w-full max-w-md rounded-2xl overflow-hidden shadow-2xl border border-slate-100">
                        <div className="px-8 py-5 border-b border-slate-100 flex items-center justify-between">
                            <h3 className="pro-heading text-lg">Provision Category Node</h3>
                            <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 rounded-xl transition-all text-slate-400"><X className="w-5 h-5" /></button>
                        </div>
                        <div className="p-8 space-y-6">
                            <div className="space-y-2">
                                <label className="pro-subheading pl-1">Category Identity*</label>
                                <input type="text" placeholder="E.G. DAIRY PRODUCTS..." className="pro-input" />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button onClick={() => setShowModal(false)} className="flex-1 pro-btn-secondary">Abort</button>
                                <button onClick={() => setShowModal(false)} className="flex-[2] pro-btn-primary text-xs uppercase tracking-widest font-black italic">Create Artifact</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RMCategory;
