import React, { useState, useEffect } from "react";
import { 
  Building2, Search, RefreshCw, Filter, 
  Plus, ShieldCheck, Database, Users,
  Globe, Truck, MoreVertical, Edit3, Trash2,
  FileText, Star, Clock, UserPlus, ChevronRight
} from "lucide-react";
import API_BASE from "../config";

const VendorManager = () => {
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-50 rounded-lg">
                        <Building2 className="w-5 h-5 text-slate-800" />
                    </div>
                    <div>
                        <h2 className="text-[14px] font-bold text-slate-800 uppercase tracking-tight">Vendor Intelligence Matrix</h2>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Partner identities, procurement protocols & fulfillment compliance artifacts</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button className="px-4 py-2 bg-slate-50 border border-slate-200 text-slate-600 rounded-md font-bold text-[10px] uppercase tracking-widest hover:bg-slate-100 transition-all flex items-center gap-2">
                        <FileText className="w-3.5 h-3.5" /> Compliance Docs
                    </button>
                    <button className="px-4 py-2 bg-slate-900 text-white rounded-md font-bold text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center gap-2 shadow-md shadow-slate-900/10">
                        <UserPlus className="w-3.5 h-3.5" /> Provision Partner Node
                    </button>
                </div>
            </div>

            {/* Tactical Control Bar */}
            <div className="bg-white p-4 border border-slate-200 rounded-lg shadow-sm flex items-center gap-4 relative overflow-hidden group">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                        type="text" 
                        placeholder="SEARCH PARTNER IDENTITIES, GSTIN OR CONTRACT TAGS..." 
                        className="w-full h-10 bg-slate-50 border border-slate-200 rounded-md pl-10 pr-4 text-[11px] font-bold uppercase outline-none focus:border-slate-500 transition-all" 
                    />
                </div>
                <button className="h-10 w-10 flex items-center justify-center bg-slate-50 border border-slate-200 text-slate-400 rounded-md hover:bg-slate-100 transition-all">
                    <Filter className="w-4 h-4" />
                </button>
                <Truck className="absolute -right-12 -bottom-12 w-48 h-48 text-slate-900/[0.03] pointer-events-none group-hover:rotate-12 transition-transform duration-1000" />
            </div>

            {/* Vendor Manifest Theater */}
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
                <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
                    <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-900" /> Partner Fulfillment Manifest
                    </h3>
                    <RefreshCw className="w-4 h-4 text-slate-200" />
                </div>

                <div className="flex-1 overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Partner Identity</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Procurement Temporal</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Compliance Artifact</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Rating</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center">Status</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            <tr>
                                <td colSpan="6" className="py-24 text-center">
                                    <div className="flex flex-col items-center gap-4 opacity-20">
                                        <div className="w-20 h-20 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center">
                                            <Building2 className="w-10 h-10 text-slate-400" />
                                        </div>
                                        <div>
                                            <p className="text-[12px] font-bold text-slate-500 uppercase tracking-widest">Partner Matrix Clean</p>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">Zero Artifacts Provisioned</p>
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

export default VendorManager;
