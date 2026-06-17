import React, { useState, useEffect } from "react";
import { 
  Settings2, RefreshCw, ShieldCheck, Database, 
  Layers, Lock, Globe, Store, Building2,
  ChevronDown, Save, Cpu, ChevronRight
} from "lucide-react";
import API_BASE from "../config";

const CRMSettings = () => {
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-50 rounded-lg">
                        <Settings2 className="w-5 h-5 text-slate-800" />
                    </div>
                    <div>
                        <h2 className="text-[14px] font-bold text-slate-800 uppercase tracking-tight">CRM Control Center</h2>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Customer engagement levels & management hierarchy protocols</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button className="px-4 py-2 bg-slate-900 text-white rounded-md font-bold text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center gap-2 shadow-md shadow-slate-900/10">
                        <Save className="w-3.5 h-3.5" /> Commit Architecture
                    </button>
                </div>
            </div>

            {/* Architectural Matrix Theater */}
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[500px] relative">
                <div className="flex-1 flex flex-col items-center justify-center p-12 relative z-10">
                    <div className="w-20 h-20 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-xl shadow-indigo-100/30 mb-8 animate-in zoom-in duration-500">
                        <Cpu className="w-10 h-10" />
                    </div>
                    
                    <div className="max-w-md w-full space-y-8">
                        <div className="text-center space-y-1">
                            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Operational Management Tier</h3>
                            <p className="text-[20px] font-bold text-slate-900 uppercase tracking-tight">Identity Isolation Policy</p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest px-1">Market Level Architecture</label>
                            <div className="relative group">
                                <select className="w-full h-12 px-5 bg-slate-900 text-white border-none rounded-lg text-[13px] font-bold uppercase tracking-wider appearance-none outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all cursor-pointer">
                                    <option>Isolated Outlet Mode</option>
                                    <option>Unified Brand Matrix</option>
                                    <option>Global Multi-Tenant</option>
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none group-hover:text-white transition-colors" />
                            </div>
                            <div className="flex items-start gap-2 mt-3 px-1">
                                <ShieldCheck className="w-3.5 h-3.5 text-indigo-500 mt-0.5" />
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide leading-relaxed">This setting dictates how customer data is isolated and shared across your operating network hierarchy.</p>
                            </div>
                        </div>

                        <div className="pt-4">
                            <button className="w-full h-12 bg-indigo-600 text-white rounded-lg font-bold text-[11px] uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 active:scale-[0.98]">
                                <RefreshCw className="w-4 h-4" /> Synchronize CRM Protocols
                            </button>
                        </div>
                    </div>
                </div>

                {/* Decorative Visuals */}
                <div className="absolute top-8 left-8 flex flex-col gap-6 opacity-10">
                    <Globe className="w-6 h-6 text-slate-900" />
                    <Building2 className="w-6 h-6 text-slate-900" />
                    <Store className="w-6 h-6 text-slate-900" />
                </div>
                <Layers className="absolute -right-16 -bottom-16 w-64 h-64 text-slate-900/[0.02] -rotate-12 pointer-events-none" />
                <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-50 to-transparent pointer-events-none" />
            </div>
        </div>
    );
};

export default CRMSettings;
