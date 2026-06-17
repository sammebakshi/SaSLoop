import React, { useState, useEffect } from "react";
import { 
  Ticket, Search, Filter, Download, BarChart3, TrendingUp,
  Zap, CheckCircle2, RefreshCw, ChevronDown, Monitor, 
  Truck, Smartphone, Globe, Database, ListTree, Settings2, 
  ShieldCheck, ArrowRight, Plus, FileUp, FileText, Calendar,
  Clock, Tag, Percent, IndianRupee, Users
} from "lucide-react";
import API_BASE from "../config";

const CouponCodeManager = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [outlets, setOutlets] = useState([]);

    const [filters, setFilters] = useState({
        outlet_id: "",
        order_type: "All",
        calc_type: "All",
        customer_type: "All",
        active: "Yes"
    });

    const fetchData = async () => {
        if (!filters.outlet_id) return;
        setLoading(true);
        try {
            const q = new URLSearchParams(filters).toString();
            const res = await fetch(`${API_BASE}/api/brand/analytics/coupon-codes?${q}`, {
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
        <div className="max-w-[1600px] mx-auto py-10 px-10 space-y-12 pb-20">
            
            <div className="space-y-2">
                <h2 className="text-6xl font-black text-slate-900 tracking-tighter uppercase italic underline decoration-slate-900">
                    Promotional Yield
                </h2>
                <p className="text-slate-500 text-sm font-bold opacity-50 uppercase tracking-widest pl-2 flex items-center gap-2">
                    <Ticket className="w-3 h-3 text-slate-900" /> Real-time tracking of fixed vs. percentage yields & redemption thresholds
                </p>
            </div>

            <div className="bg-slate-900 p-12 rounded-[4rem] shadow-2xl border border-white/5 space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-4 italic">Target Operating Hub</label>
                        <select className="w-full bg-white/5 border border-white/10 rounded-[1.5rem] px-8 py-5 text-sm font-black text-white uppercase italic outline-none focus:border-indigo-500 transition-all" value={filters.outlet_id} onChange={e => setFilters({...filters, outlet_id: e.target.value})}>
                            {outlets.map(o => <option key={o.id} value={o.id} className="bg-slate-900">{o.name.toUpperCase()}</option>)}
                        </select>
                    </div>
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-4 italic">Order Type Matrix</label>
                        <select className="w-full bg-white/5 border border-white/10 rounded-[1.5rem] px-8 py-5 text-sm font-black text-white uppercase italic outline-none focus:border-indigo-500 transition-all" value={filters.order_type} onChange={e => setFilters({...filters, order_type: e.target.value})}>
                            <option value="All" className="bg-slate-900">ALL ORDER TYPES</option>
                            <option value="Delivery" className="bg-slate-900">DELIVERY ONLY</option>
                            <option value="Dine-In" className="bg-slate-900">DINE-IN ONLY</option>
                        </select>
                    </div>
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-4 italic">Calculation Protocol</label>
                        <select className="w-full bg-white/5 border border-white/10 rounded-[1.5rem] px-8 py-5 text-sm font-black text-white uppercase italic outline-none focus:border-indigo-500 transition-all" value={filters.calc_type} onChange={e => setFilters({...filters, calc_type: e.target.value})}>
                            <option value="All" className="bg-slate-900">ALL CALC TYPES</option>
                            <option value="Fixed" className="bg-slate-900">FIXED AMOUNT</option>
                            <option value="Percentage" className="bg-slate-900">PERCENTAGE %</option>
                        </select>
                    </div>
                    <div className="flex items-end gap-4">
                        <button onClick={fetchData} className="flex-1 bg-white text-slate-900 py-5 rounded-[1.5rem] font-black uppercase tracking-widest text-[10px] hover:bg-slate-100 transition-all active:scale-95 shadow-xl shadow-white/10 italic">Execute Yield Audit</button>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center gap-3 hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 italic">
                        <Plus className="w-4 h-4" /> Provision New Artifact
                    </button>
                    <button className="bg-white border border-slate-200 text-slate-900 px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center gap-3 hover:bg-slate-50 transition-all italic">
                        <FileUp className="w-4 h-4" /> Bulk Upload Matrix
                    </button>
                </div>
                <button className="text-indigo-600 font-black uppercase text-[10px] tracking-widest flex items-center gap-2 hover:underline italic">
                    <FileText className="w-4 h-4" /> Download Format Manifest
                </button>
            </div>

            <div className="bg-white rounded-[4rem] border border-slate-50 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.05)] overflow-hidden">
                <div className="px-12 py-10 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] flex items-center gap-3 italic text-slate-900">
                        <div className="w-6 h-1 bg-slate-900 rounded-full" /> Promotional coupon Manifest
                    </h3>
                    <RefreshCw className="w-4 h-4 text-slate-300 animate-spin-slow" />
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-900 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                                <th className="px-8 py-8">#</th>
                                <th className="px-8 py-8">Coupon Artifact</th>
                                <th className="px-8 py-8 text-center">Protocol</th>
                                <th className="px-8 py-8 text-right">Yield Value</th>
                                <th className="px-8 py-8">Redemption Matrix</th>
                                <th className="px-8 py-8">Status</th>
                                <th className="px-8 py-8 text-right">Temporal</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                <tr><td colSpan="7" className="py-20 text-center font-black uppercase text-xs tracking-[0.5em] text-slate-300 animate-pulse">Scanning Yield Vaults...</td></tr>
                            ) : data.length === 0 ? (
                                <tr><td colSpan="7" className="py-20 text-center font-black uppercase text-xs tracking-widest text-slate-400 italic">Zero Yield Artifacts Provisioned</td></tr>
                            ) : data.map((row, idx) => (
                                <tr key={idx} className="group hover:bg-slate-50/50 transition-colors">
                                    <td className="px-8 py-8 text-xs font-black text-slate-400 italic">#{row.sr_no}</td>
                                    <td className="px-8 py-8">
                                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-xl">
                                            <Tag className="w-3 h-3 text-indigo-500" />
                                            <span className="font-black text-indigo-600 uppercase italic tracking-widest text-sm">{row.coupon_code}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-8 text-center">
                                        <div className="flex flex-col items-center gap-1">
                                            <span className="text-[10px] font-black text-slate-900 uppercase italic tracking-tighter">{row.order_type} ORDERS</span>
                                            <span className="text-[8px] font-black text-slate-400 uppercase italic tracking-widest">{row.fixed_perct} Protocol</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-8 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            {row.fixed_perct === 'Percentage' ? <Percent className="w-3.5 h-3.5 text-slate-400" /> : <IndianRupee className="w-3.5 h-3.5 text-slate-400" />}
                                            <span className="text-xl font-black text-slate-900 tracking-tighter italic">{parseFloat(row.amount).toLocaleString('en-IN')}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-8 space-y-1">
                                        <p className="text-[10px] font-black text-slate-900 uppercase italic flex items-center gap-2"><Users className="w-3 h-3 opacity-30" /> {row.customer_type} SEGMENTS</p>
                                        <p className="text-[9px] font-black text-slate-400 uppercase italic tracking-widest">Min. Order: ₹{row.applicable_order_amt}</p>
                                    </td>
                                    <td className="px-8 py-8">
                                        <span className="px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600 border border-emerald-100 italic">{row.status}</span>
                                    </td>
                                    <td className="px-8 py-8 text-right space-y-1">
                                        <p className="text-[10px] font-black text-slate-900 uppercase italic tracking-widest">{new Date(row.created_at).toLocaleDateString()}</p>
                                        <p className="text-[8px] font-black text-slate-400 uppercase italic tracking-[0.2em]">{row.created_by}</p>
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

export default CouponCodeManager;
