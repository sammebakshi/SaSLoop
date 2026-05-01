import React, { useState, useEffect } from "react";
import { 
  Zap, Globe, MessageSquare, Code, Copy, CheckCircle2, 
  ExternalLink, Settings, Layout, Palette, Terminal, 
  FileSpreadsheet, Share2, Layers, MousePointer2
} from "lucide-react";
import API_BASE from "../config";

function Integrations() {
  const [biz, setBiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const [settings, setSettings] = useState({
    webhook_url: "",
    widget_color: "#25D366",
    widget_greeting: "Hi! How can we help you today?",
    widget_position: "right"
  });

  useEffect(() => {
    fetchBiz();
  }, []);

  const fetchBiz = async () => {
    try {
      const token = localStorage.getItem("token");
      const targetUserId = sessionStorage.getItem("impersonate_id");
      const targetParam = targetUserId ? `?target_user_id=${targetUserId}` : "";
      
      const res = await fetch(`${API_BASE}/api/business/status${targetParam}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.business) {
        setBiz(data.business);
        setSettings({
          webhook_url: data.business.settings?.webhook_url || "",
          widget_color: data.business.settings?.widget_color || "#25D366",
          widget_greeting: data.business.settings?.widget_greeting || "Hi! How can we help you today?",
          widget_position: data.business.settings?.widget_position || "right"
        });
      }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const targetUserId = sessionStorage.getItem("impersonate_id");
      const res = await fetch(`${API_BASE}/api/business/setup`, {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify({ 
            settings,
            target_user_id: targetUserId || undefined
        })
      });
      if (res.ok) {
        alert("Integrations updated successfully!");
      }
    } catch (e) { console.error(e); }
    finally { setSaving(false); }
  };

  const widgetSnippet = `<!-- SaSLoop WhatsApp Widget -->
<script src="${API_BASE}/api/public/widget/${biz?.id}"></script>
<!-- End SaSLoop WhatsApp Widget -->`;

  const copySnippet = () => {
    navigator.clipboard.writeText(widgetSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return <div className="p-10 text-center font-black uppercase text-slate-400 animate-pulse">Initializing Ecosystem...</div>;

  return (
    <div className="max-w-6xl mx-auto py-10 px-6 space-y-12 pb-32">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-5xl font-black text-slate-900 tracking-tighter italic uppercase underline decoration-indigo-500">
             Power Hub
          </h2>
          <p className="text-slate-500 font-bold uppercase text-xs tracking-[0.3em] mt-2">Scale your business with advanced integrations</p>
        </div>
        <button 
           onClick={handleSave}
           disabled={saving}
           className="px-10 py-5 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl shadow-indigo-100 hover:scale-105 transition-all flex items-center gap-2"
        >
          {saving ? "Syncing..." : <><Zap className="w-4 h-4 fill-white" /> Save All Integrations</>}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
         
         {/* Webhook Section */}
         <div className="bg-white p-10 rounded-[3.5rem] border-2 border-slate-50 shadow-sm space-y-8 group transition-all hover:shadow-2xl">
            <div className="flex items-center gap-5">
               <div className="w-16 h-16 bg-slate-900 text-white rounded-[1.5rem] flex items-center justify-center shadow-xl">
                  <Terminal className="w-8 h-8" />
               </div>
               <div>
                  <h3 className="text-2xl font-black text-slate-800 tracking-tight uppercase italic">Developer Webhooks</h3>
                  <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Real-time Data Sync</p>
               </div>
            </div>

            <p className="text-xs text-slate-400 font-bold leading-relaxed">
               Receive real-time notifications on your own server whenever an order is placed or a customer sends a message. Perfect for connecting to your own CRM or automation tools.
            </p>

            <div className="space-y-4">
               <div>
                  <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1 mb-2 block">Endpoint URL (POST)</label>
                  <input 
                    type="url" 
                    value={settings.webhook_url}
                    onChange={e => setSettings({...settings, webhook_url: e.target.value})}
                    placeholder="https://your-server.com/webhook"
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-xs font-bold text-slate-800 outline-none focus:border-indigo-500 focus:bg-white transition-all"
                  />
               </div>
               <div className="flex flex-wrap gap-2">
                  {['order.new', 'order.status_changed', 'message.incoming'].map(e => (
                    <span key={e} className="px-3 py-1 bg-slate-100 text-slate-400 rounded-lg text-[9px] font-black uppercase tracking-widest">{e}</span>
                  ))}
               </div>
            </div>
         </div>

         {/* Chat Widget Section */}
         <div className="bg-white p-10 rounded-[3.5rem] border-2 border-slate-50 shadow-sm space-y-8 group transition-all hover:shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -mr-16 -mt-16" />
            
            <div className="flex items-center gap-5">
               <div className="w-16 h-16 bg-emerald-500 text-white rounded-[1.5rem] flex items-center justify-center shadow-xl">
                  <MessageSquare className="w-8 h-8" />
               </div>
               <div>
                  <h3 className="text-2xl font-black text-slate-800 tracking-tight uppercase italic">Website Chat Widget</h3>
                  <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Convert Web Visitors</p>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
               <div className="space-y-4">
                  <div>
                    <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1 mb-2 block">Widget Color</label>
                    <div className="flex gap-2">
                        <input 
                           type="color" 
                           value={settings.widget_color}
                           onChange={e => setSettings({...settings, widget_color: e.target.value})}
                           className="w-12 h-12 rounded-xl border-none p-0 cursor-pointer overflow-hidden"
                        />
                        <input 
                           type="text"
                           value={settings.widget_color}
                           onChange={e => setSettings({...settings, widget_color: e.target.value})}
                           className="flex-1 bg-slate-50 border-2 border-slate-100 rounded-xl px-4 text-xs font-black uppercase"
                        />
                    </div>
                  </div>
               </div>
               <div className="space-y-4">
                  <div>
                    <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1 mb-2 block">Position</label>
                    <div className="flex bg-slate-100 p-1 rounded-xl">
                        <button 
                           onClick={() => setSettings({...settings, widget_position: 'left'})}
                           className={`flex-1 py-2 rounded-lg text-[9px] font-black uppercase ${settings.widget_position === 'left' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400'}`}
                        >Left</button>
                        <button 
                           onClick={() => setSettings({...settings, widget_position: 'right'})}
                           className={`flex-1 py-2 rounded-lg text-[9px] font-black uppercase ${settings.widget_position === 'right' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400'}`}
                        >Right</button>
                    </div>
                  </div>
               </div>
            </div>

            <div>
               <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1 mb-2 block">Greeting Message</label>
               <input 
                  type="text"
                  value={settings.widget_greeting}
                  onChange={e => setSettings({...settings, widget_greeting: e.target.value})}
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-xs font-bold"
               />
            </div>

            <div className="bg-slate-900 p-6 rounded-[2rem] relative">
               <div className="flex justify-between items-center mb-4">
                  <p className="text-[9px] font-black text-indigo-400 uppercase tracking-[0.2em]">Embed Snippet</p>
                  <button onClick={copySnippet} className="text-white/40 hover:text-white transition-colors">
                     {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
               </div>
               <code className="text-[10px] text-indigo-200 font-mono block break-all leading-relaxed opacity-80">
                  {widgetSnippet}
               </code>
            </div>
         </div>

         {/* Google Sheets Section */}
         <div className="bg-white p-10 rounded-[3.5rem] border-2 border-slate-50 shadow-sm space-y-8 group transition-all hover:shadow-2xl">
            <div className="flex items-center gap-5">
               <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-[1.5rem] flex items-center justify-center shadow-xl">
                  <FileSpreadsheet className="w-8 h-8" />
               </div>
               <div>
                  <h3 className="text-2xl font-black text-slate-800 tracking-tight uppercase italic">Google Sheets Sync</h3>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Zero-Code Export</p>
               </div>
            </div>

            <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 space-y-4">
               <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-500 fill-amber-500" /> Easy Setup via Pabbly/Zapier
               </h4>
               <p className="text-[11px] text-slate-400 font-bold leading-relaxed">
                  Use our **Webhooks** to send order data directly to Google Sheets. 
                  1. Copy your Webhook URL from Zapier.
                  2. Paste it in the **Developer Webhooks** section above.
                  3. Every new order will instantly appear in your Spreadsheet!
               </p>
               <a href="https://www.pabbly.com/connect/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline">
                  Get Started with Pabbly <ExternalLink className="w-3.5 h-3.5" />
               </a>
            </div>
         </div>

         {/* Chatbot Builder Section */}
         <div className="bg-slate-900 p-10 rounded-[3.5rem] shadow-2xl space-y-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-[100px] -mr-32 -mt-32" />
            
            <div className="flex items-center gap-5">
               <div className="w-16 h-16 bg-white/10 text-indigo-400 rounded-[1.5rem] flex items-center justify-center border border-white/10">
                  <Layers className="w-8 h-8" />
               </div>
               <div>
                  <h3 className="text-2xl font-black text-white tracking-tight uppercase italic">Visual Flow Builder</h3>
                  <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Drag-and-Drop Logic</p>
               </div>
            </div>

            <div className="relative h-48 bg-white/5 rounded-[2rem] border border-white/10 flex flex-col items-center justify-center gap-4 group">
               <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center animate-bounce shadow-2xl shadow-indigo-500/50">
                  <MousePointer2 className="w-6 h-6 text-white" />
               </div>
               <div className="text-center">
                  <p className="text-xs font-black text-white uppercase tracking-widest mb-1">Coming Q3 2026</p>
                  <p className="text-[10px] font-bold text-slate-500 uppercase">Designing the next-gen visual canvas</p>
               </div>
               
               {/* Decorative dots/nodes */}
               <div className="absolute top-10 left-10 w-3 h-3 bg-indigo-500/40 rounded-full" />
               <div className="absolute bottom-10 right-20 w-4 h-4 bg-emerald-500/40 rounded-full" />
               <div className="absolute top-20 right-10 w-2 h-2 bg-rose-500/40 rounded-full" />
            </div>

            <button disabled className="w-full py-4 bg-white/5 border border-white/10 text-white/40 rounded-xl font-black text-[10px] uppercase tracking-[0.3em] cursor-not-allowed">
               Request Beta Access
            </button>
         </div>

      </div>

      {/* Preview Widget Button (Fake preview for UI) */}
      <div className={`fixed bottom-10 ${settings.widget_position === 'right' ? 'right-10' : 'left-10'} z-[100] animate-bounce`}>
         <div className="w-16 h-16 rounded-full shadow-2xl flex items-center justify-center cursor-pointer" style={{ backgroundColor: settings.widget_color }}>
            <MessageSquare className="w-8 h-8 text-white" />
         </div>
         <div className="absolute bottom-20 bg-white p-4 rounded-2xl shadow-2xl border border-slate-100 w-48 text-[10px] font-bold text-slate-400">
            Preview of your live widget on customers' sites.
         </div>
      </div>
    </div>
  );
}

export default Integrations;
