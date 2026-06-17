import React, { useState, useEffect } from "react";
import { 
  Box, Search, Filter, Download, BarChart3, TrendingUp,
  Zap, CheckCircle2, RefreshCw, ChevronDown, Monitor, 
  Truck, Smartphone, Globe, Database, ListTree, Settings2, 
  ShieldCheck, ArrowRight, Plus, FileUp, FileText, X,
  Trash2, Edit3, Tag, Layers, Scale, Clock, Activity,
  Printer, ShoppingCart, IndianRupee, User, Calendar
} from "lucide-react";
import API_BASE from "../config";

const ManualStockManager = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [outlets, setOutlets] = useState([]);

    const [filters, setFilters] = useState({
        outlet_id: "",
        purchase_date: new Date().toISOString().split('T')[0],
        vendor: "All"
    });

    const fetchData = async () => {
        if (!filters.outlet_id) return;
        setLoading(true);
        try {
            const q = new URLSearchParams(filters).toString();
            const res = await fetch(`${API_BASE}/api/brand/analytics/manual-stock?${q}`, {
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
                    Stock Entry
                </h2>
                <p className="text-slate-500 text-sm font-bold opacity-50 uppercase tracking-widest pl-2 flex items-center gap-2">
                    <Box className="w-3 h-3 text-slate-900" /> Real-time tracking of purchase order artifacts, tax yields & raw material liquidity states
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
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-4 italic">Purchase Date</label>
                        <input type="date" className="w-full bg-white/5 border border-white/10 rounded-[1.5rem] px-8 py-5 text-sm font-black text-white outline-none focus:border-indigo-500 transition-all" value={filters.purchase_date} onChange={e => setFilters({...filters, purchase_date: e.target.value})} />
                    </div>
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-4 italic">Select Vendor Matrix</label>
                        <select className="w-full bg-white/5 border border-white/10 rounded-[1.5rem] px-8 py-5 text-sm font-black text-white uppercase italic outline-none focus:border-indigo-500 transition-all" value={filters.vendor} onChange={e => setFilters({...filters, vendor: e.target.value})}>
                            <option value="All" className="bg-slate-900">ALL VENDORS</option>
                        </select>
                    </div>
                    <div className="flex items-end gap-4">
                        <button onClick={fetchData} className="flex-1 bg-white text-slate-900 py-5 rounded-[1.5rem] font-black uppercase tracking-widest text-[10px] hover:bg-slate-100 transition-all active:scale-95 shadow-xl shadow-white/10 italic">Execute Operational Audit</button>
                    </div>
                </div>
                <div className="flex items-center gap-4 pt-4">
                    <button className="text-white font-black uppercase text-[10px] tracking-widest flex items-center gap-2 hover:underline italic"><Printer className="w-4 h-4" /> Print Matrix</button>
                    <button className="text-white font-black uppercase text-[10px] tracking-widest flex items-center gap-2 hover:underline italic"><Download className="w-4 h-4" /> Export Vault</button>
                    <button className="text-white font-black uppercase text-[10px] tracking-widest flex items-center gap-2 hover:underline italic"><FileText className="w-4 h-4" /> Download Format</button>
                </div>
            </div>

            <div className="flex justify-end">
                <button onClick={() => setShowModal(true)} className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center gap-3 hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 italic">
                    <Plus className="w-4 h-4" /> Add Manual Stock Entry
                </button>
            </div>

            <div className="bg-white rounded-[4rem] border border-slate-50 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.05)] overflow-hidden">
                <div className="px-12 py-10 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] flex items-center gap-3 italic text-slate-900">
                        <div className="w-6 h-1 bg-slate-900 rounded-full" /> Manual stock list Manifest
                    </h3>
                    <RefreshCw className="w-4 h-4 text-slate-300 animate-spin-slow" />
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-900 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                                <th className="px-6 py-8 text-center">Action</th>
                                <th className="px-6 py-8">#</th>
                                <th className="px-6 py-8">Purchase Order</th>
                                <th className="px-6 py-8">Identity Matrix</th>
                                <th className="px-6 py-8 text-center">RM Count</th>
                                <th className="px-6 py-8">Fiscal Yield</th>
                                <th className="px-6 py-8">Location node</th>
                                <th className="px-6 py-8">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                <tr><td colSpan="8" className="py-20 text-center font-black uppercase text-xs tracking-[0.5em] text-slate-300 animate-pulse">Scanning Operational Vaults...</td></tr>
                            ) : data.length === 0 ? (
                                <tr><td colSpan="8" className="py-20 text-center font-black uppercase text-xs tracking-widest text-slate-400 italic">Zero Operational Artifacts Provisioned</td></tr>
                            ) : data.map((row, idx) => (
                                <tr key={idx} className="group hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-8 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <button className="p-3 bg-slate-100 text-slate-900 rounded-xl hover:bg-slate-900 hover:text-white transition-all"><Edit3 className="w-3.5 h-3.5" /></button>
                                            <button className="p-3 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
                                        </div>
                                    </td>
                                    <td className="px-6 py-8 text-xs font-black text-slate-400 italic">#{row.sr_no}</td>
                                    <td className="px-6 py-8">
                                        <div className="space-y-1">
                                            <p className="font-black text-slate-900 uppercase italic tracking-tighter text-sm flex items-center gap-2"><ShoppingCart className="w-3 h-3 opacity-30" /> {row.po_id}</p>
                                            <p className="text-[9px] font-black text-slate-400 uppercase italic tracking-widest">{new Date(row.purchase_date).toLocaleDateString()}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-8">
                                        <div className="space-y-1">
                                            <p className="font-black text-slate-900 uppercase italic tracking-tighter text-xs">{row.vendor_name}</p>
                                            <p className="text-[9px] font-black text-slate-400 uppercase italic tracking-widest flex items-center gap-2"><User className="w-3 h-3 opacity-30" /> ADDED BY: {row.added_by}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-8 text-center font-black text-slate-900 italic text-lg tracking-tighter">{row.rm_count}</td>
                                    <td className="px-6 py-8">
                                        <div className="space-y-1">
                                            <p className="text-xl font-black text-slate-900 tracking-tighter italic">₹{parseFloat(row.total).toLocaleString('en-IN')}</p>
                                            <p className="text-[8px] font-bold text-slate-400 uppercase italic tracking-widest">TAX: ₹{row.tax}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-8 font-black text-slate-400 uppercase italic tracking-tighter text-xs flex items-center gap-2 pt-10"><Database className="w-3 h-3 opacity-30" /> {row.warehouse_name}</td>
                                    <td className="px-6 py-8">
                                        <span className="px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600 border border-emerald-100 italic">{row.status}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/95 backdrop-blur-2xl animate-in fade-in duration-300 overflow-y-auto">
                    <div className="bg-white w-full max-w-6xl my-10 rounded-[4rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 border border-white/20 flex flex-col">
                        <div className="px-12 py-10 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                            <h3 className="text-3xl font-black uppercase italic tracking-tighter text-slate-900">Provision Manual Stock Entry</h3>
                            <button onClick={() => setShowModal(false)} className="p-4 bg-white border border-slate-200 rounded-2xl hover:bg-slate-900 hover:text-white transition-all">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="p-12 space-y-10 overflow-y-auto">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] pl-4 italic">Warehouse List*</label>
                                    <select className="w-full bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] px-8 py-5 text-sm font-black text-slate-900 uppercase italic outline-none focus:border-slate-900 transition-all appearance-none">
                                        <option>SELECT WAREHOUSE</option>
                                    </select>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] pl-4 italic">Purchase Date*</label>
                                    <input type="date" className="w-full bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] px-8 py-5 text-sm font-black text-slate-900 outline-none focus:border-slate-900 transition-all" />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] pl-4 italic">Select Vendor*</label>
                                    <select className="w-full bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] px-8 py-5 text-sm font-black text-slate-900 uppercase italic outline-none focus:border-slate-900 transition-all appearance-none">
                                        <option>ALL VENDORS</option>
                                    </select>
                                </div>
                                <div className="flex items-center gap-3 bg-slate-50 p-6 rounded-[1.5rem] border border-slate-100 mt-7">
                                    <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900" />
                                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 italic">Show Warehouse Raw Material</span>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] pl-4 italic">Remark</label>
                                <textarea placeholder="ENTER REMARK..." className="w-full bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] px-8 py-5 text-sm font-black text-slate-900 uppercase italic outline-none focus:border-slate-900 transition-all h-24 resize-none"></textarea>
                            </div>

                            <div className="space-y-6">
                                <button className="bg-slate-900 text-white px-8 py-4 rounded-xl font-black uppercase text-[10px] tracking-widest flex items-center gap-3 hover:bg-slate-800 transition-all italic shadow-lg shadow-slate-900/10">
                                    <Plus className="w-4 h-4" /> Add New Item Node
                                </button>
                                <div className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-slate-50 text-slate-400 text-[9px] font-black uppercase tracking-widest">
                                                <th className="px-6 py-6">Sr. No.</th>
                                                <th className="px-6 py-6">Raw Material Name</th>
                                                <th className="px-6 py-6">Price</th>
                                                <th className="px-6 py-6">Quantity</th>
                                                <th className="px-6 py-6">Extra</th>
                                                <th className="px-6 py-6">Tax</th>
                                                <th className="px-6 py-6">Amount</th>
                                                <th className="px-6 py-6">Total</th>
                                                <th className="px-6 py-6 text-center">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-50">
                                            <tr><td colSpan="9" className="py-12 text-center text-[10px] font-black uppercase tracking-[0.5em] text-slate-300 italic animate-pulse">Zero Items Provisioned</td></tr>
                                        </tbody>
                                        <tfoot>
                                            <tr className="bg-slate-900 text-white font-black text-xs uppercase italic tracking-tighter">
                                                <td colSpan="5" className="px-6 py-6 text-right">Operational Total:</td>
                                                <td className="px-6 py-6">0.00</td>
                                                <td className="px-6 py-6">0.00</td>
                                                <td className="px-6 py-6">0.00</td>
                                                <td></td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            </div>

                            <div className="flex gap-6 pt-6">
                                <button onClick={() => setShowModal(false)} className="flex-1 bg-slate-100 text-slate-900 py-8 rounded-[2rem] font-black uppercase tracking-widest text-[11px] italic hover:bg-slate-200 transition-all">Close Window</button>
                                <button onClick={() => setShowModal(false)} className="flex-[3] bg-slate-900 text-white py-8 rounded-[2rem] font-black uppercase tracking-widest text-[11px] italic hover:bg-slate-800 transition-all shadow-2xl shadow-slate-900/20 flex items-center justify-center gap-4">
                                    <Box className="w-5 h-5" /> Provision Stock Node
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default ManualStockManager;
