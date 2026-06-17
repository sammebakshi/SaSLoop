import React, { useState, useEffect } from "react";
import { 
  Truck, Search, Filter, Download, BarChart3, TrendingUp,
  Zap, CheckCircle2, RefreshCw, ChevronDown, Monitor, 
  Smartphone, Globe, Database, ListTree, Settings2, 
  ShieldCheck, MapPin, User, Phone, Calendar, ArrowRight,
  PackageCheck, Bike, ChevronRight
} from "lucide-react";
import { API_BASE } from "../../services/api";

const DeliveryReport = () => {
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
            const res = await fetch(`${API_BASE}/api/brand/analytics/delivery-report?${q}`, {
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

    const totalAmount = data.reduce((a, b) => a + parseFloat(b.total), 0);

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                        <Truck className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                        <h2 className="text-[14px] font-bold text-slate-800 uppercase tracking-tight">Omnichannel Fulfillment</h2>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Delivery performance monitoring & fulfillment auditing</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-md font-bold text-[10px] uppercase tracking-widest hover:bg-blue-500 transition-all flex items-center gap-2 shadow-md shadow-blue-600/10">
                        <Download className="w-3.5 h-3.5" /> Export Manifest
                    </button>
                </div>
            </div>

            {/* Tactical Audit Board */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Protocol Command Center */}
                <div className="bg-white p-6 border border-slate-200 rounded-lg shadow-sm lg:col-span-2 relative overflow-hidden group">
                    <div className="relative z-10 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1.5 hidden">
                                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider px-1">Operating Hub</label>
                                <select className="w-full h-9 bg-slate-50 border border-slate-200 rounded-md px-3 text-[11px] font-bold uppercase outline-none focus:border-blue-500 transition-all cursor-pointer" value={filters.outlet_id} onChange={e => setFilters({...filters, outlet_id: e.target.value})}>
                                    {outlets.map(o => <option key={o.id} value={o.id}>{o.name.toUpperCase()}</option>)}
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider px-1">Temporal Audit Window</label>
                                <div className="grid grid-cols-2 gap-2">
                                    <input type="date" className="h-9 bg-slate-50 border border-slate-200 rounded-md px-2 text-[10px] font-bold uppercase outline-none focus:border-blue-500 transition-all" value={filters.from_date} onChange={e => setFilters({...filters, from_date: e.target.value})} />
                                    <input type="date" className="h-9 bg-slate-50 border border-slate-200 rounded-md px-2 text-[10px] font-bold uppercase outline-none focus:border-blue-500 transition-all" value={filters.to_date} onChange={e => setFilters({...filters, to_date: e.target.value})} />
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                            <button onClick={fetchData} className="h-9 bg-slate-900 text-white px-8 text-[10px] font-bold uppercase tracking-widest rounded-md hover:bg-slate-800 transition-all shadow-md shadow-slate-900/10 active:scale-95 flex items-center gap-2">
                                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Execute Audit
                            </button>
                            <Truck className="w-6 h-6 text-slate-100 group-hover:text-blue-100 transition-colors" />
                        </div>
                    </div>
                </div>

                {/* Real-time Performance HUD */}
                <div className="grid grid-cols-1 gap-4">
                    <div className="bg-blue-600 p-6 rounded-lg text-white flex flex-col justify-between shadow-lg shadow-blue-600/10 relative overflow-hidden group">
                        <BarChart3 className="absolute -right-2 -bottom-2 w-24 h-24 text-white/10 group-hover:scale-110 transition-transform duration-500" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-blue-100">Revenue Fulfilled</span>
                        <div className="mt-4">
                            <p className="text-[32px] font-bold tracking-tight">₹{totalAmount.toLocaleString('en-IN')}</p>
                            <div className="flex items-center gap-2 mt-1">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-300 animate-pulse" />
                                <span className="text-[9px] font-bold uppercase tracking-widest text-blue-200">Live Audit Active</span>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white border border-slate-200 p-6 rounded-lg shadow-sm flex flex-col justify-between group">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Delivered Manifests</span>
                            <div className="px-2 py-1 bg-slate-900 text-white rounded text-[11px] font-bold">{data.length}</div>
                        </div>
                        <div className="flex items-center gap-3 mt-4">
                            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                                <Bike className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-[12px] font-bold text-slate-800 uppercase tracking-tight">Fulfillment Velocity</p>
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Efficiency Audited</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Delivery Manifest Theater */}
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
                <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
                    <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Delivery Report Manifest
                    </h3>
                </div>

                <div className="flex-1 overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Unique ID</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Channel & Status</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Customer Matrix</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Temporal & Rider</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Net Settlement</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr><td colSpan="5" className="py-24 text-center text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] animate-pulse">Scanning Delivery Vaults...</td></tr>
                            ) : data.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="py-24 text-center">
                                        <div className="flex flex-col items-center gap-4 opacity-20">
                                            <div className="w-20 h-20 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center">
                                                <PackageCheck className="w-10 h-10 text-slate-400" />
                                            </div>
                                            <div>
                                                <p className="text-[12px] font-bold text-slate-500 uppercase tracking-widest">Delivery Matrix Clean</p>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">Zero Artifacts Provisioned</p>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ) : data.map((row, idx) => (
                                <tr key={idx} className="group hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-6 text-[11px] font-bold text-slate-400 italic">#{row.unique_id}</td>
                                    <td className="px-6 py-6">
                                        <div className="flex flex-col gap-1.5">
                                            <span className="px-2 py-0.5 bg-blue-50 text-blue-600 border border-blue-100 rounded text-[9px] font-bold uppercase tracking-wider w-fit">{row.order_type}</span>
                                            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded text-[9px] font-bold uppercase tracking-wider w-fit">{row.status}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6">
                                        <div className="flex flex-col gap-0.5">
                                            <span className="text-[12px] font-bold text-slate-800 uppercase tracking-tight">{row.customer_name}</span>
                                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{row.customer_phone}</span>
                                            <div className="flex items-center gap-1 mt-1 opacity-60">
                                                <MapPin className="w-2.5 h-2.5 text-slate-400" />
                                                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tight line-clamp-1 truncate max-w-[150px]">{row.address || 'NO ADDRESS'}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-[10px] font-bold text-slate-700">{new Date(row.date_time).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</span>
                                            <div className="flex items-center gap-1.5 text-blue-500">
                                                <User className="w-3 h-3" />
                                                <span className="text-[9px] font-bold uppercase tracking-widest">{row.delivery_boy || 'UNASSIGNED'}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6 text-right">
                                        <div className="flex flex-col items-end gap-0.5">
                                            <span className="text-[20px] font-bold text-slate-900 tracking-tight">₹{parseFloat(row.total).toLocaleString('en-IN')}</span>
                                            <span className="text-[9px] font-bold text-blue-600 uppercase tracking-widest">Fulfilled Asset</span>
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

export default DeliveryReport;
