import React, { useState, useEffect } from "react";
import { 
  ShieldCheck, Search, Filter, Download, BarChart3, TrendingUp,
  Zap, CheckCircle2, RefreshCw, ChevronDown, Monitor, 
  Truck, Smartphone, Globe, Database, ListTree, Settings2, 
  Shield, ArrowRight, Plus, X, Trash2, Edit3, Percent, Layers, ChevronRight
} from "lucide-react";
import API_BASE from "../config";

const RawMaterialTax = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/api/brand/analytics/rm-tax`, {
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
                        <ShieldCheck className="w-5 h-5 text-slate-800" />
                    </div>
                    <div>
                        <h2 className="text-[14px] font-bold text-slate-800 uppercase tracking-tight">Compliance Matrix</h2>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Tax values, dividable protocols & group-level compliance artifacts</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={() => setShowModal(true)} className="px-4 py-2 bg-slate-900 text-white rounded-md font-bold text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center gap-2 shadow-md shadow-slate-900/10">
                        <Plus className="w-3.5 h-3.5" /> Provision New Tax Artifact
                    </button>
                </div>
            </div>

            {/* Tactical Control Bar */}
            <div className="bg-white p-4 border border-slate-200 rounded-lg shadow-sm flex items-center justify-between relative overflow-hidden group">
                <div className="flex items-center gap-4 relative z-10">
                    <div className="flex items-center gap-2.5 px-4 py-2 bg-slate-50 rounded-md border border-slate-200">
                        <input type="checkbox" className="w-3.5 h-3.5 rounded border-slate-300 text-slate-900 focus:ring-slate-900 cursor-pointer" id="show-deactivated" />
                        <label htmlFor="show-deactivated" className="text-[10px] font-bold uppercase tracking-wider text-slate-500 cursor-pointer">Show Deactivated Compliance Artifacts</label>
                    </div>
                    <div className="h-4 w-px bg-slate-200" />
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tracking tax yields across raw material product groups.</p>
                </div>
                <div className="relative z-10">
                    <RefreshCw className={`w-4 h-4 text-slate-200 cursor-pointer hover:text-slate-400 transition-colors ${loading ? 'animate-spin' : ''}`} onClick={fetchData} />
                </div>
                <ShieldCheck className="absolute -right-12 -bottom-12 w-48 h-48 text-slate-900/[0.03] pointer-events-none group-hover:rotate-12 transition-transform duration-1000" />
            </div>

            {/* Tax Manifest Theater */}
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
                <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
                    <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-900" /> Raw Material Tax Manifest
                    </h3>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{data.length} Artifacts Tracked</span>
                </div>

                <div className="flex-1 overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">ID</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Tax Identity</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Yield Value</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Group Matrix</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Protocols</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center">Status</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Created</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr><td colSpan="8" className="py-24 text-center text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] animate-pulse">Scanning Compliance Vaults...</td></tr>
                            ) : data.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="py-24 text-center">
                                        <div className="flex flex-col items-center gap-4 opacity-20">
                                            <div className="w-20 h-20 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center">
                                                <Percent className="w-10 h-10 text-slate-400" />
                                            </div>
                                            <p className="text-[12px] font-bold text-slate-500 uppercase tracking-widest">Compliance Matrix Clean</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : data.map((row, idx) => (
                                <tr key={idx} className="group hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-6">
                                        <span className="text-[11px] font-bold text-slate-400 italic">#{row.id}</span>
                                    </td>
                                    <td className="px-6 py-6">
                                        <span className="text-[13px] font-bold text-slate-800 uppercase tracking-tight">{row.tax_name}</span>
                                    </td>
                                    <td className="px-6 py-6 text-right">
                                        <div className="flex items-center justify-end gap-1 text-indigo-600">
                                            <span className="text-[18px] font-bold tracking-tight">{row.tax_value}</span>
                                            <Percent className="w-3.5 h-3.5" />
                                        </div>
                                    </td>
                                    <td className="px-6 py-6">
                                        <div className="flex items-center gap-2 text-slate-500">
                                            <Layers className="w-3.5 h-3.5" />
                                            <span className="text-[11px] font-bold uppercase tracking-tight">{row.group_name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6">
                                        <div className="flex items-center gap-1.5">
                                            <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest border ${row.is_dividable ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 'bg-slate-50 text-slate-400 border-slate-100 opacity-50'}`}>DIVIDABLE</span>
                                            <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest border ${row.include_in_rate ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-400 border-slate-100 opacity-50'}`}>INC IN RATE</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6 text-center">
                                        <span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 rounded text-[9px] font-bold uppercase tracking-widest border border-emerald-100">ACTIVE</span>
                                    </td>
                                    <td className="px-6 py-6 text-[11px] font-bold text-slate-500 uppercase tracking-tight">
                                        {new Date(row.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-6 text-right">
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
                    <div className="bg-white w-full max-w-2xl rounded-xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 border border-slate-200">
                        <div className="px-8 py-6 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <ShieldCheck className="w-6 h-6 text-slate-900" />
                                <h3 className="text-[16px] font-bold uppercase tracking-tight text-slate-900">Provision Compliance Artifact</h3>
                            </div>
                            <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-200 rounded-lg transition-all text-slate-400">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-8 space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest px-1">Tax Identity Name*</label>
                                    <input type="text" placeholder="ENTER TAX NAME..." className="w-full h-11 bg-slate-50 border border-slate-200 rounded-lg px-4 text-[12px] font-bold text-slate-900 uppercase outline-none focus:border-indigo-500 transition-all" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest px-1">Display Identifier*</label>
                                    <input type="text" placeholder="ENTER DISPLAY NAME..." className="w-full h-11 bg-slate-50 border border-slate-200 rounded-lg px-4 text-[12px] font-bold text-slate-900 uppercase outline-none focus:border-indigo-500 transition-all" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest px-1">Yield Value (%)*</label>
                                    <input type="number" placeholder="0.00" className="w-full h-11 bg-slate-50 border border-slate-200 rounded-lg px-4 text-[12px] font-bold text-slate-900 outline-none focus:border-indigo-500 transition-all" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest px-1">Material Group Matrix*</label>
                                    <select className="w-full h-11 bg-slate-50 border border-slate-200 rounded-lg px-4 text-[12px] font-bold text-slate-900 uppercase outline-none focus:border-indigo-500 transition-all appearance-none cursor-pointer">
                                        <option>SELECT RAW MATERIAL GROUP</option>
                                        <option>GENERAL GROUP</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-3 gap-4">
                                {[
                                    { label: "Active Node", sub: "Enable artifact", checked: true },
                                    { label: "Is Dividable", sub: "Split protocol", checked: false },
                                    { label: "Inc In Rate", sub: "Yield inside", checked: true }
                                ].map((toggle, i) => (
                                    <div key={i} className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-3">
                                        <div className="space-y-0.5">
                                            <h4 className="text-[10px] font-bold uppercase text-slate-900">{toggle.label}</h4>
                                            <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{toggle.sub}</p>
                                        </div>
                                        <div className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" defaultChecked={toggle.checked} />
                                            <div className="w-10 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-slate-900"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button onClick={() => setShowModal(false)} className="flex-1 h-12 bg-slate-50 text-slate-600 rounded-lg font-bold uppercase tracking-widest text-[10px] hover:bg-slate-100 transition-all border border-slate-200">Close</button>
                                <button onClick={() => setShowModal(false)} className="flex-[2] h-12 bg-slate-900 text-white rounded-lg font-bold uppercase tracking-widest text-[10px] hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10">Provision Tax Node</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RawMaterialTax;
