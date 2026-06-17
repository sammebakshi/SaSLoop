import React, { useState, useEffect } from "react";
import { 
  Scale, Plus, Search, X, Trash2, Edit3, RefreshCw, Filter
} from "lucide-react";
import API_BASE from "../config";

const RMUnits = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/api/inventory/rm-units`, {
                headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
            });
            if (!res.ok) {
                setData([
                    { id: 1, name: "Kilogram", short_name: "KG", conversion: "1000g", status: "Active" },
                    { id: 2, name: "Litre", short_name: "LTR", conversion: "1000ml", status: "Active" }
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
                    <h2 className="pro-heading">Measurement Protocols</h2>
                    <p className="pro-subheading">Orchestrating quantification artifacts and procurement measurement logic</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="pro-btn-secondary"><RefreshCw className="w-3.5 h-3.5" /> Sync</button>
                    <button onClick={() => setShowModal(true)} className="pro-btn-primary"><Plus className="w-4 h-4" /> Provision Unit</button>
                </div>
            </div>

            <div className="pro-card p-4 flex items-center justify-between bg-white/50 backdrop-blur-sm">
                <div className="flex items-center gap-3 flex-1 max-w-md">
                    <Search className="w-4 h-4 text-slate-400" />
                    <input type="text" placeholder="Search units..." className="bg-transparent text-sm font-medium outline-none w-full" />
                </div>
                <button className="p-2 hover:bg-slate-100 rounded-lg transition-all text-slate-400"><Filter className="w-4 h-4" /></button>
            </div>

            <div className="pro-card overflow-hidden">
                <table className="pro-table">
                    <thead>
                        <tr>
                            <th>Unit Name</th>
                            <th>Short Identity</th>
                            <th>Conversion Logic</th>
                            <th>Operational Status</th>
                            <th className="text-right">Action Protocol</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="5" className="py-20 text-center pro-subheading animate-pulse">Scanning Quantification Vaults...</td></tr>
                        ) : data.map((unit, idx) => (
                            <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                                <td className="font-semibold text-slate-900">{unit.name}</td>
                                <td className="text-xs font-bold text-emerald-600 tracking-wider">{unit.short_name}</td>
                                <td className="text-[11px] font-medium text-slate-400">{unit.conversion}</td>
                                <td>
                                    <span className="px-2.5 py-0.5 bg-slate-50 text-slate-600 rounded-full text-[10px] font-bold uppercase tracking-wider border border-slate-200">
                                        {unit.status}
                                    </span>
                                </td>
                                <td className="flex items-center justify-end gap-2">
                                    <button className="p-2 bg-slate-50 text-slate-400 rounded-lg hover:bg-slate-900 hover:text-white transition-all shadow-sm"><Edit3 className="w-3.5 h-3.5" /></button>
                                    <button className="p-2 bg-rose-50 text-rose-400 rounded-lg hover:bg-rose-500 hover:text-white transition-all shadow-sm"><Trash2 className="w-3.5 h-3.5" /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/20 backdrop-blur-sm animate-pro-in">
                    <div className="bg-white w-full max-w-md rounded-2xl overflow-hidden shadow-2xl border border-slate-100">
                        <div className="px-8 py-5 border-b border-slate-100 flex items-center justify-between">
                            <h3 className="pro-heading text-lg">Provision Unit Node</h3>
                            <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 rounded-xl transition-all text-slate-400"><X className="w-5 h-5" /></button>
                        </div>
                        <div className="p-8 space-y-6">
                            <div className="space-y-2">
                                <label className="pro-subheading pl-1">Unit Identity*</label>
                                <input type="text" placeholder="E.G. KILOGRAM..." className="pro-input" />
                            </div>
                            <div className="space-y-2">
                                <label className="pro-subheading pl-1">Short Protocol Identity*</label>
                                <input type="text" placeholder="E.G. KG..." className="pro-input" />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button onClick={() => setShowModal(false)} className="flex-1 pro-btn-secondary">Abort</button>
                                <button onClick={() => setShowModal(false)} className="flex-[2] pro-btn-primary text-xs uppercase tracking-widest font-black italic">Create Artifact</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RMUnits;
