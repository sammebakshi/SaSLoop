import React, { useState, useEffect } from "react";
import { 
  Grid, Map, Layout, Trash2, Search, 
  RefreshCw, Filter, Edit3, Settings2,
  Maximize2, MousePointer2, Layers, Plus,
  ChevronRight, MoreVertical
} from "lucide-react";
import API_BASE from "../config";

const TableManagement = () => {
    return (
        <div className="h-full flex flex-col space-y-4 animate-in fade-in duration-500">
            {/* Precision Floor Header */}
            <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-50 rounded-lg">
                        <Map className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                        <h2 className="text-[14px] font-bold text-slate-800 uppercase tracking-tight">Floor Plan Console</h2>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Spatial Orchestration</p>
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Available: 0</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                            <span className="text-[9px] font-bold text-indigo-500 uppercase tracking-widest">Occupied: 0</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest">Billed: 0</span>
                        </div>
                    </div>
                    <button className="h-9 px-4 flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white rounded-md font-bold text-[10px] uppercase tracking-widest transition-all">
                        <Layers className="w-3.5 h-3.5" /> Rearrange Floor
                    </button>
                </div>
            </div>

            {/* Spatial Canvas Theater */}
            <div className="flex-1 bg-white border-2 border-dashed border-slate-100 rounded-xl flex items-center justify-center relative overflow-hidden group">
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
                
                <div className="flex flex-col items-center justify-center space-y-4 opacity-40 group-hover:opacity-100 transition-opacity">
                    <div className="w-16 h-16 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center shadow-sm">
                        <MousePointer2 className="w-6 h-6 text-slate-300" />
                    </div>
                    <div className="text-center">
                        <p className="text-[11px] font-bold text-slate-800 uppercase tracking-[0.2em]">Canvas Empty</p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-1">Use the Configuration Hub to Provision Tables</p>
                    </div>
                </div>

                {/* Tactical HUD */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-white p-1 rounded-lg shadow-2xl border border-slate-200">
                    <button className="p-2.5 hover:bg-slate-50 rounded-md text-slate-400 transition-all"><Plus className="w-4 h-4" /></button>
                    <div className="w-px h-5 bg-slate-200 mx-1" />
                    <button className="p-2.5 hover:bg-slate-50 rounded-md text-slate-400 transition-all"><RefreshCw className="w-4 h-4" /></button>
                    <div className="w-px h-5 bg-slate-200 mx-1" />
                    <button className="p-2.5 hover:bg-slate-50 rounded-md text-slate-400 transition-all"><Maximize2 className="w-4 h-4" /></button>
                </div>
            </div>
        </div>
    );
};

export default TableManagement;
