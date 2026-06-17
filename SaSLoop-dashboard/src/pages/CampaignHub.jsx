import React, { useState, useEffect } from "react";
import { 
  Megaphone, Search, RefreshCw, Filter, 
  Plus, Target, Layers, CheckCircle2, 
  Clock, Database, Globe, Share2,
  BarChart3, UserCheck, Edit3, Trash2
} from "lucide-react";
import API_BASE from "../config";

const CampaignHub = () => {
    return (
        <div className="space-y-3 animate-pro-in">
            {/* Precision Relationship Header */}
            <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                    <h2 className="pro-heading uppercase tracking-tighter text-slate-900 italic font-black">Relationship Broadside Hub</h2>
                    <p className="pro-subheading uppercase tracking-widest text-[9px]">Orchestrating relationship broadsides, audience segmentation artifacts & engagement temporalities</p>
                </div>
                <div className="flex items-center gap-1.5">
                    <button className="pro-btn-primary h-8 px-6 flex items-center gap-2 bg-slate-900 border-slate-900 shadow-lg shadow-slate-900/20"><Megaphone className="w-3.5 h-3.5" /> Orchestrate New Broadside</button>
                </div>
            </div>

            {/* Tactical Broadside Protocol */}
            <div className="pro-card p-2 flex items-center gap-3 bg-white/50">
                <div className="flex items-center gap-2 flex-1 bg-white border border-slate-100 rounded px-2 py-1">
                    <Search className="w-3.5 h-3.5 text-slate-400" />
                    <input type="text" placeholder="Search campaigns, audience nodes or broadside tags..." className="bg-transparent text-[11px] font-bold outline-none w-full uppercase" />
                </div>
                <button className="p-1.5 hover:bg-slate-100 rounded text-slate-400"><Filter className="w-3.5 h-3.5" /></button>
            </div>

            {/* Broadside Manifest Theater */}
            <div className="pro-card overflow-hidden bg-white">
                <div className="p-3 border-b border-slate-100 bg-slate-50/20 flex items-center justify-between">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Database className="w-3.5 h-3.5" /> Campaign Database Manifest</h3>
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Marketing Yield Optimization Active</span>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="pro-table">
                        <thead>
                            <tr className="bg-slate-900 text-white/50">
                                <th className="text-white">Campaign Identity</th>
                                <th className="text-white">Target Audience Node</th>
                                <th className="text-white">Operational Status</th>
                                <th className="text-white">Potential Reach</th>
                                <th className="text-white">Execution Temporal</th>
                                <th className="text-right text-white">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[
                                { id: 1, name: 'Weekend Special Offer', node: 'All Customers', status: 'Active', reach: '12,450', date: '2026-05-06' },
                                { id: 2, name: 'Re-engagement Push', node: 'Inactive (30 Days)', status: 'Scheduled', reach: '2,100', date: '2026-05-08' }
                            ].map(item => (
                                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="py-2.5">
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-7 h-7 rounded bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-500">
                                                <Megaphone className="w-3.5 h-3.5" />
                                            </div>
                                            <p className="font-black text-slate-900 uppercase tracking-tight italic">{item.name}</p>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="flex items-center gap-1.5 text-indigo-600">
                                            <UserCheck className="w-3 h-3" />
                                            <span className="text-[10px] font-black uppercase tracking-widest">{item.node}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest italic ${item.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-amber-50 text-amber-600 border border-amber-100'}`}>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td>
                                        <span className="text-[11px] font-black text-slate-900 italic tracking-tighter">{item.reach}</span>
                                    </td>
                                    <td>
                                        <div className="flex items-center gap-1.5 text-slate-400">
                                            <Clock className="w-3 h-3" />
                                            <span className="text-[10px] font-bold uppercase tracking-widest">{item.date}</span>
                                        </div>
                                    </td>
                                    <td className="text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <button className="p-1.5 hover:bg-slate-100 rounded text-slate-300"><BarChart3 className="w-3.5 h-3.5" /></button>
                                            <button className="p-1.5 hover:bg-rose-50 rounded text-rose-300"><Trash2 className="w-3.5 h-3.5" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default CampaignHub;
