import React, { useState } from "react";
import { 
  Building2, ChevronRight, ChevronLeft, Layers, Layout,
  Image as ImageIcon, Save
} from "lucide-react";
import API_BASE from "../config";

const SetupBusiness = () => {
    const [step, setStep] = useState(1);

    const steps = [
        { id: 1, name: 'Identity', sub: 'Brand & Logo' },
        { id: 2, name: 'Industry', sub: 'Catalog Type' },
        { id: 3, name: 'Logic', sub: 'Operation Rules' },
        { id: 4, name: 'Scaling', sub: 'Staff & Inventory' },
        { id: 5, name: 'Social', sub: 'Links & Presence' },
        { id: 6, name: 'Power', sub: 'Advanced Apps' }
    ];

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center justify-between bg-white dark:bg-[#1e2129] p-4 rounded-lg border border-slate-200 dark:border-white/5 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-50 dark:bg-white/5 rounded-lg">
                        <Building2 className="w-5 h-5 text-slate-800 dark:text-white" />
                    </div>
                    <div>
                        <h2 className="text-[14px] font-bold text-slate-800 dark:text-white uppercase tracking-tight">Business Setup</h2>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Configure your profile & provision enterprise environment</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Wizard Navigation Rails */}
                <div className="lg:col-span-3 space-y-2">
                    {steps.map(s => (
                        <button 
                            key={s.id}
                            onClick={() => setStep(s.id)}
                            className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all border ${step === s.id ? 'bg-slate-900 dark:bg-indigo-600 text-white border-slate-900 dark:border-indigo-600 shadow-md shadow-slate-900/10' : 'bg-white dark:bg-[#1e2129] border-slate-200 dark:border-white/5 text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-600 dark:hover:text-slate-300'}`}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold ${step === s.id ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-white/5 text-slate-400 dark:text-slate-600'}`}>
                                    {s.id}
                                </div>
                                <div className="text-left">
                                    <p className="leading-tight">{s.name}</p>
                                    <p className={`text-[8px] font-bold uppercase tracking-widest ${step === s.id ? 'text-white/50' : 'text-slate-300 dark:text-slate-600'}`}>{s.sub}</p>
                                </div>
                            </div>
                            {step === s.id && <ChevronRight className="w-3.5 h-3.5 opacity-50" />}
                        </button>
                    ))}
                </div>

                {/* Configuration Theater */}
                <div className="lg:col-span-9 bg-white dark:bg-[#1e2129] border border-slate-200 dark:border-white/5 rounded-lg shadow-sm flex flex-col min-h-[550px] relative overflow-hidden">
                    <div className="p-8 flex-1 space-y-8 relative z-10">
                        <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-1.5 h-6 bg-slate-900 dark:bg-indigo-500 rounded-full" />
                                <h3 className="text-[12px] font-bold text-slate-800 dark:text-white uppercase tracking-wider">Business Identity Core</h3>
                            </div>
                            <button className="px-4 py-2 bg-emerald-600 text-white rounded-md font-bold text-[10px] uppercase tracking-widest hover:bg-emerald-700 transition-all flex items-center gap-2 shadow-md shadow-emerald-600/10">
                                <Save className="w-3.5 h-3.5" /> Save Phase
                            </button>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                            <div className="space-y-8">
                                <div className="space-y-3">
                                    <label className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Business Logo Artifact</label>
                                    <div className="w-32 h-32 rounded-xl bg-slate-50 dark:bg-white/5 border-2 border-dashed border-slate-200 dark:border-white/10 flex flex-col items-center justify-center text-slate-300 dark:text-slate-600 hover:border-slate-400 dark:hover:border-slate-500 hover:bg-slate-100/50 dark:hover:bg-white/10 transition-all cursor-pointer group">
                                        <ImageIcon className="w-8 h-8 mb-2 group-hover:scale-110 transition-transform duration-300" />
                                        <span className="text-[9px] font-bold uppercase tracking-widest">Upload</span>
                                    </div>
                                    <p className="text-[9px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-wider leading-relaxed">PNG, JPG UP TO 2MB. SHOWS ON YOUR DIGITAL MENU.</p>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Operational Adjustments</label>
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <p className="text-[9px] font-bold uppercase tracking-widest text-slate-500">Horizontal Shift (X)</p>
                                                <span className="text-[10px] font-bold text-slate-900 dark:text-white">0%</span>
                                            </div>
                                            <input type="range" className="w-full h-1.5 bg-slate-100 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-slate-900 dark:accent-indigo-500" />
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <p className="text-[9px] font-bold uppercase tracking-widest text-slate-500">Vertical Shift (Y)</p>
                                                <span className="text-[10px] font-bold text-slate-900 dark:text-white">0%</span>
                                            </div>
                                            <input type="range" className="w-full h-1.5 bg-slate-100 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-slate-900 dark:accent-indigo-500" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-3">
                                    <label className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Banner Identity Artifact</label>
                                    <button className="w-full h-11 border border-slate-900 dark:border-indigo-500 text-slate-900 dark:text-indigo-500 text-[10px] font-bold uppercase tracking-widest rounded-lg hover:bg-slate-900 dark:hover:bg-indigo-600 hover:text-white dark:hover:text-white transition-all flex items-center justify-center gap-2 shadow-sm">
                                        <Layers className="w-4 h-4" /> Replace Banner Artifact
                                    </button>
                                </div>
                                <div className="w-full aspect-video rounded-xl bg-slate-50 dark:bg-white/5 border-2 border-dashed border-slate-200 dark:border-white/10 flex flex-col items-center justify-center group overflow-hidden relative">
                                    <div className="flex flex-col items-center gap-3 opacity-20 group-hover:opacity-40 transition-opacity">
                                        <Layout className="w-12 h-12 dark:text-white" />
                                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] dark:text-white">Preview Architecture</span>
                                    </div>
                                    <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/[0.02] dark:group-hover:bg-white/[0.02] transition-colors" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Wizard Footer Controls */}
                    <div className="p-6 border-t border-slate-100 dark:border-white/5 flex items-center justify-between bg-slate-50/30 dark:bg-white/5 relative z-10">
                        <button className={`px-5 py-2.5 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 text-slate-400 dark:text-slate-600 rounded-md font-bold text-[10px] uppercase tracking-widest flex items-center gap-2 transition-all ${step === 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-slate-50 dark:hover:bg-white/10 hover:text-slate-600 dark:hover:text-slate-300'}`}>
                            <ChevronLeft className="w-4 h-4" /> Previous Step
                        </button>
                        <button className="px-6 py-2.5 bg-slate-900 dark:bg-indigo-600 text-white rounded-md font-bold text-[10px] uppercase tracking-widest hover:bg-slate-800 dark:hover:bg-indigo-500 transition-all flex items-center gap-2 shadow-lg shadow-slate-900/10">
                            Continue to Industry <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>

                    <Layout className="absolute -right-12 -bottom-12 w-64 h-64 text-slate-900/[0.02] dark:text-white/[0.02] -rotate-12 pointer-events-none" />
                </div>
            </div>
        </div>
    );

};

export default SetupBusiness;
