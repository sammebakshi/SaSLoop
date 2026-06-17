import React, { useState, useEffect } from "react";
import { 
  Wallet, Search, RefreshCw, Filter, 
  Download, Calendar, IndianRupee, Database,
  ShieldCheck, Banknote, UserCheck, Clock,
  ArrowUpRight, History
} from "lucide-react";
import API_BASE from "../config";

const WalletHub = () => {
    return (
        <div className="space-y-3 animate-pro-in">
            {/* Precision Liquidity Header */}
            <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                    <h2 className="pro-heading uppercase tracking-tighter text-slate-900 italic font-black">Liquidity Vault</h2>
                    <p className="pro-subheading uppercase tracking-widest text-[9px]">Real-time tracking of wallet balances, active states & identity artifacts orchestration</p>
                </div>
                <div className="flex items-center gap-1.5">
                    <button className="pro-btn-primary h-7 px-4 flex items-center gap-2 bg-slate-900 border-slate-900 shadow-lg shadow-slate-900/20"><Download className="w-3.5 h-3.5" /> Export Liquidity Vault</button>
                </div>
            </div>

            {/* Tactical Liquidity Protocol */}
            <div className="pro-card p-3 bg-slate-900 text-white relative overflow-hidden group">
                <div className="relative z-10 grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
                    <div className="space-y-1">
                        <label className="text-[8px] font-black text-white/40 uppercase tracking-widest px-1">Target Operating Hub</label>
                        <select className="w-full h-8 bg-white/5 border border-white/10 rounded px-2 text-[10px] font-bold uppercase outline-none focus:border-indigo-500 transition-all cursor-pointer">
                            <option className="text-slate-900">All Operating Hubs</option>
                        </select>
                    </div>
                    <div className="space-y-1">
                        <label className="text-[8px] font-black text-white/40 uppercase tracking-widest px-1">Audit Date</label>
                        <input type="date" className="w-full h-8 bg-white/5 border border-white/10 rounded px-2 text-[10px] font-bold uppercase outline-none" />
                    </div>
                    <button className="h-8 bg-indigo-600 hover:bg-indigo-700 text-white text-[9px] font-black uppercase tracking-widest rounded transition-all shadow-xl shadow-indigo-600/20 active:scale-95">Execute Liquidity Audit</button>
                    <button className="h-8 bg-white/5 hover:bg-white/10 rounded text-white/40 transition-all flex items-center justify-center"><RefreshCw className="w-4 h-4" /></button>
                </div>
                <Banknote className="absolute -right-8 -bottom-8 w-40 h-40 text-white/[0.02] pointer-events-none" />
            </div>

            {/* Wallet Manifest Theater */}
            <div className="pro-card min-h-[450px] flex flex-col bg-white overflow-hidden relative">
                <div className="p-3 border-b border-slate-100 bg-slate-50/20 flex items-center justify-between">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Wallet className="w-3.5 h-3.5" /> Customer Wallet Manifest</h3>
                    <div className="flex items-center gap-2 px-2 py-1 bg-white border border-slate-200 rounded">
                        <Search className="w-3.5 h-3.5 text-slate-400" />
                        <input type="text" placeholder="Filter Balances..." className="bg-transparent text-[10px] font-bold outline-none w-32 uppercase" />
                    </div>
                </div>

                <div className="flex-1 overflow-x-auto">
                    <table className="pro-table">
                        <thead>
                            <tr className="bg-slate-50">
                                <th>Action Identity</th>
                                <th>Wallet ID</th>
                                <th>Identity Matrix</th>
                                <th>Liquidity Balance</th>
                                <th>Operating Hub</th>
                                <th>Protocol Status</th>
                                <th className="text-right">Created Artifact</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td colSpan="7" className="py-32 text-center">
                                    <div className="flex flex-col items-center gap-3 opacity-20">
                                        <div className="w-16 h-16 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center">
                                            <ShieldCheck className="w-8 h-8 text-slate-400" />
                                        </div>
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Scanning Liquidity Vaults...</p>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Vault Decoration */}
                <History className="absolute -left-8 -bottom-8 w-40 h-40 text-slate-900/[0.02] pointer-events-none" />
            </div>
        </div>
    );
};

export default WalletHub;
