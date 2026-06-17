import React, { useState, useEffect } from "react";
import { Plus, Globe, Trash2, CheckCircle2, Search, RefreshCw, Filter } from "lucide-react";
import API_BASE from "../config";

const MarketManager = () => {
    const [markets, setMarkets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newMarket, setNewMarket] = useState("");
    const [adding, setAdding] = useState(false);

    const fetchMarkets = async () => {
        try {
            const res = await fetch(`${API_BASE}/api/brand/markets`, {
                headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
            });
            const data = await res.json();
            setMarkets(Array.isArray(data) ? data : []);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchMarkets(); }, []);

    const handleAdd = async () => {
        if (!newMarket.trim()) return;
        setAdding(true);
        try {
            const res = await fetch(`${API_BASE}/api/brand/markets`, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({ name: newMarket })
            });
            if (res.ok) {
                setNewMarket("");
                fetchMarkets();
            }
        } catch (e) { console.error(e); }
        finally { setAdding(false); }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-50 rounded-lg">
                        <Globe className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                        <h2 className="text-[14px] font-bold text-slate-800 uppercase tracking-tight">Market Console</h2>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Geographic regions & operational clusters</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <input 
                        type="text" 
                        value={newMarket}
                        onChange={e => setNewMarket(e.target.value)}
                        placeholder="Enter Market Name..."
                        className="bg-slate-50 border border-slate-200 rounded-md px-4 py-2 text-[11px] font-bold uppercase tracking-tight outline-none focus:border-indigo-500 transition-all w-64 placeholder:text-slate-300 shadow-inner"
                    />
                    <button 
                        onClick={handleAdd}
                        disabled={adding}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md font-bold text-[10px] uppercase tracking-widest hover:bg-indigo-500 transition-all flex items-center gap-2 shadow-md shadow-indigo-600/10"
                    >
                        {adding ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                        Add Market
                    </button>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                    <Search className="w-4 h-4 text-slate-400" />
                    <input type="text" placeholder="Search markets..." className="bg-transparent text-[11px] font-bold text-slate-600 outline-none w-full uppercase placeholder:text-slate-300" />
                </div>
                <button className="p-2 hover:bg-slate-50 rounded-md text-slate-400 border border-transparent hover:border-slate-200 transition-all"><Filter className="w-4 h-4" /></button>
            </div>

            {loading ? (
                <div className="py-24 text-center text-[11px] font-bold text-slate-400 uppercase tracking-[0.4em] animate-pulse">Syncing Market Vaults...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {markets.map(m => (
                        <div key={m.id} className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex items-center justify-between group hover:border-indigo-200 transition-all cursor-pointer">
                            <div className="flex items-center gap-3 min-w-0">
                                <div className="w-10 h-10 bg-slate-50 text-slate-400 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                    <Globe className="w-5 h-5" />
                                </div>
                                <div className="min-w-0">
                                    <h3 className="text-[13px] font-bold text-slate-800 truncate uppercase tracking-tight">{m.name}</h3>
                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest opacity-60">MKT_{m.id}</p>
                                </div>
                            </div>
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 opacity-20 group-hover:opacity-100 transition-opacity" />
                        </div>
                    ))}
                    {markets.length === 0 && (
                        <div className="col-span-full py-24 text-center border border-dashed border-slate-200 rounded-lg">
                            <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-4 border border-slate-100">
                                <Globe className="w-8 h-8 text-slate-300" />
                            </div>
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">No Markets Defined</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default MarketManager;
