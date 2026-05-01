import React, { useState, useEffect } from "react";
import { 
  Sparkles, Image as ImageIcon, Send, ArrowRight, 
  Target, Users, Zap, MessageSquare, Download, Share2, 
  Trash2, Plus, Wand2, Rocket
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import API_BASE from "../config";

const MarketingStudio = () => {
  const [goal, setGoal] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [campaign, setCampaign] = useState(null);
  const [recentCampaigns, setRecentCampaigns] = useState([]);

  const generateCampaign = async () => {
    if (!goal.trim()) return;
    setIsGenerating(true);
    try {
      const token = localStorage.getItem("token");
      // Use the analytics/suggestions logic or a new dedicated endpoint
      const res = await fetch(`${API_BASE}/api/analytics/consultant`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ prompt: `Generate a WhatsApp marketing campaign for this goal: ${goal}. Provide a catchy Headline, Body text with emojis, and an Image Prompt for an AI image generator.` })
      });
      const data = await res.json();
      
      // Parse the AI reply (mocking structured parsing for now)
      setCampaign({
        headline: "Special Offer Just for You! 🎁",
        body: data.reply.substring(0, 300) + "...",
        imagePrompt: goal,
        imageUrl: null
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateImage = async () => {
    if (!campaign) return;
    setIsGenerating(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/api/analytics/generate-image`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ prompt: campaign.imagePrompt })
      });
      const data = await res.json();
      if (data.url) {
        setCampaign(prev => ({ ...prev, imageUrl: data.url }));
      }
    } catch (err) {
      alert("Image generation failed. Ensure your Gemini API is active.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8 space-y-8">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter italic flex items-center gap-3">
            <Rocket className="w-10 h-10 text-rose-500" /> Marketing Studio
          </h2>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.3em] mt-1">High-Conversion AI Campaigns • WhatsApp First</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* CAMPAIGN CREATOR */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white p-10 rounded-[3rem] shadow-2xl shadow-slate-200/50 border border-slate-100">
            <h3 className="font-black text-xl text-slate-900 tracking-tighter mb-6 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-500" /> What's your campaign goal?
            </h3>
            <textarea 
              value={goal}
              onChange={e => setGoal(e.target.value)}
              placeholder="e.g. Clear out 50 croissants by offering a 1+1 deal to existing customers."
              className="w-full bg-slate-50 border border-slate-100 rounded-[2rem] p-8 text-sm font-medium focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all h-32 mb-6"
            />
            <button 
              onClick={generateCampaign}
              disabled={isGenerating || !goal.trim()}
              className="w-full py-5 bg-slate-900 text-white rounded-[2rem] font-black uppercase text-xs tracking-widest flex items-center justify-center gap-3 shadow-xl hover:bg-black transition-all active:scale-95 disabled:opacity-50"
            >
              {isGenerating ? <Zap className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />} 
              Draft Campaign with AI
            </button>
          </div>

          <AnimatePresence>
            {campaign && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-10 rounded-[3rem] shadow-2xl shadow-slate-200/50 border border-indigo-100 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl" />
                
                <div className="space-y-6 relative z-10">
                   <div className="flex justify-between items-center">
                      <span className="px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-[9px] font-black uppercase tracking-widest">AI Draft Ready</span>
                      <button onClick={() => setCampaign(null)} className="text-slate-300 hover:text-rose-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                   </div>
                   
                   <div>
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2 block">Campaign Copy</label>
                      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                         <h4 className="font-black text-slate-900 mb-2">{campaign.headline}</h4>
                         <p className="text-slate-600 text-xs font-medium leading-relaxed whitespace-pre-wrap">{campaign.body}</p>
                      </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                         <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block">AI Visual</label>
                         {campaign.imageUrl ? (
                            <div className="aspect-square rounded-3xl overflow-hidden border border-slate-100 shadow-inner">
                               <img src={`${API_BASE}${campaign.imageUrl}`} className="w-full h-full object-cover" />
                            </div>
                         ) : (
                            <button 
                              onClick={generateImage}
                              disabled={isGenerating}
                              className="w-full aspect-square bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center gap-3 text-slate-400 hover:bg-indigo-50 hover:border-indigo-200 transition-all"
                            >
                               <ImageIcon className="w-8 h-8 opacity-20" />
                               <span className="text-[10px] font-black uppercase tracking-widest">Generate Visual</span>
                            </button>
                         )}
                      </div>
                      <div className="flex flex-col justify-end gap-4">
                         <button className="w-full py-4 bg-white border border-slate-200 text-slate-700 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 hover:bg-slate-50 transition-all">
                            <Download className="w-4 h-4" /> Save Assets
                         </button>
                         <button className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 shadow-xl shadow-emerald-100 hover:bg-emerald-700 transition-all">
                            <Send className="w-4 h-4" /> Blast on WhatsApp
                         </button>
                      </div>
                   </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* STATS & TIPS */}
        <div className="lg:col-span-5 space-y-8">
           <div className="bg-slate-900 p-10 rounded-[3rem] text-white relative overflow-hidden">
              <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl" />
              <h4 className="text-rose-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6">Audience Intel</h4>
              <div className="space-y-6">
                 <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-xs font-bold">VIP Tribe</span>
                    <span className="font-black text-xl">428</span>
                 </div>
                 <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-xs font-bold">At-Risk Customers</span>
                    <span className="font-black text-xl text-rose-400">12</span>
                 </div>
                 <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-xs font-bold">New Prospects</span>
                    <span className="font-black text-xl text-indigo-400">84</span>
                 </div>
              </div>
           </div>

           <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
              <h4 className="text-slate-900 font-black text-lg tracking-tighter mb-6">Marketing Tips</h4>
              <div className="space-y-6">
                 {[
                   { icon: Zap, text: "Keep messages under 160 characters for best engagement." },
                   { icon: Target, text: "Personalize with names — it increases conversion by 30%." },
                   { icon: MessageSquare, text: "Always include a clear Call to Action (CTA)." },
                 ].map((tip, i) => (
                   <div key={i} className="flex gap-4">
                      <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400 shrink-0"><tip.icon className="w-4 h-4" /></div>
                      <p className="text-xs font-medium text-slate-500 leading-relaxed">{tip.text}</p>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default MarketingStudio;
