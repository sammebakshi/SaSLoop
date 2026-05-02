import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Printer, Save, RefreshCw, Smartphone, Monitor, Bluetooth, Wifi } from "lucide-react";

const POSSettings = () => {
    const [settings, setSettings] = useState({
        printerType: "BROWSER",
        printerIP: "",
        autoPrint: false,
        receiptHeader: "",
        receiptFooter: "THANK YOU! VISIT AGAIN",
        showGst: true
    });
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem("pos_settings");
        if (stored) setSettings(JSON.parse(stored));
    }, []);

    const handleSave = () => {
        localStorage.setItem("pos_settings", JSON.stringify(settings));
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    return (
        <div className="p-12 max-w-4xl mx-auto h-full overflow-y-auto no-scrollbar">
            <div className="flex items-center justify-between mb-12">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">Terminal Settings</h1>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mt-2">Hardware & Receipt Configuration</p>
                </div>
                <button 
                    onClick={handleSave}
                    className={`px-8 py-4 rounded-2xl flex items-center gap-3 text-[10px] font-black uppercase tracking-widest transition-all shadow-xl active:scale-95 ${saved ? 'bg-emerald-500 text-white shadow-emerald-100' : 'bg-slate-900 text-white shadow-slate-200'}`}
                >
                    {saved ? "Settings Saved" : <><Save className="w-4 h-4" /> Save Configuration</>}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Printer Configuration */}
                <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100">
                    <div className="flex items-center gap-4 mb-8 text-indigo-600">
                        <Printer className="w-8 h-8" />
                        <h2 className="text-xl font-black italic uppercase tracking-tight">Printer Setup</h2>
                    </div>

                    <div className="space-y-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Printer Interface</label>
                            <div className="grid grid-cols-2 gap-3 p-1 bg-slate-50 rounded-2xl">
                                {[
                                    { id: 'BROWSER', label: 'System Print', icon: Monitor },
                                    { id: 'NETWORK', label: 'IP Printer', icon: Wifi }
                                ].map(type => (
                                    <button 
                                        key={type.id}
                                        onClick={() => setSettings({...settings, printerType: type.id})}
                                        className={`flex items-center justify-center gap-2 py-3 rounded-xl text-[9px] font-black uppercase transition-all ${settings.printerType === type.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'}`}
                                    >
                                        <type.icon className="w-3.5 h-3.5" />
                                        {type.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {settings.printerType === 'NETWORK' && (
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">IP Address</label>
                                <input 
                                    type="text" 
                                    value={settings.printerIP}
                                    onChange={e => setSettings({...settings, printerIP: e.target.value})}
                                    placeholder="e.g. 192.168.1.100"
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-xs font-bold outline-none focus:border-indigo-500/30 transition-all"
                                />
                            </div>
                        )}

                        <div className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Auto-Print KOT</span>
                                <span className="text-[8px] font-bold text-slate-400 uppercase mt-1">Print to kitchen on settle</span>
                            </div>
                            <button 
                                onClick={() => setSettings({...settings, autoPrint: !settings.autoPrint})}
                                className={`w-14 h-8 rounded-full transition-all flex items-center p-1 ${settings.autoPrint ? 'bg-emerald-500' : 'bg-slate-300'}`}
                            >
                                <div className={`w-6 h-6 bg-white rounded-full shadow-sm transition-transform ${settings.autoPrint ? 'translate-x-6' : 'translate-x-0'}`} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Receipt Customization */}
                <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100">
                    <div className="flex items-center gap-4 mb-8 text-amber-500">
                        <Smartphone className="w-8 h-8" />
                        <h2 className="text-xl font-black italic uppercase tracking-tight">Receipt Brand</h2>
                    </div>

                    <div className="space-y-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Custom Header (Optional)</label>
                            <textarea 
                                value={settings.receiptHeader}
                                onChange={e => setSettings({...settings, receiptHeader: e.target.value})}
                                placeholder="Business Tagline or Extra Info"
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-xs font-bold outline-none focus:border-amber-500/30 transition-all h-24 resize-none"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Footer Message</label>
                            <input 
                                type="text" 
                                value={settings.receiptFooter}
                                onChange={e => setSettings({...settings, receiptFooter: e.target.value})}
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-xs font-bold outline-none focus:border-amber-500/30 transition-all"
                            />
                        </div>

                        <div className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Show GST Info</span>
                                <span className="text-[8px] font-bold text-slate-400 uppercase mt-1">Include tax breakdown in bill</span>
                            </div>
                            <button 
                                onClick={() => setSettings({...settings, showGst: !settings.showGst})}
                                className={`w-14 h-8 rounded-full transition-all flex items-center p-1 ${settings.showGst ? 'bg-emerald-500' : 'bg-slate-300'}`}
                            >
                                <div className={`w-6 h-6 bg-white rounded-full shadow-sm transition-transform ${settings.showGst ? 'translate-x-6' : 'translate-x-0'}`} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Theme & UI Customization */}
                <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100 md:col-span-2 mt-8">
                    <div className="flex items-center gap-4 mb-8 text-indigo-600">
                        <Monitor className="w-8 h-8" />
                        <h2 className="text-xl font-black italic uppercase tracking-tight">Terminal Appearance</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="flex items-center justify-between p-8 bg-slate-50 rounded-[2.5rem]">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Interface Theme</span>
                                <span className="text-[8px] font-bold text-slate-400 uppercase mt-1">Switch between Light and Dark mode</span>
                            </div>
                            <div className="flex bg-white p-1 rounded-2xl shadow-sm border border-slate-100">
                                {[
                                    { id: 'light', label: 'Light Mode' },
                                    { id: 'dark', label: 'Dark Mode' }
                                ].map(t => (
                                    <button 
                                        key={t.id}
                                        onClick={() => {
                                            localStorage.setItem("pos_theme", t.id);
                                            window.dispatchEvent(new Event("storage"));
                                            window.location.reload(); 
                                        }}
                                        className={`px-6 py-3 rounded-xl text-[9px] font-black uppercase transition-all ${localStorage.getItem("pos_theme") === t.id ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
                                    >
                                        {t.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="p-8 bg-indigo-50/50 border border-indigo-100 rounded-[2.5rem] flex items-center gap-4">
                           <div className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center shadow-lg">
                               <RefreshCw className="w-4 h-4" />
                           </div>
                           <p className="text-[9px] font-bold text-indigo-900/60 uppercase tracking-tight leading-relaxed">Theme changes are applied instantly across the entire terminal shell.</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-12 bg-indigo-600/5 border border-indigo-600/10 p-8 rounded-[2.5rem] flex items-center gap-6">
                <div className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-100 shrink-0">
                    <RefreshCw className="w-5 h-5" />
                </div>
                <div>
                    <p className="text-[10px] font-black text-indigo-900 uppercase tracking-widest">Network Printer Note</p>
                    <p className="text-[9px] font-bold text-indigo-600/60 uppercase tracking-tighter mt-1 leading-relaxed">Ensure your printer is on the same local network. For direct thermal printers, system-print (Browser) is recommended for best compatibility.</p>
                </div>
            </div>
        </div>
    );
};

export default POSSettings;
