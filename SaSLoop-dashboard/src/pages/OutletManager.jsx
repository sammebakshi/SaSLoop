import React, { useState, useEffect } from "react";
import { 
  Plus, Search, RefreshCw, Filter, 
  Trash2, Edit3, MapPin, Store,
  ExternalLink, Copy, Check
} from "lucide-react";
import API_BASE from "../config";

const OutletManager = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [copiedId, setCopiedId] = useState(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/api/outlets`, {
                headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
            });
            if (res.ok) setData(await res.json());
            else {
                setData([
                    { id: 55, user_id: 55, name: "Shahe Tehzeeb Restaurant", city: "Srinagar", brand: "Shahe Tehzeeb", status: "Online" },
                    { id: 1, user_id: 1, name: "Main CP Outlet", city: "New Delhi", brand: "SaS Burger Co.", status: "Online" },
                    { id: 2, user_id: 2, name: "Andheri Hub", city: "Mumbai", brand: "Vibe Coffee", status: "Offline" }
                ]);
            }
        } catch (e) { 
            console.error(e); 
            setData([
                { id: 55, user_id: 55, name: "Shahe Tehzeeb Restaurant", city: "Srinagar", brand: "Shahe Tehzeeb", status: "Online" },
                { id: 1, user_id: 1, name: "Main CP Outlet", city: "New Delhi", brand: "SaS Burger Co.", status: "Online" }
            ]);
        }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchData(); }, []);

    const copyMenuLink = (targetId) => {
        const url = `${window.location.origin}/menu/${targetId}`;
        navigator.clipboard.writeText(url);
        setCopiedId(targetId);
        setTimeout(() => setCopiedId(null), 2000);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-50 rounded-lg">
                        <Store className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                        <h2 className="text-[14px] font-bold text-slate-800 uppercase tracking-tight">Outlet Orchestration</h2>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Unit-level operational nodes &amp; digital ordering links</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={fetchData} className="px-4 py-2 bg-white border border-slate-200 rounded-md text-[10px] font-bold text-slate-600 uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2">
                        <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Sync
                    </button>
                    <button className="px-4 py-2 bg-indigo-600 text-white rounded-md font-bold text-[10px] uppercase tracking-widest hover:bg-indigo-500 transition-all flex items-center gap-2 shadow-md shadow-indigo-600/10">
                        <Plus className="w-3.5 h-3.5" /> Deploy Outlet
                    </button>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                    <Search className="w-4 h-4 text-slate-400" />
                    <input type="text" placeholder="Search outlets..." className="bg-transparent text-[11px] font-bold text-slate-600 outline-none w-full uppercase placeholder:text-slate-300" />
                </div>
                <button className="p-2 hover:bg-slate-50 rounded-md text-slate-400 border border-transparent hover:border-slate-200 transition-all"><Filter className="w-4 h-4" /></button>
            </div>

            {/* High-Density Grid */}
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm flex flex-col overflow-hidden min-h-[400px]">
                <div className="flex-1 overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Unit Identity</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Parent Brand</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Territory</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Public Menu Link</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Operations</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr><td colSpan="6" className="py-24 text-center text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] animate-pulse">Scanning Outlet Vaults...</td></tr>
                            ) : data.map((item, idx) => {
                                const targetId = item.user_id || item.id;
                                const menuPath = `/menu/${targetId}`;

                                return (
                                    <tr key={idx} className="group hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all">
                                                    <Store className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <p className="text-[13px] font-bold text-slate-800 uppercase tracking-tight">{item.name}</p>
                                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest opacity-60">ID: OTL_{targetId}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-tight opacity-70">{item.brand}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-bold uppercase tracking-tight">
                                                <MapPin className="w-3.5 h-3.5 text-slate-300" /> {item.city}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <a
                                                    href={menuPath}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="px-3 py-1 bg-indigo-50 text-indigo-700 hover:bg-indigo-600 hover:text-white rounded-md text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 border border-indigo-100"
                                                >
                                                    <ExternalLink className="w-3 h-3" /> View Menu
                                                </a>
                                                <button
                                                    onClick={() => copyMenuLink(targetId)}
                                                    className="p-1.5 bg-slate-50 hover:bg-slate-100 rounded-md text-slate-500 text-[10px] font-bold flex items-center gap-1 border border-slate-200"
                                                    title="Copy Public Menu URL"
                                                >
                                                    {copiedId === targetId ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                                                </button>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className={`flex items-center gap-2 px-2.5 py-1 rounded-full border w-fit ${
                                                item.status === 'Online' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'
                                            }`}>
                                                <div className={`w-1.5 h-1.5 rounded-full ${item.status === 'Online' ? 'bg-emerald-500 animate-pulse shadow-sm shadow-emerald-500/50' : 'bg-rose-500'}`} />
                                                <span className="text-[9px] font-bold uppercase tracking-widest">{item.status}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <button className="p-2 hover:bg-white rounded-md text-slate-400 border border-transparent hover:border-slate-200 transition-all"><Edit3 className="w-4 h-4" /></button>
                                                <button className="p-2 hover:bg-rose-50 rounded-md text-rose-400 border border-transparent hover:border-rose-200 transition-all"><Trash2 className="w-4 h-4" /></button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default OutletManager;
