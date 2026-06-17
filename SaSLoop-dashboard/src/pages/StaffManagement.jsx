import React, { useState, useEffect } from "react";
import { 
  Users, Search, RefreshCw, Filter, 
  Plus, ShieldCheck, Database, Key,
  Globe, UserPlus, MoreVertical, Edit3, Trash2,
  Lock, Shield, Fingerprint, Activity, UserCircle, ChevronRight
} from "lucide-react";
import API_BASE from "../config";

const StaffManagement = () => {
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-50 rounded-lg">
                        <Users className="w-5 h-5 text-slate-800" />
                    </div>
                    <div>
                        <h2 className="text-[14px] font-bold text-slate-800 uppercase tracking-tight">Team & Staff Matrix</h2>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Sub-accounts, permission artifacts & operational access nodes orchestration</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button className="px-4 py-2 bg-slate-900 text-white rounded-md font-bold text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center gap-2 shadow-md shadow-slate-900/10">
                        <UserPlus className="w-3.5 h-3.5" /> Create Staff Account
                    </button>
                </div>
            </div>

            {/* Tactical Staff Matrix Theater */}
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[500px] relative">
                <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/30 flex items-center justify-between">
                    <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                        <Lock className="w-4 h-4 text-slate-400" /> Identity & RBAC Manifest
                    </h3>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-md shadow-sm">
                        <Search className="w-4 h-4 text-slate-300" />
                        <input 
                            type="text" 
                            placeholder="FILTER IDENTITIES..." 
                            className="bg-transparent text-[11px] font-bold outline-none w-48 uppercase text-slate-600 placeholder:text-slate-300" 
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Identity Matrix</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Access Protocol</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Operating Hub</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Last Pulse</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center">Status</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            <tr>
                                <td colSpan="6" className="py-32 text-center">
                                    <div className="flex flex-col items-center gap-4 opacity-20">
                                        <div className="w-20 h-20 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center">
                                            <UserCircle className="w-10 h-10 text-slate-400" />
                                        </div>
                                        <div>
                                            <p className="text-[12px] font-bold text-slate-500 uppercase tracking-widest">Staff Matrix Clean</p>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">Zero Artifacts Created Yet</p>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <Fingerprint className="absolute -right-12 -bottom-12 w-64 h-64 text-slate-900/[0.02] pointer-events-none group-hover:rotate-12 transition-transform duration-1000" />
            </div>
        </div>
    );
};

export default StaffManagement;
