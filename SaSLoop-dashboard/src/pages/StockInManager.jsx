import React, { useState, useEffect } from "react";
import { 
  ArrowDownCircle, Search, RefreshCw, Filter, 
  Plus, Database, CheckCircle2, Trash2, 
  Edit3, Tag, ListChecks, FileText,
  PackagePlus, Truck, Calendar, History,
  IndianRupee, PackageCheck
} from "lucide-react";
import API_BASE from "../config";

const StockInManager = () => {
    return (
        <div className="space-y-3 animate-pro-in">
            {/* Precision Ingestion Header */}
            <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                    <h2 className="pro-heading uppercase tracking-tighter text-slate-900 italic font-black">Stock Ingestion Orchestrator</h2>
                    <p className="pro-subheading uppercase tracking-widest text-[9px]">Material flow orchestration, procurement ingestion & audit temporal artifacts</p>
                </div>
                <div className="flex items-center gap-1.5">
                    <button className="pro-btn-secondary h-7 px-3 flex items-center gap-2 italic uppercase font-black tracking-tighter"><History className="w-3.5 h-3.5" /> Recent Audits</button>
                    <button className="pro-btn-primary h-7 px-4 flex items-center gap-2 bg-slate-900 border-slate-900 shadow-lg shadow-slate-900/20"><Plus className="w-3.5 h-3.5" /> Ingest Manifest</button>
                </div>
            </div>

            {/* Tactical Ingestion Protocol */}
            <div className="pro-card p-3 bg-slate-900 text-white relative overflow-hidden group">
                <div className="relative z-10 grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
                    <div className="space-y-1">
                        <label className="text-[8px] font-black text-white/40 uppercase tracking-widest px-1">Source Partner</label>
                        <select className="w-full h-8 bg-white/5 border border-white/10 rounded px-2 text-[10px] font-bold uppercase outline-none focus:border-indigo-500 transition-all cursor-pointer">
                            <option className="text-slate-900">All Source Partners</option>
                        </select>
                    </div>
                    <div className="space-y-1">
                        <label className="text-[8px] font-black text-white/40 uppercase tracking-widest px-1">Ingestion Date</label>
                        <input type="date" className="w-full h-8 bg-white/5 border border-white/10 rounded px-2 text-[10px] font-bold uppercase outline-none" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[8px] font-black text-white/40 uppercase tracking-widest px-1">GRN / Invoice</label>
                        <input type="text" placeholder="REF_IDENTITY..." className="w-full h-8 bg-white/5 border border-white/10 rounded px-2 text-[10px] font-bold uppercase outline-none" />
                    </div>
                    <button className="h-8 bg-indigo-600 hover:bg-indigo-700 text-white text-[9px] font-black uppercase tracking-widest rounded transition-all shadow-xl shadow-indigo-600/20 active:scale-95">Execute Ingestion Audit</button>
                </div>
                <Truck className="absolute -right-8 -bottom-8 w-40 h-40 text-white/[0.02] pointer-events-none" />
            </div>

            {/* Ingestion Manifest Theater */}
            <div className="pro-card min-h-[400px] flex flex-col bg-white overflow-hidden relative">
                <div className="flex-1 overflow-x-auto">
                    <table className="pro-table">
                        <thead>
                            <tr className="bg-slate-50">
                                <th>#</th>
                                <th>Material Artifact</th>
                                <th>Partner Hub</th>
                                <th>Quantity Matrix</th>
                                <th>Valuation</th>
                                <th>Audit Status</th>
                                <th className="text-right">Temporal</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td colSpan="7" className="py-24 text-center">
                                    <div className="flex flex-col items-center gap-3 opacity-20">
                                        <div className="w-16 h-16 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center">
                                            <PackagePlus className="w-8 h-8 text-slate-400" />
                                        </div>
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Zero Ingestion Manifests Provisioned</p>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Audit Decoration */}
                <PackageCheck className="absolute -left-8 -bottom-8 w-40 h-40 text-slate-900/[0.02] pointer-events-none" />
            </div>
        </div>
    );
};

export default StockInManager;
