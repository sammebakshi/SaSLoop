import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API_BASE from "../config";
import { Bot, Save, FileText, CheckCircle2, MessageSquare, AlertCircle, Zap, Terminal, ArrowLeft, QrCode, Copy, ExternalLink } from "lucide-react";

function BotConfig() {
  const [user, setUser] = useState(null);
  const [knowledge, setKnowledge] = useState("");
  const [systemPrompt, setSystemPrompt] = useState("You are a helpful and polite customer service assistant.");
  const [bizPhone, setBizPhone] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
        try {
            const token = localStorage.getItem("token");
            const impersonateId = sessionStorage.getItem("impersonate_id");
            const targetParam = impersonateId ? `?target_user_id=${impersonateId}` : "";
            const res = await fetch(`${API_BASE}/api/business/status${targetParam}`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.business) {
                setBizPhone(data.business.phone);
                setKnowledge(data.business.bot_knowledge || "");
                setUser(data.business);
            }
        } catch (e) {}
    };

    if (location.state && location.state.targetUser) {
       const u = location.state.targetUser;
       setUser(u);
       setBizPhone(u.phone || "");
       if (u.bot_knowledge) setKnowledge(u.bot_knowledge);
    } else {
       fetchData();
    }
  }, [location.state]);

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const token = localStorage.getItem("token");
      const impersonateId = sessionStorage.getItem("impersonate_id");
      const body = { 
        bot_knowledge: knowledge,
        target_user_id: impersonateId || undefined
      };
      
      const res = await fetch(`${API_BASE}/api/business/setup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });
      
      if (res.ok) {
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);
      } else {
        const err = await res.json();
        alert("Error saving: " + err.error);
      }
    } catch (err) {
      console.error(err);
      alert("Network error saving knowledge");
    } finally {
      setIsSaving(false);
    }
  };

  const cleanPhone = bizPhone.replace(/\D/g, "");
  const redirectMsg = "Hi! I need help with ordering.";
  const redirectUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(redirectMsg)}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(redirectUrl)}`;

  if (!user) return <div className="p-8 font-black uppercase text-slate-400 animate-pulse tracking-widest">Waking up the AI...</div>;

  return (
    <div className="flex flex-col h-full space-y-8 p-2 max-w-6xl mx-auto font-sans">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-[10px] font-black text-indigo-500 bg-indigo-50 px-3 py-1.5 rounded-lg w-fit mb-3 hover:bg-indigo-100 transition-colors uppercase tracking-widest"><ArrowLeft className="w-3.5 h-3.5" /> Dashboard</button>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">
             <Bot className="w-10 h-10 text-indigo-500 inline mr-2" /> AI Intelligence
          </h2>
          <p className="text-slate-500 mt-1 text-sm font-bold uppercase tracking-widest">Training the digital mind of <span className="text-indigo-600">{user.name || "your business"}</span>.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col gap-6">
           <form onSubmit={handleSave} className="bg-white p-8 rounded-[3rem] border-2 border-slate-100 shadow-xl shadow-slate-200/50 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-emerald-500" />
              {isSaved && (
                 <div className="absolute top-8 right-8 px-4 py-2 bg-emerald-50 border border-emerald-200 text-emerald-700 font-black text-[10px] uppercase tracking-widest rounded-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                    <CheckCircle2 className="w-4 h-4" /> Neural Network Synced
                 </div>
              )}
              
              <div className="space-y-8">
                 <div>
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 block flex items-center gap-2">
                       <Terminal className="w-4 h-4 text-indigo-500" /> AI Persona Instructions
                    </label>
                    <textarea 
                       required 
                       value={systemPrompt} 
                       onChange={e => setSystemPrompt(e.target.value)} 
                       className="w-full h-24 bg-slate-50 border-none rounded-[1.5rem] px-6 py-5 text-sm text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all outline-none resize-none font-bold italic" 
                       placeholder="You are a polite virtual assistant..."
                    />
                 </div>
                 
                 <div>
                    <div className="flex justify-between items-end mb-4">
                       <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                          <FileText className="w-4 h-4 text-indigo-500" /> Business Brain (Knowledge)
                       </label>
                    </div>
                    <textarea 
                       value={knowledge} 
                       onChange={e => setKnowledge(e.target.value)} 
                       placeholder="Paste your menu, FAQs, pricing, and rules here. The AI will learn it instantly." 
                       className="w-full h-80 bg-slate-50 border-none rounded-[2rem] px-6 py-6 text-sm text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all outline-none resize-none font-bold leading-relaxed custom-scrollbar shadow-inner" 
                    />
                 </div>

                 <button type="submit" disabled={isSaving} className="w-full bg-slate-900 hover:bg-indigo-600 text-white font-black py-5 rounded-[2rem] transition-all shadow-2xl hover:-translate-y-1 active:scale-95 uppercase text-xs tracking-[0.3em] flex items-center justify-center gap-3 disabled:opacity-50">
                    {isSaving ? "COMPILING NEURAL PATHS..." : "SAVE & TRAIN AI"}
                 </button>
              </div>
           </form>
        </div>

        {/* 🚀 AWAY MESSAGE REDIRECTOR */}
        <div className="flex flex-col gap-6">
           <div className="bg-gradient-to-br from-indigo-600 to-indigo-900 p-8 rounded-[3rem] shadow-2xl text-white relative overflow-hidden group">
              <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
              <div className="relative z-10">
                 <h4 className="font-black text-xl italic uppercase tracking-tight mb-4 flex items-center gap-2">
                    <Zap className="w-6 h-6 text-emerald-400" /> Human Redirect
                 </h4>
                 <p className="text-xs text-indigo-100/80 font-bold leading-relaxed mb-6">
                    Human not available on your personal number? Use an **Away Message** to send customers here!
                 </p>
                 
                 <div className="bg-white p-6 rounded-[2rem] mb-6 flex flex-col items-center">
                    <img src={qrUrl} alt="Away Redirect" className="w-32 h-32 mb-4" />
                    <p className="text-[9px] font-black text-indigo-900 uppercase tracking-widest mb-1">Redirection Link</p>
                    <p className="text-[10px] font-bold text-slate-400 truncate w-full text-center">{redirectUrl}</p>
                 </div>

                 <div className="space-y-3">
                    <button 
                        onClick={() => {
                            navigator.clipboard.writeText(`I'm currently busy! Please chat with our AI Assistant for instant help: ${redirectUrl}`);
                            alert("Copy-paste this into your WhatsApp 'Away Message' settings!");
                        }}
                        className="w-full py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all"
                    >
                        <Copy className="w-4 h-4" /> Copy Away Message
                    </button>
                    <a href={redirectUrl} target="_blank" rel="noreferrer" className="w-full py-3 bg-emerald-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-900/20">
                        <ExternalLink className="w-4 h-4" /> Test Link
                    </a>
                 </div>
              </div>
           </div>

           <div className="bg-white p-8 rounded-[3rem] border-2 border-slate-50 shadow-xl">
              <h4 className="font-black text-slate-900 uppercase italic tracking-tighter flex items-center gap-2 mb-6"><MessageSquare className="w-5 h-5 text-indigo-500" /> How it works</h4>
              <ul className="text-[10px] text-slate-500 space-y-4 font-bold uppercase tracking-widest">
                 <li className="flex gap-4">
                    <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[10px] shrink-0">1</div>
                    <p>Go to WhatsApp Settings on your personal phone.</p>
                 </li>
                 <li className="flex gap-4">
                    <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[10px] shrink-0">2</div>
                    <p>Tap **Business Tools** → **Away Message**.</p>
                 </li>
                 <li className="flex gap-4">
                    <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[10px] shrink-0">3</div>
                    <p>Paste the copied link above into the message.</p>
                 </li>
              </ul>
           </div>
        </div>
      </div>
    </div>
  );
}

export default BotConfig;
