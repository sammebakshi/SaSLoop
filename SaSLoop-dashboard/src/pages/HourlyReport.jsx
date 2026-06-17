import React, { useState, useEffect } from "react";
import { 
  Clock, Search, RefreshCw, Filter, 
  Download, Calendar, IndianRupee, TrendingUp, 
  PieChart, ChevronDown, ListChecks, Database,
  Activity, BarChart, ChevronRight
} from "lucide-react";
import API_BASE from "../config";

const HourlyReport = () => {
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-50 rounded-lg">
                        <Clock className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                        <h2 className="text-[14px] font-bold text-slate-800 uppercase tracking-tight">Temporal Sales Manifest</h2>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Hourly throughput & peak performance analytics</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button className="px-4 py-2 bg-indigo-600 text-white rounded-md font-bold text-[10px] uppercase tracking-widest hover:bg-indigo-500 transition-all flex items-center gap-2 shadow-md shadow-indigo-600/10">
                        <Download className="w-3.5 h-3.5" /> Export Manifest
                    </button>
                </div>
            </div>

            {/* Tactical Temporal Protocol */}
            <div className="bg-white p-6 border border-slate-200 rounded-lg shadow-sm relative overflow-hidden group">
                <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 items-end">

                    <div className="space-y-1.5">
                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider px-1">Audit Date</label>
                        <input type="date" className="w-full h-9 bg-slate-50 border border-slate-200 rounded-md px-3 text-[10px] font-bold uppercase outline-none focus:border-indigo-500 transition-all" />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider px-1">Channel Logic</label>
                        <select className="w-full h-9 bg-slate-50 border border-slate-200 rounded-md px-3 text-[11px] font-bold uppercase outline-none focus:border-indigo-500 transition-all">
                            <option>All Channels</option>
                        </select>
                    </div>
                    <button className="h-9 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest rounded-md hover:bg-slate-800 transition-all shadow-md shadow-slate-900/10 active:scale-95">Apply Intelligence</button>
                </div>
                <Activity className="absolute -right-12 -bottom-12 w-48 h-48 text-slate-900/[0.03] pointer-events-none group-hover:rotate-12 transition-transform duration-1000" />
            </div>

            {/* Temporal Matrix Theater */}
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
                <div className="flex-1 overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Hour Window</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Order Count</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Gross Revenue</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Avg Prep Time</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Throughput Logic</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            <tr>
                                <td colSpan="5" className="py-32 text-center">
                                    <div className="flex flex-col items-center gap-4 opacity-20">
                                        <div className="w-20 h-20 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center">
                                            <BarChart className="w-10 h-10 text-slate-400" />
                                        </div>
                                        <div>
                                            <p className="text-[12px] font-bold text-slate-500 uppercase tracking-widest">Temporal Matrix Clean</p>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">No Throughput Provisioned</p>
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

export default HourlyReport;
