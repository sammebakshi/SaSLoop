import React, { useState, useEffect } from "react";
import { 
  ShoppingBag, Search, RefreshCw, Filter, 
  Smartphone, Monitor, ExternalLink, 
  CheckCircle2, Clock, XCircle, ChevronRight,
  Calendar, Globe, Database, ListChecks
} from "lucide-react";
import API_BASE from "../config";

const OnlineOrderHub = () => {
    const [activeTab, setActiveTab] = useState("NEW");

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-50 rounded-lg">
                        <ShoppingBag className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                        <h2 className="text-[14px] font-bold text-slate-800 uppercase tracking-tight">Direct Order Hub</h2>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Multi-platform routing & fulfillment center</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button className="px-4 py-2 bg-white border border-slate-200 rounded-md text-[10px] font-bold text-slate-600 uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2">
                        <ListChecks className="w-3.5 h-3.5" /> Manifest
                    </button>
                    <button className="px-4 py-2 bg-indigo-600 text-white rounded-md font-bold text-[10px] uppercase tracking-widest hover:bg-indigo-500 transition-all flex items-center gap-2 shadow-md shadow-indigo-600/10">
                        <RefreshCw className="w-3.5 h-3.5" /> Sync Orders
                    </button>
                </div>
            </div>

            {/* Tactical Filtering Protocol */}
            <div className="bg-white p-4 border border-slate-200 rounded-lg shadow-sm grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                <div className="space-y-1.5">
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider px-1">Select Outlet</label>
                    <select className="w-full h-9 bg-slate-50 border border-slate-200 rounded-md px-3 text-[11px] font-bold uppercase outline-none focus:border-indigo-500 transition-all">
                        <option>All Outlets</option>
                    </select>
                </div>
                <div className="space-y-1.5">
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider px-1">Platform Hub</label>
                    <select className="w-full h-9 bg-slate-50 border border-slate-200 rounded-md px-3 text-[11px] font-bold uppercase outline-none focus:border-indigo-500 transition-all">
                        <option>All Platforms</option>
                    </select>
                </div>
                <div className="space-y-1.5">
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider px-1">Timeline</label>
                    <div className="grid grid-cols-2 gap-2">
                        <input type="date" className="h-9 bg-slate-50 border border-slate-200 rounded-md px-2 text-[10px] font-bold uppercase outline-none focus:border-indigo-500 transition-all" />
                        <input type="date" className="h-9 bg-slate-50 border border-slate-200 rounded-md px-2 text-[10px] font-bold uppercase outline-none focus:border-indigo-500 transition-all" />
                    </div>
                </div>
                <div className="space-y-1.5">
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider px-1">Track Identity</label>
                    <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-md h-9 px-3 focus-within:border-indigo-500 transition-all">
                        <Search className="w-3.5 h-3.5 text-slate-300" />
                        <input type="text" placeholder="# ORDER-77..." className="bg-transparent text-[11px] font-bold uppercase outline-none w-full placeholder:text-slate-300" />
                    </div>
                </div>
                <button className="h-9 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest rounded-md hover:bg-slate-800 transition-all shadow-md shadow-slate-900/10">Apply Filters</button>
            </div>

            {/* Stage Navigation */}
            <div className="flex items-center gap-1 bg-white border border-slate-200 p-1 rounded-lg shadow-sm">
                {[
                    { id: 'NEW', name: 'New Orders', icon: ShoppingBag, color: 'indigo' },
                    { id: 'ACTIVE', name: 'Active Prep', icon: Clock, color: 'amber' },
                    { id: 'READY', name: 'Fulfilled', icon: CheckCircle2, color: 'emerald' },
                    { id: 'CANCEL', name: 'Cancelled', icon: XCircle, color: 'rose' }
                ].map(tab => (
                    <button 
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === tab.id ? `bg-indigo-600 text-white shadow-md shadow-indigo-600/20` : 'text-slate-400 hover:bg-slate-50'}`}
                    >
                        <tab.icon className={`w-3.5 h-3.5 ${activeTab === tab.id ? 'text-white' : `text-${tab.color}-400`}`} /> {tab.name}
                    </button>
                ))}
            </div>

            {/* Fulfillment Matrix Theater */}
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm min-h-[450px] flex flex-col overflow-hidden relative">
                <div className="flex-1 flex flex-col items-center justify-center p-12 text-center opacity-30">
                    <div className="w-20 h-20 rounded-full border-2 border-dashed border-slate-200 flex items-center justify-center mb-6">
                        <ShoppingBag className="w-10 h-10 text-slate-200" />
                    </div>
                    <h3 className="text-[13px] font-bold text-slate-800 uppercase tracking-tight">Routing Queue Clean</h3>
                    <p className="text-[11px] font-bold text-slate-400 uppercase mt-2 tracking-widest max-w-[300px]">Synchronize platforms to pull live incoming orders</p>
                </div>
                
                {/* Protocol Decoration */}
                <Globe className="absolute -right-12 -bottom-12 w-48 h-48 text-slate-900/[0.03] pointer-events-none group-hover:rotate-45 transition-transform duration-1000" />
            </div>
        </div>
    );
};

export default OnlineOrderHub;
