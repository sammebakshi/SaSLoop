import React, { useState, useEffect } from "react";
import { 
  Calculator, Save, RefreshCw, CheckCircle2, Search,
  DollarSign, Percent, FileText, AlertCircle, Store, ChevronRight
} from "lucide-react";
import API_BASE, { isMobileDevice } from "../config";

const OrderTypeGLManager = () => {
    const [outlets, setOutlets] = useState([]);
    const [selectedOutletId, setSelectedOutletId] = useState("");
    const [mappings, setMappings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const isMobile = isMobileDevice();

    const fetchData = async () => {
        try {
            const token = localStorage.getItem("token");
            const [outRes] = await Promise.all([
                fetch(`${API_BASE}/api/brand/outlets`, { headers: { "Authorization": `Bearer ${token}` } })
            ]);
            const outletList = await outRes.json();
            setOutlets(outletList);
            if (outletList.length > 0) {
                setSelectedOutletId(outletList[0].id);
            }
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    const fetchMappings = async (outletId) => {
        if (!outletId) return;
        try {
            const res = await fetch(`${API_BASE}/api/brand/gl-mappings/${outletId}`, {
                headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
            });
            const data = await res.json();
            setMappings(data);
        } catch (e) { console.error(e); }
    };

    useEffect(() => { fetchData(); }, []);
    useEffect(() => { fetchMappings(selectedOutletId); }, [selectedOutletId]);

    const handleUpdate = (id, field, value) => {
        setMappings(mappings.map(m => m.id === id ? { ...m, [field]: value } : m));
    };

    const handleSaveRow = async (mapping) => {
        setSaving(true);
        try {
            const res = await fetch(`${API_BASE}/api/brand/gl-mappings/${mapping.id}`, {
                method: "PUT",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify(mapping)
            });
            if (res.ok) {
                // Using a more modern feedback style if available, otherwise native alert
                alert(`${mapping.order_type} synced!`);
            }
        } catch (e) { console.error(e); }
        finally { setSaving(false); }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            
            {/* GL Architecture Header */}
            <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-50 rounded-lg">
                        <Calculator className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                        <h2 className="text-[14px] font-bold text-slate-800 uppercase tracking-tight">GL Architecture</h2>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Accounting & Commission Logic</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-md px-4 py-2 group hover:border-indigo-300 transition-all">
                        <Store className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                        <select 
                            className="bg-transparent border-none text-[11px] font-bold text-slate-700 uppercase tracking-tight outline-none min-w-[200px]"
                            value={selectedOutletId}
                            onChange={e => setSelectedOutletId(e.target.value)}
                        >
                            {outlets.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
                        </select>
                    </div>
                    <button onClick={() => fetchMappings(selectedOutletId)} className="p-2 hover:bg-slate-50 text-slate-400 rounded-md border border-slate-200 transition-all shadow-sm">
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="py-24 text-center text-[11px] font-bold text-slate-400 uppercase tracking-[0.4em] animate-pulse">Syncing Ledgers...</div>
            ) : (
                <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden min-h-[400px]">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200">
                                    <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Order Source</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">GL Accounting Code</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Commission (%)</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Commit</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {mappings.map(m => (
                                    <tr key={m.id} className="group hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all">
                                                    <Calculator className="w-4 h-4" />
                                                </div>
                                                <p className="font-bold text-slate-800 uppercase tracking-tight text-[14px]">{m.order_type}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-md border border-slate-200 focus-within:border-indigo-500 transition-all shadow-sm">
                                                <FileText className="w-3.5 h-3.5 text-slate-300" />
                                                <input 
                                                    type="text" 
                                                    value={m.gl_code || ""}
                                                    onChange={e => handleUpdate(m.id, 'gl_code', e.target.value)}
                                                    placeholder="GL_XXXXX"
                                                    className="bg-transparent border-none text-[11px] font-bold text-slate-700 uppercase outline-none w-full placeholder:text-slate-200"
                                                />
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-md border border-slate-200 w-28 shadow-sm">
                                                <Percent className="w-3.5 h-3.5 text-emerald-500" />
                                                <input 
                                                    type="number" 
                                                    value={m.commission_pct || 0}
                                                    onChange={e => handleUpdate(m.id, 'commission_pct', e.target.value)}
                                                    className="bg-transparent border-none text-[11px] font-bold text-slate-700 outline-none w-full"
                                                />
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <button 
                                                onClick={() => handleUpdate(m.id, 'is_active', !m.is_active)}
                                                className={`px-3 py-1 rounded-[4px] text-[9px] font-bold uppercase tracking-widest transition-all border ${m.is_active ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}
                                            >
                                                {m.is_active ? 'Active' : 'Paused'}
                                            </button>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <button 
                                                onClick={() => handleSaveRow(m)}
                                                disabled={saving}
                                                className="p-2.5 bg-indigo-600 text-white rounded-md shadow-md shadow-indigo-600/10 hover:bg-indigo-500 active:scale-90 transition-all flex items-center justify-center ml-auto"
                                            >
                                                <Save className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {mappings.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="py-24 text-center">
                                            <div className="flex flex-col items-center gap-3 opacity-20">
                                                <div className="w-16 h-16 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center">
                                                    <Calculator className="w-8 h-8 text-slate-400" />
                                                </div>
                                                <div>
                                                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">No fulfillment channels mapped</p>
                                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-1">Add order types to this outlet first</p>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Advisory Information */}
            <div className="p-6 bg-emerald-50 border border-emerald-100 rounded-lg flex items-start gap-4 relative overflow-hidden group">
                <Percent className="absolute -right-8 -bottom-8 w-40 h-40 text-emerald-600/5 group-hover:rotate-12 transition-transform duration-700" />
                <div className="p-3 bg-white text-emerald-600 rounded-lg shadow-sm">
                    <AlertCircle className="w-5 h-5" />
                </div>
                <div className="relative z-10 space-y-1">
                    <h4 className="text-[13px] font-bold text-emerald-900 uppercase tracking-tight">Automated Commission Reconciliation</h4>
                    <p className="max-w-3xl text-emerald-600/80 text-[10px] font-bold uppercase tracking-widest leading-relaxed">
                        These percentages facilitate real-time net-revenue calculations. Aggregator orders will auto-deduct the set commission in the Profit & Loss Hub for precise net margin tracking.
                    </p>
                </div>
            </div>

        </div>
    );
};

export default OrderTypeGLManager;
