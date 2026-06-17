import React, { useState, useEffect } from "react";
import { 
  Zap, Save, ShieldCheck, Database, 
  Layers, Lock, Globe, Terminal, 
  Cpu, MessageSquare, Code, Layout,
  Webhook, Share2, Copy, CheckCircle2, ChevronRight
} from "lucide-react";
import API_BASE from "../config";

const Integrations = () => {
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-50 rounded-lg">
                        <Zap className="w-5 h-5 text-slate-800" />
                    </div>
                    <div>
                        <h2 className="text-[14px] font-bold text-slate-800 uppercase tracking-tight">Power Hub</h2>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Advanced integrations & real-time telemetry artifacts</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button className="px-4 py-2 bg-slate-900 text-white rounded-md font-bold text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center gap-2 shadow-md shadow-slate-900/10">
                        <Save className="w-3.5 h-3.5" /> Save All Integrations
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Developer Webhooks Matrix */}
                <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-6 space-y-8 relative overflow-hidden group">
                    <div className="flex items-center gap-3 border-b border-slate-100 pb-5">
                        <div className="w-10 h-10 rounded-lg bg-slate-900 flex items-center justify-center text-white shadow-lg shadow-slate-900/10">
                            <Terminal className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-[13px] font-bold text-slate-900 uppercase tracking-tight">Developer Webhooks</h3>
                            <div className="flex items-center gap-1.5 mt-0.5">
                                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                <p className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest">Real-time Data Sync Active</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest px-1">Endpoint URL (POST)</label>
                            <input 
                                type="text" 
                                className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-lg text-[12px] font-bold text-slate-900 uppercase outline-none focus:border-slate-500 transition-all" 
                                placeholder="HTTPS://YOUR-SERVER.COM/WEBHOOK" 
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest px-1">Target Events</label>
                            <div className="flex flex-wrap gap-2">
                                {['ORDER.NEW', 'ORDER.STATUS_CHANGED', 'MESSAGE.INCOMING'].map(ev => (
                                    <span key={ev} className="px-2 py-1 bg-slate-100 text-slate-600 border border-slate-200 rounded text-[9px] font-bold uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all cursor-default">{ev}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                    <Webhook className="absolute -right-12 -bottom-12 w-48 h-48 text-slate-900/[0.02] pointer-events-none group-hover:rotate-12 transition-transform duration-1000" />
                </div>

                {/* Website Chat Matrix */}
                <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-6 space-y-8 relative overflow-hidden group">
                    <div className="flex items-center gap-3 border-b border-slate-100 pb-5">
                        <div className="w-10 h-10 rounded-lg bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/10">
                            <MessageSquare className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-[13px] font-bold text-slate-900 uppercase tracking-tight">Website Chat Widget</h3>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Convert Web Visitors</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest px-1">Widget Color</label>
                            <div className="flex items-center gap-3">
                                <div className="w-11 h-11 rounded-lg border-2 border-white bg-[#25D366] shadow-sm ring-1 ring-slate-200" />
                                <input 
                                    type="text" 
                                    value="#25D366" 
                                    readOnly 
                                    className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-lg text-[12px] font-bold text-slate-900 outline-none" 
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest px-1">Position</label>
                            <div className="flex h-11 bg-slate-50 border border-slate-200 rounded-lg p-1">
                                <button className="flex-1 text-[9px] font-bold uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors">Left</button>
                                <button className="flex-1 bg-white border border-slate-200 shadow-sm rounded-md text-[9px] font-bold uppercase tracking-widest text-slate-900">Right</button>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest px-1">Embed Snippet</label>
                        <div className="relative group/code">
                            <div className="w-full h-28 p-5 bg-slate-900 rounded-xl text-[11px] font-mono text-emerald-400 overflow-hidden border border-slate-800">
                                {`<script src="https://sasloop.ai/widget.js"></script>`}
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-50" />
                            </div>
                            <button className="absolute right-3 top-3 p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-all backdrop-blur-sm">
                                <Copy className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                    <Layers className="absolute -right-12 -bottom-12 w-48 h-48 text-slate-900/[0.02] pointer-events-none group-hover:rotate-12 transition-transform duration-1000" />
                </div>
            </div>
        </div>
    );
};

export default Integrations;
