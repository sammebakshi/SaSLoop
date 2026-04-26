import React, { useState, useEffect } from "react";
import { Upload, Users, Megaphone, Send, Plus, Target, CheckCircle2, AlertCircle, FileSpreadsheet, Bot, Loader2, Image as ImageIcon, Link2 } from "lucide-react";
import API_BASE, { isMobileDevice } from "../config";

function BroadcastHub() {
  const [csvFile, setCsvFile] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [message, setMessage] = useState("Hi {{name}},\n\nWe have an exclusive offer for you this weekend at our store!\n\nBest, \nSaSLoop Team");
  const [imageUrl, setImageUrl] = useState("");
  const [btnText, setBtnText] = useState("Order Now");
  const [btnUrl, setBtnUrl] = useState("");
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
      const payload = { 
        contacts: contacts, 
        message: message,
        imageUrl: imageUrl || null,
        button: btnText && btnUrl ? { text: btnText, url: btnUrl } : null
      };

      const res = await fetch(`${API_BASE}/api/whatsapp/broadcast`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(payload)
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
           <h2 className="text-2xl font-black text-slate-900 tracking-tight italic uppercase">Campaign Hub</h2>
           <p className="text-slate-500 mt-1 text-sm font-bold uppercase tracking-[0.1em] opacity-60">Rich Media & Precision Targeting</p>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-20">
        
        {/* Workspace */}
        <div className="lg:col-span-2 space-y-6">
           
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

           {/* Step 1: Audience */}
           <div className="bg-white p-6 rounded-[2.5rem] border-2 border-slate-50 shadow-xl shadow-slate-200/20 group transition-all hover:border-indigo-100">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-black text-sm italic">01</div>
                  <h3 className="text-xl font-black text-slate-800 tracking-tight uppercase italic">Audience Sync</h3>
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
                           alert("No contacts found in CRM.");
                        }
                    } catch (e) {}
                  }}
                  className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all shadow-sm flex items-center gap-2"
                >
                   <Users className="w-3.5 h-3.5" /> Pull CRM Leads
                </button>
              </div>
              
              <div className={`border-4 border-dashed rounded-[2rem] p-8 transition-all relative ${csvFile ? 'bg-indigo-50 border-indigo-200' : 'bg-slate-50 border-slate-100 hover:bg-white hover:border-indigo-200'}`}>
                 <input type="file" onChange={handleFileUpload} accept=".csv" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                 
                 {!csvFile ? (
                   <div className="flex flex-col items-center pointer-events-none">
                      <div className="w-16 h-16 bg-white shadow-xl rounded-2xl flex items-center justify-center mb-4 text-slate-300 group-hover:text-indigo-500 transition-all">
                         <Upload className="w-8 h-8" />
                      </div>
                      <p className="text-slate-800 font-black text-sm text-center uppercase tracking-widest italic">Upload CSV Contact List</p>
                      <p className="text-slate-400 text-[10px] font-bold mt-2 uppercase tracking-widest">Header Required: phone, name</p>
                   </div>
                 ) : (
                   <div className="flex flex-col items-center pointer-events-none">
                      <div className="w-16 h-16 bg-white shadow-xl rounded-2xl flex items-center justify-center mb-4 text-indigo-500 animate-bounce">
                         <FileSpreadsheet className="w-8 h-8" />
                      </div>
                      <p className="text-indigo-900 font-black text-base italic uppercase">{csvFile.name}</p>
                      <p className="text-indigo-600/60 text-[10px] font-black mt-1 uppercase tracking-widest">{contacts.length} Targets Ready</p>
                   </div>
                 )}
              </div>
           </div>

           {/* Step 2: Content Creative */}
           <div className="bg-white p-6 rounded-[2.5rem] border-2 border-slate-50 shadow-xl shadow-slate-200/20">
              <div className="flex items-center justify-between mb-6">
                 <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-black text-sm italic">02</div>
                    <h3 className="text-xl font-black text-slate-800 tracking-tight uppercase italic">Rich Creative</h3>
                 </div>
              </div>

              <div className="space-y-6">
                  {/* Image Attachment */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="relative">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Campaign Image URL</label>
                          <div className="relative group">
                              <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500" />
                              <input 
                                  type="text" 
                                  value={imageUrl} 
                                  onChange={e => setImageUrl(e.target.value)}
                                  placeholder="https://your-image.jpg"
                                  className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-4 text-xs font-bold focus:ring-2 focus:ring-indigo-500 transition-all"
                              />
                          </div>
                      </div>
                      <div className="relative">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">CTA Button URL</label>
                          <div className="relative group">
                              <Link2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500" />
                              <input 
                                  type="text" 
                                  value={btnUrl} 
                                  onChange={e => setBtnUrl(e.target.value)}
                                  placeholder="https://sasloop.com/order"
                                  className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-4 text-xs font-bold focus:ring-2 focus:ring-indigo-500 transition-all"
                              />
                          </div>
                      </div>
                  </div>

                  {/* Message Body */}
                  <div className="relative">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Message Body</label>
                      <textarea 
                          value={message}
                          onChange={e => setMessage(e.target.value)}
                          rows={4}
                          className="w-full bg-slate-50 border-none rounded-3xl px-6 py-5 text-slate-800 font-bold focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-inner resize-none custom-scrollbar text-sm"
                          placeholder="Wanna grab a discount? {{name}}..."
                      />
                  </div>

                  <button 
                    onClick={handleSend} 
                    disabled={isSending || contacts.length === 0 || !message} 
                    className="w-full h-16 bg-slate-900 hover:bg-indigo-600 text-white font-black text-sm uppercase tracking-[0.3em] italic rounded-[2rem] transition-all shadow-2xl shadow-indigo-100 disabled:opacity-30 flex items-center justify-center gap-3 active:scale-95"
                  >
                      {isSending ? (
                         <><Loader2 className="w-6 h-6 animate-spin" /> Deploying Blast...</>
                      ) : (
                         <><Send className="w-6 h-6" /> Blast Campaign Now</>
                      )}
                  </button>
                  <p className="text-center text-[10px] text-slate-400 font-black uppercase tracking-widest">
                     Estimated Cost: <span className="text-indigo-600">{contacts.length} Credits</span>
                  </p>
              </div>
           </div>
        </div>

        {/* Sidebar: Real-time Preview */}
        <div className="space-y-6">
           <div className="bg-[#E4DDD6] p-4 rounded-[3rem] shadow-2xl relative overflow-hidden h-[550px] border-[10px] border-slate-900 flex flex-col group">
              <div className="absolute top-0 left-0 w-full h-16 bg-[#075E54] flex items-center px-6 shadow-xl z-20">
                 <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center">
                       <Bot className="w-6 h-6 text-[#075E54]" />
                    </div>
                    <div>
                        <p className="text-white font-black text-xs uppercase tracking-widest leading-none italic">SaSLoop Bot</p>
                        <p className="text-emerald-400 text-[9px] font-black uppercase tracking-widest mt-1">Typing...</p>
                    </div>
                 </div>
              </div>
              
              <div className="absolute inset-0 opacity-[0.1] z-0 pointer-events-none bg-[url('https://i.pinimg.com/originals/1d/11/4a/1d114a229a1b8e6b9a8f0b733d9110b4.jpg')] bg-repeat" />

              <div className="mt-20 space-y-4 relative z-10 flex flex-col h-full pb-8">
                  {/* The Message Bubble */}
                  <div className="bg-white rounded-3xl rounded-tr-none shadow-xl max-w-[90%] self-end overflow-hidden border border-white/50">
                      {imageUrl && (
                          <img src={imageUrl} alt="Preview" className="w-full h-40 object-cover" />
                      )}
                      <div className="p-4">
                          <p className="text-[13px] text-slate-800 font-bold whitespace-pre-wrap leading-relaxed">
                            {message ? message.replace(/\{\{name\}\}/gi, "Alex") : "Creative content goes here..."}
                          </p>
                          <div className="flex items-center justify-end gap-1 mt-2">
                            <p className="text-[8px] text-slate-400 font-black uppercase">10:45 AM</p>
                            <CheckCircle2 className="w-3 h-3 text-sky-400" />
                          </div>
                      </div>
                      
                      {/* Button Preview */}
                      {btnUrl && (
                          <div className="bg-slate-50 border-t border-slate-100 p-3 flex items-center justify-center gap-2 text-indigo-600 font-black text-[11px] uppercase tracking-widest cursor-pointer hover:bg-slate-100 transition-colors">
                              <Target className="w-4 h-4" /> {btnText}
                          </div>
                      )}
                  </div>
              </div>
           </div>

           <div className="bg-white p-8 rounded-[2.5rem] border-2 border-slate-50 shadow-xl shadow-slate-200/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 rounded-full -mr-12 -mt-12" />
              <h4 className="font-black text-slate-900 uppercase tracking-[0.2em] text-[10px] flex items-center gap-3 mb-6">
                 <AlertCircle className="w-5 h-5 text-rose-500" /> Compliance Protocols
              </h4>
              <div className="space-y-4">
                 {[
                   'Images must be public URLs',
                   'Buttons require approved templates for cold leads',
                   'Maintain < 5% opt-out rate'
                 ].map((opt, i) => (
                    <div key={i} className="flex items-start gap-3 text-[10px] font-black uppercase text-slate-400">
                       <div className="w-1.5 h-1.5 bg-rose-400 rounded-full mt-1.5" /> {opt}
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
