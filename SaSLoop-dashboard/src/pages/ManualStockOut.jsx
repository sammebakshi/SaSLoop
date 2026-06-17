import React, { useState, useEffect } from "react";
import { 
  PackageMinus, Search, Plus, X, Trash2, Edit3, RefreshCw, 
  Filter, AlertTriangle, FileMinus, MoreHorizontal
} from "lucide-react";
import API_BASE from "../config";

const ManualStockOut = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/api/inventory/manual-stock-out`, {
                headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
            });
            if (!res.ok) {
                setData([
                    { id: 1, item: "Fresh Milk", qty: "5 LTR", reason: "Expired / Wastage", date: "2026-05-07", user: "Admin" },
                    { id: 2, item: "Chicken Breast", qty: "2 KG", reason: "Damaged during Prep", date: "2026-05-07", user: "Chef-Basit" }
                ]);
            } else {
                setData(await res.json());
            }
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchData(); }, []);

    return (
        <div className="space-y-6 animate-pro-in">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h2 className="pro-heading">Disposal Manifest</h2>
                    <p className="pro-subheading">Orchestrating manual stock-out protocols and wastage artifacts</p>
                </div>
                <button onClick={() => setShowModal(true)} className="pro-btn-primary bg-rose-600 hover:bg-rose-700 shadow-rose-900/10">
                    <FileMinus className="w-4 h-4" /> Execute Stock Out
                </button>
            </div>

            <div className="pro-card p-4 flex items-center justify-between bg-white/50 backdrop-blur-sm">
                <div className="flex items-center gap-3 flex-1 max-w-md">
                    <Search className="w-4 h-4 text-slate-400" />
                    <input type="text" placeholder="Search disposal logs..." className="bg-transparent text-sm font-medium outline-none w-full" />
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold text-rose-500 uppercase tracking-widest italic animate-pulse">Monitoring Active</span>
                    <button className="p-2 hover:bg-slate-100 rounded-lg transition-all text-slate-400"><Filter className="w-4 h-4" /></button>
                </div>
            </div>

            <div className="pro-card overflow-hidden">
                <table className="pro-table">
                    <thead>
                        <tr>
                            <th>RM Identity</th>
                            <th>Quantity</th>
                            <th>Reason Protocol</th>
                            <th>Execution Temporal</th>
                            <th>Operator</th>
                            <th className="text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="6" className="py-20 text-center pro-subheading animate-pulse">Scanning Disposal Vaults...</td></tr>
                        ) : data.map((log, idx) => (
                            <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                                <td className="font-semibold text-slate-900">{log.item}</td>
                                <td className="text-[11px] font-black text-rose-500">{log.qty}</td>
                                <td className="text-[11px] font-medium text-slate-400">{log.reason}</td>
                                <td className="text-[11px] font-medium text-slate-400">{log.date}</td>
                                <td className="text-[10px] font-bold text-slate-900 uppercase">{log.user}</td>
                                <td className="text-right">
                                    <button className="p-2 text-slate-300 hover:text-slate-900 transition-colors"><MoreHorizontal className="w-4 h-4" /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/20 backdrop-blur-sm animate-pro-in">
                    <div className="bg-white w-full max-w-md rounded-2xl overflow-hidden shadow-2xl border border-slate-100">
                        <div className="px-8 py-5 border-b border-rose-50 bg-rose-50/30 flex items-center justify-between">
                            <h3 className="pro-heading text-lg text-rose-600 flex items-center gap-3"><AlertTriangle className="w-5 h-5" /> Execute Stock Out</h3>
                            <button onClick={() => setShowModal(false)} className="p-2 hover:bg-rose-50 rounded-xl transition-all text-rose-400"><X className="w-5 h-5" /></button>
                        </div>
                        <div className="p-8 space-y-6">
                            <div className="space-y-2">
                                <label className="pro-subheading pl-1">RM Identity Node*</label>
                                <select className="pro-input appearance-none">
                                    <option>SELECT MATERIAL...</option>
                                    <option>FRESH MILK</option>
                                    <option>CHICKEN BREAST</option>
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="pro-subheading pl-1">Reduction Qty*</label>
                                    <input type="text" placeholder="E.G. 5..." className="pro-input" />
                                </div>
                                <div className="space-y-2">
                                    <label className="pro-subheading pl-1">Unit Protocol*</label>
                                    <input type="text" placeholder="LTR / KG..." className="pro-input" />
                                </div>
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button onClick={() => setShowModal(false)} className="flex-1 pro-btn-secondary">Abort</button>
                                <button onClick={() => setShowModal(false)} className="flex-[2] pro-btn-primary bg-rose-600 hover:bg-rose-700 text-xs uppercase tracking-widest font-black italic">Confirm Disposal</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManualStockOut;
