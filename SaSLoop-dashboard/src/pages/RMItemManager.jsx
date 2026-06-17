import React, { useState, useEffect } from "react";
import { 
  Package, Search, RefreshCw, Filter, 
  Plus, Database, Layers, CheckCircle2, 
  Trash2, Edit3, Tag, ListChecks,
  Boxes, Layout
} from "lucide-react";
import API_BASE from "../config";

const RMItemManager = () => {
    return (
        <div className="space-y-3 animate-pro-in">
            {/* Precision Material Header */}
            <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                    <h2 className="pro-heading uppercase tracking-tighter text-slate-900 italic font-black tracking-tight">Material Identity Catalog</h2>
                    <p className="pro-subheading uppercase tracking-widest text-[9px]">Raw material inventory orchestration & unit hierarchy management</p>
                </div>
                <div className="flex items-center gap-1.5">
                    <button className="pro-btn-secondary h-7 px-3 flex items-center gap-2 italic uppercase font-black tracking-tighter"><ListChecks className="w-3.5 h-3.5" /> Unit Matrix</button>
                    <button className="pro-btn-primary h-7 px-4 flex items-center gap-2 bg-slate-900 border-slate-900 shadow-lg shadow-slate-900/20"><Plus className="w-3.5 h-3.5" /> Provision Material</button>
                </div>
            </div>

            {/* Tactical Search Bar */}
            <div className="pro-card p-2 flex items-center gap-3 bg-white/50">
                <div className="flex items-center gap-2 flex-1 bg-white border border-slate-100 rounded px-2 py-1">
                    <Search className="w-3.5 h-3.5 text-slate-400" />
                    <input type="text" placeholder="Search material identities, SKU or unit tags..." className="bg-transparent text-[11px] font-bold outline-none w-full uppercase" />
                </div>
                <button className="p-1.5 hover:bg-slate-100 rounded text-slate-400"><Filter className="w-3.5 h-3.5" /></button>
            </div>

            {/* Material Manifest Theater */}
            <div className="pro-card min-h-[450px] flex flex-col bg-white overflow-hidden relative">
                <div className="flex-1 overflow-x-auto">
                    <table className="pro-table">
                        <thead>
                            <tr className="bg-slate-900 text-white/50">
                                <th className="text-white">Material Identity</th>
                                <th className="text-white">Unit Matrix</th>
                                <th className="text-white">Classification</th>
                                <th className="text-white">Reorder Node</th>
                                <th className="text-white">Status</th>
                                <th className="text-right text-white">Ops</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td colSpan="6" className="py-32 text-center">
                                    <div className="flex flex-col items-center gap-3 opacity-20">
                                        <div className="w-16 h-16 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center">
                                            <Package className="w-8 h-8 text-slate-400" />
                                        </div>
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Zero Material Artifacts Provisioned</p>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Material Decoration */}
                <Boxes className="absolute -right-8 -bottom-8 w-40 h-40 text-slate-900/[0.02] pointer-events-none" />
            </div>
        </div>
    );
};

export default RMItemManager;
