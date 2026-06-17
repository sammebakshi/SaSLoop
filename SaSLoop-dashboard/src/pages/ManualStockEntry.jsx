import React, { useState, useEffect } from "react";
import { 
  ClipboardList, Search, RefreshCw, Filter, 
  Plus, Database, CheckCircle2, Trash2, 
  Edit3, Tag, ListChecks, Printer,
  Download, FileSpreadsheet, Box, History,
  IndianRupee, PackageCheck, Archive, ChevronRight
} from "lucide-react";
import API_BASE from "../config";

const ManualStockEntry = () => {
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-50 rounded-lg">
                        <ClipboardList className="w-5 h-5 text-slate-800" />
                    </div>
                    <div>
                        <h2 className="text-[14px] font-bold text-slate-800 uppercase tracking-tight">Stock Entry</h2>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Purchase order artifacts & material liquidity states</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button className="px-4 py-2 bg-slate-50 border border-slate-200 text-slate-600 rounded-md font-bold text-[10px] uppercase tracking-widest hover:bg-slate-100 transition-all flex items-center gap-2">
                        <Printer className="w-3.5 h-3.5" /> Print Matrix
                    </button>
                    <button className="px-4 py-2 bg-slate-900 text-white rounded-md font-bold text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center gap-2 shadow-md shadow-slate-900/10">
                        <Plus className="w-3.5 h-3.5" /> Add Manual Stock Entry
                    </button>
                </div>
            </div>

            {/* Tactical Entry Protocol */}
            <div className="bg-white p-6 border border-slate-200 rounded-lg shadow-sm relative overflow-hidden group">
                <div className="relative z-10 grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                    <div className="space-y-1.5">
                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider px-1">Target Hub</label>
                        <select className="w-full h-9 bg-slate-50 border border-slate-200 rounded-md px-3 text-[11px] font-bold uppercase outline-none focus:border-slate-500 transition-all cursor-pointer">
                            <option>All Operating Hubs</option>
                        </select>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider px-1">Temporal Date</label>
                        <input type="date" className="h-9 w-full bg-slate-50 border border-slate-200 rounded-md px-3 text-[10px] font-bold uppercase outline-none focus:border-slate-500 transition-all" />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider px-1">Vendor Matrix</label>
                        <select className="w-full h-9 bg-slate-50 border border-slate-200 rounded-md px-3 text-[11px] font-bold uppercase outline-none focus:border-slate-500 transition-all cursor-pointer">
                            <option>All Vendors</option>
                        </select>
                    </div>
                    <button className="h-9 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest rounded-md hover:bg-slate-800 transition-all shadow-md shadow-slate-900/10 active:scale-95">
                        Execute Operational Audit
                    </button>
                </div>
                <div className="mt-4 flex items-center gap-6 text-[9px] font-bold text-slate-400 uppercase tracking-widest px-1 border-t border-slate-100 pt-4">
                    <button className="flex items-center gap-1.5 hover:text-slate-900 transition-colors">
                        <Download className="w-3 h-3" /> Export Vault
                    </button>
                    <button className="flex items-center gap-1.5 hover:text-slate-900 transition-colors">
                        <FileSpreadsheet className="w-3 h-3" /> Download Format
                    </button>
                </div>
                <Archive className="absolute -right-12 -bottom-12 w-48 h-48 text-slate-900/[0.03] pointer-events-none group-hover:rotate-12 transition-transform duration-1000" />
            </div>

            {/* Entry Manifest Theater */}
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
                <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
                    <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-900" /> Manual Stock List Manifest
                    </h3>
                    <RefreshCw className="w-4 h-4 text-slate-200" />
                </div>

                <div className="flex-1 overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">#</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Purchase Order</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Identity Matrix</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">RM Count</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Fiscal Yield</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Location Node</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center">Status</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            <tr>
                                <td colSpan="8" className="py-24 text-center">
                                    <div className="flex flex-col items-center gap-4 opacity-20">
                                        <div className="w-20 h-20 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center">
                                            <ClipboardList className="w-10 h-10 text-slate-400" />
                                        </div>
                                        <div>
                                            <p className="text-[12px] font-bold text-slate-500 uppercase tracking-widest">Manual Stock List Manifest Clean</p>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">Zero Entry Artifacts Tracked</p>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ManualStockEntry;
