import React, { useState, useEffect } from "react";
import { Plus, Package, Trash2, Search, RefreshCw, Filter, Edit3, Box, Layers, Tag } from "lucide-react";
import API_BASE from "../config";

const RawMaterialItems = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const res = await fetch(`${API_BASE}/api/inventory/raw-materials`, {
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
                    <h2 className="pro-heading">Supply Chain Matrix</h2>
                    <p className="pro-subheading">Raw material inventory and procurement specifications</p>
                </div>
                <div className="flex items-center gap-1.5">
                    <button onClick={fetchData} className="pro-btn-secondary h-7 px-2"><RefreshCw className="w-3 h-3" /> Sync</button>
                    <button className="pro-btn-primary h-7 px-3"><Plus className="w-3 h-3" /> Add Material</button>
                </div>
            </div>

            <div className="pro-card p-2 flex items-center justify-between bg-white/50">
                <div className="flex items-center gap-2 flex-1">
                    <Search className="w-3.5 h-3.5 text-slate-400" />
                    <input type="text" placeholder="Search materials..." className="bg-transparent text-[12px] font-medium outline-none w-full" />
                </div>
                <div className="flex items-center gap-1">
                    <button className="p-1.5 hover:bg-slate-100 rounded text-slate-400"><Filter className="w-3.5 h-3.5" /></button>
                </div>
            </div>

            {loading ? (
                <div className="py-20 text-center pro-subheading animate-pulse">Scanning Inventory Vaults...</div>
            ) : (
                <div className="pro-card overflow-hidden">
                    <table className="pro-table">
                        <thead>
                            <tr>
                                <th>Material Identity</th>
                                <th>Classification</th>
                                <th>Unit Scale</th>
                                <th>Current Reserve</th>
                                <th className="text-right">Operations</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map(item => (
                                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="py-2.5">
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-7 h-7 rounded bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
                                                <Box className="w-3.5 h-3.5" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-bold text-slate-900 truncate uppercase">{item.name}</p>
                                                <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">RM_{item.id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="px-2 py-0.5 rounded bg-slate-50 border border-slate-200 text-[9px] font-bold uppercase text-slate-500">
                                            {item.category_name || 'Standard'}
                                        </span>
                                    </td>
                                    <td>
                                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-tighter">{item.unit_name || 'Units'}</span>
                                    </td>
                                    <td>
                                        <div className="flex items-center gap-1.5">
                                            <span className={`font-black text-xs ${item.stock <= item.min_stock ? 'text-rose-500' : 'text-slate-900'}`}>{item.stock || 0}</span>
                                            {item.stock <= item.min_stock && <Tag className="w-2.5 h-2.5 text-rose-500" />}
                                        </div>
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
                                <tr><td colSpan="5" className="py-20 text-center pro-subheading">No Materials Defined</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default RawMaterialItems;
