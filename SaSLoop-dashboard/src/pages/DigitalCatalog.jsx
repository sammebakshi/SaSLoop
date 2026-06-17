import React, { useState, useEffect } from "react";
import { 
  Plus, Search, Download, Upload, RefreshCw, Filter, 
  Trash2, Edit3, MoreVertical, Image as ImageIcon,
  Zap, FileText, Settings, CheckCircle2, CloudSync, ChevronRight, Database
} from "lucide-react";
import API_BASE from "../config";

const DigitalCatalog = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const res = await fetch(`${API_BASE}/api/business-data/catalog`, {
                    headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
                });
                if (res.ok) setData(await res.json());
                else {
                    setData([
                        { id: 1, name: "Classic Beef Burger", category: "Burgers", price: "₹240", status: "Active", tax: "5%" },
                        { id: 2, name: "Margarita Pizza", category: "Pizza", price: "₹380", status: "Active", tax: "12%" },
                        { id: 3, name: "Fresh Lime Soda", category: "Beverages", price: "₹90", status: "Out of Stock", tax: "5%" }
                    ]);
                }
            } catch (e) { console.error(e); }
            finally { setLoading(false); }
        };
        fetchItems();
    }, []);

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Catalog Manifest Header */}
            <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-50 rounded-lg">
                        <FileText className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                        <h2 className="text-[14px] font-bold text-slate-800 uppercase tracking-tight">Catalog Manifest</h2>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Digital Menu Architecture</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button className="h-9 px-3 bg-white border border-slate-200 rounded-md text-[10px] font-bold text-slate-600 uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2">
                        <Download className="w-3.5 h-3.5" /> CSV
                    </button>
                    <button className="h-9 px-3 bg-white border border-slate-200 rounded-md text-[10px] font-bold text-slate-600 uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2">
                        <Upload className="w-3.5 h-3.5" /> Template
                    </button>
                    <button className="h-9 px-4 bg-slate-900 text-white rounded-md font-bold text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center gap-2 shadow-sm">
                        <Zap className="w-3.5 h-3.5 text-yellow-400" /> Bulk Import
                    </button>
                    <button className="h-9 px-4 bg-indigo-600 text-white rounded-md font-bold text-[10px] uppercase tracking-widest hover:bg-indigo-500 transition-all flex items-center gap-2 shadow-md shadow-indigo-600/10">
                        <Plus className="w-3.5 h-3.5" /> Add Item
                    </button>
                </div>
            </div>

            {/* Sync Status Hub */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex items-center gap-4 group">
                    <div className="w-12 h-12 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 transition-transform group-hover:scale-110">
                        <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Catalog Status</p>
                        <h3 className="text-[16px] font-bold text-slate-800 uppercase tracking-tight">Sync Success</h3>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex items-center gap-4 group">
                    <div className="w-12 h-12 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 transition-transform group-hover:scale-110">
                        <CloudSync className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Last Pulse</p>
                        <h3 className="text-[16px] font-bold text-slate-800 uppercase tracking-tight">Updated Now</h3>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex items-center gap-4 group">
                    <div className="w-12 h-12 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 transition-transform group-hover:scale-110">
                        <Database className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Items Indexed</p>
                        <h3 className="text-[16px] font-bold text-slate-800 uppercase tracking-tight">{data.length} Artifacts</h3>
                    </div>
                </div>
            </div>

            {/* High-Liquidity Data Matrix */}
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm flex flex-col overflow-hidden min-h-[400px]">
                <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
                    <div className="flex items-center gap-3 flex-1 max-w-sm">
                        <Search className="w-4 h-4 text-slate-400" />
                        <input type="text" placeholder="Quick search dishes or categories..." className="bg-transparent text-[11px] font-bold text-slate-600 outline-none w-full uppercase placeholder:text-slate-300" />
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="p-2 hover:bg-white rounded-md text-slate-400 border border-transparent hover:border-slate-200 transition-all"><Filter className="w-4 h-4" /></button>
                        <button className="p-2 hover:bg-white rounded-md text-slate-400 border border-transparent hover:border-slate-200 transition-all"><RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /></button>
                    </div>
                </div>

                <div className="flex-1 overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="px-6 py-3 w-16 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Icon</th>
                                <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Dish Identity</th>
                                <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Category</th>
                                <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">GST Logic</th>
                                <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Price Quantum</th>
                                <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr><td colSpan="7" className="py-24 text-center text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] animate-pulse">Scanning Catalog Vaults...</td></tr>
                            ) : data.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="py-24 text-center">
                                        <div className="flex flex-col items-center gap-3 opacity-20">
                                            <ImageIcon className="w-10 h-10 text-slate-400" />
                                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">No Catalog Artifacts Found</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : data.map((item, idx) => (
                                <tr key={idx} className="group hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="w-9 h-9 rounded-md bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-300 group-hover:bg-white group-hover:border-slate-200 transition-all">
                                            <ImageIcon className="w-4 h-4" />
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-[13px] font-bold text-slate-800 uppercase tracking-tight">{item.name}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50 px-2 py-0.5 rounded border border-slate-100">{item.category}</span>
                                    </td>
                                    <td className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase">{item.tax}</td>
                                    <td className="px-6 py-4 text-[13px] font-bold text-slate-900 tracking-tight">{item.price}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-0.5 rounded-[4px] text-[9px] font-bold uppercase tracking-widest border ${
                                            item.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'
                                        }`}>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <button className="p-2 hover:bg-white rounded-md text-slate-400 border border-transparent hover:border-slate-200 transition-all"><Edit3 className="w-3.5 h-3.5" /></button>
                                            <button className="p-2 hover:bg-rose-50 rounded-md text-rose-400 border border-transparent hover:border-rose-200 transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
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

export default DigitalCatalog;
