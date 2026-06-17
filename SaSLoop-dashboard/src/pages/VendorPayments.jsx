import React, { useState, useEffect } from "react";
import { 
  Landmark, Search, Filter, Download, BarChart3, TrendingUp,
  Zap, CheckCircle2, RefreshCw, ChevronDown, Monitor, 
  Truck, Smartphone, Globe, Database, ListTree, Settings2, 
  ShieldCheck, ArrowRight, Eye, User, Phone, IndianRupee,
  Activity, Clock, Calendar, AlertCircle, ChevronRight
} from "lucide-react";
import API_BASE from "../config";

const VendorPayments = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [outlets, setOutlets] = useState([]);

    const [filters, setFilters] = useState({
        outlet_id: "",
        date: new Date().toISOString().split('T')[0]
    });

    const fetchData = async () => {
        if (!filters.outlet_id) return;
        setLoading(true);
        try {
            const q = new URLSearchParams(filters).toString();
            const res = await fetch(`${API_BASE}/api/brand/analytics/vendor-due?${q}`, {
                headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
            });
            setData(await res.json());
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    useEffect(() => {
        const loadOutlets = async () => {
            const res = await fetch(`${API_BASE}/api/brand/outlets`, {
                headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
            });
            const d = await res.json();
            setOutlets(d);
            if (d.length > 0) setFilters(prev => ({ ...prev, outlet_id: d[0].id }));
        };
        loadOutlets();
    }, []);

    useEffect(() => { fetchData(); }, [filters.outlet_id]);

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-50 rounded-lg">
                        <Landmark className="w-5 h-5 text-slate-800" />
                    </div>
                    <div>
                        <h2 className="text-[14px] font-bold text-slate-800 uppercase tracking-tight">Fiscal Due</h2>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Vendor liabilities, purchase yields & due amount temporal artifacts</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button className="px-4 py-2 bg-slate-900 text-white rounded-md font-bold text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center gap-2 shadow-md shadow-slate-900/10">
                        <Download className="w-3.5 h-3.5" /> Export Fiscal Audit
                    </button>
                </div>
            </div>

            {/* Tactical Audit Board */}
            <div className="bg-white p-6 border border-slate-200 rounded-lg shadow-sm relative overflow-hidden group">
                <div className="relative z-10 grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                    <div className="space-y-1.5">
                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider px-1">Target Operating Hub</label>
                        <select className="w-full h-9 bg-slate-50 border border-slate-200 rounded-md px-3 text-[11px] font-bold uppercase outline-none focus:border-slate-500 transition-all cursor-pointer" value={filters.outlet_id} onChange={e => setFilters({...filters, outlet_id: e.target.value})}>
                            {outlets.map(o => <option key={o.id} value={o.id}>{o.name.toUpperCase()}</option>)}
                        </select>
                    </div>
                    <div className="space-y-1.5 md:col-span-2">
                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider px-1">Audit Date Window</label>
                        <input type="date" className="h-9 bg-slate-50 border border-slate-200 rounded-md px-3 text-[10px] font-bold uppercase outline-none focus:border-slate-500 transition-all" value={filters.date} onChange={e => setFilters({...filters, date: e.target.value})} />
                    </div>
                    <button onClick={fetchData} className="h-9 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest rounded-md hover:bg-slate-800 transition-all shadow-md shadow-slate-900/10 active:scale-95 flex items-center justify-center gap-2">
                        <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Execute Debt Audit
                    </button>
                </div>
                <Landmark className="absolute -right-12 -bottom-12 w-48 h-48 text-slate-900/[0.03] pointer-events-none group-hover:rotate-12 transition-transform duration-1000" />
            </div>

            {/* Debt Manifest Theater */}
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
                <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
                    <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-900" /> Vendor Due Payments Manifest
                    </h3>
                    <RefreshCw className="w-4 h-4 text-slate-200" />
                </div>

                <div className="flex-1 overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center">Action</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">#</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Vendor Identity</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Location Node</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center">Total Orders</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Total Purchase</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Due Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr><td colSpan="7" className="py-24 text-center text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] animate-pulse">Scanning Debt Vaults...</td></tr>
                            ) : data.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="py-24 text-center">
                                        <div className="flex flex-col items-center gap-4 opacity-20">
                                            <div className="w-20 h-20 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center">
                                                <IndianRupee className="w-10 h-10 text-slate-400" />
                                            </div>
                                            <div>
                                                <p className="text-[12px] font-bold text-slate-500 uppercase tracking-widest">Fiscal Matrix Clean</p>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">Zero Liabilities Tracked</p>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ) : data.map((row, idx) => (
                                <tr key={idx} className="group hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-6 text-center">
                                        <button className="p-2 bg-slate-100 text-slate-900 rounded-md hover:bg-slate-900 hover:text-white transition-all shadow-sm"><Eye className="w-4 h-4" /></button>
                                    </td>
                                    <td className="px-6 py-6">
                                        <span className="text-[11px] font-bold text-slate-400 italic">#{row.sr_no}</span>
                                    </td>
                                    <td className="px-6 py-6">
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-8 h-8 bg-slate-50 rounded flex items-center justify-center text-slate-400 border border-slate-200">
                                                <User className="w-4 h-4" />
                                            </div>
                                            <span className="text-[13px] font-bold text-slate-800 uppercase tracking-tight">{row.vendor_name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6">
                                        <div className="flex items-center gap-2 text-slate-500">
                                            <Database className="w-3.5 h-3.5" />
                                            <span className="text-[11px] font-bold uppercase tracking-tight">{row.warehouse_name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6 text-center">
                                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 rounded text-[12px] font-bold text-slate-900 border border-slate-200">
                                            <Activity className="w-3.5 h-3.5 text-slate-400" /> {row.total_orders}
                                        </div>
                                    </td>
                                    <td className="px-6 py-6">
                                        <span className="text-[16px] font-bold text-slate-400 tracking-tight">₹{parseFloat(row.total_purchase).toLocaleString('en-IN')}</span>
                                    </td>
                                    <td className="px-6 py-6 text-right">
                                        <div className="flex items-center justify-end gap-2 text-rose-600">
                                            <AlertCircle className="w-4 h-4" />
                                            <span className="text-[20px] font-bold tracking-tight">₹{parseFloat(row.due_amount).toLocaleString('en-IN')}</span>
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

export default VendorPayments;
