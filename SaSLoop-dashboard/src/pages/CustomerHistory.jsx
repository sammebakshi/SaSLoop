import React, { useState, useEffect } from "react";
import { 
  Activity, Search, RefreshCw, Filter, 
  Download, Calendar, IndianRupee, TrendingUp, 
  PieChart, ChevronDown, ListChecks, Database,
  UserCheck, History, Clock, Target, ChevronRight
} from "lucide-react";
import API_BASE from "../config";

const CustomerHistory = () => {
    const [loading, setLoading] = useState(false);

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-50 rounded-lg">
                        <History className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                        <h2 className="text-[14px] font-bold text-slate-800 uppercase tracking-tight">Engagement Audit</h2>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Lifetime value, visit frequency & engagement temporal artifacts</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button className="px-4 py-2 bg-slate-900 text-white rounded-md font-bold text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center gap-2 shadow-md shadow-slate-900/10">
                        <Download className="w-3.5 h-3.5" /> Download History Vault
                    </button>
                </div>
            </div>

            {/* Tactical Audit Board */}
            <div className="bg-white p-6 border border-slate-200 rounded-lg shadow-sm relative overflow-hidden group">
                <div className="relative z-10 grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                    <div className="space-y-1.5 md:col-span-3">
                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider px-1">Target Operating Hub</label>
                        <select className="w-full h-9 bg-slate-50 border border-slate-200 rounded-md px-3 text-[11px] font-bold uppercase outline-none focus:border-indigo-500 transition-all cursor-pointer">
                            <option>ALL OPERATING HUBS</option>
                        </select>
                    </div>
                    <button className="h-9 bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-md hover:bg-indigo-500 transition-all shadow-md shadow-indigo-600/10 active:scale-95 flex items-center justify-center gap-2">
                        <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Execute Engagement Audit
                    </button>
                </div>
                <Target className="absolute -right-12 -bottom-12 w-48 h-48 text-indigo-600/[0.03] pointer-events-none group-hover:rotate-12 transition-transform duration-1000" />
            </div>

            {/* Engagement Manifest Theater */}
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
                <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
                    <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" /> Customer Engagement Manifest
                    </h3>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                        <input type="text" placeholder="FILTER MANIFEST..." className="w-48 h-8 bg-white border border-slate-200 rounded pl-9 pr-3 text-[10px] font-bold uppercase outline-none focus:border-indigo-500 transition-all" />
                    </div>
                </div>

                <div className="flex-1 overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Action Identity</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Operating Hub</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center">Total Visits</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center">Lifetime Revenue</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Last Interaction</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Artifact Temporal</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            <tr>
                                <td colSpan="6" className="py-24 text-center">
                                    <div className="flex flex-col items-center gap-4 opacity-20">
                                        <div className="w-20 h-20 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center">
                                            <Activity className="w-10 h-10 text-slate-400" />
                                        </div>
                                        <div>
                                            <p className="text-[12px] font-bold text-slate-500 uppercase tracking-widest">Engagement Matrix Clean</p>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">Zero Artifacts Provisioned</p>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <Clock className="absolute -left-12 -bottom-12 w-48 h-48 text-slate-900/[0.02] pointer-events-none" />
            </div>
        </div>
    );
};

export default CustomerHistory;
