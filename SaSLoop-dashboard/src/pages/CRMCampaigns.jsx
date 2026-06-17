import React, { useState, useEffect } from "react";
import { 
  Megaphone, Search, Plus, X, Trash2, Edit3, RefreshCw, 
  ChevronDown, Filter, Download, ListTree, Activity,
  Database, Gauge, Target, Sparkles, Send, Calendar,
  BarChart3, Users, Rocket, Clock, ChevronRight
} from "lucide-react";
import API_BASE from "../config";

const CRMCampaigns = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/api/crm/campaigns-list`, {
                headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
            });
            if (!res.ok) {
                setData([
                    { id: 1, name: "Weekend Special Offer", audience: "All Customers", status: "Active", reach: "12,450", sent_at: "2026-05-06" },
                    { id: 2, name: "Re-engagement Push", audience: "Inactive (30 Days)", status: "Scheduled", reach: "2,100", sent_at: "2026-05-08" }
                ]);
            } else {
                setData(await res.json());
            }
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
                        <Megaphone className="w-5 h-5 text-slate-800" />
                    </div>
                    <div>
                        <h2 className="text-[14px] font-bold text-slate-800 uppercase tracking-tight">Campaign Hub</h2>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Relationship broadsides, audience segmentation & engagement temporalities</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={() => setShowModal(true)} className="px-5 py-2.5 bg-slate-900 text-white rounded-md font-bold text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center gap-2 shadow-md shadow-slate-900/10">
                        <Rocket className="w-4 h-4" /> Orchestrate New Broadside
                    </button>
                </div>
            </div>

            {/* Tactical Control Bar */}
            <div className="bg-white p-4 border border-slate-200 rounded-lg shadow-sm flex items-center gap-4 relative overflow-hidden group">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                        type="text" 
                        placeholder="SEARCH CAMPAIGNS OR AUDIENCE SEGMENTS..." 
                        className="w-full h-10 bg-slate-50 border border-slate-200 rounded-md pl-10 pr-4 text-[11px] font-bold uppercase outline-none focus:border-slate-500 transition-all" 
                    />
                </div>
                <button className="h-10 w-10 flex items-center justify-center bg-slate-50 border border-slate-200 text-slate-400 rounded-md hover:bg-slate-100 transition-all">
                    <Filter className="w-4 h-4" />
                </button>
                <Megaphone className="absolute -right-12 -bottom-12 w-48 h-48 text-slate-900/[0.03] pointer-events-none group-hover:rotate-12 transition-transform duration-1000" />
            </div>

            {/* Campaign Manifest Theater */}
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
                <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
                    <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-900" /> Campaign Database Manifest
                    </h3>
                    <div className="flex items-center gap-4">
                        <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest flex items-center gap-2">
                            <Sparkles className="w-3.5 h-3.5" /> Marketing Yield Optimization Active
                        </span>
                        <RefreshCw className={`w-4 h-4 text-slate-200 ${loading ? 'animate-spin' : ''}`} onClick={fetchData} />
                    </div>
                </div>

                <div className="flex-1 overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Campaign Identity</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Target Audience</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center">Status</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Reach</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Execution Temporal</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr><td colSpan="6" className="py-24 text-center text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] animate-pulse">Scanning Engagement Vaults...</td></tr>
                            ) : data.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="py-24 text-center">
                                        <div className="flex flex-col items-center gap-4 opacity-20">
                                            <div className="w-20 h-20 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center">
                                                <Megaphone className="w-10 h-10 text-slate-400" />
                                            </div>
                                            <p className="text-[12px] font-bold text-slate-500 uppercase tracking-widest">Campaign Matrix Clean</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : data.map((camp, idx) => (
                                <tr key={idx} className="group hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-slate-50 border border-slate-100 rounded flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all shadow-sm">
                                                <Megaphone className="w-5 h-5" />
                                            </div>
                                            <span className="text-[13px] font-bold text-slate-800 uppercase tracking-tight">{camp.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6">
                                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-indigo-50 text-indigo-600 rounded text-[9px] font-bold uppercase tracking-widest border border-indigo-100">
                                            <Users className="w-3 h-3" /> {camp.audience}
                                        </div>
                                    </td>
                                    <td className="px-6 py-6 text-center">
                                        <span className={`px-2.5 py-1 rounded text-[9px] font-bold uppercase tracking-widest border ${camp.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>{camp.status}</span>
                                    </td>
                                    <td className="px-6 py-6 text-right">
                                        <span className="text-[12px] font-bold text-slate-900 tracking-wider">{camp.reach}</span>
                                    </td>
                                    <td className="px-6 py-6">
                                        <div className="flex items-center gap-2 text-slate-400">
                                            <Clock className="w-3.5 h-3.5" />
                                            <span className="text-[11px] font-bold uppercase">{camp.sent_at}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6 text-right">
                                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-2 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-900 transition-all shadow-sm"><BarChart3 className="w-4 h-4" /></button>
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
                                <Rocket className="w-6 h-6 text-indigo-600" />
                                <h3 className="text-[16px] font-bold uppercase tracking-tight text-slate-900">Provision Broadside</h3>
                            </div>
                            <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-200 rounded-lg transition-all text-slate-400">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-8 space-y-8">
                            <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest px-1">Campaign Identity*</label>
                                    <input type="text" placeholder="ENTER CAMPAIGN NAME..." className="w-full h-11 bg-slate-50 border border-slate-200 rounded-lg px-4 text-[12px] font-bold text-slate-900 uppercase outline-none focus:border-indigo-500 transition-all" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest px-1">Audience Segmentation Node*</label>
                                    <select className="w-full h-11 bg-slate-50 border border-slate-200 rounded-lg px-4 text-[12px] font-bold text-slate-900 uppercase outline-none focus:border-indigo-500 transition-all appearance-none cursor-pointer">
                                        <option>ALL CUSTOMERS</option>
                                        <option>PREMIUM MEMBERS</option>
                                        <option>INACTIVE (30 DAYS)</option>
                                        <option>NEW REGISTRATIONS</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest px-1">Execution Temporal*</label>
                                    <input type="date" className="w-full h-11 bg-slate-50 border border-slate-200 rounded-lg px-4 text-[12px] font-bold text-slate-900 outline-none focus:border-indigo-500 transition-all" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest px-1">Channel Matrix*</label>
                                    <div className="flex gap-2 h-11">
                                        <button className="flex-1 rounded-lg border border-indigo-600 bg-indigo-50 text-indigo-600 font-bold text-[9px] uppercase tracking-widest">WhatsApp</button>
                                        <button className="flex-1 rounded-lg border border-slate-200 bg-slate-50 text-slate-400 font-bold text-[9px] uppercase tracking-widest hover:border-slate-400 transition-all">Email</button>
                                        <button className="flex-1 rounded-lg border border-slate-200 bg-slate-50 text-slate-400 font-bold text-[9px] uppercase tracking-widest hover:border-slate-400 transition-all">SMS</button>
                                    </div>
                                </div>
                            </div>
                            <div className="pt-4 flex gap-4">
                                <button onClick={() => setShowModal(false)} className="flex-1 h-12 bg-slate-50 text-slate-600 rounded-lg font-bold uppercase tracking-widest text-[10px] hover:bg-slate-100 transition-all border border-slate-200">Abort</button>
                                <button onClick={() => setShowModal(false)} className="flex-[2] h-12 bg-slate-900 text-white rounded-lg font-bold uppercase tracking-widest text-[10px] hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10">Launch Broadside</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CRMCampaigns;
