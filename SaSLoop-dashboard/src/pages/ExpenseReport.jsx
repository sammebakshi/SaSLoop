import React, { useState, useEffect } from "react";
import { 
  TrendingDown, Search, RefreshCw, Filter, 
  Plus, Database, CheckCircle2, Trash2, 
  Edit3, Tag, ListChecks, Printer,
  Download, History, IndianRupee, 
  Zap, Calendar, Clock, ShieldCheck,
  TrendingUp, Layers, Cpu, MoreVertical,
  Wallet, Upload, FileSpreadsheet,
  ArrowUpRight
} from "lucide-react";
import API_BASE from "../config";

const ExpenseReport = () => {
    return (
        <div className="space-y-3 animate-pro-in">
            {/* Precision Outflow Header */}
            <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                    <h2 className="pro-heading uppercase tracking-tighter text-slate-900 italic font-black tracking-tight">Outflow Intelligence</h2>
                    <p className="pro-subheading uppercase tracking-widest text-[9px]">Real-time expense categorization, vendor audits & outflow tracking orchestration</p>
                </div>
                <div className="flex items-center gap-1.5">
                    <button className="pro-btn-secondary h-7 px-3 flex items-center gap-2 italic uppercase font-black tracking-tighter"><Download className="w-3.5 h-3.5" /> Export Ledger</button>
                    <button className="pro-btn-primary h-7 px-4 flex items-center gap-2 bg-rose-600 border-rose-600 shadow-lg shadow-rose-600/20"><Zap className="w-3.5 h-3.5" /> Synchronize Outflows</button>
                </div>
            </div>

            {/* Tactical Outflow Protocol */}
            <div className="pro-card p-3 bg-slate-900 text-white relative overflow-hidden group">
                <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-3 items-end">

                    <div className="space-y-1">
                        <label className="text-[8px] font-black text-white/40 uppercase tracking-widest px-1">Temporal Start</label>
                        <input type="date" className="w-full h-8 bg-white/5 border border-white/10 rounded px-2 text-[10px] font-bold uppercase outline-none" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[8px] font-black text-white/40 uppercase tracking-widest px-1">Temporal End</label>
                        <input type="date" className="w-full h-8 bg-white/5 border border-white/10 rounded px-2 text-[10px] font-bold uppercase outline-none" />
                    </div>
                    <button className="h-8 bg-rose-600 hover:bg-rose-700 text-white text-[9px] font-black uppercase tracking-widest rounded transition-all shadow-xl shadow-rose-600/20 active:scale-95">Filter Fiscal Ledger</button>
                </div>
                <TrendingDown className="absolute -right-8 -bottom-8 w-40 h-40 text-white/[0.02] pointer-events-none" />
            </div>

            {/* Outflow Telemetry Rails */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Category Manifest Theater */}
                <div className="md:col-span-2 pro-card min-h-[300px] flex flex-col bg-white overflow-hidden relative">
                    <div className="p-3 border-b border-slate-100 bg-slate-50/20 flex items-center justify-between">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Layers className="w-3.5 h-3.5" /> Expense Category Manifest</h3>
                        <div className="flex items-center gap-2">
                            <button className="pro-btn-secondary h-6 px-2 text-[8px] italic uppercase font-black tracking-tighter"><Plus className="w-3 h-3" /> Add Category</button>
                            <button className="pro-btn-secondary h-6 px-2 text-[8px] italic uppercase font-black tracking-tighter"><Upload className="w-3 h-3" /> Bulk Import</button>
                        </div>
                    </div>
                    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center opacity-20">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">No Specialized Categories Provisioned</p>
                    </div>
                </div>

                {/* Fiscal Total Identity */}
                <div className="pro-card p-6 bg-rose-600 text-white flex flex-col justify-between relative overflow-hidden group">
                    <div className="relative z-10 space-y-1">
                        <p className="text-[10px] font-black text-white/50 uppercase tracking-widest">Total Realized Outflow</p>
                        <div className="flex items-baseline gap-1">
                            <span className="text-[14px] font-black text-white/60">₹</span>
                            <span className="text-4xl font-black italic tracking-tighter">0.00</span>
                        </div>
                        <p className="text-[9px] font-bold text-rose-100/60 uppercase tracking-widest mt-2">Net Realized Outflows: 0</p>
                    </div>
                    <div className="relative z-10 flex items-center gap-2 text-rose-100/40">
                        <Clock className="w-3 h-3" />
                        <span className="text-[8px] font-black uppercase tracking-widest">Temporal Period Active</span>
                    </div>
                    <Wallet className="absolute -right-4 -bottom-4 w-24 h-24 text-white/10 group-hover:scale-125 transition-transform" />
                </div>
            </div>

            {/* Detailed Tracking Matrix */}
            <div className="pro-card min-h-[250px] bg-white overflow-hidden relative">
                <div className="p-3 border-b border-slate-100 bg-slate-50/20">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><ArrowUpRight className="w-3.5 h-3.5" /> Expenses Tracking Matrix</h3>
                </div>
                <div className="p-12 text-center opacity-10 italic font-black uppercase text-[12px] tracking-widest">Scanning Fiscal Vaults...</div>
            </div>
        </div>
    );
};

export default ExpenseReport;
