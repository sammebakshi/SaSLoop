import React, { useState, useEffect } from "react";
import { 
  ChefHat, Search, Filter, Download, BarChart3, TrendingUp,
  Zap, CheckCircle2, RefreshCw, ChevronDown, Monitor, 
  Truck, Smartphone, Globe, Database, ListTree, Settings2, 
  ShieldCheck, UtensilsCrossed, Flame, Clock, Scissors, ChevronRight
} from "lucide-react";
import API_BASE from "../config";

const KitchenDepartmentReport = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [outlets, setOutlets] = useState([]);

    const [filters, setFilters] = useState({
        outlet_id: "",
        from_date: new Date().toISOString().split('T')[0],
        to_date: new Date().toISOString().split('T')[0],
        with_time: false,
        with_details: false
    });

    const fetchData = async () => {
        if (!filters.outlet_id) return;
        setLoading(true);
        try {
            const q = new URLSearchParams(filters).toString();
            const res = await fetch(`${API_BASE}/api/brand/analytics/kitchen-report?${q}`, {
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
            if (d.length > 0) {
                const targetId = sessionStorage.getItem("impersonate_id");
                const matched = d.find(o => o.id.toString() === targetId?.toString());
                setFilters(prev => ({ ...prev, outlet_id: matched ? matched.id : d[0].id }));
            }
        };
        loadOutlets();
    }, []);

    useEffect(() => { fetchData(); }, [filters.outlet_id]);

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-50 rounded-lg">
                        <ChefHat className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                        <h2 className="text-[14px] font-bold text-slate-800 uppercase tracking-tight">Kitchen Intelligence</h2>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Back-of-house throughput & department performance</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button className="px-4 py-2 bg-orange-600 text-white rounded-md font-bold text-[10px] uppercase tracking-widest hover:bg-orange-500 transition-all flex items-center gap-2 shadow-md shadow-orange-600/10">
                        <Download className="w-3.5 h-3.5" /> Export Manifest
                    </button>
                </div>
            </div>

            {/* Tactical Audit Protocol */}
            <div className="bg-white p-6 border border-slate-200 rounded-lg shadow-sm relative overflow-hidden group">
                <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 items-end">

                    <div className="space-y-1.5">
                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider px-1">Temporal Audit Window</label>
                        <div className="grid grid-cols-2 gap-2">
                            <input type="date" className="h-9 bg-slate-50 border border-slate-200 rounded-md px-2 text-[10px] font-bold uppercase outline-none focus:border-orange-500 transition-all" value={filters.from_date} onChange={e => setFilters({...filters, from_date: e.target.value})} />
                            <input type="date" className="h-9 bg-slate-50 border border-slate-200 rounded-md px-2 text-[10px] font-bold uppercase outline-none focus:border-orange-500 transition-all" value={filters.to_date} onChange={e => setFilters({...filters, to_date: e.target.value})} />
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between h-8 px-3 bg-slate-50 border border-slate-200 rounded-md group-hover:border-orange-200 transition-all cursor-pointer" onClick={() => setFilters({...filters, with_time: !filters.with_time})}>
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">With Time Audit</span>
                            <div className={`w-6 h-3 rounded-full relative transition-all shadow-inner ${filters.with_time ? 'bg-orange-500' : 'bg-slate-200'}`}>
                                <div className={`absolute top-0.5 w-2 h-2 rounded-full bg-white transition-all shadow-sm ${filters.with_time ? 'left-3.5' : 'left-0.5'}`} />
                            </div>
                        </div>
                        <div className="flex items-center justify-between h-8 px-3 bg-slate-50 border border-slate-200 rounded-md group-hover:border-orange-200 transition-all cursor-pointer" onClick={() => setFilters({...filters, with_details: !filters.with_details})}>
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Detailed Item Audit</span>
                            <div className={`w-6 h-3 rounded-full relative transition-all shadow-inner ${filters.with_details ? 'bg-orange-500' : 'bg-slate-200'}`}>
                                <div className={`absolute top-0.5 w-2 h-2 rounded-full bg-white transition-all shadow-sm ${filters.with_details ? 'left-3.5' : 'left-0.5'}`} />
                            </div>
                        </div>
                    </div>
                    <button onClick={fetchData} className="h-9 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest rounded-md hover:bg-slate-800 transition-all shadow-md shadow-slate-900/10 active:scale-95 flex items-center justify-center gap-2">
                        <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Analyze Throughput
                    </button>
                </div>
                <ChefHat className="absolute -right-12 -bottom-12 w-48 h-48 text-orange-600/[0.03] pointer-events-none group-hover:rotate-12 transition-transform duration-1000" />
            </div>

            {/* Kitchen Performance Matrix */}
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
                <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
                    <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-orange-500" /> Kitchen Performance Manifest
                    </h3>
                    <RefreshCw className="w-4 h-4 text-orange-200" />
                </div>

                <div className="flex-1 overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Sr. No.</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Kitchen Department</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Category</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Throughput</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Realized Amount</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Net Charges</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr><td colSpan="6" className="py-24 text-center text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] animate-pulse">Scanning Kitchen Vaults...</td></tr>
                            ) : data.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="py-24 text-center">
                                        <div className="flex flex-col items-center gap-4 opacity-20">
                                            <div className="w-20 h-20 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center">
                                                <Flame className="w-10 h-10 text-slate-400" />
                                            </div>
                                            <div>
                                                <p className="text-[12px] font-bold text-slate-500 uppercase tracking-widest">Kitchen Matrix Clean</p>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">Zero Artifacts Provisioned</p>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ) : data.map((row, idx) => (
                                <tr key={idx} className="group hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-6 text-[11px] font-bold text-slate-400 italic">#{idx + 1}</td>
                                    <td className="px-6 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-orange-50 border border-orange-100 rounded-lg flex items-center justify-center text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-all shadow-sm">
                                                <Flame className="w-4 h-4" />
                                            </div>
                                            <span className="font-bold text-slate-800 uppercase tracking-tight text-[13px]">{row.kitchen_department}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6">
                                        <span className="px-2.5 py-1 bg-slate-900 text-white rounded-md text-[9px] font-bold uppercase tracking-wider">{row.category_name}</span>
                                    </td>
                                    <td className="px-6 py-6">
                                        <div className="flex items-center gap-2">
                                            <span className="text-[14px] font-bold text-slate-700">{row.total_sold_items}</span>
                                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Units Sold</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6">
                                        <div className="space-y-1">
                                            <p className="text-[14px] font-bold text-slate-800 tracking-tight">₹{parseFloat(row.total_amount).toLocaleString('en-IN')}</p>
                                            <div className="flex items-center gap-1.5 text-rose-500">
                                                <Scissors className="w-2.5 h-2.5" />
                                                <span className="text-[9px] font-bold uppercase tracking-widest">Discount: ₹{row.item_level_discount}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6 text-right">
                                        <div className="flex flex-col items-end gap-0.5">
                                            <span className="text-[18px] font-bold text-emerald-600 tracking-tight">₹{parseFloat(row.item_level_total_charges).toLocaleString('en-IN')}</span>
                                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Period Realized</span>
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

export default KitchenDepartmentReport;
