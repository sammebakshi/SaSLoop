import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Bot, Save, FileText, CheckCircle2, MessageSquare, AlertCircle, Zap, Terminal, ArrowLeft } from "lucide-react";

function BotConfig() {
  const [user, setUser] = useState(null);
  const [knowledge, setKnowledge] = useState("");
  const [systemPrompt, setSystemPrompt] = useState("You are a helpful and polite customer service assistant.");
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if an admin navigated here with a target business user in state
    if (location.state && location.state.targetUser) {
       const u = location.state.targetUser;
       setUser(u);
       if (u.bot_knowledge) setKnowledge(u.bot_knowledge);
    } else {
       // Fallback for direct testing
       const userData = localStorage.getItem("user");
       if (userData) {
         const parsed = JSON.parse(userData);
         setUser(parsed);
         if (parsed.bot_knowledge) setKnowledge(parsed.bot_knowledge);
       }
    }
  }, [location.state]);

  const handleSave = (e) => {
    e.preventDefault();
    setIsSaving(true);
    // Simulate DB save delay
    setTimeout(() => {
      setIsSaving(false);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
      
      // Update local storage mock for now
      if (user) {
        const updatedUser = { ...user, bot_knowledge: knowledge };
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }
    }, 1200);
  };

  if (!user) return <div className="p-8 font-medium text-slate-500">Loading AI Interface...</div>;

  return (
    <div className="flex flex-col h-full space-y-8 p-2 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-xs font-bold text-indigo-500 bg-indigo-50 px-3 py-1.5 rounded-lg w-fit mb-3 hover:bg-indigo-100 transition-colors uppercase tracking-widest"><ArrowLeft className="w-3.5 h-3.5" /> Back to Directory</button>
          <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight flex items-center gap-3">
             <Bot className="w-8 h-8 text-indigo-500" /> AI Knowledge Base
          </h2>
          <p className="text-slate-500 mt-1 text-sm font-medium">Configure the bot brain for <span className="font-bold text-slate-800">{user.business_name || user.first_name + "'s Business"}</span>.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Editor */}
        <div className="lg:col-span-2 flex flex-col gap-6">
           <form onSubmit={handleSave} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm relative">
              {isSaved && (
                 <div className="absolute top-6 right-6 px-4 py-2 bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold text-xs rounded-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                    <CheckCircle2 className="w-4 h-4" /> Knowledge Synced
                 </div>
              )}
              
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100">
                 <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-500 border border-indigo-100 shadow-sm">
                   <Bot className="w-6 h-6" />
                 </div>
                 <div>
                    <h3 className="text-xl font-bold text-slate-800 tracking-tight">Bot Persona & Brain</h3>
                    <p className="text-xs text-slate-500 font-medium tracking-wide uppercase mt-1">Llama-3 Generative Model Engine</p>
                 </div>
              </div>

              <div className="space-y-6">
                 <div>
                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest pl-1 mb-2 block flex items-center gap-2">
                       <Terminal className="w-3.5 h-3.5" /> Core System Prompt (Instructions)
                    </label>
                    <textarea 
                       required 
                       value={systemPrompt} 
                       onChange={e => setSystemPrompt(e.target.value)} 
                       placeholder="E.g. You are a polite virtual assistant for The Grand Hotel." 
                       className="w-full h-24 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-800 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none resize-none font-medium custom-scrollbar" 
                    />
                 </div>
                 
                 <div>
                    <div className="flex justify-between items-end mb-2">
                       <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest pl-1 flex items-center gap-2">
                          <FileText className="w-3.5 h-3.5" /> Business Knowledge (Menu, FAQs, Pricing)
                       </label>
                       <span className="text-[10px] font-bold text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-md">Unlimited Context</span>
                    </div>
                    <textarea 
                       value={knowledge} 
                       onChange={e => setKnowledge(e.target.value)} 
                       placeholder="Paste your menu, store hours, pricing tables, policies, and frequently asked questions here. The AI will read and memorize this perfectly to answer customer inquiries." 
                       className="w-full h-72 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-800 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none resize-none font-medium leading-relaxed custom-scrollbar" 
                    />
                 </div>

                 <button type="submit" disabled={isSaving} className="w-full mt-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl transition-all shadow-lg hover:-translate-y-0.5 active:translate-y-0 shadow-indigo-600/30 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed">
                    {isSaving ? (
                       <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Compiling Neural Brain...</>
                    ) : (
                       <><Save className="w-5 h-5" /> Compile & Deploy Brain to WhatsApp</>
                    )}
                 </button>
              </div>
           </form>
        </div>

        {/* Info Sidebar */}
        <div className="flex flex-col gap-6">
           <div className="bg-slate-900 p-6 rounded-3xl shadow-xl text-white relative overflow-hidden group">
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-indigo-500/30 rounded-full blur-3xl"></div>
              <div className="relative z-10">
                 <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-white/10 rounded-xl"><Zap className="w-5 h-5 text-indigo-300" /></div>
                    <h4 className="font-bold text-lg">AI vs Old Chatbots</h4>
                 </div>
                 <p className="text-sm text-slate-300 leading-relaxed mb-4">
                    Traditional platforms like AiSensy require you to build rigid "If-This-Then-That" flowcharts. 
                 </p>
                 <p className="text-sm text-slate-300 leading-relaxed">
                    <strong className="text-white">SaSLoop is infinitely smarter.</strong> Just copy-paste your menu in English. The AI instantly understands human context, handles typos, and remembers the conversation.
                 </p>
              </div>
           </div>

           <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200">
              <h4 className="font-bold text-slate-800 flex items-center gap-2 mb-4"><MessageSquare className="w-5 h-5 text-indigo-500" /> Auto-Responder Rules</h4>
              <ul className="text-sm text-slate-600 space-y-4 font-medium">
                 <li className="flex gap-3">
                   <div className="w-1.5 h-1.5 rounded-full bg-slate-300 shrink-0 mt-1.5" />
                   <p>The AI intercepts incoming WhatsApp messages and replies instantly.</p>
                 </li>
                 <li className="flex gap-3">
                   <div className="w-1.5 h-1.5 rounded-full bg-slate-300 shrink-0 mt-1.5" />
                   <p>If a question is outside the Bot Knowledge, it is instructed to gently inform the user that a human agent will assist them.</p>
                 </li>
                 <li className="flex gap-3">
                   <div className="w-1.5 h-1.5 rounded-full bg-slate-300 shrink-0 mt-1.5" />
                   <p>It processes all inquiries naturally without making up information (Zero Hallucination mode).</p>
                 </li>
              </ul>
              <div className="mt-5 p-3 bg-amber-50 rounded-xl border border-amber-100 flex items-start gap-2 text-amber-700 text-xs">
                 <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                 <p>Updates to the knowledge base take up to 10 seconds to fully compile across the global AI routing network.</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

export default BotConfig;
