import React, { useState, useEffect } from "react";
import { 
  CreditCard, Wallet, Trash2, Search, 
  RefreshCw, Filter, Edit3, TrendingDown,
  ArrowDownCircle, Receipt, Plus, History,
  TrendingUp, PieChart, ChevronRight, MoreVertical
} from "lucide-react";
import API_BASE from "../config";

const ExpenseTracker = () => {
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Precision Ledger Header */}
            <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-rose-50 rounded-lg">
                        <Wallet className="w-5 h-5 text-rose-600" />
                    </div>
                    <div>
                        <h2 className="text-[14px] font-bold text-slate-800 uppercase tracking-tight">Business Ledger</h2>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Operational Cost Tracking</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative group">
                       <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                       <input type="text" placeholder="Search ledger..." className="pl-8 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-[11px] w-48 focus:w-64 outline-none transition-all uppercase font-bold text-slate-600" />
                    </div>
                    <button className="h-9 px-4 flex items-center gap-2 bg-rose-600 hover:bg-rose-500 text-white rounded-md font-bold text-[10px] uppercase tracking-widest shadow-md shadow-rose-600/10 transition-all">
                        <Plus className="w-3.5 h-3.5" /> Record Expense
                    </button>
                </div>
            </div>

            {/* Financial Telemetry */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm relative overflow-hidden group flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-rose-50 flex items-center justify-center text-rose-500 transition-transform group-hover:scale-110">
                        <TrendingDown className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Outflow</p>
                        <h3 className="text-2xl font-bold text-slate-800 tracking-tighter">₹0</h3>
                        <p className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-1">
                            <RefreshCw className="w-3 h-3 animate-spin-slow" /> Synced Now
                        </p>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm flex items-center gap-4 group">
                    <div className="w-12 h-12 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-500 transition-transform group-hover:scale-110">
                        <PieChart className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Highest Category</p>
                        <h3 className="text-xl font-bold text-slate-800 tracking-tight uppercase">N/A</h3>
                        <p className="text-[9px] font-bold text-slate-400 uppercase">Cost Driver</p>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm flex items-center gap-4 group">
                    <div className="w-12 h-12 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-500 transition-transform group-hover:scale-110">
                        <TrendingUp className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Daily Average</p>
                        <h3 className="text-xl font-bold text-slate-800 tracking-tight uppercase">₹0</h3>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Temporal Mean</p>
                    </div>
                </div>
            </div>

            {/* Transaction Matrix Theater */}
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm flex flex-col min-h-[400px] overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
                    <div className="flex items-center gap-2">
                        <Receipt className="w-4 h-4 text-slate-400" />
                        <h3 className="text-[12px] font-bold text-slate-800 uppercase tracking-tight">Transaction Matrix</h3>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="p-2 hover:bg-white rounded-md text-slate-400 border border-transparent hover:border-slate-200 transition-all"><Filter className="w-4 h-4" /></button>
                        <button className="p-2 hover:bg-white rounded-md text-slate-400 border border-transparent hover:border-slate-200 transition-all"><RefreshCw className="w-4 h-4" /></button>
                    </div>
                </div>

                <div className="flex-1 overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Date Node</th>
                                <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Classification</th>
                                <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Note Payload</th>
                                <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Outflow</th>
                                <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td colSpan="5" className="py-32 text-center">
                                    <div className="flex flex-col items-center gap-3 opacity-20">
                                        <div className="w-16 h-16 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center">
                                            <Receipt className="w-8 h-8 text-slate-400" />
                                        </div>
                                        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Ledger Clean: No Records Found</p>
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

export default ExpenseTracker;
