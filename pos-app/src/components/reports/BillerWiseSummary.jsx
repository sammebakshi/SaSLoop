import React, { useState, useEffect } from "react";
import { 
  UserCheck, Search, Filter, Download, BarChart3, TrendingUp,
  Zap, CheckCircle2, RefreshCw, ChevronDown, Monitor, 
  Truck, Smartphone, Globe, Database, ListTree, Settings2, 
  ShieldCheck, Calculator, Landmark, Wallet, Banknote, Receipt,
  UserSquare2, CreditCard, ChevronRight
} from "lucide-react";
import { API_BASE } from "../../services/api";

const BillerWiseSummary = () => {
    const [data, setData] = useState({
        summary: { punched: 0, punched_count: 0, complementary: 0, complementary_count: 0 },
        payments: []
    });
    const [loading, setLoading] = useState(true);
    const [outlets, setOutlets] = useState([]);

    const [filters, setFilters] = useState({
        outlet_id: "",
        from_date: new Date().toISOString().split('T')[0],
        to_date: new Date().toISOString().split('T')[0]
    });

    const fetchData = async () => {
        if (!filters.outlet_id) return;
        setLoading(true);
        try {
            const q = new URLSearchParams(filters).toString();
            const res = await fetch(`${API_BASE}/api/brand/analytics/payment-report?${q}`, {
                headers: { "Authorization": `Bearer ${localStorage.getItem("pos_token")}` }
            });
            const d = await res.json();
            
            // Transform for Biller View
            setData({
                summary: { 
                    punched: d.reduce((a, b) => a + parseFloat(b.amount), 0),
                    punched_count: d.reduce((a, b) => a + parseInt(b.count), 0),
                    complementary: 0,
                    complementary_count: 0
                },
                payments: d
            });
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

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-50 rounded-lg">
                        <UserCheck className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                        <h2 className="text-[14px] font-bold text-slate-800 uppercase tracking-tight">Biller Accountability</h2>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Revenue slicing by punched vs. complementary artifacts</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button className="px-4 py-2 bg-indigo-600 text-white rounded-md font-bold text-[10px] uppercase tracking-widest hover:bg-indigo-500 transition-all flex items-center gap-2 shadow-md shadow-indigo-600/10">
                        <Download className="w-3.5 h-3.5" /> Export Audit
                    </button>
                </div>
            </div>

            {/* Tactical Audit Protocol */}
            <div className="bg-white p-6 border border-slate-200 rounded-lg shadow-sm relative overflow-hidden group">
                <div className="relative z-10 grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                    <div className="space-y-1.5 hidden">
                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider px-1">Target Operating Hub</label>
                        <select className="w-full h-9 bg-slate-50 border border-slate-200 rounded-md px-3 text-[11px] font-bold uppercase outline-none focus:border-indigo-500 transition-all cursor-pointer" value={filters.outlet_id} onChange={e => setFilters({...filters, outlet_id: e.target.value})}>
                            {outlets.map(o => <option key={o.id} value={o.id}>{o.name.toUpperCase()}</option>)}
                        </select>
                    </div>
                    <div className="space-y-1.5 md:col-span-2">
                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider px-1">Temporal Audit Window</label>
                        <div className="grid grid-cols-2 gap-2">
                            <input type="date" className="h-9 bg-slate-50 border border-slate-200 rounded-md px-2 text-[10px] font-bold uppercase outline-none focus:border-indigo-500 transition-all" value={filters.from_date} onChange={e => setFilters({...filters, from_date: e.target.value})} />
                            <input type="date" className="h-9 bg-slate-50 border border-slate-200 rounded-md px-2 text-[10px] font-bold uppercase outline-none focus:border-indigo-500 transition-all" value={filters.to_date} onChange={e => setFilters({...filters, to_date: e.target.value})} />
                        </div>
                    </div>
                    <button onClick={fetchData} className="h-9 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest rounded-md hover:bg-slate-800 transition-all shadow-md shadow-slate-900/10 active:scale-95 flex items-center justify-center gap-2">
                        <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Execute Biller Audit
                    </button>
                </div>
                <UserCheck className="absolute -right-12 -bottom-12 w-48 h-48 text-indigo-600/[0.03] pointer-events-none group-hover:rotate-12 transition-transform duration-1000" />
            </div>

            {/* Performance Metrics Hub */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Billing Summary Manifest */}
                <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
                    <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
                        <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                            <Calculator className="w-3.5 h-3.5 text-indigo-500" /> Billing Summary Manifest
                        </h3>
                    </div>
                    <div className="p-6 space-y-4 flex-1">
                        <div className="p-5 bg-slate-50 border border-slate-100 rounded-lg group hover:bg-slate-900 transition-all duration-300">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest group-hover:text-slate-500">Punched Orders</span>
                                <div className="text-right">
                                    <p className="text-[20px] font-bold text-slate-800 tracking-tight group-hover:text-white transition-colors">₹{data.summary.punched.toLocaleString()}</p>
                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest group-hover:text-indigo-400 transition-colors">({data.summary.punched_count}) Artifacts</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-5 bg-slate-50 border border-slate-100 rounded-lg group hover:bg-slate-900 transition-all duration-300 opacity-60">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest group-hover:text-slate-500">Complementary Items</span>
                                <div className="text-right">
                                    <p className="text-[20px] font-bold text-slate-800 tracking-tight group-hover:text-white transition-colors">₹{data.summary.complementary.toLocaleString()}</p>
                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest group-hover:text-indigo-400 transition-colors">({data.summary.complementary_count}) Artifacts</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Realized Payment Protocols */}
                <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
                    <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
                        <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                            <CreditCard className="w-3.5 h-3.5 text-indigo-500" /> Payment Protocol Realization
                        </h3>
                    </div>
                    <div className="p-6 flex-1">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {data.payments.length === 0 ? (
                                <div className="col-span-full py-20 flex flex-col items-center gap-4 opacity-20">
                                    <div className="w-16 h-16 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center">
                                        <Landmark className="w-8 h-8 text-slate-400" />
                                    </div>
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Zero liquidity artifacts found</p>
                                </div>
                            ) : data.payments.map((p, i) => (
                                <div key={i} className="p-4 bg-slate-50 border border-slate-100 rounded-lg hover:border-indigo-500 transition-all group">
                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest group-hover:text-indigo-600 transition-colors">{p.mode.toUpperCase()}</span>
                                    <p className="text-[24px] font-bold text-slate-800 tracking-tight mt-1">₹{parseFloat(p.amount).toLocaleString()}</p>
                                    <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-200/50">
                                        <span className="text-[9px] font-bold text-indigo-600 uppercase tracking-widest">{p.count} Bills Realized</span>
                                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BillerWiseSummary;
