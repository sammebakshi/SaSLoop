import React, { useState, useEffect } from "react";
import { Upload, Users, Megaphone, Send, Plus, Target, CheckCircle2, AlertCircle, FileSpreadsheet, Bot, Loader2, Info } from "lucide-react";
import API_BASE, { isMobileDevice } from "../config";

function BroadcastHub() {
  const [csvFile, setCsvFile] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [message, setMessage] = useState("Hi {{name}},\n\nWe have an exclusive offer for you this weekend at our store!\n\nBest, \nSaSLoop Team");
  const [credits, setCredits] = useState(0);
  const [isSending, setIsSending] = useState(false);
  const [successResponse, setSuccessResponse] = useState(null);
  const [errorResponse, setErrorResponse] = useState(null);
  const isMobile = isMobileDevice();

  useEffect(() => {
    fetchCredits();
  }, []);

  const fetchCredits = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/whatsapp/wallet`, {
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
      });
      const data = await res.json();
      setCredits(data.credits || 0);
    } catch (err) {
      console.error("Wallet Error:", err);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCsvFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target.result;
        parseCSV(text);
      };
      reader.readAsText(file);
    }
  };

  const parseCSV = (text) => {
    const lines = text.split("\n").filter(l => l.trim().length > 0);
    if (lines.length < 2) return;
    const headers = lines[0].split(",").map(h => h.trim().toLowerCase());
    const phoneIdx = headers.indexOf("phone");
    const nameIdx = headers.indexOf("name");
    if (phoneIdx === -1) {
        alert("CSV must contain a 'phone' column.");
        return;
    }
    const parsed = lines.slice(1).map(line => {
        const cols = line.split(",").map(c => c.trim());
        return {
            phone: cols[phoneIdx],
            name: nameIdx !== -1 ? cols[nameIdx] : "Customer"
        };
    }).filter(c => c.phone);
    setContacts(parsed);
  };

  const handleSend = async () => {
    setIsSending(true);
    setSuccessResponse(null);
    setErrorResponse(null);
    try {
      const res = await fetch(`${API_BASE}/api/whatsapp/broadcast`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ contacts: contacts, message: message })
      });
      const data = await res.json();
      if (res.ok) {
        setSuccessResponse(data.message);
        setCredits(data.remainingBal);
        setCsvFile(null);
        setContacts([]);
      } else {
        setErrorResponse(data.error || "Broadcast failed.");
      }
    } catch (err) {
      setErrorResponse("Network error. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex flex-col h-full space-y-4 p-2 max-w-7xl mx-auto animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h2 className="text-2xl font-black text-slate-900 tracking-tight">Campaign Center</h2>
           <p className="text-slate-500 mt-1 text-sm font-bold uppercase tracking-[0.1em] opacity-60">Outbound Intelligence & Engagement</p>
        </div>
        <div className="flex items-center gap-3 bg-white p-2 pl-4 pr-3 rounded-2xl border border-slate-100 shadow-sm">
           <div className="flex flex-col items-end">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Wallet Power</p>
              <p className="text-lg font-black text-indigo-600">{credits.toLocaleString()} <span className="text-[10px] text-slate-400">CREDITS</span></p>
           </div>
           <button className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm">
              <Plus className="w-5 h-5" />
           </button>
        </div>
      </div>

      {/* Stats Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="bg-white border-2 border-slate-100 p-4 rounded-2xl shadow-xl shadow-slate-200/50 flex flex-col items-center justify-center relative group overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
             <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl mb-4 relative z-10 transition-transform group-hover:scale-110">
                <Megaphone className="w-8 h-8" />
             </div>
             <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-1 relative z-10">Available Credits</p>
             <h3 className="text-2xl font-black text-slate-800 tracking-tighter relative z-10">{credits}</h3>
             <button onClick={() => window.location.href='/recharge'} className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-100 hover:bg-black transition-all active:scale-95 relative z-10">
                Top Up Hub
             </button>
          </div>
         
         <div className="bg-white p-4 rounded-2xl border border-slate-50 shadow-xl shadow-slate-200/50 flex flex-col justify-between group overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-125" />
            <div className="flex items-center gap-4 mb-6">
               <div className="p-3.5 bg-emerald-50 text-emerald-500 rounded-2xl"><Target className="w-6 h-6" /></div>
               <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Avg Conversion</p>
            </div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">84.2%</h3>
            <p className="text-xs font-bold text-slate-400 mt-2 uppercase">WhatsApp Read Rate</p>
         </div>

         <div className="bg-white p-4 rounded-2xl border border-slate-50 shadow-xl shadow-slate-200/50 flex flex-col justify-between group overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-125" />
            <div className="flex items-center gap-4 mb-6">
               <div className="p-3.5 bg-amber-50 text-amber-500 rounded-2xl"><Users className="w-6 h-6" /></div>
               <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Global Reach</p>
            </div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">12.4k</h3>
            <p className="text-xs font-bold text-slate-400 mt-2 uppercase">Active Contacts</p>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pb-20">
        
        {/* Workspace */}
        <div className="lg:col-span-2 space-y-4">
           
           {successResponse && (
              <div className="p-6 bg-emerald-500 text-white font-black text-sm rounded-3xl flex items-center gap-4 shadow-xl shadow-emerald-200 animate-in zoom-in duration-300">
                 <div className="p-2 bg-white/20 rounded-full"><CheckCircle2 className="w-6 h-6" /></div>
                 <div>
                    <p className="uppercase tracking-widest">Campaign Deployed</p>
                    <p className="opacity-90 font-bold">{successResponse}</p>
                 </div>
              </div>
           )}

           {errorResponse && (
              <div className="p-6 bg-rose-500 text-white font-black text-sm rounded-3xl flex items-center gap-4 shadow-xl shadow-rose-200 animate-in zoom-in duration-300">
                 <div className="p-2 bg-white/20 rounded-full"><AlertCircle className="w-6 h-6" /></div>
                 <div>
                    <p className="uppercase tracking-widest">Blast Prevented</p>
                    <p className="opacity-90 font-bold">{errorResponse}</p>
                 </div>
              </div>
           )}

           {/* Step 1: Data */}
           <div className="bg-white p-5 rounded-3xl border border-slate-50 shadow-2xl shadow-slate-200/30 group">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-slate-900 text-white rounded-xl flex items-center justify-center font-black text-xs">1</div>
                  <h3 className="text-lg font-black text-slate-800 tracking-tight">Target Audience</h3>
                </div>
                <button 
                  onClick={async () => {
                    try {
                        const impersonateId = sessionStorage.getItem("impersonate_id");
                        const targetParam = impersonateId ? `?target_user_id=${impersonateId}` : "";
                        const res = await fetch(`${API_BASE}/api/crm/marketing-contacts${targetParam}`, {
                           headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
                        });
                        const data = await res.json();
                        if (res.ok && data.length > 0) {
                           setContacts(data.map(c => ({ phone: c.phone, name: c.name })));
                           setCsvFile({ name: `${data.length} CRM Contacts Synced` });
                        } else {
                           alert("No automated contacts found yet. Once customers order via WhatsApp, they will appear here.");
                        }
                    } catch (e) {}
                  }}
                  className="text-[9px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg flex items-center gap-2 hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                >
                   <Users className="w-3 h-3" /> Sync Loyalists
                </button>
              </div>
              
              <div className={`border-2 border-dashed rounded-2xl p-6 transition-all relative ${csvFile ? 'bg-indigo-50 border-indigo-200' : 'bg-slate-50 border-slate-100 hover:bg-white hover:border-indigo-200'}`}>
                 <input type="file" onChange={handleFileUpload} accept=".csv" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                 
                 {!csvFile ? (
                   <div className="flex flex-col items-center pointer-events-none">
                      <div className="w-12 h-12 bg-white shadow-xl rounded-xl flex items-center justify-center mb-3 text-slate-300 group-hover:text-indigo-500 transition-all">
                         <Upload className="w-6 h-6" />
                      </div>
                      <p className="text-slate-800 font-black text-sm text-center uppercase tracking-tighter">Drop CSV Contact List</p>
                      <p className="text-slate-400 text-[8px] font-bold mt-1 uppercase tracking-widest text-center">Required Columns: <span className="text-slate-900">phone, name</span></p>
                   </div>
                 ) : (
                   <div className="flex flex-col items-center pointer-events-none">
                      <div className="w-12 h-12 bg-white shadow-xl rounded-xl flex items-center justify-center mb-3 text-indigo-500">
                         <FileSpreadsheet className="w-6 h-6" />
                      </div>
                      <p className="text-indigo-900 font-black text-sm">{csvFile.name}</p>
                      <p className="text-indigo-600/60 text-[8px] font-black mt-1 uppercase tracking-widest">{contacts.length} Valid Targets Loaded</p>
                   </div>
                 )}
              </div>
           </div>

           {/* Step 2: Creative */}
           <div className="bg-white p-5 rounded-3xl border border-slate-50 shadow-2xl shadow-slate-200/30">
              <div className="flex items-center justify-between mb-4">
                 <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-slate-900 text-white rounded-xl flex items-center justify-center font-black text-xs">2</div>
                    <h3 className="text-lg font-black text-slate-800 tracking-tight">Message Creative</h3>
                 </div>
                 <button className="text-[9px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg flex items-center gap-2 hover:bg-indigo-600 hover:text-white transition-all">
                    <Bot className="w-3 h-3" /> AI Enhance
                 </button>
              </div>

              <div className="relative">
                 <textarea 
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    rows={4}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-800 font-bold focus:bg-white focus:border-indigo-500 outline-none transition-all shadow-inner resize-none custom-scrollbar text-xs"
                    placeholder="Wanna grab a discount? {{name}}..."
                 />
              </div>

              <div className="mt-6">
                 <button 
                  onClick={handleSend} 
                  disabled={isSending || contacts.length === 0 || !message} 
                  className="w-full h-14 bg-slate-900 hover:bg-indigo-600 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl transition-all shadow-xl disabled:opacity-30 flex items-center justify-center gap-3"
                 >
                    {isSending ? (
                       <><Loader2 className="w-5 h-5 animate-spin" /> Blasting...</>
                    ) : (
                       <><Send className="w-5 h-5" /> Drop Campaign Now</>
                    )}
                 </button>
                 <p className="text-center mt-3 text-[8px] text-slate-300 font-black uppercase tracking-widest">
                    Cost: {contacts.length} credits
                 </p>
              </div>
           </div>
        </div>

        {/* Sidebar: Reality Preview */}
        <div className="space-y-4">
           <div className="bg-slate-200 p-4 rounded-3xl shadow-inner relative overflow-hidden h-[400px] border-4 border-white flex flex-col group">
              <div className="absolute top-0 left-0 w-full h-16 bg-[#075E54] flex items-center px-6 shadow-xl z-20">
                 <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center">
                       <Bot className="w-6 h-6 text-[#075E54]" />
                    </div>
                    <div>
                        <p className="text-white font-black text-xs uppercase tracking-widest leading-none">AI Agent</p>
                        <p className="text-emerald-400 text-[9px] font-bold uppercase tracking-widest">Online</p>
                    </div>
                 </div>
              </div>
              
              <div className="absolute inset-0 opacity-[0.05] z-0 pointer-events-none" style={{ backgroundImage: "url('https://camo.githubusercontent.com/956c3aa0eab0ab19abcf8ab5d9afb762888cf32b9044cf0c0ef4fcf5faefc928/68747470733a2f2f7765622e77686174736170702e636f6d2f696d672f62672d636861742d74696c652d6461726b5f61346265353132653731393562366237333364393131306234303866303735642e706e67')" }}></div>

              <div className="mt-20 bg-white p-6 rounded-[2rem] rounded-tr-none shadow-xl relative z-10 self-end max-w-[90%] transform transition-transform group-hover:translate-x-1 duration-500">
                 <p className="text-sm text-slate-800 font-bold whitespace-pre-wrap leading-relaxed italic">
                    {message ? message.replace(/\{\{name\}\}/gi, "Alex") : "Waiting for creative content..."}
                 </p>
                 <div className="flex items-center justify-end gap-1 mt-2">
                    <p className="text-[9px] text-slate-400 font-black uppercase">10:45 AM</p>
                    <CheckCircle2 className="w-3 h-3 text-sky-400" />
                 </div>
              </div>
           </div>

           <div className="bg-white p-5 rounded-3xl border border-slate-50 shadow-xl shadow-slate-200/40 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-150" />
              <h4 className="font-black text-slate-900 uppercase tracking-[0.15em] text-xs flex items-center gap-3 mb-6">
                 <AlertCircle className="w-5 h-5 text-rose-500" /> Compliance Protocols
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed font-bold mb-6">
                 Messages sent via SaSLoop are monitored by Meta AI. High opt-out rates can lead to account suspension.
              </p>
              <div className="space-y-2">
                 {['No unsolicited links', 'Clear opt-out instructions', 'Max 10k messages per drop'].map((opt, i) => (
                    <div key={i} className="flex items-center gap-3 text-[10px] font-black uppercase text-slate-400">
                       <div className="w-1.5 h-1.5 bg-rose-400 rounded-full" /> {opt}
                    </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

export default BroadcastHub;
