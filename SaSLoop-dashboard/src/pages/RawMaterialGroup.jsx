import React, { useState, useEffect } from "react";
import { 
  Layers, Search, Filter, Download, BarChart3, TrendingUp,
  Zap, CheckCircle2, RefreshCw, ChevronDown, Monitor, 
  Truck, Smartphone, Globe, Database, ListTree, Settings2, 
  ShieldCheck, ArrowRight, Plus, Box, Trash2, Edit3, X
} from "lucide-react";
import API_BASE from "../config";

const RawMaterialGroup = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/api/brand/analytics/rm-groups`, {
                headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
            });
            setData(await res.json());
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchData(); }, []);

    return (
        <div className="max-w-[1600px] mx-auto py-10 px-10 space-y-12 pb-20">
            
            <div className="space-y-2">
                <h2 className="text-6xl font-black text-slate-900 tracking-tighter uppercase italic underline decoration-slate-900">
                    Grouping Matrix
                </h2>
                <p className="text-slate-500 text-sm font-bold opacity-50 uppercase tracking-widest pl-2 flex items-center gap-2">
                    <Layers className="w-3 h-3 text-slate-900" /> Real-time tracking of raw material product groups & active node states
                </p>
            </div>

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 px-6 py-4 bg-white rounded-2xl border border-slate-200">
                    <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 italic">Show Deactivated Groups</span>
                </div>
                <button onClick={() => setShowModal(true)} className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center gap-3 hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 italic">
                    <Plus className="w-4 h-4" /> Provision New Product Group
                </button>
            </div>

            <div className="bg-white rounded-[4rem] border border-slate-50 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.05)] overflow-hidden">
                <div className="px-12 py-10 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] flex items-center gap-3 italic text-slate-900">
                        <div className="w-6 h-1 bg-slate-900 rounded-full" /> Raw material group Manifest
                    </h3>
                    <RefreshCw className="w-4 h-4 text-slate-300 animate-spin-slow" />
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-900 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                                <th className="px-12 py-8">ID</th>
                                <th className="px-12 py-8">Group Identity</th>
                                <th className="px-12 py-8">Status</th>
                                <th className="px-12 py-8">Created Artifact</th>
                                <th className="px-12 py-8 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                <tr><td colSpan="5" className="py-20 text-center font-black uppercase text-xs tracking-[0.5em] text-slate-300 animate-pulse">Scanning Group Vaults...</td></tr>
                            ) : data.length === 0 ? (
                                <tr><td colSpan="5" className="py-20 text-center font-black uppercase text-xs tracking-widest text-slate-400 italic">Zero Group Artifacts Provisioned</td></tr>
                            ) : data.map((row, idx) => (
                                <tr key={idx} className="group hover:bg-slate-50/50 transition-colors">
                                    <td className="px-12 py-8 text-xs font-black text-slate-400 italic">#{row.id}</td>
                                    <td className="px-12 py-8 font-black text-slate-900 uppercase italic tracking-tighter text-sm flex items-center gap-3">
                                        <div className="w-2 h-2 bg-slate-900 rounded-full group-hover:w-4 transition-all" />
                                        {row.group_name}
                                    </td>
                                    <td className="px-12 py-8">
                                        <span className="px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600 border border-emerald-100 italic">ACTIVE NODE</span>
                                    </td>
                                    <td className="px-12 py-8 text-[10px] font-black text-slate-400 uppercase tracking-widest italic">{new Date(row.created_at).toLocaleString()}</td>
                                    <td className="px-12 py-8">
                                        <div className="flex items-center gap-2 justify-center">
                                            <button className="p-3 bg-slate-100 text-slate-900 rounded-xl hover:bg-slate-900 hover:text-white transition-all"><Edit3 className="w-3.5 h-3.5" /></button>
                                            <button className="p-3 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/90 backdrop-blur-xl animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-xl rounded-[3rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
                        <div className="px-12 py-10 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                            <h3 className="text-xl font-black uppercase italic tracking-tighter text-slate-900">Provision Product Group</h3>
                            <button onClick={() => setShowModal(false)} className="p-3 bg-white border border-slate-200 rounded-2xl hover:bg-slate-900 hover:text-white transition-all">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-12 space-y-10">
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] pl-4 italic">Group Identity Name*</label>
                                <input type="text" placeholder="ENTER GROUP NAME..." className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-8 py-6 text-sm font-black text-slate-900 uppercase italic outline-none focus:border-slate-900 transition-all" />
                            </div>
                            <div className="flex items-center justify-between bg-slate-50 p-8 rounded-2xl border border-slate-100">
                                <div className="space-y-1">
                                    <h4 className="text-[10px] font-black uppercase italic text-slate-900">Active Node Status</h4>
                                    <p className="text-[9px] font-bold text-slate-400 uppercase italic">Enable or disable this grouping artifact</p>
                                </div>
                                <div className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" defaultChecked />
                                    <div className="w-14 h-8 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-slate-900 shadow-inner"></div>
                                </div>
                            </div>
                            <div className="flex gap-4 pt-6">
                                <button onClick={() => setShowModal(false)} className="flex-1 bg-slate-100 text-slate-900 py-6 rounded-2xl font-black uppercase tracking-widest text-[10px] italic hover:bg-slate-200 transition-all">Close</button>
                                <button onClick={() => setShowModal(false)} className="flex-[2] bg-slate-900 text-white py-6 rounded-2xl font-black uppercase tracking-widest text-[10px] italic hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20">Create Artifact</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default RawMaterialGroup;
