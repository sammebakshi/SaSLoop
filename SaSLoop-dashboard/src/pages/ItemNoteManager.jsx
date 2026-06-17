import React, { useState, useEffect } from "react";
import { 
  StickyNote, Trash2, Search, RefreshCw, 
  Filter, Edit3, Plus, Tag, 
  Layers, CheckCircle2, ListChecks, ChevronRight
} from "lucide-react";
import API_BASE from "../config";

const ItemNoteManager = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const res = await fetch(`${API_BASE}/api/item-notes`, {
                headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
            });
            const d = await res.json();
            setData(Array.isArray(d) ? d : []);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchData(); }, []);

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-50 rounded-lg">
                        <StickyNote className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                        <h2 className="text-[14px] font-bold text-slate-800 uppercase tracking-tight">Item Note Architect</h2>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">POS quick modifiers & kitchen presets</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={fetchData} className="px-4 py-2 bg-white border border-slate-200 rounded-md text-[10px] font-bold text-slate-600 uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2">
                        <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Sync
                    </button>
                    <button className="px-4 py-2 bg-indigo-600 text-white rounded-md font-bold text-[10px] uppercase tracking-widest hover:bg-indigo-500 transition-all flex items-center gap-2 shadow-md shadow-indigo-600/10">
                        <Plus className="w-3.5 h-3.5" /> Add Note Group
                    </button>
                </div>
            </div>

            {/* High-Density Grid */}
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm flex flex-col overflow-hidden min-h-[400px]">
                <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
                    <div className="flex items-center gap-3 flex-1 max-w-sm">
                        <Search className="w-4 h-4 text-slate-400" />
                        <input type="text" placeholder="Search note groups..." className="bg-transparent text-[11px] font-bold text-slate-600 outline-none w-full uppercase placeholder:text-slate-300" />
                    </div>
                    <button className="p-2 hover:bg-white rounded-md text-slate-400 border border-transparent hover:border-slate-200 transition-all"><Filter className="w-4 h-4" /></button>
                </div>

                <div className="flex-1 overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Note Group Identity</th>
                                <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Tags & Visuals</th>
                                <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Ops</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr><td colSpan="4" className="py-24 text-center text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] animate-pulse">Scanning Preset Matrix...</td></tr>
                            ) : data.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="py-24 text-center">
                                        <div className="flex flex-col items-center gap-3 opacity-20">
                                            <div className="w-16 h-16 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center">
                                                <StickyNote className="w-8 h-8 text-slate-400" />
                                            </div>
                                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Preset Matrix Clean: No Notes Found</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : data.map(item => (
                                <tr key={item.id} className="group hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-sm group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                                <StickyNote className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <p className="text-[13px] font-bold text-slate-800 uppercase tracking-tight">{item.name}</p>
                                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">PRESET_{item.id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1.5 flex-wrap">
                                            {item.notes?.slice(0, 3).map((note, idx) => (
                                                <span key={idx} className="px-2 py-0.5 bg-slate-50 border border-slate-200 text-[9px] font-bold uppercase text-slate-500 rounded-[4px]">{note}</span>
                                            ))}
                                            {item.notes?.length > 3 && <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">+{item.notes.length - 3} MORE</span>}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-2.5 py-0.5 rounded-[4px] bg-emerald-50 text-emerald-600 border border-emerald-100 text-[9px] font-bold uppercase tracking-widest">Active Hub</span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <button className="p-2 hover:bg-white rounded-md text-slate-400 border border-transparent hover:border-slate-200 transition-all"><ListChecks className="w-4 h-4" /></button>
                                            <button className="p-2 hover:bg-white rounded-md text-slate-400 border border-transparent hover:border-slate-200 transition-all"><Edit3 className="w-4 h-4" /></button>
                                            <button className="p-2 hover:bg-rose-50 rounded-md text-rose-400 border border-transparent hover:border-rose-200 transition-all"><Trash2 className="w-4 h-4" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ItemNoteManager;
