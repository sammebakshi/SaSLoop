import React, { useState, useEffect, useCallback } from "react";
import { 
  Package, Search, RefreshCw, Filter, 
  Download, Calendar, IndianRupee, TrendingUp, 
  PieChart, ChevronDown, ListChecks, Database,
  Box, Layers, ChevronRight
} from "lucide-react";
import { API_BASE } from "../../services/api";
import * as XLSX from 'xlsx';

const ItemReport = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [outlets, setOutlets] = useState([]);
    const [filters, setFilters] = useState({
        outlet_id: "All",
        from_date: new Date().toISOString().split('T')[0],
        to_date: new Date().toISOString().split('T')[0],
        top_n: "50"
    });

    const loadOutlets = async () => {
        try {
            const res = await fetch(`${API_BASE}/api/brand/outlets`, {
                headers: { "Authorization": `Bearer ${localStorage.getItem("pos_token")}` }
            });
            if (res.ok) {
                const d = await res.json();
                setOutlets(d);
            }
        } catch (e) {
            console.error("Error loading outlets:", e);
        }
    };

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const queryParams = new URLSearchParams();
            if (filters.outlet_id !== "All") {
                queryParams.append("outlet_ids", filters.outlet_id);
            } else {
                queryParams.append("outlet_ids", "All");
            }
            if (filters.from_date) queryParams.append("from_date", filters.from_date + " 00:00:00");
            if (filters.to_date) queryParams.append("to_date", filters.to_date + " 23:59:59");
            if (filters.top_n) queryParams.append("top_n", filters.top_n);

            const res = await fetch(`${API_BASE}/api/brand/analytics/item-report?${queryParams.toString()}`, {
                headers: { "Authorization": `Bearer ${localStorage.getItem("pos_token")}` }
            });
            if (res.ok) {
                const d = await res.json();
                setData(d);
            }
        } catch (e) {
            console.error("Error loading item report:", e);
        } finally {
            setLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        loadOutlets();
    }, []);

    useEffect(() => {
        fetchData();
    }, [filters.outlet_id, fetchData]);

    const handleExport = () => {
        if (data.length === 0) return;
        const ws = XLSX.utils.json_to_sheet(data.map(item => ({
            "Item Identity": item.item_name,
            "Category": item.parent_category || "N/A",
            "Quantity Sold": parseFloat(item.quantity || 0),
            "Average Price": parseFloat(item.average_price || 0).toFixed(2),
            "Gross Revenue": parseFloat(item.total || 0).toFixed(2)
        })));
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Item Report");
        XLSX.writeFile(wb, `Item_Report_${filters.from_date}_to_${filters.to_date}.xlsx`);
    };

    const totalQuantity = data.reduce((acc, curr) => acc + parseFloat(curr.quantity || 0), 0);
    const totalRevenue = data.reduce((acc, curr) => acc + parseFloat(curr.total || 0), 0);

    return (
        <div className="space-y-6 animate-in fade-in duration-500 text-slate-800">
            {/* Header */}
            <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-50 rounded-lg">
                        <Package className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                        <h2 className="text-[14px] font-bold text-slate-800 uppercase tracking-tight">Item Revenue Matrix</h2>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Granular performance & catalog orchestration</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button 
                        onClick={handleExport}
                        disabled={data.length === 0}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md font-bold text-[10px] uppercase tracking-widest hover:bg-indigo-500 transition-all flex items-center gap-2 shadow-md shadow-indigo-600/10 disabled:opacity-50"
                    >
                        <Download className="w-3.5 h-3.5" /> Export Matrix
                    </button>
                </div>
            </div>

            {/* Tactical Item Protocol */}
            <div className="bg-white p-6 border border-slate-200 rounded-lg shadow-sm relative overflow-hidden group">
                <div className="relative z-10 grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                    <div className="space-y-1.5 hidden">
                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider px-1">Outlet Hub</label>
                        <select 
                            value={filters.outlet_id}
                            onChange={e => setFilters(prev => ({ ...prev, outlet_id: e.target.value }))}
                            className="w-full h-9 bg-slate-50 border border-slate-200 rounded-md px-3 text-[11px] font-bold uppercase outline-none focus:border-indigo-500 transition-all"
                        >
                            <option value="All">All Outlets</option>
                            {outlets.map(o => (
                                <option key={o.id} value={o.id}>{o.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider px-1">Timeline</label>
                        <div className="grid grid-cols-2 gap-2">
                            <input 
                                type="date" 
                                value={filters.from_date}
                                onChange={e => setFilters(prev => ({ ...prev, from_date: e.target.value }))}
                                className="h-9 bg-slate-50 border border-slate-200 rounded-md px-2 text-[10px] font-bold uppercase outline-none focus:border-indigo-500 transition-all" 
                            />
                            <input 
                                type="date" 
                                value={filters.to_date}
                                onChange={e => setFilters(prev => ({ ...prev, to_date: e.target.value }))}
                                className="h-9 bg-slate-50 border border-slate-200 rounded-md px-2 text-[10px] font-bold uppercase outline-none focus:border-indigo-500 transition-all" 
                            />
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider px-1">Limit (Top N)</label>
                        <select 
                            value={filters.top_n}
                            onChange={e => setFilters(prev => ({ ...prev, top_n: e.target.value }))}
                            className="w-full h-9 bg-slate-50 border border-slate-200 rounded-md px-3 text-[11px] font-bold uppercase outline-none focus:border-indigo-500 transition-all"
                        >
                            <option value="10">Top 10 Items</option>
                            <option value="25">Top 25 Items</option>
                            <option value="50">Top 50 Items</option>
                            <option value="100">Top 100 Items</option>
                        </select>
                    </div>
                    <button 
                        onClick={fetchData}
                        className="h-9 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest rounded-md hover:bg-slate-800 transition-all shadow-md shadow-slate-900/10 active:scale-95 flex items-center justify-center gap-2"
                    >
                        <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Analyze Matrix
                    </button>
                </div>
                <Package className="absolute -right-12 -bottom-12 w-48 h-48 text-slate-900/[0.03] pointer-events-none group-hover:rotate-12 transition-transform duration-1000" />
            </div>

            {/* Performance Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-4 flex items-center justify-between">
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Quantity Sold</p>
                        <p className="text-[18px] font-bold text-slate-800 uppercase tracking-tight">{totalQuantity.toFixed(0)} units</p>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                        <Box className="w-5 h-5" />
                    </div>
                </div>
                <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-4 flex items-center justify-between">
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Revenue Generated</p>
                        <p className="text-[18px] font-bold text-slate-800 uppercase tracking-tight">₹{totalRevenue.toFixed(2)}</p>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                        <IndianRupee className="w-5 h-5" />
                    </div>
                </div>
            </div>

            {/* Performance Matrix Theater */}
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
                <div className="flex-1 overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Item Identity</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Category</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Quantity Sold</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Average Price</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Gross Revenue</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="py-32 text-center text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] animate-pulse">
                                        Calculating Catalog Performance...
                                    </td>
                                </tr>
                            ) : data.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="py-32 text-center">
                                        <div className="flex flex-col items-center gap-4 opacity-20">
                                            <div className="w-20 h-20 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center">
                                                <Layers className="w-10 h-10 text-slate-400" />
                                            </div>
                                            <div>
                                                <p className="text-[12px] font-bold text-slate-500 uppercase tracking-widest">Item Matrix Clean</p>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">No Revenue Data Provisioned</p>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ) : data.map((item, idx) => (
                                <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4 font-bold text-slate-800 text-[11px] uppercase tracking-tight">
                                        {item.item_name}
                                    </td>
                                    <td className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase">
                                        {item.parent_category || "N/A"}
                                    </td>
                                    <td className="px-6 py-4 text-[11px] font-bold text-slate-700">
                                        {parseFloat(item.quantity || 0).toFixed(0)}
                                    </td>
                                    <td className="px-6 py-4 text-[11px] font-bold text-slate-600">
                                        ₹{parseFloat(item.average_price || 0).toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 text-[11px] font-bold text-emerald-600">
                                        ₹{parseFloat(item.total || 0).toFixed(2)}
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

export default ItemReport;
