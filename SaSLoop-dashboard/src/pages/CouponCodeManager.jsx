import React, { useState, useEffect } from "react";
import { 
  Ticket, Search, Filter, Download, BarChart3, TrendingUp,
  Zap, CheckCircle2, RefreshCw, ChevronDown, Monitor, 
  Truck, Smartphone, Globe, Database, ListTree, Settings2, 
  ShieldCheck, ArrowRight, Plus, FileUp, FileText, Calendar,
  Clock, Tag, Percent, IndianRupee, Users, Trash2, X
} from "lucide-react";
import API_BASE from "../config";

const CouponCodeManager = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [outlets, setOutlets] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newCoupon, setNewCoupon] = useState({
        coupon_code: "",
        order_type: "ALL",
        amount: "",
        fixed_perct: "Fixed",
        applicable_order_amt: "",
        customer_type: "ALL",
        status: "ACTIVE",
        outlet_id: ""
    });

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
            if (d.length > 0) {
                setFilters(prev => ({ ...prev, outlet_id: d[0].id }));
                setNewCoupon(prev => ({ ...prev, outlet_id: d[0].id }));
            }
        };
        loadOutlets();
    }, []);

    useEffect(() => { 
        fetchData(); 
    }, [filters.outlet_id]);

    const handleCreateCoupon = async (e) => {
        e.preventDefault();
        if (!newCoupon.coupon_code || !newCoupon.amount) {
            alert("Please fill in code and amount.");
            return;
        }
        try {
            const res = await fetch(`${API_BASE}/api/brand/analytics/coupon-codes`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify(newCoupon)
            });
            if (res.ok) {
                setShowModal(false);
                setNewCoupon({
                    coupon_code: "",
                    order_type: "ALL",
                    amount: "",
                    fixed_perct: "Fixed",
                    applicable_order_amt: "",
                    customer_type: "ALL",
                    status: "ACTIVE",
                    outlet_id: filters.outlet_id || ""
                });
                fetchData();
            } else {
                const err = await res.json();
                alert("Error: " + (err.error || "Failed to create coupon"));
            }
        } catch (err) {
            console.error(err);
            alert("Failed to create coupon");
        }
    };

    const handleDeleteCoupon = async (id) => {
        if (!window.confirm("Are you sure you want to delete this coupon?")) return;
        try {
            const res = await fetch(`${API_BASE}/api/brand/analytics/coupon-codes/${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            });
            if (res.ok) {
                fetchData();
            } else {
                alert("Failed to delete coupon");
            }
        } catch (err) {
            console.error(err);
            alert("Failed to delete coupon");
        }
    };

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
                        <select className="w-full bg-white/5 border border-white/10 rounded-[1.5rem] px-8 py-5 text-sm font-black text-white uppercase italic outline-none focus:border-indigo-500 transition-all" value={filters.outlet_id} onChange={e => { setFilters({...filters, outlet_id: e.target.value}); setNewCoupon({...newCoupon, outlet_id: e.target.value}); }}>
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
                    <button onClick={() => setShowModal(true)} className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center gap-3 hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 italic">
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
                                <th className="px-8 py-8 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                <tr><td colSpan="8" className="py-20 text-center font-black uppercase text-xs tracking-[0.5em] text-slate-300 animate-pulse">Scanning Yield Vaults...</td></tr>
                            ) : data.length === 0 ? (
                                <tr><td colSpan="8" className="py-20 text-center font-black uppercase text-xs tracking-widest text-slate-400 italic">Zero Yield Artifacts Provisioned</td></tr>
                            ) : data.map((row, idx) => (
                                <tr key={idx} className="group hover:bg-slate-50/50 transition-colors">
                                    <td className="px-8 py-8 text-xs font-black text-slate-400 italic">#{idx + 1}</td>
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
                                    <td className="px-8 py-8 text-right">
                                        <button 
                                            onClick={() => handleDeleteCoupon(row.id)}
                                            className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition-all"
                                            title="Delete Coupon"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* CREATE COUPON MODAL */}
            {showModal && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-md">
                    <div className="bg-slate-900 border border-white/10 rounded-[3rem] w-full max-w-xl flex flex-col shadow-2xl overflow-hidden transition-all text-white p-8 space-y-6">
                        <div className="flex justify-between items-center pb-4 border-b border-white/10">
                            <h3 className="text-2xl font-black uppercase italic tracking-tighter flex items-center gap-3">
                                <Ticket className="text-emerald-500 w-6 h-6" /> Provision New Artifact
                            </h3>
                            <button onClick={() => setShowModal(false)} className="p-2 hover:bg-white/10 rounded-full transition-all text-slate-400 hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleCreateCoupon} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Coupon Code</label>
                                    <input 
                                        type="text" 
                                        required 
                                        value={newCoupon.coupon_code} 
                                        onChange={e => setNewCoupon({...newCoupon, coupon_code: e.target.value.toUpperCase()})}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm font-bold text-white outline-none focus:border-indigo-500"
                                        placeholder="e.g. SAVE20"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Target Outlet</label>
                                    <select 
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm font-bold text-white outline-none focus:border-indigo-500"
                                        value={newCoupon.outlet_id}
                                        onChange={e => setNewCoupon({...newCoupon, outlet_id: e.target.value})}
                                    >
                                        {outlets.map(o => <option key={o.id} value={o.id} className="bg-slate-900">{o.name.toUpperCase()}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Protocol Type</label>
                                    <select 
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm font-bold text-white outline-none focus:border-indigo-500"
                                        value={newCoupon.fixed_perct}
                                        onChange={e => setNewCoupon({...newCoupon, fixed_perct: e.target.value})}
                                    >
                                        <option value="Fixed" className="bg-slate-900">Fixed Amount (₹)</option>
                                        <option value="Percentage" className="bg-slate-900">Percentage (%)</option>
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Yield Value</label>
                                    <input 
                                        type="number" 
                                        required 
                                        step="0.01"
                                        value={newCoupon.amount} 
                                        onChange={e => setNewCoupon({...newCoupon, amount: e.target.value})}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm font-bold text-white outline-none focus:border-indigo-500"
                                        placeholder="e.g. 50"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Order Type Matrix</label>
                                    <select 
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm font-bold text-white outline-none focus:border-indigo-500"
                                        value={newCoupon.order_type}
                                        onChange={e => setNewCoupon({...newCoupon, order_type: e.target.value})}
                                    >
                                        <option value="ALL" className="bg-slate-900">All Order Types</option>
                                        <option value="Delivery" className="bg-slate-900">Delivery Only</option>
                                        <option value="Dine-In" className="bg-slate-900">Dine-In Only</option>
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Min. Order Amount (₹)</label>
                                    <input 
                                        type="number" 
                                        value={newCoupon.applicable_order_amt} 
                                        onChange={e => setNewCoupon({...newCoupon, applicable_order_amt: e.target.value})}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm font-bold text-white outline-none focus:border-indigo-500"
                                        placeholder="e.g. 500"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Customer Segments</label>
                                    <select 
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm font-bold text-white outline-none focus:border-indigo-500"
                                        value={newCoupon.customer_type}
                                        onChange={e => setNewCoupon({...newCoupon, customer_type: e.target.value})}
                                    >
                                        <option value="ALL" className="bg-slate-900">All Customers</option>
                                        <option value="VIP" className="bg-slate-900">VIP Only</option>
                                        <option value="NEW" className="bg-slate-900">New Customers</option>
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Status</label>
                                    <select 
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm font-bold text-white outline-none focus:border-indigo-500"
                                        value={newCoupon.status}
                                        onChange={e => setNewCoupon({...newCoupon, status: e.target.value})}
                                    >
                                        <option value="ACTIVE" className="bg-slate-900">ACTIVE</option>
                                        <option value="INACTIVE" className="bg-slate-900">INACTIVE</option>
                                    </select>
                                </div>
                            </div>

                            <div className="pt-4 flex gap-4">
                                <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-white py-3 rounded-xl font-bold uppercase text-xs">
                                    Cancel
                                </button>
                                <button type="submit" className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-slate-900 py-3 rounded-xl font-bold uppercase text-xs">
                                    Create Coupon
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CouponCodeManager;
