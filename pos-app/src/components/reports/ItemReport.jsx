import React, { useState, useEffect, useCallback, useMemo } from "react";
import { 
  Package, Search, RefreshCw, Filter, 
  Download, Calendar, IndianRupee, TrendingUp, 
  PieChart, ChevronDown, ListChecks, Database,
  Box, Layers, ChevronRight, Printer, Clock
} from "lucide-react";
import { API_BASE } from "../../services/api";
import * as XLSX from 'xlsx';

const ItemReport = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [outlets, setOutlets] = useState([]);
    const [categoriesList, setCategoriesList] = useState(["All"]);

    const todayStr = new Date().toISOString().split('T')[0];
    const [filters, setFilters] = useState({
        outlet_id: "All",
        date: todayStr,
        from_time: "00:00",
        to_time: "23:59",
        category: "All",
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

    const getCatalogCategoryMap = () => {
        const map = new Map();
        try {
            const keys = ['pos_catalog_cache', 'pos_item_mgmt_items', 'pos_menu'];
            keys.forEach(k => {
                const raw = localStorage.getItem(k);
                if (raw) {
                    const parsed = JSON.parse(raw);
                    if (Array.isArray(parsed)) {
                        parsed.forEach(item => {
                            const cat = item.category || item.category_name || item.parent_category || item.group;
                            if (cat && cat.toLowerCase() !== 'uncategorized' && cat.toLowerCase() !== 'uncategorised' && cat.toLowerCase() !== 'general') {
                                if (item.product_name) {
                                    map.set(item.product_name.trim().toLowerCase(), cat);
                                    map.set(item.product_name.split(' (')[0].trim().toLowerCase(), cat);
                                }
                                if (item.name) {
                                    map.set(item.name.trim().toLowerCase(), cat);
                                    map.set(item.name.split(' (')[0].trim().toLowerCase(), cat);
                                }
                                if (item.item_name) {
                                    map.set(item.item_name.trim().toLowerCase(), cat);
                                }
                            }
                        });
                    }
                }
            });
        } catch (e) {
            console.error("Error building catalog category map:", e);
        }
        return map;
    };

    // Load unique categories for dropdown
    useEffect(() => {
        try {
            const catSet = new Set();
            const keys = ['pos_catalog_cache', 'pos_item_mgmt_items', 'pos_menu'];
            keys.forEach(k => {
                const raw = localStorage.getItem(k);
                if (raw) {
                    const parsed = JSON.parse(raw);
                    if (Array.isArray(parsed)) {
                        parsed.forEach(i => {
                            const cat = i.category || i.category_name || i.parent_category || i.group;
                            if (cat) catSet.add(cat.toUpperCase());
                        });
                    }
                }
            });
            if (catSet.size > 0) {
                setCategoriesList(["All", ...Array.from(catSet).sort()]);
            }
        } catch (e) {
            console.error("Error loading categories list:", e);
        }
    }, []);

    const fetchData = useCallback(() => {
        setLoading(true);
        try {
            const localOrdersRaw = localStorage.getItem('pos_local_orders');
            const localOrders = localOrdersRaw ? JSON.parse(localOrdersRaw) : [];
            const catalogCatMap = getCatalogCategoryMap();

            const targetDate = filters.date || todayStr;
            const fromStr = `${targetDate} ${filters.from_time || "00:00"}:00`;
            const toStr = `${targetDate} ${filters.to_time || "23:59"}:59`;
            const fromTime = new Date(fromStr).getTime();
            const toTime = new Date(toStr).getTime();

            const itemMap = new Map();

            const processItem = (it) => {
                if (it.isCancelled) return;
                const rawName = it.product_name || it.name || it.item_name || "Unknown Item";
                const name = rawName.split(' (')[0].trim() || rawName.trim();
                const qty = parseFloat(it.quantity || it.qty || 1);
                const price = parseFloat(it.price || it.rate || it.base_price || 0);
                const total = qty * price;

                let category = it.category || it.category_name || it.parent_category || it.group;
                if (!category || category.toLowerCase() === 'general' || category.toLowerCase() === 'uncategorized' || category.toLowerCase() === 'n/a') {
                    const matched = catalogCatMap.get(name.toLowerCase()) || catalogCatMap.get(rawName.toLowerCase());
                    if (matched) {
                        category = matched;
                    } else {
                        category = "General";
                    }
                }
                category = category.toUpperCase();

                if (itemMap.has(name) || itemMap.has(rawName)) {
                    const key = itemMap.has(name) ? name : rawName;
                    const existing = itemMap.get(key);
                    existing.quantity += qty;
                    existing.total += total;
                    existing.average_price = existing.quantity > 0 ? (existing.total / existing.quantity) : price;
                    if ((existing.parent_category === 'GENERAL' || existing.parent_category === 'N/A') && category !== 'GENERAL') {
                        existing.parent_category = category;
                    }
                } else {
                    itemMap.set(name, {
                        item_name: name,
                        quantity: qty,
                        total: total,
                        average_price: price,
                        parent_category: category
                    });
                }
            };

            if (Array.isArray(localOrders)) {
                localOrders.forEach(order => {
                    if (order.status === 'CANCELLED' || order.status === 'DELETED' || order.status === 'REFUNDED') return;
                    
                    const orderTime = order.created_at ? new Date(order.created_at).getTime() : Date.now();
                    if (orderTime >= fromTime && orderTime <= toTime) {
                        const items = Array.isArray(order.items) ? order.items : (typeof order.items === 'string' ? JSON.parse(order.items) : []);
                        items.forEach(processItem);
                    }
                });
            }

            let combinedList = Array.from(itemMap.values());

            // Dynamically collect discovered categories
            combinedList.forEach(item => {
                if (item.parent_category) {
                    setCategoriesList(prev => {
                        if (!prev.includes(item.parent_category)) {
                            return ["All", ...Array.from(new Set([...prev.slice(1), item.parent_category])).sort()];
                        }
                        return prev;
                    });
                }
            });

            // Filter by Category
            if (filters.category && filters.category !== "All") {
                combinedList = combinedList.filter(item => (item.parent_category || "").toUpperCase() === filters.category.toUpperCase());
            }

            combinedList.sort((a, b) => b.quantity - a.quantity);

            if (filters.top_n && filters.top_n !== "All") {
                const limit = parseInt(filters.top_n);
                if (!isNaN(limit)) combinedList = combinedList.slice(0, limit);
            }
            setData(combinedList);
        } catch (err) {
            console.error("Error generating local item report:", err);
            setData([]);
        } finally {
            setLoading(false);
        }
    }, [filters.date, filters.from_time, filters.to_time, filters.category, filters.top_n]);

    useEffect(() => {
        loadOutlets();
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

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
        XLSX.writeFile(wb, `Item_Report_${filters.date}_${filters.from_time}_to_${filters.to_time}.xlsx`);
    };

    const handlePrintThermalReport = () => {
        if (data.length === 0) return;
        const outletName = filters.outlet_id === "All" ? "ALL OUTLETS" : (outlets.find(o => String(o.id) === String(filters.outlet_id))?.name || 'OUTLET');
        
        const itemRows = data.map(item => `
            <div class="flex-between">
                <span class="bold" style="max-width: 140px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${item.item_name}</span>
                <span>x${parseFloat(item.quantity || 0).toFixed(0)}</span>
                <span class="bold">₹${parseFloat(item.total || 0).toFixed(2)}</span>
            </div>
        `).join('');

        const printHtml = `
            <html>
            <head>
                <title>Item Sales Report</title>
                <style>
                    @page { size: 80mm auto; margin: 0; }
                    body { 
                        font-family: monospace, Courier, monospace; 
                        width: 78mm; 
                        margin: 0 auto; 
                        padding: 8px; 
                        font-size: 11px; 
                        line-height: 1.3;
                        color: #000;
                    }
                    .center { text-align: center; }
                    .bold { font-weight: bold; }
                    .dashed-line { border-bottom: 1px dashed #000; margin: 6px 0; }
                    .flex-between { display: flex; justify-content: space-between; margin-bottom: 3px; }
                    @media print {
                        body { margin: 0; padding: 4px; width: 100%; }
                    }
                </style>
            </head>
            <body>
                <div class="center bold" style="font-size: 14px;">ITEM SALES REPORT</div>
                <div class="center bold" style="font-size: 12px; margin-top: 2px;">${outletName.toUpperCase()}</div>
                <div class="dashed-line"></div>
                <div>DATE: ${filters.date}</div>
                <div>TIME: ${filters.from_time} TO ${filters.to_time}</div>
                <div>CAT:  ${filters.category.toUpperCase()}</div>
                <div class="dashed-line"></div>
                
                <div class="flex-between bold">
                    <span>ITEM</span>
                    <span>QTY</span>
                    <span>TOTAL</span>
                </div>
                <div class="dashed-line"></div>
                ${itemRows}
                <div class="dashed-line"></div>
                
                <div class="flex-between bold">
                    <span>TOTAL ITEMS SOLD:</span>
                    <span>${totalQuantity.toFixed(0)}</span>
                </div>
                <div class="flex-between bold">
                    <span>TOTAL REVENUE:</span>
                    <span>₹${totalRevenue.toFixed(2)}</span>
                </div>
                
                <div class="dashed-line"></div>
                <div class="center" style="font-size: 9px;">PRINTED AT: ${new Date().toLocaleString()}</div>
                <script>window.onload = () => { window.print(); window.close(); }</script>
            </body>
            </html>
        `;

        if (window.require) {
            try {
                const { ipcRenderer } = window.require('electron');
                ipcRenderer.send('print-silent', { html: printHtml.replace(/<script>.*<\/script>/, '') });
                return;
            } catch (err) {
                console.error("Silent report print failed:", err);
            }
        }
        
        const printWindow = window.open('', '_blank', 'width=600,height=800');
        if (printWindow) {
            printWindow.document.write(printHtml);
            printWindow.document.close();
        }
    };

    const totalQuantity = data.reduce((acc, curr) => acc + parseFloat(curr.quantity || 0), 0);
    const totalRevenue = data.reduce((acc, curr) => acc + parseFloat(curr.total || 0), 0);

    return (
        <div className="space-y-6 animate-in fade-in duration-500 text-slate-800 pb-12">
            {/* Header */}
            <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-indigo-50 rounded-xl border border-indigo-100/50">
                        <Package className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                        <h2 className="text-base font-bold text-slate-900 uppercase tracking-tight flex items-center gap-2">
                            Item Revenue Matrix & Catalog Report
                        </h2>
                        <p className="text-[11px] text-slate-500 font-semibold">Granular item sales, category classification & shift performance</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button 
                        onClick={handlePrintThermalReport}
                        disabled={data.length === 0}
                        className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-bold text-[10px] uppercase tracking-widest hover:bg-emerald-500 transition-all flex items-center gap-2 shadow-sm disabled:opacity-50"
                    >
                        <Printer className="w-3.5 h-3.5" /> Print Thermal (3-inch)
                    </button>
                    <button 
                        onClick={handleExport}
                        disabled={data.length === 0}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-bold text-[10px] uppercase tracking-widest hover:bg-indigo-500 transition-all flex items-center gap-2 shadow-sm disabled:opacity-50"
                    >
                        <Download className="w-3.5 h-3.5" /> Export Matrix
                    </button>
                </div>
            </div>

            {/* Tactical Item Protocol Filter Box */}
            <div className="bg-white p-5 border border-slate-200 rounded-xl shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                        <Filter className="w-4 h-4 text-indigo-500" /> Operational Shift & Category Filters
                    </h3>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Filtered Catalog Analytics</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-6 gap-3 items-end">
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Report Date</label>
                        <input 
                            type="date" 
                            value={filters.date}
                            onChange={e => setFilters(prev => ({ ...prev, date: e.target.value }))}
                            className="w-full h-9 bg-slate-50 border border-slate-200 rounded-lg px-3 text-xs font-bold text-slate-800 outline-none focus:border-indigo-500 transition-all cursor-pointer" 
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">From Time</label>
                        <input 
                            type="time" 
                            value={filters.from_time}
                            onChange={e => setFilters(prev => ({ ...prev, from_time: e.target.value }))}
                            className="w-full h-9 bg-slate-50 border border-slate-200 rounded-lg px-3 text-xs font-bold text-slate-800 outline-none focus:border-indigo-500 transition-all cursor-pointer" 
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">To Time</label>
                        <input 
                            type="time" 
                            value={filters.to_time}
                            onChange={e => setFilters(prev => ({ ...prev, to_time: e.target.value }))}
                            className="w-full h-9 bg-slate-50 border border-slate-200 rounded-lg px-3 text-xs font-bold text-slate-800 outline-none focus:border-indigo-500 transition-all cursor-pointer" 
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Category</label>
                        <select 
                            value={filters.category}
                            onChange={e => setFilters(prev => ({ ...prev, category: e.target.value }))}
                            className="w-full h-9 bg-slate-50 border border-slate-200 rounded-lg px-3 text-xs font-bold text-slate-800 uppercase outline-none focus:border-indigo-500 transition-all cursor-pointer"
                        >
                            {categoriesList.map((cat, idx) => (
                                <option key={idx} value={cat}>{cat === "All" ? "ALL CATEGORIES" : cat}</option>
                            ))}
                        </select>
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Limit (Top N)</label>
                        <select 
                            value={filters.top_n}
                            onChange={e => setFilters(prev => ({ ...prev, top_n: e.target.value }))}
                            className="w-full h-9 bg-slate-50 border border-slate-200 rounded-lg px-3 text-xs font-bold text-slate-800 uppercase outline-none focus:border-indigo-500 transition-all cursor-pointer"
                        >
                            <option value="10">Top 10 Items</option>
                            <option value="25">Top 25 Items</option>
                            <option value="50">Top 50 Items</option>
                            <option value="100">Top 100 Items</option>
                            <option value="All">All Items</option>
                        </select>
                    </div>
                    <button 
                        onClick={fetchData}
                        className="h-9 bg-slate-900 text-white rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-slate-800 transition-all shadow-sm flex items-center justify-center gap-2"
                    >
                        <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Analyze
                    </button>
                </div>
            </div>

            {/* Performance Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 flex items-center justify-between">
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Quantity Sold</p>
                        <p className="text-[20px] font-bold text-slate-900 uppercase tracking-tight">{totalQuantity.toFixed(0)} units</p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                        <Box className="w-5 h-5" />
                    </div>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 flex items-center justify-between">
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Revenue Generated</p>
                        <p className="text-[20px] font-bold text-slate-900 uppercase tracking-tight">₹{totalRevenue.toFixed(2)}</p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
                        <IndianRupee className="w-5 h-5" />
                    </div>
                </div>
            </div>

            {/* Performance Matrix Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[450px]">
                <div className="flex-1 overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="px-6 py-3.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Item Identity</th>
                                <th className="px-6 py-3.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Category</th>
                                <th className="px-6 py-3.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Quantity Sold</th>
                                <th className="px-6 py-3.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Average Price</th>
                                <th className="px-6 py-3.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Gross Revenue</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="py-24 text-center text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] animate-pulse">
                                        Calculating Catalog Performance...
                                    </td>
                                </tr>
                            ) : data.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="py-24 text-center">
                                        <div className="flex flex-col items-center gap-4 opacity-30">
                                            <div className="w-16 h-16 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center">
                                                <Layers className="w-8 h-8 text-slate-400" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-slate-600 uppercase tracking-widest">No Items Found</p>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Adjust shift time window or category filter</p>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ) : data.map((item, idx) => (
                                <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                                    <td className="px-6 py-3.5 font-bold text-slate-800 text-[11px] uppercase tracking-tight">
                                        {item.item_name}
                                    </td>
                                    <td className="px-6 py-3.5 text-[10px]">
                                        <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 font-extrabold rounded-md uppercase border border-indigo-100">
                                            {item.parent_category || "GENERAL"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-3.5 text-[11px] font-bold text-slate-700">
                                        {parseFloat(item.quantity || 0).toFixed(0)}
                                    </td>
                                    <td className="px-6 py-3.5 text-[11px] font-bold text-slate-600 font-mono">
                                        ₹{parseFloat(item.average_price || 0).toFixed(2)}
                                    </td>
                                    <td className="px-6 py-3.5 text-[11px] font-extrabold text-emerald-600 font-mono">
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
