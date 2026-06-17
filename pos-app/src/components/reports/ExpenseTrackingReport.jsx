import React, { useState, useEffect } from "react";
import { 
  Wallet, IndianRupee, Search, Filter, Download, 
  Plus, Upload, FileText, BarChart3, TrendingDown, 
  Zap, CheckCircle2, RefreshCw, ChevronDown, Monitor, 
  Truck, Smartphone, Globe, Database, ListTree, Settings2, 
  ShieldCheck, Trash2, Eye, ExternalLink, Receipt, ChevronRight
} from "lucide-react";
import { API_BASE } from "../../services/api";

const ExpenseTrackingReport = () => {
    const [expenses, setExpenses] = useState([]);
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
            const res = await fetch(`${API_BASE}/api/brand/analytics/expense-report?${q}`, {
                headers: { "Authorization": `Bearer ${localStorage.getItem("pos_token")}` }
            });
            setExpenses(await res.json());
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

    const totalExpense = expenses.reduce((sum, row) => sum + parseFloat(row.amount || 0), 0);

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-rose-50 rounded-lg">
                        <Wallet className="w-5 h-5 text-rose-600" />
                    </div>
                    <div>
                        <h2 className="text-[14px] font-bold text-slate-800 uppercase tracking-tight">Outflow Intelligence</h2>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Expense categorization, vendor audits & outflow tracking</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button className="px-4 py-2 bg-white border border-slate-200 rounded-md text-[10px] font-bold text-slate-600 uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2">
                        <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Sync
                    </button>
                    <button className="px-4 py-2 bg-rose-600 text-white rounded-md font-bold text-[10px] uppercase tracking-widest hover:bg-rose-500 transition-all flex items-center gap-2 shadow-md shadow-rose-600/10">
                        <Download className="w-3.5 h-3.5" /> Export Manifest
                    </button>
                </div>
            </div>

            {/* Tactical Protocol */}
            <div className="bg-white p-6 border border-slate-200 rounded-lg shadow-sm relative overflow-hidden group">
                <div className="relative z-10 grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                    <div className="space-y-1.5 hidden">
                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider px-1">Target Operating Hub</label>
                        <select className="w-full h-9 bg-slate-50 border border-slate-200 rounded-md px-3 text-[11px] font-bold uppercase outline-none focus:border-rose-500 transition-all cursor-pointer" value={filters.outlet_id} onChange={e => setFilters({...filters, outlet_id: e.target.value})}>
                            {outlets.map(o => <option key={o.id} value={o.id}>{o.name.toUpperCase()}</option>)}
                        </select>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider px-1">Temporal Start</label>
                        <input type="date" className="w-full h-9 bg-slate-50 border border-slate-200 rounded-md px-3 text-[10px] font-bold uppercase outline-none focus:border-rose-500 transition-all" value={filters.from_date} onChange={e => setFilters({...filters, from_date: e.target.value})} />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider px-1">Temporal End</label>
                        <input type="date" className="w-full h-9 bg-slate-50 border border-slate-200 rounded-md px-3 text-[10px] font-bold uppercase outline-none focus:border-rose-500 transition-all" value={filters.to_date} onChange={e => setFilters({...filters, to_date: e.target.value})} />
                    </div>
                    <button onClick={fetchData} className="h-9 bg-rose-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-md hover:bg-rose-500 transition-all shadow-md shadow-rose-600/10 active:scale-95">Sync Outflows</button>
                </div>
                <Receipt className="absolute -right-12 -bottom-12 w-48 h-48 text-rose-600/[0.03] pointer-events-none group-hover:rotate-12 transition-transform duration-1000" />
            </div>

            {/* EXPENSE CATEGORY & SUMMARY */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3 bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[150px]">
                    <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/30 flex items-center justify-between">
                        <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                            <ListTree className="w-4 h-4 text-rose-500" /> Expense Category Manifest
                        </h3>
                        <div className="flex gap-2">
                            <button className="px-3 py-1.5 bg-white border border-slate-200 rounded-md text-[9px] font-bold text-slate-600 uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2">
                                <Plus className="w-3 h-3" /> Category
                            </button>
                            <button className="px-3 py-1.5 bg-white border border-slate-200 rounded-md text-[9px] font-bold text-slate-600 uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2">
                                <Upload className="w-3 h-3" /> Upload
                            </button>
                        </div>
                    </div>
                    <div className="flex-1 flex items-center justify-center p-8">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest opacity-60">No Specialized Categories Provisioned</p>
                    </div>
                </div>
                
                <div className="lg:col-span-1 bg-rose-600 p-6 rounded-lg text-white shadow-md shadow-rose-600/10 relative overflow-hidden group flex flex-col justify-between min-h-[150px]">
                    <div className="space-y-1 relative z-10">
                        <div className="p-2 bg-white/20 rounded-md w-fit mb-3"><Wallet className="w-4 h-4" /></div>
                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-rose-100">Total Realized Outflow</h4>
                    </div>
                    <div className="relative z-10">
                        <h5 className="text-[28px] font-bold tracking-tight">₹{totalExpense.toLocaleString('en-IN')}</h5>
                        <p className="text-[9px] font-bold uppercase tracking-widest mt-1 opacity-60">Real-time realization</p>
                    </div>
                    <Receipt className="absolute -right-8 -bottom-8 w-32 h-32 text-white/[0.1] pointer-events-none group-hover:scale-110 transition-transform duration-700" />
                </div>
            </div>

            {/* EXPENSES TRACKING LIST */}
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
                <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/30 flex items-center justify-between">
                    <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-rose-500" /> Expenses Tracking Manifest
                    </h3>
                    <div className="flex items-center gap-3">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Net Outflows: {expenses.length}</span>
                    </div>
                </div>

                <div className="flex-1 overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Sr. No.</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Operating Hub</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Category</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr><td colSpan="5" className="py-24 text-center text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] animate-pulse">Scanning Outflow Vaults...</td></tr>
                            ) : expenses.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="py-24 text-center">
                                        <div className="flex flex-col items-center gap-4 opacity-20">
                                            <div className="w-20 h-20 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center">
                                                <Wallet className="w-10 h-10 text-slate-400" />
                                            </div>
                                            <div>
                                                <p className="text-[12px] font-bold text-slate-500 uppercase tracking-widest">Zero Outflow Artifacts</p>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">No recorded expenses found</p>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ) : expenses.map((row, idx) => (
                                <tr key={idx} className="group hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4 text-[11px] font-bold text-slate-400 italic">#{idx + 1}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-[10px]">OH</div>
                                            <span className="text-[12px] font-bold text-slate-800 uppercase tracking-tight">{row.outlet_name || 'BRAND OUTLET'}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-2.5 py-1 bg-rose-50 text-rose-600 rounded-md text-[10px] font-bold uppercase border border-rose-100">{row.category_name || 'UNMAPPED'}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-[16px] font-bold text-slate-800 tracking-tight">₹{parseFloat(row.amount).toLocaleString('en-IN')}</span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="p-2 hover:bg-white rounded-md text-slate-400 border border-transparent hover:border-slate-200 transition-all"><Eye className="w-4 h-4" /></button>
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

export default ExpenseTrackingReport;
