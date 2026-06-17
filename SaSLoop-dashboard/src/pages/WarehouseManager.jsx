import React, { useState, useEffect } from "react";
import { 
  Warehouse, Search, RefreshCw, Filter, 
  Plus, ShieldCheck, Database, Layers,
  Globe, MapPin, MoreVertical, Edit3, Trash2,
  Package, Box, CheckCircle2, XCircle, ChevronRight, X
} from "lucide-react";
import API_BASE from "../config";

const WarehouseManager = () => {
    return (
        <div className="space-y-6">
            {/* Precision Warehouse Header */}
            <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-50 rounded-lg">
                        <Warehouse className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                        <h2 className="text-[14px] font-bold text-slate-800 uppercase">Location Matrix</h2>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Sub-Warehouse Hierarchies</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative group">
                       <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                       <input type="text" placeholder="Search locations..." className="pl-8 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-[11px] w-48 focus:w-64 outline-none transition-all uppercase font-bold text-slate-600" />
                    </div>
                    <button className="h-9 px-4 flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white rounded-md font-bold text-[10px] uppercase tracking-widest shadow-sm transition-all">
                        <Plus className="w-3.5 h-3.5" /> Provision New Node
                    </button>
                </div>
            </div>

            {/* Tactical Status Telemetry */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex items-center justify-between group">
                    <div className="space-y-1">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Nodes</p>
                        <p className="text-[20px] font-bold text-slate-800 tracking-tighter uppercase">01</p>
                    </div>
                    <div className="w-10 h-10 rounded bg-emerald-50 flex items-center justify-center text-emerald-500">
                        <CheckCircle2 className="w-5 h-5" />
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex items-center justify-between group opacity-50">
                    <div className="space-y-1">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Offline Nodes</p>
                        <p className="text-[20px] font-bold text-slate-800 tracking-tighter uppercase">00</p>
                    </div>
                    <div className="w-10 h-10 rounded bg-slate-100 flex items-center justify-center text-slate-400">
                        <XCircle className="w-5 h-5" />
                    </div>
                </div>
                <div className="md:col-span-2 bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex items-center justify-end gap-3">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md">
                        <input type="checkbox" id="show-deactivated" className="w-3 h-3 accent-slate-900 cursor-pointer" />
                        <label htmlFor="show-deactivated" className="text-[10px] font-bold text-slate-500 uppercase tracking-widest cursor-pointer">Show Deactivated Artifacts</label>
                    </div>
                </div>
            </div>

            {/* Warehouse Manifest Theater */}
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[400px]">
                <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/30 flex items-center justify-between">
                    <h3 className="text-[12px] font-bold text-slate-800 uppercase tracking-tight flex items-center gap-2">
                        <Database className="w-4 h-4 text-indigo-500" /> Warehouse List Manifest
                    </h3>
                </div>

                <div className="flex-1 overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">#</th>
                                <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Identity Matrix</th>
                                <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Contact Temporal</th>
                                <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Compliance</th>
                                <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Hierarchy</th>
                                <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td colSpan="7" className="py-32 text-center">
                                    <div className="flex flex-col items-center gap-3 opacity-20">
                                        <div className="w-16 h-16 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center">
                                            <Box className="w-8 h-8 text-slate-400" />
                                        </div>
                                        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Zero Location Artifacts Provisioned</p>
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

export default WarehouseManager;
