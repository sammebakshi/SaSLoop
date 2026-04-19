import React, { useState, useEffect } from "react";
import API_BASE from "../config";
import { BookOpen, CheckCircle2, AlertCircle } from "lucide-react";

function FreeformKnowledge() {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
     name: "",
     phone: "",
     address: "",
     businessType: "other",
     bot_knowledge: "",
     settings: {}
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) setUser(JSON.parse(userData));

    const fetchStatus = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_BASE}/api/business/status`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const data = await res.json();
        setFormData({
            name: data.business?.name || "",
            phone: data.business?.phone || "",
            address: data.business?.address || "",
            businessType: data.business?.business_type || "other",
            bot_knowledge: data.bot_knowledge || "",
            settings: data.business?.settings || {}
        });
      } catch (err) {
        console.error("Failed to load business details", err);
      }
    };
    fetchStatus();
  }, []);

  const handleSave = async (e) => {
    if(e) e.preventDefault();
    setIsSaving(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/api/business/setup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
         setIsSaved(true);
         setTimeout(() => setIsSaved(false), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) return <div className="p-8 font-medium text-slate-500">Loading AI Brain...</div>;

  return (
    <div className="max-w-[1000px] mx-auto w-full pt-2 pb-12 h-full flex flex-col">
      <div className="flex justify-between items-end mb-8 shrink-0">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
             <BookOpen className="w-8 h-8 text-emerald-500" /> Freeform Knowledge
          </h2>
          <p className="text-slate-500 mt-1.5 text-sm font-medium leading-relaxed">
             This is your AI bot's long-term memory. Add rules, FAQs, and specialized logic.
          </p>
        </div>
        <button 
           onClick={handleSave} 
           disabled={isSaving} 
           className="bg-slate-900 shadow-xl shadow-emerald-200/20 hover:bg-black text-white px-8 py-4 rounded-2xl font-black text-sm transition-all flex items-center gap-2"
        >
           {isSaving ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
           {isSaved ? "BRAIN UPDATED" : "SAVE KNOWLEDGE"}
        </button>
      </div>

      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm relative overflow-hidden flex flex-col flex-1 min-h-[500px]">
         <div className="absolute top-0 w-full h-1.5 bg-emerald-500 left-0" />
         
         <div className="mb-6 p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-start gap-4">
            <div className="p-2 bg-white rounded-xl text-emerald-500 shadow-sm">
               <AlertCircle className="w-5 h-5" />
            </div>
            <div>
               <h4 className="text-sm font-bold text-slate-800 tracking-tight uppercase">AI Instruction Tip</h4>
               <p className="text-[11px] text-emerald-700/80 font-bold leading-relaxed mt-1">
                  Structure your data using bullet points for better accuracy. <br />
                  Example: "• Our delivery fee is $5 for distance over 2km" or "• Return window is 7 days."
               </p>
            </div>
         </div>

         <textarea 
            value={formData.bot_knowledge} 
            onChange={e => setFormData({...formData, bot_knowledge: e.target.value})} 
            placeholder="Start typing your business rules here..."
            className="flex-1 w-full bg-slate-50 border border-slate-100 rounded-[2rem] px-8 py-8 text-base font-bold text-slate-700 focus:bg-white focus:ring-8 focus:ring-emerald-500/5 outline-none transition-all resize-none shadow-inner leading-relaxed custom-scrollbar" 
         />
         
         <div className="mt-4 flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2">
            <div>Characters: {formData.bot_knowledge?.length || 0}</div>
            <div className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-emerald-500" /> Auto-Formatting Active</div>
         </div>
      </div>
    </div>
  );
}

export default FreeformKnowledge;
