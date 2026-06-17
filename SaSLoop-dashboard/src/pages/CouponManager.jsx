import React, { useState, useEffect } from "react";
import { 
  Ticket, Search, RefreshCw, Filter, 
  Download, Plus, Upload, Database, 
  Zap, Percent, Target, Layers,
  CheckCircle2, Edit3, Trash2, FileSpreadsheet, ChevronRight
} from "lucide-react";
import API_BASE from "../config";

const CouponManager = () => {
    const [loading, setLoading] = useState(false);

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center justify-between bg-white dark:bg-[#1e2129] p-3 rounded-lg border border-slate-200 dark:border-white/5 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg">
                        <Ticket className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                        <h2 className="pro-heading">Manage Coupons</h2>
                        <p className="pro-subheading">Create and manage discount codes</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button className="h-10 px-5 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-300 rounded-lg font-bold text-[10px] uppercase tracking-[0.1em] hover:bg-slate-50 dark:hover:bg-white/10 transition-all flex items-center gap-2 shadow-sm">
                        <FileSpreadsheet className="w-4 h-4 text-emerald-600" /> Format Manifest
                    </button>
                    <button className="pro-btn-primary h-10 px-5">
                        <Plus className="w-4 h-4" /> Add Coupon
                    </button>
                </div>
            </div>

            {/* Tactical Yield Board */}
            <div className="bg-white p-6 border border-slate-200 rounded-lg shadow-sm relative overflow-hidden group">
                <div className="relative z-10 grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                    <div className="space-y-1.5">
                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider px-1">Target Operating Hub</label>
                        <select className="w-full h-9 bg-slate-50 border border-slate-200 rounded-md px-3 text-[11px] font-bold uppercase outline-none focus:border-indigo-500 transition-all cursor-pointer">
                            <option>ALL OPERATING HUBS</option>
                        </select>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider px-1">Order Type Matrix</label>
                        <select className="w-full h-9 bg-slate-50 border border-slate-200 rounded-md px-3 text-[11px] font-bold uppercase outline-none focus:border-indigo-500 transition-all cursor-pointer">
                            <option>ALL ORDER TYPES</option>
                        </select>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider px-1">Calculation Protocol</label>
                        <select className="w-full h-9 bg-slate-50 border border-slate-200 rounded-md px-3 text-[11px] font-bold uppercase outline-none focus:border-indigo-500 transition-all cursor-pointer">
                            <option>ALL CALC TYPES</option>
                        </select>
                    </div>
                    <button className="h-9 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest rounded-md hover:bg-slate-800 transition-all shadow-md shadow-slate-900/10 active:scale-95 flex items-center justify-center gap-2">
                        <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Execute Yield Audit
                    </button>
                </div>
                <Zap className="absolute -right-12 -bottom-12 w-48 h-48 text-indigo-600/[0.03] pointer-events-none group-hover:rotate-12 transition-transform duration-1000" />
            </div>

            {/* Promotional Manifest Theater */}
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
                <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
                    <div className="flex items-center gap-3">
                        <button className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 rounded font-bold text-[9px] uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-1.5">
                            <Plus className="w-3 h-3 text-indigo-600" /> Provision New Artifact
                        </button>
                        <button className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 rounded font-bold text-[9px] uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-1.5">
                            <Upload className="w-3 h-3 text-indigo-600" /> Bulk Upload Matrix
                        </button>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                        <input type="text" placeholder="FILTER COUPONS..." className="w-48 h-8 bg-white border border-slate-200 rounded pl-9 pr-3 text-[10px] font-bold uppercase outline-none focus:border-indigo-500 transition-all" />
                    </div>
                </div>

                <div className="flex-1 overflow-x-auto">
                    <table className="pro-table">
                        <thead>
                            <tr>
                                <th className="text-center">#</th>
                                <th>Coupon Artifact</th>
                                <th className="text-center">Protocol</th>
                                <th className="text-center">Yield Value</th>
                                <th>Redemption Matrix</th>
                                <th className="text-center">Status</th>
                                <th className="text-right">Temporal</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            <tr>
                                <td colSpan="7" className="py-24 text-center">
                                    <div className="flex flex-col items-center gap-4 opacity-20">
                                        <div className="w-20 h-20 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center">
                                            <Ticket className="w-10 h-10 text-slate-400" />
                                        </div>
                                        <div>
                                            <p className="text-[12px] font-bold text-slate-500 uppercase tracking-widest">Yield Matrix Clean</p>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">Zero Artifacts Provisioned</p>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <Percent className="absolute -left-12 -bottom-12 w-48 h-48 text-slate-900/[0.02] pointer-events-none" />
            </div>
        </div>
    );
};

export default CouponManager;
