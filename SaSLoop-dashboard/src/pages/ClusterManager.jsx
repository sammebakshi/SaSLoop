import React, { useState, useEffect } from "react";
import { 
  Plus, Search, RefreshCw, Filter, 
  Trash2, Edit3, MapPin, Layers
} from "lucide-react";
import API_BASE from "../config";

const ClusterManager = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/api/clusters`, {
                headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
            });
            if (res.ok) setData(await res.json());
            else {
                setData([
                    { id: 1, name: "North Delhi Hub", city: "New Delhi", outlets: 5, status: "Active" },
                    { id: 2, name: "South Mumbai Node", city: "Mumbai", outlets: 3, status: "Active" }
                ]);
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
                    <div className="p-2 bg-indigo-50 rounded-lg">
                        <Layers className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                        <h2 className="text-[14px] font-bold text-slate-800 uppercase tracking-tight">Cluster Orchestration</h2>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Regional grouping & outlet hierarchy</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={fetchData} className="px-4 py-2 bg-white border border-slate-200 rounded-md text-[10px] font-bold text-slate-600 uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2">
                        <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Sync
                    </button>
                    <button className="px-4 py-2 bg-indigo-600 text-white rounded-md font-bold text-[10px] uppercase tracking-widest hover:bg-indigo-500 transition-all flex items-center gap-2 shadow-md shadow-indigo-600/10">
                        <Plus className="w-3.5 h-3.5" /> Create Cluster
                    </button>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                    <Search className="w-4 h-4 text-slate-400" />
                    <input type="text" placeholder="Search clusters..." className="bg-transparent text-[11px] font-bold text-slate-600 outline-none w-full uppercase placeholder:text-slate-300" />
                </div>
                <button className="p-2 hover:bg-slate-50 rounded-md text-slate-400 border border-transparent hover:border-slate-200 transition-all"><Filter className="w-4 h-4" /></button>
            </div>

            {/* High-Density Grid */}
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm flex flex-col overflow-hidden min-h-[400px]">
                <div className="flex-1 overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Cluster Identity</th>
                                <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Territory</th>
                                <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Node Count</th>
                                <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Operations</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr><td colSpan="5" className="py-24 text-center text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] animate-pulse">Scanning Cluster Nodes...</td></tr>
                            ) : data.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="py-24 text-center">
                                        <div className="flex flex-col items-center gap-3 opacity-20">
                                            <div className="w-16 h-16 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center">
                                                <Layers className="w-8 h-8 text-slate-400" />
                                            </div>
                                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">No Clusters Defined</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : data.map((item, idx) => (
                                <tr key={idx} className="group hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all">
                                                <Layers className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <p className="text-[13px] font-bold text-slate-800 uppercase tracking-tight">{item.name}</p>
                                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest opacity-60">ID: CLS_{item.id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-bold uppercase tracking-tight">
                                            <MapPin className="w-3.5 h-3.5 text-slate-300" /> {item.city}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-bold text-slate-800 text-[12px] uppercase tracking-tight">
                                        {item.outlets} Nodes
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-2.5 py-1 rounded-[4px] bg-indigo-50 border border-indigo-100 text-[9px] font-bold uppercase text-indigo-600 tracking-widest">
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-1">
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

export default ClusterManager;
