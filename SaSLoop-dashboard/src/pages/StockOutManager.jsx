import React, { useState, useEffect } from "react";
import { 
  ArrowUpCircle, Search, RefreshCw, Filter, 
  Plus, Database, CheckCircle2, Trash2, 
  Edit3, Tag, ListChecks, FileText,
  PackageMinus, Truck, Calendar, History,
  IndianRupee, PackageX, TrendingDown,
  Warehouse
} from "lucide-react";
import API_BASE from "../config";

const StockOutManager = () => {
    return (
        <div className="space-y-3 animate-pro-in">
            {/* Precision Outflow Header */}
            <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                    <h2 className="pro-heading uppercase tracking-tighter text-slate-900 italic font-black tracking-tight">Material Depletion Orchestrator</h2>
                    <p className="pro-subheading uppercase tracking-widest text-[9px]">Internal requisition orchestration, depletion auditing & consumption temporal artifacts</p>
                </div>
                <div className="flex items-center gap-1.5">
                    <button className="pro-btn-secondary h-7 px-3 flex items-center gap-2 italic uppercase font-black tracking-tighter"><History className="w-3.5 h-3.5" /> Outflow History</button>
                    <button className="pro-btn-primary h-7 px-4 flex items-center gap-2 bg-rose-600 border-rose-600 shadow-lg shadow-rose-600/20"><Plus className="w-3.5 h-3.5" /> Execute Outflow Requisition</button>
                </div>
            </div>

            {/* Tactical Outflow Protocol */}
            <div className="pro-card p-3 bg-slate-900 text-white relative overflow-hidden group">
                <div className="relative z-10 grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
                    <div className="space-y-1">
                        <label className="text-[8px] font-black text-white/40 uppercase tracking-widest px-1">Destination Operating Hub</label>
                        <select className="w-full h-8 bg-white/5 border border-white/10 rounded px-2 text-[10px] font-bold uppercase outline-none focus:border-rose-500 transition-all cursor-pointer">
                            <option className="text-slate-900">All Target Hubs</option>
                        </select>
                    </div>
                    <div className="space-y-1">
                        <label className="text-[8px] font-black text-white/40 uppercase tracking-widest px-1">Audit Temporal</label>
                        <input type="date" className="w-full h-8 bg-white/5 border border-white/10 rounded px-2 text-[10px] font-bold uppercase outline-none" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[8px] font-black text-white/40 uppercase tracking-widest px-1">Requisition Identity</label>
                        <input type="text" placeholder="REQ_ARTIFACT..." className="w-full h-8 bg-white/5 border border-white/10 rounded px-2 text-[10px] font-bold uppercase outline-none" />
                    </div>
                    <button className="h-8 bg-rose-600 hover:bg-rose-700 text-white text-[9px] font-black uppercase tracking-widest rounded transition-all shadow-xl shadow-rose-600/20 active:scale-95">Execute Depletion Audit</button>
                </div>
                <TrendingDown className="absolute -right-8 -bottom-8 w-40 h-40 text-white/[0.02] pointer-events-none" />
            </div>

            {/* Outflow Manifest Theater */}
            <div className="pro-card min-h-[400px] flex flex-col bg-white overflow-hidden relative">
                <div className="flex-1 overflow-x-auto">
                    <table className="pro-table">
                        <thead>
                            <tr className="bg-slate-50">
                                <th>#</th>
                                <th>Depleted Artifact</th>
                                <th>Destination Hub</th>
                                <th>Outflow Matrix</th>
                                <th>Consumption Logic</th>
                                <th>Status</th>
                                <th className="text-right">Temporal</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td colSpan="7" className="py-24 text-center">
                                    <div className="flex flex-col items-center gap-3 opacity-20">
                                        <div className="w-16 h-16 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center">
                                            <PackageMinus className="w-8 h-8 text-slate-400" />
                                        </div>
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Zero Outflow Manifests Provisioned</p>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Depletion Decoration */}
                <PackageX className="absolute -left-8 -bottom-8 w-40 h-40 text-slate-900/[0.02] pointer-events-none" />
            </div>
        </div>
    );
};

export default StockOutManager;
