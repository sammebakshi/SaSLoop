import React, { useState, useEffect } from "react";
import API_BASE from "../config";
import { QrCode, Download, Printer, Plus, Trash2, ExternalLink, ShoppingBag } from "lucide-react";

function QRManager() {
  const [user, setUser] = useState(null);
  const [tables, setTables] = useState(["1", "2", "3", "4", "5"]);
  const [newTable, setNewTable] = useState("");
  const [liveUrl, setLiveUrl] = useState(""); // ⬅️ NEW: Manual Live Link Override

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) setUser(JSON.parse(userData));
    // Try to auto-detect if we are on a tunnel
    if (window.location.hostname.includes("ngrok") || window.location.hostname.includes("onrender")) {
       setLiveUrl(window.location.origin);
    }
  }, []);

  const addTable = () => {
    if (!newTable || tables.includes(newTable)) return;
    setTables([...tables, newTable]);
    setNewTable("");
  };

  const removeTable = (t) => {
    setTables(tables.filter(tab => tab !== t));
  };

  // Base URL is the Live Link if provided, otherwise the current origin
  const baseUrl = liveUrl || window.location.origin;

  return (
    <div className="p-8 space-y-8 bg-slate-50 min-h-full">
      <div className="flex justify-between items-start">
        <div>
           <h2 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
              <QrCode className="w-8 h-8 text-indigo-500" /> QR Code Manager
           </h2>
           <p className="text-slate-500 mt-1.5 text-sm font-medium leading-relaxed">
              Generate unique QR codes. Use a **Live URL** to test on your phone.
           </p>
        </div>

        {/* Live URL Input Box */}
        <div className="bg-white p-4 rounded-3xl shadow-lg border-2 border-indigo-100 flex items-center gap-3 w-80">
           <ExternalLink className="w-5 h-5 text-indigo-500" />
           <div className="flex-1">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Public Live URL</p>
              <input 
                 value={liveUrl} 
                 onChange={e => setLiveUrl(e.target.value)} 
                 placeholder="https://your-ngrok-link.com" 
                 className="w-full bg-transparent text-xs font-bold text-slate-700 outline-none" 
              />
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         
         {/* Table Management */}
         <div className="lg:col-span-1 space-y-6">
            <div className="bg-[#0f172a] p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
               <div className="relative z-10">
                  <div className="w-12 h-12 bg-emerald-500/20 rounded-2xl flex items-center justify-center mb-6">
                     <ShoppingBag className="w-6 h-6 text-emerald-400" />
                  </div>
                  <p className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.3em] mb-1">GLOBAL ACCESS</p>
                  <h3 className="text-xl font-black text-white mb-2">Online Order QR</h3>
                  <p className="text-slate-400 text-xs font-medium mb-6">Use this for Home Delivery stickers, Instagram, or Flyers. No table number attached.</p>
                  
                  {(() => {
                     const onlineUrl = `${baseUrl}/online/${user?.id || '50'}/0`;
                     const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(onlineUrl)}`;
                     return (
                        <div className="flex flex-col items-center">
                           <div className="bg-white p-4 rounded-3xl mb-6">
                              <img src={qrUrl} alt="Online QR" className="w-32 h-32" />
                           </div>
                           <div className="flex gap-3 w-full">
                              <a href={qrUrl} download="Online_Order_QR.png" className="flex-1 bg-emerald-500 text-white py-3 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-emerald-600 transition-all">
                                 <Download className="w-3.5 h-3.5" /> Save QR
                              </a>
                           </div>
                        </div>
                     );
                  })()}
               </div>
               <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-emerald-600/10 rounded-full blur-3xl" />
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100">
               <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-6">Add New Table</h3>
               <div className="flex gap-3">
                  <input 
                    type="text"
                    value={newTable}
                    onChange={(e) => setNewTable(e.target.value)}
                    placeholder="Table #"
                    className="flex-1 bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-800 outline-none focus:border-indigo-500 transition-all"
                  />
                  <button onClick={addTable} className="bg-indigo-600 text-white p-4 rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
                     <Plus className="w-6 h-6" />
                  </button>
               </div>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100">
               <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-6">Current Tables</h3>
               <div className="space-y-3">
                  {tables.map(t => (
                     <div key={t} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl group">
                        <span className="font-black text-slate-700 uppercase tracking-tighter">Table {t}</span>
                        <button onClick={() => removeTable(t)} className="text-rose-400 opacity-0 group-hover:opacity-100 transition-all hover:text-rose-600">
                           <Trash2 className="w-4 h-4" />
                        </button>
                     </div>
                  ))}
               </div>
            </div>
         </div>

         {/* QR Grid */}
         <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {tables.map(t => {
                  const menuUrl = `${baseUrl}/menu/${user?.id || '50'}/${t}`;
                  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(menuUrl)}`;
                  
                  return (
                     <div key={t} className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 flex flex-col items-center group relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4">
                           <a href={menuUrl} target="_blank" rel="noreferrer" className="text-slate-300 hover:text-indigo-500 transition-all">
                              <ExternalLink className="w-4 h-4" />
                           </a>
                        </div>
                        
                        <div className="w-full text-center mb-6">
                           <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em] mb-1">SCAN TO ORDER</p>
                           <h4 className="text-3xl font-black text-slate-800 tracking-tighter">TABLE {t}</h4>
                        </div>
                        
                        <div className="bg-slate-50 p-6 rounded-[2rem] border-2 border-dashed border-slate-200 mb-8 w-fit mx-auto">
                           <img src={qrUrl} alt={`Table ${t} QR`} className="w-40 h-40 mix-blend-multiply" />
                        </div>
                        
                        <div className="flex gap-4 w-full">
                           <button onClick={() => window.print()} className="flex-1 bg-slate-100 text-slate-600 p-4 rounded-3xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-200 transition-all">
                              <Printer className="w-4 h-4" /> Print
                           </button>
                           <a href={qrUrl} download={`Table_${t}_QR.png`} className="flex-1 bg-indigo-600 text-white p-4 rounded-3xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
                              <Download className="w-4 h-4" /> Save
                           </a>
                        </div>
                     </div>
                  );
               })}
            </div>
         </div>

      </div>
    </div>
  );
}

export default QRManager;
