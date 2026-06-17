import React, { useState, useEffect } from "react";
import { 
  Truck, Search, RefreshCw, Filter, 
  Layers, Plus, ExternalLink, Database,
  Smartphone, Monitor, CheckCircle2, ShieldCheck, ChevronRight
} from "lucide-react";
import API_BASE from "../config";

const DeliveryPlatformManager = () => {
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-50 rounded-lg">
                        <Truck className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                        <h2 className="text-[14px] font-bold text-slate-800 uppercase tracking-tight">Platform Dispatch Hub</h2>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Multi-channel delivery & menu synchronization</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-md px-4 py-2 group focus-within:border-indigo-300 transition-all">
                        <Search className="w-4 h-4 text-slate-400" />
                        <input type="text" placeholder="Search global outlets..." className="bg-transparent text-[11px] font-bold text-slate-700 uppercase outline-none w-48 placeholder:text-slate-300" />
                    </div>
                    <button className="px-4 py-2 bg-indigo-600 text-white rounded-md font-bold text-[10px] uppercase tracking-widest hover:bg-indigo-500 transition-all flex items-center gap-2 shadow-md shadow-indigo-600/10">
                        <Plus className="w-3.5 h-3.5" /> Provision New Platform
                    </button>
                </div>
            </div>

            {/* Sync Matrix Theater */}
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[500px] relative">
                <div className="flex-1 overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Platform Identity</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Store Mapping</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Sync Protocol</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Published At</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Ops</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            <tr>
                                <td colSpan="5" className="py-24 text-center">
                                    <div className="flex flex-col items-center gap-4 opacity-20">
                                        <div className="w-20 h-20 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center">
                                            <Truck className="w-10 h-10 text-slate-400" />
                                        </div>
                                        <div>
                                            <p className="text-[12px] font-bold text-slate-500 uppercase tracking-widest">Dispatch Matrix Clean</p>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">No External Integrations Found</p>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Integration Decoration */}
                <Database className="absolute -right-12 -bottom-12 w-48 h-48 text-slate-900/[0.02] pointer-events-none group-hover:scale-110 transition-transform duration-1000" />
            </div>
        </div>
    );
};

export default DeliveryPlatformManager;
