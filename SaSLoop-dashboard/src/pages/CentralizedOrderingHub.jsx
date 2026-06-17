import React, { useState, useEffect } from "react";
import { 
  Cloud, RefreshCw, Zap, ShieldCheck, Globe, 
  ShoppingBag, TrendingUp, AlertCircle, Activity,
  Smartphone, Monitor, Power, CheckCircle2, MoreVertical,
  Layers, Package, Shield, LayoutGrid
} from "lucide-react";
import API_BASE from "../config";

const CentralizedOrderingHub = () => {
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Precision Meta-Metrics */}
            <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-50 rounded-lg">
                        <LayoutGrid className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                        <h2 className="text-[14px] font-bold text-slate-800 uppercase tracking-tight">Centralized Ordering Hub</h2>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Multi-channel Aggregator & Real-time Sync</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <div className="px-4 py-1.5 bg-emerald-50 border border-emerald-100 rounded-full flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Sync Engine Active</span>
                    </div>
                    <button className="p-2 hover:bg-slate-50 text-slate-400 rounded-md border border-slate-200 transition-all"><RefreshCw className="w-4 h-4" /></button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-5 relative overflow-hidden group">
                    <div className="relative z-10 space-y-2">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Omnichannel Revenue</p>
                        <h3 className="text-3xl font-bold text-slate-900 tracking-tight">₹118,300</h3>
                        <div className="flex items-center gap-1.5 text-emerald-500 text-[10px] font-bold bg-emerald-50 w-fit px-2 py-0.5 rounded">
                            <TrendingUp className="w-3 h-3" /> ACROSS 3 CHANNELS
                        </div>
                    </div>
                    <Cloud className="absolute -right-4 -bottom-4 w-24 h-24 text-slate-50 opacity-50 rotate-12 group-hover:scale-110 transition-transform" />
                </div>

                <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-5 flex flex-col justify-center space-y-2">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Dominant Platform</p>
                    <h3 className="text-[18px] font-bold text-slate-800 uppercase tracking-tight">Direct Order</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider opacity-60">Generating 38% of traffic</p>
                </div>

                <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-5 flex flex-col justify-center space-y-4">
                    <div className="flex items-center justify-between">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">System Integrity</p>
                        <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1.5 uppercase"><ShieldCheck className="w-3.5 h-3.5" /> Operational OK</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 w-[92%] transition-all duration-1000" />
                    </div>
                </div>
            </div>

            {/* Platform Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { name: 'Direct Order', id: 'DIRECT_HUB', revenue: '45,200', orders: 124, icon: Globe, status: 'CONNECTED', color: 'emerald' },
                    { name: 'Swiggy', id: 'SWIGGY_HUB', revenue: '32,100', orders: 89, icon: ShoppingBag, status: 'CONNECTED', color: 'emerald' },
                    { name: 'Zomato', id: 'ZOMATO_HUB', revenue: '41,000', orders: 112, icon: Smartphone, status: 'SYNCING', color: 'amber' }
                ].map(platform => (
                    <div key={platform.id} className="bg-white border border-slate-200 rounded-lg shadow-sm p-5 space-y-5 hover:border-indigo-200 transition-all group">
                        <div className="flex items-center justify-between">
                            <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all duration-300">
                                <platform.icon className="w-5 h-5" />
                            </div>
                            <div className="flex items-center gap-3">
                                <span className={`text-[10px] font-bold uppercase tracking-widest text-${platform.color}-500`}>{platform.status}</span>
                                <div className={`w-8 h-4 rounded-full relative transition-colors ${platform.color === 'emerald' ? 'bg-emerald-500' : 'bg-slate-200'}`}>
                                    <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full shadow-sm transition-all ${platform.color === 'emerald' ? 'right-0.5' : 'left-0.5'}`} />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <h4 className="text-[15px] font-bold text-slate-800 uppercase tracking-tight">{platform.name}</h4>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest opacity-60">PLATFORM ID: {platform.id}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-slate-50 border border-slate-100 p-3 rounded-lg">
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Orders</p>
                                <p className="text-[14px] font-bold text-slate-900">{platform.orders}</p>
                            </div>
                            <div className="bg-slate-50 border border-slate-100 p-3 rounded-lg">
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Revenue</p>
                                <p className="text-[14px] font-bold text-slate-900">₹{platform.revenue}</p>
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                            <div className="space-y-0.5">
                                <p className="text-[10px] font-bold text-slate-800 uppercase">Auto-Accept</p>
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Automated Workflow</p>
                            </div>
                            <button className="px-4 py-1.5 bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-widest rounded shadow-md shadow-indigo-600/10 hover:bg-indigo-500 transition-all active:scale-95">Active</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CentralizedOrderingHub;
