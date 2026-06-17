import React, { useState, useEffect, useCallback, useMemo } from "react";
import API_BASE from "../config";
import { 
  Bot, Map, Route, Save, Plus, Trash2, 
  Settings, CheckCircle2,
  Brain, Globe, Zap, Database, X
} from "lucide-react";

const OperationalRules = () => {
    const [activeTab, setActiveTab] = useState('knowledge');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(null);

    // AI Knowledge States
    const [knowledgeBase, setKnowledgeBase] = useState([]);
    const [newEntry, setNewEntry] = useState({ query_pattern: '', response_payload: '' });

    const impersonateId = sessionStorage.getItem("impersonate_id");
    const targetParam = impersonateId ? `?target_user_id=${impersonateId}` : "";
    
    const headers = useMemo(() => ({ 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}` 
    }), []);

    const fetchRules = useCallback(async () => {
        try {
            setLoading(true);
            const endpoint = activeTab === 'knowledge' ? 'knowledge' : activeTab === 'geofencing' ? 'geofences' : 'routing';
            const res = await fetch(`${API_BASE}/api/rules/${endpoint}${targetParam}`, { headers });
            const data = await res.json();
            if (activeTab === 'knowledge') setKnowledgeBase(data);
            // Future tabs can be handled here if states are added back
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    }, [activeTab, targetParam, headers]);

    useEffect(() => {
        fetchRules();
    }, [fetchRules]);

    const handleSaveKnowledge = async () => {
        if (!newEntry.query_pattern || !newEntry.response_payload) return;
        try {
            const res = await fetch(`${API_BASE}/api/rules/knowledge${targetParam}`, {
                method: 'POST',
                headers,
                body: JSON.stringify(newEntry)
            });
            if (res.ok) {
                setSuccess("Knowledge pattern synthesized.");
                setNewEntry({ query_pattern: '', response_payload: '' });
                fetchRules();
            }
        } catch (err) { console.error("Synthesis failed.", err); }
    };

    const handleDeleteKnowledge = async (id) => {
        try {
            const res = await fetch(`${API_BASE}/api/rules/knowledge/${id}${targetParam}`, { method: 'DELETE', headers });
            if (res.ok) fetchRules();
        } catch (err) { console.error(err); }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header Control */}
            <div className="flex items-center justify-between bg-white dark:bg-[#1e2129] p-4 rounded-lg border border-slate-200 dark:border-white/5 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg">
                        <Brain className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                        <h2 className="text-[14px] font-bold text-slate-800 dark:text-white uppercase tracking-tight">Logic Orchestrator</h2>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Operational Rails & Intelligence</p>
                    </div>
                </div>
                <div className="flex bg-slate-100 dark:bg-white/5 p-0.5 rounded-md border border-slate-200 dark:border-white/5">
                    {[
                        { id: 'knowledge', label: 'AI Knowledge', icon: Bot },
                        { id: 'geofencing', label: 'Spatial Fence', icon: Map },
                        { id: 'routing', label: 'Route Engine', icon: Route }
                    ].map(tab => (
                        <button 
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-1.5 rounded text-[10px] font-bold transition-all uppercase tracking-tight ${activeTab === tab.id ? 'bg-white dark:bg-white/10 text-slate-900 dark:text-white shadow-sm' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'}`}
                        >
                            <tab.icon className="w-3.5 h-3.5" />
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Configuration Panel */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-white dark:bg-[#1e2129] p-5 rounded-lg border border-slate-200 dark:border-white/5 shadow-sm">
                        <h3 className="text-[12px] font-bold text-slate-800 dark:text-white uppercase mb-6 flex items-center gap-2">
                           <Plus className="w-4 h-4 text-emerald-500" /> Pattern Injector
                        </h3>
                        
                        {activeTab === 'knowledge' && (
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Trigger Pattern</label>
                                    <input 
                                        value={newEntry.query_pattern}
                                        onChange={e => setNewEntry({...newEntry, query_pattern: e.target.value})}
                                        className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-lg px-4 py-2.5 text-[11px] font-bold text-slate-800 dark:text-white outline-none focus:border-indigo-500/50 transition-all placeholder:text-slate-300 dark:placeholder:text-slate-600"
                                        placeholder="e.g. business_hours, delivery_policy"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Response Payload</label>
                                    <textarea 
                                        value={newEntry.response_payload}
                                        onChange={e => setNewEntry({...newEntry, response_payload: e.target.value})}
                                        className="w-full h-40 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-lg px-4 py-3 text-[11px] font-bold text-slate-800 dark:text-white outline-none focus:border-indigo-500/50 transition-all resize-none placeholder:text-slate-300 dark:placeholder:text-slate-600"
                                        placeholder="Enter the AI response logic..."
                                    />
                                </div>
                                <button 
                                    onClick={handleSaveKnowledge}
                                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-indigo-600/10 flex items-center justify-center gap-2"
                                >
                                    <Save className="w-4 h-4" /> Synthesize Rule
                                </button>
                            </div>
                        )}

                        {activeTab !== 'knowledge' && (
                            <div className="py-20 text-center opacity-30">
                                <Settings className="w-12 h-12 mx-auto mb-4 animate-spin-slow text-slate-400" />
                                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Module under deployment</p>
                            </div>
                        )}
                    </div>

                    <div className="bg-indigo-600 p-6 rounded-lg shadow-lg relative overflow-hidden group">
                        <div className="relative z-10">
                            <h4 className="text-white text-[12px] font-bold uppercase tracking-widest opacity-80">Engine Status</h4>
                            <div className="mt-4 flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-sm border border-white/10">
                                    <Zap className="w-6 h-6 text-indigo-100 animate-pulse" />
                                </div>
                                <div>
                                    <p className="text-white text-[24px] font-black tracking-tighter">OPTIMAL</p>
                                    <p className="text-indigo-200 text-[10px] font-bold uppercase tracking-wider">System Latency: 12ms</p>
                                </div>
                            </div>
                        </div>
                        <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-all duration-700" />
                    </div>
                </div>

                {/* Registry Matrix */}
                <div className="lg:col-span-8 bg-white dark:bg-[#1e2129] rounded-lg border border-slate-200 dark:border-white/5 shadow-sm overflow-hidden flex flex-col">
                    <div className="px-5 py-4 border-b border-slate-100 dark:border-white/5 flex items-center justify-between bg-slate-50/50 dark:bg-white/5">
                        <h3 className="text-[12px] font-bold text-slate-800 dark:text-white uppercase tracking-tight">Rule Registry Matrix</h3>
                        <div className="px-3 py-1 bg-white dark:bg-white/10 border border-slate-200 dark:border-white/5 rounded text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                            {activeTab === 'knowledge' ? knowledgeBase.length : 0} Rules Active
                        </div>
                    </div>

                    <div className="flex-1 overflow-auto p-4 custom-scrollbar min-h-[500px]">
                        {loading ? (
                            <div className="py-32 flex flex-col items-center">
                                <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mb-6" />
                                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-[0.4em]">Querying Logic Cluster...</p>
                            </div>
                        ) : activeTab === 'knowledge' ? (
                            <div className="grid gap-4">
                                {knowledgeBase.map(item => (
                                    <div key={item.id} className="group border border-slate-100 dark:border-white/5 rounded-xl p-5 hover:border-indigo-500/30 dark:hover:border-indigo-500/30 hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-all flex items-start justify-between">
                                        <div className="space-y-3 flex-1 pr-6">
                                            <div className="flex items-center gap-3">
                                                <span className="px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-tight border border-indigo-100 dark:border-indigo-500/20">{item.query_pattern}</span>
                                                <span className="text-[9px] font-bold text-slate-300 dark:text-slate-600 uppercase tracking-widest">MTX_PTN_{item.id}</span>
                                            </div>
                                            <p className="text-[12px] text-slate-600 dark:text-slate-400 font-bold leading-relaxed">{item.response_payload}</p>
                                        </div>
                                        <button 
                                            onClick={() => handleDeleteKnowledge(item.id)}
                                            className="p-2.5 text-slate-300 dark:text-slate-700 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                                {knowledgeBase.length === 0 && (
                                    <div className="py-32 text-center opacity-10">
                                        <Database className="w-20 h-20 mx-auto mb-6 text-slate-400" />
                                        <p className="text-[12px] font-bold uppercase tracking-[0.3em] text-slate-500">Registry Vacant</p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="py-32 text-center opacity-20">
                                <Globe className="w-20 h-20 text-slate-300 dark:text-white mx-auto mb-6" />
                                <p className="text-[12px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em]">Synthesizing Spatial Logic...</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Utility Overlays */}
            {success && (
                <div className="fixed bottom-8 right-8 bg-emerald-600 text-white px-8 py-4 rounded-xl shadow-2xl flex items-center gap-4 animate-in slide-in-from-right-full duration-500 z-50 border border-white/10">
                    <div className="p-1.5 bg-white/20 rounded-lg">
                        <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-black uppercase tracking-widest">{success}</span>
                    <button onClick={() => setSuccess(null)} className="ml-4 opacity-50 hover:opacity-100 transition-opacity"><X className="w-5 h-5" /></button>
                </div>
            )}
        </div>
    );

};

export default OperationalRules;
