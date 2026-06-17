import React, { useState, useEffect } from "react";
import { 
  Clock, Search, RefreshCw, Filter, 
  Plus, Database, CheckCircle2, Trash2, 
  Edit3, Tag, ListChecks, Printer,
  Download, History, IndianRupee, 
  TrendingUp, Layers, Cpu, MoreVertical,
  Calendar, Zap, Settings
} from "lucide-react";
import API_BASE from "../config";

const MealTimeSales = () => {
    return (
        <div className="space-y-3 animate-pro-in">
            {/* Precision Temporal Header */}
            <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                    <h2 className="pro-heading uppercase tracking-tighter text-slate-900 italic font-black tracking-tight">Meal-Slot Intelligence</h2>
                    <p className="pro-subheading uppercase tracking-widest text-[9px]">Temporal revenue attribution & slot-based operational auditing orchestration</p>
                </div>
                <div className="flex items-center gap-1.5">
                    <button className="pro-btn-secondary h-7 px-3 flex items-center gap-2 italic uppercase font-black tracking-tighter"><Settings className="w-3.5 h-3.5" /> Meal Slot Config</button>
                    <button className="pro-btn-primary h-7 px-4 flex items-center gap-2 bg-slate-900 border-slate-900 shadow-lg shadow-slate-900/20"><Download className="w-3.5 h-3.5" /> Export Analytics Vault</button>
                </div>
            </div>

            {/* Tactical Temporal Protocol */}
            <div className="pro-card p-3 bg-slate-900 text-white relative overflow-hidden group">
                <div className="relative z-10 grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
                    <div className="space-y-1">
                        <label className="text-[8px] font-black text-white/40 uppercase tracking-widest px-1">Target Operating Hub</label>
                        <select className="w-full h-8 bg-white/5 border border-white/10 rounded px-2 text-[10px] font-bold uppercase outline-none focus:border-indigo-500 transition-all cursor-pointer">
                            <option className="text-slate-900">All Target Hubs</option>
                        </select>
                    </div>
                    <div className="space-y-1">
                        <label className="text-[8px] font-black text-white/40 uppercase tracking-widest px-1">Temporal Start</label>
                        <input type="date" className="w-full h-8 bg-white/5 border border-white/10 rounded px-2 text-[10px] font-bold uppercase outline-none" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[8px] font-black text-white/40 uppercase tracking-widest px-1">Temporal End</label>
                        <input type="date" className="w-full h-8 bg-white/5 border border-white/10 rounded px-2 text-[10px] font-bold uppercase outline-none" />
                    </div>
                    <button className="h-8 bg-amber-500 hover:bg-amber-600 text-white text-[9px] font-black uppercase tracking-widest rounded transition-all shadow-xl shadow-amber-500/20 active:scale-95">Apply Temporal Filter</button>
                </div>
                <Clock className="absolute -right-8 -bottom-8 w-40 h-40 text-white/[0.02] pointer-events-none" />
            </div>

            {/* Temporal Manifest Theater */}
            <div className="pro-card min-h-[400px] flex flex-col bg-white overflow-hidden relative">
                <div className="p-3 border-b border-slate-100 bg-slate-50/20 flex items-center justify-between">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Database className="w-3.5 h-3.5" /> Meal Time-Based Sales Manifest</h3>
                </div>

                <div className="flex-1 overflow-x-auto">
                    <table className="pro-table">
                        <thead>
                            <tr className="bg-slate-900 text-white/50">
                                <th className="text-white">#</th>
                                <th className="text-white">Meal Slot Identity</th>
                                <th className="text-white">Time Window Matrix</th>
                                <th className="text-white">Total Revenue</th>
                                <th className="text-white">Total Orders</th>
                                <th className="text-white">Avg Order Value</th>
                                <th className="text-right text-white">Ops Performance</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td colSpan="7" className="py-24 text-center">
                                    <div className="flex flex-col items-center gap-3 opacity-20">
                                        <div className="w-16 h-16 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center">
                                            <TrendingUp className="w-8 h-8 text-slate-400" />
                                        </div>
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Scanning Temporal Vaults...</p>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Audit Decoration */}
                <Layers className="absolute -left-8 -bottom-8 w-40 h-40 text-slate-900/[0.02] pointer-events-none" />
            </div>
        </div>
    );
};

export default MealTimeSales;
