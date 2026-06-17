import React, { useState, useEffect } from "react";
import { Plus, Ticket, Trash2, Search, RefreshCw, Filter, Edit3, Fingerprint } from "lucide-react";
import API_BASE from "../config";

const CustomDiscountManager = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const res = await fetch(`${API_BASE}/api/custom-discounts`, {
                headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
            });
            const d = await res.json();
            setData(Array.isArray(d) ? d : []);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchData(); }, []);

    return (
        <div className="space-y-3 animate-pro-in">
            <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                    <h2 className="pro-heading">Adaptive Incentives</h2>
                    <p className="pro-subheading">Granular custom discounts and manual override protocols</p>
                </div>
                <div className="flex items-center gap-1.5">
                    <button onClick={fetchData} className="pro-btn-secondary h-7 px-2"><RefreshCw className="w-3 h-3" /> Sync</button>
                    <button className="pro-btn-primary h-7 px-3"><Plus className="w-3 h-3" /> New Override</button>
                </div>
            </div>

            <div className="pro-card p-2 flex items-center justify-between bg-white/50">
                <div className="flex items-center gap-2 flex-1">
                    <Search className="w-3.5 h-3.5 text-slate-400" />
                    <input type="text" placeholder="Search overrides..." className="bg-transparent text-[12px] font-medium outline-none w-full" />
                </div>
                <button className="p-1.5 hover:bg-slate-100 rounded text-slate-400"><Filter className="w-3.5 h-3.5" /></button>
            </div>

            {loading ? (
                <div className="py-20 text-center pro-subheading animate-pulse">Scanning Override Vaults...</div>
            ) : (
                <div className="pro-card overflow-hidden">
                    <table className="pro-table">
                        <thead>
                            <tr>
                                <th>Override Identity</th>
                                <th>Value Logic</th>
                                <th>Auth Protocol</th>
                                <th>Operational Status</th>
                                <th className="text-right">Operations</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map(item => (
                                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="font-bold text-slate-900 flex items-center gap-2">
                                        <Ticket className="w-3.5 h-3.5 text-slate-400" /> {item.name}
                                    </td>
                                    <td>
                                        <span className="font-black text-blue-600">{item.max_value}% Max Cap</span>
                                    </td>
                                    <td>
                                        <span className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400 uppercase">
                                            <Fingerprint className="w-3 h-3" /> Pin Required
                                        </span>
                                    </td>
                                    <td>
                                        <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-600 border border-emerald-100 text-[9px] font-black uppercase">Active</span>
                                    </td>
                                    <td className="text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <button className="p-1.5 hover:bg-slate-100 rounded text-slate-400"><Edit3 className="w-3 h-3" /></button>
                                            <button className="p-1.5 hover:bg-rose-50 rounded text-rose-400"><Trash2 className="w-3 h-3" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {data.length === 0 && (
                                <tr><td colSpan="5" className="py-20 text-center pro-subheading">No Custom Overrides Defined</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default CustomDiscountManager;
