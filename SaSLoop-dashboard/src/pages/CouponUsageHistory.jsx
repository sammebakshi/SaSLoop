import React, { useState, useEffect } from "react";
import { 
  History, Search, Filter, Download, BarChart3, TrendingUp,
  Zap, CheckCircle2, RefreshCw, ChevronDown, Monitor, 
  Truck, Smartphone, Globe, Database, ListTree, Settings2, 
  ShieldCheck, ArrowRight, Eye, Tag, User, Phone, 
  Clock, Calendar, IndianRupee, Activity
} from "lucide-react";
import API_BASE from "../config";

const CouponUsageHistory = () => {
    const [data, setData] = useState([]);
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
            const res = await fetch(`${API_BASE}/api/brand/analytics/coupon-usage?${q}`, {
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
                    Redemption Audit
                </h2>
                <p className="text-slate-500 text-sm font-bold opacity-50 uppercase tracking-widest pl-2 flex items-center gap-2">
                    <History className="w-3 h-3 text-slate-900" /> Real-time tracking of coupon redemptions, customer identities & redemption temporal artifacts
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
                    <div className="space-y-3 md:col-span-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-4 italic">Temporal Audit window</label>
                        <div className="grid grid-cols-2 gap-2">
                            <input type="date" className="w-full bg-white/5 border border-white/10 rounded-[1.5rem] px-8 py-5 text-sm font-black text-white outline-none focus:border-indigo-500 transition-all" value={filters.from_date} onChange={e => setFilters({...filters, from_date: e.target.value})} />
                            <input type="date" className="w-full bg-white/5 border border-white/10 rounded-[1.5rem] px-8 py-5 text-sm font-black text-white outline-none focus:border-indigo-500 transition-all" value={filters.to_date} onChange={e => setFilters({...filters, to_date: e.target.value})} />
                        </div>
                    </div>
                    <div className="flex items-end gap-4">
                        <button onClick={fetchData} className="flex-1 bg-white text-slate-900 py-5 rounded-[1.5rem] font-black uppercase tracking-widest text-[10px] hover:bg-slate-100 transition-all active:scale-95 shadow-xl shadow-white/10 italic">Execute Redemption Audit</button>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-[4rem] border border-slate-50 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.05)] overflow-hidden">
                <div className="px-12 py-10 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] flex items-center gap-3 italic text-slate-900">
                        <div className="w-6 h-1 bg-slate-900 rounded-full" /> Customer coupon history Manifest
                    </h3>
                    <RefreshCw className="w-4 h-4 text-slate-300 animate-spin-slow" />
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-900 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                                <th className="px-8 py-8 text-center">Action</th>
                                <th className="px-8 py-8">Operating Hub</th>
                                <th className="px-8 py-8">Identity Matrix</th>
                                <th className="px-8 py-8">Coupon Artifact</th>
                                <th className="px-8 py-8 text-right">Yield Yielded</th>
                                <th className="px-8 py-8">Order Context</th>
                                <th className="px-8 py-8 text-right">Redemption temporal</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                <tr><td colSpan="7" className="py-20 text-center font-black uppercase text-xs tracking-[0.5em] text-slate-300 animate-pulse">Scanning Redemption Vaults...</td></tr>
                            ) : data.length === 0 ? (
                                <tr><td colSpan="7" className="py-20 text-center font-black uppercase text-xs tracking-widest text-slate-400 italic">Zero Redemption Artifacts Provisioned</td></tr>
                            ) : data.map((row, idx) => (
                                <tr key={idx} className="group hover:bg-slate-50/50 transition-colors">
                                    <td className="px-8 py-8">
                                        <div className="flex items-center justify-center">
                                            <button className="p-3 bg-slate-100 text-slate-900 rounded-xl hover:bg-slate-900 hover:text-white transition-all shadow-sm"><Eye className="w-3.5 h-3.5" /></button>
                                        </div>
                                    </td>
                                    <td className="px-8 py-8">
                                        <div className="space-y-1">
                                            <p className="font-black text-slate-900 uppercase italic tracking-tighter text-xs">{row.outlet_name}</p>
                                            <p className="text-[9px] font-black text-slate-400 uppercase italic tracking-widest">USER: {row.logged_in_user}</p>
                                        </div>
                                    </td>
                                    <td className="px-8 py-8">
                                        <div className="space-y-1">
                                            <p className="font-black text-slate-900 uppercase italic tracking-tighter text-sm flex items-center gap-2"><User className="w-3 h-3 opacity-30" /> {row.customer_name}</p>
                                            <p className="text-[9px] font-black text-slate-400 uppercase italic flex items-center gap-2"><Phone className="w-3 h-3 opacity-30" /> {row.customer_phone}</p>
                                        </div>
                                    </td>
                                    <td className="px-8 py-8">
                                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-50 border border-indigo-100 rounded-lg">
                                            <Tag className="w-2.5 h-2.5 text-indigo-500" />
                                            <span className="font-black text-indigo-600 uppercase italic tracking-widest text-[10px]">{row.coupon_code}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-8 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <IndianRupee className="w-3.5 h-3.5 text-emerald-500" />
                                            <span className="text-xl font-black text-slate-900 tracking-tighter italic">₹{parseFloat(row.code_amt).toLocaleString('en-IN')}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-8">
                                        <div className="flex items-center gap-2">
                                            <Activity className="w-3.5 h-3.5 text-slate-400" />
                                            <span className="font-black text-slate-900 uppercase italic tracking-tighter text-sm">ORD#{row.order_id}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-8 text-right">
                                        <div className="flex flex-col items-end gap-1">
                                            <span className="text-[10px] font-black text-slate-900 uppercase italic tracking-widest flex items-center gap-2"><Calendar className="w-3 h-3 opacity-30" /> {new Date(row.used_date).toLocaleDateString()}</span>
                                            <span className="text-[9px] font-black text-slate-400 uppercase italic tracking-widest flex items-center gap-2"><Clock className="w-3 h-3 opacity-30" /> {new Date(row.used_date).toLocaleTimeString()}</span>
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

export default CouponUsageHistory;
