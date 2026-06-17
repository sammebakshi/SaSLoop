import React, { useState, useEffect } from "react";
import { 
  Layers, Search, Filter, Download, BarChart3, TrendingUp,
  Zap, CheckCircle2, RefreshCw, ChevronDown, Monitor, 
  Truck, Smartphone, Globe, Database, ListTree, Settings2, 
  ShieldCheck, ArrowRight, Plus, Box, Trash2, Edit3, X, ChevronRight
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
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-50 rounded-lg">
                        <Layers className="w-5 h-5 text-slate-800" />
                    </div>
                    <div>
                        <h2 className="text-[14px] font-bold text-slate-800 uppercase tracking-tight">Grouping Matrix</h2>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Raw material product groups & active node states</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={() => setShowModal(true)} className="px-4 py-2 bg-slate-900 text-white rounded-md font-bold text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center gap-2 shadow-md shadow-slate-900/10">
                        <Plus className="w-3.5 h-3.5" /> Provision New Product Group
                    </button>
                </div>
            </div>

            {/* Tactical Control Bar */}
            <div className="bg-white p-4 border border-slate-200 rounded-lg shadow-sm flex items-center justify-between relative overflow-hidden group">
                <div className="flex items-center gap-4 relative z-10">
                    <div className="flex items-center gap-2.5 px-4 py-2 bg-slate-50 rounded-md border border-slate-200">
                        <input type="checkbox" className="w-3.5 h-3.5 rounded border-slate-300 text-slate-900 focus:ring-slate-900 cursor-pointer" id="show-deactivated" />
                        <label htmlFor="show-deactivated" className="text-[10px] font-bold uppercase tracking-wider text-slate-500 cursor-pointer">Show Deactivated Groups</label>
                    </div>
                    <div className="h-4 w-px bg-slate-200" />
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Real-time tracking of raw material hierarchies.</p>
                </div>
                <div className="relative z-10">
                    <RefreshCw className={`w-4 h-4 text-slate-200 cursor-pointer hover:text-slate-400 transition-colors ${loading ? 'animate-spin' : ''}`} onClick={fetchData} />
                </div>
                <Layers className="absolute -right-12 -bottom-12 w-48 h-48 text-slate-900/[0.03] pointer-events-none group-hover:rotate-12 transition-transform duration-1000" />
            </div>

            {/* Group Manifest Theater */}
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
                <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
                    <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-900" /> Raw Material Group Manifest
                    </h3>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{data.length} Artifacts Tracked</span>
                </div>

                <div className="flex-1 overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="px-8 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">ID</th>
                                <th className="px-8 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Group Identity</th>
                                <th className="px-8 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center">Status</th>
                                <th className="px-8 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Created Artifact</th>
                                <th className="px-8 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr><td colSpan="5" className="py-24 text-center text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] animate-pulse">Scanning Group Vaults...</td></tr>
                            ) : data.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="py-24 text-center">
                                        <div className="flex flex-col items-center gap-4 opacity-20">
                                            <div className="w-20 h-20 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center">
                                                <Layers className="w-10 h-10 text-slate-400" />
                                            </div>
                                            <p className="text-[12px] font-bold text-slate-500 uppercase tracking-widest">Grouping Matrix Clean</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : data.map((row, idx) => (
                                <tr key={idx} className="group hover:bg-slate-50/50 transition-colors">
                                    <td className="px-8 py-6">
                                        <span className="text-[11px] font-bold text-slate-400 italic">#{row.id}</span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-1.5 h-1.5 bg-slate-900 rounded-full group-hover:scale-150 transition-all duration-300" />
                                            <span className="text-[13px] font-bold text-slate-800 uppercase tracking-tight">{row.group_name}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 rounded text-[9px] font-bold uppercase tracking-widest border border-emerald-100">ACTIVE NODE</span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col">
                                            <span className="text-[11px] font-bold text-slate-600 uppercase tracking-tight">{new Date(row.created_at).toLocaleDateString()}</span>
                                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{new Date(row.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-2 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-900 transition-all shadow-sm"><Edit3 className="w-4 h-4" /></button>
                                            <button className="p-2 hover:bg-rose-50 rounded text-rose-400 hover:text-rose-600 transition-all shadow-sm"><Trash2 className="w-3.5 h-3.5" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Orchestration Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-lg rounded-xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 border border-slate-200">
                        <div className="px-8 py-6 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Plus className="w-6 h-6 text-slate-900" />
                                <h3 className="text-[16px] font-bold uppercase tracking-tight text-slate-900">Provision Product Group</h3>
                            </div>
                            <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-200 rounded-lg transition-all text-slate-400">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-8 space-y-6">
                            <div className="space-y-2">
                                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest px-1">Group Identity Name*</label>
                                <input type="text" placeholder="ENTER GROUP NAME..." className="w-full h-11 bg-slate-50 border border-slate-200 rounded-lg px-4 text-[12px] font-bold text-slate-900 uppercase outline-none focus:border-slate-500 transition-all" />
                            </div>
                            <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <h4 className="text-[12px] font-bold uppercase text-slate-900">Active Node Status</h4>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Enable or disable this grouping artifact</p>
                                </div>
                                <div className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" defaultChecked />
                                    <div className="w-12 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-slate-900"></div>
                                </div>
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button onClick={() => setShowModal(false)} className="flex-1 h-12 bg-slate-50 text-slate-600 rounded-lg font-bold uppercase tracking-widest text-[10px] hover:bg-slate-100 transition-all border border-slate-200">Close</button>
                                <button onClick={() => setShowModal(false)} className="flex-[2] h-12 bg-slate-900 text-white rounded-lg font-bold uppercase tracking-widest text-[10px] hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10">Create Artifact</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RawMaterialGroup;
