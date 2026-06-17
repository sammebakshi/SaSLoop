import React, { useState, useEffect } from "react";
import { 
  FileText, Search, RefreshCw, Filter, 
  Plus, Database, CheckCircle2, Trash2, 
  Edit3, Tag, ListChecks, Printer,
  Download, History, IndianRupee, 
  Zap, Calendar, Clock, ShieldCheck,
  TrendingUp, Layers, Cpu, MoreVertical, ChevronRight
} from "lucide-react";
import API_BASE from "../config";

const TodaysReport = () => {
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-rose-50 rounded-lg">
                        <Zap className="w-5 h-5 text-rose-600" />
                    </div>
                    <div>
                        <h2 className="text-[14px] font-bold text-slate-800 uppercase tracking-tight">Real-Time Settlement (Z)</h2>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">End-of-day operational closure & reconciliation</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button className="px-4 py-2 bg-white border border-slate-200 rounded-md text-[10px] font-bold text-slate-600 uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2">
                        <RefreshCw className="w-3.5 h-3.5" /> Reset Audit
                    </button>
                    <button className="px-4 py-2 bg-rose-600 text-white rounded-md font-bold text-[10px] uppercase tracking-widest hover:bg-rose-500 transition-all flex items-center gap-2 shadow-md shadow-rose-600/10">
                        <Zap className="w-3.5 h-3.5" /> Generate Manifest
                    </button>
                </div>
            </div>

            {/* Tactical Settlement Protocol */}
            <div className="bg-white p-6 border border-slate-200 rounded-lg shadow-sm relative overflow-hidden group">
                <div className="relative z-10 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">

                        <div className="space-y-1.5">
                            <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider px-1">Temporal Start</label>
                            <input type="date" className="w-full h-9 bg-slate-50 border border-slate-200 rounded-md px-3 text-[10px] font-bold uppercase outline-none focus:border-rose-500 transition-all" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider px-1">Temporal End</label>
                            <input type="date" className="w-full h-9 bg-slate-50 border border-slate-200 rounded-md px-3 text-[10px] font-bold uppercase outline-none focus:border-rose-500 transition-all" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider px-1">Channel Protocol</label>
                            <select className="w-full h-9 bg-slate-50 border border-slate-200 rounded-md px-3 text-[11px] font-bold uppercase outline-none focus:border-rose-500 transition-all cursor-pointer">
                                <option>All Order Types</option>
                            </select>
                        </div>
                    </div>

                    {/* Settlement Parameters Matrix */}
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 pt-6 border-t border-slate-100">
                        {[
                            { label: 'Sales Summary', active: true },
                            { label: 'Order Type', active: true },
                            { label: 'Payment Type', active: true },
                            { label: 'Discount Audit', active: false },
                            { label: 'Expense Audit', active: true },
                            { label: 'Bill Manifest', active: true },
                            { label: 'Delivery Boy', active: false },
                            { label: 'Waiter Audit', active: false },
                            { label: 'Product Group', active: true },
                            { label: 'KDS Department', active: false },
                            { label: 'Category Matrix', active: true },
                            { label: 'Sold Artifacts', active: true }
                        ].map((p, i) => (
                            <div key={i} className="flex items-center justify-between group cursor-pointer transition-all">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 group-hover:text-slate-900 transition-colors">{p.label}</span>
                                <div className={`w-8 h-4 rounded-full relative transition-all shadow-inner ${p.active ? 'bg-emerald-500' : 'bg-slate-200'}`}>
                                    <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all shadow-sm ${p.active ? 'left-4.5' : 'left-0.5'}`} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="absolute top-4 right-4 flex items-center gap-2">
                    <div className="flex items-center gap-2 px-3 py-1 bg-rose-50 text-rose-600 rounded-full border border-rose-100">
                        <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse shadow-sm shadow-rose-500/50" />
                        <span className="text-[9px] font-bold uppercase tracking-widest">Z-Audit Mode Active</span>
                    </div>
                </div>
                <Cpu className="absolute -right-12 -bottom-12 w-48 h-48 text-rose-600/[0.03] pointer-events-none group-hover:rotate-12 transition-transform duration-1000" />
            </div>

            {/* Settlement Manifest Theater */}
            <div className="bg-white rounded-lg border-2 border-dashed border-slate-200 min-h-[400px] flex flex-col items-center justify-center p-12 text-center overflow-hidden relative">
                <div className="w-20 h-20 rounded-full bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center mb-6">
                    <ShieldCheck className="w-10 h-10 text-slate-200" />
                </div>
                <h3 className="text-[13px] font-bold text-slate-800 uppercase tracking-tight">Pending Settlement Manifest Generation</h3>
                <p className="text-[11px] font-bold text-slate-400 uppercase mt-2 tracking-widest max-w-[350px] opacity-60">Generate the Z-Audit manifest to finalize end-of-day financial reconciliation</p>
                
                <History className="absolute -left-12 -bottom-12 w-48 h-48 text-slate-900/[0.02] pointer-events-none" />
            </div>
        </div>
    );
};

export default TodaysReport;
