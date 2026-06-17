import React, { useState, useEffect } from "react";
import { 
  Building2, Save, ShieldCheck, Database, 
  Layers, Lock, Globe, Store, Building,
  ChevronDown, Cpu, UserCircle, Settings2,
  BellRing, CreditCard, Activity, Layout, ChevronRight
} from "lucide-react";
import API_BASE from "../config";

const BusinessIdentity = () => {
    const [activeTab, setActiveTab] = useState("BRAND");

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-50 rounded-lg">
                        <Building2 className="w-5 h-5 text-slate-800" />
                    </div>
                    <div>
                        <h2 className="text-[14px] font-bold text-slate-800 uppercase tracking-tight">Business Identity</h2>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Universal settings for SaSLoop & backoffice orchestration architect</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button className="px-4 py-2 bg-slate-900 text-white rounded-md font-bold text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center gap-2 shadow-md shadow-slate-900/10">
                        <Save className="w-3.5 h-3.5" /> Save Unified Rules
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Navigation Rails */}
                <div className="lg:col-span-3 space-y-2">
                    {[
                        { id: 'BRAND', name: 'Brand & Identity', icon: Building2 },
                        { id: 'RULES', name: 'Service Rules', icon: Activity },
                        { id: 'TAX', name: 'Tax & Payments', icon: CreditCard },
                        { id: 'ALERTS', name: 'Routing & Alerts', icon: BellRing },
                        { id: 'LOYALTY', name: 'CRM & Loyalty', icon: UserCircle }
                    ].map(tab => (
                        <button 
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all border ${activeTab === tab.id ? 'bg-slate-900 text-white border-slate-900 shadow-md shadow-slate-900/10' : 'bg-white border-slate-200 text-slate-400 hover:bg-slate-50 hover:text-slate-600'}`}
                        >
                            <div className="flex items-center gap-3">
                                <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-white' : 'text-slate-300'}`} /> 
                                {tab.name}
                            </div>
                            {activeTab === tab.id && <ChevronRight className="w-3.5 h-3.5 opacity-50" />}
                        </button>
                    ))}

                    {/* Platform Telemetry */}
                    <div className="mt-6 bg-emerald-50 border border-emerald-100 p-5 rounded-lg relative overflow-hidden group">
                        <div className="relative z-10">
                            <p className="text-[9px] font-bold text-emerald-800/50 uppercase tracking-widest mb-4">Platform Health</p>
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-[10px] font-bold uppercase text-emerald-900">API Status</span>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                    <span className="text-[10px] font-bold uppercase text-emerald-600">Online</span>
                                </div>
                            </div>
                            <div className="h-1 bg-emerald-200 rounded-full overflow-hidden">
                                <div className="h-full w-full bg-emerald-500" />
                            </div>
                        </div>
                        <Activity className="absolute -right-4 -bottom-4 w-16 h-16 text-emerald-500/10 group-hover:scale-125 transition-transform duration-500" />
                    </div>
                </div>

                {/* Configuration Matrix Theater */}
                <div className="lg:col-span-9 bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden relative min-h-[500px]">
                    <div className="p-8 space-y-10">
                        {/* Section Header */}
                        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                            <div className="w-1.5 h-6 bg-slate-900 rounded-full" />
                            <h3 className="text-[12px] font-bold text-slate-800 uppercase tracking-wider">Identity Core Parameters</h3>
                        </div>

                        {/* Dynamic Form Sections */}
                        <div className="grid grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest px-1">Brand Legal Name</label>
                                <input 
                                    type="text" 
                                    className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-lg text-[12px] font-bold text-slate-900 uppercase outline-none focus:border-slate-500 transition-all" 
                                    placeholder="BRAND_IDENTITY..." 
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest px-1">Business Vertical</label>
                                <div className="relative">
                                    <select className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-lg text-[12px] font-bold text-slate-900 uppercase appearance-none outline-none focus:border-slate-500 transition-all cursor-pointer">
                                        <option>Restaurant & Cafe</option>
                                        <option>Retail & Grocery</option>
                                        <option>Enterprise Logistics</option>
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 pointer-events-none" />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest px-1">Operational Address</label>
                            <textarea 
                                className="w-full h-28 p-4 bg-slate-50 border border-slate-200 rounded-lg text-[12px] font-bold text-slate-900 uppercase outline-none focus:border-slate-500 transition-all resize-none" 
                                placeholder="FULL_IDENTITY_LOCATION..." 
                            />
                        </div>
                    </div>

                    {/* Architectural Decorations */}
                    <Layout className="absolute -right-12 -bottom-12 w-64 h-64 text-slate-900/[0.02] -rotate-12 pointer-events-none" />
                </div>
            </div>
        </div>
    );
};

export default BusinessIdentity;
