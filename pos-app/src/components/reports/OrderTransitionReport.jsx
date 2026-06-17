import React, { useState, useEffect } from "react";
import { 
  Activity, Search, Filter, Download, BarChart3, TrendingUp,
  Zap, CheckCircle2, RefreshCw, ChevronDown, Monitor, 
  Truck, Smartphone, Globe, Database, ListTree, Settings2, 
  ShieldCheck, Clock, Calendar, ArrowRight, Timer, PlayCircle,
  CheckCircle, Send, PackageCheck, XCircle, ChevronRight
} from "lucide-react";
import { API_BASE } from "../../services/api";

const OrderTransitionReport = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [outlets, setOutlets] = useState([]);

    const [filters, setFilters] = useState({
        outlet_id: ""
    });

    const fetchData = async () => {
        if (!filters.outlet_id) return;
        setLoading(true);
        try {
            const q = new URLSearchParams(filters).toString();
            const res = await fetch(`${API_BASE}/api/brand/analytics/order-transition?${q}`, {
                headers: { "Authorization": `Bearer ${localStorage.getItem("pos_token")}` }
            });
            setData(await res.json());
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    useEffect(() => {
        const loadOutlets = async () => {
            const res = await fetch(`${API_BASE}/api/brand/outlets`, {
                headers: { "Authorization": `Bearer ${localStorage.getItem("pos_token")}` }
            });
            const d = await res.json();
            setOutlets(d);
            if (d.length > 0) setFilters(prev => ({ ...prev, outlet_id: d[0].id }));
        };
        loadOutlets();
    }, []);

    useEffect(() => { fetchData(); }, [filters.outlet_id]);

    const formatTime = (t) => t ? new Date(t).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '--:--:--';

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-50 rounded-lg">
                        <Activity className="w-5 h-5 text-slate-800" />
                    </div>
                    <div>
                        <h2 className="text-[14px] font-bold text-slate-800 uppercase tracking-tight">Lifecycle Transitions</h2>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Order states from Placed to Food-Ready temporal precision</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button className="px-4 py-2 bg-slate-900 text-white rounded-md font-bold text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center gap-2 shadow-md shadow-slate-900/10">
                        <Download className="w-3.5 h-3.5" /> Export Transition Audit
                    </button>
                </div>
            </div>

            {/* Tactical Audit Board */}
            <div className="bg-white p-6 border border-slate-200 rounded-lg shadow-sm relative overflow-hidden group">
                <div className="relative z-10 grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                    <div className="space-y-1.5 md:col-span-3 hidden">
                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider px-1">Target Operating Hub</label>
                        <select className="w-full h-9 bg-slate-50 border border-slate-200 rounded-md px-3 text-[11px] font-bold uppercase outline-none focus:border-slate-500 transition-all cursor-pointer" value={filters.outlet_id} onChange={e => setFilters({...filters, outlet_id: e.target.value})}>
                            {outlets.map(o => <option key={o.id} value={o.id}>{o.name.toUpperCase()}</option>)}
                        </select>
                    </div>
                    <button onClick={fetchData} className="h-9 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest rounded-md hover:bg-slate-800 transition-all shadow-md shadow-slate-900/10 active:scale-95 flex items-center justify-center gap-2">
                        <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Execute Lifecycle Audit
                    </button>
                </div>
                <Activity className="absolute -right-12 -bottom-12 w-48 h-48 text-slate-900/[0.03] pointer-events-none group-hover:rotate-12 transition-transform duration-1000" />
            </div>

            {/* Transition Manifest Theater */}
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
                <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
                    <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-900" /> Order Transition Report Manifest
                    </h3>
                </div>

                <div className="flex-1 overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Sr. No.</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Order Context</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center">Placed</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center">Accepted</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center">Ready</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center">Dispatched</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center">Completed</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-rose-500 uppercase tracking-wider text-center">Cancelled</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr><td colSpan="8" className="py-24 text-center text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] animate-pulse">Scanning Transition Vaults...</td></tr>
                            ) : data.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="py-24 text-center">
                                        <div className="flex flex-col items-center gap-4 opacity-20">
                                            <div className="w-20 h-20 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center">
                                                <Activity className="w-10 h-10 text-slate-400" />
                                            </div>
                                            <div>
                                                <p className="text-[12px] font-bold text-slate-500 uppercase tracking-widest">Transition Matrix Clean</p>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">Zero Artifacts Provisioned</p>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ) : data.map((row, idx) => (
                                <tr key={idx} className="group hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-6 text-[11px] font-bold text-slate-400 italic">#{idx + 1}</td>
                                    <td className="px-6 py-6">
                                        <div className="flex flex-col gap-0.5">
                                            <span className="font-bold text-slate-800 uppercase tracking-tight text-[12px]">ORD#{row.order_id}</span>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-[9px] font-bold uppercase text-slate-400 tracking-widest">{row.platform}</span>
                                                <div className="w-1 h-1 rounded-full bg-slate-300" />
                                                <span className="text-[9px] font-bold uppercase text-slate-400 tracking-widest">{row.order_type}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6 text-center text-[11px] font-bold text-slate-500">{formatTime(row.placed_time)}</td>
                                    <td className="px-6 py-6 text-center text-[11px] font-bold text-emerald-600">{formatTime(row.ack_time)}</td>
                                    <td className="px-6 py-6 text-center text-[11px] font-bold text-amber-500">{formatTime(row.food_ready_time)}</td>
                                    <td className="px-6 py-6 text-center text-[11px] font-bold text-blue-600">{formatTime(row.dispatched_time)}</td>
                                    <td className="px-6 py-6 text-center text-[11px] font-bold text-slate-900 bg-slate-50/50">{formatTime(row.completed_time)}</td>
                                    <td className="px-6 py-6 text-center text-[11px] font-bold text-rose-500">{formatTime(row.cancelled_time)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default OrderTransitionReport;
