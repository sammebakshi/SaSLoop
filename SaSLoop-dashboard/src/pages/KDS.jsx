import React, { useState, useEffect } from "react";
import { 
  ChefHat, Clock, CheckCircle2, AlertCircle, 
  RefreshCw, Play, CheckCircle, Volume2, 
  Monitor, LayoutGrid, Timer, Flame, Bell,
  ChevronRight, MoreVertical
} from "lucide-react";
import API_BASE from "../config";

const KDS = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    return (
        <div className="h-full flex flex-col space-y-4 animate-in fade-in duration-500">
            {/* KDS Precision Header */}
            <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-50 rounded-lg">
                        <ChefHat className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                        <h2 className="text-[14px] font-bold text-slate-800 uppercase tracking-tight">Kitchen Display System</h2>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Operational Matrix Active
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-md border border-slate-200 text-[10px] font-bold uppercase tracking-widest transition-all">
                        <Volume2 className="w-3.5 h-3.5 text-slate-400" /> Enable Voice
                    </button>
                    <button className="flex items-center gap-2 px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md shadow-md shadow-indigo-600/10 text-[10px] font-bold uppercase tracking-widest transition-all">
                        Live Board
                    </button>
                </div>
            </div>

            {/* KDS Matrix Columns */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 min-h-0">
                {/* Column 1: New Intake */}
                <div className="flex flex-col bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                    <div className="px-4 py-3 bg-rose-50/50 border-b border-rose-100 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                            <h3 className="text-[11px] font-bold text-rose-600 uppercase tracking-widest">New Tickets</h3>
                        </div>
                        <span className="px-2 py-0.5 bg-rose-600 text-white text-[9px] font-black rounded uppercase tracking-tighter">0 Units</span>
                    </div>
                    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-50/20">
                        <div className="w-16 h-16 rounded-full border-2 border-dashed border-slate-200 flex items-center justify-center mb-4">
                            <Flame className="w-8 h-8 text-slate-200" />
                        </div>
                        <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em]">Queue Vacant</p>
                    </div>
                </div>

                {/* Column 2: Active Production */}
                <div className="flex flex-col bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                    <div className="px-4 py-3 bg-amber-50/50 border-b border-amber-100 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                            <h3 className="text-[11px] font-bold text-amber-600 uppercase tracking-widest">Cooking Now</h3>
                        </div>
                        <span className="px-2 py-0.5 bg-amber-600 text-white text-[9px] font-black rounded uppercase tracking-tighter">0 Units</span>
                    </div>
                    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-50/20">
                        <div className="w-16 h-16 rounded-full border-2 border-dashed border-slate-200 flex items-center justify-center mb-4">
                            <Timer className="w-8 h-8 text-slate-200" />
                        </div>
                        <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em]">Fire Vacant</p>
                    </div>
                </div>

                {/* Column 3: Ready Protocol */}
                <div className="flex flex-col bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                    <div className="px-4 py-3 bg-emerald-50/50 border-b border-emerald-100 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500" />
                            <h3 className="text-[11px] font-bold text-emerald-600 uppercase tracking-widest">Ready for Pickup</h3>
                        </div>
                        <span className="px-2 py-0.5 bg-emerald-600 text-white text-[9px] font-black rounded uppercase tracking-tighter">0 Units</span>
                    </div>
                    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-50/20">
                        <div className="w-16 h-16 rounded-full border-2 border-dashed border-slate-200 flex items-center justify-center mb-4">
                            <CheckCircle2 className="w-8 h-8 text-slate-200" />
                        </div>
                        <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em]">Ready Empty</p>
                    </div>
                </div>
            </div>

            {/* Footer Telemetry */}
            <div className="bg-white px-5 py-3 rounded-lg border border-slate-200 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Average Prep:</span>
                        <span className="text-[10px] font-black text-slate-700 tracking-tight">12:45 MINS</span>
                    </div>
                    <div className="w-px h-4 bg-slate-200" />
                    <div className="flex items-center gap-2">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Station:</span>
                        <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest">Optimal Performance</span>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold text-slate-400 tabular-nums">{new Date().toLocaleTimeString()}</span>
                    <div className="p-1.5 bg-slate-50 rounded border border-slate-200 text-slate-400">
                        <RefreshCw className="w-3 h-3" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default KDS;
